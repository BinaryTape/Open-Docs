[//]: # (title: 以惯用 Kotlin 风格解决 Advent of Code 谜题)

[Advent of Code](https://adventofcode.com/) 是一项每年 12 月举行的活动，从 12 月 1 日到 12 月 25 日，每天都会发布一个以节日为主题的谜题。经 Advent of Code 创始人 [Eric Wastl](http://was.tl/) 许可，我们将展示如何使用惯用 Kotlin 风格来解决这些谜题：

* [Advent of Code 2025](https://www.youtube.com/playlist?list=PLlFc5cFwUnmx9-VIcfxqhjHrwD3Lab4o4)
* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## 为 Advent of Code 做好准备

我们将带您了解如何使用 Kotlin 快速上手解决 Advent of Code 挑战的基础提示：

* 使用[此 GitHub 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)来创建项目
* 查看 Kotlin 技术布道师 Sebastian Aigner 的欢迎视频：

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### 第 1 天：卡路里计数 (Calorie counting)

了解 [Kotlin Advent of Code 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)以及在 Kotlin 中处理字符串和集合的便捷函数，例如 [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html) 和 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)。查看扩展函数如何帮助您以优雅的方式构建解决方案。

* 在 [Advent of Code](https://adventofcode.com/2022/day/1) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### 第 2 天：石头剪刀布 (Rock paper scissors)

了解 Kotlin 中 `Char` 类型上的操作，查看 `Pair` 类型和 `to` 构造函数如何很好地配合模式匹配。了解如何使用 [`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 函数对您自己的对象进行排序。

* 在 [Advent of Code](https://adventofcode.com/2022/day/2) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### 第 3 天：背包重整 (Rucksack reorganization)

了解 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 库如何帮助您了解代码的性能特性。查看 `intersect` 等集合操作如何帮助您选择重叠数据，并查看同一解决方案的不同实现之间的性能比较。

* 在 [Advent of Code](https://adventofcode.com/2022/day/3) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### 第 4 天：营地清理 (Camp cleanup)

查看 `infix` 和 `operator` 函数如何让您的代码更具表现力，以及 `String` 和 `IntRange` 类型的扩展函数如何让解析输入变得简单。

* 在 [Advent of Code](https://adventofcode.com/2022/day/4) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### 第 5 天：供应堆栈 (Supply stacks)

学习使用工厂函数构建更复杂的对象，如何使用正则表达式，以及双端队列 [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 类型。

* 在 [Advent of Code](https://adventofcode.com/2022/day/5) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### 第 6 天：调谐麻烦 (Tuning trouble)

通过 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 库查看更深入的性能调查，比较同一解决方案的 16 个不同变体的特性。

* 在 [Advent of Code](https://adventofcode.com/2022/day/6) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### 第 7 天：设备上没有剩余空间 (No space left on device)

学习如何建模树形结构，并查看以编程方式生成 Kotlin 代码的演示。

* 在 [Advent of Code](https://adventofcode.com/2022/day/7) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### 第 8 天：树顶树屋 (Treetop tree house)

查看实际运行中的 `sequence` 构建器，以及程序的初稿与惯用 Kotlin 解决方案之间的巨大差异（特邀嘉宾 Roman Elizarov！）。

* 在 [Advent of Code](https://adventofcode.com/2022/day/8) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### 第 9 天：绳桥 (Rope bridge)

查看 `run` 函数、带标签的返回以及便捷的标准库函数，如 `coerceIn` 或 `zipWithNext`。查看如何使用 `List` 和 `MutableList` 构造函数构建给定大小的列表，并预览基于 Kotlin 的问题陈述可视化。

* 在 [Advent of Code](https://adventofcode.com/2022/day/9) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### 第 10 天：阴极射线管 (Cathode-ray tube)

了解区间和 `in` 运算符如何让区间检查变得自然，如何将函数参数转换为接收者，以及对 `tailrec` 修饰符的简要探索。

* 在 [Advent of Code](https://adventofcode.com/2022/day/10) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### 第 11 天：中间的猴子 (Monkey in the middle)

查看如何从可变的命令式代码转向利用不可变和只读数据结构的更具函数式的方法。了解上下文接收者，以及我们的嘉宾如何专为 Advent of Code 构建自己的可视化库。

* 在 [Advent of Code](https://adventofcode.com/2022/day/11) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### 第 12 天：爬山算法 (Hill Climbing algorithm)

使用队列、`ArrayDeque`、函数引用和 `tailrec` 修饰符，通过 Kotlin 解决寻路问题。

* 在 [Advent of Code](https://adventofcode.com/2022/day/12) 上阅读谜题说明
* 在视频中查看解决方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

> 阅读我们关于 [Advent of Code 2021 的博客文章](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)
> 
{style="tip"}

### 第 1 天：声呐扫描 (Sonar sweep)

应用窗口化和计数函数来处理整数对和三元组。

* 在 [Advent of Code](https://adventofcode.com/2021/day/1) 上阅读谜题说明
* 查看 Anton Arhipov 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1)上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### 第 2 天：潜水！ (Dive!)

了解析构声明和 `when` 表达式。

* 在 [Advent of Code](https://adventofcode.com/2021/day/2) 上阅读谜题说明
* 查看 Pasha Finkelshteyn 在 [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt) 上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### 第 3 天：二进制诊断 (Binary diagnostic)

探索处理二进制数的不同方法。

* 在 [Advent of Code](https://adventofcode.com/2021/day/3) 上阅读谜题说明
* 查看 Sebastian Aigner 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/)上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### 第 4 天：巨型乌贼 (Giant squid)

了解如何解析输入并引入一些领域类以进行更方便的处理。

* 在 [Advent of Code](https://adventofcode.com/2021/day/4) 上阅读谜题说明
* 查看 Anton Arhipov 在 [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt) 上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

> 您可以在我们的 [GitHub 仓库](https://github.com/kotlin-hands-on/advent-of-code-2020/)中找到 Advent of Code 2020 谜题的所有解决方案。
>
{style="tip"}

### 第 1 天：报告修复 (Report repair)

探索输入处理、遍历列表、构建 Map 的不同方式，以及使用 [`let`](scope-functions.md#let) 函数简化代码。

* 在 [Advent of Code](https://adventofcode.com/2020/day/1) 上阅读谜题说明
* 查看 Svetlana Isakova 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/)上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### 第 2 天：密码哲学 (Password philosophy)

探索字符串实用函数、正则表达式、集合操作，以及 [`let`](scope-functions.md#let) 函数如何帮助转换表达式。

* 在 [Advent of Code](https://adventofcode.com/2020/day/2) 上阅读谜题说明
* 查看 Svetlana Isakova 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/)上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### 第 3 天：雪橇轨迹 (Toboggan trajectory)

比较命令式和更多函数式代码风格，使用 Pair 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 函数，在列选择模式下编辑代码，并修复整数溢出。

* 在 [Advent of Code](https://adventofcode.com/2020/day/3) 上阅读谜题说明
* 查看 Mikhail Dvorkin 在 [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt) 上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### 第 4 天：护照处理 (Passport processing)

应用 [`when`](control-flow.md#when-expressions-and-statements) 表达式并探索验证输入的各种方式：实用函数、使用区间、检查集合成员资格以及匹配特定的正则表达式。

* 在 [Advent of Code](https://adventofcode.com/2020/day/4) 上阅读谜题说明
* 查看 Sebastian Aigner 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/)上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### 第 5 天：二进制登机 (Binary boarding)

使用 Kotlin 标准库函数（`replace()`、`toInt()`、`find()`）处理数字的二进制表示，探索强大的局部函数，并学习如何在 Kotlin 1.5 中使用 `max()` 函数。

* 在 [Advent of Code](https://adventofcode.com/2020/day/5) 上阅读谜题说明
* 查看 Svetlana Isakova 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/)上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### 第 6 天：定制海关 (Custom customs)

学习如何使用标准库函数对字符串和集合中的字符进行分组和计数：`map()`、`reduce()`、`sumOf()`、`intersect()` 和 `union()`。

* 在 [Advent of Code](https://adventofcode.com/2020/day/6) 上阅读谜题说明
* 查看 Anton Arhipov 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/)上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### 第 7 天：便利提篮 (Handy haversacks)

学习如何使用正则表达式，如何在 Kotlin 中使用 Java 的 HashMap `compute()` 方法进行 Map 值的动态计算，使用 `forEachLine()` 函数读取文件，并比较两类搜索算法：深度优先和广度优先。

* 在 [Advent of Code](https://adventofcode.com/2020/day/7) 上阅读谜题说明
* 查看 Pasha Finkelshteyn 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/)上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### 第 8 天：手持设备停机 (Handheld halting)

应用密封类和 lambda 来表示指令，应用 Kotlin 集合来发现程序执行中的循环，使用序列和 `sequence { }` 构建器函数构建延迟集合，并尝试实验性的 `measureTimedValue()` 函数来检查性能指标。

* 在 [Advent of Code](https://adventofcode.com/2020/day/8) 上阅读谜题说明
* 查看 Sebastian Aigner 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/)上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### 第 9 天：编码错误 (Encoding error)

探索在 Kotlin 中操作列表的不同方式，使用 `any()`、`firstOrNull()`、`firstNotNullOfOrNull()`、`windowed()`、`takeIf()` 和 `scan()` 函数，这些函数体现了惯用的 Kotlin 风格。

* 在 [Advent of Code](https://adventofcode.com/2020/day/9) 上阅读谜题说明
* 查看 Svetlana Isakova 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/)上的解决方案，或观看视频：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 接下来的步骤

* 使用 [Kotlin Koans](koans.md) 完成更多任务
* 通过 JetBrains Academy 免费的 [Kotlin Core 学习路线](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)创建实际应用程序