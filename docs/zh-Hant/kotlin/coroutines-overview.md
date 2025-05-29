[//]: # (title: 協程)

異步或非阻塞式程式設計是開發領域的重要組成部分。在建立伺服器端、桌面或行動應用程式時，提供不僅從使用者角度來看流暢、而且在需要時可擴展的體驗至關重要。

Kotlin 透過在語言層級提供[協程](https://en.wikipedia.org/wiki/Coroutine)支援，並將大多數功能委託給程式庫，以靈活的方式解決此問題。

除了開啟異步程式設計的大門外，協程還提供了豐富的其他可能性，例如並行和執行者。

## 如何開始

剛接觸 Kotlin 嗎？請查看[入門](getting-started.md)頁面。

### 文件

- [協程指南](coroutines-guide.md)
- [基礎](coroutines-basics.md)
- [通道](channels.md)
- [協程上下文和分派器](coroutine-context-and-dispatchers.md)
- [共享可變狀態與並行](shared-mutable-state-and-concurrency.md)
- [異步流](flow.md)

### 教學

- [異步程式設計技術](async-programming.md)
- [協程和通道介紹](coroutines-and-channels.md)
- [使用 IntelliJ IDEA 偵錯協程](debug-coroutines-with-idea.md)
- [使用 IntelliJ IDEA 偵錯 Kotlin Flow – 教學](debug-flow-with-idea.md)
- [在 Android 上測試 Kotlin 協程](https://developer.android.com/kotlin/coroutines/test)

## 範例專案

- [kotlinx.coroutines 範例與原始碼](https://github.com/Kotlin/kotlin-coroutines/tree/master/examples)
- [KotlinConf 應用程式](https://github.com/JetBrains/kotlinconf-app)