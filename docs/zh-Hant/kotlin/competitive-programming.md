[//]: # (title: Kotlin 於競技程式設計)

本教學課程是為以前沒有使用過 Kotlin 的競技程式設計師，以及以前沒有參加過任何競技程式設計活動的 Kotlin 開發者所設計的。它假設讀者具備相應的程式設計技能。

[競技程式設計](https://en.wikipedia.org/wiki/Competitive_programming)是一項智力運動，參賽者編寫程式來解決在嚴格限制內精確指定的演算法問題。問題範圍可以從任何軟體開發者都能解決且只需少量程式碼即可獲得正確解決方案的簡單問題，到需要特殊演算法、資料結構和大量練習的複雜問題。儘管並非專為競技程式設計而設計，Kotlin 卻恰好非常適合這個領域，它將程式設計師在編寫和閱讀程式碼時所需的典型樣板程式碼量減少到幾乎與動態型別的腳本語言所提供的水平，同時又擁有靜態型別語言的工具和效能。

請參閱 [開始使用 Kotlin/JVM](jvm-get-started.md) 了解如何設定 Kotlin 的開發環境。在競技程式設計中，通常會建立一個單一專案，每個問題的解決方案都寫在一個原始碼檔案中。

## 簡單範例：可達數字問題

讓我們來看一個具體的範例。

[Codeforces](https://codeforces.com/) Round 555 於 4 月 26 日為第三組舉行，這表示它有適合任何開發者嘗試的問題。您可以使用 [這個連結](https://codeforces.com/contest/1157) 來閱讀這些問題。該集合中最簡單的問題是 [問題 A：可達數字](https://codeforces.com/contest/1157/problem/A)。它要求實作問題陳述中描述的一個直接的演算法。

我們將透過建立一個任意名稱的 Kotlin 原始碼檔案來開始解決它。`A.kt` 即可。首先，您需要實作問題陳述中指定的函式，如下所示：

讓我們以這種方式來表示函式 f(x)：我們將 x 加 1，然後，只要結果數字中至少有一個尾隨零，我們就移除該零。

Kotlin 是一種務實且不帶偏見的語言，支援指令式和函式式程式設計風格，而不強迫開發者偏向其中任何一種。您可以以函式式風格實作函式 `f`，使用諸如 [尾遞迴](functions.md#tail-recursive-functions) 等 Kotlin 功能：

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

或者，您可以使用傳統的 [while 迴圈](control-flow.md) 和在 Kotlin 中使用 [var](basic-syntax.md#variables) 宣告的可變變數來編寫函式 `f` 的指令式實作：

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

由於廣泛使用型別推斷，Kotlin 中的型別在許多地方都是可選的，但每個宣告仍具有明確定義的靜態型別，在編譯時已知。

現在，剩下的就是編寫主函式，它讀取輸入並實作問題陳述中要求的其餘演算法 — 計算在重複將函式 `f` 應用於標準輸入中給定的初始數字 `n` 時產生的不同整數的數量。

預設情況下，Kotlin 在 JVM 上執行，並可以直接存取豐富且高效的集合函式庫，其中包含通用集合和資料結構，例如動態大小的陣列 (`ArrayList`)、基於雜湊的映射和集合 (`HashMap`/`HashSet`)、基於樹狀結構的有序映射和集合 (`TreeMap`/`TreeSet`)。使用整數雜湊集合來追蹤在應用函式 `f` 時已達到的值，問題解決方案的直接指令式版本可以如下所示編寫：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // 從輸入讀取整數
    val reached = HashSet<Int>() // 一個可變的雜湊集合 
    while (reached.add(n)) n = f(n) // 迭代函式 f
    println(reached.size) // 將答案輸出
}
```

在競技程式設計中，不需要處理格式錯誤的輸入情況。輸入格式在競技程式設計中總是精確指定的，實際輸入不能偏離問題陳述中的輸入規格。這就是為什麼您可以使用 Kotlin 的 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函式。它斷言輸入字串存在，否則會拋出例外。同樣地，[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 函式如果輸入字串不是整數，則拋出例外。

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 從輸入讀取整數
    val reached = HashSet<Int>() // 一個可變的雜湊集合 
    while (reached.add(n)) n = f(n) // 迭代函式 f
    println(reached.size) // 將答案輸出
}
```

請注意在 [readLine()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 函式呼叫後使用 Kotlin 的 [空值斷言運算子](null-safety.md#not-null-assertion-operator) `!!`。Kotlin 的 `readLine()` 函式被定義為返回一個 [可空型別](null-safety.md#nullable-types-and-non-nullable-types) `String?`，並在輸入結束時返回 `null`，這明確地強制開發者處理輸入缺失的情況。

在競技程式設計中，不需要處理格式錯誤的輸入情況。在競技程式設計中，輸入格式總是精確指定的，實際輸入不能偏離問題陳述中的輸入規格。這就是空值斷言運算子 `!!` 本質上所做的 — 它斷言輸入字串存在，否則會拋出例外。同樣地，[String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 也是如此。

</tab>
</tabs>

所有線上競技程式設計活動都允許使用預先編寫的程式碼，因此您可以定義您自己的專為競技程式設計量身打造的工具函式庫，讓您的實際解決方案程式碼更容易閱讀和編寫。然後您可以將此程式碼用作解決方案的樣板。例如，您可以定義以下輔助函式用於在競技程式設計中讀取輸入：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 字串行
private fun readInt() = readStr().toInt() // 單一整數
// 解決方案中使用的其他型別也類似
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 字串行
private fun readInt() = readStr().toInt() // 單一整數
// 解決方案中使用的其他型別也類似
```

</tab>
</tabs>

請注意這裡使用 `private` [可見性修飾符](visibility-modifiers.md)。儘管可見性修飾符的概念對競技程式設計完全不重要，但它允許您將基於相同樣板的多個解決方案檔案放在一起，而不會因為同一套件中公開宣告的衝突而產生錯誤。

## 函式操作符範例：長數字問題

對於更複雜的問題，Kotlin 龐大的集合函式操作函式庫有助於最大限度地減少樣板程式碼，並將程式碼轉變為線性、從上到下、從左到右的流暢資料轉換流程。例如，[問題 B：長數字](https://codeforces.com/contest/1157/problem/B) 問題採用一個簡單的貪婪演算法來實作，並且可以用這種風格編寫，無需任何可變變數：

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
    // 貪婪地找到第一個和最後一個索引
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
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    // 讀取輸入
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // 定義局部函式 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪婪地找到第一個和最後一個索引
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

在這段緊湊的程式碼中，除了集合轉換之外，您還可以看到實用的 Kotlin 功能，例如局部函式和 [Elvis 運算子](null-safety.md#elvis-operator) `?:`，它們允許使用簡潔且可讀的表達式（例如 `.takeIf { it >= 0 } ?: s.length`）來表達 [慣用語](idioms.md)，例如「如果值為正則取該值，否則使用長度」，但 Kotlin 完全可以創建額外的可變變數並以指令式風格表達相同的程式碼。

為了讓此類競技程式設計任務中的輸入讀取更簡潔，您可以使用以下輔助輸入讀取函式列表：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 字串行
private fun readInt() = readStr().toInt() // 單一整數
private fun readStrings() = readStr().split(" ") // 字串列表
private fun readInts() = readStrings().map { it.toInt() } // 整數列表
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 字串行
private fun readInt() = readStr().toInt() // 單一整數
private fun readStrings() = readStr().split(" ") // 字串列表
private fun readInts() = readStrings().map { it.toInt() } // 整數列表
```

</tab>
</tabs>

有了這些輔助函式，讀取輸入的程式碼部分變得更簡單，逐行緊密地遵循問題陳述中的輸入規格：

```kotlin
// 讀取輸入
val n = readInt()
val s = readStr()
val fl = readInts()
```

請注意，在競技程式設計中，習慣上給變數較短的名稱，這與產業程式設計實踐中典型的做法不同，因為程式碼只需編寫一次，之後無需維護。然而，這些名稱通常仍然具有助記性 — `a` 用於陣列，`i`、`j` 等用於索引，`r` 和 `c` 用於表格中的行和列號，`x` 和 `y` 用於座標等等。最好保持輸入資料的名稱與問題陳述中給定的名稱相同。然而，更複雜的問題需要更多的程式碼，這導致使用更長、更具自我解釋性的變數和函式名稱。

## 更多提示與技巧

競技程式設計問題的輸入通常如下所示：

輸入的第一行包含兩個整數 `n` 和 `k`

在 Kotlin 中，這行可以使用以下語句從整數列表中利用 [解構宣告](destructuring-declarations.md) 簡潔地解析：

```kotlin
val (n, k) = readInts()
```

使用 JVM 的 `java.util.Scanner` 類別來解析非結構化輸入格式可能很誘人。Kotlin 旨在與 JVM 函式庫良好地互操作，因此它們在 Kotlin 中的使用感覺非常自然。然而，請注意 `java.util.Scanner` 非常慢。事實上，使用它解析 10^5 個或更多整數可能無法符合典型的 2 秒時間限制，而簡單的 Kotlin `split(" ").map { it.toInt() }` 就可以處理。

在 Kotlin 中寫入輸出通常很直接，可以使用 [println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 呼叫和 Kotlin 的 [字串樣板](strings.md#string-templates)。然而，當輸出包含 10^5 行或更多時，必須小心處理。發出如此多的 `println` 呼叫會太慢，因為 Kotlin 中的輸出在每行之後會自動沖刷（flush）。從陣列或列表中寫入多行的更快方法是使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函式並以 `"
"` 作為分隔符，如下所示：

```kotlin
println(a.joinToString("
")) // 陣列/列表的每個元素佔一行
```

## 學習 Kotlin

Kotlin 易於學習，特別是對於那些已經了解 Java 的人。軟體開發者學習 Kotlin 基本語法的簡短介紹可以直接在網站的參考資料區段找到，從 [基本語法](basic-syntax.md) 開始。

IDEA 內建了 [Java 轉 Kotlin 轉換器](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)。它可以供熟悉 Java 的人學習相應的 Kotlin 語法結構，但它並不完美，仍然值得熟悉 Kotlin 並學習 [Kotlin 慣用語](idioms.md)。

學習 Kotlin 語法和 Kotlin 標準函式庫 API 的絕佳資源是 [Kotlin Koans](koans.md)。