---
title: 上下文隔離
---

## 什麼是上下文隔離？

對於 SDK 製作人員（Makers），你也可以透過非全域的方式使用 Koin：在你的程式庫中使用 Koin 進行相依注入（DI），並透過隔離你的上下文（context），避免使用你程式庫的人與 Koin 產生任何衝突。

以標準方式，我們可以這樣啟動 Koin：

```kotlin
// 啟動一個 KoinApplication 並將其註冊到 Global context
startKoin {

    // 宣告使用的 modules
    modules(...)
}
```

這會使用預設的 Koin 上下文來註冊你的相依性。

但如果我們想使用隔離的 Koin 執行個體（instance），你需要宣告一個執行個體並將其存儲在一個類別中以持有該執行個體。
你必須讓你的 Koin 應用程式執行個體在程式庫中保持可用，並將其傳遞給你的自訂 `KoinComponent` 實作：

這裡的 `MyIsolatedKoinContext` 類別持有我們的 Koin 執行個體：

```kotlin
// 為你的 Koin 執行個體獲取一個 Context
object MyIsolatedKoinContext {

    private val koinApp = koinApplication {
        // 宣告使用的 modules
        modules(coffeeAppModule)
    }

    val koin = koinApp.koin 
}
```

讓我們使用 `MyIsolatedKoinContext` 來定義我們的 `IsolatedKoinComponent` 類別，這是一個將使用我們隔離上下文的 `KoinComponent`：

```kotlin
internal interface IsolatedKoinComponent : KoinComponent {

    // 覆寫預設的 Koin 執行個體
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin
}
```

一切準備就緒，只需使用 `IsolatedKoinComponent` 從隔離上下文中檢索執行個體：

```kotlin
class MyKoinComponent : IsolatedKoinComponent {
    // inject 與 get 將會以 MyKoinContext 為目標
}
```

## 測試

若要測試使用 `by inject()` 委派檢索相依性的類別，請覆寫 `getKoin()` 方法並定義自訂 Koin 模組：

```kotlin
class MyClassTest : KoinTest {
    // 用於檢索相依性的 Koin 上下文
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin

    @Before
    fun setUp() {
       // 定義自訂 Koin 模組
        val module = module {
            // 註冊相依性
        }

        koin.loadModules(listOf(module))
    }
}