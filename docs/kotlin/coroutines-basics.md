<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 协程基础)

为了创建能同时执行多项任务（一种称为并发的概念）的应用程序，Kotlin 使用 _协程_。协程是一种可挂起计算，它允许你以清晰、顺序的风格编写并发代码。协程可以与其他协程并发运行，并可能并行运行。

在 JVM 和 Kotlin/Native 上，所有并发代码（例如协程）都运行在由操作系统管理的 _线程_ 上。协程可以挂起它们的执行，而不是阻塞线程。这允许一个协程在等待某些数据到达时挂起，而另一个协程则在同一线程上运行，从而确保了有效的资源利用。

![比较并行与并发线程](parallelism-and-concurrency.svg){width="700"}

关于协程与线程之间差异的更多信息，请参见[比较协程与 JVM 线程](#comparing-coroutines-and-jvm-threads)。

## 挂起函数

协程最基本的构建块是 _挂起函数_。它允许正在进行的操作暂停并在之后恢复，而不影响代码结构。

要声明一个挂起函数，请使用 `suspend` 关键字：

```kotlin
suspend fun greet() {
    println("Hello world from a suspending function")
}
```

你只能从另一个挂起函数中调用挂起函数。要在 Kotlin 应用程序的入口点调用挂起函数，请使用 `suspend` 关键字标记 `main()` 函数：

```kotlin
suspend fun main() {
    showUserInfo()
}

suspend fun showUserInfo() {
    println("Loading user...")
    greet()
    println("User: John Smith")
}

suspend fun greet() {
    println("Hello world from a suspending function")
}
```
{kotlin-runnable="true"}

这个示例尚未利用并发，但通过使用 `suspend` 关键字标记这些函数，你允许它们调用其他挂起函数并在内部运行并发代码。

虽然 `suspend` 关键字是核心 Kotlin 语言的一部分，但大多数协程特性都通过 [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) 库提供。

## 将 kotlinx.coroutines 库添加到你的项目

要将 `kotlinx.coroutines` 库包含到你的项目中，请根据你的构建工具添加相应的依赖项配置：

<tabs group="build-tool">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
}
```
</tab>

<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlinx</groupId>
            <artifactId>kotlinx-coroutines-core</artifactId>
            <version>%coroutinesVersion%</version>
        </dependency>
    </dependencies>
    ...
</project>
```

</tab>
</tabs>

## 创建你的第一个协程

