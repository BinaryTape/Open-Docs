---
title: 基本语法
---
这是一个包含基本语法元素的集合，并附有示例。在每个章节的末尾，你会找到一个链接，指向相关主题的详细描述。

你还可以通过 JetBrains Academy 提供的免费 [Kotlin Core 学习路径](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)学习所有 Kotlin 基础知识。

## 包定义和导入

包规范应该位于源文件的顶部：

```kotlin
package my.demo

import kotlin.text.*

// ...
```

目录和包不是必须匹配的：源文件可以任意放置在文件系统中。

参见 [包 (Packages)](packages)。

## 程序入口点

Kotlin 应用程序的入口点是 `main` 函数：

```kotlin
fun main() {
    println("Hello world!")
}
```

另一种形式的 `main` 接受可变数量的 `String` 参数：

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```

## 打印到标准输出

`print` 将其参数打印到标准输出：

```kotlin
fun main() {

    print("Hello ")
    print("world!")

}
```

`println` 打印其参数并添加换行符，因此你打印的下一个内容将出现在下一行：

```kotlin
fun main() {

    println("Hello world!")
    println(42)

}
```

## 从标准输入读取

`readln()` 函数从标准输入读取。这个函数读取用户输入的整行，作为字符串。

你可以将 `println()`、`readln()` 和 `print()` 函数一起使用，来打印消息，请求和显示用户输入：

```kotlin
// 打印一条消息来请求输入
println("Enter any word: ")

// 读取并存储用户输入。例如：Happiness
val yourWord = readln()

// 打印一条带有输入的消息
print("You entered the word: ")
print(yourWord)
// You entered the word: Happiness
```

更多信息请参考 [读取标准输入 (Read standard input)](read-standard-input)。

## 函数

一个带有两个 `Int` 参数和 `Int` 返回类型的函数：

```kotlin

fun sum(a: Int, b: Int): Int {
    return a + b
}

fun main() {
    print("sum of 3 and 5 is ")
    println(sum(3, 5))
}
```

函数体可以是一个表达式。它的返回类型会被推断：

```kotlin

fun sum(a: Int, b: Int) = a + b

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```

一个不返回有意义的值的函数：

```kotlin

fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}

fun main() {
    printSum(-1, 8)
}
```

`Unit` 返回类型可以省略：

```kotlin

fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}

fun main() {
    printSum(-1, 8)
}
```

参见 [函数 (Functions)](functions)。

## 变量

在 Kotlin 中，你可以使用关键字 `val` 或 `var` 开始声明一个变量，后跟变量的名称。

使用 `val` 关键字声明只赋值一次的变量。这些是不可变的、只读的局部变量，初始化后不能重新赋值不同的值：

```kotlin
fun main() {

    // 声明变量 x 并将其初始化为 5
    val x: Int = 5
    // 5

    println(x)
}
```

使用 `var` 关键字声明可以重新赋值的变量。这些是可变变量，你可以在初始化后更改它们的值：

```kotlin
fun main() {

    // 声明变量 x 并将其初始化为 5
    var x: Int = 5
    // 将变量 x 重新赋值为 6
    x += 1
    // 6

    println(x)
}
```

Kotlin 支持类型推断，并自动识别已声明变量的数据类型。声明变量时，可以省略变量名后的类型：

```kotlin
fun main() {

    // 声明变量 x，值为 5；推断类型为 `Int`
    val x = 5
    // 5

    println(x)
}
```

你只能在使用变量后才能使用它们。你可以在声明时初始化变量，也可以先声明变量，然后再初始化它。
在第二种情况下，你必须指定数据类型：

```kotlin
fun main() {

    // 在声明时初始化变量 x；不需要类型
    val x = 5
    // 声明变量 c，不进行初始化；需要类型
    val c: Int
    // 在声明后初始化变量 c
    c = 3
    // 5
    // 3

    println(x)
    println(c)
}
```

你可以在顶层声明变量：

```kotlin

val PI = 3.14
var x = 0

fun incrementX() {
    x += 1
}
// x = 0; PI = 3.14
// incrementX()
// x = 1; PI = 3.14

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
```

有关声明属性的信息，请参见 [属性 (Properties)](properties)。

## 创建类和实例

要定义一个类，使用 `class` 关键字：
```kotlin
class Shape
```

类的属性可以在其声明或主体中列出：

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

带有在类声明中列出的参数的默认构造函数是自动可用的：

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
fun main() {
    val rectangle = Rectangle(5.0, 2.0)
    println("The perimeter is ${rectangle.perimeter}")
}
```

类之间的继承用冒号 (`:`) 声明。默认情况下，类是 `final` 的；要使一个类可继承，将其标记为 `open`：

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

