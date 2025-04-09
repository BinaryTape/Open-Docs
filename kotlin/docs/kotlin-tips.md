---
title: "Kotlin 小贴士"
---
Kotlin Tips 是一系列短视频，Kotlin 团队的成员将在其中展示如何以更高效和地道的方式使用 Kotlin，从而在编写代码时获得更多乐趣。

[订阅我们的 YouTube 频道](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)，不要错过新的 Kotlin Tips 视频。

## Kotlin 中的 null + null

在 Kotlin 中添加 `null + null` 会发生什么，它会返回什么？ Sebastian Aigner 在我们最新的快速技巧中解决了这个谜团。 一路上，他还展示了为什么没有理由害怕可空类型（nullables）：

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## 集合项去重

有一个包含重复项的 Kotlin 集合？ 需要一个只有唯一项的集合？ 让 Sebastian Aigner 在这个 Kotlin 技巧中向您展示如何从列表中删除重复项，或者将它们变成集合（sets）：

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## suspend 和 inline 之谜

为什么像 [`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html)、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 和 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 这样的函数可以在它们的 lambda 表达式中接受挂起函数（suspending functions），即使它们的签名没有意识到协程（coroutines）？ 在这集 Kotlin Tips 中，Sebastian Aigner 解决了这个谜题：这与 inline 修饰符有关：

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 使用完全限定名取消遮蔽声明

遮蔽（Shadowing）是指作用域中的两个声明具有相同的名称。 那么，你该如何选择？ 在这集 Kotlin Tips 中，Sebastian Aigner 向您展示了一个简单的 Kotlin 技巧，可以使用完全限定名称精确调用您需要的函数：

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## 使用 Elvis 运算符返回和抛出

[Elvis 运算符](null-safety#elvis-operator)再次登场！ Sebastian Aigner 解释了为什么该运算符以这位著名歌手的名字命名，以及如何在 Kotlin 中使用 `?:` 来返回或抛出。 背后的魔法是什么？ [Nothing 类型](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 解构声明

使用 Kotlin 中的[解构声明](destructuring-declarations)，您可以一次性从单个对象创建多个变量。 在此视频中，Sebastian Aigner 向您展示了一系列可以解构的内容——pairs（对）, lists（列表）, maps（映射）等等。 那么你自己的对象呢？ Kotlin 的 component functions（组件函数）也为此提供了一个答案：

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## 具有可空值的运算符函数

在 Kotlin 中，您可以为您的类重写加法和减法等运算符，并提供您自己的逻辑。 但是，如果您想允许在其左侧和右侧都使用空值怎么办？ 在此视频中，Sebastian Aigner 回答了这个问题：

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## 计时代码

观看 Sebastian Aigner 快速概述 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 函数，并学习如何计时您的代码：

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## 改进循环

在本视频中，Sebastian Aigner 将演示如何改进[循环](control-flow#for-loops)，以使您的代码更具可读性、可理解性和简洁性：

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 字符串

在本集中，Kate Petrova 展示了三个技巧来帮助您在 Kotlin 中使用 [Strings（字符串）](strings)：

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## 使用 Elvis 运算符做更多事情

在本视频中，Sebastian Aigner 将展示如何在 [Elvis 运算符](null-safety#elvis-operator) 中添加更多逻辑，例如在运算符的右侧进行日志记录：

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin 集合

在本集中，Kate Petrova 展示了三个技巧来帮助您使用 [Kotlin Collections（集合）](collections-overview)：

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 接下来是什么？

* 在我们的 [YouTube 播放列表](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7) 中查看完整的 Kotlin Tips 列表
* 了解如何为[流行的案例](idioms)编写符合 Kotlin 语言习惯的代码