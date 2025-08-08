[//]: # (title: 可讀性)

創建一個可讀的 API 不僅僅是撰寫清晰的程式碼。它需要周到的設計，以簡化整合與使用。本節探討如何透過考慮組合性來建構函式庫、利用領域特定語言 (DSLs) 進行簡潔而富有表達力的設定，以及使用擴充函式和屬性來實現清晰且易於維護的程式碼，從而提升 API 的可讀性。

## 偏好明確的組合性

函式庫通常提供進階的運算子，允許自訂。例如，一個操作可能允許使用者提供自己的資料結構、網路通道、計時器或生命週期觀察器。然而，透過額外的函式參數引入這些自訂選項會顯著增加 API 的複雜性。

與其為自訂添加更多參數，不如設計一個能夠將不同行為組合在一起的 API 更為有效。例如，在協程 Flows API 中，[緩衝 (buffering)](flow.md#buffering) 和 [合併 (conflation)](flow.md#conflation) 都實作為單獨的函式。這些可以與更基本的操作（如 [`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) 和 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html)）鏈接在一起，而不是讓每個基本操作都接受參數來控制緩衝和合併。

另一個範例是 [Jetpack Compose 中的 Modifiers API](https://developer.android.com/develop/ui/compose/modifiers)。這允許 Composable 元件接受單一的 `Modifier` 參數，該參數處理常見的自訂選項，例如內邊距 (padding)、尺寸設定 (sizing) 和背景顏色 (background color)。這種方法避免了每個 Composable 都需要接受單獨的參數來進行這些自訂，從而簡化了 API 並降低了複雜性。

```kotlin
Box(
    modifier = Modifier
        .padding(10.dp)
        .onClick { println("Box clicked!") }
        .fillMaxWidth()
        .fillMaxHeight()
        .verticalScroll(rememberScrollState())
        .horizontalScroll(rememberScrollState())
) {
    // Box 內容放置於此
}
```

## 使用 DSLs

Kotlin 函式庫可以透過提供建構器 DSL (builder DSL) 顯著提高可讀性。使用 DSL 可以讓你簡潔地重複宣告特定領域的資料。例如，考慮以下來自基於 Ktor 的伺服器應用程式範例：

```kotlin
fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
    routing {
        post("/article") {
            call.respond<String>(HttpStatusCode.Created, ...)
        }
        get("/article/list") {
            call.respond<List<CreateArticle>>(...)
        }
        get("/article/{id}") {
            call.respond<Article>(...)
        }
    }
}
```

這會設定一個應用程式，安裝配置為使用 Json 序列化的 `ContentNegotiation` 外掛程式，並設定路由，使應用程式能夠回應對各種 `/article` 端點的請求。

有關建立 DSL 的詳細說明，請參閱 [型別安全建構器 (Type-safe builders)](type-safe-builders.md)。在建立函式庫的背景下，以下幾點值得注意：

*   DSL 中使用的函式是建構器函式，它們將帶接收者的 lambda 作為最後一個參數。這種設計允許這些函式在呼叫時不帶圓括號，使語法更清晰。傳入的 lambda 可用於配置正在創建的實體。在上述範例中，傳遞給 `routing` 函式的 lambda 用於配置路由的詳細資訊。
*   建立類別實例的工廠函式 (Factory functions) 應與回傳型別同名，並以大寫字母開頭。你可以在上述範例中看到這一點，即 `Json` 實例的建立。這些函式仍可能接受 lambda 參數進行配置。更多資訊，請參閱 [編碼規範 (Coding conventions)](coding-conventions.md#function-names)。
*   由於無法在編譯時確保已在提供給建構器函式的 lambda 內設定所需屬性，我們建議將所需值作為函式參數傳遞。

使用 DSLs 建立物件不僅提高了可讀性，還改善了向後相容性，並簡化了文件編寫流程。例如，考慮以下函式：

```kotlin
fun Json(prettyPrint: Boolean, isLenient: Boolean): Json
```

此函式可以取代 `Json{}` DSL 建構器。然而，DSL 方法具有顯著優勢：

*   使用 DSL 建構器比使用此函式更容易維護向後相容性，因為新增配置選項只需新增屬性（或在其他範例中，新增函式），這是一種向後相容的變更，不像變更現有函式的參數列表那樣。
*   它還使建立和維護文件變得更容易。你可以在每個屬性的宣告點單獨記錄它們，而不是必須在一個地方記錄函式的所有許多參數。

## 使用擴充函式和屬性

我們建議使用 [擴充函式和屬性 (extension functions and properties)](extensions.md) 來提高可讀性。

類別和介面應定義型別的核心概念。額外的功能和資訊應撰寫為擴充函式和屬性。這讓讀者清楚，額外的功能可以在核心概念之上實現，而額外資訊可以從型別中的資料計算出來。

例如，[`CharSequence`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-sequence/) 型別（`String` 也實作它）僅包含存取其內容的最基本資訊和運算子：

```kotlin
interface CharSequence {
    val length: Int
    operator fun get(index: Int): Char
    fun subSequence(startIndex: Int, endIndex: Int): CharSequence
}
```

通常與字串相關的功能大多定義為擴充函式，這些函式都可以在型別的核心概念和基本 API 之上實現：

```kotlin
inline fun CharSequence.isEmpty(): Boolean = length == 0
inline fun CharSequence.isNotEmpty(): Boolean = length > 0

inline fun CharSequence.trimStart(predicate: (Char) -> Boolean): CharSequence {
    for (index in this.indices)
        if (!predicate(this[index]))
           return subSequence(index, length)
    return ""
}
```

考慮將計算屬性 (computed properties) 和普通方法宣告為擴充。預設情況下，只有常規屬性 (regular properties)、覆寫 (overrides) 和重載運算子 (overloaded operators) 應宣告為成員。

## 避免使用布林型別作為引數

考慮以下函式：

```kotlin
fun doWork(optimizeForSpeed: Boolean) { ... }
```

如果您在 API 中提供此函式，它可能會被呼叫為：

```kotlin
doWork(true)
doWork(optimizeForSpeed=true)
```

在第一次呼叫中，除非您在啟用參數名稱提示 (Parameter Name Hints) 的 IDE 中閱讀程式碼，否則無法推斷布林引數的用途。使用具名引數確實能闡明意圖，但無法強制使用者採用這種風格。因此，為了提高可讀性，您的程式碼不應使用布林型別作為引數。

或者，API 可以專門為由布林引數控制的任務建立一個單獨的函式。此函式應有一個描述性名稱，表明其作用。

例如，[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/) 介面上提供以下擴充：

```kotlin
fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R>
fun <T, R : Any> Iterable<T>.mapNotNull(
    transform: (T) -> R?
): List<R>
```

而不是單一方法：

```kotlin
fun <T, R> Iterable<T>.map(
    includeNullResults: Boolean = true, 
    transform: (T) -> R
): List<R>
```

另一種好方法是使用 `enum` 類別來定義不同的操作模式。如果存在多種操作模式，或者您預期這些模式會隨時間改變，則這種方法非常有用。

## 適當使用數值型別

Kotlin 定義了一組數值型別，您可以在 API 中使用它們。以下是適當使用它們的方法：

*   將 `Int`、`Long` 和 `Double` 型別用作算術型別。它們代表用於執行計算的值。
*   避免將算術型別用於非算術實體。例如，如果您將 ID 表示為 `Long`，您的使用者可能會傾向於比較 ID，假設它們是依序分配的。這可能導致不可靠或無意義的結果，或產生對可能無預警變更的實作的依賴。一個更好的策略是為 ID 抽象定義一個專門的類別。您可以使用 [內聯數值類別 (Inline value classes)](inline-classes.md) 來建立此類抽象，而不會影響效能。請參閱 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 類別以了解範例。
*   `Byte`、`Float` 和 `Short` 型別是記憶體佈局型別。它們用於限制儲存值的記憶體量，例如在快取中或透過網路傳輸資料時。只有當底層資料可靠地符合該型別，且不需要進行計算時，才應使用這些型別。
*   無符號整數型別 `UByte`、`UShort`、`UInt` 和 `ULong` 應用於利用特定格式中所有可用的正值範圍。它們適用於需要超出有符號型別範圍的值的場景，或與原生函式庫進行互操作性。然而，在領域僅需要 [非負整數 (non-negative integers)](unsigned-integer-types.md#non-goals) 的情況下，應避免使用它們。

## 下一步

在本指南的下一部分，您將學習一致性。

[前往下一部分](api-guidelines-consistency.md)