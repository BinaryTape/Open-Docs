---
title: Hilt에서 Koin으로 마이그레이션하기
---

이 가이드는 Android 애플리케이션을 Dagger Hilt에서 Koin으로 마이그레이션하는 것을 도와줍니다. Koin DSL 또는 Koin Annotations 중 무엇을 사용하든, 이 가이드는 주요 차이점과 마이그레이션 단계를 다룹니다.

:::info
실제 사례를 확인하려면 [Now in Android 마이그레이션](https://blog.insert-koin.io/migrating-now-in-android-to-koin-annotations-2-3-67d252dbb97d)을 참고하세요. 이 글에서는 30개의 Gradle 모듈로 구성된 Google의 프로덕션 레벨 뉴스 앱이 어떻게 Hilt에서 Koin Annotations로 마이그레이션되었는지 보여줍니다.
:::

## 왜 Koin으로 마이그레이션해야 하나요?

**Koin의 주요 장점:**

- **코드 생성 없음(No Code Generation)** - Koin은 어노테이션 프로세서 없이 런타임 의존성 해결을 사용합니다.
- **더 간단한 설정** - 복잡한 컴포넌트 계층 구조나 `@InstallIn` 선언이 필요 없습니다.
- **Kotlin 우선(Kotlin-First)** - 자연스럽게 느껴지는 관용적인 Kotlin DSL을 제공합니다.
- **더 가벼움** - (DSL 방식의 경우) kapt/KSP 코드 생성 단계가 없어 빌드 시간이 단축됩니다.
- **멀티 모듈 친화적** - `@EntryPoint` 인터페이스가 필요하지 않습니다.
- **JSR-330 지원** - 기존의 `@Inject` 생성자를 수정 없이 그대로 사용할 수 있습니다.

## 빠른 참조: Hilt vs Koin

### 어노테이션 매핑

| Hilt | Koin DSL                                 | Koin Annotations                                                                                    |
|------|------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `@HiltAndroidApp` | Application에서 `startKoin {}`            | `@KoinApplication`                                                                                  |
| `@AndroidEntryPoint` | `by inject()` / `by viewModel()`         | `by inject()` / `by viewModel()`                                                                    |
| `@HiltViewModel` | `viewModel { MyViewModel(...) }`         | `@KoinViewModel`                                                                                    |
| `@Inject` 생성자 | DSL에서 생성자 파라미터 지정    | 생성자 파라미터 자동 감지 (JSR-330)                                                           |
| `@Module` + `@InstallIn` | `module { }`                             | `@Module` + `@ComponentScan`                                                                        |
| `@Provides` | `single { }` 또는 `factory { }`            | `@Single` / `@Factory`                                                                              |
| `@Binds` | `single<Interface> { Implementation() }` | `@Single` 또는 `@Singleton`은 바인딩을 감지합니다. 또한 해당 어노테이션의 `binds` 속성을 사용하세요. |
| `@Singleton` | `single { }`                             | `@Single` 또는 `@Singleton`                                                                                           |
| `@Named("qualifier")` | `named("qualifier")`                     | `@Named("qualifier")`                                                                               |
| `@ApplicationContext` | 자동 Context 주입              | 자동 Context 주입                                                                         |
| `@EntryPoint` | 필요 없음                               | 필요 없음                                                                                          |

### 스코프 매핑

| Hilt 스코프 | Koin DSL | Koin Annotations | 비고 |
|------------|----------|------------------|-------|
| `@Singleton` | `single { }` | `@Single` / `@Singleton` | 애플리케이션 전역 싱글톤 |
| `@ActivityScoped` | `activityScope { scoped { } }` | `@ActivityScope` | Activity 수명 주기에 바인딩됨 |
| `@ViewModelScoped` | `viewModelScope { scoped { } }` | `@ViewModelScope` | ViewModel 수명 주기에 바인딩됨 |
| `@ActivityRetainedScoped` | `activityRetainedScope { scoped { } }` | `@ActivityRetainedScope` | 구성 변경(Configuration changes) 시에도 유지됨 |

## 마이그레이션 단계

### 1단계: 의존성 업데이트

**Hilt 의존성 제거:**

```kotlin
// build.gradle.kts에서 다음을 제거하세요.
plugins {
    id("com.google.dagger.hilt.android") // 제거
}

dependencies {
    // Hilt 의존성 제거
    implementation("com.google.dagger:hilt-android:...")
    kapt("com.google.dagger:hilt-compiler:...")
}
```

**Koin 의존성 추가:**

```kotlin
// build.gradle.kts (app 모듈)
dependencies {
    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")

    // 선택 사항: Koin Annotations
    implementation("io.insert-koin:koin-annotations:$koin_ksp_version")
    ksp("io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
}
```

### 2단계: Application 설정

**Hilt:**

```kotlin
@HiltAndroidApp
class MyApplication : Application()
```

**Koin DSL:**

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
            modules(appModule, dataModule, domainModule)
        }
    }
}
```

**Koin Annotations:**

```kotlin
@KoinApplication
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
        }
    }
}
```

:::info
`@KoinApplication`을 사용하면 `@Configuration` 태그가 지정된 모듈이 자동으로 감지됩니다. `modules` 속성을 사용하여 모듈을 명시적으로 포함할 수도 있습니다: `@KoinApplication(modules = [AppModule::class])`.
:::

### 3단계: 모듈 마이그레이션

**Hilt:**

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com")
            .client(okHttpClient)
            .build()
    }

    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }
}
```

