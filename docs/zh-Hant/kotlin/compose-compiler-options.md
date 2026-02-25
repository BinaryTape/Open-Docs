[//]: # (title: Compose 編譯器選項 DSL)

Compose 編譯器 Gradle 外掛程式為各種編譯器選項提供了 DSL。
您可以在套用該外掛程式的模組 `build.gradle.kts` 檔案中，透過 `composeCompiler {}` 區塊來配置編譯器。

您可以指定兩類選項：

* 一般編譯器設定，可根據任何指定專案的需求停用或啟用。
* 用於啟用或停用新功能與實驗功能的功能旗標，這些功能最終應會成為基準的一部分。

您可以在 Compose 編譯器 Gradle 外掛程式 API 參考文件中找到 [可用的一般設定列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)
以及 [支援的功能旗標列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。

以下是一個配置範例：

```kotlin
composeCompiler {
    includeSourceInformation = true

    featureFlags = setOf(
        ComposeFeatureFlag.StrongSkipping.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups
    )
}
```

> Gradle 外掛程式為多個在 Kotlin 2.0 之前只能手動指定的 Compose 編譯器選項提供了預設值。
> 例如，如果您透過 `freeCompilerArgs` 設定了其中任何一項，Gradle 將會回報重複選項錯誤。
>
{style="warning"}

## 功能旗標的目的與用途

功能旗標被組織成一組獨立的選項，以在不斷推出新旗標或棄用舊旗標時，盡可能減少對頂層屬性的變動。

若要啟用預設停用的功能旗標，請在集合中指定該旗標，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

若要停用預設啟用的功能旗標，請對其呼叫 `disabled()` 函式，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

如果您是直接配置 Compose 編譯器，請使用以下語法將功能旗標傳遞給它：

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

請參閱 Compose 編譯器 Gradle 外掛程式 API 參考文件中的 [支援的功能旗標列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。