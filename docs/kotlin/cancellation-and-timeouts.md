<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 取消与超时)

取消操作允许你在协程完成之前将其停止。
它可以停止不再需要的工作，例如当协程仍在运行时，用户关闭了窗口或在用户界面中导航到了其他地方。
你还可以使用它来尽早释放资源，并防止协程在对象被销毁后继续访问它们。

> 你可以使用取消来停止那些即使在其他协程不再需要其结果时仍持续产生值的长运行协程，例如在[管道](channels.md#pipelines)中。
>
{style="tip"}

取消通过 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 句柄起作用，它代表了协程的生命周期及其父子关系。
根据[结构化并发](coroutines-basics.md#coroutine-scope-and-structured-concurrency)的定义，`Job` 允许你检查协程是否处于活跃状态，并允许你取消该协程及其子协程。

## 取消协程

当在协程的 `Job` 句柄上调用 [`cancel()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html) 函数时，该协程会被取消。
诸如 [`.launch()`](coroutines-basics.md#coroutinescope-launch) 之类的[协程构建器函数](coroutines-basics.md#coroutine-builder-functions)会返回一个 `Job`。[`.async()`](coroutines-basics.md#coroutinescope-async) 函数返回一个 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/)，它实现了 `Job` 并支持相同的取消行为。

你可以手动调用 `cancel()` 函数，也可以在父协程被取消时通过取消传播自动调用。

当协程被取消时，它会在下一次检查取消时抛出 [`CancellationException`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/)。
有关这种情况如何以及何时发生的更多信息，请参阅[挂起点与取消](#suspension-points-and-cancellation)。

> 你可以使用 [`awaitCancellation()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/await-cancellation.html) 函数挂起协程，直到它被取消。
>
{style="tip"}

以下是一个关于如何手动取消协程的示例：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 用作协程已开始运行的信号
        val job1Started = CompletableDeferred<Unit>()
        
        val job1: Job = launch {
            
            println("协程已启动")

            // 完成 CompletableDeferred，
            // 发出协程已开始运行的信号
            job1Started.complete(Unit)
            try {
                // 无限期挂起
                // 如果没有取消，此调用将永远不会返回
                delay(Duration.INFINITE)
            } catch (e: CancellationException) {
                println("协程被取消：$e")
              
                // 务必重新抛出 CancellationException！
                throw e
            }
            println("这一行永远不会被执行")
        }
      
        // 在取消 job1 之前等待它启动
        job1Started.await()

        // 取消协程，因此 delay() 会抛出 CancellationException
        job1.cancel()

        // async 返回一个 Deferred 句柄，它继承自 Job
        val job2 = async {
            // 如果协程在其主体开始执行之前被取消，
            // 这一行可能不会被打印
            println("第二个协程已启动")

            try {
                // 等同于 delay(Duration.INFINITE)
                // 挂起直到此协程被取消
                awaitCancellation()

            } catch (e: CancellationException) {
                println("第二个协程被取消")
                throw e
            }
        }
        job2.cancel()
    }
    // 诸如 withContext() 或 coroutineScope() 之类的协程构建器
    // 会等待所有子协程完成，
    // 即使子协程已被取消
    println("所有协程均已完成")
}
//sampleEnd
```
{kotlin-runnable="true" id="manual-cancellation-example"}

在此示例中，[`CompletableDeferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-completable-deferred/) 被用作协程已开始运行的信号。
协程在开始执行时调用 `complete()`，而 `await()` 仅在 `CompletableDeferred` 完成后才会返回。通过这种方式，取消操作仅在协程开始运行后发生。
由 `.async()` 创建的协程没有这种检查，因此它可能在运行其代码块内部的代码之前就被取消。

