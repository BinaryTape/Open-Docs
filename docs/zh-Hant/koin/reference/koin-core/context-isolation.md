---
title: 上下文隔離
---

## 什麼是上下文隔離？

對於 SDK 開發者，您也可以用非全域的方式使用 Koin：使用 Koin 進行函式庫的依賴注入，並透過隔離您的上下文來避免使用您的函式庫與 Koin 的用戶之間的任何衝突。

通常，我們可以像這樣啟動 Koin：

```kotlin
// start a KoinApplication and register it in Global context
startKoin {

    // declare used modules
    modules(...)
}
```

這會使用預設的 Koin 上下文來註冊您的依賴項。

但如果我們想使用一個隔離的 Koin 實例，您需要宣告一個實例，並將其儲存在一個類別中以持有該實例。
您必須在您的函式庫中保持 Koin 應用程式實例的可用性，並將其傳遞給您自訂的 `KoinComponent` 實作：

`MyIsolatedKoinContext` 類別在此持有我們的 Koin 實例：

```kotlin
// Get a Context for your Koin instance
object MyIsolatedKoinContext {

    private val koinApp = koinApplication {
        // declare used modules
        modules(coffeeAppModule)
    }

    val koin = koinApp.koin 
}
```

讓我們使用 `MyIsolatedKoinContext` 來定義我們的 `IsolatedKoinComponent` 類別，這是一個將使用我們隔離上下文的 `KoinComponent`：

```kotlin
internal interface IsolatedKoinComponent : KoinComponent {

    // Override default Koin instance
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin
}
```

一切就緒，只需使用 `IsolatedKoinComponent` 從隔離的上下文中檢索實例：

```kotlin
class MyKoinComponent : IsolatedKoinComponent {
    // inject & get will target MyKoinContext
}
```

## 測試

為了測試那些使用 `by inject()` 委派來檢索依賴項的類別，請覆寫 `getKoin()` 方法並定義自訂的 Koin 模組：

```kotlin
class MyClassTest : KoinTest {
    // Koin Context used to retrieve dependencies
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin

    @Before
    fun setUp() {
       // Define custom Koin module
        val module = module {
            // Register dependencies
        }

        koin.loadModules(listOf(module))
    }
}
```