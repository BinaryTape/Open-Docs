---
title: 멀티 모듈 안드로이드 앱
---

이 가이드는 Koin을 사용한 멀티 모듈 아키텍처의 안드로이드 관련 측면을 다룹니다.

:::info
핵심 모듈 개념(`includes()`, 구성, 오버라이드)에 대해서는 [모듈(Modules)](/docs/reference/koin-core/modules)을 참조하세요.
:::

## 안드로이드 애플리케이션 설정

### 어노테이션(Annotations) 사용 시

```kotlin
@KoinApplication(AppModule::class)
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin<MyApplication> {
            androidLogger()
            androidContext(this@MyApplication)
        }
    }
}

// 루트 모듈에 모든 기능 포함
@Module(includes = [LoginModule::class, HomeModule::class, ProfileModule::class])
class AppModule
```

### DSL 사용 시

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
            modules(appModule)  // 단일 루트 모듈
        }
    }
}

// 루트 모듈에 모든 기능 포함
val appModule = module {
    includes(
        loginModule,
        homeModule,
        profileModule
    )
}
```

## 기능 모듈(Feature Module) 예시

```kotlin
// :feature:login 모듈
@KoinViewModel
class LoginViewModel(
    private val loginUseCase: LoginUseCase,
    private val userRepository: UserRepository
) : ViewModel()

@Factory
class LoginUseCase(private val authService: AuthService)

@Module(includes = [DataModule::class])
@ComponentScan("com.app.feature.login")
class LoginModule
```

```kotlin
// 동일한 DSL 표현
val loginModule = module {
    includes(dataModule)
    viewModel<LoginViewModel>()
    factory<LoginUseCase>()
}
```

## 동적 기능 로딩 (Dynamic Feature Loading)

Activity 생명주기에 따라 필요할 때 기능 모듈을 로드합니다:

```kotlin
class FeatureActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        loadKoinModules(featureModule)
        super.onCreate(savedInstanceState)
    }

    override fun onDestroy() {
        super.onDestroy()
        unloadKoinModules(featureModule)
    }
}
```

## Koin vs Hilt 비교

| Hilt | Koin |
|------|------|
| `@HiltAndroidApp` | `startKoin { androidContext() }` |
| `@InstallIn(SingletonComponent)` | `startKoin {}`에서 로드된 모듈 |
| 교차 모듈을 위한 `@EntryPoint` | 자동 해결(Automatic resolution) |
| 컴포넌트 의존성 (Component dependencies) | `includes()` |
| `@ApplicationContext` | `androidContext()` (자동) |

:::info
**Koin의 장점:** `@EntryPoint` 인터페이스가 필요하지 않습니다. 모든 모듈이 로드되어 있는 한 의존성은 모듈 간에 자동으로 해결됩니다.
:::

## 안드로이드 테스트

### 격리된 환경에서 모듈 테스트

```kotlin
class LoginViewModelTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(
            loginModule,
            module {
                single<UserRepository> { mockk() }
                single<AuthService> { mockk() }
            }
        )
    }

    private val viewModel: LoginViewModel by inject()

    @Test
    fun `test login`() {
        // 모의(mocked) 의존성으로 테스트 수행
    }
}
```

### 모든 모듈 검증

```kotlin
class ModuleCheckTest : KoinTest {

    @Test
    fun `verify all modules`() {
        appModule.verify()  // 포함된 모듈도 함께 검증합니다.
    }
}
```

## 참고 항목

- **[모듈(Modules)](/docs/reference/koin-core/modules)** - `includes()`를 사용한 핵심 모듈 개념
- **[안드로이드 모듈 로딩(Android Module Loading)](/docs/reference/koin-android/modules-android)** - 동적 모듈 로딩
- **[지연 모듈(Lazy Modules)](/docs/reference/koin-core/lazy-modules)** - 백그라운드 모듈 로딩
- **[테스트(Testing)](/docs/reference/koin-android/instrumented-testing)** - 안드로이드 테스트 가이드