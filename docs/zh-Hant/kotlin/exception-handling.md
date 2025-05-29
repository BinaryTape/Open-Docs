<!--- TEST_NAME ExceptionsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 協程例外處理)

本節涵蓋例外處理和例外時的取消操作。
我們已經知道，一個被取消的協程會在暫停點（suspension points）拋出 `CancellationException`，並且它會被協程機制（coroutines' machinery）忽略。這裡我們將探討在取消過程中拋出例外，或同一協程的多個子協程拋出例外時會發生什麼。

## 例外傳播

協程建構器（Coroutine builders）有兩種風格：自動傳播例外（`launch`）或將其暴露給使用者（`async` 和 `produce`）。
當這些建構器用於建立一個**根**協程（即不是另一個協程的**子**協程）時，前者會將例外視為**未捕獲**例外（uncaught exceptions），類似於 Java 的 `Thread.uncaughtExceptionHandler`；而後者則依賴使用者來消費最終的例外，例如透過 `await` 或 `receive`（`produce` 和 `receive` 在 [通道（Channels）](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/channels.md) 部分有涵蓋）。

這可以透過一個使用 `GlobalScope` 建立根協程的簡單範例來證明：

> `GlobalScope` 是一個精妙的 API，它可能以非平凡的方式產生意想不到的後果。為整個應用程式建立一個根協程是 `GlobalScope` 罕見的合法用途之一，因此您必須明確選擇使用 `@OptIn(DelicateCoroutinesApi::class)` 來啟用 `GlobalScope` 的使用。
>
{style="note"}

