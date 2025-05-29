<!--- TEST_NAME SelectGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: Select 表达式（实验性）)

Select 表达式使得同时等待多个挂起函数并*选择*第一个可用的函数成为可能。

> Select 表达式是 `kotlinx.coroutines` 的一项实验性功能。其 API 预计将在 `kotlinx.coroutines` 库的后续更新中演进，可能引入破坏性变更。
>
{style="note"}

## 从通道中选择

假设我们有两个字符串生产者：`fizz` 和 `buzz`。`fizz` 每 500 毫秒生成一次 "Fizz" 字符串：

```kotlin
fun CoroutineScope.fizz() = produce<String> {
    while (true) { // sends "Fizz" every 500 ms
        delay(500)
        send("Fizz")
    }
}
```

`buzz` 每 1000 毫秒生成一次 "Buzz!" 字符串：

```kotlin
fun CoroutineScope.buzz() = produce<String> {
    while (true) { // sends "Buzz!" every 1000 ms
        delay(1000)
        send("Buzz!")
    }
}
```

使用 `[receive][ReceiveChannel.receive]` 挂起函数，我们可以*要么*从一个通道接收，*要么*从另一个通道接收。但是 `[select]` 表达式允许我们使用其 `[onReceive][ReceiveChannel.onReceive]` 子句同时从*两者*接收：

```kotlin
suspend fun selectFizzBuzz(fizz: ReceiveChannel<String>, buzz: ReceiveChannel<String>) {
    select<Unit> { // <Unit> means that this select expression does not produce any result 
        fizz.onReceive { value ->  // this is the first select clause
            println("fizz -> '$value'")
        }
        buzz.onReceive { value ->  // this is the second select clause
            println("buzz -> '$value'")
        }
    }
}
```

让我们运行它七次：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

fun CoroutineScope.fizz() = produce<String> {
    while (true) { // 每 500 毫秒发送 "Fizz"
        delay(500)
        send("Fizz")
    }
}

fun CoroutineScope.buzz() = produce<String> {
    while (true) { // 每 1000 毫秒发送 "Buzz!"
        delay(1000)
        send("Buzz!")
    }
}

