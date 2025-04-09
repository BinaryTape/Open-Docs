---
title: "在 Android 中注入 (Injecting)"
---
一旦你宣告了一些模組，並且啟動了 Koin，你要如何在你的 Android `Activity`、`Fragment` 或 `Service` 中取得你的實例呢？

## 準備好用於 Android 類別

`Activity`、`Fragment` & `Service` 透過 KoinComponents 擴充功能擴充。任何 `ComponentCallbacks` 類別都可以存取 Koin 擴充功能。

你可以使用 Kotlin 擴充功能：

* `by inject()` - 從 Koin 容器延遲評估的實例
* `get()` - 從 Koin 容器主動獲取的實例

我們可以宣告一個屬性為延遲注入：

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

或者我們可以簡單地直接取得一個實例：

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Retrieve a Presenter instance
    val presenter : Presenter = get()
}  
```

:::info
如果你的類別沒有擴充功能，只需在其中實作 `KoinComponent` 介面，即可從另一個類別 `inject()` 或 `get()` 一個實例。
:::

## 在定義中使用 Android Context (上下文)

一旦你的 `Application` 類別配置了 Koin，你可以使用 `androidContext` 函數注入 Android Context (上下文)，以便稍後在模組中需要時解析它：

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

在你的定義中，`androidContext()` & `androidApplication()` 函數允許你在 Koin 模組中取得 `Context` (上下文)實例，以幫助你簡單地編寫需要 `Application` 實例的表達式。

```kotlin
val appModule = module {

    // create a Presenter instance with injection of R.string.mystring resources from Android
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## Android Scope (作用域) & Android Context (上下文) 解析

當你有一個 Scope (作用域)綁定 `Context` (上下文)類型時，你可能需要從不同的層級解析 `Context` (上下文)。

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
- `get()` 將解析最接近的 `Context` (上下文)定義，這裡將是來源 Scope (作用域) `MyActivity`
- `androidContext()` 也將解析最接近的 `Context` (上下文)定義，這裡將是來源 Scope (作用域) `MyActivity`
- `androidApplication()` 也將解析 `Application` 定義，這裡將是在 Koin 設置中定義的來源 Scope (作用域) `context` 物件

    ```