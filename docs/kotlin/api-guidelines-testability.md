[//]: # (title: 可测试性)

除了[测试你的库](api-guidelines-consistency.md#maintain-conventions-and-quality)外，还要确保使用你的库的代码也是可测试的。

## 避免全局状态和有状态的顶级函数

你的库不应依赖全局变量中的状态，也不应在公共 API 中提供有状态的顶级函数。
此类变量和函数会使测试使用该库的代码变得困难，因为测试需要寻找方法来控制这些全局值。

例如，一个库可能会定义一个可全局访问的函数，用于提供对当前时间的访问：

```kotlin
val instant: Instant = Clock.now()
println(instant)
```

任何使用此 API 的代码都将难以进行测试，因为对 `now()` 函数的调用将始终返回真实的当前时间，而在测试中通常希望返回虚假值（fake values）。

为了实现可测试性，[`kotlinx-datetime`](https://github.com/Kotlin/kotlinx-datetime) 库提供了一个 API，允许用户获取 `Clock` 实例，然后使用该实例获取当前时间：

```kotlin
val clock: Clock = Clock.System
val instant: Instant = clock.now()
println(instant)
```

这允许库的用户将 `Clock` 实例注入到他们自己的类中，并在测试期间将真实实现替换为虚假实现。

## 后续步骤

如果你还没有阅读过，请考虑查看以下页面：

* 在[向后兼容性](api-guidelines-backward-compatibility.md)页面中了解有关保持向后兼容性的信息。
* 有关有效文档实践的详细概述，请参阅[信息丰富的文档](api-guidelines-informative-documentation.md)。