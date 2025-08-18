[//]: # (title: 可预测性)

为了设计一个健壮且用户友好的 Kotlin 库，预测常见用例、允许扩展性以及强制正确使用至关重要。遵循默认设置、错误处理和状态管理的最佳实践，可以确保用户获得无缝体验，同时保持库的完整性和质量。

## 默认行为应得体

你的库应预测每个用例的“快乐路径”，并相应地提供默认设置。用户不应为了使库正常工作而必须提供默认值。

例如，在使用 [Ktor `HttpClient`](https://ktor.io/docs/client-create-new-application.html) 时，最常见的用例是向服务器发送 GET 请求。这可以通过以下代码实现，其中只需指定基本信息：

```kotlin
val client = HttpClient(CIO)
val response: HttpResponse = client.get("https://ktor.io/")
```

无需为强制性 HTTP 头或响应中可能的状态码提供自定义事件处理器的值。

如果某个用例没有明显的“快乐路径”，或者某个参数应具有默认值但没有无争议的选项，这很可能表明需求分析存在缺陷。

## 允许扩展机会

当无法预测正确选择时，应允许用户指定其偏好的方法。你的库也应允许用户提供自己的方法或使用第三方扩展。

例如，[Ktor `HttpClient`](https://ktor.io/docs/client-serialization.html) 鼓励用户在配置客户端时安装内容协商支持，并指定其偏好的序列化格式：

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
}
```

用户可以选择安装哪些插件，或者使用[用于定义客户端插件的独立 API](https://ktor.io/docs/client-custom-plugins.html) 创建自己的插件。

此外，用户可以为库中的类型定义扩展函数和属性。作为库作者，你可以通过[在设计时考虑到扩展](api-guidelines-readability.md#use-extension-functions-and-properties)来简化此过程，并确保库的类型具有清晰的核心概念。

## 防止不必要的和无效的扩展

不应允许用户以违反库原始设计或在问题域规则内不可能实现的方式扩展你的库。

例如，在将数据编组为 JSON 和从 JSON 解组数据时，输出格式仅支持六种类型：`object`、`array`、`number`、`string`、`boolean` 和 `null`。

如果你创建一个名为 `JsonElement` 的开放类或接口，用户可能会创建无效的派生类型，例如 `JsonDate`。相反，你可以将 `JsonElement` 接口设为 `sealed`（密封），并为每种类型提供一个实现：

```kotlin
sealed interface JsonElement

class JsonNumber(val value: Number) : JsonElement
class JsonObject(val values: Map<String, JsonElement>) : JsonElement
class JsonArray(val values: List<JsonElement>) : JsonElement
class JsonBoolean(val value: Boolean) : JsonElement
class JsonString(val value: String) : JsonElement
object JsonNull : JsonElement
```

密封类型还使编译器能够确保你的 `when` 表达式是穷尽的，无需 `else` 语句，从而提高了可读性和一致性。

## 避免暴露可变状态

在管理多个值时，你的 API 应尽可能接受和/或返回只读集合。可变集合不是线程安全的，并且会给你的库引入复杂性和不可预测性。

例如，如果用户修改了从 API 入口点返回的可变集合，那么不清楚他们是在修改实现的结构还是在修改副本。同样，如果用户在将集合传递给库后可以修改其中的值，那么不清楚这是否会影响实现。

由于数组是可变集合，请避免在你的 API 中使用它们。如果必须使用数组，请在与用户共享数据之前创建防御性副本。这可确保你的数据结构保持未修改。

编译器会自动对 `vararg` 实参执行这种创建防御性副本的策略。当使用展开操作符传递现有数组到预期 `vararg` 实参的位置时，会自动创建数组的副本。

以下示例演示了此行为：

```kotlin
fun main() {
    fun demo(vararg input: String): Array<out String> = input

    val originalArray = arrayOf("one", "two", "three", "four")
    val newArray = demo(*originalArray)

    originalArray[1] = "ten"

    // 打印 "one, ten, three, four"
    println(originalArray.joinToString())

    // 打印 "one, two, three, four"
    println(newArray.joinToString())
}
```

## 验证输入和状态

在实现继续之前，通过验证输入和现有状态来确保你的库被正确使用。使用 [`require`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函数验证输入，并使用 [`check`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 函数检测现有状态。

如果 `require` 函数的条件为 `false`，它会抛出 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/#kotlin.IllegalArgumentException)，导致函数立即失败并显示适当的错误消息：

```kotlin
fun saveUser(username: String, password: String) {
    require(username.isNotBlank()) { "Username should not be blank" }
    require(username.all { it.isLetterOrDigit() }) {
        "Username can only contain letters and digits, was: $username"
    }
    require(password.isNotBlank()) { "Password should not be blank" }
    require(password.length >= 7) {
        "Password must contain at least 7 characters"
    }

    /* Implementation can proceed */
}
```

错误消息应包含相关输入，以帮助用户确定失败的原因，如上方包含不正确用户名的“用户名包含无效字符”的错误消息所示。此实践的一个例外是，当错误消息中包含某个值可能泄露可能被恶意用于安全漏洞的信息时，这就是密码长度的错误消息不包含密码输入的原因。

同样，如果 `check` 函数的条件为 `false`，它会抛出 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/#kotlin.IllegalStateException)。使用此函数来检测实例的状态，如下面的示例所示：

```kotlin
class ShoppingCart {
    private val contents = mutableListOf<Item>()

    fun addItem(item: Item) {
       contents.add(item)
    }

    fun purchase(): Amount {
       check(contents.isNotEmpty()) {
           "Cannot purchase an empty cart"
       }
       // Calculate and return amount
    }
}
```

## 下一步

在本指南的下一部分中，你将学习有关可调试性的内容。

[继续阅读下一部分](api-guidelines-debuggability.md)