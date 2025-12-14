<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 取消與超時)

取消功能讓您可以在協程完成前將其停止。它會停止不再需要的工作，例如當使用者關閉視窗或在使用者介面中導覽離開而協程仍在執行時。您也可以用它來提早釋放資源，並防止協程在物件被處置後仍存取它們。

> 您可以使用取消功能來停止長時間執行的協程，這些協程即使在其他協程不再需要它們後仍持續產生值，例如在 [管道](channels.md#pipelines) 中。
>
{style="tip"}

取消功能透過 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 句柄運作，它代表了協程的生命週期及其父子關係。`Job` 允許您檢查協程是否處於活動狀態，並允許您取消它及其子協程，這由 [結構化並行](coroutines-basics.md#coroutine-scope-and-structured-concurrency) 所定義。

## 取消協程

當在其 `Job` 句柄上呼叫 [`cancel()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html) 函式時，協程會被取消。[協程建構函式](coroutines-basics.md#coroutine-builder-functions)，例如 [`.launch()`](coroutines-basics.md#coroutinescope-launch)，會返回一個 `Job`。[`.async()`](coroutines-basics.md#coroutinescope-async) 函式會返回一個 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/)，它實作了 `Job` 並支援相同的取消行為。

您可以手動呼叫 `cancel()` 函式，或在父協程被取消時，透過取消傳播自動呼叫。

當協程被取消時，它會在下次檢查取消時拋出 [`CancellationException`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/)。有關此情況發生的方式和時機的更多資訊，請參閱 [暫停點與取消](#suspension-points-and-cancellation)。

> 您可以使用 [`awaitCancellation()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/await-cancellation.html) 函式來暫停協程，直到它被取消為止。
>
{style="tip"}

以下是手動取消協程的範例：

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

在此範例中，[`CompletableDeferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-completable-deferred/) 用作協程已開始執行的訊號。當協程開始執行時，它會呼叫 `complete()`，而 `await()` 只有在該 `CompletableDeferred` 完成後才會返回。這樣，取消只會在協程開始執行後發生。透過 `.async()` 建立的協程沒有此檢查，因此它可能會在其區塊內的程式碼執行前就被取消。

> 捕獲 `CancellationException` 可能會破壞取消傳播。
> 如果您必須捕獲它，請重新拋出它，以使取消正確地透過協程層次結構傳播。
>
> 有關更多資訊，請參閱 [協程例外處理](exception-handling.md#cancellation-and-exceptions)。
>
{style="warning"}

### 取消傳播

[結構化並行](coroutines-basics.md#coroutine-scope-and-structured-concurrency) 確保取消一個協程也會取消其所有子協程。這可以防止子協程在父協程已停止後繼續工作。

以下是範例：

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

在此範例中，每個子協程都使用 [`finally` 區塊](exceptions.md#the-finally-block)，因此當協程被取消時，其內部的程式碼會執行。在這裡，`CompletableDeferred` 發出訊號表示子協程在被取消前已啟動，但它不保證它們會開始執行。如果它們先被取消，則不會列印任何內容。

## 使協程響應取消 {id="cancellation-is-cooperative"}

在 Kotlin 中，協程取消是_協作式_的。這表示協程僅在其透過 [暫停](#suspension-points-and-cancellation) 或 [明確檢查取消](#check-for-cancellation-explicitly) 進行協作時才會響應取消。

在本節中，您可以學習如何建立可取消的協程。

### 暫停點與取消

當協程被取消時，它會繼續執行，直到程式碼中它可能暫停的點，這也稱為_暫停點_。如果協程在那裡暫停，暫停函式會檢查它是否已被取消。如果已被取消，協程就會停止並拋出 `CancellationException`。

呼叫 `suspend` 函式是一個暫停點，但它不一定總是暫停。例如，當等待 `Deferred` 結果時，協程只會在該 `Deferred` 尚未完成時才暫停。

以下是一個使用常見暫停函式的範例，這些函式會暫停，使協程能夠在被取消時檢查並停止：

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

> `kotlinx.coroutines` 函式庫中的所有暫停函式都與取消協作，因為它們內部使用 [`suspendCancellableCoroutine()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/suspend-cancellable-coroutine.html)，它會在協程暫停時檢查取消。相反地，使用 [`suspendCoroutine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/suspend-coroutine.html) 的自訂暫停函式不會響應取消。
>
{style="tip"}

### 明確檢查取消

如果協程長時間沒有 [暫停](#suspension-points-and-cancellation)，它在被取消時不會停止，除非它明確檢查取消。

若要檢查取消，請使用以下 API：

*   [`isActive`](#isactive) 屬性在協程被取消時為 `false`。
*   [`ensureActive()`](#ensureactive) 函式在協程被取消時立即拋出 `CancellationException`。
*   [`yield()`](#yield) 函式會暫停協程，釋放執行緒並讓其他協程有機會在其上執行。暫停協程可讓它檢查取消，並在被取消時拋出 `CancellationException`。

當您的協程在暫停點之間長時間執行，或不太可能在暫停點暫停時，這些 API 會很有用。

#### isActive

在長時間執行的計算中使用 [`isActive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html) 屬性，以定期檢查取消。當協程不再處於活動狀態時，此屬性為 `false`，您可以用它來優雅地停止協程，當它不再需要繼續操作時。

以下是範例：

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

在此範例中，[`join()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html) 函式會暫停協程直到它完成。這確保了在排序協程仍在執行時，不會存取該列表。

> 您可以使用 [`cancelAndJoin()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html) 函式，透過單一呼叫來取消協程並等待其完成。
>
{style="note"}

#### ensureActive()

使用 [`ensureActive()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html) 函式來檢查取消，如果協程被取消，則透過拋出 `CancellationException` 來停止當前計算：

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

[`yield()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html) 函式會暫停協程，並在恢復前檢查取消。如果沒有暫停，同一執行緒上的協程會依序執行。

使用 `yield` 允許其他協程在其中一個完成之前在同一執行緒或執行緒池上執行：

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

在此範例中，每個協程都使用 `yield()` 允許其他協程在迭代之間執行。

### 在協程取消時中斷阻塞程式碼

在 JVM 上，某些函式，例如 `Thread.sleep()` 或 `BlockingQueue.take()`，可能會阻塞當前執行緒。這些阻塞函式可以被中斷，這會使其提前停止。然而，當您從協程呼叫它們時，取消不會中斷執行緒。

若要在取消協程時中斷執行緒，請使用 [`runInterruptible()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-interruptible.html) 函式：

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

## 在取消協程時安全地處理值

當暫停的協程被取消時，它會以 `CancellationException` 恢復，而不是返回任何值，即使這些值已經可用。這種行為稱為_即時取消_。它會阻止您的程式碼在已取消的協程範圍內繼續執行，例如更新已關閉的螢幕。

以下是範例：

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// 定義使用 UI 執行緒的協程範圍
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
            // 在此處呼叫 updateUi 是安全的，
            // 如果發生取消，withContext() 將不會返回任何值
            updateUi(contents)
        }
    }

    // 如果在使用者離開螢幕後呼叫，則會拋出例外
    private fun updateUi(contents: List<String>) {
      contents.forEach { line -> addOneLineToUi(line) }
    }
  
    private fun addOneLineToUi(line: String) {
        // 將一行內容新增至 UI 的程式碼佔位符
    }

    // 只能從 UI 執行緒呼叫
    fun leaveScreen() {
        // 離開螢幕時取消範圍
        // 您將無法再更新 UI
        scope.cancel()
    }
}
```

在此範例中，`withContext(Dispatchers.IO)` 與取消協作，並防止 `updateUI()` 在 `leaveScreen()` 函式於協程返回檔案內容之前取消協程時執行。

雖然即時取消可防止在使用過期值，但它也可能在重要值仍在使用時停止您的程式碼，這可能會導致該值遺失。當協程接收到一個值（例如 `AutoCloseable` 資源），但在到達關閉該值的程式碼部分之前就被取消時，就可能發生這種情況。為防止這種情況，請將清理邏輯保留在即使接收值的協程被取消也能保證執行的位置。

以下是範例：

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// scope 是使用 UI 執行緒的協程範圍
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            // 將 reader 儲存在變數中，以便 finally 區塊可以關閉它
            var reader: BufferedReader? = null
            
            try {
                withContext(Dispatchers.IO) {
                    reader = Files.newBufferedReader(
                        path, Charset.forName("US-ASCII")
                    )
                }
                // 在 withContext() 完成後使用儲存的 reader
                updateUi(reader!!)
            } finally {
                // 確保即使協程被取消，reader 也能關閉
                reader?.close()
            }
        }
    }

    private suspend fun updateUi(reader: BufferedReader) {
        // 顯示檔案內容
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
        // 將一行內容新增至 UI 的程式碼佔位符
    }

    // 只能從 UI 執行緒呼叫
    fun leaveScreen() {
        // 離開螢幕時取消範圍
        // 您將無法再更新 UI
        scope.cancel()
    }
}
```

在此範例中，將 `BufferedReader` 儲存在變數中並在 `finally` 區塊中關閉它，確保即使協程被取消，資源也能被釋放。

### 執行不可取消區塊

您可以防止取消影響協程的某些部分。為此，請將 [`NonCancellable`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/) 作為引數傳遞給 `withContext()` 協程建構函式。

> 避免將 `NonCancellable` 與其他協程建構函式（例如 `.launch()` 或 `.async()`）一起使用。這樣做會破壞父子關係，從而擾亂結構化並行。
>
{style="warning"}

當您需要確保某些操作（例如使用暫停的 `close()` 函式關閉資源）即使在協程完成前被取消也能完成時，`NonCancellable` 會很有用。

以下是範例：

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
                    // 如果沒有 withContext(NonCancellable)，
                    // 此函式將不會完成，因為協程已被取消
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

## 超時

超時功能讓您可以在指定持續時間後自動取消協程。它們對於停止耗時過長的操作很有用，有助於保持您的應用程式響應靈敏，並避免不必要地阻塞執行緒。

若要指定超時，請使用 [`withTimeoutOrNull()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html) 函式並傳入 `Duration`：

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

如果超時超過指定的 `Duration`，`withTimeoutOrNull()` 會返回 `null`。