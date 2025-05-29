[//]: # (title: Kotlin Gradle 插件中的编译器选项)

Kotlin 的每个版本都包含支持目标的编译器：JVM、JavaScript 以及适用于[支持平台](native-overview.md#target-platforms)的原生二进制文件。

这些编译器由以下工具使用：
*   当你为 Kotlin 项目点击 **Compile**（编译）或 **Run**（运行）按钮时，由 IDE 使用。
*   当你在控制台或 IDE 中调用 `gradle build` 时，由 Gradle 使用。
*   当你在控制台或 IDE 中调用 `mvn compile` 或 `mvn test-compile` 时，由 Maven 使用。

你也可以像[使用命令行编译器](command-line.md)教程中描述的那样，从命令行手动运行 Kotlin 编译器。

## 如何定义选项

Kotlin 编译器有许多选项可用于调整编译过程。

Gradle DSL 允许对编译器选项进行全面配置。它适用于 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) 和 [JVM/Android](#target-the-jvm) 项目。

使用 Gradle DSL，你可以在构建脚本中通过三个级别配置编译器选项：
*   **[扩展级别](#extension-level)**，在 `kotlin {}` 块中配置所有目标和共享源集。
*   **[目标级别](#target-level)**，在特定目标的块中配置。
*   **[编译单元级别](#compilation-unit-level)**，通常在特定编译任务中配置。

![Kotlin 编译器选项级别](compiler-options-levels.svg){width=700}

更高级别的设置将作为低级别的约定（默认值）：

*   在扩展级别设置的编译器选项是目标级别选项（包括 `commonMain`、`nativeMain` 和 `commonTest` 等共享源集）的默认值。
*   在目标级别设置的编译器选项是编译单元（任务）级别选项（如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任务）的默认值。

反过来，在较低级别进行的配置会覆盖较高级别的相关设置：

*   任务级别的编译器选项会覆盖目标级别或扩展级别的相关配置。
*   目标级别的编译器选项会覆盖扩展级别的相关配置。

要找出哪个级别的编译器参数适用于编译，请使用 Gradle [日志记录](https://docs.gradle.org/current/userguide/logging.html)的 `DEBUG` 级别。对于 JVM 和 JS/WASM 任务，在日志中搜索 `"Kotlin compiler args:"` 字符串；对于原生任务，搜索 `"Arguments ="` 字符串。

> 如果你是一名第三方插件作者，最好在项目级别应用你的配置，以避免覆盖问题。你可以使用新的 [Kotlin 插件 DSL 扩展类型](whatsnew21.md#new-api-for-kotlin-gradle-plugin-extensions)来实现这一点。建议你明确记录此配置。
>
{style="tip"}

### 扩展级别

你可以在顶层的 `compilerOptions {}` 块中配置所有目标和共享源集的通用编译器选项：

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### 目标级别

你可以在 `target {}` 块内的 `compilerOptions {}` 块中配置 JVM/Android 目标的编译器选项：

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

在 Kotlin 多平台项目中，你可以在特定目标内部配置编译器选项。例如，`jvm { compilerOptions {}}`。更多信息请参阅 [Multiplatform Gradle DSL reference](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。

### 编译单元级别

你可以在任务配置中的 `compilerOptions {}` 块内配置特定编译单元或任务的编译器选项：

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

你还可以通过 `KotlinCompilation` 访问和配置编译单元级别的编译器选项：

```Kotlin
kotlin {
    target {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {

                }
            }
        }
    }
}
```

如果你想配置一个不同于 JVM/Android 和 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) 的目标插件，请使用相应 Kotlin 编译任务的 `compilerOptions {}` 属性。以下示例展示了如何在 Kotlin 和 Groovy DSL 中设置此配置：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</tab>
</tabs>

## 定位 JVM

[如前所述](#how-to-define-options)，你可以在扩展、目标和编译单元级别（任务）为 JVM/Android 项目定义编译器选项。

默认的 JVM 编译任务，生产代码为 `compileKotlin`，测试代码为 `compileTestKotlin`。自定义源集的任务根据其 `compile<Name>Kotlin` 模式命名。

你可以通过在终端运行 `gradlew tasks --all` 命令，并在“其他任务”组中搜索 `compile*Kotlin` 任务名称来查看 Android 编译任务列表。

需要注意的一些重要细节：

*   `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置块会相互覆盖。最后一个（最低层级）块生效。
*   `kotlin.compilerOptions` 配置项目中的每个 Kotlin 编译任务。
*   你可以使用 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`（或 `tasks.withType<KotlinJvmCompile>().configureEach { }`）方法覆盖由 `kotlin.compilerOptions` DSL 应用的配置。

## 定位 JavaScript

JavaScript 编译任务，生产代码为 `compileKotlinJs`，测试代码为 `compileTestKotlinJs`，自定义源集为 `compile<Name>KotlinJs`。

要配置单个任务，请使用其名称：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

compileKotlin.compilerOptions.suppressWarnings.set(true)
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        suppressWarnings = true
    }
}
```

</tab>
</tabs>

请注意，对于 Gradle Kotlin DSL，你应首先从项目的 `tasks` 中获取任务。

对 JS 和通用目标，请分别使用 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 类型。

你可以通过在终端运行 `gradlew tasks --all` 命令，并在“其他任务”组中搜索 `compile*KotlinJS` 任务名称来查看 JavaScript 编译任务列表。

## 所有 Kotlin 编译任务

还可以配置项目中的所有 Kotlin 编译任务：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions { /*...*/ }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions { /*...*/ }
}
```

</tab>
</tabs>

## 所有编译器选项

以下是 Gradle 编译器的完整选项列表：

### 通用属性

| 名称              | 描述                                                                                                                              | 可能值                    | 默认值          |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | 用于配置[选择加入 (opt-in) 编译器参数](opt-in-requirements.md)列表的属性                                                 | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | 启用[渐进式编译器模式](whatsnew13.md#progressive-mode)                                                                  | `true`、`false`         | `false`       |
| `extraWarnings`   | 启用[额外的声明、表达式和类型编译器检查](whatsnew21.md#extra-compiler-checks)，如果为 `true` 则会发出警告 | `true`、`false`         | `false`       |

### JVM 特有属性

| 名称                      | 描述                                                                                                                                                                                                                                   | 可能值                                                                                         | 默认值               |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | 为 Java 1.8 方法参数反射生成元数据                                                                                                                                                                                                               |                                                                                                         | `false`                       |
| `jvmTarget`               | 生成的 JVM 字节码的目标版本                                                                                                                                                                                                  | "1.8"、"9"、"10"、...、"22"、"23"。另请参阅[编译器选项的类型](#types-for-compiler-options) | `"%defaultJvmTargetVersion%"` |
| `noJdk`                   | 不自动将 Java 运行时包含到类路径中                                                                                                                                                                                                              |                                                                                                         | `false`                       |
| `jvmTargetValidationMode` | <list><li>验证 Kotlin 和 Java 之间 [JVM 目标兼容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)</li><li>`KotlinCompile` 类型任务的属性。</li></list> | `WARNING`、`ERROR`、`IGNORE`                                                                              | `ERROR`                     |

### JVM 和 JavaScript 通用属性

| 名称 | 描述 | 可能值 | 默认值 |
|------|-------------|----------------------------------------------------------------|--------------|
| `allWarningsAsErrors` | 如果有任何警告则报告错误 | | `false` |
| `suppressWarnings` | 不生成警告 | | `false` |
| `verbose` | 启用详细的日志输出。仅在[启用 Gradle 调试日志级别](https://docs.gradle.org/current/userguide/logging.html)时有效 | | `false` |
| `freeCompilerArgs` | 额外编译器参数列表。你也可以在此使用实验性的 `-X` 参数。请参阅[通过 freeCompilerArgs 使用额外参数的示例](#example-of-additional-arguments-usage-via-freecompilerargs) | | `[]` |
| `apiVersion`      | 将声明的使用限制为指定版本捆绑库中的声明 | "1.8"、"1.9"、"2.0"、"2.1"、"2.2" (实验性) | |
| `languageVersion` | 提供与指定 Kotlin 版本的源代码兼容性                         | "1.8"、"1.9"、"2.0"、"2.1"、"2.2" (实验性)  | |

> 我们将在未来的版本中弃用 `freeCompilerArgs` 属性。如果你在 Kotlin Gradle DSL 中缺少某些选项，请[提交问题](https://youtrack.jetbrains.com/newissue?project=kt)。
>
{style="warning"}

#### 通过 freeCompilerArgs 使用额外参数的示例 {initial-collapse-state="collapsed" collapsible="true"}

使用 `freeCompilerArgs` 属性来提供额外（包括实验性）的编译器参数。你可以向此属性添加单个参数或参数列表：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

kotlin {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion.set(KotlinVersion.%gradleLanguageVersion%)
        jvmTarget.set(JvmTarget.JVM_1_8)
        
        // Single experimental argument
        freeCompilerArgs.add("-Xexport-kdoc")

        // Single additional argument
        freeCompilerArgs.add("-Xno-param-assertions")

        // List of arguments
        freeCompilerArgs.addAll(
            listOf(
                "-Xno-receiver-assertions",
                "-Xno-call-assertions"
            )
        ) 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion = KotlinVersion.%gradleLanguageVersion%
        jvmTarget = JvmTarget.JVM_1_8
        
        // Single experimental argument
        freeCompilerArgs.add("-Xexport-kdoc")
        
        // Single additional argument, can be a key-value pair
        freeCompilerArgs.add("-Xno-param-assertions")
        
        // List of arguments
        freeCompilerArgs.addAll(["-Xno-receiver-assertions", "-Xno-call-assertions"])
    }
}
```

</tab>
</tabs>

> `freeCompilerArgs` 属性在[扩展](#extension-level)、[目标](#target-level)和[编译单元（任务）](#compilation-unit-level)级别均可用。
>
{style="tip"}

#### 设置 languageVersion 的示例 {initial-collapse-state="collapsed" collapsible="true"}

要设置语言版本，请使用以下语法：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%
    }
```

</tab>
</tabs>

另请参阅[编译器选项的类型](#types-for-compiler-options)。

### JavaScript 特有属性

| 名称 | 描述 | 可能值 | 默认值 |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| `friendModulesDisabled` | 禁用内部声明导出                                                                                                                                                                                                      | | `false` |
| `main` | 指定 `main` 函数是否应在执行时被调用                                                                                                                                                                                                      | `JsMainFunctionExecutionMode.CALL`、`JsMainFunctionExecutionMode.NO_CALL`                                                                                                  | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind` | 编译器生成的 JS 模块类型                                                                                                                                                                                          | `JsModuleKind.MODULE_AMD`、`JsModuleKind.MODULE_PLAIN`、`JsModuleKind.MODULE_ES`、`JsModuleKind.MODULE_COMMONJS`、`JsModuleKind.MODULE_UMD`                                | `null`                               |
| `sourceMap` | 生成源映射                                                                                                                                                                                                                      | | `false` |
| `sourceMapEmbedSources` | 将源文件嵌入到源映射中                                                                                                                                                                                                   | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`、`JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`、`JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS` | `null`                               |
| `sourceMapNamesPolicy` | 将你在 Kotlin 代码中声明的变量和函数名添加到源映射中。有关行为的更多信息，请参阅我们的[编译器参考](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no) | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`、`JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`、`JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null`                               |
| `sourceMapPrefix` | 将指定前缀添加到源映射中的路径                                                                                                                                                                                      | | `null`                               |
| `target` | 为特定 ECMA 版本生成 JS 文件                                                                                                                                                                                              | `"es5"`、`"es2015"`                                                                                                                                                            | `"es5"`                              |
| `useEsClasses` | 允许生成的 JavaScript 代码使用 ES2015 类。在使用 ES2015 目标时默认启用                                                                                                                                                                                              | | `null`                               |

### 编译器选项的类型

某些 `compilerOptions` 使用新类型而非 `String` 类型：

| 选项                             | 类型                                                                                                                                                                                                              | 示例                                                                                              |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` 和 `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.%gradleLanguageVersion%)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## 接下来是什么？

了解更多关于：
*   [Kotlin Multiplatform DSL 参考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。
*   [增量编译、缓存支持、构建报告和 Kotlin 守护进程](gradle-compilation-and-caches.md)。
*   [Gradle 基础知识和具体内容](https://docs.gradle.org/current/userguide/userguide.html)。
*   [Gradle 插件变体支持](gradle-plugin-variants.md)。