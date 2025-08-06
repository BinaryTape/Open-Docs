[//]: # (title: 協程)

應用程式通常需要同時執行多個任務，例如回應使用者輸入、載入資料或更新螢幕。
為支援此功能，它們依賴於並行處理 (concurrency)，這允許操作獨立執行而不會相互阻塞。

執行並行任務最常見的方式是使用執行緒 (threads)，它們是由作業系統管理的獨立執行路徑。
然而，執行緒相對笨重，建立過多的執行緒可能導致效能問題。

為支援高效的並行處理，Kotlin 使用基於 _協程_ (coroutines) 的非同步程式設計，讓您可以使用暫停函數 (suspending functions) 以自然、循序的方式編寫非同步程式碼。
協程是執行緒的輕量級替代方案。
它們可以在不阻塞系統資源的情況下暫停，並且資源友好，使其更適合細粒度的並行處理。

大多數協程功能由 [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) 函式庫提供，
該函式庫包含用於啟動協程、處理並行、使用非同步流等工具。

如果您是 Kotlin 協程的新手，請在深入研究更複雜的主題之前，先從 [協程基礎](coroutines-basics.md) 指南開始。
本指南透過簡單的範例介紹了暫停函數、協程建構器 (coroutine builders) 和結構化並行 (structured concurrency) 的關鍵概念：

<a href="coroutines-basics.md"><img src="get-started-coroutines.svg" width="700" alt="Get started with coroutines" style="block"/></a>

> 查看 [KotlinConf app](https://github.com/JetBrains/kotlinconf-app) 以獲取範例專案，了解協程如何在實踐中使用。
> 
{style="tip"}

## 協程概念

`kotlinx.coroutines` 函式庫提供了用於並行執行任務、結構化協程執行和管理共享狀態的核心建構塊。

### 暫停函數和協程建構器

Kotlin 中的協程建立在暫停函數之上，這些函數允許程式碼暫停和恢復而不會阻塞執行緒。
`suspend` 關鍵字標記了可以非同步執行長時間操作的函數。

要啟動新的協程，請使用 [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) 上的擴展函數，例如 [`.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 和 [`.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)。
這些建構器定義了協程的生命週期並提供了協程上下文。

您可以在 [協程基礎](coroutines-basics.md) 和 [組合暫停函數](coroutines-and-channels.md) 中了解更多關於這些建構器的資訊。

### 協程上下文和行為

從 `CoroutineScope` 啟動協程會建立一個管理其執行的上下文。
`.launch()` 和 `.async()` 等建構器函數會自動建立一組元素，定義協程的行為方式：

*   [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 介面追蹤協程的生命週期並啟用結構化並行。
*   [`CoroutineDispatcher`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/) 控制協程的執行位置，例如在背景執行緒上或 UI 應用程式的主執行緒上。
*   [`CoroutineExceptionHandler`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/) 處理未捕獲的異常。

這些以及其他可能的元素組成了 _協程上下文_ (coroutine context)，它預設繼承自協程的父級。
此上下文形成一個層次結構，實現結構化並行，相關的協程可以一起被 [取消](cancellation-and-timeouts.md) 或作為一個群組 [處理異常](exception-handling.md)。

### 非同步流和共享可變狀態

Kotlin 提供了多種協程通訊的方式。
根據您希望如何在協程之間共享值，使用以下選項之一：

*   [`Flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/) 僅在協程主動收集時才產生值。
*   [`Channel`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel/) 允許多個協程傳送和接收值，每個值僅傳遞給一個協程。
*   [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 持續將每個值與所有活躍的收集協程共享。

當多個協程需要存取或更新相同的資料時，它們會 _共享可變狀態_ (share mutable state)。
如果沒有協調，這可能導致競爭條件 (race conditions)，操作會以不可預測的方式相互干擾。
為了安全地管理共享可變狀態，請使用 [`StateFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/#) 包裝共享資料。
然後，您可以從一個協程更新它，並從其他協程收集其最新值。
<!-- Learn more in [Shared mutable state and concurrency](shared-mutable-state-and-concurrency.md). -->

更多資訊請參閱 [非同步流](flow.md)、[通道](channels.md) 和 [協程與通道教學](coroutines-and-channels.md)。

## 接下來

*   在 [協程基礎指南](coroutines-basics.md) 中學習協程、暫停函數和建構器的基礎知識。
*   在 [組合暫停函數](coroutine-context-and-dispatchers.md) 中探索如何組合暫停函數並建構協程管道。
*   了解如何使用 IntelliJ IDEA 中的內建工具 [除錯協程](debug-coroutines-with-idea.md)。
*   對於 Flow 特定除錯，請參閱 [使用 IntelliJ IDEA 除錯 Kotlin Flow](debug-flow-with-idea.md) 教學。
*   閱讀 [使用協程進行 UI 程式設計指南](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md) 以了解基於協程的 UI 開發。
*   查看 [在 Android 中使用協程的最佳實踐](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)。
*   查閱 [`kotlinx.coroutines` API 參考](https://kotlinlang.org/api/kotlinx.coroutines/)。