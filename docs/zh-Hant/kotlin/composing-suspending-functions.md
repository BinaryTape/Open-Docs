<!--- TEST_NAME ComposingGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 組合掛起函式)

本節涵蓋組合掛起函式的各種方法。

## 預設循序執行

假設我們有兩個在其他地方定義的掛起函式，它們執行一些有用的操作，例如某種遠端服務呼叫或計算。我們只是假裝它們很有用，但實際上每個函式僅為本範例的目的延遲一秒：

```kotlin
suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // 假裝我們在這裡做一些有用的事情
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假裝我們在這裡也做一些有用的事情
    return 29
}
```

如果我們需要依序調用它們 &mdash; 首先是 `doSomethingUsefulOne` _然後是_ `doSomethingUsefulTwo`，並計算它們結果的總和，我們該怎麼辦？實際上，如果我們使用第一個函式的結果來決定是否需要調用第二個函式，或決定如何調用它，我們就會這樣做。

我們使用正常的循序調用，因為協程中的程式碼，就像常規程式碼一樣，預設是 _循序執行_ 的。以下範例透過測量執行兩個掛起函式所需的總時間來演示這一點：

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
    delay(1000L) // 假裝我們在這裡做一些有用的事情
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假裝我們在這裡也做一些有用的事情
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-01.kt -->
> 您可以在此處取得完整程式碼 [here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-01.kt)。
>
{style="note"}

它會產生類似以下的輸出：

```text
The answer is 42
Completed in 2017 ms
```

<!--- TEST ARBITRARY_TIME -->

## 使用 async 並行執行

如果 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo` 的調用之間沒有依賴關係，並且我們希望透過 _並行_ 執行這兩者來更快地得到答案，該怎麼辦？這就是 [async] 發揮作用的地方。
 
概念上，[async] 就像 [launch] 一樣。它啟動一個獨立的協程，這是一個輕量級執行緒，與所有其他協程並行工作。不同之處在於 `launch` 返回一個 [Job] 且不攜帶任何結果值，而 `async` 返回一個 [Deferred] &mdash; 一個輕量級非阻塞的未來 (future)，代表稍後提供結果的承諾。您可以在一個 deferred 值上使用 `.await()` 來取得其最終結果，但 `Deferred` 也是一個 [Job]，因此如果需要，您可以取消它。

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
    delay(1000L) // 假裝我們在這裡做一些有用的事情
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假裝我們在這裡也做一些有用的事情
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-02.kt -->
> 您可以在此處取得完整程式碼 [here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-02.kt)。
>
{style="note"}

它會產生類似以下的輸出：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

這快了兩倍，因為這兩個協程是並行執行的。請注意，協程的並行性總是明確的。

## 延遲啟動的 async

可選地，可以透過將 [async] 的 `start` 參數設定為 [CoroutineStart.LAZY] 來使其延遲啟動。在此模式下，它僅在其結果被 [await][Deferred.await] 需要時，或當其 `Job` 的 [start][Job.start] 函式被調用時，才會啟動協程。請執行以下範例：

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = async(start = CoroutineStart.LAZY) { doSomethingUsefulOne() }
        val two = async(start = CoroutineStart.LAZY) { doSomethingUsefulTwo() }
        // 執行一些計算
        one.start() // 啟動第一個
        two.start() // 啟動第二個
        println("The answer is ${one.await() + two.await()}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // 假裝我們在這裡做一些有用的事情
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假裝我們在這裡也做一些有用的事情
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-03.kt -->
> 您可以在此處取得完整程式碼 [here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-03.kt)。
>
{style="note"}

它會產生類似以下的輸出：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

因此，在這裡，兩個協程被定義但未像前面的範例那樣執行，而是透過呼叫 [start][Job.start] 將何時啟動執行的控制權交給程式設計師。我們首先啟動 `one`，然後啟動 `two`，接著等待個別協程完成。

請注意，如果我們在 `println` 中直接呼叫 [await][Deferred.await] 而不先在個別協程上呼叫 [start][Job.start]，這將導致循序行為，因為 [await][Deferred.await] 會啟動協程執行並等待其完成，這不是延遲啟動的預期使用情境。`async(start = CoroutineStart.LAZY)` 的使用情境是在值計算涉及掛起函式時，取代標準的 [lazy](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/lazy.html) 函式。

## Async 風格函式

> 這種使用 async 函式的程式設計風格僅在此處用於說明，因為它是其他程式語言中一種流行的風格。出於下述原因，**強烈不建議**在 Kotlin 協程中使用此風格。
>
{style="note"}

我們可以使用 [async] 協程建構器並透過 [GlobalScope] 參考來選擇退出結構化並行 (structured concurrency)，定義以 _非同步_ 方式調用 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo` 的 async 風格函式。
我們將此類函式命名為帶有「...Async」後綴，以強調它們僅啟動非同步計算，並且需要使用生成的 deferred 值來取得結果。

