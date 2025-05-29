<!--- TEST_NAME BasicsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 協程基礎概念)

本節涵蓋協程的基本概念。

## 你的第一個協程

_協程 (coroutine)_ 是一個可暫停計算的實例。它在概念上類似於執行緒 (thread)，因為它接收一個程式碼區塊來運行，並且與其餘程式碼並行工作。然而，協程不受任何特定執行緒的約束。它可以在一個執行緒中暫停 (suspend) 執行，並在另一個執行緒中恢復 (resume) 執行。

協程可以被視為輕量級執行緒，但它們之間存在一些重要的差異，使得它們在實際應用中的用法與執行緒截然不同。

運行以下程式碼來實現你的第一個工作協程：

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { // launch a new coroutine and continue
        delay(1000L) // non-blocking delay for 1 second (default time unit is ms)
        println("World!") // print after delay
    }
    println("Hello") // main coroutine continues while a previous one is delayed
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-01.kt -->
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-01.kt)獲取完整程式碼。
>
{style="note"}

你將看到以下結果：

```text
Hello
World!
```

<!--- TEST -->

讓我們剖析這段程式碼的功能。

[launch] 是一個_協程建構器 (coroutine builder)_。它啟動一個新的協程，與其餘程式碼同時執行，並獨立工作。這就是為什麼 `Hello` 會先被印出來。

[delay] 是一個特殊的_暫停函數 (suspending function)_。它會讓協程_暫停_特定時間。暫停協程並不會_阻塞_底層執行緒，而是允許其他協程運行並使用底層執行緒執行它們的程式碼。

[runBlocking] 也是一個協程建構器，它橋接了常規 `fun main()` 的非協程世界與 `runBlocking { ... }` 大括號內的協程程式碼。這在 IDE 中會透過 `this: CoroutineScope` 提示在 `runBlocking` 開啟大括號之後顯示。

如果你在這段程式碼中移除或忘記使用 `runBlocking`，你將在 [launch] 呼叫處得到一個錯誤，因為 `launch` 只在 [CoroutineScope] 上聲明：

```
Unresolved reference: launch
```

`runBlocking` 的名稱意味著運行它的執行緒（在此例中為主要執行緒）會被_阻塞_，直到 `runBlocking { ... }` 內的所有協程完成執行。你經常會在應用程式的最頂層看到 `runBlocking` 如此使用，但在實際程式碼中卻很少見，因為執行緒是昂貴的資源，阻塞它們效率低下且通常不被期望。

### 結構化並發

協程遵循_**結構化並發 (structured concurrency)**_ 的原則，這意味著新的協程只能在特定的 [CoroutineScope] 中啟動，該作用域劃定了協程的生命週期。上述範例顯示 [runBlocking] 建立了相應的作用域，這就是為什麼前一個範例會等待 `World!` 在一秒的延遲後印出，然後才退出。

在實際應用中，你會啟動大量協程。結構化並發確保它們不會丟失且不會洩漏。外部作用域在其所有子協程完成之前不能完成。結構化並發還確保程式碼中的任何錯誤都能被正確報告且永不丟失。

## 提取函數重構

讓我們將 `launch { ... }` 內部的程式碼區塊提取到一個單獨的函數中。當你對這段程式碼執行「提取函數 (Extract function)」重構時，你會得到一個帶有 `suspend` 修飾符的新函數。這是你的第一個_暫停函數_。暫停函數可以在協程內部像常規函數一樣使用，但它們的額外特性是它們可以轉而使用其他暫停函數（如本例中的 `delay`）來_暫停_協程的執行。

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { doWorld() }
    println("Hello")
}

// this is your first suspending function
suspend fun doWorld() {
    delay(1000L)
    println("World!")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-02.kt -->
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-02.kt)獲取完整程式碼。
>
{style="note"}

<!--- TEST
Hello
World!
-->

## 作用域建構器

