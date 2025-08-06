[//]: # (title: Kotlin 1.4.0 新功能)

_[發布日期：2020 年 8 月 17 日](releases.md#release-details)_

在 Kotlin 1.4.0 中，我們對其所有組件進行了多項改進，並將[重點放在品質與效能上](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)。
以下是 Kotlin 1.4.0 中最重要的變更列表。

## 語言功能與改進

Kotlin 1.4.0 帶來了各種不同的語言功能與改進，其中包括：

* [Kotlin 介面的 SAM 轉換](#sam-conversions-for-kotlin-interfaces)
* [函式庫作者的顯式 API 模式](#explicit-api-mode-for-library-authors)
* [混合命名引數與位置引數](#mixing-named-and-positional-arguments)
* [末尾逗號](#trailing-comma)
* [可呼叫參考改進](#callable-reference-improvements)
* [在迴圈中包含的 `when` 表達式內使用 `break` 與 `continue`](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin 介面的 SAM 轉換

在 Kotlin 1.4.0 之前，您只能在[使用 Java 方法與 Kotlin 中的 Java 介面](java-interop.md#sam-conversions)時應用 SAM (單一抽象方法) 轉換。從現在開始，您也可以為 Kotlin 介面使用 SAM 轉換。
為此，請使用 `fun` 修飾符將 Kotlin 介面明確標記為功能性。

如果當參數預期為只有一個單一抽象方法的介面時，您傳遞一個 lambda 作為引數，則會應用 SAM 轉換。
在此情況下，編譯器會自動將 lambda 轉換為實作抽象成員函式的類別實例。

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

[了解更多關於 Kotlin 功能性介面與 SAM 轉換的資訊](fun-interfaces.md)。

### 函式庫作者的顯式 API 模式

Kotlin 編譯器為函式庫作者提供了 _顯式 API 模式_。在此模式下，編譯器會執行額外檢查，
協助使函式庫的 API 更清晰、更一致。它對暴露給函式庫公共 API 的宣告新增了以下要求：

* 如果預設可見性將宣告暴露給公共 API，則宣告需要可見性修飾符。
這有助於確保沒有宣告意外地暴露給公共 API。
* 暴露給公共 API 的屬性與函式需要明確的型別規範。
這保證了 API 使用者知道他們所使用 API 成員的型別。

根據您的配置，這些顯式 API 可能會產生錯誤 (嚴格模式) 或警告 (警告模式)。
為了可讀性與常識，某些型別的宣告被排除在這些檢查之外：

* 主要建構函數
* 資料類別的屬性
* 屬性 getter 與 setter
* `override` 方法

顯式 API 模式僅分析模組的生產原始碼。

要以顯式 API 模式編譯您的模組，請將以下行新增到您的 Gradle 建置腳本中：

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

使用命令列編譯器時，請透過新增 `-Xexplicit-api` 編譯器選項並將值設為 `strict` 或 `warning` 來切換到顯式 API 模式。

```bash
-Xexplicit-api={strict|warning}
```

[在 KEEP 中找到有關顯式 API 模式的更多詳細資訊](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md)。 

### 混合命名引數與位置引數

在 Kotlin 1.3 中，當您使用[命名引數](functions.md#named-arguments)呼叫函式時，您必須將所有沒有名稱的引數 (位置引數) 放在第一個命名引數之前。例如，您可以呼叫 `f(1, y = 2)`，
但不能呼叫 `f(x = 1, 2)`。

當所有引數都位於正確位置但您想為中間的一個引數指定名稱時，這真的很煩人。
這對於明確指出布林值或 `null` 值屬於哪個屬性特別有用。

在 Kotlin 1.4 中，沒有這樣的限制 – 您現在可以為一組位置引數中間的引數指定名稱。
此外，您可以任意混合位置引數與命名引數，只要它們保持正確的順序即可。

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

### 末尾逗號

在 Kotlin 1.4 中，您現在可以在列舉中添加末尾逗號，例如引數與參數列表、`when` 條目，以及解構宣告的組件。
有了末尾逗號，您可以添加新項目並更改其順序，而無需添加或刪除逗號。

如果對參數或值使用多行語法，這特別有用。添加末尾逗號後，您可以輕鬆交換包含參數或值的行。

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

### 可呼叫參考改進

Kotlin 1.4 支援更多使用可呼叫參考的案例：

* 包含帶有預設值的參數的函式參考
* 返回 `Unit` 的函式中的函式參考 
* 根據函式中引數數量進行調整的參考
* 可呼叫參考上的 suspend 轉換 

#### 包含帶有預設值的參數的函式參考

現在您可以將可呼叫參考用於包含帶有預設值的參數的函式。如果對函式 `foo` 的可呼叫參考不帶引數，則使用預設值 `0`。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

以前，您必須為 `apply` 或 `foo` 函式編寫額外的重載。

```kotlin
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### 返回 Unit 的函式中的函式參考 

在 Kotlin 1.4 中，您可以在返回 `Unit` 的函式中使用對返回任何型別的函式的可呼叫參考。
在 Kotlin 1.4 之前，在此情況下您只能使用 lambda 引數。現在您可以同時使用 lambda 引數與可呼叫參考。

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

#### 根據函式中引數數量進行調整的參考

現在，當傳遞可變數量引數 (`vararg`) 時，您可以調整對函式的可呼叫參考。
您可以在傳遞引數列表的末尾傳遞任意數量的相同型別參數。

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

#### 可呼叫參考上的 suspend 轉換

除了 lambda 上的 suspend 轉換外，Kotlin 從 1.4.0 版本開始也支援可呼叫參考上的 suspend 轉換。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

### 在迴圈中包含的 `when` 表達式內使用 `break` 與 `continue`

在 Kotlin 1.3 中，您不能在迴圈中包含的 `when` 表達式內使用不帶限定詞的 `break` 與 `continue`。原因是這些關鍵字保留用於 `when` 表達式中可能的 [fall-through 行為](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)。 

這就是為什麼如果您想在迴圈中的 `when` 表達式內使用 `break` 與 `continue`，您必須[標記](returns.md#break-and-continue-labels)它們，這變得相當麻煩。

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

在 Kotlin 1.4 中，您可以在迴圈中包含的 `when` 表達式內使用不帶標籤的 `break` 與 `continue`。它們會按預期終止最近的封閉迴圈或進行到其下一步。

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

`when` 內部 fall-through 行為將留待未來設計。

## IDE 中的新工具

藉助 Kotlin 1.4，您可以使用 IntelliJ IDEA 中的新工具來簡化 Kotlin 開發：

* [新彈性專案精靈](#new-flexible-project-wizard)
* [協程除錯器](#coroutine-debugger)

### 新彈性專案精靈

透過新的彈性 Kotlin 專案精靈，您可以輕鬆建立與配置不同型別的 Kotlin
專案，包括多平台專案，這些專案在沒有 UI 的情況下可能難以配置。

![Kotlin Project Wizard – Multiplatform project](multiplatform-project-1-wn.png)

新的 Kotlin 專案精靈既簡單又彈性：

1. *選擇專案範本*，具體取決於您要執行的操作。將來會添加更多範本。
2. *選擇建置系統* – Gradle (Kotlin 或 Groovy DSL)、Maven 或 IntelliJ IDEA。
    Kotlin 專案精靈將僅顯示所選專案範本支援的建置系統。
3. 直接在主螢幕上*預覽專案結構*。

然後您可以完成專案建立，或者可選地，在下一個螢幕上*配置專案*：

4. *新增/移除模組與目標*，這些模組與目標為此專案範本所支援。
5. *配置模組與目標設定*，例如目標 JVM 版本、目標範本與測試框架。

![Kotlin Project Wizard - Configure targets](multiplatform-project-2-wn.png)

未來，我們將透過新增更多配置選項與範本，使 Kotlin 專案精靈更具彈性。

您可以透過這些教學課程來試用新的 Kotlin 專案精靈：

* [建立基於 Kotlin/JVM 的控制台應用程式](jvm-get-started.md)
* [為 React 建立 Kotlin/JS 應用程式](js-react.md)
* [建立 Kotlin/Native 應用程式](native-get-started.md)

### 協程除錯器

許多人已經使用[協程](coroutines-guide.md)進行非同步程式設計。
但在 Kotlin 1.4 之前，除錯協程可能非常痛苦。由於協程在執行緒之間跳轉，
因此很難理解特定協程在做什麼並檢查其上下文。在某些情況下，追蹤中斷點的步驟根本不起作用。結果，您必須依賴日誌記錄或心力來除錯使用協程的程式碼。

在 Kotlin 1.4 中，透過 Kotlin 外掛程式隨附的新功能，除錯協程現在方便得多。

> 除錯適用於 `kotlinx-coroutines-core` 的 1.3.8 或更高版本。
>
{style="note"}

**Debug Tool Window** 現在包含一個新的 **Coroutines** 標籤頁。在此標籤頁中，您可以找到有關當前
正在運行與已暫停協程的資訊。協程按其運行所在的調度器進行分組。

![Debugging coroutines](coroutine-debugger-wn.png)

現在您可以：
* 輕鬆檢查每個協程的狀態。
* 查看運行中與已暫停協程的局部與捕獲變數值。
* 查看完整的協程建立堆疊，以及協程內部的呼叫堆疊。堆疊包含所有帶有
變數值的框架，即使那些在標準除錯期間會丟失的框架。

如果您需要包含每個協程狀態及其堆疊的完整報告，請右鍵單擊 **Coroutines** 標籤頁內，然後
單擊 **Get Coroutines Dump**。目前，協程 dump 相當簡單，但我們將使其在未來版本的 Kotlin 中更具可讀性與幫助性。

![Coroutines Dump](coroutines-dump-wn.png)

在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/)與
[IntelliJ IDEA 文件](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html)中了解更多關於除錯協程的資訊。

## 新編譯器

新的 Kotlin 編譯器將會非常快；它將統一所有支援的平台並為編譯器擴展提供
API。這是一個長期專案，我們已經在 Kotlin 1.4.0 中完成了幾個步驟：

* [新的、更強大的型別推斷演算法](#new-more-powerful-type-inference-algorithm)預設啟用。
* [新的 JVM 與 JS IR 後端](#unified-backends-and-extensibility)。一旦我們將其穩定化，它們將成為預設。

### 新的、更強大的型別推斷演算法

Kotlin 1.4 使用一種新的、更強大的型別推斷演算法。這個新演算法在
Kotlin 1.3 中已經可以透過指定編譯器選項進行嘗試，現在它已預設使用。您可以在
[YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20)中找到新演算法中修復的問題的完整列表。在這裡，您可以找到一些最顯著的改進：

* [更多自動推斷型別的案例](#more-cases-where-type-is-inferred-automatically)
* [lambda 最後一個表達式的 Smart Casts](#smart-casts-for-a-lambda-s-last-expression)
* [可呼叫參考的 Smart Casts](#smart-casts-for-callable-references)
* [委託屬性更好的推斷](#better-inference-for-delegated-properties)
* [帶有不同引數的 Java 介面的 SAM 轉換](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Kotlin 中的 Java SAM 介面](#java-sam-interfaces-in-kotlin)

#### 更多自動推斷型別的案例

新推斷演算法為許多舊演算法需要您明確指定型別的案例推斷型別。
例如，在以下範例中，lambda 參數 `it` 的型別被正確推斷為 `String?`：

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

在 Kotlin 1.3 中，您需要引入一個顯式的 lambda 參數或將 `to` 替換為帶有
顯式泛型引數的 `Pair` 建構函數才能使其工作。

#### lambda 最後一個表達式的 Smart Casts

在 Kotlin 1.3 中，除非您指定預期型別，否則 lambda 內的最後一個表達式不會被 Smart Cast。
因此，在以下範例中，Kotlin 1.3 推斷 `String?` 作為 `result` 變數的型別：

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

在 Kotlin 1.4 中，由於新的推斷演算法，lambda 內的最後一個表達式被 Smart Cast，並且這個新的、
更精確的型別用於推斷結果 lambda 型別。因此，`result` 變數的型別變為 `String`。

在 Kotlin 1.3 中，您通常需要添加顯式 cast (無論是 `!!` 還是像 `as String` 這樣的型別 cast) 才能使此類案例工作，
而現在這些 cast 已變得不必要。

#### 可呼叫參考的 Smart Casts

在 Kotlin 1.3 中，您無法存取 Smart Cast 型別的成員參考。現在在 Kotlin 1.4 中，您可以：

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

在 `animal` 變數已 Smart Cast 為特定型別 `Cat` 與 `Dog` 後，您可以使用不同的成員參考 `animal::meow` 與 `animal::woof`。
型別檢查後，您可以存取與子型別對應的成員參考。

#### 委託屬性更好的推斷

在分析 `by` 關鍵字後面的委託表達式時，委託屬性的型別未被考慮在內。
例如，以下程式碼以前無法編譯，但現在編譯器正確推斷 `old` 與 `new` 參數的型別為 `String?`：

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

Kotlin 從一開始就支援 Java 介面的 SAM 轉換，但有一種情況不被支援，
這在使用現有 Java 函式庫時有時很煩人。如果您呼叫一個接受兩個 SAM 介面作為參數的 Java 方法，
則兩個引數都需要是 lambda 或常規物件。您不能將一個引數作為 lambda 傳遞，而另一個作為物件傳遞。

新演算法修復了這個問題，您可以在任何情況下傳遞 lambda 而不是 SAM 介面，
這正是您自然期望它的工作方式。

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

在 Kotlin 1.4 中，您可以在 Kotlin 中使用 Java SAM 介面並對它們應用 SAM 轉換。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

在 Kotlin 1.3 中，您必須在 Java 程式碼中宣告上述函式 `foo` 才能執行 SAM 轉換。

### 統一後端與擴展性

在 Kotlin 中，我們有三個生成可執行檔的後端：Kotlin/JVM、Kotlin/JS 和 Kotlin/Native。Kotlin/JVM 和 Kotlin/JS
沒有太多共用程式碼，因為它們是獨立開發的。Kotlin/Native 基於圍繞 Kotlin 程式碼的中間表示 (IR) 的新基礎設施。

我們現在正在將 Kotlin/JVM 和 Kotlin/JS 遷移到相同的 IR。因此，所有三個後端
共用大量邏輯並具有統一的管道。這使我們能夠為所有平台實作大多數功能、最佳化和錯誤修復一次。
兩個新的基於 IR 的後端都處於 [Alpha](components-stability.md) 階段。

共同的後端基礎設施也為多平台編譯器擴展打開了大門。您將能夠插入管道並添加自訂處理和轉換，這些處理和轉換將自動適用於所有平台。

我們鼓勵您試用我們新的 [JVM IR](#new-jvm-ir-backend) 與 [JS IR](#new-js-ir-backend) 後端，它們目前處於 Alpha 階段，並與我們分享您的回饋。

## Kotlin/JVM

Kotlin 1.4.0 包含許多 JVM 特定的改進，例如：
 
* [新的 JVM IR 後端](#new-jvm-ir-backend)
* [介面中生成預設方法的新模式](#new-modes-for-generating-default-methods)
* [Null 檢查的統一例外型別](#unified-exception-type-for-null-checks)
* [JVM 位元組碼中的型別註解](#type-annotations-in-the-jvm-bytecode)

### 新的 JVM IR 後端

與 Kotlin/JS 一樣，我們正在將 Kotlin/JVM 遷移到[統一的 IR 後端](#unified-backends-and-extensibility)，
這使我們能夠為所有平台實作大多數功能與錯誤修復一次。您還可以透過建立適用於所有平台的多平台擴展來從中受益。

Kotlin 1.4.0 尚未為此類擴展提供公共 API，但我們正在與我們的合作夥伴密切合作，
包括 [Jetpack Compose](https://developer.android.com/jetpack/compose)，他們已經在使用我們的新後端建置他們的編譯器外掛程式。

我們鼓勵您試用新的 Kotlin/JVM 後端（目前處於 Alpha 階段），並向我們的[問題追蹤器](https://youtrack.jetbrains.com/issues/KT)提交任何問題和功能請求。
這將幫助我們統一編譯器管道並更快地將 Jetpack Compose 等編譯器擴展帶到 Kotlin 社群。

要啟用新的 JVM IR 後端，請在您的 Gradle 建置腳本中指定一個額外的編譯器選項：

```kotlin
kotlinOptions.useIR = true
```

> 如果您[啟用 Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en)，您將自動
> 選用新的 JVM 後端，無需在 `kotlinOptions` 中指定編譯器選項。
>
{style="note"}

使用命令列編譯器時，請添加編譯器選項 `-Xuse-ir`。

> 您只能在啟用新後端的情況下使用由新 JVM IR 後端編譯的程式碼。否則，您將收到錯誤。
> 考慮到這一點，我們不建議函式庫作者在生產環境中切換到新後端。
>
{style="note"}

### 介面中生成預設方法的新模式

將 Kotlin 程式碼編譯到 JVM 1.8 及更高版本時，您可以將 Kotlin 介面的非抽象方法編譯成
Java 的 `default` 方法。為此，有一個機制包含用於標記此類方法的 `@JvmDefault` 註解
以及啟用此註解處理的 `-Xjvm-default` 編譯器選項。

在 1.4.0 中，我們新增了一種用於生成預設方法的新模式：`-Xjvm-default=all` 將把 Kotlin 介面中*所有*非抽象方法
編譯為 `default` Java 方法。為了與使用未編譯 `default` 介面的程式碼相容，
我們還添加了 `all-compatibility` 模式。

有關 Java 互操作中預設方法的更多資訊，請參閱[互操作性文件](java-to-kotlin-interop.md#default-methods-in-interfaces)和
[這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### Null 檢查的統一例外型別

從 Kotlin 1.4.0 開始，所有執行時 null 檢查都將拋出 `java.lang.NullPointerException`，而不是 `KotlinNullPointerException`、
`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`。這適用於：`!!` 運算符、
方法前置中的參數 null 檢查、平台型別表達式 null 檢查以及帶有非 null 型別的 `as` 運算符。
這不適用於 `lateinit` null 檢查和顯式函式庫函式呼叫，例如 `checkNotNull` 或 `requireNotNull`。

此更改增加了 Kotlin 編譯器或各種類型的位元組碼處理工具（例如 Android [R8 優化器](https://developer.android.com/studio/build/shrink-code)）可以執行的
null 檢查優化數量。

請注意，從開發人員的角度來看，事情不會改變太多：Kotlin 程式碼將拋出與以前相同的錯誤訊息。
例外型別更改，但傳遞的資訊保持不變。

### JVM 位元組碼中的型別註解

Kotlin 現在可以在 JVM 位元組碼 (目標版本 1.8+) 中生成型別註解，以便它們在執行時透過 Java 反射可用。
要在位元組碼中發出型別註解，請遵循以下步驟：

1. 確保您宣告的註解具有適當的註解目標 (Java 的 `ElementType.TYPE_USE` 或 Kotlin 的
`AnnotationTarget.TYPE`) 和保留策略 (`AnnotationRetention.RUNTIME`)。
2. 將註解類別宣告編譯為 JVM 位元組碼目標版本 1.8+。您可以使用 `-jvm-target=1.8`
編譯器選項指定它。
3. 將使用註解的程式碼編譯為 JVM 位元組碼目標版本 1.8+ (`-jvm-target=1.8`) 並添加
`-Xemit-jvm-type-annotations` 編譯器選項。

請注意，標準函式庫中的型別註解目前不會發出到位元組碼中，因為標準函式庫是使用目標版本 1.6 編譯的。

到目前為止，僅支援基本案例：

- 方法參數、方法返回型別和屬性型別上的型別註解；
- 型別引數的不變投影，例如 `Smth<@Ann Foo>`、`Array<@Ann Foo>`。

在以下範例中，`String` 型別上的 `@Foo` 註解可以發出到位元組碼中，然後由
函式庫程式碼使用：

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

在 JS 平台上，Kotlin 1.4.0 提供了以下改進：

- [新的 Gradle DSL](#new-gradle-dsl)
- [新的 JS IR 後端](#new-js-ir-backend)

### 新的 Gradle DSL

`kotlin.js` Gradle 外掛程式帶有調整後的 Gradle DSL，它提供了許多新的配置選項，並且更緊密地與 `kotlin-multiplatform` 外掛程式使用的 DSL 對齊。一些最具影響力的變更包括：

- 透過 `binaries.executable()` 明確切換建立可執行檔。在此處閱讀更多關於[執行 Kotlin/JS 及其環境的資訊](js-project-setup.md#execution-environments)。
- 透過 `cssSupport` 從 Gradle 配置中配置 webpack 的 CSS 和 style loaders。在此處閱讀更多關於[使用 CSS 和 style loaders 的資訊](js-project-setup.md#css)。
- 改進的 npm 依賴管理，強制使用版本號或 [semver](https://docs.npmjs.com/about-semantic-versioning) 版本範圍，以及使用 `devNpm`、`optionalNpm` 和 `peerNpm` 支援 _開發_、_peer_ 和 _可選_ npm 依賴。
[在此處直接從 Gradle 閱讀更多關於 npm 套件依賴管理的資訊](js-project-setup.md#npm-dependencies)。
- [Dukat](https://github.com/Kotlin/dukat) 的更強大整合，Kotlin 外部宣告的生成器。外部宣告現在可以在建置時生成，或者可以透過 Gradle 任務手動生成。

### 新的 JS IR 後端

Kotlin/JS 的 [IR 後端](js-ir-compiler.md)目前具有 [Alpha](components-stability.md) 穩定性，它提供了一些特定於 Kotlin/JS 目標的新功能，這些功能主要集中在透過無用程式碼消除來生成程式碼大小，以及改進與 JavaScript 和 TypeScript 的互操作性等。

要啟用 Kotlin/JS IR 後端，請在您的 `gradle.properties` 中設定鍵 `kotlin.js.compiler=ir`，或者將 `IR` 編譯器型別傳遞給您的 Gradle 建置腳本的 `js` 函式：

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

有關如何配置新後端的更多詳細資訊，請參閱 [Kotlin/JS IR 編譯器文件](js-ir-compiler.md)。

藉助新的 [@JsExport](js-to-kotlin-interop.md#jsexport-annotation) 註解以及從 Kotlin 程式碼**[生成 TypeScript 定義 (d.ts)](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts)** 的能力，Kotlin/JS IR 編譯器後端改進了 JavaScript 和 TypeScript 的互操作性。這也使得將 Kotlin/JS 程式碼與現有工具整合、建立**混合應用程式**以及利用多平台專案中的程式碼共用功能變得更加容易。

[了解更多關於 Kotlin/JS IR 編譯器後端中可用的功能](js-ir-compiler.md)。

## Kotlin/Native

在 1.4.0 中，Kotlin/Native 獲得了大量新功能和改進，包括：

* [Swift 和 Objective-C 中對 suspend 函式的支援](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [預設支援 Objective-C 泛型](#objective-c-generics-support-by-default)
* [Objective-C/Swift 互操作中的例外處理](#exception-handling-in-objective-c-swift-interop)
* [預設在 Apple 目標上生成發布版 .dSYMs](#generate-release-dsyms-on-apple-targets-by-default)
* [效能改進](#performance-improvements)
* [簡化 CocoaPods 依賴管理](#simplified-management-of-cocoapods-dependencies)

### Swift 和 Objective-C 中對 Kotlin 的 suspend 函式的支援

在 1.4.0 中，我們添加了對 Swift 和 Objective-C 中 suspend 函式的基本支援。現在，當您將 Kotlin 模組
編譯為 Apple 框架時，suspend 函式在其中作為帶有回呼的函式可用 (Swift/Objective-C 術語中的 `completionHandler`)。
當生成的框架標頭中有此類函式時，您可以從 Swift 或 Objective-C 程式碼中呼叫它們，甚至覆寫它們。

例如，如果您編寫此 Kotlin 函式：

```kotlin
suspend fun queryData(id: Int): String = ...
```

...那麼您可以從 Swift 中這樣呼叫它：

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[了解更多關於在 Swift 和 Objective-C 中使用 suspend 函式的資訊](native-objc-interop.md)。

### 預設支援 Objective-C 泛型

Kotlin 的先前版本為 Objective-C 互操作中的泛型提供了實驗性支援。從 1.4.0 開始，Kotlin/Native
預設從 Kotlin 程式碼生成帶有泛型的 Apple 框架。在某些情況下，這可能會破壞呼叫 Kotlin 框架的現有 Objective-C
或 Swift 程式碼。要讓框架標頭在沒有泛型的情況下編寫，請添加 `-Xno-objc-generics` 編譯器選項。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

請注意，[關於與 Objective-C 互操作性的文件](native-objc-interop.md#generics)中列出的所有細節和限制仍然有效。

### Objective-C/Swift 互操作中的例外處理

在 1.4.0 中，我們稍微更改了從 Kotlin 生成的 Swift API，關於例外轉換的方式。
Kotlin 和 Swift 之間在錯誤處理上存在根本差異。所有 Kotlin 例外都是 unchecked，而 Swift 只有 checked 錯誤。
因此，為了讓 Swift 程式碼感知預期例外，Kotlin 函式應使用 `@Throws` 註解標記，
並指定潛在例外類別的列表。

當編譯為 Swift 或 Objective-C 框架時，帶有或繼承 `@Throws` 註解的函式在 Objective-C 中表示為 `NSError*` 生成方法，在 Swift 中表示為 `throws` 方法。

以前，除了 `RuntimeException` 和 `Error` 之外的任何例外都會作為 `NSError` 傳播。現在此行為發生變化：
現在 `NSError` 僅針對作為 `@Throws` 註解參數指定類別 (或其子類別) 實例的例外拋出。
到達 Swift/Objective-C 的其他 Kotlin 例外被視為未處理並導致程式終止。

### 預設在 Apple 目標上生成發布版 .dSYMs

從 1.4.0 開始，Kotlin/Native 編譯器預設為 Darwin 平台上的發布二進位檔案生成[除錯符號檔](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information)
 (`.dSYM`)。這可以透過 `-Xadd-light-debug=disable` 編譯器選項禁用。在其他平台上，此選項預設禁用。要在 Gradle 中切換此選項，請使用：

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[了解更多關於崩潰報告符號化的資訊](native-ios-symbolication.md)。

### 效能改進

Kotlin/Native 獲得了許多效能改進，加速了開發過程和執行。
以下是一些範例：

- 為了提高物件分配的速度，我們現在提供 [mimalloc](https://github.com/microsoft/mimalloc)
記憶體分配器作為系統分配器的替代方案。mimalloc 在某些基準測試中運行速度快兩倍。
目前，在 Kotlin/Native 中使用 mimalloc 是實驗性的；您可以透過使用 `-Xallocator=mimalloc` 編譯器選項來切換到它。

- 我們重新設計了 C interop 函式庫的建置方式。藉助新工具，Kotlin/Native 生成 interop 函式庫的速度比以前快 4 倍，
而且工件大小是以前的 25% 到 30%。

- 由於 GC 的最佳化，整體執行時效能得到了提升。這種提升在具有大量長壽命物件的專案中將會特別明顯。
`HashMap` 和 `HashSet` 集合現在透過避免冗餘裝箱而工作得更快。

- 在 1.3.70 中，我們引入了兩個新功能來改善 Kotlin/Native 編譯的效能：
[快取專案依賴項和從 Gradle daemon 運行編譯器](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。
從那時起，我們已經修復了許多問題並改進了這些功能的整體穩定性。

### 簡化 CocoaPods 依賴管理

以前，一旦您將專案與依賴管理工具 CocoaPods 整合，您只能在 Xcode 中建置 iOS、macOS、watchOS 或 tvOS 部分的專案，
與您的多平台專案的其他部分分開。這些其他部分可以在 IntelliJ IDEA 中建置。

此外，每當您添加對儲存在 CocoaPods (Pod 函式庫) 中的 Objective-C 函式庫的依賴時，
您都必須從 IntelliJ IDEA 切換到 Xcode，呼叫 `pod install`，並在那裡運行 Xcode 建置。

現在，您可以在 IntelliJ IDEA 中直接管理 Pod 依賴項，同時享受它為程式碼工作提供的好處，
例如程式碼高亮顯示和自動完成。您還可以使用 Gradle 建置整個 Kotlin 專案，而無需切換到 Xcode。
這意味著您只需要在需要編寫 Swift/Objective-C 程式碼或在模擬器或裝置上運行您的應用程式時才需要進入 Xcode。

現在您還可以處理本地儲存的 Pod 函式庫。

根據您的需求，您可以在以下之間添加依賴項：
* Kotlin 專案與遠端儲存在 CocoaPods 儲存庫或本地儲存在您機器上的 Pod 函式庫。
* Kotlin Pod (用作 CocoaPods 依賴項的 Kotlin 專案) 與帶有一個或多個目標的 Xcode 專案。

完成初始配置後，當您向 `cocoapods` 添加新的依賴項時，只需在 IntelliJ IDEA 中重新匯入專案即可。
新的依賴項將自動添加。無需額外步驟。

[了解如何添加依賴項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html)。

## Kotlin 多平台

> 對多平台專案的支援處於 [Alpha](components-stability.md) 階段。未來它可能會發生不相容的變更，並需要手動遷移。
> 我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋。
>
{style="warning"}

[Kotlin 多平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)減少了為[不同平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)編寫和維護相同程式碼所花費的時間，
同時保留了原生程式設計的靈活性和優勢。我們繼續投入精力於多平台功能和改進：

* [使用階層式專案結構在多個目標中共享程式碼](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
* [在階層式結構中利用原生函式庫](#leveraging-native-libs-in-the-hierarchical-structure)
* [僅指定一次 kotlinx 依賴項](#specifying-dependencies-only-once)

> 多平台專案需要 Gradle 6.0 或更高版本。
>
{style="note"}

### 使用階層式專案結構在多個目標中共享程式碼

藉助新的階層式專案結構支援，您可以在[多平台專案](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html)中的[多個平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)之間共享程式碼。

以前，添加到多平台專案的任何程式碼都可以放置在平台特定原始碼集中，該原始碼集僅限於一個目標，
並且不能被任何其他平台重用，或者放置在通用原始碼集中，例如 `commonMain` 或 `commonTest`，
該原始碼集在專案中的所有平台之間共享。在通用原始碼集中，您只能透過使用需要平台特定 `actual` 實作的
[`expect` 宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)來呼叫平台特定 API。

這使得[在所有平台上共享程式碼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-all-platforms)變得容易，
但[在僅部分目標之間共享](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)則不那麼容易，
尤其是那些可能重用大量通用邏輯和第三方 API 的相似目標。

例如，在一個典型的針對 iOS 的多平台專案中，有兩個與 iOS 相關的目標：一個用於 iOS ARM64 裝置，
另一個用於 x64 模擬器。它們有單獨的平台特定原始碼集，但實際上，很少需要為裝置和模擬器提供不同的程式碼，
而且它們的依賴關係非常相似。因此，iOS 特定程式碼可以在它們之間共享。

顯然，在此設定中，最好有一個*用於兩個 iOS 目標的共享原始碼集*，其中包含的 Kotlin/Native 程式碼仍然可以直接呼叫 iOS 裝置和模擬器通用的任何 API。

![Code shared for iOS targets](iosmain-hierarchy.png){width=300}

現在，您可以透過[階層式專案結構支援](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)來實現這一點，
該支援會根據哪些目標使用它們來推斷和調整每個原始碼集中可用的 API 和語言功能。

對於常見的目標組合，您可以使用目標捷徑建立階層式結構。
例如，使用 `ios()` 捷徑建立兩個 iOS 目標和上面所示的共享原始碼集：

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

對於其他目標組合，請透過 `dependsOn` 關係連接原始碼集來[手動建立階層結構](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#manual-configuration)。

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

由於階層式專案結構，函式庫還可以為目標子集提供通用 API。
了解更多關於[在函式庫中共享程式碼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)的資訊。

### 在階層式結構中利用原生函式庫

您可以在多個原生目標之間共享的原始碼集中使用平台相關函式庫，例如 Foundation、UIKit 和 POSIX。
這可以幫助您共享更多原生程式碼，而不受平台特定依賴項的限制。

無需額外步驟 – 一切都會自動完成。IntelliJ IDEA 將幫助您檢測可以在共享程式碼中使用的通用宣告。

[了解更多關於使用平台相關函式庫的資訊](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。

### 僅指定一次依賴項

從現在起，您應該只在共享原始碼集中指定一次依賴項，而不是在使用它的共享和平台特定原始碼集中指定相同函式庫的不同變體。

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

請勿使用帶有指定平台的後綴的 kotlinx 函式庫工件名稱，例如 `-common`、`-native` 或類似的名稱，
因為它們不再支援。而是使用函式庫基本工件名稱，在上面的範例中是 `kotlinx-coroutines-core`。

但是，此更改目前不影響：
* `stdlib` 函式庫 – 從 Kotlin 1.4.0 開始，[預設添加 `stdlib` 依賴項](#dependency-on-the-standard-library-added-by-default)。
* `kotlin.test` 函式庫 – 您仍然應該使用 `test-common` 和 `test-annotations-common`。這些依賴項將在以後處理。

如果您只需要特定平台的依賴項，您仍然可以使用帶有 `-jvm` 或 `-js` 等後綴的標準和 kotlinx 函式庫的平台特定變體，
例如 `kotlinx-coroutines-core-jvm`。

[了解更多關於配置依賴項的資訊](gradle-configure-project.md#configure-dependencies)。

## Gradle 專案改進

除了特定於 [Kotlin 多平台](#kotlin-multiplatform)、[Kotlin/JVM](#kotlin-jvm)、
[Kotlin/Native](#kotlin-native) 和 [Kotlin/JS](#kotlin-js) 的 Gradle 專案功能和改進之外，
還有一些適用於所有 Kotlin Gradle 專案的更改：

* [標準函式庫的依賴項現在預設添加](#dependency-on-the-standard-library-added-by-default)
* [Kotlin 專案需要最新版本的 Gradle](#minimum-gradle-version-for-kotlin-projects)
* [改進了 IDE 中對 Kotlin Gradle DSL 的支援](#improved-gradle-kts-support-in-the-ide)

### 標準函式庫的依賴項現在預設添加

您不再需要在任何 Kotlin Gradle 專案（包括多平台專案）中宣告對 `stdlib` 函式庫的依賴項。
該依賴項是預設添加的。

自動添加的標準函式庫將與 Kotlin Gradle 外掛程式的版本相同，因為它們具有相同的版本控制。

對於平台特定的原始碼集，使用函式庫的相應平台特定變體，而通用標準函式庫則添加到其餘部分。
Kotlin Gradle 外掛程式將根據您的 Gradle 建置腳本的 `kotlinOptions.jvmTarget` [編譯器選項](gradle-compiler-options.md)選擇適當的 JVM 標準函式庫。

[了解如何更改預設行為](gradle-configure-project.md#dependency-on-the-standard-library)。

### Kotlin 專案的最低 Gradle 版本

為了在您的 Kotlin 專案中享受新功能，請將 Gradle 更新到[最新版本](https://gradle.org/releases/)。
多平台專案需要 Gradle 6.0 或更高版本，而其他 Kotlin 專案適用於 Gradle 5.4 或更高版本。

### 改進了 IDE 中對 *.gradle.kts 的支援

在 1.4.0 中，我們繼續改進 IDE 對 Gradle Kotlin DSL 腳本 (`*.gradle.kts` 檔案) 的支援。以下是新版本帶來的功能：

- _顯式載入腳本配置_ 以提高效能。以前，您對建置腳本所做的更改會自動在後台載入。
為了提高效能，我們在 1.4.0 中禁用了建置腳本配置的自動載入。現在，IDE 僅在您顯式應用更改時才載入它們。

  在 Gradle 6.0 之前的版本中，您需要透過點擊編輯器中的 **Load Configuration** 來手動載入腳本配置。

  ![*.gradle.kts – Load Configuration](gradle-kts-load-config.png)

  在 Gradle 6.0 及更高版本中，您可以透過點擊 **Load Gradle Changes** 或重新匯入 Gradle 專案來顯式應用更改。

  我們在 IntelliJ IDEA 2020.1 中為 Gradle 6.0 及更高版本添加了另一個動作 – **Load Script Configurations**，
  它載入腳本配置的更改，而無需更新整個專案。這比重新匯入整個專案花費的時間少得多。

  ![*.gradle.kts – Load Script Changes and Load Gradle Changes](gradle-kts.png)

  對於新建立的腳本或首次使用新的 Kotlin 外掛程式開啟專案時，您也應該**Load Script Configurations**。

  使用 Gradle 6.0 及更高版本，您現在可以一次載入所有腳本，而不是以前的單獨載入實作。
  由於每個請求都需要執行 Gradle 配置階段，這對於大型 Gradle 專案來說可能資源密集。

  目前，此類載入僅限於 `build.gradle.kts` 和 `settings.gradle.kts` 檔案 (請投票支持相關[問題](https://github.com/gradle/gradle/issues/12640))。
  要啟用 `init.gradle.kts` 或已應用[腳本外掛程式](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins)的亮點顯示，
  請使用舊機制 – 將它們添加到獨立腳本中。這些腳本的配置將在您需要時單獨載入。
  您還可以為此類腳本啟用自動重新載入。

  ![*.gradle.kts – Add to standalone scripts](gradle-kts-standalone.png)

- _更好的錯誤報告_。以前，您只能在單獨的日誌檔案中查看 Gradle Daemon 的錯誤。現在，
Gradle Daemon 直接返回有關錯誤的所有資訊，並將其顯示在 Build 工具視窗中。這為您節省了時間和精力。

## 標準函式庫

以下是 Kotlin 1.4.0 中標準函式庫最顯著的變更列表：

- [通用例外處理 API](#common-exception-processing-api)
- [陣列與集合的新函式](#new-functions-for-arrays-and-collections)
- [字串操作函式](#functions-for-string-manipulations)
- [位元操作](#bit-operations)
- [委託屬性改進](#delegated-properties-improvements)
- [從 KType 轉換為 Java Type](#converting-from-ktype-to-java-type)
- [Kotlin 反射的 Proguard 配置](#proguard-configurations-for-kotlin-reflection)
- [改進現有 API](#improving-the-existing-api)
- [stdlib 工件的 module-info 描述符](#module-info-descriptors-for-stdlib-artifacts)
- [棄用](#deprecations)
- [棄用實驗性協程的排除](#exclusion-of-the-deprecated-experimental-coroutines)

### 通用例外處理 API

以下 API 元素已移至通用函式庫：

* `Throwable.stackTraceToString()` 擴展函式，它返回此 throwable 及其
堆疊追蹤的詳細描述，以及 `Throwable.printStackTrace()`，它將此描述列印到標準錯誤輸出。
* `Throwable.addSuppressed()` 函式，它讓您指定為了傳遞例外而被抑制的例外，
以及 `Throwable.suppressedExceptions` 屬性，它返回所有被抑制例外的列表。
* `@Throws` 註解，它列出當函式編譯為平台方法時（在 JVM 或原生平台上）將被檢查的例外型別。

### 陣列與集合的新函式

#### 集合

在 1.4.0 中，標準函式庫包含許多用於處理**集合**的有用函式：

* `setOfNotNull()`，它從提供的引數中建立一個由所有非 null 項目組成的集合。

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* 序列的 `shuffled()`。

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

* `onEach()` 和 `flatMap()` 的 `*Indexed()` 對應函式。
它們應用於集合元素的運算具有元素索引作為參數。

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

* `randomOrNull()`、`reduceOrNull()` 和 `reduceIndexedOrNull()` 的 `*OrNull()` 對應函式。
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

* `runningFold()`、其同義詞 `scan()` 和 `runningReduce()` 依序對集合元素應用給定操作，
類似於 `fold()` 和 `reduce()`；不同之處在於這些新函式返回中間結果的完整序列。

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

* `sumOf()` 接受一個選擇器函式並返回其在集合所有元素上的值總和。
`sumOf()` 可以產生 `Int`、`Long`、`Double`、`UInt` 和 `ULong` 型別的總和。在 JVM 上，`BigInteger` 和 `BigDecimal` 也可用。

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

* `min()` 和 `max()` 函式已重新命名為 `minOrNull()` 和 `maxOrNull()` 以符合 Kotlin 集合 API 中使用的命名約定。
函式名稱中的 `*OrNull` 後綴表示如果接收器集合為空，它將返回 `null`。這也適用於 `minBy()`、`maxBy()`、`minWith()`、`maxWith()` – 在 1.4 中，它們有 `*OrNull()` 同義詞。
* 新的 `minOf()` 和 `maxOf()` 擴展函式返回給定選擇器函式在集合項目上的最小值和最大值。

    ```kotlin
    data class OrderItem(val name: String, val price = 10.0, count: Int)
    
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

    還有 `minOfWith()` 和 `maxOfWith()`，它們接受 `Comparator` 作為引數，以及所有四個函式的 `*OrNull()` 版本，
它們在空集合上返回 `null`。

* `flatMap` 和 `flatMapTo` 的新重載允許您使用返回型別不匹配接收器型別的轉換，即：
    * `Iterable`、`Array` 和 `Map` 上的 `Sequence` 轉換
    * `Sequence` 上的 `Iterable` 轉換

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

* `removeFirst()` 和 `removeLast()` 是用於從可變列表中刪除元素的捷徑，以及這些函式的 `*orNull()` 對應函式。

#### 陣列

為了在使用不同容器型別時提供一致的體驗，我們還為**陣列**添加了新函式：

* `shuffle()` 將陣列元素按隨機順序排列。
* `onEach()` 對每個陣列元素執行給定動作並返回陣列本身。
* `associateWith()` 和 `associateWithTo()` 以陣列元素作為鍵來建構映射。
* `reverse()` 用於陣列子範圍，反轉子範圍中元素的順序。
* `sortDescending()` 用於陣列子範圍，按降序對子範圍中的元素進行排序。
* `sort()` 和 `sortWith()` 用於陣列子範圍現在在通用函式庫中可用。

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

此外，還有用於 `CharArray`/`ByteArray` 和 `String` 之間轉換的新函式：
* `ByteArray.decodeToString()` 和 `String.encodeToByteArray()`
* `CharArray.concatToString()` 和 `String.toCharArray()`

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

我們還添加了 `ArrayDeque` 類別 – 一種雙端佇列的實作。
雙端佇列允許您在佇列的開頭或結尾以攤銷常數時間添加或刪除元素。
當您需要在程式碼中使用佇列或堆疊時，您可以預設使用雙端佇列。

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

`ArrayDeque` 實作在底層使用可調整大小的陣列：它將內容儲存在循環緩衝區（一個 `Array`）中，
並且僅在陣列滿時才調整其大小。

### 字串操作函式

1.4.0 中的標準函式庫包含多項字串操作 API 的改進：

* `StringBuilder` 具有有用的新擴展函式：`set()`、`setRange()`、`deleteAt()`、`deleteRange()`、`appendRange()`
等等。

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

* `StringBuilder` 的一些現有函式在通用函式庫中可用。其中包括 `append()`、`insert()`、
`substring()`、`setLength()` 等。
* 新函式 `Appendable.appendLine()` 和 `StringBuilder.appendLine()` 已添加到通用函式庫。
它們取代了這些類別的僅限 JVM 的 `appendln()` 函式。

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

新的位元操作函式：
* `countOneBits()`
* `countLeadingZeroBits()`
* `countTrailingZeroBits()`
* `takeHighestOneBit()`
* `takeLowestOneBit()`
* `rotateLeft()` 和 `rotateRight()` (實驗性)

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

### 委託屬性改進

在 1.4.0 中，我們新增了功能以改善您在 Kotlin 中使用委託屬性的體驗：
- 現在屬性可以委託給另一個屬性。
- 新介面 `PropertyDelegateProvider` 有助於在單一宣告中建立委託提供者。
- `ReadWriteProperty` 現在擴展 `ReadOnlyProperty`，因此您可以同時將它們用於唯讀屬性。

除了新的 API 之外，我們還進行了一些優化，以減少產生的位元組碼大小。這些優化在
[這篇部落格文章](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties)中有所描述。

[了解更多關於委託屬性的資訊](delegated-properties.md)。

### 從 KType 轉換為 Java Type

stdlib 中的新擴展屬性 `KType.javaType` (目前為實驗性) 可幫助您從 Kotlin 型別中獲取 `java.lang.reflect.Type`
而無需使用整個 `kotlin-reflect` 依賴項。

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

### Kotlin 反射的 Proguard 配置

從 1.4.0 開始，我們已將 Kotlin 反射的 Proguard/R8 配置嵌入到 `kotlin-reflect.jar` 中。
有了這個，大多數使用 R8 或 Proguard 的 Android 專案應該都能與 kotlin-reflect 配合使用，
而無需任何額外配置。您不再需要複製貼上 kotlin-reflect 內部函式的 Proguard 規則。
但請注意，您仍然需要明確列出所有您將要反射的 API。

### 改進現有 API

* 幾個函式現在可在 null 接收器上工作，例如：
    * 字串上的 `toBoolean()`
    * 陣列上的 `contentEquals()`、`contentHashcode()`、`contentToString()`

* `Double` 和 `Float` 中的 `NaN`、`NEGATIVE_INFINITY` 和 `POSITIVE_INFINITY` 現在定義為 `const`，因此您可以將它們用作註解引數。

* `Double` 和 `Float` 中的新常數 `SIZE_BITS` 和 `SIZE_BYTES` 包含用於
以二進位形式表示型別實例的位元數和位元組數。

* `maxOf()` 和 `minOf()` 頂層函式可以接受可變數量的引數 (`vararg`)。

### stdlib 工件的 module-info 描述符

Kotlin 1.4.0 將 `module-info.java` 模組資訊新增到預設標準函式庫工件中。這使您可以將它們與
[jlink 工具](https://docs.oracle.com/en/java/javase/11/tools/jlink.html)一起使用，
該工具生成僅包含您的應用程式所需的平台模組的自訂 Java 執行時映像。
您已經可以使用 jlink 與 Kotlin 標準函式庫工件，但您必須使用單獨的工件來執行此操作 –
帶有「modular」分類器的那些 – 整個設定並不簡單。
在 Android 中，請確保您使用 Android Gradle 外掛程式版本 3.2 或更高版本，它可以正確處理帶有 module-info 的 jar 檔案。

### 棄用

#### Double 和 Float 的 toShort() 和 toByte()

我們已棄用 `Double` 和 `Float` 上的 `toShort()` 和 `toByte()` 函式，
因為它們可能由於值範圍窄和變數大小較小而導致意外結果。

要將浮點數轉換為 `Byte` 或 `Short`，請使用兩步轉換：首先，將它們轉換為 `Int`，然後
再次轉換為目標型別。

#### 浮點數陣列上的 contains()、indexOf() 和 lastIndexOf()

我們已棄用 `FloatArray` 和 `DoubleArray` 的 `contains()`、`indexOf()` 和 `lastIndexOf()` 擴展函式，
因為它們使用 [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 標準相等性，
這在某些邊角情況下與全序相等性相矛盾。有關詳細資訊，請參閱[此問題](https://youtrack.jetbrains.com/issue/KT-28753)。

#### min() 和 max() 集合函式

我們已棄用 `min()` 和 `max()` 集合函式，轉而使用 `minOrNull()` 和 `maxOrNull()`，
它們更恰當地反映了它們的行為 – 在空集合上返回 `null`。
有關詳細資訊，請參閱[此問題](https://youtrack.jetbrains.com/issue/KT-38854)。

### 棄用實驗性協程的排除

`kotlin.coroutines.experimental` API 在 1.3.0 中已棄用，取而代之的是 kotlin.coroutines。
在 1.4.0 中，我們正在完成 `kotlin.coroutines.experimental` 的棄用週期，將其從標準函式庫中移除。
對於仍在 JVM 上使用它的用戶，我們提供了相容性工件 `kotlin-coroutines-experimental-compat.jar`，
其中包含所有實驗性協程 API。我們已將其發布到 Maven，並將其與標準函式庫一起包含在 Kotlin 發行版中。

## 穩定 JSON 序列化

隨著 Kotlin 1.4.0 的發布，我們推出了 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的第一個穩定版本 -
1.0.0-RC。現在我們很高興地宣告 `kotlinx-serialization-core` (以前稱為 `kotlinx-serialization-runtime`) 中的 JSON 序列化 API
穩定。其他序列化格式的函式庫仍處於實驗性階段，以及核心函式庫的一些高級部分。

我們對 JSON 序列化 API 進行了重大改進，使其更加一致且易於使用。從現在開始，
我們將繼續以向後相容的方式開發 JSON 序列化 API。
但是，如果您曾使用過以前的版本，在遷移到 1.0.0-RC 時，您將需要重寫部分程式碼。
為了幫助您完成此任務，我們還提供了 **[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)** –
這是 `kotlinx.serialization` 的完整文件集。它將引導您完成使用最重要的功能的過程，
並可以幫助您解決可能遇到的任何問題。

>**注意**：`kotlinx-serialization` 1.0.0-RC 僅適用於 Kotlin 編譯器 1.4。
>較早的編譯器版本不相容。
>
{style="note"}

## 腳本與 REPL

在 1.4.0 中，Kotlin 中的腳本處理受益於多項功能和效能改進以及其他更新。
以下是一些關鍵變更：

- [新的依賴項解析 API](#new-dependencies-resolution-api)
- [新的 REPL API](#new-repl-api)
- [編譯腳本快取](#compiled-scripts-cache)
- [工件重新命名](#artifacts-renaming)

為了幫助您更熟悉 Kotlin 中的腳本編寫，我們準備了一個[範例專案](https://github.com/Kotlin/kotlin-script-examples)。
它包含標準腳本 (`*.main.kts`) 的範例以及 Kotlin Scripting API 和自定義腳本定義的使用範例。
請試用並使用我們的[問題追蹤器](https://youtrack.jetbrains.com/issues/KT)分享您的回饋。

### 新的依賴項解析 API

在 1.4.0 中，我們引入了一個新的 API 用於解析外部依賴項 (例如 Maven 工件)，並提供了其實現。
此 API 在新工件 `kotlin-scripting-dependencies` 和 `kotlin-scripting-dependencies-maven` 中發布。
`kotlin-script-util` 函式庫中先前的依賴項解析功能現在已棄用。

### 新的 REPL API

新的實驗性 REPL API 現在是 Kotlin Scripting API 的一部分。在已發布的工件中也有其多種實作，
其中一些具有進階功能，例如程式碼補全。我們在 [Kotlin Jupyter kernel](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/)
中使用此 API，現在您可以在自己的自定義 shell 和 REPL 中試用它。

### 編譯腳本快取

Kotlin Scripting API 現在提供了實作編譯腳本快取的能力，顯著加速了未更改腳本的後續執行。
我們預設的進階腳本實作 `kotlin-main-kts` 已經有自己的快取。

### 工件重新命名

為了避免工件名稱混淆，我們已將 `kotlin-scripting-jsr223-embeddable` 和 `kotlin-scripting-jvm-host-embeddable`
重新命名為 `kotlin-scripting-jsr223` 和 `kotlin-scripting-jvm-host`。這些工件依賴於 `kotlin-compiler-embeddable`
工件，該工件遮蔽了捆綁的第三方函式庫以避免使用衝突。透過此重新命名，我們將 `kotlin-compiler-embeddable`
(通常更安全) 的使用設為腳本工件的預設值。
如果由於某些原因您需要依賴未遮蔽的 `kotlin-compiler` 的工件，請使用帶有 `-unshaded` 後綴的工件版本，
例如 `kotlin-scripting-jsr223-unshaded`。請注意，此重新命名僅影響預期直接使用的腳本工件；
其他工件的名稱保持不變。

## 遷移到 Kotlin 1.4.0

Kotlin 外掛程式的遷移工具可幫助您將專案從早期版本的 Kotlin 遷移到 1.4.0。

只需將 Kotlin 版本更改為 `1.4.0` 並重新匯入您的 Gradle 或 Maven 專案。IDE 將隨後詢問您有關遷移的事宜。

如果您同意，它將運行遷移程式碼檢查，檢查您的程式碼並建議任何在 1.4.0 中無法運作或不建議使用的修正。

![Run migration](run-migration-wn.png){width=300}

程式碼檢查具有不同的[嚴重性等級](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html)，
以幫助您決定接受哪些建議以及忽略哪些建議。

![Migration inspections](migration-inspection-wn.png)

Kotlin 1.4.0 是一個[功能發布版本](kotlin-evolution-principles.md#language-and-tooling-releases)，
因此可能會帶來語言上的不相容變更。在 **[Kotlin 1.4 相容性指南](compatibility-guide-14.md)** 中可以找到此類變更的詳細列表。