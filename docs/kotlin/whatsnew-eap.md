[//]: # (title: Kotlin %kotlinEapVersion% 有哪些新变化)

_[发布时间：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文档并未涵盖抢先体验预览 (EAP) 版本的所有特性，
> 但它突出介绍了一些主要的改进。
>
> 欲查看完整的更改列表，请参阅 [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已发布！以下是此 EAP 版本的一些详细信息：

* [特性稳定化：嵌套类型别名、详尽的 `when`、新的时间追踪功能](#stable-features)
* [语言：新的无用返回值检测器和上下文敏感解析的变更](#language)
* [Kotlin/Native：调试模式下泛型类型边界上的类型检测默认启用](#kotlin-native-type-checks-on-generic-type-boundaries-in-debug-mode)

## IDE 支持

支持 Kotlin %kotlinEapVersion% 的 Kotlin 插件已与最新版本的 IntelliJ IDEA 和 Android Studio 捆绑。
您无需更新 IDE 中的 Kotlin 插件。
您只需在构建脚本中将 [Kotlin 版本更改](configure-build-for-eap.md) 为 %kotlinEapVersion% 即可。

关于详细信息，请参见 [更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 稳定特性

在以前的 Kotlin 版本中，一些新的语言和标准库特性作为实验性 (Experimental) 和 Beta 版本引入。
我们很高兴地宣布，在此版本中，以下特性已成为 [稳定版](components-stability.md#stability-levels-explained)：

* [支持嵌套类型别名](whatsnew22.md#support-for-nested-type-aliases)
* [基于数据流的 `when` 表达式详尽性检测](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)
* [新的时间追踪功能：`kotlin.time.Clock` 和 `kotlin.time.Instant` ](whatsnew2120.md#new-time-tracking-functionality)

关于完整的 Kotlin 语言设计特性和提案列表，请参见 [Kotlin 语言特性和提案](kotlin-language-features-and-proposals.md)。

## 语言

Kotlin %kotlinEapVersion% 引入了一种新的无用返回值检测机制，并侧重于改进上下文敏感解析。

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
        // 检测器会报告此结果被忽略的警告
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
// 标记此文件中的所有函数和类，以便检测器报告无用返回值
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

或特定类：

```kotlin
// 标记此类中的所有函数，以便检测器报告无用返回值
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

在此模式下，Kotlin 自动将您的编译文件视为已使用 `@MustUseReturnValues` 注解标记，因此检测器适用于您项目函数的所有返回值。

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
// 非可忽略函数
fun computeValue(): Int = 42

fun main() {

    // 报告警告：结果被忽略
    computeValue()

    // 仅在此调用位置使用特殊无用变量抑制警告
    val _ = computeValue()
}
```

我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719) 中提供反馈。关于更多信息，请参见该特性的 [KEEP]( https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)。

### 上下文敏感解析的变更
<primary-label ref="experimental-general"/>

> 对代码分析、代码补全以及此特性高亮显示的支持，目前仅在 [2025.3 EAP 构建](https://www.jetbrains.com/idea/nextversion/) 中可用。
>
{style = "note"}

上下文敏感解析仍然是[实验性的](components-stability.md#stability-levels-explained)，但我们根据用户反馈继续改进此特性：

* 当前类型的密封和封闭超类型现在被视为搜索的上下文作用域的一部分。
  不考虑其他超类型作用域。
* 在涉及类型操作符和等价性的情况下，如果使用上下文敏感解析导致解析模糊，编译器现在会报告警告。例如，当导入了类的冲突声明时，可能会发生这种情况。

关于详细信息，请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md) 中当前提案的全文。

## Kotlin/Native：调试模式下泛型类型边界上的类型检测

从 Kotlin %kotlinEapVersion% 开始，泛型类型边界上的类型检测默认在调试模式下启用，帮助您更早地发现与未经检测的类型转换相关的错误。此变更提高了安全性，并使跨平台的无效泛型类型转换调试更具可预测性。

以前，导致堆污染和内存安全违规的未经检测的类型转换可能在 Kotlin/Native 中未被发现。
现在，此类情况会一致地导致运行时类型转换错误，类似于 Kotlin/JVM 或 Kotlin/JS。例如：

```kotlin
fun main() {
    val list = listOf("hello")
    val x = (list as List<Int>)[0]
    println(x) // 现在会抛出 ClassCastException 错误
}
```

此代码过去会打印 `6`；现在它在调试模式下会抛出 `ClassCastException` 错误，符合预期。

关于更多信息，请参见 [类型检测和类型转换](typecasts.md)。

## Gradle：Kotlin/JVM 编译默认使用 Build tools API
<primary-label ref="experimental-general"/>

在 Kotlin 2.3.0-Beta1 中，Kotlin Gradle 插件中的 Kotlin/JVM 编译默认使用 [Build tools API](build-tools-api.md) (BTA)。这是内部编译基础设施中的一项重大变更。

我们在此版本中将 BTA 设为默认，是为了留出时间进行测试。我们预计一切都将像以前一样继续运行。如果您发现任何问题，请在我们的 [问题跟踪器](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration) 中分享您的反馈。

我们计划在 2.3.0-Beta2 中再次禁用 Kotlin/JVM 编译的 BTA，并从 Kotlin 2.3.20 开始为所有用户完全启用它。