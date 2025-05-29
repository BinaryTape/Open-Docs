[//]: # (title: Kotlin 技巧)

Kotlin 技巧是一个短视频系列，其中 Kotlin 团队成员将展示如何以更高效、更地道的方式使用 Kotlin，从而在编写代码时获得更多乐趣。

[订阅我们的 YouTube 频道](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)，以免错过新的 Kotlin 技巧视频。

## Kotlin 中的 null + null

在 Kotlin 中将 `null + null` 相加会发生什么，它会返回什么？Sebastian Aigner 在我们最新的快速技巧中揭示了这一谜团。在此过程中，他还展示了为什么无需害怕可空类型 (nullables)：

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## 对集合项进行去重

你的 Kotlin 集合包含重复项吗？需要一个只包含唯一项的集合吗？在此 Kotlin 技巧中，让 Sebastian Aigner 向你展示如何从列表中删除重复项，或将其转换为集合：

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## suspend 和 inline 的奥秘

为什么诸如 [`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html)、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 和 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 这样的函数在其 lambda 表达式中接受 suspend 函数，即使它们的签名并未感知协程 (coroutines-aware)？在本期 Kotlin 技巧中，Sebastian Aigner 解开了这个谜团：这与 `inline` 修饰符有关：

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 使用完全限定名称解除声明的遮蔽

遮蔽（Shadowing）是指在同一作用域内有两个同名声明。那么，你如何选择呢？在本期 Kotlin 技巧中，Sebastian Aigner 向你展示了一个简单的 Kotlin 技巧，教你如何利用完全限定名称的力量，准确调用你所需的函数：

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## 使用 Elvis 运算符进行返回和抛出

[Elvis 运算符](null-safety.md#elvis-operator) 再次登场！Sebastian Aigner 解释了为什么这个运算符以这位著名歌手命名，以及如何在 Kotlin 中使用 `?:` 进行返回或抛出。幕后的奥秘是什么？是 [Nothing 类型](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 解构声明

借助 [解构声明](destructuring-declarations.md) 在 Kotlin 中，你可以一次性从单个对象创建多个变量。在此视频中，Sebastian Aigner 向你展示了一系列可以解构的内容——包括对 (pairs)、列表 (lists)、映射 (maps) 等。那么你自己的对象呢？Kotlin 的 component 函数也为此提供了解决方案：

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## 带有可空值的运算符函数

在 Kotlin 中，你可以为自己的类重写加法和减法等运算符，并提供自己的逻辑。但如果你想允许其左右两侧都包含 `null` 值，该怎么办？在此视频中，Sebastian Aigner 回答了这个问题：

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## 代码计时

观看 Sebastian Aigner 快速概述 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 函数，了解如何为你的代码计时：

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## 改进循环

在此视频中，Sebastian Aigner 将演示如何改进 [循环](control-flow.md#for-loops) 以使你的代码更具可读性、更易理解且更简洁：

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 字符串

在本期节目中，Kate Petrova 展示了三个帮助你在 Kotlin 中使用 [字符串](strings.md) 的技巧：

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## Elvis 运算符的更多用法

在此视频中，Sebastian Aigner 将展示如何为 [Elvis 运算符](null-safety.md#elvis-operator) 添加更多逻辑，例如将日志记录到运算符的右侧部分：

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin 集合

在本期节目中，Kate Petrova 展示了三个帮助你在 Kotlin 中使用 [Kotlin 集合](collections-overview.md) 的技巧：

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 接下来？

*   在我们的 [YouTube 播放列表](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7) 中查看完整的 Kotlin 技巧列表
*   了解如何为[常见用例编写地道的 Kotlin 代码](idioms.md)