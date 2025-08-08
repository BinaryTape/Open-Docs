[//]: # (title: Kotlin 技巧)

Kotlin Tips 是一个系列短视频，Kotlin 团队的成员在其中展示了如何以更高效、更具 Kotlin 惯用法的方式使用 Kotlin，从而在编写代码时获得更多乐趣。

[订阅我们的 YouTube 频道](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)，以便不错过新的 Kotlin Tips 视频。

## null + null 在 Kotlin 中

在 Kotlin 中，当你执行 `null + null` 时会发生什么？它会返回什么？Sebastian Aigner 在我们最新的快速提示中解决了这个奥秘。他还在顺便展示了为什么不必害怕可空类型：

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## 集合项去重

你的 Kotlin 集合包含重复项吗？需要一个只包含唯一项的集合吗？让 Sebastian Aigner 在这个 Kotlin 技巧中向你展示如何从你的 list 中移除重复项，或将它们转换为 set：

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## 挂起函数与内联的奥秘

像 [`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html)、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 和 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 这样的函数，为什么能在它们的 lambda 表达式中接受挂起函数，即使它们的签名不具备协程感知能力？在这期 Kotlin 技巧中，Sebastian Aigner 解开了这个谜团：这与 inline 修饰符有关：

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 使用完全限定名称解除声明遮蔽

遮蔽（Shadowing）是指在同一作用域内存在两个同名的声明。那么，你该如何选择呢？在这期 Kotlin 技巧中，Sebastian Aigner 向你展示了一个简单的 Kotlin 技巧，借助完全限定名称的强大功能来调用你需要的函数：

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## 使用 Elvis 操作符返回和抛出

[Elvis](null-safety.md#elvis-operator) 操作符再次登场！Sebastian Aigner 解释了为什么这个操作符以这位著名歌手命名，以及如何在 Kotlin 中使用 `?:` 来返回或抛出。幕后魔法是什么？是 [Nothing 类型](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 解构声明

借助 [解构声明](destructuring-declarations.md) 在 Kotlin 中，你可以一次性从单个对象创建多个变量。在这个视频中，Sebastian Aigner 向你展示了可以解构的一些事物——包括 pair、list、map 等。那么你自己的对象呢？Kotlin 的 component 函数也为它们提供了答案：

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## 带可空值的操作符函数

在 Kotlin 中，你可以为自己的类覆盖（override）诸如加法和减法之类的操作符，并提供你自己的逻辑。但如果你想允许其左侧和右侧都为 null 值呢？在这个视频中，Sebastian Aigner 回答了这个问题：

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## 代码计时

观看 Sebastian Aigner 快速概览 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 函数，并了解如何为你的代码计时：

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## 优化循环

在这个视频中，Sebastian Aigner 将演示如何优化[循环](control-flow.md#for-loops)，以使你的代码更具可读性、可理解性和简洁性：

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 字符串

在这期中，Kate Petrova 展示了三个帮助你在 Kotlin 中使用[字符串](strings.md)的技巧：

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## Elvis 操作符的更多用法

在这个视频中，Sebastian Aigner 将展示如何为 [Elvis 操作符](null-safety.md#elvis-operator)添加更多逻辑，例如在操作符的右侧进行日志记录：

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin 集合

在这期中，Kate Petrova 展示了三个帮助你使用 [Kotlin 集合](collections-overview.md)的技巧：

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 接下来？

*   在我们的 [YouTube 播放列表](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)中查看完整的 Kotlin Tips 列表
*   学习如何为[常见情况编写惯用的 Kotlin 代码](idioms.md)