```kotlin
import kotlinx.coroutines.*

//sampleStart
@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val job = GlobalScope.launch { // root coroutine with launch
        println("Throwing exception from launch")
        throw IndexOutOfBoundsException() // Will be printed to the console by Thread.defaultUncaughtExceptionHandler
    }
    job.join()
    println("Joined failed job")
    val deferred = GlobalScope.async { // root coroutine with async
        println("Throwing exception from async")
        throw ArithmeticException() // Nothing is printed, relying on user to call await
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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-01.kt)獲取完整程式碼。
>
{style="note"}

此程式碼的輸出（開啟 [debug](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/coroutine-context-and-dispatchers.md#debugging-coroutines-and-threads) 模式）為：

```text
Throwing exception from launch
Exception in thread "DefaultDispatcher-worker-1 @coroutine#2" java.lang.IndexOutOfBoundsException
Joined failed job
Throwing exception from async
Caught ArithmeticException
```

<!--- TEST EXCEPTION-->

## CoroutineExceptionHandler

可以自訂將**未捕獲**例外列印到主控台的預設行為。
根協程上的 `CoroutineExceptionHandler` 上下文元素可以用作此根協程及其所有子協程的通用 `catch` 區塊，可在其中進行自訂例外處理。
它類似於 [`Thread.uncaughtExceptionHandler`](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html#setUncaughtExceptionHandler-java.lang.Thread.UncaughtExceptionHandler-)。
您無法在 `CoroutineExceptionHandler` 中從例外中恢復。當處理器被呼叫時，協程已經因相應的例外而完成。通常，處理器用於記錄例外、顯示某種錯誤訊息、終止和/或重新啟動應用程式。

`CoroutineExceptionHandler` 僅在**未捕獲**例外 — 即未以任何其他方式處理的例外 — 時被調用。
特別是，所有**子**協程（在另一個 `Job` 上下文中建立的協程）會將其例外的處理委託給其父協程，父協程又委託給其父協程，依此類推直到根協程，因此安裝在它們上下文中的 `CoroutineExceptionHandler` 永遠不會被使用。
此外，`async` 建構器總是捕獲所有例外並將其表示在結果 `Deferred` 物件中，因此其 `CoroutineExceptionHandler` 也沒有效果。

> 在監督範圍（supervision scope）內執行的協程不會將例外傳播到其父級，因此不受此規則約束。本文件後續的[監督](#supervision)部分將提供更多詳細資訊。
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
    val job = GlobalScope.launch(handler) { // root coroutine, running in GlobalScope
        throw AssertionError()
    }
    val deferred = GlobalScope.async(handler) { // also root, but async instead of launch
        throw ArithmeticException() // Nothing will be printed, relying on user to call deferred.await()
    }
    joinAll(job, deferred)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-02.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-02.kt)獲取完整程式碼。
>
{style="note"}

此程式碼的輸出為：

```text
CoroutineExceptionHandler got java.lang.AssertionError
```

<!--- TEST-->

## 取消與例外

取消與例外密切相關。協程內部使用 `CancellationException` 進行取消，這些例外會被所有處理器忽略，因此它們只能用作額外偵錯資訊的來源，可以透過 `catch` 區塊獲取。
當使用 `Job.cancel` 取消協程時，它會終止，但不會取消其父級。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        val child = launch {
            try {
                delay(Long.MAX_VALUE)
            } finally {
                println("Child is cancelled")
            }
        }
        yield()
        println("Cancelling child")
        child.cancel()
        child.join()
        yield()
        println("Parent is not cancelled")
    }
    job.join()
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-03.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-03.kt)獲取完整程式碼。
>
{style="note"}

此程式碼的輸出為：

```text
Cancelling child
Child is cancelled
Parent is not cancelled
```

<!--- TEST-->

如果協程遇到 `CancellationException` 以外的例外，它會以該例外取消其父級。
這種行為無法被覆寫，並用於為[結構化併發（structured concurrency）](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/composing-suspending-functions.md#structured-concurrency-with-async)提供穩定的協程層次結構。
`CoroutineExceptionHandler` 的實作不適用於子協程。

> 在這些範例中，`CoroutineExceptionHandler` 總是安裝在 `GlobalScope` 中建立的協程上。將例外處理器安裝到在主 `runBlocking` 範圍內啟動的協程上是沒有意義的，因為即使安裝了處理器，主協程在子協程因例外完成時也總是會被取消。
>
{style="note"}

原始例外僅在其所有子協程終止時才由父級處理，這可以透過以下範例來證明。

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandler got $exception") 
    }
    val job = GlobalScope.launch(handler) {
        launch { // the first child
            try {
                delay(Long.MAX_VALUE)
            } finally {
                withContext(NonCancellable) {
                    println("Children are cancelled, but exception is not handled until all children terminate")
                    delay(100)
                    println("The first child finished its non cancellable block")
                }
            }
        }
        launch { // the second child
            delay(10)
            println("Second child throws an exception")
            throw ArithmeticException()
        }
    }
    job.join()
//sampleEnd 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-04.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-04.kt)獲取完整程式碼。
>
{style="note"}

此程式碼的輸出為：

```text
Second child throws an exception
Children are cancelled, but exception is not handled until all children terminate
The first child finished its non cancellable block
CoroutineExceptionHandler got java.lang.ArithmeticException
```

<!--- TEST-->

## 例外聚合

當協程的多個子協程因例外失敗時，一般規則是「第一個例外獲勝」，因此第一個例外會被處理。
第一個例外之後發生的所有額外例外都會作為被抑制的例外附加到第一個例外上。

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
                delay(Long.MAX_VALUE) // it gets cancelled when another sibling fails with IOException
            } finally {
                throw ArithmeticException() // the second exception
            }
        }
        launch {
            delay(100)
            throw IOException() // the first exception
        }
        delay(Long.MAX_VALUE)
    }
    job.join()  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-05.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-05.kt)獲取完整程式碼。
>
{style="note"}

此程式碼的輸出為：

```text
CoroutineExceptionHandler got java.io.IOException with suppressed [java.lang.ArithmeticException]
```

<!--- TEST-->

> 請注意，此機制目前僅在 Java 1.7+ 版本上有效。JS 和 Native 的限制是暫時性的，未來將會解除。
>
{style="note"}

取消例外是透明的，預設情況下會被解包：

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
        val innerJob = launch { // all this stack of coroutines will get cancelled
            launch {
                launch {
                    throw IOException() // the original exception
                }
            }
        }
        try {
            innerJob.join()
        } catch (e: CancellationException) {
            println("Rethrowing CancellationException with original cause")
            throw e // cancellation exception is rethrown, yet the original IOException gets to the handler  
        }
    }
    job.join()
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-06.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-06.kt)獲取完整程式碼。
>
{style="note"}

此程式碼的輸出為：

```text
Rethrowing CancellationException with original cause
CoroutineExceptionHandler got java.io.IOException
```

<!--- TEST-->

## 監督

正如我們之前研究過的，取消是一種雙向關係，透過整個協程層次結構傳播。讓我們來看看需要單向取消的情況。

這種需求的一個好例子是，一個 UI 元件在其範圍內定義了任務（job）。如果 UI 的任何子任務失敗，通常沒有必要取消（實際終止）整個 UI 元件；但如果 UI 元件被銷毀（並且其任務被取消），那麼就有必要取消所有子任務，因為它們的結果不再需要。

另一個例子是伺服器進程，它會產生多個子任務並需要**監督**（supervise）它們的執行，追蹤它們的失敗並僅重新啟動失敗的任務。

### 監督任務

`SupervisorJob` 可用於這些目的。它類似於常規的 `Job`，唯一的例外是取消只向下傳播。這可以透過以下範例輕鬆證明：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val supervisor = SupervisorJob()
    with(CoroutineScope(coroutineContext + supervisor)) {
        // launch the first child -- its exception is ignored for this example (don't do this in practice!)
        val firstChild = launch(CoroutineExceptionHandler { _, _ ->  }) {
            println("The first child is failing")
            throw AssertionError("The first child is cancelled")
        }
        // launch the second child
        val secondChild = launch {
            firstChild.join()
            // Cancellation of the first child is not propagated to the second child
            println("The first child is cancelled: ${firstChild.isCancelled}, but the second one is still active")
            try {
                delay(Long.MAX_VALUE)
            } finally {
                // But cancellation of the supervisor is propagated
                println("The second child is cancelled because the supervisor was cancelled")
            }
        }
        // wait until the first child fails & completes
        firstChild.join()
        println("Cancelling the supervisor")
        supervisor.cancel()
        secondChild.join()
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-01.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-01.kt)獲取完整程式碼。
>
{style="note"}

此程式碼的輸出為：

```text
The first child is failing
The first child is cancelled: true, but the second one is still active
Cancelling the supervisor
The second child is cancelled because the supervisor was cancelled
```

<!--- TEST-->

### 監督範圍

我們可以使用 `supervisorScope` 而不是 `coroutineScope` 來實現**範圍內**的併發（scoped concurrency）。它只在一個方向上傳播取消，並且僅在自身失敗時才取消其所有子協程。它也像 `coroutineScope` 一樣，在完成前等待所有子協程。

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    try {
        supervisorScope {
            val child = launch {
                try {
                    println("The child is sleeping")
                    delay(Long.MAX_VALUE)
                } finally {
                    println("The child is cancelled")
                }
            }
            // Give our child a chance to execute and print using yield 
            yield()
            println("Throwing an exception from the scope")
            throw AssertionError()
        }
    } catch(e: AssertionError) {
        println("Caught an assertion error")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-02.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-02.kt)獲取完整程式碼。
>
{style="note"}

此程式碼的輸出為：

```text
The child is sleeping
Throwing an exception from the scope
The child is cancelled
Caught an assertion error
```

<!--- TEST-->

#### 監督協程中的例外

常規任務和監督任務之間另一個關鍵區別在於例外處理。
每個子協程都應該透過例外處理機制自行處理其例外。
這種差異源於子協程的失敗不會傳播到父級。
這意味著直接在 `supervisorScope` 內啟動的協程**確實**會使用安裝在其範圍內的 `CoroutineExceptionHandler`，其方式與根協程相同（詳情請參閱[CoroutineExceptionHandler](#coroutineexceptionhandler) 部分）。

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
            println("The child throws an exception")
            throw AssertionError()
        }
        println("The scope is completing")
    }
    println("The scope is completed")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-03.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-03.kt)獲取完整程式碼。
>
{style="note"}

此程式碼的輸出為：

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