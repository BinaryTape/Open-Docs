---
title: "Kotlin Gradle 插件中的编译器选项"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 的每个版本都包含针对支持目标的编译器：JVM、JavaScript 以及适用于[支持平台](native-overview#target-platforms)的原生二进制文件。

这些编译器被以下对象使用：
* IDE，当你点击 Kotlin 项目的“__编译__”或“__运行__”按钮时。
* Gradle，当你控制台中或 IDE 中调用 `gradle build` 时。
* Maven，当你控制台中或 IDE 中调用 `mvn compile` 或 `mvn test-compile` 时。

你还可以从命令行手动运行 Kotlin 编译器，如[使用命令行编译器](command-line)教程中所述。

## 如何定义选项

Kotlin 编译器有许多选项可用于定制编译过程。

Gradle DSL 允许对编译器选项进行全面的配置。它适用于 [Kotlin Multiplatform](multiplatform-dsl-reference) 和 [JVM/Android](#target-the-jvm) 项目。

使用 Gradle DSL，你可以在构建脚本中的三个级别配置编译器选项：
* **[扩展级别](#extension-level)**，在 `kotlin {}` 块中，用于所有目标和共享源码集。
* **[目标级别](#target-level)**，在特定目标的块中。
* **[编译单元级别](#compilation-unit-level)**，通常在特定的编译任务中。

<img src="/img/compiler-options-levels.svg" alt="Kotlin compiler options levels" width="700" style={{verticalAlign: 'middle'}}/>

较高级别的设置用作较低级别的约定（默认值）：

* 在扩展级别设置的编译器选项是目标级别选项的默认值，包括共享源码集，如 `commonMain`、`nativeMain` 和 `commonTest`。
* 在目标级别设置的编译器选项是编译单元（任务）级别选项的默认值，如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任务。

反过来，在较低级别进行的配置会覆盖在较高级别上的相关设置：

* 任务级别的编译器选项会覆盖目标级别或扩展级别的相关配置。
* 目标级别的编译器选项会覆盖扩展级别的相关配置。

要了解哪个级别的编译器参数应用于编译，请使用 Gradle [logging](https://docs.gradle.org/current/userguide/logging.html) 的 `DEBUG` 级别。对于 JVM 和 JS/WASM 任务，请在日志中搜索 `“Kotlin compiler args:”` 字符串；对于 Native 任务，搜索 `“Arguments =”` 字符串。

:::tip
如果你是第三方插件作者，最好在项目级别应用你的配置，以避免覆盖问题。你可以使用新的 [Kotlin 插件 DSL 扩展类型](whatsnew21#new-api-for-kotlin-gradle-plugin-extensions) 来实现这一点。建议你在你的文档中明确说明此配置。

:::

### 扩展级别

你可以在顶层 `compilerOptions {}` 块中配置所有目标和共享源码集的通用编译器选项：

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### 目标级别

你可以在 `target {}` 块内的 `compilerOptions {}` 块中为 JVM/Android 目标配置编译器选项：

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

在 Kotlin Multiplatform 项目中，你可以在特定的目标内配置编译器选项。例如，`jvm { compilerOptions {}}`。有关更多信息，请参见 [Multiplatform Gradle DSL reference](multiplatform-dsl-reference)。

### 编译单元级别

你可以在任务配置内的 `compilerOptions {}` 块中为特定的编译单元或任务配置编译器选项：

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

你还可以通过 `KotlinCompilation` 在编译单元级别访问和配置编译器选项：

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

如果要配置与 JVM/Android 和 [Kotlin Multiplatform](multiplatform-dsl-reference) 不同的目标的插件，请使用相应 Kotlin 编译任务的 `compilerOptions {}` 属性。以下示例展示了如何在 Kotlin 和 Groovy DSL 中设置此配置：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</TabItem>
</Tabs>

## 目标 JVM

[如前所述](#how-to-define-options)，你可以在扩展、目标和编译单元级别（任务）为你的 JVM/Android 项目定义编译器选项。

默认的 JVM 编译任务对于生产代码称为 `compileKotlin`，对于测试代码称为 `compileTestKotlin`。自定义源码集的任务根据其 `compile<Name>Kotlin` 模式命名。

你可以通过在终端中运行 `gradlew tasks --all` 命令并在 `Other tasks` 组中搜索 `compile*Kotlin` 任务名称来查看 Android 编译任务的列表。

需要注意的一些重要细节：

* `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置块相互覆盖。最后一个（最低）块生效。
* `kotlin.compilerOptions` 配置项目中的每个 Kotlin 编译任务。
* 你可以使用 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`（或 `tasks.withType<KotlinJvmCompile>().configureEach { }`）方法覆盖由 `kotlin.compilerOptions` DSL 应用的配置。

## 目标 JavaScript

JavaScript 编译任务对于生产代码称为 `compileKotlinJs`，对于测试代码称为 `compileTestKotlinJs`，对于自定义源码集称为 `compile<Name>KotlinJs`。

要配置单个任务，请使用其名称：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

compileKotlin.compilerOptions.suppressWarnings.set(true)
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        suppressWarnings = true
    }
}
```

</TabItem>
</Tabs>

请注意，使用 Gradle Kotlin DSL 时，应首先从项目的 `tasks` 中获取任务。

对于 JS 和通用目标，分别使用 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 类型。

你可以通过在终端中运行 `gradlew tasks --all` 命令并在 `Other tasks` 组中搜索 `compile*KotlinJS` 任务名称来查看 JavaScript 编译任务的列表。

## 所有 Kotlin 编译任务

也可以配置项目中所有的 Kotlin 编译任务：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions { /*...*/ }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions { /*...*/ }
}
```

</TabItem>
</Tabs>

## 所有编译器选项

以下是 Gradle 编译器的完整选项列表：

### 常用属性

| Name              | Description                                                                                                                              | Possible values           | Default value |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | 用于配置 [选择性加入编译器参数](opt-in-requirements) 列表的属性                                                                     | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | 启用 [渐进式编译器模式](whatsnew13#progressive-mode)                                                                               | `true`, `false`           | `false`       |
| `extraWarnings`   | 如果为 true，则启用 [额外的声明、表达式和类型编译器检查](whatsnew21#extra-compiler-checks)，这些检查会发出警告 | `true`, `false`           | `false`       |

### JVM 特有属性

| Name                      | Description                                                                                                                                                                                                                                   | Possible values                                                                                         | Default value               |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | 为 Java 1.8 反射生成方法参数的元数据                                                                                                                                                                                |                                                                                                         | false                       |
| `jvmTarget`               | 生成的 JVM 字节码的目标版本                                                                                                                                                                                                  | "1.8", "9", "10", ...,  "22", "23". 另请参见 [编译器选项的类型](#types-for-compiler-options) | "1.8" |
| `noJdk`                   | 不要自动将 Java 运行时包含到类路径中                                                                                                                                                                               |                                                                                                         | false                       |
| `jvmTargetValidationMode` | <list><li>验证 Kotlin 和 Java 之间的 [JVM 目标兼容性](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)</li><li>`KotlinCompile` 类型的任务的属性。</li></list> | `WARNING`, `ERROR`, `IGNORE`                                                                              | `ERROR`                     |

### JVM 和 JavaScript 通用属性

| Name | Description | Possible values                                                |Default value |
|------|-------------|----------------------------------------------------------------|--------------|
| `allWarningsAsErrors` | 如果有任何警告，则报告错误 |                                                                | false |
| `suppressWarnings` | 不要生成警告 |                                                                | false |
| `verbose` | 启用详细日志输出。仅在 [启用 Gradle 调试日志级别](https://docs.gradle.org/current/userguide/logging.html) 时有效 |                                                                | false |
| `freeCompilerArgs` | 附加编译器参数的列表。你也可以在此处使用实验性的 `-X` 参数。请参见 [示例](#example-of-additional-arguments-usage-via-freecompilerargs) |                                                                | [] |
| `apiVersion`      | 将声明的使用限制为来自指定版本的捆绑库的声明 | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |               |
| `languageVersion` | 提供与指定版本的 Kotlin 的源码兼容性                         | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL)  |               |
:::tip
我们将在未来的版本中弃用 `freeCompilerArgs` 属性。如果你在 Kotlin Gradle DSL 中遗漏了一些选项，请[提交 issue](https://youtrack.jetbrains.com/newissue?project=kt)。

#### Example of additional arguments usage via freeCompilerArgs 

使用 `freeCompilerArgs` 属性来提供附加的（包括实验性的）编译器参数。
你可以将单个参数添加到此属性，或添加参数列表：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

kotlin {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion.set(KotlinVersion.KOTLIN_2_1)
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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion = KotlinVersion.KOTLIN_2_1
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

</TabItem>
</Tabs>

`freeCompilerArgs` 属性在 [扩展](#extension-level)、[目标](#target-level) 和 [编译单元（任务）](#compilation-unit-level) 级别可用。

::: 

#### Example of setting languageVersion 

要设置语言版本，请使用以下语法：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
    }
}
```

</TabItem>
</Tabs>

另请参见 [编译器选项的类型](#types-for-compiler-options)。

### JavaScript 特有属性

| Name | Description                                                                                                                                                                                                                              | Possible values                                                                                                                                                            | Default value                      |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| `friendModulesDisabled` | 禁用内部声明导出                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `main` | 指定是否应在执行时调用 `main` 函数                                                                                                                                                                       | `JsMainFunctionExecutionMode.CALL`, `JsMainFunctionExecutionMode.NO_CALL`                                                                                                  | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind` | 编译器生成的 JS 模块的种类                                                                                                                                                                                          | `JsModuleKind.MODULE_AMD`, `JsModuleKind.MODULE_PLAIN`, `JsModuleKind.MODULE_ES`, `JsModuleKind.MODULE_COMMONJS`, `JsModuleKind.MODULE_UMD`                                | `null`                               |
| `sourceMap` | 生成源码映射（source map）                                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `sourceMapEmbedSources` | 将源文件嵌入到源码映射中                                                                                                                                                                                                   | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS` | `null`                               |
| `sourceMapNamesPolicy` | 将你在 Kotlin 代码中声明的变量和函数名称添加到源码映射中。有关行为的更多信息，请参见我们的 [编译器参考](compiler-reference#source-map-names-policy-simple-names-fully-qualified-names-no) | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null`                               |
| `sourceMapPrefix` | 将指定的前缀添加到源码映射中的路径                                                                                                                                                                                      |                                                                                                                                                                            | `null`                               |
| `target` | 为特定的 ECMA 版本生成 JS 文件                                                                                                                                                                                              | `"es5"`, `"es2015"`                                                                                                                                                            | `"es5"`                              |
| `useEsClasses` | 让生成的 JavaScript 代码使用 ES2015 类。在使用 ES2015 目标时默认启用                                                                                                                                                                                              |                                                                                                                                                                            | `null`                               |

### 编译器选项的类型

一些 `compilerOptions` 使用新类型而不是 `String` 类型：

| Option                             | Type                                                                                                                                                                                                              | Example                                                                                              |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` and `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.KOTLIN_2_1)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## 接下来做什么？

了解更多关于：
* [Kotlin Multiplatform DSL 参考](multiplatform-dsl-reference)。
* [增量编译、缓存支持、构建报告和 Kotlin 守护进程](gradle-compilation-and-caches)。
* [Gradle 基础知识和特性](https://docs.gradle.org/current/userguide/userguide.html)。
* [对 Gradle 插件变体的支持](gradle-plugin-variants)。