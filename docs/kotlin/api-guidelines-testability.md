[//]: # (title: 可测试性)

除了[测试你的库](api-guidelines-consistency.md#maintain-conventions-and-quality)之外，还要确保使用你的库的代码也是可测试的。

## 避免全局状态和有状态的顶层函数

你的库不应该依赖全局变量中的状态，也不应该提供有状态的顶层函数作为其公共 API 的一部分。
这类变量和函数使得测试使用该库的代码变得困难，因为测试需要找到控制这些全局值的方法。

例如，一个库可能会定义一个全局可访问的函数，用于提供对当前时间的访问：

```kotlin
val instant: Instant = Clock.now()
println(instant)
```

任何使用此 API 的代码都将难以测试，因为对 `now()` 函数的调用将始终返回真实的当前时间，而在测试中通常需要返回模拟值。

为了实现可测试性，[`kotlinx-datetime`](https://github.com/Kotlin/kotlinx-datetime) 库提供了一个 API，允许用户获取一个 `Clock` 实例，然后使用该实例获取当前时间：

```kotlin
val clock: Clock = Clock.System
val instant: Instant = clock.now()
println(instant)
```

这使得库的用户可以将其 `Clock` 实例注入到他们自己的类中，并在测试期间用模拟实现替换真实实现。

## 接下来

如果你还没有这样做，请考虑查阅以下页面：

*   关于如何保持向后兼容性，请参见 [向后兼容性](api-guidelines-backward-compatibility.md) 页面。
*   关于有效文档实践的广泛概述，请参见 [信息丰富的文档](api-guidelines-informative-documentation.md)。