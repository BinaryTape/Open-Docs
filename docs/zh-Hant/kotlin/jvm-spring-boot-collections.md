[//]: # (title: 在 Spring Boot 專案中處理集合)

<tldr>
    <p>這是 **Spring Boot 與 Kotlin 入門** 教學的一部分。在繼續之前，請確保您已完成以下步驟：</p><br/>
    <p><a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 建立 Spring Boot 專案</a><br/><a href="jvm-spring-boot-add-data-class.md">將資料類別新增至 Spring Boot 專案</a><br/>**為 Spring Boot 專案新增資料庫支援**<br/></p>
</tldr>

在本部分中，您將學習如何在 Kotlin 中對集合執行各種操作。
儘管在許多情況下 SQL 可以幫助進行資料操作，例如篩選和排序，但在實際應用中，我們經常需要使用集合來處理資料。

以下您將找到一些基於我們示範應用程式中已有的資料物件，用於處理集合的實用範例。
在所有範例中，我們假設首先透過呼叫 `service.findMessages()` 函式從資料庫中擷取所有儲存的訊息，然後執行各種操作來篩選、排序、分組或轉換訊息列表。

## 擷取元素

Kotlin 集合提供了一組函式，用於從集合中擷取單一元素。
可以透過位置或符合條件來從集合中擷取單一元素。

例如，可以使用相應的函式 `first()` 和 `last()` 擷取集合的第一個和最後一個元素：

```kotlin
@GetMapping("/firstAndLast")
fun firstAndLast(): List<Message> {
    val messages = service.findMessages()
    return listOf(messages.first(), messages.last())
}
```

在上面的範例中，擷取集合的第一個和最後一個元素，並建立一個包含兩個元素的新列表，該列表將被序列化為 JSON 文件。

要擷取特定位置的元素，可以使用 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 函式。

`first()` 和 `last()` 函式也都允許您在集合中搜尋符合給定述詞的元素。
例如，以下是如何在列表中找到第一個訊息長度大於十個字元的 `Message` 實例：

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

當然，也可能沒有任何訊息長度超過給定的字元限制。
在這種情況下，上面的程式碼會產生 `NoSuchElementException`。
或者，您可以使用 `firstOrNull()` 函式，在集合中沒有匹配元素的情況下返回 `null`。
然後，檢查結果是否為 `null` 是程式設計師的責任：

```kotlin
@GetMapping("/retrieveFirstMessageLongerThan10")
fun firstMessageOrNull(): Message {
    val messages = service.findMessages()
    return messages.firstOrNull { 
        it.text.length > 10 
    } ?: Message(null, "Default message")
}

```

## 篩選元素

_篩選_是集合處理中最受歡迎的任務之一。
標準函式庫包含一組擴展函式，可讓您在單一呼叫中篩選集合。
這些函式會保留原始集合不變，並產生一個包含篩選元素的全新集合：

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

這段程式碼看起來與您使用 `first()` 函式查找訊息長度大於 10 的單一元素的範例非常相似。
不同之處在於 `filter()` 返回的是符合條件的元素列表。

## 排序元素

元素的順序是某些集合類型的重要方面。
Kotlin 的標準函式庫提供了許多函式，可以透過各種方式進行排序：自然順序、自訂順序、反向順序和隨機順序。

例如，讓我們按訊息的最後一個字母對列表中的訊息進行排序。
這可以透過使用 `sortedBy()` 函式來實現，該函式使用選擇器從集合物件中提取所需值。
然後，列表中元素的比較將基於提取的值進行：

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## 分組元素

分組可能需要實現一些相當複雜的邏輯，以決定元素應如何分組。
[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 函式接受一個 Lambda 表達式並返回一個 `Map`。
在這個 Map 中，每個鍵都是 Lambda 表達式的結果，相應的值是返回此結果的元素 `List`。

讓我們透過匹配特定單字（例如 "hello" 和 "bye"）來對訊息進行分組。
如果訊息文本不包含任何提供的單字，那麼您將它添加到一個名為 "other" 的獨立組中：

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

## 轉換操作

集合的一個常見任務是將集合元素從一種類型轉換為另一種類型。
當然，Kotlin 標準函式庫為此類任務提供了許多[轉換函式](collection-transformations.md)。

例如，讓我們將 `Message` 物件列表轉換為由訊息的 `id` 和 `text` 主體串聯組成的 `String` 物件列表。
為此，我們可以使用 `map()` 函式，該函式將給定的 Lambda 函式應用於每個後續元素，並返回 Lambda 結果的列表：

```kotlin
@GetMapping("/transformMessagesToListOfStrings")
fun transformMessagesToListOfStrings(): List<String> {
    val messages = service.findMessages()
    return messages.map { "${it.id} ${it.text}" }
}
```

## 聚合操作

聚合操作從一組值中計算出單一值。
聚合操作的一個範例是計算所有訊息長度的平均值：

```kotlin
@GetMapping("/averageMessageLength")
fun averageMessageLength(): Double {
    val messages = service.findMessages()
    return messages.map { it.text.length }.average()
}
```

首先，使用 `map()` 函式將訊息列表轉換為表示每個訊息長度的值列表。
然後您可以使用 `average` 函式計算最終結果。

聚合函式的其他範例包括 `mix()`、`max()`、`sum()` 和 `count()`。

對於更具體的情況，還有 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 函式，它們將提供的操作依序應用於集合元素並返回累計結果。

例如，讓我們找出其中文本最長的訊息：

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

前往[下一節](jvm-spring-boot-using-crudrepository.md)。