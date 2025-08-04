[//]: # (title: 簡潔)

使用者需要理解的概念越少，這些概念被傳達得越明確，他們的心智模型就越可能簡潔。這可以透過限制 API 中的操作和抽象數量來實現。

請確保程式庫中宣告的[可見性](visibility-modifiers.md)設定適當，以將內部實作細節排除在公開 API 之外。只有明確設計並文件化為公開使用的 API，才應供使用者存取。

在本指南的下一部分中，我們將討論一些提升簡潔性的指導方針。

## 使用明確 API 模式

我們建議使用 Kotlin 編譯器的[明確 API 模式](whatsnew14.md#explicit-api-mode-for-library-authors)功能，這會強制您在設計程式庫的 API 時明確表明您的意圖。

在明確 API 模式下，您必須：

*   為您的宣告新增可見性修飾符以將其公開，而非依賴預設的公開可見性。這可確保您已考慮要公開作為公開 API 一部分的內容。
*   為所有公開函數和屬性定義類型，以防止從推斷類型導致 API 發生非預期的變更。

## 重複使用現有概念

限制 API 大小的一種方法是重複使用現有類型。例如，與其為持續時間建立新類型，您可以使用 [`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)。這種方法不僅能簡化開發，還能提高與其他程式庫的互通性。

當依賴來自第三方程式庫或平台特定類型時，務必小心，因為它們可能會將您的程式庫與這些元素綁定。在這種情況下，成本可能超過收益。

重複使用 `String`、`Long`、`Pair` 和 `Triple` 等常見類型可能很有效，但這不應阻止您開發抽象資料類型，如果它們能更好地封裝領域特定邏輯。

## 定義並建基於核心 API

達到簡潔的另一條途徑是定義一個小型概念模型，該模型基於有限的核心操作集合。一旦這些操作的行為被明確文件化，您就可以透過開發直接建基於這些核心函數或將其組合的新操作來擴展 API。

舉例來說：

*   在 [Kotlin Flows API](flow.md) 中，[`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) 和 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html) 等常見操作是建基於 [`transform`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html) 操作之上。
*   在 [Kotlin Time API](time-measurement.md) 中，[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 函數利用 [`TimeSource.Monotonic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/-monotonic/)。

儘管將額外操作建基於這些核心元件通常有益，但這並非總是必要。您可能會找到機會引入最佳化或平台特定變體，以擴展功能或更廣泛地適應不同輸入。

只要使用者能夠利用核心操作解決非平凡的問題，並且能夠在不改變任何行為的情況下，利用額外操作重構他們的解決方案，概念模型的簡潔性就能得到維護。

## 下一步

在本指南的下一部分中，您將學習可讀性。

[繼續前往下一部分](api-guidelines-readability.md)