suspend fun selectFizzBuzz(fizz: ReceiveChannel<String>, buzz: ReceiveChannel<String>) {
    select<Unit> { // <Unit> 意味着此 select 表达式不产生任何结果 
        fizz.onReceive { value ->  // 这是第一个 select 子句
            println("fizz -> '$value'")
        }
        buzz.onReceive { value ->  // 这是第二个 select 子句
            println("buzz -> '$value'")
        }
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val fizz = fizz()
    val buzz = buzz()
    repeat(7) {
        selectFizzBuzz(fizz, buzz)
    }
    coroutineContext.cancelChildren() // 取消 fizz 和 buzz 协程
//sampleEnd        
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-01.kt -->
> 你可以在 `[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-01.kt)` 获取完整代码。
>
{style="note"}

这段代码的结果是：

```text
fizz -> 'Fizz'
buzz -> 'Buzz!'
fizz -> 'Fizz'
fizz -> 'Fizz'
buzz -> 'Buzz!'
fizz -> 'Fizz'
fizz -> 'Fizz'
```

<!--- TEST -->

## 在通道关闭时选择

当通道关闭时，`select` 中的 `[onReceive][ReceiveChannel.onReceive]` 子句会失败，导致相应的 `select` 抛出异常。我们可以使用 `[onReceiveCatching][ReceiveChannel.onReceiveCatching]` 子句在通道关闭时执行特定操作。以下示例还展示了 `select` 是一个表达式，它返回其所选子句的结果：

```kotlin
suspend fun selectAorB(a: ReceiveChannel<String>, b: ReceiveChannel<String>): String =
    select<String> {
        a.onReceiveCatching { it ->
            val value = it.getOrNull()
            if (value != null) {
                "a -> '$value'"
            } else {
                "Channel 'a' is closed"
            }
        }
        b.onReceiveCatching { it ->
            val value = it.getOrNull()
            if (value != null) {
                "b -> '$value'"
            } else {
                "Channel 'b' is closed"
            }
        }
    }
```

让我们用通道 `a`（生成四次 "Hello" 字符串）和通道 `b`（生成四次 "World"）来使用它：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

suspend fun selectAorB(a: ReceiveChannel<String>, b: ReceiveChannel<String>): String =
    select<String> {
        a.onReceiveCatching { it ->
            val value = it.getOrNull()
            if (value != null) {
                "a -> '$value'"
            } else {
                "Channel 'a' is closed"
            }
        }
        b.onReceiveCatching { it ->
            val value = it.getOrNull()
            if (value != null) {
                "b -> '$value'"
            } else {
                "Channel 'b' is closed"
            }
        }
    }
    
fun main() = runBlocking<Unit> {
//sampleStart
    val a = produce<String> {
        repeat(4) { send("Hello $it") }
    }
    val b = produce<String> {
        repeat(4) { send("World $it") }
    }
    repeat(8) { // 打印前八个结果
        println(selectAorB(a, b))
    }
    coroutineContext.cancelChildren()  
//sampleEnd      
}    
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-02.kt -->
> 你可以在 `[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-02.kt)` 获取完整代码。
>
{style="note"}

这段代码的结果相当有趣，我们将更详细地分析它：

```text
a -> 'Hello 0'
a -> 'Hello 1'
b -> 'World 0'
a -> 'Hello 2'
a -> 'Hello 3'
b -> 'World 1'
Channel 'a' is closed
Channel 'a' is closed
```

<!--- TEST -->

可以从中得出几点观察结果。

首先，`select` 对第一个子句有*偏向性*。当多个子句同时可选择时，它们中第一个被选中。在这里，两个通道都在持续生成字符串，因此 `a` 通道作为 select 中的第一个子句，会胜出。然而，因为我们使用的是无缓冲通道，`a` 会在其 `[send][SendChannel.send]` 调用时时不时地挂起，这也给了 `b` 发送的机会。

第二个观察结果是，当通道已关闭时，`[onReceiveCatching][ReceiveChannel.onReceiveCatching]` 会立即被选中。

## 选择发送

Select 表达式具有 `[onSend][SendChannel.onSend]` 子句，结合选择的偏向性，可以大有裨益。

让我们编写一个整数生产者的示例，当其主通道上的消费者无法跟上时，它会将值发送到 `side` 通道：

```kotlin
fun CoroutineScope.produceNumbers(side: SendChannel<Int>) = produce<Int> {
    for (num in 1..10) { // produce 10 numbers from 1 to 10
        delay(100) // every 100 ms
        select<Unit> {
            onSend(num) {} // Send to the primary channel
            side.onSend(num) {} // or to the side channel     
        }
    }
}
```

消费者会相当慢，处理每个数字需要 250 毫秒：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

fun CoroutineScope.produceNumbers(side: SendChannel<Int>) = produce<Int> {
    for (num in 1..10) { // 生成 1 到 10 的 10 个数字
        delay(100) // 每 100 毫秒
        select<Unit> {
            onSend(num) {} // 发送到主通道
            side.onSend(num) {} // 或发送到侧通道     
        }
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val side = Channel<Int>() // 分配侧通道
    launch { // 这是侧通道的一个非常快的消费者
        side.consumeEach { println("Side channel has $it") }
    }
    produceNumbers(side).consumeEach { 
        println("Consuming $it")
        delay(250) // 让我们妥善处理消费的数字，不要着急
    }
    println("Done consuming") // 完成消费
    coroutineContext.cancelChildren()  
//sampleEnd      
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-03.kt -->
> 你可以在 `[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-03.kt)` 获取完整代码。
>
{style="note"}

那么让我们看看会发生什么：

```text
Consuming 1
Side channel has 2
Side channel has 3
Consuming 4
Side channel has 5
Side channel has 6
Consuming 7
Side channel has 8
Side channel has 9
Consuming 10
Done consuming
```

<!--- TEST -->

## 选择延迟值

延迟值可以使用 `[onAwait][Deferred.onAwait]` 子句进行选择。让我们从一个异步函数开始，它在随机延迟后返回一个延迟的字符串值：

```kotlin
fun CoroutineScope.asyncString(time: Int) = async {
    delay(time.toLong())
    "Waited for $time ms"
}
```

让我们启动十二个带有随机延迟的函数。

```kotlin
fun CoroutineScope.asyncStringsList(): List<Deferred<String>> {
    val random = Random(3)
    return List(12) { asyncString(random.nextInt(1000)) }
}
```

现在主函数会等待其中第一个完成，并计算仍处于活动状态的延迟值数量。请注意，我们在这里利用了 `select` 表达式是一个 Kotlin DSL 的事实，因此我们可以使用任意代码为其提供子句。在这种情况下，我们遍历延迟值列表，为每个延迟值提供 `onAwait` 子句。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.selects.*
import java.util.*
    
fun CoroutineScope.asyncString(time: Int) = async {
    delay(time.toLong())
    "Waited for $time ms"
}

fun CoroutineScope.asyncStringsList(): List<Deferred<String>> {
    val random = Random(3)
    return List(12) { asyncString(random.nextInt(1000)) }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val list = asyncStringsList()
    val result = select<String> {
        list.withIndex().forEach { (index, deferred) ->
            deferred.onAwait { answer ->
                "Deferred $index produced answer '$answer'" // 延迟值 $index 产生了结果 '$answer'
            }
        }
    }
    println(result)
    val countActive = list.count { it.isActive }
    println("$countActive coroutines are still active") // $countActive 协程仍处于活动状态
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-04.kt -->
> 你可以在 `[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-04.kt)` 获取完整代码。
>
{style="note"}

输出是：

```text
Deferred 4 produced answer 'Waited for 128 ms'
11 coroutines are still active
```

<!--- TEST -->

## 在延迟值通道上切换

让我们编写一个通道生产者函数，它消费一个延迟字符串值通道，等待每个接收到的延迟值，但只等到下一个延迟值出现或通道关闭。这个示例将 `[onReceiveCatching][ReceiveChannel.onReceiveCatching]` 和 `[onAwait][Deferred.onAwait]` 子句放在同一个 `select` 中：

```kotlin
fun CoroutineScope.switchMapDeferreds(input: ReceiveChannel<Deferred<String>>) = produce<String> {
    var current = input.receive() // start with first received deferred value
    while (isActive) { // loop while not cancelled/closed
        val next = select<Deferred<String>?> { // return next deferred value from this select or null
            input.onReceiveCatching { update ->
                update.getOrNull()
            }
            current.onAwait { value ->
                send(value) // send value that current deferred has produced
                input.receiveCatching().getOrNull() // and use the next deferred from the input channel
            }
        }
        if (next == null) {
            println("Channel was closed") // 通道已关闭
            break // out of loop
        } else {
            current = next
        }
    }
}
```

为了测试它，我们将使用一个简单的异步函数，它在指定时间后解析为指定的字符串：

```kotlin
fun CoroutineScope.asyncString(str: String, time: Long) = async {
    delay(time)
    str
}
```

主函数只是启动一个协程来打印 `switchMapDeferreds` 的结果，并向其发送一些测试数据：

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*
    
fun CoroutineScope.switchMapDeferreds(input: ReceiveChannel<Deferred<String>>) = produce<String> {
    var current = input.receive() // 从第一个接收到的延迟值开始
    while (isActive) { // 循环直到未取消/关闭
        val next = select<Deferred<String>?> { // 从此 select 返回下一个延迟值或 null
            input.onReceiveCatching { update ->
                update.getOrNull()
            }
            current.onAwait { value ->
                send(value) // 发送当前延迟值已产生的值
                input.receiveCatching().getOrNull() // 并使用输入通道中的下一个延迟值
            }
        }
        if (next == null) {
            println("Channel was closed") // 通道已关闭
            break // 跳出循环
        } else {
            current = next
        }
    }
}

fun CoroutineScope.asyncString(str: String, time: Long) = async {
    delay(time)
    str
}

fun main() = runBlocking<Unit> {
//sampleStart
    val chan = Channel<Deferred<String>>() // 用于测试的通道
    launch { // 启动打印协程
        for (s in switchMapDeferreds(chan)) 
            println(s) // 打印每个接收到的字符串
    }
    chan.send(asyncString("BEGIN", 100))
    delay(200) // 足够时间让 "BEGIN" 产生
    chan.send(asyncString("Slow", 500))
    delay(100) // 没有足够时间产生 slow
    chan.send(asyncString("Replace", 100))
    delay(500) // 在最后一个之前给它时间
    chan.send(asyncString("END", 500))
    delay(1000) // 给它时间处理
    chan.close() // 关闭通道... 
    delay(500) // 并等待一段时间让它完成
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-05.kt -->
> 你可以在 `[这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-05.kt)` 获取完整代码。
>
{style="note"}

这段代码的结果：

```text
BEGIN
Replace
END
Channel was closed
```

<!--- TEST -->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[Deferred.onAwait]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/on-await.html

<!--- INDEX kotlinx.coroutines.channels -->

[ReceiveChannel.receive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html
[ReceiveChannel.onReceive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/on-receive.html
[ReceiveChannel.onReceiveCatching]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/on-receive-catching.html
[SendChannel.send]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/send.html
[SendChannel.onSend]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/on-send.html

<!--- INDEX kotlinx.coroutines.selects -->

[select]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.selects/select.html

<!--- END -->