[//]: # (title: 以慣用 Kotlin 解決 Advent of Code 謎題)

[Advent of Code](https://adventofcode.com/) 是一個每年十二月舉行的活動，從十二月一日到十二月二十五日每天都會發布假日主題的謎題。經由 Advent of Code 創作者 [Eric Wastl](http://was.tl/) 的許可，我們將展示如何使用慣用 Kotlin 風格來解決這些謎題：

*   [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
*   [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
*   [](#advent-of-code-2022)
*   [](#advent-of-code-2021)
*   [](#advent-of-code-2020)

## 為 Advent of Code 做好準備

我們將帶您了解如何開始使用 Kotlin 解決 Advent of Code 挑戰的基本提示：

*   使用[此 GitHub 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)來建立專案
*   查看 Kotlin 開發者倡議者 Sebastian Aigner 的歡迎影片：

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="為 Advent of Code 2021 做好準備"/>

## Advent of Code 2022

### 第 1 天：卡路里計算

了解 [Kotlin Advent of Code 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)以及用於 Kotlin 中字串和集合的便捷函式，例如 [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html) 和 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)。了解擴充函式如何幫助您以優雅的方式組織您的解決方案。

*   在 [Advent of Code](https://adventofcode.com/2022/day/1) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 1 天 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### 第 2 天：剪刀石頭布

了解 Kotlin 中 `Char` 型別上的操作，了解 `Pair` 型別和 `to` 建構子如何與模式比對良好協同工作。了解如何使用 [`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 函式對自己的物件進行排序。

*   在 [Advent of Code](https://adventofcode.com/2022/day/2) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 2 天 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### 第 3 天：背包重整

了解 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 函式庫如何幫助您理解程式碼的效能特性。了解諸如 `intersect` 之類的集合操作如何幫助您選擇重疊資料，並查看相同解決方案不同實作之間的效能比較。

*   在 [Advent of Code](https://adventofcode.com/2022/day/3) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 3 天 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### 第 4 天：營地清理

了解 `infix` 和 `operator` 函式如何使您的程式碼更具表達力，以及 `String` 和 `IntRange` 型別的擴充函式如何輕鬆解析輸入。

*   在 [Advent of Code](https://adventofcode.com/2022/day/4) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 4 天 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### 第 5 天：堆放供應品

了解如何使用工廠函式建構更複雜的物件、如何使用正規表達式，以及雙端 [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 型別。

*   在 [Advent of Code](https://adventofcode.com/2022/day/5) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 5 天 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### 第 6 天：調整問題

使用 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 函式庫進行更深入的效能探究，比較相同解決方案的 16 種不同變體的特性。

*   在 [Advent of Code](https://adventofcode.com/2022/day/6) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 6 天 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### 第 7 天：設備上沒有剩餘空間

了解如何建模樹狀結構，並觀看程式化生成 Kotlin 程式碼的演示。

*   在 [Advent of Code](https://adventofcode.com/2022/day/7) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 7 天 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### 第 8 天：樹頂樹屋

了解 `sequence` 建構器實際應用，以及程式的初稿和慣用 Kotlin 解決方案之間可能有多大差異（特邀嘉賓 Roman Elizarov！）。

*   在 [Advent of Code](https://adventofcode.com/2022/day/8) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 8 天 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### 第 9 天：繩橋

了解 `run` 函式、標籤化回傳，以及諸如 `coerceIn` 或 `zipWithNext` 等便捷的標準函式庫函式。了解如何使用 `List` 和 `MutableList` 建構子建立指定大小的列表，並一窺基於 Kotlin 的問題陳述視覺化。

*   在 [Advent of Code](https://adventofcode.com/2022/day/9) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 9 天 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### 第 10 天：陰極射線管

了解範圍和 `in` 運算子如何使範圍檢查變得自然，函式參數如何轉換為接收器，以及對 `tailrec` 修飾符的簡要探索。

*   在 [Advent of Code](https://adventofcode.com/2022/day/10) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 10 天 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### 第 11 天：中間的猴子

了解如何從可變、命令式程式碼轉變為更具功能性的方法，利用不可變和唯讀資料結構。了解上下文接收器，以及我們的嘉賓如何專為 Advent of Code 構建他自己的視覺化函式庫。

*   在 [Advent of Code](https://adventofcode.com/2022/day/11) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 11 天 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### 第 12 天：爬山演算法

使用佇列、`ArrayDeque`、函式引用和 `tailrec` 修飾符來解決 Kotlin 中的路徑尋找問題。

*   在 [Advent of Code](https://adventofcode.com/2022/day/12) 上閱讀謎題描述
*   在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 第 12 天 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

> 閱讀我們關於 [Advent of Code 2021 的部落格文章](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)
> 
{style="tip"}

### 第 1 天：聲納掃描

應用 `windowed` 和 `count` 函式來處理整數的配對和三元組。

*   在 [Advent of Code](https://adventofcode.com/2021/day/1) 上閱讀謎題描述
*   在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1)上查看 Anton Arhipov 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### 第 2 天：潛水！

了解解構宣告和 `when` 表達式。

*   在 [Advent of Code](https://adventofcode.com/2021/day/2) 上閱讀謎題描述
*   在 [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt) 上查看 Pasha Finkelshteyn 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### 第 3 天：二進位診斷

探索處理二進位數的不同方法。

*   在 [Advent of Code](https://adventofcode.com/2021/day/3) 上閱讀謎題描述
*   在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/)上查看 Sebastian Aigner 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### 第 4 天：巨型魷魚

了解如何解析輸入並引入一些領域類別以實現更便捷的處理。

*   在 [Advent of Code](https://adventofcode.com/2021/day/4) 上閱讀謎題描述
*   在 [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt) 上查看 Anton Arhipov 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

> 您可以在我們的 [GitHub 儲存庫](https://github.com/kotlin-hands-on/advent-of-code-2020/)中找到 Advent of Code 2020 謎題的所有解決方案。
>
{style="tip"}

### 第 1 天：報告修復

探索輸入處理、遍歷列表、建立映射的不同方式，以及使用 [`let`](scope-functions.md#let) 函式來簡化您的程式碼。

*   在 [Advent of Code](https://adventofcode.com/2020/day/1) 上閱讀謎題描述
*   在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/)上查看 Svetlana Isakova 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### 第 2 天：密碼哲學

探索字串工具函式、正規表達式、集合操作，以及 `let` 函式如何有助於轉換您的表達式。

*   在 [Advent of Code](https://adventofcode.com/2020/day/2) 上閱讀謎題描述
*   在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/)上查看 Svetlana Isakova 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### 第 3 天：雪橇軌跡

比較命令式和更具功能性的程式碼風格，使用配對和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 函式，在欄位選擇模式下編輯程式碼，並修復整數溢位。

*   在 [Advent of Code](https://adventofcode.com/2020/day/3) 上閱讀謎題描述
*   在 [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt) 上查看 Mikhail Dvorkin 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### 第 4 天：護照處理

應用 [`when`](control-flow.md#when-expressions-and-statements) 表達式並探索不同的輸入驗證方法：工具函式、使用範圍、檢查集合成員資格以及比對特定的正規表達式。

*   在 [Advent of Code](https://adventofcode.com/2020/day/4) 上閱讀謎題描述
*   在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/)上查看 Sebastian Aigner 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### 第 5 天：二進位登機

使用 Kotlin 標準函式庫函式（`replace()`、`toInt()`、`find()`）來處理數字的二進位表示，探索強大的局部函式，並了解如何在 Kotlin 1.5 中使用 `max()` 函式。

*   在 [Advent of Code](https://adventofcode.com/2020/day/5) 上閱讀謎題描述
*   在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/)上查看 Svetlana Isakova 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### 第 6 天：自訂報關

學習如何使用標準函式庫函式：`map()`、`reduce()`、`sumOf()`、`intersect()` 和 `union()` 對字串和集合中的字元進行分組和計數。

*   在 [Advent of Code](https://adventofcode.com/2020/day/6) 上閱讀謎題描述
*   在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/)上查看 Anton Arhipov 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### 第 7 天：方便的斜背包

了解如何使用正規表達式，如何從 Kotlin 使用 Java 的 `compute()` 方法處理 HashMap 以動態計算映射中的值，使用 `forEachLine()` 函式讀取檔案，並比較兩種搜尋演算法：深度優先和廣度優先。

*   在 [Advent of Code](https://adventofcode.com/2020/day/7) 上閱讀謎題描述
*   在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/)上查看 Pasha Finkelshteyn 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### 第 8 天：手持式中止

應用密封類別和 Lambda 來表示指令，應用 Kotlin 集合來發現在程式執行中的循環，使用序列和 `sequence { }` 建構器函式來建構惰性集合，並嘗試實驗性的 `measureTimedValue()` 函式以檢查效能指標。

*   在 [Advent of Code](https://adventofcode.com/2020/day/8) 上閱讀謎題描述
*   在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/)上查看 Sebastian Aigner 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### 第 9 天：編碼錯誤

探索使用 `any()`、`firstOrNull()`、`firstNotNullOfOrNull()`、`windowed()`、`takeIf()` 和 `scan()` 函式在 Kotlin 中操作列表的不同方式，這些函式體現了慣用 Kotlin 風格。

*   在 [Advent of Code](https://adventofcode.com/2020/day/9) 上閱讀謎題描述
*   在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/)上查看 Svetlana Isakova 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 接下來呢？

*   透過 [Kotlin Koans](koans.md) 完成更多任務
*   透過 JetBrains Academy 的免費 [Kotlin 核心軌跡](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)建立可運作的應用程式