---
title: 定义
---

# 定义

定义 (Definitions) 声明了 Koin 如何创建和管理您的依赖项。本指南涵盖了使用 DSL 和注解 (Annotations) 的所有定义类型。

## 定义类型

| 类型 | DSL | 注解 | 生命周期 | 用例 |
|------|-----|------------|-----------|----------|
| 单例 (Singleton) | `single()` | `@Singleton` | 应用生命周期内仅一个实例 | 服务、仓库、数据库 |
| 工厂 (Factory) | `factory()` | `@Factory` | 每次请求都创建一个新实例 | Presenter、用例、有状态对象 |
| 作用域 (Scoped) | `scoped()` | `@Scoped` | 每个作用域内仅一个实例 | 绑定到 Activity 或会话的对象 |
| ViewModel | `viewModel()` | `@KoinViewModel` | Android ViewModel 生命周期 | ViewModel |

## 声明定义

### 编译器插件 DSL (推荐)

```kotlin
import org.koin.plugin.module.dsl.*

val appModule = module {
    // 单例 (Singleton)
    single<Database>()
    single<UserRepository>()

    // 工厂 (Factory) - 每次请求都创建新实例
    factory<UserPresenter>()

    // ViewModel
    viewModel<UserViewModel>()
}
```

### 注解

```kotlin
@Singleton  // 或 @Single
class Database

@Singleton
class UserRepository(private val database: Database)

@Factory
class UserPresenter(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### 经典 DSL

```kotlin
val appModule = module {
    // 使用构造函数引用 (自动装配)
    singleOf(::Database)
    singleOf(::UserRepository)
    factoryOf(::UserPresenter)
    viewModelOf(::UserViewModel)

    // 使用 lambda (手动装配)
    single { Database() }
    single { UserRepository(get()) }
    factory { UserPresenter(get()) }
    viewModel { UserViewModel(get()) }
}
```

## 定义对比

| 概念 | 编译器插件 DSL | 经典 DSL | 注解 |
|---------|---------------------|-------------|------------|
| 单例 (Singleton) | `single<MyClass>()` | `singleOf(::MyClass)` | `@Singleton` / `@Single` |
| 工厂 (Factory) | `factory<MyClass>()` | `factoryOf(::MyClass)` | `@Factory` |
| 作用域 (Scoped) | `scoped<MyClass>()` | `scopedOf(::MyClass)` | `@Scoped` |
| ViewModel | `viewModel<MyVM>()` | `viewModelOf(::MyVM)` | `@KoinViewModel` |
| Worker | `worker<MyWorker>()` | `workerOf(::MyWorker)` | `@KoinWorker` |

:::info
编译器插件正在分析您的类和函数参数，以生成对 Koin `get()` 函数的正确调用，您无需再手动编写。
:::

## Single (单例)

创建一个在整个应用中重用的唯一实例：

```kotlin
// DSL
single<DatabaseHelper>()

// 注解
@Singleton
class DatabaseHelper
```

两者产生的结果相同——一个由所有使用者共享的单例实例。

## Factory (工厂)

每次都创建一个新实例：

```kotlin
// DSL
factory<UserPresenter>()

// 注解
@Factory
class UserPresenter(private val repository: UserRepository)
```

## Scoped (作用域)

每个作用域内创建一个唯一实例：

```kotlin
// DSL
scope<MyActivity> {
    scoped<ActivityPresenter>()
}

// 注解
@Scoped(MyActivityScope::class)
class ActivityPresenter
```

## ViewModel

具有正确生命周期的 Android ViewModel：

```kotlin
// DSL
viewModel<UserViewModel>()

// 注解
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

## 接口绑定

### 编译器插件 DSL

```kotlin
single<UserRepositoryImpl>() bind UserRepository::class

// 多个绑定
single<MyServiceImpl>() binds arrayOf(ServiceA::class, ServiceB::class)
```

### 经典 DSL

```kotlin
singleOf(::UserRepositoryImpl) bind UserRepository::class

// 或使用 lambda
single<UserRepository> { UserRepositoryImpl(get()) }
```

### 注解

当您的类实现接口时，**接口绑定是自动的**：

```kotlin
@Singleton
class UserRepositoryImpl(
    private val database: Database
) : UserRepository  // 自动绑定到 UserRepository
```

对于显式绑定：

```kotlin
@Singleton
@Binds(UserRepository::class)
class UserRepositoryImpl : UserRepository
```

## 限定符 (命名定义)

当您拥有同一类型的多个定义时。另请参阅 [使用限定符注入](/docs/reference/koin-core/injection#injection-with-qualifiers) 以了解如何检索。

### 编译器插件 DSL

使用编译器插件 DSL 时，您需要使用 `@Named` 进行注解以使用字符串限定符（就像您以前使用 `named()` 一样）。

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

// 用法
val localDb: Database = get(named("local"))
```

### 经典 DSL

```kotlin
single<Database>(named("local")) { LocalDatabase() }
single<Database>(named("remote")) { RemoteDatabase() }

// 用法
val localDb: Database = get(named("local"))
```

### 注解

```kotlin
@Singleton
@Named("local")
class LocalDatabase : Database

@Singleton
@Named("remote")
class RemoteDatabase : Database

// 在消费者中
@Singleton
class UserRepository(
    @Named("local") private val localDb: Database,
    @Named("remote") private val remoteDb: Database
)
```

## 注入参数

在注入时传递参数：

### 编译器插件 DSL

使用 `@InjectedParam` 指示参数将由注入参数提供。

```kotlin
class UserPresenter(
    @InjectedParam userId : String,
    repository : UserRepository
)

factory<UserPresenter>()
```

### 经典 DSL

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

### 注解

```kotlin
@Factory
class UserPresenter(
    @InjectedParam val userId: String,
    val repository: UserRepository  // 自动注入
)

// 用法
val presenter: UserPresenter = get { parametersOf("user123") }
```

## 可选依赖项

### 编译器插件 DSL

```kotlin
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?  // 使用 getOrNull() 解析
)

