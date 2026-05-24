---
title: 编译时安全性
---

Koin 编译器插件在编译时验证您的依赖图 —— 在应用运行前捕获缺失的依赖、限定符不匹配和损坏的调用站点。

这取代了 `verify()` 和 `checkModules()` 等运行时验证工具。如果能够通过编译，它就能正常运行。

## 工作原理

该插件在编译期间从三个层级验证您的图：

### A2 — 每个模块 (早期反馈)

每个模块的定义都会根据可见定义进行检查：其自身的定义、显式包含的模块以及 `@Configuration` 同级模块。

```kotlin
@Module(includes = [DataModule::class])
@ComponentScan("app")
class AppModule
// 验证：来自 AppModule + DataModule 的定义
```

共享同一个 `@Configuration` 标签的模块是相互可见的：

```kotlin
@Module @ComponentScan("core") @Configuration("prod")
class CoreModule  // 提供 Repository

@Module @ComponentScan("service") @Configuration("prod")
class ServiceModule  // Service(repo: Repository) → OK，从 CoreModule 可见
```

不同的标签是隔离的：

```kotlin
@Configuration("core")
class CoreModule

@Configuration("service")  // 不同的标签 —— CoreModule 不可见
class ServiceModule         // Service(repo: Repository) → 错误 (ERROR)
```

**A2 捕获的内容：**

- 缺失的依赖
- 限定符不匹配（请求了 `@Named("prod")` 但仅提供了 `@Named("test")`）
- 跨作用域违规
- 提供了 `Lazy<T>` 但未提供 `T`
- 未标记为 `@Provided` 的外部依赖

### A3 — 完整图 (完整保证)

在 `startKoin<T>()` 处，来自所有来源的所有模块都会被组装，并验证完整的图。所有 A2 无法看到的内容 —— 跨模块依赖、来自 JAR 的定义 —— 都会在这里进行检查。

```kotlin
@KoinApplication(modules = [CoreModule::class, ServiceModule::class])
object MyApp

startKoin<MyApp> { }
// 验证：来自 CoreModule + ServiceModule 合并后的所有 (ALL) 定义
```

当 DSL 定义（`single<T>()`、`factory<T>()` 等）作为图的一部分时，A3 也会验证它们。

### A4 — 调用站点验证

代码库中每个 `koinViewModel<T>()`、`get<T>()`、`inject<T>()` 调用都会被拦截。该插件会获取目标类型、文件、行和列 —— 然后检查 `T` 是否存在于组装好的图中。

```kotlin
@Composable
fun UserScreen() {
    val viewModel: UserViewModel = koinViewModel()  // ← A4 验证此处
}

class MyFragment : Fragment() {
    val service: PaymentService by inject()  // ← A4 验证此处
}
```

如果 `UserViewModel` 不在图中 → 产生构建错误并指出确切的文件、行和列。

**跨模块调用站点：** 如果功能模块调用了 `koinViewModel<T>()` 但对完整图没有可见性，插件会生成一个调用站点提示。当应用模块编译时，它会从依赖 JAR 中发现这些提示，并根据完整图对它们进行验证。

## 验证内容

| 场景 | 结果 |
|----------|--------|
| 非空形参，无定义 | **错误** |
| 可空形参 (`T?`)，无定义 | OK —— 使用 `getOrNull()` |
| 带有默认值的形参，无定义 | OK —— 使用 Kotlin 默认值（当 `skipDefaultValues=true` 时） |
| `@InjectedParam`，无定义 | OK —— 运行时通过 `parametersOf()` 提供 |
| `@Property("key")` 形参 | OK —— 属性注入（如果没有 `@PropertyValue` 默认值则发出警告） |
| `List<T>` 形参 | OK —— 如果没有定义，`getAll()` 返回空列表 |
| `Lazy<T>`，无 `T` 的定义 | **错误** —— 拆包以验证内部类型 |
| `@Named("x")` 形参，无匹配限定符 | **错误** —— 如果存在无限定符的绑定，则显示提示 |
| 来自错误作用域的作用域依赖 | **错误** |
| 带有 `@Named` 限定符的默认值形参 | **错误** —— 限定符强制进行注入 |
| `@Provided` 类型或形参，无定义 | OK —— 运行时由外部提供 |
| `@ScopeId(name = "x")` 形参 | OK —— 运行时从命名作用域解析 |
| `Scope` 类型形参 | OK —— 直接传递作用域接收器 |
| Android 框架类型（例如 `Context`） | OK —— 硬编码白名单 |
| 循环依赖 (A → B → A) | **错误** —— 在 A2/A3 图遍历期间检测到 |

