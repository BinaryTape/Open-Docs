[//]: # (title: Kotlin Gradle 插件中的编译器选项)

每个 Kotlin 版本都包含针对受支持目标平台（JVM、JavaScript 和适用于[受支持平台](native-overview.md#target-platforms)的原生二进制文件）的编译器。

这些编译器由以下组件使用：
* IDE，当您点击 Kotlin 项目的 **Compile** 或 **Run** 按钮时。
* Gradle，当您在控制台或 IDE 中调用 `gradle build` 时。
* Maven，当您在控制台或 IDE 中调用 `mvn compile` 或 `mvn test-compile` 时。

您也可以按照[使用命令行编译器](command-line.md)教程中的说明，从命令行手动运行 Kotlin 编译器。

## 如何定义选项

Kotlin 编译器提供了许多选项，用于定制编译过程。

Gradle DSL 允许对编译器选项进行全面配置。它适用于 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compiler-options) 和 [JVM/Android](#target-the-jvm) 项目。

使用 Gradle DSL，您可以在构建脚本中通过三个级别配置编译器选项：
* **[扩展级别](#extension-level)**，在 `kotlin {}` 代码块中，适用于所有目标平台和共享源代码集。
* **[目标级别](#target-level)**，在特定目标平台的代码块中。
* **[编译单元级别](#compilation-unit-level)**，通常在特定的编译任务中。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

较高级别的设置会作为较低级别的约定（默认值）：

* 在扩展级别设置的编译器选项是目标级别选项的默认值，包括 `commonMain`、`nativeMain` 和 `commonTest` 等共享源代码集。
* 在目标级别设置的编译器选项是编译单元（任务）级别选项的默认值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任务。

反之，在较低级别进行的配置会覆盖较高级别的相关设置：

* 任务级别的编译器选项会覆盖目标级别或扩展级别的相关配置。
* 目标级别的编译器选项会覆盖扩展级别的相关配置。

要查明哪个级别的编译器实参应用于编译项，请使用 Gradle [日志记录](https://docs.gradle.org/current/userguide/logging.html)的 `DEBUG` 级别。
对于 JVM 和 JS/WASM 任务，在日志中搜索 `"Kotlin compiler args:"` 字符串；对于 Native 任务，搜索 `"Arguments ="` 字符串。

> 如果您是第三方插件作者，最好在项目级别应用配置，以避免出现覆盖问题。您可以为此使用新的 [Kotlin 插件 DSL 扩展类型](whatsnew21.md#new-api-for-kotlin-gradle-plugin-extensions)。建议您在您的文档中显式说明此配置。
>
{style="tip"}

### 扩展级别

您可以在顶层的 `compilerOptions {}` 代码块中为所有目标平台和共享源代码集配置通用编译器选项：

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### 目标级别

您可以在 `target {}` 代码块内部的 `compilerOptions {}` 代码块中为 JVM/Android 目标平台配置编译器选项：

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

在 Kotlin Multiplatform 项目中，您可以在特定目标平台内部配置编译器选项。例如，`jvm { compilerOptions {}}`。关于更多信息，请参见 [Multiplatform Gradle DSL 参考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。

### 编译单元级别

您可以在任务配置内部的 `compilerOptions {}` 代码块中为特定编译单元或任务配置编译器选项：

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

您还可以通过 `KotlinCompilation` 在编译单元级别访问并配置编译器选项：

```Kotlin
kotlin {
    target {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    optIn.add("kotlin.RequiresOptIn")
                }
            }
        }
    }
}
```

如果您想配置与 JVM/Android 和 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) 目标平台不同的插件，请使用相应 Kotlin 编译任务的 `compilerOptions {}` 属性。以下示例展示了如何在 Kotlin 和 Groovy DSL 中设置此配置：

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

### 从 `kotlinOptions {}` 迁移到 `compilerOptions {}` {initial-collapse-state="collapsed" collapsible="true"}

在 Kotlin 2.2.0 之前，您可以使用 `kotlinOptions {}` 代码块配置编译器选项。由于 `kotlinOptions {}` 代码块自 Kotlin 2.0.0 起已弃用，本节提供了关于将构建脚本迁移到使用 `compilerOptions {}` 代码块的指导和建议：

* [集中管理编译器选项并使用类型](#centralize-compiler-options-and-use-types)
* [放弃使用 `android.kotlinOptions`](#migrate-away-from-android-kotlinoptions)
* [迁移 `freeCompilerArgs`](#migrate-freecompilerargs)

#### 集中管理编译器选项并使用类型

尽可能在[扩展级别](#extension-level)配置编译器选项，并针对特定任务在[编译单元级别](#compilation-unit-level)覆盖它们。

您不能在 `compilerOptions {}` 代码块中使用原始字符串，因此请将它们转换为类型化值。例如，如果您有以下代码：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}

tasks.withType<KotlinCompile>().configureEach {
    kotlinOptions {
        jvmTarget = "%jvmLTSVersionSupportedByKotlin%"
        languageVersion = "%languageVersion%"
        apiVersion = "%apiVersion%"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

tasks.withType(KotlinCompile).configureEach {
    kotlinOptions {
        jvmTarget = '%jvmLTSVersionSupportedByKotlin%'
        languageVersion = '%languageVersion%'
        apiVersion = '%apiVersion%'
    }
}
```

</tab>
</tabs>

迁移后，应变为：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}

kotlin {
    // Extension level
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        languageVersion = KotlinVersion.fromVersion("%languageVersion%")
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}

// Example of overriding at compilation unit level
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

kotlin {
  // Extension level
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        languageVersion = KotlinVersion.fromVersion("%languageVersion%")
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}

// Example of overriding at compilation unit level
tasks.named("compileKotlin", KotlinJvmCompile).configure {
    compilerOptions {
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}
```

</tab>
</tabs>

#### 放弃使用 `android.kotlinOptions`

如果您的构建脚本之前使用了 `android.kotlinOptions`，请转而迁移到 `kotlin.compilerOptions`。这可以在扩展级别或目标级别进行。

例如，如果您有一个 Android 项目：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.android.application")
    kotlin("android")
}

android {
    kotlinOptions {
        jvmTarget = "%jvmLTSVersionSupportedByKotlin%"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    kotlinOptions {
        jvmTarget = '%jvmLTSVersionSupportedByKotlin%'
    }
}
```
</tab>
</tabs>

将其更新为：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
  id("com.android.application")
  kotlin("android")
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
    }
}
```

</tab>
</tabs>

再例如，如果您有一个带 Android 目标平台的 Kotlin Multiplatform 项目：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.android.application")
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions.jvmTarget = "%jvmLTSVersionSupportedByKotlin%"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.multiplatform'
    id 'com.android.application'
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions {
                jvmTarget = '%jvmLTSVersionSupportedByKotlin%'
            }
        }
    }
}
```

</tab>
</tabs>

将其更新为：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.android.application")
}

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.multiplatform'
    id 'com.android.application'
}

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        }
    }
}
```

</tab>
</tabs>

#### 迁移 `freeCompilerArgs`

* 将所有 `+=` 操作替换为 `add()` 或 `addAll()` 函数。
* 如果您使用 `-opt-in` 编译器选项，请检查 [KGP API 参考](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/)中是否已有专用 DSL，并转而使用它。
* 迁移任何 `-progressive` 编译器选项的使用，转而使用专用 DSL：`progressiveMode.set(true)`。
* 迁移任何 `-Xjvm-default` 编译器选项的使用，[转而使用专用 DSL](gradle-compiler-options.md#attributes-specific-to-jvm)：`jvmDefault.set()`。使用以下选项映射：

  | Before                            | After                                             |
  |-----------------------------------|---------------------------------------------------|
  | `-Xjvm-default=all-compatibility` | `jvmDefault.set(JvmDefaultMode.ENABLE)`           |
  | `-Xjvm-default=all`               | `jvmDefault.set(JvmDefaultMode.NO_COMPATIBILITY)` | 
  | `-Xjvm-default=disable`           | `jvmDefault.set(JvmDefaultMode.DISABLE)`          |

例如，如果您有以下代码：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinOptions {
    freeCompilerArgs += "-opt-in=kotlin.RequiresOptIn"
    freeCompilerArgs += listOf("-Xcontext-receivers", "-Xinline-classes", "-progressive", "-Xjvm-default=all")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlinOptions {
    freeCompilerArgs += "-opt-in=kotlin.RequiresOptIn"
    freeCompilerArgs += ["-Xcontext-receivers", "-Xinline-classes", "-progressive", "-Xjvm-default=all"]
}
```

</tab>
</tabs>

迁移到：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
        freeCompilerArgs.addAll(listOf("-Xcontext-receivers", "-Xinline-classes"))
        progressiveMode.set(true)
        jvmDefault.set(JvmDefaultMode.NO_COMPATIBILITY)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
        freeCompilerArgs.addAll(["-Xcontext-receivers", "-Xinline-classes"])
        progressiveMode.set(true)
        jvmDefault.set(JvmDefaultMode.NO_COMPATIBILITY)
    }
}
```

</tab>
</tabs>

## 面向 JVM 目标平台

[如前所述](#how-to-define-options)，您可以为 JVM/Android 项目在扩展、目标和编译单元级别（任务）定义编译器选项。

默认的 JVM 编译任务是用于生产代码的 `compileKotlin` 和用于测试代码的 `compileTestKotlin`。自定义源代码集的任务则根据其 `compile<Name>Kotlin` 模式命名。

您可以通过在终端中运行 `gradlew tasks --all` 命令，并在 `Other tasks` 组中搜索 `compile*Kotlin` 任务名称来查看 Android 编译任务列表。

一些需要注意的重要细节：

* `kotlin.compilerOptions` 配置项目中的每个 Kotlin 编译任务。
* 您可以使用 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`（或 `tasks.withType<KotlinJvmCompile>().configureEach { }`）方法，覆盖由 `kotlin.compilerOptions` DSL 应用的配置。

## 面向 JavaScript 目标平台

JavaScript 编译任务是用于生产代码的 `compileKotlinJs`、用于测试代码的 `compileTestKotlinJs`，以及用于自定义源代码集的 `compile<Name>KotlinJs`。

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

请注意，使用 Gradle Kotlin DSL 时，您应该首先从项目的 `tasks` 获取任务。

对于 JS 和公共目标平台，请分别使用 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 类型。

您可以通过在终端中运行 `gradlew tasks --all` 命令，并在 `Other tasks` 组中搜索 `compile*KotlinJS` 任务名称来查看 JavaScript 编译任务列表。

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

| 名称 | 描述 | 可能值 | 默认值 |
|---|---|---|---|
| `optIn` | 用于配置 [opt-in 编译器实参](opt-in-requirements.md)列表的属性 | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | 启用[渐进式编译模式](whatsnew13.md#progressive-mode) | `true`, `false` | `false` |
| `extraWarnings` | 启用[额外的声明、表达式和类型编译器检测](whatsnew21.md#extra-compiler-checks)，如果为 true 则发出警告 | `true`, `false` | `false` |

### JVM 特有的属性

| 名称 | 描述 | 可能值 | 默认值 |
|---|---|---|---|
| `javaParameters` | 为 Java 1.8 方法形参的反射生成元数据 | | false |
| `jvmTarget` | 生成的 JVM 字节码的目标版本 | "1.8", "9", "10", ..., "23", "24"。另外，关于[编译器选项的类型](#types-for-compiler-options)请参见相关内容 | "%defaultJvmTargetVersion%" |
| `noJdk` | 不要自动将 Java 运行时包含到类路径中 | | false |
| `jvmTargetValidationMode` | <list><li>Kotlin 和 Java 之间 [JVM 目标平台兼容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)的验证</li><li>`KotlinCompile` 类型任务的属性。</li></list> | `WARNING`, `ERROR`, `IGNORE` | `ERROR` |
| `jvmDefault` | 控制在接口中声明的函数如何在 JVM 上编译为默认方法 | `ENABLE`, `NO_COMPATIBILITY`, `DISABLE` | `ENABLE` |

### JVM 和 JavaScript 通用的属性

| 名称 | 描述 | 可能值 | 默认值 |
|---|---|---|---|
| `allWarningsAsErrors` | 如果有任何警告则报告错误 | | false |
| `suppressWarnings` | 不生成警告 | | false |
| `verbose` | 启用详细日志输出。仅当[启用 Gradle 调试日志级别](https://docs.gradle.org/current/userguide/logging.html)时有效 | | false |
| `freeCompilerArgs` | 额外的编译器实参列表。您也可以在此处使用实验性的 `-X` 实参。关于示例请参见[通过 freeCompilerArgs 使用额外实参的示例](#example-of-additional-arguments-usage-via-freecompilerargs) | | [] |
| `apiVersion` | 将声明的使用限制为来自指定版本捆绑库中的声明 | "1.8", "1.9", "2.0", "2.1", "2.2" (实验性的) | |
| `languageVersion` | 提供与指定版本 Kotlin 的源代码兼容性 | "1.8", "1.9", "2.0", "2.1", "2.2" (实验性的) | |

> 我们将在未来版本中弃用 `freeCompilerArgs` 属性。如果您发现 Kotlin Gradle DSL 中缺少某些选项，请[提交一个问题](https://youtrack.jetbrains.com/newissue?project=kt)。
>
{style="warning"}

#### 通过 freeCompilerArgs 使用额外实参的示例 {initial-collapse-state="collapsed" collapsible="true"}

使用 `freeCompilerArgs` 属性提供额外（包括实验性）的编译器实参。您可以向此属性添加单个实参或实参列表：

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

> `freeCompilerArgs` 属性可在[扩展](#extension-level)、[目标](#target-level)和[编译单元（任务）](#compilation-unit-level)级别使用。
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

另外，关于[编译器选项的类型](#types-for-compiler-options)请参见相关内容。

### JavaScript 特有的属性

| 名称 | 描述 | 可能值 | 默认值 |
|---|---|---|---|
| `friendModulesDisabled` | 禁用内部声明导出 | | `false` |
| `main` | 指定在执行时是否应调用 `main` 函数 | `JsMainFunctionExecutionMode.CALL`, `JsMainFunctionExecutionMode.NO_CALL` | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind` | 编译器生成的 JS 模块类型 | `JsModuleKind.MODULE_AMD`, `JsModuleKind.MODULE_PLAIN`, `JsModuleKind.MODULE_ES`, `JsModuleKind.MODULE_COMMONJS`, `JsModuleKind.MODULE_UMD` | `null` |
| `sourceMap` | 生成源映射 | | `false` |
| `sourceMapEmbedSources` | 将源文件嵌入到源映射中 | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS` | `null` |
| `sourceMapNamesPolicy` | 将您在 Kotlin 代码中声明的变量和函数名称添加到源映射中。关于行为的更多信息，请参见我们的[编译器参考](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no) | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null` |
| `sourceMapPrefix` | 将指定的前缀添加到源映射中的路径 | | `null` |
| `target` | 为特定 ECMA 版本生成 JS 文件 | `"es5"`, `"es2015"` | `"es5"` |
| `useEsClasses` | 让生成的 JavaScript 代码使用 ES2015 类。在 ES2015 目标平台使用的情况下默认启用 | | `null` |

### 编译器选项的类型

`compilerOptions` 中的一些选项使用新类型而不是 `String` 类型：

| 选项 | 类型 | 示例 |
|---|---|---|
| `jvmTarget` | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt) | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` |
| `apiVersion` 和 `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt) | `compilerOptions.languageVersion.set(KotlinVersion.%gradleLanguageVersion%)` |
| `main` | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)` |
| `moduleKind` | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt) | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)` |
| `sourceMapEmbedSources` | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt) | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy` | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt) | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)` |

## 接下来是什么？

了解更多关于：
* [Kotlin Multiplatform DSL 参考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。
* [增量编译、缓存支持、构建报告和 Kotlin 守护进程](gradle-compilation-and-caches.md)。
* [Gradle 基础知识和细节](https://docs.gradle.org/current/userguide/userguide.html)。
* [对 Gradle 插件变体的支持](gradle-plugin-variants.md)。