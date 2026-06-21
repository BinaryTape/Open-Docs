[//]: # (title: 簡潔性)

使用者需要理解的概念越少，且這些概念傳達得越明確，他們的心理模型就可能越簡單。這可以透過限制 API 中的操作與抽象數量來達成。

確保程式庫中宣告的 [可見性](visibility-modifiers.md) 設定妥當，以避免將內部實作細節暴露在公開 API 之外。使用者應該只能存取那些專門為公開使用而設計並記錄在文件中的 API。

在指南的下一部分中，我們將討論一些提升簡潔性的準則。

## 使用明確 API 模式

我們建議使用 Kotlin 編譯器的 [明確 API 模式](whatsnew14.md#explicit-api-mode-for-library-authors) 功能，這會強制你在設計程式庫 API 時明確說明你的意圖。

在明確 API 模式下，你必須：

* 為宣告加上可見性修飾詞使其成為公開（public），而不是依賴預設的公開可見性。這能確保你已經考慮過哪些內容是作為公開 API 暴露出來的。
* 為所有公開函式與屬性定義型別，以防止推論型別造成 API 發生非預期的變更。

## 複用現有概念

限制 API 規模的一種方法是複用現有的型別。例如，與其為持續時間建立新型別，你可以使用 [`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)。
這種方法不僅能精簡開發流程，還能提高與其他程式庫的互通性。

在依賴第三方程式庫的型別或平台特定型別時要小心，因為這可能會將你的程式庫與這些元素綁定。在這種情況下，成本可能會超過收益。

複用常見型別（如 `String`、`Long`、`Pair` 和 `Triple`）可能很有效，但如果抽象資料型別能更好地封裝領域特定邏輯，這不應阻止你開發它們。

## 定義核心 API 並以此為基礎進行建置

另一條實現簡潔性的路徑是定義一個基於有限核心操作的小型概念模型。
一旦這些操作的行為被清楚地記錄在文件中，你就可以透過開發直接基於或組合這些核心函式的新操作來擴充 API。

例如：

* 在 [Kotlin Flows API](coroutines-flow.md) 中，像 [`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) 與 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html) 這樣的常見操作是建置在 [`transform`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html) 操作之上的。
* 在 [Kotlin Time API](time-measurement.md) 中，[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 函式利用了 [`TimeSource.Monotonic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/-monotonic/)。

雖然將額外操作建立在這些核心組件上通常是有益的，但這並非總是必要。你可能會發現引入經過優化或平台特定變體的機會，以擴充功能或更廣泛地適應不同的輸入。

只要使用者能夠利用核心操作解決非顯而易見的問題，並且可以在不改變任何行為的情況下利用額外操作重構其解決方案，概念模型的簡潔性就能得以保持。

## 下一步

在指南的下一部分，你將學習可讀性。

[前進至下一部分](api-guidelines-readability.md)