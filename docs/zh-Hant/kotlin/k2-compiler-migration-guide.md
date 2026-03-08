[//]: # (title: K2 編譯器遷移指南)

隨著 Kotlin 語言和生態系統的不斷演進，Kotlin 編譯器也在不斷發展。第一步是引入了新的 JVM 和 JS IR（中介表示法）後端，這些後端共享邏輯，簡化了針對不同平台目標的程式碼產生。現在，演進的下一個階段帶來了名為 K2 的新前端。

![Kotlin K2 編譯器架構](k2-compiler-architecture.svg){width=700}

隨著 K2 編譯器的到來，Kotlin 前端已被完全重寫，並具有新的、更高效的架構。新編譯器帶來的根本變化是使用了包含更多語義資訊的統一資料結構。此前端負責執行語義分析、呼叫解析和型別推論。

新的架構和豐富的資料結構使 K2 編譯器能夠提供以下優點：

* **改進的呼叫解析和型別推論**。編譯器的行為更加一致，並且能更好地理解您的程式碼。
* **更容易為新語言特性引入語法糖**。未來，當新功能引入時，您將能夠使用更簡潔、更具可讀性的程式碼。
* **更快的編譯時間**。編譯時間可以[顯著加快](#performance-improvements)。
* **增強的 IDE 效能**。IntelliJ IDEA 和 Android Studio 使用 K2 編譯器來分析您的 Kotlin 程式碼，提高了穩定性並提供了效能改進。如需了解更多資訊，請參閱 [IDE 支援](#support-in-ides)。

本指南：

* 解釋新 K2 編譯器的優點。
* 強調您在遷移過程中可能遇到的變更，以及如何相應地調整您的程式碼。
* 說明如何回復到先前的版本。

> 從 2.0.0 開始，新 K2 編譯器預設為啟用。有關 Kotlin 2.0.0 中提供的新功能以及新 K2 編譯器的更多資訊，請參閱 [Kotlin 2.0.0 的新功能](whatsnew20.md)。
>
{style="note"}

## 效能改進

為了評估 K2 編譯器的效能，我們對兩個開放原始碼專案進行了效能測試：[Anki-Android](https://github.com/ankidroid/Anki-Android) 和 [Exposed](https://github.com/JetBrains/Exposed)。以下是我們發現的關鍵效能改進：

* K2 編譯器帶來了高達 94 % 的編譯速度提升。例如，在 Anki-Android 專案中，乾淨建置時間從 Kotlin 1.9.23 中的 57.7 秒減少到 Kotlin 2.0.0 中的 29.7 秒。
* 使用 K2 編譯器，初始化階段的速度提高了高達 488 %。例如，在 Anki-Android 專案中，累加建置的初始化階段從 Kotlin 1.9.23 中的 0.126 秒縮短到 Kotlin 2.0.0 中的僅 0.022 秒。
* 與之前的編譯器相比，Kotlin K2 編譯器在分析階段的速度提高了高達 376 %。例如，在 Anki-Android 專案中，累加建置的分析時間從 Kotlin 1.9.23 中的 0.581 秒大幅縮減至 Kotlin 2.0.0 中的僅 0.122 秒。

有關這些改進的更多詳細資訊，以及進一步了解我們如何分析 K2 編譯器的效能，請參閱我們的[部落格文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)。

## 語言特性改進

Kotlin K2 編譯器改進了與[智慧轉換](#smart-casts)和 [Kotlin 多平台](#kotlin-multiplatform)相關的語言特性。

### 智慧轉換

Kotlin 編譯器可以在特定情況下自動將物件轉換為某種型別，省去您手動明確指定它的麻煩。這被稱為[智慧轉換](typecasts.md#smart-casts)。Kotlin K2 編譯器現在在比以前更多的情境中執行智慧轉換。

在 Kotlin 2.0.0 中，我們在以下領域對智慧轉換進行了改進：

* [區域變數和進一步的作用域](#local-variables-and-further-scopes)
* [使用邏輯 `or` 運算子的型別檢查](#type-checks-with-the-logical-or-operator)
* [內嵌函式](#inline-functions)
* [具有函式型別的屬性](#properties-with-function-types)
* [例外處理](#exception-handling)
* [遞增與遞減運算子](#increment-and-decrement-operators)

#### 區域變數 and 進一步的作用域

以前，如果一個變數在 `if` 條件內被評估為非 `null`，則該變數將被智慧轉換。有關此變數的資訊隨後將在 `if` 區塊的作用域內進一步共享。

然而，如果您在 `if` 條件**之外**宣告該變數，則在 `if` 條件內將無法獲得有關該變數的資訊，因此它無法被智慧轉換。這種行為在 `when` 運算式和 `while` 迴圈中也可以看到。

從 Kotlin 2.0.0 開始，如果您在 `if`、`when` 或 `while` 條件中使用變數之前宣告它，那麼編譯器收集的有關該變數的任何資訊都將在相應的區塊中可用於智慧轉換。

這在您想要執行諸如將布林條件擷取到變數中之類的操作時很有用。然後，您可以給變數起一個有意義的名稱，這將提高您的程式碼可讀性，並使稍後在程式碼中重複使用該變數成為可能。例如：

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
        // 有關 isCat 的資訊，因此它知道
        // animal 已被智慧轉換為 Cat 型別。
        // 因此，可以呼叫 purr() 函式。
        // 在 Kotlin 1.9.20 中，編譯器不知道
        // 智慧轉換，因此呼叫 purr()
        // 函式會觸發錯誤。
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-local-variables" validate="false"}

#### 使用邏輯 or 運算子的型別檢查

在 Kotlin 2.0.0 中，如果您使用 `or` 運算子 (`||`) 結合物件的型別檢查，則會將其智慧轉換為它們最接近的共同超型別（common supertype）。在此變更之前，智慧轉換總是轉換為 `Any` 型別。

在這種情況下，您仍然必須在之後手動檢查物件型別，然後才能存取其任何屬性或呼叫其函式。例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智慧轉換為共同超型別 Status
        signalStatus.signal()
        // 在 Kotlin 2.0.0 之前，signalStatus 被智慧轉換 
        // 為 Any 型別，因此呼叫 signal() 函式會觸發
        // Unresolved reference 錯誤。signal() 函式只能 
        // 在另一次型別檢查後成功呼叫：
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 共同超型別是[聯合型別](https://en.wikipedia.org/wiki/Union_type)的一個**近似值**。聯合型別[目前在 Kotlin 中不受支援](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

#### 內嵌函式

在 Kotlin 2.0.0 中，K2 編譯器對內嵌函式的處理方式不同，這使其能夠結合其他編譯器分析來判斷智慧轉換是否安全。

具體來說，內嵌函式現在被視為具有隱式的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 合約。這意味著傳遞給內嵌函式的任何 Lambda 函式都是在原地（in place）呼叫的。由於 Lambda 函式是在原地呼叫的，編譯器知道 Lambda 函式不會洩漏對其函式主體內包含的任何變數的參照。

編譯器利用這項知識連同其他編譯器分析，來決定智慧轉換任何擷取的變數是否安全。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 在 Kotlin 2.0.0 中，編譯器知道 processor 
        // 是一個區域變數，且 inlineAction() 是一個內嵌函式，因此 
        // 對 processor 的參照不會洩漏。因此，可以安全地 
        // 對 processor 進行智慧轉換。
      
        // 如果 processor 不為 null，則 processor 被智慧轉換
        if (processor != null) {
            // 編譯器知道 processor 不為 null，因此不需要安全呼叫 
            processor.process()

            // 在 Kotlin 1.9.20 中，您必須執行安全呼叫：
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 具有函式型別的屬性

在舊版本的 Kotlin 中存在一個錯誤，這意味著具有函式型別的類別屬性不會被智慧轉換。我們在 Kotlin 2.0.0 和 K2 編譯器中修正了這種行為。例如：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中，如果 provider 不為 null，
        // 它會被智慧轉換
        if (provider != null) {
            // 編譯器知道 provider 不為 null
            provider()

            // 在 1.9.20 中，編譯器不知道 provider 不為 
            // null，因此它會觸發錯誤：
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

如果您多載了 `invoke` 運算子，此變更同樣適用。例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

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

在 Kotlin 2.0.0 中，我們對例外處理進行了改進，以便智慧轉換資訊可以傳遞給 `catch` 和 `finally` 區塊。此項變更使您的程式碼更安全，因為編譯器會持續追蹤您的物件是否具有可 null 型別。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput 被智慧轉換為 String 型別
    stringInput = ""
    try {
        // 編譯器知道 stringInput 不為 null
        println(stringInput.length)
        // 0

        // 編譯器拒絕先前有關 stringInput 的智慧轉換資訊。
        // 現在 stringInput 具有 String? 型別。
        stringInput = null

        // 觸發一個例外
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 在 Kotlin 2.0.0 中，編譯器知道 stringInput 
        // 可能為 null，因此 stringInput 保持為可 null。
        println(stringInput?.length)
        // null

        // 在 Kotlin 1.9.20 中，編譯器會說不需要安全呼叫，
        // 但這是不正確的。
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 遞增與遞減運算子

在 Kotlin 2.0.0 之前，編譯器無法理解在使用了遞增或遞減運算子後，物件的型別可能會發生變化。由於編譯器無法準確追蹤物件型別，您的程式碼可能會導致無法解析的參照錯誤。在 Kotlin 2.0.0 中，這已得到修正：

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
    // 注意，unknownObject 有可能同時繼承自
    // Rho 和 Tau 介面。
    if (unknownObject is Tau) {

        // 使用來自介面 Rho 的多載 inc() 運算子。
        // 在 Kotlin 2.0.0 中，unknownObject 的型別被智慧轉換為
        // Sigma。
        ++unknownObject

        // 在 Kotlin 2.0.0 中，編譯器知道 unknownObject 具有型別
        // Sigma，因此可以成功呼叫 sigma() 函式。
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中，編譯器在呼叫 inc() 時
        // 不會執行智慧轉換，因此編譯器仍然認為 
        // unknownObject 具有型別 Tau。呼叫 sigma() 函式 
        // 會拋出編譯時期錯誤。
        
        // 在 Kotlin 2.0.0 中，編譯器知道 unknownObject 具有型別
        // Sigma，因此呼叫 tau() 函式會拋出編譯時期 
        // 錯誤。
        unknownObject.tau()
        // Unresolved reference 'tau'

        // 在 Kotlin 1.9.20 中，由於編譯器誤以為 
        // unknownObject 具有型別 Tau，因此可以呼叫 tau() 函式，
        // 但它會拋出 ClassCastException。
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin 多平台

K2 編譯器在 Kotlin 多平台相關領域有以下改進：

* [編譯期間通用原始碼與平台原始碼的分離](#separation-of-common-and-platform-sources-during-compilation)
* [預期宣告和實際宣告的不同可見性層級](#different-visibility-levels-of-expected-and-actual-declarations)

#### 編譯期間通用原始碼與平台原始碼的分離

以前，Kotlin 編譯器的設計使其無法在編譯時將通用原始碼集和平台原始碼集分開。因此，通用程式碼可以存取平台程式碼，這導致了平台之間的行為差異。此外，來自通用程式碼的一些編譯器設定和相依性過去會洩漏到平台程式碼中。

在 Kotlin 2.0.0 中，我們對新 Kotlin K2 編譯器的實作包含了對編譯方案的重新設計，以確保通用原始碼集和平台原始碼集之間的嚴格分離。當您使用[預期函式和實際函式](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html#expected-and-actual-functions)時，這種變化最為明顯。以前，通用程式碼中的函式呼叫有可能解析為平台程式碼中的函式。例如：

<table>
   <tr>
       <td>通用程式碼</td>
       <td>平台程式碼</td>
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
// JavaScript 平台上沒有 foo() 函式多載
```

</td>
</tr>
</table>

在這個例子中，通用程式碼根據運行的平台而有不同的行為：

* 在 JVM 平台上，在通用程式碼中呼叫 `foo()` 函式會導致呼叫平台程式碼中的 `foo()` 函式，輸出為 `platform foo`。
* 在 JavaScript 平台上，在通用程式碼中呼叫 `foo()` 函式會導致呼叫通用程式碼中的 `foo()` 函式，輸出為 `common foo`，因為平台程式碼中沒有這樣的函式。

在 Kotlin 2.0.0 中，通用程式碼無法存取 platform 程式碼，因此兩個平台都會成功將 `foo()` 函式解析為通用程式碼中的 `foo()` 函式：`common foo`。

除了改進跨平台行為的一致性外，我們還努力修正了 IntelliJ IDEA 或 Android Studio 與編譯器之間行為衝突的情況。例如，當您使用[預期類別和實際類別](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html#expected-and-actual-classes)時，會發生以下情況：

<table>
   <tr>
       <td>通用程式碼</td>
       <td>平台程式碼</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 在 2.0.0 之前，它會觸發一個僅限 IDE 的錯誤
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

在這個例子中，預期類別 `Identity` 沒有預設建構函式，因此無法在通用程式碼中成功呼叫。以前，只有 IDE 會回報錯誤，但在 JVM 上程式碼仍能成功編譯。然而，現在編譯器會正確回報錯誤：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解析行為何時不變

我們仍在遷移到新編譯方案的過程中，因此當您呼叫不在同一個原始碼集中的函式時，解析行為仍然相同。您主要會在通用程式碼中使用來自多平台程式庫的多載時注意到這種差異。

假設您有一個程式庫，其中有兩個具有不同簽章的 `whichFun()` 函式：

```kotlin
// 範例程式庫

// 模組：通用
fun whichFun(x: Any) = println("common function") 

// 模組：JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在通用程式碼中呼叫 `whichFun()` 函式，則會解析程式庫中具有最相關引數型別的函式：

```kotlin
// 一個針對 JVM 目標使用範例程式庫的專案

// 模組：通用
fun main(){
    whichFun(2) 
    // platform function
}
```

相較之下，如果您在同一個原始碼集中宣告 `whichFun()` 的多載，則會解析來自通用程式碼的函式，因為您的程式碼無法存取平台特定的版本：

```kotlin
// 未使用範例程式庫

// 模組：通用
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// 模組：JVM
fun whichFun(x: Int) = println("platform function")
```

與多平台程式庫類似，由於 `commonTest` 模組位於獨立的原始碼集中，它仍然可以存取平台特定的程式碼。因此，對 `commonTest` 模組中函式的呼叫解析表現出與舊編譯方案相同的行為。

未來，這些剩餘的情況將與新的編譯方案更加一致。

#### 預期宣告和實際宣告的不同可見性層級

在 Kotlin 2.0.0 之前，如果您在 Kotlin 多平台專案中使用[預期宣告和實際宣告](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)，它們必須具有相同的[可見性層級](visibility-modifiers.md)。Kotlin 2.0.0 現在也支援不同的可見性層級，但**僅當**實際宣告比預期宣告更具開放性時。例如：

```kotlin
expect internal class Attribute // 可見性為 internal
actual class Attribute          // 預設可見性為 public，
                                // 這更具開放性
```

同樣地，如果您在實際宣告中使用[型別別名](type-aliases.md)，則**底層型別**的可見性應與預期宣告相同或更具開放性。例如：

```kotlin
expect internal class Attribute                 // 可見性為 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 預設可見性為 public，
                                                // 這更具開放性
```

## 如何啟用 Kotlin K2 編譯器

從 Kotlin 2.0.0 開始，Kotlin K2 編譯器預設為啟用。

要升級 Kotlin 版本，請在您的 [Gradle](gradle-configure-project.md#apply-the-plugin) 和 [Maven](maven-configure-project.md#enable-and-configure-the-plugin) 組建指令碼中將其更改為 2.0.0 或更高版本。

### 在 Gradle 中使用 Kotlin 建置報告

Kotlin [建置報告](gradle-compilation-and-caches.md#build-reports)提供有關 Kotlin 編譯器任務在不同編譯階段所花費時間的資訊，以及使用了哪個編譯器和 Kotlin 版本，以及編譯是否為累加式。這些建置報告對於評估您的建置效能非常有用。它們提供比 [Gradle build scans](https://scans.gradle.com/) 更多的 Kotlin 編譯管線洞察，因為它們讓您能全面了解所有 Gradle 任務的效能。

#### 如何啟用建置報告

要啟用建置報告，請在您的 `gradle.properties` 檔案中宣告您想要儲存建置報告輸出的位置：

```none
kotlin.build.report.output=file
```

輸出的可用值及其組合如下：

| 選項 | 描述 |
|---|---|
| `file` | 以人類可讀的格式將建置報告儲存到本機檔案。預設為 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 以物件格式將建置報告儲存到指定的本機檔案。 |
| `build_scan` | 將建置報告儲存在 [build scan](https://scans.gradle.com/) 的 `custom values` 區塊中。請注意，Gradle Enterprise 外掛程式限制了自訂值的數量及其長度。在大型專案中，某些值可能會丟失。 |
| `http` | 使用 HTTP(S) 發送建置報告。POST 方法以 JSON 格式發送指標。您可以在 [Kotlin 存儲庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)中查看發送資料的當前版本。您可以在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)中找到 HTTP 端點的範例。 |
| `json` | 以 JSON 格式將建置報告儲存到本機檔案。在 `kotlin.build.report.json.directory` 中設定建置報告的位置。預設名稱為 `${project_name}-build-<date-time>-<index>.json`。 |

有關建置報告功能的更多資訊，請參閱[建置報告](gradle-compilation-and-caches.md#build-reports)。

## IDE 支援

IntelliJ IDEA 和 Android Studio 均完全支援 K2 編譯器，並預設使用它來改進程式碼分析、程式碼補全和醒目提示。
您無需進行任何配置。升級到最新版本即可體驗其優點。

## 在 Kotlin Playground 中嘗試 Kotlin K2 編譯器

Kotlin Playground 支援 Kotlin 2.0.0 及更高版本。[快來看看吧！](https://pl.kotl.in/czuoQprce)

## 如何回復到先前的編譯器

要在 Kotlin 2.0.0 及更高版本中使用先前的編譯器，可以：

* 在您的 `build.gradle.kts` 檔案中，[將您的語言版本設定](gradle-compiler-options.md#example-of-setting-languageversion)為 `1.9`。

  或者
* 使用以下編譯器選項：`-language-version 1.9`。

## 變更

隨著新前端的引入，Kotlin 編譯器經歷了幾項變化。讓我們先強調影響您程式碼的最重要修改，解釋發生了什麼變化，並詳細說明未來的最佳實務。如果您想了解更多資訊，我們已將這些變更整理到[各個主題領域](#per-subject-area)中，以方便您進一步閱讀。

本節強調以下修改：

* [具有支援欄位的 open 屬性的立即初始化](#immediate-initialization-of-open-properties-with-backing-fields)
* [已棄用在投影接收器上的合成 setter](#deprecated-synthetics-setter-on-a-projected-receiver)
* [禁止使用無法存取的泛型型別](#forbidden-use-of-inaccessible-generic-types)
* [同名 Kotlin 屬性和 Java 欄位的一致解析順序](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
* [改進 Java 基本型別陣列的 null 安全性](#improved-null-safety-for-java-primitive-arrays)
* [預期類別中抽象成員的更嚴格規則](#stricter-rules-for-abstract-members-in-expected-classes)

### 具有支援欄位的 open 屬性的立即初始化

**發生了什麼變化？**

在 Kotlin 2.0 中，所有具有支援欄位的 `open` 屬性必須立即初始化；否則，您將收到編譯錯誤。以前，只有 `open var` 屬性需要立即初始化，但現在這也擴展到具有支援欄位的 `open val` 屬性：

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // 從 Kotlin 2.0 開始會發生錯誤，而早期可以成功編譯 
        this.a = 1 // 錯誤：open val 必須有初始設定式
        // 始終是一個錯誤
        this.b = 1 // 錯誤：open var 必須有初始設定式
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

這項變化使編譯器的行為更加可預測。考慮一個例子，其中 `open val` 屬性被具有自訂 setter 的 `var` 屬性覆寫。

如果使用自訂 setter，延遲初始化可能會導致混淆，因為不清楚您是要初始化支援欄位還是要呼叫 setter。過去，如果您想呼叫 setter，舊編譯器無法保證 setter 隨後會初始化支援欄位。

**現在的最佳實務是什麼？**

我們鼓勵您始終初始化具有支援欄位的 open 屬性，因為我們相信這種做法既更高效又更不容易出錯。

但是，如果您不想立即初始化屬性，您可以：

* 將屬性設為 `final`。
* 使用允許延遲初始化的私有支援屬性。

如需了解更多資訊，請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-57555)。

### 已棄用在投影接收器上的合成 setter

**發生了什麼變化？**

如果您使用 Java 類別的合成 setter 來指派一個與該類別的投影型別衝突的型別，則會觸發錯誤。

假設您有一個名為 `Container` 的 Java 類別，其中包含 `getFoo()` 和 `setFoo()` 方法：

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

如果您有以下 Kotlin 程式碼，其中 `Container` 類別的執行個體具有投影型別，則使用 `setFoo()` 方法將始終產生錯誤。但是，只有從 Kotlin 2.0.0 開始，合成的 `foo` 屬性才會觸發錯誤：

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // 自 Kotlin 1.0 起的錯誤

    // 合成 setter `foo` 被解析為 `setFoo()` 方法
    starProjected.foo = sampleString
    // 自 Kotlin 2.0.0 起的錯誤

    inProjected.setFoo(sampleString)
    // 自 Kotlin 1.0 起的錯誤

    // 合成 setter `foo` 被解析為 `setFoo()` 方法
    inProjected.foo = sampleString
    // 自 Kotlin 2.0.0 起的錯誤
}
```

**現在的最佳實務是什麼？**

如果您發現這項變化在您的程式碼中引入了錯誤，您可能需要重新考慮如何建構您的型別宣告。可能是您不需要使用型別投影，或者您需要從程式碼中移除任何指派操作。

如需了解更多資訊，請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-54309)。

### 禁止使用無法存取的泛型型別

**發生了什麼變化？**

由於我們 K2 編譯器的新架構，我們更改了處理無法存取的泛型型別的方式。通常，您絕不應該在程式碼中依賴無法存取的泛型型別，因為這表示您的專案組建組態中存在誤配置，導致編譯器無法存取編譯所需的必要資訊。在 Kotlin 2.0.0 中，您不能宣告或呼叫具有無法存取之泛型型別的函式常值，也不能使用具有無法存取之泛型型別引數的泛型型別。此限制可協助您避免稍後在程式碼中發生編譯器錯誤。

例如，假設您在一個模組中宣告了一個泛型類別：

```kotlin
// 模組 1
class Node<V>(val value: V)
```

如果您有另一個模組（模組 2），且其對模組 1 配置了相依性，您的程式碼可以存取 `Node<V>` 類別並將其作為函式型別中的型別：

```kotlin
// 模組 2
fun execute(func: (Node<Int>) -> Unit) {}
// 函式成功編譯
```

但是，如果您的專案配置有誤，例如您有第三個模組（模組 3）僅依賴於模組 2，那麼 Kotlin 編譯器在編譯第三個模組時將無法存取**模組 1** 中的 `Node<V>` 類別。現在，在模組 3 中使用 `Node<V>` 型別的任何 Lambda 或匿名函式都會在 Kotlin 2.0.0 中觸發錯誤，從而防止稍後在程式碼中發生可避免的編譯器錯誤、當機和執行時期例外：

```kotlin
// 模組 3
fun test() {
    // 在 Kotlin 2.0.0 中觸發錯誤，因為隱式 
    // Lambda 參數 (it) 的型別解析為 Node，這是無法存取的
    execute {}

    // 在 Kotlin 2.0.0 中觸發錯誤，因為未使用的 
    // Lambda 參數 (_) 的型別解析為 Node，這是無法存取的
    execute { _ -> }

    // 在 Kotlin 2.0.0 中觸發錯誤，因為未使用的
    // 匿名函式參數 (_) 的型別解析為 Node，這是無法存取的
    execute(fun (_) {})
}
```

除了函式常值在包含無法存取的泛型型別的值參數時會觸發錯誤外，當一個型別具有無法存取的泛型型別引數時也會發生錯誤。

例如，您在模組 1 中有相同的泛型類別宣告。在模組 2 中，您宣告了另一個泛型類別：`Container<C>`。此外，您在模組 2 中宣告了使用 `Container<C>` 並將泛型類別 `Node<V>` 作為型別引數的函式：

<table>
   <tr>
       <td>模組 1</td>
       <td>模組 2</td>
   </tr>
   <tr>
<td>

```kotlin
// 模組 1
class Node<V>(val value: V)
```

</td>
<td>

```kotlin
// 模組 2
class Container<C>(vararg val content: C)

// 具有泛型類別型別
// 且具有泛型類別型別引數的函式
fun produce(): Container<Node<Int>> = Container(Node(42))
fun consume(arg: Container<Node<Int>>) {}
```

</td>
</tr>
</table>

如果您嘗試在模組 3 中呼叫這些函式，Kotlin 2.0.0 會觸發錯誤，因為從模組 3 無法存取泛型類別 `Node<V>`：

```kotlin
// 模組 3
fun test() {
    // 在 Kotlin 2.0.0 中觸發錯誤，因為泛型類別 Node<V> 
    // 無法存取
    consume(produce())
}
```

在未來的版本中，我們將繼續棄用一般情況下對無法存取型別的使用。我們已經在 Kotlin 2.0.0 中開始針對某些具有無法存取型別（包括非泛型型別）的情境加入警告。

例如，讓我們使用與先前範例相同的模組設置，但將泛型類別 `Node<V>` 更改為非泛型類別 `IntNode`，且所有函式都在模組 2 中宣告：

<table>
   <tr>
       <td>模組 1</td>
       <td>模組 2</td>
   </tr>
   <tr>
<td>

```kotlin
// 模組 1
class IntNode(val value: Int)
```

</td>
<td>

```kotlin
// 模組 2
// 一個包含具有 `IntNode` 型別的 Lambda 
// 參數的函式
fun execute(func: (IntNode) -> Unit) {}

class Container<C>(vararg val content: C)

// 具有泛型類別型別
// 且將 `IntNode` 作為型別引數的函式
fun produce(): Container<IntNode> = Container(IntNode(42))
fun consume(arg: Container<IntNode>) {}
```

</td>
</tr>
</table>

如果您在模組 3 中呼叫這些函式，會觸發一些警告：

```kotlin
// 模組 3
fun test() {
    // 在 Kotlin 2.0.0 中觸發警告，因為 IntNode 類別 
    // 無法存取。

    execute {}
    // 參數 'it' 的類別 'IntNode' 無法存取。

    execute { _ -> }
    execute(fun (_) {})
    // 參數 '_' 的類別 'IntNode' 無會存取。

    // 在未來的 Kotlin 版本中將會觸發警告，因為 IntNode 
    // 無法存取。
    consume(produce())
}
```

**現在的最佳實務是什麼？**

如果您遇到有關無法存取的泛型型別的新警告，極有可能是您的建置系統配置有問題。我們建議檢查您的組建指令碼和配置。

作為最後手段，您可以為模組 3 配置對模組 1 的直接相依性。或者，您可以修改程式碼以使這些型別在同一個模組內可存取。

如需了解更多資訊，請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-64474)。

### 同名 Kotlin 屬性和 Java 欄位的一致解析順序

**發生了什麼變化？**

在 Kotlin 2.0.0 之前，如果您使用的 Java 和 Kotlin 類別彼此繼承，且包含同名的 Kotlin 屬性和 Java 欄位，則該重複名稱的解析行為是不一致的。IntelliJ IDEA 與編譯器之間也存在行為衝突。在為 Kotlin 2.0.0 開發新的解析行為時，我們的目標是將對使用者的影響降至最低。

例如，假設有一個 Java 類別 `Base`：

```java
public class Base {
    public String a = "a";

    public String b = "b";
}
```

假設還有一個繼承自上述 `Base` 類別的 Kotlin 類別 `Derived`：

```kotlin
class Derived : Base() {
    val a = "aa"

    // 宣告自訂 get() 函式
    val b get() = "bb"
}

fun main() {
    // 解析為 Derived.a
    println(a)
    // aa

    // 解析為 Base.b
    println(b)
    // b
}
```

在 Kotlin 2.0.0 之前，`a` 解析為 `Derived` Kotlin 類別中的 Kotlin 屬性，而 `b` 解析為 `Base` Java 類別中的 Java 欄位。

在 Kotlin 2.0.0 中，範例中的解析行為是一致的，確保 Kotlin 屬性優先於同名的 Java 欄位。現在，`b` 解析為：`Derived.b`。

> 在 Kotlin 2.0.0 之前，如果您使用 IntelliJ IDEA 前往 `a` 的宣告或用法，它會錯誤地導覽到 Java 欄位，而它本應導覽到 Kotlin 屬性。
> 
> 從 Kotlin 2.0.0 開始，IntelliJ IDEA 會正確導覽到與編譯器相同的位置。
>
{style="note"}

一般規則是子類別具有優先權。前面的範例證明了這一點，因為 `Derived` 類別中的 Kotlin 屬性 `a` 被解析，這是因為 `Derived` 是 `Base` Java 類別的子類別。

如果繼承關係反轉，Java 類別繼承自 Kotlin 類別，則子類別中的 Java 欄位優先於同名的 Kotlin 屬性。

考慮這個例子：

<table>
   <tr>
       <td>Kotlin</td>
       <td>Java</td>
   </tr>
   <tr>
<td>

```kotlin
open class Base {
    val a = "aa"
}
```

</td>
<td>

```java
public class Derived extends Base {
    public String a = "a";
}
```

</td>
</tr>
</table>

現在在以下程式碼中：

```kotlin
fun main() {
    // 解析為 Derived.a
    println(a)
    // a
}
```

**現在的最佳實務是什麼？**

如果此項變更影響了您的程式碼，請考慮您是否真的需要使用重複的名稱。如果您希望 Java 或 Kotlin 類別各自包含同名的欄位或屬性，且彼此繼承，請記住子類別中的欄位或屬性將具有優先權。

如需了解更多資訊，請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-55017)。

### 改進 Java 基本型別陣列的 null 安全性

**發生了什麼變化？**

從 Kotlin 2.0.0 開始，編譯器可以正確推論匯入到 Kotlin 的 Java 基本型別陣列的可 null 性。現在，它會保留與 Java 基本型別陣列搭配使用的 `TYPE_USE` 註解中的原生可 null 性，並在未根據註解使用其值時發出錯誤。

通常，當從 Kotlin 呼叫帶有 `@Nullable` 和 `@NotNull` 註解的 Java 型別時，它們會獲得適當的原生可 null 性：

```java
interface DataService {
    @NotNull ResultContainer<@Nullable String> fetchData();
}
```
```kotlin
val dataService: DataService = ... 
dataService.fetchData() // -> ResultContainer<String?>
```

然而，以前當 Java 基本型別陣列被匯入到 Kotlin 時，所有的 `TYPE_USE` 註解都會丟失，導致平台可 null 性並可能產生不安全的程式碼：

```java
interface DataProvider {
    int @Nullable [] fetchData();
}
```

```kotlin
val dataService: DataProvider = ...
dataService.fetchData() // -> IntArray .. IntArray?
// 雖然根據註解，`dataService.fetchData()` 可能為 `null`，但沒有報錯
// 這可能會導致 NullPointerException
dataService.fetchData()[0]
```
請注意，此問題從未影響宣告本身的可 null 性註解，僅影響 `TYPE_USE` 註解。

**現在的最佳實務是什麼？**

在 Kotlin 2.0.0 中，Java 基本型別陣列的 null 安全性現在在 Kotlin 中已成為標準，因此如果您使用它們，請檢查您的程式碼中是否有新的警告和錯誤：

* 任何使用 `@Nullable` Java 基本型別陣列而沒有進行明確 null 檢查，或嘗試將 `null` 傳遞給期望非 null 基本型別陣列的 Java 方法的程式碼，現在都將無法編譯。
* 對具有 `@NotNull` 的基本型別陣列使用 null 檢查，現在會發出「不必要的安全呼叫」或「與 null 比較始終為 false」警告。

如需了解更多資訊，請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-54521)。

### 預期類別中抽象成員的更嚴格規則

> 預期類別和實際類別處於 [Beta](components-stability.md#stability-levels-explained) 階段。
> 它們幾乎已經穩定，但未來您可能需要執行遷移步驟。
> 我們將盡力減少您需要做的進一步變更。
>
{style="warning"}

**發生了什麼變化？**

由於 K2 編譯器在編譯期間對通用原始碼與平台原始碼進行了分離，我們對預期類別中的抽象成員實施了更嚴格的規則。

使用以前的編譯器，預期的非抽象類別有可能在不[覆寫函式](inheritance.md#overriding-rules)的情況下繼承抽象函式。由於編譯器可以同時存取通用程式碼和平台程式碼，編譯器可以查看抽象函式在實際類別中是否有對應的覆寫和定義。

既然通用原始碼和平台原始碼是分開編譯的，繼承的函式必須在預期類別中明確覆寫，以便編譯器知道該函式不是抽象的。否則，編譯器會回報 `ABSTRACT_MEMBER_NOT_IMPLEMENTED` 錯誤。

例如，假設您有一個通用原始碼集，其中宣告了一個名為 `FileSystem` 的抽象類別，該類別具有一個抽象函式 `listFiles()`。您在平台原始碼集中將 `listFiles()` 函式定義為實際宣告的一部分。

在您的通用程式碼中，如果您有一個名為 `PlatformFileSystem` 的預期非抽象類別繼承自 `FileSystem` 類別，則 `PlatformFileSystem` 類別繼承了抽象函式 `listFiles()`。但是，在 Kotlin 中，您不能在非抽象類別中擁有抽象函式。要使 `listFiles()` 函式成為非抽象函式，您必須將其宣告為覆寫，且不使用 `abstract` 關鍵字：

<table>
   <tr>
       <td>通用程式碼</td>
       <td>平台程式碼</td>
   </tr>
   <tr>
<td>

```kotlin
abstract class FileSystem {
    abstract fun listFiles()
}
expect open class PlatformFileSystem() : FileSystem {
    // 在 Kotlin 2.0.0 中，需要明確覆寫
    expect override fun listFiles()
    // 在 Kotlin 2.0.0 之前，不需要覆寫
}
```

</td>
<td>

```kotlin
actual open class PlatformFileSystem : FileSystem {
    actual override fun listFiles() {}
}
```

</td>
</tr>
</table>

**現在的最佳實務是什麼？**

如果您在預期的非抽象類別中繼承了抽象函式，請新增非抽象覆寫。

如需了解更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-59739/K2-MPP-reports-ABSTRACTMEMBERNOTIMPLEMENTED-for-inheritor-in-common-code-when-the-implementation-is-located-in-the-actual) 中的相應問題。

### 各主題領域

這些主題領域列出了不太可能影響您程式碼的變更，但提供了指向相關 YouTrack 問題的連結以供進一步閱讀。Issue ID 旁邊標有星號 (*) 的變更已在本節開頭進行了解釋。

#### 型別推論 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-64189](https://youtrack.jetbrains.com/issue/KT-64189) | 如果型別是明確指定的 Normal，屬性參照的編譯函式簽章中型別不正確 |
| [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986) | 在 builder 推論上下文中禁止隱式將型別變數推論為上限值 |
| [KT-59275](https://youtrack.jetbrains.com/issue/KT-59275) | K2：要求陣列常值中的泛型註解呼叫具有明確的型別引數 |
| [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752) | 遺漏了交叉型別（intersection type）的子型別檢查 |
| [KT-59138](https://youtrack.jetbrains.com/issue/KT-59138) | 更改 Kotlin 中基於 Java 型別參數之型別的預設表示方式 |
| [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178) | 將前綴遞增的推論型別改為傳回 getter 的傳回型別，而非 inc() 運算子的傳回型別 |
| [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609) | K2：停止對反變（contravariant）參數依賴 @UnsafeVariance 的使用 |
| [KT-57620](https://youtrack.jetbrains.com/issue/KT-57620) | K2：禁止對原始型別（raw types）解析為被包含（subsumed）的成員 |
| [KT-64641](https://youtrack.jetbrains.com/issue/KT-64641) | K2：正確推論具有擴充函式參數的可呼叫物件之可呼叫參照型別 |
| [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011) | 指定時，使解構變數的實際型別與明確型別一致 |
| [KT-38895](https://youtrack.jetbrains.com/issue/KT-38895) | K2：修正整數常值溢位時行為不一致的問題 |
| [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862) | 匿名型別可以從型別引數的匿名函式中公開 |
| [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379) | 帶有 break 的 while 迴圈條件可能會產生不健全的智慧轉換 |
| [KT-62507](https://youtrack.jetbrains.com/issue/KT-62507) | K2：禁止在通用程式碼中對 expect/actual 頂層屬性進行智慧轉換 |
| [KT-65750](https://youtrack.jetbrains.com/issue/KT-65750) | 更改傳回型別的遞增和加法運算子必須影響智慧轉換 |
| [KT-65349](https://youtrack.jetbrains.com/issue/KT-65349) | [LC] K2：在某些 K1 可行的情況下，明確指定變數型別會破壞綁定智慧轉換 |

#### 泛型 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)* | [棄用在投影接收器上使用合成 setter](#deprecated-synthetics-setter-on-a-projected-receiver) |
| [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600) | 禁止使用泛型型別參數覆寫具有原始型別參數的 Java 方法 |
| [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663) | 禁止將可能為 null 的型別參數傳遞給 \`in\` 投影的 DNN 參數 |
| [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066) | 棄用型別別名建構函式中的上限違反 |
| [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404) | 修正基於 Java 類別的反變擷取型別之型別不健全性 |
| [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718) | 禁止具有自我上限和擷取型別的不健全程式碼 |
| [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749) | 禁止泛型外部類別的泛型內部類別中不健全的邊界違反 |
| [KT-62923](https://youtrack.jetbrains.com/issue/KT-62923) | K2：為內部類別的外部超型別投影引入 PROJECTION_IN_IMMEDIATE_ARGUMENT_TO_SUPERTYPE |
| [KT-63243](https://youtrack.jetbrains.com/issue/KT-63243) | 當繼承自基本型別集合，且該集合具有來自另一個超型別的額外專用實作時，回報 MANY_IMPL_MEMBER_NOT_IMPLEMENTED |
| [KT-60305](https://youtrack.jetbrains.com/issue/KT-60305) | K2：禁止在擴展型別中具有變異（variance）修飾符的型別別名上進行建構函式呼叫和繼承 |
| [KT-64965](https://youtrack.jetbrains.com/issue/KT-64965) | 修正由於對具有自我上限的擷取型別處理不當而導致的型別漏洞 |
| [KT-64966](https://youtrack.jetbrains.com/issue/KT-64966) | 禁止為泛型參數使用錯誤型別進行泛型委派建構函式呼叫 |
| [KT-65712](https://youtrack.jetbrains.com/issue/KT-65712) | 當上限為擷取型別時，回報遺漏的上限違反 |

#### 解析 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-55017](https://youtrack.jetbrains.com/issue/KT-55017)* | [在與來自基底類別的 Java 欄位進行多載解析期間，選擇來自衍生類別的 Kotlin 屬性](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name) |
| [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260) | 使 invoke 慣例與預期的語法糖轉換（desugaring）一致地運作 |
| [KT-62866](https://youtrack.jetbrains.com/issue/KT-62866) | K2：當伴隨物件優於靜態作用域時，更改限定符解析行為 |
| [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750) | 解析型別且具有星號匯入的同名類別時，回報歧義錯誤 |
| [KT-63558](https://youtrack.jetbrains.com/issue/KT-63558) | K2：遷移圍繞 COMPATIBILITY_WARNING 的解析 |
| [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194) | 當相依性類別包含在同一個相依性的兩個不同版本中時，發生 False negative CONFLICTING_INHERITED_MEMBERS |
| [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592) | 具有接收器的功能型別屬性呼叫（Property invoke）優於擴充函式呼叫 |
| [KT-51666](https://youtrack.jetbrains.com/issue/KT-51666) | 限定的 this：引入／優先考慮型別限定的 this 情況 |
| [KT-54166](https://youtrack.jetbrains.com/issue/KT-54166) | 確認類別路徑中 FQ 名稱衝突時的未指定行為 |
| [KT-64431](https://youtrack.jetbrains.com/issue/KT-64431) | K2：禁止在匯入中將型別別名用作限定符 |
| [KT-56520](https://youtrack.jetbrains.com/issue/KT-56520) | K1/K2：對於在較低層級具有歧義的型別參照，解析塔（resolve tower）運作不正確 |

#### 可見性 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-64474](https://youtrack.jetbrains.com/issue/KT-64474/)* | [將無法存取型別的用法宣告為未指定行為](#forbidden-use-of-inaccessible-generic-types) |
| [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179) | 從內部內嵌函式呼叫私有類別伴隨物件成員時發生 False negative PRIVATE_CLASS_MEMBER_FROM_INLINE |
| [KT-58042](https://youtrack.jetbrains.com/issue/KT-58042) | 如果等效的 getter 不可見，則即使覆寫的宣告可見，合成屬性也應為不可見 |
| [KT-64255](https://youtrack.jetbrains.com/issue/KT-64255) | 禁止從另一個模組中的衍生類別存取內部 setter |
| [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917) | 禁止從私有內嵌函式公開匿名型別 |
| [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997) | 禁止從公開 API 內嵌函式進行隱式非公開 API 存取 |
| [KT-56310](https://youtrack.jetbrains.com/issue/KT-56310) | 智慧轉換不應影響受保護成員的可見性 |
| [KT-65494](https://youtrack.jetbrains.com/issue/KT-65494) | 禁止從公開內嵌函式存取被忽略的私有運算子函式 |
| [KT-65004](https://youtrack.jetbrains.com/issue/KT-65004) | K1：覆寫受保護 val 的 var 的 setter 會被產生為公開的 |
| [KT-64972](https://youtrack.jetbrains.com/issue/KT-64972) | 對於 Kotlin/Native，禁止在連結時期由私有成員覆寫 |

#### 註解 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-58723](https://youtrack.jetbrains.com/issue/KT-58723) | 如果註解沒有 EXPRESSION 目標，則禁止用該註解來標註陳述式 |
| [KT-49930](https://youtrack.jetbrains.com/issue/KT-49930) | 在 \`REPEATED_ANNOTATION\` 檢查期間忽略括號運算式 |
| [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422) | K2：禁止在屬性 getter 上使用針對使用處（use-site）'get' 的註解 |
| [KT-46483](https://youtrack.jetbrains.com/issue/KT-46483) | 禁止在 where 子句中的型別參數上使用註解 |
| [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299) | 解析伴隨物件上的註解時忽略伴隨作用域 |
| [KT-64654](https://youtrack.jetbrains.com/issue/KT-64654) | K2：在使用者與編譯器要求的註解之間引入了歧義 |
| [KT-64527](https://youtrack.jetbrains.com/issue/KT-64527) | 列舉值上的註解不應被複製到列舉值類別中 |
| [KT-63389](https://youtrack.jetbrains.com/issue/KT-63389) | K2：在封裝為 \`()?\` 的型別的不相容註解上回報 \`WRONG_ANNOTATION_TARGET\` |
| [KT-63388](https://youtrack.jetbrains.com/issue/KT-63388) | K2：在 catch 參數型別的註解上回報 \`WRONG_ANNOTATION_TARGET\` |

#### Null 安全性 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-54521](https://youtrack.jetbrains.com/issue/KT-54521)* | [棄用在 Java 中被標註為 Nullable 的陣列型別的不安全用法](#improved-null-safety-for-java-primitive-arrays) |
| [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034) | K2：更改安全呼叫與慣例運算子結合的評估語義 |
| [KT-50850](https://youtrack.jetbrains.com/issue/KT-50850) | 超型別的順序定義了繼承函式的可 null 性參數 |
| [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982) | 在公開簽章中近似區域型別時保留可 null 性 |
| [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998) | 禁止將可 null 物件指派給作為不安全指派選取器的非 null Java 欄位 |
| [KT-63209](https://youtrack.jetbrains.com/issue/KT-63209) | 對警告層級 Java 型別的錯誤層級可 null 引數回報遺漏的錯誤 |

#### Java 互通性 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-53061](https://youtrack.jetbrains.com/issue/KT-53061) | 禁止原始碼中具有相同 FQ 名稱的 Java 和 Kotlin 類別 |
| [KT-49882](https://youtrack.jetbrains.com/issue/KT-49882) | 繼承自 Java 集合的類別根據超型別順序具有不一致的行為 |
| [KT-66324](https://youtrack.jetbrains.com/issue/KT-66324) | K2：Java 類別繼承自 Kotlin 私有類別時的未指定行為 |
| [KT-66220](https://youtrack.jetbrains.com/issue/KT-66220) | 將 Java 可變參數方法傳遞給內嵌函式會導致執行時期產生陣列的陣列，而非僅是陣列 |
| [KT-66204](https://youtrack.jetbrains.com/issue/KT-66204) | 允許在 K-J-K 階層中覆寫內部成員 |

#### 屬性 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-57555](https://youtrack.jetbrains.com/issue/KT-57555)* | [[LC] 禁止延遲初始化具有支援欄位的 open 屬性](#immediate-initialization-of-open-properties-with-backing-fields) |
| [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589) | 當沒有主建構函式或類別是區域類別時，棄用遺漏的 MUST_BE_INITIALIZED |
| [KT-64295](https://youtrack.jetbrains.com/issue/KT-64295) | 對於屬性上潛在的呼叫操作，禁止遞迴解析 |
| [KT-57290](https://youtrack.jetbrains.com/issue/KT-57290) | 如果基底類別來自另一個模組，則棄用從不可見衍生類別對基底類別屬性進行的智慧轉換 |
| [KT-62661](https://youtrack.jetbrains.com/issue/KT-62661) | K2：遺漏了資料類別屬性的 OPT_IN_USAGE_ERROR |

#### 控制流程 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408) | K1 和 K2 之間類別初始化區塊中 CFA 規則不一致 |
| [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871) | 括號中不具 else 分支的 if 條件句之 K1/K2 不一致性 |
| [KT-42995](https://youtrack.jetbrains.com/issue/KT-42995) | 作用域函式中初始化 try/catch 區塊時發生 False negative "VAL_REASSIGNMENT" |
| [KT-65724](https://youtrack.jetbrains.com/issue/KT-65724) | 將資料流資訊從 try 區塊傳播到 catch 和 finally 區塊 |

#### 列舉類別 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-57608](https://youtrack.jetbrains.com/issue/KT-57608) | 禁止在初始化列舉項目期間存取列舉類別的伴隨物件 |
| [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372) | 回報列舉類別中虛擬內嵌方法遺漏的錯誤 |
| [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802) | 回報屬性／欄位與列舉項目之間解析的歧義 |
| [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310) | 當伴隨屬性優於列舉項目時，更改限定符解析行為 |

#### 功能（SAM）介面 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628) | 棄用不帶註解但要求 OptIn 的 SAM 建構函式用法 |
| [KT-57014](https://youtrack.jetbrains.com/issue/KT-57014) | 禁止從 JDK 函式介面的 SAM 建構函式 Lambda 傳回可 null 性不正確的值 |
| [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342) | 可呼叫參照之參數型別的 SAM 轉換導致 CCE |

#### 伴隨物件 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316) | 對伴隨物件成員的呼叫外參照（Out-of-call reference）具有無效簽章 |
| [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313) | 當 V 具有伴隨物件時，更改 (V)::foo 參照解析方式 |

#### 其他 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID | 標題 |
|---|---|
| [KT-59739](https://youtrack.jetbrains.com/issue/KT-59739)* | 當實作位於實際對應部分時，K2/MPP 對通用程式碼中的繼承者回報 [ABSTRACT_MEMBER_NOT_IMPLEMENTED] |
| [KT-49015](https://youtrack.jetbrains.com/issue/KT-49015) | 限定的 this：發生潛在標籤衝突時更改行為 |
| [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545) | 修正 Java 子類別中意外發生衝突多載時，JVM 後端中不正確的函式名稱修飾（mangling） |
| [KT-62019](https://youtrack.jetbrains.com/issue/KT-62019) | [LC 問題] 禁止在陳述式位置使用標記為 suspend 的匿名函式宣告 |
| [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111) | OptIn：禁止在標記下使用預設引數（具有預設值的參數）進行建構函式呼叫 |
| [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182) | 意外允許將 Unit 轉換用於變數上的運算式 + invoke 解析 |
| [KT-55199](https://youtrack.jetbrains.com/issue/KT-55199) | 禁止將具有調整（adaptations）的可呼叫參照提升為 KFunction |
| [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776) | [LC] K2 破壞了 \`false && ...\` 和 \`false || ...\` |
| [KT-65682](https://youtrack.jetbrains.com/issue/KT-65682) | [LC] 棄用 \`header\`/\`impl\` 關鍵字 |
| [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375) | 預設透過 invokedynamic + LambdaMetafactory 產生所有 Kotlin Lambda |

## 與 Kotlin 版本的相容性

以下 Kotlin 版本支援新 K2 編譯器：

| Kotlin 版本 | 穩定性層級 |
|---|---|
| 2.0.0–%kotlinVersion% | 穩定 |
| 1.9.20–1.9.25 | Beta |
| 1.9.0–1.9.10 | JVM 為 Beta |
| 1.7.0–1.8.22 | Alpha |

## 與 Kotlin 程式庫的相容性

如果您正在使用 Kotlin/JVM，K2 編譯器可與使用任何版本 Kotlin 編譯的程式庫搭配使用。

如果您正在使用 Kotlin 多平台，K2 編譯器保證可與使用 Kotlin 1.9.20 及更高版本編譯的程式庫搭配使用。

## 編譯器外掛程式支援

目前，Kotlin K2 編譯器支援以下 Kotlin 編譯器外掛程式：

* [`all-open`](all-open-plugin.md)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
* [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
* [Lombok](lombok.md)
* [`no-arg`](no-arg-plugin.md)
* [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
* [Power-assert](power-assert.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Serialization](serialization.md)

此外，Kotlin K2 編譯器還支援：

* [Jetpack Compose](https://developer.android.com/jetpack/compose) 1.5.0 編譯器外掛程式及更高版本。
* 自 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 起的 [Kotlin 符號處理 (KSP)](ksp-overview.md)。

> 如果您使用任何額外的編譯器外掛程式，請檢查其文件以了解它們是否與 K2 相容。
>
{style="tip"}

### 升級您的自訂編譯器外掛程式

> 自訂編譯器外掛程式使用外掛程式 API，該 API 為[實驗性](components-stability.md#stability-levels-explained)。
> 因此，API 可能隨時更改，因此我們無法保證向後相容性。
>
{style="warning"}

升級過程有兩條路徑，取決於您擁有的自訂外掛程式類型。

#### 僅後端編譯器外掛程式

如果您的外掛程式僅實作 `IrGenerationExtension` 擴充點，則過程與任何其他新編譯器版本相同。檢查您使用的 API 是否有任何變更，並根據需要進行更改。

#### 後端與前端編譯器外掛程式

如果您的外掛程式使用與前端相關的擴充點，您需要使用新的 K2 編譯器 API 重寫外掛程式。如需新 API 的介紹，請參閱 [FIR Plugin API](https://github.com/JetBrains/kotlin/blob/master/docs/fir/fir-plugins.md)。

> 如果您對升級自訂編譯器外掛程式有疑問，請加入我們的 [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) Slack 頻道，我們將盡力協助您。
>
{style="note"}

## 分享您對新 K2 編譯器的意見反應

我們將非常感激您的任何意見反應！

* 在[我們的問題追蹤器](https://youtrack.jetbrains.com/newIssue?project=KT&summary=K2+release+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+k2-release-migration)中回報您在遷移到新 K2 編譯器時遇到的任何問題。
* [啟用傳送使用統計資料選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，允許 JetBrains 收集有關 K2 使用情況的匿名資料。