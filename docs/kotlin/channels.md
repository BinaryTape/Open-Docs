<!--- TEST_NAME ChannelsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 通道)

Deferred 值提供了一种在协程之间传递单个值的便捷方式。通道提供了一种传递值流的方式。

## 通道基础

[Channel] 在概念上与 `BlockingQueue` 非常相似。一个关键区别在于，它没有阻塞的 `put` 操作，而是有挂起 [send][SendChannel.send] 操作；没有阻塞的 `take` 操作，而是有挂起 [receive][ReceiveChannel.receive] 操作。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<Int>()
    launch {
        // 这可能是 CPU 密集型计算或异步逻辑，
        // 我们只发送五个平方数
        for (x in 1..5) channel.send(x * x)
    }
    // 这里我们打印五个接收到的整数：
    repeat(5) { println(channel.receive()) }
    println("Done!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-01.kt -->
> 你可以获取完整代码 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-01.kt)。
>
{style="note"}

此代码的输出为：

```text
1
4
9
16
25
Done!
```

<!--- TEST -->

## 关闭通道及迭代

与队列不同，通道可以关闭，以指示不再有元素传入。在接收者端，使用常规的 `for` 循环从通道接收元素很方便。

概念上，[close][SendChannel.close] 类似于向通道发送一个特殊的关闭令牌。一旦接收到此关闭令牌，迭代就会停止，因此可以保证在关闭之前发送的所有元素都已被接收：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<Int>()
    launch {
        for (x in 1..5) channel.send(x * x)
        channel.close() // 我们发送完毕
    }
    // 这里我们使用 `for` 循环打印接收到的值（直到通道关闭）
    for (y in channel) println(y)
    println("Done!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-02.kt -->
> 你可以获取完整代码 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-02.kt)。
>
{style="note"}

<!--- TEST
1
4
9
16
25
Done!
-->

## 构建通道生产者

协程生成一系列元素的模式非常常见。这是并发代码中常见的 _生产者-消费者_ 模式的一部分。你可以将这样的生产者抽象为一个以通道作为参数的函数，但这与函数必须返回结果的常识相悖。

有一个便捷的协程构建器 [produce]，可以轻松地在生产者端正确实现；还有一个扩展函数 [consumeEach]，它在消费者端替代 `for` 循环：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

//sampleStart
fun CoroutineScope.produceSquares(): ReceiveChannel<Int> = produce {
    for (x in 1..5) send(x * x)
}

