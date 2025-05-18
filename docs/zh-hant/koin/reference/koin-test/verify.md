---
title: "驗證您的 Koin 組態 (Configuration)"
---
Koin 允許您驗證您的設定模組，避免在運行時發現依賴注入（Dependency Injection）問題。

## 使用 Verify() 進行 Koin 設定檢查 - 僅限 JVM [3.3]

在 Koin Module 上使用 `verify()` 擴展函式。就這麼簡單！在底層，這會驗證所有建構函式類別，並與 Koin 設定進行交叉檢查，以了解是否已為此依賴項宣告元件。 如果發生故障，該函式將拋出 `MissingKoinDefinitionException`。

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

        // 驗證 Koin 設定
        niaAppModule.verify()
    }
}
```

啟動 JUnit 測試，就完成了！✅

您可能會看到，我們使用額外的 Types 參數來列出 Koin 設定中使用但未直接宣告的類型。 `SavedStateHandle` 和 `WorkerParameters` 類型就是這種情況，它們被用作注入的參數。 `Context` 由啟動時的 `androidContext()` 函數宣告。

`verify()` API 非常輕巧，運行時不需要任何類型的 mock/stub。

## 驗證注入參數 - 僅限 JVM [4.0]

當您有一個包含使用 `parametersOf` 注入物件的設定時，驗證將會失敗，因為您的設定中沒有參數類型的定義。
但是，您可以定義一個參數類型，以便使用給定的定義 `definition<Type>(Class1::class, Class2::class ...)` 進行注入。

以下是如何操作：

```kotlin
class ModuleCheck {

    // 給定一個帶有注入定義的定義
    val module = module {
        single { (a: Simple.ComponentA) -> Simple.ComponentB(a) }
    }

    @Test
    fun checkKoinModule() {
        
        // 驗證並宣告注入的參數
        module.verify(
            injections = injectedParameters(
                definition<Simple.ComponentB>(Simple.ComponentA::class)
            )
        )
    }
}
```

## 類型白名單

我們可以將類型新增為「白名單」。 這表示對於任何定義，此類型都被視為存在於系統中。 以下是如何操作：

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // 驗證 Koin 設定
        niaAppModule.verify(
            // 列出定義中使用但未直接宣告的類型（例如參數注入）
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```