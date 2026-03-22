---
title: 从 Hilt 迁移到 Koin
---

本指南将帮助您将 Android 应用程序从 Dagger Hilt 迁移到 Koin。无论您使用的是 Koin DSL 还是 Koin Annotations，本指南都涵盖了关键差异和迁移步骤。

:::info
有关完整的真实案例，请查看 [Now in Android 迁移](https://blog.insert-koin.io/migrating-now-in-android-to-koin-annotations-2-3-67d252dbb97d)，该案例展示了如何将 Google 拥有 30 个 Gradle 模块的生产级新闻应用从 Hilt 迁移到 Koin Annotations。
:::

## 为什么迁移到 Koin？

**Koin 的关键优势：**

- **无代码生成** - Koin 使用运行时依赖解析，无需注解处理器。
- **更简单的设置** - 没有复杂的组件层次结构或 `@InstallIn` 声明。
- **Kotlin 优先** - 自然且符合惯例的 Kotlin DSL。
- **更轻量** - 无需 kapt/KSP 代码生成（针对 DSL 方式），构建时间更短。
- **多模块友好** - 无需 `@EntryPoint` 接口。
- **JSR-330 支持** - 现有的 `@Inject` 构造函数无需修改即可工作。

## 快速参考：Hilt vs Koin

### 注解映射

| Hilt | Koin DSL                                 | Koin Annotations                                                                                    |
|------|------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `@HiltAndroidApp` | Application 中的 `startKoin {}`            | `@KoinApplication`                                                                                  |
| `@AndroidEntryPoint` | `by inject()` / `by viewModel()`         | `by inject()` / `by viewModel()`                                                                    |
| `@HiltViewModel` | `viewModel { MyViewModel(...) }`         | `@KoinViewModel`                                                                                    |
| `@Inject` 构造函数 | DSL 指定构造函数形参    | 自动检测构造函数形参 (JSR-330)                                                           |
| `@Module` + `@InstallIn` | `module { }`                             | `@Module` + `@ComponentScan`                                                                        |
| `@Provides` | `single { }` 或 `factory { }`            | `@Single` / `@Factory`                                                                              |
| `@Binds` | `single<Interface> { Implementation() }` | `@Single` 或 `@Singleton` 会检测绑定。也可以使用这些注解的 `binds` 属性。 |
| `@Singleton` | `single { }`                             | `@Single` 或 `@Singleton`                                                                                           |
| `@Named("qualifier")` | `named("qualifier")`                     | `@Named("qualifier")`                                                                               |
| `@ApplicationContext` | 自动 Context 注入              | 自动 Context 注入                                                                         |
| `@EntryPoint` | 不需要                               | 不需要                                                                                          |

### 作用域映射

| Hilt 作用域 | Koin DSL | Koin Annotations | 说明 |
|------------|----------|------------------|-------|
| `@Singleton` | `single { }` | `@Single` / `@Singleton` | 全局单例 |
| `@ActivityScoped` | `activityScope { scoped { } }` | `@ActivityScope` | 绑定到 Activity 生命周期 |
| `@ViewModelScoped` | `viewModelScope { scoped { } }` | `@ViewModelScope` | 绑定到 ViewModel 生命周期 |
| `@ActivityRetainedScoped` | `activityRetainedScope { scoped { } }` | `@ActivityRetainedScope` | 在配置更改后继续存在 |

## 迁移步骤

### 第 1 步：更新依赖项

**移除 Hilt 依赖项：**

```kotlin
// 从 build.gradle.kts 中移除这些内容
plugins {
    id("com.google.dagger.hilt.android") // 移除
}

dependencies {
    // 移除 Hilt 依赖项
    implementation("com.google.dagger:hilt-android:...")
    kapt("com.google.dagger:hilt-compiler:...")
}
```

**添加 Koin 依赖项：**

```kotlin
// build.gradle.kts (app 模块)
dependencies {
    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")

    // 可选：Koin Annotations
    implementation("io.insert-koin:koin-annotations:$koin_ksp_version")
    ksp("io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
}
```

### 第 2 步：应用程序设置

**Hilt：**

```kotlin
@HiltAndroidApp
class MyApplication : Application()
```

**Koin DSL：**

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

**Koin Annotations：**

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
使用 `@KoinApplication` 时，如果模块被标记为 `@Configuration`，它们将被自动发现。您也可以使用 `modules` 属性显式包含模块：`@KoinApplication(modules = [AppModule::class])`。
:::

### 第 3 步：迁移模块

**Hilt：**

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

**Koin DSL：**

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
            .client(get()) // 自动依赖解析
            .build()
    }

    single {
        get<Retrofit>().create(ApiService::class.java)
    }
}
```

**Koin Annotations：**

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

### 第 4 步：迁移 ViewModel

**Hilt：**

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

**Koin DSL：**

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

**Koin Annotations：**

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
`viewModelOf` DSL 函数使用构造函数形参自动装配。`SavedStateHandle` 由 Koin 自动提供，因此您无需显式传递它。这是 Koin 自动装配 DSL 的一部分，它简化了 ViewModel 定义。
:::

### 第 5 步：迁移 Activity 和 Fragment

**Hilt：**

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

**Koin：**

```kotlin
class MainActivity : ComponentActivity() {

