---
title: "在 Spring Boot 项目中使用集合"
---
:::info
<p>
   这是 <strong>Spring Boot 和 Kotlin 入门</strong>教程的一部分。在继续之前，请确保您已完成之前的步骤：
</p><br/>
<p>
   <a href="jvm-create-project-with-spring-boot">使用 Kotlin 创建 Spring Boot 项目</a><br/><a href="jvm-spring-boot-add-data-class">向 Spring Boot 项目添加数据类</a><br/><strong>为 Spring Boot 项目添加数据库支持</strong><br/>
</p>

:::

在本部分中，您将学习如何在 Kotlin 中对集合执行各种操作。
虽然在许多情况下，SQL 可以帮助进行数据操作，例如过滤和排序，但在实际应用程序中，我们经常需要使用集合来操作数据。

下面您将找到一些有用的技巧，用于基于演示应用程序中已有的数据对象来处理集合。
在所有示例中，我们都假设首先调用 `service.findMessages()` 函数来检索存储在数据库中的所有消息，然后执行各种操作来过滤、排序、分组或转换消息列表。

## 检索元素

Kotlin 集合提供了一组函数，用于从集合中检索单个元素。
可以按位置或按匹配条件从集合中检索单个元素。

例如，可以使用相应的函数 `first()` 和 `last()` 检索集合的第一个和最后一个元素：

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
例如，以下是如何在列表中查找消息长度超过十个字符的第一个 `Message` 实例：

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

当然，可能没有超过给定字符限制的消息。
在这种情况下，上面的代码将产生 NoSuchElementException。
或者，您可以使用 `firstOrNull()` 函数，如果在集合中没有匹配的元素，则返回 null。
然后，程序员有责任检查结果是否为 null：

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

_过滤（Filtering）_ 是集合处理中最常见的任务之一。
标准库包含一组扩展函数，可让您通过一次调用来过滤集合。
这些函数保持原始集合不变，并生成一个包含已过滤元素的新集合：

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

此代码看起来与您使用 `first()` 函数查找文本长度大于 10 的单个元素的示例非常相似。
区别在于 `filter()` 返回与条件匹配的元素列表。

## 排序元素

元素的顺序是某些集合类型的重要方面。
Kotlin 的标准库提供了许多以各种方式排序的函数：自然顺序、自定义顺序、反向顺序和随机顺序。

例如，让我们按最后一个字母对列表中的消息进行排序。
这可以通过使用 `sortedBy()` 函数来实现，该函数使用选择器从集合对象中提取所需的值。
然后，将基于提取的值对列表中的元素进行比较：

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## 分组元素

分组可能需要实现一些非常复杂的逻辑，以确定如何将元素组合在一起。
[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 函数接受一个 lambda 表达式并返回一个 `Map`（映射）。
在此映射中，每个键都是 lambda 表达式的结果，相应的值是返回此结果的元素的 `List`（列表）。

让我们通过匹配特定单词（例如，“hello”和“bye”）对消息进行分组。
如果消息的文本不包含任何提供的单词，那么您将把它添加到名为“other”的单独组中：

```kotlin
@GetMapping("/groups")
fun groups(): Map<String, List<Message>> {
    val messages = service.findMessages()
    val groups = listOf("hello", "bye")

    val map = messages.groupBy { message `->`
        groups.firstOrNull {
            message.text.contains(it, ignoreCase = true)
        } ?: "other"
    }

    return map
}
```

## 转换操作

集合的一个常见任务是将集合元素从一种类型转换为另一种类型。
当然，Kotlin 标准库为此类任务提供了许多[转换函数](https://kotlinlang.org/docs/collection-transformations.html)。

例如，让我们将 `Message`（消息）对象列表转换为 String（字符串）对象列表，这些字符串对象通过连接消息的 `id`（ID）和 `text`（文本）正文组成。
为此，我们可以使用 `map()` 函数，该函数将给定的 lambda 表达式应用于每个后续元素，并返回 lambda 表达式结果的列表：

```kotlin
@GetMapping("/transformMessagesToListOfStrings")
fun transformMessagesToListOfStrings(): List<String> {
    val messages = service.findMessages()
    return messages.map { "${it.id} ${it.text}" }
}
```

## 聚合操作

聚合操作从值的集合中计算单个值。
聚合操作的一个示例是计算所有消息的长度的平均值：

```kotlin
@GetMapping("/averageMessageLength")
fun averageMessageLength(): Double {
    val messages = service.findMessages()
    return messages.map { it.text.length }.average()
}
```

首先，使用 `map()` 函数将消息列表转换为表示每条消息长度的值的列表。
然后，您可以使用 average 函数来计算最终结果。

聚合函数的其他示例包括 `mix()`、`max()`、`sum()` 和 `count()`。

对于更具体的情况，有函数 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)，它们将提供的操作顺序应用于集合元素并返回累积的结果。

例如，让我们找到其中文本最长的消息：

```kotlin
@GetMapping("findTheLongestMessage")
fun reduce(): Message {
    val messages = service.findMessages()
    return messages.reduce { first, second `->`
        if (first.text.length > second.text.length) first else second
    }
}
```

## 下一步

转到[下一节](jvm-spring-boot-using-crudrepository)。