## 配合注解的安全性

为您的类添加注解，在模块中组织它们，编译器会验证一切：

```kotlin
@Singleton
class Database

@Singleton
class UserRepository(private val db: Database)

@KoinViewModel
class UserViewModel(private val repo: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

插件通过 `@ComponentScan` 发现带注解的类，在 A2 阶段验证每个模块的定义，并在您声明应用程序入口点时在 A3 阶段验证完整图：

```kotlin
@KoinApplication(modules = [AppModule::class])
object MyApp

startKoin<MyApp> { }  // ← 触发 A3 完整图验证
```

**顶层函数**同样受支持。带注解的顶层函数由 `@ComponentScan` 发现，并像类定义一样进行验证：

```kotlin
@Singleton
fun provideDatabase(): DatabaseService = PostgresDatabase()

@Factory
fun provideCache(db: DatabaseService): CacheService = RedisCache(db)
// ← 已验证：DatabaseService 存在
```

使用 `@Configuration` 标签将模块组织成共同验证的组：

```kotlin
@Module @ComponentScan("core") @Configuration("prod")
class CoreModule

@Module @ComponentScan("feature") @Configuration("prod")
class FeatureModule  // 可以看到 CoreModule 的定义
```

## 配合 DSL 的安全性

编译器插件也验证 DSL 定义。当您编写 `single<T>()`、`factory<T>()` 或 `viewModel<T>()` 时，插件会拦截调用，自动装配构造函数，并验证所有形参：

```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()       // ← 已验证：Database 存在
    viewModel<UserViewModel>()     // ← 已验证：UserRepository 存在
}
```

不需要手动调用 `get()` —— 插件会生成它们并同时进行验证。

`create(::T)` 函数也会被验证。它调用一个函数引用（通常是构建器函数，但也可以是构造函数）并验证其所有形参：

```kotlin
fun buildUserRepository(db: Database): UserRepository = UserRepository(db)

val appModule = module {
    scope<UserSession> {
        scoped { create(::buildUserRepository) }  // ← 已验证：Database 存在
    }
}
```

DSL 定义参与 A3 验证（完整图）和 A4 验证（调用站点）。如果您使用 `startKoin { modules(appModule) }`，插件会根据组装好的图验证所有 DSL 定义。

## 两种风格结合使用

您可以在同一个项目中混合使用注解和 DSL。两者都会被收集到同一个验证图中：

```kotlin
// 注解
@Singleton class Database

// DSL
val featureModule = module {
    single<UserRepository>()  // ← 已验证：来自注解的 Database 是可见的
}
```

## 错误消息

错误会报告缺失的类型、需要该类型的定义以及所在的模块：

```
[Koin] Missing dependency: Repository
  required by: Service (parameter 'repo')
  in module: ServiceModule
```

当存在带有不同限定符的绑定时，会显示提示：

```
[Koin] Missing dependency: NetworkClient (qualifier: @Named("http"))
  required by: ApiService (parameter 'client')
  in module: AppModule
  Hint: Found NetworkClient without qualifier — did you mean to add @Named("http")?
```

调用站点错误包含确切位置：

```
[Koin] Missing definition: com.app.UserRepository
  resolved by: koinViewModel<UserViewModel>()
  No matching definition found in any declared module.
  → file: UserScreen.kt, line: 12, column: 5
```

## 禁止的定义

某些返回值类型永远无法通过 Koin 进行有意义的解析，并会在编译时被拒绝：

### KOIN-D007：`@Factory` 返回挂起 (suspend) `fun interface`

返回扩展了挂起 `fun interface` 类型的 `@Factory` 无法通过 Koin 的同步 `get<T>()` API 调用。插件会在编译时阻止这种情况。

```kotlin
fun interface AsyncTask { suspend operator fun invoke(): Result }

@Factory
fun provideTask(): AsyncTask = AsyncTask { ... }
// KOIN-D007 — 错误：@Factory 返回类型不能扩展挂起 fun interface
```

请重构为普通接口，或者通过带有挂起方法的类公开挂起操作。

## 泛型 DSL 类型

运行时 Koin 在**擦除后的原始类**上解析定义 —— 类型参数不是查找键的一部分。编译安全性遵循这一点：`get<Box<X>>()` 调用会针对图中的任何 `Box<*>` 提供者进行验证，并且两个 `single<Box<A>>()` / `single<Box<B>>()` 声明会发生冲突（相同的原始类，无限定符）。

```kotlin
class Box<T>(val value: T)

