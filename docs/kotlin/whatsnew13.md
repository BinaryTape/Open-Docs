---
title: "Kotlin 1.3 中的新特性"
---
_发布日期：2018 年 10 月 29 日_

## 协程发布

经过长时间和广泛的实战测试，协程现在发布了！这意味着从 Kotlin 1.3 开始，语言支持和 API 都是[完全稳定的](components-stability)。查看新的[协程概览](coroutines-overview)页面。

Kotlin 1.3 引入了挂起函数的可调用引用以及反射 API 中对协程的支持。

## Kotlin/Native

Kotlin 1.3 继续改进和完善 Native 目标。有关详细信息，请参见 [Kotlin/Native 概述](native-overview)。

## 多平台项目

在 1.3 中，我们完全重做了多平台项目的模型，以提高表达性和灵活性，并使共享通用代码更容易。此外，Kotlin/Native 现在作为目标之一被支持！

与旧模型的主要区别在于：

  * 在旧模型中，通用代码和平台特定代码需要放置在单独的模块中，并通过 `expectedBy` 依赖项链接。
    现在，通用代码和平台特定代码放置在同一模块的不同源根中，从而使项目更易于配置。
  * 现在有大量针对不同支持平台的[预设平台配置](multiplatform-dsl-reference#targets)。
  * [依赖项配置](multiplatform-add-dependencies)已更改；现在为每个源根分别指定依赖项。
  * 现在可以在任意平台子集之间共享源集（例如，在面向 JS、Android 和 iOS 的模块中，您可以拥有一个仅在 Android 和 iOS 之间共享的源集）。
  * 现在支持[发布多平台库](multiplatform-publish-lib)。

有关更多信息，请参考[多平台编程文档](multiplatform-intro)。

## 契约 (Contracts)

Kotlin 编译器会进行广泛的静态分析，以提供警告并减少样板代码。最值得注意的功能之一是智能转换 (smartcasts)——能够根据执行的类型检查自动执行转换：

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 编译器自动将 's' 转换为 'String'
}
```

但是，一旦将这些检查提取到单独的函数中，所有智能转换 (smartcasts) 都会立即消失：

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 没有智能转换 (smartcast) :(
}
```

为了改善这种情况，Kotlin 1.3 引入了一种称为*契约 (contracts)*的实验机制。

*契约 (Contracts)*允许函数以编译器可以理解的方式显式描述其行为。
目前，支持两大类情况：

* 通过声明函数调用结果和传递的参数值之间的关系来改进智能转换 (smartcasts) 分析：

```kotlin
fun require(condition: Boolean) {
    // 这是一种语法形式，它告诉编译器：
    // “如果此函数成功返回，则传递的 'condition' 为真”
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // s 在此处被智能转换为 'String'，因为否则
    // 'require' 将抛出异常
}
```

* 在存在高阶函数的情况下，改进变量初始化分析：

```kotlin
fun synchronize(lock: Any?, block: () `->` Unit) {
    // 它告诉编译器：
    // “此函数将在此处立即调用 'block'，并且只调用一次”
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 编译器知道传递给 'synchronize' 的 lambda 只会被调用一次，
               // 因此不会报告重新赋值
    }
    println(x) // 编译器知道 lambda 肯定会被调用，执行
               // 初始化，因此 'x' 在此处被认为是已初始化的
}
```

### stdlib 中的契约 (Contracts)

`stdlib` 已经利用了契约 (contracts)，从而改进了上述分析。
契约 (contracts) 的这一部分是**稳定的**，这意味着您可以立即从改进的分析中受益，而无需任何额外的选择加入：

```kotlin

fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 耶，智能转换为非空！
    }
}

fun main() {
    bar(null)
    bar("42")
}
```

### 自定义契约 (Contracts)

可以为自己的函数声明契约 (contracts)，但是此功能是**实验性的**，因为当前的语法
处于早期原型状态，并且很可能会更改。另请注意，当前 Kotlin 编译器
不验证契约 (contracts)，因此程序员有责任编写正确且合理的契约 (contracts)。

