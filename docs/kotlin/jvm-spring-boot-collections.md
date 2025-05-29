[//]: # (title: 在 Spring Boot 项目中处理集合)

<tldr>
    <p>这是 **Spring Boot 和 Kotlin 入门**教程的一部分。在继续之前，请确保您已完成之前的步骤：</p><br/>
    <p><a href="jvm-create-project-with-spring-boot.md">创建一个基于 Kotlin 的 Spring Boot 项目</a><br/><a href="jvm-spring-boot-add-data-class.md">向 Spring Boot 项目添加数据类</a><br/><strong>为 Spring Boot 项目添加数据库支持</strong><br/></p>
</tldr>

在这部分中，您将学习如何在 Kotlin 中对集合执行各种操作。
尽管在许多情况下，SQL 可以帮助执行过滤和排序等数据操作，但在实际应用中，我们经常需要处理集合来操作数据。

下面您将找到一些基于我们演示应用中已有数据对象来处理集合的实用技巧。
在所有示例中，我们都假定首先通过调用 `service.findMessages()` 函数从数据库中检索所有存储的消息，然后执行各种操作来过滤、排序、分组或转换消息列表。

## 检索元素

Kotlin 集合提供了一组用于从集合中检索单个元素的函数。
可以通过位置或匹配条件从集合中检索单个元素。

例如，可以使用对应的 `first()` 和 `last()` 函数来检索集合的第一个和最后一个元素：

```kotlin
@GetMapping("/firstAndLast")
fun firstAndLast(): List<Message> {
    val messages = service.findMessages()
    return listOf(messages.first(), messages.last())
}
```

在上面的示例中，检索集合的第一个和最后一个元素，并创建一个包含两个元素的新列表，该列表将被序列化为 JSON 文档。

要检索特定位置的元素，可以使用 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 函数。

`first()` 和 `last()` 函数还允许您在集合中搜索与给定谓词匹配的元素。
例如，以下是如何在列表中找到第一个消息长度超过十个字符的 `Message` 实例：

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

当然，也可能没有消息的长度超过给定的字符限制。
在这种情况下，上面的代码会抛出 `NoSuchElementException`。
另外，您可以使用 `firstOrNull()` 函数，在集合中没有匹配元素时返回 `null`。
此时，程序员有责任检查结果是否为 `null`。

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
标准库包含一组扩展函数，可让您通过一次调用来过滤集合。
这些函数会保留原始集合不变，并生成一个包含过滤后元素的新集合：

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

这段代码看起来与您使用 `first()` 函数查找文本长度大于 10 的单个元素的示例非常相似。
不同之处在于 `filter()` 返回的是匹配条件的元素列表。

## 排序元素

元素的顺序是某些集合类型的一个重要方面。
Kotlin 的标准库提供了多种排序函数：自然排序、自定义排序、反向排序和随机排序。

例如，让我们按消息的最后一个字母对列表中的消息进行排序。
这可以通过使用 `sortedBy()` 函数实现，该函数使用一个选择器从集合对象中提取所需的值。
然后，列表中的元素将根据提取的值进行比较：

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## 分组元素

分组可能需要实现一些相当复杂的逻辑，来确定元素应如何组合在一起。
[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 函数接受一个 lambda 表达式并返回一个 `Map`。
在此映射中，每个键都是 lambda 表达式的结果，对应的值是返回此结果的元素 `List`。

让我们根据匹配的特定单词（例如 "hello" 和 "bye"）对消息进行分组。
如果消息文本不包含任何提供的单词，则将其添加到名为 "other" 的单独组中：

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

集合的一个常见任务是将集合元素从一种类型转换为另一种类型。
当然，Kotlin 标准库为此类任务提供了许多[转换函数](collection-transformations.md)。

例如，让我们将 `Message` 对象列表转换为 String 对象列表，其中每个 String 对象由消息的 `id` 和 `text` 正文连接组成。
为此，我们可以使用 `map()` 函数，它将给定的 lambda 函数应用于每个后续元素，并返回 lambda 结果的列表：

```kotlin
@GetMapping("/transformMessagesToListOfStrings")
fun transformMessagesToListOfStrings(): List<String> {
    val messages = service.findMessages()
    return messages.map { "${it.id} ${it.text}" }
}
```

## 聚合操作

聚合操作从值集合中计算单个值。
聚合操作的一个示例是计算所有消息长度的平均值：

```kotlin
@GetMapping("/averageMessageLength")
fun averageMessageLength(): Double {
    val messages = service.findMessages()
    return messages.map { it.text.length }.average()
}
```

首先，使用 `map()` 函数将消息列表转换为表示每条消息长度的值列表。
然后可以使用 `average()` 函数计算最终结果。

聚合函数的其他示例包括 `min()`、`max()`、`sum()` 和 `count()`。

对于更具体的用例，还有 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 函数，它们按顺序将提供的操作应用于集合元素并返回累积结果。

例如，让我们找到其中文本最长的消息：

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

转到[下一节](jvm-spring-boot-using-crudrepository.md)。