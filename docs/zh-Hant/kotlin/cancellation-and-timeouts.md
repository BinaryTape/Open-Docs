<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 取消與逾時)

取消 (Cancellation) 讓您能在協同程式 (coroutine) 完成前將其停止。
這能停止不再需要的工作，例如當使用者關閉視窗或在使用者介面中切換頁面，而協同程式仍在執行時。
您也可以利用它提早釋放資源，並防止協同程式在其銷毀後繼續存取物件。

> 您可以使用取消來停止長時間執行的協同程式，這些程式甚至在其他協同程式不再需要其值時仍持續產生值，例如在 [管線 (pipelines)](channels.md#pipelines) 中。
>
{style="tip"}

取消是透過 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 控點運作的，它代表了協同程式的生命週期及其父子關係。
`Job` 允許您檢查協同程式是否處於活動狀態，並允許您將其及其子程式一併取消，如 [結構化並行 (structured concurrency)](coroutines-basics.md#coroutine-scope-and-structured-concurrency) 所定義。

## 取消協同程式

當在協同程式的 `Job` 控點上呼叫 [`cancel()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html) 函式時，該協同程式會被取消。
[協同程式產生器函式](coroutines-basics.md#coroutine-builder-functions)（例如 [`.launch()`](coroutines-basics.md#coroutinescope-launch)）會回傳一個 `Job`。[`.async()`](coroutines-basics.md#coroutinescope-async) 函式則回傳一個 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/)，它實作了 `Job` 並支援相同的取消行為。

您可以手動呼叫 `cancel()` 函式，也可以在父協同程式被取消時透過取消傳播 (cancellation propagation) 自動觸發。

當協同程式被取消時，它會在下次檢查取消狀態時拋出 [`CancellationException`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/)。
如需了解這是在何時以及如何發生的更多資訊，請參閱 [掛起點與取消](#suspension-points-and-cancellation)。

> 您可以使用 [`awaitCancellation()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/await-cancellation.html) 函式來掛起協同程式，直到它被取消。
>
{style="tip"}

以下是手動取消協同程式的範例：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 用作協同程式已開始執行的訊號
        val job1Started = CompletableDeferred<Unit>()
        
        val job1: Job = launch {
            
            println("The coroutine has started")

            // 完成 CompletableDeferred，
            // 發出協同程式已開始執行的訊號
            job1Started.complete(Unit)
            try {
                // 無限期掛起
                // 若沒有取消，此呼叫將永遠不會回傳
                delay(Duration.INFINITE)
            } catch (e: CancellationException) {
                println("The coroutine was canceled: $e")
              
                // 務必重新拋出取消例外！
                throw e
            }
            println("This line will never be executed")
        }
      
        // 在取消 job1 之前等待其啟動
        job1Started.await()

        // 取消協同程式，因此 delay() 會拋出 CancellationException
        job1.cancel()

        // async 回傳 Deferred 控點，其繼承自 Job
        val job2 = async {
            // 如果協同程式在程式體開始執行前就被取消，
            // 此行可能不會被印出
            println("The second coroutine has started")

            try {
                // 等同於 delay(Duration.INFINITE)
                // 掛起直到此協同程式被取消
                awaitCancellation()

            } catch (e: CancellationException) {
                println("The second coroutine was canceled")
                throw e
            }
        }
        job2.cancel()
    }
    // 協同程式產生器（如 withContext() 或 coroutineScope()）
    // 會等待所有子協同程式完成，
    // 即使子程式已被取消也是如此
    println("All coroutines have completed")
}
//sampleEnd
```
{kotlin-runnable="true" id="manual-cancellation-example"}

在此範例中，[`CompletableDeferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-completable-deferred/) 被用作協同程式已開始執行的訊號。
協同程式在開始執行時呼叫 `complete()`，而 `await()` 僅在該 `CompletableDeferred` 完成後才會回傳。透過這種方式，取消只會在協同程式開始執行後發生。
由 `.async()` 建立的協同程式沒有此檢查，因此它可能在執行其區塊內的程式碼之前就被取消。