    // 属性委托 - 不需要注解
    private val analytics: AnalyticsService by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        analytics.logEvent("screen_view")
    }
}
```

:::info
使用 Koin，您不需要 `@AndroidEntryPoint` - 只需使用 `by inject()` 或 `by viewModel()` 属性委托即可。
:::

### 第 6 步：迁移接口绑定

**Hilt：**

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

**Koin DSL：**

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

**Koin Annotations（自动绑定检测）：**

```kotlin
// 选项 1：自动 - Koin 检测接口绑定
@Singleton
class MyRepositoryImpl(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
// Koin 自动将 MyRepositoryImpl 绑定到 MyRepository

// 选项 2：通过 binds 属性显式指定
@Single(binds = [MyRepository::class])
class MyRepositoryImpl(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
```

:::info
当一个类实现一个接口时，Koin Annotations 会自动检测接口绑定。当您需要显式指定多个接口或控制绑定行为时，请使用 `binds` 属性。
:::

### 第 7 步：迁移限定符

**Hilt：**

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

**Koin DSL（基于字符串）：**

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

**Koin DSL（类型安全）：**

```kotlin
// 定义限定符类型
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

**Koin Annotations（基于字符串）：**

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

**Koin Annotations（使用 JSR-330 @Qualifier - 完全兼容！）：**

```kotlin
// 保留您现有的 JSR-330 限定符注解！
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
Koin Annotations 完全支持 JSR-330 `@Qualifier` 注解！这是一种标准的 Java/Kotlin DI 注解（并非 Hilt 特有），因此您可以在迁移过程中保持现有的限定符注解不变。DSL 还支持使用 `named<T>()` 代替基于字符串的 `named("string")` 来实现类型安全限定符。
:::

### 第 8 步：迁移 Compose 集成

**Hilt：**

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

**Koin：**

```kotlin
@Composable
fun MyScreen(
    viewModel: MyViewModel = koinViewModel()
) {
    // 直接注入 - 不需要 EntryPoint
    val dependency: SomeDependency = koinInject()
}
```

### 第 9 步：迁移测试

**Hilt：**

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

**Koin：**

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

## 多模块项目

### Hilt 方式

使用 Hilt，您需要：
- `@InstallIn` 来指定组件层次结构
- 跨模块访问的 `@EntryPoint` 接口
- 复杂的组件依赖关系

### Koin 方式

使用 Koin：
- 每个模块声明自己的 Koin 模块
- 在 Application 类中导入所有模块
- 不需要特殊的接口

**使用 Koin 的功能模块：**

```kotlin
// :feature:home 模块
val homeModule = module {
    viewModel { HomeViewModel(get()) }
    factory { HomeRepository(get()) }
}

// :app 模块
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
            modules(
                coreModule,
                dataModule,
                homeModule,  // 功能模块
                profileModule // 另一个功能模块
            )
        }
    }
}
```

有关更多详细信息，请参阅[多模块架构](/docs/reference/koin-android/multi-module)。

## 通用模式

### 构造函数注入 (JSR-330)

最大的优势之一：**现有的 `@Inject` 构造函数可以与 Koin Annotations 配合使用！**

```kotlin
// 这同时适用于 Hilt 和 Koin Annotations
class MyRepository @Inject constructor(
    private val apiService: ApiService,
    private val database: AppDatabase
) {
    // ...
}
```

使用 Koin Annotations，您可以保持 `@Inject` 构造函数不变，只需在类中添加 `@Single`、`@Singleton` 或 `@Factory`：

```kotlin
@Single // 或 @Singleton
class MyRepository @Inject constructor(
    private val apiService: ApiService,
    private val database: AppDatabase
) {
    // ...
}
```

### 辅助注入 (AssistedInject)

**Hilt：**

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

**Koin：**

```kotlin
class MyViewModel(
    private val repository: MyRepository,
    private val userId: String
) : ViewModel()

