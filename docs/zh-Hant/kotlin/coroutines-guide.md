<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 協程指南)

Kotlin 在其標準函式庫中僅提供最低限度的低階 API，以便其他函式庫能夠利用協程。與許多其他具有類似功能的語言不同，`async` 和 `await` 並非 Kotlin 的關鍵字，甚至不是其標準函式庫的一部分。此外，Kotlin 的 _掛起函數_ 概念為非同步操作提供了比 futures 和 promises 更安全且不易出錯的抽象。

`kotlinx.coroutines` 是 JetBrains 開發的一個豐富的協程函式庫。它包含本指南所涵蓋的多種高階協程啟用原語，包括 `launch`、`async` 及其他。

這是一份關於 `kotlinx.coroutines` 核心功能的指南，其中包含一系列範例，並分為不同的主題。

為了使用協程並遵循本指南中的範例，您需要新增對 `kotlinx-coroutines-core` 模組的依賴，如專案 README 中所述：[使用說明](https://github.com/Kotlin/kotlinx.coroutines/blob/master/README.md#using-in-your-projects)。

## 目錄

*   [協程基礎](coroutines-basics.md)
*   [教學：協程與通道入門](coroutines-and-channels.md)
*   [取消與逾時](cancellation-and-timeouts.md)
*   [組合掛起函數](composing-suspending-functions.md)
*   [協程上下文與調度器](coroutine-context-and-dispatchers.md)
*   [非同步 Flow](flow.md)
*   [通道](channels.md)
*   [協程異常處理](exception-handling.md)
*   [共享可變狀態與並發](shared-mutable-state-and-concurrency.md)
*   [Select 表達式 (實驗性功能)](select-expression.md)
*   [教學：使用 IntelliJ IDEA 調試協程](debug-coroutines-with-idea.md)
*   [教學：使用 IntelliJ IDEA 調試 Kotlin Flow](debug-flow-with-idea.md)

## 參考資料

*   [使用協程進行 UI 程式設計指南](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)
*   [協程設計文件 (KEEP)](https://github.com/Kotlin/KEEP/blob/master/proposals/coroutines.md)
*   [完整的 kotlinx.coroutines API 參考](https://kotlinlang.org/api/kotlinx.coroutines/)
*   [Android 中協程的最佳實踐](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)
*   [Kotlin 協程與 Flow 的額外 Android 資源](https://developer.android.com/kotlin/coroutines/additional-resources)