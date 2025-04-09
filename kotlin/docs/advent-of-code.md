---
title: "使用惯用的 Kotlin 解决 Advent of Code 谜题"
---
[Advent of Code](https://adventofcode.com/) 是一年一度的 12 月活动，从 12 月 1 日到 12 月 25 日，每天都会发布以节日为主题的谜题。 经过 Advent of Code 的创建者 [Eric Wastl](http://was.tl/) 的许可，我们将展示如何使用 Kotlin 的惯用风格来解决这些难题：

* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## 准备好迎接 Advent of Code

我们将向你介绍一些基本技巧，让你了解如何开始使用 Kotlin 解决 Advent of Code 的挑战：

* 使用 [这个 GitHub 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) 创建项目
* 查看 Kotlin Developer Advocate Sebastian Aigner 的欢迎视频：

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### Day 1: 卡路里计数 (Calorie counting)

了解 [Kotlin Advent of Code 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) 以及在 Kotlin 中处理字符串和集合的便捷函数，
例如 [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html) 和 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)。
了解扩展函数如何帮助你以良好的方式构建解决方案。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/1) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### Day 2: 石头剪刀布 (Rock paper scissors)

了解 Kotlin 中 `Char` 类型的操作，了解 `Pair` 类型和 `to` 构造函数如何与模式匹配良好配合。
了解如何使用 [`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 函数对你自己的对象进行排序。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/2) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### Day 3: 背包重组 (Rucksack reorganization)

了解 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 库如何帮助
你了解代码的性能特征。
了解诸如 `intersect` 之类的集合操作如何帮助你选择重叠数据，
并查看同一解决方案的不同实现之间的性能比较。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/3) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### Day 4: 营地清理 (Camp cleanup)

了解 `infix` 和 `operator` 函数如何使你的代码更具表现力，
以及 `String` 和 `IntRange` 类型的扩展函数如何轻松解析输入。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/4) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### Day 5: 补给栈 (Supply stacks)

了解如何使用工厂函数构造更复杂的对象，
如何使用正则表达式，以及双端 [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 类型。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/5) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### Day 6: 调整故障 (Tuning trouble)

使用 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 库查看更深入的性能调查，
比较同一解决方案的 16 种不同变体的特性。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/6) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### Day 7: 设备上没有剩余空间 (No space left on device)

了解如何对树结构进行建模，并查看以编程方式生成 Kotlin 代码的演示。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/7) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### Day 8: 树梢树屋 (Treetop tree house)

查看 `sequence` 构建器的实际应用，
以及程序的初稿和 Kotlin 惯用解决方案的差异有多大（特别嘉宾 Roman Elizarov！）。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/8) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### Day 9: 绳桥 (Rope bridge)

查看 `run` 函数、带标签的返回以及便捷的标准库函数，如 `coerceIn` 或 `zipWithNext`。
了解如何使用 `List` 和 `MutableList` 构造函数构造给定大小的列表，
并了解基于 Kotlin 的问题陈述可视化。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/9) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### Day 10: 阴极射线管 (Cathode-ray tube)

了解范围和 `in` 运算符如何使检查范围变得自然，
函数参数如何转换为接收器，以及对 `tailrec` 修饰符的简要探索。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/10) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### Day 11: 中间的猴子 (Monkey in the middle)

了解如何从可变的、
命令式代码转变为更函数式的方法，该方法利用不可变和只读数据结构。
了解上下文接收器，以及我们的嘉宾如何仅为 Advent of Code 构建自己的可视化库。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/11) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### Day 12: 爬山算法 (Hill Climbing algorithm)

使用队列、`ArrayDeque`、函数引用和 `tailrec` 修饰符来解决 Kotlin 中的路径查找问题。

* 阅读 [Advent of Code](https://adventofcode.com/2022/day/12) 上的谜题描述
* 查看视频中的解决方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

:::tip
阅读我们的 [关于 Advent of Code 2021 的博客文章](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)

:::

### Day 1: 声纳扫描 (Sonar sweep)

应用 windowed 和 count 函数来处理整数对和三元组。

* 阅读 [Advent of Code](https://adventofcode.com/2021/day/1) 上的谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1) 上查看 Anton Arhipov 的解决方案
  或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### Day 2: 下潜！(Dive!)

了解析构声明和 `when` 表达式。

* 阅读 [Advent of Code](https://adventofcode.com/2021/day/2) 上的谜题描述
* 在 [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt) 上查看 Pasha Finkelshteyn 的解决方案
  或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### Day 3: 二进制诊断 (Binary diagnostic)

探索使用二进制数的不同方式。

* 阅读 [Advent of Code](https://adventofcode.com/2021/day/3) 上的谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/) 上查看 Sebastian Aigner 的解决方案
  或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### Day 4: 巨型鱿鱼 (Giant squid)

了解如何解析输入并引入一些领域类以方便处理。

* 阅读 [Advent of Code](https://adventofcode.com/2021/day/4) 上的谜题描述
* 在 [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt) 上查看 Anton Arhipov 的解决方案
  或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

:::tip
你可以在我们的 [GitHub 仓库](https://github.com/kotlin-hands-on/advent-of-code-2020/) 中找到 Advent of Code 2020 谜题的所有解决方案。

:::

### Day 1: 报告修复 (Report repair)

探索输入处理、遍历列表、构建映射的不同方法，以及使用 [`let`](scope-functions#let)
函数来简化你的代码。

* 阅读 [Advent of Code](https://adventofcode.com/2020/day/1) 上的谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/) 上查看 Svetlana Isakova 的解决方案
或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### Day 2: 密码哲学 (Password philosophy)

探索字符串实用程序函数、正则表达式、集合上的操作，以及 [`let`](scope-functions#let)
函数如何帮助转换你的表达式。

* 阅读 [Advent of Code](https://adventofcode.com/2020/day/2) 上的谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/) 上查看 Svetlana Isakova 的解决方案
或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### Day 3: 雪橇轨迹 (Toboggan trajectory)

比较命令式和更函数式代码风格，处理 pairs 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
函数，在列选择模式下编辑代码，并修复整数溢出。

* 阅读 [Advent of Code](https://adventofcode.com/2020/day/3) 上的谜题描述
* 在 [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt) 上查看 Mikhail Dvorkin 的解决方案
或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### Day 4: 护照处理 (Passport processing)

应用 [`when`](control-flow#when-expressions-and-statements) 表达式并探索验证输入的不同方法：
实用程序函数、处理范围、检查集合成员资格以及匹配特定正则表达式。

* 阅读 [Advent of Code](https://adventofcode.com/2020/day/4) 上的谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/) 上查看 Sebastian Aigner 的解决方案
或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### Day 5: 二进制登机 (Binary boarding)

使用 Kotlin 标准库函数（`replace()`、`toInt()`、`find()`）来处理数字的二进制表示形式，
探索强大的本地函数，并了解如何在 Kotlin 1.5 中使用 `max()` 函数。

* 阅读 [Advent of Code](https://adventofcode.com/2020/day/5) 上的谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/) 上查看 Svetlana Isakova 的解决方案
或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### Day 6: 自定义海关 (Custom customs)

了解如何使用标准库函数对字符串和集合中的字符进行分组和计数：`map()`、
`reduce()`、`sumOf()`、`intersect()` 和 `union()`。

* 阅读 [Advent of Code](https://adventofcode.com/2020/day/6) 上的谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/) 上查看 Anton Arhipov 的解决方案
或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### Day 7: 便携式背包 (Handy haversacks)

了解如何使用正则表达式，从 Kotlin 中使用 Java 的 `compute()` 方法进行 HashMap 的动态计算
在映射中的值，使用 `forEachLine()` 函数读取文件，并比较两种类型的搜索算法：
深度优先和广度优先。

* 阅读 [Advent of Code](https://adventofcode.com/2020/day/7) 上的谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/) 上查看 Pasha Finkelshteyn 的解决方案
或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### Day 8: 手持暂停 (Handheld halting)

应用密封类和 lambda 表达式来表示指令，应用 Kotlin 集合来发现程序执行中的循环，
使用序列和 `sequence { }` 构建器函数来构造惰性集合，并尝试实验性的
`measureTimedValue()` 函数来检查性能指标。

* 阅读 [Advent of Code](https://adventofcode.com/2020/day/8) 上的谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/) 上查看 Sebastian Aigner 的解决方案
或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### Day 9: 编码错误 (Encoding error)

探索在 Kotlin 中使用 `any()`、`firstOrNull()`、`firstNotNullOfOrNull()`、
`windowed()`、`takeIf()` 和 `scan()` 函数操作列表的不同方法，这些函数是 Kotlin 惯用风格的示例。

* 阅读 [Advent of Code](https://adventofcode.com/2020/day/9) 上的谜题描述
* 在 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/) 上查看 Svetlana Isakova 的解决方案
或观看视频：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 接下来是什么？

* 通过 [Kotlin Koans](koans) 完成更多任务
* 通过 JetBrains Academy 免费的 [Kotlin Core 课程](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 创建可工作的应用程序