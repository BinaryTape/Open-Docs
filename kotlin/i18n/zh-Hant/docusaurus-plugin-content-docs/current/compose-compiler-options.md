---
title: "Compose 編譯器選項 DSL"
---
Compose 編譯器 Gradle 插件提供了一個 DSL（領域特定語言）用於各種編譯器選項。
您可以使用它在您要套用該插件的模組的 `build.gradle.kts` 檔案的 `composeCompiler {}` 區塊中配置編譯器。

您可以指定兩種選項：

*   一般的編譯器設定，可以根據需要在任何給定的專案中停用或啟用。
*   功能標誌 (Feature Flags)，用於啟用或停用新的和實驗性的功能，這些功能最終應成為基準的一部分。

您可以在 Compose 編譯器 Gradle 插件 API 參考中找到 [可用的一般設定清單](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)
和 [支援的功能標誌清單](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。

以下是一個範例配置：

```kotlin
composeCompiler {
   includeSourceInformation = true

   featureFlags = setOf(
           ComposeFeatureFlag.StrongSkipping.disabled(),
           ComposeFeatureFlag.OptimizeNonSkippingGroups
   )
}
```

:::caution
Gradle 插件為幾個 Compose 編譯器選項提供了預設值，這些選項在 Kotlin 2.0 之前只能手動指定。
如果您使用 `freeCompilerArgs` 設定了其中任何一個，例如，Gradle 會報告重複選項錯誤。

:::

## 功能標誌的目的和使用

功能標誌被組織成一個獨立的選項集合，以最大限度地減少頂層屬性的更改，因為新的標誌會不斷推出和棄用。

要啟用預設停用的功能標誌，請在集合中指定它，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

要停用預設啟用的功能標誌，請在其上調用 `disabled()` 函數，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

如果您直接配置 Compose 編譯器，請使用以下語法將功能標誌傳遞給它：

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

請參閱 Compose 編譯器 Gradle 插件 API 參考中的[支援的功能標誌清單](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。