[//]: # (title: 可預測性)

為設計一個強固且使用者友善的 Kotlin 程式庫，預期常見的使用情境、允許擴展性並強制正確使用是至關重要的。
遵循預設設定、錯誤處理和狀態管理的最佳實踐，可確保使用者獲得流暢的體驗，同時維護程式庫的完整性與品質。

## 預設即做正確的事

您的程式庫應為每個使用情境預期「快樂路徑」(happy path)，並據此提供預設設定。
使用者不應需要提供預設值，程式庫才能正常運作。

例如，當使用 [Ktor `HttpClient`](https://ktor.io/docs/client-create-new-application.html) 時，最常見的使用情境是向伺服器傳送 GET 請求。
這可以透過以下程式碼實現，其中只需指定必要的資訊：

```kotlin
val client = HttpClient(CIO)
val response: HttpResponse = client.get("https://ktor.io/")
```

無需為強制性 HTTP 標頭或回應中可能的狀態碼提供自訂事件處理器的值。

如果某個使用情境沒有明顯的「快樂路徑」，或者某個參數應有預設值但沒有無爭議的選項，
這很可能表示需求分析存在缺陷。

## 允許擴展的機會

當無法預期正確的選擇時，應允許使用者指定他們偏好的方法。
您的程式庫也應允許使用者提供自己的方法或使用第三方擴充功能。

例如，透過 [Ktor `HttpClient`](https://ktor.io/docs/client-serialization.html)，鼓勵使用者在設定用戶端時安裝對內容協商 (content negotiation) 的支援，並指定他們偏好的序列化格式：

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

使用者可以選擇要安裝哪些外掛程式 (plugins)，或者使用[定義用戶端外掛程式的獨立 API](https://ktor.io/docs/client-custom-plugins.html) 來建立自己的外掛程式。

此外，使用者可以為程式庫中的型別定義擴展函數 (extension functions) 和屬性 (properties)。
作為程式庫作者，您可以透過[考量擴展性 (extensions) 進行設計](api-guidelines-readability.md#use-extension-functions-and-properties)，
並確保程式庫的型別具有清晰的核心概念，從而使這項工作更容易。

## 防止不必要和無效的擴展

使用者不應以違反程式庫原始設計或在問題領域規則下不可能的方式擴展您的程式庫。

例如，當將資料封送 (marshaling) 至 JSON 及從 JSON 封送時，輸出格式僅支援六種類型：
`object`、`array`、`number`、`string`、`boolean` 和 `null`。

如果您建立一個名為 `JsonElement` 的 `open class` 或 `interface`，使用者可能會建立無效的衍生型別，例如 `JsonDate`。
相反地，您可以將 `JsonElement` 介面設為 `sealed` (密封的)，並為每種類型提供實作：

```kotlin
sealed interface JsonElement

class JsonNumber(val value: Number) : JsonElement
class JsonObject(val values: Map<String, JsonElement>) : JsonElement
class JsonArray(val values: List<JsonElement>) : JsonElement
class JsonBoolean(val value: Boolean) : JsonElement
class JsonString(val value: String) : JsonElement
object JsonNull : JsonElement
```

密封型別 (Sealed types) 也讓編譯器能夠確保您的 `when` 表達式是詳盡無遺的 (exhaustive)，而無需 `else` 陳述式，
從而提高了可讀性 (readability) 和一致性 (consistency)。

## 避免暴露可變狀態

當管理多個值時，您的 API 應盡可能接受並/或回傳唯讀集合 (read-only collections)。
可變集合 (mutable collections) 並非執行緒安全 (thread-safe)，並會為您的程式庫引入複雜性和不可預測性。

例如，如果使用者修改了從 API 進入點回傳的可變集合，
將不清楚他們是在修改實作的結構還是副本。
同樣地，如果使用者在將集合傳遞給程式庫後可以修改其中的值，將不清楚這是否會影響實作。

由於陣列 (arrays) 是可變集合，請避免在您的 API 中使用它們。
如果必須使用陣列，請在與使用者共享資料之前進行防禦性複製 (defensive copies)。這可確保您的資料結構保持不變。

編譯器會自動為 `vararg` 引數執行此防禦性複製策略。
當使用 `spread operator` 將現有陣列傳遞到需要 `vararg` 引數的位置時，會自動建立該陣列的副本。

以下範例展示了此行為：

```kotlin
fun main() {
    fun demo(vararg input: String): Array<out String> = input

    val originalArray = arrayOf("one", "two", "three", "four")
    val newArray = demo(*originalArray)

    originalArray[1] = "ten"

    //印出 "one, ten, three, four"
    println(originalArray.joinToString())

    //印出 "one, two, three, four"
    println(newArray.joinToString())
}
```

## 驗證輸入和狀態

在實作進行之前，透過驗證輸入和現有狀態來確保您的程式庫被正確使用。
使用 [`require`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函數來驗證輸入，並使用 [`check`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 函數來驗證現有狀態。

如果其條件為 `false`，`require` 函數會拋出 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/#kotlin.IllegalArgumentException)，導致該函數立即失敗並顯示適當的錯誤訊息：

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

錯誤訊息應包含相關輸入，以幫助使用者判斷失敗的原因，如上述使用者名稱包含無效字元的錯誤訊息所示，該訊息包含了不正確的使用者名稱。
此實踐的一個例外是，當錯誤訊息中包含某個值可能會洩露可用於惡意安全漏洞利用的資訊時，這就是為什麼密碼長度的錯誤訊息不包含密碼輸入的原因。

同樣地，如果其條件為 `false`，`check` 函數會拋出 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/#kotlin.IllegalStateException)。
使用此函數來驗證實例的狀態，如下例所示：

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

在本指南的下一部分中，您將了解可偵錯性 (debuggability)。

[繼續閱讀下一部分](api-guidelines-debuggability.md)