<!--- TEST_NAME ExceptionsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 协程异常处理)

本节涵盖了异常处理以及异常情况下的取消。
我们已经知道，已取消的协程会在挂起点抛出 `CancellationException`，并且它会被协程机制忽略。这里我们将探讨如果在取消期间抛出异常，或者同一个协程的多个子协程抛出异常时会发生什么。

## 异常传播

协程构建器有两种形式：自动传播异常（`launch`）或将其暴露给用户（`async` 和 `produce`）。
当这些构建器用于创建一个**根**协程（即不是另一个协程的**子**协程）时，前者会将异常视为**未捕获**异常，类似于 Java 的 `Thread.uncaughtExceptionHandler`；而后者则依赖用户来消费最终异常，例如通过 `await` 或 `receive`（`produce` 和 `receive` 在 [Channels](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/channels.md) 章节中有所介绍）。

可以通过一个使用 `GlobalScope` 创建根协程的简单示例来演示：

> `GlobalScope` 是一个精细的 API，可能会以不寻常的方式适得其反。为整个应用程序创建一个根协程是 `GlobalScope` 少数合法的用途之一，因此你必须显式选择启用使用 `GlobalScope` 并添加 `@OptIn(DelicateCoroutinesApi::class)`。
>
{style="note"}

```kotlin
import kotlinx.coroutines.*

//sampleStart
@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val job = GlobalScope.launch { // 使用 launch 的根协程
        println("Throwing exception from launch")
        throw IndexOutOfBoundsException() // 将由 Thread.defaultUncaughtExceptionHandler 打印到控制台
    }
    job.join()
    println("Joined failed job")
    val deferred = GlobalScope.async { // 使用 async 的根协程
        println("Throwing exception from async")
        throw ArithmeticException() // 不会打印任何内容，依赖用户调用 await
    }
    try {
        deferred.await()
        println("Unreached")
    } catch (e: ArithmeticException) {
        println("Caught ArithmeticException")
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-01.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-01.kt)获取完整代码。
>
{style="note"}

这段代码的输出是（在[调试](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/coroutine-context-and-dispatchers.md#debugging-coroutines-and-threads)模式下）：

```text
Throwing exception from launch
Exception in thread "DefaultDispatcher-worker-1 @coroutine#2" java.lang.IndexOutOfBoundsException
Joined failed job
Throwing exception from async
Caught ArithmeticException
```

<!--- TEST EXCEPTION-->

## CoroutineExceptionHandler

可以自定义将**未捕获**异常打印到控制台的默认行为。
`CoroutineExceptionHandler` 上下文元素在**根**协程上可用作一个通用的 `catch` 代码块，用于该根协程及其所有子协程，可以在其中进行自定义异常处理。
它类似于 `Thread.uncaughtExceptionHandler`。
你无法在 `CoroutineExceptionHandler` 中从异常中恢复。当处理程序被调用时，协程已经因相应的异常而完成。通常，此处理程序用于记录异常、显示某种错误消息、终止和/或重新启动应用程序。

`CoroutineExceptionHandler` 仅在**未捕获**异常上被调用 — 即未以任何其他方式处理的异常。
特别是，所有**子**协程（在另一个 `Job` 上下文中创建的协程）都会将其异常的处理委托给其父协程，父协程再委托给其父协程，依此类推直到根协程，因此安装在其上下文中的 `CoroutineExceptionHandler` 永远不会被使用。
除此之外，`async` 构建器总是捕获所有异常并将其表示在结果的 `Deferred` 对象中，因此其 `CoroutineExceptionHandler` 也不会有任何作用。

> 在监督作用域中运行的协程不会将异常传播给其父协程，因此不受此规则约束。本文档的后续[监督](#supervision)章节会提供更多详细信息。
>
{style="note"}  

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandler got $exception") 
    }
    val job = GlobalScope.launch(handler) { // 根协程，在 GlobalScope 中运行
        throw AssertionError()
    }
    val deferred = GlobalScope.async(handler) { // 也是根协程，但使用 async 而非 launch
        throw ArithmeticException() // 不会打印任何内容，依赖用户调用 await
    }
    joinAll(job, deferred)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-02.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-02.kt)获取完整代码。
>
{style="note"}

这段代码的输出是：

```text
CoroutineExceptionHandler got java.lang.AssertionError
```

<!--- TEST-->

## 取消与异常

取消与异常密切相关。协程内部使用 `CancellationException` 进行取消，所有处理程序都会忽略这些异常，因此它们应该仅用作额外调试信息的来源，这些信息可以通过 `catch` 代码块获取。
当一个协程使用 `Job.cancel` 取消时，它会终止，但它不会取消其父协程。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        val child = launch {
            try {
                delay(Long.MAX_VALUE)
            } finally {
                println("Child is cancelled") // 子协程已取消
            }
        }
        yield()
        println("Cancelling child") // 正在取消子协程
        child.cancel()
        child.join()
        yield()
        println("Parent is not cancelled") // 父协程未取消
    }
    job.join()
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-03.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-03.kt)获取完整代码。
>
{style="note"}

这段代码的输出是：

```text
Cancelling child
Child is cancelled
Parent is not cancelled
```

<!--- TEST-->

如果协程遇到 `CancellationException` 之外的异常，它会用该异常取消其父协程。这种行为无法被覆盖，并用于为[结构化并发](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/composing-suspending-functions.md#structured-concurrency-with-async)提供稳定的协程层次结构。
`CoroutineExceptionHandler` 实现不用于子协程。

> 在这些示例中，`CoroutineExceptionHandler` 总是安装在 `GlobalScope` 中创建的协程上。将异常处理程序安装到在主 `runBlocking` 作用域中启动的协程上是没有意义的，因为即使安装了处理程序，当其子协程因异常完成时，主协程也总是会被取消。
>
{style="note"}

原始异常只有当所有子协程终止时才由父协程处理，这由以下示例演示。

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandler got $exception") 
    }
    val job = GlobalScope.launch(handler) {
        launch { // 第一个子协程
            try {
                delay(Long.MAX_VALUE)
            } finally {
                withContext(NonCancellable) {
                    println("Children are cancelled, but exception is not handled until all children terminate") // 子协程已取消，但在所有子协程终止之前，异常不会被处理
                    delay(100)
                    println("The first child finished its non cancellable block") // 第一个子协程完成了其不可取消的代码块
                }
            }
        }
        launch { // 第二个子协程
            delay(10)
            println("Second child throws an exception") // 第二个子协程抛出异常
            throw ArithmeticException()
        }
    }
    job.join()
//sampleEnd 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-04.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-04.kt)获取完整代码。
>
{style="note"}

这段代码的输出是：

```text
Second child throws an exception
Children are cancelled, but exception is not handled until all children terminate
The first child finished its non cancellable block
CoroutineExceptionHandler got java.lang.ArithmeticException
```

<!--- TEST-->

## 异常聚合

当一个协程的多个子协程因异常失败时，一般规则是“第一个异常获胜”，因此第一个异常会得到处理。
第一个异常之后发生的所有额外异常都会作为被抑制的异常附加到第一个异常上。

<!--- INCLUDE
import kotlinx.coroutines.exceptions.*
-->

```kotlin
import kotlinx.coroutines.*
import java.io.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception with suppressed ${exception.suppressed.contentToString()}")
    }
    val job = GlobalScope.launch(handler) {
        launch {
            try {
                delay(Long.MAX_VALUE) // 当另一个同级协程因 IOException 失败时，它会被取消
            } finally {
                throw ArithmeticException() // 第二个异常
            }
        }
        launch {
            delay(100)
            throw IOException() // 第一个异常
        }
        delay(Long.MAX_VALUE)
    }
    job.join()  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-05.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-05.kt)获取完整代码。