single<MyService>()
```

### 经典 DSL

```kotlin
single {
    MyService(
        required = get(),
        optional = getOrNull()
    )
}
```

### 注解

可为 null 的参数会被自动处理：

```kotlin
@Singleton
class MyService(
    val required: RequiredDep,
    val optional: OptionalDep?  // 使用 getOrNull() 解析
)
```

## 延迟注入

延迟实例创建：

### 编译器插件 DSL

```kotlin
class MyService(
    val lazyDep: Lazy<HeavyDependency>  // 延迟创建
)

single<MyService>()
```

### 经典 DSL

```kotlin
single {
    MyService(
        lazyDep = inject()  // Lazy<Dependency>
    )
}
```

### 注解

```kotlin
@Singleton
class MyService(
    val lazyDep: Lazy<HeavyDependency>  // 延迟创建
)
```

## 属性 (Properties)

注入配置值：

### 编译器插件 DSL

```kotlin
class ApiClient(
    @Property("api_url") val url: String,
    @Property("api_key") val key: String
)

single<ApiClient>()
```

### 经典 DSL

```kotlin
single {
    ApiClient(
        url = getProperty("api_url"),
        key = getProperty("api_key", "default")
    )
}
```

### 注解

```kotlin
@Singleton
class ApiClient(
    @Property("api_url") val url: String,
    @Property("api_key") val key: String
)
```

## 回调

### onClose 回调

实例释放时执行代码：

```kotlin
single {
    Database()
} onClose {
    it?.close()  // 当 Koin 停止或作用域关闭时调用
}
```

### createdAtStart

在启动时预先创建实例：

```kotlin
// 编译器插件 DSL
single<ConfigManager>() withOptions {
    createdAtStart()
}

// 经典 DSL
single(createdAtStart = true) {
    ConfigManager()
}
```

## 定义重写 (Definition Override)

### 默认：最后定义的胜出

```kotlin
val prodModule = module {
    single<ApiService> { ProductionApi() }
}

val testModule = module {
    single<ApiService> { MockApi() }  // 重写生产环境定义
}

startKoin {
    modules(prodModule, testModule)
}
```

### 显式重写

在严格模式下，显式标记重写：

```kotlin
val testModule = module {
    single<ApiService> { MockApi() }.override()
}

startKoin {
    allowOverride(false)
    modules(prodModule, testModule)
}
```

## 安全 DSL 模式

Koin 编译器插件在编译时转换 DSL 定义——自动装配构造函数参数并对其进行验证。以下是关键模式：

### 使用 create() 的函数构建器

使用 `create(::function)` 来包装您不拥有的外部库。函数参数将从 DI 容器中自动解析：

```kotlin
import org.koin.dsl.module
import org.koin.plugin.module.dsl.create

// 构建器函数 — 参数由 Koin 解析
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

这是 Room 数据库、Retrofit 服务、OkHttp 客户端以及其他外部库的推荐模式。

### 使用 includes() 进行模块组合

按层组织模块并对其进行组合：

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

### 应用模块 — 组合一切

应用模块包含所有功能模块，并声明 ViewModel 和用例：

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

    // 领域用例 — 工厂 (每次请求都创建新实例)
    factory<GetFollowableTopicsUseCase>()
    factory<GetSearchContentsUseCase>()

    // ViewModel
    viewModel<MainActivityViewModel>()
    viewModel<HomeViewModel>()
    viewModel<BookmarksViewModel>()

    // Activity 作用域定义
    activityScope {
        scoped<ActivityTracker>()
    }
}
```

### DSL 中的自定义限定符

限定符注解也适用于 `create(::function)`：

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

### DSL 配合 Worker

```kotlin
import org.koin.dsl.module
import org.koin.plugin.module.dsl.*
import org.koin.dsl.bind

val syncModule = module {
    single<WorkManagerSyncManager>() bind SyncManager::class
    worker<SyncWorker>()
}
```

### 完整模式：带接口绑定的仓库

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

所有这些定义都在编译时由 Koin 编译器插件进行验证——缺失的依赖项、限定符不匹配以及损坏的调用站点都会在构建时被捕获。请参阅 [编译时安全](/docs/reference/koin-compiler/compile-safety)。

## 最佳做法

1. **优先使用构造函数注入** - 使代码在不使用 Koin 的情况下也具备可测试性。
2. **对无状态服务使用 `single`** - 如仓库、客户端、帮助程序。
3. **对有状态对象使用 `factory`** - 如 Presenter、带状态的用例。
4. **对生命周期绑定对象使用 `scoped`** - 如 Activity、Fragment、会话。
5. **尽量减少限定符的使用** - 如果可能，请改用不同的接口。
6. **绑定到接口** - 依赖于抽象而非实现。
7. **对外部库使用 `create(::builder)`** - 更安全的依赖解析方式。

## 下一步

- **[注入](/docs/reference/koin-core/injection)** - 检索依赖项
- **[限定符](/docs/reference/koin-core/qualifiers)** - 命名和类型化限定符
- **[高级模式](/docs/reference/koin-core/advanced-patterns)** - 集合、装饰器、外部库
- **[作用域 (Scopes)](/docs/reference/koin-core/scopes)** - 管理生命周期