> 擷取 `CancellationException` 可能會破壞取消傳播。
> 如果您必須擷取它，請重新拋出它，以便讓取消在協同程式階層結構中正確傳播。
>
> 如需更多資訊，請參閱 [協同程式例外處理](exception-handling.md#cancellation-and-exceptions)。
>
{style="warning"}

### 取消傳播

[結構化並行](coroutines-basics.md#coroutine-scope-and-structured-concurrency) 確保取消一個協同程式也會取消其所有的子程式。
這能防止子協同程式在父程式已經停止後繼續運作。

範例如下：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 用作子協同程式已啟動的訊號
        val childrenLaunched = CompletableDeferred<Unit>()

        // 啟動兩個子協同程式
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
            // 完成 CompletableDeferred，
            // 發出子協同程式已啟動的訊號
            childrenLaunched.complete(Unit)
        }
        // 等待父協同程式發出已啟動
        // 所有子程式的訊號
        childrenLaunched.await()

        // 取消父協同程式，這也會取消其所有子程式
        parentJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="cancellation-propagation-example"}

在此範例中，每個子協同程式都使用 [`finally` 區塊](exceptions.md#the-finally-block)，因此當協同程式被取消時，其中的程式碼會執行。
這裡 `CompletableDeferred` 發出子協同程式已啟動的訊號後才進行取消，但這並不保證它們已經開始執行。如果它們先被取消，則不會印出任何內容。

## 讓協同程式對取消做出反應 {id="cancellation-is-cooperative"}

在 Kotlin 中，協同程式的取消是 *協作式 (cooperative)* 的。
這意味著協同程式只有在透過 [掛起](#suspension-points-and-cancellation) 或 [明確檢查取消狀態](#check-for-cancellation-explicitly) 進行協作時，才會對取消做出反應。

在本節中，您可以學習如何建立可取消的協同程式。

### 掛起點與取消

當協同程式被取消時，它會繼續執行，直到到達程式碼中可能掛起的位置，也稱為 *掛起點 (suspension point)*。
如果協同程式在該處掛起，掛起函式會檢查它是否已被取消。
如果是，協同程式會停止並拋出 `CancellationException`。

呼叫 `suspend` 函式是一個掛起點，但它並不總是會掛起。
例如，當等待一個 `Deferred` 結果時，只有在該 `Deferred` 尚未完成時，協同程式才會掛起。

以下範例使用了常見的掛起函式，這些函式會進行掛起，使協同程式能在取消時進行檢查並停止：

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
                // 掛起直到取消
                awaitCancellation()
            },
            launch {
                // 掛起直到取消
                delay(Duration.INFINITE)
            },
            launch {
                val channel = Channel<Int>()
                // 掛起以等待一個永遠不會發送的值
                channel.receive()
            },
            launch {
                val deferred = CompletableDeferred<Int>()
                // 掛起以等待一個永遠不會完成的值
                deferred.await()
            },
            launch {
                val mutex = Mutex(locked = true)
                // 掛起以等待一個無限期保持鎖定狀態的 mutex
                mutex.lock()
            }
        )
        
        // 給子協同程式時間來啟動並掛起
        delay(100.milliseconds)
        
        // 取消所有子協同程式
        childJobs.forEach { it.cancel() }
    }
    println("All child jobs completed!")
}
```
{kotlin-runnable="true" id="suspension-points-example"}

> `kotlinx.coroutines` 程式庫中的所有掛起函式都配合取消機制，因為它們內部使用了 [`suspendCancellableCoroutine()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/suspend-cancellable-coroutine.html)，這會在協同程式掛起時檢查取消狀態。
> 相較之下，使用 [`suspendCoroutine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/suspend-coroutine.html) 的自訂掛起函式則不會對取消做出反應。
>
{style="tip"}

### 明確檢查取消狀態

如果協同程式長時間不 [掛起](#suspension-points-and-cancellation)，除非它明確地檢查取消狀態，否則在被取消時不會停止。

要檢查取消狀態，請使用以下 API：

* 當協同程式被取消時，[`isActive`](#isactive) 屬性為 `false`。
* 如果協同程式被取消，[`ensureActive()`](#ensureactive) 函式會立即拋出 `CancellationException`。
* [`yield()`](#yield) 函式會掛起協同程式，釋放執行緒並讓其他協同程式有機會在其上執行。掛起協同程式能讓它檢查取消狀態，並在被取消時拋出 `CancellationException`。

當您的協同程式在掛起點之間執行時間較長，或者在掛起點不太可能掛起時，這些 API 非常有用。

#### isActive

在長時間執行的運算中使用 [`isActive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html) 屬性來定期檢查取消狀態。
當協同程式不再處於活動狀態時，此屬性為 `false`，您可以用它來優雅地停止協同程式，使其不再繼續執行該操作：

