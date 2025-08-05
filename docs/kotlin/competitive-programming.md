[//]: # (title: Kotlin 用于竞技编程)

本教程专为以前未使用过 Kotlin 的竞技程序员，以及以前未参加过任何竞技编程活动的 Kotlin 开发者设计。
它假定读者具备相应的编程技能。

[竞技编程](https://en.wikipedia.org/wiki/Competitive_programming)是一项智力运动，参赛者在严格的约束条件下编写程序，以解决精确定义的算法问题。问题可以很简单，任何软件开发者都能解决，只需少量代码即可获得正确答案；也可以非常复杂，需要了解特殊算法、数据结构和大量练习。Kotlin 虽然并非专门为竞技编程设计，但它恰好非常适合这个领域，它将程序员在编写和阅读代码时所需的典型[样板代码](boilerplate-code.md)量减少到几乎与动态类型脚本语言相同的水平，同时又拥有静态类型语言的工具链和性能。

关于如何设置 Kotlin 开发环境，请参见[Kotlin/JVM 入门](jvm-get-started.md)。在竞技编程中，通常只创建一个[项目](project.md)，每个问题的解决方案都写在一个源文件中。

## 简单示例：可达数问题

让我们来看一个具体示例。

[Codeforces](https://codeforces.com/) 第 555 轮比赛于 4 月 26 日为第三级别选手举办，这意味着它包含了适合任何开发者尝试的问题。你可以使用[此链接](https://codeforces.com/contest/1157)阅读这些问题。其中最简单的问题是[问题 A：可达数](https://codeforces.com/contest/1157/problem/A)。它要求实现问题陈述中描述的简单算法。

我们将通过创建一个任意名称的 Kotlin 源文件来开始解决它。`A.kt` 就可以了。
首先，你需要实现问题陈述中指定的[函数](function.md)：

我们以这样的方式定义函数 f(x)：我们将 x 加 1，然后，只要结果数字中存在至少一个尾随零，我们就删除该零。

Kotlin 是一种实用且不固执己见的语言，它支持命令式和[函数](function.md)式编程风格，而不会强制开发者选择其中一种。你可以使用 Kotlin 的一些[特性](feature.md)，如[尾递归](functions.md#tail-recursive-functions)，以函数式风格实现函数 `f`：

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

或者，你可以使用传统的 [while 循环](control-flow.md)和 Kotlin 中用 [var](basic-syntax.md#variables) 声明的[可变变量](basic-syntax.md#variables)来编写函数 `f` 的命令式实现：

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

由于广泛使用[类型推断](type-inference.md)，Kotlin 中的[类型](basic-syntax.md#variables)在许多地方是可选的，但每个[声明](declare.md)在[编译期](compile-time.md)仍然具有明确定义的静态类型。

现在，剩下要做的就是编写主[函数](function.md)，它读取输入并实现问题陈述要求的其余算法——计算将[函数](function.md) `f` 重复应用于标准输入中给定的初始数字 `n` 时产生的不同整数的数量。

默认情况下，Kotlin 运行在 JVM 上，并直接访问一个丰富高效的[集合库](collections.md)，其中包含通用[集合](collections.md)和[数据结构](https://en.wikipedia.org/wiki/Data_structure)，例如动态大小的数组（`ArrayList`）、基于哈希的 `map` 和 `set`（`HashMap`/`HashSet`）、基于树的有序 `map` 和 `set`（`TreeMap`/`TreeSet`）。使用整数 `HashSet` 来跟踪应用[函数](function.md) `f` 时已到达的值，该问题的解决方案的直接命令式版本可以编写如下：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // 从输入读取整数
    val reached = HashSet<Int>() // 一个可变哈希 set 
    while (reached.add(n)) n = f(n) // 迭代函数 f
    println(reached.size) // 将答案打印到输出
}
```

在竞技编程中，无需处理输入格式不正确的情况。竞技编程中，输入格式总是精确指定的，实际输入不能偏离问题陈述中的输入规范。这就是为什么你可以使用 Kotlin 的 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)[函数](function.md)。它断言输入字符串存在，否则抛出异常。同样，[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)[函数](function.md)在输入字符串不是整数时抛出异常。

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 从输入读取整数
    val reached = HashSet<Int>() // 一个可变哈希 set 
    while (reached.add(n)) n = f(n) // 迭代函数 f
    println(reached.size) // 将答案打印到输出
}
```

请注意，[`readLine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html)[函数](function.md)调用后使用了 Kotlin 的[空断言操作符](null-safety.md#not-null-assertion-operator) `!!`。
Kotlin 的 `readLine()` [函数](function.md)被定义为返回一个[可空类型](null-safety.md#nullable-types-and-non-nullable-types) `String?`，并在输入结束时返回 `null`，这明确强制开发者处理缺失输入的情况。

在竞技编程中，无需处理输入格式不正确的情况。
在竞技编程中，输入格式总是精确指定的，实际输入不能偏离问题陈述中的输入规范。这正是空断言[操作符](operator.md) `!!` 的本质作用——它断言输入字符串存在，否则抛出异常。同样，[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 也是如此。

</tab>
</tabs>

所有在线竞技编程赛事都允许使用预编写的代码，因此你可以定义自己的面向竞技编程的实用[函数](function.md)库，使你的实际解决方案代码更易于阅读和编写。然后，你可以将此代码用作解决方案的模板。例如，你可以定义以下辅助[函数](function.md)用于在竞技编程中读取输入：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
// 你的解决方案中会使用其他类似类型
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
// 你的解决方案中会使用其他类似类型
```

</tab>
</tabs>

请注意此处使用了 `private` [可见性修饰符](visibility-modifiers.md)。
虽然可见性修饰符的概念对于竞技编程完全不相关，但它允许你基于相同的模板放置多个解决方案文件，而不会因同一[包](packages.md)中公共[声明](declare.md)冲突而报错。

## 函数式操作符示例：长数字问题

对于更复杂的问题，Kotlin 丰富的[集合](collections.md)上的[函数](function.md)式[操作符](operator.md)库非常有用，它可以最大程度地减少[样板代码](boilerplate-code.md)，并将代码转变为线性自上而下、自左向右的流畅数据转换[流水线](pipeline.md)。例如，[问题 B：长数字](https://codeforces.com/contest/1157/problem/B)问题需要实现一个简单的贪心算法，并且可以使用这种风格编写，而无需任何[可变变量](basic-syntax.md#variables)：

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
    // 贪心地找到第一个和最后一个索引
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 组合并写入答案
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
    // 贪心地找到第一个和最后一个索引
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 组合并写入答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

在这段紧凑的代码中，除了[集合](collections.md)转换，你还可以看到 Kotlin 的一些便捷[特性](feature.md)，如[局部函数](functions.md#local-functions)和 [Elvis 操作符](null-safety.md#elvis-operator) `?:`，它们允许用简洁易读的表达式来表达像“取该值（如果为正）否则使用长度”这样的[惯用法](idioms.md)，例如 `.takeIf { it >= 0 } ?: s.length`。然而，Kotlin 也完全可以创建额外的可变变量并以命令式风格表达相同的代码。

为了让竞技编程任务中读取输入的代码更简洁，你可以拥有以下辅助输入读取[函数](function.md)列表：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
private fun readStrings() = readStr().split(" ") // 字符串 list
private fun readInts() = readStrings().map { it.toInt() } // 整数 list
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 字符串行
private fun readInt() = readStr().toInt() // 单个整数
private fun readStrings() = readStr().split(" ") // 字符串 list
private fun readInts() = readStrings().map { it.toInt() } // 整数 list
```

</tab>
</tabs>

有了这些辅助[函数](function.md)，读取输入的代码部分变得更简单，它与问题陈述中的输入规范逐行紧密对应：

```kotlin
// 读取输入
val n = readInt()
val s = readStr()
val fl = readInts()
```

请注意，在竞技编程中，习惯上变量名比工业编程实践中典型使用的名字更短，因为代码只需编写一次，之后无需维护。然而，这些名字通常仍具有助记性——`a` 代表数组，`i`、`j` 等代表索引，`r` 和 `c` 代表表格中的行号和列号，`x` 和 `y` 代表坐标等。保持与问题陈述中给定的输入数据相同的名称会更容易。然而，更复杂的问题需要更多的代码，这会导致使用更长、更具自我解释性的变量和[函数](function.md)名称。

## 更多技巧

竞技编程问题通常有如下输入：

输入的第一行包含两个整数 `n` 和 `k`

在 Kotlin 中，使用[解构声明](destructuring-declarations.md)从整数 `list` 中可以简洁地解析这一行：

```kotlin
val (n, k) = readInts()
```

使用 JVM 的 `java.util.Scanner` 类来解析非结构化输入格式可能很诱人。Kotlin 旨在与 JVM 库良好[互操作](interop.md)，因此它们在 Kotlin 中的使用感觉非常自然。然而，请注意 `java.util.Scanner` 速度极慢。事实上，使用它解析 10<sup>5</sup> 或更多整数可能无法满足典型的 2 秒时间限制，而简单的 Kotlin `split(" ").map { it.toInt() }` 就可以处理。

在 Kotlin 中编写输出通常很简单，使用 [println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 调用和 Kotlin 的[字符串模板](strings.md#string-templates)。然而，当输出包含大约 10<sup>5</sup> 行或更多时，必须小心。发出如此多的 `println` 调用太慢，因为 Kotlin 中的输出在每行之后会自动刷新。
从数组或 `list` 中写入多行的更快方法是使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html)[函数](function.md)，并使用 `"
"` 作为分隔符，如下所示：

```kotlin
println(a.joinToString("
")) // 数组/list 的每个元素占一行
```

## 学习 Kotlin

Kotlin 易于学习，特别是对于已经了解 Java 的人。
关于面向软件开发者的 Kotlin 基本语法的简短介绍可以直接在网站的[参考部分](docs-overview.md)中找到，从[基本语法](basic-syntax.md)开始。

IDEA 内置了 [Java 到 Kotlin 转换器](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)。
熟悉 Java 的人可以使用它来学习相应的 Kotlin 语法结构，但它并不完美，仍然值得熟悉 Kotlin 并学习 [Kotlin 惯用法](idioms.md)。

学习 Kotlin 语法和 Kotlin 标准库 API 的一个很好的资源是 [Kotlin 心印](koans.md)。