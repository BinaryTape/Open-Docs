---
title: "在 Android 中注入"
---
一旦你声明了一些模块，并且启动了 Koin，你如何在你的 Android `Activity`、`Fragment` 或 `Service` 中检索你的实例呢？

## 为 Android 类准备就绪

`Activity`、`Fragment` & `Service` 通过 `KoinComponents` 扩展进行了扩展。任何 `ComponentCallbacks` 类都可以访问 Koin 扩展。

你可以获得 Kotlin 扩展的访问权限：

* `by inject()` - 从 Koin 容器延迟计算的实例
* `get()` - 从 Koin 容器立即获取实例

我们可以将一个属性声明为延迟注入：

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
如果你的类没有扩展，只需在其中实现 `KoinComponent` 接口，即可从另一个类 `inject()` 或 `get()` 一个实例。
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

在你的定义中，`androidContext()` & `androidApplication()` 函数允许你在 Koin 模块中获取 `Context` 实例，以帮助你简单地编写需要 `Application` 实例的表达式。

```kotlin
val appModule = module {

    // 创建一个 Presenter 实例，该实例从 Android 注入 R.string.mystring 资源
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## Android Scope & Android Context 解析

当你的作用域绑定了 `Context` 类型时，你可能需要从不同的级别解析 `Context`。

让我们来看一个配置：

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
- `get()` 将解析最接近的 `Context` 定义，这里它将是源作用域 `MyActivity`
- `androidContext()` 也会解析最接近的 `Context` 定义，这里它将是源作用域 `MyActivity`
- `androidApplication()` 也会解析 `Application` 定义，这里它将是在 Koin 设置中定义的源作用域 `context` 对象