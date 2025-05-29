<!--- TEST_NAME ChannelsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 通道)

延遲值 (Deferred values) 提供了一種在協程 (coroutines) 之間傳輸單個值的便捷方式。通道 (Channels) 則提供了一種傳輸值串流 (stream of values) 的方式。

## 通道基礎

[通道 (Channel)] 在概念上與 `BlockingQueue` 非常相似。一個關鍵區別在於，它沒有阻塞的 `put` 操作，而是具備暫停 (suspending) 的 [send][SendChannel.send] 操作；它也沒有阻塞的 `take` 操作，而是具備暫停 (suspending) 的 [receive][ReceiveChannel.receive] 操作。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<Int>()
    launch {
        // this might be heavy CPU-consuming computation or async logic, 
        // we'll just send five squares
        for (x in 1..5) channel.send(x * x)
    }
    // here we print five received integers:
    repeat(5) { println(channel.receive()) }
    println("Done!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-01.kt -->
> 您可以在 [此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-01.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出為：

```text
1
4
9
16
25
Done!
```

<!--- TEST -->

## 關閉與迭代通道

與佇列不同，通道可以被關閉以表示不會再有更多元素傳入。在接收端，使用常規的 `for` 迴圈從通道接收元素是很方便的。

從概念上講，[close][SendChannel.close] 就像向通道發送一個特殊的關閉符記 (close token)。一旦接收到此關閉符記，迭代就會停止，因此可以保證在關閉之前所有先前發送的元素都會被接收：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<Int>()
    launch {
        for (x in 1..5) channel.send(x * x)
        channel.close() // we're done sending
    }
    // here we print received values using `for` loop (until the channel is closed)
    for (y in channel) println(y)
    println("Done!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-02.kt -->
> 您可以在 [此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-02.kt) 取得完整程式碼。
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

## 建立通道生產者

協程產生一系列元素的模式相當常見。這是併發程式碼中經常發現的 _生產者-消費者 (producer-consumer)_ 模式的一部分。您可以將此類生產者抽象為一個以通道作為其參數的函數，但這與「函數必須返回值」的常識相悖。

有一個名為 [produce] 的便捷協程建構器 (coroutine builder)，它使得在生產者端正確操作變得容易，還有一個擴展函數 [consumeEach]，它替換了消費者端的 `for` 迴圈：

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
> 您可以在 [此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-03.kt) 取得完整程式碼。
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

## 管線

管線 (pipeline) 是一種模式，其中一個協程產生一個（可能是無限的）值串流：

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1
    while (true) send(x++) // infinite stream of integers starting from 1
}
```

另一個或多個協程消耗該串流，進行一些處理，並產生其他結果。在下面的範例中，數字只是被平方了：

```kotlin
fun CoroutineScope.square(numbers: ReceiveChannel<Int>): ReceiveChannel<Int> = produce {
    for (x in numbers) send(x * x)
}
```

主程式碼啟動並連接了整個管線：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val numbers = produceNumbers() // produces integers from 1 and on
    val squares = square(numbers) // squares integers
    repeat(5) {
        println(squares.receive()) // print first five
    }
    println("Done!") // we are done
    coroutineContext.cancelChildren() // cancel children coroutines
//sampleEnd
}

fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1
    while (true) send(x++) // infinite stream of integers starting from 1
}

fun CoroutineScope.square(numbers: ReceiveChannel<Int>): ReceiveChannel<Int> = produce {
    for (x in numbers) send(x * x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-04.kt -->
> 您可以在 [此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-04.kt) 取得完整程式碼。
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

> 所有建立協程的函數都被定義為 [CoroutineScope] 上的擴展，這樣我們就可以依賴 [結構化併發 (structured concurrency)](composing-suspending-functions.md#structured-concurrency-with-async) 來確保我們的應用程式中不會有殘留的全域協程 (lingering global coroutines)。
>
{style="note"}

## 使用管線生成質數

讓我們以一個使用協程管線來生成質數 (prime numbers) 的範例，將管線推向極致。我們從一個無限的數字序列開始。

```kotlin
fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // infinite stream of integers from start
}
```

下一個管線階段會過濾傳入的數字串流，移除所有可被給定質數整除的數字：

```kotlin
fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) = produce<Int> {
    for (x in numbers) if (x % prime != 0) send(x)
}
```

現在我們透過從 2 開始一個數字串流，從當前通道中取一個質數，並為每個找到的質數啟動新的管線階段來建立我們的管線：

```
numbersFrom(2) -> filter(2) -> filter(3) -> filter(5) -> filter(7) ... 
```

以下範例印出前十個質數，在主執行緒的上下文 (context) 中執行整個管線。由於所有協程都在主 [runBlocking] 協程的作用域 (scope) 內啟動，我們不必保留所有已啟動協程的明確列表。我們使用 [cancelChildren][kotlin.coroutines.CoroutineContext.cancelChildren] 擴展函數，在我們印出前十個質數後取消所有子協程。

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
    coroutineContext.cancelChildren() // cancel all children to let main finish
//sampleEnd    
}

fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // infinite stream of integers from start
}

fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) = produce<Int> {
    for (x in numbers) if (x % prime != 0) send(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-05.kt -->
> 您可以在 [此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-05.kt) 取得完整程式碼。
>
{style="note"}

此程式碼的輸出為：

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

請注意，您可以使用標準函式庫 (standard library) 中的 [`iterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/iterator.html) 協程建構器來建立相同的管線。將 `produce` 替換為 `iterator`，將 `send` 替換為 `yield`，將 `receive` 替換為 `next`，將 `ReceiveChannel` 替換為 `Iterator`，並擺脫協程作用域。您也不需要 `runBlocking`。然而，如上所示使用通道的管線的優勢在於，如果您在 [Dispatchers.Default] 上下文 (context) 中執行它，它實際上可以使用多個 CPU 核心。