自定义契约 (contracts) 由调用 `contract` stdlib 函数引入，该函数提供 DSL 作用域：

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

有关语法以及兼容性声明的详细信息，请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts)。

## 在变量中捕获 when 主题

在 Kotlin 1.3 中，现在可以将 `when` 主题捕获到变量中：

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success `->` response.body
            is HttpError `->` throw HttpException(response.status)
        }
```

虽然已经可以在 `when` 之前提取此变量，但是 `when` 中的 `val` 将其作用域正确地限制为
`when` 的主体，从而防止命名空间污染。[在此处查看有关 `when` 的完整文档](control-flow#when-expressions-and-statements)。

## 接口伴生对象中的 @JvmStatic 和 @JvmField

使用 Kotlin 1.3，可以使用注解 `@JvmStatic` 和 `@JvmField` 标记接口的 `companion` 对象的成员。
在 classfile 中，这些成员将被提升到相应的接口并标记为 `static`。

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

等效于以下 Java 代码：

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

## 注解类中的嵌套声明

在 Kotlin 1.3 中，注解可以具有嵌套的类、接口、对象和伴生对象：

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

按照惯例，Kotlin 程序的入口点是具有类似于 `main(args: Array<String>)` 签名的函数，
其中 `args` 表示传递给程序的命令行参数。但是，并非每个应用程序都支持命令行参数，
因此此参数通常最终未使用。

Kotlin 1.3 引入了一种更简单的 `main` 形式，该形式不带任何参数。现在，Kotlin 中的“Hello, World”减少了 19 个字符！

```kotlin
fun main() {
    println("Hello, world!")
}
```

## 具有较大元数的函数

在 Kotlin 中，函数类型表示为采用不同数量参数的泛型类：`Function0<R>`、
`Function1<P0, R>`、`Function2<P0, P1, R>`、... 这种方法存在一个问题，即此列表是有限的，并且目前以 `Function22` 结尾。

Kotlin 1.3 放宽了此限制，并增加了对具有更大元数的函数的支持：

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 还有 42 个 */, Any) `->` Any) {
    block(Any(), Any(), ..., Any())
}
```

## 渐进模式

Kotlin 非常关心代码的稳定性和向后兼容性：Kotlin 兼容性策略指出，破坏性更改
（例如，使过去可以很好地编译的代码不再编译的更改）只能在主要版本中引入（**1.2**、**1.3** 等）。

我们认为，许多用户可以使用更快的周期，其中关键的编译器错误修复程序会立即到达，
从而使代码更安全和正确。因此，Kotlin 1.3 引入了*渐进式*编译器模式，可以通过将参数 `-progressive` 传递给编译器来启用该模式。

在渐进模式下，一些语言语义的修复程序可以立即到达。所有这些修复程序都具有两个重要属性：

* 它们保留了源代码与旧编译器的向后兼容性，这意味着所有可由渐进式编译器编译的代码
将被非渐进式编译器很好地编译。
* 它们只会以某种方式使代码*更安全*——例如，可以禁止一些不健全的智能转换 (smartcast)，生成的代码的行为
可能会更改为更可预测/稳定，依此类推。

启用渐进模式可能需要您重写一些代码，但是不应该太多——所有在渐进式下启用的修复程序
都经过精心挑选、审查并提供工具迁移帮助。
我们希望渐进模式对于任何积极维护并快速更新到
最新语言版本的代码库来说都是一个不错的选择。

## 内联类 (Inline classes)

:::caution
内联类 (Inline classes) 处于 [Alpha](components-stability) 阶段。将来可能会发生不兼容的更改，并且需要手动迁移。
我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中对此的反馈。
有关详细信息，请参见[参考](inline-classes)。

:::

Kotlin 1.3 引入了一种新的声明——`inline class`。可以将内联类 (Inline classes) 视为通常类的受限版本，
特别是，内联类 (Inline classes) 必须只有一个属性：

