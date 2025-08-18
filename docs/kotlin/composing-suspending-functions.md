<!--- TEST_NAME ComposingGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 组合挂起函数)

本节介绍组合挂起函数的各种方法。

## 默认顺序执行

假设我们有两个在其他地方定义的挂起函数，它们执行一些有用的操作，例如某种远程服务调用或计算。我们只是假装它们很有用，但实际上为了本例的目的，每个函数都只是延迟一秒：

```kotlin
suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // 假装这里在执行有用的操作
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假装这里也在执行有用的操作
    return 29
}
```

如果我们需要它们_顺序地_调用 — 先 `doSomethingUsefulOne` _然后_ `doSomethingUsefulTwo`，并计算它们结果的总和，我们该怎么做？实际上，如果我们使用第一个函数的结果来决定是否需要调用第二个函数，或者决定如何调用它，我们就会这样做。

我们使用普通的顺序调用，因为协程中的代码，就像常规代码一样，默认情况下是_顺序执行的_。以下示例通过测量执行这两个挂起函数所花费的总时间来演示这一点：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = doSomethingUsefulOne()
        val two = doSomethingUsefulTwo()
        println("The answer is ${one + two}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-01.kt -->
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-01.kt)获取完整的代码。
>
{style="note"}

它会产生类似这样的输出：

```text
The answer is 42
Completed in 2017 ms
```

<!--- TEST ARBITRARY_TIME -->

## 使用 async 并发执行

如果 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo` 的调用之间没有依赖关系，并且我们希望通过_并发地_执行两者来更快地得到结果呢？这就是 [async] 派上用场的地方。

从概念上讲，[async] 就像 [launch]。它启动一个单独的协程，这是一个轻量级线程，与其他所有协程并发工作。不同之处在于 `launch` 返回一个 [Job] 并且不携带任何结果值，而 `async` 返回一个 [Deferred] —— 一个轻量级非阻塞 future，代表了一个稍后提供结果的 promise。你可以在 deferred 值上使用 `.await()` 来获取其最终结果，但 `Deferred` 也是一个 `Job`，因此如果需要可以取消它。

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = async { doSomethingUsefulOne() }
        val two = async { doSomethingUsefulTwo() }
        println("The answer is ${one.await() + two.await()}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-02.kt -->
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-02.kt)获取完整的代码。
>
{style="note"}

它会产生类似这样的输出：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

这快了两倍，因为这两个协程是并发执行的。请注意，协程的并发始终是显式的。

## 惰性启动的 async

可选地，[async] 可以通过将其 `start` 形参设置为 [CoroutineStart.LAZY] 来实现惰性化。在此模式下，它仅在其结果被 [await][Deferred.await] 需要时，或者其 `Job` 的 [start][Job.start] 函数被调用时才启动协程。运行以下示例：

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = async(start = CoroutineStart.LAZY) { doSomethingUsefulOne() }
        val two = async(start = CoroutineStart.LAZY) { doSomethingUsefulTwo() }
        // 某些计算
        one.start() // 启动第一个
        two.start() // 启动第二个
        println("The answer is ${one.await() + two.await()}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-03.kt -->
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-03.kt)获取完整的代码。
>
{style="note"}

它会产生类似这样的输出：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

所以，这里的两个协程被定义但没有像上一个示例那样立即执行，而是将控制权交给了程序员，以便通过调用 [start][Job.start] 来精确控制何时启动执行。我们首先启动 `one`，然后启动 `two`，然后等待各个协程完成。

请注意，如果我们在 `println` 中直接调用 [await][Deferred.await] 而不先在各个协程上调用 [start][Job.start]，这将导致顺序行为，因为 [await][Deferred.await] 会启动协程执行并等待其完成，这不是惰性化的预期用例。 `async(start = CoroutineStart.LAZY)` 的用例是，当值的计算涉及挂起函数时，替代标准 [lazy](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/lazy.html) 函数。

## Async 风格的函数

> 此处提供这种使用 async 函数的编程风格仅用于说明，因为它在其他编程语言中是一种流行的风格。由于以下解释的原因，**强烈不建议**在 Kotlin 协程中使用这种风格。
>
{style="note"}

我们可以定义 async 风格的函数，这些函数使用 [async] 协程构建器并利用 [GlobalScope] 引用选择退出结构化并发，从而_异步地_调用 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo`。我们用 "...Async" 后缀命名此类函数，以强调它们只启动异步计算，并且需要使用结果 deferred 值来获取结果。

