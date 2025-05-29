[//]: # (title: Kotlin 1.3 新特性)

发布日期：2018 年 10 月 29 日

## 协程发布

经过漫长而广泛的实践测试，协程现已正式发布！这意味着从 Kotlin 1.3 开始，语言支持和 API 将[完全稳定](components-stability.md)。请查看新的[协程概览](coroutines-overview.md)页面。

Kotlin 1.3 引入了挂起函数（suspend-functions）上的可调用引用（callable references），并支持反射 API 中的协程。

## Kotlin/Native

Kotlin 1.3 继续改进和完善 Native 目标平台。详情请参阅 [Kotlin/Native 概览](native-overview.md)。

## 多平台项目

在 1.3 版本中，我们彻底重构了多平台项目模型，以提高表达能力和灵活性，并使共享通用代码更加容易。此外，Kotlin/Native 现在也被支持作为其中一个目标平台！

与旧模型的主要区别在于：

  * 在旧模型中，通用代码和平台特定代码需要放置在单独的模块中，并通过 `expectedBy` 依赖项进行链接。现在，通用代码和平台特定代码放置在同一模块的不同源代码根目录中，使项目配置更加简单。
  * 现在针对不同支持平台有大量[预设平台配置](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)。
  * [依赖配置](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-add-dependencies.html)已更改；依赖项现在针对每个源代码根目录单独指定。
  * 源集现在可以在任意平台子集之间共享（例如，在一个同时面向 JS、Android 和 iOS 的模块中，你可以拥有一个仅在 Android 和 iOS 之间共享的源集）。
  * 现在支持[发布多平台库](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)。

欲了解更多信息，请参阅[多平台编程文档](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)。

## 契约

Kotlin 编译器执行广泛的静态分析，以提供警告并减少样板代码。其中最显著的特性之一是智能类型转换（smartcasts）——能够根据执行的类型检查自动执行类型转换：

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 编译器自动将 's' 转换为 'String'
}
```

然而，一旦这些检查被提取到单独的函数中，所有的智能类型转换就会立即消失：

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 没有智能类型转换 :(
}
```

为了改善这种情况下的行为，Kotlin 1.3 引入了一种实验性机制，称为 *契约（contracts）*。

*契约* 允许函数以编译器能够理解的方式明确描述其行为。目前，支持两大类情况：

* 通过声明函数调用结果与传入参数值之间的关系来改进智能类型转换分析：

```kotlin
fun require(condition: Boolean) {
    // 这种语法形式告诉编译器：
    // “如果此函数成功返回，则传入的 'condition' 为 true”
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // 's' 在这里被智能类型转换为 'String'，否则
    // 'require' 将抛出异常
}
```

