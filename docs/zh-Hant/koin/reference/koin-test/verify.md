---
title: 驗證您的 Koin 配置
---

Koin 允許您驗證您的配置模組，避免在運行時發現依賴注入問題。

## 使用 Verify() 進行 Koin 配置檢查 - 僅限 JVM [3.3]

在 Koin 模組上使用 `verify()` 擴展函數即可！在幕後，這將驗證所有建構函數類別並與 Koin 配置進行交叉檢查，以確認是否存在為此依賴項宣告的元件。如果失敗，該函數將拋出 `MissingKoinDefinitionException`。

```kotlin
val niaAppModule = module {
    includes(
        jankStatsKoinModule,
        dataKoinModule,
        syncWorkerKoinModule,
        topicKoinModule,
        authorKoinModule,
        interestsKoinModule,
        settingsKoinModule,
        bookMarksKoinModule,
        forYouKoinModule
    )
    viewModelOf(::MainActivityViewModel)
}
```

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // 驗證 Koin 配置
        niaAppModule.verify()
    }
}
```

啟動 JUnit 測試，即可完成！✅

您可能會看到，我們使用 `extra Types` 參數來列出在 Koin 配置中使用但未直接宣告的類型。`SavedStateHandle` 和 `WorkerParameters` 類型就是這種情況，它們被用作注入的參數。`Context` 在啟動時由 `androidContext()` 函數宣告。

`verify()` API 運行起來非常輕量，並且不需要任何類型的模擬 (mock)/存根 (stub) 即可在您的配置上運行。

## 使用注入參數進行驗證 - 僅限 JVM [4.0]

當您的配置涉及使用 `parametersOf` 注入物件時，驗證將會失敗，因為您的配置中沒有參數類型的定義。
然而，您可以定義一個參數類型，以便透過給定的定義 `definition<Type>(Class1::class, Class2::class ...)` 注入。

以下是如何實現的：

```kotlin
class ModuleCheck {

    // 給定一個帶有注入定義的定義
    val module = module {
        single { (a: Simple.ComponentA) -> Simple.ComponentB(a) }
    }

    @Test
    fun checkKoinModule() {
        
        // 驗證並宣告注入參數
        module.verify(
            injections = injectedParameters(
                definition<Simple.ComponentB>(Simple.ComponentA::class)
            )
        )
    }
}
```

## 類型白名單

我們可以將類型添加為「白名單」。這意味著該類型對於任何定義都被視為系統中存在的。以下是如何實現的：

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // 驗證 Koin 配置
        niaAppModule.verify(
            // 列出用於定義中但未直接宣告的類型（例如參數注入）
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```

## 核心註解 - 自動宣告安全類型

我們還在主要的 Koin 專案中（位於 `koin-core-annotations` 模組下）引入了註解，這些註解是從 Koin 註解中提取的。
這些註解透過使用 `@InjectedParam` 和 `@Provided` 避免了冗長的宣告，以幫助 Koin 推斷注入合約並驗證配置。這有助於識別這些元素，而不是採用複雜的 DSL 配置。
目前，這些註解僅與 `verify` API 結合使用。

```kotlin
// 表示 "a" 是一個注入參數
class ComponentB(@InjectedParam val a: ComponentA)
// 表示 "a" 是動態提供的
class ComponentBProvided(@Provided val a: ComponentA)
```

這有助於防止在測試或運行時出現的細微問題，而無需編寫自訂驗證邏輯。