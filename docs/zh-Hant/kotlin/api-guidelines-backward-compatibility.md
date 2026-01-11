[//]: # (title: 函式庫作者的向下相容性指南)

建立函式庫最常見的動機是將功能公開給更廣泛的社群。
此社群可能是一個單一團隊、一家公司、一個特定產業或一個技術平台。
在所有情況下，向下相容性都將是一個重要的考量。
社群越廣泛，向下相容性就越重要，因為您將越不清楚您的使用者是誰以及他們所處的工作限制。

向下相容性不是單一術語，但可以在二進位、原始碼和行為層級定義。
本節將提供這些類型的更多資訊。

請注意：

*   即使不破壞原始碼相容性，也可能破壞二進位相容性，反之亦然。
*   保證原始碼相容性是理想但非常困難的。作為函式庫作者，您必須考量函式庫使用者可能呼叫或實例化函式或類型的所有可能方式。
    原始碼相容性通常是願景，而非承諾。

本節其餘部分將說明您可以採取的行動，以及可以使用的工具，以協助確保不同類型的相容性。

## 相容性類型 {initial-collapse-state="collapsed" collapsible="true"}

**二進位相容性**意味著函式庫的新版本可以替換先前編譯的函式庫版本。
任何針對函式庫先前版本編譯的軟體都應繼續正常運作。

> 了解更多關於二進位相容性，請參閱 [Binary compatibility validator 的 README](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#what-makes-an-incompatible-change-to-the-public-binary-api) 或 [Evolving Java-based APIs](https://github.com/eclipse-platform/eclipse.platform/blob/master/docs/Evolving-Java-based-APIs-2.md) 文件。
>
{style="tip"}

**原始碼相容性**意味著函式庫的新版本可以在不修改任何使用該函式庫的原始碼的情況下替換舊版本。然而，編譯此客戶端程式碼的輸出可能不再與編譯函式庫的輸出相容，因此客戶端程式碼必須針對函式庫的新版本進行重建，以確保相容性。

**行為相容性**意味著函式庫的新版本不會修改現有功能，除非是修復錯誤。相同的特性被涉及，並且它們具有相同的語義。

## 使用 Binary compatibility validator

JetBrains 提供一個 [Binary compatibility validator](https://github.com/Kotlin/binary-compatibility-validator) 工具，可用於確保您的 API 在不同版本之間的二進位相容性。

此工具作為 Gradle 外掛實作，並為您的建構新增兩個任務：

*   `apiDump` 任務會建立一個人類可讀的 `.api` 檔案，描述您的 API。
*   `apiCheck` 任務會將儲存的 API 描述與目前建構中編譯的類別進行比較。

`apiCheck` 任務在建構時由標準的 Gradle `check` 任務呼叫。
當相容性被破壞時，建構會失敗。此時，您應該手動執行 `apiDump` 任務，並比較舊版本和新版本之間的差異。
如果您對這些變更感到滿意，可以更新現有的 `.api` 檔案，該檔案位於您的 VCS 中。

驗證器對多平台函式庫產生的 [KLibs 具有實驗性驗證支援](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#experimental-klib-abi-validation-support)。

### Kotlin Gradle 外掛中的二進位相容性驗證

<primary-label ref="experimental-general"/>

從 2.2.0 版開始，Kotlin Gradle 外掛支援二進位相容性驗證。有關更多資訊，請參閱 [Kotlin Gradle 外掛中的二進位相容性驗證](gradle-binary-compatibility-validation.md)。

## 明確指定回傳類型

如同在 [Kotlin 程式碼撰寫準則](coding-conventions.md#coding-conventions-for-libraries) 中所討論的，您應該始終在 API 中明確指定函式回傳類型和屬性類型。另請參閱有關 [明確 API 模式](api-guidelines-simplicity.md#use-explicit-api-mode) 的部分。

考量以下範例，其中函式庫作者建立了一個 `JsonDeserializer`，為了方便起見，使用擴展函式將其與 `Int` 類型關聯：

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

現有功能將繼續運作，並新增了解析 XML 的功能。然而，這會破壞二進位相容性。

## 避免向現有 API 函式新增參數

向公開 API 新增非預設參數會破壞二進位和原始碼相容性，因為使用者在呼叫時需要提供比以前更多的資訊。
然而，即使是新增 [預設參數](functions.md#parameters-with-default-values) 也可能破壞相容性。

例如，假設您在 `lib.kt` 中有以下函式：

```kotlin
fun fib() = … // Returns zero
```

以及在 `client.kt` 中有以下函式：

```kotlin
fun main() {
    println(fib()) // Prints zero
}
```
在 JVM 上編譯這兩個檔案會產生 `LibKt.class` 和 `ClientKt.class` 輸出。

假設您重新實作並編譯 `fib` 函式以表示費波那契數列，使得 `fib(3)` 回傳 2，`fib(4)` 回傳 3，依此類推。
您新增一個參數，但賦予其零的預設值，以保留現有行為：

```kotlin
fun fib(input: Int = 0) = … // Returns Fibonacci member
```

您現在需要重新編譯檔案 `lib.kt`。您可能會預期 `client.kt` 檔案不需要重新編譯，
並且相關的類別檔案可以如下呼叫：

```shell
$ kotlin ClientKt.class
```

但如果您嘗試這樣做，會發生 `NoSuchMethodError`：

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'int LibKt.fib()'
       at LibKt.main(fib.kt:2)
       at LibKt.main(fib.kt)
       …
```

這是因為方法簽章在 Kotlin/JVM 編譯器生成的位元組碼中發生了改變，破壞了二進位相容性。

然而，原始碼相容性被保留。如果您重新編譯兩個檔案，程式將像以前一樣執行。

### 使用手動多載來保留相容性 {initial-collapse-state="collapsed" collapsible="true"}

為了保持二進位相容性，如果您想要向函式新增一個新參數，您需要手動建立多個多載，而不是使用單一接受預設參數的函式。在上述範例中，這意味著為您希望接受 `Int` 參數的情況建立一個單獨的 `fib()` 函式：

```kotlin
fun fib() = … 
fun fib(input: Int) = …
```

在為 JVM 撰寫 Kotlin 程式碼時，向帶有預設參數並用 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/) 註解的函式新增參數時請注意。此註解不會保留二進位相容性，因此您仍然需要新增手動多載。

## 避免擴展或縮小回傳類型

在 API 演進過程中，通常會想要擴展或縮小函式的回傳類型。
例如，在您的 API 的即將推出的版本中，您可能希望將回傳類型從 `List` 切換到 `Collection`，或從 `Collection` 切換到 `List`。

您可能希望將類型縮小為 `List`，以滿足使用者對索引支援的需求。
相反地，您可能希望將類型擴展為 `Collection`，因為您意識到您正在處理的資料沒有自然順序。

很容易理解為什麼擴展回傳類型會破壞相容性。例如，從 `List` 轉換為 `Collection` 會破壞所有使用索引的程式碼。

您可能會認為縮小回傳類型，例如從 `Collection` 到 `List`，會保留相容性。
不幸的是，雖然原始碼相容性被保留，但二進位相容性被破壞。

假設您在檔案 `Library.kt` 中有一個示範函式：

```kotlin
public fun demo(): Number = 3
```

以及在 `Client.kt` 中有一個函式客戶端：

```kotlin
fun main() {
    println(demo()) // Prints 3
}
```

讓我們想像一個場景，您更改了 `demo` 的回傳類型，並且只重新編譯了 `Library.kt`：

```kotlin
fun demo(): Int = 3
```

當您重新執行客戶端時，將發生以下錯誤 (在 JVM 上)：

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'java.lang.Number Library.demo()'
        at ClientKt.main(call.kt:2)
        at ClientKt.main(call.kt)
        …
```

發生這種情況是因為從 `main` 方法生成的位元組碼中包含以下指令：

```text
0: invokestatic  #12 // Method Library.demo:()Ljava/lang/Number;
```

JVM 正在嘗試呼叫一個名為 `demo` 的靜態方法，該方法回傳一個 `Number`。
然而，由於此方法不再存在，您已破壞了二進位相容性。

## 避免在 API 中使用資料類別

在常規開發中，資料類別的優勢在於為您生成的額外函式。
在 API 設計中，這種優勢變成了弱點。

例如，假設您在 API 中使用以下資料類別：

```kotlin
data class User(
    val name: String,
    val email: String
)
```

稍後，您可能希望新增一個名為 `active` 的屬性：

```kotlin
data class User(
    val name: String,
    val email: String,
    val active: Boolean = true
)
```

這會以兩種方式破壞二進位相容性。首先，生成的建構函式將具有不同的簽章。
此外，生成的 `copy` 方法的簽章也會改變。

原始簽章 (在 Kotlin/JVM 上) 會是：

```text
public final User copy(java.lang.String, java.lang.String)
```

添加 `active` 屬性後，簽章變為：

```text
public final User copy(java.lang.String, java.lang.String, boolean)
```

與建構函式一樣，這會破壞二進位相容性。

可以透過手動撰寫次要建構函式並覆寫 `copy` 方法來解決這些問題。
然而，所涉及的努力抵消了使用資料類別的便利性。

資料類別的另一個問題是，更改建構函式參數的順序會影響生成的 `componentX` 方法，
這些方法用於解構。即使它不破壞二進位相容性，更改順序也肯定會破壞行為相容性。

## 使用 PublishedApi 註解的考量事項

Kotlin 允許內聯函式成為您函式庫 API 的一部分。對這些函式的呼叫將內聯到您的使用者撰寫的客戶端程式碼中。這可能會引入相容性問題，因此這些函式不允許呼叫非公開 API 宣告。

如果您需要從內聯的公開函式呼叫函式庫的內部 API，您可以透過使用 [`@PublishedApi`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-published-api/) 註解來做到這一點。
這使得內部宣告有效地成為公開的，因為對它的引用最終會出現在編譯後的客戶端程式碼中。
因此，在對其進行更改時，必須將其與公開宣告相同地處理，因為這些更改可能會影響二進位相容性。

## 務實地演進 API

有些情況下，您需要透過移除或更改現有宣告來隨時間對函式庫的 API 進行重大變更。
在本節中，我們將討論如何務實地處理此類情況。

當使用者升級到您的函式庫的新版本時，他們不應在專案的原始碼中遇到對您函式庫 API 的未解析引用。與其立即從函式庫的公開 API 中移除某些內容，您應該遵循一個棄用週期。這樣，您可以給予使用者時間遷移到替代方案。

在舊宣告上使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 註解，以表明它正在被替換。此註解的參數提供了有關棄用的重要詳細資訊：

*   `message` 應解釋正在更改的內容以及原因。
*   `replaceWith` 參數應盡可能用於提供自動遷移到新 API 的功能。
*   棄用的層級應用於逐漸棄用 API。有關更多資訊，請參閱 [Kotlin 文件中的 Deprecated 頁面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)。

通常，棄用應首先產生警告，然後是錯誤，最後隱藏宣告。
此過程應在幾個次要版本中進行，給予使用者時間在其專案中進行任何必要的更改。
破壞性變更，例如移除 API，應僅在主要版本中發生。
函式庫可以採用不同的版本控制和棄用策略，但這必須傳達給其使用者，以設定正確的期望。

您可以在 [Kotlin 演進原則文件](kotlin-evolution-principles.md#libraries) 或 KotlinConf 2023 上 Leonid Startsev 的 [為客戶無痛演進您的 Kotlin API 演講](https://www.youtube.com/watch?v=cCgXtpVPO-o&t=1468s) 中了解更多資訊。

## 使用 RequiresOptIn 機制

Kotlin 標準函式庫 [提供了選擇性加入機制](opt-in-requirements.md)，要求使用者在使用您的 API 的某個部分之前明確同意。
這是基於建立標記註解，這些註解本身都用 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 註解。
您應該使用此機制來管理與原始碼和行為相容性相關的期望，特別是在向您的函式庫引入新的 API 時。

如果您選擇使用此機制，我們建議遵循以下最佳實踐：

*   使用選擇性加入機制為 API 的不同部分提供不同的保證。例如，您可以將功能標記為 _預覽_、_實驗性_ 和 _精細_。每個類別都應在您的文件中和 [KDoc 註解](kotlin-doc.md) 中清楚解釋，並附有適當的警告訊息。
*   如果您的函式庫使用實驗性 API，請將 [註解傳播](opt-in-requirements.md#propagate-opt-in-requirements) 給您的使用者。這確保您的使用者意識到您有仍在演進的依賴項。
*   避免使用選擇性加入機制來棄用函式庫中已存在的宣告。請改用 `@Deprecated`，如 [務實地演進 API](#evolve-apis-pragmatically) 部分所述。

## 接下來呢

如果您還沒有，請考慮查看這些頁面：

*   在 [最小化心智複雜度](api-guidelines-minimizing-mental-complexity.md) 頁面中探索最小化心智複雜度的策略。
*   有關有效文件撰寫實踐的廣泛概述，請參閱 [資訊豐富的文件](api-guidelines-informative-documentation.md)。