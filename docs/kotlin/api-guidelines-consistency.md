[//]: # (title: 一致性)

一致性在 API 设计中对于确保易用性至关重要。通过保持一致的形参顺序、命名约定和错误处理机制，您的库对于用户来说将更加直观且可靠。遵循这些最佳实践有助于避免混淆和误用，从而带来更好的开发者体验和更健壮的应用程序。

## 保持形参顺序、命名和用法的一致性

在设计库时，请在实参排序、命名方案和重载的使用方面保持一致。
例如，如果您现有的某个方法具有 `offset` 和 `length` 形参，那么除非有极充分的理由，否则在处理新方法时不应切换到 `startIndex` 和 `endIndex` 等替代方案。

库提供的重载函数应表现出相同的行为。
用户期望当他们更改传入库的值的类型时，其行为能保持一致。
例如，以下调用都会创建相同的实例，因为输入在语义上是相同的：

```kotlin
BigDecimal(200)
BigDecimal(200L)
BigDecimal("200")
```

避免将 `startIndex` 和 `stopIndex` 等形参名称与 `beginIndex` 和 `endIndex` 等同义词混用。
同样，为集合中的值选择一个术语，例如 `element`、`item`、`entry` 或 `entity`，并坚持使用它。

对相关方法的命名应保持一致且可预测。例如，Kotlin 标准库包含诸如 `first` 与 `firstOrNull`、`single` 与 `singleOrNull` 之类的配对。
这些配对清楚地表明，某些方法可能会返回 `null`，而其他方法则可能会抛出异常。
形参的声明应从通用到具体，使必选输入首先出现，可选输入最后出现。
例如，在 [`CharSequence.findAnyOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/find-any-of.html) 中，`strings` 集合排在第一位，随后是 `startIndex`，最后是 `ignoreCase` 标志。

假设有一个管理员工记录的库，并提供以下 API 来搜索员工：

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

此 API 将极其难以正确使用。
这里有多个相同类型的形参以不一致的顺序呈现，并以不一致的方式使用。
您库的用户很可能会根据他们对现有函数的使用经验，对新函数做出错误的假设。

## 对数据和状态使用面向对象设计

Kotlin 同时支持面向对象和函数式编程风格。
在 API 中请使用类来表示数据和状态。当数据和状态具有层次结构时，请考虑使用继承。

如果所需的所有状态都可以作为形参传递，则首选使用顶级函数。
当这些函数的调用将被链式调用时，请考虑将它们编写为扩展函数以提高可读性。

## 选择合适的错误处理机制

Kotlin 提供了几种错误处理机制。
您的 API 可以抛出异常、返回 `null` 值、使用自定义结果类型或使用内置的 [`Result`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) 类型。
请确保您的库一致且适当地使用这些选项。

当无法获取或计算数据时，请使用可空返回值类型并返回 `null` 以指示数据缺失。
在其他情况下，请抛出异常或返回 `Result` 类型。

考虑提供函数的重载版本，其中一个抛出异常，而另一个则将其包装在结果类型中。
在这种情况下，使用 `Catching` 后缀来表示异常在该函数中被捕获。
例如，标准库中有遵循此约定的 [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 和 [`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin-run-catching.html) 函数，
协程库中也有用于通道 (channel) 的 [`receive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html) 和 [`receiveCatching`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive-catching.html) 方法。

避免将异常用于正常的控制流。设计您的 API 时，应允许在尝试操作之前进行条件检查，从而防止不必要的错误处理。
[命令/查询分离](https://martinfowler.com/bliki/CommandQuerySeparation.html) 是一个可以应用于此处的有用模式。

## 维护约定与质量

一致性的最后一个方面与库本身的设计无关，而与保持高水平的质量有关。

您应该使用自动化工具 (Linter) 进行静态分析，以确保您的代码遵循通用的 Kotlin 约定和项目特定的约定。

Kotlin 库还应提供一套单元测试和集成测试，覆盖所有 API 入口点的所有文档化行为。
测试应包含广泛的输入，尤其是已知的边界情况和边缘情况。任何未经测试的行为都应被视为（往好里说也是）不可靠的。

在开发过程中使用这套测试来验证更改是否破坏了现有行为。
在每次发布时，将其作为标准化构建与发布流水线的一部分运行这些测试。
[Kover](https://github.com/Kotlin/kotlinx-kover) 等工具可以集成到您的构建过程中，以衡量覆盖率并生成报告。

## 下一步

在本指南的下一部分中，您将了解可预测性。

[继续阅读下一部分](api-guidelines-predictability.md)