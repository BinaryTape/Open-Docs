---
title: Koin 用于 Jetpack Compose 和 Compose Multiplatform
---

本页面介绍如何为你的 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 或 [Multiplaform Compose](https://www.jetbrains.com/lp/compose-mpp/) 应用注入依赖项。

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

## 重新使用现有 Koin 上下文

通过在你的 Compose 应用程序之前使用 `startKoin` 函数，你的应用程序已准备好迎接 Koin 注入。无需再为 Compose 设置 Koin 上下文。

:::note
`KoinContext` 和 `KoinAndroidContext` 已弃用
:::

## 使用 Compose 应用启动 Koin - KoinApplication
如果你无法访问可以运行 `startKoin` 函数的空间，你可以依赖 Compose 和 Koin 来启动你的 Koin 配置。

可组合函数 `KoinApplication` 有助于创建一个 Koin 应用程序实例，作为一个 `Composable`：

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
(实验性 API)
你可以使用 `KoinMultiplatformApplication` 来替换多平台入口点：它与 `KoinApplication` 相同，但会自动为你注入 `androidContext` 和 `androidLogger`。
:::

## 使用 KoinApplicationPreview 预览 Compose

`KoinApplicationPreview` 可组合函数专用于预览可组合函数：

```kotlin
@Preview(name = "1 - Pixel 2 XL", device = Devices.PIXEL_2_XL, locale = "en")
@Preview(name = "2 - Pixel 5", device = Devices.PIXEL_5, locale = "en", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Preview(name = "3 - Pixel 7 ", device = Devices.PIXEL_7, locale = "ru", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Composable
fun previewVMComposable(){
    KoinApplicationPreview(application = { modules(appModule) }) {
        ViewModelComposable()
    }
}
```

## 注入到 @Composable 中

在编写你的可组合函数时，你可以访问以下 Koin API：`koinInject()`，用于从 Koin 容器中注入实例。

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

### 共享 Activity ViewModel (4.1 - Android)

你现在可以使用 `koinActivityViewModel()` 从同一 ViewModel 宿主（Activity）中注入 ViewModel。

```kotlin
@Composable
fun App() {
    // hold ViewModel instance at Activity level
    val vm = koinActivityViewModel<MyViewModel>()
}
```

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

### 共享 ViewModel 和导航 (实验性)

Koin Compose Navigation 现在具有 `NavBackEntry.sharedKoinViewModel()` 函数，允许检索已存储在当前 `NavBackEntry` 中的 ViewModel。在你的导航部分，只需使用 `sharedKoinViewModel`：

```kotlin
navigation<Route.BookGraph>(
                startDestination = Route.BookList
            ) {
                composable<Route.BookList>(
                    exitTransition = { slideOutHorizontally() },
                    popEnterTransition = { slideInHorizontally() }
                ) {
                    // Use SharedViewModel here ...

                    val selectedBookViewModel =
                        it.sharedKoinViewModel<SelectedBookViewModel>(navController)
```

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