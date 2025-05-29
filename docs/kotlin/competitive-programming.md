[//]: # (title: Kotlin 助力算法竞赛)

本教程旨在帮助从未接触过 Kotlin 的算法竞赛程序员，以及从未参与过算法竞赛的 Kotlin 开发者。本教程假定读者具备相应的编程技能。

[算法竞赛 (Competitive programming)](https://en.wikipedia.org/wiki/Competitive_programming) 是一项智力运动，参赛者需要在严格的限制下，编写程序来解决精确定义的算法问题。问题难度从任何软件开发者都能解决的简单问题（只需少量代码即可获得正确答案），到需要特殊算法、数据结构知识和大量实践的复杂问题，不一而足。虽然 Kotlin 并非专门为算法竞赛设计，但它恰好非常适合这个领域，它将程序员在处理代码时通常需要编写和阅读的样板代码 (boilerplate) 量减少到接近动态类型脚本语言的水平，同时又具备静态类型 (statically-typed) 语言的工具支持和性能。

关于如何设置 Kotlin 开发环境，请参阅 [Kotlin/JVM 入门](jvm-get-started.md)。在算法竞赛中，通常只创建一个项目，每个问题的解决方案都写在一个源文件中。

## 简单示例：可达数问题

我们来看一个具体的例子。

[Codeforces](https://codeforces.com/) 第 555 轮比赛于 4 月 26 日举行，面向第三组别（3rd Division），这意味着它包含适合任何开发者尝试的问题。你可以使用 [此链接](https://codeforces.com/contest/1157) 阅读这些问题。该问题集中最简单的问题是 [问题 A：可达数 (Reachable Numbers)](https://codeforces.com/contest/1157/problem/A)。它要求实现问题描述中给出的一个简单算法。

我们将通过创建一个任意名称的 Kotlin 源文件来开始解决它。`A.kt` 即可。
首先，你需要实现问题描述中指定的函数，如下所示：

我们定义一个函数 f(x) 如下：首先将 x 加 1，然后，只要结果数字中存在至少一个末尾零，就将其删除。

Kotlin 是一种实用且不带偏见的语言，它同时支持命令式和函数式编程风格，而不会强迫开发者偏向其中任何一种。你可以使用 Kotlin 的 [尾递归 (tail recursion)](functions.md#tail-recursive-functions) 等特性，以函数式风格实现函数 `f`：

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

或者，你可以使用传统的 [while 循环](control-flow.md) 和在 Kotlin 中用 [var](basic-syntax.md#variables) 声明的可变变量，编写函数 `f` 的命令式实现 (imperative implementation)：

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

在 Kotlin 中，由于广泛使用类型推断 (type-inference)，许多地方的类型是可选的，但每个声明仍然有一个明确的静态类型 (static type)，该类型在编译时是已知的。

现在，剩下要做的就是编写主函数，它负责读取输入并实现问题描述中要求的其余算法——计算在对标准输入中给定的初始数字 `n` 重复应用函数 `f` 时产生的不同整数的数量。

默认情况下，Kotlin 运行在 JVM 上，并提供了丰富高效的集合库，其中包含通用集合和数据结构，例如动态大小数组（`ArrayList`）、基于哈希的映射和集合（`HashMap`/`HashSet`）、基于树的有序映射和集合（`TreeMap`/`TreeSet`）。使用整数哈希集合来跟踪在应用函数 `f` 时已经到达的值，该问题的直接命令式解决方案可以按如下所示编写：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // 从输入读取整数
    val reached = HashSet<Int>() // 一个可变哈希集合
    while (reached.add(n)) n = f(n) // 迭代函数 f
    println(reached.size) // 将答案打印到输出
}
```

在算法竞赛中，不需要处理格式错误的输入情况。在算法竞赛中，输入格式总是精确指定的，实际输入不能偏离问题描述中的输入规范。这就是为什么你可以使用 Kotlin 的 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函数。它断言输入字符串存在，否则抛出异常。同样，如果输入字符串不是整数，[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 函数会抛出异常。

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 从输入读取整数
    val reached = HashSet<Int>() // 一个可变哈希集合
    while (reached.add(n)) n = f(n) // 迭代函数 f
    println(reached.size) // 将答案打印到输出
}
```

请注意在调用 [readLine()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 函数后使用了 Kotlin 的 [非空断言运算符](null-safety.md#not-null-assertion-operator) `!!`。Kotlin 的 `readLine()` 函数被定义为返回一个 [可空类型](null-safety.md#nullable-types-and-non-nullable-types) `String?`，并在输入结束时返回 `null`，这明确要求开发者处理输入缺失的情况。

在算法竞赛中，不需要处理格式错误的输入情况。在算法竞赛中，输入格式总是精确指定的，实际输入不能偏离问题描述中的输入规范。这正是非空断言运算符 `!!` 的作用——它断言输入字符串存在，否则抛出异常。同样，[String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 也是如此。

</tab>
</tabs>

所有在线算法竞赛都允许使用预编写代码，因此你可以定义自己的实用函数库，这些函数专为算法竞赛设计，可以使你的实际解决方案代码更易于阅读和编写。然后你可以将这些代码用作解决方案的模板。例如，你可以为算法竞赛中的输入读取定义以下辅助函数：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
// 类似地，可用于解决方案中使用的其他类型
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
// 类似地，可用于解决方案中使用的其他类型
```

</tab>
</tabs>

请注意此处使用了 `private` [可见性修饰符 (visibility modifier)](visibility-modifiers.md)。尽管可见性修饰符的概念在算法竞赛中完全不重要，但它允许你基于相同的模板放置多个解决方案文件，而不会因为同一包中存在冲突的公共声明而报错。

## 函数式运算符示例：长数问题

对于更复杂的问题，Kotlin 丰富的集合上的函数式操作 (functional operations on collections) 库会非常方便，它可以最大限度地减少样板代码，并将代码转换为一个线性的、从上到下、从左到右的流畅数据转换管道 (data transformation pipeline)。例如，[问题 B：长数 (Long Number)](https://codeforces.com/contest/1157/problem/B) 问题需要实现一个简单的贪心算法 (greedy algorithm)，并且可以使用这种风格编写，无需使用任何可变变量：

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
    // 贪婪地查找第一个和最后一个索引
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 组合并输出答案
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
    // 贪婪地查找第一个和最后一个索引
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 组合并输出答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

在这段紧凑的代码中，除了集合转换，你还可以看到 Kotlin 的一些实用功能，例如局部函数 (local functions) 和 [Elvis 运算符 (elvis operator)](null-safety.md#elvis-operator) `?:`，它们允许用 `.takeIf { it >= 0 } ?: s.length` 这样简洁易读的表达式来表达“如果值为正数则取值，否则使用长度”这样的 [惯用法 (idioms)](idioms.md)，同时，Kotlin 也完全支持创建额外的可变变量并以命令式风格表达相同的代码。

为了使这类算法竞赛任务中的输入读取更简洁，你可以使用以下辅助输入读取函数列表：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
private fun readStrings() = readStr().split(" ") // 字符串列表
private fun readInts() = readStrings().map { it.toInt() } // 整数列表
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
private fun readStrings() = readStr().split(" ") // 字符串列表
private fun readInts() = readStrings().map { it.toInt() } // 整数列表
```

</tab>
</tabs>

有了这些辅助函数，读取输入的代码部分变得更简单，它逐行紧密遵循问题描述中的输入规范：

```kotlin
// 读取输入
val n = readInt()
val s = readStr()
val fl = readInts()
```

请注意，在算法竞赛中，习惯上变量名比工业编程实践 (industrial programming practice) 中通常的要短，因为代码只需编写一次，之后无需维护。然而，这些名称通常仍然具有助记性 (mnemonic)——`a` 用于数组，`i`、`j` 等用于索引，`r` 和 `c` 用于表格中的行号和列号，`x` 和 `y` 用于坐标，等等。最好保持输入数据与问题描述中给定的名称一致。然而，更复杂的问题需要更多的代码，这导致使用更长、更具自解释性的变量和函数名。

## 更多技巧与窍门

算法竞赛问题通常有以下形式的输入：

输入的第一行包含两个整数 `n` 和 `k`

在 Kotlin 中，使用整数列表的 [解构声明 (destructuring declaration)](destructuring-declarations.md)，可以简洁地解析这行输入：

```kotlin
val (n, k) = readInts()
```

使用 JVM 的 `java.util.Scanner` 类来解析非结构化输入格式可能很有吸引力。Kotlin 旨在与 JVM 库良好互操作，因此在 Kotlin 中使用它们感觉非常自然。然而，请注意 `java.util.Scanner` 非常慢。事实上，它慢到用它解析 10^5^ 或更多整数可能无法满足典型的 2 秒时间限制，而一个简单的 Kotlin `split(" ").map { it.toInt() }` 就能处理。

在 Kotlin 中输出通常很简单，使用 [println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 调用和 Kotlin 的 [字符串模板 (string templates)](strings.md#string-templates) 即可。然而，当输出包含 10^5^ 行或更多时，必须小心处理。发出如此多的 `println` 调用会太慢，因为 Kotlin 中的输出在每行之后会自动刷新。从数组或列表中写入多行的更快方法是使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函数，并以 `"
"` 作为分隔符，如下所示：

```kotlin
println(a.joinToString("
")) // 数组/列表中每个元素一行
```

## 学习 Kotlin

Kotlin 易于学习，特别是对于那些已经了解 Java 的人。软件开发者可以在网站的参考部分，从 [基本语法](basic-syntax.md) 开始，直接找到 Kotlin 基本语法的简短介绍。

IDEA 内置了 [Java 到 Kotlin 转换器](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)。熟悉 Java 的人可以使用它来学习对应的 Kotlin 语法结构，但它并不完美，仍然值得熟悉 Kotlin 并学习 [Kotlin 惯用法](idioms.md)。

学习 Kotlin 语法和 Kotlin 标准库 API 的绝佳资源是 [Kotlin Koans](koans.md)。