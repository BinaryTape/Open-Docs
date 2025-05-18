---
title: "Koin 对 Jetpack Compose 和 Compose Multiplatform 的支持"
---
本页介绍如何为你的 [Android Jetpack Compose](https://developer.android.com/jetpack/compose) 或 [Multiplaform Compose](https://www.jetbrains.com/lp/compose-mpp/) 应用注入依赖。

## Koin Compose Multiplatform (Koin Compose 多平台) vs Koin Android Jetpack Compose

自 2024 年中期以来，Compose 应用程序可以使用 Koin Multiplatform API（Koin 多平台 API）来完成。Koin Jetpack Compose (koin-androidx-compose) 和 Koin Compose Multiplatform (koin-compose) 之间的所有 API 都是相同的。

### Compose 应该使用哪个 Koin 包？

对于仅使用 Android Jetpack Compose API 的纯 Android 应用程序，请使用以下包：
- `koin-androidx-compose` - 解锁 Compose 基础 API + Compose ViewModel API
- `koin-androidx-compose-navigation` - 集成 Navigation API 的 Compose ViewModel API

对于 Android/Multiplatform 应用程序，请使用以下包：
- `koin-compose` - Compose 基础 API
- `koin-compose-viewmodel` - Compose ViewModel API
- `koin-compose-viewmodel-navigation` - 集成 Navigation API 的 Compose ViewModel API

## 从现有的 Koin 上下文重新开始 (Koin 已经启动)

有时 `startKoin` 函数已经在应用程序中使用，以便在你的应用程序中启动 Koin（例如在 Android 主应用程序类，即 Application 类中）。在这种情况下，你需要使用 `KoinContext` 或 `KoinAndroidContext` 将当前 Koin 上下文告知你的 Compose 应用程序。这些函数会重用当前的 Koin 上下文并将其绑定到 Compose 应用程序。

```kotlin
@Composable
fun App() {
    // 将当前 Koin 实例设置到 Compose 上下文
    KoinContext() {

        MyScreen()
    }
}
```

:::info
`KoinAndroidContext` 和 `KoinContext` 之间的区别：
- `KoinAndroidContext` 在当前的 Android 应用程序上下文中查找 Koin 实例
- `KoinContext` 在当前的 GlobalContext 中查找 Koin 实例
:::

:::note
如果从 Composable 中收到一些 `ClosedScopeException`，请在你的 Composable 上使用 `KoinContext`，或者确保使用 [Android 上下文](/reference/koin-android/start.md) 进行正确的 Koin 启动配置
:::

## 使用 Compose App 启动 Koin - KoinApplication

`KoinApplication` 函数有助于创建 Koin 应用程序实例，作为一个 Composable：

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(...)
    }) {
        
        // 你的屏幕在这里 ...
        MyScreen()
    }
}
```

`KoinApplication` 函数将处理 Koin 上下文的启动和停止，具体取决于 Compose 上下文的周期。此函数启动和停止一个新的 Koin 应用程序上下文。

:::info
在 Android 应用程序中，`KoinApplication` 将处理任何需要停止/重新启动 Koin 上下文的需求，具体取决于配置更改或 Activities 的删除。
:::

:::note
这取代了使用经典的 `startKoin` 应用程序函数。
:::

### 使用 Koin 进行 Compose 预览

`KoinApplication` 函数对于启动预览的专用上下文非常有用。 这也可以用于帮助 Compose 预览：

```kotlin
@Composable
@Preview
fun App() {
    KoinApplication(application = {
        // 你的预览配置在这里
        modules(previewModule)
    }) {
        // 使用 Koin 组合以进行预览
    }
}
```

## 注入到 @Composable 中

在编写你的 composable 函数时，你可以访问以下 Koin API：`koinInject()`，用于从 Koin 容器注入实例

对于声明 'MyService' 组件的模块：

```kotlin
val androidModule = module {
    single { MyService() }
    // 或构造函数 DSL
    singleOf(::MyService)
}
```

我们可以像这样获取你的实例：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>()
}
```

为了与 Jetpack Compose 的函数式方面保持一致，最好的编写方法是将实例直接注入到函数参数中。 这样允许使用 Koin 具有默认实现，但保持可以按你想要的方式注入实例。

```kotlin
@Composable
fun App(myService: MyService = koinInject()) {

}
```

### 将参数注入到 @Composable 中

当你从 Koin 请求新的依赖项时，你可能需要注入参数。为此，你可以使用 `koinInject` 函数的 `parameters` 参数，以及 `parametersOf()` 函数，如下所示：

```kotlin
@Composable
fun App() {
    val myService = koinInject<MyService>(parameters = parametersOf("a_string"))
}
```

:::info
你可以将参数与 lambda 注入一起使用，例如 `koinInject<MyService>{ parametersOf("a_string") }`，但是如果你的大量围绕进行重组，这可能会对性能产生影响。这个带有 lambda 的版本需要在调用时解包你的参数，以帮助避免记住你的参数。

从 Koin 的 4.0.2 版本开始，引入了 koinInject(Qualifier,Scope,ParametersHolder)，让你以最有效的方式使用参数
:::

## @Composable 的 ViewModel

与访问经典单例/工厂实例的方式相同，你可以访问以下 Koin ViewModel API：

* `koinViewModel()` - 注入 ViewModel 实例
* `koinNavViewModel()` - 注入 ViewModel 实例 + Navigation 参数数据（如果你正在使用 `Navigation` API）

对于声明 'MyViewModel' 组件的模块：

```kotlin
module {
    viewModel { MyViewModel() }
    // 或构造函数 DSL
    viewModelOf(::MyViewModel)
}
```

我们可以像这样获取你的实例：

```kotlin
@Composable
fun App() {
    val vm = koinViewModel<MyViewModel>()
}
```

我们可以在函数参数中获取你的实例：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::note
Jetpack Compose 的更新不支持 Lazy API
:::

### @Composable 的 ViewModel 和 SavedStateHandle

你可以拥有一个 `SavedStateHandle` 构造函数参数，它将根据 Compose 环境（Navigation BackStack 或 ViewModel）进行注入。
它既可以通过 ViewModel `CreationExtras` 注入，也可以通过 Navigation `BackStackEntry` 注入：

```kotlin
// 在 Navhost 中设置 objectId 参数
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

// 注入 ViewModel 中的参数
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

## 模块加载和卸载与 Composable 相关联

Koin 为你提供了一种为给定的 Composable 函数加载特定模块的方法。 `rememberKoinModules` 函数加载 Koin 模块并在当前 Composable 上记住：

```kotlin
@Composable
@Preview
fun MyComponentComposable() {
    // 在此组件的第一次调用时加载模块
    rememberKoinModules(myModule)
}
```

你可以使用其中一个放弃函数，以在 2 个方面卸载模块：
- onForgotten - 在组合被删除后
- onAbandoned - 组合失败

为此，请使用 `rememberKoinModules` 的 `unloadOnForgotten` 或 `unloadOnAbandoned` 参数。

## 使用 Composable 创建 Koin Scope

Composable 函数 `rememberKoinScope` 和 `KoinScope` 允许在 Composable 中处理 Koin Scope，后续当前以在 Composable 结束后关闭 scope。

:::info
此 API 目前仍不稳定
:::