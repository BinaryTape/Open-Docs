[//]: # (title: Compose 编译器选项 DSL)

Compose 编译器 Gradle 插件为各种编译器选项提供了 DSL。
您可以在应用了该插件的模块的 `build.gradle.kts` 文件的 `composeCompiler {}` 代码块中使用它来配置编译器。

您可以指定两类选项：

* 常规编译器设置，可以根据给定项目的需要禁用或启用。
* 特性标志 (Feature flags)，用于启用或禁用新功能和实验性功能，这些功能最终应成为基准的一部分。

您可以在 Compose 编译器 Gradle 插件 API 参考中找到[可用常规设置列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)
和[支持的特性标志列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。

以下是一个配置示例：

```kotlin
composeCompiler {
    includeSourceInformation = true

    featureFlags = setOf(
        ComposeFeatureFlag.StrongSkipping.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups
    )
}
```

> Gradle 插件为几个在 Kotlin 2.0 之前只能手动指定的 Compose 编译器选项提供了默认值。
> 例如，如果您通过 `freeCompilerArgs` 设置了其中任何一项，Gradle 将报告重复选项错误。
>
{style="warning"}

## 特性标志的用途和用法

特性标志被组织成一组单独的选项，以便在不断推出和弃用新标志时，最大限度地减少对顶级属性的更改。

要启用默认禁用的特性标志，请在集合中指定它，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

要禁用默认启用的特性标志，请对其调用 `disabled()` 函数，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

如果您直接配置 Compose 编译器，请使用以下语法向其传递特性标志：

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

请参阅 Compose 编译器 Gradle 插件 API 参考中的[支持的特性标志列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。