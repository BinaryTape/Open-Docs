[//]: # (title: Kotlin 2.2.20 有哪些新特性)

_[发布日期：2025 年 9 月 10 日](releases.md#release-details)_

<tldr><p>有关 Bug 修复版本 2.2.21 的详细信息，请参见<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21">变更日志</a></p></tldr>

Kotlin 2.2.20 版本现已发布，为 Web 开发带来了重要变更。[Kotlin/Wasm 现已进入 Beta 阶段](#kotlin-wasm)，
并改进了 [JavaScript 互操作中的异常处理](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop)、
[npm 依赖项管理](#separated-npm-dependencies)、[内置浏览器调试支持](#support-for-debugging-in-browsers-without-configuration)，
以及为 `js` 和 `wasmJs` 目标平台引入了新的[共享源代码集](#shared-source-set-for-js-and-wasmjs-targets)。

此外，以下是一些主要亮点：

*   **Kotlin Multiplatform**：[Swift 导出功能默认可用](#swift-export-available-by-default)、[Kotlin 库的稳定跨平台编译](#stable-cross-platform-compilation-for-kotlin-libraries)，以及[声明公共依赖项的新方法](#new-approach-for-declaring-common-dependencies)。
*   **语言**：[将 lambda 表达式传递给挂起函数类型重载时，改进的重载决议](#improved-overload-resolution-for-lambdas-with-suspend-function-types)。
*   **Kotlin/Native**：[支持 Xcode 26、栈保护（stack canaries）和减小发布二进制文件大小](#kotlin-native)。
*   **Kotlin/JS**：[`Long` 值编译为 JavaScript `BigInt`](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type)。

> Web 平台的 Compose Multiplatform 进入 Beta 阶段。请在我们的[博客文章](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/)中了解更多信息。
>
{style="note"}

您还可以在此视频中找到更新的简短概述：

<video src="https://www.youtube.com/v/QWpp5-LlTqA" title="Kotlin 2.2.21 有哪些新特性"/>

## IDE 支持

支持 Kotlin 2.2.20 的 Kotlin 插件已捆绑在最新版 IntelliJ IDEA 和 Android Studio 中。要更新，您只需在构建脚本中将 Kotlin 版本更改为 2.2.20。

有关详细信息，请参见[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

在 Kotlin 2.2.20 中，您可以试用计划用于 Kotlin 2.3.0 的即将推出的语言特性，包括
[将 lambda 表达式传递给挂起函数类型重载时，改进的重载决议](#improved-overload-resolution-for-lambdas-with-suspend-function-types)
和[支持在具有显式返回类型的表达式体中使用 `return` 语句](#support-for-return-statements-in-expression-bodies-with-explicit-return-types)。此版本还包括对
[`when` 表达式的穷尽性检测](#data-flow-based-exhaustiveness-checks-for-when-expressions)、
[具体化 `Throwable` 捕获](#support-for-reified-types-in-catch-clauses)和 [Kotlin 契约](#improved-kotlin-contracts)的改进。

### 将 lambda 表达式传递给挂起函数类型重载时，改进的重载决议

此前，当将 lambda 表达式传递给同时具有常规函数类型和 `suspend` 函数类型的重载函数时，会导致歧义错误。您可以通过显式类型转换来解决此错误，但编译器会错误地报告“无需转换”警告：

```kotlin
// 定义两个重载
fun transform(block: () -> Int) {}
fun transform(block: suspend () -> Int) {}

fun test() {
    // 失败，出现重载决议歧义
    transform({ 42 })

    // 使用显式类型转换，但编译器错误地报告“无需转换”警告
    transform({ 42 } as () -> Int)
}
```

此更改后，当您同时定义常规和 `suspend` 函数类型重载时，不带类型转换的 lambda 表达式将决议为常规重载。使用 `suspend` 关键字可显式决议为 suspend 重载：

```kotlin
// 决议为 transform(() -> Int)
transform({ 42 })

// 决议为 transform(suspend () -> Int)
transform(suspend { 42 })
```

此行为将在 Kotlin 2.3.0 中默认启用。要立即试用，请使用以下编译器选项将您的语言版本设置为 `2.3`：

```kotlin
-language-version 2.3
```

或者在您的 `build.gradle(.kts)` 文件中进行配置：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23610) 中提供反馈。

### 支持在具有显式返回类型的表达式体中使用 `return` 语句

此前，在表达式体中使用 `return` 会导致编译器错误，因为它可能导致函数的返回类型被推断为 `Nothing`。

```kotlin
fun example() = return 42
// 错误：具有表达式体的函数禁止使用 return 语句
```

此更改后，只要显式写入返回类型，您现在就可以在表达式体中使用 `return`：

```kotlin
// 显式指定返回类型
fun getDisplayNameOrDefault(userId: String?): String = getDisplayName(userId ?: return "default")

// 失败，因为它没有显式指定返回类型
fun getDisplayNameOrDefault(userId: String?) = getDisplayName(userId ?: return "default")
```

同样，在具有表达式体的函数中，lambda 表达式和嵌套表达式内部的 `return` 语句过去会意外编译。Kotlin 现在支持这些情况，只要显式指定返回类型即可。在 Kotlin 2.3.0 中，没有显式返回类型的情况将被弃用：

```kotlin
// 返回类型未显式指定，并且 return 语句位于 lambda 表达式内部
// 这将被弃用
fun returnInsideLambda() = run { return 42 }

// 返回类型未显式指定，并且 return 语句位于局部变量的初始化器内部
// 这将被弃用
fun returnInsideIf() = when {
    else -> {
        val result = if (someCondition()) return "" else "value"
        result
    }
}
```

此行为将在 Kotlin 2.3.0 中默认启用。要立即试用，请使用以下编译器选项将您的语言版本设置为 `2.3`：

```kotlin
-language-version 2.3
```

或者在您的 `build.gradle(.kts)` 文件中进行配置：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76926) 中提供反馈。

### `when` 表达式的基于数据流的穷尽性检测
<primary-label ref="experimental-opt-in"/>

> IntelliJ IDEA 中对该特性的代码分析、代码补全和高亮显示支持目前仅在 [2025.3 EAP 构建版](https://www.jetbrains.com/idea/nextversion/)中提供。
>
{style = "note"}

Kotlin 2.2.20 引入了针对 `when` 表达式的**基于数据流的**穷尽性检测。此前，编译器的检测仅限于 `when` 表达式本身，这通常会强制您添加一个冗余的 `else` 分支。通过此次更新，编译器现在会跟踪先前的条件检测和提前返回，因此您可以移除冗余的 `else` 分支。

例如，编译器现在识别出当 `if` 条件满足时函数会返回，因此 `when` 表达式只需处理剩余的情况：

```kotlin
enum class UserRole { ADMIN, MEMBER, GUEST }

fun getPermissionLevel(role: UserRole): Int {
    // 涵盖 when 表达式之外的 Admin 情况
    if (role == UserRole.ADMIN) return 99

    return when (role) {
        UserRole.MEMBER -> 10
        UserRole.GUEST -> 1
        // 您不再需要包含此 else 分支
        // else -> throw IllegalStateException()
    }
}
```

此特性是[实验性的](components-stability.md#stability-levels-explained)。要启用它，请将以下编译器选项添加到您的 `build.gradle(.kts)` 文件中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xdata-flow-based-exhaustiveness")
    }
}
```

### `catch` 子句中具体化类型的支持
<primary-label ref="experimental-opt-in"/>

> IntelliJ IDEA 中对该特性的代码分析、代码补全和高亮显示支持目前仅在 [2025.3 EAP 构建版](https://www.jetbrains.com/idea/nextversion/)中提供。
>
{style = "note"}

在 Kotlin 2.2.20 中，编译器现在允许在 `inline` 函数的 `catch` 子句中使用[具体化泛型类型形参](inline-functions.md#reified-type-parameters)。

这是一个例子：

```kotlin
inline fun <reified ExceptionType : Throwable> handleException(block: () -> Unit) {
    try {
        block()
        // 此更改后，现在允许这样做
    } catch (e: ExceptionType) {
        println("Caught specific exception: ${e::class.simpleName}")
    }
}

fun main() {
    // 尝试执行可能抛出 IOException 的操作
    handleException<java.io.IOException> {
        throw java.io.IOException("File not found")
    }
    // Caught specific exception: IOException
}
```

此前，尝试在 `inline` 函数中捕获具体化的 `Throwable` 类型会导致错误。

此行为将在 Kotlin 2.4.0 中默认启用。要立即使用它，请将以下编译器选项添加到您的 `build.gradle(.kts)` 文件中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-reified-type-in-catch")
    }
}
```

Kotlin 团队感谢外部贡献者 [Iven Krall](https://github.com/kralliv) 的贡献。

### 改进的 Kotlin 契约
<primary-label ref="experimental-opt-in"/>

> IntelliJ IDEA 中对该特性的代码分析、代码补全和高亮显示支持目前仅在 [2025.3 EAP 构建版](https://www.jetbrains.com/idea/nextversion/)中提供。
>
{style = "note"}

Kotlin 2.2.20 对 [Kotlin 契约](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/contract.html)进行了多项改进，包括：

*   [契约类型断言中对泛型的支持](#support-for-generics-in-contract-type-assertions)。
*   [支持在属性访问器和特定操作符函数内部使用契约](#support-for-contracts-inside-property-accessors-and-specific-operator-functions)。
*   [契约中对 `returnsNotNull()` 函数的支持](#support-for-the-returnsnotnull-function-in-contracts)，以确保在满足条件时返回非空值。
*   [新的 `holdsIn` 关键字](#new-holdsin-keyword)，允许您假定条件在 lambda 表达式内部为 `true`。

这些改进是[实验性的](components-stability.md#stability-levels-explained)。要选择启用，您仍然需要在声明契约时使用 `@OptIn(ExperimentalContracts::class)` 注解。`holdsIn` 关键字和 `returnsNotNull()` 函数也需要 `@OptIn(ExperimentalExtendedContracts::class)` 注解。

要使用这些改进，您还需要添加下面每个部分中描述的编译器选项。

我们非常感谢您在我们的[问题跟踪器](https://kotl.in/issue)中提供反馈。

#### 契约类型断言中对泛型的支持

您现在可以编写对泛型类型执行类型断言的契约：

```kotlin
import kotlin.contracts.*

sealed class Failure {
    class HttpError(val code: Int) : Failure()
    // 在此处插入其他故障类型
}

sealed class Result<out T, out F : Failure> {
    class Success<T>(val data: T) : Result<T, Nothing>()
    class Failed<F : Failure>(val failure: F) : Result<Nothing, F>()
}

@OptIn(ExperimentalContracts::class)
// 使用契约来断言泛型类型
fun <T, F : Failure> Result<T, F>.isHttpError(): Boolean {
    contract {
        returns(true) implies (this@isHttpError is Result.Failed<Failure.HttpError>)
    }
    return this is Result.Failed && this.failure is Failure.HttpError
}
```

在此示例中，契约对 `Result` 对象执行类型断言，允许编译器安全地将其[智能类型转换](typecasts.md#smart-casts)为断言的泛型类型。

此特性是[实验性的](components-stability.md#stability-levels-explained)。要选择启用，请将以下编译器选项添加到您的 `build.gradle(.kts)` 文件中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### 支持在属性访问器和特定操作符函数内部使用契约

您现在可以在属性访问器和特定操作符函数内部定义契约。这让您可以在更多类型的声明上使用契约，使其更加灵活。

例如，您可以在 getter 内部使用契约来为接收者对象启用智能类型转换：

```kotlin
import kotlin.contracts.*

val Any.isHelloString: Boolean
    get() {
        @OptIn(ExperimentalContracts::class)
        // 当 getter 返回 true 时，启用将接收者智能类型转换为 String
        contract { returns(true) implies (this@isHelloString is String) }
        return "hello" == this
    }

fun printIfHelloString(x: Any) {
    if (x.isHelloString) {
        // 在接收者智能类型转换为 String 后打印长度
        println(x.length)
        // 5
    }
}
```

此外，您可以在以下操作符函数中使用契约：

*   `invoke`
*   `contains`
*   `rangeTo`、`rangeUntil`
*   `componentN`
*   `iterator`
*   `unaryPlus`、`unaryMinus`、`not`
*   `inc`、`dec`

这是一个在操作符函数中使用契约以确保 lambda 表达式内部变量初始化的示例：

```kotlin
import kotlin.contracts.*

class Runner {
    @OptIn(ExperimentalContracts::class)
    // 启用在 lambda 表达式内部赋值的变量的初始化
    operator fun invoke(block: () -> Unit) {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        block()
    }
}

fun testOperator(runner: Runner) {
    val number: Int
    runner {
        number = 1
    }
    // 打印由契约保证的确定初始化后的值
    println(number)
    // 1
}
```

此特性是[实验性的](components-stability.md#stability-levels-explained)。要选择启用，请将以下编译器选项添加到您的 `build.gradle(.kts)` 文件中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### 契约中对 `returnsNotNull()` 函数的支持

Kotlin 2.2.20 引入了用于契约的 [`returnsNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/returns-not-null.html) 函数。您可以使用此函数来确保当满足特定条件时函数返回非空值。这通过用一个简洁的函数替换单独的可空和非空函数重载来简化您的代码：

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun decode(encoded: String?): String? {
    contract {
        // 当输入非空时，保证返回非空值
        (encoded != null) implies (returnsNotNull())
    }
    if (encoded == null) return null
    return java.net.URLDecoder.decode(encoded, "UTF-8")
}

fun useDecodedValue(s: String?) {
    // 由于返回值可能为空，使用安全调用
    decode(s)?.length
    if (s != null) {
        // 在智能类型转换后，将返回值视为非空
        decode(s).length
    }
}
```

在此示例中，`decode()` 函数中的契约允许编译器在输入非空时智能类型转换其返回值，从而无需额外的空检测或多个重载。

此特性是[实验性的](components-stability.md#stability-levels-explained)。要选择启用，请将以下编译器选项添加到您的 `build.gradle(.kts)` 文件中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-condition-implies-returns-contracts")
    }
}
```

#### 新的 `holdsIn` 关键字

Kotlin 2.2.20 引入了用于契约的新 [`holdsIn`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/holds-in.html) 关键字。您可以使用它来确保在特定 lambda 表达式内部，布尔条件被假定为 `true`。这让您可以使用契约构建带有条件智能类型转换的 DSL。

这是一个例子：

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun <T> T.alsoIf(condition: Boolean, block: (T) -> Unit): T {
    contract {
        // 声明 lambda 表达式最多运行一次
        callsInPlace(block, InvocationKind.AT_MOST_ONCE)
        // 声明条件在 lambda 表达式内部被假定为 true
        condition holdsIn block
    }
    if (condition) block(this)
    return this
}

fun useApplyIf(input: Any) {
    val result = listOf(1, 2, 3)
        .first()
        .alsoIf(input is Int) {
            // 输入形参在 lambda 表达式内部被智能类型转换为 Int
            // 打印输入和 list 第一个元素的和
            println(input + it)
            // 2
        }
        .toString()
}
```

此特性是[实验性的](components-stability.md#stability-levels-explained)。要选择启用，请将以下编译器选项添加到您的 `build.gradle(.kts)` 文件中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-holdsin-contract")
    }
}
```

## Kotlin/JVM：支持 `invokedynamic` 和 `when` 表达式
<primary-label ref="experimental-opt-in"/>

在 Kotlin 2.2.20 中，您现在可以使用 `invokedynamic` 编译 `when` 表达式。此前，带有多个类型检测的 `when` 表达式会编译成字节码中一长串的 `instanceof` 检测。

现在，您可以使用 `invokedynamic` 和 `when` 表达式来生成更小的字节码，类似于 Java `switch` 语句生成的字节码，前提是满足以下条件：

*   除了 `else` 之外，所有条件都是 `is` 或 `null` 检测。
*   表达式不包含[守卫条件 (`if`)](control-flow.md#guard-conditions-in-when-expressions)。
*   条件不包含不能直接进行类型检测的类型，例如可变 Kotlin list (`MutableList`) 或函数类型 (`kotlin.Function1`、`kotlin.Function2` 等)。
*   除了 `else` 之外，至少有两个条件。
*   所有分支都检测 `when` 表达式的相同主体。

例如：

```kotlin
open class Example

class A : Example()
class B : Example()
class C : Example()

fun test(e: Example) = when (e) {
    // 将 invokedynamic 与 SwitchBootstraps.typeSwitch 结合使用
    is A -> 1
    is B -> 2
    is C -> 3
    else -> 0
}
```

启用新特性后，此示例中的 `when` 表达式将编译为单个 `invokedynamic` 类型开关，而不是多个 `instanceof` 检测。

要启用此特性，请使用 JVM 目标平台 21 或更高版本编译您的 Kotlin 代码，并添加以下编译器选项：

```bash
-Xwhen-expressions=indy
```

或者将其添加到 `build.gradle(.kts)` 文件中的 `compilerOptions {}` 代码块：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-expressions=indy")
    }
}
```

此特性是[实验性的](components-stability.md#stability-levels-explained)。我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-65688) 中提供反馈。

## Kotlin Multiplatform

Kotlin 2.2.20 为 Kotlin Multiplatform 带来了重大变化：Swift 导出功能默认可用，引入了新的共享源代码集，并且您可以尝试一种管理公共依赖项的新方法。

### Swift 导出功能默认可用
<primary-label ref="experimental-general"/>

Kotlin 2.2.20 引入了对 Swift 导出的实验性支持。它允许您直接导出 Kotlin 源代码并以符合 Swift 习惯的方式调用 Kotlin 代码，无需 Objective-C 头文件。

这应该会显著改善 Apple 目标平台的跨平台开发。例如，如果您有一个具有顶层函数的 Kotlin 模块，Swift 导出功能可以实现清晰、模块特有的导入，从而移除令人困惑的 Objective-C 下划线和名字修饰。

主要特性包括：

*   **多模块支持**。每个 Kotlin 模块都作为独立的 Swift 模块导出，简化了函数调用。
*   **包支持**。Kotlin 包在导出期间被显式保留，避免了生成的 Swift 代码中的命名冲突。
*   **类型别名**。Kotlin 类型别名在 Swift 中导出和保留，提高了可读性。
*   **增强的原语可空性**。与 Objective-C 互操作不同，Objective-C 互操作需要将 `Int?` 等类型装箱到 `KotlinInt` 等包装类以保留可空性，而 Swift 导出直接转换可空性信息。
*   **重载**。您可以在 Swift 中调用 Kotlin 的重载函数而不会产生歧义。
*   **扁平化包结构**。您可以将 Kotlin 包转换为 Swift 枚举，从生成的 Swift 代码中移除包前缀。
*   **模块名称自定义**。您可以在 Kotlin 项目的 Gradle 配置中自定义生成的 Swift 模块名称。

#### 如何启用 Swift 导出

此特性目前是[实验性的](components-stability.md#stability-levels-explained)，并且仅适用于使用[直接集成](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html)将 iOS framework 连接到 Xcode 项目的项目。这是使用 IntelliJ IDEA 中的 Kotlin Multiplatform 插件或通过[网页向导](https://kmp.jetbrains.com/)创建的多平台项目的标准配置。

要试用 Swift 导出功能，请配置您的 Xcode 项目：

1.  在 Xcode 中，打开项目设置。
2.  在 **Build Phases** 选项卡中，找到带有 `embedAndSignAppleFrameworkForXcode` 任务的 **Run Script** 阶段。
3.  调整脚本以在运行脚本阶段改用 `embedSwiftExportForXcode` 任务：

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![添加 Swift 导出脚本](xcode-swift-export-run-script-phase.png){width=700}

4.  构建项目。Swift 模块在构建输出目录中生成。

此特性默认可用。如果您已在以前的版本中启用它，现在可以从 `gradle.properties` 文件中移除 `kotlin.experimental.swift-export.enabled`。

> 为了节省时间，请克隆我们已设置好 Swift 导出的[公共示例](https://github.com/Kotlin/swift-export-sample)。
>
{style="tip"}

有关 Swift 导出的更多信息，请参见我们的[文档](native-swift-export.md)。

#### 提供反馈

我们计划在未来的 Kotlin 版本中扩展并逐步稳定 Swift 导出支持。在 Kotlin 2.2.20 之后，我们将重点关注改进 Kotlin 和 Swift 之间的互操作性，特别是围绕协程和 flow。

对 Swift 导出的支持是 Kotlin Multiplatform 的一项重大变化。我们非常感谢您的反馈：

*   直接在 Kotlin Slack 中联系开发团队 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)并加入 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 频道。
*   在 [YouTrack](https://kotl.in/issue) 中报告您在使用 Swift 导出时遇到的任何问题。

### `js` 和 `wasmJs` 目标平台的共享源代码集

此前，Kotlin Multiplatform 默认不包含 JavaScript (`js`) 和 WebAssembly (`wasmJs`) Web 目标平台的共享源代码集。要在 `js` 和 `wasmJs` 之间共享代码，您必须手动配置自定义源代码集，或者在两个地方编写代码，一个版本用于 `js`，另一个版本用于 `wasmJs`。例如：

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// jsMain
external interface Navigator { val clipboard: Clipboard }
// JS 和 Wasm 中不同的互操作
external interface Clipboard { fun readText(): Promise<String> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    // JS 和 Wasm 中不同的互操作
    return navigator.clipboard.readText().await()
}

// wasmJsMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

从此版本开始，当您使用[默认层级模板](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)时，Kotlin Gradle 插件会添加一个新的 Web 共享源代码集（包含 `webMain` 和 `webTest`）。

通过此更改，`web` 源代码集成为 `js` 和 `wasmJs` 源代码集的父级。更新后的源代码集层级结构如下：

![使用带有 web 的默认层级模板的示例](default-hierarchy-example-with-web.svg)

新的源代码集允许您为 `js` 和 `wasmJs` 目标平台编写一段代码。您可以将共享代码放在 `webMain` 中，它将自动适用于两者：

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
@OptIn(ExperimentalWasmJsInterop::class)
private suspend fun <R : JsAny?> Promise<R>.await(): R = suspendCancellableCoroutine { continuation ->
    this.then(
        onFulfilled = { continuation.resumeWith(Result.success(it)); null },
        onRejected = { continuation.resumeWithException(it.asJsException()); null }
    )
}

external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

actual suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

此更新简化了 `js` 和 `wasmJs` 目标平台之间的代码共享。它在两种情况下特别有用：

*   如果您是库作者，并且希望在不复制代码的情况下支持 `js` 和 `wasmJs` 目标平台。
*   如果您正在开发面向 Web 的 Compose Multiplatform 应用程序，可以为 `js` 和 `wasmJs` 目标平台启用交叉编译，以实现更广泛的浏览器兼容性。鉴于这种回退模式，当您创建网站时，它可以在所有浏览器上开箱即用，因为现代浏览器使用 `wasmJs`，而旧版浏览器使用 `js`。

要试用此特性，请在您的 `build.gradle(.kts)` 文件中的 `kotlin {}` 代码块中使用[默认层级模板](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)：

```kotlin
kotlin {
    js()
    wasmJs()

    // 启用默认源代码集层级，包括 webMain 和 webTest
    applyDefaultHierarchyTemplate()
}
```

在使用默认层级之前，如果您有带有自定义共享源代码集或重命名了 `js("web")` 目标平台的项目，请仔细考虑任何潜在冲突。要解决这些冲突，请重命名冲突的源代码集或目标平台，或者不要使用默认层级。

### Kotlin 库的稳定跨平台编译

Kotlin 2.2.20 完成了一项重要的[路线图项](https://youtrack.jetbrains.com/issue/KT-71290)，稳定了 Kotlin 库的跨平台编译。

您现在可以使用任何[支持的主机](native-target-support.md#hosts)来生成 `.klib` 构件以发布 Kotlin 库。这显著简化了发布过程，特别是对于以前需要 Mac 机器的 Apple 目标平台。

此特性默认可用。如果您已经使用 `kotlin.native.enableKlibsCrossCompilation=true` 启用了交叉编译，现在可以从 `gradle.properties` 文件中移除它。

不幸的是，仍然存在一些限制。在以下情况下，您仍然需要使用 Mac 机器：

*   您的库或任何依赖模块具有 [cinterop 依赖项](native-c-interop.md)。
*   您已在项目中使用 [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)。
*   您需要为 Apple 目标平台[构建或检测最终二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。

有关多平台库发布的更多信息，请参见我们的[文档](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)。

### 声明公共依赖项的新方法
<primary-label ref="experimental-opt-in"/>

为了简化使用 Gradle 设置多平台项目，当您的项目使用 Gradle 8.8 或更高版本时，Kotlin 2.2.20 现在允许您通过在 `kotlin {}` 代码块中使用顶层 `dependencies {}` 代码块来声明公共依赖项。这些依赖项的行为如同在 `commonMain` 源代码集中声明一样。此特性与您用于 Kotlin/JVM 和仅限 Android 项目的 `dependencies` 代码块类似，并且现在在 Kotlin Multiplatform 中是[实验性的](components-stability.md#stability-levels-explained)。

在项目级别声明公共依赖项减少了源代码集之间重复配置，并有助于简化您的构建设置。您仍然可以根据需要在每个源代码集中添加平台特有的依赖项。

要试用此特性，请通过在顶层 `dependencies {}` 代码块之前添加 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 注解来选择启用。例如：

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446) 中对这一特性提供反馈。

### 针对依赖项中目标平台支持的新诊断

在 Kotlin 2.2.20 之前，如果构建脚本中的依赖项不支持源代码集所需的所有目标平台，Gradle 产生的错误消息使其难以理解问题。

Kotlin 2.2.20 引入了一项新的诊断，清晰显示每个依赖项支持哪些目标平台以及不支持哪些目标平台。

此诊断默认启用。如果出于某种原因，您需要禁用它，请在此 [YouTrack 问题](https://kotl.in/kmp-dependencies-diagnostic-issue)中评论告知我们。您可以使用以下 Gradle 属性在 `gradle.properties` 文件中禁用此诊断：

| 属性                                                     | 描述                                     |
|:---------------------------------------------------------|:-----------------------------------------|
| `kotlin.kmp.eagerUnresolvedDependenciesDiagnostic=false` | 仅对元数据编译项和导入运行诊断               |
| `kotlin.kmp.unresolvedDependenciesDiagnostic=false`      | 完全禁用此诊断                           |

## Kotlin/Native

此版本带来了对 Xcode 26 的支持、改进了与 Objective-C/Swift 的互操作性、调试功能和新的二进制选项。

### 支持 Xcode 26

从 Kotlin 2.2.2**1** 开始，Kotlin/Native 编译器支持 Xcode 26 – 最新稳定版 Xcode。
您现在可以更新您的 Xcode 并访问最新 API，以继续为 Apple 操作系统上的 Kotlin 项目工作。

### 二进制文件中对栈保护（stack canaries）的支持

从 Kotlin 2.2.20 开始，Kotlin 在生成的 Kotlin/Native 二进制文件中增加了对栈保护（stack canaries）的支持。作为栈保护的一部分，此安全特性可以防止栈粉碎攻击，从而缓解一些常见的应用程序漏洞。该功能已在 Swift 和 Objective-C 中可用，现在 Kotlin 也支持此功能。

Kotlin/Native 中栈保护的实现遵循 [Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector) 中栈保护器的行为。

要启用栈保护，请将以下[二进制选项](native-binary-options.md)添加到您的 `gradle.properties` 文件中：

```none
kotlin.native.binary.stackProtector=yes
```

此属性为所有易受栈粉碎攻击的 Kotlin 函数启用此特性。其他模式包括：

*   `kotlin.native.binary.stackProtector=strong`，它对易受栈粉碎攻击的函数使用更强的启发式算法。
*   `kotlin.native.binary.stackProtector=all`，它为所有函数启用栈保护。

请注意，在某些情况下，栈保护可能会带来性能开销。

### 减小发布二进制文件大小
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 引入了 `smallBinary` 选项，可以帮助您减小发布二进制文件的大小。新选项有效地将 `-Oz` 设置为 LLVM 编译阶段编译器默认的优化实参。

启用 `smallBinary` 选项后，您可以减小发布二进制文件的大小并缩短构建时间。但是，在某些情况下，它可能会影响运行时性能。

此新特性目前是[实验性的](components-stability.md#stability-levels-explained)。要在您的项目中试用它，请将以下[二进制选项](native-binary-options.md)添加到您的 `gradle.properties` 文件中：

```none
kotlin.native.binary.smallBinary=true
```

Kotlin 团队感谢 [Troels Lund](https://github.com/troelsbjerre) 对此特性实现提供的帮助。

### 改进的调试器对象摘要

Kotlin/Native 现在为 LLDB 和 GDB 等调试工具生成更清晰的对象摘要。这提高了生成的调试信息的阅读性，并简化了您的调试体验。

例如，考虑以下对象：

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

此前，探查只会显示有限的信息，包括指向对象内存地址的指针：

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

在 Kotlin 2.2.20 中，调试器现在会显示更丰富详细的信息，包括实际值：

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

Kotlin 团队感谢 [Nikita Nazarov](https://github.com/nikita-nazarov) 对此特性实现提供的帮助。

有关 Kotlin/Native 调试的更多信息，请参见[文档](native-debugging.md)。

### Objective-C 头文件中块类型的显式名称

Kotlin 2.2.20 引入了一个选项，可以将 Kotlin/Native 项目中导出的 Kotlin 函数类型的显式形参名称添加到 Objective-C 头文件中的块类型。形参名称改进了 Xcode 中的自动补全建议，并有助于避免 Clang 警告。

此前，生成的 Objective-C 头文件中会省略块类型中的形参名称。在这种情况下，Xcode 的自动补全会建议在没有形参名称的情况下调用此类函数。生成的代码块会触发 Clang 警告。

例如，对于以下 Kotlin 代码：

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

生成的 Objective-C 头文件中没有形参名称：

```objc
// Objective-C:
+ (void)greetUserBlock:(void (^)(NSString *))block __attribute__((swift_name("greetUser(block:)")));
```

因此，当从 Objective-C 在 Xcode 中调用 `greetUserBlock()` 函数时，IDE 建议：

```objc
// Objective-C:
greetUserBlock:^(NSString *) {
    // ...
};
```

建议中缺少形参名称 `(NSString *)` 导致了 Clang 警告。

通过新选项，Kotlin 将 Kotlin 函数类型中的形参名称转发到 Objective-C 块类型，因此 Xcode 在建议中使用它们：

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

要启用显式形参名称，请将以下[二进制选项](native-binary-options.md)添加到您的 `gradle.properties` 文件中：

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=true
```

Kotlin 团队感谢 [Yijie Jiang](https://github.com/edisongz) 实现了此特性。

### 减小 Kotlin/Native 分发版大小

Kotlin/Native 分发版过去包含两个带有编译器代码的 JAR 文件：

*   `konan/lib/kotlin-native.jar`
*   `konan/lib/kotlin-native-compiler-embeddable.jar`。

从 Kotlin 2.2.20 开始，`kotlin-native.jar` 不再发布。

移除的 JAR 文件是嵌入式编译器的旧版本，现在不再需要。此更改显著减小了分发版的大小。

因此，以下选项现已弃用并移除：

*   `kotlin.native.useEmbeddableCompilerJar=false` Gradle 属性。相反，Kotlin/Native 项目始终使用嵌入式编译器 JAR 文件。
*   `KotlinCompilerPluginSupportPlugin.getPluginArtifactForNative()` 函数。相反，始终使用 [`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html) 函数。

有关更多信息，请参见 [YouTrack 问题](https://kotl.in/KT-51301)。

### KDoc 默认导出到 Objective-C 头文件

在编译 Kotlin/Native 最终二进制文件期间，[KDoc](kotlin-doc.md) 注释现在默认导出到生成的 Objective-C 头文件。

此前，您需要手动将 `-Xexport-kdoc` 选项添加到构建文件中。现在，它会自动传递给编译任务。

此选项将 KDoc 注释嵌入到 klibs 中，并在生成 Apple framework 时从 klibs 中提取注释。因此，类和方法的注释会在自动补全时出现，例如在 Xcode 中。

您可以在 `build.gradle(.kts)` 文件中的 `binaries {}` 代码块中禁用 KDoc 注释从 klibs 导出到生成的 Apple framework：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

kotlin {
    iosArm64 {
        binaries {
            framework {
                baseName = "sdk"
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                exportKdoc.set(false)
            }
        }
    }
}
```

有关更多信息，请参见[我们的文档](native-objc-interop.md#provide-documentation-with-kdoc-comments)。

### x86_64 Apple 目标平台的弃用

Apple 在几年前停止生产配备 Intel 芯片的设备，并且[最近宣布](https://www.youtube.com/live/51iONeETSng?t=3288s) macOS Tahoe 26 将是最后一个支持基于 Intel 架构的操作系统版本。

这使得我们越来越难以在构建代理上正确检测这些目标平台，尤其是在未来的 Kotlin 版本中，我们将更新 macOS 26 附带的受支持 Xcode 版本。

从 Kotlin 2.2.20 开始，`macosX64` 和 `iosX64` 目标平台被降级到支持层级 2。这意味着目标平台会在 CI 上定期检测以确保其能够编译，但可能不会自动检测以确保其能够运行。

我们计划在 Kotlin 2.2.20−2.4.0 发布周期内逐步弃用所有 `x86_64` Apple 目标平台，并最终移除对其支持。这包括以下目标平台：

*   `macosX64`
*   `iosX64`
*   `tvosX64`
*   `watchosX64`

有关支持层级的更多信息，请参见 [Kotlin/Native 目标平台支持](native-target-support.md)。

## Kotlin/Wasm

Kotlin/Wasm 现已进入 Beta 阶段，提供了更高的稳定性，并改进了 npm 依赖项分离、
[JavaScript 互操作中更精细的异常处理](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop)、
[内置浏览器调试支持](#support-for-debugging-in-browsers-without-configuration)等功能。

### 分离的 npm 依赖项

此前，在您的 Kotlin/Wasm 项目中，所有 [npm](https://www.npmjs.com/) 依赖项都一起安装在您的项目文件夹中，包括 Kotlin 工具链依赖项和您自己的依赖项。它们也一起记录在您项目的锁文件（`package-lock.json` 或 `yarn.lock`）中。

结果是，每当 Kotlin 工具链依赖项更新时，即使您没有添加或更改任何内容，也必须更新您的锁文件。

从 Kotlin 2.2.20 开始，Kotlin 工具链的 npm 依赖项安装在项目之外。现在，工具链依赖项和您的（用户）依赖项有独立的目录：

*   **工具链依赖项目录：**

    `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

*   **用户依赖项目录：**

    `build/wasm/node_modules`

此外，项目目录内的锁文件仅包含用户定义的依赖项。

此改进使您的锁文件仅专注于您自己的依赖项，有助于维护更整洁的项目，并减少对文件不必要的更改。

此更改默认对 `wasm-js` 目标平台启用。此更改尚未针对 `js` 目标平台实现。虽然计划在未来的版本中实现，但 `js` 目标平台在 Kotlin 2.2.20 中的 npm 依赖项行为保持不变。

### Kotlin/Wasm 和 JavaScript 互操作中改进的异常处理

此前，Kotlin 很难理解 JavaScript (JS) 中抛出并跨越到 Kotlin/Wasm 代码的异常（错误）。

在某些情况下，该问题也会出现相反的问题，当异常从 Wasm 代码抛出或传递到 JS 并被包装成 `WebAssembly.Exception` 而没有任何细节时。这些 Kotlin 异常处理问题使调试变得困难。

从 Kotlin 2.2.20 开始，异常的开发者体验在两个方向上都有所改进：

*   当异常从 JS 抛出时，您可以在 Kotlin 侧看到更多信息。当此类异常通过 Kotlin 传播回 JS 时，它不再包装到 WebAssembly 中。
*   当异常从 Kotlin 抛出时，它们现在可以在 JS 侧作为 JS 错误捕获。

新的异常处理在支持 [`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag) 特性的现代浏览器中自动工作：

*   Chrome 115+
*   Firefox 129+
*   Safari 18.4+

在旧版浏览器中，异常处理行为保持不变。

### 无需配置即可在浏览器中调试的支持

此前，浏览器无法自动访问调试所需的 Kotlin/Wasm 项目源代码。要在浏览器中调试 Kotlin/Wasm 应用程序，您必须手动配置您的构建以提供这些源代码，方法是将以下代码片段添加到您的 `build.gradle(.kts)` 文件中：

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        add(project.rootDir.path)
    }
}
```

从 Kotlin 2.2.20 开始，调试您的应用程序可以开箱即用。当您运行 Gradle 开发任务 (`*DevRun`) 时，Kotlin 会自动向浏览器提供源文件，允许您设置断点、探查变量并单步调试 Kotlin 代码，无需额外设置。

此更改通过消除手动配置的需要来简化调试。所需的配置现在包含在 Kotlin Gradle 插件中。如果您此前已将此配置添加到 `build.gradle(.kts)` 文件中，则应将其移除以避免冲突。

浏览器调试默认对所有 Gradle `*DevRun` 任务启用。这些任务不仅提供应用程序，还提供其源文件，因此仅将其用于本地开发，并避免在云或生产环境中运行它们，因为源代码可能会公开暴露。

#### 调试期间处理重复加载

默认提供源代码可能会导致[在 Kotlin 编译和打包完成之前，浏览器中应用程序重复加载](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0)。作为临时解决方案，请调整您的 webpack 配置以忽略 Kotlin 源文件并禁用对提供的静态文件的监视。在项目的根目录下，将一个 `.js` 文件添加到 `webpack.config.d` 目录中，内容如下：

```kotlin
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
        return { directory: file,
                 watch: false,
        }
    } else {
        return file
    }
    })
}
```

### 消除空的 `yarn.lock` 文件

此前，Kotlin Gradle 插件 (KGP) 会自动生成一个 `yarn.lock` 文件，其中包含 Kotlin 工具链所需的 npm 包信息，以及项目中或使用的库中任何现有的 [npm](https://www.npmjs.com/) 依赖项。

现在，KGP 单独管理工具链依赖项，并且一个项目级别的 `yarn.lock` 文件不再生成，除非项目有 npm 依赖项。

当添加 npm 依赖项时，KGP 会自动创建 `yarn.lock` 文件；当移除 npm 依赖项时，它会删除 `yarn.lock` 文件。

此更改清理了项目结构，并使跟踪实际 npm 依赖项的引入时机变得更容易。

无需额外步骤来配置此行为。从 Kotlin 2.2.20 开始，它在 Kotlin/Wasm 项目中默认应用。

### 完全限定类名中的新编译器错误

在 Kotlin/Wasm 上，编译器默认不会在生成的二进制文件中存储类的完全限定名称 (FQN)。这种方法避免了增加应用程序大小。

作为结果，在以前的 Kotlin 版本中，调用 `KClass::qualifiedName` 属性会返回一个空字符串，而不是类的限定名称。

从 Kotlin 2.2.20 开始，除非您显式启用限定名称特性，否则当您在 Kotlin/Wasm 项目中使用 `KClass::qualifiedName` 属性时，编译器会报告错误。

此更改通过在编译期捕获问题来防止调用 `qualifiedName` 属性时出现意外的空字符串，并改进开发者体验。

此诊断默认启用，错误会自动报告。要禁用诊断并允许在 Kotlin/Wasm 中存储 FQN，请通过将以下选项添加到您的 `build.gradle(.kts)` 文件中来指示编译器为所有类存储完全限定名称：

```kotlin
kotlin {
    wasmJs {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-kclass-fqn")
        }
    }
}
```

> 请记住，启用此选项会增加应用程序大小。
>
{style="note"}

## Kotlin/JS

Kotlin 2.2.20 支持使用 `BigInt` 类型来表示 Kotlin 的 `Long` 类型，从而在导出声明中启用 `Long`。此外，此版本添加了一个 DSL 函数来清理 Node.js 实参。

### 使用 `BigInt` 类型表示 Kotlin 的 `Long` 类型
<primary-label ref="experimental-opt-in"/>

在 ES2020 标准之前，JavaScript (JS) 不支持用于表示大于 53 位的精确整数的原生类型。

因此，Kotlin/JS 过去将 `Long` 值（64 位宽）表示为包含两个 `number` 属性的 JavaScript 对象。这种自定义实现使得 Kotlin 和 JavaScript 之间的互操作性更加复杂。

从 Kotlin 2.2.20 开始，Kotlin/JS 现在在编译到现代 JavaScript (ES2020) 时使用 JavaScript 的内置 `BigInt` 类型来表示 Kotlin 的 `Long` 值。

此更改使[能够将 `Long` 类型导出到 JavaScript](#usage-of-long-in-exported-declarations)，这也是 Kotlin 2.2.20 中引入的一项特性。因此，此更改简化了 Kotlin 和 JavaScript 之间的互操作性。

要启用它，您需要添加以下编译器选项到您的 `build.gradle(.kts)` 文件中：

```kotlin
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

此特性是[实验性的](components-stability.md#stability-levels-explained)。我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128) 中提供反馈。

#### 在导出声明中使用 `Long`

因为 Kotlin/JS 使用自定义 `Long` 表示，所以很难提供一种直接的方法来从 JavaScript 与 Kotlin 的 `Long` 进行交互。结果是，您无法将使用 `Long` 类型的 Kotlin 代码导出到 JavaScript。此问题影响了所有使用 `Long` 的代码，例如函数形参、类属性或构造函数。

现在，Kotlin 的 `Long` 类型可以编译为 JavaScript 的 `BigInt` 类型，Kotlin/JS 支持将 `Long` 值导出到 JavaScript，简化了 Kotlin 和 JavaScript 代码之间的互操作性。

要启用此特性：

1.  通过将以下编译器选项添加到 `build.gradle(.kts)` 文件中的 `freeCompilerArgs` 属性，允许在 Kotlin/JS 中导出 `Long`：

    ```kotlin
    kotlin {
        js {
            ...
            compilerOptions {
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2.  启用 `BigInt` 类型。请参见[使用 `BigInt` 类型表示 Kotlin 的 `Long` 类型](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type)中如何启用它。

### 用于清理实参的新 DSL 函数

使用 Node.js 运行 Kotlin/JS 应用程序时，传递给您程序的实参 (`args`) 过去包含：

*   可执行文件 `Node` 的路径。
*   您脚本的路径。
*   您提供的实际命令行实参。

然而，`args` 的预期行为是只包含命令行实参。要实现这一点，您必须在 `build.gradle(.kts)` 文件中或在 Kotlin 代码中手动使用 `drop()` 函数跳过前两个实参：

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

此临时解决方案重复、容易出错，并且在平台之间共享代码时效果不佳。

为了解决此问题，Kotlin 2.2.20 引入了一个名为 `passCliArgumentsToMainFunction()` 的新 DSL 函数。

使用此函数，只包含命令行实参，而 `Node` 和脚本路径被排除：

```kotlin
fun main(args: Array<String>) {
    // 无需 drop()，并且只包含您的自定义实参
    println(args.joinToString(", "))
}
```

此更改减少了样板代码，防止了因手动丢弃实参而导致的错误，并改进了跨平台兼容性。

要启用此特性，请在您的 `build.gradle(.kts)` 文件中添加以下 DSL 函数：

```kotlin
kotlin {
    js {
        nodejs {
            passCliArgumentsToMainFunction()
        }
    }
}
```

## Gradle

Kotlin 2.2.20 在 Gradle 构建报告中为 Kotlin/Native 任务添加了新的编译器性能指标，并改进了增量编译的体验。

### Kotlin/Native 任务构建报告中的新编译器性能指标

在 Kotlin 1.7.0 中，我们引入了[构建报告](gradle-compilation-and-caches.md#build-reports)来帮助跟踪编译器性能。从那时起，我们添加了更多指标，使这些报告更加详细和有用，有助于调查性能问题。

在 Kotlin 2.2.20 中，构建报告现在包含 Kotlin/Native 任务的编译器性能指标。

要了解有关构建报告以及如何配置它们的更多信息，请参见[启用构建报告](gradle-compilation-and-caches.md#enabling-build-reports)。

### 预览改进的 Kotlin/JVM 增量编译
<primary-label ref="experimental-general"/>

Kotlin 2.0.0 引入了带有优化的前端的新 K2 编译器。Kotlin 2.2.20 在此基础上，通过使用新的前端改进 Kotlin/JVM 在某些复杂增量编译场景中的性能。

在稳定此行为之前，这些改进默认是禁用的。要启用它们，请在您的 `gradle.properties` 文件中添加以下属性：

```none
kotlin.incremental.jvm.fir=true
```

目前，[`kapt` 编译器插件](kapt.md)与此新行为不兼容。我们正在努力在未来的 Kotlin 版本中添加支持。

我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-72822) 中对此特性提供反馈。

### 增量编译检测内联函数 lambda 表达式中的更改

在 Kotlin 2.2.20 之前，如果您启用增量编译并更改了内联函数中 lambda 表达式内部的逻辑，编译器不会重新编译该内联函数在其他模块中的调用点。结果是，那些调用点使用了 lambda 表达式的先前版本，这可能导致意外行为。

在 Kotlin 2.2.20 中，编译器现在可以检测内联函数中 lambda 表达式的更改，并自动重新编译它们的调用点。

### 库发布的改进

Kotlin 2.2.20 添加了新的 Gradle 任务，使库发布更加容易。这些任务可帮助您生成密钥对、上传公钥，并运行本地检测以确保验证过程成功，然后再上传到 Maven Central 版本库。

有关如何将这些任务作为发布过程的一部分使用的更多信息，请参见[将您的库发布到 Maven Central](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-libraries.html)。

#### 用于生成和上传 PGP 密钥的新 Gradle 任务

在 Kotlin 2.2.20 之前，如果您想将多平台库发布到 Maven Central 版本库，您必须安装第三方程序（例如 `gpg`）来生成密钥对以签署您的发布项。现在，Kotlin Gradle 插件附带了 Gradle 任务，可让您生成密钥对并上传公钥，这样您就不必安装其他程序。

##### 生成密钥对

`generatePgpKeys` 任务会生成密钥对。运行它时，您必须提供私有密钥库的密码和您的姓名，格式如下：

```bash
./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
```

该任务将密钥对存储在 `build/pgp` 目录中。

> 将您的密钥对移动到安全位置，以防止意外删除或未经授权的访问。
>
{style="warning"}

##### 上传公钥

`uploadPublicPgpKey` 任务将公钥上传到 Ubuntu 的密钥服务器：`keyserver.ubuntu.com`。运行它时，请提供 `.asc` 格式公钥的路径：

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

#### 用于本地测试验证的新 Gradle 任务

Kotlin 2.2.20 还添加了 Gradle 任务，用于在将您的库上传到 Maven Central 版本库之前进行本地测试验证。

如果您将 Kotlin Gradle 插件与 Gradle 的 [Signing Plugin](https://docs.gradle.org/current/userguide/signing_plugin.html) 和 [Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html) 一起使用，您可以运行 `checkSigningConfiguration` 和 `checkPomFileFor<PUBLICATION_NAME>Publication` 任务来验证您的设置是否符合 Maven Central 的要求。将 `<PUBLICATION_NAME>` 替换为您的发布项的名称。

这些任务不会作为 `build` 或 `check` Gradle 任务的一部分自动运行，因此您需要手动运行它们。例如，如果您有一个 `KotlinMultiplatform` 发布项：

```bash
./gradlew checkSigningConfiguration checkPomFileForKotlinMultiplatformPublication
```

`checkSigningConfiguration` 任务检测以下内容：

*   Signing Plugin 已配置密钥。
*   已配置的公钥已上传到 `keyserver.ubuntu.com` 或 `keys.openpgp.org` 密钥服务器。
*   所有发布项都启用了签名。

如果任何这些检测失败，任务将返回一个错误，并提供有关如何修复该问题的信息。

`checkPomFileFor<PUBLICATION_NAME>Publication` 任务检测 `pom.xml` 文件是否符合 Maven Central 的[要求](https://central.sonatype.org/publish/requirements/#required-pom-metadata)。如果不符合，任务将返回一个错误，其中包含 `pom.xml` 文件中哪些部分不合规的详细信息。

## Maven：`kotlin-maven-plugin` 中对 Kotlin 守护进程的支持

Kotlin 2.2.20 通过在 `kotlin-maven-plugin` 中添加对 [Kotlin 守护进程](kotlin-daemon.md)的支持，进一步推动了 [Kotlin 2.2.0 中引入的实验性构建工具 API](whatsnew22.md#new-experimental-build-tools-api)。使用 Kotlin 守护进程时，Kotlin 编译器在单独的隔离进程中运行，这可以防止其他 Maven 插件覆盖系统属性。您可以在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path)中看到一个示例。

从 Kotlin 2.2.20 开始，Kotlin 守护进程默认使用。如果您想恢复到之前的行为，请通过将 `pom.xml` 文件中的以下属性设置为 `false` 来选择退出：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin 2.2.20 还引入了一个新的 `jvmArgs` 属性，您可以使用它来自定义 Kotlin 守护进程的默认 JVM 实参。例如，要覆盖 `-Xmx` 和 `-Xms` 选项，请将以下内容添加到您的 `pom.xml` 文件中：

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## Kotlin 编译器选项的新通用 Schema

Kotlin 2.2.20 引入了所有编译器选项的通用 Schema，发布在 [`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description) 下。此构件包括所有编译器选项的代码表示和 JSON 等效形式（适用于非 JVM 消费者）、其描述以及元数据，例如每个选项被引入或稳定的版本。您可以使用此 Schema 生成自定义视图或根据需要分析它们。

## 标准库

此版本在标准库中引入了新的实验性特性：Kotlin/JS 中通过反射识别接口类型的支持、公共原子类型的更新函数，以及用于数组大小调整的 `copyOf()` 重载。

### Kotlin/JS 中通过反射识别接口类型的支持
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 将[实验性的](components-stability.md#stability-levels-explained) [`KClass.isInterface`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/is-interface.html) 属性添加到 Kotlin/JS 标准库。

通过此属性，您现在可以检测类引用是否表示 Kotlin 接口。这使 Kotlin/JS 更接近与 Kotlin/JVM 的对等，在 Kotlin/JVM 中您可以使用 `KClass.java.isInterface` 来检测类是否表示接口。

要选择启用，请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun inspect(klass: KClass<*>) {
    // 打印 true 表示接口
    println(klass.isInterface)
}
```

我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78581) 中提供反馈。

### 公共原子类型的新更新函数
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 引入了新的实验性函数，用于更新公共原子类型及其数组对应元素的元素。每个函数都使用其中一个更新函数原子地计算一个新值并替换当前值，返回值取决于您使用的函数：

*   [`update()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update.html) 和 [`updateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-at.html) 设置一个新值而不返回结果。
*   [`fetchAndUpdate()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update.html) 和 [`fetchAndUpdateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update-at.html) 设置一个新值并返回更改之前的旧值。
*   [`updateAndFetch()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch.html) 和 [`updateAndFetchAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch-at.html) 设置一个新值并返回更改之后的新值。

您可以使用这些函数来实现开箱即用不支持的原子转换，例如乘法或位操作。在此更改之前，递增公共原子类型并读取旧值需要使用 [`compareAndSet()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-atomic-int/compare-and-set.html) 函数进行循环。

与所有公共原子类型的 API 一样，这些函数是[实验性的](components-stability.md#stability-levels-explained)。要选择启用，请使用 `@OptIn(ExperimentalAtomicApi::class)` 注解。

这是一个执行不同类型更新并返回旧值或新值的代码示例：

```kotlin
import kotlin.concurrent.atomics.*
import kotlin.random.Random

@OptIn(ExperimentalAtomicApi::class)
fun main() {
    val counter = AtomicLong(Random.nextLong())
    val minSetBitsThreshold = 20

    // 设置一个新值而不使用结果
    counter.update { if (it < 0xDECAF) 0xCACA0 else 0xC0FFEE }

    // 检索当前值，然后更新它
    val previousValue = counter.fetchAndUpdate { 0x1CEDL.shl(Long.SIZE_BITS - it.countLeadingZeroBits()) or it }

    // 更新值，然后检索结果
    val current = counter.updateAndFetch {
        if (it.countOneBits() < minSetBitsThreshold) it.shl(20) or 0x15BADL else it
    }

    val hexFormat = HexFormat {
        upperCase = true
        number {
            removeLeadingZeros = true
        }
    }
    println("Previous value: ${previousValue.toHexString(hexFormat)}")
    println("Current value: ${current.toHexString(hexFormat)}")
    println("Expected status flag set: ${current and 0xBAD != 0xBADL}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.2.20"}

我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76389) 中提供反馈。

### 数组 `copyOf()` 重载的支持
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 引入了 [`copyOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/copy-of.html) 函数的实验性重载。它适用于泛型类型 `Array<T>` 的数组和所有原语数组类型。

您可以使用此函数来增大数组，并使用初始化器 lambda 表达式中的值填充新元素。这可以帮助您减少自定义样板代码，并解决了调整泛型 `Array<T>` 大小会产生可空结果 (`Array<T?>`) 的常见痛点。

这是一个例子：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val row1: Array<String> = arrayOf("one", "two")
    // 调整数组大小并使用 lambda 表达式填充新元素
    val row2: Array<String> = row1.copyOf(4) { "default" }
    println(row2.contentToString())
    // [one, two, default, default]
}
```

此 API 是[实验性的](components-stability.md#stability-levels-explained)。要选择启用，请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解。

我们非常感谢您在我们的[问题跟踪器](https://youtrack.jetbrains.com/issue/KT-70984)中提供反馈。

## Compose 编译器

在此版本中，Compose 编译器通过添加新的警告和改进构建指标的输出以使其更易于阅读，从而带来了体验改进。

### 默认形参的语言版本限制

在此版本中，如果指定用于编译的语言版本低于支持抽象或开放可组合函数中的默认形参所需的版本，Compose 编译器会报告错误。

Compose 编译器从 Kotlin 2.1.0 开始支持抽象函数中的默认形参，从 Kotlin 2.2.0 开始支持开放函数中的默认形参。当使用较新版本的 Compose 编译器同时面向旧版 Kotlin 语言版本时，库开发者应该注意，抽象或开放函数中的默认形参可能仍然出现在公共 API 中，即使语言版本不支持它们。

### K2 编译器的可组合目标警告

此版本添加了关于 [`@ComposableTarget`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/ComposableTarget) 不匹配的警告。

例如：

```text
@Composable fun App() {
  Box { // <-- `Box` 是 `@UiComposable`
    Path(...) // <-- `Path` 是 `@VectorComposable`
    ^^^^^^^^^
    warning: 在预期 UI 可组合函数的位置调用 Vector 可组合函数
  }
}
```
### 构建指标中的完全限定名称

构建指标中报告的类名和函数名现在是完全限定的，这使得区分不同包中同名声明变得更容易。

此外，构建指标不再包含默认形参中复杂表达式的转储，使其更易于阅读。

## 重大变更和弃用

本节重点介绍了值得注意的重大变更和弃用：

*   [`kapt` 编译器插件](kapt.md)现在默认使用 K2 编译器。结果，控制插件是否使用 K2 编译器的 `kapt.use.k2` 属性已被弃用。如果您将此属性设置为 `false` 以选择退出使用 K2 编译器，Gradle 会显示警告。

## 文档更新

Kotlin 文档收到了一些显著变化：

*   [Kotlin 路线图](roadmap.md) – 查看 Kotlin 在语言和生态系统演进方面的最新优先级列表。
*   [属性](properties.md) – 了解在 Kotlin 中使用属性的多种方式。
*   [条件和循环](control-flow.md) – 了解 Kotlin 中的条件和循环如何工作。
*   [Kotlin/JavaScript](js-overview.md) – 探索 Kotlin/JS 的用例。
*   [面向 Web](gradle-configure-project.md#targeting-the-web) – 了解 Gradle 为 Web 开发提供的不同目标平台。
*   [Kotlin 守护进程](kotlin-daemon.md) – 了解 Kotlin 守护进程以及它如何与构建系统和 Kotlin 编译器协同工作。
*   [协程概述页面](coroutines-overview.md) – 了解协程概念并开始您的学习之旅。
*   [Kotlin/Native 二进制选项](native-binary-options.md) – 了解 Kotlin/Native 的二进制选项以及如何配置它们。
*   [调试 Kotlin/Native](native-debugging.md) – 探索使用 Kotlin/Native 进行调试的不同方式。
*   [定制 LLVM 后端的技巧](native-llvm-passes.md) – 了解 Kotlin/Native 如何使用 LLVM 并调整优化遍数。
*   [Exposed 的 DAO API 入门](https://www.jetbrains.com/help/exposed/get-started-with-exposed-dao.html) – 了解如何使用 Exposed 的数据访问对象 (DAO) API 在关系数据库中存储和检索数据。
*   Exposed 文档中关于 R2DBC 的新页面：
    *   [使用数据库](https://www.jetbrains.com/help/exposed/working-with-database.html)
    *   [使用 ConnectionFactory](https://www.jetbrains.com/help/exposed/working-with-connectionfactory.html)
    *   [自定义类型映射](https://www.jetbrains.com/help/exposed/custom-type-mapping.html)
*   [HTMX 集成](https://ktor.io/docs/htmx-integration.html) – 了解 Ktor 如何为 HTMX 提供实验性的、一流的支持。

## 如何更新到 Kotlin 2.2.20

Kotlin 插件作为捆绑插件分发在 IntelliJ IDEA 和 Android Studio 中。

要更新到新的 Kotlin 版本，请在您的构建脚本中[更改 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)为 2.2.20。