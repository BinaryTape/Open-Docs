[//]: # (title: Kotlin 1.4.0 新特性)

_[发布日期：2020 年 8 月 17 日](releases.md#release-details)_

在 Kotlin 1.4.0 中，我们对其所有组件进行了多项改进，[重点关注质量和性能](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)。
下方列出了 Kotlin 1.4.0 中最重要的变更。

## 语言特性与改进

Kotlin 1.4.0 带来了多种不同的语言特性和改进，包括：

* [Kotlin 接口的 SAM 转换](#sam-conversions-for-kotlin-interfaces)
* [面向库作者的显式 API 模式](#explicit-api-mode-for-library-authors)
* [混合使用命名参数和位置参数](#mixing-named-and-positional-arguments)
* [尾随逗号](#trailing-comma)
* [可调用引用改进](#callable-reference-improvements)
* [在循环中的 `when` 表达式中使用 `break` 和 `continue`](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin 接口的 SAM 转换

在 Kotlin 1.4.0 之前，你只能在 [从 Kotlin 使用 Java 方法和 Java 接口时](java-interop.md#sam-conversions) 应用 SAM（Single Abstract Method，单一抽象方法）转换。从现在起，你也可以将 SAM 转换用于 Kotlin 接口。为此，请使用 `fun` 修饰符将 Kotlin 接口显式标记为函数式接口。

当参数预期是一个只有一个抽象方法的接口时，如果你传入一个 lambda 表达式作为实参，则会应用 SAM 转换。在这种情况下，编译器会自动将 lambda 表达式转换为实现该抽象成员函数的类的实例。

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

[了解更多关于 Kotlin 函数式接口和 SAM 转换的信息](fun-interfaces.md)。

### 面向库作者的显式 API 模式

Kotlin 编译器为库作者提供了 _显式 API 模式_。在此模式下，编译器会执行额外的检查，有助于使库的 API 更清晰、更一致。它对暴露给库公共 API 的声明添加了以下要求：

* 如果声明的默认可见性将其暴露给公共 API，则需要为其指定可见性修饰符。这有助于确保不会无意中将任何声明暴露给公共 API。
* 对于暴露给公共 API 的属性和函数，需要显式指定类型。这保证了 API 用户清楚他们使用的 API 成员的类型。

根据你的配置，这些显式 API 可以生成错误（_严格模式_）或警告（_警告模式_）。出于可读性和常识考虑，某些类型的声明被排除在这些检查之外：

* 主构造函数
* 数据类的属性
* 属性 getter 和 setter
* `override` 方法

显式 API 模式仅分析模块的生产源。

要以显式 API 模式编译你的模块，请将以下行添加到你的 Gradle 构建脚本中：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = ExplicitApiMode.Strict
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = ExplicitApiMode.Warning
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = 'strict'
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = 'warning'
}
```

</tab>
</tabs>

使用命令行编译器时，通过添加值为 `strict` 或 `warning` 的 `-Xexplicit-api` 编译器选项来切换到显式 API 模式。

```bash
-Xexplicit-api={strict|warning}
```

[在 KEEP 中查找有关显式 API 模式的更多详细信息](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md)。

### 混合使用命名参数和位置参数

在 Kotlin 1.3 中，当你调用带有[命名参数](functions.md#named-arguments)的函数时，所有没有名称的参数（位置参数）必须放在第一个命名参数之前。例如，你可以调用 `f(1, y = 2)`，但不能调用 `f(x = 1, 2)`。

当所有参数都在正确的位置，但你只想为中间的某个参数指定名称时，这非常令人恼火。这对于明确布尔值或 `null` 值属于哪个属性特别有帮助。

在 Kotlin 1.4 中，没有这样的限制——你现在可以在一组位置参数的中间为某个参数指定名称。此外，你可以随意混合位置参数和命名参数，只要它们保持正确的顺序即可。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

//Function call with a named argument in the middle
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 尾随逗号

在 Kotlin 1.4 中，你现在可以在枚举中添加尾随逗号，例如参数列表、`when` 表达式的条目以及解构声明的组件。
使用尾随逗号，你可以添加新项并更改它们的顺序，而无需添加或删除逗号。

如果你的参数或值使用多行语法，这会特别有帮助。添加尾随逗号后，你可以轻松地交换参数或值的行。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', //trailing comma
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", //trailing comma
)
```

### 可调用引用改进

Kotlin 1.4 支持更多使用可调用引用的情况：

* 对具有默认参数值的函数的引用
* `Unit` 返回函数中的函数引用
* 根据函数参数数量自适应的引用
* 可调用引用上的挂起转换

#### 对具有默认参数值的函数的引用

现在你可以使用对带有默认参数值的函数的调用引用。如果对函数 `foo` 的可调用引用不接受任何参数，则使用默认值 `0`。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

以前，你必须为 `apply` 函数编写额外的重载才能使用默认参数值。

```kotlin
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### `Unit` 返回函数中的函数引用

在 Kotlin 1.4 中，你可以在 `Unit` 返回函数中使用对返回任何类型的函数的调用引用。在 Kotlin 1.4 之前，在这种情况下你只能使用 lambda 参数。现在你可以同时使用 lambda 参数和可调用引用。

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

#### 根据函数参数数量自适应的引用

现在，在传递可变数量的参数 (`vararg`) 时，你可以将可调用引用适配到函数。你可以在传递参数列表的末尾传递任意数量的同类型参数。

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

除了 lambda 上的挂起转换之外，Kotlin 从 1.4.0 版本开始还支持可调用引用上的挂起转换。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

### 在循环中的 `when` 表达式中使用 `break` 和 `continue`

在 Kotlin 1.3 中，你不能在循环中包含的 `when` 表达式中使用不带限定符的 `break` 和 `continue`。原因是这些关键字在 `when` 表达式中保留用于可能的[直通行为](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)。

这就是为什么如果你想在循环中 `when` 表达式中使用 `break` 和 `continue`，你必须[为其加标签](returns.md#break-and-continue-labels)，这变得相当繁琐。

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

在 Kotlin 1.4 中，你可以在循环中包含的 `when` 表达式中不带标签地使用 `break` 和 `continue`。它们的行为符合预期，会终止最近的封闭循环或进入其下一步。

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

`when` 内部的直通行为有待进一步设计。

## IDE 中的新工具

借助 Kotlin 1.4，你可以在 IntelliJ IDEA 中使用新工具来简化 Kotlin 开发：

* [全新的灵活项目向导](#new-flexible-project-wizard)
* [协程调试器](#coroutine-debugger)

### 全新的灵活项目向导

借助全新的灵活 Kotlin 项目向导，你可以轻松创建和配置不同类型的 Kotlin 项目，包括多平台项目，这些项目在没有 UI 的情况下可能难以配置。

![Kotlin 项目向导 – 多平台项目](multiplatform-project-1-wn.png)

新的 Kotlin 项目向导既简单又灵活：

1.  *选择项目模板*，具体取决于你尝试完成的任务。未来将添加更多模板。
2.  *选择构建系统*——Gradle（Kotlin 或 Groovy DSL）、Maven 或 IntelliJ IDEA。
    Kotlin 项目向导只会显示所选项目模板支持的构建系统。
3.  *直接在主屏幕上预览项目结构*。

然后你可以完成项目创建，或者，也可以在下一个屏幕上*配置项目*：

4.  *添加/删除模块和目标*，这些模块和目标为此项目模板所支持。
5.  *配置模块和目标设置*，例如目标 JVM 版本、目标模板和测试框架。

![Kotlin 项目向导 - 配置目标](multiplatform-project-2-wn.png)

未来，我们将通过添加更多配置选项和模板，使 Kotlin 项目向导更加灵活。

你可以通过以下教程来尝试新的 Kotlin 项目向导：

* [创建基于 Kotlin/JVM 的控制台应用程序](jvm-get-started.md)
* [为 React 创建 Kotlin/JS 应用程序](js-react.md)
* [创建 Kotlin/Native 应用程序](native-get-started.md)

### 协程调试器

许多人已经使用[协程](coroutines-guide.md)进行异步编程。
但在 Kotlin 1.4 之前，调试协程可能非常痛苦。由于协程在线程之间跳转，因此很难理解特定协程正在做什么并检查其上下文。在某些情况下，通过断点跟踪步骤根本不起作用。因此，你不得不依赖日志记录或脑力劳动来调试使用协程的代码。

在 Kotlin 1.4 中，借助 Kotlin 插件附带的新功能，调试协程现在方便得多。

> 调试适用于 `kotlinx-coroutines-core` 1.3.8 或更高版本。
>
{style="note"}

**调试工具窗口**现在包含一个新的**协程**选项卡。在此选项卡中，你可以找到有关当前运行和已挂起协程的信息。协程按其运行的调度器进行分组。

![调试协程](coroutine-debugger-wn.png)

现在你可以：
* 轻松检查每个协程的状态。
* 查看运行中和已挂起协程的局部变量和捕获变量的值。
* 查看完整的协程创建堆栈，以及协程内部的调用堆栈。此堆栈包含所有带有变量值的帧，即使是在标准调试期间会丢失的帧。

如果你需要一份包含每个协程状态及其堆栈的完整报告，请在**协程**选项卡中右键单击，然后单击**获取协程转储**。目前，协程转储相当简单，但我们将在 Kotlin 的未来版本中使其更具可读性和实用性。

![协程转储](coroutines-dump-wn.png)

在[这篇博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/)和 [IntelliJ IDEA 文档](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html)中了解更多关于调试协程的信息。

## 新编译器

新的 Kotlin 编译器将非常快速；它将统一所有支持的平台并提供编译器扩展的 API。这是一个长期项目，我们已在 Kotlin 1.4.0 中完成了几个步骤：

* [全新更强大的类型推断算法](#new-more-powerful-type-inference-algorithm)已默认启用。
* [新的 JVM 和 JS IR 后端](#unified-backends-and-extensibility)。它们在稳定后将成为默认。

### 全新更强大的类型推断算法

Kotlin 1.4 使用了全新、更强大的类型推断算法。此新算法在 Kotlin 1.3 中已可作为编译器选项进行试用，现在则默认使用。你可以在 [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20) 中找到此新算法中修复的所有问题列表。这里列出了一些最显著的改进：

* [更多类型自动推断的情况](#more-cases-where-type-is-inferred-automatically)
* [lambda 最后一个表达式的智能转换](#smart-casts-for-a-lambda-s-last-expression)
* [可调用引用的智能转换](#smart-casts-for-callable-references)
* [委托属性的更好推断](#better-inference-for-delegated-properties)
* [具有不同参数的 Java 接口的 SAM 转换](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Kotlin 中的 Java SAM 接口](#java-sam-interfaces-in-kotlin)

#### 更多类型自动推断的情况

新的推断算法在许多旧算法需要你显式指定类型的情况下，现在可以自动推断类型。例如，在以下示例中，lambda 参数 `it` 的类型被正确推断为 `String?`：

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

在 Kotlin 1.3 中，你需要引入显式 lambda 参数或将 `to` 替换为带有显式泛型参数的 `Pair` 构造函数才能使其工作。

#### lambda 最后一个表达式的智能转换

在 Kotlin 1.3 中，除非你指定了预期类型，否则 lambda 内部的最后一个表达式不会进行智能转换。因此，在以下示例中，Kotlin 1.3 将 `String?` 推断为 `result` 变量的类型：

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // the Kotlin compiler knows that str is not null here
}
// The type of 'result' is String? in Kotlin 1.3 and String in Kotlin 1.4
```

在 Kotlin 1.4 中，得益于新的推断算法，lambda 内部的最后一个表达式会进行智能转换，并且这个新的、更精确的类型用于推断生成的 lambda 类型。因此，`result` 变量的类型变为 `String`。

在 Kotlin 1.3 中，你通常需要添加显式转换（`!!` 或类型转换如 `as String`）才能使这些情况正常工作，而现在这些转换已变得不必要。

#### 可调用引用的智能转换

在 Kotlin 1.3 中，你无法访问智能转换类型的成员引用。现在在 Kotlin 1.4 中你可以：

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

在 `animal` 变量被智能转换为特定类型 `Cat` 和 `Dog` 后，你可以使用不同的成员引用 `animal::meow` 和 `animal::woof`。类型检查后，你可以访问与子类型对应的成员引用。

#### 委托属性的更好推断

在分析 `by` 关键字后面的委托表达式时，没有考虑委托属性的类型。例如，以下代码以前无法编译，但现在编译器正确地将 `old` 和 `new` 参数的类型推断为 `String?`：

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

#### 具有不同参数的 Java 接口的 SAM 转换

Kotlin 从一开始就支持 Java 接口的 SAM 转换，但有一种情况不支持，这在使用现有 Java 库时有时会很烦人。如果你调用一个接受两个 SAM 接口作为参数的 Java 方法，则这两个参数必须要么都是 lambda 表达式，要么都是常规对象。你不能一个参数作为 lambda 表达式传递，另一个作为对象传递。

新算法解决了这个问题，在任何情况下你都可以传递 lambda 表达式而不是 SAM 接口，这正是你自然期望的工作方式。

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // Works in Kotlin 1.4
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

在 Kotlin 1.3 中，你必须在 Java 代码中声明上述 `foo` 函数才能执行 SAM 转换。

### 统一的后端和可扩展性

在 Kotlin 中，我们有三个生成可执行文件的后端：Kotlin/JVM、Kotlin/JS 和 Kotlin/Native。Kotlin/JVM 和 Kotlin/JS 在很大程度上不共享代码，因为它们是独立开发的。Kotlin/Native 基于围绕 Kotlin 代码的中间表示 (IR) 构建的新基础设施。

我们现在正在将 Kotlin/JVM 和 Kotlin/JS 迁移到相同的 IR。因此，所有三个后端共享大量逻辑并拥有统一的管道。这使我们能够对所有平台只实现一次大多数特性、优化和错误修复。两个新的基于 IR 的后端都处于 [Alpha 阶段](components-stability.md)。

通用的后端基础设施也为多平台编译器扩展打开了大门。你将能够插入到管道中，并添加自定义处理和转换，这些处理和转换将自动适用于所有平台。

我们鼓励你试用我们目前处于 Alpha 阶段的新 [JVM IR](#new-jvm-ir-backend) 和 [JS IR](#new-js-ir-backend) 后端，并向我们分享你的反馈。

## Kotlin/JVM

Kotlin 1.4.0 包含多项 JVM 特定的改进，例如：

* [新的 JVM IR 后端](#new-jvm-ir-backend)
* [接口中生成默认方法的新模式](#new-modes-for-generating-default-methods)
* [空检查的统一异常类型](#unified-exception-type-for-null-checks)
* [JVM 字节码中的类型注解](#type-annotations-in-the-jvm-bytecode)

### 新的 JVM IR 后端

与 Kotlin/JS 一起，我们正在将 Kotlin/JVM 迁移到[统一的 IR 后端](#unified-backends-and-extensibility)，这使我们能够对所有平台只实现一次大多数特性和错误修复。你还可以通过创建适用于所有平台的多平台扩展来从中受益。

Kotlin 1.4.0 尚未为此类扩展提供公共 API，但我们正在与包括 [Jetpack Compose](https://developer.android.com/jetpack/compose) 在内的合作伙伴紧密合作，他们已在使用我们的新后端构建其编译器插件。

我们鼓励你试用目前处于 Alpha 阶段的新 Kotlin/JVM 后端，并向我们的[问题追踪器](https://youtrack.jetbrains.com/issues/KT)提交任何问题和功能请求。这将有助于我们统一编译器管道，更快地将 Jetpack Compose 等编译器扩展带给 Kotlin 社区。

要启用新的 JVM IR 后端，请在 Gradle 构建脚本中指定一个额外的编译器选项：

```kotlin
kotlinOptions.useIR = true
```

> 如果你[启用 Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en)，你将自动选择使用新的 JVM 后端，无需在 `kotlinOptions` 中指定编译器选项。
>
{style="note"}

使用命令行编译器时，添加编译器选项 `-Xuse-ir`。

> 你只能在你已启用新后端的情况下使用由新 JVM IR 后端编译的代码。否则，你将收到错误。考虑到这一点，我们不建议库作者在生产环境中切换到新后端。
>
{style="note"}

### 生成默认方法的新模式

将 Kotlin 代码编译到 JVM 1.8 及更高版本时，你可以将 Kotlin 接口的非抽象方法编译为 Java 的 `default` 方法。为此，有一个机制包括用于标记此类方法的 `@JvmDefault` 注解，以及启用此注解处理的 `-Xjvm-default` 编译器选项。

在 1.4.0 中，我们添加了生成默认方法的新模式：`-Xjvm-default=all` 将 Kotlin 接口的*所有*非抽象方法编译为 Java 的 `default` 方法。为了与未使用 `default` 编译的接口代码兼容，我们还添加了 `all-compatibility` 模式。

有关 Java 互操作中默认方法的更多信息，请参阅[互操作性文档](java-to-kotlin-interop.md#default-methods-in-interfaces)和[这篇博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 空检查的统一异常类型

从 Kotlin 1.4.0 开始，所有运行时空检查都将抛出 `java.lang.NullPointerException`，而不是 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`。这适用于：`!!` 运算符、方法前言中的参数空检查、平台类型表达式空检查，以及带有不可为空类型的 `as` 运算符。这不适用于 `lateinit` 空检查以及 `checkNotNull` 或 `requireNotNull` 等显式库函数调用。

此更改增加了 Kotlin 编译器或各种字节码处理工具（例如 Android [R8 优化器](https://developer.android.com/studio/build/shrink-code)）可以执行的空检查优化数量。

请注意，从开发人员的角度来看，情况不会发生太大变化：Kotlin 代码将抛出与以前相同的错误消息。异常类型改变，但传递的信息保持不变。

### JVM 字节码中的类型注解

Kotlin 现在可以在 JVM 字节码（目标版本 1.8+）中生成类型注解，以便它们在运行时通过 Java 反射可用。
要在字节码中发出类型注解，请按照以下步骤操作：

1.  确保你声明的注解具有正确的注解目标（Java 的 `ElementType.TYPE_USE` 或 Kotlin 的 `AnnotationTarget.TYPE`）和保留策略（`AnnotationRetention.RUNTIME`）。
2.  将注解类声明编译为 JVM 字节码目标版本 1.8+。你可以使用 `-jvm-target=1.8` 编译器选项指定它。
3.  将使用该注解的代码编译为 JVM 字节码目标版本 1.8+（`-jvm-target=1.8`），并添加 `-Xemit-jvm-type-annotations` 编译器选项。

请注意，标准库中的类型注解目前不会在字节码中发出，因为标准库是使用目标版本 1.6 编译的。

到目前为止，只支持基本情况：

-   方法参数、方法返回类型和属性类型上的类型注解；
-   类型参数的不变投影，例如 `Smth<@Ann Foo>`、`Array<@Ann Foo>`。

在以下示例中，`String` 类型上的 `@Foo` 注解可以发出到字节码中，然后由库代码使用：

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

在 JS 平台上，Kotlin 1.4.0 提供了以下改进：

-   [新的 Gradle DSL](#new-gradle-dsl)
-   [新的 JS IR 后端](#new-js-ir-backend)

### 新的 Gradle DSL

`kotlin.js` Gradle 插件附带了调整后的 Gradle DSL，它提供了许多新的配置选项，并且与 `kotlin-multiplatform` 插件使用的 DSL 更紧密对齐。其中一些最具影响力的更改包括：

-   通过 `binaries.executable()` 显式切换可执行文件的创建。在此处了解更多关于[执行 Kotlin/JS 及其环境的信息](js-project-setup.md#execution-environments)。
-   通过 `cssSupport` 从 Gradle 配置中配置 webpack 的 CSS 和样式加载器。在此处了解更多关于[使用 CSS 和样式加载器](js-project-setup.md#css)的信息。
-   改进了 npm 依赖项的管理，强制要求版本号或 [semver](https://docs.npmjs.com/about-semantic-versioning) 版本范围，并支持使用 `devNpm`、`optionalNpm` 和 `peerNpm` 的_开发_、_对等_和_可选_ npm 依赖项。[在此处直接从 Gradle 了解更多关于 npm 包依赖项管理的信息](js-project-setup.md#npm-dependencies)。
-   [Dukat](https://github.com/Kotlin/dukat) 的更强集成，它是 Kotlin 外部声明的生成器。外部声明现在可以在构建时生成，或者可以通过 Gradle 任务手动生成。

### 新的 JS IR 后端

[Kotlin/JS 的 IR 后端](js-ir-compiler.md)目前处于 [Alpha](components-stability.md) 稳定性，它提供了一些特定于 Kotlin/JS 目标的新功能，这些功能主要围绕通过死代码消除来减小生成的代码大小，以及改进与 JavaScript 和 TypeScript 的互操作性等。

要启用 Kotlin/JS IR 后端，请在 `gradle.properties` 中设置键 `kotlin.js.compiler=ir`，或者将 `IR` 编译器类型传递给 Gradle 构建脚本的 `js` 函数：

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

有关如何配置新后端的更详细信息，请查阅 [Kotlin/JS IR 编译器文档](js-ir-compiler.md)。

借助新的 [@JsExport](js-to-kotlin-interop.md#jsexport-annotation) 注解和从 Kotlin 代码**[生成 TypeScript 定义](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts)的功能**，Kotlin/JS IR 编译器后端改进了 JavaScript 和 TypeScript 的互操作性。这也使得将 Kotlin/JS 代码与现有工具集成、创建**混合应用程序**以及在多平台项目中利用代码共享功能变得更加容易。

[了解更多关于 Kotlin/JS IR 编译器后端中的可用功能](js-ir-compiler.md)。

## Kotlin/Native

在 1.4.0 中，Kotlin/Native 获得了大量新功能和改进，包括：

* [支持 Swift 和 Objective-C 中的 Kotlin 挂起函数](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [默认支持 Objective-C 泛型](#objective-c-generics-support-by-default)
* [Objective-C/Swift 互操作中的异常处理](#exception-handling-in-objective-c-swift-interop)
* [默认在 Apple 目标上生成发布 .dSYMs](#generate-release-dsyms-on-apple-targets-by-default)
* [性能改进](#performance-improvements)
* [简化 CocoaPods 依赖项管理](#simplified-management-of-cocoapods-dependencies)

### 支持 Swift 和 Objective-C 中的 Kotlin 挂起函数

在 1.4.0 中，我们增加了对 Swift 和 Objective-C 中挂起函数的基本支持。现在，当你将 Kotlin 模块编译为 Apple 框架时，挂起函数在其中作为带有回调的函数（在 Swift/Objective-C 术语中为 `completionHandler`）可用。当你在生成的框架头文件中拥有此类函数时，你可以从 Swift 或 Objective-C 代码中调用它们，甚至可以覆盖它们。

例如，如果你编写以下 Kotlin 函数：

```kotlin
suspend fun queryData(id: Int): String = ...
```

...然后你可以像这样从 Swift 调用它：

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[了解更多关于在 Swift 和 Objective-C 中使用挂起函数的信息](native-objc-interop.md)。

### 默认支持 Objective-C 泛型

以前的 Kotlin 版本提供了对 Objective-C 互操作中泛型的实验性支持。从 1.4.0 开始，Kotlin/Native 默认从 Kotlin 代码生成带有泛型的 Apple 框架。在某些情况下，这可能会破坏调用 Kotlin 框架的现有 Objective-C 或 Swift 代码。要使框架头文件不带泛型，请添加 `-Xno-objc-generics` 编译器选项。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

请注意，[与 Objective-C 互操作性文档](native-objc-interop.md#generics)中列出的所有细节和限制仍然有效。

### Objective-C/Swift 互操作中的异常处理

在 1.4.0 中，我们稍微改变了从 Kotlin 生成的 Swift API，这涉及到异常的转换方式。Kotlin 和 Swift 在错误处理上存在根本性差异。所有 Kotlin 异常都是非检查的，而 Swift 只有检查错误。因此，为了让 Swift 代码感知预期的异常，Kotlin 函数应该用 `@Throws` 注解标记，并指定潜在异常类的列表。

当编译为 Swift 或 Objective-C 框架时，具有或继承 `@Throws` 注解的函数在 Objective-C 中表示为 `NSError*`-生成方法，在 Swift 中表示为 `throws` 方法。

以前，除 `RuntimeException` 和 `Error` 之外的任何异常都作为 `NSError` 传播。现在此行为改变：现在只有 `@Throws` 注解参数中指定的类（或其子类）的实例异常才会抛出 `NSError`。到达 Swift/Objective-C 的其他 Kotlin 异常被视为未处理，并导致程序终止。

### 默认在 Apple 目标上生成发布 .dSYMs

从 1.4.0 开始，Kotlin/Native 编译器默认在 Darwin 平台上为发布二进制文件生成[调试符号文件](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information)（`.dSYMs`）。这可以通过 `-Xadd-light-debug=disable` 编译器选项禁用。在其他平台上，此选项默认禁用。要在 Gradle 中切换此选项，请使用：

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[了解更多关于崩溃报告符号化的信息](native-ios-symbolication.md)。

### 性能改进

Kotlin/Native 收到了一系列性能改进，可加速开发过程和执行。以下是一些示例：

-   为了提高对象分配速度，我们现在提供 [mimalloc](https://github.com/microsoft/mimalloc) 内存分配器作为系统分配器的替代方案。mimalloc 在某些基准测试中速度提高了一倍。目前，在 Kotlin/Native 中使用 mimalloc 仍是实验性的；你可以使用 `-Xallocator=mimalloc` 编译器选项切换到它。

-   我们重构了 C 互操作库的构建方式。借助新工具，Kotlin/Native 生成互操作库的速度比以前快 4 倍，且 artifact 的大小是以前的 25% 到 30%。

-   由于 GC 优化，整体运行时性能有所提高。在具有大量长生命周期对象的项目中，此改进将尤为明显。`HashMap` 和 `HashSet` 集合现在通过避免冗余装箱工作得更快。

-   在 1.3.70 中，我们引入了两个新功能以提高 Kotlin/Native 编译性能：[缓存项目依赖项和从 Gradle 守护进程运行编译器](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。自那时起，我们已修复了许多问题并提高了这些功能的整体稳定性。

### 简化 CocoaPods 依赖项管理

以前，一旦你将项目与依赖管理器 CocoaPods 集成，你只能在 Xcode 中构建项目的 iOS、macOS、watchOS 或 tvOS 部分，而不能与多平台项目的其他部分分开。这些其他部分可以在 IntelliJ IDEA 中构建。

此外，每次你添加对 CocoaPods 中存储的 Objective-C 库（Pod 库）的依赖时，你都必须从 IntelliJ IDEA 切换到 Xcode，调用 `pod install`，并在那里运行 Xcode 构建。

现在你可以在 IntelliJ IDEA 中直接管理 Pod 依赖项，同时享受它提供的代码高亮和补全等工作便利。你还可以使用 Gradle 构建整个 Kotlin 项目，而无需切换到 Xcode。这意味着你只有在需要编写 Swift/Objective-C 代码或在模拟器或设备上运行应用程序时才需要转到 Xcode。

现在你还可以使用本地存储的 Pod 库。

根据你的需求，你可以在以下之间添加依赖项：
*   Kotlin 项目与远程存储在 CocoaPods 仓库或本地存储在你的机器上的 Pod 库。
*   Kotlin Pod（用作 CocoaPods 依赖项的 Kotlin 项目）与带有一个或多个目标的 Xcode 项目。

完成初始配置后，当你向 `cocoapods` 添加新依赖项时，只需在 IntelliJ IDEA 中重新导入项目即可。新依赖项将自动添加，无需额外步骤。

[了解如何添加依赖项](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html)。

## Kotlin 多平台

> 对多平台项目的支持处于 [Alpha 阶段](components-stability.md)。未来它可能会出现不兼容的更改，并需要手动迁移。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
>
{style="warning"}

[Kotlin 多平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 减少了为[不同平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)编写和维护相同代码的时间，同时保留了原生编程的灵活性和优势。我们继续投入精力于多平台功能和改进：

* [通过分层项目结构在多个目标中共享代码](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
* [在分层结构中利用原生库](#leveraging-native-libs-in-the-hierarchical-structure)
* [只指定一次 kotlinx 依赖项](#specifying-dependencies-only-once)

> 多平台项目需要 Gradle 6.0 或更高版本。
>
{style="note"}

### 通过分层项目结构在多个目标中共享代码

借助新的分层项目结构支持，你可以在[多平台项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html)中的[多个平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)之间共享代码。

以前，添加到多平台项目中的任何代码都可以放置在平台特定的源集（仅限于一个目标，不能被其他平台重用），或者放置在公共源集（如 `commonMain` 或 `commonTest`）（在项目中的所有平台之间共享）。在公共源集中，你只能通过使用[需要平台特定 `actual` 实现的 `expect` 声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)来调用平台特定的 API。

这使得[在所有平台共享代码](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-all-platforms)变得容易，但[在部分目标之间共享](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)则不那么容易，尤其是那些可能重用大量公共逻辑和第三方 API 的类似目标。

例如，在一个典型的以 iOS 为目标的多平台项目中，有两个与 iOS 相关的目标：一个用于 iOS ARM64 设备，另一个用于 x64 模拟器。它们有单独的平台特定源集，但实际上，很少需要为设备和模拟器编写不同的代码，它们的依赖项也很相似。因此，iOS 特定的代码可以在它们之间共享。

![为 iOS 目标共享代码](iosmain-hierarchy.png){width=300}

显然，在这种设置中，拥有一个*两个 iOS 目标共享的源集*是理想的，其中 Kotlin/Native 代码仍然可以直接调用 iOS 设备和模拟器共有的任何 API。

现在你可以通过[分层项目结构支持](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)来实现这一点，它根据哪些目标使用它们来推断和调整每个源集中可用的 API 和语言特性。

对于常见的组合目标，你可以使用目标快捷方式创建分层结构。例如，使用 `ios()` 快捷方式创建两个 iOS 目标和上面显示的共享源集：

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

对于其他目标组合，可以通过 `dependsOn` 关系连接源集来[手动创建层次结构](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#manual-configuration)。

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

得益于分层项目结构，库也可以为目标子集提供公共 API。了解更多关于[在库中共享代码的信息](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)。

### 在分层结构中利用原生库

你可以在多个原生目标共享的源集中使用平台相关的库，例如 Foundation、UIKit 和 POSIX。这可以帮助你共享更多原生代码，而不受平台特定依赖项的限制。

无需额外步骤——一切都是自动完成的。IntelliJ IDEA 将帮助你检测可以在共享代码中使用的公共声明。

[了解更多关于平台相关库的使用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。

### 只指定一次 kotlinx 依赖项

从现在开始，你只需在共享源集中指定一次依赖项，而无需在使用库的共享和平台特定源集中指定同一库的不同变体的依赖项。

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

不要使用带有指定平台后缀（例如 `-common`、`-native` 或类似后缀）的 kotlinx 库 artifact 名称，因为它们不再受支持。相反，请使用库的基本 artifact 名称，如上例中的 `kotlinx-coroutines-core`。

但是，此更改目前不影响：
*   `stdlib` 库——从 Kotlin 1.4.0 开始，[`stdlib` 依赖项会自动添加](#dependency-on-the-standard-library-added-by-default)。
*   `kotlin.test` 库——你仍应使用 `test-common` 和 `test-annotations-common`。这些依赖项将在稍后处理。

如果你只需要特定平台的依赖项，你仍然可以使用带有 `-jvm` 或 `-js` 等后缀的标准库和 kotlinx 库的平台特定变体，例如 `kotlinx-coroutines-core-jvm`。

[了解更多关于配置依赖项的信息](gradle-configure-project.md#configure-dependencies)。

## Gradle 项目改进

除了特定于 [Kotlin 多平台](#kotlin-multiplatform)、[Kotlin/JVM](#kotlin-jvm)、[Kotlin/Native](#kotlin-native) 和 [Kotlin/JS](#kotlin-js) 的 Gradle 项目特性和改进之外，还有一些适用于所有 Kotlin Gradle 项目的更改：

* [标准库依赖项现在默认添加](#dependency-on-the-standard-library-added-by-default)
* [Kotlin 项目需要较新版本的 Gradle](#minimum-gradle-version-for-kotlin-projects)
* [IDE 中对 Kotlin Gradle DSL 的改进支持](#improved-gradle-kts-support-in-the-ide)

### 标准库依赖项现在默认添加

你不再需要在任何 Kotlin Gradle 项目中（包括多平台项目）声明对 `stdlib` 库的依赖。该依赖项现在默认添加。

自动添加的标准库将与 Kotlin Gradle 插件版本相同，因为它们具有相同的版本控制。

对于平台特定的源集，使用库的相应平台特定变体，而通用标准库则添加到其余部分。Kotlin Gradle 插件将根据你的 Gradle 构建脚本的 `kotlinOptions.jvmTarget` [编译器选项](gradle-compiler-options.md)选择合适的 JVM 标准库。

[了解如何更改默认行为](gradle-configure-project.md#dependency-on-the-standard-library)。

### Kotlin 项目所需的最低 Gradle 版本

要享受 Kotlin 项目中的新功能，请将 Gradle 更新到[最新版本](https://gradle.org/releases/)。多平台项目需要 Gradle 6.0 或更高版本，而其他 Kotlin 项目则与 Gradle 5.4 或更高版本兼容。

### IDE 中对 *.gradle.kts 的改进支持

在 1.4.0 中，我们继续改进了对 Gradle Kotlin DSL 脚本（`*.gradle.kts` 文件）的 IDE 支持。新版本带来了以下改进：

-   _显式加载脚本配置_以获得更好的性能。以前，你对构建脚本所做的更改会在后台自动加载。为了提高性能，我们在 1.4.0 中禁用了构建脚本配置的自动加载。现在，IDE 只有在你显式应用更改时才会加载它们。

    在 Gradle 6.0 之前的版本中，你需要通过单击编辑器中的**加载配置**手动加载脚本配置。

    ![*.gradle.kts – 加载配置](gradle-kts-load-config.png)

    在 Gradle 6.0 及更高版本中，你可以通过单击**加载 Gradle 更改**或重新导入 Gradle 项目来显式应用更改。

    在 IntelliJ IDEA 2020.1 及更高版本中，我们添加了另一个操作——**加载脚本配置**，它可以在不更新整个项目的情况下加载脚本配置的更改。这比重新导入整个项目花费的时间少得多。

    ![*.gradle.kts – 加载脚本更改和加载 Gradle 更改](gradle-kts.png)

    对于新创建的脚本或首次使用新 Kotlin 插件打开项目时，你也应该**加载脚本配置**。

    使用 Gradle 6.0 及更高版本，你现在可以一次性加载所有脚本，而不是像以前那样单独加载。由于每个请求都需要执行 Gradle 配置阶段，这对于大型 Gradle 项目来说可能是资源密集型的。

    目前，此类加载仅限于 `build.gradle.kts` 和 `settings.gradle.kts` 文件（请为相关[问题](https://github.com/gradle/gradle/issues/12640)投票）。要为 `init.gradle.kts` 或应用的[脚本插件](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins)启用高亮显示，请使用旧机制——将它们添加到独立脚本中。这些脚本的配置将在你需要时单独加载。你还可以为这些脚本启用自动重新加载。

    ![*.gradle.kts – 添加到独立脚本](gradle-kts-standalone.png)

-   _更好的错误报告_。以前，你只能在单独的日志文件中查看 Gradle Daemon 的错误。现在，Gradle Daemon 直接返回所有错误信息，并将其显示在构建工具窗口中。这为你节省了时间和精力。

## 标准库

以下是 Kotlin 1.4.0 标准库中最显著的更改列表：

-   [通用异常处理 API](#common-exception-processing-api)
-   [数组和集合的新函数](#new-functions-for-arrays-and-collections)
-   [字符串操作函数](#functions-for-string-manipulations)
-   [位操作](#bit-operations)
-   [委托属性改进](#delegated-properties-improvements)
-   [将 KType 转换为 Java Type](#converting-from-ktype-to-java-type)
-   [Kotlin 反射的 Proguard 配置](#proguard-configurations-for-kotlin-reflection)
-   [改进现有 API](#improving-the-existing-api)
-   [stdlib artifact 的 module-info 描述符](#module-info-descriptors-for-stdlib-artifacts)
-   [弃用](#deprecations)
-   [排除已弃用的实验性协程](#exclusion-of-the-deprecated-experimental-coroutines)

### 通用异常处理 API

以下 API 元素已移至通用库：

*   `Throwable.stackTraceToString()` 扩展函数（返回此可抛出对象及其堆栈跟踪的详细描述）和 `Throwable.printStackTrace()`（将此描述打印到标准错误输出）。
*   `Throwable.addSuppressed()` 函数（允许你指定为传递异常而被抑制的异常）和 `Throwable.suppressedExceptions` 属性（返回所有被抑制异常的列表）。
*   `@Throws` 注解（列出函数编译为平台方法（在 JVM 或原生平台）时将检查的异常类型）。

### 数组和集合的新函数

#### 集合

在 1.4.0 中，标准库包含许多用于处理**集合**的有用函数：

*   `setOfNotNull()`，它创建一个由所提供参数中所有非空项组成的集合。

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `shuffled()`（用于序列）。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = (0 until 50).asSequence()
        val result = numbers.map { it * 2 }.shuffled().take(5)
        println(result.toList()) //five random even numbers below 100
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `onEach()` 和 `flatMap()` 的 `*Indexed()` 对应函数。它们应用于集合元素的操作以元素索引作为参数。

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

*   `randomOrNull()`、`reduceOrNull()` 和 `reduceIndexedOrNull()` 的 `*OrNull()` 对应函数。它们在空集合上返回 `null`。

    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         //empty.reduce { a, b -> a + b } // Exception: Empty collection can't be reduced.
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `runningFold()` 及其同义词 `scan()` 和 `runningReduce()` 依次将给定操作应用于集合元素，类似于`fold()` 和 `reduce()`；不同之处在于这些新函数返回整个中间结果序列。

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

*   `sumOf()` 接受一个选择器函数，并返回其对集合所有元素值的总和。`sumOf()` 可以生成 `Int`、`Long`、`Double`、`UInt` 和 `ULong` 类型的总和。在 JVM 上，`BigInteger` 和 `BigDecimal` 也可用。

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

*   `min()` 和 `max()` 函数已重命名为 `minOrNull()` 和 `maxOrNull()`，以符合 Kotlin 集合 API 中使用的命名约定。函数名称中的 `*OrNull` 后缀表示如果接收集合为空，则返回 `null`。同样适用于 `minBy()`、`maxBy()`、`minWith()`、`maxWith()`——在 1.4 中，它们有 `*OrNull()` 同义词。
*   新的 `minOf()` 和 `maxOf()` 扩展函数返回给定选择器函数在集合项上的最小值和最大值。

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

    还有 `minOfWith()` 和 `maxOfWith()`，它们接受 `Comparator` 作为参数，以及所有四个函数的 `*OrNull()` 版本，它们在空集合上返回 `null`。

*   `flatMap` 和 `flatMapTo` 的新重载允许你使用返回类型与接收器类型不匹配的转换，即：
    *   在 `Iterable`、`Array` 和 `Map` 上转换为 `Sequence`
    *   在 `Sequence` 上转换为 `Iterable`

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

*   `removeFirst()` 和 `removeLast()` 快捷方式用于从可变列表中删除元素，以及这些函数的 `*orNull()` 对应函数。

#### 数组

为了在处理不同容器类型时提供一致的体验，我们还为**数组**添加了新函数：

*   `shuffle()` 将数组元素按随机顺序排列。
*   `onEach()` 对每个数组元素执行给定操作并返回数组本身。
*   `associateWith()` 和 `associateWithTo()` 以数组元素作为键构建映射。
*   `reverse()`（用于数组子范围）反转子范围中元素的顺序。
*   `sortDescending()`（用于数组子范围）按降序对子范围中的元素进行排序。
*   `sort()` 和 `sortWith()`（用于数组子范围）现在在通用库中可用。

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

此外，还有用于 `CharArray`/`ByteArray` 和 `String` 之间转换的新函数：
*   `ByteArray.decodeToString()` 和 `String.encodeToByteArray()`
*   `CharArray.concatToString()` 和 `String.toCharArray()`

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

我们还添加了 `ArrayDeque` 类——一个双端队列的实现。
双端队列允许你在队列的开头或结尾以摊销常数时间添加或删除元素。当你的代码中需要队列或堆栈时，你可以默认使用双端队列。

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

`ArrayDeque` 的实现底层使用了一个可变大小的数组：它将内容存储在循环缓冲区（一个 `Array`）中，并且只有当该 `Array` 满时才会调整其大小。

### 字符串操作函数

1.4.0 中的标准库包含多项字符串操作 API 的改进：

*   `StringBuilder` 具有有用的新扩展函数：`set()`、`setRange()`、`deleteAt()`、`deleteRange()`、`appendRange()` 等。

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

*   `StringBuilder` 的一些现有函数在通用库中可用。其中包括 `append()`、`insert()`、`substring()`、`setLength()` 等。
*   新函数 `Appendable.appendLine()` 和 `StringBuilder.appendLine()` 已添加到通用库中。它们取代了这些类仅限 JVM 的 `appendln()` 函数。

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

用于位操作的新函数：
*   `countOneBits()`
*   `countLeadingZeroBits()`
*   `countTrailingZeroBits()`
*   `takeHighestOneBit()`
*   `takeLowestOneBit()`
*   `rotateLeft()` 和 `rotateRight()` (实验性)

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

在 1.4.0 中，我们添加了新功能，以改善你在 Kotlin 中使用委托属性的体验：
-   现在一个属性可以委托给另一个属性。
-   一个新的接口 `PropertyDelegateProvider` 有助于在单个声明中创建委托提供者。
-   `ReadWriteProperty` 现在扩展了 `ReadOnlyProperty`，因此你可以将它们都用于只读属性。

除了新的 API，我们还进行了一些优化，减少了生成的字节码大小。这些优化在[这篇博客文章](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties)中进行了描述。

[了解更多关于委托属性的信息](delegated-properties.md)。

### 将 KType 转换为 Java Type

`stdlib` 中一个新的扩展属性 `KType.javaType`（目前为实验性）帮助你从 Kotlin 类型获取 `java.lang.reflect.Type`，而无需使用整个 `kotlin-reflect` 依赖项。

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

从 1.4.0 开始，我们已将 Kotlin 反射的 Proguard/R8 配置嵌入到 `kotlin-reflect.jar` 中。有了这个功能，大多数使用 R8 或 Proguard 的 Android 项目在使用 `kotlin-reflect` 时无需任何额外配置即可工作。你不再需要复制粘贴 `kotlin-reflect` 内部的 Proguard 规则。但请注意，你仍然需要显式列出所有你将要反射的 API。

### 改进现有 API

*   某些函数现在可以在 null 接收器上工作，例如：
    *   字符串上的 `toBoolean()`
    *   数组上的 `contentEquals()`、`contentHashcode()`、`contentToString()`

*   `Double` 和 `Float` 中的 `NaN`、`NEGATIVE_INFINITY` 和 `POSITIVE_INFINITY` 现在定义为 `const`，因此你可以将它们用作注解参数。

*   `Double` 和 `Float` 中的新常量 `SIZE_BITS` 和 `SIZE_BYTES` 包含用于以二进制形式表示类型实例的位数和字节数。

*   顶层函数 `maxOf()` 和 `minOf()` 可以接受可变数量的参数（`vararg`）。

### stdlib artifact 的 module-info 描述符

Kotlin 1.4.0 将 `module-info.java` 模块信息添加到默认的标准库 artifact 中。这使你可以将它们与 [jlink 工具](https://docs.oracle.com/en/java/javase/11/tools/jlink.html)一起使用，该工具会生成仅包含你的应用程序所需的平台模块的自定义 Java 运行时镜像。你以前已经可以使用 jlink 和 Kotlin 标准库 artifact，但你必须使用单独的 artifact——带有“modular”分类器的那些——而且整个设置并不简单。
在 Android 中，请确保你使用 Android Gradle 插件版本 3.2 或更高版本，它可以正确处理带有 `module-info` 的 jar 文件。

### 弃用

#### `Double` 和 `Float` 的 `toShort()` 和 `toByte()`

我们已弃用 `Double` 和 `Float` 上的 `toShort()` 和 `toByte()` 函数，因为它们可能因值范围狭窄和变量大小较小而导致意外结果。

要将浮点数转换为 `Byte` 或 `Short`，请使用两步转换：首先，将它们转换为 `Int`，然后再次将它们转换为目标类型。

#### 浮点数组上的 `contains()`、`indexOf()` 和 `lastIndexOf()`

我们已弃用 `FloatArray` 和 `DoubleArray` 的 `contains()`、`indexOf()` 和 `lastIndexOf()` 扩展函数，因为它们使用了 [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 标准相等性，这在某些特殊情况下与全序相等性相矛盾。详见[此问题](https://youtrack.jetbrains.com/issue/KT-28753)。

#### `min()` 和 `max()` 集合函数

我们已弃用 `min()` 和 `max()` 集合函数，转而使用 `minOrNull()` 和 `maxOrNull()`，后者更能准确地反映其行为——在空集合上返回 `null`。详见[此问题](https://youtrack.jetbrains.com/issue/KT-38854)。

### 排除已弃用的实验性协程

在 1.3.0 中，`kotlin.coroutines.experimental` API 已被弃用，转而使用 `kotlin.coroutines`。在 1.4.0 中，我们通过从标准库中移除 `kotlin.coroutines.experimental` 来完成其弃用周期。对于仍在 JVM 上使用它的用户，我们提供了兼容性 artifact `kotlin-coroutines-experimental-compat.jar`，其中包含所有实验性协程 API。我们已将其发布到 Maven，并将其与标准库一起包含在 Kotlin 分发中。

## 稳定的 JSON 序列化

随着 Kotlin 1.4.0 的发布，我们正在推出 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的第一个稳定版本——1.0.0-RC。现在我们很高兴地宣布 `kotlinx-serialization-core`（以前称为 `kotlinx-serialization-runtime`）中的 JSON 序列化 API 稳定。其他序列化格式的库仍然是实验性的，以及核心库的一些高级部分。

我们已对 JSON 序列化 API 进行了重大重构，使其更一致且更易于使用。从现在开始，我们将继续以向后兼容的方式开发 JSON 序列化 API。
但是，如果你使用过以前的版本，在迁移到 1.0.0-RC 时需要重写部分代码。为了帮助你解决此问题，我们还提供了**[Kotlin 序列化指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)**——`kotlinx.serialization` 的完整文档集。它将指导你使用最重要的功能，并帮助你解决可能遇到的任何问题。

>**注意**：`kotlinx-serialization` 1.0.0-RC 仅适用于 Kotlin 编译器 1.4。早期编译器版本不兼容。
>
{style="note"}

## 脚本和 REPL

在 1.4.0 中，Kotlin 中的脚本功能受益于多项功能和性能改进以及其他更新。以下是一些关键更改：

-   [新的依赖项解析 API](#new-dependencies-resolution-api)
-   [新的 REPL API](#new-repl-api)
-   [编译脚本缓存](#compiled-scripts-cache)
-   [artifact 重命名](#artifacts-renaming)

为了帮助你更熟悉 Kotlin 中的脚本功能，我们准备了一个[包含示例的项目](https://github.com/Kotlin/kotlin-script-examples)。它包含标准脚本（`*.main.kts`）的示例，以及 Kotlin 脚本 API 和自定义脚本定义的使用示例。请尝试一下，并使用我们的[问题追踪器](https://youtrack.jetbrains.com/issues/KT)分享你的反馈。

### 新的依赖项解析 API

在 1.4.0 中，我们引入了一个新的 API，用于解析外部依赖项（例如 Maven artifact），并提供了相应的实现。此 API 发布在新的 artifact `kotlin-scripting-dependencies` 和 `kotlin-scripting-dependencies-maven` 中。以前在 `kotlin-script-util` 库中的依赖项解析功能现已弃用。

### 新的 REPL API

新的实验性 REPL API 现在是 Kotlin 脚本 API 的一部分。已发布的 artifact 中也有其多种实现，其中一些具有高级功能，例如代码补全。我们在 [Kotlin Jupyter 内核](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/)中使用此 API，现在你可以在自己的自定义 shell 和 REPL 中尝试它。

### 编译脚本缓存

Kotlin 脚本 API 现在提供了实现编译脚本缓存的能力，显著加快了未更改脚本的后续执行速度。我们默认的高级脚本实现 `kotlin-main-kts` 已有自己的缓存。

### Artifact 重命名

为了避免 artifact 名称混淆，我们已将 `kotlin-scripting-jsr223-embeddable` 和 `kotlin-scripting-jvm-host-embeddable` 重命名为 `kotlin-scripting-jsr223` 和 `kotlin-scripting-jvm-host`。这些 artifact 依赖于 `kotlin-compiler-embeddable` artifact，后者对捆绑的第三方库进行着色以避免使用冲突。通过此次重命名，我们将 `kotlin-compiler-embeddable`（通常更安全）的使用设为脚本 artifact 的默认值。
如果出于某种原因，你需要依赖于未着色 `kotlin-compiler` 的 artifact，请使用带有 `-unshaded` 后缀的 artifact 版本，例如 `kotlin-scripting-jsr223-unshaded`。请注意，此重命名仅影响应直接使用的脚本 artifact；其他 artifact 的名称保持不变。

## 迁移到 Kotlin 1.4.0

Kotlin 插件的迁移工具可帮助你将项目从早期 Kotlin 版本迁移到 1.4.0。

只需将 Kotlin 版本更改为 `1.4.0`，然后重新导入你的 Gradle 或 Maven 项目。IDE 随后会询问你关于迁移的事宜。

如果你同意，它将运行迁移代码检查，检查你的代码并建议对任何不工作或在 1.4.0 中不推荐的代码进行更正。

![运行迁移](run-migration-wn.png){width=300}

代码检查具有不同的[严重级别](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html)，以帮助你决定接受哪些建议以及忽略哪些建议。

![迁移检查](migration-inspection-wn.png)

Kotlin 1.4.0 是一个[功能版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能会带来语言上的不兼容更改。在**[Kotlin 1.4 兼容性指南](compatibility-guide-14.md)**中查找此类更改的详细列表。