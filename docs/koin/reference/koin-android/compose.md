---
title: 在 Jetpack Compose 中注入
---

本页面介绍了如何在你的 Jetpack Compose 应用中注入依赖 - https://developer.android.com/jetpack/compose

## 注入到 @Composable 中

在编写你的可组合函数时，你可以使用以下 Koin API：

* `get()` - 从 Koin 容器中获取实例
* `getKoin()` - 获取当前的 Koin 实例

对于一个声明了 'MyService' 组件的模块：

```kotlin
val androidModule = module {

    single { MyService() }
}
```

我们可以像这样获取你的实例：

```kotlin
@Composable
fun App() {
    val myService = get<MyService>()
}
```

:::note
为了与 Jetpack Compose 的函数式特性保持一致，最佳的编写方法是将实例直接注入到函数的属性中。这种方式允许 Koin 提供默认实现，但仍可以根据需要注入实例。
:::

```kotlin
@Composable
fun App(myService: MyService = get()) {
}
```

## @Composable 的 ViewModel

同样，除了访问传统的单例/工厂实例，你还可以使用以下 Koin ViewModel API：

* `getViewModel()` 或 `koinViewModel()` - 获取实例

对于一个声明了 'MyViewModel' 组件的模块：

```kotlin
module {
    viewModel { MyViewModel() }
    // or constructor DSL
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

:::warning
在 Jetpack Compose 1.1+ 版本更新后，不支持 Lazy API。
:::