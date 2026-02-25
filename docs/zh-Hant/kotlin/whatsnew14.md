[//]: # (title: Kotlin 1.4.0 的新功能)

<web-summary>閱讀 Kotlin 1.4.0 版本說明，涵蓋新語言特性、Kotlin 多平台的更新、JVM、Native、JS，以及 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發布日期：2020 年 8 月 17 日](releases.md#release-history)_

在 Kotlin 1.4.0 中，我們對所有組件進行了大量改進，[專注於品質與效能](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)。
以下您將找到 Kotlin 1.4.0 中最重要的變更清單。

> 有關 Kotlin 發布週期的資訊，請參閱 [Kotlin 發布流程](releases.md)。
>
{style="tip"}

## 語言特性與改進

Kotlin 1.4.0 帶來了多種不同的語言特性與改進。其中包括：

* [Kotlin 介面的 SAM 轉換](#sam-conversions-for-kotlin-interfaces)
* [為程式庫作者提供的顯式 API 模式](#explicit-api-mode-for-library-authors)
* [混合使用命名引數與位置引數](#mixing-named-and-positional-arguments)
* [尾隨逗號](#trailing-comma)
* [可呼叫參照的改進](#callable-reference-improvements)
* [在迴圈中的 when 內使用 break 與 continue](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin 介面的 SAM 轉換

在 Kotlin 1.4.0 之前，您只能在 [從 Kotlin 處理 Java 方法與 Java 介面時](java-interop.md#sam-conversions) 應用 SAM (Single Abstract Method) 轉換。從現在起，您也可以對 Kotlin 介面使用 SAM 轉換。
為此，請使用 `fun` 修飾詞將 Kotlin 介面明確標記為功能性介面。

如果您在預期使用僅包含單個抽象方法的介面作為參數時傳遞 Lambda 作為引數，則會套用 SAM 轉換。在這種情況下，編譯器會自動將 Lambda 轉換為實作該抽象成員函式的類別執行個體。

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

[進一步了解 Kotlin 功能性介面與 SAM 轉換](fun-interfaces.md)。

### 為程式庫作者提供的顯式 API 模式

Kotlin 編譯器為程式庫作者提供了「顯式 API 模式」。在這種模式下，編譯器會執行額外的檢查，有助於使程式庫的 API 更加清晰且一致。它對暴露於程式庫公共 API 的宣告增加了以下要求：

* 如果預設可見性會將宣告暴露於公共 API，則必須提供可見性修飾詞。這有助於確保不會無意中將宣告暴露於公共 API。
* 暴露於公共 API 的屬性與函式必須有顯式類型規格。這保證了 API 使用者知曉他們所使用的 API 成員類型。

根據您的配置，這些顯式 API 可能會產生錯誤（*strict* 模式）或警告（*warning* 模式）。
為了可讀性與常識，某些類型的宣告被排除在這些檢查之外：

* 主建構函式
* 資料類別的屬性
* 屬性的 getter 與 setter
* `override` 方法

顯式 API 模式僅分析模組的正式環境原始碼。

若要以顯式 API 模式編譯您的模組，請在您的 Gradle 建置指令碼中加入以下內容：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {    
    // 用於 strict 模式
    explicitApi() 
    // 或
    explicitApi = ExplicitApiMode.Strict
    
    // 用於 warning 模式
    explicitApiWarning()
    // 或
    explicitApi = ExplicitApiMode.Warning
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {    
    // 用於 strict 模式
    explicitApi() 
    // 或
    explicitApi = 'strict'
    
    // 用於 warning 模式
    explicitApiWarning()
    // 或
    explicitApi = 'warning'
}
```

</tab>
</tabs>

使用命令列編譯器時，透過加入 `-Xexplicit-api` 編譯器選項並設定值為 `strict` 或 `warning` 來切換至顯式 API 模式。

```bash
-Xexplicit-api={strict|warning}
```

[在 KEEP 中查找有關顯式 API 模式的更多詳細資訊](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md)。

### 混合使用命名引數與位置引數

在 Kotlin 1.3 中，當您使用 [命名引數](functions.md#named-arguments) 呼叫函式時，您必須將所有不含名稱的引數（位置引數）放在第一個命名引數之前。例如，您可以呼叫 `f(1, y = 2)`，但不能呼叫 `f(x = 1, 2)`。

當所有引數都在正確的位置，但您只想為中間的一個引數指定名稱時，這真的很煩人。這對於明確標註布林值或 `null` 值屬於哪個屬性特別有幫助。

在 Kotlin 1.4 中，不再有此限制——您現在可以在一組位置引數中間指定引數名稱。此外，您可以隨意混合位置引數與命名引數，只要它們保持在正確的順序即可。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

// 在中間使用命名引數的函式呼叫
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 尾隨逗號

從 Kotlin 1.4 開始，您現在可以在列舉（如引數與參數列表）、`when` 項目以及解構宣告的組件中加入尾隨逗號。
有了尾隨逗號，您可以在不增加或移除逗號的情況下增加新項目並更改其順序。

如果您對參數或值使用多行語法，這特別有幫助。加入尾隨逗號後，您就可以輕鬆交換包含參數或值的行。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', // 尾隨逗號
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", // 尾隨逗號
)
```

### 可呼叫參照的改進

Kotlin 1.4 支援更多使用可呼叫參照的情況：

* 參照包含具有預設值參數的函式
* 在回傳 `Unit` 的函式中使用函式參照
* 根據函式中的引數數量進行適配的參照
* 可呼叫參照上的 suspend 轉換

#### 參照包含具有預設值參數的函式

現在您可以對包含具有預設值參數的函式使用可呼叫參照。如果對函式 `foo` 的可呼叫參照不帶引數，則使用預設值 `0`。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

以前，您必須為 `apply` 或 `foo` 函式編寫額外的多載。

```kotlin
// 某些新的多載
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### 在回傳 Unit 的函式中使用函式參照

在 Kotlin 1.4 中，您可以在回傳 `Unit` 的函式中使用回傳任何型別之函式的可呼叫參照。
在 Kotlin 1.4 之前，在這種情況下您只能使用 Lambda 引數。現在您既可以使用 Lambda 引數，也可以使用可呼叫參照。

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // 這是 1.4 之前唯一的做法
    foo(::returnsInt) // 從 1.4 開始，這也行得通
}
```

#### 根據函式中的引數數量進行適配的參照

現在您可以在傳遞可變數量參數 (`vararg`) 時適配函式的可呼叫參照。
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

#### 可呼叫參照上的 suspend 轉換

除了 Lambda 上的 suspend 轉換外，Kotlin 從 1.4.0 版本開始也支援可呼叫參照上的 suspend 轉換。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // 1.4 之前 OK
    takeSuspend(::call) // 在 Kotlin 1.4 中，這也行得通
}
```

### 在迴圈中的 when 內使用 break 與 continue

在 Kotlin 1.3 中，您不能在包含於迴圈中的 `when` 表達式內使用不帶限定符的 `break` 與 `continue`。原因是這些關鍵字被保留用於 `when` 表達式中可能的 [fall-through 行為](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)。

這就是為什麼如果您想在迴圈中的 `when` 表達式內使用 `break` 與 `continue`，您必須對其進行 [標記](returns.md#break-and-continue-labels)，這變得相當繁瑣。

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

在 Kotlin 1.4 中，您可以在包含於迴圈中的 `when` 表達式內使用不帶標記的 `break` 與 `continue`。它們的行為與預期一致，即終止最接近的外層迴圈或進入其下一步骤。

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

`when` 內部的 fall-through 行為仍有待進一步設計。

## IDE 中的新工具

藉助 Kotlin 1.4，您可以使用 IntelliJ IDEA 中的新工具來簡化 Kotlin 開發：

* [全新的靈活專案精靈](#new-flexible-project-wizard)
* [協同程式偵錯工具](#coroutine-debugger)

### 全新的靈活專案精靈

透過靈活的新 Kotlin 專案精靈，您可以輕鬆建立與配置不同類型的 Kotlin 專案，包括多平台專案，這些專案在沒有 UI 的情況下可能難以配置。

![Kotlin 專案精靈 – 多平台專案](multiplatform-project-1-wn.png)

新的 Kotlin 專案精靈既簡單又靈活：

1. *選擇專案樣板*，取決於您要做什麼。未來將加入更多樣板。
2. *選擇建置系統* – Gradle（Kotlin 或 Groovy DSL）、Maven 或 IntelliJ IDEA。
    Kotlin 專案精靈將僅顯示所選專案樣板支援的建置系統。
3. 直接在主畫面上 *預覽專案結構*。

然後您可以完成專案建立，或者（可選）在下一個畫面上 *配置專案*：

4. *加入/移除* 此專案樣板支援的模組與目標。
5. *配置模組與目標設定*，例如目標 JVM 版本、目標樣板與測試架構。

![Kotlin 專案精靈 - 配置目標](multiplatform-project-2-wn.png)

未來，我們將透過加入更多配置選項與樣板，使 Kotlin 專案精靈變得更加靈活。

您可以透過學習這些教學來嘗試新的 Kotlin 專案精靈：

* [建立基於 Kotlin/JVM 的主控台應用程式](jvm-get-started.md)
* [為 React 建立 Kotlin/JS 應用程式](js-react.md)
* [建立 Kotlin/Native 應用程式](native-get-started.md)

### 協同程式偵錯工具

許多人已經使用 [協同程式](coroutines-guide.md) 進行非同步程式設計。
但在進行偵錯時，在 Kotlin 1.4 之前處理協同程式可能非常痛苦。由於協同程式會在執行緒之間跳轉，因此很難理解特定協同程式正在做什麼並檢查其上下文。在某些情況下，單步執行越過中斷點根本不起作用。因此，您不得不依賴日誌紀錄或心力來偵錯使用協同程式的程式碼。

在 Kotlin 1.4 中，使用 Kotlin 外掛程式提供的新功能，偵錯協同程式現在變得更加方便。

> 偵錯功能適用於 1.3.8 或更高版本的 `kotlinx-coroutines-core`。
>
{style="note"}

**偵錯工具視窗** 現在包含一個新的 **Coroutines** 標籤。在此標籤中，您可以找到有關目前正在執行與已掛起的協同程式資訊。協同程式按其執行的調度器進行分組。

![偵錯協同程式](coroutine-debugger-wn.png)

現在您可以：
* 輕鬆檢查每個協同程式的狀態。
* 查看執行中與掛起協同程式的區域變數與擷取變數的值。
* 查看完整的協同程式建立堆疊，以及協同程式內部的呼叫堆疊。該堆疊包含所有帶有變數值的框架，甚至是那些在標準偵錯期間會遺失的框架。

如果您需要包含每個協同程式狀態及其堆疊的完整報告，請在 **Coroutines** 標籤內按右鍵，然後點擊 **Get Coroutines Dump**。目前，協同程式傾印相當簡單，但我們打算在未來的 Kotlin 版本中使其更具可讀性且更有幫助。

![協同程式傾印](coroutines-dump-wn.png)

在 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/) 與 [IntelliJ IDEA 文件](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html) 中了解有關偵錯協同程式的更多資訊。

## 新編譯器

新的 Kotlin 編譯器將會非常快速；它將統一所有支援的平台並為編譯器擴充功能提供 API。這是一個長期專案，我們在 Kotlin 1.4.0 中已經完成了幾個步驟：

* 預設啟用 [新的、更強大的型別推論演算法](#new-more-powerful-type-inference-algorithm)。
* [新的 JVM 與 JS IR 後端](#unified-backends-and-extensibility)。一旦我們使其穩定，它們將成為預設。

### 新的更強大的型別推論演算法

Kotlin 1.4 使用了新的、更強大的型別推論演算法。這個新演算法在 Kotlin 1.3 中已經可以透過指定編譯器選項進行嘗試，現在它已被預設使用。您可以在 [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20) 中找到新演算法中修復的問題完整清單。以下是一些最顯著的改進：

* [更多自動推論型別的情況](#more-cases-where-type-is-inferred-automatically)
* [Lambda 最後一個表達式的智慧轉型](#smart-casts-for-a-lambda-s-last-expression)
* [可呼叫參照的智慧轉型](#smart-casts-for-callable-references)
* [委派屬性的更好推論](#better-inference-for-delegated-properties)
* [具有不同引數之 Java 介面的 SAM 轉換](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Kotlin 中的 Java SAM 介面](#java-sam-interfaces-in-kotlin)

#### 更多自動推論型別的情況

新的推論演算法可以為許多舊演算法要求您顯式指定的情況推論型別。
例如，在以下範例中，Lambda 參數 `it` 的型別被正確推論為 `String?`：

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

在 Kotlin 1.3 中，您需要引入顯式的 Lambda 參數或將 `to` 替換為具有顯式泛型引數的 `Pair` 建構函式才能使其運作。

#### Lambda 最後一個表達式的智慧轉型

在 Kotlin 1.3 中，除非您指定預期型別，否則 Lambda 內部的最後一個表達式不會被智慧轉型。因此，在以下範例中，Kotlin 1.3 將 `result` 變數的型別推論為 `String?`：

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // Kotlin 編譯器知道此處 str 不為 null
}
// 'result' 的型別在 Kotlin 1.3 中為 String?，在 Kotlin 1.4 中為 String
```

在 Kotlin 1.4 中，歸功於新的推論演算法，Lambda 內部的最後一個表達式會獲得智慧轉型，並且這個新的、更精確的型別被用於推論結果 Lambda 型別。因此，`result` 變數的型別變為 `String`。

在 Kotlin 1.3 中，您通常需要加入顯式轉型（使用 `!!` 或像 `as String` 這樣的型別轉型）才能使此類情況運作，現在這些轉型已變得不再必要。

#### 可呼叫參照的智慧轉型

在 Kotlin 1.3 中，您無法存取智慧轉型型別的成員參照。現在在 Kotlin 1.4 中您可以：

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

在 animal 變數被智慧轉型為特定型別 `Cat` 與 `Dog` 後，您可以使用不同的成員參照 `animal::meow` 與 `animal::woof`。經過型別檢查後，您可以存取對應於子型別的成員參照。

#### 委派屬性的更好推論

在分析 `by` 關鍵字之後的委派表達式時，以往不會考慮委派屬性的型別。例如，以下程式碼以前無法編譯，但現在編譯器可以正確推論 `old` 與 `new` 參數的型別為 `String?`：

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

#### 具有不同引數之 Java 介面的 SAM 轉換

Kotlin 從一開始就支援 Java 介面的 SAM 轉換，但有一種情況不受支援，這在處理現有的 Java 程式庫時有時很煩人。如果您呼叫一個接受兩個 SAM 介面作為參數的 Java 方法，則兩個引數都必須是 Lambda 或一般物件。您不能將一個引數作為 Lambda 傳遞，另一個作為物件傳遞。

新演算法修復了此問題，您可以在任何情況下傳遞 Lambda 而不是 SAM 介面，這正是您自然期望的運作方式。

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // 在 Kotlin 1.4 中可行
}
```

#### Kotlin 中的 Java SAM 介面

在 Kotlin 1.4 中，您可以在 Kotlin 中使用 Java SAM 介面並對其應用 SAM 轉換。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

在 Kotlin 1.3 中，您必須在 Java 程式碼中宣告上述函式 `foo` 才能執行 SAM 轉換。

### 統一的後端與擴充性

在 Kotlin 中，我們有三個產生可執行檔的後端：Kotlin/JVM、Kotlin/JS 與 Kotlin/Native。Kotlin/JVM 與 Kotlin/JS 由於是彼此獨立開發的，因此共用的程式碼不多。Kotlin/Native 是基於圍繞 Kotlin 程式碼中間表示 (IR) 建構的新基礎結構。

我們現在正將 Kotlin/JVM 與 Kotlin/JS 遷移到相同的 IR。因此，所有三個後端都共用許多邏輯並擁有統一的管線。這使我們能夠為所有平台僅實作一次大多數特性、最佳化與錯誤修復。兩個新的基於 IR 的後端目前都處於 [Alpha](components-stability.md) 階段。

通用的後端基礎結構也為多平台編譯器擴充功能打開了大門。您將能夠插入管線並加入自訂處理與轉換，這些將自動適用於所有平台。

我們鼓勵您使用我們目前處於 Alpha 階段的新 [JVM IR](#new-jvm-ir-backend) 與 [JS IR](#new-js-ir-backend) 後端，並與我們分享您的回饋。

## Kotlin/JVM

Kotlin 1.4.0 包含許多 JVM 特定的改進，例如：
 
* [新的 JVM IR 後端](#new-jvm-ir-backend)
* [用於在介面中產生預設方法的新模式](#new-modes-for-generating-default-methods)
* [用於 null 檢查的統一例外型別](#unified-exception-type-for-null-checks)
* [JVM 位元組碼中的型別註解](#type-annotations-in-the-jvm-bytecode)

### 新的 JVM IR 後端

與 Kotlin/JS 一起，我們正將 Kotlin/JVM 遷移到 [統一的 IR 後端](#unified-backends-and-extensibility)，這使我們能夠為所有平台實作一次大多數特性與錯誤修復。您也將能夠透過建立適用於所有平台的多平台擴充功能從中受益。

Kotlin 1.4.0 尚未為此類擴充功能提供公共 API，但我們正在與合作夥伴密切合作，包括 [Jetpack Compose](https://developer.android.com/jetpack/compose)，他們已經在使用我們的新後端建立其編譯器外掛程式。

我們鼓勵您嘗試目前處於 Alpha 階段的新 Kotlin/JVM 後端，並向我們的 [問題追蹤器](https://youtrack.jetbrains.com/issues/KT) 提交任何問題與功能請求。這將有助於我們統一編譯器管線，並將 Jetpack Compose 等編譯器擴充功能更快地帶給 Kotlin 社群。

若要啟用新的 JVM IR 後端，請在您的 Gradle 建置指令碼中指定一個額外的編譯器選項：

```kotlin
kotlinOptions.useIR = true
```

> 如果您 [啟用 Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en)，您將自動加入新 JVM 後端，而無需在 `kotlinOptions` 中指定編譯器選項。
>
{style="note"}

使用命令列編譯器時，加入編譯器選項 `-Xuse-ir`。

> 您只能在使用新 JVM IR 後端編譯的程式碼（如果您啟用了新後端）時使用它。否則會發生錯誤。考慮到這一點，我們不建議程式庫作者在正式環境中切換到新後端。
>
{style="note"}

### 用於產生預設方法的新模式

將 Kotlin 程式碼編譯為 JVM 1.8 及以上版本時，您可以將 Kotlin 介面的非抽象方法編譯為 Java 的 `default` 方法。為此，曾有一種機制包含用於標記此類方法的 `@JvmDefault` 註解，以及啟用處理此註解的 `-Xjvm-default` 編譯器選項。

在 1.4.0 中，我們加入了一種用於產生預設方法的新模式：`-Xjvm-default=all` 將 Kotlin 介面的 *所有* 非抽象方法編譯為 `default` Java 方法。為了與使用未編譯為 `default` 的介面程式碼保持相容，我們還加入了 `all-compatibility` 模式。

有關 Java 互通性中預設方法的更多資訊，請參閱 [互通性文件](java-to-kotlin-interop.md#default-methods-in-interfaces) 與 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 用於 null 檢查的統一例外型別

從 Kotlin 1.4.0 開始，所有執行階段 null 檢查都將拋出 `java.lang.NullPointerException`，而不是 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 與 `TypeCastException`。這適用於：`!!` 運算子、方法前言中的參數 null 檢查、平台型別表達式 null 檢查，以及帶有不可 null 型別的 `as` 運算子。這不適用於 `lateinit` null 檢查與顯式程式庫函式呼叫（如 `checkNotNull` 或 `requireNotNull`）。

此變更增加了 Kotlin 編譯器或各種位元組碼處理工具（例如 Android [R8 最佳化工具](https://developer.android.com/studio/build/shrink-code)）可以執行的潛在 null 檢查最佳化數量。

請注意，從開發人員的角度來看，事情不會改變太多：Kotlin 程式碼將拋出與以前相同錯誤訊息的例外。例外型別雖然改變，但傳遞的資訊保持不變。

### JVM 位元組碼中的型別註解

Kotlin 現在可以在 JVM 位元組碼中產生型別註解（目標版本 1.8+），以便它們在執行階段的 Java 反射中可用。若要在位元組碼中發出型別註解，請遵循以下步驟：

1. 確保您宣告的註解具有適當的註解目標（Java 的 `ElementType.TYPE_USE` 或 Kotlin 的 `AnnotationTarget.TYPE`）與保留策略 (`AnnotationRetention.RUNTIME`)。
2. 將註解類別宣告編譯為 JVM 位元組碼目標版本 1.8+。您可以使用 `-jvm-target=1.8` 編譯器選項指定它。
3. 將使用該註解的程式碼編譯為 JVM 位元組碼目標版本 1.8+ (`-jvm-target=1.8`) 並加入 `-Xemit-jvm-type-annotations` 編譯器選項。

請注意，來自標準程式庫的型別註解目前不會發出到位元組碼中，因為標準程式庫是使用目標版本 1.6 編譯的。

到目前為止，僅支援基本案例：

- 方法參數、方法回傳型別與屬性型別上的型別註解；
- 型別引數的不變投影，例如 `Smth<@Ann Foo>`, `Array<@Ann Foo>`。

在以下範例中，`String` 型別上的 `@Foo` 註解可以發出到位元組碼中，然後被程式庫程式碼使用：

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

`kotlin.js` Gradle 外掛程式帶有調整後的 Gradle DSL，它提供了許多新的配置選項，並且更接近 `kotlin-multiplatform` 外掛程式使用的 DSL。一些最具影響力的變更包括：

- 透過 `binaries.executable()` 顯式切換可執行檔的建立。在此處閱讀有關 [執行 Kotlin/JS 及其環境](js-project-setup.md#execution-environments) 的更多資訊。
- 從 Gradle 配置中透過 `cssSupport` 配置 webpack 的 CSS 與樣式載入器。在此處閱讀有關 [使用 CSS 與樣式載入器](js-project-setup.md#css) 的更多資訊。
- 改進了對 npm 相依性的管理，強制要求版本號或 [semver](https://docs.npmjs.com/about-semantic-versioning) 版本範圍，並支援使用 `devNpm`, `optionalNpm` 與 `peerNpm` 的 *development*, *peer*, 與 *optional* npm 相依性。[在此處閱讀更多關於直接從 Gradle 管理 npm 套件相依性的資訊](js-project-setup.md#npm-dependencies)。
- 加強了與 [Dukat](https://github.com/Kotlin/dukat)（Kotlin 外部宣告產生器）的整合。外部宣告現在可以在建置時產生，也可以透過 Gradle 任務手動產生。

### 新的 JS IR 後端

[Kotlin/JS 的 IR 後端](js-ir-compiler.md) 目前具有 [Alpha](components-stability.md) 穩定性，它提供了一些特定於 Kotlin/JS 目標的新功能，重點在於透過無效程式碼消除縮減產生的程式碼大小，以及改進與 JavaScript 與 TypeScript 的互通性等。

若要啟用 Kotlin/JS IR 後端，請在您的 `gradle.properties` 中設定鍵 `kotlin.js.compiler=ir`，或將 `IR` 編譯器類型傳遞給 Gradle 建置指令碼中的 `js` 函式：

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // 或: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

有關如何配置新後端的更詳細資訊，請查看 [Kotlin/JS IR 編譯器文件](js-ir-compiler.md)。

憑藉新的 [@JsExport](js-to-kotlin-interop.md#jsexport-annotation) 註解以及從 **[Kotlin 程式碼產生 TypeScript 定義](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)** 的能力，Kotlin/JS IR 編譯器後端改進了 JavaScript 與 TypeScript 的互通性。這也使得將 Kotlin/JS 程式碼與現有工具整合、建立 **混合應用程式** 以及在多平台專案中利用程式碼共享功能變得更加容易。

[了解更多有關 Kotlin/JS IR 編譯器後端可用功能的資訊](js-ir-compiler.md)。

## Kotlin/Native

在 1.4.0 中，Kotlin/Native 獲得了大量新功能與改進，包括： 

* [支援 Swift 與 Objective-C 中的掛起函式](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [預設支援 Objective-C 泛型](#objective-c-generics-support-by-default)
* [Objective-C/Swift 互通性中的例外處理](#exception-handling-in-objective-c-swift-interop)
* [預設在 Apple 目標上產生 release .dSYMs](#generate-release-dsyms-on-apple-targets-by-default)
* [效能改進](#performance-improvements)
* [簡化了 CocoaPods 相依性的管理](#simplified-management-of-cocoapods-dependencies)

### 支援 Kotlin 的掛起函式於 Swift 與 Objective-C 中

在 1.4.0 中，我們增加了對 Swift 與 Objective-C 中掛起函式的基本支援。現在，當您將 Kotlin 模組編譯為 Apple 框架時，掛起函式在其中可用作帶有回呼（Swift/Objective-C 術語中的 `completionHandler`）的函式。當您在產生的框架標頭檔中擁有此類函式時，您可以從 Swift 或 Objective-C 程式碼中呼叫它們，甚至覆寫它們。

例如，如果您編寫這個 Kotlin 函式：

```kotlin
suspend fun queryData(id: Int): String = ...
```

...那麼您可以像這樣從 Swift 呼叫它：

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[進一步了解在 Swift 與 Objective-C 中使用掛起函式](native-objc-interop.md)。

### 預設支援 Objective-C 泛型

先前版本的 Kotlin 對 Objective-C 互通性中的泛型提供了實驗性支援。從 1.4.0 開始，Kotlin/Native 預設會從 Kotlin 程式碼產生帶有泛型的 Apple 框架。在某些情況下，這可能會破壞呼叫 Kotlin 框架的現有 Objective-C 或 Swift 程式碼。若要讓框架標頭檔在不使用泛型的情況下編寫，請加入 `-Xno-objc-generics` 編譯器選項。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

請注意，[關於與 Objective-C 互通性的文件](native-objc-interop.md#generics) 中列出的所有細節與限制仍然有效。

### Objective-C/Swift 互通性中的例外處理

在 1.4.0 中，我們略微更改了從 Kotlin 產生的 Swift API，涉及例外的轉換方式。Kotlin 與 Swift 之間的錯誤處理存在根本差異。所有 Kotlin 例外都是非受檢的，而 Swift 只有受檢錯誤。因此，為了讓 Swift 程式碼感知到預期的例外，Kotlin 函式應標記為 `@Throws` 註解，並指定潛在的例外類別清單。

在編譯為 Swift 或 Objective-C 框架時，具有或繼承了 `@Throws` 註解的函式在 Objective-C 中表示為產生 `NSError*` 的方法，在 Swift 中表示為 `throws` 方法。

以前，除了 `RuntimeException` 與 `Error` 之外的任何例外都作為 `NSError` 傳播。現在此行為發生了變化：現在只有作為 `@Throws` 註解參數指定的類別（或其子類別）執行個體的例外才會拋出 `NSError`。其他到達 Swift/Objective-C 的 Kotlin 例外被視為未處理，並導致程式終止。

### 預設在 Apple 目標上產生 release .dSYMs

從 1.4.0 開始，Kotlin/Native 編譯器預設會為 Darwin 平台上的 release 二進位檔產生 [偵錯符號檔](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information) (`.dSYM`s)。這可以使用 `-Xadd-light-debug=disable` 編譯器選項停用。在其他平台上，此選項預設為停用。若要在 Gradle 中切換此選項，請使用：

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[進一步了解當機報告符號化](native-debugging.md#debug-ios-applications)。

### 效能改進

Kotlin/Native 獲得了許多效能改進，加速了開發過程與執行速度。以下是一些範例：

- 為了提高物件分配的速度，我們現在提供 [mimalloc](https://github.com/microsoft/mimalloc) 記憶體分配器作為系統分配器的替代方案。mimalloc 在某些效能基準測試中速度快達兩倍。目前，在 Kotlin/Native 中使用 mimalloc 是實驗性的；您可以使用 `-Xallocator=mimalloc` 編譯器選項切換到它。

- 我們重新製作了 C 互通程式庫的建置方式。透過新工具，Kotlin/Native 產生互通程式庫的速度比以前快 4 倍，且產物大小僅為以前的 25% 到 30%。

- 由於 GC 的最佳化，整體執行階段效能得到了提升。這種改進在具有大量長期存在物件的專案中尤為明顯。`HashMap` 與 `HashSet` 集合現在透過避免多餘的裝箱來提高執行速度。

- 在 1.3.70 中，我們引入了兩個用於提高 Kotlin/Native 編譯效能的新特性：[快取專案相依性以及從 Gradle daemon 執行編譯器](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。從那時起，我們成功修復了許多問題並提高了這些特性的整體穩定性。

### 簡化了 CocoaPods 相依性的管理

以前，一旦您將專案與相依性管理工具 CocoaPods 整合，您只能在 Xcode 中建置專案的 iOS, macOS, watchOS, 或 tvOS 部分，與多平台專案的其他部分分開。這些其他部分可以在 IntelliJ IDEA 中建置。

此外，每當您加入對儲存在 CocoaPods 中的 Objective-C 程式庫（Pod 程式庫）的相依性時，您都必須從 IntelliJ IDEA 切換到 Xcode，呼叫 `pod install`，然後在那裡執行 Xcode 建置。

現在您可以在 IntelliJ IDEA 中直接管理 Pod 相依性，同時享受它為處理程式碼提供的優點，例如程式碼高亮與補全。您也可以使用 Gradle 建置整個 Kotlin 專案，而無需切換到 Xcode。這意味著您只有在需要編寫 Swift/Objective-C 程式碼或在模擬器或裝置上執行應用程式時才需要去 Xcode。

現在您也可以處理儲存在本機的 Pod 程式庫。

根據您的需求，您可以在以下各項之間加入相依性：
* Kotlin 專案與遠端儲存在 CocoaPods 存儲庫中或本機儲存在您電腦上的 Pod 程式庫。
* Kotlin Pod（用作 CocoaPods 相依性的 Kotlin 專案）與具有一個或多個目標的 Xcode 專案。

完成初始配置，當您向 `cocoapods` 加入新相依性時，只需在 IntelliJ IDEA 中重新匯入專案即可。新相依性將自動加入。不需要額外步驟。

[了解如何加入相依性](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)。

## Kotlin 多平台

> 對多平台專案的支援處於 [Alpha](components-stability.md) 階段。未來可能會發生不相容的變更，並需要手動遷移。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上對其提供的回饋。
>
{style="warning"}

[Kotlin 多平台](https://kotlinlang.org/docs/multiplatform/get-started.html) 減少了為 [不同平台](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets) 編寫與維護相同程式碼所花費的時間，同時保留了原生程式設計的靈活性與優勢。我們繼續在多平台功能與改進上投入精力：

* [透過階層式專案結構在多個目標中共享程式碼](#sharing-code-in several-targets-with-the-hierarchical-project-structure)
* [在階層式結構中利用原生程式庫](#leveraging-native-libs-in-the-hierarchical-structure)
* [僅指定一次 kotlinx 相依性](#specifying-dependencies-only-once)

> 多平台專案需要 Gradle 6.0 或更高版本。
>
{style="note"}

### 透過階層式專案結構在多個目標中共享程式碼

藉助新的階層式專案結構支援，您可以在 [多平台專案](https://kotlinlang.org/docs/multiplatform/multiplatform-discover-project.html) 中與 [多個平台](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets) 共享程式碼。

以前，加入到多平台專案的任何程式碼只能放在平台特定的原始碼集中（僅限於一個目標，不能被任何其他平台重用），或者放在通用的原始碼集中（如 `commonMain` 或 `commonTest`，在專案中的所有平台之間共享）。在通用原始碼集中，您只能透過使用 [需要平台特定 `actual` 實作的 `expect` 宣告](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) 來呼叫平台特定的 API。

這使得在 [所有平台共享程式碼](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-all-platforms) 變得很簡單，但在 [僅部分目標之間共享](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) 卻不那麼容易，特別是那些可能重用大量通用邏輯與第三方 API 的相似目標。

例如，在針對 iOS 的典型多平台專案中，有兩個與 iOS 相關的目標：一個用於 iOS ARM64 裝置，另一個用於 x64 模擬器。它們有獨立的平台特定原始碼集，但在實務上，裝置與模擬器很少需要不同的程式碼，且它們的相依性非常相似。因此 iOS 特定的程式碼可以在它們之間共享。

顯然，在此設定中，最好能有一個 *兩個 iOS 目標共用的原始碼集*，其中的 Kotlin/Native 程式碼仍然可以直接呼叫 iOS 裝置與模擬器共用的任何 API。

![iOS 目標共用的程式碼](iosmain-hierarchy.png){width=300}

現在您可以透過 [階層式專案結構支援](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) 來實現這一點，它會根據哪些目標使用它們來推論並適配每個原始碼集中可用的 API 與語言特性。

對於常見的目標組合，您可以使用目標捷徑建立階層式結構。
例如，使用 `ios()` 捷徑建立兩個 iOS 目標以及上面顯示的共用原始碼集：

```kotlin
kotlin {
    ios() // iOS 裝置與模擬器目標；iosMain 與 iosTest 原始碼集
}
```

對於其他目標組合，請透過使用 `dependsOn` 關係連接原始碼集來 [手動建立階層](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#manual-configuration)。

![階層式結構](manual-hierarchical-structure.svg)

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

多虧了階層式專案結構，程式庫也可以為目標子集提供通用 API。進一步了解 [在程式庫中共享程式碼](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-in-libraries)。

### 在階層式結構中利用原生程式庫

您可以在多個原生目標共用的原始碼集中使用平台相依程式庫，例如 Foundation, UIKit, 與 POSIX。這可以幫助您共享更多原生程式碼，而不會受到平台特定相依性的限制。

不需要額外的步驟——一切都是自動完成的。IntelliJ IDEA 將幫助您偵測可以在共用程式碼中使用的通用宣告。

[進一步了解平台相依程式庫的使用](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。

### 僅指定一次相依性

從現在開始，不再需要在共享與使用它的平台特定原始碼集中為同一個程式庫的不同變體指定相依性，您應該只在共享原始碼集中指定一次相依性。

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

不要使用帶有指定平台後綴（如 `-common`, `-native` 或類似）的 kotlinx 程式庫產物名稱，因為它們不再受支援。相反地，請使用程式庫基礎產物名稱，在上述範例中即為 `kotlinx-coroutines-core`。

然而，此變更目前不影響：
* `stdlib` 程式庫 – 從 Kotlin 1.4.0 開始，[stdlib 相依性會自動加入](#dependency-on-the-standard-library-added-by-default)。
* `kotlin.test` 程式庫 – 您仍應使用 `test-common` 與 `test-annotations-common`。這些相依性將在稍後處理。

如果您僅需要特定平台的相依性，您仍然可以使用帶有 `-jvm` 或 `-js` 後綴的標準與 kotlinx 程式庫的平台特定變體，例如 `kotlinx-coroutines-core-jvm`。

[進一步了解配置相依性](gradle-configure-project.md#configure-dependencies)。

## Gradle 專案改進

除了特定於 [Kotlin 多平台](#kotlin-multiplatform), [Kotlin/JVM](#kotlin-jvm), [Kotlin/Native](#kotlin-native), 與 [Kotlin/JS](#kotlin-js) 的 Gradle 專案特性與改進之外，還有幾項適用於所有 Kotlin Gradle 專案的變更：

* [標準程式庫相依性現在預設加入](#dependency-on-the-standard-library-added-by-default)
* [Kotlin 專案需要較新版本的 Gradle](#minimum-gradle-version-for-kotlin-projects)
* [改進了 IDE 中對 Kotlin Gradle DSL 的支援](#improved-gradle-kts-support-in-the-ide)

### 預設加入標準程式庫相依性

您不再需要在任何 Kotlin Gradle 專案（包括多平台專案）中宣告對 `stdlib` 程式庫的相依性。該相依性已預設加入。

自動加入的標準程式庫將與 Kotlin Gradle 外掛程式的版本相同，因為它們具有相同的版本編號。

對於平台特定的原始碼集，會使用對應的平台特定變體程式庫，而其餘部分則加入通用標準程式庫。Kotlin Gradle 外掛程式將根據您 Gradle 建置指令碼的 `kotlinOptions.jvmTarget` [編譯器選項](gradle-compiler-options.md) 選擇適當的 JVM 標準程式庫。

[了解如何更改預設行為](gradle-configure-project.md#dependency-on-the-standard-library)。

### Kotlin 專案的最低 Gradle 版本

若要在您的 Kotlin 專案中享受新功能，請將 Gradle 更新至 [最新版本](https://gradle.org/releases/)。多平台專案需要 Gradle 6.0 或更高版本，而其他 Kotlin 專案則適用於 Gradle 5.4 或更高版本。

### 改進的 *.gradle.kts 在 IDE 中的支援 

在 1.4.0 中，我們繼續改進 IDE 對 Gradle Kotlin DSL 指令碼 (`*.gradle.kts` 檔案) 的支援。以下是新版本帶來的功能：

- _顯式載入指令碼配置_ 以獲得更好的效能。以前，您對建置指令碼所做的變更會在背景自動載入。為了提高效能，我們在 1.4.0 中停用了自動載入建置指令碼配置。現在，IDE 僅在您明確套用變更時才載入它們。

  在低於 6.0 的 Gradle 版本中，您需要透過點擊編輯器中的 **Load Configuration** 手動載入指令碼配置。

  ![*.gradle.kts – 載入配置](gradle-kts-load-config.png)

  在 Gradle 6.0 及更高版本中，您可以透過點擊 **Load Gradle Changes** 或重新匯入 Gradle 專案來顯式套用變更。
 
  我們在 IntelliJ IDEA 2020.1 與 Gradle 6.0 及以上版本中加入了一個額外的操作 – **Load Script Configurations**，它可以在不更新整個專案的情況下載入對指令碼配置的變更。這比重新匯入整個專案花費的時間少得多。

  ![*.gradle.kts – 載入指令碼變更與載入 Gradle 變更](gradle-kts.png)

  對於新建立的指令碼或首次使用新 Kotlin 外掛程式開啟專案時，您也應該 **Load Script Configurations**。
  
  在 Gradle 6.0 及以上版本中，您現在可以一次載入所有指令碼，而不像之前的實作是個別載入。由於每個請求都需要執行 Gradle 配置階段，對於大型 Gradle 專案來說，這可能會耗費大量資源。 
  
  目前，此類載入僅限於 `build.gradle.kts` 與 `settings.gradle.kts` 檔案（請為相關 [問題](https://github.com/gradle/gradle/issues/12640) 投票）。若要為 `init.gradle.kts` 或套用的 [指令碼外掛程式](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins) 啟用醒目提示，請使用舊機制 – 將它們加入獨立指令碼。當您需要時，這些指令碼的配置將單獨載入。您也可以為此類指令碼啟用自動重新載入。
    
  ![*.gradle.kts – 加入獨立指令碼](gradle-kts-standalone.png)
  
- _更好的錯誤報告_。以前您只能在單獨的日誌檔中看到來自 Gradle Daemon 的錯誤。現在，Gradle Daemon 會直接回傳所有關於錯誤的資訊並顯示在 Build 工具視窗中。這節省了您的時間與精力。

## 標準程式庫

以下是 1.4.0 中 Kotlin 標準程式庫最重大變更清單： 

- [通用的例外處理 API](#common-exception-processing-api)
- [陣列與集合的新函式](#new-functions-for-arrays-and-collections)
- [字串操作函式](#functions-for-string-manipulations)
- [位元運算](#bit-operations)
- [委派屬性的改進](#delegated-properties-improvements)
- [從 KType 轉換為 Java Type](#converting-from-ktype-to-java-type)
- [用於 Kotlin 反射的 Proguard 配置](#proguard-configurations-for-kotlin-reflection)
- [改進現有 API](#improving-the-existing-api)
- [stdlib 產物的 module-info 描述符](#module-info-descriptors-for-stdlib-artifacts)
- [棄用](#deprecations)
- [排除已棄用的實驗性協同程式](#exclusion-of-the-deprecated-experimental-coroutines)

### 通用的例外處理 API

以下 API 元素已移動到通用程式庫：

* `Throwable.stackTraceToString()` 擴充函式，回傳此 throwable 的詳細描述及其堆疊追蹤，以及 `Throwable.printStackTrace()`，將此描述列印到標準錯誤輸出。
* `Throwable.addSuppressed()` 函式，允許您指定為了傳遞例外而被隱藏的例外，以及 `Throwable.suppressedExceptions` 屬性，回傳所有隱藏例外的清單。
* `@Throws` 註解，列出了當函式編譯為平台方法（在 JVM 或原生平台上）時將被檢查的例外型別。

### 陣列與集合的新函式

#### 集合

在 1.4.0 中，標準程式庫包含許多用於處理 **集合** 的實用函式：

* `setOfNotNull()`，建立一個包含所提供引數中所有非 null 項目的集合。

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
        println(result.toList()) // 100 以下的五個隨機偶數
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `onEach()` 與 `flatMap()` 的 `*Indexed()` 對應函式。
它們套用於集合元素的運算將元素索引作為參數。

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

* `*OrNull()` 對應函式 `randomOrNull()`, `reduceOrNull()`, 與 `reduceIndexedOrNull()`。
它們在空集合上回傳 `null`。

    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         //empty.reduce { a, b -> a + b } // 例外：空集合無法被 reduce。
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `runningFold()`，其同義詞 `scan()`，以及 `runningReduce()` 將給定的運算依序套用於集合元素，類似於 `fold()` 與 `reduce()`；不同之處在於這些新函式回傳中間結果的完整序列。

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

* `sumOf()` 接受一個選擇器函式，並回傳集合中所有元素值的總和。
`sumOf()` 可以產生 `Int`, `Long`, `Double`, `UInt`, 與 `ULong` 型別的總和。在 JVM 上，`BigInteger` 與 `BigDecimal` 亦可用。

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
        println("您訂購了 $count 件物品，總花費為 $total")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `min()` 與 `max()` 函式已更名為 `minOrNull()` 與 `maxOrNull()`，以符合 Kotlin 集合 API 中使用的命名慣例。函式名稱中的 `*OrNull` 後綴表示如果接收者集合為空，則回傳 `null`。這同樣適用於 `minBy()`, `maxBy()`, `minWith()`, `maxWith()` – 在 1.4 中，它們都有 `*OrNull()` 同義詞。
* 新的 `minOf()` 與 `maxOf()` 擴充函式回傳集合項目上給定選擇器函式的最小值與最大值。

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
        println("訂單中最貴的物品價格為 $highestPrice")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

    還有 `minOfWith()` 與 `maxOfWith()` 接受 `Comparator` 作為引數，以及所有四個函式的 `*OrNull()` 版本，在空集合上回傳 `null`。

* `flatMap` 與 `flatMapTo` 的新多載允許您使用回傳型別與接收者型別不相符的轉換，即：
    * `Iterable`, `Array`, 與 `Map` 上轉換為 `Sequence`
    * `Sequence` 上轉換為 `Iterable`

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

* 用於從可變列表中移除元素的 `removeFirst()` 與 `removeLast()` 捷徑，以及這些函式的 `*orNull()` 對應函式。

#### 陣列

為了在處理不同容器型別時提供一致的體驗，我們也為 **陣列** 加入了新函式：

* `shuffle()` 將陣列元素隨機排序。
* `onEach()` 對每個陣列元素執行給定的操作並回傳陣列本身。
* `associateWith()` 與 `associateWithTo()` 以陣列元素作為鍵建立 Map。
* 陣列子範圍的 `reverse()` 反轉子範圍中元素的順序。
* 陣列子範圍的 `sortDescending()` 將子範圍中的元素按遞減順序排序。
* 陣列子範圍的 `sort()` 與 `sortWith()` 現在在通用程式庫中可用。

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

此外，還有用於 `CharArray`/`ByteArray` 與 `String` 之間轉換的新函式：
* `ByteArray.decodeToString()` 與 `String.encodeToByteArray()`
* `CharArray.concatToString()` 與 `String.toCharArray()`

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

我們還加入了 `ArrayDeque` 類別 – 雙端隊列的實作。
雙端隊列允許您在攤銷常數時間內從隊列的開頭或末尾加入或移除元素。當您在程式碼中需要隊列或堆疊時，可以預設使用雙端隊列。

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

`ArrayDeque` 實作底層使用可變大小陣列：它將內容儲存在環形緩衝區（一個 `Array`）中，且僅在 `Array` 滿時才調整其大小。

### 字串操作函式

1.4.0 中的標準程式庫包含許多對字串操作 API 的改進：

* `StringBuilder` 有實用的新擴充函式：`set()`, `setRange()`, `deleteAt()`, `deleteRange()`, `appendRange()` 等。

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

* `StringBuilder` 的一些現有函式在通用程式庫中可用。其中包括 `append()`, `insert()`, `substring()`, `setLength()` 等。
* 新函式 `Appendable.appendLine()` 與 `StringBuilder.appendLine()` 已加入通用程式庫。它們取代了這些類別中僅限 JVM 的 `appendln()` 函式。

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

### 位元運算

位元操作的新函式：
* `countOneBits()` 
* `countLeadingZeroBits()`
* `countTrailingZeroBits()`
* `takeHighestOneBit()`
* `takeLowestOneBit()` 
* `rotateLeft()` 與 `rotateRight()` (實驗性)

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

### 委派屬性的改進

在 1.4.0 中，我們加入了新功能以改善您在 Kotlin 中使用委派屬性的體驗：
- 現在一個屬性可以委派給另一個屬性。
- 新介面 `PropertyDelegateProvider` 有助於在單個宣告中建立委派提供者。
- `ReadWriteProperty` 現在繼承了 `ReadOnlyProperty`，因此您可以將兩者都用於唯讀屬性。

除了新的 API 之外，我們還進行了一些最佳化以減少產生的位元組碼大小。這些最佳化在 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties) 中有詳細描述。

[進一步了解委派屬性](delegated-properties.md)。

### 從 KType 轉換為 Java Type

stdlib 中新的擴充屬性 `KType.javaType`（目前為實驗性）有助於在不使用整個 `kotlin-reflect` 相依性的情況下從 Kotlin 型別獲取 `java.lang.reflect.Type`。

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

### 用於 Kotlin 反射的 Proguard 配置

從 1.4.0 開始，我們已在 `kotlin-reflect.jar` 中嵌入了 Proguard/R8 配置。有了這個，大多數使用 R8 或 Proguard 的 Android 專案在使用 kotlin-reflect 時應該不需要任何額外配置。您不再需要複製貼上 kotlin-reflect 內部的 Proguard 規則。但請注意，您仍需要顯式列出所有您打算進行反射的 API。

### 改進現有 API

* 幾個函式現在可以處理 null 接收者，例如：
    * 字串上的 `toBoolean()`
    * 陣列上的 `contentEquals()`, `contentHashcode()`, `contentToString()`

* `Double` 與 `Float` 中的 `NaN`, `NEGATIVE_INFINITY`, 與 `POSITIVE_INFINITY` 現在定義為 `const`，因此您可以將它們用作註解引數。

* `Double` 與 `Float` 中的新常數 `SIZE_BITS` 與 `SIZE_BYTES` 包含了以二進制形式表示該型別執行個體所使用的位元數與位元組數。

* `maxOf()` 與 `minOf()` 頂層函式可以接受可變數量的引數 (`vararg`)。

### stdlib 產物的 module-info 描述符

Kotlin 1.4.0 為預設標準程式庫產物加入了 `module-info.java` 模組資訊。這允許您將它們與 [jlink 工具](https://docs.oracle.com/en/java/javase/11/tools/jlink.html) 一起使用，後者會產生僅包含您應用程式所需平台模組的自訂 Java 執行階段映像。
您以前也可以在 Kotlin 標準程式庫產物中使用 jlink，但必須使用單獨的產物 – 帶有 "modular" 分類器的產物 – 且整個設定並不簡單。
在 Android 中，請確保您使用 Android Gradle 外掛程式 3.2 或更高版本，它可以正確處理帶有 module-info 的 jar 檔案。

### 棄用

#### Double 與 Float 的 toShort() 與 toByte()

我們已棄用 `Double` 與 `Float` 上的 `toShort()` 與 `toByte()` 函式，因為它們可能由於數值範圍窄且變數大小較小而導致意外結果。

若要將浮點數轉換為 `Byte` 或 `Short`，請使用兩步轉換：首先將其轉換為 `Int`，然後再次轉換為目標型別。

#### 浮點陣列上的 contains(), indexOf(), 與 lastIndexOf()

我們已棄用 `FloatArray` 與 `DoubleArray` 的 `contains()`, `indexOf()`, 與 `lastIndexOf()` 擴充函式，因為它們使用 [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 標準相等性，這在某些邊緣情況下與全序相等性相矛盾。詳情請參閱 [此問題](https://youtrack.jetbrains.com/issue/KT-28753)。

#### min() 與 max() 集合函式

我們已棄用 `min()` 與 `max()` 集合函式，改用 `minOrNull()` 與 `maxOrNull()`，後者更正確地反映了它們的行為 – 在空集合上回傳 `null`。
詳情請參閱 [此問題](https://youtrack.jetbrains.com/issue/KT-38854)。

### 排除已棄用的實驗性協同程式
 
`kotlin.coroutines.experimental` API 在 1.3.0 中已被棄用，改用 kotlin.coroutines。在 1.4.0 中，我們透過從標準程式庫中移除 `kotlin.coroutines.experimental` 來完成棄用週期。對於仍在 JVM 上使用它的用戶，我們提供了一個相容性產物 `kotlin-coroutines-experimental-compat.jar`，其中包含所有實驗性協同程式 API。我們已將其發布到 Maven，並將其隨標準程式庫一起包含在 Kotlin 發行版中。

## 穩定的 JSON 序列化

隨著 Kotlin 1.4.0 的發布，我們正交付 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的第一個穩定版本 - 1.0.0-RC。現在我們很高興地宣告 `kotlinx-serialization-core`（以前稱為 `kotlinx-serialization-runtime`）中的 JSON 序列化 API 已穩定。其他序列化格式的程式庫仍處於實驗階段，核心程式庫的一些高級部分也是如此。

我們顯著重構了 JSON 序列化的 API，使其更加一致且易於使用。從現在開始，我們將繼續以向下相容的方式開發 JSON 序列化 API。
但是，如果您曾使用過其先前版本，則在遷移到 1.0.0-RC 時需要重寫部分程式碼。
為了幫助您解決此問題，我們還提供了 **[Kotlin 序列化指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)** – 這是 `kotlinx.serialization` 的完整文件集。它將引導您使用最重要的功能，並幫助您解決可能面臨的任何問題。

>**注意**：`kotlinx-serialization` 1.0.0-RC 僅適用於 Kotlin 編譯器 1.4。早期的編譯器版本不相容。
>
{style="note"}

## 指令碼與 REPL

在 1.4.0 中，Kotlin 中的指令碼受益於許多功能與效能改進以及其他更新。以下是一些關鍵變更：

- [新的相依性解析 API](#new-dependencies-resolution-api)
- [新的 REPL API](#new-repl-api)
- [編譯後的指令碼快取](#compiled-scripts-cache)
- [產物重命名](#artifacts-renaming)

為了幫助您更熟悉 Kotlin 中的指令碼，我們準備了一個 [包含範例的專案](https://github.com/Kotlin/kotlin-script-examples)。
它包含標準指令碼 (`*.main.kts`) 的範例，以及 Kotlin Scripting API 與自訂指令碼定義的使用範例。請嘗試一下，並使用我們的 [問題追蹤器](https://youtrack.jetbrains.com/issues/KT) 分享您的回饋。

### 新的相依性解析 API

在 1.4.0 中，我們引入了用於解析外部相依性（如 Maven 產物）的新 API 及其實作。此 API 在新產物 `kotlin-scripting-dependencies` 與 `kotlin-scripting-dependencies-maven` 中發布。`kotlin-script-util` 程式庫中以前的相依性解析功能現在已棄用。

### 新的 REPL API

新的實驗性 REPL API 現在是 Kotlin Scripting API 的一部分。在已發布的產物中也有該 API 的幾種實作，有些具有高級功能，例如程式碼補全。我們在 [Kotlin Jupyter 核心](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/) 中使用了此 API，現在您可以在自己的自訂 shell 與 REPL 中嘗試它。

### 編譯後的指令碼快取

Kotlin Scripting API 現在提供了實作編譯後指令碼快取的能力，顯著加快了未更改指令碼的後續執行速度。我們預設的高級指令碼實作 `kotlin-main-kts` 已經擁有自己的快取。

### 產物重命名

為了避免對產物名稱產生困惑，我們已將 `kotlin-scripting-jsr223-embeddable` 與 `kotlin-scripting-jvm-host-embeddable` 重命名為 `kotlin-scripting-jsr223` 與 `kotlin-scripting-jvm-host`。這些產物相依於 `kotlin-compiler-embeddable` 產物，該產物對捆綁的第三方程式庫進行了遮蔽 (shading) 以避免使用衝突。透過這次重命名，我們將使用 `kotlin-compiler-embeddable`（通常更安全）作為指令碼產物的預設選項。
如果出於某種原因您需要相依於未遮蔽 `kotlin-compiler` 的產物，請使用帶有 `-unshaded` 後綴的產物版本，例如 `kotlin-scripting-jsr223-unshaded`。請注意，此重命名僅影響預期直接使用的指令碼產物；其他產物的名稱保持不變。

## 遷移至 Kotlin 1.4.0

Kotlin 外掛程式的遷移工具可幫助您將專案從早期版本的 Kotlin 遷移到 1.4.0。

只需將 Kotlin 版本更改為 `1.4.0` 並重新匯入您的 Gradle 或 Maven 專案即可。IDE 接著會詢問您是否進行遷移。
 
如果您同意，它將執行遷移程式碼檢查，檢查您的程式碼並針對任何無法運作或 1.4.0 中不建議的做法提供修正建議。

![執行遷移](run-migration-wn.png){width=300}

程式碼檢查具有不同的 [嚴重級別](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html)，以幫助您決定接受哪些建議以及忽略哪些建議。

![遷移檢查](migration-inspection-wn.png)

Kotlin 1.4.0 是一個 [特性版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能會給語言帶來不相容的變更。在 **[Kotlin 1.4 相容性指南](compatibility-guide-14.md)** 中可以找到此類變更的詳細清單。