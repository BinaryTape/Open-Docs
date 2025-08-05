[//]: # (title: Compose 编译器选项 DSL)

Compose 编译器 Gradle 插件提供了用于各种编译器选项的 DSL。你可以在应用该插件的模块的 `build.gradle.kts` 文件中的 `composeCompiler {}` 代码块中配置编译器。

你可以指定两种选项：

* 通用编译器设置，可以在任何给定项目中根据需要禁用或启用。
* 特性标志，用于启用或禁用新的实验性的特性，这些特性最终应成为基线的一部分。

你可以在 Compose 编译器 Gradle 插件 API 参考中找到[可用通用设置列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)和[支持的特性标志列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。

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

> Gradle 插件为一些在 Kotlin 2.0 之前仅能手动指定的 Compose 编译器选项提供了默认值。例如，如果你使用 `freeCompilerArgs` 设置了其中任何一个，Gradle 将报告重复选项错误。
>
{style="warning"}

## 特性标志的目的与用途

特性标志被组织成一组单独的选项，以最小化在新标志不断推出和弃用时对顶层属性的更改。

要启用默认禁用的特性标志，请在 set 中指定它，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

要禁用默认启用的特性标志，请调用其上的 `disabled()` 函数，例如：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

如果你直接配置 Compose 编译器，请使用以下语法向其传递特性标志：

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

关于支持的特性标志，请参见 Compose 编译器 Gradle 插件 API 参考中的[列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)。