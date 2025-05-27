---
title: 在 Android 中注入
---

一旦您宣告了一些模組並啟動了 Koin，如何在您的 Android Activity、Fragment 或 Service 中取得您的實例呢？

## 準備好用於 Android 類別

`Activity`、`Fragment` 和 `Service` 已透過 `KoinComponents` 擴充功能進行了擴展。任何 `ComponentCallbacks` 類別都可以存取 Koin 擴充功能。

您可以存取以下 Kotlin 擴充功能：

*   `by inject()` - 從 Koin 容器中惰性評估的實例
*   `get()` - 從 Koin 容器中急切取得的實例

我們可以將屬性宣告為惰性注入：

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

或者我們可以直接取得一個實例：

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Retrieve a Presenter instance
    val presenter : Presenter = get()
}  
```

:::info
如果您的類別沒有擴充功能，只需實作 `KoinComponent` 介面即可在其中 `inject()` 或 `get()` 從另一個類別取得實例。
:::

## 在定義中使用 Android Context

一旦您的 `Application` 類別配置了 Koin，您就可以使用 `androidContext` 函數注入 Android Context，以便之後在模組中需要它時可以解析它：

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

在您的定義中，`androidContext()` 和 `androidApplication()` 函數允許您在 Koin 模組中取得 `Context` 實例，以幫助您簡單地撰寫需要 `Application` 實例的表達式。

```kotlin
val appModule = module {

    // create a Presenter instance with injection of R.string.mystring resources from Android
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## Android Scope 和 Android Context 解析

當您有一個綁定 `Context` 類型的 Scope 時，您可能需要從不同的層級解析 `Context`。

讓我們來看一個配置：

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

要在 `MyPresenter` 中解析正確的類型，請使用以下方法：
- `get()` 將解析最接近的 `Context` 定義，在這裡它將是來源 Scope `MyActivity`
- `androidContext()` 也將解析最接近的 `Context` 定義，在這裡它將是來源 Scope `MyActivity`
- `androidApplication()` 也將解析 `Application` 定義，在這裡它將是 Koin 設定中定義的來源 Scope `context` 物件