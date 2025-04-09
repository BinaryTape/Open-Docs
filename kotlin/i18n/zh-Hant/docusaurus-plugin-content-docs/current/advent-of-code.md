---
title: "使用慣用的 Kotlin 程式碼解 Advent of Code 謎題"
---
[Advent of Code](https://adventofcode.com/) 是一年一度的 12 月活動，從 12 月 1 日到 12 月 25 日，每天都會發佈以假日為主題的謎題。在 [Advent of Code](https://adventofcode.com/) 的創建者 [Eric Wastl](http://was.tl/) 的許可下，我們將展示如何使用慣用的 Kotlin 風格來解決這些謎題：

* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## 準備好迎接 Advent of Code

我們將帶您了解如何使用 Kotlin 開始解決 Advent of Code 挑戰的基本技巧：

* 使用[這個 GitHub 範本](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)建立專案
* 查看 Kotlin Developer Advocate, Sebastian Aigner 的歡迎影片：

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### Day 1: Calorie counting (卡路里計算)

了解 [Kotlin Advent of Code 範本](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) 以及 Kotlin 中用於處理字串和集合的便捷函式，例如 [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html) 和 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)。了解擴充函式如何幫助您以良好的方式組織您的解決方案。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/1) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### Day 2: Rock paper scissors (剪刀石頭布)

