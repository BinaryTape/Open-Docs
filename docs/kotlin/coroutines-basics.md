<!--- TEST_NAME BasicsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 协程基础)

本节介绍协程的基本概念。

## 你的第一个协程

_协程_是可挂起计算的一个实例。从概念上讲，它与线程类似，因为它接受一段代码块来运行，该代码块与其余代码并发工作。
然而，协程不绑定到任何特定的线程。它可以在一个线程中挂起执行，并在另一个线程中恢复。

协程可以被认为是轻量级线程，但它们之间存在一些重要的区别，使得它们在实际使用中与线程大相径庭。

运行以下代码以实现你的第一个可工作的协程：

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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-01.kt)获取完整代码。
>
{style="note"}

你会看到以下结果：

```text
Hello
World!
```

<!--- TEST -->

让我们来分析一下这段代码的作用。

`[launch]` 是一个_协程构建器_。它与代码的其余部分并发启动一个新协程，其余代码继续独立运行。这就是为什么 `Hello` 首先被打印出来。

`[delay]` 是一个特殊的_挂起函数_。它将协程_挂起_指定时间。挂起协程并不会_阻塞_底层线程，而是允许其他协程运行并利用底层线程执行它们的代码。

`[runBlocking]` 也是一个协程构建器，它将常规 `fun main()` 的非协程世界与 `runBlocking { ... }` 花括号内的协程代码连接起来。这在 IDE 中通过 `runBlocking` 开花括号后面的 `this: CoroutineScope` 提示突出显示。

如果你在这段代码中移除或忘记 `runBlocking`，你会在 `[launch]` 调用处收到错误，因为 `launch` 只在 `[CoroutineScope]` 上声明：

```
Unresolved reference: launch
```

`runBlocking` 的名称意味着运行它的线程（在本例中是主线程）在调用期间会_阻塞_，直到 `runBlocking { ... }` 内的所有协程完成执行。你通常会在应用程序的最顶层看到 `runBlocking` 这样使用，而在实际代码中则很少见，因为线程是昂贵的资源，阻塞它们效率低下且通常不被期望。

### 结构化并发

协程遵循**结构化并发**原则，这意味着新协程只能在特定的 `[CoroutineScope]` 中启动，该作用域限定了协程的生命周期。上面的例子表明 `[runBlocking]` 建立了相应的作用域，这就是为什么前面的例子会等待 `World!` 在延迟一秒后被打印出来，然后才退出。

在实际应用程序中，你会启动许多协程。结构化并发确保它们不会丢失且不会泄露。外部作用域在其所有子协程完成之前无法完成。结构化并发还确保代码中的任何错误都能正确报告，并且永远不会丢失。

## 提取函数重构

让我们将 `launch { ... }` 内的代码块提取到一个单独的函数中。当你对这段代码执行“提取函数”重构时，你会得到一个带有 `suspend` 修饰符的新函数。
这是你的第一个_挂起函数_。挂起函数可以在协程内部像常规函数一样使用，但它们的额外特性是它们反过来可以使用其他挂起函数（例如本例中的 `delay`）来_挂起_协程的执行。

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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-02.kt)获取完整代码。
>
{style="note"}

<!--- TEST
Hello
World!
-->

## 作用域构建器

除了不同构建器提供的协程作用域之外，还可以使用 `[coroutineScope][_coroutineScope]` 构建器声明自己的作用域。它创建一个协程作用域，并且在所有启动的子协程完成之前不会完成。

`[runBlocking]` 和 `[coroutineScope][_coroutineScope]` 构建器可能看起来相似，因为它们都等待其主体及所有子协程完成。主要区别在于 `[runBlocking]` 方法在等待时会_阻塞_当前线程，而 `[coroutineScope][_coroutineScope]` 只是挂起，释放底层线程供其他用途。由于这个区别，`[runBlocking]` 是一个常规函数，而 `[coroutineScope][_coroutineScope]` 是一个挂起函数。

你可以在任何挂起函数中使用 `coroutineScope`。例如，你可以将 `Hello` 和 `World` 的并发打印移动到 `suspend fun doWorld()` 函数中：

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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-03.kt)获取完整代码。
>
{style="note"}

这段代码也会打印：

```text
Hello
World!
```

<!--- TEST -->

## 作用域构建器与并发

`[coroutineScope][_coroutineScope]` 构建器可以在任何挂起函数内部使用，以执行多个并发操作。让我们在 `doWorld` 挂起函数中启动两个并发协程：

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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-04.kt)获取完整代码。
>
{style="note"}

`launch { ... }` 块内的两段代码都_并发_执行，`World 1` 首先在启动后一秒打印，然后 `World 2` 在启动后两秒打印。`doWorld` 中的 `[coroutineScope][_coroutineScope]` 只有在两者都完成后才完成，因此 `doWorld` 只有在那之后才返回并允许打印 `Done` 字符串：

```text
Hello
World 1
World 2
Done
```

<!--- TEST -->

## 显式 Job

`[launch]` 协程构建器返回一个 `[Job]` 对象，它是已启动协程的一个句柄，可用于显式等待其完成。
例如，你可以等待子协程的完成，然后打印 “Done” 字符串：

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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-05.kt)获取完整代码。
>
{style="note"}

这段代码会生成：

```text
Hello
World!
Done
```

<!--- TEST -->

## 协程是轻量级的

协程比 JVM 线程更不占用资源。使用线程时会耗尽 JVM 可用内存的代码，使用协程可以表达而不会达到资源限制。
例如，以下代码启动 50,000 个不同的协程，每个协程等待 5 秒，然后打印一个句点（'.'），同时消耗非常少的内存：

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
> 你可以在[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-06.kt)获取完整代码。
>
{style="note"}

<!--- TEST lines.size == 1 && lines[0] == ".".repeat(50_000) -->

如果你使用线程编写相同的程序（移除 `runBlocking`，将 `launch` 替换为 `thread`，并将 `delay` 替换为 `Thread.sleep`），它将消耗大量内存。根据你的操作系统、JDK 版本及其设置，它要么抛出内存不足错误，要么缓慢启动线程，以至于永远不会有太多并发运行的线程。

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html

<!--- END -->