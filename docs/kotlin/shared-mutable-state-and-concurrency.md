<!--- TEST_NAME SharedStateGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 共享可变状态与并发)

协程可以使用像 [Dispatchers.Default] 这样的多线程调度器并行执行。这带来了所有常见的并行问题。主要问题是**共享可变状态**的访问同步。在协程领域，解决此问题的一些方案与多线程世界中的方案相似，但也有一些是独有的。

## 问题

让我们启动一百个协程，每个协程都将相同的操作执行一千次。我们还将测量它们的完成时间以供进一步比较：

```kotlin
suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // 要启动的协程数量
    val k = 1000 // 每个协程重复操作的次数
    val time = measureTimeMillis {
        coroutineScope { // 协程作用域
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

我们首先用一个非常简单的操作，使用多线程 [Dispatchers.Default] 递增一个共享可变变量。

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
> 您可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-01.kt)获取完整代码。
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

最终会打印什么？它极不可能打印出 "Counter = 100000"，因为一百个协程在没有任何同步的情况下从多个线程并发地递增 `counter`。

## `volatile` 变量无济于事

有一个常见的误解，认为将变量声明为 `volatile` 可以解决并发问题。让我们尝试一下：

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
@Volatile // 在 Kotlin 中，`volatile` 是一个注解 
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
> 您可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-02.kt)获取完整代码。
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

这段代码运行得更慢，但我们最终仍然无法总是得到 "Counter = 100000"，因为 `volatile` 变量保证对相应变量的读写是线性化（这是“原子性”的术语）的，但它们不提供更大操作（在我们例子中是递增操作）的原子性。

## 线程安全的数据结构

既适用于线程也适用于协程的通用解决方案是使用线程安全（又称同步的、线性化的或原子的）数据结构，它为对共享状态执行的相应操作提供了所有必要的同步。对于简单的计数器，我们可以使用 `AtomicInteger` 类，它具有原子性的 `incrementAndGet` 操作：

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
> 您可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-03.kt)获取完整代码。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

这是针对此特定问题的最快解决方案。它适用于普通计数器、集合、队列以及其他标准数据结构及其基本操作。然而，它不容易扩展到复杂状态或没有现成线程安全实现的复杂操作。

## 线程封闭：细粒度

_线程封闭_ 是一种解决共享可变状态问题的方法，其中对特定共享状态的所有访问都限制在单个线程中。它通常用于 UI 应用程序，其中所有 UI 状态都限制在单个事件分发/应用程序线程中。通过使用单线程上下文，它很容易应用于协程。

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
            // 将每次递增限制在单线程上下文内
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
> 您可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-04.kt)获取完整代码。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

这段代码运行非常缓慢，因为它执行的是_细粒度_的线程封闭。每次单独的递增都会使用 [withContext(counterContext)][withContext] 代码块从多线程的 [Dispatchers.Default] 上下文切换到单线程上下文。

## 线程封闭：粗粒度

实际上，线程封闭是以大块进行的，例如，大段的状态更新业务逻辑都限制在单个线程中。以下示例就是这样做的，从一开始就在单线程上下文内运行每个协程。

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
    // 将所有内容限制在单线程上下文内
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
> 您可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-05.kt)获取完整代码。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

现在它运行快得多，并产生正确的结果。

## 互斥

解决互斥问题的方案是使用从不并发执行的_临界区_来保护共享状态的所有修改。在阻塞世界中，通常会使用 `synchronized` 或 `ReentrantLock` 来实现。协程的替代方案称为 [Mutex]。它具有 [lock][Mutex.lock] 和 [unlock][Mutex.unlock] 函数来界定临界区。关键区别在于 `Mutex.lock()` 是一个挂起函数。它不会阻塞线程。

还有一个 [withLock] 扩展函数，它方便地表示了 `mutex.lock(); try { ... } finally { mutex.unlock() }` 模式：

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
            // 使用锁保护每次递增
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
> 您可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-06.kt)获取完整代码。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

此示例中的加锁是细粒度的，因此它付出了性能代价。然而，在某些情况下，当您绝对必须周期性地修改某些共享状态，但又没有该状态被限制的自然线程时，它是一个不错的选择。

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