<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 取消与超时)

取消功能让你可以在协程完成之前将其停止。
它会停止不再需要的工作，例如当用户关闭窗口或在用户界面中导航离开时，而协程仍在运行时。
你也可以使用它来提早释放资源，并阻止协程在对象被处置后继续访问它们。

> 你可以使用取消功能来停止长时间运行的协程，即使其他协程不再需要它们产生的值，例如在[流水线](channels.md#pipelines)中。
>
{style="tip"}

取消通过 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 句柄实现，该句柄表示协程的生命周期及其父子关系。
`Job` 允许你检查协程是否活跃，并允许你根据[结构化并发](coroutines-basics.md#coroutine-scope-and-structured-concurrency)的定义取消它及其所有子协程。

## 取消协程

当在其 `Job` 句柄上调用 [`cancel()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html) 函数时，协程会被取消。
[协程构建器函数](coroutines-basics.md#coroutine-builder-functions)（例如 [`.launch()`](coroutines-basics.md#coroutinescope-launch)）返回一个 `Job`。 [`.async()`](coroutines-basics.md#coroutinescope-async) 函数返回一个 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/)，它实现了 `Job` 并支持相同的取消行为。

你可以手动调用 `cancel()` 函数，或者当父协程被取消时，通过取消传播自动调用该函数。

当协程被取消时，它会在下一次检查取消时抛出 [`CancellationException`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/)。
关于这种情况发生的方式和时间，请参见[挂起点与取消](#suspension-points-and-cancellation)。

> 你可以使用 [`awaitCancellation()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/await-cancellation.html) 函数挂起协程，直到它被取消。
>
{style="tip"}

以下是手动取消协程的示例：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // Used as a signal that the coroutine has started running
        val job1Started = CompletableDeferred<Unit>()
        
        val job1: Job = launch {
            
            println("The coroutine has started")

            // Completes the CompletableDeferred,
            // signaling that the coroutine has started running
            job1Started.complete(Unit)
            try {
                // Suspends indefinitely
                // Without cancellation, this call would never return
                delay(Duration.INFINITE)
            } catch (e: CancellationException) {
                println("The coroutine was canceled: $e")
              
                // Always rethrow cancellation exceptions!
                throw e
            }
            println("This line will never be executed")
        }
      
        // Waits for job1 to start before canceling it
        job1Started.await()

        // Cancels the coroutine, so delay() throws a CancellationException
        job1.cancel()

        // async returns a Deferred handle, which inherits from Job
        val job2 = async {
                  // If the coroutine is canceled before its body starts executing,
                  // this line may not be printed
                  println("The second coroutine has started")

            try {
                // Equivalent to delay(Duration.INFINITE)
                // Suspends until this coroutine is canceled
                awaitCancellation()

            } catch (e: CancellationException) {
                println("The second coroutine was canceled")
                throw e
            }
        }
        job2.cancel()
    }
    // Coroutine builders such as withContext() or coroutineScope()
    // wait for all child coroutines to complete,
    // even when the children are canceled
    println("All coroutines have completed")
}
//sampleEnd
```
{kotlin-runnable="true" id="manual-cancellation-example"}

在此示例中，[`CompletableDeferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-completable-deferred/) 用作协程已开始运行的信号。
协程在开始执行时调用 `complete()`，而 `await()` 只有在 `CompletableDeferred` 完成后才会返回。通过这种方式，取消只会在协程开始运行后发生。
通过 `.async()` 创建的协程没有此检测，因此它可能在其代码块内部的代码运行之前就被取消。