**Koin DSL:**

```kotlin
val networkModule = module {

    single {
        OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    single {
        Retrofit.Builder()
            .baseUrl("https://api.example.com")
            .client(get()) // 자동 의존성 해결
            .build()
    }

    single {
        get<Retrofit>().create(ApiService::class.java)
    }
}
```

**Koin Annotations:**

```kotlin
@Module
class NetworkModule {

    @Single
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    @Single
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com")
            .client(okHttpClient)
            .build()
    }

    @Single
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }
}
```

### 4단계: ViewModel 마이그레이션

**Hilt:**

```kotlin
@HiltViewModel
class MyViewModel @Inject constructor(
    private val repository: MyRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    // ...
}

@Composable
fun MyScreen() {
    val viewModel = hiltViewModel<MyViewModel>()
    // ...
}
```

**Koin DSL:**

```kotlin
class MyViewModel(
    private val repository: MyRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    // ...
}

val appModule = module {
    viewModelOf(::MyViewModel)
}

@Composable
fun MyScreen() {
    val viewModel = koinViewModel<MyViewModel>()
    // ...
}
```

**Koin Annotations:**

```kotlin
@KoinViewModel
class MyViewModel(
    private val repository: MyRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    // ...
}

@Composable
fun MyScreen() {
    val viewModel = koinViewModel<MyViewModel>()
    // ...
}
```

:::info
`viewModelOf` DSL 함수는 생성자 파라미터 자동 연결(autowiring)을 사용합니다. `SavedStateHandle`은 Koin에서 자동으로 제공하므로 명시적으로 전달할 필요가 없습니다. 이는 ViewModel 정의를 단순화하는 Koin의 autowire DSL의 일부입니다.
:::

### 5단계: Activity 및 Fragment 마이그레이션

**Hilt:**

```kotlin
@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var analytics: AnalyticsService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        analytics.logEvent("screen_view")
    }
}
```

**Koin:**

```kotlin
class MainActivity : ComponentActivity() {

    // 속성 위임(Property delegation) - 어노테이션 불필요
    private val analytics: AnalyticsService by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        analytics.logEvent("screen_view")
    }
}
```

:::info
Koin을 사용하면 `@AndroidEntryPoint`가 필요하지 않습니다. 단순히 `by inject()` 또는 `by viewModel()` 속성 위임을 사용하면 됩니다.
:::

### 6단계: 인터페이스 바인딩 마이그레이션

**Hilt:**

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class DataModule {

    @Binds
    @Singleton
    abstract fun bindRepository(
        impl: MyRepositoryImpl
    ): MyRepository
}

class MyRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
```

**Koin DSL:**

```kotlin
val dataModule = module {
    single<MyRepository> { MyRepositoryImpl(get()) }
}

