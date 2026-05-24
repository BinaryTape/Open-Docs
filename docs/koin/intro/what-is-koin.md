---
title: 什么是 Koin？
---

# 什么是 Koin？

### 务实的 Kotlin 依赖注入框架 - 简单且强大

Koin 是一个专为 Kotlin 设计的轻量级依赖注入框架。与依赖代码生成或反射的传统 DI 框架不同，Koin 提供了两种同样强大的方式：简洁的 **Kotlin DSL** 和直观的 **注解**。您可以选择适合您团队的方式——两者都是一等公民。

## Koin 的核心价值

| 价值 | 含义 |
|-------|---------------|
| **高效** | 易于学习，易于编写。几分钟内即可完成 DI 工作，而不是几小时 |
| **开发者友好** | DSL 或注解 - 随您选择。清晰的错误提示，简单的调试，最佳的 DX（开发者体验） |
| **可扩展性** | 为具有复杂依赖关系图的大型企业级应用程序提供动力 |
| **安全** | 通过 Koin 编译器插件实现编译时安全 |
| **动态** | 运行时灵活性：动态加载模块、延迟加载、功能标志 |

## 为什么开发者喜欢 Koin

- **数分钟内即可上手** - 没有复杂的概念，直观的 DSL 和简单的注解
- **编写更少的代码** - 无论是 DSL 还是注解，编译器插件都会自动装配依赖项
- **选择您的风格** - 为 Kotlin 纯粹主义者提供 DSL，为熟悉模式的人提供注解——两者同样强大
- **轻松调试** - 清晰的错误消息，无需追踪生成的代码
- **自信地扩展** - 已被全球企业用于生产环境
- **保持安全** - 编译时验证在运行时之前捕获错误
- **保持灵活** - 基于运行时但性能卓越。支持动态模块、延迟加载、功能标志
- **IDE 支持** - 针对 Android Studio 和 IntelliJ IDEA 的官方插件——支持导航定义、实时安全检查、图表可视化

## 两种风格，一个框架 - 两者同样强大

Koin 支持两种定义依赖项的风格。两者都是一等公民，具有完全的功能对等。选择适合您团队的方式：

### DSL 风格

使用 Kotlin DSL 语法定义依赖项：

```kotlin
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

### 注解风格

使用注解定义依赖项：

```kotlin
@Singleton
class Database

@Singleton
class ApiClient

@Singleton
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

这两种风格都由 **Koin 编译器插件** 处理，以确保编译时安全。

## Koin 的注解更简单

如果您使用过 Hilt 或 Dagger，您会发现 Koin 注解需要的样板代码更少：

| 任务 | Koin | Hilt |
|------|------|------|
| **单例 (Singleton)** | `@Singleton class MyService` | `@Singleton class MyService @Inject constructor(...)` |
| **接口绑定** | 自动（只需实现接口） | 需要在抽象模块中使用 `@Binds` |
| **组件扫描** | `@ComponentScan("package")` | 不可用 |
| **模块发现** | `@Configuration` - 自动发现 | 每个模块都需要手动标注 `@InstallIn` |

**示例对比：**

```kotlin
// KOIN - 就这么简单！
@Singleton
class MyRepository(val api: ApiService)

@Module
@ComponentScan("com.app")
class AppModule
```

```kotlin
// HILT - 更多样板代码
@Singleton
class MyRepository @Inject constructor(val api: ApiService)

@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {
    @Binds
    abstract fun bindRepository(impl: MyRepository): Repository
}
```

## 由 Koin 编译器插件驱动

对于所有新项目，推荐使用 **Koin 编译器插件**：

- **原生 Kotlin 编译器插件 (K2)** - 不是 KSP，而是直接的编译器集成
- **自动检测构造函数参数** - 减少手动装配
- **编译时安全** - 在构建过程中捕获错误
- **同时支持 DSL 和注解** - 随您选择
- **配置简单** - 仅需一个 Gradle 插件

