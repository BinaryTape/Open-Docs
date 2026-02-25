[//]: # (title: Kotlin 1.3 的最新变化)

<web-summary>阅读 Kotlin 1.3 版本说明，涵盖新的语言功能、Kotlin Multiplatform、JVM、Native、JS 的更新，以及对 Gradle 和 Maven 的构建工具支持。</web-summary>

_发布日期：2018 年 10 月 29 日_

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## 协程 (Coroutines) 正式发布

经过长期且广泛的实战测试，协程现在正式发布了！这意味着从 Kotlin 1.3 开始，语言支持和 API 已[完全稳定](components-stability.md)。请查看新的[协程概览](coroutines-overview.md)页面。

Kotlin 1.3 在挂起函数上引入了可调用引用，并在反射 API 中支持了协程。

## Kotlin/Native

Kotlin 1.3 继续改进和完善 Native 目标。详见 [Kotlin/Native 概览](native-overview.md)。

## 多平台项目 (Multiplatform projects)

在 1.3 中，我们完全重构了多平台项目的模型，以提高表达能力和灵活性，并使共享公共代码更加容易。此外，Kotlin/Native 现在也作为支持的目标之一！

与旧模型的主要区别在于：

  * 在旧模型中，公共代码和平台特定代码需要放在不同的模块中，并通过 `expectedBy` 依赖项进行链接。现在，公共代码和平台特定代码放在同一个模块的不同源码根目录下，使项目配置更加容易。
  * 现在为不同的支持平台提供了大量的[预设平台配置](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)。
  * [依赖项配置](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)已更改；现在为每个源码根目录单独指定依赖项。
  * 源集 (source set) 现在可以在任意平台子集之间共享（例如，在针对 JS、Android 和 iOS 的模块中，你可以拥有一个仅在 Android 和 iOS 之间共享的源集）。
  * 现在支持[发布多平台库](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)。

欲了解更多信息，请参阅[多平台编程文档](https://kotlinlang.org/docs/multiplatform/get-started.html)。

## 契约 (Contracts)

Kotlin 编译器会进行广泛的静态分析，以提供警告并减少模板代码。其中最显著的功能之一是智能转换 (smartcast) —— 能够根据执行的类型检查自动执行转换：

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 编译器自动将 's' 转换为 'String'
}
```

然而，一旦这些检查被提取到单独的函数中，所有的智能转换就会立即消失：

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 没有智能转换 :(
}
```

为了改善这种情况下的行为，Kotlin 1.3 引入了名为“契约 (contracts)”的实验性机制。

*契约*允许函数以编译器能够理解的方式显式描述其行为。目前支持两大类情况：

* 通过声明函数调用结果与传入实参值之间的关系，改进智能转换分析：

```kotlin
fun require(condition: Boolean) {
    // 这是一种语法形式，告诉编译器：
    // “如果此函数成功返回，则传入的 'condition' 为 true”
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // 这里 s 被智能转换为 'String'，因为否则
    // 'require' 就会抛出异常
}
```

* 在存在高阶函数的情况下改进变量初始化分析：

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // 告诉编译器：
    // “此函数将在此处立即调用 'block'，且恰好调用一次”
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 编译器知道传给 'synchronize' 的 lambda 会被调用
               // 恰好一次，因此不会报告重复赋值
    }
    println(x) // 编译器知道 lambda 肯定会被调用并执行初始化，
               // 因此这里认为 'x' 已初始化
}
```

### 标准库 (stdlib) 中的契约

`stdlib` 已经使用了契约，这带来了上述分析的改进。这部分契约是**稳定**的，这意味着你现在就可以从改进的分析中受益，而无需任何额外的显式开启 (opt-in)：

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 耶，智能转换为非 null！
    }
}
//sampleEnd
fun main() {
    bar(null)
    bar("42")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 自定义契约

可以为自己的函数声明契约，但此功能是**实验性的**，因为当前的语法处于早期原型状态，很可能会发生变化。另外请注意，目前 Kotlin 编译器不会验证契约，因此编写正确且严谨的契约是程序员的责任。

通过调用提供 DSL 作用域的 `contract` 标准库函数来引入自定义契约：

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

有关语法的详细信息以及兼容性声明，请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md)。

## 在 when 语句中捕获主体变量

在 Kotlin 1.3 中，现在可以将 `when` 的主体 (subject) 捕获到变量中：

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

虽然以前也可以在 `when` 之前提取此变量，但在 `when` 中使用 `val` 可以将其作用域正确地限制在 `when` 体内，从而防止命名空间污染。[点击此处查看 `when` 的完整文档](control-flow.md#when-expressions-and-statements)。

## 接口伴生对象中的 @JvmStatic 和 @JvmField

在 Kotlin 1.3 中，可以使用注解 `@JvmStatic` 和 `@JvmField` 标记接口伴生对象 (companion object) 的成员。在类文件中，这些成员将被提升到相应的接口并标记为 `static`。

例如，以下 Kotlin 代码：

```kotlin
interface Foo {
    companion object {
        @JvmField
        val answer: Int = 42

        @JvmStatic
        fun sayHello() {
            println("Hello, world!")
        }
    }
}
```

它等同于这段 Java 代码：

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

## 注解类中的嵌套声明

在 Kotlin 1.3 中，注解可以拥有嵌套类、接口、对象和伴生对象：

```kotlin
annotation class Foo {
    enum class Direction { UP, DOWN, LEFT, RIGHT }
    
    annotation class Bar

    companion object {
        fun foo(): Int = 42
        val bar: Int = 42
    }
}
```

## 无参数 main

按照约定，Kotlin 程序的入口点是一个签名类似于 `main(args: Array<String>)` 的函数，其中 `args` 代表传递给程序的命令行参数。然而，并非每个应用程序都支持命令行参数，因此这个形参往往最终未被使用。

Kotlin 1.3 引入了一种更简单的 `main` 形式，它不带形参。现在 Kotlin 中的 “Hello, World” 缩短了 19 个字符！

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 具有大量形参个数的函数

在 Kotlin 中，函数类型表示为接收不同数量参数的泛型类：`Function0<R>`、`Function1<P0, R>`、`Function2<P0, P1, R>`……这种方法存在一个问题，即此列表是有限的，目前以 `Function22` 结束。

Kotlin 1.3 放宽了这一限制，并增加了对具有更多形参个数 (arity) 的函数支持：

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 还有 42 个 */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## 渐进模式 (Progressive mode)

Kotlin 非常注重代码的稳定性和向后兼容性：Kotlin 兼容性政策规定，重大更改（例如使原本可以正常编译的代码无法再编译的更改）只能在主要版本（**1.2**、**1.3** 等）中引入。

我们相信许多用户可以使用更快的周期，以便立即获得关键的编译器错误修复，使代码更加安全和正确。因此，Kotlin 1.3 引入了渐进式 (progressive) 编译器模式，可以通过向编译器传递参数 `-progressive` 来启用。

在渐进模式下，语言语义中的某些修复可以立即生效。所有这些修复都具有两个重要属性：

* 它们保持源代码与旧编译器的向后兼容性，这意味着所有由渐进式编译器编译的代码也将由非渐进式编译器正常编译。
* 在某种意义上，它们只使代码更*安全* —— 例如，某些不可靠的智能转换可能会被禁止，生成的代码行为可能会更改为更可预测/更稳定，等等。

启用渐进模式可能需要你重写部分代码，但这不应该太多 —— 在渐进模式下启用的所有修复都经过精心挑选、审查，并提供了工具迁移辅助。我们预计，对于任何快速更新到最新语言版本的积极维护的代码库，渐进模式都将是一个不错的选择。

## 内联类 (Inline classes)

> 内联类处于 [Alpha](components-stability.md) 状态。它们将来可能会发生不兼容的更改，并需要手动迁移。
> 我们欢迎你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
> 详见[参考文档](inline-classes.md)。
>
{style="warning"}

Kotlin 1.3 引入了一种新的声明类型 —— `inline class`。内联类可以被视为普通类的受限版本，特别是内联类必须恰好有一个属性：

```kotlin
inline class Name(val s: String)
```

Kotlin 编译器将利用这一限制来积极优化内联类的运行时表示，并在可能的情况下将其实例替换为底层属性的值，从而消除构造函数调用、降低 GC 压力，并启用其他优化：

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 在下一行中不会发生构造函数调用，
    // 在运行时 'name' 仅包含字符串 "Kotlin"
    val name = Name("Kotlin")
    println(name.s) 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

详见内联类[参考文档](inline-classes.md)。

## 无符号整数

> 无符号整数处于 [Beta](components-stability.md) 状态。
> 它们的实现已基本稳定，但将来可能需要迁移步骤。
> 我们将尽力减少你必须进行的任何更改。
>
{style="warning"}

Kotlin 1.3 引入了无符号整数类型：

* `kotlin.UByte`: 无符号 8 位整数，范围从 0 到 255
* `kotlin.UShort`: 无符号 16 位整数，范围从 0 到 65535
* `kotlin.UInt`: 无符号 32 位整数，范围从 0 到 2^32 - 1
* `kotlin.ULong`: 无符号 64 位整数，范围从 0 到 2^64 - 1

有符号类型的大多数功能也支持无符号对应类型：

```kotlin
fun main() {
//sampleStart
// 你可以使用字面量后缀定义无符号类型
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// 你可以通过标准库扩展将有符号类型转换为无符号类型，反之亦然：
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 无符号类型支持类似的运算符：
val x = 20u + 22u
val y = 1u shl 8
val z = "128".toUByte()
val range = 1u..5u
//sampleEnd
println("ubyte: $ubyte, byte: $byte, ulong2: $ulong2")
println("x: $x, y: $y, z: $z, range: $range")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

详见[参考文档](unsigned-integer-types.md)。

## @JvmDefault

>`@JvmDefault` 是[实验性的](components-stability.md)。它可能随时被删除或更改。
> 仅将其用于评估目的。我们欢迎你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
>
{style="warning"}

Kotlin 针对广泛的 Java 版本，包括 Java 6 和 Java 7，其中不允许在接口中使用默认方法。为了方便起见，Kotlin 编译器绕过了这一限制，但这种变通方法与 Java 8 中引入的 `default` 方法不兼容。

这可能会导致 Java 互操作性问题，因此 Kotlin 1.3 引入了 `@JvmDefault` 注解。使用此注解标记的方法将为 JVM 生成为 `default` 方法：

```kotlin
interface Foo {
    // 将生成为 'default' 方法
    @JvmDefault
    fun foo(): Int = 42
}
```

> 警告！使用 `@JvmDefault` 注解你的 API 对二进制兼容性有严重影响。在生产环境中使用 `@JvmDefault` 之前，请务必仔细阅读[参考页面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)。
>
{style="warning"}

## 标准库

### 多平台随机数

在 Kotlin 1.3 之前，没有统一的方法在所有平台上生成随机数 —— 我们不得不求助于平台特定的解决方案，例如 JVM 上的 `java.util.Random`。此版本通过引入 `kotlin.random.Random` 类解决了这一问题，该类在所有平台上均可用：

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // 数字在范围 [0, limit) 内
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### isNullOrEmpty 和 orEmpty 扩展

某些类型的 `isNullOrEmpty` 和 `orEmpty` 扩展已存在于标准库中。第一个函数如果接收者为 `null` 或为空则返回 `true`；第二个函数如果接收者为 `null` 则回退到空实例。Kotlin 1.3 为集合、映射和对象数组提供了类似的扩展。

### 在两个现有数组之间复制元素

针对现有数组类型（包括无符号数组）的 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 函数使在纯 Kotlin 中实现基于数组的容器变得更加容易。

```kotlin
fun main() {
//sampleStart
    val sourceArr = arrayOf("k", "o", "t", "l", "i", "n")
    val targetArr = sourceArr.copyInto(arrayOfNulls<String>(6), 3, startIndex = 3, endIndex = 6)
    println(targetArr.contentToString())
    
    sourceArr.copyInto(targetArr, startIndex = 0, endIndex = 3)
    println(targetArr.contentToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### associateWith

拥有一个键列表并希望通过将每个键与某个值关联来构建映射是很常见的情况。以前可以通过 `associate { it to getValue(it) }` 函数来实现，但现在我们引入了一种更高效且更易于探索的替代方案：`keys.associateWith { getValue(it) }`。

```kotlin
fun main() {
//sampleStart
    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }
//sampleEnd
}
```

### ifEmpty 和 ifBlank 函数

集合、映射、对象数组、字符序列和序列现在拥有 `ifEmpty` 函数，允许指定一个回退值，如果接收者为空，则使用该值代替接收者：

```kotlin
fun main() {
//sampleStart
    fun printAllUppercase(data: List<String>) {
        val result = data
        .filter { it.all { c -> c.isUpperCase() } }
            .ifEmpty { listOf("<no uppercase>") }
        result.forEach { println(it) }
    }
    
    printAllUppercase(listOf("foo", "Bar"))
    printAllUppercase(listOf("FOO", "BAR"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

字符序列和字符串此外还拥有 `ifBlank` 扩展，其作用与 `ifEmpty` 相同，但检查字符串是否全为空格而非仅仅为空。

```kotlin
fun main() {
//sampleStart
    val s = "    
"
    println(s.ifBlank { "<blank>" })
    println(s.ifBlank { null })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 反射中的密封类

我们在 `kotlin-reflect` 中添加了一个新的 API，可用于枚举 `sealed` 类的所有直接子类型，即 `KClass.sealedSubclasses`。

### 较小的更改

* `Boolean` 类型现在拥有伴生对象。
* `Any?.hashCode()` 扩展，对于 `null` 返回 0。
* `Char` 现在提供 `MIN_VALUE` 和 `MAX_VALUE` 常量。
* 原生类型伴生对象中的 `SIZE_BYTES` 和 `SIZE_BITS` 常量。

## 工具

### IDE 中的代码样式支持

Kotlin 1.3 引入了对 IntelliJ IDEA 中[推荐代码样式](coding-conventions.md)的支持。查看[此页面](code-style-migration-guide.md)获取迁移指南。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 是一个为 Kotlin 提供（反）序列化对象多平台支持的库。此前它是一个独立的项目，但从 Kotlin 1.3 开始，它与编译器插件一样随 Kotlin 编译器发行版一起提供。主要的区别在于你不再需要手动留意序列化 IDE 插件是否与你使用的 Kotlin IDE 插件版本兼容：现在 Kotlin IDE 插件已包含序列化支持！

详见[此处](https://github.com/Kotlin/kotlinx.serialization#current-project-status)。

> 尽管 kotlinx.serialization 现在随 Kotlin 编译器发行版一起提供，但它在 Kotlin 1.3 中仍被视为实验性功能。
>
{style="warning"}

### 脚本更新

> 脚本功能处于 [实验性的](components-stability.md) 状态。它可能随时被删除或更改。
> 仅将其用于评估目的。我们欢迎你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
>
{style="warning"}

Kotlin 1.3 继续演进和改进脚本 API，引入了对脚本自定义的一些实验性支持，例如添加外部属性、提供静态或动态依赖项等。

欲了解更多详情，请参考 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)。

### 临时文件 (Scratches) 支持

Kotlin 1.3 引入了对可运行的 Kotlin *临时文件 (scratch files)* 的支持。*临时文件*是带有 .kts 扩展名的 Kotlin 脚本文件，你可以在编辑器中直接运行并获取评估结果。

详见通用[临时文件文档](https://www.jetbrains.com/help/idea/scratches.html)。