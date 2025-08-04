[//]: # (title: 可读性)

创建可读的 API 不仅仅是编写整洁的代码。它需要周到的设计，以简化集成和使用。本节将探讨如何通过在设计库时考虑到可组合性、利用领域特定语言（DSLs）实现简洁且富有表现力的设置，以及使用扩展函数和属性实现清晰且可维护的代码来增强 API 可读性。

## 优先选择显式可组合性

库通常提供高级操作符以实现自定义。例如，一个操作可能允许用户提供自己的数据结构、网络通道、计时器或生命周期观察者。然而，通过额外的函数形参引入这些自定义选项会显著增加 API 的复杂性。

与其为自定义添加更多形参，不如设计一个能让不同行为组合在一起的 API 会更有效。例如，在协程 Flow API 中，[缓冲](flow.md#buffering)和[汇合](flow.md#conflation)都是作为单独的函数实现的。它们可以与 [`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) 和 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html) 等更基本的操作串联起来，而不是让每个基本操作都接受形参来控制缓冲和汇合。

另一个示例是 [Jetpack Compose 中的 Modifiers API](https://developer.android.com/develop/ui/compose/modifiers)。它允许可组合组件接受一个 `Modifier` 形参，该形参处理常见的自定义选项，例如内边距、尺寸和背景色。这种方法避免了每个可组合项都接受单独形参进行这些自定义的需要，从而简化了 API 并降低了复杂性。

```kotlin
Box(
    modifier = Modifier
        .padding(10.dp)
        .onClick { println("Box clicked!") }
        .fillMaxWidth()
        .fillMaxHeight()
        .verticalScroll(rememberScrollState())
        .horizontalScroll(rememberScrollState())
) {
    // Box content goes here
}
```

## 使用 DSL

Kotlin 库可以通过提供构建器 DSL 来显著提高可读性。使用 DSL 可以让你简洁地重复领域特定数据声明。例如，考虑以下来自基于 Ktor 的服务器应用程序的示例：

```kotlin
fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
    routing {
        post("/article") {
            call.respond<String>(HttpStatusCode.Created, ...)
        }
        get("/article/list") {
            call.respond<List<CreateArticle>>(...)
        }
        get("/article/{id}") {
            call.respond<Article>(...)
        }
    }
}
```

这会设置一个应用程序，安装配置为使用 JSON 序列化的 `ContentNegotiation` 插件，并设置路由，以便应用程序响应各种 `/article` 端点的请求。

关于创建 DSL 的详细描述，请参见 [类型安全构建器](type-safe-builders.md)。在创建库的上下文中，以下几点值得注意：

*   DSL 中使用的函数是构建器函数，它们将带接收者的 lambda 表达式作为最后一个形参。这种设计允许这些函数在无需圆括号的情况下被调用，使语法更清晰。传入的 lambda 表达式可用于配置正在创建的实体。在上面的示例中，传入 `routing` 函数的 lambda 表达式用于配置路由的详细信息。
*   创建类实例的工厂函数应与返回类型同名，并以大写字母开头。你可以在上面的 `Json` 实例创建示例中看到这一点。这些函数仍可能接受 lambda 形参进行配置。有关更多信息，请参见 [编码约定](coding-conventions.md#function-names)。
*   由于无法在编译期确保提供给构建器函数的 lambda 表达式中已设置了所需属性，我们建议将所需值作为函数形参传递。

使用 DSL 构建对象不仅提高了可读性，还提高了向后兼容性，并简化了文档编写过程。例如，考虑以下函数：

```kotlin
fun Json(prettyPrint: Boolean, isLenient: Boolean): Json
```

此函数可以取代 `Json{}` DSL 构建器。然而，DSL 方法具有显著的优势：

*   使用 DSL 构建器比使用此函数更容易维护向后兼容性，因为添加新的配置选项只需添加新属性（或在其他示例中，添加新函数），这是一种向后兼容的更改，不像更改现有函数的形参列表那样。
*   它还使创建和维护文档更容易。你可以在每个属性的声明处单独记录，而不必在一个地方记录函数的许多形参。

## 使用扩展函数和属性

我们建议使用[扩展函数和属性](extensions.md)来提高可读性。

类和接口应定义类型的核心概念。额外的功能和信息应编写为扩展函数和属性。这使得读者清楚地知道，额外功能可以在核心概念之上实现，并且可以从类型中的数据计算出额外信息。

例如，`CharSequence` 类型（`String` 也实现了它）只包含访问其内容的最基本信息和操作符：

```kotlin
interface CharSequence {
    val length: Int
    operator fun get(index: Int): Char
    fun subSequence(startIndex: Int, endIndex: Int): CharSequence
}
```

通常与字符串关联的功能大多定义为扩展函数，所有这些功能都可以在该类型的核心概念和基本 API 之上实现：

```kotlin
inline fun CharSequence.isEmpty(): Boolean = length == 0
inline fun CharSequence.isNotEmpty(): Boolean = length > 0

inline fun CharSequence.trimStart(predicate: (Char) -> Boolean): CharSequence {
    for (index in this.indices)
        if (!predicate(this[index]))
           return subSequence(index, length)
    return ""
}
```

考虑将计算属性和普通方法声明为扩展。只有常规属性、覆盖以及重载操作符应默认声明为成员。

## 避免使用布尔类型作为实参

考虑以下函数：

```kotlin
fun doWork(optimizeForSpeed: Boolean) { ... }
```

如果你在 API 中提供此函数，它可能被调用为：

```kotlin
doWork(true)
doWork(optimizeForSpeed=true)
```

在第一次调用中，除非你在启用了形参名称提示的 IDE 中阅读代码，否则无法推断布尔实参的用途。使用命名实参确实能阐明意图，但无法强制用户采用这种风格。因此，为了提高可读性，你的代码不应使用布尔类型作为实参。

或者，API 可以创建专门用于由布尔实参控制的任务的单独函数。此函数应具有描述性名称，表明其作用。

例如，[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/) 接口上提供了以下扩展：

```kotlin
fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R>
fun <T, R : Any> Iterable<T>.mapNotNull(
    transform: (T) -> R?
): List<R>
```

而不是单个方法：

```kotlin
fun <T, R> Iterable<T>.map(
    includeNullResults: Boolean = true, 
    transform: (T) -> R
): List<R>
```

另一种好方法是使用 `enum` 类来定义不同的操作模式。如果存在多种操作模式，或者你预期这些模式会随时间变化，则此方法很有用。

## 恰当使用数值类型

Kotlin 定义了一组数值类型，你可以在 API 中使用它们。以下是恰当使用它们的方法：

*   将 `Int`、`Long` 和 `Double` 类型用作算术类型。它们表示用于执行计算的值。
*   避免将算术类型用于非算术实体。例如，如果你将 ID 表示为 `Long`，用户可能会倾向于比较 ID，假设它们是按顺序分配的。这可能导致不可靠或无意义的结果，或创建对可能在不发出警告的情况下更改的实现的依赖项。更好的策略是为 ID 抽象定义一个专门的类。你可以使用 [内联值类](inline-classes.md) 来构建此类抽象而不会影响性能。请参见 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类以获取示例。
*   `Byte`、`Float` 和 `Short` 类型是内存布局类型。它们用于限制可用于存储值的内存量，例如在缓存中或通过网络传输数据时。这些类型仅在底层数据可靠地适配该类型且不需要计算时才应使用。
*   无符号整型 `UByte`、`UShort`、`UInt` 和 `ULong` 应在需要利用给定格式中所有正值的完整范围时使用。它们适用于需要超出有符号类型范围的值或与原生库互操作的场景。然而，在领域仅要求[非负整数](unsigned-integer-types.md#non-goals)的情况下，应避免使用它们。

## 下一步

在本指南的下一部分中，你将了解一致性。

[继续下一部分](api-guidelines-consistency.md)