[//]: # (title: Kotlin 1.2 新特性)

_发布日期：2017 年 11 月 28 日_

## 目录

*   [多平台项目](#multiplatform-projects-experimental)
*   [其他语言特性](#other-language-features)
*   [标准库](#standard-library)
*   [JVM 后端](#jvm-backend)
*   [JavaScript 后端](#javascript-backend)

## 多平台项目 (实验性的)

多平台项目是 Kotlin 1.2 中一项新的**实验性的**特性，它允许你在 Kotlin 支持的**目标平台**（JVM、JavaScript 和（未来会支持的）Native）之间复用代码。在多平台项目中，你有三种类型的模块：

*   *公共*模块包含不特定于任何平台的代码，以及没有实现依赖于平台的 API 的**声明**。
*   *平台*模块包含**公共模块**中依赖于平台的**声明**针对特定平台的实现，以及其他依赖于平台的代码。
*   常规模块**面向**特定平台，可以作为平台模块的**依赖项**，也可以依赖于平台模块。

当你针对特定平台**编译**多平台项目时，**公共模块**和**平台特有**部分的代码都会生成。

多平台项目支持的一个关键**特性**是，能够通过 *expected* 和 *actual* **声明**来表达**公共代码**对**平台特有**部分的**依赖项**。*expected* **声明**指定了一个 API（**类**、**接口**、**注解**、**顶层****声明**等）。*actual* **声明**要么是 API 的依赖于平台的实现，要么是引用外部库中 API 现有实现的类型别名。以下是一个**示例**：

在**公共代码**中：

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

在 JVM 平台**代码**中：

```kotlin
actual fun hello(world: String): String =
    "Hello, $world, on the JVM platform!"

// using existing platform-specific implementation:
actual typealias URL = java.net.URL
```

关于详细信息和**构建**多平台项目的**步骤**，请参见[多平台编程**文档**](https://kotlinlang.org/docs/multiplatform/get-started.html)。

## 其他语言特性

### **注解**中的**数组**字面值

从 Kotlin 1.2 开始，**注解**的**数组****实参**可以通过新的**数组**字面值语法传递，而不是使用 `arrayOf` **函数**：

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

**数组**字面值语法受限于**注解****实参**。

### lateinit 顶层属性和局部变量

现在，`lateinit` 修饰符可以用于**顶层**属性和局部变量。**例如**，后者可以用于当作为**构造函数****实参**传递给一个**对象**的 lambda **表达式**引用必须在之后**定义**的另一个**对象**时：

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

### **检测** lateinit 变量是否已初始化

现在，你可以使用属性引用上的 `isInitialized` **检测** lateinit 变量是否已初始化：

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

### 带**默认**函数形参的内联**函数**

现在内联**函数**允许为其内联的**函数****形参**设置**默认值**：

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

### **显式****类型转换**的信息用于**类型推断**

Kotlin **编译器**现在可以在**类型推断**中使用**类型转换**中的信息。如果你正在调用一个返回类型**形参** `T` 的泛型**方法**，并将返回值**类型转换**为特定**类型** `Foo`，那么**编译器**现在**理解**此调用中的 `T` 需要绑定到**类型** `Foo` 上。

这对于 Android **开发者**尤其重要，因为**编译器**现在可以正确**分析** Android API 级别 26 中的泛型 `findViewById` 调用：

```kotlin
val button = findViewById(R.id.button) as Button
```

### 智能**类型转换**改进

当变量从安全调用表达式**赋值**并**检测**是否为 null 时，智能**类型转换**现在也会应用于安全调用**接收者**：

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

此外，现在 lambda **表达式**中的智能**类型转换**允许用于只在 lambda **表达式**之前被修改的局部变量：

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

### 支持 `::foo` 作为 `this::foo` 的缩写

现在，对 `this` 的**成员**的绑定可调用引用可以写成 `::foo` 而不是 `this::foo`，无需**显式****接收者**。这也使得在 lambda **表达式**中引用外部**接收者**的**成员**时，可调用引用使用起来更加方便。

### **破坏性变更**：try **代码块**后的**可靠**智能**类型转换**

之前，Kotlin 使用在 `try` **代码块**内部进行的**赋值**用于**代码块**之后的智能**类型转换**，这可能会破坏**类型安全**和**空安全**并导致**运行时****失败**。此**版本****修复**了此**问题**，使得智能**类型转换**更严格，但会破坏一些依赖于此类智能**类型转换**的代码。

要切换到旧的智能**类型转换****行为**，请将回退**标志** `-Xlegacy-smart-cast-after-try` 作为**编译器****实参**传递。它将在 Kotlin 1.3 中被**弃用**。

### **弃用**：**数据类**覆盖 copy

当**数据类**派生自一个已经拥有同名**同签名** `copy` **函数**的**类型**时，为该**数据类**生成的 `copy` 实现会使用**超类**中的**默认值**，这会导致**反直觉**的**行为**，或者在**超类**中没有**默认****形参**时在**运行时****失败**。

导致 `copy` **冲突**的**继承**在 Kotlin 1.2 中已发出**警告**并被**弃用**，在 Kotlin 1.3 中将成为**错误**。

### **弃用**：**枚举项**中的**嵌套类型**

在**枚举项**内部，**定义**非 `inner class` 的**嵌套类型**因初始化逻辑中的**问题**已被**弃用**。这会在 Kotlin 1.2 中导致**警告**，并在 Kotlin 1.3 中成为**错误**。

### **弃用**：vararg 的单一命名**实参**

为了与**注解**中的**数组**字面值保持一致，以命名形式 (`foo(items = i)`) 为 vararg **形参**传递单个**项**已被**弃用**。请使用展开**操作符**和相应的**数组****工厂函数**：

```kotlin
foo(items = *arrayOf(1))
```

存在一项**优化**，可以消除此类**情况**下冗余的**数组****创建**，从而防止**性能下降**。单**实参**形式在 Kotlin 1.2 中会产生**警告**，并将在 Kotlin 1.3 中被**移除**。

### **弃用**：**继承** Throwable 的泛型**类**的**内部类**

**继承**自 `Throwable` 的泛型**类型**的**内部类**可能在 throw-catch **场景**中违反**类型安全**，因此已被**弃用**，在 Kotlin 1.2 中发出**警告**，并在 Kotlin 1.3 中成为**错误**。

### **弃用**：**修改****只读属性**的**幕后字段**

在**自定义** **getter** 中通过**赋值** `field = ...` **修改****只读属性**的**幕后字段**已被**弃用**，在 Kotlin 1.2 中发出**警告**，并在 Kotlin 1.3 中成为**错误**。

## 标准库

### Kotlin 标准库 artifact 和**拆分****包**

Kotlin 标准库现在与 Java 9 **模块系统**完全兼容，后者禁止**拆分****包**（多个 jar **文件**在同一个**包**中**声明****类**）。为了支持这一点，引入了新的 artifact `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，它们**替换**了旧的 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`。

从 Kotlin 的**角度**来看，新 artifact 中的**声明**在相同的**包名**下可见，但对于 Java 来说**包名**不同。因此，切换到新的 artifact 不会对你的**源代码**造成任何更改。

为了确保与新的**模块系统**兼容而进行的另一个更改是，从 `kotlin-reflect` **库**中移除了 `kotlin.reflect` **包**中已**弃用**的**声明**。如果你一直在使用它们，你需要切换到使用在 `kotlin.reflect.full` **包**中的**声明**，这在 Kotlin 1 1 中已得到支持。

### windowed, chunked, zipWithNext

针对 `Iterable<T>`、`Sequence<T>` 和 `CharSequence` 的新**扩展**涵盖了诸如**缓冲**或**批处理** (`chunked`)、**滑动窗口**和**计算****滑动平均值** (`windowed`) 以及处理连续**项**的**对** (`zipWithNext`) 之类的使用**场景**：

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

### fill, replaceAll, shuffle/shuffled

为**操作** **list** 添加了一组**扩展****函数**：针对 `MutableList` 的 `fill`、`replaceAll` 和 `shuffle`，以及针对**只读** `List` 的 `shuffled`：

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

### kotlin-stdlib 中的**数学运算**

为满足长期以来的**请求**，Kotlin 1.2 添加了对 JVM 和 JS 通用的用于**数学运算**的 `kotlin.math` API，并包含以下**内容**：

*   **常量**：`PI` 和 `E`
*   **三角函数**：`cos`、`sin`、`tan` 及其反函数：`acos`、`asin`、`atan`、`atan2`
*   **双曲函数**：`cosh`、`sinh`、`tanh` 及其反函数：`acosh`、`asinh`、`atanh`
*   **指数运算**：`pow`（**扩展****函数**）、`sqrt`、`hypot`、`exp`、`expm1`
*   **对数**：`log`、`log2`、`log10`、`ln`、`ln1p`
*   **舍入**：
    *   `ceil`、`floor`、`truncate`、`round`（四舍五入到偶数）**函数**
    *   `roundToInt`、`roundToLong`（四舍五入到整数）**扩展****函数**
*   **符号**和**绝对值**：
    *   `abs` 和 `sign` **函数**
    *   `absoluteValue` 和 `sign` **扩展**属性
    *   `withSign` **扩展****函数**
*   两个**值**中的 `max` 和 `min`
*   **二进制表示**：
    *   `ulp` **扩展**属性
    *   `nextUp`、`nextDown`、`nextTowards` **扩展****函数**
    *   `toBits`、`toRawBits`、`Double.fromBits`（这些在 `kotlin` **包**中）

相同一组**函数**（但没有**常量**）也可用于 `Float` **实参**。

### BigInteger 和 BigDecimal 的**操作符**和**转换**

Kotlin 1.2 引入了一组**函数**，用于**操作** `BigInteger` 和 `BigDecimal` 并从其他数值**类型创建**它们。这些是：

*   针对 `Int` 和 `Long` 的 `toBigInteger`
*   针对 `Int`、`Long`、`Float`、`Double` 和 `BigInteger` 的 `toBigDecimal`
*   **算术**和**位****操作符****函数**：
    *   **二元操作符** `+`、`-`、`*`、`/`、`%` 和中缀**函数** `and`、`or`、`xor`、`shl`、`shr`
    *   **一元操作符** `-`、`++`、`--` 和**函数** `inv`

### 浮点数到**位**的**转换**

添加了新的**函数**，用于将 `Double` 和 `Float` **转换**为它们的**位表示**以及从它们的**位表示****转换**：

*   针对 `Double` 返回 `Long`、针对 `Float` 返回 `Int` 的 `toBits` 和 `toRawBits`
*   用于从**位表示**创建浮点数的 `Double.fromBits` 和 `Float.fromBits`

### Regex 现在可**序列化**

`kotlin.text.Regex` **类**已变为 `Serializable`，现在可以在可**序列化**的**层级**结构中使用。

### Closeable.use 在可用时调用 Throwable.addSuppressed

当在抛出**其他异常**后，**关闭****资源**时发生**异常**，`Closeable.use` **函数**会调用 `Throwable.addSuppressed`。

要启用此**行为**，你需要在你的**依赖项**中包含 `kotlin-stdlib-jdk7`。

## JVM 后端

### **构造函数**调用**规范化**

从**版本** 1.0 开始，Kotlin 支持包含**复杂****控制流**的表达式，**例如** try-catch 表达式和内联**函数**调用。此类**代码**根据 Java 虚拟机**规范**是**有效**的。不幸的是，一些**字节码**处理**工具**在**构造函数**调用的**实参**中存在此类表达式时，处理**得**不**太好**。

为了缓解此**问题**，对于此类**字节码**处理**工具**的**用户**，我们添加了一个**命令行****编译器****选项** (`-Xnormalize-constructor-calls=MODE`)，它告诉**编译器**为此类**构造**生成更像 Java 的**字节码**。这里 `MODE` 是以下之一：

*   `disable`（**默认**）– 以与 Kotlin 1.0 和 1.1 相同的方式生成**字节码**。
*   `enable` – 为**构造函数**调用生成类似 Java 的**字节码**。这可能会改变**类**的**加载**和初始化顺序。
*   `preserve-class-initialization` – 为**构造函数**调用生成类似 Java 的**字节码**，确保保留**类**的初始化顺序。这可能会影响**应用程序**的**整体****性能**；仅在你有一些在多个**类**之间**共享**并在**类**初始化时更新的**复杂****状态**时使用它。

“手动”**变通方法**是将带有**控制流**的子表达式的**值**存储在变量中，而不是在调用**实参**中直接**求值**它们。它类似于 `-Xnormalize-constructor-calls=enable`。

### Java **默认方法**调用

在 Kotlin 1.2 之前，**接口****成员**在**覆盖** Java **默认方法**同时**面向** JVM 1.6 **目标平台**时，在 super 调用上会产生**警告**：`Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'`。在 Kotlin 1.2 中，现在是**错误**，因此要求所有此类**代码**都使用 JVM **目标平台** 1.8 进行**编译**。

### **破坏性变更**：**平台类型**的 x.equals(null) 的**行为**一致性

对映射到 Java **原生类型**的**平台类型**（`Int!`, `Boolean!`, `Short`!, `Long!`, `Float!`, `Double!`, `Char!`) 调用 `x.equals(null)` 时，当 `x` 为 null 时错误地返回 `true`。从 Kotlin 1.2 开始，对**平台类型**的 null **值**调用 `x.equals(...)` **会抛出**一个 NPE（但 `x == ...` 不会）。

要回到 1.2 之前的**行为**，请将**标志** `-Xno-exception-on-explicit-equals-for-boxed-null` 传递给**编译器**。

### **破坏性变更**：**修复**平台 null 通过内联**扩展****接收者****逸出**的**问题**

在**平台类型**的 null **值**上调用时，内联**扩展****函数**没有**检测****接收者**是否为 null，因此允许 null **逸出**到**其他****代码**中。Kotlin 1.2 在调用**位置**强制进行此**检测**，如果**接收者**为 null 则**抛出异常**。

要切换到旧的**行为**，请将回退**标志** `-Xno-receiver-assertions` 传递给**编译器**。

## JavaScript 后端

### TypedArrays **支持****默认**启用

JS **类型化****数组****支持**，它将 Kotlin **原生类型****数组**（**例如** `IntArray`、`DoubleArray`）**转换**为 [JavaScript **类型化****数组**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)，这项之前是**选择性****特性**的**功能**已**默认**启用。

## **工具**

### **警告**视为**错误**

**编译器**现在提供一个**选项**，可以将所有**警告**视为**错误**。在**命令行**中使用 `-Werror`，或使用以下 Gradle **代码片段**：

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}