<!--- TEST_NAME DispatcherGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 協程上下文與調度器)

協程總是在某個由 [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 型別值表示的上下文 (context) 中執行，該型別定義於 Kotlin 標準函式庫中。

協程上下文由各種元素組成。主要元素是我們之前見過的協程 [Job] 和本節將涵蓋的調度器。

## 調度器與執行緒

協程上下文包含一個*協程調度器*（參閱 [CoroutineDispatcher]），它決定了對應協程執行時使用的執行緒或多個執行緒。協程調度器可以將協程執行限制在特定執行緒，將其分派到執行緒池，或者讓其不受約束地執行。

所有協程建構器，例如 [launch] 和 [async]，都接受一個可選的 [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 參數，可用於明確指定新協程的調度器及其他上下文元素。

試試以下範例：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch { // context of the parent, main runBlocking coroutine
        println("main runBlocking      : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Unconfined) { // not confined -- will work with main thread
        println("Unconfined            : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Default) { // will get dispatched to DefaultDispatcher 
        println("Default               : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(newSingleThreadContext("MyOwnThread")) { // will get its own new thread
        println("newSingleThreadContext: I'm working in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-01.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-01.kt)取得完整程式碼。
>
{style="note"}

它會產生以下輸出（順序可能不同）：

```text
Unconfined            : I'm working in thread main
Default               : I'm working in thread DefaultDispatcher-worker-1
newSingleThreadContext: I'm working in thread MyOwnThread
main runBlocking      : I'm working in thread main
```

<!--- TEST LINES_START_UNORDERED -->

當 `launch { ... }` 在沒有參數的情況下使用時，它會從其啟動的 [CoroutineScope] 繼承上下文（以及調度器）。在此情況下，它會繼承在 `main` 執行緒中執行的主要 `runBlocking` 協程的上下文。

[Dispatchers.Unconfined] 是一個特殊的調度器，它看起來也在 `main` 執行緒中執行，但實際上，它是一種稍後會解釋的不同機制。

當作用域中沒有明確指定其他調度器時，會使用預設調度器。它由 [Dispatchers.Default] 表示，並使用一個共用的背景執行緒池。

[newSingleThreadContext] 會為協程的執行建立一個執行緒。專用執行緒是一種非常昂貴的資源。在實際應用中，當不再需要時，必須使用 [close][ExecutorCoroutineDispatcher.close] 函式將其釋放，或者將其儲存在頂層變數中並在整個應用程式中重複使用。

## 不受約束的調度器與受約束的調度器

[Dispatchers.Unconfined] 協程調度器會在呼叫者執行緒中啟動協程，但僅在第一個暫停點之前。暫停後，它會在完全由所呼叫的暫停函式決定的執行緒中恢復協程。不受約束的調度器適用於不消耗 CPU 時間也不更新任何限制在特定執行緒中的共用數據（例如 UI）的協程。

另一方面，調度器預設從外部 [CoroutineScope] 繼承。特別是，[runBlocking] 協程的預設調度器受限於呼叫者執行緒，因此繼承它會將執行限制在此執行緒中，並具有可預測的 FIFO 排程。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch(Dispatchers.Unconfined) { // not confined -- will work with main thread
        println("Unconfined      : I'm working in thread ${Thread.currentThread().name}")
        delay(500)
        println("Unconfined      : After delay in thread ${Thread.currentThread().name}")
    }
    launch { // context of the parent, main runBlocking coroutine
        println("main runBlocking: I'm working in thread ${Thread.currentThread().name}")
        delay(1000)
        println("main runBlocking: After delay in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-02.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-02.kt)取得完整程式碼。
>
{style="note"}

產生以下輸出：

```text
Unconfined      : I'm working in thread main
main runBlocking: I'm working in thread main
Unconfined      : After delay in thread kotlinx.coroutines.DefaultExecutor
main runBlocking: After delay in thread main
```

<!--- TEST LINES_START -->

因此，從 `runBlocking {...}` 繼承上下文的協程會繼續在 `main` 執行緒中執行，而不受約束的協程則會在 [delay] 函式使用的預設執行器執行緒中恢復。

> 不受約束的調度器是一種進階機制，在某些特殊情況下可能有所幫助，例如協程之後的執行不需要調度，或者會產生不良副作用，因為協程中的某些操作必須立即執行。在一般程式碼中不應使用不受約束的調度器。
>
{style="note"}

## 協程與執行緒除錯

協程可以在一個執行緒上暫停，並在另一個執行緒上恢復。即使使用單執行緒調度器，如果你沒有特殊的工具，也很難弄清楚協程在什麼地方、什麼時間做了什麼。

### 使用 IDEA 除錯

Kotlin 外掛程式的協程除錯器簡化了 IntelliJ IDEA 中協程的除錯。

> 除錯適用於 `kotlinx-coroutines-core` 1.3.8 或更高版本。
>
{style="note"}

**Debug** 工具視窗包含 **Coroutines** 分頁。在此分頁中，你可以找到目前正在執行和已暫停協程的資訊。協程會根據它們運行的調度器進行分組。

![Debugging coroutines](coroutine-idea-debugging-1.png){width=700}

使用協程除錯器，你可以：
*   檢查每個協程的狀態。
*   查看正在執行和已暫停協程的局部變數和捕獲變數的值。
*   查看完整的協程建立堆疊，以及協程內部的呼叫堆疊。該堆疊包含所有帶有變數值的框架，即使是在標準除錯期間會丟失的那些框架。
*   取得包含每個協程狀態及其堆疊的完整報告。若要取得它，請在 **Coroutines** 分頁中按一下右鍵，然後按一下 **Get Coroutines Dump**。

若要開始協程除錯，你只需要設定中斷點並在除錯模式下執行應用程式。

在[教程](https://kotlinlang.org/docs/tutorials/coroutines/debug-coroutines-with-idea.html)中了解更多關於協程除錯的資訊。

### 使用日誌記錄進行除錯

另一種在沒有協程除錯器的情況下對帶有執行緒的應用程式進行除錯的方法是在每個日誌語句中將執行緒名稱列印到日誌檔案中。此功能普遍受到日誌框架的支援。使用協程時，單獨的執行緒名稱並不能提供太多上下文，因此 `kotlinx.coroutines` 包含了除錯工具來使其更容易。

使用 `-Dkotlinx.coroutines.debug` JVM 選項執行以下程式碼：

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() = runBlocking<Unit> {
//sampleStart
    val a = async {
        log("I'm computing a piece of the answer")
        6
    }
    val b = async {
        log("I'm computing another piece of the answer")
        7
    }
    log("The answer is ${a.await() * b.await()}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-03.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-03.kt)取得完整程式碼。
>
{style="note"}

有三個協程。`runBlocking` 內部的主協程 (#1) 以及兩個計算延遲值 `a` (#2) 和 `b` (#3) 的協程。它們都在 `runBlocking` 的上下文中執行，並受限於主執行緒。此程式碼的輸出為：

```text
[main @coroutine#2] I'm computing a piece of the answer
[main @coroutine#3] I'm computing another piece of the answer
[main @coroutine#1] The answer is 42
```

<!--- TEST FLEXIBLE_THREAD -->

`log` 函式會在方括號中列印執行緒名稱，你可以看到它是 `main` 執行緒，後面附加了目前執行協程的識別碼。當除錯模式開啟時，此識別碼會連續分配給所有已建立的協程。

> 當 JVM 以 `-ea` 選項執行時，除錯模式也會開啟。你可以在 [DEBUG_PROPERTY_NAME] 屬性的文件中有關除錯工具的更多資訊。
>
{style="note"}

## 執行緒間跳轉

使用 `-Dkotlinx.coroutines.debug` JVM 選項執行以下程式碼（參閱 [debug](#debugging-coroutines-and-threads)）：

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() {
    newSingleThreadContext("Ctx1").use { ctx1 ->
        newSingleThreadContext("Ctx2").use { ctx2 ->
            runBlocking(ctx1) {
                log("Started in ctx1")
                withContext(ctx2) {
                    log("Working in ctx2")
                }
                log("Back to ctx1")
            }
        }
    }
}
```
<!--- KNIT example-context-04.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-04.kt)取得完整程式碼。
>
{style="note"}

上述範例展示了協程使用中的新技術。

第一種技術展示了如何將 [runBlocking] 與指定的上下文一起使用。第二種技術涉及呼叫 [withContext]，它可能會暫停目前的協程並切換到新的上下文——前提是新的上下文與現有上下文不同。具體來說，如果你指定了不同的 [CoroutineDispatcher]，則需要額外的分派：該區塊會在新的調度器上排程，一旦完成，執行將返回到原始調度器。

結果，上述程式碼的輸出為：

```text
[Ctx1 @coroutine#1] Started in ctx1
[Ctx2 @coroutine#1] Working in ctx2
[Ctx1 @coroutine#1] Back to ctx1
```

<!--- TEST -->

上述範例使用 Kotlin 標準函式庫中的 `use` 函式，以便在不再需要時正確釋放由 [newSingleThreadContext] 建立的執行緒資源。

## 上下文中的 Job

協程的 [Job] 是其上下文的一部分，可以使用 `coroutineContext[Job]` 運算式從中取得：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    println("My job is ${coroutineContext[Job]}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-05.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-05.kt)取得完整程式碼。
>
{style="note"}

在[除錯模式](#debugging-coroutines-and-threads)下，它會輸出類似這樣的內容：

```
My job is "coroutine#1":BlockingCoroutine{Active}@6d311334
```

<!--- TEST lines.size == 1 && lines[0].startsWith("My job is \"coroutine#1\":BlockingCoroutine{Active}@") -->

請注意，[CoroutineScope] 中的 [isActive] 只是 `coroutineContext[Job]?.isActive == true` 的便捷捷徑。

## 協程的子項

當一個協程在另一個協程的 [CoroutineScope] 中啟動時，它會透過 [CoroutineScope.coroutineContext] 繼承其上下文，並且新協程的 [Job] 會成為父協程的 Job 的*子項*。當父協程被取消時，它的所有子項也會遞迴地被取消。

然而，這種父子關係可以透過以下兩種方式明確覆蓋：

1.  當在啟動協程時明確指定了不同的作用域（例如，`GlobalScope.launch`）時，它不會從父作用域繼承 `Job`。
2.  當不同的 `Job` 物件作為新協程的上下文傳入時（如下面的範例所示），它會覆蓋父作用域的 `Job`。

在這兩種情況下，啟動的協程都不會與其啟動所在的作用域綁定，並且獨立運作。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    // launch a coroutine to process some kind of incoming request
    val request = launch {
        // it spawns two other jobs
        launch(Job()) { 
            println("job1: I run in my own Job and execute independently!")
            delay(1000)
            println("job1: I am not affected by cancellation of the request")
        }
        // and the other inherits the parent context
        launch {
            delay(100)
            println("job2: I am a child of the request coroutine")
            delay(1000)
            println("job2: I will not execute this line if my parent request is cancelled")
        }
    }
    delay(500)
    request.cancel() // cancel processing of the request
    println("main: Who has survived request cancellation?")
    delay(1000) // delay the main thread for a second to see what happens
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-06.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-06.kt)取得完整程式碼。
>
{style="note"}

此程式碼的輸出為：

```text
job1: I run in my own Job and execute independently!
job2: I am a child of the request coroutine
main: Who has survived request cancellation?
job1: I am not affected by cancellation of the request
```

<!--- TEST -->

## 父項職責

父協程總是會等待其所有子項的完成。父項不必明確追蹤它啟動的所有子項，也不必在最後使用 [Job.join] 等待它們：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    // launch a coroutine to process some kind of incoming request
    val request = launch {
        repeat(3) { i -> // launch a few children jobs
            launch  {
                delay((i + 1) * 200L) // variable delay 200ms, 400ms, 600ms
                println("Coroutine $i is done")
            }
        }
        println("request: I'm done and I don't explicitly join my children that are still active")
    }
    request.join() // wait for completion of the request, including all its children
    println("Now processing of the request is complete")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-07.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-07.kt)取得完整程式碼。
>
{style="note"}

結果將會是：

```text
request: I'm done and I don't explicitly join my children that are still active
Coroutine 0 is done
Coroutine 1 is done
Coroutine 2 is done
Now processing of the request is complete
```

<!--- TEST -->

## 為協程命名以便除錯

當協程經常記錄日誌並且你只需要關聯來自同一個協程的日誌記錄時，自動分配的 ID 很好用。然而，當一個協程與特定請求的處理或執行某些特定背景任務綁定時，為了除錯目的，最好明確地為其命名。[CoroutineName] 上下文元素的作用與執行緒名稱相同。當[除錯模式](#debugging-coroutines-and-threads)開啟時，它會包含在執行此協程的執行緒名稱中。

以下範例展示了此概念：

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() = runBlocking(CoroutineName("main")) {
//sampleStart
    log("Started main coroutine")
    // run two background value computations
    val v1 = async(CoroutineName("v1coroutine")) {
        delay(500)
        log("Computing v1")
        6
    }
    val v2 = async(CoroutineName("v2coroutine")) {
        delay(1000)
        log("Computing v2")
        7
    }
    log("The answer for v1 * v2 = ${v1.await() * v2.await()}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-08.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-08.kt)取得完整程式碼。
>
{style="note"}

它使用 `-Dkotlinx.coroutines.debug` JVM 選項產生的輸出類似於：

```text
[main @main#1] Started main coroutine
[main @v1coroutine#2] Computing v1
[main @v2coroutine#3] Computing v2
[main @main#1] The answer for v1 * v2 = 42
```

<!--- TEST FLEXIBLE_THREAD -->

## 組合上下文元素

有時我們需要為協程上下文定義多個元素。我們可以使用 `+` 運算子來實現。例如，我們可以同時啟動一個具有明確指定調度器和明確指定名稱的協程：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch(Dispatchers.Default + CoroutineName("test")) {
        println("I'm working in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-09.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-09.kt)取得完整程式碼。
>
{style="note"}

此程式碼在 `-Dkotlinx.coroutines.debug` JVM 選項下的輸出為：

```text
I'm working in thread DefaultDispatcher-worker-1 @test#2
```

<!--- TEST FLEXIBLE_THREAD -->

## 協程作用域

讓我們將關於上下文、子項和 Job 的知識整合起來。假設我們的應用程式有一個具有生命週期的物件，但該物件不是協程。例如，我們正在編寫一個 Android 應用程式，並在 Android activity 的上下文中啟動各種協程，以執行非同步操作來獲取和更新數據、執行動畫等。這些協程必須在 activity 銷毀時取消，以避免記憶體洩漏。當然，我們可以手動操作上下文和 Job，將 activity 及其協程的生命週期綁定，但 `kotlinx.coroutines` 提供了一個封裝此功能的抽象：[CoroutineScope]。你應該已經熟悉協程作用域，因為所有協程建構器都聲明為其擴展函式。

我們透過建立一個與 activity 生命週期綁定的 [CoroutineScope] 實例來管理協程的生命週期。[CoroutineScope] 實例可以透過 [CoroutineScope()] 或 [MainScope()] 工廠函式建立。前者建立一個通用作用域，而後者為 UI 應用程式建立一個作用域，並使用 [Dispatchers.Main] 作為預設調度器：

```kotlin
class Activity {
    private val mainScope = MainScope()
    
    fun destroy() {
        mainScope.cancel()
    }
    // to be continued ...
```

現在，我們可以使用定義的 `mainScope` 在此 `Activity` 的作用域中啟動協程。為了演示，我們啟動十個協程，它們延遲不同的時間：

```kotlin
    // class Activity continues
    fun doSomething() {
        // launch ten coroutines for a demo, each working for a different time
        repeat(10) { i ->
            mainScope.launch {
                delay((i + 1) * 200L) // variable delay 200ms, 400ms, ... etc
                println("Coroutine $i is done")
            }
        }
    }
} // class Activity ends
```

在我們的主函式中，我們建立 activity，呼叫我們的測試 `doSomething` 函式，並在 500 毫秒後銷毀 activity。這會取消所有從 `doSomething` 啟動的協程。我們可以看到，因為在 activity 銷毀後，即使我們再等一會兒，也不再列印任何訊息。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*

class Activity {
    private val mainScope = CoroutineScope(Dispatchers.Default) // use Default for test purposes
    
    fun destroy() {
        mainScope.cancel()
    }

    fun doSomething() {
        // launch ten coroutines for a demo, each working for a different time
        repeat(10) { i ->
            mainScope.launch {
                delay((i + 1) * 200L) // variable delay 200ms, 400ms, ... etc
                println("Coroutine $i is done")
            }
        }
    }
} // class Activity ends

fun main() = runBlocking<Unit> {
//sampleStart
    val activity = Activity()
    activity.doSomething() // run test function
    println("Launched coroutines")
    delay(500L) // delay for half a second
    println("Destroying activity!")
    activity.destroy() // cancels all coroutines
    delay(1000) // visually confirm that they don't work
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-10.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-10.kt)取得完整程式碼。
>
{style="note"}

此範例的輸出為：

```text
Launched coroutines
Coroutine 0 is done
Coroutine 1 is done
Destroying activity!
```

<!--- TEST -->

如你所見，只有前兩個協程列印了一條訊息，而其他協程則被 `Activity.destroy()` 中單一呼叫 [`mainScope.cancel()`][CoroutineScope.cancel] 所取消。

> 請注意，Android 對所有具有生命週期的實體中的協程作用域都有第一方支援。請參閱[相關文件](https://developer.android.com/topic/libraries/architecture/coroutines#lifecyclescope)。
>
{style="note"}

### 執行緒局部數據

有時，能夠將一些執行緒局部數據傳遞給協程或在協程之間傳遞會很方便。然而，由於它們不綁定到任何特定執行緒，如果手動完成，這可能會導致樣板程式碼。

對於 [`ThreadLocal`](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html)，[asContextElement] 擴展函式在此處提供幫助。它建立一個額外的上下文元素，該元素會保留給定 `ThreadLocal` 的值，並在協程每次切換其上下文時恢復它。

很容易在實際應用中展示它：

```kotlin
import kotlinx.coroutines.*

val threadLocal = ThreadLocal<String?>() // declare thread-local variable

fun main() = runBlocking<Unit> {
//sampleStart
    threadLocal.set("main")
    println("Pre-main, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
    val job = launch(Dispatchers.Default + threadLocal.asContextElement(value = "launch")) {
        println("Launch start, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
        yield()
        println("After yield, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
    }
    job.join()
    println("Post-main, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-11.kt -->
> 你可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-11.kt)取得完整程式碼。
>
{style="note"}

在此範例中，我們使用 [Dispatchers.Default] 在背景執行緒池中啟動一個新協程，因此它在執行緒池中的不同執行緒上工作，但它仍然具有我們使用 `threadLocal.asContextElement(value = "launch")` 指定的執行緒局部變數的值，無論協程在哪個執行緒上執行。因此，輸出（帶有[除錯](#debugging-coroutines-and-threads)）為：

```text
Pre-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
Launch start, current thread: Thread[DefaultDispatcher-worker-1 @coroutine#2,5,main], thread local value: 'launch'
After yield, current thread: Thread[DefaultDispatcher-worker-2 @coroutine#2,5,main], thread local value: 'launch'
Post-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
```

<!--- TEST FLEXIBLE_THREAD -->

很容易忘記設定對應的上下文元素。如果執行協程的執行緒不同，從協程存取的執行緒局部變數可能會具有意外值。為了避免這種情況，建議使用 [ensurePresent] 方法並在不當使用時快速失敗。

`ThreadLocal` 具有一流支援，可以與 `kotlinx.coroutines` 提供的任何基本類型一起使用。不過，它有一個關鍵限制：當執行緒局部變數被更改時，新值不會傳播到協程呼叫者（因為上下文元素無法追蹤所有 `ThreadLocal` 物件存取），並且更新的值會在下一次暫停時丟失。使用 [withContext] 在協程中更新執行緒局部變數的值，詳情請參閱 [asContextElement]。

或者，值可以儲存在像 `class Counter(var i: Int)` 這樣的可變箱中，該可變箱又儲存在執行緒局部變數中。然而，在這種情況下，你必須全權負責同步此可變箱中變數的潛在並行修改。

對於進階用法，例如與日誌 MDC、交易上下文或任何其他內部使用執行緒局部變數來傳遞數據的函式庫整合，請參閱應該實作的 [ThreadContextElement] 介面的文件。

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[CoroutineDispatcher]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/index.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[Dispatchers.Unconfined]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-unconfined.html
[Dispatchers.Default]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html
[newSingleThreadContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/new-single-thread-context.html
[ExecutorCoroutineDispatcher.close]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-executor-coroutine-dispatcher/close.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[DEBUG_PROPERTY_NAME]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-d-e-b-u-g_-p-r-o-p-e-r-t-y_-n-a-m-e.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[isActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html
[CoroutineScope.coroutineContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/coroutine-context.html
[Job.join]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[CoroutineName]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-name/index.html
[CoroutineScope()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope.html
[MainScope()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main-scope.html
[Dispatchers.Main]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html
[CoroutineScope.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[asContextElement]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/as-context-element.html
[ensurePresent]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-present.html
[ThreadContextElement]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-thread-context-element/index.html