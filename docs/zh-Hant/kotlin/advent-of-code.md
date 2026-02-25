[//]: # (title: 使用慣用 Kotlin 解決 Advent of Code 謎題)

[Advent of Code](https://adventofcode.com/) 是每年 12 月舉行的年度盛會，從 12 月 1 日到 12 月 25 日，每天都會發佈一個以節日為主題的謎題。經 Advent of Code 創始人 [Eric Wastl](http://was.tl/) 的許可，我們將展示如何使用慣用的 Kotlin 風格來解決這些謎題：

* [Advent of Code 2025](https://www.youtube.com/playlist?list=PLlFc5cFwUnmx9-VIcfxqhjHrwD3Lab4o4)
* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## 為 Advent of Code 做好準備

我們將帶您了解如何使用 Kotlin 開始解決 Advent of Code 挑戰的基本技巧：

* 使用 [此 GitHub 範本](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) 來建立專案
* 觀看 Kotlin 技術傳教士 Sebastian Aigner 的歡迎影片：

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### 第一天：卡路里計數 (Calorie counting)

進一步了解 [Kotlin Advent of Code 範本](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) 以及在 Kotlin 中處理字串與集合的便利函式，例如 [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html) 和 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)。看看擴充方法如何幫助您以優雅的方式建構解決方案。

* 在 [Advent of Code](https://adventofcode.com/2022/day/1) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### 第二天：剪刀石頭布 (Rock paper scissors)

了解 Kotlin 中 `Char` 型別的操作，看看 `Pair` 型別和 `to` 建構函式如何與模式配對完美配合。了解如何使用 [`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 函式對您自己的物件進行排序。

* 在 [Advent of Code](https://adventofcode.com/2022/day/2) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### 第三天：背包整理 (Rucksack reorganization)

了解 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 程式庫如何幫助您了解程式碼的效能特性。看看像 `intersect` 這樣的集合運算如何幫助您選取重疊的資料，並查看相同解決方案的不同實作之間的效能比較。

* 在 [Advent of Code](https://adventofcode.com/2022/day/3) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### 第四天：營地清理 (Camp cleanup)

看看 `infix` 和 `operator` 函式如何讓您的程式碼更具表現力，以及 `String` 和 `IntRange` 型別的擴充方法如何讓解析輸入變得容易。

* 在 [Advent of Code](https://adventofcode.com/2022/day/4) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### 第五天：供應堆疊 (Supply stacks)

了解如何使用工廠函式建構更複雜的物件、如何使用正規表示式，以及雙端隊列 [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 型別。

* 在 [Advent of Code](https://adventofcode.com/2022/day/5) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### 第六天：調頻煩惱 (Tuning trouble)

使用 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 程式庫進行更深入的效能調查，比較同一個解決方案的 16 種不同變體的特性。

* 在 [Advent of Code](https://adventofcode.com/2022/day/6) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### 第七天：裝置空間不足 (No space left on device)

了解如何建立樹狀結構模型，並查看以程式化方式產生 Kotlin 程式碼的演示。

* 在 [Advent of Code](https://adventofcode.com/2022/day/7) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### 第八天：樹頂樹屋 (Treetop tree house)

看看實務中的 `sequence` 產生器，以及程式的初稿與慣用的 Kotlin 解決方案之間有多大的差異（特別嘉賓 Roman Elizarov！）。

* 在 [Advent of Code](https://adventofcode.com/2022/day/8) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### 第九天：繩索橋 (Rope bridge)

查看 `run` 函式、帶標籤的 return，以及便利的標準函式庫函式，如 `coerceIn` 或 `zipWithNext`。了解如何使用 `List` 和 `MutableList` 建構函式建立給定大小的列表，並一窺基於 Kotlin 的問題陳述視覺化。

* 在 [Advent of Code](https://adventofcode.com/2022/day/9) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### 第十天：陰極射線管 (Cathode-ray tube)

了解範圍（ranges）和 `in` 運算子如何讓檢查範圍變得自然，函式參數如何轉換為接收者（receivers），以及對 `tailrec` 修飾符的簡要探索。

* 在 [Advent of Code](https://adventofcode.com/2022/day/10) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### 第十一天：中間的猴子 (Monkey in the middle)

了解如何從可變的、指令式程式碼轉向利用不可變且唯讀資料結構的函式編程方式。了解上下文接收者（context receivers），以及我們的嘉賓如何專為 Advent of Code 建立自己的視覺化程式庫。

* 在 [Advent of Code](https://adventofcode.com/2022/day/11) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### 第十二天：爬山演算法 (Hill Climbing algorithm)

使用隊列、`ArrayDeque`、函式參照和 `tailrec` 修飾符來解決 Kotlin 的路徑尋找問題。

* 在 [Advent of Code](https://adventofcode.com/2022/day/12) 上閱讀謎題描述
* 在影片中查看解決方案：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

> 閱讀我們關於 [Advent of Code 2021 的部落格文章](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)
> 
{style="tip"}

### 第一天：聲納掃描 (Sonar sweep)

應用視窗化（windowed）和計數函式來處理成對和三組整數。

* 在 [Advent of Code](https://adventofcode.com/2021/day/1) 上閱讀謎題描述
* 在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1) 上查看 Anton Arhipov 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### 第二天：潛水！ (Dive!)

了解解構宣告和 `when` 運算式。

* 在 [Advent of Code](https://adventofcode.com/2021/day/2) 上閱讀謎題描述
* 在 [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt) 上查看 Pasha Finkelshteyn 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### 第三天：二進位診斷 (Binary diagnostic)

探索處理二進位數字的不同方法。

* 在 [Advent of Code](https://adventofcode.com/2021/day/3) 上閱讀謎題描述
* 在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/) 上查看 Sebastian Aigner 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### 第四天：巨型魷魚 (Giant squid)

了解如何解析輸入並引入一些領域類別以進行更方便的處理。

* 在 [Advent of Code](https://adventofcode.com/2021/day/4) 上閱讀謎題描述
* 在 [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt) 上查看 Anton Arhipov 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

> 您可以在我們的 [GitHub 儲存庫](https://github.com/kotlin-hands-on/advent-of-code-2020/) 中找到 Advent of Code 2020 謎題的所有解決方案。
>
{style="tip"}

### 第一天：報告修復 (Report repair)

探索輸入處理、對列表進行迭代、建置 Map 的不同方式，以及使用 [`let`](scope-functions.md#let) 函式來簡化您的程式碼。

* 在 [Advent of Code](https://adventofcode.com/2020/day/1) 上閱讀謎題描述
* 在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/) 上查看 Svetlana Isakova 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### 第二天：密碼哲學 (Password philosophy)

探索字串公用函式、正規表示式、集合操作，以及 [`let`](scope-functions.md#let) 函式如何幫助轉換您的運算式。

* 在 [Advent of Code](https://adventofcode.com/2020/day/2) 上閱讀謎題描述
* 在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/) 上查看 Svetlana Isakova 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### 第三天：雪橇軌跡 (Toboggan trajectory)

比較指令式和更具函式編程風格的程式碼、使用 Pair 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 函式、在欄選取模式下編輯程式碼，以及修復整數溢位。

* 在 [Advent of Code](https://adventofcode.com/2020/day/3) 上閱讀謎題描述
* 在 [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt) 上查看 Mikhail Dvorkin 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### 第四天：護照處理 (Passport processing)

應用 [`when`](control-flow.md#when-expressions-and-statements) 運算式並探索驗證輸入的不同方式：公用函式、使用範圍、檢查集合成員資格以及配對特定的正規表示式。

* 在 [Advent of Code](https://adventofcode.com/2020/day/4) 上閱讀謎題描述
* 在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/) 上查看 Sebastian Aigner 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### 第五天：二進位登機 (Binary boarding)

使用 Kotlin 標準函式庫函式 (`replace()`、`toInt()`、`find()`) 來處理數字的二進位表示，探索強大的區域函式，並了解如何在 Kotlin 1.5 中使用 `max()` 函式。

* 在 [Advent of Code](https://adventofcode.com/2020/day/5) 上閱讀謎題描述
* 在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/) 上查看 Svetlana Isakova 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### 第六天：自訂海關 (Custom customs)

了解如何使用標準函式庫函式：`map()`、`reduce()`、`sumOf()`、`intersect()` 和 `union()` 對字串和集合中的字元進行分組和計數。

* 在 [Advent of Code](https://adventofcode.com/2020/day/6) 上閱讀謎題描述
* 在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/) 上查看 Anton Arhipov 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### 第七天：便利的背囊 (Handy haversacks)

了解如何使用正規表示式、從 Kotlin 中使用 Java HashMap 的 `compute()` 方法進行動態值計算、使用 `forEachLine()` 函式讀取檔案，並比較兩種類型的搜尋演算法：深度優先和廣度優先。

* 在 [Advent of Code](https://adventofcode.com/2020/day/7) 上閱讀謎題描述
* 在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/) 上查看 Pasha Finkelshteyn 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### 第八天：手持設備停機 (Handheld halting)

應用密封類別和 Lambda 來表示指令，應用 Kotlin 集合來發現程式執行中的迴圈，使用序列和 `sequence { }` 產生器函式來建構延遲載入集合，並嘗試實驗性的 `measureTimedValue()` 函式來檢查效能指標。

* 在 [Advent of Code](https://adventofcode.com/2020/day/8) 上閱讀謎題描述
* 在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/) 上查看 Sebastian Aigner 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### 第九天：編碼錯誤 (Encoding error)

探索在 Kotlin 中使用 `any()`、`firstOrNull()`、`firstNotNullOfOrNull()`、`windowed()`、`takeIf()` 和 `scan()` 函式操作列表的不同方法，這些都是慣用 Kotlin 風格的典範。

* 在 [Advent of Code](https://adventofcode.com/2020/day/9) 上閱讀謎題描述
* 在 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/) 上查看 Svetlana Isakova 的解決方案，或觀看影片：

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 下一步？

* 透過 [Kotlin Koans](koans.md) 完成更多任務
* 透過 JetBrains Academy 的免費 [Kotlin Core track](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 建立實用的應用程式