fun main() = runBlocking {
    val squares = produceSquares()
    squares.consumeEach { println(it) }
    println("Done!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-03.kt -->
> 你可以获取完整代码 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-03.kt)。
>
{style="note"}

<!--- TEST
1
4
9
16
25
Done!
-->

## 流水线

流水线是一种模式，其中一个协程会生成可能无限的值流：

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1
    while (true) send(x++) // 从 1 开始的无限整数流
}
```

而另一个或多个协程则消费该流，进行一些处理，并生成其他结果。在下面的例子中，数字只是被平方：

```kotlin
fun CoroutineScope.square(numbers: ReceiveChannel<Int>): ReceiveChannel<Int> = produce {
    for (x in numbers) send(x * x)
}
```

主代码启动并连接整个流水线：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val numbers = produceNumbers() // 从 1 开始生成整数
    val squares = square(numbers) // 将整数平方
    repeat(5) {
        println(squares.receive()) // 打印前五个
    }
    println("Done!") // 我们完成了
    coroutineContext.cancelChildren() // 取消子协程
//sampleEnd
}

fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1
    while (true) send(x++) // 从 1 开始的无限整数流
}

fun CoroutineScope.square(numbers: ReceiveChannel<Int>): ReceiveChannel<Int> = produce {
    for (x in numbers) send(x * x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-04.kt -->
> 你可以获取完整代码 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-04.kt)。
>
{style="note"}

<!--- TEST
1
4
9
16
25
Done!
-->

> 所有创建协程的函数都定义为 [CoroutineScope] 的扩展，因此我们可以依赖 [结构化并发](composing-suspending-functions.md#structured-concurrency-with-async) 来确保我们的应用程序中没有残留的全局协程。
>
{style="note"}

## 使用流水线生成素数

让我们通过一个使用协程流水线生成素数的例子，将流水线发挥到极致。我们从一个无限的数字序列开始。

```kotlin
fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // 从 start 开始的无限整数流
}
```

以下流水线阶段会过滤传入的数字流，移除所有可被给定素数整除的数字：

```kotlin
fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) = produce<Int> {
    for (x in numbers) if (x % prime != 0) send(x)
}
```

现在我们通过从 2 开始的数字流构建流水线，从当前通道中取出一个素数，并为每个找到的素数启动新的流水线阶段：

```
numbersFrom(2) -> filter(2) -> filter(3) -> filter(5) -> filter(7) ...
```

以下示例打印前十个素数，并在主线程的上下文中运行整个流水线。由于所有协程都在主 [runBlocking] 协程的作用域内启动，我们无需维护所有已启动协程的显式列表。我们使用 [cancelChildren][kotlin.coroutines.CoroutineContext.cancelChildren] 扩展函数来取消所有子协程，在打印完前十个素数后。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    var cur = numbersFrom(2)
    repeat(10) {
        val prime = cur.receive()
        println(prime)
        cur = filter(cur, prime)
    }
    coroutineContext.cancelChildren() // 取消所有子协程，让主协程完成
//sampleEnd    
}

fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // 从 start 开始的无限整数流
}

fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) = produce<Int> {
    for (x in numbers) if (x % prime != 0) send(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-05.kt -->
> 你可以获取完整代码 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-05.kt)。
>
{style="note"}

此代码的输出为：

```text
2
3
5
7
11
13
17
19
23
29
```

<!--- TEST -->

请注意，你可以使用标准库中的 [`iterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/iterator.html) 协程构建器构建相同的流水线。将 `produce` 替换为 `iterator`，`send` 替换为 `yield`，`receive` 替换为 `next`，`ReceiveChannel` 替换为 `Iterator`，并移除协程作用域。你也不需要 `runBlocking`。然而，如上所示使用通道的流水线的好处是，如果你在 [Dispatchers.Default] 上下文中运行它，它实际上可以使用多个 CPU 核心。

无论如何，这是一种查找素数极不切实际的方法。在实践中，流水线确实会涉及一些其他的挂起调用（例如对远程服务的异步调用），这些流水线无法使用 `sequence`/`iterator` 构建，因为它们不允许任意挂起，而 `produce` 则是完全异步的。

## 扇出

