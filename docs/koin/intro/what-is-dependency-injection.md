---
title: 什么是依赖注入？
---

# 什么是依赖注入？

依赖注入 (Dependency Injection，简称 DI) 是一种设计模式，在这种模式下，对象从外部源接收其依赖项，而不是在内部创建它们。这促进了松耦合、更好的可测试性以及更整洁的代码架构。

## 什么是依赖项？

依赖项是另一个对象正常运行所需的任何对象。例如，`Car`（汽车）依赖于 `Engine`（发动机）才能行驶。

### 不使用依赖注入

```kotlin
class Engine {
    fun start() {
        println("Engine starting...")
    }
}

class Car {
    private val engine = Engine()  // Car 自行创建发动机

    fun drive() {
        engine.start()
        println("Car is driving")
    }
}
```

**这种方法存在的问题：**
- `Car` 与特定的 `Engine` 实现紧耦合。
- 难以对 `Car` 进行独立测试。
- 难以更换发动机类型（电动、柴油等）。
- `Car` 控制着 `Engine` 的生命周期。

### 使用依赖注入

```kotlin
class Car(private val engine: Engine) {  // Engine 被注入
    fun drive() {
        engine.start()
        println("Car is driving")
    }
}

// 现在我们可以轻松提供不同的发动机
val gasolineCar = Car(GasEngine())
val electricCar = Car(ElectricEngine())
```

**好处：**
- `Car` 不知道 `Engine` 是如何创建的。
- 易于使用模拟 (Mock) 发动机进行测试。
- 灵活——可以更换实现。
- 构造函数中可见清晰的依赖项。

## 提供依赖项的三种方式

### 1. 构造函数注入（推荐）

依赖项通过构造函数传递：

```kotlin
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
) {
    fun getUser(id: String): User {
        return database.query(id) ?: apiClient.fetchUser(id)
    }
}
```

**优点：**
- 依赖项是显式且必需的。
- 不可变（使用 `val`）。
- 易于测试。
- 依赖图清晰。

**使用 Koin：**

```kotlin
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()  // Koin 自动装配依赖项
}
```

:::info
构造函数注入是 Koin 中**首选的方法**。它使您的代码具有可测试性，且在单元测试中无需使用 Koin。
:::

### 2. 字段注入

依赖项被注入到类属性中：

```kotlin
class UserActivity : AppCompatActivity() {
    // 延迟注入 - 实例在首次访问时创建
    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewModel.loadUser()  // ViewModel 实例在此处创建
    }
}
```

**适用场景：**
- 无法控制构造过程的 Android 框架类（Activity、Fragment、Service）。
- 无法使用构造函数注入时。

**使用 Koin：**

```kotlin
// 延迟注入
val presenter: Presenter by inject()

// 立即注入
val presenter: Presenter = get()
```

### 3. 方法注入

依赖项通过方法传递（较不常见）：

```kotlin
class ReportGenerator {
    fun generateReport(data: DataSource) {
        // 使用 data 生成报告
    }
}
```

**适用场景：**
- 可选依赖项。
- 在对象生命周期内会发生变化的依赖项。
- 回调模式。

## 手动 vs 自动依赖注入

### 手动 DI 的问题

随着应用程序的增长，手动管理依赖项变得非常复杂：

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 手动创建整个依赖图
        val database = Database()
        val apiClient = ApiClient()
        val userRepository = UserRepository(database, apiClient)
        val authRepository = AuthRepository(database, apiClient)
        val userService = UserService(userRepository, authRepository)
        val viewModel = UserViewModel(userService)

        // 最终才能使用 viewModel...
    }
}
```

**问题：**
- 在各 Activity/Fragment 之间存在重复代码。
- 容易在依赖顺序上出错。
- 随着应用增长难以维护。
- 难以管理生命周期（单例、作用域对象）。
- 缺乏集中式配置。

### 容器模式（手动方法）

开发者通常会创建一个容器来集中处理对象的创建：

```kotlin
object AppContainer {
    private val database by lazy { Database() }
    private val apiClient by lazy { ApiClient() }

    val userRepository by lazy { UserRepository(database, apiClient) }
    val authRepository by lazy { AuthRepository(database, apiClient) }

    fun createUserViewModel() = UserViewModel(
        UserService(userRepository, authRepository)
    )
}

// 用法
class MainActivity : AppCompatActivity() {
    private val viewModel = AppContainer.createUserViewModel()
}
```

**仍然存在的问题：**
- 手动装配依赖项。
- 没有自动生命周期管理。
- 全局状态（单例容器）。
- 对于复杂的依赖图仍然存在重复操作。

### Koin 如何解决这一问题

Koin 提供自动依赖解析，您可以选择使用 **DSL 或注解**：

```kotlin
// 一次性定义依赖项
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    single<AuthRepository>()
    single<UserService>()
    viewModel<UserViewModel>()
}

// 启动一次 Koin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            modules(appModule)
        }
    }
}

