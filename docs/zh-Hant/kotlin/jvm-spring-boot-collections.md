[//]: # (title: 在 Spring Boot 專案中使用集合)

<tldr>
    <p>這是「**Spring Boot 和 Kotlin 入門**」教學的一部分。在繼續之前，請確保您已完成先前的步驟：</p><br/>
    <p><a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 建立 Spring Boot 專案</a><br/><a href="jvm-spring-boot-add-data-class.md">為 Spring Boot 專案加入資料類別</a><br/><strong>為 Spring Boot 專案加入資料庫支援</strong><br/></p>
</tldr>

在這部分中，您將學習如何在 Kotlin 中對集合執行各種操作。雖然在許多情況下，SQL 可以協助執行資料操作，例如篩選和排序，但在實際應用中，我們經常需要使用集合來處理資料。

在下方，您將找到一些基於我們示範應用程式中已有的資料物件來使用集合的實用訣竅。在所有範例中，我們都假設從呼叫 `service.findMessages()` 函式來擷取資料庫中儲存的所有訊息開始，然後執行各種操作來篩選、排序、分組或轉換訊息清單。

## 擷取元素

Kotlin 集合提供了一組函式，用於從集合中擷取單一元素。可以透過位置或符合條件來從集合中擷取單一元素。

例如，使用對應的函式 `first()` 和 `last()` 可以擷取集合的第一個和最後一個元素：

```kotlin
@GetMapping("/firstAndLast")
fun firstAndLast(): List<Message> {
    val messages = service.findMessages()
    return listOf(messages.first(), messages.last())
}
```

在上面的範例中，擷取集合的第一個和最後一個元素，並建立一個包含兩個元素的新清單，該清單將被序列化為 JSON 文件。

若要擷取特定位置的元素，您可以使用 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 函式。

`first()` 和 `last()` 函式也都允許您在集合中搜尋符合給定謂詞 (predicate) 的元素。例如，以下是如何在清單中找到第一個訊息長度超過十個字元的 `Message` 實例：

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

當然，可能沒有訊息長度超過給定的字元限制。在這種情況下，上面的程式碼將產生 `NoSuchElementException`。或者，您可以使用 `firstOrNull()` 函式，在集合中沒有符合的元素時傳回 `null`。然後，程式設計師有責任檢查結果是否為 `null`：

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

「篩選 (Filtering)」是集合處理中最常見的任務之一。標準函式庫包含一組擴充函式，讓您只需一次呼叫即可篩選集合。這些函式會保持原始集合不變，並產生一個包含已篩選元素的新集合：

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

這段程式碼看起來與您使用 `first()` 函式來尋找文字長度大於 10 的單一元素的範例非常相似。不同之處在於 `filter()` 傳回的是符合條件的元素清單。

## 排序元素

元素的順序是某些集合類型的一個重要面向。Kotlin 的標準函式庫提供了多種排序函式：自然排序、自訂排序、反向排序和隨機排序。

例如，讓我們根據最後一個字母對清單中的訊息進行排序。這可以透過使用 `sortedBy()` 函式來實現，該函式使用一個選擇器 (selector) 從集合物件中提取所需的值。清單中元素的比較將根據提取的值進行：

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## 分組元素

分組可能需要實作一些相當複雜的邏輯，來決定元素應如何組合在一起。[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 函式接受一個 lambda 並傳回一個 `Map`。在這個 Map 中，每個鍵 (key) 都是 lambda 的結果，而對應的值 (value) 則是傳回此結果的元素 `List`。

讓我們透過比對特定詞彙（例如「hello」和「bye」）來對訊息進行分組。如果訊息的文字不包含任何提供的詞彙，則將其新增到一個名為「other」的單獨組中：

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

對於集合來說，一個常見的任務是將集合元素從一種類型轉換為另一種類型。當然，Kotlin 標準函式庫為此類任務提供了許多[轉換函式](collection-transformations.md)。

例如，讓我們將 `Message` 物件的清單轉換為字串物件的清單，這些字串透過連接訊息的 `id` 和 `text` 內容組成。為此，我們可以使用 `map()` 函式，它將給定的 lambda 函式應用於每個後續元素，並傳回 lambda 結果的清單：

```kotlin
@GetMapping("/transformMessagesToListOfStrings")
fun transformMessagesToListOfStrings(): List<String> {
    val messages = service.findMessages()
    return messages.map { "${it.id} ${it.text}" }
}
```

## 聚合操作

聚合操作 (Aggregation operation) 是從一組值中計算出單一值的操作。一個聚合操作的範例是計算所有訊息長度的平均值：

```kotlin
@GetMapping("/averageMessageLength")
fun averageMessageLength(): Double {
    val messages = service.findMessages()
    return messages.map { it.text.length }.average()
}
```

首先，使用 `map()` 函式將訊息清單轉換為代表每個訊息長度的值清單。然後您可以使用 `average` 函式來計算最終結果。

其他聚合函式的範例包括 `mix()`、`max()`、`sum()` 和 `count()`。

對於更特定的情況，還有 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 函式，它們將提供的操作依序應用於集合元素並傳回累積結果。

例如，讓我們找到其中文字最長的訊息：

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