val appModule = module {
    single { Box(42) }   // 注册为 Box (原始)
}

koin.get<Box<Int>>()    // → 返回单个 Box 注册
koin.get<Box<String>>() // → 返回相同的注册 (类型擦除)
```

在原始类上进行验证还避免了 Kotlin/Native klib 签名混淆 (mangling) 失败，该失败过去常在 DSL 定义携带未替换的类型参数时导致 iOS 构建崩溃。

### 区分泛型实例：针对泛型形参的类型限定符

当同一个泛型类的多个实例必须共存时，惯用的模式是注册一个**具体的包装类型**并使用**派生自泛型形参的类型限定符** —— `named<T>()`。这就是 `koin-compose-navigation3` 内部所做的，用于将每个导航路由映射到其路由类型：

```kotlin
inline fun <reified T : Any> Module.navigation(
    noinline definition: @Composable Scope.(T) -> Unit,
): KoinDefinition<EntryProviderInstaller> {
    // 注册一个具体 (CONCRETE) 类型 (EntryProviderInstaller)，
    // 通过派生自泛型形参 T 的类型限定符进行区分。
    return _singleInstanceFactory<EntryProviderInstaller>(named<T>(), { ... })
}
```

在两端使用：

```kotlin
// 声明 — T 是一个具体类型 (HomeRoute, SettingsRoute, ...)
module {
    navigation<HomeRoute> { route -> HomeScreen() }
    navigation<SettingsRoute> { route -> SettingsScreen() }
}

// 解析 — 使用相同的类型限定符作为查找键
koin.get<EntryProviderInstaller>(named<HomeRoute>())
```

`named<T>()` 从具现化的 `T` 生成类型限定符，因此每个泛型实例化都会获得一个稳定且唯一的限定符。运行时 Koin 匹配（原始类 + 限定符），这重新引入了类型擦除所移除的区分能力。

每当您需要区分泛型实例化时，请优先使用此模式，而不是直接使用 `single<Box<X>>()`。

## 作用域形参注入

类型为 `org.koin.core.scope.Scope` 的形参会自动注入作用域接收器 —— 无需注解。验证会被跳过，因为注入作用域可以进行动态查找。

```kotlin
@Scoped
class ScopedService(val scope: Scope) {
    fun dynamicLookup() = scope.get<SomeDep>()
}
// 生成：ScopedService(scope) — 直接传递作用域接收器
```

## 命名作用域解析：`@ScopeId`

使用 `@ScopeId` 从命名的 Koin 作用域而不是当前作用域解析依赖项。验证会被跳过，因为作用域是在运行时解析的。

```kotlin
@Factory
class ProfileService(@ScopeId(name = "user_session") val session: UserSession)
// 生成：ProfileService(scope.getScope("user_session").get<UserSession>())
```

`@ScopeId` 支持两种形式：

| 形式 | 示例 | 作用域 ID |
|------|---------|----------|
| 字符串名称 | `@ScopeId(name = "user_session")` | `"user_session"` |
| 类型引用 | `@ScopeId(UserSessionScope::class)` | 完全限定类名 |

## 属性验证

`@Property("key")` 形参从 Koin 属性（在启动时通过 `properties()` 设置）解析。当不存在 `@PropertyValue("key")` 默认值时，插件会在编译时发出警告：

```kotlin
@PropertyValue("api.timeout")
val defaultTimeout = 30

@Factory
class ApiClient(@Property("api.timeout") val timeout: Int)
// OK — @PropertyValue("api.timeout") 提供编译时默认值

@Factory
class Other(@Property("missing.key") val value: String)
// 警告 — 未找到 @PropertyValue("missing.key")
// （仍然可以编译 —— 属性可能在运行时提供）
```

## 外部类型：`@Provided`

某些类型由平台或外部框架在运行时提供，永远不会被声明为 Koin 定义。使用 `@Provided` 标记它们以跳过验证。

`@Provided` 既可以用于**类**（所有用法都跳过验证），也可以用于**形参**（仅该形参跳过验证）：

```kotlin
// 用于类 — 该类型的所有用法都跳过验证
@Provided
class SavedStateHandle