有关构造函数和继承的更多信息，请参见 [类 (Classes)](classes) 和 [对象和实例 (Objects and instances)](object-declarations)。

## 注释

就像大多数现代语言一样，Kotlin 支持单行（或 _行尾_）和多行（_块_）注释：

```kotlin
// 这是一个行尾注释

/* 这是一个块注释
   在多行上。 */
```

Kotlin 中的块注释可以嵌套：

```kotlin
/* 注释从这里开始
/* 包含嵌套注释 */     
到这里结束。 */
```

有关文档注释语法的信息，请参见 [Kotlin 代码文档 (Documenting Kotlin Code)](kotlin-doc)。

## 字符串模板

```kotlin
fun main() {

    var a = 1
    // 模板中的简单名称：
    val s1 = "a is $a" 
    
    a = 2
    // 模板中的任意表达式：
    val s2 = "${s1.replace("is", "was")}, but now is $a"

    println(s2)
}
```

有关详细信息，请参见 [字符串模板 (String templates)](strings#string-templates)。

## 条件表达式

```kotlin

fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

在 Kotlin 中，`if` 也可以用作表达式：

```kotlin

fun maxOf(a: Int, b: Int) = if (a > b) a else b

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

参见 [`if`-表达式](control-flow#if-expression)。

## for 循环

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }

}
```

或者：

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("item at $index is ${items[index]}")
    }

}
```

参见 [for 循环](control-flow#for-loops)。

## while 循环

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")
        index++
    }

}
```

参见 [while 循环](control-flow#while-loops)。

## when 表达式

```kotlin

fun describe(obj: Any): String =
    when (obj) {
        1          `->` "One"
        "Hello"    `->` "Greeting"
        is Long    `->` "Long"
        !is String `->` "Not a string"
        else       `->` "Unknown"
    }

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}
```

参见 [when 表达式和语句](control-flow#when-expressions-and-statements)。

## 区间

使用 `in` 运算符检查一个数字是否在区间内：

```kotlin
fun main() {

    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range")
    }

}
```

检查一个数字是否超出区间：

```kotlin
fun main() {

    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range")
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range, too")
    }

}
```

遍历一个区间：

```kotlin
fun main() {

    for (x in 1..5) {
        print(x)
    }

}
```

或者遍历一个数列：

```kotlin
fun main() {

    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }

}
```

参见 [区间和数列 (Ranges and progressions)](ranges)。

## 集合

遍历一个集合：

```kotlin
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")

    for (item in items) {
        println(item)
    }

}
```

使用 `in` 运算符检查集合是否包含一个对象：

```kotlin
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")

    when {
        "orange" in items `->` println("juicy")
        "apple" in items `->` println("apple is fine too")
    }

}
```

使用 [Lambda 表达式 (lambda expressions)](lambdas)来过滤和映射集合：

```kotlin
fun main() {

    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.uppercase() }
      .forEach { println(it) }

}
```

参见 [集合概述 (Collections overview)](collections-overview)。

## 可空值和空值检查

当 `null` 值可能存在时，必须显式地将引用标记为可空。可空类型名称的末尾有 `?`。

如果 `str` 不包含整数，则返回 `null`：

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

使用一个返回可空值的函数：

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // 使用 `x * y` 会产生错误，因为它们可能包含 null。
    if (x != null && y != null) {
        // 在空值检查后，x 和 y 会自动转换为非空类型
        println(x * y)
    }
    else {
        println("'$arg1' or '$arg2' is not a number")
    }    
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
```

或者：

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // ...
    if (x == null) {
        println("Wrong number format in arg1: '$arg1'")
        return
    }
    if (y == null) {
        println("Wrong number format in arg2: '$arg2'")
        return
    }

    // 在空值检查后，x 和 y 会自动转换为非空类型
    println(x * y)

}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
```

参见 [空安全 (Null-safety)](null-safety)。

## 类型检查和自动转换

`is` 运算符检查一个表达式是否为某个类型的实例。
如果一个不可变的局部变量或属性被检查为特定类型，则不需要显式地转换它：

```kotlin

fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // 在这个分支中，`obj` 会自动转换为 `String`
        return obj.length
    }

    // 在类型检查分支之外，`obj` 仍然是 `Any` 类型
    return null
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

或者：

```kotlin

fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // 在这个分支中，`obj` 会自动转换为 `String`
    return obj.length
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

甚至：

```kotlin

fun getStringLength(obj: Any): Int? {
    // 在 `&&` 的右侧，`obj` 会自动转换为 `String`
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```

参见 [类 (Classes)](classes) 和 [类型转换 (Type casts)](typecasts)。