```kotlin
inline class Name(val s: String)
```

Kotlin 编译器将使用此限制来积极地优化内联类 (Inline classes) 的运行时表示形式，并且
在可能的情况下使用基础属性的值替换它们的实例，从而消除构造函数调用、GC 压力
并启用其他优化：

```kotlin
inline class Name(val s: String)

fun main() {
    // 在下一行中，没有发生构造函数调用，并且
    // 在运行时，“name”仅包含字符串“Kotlin”
    val name = Name("Kotlin")
    println(name.s) 
}

```

有关详细信息，请参见[参考](inline-classes)中的内联类 (Inline classes)。

## 无符号整数

:::caution
无符号整数处于 [Beta](components-stability) 阶段。
它们的实现几乎是稳定的，但是在将来可能需要迁移步骤。
我们将尽力最大程度地减少您必须进行的任何更改。

:::

Kotlin 1.3 引入了无符号整数类型：

* `kotlin.UByte`：一个无符号 8 位整数，范围从 0 到 255
* `kotlin.UShort`：一个无符号 16 位整数，范围从 0 到 65535
* `kotlin.UInt`：一个无符号 32 位整数，范围从 0 到 2^32 - 1
* `kotlin.ULong`：一个无符号 64 位整数，范围从 0 到 2^64 - 1

有符号类型的大部分功能也为无符号类型提供了支持：

```kotlin
fun main() {

// 您可以使用字面量后缀定义无符号类型
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// 您可以通过 stdlib 扩展将有符号类型转换为无符号类型，反之亦然：
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 无符号类型支持类似的运算符：
val x = 20u + 22u
val y = 1u shl 8
val z = "128".toUByte()
val range = 1u..5u

println("ubyte: $ubyte, byte: $byte, ulong2: $ulong2")
println("x: $x, y: $y, z: $z, range: $range")
}
```

有关详细信息，请参见[参考](unsigned-integer-types)。

## @JvmDefault

:::caution
`@JvmDefault` 是 [实验性的](components-stability)。可能会随时删除或更改。
仅将其用于评估目的。我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中对此的反馈。

:::

Kotlin 针对广泛的 Java 版本，包括 Java 6 和 Java 7，其中不允许接口中的默认方法。
为了您的方便，Kotlin 编译器可以解决该限制，但是此解决方法与 Java 8 中引入的 `default` 方法不兼容。

对于 Java 互操作性来说，这可能是一个问题，因此 Kotlin 1.3 引入了 `@JvmDefault` 注解。
使用此注解的方法将作为 JVM 的 `default` 方法生成：

```kotlin
interface Foo {
    // 将生成为“default”方法
    @JvmDefault
    fun foo(): Int = 42
}
```

:::caution
警告！使用 `@JvmDefault` 注解您的 API 会对二进制兼容性产生严重影响。
在使用 `@JvmDefault` 进行生产之前，请务必仔细阅读[参考页面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)。

:::

## 标准库

### 多平台随机数

在 Kotlin 1.3 之前，没有一种统一的方法可以在所有平台上生成随机数——我们不得不求助于平台特定的解决方案，
例如 JVM 上的 `java.util.Random`。此版本通过引入在所有平台上均可用的类 `kotlin.random.Random` 解决了此问题：

```kotlin
import kotlin.random.Random

fun main() {

    val number = Random.nextInt(42)  // number 在范围 [0, limit) 内
    println(number)

}
```

### isNullOrEmpty 和 orEmpty 扩展

某些类型的 `isNullOrEmpty` 和 `orEmpty` 扩展已存在于 stdlib 中。如果接收者是 `null` 或空，则第一个返回 `true`，如果接收者是 `null`，则第二个回退到空实例。
Kotlin 1.3 在集合、映射和对象数组上提供了类似的扩展。

### 在两个现有数组之间复制元素

现有数组类型的 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 函数，
包括无符号数组，使在纯 Kotlin 中实现基于数组的容器更加容易。