// 用于形参 — 仅此形参跳过验证
@Singleton
class MyViewModel(@Provided val handle: SavedStateHandle)
```

**何时使用 `@Provided`：**

- 不在白名单中的 **Android 框架类型** —— 例如：自定义 Android 服务
- 外部注入的**第三方 SDK 类型** —— 例如：Firebase、分析 SDK
- **来自非 Koin 模块的跨模块类型** —— 当依赖项来自一个不使用 Koin 的库时
- **测试替身** —— 在测试配置中替换真实实现时
- **手动提供的类型** —— `androidContext()`、手动的 `single { }` 注册

```kotlin
// 外部 SDK — 不由 Koin 管理
@Singleton
class AnalyticsService(@Provided val firebaseAnalytics: FirebaseAnalytics)

// 跨模块：在运行时由另一个团队的模块提供
@Factory
class PaymentProcessor(@Provided val paymentGateway: PaymentGateway)
```

**常见的 Android 框架类型会自动列入白名单**，不需要 `@Provided`：

- `android.content.Context`
- `android.app.Application`
- `android.app.Activity`
- `androidx.fragment.app.Fragment`
- `androidx.lifecycle.SavedStateHandle`
- `androidx.work.WorkerParameters`

## 默认值与 skipDefaultValues

当启用 `skipDefaultValues`（默认开启）时，带有 Kotlin 默认值的形参将使用默认值，而不是从 DI 容器中解析：

```kotlin
// 当 skipDefaultValues = true (默认)：
@Singleton
class ServiceWithDefault(val timeout: Int = 5000)
// → 使用 Kotlin 默认值 (5000)，而不是 DI 解析

// 可空形参仍然会被注入：
@Singleton
class Service(val dep: Dependency? = null)
// → 从 DI 使用 getOrNull()

// 带有注解的形参始终使用 DI，无论是否有默认值：
@Singleton
class Service(@Named("custom") val name: String = "fallback")
// → 带有 @Named("custom") 限定符从 DI 解析

// 混合情况：部分来自 DI，部分来自默认值
@Singleton
class ApiClient(
    val repo: UserRepository,                        // → 从 DI 解析
    val timeout: Int = 30_000,                       // → 使用 Kotlin 默认值
    @Property("api_url") val url: String = "https://api.example.com"  // → 从 DI 解析 (带注解)
)
```

设置 `skipDefaultValues = false` 以始终从 DI 容器注入所有形参，忽略 Kotlin 默认值。

## 配置

编译时安全性默认处于启用状态。要禁用它：

```kotlin
koinCompiler {
    compileSafety = false  // 禁用编译时安全性检查
}
```

其他相关选项：

```kotlin
koinCompiler {
    compileSafety = true       // 编译时依赖验证（默认：true）
    strictSafety = true        // 强制聚合器的安全传递在每次构建时重新运行
                               // （默认：在检测到带有 startKoin / @KoinApplication 的模块上自动启用）
    skipDefaultValues = true   // 跳过对带默认值形参的注入（默认：true）
    unsafeDslChecks = true     // 验证 create() 是 lambda 中唯一的指令（默认：true）
}
```

:::info 增量编译与 `strictSafety`
完整图传递 (A3) 仅在聚合器的 `compileKotlin` 中运行。K2 下的 Kotlin 增量编译不会跟踪 `module { }` lambda 体内的 DSL 更改，也不会跟踪新添加到 `@ComponentScan` 软件包中的类 —— 因此，即使图发生了变化，聚合器也可能被标记为 UP-TO-DATE。插件在检测到的聚合器模块上自动启用 [`strictSafety`](/docs/reference/koin-annotations/options#strictsafety) 以强制 A3 重新运行；库模块和功能模块则保持完全增量。
:::

## 从 verify() / checkModules() 迁移

编译器插件取代了运行时验证。您可以移除您的验证测试：

| 之前 | 之后 |
|--------|-------|
| 测试中的 `module.verify()` | 编译器插件（自动） |
| 测试中的 `checkModules()` | 编译器插件（自动） |
| 运行时验证 | 编译时验证 |
| 手动测试设置 | 无需测试代码 |

编译器在每次构建时进行验证 —— 无需编写测试代码。

## 另请参阅

- **[编译器插件选项](/docs/reference/koin-annotations/options)** - 所有配置选项
- **[编译器插件设置](/docs/setup/compiler-plugin)** - 安装指南
- **[开始使用注解](/docs/reference/koin-annotations/start)** - 快速入门
- **[示例应用](https://github.com/InsertKoinIO/koin-compiler-plugin/tree/main/playground-apps)** - 包含注解方式 (`app-annotations/`) 和 DSL 方式 (`app-dsl/`) 的完整参考应用