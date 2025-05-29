[//]: # (title: 進階：函式庫與 API)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充函數</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函數</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶接收者的 Lambda 表達式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放類別與特殊類別</a><br />
        <img src="icon-7-done.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8-done.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全</a><br />
        <img src="icon-9.svg" width="20" alt="Ninth step" /> <strong>函式庫與 API</strong><br /></p>
</tldr>

為了最大化 Kotlin 的效用，請使用現有的函式庫與 API，如此您便能花更多時間撰寫程式碼，而不是重複造輪子。

函式庫分發可重複使用的程式碼，以簡化常見任務。在函式庫中，有將相關的類別、函數和公用程式分組的套件與物件。函式庫以一組函數、類別或屬性來公開 API（應用程式介面），供開發者在其程式碼中使用。

![Kotlin libraries and APIs](kotlin-library-diagram.svg){width=600}

讓我們探索 Kotlin 的可能性。

## 標準函式庫

Kotlin 有一個標準函式庫，提供基本的類型、函數、集合和公用程式，使您的程式碼簡潔且富有表達力。標準函式庫的很大一部分（[`kotlin` 套件](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/)中的所有內容）在任何 Kotlin 檔案中都可直接使用，無需明確匯入：

```kotlin
fun main() {
    val text = "emosewa si niltoK"
    
   // Use the reversed() function from the standard library
    val reversedText = text.reversed()

    // Use the print() function from the standard library
    print(reversedText)
    // Kotlin is awesome
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-stdlib"}

然而，標準函式庫的某些部分在您的程式碼中使用前需要匯入。例如，如果您想使用標準函式庫的時間測量功能，您需要匯入 [`kotlin.time` 套件](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)。

在您的檔案頂部，新增 `import` 關鍵字，後跟您需要的套件：

```kotlin
import kotlin.time.*
```

星號 `*` 是一個萬用字元匯入，它告訴 Kotlin 匯入套件中的所有內容。您不能將星號 `*` 與伴隨物件一起使用。相反，您需要明確宣告您要使用的伴隨物件的成員。

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

*   匯入 `Duration` 類別及其伴隨物件中的 `hours` 和 `minutes` 擴充屬性。
*   使用 `minutes` 屬性將 `30` 轉換為 30 分鐘的 `Duration`。
*   使用 `hours` 屬性將 `0.5` 轉換為 30 分鐘的 `Duration`。
*   檢查兩個持續時間是否相等並列印結果。

### 建置前先搜尋

在您決定撰寫自己的程式碼之前，請檢查標準函式庫，看看您要尋找的功能是否已經存在。以下是標準函式庫已為您提供大量類別、函數和屬性的領域列表：

*   [集合 (Collections)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/)
*   [序列 (Sequences)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.sequences/)
*   [字串操作 (String manipulation)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/)
*   [時間管理 (Time management)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)

要了解更多標準函式庫中的內容，請查閱其 [API 參考](https://kotlinlang.org/api/core/kotlin-stdlib/)。

## Kotlin 函式庫

標準函式庫涵蓋了許多常見的使用案例，但也有一些它沒有解決的問題。幸運的是，Kotlin 團隊和社群的其餘成員開發了各種函式庫來補充標準函式庫。例如，[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 幫助您跨不同平台管理時間。

您可以在我們的[搜尋平台](https://klibs.io/)上找到有用的函式庫。要使用它們，您需要採取額外的步驟，例如新增依賴或外掛程式。每個函式庫都有一個 GitHub 儲存庫，其中包含如何將其包含在您的 Kotlin 專案中的說明。

新增函式庫後，您可以匯入其中的任何套件。以下是如何匯入 `kotlinx-datetime` 套件以查詢紐約目前時間的範例：

```kotlin
import kotlinx.datetime.*

fun main() {
    val now = Clock.System.now() // Get current instant
    println("Current instant: $now")

    val zone = TimeZone.of("America/New_York")
    val localDateTime = now.toLocalDateTime(zone)
    println("Local date-time in NY: $localDateTime")
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-datetime"}

此範例：

*   匯入 `kotlinx.datetime` 套件。
*   使用 `Clock.System.now()` 函數建立 `Instant` 類別的實例，其中包含目前時間，並將結果指派給 `now` 變數。
*   列印目前時間。
*   使用 `TimeZone.of()` 函數查詢紐約的時區，並將結果指派給 `zone` 變數。
*   在包含目前時間的實例上呼叫 `.toLocalDateTime()` 函數，並以紐約時區作為引數。
*   將結果指派給 `localDateTime` 變數。
*   列印根據紐約時區調整過的時間。

> 要更詳細地探索此範例中使用的函數和類別，請參閱 [API 參考](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/)。
>
{style="tip"}

## 選擇啟用 API

函式庫作者可能會將某些 API 標記為在使用前需要選擇啟用 (opt-in)。他們通常在 API 仍在開發中且未來可能變更時執行此操作。如果您不選擇啟用，您會看到如下警告或錯誤：

```text
This declaration needs opt-in. Its usage should be marked with '@...' or '@OptIn(...)'
```

要選擇啟用，請撰寫 `@OptIn`，後跟括號，其中包含分類 API 的類別名稱，然後附加兩個冒號 `::` 和 `class`。

例如，標準函式庫中的 `uintArrayOf()` 函數屬於 `@ExperimentalUnsignedTypes`，如 [API 參考](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-u-int-array.html)所示：

```kotlin
@ExperimentalUnsignedTypes
inline fun uintArrayOf(vararg elements: UInt): UIntArray
```

在您的程式碼中，選擇啟用如下所示：

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
```

以下是一個範例，它選擇啟用 `uintArrayOf()` 函數來建立一個無符號整數陣列並修改其元素之一：

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
fun main() {
    // Create an unsigned integer array
    val unsignedArray: UIntArray = uintArrayOf(1u, 2u, 3u, 4u, 5u)

    // Modify an element
    unsignedArray[2] = 42u
    println("Updated array: ${unsignedArray.joinToString()}")
    // Updated array: 1, 2, 42, 4, 5
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-apis"}

這是最簡單的選擇啟用方式，但還有其他方式。要了解更多，請參閱 [選擇啟用要求 (Opt-in requirements)](opt-in-requirements.md)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-1"}

您正在開發一個金融應用程式，幫助使用者計算其投資的未來價值。計算複利的公式為：

<math>A = P \times (1 + \displaystyle\frac{r}{n})^{nt}</math>

其中：

*   `A` 是計息後累積的金額（本金 + 利息）。
*   `P` 是本金（初始投資）。
*   `r` 是年利率（小數）。
*   `n` 是每年複利次數。
*   `t` 是投資時間（以年為單位）。

更新程式碼以：

1.  從 [`kotlin.math` 套件](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/)匯入必要的函數。
2.  為 `calculateCompoundInterest()` 函數新增函數主體，計算應用複利後的最終金額。

|--|--|

```kotlin
// Write your code here

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    // Write your code here
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

您想測量程式中執行多個資料處理任務所需的時間。更新程式碼以新增正確的匯入語句和 [`kotlin.time`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/) 套件中的函數：

|---|---|

```kotlin
// Write your code here

fun main() {
    val timeTaken = /* Write your code here */ {
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

在最新的 Kotlin 發行版中，標準函式庫有一個新功能。您想試用它，但它需要選擇啟用。此功能屬於 [`@ExperimentalStdlibApi`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-experimental-stdlib-api/)。在您的程式碼中，選擇啟用應如何表示？

|---|---|
```kotlin
@OptIn(ExperimentalStdlibApi::class)
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-libraries-solution-3"}

## 接下來是什麼？

恭喜！您已完成進階教學！作為下一步，請查閱我們針對熱門 Kotlin 應用程式的教程：

*   [使用 Spring Boot 和 Kotlin 建立後端應用程式](jvm-create-project-with-spring-boot.md)
*   從頭開始建立 Android 和 iOS 的跨平台應用程式，並：
    *   [在保持原生 UI 的同時共享業務邏輯](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
    *   [共享業務邏輯和 UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)