了解 Kotlin 中 `Char` 類型的操作，了解 `Pair` 類型和 `to` 構造函式如何與模式匹配完美搭配。了解如何使用 [`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 函式對您自己的物件進行排序。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/2) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### Day 3: Rucksack reorganization (背包重整)

了解 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 函式庫如何幫助您了解程式碼的效能特徵。了解像 `intersect` 這樣的集合操作如何幫助您選擇重疊的資料，並查看同一解決方案的不同實現之間的效能比較。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/3) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### Day 4: Camp cleanup (營地清理)

了解 `infix` 和 `operator` 函式如何使您的程式碼更具表現力，以及 `String` 和 `IntRange` 類型的擴充函式如何使解析輸入變得容易。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/4) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### Day 5: Supply stacks (供應堆疊)

了解如何使用 factory functions (工廠函式) 構造更複雜的物件，如何使用 regular expressions (正規表示式)，以及 double-ended [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 類型。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/5) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### Day 6: Tuning trouble (調整問題)

通過 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 函式庫查看更深入的效能調查，比較同一解決方案的 16 種不同變體的特徵。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/6) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### Day 7: No space left on device (設備上沒有剩餘空間)

了解如何建模 tree structures (樹狀結構)，並觀看以程式方式生成 Kotlin 程式碼的演示。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/7) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### Day 8: Treetop tree house (樹梢樹屋)

觀看 `sequence` builder 的實際應用，以及程式的初稿與慣用的 Kotlin 解決方案之間的差異有多大（特別來賓 Roman Elizarov！）。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/8) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### Day 9: Rope bridge (繩橋)

觀看 `run` 函式、labeled returns (標記返回) 和便捷的標準函式庫函式，例如 `coerceIn` 或 `zipWithNext`。了解如何使用 `List` 和 `MutableList` 構造函式構造給定大小的列表，並了解基於 Kotlin 的問題陳述可視化。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/9) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### Day 10: Cathode-ray tube (陰極射線管)

了解 ranges (範圍) 和 `in` 運算符如何使檢查範圍變得自然，function parameters (函式參數) 如何轉換為 receivers (接收者)，以及對 `tailrec` modifier 的簡要探索。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/10) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### Day 11: Monkey in the middle (中間的猴子)

了解如何從 mutable (可變)、imperative code (命令式程式碼) 轉變為更 functional approach (函數式方法)，後者利用 immutable (不可變) 和 read-only (唯讀) data structures (資料結構)。了解 context receivers (上下文接收者) 以及我們的來賓如何僅為 Advent of Code 建立了自己的 visualization library (可視化函式庫)。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/11) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### Day 12: Hill Climbing algorithm (爬山演算法)

使用 queues (佇列)、`ArrayDeque`、function references (函式引用) 和 `tailrec` modifier 來解決 Kotlin 的 path finding problems (路徑查找問題)。

* 閱讀 [Advent of Code](https://adventofcode.com/2022/day/12) 上的謎題描述
* 在影片中查看解決方案：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

:::tip
閱讀我們關於 [Advent of Code 2021](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/) 的[部落格文章](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)

:::

### Day 1: Sonar sweep (聲納掃描)

應用 windowed (滑窗) 和 count (計數) 函式來處理整數對和三元組。

* 閱讀 [Advent of Code](https://adventofcode.com/2021/day/1) 上的謎題描述
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1) 上查看 Anton Arhipov 的解決方案
  或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### Day 2: Dive! (下潛！)

了解 destructuring declarations (解構聲明) 和 `when` expression (when 表達式)。

* 閱讀 [Advent of Code](https://adventofcode.com/2021/day/2) 上的謎題描述
* 在 [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt) 上查看 Pasha Finkelshteyn 的解決方案
  或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### Day 3: Binary diagnostic (二進制診斷)

探索使用 binary numbers (二進制數字) 的不同方式。

* 閱讀 [Advent of Code](https://adventofcode.com/2021/day/3) 上的謎題描述
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/) 上查看 Sebastian Aigner 的解決方案
  或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### Day 4: Giant squid (巨型魷魚)

了解如何解析輸入並引入一些 domain classes (領域類別) 以便於處理。

* 閱讀 [Advent of Code](https://adventofcode.com/2021/day/4) 上的謎題描述
* 在 [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt) 上查看 Anton Arhipov 的解決方案
  或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

:::tip
您可以在我們的 [GitHub 儲存庫](https://github.com/kotlin-hands-on/advent-of-code-2020/) 中找到 Advent of Code 2020 謎題的所有解決方案。

:::

### Day 1: Report repair (報告修復)

探索 input handling (輸入處理)、iterating over a list (迭代列表)、building a map (建立映射) 的不同方式，以及使用 [`let`](scope-functions#let)
函式來簡化您的程式碼。

* 閱讀 [Advent of Code](https://adventofcode.com/2020/day/1) 上的謎題描述
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/) 上查看 Svetlana Isakova 的解決方案
或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### Day 2: Password philosophy (密碼哲學)

探索 string utility functions (字串實用函式)、regular expressions (正規表示式)、operations on collections (集合操作)，以及 [`let`](scope-functions#let)
函式如何有助於轉換您的表達式。

* 閱讀 [Advent of Code](https://adventofcode.com/2020/day/2) 上的謎題描述
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/) 上查看 Svetlana Isakova 的解決方案
或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### Day 3: Toboggan trajectory (雪橇軌跡)

比較 imperative (命令式) 和 more functional code styles (更函數式的程式碼風格)、處理 pairs (配對) 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
函式、在 column selection mode (列選擇模式) 下編輯程式碼，並修復 integer overflows (整數溢位)。

* 閱讀 [Advent of Code](https://adventofcode.com/2020/day/3) 上的謎題描述
* 在 [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt) 上查看 Mikhail Dvorkin 的解決方案
或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### Day 4: Passport processing (護照處理)

應用 [`when`](control-flow#when-expressions-and-statements) 表達式並探索如何驗證輸入的不同方式：
utility functions (實用函式)、處理 ranges (範圍)、檢查 set membership (集合成員資格)，以及匹配 particular regular expression (特定正規表示式)。

* 閱讀 [Advent of Code](https://adventofcode.com/2020/day/4) 上的謎題描述
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/) 上查看 Sebastian Aigner 的解決方案
或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### Day 5: Binary boarding (二進制登機)

使用 Kotlin 標準函式庫函式（`replace()`、`toInt()`、`find()`）處理數字的 binary representation (二進制表示)，
探索 powerful local functions (強大的本地函式)，並了解如何在 Kotlin 1.5 中使用 `max()` 函式。

* 閱讀 [Advent of Code](https://adventofcode.com/2020/day/5) 上的謎題描述
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/) 上查看 Svetlana Isakova 的解決方案
或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### Day 6: Custom customs (自定義海關)

了解如何使用標準函式庫函式 `map()` 對字串和集合中的字元進行 grouping (分組) 和 counting (計數)，
`reduce()`、`sumOf()`、`intersect()` 和 `union()`。

* 閱讀 [Advent of Code](https://adventofcode.com/2020/day/6) 上的謎題描述
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/) 上查看 Anton Arhipov 的解決方案
或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### Day 7: Handy haversacks (方便的背包)

學習如何使用 regular expressions (正規表示式)，從 Kotlin 使用 Java 的 `compute()` 方法處理 HashMaps，以動態計算
map (映射) 中的值，使用 `forEachLine()` 函式讀取檔案，並比較兩種搜尋演算法：
depth-first (深度優先) 和 breadth-first (廣度優先)。

* 閱讀 [Advent of Code](https://adventofcode.com/2020/day/7) 上的謎題描述
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/) 上查看 Pasha Finkelshteyn 的解決方案
或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### Day 8: Handheld halting (手持停止)

應用 sealed classes (密封類別) 和 lambdas (lambda 表達式) 來表示 instructions (指令)，應用 Kotlin sets (集合) 來發現 program execution (程式執行) 中的 loops (迴圈)，
使用 sequences (序列) 和 `sequence { }` builder function (建構器函式) 來建構 lazy collection (惰性集合)，並嘗試實驗性的
`measureTimedValue()` 函式來檢查 performance metrics (效能指標)。

* 閱讀 [Advent of Code](https://adventofcode.com/2020/day/8) 上的謎題描述
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/) 上查看 Sebastian Aigner 的解決方案
或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### Day 9: Encoding error (編碼錯誤)

探索使用 `any()`、`firstOrNull()`、`firstNotNullOfOrNull()` 操縱 Kotlin 中 lists (列表) 的不同方式，
`windowed()`、`takeIf()` 和 `scan()` 函式，這些函式例證了慣用的 Kotlin 風格。

* 閱讀 [Advent of Code](https://adventofcode.com/2020/day/9) 上的謎題描述
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/) 上查看 Svetlana Isakova 的解決方案
或觀看影片：

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 接下來是什麼？

* 使用 [Kotlin Koans](koans) 完成更多任務
* 使用 JetBrains Academy 的免費 [Kotlin Core track](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 建立工作應用程式