```kotlin
fun main() {

    val sourceArr = arrayOf("k", "o", "t", "l", "i", "n")
    val targetArr = sourceArr.copyInto(arrayOfNulls<String>(6), 3, startIndex = 3, endIndex = 6)
    println(targetArr.contentToString())
    
    sourceArr.copyInto(targetArr, startIndex = 0, endIndex = 3)
    println(targetArr.contentToString())

}
```

### associateWith

一个常见的情况是拥有一系列键，并且想要通过将每个键与某个值关联来构建映射。
以前可以使用 `associate { it to getValue(it) }` 函数来完成此操作，但是现在我们引入了一种更
高效且易于浏览的替代方法：`keys.associateWith { getValue(it) }`。

```kotlin
fun main() {

    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }

}
```

### ifEmpty 和 ifBlank 函数

集合、映射、对象数组、字符序列和序列现在具有 `ifEmpty` 函数，该函数允许指定
一个备用值，如果接收者为空，则将使用该值：

```kotlin
fun main() {

    fun printAllUppercase(data: List<String>) {
        val result = data
        .filter { it.all { c `->` c.isUpperCase() } }
            .ifEmpty { listOf("<no uppercase>") }
        result.forEach { println(it) }
    }
    
    printAllUppercase(listOf("foo", "Bar"))
    printAllUppercase(listOf("FOO", "BAR"))

}
```

此外，字符序列和字符串还具有 `ifBlank` 扩展，该扩展执行与 `ifEmpty` 相同的操作，但是检查
字符串是否全为空白而不是空字符串。

```kotlin
fun main() {

    val s = "    
"
    println(s.ifBlank { "<blank>" })
    println(s.ifBlank { null })

}
```

### 反射中的密封类 (Sealed classes)

我们向 `kotlin-reflect` 添加了一个新 API，该 API 可用于枚举 `sealed` 类的所有直接子类型，即 `KClass.sealedSubclasses`。

### 较小的更改

* `Boolean` 类型现在具有伴生对象。
* `Any?.hashCode()` 扩展，对于 `null` 返回 0。
* `Char` 现在提供 `MIN_VALUE` 和 `MAX_VALUE` 常量。
* 原始类型伴生对象中的 `SIZE_BYTES` 和 `SIZE_BITS` 常量。

## 工具

### IDE 中的代码样式支持

Kotlin 1.3 在 IntelliJ IDEA 中引入了对[推荐的代码样式](coding-conventions)的支持。
查看[此页面](code-style-migration-guide)以获取迁移指南。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 是一个库，它为 Kotlin 中的对象提供多平台支持以进行（反）序列化。
以前，它是一个单独的项目，但是从 Kotlin 1.3 开始，它与 Kotlin 编译器发行版一起发布，与其他编译器插件相当。
主要的区别是，您不需要手动注意序列化 IDE 插件是否与您正在使用的 Kotlin IDE 插件版本兼容：
现在，Kotlin IDE 插件已经包括序列化！

有关[详细信息](https://github.com/Kotlin/kotlinx.serialization#current-project-status)，请参见此处。

:::caution
即使 kotlinx.serialization 现在与 Kotlin 编译器发行版一起发布，在 Kotlin 1.3 中它仍然被认为是实验性功能。

:::

### 脚本更新

:::caution
脚本是 [实验性的](components-stability)。可能会随时删除或更改。
仅将其用于评估目的。我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中对此的反馈。

:::

Kotlin 1.3 继续发展和改进脚本 API，引入了对脚本自定义的一些实验性支持，
例如添加外部属性、提供静态或动态依赖项等。

有关更多详细信息，请参阅 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)。

### Scratches 支持

Kotlin 1.3 引入了对可运行的 Kotlin *scratch files* 的支持。
*Scratch file* 是一个带有 .kts 扩展名的 kotlin 脚本文件，您可以运行该文件并直接在编辑器中获得评估结果。

有关详细信息，请参阅常规的 [Scratches 文档](https://www.jetbrains.com/help/idea/scratches.html)。