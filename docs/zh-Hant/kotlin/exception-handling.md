<!--- TEST_NAME ExceptionsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 協程異常處理)

本節涵蓋了異常處理和因異常而導致的取消。我們已經知道，一個被取消的協程會在暫停點拋出 [CancellationException]，並且它會被協程機制所忽略。在這裡，我們將探討在取消過程中拋出異常，或同一協程的多個子協程拋出異常時會發生什麼。

## 異常傳播

協程建構器分為兩類：自動傳播異常的 ([launch]) 或將異常暴露給使用者的 ([async] 和 [produce])。當這些建構器用於建立一個**根協程**（即不是另一個協程的**子協程**）時，前者將異常視為**未捕獲的**異常，類似於 Java 的 `Thread.uncaughtExceptionHandler`，而後者則依賴使用者來消費最終的異常，例如透過 [await][Deferred.await] 或 [receive][ReceiveChannel.receive]（[produce] 和 [receive][ReceiveChannel.receive] 在 [通道](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/channels.md) 區段中有所介紹）。

這可以透過一個簡單的範例來演示，該範例使用 [GlobalScope] 建立根協程：

> [GlobalScope] 是一個精密的 API，可能以非平凡的方式產生反效果。為整個應用程式建立根協程是 `GlobalScope` 少數合法的用途之一，因此您必須使用 `@OptIn(DelicateCoroutinesApi::class)` 明確選擇啟用 `GlobalScope`。
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
> 您可以在 [這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-01.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出是（使用 [debug](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/coroutine-context-and-dispatchers.md#debugging-coroutines-and-threads)）：

```text
Throwing exception from launch
Exception in thread "DefaultDispatcher-worker-1 @coroutine#2" java.lang.IndexOutOfBoundsException
Joined failed job
Throwing exception from async
Caught ArithmeticException
```

<!--- TEST EXCEPTION-->

## CoroutineExceptionHandler

可以自訂將**未捕獲的**異常列印到控制台的預設行為。[CoroutineExceptionHandler] 上下文元素在**根**協程中可用作此根協程及其所有子協程的通用 `catch` 區塊，可在其中進行自訂異常處理。它類似於 [`Thread.uncaughtExceptionHandler`](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html#setUncaughtExceptionHandler-java.lang.Thread.UncaughtExceptionHandler-)。您無法在 `CoroutineExceptionHandler` 中從異常中恢復。當呼叫處理器時，協程已經因相應的異常而完成。通常，處理器用於記錄異常、顯示某種錯誤訊息、終止和/或重新啟動應用程式。

`CoroutineExceptionHandler` 僅在**未捕獲的**異常時被呼叫&mdash;那些未以任何其他方式處理的異常。特別是，所有**子**協程（在另一個 [Job] 的上下文中建立的協程）將其異常的處理委派給它們的父協程，父協程也委派給其父協程，依此類推直到根協程，因此安裝在其上下文中的 `CoroutineExceptionHandler` 從不被使用。除此之外，[async] 建構器總是捕獲所有異常並將它們表示在結果 [Deferred] 物件中，因此其 `CoroutineExceptionHandler` 也沒有效果。

> 在監督作用域中執行的協程不會將異常傳播到其父級，並被排除在例外規則之外。本文檔的 [監督](#supervision) 區段將提供更多詳細資訊。
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
> 您可以在 [這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-02.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出是：

```text
CoroutineExceptionHandler got java.lang.AssertionError
```

<!--- TEST-->

## 取消與異常

取消與異常密切相關。協程內部使用 `CancellationException` 進行取消，這些異常被所有處理器忽略，因此它們只能用作附加調試資訊的來源，這些資訊可以透過 `catch` 區塊獲取。當使用 [Job.cancel] 取消協程時，它會終止，但它不會取消其父級。

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
> 您可以在 [這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-03.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出是：

```text
Cancelling child
Child is cancelled
Parent is not cancelled
```

<!--- TEST-->

如果協程遇到 `CancellationException` 以外的異常，它會用該異常取消其父級。這種行為無法被覆寫，並用於為 [結構化並行](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/composing-suspending-functions.md#structured-concurrency-with-async) 提供穩定的協程層級結構。[CoroutineExceptionHandler] 實作不適用於子協程。

> 在這些範例中，[CoroutineExceptionHandler] 總是安裝在 [GlobalScope] 中建立的協程上。將異常處理器安裝到在主 [runBlocking] 作用域中啟動的協程上沒有意義，因為當其子協程因異常完成時，主協程無論安裝了處理器都會被取消。
>
{style="note"}

原始異常僅在所有子協程終止時由父協程處理，如下例所示。

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
> 您可以在 [這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-04.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出是：

```text
Second child throws an exception
Children are cancelled, but exception is not handled until all children terminate
The first child finished its non cancellable block
CoroutineExceptionHandler got java.lang.ArithmeticException
```

<!--- TEST-->

## 異常聚合

當一個協程的多個子協程因異常失敗時，一般規則是「第一個異常獲勝」，因此第一個異常會被處理。在第一個異常之後發生的所有其他異常都會作為被抑制的異常附加到第一個異常上。

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
> 您可以在 [這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-05.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出是：

```text
CoroutineExceptionHandler got java.io.IOException with suppressed [java.lang.ArithmeticException]
```

<!--- TEST-->

> 請注意，此機制目前僅適用於 Java 1.7+ 版本。JS 和 Native 的限制是暫時的，未來將會解除。
>
{style="note"}

取消異常是透明的，並且預設情況下會被解包：

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
> 您可以在 [這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-06.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出是：

```text
Rethrowing CancellationException with original cause
CoroutineExceptionHandler got java.io.IOException
```

<!--- TEST-->

## 監督

正如我們之前研究過的，取消是透過協程的整個層級結構傳播的雙向關係。讓我們看看需要單向取消的情況。

這種需求的一個很好的例子是 UI 元件，其任務定義在其作用域中。如果 UI 的任何子任務失敗，不總是需要取消（實際上是終止）整個 UI 元件，但如果 UI 元件被銷毀（並且其任務被取消），則有必要取消所有子任務，因為它們的結果不再需要。

另一個例子是伺服器進程，它產生多個子任務，需要**監督**它們的執行，追蹤它們的失敗並僅重新啟動失敗的任務。

### 監督任務

[SupervisorJob][SupervisorJob()] 可以用於這些目的。它與常規的 [Job][Job()] 相似，唯一的例外是取消僅向下傳播。這可以透過以下範例輕鬆演示：

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
> 您可以在 [這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-01.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出是：

```text
The first child is failing
The first child is cancelled: true, but the second one is still active
Cancelling the supervisor
The second child is cancelled because the supervisor was cancelled
```

<!--- TEST-->

### 監督作用域

除了 [coroutineScope][_coroutineScope] 之外，我們可以使用 [supervisorScope][_supervisorScope] 進行**作用域內**的並行處理。它僅沿一個方向傳播取消，並且僅在自身失敗時才取消所有子協程。它也像 [coroutineScope][_coroutineScope] 一樣，會等待所有子協程完成後才完成。

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
> 您可以在 [這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-02.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出是：

```text
The child is sleeping
Throwing an exception from the scope
The child is cancelled
Caught an assertion error
```

<!--- TEST-->

#### 監督協程中的異常

常規任務與監督任務之間另一個關鍵區別是異常處理。每個子協程都應該透過異常處理機制自行處理其異常。這種區別源於子協程的失敗不會傳播到父協程的事實。這意味著直接在 [supervisorScope][_supervisorScope] 內啟動的協程**確實**會使用安裝在其作用域中的 [CoroutineExceptionHandler]，其方式與根協程相同（詳情請參閱 [CoroutineExceptionHandler](#coroutineexceptionhandler) 區段）。

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
> 您可以在 [這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-03.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出是：

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