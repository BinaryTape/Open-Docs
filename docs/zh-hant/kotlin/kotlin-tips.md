---
title: "Kotlin 小技巧"
---
Kotlin Tips 是一系列短片，Kotlin 團隊的成員在其中展示如何以更有效率和慣用的方式使用 Kotlin，從而在編寫程式碼時獲得更多樂趣。

[訂閱我們的 YouTube 頻道](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)，才不會錯過新的 Kotlin Tips 影片。

## Kotlin 中的 `null + null`

在 Kotlin 中加入 `null + null` 會發生什麼事？它會回傳什麼？ Sebastian Aigner 在我們最新的快速提示中解決了這個謎團。 一路上，他還展示了為什麼沒有理由害怕可為空值（nullable）：

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## 移除集合中的重複項目

有一個包含重複項目的 Kotlin 集合？ 需要一個只有唯一項目的集合？ 讓 Sebastian Aigner 在這個 Kotlin 技巧中向您展示如何從列表中刪除重複項目，或將它們轉換為集合（sets）：

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## `suspend` 和 `inline` 的奧秘

為什麼像 [`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html)、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 和 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 這樣的函數，可以在它們的 lambda 中接受掛起函數（suspending functions），即使它們的簽名沒有察覺協程（coroutines）？ 在這一集的 Kotlin Tips 中，Sebastian Aigner 解決了這個謎題：它與 `inline` 修飾符有關：

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 使用完整限定名稱來取消遮蔽宣告

遮蔽（Shadowing）是指作用域中的兩個宣告具有相同的名稱。 那麼，您該如何選擇？ 在這一集的 Kotlin Tips 中，Sebastian Aigner 向您展示了一個簡單的 Kotlin 技巧，可以使用完整限定名稱的力量來準確地呼叫您需要的函數：

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## 使用 Elvis 運算符回傳和拋出

[Elvis](null-safety#elvis-operator) 再次進入了這個領域！ Sebastian Aigner 解釋了為什麼這個運算符以這位著名歌手的名字命名，以及您如何在 Kotlin 中使用 `?:` 來回傳或拋出。 背後的魔力是什麼？ [Nothing 類型](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 解構宣告

透過 Kotlin 中的[解構宣告](destructuring-declarations)，您可以從單一物件一次建立多個變數。 在這段影片中，Sebastian Aigner 向您展示了一系列可以解構的東西 —— 鍵值對（pairs）、列表（lists）、映射（maps）等等。 那麼您自己的物件呢？ Kotlin 的 component 函數也為這些物件提供了答案：

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## 具有可為空值的運算符函數

在 Kotlin 中，您可以覆寫類別的加法和減法等運算符，並提供您自己的邏輯。 但是，如果您想允許左側和右側都存在空值（null values）怎麼辦？ 在此影片中，Sebastian Aigner 回答了這個問題：

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## 計時程式碼

觀看 Sebastian Aigner 快速概述 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 函數，並學習如何計時您的程式碼：

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## 改善迴圈

在這段影片中，Sebastian Aigner 將示範如何改善[迴圈](control-flow#for-loops)，以使您的程式碼更具可讀性、可理解性和簡潔性：

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 字串

在這一集中，Kate Petrova 展示了三個技巧，可協助您在 Kotlin 中使用[字串](strings)：

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## 使用 Elvis 運算符做更多事情

在這段影片中，Sebastian Aigner 將展示如何將更多邏輯新增到 [Elvis 運算符](null-safety#elvis-operator)，例如記錄到運算符的右側：

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin 集合

在這一集中，Kate Petrova 展示了三個技巧，可協助您使用 [Kotlin 集合](collections-overview)：

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 接下來是什麼？

* 在我們的 [YouTube 播放清單](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7) 中查看完整的 Kotlin Tips 列表
* 學習如何為常見案例編寫[慣用的 Kotlin 程式碼](idioms)