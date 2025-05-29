[//]: # (title: Kotlin 1.4.0 新功能介紹)

_[發佈日期: 2020 年 8 月 17 日](releases.md#release-details)_

在 Kotlin 1.4.0 中，我們對其所有元件進行了多項改進，[著重於品質與效能](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)。
您將在下方找到 Kotlin 1.4.0 中最重要的變更列表。

## 語言功能與改進

Kotlin 1.4.0 帶來了多種不同的語言功能與改進。它們包括：

*   [針對 Kotlin 介面的 SAM 轉換](#sam-conversions-for-kotlin-interfaces)
*   [針對函式庫作者的明確 API 模式](#explicit-api-mode-for-library-authors)
*   [混合具名與位置引數](#mixing-named-and-positional-arguments)
*   [尾隨逗號](#trailing-comma)
*   [可呼叫參照的改進](#callable-reference-improvements)
*   [在迴圈中的 `when` 運算式內使用 `break` 和 `continue`](#using-break-and-continue-inside-when-expressions-included-in-loops)

### 針對 Kotlin 介面的 SAM 轉換

在 Kotlin 1.4.0 之前，您只能在 [Kotlin 中處理 Java 方法和 Java 介面](java-interop.md#sam-conversions)時應用 SAM (單一抽象方法) 轉換。從現在開始，您也可以將 SAM 轉換用於 Kotlin 介面。
為此，請使用 `fun` 修飾符將 Kotlin 介面明確標記為功能性 (functional)。

當作為參數預期一個只有單一抽象方法的介面時，如果您傳遞一個 lambda 作為引數，則會應用 SAM 轉換。
在這種情況下，編譯器會自動將 lambda 轉換為實作抽象成員函數的類別實例。

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() { 
    println("Is 7 even? - ${isEven.accept(7)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

[進一步了解 Kotlin 功能介面和 SAM 轉換](fun-interfaces.md)。

### 針對函式庫作者的明確 API 模式

Kotlin 編譯器為函式庫作者提供了 _明確 API 模式 (explicit API mode)_。在此模式下，編譯器會執行額外檢查，
協助使函式庫的 API 更清晰、更一致。它對暴露給函式庫公開 API 的宣告增加了以下要求：

*   如果預設可見性 (default visibility) 將其暴露給公開 API，則宣告需要可見性修飾符 (visibility modifiers)。
    這有助於確保沒有宣告意外暴露給公開 API。
*   暴露給公開 API 的屬性 (properties) 和函數 (functions) 需要明確的型別規範 (explicit type specifications)。
    這保證了 API 使用者知道他們使用的 API 成員的型別。

根據您的配置，這些明確 API 可能會產生錯誤 (_strict_ 模式) 或警告 (_warning_ 模式)。
出於可讀性和常識考量，某些型別的宣告被排除在這些檢查之外：

*   主建構函數 (primary constructors)
*   資料類別 (data classes) 的屬性
*   屬性 getter 和 setter
*   `override` 方法

明確 API 模式僅分析模組的產品來源 (production sources)。

要以明確 API 模式編譯您的模組，請將以下行新增到您的 Gradle 建置腳本中：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = ExplicitApiMode.Strict
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = ExplicitApiMode.Warning
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = 'strict'
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = 'warning'
}
```

</tab>
</tabs>

使用命令列編譯器時，透過新增 `-Xexplicit-api` 編譯器選項並設定值 `strict` 或 `warning` 來切換到明確 API 模式。

```bash
-Xexplicit-api={strict|warning}
```

[在 KEEP 中查找有關明確 API 模式的更多詳細資訊](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md)。

### 混合具名與位置引數

在 Kotlin 1.3 中，當您使用[具名引數](functions.md#named-arguments)呼叫函數時，必須將所有沒有名稱的引數 (位置引數) 放在第一個具名引數之前。例如，您可以呼叫 `f(1, y = 2)`，但不能呼叫 `f(x = 1, 2)`。

當所有引數都處於正確位置，但您想為中間的一個引數指定名稱時，這會非常令人困擾。
對於明確指出布林值或 `null` 值屬於哪個屬性，它特別有用。

在 Kotlin 1.4 中，沒有這種限制 — 您現在可以為一組位置引數中間的引數指定名稱。此外，您可以隨意混合位置引數和具名引數，只要它們保持正確的順序。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

//Function call with a named argument in the middle
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 尾隨逗號

在 Kotlin 1.4 中，您現在可以在列舉 (enumerations) 中新增尾隨逗號 (trailing comma)，例如引數和參數列表、`when` 條目，以及解構宣告 (destructuring declarations) 的元件。
使用尾隨逗號，您可以新增新項目並更改其順序，而無需新增或移除逗號。

如果您對參數或值使用多行語法，這會特別有用。新增尾隨逗號後，您可以輕鬆交換包含參數或值的行。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', //trailing comma
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", //trailing comma
)
```

### 可呼叫參照的改進

Kotlin 1.4 支援更多使用可呼叫參照 (callable references) 的情況：

*   參照具有預設引數值的函數
*   在 `Unit` 返回函數中的函數參照
*   根據函數中的引數數量調整的參照
*   可呼叫參照上的掛起轉換 (Suspend conversion)

#### 參照具有預設引數值的函數

現在您可以將可呼叫參照用於具有預設引數值的函數。如果對函數 `foo` 的可呼叫參照不帶任何引數，則使用預設值 `0`。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

以前，您必須為函數 `apply` 編寫額外的多載 (overloads) 才能使用預設引數值。

```kotlin
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### 在 `Unit` 返回函數中的函數參照

在 Kotlin 1.4 中，您可以在 `Unit` 返回函數中使用對返回任何型別的函數的可呼叫參照。
在 Kotlin 1.4 之前，在這種情況下您只能使用 lambda 引數。現在您可以同時使用 lambda 引數和可呼叫參照。

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

#### 根據函數中的引數數量調整的參照

現在您可以調整函數的可呼叫參照，在傳遞可變數量引數 (`vararg`) 時。
您可以在傳遞引數列表的末尾傳遞任意數量的相同型別的參數。

```kotlin
fun foo(x: Int, vararg y: String) {}

fun use0(f: (Int) -> Unit) {}
fun use1(f: (Int, String) -> Unit) {}
fun use2(f: (Int, String, String) -> Unit) {}

fun test() {
    use0(::foo) 
    use1(::foo) 
    use2(::foo) 
}
```

#### 可呼叫參照上的掛起轉換

除了 lambda 上的掛起轉換之外，Kotlin 從 1.4.0 版開始也支援可呼叫參照上的掛起轉換 (suspend conversion)。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

### 在迴圈中的 `when` 運算式內使用 `break` 和 `continue`

在 Kotlin 1.3 中，您不能在迴圈中的 `when` 運算式內使用不帶限定符的 `break` 和 `continue`。原因是這些關鍵字保留用於 `when` 運算式中可能的 [fall-through behavior](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)。

這就是為什麼如果您想在迴圈中的 `when` 運算式內使用 `break` 和 `continue`，您必須為它們[加上標籤](returns.md#break-and-continue-labels)，這變得相當麻煩。

```kotlin
fun test(xs: List<Int>) {
    LOOP@for (x in xs) {
        when (x) {
            2 -> continue@LOOP
            17 -> break@LOOP
            else -> println(x)
        }
    }
}
```

在 Kotlin 1.4 中，您可以在迴圈中包含的 `when` 運算式內部不帶標籤地使用 `break` 和 `continue`。它們會如預期般終止最近的封閉迴圈或進入其下一個步驟。

```kotlin
fun test(xs: List<Int>) {
    for (x in xs) {
        when (x) {
            2 -> continue
            17 -> break
            else -> println(x)
        }
    }
}
```

`when` 內部 `fall-through` 行為的設計仍在進一步考慮中。

## IDE 中的新工具

藉助 Kotlin 1.4，您可以使用 IntelliJ IDEA 中的新工具來簡化 Kotlin 開發：

*   [全新彈性專案精靈](#new-flexible-project-wizard)
*   [協程除錯器](#coroutine-debugger)

### 全新彈性專案精靈

透過彈性且全新的 Kotlin 專案精靈 (Project Wizard)，您可以輕鬆地建立和配置不同類型的 Kotlin 專案，包括多平台專案，這些專案在沒有 UI 的情況下可能難以配置。

![Kotlin Project Wizard – Multiplatform project](multiplatform-project-1-wn.png)

新的 Kotlin 專案精靈既簡單又靈活：

1.  *選擇專案範本*，具體取決於您要執行的操作。未來將會新增更多範本。
2.  *選擇建置系統* — Gradle (Kotlin 或 Groovy DSL)、Maven 或 IntelliJ IDEA。
    Kotlin 專案精靈只會顯示所選專案範本支援的建置系統。
3.  直接在主螢幕上*預覽專案結構*。

然後，您可以完成專案的建立，或者，您可以選擇性地在下一個螢幕上*配置專案*：

4.  *新增/移除*此專案範本支援的模組和目標。
5.  *配置模組和目標設定*，例如目標 JVM 版本、目標範本和測試框架。

![Kotlin Project Wizard - Configure targets](multiplatform-project-2-wn.png)

未來，我們將透過新增更多配置選項和範本，使 Kotlin 專案精靈更加靈活。

您可以透過這些教學課程來試用新的 Kotlin 專案精靈：

*   [根據 Kotlin/JVM 建立一個控制台應用程式](jvm-get-started.md)
*   [為 React 建立一個 Kotlin/JS 應用程式](js-react.md)
*   [建立一個 Kotlin/Native 應用程式](native-get-started.md)

### 協程除錯器

許多人已經使用[協程 (coroutines)](coroutines-guide.md) 進行非同步程式設計。
但在除錯時，在 Kotlin 1.4 之前使用協程可能是一件真正的痛苦。由於協程在執行緒之間跳轉，
因此很難理解特定協程在做什麼以及檢查其上下文。在某些情況下，在斷點上追蹤步驟根本不起作用。結果，您必須依靠日誌或心智努力來除錯使用協程的程式碼。

在 Kotlin 1.4 中，透過 Kotlin 外掛隨附的新功能，協程除錯現在變得更加方便。

> 協程除錯適用於 `kotlinx-coroutines-core` 1.3.8 或更高版本。
>
{style="note"}

**Debug Tool Window** 現在包含一個新的 **Coroutines** 標籤頁。在此標籤頁中，您可以找到有關目前正在執行和已掛起協程的資訊。
協程按其運行的調度器 (dispatcher) 分組。

![Debugging coroutines](coroutine-debugger-wn.png)

現在您可以：
*   輕鬆檢查每個協程的狀態。
*   查看正在運行和已掛起協程的局部變數和捕獲變數的值。
*   查看完整的協程建立堆疊，以及協程內部的呼叫堆疊。堆疊包括所有帶有變數值的框架，即使是那些在標準除錯期間會丟失的框架。

如果您需要包含每個協程及其堆疊狀態的完整報告，請在 **Coroutines** 標籤頁內右鍵點擊，然後點擊 **Get Coroutines Dump**。目前，協程轉儲相當簡單，但我們將在未來的 Kotlin 版本中使其更具可讀性和實用性。

![Coroutines Dump](coroutines-dump-wn.png)

在 [此部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/) 和 [IntelliJ IDEA 文件](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html) 中了解更多關於協程除錯的資訊。

## 全新編譯器

新的 Kotlin 編譯器將會非常快；它將統一所有支援的平台並為編譯器擴充功能提供 API。這是一個長期專案，我們在 Kotlin 1.4.0 中已經完成了幾個步驟：

*   [全新、更強大的型別推斷演算法](#new-more-powerful-type-inference-algorithm) 預設啟用。
*   [全新 JVM 和 JS IR 後端](#unified-backends-and-extensibility)。一旦我們穩定它們，它們將成為預設後端。

### 更強大的新型別推斷演算法

Kotlin 1.4 使用了全新的、更強大的型別推斷演算法。這個新演算法在 Kotlin 1.3 中已經可以透過指定編譯器選項進行嘗試，現在它已預設啟用。您可以在 [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20) 中找到新演算法修復問題的完整列表。在這裡，您可以找到一些最顯著的改進：

*   [型別自動推斷的更多情況](#more-cases-where-type-is-inferred-automatically)
*   [lambda 最後一個表達式的智能轉換](#smart-casts-for-a-lambda-s-last-expression)
*   [可呼叫參照的智能轉換](#smart-casts-for-callable-references)
*   [委派屬性更好的推斷](#better-inference-for-delegated-properties)
*   [帶有不同引數的 Java 介面的 SAM 轉換](#sam-conversion-for-java-interfaces-with-different-arguments)
*   [Kotlin 中的 Java SAM 介面](#java-sam-interfaces-in-kotlin)

#### 型別自動推斷的更多情況

新的推斷演算法為許多情況推斷型別，而舊演算法則需要您明確指定它們。例如，在以下範例中，lambda 參數 `it` 的型別被正確推斷為 `String?`：

```kotlin
//sampleStart
val rulesMap: Map<String, (String?) -> Boolean> = mapOf(
    "weak" to { it != null },
    "medium" to { !it.isNullOrBlank() },
    "strong" to { it != null && "^[a-zA-Z0-9]+$".toRegex().matches(it) }
)
//sampleEnd

fun main() {
    println(rulesMap.getValue("weak")("abc!"))
    println(rulesMap.getValue("strong")("abc"))
    println(rulesMap.getValue("strong")("abc!"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

在 Kotlin 1.3 中，您需要引入一個明確的 lambda 參數，或用帶有明確泛型引數的 `Pair` 建構函數替換 `to` 才能使其工作。

#### lambda 最後一個表達式的智能轉換

在 Kotlin 1.3 中，lambda 內部的最後一個表達式不會進行智能轉換，除非您指定預期的型別。因此，在以下範例中，Kotlin 1.3 將 `String?` 推斷為 `result` 變數的型別：

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // the Kotlin compiler knows that str is not null here
}
// The type of 'result' is String? in Kotlin 1.3 and String in Kotlin 1.4
```

在 Kotlin 1.4 中，由於新的推斷演算法，lambda 內部的最後一個表達式會進行智能轉換 (smart cast)，並且這個新的、更精確的型別用於推斷產生的 lambda 型別。因此，`result` 變數的型別變為 `String`。

在 Kotlin 1.3 中，您通常需要新增明確的轉換 (無論是 `!!` 還是型別轉換，例如 `as String`) 才能使此類情況工作，現在這些轉換已變得不必要。

#### 可呼叫參照的智能轉換

在 Kotlin 1.3 中，您無法存取智能轉換型別的成員參照。現在在 Kotlin 1.4 中您可以：

```kotlin
import kotlin.reflect.KFunction

sealed class Animal
class Cat : Animal() {
    fun meow() {
        println("meow")
    }
}

class Dog : Animal() {
    fun woof() {
        println("woof")
    }
}

//sampleStart
fun perform(animal: Animal) {
    val kFunction: KFunction<*> = when (animal) {
        is Cat -> animal::meow
        is Dog -> animal::woof
    }
    kFunction.call()
}
//sampleEnd

fun main() {
    perform(Cat())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

在 `animal` 變數被智能轉換為特定型別 `Cat` 和 `Dog` 後，您可以使用不同的成員參照 `animal::meow` 和 `animal::woof`。經過型別檢查後，您可以存取對應於子型別的成員參照。

#### 委派屬性更好的推斷

在分析 `by` 關鍵字之後的委派表達式時，委派屬性 (delegated property) 的型別未被考慮在內。例如，以下程式碼之前無法編譯，但現在編譯器正確推斷 `old` 和 `new` 參數的型別為 `String?`：

```kotlin
import kotlin.properties.Delegates

fun main() {
    var prop: String? by Delegates.observable(null) { p, old, new ->
        println("$old → $new")
    }
    prop = "abc"
    prop = "xyz"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

#### 帶有不同引數的 Java 介面的 SAM 轉換

Kotlin 從一開始就支援 Java 介面的 SAM 轉換，但有一個情況是不支援的，這在使用現有 Java 函式庫時有時會很煩人。如果您呼叫一個接受兩個 SAM 介面作為參數的 Java 方法，則兩個引數都必須是 lambda 或常規物件。您不能將一個引數作為 lambda 傳遞，另一個作為物件傳遞。

新演算法修復了這個問題，您可以在任何情況下傳遞 lambda 而不是 SAM 介面，這正是您自然期望它的工作方式。

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // Works in Kotlin 1.4
}
```

#### Kotlin 中的 Java SAM 介面

在 Kotlin 1.4 中，您可以在 Kotlin 中使用 Java SAM 介面並將 SAM 轉換應用於它們。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

在 Kotlin 1.3 中，您必須在 Java 程式碼中宣告上述函數 `foo` 才能執行 SAM 轉換。

### 統一的後端與可擴充性

在 Kotlin 中，我們有三個生成可執行檔的後端：Kotlin/JVM、Kotlin/JS 和 Kotlin/Native。Kotlin/JVM 和 Kotlin/JS 沒有太多共享程式碼，因為它們是獨立開發的。Kotlin/Native 基於圍繞 Kotlin 程式碼中間表示 (IR) 構建的新基礎設施。

我們現在正在將 Kotlin/JVM 和 Kotlin/JS 遷移到相同的 IR。因此，所有三個後端
共享大量邏輯並擁有統一的流程。這使得我們只需為所有平台實作大多數功能、最佳化和錯誤修復一次。兩個新的基於 IR 的後端都處於 [Alpha](components-stability.md) 狀態。

通用的後端基礎設施也為多平台編譯器擴充功能打開了大門。您將能夠插入流程並新增自訂處理和轉換，這些處理和轉換將自動適用於所有平台。

我們鼓勵您試用我們新的 [JVM IR](#new-jvm-ir-backend) 和 [JS IR](#new-js-ir-backend) 後端，它們目前處於 Alpha 狀態，並與我們分享您的回饋。

## Kotlin/JVM

Kotlin 1.4.0 包含許多針對 JVM 的改進，例如：

*   [全新 JVM IR 後端](#new-jvm-ir-backend)
*   [在介面中產生預設方法的新模式](#new-modes-for-generating-default-methods)
*   [統一空值檢查的例外類型](#unified-exception-type-for-null-checks)
*   [JVM 位元碼中的型別註解](#type-annotations-in-the-jvm-bytecode)

### 全新 JVM IR 後端

與 Kotlin/JS 一樣，我們正在將 Kotlin/JVM 遷移到[統一的 IR 後端](#unified-backends-and-extensibility)，
這使我們能夠為所有平台一次性實現大多數功能和錯誤修復。您還可以透過建立適用於所有平台的多平台擴充功能來從中獲益。

Kotlin 1.4.0 尚未為此類擴充功能提供公共 API，但我們正在與我們的合作夥伴（包括 [Jetpack Compose](https://developer.android.com/jetpack/compose)）密切合作，他們已經在使用我們的新後端建立編譯器外掛。

我們鼓勵您試用新的 Kotlin/JVM 後端，它目前處於 Alpha 狀態，並向我們的 [問題追蹤器](https://youtrack.jetbrains.com/issues/KT) 提交任何問題和功能請求。
這將幫助我們統一編譯器流程，並更快地將 Jetpack Compose 等編譯器擴充功能引入 Kotlin 社群。

要啟用新的 JVM IR 後端，請在您的 Gradle 建置腳本中指定一個額外的編譯器選項：

```kotlin
kotlinOptions.useIR = true
```

> 如果您[啟用 Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en)，您將自動選擇使用新的 JVM 後端，無需在 `kotlinOptions` 中指定編譯器選項。
>
{style="note"}

使用命令列編譯器時，新增編譯器選項 `-Xuse-ir`。

> 您只能在啟用新後端的情況下使用由新 JVM IR 後端編譯的程式碼。否則，您將會收到錯誤。
> 考慮到這一點，我們不建議函式庫作者在生產環境中切換到新後端。
>
{style="note"}

### 在介面中產生預設方法的新模式

將 Kotlin 程式碼編譯為 JVM 1.8 及更高版本時，您可以將 Kotlin 介面的非抽象方法編譯為 Java 的 `default` 方法。
為此，有一個機制包含 `@JvmDefault` 註解來標記此類方法，以及 `-Xjvm-default` 編譯器選項來啟用此註解的處理。

在 1.4.0 中，我們新增了一種用於生成預設方法的新模式：`-Xjvm-default=all` 將 Kotlin 介面的 *所有* 非抽象方法編譯為 `default` Java 方法。為了與未使用 `default` 編譯的介面程式碼相容，我們還新增了 `all-compatibility` 模式。

有關 Java 互通性中預設方法的更多資訊，請參閱[互通性文件](java-to-kotlin-interop.md#default-methods-in-interfaces)和
[這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 統一空值檢查的例外類型

從 Kotlin 1.4.0 開始，所有運行時空值檢查都將拋出 `java.lang.NullPointerException`，而不是 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`。這適用於：`!!` 運算子、方法前言中的參數空值檢查、平台型別表達式空值檢查，以及帶有不可空型別的 `as` 運算子。
這不適用於 `lateinit` 空值檢查和明確的函式庫函數呼叫，例如 `checkNotNull` 或 `requireNotNull`。

這項變更增加了 Kotlin 編譯器或各類位元碼處理工具（例如 Android [R8 優化器](https://developer.android.com/studio/build/shrink-code)）可執行的空值檢查最佳化數量。

請注意，從開發人員的角度來看，事情不會改變太多：Kotlin 程式碼將拋出與以前相同的錯誤訊息。例外類型會改變，但傳遞的資訊保持不變。

### JVM 位元碼中的型別註解

Kotlin 現在可以在 JVM 位元碼 (目標版本 1.8+) 中生成型別註解 (type annotations)，以便它們在運行時的 Java 反射中可用。
要在位元碼中發出型別註解，請遵循以下步驟：

1.  確保您宣告的註解具有正確的註解目標 (Java 的 `ElementType.TYPE_USE` 或 Kotlin 的 `AnnotationTarget.TYPE`) 和保留策略 (`AnnotationRetention.RUNTIME`)。
2.  將註解類別宣告編譯到 JVM 位元碼目標版本 1.8+。您可以使用 `-jvm-target=1.8` 編譯器選項指定它。
3.  將使用該註解的程式碼編譯到 JVM 位元碼目標版本 1.8+ (`-jvm-target=1.8`)，並添加 `-Xemit-jvm-type-annotations` 編譯器選項。

請注意，目前標準函式庫中的型別註解不會發出到位元碼中，因為標準函式庫是用目標版本 1.6 編譯的。

到目前為止，只支援基本情況：

-   方法參數、方法返回型別和屬性型別上的型別註解；
-   型別引數的不變投影 (Invariant projections of type arguments)，例如 `Smth<@Ann Foo>`、`Array<@Ann Foo>`。

在以下範例中，`String` 型別上的 `@Foo` 註解可以發出到位元碼中，然後由函式庫程式碼使用：

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

在 JS 平台上，Kotlin 1.4.0 提供了以下改進：

-   [全新 Gradle DSL](#new-gradle-dsl)
-   [全新 JS IR 後端](#new-js-ir-backend)

### 全新 Gradle DSL

`kotlin.js` Gradle 外掛附帶了調整後的 Gradle DSL，它提供了許多新的配置選項，並且更緊密地與 `kotlin-multiplatform` 外掛使用的 DSL 對齊。一些最具影響力的變更包括：

-   透過 `binaries.executable()` 明確切換可執行檔的建立。在此處閱讀有關 [執行 Kotlin/JS 及其環境的更多資訊](js-project-setup.md#execution-environments)。
-   透過 `cssSupport` 從 Gradle 配置中配置 webpack 的 CSS 和樣式載入器。在此處閱讀有關 [使用 CSS 和樣式載入器的更多資訊](js-project-setup.md#css)。
-   改進了 npm 依賴項管理，包含強制版本號或 [semver](https://docs.npmjs.com/about-semantic-versioning) 版本範圍，以及支援使用 `devNpm`、`optionalNpm` 和 `peerNpm` 的 _開發_、_對等_ 和 _可選_ npm 依賴項。[在此處直接從 Gradle 閱讀有關 npm 套件依賴項管理的更多資訊](js-project-setup.md#npm-dependencies)。
-   與 [Dukat](https://github.com/Kotlin/dukat)（Kotlin 外部宣告的生成器）更強大的整合。現在可以在建置時生成外部宣告，也可以透過 Gradle 任務手動生成。

### 全新 JS IR 後端

[適用於 Kotlin/JS 的 IR 後端](js-ir-compiler.md)，目前處於 [Alpha](components-stability.md) 穩定性，提供了一些特定於 Kotlin/JS 目標的新功能，這些功能主要圍繞透過死程式碼消除生成程式碼大小，以及改進與 JavaScript 和 TypeScript 的互通性等。

要啟用 Kotlin/JS IR 後端，請在您的 `gradle.properties` 中將鍵 `kotlin.js.compiler=ir` 設定為 `ir`，或者將 `IR` 編譯器型別傳遞給您的 Gradle 建置腳本的 `js` 函數：

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

有關如何配置新後端的更多詳細資訊，請查看 [Kotlin/JS IR 編譯器文件](js-ir-compiler.md)。

藉助新的 [@JsExport](js-to-kotlin-interop.md#jsexport-annotation) 註解和[從 Kotlin 程式碼生成 TypeScript 定義 (d.ts)](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts) 的能力，Kotlin/JS IR 編譯器後端改進了 JavaScript 和 TypeScript 的互通性。這也使得 Kotlin/JS 程式碼更容易與現有工具整合，以建立**混合應用程式**並在多平台專案中利用程式碼共用功能。

[了解更多關於 Kotlin/JS IR 編譯器後端中的可用功能](js-ir-compiler.md)。

## Kotlin/Native

在 1.4.0 中，Kotlin/Native 獲得了大量新功能和改進，包括：

*   [在 Swift 和 Objective-C 中支援 Kotlin 的掛起函數](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
*   [預設支援 Objective-C 泛型](#objective-c-generics-support-by-default)
*   [Objective-C/Swift 互通性中的例外處理](#exception-handling-in-objective-c-swift-interop)
*   [預設在 Apple 目標上產生發行版 .dSYM 檔案](#generate-release-dsyms-on-apple-targets-by-default)
*   [效能改進](#performance-improvements)
*   [簡化 CocoaPods 依賴項管理](#simplified-management-of-cocoapods-dependencies)

### 在 Swift 和 Objective-C 中支援 Kotlin 的掛起函數

在 1.4.0 中，我們新增了對 Swift 和 Objective-C 中掛起函數 (suspending functions) 的基本支援。現在，當您將 Kotlin 模組編譯為 Apple 框架時，掛起函數在其中作為帶有回呼 (callback) 的函數提供 (在 Swift/Objective-C 術語中為 `completionHandler`)。當您在生成的框架標頭中擁有此類函數時，您可以從 Swift 或 Objective-C 程式碼中呼叫它們，甚至覆寫它們。

例如，如果您編寫此 Kotlin 函數：

```kotlin
suspend fun queryData(id: Int): String = ...
```

...然後您可以像這樣從 Swift 呼叫它：

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[進一步了解如何在 Swift 和 Objective-C 中使用掛起函數](native-objc-interop.md)。

### 預設支援 Objective-C 泛型

舊版 Kotlin 為 Objective-C 互通性提供了實驗性支援泛型。從 1.4.0 開始，Kotlin/Native 預設會從 Kotlin 程式碼生成帶有泛型 (generics) 的 Apple 框架。在某些情況下，這可能會破壞呼叫 Kotlin 框架的現有 Objective-C 或 Swift 程式碼。要生成不帶泛型的框架標頭，請新增 `-Xno-objc-generics` 編譯器選項。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

請注意，[與 Objective-C 互通性文件](native-objc-interop.md#generics)中列出的所有細節和限制仍然有效。

### Objective-C/Swift 互通性中的例外處理

在 1.4.0 中，我們對從 Kotlin 生成的 Swift API 進行了輕微更改，涉及例外轉換方式。Kotlin 和 Swift 在錯誤處理方面存在根本差異。所有 Kotlin 例外都是非檢查型例外 (unchecked)，而 Swift 只有檢查型錯誤 (checked errors)。因此，為了讓 Swift 程式碼知道預期的例外，Kotlin 函數應該用 `@Throws` 註解標記，指定潛在例外類別的列表。

編譯到 Swift 或 Objective-C 框架時，具有或繼承 `@Throws` 註解的函數在 Objective-C 中表示為 `NSError*` 生成方法，在 Swift 中表示為 `throws` 方法。

以前，除了 `RuntimeException` 和 `Error` 之外的任何例外都會作為 `NSError` 傳播。現在此行為改變：
現在只針對作為 `@Throws` 註解參數指定類別實例（或其子類別）的例外拋出 `NSError`。其他到達 Swift/Objective-C 的 Kotlin 例外被視為未處理並導致程式終止。

### 預設在 Apple 目標上產生發行版 .dSYM 檔案

從 1.4.0 開始，Kotlin/Native 編譯器預設為 Darwin 平台上的發行版二進位檔案產生[除錯符號檔案](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information) (`.dSYM`s)。這可以透過 `-Xadd-light-debug=disable` 編譯器選項停用。在其他平台上，此選項預設為停用。要在 Gradle 中切換此選項，請使用：

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[進一步了解崩潰報告符號化](native-ios-symbolication.md)。

### 效能改進

Kotlin/Native 獲得了多項效能改進，可加速開發過程和執行。
以下是一些範例：

-   為提高物件分配速度，我們現在提供 [mimalloc](https://github.com/microsoft/mimalloc)
    記憶體分配器作為系統分配器的替代方案。mimalloc 在某些基準測試中速度快達兩倍。
    目前，在 Kotlin/Native 中使用 mimalloc 仍處於實驗階段；您可以使用 `-Xallocator=mimalloc` 編譯器選項切換到它。

-   我們重新設計了 C 互通函式庫的建置方式。透過新工具，Kotlin/Native 生成互通函式庫的速度比以前快 4 倍，
    且人工構件 (artifacts) 的大小比以前小 25% 到 30%。

-   由於 GC 中的最佳化，整體運行時效能有所提升。此改進在具有大量長壽命物件的專案中將特別明顯。
    `HashMap` 和 `HashSet` 集合現在透過避免冗餘裝箱 (boxing) 而工作得更快。

-   在 1.3.70 中，我們引入了兩個新功能，以改進 Kotlin/Native 編譯效能：
    [快取專案依賴項並從 Gradle Daemon 運行編譯器](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。
    從那時起，我們已經修復了許多問題並改進了這些功能的整體穩定性。

### 簡化 CocoaPods 依賴項管理

以前，一旦您將專案與依賴管理工具 CocoaPods 整合，您只能在 Xcode 中建置 iOS、macOS、watchOS 或 tvOS 部分的專案，獨立於多平台專案的其他部分。這些其他部分可以在 IntelliJ IDEA 中建置。

此外，每次您新增對儲存在 CocoaPods (Pod 函式庫) 中的 Objective-C 函式庫的依賴項時，您都必須從 IntelliJ IDEA 切換到 Xcode，呼叫 `pod install`，並在那裡運行 Xcode 建置。

現在您可以直接在 IntelliJ IDEA 中管理 Pod 依賴項，同時享受它為程式碼工作提供的好處，例如程式碼突顯和自動完成。您還可以使用 Gradle 建置整個 Kotlin 專案，而無需切換到 Xcode。這意味著您只需要在需要編寫 Swift/Objective-C 程式碼或在模擬器或裝置上運行應用程式時才需要進入 Xcode。

現在您也可以使用儲存在本機的 Pod 函式庫。

根據您的需求，您可以在以下兩者之間新增依賴項：
*   Kotlin 專案與遠端儲存在 CocoaPods 儲存庫或本機機器上的 Pod 函式庫。
*   Kotlin Pod (用作 CocoaPods 依賴項的 Kotlin 專案) 與具有一個或多個目標的 Xcode 專案。

完成初始設定，當您向 `cocoapods` 新增新的依賴項時，只需在 IntelliJ IDEA 中重新匯入專案。
新的依賴項將自動新增。無需額外步驟。

[了解如何新增依賴項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html)。

## Kotlin 多平台

> 多平台專案的支援處於 [Alpha](components-stability.md) 狀態。它未來可能會發生不相容的變更，並需要手動移轉。
> 我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋意見。
>
{style="warning"}

[Kotlin 多平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 減少了為[不同平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)
編寫和維護相同程式碼所花費的時間，同時保留了原生程式設計的靈活性和優勢。我們繼續投入精力於多平台功能和改進：

*   [透過階層式專案結構在多個目標中共用程式碼](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
*   [在階層式結構中利用原生函式庫](#leveraging-native-libs-in-the-hierarchical-structure)
*   [僅指定 kotlinx 依賴項一次](#specifying-dependencies-only-once)

> 多平台專案需要 Gradle 6.0 或更高版本。
>
{style="note"}

### 透過階層式專案結構在多個目標中共用程式碼

透過新的階層式專案結構支援，您可以在[多平台專案](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html)中於[多個平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)之間共用程式碼。

以前，新增到多平台專案的任何程式碼都可以放置在平台特定的源集 (source set) 中，該源集僅限於一個目標，不能被任何其他平台重用，
或者放置在通用源集 (common source set) 中，例如 `commonMain` 或 `commonTest`，它在專案中的所有平台之間共用。
在通用源集中，您只能透過使用需要平台特定 `actual` 實作的 [`expect` 宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)來呼叫平台特定的 API。

這使得[在所有平台共用程式碼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-all-platforms)變得容易，
但[僅在部分目標之間共用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)卻不那麼容易，
尤其是那些可能重用大量通用邏輯和第三方 API 的相似目標。

例如，在典型的針對 iOS 的多平台專案中，有兩個與 iOS 相關的目標：一個用於 iOS ARM64 裝置，另一個用於 x64 模擬器。它們有獨立的平台特定源集，但實際上，很少需要針對裝置和模擬器使用不同的程式碼，並且它們的依賴項非常相似。因此，iOS 特定程式碼可以在它們之間共用。

顯然，在此設定中，最好有一個 *用於兩個 iOS 目標的共用源集*，其中包含的 Kotlin/Native 程式碼仍然可以直接呼叫 iOS 裝置和模擬器共有的任何 API。

![Code shared for iOS targets](iosmain-hierarchy.png){width=300}

現在，您可以透過[階層式專案結構支援](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)來實現此目標，該支援會根據哪些目標使用它們來推斷和調整每個源集中可用的 API 和語言功能。

對於目標的常見組合，您可以使用目標捷徑建立階層式結構。
例如，使用 `ios()` 捷徑建立兩個 iOS 目標和上面所示的共用源集：

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

對於其他目標組合，請透過 `dependsOn` 關係[手動建立階層結構](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#manual-configuration)。

![Hierarchical structure](manual-hierarchical-structure.svg)

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin{
    sourceSets {
        val desktopMain by creating {
            dependsOn(commonMain)
        }
        val linuxX64Main by getting {
            dependsOn(desktopMain)
        }
        val mingwX64Main by getting {
            dependsOn(desktopMain)
        }
        val macosX64Main by getting {
            dependsOn(desktopMain)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        desktopMain {
            dependsOn(commonMain)
        }
        linuxX64Main {
            dependsOn(desktopMain)
        }
        mingwX64Main {
            dependsOn(desktopMain)
        }
        macosX64Main {
            dependsOn(desktopMain)
        }
    }
}

```

</tab>
</tabs>

由於階層式專案結構，函式庫還可以為目標的子集提供通用 API。了解更多關於[在函式庫中共用程式碼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)。

### 在階層式結構中利用原生函式庫

您可以在多個原生目標之間共用的源集 (source sets) 中使用平台依賴函式庫 (platform-dependent libraries)，例如 Foundation、UIKit 和 POSIX。這可以幫助您共用更多原生程式碼，而不受平台特定依賴項的限制。

無需額外步驟 — 一切都會自動完成。IntelliJ IDEA 將幫助您檢測可以在共用程式碼中使用的通用宣告。

[進一步了解平台依賴函式庫的使用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。

### 僅指定 kotlinx 依賴項一次

從現在開始，您應該只在共用源集中指定一次對同一函式庫的不同變體（在共用和平台特定源集中使用）的依賴項。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

請勿使用帶有平台後綴的 kotlinx 函式庫構件名稱，例如 `-common`、`-native` 或類似名稱，因為它們不再支援。請改用函式庫的基本構件名稱，在上面的範例中為 `kotlinx-coroutines-core`。

然而，此變更目前不影響：
*   `stdlib` 函式庫 – 從 Kotlin 1.4.0 開始，[stdlib 依賴項會自動新增](#dependency-on-the-standard-library-added-by-default)。
*   `kotlin.test` 函式庫 – 您仍應使用 `test-common` 和 `test-annotations-common`。這些依賴項將在稍後處理。

如果您只需要特定平台的依賴項，您仍然可以使用帶有後綴（例如 `-jvm` 或 `-js`）的標準和 kotlinx 函式庫的平台特定變體，例如 `kotlinx-coroutines-core-jvm`。

[了解更多關於配置依賴項的資訊](gradle-configure-project.md#configure-dependencies)。

## Gradle 專案改進

除了針對 [Kotlin 多平台](#kotlin-multiplatform)、[Kotlin/JVM](#kotlin-jvm)、
[Kotlin/Native](#kotlin-native) 和 [Kotlin/JS](#kotlin-js) 特定的 Gradle 專案功能和改進之外，還有一些適用於所有 Kotlin Gradle 專案的變更：

*   [標準函式庫的依賴項現在預設新增](#dependency-on-the-standard-library-added-by-default)
*   [Kotlin 專案需要較新版本的 Gradle](#minimum-gradle-version-for-kotlin-projects)
*   [改進 IDE 中對 Kotlin Gradle DSL 的支援](#improved-gradle-kts-support-in-the-ide)

### 標準函式庫的依賴項現在預設新增

您不再需要在任何 Kotlin Gradle 專案中 (包括多平台專案) 宣告對 `stdlib` 函式庫的依賴項。
此依賴項預設新增。

自動新增的標準函式庫將與 Kotlin Gradle 外掛版本相同，因為它們具有相同的版本控制。

對於平台特定的源集，使用對應的平台特定函式庫變體，而通用標準函式庫則新增到其餘部分。Kotlin Gradle 外掛將根據您的 Gradle 建置腳本的 `kotlinOptions.jvmTarget` [編譯器選項](gradle-compiler-options.md)選擇適當的 JVM 標準函式庫。

[了解如何更改預設行為](gradle-configure-project.md#dependency-on-the-standard-library)。

### Kotlin 專案所需的最低 Gradle 版本

為了在您的 Kotlin 專案中享受新功能，請將 Gradle 更新到[最新版本](https://gradle.org/releases/)。
多平台專案需要 Gradle 6.0 或更高版本，而其他 Kotlin 專案則適用於 Gradle 5.4 或更高版本。

### 改進 IDE 中對 *.gradle.kts 的支援

在 1.4.0 中，我們持續改進 IDE 對 Gradle Kotlin DSL 腳本 (`*.gradle.kts` 檔案) 的支援。以下是新版本帶來的功能：

-   _明確載入腳本配置_ 以獲得更好的效能。以前，您對建置腳本所做的更改會自動在後台載入。為了提高效能，我們在 1.4.0 中停用了建置腳本配置的自動載入。現在 IDE 僅在您明確應用更改時才載入這些更改。

    在 Gradle 6.0 之前的版本中，您需要透過點擊編輯器中的 **Load Configuration** 手動載入腳本配置。

    ![*.gradle.kts – Load Configuration](gradle-kts-load-config.png)

    在 Gradle 6.0 及更高版本中，您可以透過點擊 **Load Gradle Changes** 或重新匯入 Gradle 專案來明確應用更改。

    我們在 IntelliJ IDEA 2020.1 中新增了一個動作，適用於 Gradle 6.0 及更高版本 – **Load Script Configurations**，它載入腳本配置的更改而無需更新整個專案。這比重新匯入整個專案花費的時間少得多。

    ![*.gradle.kts – Load Script Changes and Load Gradle Changes](gradle-kts.png)

    您也應該為新建立的腳本或首次使用新的 Kotlin 外掛打開專案時**載入腳本配置**。

    有了 Gradle 6.0 及更高版本，您現在可以一次性載入所有腳本，而不是以前的單獨載入實作。由於每個請求都需要執行 Gradle 配置階段，這對於大型 Gradle 專案可能耗費資源。

    目前，此類載入僅限於 `build.gradle.kts` 和 `settings.gradle.kts` 檔案（請為相關[問題](https://github.com/gradle/gradle/issues/12640)投票）。
    要啟用 `init.gradle.kts` 或已套用的[腳本外掛](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins)的突顯顯示，
    請使用舊機制 – 將它們新增到獨立腳本中。這些腳本的配置將在您需要時單獨載入。
    您還可以為此類腳本啟用自動重新載入。

    ![*.gradle.kts – Add to standalone scripts](gradle-kts-standalone.png)

-   _更好的錯誤報告_。以前您只能在單獨的日誌檔案中看到來自 Gradle Daemon 的錯誤。現在 Gradle Daemon 會直接返回所有錯誤資訊，並將其顯示在 Build 工具視窗中。這節省了您的時間和精力。

## 標準函式庫

以下是 Kotlin 1.4.0 中 Kotlin 標準函式庫最重要的變更列表：

-   [通用例外處理 API](#common-exception-processing-api)
-   [陣列與集合的新函數](#new-functions-for-arrays-and-collections)
-   [字串操作函數](#functions-for-string-manipulations)
-   [位元操作](#bit-operations)
-   [委派屬性改進](#delegated-properties-improvements)
-   [從 KType 轉換為 Java Type](#converting-from-ktype-to-java-type)
-   [Kotlin 反射的 Proguard 設定](#proguard-configurations-for-kotlin-reflection)
-   [改進現有 API](#improving-the-existing-api)
-   [標準函式庫構件的 module-info 描述符](#module-info-descriptors-for-stdlib-artifacts)
-   [棄用](#deprecations)
-   [排除已棄用的實驗性協程](#exclusion-of-the-deprecated-experimental-coroutines)

### 通用例外處理 API

以下 API 元素已移至通用函式庫：

*   `Throwable.stackTraceToString()` 擴充函數，它返回此 throwables 的詳細描述及其堆疊追蹤，以及 `Throwable.printStackTrace()`，它將此描述印到標準錯誤輸出。
*   `Throwable.addSuppressed()` 函數，它允許您指定為傳遞例外而被抑制的例外，以及 `Throwable.suppressedExceptions` 屬性，它返回所有被抑制例外的列表。
*   `@Throws` 註解，它列出將函數編譯為平台方法 (在 JVM 或原生平台上) 時將檢查的例外類型。

### 陣列與集合的新函數

#### 集合

在 1.4.0 中，標準函式庫包含許多用於處理**集合**的有用函數：

*   `setOfNotNull()`，它建立一個由所提供引數中所有非空項目組成的集合。

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   序列的 `shuffled()`。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = (0 until 50).asSequence()
        val result = numbers.map { it * 2 }.shuffled().take(5)
        println(result.toList()) //five random even numbers below 100
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `onEach()` 和 `flatMap()` 的 `*Indexed()` 對應函數。
    它們對集合元素執行的操作具有元素索引作為參數。

    ```kotlin
    fun main() {
    //sampleStart
        listOf("a", "b", "c", "d").onEachIndexed {
            index, item -> println(index.toString() + ":" + item)
        }
    
       val list = listOf("hello", "kot", "lin", "world")
              val kotlin = list.flatMapIndexed { index, item ->
                  if (index in 1..2) item.toList() else emptyList() 
              }
    //sampleEnd
              println(kotlin)
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `*OrNull()` 對應函數 `randomOrNull()`、`reduceOrNull()` 和 `reduceIndexedOrNull()`。
    它們在空集合上返回 `null`。

    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         //empty.reduce { a, b -> a + b } // Exception: Empty collection can't be reduced.
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `runningFold()`，其同義詞 `scan()`，以及 `runningReduce()` 依序對集合元素應用給定操作，
    類似於 `fold()` 和 `reduce()`；不同之處在於這些新函數返回所有中間結果的完整序列。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = mutableListOf(0, 1, 2, 3, 4, 5)
        val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
        val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
    //sampleEnd
        println(runningReduceSum.toString())
        println(runningFoldSum.toString())
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `sumOf()` 接受一個選擇器函數 (selector function) 並返回其所有集合元素的選定值之和。
    `sumOf()` 可以產生 `Int`、`Long`、`Double`、`UInt` 和 `ULong` 型別的和。在 JVM 上，`BigInteger` 和 `BigDecimal` 也可用。

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
    
        val total = order.sumOf { it.price * it.count } // Double
        val count = order.sumOf { it.count } // Int
    //sampleEnd
        println("You've ordered $count items that cost $total in total")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `min()` 和 `max()` 函數已更名為 `minOrNull()` 和 `maxOrNull()`，以符合 Kotlin 集合 API 中使用的命名慣例。函數名稱中的 `*OrNull` 後綴表示如果接收集合為空，則返回 `null`。這同樣適用於 `minBy()`、`maxBy()`、`minWith()`、`maxWith()` – 在 1.4 中，它們具有 `*OrNull()` 同義詞。
*   新的 `minOf()` 和 `maxOf()` 擴充函數返回給定選擇器函數在集合項目上的最小值和最大值。

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
        val highestPrice = order.maxOf { it.price }
    //sampleEnd
        println("The most expensive item in the order costs $highestPrice")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

    還有 `minOfWith()` 和 `maxOfWith()`，它們接受 `Comparator` 作為引數，以及所有四個函數的 `*OrNull()` 版本，它們在空集合上返回 `null`。

*   `flatMap` 和 `flatMapTo` 的新重載 (overloads) 允許您使用返回型別與接收型別不匹配的轉換，即：
    *   在 `Iterable`、`Array` 和 `Map` 上轉換為 `Sequence`
    *   在 `Sequence` 上轉換為 `Iterable`

    ```kotlin
    fun main() {
    //sampleStart
        val list = listOf("kot", "lin")
        val lettersList = list.flatMap { it.asSequence() }
        val lettersSeq = list.asSequence().flatMap { it.toList() }    
    //sampleEnd
        println(lettersList)
        println(lettersSeq.toList())
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `removeFirst()` 和 `removeLast()` 是從可變列表中刪除元素的捷徑，以及這些函數的 `*orNull()` 對應函數。

#### 陣列

為了提供處理不同容器類型時的一致體驗，我們還為**陣列**新增了函數：

*   `shuffle()` 將陣列元素以隨機順序排列。
*   `onEach()` 對每個陣列元素執行給定動作並返回陣列本身。
*   `associateWith()` 和 `associateWithTo()` 以陣列元素作為鍵建立映射。
*   `reverse()` 用於陣列子範圍，反轉子範圍中元素的順序。
*   `sortDescending()` 用於陣列子範圍，將子範圍中的元素以降序排列。
*   `sort()` 和 `sortWith()` 用於陣列子範圍，現在可在通用函式庫中使用。

```kotlin
fun main() {
//sampleStart
    var language = ""
    val letters = arrayOf("k", "o", "t", "l", "i", "n")
    val fileExt = letters.onEach { language += it }
       .filterNot { it in "aeuio" }.take(2)
       .joinToString(prefix = ".", separator = "")
    println(language) // "kotlin"
    println(fileExt) // ".kt"

    letters.shuffle()
    letters.reverse(0, 3)
    letters.sortDescending(2, 5)
    println(letters.contentToString()) // [k, o, t, l, i, n]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

此外，還有用於 `CharArray`/`ByteArray` 和 `String` 之間轉換的新函數：
*   `ByteArray.decodeToString()` 和 `String.encodeToByteArray()`
*   `CharArray.concatToString()` 和 `String.toCharArray()`

```kotlin
fun main() {
//sampleStart
	val str = "kotlin"
    val array = str.toCharArray()
    println(array.concatToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

#### ArrayDeque

我們還新增了 `ArrayDeque` 類別 — 一個雙端佇列的實作。
雙端佇列允許您在佇列的開頭或結尾以平攤常數時間新增或移除元素。當您在程式碼中需要佇列或堆疊時，您可以預設使用雙端佇列。

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

`ArrayDeque` 的實作內部使用了一個可調整大小的陣列：它將內容儲存在一個環形緩衝區 (circular buffer) 的 `Array` 中，並且僅在 `Array` 滿時才調整其大小。

### 字串操作函數

1.4.0 中的標準函式庫包含許多字串操作 API 的改進：

*   `StringBuilder` 擁有有用的新擴充函數：`set()`、`setRange()`、`deleteAt()`、`deleteRange()`、`appendRange()`
    以及其他。

    ```kotlin
        fun main() {
        //sampleStart
            val sb = StringBuilder("Bye Kotlin 1.3.72")
            sb.deleteRange(0, 3)
            sb.insertRange(0, "Hello", 0 ,5)
            sb.set(15, '4')
            sb.setRange(17, 19, "0")
            print(sb.toString())
        //sampleEnd
        }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `StringBuilder` 的一些現有函數在通用函式庫中可用。其中包括 `append()`、`insert()`、`substring()`、`setLength()` 等。
*   新的函數 `Appendable.appendLine()` 和 `StringBuilder.appendLine()` 已新增到通用函式庫。它們取代了這些類別僅限 JVM 的 `appendln()` 函數。

    ```kotlin
    fun main() {
    //sampleStart
        println(buildString {
            appendLine("Hello,")
            appendLine("world")
        })
    //sampleEnd
    }
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### 位元操作

位元操作的新函數：
*   `countOneBits()`
*   `countLeadingZeroBits()`
*   `countTrailingZeroBits()`
*   `takeHighestOneBit()`
*   `takeLowestOneBit()`
*   `rotateLeft()` 和 `rotateRight()` (實驗性)

```kotlin
fun main() {
//sampleStart
    val number = "1010000".toInt(radix = 2)
    println(number.countOneBits())
    println(number.countTrailingZeroBits())
    println(number.takeHighestOneBit().toString(2))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### 委派屬性改進

在 1.4.0 中，我們新增了功能以改善您在 Kotlin 中使用委派屬性 (delegated properties) 的體驗：
-   現在屬性可以委派給另一個屬性。
-   新的介面 `PropertyDelegateProvider` 有助於在單一宣告中建立委派提供者。
-   `ReadWriteProperty` 現在擴展 `ReadOnlyProperty`，因此您可以將它們用於只讀屬性。

除了新的 API，我們還進行了一些最佳化，以減少產生的位元碼大小。這些最佳化在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties)中進行了描述。

[進一步了解委派屬性](delegated-properties.md)。

### 從 KType 轉換為 Java Type

stdlib 中的新擴充屬性 `KType.javaType` (目前為實驗性) 可協助您從 Kotlin 型別取得 `java.lang.reflect.Type`，而無需使用整個 `kotlin-reflect` 依賴項。

```kotlin
import kotlin.reflect.javaType
import kotlin.reflect.typeOf

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T> accessReifiedTypeArg() {
   val kType = typeOf<T>()
   println("Kotlin type: $kType")
   println("Java type: ${kType.javaType}")
}

@OptIn(ExperimentalStdlibApi::class)
fun main() {
   accessReifiedTypeArg<String>()
   // Kotlin type: kotlin.String
   // Java type: class java.lang.String
  
   accessReifiedTypeArg<List<String>>()
   // Kotlin type: kotlin.collections.List<kotlin.String>
   // Java type: java.util.List<java.lang.String>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### Kotlin 反射的 Proguard 設定

從 1.4.0 開始，我們已將 Kotlin Reflection 的 Proguard/R8 配置嵌入到 `kotlin-reflect.jar` 中。這樣一來，大多數使用 R8 或 Proguard 的 Android 專案應該無需任何額外配置即可與 kotlin-reflect 配合使用。
您不再需要複製貼上 kotlin-reflect 內部結構的 Proguard 規則。但請注意，您仍然需要明確列出您將要反射的所有 API。

### 改進現有 API

*   一些函數現在在空接收器上工作，例如：
    *   字串上的 `toBoolean()`
    *   陣列上的 `contentEquals()`、`contentHashcode()`、`contentToString()`

*   `Double` 和 `Float` 中的 `NaN`、`NEGATIVE_INFINITY` 和 `POSITIVE_INFINITY` 現在定義為 `const`，因此您可以將它們用作註解引數。

*   `Double` 和 `Float` 中的新常數 `SIZE_BITS` 和 `SIZE_BYTES` 包含在二進位形式中表示型別實例所需的位數和位元組數。

*   `maxOf()` 和 `minOf()` 頂層函數可以接受可變數量的引數 (`vararg`)。

### 標準函式庫構件的 module-info 描述符

Kotlin 1.4.0 將 `module-info.java` 模組資訊新增到預設標準函式庫構件中。這使您可以將它們與 [jlink 工具](https://docs.oracle.com/en/java/javase/11/tools/jlink.html)一起使用，該工具會生成僅包含您的應用程式所需的平台模組的自訂 Java 運行時映像。
您已經可以使用 jlink 和 Kotlin 標準函式庫構件，但您必須使用單獨的構件才能這樣做 — 那些帶有「modular」分類器的構件 — 而且整個設定並不簡單。
在 Android 中，請確保您使用的 Android Gradle 外掛版本為 3.2 或更高，該版本可以正確處理帶有 module-info 的 jar 檔案。

### 棄用

#### Double 和 Float 的 toShort() 和 toByte()

我們已棄用 `Double` 和 `Float` 上的 `toShort()` 和 `toByte()` 函數，因為它們可能由於值範圍狹窄和變數大小較小而導致意外結果。

要將浮點數轉換為 `Byte` 或 `Short`，請使用兩步轉換：首先，將它們轉換為 `Int`，然後再次轉換為目標型別。

#### 浮點陣列上的 contains()、indexOf() 和 lastIndexOf()

我們已棄用 `FloatArray` 和 `DoubleArray` 的 `contains()`、`indexOf()` 和 `lastIndexOf()` 擴充函數，因為它們使用 [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 標準相等性，這在某些邊角情況下與全序相等性相矛盾。有關詳細資訊，請參閱[此問題](https://youtrack.jetbrains.com/issue/KT-28753)。

#### min() 和 max() 集合函數

我們已棄用 `min()` 和 `max()` 集合函數，改用 `minOrNull()` 和 `maxOrNull()`，後者更能恰當地反映其行為 — 在空集合上返回 `null`。
有關詳細資訊，請參閱[此問題](https://youtrack.jetbrains.com/issue/KT-38854)。

### 排除已棄用的實驗性協程

`kotlin.coroutines.experimental` API 在 1.3.0 中已棄用，取而代之的是 kotlin.coroutines。在 1.4.0 中，我們正在完成 `kotlin.coroutines.experimental` 的棄用週期，將其從標準函式庫中移除。對於仍在 JVM 上使用它的開發人員，我們提供了一個相容性構件 `kotlin-coroutines-experimental-compat.jar`，其中包含所有實驗性協程 API。我們已將其發佈到 Maven，並將其與標準函式庫一起包含在 Kotlin 發行版中。

## 穩定的 JSON 序列化

隨著 Kotlin 1.4.0 的發佈，我們正在推出第一個穩定版本的 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) - 1.0.0-RC。現在我們很高興地宣布 `kotlinx-serialization-core` (以前稱為 `kotlinx-serialization-runtime`) 中的 JSON 序列化 API 穩定。其他序列化格式的函式庫仍處於實驗階段，核心函式庫的一些進階部分也是如此。

我們已大幅重構 JSON 序列化 API，使其更一致且易於使用。從現在開始，我們將繼續以向後相容的方式開發 JSON 序列化 API。
但是，如果您曾使用過以前的版本，則在遷移到 1.0.0-RC 時需要重寫部分程式碼。
為了幫助您，我們還提供了 **[Kotlin 序列化指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)** —
一套完整的 `kotlinx.serialization` 文件。它將引導您使用最重要的功能，並幫助您解決可能遇到的任何問題。

>**注意**：`kotlinx-serialization` 1.0.0-RC 僅適用於 Kotlin 編譯器 1.4。早期編譯器版本不相容。
>
{style="note"}

## 腳本編寫與 REPL

在 1.4.0 中，Kotlin 中的腳本編寫 (scripting) 受益於許多功能和效能改進以及其他更新。
以下是一些主要變化：

-   [全新依賴項解析 API](#new-dependencies-resolution-api)
-   [全新 REPL API](#new-repl-api)
-   [編譯腳本快取](#compiled-scripts-cache)
-   [構件重新命名](#artifacts-renaming)

為了幫助您更熟悉 Kotlin 中的腳本編寫，我們準備了一個[範例專案](https://github.com/Kotlin/kotlin-script-examples)。
它包含標準腳本 (`*.main.kts`) 的範例，以及 Kotlin Scripting API 和自定義腳本定義的用法範例。請試用並使用我們的[問題追蹤器](https://youtrack.jetbrains.com/issues/KT)分享您的回饋。

### 全新依賴項解析 API

在 1.4.0 中，我們引入了一個新的 API 用於解析外部依賴項 (例如 Maven 構件)，並為其提供了實作。此 API 已發佈在新的構件 `kotlin-scripting-dependencies` 和 `kotlin-scripting-dependencies-maven` 中。
`kotlin-script-util` 函式庫中以前的依賴項解析功能現已棄用。

### 全新 REPL API

新的實驗性 REPL API 現在是 Kotlin Scripting API 的一部分。在已發佈的構件中也有它的幾種實作，有些還具有進階功能，例如程式碼自動完成。我們在 [Kotlin Jupyter kernel](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/) 中使用此 API，現在您可以在自己的自定義 shell 和 REPL 中試用它。

### 編譯腳本快取

Kotlin Scripting API 現在提供了實現編譯腳本快取的功能，顯著加快了未更改腳本的後續執行。我們的預設進階腳本實作 `kotlin-main-kts` 已經擁有自己的快取。

### 構件重新命名

為了避免構件名稱混淆，我們已將 `kotlin-scripting-jsr223-embeddable` 和 `kotlin-scripting-jvm-host-embeddable` 重命名為 `kotlin-scripting-jsr223` 和 `kotlin-scripting-jvm-host`。這些構件依賴於 `kotlin-compiler-embeddable` 構件，該構件對捆綁的第三方函式庫進行了著色處理，以避免使用衝突。透過此重命名，我們使 `kotlin-compiler-embeddable`（通常更安全）成為腳本編寫構件的預設使用方式。
如果出於某種原因，您需要依賴未著色處理的 `kotlin-compiler` 的構件，請使用帶有 `-unshaded` 後綴的構件版本，例如 `kotlin-scripting-jsr223-unshaded`。請注意，此重命名僅影響預期直接使用的腳本編寫構件；其他構件的名稱保持不變。

## 移轉至 Kotlin 1.4.0

Kotlin 外掛的移轉工具可協助您將專案從舊版 Kotlin 移轉至 1.4.0。

只需將 Kotlin 版本更改為 `1.4.0` 並重新匯入您的 Gradle 或 Maven 專案即可。IDE 將隨後詢問您有關移轉的事宜。

如果您同意，它將運行移轉程式碼檢查，檢查您的程式碼並建議糾正 1.4.0 中不適用或不推薦的任何內容。

![Run migration](run-migration-wn.png){width=300}

程式碼檢查具有不同的[嚴重性級別](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html)，
以幫助您決定接受哪些建議以及忽略哪些建議。

![Migration inspections](migration-inspection-wn.png)

Kotlin 1.4.0 是一個[功能發行版](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能
會帶來不相容的語言變更。請在 **[Kotlin 1.4 相容性指南](compatibility-guide-14.md)** 中找到此類變更的詳細列表。