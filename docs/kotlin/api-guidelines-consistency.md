[//]: # (title: 一致性)

一致性在 API 设计中至关重要，能确保易用性。通过保持形参顺序、命名约定和错误处理机制的一致性，您的库将对用户更直观、更可靠。遵循这些最佳实践有助于避免混淆和误用，从而带来更好的开发者体验和更健壮的应用程序。

## 保持形参顺序、命名和用法一致

在设计库时，请保持实参的顺序、命名方案和重载使用的一致性。例如，如果您现有方法具有 `offset` 和 `length` 形参，则不应为新方法切换到 `startIndex` 和 `endIndex` 等替代方案，除非有充分的理由。

库提供的重载函数应行为相同。用户期望在他们更改传递给库的值类型时，其行为保持一致。例如，这些调用都创建了相同的实例，因为输入在语义上是相同的：

```kotlin
BigDecimal(200)
BigDecimal(200L)
BigDecimal("200")
```

避免混用 `startIndex` 和 `stopIndex` 等形参名称与 `beginIndex` 和 `endIndex` 等同义词。同样，为集合中的值选择一个术语，例如 `element`、`item`、`entry` 或 `entity`，并坚持使用它。

以一致且可预测的方式命名相关方法。例如，Kotlin 标准库包含 `first` 和 `firstOrNull`、`single` 或 `singleOrNull` 等配对。这些配对清晰地表明某些可能返回 `null`，而另一些可能抛出异常。形参应按从一般到具体的顺序声明，因此必要输入出现在前面，可选输入出现在最后。例如，在 [`CharSequence.findAnyOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/find-any-of.html) 中，`strings` 集合在前，接着是 `startIndex`，最后是 `ignoreCase` 标志。

考虑一个管理员工记录的库，它提供以下 API 来搜索员工：

```kotlin
fun findStaffBySeniority(
    startIndex: Int, 
    minYearsServiceExclusive: Int
): List<Employee>

fun findStaffByAge(
    minAgeInclusive: Int, 
    startIndex: Int
): List<Employee>
```

此 API 将极其难以正确使用。存在多个相同类型的形参，它们以不一致的顺序呈现，并以不一致的方式使用。您的库用户很可能会根据他们使用现有函数的经验，对新函数做出不正确的假设。

## 将面向对象设计用于数据和状态

Kotlin 同时支持面向对象和函数式编程风格。在您的 API 中使用类来表示数据和状态。当数据和状态具有层次结构时，考虑使用继承。

如果所有所需状态都可以作为形参传递，则优先使用顶层函数。当对这些函数的调用将要进行链式操作时，考虑将它们编写为扩展函数以提高可读性。

## 选择合适的错误处理机制

Kotlin 提供了几种错误处理机制。您的 API 可以抛出异常、返回 `null` 值、使用自定义结果类型，或使用内置的 [`Result`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) 类型。确保您的库一致且适当地使用这些选项。

当无法获取或计算数据时，使用可空的返回类型并返回 `null` 以指示数据缺失。在其他情况下，抛出异常或返回 `Result` 类型。

考虑提供函数的重载版本，其中一个抛出异常，而另一个则将其包装在结果类型中。在这些情况下，使用 `Catching` 后缀来表示函数中捕获了异常。例如，标准库有使用此约定的 [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 和 [`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html) 函数，并且协程库有用于通道的 [`receive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html) 和 [`receiveCatching`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive-catching.html) 方法。

避免将异常用于正常的控制流。设计您的 API，允许在尝试操作之前进行条件检测，从而防止不必要的错误处理。命令/查询分离 (Command / Query Separation) 是一种可在此处应用的有用模式。

## 保持约定和质量

一致性的最后一个方面与库本身的设计无关，而是与保持高质量水平有关。

您应该使用自动化工具（代码检查工具）进行静态分析，以确保您的代码遵循通用的 Kotlin 约定和项目特有的约定。

Kotlin 库还应提供一套单元测试和集成测试，涵盖所有 API 入口点的所有文档化行为。测试应包含广泛的输入，特别是已知的边界情况和边缘情况。任何未经测试的行为都应被假定为（充其量）不可靠。

在开发期间使用这套测试来验证更改不会破坏现有行为。在每次发布时，作为标准化构建和发布流水线的一部分，运行这些测试。像 [Kover](https://github.com/Kotlin/kotlinx-kover) 这样的工具可以集成到您的构建过程中，以测量覆盖率并生成报告。

## 下一步

本指南的下一部分将介绍可预测性。

[继续阅读下一部分](api-guidelines-predictability.md)