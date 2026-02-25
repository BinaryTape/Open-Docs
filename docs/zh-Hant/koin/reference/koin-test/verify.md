---
title: 驗證你的 Koin 設定
---

Koin 允許你驗證你的設定模組，避免在執行時才發現相依注入問題。

## 使用 Verify() 進行 Koin 設定檢查 - 僅限 JVM [3.3]

在 Koin 模組上使用 verify() 擴充方法。就是這樣！在底層，這將驗證所有建構函式類別，並與 Koin 設定進行交叉核對，以確認是否為該相依性宣告了組建。如果失敗，此函式將拋出 MissingKoinDefinitionException。

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

啟動 JUnit 測試，大功告成！ ✅

如你所見，我們使用額外的 Types 參數來列出 Koin 設定中使用但未直接宣告的型別。對於 SavedStateHandle 與 WorkerParameters 型別就是這種情況，它們被用作注入參數。Context 是在啟動時透過 androidContext() 函式宣告的。

verify() API 執行起來非常輕量，且不需要任何 mock/虛設常式即可針對你的設定執行。

## 使用注入參數進行驗證 - 僅限 JVM [4.0]

當你的設定隱含了使用 `parametersOf` 的注入物件時，驗證將會失敗，因為你的設定中沒有該參數型別的定義。
不過，你可以定義一個參數型別，透過指定的定義 `definition<Type>(Class1::class, Class2::class ...)` 進行注入。

操作方式如下：

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

## 型別白名單

我們可以將型別加入「白名單」。這代表對於任何定義，該型別都被視為存在於系統中。操作方式如下：

```kotlin
class NiaAppModuleCheck {

    @Test
    fun checkKoinModule() {

        // 驗證 Koin 設定
        niaAppModule.verify(
            // 列出定義中使用但未直接宣告的型別（例如參數注入）
            extraTypes = listOf(MyType::class ...)
        )
    }
}
```

## 核心註解 - 自動宣告安全型別

我們還在 Koin 主專案（位於 koin-core-annotations 模組下）中引入了註解，這些註解是從 Koin annotations 提取出來的。
這些註解透過使用 @InjectedParam 與 @Provided 來避免冗長的宣告，幫助 Koin 推論注入合約並驗證設定。這有助於識別這些元素，而不是使用複雜的 DSL 設定。
目前這些註解僅與 verify API 配合使用。

```kotlin
// 表示 "a" 是一個注入參數
class ComponentB(@InjectedParam val a: ComponentA)
// 表示 "a" 是動態提供的
class ComponentBProvided(@Provided val a: ComponentA)
```

這有助於在不編寫自訂驗證邏輯的情況下，防止測試或執行時出現微妙的問題。