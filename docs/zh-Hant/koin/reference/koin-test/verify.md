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

        // Verify Koin configuration
        niaAppModule.verify()
    }
}
```

啟動 JUnit 測試，即可完成！✅

您可能會看到，我們使用 `extra Types` 參數來列出在 Koin 配置中使用但未直接宣告的類型。`SavedStateHandle` 和 `WorkerParameters` 類型就是這種情況，它們被用作注入的參數。`Context` 在啟動時由 `androidContext()` 函數宣告。

這個 `verify()` API 運行起來非常輕量，並且不需要任何類型的模擬 (mock)/存根 (stub) 即可在您的配置上運行。

## 使用注入參數進行驗證 - 僅限 JVM [4.0]

當您的配置涉及使用 `parametersOf` 注入物件時，驗證將會失敗，因為您的配置中沒有參數類型的定義。
然而，您可以定義一個參數類型，以便透過給定的定義 `definition<Type>(Class1::class, Class2::class ...)` 注入。

以下是如何實現的：

```kotlin
class ModuleCheck {

    // given a definition with an injected definition
    val module = module {
        single { (a: Simple.ComponentA) -> Simple.ComponentB(a) }
    }

    @Test
    fun checkKoinModule() {

        // Verify and declare Injected Parameters
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

        // Verify Koin configuration
        niaAppModule.verify(
            // List types used in definitions but not declared directly (like parameters injection)
            extraTypes = listOf(MyType::class ...)
        )
    }
}