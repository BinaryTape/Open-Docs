---
title: 정의
---

# 정의

정의(Definitions)는 Koin이 의존성을 생성하고 관리하는 방법을 선언합니다. 이 가이드에서는 DSL과 어노테이션을 모두 사용하여 모든 정의 타입을 다룹니다.

## 정의 타입

| 타입 | DSL | 어노테이션 | 생명주기 | 사용 사례 |
|------|-----|------------|-----------|----------|
| 싱글톤 (Singleton) | `single()` | `@Singleton` | 앱 수명 동안 하나의 인스턴스 유지 | 서비스, 레포지토리, 데이터베이스 |
| 팩토리 (Factory) | `factory()` | `@Factory` | 요청 시마다 새로운 인스턴스 생성 | 프레젠터, 사용 사례(use cases), 상태를 가진 객체 |
| 스코프 (Scoped) | `scoped()` | `@Scoped` | 스코프당 하나의 인스턴스 유지 | 액티비티 바인딩, 세션 바인딩 객체 |
| 뷰모델 (ViewModel) | `viewModel()` | `@KoinViewModel` | 안드로이드 뷰모델 생명주기 | 뷰모델 |

## 정의 선언하기

### 컴파일러 플러그인 DSL (권장)

```kotlin
import org.koin.plugin.module.dsl.*

val appModule = module {
    // 싱글톤
    single<Database>()
    single<UserRepository>()

    // 팩토리 - 매번 새로운 인스턴스 생성
    factory<UserPresenter>()

    // 뷰모델
    viewModel<UserViewModel>()
}
```

### 어노테이션

```kotlin
@Singleton  // 또는 @Single
class Database

@Singleton
class UserRepository(private val database: Database)

@Factory
class UserPresenter(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### 클래식 DSL

```kotlin
val appModule = module {
    // 생성자 참조 사용 (자동 연결)
    singleOf(::Database)
    singleOf(::UserRepository)
    factoryOf(::UserPresenter)
    viewModelOf(::UserViewModel)

    // 람다 사용 (수동 연결)
    single { Database() }
    single { UserRepository(get()) }
    factory { UserPresenter(get()) }
    viewModel { UserViewModel(get()) }
}
```

## 정의 비교

| 개념 | 컴파일러 플러그인 DSL | 클래식 DSL | 어노테이션 |
|---------|---------------------|-------------|------------|
| 싱글톤 (Singleton) | `single<MyClass>()` | `singleOf(::MyClass)` | `@Singleton` / `@Single` |
| 팩토리 (Factory) | `factory<MyClass>()` | `factoryOf(::MyClass)` | `@Factory` |
| 스코프 (Scoped) | `scoped<MyClass>()` | `scopedOf(::MyClass)` | `@Scoped` |
| 뷰모델 (ViewModel) | `viewModel<MyVM>()` | `viewModelOf(::MyVM)` | `@KoinViewModel` |
| 워커 (Worker) | `worker<MyWorker>()` | `workerOf(::MyWorker)` | `@KoinWorker` |

:::info
컴파일러 플러그인은 클래스와 함수 파라미터를 분석하여, 더 이상 직접 작성할 필요가 없는 `get()` 함수를 사용한 적절한 Koin 호출을 생성합니다.
:::

## Single (싱글톤)

앱 전체에서 재사용되는 단일 인스턴스를 생성합니다:

```kotlin
// DSL
single<DatabaseHelper>()

// 어노테이션
@Singleton
class DatabaseHelper
```

두 방식 모두 모든 소비자들 사이에서 공유되는 단일 인스턴스라는 동일한 결과를 생성합니다.

## Factory (팩토리)

매번 새로운 인스턴스를 생성합니다:

```kotlin
// DSL
factory<UserPresenter>()

// 어노테이션
@Factory
class UserPresenter(private val repository: UserRepository)
```

## Scoped (스코프 정의)

스코프당 하나의 인스턴스를 생성합니다:

```kotlin
// DSL
scope<MyActivity> {
    scoped<ActivityPresenter>()
}

