---
title: Koin 用于 Compose
---

# Koin 用于 Compose

Koin 为 Jetpack Compose 和 Compose Multiplatform 应用程序提供全面支持，并配备了专门用于依赖项注入的软件包。

## 软件包概览

| 软件包 | 用例 |
|---------|----------|
| `koin-compose` | Compose 基础 API（多平台） |
| `koin-compose-viewmodel` | ViewModel 注入（多平台） |
| `koin-compose-viewmodel-navigation` | ViewModel + Navigation 2.x |
| `koin-compose-navigation3` | Navigation 3 集成（多平台） |
| `koin-androidx-compose` | Android 便利包（包含 `koin-compose` + `koin-compose-viewmodel`） |

:::info
所有 Compose API 均在 `koin-compose` 和 `koin-compose-viewmodel` 中定义。`koin-androidx-compose` 软件包是一个便利包装器，为 Android 项目同时包含了这两者。
:::

### 我该使用哪个软件包？

**对于仅限 Android 的项目：**
```kotlin
// 选项 1：Android 便利包（包含 koin-compose + koin-compose-viewmodel）
implementation("io.insert-koin:koin-androidx-compose:$koin_version")

// 选项 2：直接使用多平台软件包
implementation("io.insert-koin:koin-compose:$koin_version")
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

// 可选：Navigation 集成
implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
```

**对于 Compose Multiplatform 项目：**
```kotlin
commonMain.dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

    // 可选：Navigation 集成
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

## 平台支持

| 平台 | Compose 类型 | 状态 |
|----------|-------------|--------|
| Android | Jetpack Compose | 完全支持 |
| iOS | Compose Multiplatform | 完全支持 |
| Desktop | Compose Desktop | 完全支持 |
| Web | Compose for Web | 实验性功能 |

## 启动 Koin

### 选项 1：startKoin（仅限 Android 或外部设置）

在 Compose 外部初始化 Koin 以获得完全控制：

```kotlin
// Android Application 类
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@MyApplication)
            androidLogger()
            modules(appModule)
        }
    }
}

// Compose UI 自动使用 Koin
@Composable
fun App() {
    val viewModel = koinViewModel<MyViewModel>()
}
```

**适用场景：** 当您需要对 Koin 生命周期、自定义配置或与其他框架的集成进行完全控制时。

### 选项 2：KoinApplication（由 Compose 管理）

让 Compose 自动处理 Koin 设置：

```kotlin
@Composable
fun App() {
    KoinApplication(configuration = koinConfiguration {
        modules(appModule)
    }) {
        MyScreen()
    }
}
```

**优势：**
- 无需外部设置（不需要 Application 类）
- 自动注入 Android Context
- 根据组合生命周期处理启动/停止
- 管理 Android 上的配置更改

**适用场景：** 当您希望以较少的控制实现最简单的设置时。

在 Android 上自动注入 `androidContext` 和 `androidLogger`。

:::note
`KoinMultiplatformApplication` 已弃用。请改用带有 `koinConfiguration` 的 `KoinApplication`。
:::

## 基础注入

### koinInject() - 获取依赖项

注入任何由 Koin 管理的依赖项：

```kotlin
@Composable
fun UserScreen() {
    val repository = koinInject<UserRepository>()
    // 使用 repository...
}
```

**最佳做法** — 作为默认形参注入：

```kotlin
@Composable
fun UserScreen(
    repository: UserRepository = koinInject()
) {
    // 无需 Koin 即可进行测试
}
```

### koinViewModel() - 获取 ViewModel

在适当的生命周期管理下注入 ViewModel：

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    val state by viewModel.state.collectAsState()
}
```

:::info
请参阅 [Compose 中的 ViewModel](/docs/reference/koin-compose/compose-viewmodel) 以了解所有 ViewModel API。
:::

### 带有形参

传递运行时形参：

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel> {
        parametersOf(itemId)
    }
}
```

为了在频繁重组时获得更好的性能：

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel>(
        parameters = parametersOf(itemId)
    )
}
```

## 定义模块

### 编译器插件 DSL

```kotlin
val appModule = module {
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

### 注解

```kotlin
@Singleton
class UserRepository

@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### 经典 DSL

```kotlin
val appModule = module {
    singleOf(::UserRepository)
    viewModelOf(::UserViewModel)
}
```

## 快速参考

| 函数 | 目的 |
|----------|---------|
| `koinInject<T>()` | 注入任意依赖项 |
| `koinViewModel<T>()` | 注入 ViewModel |
| `koinNavViewModel<T>()` | 带有 Navigation 实参的 ViewModel |
| `koinActivityViewModel<T>()` | Activity 作用域的 ViewModel (Android) |
| `rememberKoinModules()` | 通过组合加载模块 |
| `KoinScope {}` | 创建作用域上下文 |

## 文档

| 主题 | 描述 |
|-------|-------------|
| **[ViewModel](/docs/reference/koin-compose/compose-viewmodel)** | 所有 ViewModel 注入 API |
| **[生命周期与状态](/docs/reference/koin-compose/compose-lifecycle)** | 重组、状态、副作用 |
| **[动态模块](/docs/reference/koin-compose/compose-modules)** | `rememberKoinModules`、延迟加载 |
| **[作用域](/docs/reference/koin-compose/compose-scopes)** | `KoinScope`、`KoinNavigationScope`、`UnboundKoinScope` |
| **[测试](/docs/reference/koin-compose/compose-testing)** | 预览、单元测试 |
| **[隔离上下文](/docs/reference/koin-compose/isolated-context)** | SDK 隔离 |
| **[Navigation 3](/docs/reference/koin-compose/navigation3)** | 类型安全导航（多平台） |

## 相关内容

- **[核心 ViewModel](/docs/reference/koin-core/viewmodel)** — ViewModel 声明 DSL
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** — Android 特定功能
- **[KMP 设置](/docs/reference/koin-core/kmp-setup)** — 多平台配置