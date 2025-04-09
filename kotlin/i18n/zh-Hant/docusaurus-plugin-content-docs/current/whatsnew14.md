---
title: "Kotlin 1.4.0 的新功能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發佈：2020 年 8 月 17 日](releases#release-details)_

在 Kotlin 1.4.0 中，我們針對所有組件進行了許多改進，重點在於[品質與效能](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)。
您將在下方找到 Kotlin 1.4.0 中最重要的變更清單。

## 語言功能與改進

Kotlin 1.4.0 帶來了各種不同的語言功能與改進。 其中包含：

* [Kotlin 介面的 SAM 轉換](#sam-conversions-for-kotlin-interfaces)
* [程式庫作者的顯式 API 模式](#explicit-api-mode-for-library-authors)
* [混合具名與位置引數](#mixing-named-and-positional-arguments)
* [尾隨逗號](#trailing-comma)
* [可呼叫參考改進](#callable-reference-improvements)
* [迴圈中 when 內部的 break 與 continue](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin 介面的 SAM 轉換

在 Kotlin 1.4.0 之前，您只能在[從 Kotlin 使用 Java 方法與 Java 介面](java-interop#sam-conversions)時，套用 SAM（單一抽象方法，Single Abstract Method）轉換。 從現在開始，您也可以針對 Kotlin 介面使用 SAM 轉換。
若要這麼做，請使用 `fun` 修飾詞將 Kotlin 介面明確標記為 functional。

當您在預期只有一個單一抽象方法的介面作為參數時，將 lambda 作為引數傳遞時，就會套用 SAM 轉換。 在此情況下，編譯器會自動將 lambda 轉換為實作抽象成員函式的類別的實例。

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() { 
    println("Is 7 even? - ${isEven.accept(7)}")
}
```

[深入瞭解 Kotlin functional 介面與 SAM 轉換](fun-interfaces)。

### 程式庫作者的顯式 API 模式

Kotlin 編譯器為程式庫作者提供 _explicit API mode_（顯式 API 模式）。 在此模式下，編譯器會執行額外的檢查，以協助程式庫的 API 更清晰且更一致。 它針對公開至程式庫公共 API 的宣告新增了以下需求：

* 如果預設可見性將宣告公開至公共 API，則宣告需要可見性修飾詞。
這有助於確保不會無意中將任何宣告公開至公共 API。
* 公開至公共 API 的屬性與函式需要明確的類型規格。
這可確保 API 使用者知道他們使用的 API 成員的類型。

根據您的組態，這些顯式 API 可以產生錯誤（_strict_ 模式）或警告（_warning_ 模式）。
為了可讀性與常識，某些宣告會排除在這些檢查之外：

* primary constructor（主要建構函式）
* data class（資料類別）的屬性
* 屬性 getter 和 setter
* `override` 方法

顯式 API 模式僅分析模組的生產來源。

若要在顯式 API 模式中編譯您的模組，請將以下程式碼行新增至您的 Gradle 建置腳本：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

使用命令列編譯器時，請新增具有 `strict` 或 `warning` 值的 `-Xexplicit-api` 編譯器選項，以切換至顯式 API 模式。

```bash
-Xexplicit-api=\{strict|warning\}
```

[在 KEEP 中尋找關於顯式 API 模式的更多詳細資訊](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode)。 

### 混合具名與位置引數

在 Kotlin 1.3 中，當您使用[具名引數](functions#named-arguments)呼叫函式時，您必須將所有沒有名稱的引數（位置引數）放在第一個具名引數之前。 例如，您可以呼叫 `f(1, y = 2)`，但您無法呼叫 `f(x = 1, 2)`。

當所有引數都位於正確的位置，但您想要為中間的一個引數指定名稱時，這真的很煩人。
對於絕對清楚布林值或 `null` 值屬於哪個屬性特別有幫助。

在 Kotlin 1.4 中，沒有這樣的限制 – 您現在可以為位置
引數集合中間的引數指定名稱。 此外，只要它們保持正確的順序，您就可以隨意混合位置引數與具名引數。

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

使用 Kotlin 1.4，您現在可以在列舉中新增尾隨逗號，例如引數與參數清單、`when` 項目以及解構宣告的組件。
使用尾隨逗號，您可以新增新項目並變更其順序，而無需新增或移除逗號。

如果您對參數或值使用多行語法，這特別有幫助。 新增尾隨逗號後，您可以
輕鬆地交換具有參數或值的行。

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

Kotlin 1.4 支援使用可呼叫參考的更多情況：

* 具有預設引數值的函式參考
* `Unit`-returning 函式中的函式參考
* 根據函式中引數數量調整的參考
* 可呼叫參考上的暫停轉換

#### 具有預設引數值的函式參考

現在您可以使用可呼叫參考來參考具有預設引數值的函式。 如果函式 `foo` 的可呼叫參考不採用任何引數，則會使用預設值 `0`。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () `->` String): String = func()

fun main() {
    println(apply(::foo))
}
```

先前，您必須為函式 `apply` 撰寫額外的多載才能使用預設引數值。

```kotlin
// some new overload
fun applyInt(func: (Int) `->` String): String = func(0) 
```

#### Unit-returning 函式中的函式參考

在 Kotlin 1.4 中，您可以在 `Unit`-returning 函式中使用可呼叫參考來參考傳回任何類型的函式。
在 Kotlin 1.4 之前，您只能在此情況下使用 lambda 引數。 現在您可以同時使用 lambda 引數與可呼叫參考。

```kotlin
fun foo(f: () `->` Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

#### 根據函式中引數數量調整的參考

現在，當傳遞可變數量的引數 (`vararg`) 時，您可以調整對函式的可呼叫參考。
您可以在傳遞引數清單的結尾傳遞任意數量的相同類型參數。

```kotlin
fun foo(x: Int, vararg y: String) {}

fun use0(f: (Int) `->` Unit) {}
fun use1(f: (Int, String) `->` Unit) {}
fun use2(f: (Int, String, String) `->` Unit) {}

fun test() {
    use0(::foo) 
    use1(::foo) 
    use2(::foo) 
}
```

#### 可呼叫參考上的暫停轉換

除了 lambda 上的暫停轉換之外，從 1.4.0 版開始，Kotlin 現在也支援可呼叫參考上的暫停轉換。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () `->` Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

### 迴圈中 when 內部的 break 與 continue

在 Kotlin 1.3 中，您無法在迴圈中包含的 `when` 運算式內使用未限定的 `break` 與 `continue`。 原因是這些關鍵字保留給 `when` 運算式中可能的[fall-through 行為](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)使用。

這就是為什麼如果您想要在迴圈中 `when` 運算式內使用 `break` 與 `continue`，則必須[標記](returns#break-and-continue-labels)它們，這變得相當麻煩。

```kotlin
fun test(xs: List<Int>) {
    LOOP@for (x in xs) {
        when (x) {
            2 `->` continue@LOOP
            17 `->` break@LOOP
            else `->` println(x)
        }
    }
}
```

在 Kotlin 1.4 中，您可以在迴圈中包含的 `when` 運算式內使用沒有標籤的 `break` 與 `continue`。 它們的行為如預期，會終止最近的封閉迴圈或繼續進行下一個步驟。

```kotlin
fun test(xs: List<Int>) {
    for (x in xs) {
        when (x) {
            2 `->` continue
            17 `->` break
            else `->` println(x)
        }
    }
}
```

`when` 內部的 fall-through 行為有待進一步設計。

## IDE 中的新工具

使用 Kotlin 1.4，您可以使用 IntelliJ IDEA 中的新工具來簡化 Kotlin 開發：

* [新的彈性專案精靈](#new-flexible-project-wizard)
* [協程除錯工具](#coroutine-debugger)

### 新的彈性專案精靈

使用彈性的新 Kotlin 專案精靈，您可以輕鬆建立與設定不同類型的 Kotlin
專案，包括多平台專案，如果沒有 UI，這可能難以設定。

<img src="/img/multiplatform-project-1-wn.png" alt="Kotlin Project Wizard – Multiplatform project" style={{verticalAlign: 'middle'}}/>

新的 Kotlin 專案精靈既簡單又彈性：

1. *選取專案範本*，取決於您嘗試執行的動作。 未來將新增更多範本。
2. *選取建置系統* – Gradle（Kotlin 或 Groovy DSL）、Maven 或 IntelliJ IDEA。
    Kotlin 專案精靈只會顯示選取專案範本上支援的建置系統。
3. *直接在主畫面上預覽專案結構*。

然後您可以完成建立您的專案，或選擇性地*在下一個畫面上設定專案*：

4. *新增/移除此專案範本支援的模組與目標*。
5. *設定模組與目標設定*，例如目標 JVM 版本、目標範本與測試架構。

<img src="/img/multiplatform-project-2-wn.png" alt="Kotlin Project Wizard - Configure targets" style={{verticalAlign: 'middle'}}/>

未來，我們將新增更多組態選項與範本，讓 Kotlin 專案精靈更具彈性。

您可以透過完成這些教學課程來試用新的 Kotlin 專案精靈：

* [建立基於 Kotlin/JVM 的主控台應用程式](jvm-get-started)
* [建立用於 React 的 Kotlin/JS 應用程式](js-react)
* [建立 Kotlin/Native 應用程式](native-get-started)

### 協程除錯工具

許多人已經使用[協程](coroutines-guide)進行非同步程式設計。
但是當涉及到除錯時，在 Kotlin 1.4 之前使用協程可能真的很痛苦。 由於協程在執行緒之間跳躍，因此很難理解特定協程在做什麼以及檢查其內容。 在某些情況下，透過中斷點追蹤步驟根本不起作用。 因此，您必須依靠記錄或精神努力來除錯使用協程的程式碼。

在 Kotlin 1.4 中，使用 Kotlin 外掛程式隨附的新功能，除錯協程現在方便多了。

:::note
除錯適用於 1.3.8 或更新版本的 `kotlinx-coroutines-core`。

:::

**Debug Tool Window**（除錯工具視窗）現在包含新的 **Coroutines**（協程）標籤。 在此標籤中，您可以找到關於目前
正在執行與暫停協程的資訊。 協程會依它們執行的分派器分組。

<img src="/img/coroutine-debugger-wn.png" alt="Debugging coroutines" style={{verticalAlign: 'middle'}}/>

現在您可以：
* 輕鬆檢查每個協程的狀態。
* 查看正在執行與暫停協程的區域與擷取變數的值。
* 查看完整的協程建立堆疊，以及協程內部的呼叫堆疊。 堆疊包含所有具有
變數值的框架，即使是那些在標準除錯期間會遺失的框架。

如果您需要包含每個協程及其堆疊狀態的完整報告，請在 **Coroutines**（協程）標籤內按一下滑鼠右鍵，然後
按一下 **Get Coroutines Dump**（取得協程轉儲）。 目前，協程轉儲相當簡單，但我們將在 Kotlin 的未來版本中讓它更具可讀性
與幫助。

<img src="/img/coroutines-dump-wn.png" alt="Coroutines Dump" style={{verticalAlign: 'middle'}}/>

在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/)
與 [IntelliJ IDEA 文件](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html)中深入瞭解除錯協程。

## 新編譯器

新的 Kotlin 編譯器將非常快速； 它將統一所有支援的平台，並為編譯器擴充功能提供
API。 這是一個長期專案，我們已經在 Kotlin 1.4.0 中完成了幾個步驟：

* [預設已啟用新的、更強大的類型推斷演算法](#new-more-powerful-type-inference-algorithm)。
* [新的 JVM 與 JS IR 後端](#unified-backends-and-extensibility)。 一旦我們穩定它們，它們將成為預設值。

### 新的更強大的類型推斷演算法

Kotlin 1.4 使用新的、更強大的類型推斷演算法。 此新演算法已可在
Kotlin 1.3 中透過指定編譯器選項來嘗試，現在預設使用它。 您可以在 [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20)中找到新演算法中已修正問題的完整清單。 在此
您可以找到一些最顯著的改進：

* [更多自動推斷類型的情況](#more-cases-where-type-is-inferred-automatically)
* [Lambda 最後一個運算式的智慧轉換](#smart-casts-for-a-lambda-s-last-expression)
* [可呼叫參考的智慧轉換](#smart-casts-for-callable-references)
* [委派屬性的更好推斷](#better-inference-for-delegated-properties)
* [具有不同引數的 Java 介面的 SAM 轉換](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Kotlin 中的 Java SAM 介面](#java-sam-interfaces-in-kotlin)

#### 更多自動推斷類型的情況

新的推斷演算法會推斷許多情況下的類型，在舊演算法中，您需要明確指定類型。
例如，在以下範例中，lambda 參數 `it` 的類型已正確推斷為 `String?`：

```kotlin

val rulesMap: Map<String, (String?) `->` Boolean> = mapOf(
    "weak" to { it != null },
    "medium" to { !it.isNullOrBlank() },
    "strong" to { it != null && "^[a-zA-Z0-9]+$".toRegex().matches(it) }
)

fun main() {
    println(rulesMap.getValue("weak")("abc!"))
    println(rulesMap.getValue("strong")("abc"))
    println(rulesMap.getValue("strong")("abc!"))
}
```

在 Kotlin 1.3 中，您需要引入明確的 lambda 參數，或將 `to` 替換為具有
明確泛型引數的 `Pair` 建構函式才能使其運作。

#### Lambda 最後一個運算式的智慧轉換

在 Kotlin 1.3 中，除非您指定預期的類型，否則 lambda 內部的最後一個運算式不會進行智慧轉換。 因此，在
以下範例中，Kotlin 1.3 會將 `String?` 推斷為 `result` 變數的類型：

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

在 Kotlin 1.4 中，由於新的推斷演算法，lambda 內部的最後一個運算式會進行智慧轉換，而此新的、
更精確的類型用於推斷產生的 lambda 類型。 因此，`result` 變數的類型會變成 `String`。

在 Kotlin 1.3 中，您通常需要新增明確的轉換（`!!` 或類型轉換，例如 `as String`）才能使這些情況運作，
現在這些轉換已變得不必要。

#### 可呼叫參考的智慧轉換

在 Kotlin 1.3 中，您無法存取智慧轉換類型的成員參考。 現在在 Kotlin 1.4 中，您可以：

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

fun perform(animal: Animal) {
    val kFunction: KFunction<*> = when (animal) {
        is Cat `->` animal::meow
        is Dog `->` animal::woof
    }
    kFunction.call()
}

fun main() {
    perform(Cat())
}
```

在 animal 變數已智慧轉換為特定類型 `Cat` 與 `Dog` 之後，您可以使用不同的成員參考 `animal::meow` 與 `animal::woof`。 在類型檢查之後，您可以存取對應於子類型的成員參考。

#### 委派屬性的更好推斷

在分析遵循 `by` 關鍵字的委派運算式時，不會考慮委派屬性的類型。 例如，以下程式碼之前無法編譯，但現在編譯器會正確地將 `old` 與 `new` 參數的類型推斷為 `String?`：

```kotlin
import kotlin.properties.Delegates

fun main() {
    var prop: String? by Delegates.observable(null) { p, old, new `->`
        println("$old → $new")
    }
    prop = "abc"
    prop = "xyz"
}
```

#### 具有不同引數的 Java 介面的 SAM 轉換

Kotlin 從一開始就支援 Java 介面的 SAM 轉換，但有一種情況不受支援，
當使用現有的 Java 程式庫時，這有時很煩人。 如果您呼叫採用兩個 SAM 介面作為參數的 Java 方法，則兩個引數都需要是 lambda 或規則物件。 您無法將一個引數作為 lambda 傳遞，並將另一個引數作為物件傳遞。

新的演算法修正了這個問題，您可以隨時傳遞 lambda 來取代 SAM 介面，
這就是您自然會期望它運作的方式。

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

在 Kotlin 1.4 中，您可以在 Kotlin 中使用 Java SAM 介面，並對其套用 SAM 轉換。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

在 Kotlin 1.3 中，您必須在 Java 程式碼中宣告上述函式 `foo` 才能執行 SAM 轉換。

### 統一後端與可擴充性

在 Kotlin 中，我們有三個後端會產生可執行檔：Kotlin/JVM、Kotlin/JS 與 Kotlin/Native。 Kotlin/JVM 與 Kotlin/JS
不共用太多程式碼，因為它們是彼此獨立開發的。 Kotlin/Native 基於圍繞 Kotlin 程式碼的中繼表示法 (IR) 建構的新
基礎結構。

我們現在正在將 Kotlin/JVM 與 Kotlin/JS 移轉至相同的 IR。 因此，所有三個後端
都共用許多邏輯並具有統一的管線。 這可讓我們針對所有平台僅實作大多數功能、最佳化與錯誤修正一次。 這兩個新的基於 IR 的後端都處於 [Alpha](components-stability) 階段。

通用後端基礎結構也為多平台編譯器擴充功能開啟了大門。 您將能夠插入
管線並新增自訂處理與轉換，這將自動適用於所有平台。

我們鼓勵您使用目前處於 Alpha 階段的 [JVM IR](#new-jvm-ir-backend) 與 [JS IR](#new-js-ir-backend) 後端，並
與我們分享您的意見反應。

## Kotlin/JVM

Kotlin 1.4.0 包含許多 JVM 專用改進，例如：

* [新的 JVM IR 後端](#new-jvm-ir-backend)
* [用於在介面中產生預設方法的新模式](#new-modes-for-generating-default-methods)
* [用於空值檢查的統一例外狀況類型](#unified-exception-type-for-null-checks)
* [JVM 位元組碼中的類型註釋](#type-annotations-in-the-jvm-bytecode)

### 新的 JVM IR 後端

除了 Kotlin/JS 之外，我們還正在將 Kotlin/JVM 移轉至[統一 IR 後端](#unified-backends-and-extensibility)，
這可讓我們針對所有平台僅實作大多數功能與錯誤修正一次。 您還可以透過
建立適用於所有平台的多平台擴充功能從中受益。

Kotlin 1.4.0 尚未提供此類擴充功能的公開 API，但我們正在與我們的合作夥伴密切合作，
包括 [Jetpack Compose](https://developer.android.com/jetpack/compose)，他們已經在使用我們的新後端建置他們的編譯器外掛程式。

我們鼓勵您試用目前處於 Alpha 階段的 Kotlin/JVM 後端，並將任何問題與功能要求提交至我們的 [issue tracker](https://youtrack.jetbrains.com/issues/KT)。
這將協助我們統一編譯器管線，並更快地將編譯器擴充功能（例如 Jetpack Compose）帶給 Kotlin 社群。

若要啟用新的 JVM IR 後端，請在您的 Gradle 建置腳本中指定額外的編譯器選項：

```kotlin
kotlinOptions.useIR = true
```

:::note
如果您[啟用 Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en)，您將會自動
選擇加入新的 JVM 後端，而無需在 `kotlinOptions` 中指定編譯器選項。

:::

使用命令列編譯器時，請新增編譯器選項 `-Xuse-ir`。

:::note
只有在您啟用新的後端時，您才能使用由新的 JVM IR 後端編譯的程式碼。 否則，您會收到錯誤。
考慮到這一點，我們不建議程式庫作者在生產環境中切換到新的後端。

:::

### 用於產生預設方法的新模式

將 Kotlin 程式碼編譯為目標 JVM 1.8 及以上版本時，您可以將 Kotlin 介面的非抽象方法編譯為
Java 的 `default` 方法。 為此，有一種機制包含 `@JvmDefault` 註釋，用於標記
這些方法，以及 `-Xjvm-default` 編譯器選項，用於啟用此註釋的處理。

在 1.4.0 中，我們新增了一種產生預設方法的新模式：`-Xjvm-default=all` 會將 Kotlin
介面的*所有*非抽象方法編譯為 `default` Java 方法。 為了與使用在沒有 `default` 的情況下編譯介面的程式碼相容，
我們還新增了 `all-compatibility` 模式。

如需關於 Java 互通性中預設方法的更多資訊，請參閱[互通性文件](java-to-kotlin-interop#default-methods-in-interfaces)與
[這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 用於空值檢查的統一例外狀況類型

從 Kotlin 1.4.0 開始，所有執行階段空值檢查都會擲回 `java.lang.NullPointerException`，而不是 `KotlinNullPointerException`、
`IllegalStateException`、`IllegalArgumentException` 與 `TypeCastException`。 這適用於：`!!` 運算子、方法前言中的參數
空值檢查、平台類型運算式空值檢查，以及具有不可為空值類型的 `as` 運算子。
這不適用於 `lateinit` 空值檢查與明確的程式庫函式呼叫，例如 `checkNotNull` 或 `requireNotNull`。

此變更增加了 Kotlin 編譯器或各種類型的位元組碼處理工具（例如 Android [R8 最佳化工具](https://developer.android.com/studio/build/shrink-code)）可以執行的可能空值檢查最佳化次數。

請注意，從開發人員的角度來看，事情不會改變太多：Kotlin 程式碼會使用
與之前相同的錯誤訊息擲回例外狀況。 例外狀況的類型會變更，但傳遞的資訊保持不變。

### JVM 位元組碼中的類型註釋

Kotlin 現在可以在 JVM 位元組碼（目標版本 1.8+）中產生類型註釋，以便它們在執行階段於 Java 反射中可用。
若要在位元組碼中發出類型註釋，請遵循以下步驟：

1. 確定您宣告的註釋具有適當的註釋目標（Java 的 `ElementType.TYPE_USE` 或 Kotlin 的
`AnnotationTarget.TYPE`）與保留（`AnnotationRetention.RUNTIME`）。
2. 將註釋類別宣告編譯為 JVM 位元組碼目標版本 1.8+。 您可以使用 `-jvm-target=1.8`
編譯器選項來指定它。
3. 將使用註釋的程式碼編譯為 JVM 位元組碼目標版本 1.8+ (`-jvm-target=1.8`)，並新增
`-Xemit-jvm-type-annotations` 編譯器選項。

請注意，標準程式庫中的類型註釋目前不會在位元組碼中發出，因為標準程式庫是使用
目標版本 1.6 編譯的。

到目前為止，僅支援基本案例：

- 方法參數、方法傳回類型與屬性類型上的類型註釋；
- 類型引數的恆定投影，例如 `Smth<@Ann Foo>`、`Array<@Ann Foo>`。

在以下範例中，`String` 類型上的 `@Foo` 註釋可以發出到位元組碼，然後由
程式庫程式碼使用：

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

`kotlin.js` Gradle 外掛程式隨附調整過的 Gradle DSL，它提供了許多新的組態選項，並且更緊密地與 `kotlin-multiplatform` 外掛程式使用的 DSL 對齊。 一些影響最大的變更包括：

- 透過 `binaries.executable()` 明確切換以建立可執行檔。 在[此處](js-project-setup#execution-environments)深入瞭解[執行 Kotlin/JS 及其環境]。
- 透過 `cssSupport` 從 Gradle 組態內設定 webpack 的 CSS 與樣式載入器。 在[此處](js-project-setup#css)深入瞭解[使用 CSS 與樣式載入器]。
- 改善 npm 依賴項的管理，具有強制版本號碼或 [semver](https://docs.npmjs.com/about-semantic-versioning) 版本範圍，以及使用 `devNpm`、`optionalNpm` 與 `peerNpm` 支援 _development_、_peer_ 與 _optional_ npm 依賴項。 [在[此處](js-project-setup#npm-dependencies)深入瞭解直接從 Gradle 管理 npm 封裝的依賴項]。
- 更強大的 [Dukat](https://github.com/Kotlin/dukat) 整合，Kotlin 外部宣告的產生器。 外部宣告現在可以在建置時產生，或可以透過 Gradle 任務手動產生。

### 新的 JS IR 後端

[Kotlin/JS 的 IR 後端](js-ir-compiler)目前具有 [Alpha](components-stability) 穩定性，它提供了一些特定於 Kotlin/JS 目標的新功能，這些功能著重於透過無效程式碼移除來減小產生的程式碼大小，並改善與 JavaScript 與 TypeScript 的互通性等等。

若要啟用 Kotlin/JS IR 後端，請在您的 `gradle.properties` 中設定金鑰 `kotlin.js.compiler=ir`，或將 `IR` 編譯器類型傳遞至 Gradle 建置腳本的 `js` 函式：

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

如需關於如何設定新後端的更詳細資訊，請查看 [Kotlin/JS IR 編譯器文件](js-ir-compiler)。

透過新的 [@JsExport](js-to-kotlin-interop#jsexport-annotation) 註釋以及從 Kotlin 程式碼**[產生 TypeScript 定義](js-ir-compiler#preview-generation-of-typescript-declaration-files-d-ts)** 的能力，Kotlin/JS IR 編譯器後端改善了 JavaScript 與 TypeScript 的互通性。 這也讓將 Kotlin/JS 程式碼與現有工具整合、建立**混合應用程式**，以及在多平台專案中利用程式碼共用功能變得更容易。

[深入瞭解 Kotlin/JS IR 編譯器後端中的可用功能](js-ir-compiler)。

## Kotlin/Native

在 1.4.0 中，Kotlin/Native 獲得了大量新功能與改進，包括：

* [支援 Swift 與 Objective-C 中的暫停函式](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [預設啟用 Objective-C 泛型支援](#objective-c-generics-support-by-default)
* [Objective-C/Swift 互通性中的例外狀況處理](#exception-handling-in-objective-c-swift-interop)
* [預設在 Apple 目標上產生發佈 .dSYM](#generate-release-dsyms-on-apple-targets-by-default)
* [效能改進](#performance-improvements)
* [簡化 CocoaPods 依賴項的管理](#simplified-management-of-cocoapods-dependencies)

### 支援 Swift 與 Objective-C 中的 Kotlin 暫停函式

在 1.4.0 中，我們新增了對 Swift 與 Objective-C 中暫停函式的基本支援。 現在，當您將 Kotlin 模組
編譯為 Apple 架構時，暫停函式可以在其中作為具有回呼的函式使用（Swift/Objective-C 術語中的 `completionHandler`）。 當您在產生的架構標頭中有這些函式時，您可以從您的 Swift 或 Objective-C 程式碼呼叫它們，甚至覆寫它們。

例如，如果您撰寫這個 Kotlin 函式：

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

[深入瞭解在 Swift 與 Objective-C 中使用暫停函式](native-objc-interop)。

### 預設啟用 Objective-C 泛型支援

先前版本的 Kotlin 在 Objective-C 互通性中提供了泛型的實驗性支援。 從 1.4.0 開始，Kotlin/Native
預設使用 Kotlin 程式碼中的泛型產生 Apple 架構。 在某些情況下，這可能會中斷現有的 Objective-C
或 Swift 程式碼，從而呼叫 Kotlin 架構。 若要讓架構標頭在沒有泛型的情況下撰寫，請新增 `-Xno-objc-generics` 編譯器選項。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.m