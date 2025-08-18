[//]: # (title: 异步编程技术)

几十年来，作为开发者，我们面临着一个需要解决的问题——如何防止应用程序阻塞。无论是开发桌面应用、移动应用，甚至是服务器端应用，我们都希望避免用户等待，更甚者避免造成瓶颈，阻碍应用程序扩展。

解决这个问题的方法有很多，包括：

*   [线程](#threading)
*   [回调](#callbacks)
*   [future、promise 及其他](#futures-promises-and-others)
*   [反应式扩展](#reactive-extensions)
*   [协程](#coroutines)

在解释协程是什么之前，我们先简要回顾其他一些解决方案。

## 线程

线程无疑是避免应用程序阻塞最广为人知的方法。

```kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token {
    // makes a request and consequently blocks the main thread
    return token
}
```

假设上面的代码中 `preparePost` 是一个耗时操作，因此会阻塞用户界面。我们可以做的是在单独的线程中启动它。这将使我们避免 UI 阻塞。这是一种非常常见的技术，但它有一系列缺点：

*   线程开销不菲。线程需要上下文切换，开销很大。
*   线程不是无限的。可启动的线程数量受底层操作系统限制。在服务器端应用程序中，这可能会造成主要瓶颈。
*   线程并非总是可用。有些平台，例如 JavaScript 甚至不支持线程。
*   线程不易处理。调试线程和避免竞态条件是多线程编程中常见的难题。

## 回调

使用回调时，其思想是将一个函数作为实参传递给另一个函数，并在进程完成后调用该函数。

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token ->
        submitPostAsync(token, item) { post ->
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) -> Unit) {
    // make request and return immediately
    // arrange callback to be invoked later
}
```

这原则上感觉是一个更优雅的解决方案，但又一次出现了若干问题：

*   嵌套回调的复杂性。通常用作回调的函数，往往最终需要它自己的回调。这导致一系列嵌套回调，使代码难以理解。由于这些深度嵌套回调产生的缩进形成三角形，这种模式常被称为“回调地狱”，或“厄运金字塔” ([pyramid of doom](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming)))。
*   错误处理复杂。嵌套模型使得错误处理和错误传播变得有些复杂。

回调在事件循环架构（例如 JavaScript）中相当常见，但即使在那里，人们通常也已转向使用其他方法，例如 promise 或反应式扩展。

## future、promise 及其他

future 或 promise（根据语言或平台可能会使用其他术语）背后的思想是，当我们发起调用时，我们被“承诺”在某个时刻该调用将返回一个 `Promise` 对象，我们之后可以对其进行操作。

```kotlin
fun postItem(item: Item) {
    preparePostAsync()
        .thenCompose { token ->
            submitPostAsync(token, item)
        }
        .thenAccept { post ->
            processPost(post)
        }

}

fun preparePostAsync(): Promise<Token> {
    // makes request and returns a promise that is completed later
    return promise
}
```

这种方法要求我们改变编程方式，尤其是在：

*   不同的编程模型。与回调类似，编程模型从自上而下的命令式方法转向带有链式调用的组合式模型。在此模型中，传统的程序结构（例如循环、异常处理等）通常不再有效。
*   不同的 API。通常需要学习全新的 API，例如 `thenCompose` 或 `thenAccept`，这些 API 也可能因平台而异。
*   特定的返回类型。返回类型不再是我们需要的实际数据，而是返回一个必须被探查的新类型 `Promise`。
*   错误处理可能很复杂。错误的传播和链式处理并非总是直截了当。

## 反应式扩展

反应式扩展 (Rx) 由 [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) 引入 C#。虽然它确实在 .NET 平台上使用，但直到 Netflix 将其移植到 Java 并命名为 RxJava 后，才真正获得主流采用。自那时起，许多平台（包括 JavaScript (RxJS)）都提供了大量的移植版本。

Rx 背后的思想是转向所谓的“可观测流”，我们现在将数据视为流（无限量的数据），并且这些流可以被观测。实际上，Rx 只是带有了一系列扩展的[观察者模式](https://en.wikipedia.org/wiki/Observer_pattern)，这些扩展允许我们对数据进行操作。

在方法上，它与 future 非常相似，但可以认为 future 返回的是一个离散元素，而 Rx 返回的是一个流。然而，与之前的方法类似，它也引入了一种全新的编程模型思维方式，著名的表述是：

    "一切皆流，皆可观测"

这意味着一种不同的问题解决方式，以及与我们编写同步代码时习惯的方式截然不同的重大转变。与 future 相比，一个好处是，鉴于它已被移植到如此多的平台，无论我们使用 C#、Java、JavaScript 还是其他任何支持 Rx 的语言，我们通常都能获得一致的 API 体验。

此外，Rx 确实引入了一种处理错误相对更好的方法。

## 协程

Kotlin 处理异步代码的方法是使用协程，这是一种可挂起计算的思想，即函数可以在某个点暂停执行并在稍后恢复。

然而，协程的一个好处是，对于开发者而言，编写非阻塞代码与编写阻塞代码本质上相同。编程模型本身并没有真正改变。

例如，以下代码：

```kotlin
fun postItem(item: Item) {
    launch {
        val token = preparePost()
        val post = submitPost(token, item)
        processPost(post)
    }
}

suspend fun preparePost(): Token {
    // makes a request and suspends the coroutine
    return suspendCoroutine { /* ... */ }
}
```

这段代码将启动一个耗时操作而不会阻塞主线程。`preparePost` 被称为“挂起函数”，因此前面带有一个 `suspend` 关键字。如上所述，这意味着该函数将执行、暂停执行并在某个时间点恢复。

*   函数签名保持不变。唯一的区别是增加了 `suspend`。然而，返回类型是我们希望返回的类型。
*   代码仍然像编写同步代码一样，自上而下，无需任何特殊语法，除了使用一个名为 `launch` 的函数来启动协程（在其他教程中会介绍）。
*   编程模型和 API 保持不变。我们可以继续使用循环、异常处理等，无需学习一整套新的 API。
*   它与平台无关。无论我们面向 JVM、JavaScript 还是任何其他平台，我们编写的代码都相同。在底层，编译器会负责将其适配到各个平台。

协程不是一个新概念，更不是 Kotlin 发明的。它们已经存在数十年，并在 Go 等其他一些编程语言中很受欢迎。然而，需要注意的是，它们在 Kotlin 中的实现方式是，大部分功能都委托给库来完成。事实上，除了 `suspend` 关键字，没有其他关键字被添加到语言中。这与 C# 等语言有所不同，C# 将 `async` 和 `await` 作为语法的一部分。而在 Kotlin 中，这些只是库函数。

关于更多信息，请参阅[协程参考](coroutines-overview.md)。