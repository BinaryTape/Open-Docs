<!--- TEST_NAME ComposingGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 組合暫停函式)

本節涵蓋了組合暫停函式的各種方法。

## 預設為循序執行

假設我們有另外定義的兩個暫停函式，它們執行一些有用的操作，例如某種遠端服務呼叫或計算。我們只是假裝它們很有用，但實際上在範例中，每個函式都只延遲了一秒鐘：

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

如果我們需要它們循序調用 — 先 `doSomethingUsefulOne` 然後 `doSomethingUsefulTwo`，並計算它們結果的總和，我們該怎麼辦？實際上，如果我們使用第一個函式的結果來決定是否需要調用第二個函式，或者如何調用它，我們就會這樣做。

我們使用普通的循序調用，因為協程中的程式碼，就像常規程式碼一樣，預設是_循序執行_的。以下範例透過測量執行兩個暫停函式所需的總時間來展示這一點：

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
> 您可以[在此](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-01.kt)獲取完整程式碼。
>
{style="note"}

它產生類似以下的結果：

```text
The answer is 42
Completed in 2017 ms
```

<!--- TEST ARBITRARY_TIME -->

## 使用 async 進行並發

如果 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo` 的調用之間沒有依賴關係，並且我們希望透過_並發_執行兩者來更快地得到答案，該怎麼辦？這就是 [async] 發揮作用的地方。

概念上，[async] 就像 [launch]。它啟動一個單獨的協程，這是一個輕量級的執行緒，與所有其他協程並發工作。區別在於 `launch` 返回一個 [Job] 並且不帶有任何結果值，而 `async` 返回一個 [Deferred] — 一個輕量級的非阻塞型 future，代表稍後提供結果的承諾。您可以在 deferred 值上使用 `.await()` 來獲取其最終結果，但 `Deferred` 也是一個 `Job`，所以如果需要，您可以取消它。

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
> 您可以[在此](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-02.kt)獲取完整程式碼。
>
{style="note"}

它產生類似以下的結果：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

這速度快了兩倍，因為兩個協程是並發執行的。請注意，協程的並發性總是顯式的。

## 延遲啟動的 async

[async] 可以選擇性地透過將其 `start` 參數設定為 [CoroutineStart.LAZY] 來實現延遲啟動。在此模式下，它僅在 [await][Deferred.await] 要求其結果時，或其 `Job` 的 [start][Job.start] 函式被調用時才啟動協程。執行以下範例：

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
> 您可以[在此](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-03.kt)獲取完整程式碼。
>
{style="note"}

它產生類似以下的結果：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

因此，這裡的兩個協程被定義但未像之前的範例那樣執行，但透過調用 [start][Job.start]，控制權交給了程式設計師，精確決定何時開始執行。我們首先啟動 `one`，然後啟動 `two`，接著等待個別協程完成。

請注意，如果我們在 `println` 中直接調用 [await][Deferred.await]，而沒有首先在個別協程上調用 [start][Job.start]，這將導致循序行為，因為 [await][Deferred.await] 會啟動協程執行並等待其完成，這並非延遲啟動的預期用途。`async(start = CoroutineStart.LAZY)` 的用例是作為標準 [lazy](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/lazy.html) 函式在值計算涉及暫停函式時的替代方案。

## Async 樣式函式

> 這種帶有 async 函式的編程樣式在這裡僅供說明之用，因為它在其他編程語言中是一種流行的樣式。由於以下解釋的原因，**強烈不建議**在 Kotlin 協程中使用此樣式。
>
{style="note"}

我們可以定義 async 樣式的函式，透過使用 [GlobalScope] 參考來選擇退出結構化並發，並使用 [async] 協程建構器_非同步地_調用 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo`。我們用「...Async」後綴來命名這類函式，以強調它們只會啟動非同步計算，並且需要使用產生的 deferred 值來獲取結果。

> [GlobalScope] 是一個精巧的 API，它可能以不尋常的方式產生反作用，其中一種將在下面解釋，因此您必須使用 `@OptIn(DelicateCoroutinesApi::class)` 明確選擇啟用 `GlobalScope`。
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

請注意，這些 `xxxAsync` 函式**不是** _暫停_函式。它們可以在任何地方使用。然而，它們的使用總是意味著其動作與調用程式碼的非同步（這裡指_並發_）執行。

以下範例展示了它們在協程之外的使用方式：

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
> 您可以[在此](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-04.kt)獲取完整程式碼。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
The answer is 42
Completed in 1085 ms
-->

考慮一下如果在 `val one = somethingUsefulOneAsync()` 行和 `one.await()` 表達式之間程式碼出現邏輯錯誤，程式拋出異常，並且程式正在執行的操作被中止時會發生什麼。通常，全域錯誤處理器可以捕獲此異常，記錄並向開發人員報告錯誤，但程式在其他方面可以繼續執行其他操作。然而，這裡我們有 `somethingUsefulOneAsync` 仍在後台運行，即使啟動它的操作已經中止。這個問題不會發生在結構化並發中，如下面章節所示。

## 使用 async 的結構化並發

讓我們將[使用 async 進行並發](#concurrent-using-async)的範例重構為一個函式，該函式同時執行 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo` 並返回它們的組合結果。由於 [async] 是一個 [CoroutineScope] 擴展，我們將使用 [coroutineScope][_coroutineScope] 函式來提供必要的 scope：

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```

這樣一來，如果 `concurrentSum` 函式程式碼內部出現問題，並拋出異常，在其 scope 內啟動的所有協程都將被取消。

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
> 您可以[在此](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-05.kt)獲取完整程式碼。
>
{style="note"}

我們仍然並發執行這兩個操作，從上面 `main` 函式的輸出中可以明顯看出：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

取消總是會透過協程層次結構傳播：

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
> 您可以[在此](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-06.kt)獲取完整程式碼。
>
{style="note"}

請注意，當其中一個子項（即 `two`）失敗時，第一個 `async` 和等待中的父級都如何被取消：
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