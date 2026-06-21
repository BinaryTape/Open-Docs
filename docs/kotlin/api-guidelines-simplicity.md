[//]: # (title: 简洁性)

用户需要理解的概念越少，且这些概念传达得越明确，他们的心智模型就可能越简单。这可以通过限制 API 中的操作和抽象数量来实现。

确保库中声明的[可见性](visibility-modifiers.md)设置得当，以使内部实现细节不包含在公开 API 中。只有明确设计并记录为供公开使用的 API 才应让用户能够访问。

在指南的下一部分中，我们将讨论一些促进简洁性的准则。

## 使用显式 API 模式

我们建议使用 Kotlin 编译器的[显式 API 模式](whatsnew14.md#explicit-api-mode-for-library-authors)功能，这会强制你在设计库 API 时显式说明你的意图。

在显式 API 模式下，你必须：

* 为声明添加可见性修饰符使其成为公开声明，而不是依赖默认的 public 可见性。这可以确保你已经考虑过哪些内容是作为公开 API 的一部分暴露出来的。
* 为所有公开函数和属性定义类型，以防止推断类型导致 API 发生意外更改。

## 重用现有概念

限制 API 规模的一种方法是重用现有类型。例如，可以使用 [`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 而不是为持续时间创建新类型。这种方法不仅能简化开发，还能提高与其他库的互操作性。

依赖第三方库的类型或平台特定的类型时要小心，因为它们会将你的库与这些元素绑定在一起。在这种情况下，成本可能会超过收益。

重用 `String`、`Long`、`Pair` 和 `Triple` 等常用类型可能很有效，但如果抽象数据类型能够更好地封装领域专用逻辑，这不应阻碍你开发这些类型。

## 定义并基于核心 API 进行构建

另一种实现简洁性的途径是定义一个基于有限核心操作集的小型概念模型。一旦这些操作的行为被清晰地记录在文档中，你就可以通过开发直接构建在这些核心函数之上或组合这些核心函数的新操作来扩展 API。

例如：

* 在 [Kotlin Flow API](coroutines-flow.md) 中，[`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) 和 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html) 等常用操作是构建在 [`transform`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html) 操作之上的。
* 在 [Kotlin Time API](time-measurement.md) 中，[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 函数利用了 [`TimeSource.Monotonic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/-monotonic/)。

虽然基于这些核心组件开发额外操作通常是有益的，但并非总是必要。你可能会发现引入优化过的或平台特定的变体，以扩展功能或更广泛地适应不同的输入。

只要用户能够使用核心操作解决复杂问题，并能够通过额外操作重构其解决方案而不改变任何行为，概念模型的简洁性就会得到保持。

## 下一步

在指南的下一部分中，你将学习有关可读性的内容。

[继续阅读下一部分](api-guidelines-readability.md)