除了不同建構器提供的協程作用域之外，還可以使用 [coroutineScope][_coroutineScope] 建構器聲明你自己的作用域。它創建一個協程作用域，並且只有當所有啟動的子協程完成後才會完成。

[runBlocking] 和 [coroutineScope][_coroutineScope] 建構器可能看起來很相似，因為它們都等待其主體及其所有子協程完成。主要區別在於 [runBlocking] 方法會_阻塞_當前執行緒進行等待，而 [coroutineScope][_coroutineScope] 僅僅是暫停，釋放底層執行緒供其他用途使用。由於這個差異，[runBlocking] 是一個常規函數，而 [coroutineScope][_coroutineScope] 是一個暫停函數。

你可以在任何暫停函數中使用 `coroutineScope`。例如，你可以將 `Hello` 和 `World` 的並發列印移到 `suspend fun doWorld()` 函數中：

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking {
    doWorld()
}

suspend fun doWorld() = coroutineScope {  // this: CoroutineScope
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-03.kt -->
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-03.kt)獲取完整程式碼。
>
{style="note"}

這段程式碼也印出：

```text
Hello
World!
```

<!--- TEST -->

## 作用域建構器和並發

[coroutineScope][_coroutineScope] 建構器可以在任何暫停函數內部使用，以執行多個並行操作。讓我們在 `doWorld` 暫停函數內部啟動兩個並行協程：

```kotlin
import kotlinx.coroutines.*

//sampleStart
// Sequentially executes doWorld followed by "Done"
fun main() = runBlocking {
    doWorld()
    println("Done")
}

// Concurrently executes both sections
suspend fun doWorld() = coroutineScope { // this: CoroutineScope
    launch {
        delay(2000L)
        println("World 2")
    }
    launch {
        delay(1000L)
        println("World 1")
    }
    println("Hello")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-04.kt -->
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-04.kt)獲取完整程式碼。
>
{style="note"}

`launch { ... }` 程式碼區塊內的兩段程式碼是_並行地 (concurrently)_ 執行，`World 1` 會在開始後一秒先被印出，而 `World 2` 會在開始後兩秒接著被印出。`doWorld` 中的 [coroutineScope][_coroutineScope] 只有在兩者都完成後才會完成，因此 `doWorld` 會返回並允許 `Done` 字串在那之後被印出：

```text
Hello
World 1
World 2
Done
```

<!--- TEST -->

## 明確的 Job

[launch] 協程建構器返回一個 [Job] 物件，它是對已啟動協程的句柄 (handle)，可以用來明確地 (explicitly) 等待其完成。例如，你可以等待子協程完成，然後印出 "Done" 字串：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch { // launch a new coroutine and keep a reference to its Job
        delay(1000L)
        println("World!")
    }
    println("Hello")
    job.join() // wait until child coroutine completes
    println("Done") 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-05.kt -->
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-05.kt)獲取完整程式碼。
>
{style="note"}

這段程式碼產生：

```text
Hello
World!
Done
```

<!--- TEST -->

## 協程是輕量級的

協程比 JVM 執行緒耗用的資源更少。使用執行緒時會耗盡 JVM 可用記憶體的程式碼，可以使用協程來表達而不會達到資源限制。例如，以下程式碼啟動 50,000 個獨立的協程，每個協程等待 5 秒然後印出一個點 ('.')，同時消耗極少記憶體：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    repeat(50_000) { // launch a lot of coroutines
        launch {
            delay(5000L)
            print(".")
        }
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-06.kt -->
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-06.kt)獲取完整程式碼。
>
{style="note"}

<!--- TEST lines.size == 1 && lines[0] == ".".repeat(50_000) -->

如果你使用執行緒編寫相同的程式（移除 `runBlocking`，將 `launch` 替換為 `thread`，將 `delay` 替換為 `Thread.sleep`），它將消耗大量記憶體。根據你的作業系統、JDK 版本及其設定，它要麼會拋出記憶體不足錯誤，要麼會緩慢啟動執行緒，使得同時運行的執行緒數量永遠不會過多。

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html

<!--- END -->