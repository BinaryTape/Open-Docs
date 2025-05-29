<!--- TEST_NAME ComposingGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 组合挂起函数)

本节涵盖了组合挂起函数的各种方法。

## 默认是顺序执行的

假设我们有两个在别处定义的挂起函数，它们执行一些有用的操作，例如某种远程服务调用或计算。这里我们只是假装它们有用，但实际上为了本示例的目的，每个函数都只是延迟一秒钟：

```kotlin
suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```

如果我们像先调用 `doSomethingUsefulOne` **然后**调用 `doSomethingUsefulTwo` 那样，_顺序地_ 调用它们，并计算它们的总和，该怎么做？
在实践中，如果我们需要使用第一个函数的结果来决定是否需要调用第二个函数，或决定如何调用它，我们就会这样做。

我们使用正常的顺序调用，因为协程中的代码，就像常规代码一样，默认是_顺序执行_的。以下示例通过测量执行这两个挂起函数所需的总时间来演示这一点：

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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-01.kt)获取完整代码。
>
{style="note"}

它会产生类似这样的输出：

```text
The answer is 42
Completed in 2017 ms
```

<!--- TEST ARBITRARY_TIME -->

## 使用 async 实现并发

如果 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo` 的调用之间没有依赖关系，并且我们希望通过_并发_执行两者来更快地得到结果，该怎么办？这就是 [async] 发挥作用的地方。

从概念上讲，[async] 就像 [launch] 一样。它启动一个独立的协程，这是一个与所有其他协程并发工作的轻量级线程。不同之处在于，`launch` 返回一个 [Job] 并且不携带任何结果值，而 `async` 返回一个 [Deferred] &mdash; 一个轻量级的非阻塞未来（future），它代表了一个稍后提供结果的承诺。你可以在一个 deferred 值上使用 `.await()` 来获取其最终结果，但 `Deferred` 也是一个 `Job`，因此如果需要，你可以取消它。

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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-02.kt)获取完整代码。
>
{style="note"}

它会产生类似这样的输出：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

这快了两倍，因为两个协程是并发执行的。
请注意，协程的并发总是显式的。

## 惰性启动的 async

可选地，通过将其 `start` 参数设置为 [CoroutineStart.LAZY]，[async] 可以实现惰性启动。在此模式下，它仅在 [await][Deferred.await] 需要其结果时，或者当其 `Job` 的 [start][Job.start] 函数被调用时，才启动协程。运行以下示例：

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = async(start = CoroutineStart.LAZY) { doSomethingUsefulOne() }
        val two = async(start = CoroutineStart.LAZY) { doSomethingUsefulTwo() }
        // some computation
        one.start() // start the first one
        two.start() // start the second one
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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-03.kt)获取完整代码。
>
{style="note"}

它会产生类似这样的输出：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

因此，这里定义的两个协程不像前面的示例那样直接执行，而是通过调用 [start][Job.start]，将何时启动执行的控制权交给了程序员。我们首先启动 `one`，然后启动 `two`，接着等待各个协程完成。

请注意，如果我们只是在 `println` 中调用 [await][Deferred.await] 而没有首先在各个协程上调用 [start][Job.start]，这会导致顺序行为，因为 [await][Deferred.await] 会启动协程执行并等待其完成，这并非惰性启动的预期用例。`async(start = CoroutineStart.LAZY)` 的用例是，在值计算涉及挂起函数时，替代标准的 [lazy](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/lazy.html) 函数。

## Async 风格函数

> 这里提供这种使用 `async` 函数的编程风格仅作说明，因为它是其他编程语言中流行的一种风格。但**强烈不建议**在 Kotlin 协程中使用这种风格，原因如下所述。
>
{style="note"}

我们可以定义 `async` 风格的函数，它们使用 [async] 协程构建器_异步_调用 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo`，通过 [GlobalScope] 引用来退出结构化并发。我们将这类函数命名为带有 "...Async" 后缀，以突出它们仅启动异步计算，并且需要使用生成的 deferred 值来获取结果。

> [GlobalScope] 是一个**细致的** API，它可能以非预期的方式产生负面影响，其中一种将在下文解释，因此你必须使用 `@OptIn(DelicateCoroutinesApi::class)` 显式选择使用 `GlobalScope`。
>
{style="note"}

```kotlin
// The result type of somethingUsefulOneAsync is Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

// The result type of somethingUsefulTwoAsync is Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}
```

请注意，这些 `xxxAsync` 函数**不是**_挂起_函数。它们可以在任何地方使用。然而，它们的使用总是意味着它们的动作与调用代码是异步（这里指_并发_）执行的。

以下示例展示了它们在协程之外的使用：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

//sampleStart
// note that we don't have `runBlocking` to the right of `main` in this example
fun main() {
    val time = measureTimeMillis {
        // we can initiate async actions outside of a coroutine
        val one = somethingUsefulOneAsync()
        val two = somethingUsefulTwoAsync()
        // but waiting for a result must involve either suspending or blocking.
        // here we use `runBlocking { ... }` to block the main thread while waiting for the result
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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-04.kt)获取完整代码。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
The answer is 42
Completed in 1085 ms
-->

考虑一下，如果在 `val one = somethingUsefulOneAsync()` 这一行和 `one.await()` 表达式之间，代码中出现了一些逻辑错误，程序抛出异常，并且程序正在执行的操作中止了，会发生什么。通常，一个全局错误处理程序可以捕获这个异常，为开发人员记录和报告错误，但程序仍然可以继续执行其他操作。然而，在这里，尽管启动它的操作已经中止，`somethingUsefulOneAsync` 仍然在后台运行。这个问题在使用结构化并发时不会发生，如下一节所示。

## 使用 async 实现结构化并发

让我们将 [使用 async 并发](#concurrent-using-async) 示例重构为一个函数，该函数并发运行 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo` 并返回它们的组合结果。由于 [async] 是 [CoroutineScope] 的一个扩展函数，我们将使用 [coroutineScope][_coroutineScope] 函数来提供所需的协程作用域：

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```

这样，如果 `concurrentSum` 函数的代码内部出现问题并抛出异常，所有在其作用域内启动的协程都将被取消。

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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-05.kt)获取完整代码。
>
{style="note"}

我们仍然并发执行这两个操作，这从上述 `main` 函数的输出中可以明显看出：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

取消总是通过协程层次结构传播：

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
            delay(Long.MAX_VALUE) // Emulates very long computation
            42
        } finally {
            println("First child was cancelled")
        }
    }
    val two = async<Int> { 
        println("Second child throws an exception")
        throw ArithmeticException()
    }
    one.await() + two.await()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-06.kt -->
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-06.kt)获取完整代码。
>
{style="note"}

请注意，当其中一个子协程（即 `two`）失败时，第一个 `async` 和正在等待的父协程都如何被取消：
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