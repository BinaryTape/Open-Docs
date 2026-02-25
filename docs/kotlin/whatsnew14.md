[//]: # (title: Kotlin 1.4.0 的最新变化)

<web-summary>阅读 Kotlin 1.4.0 发布说明，涵盖了新的语言功能、Kotlin Multiplatform、JVM、Native、JS 的更新，以及对 Gradle 和 Maven 的构建工具支持。</web-summary>

_[发布日期：2020 年 8 月 17 日](releases.md#release-history)_

在 Kotlin 1.4.0 中，我们对所有组件进行了多项改进，[重点关注质量和性能](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)。
以下是 Kotlin 1.4.0 中最重要变化的列表。

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## 语言功能与改进

Kotlin 1.4.0 带来了各种不同的语言功能和改进。包括：

* [Kotlin 接口的 SAM 转换](#sam-conversions-for-kotlin-interfaces)
* [面向库作者的显式 API 模式](#explicit-api-mode-for-library-authors)
* [混合使用具名实参与位置实参](#mixing-named-and-positional-arguments)
* [尾随逗号](#trailing-comma)
* [可调用引用改进](#callable-reference-improvements)
* [在循环包含的 when 中使用 break 和 continue](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin 接口的 SAM 转换

在 Kotlin 1.4.0 之前，只能在 [从 Kotlin 中使用 Java 方法和 Java 接口时](java-interop.md#sam-conversions) 应用 SAM（单一抽象方法）转换。从现在起，你也可以为 Kotlin 接口使用 SAM 转换。
为此，请使用 `fun` 修饰符将 Kotlin 接口明确标记为函数式接口。

当预期将只有一个抽象方法的接口作为参数，而你传递了一个 lambda 作为实参时，就会应用 SAM 转换。在这种情况下，编译器会自动将 lambda 转换为实现该抽象成员函数的类实例。

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() { 
    println("Is 7 even? - ${isEven.accept(7)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

[详细了解 Kotlin 函数式接口和 SAM 转换](fun-interfaces.md)。

### 面向库作者的显式 API 模式

Kotlin 编译器为库作者提供了“显式 API 模式”。在此模式下，编译器会执行额外检查，帮助使库的 API 更加清晰一致。它为暴露给库公共 API 的声明添加了以下要求：

* 如果默认可见性会将声明暴露给公共 API，则必须使用可见性修饰符。这有助于确保不会无意中将声明暴露给公共 API。
* 暴露给公共 API 的属性和函数必须有显式类型规范。这确保了 API 用户了解他们所使用的 API 成员的类型。

根据你的配置，这些显式 API 可能产生错误（`strict` 模式）或警告（`warning` 模式）。
为了可读性和常识，某些声明被排除在此类检查之外：

* 主构造函数
* 数据类的属性
* 属性的 getter 和 setter
* `override` 方法

显式 API 模式仅分析模块的产品源代码。

要以显式 API 模式编译模块，请在 Gradle 构建脚本中添加以下行：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {    
    // 用于 strict 模式
    explicitApi() 
    // 或者
    explicitApi = ExplicitApiMode.Strict
    
    // 用于 warning 模式
    explicitApiWarning()
    // 或者
    explicitApi = ExplicitApiMode.Warning
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {    
    // 用于 strict 模式
    explicitApi() 
    // 或者
    explicitApi = 'strict'
    
    // 用于 warning 模式
    explicitApiWarning()
    // 或者
    explicitApi = 'warning'
}
```

</tab>
</tabs>

使用命令行编译器时，通过添加 `-Xexplicit-api` 编译器选项并设置值为 `strict` 或 `warning` 来切换到显式 API 模式。

```bash
-Xexplicit-api={strict|warning}
```

[在 KEEP 中查找有关显式 API 模式的更多详细信息](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md)。

### 混合使用具名实参与位置实参

在 Kotlin 1.3 中，当你使用 [具名实参](functions.md#named-arguments) 调用函数时，必须将所有不带名称的参数（位置实参）放在第一个具名实参之前。例如，你可以调用 `f(1, y = 2)`，但不能调用 `f(x = 1, 2)`。

当所有实参都处于正确位置，但你只想在中间为一个实参指定名称时，这确实很令人烦恼。这对于明确布尔值或 `null` 值所属的属性特别有用。

在 Kotlin 1.4 中，这种限制不再存在——你现在可以在一组位置实参中间为某个实参指定名称。此外，只要它们保持正确的顺序，你可以随意混合使用位置实参和具名实参。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

// 在中间带有具名实参的函数调用
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 尾随逗号

在 Kotlin 1.4 中，你现在可以在枚举、实参和形参列表、`when` 条目以及析构声明的组件中添加尾随逗号。
有了尾随逗号，你可以添加新项并更改其顺序，而无需添加或删除逗号。

如果你为形参或值使用多行语法，这尤其有用。添加尾随逗号后，你可以轻松地交换包含形参或值的行。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', // 尾随逗号
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", // 尾随逗号
)
```

### 可调用引用改进

Kotlin 1.4 支持更多使用可调用引用的情况：

* 引用包含带默认值形参的函数
* 在返回 `Unit` 的函数中使用函数引用
* 根据函数中实参数量进行适配的引用
* 可调用引用上的挂起转换

#### 引用包含带默认值形参的函数

现在你可以使用指向包含带默认值形参的函数的可调用引用。如果对函数 `foo` 的可调用引用不接收实参，则使用默认值 `0`。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

以前，你必须为 `apply` 或 `foo` 函数编写额外的重载。

```kotlin
// 某些新重载
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### 在返回 Unit 的函数中使用函数引用

在 Kotlin 1.4 中，你可以在返回 `Unit` 的函数中使用指向返回任何类型的函数的可调用引用。
在 Kotlin 1.4 之前，在这种情况下只能使用 lambda 实参。现在你可以同时使用 lambda 实参和可调用引用。

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // 1.4 之前这是唯一的实现方式
    foo(::returnsInt) // 从 1.4 开始，这也可以工作
}
```

#### 根据函数中实参数量进行适配的引用

现在当你传递可变数量的实参 (`vararg`) 时，可以适配指向函数的可调用引用。
你可以在传递的实参列表末尾传递任意数量的相同类型的形参。

```kotlin
fun foo(x: Int, vararg y: String) {}

fun use0(f: (Int) -> Unit) {}
fun use1(f: (Int, String) -> Unit) {}
fun use2(f: (Int, String, String) -> Unit) {}

fun test() {
    use0(::foo) 
    use1(::foo) 
    use2(::foo) 
}
```

#### 可调用引用上的挂起转换

除了 lambda 上的挂起转换外，Kotlin 现在从 1.4.0 版本开始支持可调用引用上的挂起转换。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // 1.4 之前 OK
    takeSuspend(::call) // 在 Kotlin 1.4 中也可以工作
}
```

### 在循环包含的 when 表达式中使用 break 和 continue

在 Kotlin 1.3 中，不能在循环包含的 `when` 表达式中使用非限定的 `break` 和 `continue`。原因是这些关键字被保留用于 `when` 表达式中可能的 [贯穿（fall-through）行为](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)。

这就是为什么如果你想在循环的 `when` 表达式中使用 `break` 和 `continue`，你必须给它们加 [标签](returns.md#break-and-continue-labels)，这变得相当繁琐。

```kotlin
fun test(xs: List<Int>) {
    LOOP@for (x in xs) {
        when (x) {
            2 -> continue@LOOP
            17 -> break@LOOP
            else -> println(x)
        }
    }
}
```

在 Kotlin 1.4 中，你可以在循环包含的 `when` 表达式中使用不带标签的 `break` 和 `continue`。它们的行为符合预期，即终止最近的封闭循环或进入其下一步。

```kotlin
fun test(xs: List<Int>) {
    for (x in xs) {
        when (x) {
            2 -> continue
            17 -> break
            else -> println(x)
        }
    }
}
```

`when` 内部的贯穿行为还有待进一步设计。

## IDE 中的新工具

通过 Kotlin 1.4，你可以使用 IntelliJ IDEA 中的新工具来简化 Kotlin 开发：

* [新型灵活的项目向导](#new-flexible-project-wizard)
* [协程调试器](#coroutine-debugger)

### 新型灵活的项目向导

通过灵活的新型 Kotlin 项目向导，你可以轻松创建和配置不同类型的 Kotlin 项目，包括多平台项目，这类项目在没有图形界面的情况下可能难以配置。

![Kotlin 项目向导 – 多平台项目](multiplatform-project-1-wn.png)

新的 Kotlin 项目向导既简单又灵活：

1. *选择项目模板*，具体取决于你要做什么。将来会添加更多模板。
2. *选择构建系统* – Gradle（Kotlin 或 Groovy DSL）、Maven 或 IntelliJ IDEA。
    Kotlin 项目向导将仅显示所选项目模板支持的构建系统。
3. 直接在主屏幕上 *预览项目结构*。

然后你可以完成项目创建，或者（可选地）在下一个屏幕上 *配置项目*：

4. *添加/移除* 该项目模板支持的 *模块和目标*。
5. *配置模块和目标设置*，例如目标 JVM 版本、目标模板和测试框架。

![Kotlin 项目向导 - 配置目标](multiplatform-project-2-wn.png)

将来，我们将通过添加更多配置选项和模板，使 Kotlin 项目向导变得更加灵活。

你可以通过完成这些教程来试用新的 Kotlin 项目向导：

* [创建一个基于 Kotlin/JVM 的控制台应用程序](jvm-get-started.md)
* [为 React 创建一个 Kotlin/JS 应用程序](js-react.md)
* [创建一个 Kotlin/Native 应用程序](native-get-started.md)

### 协程调试器

许多人已经使用 [协程](coroutines-guide.md) 进行异步编程。
但在调试方面，在 Kotlin 1.4 之前处理协程可能非常痛苦。由于协程在线程之间跳转，很难理解特定协程正在做什么并检查其上下文。在某些情况下，跨断点跟踪步骤根本不起作用。结果，你不得不依靠日志记录或脑力来调试使用协程的代码。

在 Kotlin 1.4 中，使用 Kotlin 插件随附的新功能，调试协程现在变得更加方便。

> 调试功能适用于 1.3.8 或更高版本的 `kotlinx-coroutines-core`。
>
{style="note"}

**Debug 工具窗口**现在包含一个新的 **Coroutines** 选项卡。在此选项卡中，你可以找到有关当前正在运行和已挂起的协程的信息。协程按它们运行所在的调度器进行分组。

![调试协程](coroutine-debugger-wn.png)

现在你可以：
* 轻松检查每个协程的状态。
* 查看正在运行和已挂起的协程的局部变量和捕获变量的值。
* 查看完整的协程创建堆栈，以及协程内部的调用堆栈。堆栈包含所有带有变量值的帧，甚至是那些在标准调试期间会丢失的帧。

如果你需要包含每个协程状态及其堆栈的完整报告，请在 **Coroutines** 选项卡内右键点击，然后点击 **Get Coroutines Dump**。目前，协程转储相当简单，但我们打算在未来的 Kotlin 版本中使其更具可读性和实用性。

![协程转储](coroutines-dump-wn.png)

在 [这篇博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/) 和 [IntelliJ IDEA 文档](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html) 中了解有关调试协程的更多信息。

## 新编译器

新的 Kotlin 编译器将会非常快；它将统一所有支持的平台，并为编译器扩展提供 API。这是一个长期项目，我们已经在 Kotlin 1.4.0 中完成了几个步骤：

* 默认启用 [新的更强大的类型推断算法](#new-more-powerful-type-inference-algorithm)。
* [新的 JVM 和 JS IR 后端](#unified-backends-and-extensibility)。一旦稳定，它们将成为默认后端。

### 新的更强大的类型推断算法

Kotlin 1.4 使用了新的、更强大的类型推断算法。这种新算法在 Kotlin 1.3 中已经可以通过指定编译器选项来试用，现在它已被默认使用。你可以在 [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20) 中找到新算法修复的问题完整列表。以下是一些最显著的改进：

* [更多自动推断类型的情况](#more-cases-where-type-is-inferred-automatically)
* [lambda 最后一次表达式的智能转换](#smart-casts-for-a-lambda-s-last-expression)
* [可调用引用的智能转换](#smart-casts-for-callable-references)
* [对委托属性更好的推断](#better-inference-for-delegated-properties)
* [带有不同实参的 Java 接口的 SAM 转换](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Kotlin 中的 Java SAM 接口](#java-sam-interfaces-in-kotlin)

#### 更多自动推断类型的情况

新推断算法可以为许多旧算法要求你显式指定类型的情况推断类型。
例如，在以下示例中，lambda 形参 `it` 的类型被正确推断为 `String?`：

```kotlin
//sampleStart
val rulesMap: Map<String, (String?) -> Boolean> = mapOf(
    "weak" to { it != null },
    "medium" to { !it.isNullOrBlank() },
    "strong" to { it != null && "^[a-zA-Z0-9]+$".toRegex().matches(it) }
)
//sampleEnd

fun main() {
    println(rulesMap.getValue("weak")("abc!"))
    println(rulesMap.getValue("strong")("abc"))
    println(rulesMap.getValue("strong")("abc!"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

在 Kotlin 1.3 中，你需要引入显式 lambda 形参或将 `to` 替换为具有显式泛型实参的 `Pair` 构造函数才能使其正常工作。

#### lambda 最后一次表达式的智能转换

在 Kotlin 1.3 中，除非指定了预期类型，否则 lambda 内部的最后一次表达式不会进行智能转换。因此，在以下示例中，Kotlin 1.3 将 `String?` 推断为 `result` 变量的类型：

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // Kotlin 编译器知道此处 str 不为 null
}
// 'result' 的类型在 Kotlin 1.3 中为 String?，在 Kotlin 1.4 中为 String
```

在 Kotlin 1.4 中，由于采用了新的推断算法，lambda 内部的最后一次表达式会获得智能转换，并且这种新的、更精确的类型被用于推断结果 lambda 类型。因此，`result` 变量的类型变为 `String`。

在 Kotlin 1.3 中，你经常需要添加显式转换（使用 `!!` 或类似 `as String` 的类型转换）来使此类情况正常工作，现在这些转换已变得不再必要。

#### 可调用引用的智能转换

在 Kotlin 1.3 中，你无法访问智能转换类型的成员引用。现在在 Kotlin 1.4 中你可以这样做：

```kotlin
import kotlin.reflect.KFunction

sealed class Animal
class Cat : Animal() {
    fun meow() {
        println("meow")
    }
}

class Dog : Animal() {
    fun woof() {
        println("woof")
    }
}

//sampleStart
fun perform(animal: Animal) {
    val kFunction: KFunction<*> = when (animal) {
        is Cat -> animal::meow
        is Dog -> animal::woof
    }
    kFunction.call()
}
//sampleEnd

fun main() {
    perform(Cat())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

在 animal 变量被智能转换为特定类型 `Cat` 和 `Dog` 后，你可以使用不同的成员引用 `animal::meow` 和 `animal::woof`。经过类型检查后，你可以访问对应于子类型的成员引用。

#### 对委托属性更好的推断

在分析跟随在 `by` 关键字后的委托表达式时，以前没有考虑委托属性的类型。例如，以下代码以前无法编译，但现在编译器可以正确地将 `old` 和 `new` 形参的类型推断为 `String?`：

```kotlin
import kotlin.properties.Delegates

fun main() {
    var prop: String? by Delegates.observable(null) { p, old, new ->
        println("$old → $new")
    }
    prop = "abc"
    prop = "xyz"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

#### 带有不同实参的 Java 接口的 SAM 转换

Kotlin 从一开始就支持 Java 接口的 SAM 转换，但有一种情况以前不受支持，这在处理现有 Java 库时有时很令人烦恼。如果你调用一个接收两个 SAM 接口作为参数的 Java 方法，那么两个实参都必须是 lambda 或都是常规对象。你不能将一个实参作为 lambda 传递，而将另一个作为对象传递。

新算法修复了这个问题，你可以在任何情况下传递 lambda 代替 SAM 接口，这正是你自然期望的工作方式。

```java
// 文件: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// 文件: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // 在 Kotlin 1.4 中有效
}
```

#### Kotlin 中的 Java SAM 接口

在 Kotlin 1.4 中，你可以在 Kotlin 中使用 Java SAM 接口并对其应用 SAM 转换。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

在 Kotlin 1.3 中，你必须在 Java 代码中声明上述函数 `foo` 才能执行 SAM 转换。

### 统一的后端与可扩展性

在 Kotlin 中，我们有三个生成可执行文件的后端：Kotlin/JVM、Kotlin/JS 和 Kotlin/Native。Kotlin/JVM 和 Kotlin/JS 的共享代码不多，因为它们是独立开发的。Kotlin/Native 基于围绕 Kotlin 代码中间表示 (IR) 构建的新基础架构。

我们现在正在将 Kotlin/JVM 和 Kotlin/JS 迁移到相同的 IR。因此，所有三个后端都共享大量的逻辑，并拥有统一的流水线。这使我们能够为所有平台仅实现一次大多数功能、优化和错误修复。新的基于 IR 的后端目前处于 [Alpha](components-stability.md) 阶段。

通用的后端基础架构也为多平台编译器扩展打开了大门。你将能够接入流水线并添加自定义处理和转换，这些处理和转换将自动适用于所有平台。

我们鼓励你使用我们新的 [JVM IR](#new-jvm-ir-backend) 和 [JS IR](#new-js-ir-backend) 后端（目前处于 Alpha 阶段），并与我们分享你的反馈。

## Kotlin/JVM

Kotlin 1.4.0 包含许多 JVM 特定的改进，例如：

* [新的 JVM IR 后端](#new-jvm-ir-backend)
* [生成接口默认方法的新模式](#new-modes-for-generating-default-methods)
* [针对 null 检查的统一异常类型](#unified-exception-type-for-null-checks)
* [JVM 字节码中的类型注解](#type-annotations-in-the-jvm-bytecode)

### 新的 JVM IR 后端

与 Kotlin/JS 一起，我们正在将 Kotlin/JVM 迁移到 [统一的 IR 后端](#unified-backends-and-extensibility)，这使我们能够为所有平台一次性实现大多数功能和错误修复。你也将能够通过创建适用于所有平台的多平台扩展从中受益。

Kotlin 1.4.0 尚未为此类扩展提供公共 API，但我们正在与合作伙伴（包括 [Jetpack Compose](https://developer.android.com/jetpack/compose)）密切合作，他们已经在使用我们的新后端构建其编译器插件。

我们鼓励你尝试新的 Kotlin/JVM 后端（目前处于 Alpha 阶段），并将任何问题和功能请求提交到我们的 [问题跟踪器](https://youtrack.jetbrains.com/issues/KT)。
这将有助于我们统一编译器流水线，并更快地将像 Jetpack Compose 这样的编译器扩展带给 Kotlin 社区。

要启用新的 JVM IR 后端，请在 Gradle 构建脚本中指定额外的编译器选项：

```kotlin
kotlinOptions.useIR = true
```

> 如果你 [启用 Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en)，你将自动加入新的 JVM 后端，无需在 `kotlinOptions` 中指定编译器选项。
>
{style="note"}

使用命令行编译器时，添加编译器选项 `-Xuse-ir`。

> 你只能在启用了新后端的情况下使用由新 JVM IR 后端编译的代码。否则，你将收到错误。
> 考虑到这一点，我们不建议库作者在生产环境中切换到新后端。
>
{style="note"}

### 生成默认方法的新模式

在将 Kotlin 代码编译为 JVM 1.8 及以上目标时，你可以将 Kotlin 接口的非抽象方法编译为 Java 的 `default` 方法。为此，曾有一种机制包含用于标记此类方法的 `@JvmDefault` 注解，以及用于启用此注解处理的 `-Xjvm-default` 编译器选项。

在 1.4.0 中，我们添加了一种生成默认方法的新模式：`-Xjvm-default=all` 将 Kotlin 接口的 *所有* 非抽象方法编译为 `default` Java 方法。为了与使用编译时不带 `default` 的接口的代码兼容，我们还添加了 `all-compatibility` 模式。

有关 Java 互操作中默认方法的更多信息，请参阅 [互操作性文档](java-to-kotlin-interop.md#default-methods-in-interfaces) 和 [这篇博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 针对 null 检查的统一异常类型

从 Kotlin 1.4.0 开始，所有运行时 null 检查都将抛出 `java.lang.NullPointerException`，而不是 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`。这适用于：`!!` 运算符、方法前导部分中的形参 null 检查、平台类型表达式的 null 检查以及带有非空类型的 `as` 运算符。
这不适用于 `lateinit` null 检查和显式库函数调用（如 `checkNotNull` 或 `requireNotNull`）。

这一变化增加了 Kotlin 编译器或各种字节码处理工具（如 Android [R8 优化器](https://developer.android.com/studio/build/shrink-code)）可以执行的潜在 null 检查优化的数量。

请注意，从开发者的角度来看，情况不会发生太大变化：Kotlin 代码将抛出与以前具有相同错误消息的异常。异常类型发生了变化，但传递的信息保持不变。

### JVM 字节码中的类型注解

Kotlin 现在可以在 JVM 字节码（目标版本 1.8+）中生成类型注解，以便它们在运行时通过 Java 反射可用。
要在字节码中发射类型注解，请按照以下步骤操作：

1. 确保你声明的注解具有正确的注解目标（Java 的 `ElementType.TYPE_USE` 或 Kotlin 的 `AnnotationTarget.TYPE`）和保留策略（`AnnotationRetention.RUNTIME`）。
2. 将注解类声明编译为 JVM 字节码目标版本 1.8+。你可以使用 `-jvm-target=1.8` 编译器选项指定。
3. 将使用该注解的代码编译为 JVM 字节码目标版本 1.8+ (`-jvm-target=1.8`)，并添加 `-Xemit-jvm-type-annotations` 编译器选项。

请注意，来自标准库的类型注解目前不会在字节码中发射，因为标准库是使用目标版本 1.6 编译的。

到目前为止，仅支持基本情况：

- 方法形参、方法返回值类型和属性类型上的类型注解；
- 类型实参的不变投影，例如 `Smth<@Ann Foo>`, `Array<@Ann Foo>`。

在以下示例中，`String` 类型上的 `@Foo` 注解可以发射到字节码中，然后供库代码使用：

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

在 JS 平台上，Kotlin 1.4.0 提供了以下改进：

- [新的 Gradle DSL](#new-gradle-dsl)
- [新的 JS IR 后端](#new-js-ir-backend)

### 新的 Gradle DSL

`kotlin.js` Gradle 插件附带了调整后的 Gradle DSL，它提供了许多新的配置选项，并与 `kotlin-multiplatform` 插件使用的 DSL 更加一致。一些影响最大的变化包括：

- 通过 `binaries.executable()` 显式切换可执行文件的创建。在此处阅读有关 [执行 Kotlin/JS 及其环境](js-project-setup.md#execution-environments) 的更多信息。
- 通过 `cssSupport` 从 Gradle 配置内配置 webpack 的 CSS 和样式加载器。在此处阅读有关 [使用 CSS 和样式加载器](js-project-setup.md#css) 的更多信息。
- 改进了对 npm 依赖项的管理，使用强制版本号或 [semver](https://docs.npmjs.com/about-semantic-versioning) 版本范围，并支持使用 `devNpm`、`optionalNpm` 和 `peerNpm` 管理 _development_、_peer_ 和 _optional_ npm 依赖项。[在此处阅读有关直接从 Gradle 管理 npm 软件包依赖项的更多信息](js-project-setup.md#npm-dependencies)。
- 对 [Dukat](https://github.com/Kotlin/dukat)（Kotlin 外部声明生成器）的更强集成。外部声明现在可以在构建时生成，或者可以通过 Gradle 任务手动生成。

### 新的 JS IR 后端

[用于 Kotlin/JS 的 IR 后端](js-ir-compiler.md) 目前具有 [Alpha](components-stability.md) 稳定性，它提供了一些特定于 Kotlin/JS 目标的新功能，主要集中在通过死代码消除减小生成的代码大小，以及改进与 JavaScript 和 TypeScript 的互操作等。

要启用 Kotlin/JS IR 后端，请在你的 `gradle.properties` 中设置键 `kotlin.js.compiler=ir`，或者将 `IR` 编译器类型传递给 Gradle 构建脚本的 `js` 函数：

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // 或者: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

有关如何配置新后端的更多详细信息，请查看 [Kotlin/JS IR 编译器文档](js-ir-compiler.md)。

借助新的 [@JsExport](js-to-kotlin-interop.md#jsexport-annotation) 注解以及从 **[Kotlin 代码生成 TypeScript 定义](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)** 的能力，Kotlin/JS IR 编译器后端改进了 JavaScript 和 TypeScript 的互操作性。这也使得将 Kotlin/JS 代码与现有工具集成、创建 **混合应用程序** 以及在多平台项目中使用代码共享功能变得更加容易。

[详细了解 Kotlin/JS IR 编译器后端中的可用功能](js-ir-compiler.md)。

## Kotlin/Native

在 1.4.0 中，Kotlin/Native 获得了大量新功能和改进，包括：

* [支持 Swift 和 Objective-C 中的挂起函数](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [默认支持 Objective-C 泛型](#objective-c-generics-support-by-default)
* [Objective-C/Swift 互操作中的异常处理](#exception-handling-in-objective-c-swift-interop)
* [Apple 目标上默认生成发行版 .dSYMs](#generate-release-dsyms-on-apple-targets-by-default)
* [性能改进](#performance-improvements)
* [简化的 CocoaPods 依赖项管理](#simplified-management-of-cocoapods-dependencies)

### 支持 Swift 和 Objective-C 中的 Kotlin 挂起函数

在 1.4.0 中，我们添加了对 Swift 和 Objective-C 中挂起函数的基本支持。现在，当你将 Kotlin 模块编译为 Apple 框架时，挂起函数在其中作为带有回调的函数（Swift/Objective-C 术语中的 `completionHandler`）可用。当你在生成的框架头文件中有此类函数时，你可以从 Swift 或 Objective-C 代码中调用它们，甚至重写它们。

例如，如果你编写这个 Kotlin 函数：

```kotlin
suspend fun queryData(id: Int): String = ...
```

...那么你可以像这样从 Swift 调用它：

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[详细了解在 Swift 和 Objective-C 中使用挂起函数](native-objc-interop.md)。

### 默认支持 Objective-C 泛型

以前版本的 Kotlin 为 Objective-C 互操作中的泛型提供了实验性支持。自 1.4.0 起，Kotlin/Native 默认从 Kotlin 代码生成带有泛型的 Apple 框架。在某些情况下，这可能会破坏调用 Kotlin 框架的现有 Objective-C 或 Swift 代码。要让框架头文件不带泛型编写，请添加 `-Xno-objc-generics` 编译器选项。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

请注意，[Objective-C 互操作性文档](native-objc-interop.md#generics) 中列出的所有具体细节和限制仍然有效。

### Objective-C/Swift 互操作中的异常处理

在 1.4.0 中，我们稍微更改了从 Kotlin 生成的 Swift API 中关于异常翻译的方式。Kotlin 和 Swift 之间的错误处理存在根本差异。所有 Kotlin 异常都是非受检的，而 Swift 只有受检错误。因此，为了让 Swift 代码感知到预期的异常，Kotlin 函数应该标记有 `@Throws` 注解，指定潜在异常类的列表。

在编译为 Swift 或 Objective-C 框架时，具有或继承了 `@Throws` 注解的函数在 Objective-C 中表示为产生 `NSError*` 的方法，在 Swift 中表示为 `throws` 方法。

以前，除了 `RuntimeException` 和 `Error` 之外的任何异常都会被传播为 `NSError`。现在这种行为发生了变化：现在仅针对作为 `@Throws` 注解参数指定的类（或其子类）实例的异常抛出 `NSError`。到达 Swift/Objective-C 的其他 Kotlin 异常被视为未处理，并导致程序终止。

### Apple 目标上默认生成发行版 .dSYMs

从 1.4.0 开始，Kotlin/Native 编译器默认在 Darwin 平台上为发行版二进制文件生成 [调试符号文件](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information) (`.dSYM`)。这可以使用 `-Xadd-light-debug=disable` 编译器选项禁用。在其他平台上，此选项默认禁用。要在 Gradle 中切换此选项，请使用：

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[详细了解崩溃报告符号化](native-debugging.md#debug-ios-applications)。

### 性能改进

Kotlin/Native 进行了多项性能改进，加快了开发过程和执行速度。
以下是一些示例：

- 为了提高对象分配的速度，我们现在提供 [mimalloc](https://github.com/microsoft/mimalloc) 内存分配器作为系统分配器的替代方案。mimalloc 在某些基准测试中快达两倍。目前，在 Kotlin/Native 中使用 mimalloc 是实验性的；你可以使用 `-Xallocator=mimalloc` 编译器选项切换到它。

- 我们重新设计了 C 互操作库的构建方式。使用新工具，Kotlin/Native 生成互操作库的速度比以前快 4 倍，且构件大小仅为原来的 25% 到 30%。

- 由于 GC 的优化，整体运行时性能有所提高。这种改进在具有大量长期存活对象的项目中尤为明显。`HashMap` 和 `HashSet` 集合现在通过避免冗余装箱运行得更快。

- 在 1.3.70 中，我们引入了两个用于提高 Kotlin/Native 编译性能的新功能：[缓存项目依赖项并从 Gradle 守护进程运行编译器](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。
从那时起，我们设法修复了许多问题并提高了这些功能的整体稳定性。

### 简化的 CocoaPods 依赖项管理

以前，一旦你将项目与依赖项管理器 CocoaPods 集成，你就只能在 Xcode 中构建项目的 iOS、macOS、watchOS 或 tvOS 部分，而与多平台项目的其他部分分开。这些其他部分可以在 IntelliJ IDEA 中构建。

此外，每次添加存储在 CocoaPods 中的 Objective-C 库（Pod 库）依赖项时，你都必须从 IntelliJ IDEA 切换到 Xcode，调用 `pod install`，然后在那里运行 Xcode 构建。

现在你可以在 IntelliJ IDEA 中直接管理 Pod 依赖项，同时享受它在处理代码方面提供的便利，例如代码高亮和补全。你也可以使用 Gradle 构建整个 Kotlin 项目，而不必切换到 Xcode。这意味着你只有在需要编写 Swift/Objective-C 代码或在模拟器或设备上运行应用程序时才需要前往 Xcode。

现在你还可以处理存储在本地的 Pod 库。

根据你的需要，你可以在以下各项之间添加依赖项：
* 一个 Kotlin 项目与远程存储在 CocoaPods 仓库或本地存储在你机器上的 Pod 库。
* 一个 Kotlin Pod（作为 CocoaPods 依赖项使用的 Kotlin 项目）与具有一个或多个目标的 Xcode 项目。

完成初始配置后，当你向 `cocoapods` 添加新依赖项时，只需在 IntelliJ IDEA 中重新导入项目即可。新依赖项将自动添加。无需额外步骤。

[了解如何添加依赖项](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)。

## Kotlin Multiplatform

> 对多平台项目的支持处于 [Alpha](components-stability.md) 阶段。它将来可能会发生不兼容的变化，并需要手动迁移。
> 我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上对其提供的反馈。
>
{style="warning"}

[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 减少了为 [不同平台](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets) 编写和维护相同代码所花费的时间，同时保留了原生编程的灵活性和优势。我们继续在多平台功能和改进方面投入精力：

* [通过分层项目结构在多个目标中共享代码](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
* [在分层结构中利用原生库](#leveraging-native-libs-in-the-hierarchical-structure)
* [仅指定一次 kotlinx 依赖项](#specifying-dependencies-only-once)

> 多平台项目需要 Gradle 6.0 或更高版本。
>
{style="note"}

### 通过分层项目结构在多个目标中共享代码

借助新的分层项目结构支持，你可以在 [多平台项目](https://kotlinlang.org/docs/multiplatform/multiplatform-discover-project.html) 中的 [多个平台](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets) 之间共享代码。

以前，添加到多平台项目的任何代码要么放在特定于平台的源集中（仅限一个目标且不能被任何其他平台复用），要么放在公共源集中（如 `commonMain` 或 `commonTest`，在项目中的所有平台之间共享）。在公共源集中，你只能通过使用 [需要特定于平台 `actual` 实现的 `expect` 声明](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) 来调用特定于平台的 API。

这使得 [在所有平台上共享代码](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-all-platforms) 变得容易，但 [仅在某些目标之间共享](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) 并不那么容易，尤其是那些可能复用大量通用逻辑和第三方 API 的相似目标。

例如，在一个典型的针对 iOS 的多平台项目中，有两个与 iOS 相关的目标：一个针对 iOS ARM64 设备，另一个针对 x64 模拟器。它们有各自的特定于平台的源集，但实际上，很少需要为设备和模拟器编写不同的代码，且它们的依赖项非常相似。因此，特定于 iOS 的代码可以在它们之间共享。

显然，在这种设置中，最好能有一个 *供两个 iOS 目标使用的共享源集*，其中的 Kotlin/Native 代码仍然可以直接调用 iOS 设备和模拟器共有的任何 API。

![为 iOS 目标共享的代码](iosmain-hierarchy.png){width=300}

现在你可以通过 [分层项目结构支持](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) 做到这一点，它会根据消费它们的源集的目标，自动推断并适配每个源集中可用的 API 和语言功能。

对于常见的目标组合，你可以使用目标快捷方式创建分层结构。
例如，使用 `ios()` 快捷方式创建上述两个 iOS 目标和共享源集：

```kotlin
kotlin {
    ios() // iOS 设备和模拟器目标；iosMain 和 iosTest 源集
}
```

对于其他目标组合，通过使用 `dependsOn` 关系连接源集来 [手动创建层次结构](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#manual-configuration)。

![分层结构](manual-hierarchical-structure.svg)

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin{
    sourceSets {
        val desktopMain by creating {
            dependsOn(commonMain)
        }
        val linuxX64Main by getting {
            dependsOn(desktopMain)
        }
        val mingwX64Main by getting {
            dependsOn(desktopMain)
        }
        val macosX64Main by getting {
            dependsOn(desktopMain)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        desktopMain {
            dependsOn(commonMain)
        }
        linuxX64Main {
            dependsOn(desktopMain)
        }
        mingwX64Main {
            dependsOn(desktopMain)
        }
        macosX64Main {
            dependsOn(desktopMain)
        }
    }
}

```

</tab>
</tabs>

由于采用了分层项目结构，库也可以为目标子集提供通用的 API。了解更多有关 [在库中共享代码](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-in-libraries) 的信息。

### 在分层结构中利用原生库

你可以在多个原生目标共享的源集中使用平台相关的库，如 Foundation、UIKit 和 POSIX。这可以帮助你共享更多原生代码，而不受特定平台依赖项的限制。

不需要额外步骤——一切都是自动完成的。IntelliJ IDEA 将帮助你检测可以在共享代码中使用的通用声明。

[详细了解平台相关库的使用](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。

### 仅指定一次依赖项

从现在起，不再需要在共享和使用它的特定于平台的源集中指定同一库的不同变体依赖项，而应仅在共享源集中指定一次依赖项。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

不要使用带有指定平台后缀（如 `-common`、`-native` 或类似后缀）的 kotlinx 库构件名称，因为它们已不再受支持。相反，请使用库的基础构件名称，在上述示例中为 `kotlinx-coroutines-core`。

但是，此更改目前不影响：
* `stdlib` 库——从 Kotlin 1.4.0 开始，[默认自动添加 stdlib 依赖项](#dependency-on-the-standard-library-added-by-default)。
* `kotlin.test` 库——你仍应使用 `test-common` 和 `test-annotations-common`。这些依赖项将在稍后解决。

如果你只需要针对特定平台的依赖项，你仍可以使用带有 `-jvm` 或 `-js` 等后缀的标准库和 kotlinx 库的平台特定变体，例如 `kotlinx-coroutines-core-jvm`。

[详细了解配置依赖项](gradle-configure-project.md#configure-dependencies)。

## Gradle 项目改进

除了特定于 [Kotlin Multiplatform](#kotlin-multiplatform)、[Kotlin/JVM](#kotlin-jvm)、[Kotlin/Native](#kotlin-native) 和 [Kotlin/JS](#kotlin-js) 的 Gradle 项目功能和改进外，还有几项更改适用于所有 Kotlin Gradle 项目：

* [现在默认添加标准库依赖项](#dependency-on-the-standard-library-added-by-default)
* [Kotlin 项目需要较新版本的 Gradle](#minimum-gradle-version-for-kotlin-projects)
* [在 IDE 中改进了对 Kotlin Gradle DSL 的支持](#improved-gradle-kts-support-in-the-ide)

### 默认添加标准库依赖项

你不再需要在任何 Kotlin Gradle 项目（包括多平台项目）中声明对 `stdlib` 库的依赖。该依赖项已默认添加。

自动添加的标准库将与 Kotlin Gradle 插件版本相同，因为它们具有相同的版本控制。

对于特定于平台的源集，使用库的相应平台特定变体，而将其余部分添加通用标准库。Kotlin Gradle 插件将根据你的 Gradle 构建脚本的 `kotlinOptions.jvmTarget` [编译器选项](gradle-compiler-options.md) 选择合适的 JVM 标准库。

[了解如何更改默认行为](gradle-configure-project.md#dependency-on-the-standard-library)。

### Kotlin 项目的最低 Gradle 版本

要享受 Kotlin 项目中的新功能，请将 Gradle 更新到 [最新版本](https://gradle.org/releases/)。多平台项目需要 Gradle 6.0 或更高版本，而其他 Kotlin 项目支持 Gradle 5.4 或更高版本。

### 在 IDE 中改进了对 *.gradle.kts 的支持

在 1.4.0 中，我们继续改进了 IDE 对 Gradle Kotlin DSL 脚本（`*.gradle.kts` 文件）的支持。以下是新版本带来的变化：

- *显式加载脚本配置* 以获得更好的性能。以前，你对构建脚本所做的更改会在后台自动加载。为了提高性能，我们在 1.4.0 中禁用了构建脚本配置的自动加载。现在 IDE 仅在你显式应用更改时才加载更改。

  在早于 6.0 的 Gradle 版本中，你需要通过点击编辑器中的 **Load Configuration** 来手动加载脚本配置。

  ![*.gradle.kts – 加载配置](gradle-kts-load-config.png)

  在 Gradle 6.0 及以上版本中，你可以通过点击 **Load Gradle Changes** 或通过重新导入 Gradle 项目来显式应用更改。

  我们在 IntelliJ IDEA 2020.1（配合 Gradle 6.0 及以上版本）中添加了另一个操作——**Load Script Configurations**，它可以在不更新整个项目的情况下加载对脚本配置的更改。这比重新导入整个项目花费的时间少得多。

  ![*.gradle.kts – 加载脚本更改与加载 Gradle 更改](gradle-kts.png)

  对于新创建的脚本，或者当你第一次使用新的 Kotlin 插件打开项目时，你也应该 **Load Script Configurations**。
  
  在 Gradle 6.0 及以上版本中，你现在可以一次性加载所有脚本，而以前的实现是逐个加载的。由于每个请求都需要执行 Gradle 配置阶段，对于大型 Gradle 项目，这可能会非常耗费资源。
  
  目前，此类加载仅限于 `build.gradle.kts` 和 `settings.gradle.kts` 文件（请为相关的 [问题](https://github.com/gradle/gradle/issues/12640) 投票）。
  要为 `init.gradle.kts` 或应用的 [脚本插件](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins) 启用高亮显示，请使用旧机制——将它们添加到独立脚本。这些脚本的配置将在你需要时单独加载。你也可以为此类脚本启用自动重载。
    
  ![*.gradle.kts – 添加到独立脚本](gradle-kts-standalone.png)
  
- *更好的错误报告*。以前你只能在单独的日志文件中看到来自 Gradle 守护进程的错误。现在 Gradle 守护进程会直接返回有关错误的所有信息，并将其显示在 Build 工具窗口中。这节省了你的时间和精力。

## 标准库

以下是 Kotlin 1.4.0 中标准库最显著变化的列表：

- [通用的异常处理 API](#common-exception-processing-api)
- [数组与集合的新函数](#new-functions-for-arrays-and-collections)
- [字符串操作函数](#functions-for-string-manipulations)
- [位操作](#bit-operations)
- [委托属性改进](#delegated-properties-improvements)
- [从 KType 转换为 Java Type](#converting-from-ktype-to-java-type)
- [Kotlin 反射的 Proguard 配置](#proguard-configurations-for-kotlin-reflection)
- [改进现有 API](#improving-the-existing-api)
- [stdlib 构件的 module-info 描述符](#module-info-descriptors-for-stdlib-artifacts)
- [弃用项](#deprecations)
- [排除已弃用的实验性协程](#exclusion-of-the-deprecated-experimental-coroutines)

### 通用的异常处理 API

以下 API 元素已移至通用库：

* `Throwable.stackTraceToString()` 扩展函数，返回该可抛出对象及其堆栈跟踪的详细描述；以及 `Throwable.printStackTrace()`，将该描述打印到标准错误输出。
* `Throwable.addSuppressed()` 函数，允许你指定为了传递该异常而被抑制的异常；以及 `Throwable.suppressedExceptions` 属性，返回所有被抑制异常的列表。
* `@Throws` 注解，列出了在将函数编译为平台方法（在 JVM 或原生平台上）时将进行检查的异常类型。

### 数组与集合的新函数

#### 集合

在 1.4.0 中，标准库包含许多用于处理 **集合** 的有用函数：

* `setOfNotNull()`，创建一个由所提供实参中所有非空项组成的集合。

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* 序列的 `shuffled()`。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = (0 until 50).asSequence()
        val result = numbers.map { it * 2 }.shuffled().take(5)
        println(result.toList()) // 100 以下的五个随机偶数
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `onEach()` 和 `flatMap()` 的 `*Indexed()` 对应项。
它们应用于集合元素的操作将元素索引作为形参。

    ```kotlin
    fun main() {
    //sampleStart
        listOf("a", "b", "c", "d").onEachIndexed {
            index, item -> println(index.toString() + ":" + item)
        }
    
       val list = listOf("hello", "kot", "lin", "world")
              val kotlin = list.flatMapIndexed { index, item ->
                  if (index in 1..2) item.toList() else emptyList() 
              }
    //sampleEnd
              println(kotlin)
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `*OrNull()` 对应项 `randomOrNull()`、`reduceOrNull()` 和 `reduceIndexedOrNull()`。
它们在空集合上返回 `null`。

    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         // empty.reduce { a, b -> a + b } // Exception: Empty collection can't be reduced.
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `runningFold()`、其同义词 `scan()` 以及 `runningReduce()` 将给定操作顺序应用于集合元素，类似于 `fold()` 和 `reduce()`；区别在于这些新函数会返回中间结果的整个序列。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = mutableListOf(0, 1, 2, 3, 4, 5)
        val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
        val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
    //sampleEnd
        println(runningReduceSum.toString())
        println(runningFoldSum.toString())
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `sumOf()` 接收一个选择器函数并返回其对集合所有元素的值之和。
`sumOf()` 可以产生 `Int`、`Long`、`Double`、`UInt` 和 `ULong` 类型的总和。在 JVM 上，`BigInteger` 和 `BigDecimal` 也是可用的。

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
    
        val total = order.sumOf { it.price * it.count } // Double
        val count = order.sumOf { it.count } // Int
    //sampleEnd
        println("You've ordered $count items that cost $total in total")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `min()` 和 `max()` 函数已重命名为 `minOrNull()` 和 `maxOrNull()`，以符合 Kotlin 集合 API 中使用的命名约定。函数名中的 `*OrNull` 后缀意味着如果接收者集合为空，它将返回 `null`。同样的情况也适用于 `minBy()`、`maxBy()`、`minWith()`、`maxWith()`——在 1.4 中，它们都有 `*OrNull()` 同义词。
* 新的 `minOf()` 和 `maxOf()` 扩展函数返回集合项上给定选择器函数的最小值和最大值。

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
        val highestPrice = order.maxOf { it.price }
    //sampleEnd
        println("The most expensive item in the order costs $highestPrice")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

    还有 `minOfWith()` 和 `maxOfWith()`，它们接收一个 `Comparator` 作为实参，以及所有四个函数在空集合上返回 `null` 的 `*OrNull()` 版本。

* `flatMap` 和 `flatMapTo` 的新重载允许你使用返回类型与接收者类型不匹配的转换，即：
    * `Iterable`、`Array` 和 `Map` 到 `Sequence` 的转换
    * `Sequence` 到 `Iterable` 的转换

    ```kotlin
    fun main() {
    //sampleStart
        val list = listOf("kot", "lin")
        val lettersList = list.flatMap { it.asSequence() }
        val lettersSeq = list.asSequence().flatMap { it.toList() }    
    //sampleEnd
        println(lettersList)
        println(lettersSeq.toList())
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* 用于从可变列表中移除元素的 `removeFirst()` 和 `removeLast()` 快捷方式，以及这些函数的 `*orNull()` 对应项。

#### 数组

为了在处理不同容器类型时提供一致的体验，我们还为 **数组** 添加了新函数：

* `shuffle()` 将数组元素随机排序。
* `onEach()` 在每个数组元素上执行给定操作并返回数组本身。
* `associateWith()` 和 `associateWithTo()` 以数组元素作为键构建映射。
* 用于数组子范围的 `reverse()` 会反转该子范围内的元素顺序。
* 用于数组子范围的 `sortDescending()` 对子范围内的元素按降序排序。
* 用于数组子范围的 `sort()` 和 `sortWith()` 现在在通用库中可用。

```kotlin
fun main() {
//sampleStart
    var language = ""
    val letters = arrayOf("k", "o", "t", "l", "i", "n")
    val fileExt = letters.onEach { language += it }
       .filterNot { it in "aeuio" }.take(2)
       .joinToString(prefix = ".", separator = "")
    println(language) // "kotlin"
    println(fileExt) // ".kt"

    letters.shuffle()
    letters.reverse(0, 3)
    letters.sortDescending(2, 5)
    println(letters.contentToString()) // [k, o, t, l, i, n]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

此外，还有用于 `CharArray`/`ByteArray` 与 `String` 之间转换的新函数：
* `ByteArray.decodeToString()` 和 `String.encodeToByteArray()`
* `CharArray.concatToString()` and `String.toCharArray()`

```kotlin
fun main() {
//sampleStart
	val str = "kotlin"
    val array = str.toCharArray()
    println(array.concatToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

#### ArrayDeque

我们还添加了 `ArrayDeque` 类——双端队列的一种实现。
双端队列允许你在摊销常数时间内在队列的开头或结尾添加或移除元素。当你代码中需要队列或栈时，默认可以使用双端队列。

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

`ArrayDeque` 实现在底层使用了一个可调大小的数组：它将内容存储在一个循环缓冲区（即 `Array`）中，并且仅当 `Array` 变满时才调整其大小。

### 字符串操作函数

1.4.0 中的标准库在字符串操作 API 方面包含多项改进：

* `StringBuilder` 有用的新扩展函数：`set()`、`setRange()`、`deleteAt()`、`deleteRange()`、`appendRange()` 等。

    ```kotlin
        fun main() {
        //sampleStart
            val sb = StringBuilder("Bye Kotlin 1.3.72")
            sb.deleteRange(0, 3)
            sb.insertRange(0, "Hello", 0 ,5)
            sb.set(15, '4')
            sb.setRange(17, 19, "0")
            print(sb.toString())
        //sampleEnd
        }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `StringBuilder` 的一些现有函数已在通用库中提供。其中包括 `append()`、`insert()`、`substring()`、`setLength()` 等。
* 通用库中添加了新函数 `Appendable.appendLine()` 和 `StringBuilder.appendLine()`。它们取代了这些类中仅限 JVM 的 `appendln()` 函数。

    ```kotlin
    fun main() {
    //sampleStart
        println(buildString {
            appendLine("Hello,")
            appendLine("world")
        })
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### 位操作

位操作的新函数：
* `countOneBits()` 
* `countLeadingZeroBits()`
* `countTrailingZeroBits()`
* `takeHighestOneBit()`
* `takeLowestOneBit()` 
* `rotateLeft()` 和 `rotateRight()`（实验性）

```kotlin
fun main() {
//sampleStart
    val number = "1010000".toInt(radix = 2)
    println(number.countOneBits())
    println(number.countTrailingZeroBits())
    println(number.takeHighestOneBit().toString(2))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### 委托属性改进

在 1.4.0 中，我们添加了新功能来改善你在 Kotlin 中使用委托属性的体验：
- 现在一个属性可以委托给另一个属性。
- 新接口 `PropertyDelegateProvider` 有助于在单个声明中创建委托提供程序。
- `ReadWriteProperty` 现在继承了 `ReadOnlyProperty`，因此你可以将两者都用于只读属性。

除了新 API 外，我们还进行了一些优化以减少生成的字节码大小。这些优化在 [这篇博客文章](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties) 中有所描述。

[详细了解委托属性](delegated-properties.md)。

### 从 KType 转换为 Java Type

标准库中一个新的扩展属性 `KType.javaType`（目前为实验性）可帮助你从 Kotlin 类型获取 `java.lang.reflect.Type`，而无需使用整个 `kotlin-reflect` 依赖。

```kotlin
import kotlin.reflect.javaType
import kotlin.reflect.typeOf

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T> accessReifiedTypeArg() {
   val kType = typeOf<T>()
   println("Kotlin type: $kType")
   println("Java type: ${kType.javaType}")
}

@OptIn(ExperimentalStdlibApi::class)
fun main() {
   accessReifiedTypeArg<String>()
   // Kotlin type: kotlin.String
   // Java type: class java.lang.String
  
   accessReifiedTypeArg<List<String>>()
   // Kotlin type: kotlin.collections.List<kotlin.String>
   // Java type: java.util.List<java.lang.String>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### Kotlin 反射的 Proguard 配置

从 1.4.0 开始，我们在 `kotlin-reflect.jar` 中嵌入了用于 Kotlin 反射的 Proguard/R8 配置。有了这个配置，大多数使用 R8 或 Proguard 的 Android 项目都应该可以直接使用 kotlin-reflect，而无需任何额外配置。你不再需要为 kotlin-reflect 内部结构复制粘贴 Proguard 规则。但请注意，你仍然需要显式列出所有打算进行反射的 API。

### 改进现有 API

* 几个函数现在支持 null 接收者，例如：
    * 字符串上的 `toBoolean()`
    * 数组上的 `contentEquals()`、`contentHashcode()`、`contentToString()`

* `Double` 和 `Float` 中的 `NaN`、`NEGATIVE_INFINITY` 和 `POSITIVE_INFINITY` 现在被定义为 `const`，因此你可以将它们用作注解实参。

* `Double` 和 `Float` 中的新常量 `SIZE_BITS` 和 `SIZE_BYTES` 包含了以二进制形式表示该类型实例所用的位数和字节数。

* `maxOf()` 和 `minOf()` 顶层函数现在可以接受可变数量的实参 (`vararg`)。

### stdlib 构件的 module-info 描述符

Kotlin 1.4.0 为默认标准库构件添加了 `module-info.java` 模块信息。这允许你通过 [jlink 工具](https://docs.oracle.com/en/java/javase/11/tools/jlink.html) 使用它们，该工具生成仅包含应用所需平台模块的自定义 Java 运行时镜像。
你以前已经可以在 Kotlin 标准库构件上使用 jlink，但必须使用单独的构件（带有 "modular" 分类器的构件），且整个设置并不简单。
在 Android 中，请确保使用 3.2 或更高版本的 Android Gradle 插件，它可以正确处理带有 module-info 的 jar 文件。

### 弃用项

#### Double 和 Float 的 toShort() 和 toByte()

我们已经弃用了 `Double` 和 `Float` 上的 `toShort()` 和 `toByte()` 函数，因为由于数值范围狭窄和变量大小较小，它们可能会导致意想不到的结果。

要将浮点数转换为 `Byte` 或 `Short`，请使用两步转换：首先将其转换为 `Int`，然后再将其转换为目标类型。

#### 浮点数组上的 contains()、indexOf() 和 lastIndexOf()

我们已经弃用了 `FloatArray` 和 `DoubleArray` 的 `contains()`、`indexOf()` 和 `lastIndexOf()` 扩展函数，因为它们使用的是 [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 标准相等性，这在某些边缘情况下与全序相等性相矛盾。有关详情，请参阅 [此问题](https://youtrack.jetbrains.com/issue/KT-28753)。

#### min() 和 max() 集合函数

我们已经弃用了 `min()` 和 `max()` 集合函数，转而使用 `minOrNull()` 和 `maxOrNull()`，它们能更准确地反映其行为——在空集合上返回 `null`。
有关详情，请参阅 [此问题](https://youtrack.jetbrains.com/issue/KT-38854)。

### 排除已弃用的实验性协程
 
`kotlin.coroutines.experimental` API 在 1.3.0 中已弃用，转而支持 `kotlin.coroutines`。在 1.4.0 中，我们通过将其从标准库中移除来完成 `kotlin.coroutines.experimental` 的弃用周期。对于那些仍在 JVM 上使用它的开发者，我们提供了一个兼容性构件 `kotlin-coroutines-experimental-compat.jar`，其中包含所有实验性协程 API。我们已将其发布到 Maven，并将其与标准库一起包含在 Kotlin 发行版中。

## 稳定的 JSON 序列化

随着 Kotlin 1.4.0 的发布，我们将交付 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的第一个稳定版本 - 1.0.0-RC。现在我们很高兴地宣布 `kotlinx-serialization-core`（以前称为 `kotlinx-serialization-runtime`）中的 JSON 序列化 API 已稳定。其他序列化格式的库目前仍处于实验阶段，核心库的一些高级部分也是如此。

我们对 JSON 序列化 API 进行了显著的重新设计，使其更加一致且更易于使用。从现在起，我们将继续以向后兼容的方式开发 JSON 序列化 API。
但是，如果你以前使用过它的旧版本，在迁移到 1.0.0-RC 时需要重写部分代码。为了帮助你完成此操作，我们还提供了 **[Kotlin 序列化指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)** —— `kotlinx.serialization` 的完整文档集。它将引导你完成使用最重要功能的过程，并帮助你解决可能遇到的任何问题。

>**注意**：`kotlinx-serialization` 1.0.0-RC 仅适用于 Kotlin 编译器 1.4。早期的编译器版本不兼容。
>
{style="note"}

## 脚本编写与 REPL

在 1.4.0 中，Kotlin 的脚本编写受益于许多功能和性能改进以及其他更新。以下是一些关键变化：

- [新的依赖解析 API](#new-dependencies-resolution-api)
- [新的 REPL API](#new-repl-api)
- [编译脚本缓存](#compiled-scripts-cache)
- [构件重命名](#artifacts-renaming)

为了帮助你更熟悉 Kotlin 中的脚本编写，我们准备了一个 [带有示例的项目](https://github.com/Kotlin/kotlin-script-examples)。
它包含了标准脚本 (`*.main.kts`) 的示例，以及 Kotlin 脚本 API 和自定义脚本定义的用法示例。请试用一下，并通过我们的 [问题跟踪器](https://youtrack.jetbrains.com/issues/KT) 分享你的反馈。

### 新的依赖解析 API

在 1.4.0 中，我们引入了一个用于解析外部依赖项（如 Maven 构件）的新 API 及其实现。此 API 发布在新的构件 `kotlin-scripting-dependencies` 和 `kotlin-scripting-dependencies-maven` 中。`kotlin-script-util` 库中以前的依赖解析功能现已弃用。

### 新的 REPL API

新的实验性 REPL API 现在是 Kotlin 脚本 API 的一部分。发布的构件中也有它的几种实现，其中一些具有代码补全等高级功能。我们在 [Kotlin Jupyter 内核](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/) 中使用了此 API，现在你可以在自己的自定义 shell 和 REPL 中尝试它。

### 编译脚本缓存

Kotlin 脚本 API 现在提供了实现编译脚本缓存的能力，显著加快了未更改脚本的后续执行速度。我们默认的高级脚本实现 `kotlin-main-kts` 已经拥有了自己的缓存。

### 构件重命名

为了避免构件名称混淆，我们将 `kotlin-scripting-jsr223-embeddable` 和 `kotlin-scripting-jvm-host-embeddable` 重命名为 `kotlin-scripting-jsr223` 和 `kotlin-scripting-jvm-host`。这些构件依赖于 `kotlin-compiler-embeddable` 构件，该构件对捆绑的第三方库进行了阴影处理（shading）以避免使用冲突。通过这种重命名，我们将使用 `kotlin-compiler-embeddable`（通常更安全）作为脚本构件的默认配置。
如果由于某种原因你需要依赖未阴影处理的 `kotlin-compiler` 的构件，请使用带有 `-unshaded` 后缀的构件版本，如 `kotlin-scripting-jsr223-unshaded`。请注意，此重命名仅影响打算直接使用的脚本构件；其他构件的名称保持不变。

## 迁移到 Kotlin 1.4.0

Kotlin 插件的迁移工具可帮助你将项目从早期版本的 Kotlin 迁移到 1.4.0。

只需将 Kotlin 版本更改为 `1.4.0` 并重新导入你的 Gradle 或 Maven 项目。IDE 随后会询问你是否进行迁移。
 
如果你同意，它将运行迁移代码检查，检查你的代码并针对 1.4.0 中无法工作或不推荐的内容建议修正。

![运行迁移](run-migration-wn.png){width=300}

代码检查具有不同的 [严重级别](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html)，以帮助你决定接受哪些建议以及忽略哪些。

![迁移检查](migration-inspection-wn.png)

Kotlin 1.4.0 是一个 [特性版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能会给语言带来不兼容的变化。在 **[Kotlin 1.4 兼容性指南](compatibility-guide-14.md)** 中可以找到此类变化的详细列表。