<!--- TEST_NAME CancellationGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 取消和超時)

本節涵蓋了協程的取消和超時。

## 取消協程執行

在一個長時間執行的應用程式中，您可能需要對背景協程進行精細的控制。
例如，使用者可能已經關閉了啟動協程的頁面，現在其結果不再需要，其操作也可以取消。
[launch] 函數會返回一個 [Job]，可用於取消正在執行的協程：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        repeat(1000) { i ->
            println("job: I'm sleeping $i ...")
            delay(500L)
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancel() // cancels the job
    job.join() // waits for job's completion 
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-01.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-01.kt)獲取完整程式碼。
>
{style="note"}

它會產生以下輸出：

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
```

<!--- TEST -->

一旦 main 調用 `job.cancel`，我們就不會看到其他協程的任何輸出，因為它已被取消。
還有一個 [Job] 擴充函數 [cancelAndJoin]，
它結合了 [cancel][Job.cancel] 和 [join][Job.join] 的調用。

## 取消是協作的

協程的取消是_協作的_。協程的程式碼必須配合才能被取消。
`kotlinx.coroutines` 中的所有暫停函數都是_可取消的_。它們會在協程取消時檢查取消狀態並拋出 [CancellationException]。然而，如果一個協程正在進行計算且不檢查取消狀態，那麼它就無法被取消，如下例所示：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        var nextPrintTime = startTime
        var i = 0
        while (i < 5) { // computation loop, just wastes CPU
            // print a message twice a second
            if (System.currentTimeMillis() >= nextPrintTime) {
                println("job: I'm sleeping ${i++} ...")
                nextPrintTime += 500L
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-02.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-02.kt)獲取完整程式碼。
>
{style="note"}

執行它，您會看到即使在取消之後，它仍然會繼續列印「I'm sleeping」，直到該任務在五次迭代後自行完成。

<!--- TEST 
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm sleeping 3 ...
job: I'm sleeping 4 ...
main: Now I can quit.
-->

同樣的問題也可以透過捕獲 [CancellationException] 但不重新拋出它來觀察到：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch(Dispatchers.Default) {
        repeat(5) { i ->
            try {
                // print a message twice a second
                println("job: I'm sleeping $i ...")
                delay(500)
            } catch (e: Exception) {
                // log the exception
                println(e)
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-03.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-03.kt)獲取完整程式碼。
>
{style="note"}

儘管捕獲 `Exception` 是一種反模式，但這個問題可能會以更微妙的方式浮現，例如在使用
[`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html) 函數時，
它不會重新拋出 [CancellationException]。

## 使計算程式碼可取消

有兩種方法可以使計算程式碼可取消。
第一種是定期調用一個檢查取消狀態的暫停函數。
[yield] 和 [ensureActive] 函數是此目的的絕佳選擇。
另一種是使用 [isActive] 明確檢查取消狀態。
讓我們嘗試後者。

將上一個範例中的 `while (i < 5)` 替換為 `while (isActive)` 並重新執行它。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        var nextPrintTime = startTime
        var i = 0
        while (isActive) { // cancellable computation loop
            // prints a message twice a second
            if (System.currentTimeMillis() >= nextPrintTime) {
                println("job: I'm sleeping ${i++} ...")
                nextPrintTime += 500L
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-04.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-04.kt)獲取完整程式碼。
>
{style="note"}

如您所見，現在這個迴圈被取消了。[isActive] 是一個擴充屬性，
可透過 [CoroutineScope] 物件在協程內部使用。

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
-->

## 使用 finally 關閉資源

可取消的暫停函數在取消時會拋出 [CancellationException]，這可以以通常的方式處理。
例如，
`try {...} finally {...}` 表達式和 Kotlin 的 [use](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io/use.html)
函數在協程被取消時，會正常執行它們的最終化操作：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job: I'm sleeping $i ...")
                delay(500L)
            }
        } finally {
            println("job: I'm running finally")
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-05.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-05.kt)獲取完整程式碼。
>
{style="note"}

[join][Job.join] 和 [cancelAndJoin] 都會等待所有最終化操作完成，
因此上述範例會產生以下輸出：

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm running finally
main: Now I can quit.
```

<!--- TEST -->

## 運行不可取消的區塊

在先前範例的 `finally` 區塊中，任何嘗試使用暫停函數都會導致 [CancellationException]，因為執行此程式碼的協程已被取消。通常，這不是問題，因為所有良好的關閉操作（關閉檔案、取消任務或關閉任何類型的通訊通道）通常都是非阻塞的，並且不涉及任何暫停函數。然而，在極少數情況下，當您需要在已取消的協程中暫停時，您可以使用 [withContext] 函數和 [NonCancellable] 上下文將相應的程式碼包裝在
`withContext(NonCancellable) {...}` 中，如下例所示：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job: I'm sleeping $i ...")
                delay(500L)
            }
        } finally {
            withContext(NonCancellable) {
                println("job: I'm running finally")
                delay(1000L)
                println("job: And I've just delayed for 1 sec because I'm non-cancellable")
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-06.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-06.kt)獲取完整程式碼。
>
{style="note"}

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm running finally
job: And I've just delayed for 1 sec because I'm non-cancellable
main: Now I can quit.
-->

## 超時

取消協程執行的最明顯的實際原因是其執行時間已超出某些超時限制。
雖然您可以手動追蹤相應 [Job] 的引用並啟動一個單獨的協程來在延遲後取消被追蹤的協程，但有一個現成的 [withTimeout] 函數可以做到這一點。
請看以下範例：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    withTimeout(1300L) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500L)
        }
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-07.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-07.kt)獲取完整程式碼。
>
{style="note"}

它會產生以下輸出：

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Exception in thread "main" kotlinx.coroutines.TimeoutCancellationException: Timed out waiting for 1300 ms
```