總之，這是一種極其不實用的尋找質數的方法。實際上，管線確實涉及一些其他暫停調用 (suspending invocations)（例如對遠端服務的非同步 (asynchronous) 呼叫），而這些管線不能使用 `sequence`/`iterator` 建立，因為它們不允許任意暫停，不像 `produce`，它是完全非同步的。

## 扇出 (Fan-out)

多個協程可以從同一個通道接收，在它們之間分配工作。讓我們從一個定期產生整數（每秒十個數字）的生產者協程開始：

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1 // start from 1
    while (true) {
        send(x++) // produce next
        delay(100) // wait 0.1s
    }
}
```

然後我們可以有幾個處理器協程。在這個範例中，它們只是印出它們的 ID 和接收到的數字：

```kotlin
fun CoroutineScope.launchProcessor(id: Int, channel: ReceiveChannel<Int>) = launch {
    for (msg in channel) {
        println("Processor #$id received $msg")
    }    
}
```

現在讓我們啟動五個處理器，並讓它們工作將近一秒。看看會發生什麼：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking<Unit> {
//sampleStart
    val producer = produceNumbers()
    repeat(5) { launchProcessor(it, producer) }
    delay(950)
    producer.cancel() // cancel producer coroutine and thus kill them all
//sampleEnd
}

fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1 // start from 1
    while (true) {
        send(x++) // produce next
        delay(100) // wait 0.1s
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
> 您可以在 [此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-06.kt) 取得完整程式碼。
>
{style="note"}

輸出將與以下類似，儘管接收每個特定整數的處理器 ID 可能會不同：

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

請注意，取消生產者協程會關閉其通道，從而最終終止處理器協程正在進行的通道迭代。

此外，請注意我們如何在 `launchProcessor` 程式碼中，使用 `for` 迴圈明確迭代通道來執行扇出。與 `consumeEach` 不同，這種 `for` 迴圈模式從多個協程使用是完全安全的。如果其中一個處理器協程失敗，那麼其他協程仍會處理通道，而透過 `consumeEach` 編寫的處理器在其正常或異常完成時，總是會消耗（取消）底層通道。

## 扇入 (Fan-in)

多個協程可以向同一個通道發送。例如，讓我們有一個字串通道，以及一個重複地以指定延遲向此通道發送指定字串的暫停函數：

```kotlin
suspend fun sendString(channel: SendChannel<String>, s: String, time: Long) {
    while (true) {
        delay(time)
        channel.send(s)
    }
}
```

現在，讓我們看看如果我們啟動幾個發送字串的協程（在此範例中，我們將它們作為主協程的子項在主執行緒的上下文中啟動），會發生什麼：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<String>()
    launch { sendString(channel, "foo", 200L) }
    launch { sendString(channel, "BAR!", 500L) }
    repeat(6) { // receive first six
        println(channel.receive())
    }
    coroutineContext.cancelChildren() // cancel all children to let main finish
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
> 您可以在 [此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-07.kt) 取得完整程式碼。
>
{style="note"}

輸出為：

```text
foo
foo
BAR!
foo
foo
BAR!
```

<!--- TEST -->

## 緩衝通道 (Buffered channels)

迄今為止顯示的通道都沒有緩衝。無緩衝通道 (Unbuffered channels) 會在發送者和接收者相遇（即「約會 (rendezvous)」）時傳輸元素。如果 `send` 先被調用，它會暫停直到 `receive` 被調用；如果 `receive` 先被調用，它會暫停直到 `send` 被調用。

[Channel()] 工廠函數和 [produce] 建構器都接受一個可選的 `capacity` 參數，以指定 _緩衝區大小_ (buffer size)。緩衝區允許發送者在暫停之前發送多個元素，這類似於具有指定容量的 `BlockingQueue`，當緩衝區滿時會阻塞。

看看以下程式碼的行為：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking<Unit> {
//sampleStart
    val channel = Channel<Int>(4) // create buffered channel
    val sender = launch { // launch sender coroutine
        repeat(10) {
            println("Sending $it") // print before sending each element
            channel.send(it) // will suspend when buffer is full
        }
    }
    // don't receive anything... just wait....
    delay(1000)
    sender.cancel() // cancel sender coroutine
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-08.kt -->
> 您可以在 [此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-08.kt) 取得完整程式碼。
>
{style="note"}

它使用容量為 _四_ 的緩衝通道 (buffered channel)，印出「sending」_五_ 次：

```text
Sending 0
Sending 1
Sending 2
Sending 3
Sending 4
```

<!--- TEST -->

前四個元素被添加到緩衝區，當發送者嘗試發送第五個元素時，它會暫停。

## 通道是公平的 (Channels are fair)

對通道的發送和接收操作，根據其從多個協程調用的順序是 _公平的_ (fair)。它們以先進先出 (first-in first-out) 的順序服務，例如，第一個調用 `receive` 的協程會取得該元素。在下面的範例中，兩個協程「ping」和「pong」正在從共享的「table」通道接收「ball」物件。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

//sampleStart
data class Ball(var hits: Int)

fun main() = runBlocking {
    val table = Channel<Ball>() // a shared table
    launch { player("ping", table) }
    launch { player("pong", table) }
    table.send(Ball(0)) // serve the ball
    delay(1000) // delay 1 second
    coroutineContext.cancelChildren() // game over, cancel them
}

suspend fun player(name: String, table: Channel<Ball>) {
    for (ball in table) { // receive the ball in a loop
        ball.hits++
        println("$name $ball")
        delay(300) // wait a bit
        table.send(ball) // send the ball back
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-09.kt -->
> 您可以在 [此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-09.kt) 取得完整程式碼。
>
{style="note"}

「ping」協程首先啟動，所以它是第一個接收到球的。即使「ping」協程在將球發回桌子後立即再次開始接收球，球仍會被「pong」協程接收，因為它已經在等待它了：

```text
ping Ball(hits=1)
pong Ball(hits=2)
ping Ball(hits=3)
pong Ball(hits=4)
```

<!--- TEST -->

請注意，由於所使用的執行器 (executor) 的特性，通道有時可能會產生看起來不公平的執行。詳情請參閱 [此問題](https://github.com/Kotlin/kotlinx.coroutines/issues/111)。

## 計時器通道 (Ticker channels)

計時器通道 (Ticker channel) 是一種特殊的約會 (rendezvous) 通道，自從上次從此通道消耗後，每當經過給定延遲時它會產生 `Unit`。儘管它單獨使用看起來可能沒用，但它是一個有用的建構區塊，可以用來建立複雜的基於時間的 [produce] 管線以及執行視窗化 (windowing) 和其他時間相關處理的運算子 (operators)。計時器通道可以在 [select] 中使用以執行「on tick」動作。

要建立此類通道，請使用工廠方法 [ticker]。為了表示不再需要更多元素，請在其上使用 [ReceiveChannel.cancel] 方法。

現在讓我們看看它在實踐中如何運作：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

//sampleStart
fun main() = runBlocking<Unit> {
    val tickerChannel = ticker(delayMillis = 200, initialDelayMillis = 0) // create a ticker channel
    var nextElement = withTimeoutOrNull(1) { tickerChannel.receive() }
    println("Initial element is available immediately: $nextElement") // no initial delay

    nextElement = withTimeoutOrNull(100) { tickerChannel.receive() } // all subsequent elements have 200ms delay
    println("Next element is not ready in 100 ms: $nextElement")

    nextElement = withTimeoutOrNull(120) { tickerChannel.receive() }
    println("Next element is ready in 200 ms: $nextElement")

    // Emulate large consumption delays
    println("Consumer pauses for 300ms")
    delay(300)
    // Next element is available immediately
    nextElement = withTimeoutOrNull(1) { tickerChannel.receive() }
    println("Next element is available immediately after large consumer delay: $nextElement")
    // Note that the pause between `receive` calls is taken into account and next element arrives faster
    nextElement = withTimeoutOrNull(120) { tickerChannel.receive() }
    println("Next element is ready in 100ms after consumer pause in 300ms: $nextElement")

    tickerChannel.cancel() // indicate that no more elements are needed
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-10.kt -->
> 您可以在 [此處](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-10.kt) 取得完整程式碼。
>
{style="note"}

它印出以下行：

```text
Initial element is available immediately: kotlin.Unit
Next element is not ready in 100 ms: null
Next element is ready in 200 ms: kotlin.Unit
Consumer pauses for 300ms
Next element is available immediately after large consumer delay: kotlin.Unit
Next element is ready in 100ms after consumer pause in 300ms: kotlin.Unit
```

<!--- TEST -->

請注意，[ticker] 知道可能的消費者暫停，並且預設情況下，如果發生暫停，會調整下一個產生元素的延遲，嘗試維持產生元素的固定速率。

或者，可以指定一個等於 [TickerMode.FIXED_DELAY] 的 `mode` 參數，以維持元素之間的固定延遲。

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