// 随处使用 - Koin 处理整个依赖图
class MainActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
    // 就这样！Koin 会创建 UserViewModel 及其所有依赖项
}
```

**Koin 的优点：**
- 声明式依赖配置。
- 自动依赖解析。
- 生命周期管理（单例、工厂、作用域）。
- 类型安全的注入。
- 易于测试和模块替换。

## 自动 DI 解决方案

自动依赖注入有不同的实现方法：

| 方法 | 示例 | 工作原理 |
|----------|----------|--------------|
| **基于反射** | （旧版框架） | 在运行时使用反射 |
| **代码生成** | Dagger, Hilt | 在编译时生成代码（注解处理） |
| **编译器插件** | Koin 编译器插件 | 针对 DSL 和注解的原生编译器集成 |
| **基于 DSL** | Koin (经典版) | 运行时 DSL 配置 |

**Koin 的方法 - DSL 和注解，两者同样强大：**
- **DSL 风格：** 整洁的 Kotlin DSL 配置 (`single<MyService>()`, `viewModel<MyVM>()`)。
- **注解风格：** 开发者熟悉的注解 (`@Singleton`, `@KoinViewModel`)。
- 两者均由同一个编译器插件驱动，以确保编译时安全性。
- 无反射，轻量级。
- 选择适合您团队的风格。

## 服务定位器 vs 依赖注入

了解两者之间的区别非常重要：

### 服务定位器模式

组件主动从注册表中请求依赖项：

```kotlin
class UserService : KoinComponent {
    private val repository: UserRepository by inject()  // “拉取”依赖项
}
```

### 依赖注入模式

依赖项从外部提供：

```kotlin
class UserService(
    private val repository: UserRepository  // 被“推入”组件
)
```

### 比较

| 维度 | 服务定位器 | 依赖注入 |
|--------|----------------|---------------------|
| 依赖可见性 | 隐藏在类内部 | 在构造函数中显式可见 |
| 测试 | 需要框架支持 | 简单 - 传递测试替身 |
| 耦合度 | 依赖于容器 | 依赖于接口 |
| 在 Koin 中的用法 | `get()`, `by inject()` | 在 Koin 模块中使用构造函数 |
| 最佳适用场景 | Android 框架类 | 业务逻辑、服务 |

### Koin 最佳实践

1. 对于业务逻辑，**优先使用构造函数注入**：

```kotlin
// 优选 - 无需 Koin 即可进行测试
class UserViewModel(private val userService: UserService) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()  // Koin 解析依赖项
}
```

2. 仅在必要时**使用服务定位器**：

```kotlin
// 可接受 - Activity 的构造由 Android 控制
class UserActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
}
```

3. **避免在业务逻辑中使用 `KoinComponent`**：

```kotlin
// 差 - 难以测试
class UserService : KoinComponent {
    private val repository: UserRepository = get()
}

// 优 - 显式依赖项
class UserService(private val repository: UserRepository)
```

## 依赖注入的好处

### 1. 可测试性

如果没有 DI，测试会非常困难：

```kotlin
class UserService {
    private val repository = UserRepository()  // 无法模拟 (Mock)！
}
```

有了 DI，测试变得简单直接：

```kotlin
class UserService(private val repository: UserRepository)

@Test
fun testGetUser() {
    val mockRepository = mockk<UserRepository>()
    val service = UserService(mockRepository)  // 完全控制

    every { mockRepository.findUser("123") } returns testUser
    assertEquals(testUser, service.getUser("123"))
}
```

### 2. 灵活性

轻松更换实现：

```kotlin
val appModule = module {
    single<EmailService> { GmailService() }  // 生产环境
}

val testModule = module {
    single<EmailService> { MockEmailService() }  // 测试环境
}
```

### 3. 代码组织

集中式的依赖配置：

```kotlin
val dataModule = module {
    single<Database>()
    single<ApiClient>()
}

val domainModule = module {
    single<UserRepository>()
    single<AuthRepository>()
}

val presentationModule = module {
    viewModel<UserViewModel>()
}

startKoin {
    modules(dataModule, domainModule, presentationModule)
}
```

### 4. 生命周期管理

Koin 处理对象的生命周期：

```kotlin
val appModule = module {
    single<Database>()       // 整个应用只有一个实例
    factory<Presenter>()     // 每次都是新实例
    scoped<SessionData>()    // 每个作用域内一个实例
}
```

## 总结

依赖注入是一种强大的模式，它能够：
- 将组件与其依赖项**解耦**。
- 通过允许替换依赖项来**提高可测试性**。
- 通过集中式配置**简化维护**。
- 比手动依赖管理**更好地扩展**。

Koin 通过以下方式简化了 Kotlin 中的 DI：
- 提供**两种同样强大的风格**：DSL 或注解 - 任您选择。
- 同时支持**构造函数注入**（推荐）和**字段注入**（必要时）。
- 通过编译器插件提供**编译时安全性**。
- **无需反射** - 纯 Kotlin 实现。

## 下一步

- **[什么是 Koin？](/docs/intro/what-is-koin)** - 了解 Koin 的方法。
- **[Koin 编译器插件](/docs/intro/koin-compiler-plugin)** - 推荐的更安全的方法。
- **[安装指南](/docs/setup/gradle)** - 将 Koin 添加到您的项目。