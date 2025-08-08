[//]: # (title: 可调试性)

你的库的用户将基于其功能进行构建，而他们构建的特性将包含需要识别和解决的错误。此错误解决过程可能在开发期间在调试器中进行，也可能在生产环境中使用日志记录和可观测性工具进行。你的库可以遵循这些最佳实践，使其调试起来更容易。

## 为有状态类型提供 toString 方法

对于每个包含状态的类型，都应提供一个有意义的 `toString` 实现。此实现应返回实例当前内容的易于理解的表示，即使对于内部类型也是如此。

由于类型的 `toString` 表示通常会写入日志，因此在实现此方法时请考虑安全性，并避免返回敏感用户数据。

确保用于描述状态的格式在库中不同类型之间尽可能保持一致。当此格式是你的 API 实现的契约的一部分时，应显式描述并充分文档化。你的 `toString` 方法的输出可能支持解析，例如在自动化测试套件中。

例如，考虑一个支持服务订阅的库中的以下类型：

```kotlin
enum class SubscriptionResultReason {
    Success, InsufficientFunds, IncompatibleAccount
}

class SubscriptionResult(
    val result: Boolean,
    val reason: SubscriptionResultReason,
    val description: String
)
```

如果没有 `toString` 方法，打印 `SubscriptionResult` 实例的作用不大：

```kotlin
fun main() {
    val result = SubscriptionResult(
       false,
       IncompatibleAccount,
       "Users account does not support this type of subscription"
    )
    
    //prints 'org.example.SubscriptionResult@13221655'
    println(result)
}
```

信息在调试器中也无法方便地显示：

![调试器中的结果](debugger-result.png){width=500}

添加一个简单的 `toString` 实现可以显著改善这两种情况下的输出：

```kotlin
//prints 'Subscription failed (reason=IncompatibleAccount, description="Users 
// account does not support this type of subscription")'
override fun toString(): String {
    val resultText = if(result) "succeeded" else "failed"
    return "Subscription $resultText (reason=$reason, description=\"$description\")"
}
```

![添加 toString 后结果显著改善](debugger-result-tostring.png){width=700}

尽管使用 `data class` 自动获得 `toString` 方法可能很诱人，但出于向后兼容性原因，不建议这样做。有关 `data class` 的更多详细信息，请参见[避免在你的 API 中使用 `data class`](api-guidelines-backward-compatibility.md#avoid-using-data-classes-in-your-api) 部分。

请注意，`toString` 方法中描述的状态无需是来自问题域的信息。它可以与进行中请求的状态（如上述示例）、外部服务连接的健康状况，或进行中操作中的中间状态相关。

例如，考虑以下构建器类型：

```kotlin
class Person(
    val name: String?,
    val age: Int?,
    val children: List<Person>
) {
    override fun toString(): String =
        "Person(name=$name, age=$age, children=$children)"
}

class PersonBuilder {
    var name: String? = null
    var age: Int? = null
    val children = arrayListOf<Person>()

    fun child(personBuilder: PersonBuilder.() -> Unit = {}) {
       children.add(person(personBuilder))
    }
    fun build(): Person = Person(name, age, children)
}

fun person(personBuilder: PersonBuilder.() -> Unit = {}): Person = 
    PersonBuilder().apply(personBuilder).build()
```

你将这样使用此类型：

![使用构建器类型示例](halt-breakpoint.png){width=500}

如果你将代码在上面图片中显示的断点处暂停，显示的信息将没有帮助：

![在断点处暂停代码的结果](halt-result.png){width=500}

添加一个简单的 `toString` 实现会带来更有用的输出：

```kotlin
override fun toString(): String =
    "PersonBuilder(name=$name, age=$age, children=$children)"
```

添加此实现后，调试器显示：

![向暂停点添加 toString](halt-tostring-result.png){width=700}

这样，你可以立即可见哪些字段已设置，哪些未设置。

## 采纳并文档化异常处理策略

正如在[选择适当的错误处理机制](api-guidelines-consistency.md#choose-the-appropriate-error-handling-mechanism) 部分中讨论的，有时你的库抛出异常以发出错误信号是适当的。你可以为此目的创建自己的异常类型。

抽象和简化低级 API 的库也需要处理由其依赖项抛出的异常。一个库可能会选择抑制异常、按原样传递异常、将其转换为不同类型的异常，或者以不同方式向用户发出错误信号。

这些选项中的任何一个都可能是有效的，具体取决于上下文。例如：

*   如果用户采用库 A 纯粹是为了简化库 B 的便利，那么库 A 重新抛出由库 B 生成的任何异常而不加修改可能是适当的。
*   如果库 A 采用库 B 纯粹作为内部实现细节，那么由库 B 抛出的库特有的异常绝不应暴露给库 A 的用户。

你必须采纳并文档化一致的异常处理方法，以便用户可以高效使用你的库。这对于调试尤其重要。你的库的用户应该能够在调试器和日志中识别出异常何时源自你的库。

异常的类型应表明错误的类型，而异常中的数据应帮助用户定位问题的根本原因。一种常见模式是将低级异常包装在库特有的异常中，原始异常可作为 `cause` 访问。

## 下一步

在指南的下一部分中，你将了解可测试性。

[继续到下一部分](api-guidelines-testability.md)