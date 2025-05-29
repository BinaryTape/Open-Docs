[//]: # (title: Compose 編譯器選項 DSL)

Compose 編譯器 Gradle 外掛程式為各種編譯器選項提供了領域特定語言 (DSL)。
你可以在套用該外掛程式的模組的 `build.gradle.kts` 檔案中，使用 `composeCompiler {}` 區塊來設定編譯器。

你可以指定兩種選項：

*   一般編譯器設定，可根據任何專案的需求啟用或停用。
*   功能旗標 (Feature flags)，用於啟用或停用新的和實驗性功能，這些功能最終應成為基準 (baseline) 的一部分。

你可以在 Compose 編譯器 Gradle 外掛程式 API 參考資料中找到 [可用的一般設定列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/) 和 [支援的功能旗標列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。

以下是一個設定範例：

```kotlin
composeCompiler {
    includeSourceInformation = true

    featureFlags = setOf(
        ComposeFeatureFlag.StrongSkipping.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups
    )
}
```

> Gradle 外掛程式為數個 Compose 編譯器選項提供了預設值，而這些選項在 Kotlin 2.0 之前僅需手動指定。
> 例如，如果你使用 `freeCompilerArgs` 設定了其中任何一項，Gradle 將會回報重複選項錯誤。
>
{style="warning"}

## 功能旗標的目的與用途

功能旗標被組織成一個單獨的選項集合，以盡量減少對頂層屬性的更改，因為新的旗標會持續推出和棄用。

要啟用預設為停用的功能旗標，請在集合中指定它，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

要停用預設為啟用的功能旗標，請呼叫其上的 `disabled()` 函數，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

如果你是直接設定 Compose 編譯器，請使用以下語法將功能旗標傳遞給它：

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

請參閱 Compose 編譯器 Gradle 外掛程式 API 參考資料中 [支援的功能旗標列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。