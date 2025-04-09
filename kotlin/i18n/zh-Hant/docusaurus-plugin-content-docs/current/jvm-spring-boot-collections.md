---
title: "在 Spring Boot 專案中使用集合 (Collections)"
---
:::info
<p>
   這是<strong>Spring Boot 與 Kotlin 入門</strong>教學的一部分。在繼續之前，請確保您已完成先前的步驟：
</p><br/>
<p>
   <a href="jvm-create-project-with-spring-boot">使用 Kotlin 建立 Spring Boot 專案</a><br/><a href="jvm-spring-boot-add-data-class">將資料類別新增到 Spring Boot 專案</a><br/><strong>為 Spring Boot 專案新增資料庫支援</strong><br/>
</p>

:::

在本節中，您將學習如何在 Kotlin 中對集合執行各種操作。
雖然在許多情況下，SQL 可以協助進行資料操作，例如篩選和排序，但在實際應用中，我們經常需要使用集合來操作資料。

您將在下面找到一些有用的方法，用於基於已存在於我們的範例應用程式中的資料物件來處理集合。
在所有範例中，我們都假設從呼叫 `service.findMessages()` 函式來檢索儲存在資料庫中的所有訊息開始，然後執行各種操作來篩選、排序、分組或轉換訊息清單。

## 檢索元素 (Retrieving elements)

Kotlin 集合提供了一組函式，用於從集合中檢索單個元素。
可以通過位置或通過匹配條件從集合中檢索單個元素。

例如，可以使用相應的函式 `first()` 和 `last()` 檢索集合的第一個和最後一個元素：

```kotlin
@GetMapping("/firstAndLast")
fun firstAndLast(): List<Message> {
    val messages = service.findMessages()
    return listOf(messages.first(), messages.last())
}
```

在上面的範例中，檢索集合的第一個和最後一個元素，並建立一個包含兩個元素的新列表，該列表將被序列化為 JSON 文件。

若要檢索特定位置的元素，可以使用 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 函式。

`first()` 和 `last()` 函式也允許您在集合中搜尋符合給定述詞的元素。
例如，以下是如何在列表中找到第一個 `Message` 實例，其中訊息的長度大於十個字元：

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

當然，可能沒有任何訊息長於給定的字元限制。
在這種情況下，上面的程式碼將產生 NoSuchElementException。
或者，您可以使用 `firstOrNull()` 函式，如果在集合中沒有匹配的元素，則傳回 null。
然後，程式設計人員有責任檢查結果是否為 null：

```kotlin
@GetMapping("/retrieveFirstMessageLongerThan10")
fun firstMessageOrNull(): Message {
    val messages = service.findMessages()
    return messages.firstOrNull { 
        it.text.length > 10 
    } ?: Message(null, "Default message")
}

```

## 篩選元素 (Filtering elements)

_篩選 (Filtering)_ 是集合處理中最常見的任務之一。
標準庫包含一組擴充函式，可讓您在單個呼叫中篩選集合。
這些函式使原始集合保持不變，並產生一個包含已篩選元素的新集合：

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

此程式碼看起來與您使用 `first()` 函式來尋找文字長度大於 10 的單個元素的範例非常相似。
不同之處在於 `filter()` 傳回符合條件的元素列表。

## 排序元素 (Sorting elements)

元素的順序是某些集合類型的重要方面。
Kotlin 的標準庫提供了許多以各種方式進行排序的函式：自然順序、自定義順序、反向順序和隨機順序。

例如，讓我們按最後一個字母對列表中的訊息進行排序。
這可以通過使用 `sortedBy()` 函式來實現，該函式使用選擇器從集合物件中提取所需的值。
然後，將根據提取的值對列表中的元素進行比較：

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## 分組元素 (Grouping elements)

分組可能需要實現一些非常複雜的邏輯，關於元素應如何分組在一起。
[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 函式採用 lambda 並傳回 `Map`。
在此映射中，每個鍵都是 lambda 結果，對應的值是傳回此結果的元素的 `List`。

讓我們通過匹配特定單字（例如，“hello” 和 “bye”）對訊息進行分組。
如果訊息的文字不包含任何提供的單字，則您將其新增到名為 “other” 的單獨群組：

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

## 轉換操作 (Transformation operations)

集合的一個常見任務是將集合元素從一種型別轉換為另一種型別。
當然，Kotlin 標準庫為此類任務提供了許多[轉換函式](https://kotlinlang.org/docs/collection-transformations.html)。

例如，讓我們將 `Message` 物件列表轉換為字串物件列表，這些字串物件由串連訊息的 `id` 和 `text` 主體組成。
為此，我們可以使用 `map()` 函式，該函式將給定的 lambda 函式應用於每個後續元素，並傳回 lambda 結果的列表：

```kotlin
@GetMapping("/transformMessagesToListOfStrings")
fun transformMessagesToListOfStrings(): List<String> {
    val messages = service.findMessages()
    return messages.map { "${it.id} ${it.text}" }
}
```

## 聚合操作 (Aggregate operations)

聚合操作從值的集合計算單個值。
聚合操作的一個範例是計算所有訊息長度的平均值：

```kotlin
@GetMapping("/averageMessageLength")
fun averageMessageLength(): Double {
    val messages = service.findMessages()
    return messages.map { it.text.length }.average()
}
```

首先，使用 `map()` 函式將訊息列表轉換為表示每個訊息長度的值列表。
然後，您可以使用 average 函式計算最終結果。

聚合函式的其他範例包括 `mix()`、`max()`、`sum()` 和 `count()`。

對於更具體的情況，還有函式 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)，它們將提供的操作依次應用於集合元素，並傳回累積的結果。

例如，讓我們找到其中文字最長的訊息：

```kotlin
@GetMapping("findTheLongestMessage")
fun reduce(): Message {
    val messages = service.findMessages()
    return messages.reduce { first, second `->`
        if (first.text.length > second.text.length) first else second
    }
}
```

## 下一步 (Next step)

前往[下一節](jvm-spring-boot-using-crudrepository)。