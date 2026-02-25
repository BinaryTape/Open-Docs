[//]: # (title: 庫作者的向後相容性指引)

建立庫最常見的動機是將功能公開給更廣泛的社群。
這個社群可能是一個團隊、一家公司、一個特定的產業或一個技術平台。
在任何情況下，向後相容性都是一個重要的考量因素。
社群越廣泛，向後相容性就越重要，因為你對使用者是誰以及他們在什麼約束下工作了解較少。

向後相容性不是一個單一術語，可以在二進制、原始碼和行為層級上定義。
本節提供了有關這些類型的更多資訊。

請注意：

* 有可能在不破壞原始碼相容性的情況下破壞二進制相容性，反之亦然。
* 保證原始碼相容性是理想的，但非常困難。身為庫作者，你必須考慮庫的使用者叫用或具現化函式或型別的每一種可能方式。
原始碼相容性通常是一個願景，而非承諾。

本節的其餘部分介紹了你可以採取的行動，以及可以用來協助確保不同類型相容性的工具。

## 相容性類型 {initial-collapse-state="collapsed" collapsible="true"}

**二進制相容性**意味著庫的新版本可以替換先前編譯的庫版本。
任何針對庫的先前版本編譯的軟體都應繼續正確執行。

> 若要進一步了解二進制相容性，請參閱 [二進制相容性驗證器的 README](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#what-makes-an-incompatible-change-to-the-public-binary-api) 或 [Evolving Java-based APIs](https://github.com/eclipse-platform/eclipse.platform/blob/master/docs/Evolving-Java-based-APIs-2.md) 文件。
>
{style="tip"}

**原始碼相容性**意味著庫的新版本可以在不修改任何使用該庫的原始碼的情況下替換舊版本。然而，編譯此用戶端程式碼的輸出可能不再與編譯該庫的輸出相容，因此必須針對新版本的庫重新組建用戶端程式碼以保證相容性。

**行為相容性**意味著庫的新版本不會修改現有功能（修復錯誤除外）。涉及相同的特性，且它們具有相同的語意。

## 使用二進制相容性驗證器

JetBrains 提供了一個 [二進制相容性驗證器](https://github.com/Kotlin/binary-compatibility-validator) 工具，可用於確保 API 不同版本之間的二進制相容性。

此工具實作為一個 Gradle 外掛程式，它會為你的組建新增兩個任務：

* `apiDump` 任務會建立一個人類可讀的 `.api` 檔案來描述你的 API。
* `apiCheck` 任務會將儲存的 API 描述與目前組建中編譯的類別進行比較。

`apiCheck` 任務在組建期間由標準的 Gradle `check` 任務叫用。
當相容性被破壞時，組建會失敗。此時，你應該手動執行 `apiDump` 任務並比較新舊版本之間的差異。
如果你對變更感到滿意，可以更新位於版本控制系統中的現有 `.api` 檔案。

該驗證器對多平台庫產生的 [KLib 驗證具有實驗性支援](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#experimental-klib-abi-validation-support)。

### Kotlin Gradle 外掛程式中的二進制相容性驗證

<primary-label ref="experimental-general"/>

從 2.2.0 版本開始，Kotlin Gradle 外掛程式支援二進制相容性驗證。欲了解更多資訊，請參閱 [Kotlin Gradle 外掛程式中的二進制相容性驗證](gradle-binary-compatibility-validation.md)。

## 明確指定傳回型別

正如 [Kotlin 編碼準則](coding-conventions.md#coding-conventions-for-libraries) 中所討論的，你應始終在 API 中明確指定函式傳回型別和屬性型別。另請參閱有關 [顯式 API 模式](api-guidelines-simplicity.md#use-explicit-api-mode) 的章節。

考慮以下範例，庫作者建立了一個 `JsonDeserializer`，並為了方便起見，使用擴充方法將其與 `Int` 型別關聯：

```kotlin
class JsonDeserializer<T>(private val fromJson: (String) -> T) {
    fun deserialize(input: String): T {
        ...
    }
}

fun Int.defaultDeserializer() = JsonDeserializer { ... }
```

假設作者將此實作替換為 `JsonOrXmlDeserializer`：

```kotlin
class JsonOrXmlDeserializer<T>(
    private val fromJson: (String) -> T,
    private val fromXML: (String) -> T
) {
    fun deserialize(input: String): T {
        ...
    }
}

fun Int.defaultDeserializer() = JsonOrXmlDeserializer({ ... }, { ... })
```

現有功能將繼續運作，並增加了反序列化 XML 的能力。然而，這破壞了二進制相容性。

## 避免向現有 API 函式新增引數

向公用 API 新增非預設引數會破壞二進制和原始碼相容性，因為使用者在叫用時需要比以前提供更多的資訊。然而，即使是新增 [預設引數](functions.md#parameters-with-default-values) 也會破壞相容性。

例如，假設你在 `lib.kt` 中有以下函式：

```kotlin
fun fib() = … // 傳回零
```

以及在 `client.kt` 中的以下函式：

```kotlin
fun main() {
    println(fib()) // 列印零
}
```
在 JVM 上編譯這兩個檔案將產生輸出 `LibKt.class` 和 `ClientKt.class`。

假設你重新實作並編譯 `fib` 函式以表示費氏數列，使得 `fib(3)` 傳回 2，`fib(4)` 傳回 3，依此類推。你新增了一個參數，但給它一個預設值零以保留現有行為：

```kotlin
fun fib(input: Int = 0) = … // 傳回費氏數列成員
```

現在你需要重新編譯 `lib.kt` 檔案。你可能預期 `client.kt` 檔案不需要重新編譯，並且關聯的類別檔案可以按如下方式叫用：

```shell
$ kotlin ClientKt.class
```

但如果你嘗試這樣做，會發生 `NoSuchMethodError`：

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'int LibKt.fib()'
       at LibKt.main(fib.kt:2)
       at LibKt.main(fib.kt)
       …
```

這是因為 Kotlin/JVM 編譯器產生的位元組碼中方法的簽章發生了變化，破壞了二進制相容性。

然而，原始碼相容性得到了保留。如果你重新編譯這兩個檔案，程式將像以前一樣執行。

### 使用手動多載以保留相容性 {initial-collapse-state="collapsed" collapsible="true"}

為了保持二進制相容性，如果你想向函式新增新參數，則需要手動建立多個多載，而不是使用單個具有預設引數的函式。在上面的範例中，這意味著為要接受 `Int` 參數的情況建立一個單獨的 `fib()` 函式：

```kotlin
fun fib() = … 
fun fib(input: Int) = …
```

在為 JVM 編寫 Kotlin 程式碼時，向標記有 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/) 且具有預設引數的函式新增參數時要小心。該註解不會保留二進制相容性，因此你仍然需要新增手動多載。

## 避免加寬或縮窄傳回型別

在演進 API 時，通常會想要加寬或縮窄函式的傳回型別。例如，在 API 的未來版本中，你可能希望將傳回型別從 `List` 切換為 `Collection` 或從 `Collection` 切換為 `List`。

你可能希望將型別縮窄為 `List` 以滿足使用者對索引支援的需求。相反，你可能希望將型別加寬為 `Collection`，因為你意識到正在處理的資料沒有自然順序。

顯而易見，加寬傳回型別會破壞相容性。例如，從 `List` 轉換為 `Collection` 會破壞所有使用索引的程式碼。

你可能認為縮窄傳回型別（例如從 `Collection` 縮窄到 `List`）會保留相容性。不幸的是，雖然原始碼相容性得到了保留，但二進制相容性卻被破壞了。

假設你在 `Library.kt` 檔案中中有一個示範函式：

```kotlin
public fun demo(): Number = 3
```

以及在 `Client.kt` 中該函式的用戶端：

```kotlin
fun main() {
    println(demo()) // 列印 3
}
```

讓我們想像一個場景，你更改了 demo 的傳回型別並僅重新編譯 `Library.kt`：

```kotlin
fun demo(): Int = 3
```

當你重新執行用戶端時，會發生以下錯誤（在 JVM 上）：

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'java.lang.Number Library.demo()'
        at ClientKt.main(call.kt:2)
        at ClientKt.main(call.kt)
        …
```

發生這種情況是因為從 `main` 方法產生的位元組碼中有以下指令：

```text
0: invokestatic  #12 // Method Library.demo:()Ljava/lang/Number;
```

JVM 正在嘗試叫用一個名為 demo 且傳回 `Number` 的 static 方法。然而，由於此方法已不再存在，你破壞了二進制相容性。

## 避免在 API 中使用資料類別

在一般開發中，資料類別的優勢在於為你產生的額外函式。在 API 設計中，這種優勢變成了弱點。

例如，假設你在 API 中使用以下資料類別：

```kotlin
data class User(
    val name: String,
    val email: String
)
```

稍後，你可能想要新增一個名為 `active` 的屬性：

```kotlin
data class User(
    val name: String,
    val email: String,
    val active: Boolean = true
)
```

這將以兩種方式破壞二進制相容性。首先，產生的建構函式將具有不同的簽章。此外，產生的 `copy` 方法簽章也會發生變化。

原始簽章（在 Kotlin/JVM 上）將是：

```text
public final User copy(java.lang.String, java.lang.String)
```

新增 `active` 屬性後，簽章變為：

```text
public final User copy(java.lang.String, java.lang.String, boolean)
```

與建構函式一樣，這破壞了二進制相容性。

可以透過手動編寫次要建構函式並覆寫 `copy` 方法來解決這些問題。然而，所涉及的努力抵消了使用資料類別的便利性。

資料類別的另一個問題是，更改建構函式引數的順序會影響產生的 `componentX` 方法，這些方法用於解構。即使它不破壞二進制相容性，更改順序也絕對會破壞行為相容性。

## 使用 PublishedApi 註解的考量因素

Kotlin 允許內聯函式成為庫 API 的一部分。對這些函式的呼叫將內聯到使用者編寫的用戶端程式碼中。這可能會引入相容性問題，因此不允許這些函式呼叫非公用 API 宣告。

如果你需要從內聯的公用函式呼叫庫的內部 API，可以透過使用 [`@PublishedApi`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-published-api/) 對其進行標記來實現。這使得內部宣告實際上變成公用的，因為對它的引用將最終出現在編譯後的用戶端程式碼中。因此，在對其進行更改時，必須將其視為與公用宣告相同，因為這些更改可能會影響二進制相容性。

## 務實地演進 API

有時你需要隨時間推移透過移除或更改現有宣告來對庫的 API 進行重大變更。在本節中，我們將討論如何務實地處理此類情況。

當使用者升級到庫的較新版本時，他們不應在專案原始碼中出現對庫 API 的未解決引用。與其立即從庫的公用 API 中移除某些內容，不如遵循棄用週期。這樣，你就可以讓使用者有時間遷移到替代方案。

在舊宣告上使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 註解以表示它正被替換。此註解的參數提供了有關棄用的重要細節：

* `message` 應說明更改了什麼以及原因。
* 應盡可能使用 `replaceWith` 參數來提供到新 API 的自動遷移。
* 應使用棄用級別來逐步棄用 API。欲了解更多資訊，請參閱 [Kotlin 文件中的棄用頁面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)。

通常，棄用應首先產生警告，然後是錯誤，最後隱藏宣告。此過程應跨越多個次要版本發生，讓使用者有時間在他們的專案中進行任何必要的更改。重大變更（例如移除 API）應僅在主要版本中發生。庫可以採用不同的版本控制和棄用策略，但必須將其傳達給使用者以建立正確的預期。

你可以在 [Kotlin 演進原則文件](kotlin-evolution-principles.md#libraries) 或 KotlinConf 2023 中由 Leonid Startsev 主講的 [Evolving your Kotlin API painlessly for clients 演講](https://www.youtube.com/watch?v=cCgXtpVPO-o&t=1468s) 中了解更多資訊。

## 使用 RequiresOptIn 機制 

Kotlin 標準庫 [提供了選擇加入機制](opt-in-requirements.md)，要求使用者在呼叫 API 的一部分之前提供明確同意。這是基於建立標記註解，這些註解本身標記有 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/)。你應該使用此機制來管理有關原始碼和行為相容性的預期，尤其是在向庫引入新 API 時。

如果你選擇使用此機制，我們建議遵循以下最佳實務：

* 使用選擇加入機制為 API 的不同部分提供不同的保證。例如，你可以將特性標記為 _Preview_、_Experimental_ 和 _Delicate_。每個類別都應在文件和 [KDoc 註解](kotlin-doc.md) 中明確說明，並附帶適當的警告訊息。
* 如果你的庫使用實驗性 API，請 [將註解傳播](opt-in-requirements.md#propagate-opt-in-requirements) 給你自己的使用者。這可確保你的使用者意識到你擁有仍在演進中的相依性。
* 避免使用選擇加入機制來棄用庫中已存在的宣告。請改用 `@Deprecated`，如 [務實地演進 API](#evolve-apis-pragmatically) 一節所述。

## 下一步

如果你還沒有看過，請考慮查看這些頁面：

* 在 [盡量減少心智複雜度](api-guidelines-minimizing-mental-complexity.md) 頁面中探索最小化心智複雜度的策略。
* 有關有效文件實踐的廣泛概覽，請參閱 [資訊豐富的文件](api-guidelines-informative-documentation.md)。