> 捕获 `CancellationException` 可能会破坏取消传播。
> 如果你必须捕获它，请重新抛出它，以使取消操作在协程层次结构中正确传播。
>
> 欲了解更多信息，请参阅[协程异常处理](exception-handling.md#cancellation-and-exceptions)。
>
{style="warning"}

### 取消传播

[结构化并发](coroutines-basics.md#coroutine-scope-and-structured-concurrency)确保取消一个协程时也会取消其所有子协程。
这可以防止子协程在父协程停止后继续工作。

示例如下：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 用作子协程已启动的信号
        val childrenLaunched = CompletableDeferred<Unit>()

        // 启动两个子协程
        val parentJob = launch {
            launch {
                println("子协程 1 已开始运行")
                try {
                    awaitCancellation()
                } finally {
                    println("子协程 1 已被取消")
                }
            }
            launch {
                println("子协程 2 已开始运行")
                try {
                    awaitCancellation()
                } finally {
                    println("子协程 2 已被取消")
                }
            }
            // 完成 CompletableDeferred，
            // 发出子协程已启动的信号
            childrenLaunched.complete(Unit)
        }
        // 等待父协程发出它已启动所有子协程的信号
        childrenLaunched.await()

        // 取消父协程，这将取消其所有子协程
        parentJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="cancellation-propagation-example"}

在此示例中，每个子协程都使用了一个 [`finally` 块](exceptions.md#the-finally-block)，因此其中的代码会在协程被取消时运行。
在这里，`CompletableDeferred` 发出子协程在被取消之前已启动的信号，但它并不保证它们开始运行。如果它们先被取消，则不会打印任何内容。

## 使协程对取消做出反应 {id="cancellation-is-cooperative"}

在 Kotlin 中，协程取消是*协作式*的。
这意味着协程仅在通过[挂起](#suspension-points-and-cancellation)或[显式检查取消](#check-for-cancellation-explicitly)进行协作时才会对取消做出反应。

在本节中，你可以学习如何创建可取消的协程。

### 挂起点与取消

当协程被取消时，它会继续运行，直到到达代码中可能挂起的地方，即所谓的*挂起点*。
如果协程在那里挂起，挂起函数会检查它是否已被取消。
如果已被取消，协程将停止并抛出 `CancellationException`。

调用 `suspend` 函数就是一个挂起点，但它并不总是会挂起。
例如，在等待 `Deferred` 结果时，只有在该 `Deferred` 尚未完成时，协程才会挂起。

以下是一个使用常见挂起函数的示例，这些函数会挂起，从而使协程能够在被取消时进行检查并停止：

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
                // 挂起直到被取消
                awaitCancellation()
            },
            launch {
                // 挂起直到被取消
                delay(Duration.INFINITE)
            },
            launch {
                val channel = Channel<Int>()
                // 挂起以等待一个永远不会发送的值
                channel.receive()
            },
            launch {
                val deferred = CompletableDeferred<Int>()
                // 挂起以等待一个永远不会完成的值
                deferred.await()
            },
            launch {
                val mutex = Mutex(locked = true)
                // 挂起以等待一个无限期保持锁定状态的互斥锁
                mutex.lock()
            }
        )
        
        // 给子协程留出启动和挂起的时间
        delay(100.milliseconds)
        
        // 取消所有子协程
        childJobs.forEach { it.cancel() }
    }
    println("所有子作业已完成！")
}
```
{kotlin-runnable="true" id="suspension-points-example"}

> `kotlinx.coroutines` 库中的所有挂起函数都是协作取消的，因为它们内部使用了 [`suspendCancellableCoroutine()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/suspend-cancellable-coroutine.html)，它会在协程挂起时检查取消。
> 相比之下，使用 [`suspendCoroutine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/suspend-coroutine.html) 的自定义挂起函数不会对取消做出反应。
>
{style="tip"}

### 显式检查取消

如果协程长时间不[挂起](#suspension-points-and-cancellation)，除非它显式检查取消，否则它在被取消时不会停止。

要检查取消情况，请使用以下 API：

* 当协程被取消时，[`isActive`](#isactive) 属性为 `false`。
* 如果协程被取消，[`ensureActive()`](#ensureactive) 函数会立即抛出 `CancellationException`。
* [`yield()`](#yield) 函数挂起协程，释放线程并让其他协程有机会在其上运行。挂起协程可以让它检查取消情况，并在被取消时抛出 `CancellationException`。

当你的协程在挂起点之间运行很长时间，或者不太可能在挂起点挂起时，这些 API 非常有用。

#### isActive

在长时间运行的计算中使用 [`isActive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html) 属性来定期检查取消情况。
当协程不再处于活跃状态时，此属性为 `false`，你可以利用它在协程不再需要继续操作时优雅地停止它：