> [GlobalScope] 是一个精妙的 API，它会以不简单的方式适得其反，其中一个将在下面解释，因此你必须使用 `@OptIn(DelicateCoroutinesApi::class)` 显式选择使用 `GlobalScope`。
>
{style="note"}

```kotlin
// somethingUsefulOneAsync 的结果类型是 Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

// somethingUsefulTwoAsync 的结果类型是 Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}
```

请注意，这些 `xxxAsync` 函数**不是** _挂起_函数。它们可以在任何地方使用。然而，其使用总是意味着其操作与调用代码_异步_（这里指_并发_）执行。

以下示例展示了它们在协程之外的使用：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

//sampleStart
// 注意，在此示例中，main 函数右侧没有 runBlocking
fun main() {
    val time = measureTimeMillis {
        // 我们可以在协程之外启动异步操作
        val one = somethingUsefulOneAsync()
        val two = somethingUsefulTwoAsync()
        // 但等待结果必须涉及挂起或阻塞。
        // 这里我们使用 runBlocking { ... } 来阻塞主线程，同时等待结果
        runBlocking {
            println("The answer is ${one.await() + two.await()}")
        }
    }
    println("Completed in $time ms")
}
//sampleEnd

@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-04.kt -->
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-04.kt)获取完整的代码。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
The answer is 42
Completed in 1085 ms
-->

考虑一下，如果在 `val one = somethingUsefulOneAsync()` 行和 `one.await()` 表达式之间，代码中存在一些逻辑错误，并且程序抛出异常，程序正在执行的操作中止会发生什么。通常，全局错误处理程序可以捕获此异常，记录并向开发者报告错误，但程序否则可以继续执行其他操作。然而，这里 `somethingUsefulOneAsync` 仍在后台运行，即使启动它的操作已中止。使用结构化并发不会发生此问题，如下一节所示。

## 使用 async 进行结构化并发

让我们将[使用 async 并发执行](#concurrent-using-async)示例重构为一个函数，该函数并发运行 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo` 并返回它们的组合结果。由于 [async] 是 [CoroutineScope] 的扩展，我们将使用 [coroutineScope][_coroutineScope] 函数来提供必要的[作用域]：

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```

这样，如果 `concurrentSum` 函数的代码内部出现问题并抛出异常，其作用域内启动的所有协程都将被取消。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        println("The answer is ${concurrentSum()}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-05.kt -->
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-05.kt)获取完整的代码。
>
{style="note"}

我们仍然具有两个操作的并发执行，从上述 `main` 函数的输出中可以看出：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

取消总是会通过协程层级结构传播：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
    try {
        failedConcurrentSum()
    } catch(e: ArithmeticException) {
        println("Computation failed with ArithmeticException")
    }
}

suspend fun failedConcurrentSum(): Int = coroutineScope {
    val one = async<Int> { 
        try {
            delay(Long.MAX_VALUE) // 模拟非常长的计算
            42
        } finally {
            println("第一个子协程被取消")
        }
    }
    val two = async<Int> { 
        println("第二个子协程抛出异常")
        throw ArithmeticException()
    }
    one.await() + two.await()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-06.kt -->
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-06.kt)获取完整的代码。
>
{style="note"}

请注意，当其中一个子协程（即 `two`）失败时，第一个 `async` 和等待中的父协程都被取消了：
```text
Second child throws an exception
First child was cancelled
Computation failed with ArithmeticException
```

<!--- TEST -->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Deferred]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/index.html
[CoroutineStart.LAZY]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-start/-l-a-z-y/index.html
[Deferred.await]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html
[Job.start]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/start.html
[GlobalScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html

<!--- END -->