// 어노테이션
@Scoped(MyActivityScope::class)
class ActivityPresenter
```

## ViewModel (뷰모델)

적절한 생명주기를 가진 안드로이드 뷰모델:

```kotlin
// DSL
viewModel<UserViewModel>()

// 어노테이션
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

## 인터페이스 바인딩

### 컴파일러 플러그인 DSL

```kotlin
single<UserRepositoryImpl>() bind UserRepository::class

// 여러 바인딩
single<MyServiceImpl>() binds arrayOf(ServiceA::class, ServiceB::class)
```

### 클래식 DSL

```kotlin
singleOf(::UserRepositoryImpl) bind UserRepository::class

// 또는 람다 사용
single<UserRepository> { UserRepositoryImpl(get()) }
```

### 어노테이션

클래스가 인터페이스를 구현할 때 **인터페이스 바인딩은 자동으로 이루어집니다**:

```kotlin
@Singleton
class UserRepositoryImpl(
    private val database: Database
) : UserRepository  // 자동으로 UserRepository에 바인딩됨
```

명시적 바인딩의 경우:

```kotlin
@Singleton
@Binds(UserRepository::class)
class UserRepositoryImpl : UserRepository
```

## 한정자 (이름이 지정된 정의)

동일한 타입의 정의가 여러 개 있는 경우에 사용합니다. 인스턴스를 가져오는 방법은 [한정자를 사용한 주입](/docs/reference/koin-core/injection#injection-with-qualifiers) 섹션을 참조하세요.

### 컴파일러 플러그인 DSL

컴파일러 플러그인 DSL에서는 (이전에 `named()`를 사용했던 것과 같이) 문자열 한정자를 사용하기 위해 `@Named` 어노테이션을 붙여야 합니다.

```kotlin
@Named("local")
class LocalDatabase : Database

@Named("remote")
class RemoteDatabase : Database

class UserRepository(
    @Named("local") private val localDb: Database,
    @Named("remote") private val remoteDb: Database
)

single<LocalDatabase>()
single<RemoteDatabase>()
single<UserRepository>()

// 사용법
val localDb: Database = get(named("local"))
```

### 클래식 DSL

```kotlin
single<Database>(named("local")) { LocalDatabase() }
single<Database>(named("remote")) { RemoteDatabase() }

// 사용법
val localDb: Database = get(named("local"))
```

### 어노테이션

```kotlin
@Singleton
@Named("local")
class LocalDatabase : Database

@Singleton
@Named("remote")
class RemoteDatabase : Database

// 소비자 측에서
@Singleton
class UserRepository(
    @Named("local") private val localDb: Database,
    @Named("remote") private val remoteDb: Database
)
```

## 주입 파라미터

주입 시점에 파라미터를 전달합니다:

### 컴파일러 플러그인 DSL

`@InjectedParam`을 사용하여 해당 파라미터가 주입 파라미터로 제공될 것임을 나타냅니다.

```kotlin
class UserPresenter(
    @InjectedParam userId : String,
    repository : UserRepository
)

factory<UserPresenter>()
```

### 클래식 DSL

```kotlin
class UserPresenter(
    userId : String,
    repository : UserRepository
)

factory { params ->
    UserPresenter(
        userId = params.get(),
        repository = get()
    )
}
```

### 어노테이션

```kotlin
@Factory
class UserPresenter(
    @InjectedParam val userId: String,
    val repository: UserRepository  // 자동 주입됨
)

// 사용법
val presenter: UserPresenter = get { parametersOf("user123") }
```

## 선택적 의존성 (Optional Dependencies)

### 컴파일러 플러그인 DSL

```kotlin
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?  // getOrNull()로 해결됨
)

single<MyService>()
```

### 클래식 DSL

```kotlin
single {
    MyService(
        required = get(),
        optional = getOrNull()
    )
}
```

### 어노테이션

Nullable 파라미터는 자동으로 처리됩니다:

```kotlin
@Singleton
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?  // getOrNull()로 해결됨
)
```

## 지연 주입 (Lazy Injection)

인스턴스 생성을 지연시킵니다:

### 컴파일러 플러그인 DSL

```kotlin
class MyService(
    val lazyDep: Lazy<HeavyDependency>  // 생성이 지연됨
)

single<MyService>()
```

### 클래식 DSL

```kotlin
single {
    MyService(
        lazyDep = inject()  // Lazy<Dependency>
    )
}
```

### 어노테이션

```kotlin
@Singleton
class MyService(
    val lazyDep: Lazy<HeavyDependency>  // 생성이 지연됨
)
```

## 프로퍼티 (Properties)

설정 값을 주입합니다:

### 컴파일러 플러그인 DSL

```kotlin
class ApiClient(
    @Property("api_url") val url: String,
    @Property("api_key") val key: String
)

single<ApiClient>()
```

### 클래식 DSL

```kotlin
single {
    ApiClient(
        url = getProperty("api_url"),
        key = getProperty("api_key", "default")
    )
}
```

### 어노테이션

```kotlin
@Singleton
class ApiClient(
    @Property("api_url") val url: String,
    @Property("api_key") val key: String
)
```

## 콜백

### onClose 콜백

인스턴스가 해제될 때 코드를 실행합니다:

```kotlin
single {
    Database()
} onClose {
    it?.close()  // Koin이 중지되거나 스코프가 닫힐 때 호출됨
}
```

### createdAtStart

시작 시 인스턴스를 즉시 생성합니다:

```kotlin
// 컴파일러 플러그인 DSL
single<ConfigManager>() withOptions {
    createdAtStart()
}

// 클래식 DSL
single(createdAtStart = true) {
    ConfigManager()
}
```

## 정의 오버라이드 (Definition Override)

### 기본값: 마지막 정의가 우선함

```kotlin
val prodModule = module {
    single<ApiService> { ProductionApi() }
}

val testModule = module {
    single<ApiService> { MockApi() }  // 프로덕션 정의를 오버라이드함
}

startKoin {
    modules(prodModule, testModule)
}
```

### 명시적 오버라이드

엄격 모드(strict mode)에서는 오버라이드를 명시적으로 표시하세요:

```kotlin
val testModule = module {
    single<ApiService> { MockApi() }.override()
}

startKoin {
    allowOverride(false)
    modules(prodModule, testModule)
}
```

## 안전한 DSL 패턴

Koin 컴파일러 플러그인은 컴파일 시점에 DSL 정의를 변환하여 생성자 파라미터를 자동으로 연결(auto-wiring)하고 검증합니다. 주요 패턴은 다음과 같습니다:

### create()를 사용한 함수 빌더

직접 소유하지 않은 외부 라이브러리를 래핑하려면 `create(::function)`를 사용하세요. 함수 파라미터는 DI 컨테이너에서 자동으로 해결됩니다.

```kotlin
import org.koin.dsl.module
import org.koin.plugin.module.dsl.create

// 빌더 함수 — 파라미터가 Koin에 의해 해결됨
fun database(context: Context): AppDatabase =
    Room.databaseBuilder(context, AppDatabase::class.java, "my-db").build()

fun topicDao(db: AppDatabase): TopicDao = db.topicDao()
fun newsDao(db: AppDatabase): NewsResourceDao = db.newsResourceDao()

val databaseModule = module {
    single { create(::database) }
    single { create(::topicDao) }
    single { create(::newsDao) }
}
```

이 패턴은 Room 데이터베이스, Retrofit 서비스, OkHttp 클라이언트 및 기타 외부 라이브러리에 권장되는 패턴입니다.

### includes()를 사용한 모듈 구성

레이어별로 모듈을 구성하고 이들을 합칠 수 있습니다:

```kotlin
import org.koin.dsl.module
import org.koin.plugin.module.dsl.*

val networkModule = module {
    includes(dispatchersModule)

    single { create(::json) }
    single<AppHttpClient>()
    single<DemoNetworkDataSource>() bind NetworkDataSource::class
}

private fun json(): Json = Json { ignoreUnknownKeys = true }
```

### 앱 모듈 — 모든 구성 요소 합치기

앱 모듈은 모든 기능 모듈을 포함하고 뷰모델과 사용 사례(use cases)를 선언합니다:

```kotlin
import org.koin.dsl.module
import org.koin.plugin.module.dsl.*
import org.koin.androidx.scope.dsl.activityScope

val appModule = module {
    includes(
        dispatchersModule,
        databaseModule,
        dataStoreModule,
        networkModule,
        dataModule,
        syncModule
    )

    // 도메인 사용 사례 — 팩토리 (매번 새로운 인스턴스 생성)
    factory<GetFollowableTopicsUseCase>()
    factory<GetSearchContentsUseCase>()

    // 뷰모델
    viewModel<MainActivityViewModel>()
    viewModel<HomeViewModel>()
    viewModel<BookmarksViewModel>()

    // 액티비티 스코프 정의
    activityScope {
        scoped<ActivityTracker>()
    }
}
```

### DSL에서의 커스텀 한정자

한정자 어노테이션은 `create(::function)`와도 함께 작동합니다:

```kotlin
import org.koin.dsl.module
import org.koin.plugin.module.dsl.create

val dispatchersModule = module {
    single { create(::dispatcherIO) }
    single { create(::dispatcherDefault) }
    single { create(::coroutineScope) }
}

@Dispatcher(NiaDispatchers.IO)
fun dispatcherIO(): CoroutineDispatcher = Dispatchers.IO

@Dispatcher(NiaDispatchers.Default)
fun dispatcherDefault(): CoroutineDispatcher = Dispatchers.Default

fun coroutineScope(
    @Dispatcher(NiaDispatchers.Default) default: CoroutineDispatcher
) = CoroutineScope(SupervisorJob() + default)
```

### DSL을 사용한 워커(Worker)

```kotlin
import org.koin.dsl.module
import org.koin.plugin.module.dsl.*
import org.koin.dsl.bind

val syncModule = module {
    single<WorkManagerSyncManager>() bind SyncManager::class
    worker<SyncWorker>()
}
```

### 완성된 패턴: 인터페이스 바인딩이 포함된 레포지토리

```kotlin
import org.koin.dsl.module
import org.koin.dsl.bind
import org.koin.plugin.module.dsl.single

val dataModule = module {
    includes(databaseModule, dataStoreModule, networkModule)

    single<OfflineFirstNewsRepository>() bind NewsRepository::class
    single<OfflineFirstTopicsRepository>() bind TopicsRepository::class
    single<OfflineFirstUserDataRepository>() bind UserDataRepository::class
}
```

이 모든 정의는 컴파일 시점에 Koin 컴파일러 플러그인에 의해 검증됩니다. 누락된 의존성, 한정자 불일치, 잘못된 호출 지점 등이 빌드 시점에 발견됩니다. 자세한 내용은 [컴파일 타임 안전성(Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety)을 참조하세요.

## 권장 모범 사례

1. **생성자 주입 선호** - Koin 없이도 코드를 테스트할 수 있게 만듭니다.
2. **상태가 없는 서비스에는 `single` 사용** - 레포지토리, 클라이언트, 헬퍼 등.
3. **상태가 있는 객체에는 `factory` 사용** - 프레젠터, 상태를 가진 사용 사례 등.
4. **생명주기에 종속된 객체에는 `scoped` 사용** - 액티비티, 프래그먼트, 세션 등.
5. **한정자 사용 최소화** - 가능하면 대신 다른 인터페이스를 사용하세요.
6. **인터페이스에 바인딩** - 구현체가 아닌 추상화에 의존하세요.
7. **외부 라이브러리에는 `create(::builder)` 사용** - 더 안전한 의존성 해결을 제공합니다.

## 다음 단계

- **[주입 (Injection)](/docs/reference/koin-core/injection)** - 의존성 가져오기
- **[한정자 (Qualifiers)](/docs/reference/koin-core/qualifiers)** - 이름 및 타입 한정자
- **[고급 패턴 (Advanced Patterns)](/docs/reference/koin-core/advanced-patterns)** - 컬렉션, 데코레이터, 외부 라이브러리
- **[스코프 (Scopes)](/docs/reference/koin-core/scopes)** - 생명주기 관리