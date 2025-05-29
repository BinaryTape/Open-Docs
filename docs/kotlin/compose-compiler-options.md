[//]: # (title: Compose 编译器选项 DSL)

Compose 编译器 Gradle 插件为各种编译器选项提供了一个 DSL。
你可以在应用该插件的模块的 `build.gradle.kts` 文件中的 `composeCompiler {}` 块内配置编译器。

你可以指定两种类型的选项：

*   通用编译器设置，可根据需要在任何给定项目中禁用或启用。
*   功能标志 (Feature flags)，用于启用或禁用新的实验性功能，这些功能最终应成为基线的一部分。

你可以在 Compose 编译器 Gradle 插件 API 参考文档中找到[可用通用设置列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)和[支持的功能标志列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。

以下是一个示例配置：

```kotlin
composeCompiler {
    includeSourceInformation = true

    featureFlags = setOf(
        ComposeFeatureFlag.StrongSkipping.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups
    )
}
```

> Gradle 插件为一些 Compose 编译器选项提供了默认值，这些选项在 Kotlin 2.0 之前仅手动指定。
> 例如，如果你使用 `freeCompilerArgs` 设置了其中任何一个，Gradle 会报告重复选项错误。
>
{style="warning"}

## 功能标志的目的与用法

功能标志被组织成一组单独的选项，以便随着新标志的不断推出和弃用，最大程度地减少对顶层属性的更改。

要启用默认禁用的功能标志，请在集合中指定它，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

要禁用默认启用的功能标志，请在其上调用 `disabled()` 函数，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

如果你是直接配置 Compose 编译器，请使用以下语法将功能标志传递给它：

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

请参阅 Compose 编译器 Gradle 插件 API 参考文档中[支持的功能标志列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。