示例如下：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds
import kotlin.random.Random

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val unsortedList = MutableList(10) { Random.nextInt() }
        
        // 开始一个长时间运行的计算
        val listSortingJob = launch {
            var i = 0

            // 当协程保持活跃状态时重复排序列表
            while (isActive) {
                unsortedList.sort()
                ++i
            }
            println(
                "在 $i 次迭代后停止排序列表"
            )
        }
        // 对列表进行 100 毫秒的排序，然后认为它已经足够有序
        delay(100.milliseconds)

        // 当结果足够好时取消排序        
        listSortingJob.cancel()

        // 在访问共享列表之前等待排序协程完成，
        // 以避免数据竞争
        listSortingJob.join()
        println("列表可能已排序：$unsortedList")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="isactive-example"}

在此示例中，[`join()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html) 函数会挂起协程直到它完成。这确保了在排序协程仍在运行时不会访问列表。

> 你可以使用 [`cancelAndJoin()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html) 函数在一次调用中取消协程并等待其完成。
>
{style="note"}

#### ensureActive()

使用 [`ensureActive()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html) 函数来检查取消情况，如果协程已取消，则通过抛出 `CancellationException` 来停止当前计算：

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
                    // 检查当前数字的考拉兹猜想
                    var n = start
                    while (n != 1) {
                        // 如果协程被取消，则抛出 CancellationException
                        ensureActive()
                        n = if (n % 2 == 0) n / 2 else 3 * n + 1
                    }
                }
            } finally {
                println("已检查 0..${start-1} 的考拉兹猜想")
            }
        }
        // 运行计算一秒钟
        delay(100.milliseconds)

        // 取消协程
        childJob.cancel()
    }
}
```
{kotlin-runnable="true" id="ensurective-example"}

#### yield()

[`yield()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html) 函数挂起协程并在恢复前检查取消情况。
如果不挂起，同一线程上的协程将按顺序运行。

使用 `yield` 允许其他协程在其中一个协程完成之前在同一线程或线程池上运行：

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() {
    // runBlocking 使用当前线程运行所有协程
    runBlocking {
        val coroutineCount = 5
        repeat(coroutineCount) { coroutineIndex ->
            launch {
                val id = coroutineIndex + 1
                repeat(5) { iterationIndex ->
                    val iteration = iterationIndex + 1
                    // 暂时挂起以给其他协程运行的机会
                    // 如果没有这个，协程将按顺序运行
                    yield()
                    // 打印协程索引和迭代索引
                    println("$id * $iteration = ${id * iteration}")
                }
            }
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="yield-example"}

在此示例中，每个协程使用 `yield()` 让其他协程在迭代之间运行。

### 在协程被取消时中断阻塞代码

在 JVM 上，某些函数（如 `Thread.sleep()` 或 `BlockingQueue.take()`）可能会阻塞当前线程。
这些阻塞函数可以被中断，从而提前停止。
但是，当你从协程调用它们时，取消操作不会中断线程。

要在取消协程时中断线程，请使用 [`runInterruptible()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-interruptible.html) 函数：

```kotlin
import kotlinx.coroutines.*

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val childStarted = CompletableDeferred<Unit>()
        val childJob = launch {
            try {
                // 取消会触发线程中断
                runInterruptible {
                    childStarted.complete(Unit)
                    try {
                        // 阻塞当前线程非常长的时间
                        Thread.sleep(Long.MAX_VALUE)
                    } catch (e: InterruptedException) {
                        println("线程已中断 (Java)：$e")
                        throw e
                    }
                }
            } catch (e: CancellationException) {
                println("协程已取消 (Kotlin)：$e")
                throw e
            }
        }
        childStarted.await()

        // 取消协程并中断运行 Thread.sleep() 的线程
        childJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="interrupt-cancellation-example"}

## 取消协程时安全处理值

当一个被挂起的协程被取消时，它会以 `CancellationException` 恢复，而不是返回任何值，即使这些值已经可用。
这种行为被称为*即时取消*（prompt cancellation）。
它可以防止你的代码在已取消的协程作用域内继续运行，例如更新一个已经关闭的屏幕。

示例如下：

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// 定义一个使用 UI 线程的协程作用域
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
            // 在这里调用 updateUi 是安全的，
            // 万一发生取消，withContext() 不会返回任何值
            updateUi(contents)
        }
    }

    // 如果在用户离开屏幕后调用，则抛出异常
    private fun updateUi(contents: List<String>) {
      contents.forEach { line -> addOneLineToUi(line) }
    }
  
    private fun addOneLineToUi(line: String) {
        // 用于向 UI 添加一行的代码占位符
    }

    // 只能从 UI 线程调用
    fun leaveScreen() {
        // 离开屏幕时取消作用域
        // 你将无法再更新 UI
        scope.cancel()
    }
}
```

在此示例中，`withContext(Dispatchers.IO)` 协作取消，并防止在 `leaveScreen()` 函数于协程返回文件内容之前取消协程的情况下运行 `updateUI()`。

虽然即时取消可以防止在值不再有效后使用它们，但它也可能在重要值仍在使用时停止你的代码，这可能导致丢失该值。
当协程接收到一个值（例如 `AutoCloseable` 资源），但在到达关闭该资源的代码部分之前被取消时，就会发生这种情况。
为了防止这种情况，请将清理逻辑放在保证即使接收值的协程被取消也会运行的地方。

示例如下：

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// scope 是一个使用 UI 线程的协程作用域
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            // 将 reader 存储在变量中，以便 finally 块可以关闭它
            var reader: BufferedReader? = null
            
            try {
                withContext(Dispatchers.IO) {
                    reader = Files.newBufferedReader(
                        path, Charset.forName("US-ASCII")
                    )
                }
                // 在 withContext() 完成后使用存储的 reader
                updateUi(reader!!)
            } finally {
                // 确保即使协程被取消也能关闭 reader
                reader?.close()
            }
        }
    }

    private suspend fun updateUi(reader: BufferedReader) {
        // 显示文件内容
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
        // 用于向 UI 添加一行的代码占位符
    }

    // 只能从 UI 线程调用
    fun leaveScreen() {
        // 离开屏幕时取消作用域
        // 你将无法再更新 UI
        scope.cancel()
    }
}
```

在此示例中，将 `BufferedReader` 存储在变量中并在 `finally` 块中关闭它，可确保即使协程被取消也能释放资源。

### 运行不可取消块

你可以防止取消操作影响协程的某些部分。
为此，请将 [`NonCancellable`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/) 作为参数传递给 `withContext()` 协程构建器函数。

> 避免将 `NonCancellable` 与 `.launch()` 或 `.async()` 等其他协程构建器一起使用。这样做会破坏父子关系，从而扰乱结构化并发。
>
{style="warning"}

当你需要确保某些操作（例如使用挂起的 `close()` 函数关闭资源）即使协程在完成前被取消也能顺利完成时，`NonCancellable` 非常有用。

示例如下：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

//sampleStart
val serviceStarted = CompletableDeferred<Unit>()

fun startService() {
    println("正在启动服务...")
    serviceStarted.complete(Unit)
}

suspend fun shutdownServiceAndWait() {
    println("正在关闭...")
    delay(100.milliseconds)
    println("成功关闭！")
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJob = launch {
            startService()
            try {
                awaitCancellation()
            } finally {
                withContext(NonCancellable) {
                    // 如果没有 withContext(NonCancellable)，
                    // 此函数将无法完成，因为协程已被取消
                    shutdownServiceAndWait()
                }
            }
        }
        serviceStarted.await()
        childJob.cancel()
    }
    println("正在退出程序")
}
//sampleEnd
```
{kotlin-runnable="true" id="noncancellable-blocks-example"}

## 超时

超时允许你在指定的持续时间后自动取消协程。
它们对于停止耗时过长的操作非常有用，有助于保持应用程序的响应性并避免不必要的线程阻塞。

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
        println("慢操作已被取消：$e")
        throw e
    }
}

suspend fun fastOperation(): Int {
    try {
        delay(15.milliseconds)
        return 14
    } catch (e: CancellationException) {
        println("快操作已被取消：$e")
        throw e
    }
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        val slow = withTimeoutOrNull(100.milliseconds) {
            slowOperation()
        }
        println("慢操作结束，结果为 $slow")
        val fast = withTimeoutOrNull(100.milliseconds) {
            fastOperation()
        }
        println("快操作结束，结果为 $fast")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="timeout-example"}

如果超时超过了指定的 `Duration`，`withTimeoutOrNull()` 将返回 `null`。