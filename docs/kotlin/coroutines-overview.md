[//]: # (title: 协程)

异步或非阻塞编程是开发领域的重要组成部分。在创建服务端、桌面或移动应用程序时，提供不仅从用户角度看流畅、而且在必要时可扩展的体验至关重要。

Kotlin 通过在语言层面提供[协程](https://en.wikipedia.org/wiki/Coroutine)支持并将大部分功能委托给库，以灵活的方式解决了这个问题。

除了开启异步编程的大门，协程还提供了丰富的其他可能性，例如并发和 Actor。

## 如何开始

Kotlin 新手？查看[入门](getting-started.md)页面。

### 文档

- [协程指南](coroutines-guide.md)
- [基础知识](coroutines-basics.md)
- [通道](channels.md)
- [协程上下文与调度器](coroutine-context-and-dispatchers.md)
- [共享可变状态与并发](shared-mutable-state-and-concurrency.md)
- [异步流](flow.md)

### 教程

- [异步编程技术](async-programming.md)
- [协程与通道简介](coroutines-and-channels.md)
- [使用 IntelliJ IDEA 调试协程](debug-coroutines-with-idea.md)
- [使用 IntelliJ IDEA 调试 Kotlin Flow – 教程](debug-flow-with-idea.md)
- [在 Android 上测试 Kotlin 协程](https://developer.android.com/kotlin/coroutines/test)

## 示例项目

- [kotlinx.coroutines 示例与源码](https://github.com/Kotlin/kotlin-coroutines/tree/master/examples)
- [KotlinConf 应用](https://github.com/JetBrains/kotlinconf-app)