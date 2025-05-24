---
title: "Kotlin 於競技程式設計"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本教學課程專為之前未使用過 Kotlin 的競賽程式設計師和之前未參與任何競賽程式設計活動的 Kotlin 開發人員而設計。
本課程假定您已具備相應的程式設計技能。

[競賽程式設計](https://en.wikipedia.org/wiki/Competitive_programming)
是一種智力運動，參賽者編寫程式來解決在嚴格約束下精確指定的演算法問題。問題範圍從任何軟體開發人員都可以解決的簡單問題，並且只需要少量程式碼即可獲得正確的解決方案，到需要特殊演算法、資料結構和大量實踐知識的複雜問題。雖然 Kotlin 並非專為競賽程式設計而設計，但它恰好非常適合此領域，可以減少程式設計師在處理程式碼時需要編寫和閱讀的樣板程式碼的典型數量，幾乎達到動態類型腳本語言提供的水平，同時具有靜態類型語言的工具和效能。

請參閱[開始使用 Kotlin/JVM](jvm-get-started)，瞭解如何設定 Kotlin 的開發環境。在競賽程式設計中，通常會建立一個單一專案，並且每個問題的解決方案都會寫在單一原始碼檔案中。

## 簡單範例：Reachable Numbers 問題

讓我們看一個具體的例子。

[Codeforces](https://codeforces.com/)
第 555 輪比賽於 4 月 26 日為第 3 級別舉行，這意味著它有適合任何開發人員嘗試的問題。
您可以使用[此連結](https://codeforces.com/contest/1157)閱讀這些問題。
集合中最簡單的問題是
[問題 A：Reachable Numbers](https://codeforces.com/contest/1157/problem/A)。
它要求實現問題陳述中描述的簡單演算法。

我們將從建立一個具有任意名稱的 Kotlin 原始碼檔案開始解決它。`A.kt` 會很好。
首先，您需要實現問題陳述中指定的函式，如下所示：

讓我們以這樣的方式表示函式 f(x)：我們將 1 加到 x，然後，只要結果數字中至少有一個尾隨零，我們就刪除該零。

Kotlin 是一種務實且不帶偏見的語言，它支援命令式和函式程式設計風格，而不會將開發人員推向任何一種風格。您可以使用諸如[尾遞迴](functions#tail-recursive-functions)之類的 Kotlin 功能，以函式風格實現函式 `f`：

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

或者，您可以使用傳統的[while 迴圈](control-flow)和在 Kotlin 中用[var](basic-syntax#variables)表示的可變變數來編寫函式 `f` 的命令式實現：

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

由於廣泛使用類型推斷，Kotlin 中的類型在許多地方是可選的，但每個宣告仍然具有編譯時已知的明確定義的靜態類型。

現在，剩下的就是編寫 main 函式，該函式讀取輸入並實現問題陳述要求的其餘演算法 — 計算重複應用函式 `f` 到標準輸入中給定的初始數字 `n` 時產生的不同整數的數量。

預設情況下，Kotlin 在 JVM 上執行，並可以直接存取具有通用集合和資料結構（如動態大小的陣列 (`ArrayList`)）、基於雜湊的映射和集合 (`HashMap`/`HashSet`)、基於樹的有序映射和集合 (`TreeMap`/`TreeSet`)）的豐富而高效的集合庫。使用整數的雜湊集合來追蹤在應用函式 `f` 時已到達的值，可以編寫一個簡單的命令式版本的解決方案，如下所示：

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 及更高版本" default>

```kotlin
fun main() {
    var n = readln().toInt() // 從輸入讀取整數
    val reached = HashSet<Int>() // 一個可變雜湊集合
    while (reached.add(n)) n = f(n) // 迭代函式 f
    println(reached.size) // 將答案列印到輸出
}
```

在競賽程式設計中，無需處理格式錯誤的輸入。輸入格式始終在競賽程式設計中精確指定，並且實際輸入不能偏離問題陳述中的輸入規範。這就是為什麼您可以使用 Kotlin 的 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函式。它斷言輸入字串存在，否則會擲回例外。同樣，如果輸入字串不是整數，[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)函式會擲回例外。

</TabItem>
<TabItem value="kotlin-1-5" label="更早版本" default>

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 從輸入讀取整數
    val reached = HashSet<Int>() // 一個可變雜湊集合
    while (reached.add(n)) n = f(n) // 迭代函式 f
    println(reached.size) // 將答案列印到輸出
}
```

請注意在 [readLine()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 函式呼叫之後使用 Kotlin 的
[非空斷言運算子](null-safety#not-null-assertion-operator) `!!`。
Kotlin 的 `readLine()` 函式被定義為傳回一個
[可空類型](null-safety#nullable-types-and-non-nullable-types)
`String?` 並且在輸入結束時傳回 `null`，這明確地強制開發人員處理輸入遺失的情況。

在競賽程式設計中，無需處理格式錯誤的輸入。
在競賽程式設計中，輸入格式始終精確指定，並且實際輸入不能偏離問題陳述中的輸入規範。這就是非空斷言運算子 `!!` 實際上所做的事情 —
它斷言輸入字串存在，否則會擲回例外。同樣，
[String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)。

</TabItem>
</Tabs>

所有線上競賽程式設計活動都允許使用預先編寫的程式碼，因此您可以定義自己的實用函式庫，這些函式專為競賽程式設計而設計，以使您實際的解決方案程式碼更易於閱讀和編寫。然後，您將使用此程式碼作為解決方案的範本。例如，您可以定義以下輔助函式來讀取競賽程式設計中的輸入：

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 及更高版本" default>

```kotlin
private fun readStr() = readln() // 字串行
private fun readInt() = readStr().toInt() // 單個 int
// 對於您在解決方案中使用的其他類型也是如此
```

</TabItem>
<TabItem value="kotlin-1-5" label="更早版本" default>

```kotlin
private fun readStr() = readLine()!! // 字串行
private fun readInt() = readStr().toInt() // 單個 int
// 對於您在解決方案中使用的其他類型也是如此
```

</TabItem>
</Tabs>

請注意此處使用的 `private` [可見性修飾符](visibility-modifiers)。
雖然可見性修飾符的概念與競賽程式設計完全無關，
但它允許您在同一個套件中放置多個基於
相同範本的解決方案檔案，而不會因衝突的 public 宣告而產生錯誤。

## 函式運算子範例：Long Number 問題

對於更複雜的問題，Kotlin 廣泛的集合函式運算庫可以方便地最大限度地減少樣板程式碼，並將程式碼轉變為線性從上到下和從左到右的流暢資料轉換管道。例如，
[問題 B：Long Number](https://codeforces.com/contest/1157/problem/B)問題
需要一個簡單的貪婪演算法來實現，並且可以使用這種樣式編寫，而無需單個可變變數：

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 及更高版本" default>

```kotlin
fun main() {
    // 讀取輸入
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // 定義本地函式 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪婪地尋找第一個和最後一個索引
    val i = s.indexOfFirst { c `->` f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) `->` j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 組合並寫入答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c `->` f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</TabItem>
<TabItem value="kotlin-1-5" label="更早版本" default>

```kotlin
fun main() {
    // 讀取輸入
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // 定義本地函式 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪婪地尋找第一個和最後一個索引
    val i = s.indexOfFirst { c `->` f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) `->` j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 組合並寫入答案
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c `->` f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</TabItem>
</Tabs>

在這個密集的程式碼中，除了集合轉換之外，您還可以
看到 Kotlin 方便的功能，例如本地函式和
[Elvis 運算子](null-safety#elvis-operator) `?:`
允許表達
[慣用語](idioms)，例如「如果該值為正數則取該值，否則使用長度」，並且具有簡潔且可讀的
表達式，例如 `.takeIf { it >= 0 } ?: s.length`，但 Kotlin 完全可以建立其他可變
變數並以命令式風格表達相同的程式碼。

為了使競賽程式設計任務中讀取輸入更加簡潔，
您可以擁有以下輔助輸入讀取函式清單：

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 及更高版本" default>

```kotlin
private fun readStr() = readln() // 字串行
private fun readInt() = readStr().toInt() // 單個 int
private fun readStrings() = readStr().split(" ") // 字串清單
private fun readInts() = readStrings().map { it.toInt() } // int 清單
```

</TabItem>
<TabItem value="kotlin-1-5" label="更早版本" default>

```kotlin
private fun readStr() = readLine()!! // 字串行
private fun readInt() = readStr().toInt() // 單個 int
private fun readStrings() = readStr().split(" ") // 字串清單
private fun readInts() = readStrings().map { it.toInt() } // int 清單
```

</TabItem>
</Tabs>

有了這些輔助函式，用於讀取輸入的程式碼部分變得更簡單，緊密遵循問題陳述中逐行的輸入
規範：

```kotlin
// 讀取輸入
val n = readInt()
val s = readStr()
val fl = readInts()
```

請注意，在競賽程式設計中，習慣上給變數起比工業程式設計實踐中更短的名稱，因為程式碼只需編寫一次，之後就不再支援。
但是，這些名稱通常仍然是助記符 — `a` 代表陣列，
`i`、`j` 等代表索引，`r` 和 `c` 代表表格中的行號和列號，`x` 和 `y` 代表座標，依此類推。
對於輸入資料，保持與問題陳述中給定的名稱相同更容易。
但是，更複雜的問題需要更多程式碼，這會導致使用更長、自我解釋的
變數和函式名稱。

## 更多技巧和竅門

競賽程式設計問題通常具有如下所示的輸入：

輸入的第一行包含兩個整數 `n` 和 `k`

在 Kotlin 中，可以使用
[解構宣告](destructuring-declarations)
從整數清單中，使用以下語句簡潔地解析此行：

```kotlin
val (n, k) = readInts()
```

使用 JVM 的 `java.util.Scanner` 類別來解析結構較少的輸入格式可能很誘人。Kotlin 旨在與 JVM 庫良好地互操作，因此它們在 Kotlin 中的使用感覺非常自然。但是，請注意 `java.util.Scanner` 非常慢。事實上，它非常慢，以至於使用它解析 10<sup>5</sup> 或更多的整數可能不適合典型的 2 秒時限，而簡單的 Kotlin `split(" ").map { it.toInt() }` 可以處理。

使用
[println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html)
呼叫和使用 Kotlin 的
[字串範本](strings#string-templates)通常可以簡單地在 Kotlin 中寫入輸出。但是，當輸出包含約 10<sup>5</sup> 行或更多行時，必須小心。發出如此多的 `println` 呼叫太慢了，因為 Kotlin 中的輸出會在每行之後自動刷新。
從陣列或清單寫入多行的更快方法是使用
[joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函式
，其中 `"
"` 作為分隔符，如下所示：

```kotlin
println(a.joinToString("
")) // 陣列/清單的每個元素都佔據單獨的一行
```

## 學習 Kotlin

Kotlin 很容易學習，尤其是對於那些已經了解 Java 的人來說。
可以在網站的參考章節中直接找到針對軟體開發人員的 Kotlin 基本語法的簡短介紹，從[基本語法](basic-syntax)開始。

IDEA 具有內建的
[Java-to-Kotlin 轉換器](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)。
熟悉 Java 的人可以使用它來學習相應的 Kotlin 語法結構，但它並不完美，並且仍然值得熟悉 Kotlin 並學習
[Kotlin 慣用語](idioms)。

[Kotlin Koans](koans) 是一個學習 Kotlin 語法和 Kotlin 標準庫 API 的絕佳資源。