---
title: 在 Android 中進行注入
---

當你宣告了一些模組並啟動了 Koin 之後，該如何在 Android 的 Activity、Fragment 或 Service 中獲取執行個體？

## 支援 Android 類別

`Activity`、`Fragment` 與 `Service` 已透過 KoinComponents 擴充。任何 `ComponentCallbacks` 類別都可以使用 Koin 擴充功能。

你可以存取以下 Kotlin 擴充功能：

* `by inject()` - 從 Koin 容器延遲求值的執行個體
* `get()` - 從 Koin 容器立即獲取執行個體

我們可以將屬性宣告為延遲注入：

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

或者我們可以直接獲取執行個體：

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Retrieve a Presenter instance
    val presenter : Presenter = get()
}  
```

:::info
如果你的類別沒有擴充功能，只需在其中實作 `KoinComponent` 介面，即可從其他類別 `inject()` 或 `get()` 執行個體。
:::

## 在定義中使用 Android Context

一旦你的 `Application` 類別配置了 Koin，你就可以使用 `androidContext` 函式來注入 Android Context，以便稍後在模組中需要時進行解析：

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

在你的定義中，`androidContext()` 和 `androidApplication()` 函式允許你在 Koin 模組中獲取 `Context` 執行個體，幫助你輕鬆撰寫需要 `Application` 執行個體的運算式。

```kotlin
val appModule = module {

    // create a Presenter instance with injection of R.string.mystring resources from Android
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## Android 作用域與 Android Context 解析

當你具有一個繫結 `Context` 型別的作用域時，你可能需要從不同層級解析 `Context`。

讓我們看一個配置範例：

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

若要在 `MyPresenter` 中解析正確的型別，請使用以下方式：
- `get()` 將解析最接近的 `Context` 定義，此處將是來源作用域 `MyActivity`
- `androidContext()` 也將解析最接近的 `Context` 定義，此處將是來源作用域 `MyActivity`
- `androidApplication()` 則會解析 `Application` 定義，此處將是 Koin 設定中定義的來源作用域 `context` 物件