* 在存在高阶函数的情况下改进变量初始化分析：

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // 它告诉编译器：
    // “此函数将立即在此处调用 'block'，并且只调用一次”
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 编译器知道传递给 'synchronize' 的 lambda 只被调用
               // 一次，因此不会报告重新赋值
    }
    println(x) // 编译器知道 lambda 肯定会被调用，执行
               // 初始化，因此 'x' 在这里被认为是已初始化的
}
```

### 标准库中的契约

`stdlib`（标准库）已经使用了契约，这导致了上述分析的改进。契约的这部分是**稳定的**，这意味着你现在无需任何额外的显式选择（opt-ins）即可从改进的分析中受益：

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 好的，智能类型转换为非空！
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

可以为你的函数声明契约，但此功能为**实验性**，因为当前的语法处于早期原型阶段，很可能会更改。另请注意，目前 Kotlin 编译器不验证契约，因此编写正确和健全的契约是程序员的责任。

自定义契约是通过调用提供 DSL 范围的 `contract` 标准库函数引入的：

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

有关语法的详细信息以及兼容性通知，请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md)。

## 在 `when` 表达式中捕获主题变量

在 Kotlin 1.3 中，现在可以在 `when` 表达式中捕获主题变量：

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

虽然在此之前也可以在 `when` 之前提取此变量，但 `when` 中的 `val` 其作用域已正确限制在 `when` 的主体内，从而防止命名空间污染。有关 `when` 的完整文档，请[在此处查看](control-flow.md#when-expressions-and-statements)。

## 接口伴生对象中的 `@JvmStatic` 和 `@JvmField`

通过 Kotlin 1.3，可以为接口的 `companion` 对象的成员标记 `@JvmStatic` 和 `@JvmField` 注解。在类文件中，此类成员将被提升到相应的接口并标记为 `static`。

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

它等效于以下 Java 代码：

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

## 无参数 `main` 函数

按照惯例，Kotlin 程序的入口点是一个签名为 `main(args: Array<String>)` 的函数，其中 `args` 代表传递给程序的命令行参数。然而，并非所有应用程序都支持命令行参数，因此此参数通常最终未被使用。

Kotlin 1.3 引入了一种更简单的 `main` 形式，它不带任何参数。现在 Kotlin 中的 "Hello, World" 短了 19 个字符！

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 大参数数量的函数

在 Kotlin 中，函数类型表示为接受不同数量参数的泛型类：`Function0<R>`、`Function1<P0, R>`、`Function2<P0, P1, R>`、... 这种方法存在一个问题，即此列表是有限的，目前以 `Function22` 结束。

Kotlin 1.3 放宽了此限制，并增加了对具有更多参数数量函数的支持：

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## 渐进模式

Kotlin 非常重视代码的稳定性和向后兼容性：Kotlin 兼容性策略规定，破坏性变更（例如，使原本可以正常编译的代码不再编译的变更）只能在主要版本（**1.2**、**1.3** 等）中引入。

我们相信许多用户可以使用更快的周期，其中关键的编译器错误修复会立即到达，使代码更安全和正确。因此，Kotlin 1.3 引入了 *渐进* 编译器模式，可以通过向编译器传递参数 `-progressive` 来启用。

在渐进模式下，语言语义中的某些修复可以立即生效。所有这些修复都具有两个重要属性：

* 它们保持源代码与旧编译器的向后兼容性，这意味着所有渐进编译器可编译的代码都可以被非渐进编译器正常编译。
* 它们只在某种意义上使代码 *更安全* ——例如，某些不健全的智能类型转换可能会被禁止，生成代码的行为可能会改变以使其更可预测/稳定，等等。

启用渐进模式可能需要你重写部分代码，但工作量应该不大——所有在渐进模式下启用的修复都经过精心挑选、审查，并提供工具迁移辅助。我们期望渐进模式对于任何活跃维护并快速更新到最新语言版本的代码库来说都是一个不错的选择。

## 内联类

>内联类处于 [Alpha](components-stability.md) 阶段。它们将来可能会出现不兼容的更改，并需要手动迁移。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。详情请参阅[参考文档](inline-classes.md)。
>
{style="warning"}

Kotlin 1.3 引入了一种新的声明类型——`inline class`。内联类可以被视为普通类的受限版本，特别是，内联类必须只有一个属性：

```kotlin
inline class Name(val s: String)
```

Kotlin 编译器将利用此限制积极优化内联类的运行时表示，并在可能的情况下用底层属性的值替换其实例，从而消除构造函数调用、垃圾回收（GC）压力，并启用其他优化：

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 在下一行中没有构造函数调用，并且
    // 在运行时 'name' 只包含字符串 "Kotlin"
    val name = Name("Kotlin")
    println(name.s) 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有关内联类的详细信息，请参阅[参考文档](inline-classes.md)。

## 无符号整数

> 无符号整数处于 [Beta](components-stability.md) 阶段。它们的实现几乎稳定，但将来可能需要迁移步骤。我们将尽力将你必须进行的任何更改降至最低。
>
{style="warning"}

Kotlin 1.3 引入了无符号整数类型：

* `kotlin.UByte`：一个无符号 8 位整数，范围从 0 到 255
* `kotlin.UShort`：一个无符号 16 位整数，范围从 0 到 65535
* `kotlin.UInt`：一个无符号 32 位整数，范围从 0 到 2^32 - 1
* `kotlin.ULong`：一个无符号 64 位整数，范围从 0 到 2^64 - 1

大多数有符号类型的功能也支持无符号对应类型：

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

// 无符号类型支持类似操作符：
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

详情请参阅[参考文档](unsigned-integer-types.md)。

## @JvmDefault

>`@JvmDefault` 是[实验性](components-stability.md)的。它可能随时被删除或更改。仅用于评估目的。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
>
{style="warning"}

Kotlin 面向广泛的 Java 版本，包括 Java 6 和 Java 7，其中接口中的默认方法是不允许的。为方便起见，Kotlin 编译器解决了这一限制，但此解决方法与 Java 8 中引入的 `default` 方法不兼容。

这可能是 Java 互操作性（Java-interoperability）的一个问题，因此 Kotlin 1.3 引入了 `@JvmDefault` 注解。使用此注解标记的方法将作为 `default` 方法为 JVM 生成：

```kotlin
interface Foo {
    // 将作为 'default' 方法生成
    @JvmDefault
    fun foo(): Int = 42
}
```

> 警告！用 `@JvmDefault` 注解你的 API 对二进制兼容性（binary compatibility）有严重影响。在使用 `@JvmDefault` 进行生产之前，请务必仔细阅读[参考页面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)。
>
{style="warning"}

## 标准库

### 多平台随机数

在 Kotlin 1.3 之前，所有平台上都没有统一的方法来生成随机数——我们必须求助于平台特定的解决方案，例如 JVM 上的 `java.util.Random`。此版本通过引入 `kotlin.random.Random` 类解决了这个问题，该类在所有平台上都可用：

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // number 在范围 [0, limit) 内
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `isNullOrEmpty` 和 `orEmpty` 扩展函数

某些类型的 `isNullOrEmpty` 和 `orEmpty` 扩展函数已存在于标准库中。第一个函数在接收者为 `null` 或为空时返回 `true`，第二个函数在接收者为 `null` 时回退到空实例。Kotlin 1.3 为集合、映射和对象数组提供了类似的扩展函数。

### 在两个现有数组之间复制元素

针对现有数组类型（包括无符号数组）的 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 函数使得在纯 Kotlin 中实现基于数组的容器变得更加容易。

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

### `associateWith`

拥有一个键列表并希望通过将每个键与某个值关联来构建映射是很常见的情况。以前可以使用 `associate { it to getValue(it) }` 函数来完成，但现在我们引入了一个更高效且易于探索的替代方案：`keys.associateWith { getValue(it) }`。

```kotlin
fun main() {
//sampleStart
    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }
//sampleEnd
}
```

### `ifEmpty` 和 `ifBlank` 函数

集合、映射、对象数组、字符序列和序列现在都有 `ifEmpty` 函数，它允许指定一个回退值，如果接收者为空，则将使用该值而不是接收者：

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

字符序列和字符串此外还有一个 `ifBlank` 扩展，其作用与 `ifEmpty` 相同，但检查字符串是否完全为空白字符而不是空。

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

我们为 `kotlin-reflect` 添加了一个新的 API，可用于枚举 `sealed` 类的所有直接子类型，即 `KClass.sealedSubclasses`。

### 较小的变化

* `Boolean` 类型现在具有伴生对象。
* `Any?.hashCode()` 扩展，对 `null` 返回 0。
* `Char` 现在提供 `MIN_VALUE` 和 `MAX_VALUE` 常量。
* 基本类型伴生对象中的 `SIZE_BYTES` 和 `SIZE_BITS` 常量。

## 工具

### IDE 中的代码风格支持

Kotlin 1.3 引入了 IntelliJ IDEA 中对[推荐代码风格](coding-conventions.md)的支持。请查看[此页面](code-style-migration-guide.md)了解迁移指南。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 是一个为 Kotlin 对象提供多平台（反）序列化支持的库。以前它是一个独立的项目，但自 Kotlin 1.3 起，它与 Kotlin 编译器分发包一同发布，与其他编译器插件并驾齐驱。主要区别在于，你无需手动关注序列化 IDE 插件是否与你使用的 Kotlin IDE 插件版本兼容：现在 Kotlin IDE 插件已经包含了序列化！

详情请参阅[此处](https://github.com/Kotlin/kotlinx.serialization#current-project-status)。

> 尽管 kotlinx.serialization 现在随 Kotlin 编译器分发包一同发布，但它在 Kotlin 1.3 中仍被视为实验性功能。
>
{style="warning"}

### 脚本更新

>脚本处于[实验性](components-stability.md)阶段。它可能随时被删除或更改。仅用于评估目的。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
>
{style="warning"}

Kotlin 1.3 继续发展和改进脚本 API，引入了一些对脚本定制的实验性支持，例如添加外部属性、提供静态或动态依赖项等。

欲了解更多详细信息，请查阅 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)。

### 草稿文件支持

Kotlin 1.3 引入了对可运行 Kotlin *草稿文件（scratch files）* 的支持。*草稿文件* 是一个带有 `.kts` 扩展名的 Kotlin 脚本文件，你可以运行它并直接在编辑器中获得评估结果。

有关详细信息，请查阅通用[草稿文件文档](https://www.jetbrains.com/help/idea/scratches.html)。