val appModule = module {
    viewModelOf(::MyViewModel)
}

// 用法
val viewModel: MyViewModel by viewModel { parametersOf("user123") }
```

### 延迟注入

**Hilt：**

```kotlin
@Inject
lateinit var heavyService: HeavyService
```

**Koin：**

```kotlin
// 属性委托默认是延迟执行的
private val heavyService: HeavyService by inject()

// 或显式延迟加载
private val heavyService: Lazy<HeavyService> by lazy { get() }
```

## 迁移核对清单

使用此核对清单跟踪您的迁移进度：

- [ ] **依赖项**
  - [ ] 移除 Hilt Gradle 插件
  - [ ] 移除 Hilt 依赖项
  - [ ] 添加 Koin 依赖项
  - [ ] 移除 `kapt`（如果其他地方不需要）

- [ ] **Application 类**
  - [ ] 移除 `@HiltAndroidApp`
  - [ ] 在 `onCreate()` 中添加 `startKoin {}`
  - [ ] 配置 `androidContext()` 和模块

- [ ] **模块**
  - [ ] 将 `@Module` + `@InstallIn` 转换为 `module { }`
  - [ ] 将 `@Provides` 转换为 `single { }` 或 `factory { }`
  - [ ] 将 `@Binds` 转换为接口绑定
  - [ ] 将限定符更新为 `named()`

- [ ] **ViewModel**
  - [ ] 移除 `@HiltViewModel`
  - [ ] 使用 `viewModel { }` 添加到模块
  - [ ] 更新 Composable 以使用 `koinViewModel()`

- [ ] **Activity/Fragment**
  - [ ] 移除 `@AndroidEntryPoint`
  - [ ] 将字段注入转换为 `by inject()`

- [ ] **测试**
  - [ ] 移除 `@HiltAndroidTest`
  - [ ] 实现 `KoinTest`
  - [ ] 在设置/卸载中添加 `startKoin` / `stopKoin`

- [ ] **验证**
  - [ ] 项目构建成功
  - [ ] 运行所有测试
  - [ ] 测试应用内依赖注入
  - [ ] 验证没有运行时崩溃

## 故障排除

### "No definition found for X"

**问题**：Koin 找不到类型的定义。

**解决方案**：
- 确保模块已加载到 `startKoin { modules(...) }` 中。
- 检查定义是否存在（使用 `single { }` 或 `factory { }`）。
- 验证是否指定了正确的类型。

### "DefinitionOverrideException"

**问题**：同一类型有多个定义。

**解决方案**：
- 使用限定符：`single(named("qualifier")) { }`。
- 启用重写：`startKoin { allowOverride(true) }`。

### 循环依赖

**问题**：两个类相互依赖。

**解决方案**：
- 使用 `lazy` 注入：`private val service by lazy { get<MyService>() }`。
- 重构以移除循环依赖。
- 使用作用域来打破循环。

## 更多资源

- **真实迁移案例**：[将 Now in Android 迁移到 Koin](https://blog.insert-koin.io/migrating-now-in-android-to-koin-annotations-2-3-67d252dbb97d)
- **Koin 文档**：[入门指南](/docs/setup/koin)
- **Koin Annotations**：[Android Annotations 指南](/docs/quickstart/android-annotations)

## 需要帮助？

- **GitHub Discussions**：在 [Koin 仓库](https://github.com/InsertKoinIO/koin/discussions)中提问
- **Slack**：加入 Slack 上的 Koin 社区
- **Stack Overflow**：使用 `koin` 标签提问