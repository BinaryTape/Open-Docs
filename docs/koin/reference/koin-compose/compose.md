---
title: Koin 用于 Jetpack Compose 与 Compose Multiplatform
---

本页面介绍如何为您为 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 或 [Multiplaform Compose](https://www.jetbrains.com/lp/compose-mpp/) 应用注入依赖项。

## Koin Compose Multiplatform 与 Koin Android Jetpack Compose

自 2024 年年中起，Compose 应用程序可以使用 Koin Multiplatform API 进行构建。Koin Jetpack Compose (`koin-androidx-compose`) 与 Koin Compose Multiplatform (`koin-compose`) 之间的所有 API 均相同。

### 针对 Compose 使用哪个 Koin 软件包？

对于仅使用 Android Jetpack Compose API 的纯 Android 应用，请使用以下软件包：
- `koin-androidx-compose` - 用于解锁 Compose 基础 API + Compose ViewModel API
- `koin-androidx-compose-navigation` - 带有 Navigation API 集成的 Compose ViewModel API

对于 Android/Multiplatform 应用，请使用以下软件包：
- `koin-compose` - Compose 基础 API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - 带有 Navigation API 集成的 Compose ViewModel API

## 在现有 Koin 上下文的基础上启动

通过在 Compose 应用程序之前使用 `startKoin` 函数，您的应用程序即可准备好迎接 Koin 注入。设置 Compose 的 Koin 上下文不再需要额外操作。

:::note
`KoinContext` 和 `KoinAndroidContext` 已弃用
:::

## 使用 Compose 应用启动 Koin - KoinApplication
如果您无法访问可以运行 `startKoin` 函数的空间，可以依靠 Compose 和 Koin 来启动您的 Koin 配置。

Compose 函数 `KoinApplication` 有助于以 Composable 的形式创建 Koin 应用程序实例：

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // 此处放置您的屏幕 ...
        MyScreen()
    }
}
```

`KoinApplication` 函数将根据 Compose 上下文的生命周期处理 Koin 上下文的启动与停止。此函数会启动并停止一个新的 Koin 应用程序上下文。

:::info
在 Android 应用程序中，`KoinApplication` 将处理因配置更改或 Activity 销毁而需要的任何停止/重启 Koin 上下文的需求。
:::

:::note
（实验性功能 API）
您可以使用 `KoinMultiplatformApplication` 来替换多平台入口点：它与 `KoinApplication` 相同，但会自动为您注入 `androidContext` 和 `androidLogger`。
:::

## 使用 KoinApplicationPreview 进行 Compose 预览

`KoinApplicationPreview` Compose 函数专用于预览 Composable：

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

在编写 Composable 函数时，您可以访问以下 Koin API：`koinInject()`，用于从 Koin 容器中注入实例。

对于声明了 'MyService' 组件的模块：

```kotlin
val androidModule = module {
    single { MyService() }
    // 或构造函数 DSL
    singleOf(::MyService)
}
```

我们可以像这样获取您的实例：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

为了与 Jetpack Compose 的函数式特性保持一致，最佳编写方式是将实例直接注入到函数形参中。这种方式允许通过 Koin 获得默认实现，同时保持以您喜欢的方式注入实例的灵活性。

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### 带有形参注入到 @Composable 中

当您从 Koin 请求新的依赖项时，可能需要注入形参。为此，您可以使用 `koinInject` 函数的 `parameters` 形参，并配合 `parametersOf()` 函数，如下所示：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
您可以使用 Lambda 注入的方式来使用形参，例如 `koinInject<MyService>{ parametersOf("a_string") }`，但如果周围发生大量重组，这可能会对性能产生影响。这种带有 Lambda 的版本需要在调用时展开您的形参，以帮助避免记住您的形参。

从 Koin 4.0.2 版本开始，引入了 `koinInject(Qualifier,Scope,ParametersHolder)`，让您能以最高效的方式使用形参。
:::

## 针对 @Composable 的 ViewModel

与访问经典的 single/factory 实例相同，您可以访问以下 Koin ViewModel API：

* `koinViewModel()` - 注入 ViewModel 实例
* `koinNavViewModel()` - 注入 ViewModel 实例 + Navigation 实参数据（如果您正在使用 `Navigation` API）

对于声明了 'MyViewModel' 组件的模块：

```kotlin
module {
    viewModel { MyViewModel() }
    // 或构造函数 DSL
    viewModelOf(::MyViewModel)
}
```

我们可以像这样获取您的实例：

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

我们可以在函数形参中获取您的实例：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Jetpack Compose 的更新不支持 Lazy API
:::

### 共享 Activity ViewModel (4.1 - Android)

您现在可以使用 `koinActivityViewModel()` 从同一个 ViewModel 宿主（Activity）中注入 ViewModel。

```kotlin
@Composable
fun App() {
    // 在 Activity 级别持有 ViewModel 实例
    val vm = koinActivityViewModel<MyViewModel>()
}
```

### 针对 @Composable 的 ViewModel 和 SavedStateHandle

您可以拥有一个 `SavedStateHandle` 构造函数形参，它将根据 Compose 环境（Navigation 返回栈或 ViewModel）进行注入。
它既可以通过 ViewModel `CreationExtras` 注入，也可以通过 Navigation `BackStackEntry` 注入：

```kotlin
// 在 Navhost 中设置 objectId 实参
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

// 在 ViewModel 中注入的实参
class DetailViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    init {
        println("$this - objectId: ${savedStateHandle.get<String>("objectId")}")
    }
}
```

:::note
关于 SavedStateHandle 注入差异的更多详情：https://github.com/InsertKoinIO/koin/issues/1935#issuecomment-2362335705
:::

### 共享 ViewModel 与 Navigation（实验性功能）

Koin Compose Navigation 现在拥有 `NavBackEntry.sharedKoinViewModel()` 函数，允许检索已存储在当前 `NavBackEntry` 中的 ViewModel。在您的导航部分，只需使用 `sharedKoinViewModel`：

```kotlin
navigation<Route.BookGraph>(
                startDestination = Route.BookList
            ) {
                composable<Route.BookList>(
                    exitTransition = { slideOutHorizontally() },
                    popEnterTransition = { slideInHorizontally() }
                ) {
                    // 在此处使用 SharedViewModel ...

                    val selectedBookViewModel =
                        it.sharedKoinViewModel<SelectedBookViewModel>(navController)
```

## 与 Composable 绑定的模块加载与卸载

Koin 为您提供了一种为给定 Composable 函数加载特定模块的方法。`rememberKoinModules` 函数会加载 Koin 模块并记录在当前 Composable 上：

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // 在首次调用此组件时加载模块
    rememberKoinModules(myModule)
}
```

您可以使用其中一个放弃函数，在两个方面卸载模块：
- onForgotten - 在组合被丢弃后
- onAbandoned - 组合失败时

为此，请为 `rememberKoinModules` 使用 `unloadOnForgotten` 或 `unloadOnAbandoned` 实参。

## 使用 Composable 创建 Koin 作用域

Composable 函数 `rememberKoinScope` 和 `KoinScope` 允许在 Composable 中处理 Koin 作用域，并在 Composable 结束后随之关闭作用域。

:::info
此 API 目前仍不稳定
:::