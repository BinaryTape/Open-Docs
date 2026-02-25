[//]: # (title: Kotlin 用於競賽程式設計)

本教學專為先前未使用過 Kotlin 的競賽程式設計開發者，以及先前未參加過任何競賽程式設計活動的 Kotlin 開發者而設計。本教學假設讀者具備相應的程式設計技能。

[競賽程式設計](https://en.wikipedia.org/wiki/Competitive_programming)是一項智力運動，參賽者需在嚴格的限制下編寫程式來解決精確指定的演算法問題。問題的範圍從任何軟體開發者都能解決且只需少量程式碼即可獲得正確解的簡單問題，到需要特殊演算法、資料結構知識和大量練習的複雜問題皆有。雖然 Kotlin 並非專門為競賽程式設計而設計，但它意外地非常適合此領域，它減少了程式設計師在處理程式碼時通常需要編寫和閱讀的樣板程式碼數量，幾乎達到了動態語言指令碼語言提供的程度，同時又具備靜態型別語言的工具支援和效能。

有關如何在 IntelliJ IDEA 中建立 Kotlin 專案的更多資訊，請參閱[建立主控台應用程式](jvm-get-started.md)教學。在競賽程式設計中，通常會建立一個專案，並將每個問題的解法寫在單個程式碼檔案中。

## 簡單範例：Reachable Numbers 問題

讓我們來看一個具體的例子。

[Codeforces](https://codeforces.com/) 第 555 輪（Round 555）是針對 Division 3 舉行的，這意味著其中的問題適合任何開發人員嘗試。你可以使用[此連結](https://codeforces.com/contest/1157)來閱讀這些問題。該題目集中最簡單的問題是 [Problem A: Reachable Numbers](https://codeforces.com/contest/1157/problem/A)。它要求實作問題敘述中描述的一個簡單演算法。

我們首先建立一個任意名稱的 Kotlin 原始碼檔案來開始解決它，例如 `A.kt`。首先，你需要實作問題敘述中指定的函式：

讓我們以下面的方式定義一個函式 f(x)：我們將 x 加 1，然後，當結果數字中至少有一個尾隨零時，我們移除該零。

Kotlin 是一門務實且不預設立場的語言，支援命令式和函式式程式設計風格，而不會強迫開發者選擇其中一種。你可以使用諸如 [尾端遞迴（tail recursion）](functions.md#tail-recursive-functions) 等 Kotlin 特性，以函式式風格實作函式 `f`：

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

或者，你可以使用傳統的 [while 迴圈](control-flow.md)和在 Kotlin 中以 [var](basic-syntax.md#variables) 表示的可變變數，來編寫函式 `f` 的命令式實作：

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

由於型別推論的廣泛使用，Kotlin 中的型別在許多地方是可選的，但每個宣告在編譯時仍然具有明確定義的靜態型別。

現在，剩下的就是編寫 `main` 函式來讀取輸入，並實作問題敘述要求的演算法其餘部分——計算對標準輸入中給出的初始數字 `n` 重複套用函式 `f` 時，所產生的不同整數的數量。

預設情況下，Kotlin 執行於 JVM，並提供對豐富且高效的集合庫的直接存取，其中包括通用集合和資料結構，例如動態大小陣列（`ArrayList`）、基於雜湊的映射和集合（`HashMap`/`HashSet`）、基於樹的有序映射和集合（`TreeMap`/`TreeSet`）。使用整數雜湊集合來追蹤套用函式 `f` 時已經到達的值，該問題解法的直觀命令式版本如下所示：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // 從輸入讀取整數
    val reached = HashSet<Int>() // 一個可變雜湊集合 
    while (reached.add(n)) n = f(n) // 反覆運算函式 f
    println(reached.size) // 將答案列印至輸出
}
```

在競賽程式設計中，不需要處理格式錯誤的輸入。競賽程式設計中的輸入格式總是精確指定的，實際輸入不會偏離問題敘述中的輸入規範。這就是為什麼你可以使用 Kotlin 的 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函式。它會斷言輸入字串存在，否則會拋出異常。同樣地，如果輸入字串不是整數，[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 函式也會拋出異常。

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 從輸入讀取整數
    val reached = HashSet<Int>() // 一個可變雜湊集合 
    while (reached.add(n)) n = f(n) // 反覆運算函式 f
    println(reached.size) // 將答案列印至輸出
}
```

請注意在 [readLine()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 函式呼叫後使用的 Kotlin [null 斷言運算子](null-safety.md#not-null-assertion-operator) `!!`。Kotlin 的 `readLine()` 函式被定義為回傳 [可空引用類型](null-safety.md#nullable-types-and-non-nullable-types) `String?`，並在輸入結束時回傳 `null`，這明確地迫使開發者處理缺少輸入的情況。

在競賽程式設計中，不需要處理格式錯誤的輸入。在競賽程式設計中，輸入格式總是精確指定的，實際輸入不會偏離問題敘述中的輸入規範。這就是 null 斷言運算子 `!!` 本質上所做的事情——它斷言輸入字串存在，否則拋出異常。同樣地，還有 [String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)。

</tab>
</tabs>

所有的線上競賽程式設計活動都允許使用預先編寫的程式碼，因此你可以定義自己的針對競賽程式設計設計的工具函式程式庫，使你的實際解法程式碼更易於閱讀和編寫。然後，你可以將這些程式碼用作解法的範本。例如，你可以定義以下輔助函式來讀取競賽程式設計中的輸入：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 字串行
private fun readInt() = readStr().toInt() // 單個整數
// 類似地處理你在解法中會使用的其他型別
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 字串行
private fun readInt() = readStr().toInt() // 單個整數
// 類似地處理你在解法中會使用的其他型別
```

</tab>
</tabs>

請注意這裡 `private` [存取修飾詞](visibility-modifiers.md) 的使用。雖然可見性修飾詞的概念在競賽程式設計中完全不重要，但它允許你在同一個套件中放置多個基於相同範本的解法檔案，而不會因為公共宣告衝突而產生錯誤。

## 函式式運算子範例：Long Number 問題

對於更複雜的問題，Kotlin 豐富的集合函式式操作程式庫就派上了用場，它可以最大限度地減少樣板程式碼，並將程式碼轉變為線性的、由上而下且由左至右的流暢資料轉換管線。例如，[Problem B: Long Number](https://codeforces.com/contest/1157/problem/B) 問題需要實作一個簡單的貪婪演算法，而使用這種風格編寫時，甚至不需要單個可變變數：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    // 讀取輸入
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // 定義區域函式 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪婪地尋找起始和結束索引
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 組合並編寫答案
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
    // 定義區域函式 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪婪地尋找起始和結束索引
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 組合並編寫答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

在這段精簡的程式碼中，除了集合轉換之外，你還可以看到諸如區域函式和 [elvis 運算子](null-safety.md#elvis-operator) `?:` 等便利的 Kotlin 特性，它們允許使用簡潔且具備可讀性的運算式（如 `.takeIf { it >= 0 } ?: s.length`）來表達像「如果是正數則取該值，否則使用長度」之類的 `idioms`。不過，在 Kotlin 中建立額外的可變變數並以命令式風格表達相同的程式碼也完全沒有問題。

為了讓讀取這類競賽程式設計任務中的輸入更加簡潔，你可以使用以下輔助輸入讀取函式列表：

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及更高版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 字串行
private fun readInt() = readStr().toInt() // 單個整數
private fun readStrings() = readStr().split(" ") // 字串列表
private fun readInts() = readStrings().map { it.toInt() } // 整數列表
```

</tab>
<tab title="早期版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 字串行
private fun readInt() = readStr().toInt() // 單個整數
private fun readStrings() = readStr().split(" ") // 字串列表
private fun readInts() = readStrings().map { it.toInt() } // 整數列表
```

</tab>
</tabs>

有了這些幫助程式，讀取輸入的部分變得更加簡單，逐行緊隨問題敘述中的輸入規範：

```kotlin
// 讀取輸入
val n = readInt()
val s = readStr()
val fl = readInts()
```

請注意，在競賽程式設計中，通常會給變數起比工業級程式設計實務中更短的名稱，因為程式碼只需編寫一次，之後不再維護。然而，這些名稱通常仍具備助記性——`a` 用於陣列，`i`、`j` 等用於索引，`r` 和 `c` 用於表格中的行號和列號，`x` 和 `y` 用於座標，依此類推。保持與問題敘述中給出的輸入資料相同的名稱會更容易。然而，更複雜的問題需要更多的程式碼，這會導致使用更長且能自我解釋的變數和函式名稱。

## 更多技巧與提示

競賽程式設計問題通常有如下輸入：

輸入的第一行包含兩個整數 `n` 和 `k`

在 Kotlin 中，可以使用整數列表的 [解構宣告](destructuring-declarations.md) 簡潔地解析此行：

```kotlin
val (n, k) = readInts()
```

使用 JVM 的 `java.util.Scanner` 類別來解析結構化程度較低的輸入格式可能很誘人。Kotlin 的設計目標是與 JVM 程式庫良好地互通，因此在 Kotlin 中使用它們感覺非常自然。但是請注意，`java.util.Scanner` 極其緩慢。事實上，它慢到用它解析 10<sup>5</sup> 或更多整數可能無法在典型的 2 秒時間限制內完成，而簡單的 Kotlin `split(" ").map { it.toInt() }` 卻可以處理。

在 Kotlin 中編寫輸出通常很直觀，只需呼叫 [println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 並使用 Kotlin 的 [字串範本](strings.md#string-templates)。然而，當輸出包含大約 10<sup>5</sup> 行或更多時必須小心。發出這麼多 `println` 呼叫太慢了，因為 Kotlin 中的輸出在每一行之後都會自動刷新。從陣列或列表編寫多行的更快方法是使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函式，並以 `"
"` 作為分隔符號，如下所示：

```kotlin
println(a.joinToString("
")) // 將陣列/列表的每個元素列印在單獨的一行
```

## 學習 Kotlin

Kotlin 很容易學習，特別是對於那些已經了解 Java 的人來說。針對軟體開發者的 Kotlin 基本語法簡短介紹可以直接在網站的參考章節中找到，從 [基本語法](basic-syntax.md) 開始。

IDEA 內建了 [Java-to-Kotlin 轉換器](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)。熟悉 Java 的人可以用它來學習相應的 Kotlin 語法結構，但它並不完美，仍然值得去熟悉 Kotlin 並學習 [Kotlin idioms](idioms.md)。

研究 Kotlin 語法和 Kotlin 標準庫 API 的一個絕佳資源是 [Kotlin Koans](koans.md)。