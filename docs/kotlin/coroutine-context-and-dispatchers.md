<!--- TEST_NAME DispatcherGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 协程上下文与调度器)

协程总是在某个上下文中执行，该上下文由 Kotlin 标准库中定义的 [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 类型的值表示。

协程上下文是各种元素的集合。主要元素是协程的 [Job]（我们之前已经见过）及其调度器，本节将介绍它。

## 调度器与线程

协程上下文包含一个 _协程调度器_（参见 [CoroutineDispatcher]），它决定了相应协程用于执行的线程或线程集。协程调度器可以将协程执行限制在特定线程、将其分派到线程池，或者让其以非受限方式运行。

所有协程构建器（如 [launch] 和 [async]）都接受一个可选的 [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 参数，该参数可用于显式指定新协程的调度器及其他上下文元素。

尝试以下示例：

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-01.kt)。
>
{style="note"}

它会产生以下输出（顺序可能不同）：

```text
Unconfined            : I'm working in thread main
Default               : I'm working in thread DefaultDispatcher-worker-1
newSingleThreadContext: I'm working in thread MyOwnThread
main runBlocking      : I'm working in thread main
```

<!--- TEST LINES_START_UNORDERED -->

当 `launch { ... }` 不带参数使用时，它会从其启动的 [CoroutineScope] 继承上下文（以及调度器）。在这种情况下，它继承了运行在 `main` 线程中的主 `runBlocking` 协程的上下文。

[Dispatchers.Unconfined] 是一种特殊的调度器，它似乎也在 `main` 线程中运行，但实际上，它是一种不同的机制，稍后会进行解释。

当作用域中未显式指定其他调度器时，会使用默认调度器。它由 [Dispatchers.Default] 表示，并使用一个共享的后台线程池。

[newSingleThreadContext] 会为协程创建一个线程来运行。一个专用线程是非常昂贵的资源。在实际应用程序中，当不再需要时，必须使用 [close][ExecutorCoroutineDispatcher.close] 函数释放它，或者将其存储在顶层变量中并在整个应用程序中重复使用。

## 非受限调度器与受限调度器

[Dispatchers.Unconfined] 协程调度器会在调用者线程中启动协程，但仅限于第一个挂起点之前。挂起之后，它会在完全由所调用的挂起函数确定的线程中恢复协程。非受限调度器适用于那些既不消耗 CPU 时间，也不更新任何限制在特定线程上的共享数据（如 UI）的协程。

另一方面，调度器默认从外部 [CoroutineScope] 继承。特别是，[runBlocking] 协程的默认调度器受限于调用者线程，因此继承它会使执行受限于该线程，并具有可预测的 FIFO 调度。

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-02.kt)。
>
{style="note"}

产生以下输出：

```text
Unconfined      : I'm working in thread main
main runBlocking: I'm working in thread main
Unconfined      : After delay in kotlinx.coroutines.DefaultExecutor
main runBlocking: After delay in thread main
```

<!--- TEST LINES_START -->

所以，从 `runBlocking {...}` 继承上下文的协程继续在 `main` 线程中执行，而未受限的协程则在 [delay] 函数使用的默认执行器线程中恢复。

> 非受限调度器是一种高级机制，在某些特殊情况下可能会有所帮助，即协程的后续执行不需要分派，或者会产生不良副作用，因为协程中的某些操作必须立即执行。非受限调度器不应在常规代码中使用。
>
{style="note"}

## 调试协程与线程

协程可以在一个线程上挂起并在另一个线程上恢复。即使使用单线程调度器，如果没有特殊工具，也很难弄清楚协程在何时何地做了什么。

### 使用 IDEA 调试

Kotlin 插件的协程调试器简化了 IntelliJ IDEA 中的协程调试。

> 调试适用于 `kotlinx-coroutines-core` 1.3.8 或更高版本。
>
{style="note"}

“**调试**”工具窗口包含“**协程**”选项卡。在此选项卡中，你可以找到有关当前正在运行和已挂起协程的信息。协程会根据其运行的调度器进行分组。

![Debugging coroutines](coroutine-idea-debugging-1.png){width=700}

使用协程调试器，你可以：
* 检查每个协程的状态。
* 查看正在运行和已挂起协程的局部变量和捕获变量的值。
* 查看完整的协程创建堆栈以及协程内部的调用堆栈。该堆栈包含所有带有变量值的帧，即使是那些在标准调试期间会丢失的帧。
* 获取包含每个协程状态及其堆栈的完整报告。要获取它，请右键单击“**协程**”选项卡内部，然后单击“**Get Coroutines Dump**”。

要开始协程调试，你只需设置断点并在调试模式下运行应用程序。

在[教程](https://kotlinlang.org/docs/tutorials/coroutines/debug-coroutines-with-idea.html)中了解更多关于协程调试的信息。

### 使用日志进行调试

另一种在不使用协程调试器的情况下调试带有线程的应用程序的方法是在每个日志语句中将线程名称打印到日志文件中。此功能受到日志框架的普遍支持。当使用协程时，仅凭线程名称并不能提供太多上下文，因此 `kotlinx.coroutines` 包含了调试工具以使其更简单。

使用 `-Dkotlinx.coroutines.debug` JVM 选项运行以下代码：

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-03.kt)。
>
{style="note"}

