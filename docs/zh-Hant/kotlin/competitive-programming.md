[//]: # (title: Kotlin 於競技程式設計)

本教學專為從未使用過 Kotlin 的競技程式設計師，以及從未參與過任何競技程式設計活動的 Kotlin 開發者所設計。它假定讀者具備相應的程式設計技能。

[競技程式設計](https://en.wikipedia.org/wiki/Competitive_programming)是一種智力運動，參賽者在嚴格限制下撰寫程式來解決精確指定的演算法問題。問題可以從任何軟體開發者都能解決、只需少量程式碼即可獲得正確解答的簡單問題，到需要特殊演算法、資料結構和大量練習的複雜問題。儘管 Kotlin 並非專為競技程式設計而設計，但它恰好非常適合這個領域，它將程式設計師在處理程式碼時需要撰寫和閱讀的典型樣板程式碼數量，減少到幾乎與動態型別腳本語言所提供的水準，同時擁有靜態型別語言的工具鏈和效能。

請參閱 [Kotlin/JVM 入門](jvm-get-started.md)以了解如何設定 Kotlin 的開發環境。在競技程式設計中，通常只建立一個專案，每個問題的解決方案都寫在單一原始碼檔案中。

## 簡單範例：可達數字問題

讓我們來看一個具體的範例。

[Codeforces](https://codeforces.com/) 第 555 回合賽於 4 月 26 日為第三級別舉行，這表示它有適合任何開發者嘗試的問題。您可以使用[此連結](https://codeforces.com/contest/1157)來閱讀這些問題。其中最簡單的問題是[問題 A：可達數字](https://codeforces.com/contest/1157/problem/A)。它要求實作問題陳述中描述的一個直觀演算法。

我們將透過建立一個任意名稱的 Kotlin 原始碼檔案來開始解決它。`A.kt` 即可。
首先，您需要實作問題陳述中指定的函式：

我們將函式 f(x) 定義為：將 x 加 1，然後，只要結果數字中至少有一個尾隨零，就移除該零。

Kotlin 是一種務實且不帶偏見的語言，支援命令式和函數式程式設計風格，而不會偏向任何一種。您可以使用 Kotlin 的功能，例如[尾遞迴](functions.md#tail-recursive-functions)，以函數式風格實作函式 `f`：

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

或者，您可以使用傳統的 [`while` 迴圈](control-flow.md)和 Kotlin 中以 [`var`](basic-syntax.md#variables) 標示的可變變數，來撰寫函式 `f` 的命令式實作：

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

由於普遍使用型別推斷，Kotlin 中的型別在許多地方都是可選的，但每個宣告仍然具有在編譯時已知的定義明確的靜態型別。

現在，剩下的就是撰寫主函式，該函式讀取輸入並實作問題陳述要求的演算法其餘部分—計算重複將函式 `f` 應用於標準輸入中給定的初始數字 `n` 時所產生的不同整數數量。

預設情況下，Kotlin 執行於 JVM 上，並直接存取一個豐富且高效的集合函式庫，其中包含通用集合和資料結構，例如動態大小陣列 (`ArrayList`)、基於雜湊的映射和集合 (`HashMap`/`HashSet`)、基於樹狀結構的有序映射和集合 (`TreeMap`/`TreeSet`)。使用整數雜湊集合來追蹤應用函式 `f` 時已經達到的值，問題解決方案的直觀命令式版本可以如下所示：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // 從輸入讀取整數
    val reached = HashSet<Int>() // 一個可變雜湊集合
    while (reached.add(n)) n = f(n) // 迭代函式 f
    println(reached.size) // 將答案列印到輸出
}
```

在競技程式設計中無需處理格式錯誤的輸入。競技程式設計中的輸入格式總是精確指定的，實際輸入不能偏離問題陳述中的輸入規範。這就是為什麼您可以使用 Kotlin 的 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函式。它斷言輸入字串存在，否則拋出例外。同樣，[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 函式在輸入字串不是整數時拋出例外。

</tab>
<tab title="更早版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 從輸入讀取整數
    val reached = HashSet<Int>() // 一個可變雜湊集合
    while (reached.add(n)) n = f(n) // 迭代函式 f
    println(reached.size) // 將答案列印到輸出
}
```

請注意在 `readLine()` 函式呼叫之後使用 Kotlin 的[空值斷言運算子](null-safety.md#not-null-assertion-operator) `!!`。Kotlin 的 `readLine()` 函式定義為返回[可空型別](null-safety.md#nullable-types-and-non-nullable-types) `String?`，並在輸入結束時返回 `null`，這明確強制開發人員處理遺失輸入的情況。

在競技程式設計中無需處理格式錯誤的輸入。在競技程式設計中，輸入格式總是精確指定的，實際輸入不能偏離問題陳述中的輸入規範。這就是空值斷言運算子 `!!` 的本質—它斷言輸入字串存在，否則拋出例外。同樣，[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 亦是如此。

</tab>
</tabs>

所有線上競技程式設計活動都允許使用預先撰寫的程式碼，因此您可以定義自己的工具函式庫，這些函式專為競技程式設計量身定製，以使您的實際解決方案程式碼更容易閱讀和撰寫。然後，您將使用此程式碼作為解決方案的範本。例如，您可以定義以下輔助函式來讀取競技程式設計中的輸入：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 字串行
private fun readInt() = readStr().toInt() // 單一整數
// 類似於您在解決方案中使用的其他型別
```

</tab>
<tab title="更早版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 字串行
private fun readInt() = readStr().toInt() // 單一整數
// 類似於您在解決方案中使用的其他型別
```

</tab>
</tabs>

請注意這裡使用 `private` [可見性修飾符](visibility-modifiers.md)。雖然可見性修飾符的概念與競技程式設計完全不相關，但它允許您放置基於相同範本的多個解決方案檔案，而不會因為同一套件中衝突的公開宣告而產生錯誤。

## 函數式運算子範例：長數字問題

對於更複雜的問題，Kotlin 豐富的集合函數式操作函式庫非常方便，可以最大程度地減少樣板程式碼，並將程式碼轉換為線性、從上到下、從左到右的流暢資料轉換管道。例如，[問題 B：長數字](https://codeforces.com/contest/1157/problem/B)問題採用一個簡單的貪婪演算法來實作，並且可以使用這種風格撰寫，而無需單個可變變數：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    // 讀取輸入
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // 定義局部函式 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪婪地尋找第一個和最後一個索引
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 組成並寫入答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</tab>
<tab title="更早版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    // 讀取輸入
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // 定義局部函式 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪婪地尋找第一個和最後一個索引
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 組成並寫入答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

在這段緊湊的程式碼中，除了集合轉換之外，您還可以看到諸如局部函式和 [Elvis 運算子](null-safety.md#elvis-operator) `?:` 等便利的 Kotlin 功能，這些功能允許以簡潔且易讀的表達式（例如 `.takeIf { it >= 0 } ?: s.length`）來表達「如果值為正則取該值，否則使用長度」之類的[慣用法](idioms.md)，而且在 Kotlin 中建立額外的可變變數並以命令式風格表達相同的程式碼也完全沒問題。

為了使競技程式設計任務中的輸入讀取更簡潔，您可以提供以下輔助輸入讀取函式列表：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 字串行
private fun readInt() = readStr().toInt() // 單一整數
private fun readStrings() = readStr().split(" ") // 字串列表
private fun readInts() = readStrings().map { it.toInt() } // 整數列表
```

</tab>
<tab title="更早版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 字串行
private fun readInt() = readStr().toInt() // 單一整數
private fun readStrings() = readStr().split(" ") // 字串列表
private fun readInts() = readStrings().map { it.toInt() } // 整數列表
```

</tab>
</tabs>

有了這些輔助函式，讀取輸入的程式碼部分變得更簡單，緊密遵循問題陳述中的輸入規範逐行讀取：

```kotlin
// 讀取輸入
val n = readInt()
val s = readStr()
val fl = readInts()
```

請注意，在競技程式設計中，習慣上給變數較短的名稱，這與工業程式設計實踐中典型的做法不同，因為程式碼只需編寫一次，之後不再支援。然而，這些名稱通常仍然具有助記性——`a` 用於陣列，`i`、`j` 等用於索引，`r`、`c` 用於表格中的行號和列號，`x`、`y` 用於座標等等。將輸入資料的名稱與問題陳述中給定的名稱保持一致會更容易。然而，更複雜的問題需要更多程式碼，這會導致使用更長、更具自我解釋性的變數和函式名稱。

## 更多提示與技巧

競技程式設計問題的輸入通常像這樣：

輸入的第一行包含兩個整數 `n` 和 `k`

在 Kotlin 中，使用[解構宣告](destructuring-declarations.md)從整數列表，這行可以透過以下語句簡潔地解析：

```kotlin
val (n, k) = readInts()
```

使用 JVM 的 `java.util.Scanner` 類別來解析結構化程度較低的輸入格式可能很誘人。Kotlin 旨在與 JVM 函式庫良好互通，因此它們在 Kotlin 中的使用感覺相當自然。然而，請注意 `java.util.Scanner` 極其緩慢。事實上，用它解析 10<sup>5</sup> 或更多整數可能無法符合典型的 2 秒時間限制，而 Kotlin 簡單的 `split(" ").map { it.toInt() }` 就能處理。

在 Kotlin 中撰寫輸出通常很簡單，使用 [`println(...)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 呼叫和 Kotlin 的[字串模板](strings.md#string-templates)。但是，當輸出包含大約 10<sup>5</sup> 行或更多行時，必須注意。發出如此多的 `println` 呼叫會太慢，因為 Kotlin 中的輸出在每一行之後會自動刷新。從陣列或列表中撰寫多行的更快方法是使用 [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函式，並以 `"
"` 作為分隔符，如下所示：

```kotlin
println(a.joinToString("
")) // 陣列/列表的每個元素佔一行
```

## 學習 Kotlin

Kotlin 易於學習，尤其是對於那些已經了解 Java 的人。
關於軟體開發者 Kotlin 基本語法的簡要介紹，可以直接在網站的參考部分中找到，從[基本語法](basic-syntax.md)開始。

IDEA 內建了 [Java 轉 Kotlin 轉換器](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)。它可以用於熟悉 Java 的人來學習相應的 Kotlin 語法結構，但它並不完美，仍然值得熟悉 Kotlin 並學習 [Kotlin 慣用法](idioms.md)。

學習 Kotlin 語法和 Kotlin 標準函式庫 API 的一個絕佳資源是 [Kotlin Koans](koans.md)。