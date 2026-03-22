---
title: Android 모범 사례
---

이 가이드는 메모리 관리, 보안 및 Hilt로부터의 마이그레이션을 위한 Android 전용 모범 사례를 다룹니다.

:::info
일반적인 모듈 개념은 **[모듈](/docs/reference/koin-core/modules)**을 참고하세요. 스코핑에 대해서는 **[스코프](/docs/reference/koin-core/scopes)** 및 **[Android 스코프](/docs/reference/koin-android/scope)**를 참고하세요.
:::

## 메모리 관리

### Activity/Fragment 누수 방지

```kotlin
// ❌ 나쁨 - Activity 누수
module {
    single { SomeService(get<Activity>()) }  // 싱글톤에 Activity 참조가 포함됨!
}

// ✅ 좋음 - 애플리케이션 컨텍스트 사용
module {
    single { SomeService(androidContext()) }  // 애플리케이션 컨텍스트, 안전함
}

// ✅ 좋음 - activity 스코프 사용
module {
    activityScope {
        scoped { SomeService(/* activity 스코프 의존성 */) }
    }
}
```

### 스코프를 올바르게 닫기

```kotlin
// ✅ 좋음 - 자동 스코프 관리
class MyActivity : ScopeActivity() {
    override val scope: Scope by activityScope()
    // onDestroy에서 스코프가 자동으로 닫힘
}

// ❌ 나쁨 - 정리 작업 없는 수동 스코프
class MyActivity : AppCompatActivity() {
    private val myScope = createScope<MyActivity>()
    // 스코프가 닫히지 않음 - 메모리 누수 발생!
}

// ✅ 좋음 - 정리 작업을 포함한 수동 스코프
class MyActivity : AppCompatActivity() {
    private lateinit var myScope: Scope

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        myScope = createScope<MyActivity>()
    }

    override fun onDestroy() {
        myScope.close()
        super.onDestroy()
    }
}
```

### 수명이 긴 객체의 참조 해제하기

```kotlin
// ❌ 나쁨 - UI에 대한 참조 유지
class UserRepository {
    private val listeners = mutableListOf<UserUpdateListener>()  // Activity 참조를 보유할 수 있음

    fun addListener(listener: UserUpdateListener) {
        listeners.add(listener)
    }
}

// ✅ 좋음 - 약한 참조(Weak references) 또는 수동 정리
class UserRepository {
    private val listeners = mutableListOf<WeakReference<UserUpdateListener>>()

    fun addListener(listener: UserUpdateListener) {
        listeners.add(WeakReference(listener))
    }

    fun removeListener(listener: UserUpdateListener) {
        listeners.removeAll { it.get() == listener || it.get() == null }
    }
}
```

## Android 디버깅

### Android 로거(Logger) 활성화

```kotlin
startKoin {
    androidLogger(Level.DEBUG)  // 모든 Koin 동작 확인
    androidContext(this@MyApplication)
    modules(appModules)
}
```

### 디버그 빌드에서 모듈 검증

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@MyApplication)
            modules(allModules)
        }

        // 대신 단위 테스트에서 verify()를 사용하세요
        // appModule.verify()
    }
}
```

### 디버깅을 위한 스코프 콜백

```kotlin
class DebugActivity : ScopeActivity() {
    override val scope: Scope by activityScope()

    init {
        scope.registerCallback(object : ScopeCallback {
            override fun onScopeClose(scope: Scope) {
                Log.d("Koin", "Scope ${scope.id} closing")
            }
        })
    }
}
```

## 보안 모범 사례

### 모듈에 비밀 정보를 저장하지 마세요

```kotlin
// ❌ 나쁨 - 하드코딩된 비밀 정보
module {
    single {
        Retrofit.Builder()
            .addInterceptor { chain ->
                chain.proceed(
                    chain.request().newBuilder()
                        .header("API-Key", "super-secret-key")  // 안 됩니다!
                        .build()
                )
            }
            .build()
    }
}

// ✅ 좋음 - 안전한 저장소의 비밀 정보
module {
    single {
        val securePrefs = get<SecurePreferences>()
        Retrofit.Builder()
            .addInterceptor(AuthInterceptor(securePrefs))
            .build()
    }
}
```

## Dagger/Hilt로부터의 마이그레이션

:::info
Koin은 `jakarta.inject`의 JSR-330 어노테이션(`@Singleton`, `@Inject`, `@Named`)을 지원합니다. 익숙한 어노테이션을 계속 사용할 수 있습니다. [JSR-330 호환성](/docs/reference/koin-android/jsr330)을 참고하세요.
:::

### 어노테이션 매핑

| Hilt | Koin 어노테이션 |
|------|------------------|
| `@Singleton` | `@Singleton` (JSR-330 호환) |
| `@Provides` | `@Factory` |
| `@Binds` | `@Singleton ... bind Interface::class` |
| `@Inject` | `@Inject` (JSR-330 호환) |
| `@HiltViewModel` | `@KoinViewModel` |
| `@InstallIn(SingletonComponent)` | `@Module` + `@ComponentScan` |
| `@InstallIn(ActivityComponent)` | `@Scope(ActivityScope::class)` |

### 마이그레이션 예시

```kotlin
// 변경 전 (Hilt)
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel()

@Singleton
class UserRepositoryImpl @Inject constructor(
    private val api: ApiService
) : UserRepository

// 변경 후 (Koin) - 최소한의 변경!
@KoinViewModel
class HomeViewModel(
    private val repository: UserRepository
) : ViewModel()

@Singleton  // JSR-330 계속 사용 가능
class UserRepositoryImpl(
    private val api: ApiService
) : UserRepository
```

### 모듈 마이그레이션

```kotlin
// 변경 전 (Hilt)
@InstallIn(SingletonComponent::class)
@Module
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder().build()
}

// 변경 후 (Koin 어노테이션)
@Module
class NetworkModule {
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder().build()
}
```

### 단계적 마이그레이션

```kotlin
// 1단계: 새로운 기능을 위해 Hilt와 함께 Koin 추가
@KoinViewModel
class NewFeatureViewModel(
    private val repository: NewFeatureRepository
) : ViewModel()

@Singleton
class NewFeatureRepository(private val api: ApiService)

// 2단계: 기존 기능을 하나씩 마이그레이션
@Singleton
class MigratedRepository(private val api: ApiService) : UserRepository

// 3단계: 마이그레이션이 완료되면 Hilt 제거
```

## 함께 보기

- **[스코프](/docs/reference/koin-core/scopes)** - 핵심 스코핑 개념
- **[Android 스코프](/docs/reference/koin-android/scope)** - Android 수명 주기 스코프
- **[테스트](/docs/reference/koin-android/instrumented-testing)** - Android 테스트 가이드
- **[멀티 모듈 앱](/docs/reference/koin-android/multi-module)** - Android 모듈 구성하기