这里有三个协程。`runBlocking` 内部的主协程 (#1) 和两个计算延迟值 `a` (#2) 和 `b` (#3) 的协程。它们都在 `runBlocking` 的上下文中执行，并受限于主线程。此代码的输出是：

```text
[main @coroutine#2] I'm computing a piece of the answer
[main @coroutine#3] I'm computing another piece of the answer
[main @coroutine#1] The answer is 42
```

<!--- TEST FLEXIBLE_THREAD -->

`log` 函数在方括号中打印线程名称，你可以看到它是 `main` 线程，并附加了当前正在执行的协程的标识符。当调试模式开启时，此标识符会按顺序分配给所有创建的协程。

> 当 JVM 运行带 `-ea` 选项时，调试模式也会开启。你可以在 [DEBUG_PROPERTY_NAME] 属性的文档中阅读更多关于调试工具的信息。
>
{style="note"}

## 线程间跳转

使用 `-Dkotlinx.coroutines.debug` JVM 选项运行以下代码（参见[调试](#debugging-coroutines-and-threads)）：

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-04.kt)。
>
{style="note"}

上面的示例展示了协程使用中的新技巧。

第一种技巧展示了如何使用带指定上下文的 [runBlocking]。第二种技巧涉及调用 [withContext]，它可能会挂起当前协程并切换到新上下文——前提是新上下文与现有上下文不同。具体来说，如果你指定了不同的 [CoroutineDispatcher]，则需要额外的分派：该代码块会在新调度器上调度，一旦完成，执行将返回到原始调度器。

因此，上述代码的输出是：

```text
[Ctx1 @coroutine#1] Started in ctx1
[Ctx2 @coroutine#1] Working in ctx2
[Ctx1 @coroutine#1] Back to ctx1
```

<!--- TEST -->

上面的示例使用了 Kotlin 标准库中的 `use` 函数，以便在不再需要时正确释放由 [newSingleThreadContext] 创建的线程资源。

## 上下文中的 Job

协程的 [Job] 是其上下文的一部分，可以使用 `coroutineContext[Job]` 表达式从中检索：

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-05.kt)。
> 
{style="note"}

在[调试模式](#debugging-coroutines-and-threads)下，它会输出类似以下内容：

```
My job is "coroutine#1":BlockingCoroutine{Active}@6d311334
```

<!--- TEST lines.size == 1 && lines[0].startsWith("My job is \"coroutine#1\":BlockingCoroutine{Active}@") -->

请注意，[CoroutineScope] 中的 [isActive] 只是 `coroutineContext[Job]?.isActive == true` 的一个便捷快捷方式。

## 协程的子协程

当一个协程在另一个协程的 [CoroutineScope] 中启动时，它会通过 [CoroutineScope.coroutineContext] 继承其上下文，并且新协程的 [Job] 会成为父协程 Job 的_子级_。当父协程被取消时，它的所有子协程也会被递归取消。

然而，这种父子关系可以通过以下两种方式之一显式覆盖：

1.  当启动协程时显式指定不同的作用域（例如 `GlobalScope.launch`）时，它不会从父作用域继承 `Job`。
2.  当一个不同的 `Job` 对象作为新协程的上下文传递时（如下例所示），它会覆盖父作用域的 `Job`。

在这两种情况下，启动的协程都不会绑定到其启动的作用域，并独立运行。

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-06.kt)。
>
{style="note"}

此代码的输出是：

```text
job1: I run in my own Job and execute independently!
job2: I am a child of the request coroutine
main: Who has survived request cancellation?
job1: I am not affected by cancellation of the request
```

<!--- TEST -->

## 父级职责

父协程总是等待其所有子协程的完成。父级不必显式跟踪它启动的所有子协程，也无需在最后使用 [Job.join] 等待它们：

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-07.kt)。
>
{style="note"}

结果将是：

```text
request: I'm done and I don't explicitly join my children that are still active
Coroutine 0 is done
Coroutine 1 is done
Coroutine 2 is done
Now processing of the request is complete
```

<!--- TEST -->

## 为协程命名以便调试

当协程经常记录日志，并且你只需要关联来自同一协程的日志记录时，自动分配的 ID 很好用。然而，当协程与特定请求的处理或执行某些特定后台任务相关联时，为了调试目的，最好显式地为其命名。[CoroutineName] 上下文元素的作用与线程名称相同。当[调试模式](#debugging-coroutines-and-threads)开启时，它会包含在执行此协程的线程名称中。

以下示例演示了这一概念：

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-08.kt)。
>
{style="note"}

使用 `-Dkotlinx.coroutines.debug` JVM 选项运行它会产生类似以下输出：

```text
[main @main#1] Started main coroutine
[main @v1coroutine#2] Computing v1
[main @v2coroutine#3] Computing v2
[main @main#1] The answer for v1 * v2 = 42
```

<!--- TEST FLEXIBLE_THREAD -->

## 组合上下文元素

