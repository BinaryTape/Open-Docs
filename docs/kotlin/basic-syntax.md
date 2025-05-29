[//]: # (title: 基本语法)

这是基本语法元素的集合，并附有示例。在每个部分的末尾，你都会找到一个指向相关主题详细描述的链接。

你还可以通过 JetBrains Academy 提供的免费 [Kotlin 核心学习路径](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 学习所有 Kotlin 基本知识。

## 包定义和导入

包规范应位于源文件的顶部：

```kotlin
package my.demo

import kotlin.text.*

// ...
```

不要求目录与包匹配：源文件可以任意放置在文件系统中。

参见 [包](packages.md)。

## 程序入口点

Kotlin 应用程序的入口点是 `main` 函数：

```kotlin
fun main() {
    println("Hello world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-hello-world"}

`main` 的另一种形式接受可变数量的 `String` 参数：

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 打印到标准输出

`print` 将其参数打印到标准输出：

```kotlin
fun main() {
//sampleStart
    print("Hello ")
    print("world!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-print"}

`println` 打印其参数并添加一个换行符，以便你打印的下一个内容出现在下一行：

```kotlin
fun main() {
//sampleStart
    println("Hello world!")
    println(42)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-println"}

## 从标准输入读取

`readln()` 函数从标准输入读取。此函数将用户输入的整行内容读取为字符串。

你可以同时使用 `println()`、`readln()` 和 `print()` 函数来打印请求和显示用户输入的消息：

```kotlin
// Prints a message to request input
println("Enter any word: ")

// Reads and stores the user input. For example: Happiness
val yourWord = readln()

// Prints a message with the input
print("You entered the word: ")
print(yourWord)
// You entered the word: Happiness
```

有关更多信息，请参见 [读取标准输入](read-standard-input.md)。

## 函数

一个有两个 `Int` 参数和 `Int` 返回类型的函数：

```kotlin
//sampleStart
fun sum(a: Int, b: Int): Int {
    return a + b
}
//sampleEnd

fun main() {
    print("sum of 3 and 5 is ")
    println(sum(3, 5))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-return-int"}

函数体可以是一个表达式。它的返回类型是推断出来的：

```kotlin
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-expression"}

一个不返回有意义值的函数：

```kotlin
//sampleStart
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-return-unit"}

`Unit` 返回类型可以省略：

```kotlin
//sampleStart
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-omit-unit"}

参见 [函数](functions.md)。

## 变量

在 Kotlin 中，你可以使用关键字 `val` 或 `var` 来声明变量，后跟变量名。

使用 `val` 关键字声明只赋值一次的变量。这些是不可变的、只读的局部变量，初始化后不能重新赋值不同的值：

```kotlin
fun main() {
//sampleStart
    // Declares the variable x and initializes it with the value of 5
    val x: Int = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-val"}

使用 `var` 关键字声明可以重新赋值的变量。这些是可变变量，你可以在初始化后更改它们的值：

```kotlin
fun main() {
//sampleStart
    // Declares the variable x and initializes it with the value of 5
    var x: Int = 5
    // Reassigns a new value of 6 to the variable x
    x += 1
    // 6
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-var"}

Kotlin 支持类型推断 (type inference) 并自动识别声明变量的数据类型。声明变量时，你可以省略变量名后的类型：

```kotlin
fun main() {
//sampleStart
    // Declares the variable x with the value of 5;`Int` type is inferred
    val x = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-inference"}

你只能在初始化变量后使用它们。你可以在声明变量时初始化，也可以先声明变量再稍后初始化。在后一种情况下，你必须指定数据类型：

```kotlin
fun main() {
//sampleStart
    // Initializes the variable x at the moment of declaration; type is not required
    val x = 5
    // Declares the variable c without initialization; type is required
    val c: Int
    // Initializes the variable c after declaration 
    c = 3
    // 5 
    // 3
//sampleEnd
    println(x)
    println(c)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-initialize"}

你可以在顶层声明变量：

```kotlin
//sampleStart
val PI = 3.14
var x = 0

fun incrementX() {
    x += 1
}
// x = 0; PI = 3.14
// incrementX()
// x = 1; PI = 3.14
//sampleEnd

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-variable-top-level"}

有关声明属性的信息，请参见 [属性](properties.md)。

## 创建类和实例

要定义一个类，请使用 `class` 关键字：
```kotlin
class Shape
```

类的属性可以列在其声明或主体中：

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

类声明中列出参数的默认构造函数会自动提供：

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
fun main() {
    val rectangle = Rectangle(5.0, 2.0)
    println("The perimeter is ${rectangle.perimeter}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-class-constructor"}

类之间的继承通过冒号 (`:`) 声明。类默认是 `final` 的；要使一个类可继承，请将其标记为 `open`：

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

有关构造函数和继承的更多信息，请参见 [类](classes.md) 和 [对象与实例](object-declarations.md)。

## 注释

和大多数现代语言一样，Kotlin 支持单行（或 _行末_）注释和多行（_块_）注释：

```kotlin
// This is an end-of-line comment

/* This is a block comment
   on multiple lines. */
```

Kotlin 中的块注释可以嵌套：

```kotlin
/* The comment starts here
/* contains a nested comment */     
and ends here. */
```

有关文档注释语法的更多信息，请参见 [Kotlin 代码文档](kotlin-doc.md)。

## 字符串模板

```kotlin
fun main() {
//sampleStart
    var a = 1
    // simple name in template:
    val s1 = "a is $a" 
    
    a = 2
    // arbitrary expression in template:
    val s2 = "${s1.replace("is", "was")}, but now is $a"
//sampleEnd
    println(s2)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-string-templates"}

有关详细信息，请参见 [字符串模板](strings.md#string-templates)。

## 条件表达式

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-conditional-expressions"}

在 Kotlin 中，`if` 也可以用作表达式：

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-if-expression"}

参见 [`if`-表达式](control-flow.md#if-expression)。

## `for` 循环

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-for-loop"}

或者：

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("item at $index is ${items[index]}")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-for-loop-indices"}

参见 [`for` 循环](control-flow.md#for-loops)。

## `while` 循环

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")
        index++
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-while-loop"}

参见 [`while` 循环](control-flow.md#while-loops)。

## `when` 表达式

```kotlin
//sampleStart
fun describe(obj: Any): String =
    when (obj) {
        1          -> "One"
        "Hello"    -> "Greeting"
        is Long    -> "Long"
        !is String -> "Not a string"
        else       -> "Unknown"
    }
//sampleEnd

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-when-expression"}

参见 [`when` 表达式和语句](control-flow.md#when-expressions-and-statements)。

## 区间

使用 `in` 运算符检查数字是否在区间内：

```kotlin
fun main() {
//sampleStart
    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-range-in"}

检查数字是否超出区间：

```kotlin
fun main() {
//sampleStart
    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range")
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range, too")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-out-of-range"}

迭代区间：

```kotlin
fun main() {
//sampleStart
    for (x in 1..5) {
        print(x)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-range"}

或者迭代一个数列 (progression)：

```kotlin
fun main() {
//sampleStart
    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-progression"}

参见 [区间和数列](ranges.md)。

## 集合

迭代集合：

```kotlin
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")
//sampleStart
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-collection"}

使用 `in` 运算符检查集合是否包含某个对象：

```kotlin
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")
//sampleStart
    when {
        "orange" in items -> println("juicy")
        "apple" in items -> println("apple is fine too")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-collection-in"}

使用 [lambda 表达式](lambdas.md) 过滤和映射集合：

```kotlin
fun main() {
//sampleStart
    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.uppercase() }
      .forEach { println(it) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-collection-filter-map"}

参见 [集合概述](collections-overview.md)。

## 可空值和空检查

当可能出现 `null` 值时，引用必须显式标记为可空。可空类型名称末尾带有 `?`。

如果 `str` 不包含整数，则返回 `null`：

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

使用返回可空值的函数：

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

//sampleStart
fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // `x * y` 会报错，因为它们可能持有 null。
    if (x != null && y != null) {
        // 在空检查后，`x` 和 `y` 会自动转换为非可空类型
        println(x * y)
    }
    else {
        println("'$arg1' or '$arg2' is not a number")
    }    
}
//sampleEnd

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-nullable-value"}

或者：

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)
    
//sampleStart
    // ...
    if (x == null) {
        println("Wrong number format in arg1: '$arg1'")
        return
    }
    if (y == null) {
        println("Wrong number format in arg2: '$arg2'")
        return
    }

    // 在空检查后，`x` 和 `y` 会自动转换为非可空类型
    println(x * y)
//sampleEnd
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-null-check"}

参见 [空安全](null-safety.md)。

## 类型检查和自动类型转换

`is` 运算符检查表达式是否是某个类型的实例。
如果一个不可变的局部变量或属性被检查为特定类型，则无需显式地进行类型转换：

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // 在此分支中，`obj` 会自动转换为 `String` 类型
        return obj.length
    }

    // 在类型检查分支之外，`obj` 仍然是 `Any` 类型
    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("获取 '$obj' 的长度。结果：${getStringLength(obj) ?: "错误：该对象不是字符串"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator"}

或者：

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // 在此分支中，`obj` 会自动转换为 `String` 类型
    return obj.length
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("获取 '$obj' 的长度。结果：${getStringLength(obj) ?: "错误：该对象不是字符串"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-expression"}

甚至：

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    // 在 `&&` 的右侧，`obj` 会自动转换为 `String` 类型
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("获取 '$obj' 的长度。结果：${getStringLength(obj) ?: "错误：该对象不是字符串"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-logic"}

参见 [类](classes.md) 和 [类型转换](typecasts.md)。