> 本页示例使用了显式 `this` 表达式，配合协程构建器函数 `CoroutineScope.launch()` 和 `CoroutineScope.async()`。
> 这些协程构建器是 `CoroutineScope` 上的[扩展函数](extensions.md)，`this` 表达式指的是当前 `CoroutineScope` 作为接收者。
>
> 有关实际示例，请参见[从协程作用域中提取协程构建器](#extract-coroutine-builders-from-the-coroutine-scope)。
>
{style="note"}

要在 Kotlin 中创建协程，你需要以下内容：

* 一个[挂起函数](#suspending-functions)。
* 一个可运行它的[协程作用域](#coroutine-scope-and-structured-concurrency)，例如 `withContext()` 函数内部。
* 一个[协程构建器](#coroutine-builder-functions)，例如 `CoroutineScope.launch()`，来启动它。
* 一个[调度器](#coroutine-dispatchers)来控制它使用哪些线程。

让我们看一个在多线程环境中使用多个协程的示例：

1. 导入 `kotlinx.coroutines` 库：

    ```kotlin
    import kotlinx.coroutines.*
    ```

2. 使用 `suspend` 关键字标记可以暂停和恢复的函数：

    ```kotlin
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
    }
    
    suspend fun main() {}
    ```

    > 尽管你可以在某些项目中将 `main()` 函数标记为 `suspend`，但在与现有代码集成或使用框架时可能无法实现。
    > 在这种情况下，请查阅框架文档，看它是否支持调用挂起函数。
    > 如果不支持，请使用 [`runBlocking()`](#runblocking) 通过阻塞当前线程来调用它们。
    > 
    {style="note"}

3. 添加 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html#) 函数来模拟一个挂起任务，例如抓取数据或写入数据库：

    ```kotlin
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
        delay(1000L)
    }
   ```

    <!-- > Use [`kotlin.time.Duration`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-duration/) from the Kotlin standard library to express durations like `delay(1.seconds)` instead of using milliseconds.
    >
    {style="tip"} -->

4. 使用 [`withContext(Dispatchers.Default)`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html#) 来定义多线程并发代码的入口点，该代码运行在共享线程池上：

    ```kotlin
    suspend fun main() {
        withContext(Dispatchers.Default) {
            // 在这里添加协程构建器
        }
    }
    ```

   > 挂起函数 `withContext()` 通常用于[上下文切换](coroutine-context-and-dispatchers.md#jumping-between-threads)，但在本示例中，它也为并发代码定义了一个非阻塞的入口点。
   > 它使用 [`Dispatchers.Default` 调度器](#coroutine-dispatchers)在共享线程池上运行代码，以实现多线程执行。
   > 默认情况下，此池使用的线程数最多等于运行时可用的 CPU 核心数，最少为两个线程。
   > 
   > `withContext()` 代码块内部启动的协程共享相同的协程作用域，这确保了[结构化并发](#coroutine-scope-and-structured-concurrency)。
   > 
   {style="note"}

5. 使用一个[协程构建器函数](#coroutine-builder-functions)，例如 [`CoroutineScope.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)，来启动协程：

    ```kotlin
    suspend fun main() {
        withContext(Dispatchers.Default) { // this: CoroutineScope
            // 使用 CoroutineScope.launch() 在作用域内启动协程
            this.launch { greet() }
            println("The withContext() on the thread: ${Thread.currentThread().name}")
        }
    }
    ```

6. 将这些部分组合起来，在共享线程池上同时运行多个协程：

    ```kotlin
    // 导入协程库
    import kotlinx.coroutines.*

    // 导入 kotlin.time.Duration 以秒为单位表示持续时间
    import kotlin.time.Duration.Companion.seconds

    // 定义一个挂起函数
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
        // 挂起 1 秒并释放线程
        delay(1.seconds) 
        // 这里的 delay() 函数模拟一个挂起 API 调用
        // 你可以在这里添加挂起 API 调用，例如网络请求
    }

    suspend fun main() {
        // 在此代码块中的代码在共享线程池上运行
        withContext(Dispatchers.Default) { // this: CoroutineScope
            this.launch() {
                greet()
            }
   
            // 启动另一个协程
            this.launch() {
                println("The CoroutineScope.launch() on the thread: ${Thread.currentThread().name}")
                delay(1.seconds)
                // 这里的 delay 函数模拟一个挂起 API 调用
                // 你可以在这里添加挂起 API 调用，例如网络请求
            }
    
            println("The withContext() on the thread: ${Thread.currentThread().name}")
        }
    }
    ```
    {kotlin-runnable="true"}

尝试多次运行此示例。你可能会注意到每次运行程序时，输出顺序和线程名称可能会改变，因为操作系统决定线程何时运行。

> 你可以在代码输出中将协程名称显示在线程名称旁边，以获取额外信息。
> 为此，请在构建工具或 IDE 运行配置中传入 `-Dkotlinx.coroutines.debug` VM 选项。
>
> 关于更多信息，请参阅[调试协程](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/topics/debugging.md)。
>
{style="tip"}

## 协程作用域与结构化并发

当你在应用程序中运行多个协程时，你需要一种方法来将它们作为组进行管理。Kotlin 协程依赖于一个称为 _结构化并发_ 的原则来提供这种结构。

根据这一原则，协程形成一个具有关联生命周期的父任务和子任务的树状层级结构。协程的生命周期是从创建到完成、失败或取消的状态序列。

父协程会等待其子协程完成后再结束。如果父协程失败或被取消，所有子协程也会被递归取消。这样保持协程的连接使取消和错误处理可预测且安全。

为了维护结构化并发，新协程只能在定义并管理它们生命周期的 [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) 中启动。`CoroutineScope` 包含 _协程上下文_，它定义了调度器和其他执行属性。当你在另一个协程内部启动一个协程时，它自动成为其父作用域的子项。

在 `CoroutineScope` 上调用[协程构建器函数](#coroutine-builder-functions)，例如 `CoroutineScope.launch()`，会启动与该作用域关联的协程的子协程。在构建器的代码块内部，[接收者](lambdas.md#function-literals-with-receiver)是一个嵌套的 `CoroutineScope`，因此你在这里启动的任何协程都将成为其子项。

### 使用 `coroutineScope()` 函数创建协程作用域

要使用当前协程上下文创建新的协程作用域，请使用 [`coroutineScope()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html) 函数。此函数创建协程子树的根协程。它是代码块内部启动的协程的直接父项，也是它们启动的任何协程的间接父项。`coroutineScope()` 执行挂起代码块，并等待该代码块及其内部启动的任何协程完成。

这是一个示例：

```kotlin
// 导入 kotlin.time.Duration 以秒为单位表示持续时间
import kotlin.time.Duration.Companion.seconds

import kotlinx.coroutines.*

// 如果协程上下文未指定调度器，
// CoroutineScope.launch() 将使用 Dispatchers.Default
//sampleStart
suspend fun main() {
    // 协程子树的根
    coroutineScope { // this: CoroutineScope
        this.launch {
            this.launch {
                delay(2.seconds)
                println("Child of the enclosing coroutine completed")
            }
            println("Child coroutine 1 completed")
        }
        this.launch {
            delay(1.seconds)
            println("Child coroutine 2 completed")
        }
    }
    // 仅在 coroutineScope 中的所有子协程完成后运行
    println("Coroutine scope completed")
}
//sampleEnd
```
{kotlin-runnable="true"}

由于此示例中未指定[调度器](#coroutine-dispatchers)，`coroutineScope()` 代码块中的 `CoroutineScope.launch()` 构建器函数继承当前上下文。如果该上下文没有指定的调度器，`CoroutineScope.launch()` 将使用 `Dispatchers.Default`，它运行在共享线程池上。

### 从协程作用域中提取协程构建器

在某些情况下，你可能希望将协程构建器调用，例如 [`CoroutineScope.launch()`](#coroutinescope-launch)，提取到单独的函数中。

考虑以下示例：

```kotlin
suspend fun main() {
    coroutineScope { // this: CoroutineScope
        // 调用 CoroutineScope.launch()，其中 CoroutineScope 是接收者
        this.launch { println("1") }
        this.launch { println("2") }
    } 
}
```

> 你也可以不使用显式 `this` 表达式，将 `this.launch` 写为 `launch`。
> 这些示例使用显式 `this` 表达式来强调它是一个 `CoroutineScope` 上的扩展函数。
>
> 有关带接收者的 lambda 表达式在 Kotlin 中如何工作的更多信息，请参见[带接收者的函数字面量](lambdas.md#function-literals-with-receiver)。
>
{style="tip"}

`coroutineScope()` 函数接受一个带有 `CoroutineScope` 接收者的 lambda 表达式。在此 lambda 内部，隐式接收者是一个 `CoroutineScope`，因此像 `CoroutineScope.launch()` 和 [`CoroutineScope.async()`](#coroutinescope-async) 这样的构建器函数会解析为该接收者上的[扩展函数](extensions.md#extension-functions)。

要将协程构建器提取到另一个函数中，该函数必须声明一个 `CoroutineScope` 接收者，否则会发生编译错误：

```kotlin
import kotlinx.coroutines.*
//sampleStart
suspend fun main() {
    coroutineScope {
        launchAll()
    }
}

fun CoroutineScope.launchAll() { // this: CoroutineScope
    // 在 CoroutineScope 上调用 .launch()
    this.launch { println("1") }
    this.launch { println("2") } 
}
//sampleEnd
/* -- 不声明 CoroutineScope 作为接收者而调用 launch 会导致编译错误 --

fun launchAll() {
    // 编译错误：this 未定义
    this.launch { println("1") }
    this.launch { println("2") }
}
 */
```
{kotlin-runnable="true"}

## 协程构建器函数

协程构建器函数是一个接受 `suspend` [lambda 表达式](lambdas.md)的函数，该 lambda 表达式定义了一个要运行的协程。以下是一些示例：

* [`CoroutineScope.launch()`](#coroutinescope-launch)
* [`CoroutineScope.async()`](#coroutinescope-async)
* [`runBlocking()`](#runblocking)
* [`withContext()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html)
* [`coroutineScope()`](#create-a-coroutine-scope-with-the-coroutinescope-function)

协程构建器函数需要一个 `CoroutineScope` 来运行。这可以是一个现有作用域，也可以是你使用 `coroutineScope()`、[`runBlocking()`](#runblocking) 或 [`withContext()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html#) 等辅助函数创建的作用域。每个构建器都定义了协程如何启动以及你如何与其结果交互。

### `CoroutineScope.launch()`

[`CoroutineScope.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html#) 协程构建器函数是 `CoroutineScope` 上的一个扩展函数。它在现有[协程作用域](#coroutine-scope-and-structured-concurrency)内部启动一个新协程，而不阻塞作用域的其余部分。

当不需要结果或你不想等待结果时，使用 `CoroutineScope.launch()` 在其他工作的同时运行任务：

```kotlin
// 导入 kotlin.time.Duration 以毫秒为单位表示持续时间
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

suspend fun main() {
    withContext(Dispatchers.Default) {
        performBackgroundWork()
    }
}

//sampleStart
suspend fun performBackgroundWork() = coroutineScope { // this: CoroutineScope
    // 启动一个不阻塞作用域的协程
    this.launch {
        // 挂起以模拟后台工作
        delay(100.milliseconds)
        println("Sending notification in background")
    }

    // 主协程继续执行，而前一个协程处于挂起状态
    println("Scope continues")
}
//sampleEnd
```
{kotlin-runnable="true"}

运行此示例后，你可以看到 `main()` 函数不会被 `CoroutineScope.launch()` 阻塞，并继续运行其他代码，而协程在后台工作。

> `CoroutineScope.launch()` 函数返回一个 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 句柄。
> 使用此句柄等待启动的协程完成。
> 关于更多信息，请参见[取消与超时](cancellation-and-timeouts.md#cancel-coroutines)。
> 
{style="tip"}

### `CoroutineScope.async()`

[`CoroutineScope.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 协程构建器函数是 `CoroutineScope` 上的一个扩展函数。它在现有[协程作用域](#coroutine-scope-and-structured-concurrency)内部启动一个并发计算，并返回一个 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/) 句柄，该句柄代表最终结果。使用 `.await()` 函数挂起代码直到结果准备就绪：

```kotlin
// 导入 kotlin.time.Duration 以毫秒为单位表示持续时间
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

//sampleStart
suspend fun main() = withContext(Dispatchers.Default) { // this: CoroutineScope
    // 开始下载第一页
    val firstPage = this.async {
        delay(50.milliseconds)
        "First page"
    }

    // 并行开始下载第二页
    val secondPage = this.async {
        delay(100.milliseconds)
        "Second page"
    }

    // 等待两个结果并进行比较
    val pagesAreEqual = firstPage.await() == secondPage.await()
    println("Pages are equal: $pagesAreEqual")
}
//sampleEnd
```
{kotlin-runnable="true"}

### `runBlocking()`

[`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 协程构建器函数创建一个协程作用域，并阻塞当前[线程](#comparing-coroutines-and-jvm-threads)，直到在该作用域中启动的协程完成。

仅在没有其他选项可以从非挂起代码中调用挂起代码时，才使用 `runBlocking()`：

```kotlin
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.*

// 一个你无法修改的第三方接口
interface Repository {
    fun readItem(): Int
}

object MyRepository : Repository {
    override fun readItem(): Int {
        // 桥接到一个挂起函数
        return runBlocking {
            myReadItem()
        }
    }
}

suspend fun myReadItem(): Int {
    delay(100.milliseconds)
    return 4
}
```

## 协程调度器

一个 [_协程调度器_](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/#) 控制协程使用哪个线程或线程池来执行。协程并非总是绑定到单个线程。它们可以在一个线程上暂停并在另一个线程上恢复，这取决于调度器。这允许你同时运行多个协程，而无需为每个协程分配单独的线程。

> 尽管协程可以在不同的线程上挂起和恢复，但协程挂起之前写入的值仍保证在恢复时在同一协程中可用。
>
{style="tip"}

调度器与[协程作用域](#coroutine-scope-and-structured-concurrency)协同工作，以定义协程何时何地运行。协程作用域控制协程的生命周期，而调度器控制哪些线程用于执行。

> 你无需为每个协程指定调度器。
> 默认情况下，协程从其父作用域继承调度器。
> 你可以指定一个调度器，让协程在不同的上下文中运行。
> 
> 如果协程上下文不包含调度器，协程构建器将使用 `Dispatchers.Default`。
>
{style="note"}

`kotlinx.coroutines` 库包含用于不同用例的不同调度器。例如，[`Dispatchers.Default`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html) 在共享线程池上运行协程，在后台执行工作，与主线程分离。这使其成为 CPU 密集型操作（如数据处理）的理想选择。

要为像 `CoroutineScope.launch()` 这样的协程构建器指定调度器，请将其作为实参传入：

```kotlin
suspend fun runWithDispatcher() = coroutineScope { // this: CoroutineScope
    this.launch(Dispatchers.Default) {
        println("Running on ${Thread.currentThread().name}")
    }
}
```

另外，你可以使用 `withContext()` 代码块，在指定的调度器上运行其中的所有代码：

```kotlin
// 导入 kotlin.time.Duration 以毫秒为单位表示持续时间
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

//sampleStart
suspend fun main() = withContext(Dispatchers.Default) { // this: CoroutineScope
    println("Running withContext block on ${Thread.currentThread().name}")

    val one = this.async {
        println("First calculation starting on ${Thread.currentThread().name}")
        val sum = (1L..500_000L).sum()
        delay(200L)
        println("First calculation done on ${Thread.currentThread().name}")
        sum
    }

    val two = this.async {
        println("Second calculation starting on ${Thread.currentThread().name}")
        val sum = (500_001L..1_000_000L).sum()
        println("Second calculation done on ${Thread.currentThread().name}")
        sum
    }

    // 等待两次计算并打印结果
    println("Combined total: ${one.await() + two.await()}")
}
//sampleEnd
```
{kotlin-runnable="true"}

要了解更多关于协程调度器及其用途的信息，包括 [`Dispatchers.IO`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-i-o.html) 和 [`Dispatchers.Main`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html) 等其他调度器，请参见[协程上下文与调度器](coroutine-context-and-dispatchers.md)。

## 比较协程与 JVM 线程

尽管协程是可挂起计算，像 JVM 上的线程一样并发运行代码，但它们在底层的工作方式不同。

_线程_ 由操作系统管理。线程可以在多个 CPU 核心上并行运行任务，并代表 JVM 上并发的标准方法。当你创建线程时，操作系统会为其栈分配内存，并使用内核在线程之间切换。这使得线程功能强大但也资源密集。每个线程通常需要几兆字节内存，通常 JVM 一次只能处理几千个线程。

另一方面，协程不绑定到特定线程。它可以在一个线程上挂起并在另一个线程上恢复，因此许多协程可以共享同一个线程池。当协程挂起时，线程不会被阻塞，并保持空闲以运行其他任务。这使得协程比线程轻量得多，并允许在一个进程中运行数百万个协程，而不耗尽系统资源。

![比较协程与线程](coroutines-and-threads.svg){width="700"}

让我们看一个示例，其中 50,000 个协程每个等待五秒，然后打印一个点（`.`）：

```kotlin
import kotlin.time.Duration.Companion.seconds
import kotlinx.coroutines.*

suspend fun main() {
    withContext(Dispatchers.Default) {
        // 启动 50,000 个协程，每个协程等待五秒，然后打印一个点
        printPeriods()
    }
}

//sampleStart
suspend fun printPeriods() = coroutineScope { // this: CoroutineScope
    // 启动 50,000 个协程，每个协程等待五秒，然后打印一个点
    repeat(50_000) {
        this.launch {
            delay(5.seconds)
            print(".")
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

现在我们来看同样的示例，使用 JVM 线程：

```kotlin
import kotlin.concurrent.thread

fun main() {
    repeat(50_000) {
        thread {
            Thread.sleep(5000L)
            print(".")
        }
    }
}
```
{kotlin-runnable="true" validate="false"}

运行此版本会占用更多内存，因为每个线程都需要自己的内存栈。对于 50,000 个线程，这可能高达 100 GB，相比之下，相同数量的协程大约需要 500 MB。

根据你的操作系统、JDK 版本和设置，JVM 线程版本可能会抛出内存不足错误，或减慢线程创建速度，以避免同时运行过多的线程。

## 接下来

* 在[组合挂起函数](composing-suspending-functions.md)中了解更多关于组合挂起函数的信息。
* 在[取消与超时](cancellation-and-timeouts.md)中了解如何取消协程和处理超时。
* 在[协程上下文与调度器](coroutine-context-and-dispatchers.md)中深入了解协程执行和线程管理。
* 在[异步流](flow.md)中了解如何返回多个异步计算值。