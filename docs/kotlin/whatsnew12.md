---
title: "Kotlin 1.2 新特性"
---
_发布日期：2017年11月28日_

## 目录

* [多平台项目](#multiplatform-projects-experimental)
* [其他语言特性](#other-language-features)
* [标准库](#standard-library)
* [JVM后端](#jvm-backend)
* [JavaScript后端](#javascript-backend)

## 多平台项目 (实验性)

多平台项目是 Kotlin 1.2 中的一项新的**实验性**功能，允许你在 Kotlin 支持的目标平台（JVM、JavaScript 和（未来）Native）之间复用代码。在一个多平台项目中，你有三种模块：

* *common* 模块包含不特定于任何平台的代码，以及没有平台相关 API 实现的声明。
* *platform* 模块包含 common 模块中平台相关声明的特定平台实现，以及其他平台相关的代码。
* 常规模块以特定平台为目标，并且可以是平台模块的依赖项，也可以依赖于平台模块。

当你为特定平台编译多平台项目时，会生成 common 和平台特定部分的代码。

多平台项目支持的一个关键特性是可以通过 *expected* 和 *actual* 声明来表达 common 代码对平台特定部分的依赖性。一个 *expected* 声明指定一个 API（类、接口、注解、顶层声明等）。一个 *actual* 声明要么是 API 的平台相关实现，要么是引用外部库中 API 现有实现的类型别名（type alias）。这是一个例子：

在 common 代码中：

```kotlin
// expected platform-specific API:
expect fun hello(world: String): String

fun greet() {
    // usage of the expected API:
    val greeting = hello("multiplatform world")
    println(greeting)
}

expect class URL(spec: String) {
    open fun getHost(): String
    open fun getPath(): String
}
```

在 JVM 平台代码中：

```kotlin
actual fun hello(world: String): String =
    "Hello, $world, on the JVM platform!"

// using existing platform-specific implementation:
actual typealias URL = java.net.URL
```

有关构建多平台项目的详细信息和步骤，请参阅[多平台编程文档](multiplatform-intro)。

## 其他语言特性

### 注解中的数组字面值

从 Kotlin 1.2 开始，注解的数组参数可以使用新的数组字面值语法（array literal syntax）而不是 `arrayOf` 函数来传递：

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

数组字面值语法仅限于注解参数。

### Lateinit 顶层属性和局部变量

`lateinit` 修饰符现在可以用于顶层属性和局部变量。例如，当作为构造函数参数传递给一个对象的 lambda 引用了另一个必须稍后定义的对象时，可以使用后者：

```kotlin
class Node<T>(val value: T, val next: () `->` Node<T>)

fun main(args: Array<String>) {
    // A cycle of three nodes:
    lateinit var third: Node<Int>

    val second = Node(2, next = { third })
    val first = Node(1, next = { second })

    third = Node(3, next = { first })

    val nodes = generateSequence(first) { it.next() }
    println("Values in the cycle: ${nodes.take(7).joinToString { it.value.toString() }}, ...")
}
```

### 检查 lateinit var 是否已初始化

你现在可以使用属性引用上的 `isInitialized` 来检查 lateinit var 是否已初始化：

```kotlin
class Foo {
    lateinit var lateinitVar: String

    fun initializationLogic() {

        println("isInitialized before assignment: " + this::lateinitVar.isInitialized)
        lateinitVar = "value"
        println("isInitialized after assignment: " + this::lateinitVar.isInitialized)

    }
}

fun main(args: Array<String>) {
	Foo().initializationLogic()
}
```

### 带有默认函数参数的内联函数

现在允许内联函数为其内联函数参数设置默认值：

```kotlin

inline fun <E> Iterable<E>.strings(transform: (E) `->` String = { it.toString() }) =
    map { transform(it) }

val defaultStrings = listOf(1, 2, 3).strings()
val customStrings = listOf(1, 2, 3).strings { "($it)" } 

fun main(args: Array<String>) {
    println("defaultStrings = $defaultStrings")
    println("customStrings = $customStrings")
}
```

### 显式类型转换中的信息用于类型推断

Kotlin 编译器现在可以使用类型转换中的信息进行类型推断。如果你调用一个返回类型参数 `T` 的泛型方法，并将返回值转换为特定类型 `Foo`，则编译器现在知道此调用的 `T` 需要绑定到类型 `Foo`。

这对 Android 开发者尤其重要，因为编译器现在可以正确分析 Android API level 26 中的泛型 `findViewById` 调用：

```kotlin
val button = findViewById(R.id.button) as Button
```

### 智能类型转换的改进

当从安全调用表达式赋值变量并检查是否为 null 时，智能类型转换现在也应用于安全调用接收者：

```kotlin
fun countFirst(s: Any): Int {

    val firstChar = (s as? CharSequence)?.firstOrNull()
    if (firstChar != null)
    return s.count { it == firstChar } // s: Any is smart cast to CharSequence

    val firstItem = (s as? Iterable<*>)?.firstOrNull()
    if (firstItem != null)
    return s.count { it == firstItem } // s: Any is smart cast to Iterable<*>

    return -1
}

fun main(args: Array<String>) {
  val string = "abacaba"
  val countInString = countFirst(string)
  println("called on \"$string\": $countInString")

  val list = listOf(1, 2, 3, 1, 2)
  val countInList = countFirst(list)
  println("called on $list: $countInList")
}
```

此外，现在允许对仅在 lambda 之前修改的局部变量进行 lambda 中的智能类型转换：

```kotlin
fun main(args: Array<String>) {

    val flag = args.size == 0
    var x: String? = null
    if (flag) x = "Yahoo!"

    run {
        if (x != null) {
            println(x.length) // x is smart cast to String
        }
    }

}
```

### 支持 ::foo 作为 this::foo 的简写

现在可以编写一个绑定到 `this` 成员的可调用引用，而无需显式接收器，使用 `::foo` 代替 `this::foo`。这也使得可调用引用在 lambda 中使用起来更方便，在 lambda 中你可以引用外部接收器的成员。

### 破坏性变更：try 块之后的可靠智能类型转换

之前，Kotlin 使用在 `try` 块内进行的赋值来进行块后的智能类型转换，这可能会破坏类型安全和空安全，并导致运行时失败。此版本修复了此问题，使智能类型转换更严格，但破坏了一些依赖于此类智能类型转换的代码。

要切换到旧的智能类型转换行为，请将回退标志 `-Xlegacy-smart-cast-after-try` 作为编译器参数传递。它将在 Kotlin 1.3 中被弃用。

### 弃用：数据类覆盖 copy

当一个数据类派生自一个已经具有相同签名的 `copy` 函数的类型时，为数据类生成的 `copy` 实现使用超类型的默认值，导致违反直觉的行为，或者如果在超类型中没有默认参数，则在运行时失败。

在 Kotlin 1.2 中，导致 `copy` 冲突的继承已被弃用并发出警告，并且在 Kotlin 1.3 中将是一个错误。

### 弃用：枚举条目中的嵌套类型

由于初始化逻辑中的问题，在枚举条目中定义一个不是 `inner class` 的嵌套类型已被弃用。这会在 Kotlin 1.2 中导致警告，并且在 Kotlin 1.3 中将是一个错误。

### 弃用：vararg 的单个命名参数

为了与注解中的数组字面值保持一致，以命名形式（`foo(items = i)`）传递 vararg 参数的单个项已被弃用。请使用带有相应数组工厂函数的 spread operator (展开操作符)：

```kotlin
foo(items = *arrayOf(1))
```

在这种情况下，有一种优化可以消除冗余数组创建，从而防止性能下降。在 Kotlin 1.2 中，单参数形式会产生警告，并且将在 Kotlin 1.3 中删除。

### 弃用：扩展 Throwable 的泛型类的内部类

继承自 `Throwable` 的泛型类型的内部类可能会在 throw-catch 场景中违反类型安全，因此已被弃用，在 Kotlin 1.2 中发出警告，并在 Kotlin 1.3 中报错。

### 弃用：改变只读属性的 backing field (后备字段)

通过在自定义 getter 中赋值 `field = ...` 来改变只读属性的 backing field 已被弃用，在 Kotlin 1.2 中发出警告，并在 Kotlin 1.3 中报错。

## 标准库

### Kotlin 标准库工件和拆分包

Kotlin 标准库现在与 Java 9 模块系统完全兼容，该系统禁止拆分包（在同一包中声明类的多个 jar 文件）。为了支持这一点，引入了新的工件 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，它们取代了旧的 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`。

从 Kotlin 的角度来看，新工件中的声明在相同的包名下可见，但对于 Java 而言，它们具有不同的包名。因此，切换到新的工件不需要对你的源代码进行任何更改。

为确保与新模块系统兼容而进行的另一项更改是从 `kotlin-reflect` 库中删除了 `kotlin.reflect` 包中已弃用的声明。如果你正在使用它们，你需要切换到使用 `kotlin.reflect.full` 包中的声明，该包自 Kotlin 1.1 起受支持。

### windowed, chunked, zipWithNext

`Iterable<T>`、`Sequence<T>` 和 `CharSequence` 的新扩展涵盖了诸如缓冲或批量处理 (`chunked`)、滑动窗口和计算滑动平均值 (`windowed`) 以及处理后续项对 (`zipWithNext`) 之类的用例：

```kotlin
fun main(args: Array<String>) {

    val items = (1..9).map { it * it }

    val chunkedIntoLists = items.chunked(4)
    val points3d = items.chunked(3) { (x, y, z) `->` Triple(x, y, z) }
    val windowed = items.windowed(4)
    val slidingAverage = items.windowed(4) { it.average() }
    val pairwiseDifferences = items.zipWithNext { a, b `->` b - a }

    println("items: $items
")

    println("chunked into lists: $chunkedIntoLists")
    println("3D points: $points3d")
    println("windowed by 4: $windowed")
    println("sliding average by 4: $slidingAverage")
    println("pairwise differences: $pairwiseDifferences")
}
```

### fill, replaceAll, shuffle/shuffled

添加了一组用于操作列表的扩展函数：`fill`、`replaceAll` 和 `shuffle` 用于 `MutableList`，`shuffled` 用于只读 `List`：

```kotlin
fun main(args: Array<String>) {

    val items = (1..5).toMutableList()
    
    items.shuffle()
    println("Shuffled items: $items")
    
    items.replaceAll { it * 2 }
    println("Items doubled: $items")
    
    items.fill(5)
    println("Items filled with 5: $items")

}
```

### kotlin-stdlib 中的数学运算

为了满足长期以来的请求，Kotlin 1.2 添加了 `kotlin.math` API 用于 JVM 和 JS 常见的数学运算，其中包含以下内容：

* 常量：`PI` 和 `E`
* 三角函数：`cos`、`sin`、`tan` 以及它们的逆函数：`acos`、`asin`、`atan`、`atan2`
* 双曲函数：`cosh`、`sinh`、`tanh` 及其逆函数：`acosh`、`asinh`、`atanh`
* 指数运算：`pow`（扩展函数）、`sqrt`、`hypot`、`exp`、`expm1`
* 对数：`log`、`log2`、`log10`、`ln`、`ln1p`
* 舍入：
    * `ceil`、`floor`、`truncate`、`round`（一半取偶数）函数
    * `roundToInt`、`roundToLong`（一半取整数）扩展函数
* 符号和绝对值：
    * `abs` 和 `sign` 函数
    * `absoluteValue` 和 `sign` 扩展属性
    * `withSign` 扩展函数
* 两个值的 `max` 和 `min`
* 二进制表示：
    * `ulp` 扩展属性
    * `nextUp`、`nextDown`、`nextTowards` 扩展函数
    * `toBits`、`toRawBits`、`Double.fromBits`（这些在 `kotlin` 包中）

同样的一组函数（但没有常量）也可用于 `Float` 参数。

### BigInteger 和 BigDecimal 的运算符和转换

Kotlin 1.2 引入了一组用于操作 `BigInteger` 和 `BigDecimal` 并从其他数字类型创建它们的函数。 这些是：

* `toBigInteger` 用于 `Int` 和 `Long`
* `toBigDecimal` 用于 `Int`、`Long`、`Float`、`Double` 和 `BigInteger`
* 算术和按位运算符函数：
    * 二元运算符 `+`、`-`、`*`、`/`、`%` 和中缀函数 `and`、`or`、`xor`、`shl`、`shr`
    * 一元运算符 `-`、`++`、`--` 和函数 `inv`

### 浮点数到位的转换

添加了新函数，用于将 `Double` 和 `Float` 转换为其位表示形式并从其位表示形式转换：

* `toBits` 和 `toRawBits` 为 `Double` 返回 `Long`，为 `Float` 返回 `Int`
* `Double.fromBits` 和 `Float.fromBits` 用于从位表示创建浮点数

### Regex 现在是可序列化的

`kotlin.text.Regex` 类已变为 `Serializable`，现在可以在可序列化层次结构中使用。

### 如果可用，Closeable.use 调用 Throwable.addSuppressed

当在其他异常之后关闭资源期间抛出异常时，`Closeable.use` 函数调用 `Throwable.addSuppressed`。

要启用此行为，你需要在你的依赖项中包含 `kotlin-stdlib-jdk7`。

## JVM 后端

### 构造函数调用规范化

自从 1.0 版本以来，Kotlin 支持具有复杂控制流的表达式，例如 try-catch 表达式和内联函数调用。 根据 Java 虚拟机规范，此类代码是有效的。 遗憾的是，当构造函数调用的参数中存在此类表达式时，某些字节码处理工具不能很好地处理此类代码。

为了减轻此类字节码处理工具的用户的问题，我们添加了一个命令行编译器选项 (`-Xnormalize-constructor-calls=MODE`)，该选项告诉编译器为此类构造生成更多类似 Java 的字节码。 此处的 `MODE` 是以下之一：

* `disable`（默认）– 以与 Kotlin 1.0 和 1.1 相同的方式生成字节码。
* `enable` – 为构造函数调用生成类似 Java 的字节码。 这可以更改类的加载和初始化顺序。
* `preserve-class-initialization` – 为构造函数调用生成类似 Java 的字节码，确保保留类初始化顺序。 这会影响应用程序的整体性能； 仅当多个类之间共享某些复杂状态并在类初始化时更新时才使用它。

“手动”解决方法是将具有控制流的子表达式的值存储在变量中，而不是直接在调用参数中对其进行评估。 这类似于 `-Xnormalize-constructor-calls=enable`。

### Java-default 方法调用

在 Kotlin 1.2 之前，在以 JVM 1.6 为目标时，覆盖 Java-default 方法的接口成员会在 super 调用上产生警告：`Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'`。 在 Kotlin 1.2 中，取而代之的是**错误**，因此需要使用 JVM 目标 1.8 编译任何此类代码。

### 破坏性变更：平台类型的 x.equals(null) 的一致行为

在平台类型上调用 `x.equals(null)`，该平台类型映射到 Java 原始类型（`Int!`、`Boolean!`、`Short!`、`Long!`、`Float!`、`Double!`、`Char!`），当 `x` 为 null 时，会错误地返回 `true`。 从 Kotlin 1.2 开始，在平台类型的 null 值上调用 `x.equals(...)` **会抛出 NPE**（但 `x == ...` 不会）。

要返回到 1.2 之前的行为，请将标志 `-Xno-exception-on-explicit-equals-for-boxed-null` 传递给编译器。

### 破坏性变更：通过内联扩展接收器修复平台 null 转义

在平台类型的 null 值上调用的内联扩展函数不会检查接收器是否为 null，因此会允许 null 转义到其他代码中。 Kotlin 1.2 在调用站点强制执行此检查，如果接收器为 null，则会抛出异常。

要切换到旧的行为，请将回退标志 `-Xno-receiver-assertions` 传递给编译器。

## JavaScript 后端

### 默认启用 TypedArrays 支持

JS typed arrays (类型化数组)支持已默认启用，它将 Kotlin 原始数组（例如 `IntArray`、`DoubleArray`）转换为 [JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)，以前这是一个可选择加入的功能。

## 工具

### 将警告视为错误

编译器现在提供了一个选项，可以将所有警告视为错误。 在命令行上使用 `-Werror`，或使用以下 Gradle 代码段：

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}
```