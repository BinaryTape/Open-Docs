[//]: # (title: 在 Spring Boot 项目中使用集合)

<tldr>
    <p>这是 **Spring Boot 与 Kotlin 入门** 教程的一部分。在继续之前，请确保已完成之前的步骤：</p><br/>
    <p><a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 创建 Spring Boot 项目</a><br/><a href="jvm-spring-boot-add-data-class.md">向 Spring Boot 项目添加数据类</a><br/><strong>为 Spring Boot 项目添加数据库支持</strong><br/></p>
</tldr>

在本部分中，你将学习如何在 Kotlin 中对集合执行各种操作。
虽然在许多情况下 SQL 可以帮助进行数据操作，例如过滤和排序，但在实际应用程序中，我们通常需要处理集合来操纵数据。

在下方，你将找到一些基于我们演示应用程序中已有的数据对象，用于处理集合的实用范例。
在所有示例中，我们假设首先通过调用 `service.findMessages()` 函数从数据库中检索所有存储的消息，然后执行各种操作来过滤、排序、分组或转换消息列表。

## 检索元素

Kotlin 集合提供了一组用于从集合中检索单个元素的函数。
可以根据位置或匹配条件从集合中检索单个元素。

例如，通过相应的函数 `first()` 和 `last()` 可以检索集合的第一个和最后一个元素：

```kotlin
@GetMapping("/firstAndLast")
fun firstAndLast(): List<Message> {
    val messages = service.findMessages()
    return listOf(messages.first(), messages.last())
}
```

在上面的示例中，检索集合的第一个和最后一个元素，并创建一个新的包含两个元素的列表，该列表将被序列化为 JSON 文档。

要检索特定位置的元素，可以使用 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 函数。

 `first()` 和 `last()` 函数也允许你搜索集合中与给定谓词匹配的元素。
例如，以下是如何在列表中查找消息文本长度超过十个字符的第一个 `Message` 实例：

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

当然，也可能没有消息长于给定的字符限制。
在这种情况下，上述代码会产生 `NoSuchElementException`。
或者，你可以使用 `firstOrNull()` 函数在集合中没有匹配元素的情况下返回 null。
此时，程序员有责任检查结果是否为 null：

```kotlin
@GetMapping("/retrieveFirstMessageLongerThan10")
fun firstMessageOrNull(): Message {
    val messages = service.findMessages()
    return messages.firstOrNull { 
        it.text.length > 10 
    } ?: Message(null, "Default message")
}

```

## 过滤元素

_过滤_ 是集合处理中最常见的任务之一。
标准库包含一组扩展函数，允许你通过一次调用过滤集合。
这些函数使原始集合保持不变，并生成一个包含过滤元素的新集合：

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

此代码看起来与你使用 `first()` 函数查找文本长度大于 10 的单个元素的示例非常相似。
不同之处在于 `filter()` 返回一个与条件匹配的元素列表。

## 排序元素

元素的顺序是某些集合类型的一个重要方面。
Kotlin 的标准库提供了多种函数，用于以各种方式进行排序：自然顺序、自定义顺序、反向顺序和随机顺序。

例如，让我们按最后一个字母对列表中的消息进行排序。
这可以通过使用 `sortedBy()` 函数实现，该函数使用选择器从集合对象中提取所需的值。
列表中元素的比较将基于提取的值进行：

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## 分组元素

分组可能需要实现一些相当复杂的逻辑，关于元素应如何分组。
 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 函数接受一个 lambda 表达式并返回一个 `Map`。
在此 `Map` 中，每个 key 都是 lambda 表达式的结果，而对应的值是返回此结果的元素 `List`。

让我们通过匹配特定单词（例如“hello”和“bye”）来分组消息。
如果消息文本不包含任何提供的单词，那么你将它添加到名为“other”的单独分组中：

```kotlin
@GetMapping("/groups")
fun groups(): Map<String, List<Message>> {
    val messages = service.findMessages()
    val groups = listOf("hello", "bye")

    val map = messages.groupBy { message ->
        groups.firstOrNull {
            message.text.contains(it, ignoreCase = true)
        } ?: "other"
    }

    return map
}
```

## 转换操作

集合的常见任务是将集合元素从一种类型转换为另一种类型。
当然，Kotlin 标准库为此类任务提供了许多[转换函数](collection-transformations.md)。

例如，让我们将 `Message` 对象的列表转换为 `String` 对象的列表，这些 `String` 对象通过连接消息的 `id` 和 `text` 主体组成。
为此，我们可以使用 `map()` 函数，它将给定的 lambda 函数应用于每个后续元素，并返回 lambda 结果的列表：

```kotlin
@GetMapping("/transformMessagesToListOfStrings")
fun transformMessagesToListOfStrings(): List<String> {
    val messages = service.findMessages()
    return messages.map { "${it.id} ${it.text}" }
}
```

## 聚合操作

聚合操作从一组值中计算单个值。
聚合操作的一个示例是计算所有消息长度的平均值：

```kotlin
@GetMapping("/averageMessageLength")
fun averageMessageLength(): Double {
    val messages = service.findMessages()
    return messages.map { it.text.length }.average()
}
```

首先，使用 `map()` 函数将消息列表转换为表示每条消息长度的值列表。
然后你可以使用 `average` 函数计算最终结果。

其他聚合函数的示例有 `mix()`、`max()`、`sum()` 和 `count()`。

对于更具体的用例，还有 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 函数，它们按顺序将提供的操作应用于集合元素并返回累积结果。

例如，让我们找到文本最长的消息：

```kotlin
@GetMapping("findTheLongestMessage")
fun reduce(): Message {
    val messages = service.findMessages()
    return messages.reduce { first, second ->
        if (first.text.length > second.text.length) first else second
    }
}
```

## 下一步

前往[下一节](jvm-spring-boot-using-crudrepository.md)。