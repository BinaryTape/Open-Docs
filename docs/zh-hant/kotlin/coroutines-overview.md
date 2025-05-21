---
title: "協程 (Coroutines)"
---
非同步 (Asynchronous) 或非阻塞 (non-blocking) 程式設計是開發中很重要的一環。當建立伺服器端、桌上型或行動應用程式時，提供從使用者角度來看不僅流暢，而且在需要時可擴充的體驗非常重要。

Kotlin 透過在語言層級提供 [協程 (coroutine)](https://en.wikipedia.org/wiki/Coroutine) 支援，並將大部分功能委派給程式庫，以靈活的方式解決了這個問題。

除了開啟非同步程式設計的大門之外，協程還提供了大量的其他可能性，例如並行 (concurrency) 和 Actor 模型。

## 如何開始

Kotlin 新手嗎？請查看 [入門 (Getting started)](getting-started) 頁面。

### 文件

- [協程指南 (Coroutines guide)](coroutines-guide)
- [基礎 (Basics)](coroutines-basics)
- [通道 (Channels)](channels)
- [協程上下文與分派器 (Coroutine context and dispatchers)](coroutine-context-and-dispatchers)
- [共享的可變狀態與並行 (Shared mutable state and concurrency)](shared-mutable-state-and-concurrency)
- [非同步流 (Asynchronous flow)](flow)

### 教學

- [非同步程式設計技巧 (Asynchronous programming techniques)](async-programming)
- [協程與通道介紹 (Introduction to coroutines and channels)](coroutines-and-channels)
- [使用 IntelliJ IDEA 除錯協程 (Debug coroutines using IntelliJ IDEA)](debug-coroutines-with-idea)
- [使用 IntelliJ IDEA 除錯 Kotlin Flow – 教學 (Debug Kotlin Flow using IntelliJ IDEA – tutorial)](debug-flow-with-idea)
- [在 Android 上測試 Kotlin 協程 (Testing Kotlin coroutines on Android)](https://developer.android.com/kotlin/coroutines/test)

## 範例專案

- [kotlinx.coroutines 範例與原始碼 (kotlinx.coroutines examples and sources)](https://github.com/Kotlin/kotlin-coroutines/tree/master/examples)
- [KotlinConf 應用程式 (KotlinConf app)](https://github.com/JetBrains/kotlinconf-app)