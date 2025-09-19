[//]: # (title: Kotlin 1.4.0 的新特性)

_[发布日期：2020 年 8 月 17 日](releases.md#release-details)_

在 Kotlin 1.4.0 中，我们对所有组件进行了一系列改进，[专注于质量和性能](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)。
下面你将找到 Kotlin 1.4.0 中最重要的变更列表。

## 语言特性和改进

Kotlin 1.4.0 带来了各种不同的语言特性和改进。它们包括：

* [Kotlin 接口的 SAM 转换](#sam-conversions-for-kotlin-interfaces)
* [库作者的显式 API 模式](#explicit-api-mode-for-library-authors)
* [混合使用命名实参和位置实参](#mixing-named-and-positional-arguments)
* [尾部逗号](#trailing-comma)
* [可调用引用改进](#callable-reference-improvements)
* [在循环中包含的 when 表达式中使用 break 和 continue](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin 接口的 SAM 转换

在 Kotlin 1.4.0 之前，你只能在 [Kotlin 中使用 Java 方法和 Java 接口时](java-interop.md#sam-conversions) 应用 SAM（单一抽象方法）转换。从现在开始，你也可以将 SAM 转换用于 Kotlin 接口。
为此，请使用 `fun` 修饰符将 Kotlin 接口显式标记为函数式接口。

当需要一个仅包含一个单一抽象方法的接口作为形参时，传入一个 lambda 表达式作为实参，此时 SAM 转换即可应用。在这种情况下，编译器会自动将该 lambda 表达式转换为实现该抽象成员函数的类实例。

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

### 库作者的显式 API 模式

Kotlin 编译器为库作者提供了_显式 API 模式_。在此模式下，编译器执行额外的检测，有助于使库的 API 更清晰、更一致。它对暴露到库公共 API 的声明添加以下要求：

* 如果声明的默认可见性将其暴露给公共 API，则需要为其指定可见性修饰符。这有助于确保没有声明被无意中暴露到公共 API。
* 对于暴露到公共 API 的属性和函数，需要显式指定类型。这保证了 API 用户清楚他们所使用的 API 成员的类型。

根据你的配置，这些显式 API 可以产生错误（_严格_模式）或警告（_警告_模式）。出于可读性和常识的考虑，某些类型的声明被排除在此类检测之外：

* 主构造函数
* 数据类的属性
* 属性 getter 和 setter
* `override` 方法

显式 API 模式仅分析模块的生产源代码。

要在显式 API 模式下编译你的模块，请将以下行添加到你的 Gradle 构建脚本中：

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

当使用命令行编译器时，通过添加 `-Xexplicit-api` 编译器选项并将其值设置为 `strict` 或 `warning` 来切换到显式 API 模式。

```bash
-Xexplicit-api={strict|warning}
```

[在 KEEP 中查找更多关于显式 API 模式的详细信息](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md)。 

### 混合使用命名实参和位置实参

在 Kotlin 1.3 中，当你使用 [命名实参](functions.md#named-arguments) 调用函数时，你必须将所有未命名的实参（位置实参）放在第一个命名实参之前。例如，你可以调用 `f(1, y = 2)`，但不能调用 `f(x = 1, 2)`。

当所有实参都处于正确位置，但你想要为中间的一个实参指定名称时，这真的很令人烦恼。这对于明确布尔值或 `null` 值属于哪个属性特别有用。

在 Kotlin 1.4 中，没有这样的限制——你现在可以在一组位置实参中间为实参指定名称。此外，你可以随意混合位置实参和命名实参，只要它们保持正确的顺序。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

//中间带有命名实参的函数调用
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 尾部逗号

使用 Kotlin 1.4，你现在可以在枚举中添加尾部逗号，例如实参和形参列表、`when` 条目以及解构声明的组件。
通过尾部逗号，你可以添加新项或更改其顺序，而无需添加或删除逗号。

如果你使用多行语法来定义形参或值，这会特别有用。添加尾部逗号后，你可以轻松交换形参或值的行。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', //尾部逗号
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", //尾部逗号
)
```

### 可调用引用改进

Kotlin 1.4 支持更多使用可调用引用的情况：

* 对包含默认值形参的函数的引用
* 在返回 `Unit` 的函数中的函数引用
* 根据函数中实参数量进行调整的引用
* 可调用引用上的挂起转换

#### 对包含默认值形参的函数的引用

现在你可以使用可调用引用指向包含默认值形参的函数。如果函数 `foo` 的可调用引用不带任何实参，则使用默认值 `0`。

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
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### 在返回 Unit 的函数中的函数引用

在 Kotlin 1.4 中，你可以在返回 `Unit` 的函数中，使用可调用引用指向返回任何类型的函数。在 Kotlin 1.4 之前，在这种情况下你只能使用 lambda 实参。现在你可以同时使用 lambda 实参和可调用引用。

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // 这是 1.4 之前唯一的方法
    foo(::returnsInt) // 从 1.4 开始，这也能工作
}
```

#### 根据函数中实参数量进行调整的引用

现在，在传递可变数量实参 (`vararg`) 时，你可以调整函数的可调用引用。在传递的实参 list 末尾，可以传递任意数量的同类型形参。

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

除了 lambda 表达式上的挂起转换之外，Kotlin 从 1.4.0 版本开始还支持可调用引用上的挂起转换。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // 1.4 之前可行
    takeSuspend(::call) // 在 Kotlin 1.4 中，这也能工作
}
```

### 在循环中包含的 when 表达式中使用 break 和 continue

在 Kotlin 1.3 中，你不能在循环中包含的 `when` 表达式中使用未限定的 `break` 和 `continue`。原因是这些关键字被保留用于 `when` 表达式中可能的 [贯穿行为](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)。

因此，如果你想在循环中包含的 `when` 表达式中使用 `break` 和 `continue`，你必须为它们 [加标签](returns.md#break-and-continue-labels)，这变得相当麻烦。

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

在 Kotlin 1.4 中，你可以在循环中包含的 `when` 表达式内部无需标签即可使用 `break` 和 `continue`。它们将按预期行为终止最近的封闭循环或进入其下一步。

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

`when` 内部的贯穿行为有待进一步设计。

## IDE 中的新工具

使用 Kotlin 1.4，你可以使用 IntelliJ IDEA 中的新工具来简化 Kotlin 开发：

* [灵活的新项目向导](#new-flexible-project-wizard)
* [协程调试器](#coroutine-debugger)

### 灵活的新项目向导

通过灵活的新 Kotlin 项目向导，你可以轻松创建和配置不同类型的 Kotlin 项目，包括多平台项目，这些项目在没有 UI 的情况下可能难以配置。

![Kotlin 项目向导 – 多平台项目](multiplatform-project-1-wn.png)

新的 Kotlin 项目向导既简单又灵活：

1. *选择项目模板*，具体取决于你想要做什么。未来将添加更多模板。
2. *选择构建系统* – Gradle (Kotlin 或 Groovy DSL)、Maven 或 IntelliJ IDEA。
   Kotlin 项目向导将只显示所选项目模板支持的构建系统。
3. *直接在主屏幕上预览项目结构*。

然后，你可以完成项目创建，或者选择性地，在下一屏幕*配置项目*：

4. *添加/移除*此项目模板支持的模块和目标。
5. *配置模块和目标设置*，例如目标 JVM 版本、目标模板和测试框架。

![Kotlin 项目向导 - 配置目标](multiplatform-project-2-wn.png)

未来，我们将通过添加更多配置选项和模板，使 Kotlin 项目向导更加灵活。

你可以通过以下教程试用新的 Kotlin 项目向导：

* [创建基于 Kotlin/JVM 的控制台应用程序](jvm-get-started.md)
* [为 React 创建 Kotlin/JS 应用程序](js-react.md)
* [创建 Kotlin/Native 应用程序](native-get-started.md)

### 协程调试器

许多人已经使用[协程](coroutines-guide.md)进行异步编程。
但就调试而言，在 Kotlin 1.4 之前，处理协程可能是一个真正的难题。由于协程在线程之间跳转，因此很难理解特定协程在做什么并检测其上下文。在某些情况下，在断点处跟踪步骤根本不起作用。结果，你不得不依赖日志记录或心智努力来调试使用协程的代码。

在 Kotlin 1.4 中，由于 Kotlin 插件附带的新功能，调试协程现在方便得多。

> 调试适用于 `kotlinx-coroutines-core` 的 1.3.8 或更高版本。
>
{style="note"}

**调试工具窗口**现在包含一个新的 **Coroutines** 标签页。在此标签页中，你可以找到有关当前运行和挂起协程的信息。协程按其运行的调度器分组。

![调试协程](coroutine-debugger-wn.png)

现在你可以：
* 轻松检测每个协程的状态。
* 查看运行中和挂起协程的局部变量和捕获变量的值。
* 查看完整的协程创建堆栈以及协程内部的调用堆栈。堆栈包含所有带有变量值的帧，即使是那些在标准调试期间会丢失的帧。

如果你需要包含每个协程状态及其堆栈的完整报告，请右键单击 **Coroutines** 标签页，然后单击 **Get Coroutines Dump**。目前，协程转储（dump）相当简单，但我们将在未来的 Kotlin 版本中使其更具可读性和实用性。

![协程转储](coroutines-dump-wn.png)

在 [这篇博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/) 和 [IntelliJ IDEA 文档](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html) 中了解更多关于调试协程的信息。

## 新编译器

新的 Kotlin 编译器将非常快速；它将统一所有支持的平台并为编译器扩展提供 API。这是一个长期项目，我们已经在 Kotlin 1.4.0 中完成了几个步骤：

* [新的、更强大的类型推断算法](#new-more-powerful-type-inference-algorithm) 已默认启用。
* [新的 JVM 和 JS IR 后端](#unified-backends-and-extensibility)。一旦我们将其稳定下来，它们将成为默认设置。

### 新的、更强大的类型推断算法

Kotlin 1.4 使用新的、更强大的类型推断算法。这个新算法在 Kotlin 1.3 中通过指定编译器选项即可试用，现在已默认启用。你可以在 [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20) 中查找新算法修复的完整问题列表。这里有一些最显著的改进：

* [更多自动推断类型的情况](#more-cases-where-type-is-inferred-automatically)
* [lambda 表达式最后一个表达式的智能转换](#smart-casts-for-a-lambda-s-last-expression)
* [可调用引用的智能转换](#smart-casts-for-callable-references)
* [委派属性的更优推断](#better-inference-for-delegated-properties)
* [具有不同实参的 Java 接口的 SAM 转换](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Kotlin 中的 Java SAM 接口](#java-sam-interfaces-in-kotlin)

#### 更多自动推断类型的情况

新推断算法在许多旧算法需要你显式指定类型的情况下，会自动推断类型。例如，在下面的例子中，lambda 形参 `it` 的类型被正确推断为 `String?`：

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

在 Kotlin 1.3 中，你需要引入显式 lambda 形参或用带有显式泛型实参的 `Pair` 构造函数替换 `to` 才能使其工作。

#### lambda 表达式最后一个表达式的智能转换

在 Kotlin 1.3 中，lambda 表达式内部的最后一个表达式不会被智能转换，除非你指定了预期类型。因此，在下面的例子中，Kotlin 1.3 推断 `String?` 为 `result` 变量的类型：

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // the Kotlin compiler knows that str is not null here
}
// 在 Kotlin 1.3 中，'result' 的类型是 String?，在 Kotlin 1.4 中是 String
```

在 Kotlin 1.4 中，得益于新推断算法，lambda 表达式内部的最后一个表达式会获得智能转换，并且这个新的、更精确的类型被用于推断最终的 lambda 类型。因此，`result` 变量的类型变为 `String`。

在 Kotlin 1.3 中，你通常需要添加显式转换（无论是 `!!` 还是像 `as String` 这样的类型转换）才能使此类情况正常工作，现在这些转换已变得不必要。

#### 可调用引用的智能转换

在 Kotlin 1.3 中，你无法访问智能转换类型的成员引用。现在在 Kotlin 1.4 中可以了：

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

在 `animal` 变量被智能转换为特定类型 `Cat` 和 `Dog` 后，可以使用不同的成员引用 `animal::meow` 和 `animal::woof`。类型检测后，你可以访问与子类型对应的成员引用。

#### 委派属性的更优推断

在分析 `by` 关键字后的委托表达式时，没有考虑委托属性的类型。例如，下面的代码以前无法编译，但现在编译器正确推断 `old` 和 `new` 形参的类型为 `String?`：

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

#### 具有不同实参的 Java 接口的 SAM 转换

Kotlin 从一开始就支持 Java 接口的 SAM 转换，但有一种情况不被支持，这在使用现有 Java 库时有时会很烦人。如果你调用的 Java 方法将两个 SAM 接口作为形参，那么两个实参都需要是 lambda 表达式或普通对象。你不能将一个实参作为 lambda 表达式传入，另一个作为对象传入。

新算法修复了这个问题，你现在在任何情况下都可以传入 lambda 表达式来代替 SAM 接口，这正是你自然期望的工作方式。

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // 在 Kotlin 1.4 中可用
}
```

#### Kotlin 中的 Java SAM 接口

在 Kotlin 1.4 中，你可以在 Kotlin 中使用 Java SAM 接口并对其应用 SAM 转换。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // 可以
}
```

在 Kotlin 1.3 中，你必须在 Java 代码中声明上述函数 `foo` 才能执行 SAM 转换。

### 统一的后端和可扩展性

在 Kotlin 中，我们有三个生成可执行文件的后端：Kotlin/JVM、Kotlin/JS 和 Kotlin/Native。Kotlin/JVM 和 Kotlin/JS 之间没有太多代码共享，因为它们是独立开发的。Kotlin/Native 基于围绕 Kotlin 代码的中间表示 (IR) 构建的新基础设施。

我们正在将 Kotlin/JVM 和 Kotlin/JS 迁移到相同的 IR。因此，所有三个后端共享大量逻辑并拥有统一的流水线。这使得我们只需为所有平台实现一次大多数特性、优化和错误修复。两个新的基于 IR 的后端都处于 [Alpha](components-stability.md) 阶段。

共同的后端基础设施也为多平台编译器扩展打开了大门。你将能够插入流水线并添加自定义处理和转换，这些处理和转换将自动适用于所有平台。

我们鼓励你使用我们新的 [JVM IR](#new-jvm-ir-backend) 和 [JS IR](#new-js-ir-backend) 后端（目前处于 Alpha 阶段），并与我们分享你的反馈。

## Kotlin/JVM

Kotlin 1.4.0 包含许多 JVM 特有的改进，例如：

* [新的 JVM IR 后端](#new-jvm-ir-backend)
* [在接口中生成默认方法的新模式](#new-modes-for-generating-default-methods)
* [用于空检测的统一异常类型](#unified-exception-type-for-null-checks)
* [JVM 字节码中的类型注解](#type-annotations-in-the-jvm-bytecode)

### 新的 JVM IR 后端

与 Kotlin/JS 一样，我们正在将 Kotlin/JVM 迁移到 [统一的 IR 后端](#unified-backends-and-extensibility)，这使我们能够为所有平台实现一次大多数特性和错误修复。你也将通过创建适用于所有平台的多平台扩展来从中受益。

Kotlin 1.4.0 尚未为此类扩展提供公共 API，但我们正在与我们的合作伙伴（包括 [Jetpack Compose](https://developer.android.com/jetpack/compose)）紧密合作，他们已在使用我们的新后端构建编译器插件。

我们鼓励你试用新的 Kotlin/JVM 后端（目前处于 Alpha 阶段），并向我们的 [问题跟踪器](https://youtrack.jetbrains.com/issues/KT) 提交任何问题和特性请求。这将帮助我们统一编译器流水线，并更快地将 Jetpack Compose 等编译器扩展引入 Kotlin 社区。

要启用新的 JVM IR 后端，请在你的 Gradle 构建脚本中指定一个额外的编译器选项：

```kotlin
kotlinOptions.useIR = true
```

> 如果你 [启用 Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en)，你将自动选择使用新的 JVM 后端，而无需在 `kotlinOptions` 中指定编译器选项。
>
{style="note"}

当使用命令行编译器时，添加编译器选项 `-Xuse-ir`。

> 你只能在使用新后端的情况下使用由新 JVM IR 后端编译的代码。否则，你将收到错误。考虑到这一点，我们不建议库作者在生产环境中切换到新后端。
>
{style="note"}

### 在接口中生成默认方法的新模式

将 Kotlin 代码编译为 JVM 1.8 及以上目标时，你可以将 Kotlin 接口的非抽象方法编译为 Java 的 `default` 方法。为此，有一个机制，包括用于标记此类方法的 `@JvmDefault` 注解和启用该注解处理的 `-Xjvm-default` 编译器选项。

在 1.4.0 中，我们添加了一种生成默认方法的新模式：`-Xjvm-default=all` 将 Kotlin 接口的*所有*非抽象方法编译为 `default` Java 方法。为了与使用未带 `default` 编译的接口的代码兼容，我们还添加了 `all-compatibility` 模式。

有关 Java 互操作中默认方法的更多信息，请参见[互操作文档](java-to-kotlin-interop.md#default-methods-in-interfaces)和[这篇博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 用于空检测的统一异常类型

从 Kotlin 1.4.0 开始，所有运行时空检测都将抛出 `java.lang.NullPointerException`，而不是 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`。这适用于：`!!` 操作符、方法前导中的形参空检测、平台类型表达式空检测以及带有非空类型的使用 `as` 操作符。这不适用于 `lateinit` 空检测和显式库函数调用，如 `checkNotNull` 或 `requireNotNull`。

此更改增加了 Kotlin 编译器或各种字节码处理工具（例如 Android [R8 优化器](https://developer.android.com/studio/build/shrink-code)）可以执行的空检测优化次数。

请注意，从开发者的角度来看，情况不会有太大变化：Kotlin 代码将像以前一样抛出带有相同错误消息的异常。异常类型改变了，但传递的信息保持不变。

### JVM 字节码中的类型注解

Kotlin 现在可以在 JVM 字节码（目标版本 1.8+）中生成类型注解，以便它们在运行时通过 Java 反射可用。
要在字节码中发出类型注解，请遵循以下步骤：

1.  确保你声明的注解具有正确的注解目标（Java 的 `ElementType.TYPE_USE` 或 Kotlin 的 `AnnotationTarget.TYPE`）和保留策略（`AnnotationRetention.RUNTIME`）。
2.  将注解类声明编译到 JVM 字节码目标版本 1.8+。你可以使用 `-jvm-target=1.8` 编译器选项来指定它。
3.  将使用注解的代码编译到 JVM 字节码目标版本 1.8+ (`-jvm-target=1.8`)，并添加 `-Xemit-jvm-type-annotations` 编译器选项。

请注意，标准 library 中的类型注解目前不会在字节码中发出，因为标准 library 是使用目标版本 1.6 编译的。

目前只支持基本情况：

- 方法形参、方法返回类型和属性类型上的类型注解；
- 类型实参的不型变投影，例如 `Smth<@Ann Foo>`、`Array<@Ann Foo>`。

在下面的例子中，`String` 类型上的 `@Foo` 注解可以发出到字节码，然后被 library 代码使用：

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

`kotlin.js` Gradle 插件附带了调整后的 Gradle DSL，它提供了一些新的配置选项，并且与 `kotlin-multiplatform` 插件使用的 DSL 更紧密地对齐。一些最有影响力的变更包括：

- 通过 `binaries.executable()` 显式切换可执行文件的创建。在此处阅读更多关于 [执行 Kotlin/JS 及其环境的信息](js-project-setup.md#execution-environments)。
- 通过 `cssSupport` 从 Gradle 配置内部配置 webpack 的 CSS 和样式加载器。在此处阅读更多关于 [使用 CSS 和样式加载器](js-project-setup.md#css) 的信息。
- 改进了 npm 依赖项管理，强制要求版本号或 [semver](https://docs.npmjs.com/about-semantic-versioning) 版本区间，以及使用 `devNpm`、`optionalNpm` 和 `peerNpm` 支持_开发_、_对等_和_可选_ npm 依赖项。[在此处阅读更多关于直接从 Gradle 管理 npm 包依赖项](js-project-setup.md#npm-dependencies) 的信息。
- 与 [Dukat](https://github.com/Kotlin/dukat)（Kotlin 外部声明生成器）更强的集成。外部声明现在可以在构建期生成，也可以通过 Gradle 任务手动生成。

### 新的 JS IR 后端

Kotlin/JS 的 [IR 后端](js-ir-compiler.md) 目前处于 [Alpha](components-stability.md) 稳定级别，它提供了一些 Kotlin/JS 目标特有的新功能，主要关注通过无用代码消除来优化生成的代码大小，以及改进与 JavaScript 和 TypeScript 的互操作等。

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

有关如何配置新后端的更详细信息，请查看 [Kotlin/JS IR 编译器文档](js-ir-compiler.md)。

通过新的 [@JsExport](js-to-kotlin-interop.md#jsexport-annotation) 注解和从 Kotlin 代码中**[生成 TypeScript 定义](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)** 的能力，Kotlin/JS IR 编译器后端改进了 JavaScript 和 TypeScript 的互操作性。这使得将 Kotlin/JS 代码与现有工具集成、创建**混合应用程序**并在多平台项目中使用代码共享功能变得更加容易。

[了解更多关于 Kotlin/JS IR 编译器后端中的可用特性](js-ir-compiler.md)。

## Kotlin/Native

在 1.4.0 中，Kotlin/Native 获得了大量新特性和改进，包括：

* [在 Swift 和 Objective-C 中支持挂起函数](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [默认支持 Objective-C 泛型](#objective-c-generics-support-by-default)
* [Objective-C/Swift 互操作中的异常处理](#exception-handling-in-objective-c-swift-interop)
* [默认在 Apple 目标上生成 release .dSYMs](#generate-release-dsyms-on-apple-targets-by-default)
* [性能改进](#performance-improvements)
* [简化 CocoaPods 依赖项管理](#simplified-management-of-cocoapods-dependencies)

### 在 Swift 和 Objective-C 中支持 Kotlin 的挂起函数

在 1.4.0 中，我们添加了对 Swift 和 Objective-C 中挂起函数的基本支持。现在，当你将 Kotlin 模块编译成 Apple framework 时，挂起函数在其中作为带有回调的函数（在 Swift/Objective-C 术语中为 `completionHandler`）可用。当你在生成的 framework 头文件中拥有此类函数时，你可以从 Swift 或 Objective-C 代码中调用它们，甚至覆盖它们。

例如，如果你编写以下 Kotlin 函数：

```kotlin
suspend fun queryData(id: Int): String = ...
```

……然后你可以在 Swift 中这样调用它：

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

Kotlin 的早期版本为 Objective-C 互操作中的泛型提供了实验性的支持。从 1.4.0 开始，Kotlin/Native 默认从 Kotlin 代码生成带有泛型的 Apple framework。在某些情况下，这可能会破坏调用 Kotlin framework 的现有 Objective-C 或 Swift 代码。要使 framework 头文件不带泛型，请添加 `-Xno-objc-generics` 编译器选项。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

请注意，[与 Objective-C 互操作文档](native-objc-interop.md#generics) 中列出的所有细节和限制仍然有效。

### Objective-C/Swift 互操作中的异常处理

在 1.4.0 中，我们稍微改变了从 Kotlin 生成的 Swift API，这涉及到异常的翻译方式。Kotlin 和 Swift 在错误处理上存在根本区别。所有 Kotlin 异常都是非受检的，而 Swift 只有受检错误。因此，为了让 Swift 代码感知预期的异常，Kotlin 函数应该使用 `@Throws` 注解标记，指定潜在的异常类 list。

当编译到 Swift 或 Objective-C framework 时，具有或继承 `@Throws` 注解的函数在 Objective-C 中表示为生成 `NSError*` 的方法，在 Swift 中表示为 `throws` 方法。

以前，除了 `RuntimeException` 和 `Error` 之外的任何异常都作为 `NSError` 传播。现在此行为改变了：现在 `NSError` 只针对作为 `@Throws` 注解形参（或其子类）指定类的实例的异常抛出。到达 Swift/Objective-C 的其他 Kotlin 异常被视为未处理，并导致程序终止。

### 默认在 Apple 目标上生成 release .dSYMs

从 1.4.0 开始，Kotlin/Native 编译器默认在 Darwin 平台上为发布二进制文件生成 [调试符号文件](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information) (`.dSYM`)。这可以使用 `-Xadd-light-debug=disable` 编译器选项禁用。在其他平台上，此选项默认禁用。要在 Gradle 中切换此选项，请使用：

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[了解更多关于崩溃报告符号化的信息](native-debugging.md#debug-ios-applications)。

### 性能改进

Kotlin/Native 获得了一系列性能改进，加速了开发过程和执行。
以下是一些例子：

- 为了提高对象分配的速度，我们现在提供 [mimalloc](https://github.com/microsoft/mimalloc) 内存分配器作为系统分配器的替代品。mimalloc 在一些基准检测中速度提高多达两倍。目前，在 Kotlin/Native 中使用 mimalloc 尚属实验性的；你可以使用 `-Xallocator=mimalloc` 编译器选项切换到它。

- 我们重新设计了 C 互操作 library 的构建方式。使用新工具，Kotlin/Native 生成互操作 library 的速度比以前快 4 倍，且构件大小是原来的 25% 到 30%。

- 由于 GC 的优化，整体运行时性能得到改善。在具有大量长生命周期对象的项目中，这种改进将特别明显。`HashMap` 和 `HashSet` 集合现在通过避免冗余装箱工作得更快。

- 在 1.3.70 中，我们引入了两项新特性以提高 Kotlin/Native 编译性能：[缓存项目依赖项和从 Gradle 守护进程运行编译器](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。从那时起，我们设法修复了许多问题并提高了这些特性的整体稳定性。

### 简化 CocoaPods 依赖项管理

以前，一旦你将项目与 CocoaPods 依赖项管理器集成，你只能在 Xcode 中构建项目的 iOS、macOS、watchOS 或 tvOS 部分，而不能与多平台项目的其他部分一起构建。这些其他部分可以在 IntelliJ IDEA 中构建。

而且，每当你添加对存储在 CocoaPods 中的 Objective-C library（Pod library）的依赖项时，你都必须从 IntelliJ IDEA 切换到 Xcode，调用 `pod install`，并在那里运行 Xcode 构建。

现在你可以在 IntelliJ IDEA 中直接管理 Pod 依赖项，同时享受它在代码工作方面提供的便利，例如代码高亮和补全。你还可以使用 Gradle 构建整个 Kotlin 项目，无需切换到 Xcode。这意味着你只需在需要编写 Swift/Objective-C 代码或在模拟器或设备上运行应用程序时才需要前往 Xcode。

你也可以处理本地存储的 Pod library。

根据你的需求，你可以在以下两者之间添加依赖项：
* Kotlin 项目与存储在 CocoaPods 版本库中或本地机器上的 Pod library 之间。
* Kotlin Pod（用作 CocoaPods 依赖项的 Kotlin 项目）与带有一个或多个目标的 Xcode 项目之间。

完成初始配置后，当你向 `cocoapods` 添加新的依赖项时，只需在 IntelliJ IDEA 中重新导入项目。新依赖项将自动添加。无需额外步骤。

[了解如何添加依赖项](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html)。

## Kotlin 多平台

> 多平台项目支持目前处于 [Alpha](components-stability.md) 阶段。未来可能会发生不兼容的更改，并需要手动迁移。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
>
{style="warning"}

[Kotlin 多平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 减少了为 [不同平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets) 编写和维护相同代码的时间，同时保留了原生编程的灵活性和优势。我们继续投入精力在多平台特性和改进上：

* [通过分层项目结构在多个目标之间共享代码](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
* [在分层结构中利用原生 library](#leveraging-native-libs-in-the-hierarchical-structure)
* [只指定一次 kotlinx 依赖项](#specifying-dependencies-only-once)

> 多平台项目需要 Gradle 6.0 或更高版本。
>
{style="note"}

### 通过分层项目结构在多个目标之间共享代码

通过新的分层项目结构支持，你可以在 [多平台项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html) 中，在 [多个平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets) 之间共享代码。

以前，添加到多平台项目中的任何代码都可以放在平台特有的源代码集（仅限于一个目标且不能被任何其他平台复用）中，或者放在公共源代码集（例如 `commonMain` 或 `commonTest`，在项目中的所有平台之间共享）中。在公共源代码集中，你只能通过使用需要平台特有 `actual` 实现的 [`expect` 声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) 来调用平台特有 API。

这使得在 [所有平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-all-platforms) 上共享代码变得容易，但在 [部分目标之间](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) 共享代码就不那么容易了，特别是那些可能复用大量公共逻辑和第三方 API 的相似平台。

例如，在典型的面向 iOS 的多平台项目中，有两个与 iOS 相关的目标：一个用于 iOS ARM64 设备，另一个用于 x64 模拟器。它们有独立的平台特有源代码集，但实际上，设备和模拟器的代码很少需要不同，它们的依赖项也大同小异。因此 iOS 特有代码可以在它们之间共享。

在这种设置下，最好能有一个*供两个 iOS 目标共享的源代码集*，其中包含的 Kotlin/Native 代码仍然可以直接调用 iOS 设备和模拟器共有的任何 API。

![iOS 目标共享的代码](iosmain-hierarchy.png){width=300}

现在你可以通过 [分层项目结构支持](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) 来实现，它根据哪些目标使用它们来推断和调整每个源代码集中可用的 API 和语言特性。

对于常见的目标组合，你可以创建带有目标快捷方式的分层结构。
例如，使用 `ios()` 快捷方式创建两个 iOS 目标和上面所示的共享源代码集：

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

对于其他目标组合，可以通过 `dependsOn` 关系连接源代码集来 [手动创建层次结构](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#manual-configuration)。

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

得益于分层项目结构，library 也可以为目标的子 set 提供公共 API。了解更多关于 [在 library 中共享代码](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries) 的信息。

### 在分层结构中利用原生 library

在多个原生目标之间共享的源代码集中，你可以使用平台依赖 library，例如 Foundation、UIKit 和 POSIX。这可以帮助你共享更多原生代码，而不受平台特有依赖项的限制。

无需额外步骤 – 一切都是自动完成的。IntelliJ IDEA 将帮助你检测可以在共享代码中使用的公共声明。

[了解更多关于平台依赖 library 使用方法的信息](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。

### 只指定一次 kotlinx 依赖项

从现在开始，在使用共享和平台特有源代码集时，你只需指定一次对同一 library 的不同变体的依赖项，而无需多次指定。

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

不要再使用带有指定平台后缀的 kotlinx 构件名称，例如 `-common`、`-native` 或类似名称，因为它们不再受支持。请使用 library 的基础构件名称，在上面的例子中是 `kotlinx-coroutines-core`。

然而，此更改目前不影响：
* `stdlib` library – 从 Kotlin 1.4.0 开始，[stdlib 依赖项会自动添加](#dependency-on-the-standard-library-added-by-default)。
* `kotlin.test` library – 你仍然应该使用 `test-common` 和 `test-annotations-common`。这些依赖项将在稍后处理。

如果你只对特定平台需要依赖项，仍然可以使用带有 `-jvm` 或 `-js` 等后缀的标准和 kotlinx library 的平台特有变体，例如 `kotlinx-coroutines-core-jvm`。

[了解更多关于配置依赖项的信息](gradle-configure-project.md#configure-dependencies)。

## Gradle 项目改进

除了 [Kotlin 多平台](#kotlin-multiplatform)、[Kotlin/JVM](#kotlin-jvm)、[Kotlin/Native](#kotlin-native) 和 [Kotlin/JS](#kotlin-js) 特有的 Gradle 项目特性和改进之外，还有一些适用于所有 Kotlin Gradle 项目的更改：

* [标准 library 依赖项现在默认添加](#dependency-on-the-standard-library-added-by-default)
* [Kotlin 项目需要最新版本的 Gradle](#minimum-gradle-version-for-kotlin-projects)
* [改进了 IDE 对 Kotlin Gradle DSL 的支持](#improved-gradle-kts-support-in-the-ide)

### 标准 library 依赖项现在默认添加

你不再需要在任何 Kotlin Gradle 项目（包括多平台项目）中声明对 `stdlib` library 的依赖项。该依赖项默认添加。

自动添加的标准 library 将与 Kotlin Gradle 插件版本相同，因为它们具有相同的版本控制。

对于平台特有源代码集，将使用 library 的相应平台特有变体，而公共标准 library 则添加到其余部分。Kotlin Gradle 插件将根据 Gradle 构建脚本的 `kotlinOptions.jvmTarget` [编译器选项](gradle-compiler-options.md) 选择合适的 JVM 标准 library。

[了解如何更改默认行为](gradle-configure-project.md#dependency-on-the-standard-library)。

### Kotlin 项目需要最新版本的 Gradle

要在你的 Kotlin 项目中享受新特性，请将 Gradle 更新到 [最新版本](https://gradle.org/releases/)。多平台项目需要 Gradle 6.0 或更高版本，而其他 Kotlin 项目则适用于 Gradle 5.4 或更高版本。

### 改进了 IDE 对 *.gradle.kts 的支持

在 1.4.0 中，我们继续改进 IDE 对 Gradle Kotlin DSL 脚本（`*.gradle.kts` 文件）的支持。新版本带来了：

- _显式加载脚本配置_以获得更好的性能。以前，你对构建脚本所做的更改会在后台自动加载。为了提高性能，我们在 1.4.0 中禁用了构建脚本配置的自动加载。现在 IDE 只在你显式应用更改时加载它们。

  在 Gradle 6.0 之前的版本中，你需要通过在编辑器中单击 **Load Configuration**（加载配置）来手动加载脚本配置。

  ![*.gradle.kts – Load Configuration](gradle-kts-load-config.png)

  在 Gradle 6.0 及更高版本中，你可以通过单击 **Load Gradle Changes**（加载 Gradle 更改）或重新导入 Gradle 项目来显式应用更改。
 
  在 IntelliJ IDEA 2020.1 中（Gradle 6.0 及更高版本），我们新增了一个操作——**Load Script Configurations**（加载脚本配置），它加载脚本配置的更改而无需更新整个项目。这比重新导入整个项目所需时间少得多。

  ![*.gradle.kts – Load Script Changes and Load Gradle Changes](gradle-kts.png)

  对于新创建的脚本，或者当你首次使用新的 Kotlin 插件打开项目时，你也应该**加载脚本配置**。
  
  在 Gradle 6.0 及更高版本，你现在可以一次性加载所有脚本，而不是像以前那样单独加载。由于每个请求都需要执行 Gradle 配置阶段，这对于大型 Gradle 项目来说可能会占用大量资源。
  
  目前，此类加载仅限于 `build.gradle.kts` 和 `settings.gradle.kts` 文件（请为相关 [问题](https://github.com/gradle/gradle/issues/12640) 投票）。
  要为 `init.gradle.kts` 或应用的 [脚本插件](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins) 启用高亮显示，请使用旧机制——将它们添加到独立脚本中。这些脚本的配置将在你需要时单独加载。
  你还可以为这些脚本启用自动重载。
    
  ![*.gradle.kts – Add to standalone scripts](gradle-kts-standalone.png)
  
- _更好的错误报告_。以前你只能在单独的日志文件中看到 Gradle Daemon 的错误。现在 Gradle Daemon 直接返回所有错误信息，并在构建工具窗口中显示。这为你节省了时间和精力。

## 标准 library

以下是 Kotlin 1.4.0 中 Kotlin 标准 library 最显著的变更列表：

- [通用异常处理 API](#common-exception-processing-api)
- [数组和集合的新函数](#new-functions-for-arrays-and-collections)
- [字符串操作函数](#functions-for-string-manipulations)
- [位操作](#bit-operations)
- [委派属性改进](#delegated-properties-improvements)
- [从 KType 到 Java Type 的转换](#converting-from-ktype-to-java-type)
- [Kotlin 反射的 Proguard 配置](#proguard-configurations-for-kotlin-reflection)
- [改进现有 API](#improving-the-existing-api)
- [stdlib 构件的 module-info 描述符](#module-info-descriptors-for-stdlib-artifacts)
- [弃用](#deprecations)
- [排除已弃用的实验性协程](#exclusion-of-the-deprecated-experimental-coroutines)

### 通用异常处理 API

以下 API 元素已移至公共 library：

* `Throwable.stackTraceToString()` 扩展函数，它返回此可抛出对象及其堆栈跟踪的详细描述；以及 `Throwable.printStackTrace()`，它将此描述打印到标准错误输出。
* `Throwable.addSuppressed()` 函数，它允许你指定为传递异常而被抑制的异常；以及 `Throwable.suppressedExceptions` 属性，它返回所有被抑制异常的 list。
* `@Throws` 注解，它列出了当函数编译为平台方法（在 JVM 或 native 平台上）时将进行检测的异常类型。

### 数组和集合的新函数

#### 集合

在 1.4.0 中，标准 library 包含许多用于处理**集合**的有用函数：

* `setOfNotNull()`，它创建一个由所提供实参中所有非空项组成的 set。

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
        println(result.toList()) //小于 100 的五个随机偶数
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `*Indexed()` 对应函数，用于 `onEach()` 和 `flatMap()`。
它们应用于集合元素的操作以元素索引作为形参。

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

* `*OrNull()` 对应函数 `randomOrNull()`、`reduceOrNull()` 和 `reduceIndexedOrNull()`。
它们在空集合上返回 `null`。

    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         //empty.reduce { a, b -> a + b } // 异常：空集合无法归约。
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `runningFold()`、其同义词 `scan()` 和 `runningReduce()` 顺序地对集合元素应用给定操作，类似于 `fold()` 和 `reduce()`；不同之处在于这些新函数返回整个中间结果序列。

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

* `sumOf()` 接受一个选择器函数，并返回集合所有元素的函数值的总和。
`sumOf()` 可以生成 `Int`、`Long`、`Double`、`UInt` 和 `ULong` 类型的总和。在 JVM 上，`BigInteger` 和 `BigDecimal` 也可用。

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
        println("你总共订购了 $count 件商品，总价为 $total")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `min()` 和 `max()` 函数已重命名为 `minOrNull()` 和 `maxOrNull()`，以符合 Kotlin 集合 API 中使用的命名约定。函数名中的 `*OrNull` 后缀表示如果接收集合为空，它将返回 `null`。同样适用于 `minBy()`、`maxBy()`、`minWith()`、`maxWith()` – 在 1.4 中，它们具有 `*OrNull()` 同义词。
* 新的 `minOf()` 和 `maxOf()` 扩展函数返回给定选择器函数在集合项上的最小值和最大值。

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
        println("订单中最贵的商品价格为 $highestPrice")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

    还有 `minOfWith()` 和 `maxOfWith()`，它们接受一个 `Comparator` 作为实参，以及所有四个函数的 `*OrNull()` 版本，它们在空集合上返回 `null`。

* `flatMap` 和 `flatMapTo` 的新重载允许你使用返回类型与接收者类型不匹配的转换，即：
    * 在 `Iterable`、`Array` 和 `Map` 上转换为 `Sequence`
    * 在 `Sequence` 上转换为 `Iterable`

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

* 用于从可变 list 中移除元素的 `removeFirst()` 和 `removeLast()` 快捷方式，以及这些函数的 `*orNull()` 对应函数。

#### 数组

为了在处理不同容器类型时提供一致的体验，我们还为**数组**添加了新函数：

* `shuffle()` 将数组元素按随机顺序排列。
* `onEach()` 对每个数组元素执行给定操作并返回数组本身。
* `associateWith()` 和 `associateWithTo()` 以数组元素作为键构建 map。
* 数组子区间的 `reverse()` 反转子区间中元素的顺序。
* 数组子区间的 `sortDescending()` 以降序对子区间中的元素进行排序。
* 数组子区间的 `sort()` 和 `sortWith()` 现在在公共 library 中可用。

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
* `ByteArray.decodeToString()` 和 `String.encodeToByteArray()`
* `CharArray.concatToString()` 和 `String.toCharArray()`

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

我们还添加了 `ArrayDeque` 类 – 双端队列的实现。
双端队列允许你在队列的开头或结尾以分摊的常数时间添加或移除元素。当你的代码中需要队列或堆栈时，你可以默认使用双端队列。

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

`ArrayDeque` 实现底层使用了一个可变大小的数组：它将内容存储在循环缓冲区（一个 `Array`）中，并且仅当 `Array` 满了时才调整其大小。

### 字符串操作函数

标准 library 在 1.4.0 中包含字符串操作 API 中的多项改进：

* `StringBuilder` 具有有用的新扩展函数：`set()`、`setRange()`、`deleteAt()`、`deleteRange()`、`appendRange()` 等。

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

* `StringBuilder` 的一些现有函数在公共 library 中可用。其中包括 `append()`、`insert()`、`substring()`、`setLength()` 等。
* 新的 `Appendable.appendLine()` 和 `StringBuilder.appendLine()` 函数已添加到公共 library 中。它们替换了这些类的仅 JVM 可用的 `appendln()` 函数。

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
* `rotateLeft()` 和 `rotateRight()`（实验性的）

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

### 委派属性改进

在 1.4.0 中，我们添加了新特性以改善你在 Kotlin 中使用委派属性的体验：
- 一个属性可以委托给另一个属性。
- 新的 `PropertyDelegateProvider` 接口有助于在单个声明中创建委托提供者。
- `ReadWriteProperty` 现在继承 `ReadOnlyProperty`，因此你可以将它们都用于只读属性。

除了新的 API，我们还进行了一些优化，减少了生成的字节码大小。这些优化在 [这篇博客文章](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties) 中有所描述。

[了解更多关于委派属性的信息](delegated-properties.md)。

### 从 KType 到 Java Type 的转换

stdlib 中新的扩展属性 `KType.javaType`（目前为实验性的）可帮助你在不使用整个 `kotlin-reflect` 依赖项的情况下，从 Kotlin 类型中获取 `java.lang.reflect.Type`。

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

从 1.4.0 开始，我们已在 `kotlin-reflect.jar` 中嵌入了 Kotlin 反射的 Proguard/R8 配置。这样，大多数使用 R8 或 Proguard 的 Android 项目在使用 kotlin-reflect 时无需任何额外配置即可工作。你不再需要复制粘贴 kotlin-reflect 内部的 Proguard 规则。但请注意，你仍然需要显式列出所有你将要反射的 API。

### 改进现有 API

* 一些函数现在可以在空接收者上工作，例如：
    * 字符串上的 `toBoolean()`
    * 数组上的 `contentEquals()`、`contentHashcode()`、`contentToString()`

* `Double` 和 `Float` 中的 `NaN`、`NEGATIVE_INFINITY` 和 `POSITIVE_INFINITY` 现在定义为 `const`，因此你可以将它们用作注解实参。

* `Double` 和 `Float` 中的新常量 `SIZE_BITS` 和 `SIZE_BYTES` 包含用于以二进制形式表示类型实例的位数和字节数。

* `maxOf()` 和 `minOf()` 顶层函数可以接受可变数量的实参 (`vararg`)。

### stdlib 构件的 module-info 描述符

Kotlin 1.4.0 为默认标准 library 构件添加了 `module-info.java` 模块信息。这 lets 你使用它们与 [jlink 工具](https://docs.oracle.com/en/java/javase/11/tools/jlink.html) 一起使用，该工具生成仅包含应用程序所需平台模块的自定义 Java 运行时镜像。
你已经可以使用 jlink 与 Kotlin 标准 library 构件，但你必须为此使用单独的构件——带有“modular”分类器的构件——并且整个设置并不简单。
在 Android 中，请确保使用 Android Gradle 插件版本 3.2 或更高版本，它能正确处理带有 module-info 的 jar 文件。

### 弃用

#### Double 和 Float 的 toShort() 和 toByte()

我们已弃用 `Double` 和 `Float` 上的 `toShort()` 和 `toByte()` 函数，因为它们可能由于值区间窄和变量大小小而导致意外结果。

要将浮点数转换为 `Byte` 或 `Short`，请使用两步转换：首先，将它们转换为 `Int`，然后再次转换为目标类型。

#### 浮点数组上的 contains()、indexOf() 和 lastIndexOf()

我们已弃用 `FloatArray` 和 `DoubleArray` 的 `contains()`、`indexOf()` 和 `lastIndexOf()` 扩展函数，因为它们使用了 [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 标准相等性，这在某些特殊情况下与全序相等性相矛盾。有关详细信息，请参见 [此问题](https://youtrack.jetbrains.com/issue/KT-28753)。

#### min() 和 max() 集合函数

我们已弃用 `min()` 和 `max()` 集合函数，转而使用 `minOrNull()` 和 `maxOrNull()`，它们更能正确反映其行为——在空集合上返回 `null`。
有关详细信息，请参见 [此问题](https://youtrack.jetbrains.com/issue/KT-38854)。

### 排除已弃用的实验性协程

`kotlin.coroutines.experimental` API 在 1.3.0 中已弃用，取而代之的是 kotlin.coroutines。在 1.4.0 中，我们通过从标准 library 中移除 `kotlin.coroutines.experimental` 来完成其弃用周期。对于仍然在 JVM 上使用它的开发者，我们提供了一个兼容构件 `kotlin-coroutines-experimental-compat.jar`，其中包含所有实验性协程 API。我们已将其发布到 Maven，并将其与标准 library 一起包含在 Kotlin 发行版中。

## 稳定的 JSON 序列化

随着 Kotlin 1.4.0 的发布，我们将推出 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的第一个稳定版本 - 1.0.0-RC。现在我们很高兴声明 `kotlinx-serialization-core`（以前称为 `kotlinx-serialization-runtime`）中的 JSON 序列化 API 已稳定。其他序列化格式的 library 以及核心 library 的一些高级部分仍处于实验性阶段。

我们大幅重构了 JSON 序列化的 API，使其更一致、更易于使用。从现在开始，我们将继续以向后兼容的方式开发 JSON 序列化 API。
然而，如果你使用过之前的版本，在迁移到 1.0.0-RC 时，你需要重写一些代码。为了帮助你解决此问题，我们还提供了 **[Kotlin 序列化指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)** – `kotlinx.serialization` 的完整文档集。它将指导你使用最重要的特性，并帮助你解决可能遇到的任何问题。

>**注意**：`kotlinx-serialization` 1.0.0-RC 仅适用于 Kotlin 编译器 1.4。早期编译器版本不兼容。
>
{style="note"}

## 脚本和 REPL

在 1.4.0 中，Kotlin 中的脚本功能受益于多项功能和性能改进以及其他更新。
以下是一些主要变更：

- [新的依赖项解析 API](#new-dependencies-resolution-api)
- [新的 REPL API](#new-repl-api)
- [编译后的脚本缓存](#compiled-scripts-cache)
- [构件重命名](#artifacts-renaming)

为了帮助你更熟悉 Kotlin 中的脚本功能，我们准备了一个 [示例项目](https://github.com/Kotlin/kotlin-script-examples)。
它包含标准脚本（`*.main.kts`）的示例，以及 Kotlin Scripting API 和自定义脚本定义的用法示例。请试用并使用我们的 [问题跟踪器](https://youtrack.jetbrains.com/issues/KT) 分享你的反馈。

### 新的依赖项解析 API

在 1.4.0 中，我们引入了用于解析外部依赖项（例如 Maven 构件）的新 API 及其实现。该 API 发布在新的构件 `kotlin-scripting-dependencies` 和 `kotlin-scripting-dependencies-maven` 中。
`kotlin-script-util` library 中之前的依赖项解析功能现已弃用。

### 新的 REPL API

新的实验性 REPL API 现在是 Kotlin Scripting API 的一部分。已发布的构件中也有它的几种实现，有些具有高级功能，例如代码补全。我们在 [Kotlin Jupyter 内核](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/) 中使用此 API，现在你可以在自己的自定义 shell 和 REPL 中试用它。

### 编译后的脚本缓存

Kotlin Scripting API 现在提供了实现编译脚本缓存的能力，显著加快了未更改脚本的后续执行速度。我们默认的高级脚本实现 `kotlin-main-kts` 已经拥有自己的缓存。

### 构件重命名

为了避免构件名称上的混淆，我们将 `kotlin-scripting-jsr223-embeddable` 和 `kotlin-scripting-jvm-host-embeddable` 重命名为 `kotlin-scripting-jsr223` 和 `kotlin-scripting-jvm-host`。这些构件依赖于 `kotlin-compiler-embeddable` 构件，后者对捆绑的第三方 library 进行了重打包，以避免使用冲突。我们将 `kotlin-compiler-embeddable`（通常更安全）的使用设置为脚本构件的默认设置。
如果出于某种原因，你需要依赖于未重打包的 `kotlin-compiler` 的构件，请使用带有 `-unshaded` 后缀的构件版本，例如 `kotlin-scripting-jsr223-unshaded`。请注意，此重命名仅影响应该直接使用的脚本构件；其他构件的名称保持不变。

## 迁移到 Kotlin 1.4.0

Kotlin 插件的迁移工具可帮助你将项目从早期 Kotlin 版本迁移到 1.4.0。

只需将 Kotlin 版本更改为 `1.4.0` 并重新导入你的 Gradle 或 Maven 项目。IDE 随后会询问你关于迁移的事宜。
 
如果你同意，它将运行迁移代码检测，这些检测将检测你的代码并建议对任何不工作或在 1.4.0 中不推荐的代码进行更正。

![Run migration](run-migration-wn.png){width=300}

代码检测具有不同的 [严重级别](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html)，以帮助你决定接受哪些建议以及忽略哪些建议。

![Migration inspections](migration-inspection-wn.png)

Kotlin 1.4.0 是一个 [特性发布](kotlin-evolution-principles.md#language-and-tooling-releases) 和因此可以
给语言带来不兼容的更改。在 **[Kotlin 1.4 兼容性指南](compatibility-guide-14.md)** 中查找此类更改的详细 list。