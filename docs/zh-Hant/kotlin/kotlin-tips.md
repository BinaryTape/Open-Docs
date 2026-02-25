[//]: # (title: Kotlin 小技巧)

Kotlin 小技巧 (Kotlin Tips) 是一個短影片系列，由 Kotlin 團隊成員展示如何以更高效且更慣用的方式使用 Kotlin，讓編寫程式碼變得更有趣。

[訂閱我們的 YouTube 頻道](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)，以免錯過新的 Kotlin 小技巧影片。

## Kotlin 中的 null + null

在 Kotlin 中將 `null + null` 相加會發生什麼事？它會回傳什麼？Sebastian Aigner 在我們最新的快速小技巧中解開了這個謎團。在此過程中，他也展示了為什麼沒有理由害怕可 null 性 (nullables)：

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## 消除集合項目中的重複項

你的 Kotlin 集合 (collection) 中包含重複項嗎？需要一個只包含唯一項目的集合嗎？讓 Sebastian Aigner 在這個 Kotlin 小技巧中向你展示如何從列表中移除重複項，或將它們轉換為 Set：

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## suspend 與內嵌的奧秘

為什麼像 [`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html)、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 和 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 這樣的函式，即使其簽章不具備協同程式感知 (coroutines-aware) 能力，卻能在其 Lambda 中接受 `suspend` 函式？在這一集 Kotlin 小技巧中，Sebastian Aigner 解開了這個謎題：這與 `內嵌` (inline) 修飾符有關：

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 使用完全限定名稱取消遮蔽宣告

遮蔽 (Shadowing) 意味著在同一個作用域中有兩個名稱相同的宣告。那麼，該如何選擇呢？在這一集 Kotlin 小技巧中，Sebastian Aigner 展示了一個簡單的 Kotlin 技巧，利用完全限定名稱 (fully qualified name) 的強大功能，精確呼叫你需要的函式：

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## 搭配 Elvis 運算子使用 return 與 throw

[Elvis](null-safety.md#elvis-operator) 再次現身！Sebastian Aigner 解釋了為什麼這個運算子是以這位著名歌手命名的，以及你如何在 Kotlin 中使用 `?:` 來進行 `return` 或 `throw`。這背後的魔力？就是 [Nothing 型別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 解構宣告

透過 Kotlin 中的 [解構宣告 (destructuring declarations)](destructuring-declarations.md)，你可以從單一物件一次建立多個變數。在這段影片中，Sebastian Aigner 展示了可以被解構的各種內容——Pair、列表 (list)、Map 等等。那麼你自己的物件呢？Kotlin 的 `component` 函式也為這些物件提供了答案：

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## 搭配可 null 值的運算子函式

在 Kotlin 中，你可以為你的類別覆寫加法和減法等運算子，並提供你自己的邏輯。但如果你想允許左側和右側都能使用 `null` 值呢？在這段影片中，Sebastian Aigner 回答了這個問題：

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## 程式碼計時

觀看 Sebastian Aigner 對 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 函式進行快速概覽，並學習如何對你的程式碼進行計時：

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## 改善迴圈

在這段影片中，Sebastian Aigner 將示範如何改善 [迴圈 (loops)](control-flow.md#for-loops)，使你的程式碼更具可讀性、更易於理解且更簡潔：

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 字串

在這一集中，Kate Petrova 展示了三個小技巧，幫助你在 Kotlin 中處理 [字串 (Strings)](strings.md)：

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## Elvis 運算子的更多用法

在這段影片中，Sebastian Aigner 將展示如何為 [Elvis 運算子](null-safety.md#elvis-operator) 加入更多邏輯，例如在運算子的右側部分加入日誌紀錄：

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin 集合

在這一集中，Kate Petrova 展示了三個小技巧，幫助你處理 [Kotlin 集合 (Kotlin Collections)](collections-overview.md)：

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 接下來呢？

* 在我們的 [YouTube 播放清單](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)中查看 Kotlin 小技巧的完整列表
* 學習如何針對 [常見案例撰寫慣用的 Kotlin 程式碼](idioms.md)