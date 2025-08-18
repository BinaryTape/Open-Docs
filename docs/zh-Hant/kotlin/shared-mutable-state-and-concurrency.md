<!--- TEST_NAME SharedStateGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 共享可變狀態與並發)

協程可以使用像 [Dispatchers.Default] 這樣多執行緒的調度器並行執行。這會引發所有常見的並行問題。主要問題是同步對**共享可變狀態**的存取。協程領域中解決此問題的一些方案與多執行緒世界中的方案相似，但有些則是獨特的。

## 問題

讓我們啟動一百個協程，每個都重複執行相同的動作一千次。我們還將測量它們的完成時間以供進一步比較：

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

我們從一個非常簡單的動作開始，它使用多執行緒 [Dispatchers.Default] 來遞增一個共享可變變數。

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
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-01.kt)獲取完整程式碼。
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

最後會印出什麼？它極不可能印出「Counter = 100000」，因為一百個協程在沒有任何同步的情況下，從多個執行緒並發地遞增 `counter`。

## volatile 無濟於事

人們普遍誤解將變數設為 `volatile` 可以解決並發問題。讓我們試試看：

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
@Volatile // 在 Kotlin 中，`volatile` 是一個註解 
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
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-02.kt)獲取完整程式碼。
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

這段程式碼執行得較慢，但我們最終仍然不會總是得到「Counter = 100000」，因為 `volatile` 變數保證對應變數的線性化（這是一個「原子性」的技術術語）讀取和寫入，但它們不提供更大操作（我們案例中的遞增）的原子性。

## 執行緒安全資料結構

對於執行緒和協程都通用的解決方案是使用執行緒安全（又稱同步、線性化或原子性）的資料結構，它為需要在共享狀態上執行的相應操作提供所有必要的同步。對於簡單的計數器，我們可以使用 `AtomicInteger` 類別，它具有原子性的 `incrementAndGet` 操作：

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
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-03.kt)獲取完整程式碼。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

這是此特定問題最快的解決方案。它適用於簡單的計數器、集合、佇列以及其他標準資料結構及其基本操作。然而，它不容易擴展到複雜狀態或沒有現成執行緒安全實作的複雜操作。

## 執行緒限制 (細粒度)

_執行緒限制_ 是一種解決共享可變狀態問題的方法，其中對特定共享狀態的所有存取都被限制在單一執行緒中。它通常用於 UI 應用程式，其中所有 UI 狀態都被限制在單一事件分派/應用程式執行緒中。透過使用單執行緒上下文，它很容易與協程一起應用。

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
            // 將每次遞增限制在單執行緒上下文中
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
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-04.kt)獲取完整程式碼。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

這段程式碼執行得非常慢，因為它執行的是 _細粒度_ 的執行緒限制。每次單獨的遞增都會使用 [withContext(counterContext)][withContext] 區塊從多執行緒 [Dispatchers.Default] 上下文切換到單執行緒上下文。

## 執行緒限制 (粗粒度)

在實踐中，執行緒限制是以大塊進行的，例如，狀態更新業務邏輯的大部分都被限制在單一執行緒中。以下範例就是這樣做的，首先在單執行緒上下文中執行每個協程。

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
    // 將所有內容限制在單執行緒上下文中
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
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-05.kt)獲取完整程式碼。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

現在這樣執行速度快得多，並產生正確的結果。

## 互斥

解決此問題的互斥方案是使用一個從不並發執行的 _臨界區_ 來保護共享狀態的所有修改。在阻塞的世界中，你通常會為此使用 `synchronized` 或 `ReentrantLock`。協程的替代方案稱為 [Mutex]。它有 [lock][Mutex.lock] 和 [unlock][Mutex.unlock] 函數來界定臨界區。關鍵區別在於 `Mutex.lock()` 是一個掛起函數。它不會阻塞執行緒。

還有一個 [withLock] 擴展函數，它方便地表示了 `mutex.lock(); try { ... } finally { mutex.unlock() }` 模式：

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
            // 使用鎖保護每次遞增
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
> 您可以在[此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-06.kt)獲取完整程式碼。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

本範例中的鎖定是細粒度的，因此它付出了代價。然而，在某些情況下，當你絕對必須定期修改某些共享狀態，但沒有該狀態所限制的自然執行緒時，這是一個很好的選擇。

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