>
{style="note"}

这段代码的输出是：

```text
CoroutineExceptionHandler got java.io.IOException with suppressed [java.lang.ArithmeticException]
```

<!--- TEST-->

> 请注意，该机制目前仅适用于 Java 1.7+ 版本。JS 和 Native 的限制是临时的，将在未来解除。
>
{style="note"}

取消异常是透明的，并且默认情况下会被解包：

```kotlin
import kotlinx.coroutines.*
import java.io.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception")
    }
    val job = GlobalScope.launch(handler) {
        val innerJob = launch { // 所有这些协程栈都将被取消
            launch {
                launch {
                    throw IOException() // 原始异常
                }
            }
        }
        try {
            innerJob.join()
        } catch (e: CancellationException) {
            println("Rethrowing CancellationException with original cause") // 重新抛出带有原始原因的 CancellationException
            throw e // 取消异常被重新抛出，但原始的 IOException 仍然会传给处理程序
        }
    }
    job.join()
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-06.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-06.kt)获取完整代码。
>
{style="note"}

这段代码的输出是：

```text
Rethrowing CancellationException with original cause
CoroutineExceptionHandler got java.io.IOException
```

<!--- TEST-->

## 监督

正如我们之前学过的，取消是一种双向关系，在整个协程层次结构中传播。让我们来看看需要单向取消的情况。

一个很好的例子是，其作用域中定义了 job 的 UI 组件。如果任何 UI 的子任务失败，并非总是需要取消（实际终止）整个 UI 组件，但如果 UI 组件被销毁（并且其 job 被取消），那么有必要取消所有子 job，因为它们的结果不再需要。

另一个例子是服务器进程，它启动多个子 job，并需要**监督**它们的执行，跟踪它们的失败并只重新启动失败的那些。

### 监督 job

`SupervisorJob` 可用于这些目的。
它类似于一个普通的 `Job`，唯一的例外是取消只向下传播。这可以通过以下示例轻松演示：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val supervisor = SupervisorJob()
    with(CoroutineScope(coroutineContext + supervisor)) {
        // 启动第一个子协程——在这个例子中其异常被忽略（实践中不要这样做！）
        val firstChild = launch(CoroutineExceptionHandler { _, _ ->  }) {
            println("The first child is failing") // 第一个子协程正在失败
            throw AssertionError("The first child is cancelled") // 抛出 AssertionError("第一个子协程已取消")
        }
        // 启动第二个子协程
        val secondChild = launch {
            firstChild.join()
            // 第一个子协程的取消不会传播到第二个子协程
            println("The first child is cancelled: ${firstChild.isCancelled}, but the second one is still active") // 第一个子协程已取消：${firstChild.isCancelled}，但第二个仍在活动
            try {
                delay(Long.MAX_VALUE)
            } finally {
                // 但 supervisor 的取消会传播
                println("The second child is cancelled because the supervisor was cancelled") // 第二个子协程被取消，因为 supervisor 被取消了
            }
        }
        // 等待第一个子协程失败并完成
        firstChild.join()
        println("Cancelling the supervisor") // 正在取消 supervisor
        supervisor.cancel()
        secondChild.join()
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-01.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-01.kt)获取完整代码。
>
{style="note"}

这段代码的输出是：

```text
The first child is failing
The first child is cancelled: true, but the second one is still active
Cancelling the supervisor
The second child is cancelled because the supervisor was cancelled
```

<!--- TEST-->

### 监督作用域

与 `coroutineScope` 不同，我们可以使用 `supervisorScope` 进行**作用域**并发。它只在一个方向上传播取消，并且只有当自身失败时才取消所有子协程。它也像 `coroutineScope` 一样，在完成之前等待所有子协程。

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    try {
        supervisorScope {
            val child = launch {
                try {
                    println("The child is sleeping") // 子协程正在休眠
                    delay(Long.MAX_VALUE)
                } finally {
                    println("The child is cancelled") // 子协程已取消
                }
            }
            // 给子协程一个使用 yield 执行和打印的机会
            yield()
            println("Throwing an exception from the scope") // 从作用域中抛出异常
            throw AssertionError()
        }
    } catch(e: AssertionError) {
        println("Caught an assertion error") // 捕获到一个断言错误
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-02.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-02.kt)获取完整代码。
>
{style="note"}

这段代码的输出是：

```text
The child is sleeping
Throwing an exception from the scope
The child is cancelled
Caught an assertion error
```

<!--- TEST-->

#### 监督协程中的异常

普通 job 和监督 job 之间的另一个关键区别是异常处理。
每个子协程都应该通过异常处理机制自己处理其异常。
这种差异源于子协程的失败不会传播到父协程这一事实。
这意味着直接在 `supervisorScope` 中启动的协程**确实**会以与根协程相同的方式使用安装在其作用域中的 `CoroutineExceptionHandler`（有关详细信息，请参见[CoroutineExceptionHandler](#coroutineexceptionhandler)章节）。

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandler got $exception") 
    }
    supervisorScope {
        val child = launch(handler) {
            println("The child throws an exception") // 子协程抛出异常
            throw AssertionError()
        }
        println("The scope is completing") // 作用域正在完成
    }
    println("The scope is completed") // 作用域已完成
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-03.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-03.kt)获取完整代码。
>
{style="note"}

这段代码的输出是：

```text
The scope is completing
The child throws an exception
CoroutineExceptionHandler got java.lang.AssertionError
The scope is completed
```

<!--- TEST-->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[CancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[Deferred.await]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html
[GlobalScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[CoroutineExceptionHandler]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/index.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Deferred]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/index.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[SupervisorJob()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-supervisor-job.html
[Job()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[_supervisorScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html

<!--- INDEX kotlinx.coroutines.channels -->

[produce]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/produce.html
[ReceiveChannel.receive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html

<!--- END -->