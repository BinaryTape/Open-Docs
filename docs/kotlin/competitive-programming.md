---
title: "Kotlin 竞赛编程"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本教程专为之前没有使用过 Kotlin 的竞赛程序员和之前没有参加过任何竞赛编程活动的 Kotlin 开发人员设计。 本教程假设读者具备相应的编程技能。

[竞赛编程](https://en.wikipedia.org/wiki/Competitive_programming) 是一种智力运动，参赛者编写程序以在严格的约束条件下解决精确指定的算法问题。 问题范围可能从任何软件开发人员都可以解决的简单问题（只需要少量代码即可获得正确的解决方案），到需要特殊算法、数据结构和大量实践知识的复杂问题。 虽然 Kotlin 并非专门为竞赛编程而设计，但它恰好非常适合该领域，从而减少了程序员在处理代码时需要编写和阅读的样板代码量，几乎达到了动态类型脚本语言提供的水平，同时具有静态类型语言的工具和性能。

请参阅 [Kotlin/JVM 入门](jvm-get-started) 了解如何设置 Kotlin 的开发环境。 在竞赛编程中，通常创建一个项目，并将每个问题的解决方案写在单个源文件中。

## 简单示例：Reachable Numbers（可达数字）问题

让我们看一个具体的例子。

[Codeforces](https://codeforces.com/) 第 555 轮比赛于 4 月 26 日为第 3 赛区举行，这意味着它有一些适合任何开发人员尝试的问题。 您可以使用[此链接](https://codeforces.com/contest/1157)阅读问题。 该集合中最简单的问题是 [Problem A: Reachable Numbers](https://codeforces.com/contest/1157/problem/A)。 它要求实现问题陈述中描述的简单算法。

我们将从创建一个具有任意名称的 Kotlin 源文件开始解决它。 `A.kt` 会很好。 首先，你需要实现问题陈述中指定的一个函数：

让我们用以下方式表示一个函数 f(x)：我们将 x 加 1，然后，只要结果数字中至少有一个尾随零，我们就删除该零。

Kotlin 是一种务实且不带主观意见的语言，它支持命令式和函数式编程风格，而不会将开发人员推向任何一种风格。 你可以使用 Kotlin 的一些特性（例如 [尾递归](functions#tail-recursive-functions)）以函数式风格实现函数 `f`：

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

或者，你可以使用传统的 [while 循环](control-flow) 和在 Kotlin 中用 [var](basic-syntax#variables) 表示的可变变量来编写函数 `f` 的命令式实现：

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

由于类型推断的广泛使用，Kotlin 中的类型在很多地方是可选的，但每个声明仍然具有在编译时已知的明确定义的静态类型。

现在，剩下的就是编写 main 函数，该函数读取输入并实现问题陈述要求的算法的其余部分，即计算在重复将函数 `f` 应用于标准输入中给定的初始数字 `n` 时产生的不同整数的数量。

默认情况下，Kotlin 在 JVM 上运行，并可以直接访问丰富而高效的集合库，其中包含通用集合和数据结构，例如动态大小的数组 (`ArrayList`)、基于哈希的映射和集合 (`HashMap`/`HashSet`)、基于树的有序映射和集合 (`TreeMap`/`TreeSet`)。 使用整数的哈希集合来跟踪在应用函数 `f` 时已到达的值，可以编写如下所示的简单命令式解决方案：

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 及更高版本" default>

```kotlin
fun main() {
    var n = readln().toInt() // 从输入中读取整数
    val reached = HashSet<Int>() // 一个可变的哈希集合
    while (reached.add(n)) n = f(n) // 迭代函数 f
    println(reached.size) // 将答案打印到输出
}
```

在竞赛编程中，无需处理格式错误的输入。 在竞赛编程中，输入格式始终在竞赛编程中精确指定，并且实际输入不能偏离问题陈述中的输入规范。 这就是你可以使用 Kotlin 的 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函数的原因。 它断言输入字符串存在，否则会抛出异常。 同样，如果输入字符串不是整数，则 [`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 函数会抛出异常。

</TabItem>
<TabItem value="kotlin-1-5" label="早期版本" default>

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 从输入中读取整数
    val reached = HashSet<Int>() // 一个可变的哈希集合
    while (reached.add(n)) n = f(n) // 迭代函数 f
    println(reached.size) // 将答案打印到输出
}
```

请注意 Kotlin 的 [非空断言运算符](null-safety#not-null-assertion-operator) `!!` 在 [readLine()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 函数调用之后的使用。 Kotlin 的 `readLine()` 函数定义为返回一个 [可空类型](null-safety#nullable-types-and-non-nullable-types) `String?` 并在输入结束时返回 `null`，这明确地强制开发人员处理缺少输入的情况。

在竞赛编程中，无需处理格式错误的输入。 在竞赛编程中，输入格式始终在竞赛编程中精确指定，并且实际输入不能偏离问题陈述中的输入规范。 这就是非空断言运算符 `!!` 的本质——它断言输入字符串存在，否则会抛出异常。 同样，[String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)。

</TabItem>
</Tabs>

所有在线竞赛编程活动都允许使用预先编写的代码，因此你可以定义自己的面向竞赛编程的实用函数库，以使你的实际解决方案代码更易于阅读和编写。 然后，你将使用此代码作为解决方案的模板。 例如，你可以定义以下辅助函数来读取竞赛编程中的输入：

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 及更高版本" default>

```kotlin
private fun readStr() = readln() // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
// 类似地适用于你将在解决方案中使用的其他类型
```

</TabItem>
<TabItem value="kotlin-1-5" label="早期版本" default>

```kotlin
private fun readStr() = readLine()!! // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
// 类似地适用于你将在解决方案中使用的其他类型
```

</TabItem>
</Tabs>

请注意此处的 `private` [可见性修饰符](visibility-modifiers) 的使用。 虽然可见性修饰符的概念与竞赛编程完全无关，但它允许你放置多个基于同一模板的解决方案文件，而不会因同一包中冲突的公共声明而导致错误。

## 函数式运算符示例：Long Number（长数字）问题

对于更复杂的问题，Kotlin 丰富的集合函数式操作库可以方便地最大限度地减少样板代码，并将代码转换为从上到下、从左到右的线性流畅数据转换管道。 例如，[Problem B: Long Number](https://codeforces.com/contest/1157/problem/B) 问题需要实现一个简单的贪心算法，可以使用这种风格编写，而无需任何可变变量：

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 及更高版本" default>

```kotlin
fun main() {
    // 读取输入
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // 定义局部函数 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 贪婪地查找第一个和最后一个索引
    val i = s.indexOfFirst { c `->` f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) `->` j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 组合并写入答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c `->` f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</TabItem>
<TabItem value="kotlin-1-5" label="早期版本" default>

```kotlin
fun main() {
    // 读取输入
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // 定义局部函数 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 贪婪地查找第一个和最后一个索引
    val i = s.indexOfFirst { c `->` f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) `->` j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 组合并写入答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c `->` f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</TabItem>
</Tabs>

在这段密集的代码中，除了集合转换之外，你还可以看到一些方便的 Kotlin 特性，例如局部函数和 [elvis 运算符](null-safety#elvis-operator) `?:`，它们允许使用简洁且可读的表达式（例如 `.takeIf { it >= 0 } ?: s.length`）来表达 [成语](idioms)，如“如果该值为正数则取该值，否则使用长度”，但 Kotlin 完全可以使用额外的可变变量并以命令式风格表达相同的代码。

为了使读取竞赛编程任务中的输入更简洁，你可以使用以下辅助输入读取函数列表：

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 及更高版本" default>

```kotlin
private fun readStr() = readln() // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
private fun readStrings() = readStr().split(" ") // 字符串列表
private fun readInts() = readStrings().map { it.toInt() } // 整数列表
```

</TabItem>
<TabItem value="kotlin-1-5" label="早期版本" default>

```kotlin
private fun readStr() = readLine()!! // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
private fun readStrings() = readStr().split(" ") // 字符串列表
private fun readInts() = readStrings().map { it.toInt() } // 整数列表
```

</TabItem>
</Tabs>

使用这些辅助函数，读取输入的代码部分变得更简单，并逐行紧跟问题陈述中的输入规范：

```kotlin
// 读取输入
val n = readInt()
val s = readStr()
val fl = readInts()
```

请注意，在竞赛编程中，习惯上给变量起比工业编程实践中通常更短的名称，因为代码只需编写一次，之后不再支持。 但是，这些名称通常仍然是助记符——`a` 用于数组，`i`、`j` 等用于索引，`r` 和 `c` 用于表中的行号和列号，`x` 和 `y` 用于坐标，等等。 对于输入数据，保留与问题陈述中给出的名称相同的名称更容易。 但是，更复杂的问题需要更多的代码，这导致使用更长的自解释变量和函数名称。

## 更多提示和技巧

竞赛编程问题通常具有如下输入：

输入的第一行包含两个整数 `n` 和 `k`

在 Kotlin 中，可以使用以下语句，使用 [解构声明](destructuring-declarations) 从整数列表中简洁地解析此行：

```kotlin
val (n, k) = readInts()
```

使用 JVM 的 `java.util.Scanner` 类来解析结构化程度较低的输入格式可能很诱人。 Kotlin 旨在与 JVM 库很好地互操作，因此它们在 Kotlin 中的使用感觉非常自然。 但是，请注意 `java.util.Scanner` 非常慢。 实际上，它的速度太慢了，以至于使用它解析 10<sup>5</sup> 个或更多整数可能不符合典型的 2 秒时间限制，而简单的 Kotlin 的 `split(" ").map { it.toInt() }` 可以处理。

使用 [println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 调用和使用 Kotlin 的 [字符串模板](strings#string-templates) 通常可以轻松地在 Kotlin 中编写输出。 但是，当输出包含 10<sup>5</sup> 行或更多行时，必须小心。 发出如此多的 `println` 调用太慢了，因为 Kotlin 中的输出在每行之后会自动刷新。 从数组或列表写入多行的更快方法是使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函数，其中 `"
"` 作为分隔符，如下所示：

```kotlin
println(a.joinToString("
")) // 数组/列表 a 的每个元素都在单独的一行上
```

## 学习 Kotlin

Kotlin 很容易学习，特别是对于那些已经了解 Java 的人。
可以直接在网站的参考部分找到针对软件开发人员的 Kotlin 基本语法的简短介绍，从 [基本语法](basic-syntax) 开始。

IDEA 内置了 [Java-to-Kotlin 转换器](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)。 熟悉 Java 的人可以使用它来学习相应的 Kotlin 语法结构，但它并不完美，仍然值得熟悉 Kotlin 并学习 [Kotlin 成语](idioms)。

一个学习 Kotlin 语法和 Kotlin 标准库 API 的绝佳资源是 [Kotlin Koans](koans)。