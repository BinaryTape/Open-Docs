<!--- TEST_NAME BasicsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 協程基礎)

本節涵蓋協程的基本概念。

## 你的第一個協程

_協程_是可暫停計算的一個實例。在概念上，它類似於執行緒，因為它接受一個程式碼區塊來執行，該程式碼區塊與其他程式碼並行工作。然而，協程不綁定到任何特定的執行緒。它可以在一個執行緒中暫停執行，並在另一個執行緒中恢復。

協程可以被視為輕量級執行緒，但它們之間存在一些重要的差異，使得它們在實際使用上與執行緒大相徑庭。

執行以下程式碼以體驗你的第一個協程：

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
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-01.kt)取得完整的程式碼。
>
{style="note"}

你將看到以下結果：

```text
Hello
World!
```

<!--- TEST -->

讓我們來剖析這段程式碼的作用。

[launch] 是一個_協程建構器_。它會啟動一個新的協程，與其他程式碼並行執行，後者會獨立地繼續工作。這就是為什麼 `Hello` 會先被列印出來。

[delay] 是一個特殊的_暫停函式_。它會將協程_暫停_一段特定的時間。暫停協程並不會_阻塞_底層執行緒，而是允許其他協程運行並使用底層執行緒來執行它們的程式碼。

[runBlocking] 也是一個協程建構器，它連結了常規 `fun main()` 的非協程世界與 `runBlocking { ... }` 花括號內包含協程的程式碼。在 IDE 中，`runBlocking` 開啟花括號後方的 `this: CoroutineScope` 提示就突顯了這一點。

如果你在這段程式碼中移除或忘記了 `runBlocking`，你將在呼叫 [launch] 時遇到錯誤，因為 `launch` 只在 [CoroutineScope] 上宣告：

```
Unresolved reference: launch
```

[runBlocking] 的名稱意味著執行它的執行緒（在本例中 — 主執行緒）在呼叫期間會被_阻塞_，直到 `runBlocking { ... }` 內部的所有協程完成執行為止。你經常會在應用程式的最頂層看到 [runBlocking] 以這種方式使用，但在實際程式碼中則很少見，因為執行緒是昂貴的資源，阻塞它們效率低下且通常不被期望。

### 結構化併發

協程遵循**結構化併發**的原則，這表示新的協程只能在特定的 [CoroutineScope] 中啟動，該範圍界定了協程的生命週期。上面的範例顯示 [runBlocking] 建立了相應的作用域，這就是為什麼前面的範例會等待 `World!` 在一秒的延遲後被列印出來，然後才退出。

在實際應用程式中，你將啟動大量的協程。結構化併發確保它們不會遺失且不會洩漏。外部作用域在所有其子協程完成之前不能完成。結構化併發也確保程式碼中的任何錯誤都能正確報告，並且永不遺失。

## 提取函式重構

讓我們將 `launch { ... }` 內的程式碼區塊提取到一個單獨的函式中。當你對這段程式碼執行「提取函式」重構時，你會得到一個帶有 `suspend` 修飾符的新函式。這是你的第一個_暫停函式_。暫停函式可以在協程內部像普通函式一樣使用，但它們的額外特性是，它們可以反過來使用其他暫停函式（例如本範例中的 `delay`）來_暫停_協程的執行。

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
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-02.kt)取得完整的程式碼。
>
{style="note"}

<!--- TEST
Hello
World!
-->

## 作用域建構器

除了由不同建構器提供的協程作用域之外，還可以使用 [coroutineScope][_coroutineScope] 建構器宣告你自己的作用域。它會建立一個協程作用域，並且在所有已啟動的子代完成之前不會完成。

[runBlocking] 和 [coroutineScope][_coroutineScope] 建構器可能看起來相似，因為它們都等待其主體及其所有子代完成。主要區別在於 [runBlocking] 方法會_阻塞_當前執行緒以進行等待，而 [coroutineScope][_coroutineScope] 只是暫停，釋放底層執行緒供其他用途使用。由於這個差異，[runBlocking] 是一個普通函式，而 [coroutineScope][_coroutineScope] 是一個暫停函式。

你可以從任何暫停函式中使用 `coroutineScope`。例如，你可以將 `Hello` 和 `World` 的並行列印移動到 `suspend fun doWorld()` 函式中：

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
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-03.kt)取得完整的程式碼。
>
{style="note"}

這段程式碼也會列印出：

```text
Hello
World!
```

<!--- TEST -->

## 作用域建構器和併發

[coroutineScope][_coroutineScope] 建構器可以在任何暫停函式內部使用，以執行多個並行操作。讓我們在 `doWorld` 暫停函式內部啟動兩個並行協程：

```kotlin
import kotlinx.coroutines.*

//sampleStart
// 依序執行 doWorld，然後是 "Done"
fun main() = runBlocking {
    doWorld()
    println("Done")
}

// 並行執行兩個區塊
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
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-04.kt)取得完整的程式碼。
>
{style="note"}

`launch { ... }` 區塊內部的兩段程式碼都是_並行_執行的，`World 1` 會在啟動一秒後首先列印，而 `World 2` 則會在啟動兩秒後列印。`doWorld` 中的 [coroutineScope][_coroutineScope] 只有在兩者都完成後才會完成，因此 `doWorld` 會在此之後才返回並允許 `Done` 字串被列印：

```text
Hello
World 1
World 2
Done
```

<!--- TEST -->

## 一個明確的 Job

[launch] 協程建構器會返回一個 [Job] 物件，它是對已啟動協程的句柄，可以用來明確等待其完成。例如，你可以等待子協程完成，然後列印出 "Done" 字串：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch { // 啟動一個新協程並保留對其 Job 的引用
        delay(1000L)
        println("World!")
    }
    println("Hello")
    job.join() // 等待子協程完成
    println("Done") 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-05.kt -->
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-05.kt)取得完整的程式碼。
>
{style="note"}

這段程式碼會產生：

```text
Hello
World!
Done
```

<!--- TEST -->

## 協程是輕量級的

協程比 JVM 執行緒耗用的資源更少。使用執行緒時會耗盡 JVM 可用記憶體的程式碼，可以使用協程來表達，而不會達到資源限制。例如，以下程式碼啟動 50,000 個獨立的協程，每個協程等待 5 秒鐘，然後列印一個點（'.'），同時消耗很少的記憶體：

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
> 你可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-06.kt)取得完整的程式碼。
>
{style="note"}

<!--- TEST lines.size == 1 && lines[0] == ".".repeat(50_000) -->

如果你使用執行緒編寫相同的程式（移除 `runBlocking`，將 `launch` 替換為 `thread`，並將 `delay` 替換為 `Thread.sleep`），它將消耗大量記憶體。根據你的作業系統、JDK 版本及其設定，它要麼會拋出記憶體不足錯誤，要麼會緩慢啟動執行緒，使得不會有太多並行運行的執行緒。

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html

<!--- END -->