<!--- TEST STARTS_WITH -->

[withTimeout] 拋出的 [TimeoutCancellationException] 是 [CancellationException] 的子類別。
我們之前沒有在控制台上看到它的堆疊追蹤。那是因為
在已取消的協程內部，`CancellationException` 被視為協程完成的正常原因。
然而，在此範例中，我們直接在 `main` 函數內部使用了 `withTimeout`。

由於取消只是一種例外，所有資源都以通常的方式關閉。
如果您需要對任何類型的超時執行一些額外操作，您可以將帶有超時的程式碼包裝在 `try {...} catch (e: TimeoutCancellationException) {...}` 區塊中，或者使用 [withTimeoutOrNull] 函數，
它與 [withTimeout] 類似，但在超時時返回 `null` 而不是拋出例外：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val result = withTimeoutOrNull(1300L) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500L)
        }
        "Done" // will get cancelled before it produces this result
    }
    println("Result is $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-08.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-08.kt)獲取完整程式碼。
>
{style="note"}

運行此程式碼時不再有例外：

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Result is null
```

<!--- TEST -->

## 非同步超時與資源

<!-- 
  NOTE: Don't change this section name. It is being referenced to from within KDoc of withTimeout functions.
-->

[withTimeout] 中的超時事件相對於在其區塊中執行的程式碼是非同步的，並且可能在任何時間發生，
甚至就在超時區塊內部返回之前。如果您在區塊內部開啟或獲取了需要在區塊外部關閉或釋放的資源，請記住這一點。

例如，這裡我們使用 `Resource` 類別模仿一個可關閉的資源，它透過增加 `acquired` 計數器來簡單地追蹤它被創建的次數，並在其 `close` 函數中減少計數器。
現在讓我們創建許多協程，每個協程都在 `withTimeout` 區塊的末尾創建一個 `Resource` 並在區塊外部釋放該資源。我們添加一個小延遲，以便超時更有可能在 `withTimeout` 區塊已經完成時發生，這將導致資源洩漏。

```kotlin
import kotlinx.coroutines.*

//sampleStart
var acquired = 0

class Resource {
    init { acquired++ } // Acquire the resource
    fun close() { acquired-- } // Release the resource
}

fun main() {
    runBlocking {
        repeat(10_000) { // Launch 10K coroutines
            launch { 
                val resource = withTimeout(60) { // Timeout of 60 ms
                    delay(50) // Delay for 50 ms
                    Resource() // Acquire a resource and return it from withTimeout block     
                }
                resource.close() // Release the resource
            }
        }
    }
    // Outside of runBlocking all coroutines have completed
    println(acquired) // Print the number of resources still acquired
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-09.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-09.kt)獲取完整程式碼。
>
{style="note"}

<!--- CLEAR -->

如果您運行上述程式碼，您會發現它不總是印出零，儘管這可能取決於您機器的計時。您可能需要在這個範例中調整超時時間才能實際看到非零值。

> 請注意，在這裡從 10K 個協程增加和減少 `acquired` 計數器是完全執行緒安全的，
> 因為它總是發生在同一個執行緒，即 `runBlocking` 使用的執行緒。
> 更多相關內容將在協程上下文的章節中解釋。
>
{style="note"}

為了解決這個問題，您可以將資源的引用儲存在變數中，而不是從 `withTimeout` 區塊返回它。

```kotlin
import kotlinx.coroutines.*

var acquired = 0

class Resource {
    init { acquired++ } // Acquire the resource
    fun close() { acquired-- } // Release the resource
}

fun main() {
//sampleStart
    runBlocking {
        repeat(10_000) { // Launch 10K coroutines
            launch { 
                var resource: Resource? = null // Not acquired yet
                try {
                    withTimeout(60) { // Timeout of 60 ms
                        delay(50) // Delay for 50 ms
                        resource = Resource() // Store a resource to the variable if acquired      
                    }
                    // We can do something else with the resource here
                } finally {  
                    resource?.close() // Release the resource if it was acquired
                }
            }
        }
    }
    // Outside of runBlocking all coroutines have completed
    println(acquired) // Print the number of resources still acquired
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-10.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-10.kt)獲取完整程式碼。
>
{style="note"}

這個範例總是印出零。資源不會洩漏。

<!--- TEST 
0
-->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[cancelAndJoin]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[Job.join]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[CancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html
[yield]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html
[ensureActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html
[isActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[NonCancellable]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/index.html
[withTimeout]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout.html
[TimeoutCancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-timeout-cancellation-exception/index.html
[withTimeoutOrNull]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html

<!--- END -->