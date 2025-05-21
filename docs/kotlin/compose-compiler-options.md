---
title: "Compose 编译器选项 DSL"
---
Compose 编译器 Gradle 插件提供了一个 DSL（领域特定语言）用于配置各种编译器选项。
你可以使用它在 `build.gradle.kts` 文件中的 `composeCompiler {}` 块中配置编译器的选项，该文件对应于你应用该插件的模块。

你可以指定两种类型的选项：

* 通用编译器设置（General compiler settings），可以根据需要在任何给定的项目中禁用或启用。
* 特性标志（Feature flags），用于启用或禁用新的和实验性的特性，这些特性最终应成为基线的一部分。

你可以在 Compose 编译器 Gradle 插件 API 参考中找到 [可用通用设置的列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/) 和 [支持的特性标志的列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。

这是一个配置示例：

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
Gradle 插件为几个 Compose 编译器选项提供了默认值，这些选项在 Kotlin 2.0 之前只能手动指定。
如果你使用 `freeCompilerArgs` 设置了其中任何一个选项，Gradle 会报告重复选项错误。

:::

## 特性标志的目的和使用

特性标志被组织成一个单独的选项集合，以最大限度地减少顶级属性的更改，因为新的标志会不断推出和弃用。

要启用默认情况下禁用的特性标志，请在集合中指定它，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

要禁用默认情况下启用的特性标志，请对其调用 `disabled()` 函数，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

如果你直接配置 Compose 编译器，请使用以下语法将特性标志传递给它：

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

请参阅 Compose 编译器 Gradle 插件 API 参考中的 [支持的特性标志列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-Compose-feature-flag/-companion/)。