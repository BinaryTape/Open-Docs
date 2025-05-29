[//]: # (title: K2 編譯器遷移指南)

隨著 Kotlin 語言和生態系統的持續演進，Kotlin 編譯器也隨之發展。第一步是引入了新的 JVM 和 JS IR (Intermediate Representation，中介表示) 後端，它們共享邏輯，簡化了針對不同平台目標的程式碼生成。現在，其演進的下一階段帶來了一個名為 K2 的新前端。

![Kotlin K2 compiler architecture](k2-compiler-architecture.svg){width=700}

隨著 K2 編譯器的到來，Kotlin 前端已被完全重寫，並具備了全新、更高效的架構。新編譯器帶來的根本性變化是採用了一種統一的資料結構，該結構包含了更多的語義資訊。這個前端負責執行語義分析、呼叫解析和型別推斷。

新架構和豐富的資料結構使 K2 編譯器能夠提供以下優勢：

*   **改進的呼叫解析和型別推斷。** 編譯器行為更一致，並且能更好地理解您的程式碼。
*   **更容易為新的語言功能引入語法糖 (syntactic sugar)。** 未來，當新功能引入時，您將能夠使用更簡潔、可讀性更高的程式碼。
*   **更快的編譯時間。** 編譯時間可以[顯著加快](#performance-improvements)。
*   **增強的 IDE 性能。** 從 2025.1 版開始，IntelliJ IDEA 使用 K2 模式分析您的 Kotlin 程式碼，提高了穩定性並提供了性能改進。更多資訊請參閱[IDE 支援](#support-in-ides)。

本指南將：

*   解釋新 K2 編譯器的優勢。
*   重點介紹您在遷移過程中可能遇到的變化以及如何相應地調整您的程式碼。
*   描述如何回溯到先前的版本。

> 從 2.0.0 版本開始，新的 K2 編譯器預設啟用。有關 Kotlin 2.0.0 和新 K2 編譯器提供的新功能，請參閱[Kotlin 2.0.0 的新功能](whatsnew20.md)。
>
{style="note"}

## 性能改進

為了評估 K2 編譯器的性能，我們對兩個開源專案：[Anki-Android](https://github.com/ankidroid/Anki-Android) 和 [Exposed](https://github.com/JetBrains/Exposed) 進行了性能測試。以下是我們發現的主要性能改進：

*   K2 編譯器帶來高達 94% 的編譯速度提升。例如，在 Anki-Android 專案中，全新建置時間從 Kotlin 1.9.23 的 57.7 秒縮短到 Kotlin 2.0.0 的 29.7 秒。
*   使用 K2 編譯器，初始化階段的速度提升高達 488%。例如，在 Anki-Android 專案中，增量建置的初始化階段從 Kotlin 1.9.23 的 0.126 秒縮短到 Kotlin 2.0.0 的僅 0.022 秒。
*   與之前的編譯器相比，Kotlin K2 編譯器在分析階段的速度提升高達 376%。例如，在 Anki-Android 專案中，增量建置的分析時間從 Kotlin 1.9.23 的 0.581 秒大幅縮減到 Kotlin 2.0.0 的僅 0.122 秒。

有關這些改進的更多詳細資訊，以及如何分析 K2 編譯器性能的方法，請參閱我們的[部落格文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)。

## 語言功能改進

Kotlin K2 編譯器改進了與[智慧型轉型 (smart-casting)](#smart-casts) 和 [Kotlin 多平台](#kotlin-multiplatform) 相關的語言功能。

### 智慧型轉型 (Smart Casts)

Kotlin 編譯器在特定情況下可以自動將物件轉型為某種型別，省去了您手動明確指定的麻煩。這就是[智慧型轉型](typecasts.md#smart-casts)。Kotlin K2 編譯器現在可以在比以前更多的情境中執行智慧型轉型。

在 Kotlin 2.0.0 中，我們在以下方面改進了智慧型轉型相關功能：

*   [局部變數和更廣泛的作用域](#local-variables-and-further-scopes)
*   [使用邏輯 `or` 運算子進行型別檢查](#type-checks-with-the-logical-or-operator)
*   [內聯函數](#inline-functions)
*   [函數型別的屬性](#properties-with-function-types)
*   [異常處理](#exception-handling)
*   [遞增和遞減運算子](#increment-and-decrement-operators)

#### 局部變數和更廣泛的作用域

以前，如果變數在 `if` 條件內被評估為非 `null`，該變數將會被智慧型轉型。有關此變數的資訊隨後將在 `if` 區塊的作用域內進一步共享。

然而，如果您將變數宣告在 `if` 條件**之外**，則在 `if` 條件內無法獲取有關該變數的任何資訊，因此它無法被智慧型轉型。`when` 表達式和 `while` 迴圈也存在這種行為。

從 Kotlin 2.0.0 開始，如果您在 `if`、`when` 或 `while` 條件中使用變數之前宣告它，那麼編譯器收集到的有關該變數的任何資訊都將在相應的區塊中可用於智慧型轉型。

當您想要將布林條件提取到變數中時，這會很有用。然後，您可以為變數賦予一個有意義的名稱，這將提高程式碼的可讀性，並使該變數可以在程式碼中重複使用。例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // In Kotlin 2.0.0, the compiler can access
        // information about isCat, so it knows that
        // animal was smart-cast to the type Cat.
        // Therefore, the purr() function can be called.
        // In Kotlin 1.9.20, the compiler doesn't know
        // about the smart cast, so calling the purr()
        // function triggers an error.
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

#### 使用邏輯或運算子進行型別檢查

在 Kotlin 2.0.0 中，如果您使用 `or` 運算子 (`||`) 組合物件的型別檢查，將會對它們最接近的共同超型別進行智慧型轉型。在此更改之前，智慧型轉型總是會轉型為 `Any` 型別。

在這種情況下，您仍然需要手動檢查物件型別，然後才能存取其任何屬性或呼叫其函數。例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
        // Prior to Kotlin 2.0.0, signalStatus is smart cast 
        // to type Any, so calling the signal() function triggered an
        // Unresolved reference error. The signal() function can only 
        // be called successfully after another type check:
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 共同超型別是[聯集型別 (union type)](https://en.wikipedia.org/wiki/Union_type) 的**近似值**。聯集型別[目前在 Kotlin 中不支援](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

#### 內聯函數

在 Kotlin 2.0.0 中，K2 編譯器對內聯函數的處理方式不同，這使得它能夠結合其他編譯器分析來判斷智慧型轉型是否安全。

具體來說，內聯函數現在被視為具有隱式的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契約 (contract)。這意味著傳遞給內聯函數的任何 lambda 函數都會在原地呼叫。由於 lambda 函數是在原地呼叫的，因此編譯器知道 lambda 函數不會洩漏其函數主體中包含的任何變數的引用。

編譯器利用這項知識以及其他編譯器分析來決定智慧型轉型任何被捕獲的變數是否安全。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // In Kotlin 2.0.0, the compiler knows that processor 
        // is a local variable and inlineAction() is an inline function, so 
        // references to processor can't be leaked. Therefore, it's safe 
        // to smart-cast processor.
      
        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call 
            // is needed
            processor.process()

            // In Kotlin 1.9.20, you have to perform a safe call:
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 函數型別的屬性

在之前的 Kotlin 版本中，存在一個錯誤，導致具有函數型別的類別屬性無法進行智慧型轉型。我們在 Kotlin 2.0.0 和 K2 編譯器中修復了此行為。例如：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // In Kotlin 2.0.0, if provider isn't null,
        // it is smart-cast
        if (provider != null) {
            // The compiler knows that provider isn't null
            provider()

            // In 1.9.20, the compiler doesn't know that provider isn't 
            // null, so it triggers an error:
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

如果您重載了 `invoke` 運算子，此更改也適用。例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider() 
            // In 1.9.20, the compiler triggers an error: 
            // Reference has a nullable type 'Provider?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 異常處理

在 Kotlin 2.0.0 中，我們改進了異常處理，以便將智慧型轉型資訊傳遞給 `catch` 和 `finally` 區塊。此更改使您的程式碼更安全，因為編譯器會追蹤您的物件是否為可空型別。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for 
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // In Kotlin 2.0.0, the compiler knows stringInput 
        // can be null, so stringInput stays nullable.
        println(stringInput?.length)
        // null

        // In Kotlin 1.9.20, the compiler says that a safe call isn't
        // needed, but this is incorrect.
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 遞增和遞減運算子

在 Kotlin 2.0.0 之前，編譯器無法理解物件的型別在使用遞增或遞減運算子後可能會改變。由於編譯器無法準確追蹤物件型別，您的程式碼可能會導致未解析的引用錯誤。在 Kotlin 2.0.0 中，此問題已得到修復：

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

    // Check if unknownObject inherits from the Tau interface
    // Note, it's possible that unknownObject inherits from both
    // Rho and Tau interfaces.
    if (unknownObject is Tau) {

        // Use the overloaded inc() operator from interface Rho.
        // In Kotlin 2.0.0, the type of unknownObject is smart-cast to
        // Sigma.
        ++unknownObject

        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so the sigma() function can be called successfully.
        unknownObject.sigma()

        // In Kotlin 1.9.20, the compiler doesn't perform a smart cast
        // when inc() is called so the compiler still thinks that 
        // unknownObject has type Tau. Calling the sigma() function 
        // throws a compile-time error.
        
        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so calling the tau() function throws a compile-time 
        // error.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // In Kotlin 1.9.20, since the compiler mistakenly thinks that 
        // unknownObject has type Tau, the tau() function can be called,
        // but it throws a ClassCastException.
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin 多平台

K2 編譯器在以下方面改進了 Kotlin 多平台相關功能：

*   [編譯期間公共與平台原始碼的分離](#separation-of-common-and-platform-sources-during-compilation)
*   [預期 (expected) 和實際 (actual) 宣告的不同可見性層級](#different-visibility-levels-of-expected-and-actual-declarations)

#### 編譯期間公共與平台原始碼的分離

以前，Kotlin 編譯器的設計使其無法在編譯時將公共和平台原始碼集分開。因此，公共程式碼可以存取平台程式碼，這導致了不同平台之間的行為差異。此外，一些來自公共程式碼的編譯器設定和依賴關係也曾經洩漏到平台程式碼中。

在 Kotlin 2.0.0 中，我們對新 Kotlin K2 編譯器的實作包含了編譯方案的重新設計，以確保公共和平台原始碼集之間的嚴格分離。當您使用[預期 (expected) 和實際 (actual) 函數](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions)時，此更改最為明顯。以前，您的公共程式碼中的函數呼叫可能會解析為平台程式碼中的函數。例如：

<table>
   <tr>
       <td>公共程式碼</td>
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
// There is no foo() function overload on the JavaScript platform
```

</td>
</tr>
</table>

在此範例中，公共程式碼的行為會因其執行的平台而異：

*   在 JVM 平台上，呼叫公共程式碼中的 `foo()` 函數會導致平台程式碼中的 `foo()` 函數被呼叫為 `platform foo`。
*   在 JavaScript 平台上，呼叫公共程式碼中的 `foo()` 函數會導致公共程式碼中的 `foo()` 函數被呼叫為 `common foo`，因為平台程式碼中沒有此類函數。

在 Kotlin 2.0.0 中，公共程式碼無法存取平台程式碼，因此兩個平台都成功地將 `foo()` 函數解析為公共程式碼中的 `foo()` 函數：`common foo`。

除了改進跨平台行為的一致性之外，我們也努力修復了 IntelliJ IDEA 或 Android Studio 與編譯器之間行為衝突的情況。例如，當您使用[預期 (expected) 和實際 (actual) 類別](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes)時，會發生以下情況：

<table>
   <tr>
       <td>公共程式碼</td>
       <td>平台程式碼</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // Before 2.0.0, it triggers an IDE-only error
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

在此範例中，預期類別 `Identity` 沒有預設建構子，因此無法在公共程式碼中成功呼叫。以前，錯誤只會由 IDE 報告，但程式碼在 JVM 上仍然可以成功編譯。然而，現在編譯器會正確地報告錯誤：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解析行為不變的情況

我們仍在向新的編譯方案遷移的過程中，因此當您呼叫不在同一原始碼集中的函數時，解析行為仍然相同。您主要會在公共程式碼中使用多平台函式庫的重載時注意到此差異。

假設您有一個函式庫，其中包含兩個簽名不同的 `whichFun()` 函數：

```kotlin
// Example library

// MODULE: common
fun whichFun(x: Any) = println("common function") 

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在公共程式碼中呼叫 `whichFun()` 函數，函式庫中具有最相關引數型別的函數將被解析：

```kotlin
// A project that uses the example library for the JVM target

// MODULE: common
fun main(){
    whichFun(2) 
    // platform function
}
```

相比之下，如果您在同一原始碼集中宣告 `whichFun()` 的重載，則將解析公共程式碼中的函數，因為您的程式碼無法存取特定於平台的版本：

```kotlin
// Example library isn't used

// MODULE: common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

與多平台函式庫類似，由於 `commonTest` 模組位於單獨的原始碼集中，它仍然可以存取特定於平台的程式碼。因此，對 `commonTest` 模組中函數的呼叫解析表現出與舊編譯方案相同的行為。

未來，這些剩餘案例將與新的編譯方案更加一致。

#### 預期 (expected) 和實際 (actual) 宣告的不同可見性層級

在 Kotlin 2.0.0 之前，如果您在 Kotlin 多平台專案中使用[預期 (expected) 和實際 (actual) 宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，它們必須具有相同的[可見性層級](visibility-modifiers.md)。Kotlin 2.0.0 現在也支援不同的可見性層級，但**僅限於**實際宣告比預期宣告 _更_ 寬鬆的情況。例如：

```kotlin
expect internal class Attribute // Visibility is internal
actual class Attribute          // Visibility is public by default,
                                // which is more permissive
```

同樣地，如果您在實際宣告中使用[型別別名 (type alias)](type-aliases.md)，**底層型別 (underlying type)** 的可見性應與預期宣告相同或更寬鬆。例如：

```kotlin
expect internal class Attribute                 // Visibility is internal
internal actual typealias Attribute = Expanded

class Expanded                                  // Visibility is public by default,
                                                // which is more permissive
```

## 如何啟用 Kotlin K2 編譯器

從 Kotlin 2.0.0 開始，Kotlin K2 編譯器預設啟用。

要升級 Kotlin 版本，請在您的 [Gradle](gradle-configure-project.md#apply-the-plugin) 和 [Maven](maven.md#configure-and-enable-the-plugin) 建置指令碼中將其更改為 2.0.0 或更高版本。

為了在 IntelliJ IDEA 或 Android Studio 中獲得最佳體驗，請考慮在您的 IDE 中[啟用 K2 模式](#support-in-ides)。

### 將 Kotlin 建置報告與 Gradle 搭配使用

Kotlin [建置報告](gradle-compilation-and-caches.md#build-reports)提供了關於 Kotlin 編譯器任務在不同編譯階段所花費的時間資訊，以及使用了哪個編譯器和 Kotlin 版本，以及編譯是否為增量的。這些建置報告對於評估您的建置性能很有用。它們比 [Gradle 建置掃描](https://scans.gradle.com/)更能深入了解 Kotlin 編譯流程，因為它們提供了所有 Gradle 任務的性能概覽。

#### 如何啟用建置報告

要啟用建置報告，請在您的 `gradle.properties` 檔案中宣告您希望儲存建置報告輸出到何處：

```none
kotlin.build.report.output=file
```

以下值及其組合可用於輸出：

| 選項 | 描述 |
|---|---|
| `file` | 以人類可讀的格式將建置報告儲存到本機檔案。預設路徑為 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 以物件格式將建置報告儲存到指定的本機檔案。 |
| `build_scan` | 將建置報告儲存到[建置掃描](https://scans.gradle.com/)的 `custom values` 部分。請注意，Gradle Enterprise 插件限制了自訂值的數量和長度。在大型專案中，某些值可能會遺失。 |
| `http` | 使用 HTTP(S) 發送建置報告。POST 方法以 JSON 格式發送指標。您可以在 [Kotlin 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)中查看已發送資料的當前版本。您可以在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)中找到 HTTP 端點範例。 |
| `json` | 以 JSON 格式將建置報告儲存到本機檔案。在 `kotlin.build.report.json.directory` 中設定建置報告的位置。預設名稱為 `${project_name}-build-<date-time>-<index>.json`。 |

有關建置報告功能的更多資訊，請參閱[建置報告](gradle-compilation-and-caches.md#build-reports)。

## IDE 支援

IntelliJ IDEA 和 Android Studio 中的 K2 模式使用 K2 編譯器來改進程式碼分析、程式碼完成和語法高亮。

從 IntelliJ IDEA 2025.1 開始，K2 模式[預設啟用](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/)。

在 Android Studio 中，您可以從 2024.1 版本開始透過以下步驟啟用 K2 模式：

1.  前往 **Settings** | **Languages & Frameworks** | **Kotlin**。
2.  選取 **Enable K2 mode** 選項。

### 以前的 IDE 行為 {initial-collapse-state="collapsed" collapsible="true"}

如果您想回到以前的 IDE 行為，可以停用 K2 模式：

1.  前往 **Settings** | **Languages & Frameworks** | **Kotlin**。
2.  取消選取 **Enable K2 mode** 選項。

> 我們計畫在 Kotlin 2.1.0 之後引入[穩定 (Stable)](components-stability.md#stability-levels-explained) 的語言功能。在此之前，您可以繼續使用以前的 IDE 功能進行程式碼分析，並且不會因為無法識別的語言功能而遇到任何程式碼高亮問題。
>
{style="note"}

## 在 Kotlin Playground 中試用 Kotlin K2 編譯器

Kotlin Playground 支援 Kotlin 2.0.0 及更高版本。 [點擊體驗！](https://pl.kotl.in/czuoQprce)

## 如何回溯到先前的編譯器

要在 Kotlin 2.0.0 及更高版本中使用先前的編譯器，請選擇以下方式之一：

*   在您的 `build.gradle.kts` 檔案中，將[語言版本設定](gradle-compiler-options.md#example-of-setting-languageversion)為 `1.9`。

    或
*   使用以下編譯器選項：`-language-version 1.9`。

## 變更

隨著新前端的引入，Kotlin 編譯器經歷了多項變更。讓我們先重點介紹影響您程式碼的最重大修改，解釋變更內容並詳細說明未來的最佳實踐。如果您想了解更多資訊，我們已將這些變更整理成[主題區域](#per-subject-area)，以方便您進一步閱讀。

本節重點介紹以下修改：

*   [帶有後備欄位 (backing fields) 的開放 (open) 屬性必須立即初始化](#immediate-initialization-of-open-properties-with-backing-fields)
*   [已棄用投射接收器 (projected receiver) 上的合成 setter](#deprecated-synthetics-setter-on-a-projected-receiver)
*   [禁止使用不可存取的泛型型別](#forbidden-use-of-inaccessible-generic-types)
*   [同名 Kotlin 屬性和 Java 欄位的一致解析順序](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
*   [改進 Java 原始型別陣列的空安全性](#improved-null-safety-for-java-primitive-arrays)
*   [預期類別中抽象成員的更嚴格規則](#stricter-rules-for-abstract-members-in-expected-classes)

### 帶有後備欄位 (backing fields) 的開放 (open) 屬性必須立即初始化

**有何變更？**

在 Kotlin 2.0 中，所有帶有後備欄位的 `open` 屬性都必須立即初始化；否則，您將會遇到編譯錯誤。以前，只有 `open var` 屬性需要立即初始化，但現在這也擴展到帶有後備欄位的 `open val` 屬性：

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // Error starting with Kotlin 2.0 that earlier compiled successfully 
        this.a = 1 //Error: open val must have initializer
        // Always an error
        this.b = 1 // Error: open var must have initializer
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

此更改使編譯器的行為更具可預測性。考慮一個範例，其中 `open val` 屬性被一個帶有自訂 setter 的 `var` 屬性覆寫。

如果使用自訂 setter，延遲初始化可能會導致混淆，因為不清楚您是要初始化後備欄位還是呼叫 setter。過去，如果您想呼叫 setter，舊編譯器無法保證 setter 會初始化後備欄位。

**現在的最佳實踐是什麼？**

我們鼓勵您始終初始化帶有後備欄位的開放屬性，因為我們相信這種做法既高效又不易出錯。

然而，如果您不想立即初始化屬性，您可以選擇：

*   將屬性設為 `final`。
*   使用允許延遲初始化的私有後備屬性。

更多資訊請參閱 YouTrack 中的[相關問題](https://youtrack.jetbrains.com/issue/KT-57555)。

### 已棄用投射接收器 (projected receiver) 上的合成 setter

**有何變更？**

如果您使用 Java 類別的合成 setter 來賦值與該類別的投射型別衝突的型別，將會觸發錯誤。

假設您有一個名為 `Container` 的 Java 類別，其中包含 `getFoo()` 和 `setFoo()` 方法：

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

如果您有以下 Kotlin 程式碼，其中 `Container` 類別的實例具有投射型別，則使用 `setFoo()` 方法將始終產生錯誤。然而，只有從 Kotlin 2.0.0 開始，合成的 `foo` 屬性才會觸發錯誤：

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // Error since Kotlin 1.0

    // Synthetic setter `foo` is resolved to the `setFoo()` method
    starProjected.foo = sampleString
    // Error since Kotlin 2.0.0

    inProjected.setFoo(sampleString)
    // Error since Kotlin 1.0

    // Synthetic setter `foo` is resolved to the `setFoo()` method
    inProjected.foo = sampleString
    // Error since Kotlin 2.0.0
}
```

**現在的最佳實踐是什麼？**

如果您發現此更改在您的程式碼中引入了錯誤，您可能希望重新考慮型別宣告的結構。可能是您不需要使用型別投射，或者您需要從程式碼中刪除任何賦值操作。

更多資訊請參閱 YouTrack 中的[相關問題](https://youtrack.jetbrains.com/issue/KT-54309)。

### 禁止使用不可存取的泛型型別

**有何變更？**

由於我們 K2 編譯器的新架構，我們改變了處理不可存取泛型型別的方式。通常，您不應該在程式碼中依賴不可存取的泛型型別，因為這表示您的專案建置配置存在錯誤，阻止編譯器存取必要的資訊進行編譯。在 Kotlin 2.0.0 中，您不能宣告或呼叫帶有不可存取泛型型別的函數字面值，也不能使用帶有不可存取泛型型別引數的泛型型別。此限制可幫助您避免程式碼中稍後出現編譯器錯誤。

例如，假設您在一個模組中宣告了一個泛型類別：

```kotlin
// Module one
class Node<V>(val value: V)
```

如果您有另一個模組（模組二）配置了對模組一的依賴關係，您的程式碼可以存取 `Node<V>` 類別並將其用作函數型別中的型別：

```kotlin
// Module two
fun execute(func: (Node<Int>) -> Unit) {}
// Function compiles successfully
```

然而，如果您的專案配置錯誤，導致您有第三個模組（模組三）僅依賴於模組二，則 Kotlin 編譯器在編譯第三個模組時將無法存取**模組一**中的 `Node<V>` 類別。現在，模組三中任何使用 `Node<V>` 型別的 lambda 或匿名函數都會在 Kotlin 2.0.0 中觸發錯誤，從而防止程式碼中稍後出現可避免的編譯器錯誤、崩潰和執行時異常：

```kotlin
// Module three
fun test() {
    // Triggers an error in Kotlin 2.0.0, as the type of the implicit 
    // lambda parameter (it) resolves to Node, which is inaccessible
    execute {}

    // Triggers an error in Kotlin 2.0.0, as the type of the unused 
    // lambda parameter (_) resolves to Node, which is inaccessible
    execute { _ -> }

    // Triggers an error in Kotlin 2.0.0, as the type of the unused
    // anonymous function parameter (_) resolves to Node, which is inaccessible
    execute(fun (_) {})
}
```

除了函數字面值在包含不可存取泛型型別的值參數時觸發錯誤之外，當型別具有不可存取泛型型別引數時也會發生錯誤。

例如，您在模組一中有相同的泛型類別宣告。在模組二中，您宣告了另一個泛型類別：`Container<C>`。此外，您在模組二中宣告了使用 `Container<C>` 和泛型類別 `Node<V>` 作為型別引數的函數：

<table>
   <tr>
       <td>模組一</td>
       <td>模組二</td>
   </tr>
   <tr>
<td>

```kotlin
// Module one
class Node<V>(val value: V)
```

</td>
<td>

```kotlin
// Module two
class Container<C>(vararg val content: C)

// Functions with generic class type that
// also have a generic class type argument
fun produce(): Container<Node<Int>> = Container(Node(42))
fun consume(arg: Container<Node<Int>>) {}
```

</td>
</tr>
</table>

如果您嘗試在模組三中呼叫這些函數，則會在 Kotlin 2.0.0 中觸發錯誤，因為從模組三無法存取泛型類別 `Node<V>`：

```kotlin
// Module three
fun test() {
    // Triggers an error in Kotlin 2.0.0, as generic class Node<V> is 
    // inaccessible
    consume(produce())
}
```

在未來的版本中，我們將繼續普遍棄用不可存取型別的使用。我們已在 Kotlin 2.0.0 中開始，為一些不可存取型別的情境（包括非泛型型別）添加了警告。

例如，讓我們使用與先前範例相同的模組設定，但將泛型類別 `Node<V>` 轉換為非泛型類別 `IntNode`，所有函數都宣告在模組二中：

<table>
   <tr>
       <td>模組一</td>
       <td>模組二</td>
   </tr>
   <tr>
<td>

```kotlin
// Module one
class IntNode(val value: Int)
```

</td>
<td>

```kotlin
// Module two
// A function that contains a lambda 
// parameter with `IntNode` type
fun execute(func: (IntNode) -> Unit) {}

class Container<C>(vararg val content: C)

// Functions with generic class type
// that has `IntNode` as a type argument
fun produce(): Container<IntNode> = Container(IntNode(42))
fun consume(arg: Container<IntNode>) {}
```

</td>
</tr>
</table>

如果您在模組三中呼叫這些函數，將會觸發一些警告：

```kotlin
// Module three
fun test() {
    // Triggers warnings in Kotlin 2.0.0, as class IntNode is 
    // inaccessible.

    execute {}
    // Class 'IntNode' of the parameter 'it' is inaccessible.

    execute { _ -> }
    execute(fun (_) {})
    // Class 'IntNode' of the parameter '_' is inaccessible.

    // Will trigger a warning in future Kotlin releases, as IntNode is
    // inaccessible.
    consume(produce())
}
```

**現在的最佳實踐是什麼？**

如果您遇到有關不可存取泛型型別的新警告，很可能是您的建置系統配置存在問題。我們建議檢查您的建置指令碼和配置。 

作為最後的手段，您可以為模組三配置對模組一的直接依賴。或者，您可以修改程式碼以使型別在同一模組內可存取。

更多資訊請參閱 YouTrack 中的[相關問題](https://youtrack.jetbrains.com/issue/KT-64474)。

### 同名 Kotlin 屬性和 Java 欄位的一致解析順序

**有何變更？**

在 Kotlin 2.0.0 之前，如果您使用的 Java 和 Kotlin 類別彼此繼承，並且包含同名的 Kotlin 屬性和 Java 欄位，則重複名稱的解析行為是不一致的。IntelliJ IDEA 和編譯器之間也存在衝突行為。在開發 Kotlin 2.0.0 的新解析行為時，我們的目標是對使用者造成最小的影響。

例如，假設有一個 Java 類別 `Base`：

```java
public class Base {
    public String a = "a";

    public String b = "b";
}
```

假設還有一個 Kotlin 類別 `Derived`，它繼承自上述 `Base` 類別：

```kotlin
class Derived : Base() {
    val a = "aa"

    // Declares custom get() function
    val b get() = "bb"
}

fun main() {
    // Resolves Derived.a
    println(a)
    // aa

    // Resolves Base.b
    println(b)
    // b
}
```

在 Kotlin 2.0.0 之前，`a` 解析為 `Derived` Kotlin 類別中的 Kotlin 屬性，而 `b` 解析為 `Base` Java 類別中的 Java 欄位。

在 Kotlin 2.0.0 中，範例中的解析行為是一致的，確保 Kotlin 屬性取代同名的 Java 欄位。現在，`b` 解析為：`Derived.b`。

> 在 Kotlin 2.0.0 之前，如果您使用 IntelliJ IDEA 導航到 `a` 的宣告或使用處，它會錯誤地導航到 Java 欄位，而應該導航到 Kotlin 屬性。
> 
> 從 Kotlin 2.0.0 開始，IntelliJ IDEA 會正確導航到與編譯器相同的位置。
>
{style="note"}

一般規則是子類優先。先前的範例證明了這一點，因為 `Derived` 類別的 Kotlin 屬性 `a` 被解析，因為 `Derived` 是 `Base` Java 類別的子類。

如果繼承關係顛倒，並且 Java 類別繼承自 Kotlin 類別，則子類中的 Java 欄位優先於同名的 Kotlin 屬性。

考慮這個範例：

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
    // Resolves Derived.a
    println(a)
    // a
}
```

**現在的最佳實踐是什麼？**

如果此更改影響您的程式碼，請考慮您是否真的需要使用重複的名稱。如果您希望 Java 或 Kotlin 類別各自包含同名的欄位或屬性，並且彼此繼承，請記住子類中的欄位或屬性將優先。

更多資訊請參閱 YouTrack 中的[相關問題](https://youtrack.jetbrains.com/issue/KT-55017)。

### 改進 Java 原始型別陣列的空安全性

**有何變更？**

從 Kotlin 2.0.0 開始，編譯器正確推斷導入到 Kotlin 的 Java 原始型別陣列的可空性。現在，它會保留與 Java 原始型別陣列一起使用的 `TYPE_USE` 註釋中的原生可空性，並在其值未按照註釋使用時發出錯誤。

通常，當帶有 `@Nullable` 和 `@NotNull` 註釋的 Java 型別從 Kotlin 呼叫時，它們會接收到適當的原生可空性：

```java
interface DataService {
    @NotNull ResultContainer<@Nullable String> fetchData();
}
```
```kotlin
val dataService: DataService = ... 
dataService.fetchData() // -> ResultContainer<String?>
```

然而，以前當 Java 原始型別陣列被導入到 Kotlin 時，所有 `TYPE_USE` 註釋都會丟失，導致平台可空性並可能產生不安全的程式碼：

```java
interface DataProvider {
    int @Nullable [] fetchData();
}
```

```kotlin
val dataService: DataProvider = ...
dataService.fetchData() // -> IntArray .. IntArray?
// No error, even though `dataService.fetchData()` might be `null` according to annotations
// This might result in a NullPointerException
dataService.fetchData()[0]
```
請注意，此問題從未影響宣告本身的可空性註釋，只影響 `TYPE_USE` 註釋。

**現在的最佳實踐是什麼？**

在 Kotlin 2.0.0 中，Java 原始型別陣列的空安全性現在在 Kotlin 中是標準的，因此如果您使用它們，請檢查您的程式碼是否有新的警告和錯誤：

*   任何使用 `@Nullable` Java 原始型別陣列而沒有明確空值檢查，或嘗試將 `null` 傳遞給預期非空原始型別陣列的 Java 方法的程式碼，現在將無法編譯。
*   對於 `@NotNull` 原始型別陣列進行空值檢查，現在會發出「不必要的安全呼叫」或「與 null 比較總是為 false」的警告。

更多資訊請參閱 YouTrack 中的[相關問題](https://youtrack.jetbrains.com/issue/KT-54521)。

### 預期類別中抽象成員的更嚴格規則

> 預期 (Expected) 和實際 (Actual) 類別處於 [Beta](components-stability.md#stability-levels-explained) 階段。它們幾乎穩定，但您未來可能需要執行遷移步驟。我們將盡力減少您需要進行的任何進一步更改。
>
{style="warning"}

**有何變更？**

由於 K2 編譯器在編譯期間將公共和平台原始碼分離，我們為預期類別中的抽象成員實施了更嚴格的規則。

使用之前的編譯器，預期的非抽象類別可以繼承抽象函數而無需[覆寫該函數](inheritance.md#overriding-rules)。由於編譯器可以同時存取公共和平台程式碼，編譯器可以查看抽象函數是否在實際類別中具有對應的覆寫和定義。

現在，由於公共和平台原始碼是分開編譯的，繼承的函數必須在預期類別中明確覆寫，以便編譯器知道該函數不是抽象的。否則，編譯器會報告 `ABSTRACT_MEMBER_NOT_IMPLEMENTED` 錯誤。

例如，假設您有一個公共原始碼集，其中宣告了一個名為 `FileSystem` 的抽象類別，它有一個抽象函數 `listFiles()`。您在平台原始碼集中將 `listFiles()` 函數定義為實際宣告的一部分。

在您的公共程式碼中，如果您有一個名為 `PlatformFileSystem` 的預期非抽象類別，它繼承自 `FileSystem` 類別，則 `PlatformFileSystem` 類別繼承了抽象函數 `listFiles()`。然而，在 Kotlin 中，您不能在非抽象類別中擁有抽象函數。要使 `listFiles()` 函數非抽象，您必須將其宣告為不帶 `abstract` 關鍵字的覆寫：

<table>
   <tr>
       <td>公共程式碼</td>
       <td>平台程式碼</td>
   </tr>
   <tr>
<td>

```kotlin
abstract class FileSystem {
    abstract fun listFiles()
}
expect open class PlatformFileSystem() : FileSystem {
    // In Kotlin 2.0.0, an explicit override is needed
    expect override fun listFiles()
    // Before Kotlin 2.0.0, an override wasn't needed
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

**現在的最佳實踐是什麼？**

如果您在預期的非抽象類別中繼承抽象函數，請添加一個非抽象覆寫。

更多資訊請參閱 YouTrack 中的[相關問題](https://youtrack.jetbrains.com/issue/KT-59739/K2-MPP-reports-ABSTRACTMEMBERNOTIMPLEMENTED-for-inheritor-in-common-code-when-the-implementation-is-located-in-the-actual)。

### 按主題分類

這些主題區域列出了不太可能影響您程式碼的變更，但提供了相關 YouTrack 問題的連結供您進一步閱讀。Issue ID 旁帶有星號 (*) 的變更在本節開頭進行了解釋。

#### 型別推斷 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                                       |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [KT-64189](https://youtrack.jetbrains.com/issue/KT-64189) | 如果型別明確為 Normal，則屬性引用編譯函數簽名中的型別不正確 |
| [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986) | 在建置器推斷上下文中，禁止隱式將型別變數推斷為上限 |
| [KT-59275](https://youtrack.jetbrains.com/issue/KT-59275) | K2: 陣列字面值中泛型註釋呼叫需要明確的型別引數 |
| [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752) | 遺漏了交集型別的子型別檢查 |
| [KT-59138](https://youtrack.jetbrains.com/issue/KT-59138) | 更改 Kotlin 中基於 Java 型別參數的型別的預設表示方式 |
| [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178) | 將前置遞增的推斷型別更改為 getter 的回傳型別，而不是 inc() 運算子的回傳型別 |
| [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609) | K2: 停止依賴用於逆變參數的 @UnsafeVariance 的存在 |
| [KT-57620](https://youtrack.jetbrains.com/issue/KT-57620) | K2: 禁止解析為原始型別的 subsumed 成員 |
| [KT-64641](https://youtrack.jetbrains.com/issue/KT-64641) | K2: 正確推斷帶有擴展函數參數的可呼叫引用的型別 |
| [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011) | 使解構變數的實際型別在指定時與明確型別保持一致 |
| [KT-38895](https://youtrack.jetbrains.com/issue/KT-38895) | K2: 修復整數字面值溢出的不一致行為 |
| [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862) | 匿名型別可以從型別引數的匿名函數中暴露 |
| [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379) | 帶有 break 的 while 迴圈條件可能會產生不健全的智慧型轉型 |
| [KT-62507](https://youtrack.jetbrains.com/issue/KT-62507) | K2: 禁止在公共程式碼中對預期/實際頂層屬性進行智慧型轉型 |
| [KT-65750](https://youtrack.jetbrains.com/issue/KT-65750) | 改變回傳型別的遞增和加號運算子必須影響智慧型轉型 |
| [KT-65349](https://youtrack.jetbrains.com/issue/KT-65349) | [LC] K2: 在某些情況下明確指定變數型別會破壞在 K1 中有效的繫結智慧型轉型 |

#### 泛型 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                    | 標題                                                                                                                                                  |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)* | [棄用投射接收器上的合成 setter](#deprecated-synthetics-setter-on-a-projected-receiver) |
| [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)  | 禁止使用泛型型別參數覆寫帶有原始型別參數的 Java 方法 |
| [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)  | 禁止將可能可空型別參數傳遞給 `in` 投射的 DNN 參數 |
| [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)  | 棄用型別別名建構子中的上限違規 |
| [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)  | 修復基於 Java 類別的逆變捕獲型別的型別不健全性 |
| [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)  | 禁止包含自上界和捕獲型別的不健全程式碼 |
| [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)  | 禁止泛型外部類別的泛型內部類別中不健全的界限違規 |
| [KT-62923](https://youtrack.jetbrains.com/issue/KT-62923)  | K2: 為內部類別的外部超型別投射引入 PROJECTION_IN_IMMEDIATE_ARGUMENT_TO_SUPERTYPE |
| [KT-63243](https://youtrack.jetbrains.com/issue/KT-63243)  | 當從原始型別集合繼承並帶有來自另一個超型別的額外專門實現時，報告 MANY_IMPL_MEMBER_NOT_IMPLEMENTED |
| [KT-60305](https://youtrack.jetbrains.com/issue/KT-60305)  | K2: 禁止對在展開型別中具有變異性修飾符的型別別名進行建構子呼叫和繼承 |
| [KT-64965](https://youtrack.jetbrains.com/issue/KT-64965)  | 修復因不當處理帶有自上界的捕獲型別而導致的型別漏洞 |
| [KT-64966](https://youtrack.jetbrains.com/issue/KT-64966)  | 禁止泛型委託建構子呼叫中泛型參數的型別錯誤 |
| [KT-65712](https://youtrack.jetbrains.com/issue/KT-65712)  | 當上限為捕獲型別時，報告遺漏的上限違規 |

#### 解析 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                    | 標題                                                                                                                                                                                         |
|------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-55017](https://youtrack.jetbrains.com/issue/KT-55017)* | [在具有來自基類別的 Java 欄位的重載解析期間，從派生類別中選擇 Kotlin 屬性](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name) |
| [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)  | 使 invoke 慣例與預期去糖化保持一致 |
| [KT-62866](https://youtrack.jetbrains.com/issue/KT-62866)  | K2: 當伴生物件優先於靜態作用域時，改變限定符解析行為 |
| [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)  | 解析型別並星號導入同名類別時報告歧義錯誤 |
| [KT-63558](https://youtrack.jetbrains.com/issue/KT-63558)  | K2: 遷移 COMPATIBILITY_WARNING 周圍的解析 |
| [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)  | 當依賴類別包含在同一依賴的兩個不同版本中時，誤報 CONFLICTING_INHERITED_MEMBERS |
| [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)  | 帶接收器的函數型別的屬性調用優先於擴展函數調用 |
| [KT-51666](https://youtrack.jetbrains.com/issue/KT-51666)  | 限定符 this: 引入/優先處理帶有型別案例的限定符 this |
| [KT-54166](https://youtrack.jetbrains.com/issue/KT-54166)  | 確認類別路徑中 FQ 名稱衝突時未指定行為 |
| [KT-64431](https://youtrack.jetbrains.com/issue/KT-64431)  | K2: 禁止在導入中使用型別別名作為限定符 |
| [KT-56520](https://youtrack.jetbrains.com/issue/KT-56520)  | K1/K2: 對於在較低層級存在歧義的型別引用，解析塔工作不正確 |

#### 可見性 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                     | 標題                                                                                                                           |
|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| [KT-64474](https://youtrack.jetbrains.com/issue/KT-64474/)* | [將不可存取型別的使用宣告為未指定行為](#forbidden-use-of-inaccessible-generic-types) |
| [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)   | 從內部內聯函數呼叫私有類別伴生物件成員時誤報 PRIVATE_CLASS_MEMBER_FROM_INLINE |
| [KT-58042](https://youtrack.jetbrains.com/issue/KT-58042)   | 即使覆寫的宣告可見，如果等效的 getter 不可見，則使合成屬性不可見 |
| [KT-64255](https://youtrack.jetbrains.com/issue/KT-64255)   | 禁止從另一個模組中的派生類別存取內部 setter |
| [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)   | 禁止從私有內聯函數中暴露匿名型別 |
| [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)   | 禁止從公共 API 內聯函數進行隱式非公共 API 存取 |
| [KT-56310](https://youtrack.jetbrains.com/issue/KT-56310)   | 智慧型轉型不應影響受保護成員的可見性 |
| [KT-65494](https://youtrack.jetbrains.com/issue/KT-65494)   | 禁止從公共內聯函數存取被忽略的私有運算子函數 |
| [KT-65004](https://youtrack.jetbrains.com/issue/KT-65004)   | K1: 覆寫受保護 val 的 var 的 Setter 被生成為 public |
| [KT-64972](https://youtrack.jetbrains.com/issue/KT-64972)   | 禁止在 Kotlin/Native 的連結時被私有成員覆寫 |

#### 註釋 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                                   |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [KT-58723](https://youtrack.jetbrains.com/issue/KT-58723) | 如果註釋沒有 EXPRESSION 目標，則禁止用註釋標註語句 |
| [KT-49930](https://youtrack.jetbrains.com/issue/KT-49930) | 在 `REPEATED_ANNOTATION` 檢查期間忽略括號表達式 |
| [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422) | K2: 禁止在屬性 getter 上使用 site 'get' 目標註釋 |
| [KT-46483](https://youtrack.jetbrains.com/issue/KT-46483) | 禁止在 where 子句中對型別參數進行註釋 |
| [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299) | 伴生物件上註釋的解析會忽略伴生作用域 |
| [KT-64654](https://youtrack.jetbrains.com/issue/KT-64654) | K2: 引入使用者與編譯器所需註釋之間的歧義 |
| [KT-64527](https://youtrack.jetbrains.com/issue/KT-64527) | 枚舉值上的註釋不應複製到枚舉值類別 |
| [KT-63389](https://youtrack.jetbrains.com/issue/KT-63389) | K2: 對於包裝在 `()?` 中的型別的不兼容註釋，會報告 `WRONG_ANNOTATION_TARGET` |
| [KT-63388](https://youtrack.jetbrains.com/issue/KT-63388) | K2: 對於 catch 參數型別的註釋，會報告 `WRONG_ANNOTATION_TARGET` |

#### 空安全性 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                    | 標題                                                                                                                    |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| [KT-54521](https://youtrack.jetbrains.com/issue/KT-54521)* | [棄用 Java 中標註為 Nullable 的陣列型別的不安全用法](#improved-null-safety-for-java-primitive-arrays) |
| [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)  | K2: 改變安全呼叫和慣例運算子組合的評估語義 |
| [KT-50850](https://youtrack.jetbrains.com/issue/KT-50850)  | 超型別的順序定義繼承函數的可空性參數 |
| [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)  | 在公共簽名中近似本地型別時保留可空性 |
| [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)  | 禁止將可空值賦值給非空 Java 欄位作為不安全賦值的選擇器 |
| [KT-63209](https://youtrack.jetbrains.com/issue/KT-63209)  | 報告警告級別 Java 型別的錯誤級別可空引數的遺漏錯誤 |

#### Java 互操作性 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                                       |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [KT-53061](https://youtrack.jetbrains.com/issue/KT-53061) | 禁止原始碼中存在同名 FQ 的 Java 和 Kotlin 類別 |
| [KT-49882](https://youtrack.jetbrains.com/issue/KT-49882) | 繼承自 Java 集合的類別根據超型別的順序具有不一致的行為 |
| [KT-66324](https://youtrack.jetbrains.com/issue/KT-66324) | K2: Java 類別繼承自 Kotlin 私有類別時的未指定行為 |
| [KT-66220](https://youtrack.jetbrains.com/issue/KT-66220) | 將 Java vararg 方法傳遞給內聯函數會導致運行時出現陣列的陣列而不是單一陣列 |
| [KT-66204](https://youtrack.jetbrains.com/issue/KT-66204) | 允許在 K-J-K 繼承中覆寫內部成員 |

#### 屬性 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                    | 標題                                                                                                                                          |
|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-57555](https://youtrack.jetbrains.com/issue/KT-57555)* | [[LC] 禁止延遲初始化帶有後備欄位的開放屬性](#immediate-initialization-of-open-properties-with-backing-fields) |
| [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)  | 當沒有主建構子或類別是本地時，棄用遺漏的 MUST_BE_INITIALIZED |
| [KT-64295](https://youtrack.jetbrains.com/issue/KT-64295)  | 禁止在屬性上潛在的 invoke 呼叫情況下進行遞迴解析 |
| [KT-57290](https://youtrack.jetbrains.com/issue/KT-57290)  | 如果基類來自另一個模組，則棄用從不可見派生類別對基類屬性進行智慧型轉型 |
| [KT-62661](https://youtrack.jetbrains.com/issue/KT-62661)  | K2: 資料類別屬性遺漏 OPT_IN_USAGE_ERROR |

#### 控制流 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                       |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------|
| [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408) | K1 和 K2 之間類別初始化區塊中 CFA 規則不一致 |
| [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871) | K1/K2 在不帶 else 分支的 if 條件式中括號內的不一致 |
| [KT-42995](https://youtrack.jetbrains.com/issue/KT-42995) | 在帶有作用域函數初始化的 try/catch 區塊中誤報 "VAL_REASSIGNMENT" |
| [KT-65724](https://youtrack.jetbrains.com/issue/KT-65724) | 將資料流資訊從 try 區塊傳播到 catch 和 finally 區塊 |

#### 枚舉類別 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                         |
|-----------------------------------------------------------|----------------------------------------------------------------------------------------------|
| [KT-57608](https://youtrack.jetbrains.com/issue/KT-57608) | 禁止在枚舉條目初始化期間訪問枚舉類別的伴生物件 |
| [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372) | 報告枚舉類別中虛擬內聯方法遺漏的錯誤 |
| [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802) | 報告屬性/欄位和枚舉條目之間的解析歧義 |
| [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310) | 當伴生屬性優先於枚舉條目時，改變限定符解析行為 |

#### 函數式 (SAM) 介面 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                                            |
|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628) | 棄用在沒有註釋的情況下需要 OptIn 的 SAM 建構子用法 |
| [KT-57014](https://youtrack.jetbrains.com/issue/KT-57014) | 禁止從 lambda 返回具有不正確空值性的值，用於 JDK 函數介面的 SAM 建構子 |
| [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342) | 可呼叫引用的參數型別的 SAM 轉換導致 CCE |

#### 伴生物件 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                     |
|-----------------------------------------------------------|--------------------------------------------------------------------------|
| [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316) | 伴生物件成員的外部呼叫引用具有無效簽名 |
| [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313) | 當 V 具有伴生物件時，改變 (V)::foo 引用解析 |

#### 其他 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                    | 標題                                                                                                                                       |
|------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-59739](https://youtrack.jetbrains.com/issue/KT-59739)* | K2/MPP 在繼承者位於公共程式碼中但實現位於實際對應部分時報告 [ABSTRACT_MEMBER_NOT_IMPLEMENTED] |
| [KT-49015](https://youtrack.jetbrains.com/issue/KT-49015)  | 限定符 this: 在潛在標籤衝突情況下改變行為 |
| [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)  | 修復 JVM 後端在 Java 子類中意外衝突重載時的函數名稱破壞問題 |
| [KT-62019](https://youtrack.jetbrains.com/issue/KT-62019)  | [LC 問題] 禁止在語句位置宣告帶有 suspend 標記的匿名函數 |
| [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)  | OptIn: 禁止在標記下帶預設引數的建構子呼叫 |
| [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)  | Unit 轉換意外地允許用於變數上的表達式 + invoke 解析 |
| [KT-55199](https://youtrack.jetbrains.com/issue/KT-55199)  | 禁止將帶有適配的可呼叫引用提升為 KFunction |
| [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)  | [LC] K2 打破了 `false && ...` 和 `false || ...` |
| [KT-65682](https://youtrack.jetbrains.com/issue/KT-65682)  | [LC] 棄用 `header`/`impl` 關鍵字 |
| [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)  | 預設透過 invokedynamic + LambdaMetafactory 生成所有 Kotlin lambda |

## 與 Kotlin 版本的相容性

以下 Kotlin 版本支援新的 K2 編譯器：

| Kotlin 版本        | 穩定性層級 |
|-----------------------|-----------------|
| 2.0.0–%kotlinVersion% | 穩定          |
| 1.9.20–1.9.25         | Beta            |
| 1.9.0–1.9.10          | JVM 為 Beta     |
| 1.7.0–1.8.22          | Alpha           |

## 與 Kotlin 函式庫的相容性

如果您使用 Kotlin/JVM，K2 編譯器可與任何 Kotlin 版本編譯的函式庫搭配使用。

如果您使用 Kotlin 多平台，K2 編譯器保證可與 Kotlin 1.9.20 及更高版本編譯的函式庫搭配使用。

## 編譯器插件支援

目前，Kotlin K2 編譯器支援以下 Kotlin 編譯器插件：

*   [`all-open`](all-open-plugin.md)
*   [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
*   [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
*   [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
*   [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
*   [Lombok](lombok.md)
*   [`no-arg`](no-arg-plugin.md)
*   [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
*   [SAM with receiver](sam-with-receiver-plugin.md)
*   [Serialization](serialization.md)

此外，Kotlin K2 編譯器還支援：

*   [Jetpack Compose](https://developer.android.com/jetpack/compose) 1.5.0 編譯器插件及更高版本。
*   [Kotlin Symbol Processing (KSP)](ksp-overview.md) 自 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 開始。

> 如果您使用任何額外的編譯器插件，請查閱其文件以確認它們是否與 K2 相容。
>
{style="tip"}

### 升級您的自訂編譯器插件

> 自訂編譯器插件使用插件 API，該 API 處於[實驗性 (Experimental)](components-stability.md#stability-levels-explained) 階段。因此，API 可能會隨時更改，因此我們無法保證向後兼容性。
>
{style="warning"}

升級過程有兩種路徑，取決於您擁有的自訂插件類型。

#### 僅後端編譯器插件

如果您的插件僅實作 `IrGenerationExtension` 擴展點，則流程與任何其他新的編譯器發布相同。檢查您使用的 API 是否有任何更改，並在必要時進行更改。

#### 後端和前端編譯器插件

如果您的插件使用與前端相關的擴展點，則需要使用新的 K2 編譯器 API 重寫該插件。有關新 API 的介紹，請參閱 [FIR Plugin API](https://github.com/JetBrains/kotlin/blob/master/docs/fir/fir-plugins.md)。

> 如果您對升級自訂編譯器插件有疑問，請加入我們的 [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) Slack 頻道，我們將盡力為您提供幫助。
>
{style="note"}

## 分享您對新 K2 編譯器的回饋

我們非常感謝您提供的任何回饋！

*   在[我們的問題追蹤器](https://youtrack.jetbrains.com/newIssue?project=KT&summary=K2+release+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+k2-release-migration)中報告您在遷移到新 K2 編譯器時遇到的任何問題。
*   [啟用發送使用情況統計選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，允許 JetBrains 收集有關 K2 使用情況的匿名資料。