多个协程可以从同一个通道接收，在它们之间分配工作。让我们从一个定期生成整数（每秒十个数字）的生产者协程开始：

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1 // 从 1 开始
    while (true) {
        send(x++) // 生成下一个
        delay(100) // 等待 0.1 秒
    }
}
```

然后我们可以有多个处理器协程。在此示例中，它们只是打印各自的 ID 和接收到的数字：

```kotlin
fun CoroutineScope.launchProcessor(id: Int, channel: ReceiveChannel<Int>) = launch {
    for (msg in channel) {
        println("Processor #$id received $msg")
    }    
}
```

现在我们启动五个处理器，让它们工作近一秒。看看会发生什么：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking<Unit> {
//sampleStart
    val producer = produceNumbers()
    repeat(5) { launchProcessor(it, producer) }
    delay(950)
    producer.cancel() // 取消生产者协程，从而终止所有
//sampleEnd
}

fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1 // 从 1 开始
    while (true) {
        send(x++) // 生成下一个
        delay(100) // 等待 0.1 秒
    }
}

fun CoroutineScope.launchProcessor(id: Int, channel: ReceiveChannel<Int>) = launch {
    for (msg in channel) {
        println("Processor #$id received $msg")
    }    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-06.kt -->
> 你可以获取完整代码 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-06.kt)。
>
{style="note"}

输出将与以下内容相似，尽管接收每个特定整数的处理器 ID 可能不同：

```text
Processor #2 received 1
Processor #4 received 2
Processor #0 received 3
Processor #1 received 4
Processor #3 received 5
Processor #2 received 6
Processor #4 received 7
Processor #0 received 8
Processor #1 received 9
Processor #3 received 10
```

<!--- TEST lines.size == 10 && lines.withIndex().all { (i, line) -> line.startsWith("Processor #") && line.endsWith(" received ${i + 1}") } -->

请注意，取消生产者协程会关闭其通道，从而最终终止处理器协程对通道的迭代。

另外，请注意我们在 `launchProcessor` 代码中如何使用 `for` 循环显式迭代通道来执行扇出。与 `consumeEach` 不同，这种 `for` 循环模式在多个协程中使用是完全安全的。如果其中一个处理器协程失败，那么其他协程仍会继续处理通道，而通过 `consumeEach` 编写的处理器总是在正常或异常完成时消费（取消）底层通道。

## 扇入

多个协程可以向同一个通道发送数据。例如，让我们有一个字符串通道，以及一个重复地以指定延迟向该通道发送指定字符串的挂起函数：

```kotlin
suspend fun sendString(channel: SendChannel<String>, s: String, time: Long) {
    while (true) {
        delay(time)
        channel.send(s)
    }
}
```

现在，让我们看看如果启动几个发送字符串的协程会发生什么（在此示例中，我们在主线程的上下文中将它们作为主协程的子协程启动）：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<String>()
    launch { sendString(channel, "foo", 200L) }
    launch { sendString(channel, "BAR!", 500L) }
    repeat(6) { // 接收前六个
        println(channel.receive())
    }
    coroutineContext.cancelChildren() // 取消所有子协程，让主协程完成
//sampleEnd
}

suspend fun sendString(channel: SendChannel<String>, s: String, time: Long) {
    while (true) {
        delay(time)
        channel.send(s)
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-07.kt -->
> 你可以获取完整代码 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-07.kt)。
>
{style="note"}

输出是：

```text
foo
foo
BAR!
foo
foo
BAR!
```

<!--- TEST -->

## 缓冲通道

迄今为止所示的通道没有缓冲区。无缓冲通道在发送者和接收者相遇（即会合）时传输元素。如果 `send` 先被调用，则它会挂起直到 `receive` 被调用；如果 `receive` 先被调用，则它会挂起直到 `send` 被调用。

无论是 [Channel()] 工厂函数还是 [produce] 构建器，都接受一个可选的 `capacity` 参数来指定 _缓冲区大小_。缓冲区允许发送者在挂起之前发送多个元素，类似于具有指定容量的 `BlockingQueue`，当缓冲区满时会阻塞。

查看以下代码的行为：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking<Unit> {
//sampleStart
    val channel = Channel<Int>(4) // 创建缓冲通道
    val sender = launch { // 启动发送者协程
        repeat(10) {
            println("Sending $it") // 在发送每个元素前打印
            channel.send(it) // 当缓冲区满时会挂起
        }
    }
    // 不接收任何东西...只是等待....
    delay(1000)
    sender.cancel() // 取消发送者协程
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-08.kt -->
> 你可以获取完整代码 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-08.kt)。
>
{style="note"}

它使用容量为 _四_ 的缓冲通道打印了 _五_ 次“Sending”：

```text
Sending 0
Sending 1
Sending 2
Sending 3
Sending 4
```

<!--- TEST -->

前四个元素被添加到缓冲区，发送者在尝试发送第五个元素时挂起。

## 通道是公平的

通道的发送和接收操作对于其在多个协程中的调用顺序是 _公平的_。它们以先进先出的顺序服务，例如，第一个调用 `receive` 的协程会获得该元素。在以下示例中，两个协程“ping”和“pong”正在从共享的“table”通道接收“ball”对象。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

//sampleStart
data class Ball(var hits: Int)

fun main() = runBlocking {
    val table = Channel<Ball>() // 共享的 table
    launch { player("ping", table) }
    launch { player("pong", table) }
    table.send(Ball(0)) // 发球
    delay(1000) // 延迟 1 秒
    coroutineContext.cancelChildren() // 游戏结束，取消它们
}

suspend fun player(name: String, table: Channel<Ball>) {
    for (ball in table) { // 在循环中接收球
        ball.hits++
        println("$name $ball")
        delay(300) // 等待一会儿
        table.send(ball) // 将球发回
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-09.kt -->
> 你可以获取完整代码 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-09.kt)。
>
{style="note"}

“ping”协程首先启动，所以它是第一个接到球的。即使“ping”协程在将球发回 table 后立即再次开始接收球，球还是会被“pong”协程接收，因为它已经在等待了：

```text
ping Ball(hits=1)
pong Ball(hits=2)
ping Ball(hits=3)
pong Ball(hits=4)
```

<!--- TEST -->

请注意，有时通道可能会产生看起来不公平的执行，这是由于所使用的执行器本身的特性。详情请参见 [此问题](https://github.com/Kotlin/kotlinx.coroutines/issues/111)。

## 计时器通道

计时器通道是一种特殊的会合通道，它在每次从此通道上次消费后经过给定延迟时，会生成 `Unit`。尽管它独立看起来可能无用，但它是一个有用的构建块，可用于创建复杂的时间敏感型 [produce] 流水线以及执行窗口化和其他时间相关处理的操作符。计时器通道可以在 [select] 中使用，以执行“计时器滴答”操作。

要创建此类通道，请使用工厂方法 [ticker]。要指示不再需要更多元素，请在其上使用 [ReceiveChannel.cancel] 方法。

现在让我们看看它在实践中是如何工作的：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

//sampleStart
fun main() = runBlocking<Unit> {
    val tickerChannel = ticker(delayMillis = 200, initialDelayMillis = 0) // 创建一个计时器通道
    var nextElement = withTimeoutOrNull(1) { tickerChannel.receive() }
    println("Initial element is available immediately: $nextElement") // 没有初始延迟

    nextElement = withTimeoutOrNull(100) { tickerChannel.receive() } // 所有后续元素都有 200 毫秒的延迟
    println("Next element is not ready in 100 ms: $nextElement")

    nextElement = withTimeoutOrNull(120) { tickerChannel.receive() }
    println("Next element is ready in 200 ms: $nextElement")

    // 模拟大的消费延迟
    println("Consumer pauses for 300ms")
    delay(300)
    // 下一个元素立即可用
    nextElement = withTimeoutOrNull(1) { tickerChannel.receive() }
    println("Next element is available immediately after large consumer delay: $nextElement")
    // 请注意，`receive` 调用之间的暂停已被考虑在内，下一个元素会更快到达
    nextElement = withTimeoutOrNull(120) { tickerChannel.receive() }
    println("Next element is ready in 100ms after consumer pause in 300ms: $nextElement")

    tickerChannel.cancel() // 指示不再需要更多元素
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-10.kt -->
> 你可以获取完整代码 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-10.kt)。
>
{style="note"}

它打印以下几行：

```text
Initial element is available immediately: kotlin.Unit
Next element is not ready in 100 ms: null
Next element is ready in 200 ms: kotlin.Unit
Consumer pauses for 300ms
Next element is available immediately after large consumer delay: kotlin.Unit
Next element is ready in 100ms after consumer pause in 300ms: kotlin.Unit
```

<!--- TEST -->

请注意，[ticker] 知道可能的消费者暂停，并且默认情况下，如果发生暂停，它会调整下一个生成元素的延迟，尝试维持固定的元素生成速率。

（可选）可以指定 `mode` 参数等于 [TickerMode.FIXED_DELAY]，以维持元素之间固定的延迟。

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[kotlin.coroutines.CoroutineContext.cancelChildren]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-children.html
[Dispatchers.Default]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html

<!--- INDEX kotlinx.coroutines.channels -->

[Channel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel/index.html
[SendChannel.send]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/send.html
[ReceiveChannel.receive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html
[SendChannel.close]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/close.html
[produce]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/produce.html
[consumeEach]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/consume-each.html
[Channel()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel.html
[ticker]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/ticker.html
[ReceiveChannel.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/cancel.html
[TickerMode.FIXED_DELAY]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-ticker-mode/-f-i-x-e-d_-d-e-l-a-y/index.html

<!--- INDEX kotlinx.coroutines.selects -->

[select]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.selects/select.html

<!--- END -->