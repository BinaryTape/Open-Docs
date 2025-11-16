[//]: # (title: Kotlin %kotlinEapVersion% 有哪些新变化)

<primary-label ref="eap"/>

_[发布时间：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文档并未涵盖抢先体验预览 (EAP) 版本的所有特性，
> 但它突出介绍了一些主要改进。
>
> 欲查看完整的更改列表，请参阅 [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已发布！以下是此 EAP 版本的一些详细信息：

*   **语言**：[更稳定和默认的特性、新的无用返回值检测器以及上下文敏感解析的变更](#language)。
*   **Kotlin/JVM**：[支持 Java 25](#kotlin-jvm-support-for-java-25)。
*   **Kotlin/Native**：[通过 Swift 导出改进互操作性以及泛型类型边界上的类型检测默认启用](#kotlin-native)。
*   **Kotlin/Wasm**：[完全限定名称和新的异常处理提案默认启用](#kotlin-wasm)。
*   **Kotlin/JS**：[新的实验性的挂起函数导出和 `LongArray` 表示](#kotlin-js)。
*   **Gradle**：[与 Gradle 9.0 的兼容性以及用于注册生成源代码的新 API](#gradle)。
*   **标准库**：[稳定的时间追踪功能](#standard-library)。

## IDE 支持

支持 Kotlin %kotlinEapVersion% 的 Kotlin 插件已与最新版本的 IntelliJ IDEA 和 Android Studio 捆绑。
您无需更新 IDE 中的 Kotlin 插件。
您只需在构建脚本中将 [Kotlin 版本更改](configure-build-for-eap.md) 为 %kotlinEapVersion% 即可。

关于详细信息，请参见 [更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

Kotlin %kotlinEapVersion% 侧重于特性稳定化，引入了一种新的无用返回值检测机制，
并改进了上下文敏感解析。

### 稳定特性

在以前的 Kotlin 版本中，一些新的语言特性作为实验性 (Experimental) 和 Beta 版本引入。
我们很高兴地宣布，在此版本中，以下特性已成为 [稳定版](components-stability.md#stability-levels-explained)：

*   [支持嵌套类型别名](whatsnew22.md#support-for-nested-type-aliases)
*   [基于数据流的 `when` 表达式详尽性检测](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)

### 默认启用的特性

在 Kotlin %kotlinEapVersion% 中，以下语言特性现在默认启用：

*   [改进了带挂起函数类型的 lambda 表达式的重载解析](whatsnew2220.md#improved-overload-resolution-for-lambdas-with-suspend-function-types)
*   [支持在带有显式返回类型的表达式体中使用 `return` 语句](whatsnew2220.md#support-for-return-statements-in-expression-bodies-with-explicit-return-types)

[关于完整的 Kotlin 语言设计特性和提案列表，请参见](kotlin-language-features-and-proposals.md)。

### 无用返回值检测器
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% 引入了一项新特性，即无用返回值检测器。
当表达式返回非 `Unit` 或 `Nothing` 的值，并且未传递给函数、未在条件中检测或未以其他方式使用时，此特性会发出警告。

您可以使用它来捕获 bug，即函数调用产生了有意义的结果，但该结果被悄悄丢弃，这可能导致意外行为或难以追踪的问题。

> 该检测器会忽略递增操作（例如 `++` 和 `--`）返回的值。
>
{style="note"}

考虑以下示例：

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // The checker reports a warning that this result is ignored
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

在此示例中，一个字符串被创建但从未使用，因此检测器将其报告为被忽略的结果。

此特性是[实验性的](components-stability.md#stability-levels-explained)。
要选择启用，请将以下编译器选项添加到您的 `build.gradle.kts` 文件中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

使用此选项，检测器仅报告来自已标记表达式的被忽略结果，例如 Kotlin 标准库中的大多数函数。

要标记您的函数，请使用 `@MustUseReturnValues` 注解来标记您希望检测器报告被忽略返回值的范围。

例如，您可以标记整个文件：

```kotlin
// Marks all functions and classes in this file so the checker reports unused return values
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

或特定类：

```kotlin
// Marks all functions in this class so the checker reports unused return values
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

您还可以使用 `full` 模式标记整个项目。
为此，请将以下编译器选项添加到您的 `build.gradle.kts` 文件中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

在此模式下，Kotlin 自动将您的编译文件视为已使用 `@MustUseReturnValues` 注解标记，
因此检测器适用于您项目函数的所有返回值。

您可以通过使用 `@IgnorableReturnValue` 注解标记特定函数来抑制警告。
注解那些忽略结果很常见且预期的函数，例如 `MutableList.add`：

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

您可以在不将函数本身标记为可忽略的情况下抑制警告。
为此，请将结果赋值给一个带有下划线语法 (`_`) 的特殊未命名变量：

```kotlin
// Non-ignorable function
fun computeValue(): Int = 42

fun main() {

    // Reports a warning: result is ignored
    computeValue()

    // Suppresses the warning only at this call site with a special unused variable
    val _ = computeValue()
}
```

我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719) 中提供反馈。关于更多信息，
请参见该特性的 [KEEP]( https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)。

### 上下文敏感解析的变更
<primary-label ref="experimental-general"/>

> 对代码分析、代码补全以及此特性高亮显示的支持，目前仅在 [2025.3 EAP 构建](https://www.jetbrains.com/idea/nextversion/) 中可用。
>
{style = "note"}

上下文敏感解析仍然是[实验性的](components-stability.md#stability-levels-explained)，
但我们根据用户反馈继续改进此特性：

*   当前类型的密封和封闭超类型现在被视为搜索的上下文作用域的一部分。
    不考虑其他超类型作用域。
*   在涉及类型操作符和等价性时，如果使用上下文敏感解析导致解析模糊，编译器现在会报告警告。例如，当导入了类的冲突声明时，可能会发生这种情况。

关于详细信息，请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md) 中当前提案的全文。

## Kotlin/JVM：支持 Java 25

从 Kotlin %kotlinEapVersion% 开始，编译器可以生成包含 Java 25 字节码的类。

## Kotlin/Native

### 通过 Swift 导出改进互操作性
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% 通过 Swift 导出进一步改进了 Kotlin 与 Swift 的互操作性，新增对原生枚举类和可变参数函数的支持。

以前，Kotlin 枚举被导出为普通的 Swift 类。现在映射是直接的，您可以使用常规的原生 Swift 枚举。例如：

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```Swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    var rgb: Int { get } 
}
```

Kotlin 的 [`vararg`](functions.md#variable-number-of-arguments-varargs) 函数现在也直接映射到 Swift 的可变参数函数。

此类函数允许您传递可变数量的实参。这在您不提前知道实参数量，或者想要创建或传递集合而不指定其类型时非常有用。例如：

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```Swift
// Swift
func log(_ messages: String...)
```

> 可变参数函数中的泛型类型尚不支持。
>
{style="note"}

### 调试模式下泛型类型边界上的类型检测

从 Kotlin %kotlinEapVersion% 开始，泛型类型边界上的类型检测默认在调试模式下启用，
帮助您更早地发现与未经检测的类型转换相关的错误。此变更提高了安全性，并使跨平台的无效泛型类型转换调试更具可预测性。

以前，导致堆污染和内存安全违规的未经检测的类型转换可能在 Kotlin/Native 中未被发现。
现在，此类情况会一致地导致运行时类型转换错误，类似于 Kotlin/JVM 或 Kotlin/JS。例如：

```kotlin
fun main() {
    val list = listOf("hello")
    val x = (list as List<Int>)[0]
    println(x) // Now throws a ClassCastException error
}
```

此代码过去会打印 `6`；现在它在调试模式下会抛出 `ClassCastException` 错误，符合预期。

关于更多信息，请参见 [类型检测和类型转换](typecasts.md)。

## Kotlin/Wasm

### 完全限定名称默认启用

在 Kotlin/Wasm 目标平台，完全限定名称 (FQNs) 在运行时未默认启用。
您必须手动启用对 `KClass.qualifiedName` 属性的支持。

以前，只有类名（不包含包名）是可访问的，这给从 JVM 移植到 Wasm 目标平台的代码，
或期望在运行时使用完全限定名称的库带来了问题。

在 Kotlin %kotlinEapVersion% 中，`KClass.qualifiedName` 属性在 Kotlin/Wasm 目标平台默认启用。
这意味着 FQNs 在运行时无需任何额外配置即可使用。

默认启用 FQNs 提高了代码可移植性，并通过显示完全限定名称使运行时错误更具信息性。

此变更不会增加编译后的 Wasm 二进制文件的大小，这得益于编译器优化，
它通过使用紧凑存储 Latin-1 字符串字面量来减少元数据。

### 新的异常处理提案默认启用 `wasmWasi` 目标平台

以前，Kotlin/Wasm 对所有目标平台，包括 [`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi)，
都使用 [旧版异常处理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)。
然而，大多数独立的 WebAssembly 虚拟机 (VM) 都与 [新版异常处理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) 保持一致。

从 Kotlin %kotlinEapVersion% 开始，新的 WebAssembly 异常处理提案默认对 `wasmWasi` 目标平台启用，
确保了与现代 WebAssembly 运行时更好的兼容性。

对于 `wasmWasi` 目标平台，提早引入此变更较为安全，因为面向该目标平台的应用程序通常在多样性较低的运行时环境
（通常运行在单个特定的 VM 上）中运行，并且通常由用户控制，从而降低了兼容性问题的风险。

新的异常处理提案对于 [`wasmJs` 目标平台](wasm-overview.md#kotlin-wasm-and-compose-multiplatform) 默认保持禁用。
您可以使用 `-Xwasm-use-new-exception-proposal` 编译器选项手动启用它。

## Kotlin/JS

### JsExport 新增挂起函数导出功能
<primary-label ref="experimental-opt-in"/>

以前，`@JsExport` 注解不允许将挂起函数（或包含此类函数的类和接口）导出到 JavaScript。
您必须手动封装每个挂起函数，这既繁琐又容易出错。

从 Kotlin %kotlinEapVersion% 开始，挂起函数可以使用 `@JsExport` 注解直接导出到 JavaScript。

启用挂起函数导出消除了样板代码的需求，并改进了 Kotlin/JS 与 JavaScript/TypeScript (JS/TS) 之间的互操作性。
Kotlin 的异步函数现在无需额外代码即可直接从 JS/TS 调用。

要启用此特性，请将以下编译器选项添加到您的 `build.gradle.kts` 文件中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-XXLanguage:+JsAllowExportingSuspendFunctions")
    }
}
```

启用后，使用 `@JsExport` 注解标记的类和函数可以包含挂起函数，无需额外的封装器。

它们可以作为常规的 JavaScript 异步函数使用，也可以被覆盖为异步函数：

```kotlin
@JsExport
open class Foo {
    suspend fun foo() = "Foo"
}
```

```typescript
class Bar extends Foo {
    override async foo(): Promise<string> {
        return "Bar"
    }
}
```

此特性是[实验性的](components-stability.md#stability-levels-explained)。我们非常感谢您在
[YouTrack](https://youtrack.jetbrains.com/issue/KT-56281/KJS-Cant-export-suspend-functions) 问题跟踪器中提供反馈。

### 使用 `BigInt64Array` 类型表示 Kotlin 的 `LongArray` 类型
<primary-label ref="experimental-opt-in"/>

以前，Kotlin/JS 将 `LongArray` 表示为 JavaScript `Array<bigint>`。
这种方法可行，但对于与期望类型化数组的 JavaScript API 进行互操作性而言并不理想。

从此版本开始，Kotlin/JS 现在使用 JavaScript 的内置 `BigInt64Array` 类型来表示编译到 JavaScript 时的 Kotlin `LongArray` 值。

使用 `BigInt64Array` 简化了与使用类型化数组的 JavaScript API 的互操作。
它还允许接受或返回 `LongArray` 的 API 从 Kotlin 更自然地导出到 JavaScript。

要启用此特性，请将以下编译器选项添加到您的 `build.gradle.kts` 文件中：

```kotlin
kotlin {
    js {
        // ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

此特性是[实验性的](components-stability.md#stability-levels-explained)。我们非常感谢您在
[YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray) 问题跟踪器中提供反馈。

## Gradle

Kotlin %kotlinEapVersion% 完全兼容 Gradle 7.6.3 到 9.0.0。您也可以使用直到最新 Gradle 版本的 Gradle。
但是，请注意，这样做可能会导致弃用警告，并且某些新的 Gradle 特性可能无法正常工作。

此外，目前支持的最低 Android Gradle 插件版本为 8.2.2，最高版本为 8.13.0。

### 用于在 Gradle 项目中注册生成源代码的新 API
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% 在
[`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/)
接口中引入了一个新的[实验性的](components-stability.md#stability-levels-explained) API，
您可以使用它来在您的 Gradle 项目中注册生成的源代码。

这项新 API 是一项提升开发体验的改进，它帮助 IDE 区分生成代码与常规源文件。
该 API 允许 IDE 在 UI 中以不同方式高亮显示生成代码，并在导入项目时触发生成任务。
我们目前正在 IntelliJ IDEA 中添加此支持。
该 API 对于生成代码的第三方插件或工具也特别有用，例如 [KSP](ksp-overview.md) (Kotlin Symbol Processing)。

要注册包含 Kotlin 或 Java 文件的目录，请在您的 `build.gradle(.kts)` 文件中使用
`SourceDirectorySet` 类型的 `generatedKotlin` 属性。例如：

```kotlin
val generatorTask = project.tasks.register("generator") {
    val outputDirectory = project.layout.projectDirectory.dir("src/main/kotlinGen")
    outputs.dir(outputDirectory)
    doLast {
        outputDirectory.file("generated.kt").asFile.writeText(
            // language=kotlin
            """
            fun printHello() {
                println("hello")
            }
            """.trimIndent()
        )
    }
}

kotlin.sourceSets.getByName("main").generatedKotlin.srcDir(generatorTask)
```

此示例创建了一个名为 `"generator"` 的新任务，其输出目录为 `"src/main/kotlinGen"`。
当任务运行时，`doLast {}` 代码块会在输出目录中创建一个 `generated.kt` 文件。
最后，此示例将任务的输出注册为生成源代码。

作为新 API 的一部分，`allKotlinSources` 属性提供了对 `KotlinSourceSet.kotlin` 和
`KotlinSourceSet.generatedKotlin` 属性中注册的所有源代码的访问。

## 标准库

在 Kotlin %kotlinEapVersion% 中，新的时间追踪功能，
[`kotlin.time.Clock` 和 `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)
已成为 [稳定版](components-stability.md#stability-levels-explained)。

## Compose 编译器：用于精简 Android 应用程序的堆栈轨迹

从 Kotlin 2.3.0 开始，当应用程序通过 R8 精简时，编译器会为 Compose 堆栈轨迹输出 ProGuard 映射。
这扩展了以前仅在可调试变体中可用的实验性堆栈轨迹特性。

堆栈轨迹的发布变体包含组键，可用于在精简应用程序中识别可组合函数，而无需在运行时记录源信息的开销。
组键堆栈轨迹要求您的应用程序使用 Compose runtime 1.10 或更高版本构建。

要启用组键堆栈轨迹，请在初始化任何 `@Composable` 内容之前添加以下行：

```kotlin
Composer.setDiagnosticStackTraceMode(ComposeStackTraceMode.GroupKeys)
```

启用这些堆栈轨迹后，即使应用程序被精简，Compose runtime 也会在组合、测量或绘制过程中捕获崩溃后附加自己的堆栈轨迹：

```text
java.lang.IllegalStateException: <message>
          at <original trace>
Suppressed: androidx.compose.runtime.DiagnosticComposeException: Composition stack when thrown:
         at $compose.m$123(SourceFile:1)
         at $compose.m$234(SourceFile:1)
          ...
```

Jetpack Compose 1.10 在此模式下生成的堆栈轨迹仅包含尚待反混淆的组键。
这在 Kotlin 2.3.0 版本中得到了解决，Compose 编译器 Gradle 插件现在将组键条目附加到由 R8 生成的 ProGuard 映射文件。
如果您在编译器未能为某些函数创建映射时看到新的警告，请将它们报告给
[Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126)。

> Compose 编译器 Gradle 插件仅在由于依赖 R8 映射文件而在构建中启用 R8 时，
> 才为组键堆栈轨迹创建反混淆映射。
>
{style="note"}