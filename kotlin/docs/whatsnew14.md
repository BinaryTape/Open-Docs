---
title: "Kotlin 1.4.0 中的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布时间：2020 年 8 月 17 日](releases#release-details)_

在 Kotlin 1.4.0 中，我们在其所有组件中都进行了一些改进，[重点关注质量和性能](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)。
下面你将找到 Kotlin 1.4.0 中最重要的更改列表。

## 语言特性和改进

Kotlin 1.4.0 附带了各种不同的语言特性和改进，包括：

* [Kotlin 接口的 SAM 转换](#sam-conversions-for-kotlin-interfaces)
* [库作者的显式 API 模式](#explicit-api-mode-for-library-authors)
* [混合命名参数和位置参数](#mixing-named-and-positional-arguments)
* [尾随逗号](#trailing-comma)
* [可调用引用改进](#callable-reference-improvements)
* [在循环中包含的 when 表达式内部使用 break 和 continue](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin 接口的 SAM 转换

在 Kotlin 1.4.0 之前，你只能在 [从 Kotlin 使用 Java 方法和 Java 接口时](java-interop#sam-conversions) 应用 SAM (Single Abstract Method，单抽象方法) 转换。从现在开始，你也可以将 SAM 转换用于 Kotlin 接口。为此，请使用 `fun` 修饰符将 Kotlin 接口显式标记为 functional（函数式）接口。

当你将 lambda 表达式作为参数传递时，如果期望一个只有一个抽象方法的接口作为参数，则应用 SAM 转换。在这种情况下，编译器会自动将 lambda 表达式转换为实现该抽象成员函数的类的实例。

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() { 
    println("Is 7 even? - ${isEven.accept(7)}")
}
```

[了解更多关于 Kotlin 函数式接口和 SAM 转换的信息](fun-interfaces)。

### 库作者的显式 API 模式

Kotlin 编译器为库作者提供 _explicit API mode（显式 API 模式）_。在此模式下，编译器执行额外的检查，以帮助使库的 API 更清晰、更一致。它为暴露给库的公共 API 的声明添加了以下要求：

* 如果默认可见性将声明暴露给公共 API，则声明需要可见性修饰符。
  这有助于确保不会无意中将任何声明暴露给公共 API。
* 暴露给公共 API 的属性和函数需要显式类型规范。
  这保证了 API 用户了解他们使用的 API 成员的类型。

根据你的配置，这些显式 API 可能会产生错误（_strict（严格）_ 模式）或警告（_warning（警告）_ 模式）。
为了可读性和常识，某些类型的声明被排除在这些检查之外：

* primary constructors（主构造函数）
* data class（数据类）的属性
* 属性的 getter 和 setter
* `override` 方法

显式 API 模式仅分析模块的生产源代码。

要在显式 API 模式下编译你的模块，请将以下行添加到你的 Gradle 构建脚本：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

使用命令行编译器时，通过添加 `-Xexplicit-api` 编译器选项，并将值设置为 `strict` 或 `warning` 来切换到显式 API 模式。

```bash
-Xexplicit-api=\{strict|warning\}
```

[在 KEEP 中查找有关显式 API 模式的更多详细信息](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode)。

### 混合命名参数和位置参数

在 Kotlin 1.3 中，当你使用 [命名参数](functions#named-arguments) 调用函数时，你必须将所有没有名称的参数（位置参数）放在第一个命名参数之前。例如，你可以调用 `f(1, y = 2)`，但你不能调用 `f(x = 1, 2)`。

当所有参数都在其正确位置，但你想要为中间的一个参数指定名称时，这真的很烦人。
对于绝对清楚布尔值或 `null` 值属于哪个属性来说，这尤其有帮助。

在 Kotlin 1.4 中，没有这样的限制了 – 你现在可以为一组位置参数中间的参数指定名称。
此外，你可以随意混合位置参数和命名参数，只要它们保持正确的顺序即可。

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

使用 Kotlin 1.4，你现在可以在枚举中添加尾随逗号，例如参数和参数列表、`when` 条目以及解构声明的组件。
使用尾随逗号，你可以添加新项目并更改其顺序，而无需添加或删除逗号。

如果你使用多行语法表示参数或值，这将特别有用。添加尾随逗号后，你可以轻松地交换带有参数或值的行。

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

Kotlin 1.4 支持更多使用 callable references（可调用引用）的情况：

* 引用具有默认参数值的函数
* `Unit`-returning（返回 `Unit`）函数中的函数引用
* 基于函数中参数数量进行适配的引用
* 可调用引用上的 suspend 转换

#### 引用具有默认参数值的函数

现在你可以使用可调用引用来引用具有默认参数值的函数。如果对函数 `foo` 的可调用引用不带参数，则使用默认值 `0`。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () `->` String): String = func()

fun main() {
    println(apply(::foo))
}
```

以前，你必须为函数 `apply` 编写额外的重载才能使用默认参数值。

```kotlin
// some new overload
fun applyInt(func: (Int) `->` String): String = func(0) 
```

#### `Unit`-returning 函数中的函数引用

在 Kotlin 1.4 中，你可以在 `Unit`-returning 函数中使用对返回任何类型的函数的 callable references（可调用引用）。
在 Kotlin 1.4 之前，你只能在这种情况下使用 lambda 参数。现在你可以同时使用 lambda 参数和可调用引用。

```kotlin
fun foo(f: () `->` Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

#### 基于函数中参数数量进行适配的引用

现在，当传递 variable number of arguments (`vararg`，可变数量的参数) 时，你可以适配对函数的 callable references（可调用引用）。
你可以在传递的参数列表末尾传递任意数量的相同类型的参数。

```kotlin
fun foo(x: Int, vararg y: String) {}

fun use0(f: (Int) `->` Unit) {}
fun use1(f: (Int, String) `->` Unit) {}
fun use2(f: (Int, String, String) `->` Unit) {}

fun test() {
    use0(::foo) 
    use1(::foo) 
    use2(::foo) 
}
```

#### 可调用引用上的 suspend 转换

除了 lambda 表达式上的 suspend 转换之外，从 1.4.0 版本开始，Kotlin 现在还支持 callable references（可调用引用）上的 suspend 转换。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () `->` Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

### 在循环中包含的 when 表达式内部使用 break 和 continue

在 Kotlin 1.3 中，你不能在循环中包含的 `when` 表达式内部使用 unqualified（非限定的）`break` 和 `continue`。原因是这些关键字保留用于 `when` 表达式中可能的 [fall-through behavior（穿透行为）](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)。

这就是为什么如果你想在循环中的 `when` 表达式内部使用 `break` 和 `continue`，你必须 [label（标记）](returns#break-and-continue-labels) 它们，这变得相当麻烦。

```kotlin
fun test(xs: List<Int>) {
    LOOP@for (x in xs) {
        when (x) {
            2 `->` continue@LOOP
            17 `->` break@LOOP
            else `->` println(x)
        }
    }
}
```

在 Kotlin 1.4 中，你可以在循环中包含的 `when` 表达式内部使用没有标签的 `break` 和 `continue`。它们的行为符合预期，即终止最近的封闭循环或继续执行下一步。

```kotlin
fun test(xs: List<Int>) {
    for (x in xs) {
        when (x) {
            2 `->` continue
            17 `->` break
            else `->` println(x)
        }
    }
}
```

`when` 内部的 fall-through behavior（穿透行为）有待进一步设计。

## IDE 中的新工具

使用 Kotlin 1.4，你可以在 IntelliJ IDEA 中使用新工具来简化 Kotlin 开发：

* [新的灵活项目向导](#new-flexible-project-wizard)
* [协程调试器](#coroutine-debugger)

### 新的灵活项目向导

使用灵活的全新 Kotlin Project Wizard（Kotlin 项目向导），你可以轻松创建和配置不同类型的 Kotlin
项目，包括多平台项目，如果没有 UI，这些项目可能难以配置。

<img src="/img/multiplatform-project-1-wn.png" alt="Kotlin Project Wizard – Multiplatform project" style={{verticalAlign: 'middle'}}/>

新的 Kotlin 项目向导既简单又灵活：

1. *选择项目模板*，具体取决于你想要做什么。将来会添加更多模板。
2. *选择构建系统* – Gradle (Kotlin 或 Groovy DSL)、Maven 或 IntelliJ IDEA。
   Kotlin 项目向导只会显示所选项目模板支持的构建系统。
3. *直接在主屏幕上预览项目结构*。

然后你可以完成创建项目，或者选择在下一个屏幕上 *配置项目*：

4. *添加/删除此项目模板支持的模块和目标*。
5. *配置模块和目标设置*，例如，目标 JVM 版本、目标模板和测试框架。

<img src="/img/multiplatform-project-2-wn.png" alt="Kotlin Project Wizard - Configure targets" style={{verticalAlign: 'middle'}}/>

将来，我们将通过添加更多配置选项和模板，使 Kotlin 项目向导更加灵活。

你可以通过完成以下教程来试用新的 Kotlin 项目向导：

* [创建基于 Kotlin/JVM 的控制台应用程序](jvm-get-started)
* [为 React 创建 Kotlin/JS 应用程序](js-react)
* [创建 Kotlin/Native 应用程序](native-get-started)

### 协程调试器

许多人已经使用 [coroutines（协程）](coroutines-guide) 进行异步编程。
但是当涉及到调试时，在 Kotlin 1.4 之前使用协程可能真的很痛苦。由于协程在线程之间跳转，
因此很难理解特定协程在做什么并检查其上下文。在某些情况下，通过断点跟踪步骤根本不起作用。因此，你必须依靠日志记录或脑力劳动来调试使用协程的代码。

在 Kotlin 1.4 中，使用 Kotlin 插件附带的新功能，调试协程现在更加方便。

:::note
调试适用于 `kotlinx-coroutines-core` 的 1.3.8 或更高版本。

:::

**Debug Tool Window（调试工具窗口）** 现在包含一个新的 **Coroutines（协程）** 选项卡。在此选项卡中，你可以找到有关当前
正在运行和挂起的协程的信息。协程按它们运行的调度程序分组。

<img src="/img/coroutine-debugger-wn.png" alt="Debugging coroutines" style={{verticalAlign: 'middle'}}/>

现在你可以：
* 轻松检查每个协程的状态。
* 查看正在运行和挂起的协程的本地变量和捕获变量的值。
* 查看完整的协程创建堆栈，以及协程内部的调用堆栈。堆栈包括所有带有
变量值的帧，即使这些帧在标准调试期间会丢失。

如果你需要一份包含每个协程及其堆栈状态的完整报告，请在 **Coroutines（协程）** 选项卡中单击鼠标右键，然后
单击 **Get Coroutines Dump（获取协程转储）**。目前，协程转储相当简单，但我们将在未来版本的 Kotlin 中使其更具可读性
和帮助性。

<img src="/img/coroutines-dump-wn.png" alt="Coroutines Dump" style={{verticalAlign: 'middle'}}/>

在 [这篇博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/)
和 [IntelliJ IDEA 文档](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html) 中了解更多关于调试协程的信息。

## 新编译器

新的 Kotlin 编译器将非常快；它将统一所有支持的平台，并为编译器扩展提供
API。这是一个长期项目，我们已经在 Kotlin 1.4.0 中完成了几个步骤：

* [默认启用新的、更强大的类型推断算法](#new-more-powerful-type-inference-algorithm)。
* [新的 JVM 和 JS IR 后端](#unified-backends-and-extensibility)。一旦我们稳定它们，它们将成为默认后端。

### 新的、更强大的类型推断算法

Kotlin 1.4 使用一种新的、更强大的类型推断算法。这个新算法已经可以在
Kotlin 1.3 中通过指定编译器选项来尝试，现在默认使用它。你可以在
[YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20) 中找到新算法中修复的完整问题列表。
在这里你可以找到一些最值得注意的改进：

* [更多自动推断类型的情况](#more-cases-where-type-is-inferred-automatically)
* [lambda 表达式的最后一个表达式的智能类型转换](#smart-casts-for-a-lambda-s-last-expression)
* [可调用引用的智能类型转换](#smart-casts-for-callable-references)
* [对委托属性更好的推断](#better-inference-for-delegated-properties)
* [具有不同参数的 Java 接口的 SAM 转换](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Kotlin 中的 Java SAM 接口](#java-sam-interfaces-in-kotlin)

#### 更多自动推断类型的情况

新的推断算法可以推断出许多旧算法需要你显式指定类型的情况。
例如，在下面的例子中，lambda 表达式参数 `it` 的类型被正确地推断为 `String?`：

```kotlin

val rulesMap: Map<String, (String?) `->` Boolean> = mapOf(
    "weak" to { it != null },
    "medium" to { !it.isNullOrBlank() },
    "strong" to { it != null && "^[a-zA-Z0-9]+$".toRegex().matches(it) }
)

fun main() {
    println(rulesMap.getValue("weak")("abc!"))
    println(rulesMap.getValue("strong")("abc"))
    println(rulesMap.getValue("strong")("abc!"))
}
```

在 Kotlin 1.3 中，你需要引入一个显式的 lambda 表达式参数，或者用带有
显式泛型参数的 `Pair` 构造函数替换 `to`，才能使它工作。

#### lambda 表达式的最后一个表达式的智能类型转换

在 Kotlin 1.3 中，除非你指定了期望的类型，否则 lambda 表达式中的最后一个表达式不会进行智能类型转换。因此，在
以下示例中，Kotlin 1.3 推断 `String?` 作为 `result` 变量的类型：

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

在 Kotlin 1.4 中，由于新的推断算法，lambda 表达式中的最后一个表达式会进行智能类型转换，并且这个新的、
更精确的类型用于推断最终的 lambda 表达式类型。因此，`result` 变量的类型变为 `String`。

在 Kotlin 1.3 中，你经常需要添加显式类型转换（`!!` 或像 `as String` 这样的类型转换）才能使这些情况工作，
现在这些类型转换变得不必要了。

#### 可调用引用的智能类型转换

在 Kotlin 1.3 中，你无法访问智能类型转换类型的成员引用。现在在 Kotlin 1.4 中你可以：

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

fun perform(animal: Animal) {
    val kFunction: KFunction<*> = when (animal) {
        is Cat `->` animal::meow
        is Dog `->` animal::woof
    }
    kFunction.call()
}

fun main() {
    perform(Cat())
}
```

在将 animal 变量智能类型转换为特定类型 `Cat` 和 `Dog` 之后，你可以使用不同的成员引用 `animal::meow` 和 `animal::woof`。
在类型检查之后，你可以访问与子类型对应的成员引用。

#### 对委托属性更好的推断

在分析 `by` 关键字后面的 delegate（委托）表达式时，没有考虑 delegated property（委托属性）的类型。
例如，以下代码之前无法编译，但现在编译器可以正确地推断出
`old` 和 `new` 参数的类型为 `String?`：

```kotlin
import kotlin.properties.Delegates

fun main() {
    var prop: String? by Delegates.observable(null) { p, old, new `->`
        println("$old → $new")
    }
    prop = "abc"
    prop = "xyz"
}
```

#### 具有不同参数的 Java 接口的 SAM 转换

从一开始，Kotlin 就支持 Java 接口的 SAM 转换，但有一种情况不受支持，
这在处理现有的 Java 库时有时会很烦人。如果你调用一个将两个 SAM 接口
作为参数的 Java 方法，则两个参数都需要是 lambda 表达式或常规对象。你不能将一个参数作为 lambda 表达式传递，
而将另一个参数作为对象传递。

新的算法修复了这个问题，你可以在任何情况下传递 lambda 表达式来代替 SAM 接口，
这是你自然期望它工作的方式。

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

在 Kotlin 1.4 中，你可以在 Kotlin 中使用 Java SAM 接口，并将 SAM 转换应用于它们。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

在 Kotlin 1.3 中，你必须在 Java 代码中声明上面的 `foo` 函数才能执行 SAM 转换。

### 统一后端和可扩展性

在 Kotlin 中，我们有三个后端可以生成可执行文件：Kotlin/JVM、Kotlin/JS 和 Kotlin/Native。Kotlin/JVM 和 Kotlin/JS
没有共享太多代码，因为它们是彼此独立开发的。Kotlin/Native 基于围绕 Kotlin 代码的 intermediate representation (IR，中间表示) 构建的
新基础设施。

我们现在正在将 Kotlin/JVM 和 Kotlin/JS 迁移到相同的 IR。因此，所有三个后端
共享大量的逻辑，并具有统一的 pipeline（管道）。这允许我们只为所有平台实现大多数功能、优化和错误修复一次。两个新的基于 IR 的后端都处于 [Alpha](components-stability) 阶段。

一个通用的后端基础设施也为多平台编译器扩展打开了大门。你将能够插入
到 pipeline（管道）中，并添加自定义处理和转换，这些处理和转换将自动适用于所有平台。

我们鼓励你使用我们的新 [JVM IR](#new-jvm-ir-backend) 和 [JS IR](#new-js-ir-backend) 后端，它们目前处于 Alpha 阶段，并
与我们分享你的反馈。

## Kotlin/JVM

Kotlin 1.4.0 包括许多 JVM 特有的改进，例如：
 
* [新的 JVM IR 后端](#new-jvm-ir-backend)
* [生成默认方法的新模式](#new-modes-for-generating-default-methods)
* [用于空值检查的统一异常类型](#unified-exception-type-for-null-checks)
* [JVM 字节码中的类型注解](#type-annotations-in-the-jvm-bytecode)

### 新的 JVM IR 后端

与 Kotlin/JS 一样，我们正在将 Kotlin/JVM 迁移到 [unified IR backend（统一 IR 后端）](#unified-backends-and-extensibility)，
这允许我们为所有平台实现大多数功能和错误修复一次。你还可以通过创建适用于所有平台的多平台扩展来从中受益。

Kotlin 1.4.0 尚未提供此类扩展的公共 API，但我们正在与我们的合作伙伴紧密合作，
包括 [Jetpack Compose](https://developer.android.com/jetpack/compose)，他们已经在使用我们的新后端构建他们的编译器插件。

我们鼓励你试用新的 Kotlin/JVM 后端，它目前处于 Alpha 阶段，并将任何问题和功能请求提交到我们的 [issue tracker（问题跟踪器）](https://youtrack.jetbrains.com/issues/KT)。
这将帮助我们统一编译器 pipeline（管道），并将像 Jetpack Compose 这样的编译器扩展更快地带给 Kotlin 社区。

要启用新的 JVM IR 后端，请在你的 Gradle 构建脚本中指定一个额外的编译器选项：

```kotlin
kotlinOptions.useIR = true
```

:::note
如果 [启用 Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en)，你将自动
选择加入新的 JVM 后端，而无需在 `kotlinOptions` 中指定编译器选项。

:::

使用命令行编译器时，添加编译器选项 `-Xuse-ir`。

:::note
只有在你启用了新的后端时，你才能使用由新的 JVM IR 后端编译的代码。否则，你将收到错误。
考虑到这一点，我们不建议库作者在生产环境中切换到新的后端。

:::

### 生成默认方法的新模式

当将 Kotlin 代码编译到目标 JVM 1.8 及更高版本时，你可以将 Kotlin 接口的非抽象方法编译为
Java 的 `default` 方法。为此，有一种机制包括使用 `@JvmDefault` 注解来标记
这些方法，以及使用 `-Xjvm-default` 编译器选项来启用对此注解的处理。

在 1.4.0 中，我们添加了一种生成默认方法的新模式：`-Xjvm-default=all` 将 Kotlin
接口的*所有*非抽象方法编译为 `default` Java 方法。为了与使用在没有 `default` 的情况下编译的接口的代码兼容，
我们还添加了 `all-compatibility` 模式。

有关 Java 互操作中默认方法的更多信息，请参阅 [互操作性文档](java-to-kotlin-interop#default-methods-in-interfaces) 和
[这篇博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 用于空值检查的统一异常类型

从 Kotlin 1.4.0 开始，所有运行时空值检查都将抛出 `java.lang.NullPointerException`，而不是 `KotlinNullPointerException`、
`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`。这适用于：`!!` 运算符、方法 preamble（序言）中的参数空值检查、平台类型表达式空值检查，以及带有 non-nullable（不可为空的）类型的 `as` 运算符。
这不适用于 `lateinit` 空值检查和显式库函数调用，如 `checkNotNull` 或 `requireNotNull`。

此更改增加了 Kotlin 编译器或各种字节码处理工具（如 Android [R8 optimizer（R8 优化器）](https://developer.android.com/studio/build/shrink-code)）可以执行的可能的空值检查优化的数量。

请注意，从开发人员的角度来看，事情不会发生太大变化：Kotlin 代码将抛出异常，并带有与之前相同的
错误消息。异常的类型会发生变化，但传递的信息保持不变。

### JVM 字节码中的类型注解

Kotlin 现在可以在 JVM 字节码（目标版本 1.8+）中生成类型注解，以便它们在运行时在 Java 反射中可用。
要在字节码中发出类型注解，请按照以下步骤操作：

1. 确保你声明的注解具有正确的注解目标（Java 的 `ElementType.TYPE_USE` 或 Kotlin 的
   `AnnotationTarget.TYPE`）和保留策略 (`AnnotationRetention.RUNTIME`)。
2. 将注解类声明编译为 JVM 字节码目标版本 1.8+。你可以使用 `-jvm-target=1.8` 指定它
   编译器选项。
3. 将使用该注解的代码编译为 JVM 字节码目标版本 1.8+ (`-jvm-target=1.8`) 并添加
   `-Xemit-jvm-type-annotations` 编译器选项。

请注意，目前标准库中的类型注解不会在字节码中发出，因为标准库是用目标版本 1.6 编译的。

到目前为止，只支持基本情况：

- 方法参数、方法返回类型和属性类型上的类型注解；
- 类型参数的不变投影，例如 `Smth<@Ann Foo>`、`Array<@Ann Foo>`。

在下面的例子中，`String` 类型上的 `@Foo` 注解可以被发出到字节码中，然后被
库代码使用：

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

`kotlin.js` Gradle 插件附带了一个调整后的 Gradle DSL，它提供了一些新的配置选项，并且与 `kotlin-multiplatform` 插件使用的 DSL 更紧密地对齐。一些影响最大的变化包括：

- 通过 `binaries.executable()` 显式切换可执行文件的创建。在此处阅读有关 [执行 Kotlin/JS 及其环境的更多信息](js-project-setup#execution-environments)。
- 通过 `cssSupport` 从 Gradle 配置中配置 webpack 的 CSS 和 style loaders（样式加载器）。在此处阅读有关 [使用 CSS 和 style loaders（样式加载器）的更多信息](js-project-setup#css)。
- 改进了对 npm 依赖项的管理，具有强制版本号或 [semver](https://docs.npmjs.com/about-semantic-versioning) 版本范围，以及使用 `devNpm`、`optionalNpm` 和 `peerNpm` 对 _development（开发）_、_peer（对等）_ 和 _optional（可选）_ npm 依赖项的支持。[在此处直接从 Gradle 阅读有关 npm 包依赖项管理的更多信息](js-project-setup#npm-dependencies)。
- 加强了对 [Dukat](https://github.com/Kotlin/dukat)（Kotlin 外部声明的生成器）的集成。外部声明现在可以在构建时生成，也可以通过 Gradle 任务手动生成。

### 新的 JS IR 后端

[用于 Kotlin/JS 的 IR 后端](js-ir-compiler)（目前具有 [Alpha](components-stability) 稳定性）提供了一些特定于 Kotlin/JS 目标的新功能，这些功能主要集中在通过 dead code elimination（无用代码消除）来减少生成的代码大小，以及改进与 JavaScript 和 TypeScript 的互操作性等等。

要启用 Kotlin/JS IR 后端，请在你的 `gradle.properties` 中设置键 `kotlin.js.compiler=ir`，或者将 `IR` 编译器类型传递给你的 Gradle 构建脚本的 `js` 函数：

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

有关如何配置新后端的更多详细信息，请查看 [Kotlin/JS IR 编译器文档](js-ir-compiler)。

通过新的 [@JsExport](js-to-kotlin-interop#jsexport-annotation) 注解和 **[从 Kotlin 代码生成 TypeScript definitions（TypeScript 定义）](js-ir-compiler#preview-generation-of-typescript-declaration-files-d-ts)** 的能力，Kotlin/JS IR 编译器后端改进了 JavaScript 和 TypeScript 互操作性。这还使得将 Kotlin/JS 代码与现有工具集成、创建 **hybrid applications（混合应用程序）** 以及在多平台项目中利用代码共享功能变得更加容易。

[了解更多关于 Kotlin/JS IR 编译器后端中可用的功能](js-ir-compiler)。

## Kotlin/Native

在 1.4.0 中，Kotlin/Native 获得了大量新功能和改进，包括：

* [在 Swift 和 Objective-C 中支持 Kotlin 的 suspending function（挂起函数）](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [默认情况下支持 Objective-C 泛型](#objective-c-generics-support-by-default)
* [Objective-C/Swift 互操作中的异常处理](#exception-handling-in-objective-c-swift-interop)
* [默认情况下在 Apple 目标上生成 release .dSYM 文件](#generate-release-dsyms-on-apple-targets-by-default)
* [性能改进](#performance-improvements)
* [简化了 CocoaPods 依赖项的管理](#simplified-management-of-cocoapods-dependencies)

### 在 Swift 和 Objective-C 中支持 Kotlin 的 suspending function（挂起函数）

在 1.4.0 中，我们添加了对 Swift 和 Objective-C 中 suspending function（挂起函数）的基本支持。现在，当你将 Kotlin 模块
编译为 Apple framework（Apple 框架）时，挂起函数可以在其中作为带有回调的函数使用（在 Swift/Objective-C 术语中为 `completionHandler`）。当你在生成的框架的 header（头文件）中包含这样的函数时，你可以从你的 Swift 或 Objective-C 代码中调用它们，甚至可以覆盖它们。

例如，如果你编写了以下 Kotlin 函数：

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

[了解更多关于在 Swift 和 Objective-C 中使用 suspending function（挂起函数）的信息](native-objc-interop)。

### 默认情况下支持 Objective-C 泛型

以前版本的 Kotlin 提供了对 Objective-C 互操作中泛型的实验性支持。从 1.4.0 开始，Kotlin/Native
默认情况下使用来自 Kotlin 代码的泛型生成 Apple framework（Apple 框架）。在某些情况下，这可能会破坏现有的 Objective-C
或 Swift 代码，从而调用 Kotlin 框架。要使框架 header（头文件）在没有泛型的情况下编写，请添加 `-Xno-objc-generics` 编译器选项。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

请注意，[与 Objective-C 互操作性文档](native-objc-interop#generics) 中列出的所有细节和限制仍然有效。

### Objective-C/Swift 互操作中的异常处理

在 1.4.0 中，我们稍微更改了从 Kotlin 生成的 Swift API，即关于异常的转换方式。Kotlin 和 Swift 之间的错误处理存在根本差异。所有 Kotlin 异常都是 unchecked（未经检查的），而 Swift 只有 checked（已检查的）错误。因此，为了使 Swift 代码意识到预期的异常，Kotlin 函数应该用 `@Throws`
注解标记，该注解指定了潜在异常类的列表。

当编译为 Swift 或 Objective-C framework（Objective-C 框架）时，具有或继承 `@Throws` 注解的函数表示为
Objective-C 中的 `NSError*`-producing 方法，以及 Swift 中的 `throws` 方法。

以前，除了 `RuntimeException` 和 `Error` 之外的任何异常都作为 `NSError` 传播。现在这种行为发生了变化：
现在仅针对作为 `@Throws` 注解的参数指定的类（或其子类）的实例的异常抛出 `NSError`。到达 Swift/Objective-C 的其他 Kotlin 异常被认为未处理，并导致程序终止。

### 默认情况下在 Apple 目标上生成 release .dSYM 文件

从 1.4.0 开始，Kotlin/Native 编译器默认在 Darwin 平台上为 release binaries（发布二进制文件）生成 [debug symbol files（调试符号文件）](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information)
(`.dSYM`s)。可以使用 `-Xadd-light-debug=disable`