### 使用编译器插件获得更简洁的语法

| 经典 DSL | 编译器插件 DSL |
|-------------|---------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `single { MyService(get(), get()) }` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |

在 [Koin 编译器插件](/docs/intro/koin-compiler-plugin) 中了解更多信息。

## 经典 DSL（完全支持）

经典 DSL 对所有 Kotlin 版本保持完全支持：

```kotlin
val appModule = module {
    singleOf(::Database)
    singleOf(::ApiClient)
    singleOf(::UserRepository)
    viewModelOf(::UserViewModel)
}
```

或者使用显式装配：

```kotlin
val appModule = module {
    single { Database() }
    single { ApiClient() }
    single { UserRepository(get(), get()) }
    viewModel { UserViewModel(get()) }
}
```

:::info
经典 DSL 尚未弃用。Koin 与其完美配合。当您准备好迁移时，编译器插件会在其之上添加编译时分析。
:::

## Koin Annotations 现已成为 Koin 项目的一部分

`koin-annotations` 库——包括 `@Singleton`、`@Factory`、`@KoinViewModel`、`@Module`、`@ComponentScan` 等——随 Koin 主版本一起发布并得到完全支持。它**没有**被弃用。

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
    implementation("io.insert-koin:koin-annotations") // 相同的 Koin 版本
}
```

您的注解由 **Koin 编译器插件** 处理——请参阅 [Koin 编译器插件](/docs/intro/koin-compiler-plugin) 和 [注解参考](/docs/reference/koin-annotations/start)。

## Koin KSP 编译器已弃用，建议使用 Koin 编译器插件

:::info
旧版 KSP 处理器 `koin-ksp-compiler` 已**弃用**，并将在未来的 Koin 版本中移除。替代方案是 **Koin 编译器插件**——原生 K2 编译器集成，无生成文件，更简单的 KMP 配置。
:::

如果您正在将 Koin Annotations 与 `koin-ksp-compiler` 配合使用，请迁移到编译器插件：

- **相同的注解** —— 无需更改代码
- **更好的处理** —— 原生编译器集成，无生成文件
- **更简单的配置** —— 无需 KSP 配置

请参阅 [从 KSP 迁移到编译器插件](/docs/migration/from-ksp-to-compiler-plugin)。

## 运行时 + 编译安全 = 两全其美

Koin 是**基于运行时但性能卓越且编译安全**的。这种独特的结合实现了：

**编译时安全**（配合编译器插件）：
- 在构建期间验证您的依赖关系图
- 自动检测构造函数参数
- 在运行时之前捕获缺失的依赖项

**运行时灵活性**（仅限编译时的框架无法提供）：
- 动态模块加载/卸载
- 延迟模块加载（后台）
- 功能标志驱动的注入
- 插件架构
- 使用不同实现进行 A/B 测试

```kotlin
// 动态模块加载 - Hilt 无法实现
if (featureEnabled) {
    loadKoinModules(premiumFeatureModule)
}

// 稍后，如果功能被禁用
unloadKoinModules(premiumFeatureModule)
```

## Koin 适用于谁？

Koin 是以下人群的理想选择：

- **重视效率的团队** - 更少的模板代码，更快的开发速度
- **想要比 Hilt/Dagger 更简洁 DI 的 Android 开发者**
- **Kotlin 多平台项目** - Android、iOS、桌面端、Web、后端
- **需要扩展的企业项目**
- **任何认为 DI 不应该复杂化的人**

## 下一步

- **[什么是依赖注入？](/docs/intro/what-is-dependency-injection)** - 学习 DI 基础知识
- **[Koin 编译器插件](/docs/intro/koin-compiler-plugin)** - 推荐的方法
- **[设置指南](/docs/setup/gradle)** - 将 Koin 添加到您的项目
- **[教程](/docs/tutorials/your-first-app)** - 使用 Koin 构建您的第一个应用