[//]: # (title: 异步编程技术)

几十年来，作为开发者，我们一直面临一个亟待解决的问题：如何防止应用程序阻塞。无论是开发桌面、移动还是服务器端应用程序，我们都希望避免用户等待，更甚者是避免造成阻碍应用程序扩展的瓶颈。

为了解决这个问题，已经出现了许多方法，包括：

*   [线程](#threading)
*   [回调](#callbacks)
*   [Future、Promise 及其他](#futures-promises-and-others)
*   [响应式扩展](#reactive-extensions)
*   [协程](#coroutines)

在解释协程是什么之前，让我们简要回顾一下其他一些解决方案。

## 线程

线程无疑是迄今为止最广为人知、避免应用程序阻塞的方法。

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

假设上面的代码中，`preparePost` 是一个长时间运行的进程，因此会阻塞用户界面。我们可以做的是在一个单独的线程中启动它。这将使我们能够避免 UI 阻塞。这是一种非常常见的技术，但存在一系列缺点：

*   线程并非廉价。线程需要上下文切换，而这是昂贵的。
*   线程并非无限。可以启动的线程数量受底层操作系统限制。在服务器端应用程序中，这可能会导致严重的瓶颈。
*   线程并非总是可用。有些平台，例如 JavaScript，甚至不支持线程。
*   线程并非易用。调试线程和避免竞态条件是我们多线程编程中常见的难题。

## 回调

使用回调，其理念是将一个函数作为参数传递给另一个函数，并在进程完成后调用该函数。

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

这在原则上感觉是一个更优雅的解决方案，但同样存在几个问题：

*   嵌套回调的复杂性。通常，用作回调的函数最终会需要自己的回调。这导致了一系列嵌套回调，从而使代码难以理解。由于这些深度嵌套回调产生的缩进形成三角形形状，这种模式通常被称为回调地狱或[末日金字塔](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))。
*   错误处理复杂。嵌套模型使得错误处理和传播变得有些复杂。

回调在诸如 JavaScript 等事件循环架构中非常常见，但即使在这些场景下，人们也普遍转向使用其他方法，例如 Promise 或响应式扩展。

## Future、Promise 及其他

Future 或 Promise（根据语言或平台可能使用其他术语）背后的理念是，当我们发出一个调用时，系统会_承诺_在某个时候该调用将返回一个 `Promise` 对象，然后我们可以在该对象上进行操作。

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

这种方法要求我们编程方式进行一系列改变，特别是：

*   不同的编程模型。与回调类似，编程模型从自上而下的命令式方法转向了带有链式调用的组合式模型。在这种模型中，传统的程序结构（如循环、异常处理等）通常不再有效。
*   不同的 API。通常需要学习一套全新的 API，例如 `thenCompose` 或 `thenAccept`，这些 API 在不同平台之间也可能有所差异。
*   特定的返回类型。返回类型不再是我们需要实际数据，而是返回一个新的 `Promise` 类型，需要对其进行内省（检查）。
*   错误处理可能很复杂。错误的传播和链式处理并非总是直截了当。

## 响应式扩展

响应式扩展 (Rx) 由 [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) 引入 C#。虽然它确实在 .NET 平台上被使用，但直到 Netflix 将其移植到 Java 并命名为 RxJava 后，它才真正获得主流采用。从那时起，许多针对包括 JavaScript (RxJS) 在内的各种平台的移植版本相继出现。

Rx 背后的理念是转向所谓的**可观测流 (observable streams)**，我们将数据视为流（无限量的数据），并且这些流可以被观察。实际上，Rx 只是[观察者模式](https://en.wikipedia.org/wiki/Observer_pattern)的一系列扩展，允许我们对数据进行操作。

在方法上，它与 Future 非常相似，但可以将 Future 视为返回一个离散元素，而 Rx 返回一个流。然而，与之前的方法类似，它也引入了一种关于编程模型的全新思考方式，一句名言概括为：

    “一切皆是流，且皆可被观测”

这意味着解决问题的不同方式，以及与我们编写同步代码时所习惯的方式截然不同的重大转变。与 Future 相比，一个好处是，鉴于它已被移植到如此多的平台，无论我们使用 C#、Java、JavaScript 还是其他任何提供 Rx 的语言，我们通常都能获得一致的 API 体验。

此外，Rx 确实引入了一种相对更好的错误处理方法。

## 协程

Kotlin 处理异步代码的方法是使用协程，即**可挂起计算 (suspendable computations)** 的理念，换句话说，就是函数可以在某个点挂起其执行并在稍后恢复。

然而，协程的一个好处是，对于开发者而言，编写非阻塞代码与编写阻塞代码本质上是相同的。编程模型本身并没有真正改变。

例如以下代码：

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

这段代码将启动一个长时间运行的操作，而不会阻塞主线程。`preparePost` 就是所谓的**可挂起函数 (suspendable function)**，因此在其前面加上了关键字 `suspend`。如上所述，这意味着该函数将执行，暂停执行并在某个时间点恢复。

*   函数签名保持不变。唯一的区别是添加了 `suspend` 关键字。然而，返回类型仍然是我们希望返回的实际类型。
*   代码仍然像编写同步代码一样，自上而下地编写，除了使用一个名为 `launch` 的函数（它本质上启动了协程，这将在其他教程中介绍）之外，不需要任何特殊语法。
*   编程模型和 API 保持不变。我们可以继续使用循环、异常处理等，无需学习一套全新的 API。
*   它与平台无关。无论我们目标是 JVM、JavaScript 还是任何其他平台，我们编写的代码都是相同的。在底层，编译器负责将其适配到各个平台。

协程并非一个新概念，更不是 Kotlin 发明的。它们已经存在了几十年，并在 Go 等其他一些编程语言中很受欢迎。但需要注意的是，在 Kotlin 中，协程的实现方式是将大部分功能委托给了库。事实上，除了 `suspend` 关键字之外，语言本身没有添加其他任何关键字。这与 C# 等将 `async` 和 `await` 作为语法一部分的语言有所不同。在 Kotlin 中，这些只是库函数。

更多信息，请参阅[协程参考](coroutines-overview.md)。