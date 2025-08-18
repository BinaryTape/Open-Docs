<!--- TEST_NAME DispatcherGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 协程上下文与调度器)

协程总是在某个上下文中执行，该上下文由 Kotlin 标准库中定义的 [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 类型的值表示。

协程上下文是一组各种元素。主要元素是协程的 [Job]（我们之前已经见过），以及本节将介绍的其调度器。

## 调度器与线程

协程上下文包含一个 _协程调度器_（参见 [CoroutineDispatcher]），它决定了相应协程用于执行的线程或线程们。协程调度器可以将协程执行限制在特定线程，将其调度到线程池，或者让它无限制地运行。

所有协程构建器，例如 [launch] 和 [async]，都接受一个可选的 [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 形参，该形参可用于显式指定新协程的调度器和其他上下文元素。

尝试以下示例：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch { // 父级 main runBlocking 协程的上下文
        println("main runBlocking      : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Unconfined) { // 未受限制 -- 将在主线程工作
        println("Unconfined            : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Default) { // 将调度到 DefaultDispatcher 
        println("Default               : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(newSingleThreadContext("MyOwnThread")) { // 将获取它自己的新线程
        println("newSingleThreadContext: I'm working in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-01.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-01.kt)获取完整代码。
>
{style="note"}

它产生以下输出（顺序可能不同）：

```text
Unconfined            : I'm working in thread main
Default               : I'm working in thread DefaultDispatcher-worker-1
newSingleThreadContext: I'm working in thread MyOwnThread
main runBlocking      : I'm working in thread main
```

<!--- TEST LINES_START_UNORDERED -->

当 `launch { ... }` 不带形参使用时，它会从启动它的 [CoroutineScope] 继承上下文（以及调度器）。在本例中，它继承了在 `main` 线程中运行的 `runBlocking` 主协程的上下文。

[Dispatchers.Unconfined] 是一个特殊的调度器，它也似乎在 `main` 线程中运行，但它实际上是一种稍后解释的不同机制。

当作用域中没有显式指定其他调度器时，将使用默认调度器。它由 [Dispatchers.Default] 表示，并使用共享的后台线程池。

[newSingleThreadContext] 为协程运行创建一个线程。专用线程是非常昂贵的资源。在实际应用程序中，当不再需要时，必须要么使用 [close][ExecutorCoroutineDispatcher.close] 函数释放它，要么将其存储在顶层变量中并在整个应用程序中重用。

## 无限制调度器与受限调度器

[Dispatchers.Unconfined] 协程调度器在调用者线程中启动协程，但仅限于第一个挂起点之前。挂起后，它在由所调用的挂起函数完全确定的线程中恢复协程。无限制调度器适用于既不消耗 CPU 时间也不更新限制于特定线程的任何共享数据（例如 UI）的协程。

另一方面，调度器默认从外部 [CoroutineScope] 继承。特别是，[runBlocking] 协程的默认调度器限制在调用者线程，因此继承它会产生将执行限制在此线程，并带有可预测的 FIFO 调度效果。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch(Dispatchers.Unconfined) { // 未受限制 -- 将在主线程工作
        println("Unconfined      : I'm working in thread ${Thread.currentThread().name}")
        delay(500)
        println("Unconfined      : After delay in thread ${Thread.currentThread().name}")
    }
    launch { // 父级 main runBlocking 协程的上下文
        println("main runBlocking: I'm working in thread ${Thread.currentThread().name}")
        delay(1000)
        println("main runBlocking: After delay in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-02.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-02.kt)获取完整代码。
>
{style="note"}

产生以下输出：

```text
Unconfined      : I'm working in thread main
main runBlocking: I'm working in thread main
Unconfined      : After delay in thread kotlinx.coroutines.DefaultExecutor
main runBlocking: After delay in thread main
```

<!--- TEST LINES_START -->

因此，从 `runBlocking {...}` 继承上下文的协程继续在 `main` 线程中执行，而无限制的协程则在 [delay] 函数正在使用的默认执行器线程中恢复。

> 无限制调度器是一种高级机制，在某些极端情况下可能会很有用，例如不需要稍后调度协程执行，或者因为协程中的某些操作必须立即执行而产生不希望的副作用。无限制调度器不应在通用代码中使用。
>
{style="note"}

## 调试协程与线程

协程可以在一个线程上挂起，并在另一个线程上恢复。即使使用单线程调度器，如果你没有特殊的工具，也可能很难弄清楚协程在做什么，在哪里，以及何时。

### 使用 IDEA 调试

Kotlin 插件的协程调试器简化了 IntelliJ IDEA 中协程的调试。

> 调试适用于 `kotlinx-coroutines-core` 的 1.3.8 或更高版本。
>
{style="note"}

**Debug** 工具窗口包含 **Coroutines** 选项卡。在此选项卡中，你可以找到有关当前运行和挂起协程的信息。协程按其运行的调度器进行分组。

![Debugging coroutines](coroutine-idea-debugging-1.png){width=700}

使用协程调试器，你可以：
* 检测每个协程的状态。
* 查看运行中和挂起协程的局部变量和捕获变量的值。
* 查看完整的协程创建堆栈，以及协程内的调用堆栈。堆栈包括所有带有变量值的帧，甚至那些在标准调试期间会丢失的帧。
* 获取包含每个协程状态及其堆栈的完整报告。要获取它，请右键单击 **Coroutines** 选项卡内部，然后单击 **Get Coroutines Dump**。

要开始协程调试，你只需设置断点并在调试模式下运行应用程序。

有关协程调试的更多信息，请参阅[教程](https://kotlinlang.org/docs/tutorials/coroutines/debug-coroutines-with-idea.html)。

### 使用日志记录调试

另一种在没有协程调试器的情况下调试带线程应用程序的方法是，在每个日志语句中将线程名称打印到日志文件。此特性得到日志框架的普遍支持。当使用协程时，仅线程名称并不能提供太多上下文，因此 `kotlinx.coroutines` 包含了调试功能来使其更容易。

使用 `-Dkotlinx.coroutines.debug` JVM 选项运行以下代码：

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() = runBlocking<Unit> {
//sampleStart
    val a = async {
        log("我正在计算答案的一部分")
        6
    }
    val b = async {
        log("我正在计算答案的另一部分")
        7
    }
    log("答案是 ${a.await() * b.await()}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-03.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-03.kt)获取完整代码。
>
{style="note"}

有三个协程。`runBlocking` 内部的主协程（#1）以及计算延迟值 `a`（#2）和 `b`（#3）的两个协程。它们都在 `runBlocking` 的上下文中执行并限制在主线程。此代码的输出是：

```text
[main @coroutine#2] I'm computing a piece of the answer
[main @coroutine#3] I'm computing another piece of the answer
[main @coroutine#1] The answer is 42
```

<!--- TEST FLEXIBLE_THREAD -->

`log` 函数在方括号中打印线程名称，你可以看到它是 `main` 线程，并附加了当前执行协程的标识符。当调试模式开启时，此标识符会连续分配给所有创建的协程。

> 当 JVM 使用 `-ea` 选项运行时，调试模式也会开启。
> 你可以在 [DEBUG_PROPERTY_NAME] 属性的文档中阅读更多关于调试功能的信息。
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
                log("在 ctx1 中启动")
                withContext(ctx2) {
                    log("在 ctx2 中工作")
                }
                log("回到 ctx1")
            }
        }
    }
}
```
<!--- KNIT example-context-04.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-04.kt)获取完整代码。
>
{style="note"}

上述示例演示了协程使用中的新技术。

第一种技术展示了如何使用带指定上下文的 [runBlocking]。
第二种技术涉及调用 [withContext]，它可能会挂起当前协程并切换到新上下文——前提是新上下文与现有上下文不同。具体来说，如果你指定不同的 [CoroutineDispatcher]，则需要额外的调度：该代码块被调度到新的调度器上，一旦完成，执行将返回原始调度器。

结果是，上述代码的输出为：

```text
[Ctx1 @coroutine#1] Started in ctx1
[Ctx2 @coroutine#1] Working in ctx2
[Ctx1 @coroutine#1] Back to ctx1
```

<!--- TEST -->

上述示例使用 Kotlin 标准库中的 `use` 函数，以便在不再需要时正确释放由 [newSingleThreadContext] 创建的线程资源。

## 上下文中的 Job

协程的 [Job] 是其上下文的一部分，可以使用 `coroutineContext[Job]` 表达式从中检索：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    println("我的作业是 ${coroutineContext[Job]}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-05.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-05.kt)获取完整代码。
> 
{style="note"}

在[调试模式](#debugging-coroutines-and-threads)下，它会输出类似如下内容：

```
My job is "coroutine#1":BlockingCoroutine{Active}@6d311334
```

<!--- TEST lines.size == 1 && lines[0].startsWith("My job is \"coroutine#1\":BlockingCoroutine{Active}@") -->

请注意，[CoroutineScope] 中的 [isActive] 只是 `coroutineContext[Job]?.isActive == true` 的一个方便的快捷方式。

## 协程的子级

当协程在另一个协程的 [CoroutineScope] 中启动时，它会通过 [CoroutineScope.coroutineContext] 继承其上下文，并且新协程的 [Job] 成为父协程作业的 _子级_。当父协程被取消时，其所有子级也会被递归取消。

然而，这种父子关系可以通过以下两种方式之一显式覆盖：

1.  当启动协程时显式指定不同作用域（例如，`GlobalScope.launch`）时，它不会从父作用域继承 `Job`。
2.  当将不同的 `Job` 对象作为新协程的上下文传递时（如下例所示），它会覆盖父作用域的 `Job`。

在这两种情况下，启动的协程都不与启动它的作用域绑定，并独立运行。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    // 启动一个协程来处理某种传入请求
    val request = launch {
        // 它派生出另外两个作业
        launch(Job()) { 
            println("job1: 我在自己的 Job 中运行并独立执行！")
            delay(1000)
            println("job1: 我不受请求取消的影响")
        }
        // 另一个继承父上下文
        launch {
            delay(100)
            println("job2: 我是请求协程的子级")
            delay(1000)
            println("job2: 如果我的父请求被取消，我将不会执行此行")
        }
    }
    delay(500)
    request.cancel() // 取消请求的处理
    println("main: 谁在请求取消后幸存下来？")
    delay(1000) // 延迟主线程一秒，看看会发生什么
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-06.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-06.kt)获取完整代码。
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

父协程总是等待其所有子级的完成。父级无需显式跟踪其启动的所有子级，也无需在最后使用 [Job.join] 等待它们：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    // 启动一个协程来处理某种传入请求
    val request = launch {
        repeat(3) { i -> // 启动一些子作业
            launch  {
                delay((i + 1) * 200L) // 可变延迟 200ms, 400ms, 600ms
                println("协程 $i 已完成")
            }
        }
        println("request: 我已完成，我没有显式等待仍然活跃的子级")
    }
    request.join() // 等待请求完成，包括其所有子级
    println("现在请求处理已完成")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-07.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-07.kt)获取完整代码。
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

## 为调试命名协程

当协程频繁记录日志且你只需关联来自同一协程的日志记录时，自动分配的 ID 很有用。然而，当协程与特定请求的处理绑定或执行某些特定的后台任务时，最好为了调试目的显式命名它。[CoroutineName] 上下文元素与线程名称具有相同的目的。当[调试模式](#debugging-coroutines-and-threads)开启时，它会包含在执行此协程的线程名称中。

以下示例演示了此概念：

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() = runBlocking(CoroutineName("main")) {
//sampleStart
    log("主协程已启动")
    // 运行两个后台值计算
    val v1 = async(CoroutineName("v1coroutine")) {
        delay(500)
        log("正在计算 v1")
        6
    }
    val v2 = async(CoroutineName("v2coroutine")) {
        delay(1000)
        log("正在计算 v2")
        7
    }
    log("v1 * v2 的答案 = ${v1.await() * v2.await()}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-08.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-08.kt)获取完整代码。
>
{style="note"}

使用 `-Dkotlinx.coroutines.debug` JVM 选项时，它产生的输出类似于：

```text
[main @main#1] Started main coroutine
[main @v1coroutine#2] Computing v1
[main @v2coroutine#3] Computing v2
[main @main#1] The answer for v1 * v2 = 42
```

<!--- TEST FLEXIBLE_THREAD -->

## 组合上下文元素

有时我们需要为协程上下文定义多个元素。我们可以为此使用 `+` 操作符。例如，我们可以同时启动一个带显式指定调度器和显式指定名称的协程：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch(Dispatchers.Default + CoroutineName("test")) {
        println("我正在线程 ${Thread.currentThread().name} 中工作")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-09.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-09.kt)获取完整代码。
>
{style="note"}

使用 `-Dkotlinx.coroutines.debug` JVM 选项时，此代码的输出为：

```text
I'm working in thread DefaultDispatcher-worker-1 @test#2
```

<!--- TEST FLEXIBLE_THREAD -->

## 协程作用域

让我们将我们关于上下文、子级和作业的知识结合起来。假设我们的应用程序有一个具有生命周期的对象，但该对象不是协程。例如，我们正在编写一个 Android 应用程序，并在 Android Activity 的上下文中启动各种协程，以执行异步操作来获取和更新数据、进行动画等。当 Activity 被销毁时，这些协程必须被取消以避免内存泄漏。当然，我们可以手动操作上下文和作业来绑定 Activity 及其协程的生命周期，但 `kotlinx.coroutines` 提供了一个封装该功能的抽象：[CoroutineScope]。你应该已经熟悉协程作用域，因为所有协程构建器都声明为其扩展。

我们通过创建一个与 Activity 生命周期绑定的 [CoroutineScope] 实例来管理协程的生命周期。`CoroutineScope` 实例可以通过 [CoroutineScope()] 或 [MainScope()] 工厂函数创建。前者创建一个通用作用域，而后者为 UI 应用程序创建一个作用域并使用 [Dispatchers.Main] 作为默认调度器：

```kotlin
class Activity {
    private val mainScope = MainScope()
    
    fun destroy() {
        mainScope.cancel()
    }
    // to be continued ...
```

现在，我们可以使用定义的 `mainScope` 在此 `Activity` 的作用域中启动协程。为了演示，我们启动十个延迟时间不同的协程：

```kotlin
    // Activity 类继续
    fun doSomething() {
        // 启动十个协程进行演示，每个协程工作不同的时间
        repeat(10) { i ->
            mainScope.launch {
                delay((i + 1) * 200L) // 可变延迟 200ms, 400ms, ... 等
                println("协程 $i 已完成")
            }
        }
    }
} // Activity 类结束
```

在我们的 `main` 函数中，我们创建 Activity，调用我们的测试 `doSomething` 函数，并在 500 毫秒后销毁 Activity。这会取消所有从 `doSomething` 启动的协程。我们可以看到，因为在 Activity 销毁后，即使我们再等待一段时间，也不会再打印任何消息。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*

class Activity {
    private val mainScope = CoroutineScope(Dispatchers.Default) // 为了测试目的使用 Default
    
    fun destroy() {
        mainScope.cancel()
    }

    fun doSomething() {
        // 启动十个协程进行演示，每个协程工作不同的时间
        repeat(10) { i ->
            mainScope.launch {
                delay((i + 1) * 200L) // 可变延迟 200ms, 400ms, ... 等
                println("协程 $i 已完成")
            }
        }
    }
} // Activity 类结束

fun main() = runBlocking<Unit> {
//sampleStart
    val activity = Activity()
    activity.doSomething() // 运行测试函数
    println("已启动协程")
    delay(500L) // 延迟半秒
    println("正在销毁 Activity！")
    activity.destroy() // 取消所有协程
    delay(1000) // 视觉上确认它们不再工作
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-10.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-10.kt)获取完整代码。
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

如你所见，只有前两个协程打印了一条消息，其余协程通过在 `Activity.destroy()` 中单次调用 [`mainScope.cancel()`][CoroutineScope.cancel] 而被取消。

> 请注意，Android 对所有具有生命周期的实体都提供了协程作用域的第一方支持。
> 参见[相应的文档](https://developer.android.com/topic/libraries/architecture/coroutines#lifecyclescope)。
>
{style="note"}

### 线程局部数据

有时，能够向协程或在协程之间传递一些线程局部数据会很方便。然而，由于协程不绑定到任何特定线程，如果手动完成，这很可能会导致样板代码。

对于 [`ThreadLocal`](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html)，[asContextElement] 扩展函数在此提供帮助。它创建一个额外的上下文元素，该元素保留给定 `ThreadLocal` 的值，并在协程每次切换上下文时恢复它。

在实践中演示它很容易：

```kotlin
import kotlinx.coroutines.*

val threadLocal = ThreadLocal<String?>() // 声明线程局部变量

fun main() = runBlocking<Unit> {
//sampleStart
    threadLocal.set("main")
    println("主线程前，当前线程：${Thread.currentThread()}，线程局部值：'${threadLocal.get()}'")
    val job = launch(Dispatchers.Default + threadLocal.asContextElement(value = "launch")) {
        println("启动开始，当前线程：${Thread.currentThread()}，线程局部值：'${threadLocal.get()}'")
        yield()
        println("yield 后，当前线程：${Thread.currentThread()}，线程局部值：'${threadLocal.get()}'")
    }
    job.join()
    println("主线程后，当前线程：${Thread.currentThread()}，线程局部值：'${threadLocal.get()}'")
//sampleEnd    
}
```  
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-11.kt -->
> 你可以在[此处](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-11.kt)获取完整代码。
>
{style="note"}

在此示例中，我们使用 [Dispatchers.Default] 在后台线程池中启动了一个新协程，因此它在线程池中的不同线程上工作，但它仍然具有我们使用 `threadLocal.asContextElement(value = "launch")` 指定的线程局部变量的值，无论协程在哪个线程上执行。因此，输出（在[调试模式](#debugging-coroutines-and-threads)下）是：

```text
Pre-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
Launch start, current thread: Thread[DefaultDispatcher-worker-1 @coroutine#2,5,main], thread local value: 'launch'
After yield, current thread: Thread[DefaultDispatcher-worker-2 @coroutine#2,5,main], thread local value: 'launch'
Post-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
```

<!--- TEST FLEXIBLE_THREAD -->

很容易忘记设置相应的上下文元素。如果运行协程的线程不同，从协程访问的线程局部变量可能会有意外的值。为避免此类情况，建议使用 [ensurePresent] 方法并在不当使用时快速失败。

`ThreadLocal` 具有一等支持，可以与 `kotlinx.coroutines` 提供的任何原语一起使用。但是，它有一个主要限制：当线程局部变量被修改时，新值不会传播到协程调用者（因为上下文元素无法跟踪所有 `ThreadLocal` 对象访问），并且更新后的值在下次挂起时丢失。使用 [withContext] 在协程中更新线程局部变量的值，更多详细信息请参见 [asContextElement]。

另一种方法是，值可以存储在像 `class Counter(var i: Int)` 这样的可变包装器中，它又存储在线程局部变量中。然而，在这种情况下，你完全有责任同步此可变包装器中变量的潜在并发修改。

对于高级用法，例如，为了与日志 MDC、事务上下文或任何其他内部使用线程局部变量传递数据的库集成，请参阅应实现的 [ThreadContextElement] 接口的文档。

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