[//]: # (title: 除錯性)

您函式庫的使用者將會基於其功能進行建構，而他們建構的功能將包含需要識別和解決的錯誤。
這個錯誤解決過程可能會在開發期間透過除錯器進行，或在生產環境中使用日誌和可觀測性工具進行。
您的函式庫可以遵循這些最佳實踐，以使其更易於除錯。

## 為有狀態的類型提供 toString 方法

對於每個包含狀態的類型，提供一個有意義的 `toString` 實作。
即使對於內部類型，此實作也應回傳該實例當前內容的易於理解的表示。

由於類型的 `toString` 表示通常會寫入日誌，因此在實作此方法時請考慮安全性，並避免回傳敏感的使用者資料。

確保用於描述狀態的格式在您函式庫的不同類型之間盡可能保持一致。
當此格式是您的 API 所實作合約的一部分時，應明確描述並徹底文件化。
您的 `toString` 方法的輸出可能支援解析，例如在自動化測試套件中。

例如，考慮一個支援服務訂閱的函式庫中的以下類型：

```kotlin
enum class SubscriptionResultReason {
    Success, InsufficientFunds, IncompatibleAccount
}

class SubscriptionResult(
    val result: Boolean,
    val reason: SubscriptionResultReason,
    val description: String
)
```

如果沒有 `toString` 方法，列印 `SubscriptionResult` 實例的用處不大：

```kotlin
fun main() {
    val result = SubscriptionResult(
       false,
       IncompatibleAccount,
       "Users account does not support this type of subscription"
    )
    
    //prints 'org.example.SubscriptionResult@13221655'
    println(result)
}
```

在除錯器中也無法輕鬆顯示資訊：

![Results in the debugger](debugger-result.png){width=500}

新增一個簡單的 `toString` 實作可顯著改善這兩種情況下的輸出：

```kotlin
//prints 'Subscription failed (reason=IncompatibleAccount, description="Users 
// account does not support this type of subscription")'
override fun toString(): String {
    val resultText = if(result) "succeeded" else "failed"
    return "Subscription $resultText (reason=$reason, description=\"$description\")"
}
```

![Adding toString results in a much better result](debugger-result-tostring.png){width=700}

雖然使用 `data class` 來自動取得 `toString` 方法可能很誘人，但為了向後相容性原因，不建議這樣做。
有關 `data class` 的更多詳細資訊，請參閱 [避免在您的 API 中使用 data class](api-guidelines-backward-compatibility.md#avoid-using-data-classes-in-your-api) 一節。

請注意，`toString` 方法中描述的狀態不一定需要是來自問題領域的資訊。
它可以與進行中的請求狀態（如上例所示）、與外部服務連線的健康狀況，或進行中操作中的中間狀態相關。

例如，考慮以下建構器類型：

```kotlin
class Person(
    val name: String?,
    val age: Int?,
    val children: List<Person>
) {
    override fun toString(): String =
        "Person(name=$name, age=$age, children=$children)"
}

class PersonBuilder {
    var name: String? = null
    var age: Int? = null
    val children = arrayListOf<Person>()

    fun child(personBuilder: PersonBuilder.() -> Unit = {}) {
       children.add(person(personBuilder))
    }
    fun build(): Person = Person(name, age, children)
}

fun person(personBuilder: PersonBuilder.() -> Unit = {}): Person = 
    PersonBuilder().apply(personBuilder).build()
```

這是您使用此類型的方式：

![Using the builder type example](halt-breakpoint.png){width=500}

如果您在上面圖片顯示的斷點處停止程式碼，顯示的資訊將不會有幫助：

![Halting code at the breakpoint result](halt-result.png){width=500}

新增一個簡單的 `toString` 實作會產生更有用的輸出：

```kotlin
override fun toString(): String =
    "PersonBuilder(name=$name, age=$age, children=$children)"
```

有了這個新增，除錯器會顯示：

![Adding toString to the halt point](halt-tostring-result.png){width=700}

這樣，您可以立即看到哪些欄位已設定，哪些尚未設定。

## 採用並文件化異常處理策略

如 [選擇適當的錯誤處理機制](api-guidelines-consistency.md#choose-the-appropriate-error-handling-mechanism) 一節中所述，
有時您的函式庫拋出異常來發出錯誤訊號是適當的。
您可以為此目的建立自己的異常類型。

抽象和簡化底層 API 的函式庫也需要處理其依賴項拋出的異常。
函式庫可以選擇抑制異常、按原樣傳遞它、將其轉換為不同類型的異常，
或以不同方式向使用者發出錯誤訊號。

這些選項中的任何一個都可能有效，具體取決於上下文。例如：

*   如果使用者採用函式庫 A 純粹是為了方便簡化函式庫 B，那麼函式庫 A 重新拋出函式庫 B 生成的任何異常而不加修改可能是適當的。
*   如果函式庫 A 採用函式庫 B 純粹作為內部實作細節，那麼函式庫 B 拋出的函式庫特定異常絕不應暴露給函式庫 A 的使用者。

您必須採用並文件化一致的異常處理方法，以便使用者可以有效地利用您的函式庫。
這對於除錯尤其重要。您的函式庫的使用者應該能夠在除錯器和日誌中識別出異常何時源自您的函式庫。

異常的類型應指示錯誤的類型，並且異常中的資料應幫助使用者定位問題的根本原因。
一種常見模式是將低層級異常包裝在函式庫特定的異常中，並將原始異常作為 `cause` 屬性提供。

## 下一步

在本指南的下一部分中，您將學習可測試性。

[繼續下一部分](api-guidelines-testability.md)