> 捕获 `CancellationException` 可能会破坏取消传播。
> 如果你必须捕获它，请重新抛出它，以使取消能够正确地通过协程层次结构传播。
>
> 关于更多信息，请参见[协程异常处理](exception-handling.md#cancellation-and-exceptions)。
>
{style="warning"}

### 取消传播

[结构化并发](coroutines-basics.md#coroutine-scope-and-structured-concurrency) 确保取消一个协程也会取消其所有子协程。
这可以防止子协程在父协程停止后继续工作。

以下是一个示例：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // Used as a signal that the child coroutines have been launched
        val childrenLaunched = CompletableDeferred<Unit>()

        // Launches two child coroutines
        val parentJob = launch {
            launch {
                println("Child coroutine 1 has started running")
                try {
                    awaitCancellation()
                } finally {
                    println("Child coroutine 1 has been canceled")
                }
            }
            launch {
                println("Child coroutine 2 has started running")
                try {
                    awaitCancellation()
                } finally {
                    println("Child coroutine 2 has been canceled")
                }
            }
            // Completes the CompletableDeferred,
            // signaling that the child coroutines have been launched
            childrenLaunched.complete(Unit)
        }
        // Waits for the parent coroutine to signal that it has launched
        // all of its children
        childrenLaunched.await()

        // Cancels the parent coroutine, which cancels all its children
        parentJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="cancellation-propagation-example"}

在此示例中，每个子协程都使用 [`finally` 代码块](exceptions.md#the-finally-block)，因此其中的代码在协程被取消时运行。
在这里，`CompletableDeferred` 表示子协程在被取消之前已启动，但它不保证它们会开始运行。如果它们先被取消，则不会打印任何内容。

## 让协程响应取消 {id="cancellation-is-cooperative"}

在 Kotlin 中，协程取消是_协作性的_。
这意味着协程只有在通过[挂起](#suspension-points-and-cancellation)或[显式检测取消](#check-for-cancellation-explicitly)进行协作时，才会响应取消。

在本节中，你将学习如何创建可取消的协程。

### 挂起点与取消

当协程被取消时，它会继续运行，直到代码中可能挂起的位置，也称为_挂起点_。
如果协程在该处挂起，挂起函数会检测它是否已被取消。
如果已被取消，协程会停止并抛出 `CancellationException`。

调用 `suspend` 函数是一个挂起点，但它并不总是挂起。
例如，当等待 `Deferred` 结果时，协程仅在该 `Deferred` 尚未完成时才会挂起。

以下是使用常见挂起函数的示例，这些函数会挂起，从而使协程能够在取消时进行检测并停止：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.channels.Channel
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJobs = listOf(
            launch {
                // Suspends until canceled
                awaitCancellation()
            },
            launch {
                // Suspends until canceled
                delay(Duration.INFINITE)
            },
            launch {
                val channel = Channel<Int>()
                // Suspends while waiting for a value that is never sent
                channel.receive()
            },
            launch {
                val deferred = CompletableDeferred<Int>()
                // Suspends while waiting for a value that is never completed
                deferred.await()
            },
            launch {
                val mutex = Mutex(locked = true)
                // Suspends while waiting for a mutex that remains locked indefinitely
                mutex.lock()
            }
        )
        
        // Gives the child coroutines time to start and suspend
        delay(100.milliseconds)
        
        // Cancels all child coroutines
        childJobs.forEach { it.cancel() }
    }
    println("All child jobs completed!")
}
```
{kotlin-runnable="true" id="suspension-points-example"}

> `kotlinx.coroutines` 库中的所有挂起函数都与取消协作，因为它们内部使用了 [`suspendCancellableCoroutine()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/suspend-cancellable-coroutine.html)，该函数会在协程挂起时检测取消。
> 相比之下，使用 [`suspendCoroutine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/suspend-coroutine.html) 的自定义挂起函数不会响应取消。
>
{style="tip"}

### 显式检测取消

如果协程长时间不[挂起](#suspension-points-and-cancellation)，那么除非它显式检测取消，否则在被取消时不会停止。

要检测取消，请使用以下 API：

*   当协程被取消时，[`isActive`](#isactive) 属性为 `false`。
*   如果协程被取消，[`ensureActive()`](#ensureactive) 函数会立即抛出 `CancellationException`。
*   [`yield()`](#yield) 函数会挂起协程，释放线程并让其他协程有机会在其上运行。挂起协程使其能够检测取消并在被取消时抛出 `CancellationException`。

当你的协程在挂起点之间长时间运行，或者不太可能在挂起点挂起时，这些 API 会很有用。

#### isActive

在长时间运行的计算中，使用 [`isActive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html) 属性来定期检测取消。
当协程不再活跃时，此属性为 `false`，你可以利用它在协程不再需要继续操作时优雅地停止它：

以下是一个示例：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds
import kotlin.random.Random

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val unsortedList = MutableList(10) { Random.nextInt() }
        
        // Starts a long-running computation
        val listSortingJob = launch {
            var i = 0

            // Repeatedly sorts the list while the coroutine remains active
            while (isActive) {
                unsortedList.sort()
                ++i
            }
            println(
                "Stopped sorting the list after $i iterations"
            )
        }
        // Sorts the list for 100 milliseconds, then considers it sorted enough
        delay(100.milliseconds)

        // Cancels the sorting when the result is good enough        
        listSortingJob.cancel()

        // Waits until the sorting coroutine finishes
        // before accessing the shared list to avoid data races
        listSortingJob.join()
        println("The list is probably sorted: $unsortedList")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="isactive-example"}

