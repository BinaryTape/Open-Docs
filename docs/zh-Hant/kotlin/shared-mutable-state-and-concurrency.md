<!--- TEST_NAME SharedStateGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 共享可變狀態與並發)

協程可以使用 [Dispatchers.Default] 等多執行緒調度器並行執行。這會產生所有常見的並行問題。主要問題在於對**共享可變狀態**的存取同步。在協程領域中，此問題的一些解決方案與多執行緒世界的解決方案相似，但也有一些是獨特的。

## 問題

讓我們啟動一百個協程，每個協程都執行相同的動作一千次。我們還會測量它們的完成時間，以便進一步比較：

```kotlin
suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}
```

我們從一個非常簡單的動作開始，它使用多執行緒 [Dispatchers.Default] 遞增一個共享可變變數。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*    

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
var counter = 0

fun main() = runBlocking {
    withContext(Dispatchers.Default) {
        massiveRun {
            counter++
        }
    }
    println("Counter = $counter")
}
//sampleEnd    
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-01.kt -->
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-01.kt)取得完整程式碼。
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

最後會印出什麼？它極不可能印出 "Counter = 100000"，因為一百個協程在沒有任何同步的情況下從多個執行緒並發地遞增 `counter`。

## Volatile 毫無幫助

一個常見的誤解是將變數設為 `volatile` 可以解決並發問題。讓我們試試看：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
@Volatile // in Kotlin `volatile` is an annotation 
var counter = 0

fun main() = runBlocking {
    withContext(Dispatchers.Default) {
        massiveRun {
            counter++
        }
    }
    println("Counter = $counter")
}
//sampleEnd    
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-02.kt -->
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-02.kt)取得完整程式碼。
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

這段程式碼執行速度較慢，但最後我們仍然不總是得到 "Counter = 100000"，因為 `volatile` 變數保證對應變數的線性化（這是「原子性」的技術術語）讀取和寫入，但它們不提供較大操作（在本例中是遞增）的原子性。

## 執行緒安全的資料結構

適用於執行緒和協程的通用解決方案是使用執行緒安全（亦稱為同步化、線性化或原子性）的資料結構，它為需要對共享狀態執行的相應操作提供所有必要的同步。對於簡單的計數器，我們可以使用 `AtomicInteger` 類別，它具有原子性的 `incrementAndGet` 操作：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import java.util.concurrent.atomic.*
import kotlin.system.*

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
val counter = AtomicInteger()

fun main() = runBlocking {
    withContext(Dispatchers.Default) {
        massiveRun {
            counter.incrementAndGet()
        }
    }
    println("Counter = $counter")
}
//sampleEnd    
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-03.kt -->
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-03.kt)取得完整程式碼。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

這是針對此特定問題最快的解決方案。它適用於普通計數器、集合、佇列及其他標準資料結構，以及它們的基本操作。但是，它不容易擴展到複雜的狀態或沒有現成執行緒安全實作的複雜操作。

## 執行緒隔離：細粒度

_執行緒隔離_ 是一種解決共享可變狀態問題的方法，其中對特定共享狀態的所有存取都限制在單一執行緒上。它通常用於 UI 應用程式，其中所有 UI 狀態都限制在單一事件分派/應用程式執行緒上。透過使用單執行緒上下文，協程很容易應用此方法。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
val counterContext = newSingleThreadContext("CounterContext")
var counter = 0

fun main() = runBlocking {
    withContext(Dispatchers.Default) {
        massiveRun {
            // confine each increment to a single-threaded context
            withContext(counterContext) {
                counter++
            }
        }
    }
    println("Counter = $counter")
}
//sampleEnd      
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-04.kt -->
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-04.kt)取得完整程式碼。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

這段程式碼執行速度非常慢，因為它執行的是 _細粒度_ 的執行緒隔離。每個單獨的遞增都會使用 [withContext(counterContext)][withContext] 區塊從多執行緒 [Dispatchers.Default] 上下文切換到單執行緒上下文。

## 執行緒隔離：粗粒度

實際上，執行緒隔離是以大塊（chunk）方式執行的，例如大塊的狀態更新業務邏輯被限制在單一執行緒上。以下範例就是這樣做的，一開始就讓每個協程在單執行緒上下文中執行。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
val counterContext = newSingleThreadContext("CounterContext")
var counter = 0

fun main() = runBlocking {
    // confine everything to a single-threaded context
    withContext(counterContext) {
        massiveRun {
            counter++
        }
    }
    println("Counter = $counter")
}
//sampleEnd     
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-05.kt -->
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-05.kt)取得完整程式碼。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

現在它的執行速度快得多，並產生了正確的結果。

## 互斥

互斥的解決方案是透過一個從不並發執行的 _關鍵區段_ 保護所有對共享狀態的修改。在阻塞世界中，您通常會使用 `synchronized` 或 `ReentrantLock` 來實現這一點。協程的替代方案稱為 [Mutex]。它具有 [lock][Mutex.lock] 和 [unlock][Mutex.unlock] 函式來劃定關鍵區段。關鍵區別在於 `Mutex.lock()` 是一個暫停函式。它不會阻塞執行緒。

還有一個 [withLock] 擴展函式，它方便地表示 `mutex.lock(); try { ... } finally { mutex.unlock() }` 模式：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.*
import kotlin.system.*

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
val mutex = Mutex()
var counter = 0

fun main() = runBlocking {
    withContext(Dispatchers.Default) {
        massiveRun {
            // protect each increment with lock
            mutex.withLock {
                counter++
            }
        }
    }
    println("Counter = $counter")
}
//sampleEnd    
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-06.kt -->
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-06.kt)取得完整程式碼。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

此範例中的鎖定是細粒度的，因此會付出性能代價。然而，在某些情況下，當您絕對必須定期修改某些共享狀態，但沒有此狀態被限制在的自然執行緒時，這是一個不錯的選擇。

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[Dispatchers.Default]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html

<!--- INDEX kotlinx.coroutines.sync -->

[Mutex]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-mutex/index.html
[Mutex.lock]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-mutex/lock.html
[Mutex.unlock]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-mutex/unlock.html
[withLock]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/with-lock.html

<!--- END -->