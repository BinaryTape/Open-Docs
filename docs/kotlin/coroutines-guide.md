<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 协程指南)

Kotlin 在其标准库中仅提供了最基础的低级 API，以便其他库能够利用协程。与许多其他具有类似功能的语言不同，`async` 和 `await` 在 Kotlin 中并非关键字，甚至不属于其标准库的一部分。此外，Kotlin 的**挂起函数**概念为异步操作提供了比 Future 和 Promise 更安全、更不易出错的抽象。

`kotlinx.coroutines` 是由 JetBrains 开发的一个功能丰富的协程库。它包含了本指南涵盖的许多高级协程原语，包括 `launch`、`async` 等。

这是一份关于 `kotlinx.coroutines` 核心功能的指南，其中包含一系列示例，并分为不同的主题。

为了使用协程并遵循本指南中的示例，你需要按照[项目 README](https://github.com/Kotlin/kotlinx.coroutines/blob/master/README.md#using-in-your-projects) 中所述，添加对 `kotlinx-coroutines-core` 模块的依赖。

## 目录

*   [协程基础](coroutines-basics.md)
*   [教程：协程与通道简介](coroutines-and-channels.md)
*   [取消与超时](cancellation-and-timeouts.md)
*   [组合挂起函数](composing-suspending-functions.md)
*   [协程上下文与调度器](coroutine-context-and-dispatchers.md)
*   [异步流](flow.md)
*   [通道](channels.md)
*   [协程异常处理](exception-handling.md)
*   [共享可变状态与并发](shared-mutable-state-and-concurrency.md)
*   [Select 表达式 (实验性)](select-expression.md)
*   [教程：使用 IntelliJ IDEA 调试协程](debug-coroutines-with-idea.md)
*   [教程：使用 IntelliJ IDEA 调试 Kotlin Flow](debug-flow-with-idea.md)

## 附加参考资料

*   [协程 UI 编程指南](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)
*   [协程设计文档 (KEEP)](https://github.com/Kotlin/KEEP/blob/master/proposals/coroutines.md)
*   [完整的 kotlinx.coroutines API 参考](https://kotlinlang.org/api/kotlinx.coroutines/)
*   [Android 中协程的最佳实践](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)
*   [Kotlin 协程与 Flow 的其他 Android 资源](https://developer.android.com/kotlin/coroutines/additional-resources)