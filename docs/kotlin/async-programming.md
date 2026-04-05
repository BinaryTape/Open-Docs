[//]: # (title: 异步编程技术)

几十年来，作为开发者，我们一直面临着一个需要解决的问题——如何防止应用程序阻塞。无论是开发桌面、移动还是后端应用程序，我们都希望避免让用户等待，更糟糕的是要避免产生会阻碍应用程序扩展的瓶颈。

解决这个问题有很多方法，包括：

* [线程](#threading)
* [回调](#callbacks)
* [future、promise 及其他](#futures-promises-and-others)
* [Reactive Extensions](#reactive-extensions)
* [协程](#coroutines)

在解释什么是协程之前，让我们简要回顾一下其他一些解决方案。

## 线程

到目前为止，线程可能是防止应用程序阻塞最广为人知的方法。

```kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token {
    // 发起请求，从而阻塞主线程
    return token
}
```

假设在上面的代码中，`preparePost` 是一个耗时较长的过程，因此会阻塞用户界面。我们可以做的是在单独的线程中启动它。这样就可以避免 UI 阻塞。这是一种非常常见的技术，但有一系列缺点：

* 线程并不廉价。线程需要上下文切换，而这代价很高。
* 线程不是无限的。可以启动的线程数量受底层操作系统的限制。在后端应用程序中，这可能会导致严重的瓶颈。
* 线程并非始终可用。某些平台（如 JavaScript）甚至不支持线程。
* 线程并不简单。在多线程编程中，调试线程和避免竞态条件是我们经常遇到的问题。

## 回调

使用回调，其思想是将一个函数作为参数传递给另一个函数，并在处理完成后调用该函数。

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token -> 
        submitPostAsync(token, item) { post -> 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) -> Unit) {
    // 发起请求并立即返回
    // 安排回调在稍后调用
}
```

原则上这看起来是一个更优雅的解决方案，但它同样存在几个问题：

* 嵌套回调的困难。通常用作回调的函数往往最终也需要自己的回调。这导致了一系列嵌套回调，从而使代码变得难以理解。这种模式通常被称为回调地狱，或者由于这些深度嵌套回调产生的缩进所形成的三角形形状而被统称为[厄运金字塔](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))。
* 错误处理很复杂。嵌套模型使得错误处理和传播变得更加复杂。

回调在 JavaScript 等事件循环架构中非常常见，但即使在那，人们通常也已经转向使用其他方法，如 promise 或 Reactive Extensions。

## future、promise 及其他

future 或 promise（根据语言或平台的不同，可能会使用其他术语）背后的思想是，当我们发起调用时，我们得到一个“承诺”，即在某个时间点该调用将返回一个 `Promise` 对象，然后我们可以对其进行操作。

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
    // 发起请求并返回一个稍后完成的 promise
    return promise 
}
```

这种方法需要改变我们的编程方式，特别是：

* 不同的编程模型。与回调类似，编程模型从自顶向下的命令式方法转变为具有链式调用的组合模型。传统的程序结构（如循环、异常处理等）在这种模型中通常不再有效。
* 不同的 API。通常需要学习全新的 API，例如 `thenCompose` 或 `thenAccept`，这些 API 也会因平台而异。
* 特定的返回值类型。返回值类型不再是我们需要的实际数据，而是返回一个必须进行内省的新类型 `Promise`。
* 错误处理可能很复杂。错误的传播和链式传递并不总是直观的。

## Reactive Extensions

Reactive Extensions (Rx) 是由 [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) 引入 C# 的。虽然它在 .NET 平台上确实得到了应用，但直到 Netflix 将其移植到 Java 并命名为 RxJava 后，它才真正成为主流。从那时起，针对各种平台（包括 JavaScript (RxJS)）提供了大量的移植版本。

Rx 背后的思想是转向所谓的“可观察流”，即我们现在将数据视为流（无限量的数据），并且可以观察这些流。从实际角度来看，Rx 只是[观察者模式](https://en.wikipedia.org/wiki/Observer_pattern)结合一系列扩展，这些扩展允许我们对数据进行操作。

在方法上它与 future 非常相似，但可以将 future 视为返回单个元素，而 Rx 返回一个流。然而，与前者类似，它也引入了一种全新的思考编程模型的方式，著名的表述是：

    “万物皆流，且皆可观察”

这意味着处理问题的方式不同，并且与我们编写同步代码时的习惯相比有相当大的转变。与 future 相比，它的一个优势是，由于它被移植到了如此多的平台，通常无论我们使用什么（无论是 C#、Java、JavaScript 还是任何其他提供 Rx 的语言），都能找到一致的 API 体验。

此外，Rx 确实引入了一种更佳的错误处理方法。

## 协程

Kotlin 处理异步代码的方法是使用协程，即由于可挂起的计算这一概念，也就是说一个函数可以在某个点挂起执行并在稍后恢复。

然而，协程的一个好处是，对于开发者来说，编写非阻塞代码与编写阻塞代码基本上是一样的。编程模型本身并没有真正改变。

以以下代码为例：

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

这段代码将启动一个耗时操作，而不会阻塞主线程。`preparePost` 就是所谓的“可挂起函数”，因此在它前面有关键字 `suspend`。如上所述，这意味着该函数将执行、暂停执行并在未来的某个时间点恢复。

* 函数签名保持完全相同。唯一的区别是添加了 `suspend`。而返回值类型则是我们想要返回的类型。
* 代码的编写方式仍然像编写同步代码一样，自顶向下，不需要任何特殊的语法，除了使用一个名为 `launch` 的函数来启动协程（在其他教程中介绍）。
* 编程模型和 API 保持不变。我们可以继续使用循环、异常处理等，无需学习一整套新的 API。
* 它是平台无关的。无论我们的目标是 JVM、JavaScript 还是任何其他平台，我们编写的代码都是一样的。在底层，编译器负责将其适配到各个平台。

协程并不是一个新概念，更不是由 Kotlin 发明的。它们已经存在了几十年，并且在 Go 等其他一些编程语言中很流行。但需要注意的是，在 Kotlin 的实现方式中，大部分功能都被委托给了库。事实上，除了 `suspend` 关键字外，该语言没有添加任何其他关键字。这与 C# 等将 `async` 和 `await` 作为语法一部分的语言有所不同。在 Kotlin 中，这些只是库函数。

要了解更多信息，请参阅 [协程参考](coroutines-overview.md)。