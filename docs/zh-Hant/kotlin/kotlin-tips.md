[//]: # (title: Kotlin 訣竅)

Kotlin 訣竅是一個短片系列，由 Kotlin 團隊成員展示如何以更高效和慣用的方式使用 Kotlin，從而在編寫程式碼時獲得更多樂趣。

[訂閱我們的 YouTube 頻道](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)，以免錯過新的 Kotlin 訣竅影片。

## Kotlin 中的 null + null

在 Kotlin 中，當你將 `null + null` 相加時會發生什麼？它會回傳什麼？在我們最新的快速訣竅中，Sebastian Aigner 將解答這個謎團。同時，他也展示了為什麼無需害怕空值型別：

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin 訣竅：Kotlin 中的 null + null"/>

## 集合項目去重複

你有一個包含重複項的 Kotlin 集合嗎？需要一個只包含唯一項的集合嗎？在這個 Kotlin 訣竅中，讓 Sebastian Aigner 向你展示如何從列表中移除重複項，或將它們轉換為集合：

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin 訣竅：集合項目去重複"/>

## suspend 與 inline 的奧秘

為什麼像 [`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html)、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 和 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 這樣的函式，即使它們的簽章不具備協程感知能力，也能在其 lambda 中接受 `suspend` 函式？在這集 Kotlin 訣竅中，Sebastian Aigner 解開了這個謎團：它與 `inline` 修飾符有關：

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin 訣竅：suspend 與 inline 的奧秘"/>

## 使用完整合格名稱取消遮蔽宣告

遮蔽 (Shadowing) 意指在同一作用域中存在兩個同名的宣告。那麼，你該如何選擇呢？在這集 Kotlin 訣竅中，Sebastian Aigner 向你展示一個簡單的 Kotlin 技巧，利用完整合格名稱的威力，精確地呼叫你需要的函式：

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin 訣竅：取消遮蔽宣告"/>

## 使用 Elvis 運算符進行回傳與拋出

[Elvis](null-safety.md#elvis-operator) 再度登場！Sebastian Aigner 解釋了這個運算符為何以這位著名歌手命名，以及如何在 Kotlin 中使用 `?:` 來回傳或拋出。背後的魔法是什麼？那就是 [Nothing 型別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin 訣竅：使用 Elvis 運算符進行回傳與拋出"/>

## 解構宣告

透過 [解構宣告](destructuring-declarations.md) 在 Kotlin 中，你可以一次從單一物件建立多個變數。在這部影片中，Sebastian Aigner 向你展示了一系列可以被解構的事物——包括配對 (pairs)、列表 (lists)、映射 (maps) 等等。那麼你自己的物件呢？Kotlin 的組件函式也提供了答案：

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin 訣竅：解構宣告"/>

## 具有可空值的運算符函式

在 Kotlin 中，你可以為你的類別覆寫加法和減法等運算符，並提供自己的邏輯。但如果你想允許兩側都為空值呢？在這部影片中，Sebastian Aigner 回答了這個問題：

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin 訣竅：具有可空值的運算符函式"/>

## 程式碼計時

觀看 Sebastian Aigner 快速概述 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 函式，並學習如何為你的程式碼計時：

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin 訣竅：程式碼計時"/>

## 優化迴圈

在這部影片中，Sebastian Aigner 將展示如何優化 [迴圈](control-flow.md#for-loops)，使你的程式碼更具可讀性、易懂性及簡潔性：

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin 訣竅：優化迴圈"/>

## 字串

在這集影片中，Kate Petrova 展示了三個幫助你在 Kotlin 中處理 [字串](strings.md) 的訣竅：

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin 訣竅：字串"/>

## 關於 Elvis 運算符的更多應用

在這部影片中，Sebastian Aigner 將展示如何為 [Elvis 運算符](null-safety.md#elvis-operator) 添加更多邏輯，例如將日誌記錄到運算符的右側部分：

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin 訣竅：Elvis 運算符"/>

## Kotlin 集合

在這集影片中，Kate Petrova 展示了三個幫助你處理 [Kotlin 集合](collections-overview.md) 的訣竅：

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin 訣竅：Kotlin 集合"/>

## 接下來呢？

* 在我們的 [YouTube 播放列表](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7) 中查看所有 Kotlin 訣竅影片
* 學習如何為[常見情況編寫慣用的 Kotlin 程式碼](idioms.md)