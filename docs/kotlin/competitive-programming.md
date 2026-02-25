[//]: # (title: Kotlin 用于算法竞赛)

本教程既面向以前没用过 Kotlin 的算法竞赛 (Competitive programming) 选手，也面向以前没参加过算法竞赛的 Kotlin 开发者。本教程假设读者具备相应的编程技能。

[算法竞赛](https://en.wikipedia.org/wiki/Competitive_programming)是一项智力运动，参赛者编写程序，在严格的约束条件下解决明确定义的算法问题。问题的范围很广，从任何软件开发工程师都能解决且只需少量代码即可得到正确解的简单问题，到需要掌握专门算法、数据结构并经过大量练习的复杂问题。虽然 Kotlin 并非专门为算法竞赛而设计，但它却恰好非常适合这一领域，它减少了程序员在处理代码时需要编写和阅读的典型模板代码 (boilerplate) 数量，几乎达到了动态类型脚本语言的水平，同时又具备静态类型语言的工具链支持与性能。

要了解更多关于如何在 IntelliJ IDEA 中创建 Kotlin 项目的信息，请参阅[创建控制台应用](jvm-get-started.md)教程。在算法竞赛中，通常会创建一个项目，并将每个问题的解法编写在单个源文件中。

## 简单示例：Reachable Numbers 问题

让我们来看一个具体的例子。

[Codeforces](https://codeforces.com/) 第 555 轮比赛于 4 月 26 日针对第 3 分部 (3rd Division) 举行，这意味着其中的题目适合任何开发者尝试。你可以通过[此链接](https://codeforces.com/contest/1157)阅读题目。该题目集中最简单的题目是 [Problem A: Reachable Numbers](https://codeforces.com/contest/1157/problem/A)。它要求实现题目说明中描述的一个简单算法。

我们首先创建一个名称任意的 Kotlin 源文件来解决它，例如 `A.kt`。首先，你需要实现题目说明中指定的函数：

我们按以下方式定义函数 f(x)：我们将 x 加 1，然后，只要结果数字中至少有一个尾随零，我们就删除该零。

Kotlin 是一门务实且不拘一格的语言，支持命令式和函数式编程风格，而不会强迫开发者选择其中任何一种。你可以使用 Kotlin 的[尾递归 (tail recursion)](functions.md#tail-recursive-functions) 等功能，以函数式风格实现函数 `f`：

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

或者，你也可以使用传统的 [while 循环](control-flow.md)和在 Kotlin 中由 [var](basic-syntax.md#variables) 表示的可变变量来编写函数 `f` 的命令式实现：

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

由于广泛使用了类型推断，Kotlin 中的类型在许多地方都是可选的，但每个声明仍然具有在编译时已知的明确定义的静态类型。

现在，剩下的工作就是编写 main 函数来读取输入，并实现题目要求的算法其余部分 —— 计算对标准输入中给出的初始数字 `n` 反复应用函数 `f` 时产生的不同整数的数量。

默认情况下，Kotlin 运行在 JVM 上，可以直接访问丰富且高效的集合库，其中包含通用集合和数据结构，如动态大小的数组 (`ArrayList`)、基于哈希的映射和集合 (`HashMap`/`HashSet`)、基于树的有序映射和集合 (`TreeMap`/`TreeSet`)。使用整数哈希集合来跟踪应用函数 `f` 时已经达到的值，该问题的直观命令式版本解法可以编写如下：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // 从输入读取整数
    val reached = HashSet<Int>() // 一个可变哈希集合 
    while (reached.add(n)) n = f(n) // 迭代函数 f
    println(reached.size) // 向输出打印答案
}
```

在算法竞赛中，不需要处理格式错误的输入。算法竞赛中的输入格式总是被精确指定的，实际输入不会偏离题目说明中的输入规范。这就是为什么你可以使用 Kotlin 的 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函数。它断言输入字符串存在，否则抛出异常。同样，如果输入字符串不是整数，[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 函数会抛出异常。

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 从输入读取整数
    val reached = HashSet<Int>() // 一个可变哈希集合 
    while (reached.add(n)) n = f(n) // 迭代函数 f
    println(reached.size) // 向输出打印答案
}
```

请注意在 [`readLine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 函数调用后使用了 Kotlin 的[非空断言运算符](null-safety.md#not-null-assertion-operator) `!!`。Kotlin 的 `readLine()` 函数被定义为返回[可空类型](null-safety.md#nullable-types-and-non-nullable-types) `String?`，并在输入结束时返回 `null`，这明确强制开发者处理缺少输入的情况。

在算法竞赛中，不需要处理格式错误的输入。在算法竞赛中，输入格式总是被精确指定的，实际输入不会偏离题目说明中的输入规范。这就是非空断言运算符 `!!` 的本质作用 —— 它断言输入字符串存在，否则抛出异常。同样，还有 [`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)。

</tab>
</tabs>

所有的在线算法竞赛都允许使用预先编写的代码，因此你可以定义自己的针对算法竞赛的工具函数库，使你的实际解法代码更易于阅读和编写。然后，你将使用此代码作为解法的模板。例如，你可以定义以下辅助函数，用于在算法竞赛中读取输入：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 读取字符串行
private fun readInt() = readStr().toInt() // 读取单个整数
// 类似地处理你在解法中会用到的其他类型
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 读取字符串行
private fun readInt() = readStr().toInt() // 读取单个整数
// 类似地处理你在解法中会用到的其他类型
```

</tab>
</tabs>

请注意此处 `private` [可见性修饰符](visibility-modifiers.md)的使用。虽然可见性修饰符的概念与算法竞赛完全无关，但它允许你基于相同的模板放置多个解题文件，而不会因同一软件包中存在冲突的公共声明而报错。

## 函数式操作符示例：Long Number 问题

对于更复杂的问题，Kotlin 丰富的集合函数式操作库就排上了用场，它可以最大限度地减少模板代码，并将代码转换为线性、自顶向下且自左向右的流式数据转换流水线。例如，[Problem B: Long Number](https://codeforces.com/contest/1157/problem/B) 问题采用简单的贪心算法即可实现，并且可以使用这种风格编写，无需使用单个可变变量：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    // 读取输入
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // 定义局部函数 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 贪心地查找起始和结束索引
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 构建并写入答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    // 读取输入
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // 定义局部函数 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 贪心地查找起始和结束索引
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 构建并写入答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

在这段紧凑的代码中，除了集合转换之外，你还可以看到一些方便的 Kotlin 功能，如局部函数和 [Elvis 运算符](null-safety.md#elvis-operator) `?:`。它们允许使用类似 `.takeIf { it >= 0 } ?: s.length` 这样简洁易读的表达式来表达诸如“如果值为正则取该值，否则使用长度”之类的[习惯用法 (idioms)](idioms.md)，但 Kotlin 也完全允许创建额外的可变变量并以命令式风格表达相同的代码。

为了使读取此类算法竞赛任务中的输入更加简洁，你可以准备以下读取输入的辅助函数列表：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 读取字符串行
private fun readInt() = readStr().toInt() // 读取单个整数
private fun readStrings() = readStr().split(" ") // 读取字符串列表
private fun readInts() = readStrings().map { it.toInt() } // 读取整数列表
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 读取字符串行
private fun readInt() = readStr().toInt() // 读取单个整数
private fun readStrings() = readStr().split(" ") // 读取字符串列表
private fun readInts() = readStrings().map { it.toInt() } // 读取整数列表
```

</tab>
</tabs>

有了这些辅助程序，读取输入的代码部分变得更加简单，可以逐行紧跟题目说明中的输入规范：

```kotlin
// 读取输入
val n = readInt()
val s = readStr()
val fl = readInts()
```

请注意，在算法竞赛中，通常给变量起的名字比工业编程实践中常见的名字要短，因为代码只需编写一次，此后不再维护。然而，这些名称通常仍然具有助记性 —— `a` 表示数组，`i`、`j` 等表示索引，`r` 和 `c` 表示表中的行号和列号，`x` 和 `y` 表示坐标等。将输入数据保持与题目说明中给出的名称一致会更容易。但是，更复杂的问题需要更多的代码，这会导致使用更长的自解释变量和函数名称。

## 更多提示和技巧

算法竞赛题目通常有如下输入：

输入的第一行包含两个整数 `n` 和 `k`

在 Kotlin 中，可以使用以下语句，通过整数列表的[析构声明 (destructuring declaration)](destructuring-declarations.md) 简洁地解析这一行：

```kotlin
val (n, k) = readInts()
```

人们可能会倾向于使用 JVM 的 `java.util.Scanner` 类来解析结构较少的输入格式。Kotlin 旨在与 JVM 库良好互操作，因此在 Kotlin 中使用它们感觉非常自然。但是，请注意 `java.util.Scanner` 非常慢。事实上，慢到用它解析 10<sup>5</sup> 个或更多整数可能无法在典型的 2 秒时限内完成，而简单的 Kotlin `split(" ").map { it.toInt() }` 却能轻松处理。

在 Kotlin 中，通过 [`println(...)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 调用并使用 Kotlin 的[字符串模板](strings.md#string-templates)来编写输出通常非常简单。但是，当输出包含约 10<sup>5</sup> 行或更多时，必须格外小心。发出这么多 `println` 调用太慢了，因为 Kotlin 中的输出在每行之后都会自动刷新。从数组或列表中写入多行的更快方法是使用 [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函数，并以 `"
"` 作为分隔符，如下所示：

```kotlin
println(a.joinToString("
")) // 将数组/列表的每个元素打印在单独的一行
```

## 学习 Kotlin

Kotlin 易于学习，特别是对于那些已经了解 Java 的人来说。针对软件开发者的 Kotlin 基本语法简短介绍可以直接在网站的参考部分找到，从[基本语法](basic-syntax.md)开始。

IDEA 内置了 [Java 到 Kotlin 转换器](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)。熟悉 Java 的人可以用它来学习相应的 Kotlin 语法结构，但它并不完美，仍然值得去熟悉 Kotlin 并学习 [Kotlin 习惯用法](idioms.md)。

学习 Kotlin 语法和 Kotlin 标准库 API 的绝佳资源是 [Kotlin Koans](koans.md)。