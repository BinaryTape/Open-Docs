[//]: # (title: Advent of Code 谜题与惯用的 Kotlin)

[Advent of Code](https://adventofcode.com/) 是一年一度的十二月活动，从 12 月 1 日到 12 月 25 日，每天都会发布一道节日主题的谜题。经 Advent of Code 的创建者 [Eric Wastl](http://was.tl/) 许可，我们将展示如何使用惯用的 Kotlin 风格解决这些谜题：

* [2024 年 Advent of Code](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [2023 年 Advent of Code](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## 为 Advent of Code 做好准备

我们将为你提供一些基本技巧，帮助你使用 Kotlin 快速上手解决 Advent of Code 挑战：

* 使用 [这个 GitHub 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) 创建项目
* 观看 Kotlin 开发者布道师 Sebastian Aigner 的欢迎视频：

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## 2022 年 Advent of Code

### 第 1 天：卡路里计数

了解 [Kotlin Advent of Code 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) 以及 Kotlin 中用于处理字符串和集合的便捷函数，例如 [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html) 和 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)。了解扩展函数 (extension functions) 如何帮助你以优雅的方式组织你的解决方案。

* 在 [Advent of Code](https://adventofcode.com/2022/day/1) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### 第 2 天：石头剪刀布

理解 Kotlin 中对 `Char` 类型的操作，了解 `Pair` 类型和 `to` 构造函数如何与模式匹配 (pattern matching) 配合良好。理解如何使用 [`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 函数对自己的对象进行排序。

* 在 [Advent of Code](https://adventofcode.com/2022/day/2) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### 第 3 天：背包整理

了解 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 库如何帮助你理解代码的性能特征。了解 `intersect` 等集合操作如何帮助你选择重叠数据，并查看同一解决方案不同实现之间的性能比较。

* 在 [Advent of Code](https://adventofcode.com/2022/day/3) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### 第 4 天：营地清理

了解 `infix` 和 `operator` 函数如何使你的代码更具表现力，以及针对 `String` 和 `IntRange` 类型的扩展函数如何轻松解析输入。

* 在 [Advent of Code](https://adventofcode.com/2022/day/4) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### 第 5 天：补给栈

了解如何使用工厂函数构造更复杂的对象，如何使用正则表达式，以及双端 [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 类型。

* 在 [Advent of Code](https://adventofcode.com/2022/day/5) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### 第 6 天：调优问题

查看 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 库更深入的性能调查，比较同一解决方案 16 种不同变体的特征。

* 在 [Advent of Code](https://adventofcode.com/2022/day/6) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### 第 7 天：设备上没有空间了

学习如何建模树形结构，并查看程序化地生成 Kotlin 代码的演示。

* 在 [Advent of Code](https://adventofcode.com/2022/day/7) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### 第 8 天：树顶树屋

了解 `sequence` 构建器 (builder) 的实际应用，以及程序的初稿和惯用的 Kotlin 解决方案之间会有多大差异（特邀嘉宾 Roman Elizarov！）。

* 在 [Advent of Code](https://adventofcode.com/2022/day/8) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### 第 9 天：绳桥

了解 `run` 函数、标签化返回，以及像 `coerceIn` 或 `zipWithNext` 这样便捷的标准库函数。了解如何使用 `List` 和 `MutableList` 构造函数构造给定大小的列表，并查看基于 Kotlin 的问题陈述可视化。

* 在 [Advent of Code](https://adventofcode.com/2022/day/9) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### 第 10 天：阴极射线管

了解范围 (ranges) 和 `in` 运算符如何使检查范围变得自然，函数参数如何转换为接收者 (receivers)，以及对 `tailrec` 修饰符的简要探索。

* 在 [Advent of Code](https://adventofcode.com/2022/day/10) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### 第 11 天：中间的猴子

了解如何从可变、命令式代码转向更函数式的方法，该方法利用不可变和只读数据结构。了解上下文接收者 (context receivers)，以及我们的嘉宾如何专门为 Advent of Code 构建了他自己的可视化库。

* 在 [Advent of Code](https://adventofcode.com/2022/day/11) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### 第 12 天：爬山算法

使用队列、`ArrayDeque`、函数引用和 `tailrec` 修饰符来解决 Kotlin 中的路径查找问题。

* 在 [Advent of Code](https://adventofcode.com/2022/day/12) 上阅读谜题描述
* 观看视频中的解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## 2021 年 Advent of Code

> 阅读我们关于 2021 年 Advent of Code 的[博客文章](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)
>
{style="tip"}

### 第 1 天：声纳扫描

应用 `windowed` 和 `count` 函数来处理整数对和三元组。

* 在 [Advent of Code](https://adventofcode.com/2021/day/1) 上阅读谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1) 上查看 Anton Arhipov 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### 第 2 天：潜水！

了解解构声明 (destructuring declarations) 和 `when` 表达式。

* 在 [Advent of Code](https://adventofcode.com/2021/day/2) 上阅读谜题描述
* 在 [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt) 上查看 Pasha Finkelshteyn 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### 第 3 天：二进制诊断

探索处理二进制数的不同方法。

* 在 [Advent of Code](https://adventofcode.com/2021/day/3) 上阅读谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/) 上查看 Sebastian Aigner 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### 第 4 天：巨型鱿鱼

学习如何解析输入并引入一些领域类，以便进行更便捷的处理。

* 在 [Advent of Code](https://adventofcode.com/2021/day/4) 上阅读谜题描述
* 在 [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt) 上查看 Anton Arhipov 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## 2020 年 Advent of Code

> 你可以在我们的 [GitHub 仓库](https://github.com/kotlin-hands-on/advent-of-code-2020/) 中找到 2020 年 Advent of Code 谜题的所有解决方案。
>
{style="tip"}

### 第 1 天：报告修复

探索输入处理、遍历列表、构建映射 (map) 的不同方法，以及使用 [`let`](scope-functions.md#let) 函数来简化你的代码。

* 在 [Advent of Code](https://adventofcode.com/2020/day/1) 上阅读谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/) 上查看 Svetlana Isakova 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### 第 2 天：密码哲学

探索字符串工具函数、正则表达式、集合操作，以及 [`let`](scope-functions.md#let) 函数如何有助于转换你的表达式。

* 在 [Advent of Code](https://adventofcode.com/2020/day/2) 上阅读谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/) 上查看 Svetlana Isakova 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### 第 3 天：雪橇轨迹

比较命令式和更函数式的代码风格，处理对和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 函数，在列选择模式 (column selection mode) 下编辑代码，并修复整数溢出。

* 在 [Advent of Code](https://adventofcode.com/2020/day/3) 上阅读谜题描述
* 在 [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt) 上查看 Mikhail Dvorkin 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### 第 4 天：护照处理

应用 [`when`](control-flow.md#when-expressions-and-statements) 表达式并探索验证输入的各种方法：工具函数、处理范围、检查集合成员资格以及匹配特定的正则表达式。

* 在 [Advent of Code](https://adventofcode.com/2020/day/4) 上阅读谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/) 上查看 Sebastian Aigner 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### 第 5 天：二进制登机

使用 Kotlin 标准库函数（`replace()`、`toInt()`、`find()`）处理数字的二进制表示，探索强大的局部函数，并学习如何在 Kotlin 1.5 中使用 `max()` 函数。

* 在 [Advent of Code](https://adventofcode.com/2020/day/5) 上阅读谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/) 上查看 Svetlana Isakova 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### 第 6 天：自定义海关

学习如何使用标准库函数：`map()`、`reduce()`、`sumOf()`、`intersect()` 和 `union()` 对字符串和集合中的字符进行分组和计数。

* 在 [Advent of Code](https://adventofcode.com/2020/day/6) 上阅读谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/) 上查看 Anton Arhipov 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### 第 7 天：方便的旅行袋

学习如何使用正则表达式，如何从 Kotlin 中使用 Java 的 `compute()` 方法对 HashMaps 进行映射 (map) 中值的动态计算，使用 `forEachLine()` 函数读取文件，并比较两种类型的搜索算法：深度优先和广度优先。

* 在 [Advent of Code](https://adventofcode.com/2020/day/7) 上阅读谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/) 上查看 Pasha Finkelshteyn 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### 第 8 天：手持暂停

应用密封类 (sealed classes) 和 Lambda 表达式来表示指令，应用 Kotlin 集合来发现程序执行中的循环，使用序列和 `sequence { }` 构建器函数来构造惰性集合，并尝试实验性 `measureTimedValue()` 函数来检查性能指标。

* 在 [Advent of Code](https://adventofcode.com/2020/day/8) 上阅读谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/) 上查看 Sebastian Aigner 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### 第 9 天：编码错误

探索使用 `any()`、`firstOrNull()`、`firstNotNullOfOrNull()`、`windowed()`、`takeIf()` 和 `scan()` 函数操作 Kotlin 列表的不同方法，这些函数体现了惯用的 Kotlin 风格。

* 在 [Advent of Code](https://adventofcode.com/2020/day/9) 上阅读谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/) 上查看 Svetlana Isakova 的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 接下来是什么？

* 使用 [Kotlin Koans](koans.md) 完成更多任务
* 通过 JetBrains Academy 的免费 [Kotlin 核心学习路径 (Kotlin Core track)](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 创建可运行的应用程序