> [GlobalScope] 是一個精巧的 API，它可能以不顯著的方式產生反效果，其中之一將在下面解釋，因此您必須使用 `@OptIn(DelicateCoroutinesApi::class)` 明確選擇啟用 `GlobalScope`。
>
{style="note"}

```kotlin
// somethingUsefulOneAsync 的結果型別是 Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

// somethingUsefulTwoAsync 的結果型別是 Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}
```

請注意，這些 `xxxAsync` 函式**不是** _掛起_ 函式。它們可以在任何地方使用。然而，它們的使用總是意味著其動作與調用程式碼的非同步（此處指 _並行_）執行。
 
<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

//sampleStart
// 請注意，在本範例中，`main` 右側沒有 `runBlocking`
fun main() {
    val time = measureTimeMillis {
        // 我們可以在協程外部啟動 async 動作
        val one = somethingUsefulOneAsync()
        val two = somethingUsefulTwoAsync()
        // 但等待結果必須涉及掛起或阻塞。
        // 在此，我們使用 `runBlocking { ... }` 來阻塞主執行緒，同時等待結果
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
    delay(1000L) // 假裝我們在這裡做一些有用的事情
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假裝我們在這裡也做一些有用的事情
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-04.kt -->
> 您可以在此處取得完整程式碼 [here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-04.kt)。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
The answer is 42
Completed in 1085 ms
-->

考慮一下，如果在 `val one = somethingUsefulOneAsync()` 行與 `one.await()` 表達式之間，程式碼中存在一些邏輯錯誤，並且程式拋出一個例外，且程式正在執行的操作被中止。通常，全域錯誤處理器可以捕獲此例外，記錄並報告錯誤給開發者，但程式仍可繼續執行其他操作。然而，在這裡，即使啟動它的操作被中止，`somethingUsefulOneAsync` 仍在背景運行。這個問題在結構化並行中不會發生，如下一節所示。

## 搭配 async 的結構化並行

讓我們將 [使用 async 並行執行](#concurrent-using-async) 範例重構為一個函式，該函式同時執行 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo` 並返回它們的組合結果。由於 [async] 是一個 [CoroutineScope] 擴充功能，我們將使用 [coroutineScope][_coroutineScope] 函式來提供必要的範圍：

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```

這樣一來，如果在 `concurrentSum` 函式的程式碼內部出現問題並拋出例外，則在其範圍內啟動的所有協程都將被取消。

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
    delay(1000L) // 假裝我們在這裡做一些有用的事情
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假裝我們在這裡也做一些有用的事情
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-05.kt -->
> 您可以在此處取得完整程式碼 [here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-05.kt)。
>
{style="note"}

我們仍然可以並行執行這兩個操作，這從上述 `main` 函式的輸出中可以清楚看出：

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

取消總是透過協程階層傳播：

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
            delay(Long.MAX_VALUE) // 模擬非常長的計算
            42
        } finally {
            println("第一個子協程已取消")
        }
    }
    val two = async<Int> { 
        println("第二個子協程拋出例外")
        throw ArithmeticException()
    }
    one.await() + two.await()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-06.kt -->
> 您可以在此處取得完整程式碼 [here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-06.kt)。
>
{style="note"}

請注意，當其中一個子協程（即 `two`）失敗時，第一個 `async` 和等待中的父協程都會被取消：
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