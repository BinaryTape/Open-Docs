---
title: Koin for Jetpack Compose 和 Compose Multiplatform
---

本页面介绍如何为你的 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 或 [Multiplatform Compose](https://www.jetbrains.com/lp/compose-mpp/) 应用注入依赖项。

## Koin Compose Multiplatform 与 Koin Android Jetpack Compose

自 2024 年年中起，Compose 应用程序可以使用 Koin Multiplatform API 完成。Koin Jetpack Compose (koin-androidx-compose) 和 Koin Compose Multiplatform (koin-compose) 之间的所有 API 都是相同的。

### 适用于 Compose 的 Koin 包有哪些？

对于仅使用 Android Jetpack Compose API 的纯 Android 应用，请使用以下包：

- `koin-androidx-compose` - 用于启用 Compose 基础 API + Compose ViewModel API
- `koin-androidx-compose-navigation` - 带有 Navigation API 集成的 Compose ViewModel API

对于 Android/Multiplatform 应用，请使用以下包：

- `koin-compose` - Compose 基础 API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - 带有 Navigation API 集成的 Compose ViewModel API

## 重新使用现有 Koin 上下文（Koin 已启动）

有时，`startKoin` 函数已在应用程序中使用，用于在你的应用程序中启动 Koin（例如在 Android 主应用程序类，即 Application 类中）。在这种情况下，你需要使用 `KoinContext` 或 `KoinAndroidContext` 将当前 Koin 上下文告知你的 Compose 应用程序。这些函数会重用当前的 Koin 上下文并将其绑定到 Compose 应用程序。

```kotlin
@Composable
fun App() {
    // Set current Koin instance to Compose context
    KoinContext() {

        MyScreen()
    }
}
```

:::info
`KoinAndroidContext` 和 `KoinContext` 的区别：
- `KoinAndroidContext` 在当前 Android 应用上下文中查找 Koin 实例
- `KoinContext` 在当前 GlobalContext 中查找 Koin 实例
:::

:::note
如果你从一个 `Composable` 中遇到 `ClosedScopeException` 异常，请在你的 `Composable` 上使用 `KoinContext`，或者确保 Koin 启动配置正确 [使用 Android 上下文](/docs/reference/koin-android/start.md#from-your-application-class)。
:::

## 使用 Compose 应用启动 Koin - KoinApplication

`KoinApplication` 函数有助于创建一个 Koin 应用程序实例，作为一个 `Composable`：

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // your screens here ...
        MyScreen()
    }
}
```

`KoinApplication` 函数将根据 Compose 上下文的生命周期处理 Koin 上下文的启动和停止。此函数会启动并停止一个新的 Koin 应用程序上下文。

:::info
在 Android 应用程序中，`KoinApplication` 将处理因配置更改或 Activity 销毁而导致的 Koin 上下文停止/重新启动的任何需求。
:::

:::note
这取代了传统 `startKoin` 应用程序函数的使用。
:::

### Koin 与 Compose 预览

`KoinApplication` 函数对于为预览启动专用上下文很有用。它也可以用于协助 Compose 预览：

```kotlin
@Composable
@Preview
fun App() {
    KoinApplication(application = {
        // your preview config here
        modules(previewModule)
    }) {
        // Compose to preview with Koin
    }
}
```

## 注入到 @Composable 中

在编写你的可组合函数 (Composable) 时，你可以访问以下 Koin API：`koinInject()`，用于从 Koin 容器中注入实例。

对于声明了“MyService”组件的模块：

```kotlin
val androidModule = module {
    single { MyService() }
    // or constructor DSL
    singleOf(::MyService)
}
```

我们可以这样获取你的实例：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

为了与 Jetpack Compose 的函数式特性保持一致，最佳的编写方法是将实例直接注入到函数参数中。这种方式允许使用 Koin 提供默认实现，但仍可按需注入实例。

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### 在 @Composable 中注入带参数的实例

当你从 Koin 请求新的依赖项时，你可能需要注入参数。为此，你可以使用 `koinInject` 函数的 `parameters` 参数，配合 `parametersOf()` 函数，示例如下：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
你可以使用带有 lambda 注入的参数，例如 `koinInject<MyService>{ parametersOf("a_string") }`，但如果你的代码频繁重组 (recomposing)，这可能会影响性能。这种带有 lambda 的版本需要在调用时解包你的参数，以帮助避免记住你的参数。

从 Koin 的 4.0.2 版本开始，引入了 `koinInject(Qualifier,Scope,ParametersHolder)`，让你能够以最有效的方式使用参数。
:::

## 适用于 @Composable 的 ViewModel

同样，除了可以访问经典的单例/工厂实例外，你还可以访问以下 Koin ViewModel API：

* `koinViewModel()` - 注入 ViewModel 实例
* `koinNavViewModel()` - 注入 ViewModel 实例 + 导航参数数据（如果你正在使用 `Navigation` API）

对于声明了“MyViewModel”组件的模块：

```kotlin
module {
    viewModel { MyViewModel() }
    // or constructor DSL
    viewModelOf(::MyViewModel)
}
```

我们可以这样获取你的实例：

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

我们可以这样在函数参数中获取你的实例：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Jetpack Compose 的更新不支持 Lazy API。
:::

### 适用于 @Composable 的 ViewModel 和 SavedStateHandle

你可以拥有一个 `SavedStateHandle` 构造函数参数，它将根据 Compose 环境（Navigation BackStack 或 ViewModel）进行注入。
它可以是通过 ViewModel `CreationExtras` 注入，也可以是通过 Navigation `BackStackEntry` 注入：

```kotlin
// Setting objectId argument in Navhost
NavHost(
    navController,
    startDestination = "list"
) {
    composable("list") { backStackEntry ->
        //...
    }
    composable("detail/{objectId}") { backStackEntry ->
        val objectId = backStackEntry.arguments?.getString("objectId")?.toInt()
        DetailScreen(navController, objectId!!)
    }
}

// Injected Argument in ViewModel
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    init {
        println("$this - objectId: ${savedStateHandle.get<String>("objectId")}")
    }
}
```

:::note
有关 SavedStateHandle 注入差异的更多详细信息：https://github.com/InsertKoinIO/koin/issues/1935#issuecomment-2362335705
:::

## 与 Composable 绑定的模块加载与卸载

Koin 提供了一种为给定可组合函数 (Composable) 加载特定模块的方式。`rememberKoinModules` 函数会加载 Koin 模块并在当前 `Composable` 上记住它们：

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // load module at first call of this component
    rememberKoinModules(myModule)
}
```

你可以使用其中一个“废弃”函数，从两个方面卸载模块：
- `onForgotten` - 在组合被丢弃后
- `onAbandoned` - 组合失败

为此，请为 `rememberKoinModules` 使用 `unloadOnForgotten` 或 `unloadOnAbandoned` 参数。

## 使用 Composable 创建 Koin 作用域

可组合函数 `rememberKoinScope` 和 `KoinScope` 允许在 `Composable` 中处理 Koin 作用域 (Scope)，并在 `Composable` 结束时关闭当前作用域。

:::info
该 API 目前仍不稳定。
:::