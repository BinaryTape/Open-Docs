[//]: # (title: Kotlin 秘訣)

Kotlin 秘訣是一系列短影片，由 Kotlin 團隊成員展示如何以更有效率、更慣用的方式使用 Kotlin，讓撰寫程式碼變得更有趣。

[訂閱我們的 YouTube 頻道](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)，以不錯過新的 Kotlin 秘訣影片。

## 在 Kotlin 中 null + null

當你在 Kotlin 中將 `null + null` 相加時會發生什麼事？它會回傳什麼？Sebastian Aigner 在我們最新的快速秘訣中解答了這個謎團。同時，他也展示了為什麼不需要害怕可空類型 (nullable) 的原因：

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin 秘訣：在 Kotlin 中 null + null"/>

## 集合項目去重複

你的 Kotlin 集合包含重複的項目嗎？需要一個只包含唯一項目的集合嗎？讓 Sebastian Aigner 在這個 Kotlin 秘訣中，向你展示如何從列表中移除重複項目，或將它們轉換為集合：

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin 秘訣：集合項目去重複"/>

## suspend 與 inline 的奧秘

為什麼像 [`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html)、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 和 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 這樣的函式，即使它們的簽章不具備協程感知 (coroutines-aware)，卻能接受在其 Lambda 中使用掛起函式 (suspending functions)？在本集 Kotlin 秘訣中，Sebastian Aigner 解決了這個謎題：這與 inline 修飾符 (modifier) 有關：

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin 秘訣：suspend 與 inline 的奧秘"/>

## 使用其完整限定名稱解除宣告遮蔽

宣告遮蔽 (Shadowing) 意指在一個作用域 (scope) 中，有兩個宣告擁有相同的名稱。那麼，你該如何選擇？在本集 Kotlin 秘訣中，Sebastian Aigner 向你展示了一個簡單的 Kotlin 技巧，利用完整限定名稱 (fully qualified names) 的力量，精確地呼叫你需要的函式：

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin 秘訣：解除宣告遮蔽"/>

## 搭配 Elvis 運算子的回傳與拋出

[Elvis](null-safety.md#elvis-operator) 再次登場！Sebastian Aigner 解釋了為什麼這個運算子以這位著名歌手命名，以及如何在 Kotlin 中使用 `?:` 進行回傳或拋出。幕後的魔法是什麼？那就是 [Nothing 類型](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin 秘訣：搭配 Elvis 運算子的回傳與拋出"/>

## 解構宣告

藉由 Kotlin 中的 [解構宣告](destructuring-declarations.md)，你可以一次從單一物件建立多個變數。在這段影片中，Sebastian Aigner 向你展示了可以解構的項目選集 – 包含配對 (pairs)、列表 (lists)、映射 (maps) 等等。那你的自訂物件呢？Kotlin 的 component 函式也為此提供了答案：

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin 秘訣：解構宣告"/>

## 帶有可空值的運算子函式

在 Kotlin 中，你可以為你的類別覆寫 (override) 加法和減法等運算子，並提供你自己的邏輯。但是，如果你想允許 null 值同時出現在它們的左側和右側呢？在這段影片中，Sebastian Aigner 回答了這個問題：

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin 秘訣：帶有可空值的運算子函式"/>

## 程式碼計時

觀看 Sebastian Aigner 快速概覽 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 函式，並學習如何為你的程式碼計時：

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin 秘訣：程式碼計時"/>

## 優化迴圈

在這段影片中，Sebastian Aigner 將展示如何優化 [迴圈](control-flow.md#for-loops)，讓你的程式碼更具可讀性、更易於理解且更簡潔：

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin 秘訣：優化迴圈"/>

## 字串

在本集中，Kate Petrova 展示了三個幫助你在 Kotlin 中使用 [字串](strings.md) 的秘訣：

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin 秘訣：字串"/>

## 利用 Elvis 運算子實現更多功能

在這段影片中，Sebastian Aigner 將展示如何為 [Elvis 運算子](null-safety.md#elvis-operator) 添加更多邏輯，例如將日誌記錄 (logging) 到運算子的右側部分：

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin 秘訣：Elvis 運算子"/>

## Kotlin 集合

在本集中，Kate Petrova 展示了三個幫助你使用 [Kotlin 集合](collections-overview.md) 的秘訣：

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin 秘訣：Kotlin 集合"/>

## 接下來？

* 查看我們 [YouTube 播放清單](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7) 中完整的 Kotlin 秘訣列表
* 學習如何為常見情況撰寫 [慣用的 Kotlin 程式碼](idioms.md)