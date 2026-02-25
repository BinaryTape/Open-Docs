[//]: # (title: Kotlin 技巧)

Kotlin 技巧（Kotlin Tips）是一系列短视频，由 Kotlin 团队成员演示如何以更高效、更惯用的方式使用 Kotlin，让编写代码变得更有趣。

[订阅我们的 YouTube 频道](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)以免错过新的 Kotlin 技巧视频。

## Kotlin 中的 null + null

当你在 Kotlin 中将 `null + null` 相加时会发生什么，它又会返回什么？Sebastian Aigner 在我们最新的快速技巧中揭开了这个谜团。在此过程中，他还展示了为什么没有理由害怕可为 null 的类型：

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin 技巧：Kotlin 中的 null + null"/>

## 对集合项进行去重

你的 Kotlin 集合中包含重复项吗？需要一个仅包含唯一项的集合吗？让 Sebastian Aigner 在这个 Kotlin 技巧中向你展示如何从列表（list）中移除重复项，或者将它们转换为集合（set）：

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin 技巧：对集合项进行去重"/>

## suspend 与 inline 之谜

为什么像 [`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html)、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 和 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 这样的函数即使其签名不支持协程，也能在 lambda 表达式中接受挂起函数？在这一集 Kotlin 技巧中，Sebastian Aigner 揭开了谜底：这与 inline 修饰符有关：

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin 技巧：suspend 与 inline 之谜"/>

## 使用完全限定名称取消屏蔽声明

屏蔽（Shadowing）意味着作用域内的两个声明具有相同的名称。那么，该如何选择呢？在这一集 Kotlin 技巧中，Sebastian Aigner 向你展示了一个简单的 Kotlin 技巧，利用完全限定名称的力量，精确调用你需要的函数：

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin 技巧：取消屏蔽声明"/>

## 通过 Elvis 运算符 return 与 throw

Elvis 再次登场！Sebastian Aigner 解释了为什么该运算符以著名歌手的名字命名，以及你如何在 Kotlin 中使用 `?:` 进行返回（return）或抛出（throw）。幕后的魔法？[Nothing 类型](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin 技巧：通过 Elvis 运算符 return 与 throw"/>

## 析构声明

通过 Kotlin 中的[析构声明](destructuring-declarations.md)，你可以从单个对象中一次性创建多个变量。在视频中，Sebastian Aigner 展示了一系列可以被析构的内容——对（pair）、列表（list）、映射（map）等。那么你自己的对象呢？Kotlin 的 component 函数也为这些对象提供了答案：

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin 技巧：析构声明"/>

## 带有可为 null 值的运算符函数

在 Kotlin 中，你可以为你的类重写加法和减法等运算符，并提供你自己的逻辑。但是，如果你想允许左侧和右侧都为 null 值呢？在视频中，Sebastian Aigner 回答了这个问题：

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin 技巧：带有可为 null 值的运算符函数"/>

## 代码计时

观看 Sebastian Aigner 对 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 函数的快速概述，了解如何为你的代码计时：

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin 技巧：代码计时"/>

## 改进循环

在视频中，Sebastian Aigner 将演示如何改进[循环](control-flow.md#for-loops)，使你的代码更具可读性、更易理解且更简洁：

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin 技巧：改进循环"/>

## 字符串

在这一集中，Kate Petrova 展示了三个帮助你在 Kotlin 中处理[字符串](strings.md)的技巧：

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin 技巧：字符串"/>

## 探索 Elvis 运算符的更多用法

在视频中，Sebastian Aigner 将展示如何为 [Elvis 运算符](null-safety.md#elvis-operator)添加更多逻辑，例如在运算符的右侧部分记录日志：

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin 技巧：Elvis 运算符"/>

## Kotlin 集合

在这一集中，Kate Petrova 展示了三个帮助你处理 [Kotlin 集合](collections-overview.md)的技巧：

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin 技巧：Kotlin 集合"/>

## 下一步？

*   在我们的 [YouTube 播放列表](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)中查看 Kotlin 技巧的完整列表
*   了解如何[针对常见情况编写惯用的 Kotlin 代码](idioms.md)