有时我们需要为一个协程上下文定义多个元素。我们可以使用 `+` 运算符来实现。例如，我们可以同时启动一个协程，并显式指定调度器和名称：

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-09.kt)。
>
{style="note"}

使用 `-Dkotlinx.coroutines.debug` JVM 选项运行此代码的输出是：

```text
I'm working in thread DefaultDispatcher-worker-1 @test#2
```

<!--- TEST FLEXIBLE_THREAD -->

## 协程作用域

让我们将有关上下文、子协程和 Job 的知识结合起来。假设我们的应用程序有一个具有生命周期的对象，但该对象本身不是协程。例如，我们正在编写一个 Android 应用程序，并在 Android Activity 的上下文中启动各种协程，以执行异步操作来获取和更新数据、进行动画等。当 Activity 被销毁时，这些协程必须被取消，以避免内存泄漏。当然，我们可以手动操作上下文和 Job 来将 Activity 及其协程的生命周期绑定起来，但 `kotlinx.coroutines` 提供了一个封装此功能的抽象：[CoroutineScope]。你可能已经熟悉协程作用域，因为所有协程构建器都被声明为它的扩展函数。

我们通过创建绑定到 Activity 生命周期的 [CoroutineScope] 实例来管理协程的生命周期。[CoroutineScope] 实例可以通过 [CoroutineScope()] 或 [MainScope()] 工厂函数创建。前者创建一个通用作用域，而后者为 UI 应用程序创建一个作用域，并使用 [Dispatchers.Main] 作为默认调度器：

```kotlin
class Activity {
    private val mainScope = MainScope()
    
    fun destroy() {
        mainScope.cancel()
    }
    // to be continued ...
```

现在，我们可以使用定义的 `mainScope` 在此 `Activity` 的作用域中启动协程。为了演示，我们启动十个协程，它们会延迟不同的时间：

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

在我们的 `main` 函数中，我们创建 Activity，调用测试函数 `doSomething`，并在 500 毫秒后销毁 Activity。这将取消从 `doSomething` 启动的所有协程。我们可以看到，因为在 Activity 销毁后，即使我们再等待一会儿，也不会再打印任何消息。

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-10.kt)。
>
{style="note"}

此示例的输出是：

```text
Launched coroutines
Coroutine 0 is done
Coroutine 1 is done
Destroying activity!
```

<!--- TEST -->

如你所见，只有前两个协程打印了消息，其他协程都通过在 `Activity.destroy()` 中单次调用 [`mainScope.cancel()`][CoroutineScope.cancel] 被取消了。

> 请注意，Android 对所有具有生命周期的实体都提供了协程作用域的一方支持。请参阅[相关文档](https://developer.android.com/topic/libraries/architecture/coroutines#lifecyclescope)。
>
{style="note"}

### 线程局部数据

有时，能够将一些线程局部数据传递给协程或在协程之间传递是很方便的。然而，由于协程不绑定到任何特定线程，如果手动完成，这很可能会导致样板代码。

对于 [`ThreadLocal`](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html)，[asContextElement] 扩展函数在此提供帮助。它会创建一个额外的上下文元素，该元素会保留给定 `ThreadLocal` 的值，并在协程每次切换上下文时恢复它。

这很容易通过实际操作来演示：

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
> 完整的代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-11.kt)。
>
{style="note"}

在此示例中，我们使用 [Dispatchers.Default] 在后台线程池中启动了一个新协程，因此它在线程池的不同线程上工作，但无论协程在哪个线程上执行，它仍然具有我们使用 `threadLocal.asContextElement(value = "launch")` 指定的线程局部变量的值。因此，输出（带[调试](#debugging-coroutines-and-threads)）为：

```text
Pre-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
Launch start, current thread: Thread[DefaultDispatcher-worker-1 @coroutine#2,5,main], thread local value: 'launch'
After yield, current thread: Thread[DefaultDispatcher-worker-2 @coroutine#2,5,main], thread local value: 'launch'
Post-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
```

<!--- TEST FLEXIBLE_THREAD -->

很容易忘记设置相应的上下文元素。如果运行协程的线程不同，从协程访问的线程局部变量可能会具有意外的值。为了避免这种情况，建议使用 [ensurePresent] 方法并在不当使用时快速失败。

`ThreadLocal` 具有一流的支持，并且可以与 `kotlinx.coroutines` 提供的任何基本类型一起使用。但是，它有一个关键限制：当线程局部变量被修改时，新值不会传播到协程调用者（因为上下文元素无法跟踪所有 `ThreadLocal` 对象访问），并且更新后的值会在下一次挂起时丢失。使用 [withContext] 来更新协程中线程局部变量的值，详见 [asContextElement]。

或者，值可以存储在一个可变盒中，例如 `class Counter(var i: Int)`，它又存储在一个线程局部变量中。但是，在这种情况下，你需全权负责同步对该可变盒中变量可能发生的并发修改。

对于高级用法，例如与日志 MDC、事务上下文或任何其他内部使用线程局部变量传递数据的库集成，请参阅应实现的 [ThreadContextElement] 接口的文档。

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

<!--- END -->