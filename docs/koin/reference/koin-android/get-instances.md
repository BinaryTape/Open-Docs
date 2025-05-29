---
title: 在 Android 中注入
---

一旦你声明了一些模块并启动了 Koin，如何在你的 Android `Activity`、`Fragment` 或 `Service` 中检索你的实例呢？

## 适用于 Android 类

`Activity`、`Fragment` 和 `Service` 都通过 KoinComponents 扩展得到了增强。任何 `ComponentCallbacks` 类都可以访问 Koin 扩展。

你将获得以下 Kotlin 扩展的访问权限：

*   `by inject()` - 从 Koin 容器中惰性评估的实例
*   `get()` - 从 Koin 容器中急切获取实例

我们可以将一个属性声明为惰性注入：

```kotlin
module {
    // definition of Presenter
    factory { Presenter() }
}
```

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy inject Presenter
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

    // Retrieve a Presenter instance
    val presenter : Presenter = get()
}  
```

:::info
如果你的类没有这些扩展，只需实现 `KoinComponent` 接口，即可从其他类中 `inject()` 或 `get()` 实例。
:::

## 在定义中使用 Android Context

一旦你的 `Application` 类配置了 Koin，你就可以使用 `androidContext` 函数来注入 Android Context，以便以后在模块中需要它时可以解析：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // inject Android context
            androidContext(this@MainApplication)
            // ...
        }
        
    }
}
```

在你的定义中，`androidContext()` 和 `androidApplication()` 函数允许你在 Koin 模块中获取 `Context` 实例，帮助你简单地编写需要 `Application` 实例的表达式。

```kotlin
val appModule = module {

    // create a Presenter instance with injection of R.string.mystring resources from Android
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## Android 作用域和 Android Context 解析

当你有一个绑定 `Context` 类型的作用域时，你可能需要从不同的级别解析 `Context`。

我们来看一个配置：

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

为了在 `MyPresenter` 中解析正确的类型，请使用以下方法：
-   `get()` 将解析最接近的 `Context` 定义，这里将是源作用域 `MyActivity`
-   `androidContext()` 也将解析最接近的 `Context` 定义，这里将是源作用域 `MyActivity`
-   `androidApplication()` 也将解析 `Application` 定义，这里将是 Koin 设置中定义的源作用域 `context` 对象