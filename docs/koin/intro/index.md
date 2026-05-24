---
title: 简介
---

# 欢迎使用 Koin

**务实的 Kotlin 依赖注入框架 —— 既简单又强大**

Koin 是一个专为 Kotlin 开发者打造的轻量级依赖注入框架。无论您是在构建 Android 应用、Kotlin 多平台项目、使用 Ktor 的后端服务，还是任何 Kotlin 应用程序，Koin 都能让依赖注入变得简单且直观。

## 为什么选择 Koin？

Koin 的设计理念非常明确：**您不应该在简单性和功能性之间做选择**。使用 Koin，您可以兼顾两者。

### DSL 与注解 —— 随心选择

Koin 在这两种方式下都非常强大。更喜欢纯净的 Kotlin DSL？那就使用它。喜欢注解？也没问题。两者都是一等公民，功能同样强大。

| 价值 | 含义 |
|-------|---------------|
| **高效** | 易于学习，易于编写。在几分钟内而非几小时内让 DI 运行起来 |
| **开发者友好** | DSL 或注解 —— 任您选择。清晰的错误提示、轻松的调试、最佳的开发者体验 (DX) |
| **可扩展** | 为具有复杂依赖图的大型企业级应用程序提供动力 |
| **安全** | 通过 Koin 编译器插件提供编译时安全性 |
| **动态** | 运行时灵活性：动态加载模块、延迟加载、功能标志 |

## 从哪里开始？

根据您的经验水平选择路径：

### 刚接触依赖注入？

从基础知识开始：
- **[什么是依赖注入？](/docs/intro/what-is-dependency-injection)** —— 了解核心概念

### 了解 DI，但刚接触 Koin？

直接进入 Koin 的世界：
- **[什么是 Koin？](/docs/intro/what-is-koin)** —— 探索 Koin 的 DI 实现方式
- **[Koin 编译器插件](/docs/intro/koin-compiler-plugin)** —— 官方推荐的、更安全的 Koin 使用方式

### 之前使用过 Hilt/Dagger？

查看 Koin 的对比情况：
- **[Koin vs Hilt/Dagger](/docs/intro/koin-vs-hilt)** —— 了解差异和迁移路径

### 准备好编码了？

- **[设置指南](/docs/setup/gradle)** —— 将 Koin 添加到您的项目
- **[教程](/docs/tutorials/your-first-app)** —— 构建您的第一个 Koin 应用
- **[Koin IDE 插件](https://plugins.jetbrains.com/plugin/26131-koin-dependency-injection-official-)** —— 安装适用于 Android Studio 和 IntelliJ IDEA 的官方插件 —— 提供代码导航、实时安全检查、依赖图可视化等功能

## Koin 的方式

Koin 在如何定义依赖项方面提供了灵活性：

| 方式 | 状态 | 描述 |
|----------|--------|-------------|
| **Koin 编译器插件** (Kotlin 2.x) | 推荐 | DSL：`single<MyService>()`、`factory<MyRepo>()`、`viewModel<MyVM>()`。 |
| **Koin 编译器插件** (Kotlin 2.x) | 推荐 | 注解：`@Singleton`、`@Factory`、`@KoinViewModel`。自动检测依赖项，具备编译时安全性。 |
| **经典 DSL** | 完全支持 | `singleOf(::MyService)`、`single { MyService(get()) }`。适用于任何 Kotlin 版本。准备就绪后，编译器插件可以在其之上增加安全性。 |
| **KSP 处理器** (`koin-ksp-compiler`) | 已弃用 | Koin 注解的旧版处理器。请迁移到编译器插件 —— 使用相同的注解，原生编译器集成。 |

在[什么是 Koin？](/docs/intro/what-is-koin)和 [Koin 编译器插件](/docs/intro/koin-compiler-plugin)中了解更多信息。

## 平台支持

Koin 可以在任何运行 Kotlin 的地方工作：

| 平台 | 软件包 | 状态 |
|----------|---------|--------|
| **Kotlin/JVM** | `koin-core` | ✅ 完全支持 |
| **Android** | `koin-android` | ✅ 完全支持 |
| **Compose (Android & 多平台)** | `koin-compose` | ✅ 完全支持 |
| **iOS** | `koin-core` | ✅ 完全支持 |
| **桌面 (Desktop)** | `koin-core` | ✅ 完全支持 |
| **Web (JS/Wasm)** | `koin-core` | ✅ 完全支持 |
| **Ktor** | `koin-ktor` | ✅ 完全支持 |

## 快速示例

以下是 Koin 代码风格的一个简单展示：

```kotlin
// 定义您的类
class UserRepository(private val api: ApiService)
class UserViewModel(private val repository: UserRepository) : ViewModel()

// 使用编译器插件 DSL 定义您的模块
val appModule = module {
    single<ApiService>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}

// 启动 Koin
startKoin {
    modules(appModule)
}

// 在您的 Activity 中注入
class MainActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
}
```

或者使用注解：

```kotlin
@Singleton
class UserRepository(private val api: ApiService)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

准备好开始了吗？请前往[设置指南](/docs/setup/gradle)。