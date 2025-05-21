---
title: 协程
---
异步或非阻塞编程是开发领域的重要组成部分。在创建服务端、桌面或移动应用程序时，提供从用户角度来看不仅流畅而且在需要时可扩展的体验非常重要。

Kotlin 通过在语言层面提供 [协程](https://en.wikipedia.org/wiki/Coroutine) (coroutine) 支持并将大部分功能委托给库，从而以灵活的方式解决了这个问题。

除了打开异步编程的大门，协程还提供了大量的其他可能性，例如并发和 Actor (actors)。

## 如何开始

Kotlin 新手？请查看 [入门](getting-started) 页面。

### 文档

- [协程指南](coroutines-guide)
- [基础](coroutines-basics)
- [通道](channels)
- [协程上下文与调度器](coroutine-context-and-dispatchers)
- [共享可变状态与并发](shared-mutable-state-and-concurrency)
- [异步流](flow)

### 教程

- [异步编程技巧](async-programming)
- [协程与通道入门](coroutines-and-channels)
- [使用 IntelliJ IDEA 调试协程](debug-coroutines-with-idea)
- [使用 IntelliJ IDEA 调试 Kotlin Flow – 教程](debug-flow-with-idea)
- [在 Android 上测试 Kotlin 协程](https://developer.android.com/kotlin/coroutines/test)

## 示例项目

- [kotlinx.coroutines 示例和源码](https://github.com/Kotlin/kotlin-coroutines/tree/master/examples)
- [KotlinConf app](https://github.com/JetBrains/kotlinconf-app)