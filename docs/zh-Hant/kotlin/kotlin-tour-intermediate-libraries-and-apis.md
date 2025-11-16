[//]: # (title: 中級：程式庫與 API)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充函式</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">範圍函式</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶接收者的 Lambda 表達式</a><br />
        <img src="icon-4-done.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-done.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-done.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放與特殊類別</a><br />
        <img src="icon-7-done.svg" width="20" alt="第七步" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8-done.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全</a><br />
        <img src="icon-9.svg" width="20" alt="第九步" /> <strong>程式庫與 API</strong><br /></p>
</tldr>

為了充分利用 Kotlin，請使用現有的程式庫和 API，這樣您就可以花更多時間在編碼上，而不是重複造輪子。

程式庫會分發可重複使用的程式碼，以簡化常見任務。在程式庫中，有套件和物件可將相關的類別、函式和工具程式分組。程式庫會將 API (Application Programming Interface，應用程式介面) 作為一組函式、類別或屬性公開，供開發人員在其程式碼中使用。

![Kotlin 程式庫與 API](kotlin-library-diagram.svg){width=600}

讓我們探索 Kotlin 的可能性。

## 標準程式庫

Kotlin 有一個標準程式庫，提供基本類型、函式、集合和工具程式，使您的程式碼簡潔且富有表達性。標準程式庫的很大一部分（[`kotlin` 套件](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/) 中的所有內容）無需明確匯入即可在任何 Kotlin 檔案中直接使用：

```kotlin
fun main() {
    val text = "emosewa si niltoK"
    
   // 使用標準程式庫中的 reversed() 函式
    val reversedText = text.reversed()

    // 使用標準程式庫中的 print() 函式
    print(reversedText)
    // Kotlin is awesome
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-stdlib"}

然而，標準程式庫的某些部分在您使用它們之前需要匯入。例如，如果您想使用標準程式庫的時間測量功能，您需要匯入 [`kotlin.time` 套件](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)。

在檔案的頂部，新增 `import` 關鍵字，後面跟著您需要的套件：

```kotlin
import kotlin.time.*
```

星號 `*` 是一個萬用字元匯入，它告訴 Kotlin 匯入套件內的所有內容。您不能將星號 `*` 用於伴生物件。相反，您需要明確宣告要使用的伴生物件的成員。

例如：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

fun main() {
    val thirtyMinutes: Duration = 30.minutes
    val halfHour: Duration = 0.5.hours
    println(thirtyMinutes == halfHour)
    // true
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-time"}

此範例：

*   匯入 `Duration` 類別及其伴生物件的 `hours` 和 `minutes` 擴充屬性。
*   使用 `minutes` 屬性將 `30` 轉換為 30 分鐘的 `Duration`。
*   使用 `hours` 屬性將 `0.5` 轉換為 30 分鐘的 `Duration`。
*   檢查兩個 Duration 是否相等並印出結果。

### 在開發前先搜尋

在您決定編寫自己的程式碼之前，請檢查標準程式庫，看看您要尋找的內容是否已經存在。以下是標準程式庫已經為您提供了許多類別、函式和屬性的領域列表：

*   [集合 (Collections)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/)
*   [序列 (Sequences)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.sequences/)
*   [字串操作 (String manipulation)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/)
*   [時間管理 (Time management)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)

要了解標準程式庫中的更多內容，請探索其 [API 參考](https://kotlinlang.org/api/core/kotlin-stdlib/)。

## Kotlin 程式庫

標準程式庫涵蓋了許多常見的使用情境，但有些情境它無法處理。幸運的是，Kotlin 團隊和社群的其餘成員開發了各種各樣的程式庫來補充標準程式庫。例如，[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 可以幫助您管理跨不同平台的時間。

您可以在我們的 [搜尋平台](https://klibs.io/) 上找到有用的程式庫。要使用它們，您需要採取額外的步驟，例如新增依賴項或外掛程式。每個程式庫都有一個 GitHub 儲存庫，其中包含有關如何將其包含在您的 Kotlin 專案中的說明。

新增程式庫後，您可以匯入其中的任何套件。以下是一個如何匯入 `kotlinx-datetime` 套件以查詢紐約目前時間的範例：

```kotlin
import kotlinx.datetime.*

fun main() {
    val now = Clock.System.now() // 取得目前的 Instant
    println("Current instant: $now")

    val zone = TimeZone.of("America/New_York")
    val localDateTime = now.toLocalDateTime(zone)
    println("Local date-time in NY: $localDateTime")
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-datetime"}

此範例：

*   匯入 `kotlinx.datetime` 套件。
*   使用 `Clock.System.now()` 函式建立一個包含目前時間的 `Instant` 類別實例，並將結果指派給 `now` 變數。
*   印出目前時間。
*   使用 `TimeZone.of()` 函式查詢紐約的時區，並將結果指派給 `zone` 變數。
*   在包含目前時間的實例上呼叫 `.toLocalDateTime()` 函式，並將紐約時區作為參數。
*   將結果指派給 `localDateTime` 變數。
*   印出根據紐約時區調整過的時間。

> 要更詳細地探索此範例使用的函式和類別，請參閱 [API 參考](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/)。
>
{style="tip"}

## 選擇加入 API

程式庫作者可能會將某些 API 標記為需要在您的程式碼中使用之前選擇加入。當 API 仍在開發中並且將來可能會更改時，他們通常會這樣做。如果您不選擇加入，您會看到以下警告或錯誤：

```text
This declaration needs opt-in. Its usage should be marked with '@...' or '@OptIn(...)'
```

要選擇加入，請撰寫 `@OptIn`，後面跟著圓括號，其中包含分類 API 的類別名稱，然後是兩個冒號 `::` 和 `class`。

例如，標準程式庫中的 `uintArrayOf()` 函式屬於 `@ExperimentalUnsignedTypes`，如 [API 參考](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-u-int-array.html) 中所示：

```kotlin
@ExperimentalUnsignedTypes
inline fun uintArrayOf(vararg elements: UInt): UIntArray
```

在您的程式碼中，選擇加入看起來像這樣：

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
```

以下是一個範例，選擇加入以使用 `uintArrayOf()` 函式建立一個無符號整數陣列並修改其元素之一：

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
fun main() {
    // 建立一個無符號整數陣列
    val unsignedArray: UIntArray = uintArrayOf(1u, 2u, 3u, 4u, 5u)

    // 修改一個元素
    unsignedArray[2] = 42u
    println("Updated array: ${unsignedArray.joinToString()}")
    // Updated array: 1, 2, 42, 4, 5
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-apis"}

這是最簡單的選擇加入方式，但還有其他方式。要了解更多資訊，請參閱 [選擇加入要求](opt-in-requirements.md)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-1"}

您正在開發一個金融應用程式，幫助使用者計算其投資的未來價值。計算複利的公式為：

<math>A = P \times (1 + \displaystyle\frac{r}{n})^{nt}</math>

其中：

*   `A` 是在計息後累積的金額（本金 + 利息）。
*   `P` 是本金（初始投資）。
*   `r` 是年利率（小數）。
*   `n` 是每年複利次數。
*   `t` 是投資時間（年）。

更新程式碼以：

1.  從 [`kotlin.math` 套件](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/) 匯入必要的函式。
2.  為 `calculateCompoundInterest()` 函式新增函式主體，該函式主體計算應用複利後的最終金額。

|--|--|

```kotlin
// 在此編寫您的程式碼

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    // 在此編寫您的程式碼
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
    // The accumulated amount is: 1282.0372317085844
}

```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-libraries-exercise-1"}

|---|---|
```kotlin
import kotlin.math.*

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    return P * (1 + r / n).pow(n * t)
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
    // The accumulated amount is: 1282.0372317085844
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-libraries-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-2"}

您想測量程式中執行多個資料處理任務所需的時間。更新程式碼以新增正確的匯入語句和 [`kotlin.time`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/) 套件中的函式：

|---|---|

```kotlin
// 在此編寫您的程式碼

fun main() {
    val timeTaken = /* 在此編寫您的程式碼 */ {
        // 模擬一些資料處理
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }

        // 模擬處理篩選後的資料
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }

    println("Time taken: $timeTaken") // e.g. 16 ms
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-libraries-exercise-2"}

|---|---|
```kotlin
import kotlin.time.measureTime

fun main() {
    val timeTaken = measureTime {
        // Simulate some data processing
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }

        // Simulate processing the filtered data
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }

    println("Time taken: $timeTaken") // e.g. 16 ms
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-libraries-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

Kotlin 最新版本中標準程式庫有一個新功能。您想嘗試它，但它需要選擇加入。該功能屬於 [`@ExperimentalStdlibApi`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-experimental-stdlib-api/)。在您的程式碼中，選擇加入應該是什麼樣子？

|---|---|
```kotlin
@OptIn(ExperimentalStdlibApi::class)
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-libraries-solution-3"}

## 下一步是什麼？

恭喜！您已完成中級巡覽！作為下一步，請查看我們針對流行 Kotlin 應用程式的教學：

*   [使用 Spring Boot 和 Kotlin 建立後端應用程式](jvm-create-project-with-spring-boot.md)
*   從頭開始建立 Android 和 iOS 的跨平台應用程式並：
    *   [在保持原生使用者介面的同時分享業務邏輯](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)
    *   [分享業務邏輯和使用者介面](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)