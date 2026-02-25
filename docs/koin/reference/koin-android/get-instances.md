---
title: 在 Android 中注入
---

一旦你声明了一些模块并启动了 Koin，该如何在你 Android 的 Activity、Fragment 或 Service 中检索实例呢？

## 适用于 Android 类

`Activity`、`Fragment` 和 `Service` 已通过 `KoinComponents` 扩展程序进行了扩展。任何 `ComponentCallbacks` 类都可以访问 Koin 扩展。

你可以访问以下 Kotlin 扩展：

* `by inject()` - 来自 Koin 容器的延迟加载的实例
* `get()` - 从 Koin 容器中立即获取实例

我们可以将属性声明为延迟注入：

```kotlin
module {
    // Presenter 的定义
    factory { Presenter() }
}
```

```kotlin
class DetailActivity : AppCompatActivity() {

    // 延迟注入 Presenter
    override val presenter : Presenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        //...
    }
}
```

或者我们可以直接获取一个实例：

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // 检索一个 Presenter 实例
    val presenter : Presenter = get()
}  
```

:::info
如果你的类没有扩展，只需在其中实现 `KoinComponent` 接口，即可从另一个类 `inject()` 或 `get()` 实例。
:::

## 在定义中使用 Android Context

一旦你的 `Application` 类配置了 Koin，你就可以使用 `androidContext` 函数来注入 Android Context，以便稍后在模块中需要时可以解析它：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // 注入 Android context
            androidContext(this@MainApplication)
            // ...
        }
        
    }
}
```

在你的定义中，`androidContext()` 和 `androidApplication()` 函数允许你在 Koin 模块中获取 `Context` 实例，从而帮助你更简便地编写需要 `Application` 实例的表达式。

```kotlin
val appModule = module {

    // 创建一个 Presenter 实例，并注入来自 Android 的 R.string.mystring 资源
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## Android 作用域与 Android Context 解析

当你拥有一个绑定了 `Context` 类型的作用域时，你可能需要解析来自不同层级的 `Context`。

让我们看一个配置：

```kotlin
class MyPresenter(val context : Context)

startKoin {
  androidContext(context)
  modules(
    module {
      scope<MyActivity> {
        scoped { MyPresenter( <get() ???> ) }
      }
    }
  )
}
```

要在 `MyPresenter` 中解析正确的类型，请使用以下方法：
- `get()` 将解析最接近的 `Context` 定义，此处将是源作用域 `MyActivity`
- `androidContext()` 也将解析最接近的 `Context` 定义，此处将是源作用域 `MyActivity`
- `androidApplication()` 还将解析 `Application` 定义，此处将是 Koin 设置中定义的源作用域 `context` 对象