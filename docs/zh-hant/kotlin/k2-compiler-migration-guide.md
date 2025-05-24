---
title: "K2 編譯器遷移指南"
---
隨著 Kotlin 語言和生態系統的不斷發展，Kotlin 編譯器也在不斷演進。第一步是引入新的 JVM 和 JS IR（中介表示法）後端，它們共享邏輯，簡化了不同平台上目標的程式碼生成。現在，其演進的下一個階段帶來了一個名為 K2 的新前端。

<img src="/img/k2-compiler-architecture.svg" alt="Kotlin K2 compiler architecture" width="700" style={{verticalAlign: 'middle'}}/>

隨著 K2 編譯器的到來，Kotlin 前端已被完全重寫，並具有一種新的、更有效率的架構。新編譯器帶來的根本性變化是使用一種包含更多語義資訊的統一資料結構。此前端負責執行語義分析（semantic analysis）、呼叫解析（call resolution）和類型推斷（type inference）。

新的架構和豐富的資料結構使 K2 編譯器能夠提供以下好處：

* **改進的呼叫解析和類型推斷**。編譯器的行為更加一致，並且可以更好地理解您的程式碼。
* **更易於為新語言功能引入語法糖（syntactic sugar）**。將來，當引入新功能時，您將能夠使用更簡潔、更易讀的程式碼。
* **更快的編譯時間**。編譯時間可以[顯著加快](#performance-improvements)。
* **增強的 IDE 效能**。如果在 IntelliJ IDEA 中啟用 K2 模式，則 IntelliJ IDEA 將使用 K2 編譯器前端來分析您的 Kotlin 程式碼，從而帶來穩定性和效能的提升。有關更多資訊，請參閱[IDE 中的支援](#support-in-ides)。

本指南：

* 說明了新的 K2 編譯器的優勢。
* 強調您在遷移期間可能遇到的變更，以及如何相應地調整您的程式碼。
* 描述了如何回退到先前的版本。

:::note
從 2.0.0 開始，預設情況下會啟用新的 K2 編譯器。有關 Kotlin 2.0.0 中提供的新功能以及新的 K2 編譯器的更多資訊，請參閱 [Kotlin 2.0.0 中的新增功能](whatsnew20)。

:::

## 效能改進

為了評估 K2 編譯器的效能，我們在兩個開源專案上執行了效能測試：[Anki-Android](https://github.com/ankidroid/Anki-Android) 和 [Exposed](https://github.com/JetBrains/Exposed)。以下是我們發現的主要效能改進：

* K2 編譯器帶來了高達 94% 的編譯速度提升。例如，在 Anki-Android 專案中，乾淨建置時間從 Kotlin 1.9.23 中的 57.7 秒減少到 Kotlin 2.0.0 中的 29.7 秒。
* 使用 K2 編譯器，初始化階段的速度提高了高達 488%。例如，在 Anki-Android 專案中，增量建置的初始化階段從 Kotlin 1.9.23 中的 0.126 秒縮短到 Kotlin 2.0.0 中的僅 0.022 秒。
* 與先前的編譯器相比，Kotlin K2 編譯器在分析階段的速度提高了高達 376%。例如，在 Anki-Android 專案中，增量建置的分析時間從 Kotlin 1.9.23 中的 0.581 秒大幅縮短到僅 0.122 秒（Kotlin 2.0.0）。

有關這些改進的更多詳細資訊，以及要了解有關我們如何分析 K2 編譯器效能的更多資訊，請參閱我們的[部落格文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)。

## 語言功能改進

Kotlin K2 編譯器改進了與 [Smart Casts](#smart-casts) 和 [Kotlin Multiplatform](#kotlin-multiplatform) 相關的語言功能。

### Smart Casts

在特定情況下，Kotlin 編譯器可以自動將物件轉換為某種類型，從而免去您自己明確指定它的麻煩。這稱為 [Smart Casts](typecasts#smart-casts)。Kotlin K2 編譯器現在可以在比以前更多的情況下執行 Smart Casts。

在 Kotlin 2.0.0 中，我們對以下領域的 Smart Casts 進行了改進：

* [區域變數和更遠的作用域](#local-variables-and-further-scopes)
* [使用邏輯 `or` 運算符的類型檢查](#type-checks-with-the-logical-or-operator)
* [Inline 函數](#inline-functions)
* [具有函數類型的屬性](#properties-with-function-types)
* [例外處理](#exception-handling)
* [遞增和遞減運算符](#increment-and-decrement-operators)

#### 區域變數和更遠的作用域

以前，如果在 `if` 條件中將變數評估為非 `null`，則會對該變數進行 Smart Cast。然後，有關此變數的資訊將在 `if` 區塊的作用域內進一步共享。

但是，如果您在 `if` 條件**之外**聲明變數，則在 `if` 條件內將無法使用有關該變數的任何資訊，因此無法對其進行 Smart Cast。在 `when` 表達式和 `while` 迴圈中也觀察到了這種行為。

從 Kotlin 2.0.0 開始，如果您在使用變數之前在 `if`、`when` 或 `while` 條件中聲明變數，則編譯器收集的有關該變數的任何資訊都將可在相應的區塊中使用，以進行 Smart Cast。

當您想要執行諸如將布林條件提取到變數中之類的操作時，這會很有用。然後，您可以為變數指定有意義的名稱，這將提高程式碼的可讀性，並使其可以在程式碼中稍後重複使用。例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // 在 Kotlin 2.0.0 中，編譯器可以存取
        // 關於 isCat 的資訊，因此它知道
        // animal 已 Smart Cast 為 Cat 類型。
        // 因此，可以呼叫 purr() 函數。
        // 在 Kotlin 1.9.20 中，編譯器不知道
        // 關於 Smart Cast 的資訊，因此呼叫 purr()
        // 函數會觸發錯誤。
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```

#### 使用邏輯 or 運算符的類型檢查

在 Kotlin 2.0.0 中，如果您將物件的類型檢查與 `or` 運算符 (`||`) 結合使用，則會對其最接近的共同超類型進行 Smart Cast。在此變更之前，始終會對 `Any` 類型進行 Smart Cast。

在這種情況下，您仍然必須在之後手動檢查物件類型，然後才能存取其任何屬性或呼叫其函數。例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 已 Smart Cast 為共同的超類型 Status
        signalStatus.signal()
        // 在 Kotlin 2.0.0 之前，signalStatus 已 Smart Cast
        // 為 Any 類型，因此呼叫 signal() 函數會觸發
        // Unresolved reference 錯誤。signal() 函數只能在
        // 另一個類型檢查之後成功呼叫：
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

:::note
共同的超類型是 [聯集類型](https://en.wikipedia.org/wiki/Union_type) 的**近似值**。Kotlin [目前不支援聯集類型](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。

:::

#### Inline 函數

在 Kotlin 2.0.0 中，K2 編譯器以不同的方式處理 inline 函數，從而使其能夠結合其他編譯器分析來確定 Smart Cast 是否安全。

具體來說，現在將 inline 函數視為具有隱式的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 合約（contract）。這表示傳遞給 inline 函數的任何 lambda 函數都會就地呼叫。由於 lambda 函數是就地呼叫的，因此編譯器知道 lambda 函數無法洩漏對其函數體中包含的任何變數的引用。

編譯器會使用此知識以及其他編譯器分析來決定 Smart Cast 任何捕獲的變數是否安全。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -
:::note
 Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 在 Kotlin 2.0.0 中，編譯器知道 processor
        // 是一個區域變數，而 inlineAction() 是一個 inline 函數，因此
        // 無法洩漏對 processor 的引用。因此，Smart Cast
        // processor 是安全的。
      
        // 如果 processor 不是 null，則會對 processor 進行 Smart Cast
        if (processor != null) {
            // 編譯器知道 processor 不是 null，因此不需要安全呼叫
            processor.process()

            // 在 Kotlin 1.9.20 中，您必須執行安全呼叫：
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 具有函數類型的屬性

在 Kotlin 的先前版本中，存在一個錯誤，這表示不會對具有函數類型的類別屬性進行 Smart Cast。我們在 Kotlin 2.0.0 和 K2 編譯器中修復了此行為。例如：

```kotlin
class Holder(val provider: (() `->` Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中，如果 provider 不是 null，
        // 則會對其進行 Smart Cast
        if (provider != null) {
            // 編譯器知道 provider 不是 null
            provider()

            // 在 1.9.20 中，編譯器不知道 provider 不是
            // null，因此會觸發錯誤：
            // Reference has a nullable type '(() `->` Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

如果您重載 `invoke` 運算符，此變更也適用。例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () `->` String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider() 
            // 在 1.9.20 中，編譯器會觸發錯誤：
            // Reference has a nullable type 'Provider?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 例外處理

在 Kotlin 2.0.0 中，我們對例外處理進行了改進，以便可以將 Smart Cast 資訊傳遞到 `catch` 和 `finally` 區塊。此變更使您的程式碼更安全，因為編譯器會追蹤您的物件是否具有可為 null 的類型。例如：

```kotlin

fun testString() {
    var stringInput: String? = null
    // stringInput 已 Smart Cast 為 String 類型
    stringInput = ""
    try {
        // 編譯器知道 stringInput 不是 null
        println(stringInput.length)
        // 0

        // 編譯器拒絕 stringInput 先前的 Smart Cast 資訊。現在 stringInput 具有 String? 類型。
        stringInput = null

        // 觸發例外
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 在 Kotlin 2.0.0 中，編譯器知道 stringInput
        // 可以為 null，因此 stringInput 保持可為 null。
        println(stringInput?.length)
        // null

        // 在 Kotlin 1.9.20 中，編譯器表示不需要安全呼叫，但這是錯誤的。
    }
}

fun main() {
    testString()
}
```

#### 遞增和遞減運算符

在 Kotlin 2.0.0 之前，編譯器不理解物件的類型在使用遞增或遞減運算符後可能會變更。由於編譯器無法準確追蹤物件類型，因此您的程式碼可能會導致無法解析的參考錯誤。在 Kotlin 2.0.0 中，此問題已修復：

```kotlin
interface Rho {
    operator fun inc(): Sigma = TODO()
}

interface Sigma : Rho {
    fun sigma() = Unit
}

interface Tau {
    fun tau() = Unit
}

fun main(input: Rho) {
    var unknownObject: Rho = input

    // 檢查 unknownObject 是否繼承自 Tau 介面
    // 請注意，unknownObject 可能同時繼承自
    // Rho 和 Tau 介面。
    if (unknownObject is Tau) {

        // 使用 Rho 介面中重載的 inc() 運算符。
        // 在 Kotlin 2.0.0 中，unknownObject 的類型已 Smart Cast 為
        // Sigma。
        ++unknownObject

        // 在 Kotlin 2.0.0 中，編譯器知道 unknownObject 具有類型
        // Sigma，因此可以成功呼叫 sigma() 函數。
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中，呼叫 inc() 時編譯器不會執行 Smart Cast，
        // 因此編譯器仍然認為 unknownObject 具有類型 Tau。呼叫 sigma() 函數
        // 會擲回編譯時錯誤。
        
        // 在 Kotlin 2.0.0 中，編譯器知道 unknownObject 具有類型
        // Sigma，因此呼叫 tau() 函數會擲回編譯時
        // 錯誤。
        unknownObject.tau()
        // Unresolved reference 'tau'

        // 在 Kotlin 1.9.20 中，由於編譯器錯誤地認為
        // unknownObject 具有類型 Tau，因此可以呼叫 tau() 函數，
        // 但它會擲回 ClassCastException。
    }
}
```

### Kotlin Multiplatform

K2 編譯器在以下領域對 Kotlin Multiplatform 進行了改進：

* [在編譯期間分離 common 和 platform 來源](#separation-of-common-and-platform-sources-during-compilation)
* [Expected 和 Actual 宣告的不同可見性層級](#different-visibility-levels-of-expected-and-actual-declarations)

#### 在編譯期間分離 common 和 platform 來源

以前，Kotlin 編譯器的設計使其無法在編譯時將 common 和 platform 來源集分開。因此，common 程式碼可以存取 platform 程式碼，這導致平台之間的行為不同。此外，common 程式碼中的某些編譯器設定和相依性過去會洩漏到 platform 程式碼中。

在 Kotlin 2.0.0 中，我們對新的 Kotlin K2 編譯器的實作包含對編譯方案的重新設計，以確保 common 和 platform 來源集之間嚴格分離。當您使用 [Expected 和 Actual 函數](multiplatform-expect-actual#expected-and-actual-functions) 時，此變更最為明顯。以前，common 程式碼中的函數呼叫可能會解析為 platform 程式碼中的函數。例如：
<table>
<tr>
<td>
Common 程式碼
</td>
<td>
Platform 程式碼
</td>
</tr>
<tr>
<td>

```kotlin
fun foo(x: Any) = println("common foo")

fun exampleFunction() {
    foo(42)
}
```
</td>
<td>

```kotlin
// JVM
fun foo(x: Int) = println("platform foo")

// JavaScript
// 在 JavaScript 平台上沒有 foo() 函數重載
```
</td>
</tr>
</table>

在此範例中，common 程式碼的行為取決於它在哪個平台上執行：

* 在 JVM 平台上，呼叫 common 程式碼中的 `foo()` 函數會導致呼叫 platform 程式碼中的 `foo()` 函數，如 `platform foo` 所示。
* 在 JavaScript 平台上，呼叫 common 程式碼中的 `foo()` 函數會導致呼叫 common 程式碼中的 `foo()` 函數，如 `common foo` 所示，因為 platform 程式碼中沒有此類函數可用。

在 Kotlin 2.0.0 中，common 程式碼無法存取 platform 程式碼，因此兩個平台都成功將 `foo()` 函數解析為 common 程式碼中的 `foo()` 函數：`common foo`。

除了改進跨平台行為的一致性之外，我們還努力修復 IntelliJ IDEA 或 Android Studio 與編譯器之間存在衝突行為的情況。例如，當您使用 [Expected 和 Actual 類別](multiplatform-expect-actual#expected-and-actual-classes) 時，會發生以下情況：
<table>
<tr>
<td>
Common 程式碼
</td>
<td>
Platform 程式碼
</td>
</tr>
<tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 在 2.0.0 之前，它會觸發僅限 IDE 的錯誤
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class Identity has no default constructor.
}
```
</td>
<td>

```kotlin
actual class Identity {
    actual fun confirmIdentity() = "expect class fun: jvm"
}
```
</td>
</tr>
</table>

在此範例中，Expected 類別 `Identity` 沒有預設建構函式，因此無法在 common 程式碼中成功呼叫它。以前，僅 IDE 報告錯誤，但程式碼仍然在 JVM 上成功編譯。但是，現在編譯器會正確報告錯誤：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 何時解析行為不會變更

我們仍在遷移到新的編譯方案，因此當您呼叫不在同一來源集中的函數時，解析行為仍然相同。當您在 common 程式碼中使用多平台程式庫中的重載時，您會主要注意到此差異。

假設您有一個程式庫，它有兩個具有不同簽名的 `whichFun()` 函數：

```kotlin
// 範例程式庫

// MODULE: common
fun whichFun(x: Any) = println("common function") 

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在 common 程式碼中呼叫 `whichFun()` 函數，則將解析程式庫中具有最相關引數類型的函數：

```kotlin
// 一個使用 JVM 目標的範例程式庫的專案

// MODULE: common
fun main(){
    whichFun(2) 
    // platform function
}
```

相比之下，如果您在同一來源集中宣告 `whichFun()` 的重載，則將解析 common 程式碼中的函數，因為您的程式碼無法存取平台特定的版本：

```kotlin
// 未使用範例程式庫

// MODULE: common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

與多平台程式庫類似，由於 `commonTest` 模組位於單獨的來源集中，因此它仍然可以存取平台特定的程式碼。因此，呼叫 `commonTest` 模組中函數的解析表現出與舊編譯方案中相同的行為。

將來，這些剩餘案例將與新的編譯方案更加一致。

#### Expected 和 Actual 宣告的不同可見性層級

在 Kotlin 2.0.0 之前，如果您在 Kotlin Multiplatform 專案中使用 [Expected 和 Actual 宣告](multiplatform-expect-actual)，則它們必須具有相同的 [可見性層級](visibility-modifiers)。Kotlin 2.0.0 現在也支援不同的可見性層級，但**僅**當 Actual 宣告比 Expected 宣告_更_寬鬆時。例如：

```kotlin
expect internal class Attribute // 可見性為 internal
actual class Attribute          // 預設情況下，可見性為 public，
                                // 這更寬鬆
```

同樣，如果您在 Actual 宣告中使用 [類型別名](type-aliases)，則**基礎類型**的可見性應與 Expected 宣告相同或更寬鬆。例如：

```kotlin
expect internal class Attribute                 // 可見性為 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 預設情況下，可見性為 public，
                                                // 這更寬鬆
```

## 如何啟用 Kotlin K2 編譯器

從 Kotlin 2.0.0 開始，預設情況下會啟用 Kotlin K2 編譯器。

若要升級 Kotlin 版本，請在您的 [Gradle](gradle-configure-project#apply-the-plugin) 和 [Maven](maven#configure-and-enable-the-plugin) 建置腳本中將其變更為 2.0.0 或更高版本。

若要在 IntelliJ IDEA 或 Android Studio 中獲得最佳體驗，請考慮在 IDE 中[啟用 K2 模式](#support-in-ides)。

### 將 Kotlin 建置報告與 Gradle 搭配使用

Kotlin [建置報告](gradle-compilation-and-caches#build-reports) 提供有關 Kotlin 編譯器任務在不同編譯階段花費的時間、使用的編譯器和 Kotlin 版本以及編譯是否為增量的資訊。這些建置報告對於評估您的建置效能很有用。與 [Gradle 建置掃描](https://scans.gradle.com/) 相比，它們可以更深入地了解 Kotlin 編譯管道，因為它們可以讓您全面了解所有 Gradle 任務的效能。

#### 如何啟用建置報告

若要啟用建置報告，請在您的 `gradle.properties` 檔案中宣告您想要將建置報告輸出儲存到的位置：

```none
kotlin.build.report.output=file
```

以下值及其組合可用於輸出：

| 選項 | 說明 |
|---|---|
| `file` | 將建置報告以人類可讀的格式儲存到本機檔案。預設情況下，它是 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 將建置報告以物件格式儲存到指定的本機檔案。 |
| `build_scan` | 將建置報告儲存到 [建置掃描](https://scans.gradle.com/) 的 `custom values` 區段中。請注意，Gradle Enterprise 外掛程式會限制自訂值的數量及其長度。在大型專案中，可能會遺失某些值。 |
| `http` | 使用 HTTP(S) 發佈建置報告。POST 方法以 JSON 格式傳送指標。您可以在 [Kotlin 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) 中查看已傳送資料的目前版本。您可以在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports) 中找到 HTTP 端點的範例 |
| `json` | 將建置報告以 JSON 格式儲存到本機檔案。在 `kotlin.build.report.json.directory` 中設定您的建置報告位置。預設情況下，它的名稱為 `${project_name}-build-<date-time>-<index>.json`。 |

有關建置報告可以實現的功能的更多資訊，請參閱 [建置報告](gradle-compilation-and-caches#build-reports)。

## IDE 中的支援

預設情況下，IntelliJ IDEA 和 Android Studio 2024.1 都使用先前的編譯器進行程式碼分析、程式碼完成、醒目提示和其他與 IDE 相關的功能。這是為了確保效能和穩定性，同時我們致力於整合新的 Kotlin K2 編譯器。

如果您想嘗試使用新的 Kotlin K2 編譯器來使用相同的功能，IntelliJ IDEA 和 Android Studio 2024.1 提供支援。若要啟用 K2 模式：

1. 在您的 IDE 中，前往 **Settings** | **Languages & Frameworks** | **Kotlin**。
2. 選取 **Enable K2 mode** 選項。

在我們的 [部落格](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/) 中了解有關 K2 模式的更多資訊。

:::note
我們計劃在 Kotlin 2.1.0 之後推出 [穩定](components-stability#stability-levels-explained) 語言功能。在此之前，您可以繼續使用先前的編譯器進行程式碼分析，並且您不會遇到由於無法識別的語言功能而導致的任何程式碼醒目提示問題。

:::

請務必注意，無論您在 IDE 中使用哪個編譯器進行程式碼分析，建置系統使用的編譯器都是**獨立的**，並且在您的建置腳本中單獨配置。如果您[在您的建置腳本中將 Kotlin 版本升級到 Kotlin 2.0.0](#how-to-enable-the-kotlin-k2-compiler)，則預設情況下，新的 K2 編譯器將僅由您的建置系統使用。

## 在 Kotlin Playground 中試用 Kotlin K2 編譯器

Kotlin Playground 支援 Kotlin 2.0.0 和更高版本。[看看吧！](https://pl.kotl.in/czuoQprce)

## 如何回退到先前的編譯器

若要在 Kotlin 2.0.0 和更高版本中使用先前的編譯器，請執行以下操作之一：

* 在您的 `build.gradle.kts` 檔案中，[將您的語言版本設定](gradle-compiler-options#example-of-setting-languageversion)為 `1.9`。

  或
* 使用以下編譯器選項：`-language-version 1.9`。

## 變更

隨著新前端的引入，Kotlin 編譯器經歷了多項變更。讓我們先重點介紹影響您程式碼的最重要的修改，說明已變更的內容並詳細說明接下來的最佳實務。如果您想了解更多資訊，我們已將這些變更整理到 [主題領域](#per-subject-area) 中，以方便您進一步閱讀。

本節重點介紹以下修改：

* [使用備份欄位立即初始化 open 屬性](#immediate-initialization-of-open-properties-with-backing-fields)
* [已棄用投影接收器上的合成設定器](#deprecated-synthetics-setter-on-a-projected-receiver)
* [禁止使用無法存取的泛型類型](#forbidden-use-of-inaccessible-generic-types)
* [Kotlin 屬性和具有相同名稱的 Java 欄位的一致解析順序](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
* [改進 Java 原始陣列的 Null 安全性](#improved-null-safety-for-java-primitive-arrays)
* [Expected 類別中 Abstract 成員的更嚴格規則](#stricter-rules-for-abstract-members-in-expected-classes)

### 使用備份欄位立即初始化 open 屬性

**變更了什麼？**

在 Kotlin 2.0 中，所有具有備份欄位的 `open` 屬性都必須立即初始化；否則，您會收到編譯錯誤。以前，只有 `open var` 屬性需要立即初始化，但現在這也擴展到具有備份欄位的 `open val` 屬性：

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // 從 Kotlin 2.0 開始出現錯誤，先前已成功編譯
        this.a = 1 //Error: open val must have initializer
        // 始終是一個錯誤
        this.b = 1 // Error: open var must have initializer
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

此變更使編譯器的行為更可預測。考慮一個範例，其中 `open val` 屬性被具有自訂設定器的 `var` 屬性覆寫。

如果使用自訂設定器，則延遲初始化可能會導致混淆，因為不清楚您是要初始化備份欄位還是要叫用設定器。過去，如果您想叫用設定器，則舊的編譯器無法保證設定器會初始化備份欄位。

**現在的最佳實務是什麼？**

我們鼓勵您始終使用備份欄位初始化 open 屬性，因為我們相信這種做法既更有效率又更不容易出錯。

但是，如果您不想立即初始化屬性，您可以：

* 使屬性成為 `final`。
* 使用允許延遲初始化的私有備份屬性。

有關更多資訊，請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-57555)。

### 已棄用投影接收器上的合成設定器

**變更了什麼？**

如果您使用 Java 類別的合成設定器來指派與類別的投影類型衝突的類型，則會觸發錯誤。

假設您有一個名為 `Container` 的 Java 類別，其中包含 `getFoo()` 和 `setFoo()` 方法：

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

如果您有以下 Kotlin 程式碼，其中 `Container` 類別的實例具有投影類型，則使用 `setFoo()` 方法始終會產生錯誤。但是，僅從 Kotlin 2.0.0 開始，合成 `foo` 屬性才會觸發錯誤：

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // 自 Kotlin 1.0 以來的錯誤

    // 合成設定器 `foo` 會解析為 `setFoo()` 方法
    starProjected.foo = sampleString
    // 自 Kotlin 2.0.0 以來的錯誤

    inProjected.setFoo(sampleString)
    // 自 Kotlin 1.0 以來的錯誤

    // 合成設定器 `foo` 會解析為 `setFoo()` 方法
    inProjected.foo = sampleString
    // 自 Kotlin 2.0.0 以來的錯誤
}
```

**現在的最佳實務是什麼？**

如果您看到此變更在您的程式碼中引入了錯誤，您可能希望重新考慮如何建構您的類型宣告。可能是您不需要使用類型投影，或者您可能需要從程式碼中移除任何指派。

有關更多資訊，請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-54309)。

### 禁止使用無法存取的泛型類型

**變更了什麼？**

由於我們的 K2 編譯器的新架構，我們已變更了處理無法存取的泛型類型的方式。一般而言，您不應在程式碼中依賴無法存取的泛型類型，因為這表示專案的建置配置中存在錯誤配置，從而阻止編譯器存取編譯所需的必要資訊。在 Kotlin 2.0.0 中，您無法使用無法存取的泛型類型來宣告或呼叫函數文字，也不能使用帶有無法存取的泛型類型引數的泛型類型。此限制可協助您避免程式碼中稍後的編譯器錯誤。

例如，假設您在一個模組中宣告了一個泛型類別：

```kotlin
// 模組 1
class Node<V>(val value: V)
```

如果您有另一個模組（模組 2），其中配置了對模組 1 的相依性，則您的程式碼可以存取 `Node<V>` 類別並將其用作函數類型中的類型：

```kotlin
// 模組 2
fun execute(func: (Node<Int>) `->` Unit) {}
// 函數成功編譯
```

但是，如果您的專案配置錯誤，例如您有第三個模組（模組 3）僅依賴模組 2，則在編譯第三個模組時，Kotlin 編譯器將無法存取**模組 1** 中的 `Node<V>` 類別。現在，模組 3 中使用 `Node<V>` 類型的任何 lambda 或匿名函數都會在 Kotlin 2.0.0 中觸發錯誤，從而避免了可避免的編譯器錯誤、崩潰和程式碼中稍後的執行階段例外：

```kotlin
// 模組 3
fun test() {
    // 在 Kotlin 2.0.0 中觸發錯誤，因為隱式
    // lambda 參數 (it) 的類型解析為 Node，而該類型無法存取
    execute {}

    // 在 Kotlin 2.0.0 中觸發錯誤，因為未使用的
    // lambda 參數 (_) 的類型解析為 Node，而該類型無法存取
    execute { _ `->` }

    // 在 Kotlin 2.0.0 中觸發錯誤，因為未使用的
    // 匿名函數參數 (_) 的類型解析為 Node，而該類型無法存取
    execute(fun (_) {})
}
```

除了函數文字在包含無法存取的泛型類型的 value 參數時觸發錯誤之外，當類型具有無法存取的泛型類型引數時，也會發生錯誤。

例如，您在模組 1 中具有相同的泛型類別宣告。在模組 2 中，您宣告另一個泛型類別：`Container<C>`。此外，您在模組 2 中宣告了使用帶有泛型類別 `Node<V>` 作為類型引數的 `Container<C>` 的函數：
<table>
<tr>
<td>
模組 1
</td>
</tr>
</table>