class MyRepositoryImpl(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
```

**Koin Annotations (자동 바인딩 감지):**

```kotlin
// 옵션 1: 자동 - Koin이 인터페이스 바인딩을 감지함
@Singleton
class MyRepositoryImpl(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
// Koin이 자동으로 MyRepositoryImpl을 MyRepository에 바인딩합니다.

// 옵션 2: binds 속성을 사용한 명시적 바인딩
@Single(binds = [MyRepository::class])
class MyRepositoryImpl(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
```

:::info
Koin Annotations는 클래스가 인터페이스를 구현할 때 인터페이스 바인딩을 자동으로 감지합니다. 여러 인터페이스를 명시적으로 지정하거나 바인딩 동작을 제어해야 하는 경우 `binds` 속성을 사용하세요.
:::

### 7단계: Qualifier 마이그레이션

**Hilt:**

```kotlin
@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Module
@InstallIn(SingletonComponent::class)
object DispatcherModule {

    @Provides
    @IoDispatcher
    fun provideIoDispatcher(): CoroutineDispatcher {
        return Dispatchers.IO
    }
}

class MyRepository @Inject constructor(
    @IoDispatcher private val dispatcher: CoroutineDispatcher
)
```

**Koin DSL (문자열 기반):**

```kotlin
val dispatcherModule = module {
    single(named("io")) { Dispatchers.IO }
}

class MyRepository(
    private val dispatcher: CoroutineDispatcher
)

val dataModule = module {
    single { MyRepository(get(named("io"))) }
}
```

**Koin DSL (타입 세이프):**

```kotlin
// Qualifier 타입 정의
object IoDispatcher

val dispatcherModule = module {
    single(named<IoDispatcher>()) { Dispatchers.IO }
}

class MyRepository(
    private val dispatcher: CoroutineDispatcher
)

val dataModule = module {
    single { MyRepository(get(named<IoDispatcher>())) }
}
```

**Koin Annotations (문자열 기반):**

```kotlin
@Module
class DispatcherModule {
    @Single
    @Named("io")
    fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO
}

@Single
class MyRepository(
    @InjectedParam @Named("io") private val dispatcher: CoroutineDispatcher
)
```

**Koin Annotations (JSR-330 @Qualifier 사용 - 완전 호환!):**

```kotlin
// 기존 JSR-330 qualifier 어노테이션을 그대로 유지하세요!
@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Module
class DispatcherModule {
    @Single
    @IoDispatcher
    fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO
}

@Single
class MyRepository @Inject constructor(
    @IoDispatcher private val dispatcher: CoroutineDispatcher
)
```

:::info
Koin Annotations는 JSR-330 `@Qualifier` 어노테이션을 완벽하게 지원합니다! 이는 표준 Java/Kotlin DI 어노테이션(Hilt 전용이 아님)이므로, 마이그레이션 중에 기존 qualifier 어노테이션을 변경하지 않고 그대로 유지할 수 있습니다. DSL 또한 문자열 기반의 `named("string")` 대신 `named<T>()`를 사용하여 타입 세이프한 qualifier를 지원합니다.
:::

### 8단계: Compose 통합 마이그레이션

**Hilt:**

```kotlin
@Composable
fun MyScreen(
    viewModel: MyViewModel = hiltViewModel()
) {
    val dependency: SomeDependency = EntryPointAccessors
        .fromActivity<MyEntryPoint>(LocalContext.current as Activity)
        .dependency()
}
```

**Koin:**

```kotlin
@Composable
fun MyScreen(
    viewModel: MyViewModel = koinViewModel()
) {
    // 직접 주입 - EntryPoint가 필요 없음
    val dependency: SomeDependency = koinInject()
}
```

### 9단계: 테스트 마이그레이션

**Hilt:**

```kotlin
@HiltAndroidTest
class MyTest {

    @get:Rule
    var hiltRule = HiltAndroidRule(this)

    @Inject
    lateinit var repository: MyRepository

    @Before
    fun init() {
        hiltRule.inject()
    }

    @Test
    fun myTest() {
        // ...
    }
}
```

**Koin:**

```kotlin
class MyTest : KoinTest {

    private val repository: MyRepository by inject()

    @Before
    fun before() {
        startKoin {
            modules(testModule)
        }
    }

    @After
    fun after() {
        stopKoin()
    }

    @Test
    fun myTest() {
        // ...
    }
}
```

## 멀티 모듈 프로젝트

### Hilt 접근 방식

Hilt에서는 다음이 필요합니다:
- 컴포넌트 계층 구조를 지정하기 위한 `@InstallIn`
- 모듈 간 액세스를 위한 `@EntryPoint` 인터페이스
- 복잡한 컴포넌트 의존성

### Koin 접근 방식

Koin에서는:
- 각 모듈이 자체 Koin 모듈을 선언합니다.
- Application 클래스에서 모든 모듈을 가져옵니다(Import).
- 특별한 인터페이스가 필요하지 않습니다.

**Koin을 사용한 기능(Feature) 모듈:**

```kotlin
// :feature:home 모듈
val homeModule = module {
    viewModel { HomeViewModel(get()) }
    factory { HomeRepository(get()) }
}

// :app 모듈
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
            modules(
                coreModule,
                dataModule,
                homeModule,  // 기능 모듈
                profileModule // 또 다른 기능 모듈
            )
        }
    }
}
```

자세한 내용은 [멀티 모듈 아키텍처](/docs/reference/koin-android/multi-module)를 참조하세요.

## 공통 패턴

### 생성자 주입 (JSR-330)

가장 큰 장점 중 하나는 **기존의 `@Inject` 생성자가 Koin Annotations와 함께 작동한다**는 점입니다!

```kotlin
// 이 코드는 Hilt와 Koin Annotations 모두에서 작동합니다.
class MyRepository @Inject constructor(
    private val apiService: ApiService,
    private val database: AppDatabase
) {
    // ...
}
```

Koin Annotations를 사용하면 `@Inject` 생성자를 변경하지 않고 유지하면서 클래스에 `@Single`, `@Singleton` 또는 `@Factory`만 추가하면 됩니다.

```kotlin
@Single // 또는 @Singleton
class MyRepository @Inject constructor(
    private val apiService: ApiService,
    private val database: AppDatabase
) {
    // ...
}
```

### AssistedInject

**Hilt:**

```kotlin
class MyViewModel @AssistedInject constructor(
    private val repository: MyRepository,
    @Assisted private val userId: String
) : ViewModel() {

    @AssistedFactory
    interface Factory {
        fun create(userId: String): MyViewModel
    }
}
```

**Koin:**

```kotlin
class MyViewModel(
    private val repository: MyRepository,
    private val userId: String
) : ViewModel()

