[//]: # (title: Compose 編譯器選項 DSL)

Compose 編譯器 Gradle 外掛程式為各種編譯器選項提供了 DSL。您可以在套用該外掛程式的模組的 `build.gradle.kts` 檔案中，使用 `composeCompiler {}` 區塊來配置編譯器。

您可以指定兩種選項：

* 一般編譯器設定，可根據需要在任何專案中停用或啟用。
* 可啟用或停用新的實驗性功能的功能標誌，這些功能最終應成為基準線的一部分。

您可以在 Compose 編譯器 Gradle 外掛程式 API 參考中找到 [可用一般設定清單](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/) 和 [支援的功能標誌清單](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。

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

> Gradle 外掛程式為一些 Compose 編譯器選項提供了預設值，這些選項在 Kotlin 2.0 之前只能手動指定。例如，如果您使用 `freeCompilerArgs` 設定了其中任何一個選項，Gradle 會報告重複選項錯誤。
>
{style="warning"}

## 功能標誌的目的與用途

功能標誌被組織成一個獨立的選項集，以最大限度地減少對頂層屬性的更改，因為新標誌會不斷推出和棄用。

若要啟用預設為停用的功能標誌，請在該集合中指定它，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

若要停用預設為啟用的功能標誌，請在其上呼叫 `disabled()` 函數，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

如果您直接配置 Compose 編譯器，請使用以下語法將功能標誌傳遞給它：

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

請參閱 Compose 編譯器 Gradle 外掛程式 API 參考中的 [支援的功能標誌清單](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。