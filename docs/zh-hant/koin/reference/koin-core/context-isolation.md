---
title: "環境隔離 (Context Isolation)"
---
## 什麼是 Context Isolation (上下文隔離)？

對於 SDK 開發者來說，你也可以用非全域方式來使用 Koin：使用 Koin 為你的函式庫做依賴注入 (DI)，並且透過隔離你的 context (上下文) 來避免使用者使用你的函式庫和 Koin 時發生衝突。

通常，我們可以像這樣啟動 Koin：

```kotlin
// 啟動一個 KoinApplication 並將其註冊到全域 context 中
startKoin {

    // 宣告使用的模組
    modules(...)
}
```

這會使用預設的 Koin context 來註冊你的依賴。

但如果我們想要使用一個隔離的 Koin 實例，你需要宣告一個實例並將它儲存在一個類別中來保存你的實例。你必須讓你的 Koin Application 實例在你的函式庫中可用，並將它傳遞給你的自訂 KoinComponent 實作：

`MyIsolatedKoinContext` 類別在這裡保存我們的 Koin 實例：

```kotlin
// 為你的 Koin 實例取得一個 Context
object MyIsolatedKoinContext {

    private val koinApp = koinApplication {
        // 宣告使用的模組
        modules(coffeeAppModule)
    }

    val koin = koinApp.koin 
}
```

讓我們使用 `MyIsolatedKoinContext` 來定義我們的 `IsolatedKoinComponent` 類別，一個將使用我們隔離的 context 的 KoinComponent：

```kotlin
internal interface IsolatedKoinComponent : KoinComponent {

    // 覆寫預設的 Koin 實例
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin
}
```

一切就緒，只需使用 `IsolatedKoinComponent` 從隔離的 context 中檢索實例：

```kotlin
class MyKoinComponent : IsolatedKoinComponent {
    // inject & get 將指向 MyKoinContext
}
```

## 測試

要測試那些透過 `by inject()` 委託取得依賴的類別，覆寫 `getKoin()` 方法並定義自訂的 Koin 模組：

```kotlin
class MyClassTest : KoinTest {
    // 用於檢索依賴的 Koin Context
    override fun getKoin(): Koin = MyIsolatedKoinContext.koin

    @Before
    fun setUp() {
       // 定義自訂的 Koin 模組
        val module = module {
            // 註冊依賴
        }

        koin.loadModules(listOf(module))
    }
}
```