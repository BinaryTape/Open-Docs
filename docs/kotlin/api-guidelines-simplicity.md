[//]: # (title: 简洁性)

用户需要理解的概念越少，这些概念的传达越显式，他们的心智模型就可能越简单。这可以通过限制 API 中的操作和抽象数量来实现。

确保库中声明的[可见性](visibility-modifiers.md)设置适当，以使内部实现细节不暴露在公共 API 中。只有显式设计并为公共使用而文档化的 API 才应该对用户可访问。

在指南的下一部分，我们将讨论一些促进简洁性的指导原则。

## 使用显式 API 模式

我们建议使用 Kotlin 编译器的[显式 API 模式](whatsnew14.md#explicit-api-mode-for-library-authors)特性，它强制你在设计库的 API 时显式声明你的意图。

使用显式 API 模式时，你必须：

*   为你的声明添加可见性修饰符使其公共化，而不是依赖默认的公共可见性。这确保你已经考虑过作为公共 API 一部分所暴露的内容。
*   定义所有公共函数和属性的类型，以防止推断类型对你的 API 造成意外更改。

## 复用现有概念

限制 API 大小的一种方法是复用现有类型。例如，你可以使用 [`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 而不是为持续时间创建新类型。这种方法不仅简化了开发，还提高了与其他库的互操作性。

依赖第三方库或平台特有类型时请谨慎，因为它们可能将你的库与这些元素绑定。在这种情况下，成本可能大于收益。

复用 `String`、`Long`、`Pair` 和 `Triple` 等常见类型是有效的，但这不应该阻止你开发抽象数据类型，如果它们能更好地封装领域特有逻辑。

## 定义并基于核心 API 构建

实现简洁性的另一途径是定义一个基于有限核心操作集的微小概念模型。一旦这些操作的行为被清晰地文档化，你就可以通过开发直接基于或组合这些核心函数的新操作来扩展 API。

例如：

*   在 [Kotlin Flows API](flow.md) 中，[`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) 和 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html) 等常见操作都是基于 [`transform`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html) 操作构建的。
*   在 [Kotlin Time API](time-measurement.md) 中，[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 函数利用了 [`TimeSource.Monotonic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/-monotonic/)。

尽管基于这些核心组件构建附加操作通常是有益的，但这并非总是必要的。你可能会发现机会引入优化过的或平台特有变体，以扩展功能或更广泛地适应不同的输入。

只要用户能够使用核心操作解决非平凡问题，并可以在不改变任何行为的情况下，用附加操作重构他们的解决方案，那么概念模型的简洁性就能得以保持。

## 下一步

在指南的下一部分，你将学习可读性。

[继续阅读下一部分](api-guidelines-readability.md)