val appModule = module {
    viewModelOf(::MyViewModel)
}

// 사용법
val viewModel: MyViewModel by viewModel { parametersOf("user123") }
```

### 지연 주입 (Lazy Injection)

**Hilt:**

```kotlin
@Inject
lateinit var heavyService: HeavyService
```

**Koin:**

```kotlin
// 속성 위임을 사용하면 기본적으로 지연 주입됩니다.
private val heavyService: HeavyService by inject()

// 또는 명시적인 lazy 사용
private val heavyService: Lazy<HeavyService> by lazy { get() }
```

## 마이그레이션 체크리스트

마이그레이션 진행 상황을 추적하려면 이 체크리스트를 사용하세요:

- [ ] **의존성**
  - [ ] Hilt Gradle 플러그인 제거
  - [ ] Hilt 의존성 제거
  - [ ] Koin 의존성 추가
  - [ ] 다른 곳에서 필요하지 않다면 `kapt` 제거

- [ ] **Application 클래스**
  - [ ] `@HiltAndroidApp` 제거
  - [ ] `onCreate()`에 `startKoin {}` 추가
  - [ ] `androidContext()` 및 모듈 구성

- [ ] **모듈**
  - [ ] `@Module` + `@InstallIn`을 `module { }`로 변환
  - [ ] `@Provides`를 `single { }` 또는 `factory { }`로 변환
  - [ ] `@Binds`를 인터페이스 바인딩으로 변환
  - [ ] Qualifier를 `named()`로 업데이트

- [ ] **ViewModel**
  - [ ] `@HiltViewModel` 제거
  - [ ] `viewModel { }`을 사용하여 모듈에 추가
  - [ ] Composable에서 `koinViewModel()`을 사용하도록 업데이트

- [ ] **Activity/Fragment**
  - [ ] `@AndroidEntryPoint` 제거
  - [ ] 필드 주입을 `by inject()`로 변환

- [ ] **테스트**
  - [ ] `@HiltAndroidTest` 제거
  - [ ] `KoinTest` 구현
  - [ ] setup/teardown에 `startKoin` / `stopKoin` 추가

- [ ] **검증**
  - [ ] 프로젝트 빌드 성공 확인
  - [ ] 모든 테스트 실행
  - [ ] 앱 내 의존성 주입 테스트
  - [ ] 런타임 크래시 여부 확인

## 문제 해결

### "No definition found for X"

**문제**: Koin이 특정 타입의 정의를 찾을 수 없습니다.

**해결 방법**:
- `startKoin { modules(...) }`에서 모듈이 로드되었는지 확인하세요.
- 정의가 존재하는지 확인하세요 (`single { }` 또는 `factory { }` 사용).
- 올바른 타입이 지정되었는지 확인하세요.

### "DefinitionOverrideException"

**문제**: 동일한 타입에 대해 여러 정의가 존재합니다.

**해결 방법**:
- Qualifier를 사용하세요: `single(named("qualifier")) { }`
- 오버라이드 활성화: `startKoin { allowOverride(true) }`

### 순환 의존성 (Circular Dependencies)

**문제**: 두 클래스가 서로를 참조하고 있습니다.

**해결 방법**:
- `lazy` 주입 사용: `private val service by lazy { get<MyService>() }`
- 순환 의존성을 제거하도록 리팩토링
- 스코프(Scope)를 사용하여 사이클 끊기

## 추가 리소스

- **실제 사례 마이그레이션**: [Now in Android를 Koin으로 마이그레이션하기](https://blog.insert-koin.io/migrating-now-in-android-to-koin-annotations-2-3-67d252dbb97d)
- **Koin 문서**: [시작하기](/docs/setup/koin)
- **Koin Annotations**: [Android Annotations 가이드](/docs/quickstart/android-annotations)

## 도움이 필요하신가요?

- **GitHub Discussions**: [Koin 저장소](https://github.com/InsertKoinIO/koin/discussions)에서 질문하세요.
- **Slack**: Slack의 Koin 커뮤니티에 참여하세요.
- **Stack Overflow**: 질문에 `koin` 태그를 추가하세요.