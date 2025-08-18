[//]: # (title: 协程)

应用程序通常需要同时执行多个**任务**，例如响应用户输入、加载数据或更新屏幕。为支持此**功能**，它们依赖于**并发**，这允许操作独立运行而互不阻塞。

最常见的**并发**运行**任务**的方式是使用**线程**，**线程**是由操作系统管理的独立执行路径。然而，**线程**相对“重”（heavy），创建过多可能导致性能问题。

为支持高效**并发**，Kotlin 使用基于**协程**的异步编程，它允许你使用**挂起函数**以自然、顺序的风格编写异步代码。**协程**是**线程**的轻量级替代品。它们可以在不阻塞系统资源的情况下**挂起**，并且资源友好，因此更适合细粒度的**并发**。

大多数**协程****特性**由 [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) 库提供，该库包含用于启动**协程**、处理**并发**、使用异步流等的工具。

如果你是 Kotlin **协程**的新手，请在深入学习更复杂的**主题**之前，从 [**协程**基础知识](coroutines-basics.md)**指南**开始。本**指南**通过简单的示例介绍了**挂起函数**、**协程构建器**和**结构化并发**的关键**概念**：

<a href="coroutines-basics.md"><img src="get-started-coroutines.svg" width="700" alt="Get started with coroutines" style="block"/></a>

> **关于****协程**在实践中的用法，**请检测** [KotlinConf **应用**](https://github.com/JetBrains/kotlinconf-app) 的示例**项目**。
>
{style="tip"}

## **协程****概念**

`kotlinx.coroutines` 库提供了用于**并发**运行**任务**、**构建****协程**执行以及管理共享状态的核心**构建块**。

### **挂起函数**与**协程构建器**

Kotlin 中的**协程**基于**挂起函数****构建**，它允许代码暂停和恢复而不阻塞**线程**。`suspend` 关键字标记可以异步执行长时间运行操作的**函数**。

要启动新的**协程**，请使用**协程构建器**，例如 [`.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 和 [`.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)。这些**构建器**是 [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) 上的**扩展函数**，它**定义**了**协程**的生命周期并提供了**协程上下文**。

**关于**这些**构建器**的更多信息，**请参见** [**协程**基础知识](coroutines-basics.md) 和 [组合**挂起函数**](coroutines-and-channels.md)。

### **协程上下文**与行为

从 `CoroutineScope` 启动**协程**会创建一个**上下文**，它管理**协程**的执行。`.launch()` 和 `.async()` 等**构建器函数**会自动创建一组**元素**，用于**定义****协程**的行为：

*   [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 接口跟踪**协程**的生命周期并启用**结构化并发**。
*   [`CoroutineDispatcher`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/) 控制**协程**的运行位置，例如在后台**线程**或 UI **应用程序**的主**线程**上。
*   [`CoroutineExceptionHandler`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/) 处理未捕获的异常。

这些**元素**，以及其他可能的**元素**，构成了 [_**协程上下文**_](coroutine-context-and-dispatchers.md)，该**上下文**默认**继承**自**协程**的父级。此**上下文**形成一个**层次结构**，它实现了**结构化并发**，其中相关的**协程**可以一起 [**取消**](cancellation-and-timeouts.md) 或作为一个组 [处理异常](exception-handling.md)。

### 异步流与共享可变状态

Kotlin 提供了多种**协程**通信的方式。**关于**如何在**协程**之间共享值，请根据你的需求选择以下选项之一：

*   [`Flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/) 仅在**协程**主动收集时才**生产**值。
*   [`Channel`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel/) 允许多个**协程**发送和接收值，每个值都只传递给一个**协程**。
*   [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 持续与所有活动的收集**协程**共享每个值。

当多个**协程**需要访问或更新相同数据时，它们会 _共享可变状态_。如果缺乏协调，这可能导致**竞态条件**，其中操作会以不可预测的方式相互干扰。为了安全地管理共享可变状态，请使用 [`StateFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/#) 包装共享数据。然后，你可以从一个**协程**更新它，并从其他**协程**收集其最新值。
<!-- Learn more in [Shared mutable state and concurrency](shared-mutable-state-and-concurrency.md). -->

**关于**更多信息，**请参见** [异步流](flow.md)、[**通道**](channels.md) 和 [**协程**与**通道****教程**](coroutines-and-channels.md)。

## 后续步骤

*   **关于** **协程**、**挂起函数**和**构建器**的基本**原理**，**请参见** [**协程**基础知识**指南**](coroutines-basics.md)。
*   **关于**如何组合**挂起函数**并**构建****协程****流水线**，**请探查** [组合**挂起函数**](coroutine-context-and-dispatchers.md)。
*   **关于**如何使用 IntelliJ IDEA 中的内置工具 [**调试****协程**](debug-coroutines-with-idea.md)，**请参见**该**指南**。
*   **关于**特定于 Flow 的**调试**，**请参见** [使用 IntelliJ IDEA **调试** Kotlin Flow](debug-flow-with-idea.md)**教程**。
*   **关于**基于**协程**的 UI **开发**，**请参阅** [**协程** UI 编程**指南**](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)。
*   **关于**在 Android 中使用**协程**的 [**最佳实践**](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)，**请审阅**。
*   **请检测** [`kotlinx.coroutines` **API 参考**](https://kotlinlang.org/api/kotlinx.coroutines/)。