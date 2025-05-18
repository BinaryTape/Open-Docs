---
title: "在 Jetpack Compose 中进行注入"
---
本页介绍如何为你的 Jetpack Compose 应用注入依赖 - https://developer.android.com/jetpack/compose

## 注入到 @Composable 中

在编写 composable 函数时，你可以访问以下 Koin API：

* `get()` - 从 Koin 容器中获取实例
* `getKoin()` - 获取当前的 Koin 实例

对于声明 'MyService' 组件的模块：

```kotlin
val androidModule = module {

    single { MyService() }
}
```

我们可以这样获取你的实例：

```kotlin
@Composable
fun App() {
    val myService = get<MyService>()
}
```

:::note 
为了与 Jetpack Compose 的函数式方面保持一致，最好的编写方式是将实例直接注入到函数属性中。 这样可以在 Koin 中使用默认实现，但仍然可以根据你的需要注入实例。
:::

```kotlin
@Composable
fun App(myService: MyService = get()) {
}
```

## @Composable 的 ViewModel

与访问经典 single/factory 实例的方式相同，你可以访问以下 Koin ViewModel API：

* `getViewModel()` 或 `koinViewModel()` - 获取实例

对于声明 'MyViewModel' 组件的模块：

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

我们可以通过函数参数获取你的实例：

```kotlin
@Composable
fun App(vm : MyViewModel = koinViewModel()) {

}
```

:::warning
Jetpack Compose 1.1+ 的更新不支持 Lazy API
:::