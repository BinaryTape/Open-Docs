<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 協程指南)

Kotlin 在其標準函式庫中僅提供了最低限度、低階的 API，以使其他函式庫能夠利用協程。與許多其他具有類似功能的語言不同，`async` 和 `await` 在 Kotlin 中並非關鍵字，甚至不屬於其標準函式庫。此外，Kotlin 的 _掛起函式_ 概念為非同步操作提供了比 Future 和 Promise 更安全、更不容易出錯的抽象化。

`kotlinx.coroutines` 是一個由 JetBrains 開發的豐富協程函式庫。它包含本指南所涵蓋的許多高階協程功能原語，包括 `launch`、`async` 及其他。

這是一個關於 `kotlinx.coroutines` 核心功能的指南，其中包含一系列範例，並分為不同的主題。

為了使用協程並跟隨本指南中的範例，您需要依照[專案 README 中的說明](https://github.com/Kotlin/kotlinx.coroutines/blob/master/README.md#using-in-your-projects)添加 `kotlinx-coroutines-core` 模組的依賴。

## 目錄

*   [協程基礎](coroutines-basics.md)
*   [教學：協程與 Channel 簡介](coroutines-and-channels.md)
*   [取消與逾時](cancellation-and-timeouts.md)
*   [組合掛起函式](composing-suspending-functions.md)
*   [協程上下文與分派器](coroutine-context-and-dispatchers.md)
*   [非同步 Flow](flow.md)
*   [Channel](channels.md)
*   [協程例外處理](exception-handling.md)
*   [共享可變狀態與併發](shared-mutable-state-and-concurrency.md)
*   [Select 表達式 (實驗性)](select-expression.md)
*   [教學：使用 IntelliJ IDEA 偵錯協程](debug-coroutines-with-idea.md)
*   [教學：使用 IntelliJ IDEA 偵錯 Kotlin Flow](debug-flow-with-idea.md)

## 額外參考資料

*   [協程在 UI 編程中的指南](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)
*   [協程設計文件 (KEEP)](https://github.com/Kotlin/KEEP/blob/master/proposals/coroutines.md)
*   [完整的 kotlinx.coroutines API 參考](https://kotlinlang.org/api/kotlinx.coroutines/)
*   [Android 中協程的最佳實踐](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)
*   [Kotlin 協程與 Flow 的額外 Android 資源](https://developer.android.com/kotlin/coroutines/additional-resources)