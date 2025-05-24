---
title: 异步编程技术
---
几十年以来，作为开发者，我们一直面临着一个需要解决的问题 - 如何防止我们的应用程序阻塞（blocking）。 无论是开发桌面、移动，甚至是服务器端应用程序，我们都希望避免让用户等待，或者更糟糕的是，导致瓶颈，从而阻止应用程序的扩展（scaling）。

为了解决这个问题，已经出现了很多方法，包括：

* [线程（Threading）](#threading)
* [回调（Callbacks）](#callbacks)
* [Futures、Promises 及其他](#futures-promises-and-others)
* [响应式扩展（Reactive Extensions）](#reactive-extensions)
* [协程（Coroutines）](#coroutines)

在解释什么是协程之前，让我们简单回顾一下其他一些解决方案。

## 线程（Threading）

到目前为止，线程可能是避免应用程序阻塞最著名的方法。

```kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token {
    // 发起请求，因此会阻塞主线程
    return token
}
```

假设在上面的代码中，`preparePost` 是一个长时间运行的进程，因此会阻塞用户界面。 我们可以做的是在单独的线程中启动它。 这样可以避免 UI 阻塞。 这是一种非常常见的技术，但存在一系列缺点：

* 线程并不廉价。线程需要上下文切换，这代价很高。
* 线程不是无限的。可以启动的线程数受到底层操作系统的限制。在服务器端应用程序中，这可能会导致严重的瓶颈。
* 线程并非总是可用。某些平台，例如 JavaScript 甚至不支持线程。
* 线程并不容易使用。调试线程和避免竞态条件是我们在多线程编程中遇到的常见问题。

## 回调（Callbacks）

对于回调，其思想是将一个函数作为参数传递给另一个函数，并在该进程完成后调用该函数。

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token `->` 
        submitPostAsync(token, item) { post `->` 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) `->` Unit) {
    // 发起请求并立即返回
    // 安排稍后调用回调
}
```

原则上，这感觉像是一个更优雅的解决方案，但同样存在几个问题：

* 嵌套回调的困难。通常，用作回调的函数最终需要自己的回调。这导致了一系列嵌套的回调，从而导致难以理解的代码。这种模式通常被称为回调地狱（callback hell），或者由于这些深度嵌套的回调产生的缩进的三角形形状而被称为[末日金字塔（pyramid of doom）](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))。
* 错误处理很复杂。嵌套模型使错误处理和传播变得更加复杂。

回调在事件循环架构（如 JavaScript）中非常常见，但即使在那里，人们通常也已转向使用其他方法，例如 Promises 或响应式扩展。

## Futures、Promises 及其他

Futures 或 Promises（其他术语可能会根据语言或平台使用）背后的思想是，当我们进行调用时，我们被“承诺（_promised_）”在某个时刻该调用将返回一个 `Promise` 对象，然后我们可以对其进行操作。

```kotlin
fun postItem(item: Item) {
    preparePostAsync() 
        .thenCompose { token `->` 
            submitPostAsync(token, item)
        }
        .thenAccept { post `->` 
            processPost(post)
        }
         
}

fun preparePostAsync(): Promise<Token> {
    // 发起请求并返回一个稍后完成的 Promise
    return promise 
}
```

这种方法需要在我们的编程方式上进行一系列更改，特别是：

* 不同的编程模型。与回调类似，编程模型从自上而下的命令式方法转变为具有链式调用的组合模型。 传统的程序结构，如循环、异常处理等，通常在此模型中不再有效。
* 不同的 API。通常需要学习一个全新的 API，例如 `thenCompose` 或 `thenAccept`，这些 API 也可能因平台而异。
* 特定的返回类型。返回类型不再是我们需要的实际数据，而是返回一个需要进行检查的新类型 `Promise`。
* 错误处理可能很复杂。错误的传播和链接并不总是那么简单。

## 响应式扩展（Reactive Extensions）

响应式扩展（Rx）由 [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) 引入到 C# 中。 虽然它肯定在 .NET 平台上使用过，但在 Netflix 将其移植到 Java 并将其命名为 RxJava 之前，它并没有真正获得主流采用。 从那时起，已经为各种平台提供了许多端口，包括 JavaScript (RxJS)。

Rx 背后的思想是转向所谓的“可观察流（`observable streams`）”，因此我们现在将数据视为流（无限量的数据），并且可以观察这些流。 实际上，Rx 只是带有 一系列扩展的 [观察者模式（Observer Pattern）](https://en.wikipedia.org/wiki/Observer_pattern)，这些扩展允许我们对数据进行操作。

在方法上，它与 Futures 非常相似，但是可以将 Future 视为返回一个离散元素，而 Rx 返回一个流。 但是，与之前类似，它也引入了一种全新的思考编程模型的方式，最著名的表达是

    "一切都是流，并且是可观察的"

这意味着一种不同的方法来解决问题，并且与我们编写同步代码时习惯的方式有很大的不同。 与 Futures 相比，一个好处是，由于它已移植到如此多的平台，因此通常我们可以找到一致的 API 体验，无论我们使用什么，无论是 C#、Java、JavaScript 还是 Rx 可用的任何其他语言。

此外，Rx 确实引入了一种更好的错误处理方法。

## 协程（Coroutines）

Kotlin 使用协程来处理异步代码，协程是可以挂起的计算的概念，即一个函数可以在某个时刻暂停其执行并在以后恢复的概念。

然而，协程的一个好处是，对于开发人员来说，编写非阻塞代码与编写阻塞代码本质上是相同的。 编程模型本身并没有真正改变。

例如，采用以下代码：

```kotlin
fun postItem(item: Item) {
    launch {
        val token = preparePost()
        val post = submitPost(token, item)
        processPost(post)
    }
}

suspend fun preparePost(): Token {
    // 发起请求并挂起协程
    return suspendCoroutine { /* ... */ } 
}
```

此代码将启动一个长时间运行的操作，而不会阻塞主线程。 `preparePost` 被称为“可挂起函数（`suspendable function`）”，因此关键字 `suspend` 作为前缀。 正如上面所说，这意味着该函数将执行，暂停执行并在某个时间点恢复。

* 函数签名完全相同。 唯一的区别是添加了 `suspend`。 但是，返回类型是我们想要返回的类型。
* 代码仍然像我们编写同步代码一样编写，自上而下，无需任何特殊语法，只需使用一个名为 `launch` 的函数即可启动协程（在其他教程中介绍）。
* 编程模型和 API 保持不变。 我们可以继续使用循环、异常处理等，而无需学习一整套新的 API。
* 它是平台独立的。 无论我们的目标是 JVM、JavaScript 还是任何其他平台，我们编写的代码都是相同的。 在底层，编译器负责使其适应每个平台。

协程不是一个新概念，更不是 Kotlin 发明的。 它们已经存在了几十年，并且在其他一些编程语言（如 Go）中很流行。 但重要的是要注意，它们在 Kotlin 中的实现方式是，大多数功能都委托给库。 事实上，除了 `suspend` 关键字之外，没有其他关键字添加到该语言中。 这与 C# 等将 `async` 和 `await` 作为语法一部分的语言有些不同。 使用 Kotlin，这些只是库函数。

有关更多信息，请参见 [协程参考](coroutines-overview)。