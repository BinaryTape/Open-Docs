[//]: # (title: Kotlin 1.3 中的新特性)

_发布时间：2018 年 10 月 29 日_

## 协程正式发布

经过漫长而广泛的实战测试，协程现已正式发布！这意味着从 Kotlin 1.3 开始，语言支持和 API 都已 [完全稳定](components-stability.md)。请查看新的 [协程概览](coroutines-overview.md) 页面。

Kotlin 1.3 引入了挂起函数的**可调用引用**，并在反射 API 中增加了对协程的支持。

## Kotlin/Native

Kotlin 1.3 继续改进和完善 Native 目标平台。有关详细信息，请参见 [Kotlin/Native 概览](native-overview.md)。

## 多平台项目

在 1.3 版本中，我们彻底重做了多平台项目的模型，以提高表达能力和灵活性，并使公共代码共享变得更容易。此外，Kotlin/Native 现在已作为其中一个目标平台受支持！

与旧模型的主要区别在于：

  * 在旧模型中，公共代码和平台特有的代码需要放置在单独的模块中，并通过 `expectedBy` 依赖项链接。现在，公共代码和平台特有的代码放置在同一个模块的不同源代码根目录中，从而使项目配置更加简单。
  * 现在为各种受支持的平台提供了大量的 [预设平台配置](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)。
  * [依赖项配置](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html) 已更改；现在为每个源代码根目录单独指定依赖项。
  * 源代码集现在可以在任意平台子集之间共享（例如，在一个面向 JS、Android 和 iOS 的模块中，您可以拥有一个仅在 Android 和 iOS 之间共享的源代码集）。
  * 现在支持 [发布多平台库](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)。

有关更多信息，请参考 [多平台编程文档](https://kotlinlang.org/docs/multiplatform/get-started.html)。

## 契约

Kotlin 编译器会进行广泛的静态分析，以提供警告并减少样板代码。其中最显著的特性之一是智能类型转换——它能够根据执行的类型检测自动执行类型转换：

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 编译器自动将 's' 转换为 'String'
}
```

然而，一旦这些检测被提取到一个单独的函数中，所有的智能类型转换会立即消失：

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 没有智能类型转换 :(
}
```

为了改善这种情况下的行为，Kotlin 1.3 引入了一种实验性机制，称为 *契约*。

*契约* 允许函数以编译器可理解的方式**显式**描述其行为。目前，支持两大类用例：

* 通过声明函数调用结果与传入实参值之间的关系来改进智能类型转换分析：

```kotlin
fun require(condition: Boolean) {
    // 这种语法形式告诉编译器：
    // “如果此函数成功返回，则传入的 'condition' 为 true”
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // 's' 在这里被智能类型转换为 'String'，因为否则
    // 'require' 会抛出异常
}
```

* 改进存在高阶函数时的变量初始化分析：

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // 它告诉编译器：
    // “此函数将立即在此处调用 'block'，且仅调用一次”
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 编译器知道传递给 'synchronize' 的 lambda 仅被调用一次，
               // 因此不会报告重复赋值
    }
    println(x) // 编译器知道 lambda 会被明确调用并执行初始化，
               // 因此 'x' 在此处被视为已初始化
}
```

### 标准库中的契约

`stdlib` 已经使用了契约，这使得上述分析得到了改进。契约的这一部分是**稳定**的，这意味着您现在就可以从改进的分析中受益，而无需任何额外的选择加入：

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 耶，智能类型转换为非空类型！
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

您可以为自己的函数**声明**契约，但此**特性**是**实验性的**，因为当前语法处于早期原型阶段，很可能会更改。另请注意，目前 Kotlin 编译器不验证契约，因此编写正确且健全的契约是程序员的责任。

自定义契约通过调用 `contract` 标准库函数引入，该函数提供 DSL **作用域**：

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

有关语法详情以及兼容性说明，请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md)。

## 在变量中捕获 when 主体

在 Kotlin 1.3 中，现在可以将 `when` 主体捕获到变量中：

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

虽然之前也可以在 `when` 之前提取此变量，但 `when` 中的 `val` 将其**作用域**正确限制在 `when` **代码块**内，从而防止命名空间污染。[有关 `when` 的完整文档请参见此处](control-flow.md#when-expressions-and-statements)。

## 接口伴生对象中的 @JvmStatic 和 @JvmField

借助 Kotlin 1.3，现在可以为接口的 `companion` 对象成员标记 `@JvmStatic` 和 `@JvmField` 注解。在类文件中，这些成员将被提升到相应的接口并标记为 `static`。

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

## 无参数 main 函数

按照惯例，Kotlin 程序的入口点是一个签名类似 `main(args: Array<String>)` 的函数，其中 `args` 表示传递给程序的命令行**实参**。然而，并非每个**应用程序**都支持命令行**实参**，因此这个**形参**通常最终未被使用。

Kotlin 1.3 引入了一种更简单的 `main` 形式，它不带任何**形参**。现在 Kotlin 中的“Hello, World”短了 19 个字符！

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 大参数量函数

在 Kotlin 中，函数类型表示为接受不同数量**形参**的泛型类：`Function0<R>`、`Function1<P0, R>`、`Function2<P0, P1, R>` 等。这种方法存在一个问题，即此列表是有限的，目前以 `Function22` 结束。

Kotlin 1.3 放宽了这一限制，并增加了对**大参数量函数**的支持：

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## 渐进模式

Kotlin 非常重视代码的稳定性**和向后兼容性**：Kotlin 兼容性策略规定，破坏性更改（例如，使原本可以正常编译的代码不再编译的更改）只能在**主要版本**（**1.2**、**1.3** 等）中引入。

我们认为许多用户可以受益于更快的周期，其中关键的**编译器 Bug 修复**可立即生效，从而使代码更安全、更正确。因此，Kotlin 1.3 引入了 *渐进式* 编译器模式，可以通过向编译器传递**实参** `-progressive` 来启用。

在渐进模式下，语言语义中的一些修复可以立即生效。所有这些修复都具有两个重要属性：

* 它们**保留**了源代码与旧版本编译器的**向后兼容性**，这意味着所有可以通过渐进式编译器编译的代码都可以被非渐进式编译器正常编译。
* 它们只会从某种意义上使代码更*安全*——例如，某些不健全的智能类型转换可能被禁止，生成的代码的行为可能会变得更可预测/稳定，等等。

启用渐进模式可能需要您重写部分代码，但工作量不应太大——渐进模式下启用的所有修复都经过精心挑选、**审阅**，并提供了工具迁移协助。我们预计渐进模式将是任何活跃维护且快速更新到最新语言版本的代码库的不错选择。

## 内联类

>内联类处于 [Alpha](components-stability.md) 阶段。它们未来可能会发生不兼容的更改，并需要手动迁移。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。有关详细信息，请参见 [参考](inline-classes.md)。
>
{style="warning"}

Kotlin 1.3 引入了一种新型**声明**——`inline class`。内联类可以被视为普通类的一种受限版本，特别是，内联类必须只包含一个属性：

```kotlin
inline class Name(val s: String)
```

Kotlin 编译器将利用此限制来积极**优化**内联类的**运行时表示**，并尽可能用底层属性的值替换其**实例**，从而消除**构造函数调用**、GC 压力并启用其他**优化**：

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 在下一行不会发生构造函数调用，并且
    // 在运行时 'name' 仅包含字符串 "Kotlin"
    val name = Name("Kotlin")
    println(name.s) 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有关内联类的详细信息，请参见 [参考](inline-classes.md)。

## 无符号整数

>无符号整数处于 [Beta](components-stability.md) 阶段。它们的实现已接近稳定，但未来可能需要迁移步骤。我们将尽力将您需要进行的任何更改降至最低。
>
{style="warning"}

Kotlin 1.3 引入了无符号整数类型：

* `kotlin.UByte`：一个无符号 8 位整数，范围从 0 到 255
* `kotlin.UShort`：一个无符号 16 位整数，范围从 0 到 65535
* `kotlin.UInt`：一个无符号 32 位整数，范围从 0 到 2^32 - 1
* `kotlin.ULong`：一个无符号 64 位整数，范围从 0 到 2^64 - 1

有符号类型的大部分**功能**也支持其无符号对应项：

```kotlin
fun main() {
//sampleStart
// 您可以使用字面量后缀定义无符号类型
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// 您可以通过标准库扩展将有符号类型转换为无符号类型，反之亦然：
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 无符号类型支持类似的操作符：
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

有关详细信息，请参见 [参考](unsigned-integer-types.md)。

## @JvmDefault

>`@JvmDefault` 处于 [实验性](components-stability.md) 阶段。它可能随时被移除或更改。请仅将其用于评估目的。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
>
{style="warning"}

Kotlin 面向广泛的 Java 版本，包括 Java 6 和 Java 7，这些版本中接口不允许使用默认方法。为了您的方便，Kotlin 编译器**变通解决了**这一限制，但这种**变通方法**与 Java 8 中引入的 `default` 方法不兼容。

这可能是 Java 互操作性的一个问题，因此 Kotlin 1.3 引入了 `@JvmDefault` 注解。使用此注解标记的方法将被生成为 JVM 的 `default` 方法：

```kotlin
interface Foo {
    // 将生成为 'default' 方法
    @JvmDefault
    fun foo(): Int = 42
}
```

> 警告！使用 `@JvmDefault` 注解您的 API 对二进制兼容性有严重影响。在使用 `@JvmDefault` 于生产环境之前，请务必仔细阅读 [参考页面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)。
>
{style="warning"}

## 标准库

### 多平台随机数

在 Kotlin 1.3 之前，无法在所有**平台**上统一生成随机数——我们必须求助于诸如 JVM 上的 `java.util.Random` 等**平台特有的解决方案**。此版本通过引入 `kotlin.random.Random` 类解决了这个问题，该类在所有**平台**上均可用：

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // number is in range [0, limit)
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### isNullOrEmpty 和 orEmpty 扩展

`isNullOrEmpty` 和 `orEmpty` **扩展**对于某些类型已存在于标准库中。第一个在**接收者**为 `null` 或空时返回 `true`，第二个在**接收者**为 `null` 时回退到空**实例**。Kotlin 1.3 为**集合**、`map` 和**对象数组**提供了类似的**扩展**。

### 在两个现有数组之间复制元素

`array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 函数适用于现有数组类型（包括无符号数组），这使得在纯 Kotlin 中实现基于数组的容器变得更加容易。

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

拥有一个键列表并希望通过将每个键与某个值关联来构建 `map` 是一种非常常见的情况。以前可以通过 `associate { it to getValue(it) }` 函数实现，但现在我们引入了一种更高效且易于探索的替代方案：`keys.associateWith { getValue(it) }`。

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

**集合**、`map`、**对象数组**、字符序列和序列现在都具有 `ifEmpty` 函数，该函数允许指定一个回退值，如果**接收者**为空，则将使用该值代替**接收者**：

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

此外，字符序列和字符串还具有 `ifBlank` **扩展**，其作用与 `ifEmpty` 相同，但它检查字符串是否全部为空白字符而非空。

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

我们为 `kotlin-reflect` 添加了一个新的 API，可用于**枚举** `sealed` 类的所有直接子类型，即 `KClass.sealedSubclasses`。

### 较小的改动

* `Boolean` 类型现在拥有**伴生对象**。
* `Any?.hashCode()` **扩展**，对 `null` 返回 0。
* `Char` 现在提供 `MIN_VALUE` 和 `MAX_VALUE` 常量。
* 原生类型**伴生对象**中的 `SIZE_BYTES` 和 `SIZE_BITS` 常量。

## 工具

### IDE 中的代码风格支持

Kotlin 1.3 引入了在 IntelliJ IDEA 中对 [推荐代码风格](coding-conventions.md) 的支持。请查看 [此页面](code-style-migration-guide.md) 以获取迁移指南。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 是一个库，它为 Kotlin 中的对象**（反）序列化**提供了多平台支持。以前它是一个独立的**项目**，但自 Kotlin 1.3 起，它随 Kotlin 编译器发行版一起提供，与其它编译器插件地位相同。主要区别在于您无需手动关注 Serialization IDE 插件与您正在使用的 Kotlin IDE 插件版本是否兼容：现在 Kotlin IDE 插件已经包含序列化！

有关 [详细信息](https://github.com/Kotlin/kotlinx.serialization#current-project-status)，请参见此处。

> 尽管 kotlinx.serialization 现在随 Kotlin 编译器发行版一起提供，但它在 Kotlin 1.3 中仍被视为一项实验性特性。
>
{style="warning"}

### 脚本更新

>脚本目前处于 [实验性](components-stability.md) 阶段。它可能随时被移除或更改。请仅将其用于评估目的。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。
>
{style="warning"}

Kotlin 1.3 继续发展和改进脚本 API，引入了一些针对脚本定制的实验性支持，例如添加**外部属性**、提供**静态或动态依赖项**等。

有关其他详细信息，请查阅 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)。

### Scratches 支持

Kotlin 1.3 引入了对可运行的 Kotlin *scratch 文件*的支持。*Scratch 文件* 是一个带有 .kts 扩展名的 Kotlin 脚本文件，您可以直接在编辑器中运行并获得**求值结果**。

有关详细信息，请查阅通用的 [Scratches 文档](https://www.jetbrains.com/help/idea/scratches.html)。