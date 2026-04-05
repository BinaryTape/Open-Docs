[//]: # (title: 基本语法概览)

这是基本语法元素的集合及示例。在每个部分的末尾，您都会找到指向相关主题详细说明的链接。

您还可以通过 JetBrains Academy 免费的 [Kotlin 核心轨道](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 学习所有 Kotlin 核心知识。

## 包定义与导入

包规范应位于源文件的顶部：

```kotlin
package my.demo

import kotlin.text.*

// ...
```

不要求目录与包匹配：源文件可以任意放置在文件系统中。

请参阅[包](packages.md)。

## 程序入口点

Kotlin 应用程序的入口点是 `main` 函数：

```kotlin
fun main() {
    println("Hello world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-hello-world"}

`main` 的另一种形式接受可变实参数量 的 `String` 实参： 

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 打印到标准输出

`print` 将其实参打印到标准输出：

```kotlin
fun main() {
//sampleStart
    print("Hello ")
    print("world!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-print"}

`println` 打印其实参并添加换行符，以便下次打印的内容出现在下一行：

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

`readln()` 函数从标准输入读取。该函数将用户输入的整行内容读取为字符串。

您可以将 `println()`、`readln()` 和 `print()` 函数结合使用，以打印请求和显示用户输入的消息：

```kotlin
// 打印一条消息以请求输入
println("Enter any word: ")

// 读取并存储用户输入。例如：Happiness
val yourWord = readln()

// 打印包含输入内容的消息
print("You entered the word: ")
print(yourWord)
// You entered the word: Happiness
```

欲了解更多信息，请参阅[读取标准输入](read-standard-input.md)。

## 函数

一个包含两个 `Int` 形参且返回值类型为 `Int` 的函数：

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

函数体可以是表达式。其返回值类型是推断出来的：

```kotlin
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-expression"}

不返回有意义值的函数：

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

`Unit` 返回值类型可以省略：

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

请参阅[函数](functions.md)。

## 变量

在 Kotlin 中，声明变量时以关键字 `val` 或 `var` 开头，后跟变量名称。

使用 `val` 关键字声明只能赋值一次的变量。它们是不可变的、只读的局部变量，在初始化后无法重新赋值为不同的值： 

```kotlin
fun main() {
//sampleStart
    // 声明变量 x 并使用值 5 进行初始化
    val x: Int = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-val"}

使用 `var` 关键字声明可以重新赋值的变量。这些是可变变量，您可以在初始化后更改它们的值：

```kotlin
fun main() {
//sampleStart
    // 声明变量 x 并使用值 5 进行初始化
    var x: Int = 5
    // 为变量 x 重新赋值为 6
    x += 1
    // 6
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-var"}

Kotlin 支持类型推断并自动识别声明变量的数据类型。声明变量时，可以省略变量名后的类型：

```kotlin
fun main() {
//sampleStart
    // 声明变量 x，值为 5；推断为 `Int` 类型
    val x = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-inference"}

您只能在初始化变量后使用它们。您可以在声明时初始化变量，也可以先声明变量然后再初始化。在第二种情况下，必须指定数据类型：

```kotlin
fun main() {
//sampleStart
    // 在声明时初始化变量 x；不需要指定类型
    val x = 5
    // 声明变量 c 但不进行初始化；需要指定类型
    val c: Int
    // 在声明后初始化变量 c 
    c = 3
    // 5 
    // 3
//sampleEnd
    println(x)
    println(c)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-initialize"}

您可以在顶层声明变量：

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

有关声明属性的信息，请参阅[属性](properties.md)。

## 创建类与实例

要定义类，请使用 `class` 关键字：
```kotlin
class Shape
```

类的属性可以列在其声明或正文中： 

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

类声明中列出的带形参默认构造函数可自动使用：

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

类之间的继承由冒号 (`:`) 声明。类默认是 `final` 的；要使类可继承，请将其标记为 `open`：

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

欲了解有关构造函数和继承的更多信息，请参阅[类](classes.md)以及[对象与实例](object-declarations.md)。

## 注释

与大多数现代语言一样，Kotlin 支持单行（或行末）注释和多行（块）注释：

```kotlin
// 这是一条行末注释

/* 这是一条多行
   块注释。 */
```

Kotlin 中的块注释可以嵌套：

```kotlin
/* 注释从这里开始
/* 包含一个嵌套注释 *​/  
到这里结束。 */
```

有关文档注释语法的详细信息，请参阅[编写 Kotlin 代码文档](kotlin-doc.md)。

## 字符串模板

```kotlin
fun main() {
//sampleStart
    var a = 1
    // 模板中的简单名称：
    val s1 = "a is $a" 
    
    a = 2
    // 模板中的任意表达式：
    val s2 = "${s1.replace("is", "was")}, but now is $a"
//sampleEnd
    println(s2)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-string-templates"}

详情请参阅[字符串模板](strings.md#string-templates)。

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

请参阅 [`if` 表达式](control-flow.md#if-expression)。

## for 循环

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

请参阅 [for 循环](control-flow.md#for-loops)。

## while 循环

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

请参阅 [while 循环](control-flow.md#while-loops)。

## when 表达式

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

请参阅 [when 表达式与语句](control-flow.md#when-expressions-and-statements)。

## 区间

使用 `in` 运算符检查数字是否在某个区间内：

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

检查数字是否在区间外：

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

在区间上进行迭代：

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

或者在级数上进行迭代：

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

请参阅[区间与级数](ranges.md)。

## 集合

在集合上进行迭代：

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

使用 [lambda表达式](lambdas.md) 过滤和映射集合：

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

请参阅[集合概览](collections-overview.md)。

## 可空值与 null 检查

当可能出现 `null` 值时，引用必须显式标记为可空。可空类型的名称末尾带有 `?`。
例如，`Int?`。

如果 `str` 不包含整数，则返回 `null`：

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
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

    // 使用 `x * y` 会报错，因为它们可能持有 null。
    if (x != null && y != null) {
        // x 和 y 在进行 null 检查后会自动转换为非空类型
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

    // x 和 y 在进行 null 检查后会自动转换为非空类型
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

请参阅 [Null 安全](null-safety.md)。

## 类型检查与自动转换

`is` 运算符检查表达式是否为某种类型的实例。
如果对不可变的局部变量或属性进行了特定类型的检查，则无需显式进行转换：

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // `obj` 在此分支中自动转换为 `String`
        return obj.length
    }

    // 在类型检查分支外，`obj` 仍为 `Any` 类型
    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
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

    // `obj` 在此分支中自动转换为 `String`
    return obj.length
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-expression"}

甚至可以：

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    // `obj` 在 `&&` 的右侧自动转换为 `String`
    if (obj is String && obj.length >= 0) {
        return obj.length
    }

    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-logic"}

请参阅[类](classes.md)和[类型转换](typecasts.md)。