範例如下：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds
import kotlin.random.Random

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val unsortedList = MutableList(10) { Random.nextInt() }
        
        // 開始長時間運算
        val listSortingJob = launch {
            var i = 0

            // 當協同程式保持活動狀態時，重複對列表進行排序
            while (isActive) {
                unsortedList.sort()
                ++i
            }
            println(
                "Stopped sorting the list after $i iterations"
            )
        }
        // 將列表排序 100 毫秒，然後認為它已經排序得足夠好了
        delay(100.milliseconds)

        // 當結果足夠好時取消排序        
        listSortingJob.cancel()

        // 在存取共享列表之前等待排序協同程式結束，
        // 以避免資料競爭 (data races)
        listSortingJob.join()
        println("The list is probably sorted: $unsortedList")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="isactive-example"}

在此範例中，[`join()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html) 函式會掛起協同程式直到其結束。這確保了在排序協同程式仍在執行時不會存取該列表。

> 您可以使用 [`cancelAndJoin()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html) 函式，在單次呼叫中取消協同程式並等待其結束。
>
{style="note"}

#### ensureActive()

使用 [`ensureActive()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html) 函式來檢查取消狀態，並在協同程式被取消時拋出 `CancellationException` 以停止當前運算：

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
                    // 針對當前數字檢查 Collatz 猜想
                    var n = start
                    while (n != 1) {
                        // 如果協同程式被取消，則拋出 CancellationException
                        ensureActive()
                        n = if (n % 2 == 0) n / 2 else 3 * n + 1
                    }
                }
            } finally {
                println("Checked the Collatz conjecture for 0..${start-1}")
            }
        }
        // 執行運算一秒鐘
        delay(100.milliseconds)

        // 取消協同程式
        childJob.cancel()
    }
}
```
{kotlin-runnable="true" id="ensurective-example"}

#### yield()

[`yield()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html) 函式會掛起協同程式，並在恢復執行前檢查取消狀態。
在不掛起的情況下，同一執行緒上的協同程式會按順序執行。

使用 `yield` 允許其他協同程式在其中一個協同程式完成之前，在同一執行緒或執行緒池上執行：

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() {
    // runBlocking 使用當前執行緒來執行所有協同程式
    runBlocking {
        val coroutineCount = 5
        repeat(coroutineCount) { coroutineIndex ->
            launch {
                val id = coroutineIndex + 1
                repeat(5) { iterationIndex ->
                    val iteration = iterationIndex + 1
                    // 暫時掛起，給其他協同程式執行的機會
                    // 若沒有這個，協同程式將按順序執行
                    yield()
                    // 印出協同程式索引和疊代索引
                    println("$id * $iteration = ${id * iteration}")
                }
            }
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="yield-example"}

在此範例中，每個協同程式都使用 `yield()` 以在疊代之間讓其他協同程式執行。

### 取消協同程式時中斷阻塞程式碼

在 JVM 上，某些函式（例如 `Thread.sleep()` 或 `BlockingQueue.take()`）會阻塞當前執行緒。
這些阻塞函式可以被中斷，從而提早停止它們。
然而，當您從協同程式呼叫它們時，取消並不會中斷執行緒。

要在取消協同程式時中斷執行緒，請使用 [`runInterruptible()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-interruptible.html) 函式：

```kotlin
import kotlinx.coroutines.*

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val childStarted = CompletableDeferred<Unit>()
        val childJob = launch {
            try {
                // 取消會觸發執行緒中斷
                runInterruptible {
                    childStarted.complete(Unit)
                    try {
                        // 阻塞當前執行緒很長一段時間
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

        // 取消協同程式並中斷執行 Thread.sleep() 的執行緒
        childJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="interrupt-cancellation-example"}

## 取消協同程式時安全地處理值

當一個掛起的協同程式被取消時，它會帶著 `CancellationException` 恢復執行，而不會回傳任何值，即使這些值已經可用。
這種行為稱為 *及時取消 (prompt cancellation)*。
它能防止您的程式碼在已被取消的協同程式作用域中繼續執行，例如更新一個已經關閉的畫面。

範例如下：

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// 定義一個使用 UI 執行緒的協同程式作用域
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
            // 若發生取消，withContext() 將不會回傳任何值
            updateUi(contents)
        }
    }

    // 如果在使用者離開畫面後被呼叫，則拋出例外
    private fun updateUi(contents: List<String>) {
      contents.forEach { line -> addOneLineToUi(line) }
    }
  
    private fun addOneLineToUi(line: String) {
        // 新增一行到 UI 的程式碼占位符
    }

    // 僅能從 UI 執行緒呼叫
    fun leaveScreen() {
        // 離開畫面時取消作用域
        // 您將無法再更新 UI
        scope.cancel()
    }
}
```

在此範例中，`withContext(Dispatchers.IO)` 配合取消機制，如果 `leaveScreen()` 函式在協同程式回傳檔案內容之前將其取消，則可防止 `updateUI()` 執行。

雖然及時取消能防止在值不再有效後繼續使用它們，但它也可能在重要值仍在使用時停止您的程式碼，這可能會導致該值遺失。
例如，當協同程式接收到一個值（如 `AutoCloseable` 資源），但在到達關閉該資源的程式碼部分之前就被取消時，就會發生這種情況。
為了防止這種情況，請將清理邏輯保留在保證即使接收值的協同程式被取消也能執行的地方。

範例如下：

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// scope 是使用 UI 執行緒的協同程式作用域
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
                // 確保即使協同程式被取消，reader 也會被關閉
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
        // 新增一行到 UI 的程式碼占位符
    }

    // 僅能從 UI 執行緒呼叫
    fun leaveScreen() {
        // 離開畫面時取消作用域
        // 您將無法再更新 UI
        scope.cancel()
    }
}
```

在此範例中，將 `BufferedReader` 儲存在變數中並在 `finally` 區塊中將其關閉，可確保即使協同程式被取消也能釋放資源。

### 執行不可取消的區塊

您可以防止取消影響協同程式的某些部分。
為此，請將 [`NonCancellable`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/) 作為引數傳遞給 `withContext()` 協同程式產生器函式。

> 避免將 `NonCancellable` 與 `.launch()` 或 `.async()` 等其他協同程式產生器一起使用。這樣做會破壞父子關係，進而擾亂結構化並行。
>
{style="warning"}

當您需要確保某些操作（例如使用掛起的 `close()` 函式關閉資源）即使協同程式在完成前被取消也能執行完畢時，`NonCancellable` 非常有用。

範例如下：

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
                    // 此函式將無法完成，因為協同程式已被取消
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

## 逾時

逾時 (Timeout) 允許您在指定的持續時間後自動取消協同程式。
這對於停止耗時過長的操作非常有用，有助於保持應用程式的回應性並避免不必要的執行緒阻塞。

要指定逾時，請使用帶有 `Duration` 的 [`withTimeoutOrNull()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html) 函式：

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

如果超過指定的 `Duration` 仍未完成，`withTimeoutOrNull()` 會回傳 `null`。