在此示例中，[`join()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html) 函数会挂起协程直到其完成。这确保了在排序协程仍在运行时不会访问该列表。

> 你可以使用 [`cancelAndJoin()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html) 函数来取消一个协程并等待其完成，这只需一次调用即可。
>
{style="note"}

#### ensureActive()

使用 [`ensureActive()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html) 函数来检测取消，如果协程被取消，则通过抛出 `CancellationException` 来停止当前计算：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJob = launch {
            var start = 0
            try {
                while (true) {
                    ++start
                    // Checks the Collatz conjecture for the current number
                    var n = start
                    while (n != 1) {
                        // Throws CancellationException if the coroutine is canceled
                        ensureActive()
                        n = if (n % 2 == 0) n / 2 else 3 * n + 1
                    }
                }
            } finally {
                println("Checked the Collatz conjecture for 0..${start-1}")
            }
        }
        // Runs the computation for one second
        delay(100.milliseconds)

        // Cancels the coroutine
        childJob.cancel()
    }
}
```
{kotlin-runnable="true" id="ensurective-example"}

#### yield()

[`yield()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html) 函数会挂起协程，并在恢复之前检测取消。
如果不挂起，同一线程上的协程会按顺序运行。

使用 `yield` 允许其他协程在同一线程或线程池上运行，直到其中一个协程完成：

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() {
    // runBlocking uses the current thread for running all coroutines
    runBlocking {
        val coroutineCount = 5
        repeat(coroutineCount) { coroutineIndex ->
            launch {
                val id = coroutineIndex + 1
                repeat(5) { iterationIndex ->
                    val iteration = iterationIndex + 1
                    // Temporarily suspends to give other coroutines a chance to run
                    // Without this, the coroutines run sequentially
                    yield()
                    // Prints the coroutine index and iteration index
                    println("$id * $iteration = ${id * iteration}")
                }
            }
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="yield-example"}

在此示例中，每个协程都使用 `yield()` 来让其他协程在迭代之间运行。

### 在协程被取消时中断阻塞代码

在 JVM 上，某些函数（例如 `Thread.sleep()` 或 `BlockingQueue.take()`）可能会阻塞当前线程。
这些阻塞函数可以被中断，从而提前停止它们。
然而，当你从协程中调用它们时，取消并不会中断线程。

要在取消协程时中断线程，请使用 [`runInterruptible()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-interruptible.html) 函数：

```kotlin
import kotlinx.coroutines.*

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val childStarted = CompletableDeferred<Unit>()
        val childJob = launch {
            try {
                // Cancellation triggers a thread interruption
                runInterruptible {
                    childStarted.complete(Unit)
                    try {
                        // Blocks the current thread for a very long time
                        Thread.sleep(Long.MAX_VALUE)
                    } catch (e: InterruptedException) {
                        println("Thread interrupted (Java): $e")
                        throw e
                    }
                }
            } catch (e: CancellationException) {
                println("Coroutine canceled (Kotlin): $e")
                throw e
            }
        }
        childStarted.await()

        // Cancels the coroutine and interrupts the thread
        // by running Thread.sleep()
        childJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="interrupt-cancellation-example"}

## 在取消协程时安全地处理值

当挂起的协程被取消时，它会以 `CancellationException` 恢复，而不是返回任何值，即使这些值已经可用。
这种行为称为_即时取消_。
它会阻止你的代码在已取消的协程作用域内继续执行，例如更新已关闭的屏幕。

以下是一个示例：

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// Defines a coroutine scope that uses the UI thread
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            val contents = withContext(Dispatchers.IO) {
                Files.newBufferedReader(
                    path, Charset.forName("US-ASCII")
                ).use {
                    it.readLines()
                }
            }
            // It's safe to call updateUi here,
            // In case of cancellation, withContext() wouldn't return any values
            updateUi(contents)
        }
    }

    // Throws an exception if called after the user left the screen
    private fun updateUi(contents: List<String>) {
      contents.forEach { line -> addOneLineToUi(line) }
    }
  
    private fun addOneLineToUi(line: String) {
        // Placeholder for code that adds one line to the UI
    }

    // Only callable from the UI thread
    fun leaveScreen() {
        // Cancels the scope when leaving the screen
        // You can no longer update the UI
        scope.cancel()
    }
}
```

在此示例中，`withContext(Dispatchers.IO)` 与取消协作，如果 `leaveScreen()` 函数在协程返回文件内容之前取消了它，则会阻止 `updateUI()` 运行。

尽管即时取消可以防止在值不再有效时继续使用它们，但它也可能在重要值仍在使用时停止你的代码，这可能会导致该值的丢失。
当协程接收到一个值（例如 `AutoCloseable` 资源），但在它能够到达关闭该资源的代码部分之前就被取消时，可能会发生这种情况。
为防止这种情况发生，请将清理逻辑放在一个即使协程在接收值时被取消也保证会运行的地方。

以下是一个示例：

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// scope is a coroutine scope using the UI thread
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            // Stores the reader in a variable, so the finally block can close it
            var reader: BufferedReader? = null
            
            try {
                withContext(Dispatchers.IO) {
                    reader = Files.newBufferedReader(
                        path, Charset.forName("US-ASCII")
                    )
                }
                // Uses the stored reader after withContext() completes
                updateUi(reader!!)
            } finally {
                // Ensures the reader is closed even when the coroutine is canceled
                reader?.close()
            }
        }
    }

    private suspend fun updateUi(reader: BufferedReader) {
        // Shows the file contents
        while (true) {
            val line = withContext(Dispatchers.IO) {
                reader.readLine()
            }
            if (line == null)
                break
            addOneLineToUi(line)
        }
    }

    private fun addOneLineToUi(line: String) {
        // Placeholder for code that adds one line to the UI
    }

    // Only callable from the UI thread
    fun leaveScreen() {
        // Cancels the scope when leaving the screen
        // You can no longer update the UI
        scope.cancel()
    }
}
```

在此示例中，将 `BufferedReader` 存储在一个变量中并在 `finally` 代码块中将其关闭，确保了即使协程被取消，资源也会被释放。

### 运行不可取消的代码块

你可以阻止取消影响协程的某些部分。
为此，请将 [`NonCancellable`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/) 作为实参传递给 `withContext()` 协程构建器函数。

> 避免将 `NonCancellable` 与其他协程构建器（例如 `.launch()` 或 `.async()`）一起使用。这样做会通过破坏父子关系来扰乱结构化并发。
>
{style="warning"}

`NonCancellable` 在你需要确保某些操作（例如使用挂起 `close()` 函数关闭资源）即使在协程完成之前被取消也能完成时非常有用。

以下是一个示例：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

//sampleStart
val serviceStarted = CompletableDeferred<Unit>()

fun startService() {
    println("Starting the service...")
    serviceStarted.complete(Unit)
}

suspend fun shutdownServiceAndWait() {
    println("Shutting down...")
    delay(100.milliseconds)
    println("Successfully shut down!")
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJob = launch {
            startService()
            try {
                awaitCancellation()
            } finally {
                withContext(NonCancellable) {
                    // Without withContext(NonCancellable),
                    // This function doesn't complete because the coroutine is canceled
                    shutdownServiceAndWait()
                }
            }
        }
        serviceStarted.await()
        childJob.cancel()
    }
    println("Exiting the program")
}
//sampleEnd
```
{kotlin-runnable="true" id="noncancellable-blocks-example"}

## 超时

超时功能允许你在指定持续时间后自动取消协程。
它们有助于停止耗时过长的操作，从而保持应用程序的响应能力并避免不必要的线程阻塞。

要指定超时，请使用带有 `Duration` 的 [`withTimeoutOrNull()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html) 函数：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

//sampleStart
suspend fun slowOperation(): Int {
    try {
        delay(300.milliseconds)
        return 5
    } catch (e: CancellationException) {
        println("The slow operation has been canceled: $e")
        throw e
    }
}

suspend fun fastOperation(): Int {
    try {
        delay(15.milliseconds)
        return 14
    } catch (e: CancellationException) {
        println("The fast operation has been canceled: $e")
        throw e
    }
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        val slow = withTimeoutOrNull(100.milliseconds) {
            slowOperation()
        }
        println("The slow operation finished with $slow")
        val fast = withTimeoutOrNull(100.milliseconds) {
            fastOperation()
        }
        println("The fast operation finished with $fast")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="timeout-example"}

如果超时超过指定的 `Duration`，`withTimeoutOrNull()` 会返回 `null`。