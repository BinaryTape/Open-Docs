[//]: # (title: K2 編譯器遷移指南)

隨著 Kotlin 語言和生態系統的不斷演進，Kotlin 編譯器也隨之發展。第一步是引入了新的 JVM 和 JS IR（中介表示法）後端，這些後端共享邏輯，簡化了針對不同平台目標的程式碼生成。現在，其演進的下一個階段帶來了一個名為 K2 的新前端。

![Kotlin K2 compiler architecture](k2-compiler-architecture.svg){width=700}

隨著 K2 編譯器的到來，Kotlin 前端已被完全重寫，並具備了嶄新且更有效率的架構。新編譯器帶來的根本性變化是採用了一種統一的資料結構，其中包含更多語義資訊。此前端負責執行語義分析、呼叫解析和型別推斷。

新架構和豐富的資料結構使 K2 編譯器能夠提供以下優勢：

*   **改進的呼叫解析和型別推斷**。編譯器行為更一致，並能更好地理解您的程式碼。
*   **更容易為新語言功能引入語法糖**。未來，當新功能引入時，您將能夠使用更簡潔、更具可讀性的程式碼。
*   **更快的編譯時間**。編譯時間可以[顯著加快](#performance-improvements)。
*   **提升的 IDE 效能**。從 2025.1 版開始，IntelliJ IDEA 使用 K2 模式分析您的 Kotlin 程式碼，提高了穩定性並提供了效能改進。有關更多資訊，請參閱[在 IDE 中的支援](#support-in-ides)。

本指南：

*   解釋新 K2 編譯器的好處。
*   強調您在遷移過程中可能遇到的變化以及如何相應調整程式碼。
*   描述如何回溯到先前的版本。

> 從 2.0.0 版開始，新的 K2 編譯器預設啟用。有關 Kotlin 2.0.0 中提供的新功能以及新 K2 編譯器的更多資訊，請參閱 [Kotlin 2.0.0 中的新功能](whatsnew20.md)。
>
{style="note"}

## 效能改進

為了評估 K2 編譯器的效能，我們對兩個開源專案：[Anki-Android](https://github.com/ankidroid/Anki-Android) 和 [Exposed](https://github.com/JetBrains/Exposed) 進行了效能測試。以下是我們發現的主要效能改進：

*   K2 編譯器帶來高達 94% 的編譯速度提升。例如，在 Anki-Android 專案中，Clean Build 時間從 Kotlin 1.9.23 的 57.7 秒減少到 Kotlin 2.0.0 的 29.7 秒。
*   K2 編譯器使初始化階段速度提升高達 488%。例如，在 Anki-Android 專案中，增量建構的初始化階段從 Kotlin 1.9.23 的 0.126 秒縮短到 Kotlin 2.0.0 的僅 0.022 秒。
*   與先前的編譯器相比，Kotlin K2 編譯器在分析階段速度提升高達 376%。例如，在 Anki-Android 專案中，增量建構的分析時間從 Kotlin 1.9.23 的 0.581 秒大幅縮短到 Kotlin 2.0.0 的僅 0.122 秒。

有關這些改進的更多詳細資訊，以及了解我們如何分析 K2 編譯器效能的資訊，請參閱我們的[部落格文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)。

## 語言功能改進

Kotlin K2 編譯器改進了與[智慧型轉型](#smart-casts)和[Kotlin 多平台](#kotlin-multiplatform)相關的語言功能。

### 智慧型轉型

在特定情況下，Kotlin 編譯器可以自動將物件轉型為某個型別，省去了您手動明確指定的麻煩。這稱為[智慧型轉型](typecasts.md#smart-casts)。Kotlin K2 編譯器現在在比以往更多的情境中執行智慧型轉型。

在 Kotlin 2.0.0 中，我們改進了以下領域的智慧型轉型相關功能：

*   [局部變數和更深層的作用域](#local-variables-and-further-scopes)
*   [使用邏輯 `or` 運算子的型別檢查](#type-checks-with-the-logical-or-operator)
*   [內聯函式](#inline-functions)
*   [帶有函式型別的屬性](#properties-with-function-types)
*   [例外處理](#exception-handling)
*   [遞增和遞減運算子](#increment-and-decrement-operators)

#### 局部變數和更深層的作用域

以前，如果變數在 `if` 條件中被評估為非 `null`，則該變數會被智慧型轉型。有關此變數的資訊隨後將在 `if` 區塊的範圍內進一步共享。

然而，如果您在 `if` 條件**外部**宣告變數，則 `if` 條件內將沒有關於該變數的資訊，因此無法進行智慧型轉型。`when` 表達式和 `while` 迴圈也出現了這種行為。

從 Kotlin 2.0.0 開始，如果您在使用變數之前在 `if`、`when` 或 `while` 條件中宣告它，則編譯器收集到的任何關於該變數的資訊都將在相應的區塊中可用於智慧型轉型。

這在您想要將布林條件提取到變數中時很有用。然後，您可以為變數賦予一個有意義的名稱，這將提高程式碼的可讀性，並使您以後可以在程式碼中重複使用該變數。例如：

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

#### 使用邏輯 `or` 運算子的型別檢查

在 Kotlin 2.0.0 中，如果您使用 `or` 運算子 (`||`) 結合物件的型別檢查，則會將其智慧型轉型為最接近的共同父型別。在此變更之前，智慧型轉型總是轉型為 `Any` 型別。

在這種情況下，您仍然必須手動檢查物件型別，然後才能存取其任何屬性或呼叫其函式。例如：

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

> 共同父型別是[聯集型別](https://en.wikipedia.org/wiki/Union_type)的**近似值**。Kotlin [目前不支援聯集型別](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

#### 內聯函式

在 Kotlin 2.0.0 中，K2 編譯器對內聯函式的處理方式不同，
允許它結合其他編譯器分析來判斷智慧型轉型是否安全。

具體來說，內聯函式現在被視為具有隱式的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)
契約。這表示傳遞給內聯函式的任何 lambda 函式都會在原地呼叫。由於 lambda 函式在原地呼叫，編譯器知道 lambda 函式不會洩漏對其函式主體中包含的任何變數的參考。

編譯器利用這些知識以及其他編譯器分析來判斷智慧型轉型任何捕獲的變數是否安全。例如：

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

#### 帶有函式型別的屬性

在 Kotlin 先前版本中，存在一個錯誤，導致具有函式型別的類別屬性無法進行智慧型轉型。我們在 Kotlin 2.0.0 和 K2 編譯器中修復了此行為。例如：

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

此變更也適用於您重載 `invoke` 運算子的情況。例如：

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

#### 例外處理

在 Kotlin 2.0.0 中，我們改進了例外處理，以便智慧型轉型資訊可以傳遞到 `catch` 和 `finally` 區塊。這項變更使您的程式碼更安全，因為編譯器會追蹤您的物件是否具有可空型別。例如：

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

在 Kotlin 2.0.0 之前，編譯器不理解物件的型別在使用遞增或遞減運算子後可能會改變。由於編譯器無法準確追蹤物件型別，您的程式碼可能會導致未解析的參考錯誤。在 Kotlin 2.0.0 中，這已得到修復：

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

K2 編譯器在以下領域對 Kotlin 多平台進行了改進：

*   [編譯期間共同和平台原始碼的分離](#separation-of-common-and-platform-sources-during-compilation)
*   [預期與實際宣告的不同可見性等級](#different-visibility-levels-of-expected-and-actual-declarations)

#### 編譯期間共同和平台原始碼的分離

以前，Kotlin 編譯器的設計阻止了它在編譯時將共同和平台原始碼集分開。因此，共同程式碼可以存取平台程式碼，這導致了平台之間的不同行為。此外，一些來自共同程式碼的編譯器設定和依賴關係也曾洩漏到平台程式碼中。

在 Kotlin 2.0.0 中，我們對新 Kotlin K2 編譯器的實作包括了編譯方案的重新設計，以確保共同和平台原始碼集之間嚴格分離。當您使用[預期與實際函式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions)時，這項變更最為顯著。以前，您的共同程式碼中的函式呼叫可能會解析為平台程式碼中的函式。例如：

<table>
   <tr>
       <td>共同程式碼</td>
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

在此範例中，共同程式碼根據其執行的平台具有不同的行為：

*   在 JVM 平台上，共同程式碼中呼叫 `foo()` 函式會導致呼叫平台程式碼中的 `foo()` 函式，顯示為 `platform foo`。
*   在 JavaScript 平台上，共同程式碼中呼叫 `foo()` 函式會導致呼叫共同程式碼中的 `foo()` 函式，顯示為 `common foo`，因為平台程式碼中沒有此函式。

在 Kotlin 2.0.0 中，共同程式碼無法存取平台程式碼，因此兩個平台都成功地將 `foo()` 函式解析為共同程式碼中的 `foo()` 函式：`common foo`。

除了改進跨平台行為的一致性之外，我們還努力修復了 IntelliJ IDEA 或 Android Studio 與編譯器之間行為衝突的情況。例如，當您使用[預期與實際類別](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes)時，會發生以下情況：

<table>
   <tr>
       <td>共同程式碼</td>
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

在此範例中，預期類別 `Identity` 沒有預設建構函式，因此無法在共同程式碼中成功呼叫。以前，錯誤僅由 IDE 報告，但程式碼仍在 JVM 上成功編譯。然而，現在編譯器正確地報告錯誤：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 何時解析行為不變

我們仍在遷移到新編譯方案的過程中，因此當您呼叫不在同一原始碼集內的函式時，解析行為仍然相同。您主要會在共同程式碼中使用多平台函式庫的重載時注意到這種差異。

假設您有一個函式庫，其中有兩個具有不同簽章的 `whichFun()` 函式：

```kotlin
// Example library

// MODULE: common
fun whichFun(x: Any) = println("common function") 

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在共同程式碼中呼叫 `whichFun()` 函式，則函式庫中具有最相關引數型別的函式將被解析：

```kotlin
// A project that uses the example library for the JVM target

// MODULE: common
fun main(){
    whichFun(2) 
    // platform function
}
```

相比之下，如果您在同一原始碼集內宣告 `whichFun()` 的重載，則共同程式碼中的函式將被解析，因為您的程式碼無法存取特定於平台的版本：

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

與多平台函式庫類似，由於 `commonTest` 模組位於單獨的原始碼集，它仍然可以存取平台特定程式碼。因此，對 `commonTest` 模組中函式的呼叫解析行為與舊的編譯方案相同。

未來，這些剩餘的案例將與新的編譯方案更加一致。

#### 預期與實際宣告的不同可見性等級

在 Kotlin 2.0.0 之前，如果您在 Kotlin 多平台專案中使用[預期與實際宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，它們必須具有相同的[可見性等級](visibility-modifiers.md)。
Kotlin 2.0.0 現在也支援不同的可見性等級，但**僅限於**實際宣告比預期宣告 _更具_ 寬容性時。例如：

```kotlin
expect internal class Attribute // Visibility is internal
actual class Attribute          // Visibility is public by default,
                                // which is more permissive
```

同樣，如果您在實際宣告中使用[型別別名](type-aliases.md)，則**底層型別**的可見性應與預期宣告相同或更具寬容性。例如：

```kotlin
expect internal class Attribute                 // Visibility is internal
internal actual typealias Attribute = Expanded

class Expanded                                  // Visibility is public by default,
                                                // which is more permissive
```

## 如何啟用 Kotlin K2 編譯器

從 Kotlin 2.0.0 開始，Kotlin K2 編譯器預設啟用。

要升級 Kotlin 版本，請在您的 [Gradle](gradle-configure-project.md#apply-the-plugin) 和 [Maven](maven.md#configure-and-enable-the-plugin) 建構腳本中將其更改為 2.0.0 或更高版本。

為了在 IntelliJ IDEA 或 Android Studio 中獲得最佳體驗，請考慮在您的 IDE 中[啟用 K2 模式](#support-in-ides)。

### 使用 Gradle 建構報告

Kotlin [建構報告](gradle-compilation-and-caches.md#build-reports)提供了 Kotlin 編譯器任務在不同編譯階段所花費時間的資訊，以及使用了哪個編譯器和 Kotlin 版本，以及編譯是否為增量編譯。這些建構報告對於評估您的建構效能很有用。它們比 [Gradle 建構掃描](https://scans.gradle.com/)提供了更多關於 Kotlin 編譯流程的洞察，因為它們提供了所有 Gradle 任務的效能概覽。

#### 如何啟用建構報告

要啟用建構報告，請在您的 `gradle.properties` 檔案中宣告您希望儲存建構報告輸出的位置：

```none
kotlin.build.report.output=file
```

以下值及其組合可用於輸出：

| 選項         | 描述                                                                                                                                                                                                                                                                                                        |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file`       | 將建構報告以人類可讀的格式儲存到本機檔案。預設為 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`                                                                                                                                                                                                                          |
| `single_file` | 將建構報告以物件格式儲存到指定的本機檔案。                                                                                                                                                                                                                                                                  |
| `build_scan` | 將建構報告儲存到[建構掃描](https://scans.gradle.com/)的 `custom values` 區段中。請注意，Gradle Enterprise 外掛程式限制了自訂值的數量和長度。在大型專案中，某些值可能會丟失。                                                                                                                                                                      |
| `http`       | 使用 HTTP(S) 發布建構報告。POST 方法以 JSON 格式發送度量。您可以在[Kotlin 儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)中查看發送資料的當前版本。您可以在[此部落格文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)中找到 HTTP 端點範例。 |
| `json`       | 將建構報告以 JSON 格式儲存到本機檔案。在 `kotlin.build.report.json.directory` 中設定建構報告的位置。預設名稱為 `${project_name}-build-<date-time>-<index>.json`。                                                                                                                                                                                        |

有關建構報告功能的更多資訊，請參閱[建構報告](gradle-compilation-and-caches.md#build-reports)。

## 在 IDE 中的支援

IntelliJ IDEA 和 Android Studio 中的 K2 模式使用 K2 編譯器來改進程式碼分析、程式碼完成和語法高亮。

從 IntelliJ IDEA 2025.1 開始，K2 模式[預設啟用](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/)。

在 Android Studio 中，您可以從 2024.1 版本開始透過以下步驟啟用 K2 模式：

1.  前往 **Settings** | **Languages & Frameworks** | **Kotlin**。
2.  選取 **Enable K2 mode** 選項。

### 先前的 IDE 行為 {initial-collapse-state="collapsed" collapsible="true"}

如果您想恢復到先前的 IDE 行為，可以停用 K2 模式：

1.  前往 **Settings** | **Languages & Frameworks** | **Kotlin**。
2.  取消選取 **Enable K2 mode** 選項。

> 我們計畫在 Kotlin 2.1.0 之後引入[穩定](components-stability.md#stability-levels-explained)的語言功能。
> 在此之前，您可以繼續使用先前的 IDE 功能進行程式碼分析，並且不會遇到由於無法識別的語言功能而導致的程式碼高亮問題。
>
{style="note"}

## 在 Kotlin Playground 中試用 Kotlin K2 編譯器

Kotlin Playground 支援 Kotlin 2.0.0 及更高版本。快來[試試看！](https://pl.kotl.in/czuoQprce)

## 如何回溯到先前的編譯器

要在 Kotlin 2.0.0 及更高版本中使用先前的編譯器，請執行以下操作：

*   在您的 `build.gradle.kts` 檔案中，將[語言版本](gradle-compiler-options.md#example-of-setting-languageversion)設定為 `1.9`。

  或
*   使用以下編譯器選項：`-language-version 1.9`。

## 變更

隨著新前端的引入，Kotlin 編譯器經歷了多項變革。讓我們先強調影響您程式碼的最重要修改，解釋這些變革的內容，並詳細說明未來的最佳實踐。如果您想了解更多資訊，我們已將這些變更整理到[主題領域](#per-subject-area)中，以便您進一步閱讀。

本節重點介紹以下修改：

*   [帶有支援欄位的 open 屬性的立即初始化](#immediate-initialization-of-open-properties-with-backing-fields)
*   [棄用投影接收器上的合成 setter](#deprecated-synthetics-setter-on-a-projected-receiver)
*   [禁止使用不可存取泛型型別](#forbidden-use-of-inaccessible-generic-types)
*   [Kotlin 屬性和同名 Java 欄位的一致解析順序](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
*   [Java 基本型別陣列的空安全改進](#improved-null-safety-for-java-primitive-arrays)
*   [預期類別中抽象成員的更嚴格規則](#stricter-rules-for-abstract-members-in-expected-classes)

### 帶有支援欄位的 open 屬性的立即初始化

**有什麼變化？**

在 Kotlin 2.0 中，所有帶有支援欄位的 `open` 屬性都必須立即初始化；否則，您將收到編譯錯誤。以前，只有 `open var` 屬性需要立即初始化，但現在這也延伸到帶有支援欄位的 `open val` 屬性：

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

這項變更使得編譯器的行為更具可預測性。考慮一個 `open val` 屬性被帶有自訂 setter 的 `var` 屬性覆寫的範例。

如果使用自訂 setter，延遲初始化可能會導致混淆，因為不清楚您是要初始化支援欄位還是呼叫 setter。過去，如果您想呼叫 setter，舊編譯器無法保證 setter 會初始化支援欄位。

**現在的最佳實踐是什麼？**

我們鼓勵您始終使用支援欄位初始化 `open` 屬性，因為我們認為這種做法既高效又不易出錯。

然而，如果您不想立即初始化屬性，您可以：

*   將屬性設為 `final`。
*   使用允許延遲初始化的私有支援屬性。

有關更多資訊，請參閱 [YouTrack 中的相關問題](https://youtrack.jetbrains.com/issue/KT-57555)。

### 棄用投影接收器上的合成 setter

**有什麼變化？**

如果您使用 Java 類別的合成 setter 來賦值與該類別的投影型別衝突的型別，則會觸發錯誤。

假設您有一個名為 `Container` 的 Java 類別，其中包含 `getFoo()` 和 `setFoo()` 方法：

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

如果您有以下 Kotlin 程式碼，其中 `Container` 類別的實例具有投影型別，則使用 `setFoo()` 方法將始終產生錯誤。然而，只有從 Kotlin 2.0.0 開始，合成的 `foo` 屬性才會觸發錯誤：

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

如果您發現此變更在程式碼中引入了錯誤，您可能希望重新考慮型別宣告的結構。這可能是您不需要使用型別投影，或者您可能需要從程式碼中移除任何賦值。

有關更多資訊，請參閱 [YouTrack 中的相關問題](https://youtrack.jetbrains.com/issue/KT-54309)。

### 禁止使用不可存取泛型型別

**有什麼變化？**

由於我們 K2 編譯器的新架構，我們改變了處理不可存取泛型型別的方式。通常，您不應在程式碼中依賴不可存取泛型型別，因為這表示您的專案建構配置有誤，阻礙了編譯器存取必要的編譯資訊。在 Kotlin 2.0.0 中，您不能宣告或呼叫帶有不可存取泛型型別的函式字面值，也不能使用帶有不可存取泛型型別引數的泛型型別。此限制可幫助您避免稍後在程式碼中出現編譯器錯誤。

例如，假設您在一個模組中宣告了一個泛型類別：

```kotlin
// Module one
class Node<V>(val value: V)
```

如果您有另一個模組（模組二）配置了對模組一的依賴，您的程式碼就可以存取 `Node<V>` 類別並將其用作函式型別中的型別：

```kotlin
// Module two
fun execute(func: (Node<Int>) -> Unit) {}
// Function compiles successfully
```

然而，如果您的專案配置錯誤，以至於您有第三個模組（模組三）僅依賴於模組二，則 Kotlin 編譯器在編譯第三個模組時將無法存取**模組一**中的 `Node<V>` 類別。現在，模組三中任何使用 `Node<V>` 型別的 lambda 或匿名函式都會在 Kotlin 2.0.0 中觸發錯誤，從而防止稍後在程式碼中出現可避免的編譯器錯誤、崩潰和執行時例外：

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

除了函式字面值在包含不可存取泛型型別的實值參數時觸發錯誤之外，當型別具有不可存取泛型型別引數時也會發生錯誤。

例如，您在模組一中具有相同的泛型類別宣告。在模組二中，您宣告了另一個泛型類別：`Container<C>`。此外，您在模組二中宣告了使用 `Container<C>` 和泛型類別 `Node<V>` 作為型別引數的函式：

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

如果您嘗試在模組三中呼叫這些函式，則會在 Kotlin 2.0.0 中觸發錯誤，因為泛型類別 `Node<V>` 無法從模組三存取：

```kotlin
// Module three
fun test() {
    // Triggers an error in Kotlin 2.0.0, as generic class Node<V> is 
    // inaccessible
    consume(produce())
}
```

在未來的版本中，我們將繼續普遍棄用不可存取型別的使用。我們已在 Kotlin 2.0.0 中開始，為某些具有不可存取型別（包括非泛型型別）的情境添加警告。

例如，讓我們使用與先前範例相同的模組設定，但將泛型類別 `Node<V>` 轉換為非泛型類別 `IntNode`，所有函式都在模組二中宣告：

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

如果您在模組三中呼叫這些函式，則會觸發一些警告：

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

如果您遇到關於不可存取泛型型別的新警告，很有可能您的建構系統配置存在問題。我們建議您檢查建構腳本和配置。

作為最後的手段，您可以為模組三配置對模組一的直接依賴。或者，您可以修改程式碼以使型別在同一模組內可存取。

有關更多資訊，請參閱 [YouTrack 中的相關問題](https://youtrack.jetbrains.com/issue/KT-64474)。

### Kotlin 屬性和同名 Java 欄位的一致解析順序

**有什麼變化？**

在 Kotlin 2.0.0 之前，如果您處理相互繼承且包含相同名稱的 Kotlin 屬性及 Java 欄位的 Java 和 Kotlin 類別，重複名稱的解析行為會不一致。IntelliJ IDEA 和編譯器之間也存在衝突行為。在為 Kotlin 2.0.0 開發新的解析行為時，我們的目標是將對使用者的影響降到最低。

例如，假設有一個 Java 類別 `Base`：

```java
public class Base {
    public String a = "a";

    public String b = "b";
}
```

假設還有一個 Kotlin 類別 `Derived`，它繼承自上述的 `Base` 類別：

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

> 在 Kotlin 2.0.0 之前，如果您使用 IntelliJ IDEA 跳轉到 `a` 的宣告或使用位置，它會錯誤地導航到 Java 欄位，而實際上應該導航到 Kotlin 屬性。
>
> 從 Kotlin 2.0.0 開始，IntelliJ IDEA 會正確地導航到與編譯器相同的位置。
>
{style="note"}

一般規則是子類別優先。先前的範例證明了這一點，因為 `Derived` 類別的 Kotlin 屬性 `a` 被解析，因為 `Derived` 是 `Base` Java 類別的子類別。

如果繼承反轉，並且 Java 類別繼承自 Kotlin 類別，則子類別中的 Java 欄位優先於同名的 Kotlin 屬性。

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

如果此變更影響您的程式碼，請考慮您是否真的需要使用重複的名稱。如果您希望 Java 或 Kotlin 類別各自包含同名的欄位或屬性，並且它們彼此繼承，請記住子類別中的欄位或屬性將優先。

有關更多資訊，請參閱 [YouTrack 中的相關問題](https://youtrack.jetbrains.com/issue/KT-55017)。

### Java 基本型別陣列的空安全改進

**有什麼變化？**

從 Kotlin 2.0.0 開始，編譯器正確推斷匯入到 Kotlin 的 Java 基本型別陣列的可空性。現在，它會保留與 Java 基本型別陣列一起使用的 `TYPE_USE` 註解中的原生可空性，並在其值未按照註解使用時發出錯誤。

通常，當從 Kotlin 呼叫帶有 `@Nullable` 和 `@NotNull` 註解的 Java 型別時，它們會獲得適當的原生可空性：

```java
interface DataService {
    @NotNull ResultContainer<@Nullable String> fetchData();
}
```
```kotlin
val dataService: DataService = ... 
dataService.fetchData() // -> ResultContainer<String?>
```

以前，然而，當 Java 基本型別陣列匯入到 Kotlin 時，所有 `TYPE_USE` 註解都會丟失，導致平台可空性並可能產生不安全的程式碼：

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
請注意，此問題從未影響宣告本身的可空性註解，僅影響 `TYPE_USE` 註解。

**現在的最佳實踐是什麼？**

在 Kotlin 2.0.0 中，Java 基本型別陣列的空安全現在在 Kotlin 中是標準的，因此如果您使用它們，請檢查您的程式碼是否有新的警告和錯誤：

*   任何使用 `@Nullable` Java 基本型別陣列且未明確進行空值檢查，或嘗試將 `null` 傳遞給預期非空基本型別陣列的 Java 方法的程式碼，現在將無法編譯。
*   對 `@NotNull` 基本型別陣列進行空值檢查，現在會發出「不必要的安全呼叫」或「與 null 比較始終為 false」的警告。

有關更多資訊，請參閱 [YouTrack 中的相關問題](https://youtrack.jetbrains.com/issue/KT-54521)。

### 預期類別中抽象成員的更嚴格規則

> 預期與實際類別處於 [Beta](components-stability.md#stability-levels-explained) 階段。
> 它們幾乎穩定，但您可能需要在未來執行遷移步驟。
> 我們將盡力將您需要進行的進一步變更降至最低。
>
{style="warning"}

**有什麼變化？**

由於 K2 編譯器在編譯期間對共同原始碼和平台原始碼進行了分離，我們對預期類別中的抽象成員實施了更嚴格的規則。

使用舊的編譯器時，預期的非抽象類別可以繼承一個抽象函式而無需[覆寫該函式](inheritance.md#overriding-rules)。由於編譯器可以同時存取共同程式碼和平台程式碼，因此編譯器可以判斷該抽象函式是否在實際類別中具有對應的覆寫和定義。

現在共同原始碼和平台原始碼是分開編譯的，繼承的函式必須在預期類別中明確覆寫，以便編譯器知道該函式不是抽象的。否則，編譯器將報告 `ABSTRACT_MEMBER_NOT_IMPLEMENTED` 錯誤。

例如，假設您有一個共同原始碼集，其中宣告了一個名為 `FileSystem` 的抽象類別，它有一個抽象函式 `listFiles()`。您在平台原始碼集中將 `listFiles()` 函式定義為實際宣告的一部分。

在您的共同程式碼中，如果您有一個名為 `PlatformFileSystem` 的預期非抽象類別繼承自 `FileSystem` 類別，則 `PlatformFileSystem` 類別會繼承抽象函式 `listFiles()`。然而，在 Kotlin 中，您不能在非抽象類別中擁有抽象函式。要使 `listFiles()` 函式變成非抽象，您必須將其宣告為沒有 `abstract` 關鍵字的覆寫：

<table>
   <tr>
       <td>共同程式碼</td>
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

如果您在預期的非抽象類別中繼承抽象函式，請新增一個非抽象覆寫。

有關更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-59739/K2-MPP-reports-ABSTRACTMEMBERNOTIMPLEMENTED-for-inheritor-in-common-code-when-the-implementation-is-located-in-the-actual) 中的相關問題。

### 按主題領域

這些主題領域列出了不太可能影響您程式碼的變更，但提供了相關 YouTrack 問題的連結以供進一步閱讀。標示星號 (*) 的問題 ID 旁的變更會在該節開頭解釋。

#### 型別推斷 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                                       |
| :-------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| [KT-64189](https://youtrack.jetbrains.com/issue/KT-64189) | 編譯後函式簽章中屬性參考的型別不正確，如果型別明確為 Normal                                                |
| [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986) | 在建構器推斷上下文中，禁止隱式推斷型別變數為上限                                                           |
| [KT-59275](https://youtrack.jetbrains.com/issue/KT-59275) | K2：要求陣列字面值中泛型註解呼叫的明確型別引數                                                             |
| [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752) | 交叉型別遺漏的子型別檢查                                                                                   |
| [KT-59138](https://youtrack.jetbrains.com/issue/KT-59138) | 變更 Kotlin 中基於 Java 型別參數的型別預設表示                                                             |
| [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178) | 變更前綴遞增的推斷型別，使其返回 getter 的返回型別而不是 inc() 運算子的返回型別                          |
| [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609) | K2：停止依賴對 contravariant 參數使用 @UnsafeVariance                                                      |
| [KT-57620](https://youtrack.jetbrains.com/issue/KT-57620) | K2：禁止將原始型別解析為被包含的成員                                                                       |
| [KT-64641](https://youtrack.jetbrains.com/issue/KT-64641) | K2：正確推斷可呼叫參考的型別，該可呼叫參考具有擴展函式參數                                                   |
| [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011) | 使解構變數的真實型別與指定時的明確型別保持一致                                                             |
| [KT-38895](https://youtrack.jetbrains.com/issue/KT-38895) | K2：修復整數文字溢出的不一致行為                                                                           |
| [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862) | 匿名型別可以從型別引數中的匿名函式中公開                                                                   |
| [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379) | 帶有 break 的 while 迴圈條件可以產生不健全的智慧型轉型                                                       |
| [KT-62507](https://youtrack.jetbrains.com/issue/KT-62507) | K2：禁止在 expect/actual 頂層屬性的共同程式碼中進行智慧型轉型                                                |
| [KT-65750](https://youtrack.jetbrains.com/issue/KT-65750) | 改變返回型別的遞增和加號運算子必須影響智慧型轉型                                                           |
| [KT-65349](https://youtrack.jetbrains.com/issue/KT-65349) | [LC] K2：明確指定變數型別在某些情況下會破壞綁定智慧型轉型，而這在 K1 中是可行的                           |

#### 泛型 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                    | 標題                                                                                                                                              |
| :--------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)* | [棄用在投影接收器上使用合成 setter](#deprecated-synthetics-setter-on-a-projected-receiver)                                                         |
| [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)  | 禁止使用原始型別參數覆寫帶有泛型型別參數的 Java 方法                                                                                                |
| [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)  | 禁止將可能為空型別參數傳遞給 \`in\` 投影的 DNN 參數                                                                                                 |
| [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)  | 棄用型別別名建構函式中的上限違規                                                                                                                    |
| [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)  | 修復基於 Java 類別的 contravariant 捕獲型別的型別不健全問題                                                                                         |
| [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)  | 禁止自上限和捕獲型別的不健全程式碼                                                                                                                    |
| [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)  | 禁止泛型內部類別的泛型外部類別中的不健全邊界違規                                                                                                    |
| [KT-62923](https://youtrack.jetbrains.com/issue/KT-62923)  | K2：為內部類別的外部父型別的投影引入 PROJECTION_IN_IMMEDIATE_ARGUMENT_TO_SUPERTYPE                                                                  |
| [KT-63243](https://youtrack.jetbrains.com/issue/KT-63243)  | 在繼承自基本型別集合並從另一個父型別額外專門實作時，報告 MANY_IMPL_MEMBER_NOT_IMPLEMENTED                                                           |
| [KT-60305](https://youtrack.jetbrains.com/issue/KT-60305)  | K2：禁止在展開型別中具有變異修飾符的型別別名的建構函式呼叫和繼承                                                                                    |
| [KT-64965](https://youtrack.jetbrains.com/issue/KT-64965)  | 修復由於不正確處理帶有自上限的捕獲型別導致的型別漏洞                                                                                                |
| [KT-64966](https://youtrack.jetbrains.com/issue/KT-64966)  | 禁止帶有錯誤泛型參數型別的泛型委派建構函式呼叫                                                                                                      |
| [KT-65712](https://youtrack.jetbrains.com/issue/KT-65712)  | 當上限為捕獲型別時，報告缺少上限違規                                                                                                                |

#### 解析 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                    | 標題                                                                                                                                                                                             |
| :--------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [KT-55017](https://youtrack.jetbrains.com/issue/KT-55017)* | [在重載解析時，當 Java 欄位來自基底類別時，選擇派生類別中的 Kotlin 屬性](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)                                   |
| [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)  | 使 invoke 慣例與預期的語法糖轉換一致                                                                                                                                                             |
| [KT-62866](https://youtrack.jetbrains.com/issue/KT-62866)  | K2：改變當伴隨物件優先於靜態範圍時的限定詞解析行為                                                                                                                                               |
| [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)  | 當解析型別並具有相同名稱的類別星號匯入時，報告歧義錯誤                                                                                                                                           |
| [KT-63558](https://youtrack.jetbrains.com/issue/KT-63558)  | K2：遷移 COMPATIBILITY_WARNING 周圍的解析                                                                                                                                                        |
| [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)  | 當依賴類別包含在同一依賴關係的兩個不同版本中時，錯誤的負 CONFLICTING_INHERITED_MEMBERS                                                                                                           |
| [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)  | 具有接收者的函式型別的屬性 invoke 優於擴展函式 invoke                                                                                                                                            |
| [KT-51666](https://youtrack.jetbrains.com/issue/KT-51666)  | 合格的 this：引入/優先考慮帶有型別案例的 this                                                                                                                                                   |
| [KT-54166](https://youtrack.jetbrains.com/issue/KT-54166)  | 確認類別路徑中 FQ 名稱衝突情況下的未指定行為                                                                                                                                                   |
| [KT-64431](https://youtrack.jetbrains.com/issue/KT-64431)  | K2：禁止在匯入中使用型別別名作為限定詞                                                                                                                                                           |
| [KT-56520](https://youtrack.jetbrains.com/issue/KT-56520)  | K1/K2：當較低級別存在歧義時，解析樹對型別參考的工作不正確                                                                                                                                       |

#### 可見性 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                     | 標題                                                                                                                                 |
| :---------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| [KT-64474](https://youtrack.jetbrains.com/issue/KT-64474/)* | [將不可存取型別的使用宣告為未指定行為](#forbidden-use-of-inaccessible-generic-types)                                                 |
| [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)   | 呼叫來自內部內聯函式的私有類別伴隨物件成員時，假負 PRIVATE_CLASS_MEMBER_FROM_INLINE                                                  |
| [KT-58042](https://youtrack.jetbrains.com/issue/KT-58042)   | 如果等效的 getter 不可見，即使被覆寫的宣告可見，也要使合成屬性不可見                                                                   |
| [KT-64255](https://youtrack.jetbrains.com/issue/KT-64255)   | 禁止在另一個模組中從派生類別存取內部 setter                                                                                          |
| [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)   | 禁止從私有內聯函式公開匿名型別                                                                                                       |
| [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)   | 禁止從公共 API 內聯函式隱式存取非公共 API                                                                                            |
| [KT-56310](https://youtrack.jetbrains.com/issue/KT-56310)   | 智慧型轉型不應影響受保護成員的可見性                                                                                                 |
| [KT-65494](https://youtrack.jetbrains.com/issue/KT-65494)   | 禁止從公共內聯函式存取被忽略的私有運算子函式                                                                                         |
| [KT-65004](https://youtrack.jetbrains.com/issue/KT-65004)   | K1：覆寫受保護的 val 的 var 的 Setter 被生成為 public                                                                                |
| [KT-64972](https://youtrack.jetbrains.com/issue/KT-64972)   | 禁止 Kotlin/Native 在連結時通過私有成員覆寫                                                                                          |

#### 註解 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                                   |
| :-------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| [KT-58723](https://youtrack.jetbrains.com/issue/KT-58723) | 如果註解沒有 EXPRESSION 目標，則禁止使用註解標註語句                                                   |
| [KT-49930](https://youtrack.jetbrains.com/issue/KT-49930) | 在 \`REPEATED_ANNOTATION\` 檢查期間忽略括號表達式                                                        |
| [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422) | K2：禁止在屬性 getter 上使用站點 'get' 目標註解                                                        |
| [KT-46483](https://youtrack.jetbrains.com/issue/KT-46483) | 禁止在 where 子句中對型別參數進行註解                                                                  |
| [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299) | 伴隨作用域在解析伴隨物件上的註解時被忽略                                                               |
| [KT-64654](https://youtrack.jetbrains.com/issue/KT-64654) | K2：在使用者和編譯器要求的註解之間引入歧義                                                             |
| [KT-64527](https://youtrack.jetbrains.com/issue/KT-64527) | 列舉值的註解不應複製到列舉值類別                                                                       |
| [KT-63389](https://youtrack.jetbrains.com/issue/KT-63389) | K2：\`WRONG_ANNOTATION_TARGET\` 報告在包裝成 \`()?\` 的型別不相容註解上                                |
| [KT-63388](https://youtrack.jetbrains.com/issue/KT-63388) | K2：\`WRONG_ANNOTATION_TARGET\` 報告在 catch 參數型別的註解上                                          |

#### 空安全 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                    | 標題                                                                                                                     |
| :--------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| [KT-54521](https://youtrack.jetbrains.com/issue/KT-54521)* | [棄用 Java 中標註為 Nullable 的陣列型別的不安全用法](#improved-null-safety-for-java-primitive-arrays)                      |
| [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)  | K2：改變安全呼叫和慣例運算子組合的評估語義                                                                               |
| [KT-50850](https://youtrack.jetbrains.com/issue/KT-50850)  | 父型別的順序定義繼承函式的可空性參數                                                                                     |
| [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)  | 在公共簽章中近似局部型別時保留可空性                                                                                     |
| [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)  | 禁止將可空值賦值給非空 Java 欄位作為不安全賦值的選擇器                                                                 |
| [KT-63209](https://youtrack.jetbrains.com/issue/KT-63209)  | 報告缺少錯誤層級可空引數的錯誤，這些引數屬於警告層級 Java 型別                                                           |

#### Java 互通性 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                                       |
| :-------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| [KT-53061](https://youtrack.jetbrains.com/issue/KT-53061) | 禁止源程式碼中具有相同 FQ 名稱的 Java 和 Kotlin 類別                                                       |
| [KT-49882](https://youtrack.jetbrains.com/issue/KT-49882) | 從 Java 集合繼承的類別根據父型別的順序而行為不一致                                                         |
| [KT-66324](https://youtrack.jetbrains.com/issue/KT-66324) | K2：Java 類別從 Kotlin 私有類別繼承時的未指定行為                                                          |
| [KT-66220](https://youtrack.jetbrains.com/issue/KT-66220) | 將 Java vararg 方法傳遞給內聯函式會導致運行時出現陣列的陣列而不是單個陣列                                  |
| [KT-66204](https://youtrack.jetbrains.com/issue/KT-66204) | 允許在 K-J-K 繼承層次結構中覆寫內部成員                                                                    |

#### 屬性 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                    | 標題                                                                                                                       |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| [KT-57555](https://youtrack.jetbrains.com/issue/KT-57555)* | [[LC] 禁止延遲初始化帶有支援欄位的 open 屬性](#immediate-initialization-of-open-properties-with-backing-fields)               |
| [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)  | 棄用當沒有主建構函式或類別為局部時遺漏的 MUST_BE_INITIALIZED                                                               |
| [KT-64295](https://youtrack.jetbrains.com/issue/KT-64295)  | 禁止在屬性上潛在的 invoke 呼叫情況下進行遞迴解析                                                                           |
| [KT-57290](https://youtrack.jetbrains.com/issue/KT-57290)  | 棄用在基底類別從另一個模組來的不可見派生類別中的基底類別屬性上的智慧型轉型                                                 |
| [KT-62661](https://youtrack.jetbrains.com/issue/KT-62661)  | K2：資料類別屬性遺漏 OPT_IN_USAGE_ERROR                                                                                    |

#### 控制流 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                       |
| :-------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408) | K1 和 K2 之間類別初始化區塊中 CFA 規則不一致                                               |
| [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871) | K1/K2 在括號中沒有 else 分支的 if 條件式上的不一致                                         |
| [KT-42995](https://youtrack.jetbrains.com/issue/KT-42995) | 在帶有初始化作用域函式的 try/catch 區塊中，假負 "VAL_REASSIGNMENT"                         |
| [KT-65724](https://youtrack.jetbrains.com/issue/KT-65724) | 將資料流資訊從 try 區塊傳播到 catch 和 finally 區塊                                        |

#### 列舉類別 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                         |
| :-------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| [KT-57608](https://youtrack.jetbrains.com/issue/KT-57608) | 在列舉項目初始化期間，禁止存取列舉類別的伴隨物件                                             |
| [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372) | 報告列舉類別中虛擬內聯方法的遺漏錯誤                                                         |
| [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802) | 報告屬性/欄位和列舉項目之間解析歧義                                                          |
| [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310) | 當伴隨屬性優先於列舉項目時，變更限定詞解析行為                                               |

#### 函式 (SAM) 介面 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                                                            |
| :-------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628) | 棄用需要 OptIn 但無註解的 SAM 建構函式使用                                                                      |
| [KT-57014](https://youtrack.jetbrains.com/issue/KT-57014) | 禁止從 lambda 為 JDK 函式介面的 SAM 建構函式返回具有不正確可空性的值                                            |
| [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342) | 可呼叫參考的參數型別 SAM 轉換導致 CCE                                                                           |

#### 伴隨物件 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                   | 標題                                                                     |
| :-------------------------------------------------------- | :----------------------------------------------------------------------- |
| [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316) | 伴隨物件成員的呼叫外參考具有無效簽章                                     |
| [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313) | 當 V 具有伴隨物件時，變更 (V)::foo 參考解析                               |

#### 其他 {initial-collapse-state="collapsed" collapsible="true"}

| 問題 ID                                                    | 標題                                                                                                                                      |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| [KT-59739](https://youtrack.jetbrains.com/issue/KT-59739)* | K2/MPP 報告 [ABSTRACT_MEMBER_NOT_IMPLEMENTED] 在共同程式碼中對於繼承者的情況，當實作位於實際對應物中時                                            |
| [KT-49015](https://youtrack.jetbrains.com/issue/KT-49015)  | 合格的 this：在潛在標籤衝突情況下改變行為                                                                                                           |
| [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)  | 修復 JVM 後端中函式命名不正確的問題，該問題發生在 Java 子類別中意外的衝突重載情況下                                                               |
| [KT-62019](https://youtrack.jetbrains.com/issue/KT-62019)  | [LC 問題] 禁止在語句位置宣告 suspend 標記的匿名函式                                                                                               |
| [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)  | OptIn：禁止帶有預設引數（帶有預設值的參數）的建構函式呼叫                                                                                          |
| [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)  | 單元轉換意外地被允許用於變數上的表達式 + invoke 解析                                                                                              |
| [KT-55199](https://youtrack.jetbrains.com/issue/KT-55199)  | 禁止將帶有適配的可呼叫參考提升為 KFunction                                                                                                        |
| [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)  | [LC] K2 破壞 \`false && ...\` 和 \`false &#124;&#124; ...\`                                                                                         |
| [KT-65682](https://youtrack.jetbrains.com/issue/KT-65682)  | [LC] 棄用 \`header\`/\`impl\` 關鍵字                                                                                                               |
| [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)  | 預設情況下，通過 invokedynamic + LambdaMetafactory 生成所有 Kotlin lambda                                                               |

## 與 Kotlin 版本的相容性

以下 Kotlin 版本支援新的 K2 編譯器：

| Kotlin 版本           | 穩定性等級 |
| :-------------------- | :--------- |
| 2.0.0–%kotlinVersion% | 穩定       |
| 1.9.20–1.9.25         | 測試版     |
| 1.9.0–1.9.10          | JVM 是測試版 |
| 1.7.0–1.8.22          | Alpha      |

## 與 Kotlin 函式庫的相容性

如果您正在使用 Kotlin/JVM，K2 編譯器可與任何 Kotlin 版本編譯的函式庫配合使用。

如果您正在使用 Kotlin 多平台，K2 編譯器保證可與使用 Kotlin 1.9.20 及更高版本編譯的函式庫配合使用。

## 編譯器外掛程式支援

目前，Kotlin K2 編譯器支援以下 Kotlin 編譯器外掛程式：

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

此外，Kotlin K2 編譯器支援：

*   [Jetpack Compose](https://developer.android.com/jetpack/compose) 1.5.0 編譯器外掛程式及更高版本。
*   自 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 起的 [Kotlin 符號處理 (KSP)](ksp-overview.md)。

> 如果您使用任何額外的編譯器外掛程式，請查閱其文件以確認它們是否與 K2 相容。
>
{style="tip"}

### 升級您的自訂編譯器外掛程式

> 自訂編譯器外掛程式使用外掛程式 API，此 API 屬於[實驗性](components-stability.md#stability-levels-explained)階段。
> 因此，API 可能隨時變更，我們無法保證向後相容性。
>
{style="warning"}

升級過程有兩種途徑，具體取決於您擁有的自訂外掛程式類型。

#### 僅後端編譯器外掛程式

如果您的外掛程式僅實作 `IrGenerationExtension` 擴充點，則該過程與任何其他新的編譯器版本發佈相同。請檢查您使用的 API 是否有任何變更，並在必要時進行變更。

#### 後端和前端編譯器外掛程式

如果您的外掛程式使用與前端相關的擴充點，您需要使用新的 K2 編譯器 API 重寫該外掛程式。有關新 API 的介紹，請參閱 [FIR Plugin API](https://github.com/JetBrains/kotlin/blob/master/docs/fir/fir-plugins.md)。

> 如果您對升級自訂編譯器外掛程式有任何疑問，請加入我們的 [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G)
> Slack 頻道，我們將盡力為您提供幫助。
>
{style="note"}

## 分享您對新 K2 編譯器的回饋

我們將非常感謝您的任何回饋！

*   在[我們的問題追蹤器](https://youtrack.jetbrains.com/newIssue?project=KT&summary=K2+release+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+k2-release-migration)中報告您在遷移到新 K2 編譯器時遇到的任何問題。
*   [啟用傳送使用統計資訊選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)以允許 JetBrains 收集有關 K2 使用情況的匿名資料。