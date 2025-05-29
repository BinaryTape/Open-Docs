[//]: # (title: Kotlin 1.2 新特性)

_发布日期：2017 年 11 月 28 日_

## 目录

*   [多平台项目 (实验性)](#multiplatform-projects-experimental)
*   [其他语言特性](#other-language-features)
*   [标准库](#standard-library)
*   [JVM 后端](#jvm-backend)
*   [JavaScript 后端](#javascript-backend)

## 多平台项目 (实验性)

多平台项目是 Kotlin 1.2 中一项**实验性**新特性，它允许你在 Kotlin 支持的目标平台（JVM、JavaScript，以及未来将支持的 Native）之间复用代码。在一个多平台项目中，有三种类型的模块：

*   一个 *共同* 模块包含不特定于任何平台的代码，以及没有平台依赖 API 实现的声明。
*   一个 *平台* 模块包含共同模块中平台依赖声明针对特定平台的实现，以及其他平台依赖的代码。
*   一个常规模块面向特定平台，并且可以是平台模块的依赖项，也可以依赖于平台模块。

当你为一个特定平台编译一个多平台项目时，共同部分和平台特定部分的代码都会被生成。

多平台项目支持的一个关键特性是，可以通过 *预期 (expected)* 声明和 *实际 (actual)* 声明来表达共同代码对平台特定部分的依赖。一个 *预期* 声明指定了一个 API (类、接口、注解、顶层声明等)。一个 *实际* 声明要么是该 API 的平台依赖实现，要么是引用外部库中该 API 现有实现的一个类型别名。示例如下：

在共同代码中：

```kotlin
// 预期平台特定 API:
expect fun hello(world: String): String

fun greet() {
    // 预期 API 的用法:
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

// 使用现有的平台特定实现:
actual typealias URL = java.net.URL
```

有关详细信息以及如何构建多平台项目的步骤，请参阅[多平台编程文档](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)。

## 其他语言特性

### 注解中的数组字面量

从 Kotlin 1.2 开始，注解的数组参数可以使用新的数组字面量语法传递，而不再是 `arrayOf` 函数：

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

数组字面量语法仅限于注解参数。

### lateinit 顶层属性和局部变量

`lateinit` 修饰符现在可以用于顶层属性和局部变量。后者可以用于，例如，当作为构造函数参数传递给一个对象的 lambda 引用了另一个必须稍后定义的对象时：

```kotlin
class Node<T>(val value: T, val next: () -> Node<T>)

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 检查 lateinit 变量是否已初始化

你现在可以使用属性引用上的 `isInitialized` 来检查一个 lateinit 变量是否已初始化：

```kotlin
class Foo {
    lateinit var lateinitVar: String

    fun initializationLogic() {
//sampleStart
        println("isInitialized before assignment: " + this::lateinitVar.isInitialized)
        lateinitVar = "value"
        println("isInitialized after assignment: " + this::lateinitVar.isInitialized)
//sampleEnd
    }
}

fun main(args: Array<String>) {
	Foo().initializationLogic()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 具有默认函数参数的内联函数

内联函数现在允许为其内联的函数参数设置默认值：

```kotlin
//sampleStart
inline fun <E> Iterable<E>.strings(transform: (E) -> String = { it.toString() }) =
    map { transform(it) }

val defaultStrings = listOf(1, 2, 3).strings()
val customStrings = listOf(1, 2, 3).strings { "($it)" } 
//sampleEnd

fun main(args: Array<String>) {
    println("defaultStrings = $defaultStrings")
    println("customStrings = $customStrings")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 显式类型转换信息用于类型推断

Kotlin 编译器现在可以使用类型转换的信息来进行类型推断。如果你调用一个返回类型参数 `T` 的泛型方法，并将返回值转换为特定类型 `Foo`，编译器现在会理解此调用的 `T` 需要绑定到 `Foo` 类型。

这对于 Android 开发者尤为重要，因为编译器现在可以正确分析 Android API level 26 中的泛型 `findViewById` 调用：

```kotlin
val button = findViewById(R.id.button) as Button
```

### 智能类型转换改进

当一个变量从安全调用表达式赋值并检查是否为 null 时，智能类型转换现在也应用于安全调用接收器：

```kotlin
fun countFirst(s: Any): Int {
//sampleStart
    val firstChar = (s as? CharSequence)?.firstOrNull()
    if (firstChar != null)
    return s.count { it == firstChar } // s: Any is smart cast to CharSequence

    val firstItem = (s as? Iterable<*>)?.firstOrNull()
    if (firstItem != null)
    return s.count { it == firstItem } // s: Any is smart cast to Iterable<*>
//sampleEnd
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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，lambda 中的智能类型转换现在也允许用于在 lambda 之前才被修改的局部变量：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val flag = args.size == 0
    var x: String? = null
    if (flag) x = "Yahoo!"

    run {
        if (x != null) {
            println(x.length) // x is smart cast to String
        }
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 支持 `::foo` 作为 `this::foo` 的简写

对 `this` 成员的绑定可调用引用现在可以不带显式接收器，即 `::foo` 而不是 `this::foo`。这使得在 lambda 中引用外部接收器的成员时，可调用引用使用起来更方便。

### 破坏性变更：`try` 块后健全的智能类型转换

以前，Kotlin 会使用 `try` 块内进行的赋值来对块后的变量进行智能类型转换，这可能会破坏类型安全和 null 安全，并导致运行时故障。此版本修复了这个问题，使智能类型转换更加严格，但会破坏一些依赖于此类智能类型转换的代码。

要切换回旧的智能类型转换行为，请将回退标志 `-Xlegacy-smart-cast-after-try` 作为编译器参数传递。它将在 Kotlin 1.3 中被废弃。

### 废弃：数据类重写 `copy` 函数

当一个数据类派生自一个已经有相同签名的 `copy` 函数的类型时，为该数据类生成的 `copy` 实现会使用父类的默认值，导致违反直觉的行为，或者在父类没有默认参数时在运行时失败。

导致 `copy` 冲突的继承在 Kotlin 1.2 中已被警告废弃，并将在 Kotlin 1.3 中成为错误。

### 废弃：枚举条目中的嵌套类型

在枚举条目中，定义非 `inner class` 的嵌套类型已被废弃，因为这会导致初始化逻辑问题。这在 Kotlin 1.2 中会引发警告，并将在 Kotlin 1.3 中成为错误。

### 废弃：可变参数的单一命名参数

为了与注解中的数组字面量保持一致，以命名形式（`foo(items = i)`）为可变参数传递单个项已被废弃。请使用展开运算符和相应的数组工厂函数：

```kotlin
foo(items = *arrayOf(1))
```

对此类情况存在一项优化，可以消除冗余的数组创建，从而防止性能下降。单参数形式在 Kotlin 1.2 中会产生警告，并将在 Kotlin 1.3 中被移除。

### 废弃：泛型类的内部类继承 `Throwable`

继承自 `Throwable` 的泛型类型的内部类可能在 `throw-catch` 场景中违反类型安全，因此已被废弃，在 Kotlin 1.2 中发出警告，在 Kotlin 1.3 中将成为错误。

### 废弃：修改只读属性的后备字段

在自定义 getter 中通过赋值 `field = ...` 来修改只读属性的后备字段已被废弃，在 Kotlin 1.2 中发出警告，在 Kotlin 1.3 中将成为错误。

## 标准库

### Kotlin 标准库构件和分割包

Kotlin 标准库现在与 Java 9 模块系统完全兼容，后者禁止分割包（多个 jar 文件在同一个包中声明类）。为了支持这一点，引入了新的构件 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，它们取代了旧的 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`。

从 Kotlin 的角度来看，新构件中的声明在相同的包名下可见，但对于 Java 来说具有不同的包名。因此，切换到新构件不需要对你的源代码进行任何更改。

为确保与新模块系统兼容所做的另一个更改是，从 `kotlin-reflect` 库中移除了 `kotlin.reflect` 包中已废弃的声明。如果你正在使用它们，你需要切换到使用 `kotlin.reflect.full` 包中的声明，这在 Kotlin 1.1 中已受支持。

### `windowed`、`chunked`、`zipWithNext`

为 `Iterable<T>`、`Sequence<T>` 和 `CharSequence` 添加了新的扩展函数，涵盖了例如缓冲或批处理（`chunked`）、滑动窗口和计算滑动平均值（`windowed`），以及处理连续项对（`zipWithNext`）等用例：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = (1..9).map { it * it }

    val chunkedIntoLists = items.chunked(4)
    val points3d = items.chunked(3) { (x, y, z) -> Triple(x, y, z) }
    val windowed = items.windowed(4)
    val slidingAverage = items.windowed(4) { it.average() }
    val pairwiseDifferences = items.zipWithNext { a, b -> b - a }
//sampleEnd

    println("items: $items
")

    println("chunked into lists: $chunkedIntoLists")
    println("3D points: $points3d")
    println("windowed by 4: $windowed")
    println("sliding average by 4: $slidingAverage")
    println("pairwise differences: $pairwiseDifferences")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `fill`、`replaceAll`、`shuffle`/`shuffled`

为操作列表添加了一组扩展函数：`MutableList` 的 `fill`、`replaceAll` 和 `shuffle`，以及只读 `List` 的 `shuffled`：

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = (1..5).toMutableList()
    
    items.shuffle()
    println("Shuffled items: $items")
    
    items.replaceAll { it * 2 }
    println("Items doubled: $items")
    
    items.fill(5)
    println("Items filled with 5: $items")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### kotlin-stdlib 中的数学运算

为满足长期以来的请求，Kotlin 1.2 添加了 `kotlin.math` API，用于 JVM 和 JS 通用的数学运算，包含以下内容：

*   常量：`PI` 和 `E`
*   三角函数：`cos`、`sin`、`tan` 及其反函数：`acos`、`asin`、`atan`、`atan2`
*   双曲函数：`cosh`、`sinh`、`tanh` 及其反函数：`acosh`、`asinh`、`atanh`
*   幂运算：`pow`（一个扩展函数）、`sqrt`、`hypot`、`exp`、`expm1`
*   对数：`log`、`log2`、`log10`、`ln`、`ln1p`
*   取整：
    *   `ceil`、`floor`、`truncate`、`round` (四舍五入到偶数) 函数
    *   `roundToInt`、`roundToLong` (四舍五入到整数) 扩展函数
*   符号和绝对值：
    *   `abs` 和 `sign` 函数
    *   `absoluteValue` 和 `sign` 扩展属性
    *   `withSign` 扩展函数
*   两个值中的 `max` 和 `min`
*   二进制表示：
    *   `ulp` 扩展属性
    *   `nextUp`、`nextDown`、`nextTowards` 扩展函数
    *   `toBits`、`toRawBits`、`Double.fromBits` (这些在 `kotlin` 包中)

同样的一组函数（但不包括常量）也适用于 `Float` 参数。

### `BigInteger` 和 `BigDecimal` 的运算符和转换

Kotlin 1.2 引入了一组用于操作 `BigInteger` 和 `BigDecimal` 并从其他数值类型创建它们的功能。这些包括：

*   `Int` 和 `Long` 的 `toBigInteger`
*   `Int`、`Long`、`Float`、`Double` 和 `BigInteger` 的 `toBigDecimal`
*   算术和位运算符函数：
    *   二元运算符 `+`、`-`、`*`、`/`、`%` 和中缀函数 `and`、`or`、`xor`、`shl`、`shr`
    *   一元运算符 `-`、`++`、`--` 和函数 `inv`

### 浮点数到位表示转换

添加了新函数用于 `Double` 和 `Float` 与它们的位表示之间进行转换：

*   `toBits` 和 `toRawBits`，`Double` 返回 `Long`，`Float` 返回 `Int`
*   `Double.fromBits` 和 `Float.fromBits`，用于从位表示创建浮点数

### Regex 现在可序列化

`kotlin.text.Regex` 类已成为 `Serializable`，现在可以在可序列化层次结构中使用。

### `Closeable.use` 在可用时调用 `Throwable.addSuppressed`

当在关闭资源时发生另一个异常后，`Closeable.use` 函数会调用 `Throwable.addSuppressed`。

要启用此行为，你的依赖项中需要包含 `kotlin-stdlib-jdk7`。

## JVM 后端

### 构造函数调用规范化

自 1.0 版本以来，Kotlin 支持带有复杂控制流的表达式，例如 try-catch 表达式和内联函数调用。此类代码符合 Java 虚拟机规范。不幸的是，一些字节码处理工具在构造函数调用的参数中存在此类表达式时，处理得并不好。

为了缓解使用此类字节码处理工具的用户遇到的问题，我们添加了一个命令行编译器选项 (`-Xnormalize-constructor-calls=MODE`)，它告诉编译器为这些构造生成更像 Java 的字节码。这里的 `MODE` 是以下之一：

*   `disable` (默认) – 以与 Kotlin 1.0 和 1.1 相同的方式生成字节码。
*   `enable` – 为构造函数调用生成类似 Java 的字节码。这可能会改变类加载和初始化的顺序。
*   `preserve-class-initialization` – 为构造函数调用生成类似 Java 的字节码，确保保留类初始化顺序。这可能会影响应用程序的整体性能；仅当你在多个类之间共享一些复杂状态并在类初始化时更新时才使用它。

“手动”解决方法是将带有控制流的子表达式的值存储在变量中，而不是直接在调用参数中进行求值。这类似于 `-Xnormalize-constructor-calls=enable`。

### Java 默认方法调用

在 Kotlin 1.2 之前，当面向 JVM 1.6 时，覆盖 Java 默认方法的接口成员会在 `super` 调用时产生警告：`Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'`。在 Kotlin 1.2 中，这会变成一个**错误**，因此任何此类代码都需要使用 JVM target 1.8 进行编译。

### 破坏性变更：平台类型上 `x.equals(null)` 的一致行为

对映射到 Java 基本类型（`Int!`, `Boolean!`, `Short`!, `Long!`, `Float!`, `Double!`, `Char!`）的平台类型调用 `x.equals(null)` 时，当 `x` 为 null 时会错误地返回 `true`。从 Kotlin 1.2 开始，对平台类型的 null 值调用 `x.equals(...)` 会**抛出 NPE**（但 `x == ...` 不会）。

要恢复到 1.2 之前的行为，请将标志 `-Xno-exception-on-explicit-equals-for-boxed-null` 传递给编译器。

### 破坏性变更：通过内联扩展接收器导致平台 null 泄漏的修复

对平台类型的 null 值调用的内联扩展函数没有检查接收器是否为 null，因此会允许 null 泄漏到其他代码中。Kotlin 1.2 在调用站点强制执行此检查，如果接收器为 null 则抛出异常。

要切换回旧的行为，请将回退标志 `-Xno-receiver-assertions` 传递给编译器。

## JavaScript 后端

### TypedArrays 支持默认启用

JavaScript 类型化数组支持（将 Kotlin 原生数组，如 `IntArray`、`DoubleArray` 转换为 [JavaScript 类型化数组](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)）以前是可选功能，现在已默认启用。

## 工具

### 将警告视为错误

编译器现在提供一个选项，可以将所有警告视为错误。在命令行上使用 `-Werror`，或使用以下 Gradle 片段：

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}
```