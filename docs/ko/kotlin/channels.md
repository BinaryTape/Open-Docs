<!--- TEST_NAME ChannelsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 채널)

디퍼드(Deferred) 값은 코루틴 간에 단일 값을 편리하게 전달하는 방법을 제공합니다. 채널은 값의 스트림을 전달하는 방법을 제공합니다.

## 채널 기본

[Channel]은 개념적으로 `BlockingQueue`와 매우 유사합니다. 한 가지 주요 차이점은 블로킹(blocking) `put` 연산 대신 중단(suspending) [send][SendChannel.send] 연산을, 블로킹 `take` 연산 대신 중단 [receive][ReceiveChannel.receive] 연산을 가지고 있다는 것입니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-01.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
1
4
9
16
25
Done!
```

<!--- TEST -->

## 채널 닫기 및 반복

큐와 달리, 채널은 더 이상 요소가 오지 않음을 나타내기 위해 닫힐 수 있습니다. 수신자 측에서는 채널에서 요소를 수신하기 위해 일반적인 `for` 루프를 사용하는 것이 편리합니다.
 
개념적으로, [close][SendChannel.close]는 채널에 특별한 닫힘 토큰을 보내는 것과 같습니다. 이 닫힘 토큰이 수신되는 즉시 반복이 중지되므로, 닫히기 전에 이전에 보낸 모든 요소가 수신된다는 것이 보장됩니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-02.kt)에서 확인할 수 있습니다.
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

## 채널 생산자 구축

코루틴이 일련의(sequence of) 요소를 생산하는 패턴은 매우 흔합니다. 이는 동시성 코드에서 자주 발견되는 생산자-소비자 패턴의 일부입니다. 이러한 생산자를 채널을 매개변수로 받는 함수로 추상화할 수 있지만, 이는 결과가 함수에서 반환되어야 한다는 일반적인 상식과는 다릅니다.

생산자 측에서 올바르게 처리하기 쉽게 해주는 [produce]라는 편리한 코루틴 빌더와, 소비자 측에서 `for` 루프를 대체하는 확장 함수 [consumeEach]가 있습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-03.kt)에서 확인할 수 있습니다.
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

## 파이프라인

파이프라인은 하나의 코루틴이 무한할 수도 있는 값의 스트림을 생산하는 패턴입니다:

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1
    while (true) send(x++) // infinite stream of integers starting from 1
}
```

그리고 다른 코루틴 또는 코루틴들이 그 스트림을 소비하고, 일부 처리를 수행하며, 다른 결과를 생산합니다. 아래 예시에서는 숫자가 단순히 제곱됩니다:

```kotlin
fun CoroutineScope.square(numbers: ReceiveChannel<Int>): ReceiveChannel<Int> = produce {
    for (x in numbers) send(x * x)
}
```

메인 코드는 전체 파이프라인을 시작하고 연결합니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-04.kt)에서 확인할 수 있습니다.
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

> 코루틴을 생성하는 모든 함수는 [CoroutineScope]의 확장(extension)으로 정의되므로, 우리 애플리케이션에 전역 코루틴이 남아있지 않도록 [구조화된 동시성](composing-suspending-functions.md#structured-concurrency-with-async)에 의존할 수 있습니다.
>
{style="note"}

## 파이프라인을 사용한 소수

코루틴 파이프라인을 사용하여 소수를 생성하는 예시를 통해 파이프라인을 극단적으로 활용해 봅시다. 무한한 숫자 시퀀스(sequence)로 시작합니다.

```kotlin
fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // infinite stream of integers from start
}
```

다음 파이프라인 단계는 들어오는 숫자 스트림을 필터링하여, 주어진 소수로 나눌 수 있는 모든 숫자를 제거합니다:

```kotlin
fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) = produce<Int> {
    for (x in numbers) if (x % prime != 0) send(x)
}
```

이제 2부터 숫자 스트림을 시작하고, 현재 채널에서 소수를 가져오며, 발견된 각 소수에 대해 새로운 파이프라인 단계를 시작하여 파이프라인을 구축합니다:
 
```
numbersFrom(2) -> filter(2) -> filter(3) -> filter(5) -> filter(7) ... 
```
 
다음 예시는 메인 스레드의 컨텍스트(context)에서 전체 파이프라인을 실행하며, 첫 열 개의 소수를 출력합니다. 모든 코루틴이 메인 [runBlocking] 코루틴의 스코프(scope) 내에서 시작되므로, 우리가 시작한 모든 코루틴의 명시적인 목록을 유지할 필요가 없습니다. 첫 열 개의 소수를 출력한 후에는 [cancelChildren][kotlin.coroutines.CoroutineContext.cancelChildren] 확장 함수를 사용하여 모든 자식(children) 코루틴을 취소합니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-05.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

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

참고로, 표준 라이브러리의 [`iterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/iterator.html) 코루틴 빌더를 사용하여 동일한 파이프라인을 구축할 수 있습니다. `produce`를 `iterator`로, `send`를 `yield`로, `receive`를 `next`로, `ReceiveChannel`을 `Iterator`로 대체하고 코루틴 스코프를 제거하면 됩니다. `runBlocking`도 필요하지 않을 것입니다. 하지만 위에서 보여준 채널을 사용하는 파이프라인의 이점은, [Dispatchers.Default] 컨텍스트(context)에서 실행할 경우 실제로 여러 CPU 코어를 사용할 수 있다는 것입니다.

어쨌든, 이것은 소수를 찾는 매우 비실용적인 방법입니다. 실제로는 파이프라인에 다른 중단 호출(invocation) (원격 서비스에 대한 비동기 호출과 같은)이 포함되며, 이러한 파이프라인은 `sequence`/`iterator`를 사용하여 구축할 수 없습니다. 이는 `sequence`/`iterator`가 임의의 중단을 허용하지 않기 때문입니다. 반면 `produce`는 완전히 비동기적입니다.

## 팬아웃(Fan-out)

여러 코루틴이 동일한 채널에서 수신하여 작업을 분배할 수 있습니다. 먼저 정수를 주기적으로 생산하는(초당 10개 숫자) 생산자 코루틴으로 시작해 봅시다:

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1 // start from 1
    while (true) {
        send(x++) // produce next
        delay(100) // wait 0.1s
    }
}
```

다음으로 여러 프로세서 코루틴을 가질 수 있습니다. 이 예시에서는 자신의 ID와 수신된 숫자를 출력할 뿐입니다:

```kotlin
fun CoroutineScope.launchProcessor(id: Int, channel: ReceiveChannel<Int>) = launch {
    for (msg in channel) {
        println("Processor #$id received $msg")
    }    
}
```

이제 5개의 프로세서를 시작하여 약 1초 동안 작업하게 해 봅시다. 어떤 일이 일어나는지 살펴보세요:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-06.kt)에서 확인할 수 있습니다.
>
{style="note"}

출력은 다음 예시와 유사할 것입니다. 다만 각 특정 정수를 수신하는 프로세서 ID는 다를 수 있습니다:

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

생산자 코루틴을 취소하면 해당 채널이 닫히며, 따라서 프로세서 코루틴이 수행하는 채널 반복이 결국 종료된다는 점에 유의하세요.

또한, `launchProcessor` 코드에서 `for` 루프를 사용하여 채널을 명시적으로 반복하여 팬아웃(fan-out)을 수행하는 방식에 주목하세요. `consumeEach`와 달리, 이 `for` 루프 패턴은 여러 코루틴에서 사용하기에 완벽하게 안전합니다. 프로세서 코루틴 중 하나가 실패하더라도, 다른 코루틴들은 여전히 채널을 처리할 것입니다. 반면 `consumeEach`를 통해 작성된 프로세서는 정상 또는 비정상 완료 시 항상 기본 채널을 소비(취소)합니다.

## 팬인(Fan-in)

여러 코루틴이 동일한 채널로 보낼 수 있습니다. 예를 들어, 문자열 채널과 지정된 지연 시간(delay)으로 이 채널에 지정된 문자열을 반복적으로 보내는 중단 함수를 가져봅시다:

```kotlin
suspend fun sendString(channel: SendChannel<String>, s: String, time: Long) {
    while (true) {
        delay(time)
        channel.send(s)
    }
}
```

이제 문자열을 보내는 몇 개의 코루틴을 시작하면 어떤 일이 일어나는지 살펴봅시다 (이 예시에서는 메인 코루틴의 자식(children)으로 메인 스레드의 컨텍스트(context)에서 시작합니다):

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-07.kt)에서 확인할 수 있습니다.
>
{style="note"}

출력은 다음과 같습니다:

```text
foo
foo
BAR!
foo
foo
BAR!
```

<!--- TEST -->

## 버퍼링된 채널

지금까지 보여준 채널은 버퍼가 없었습니다. 버퍼링되지 않은 채널은 송신자와 수신자가 서로 만날 때(즉, 랑데부(rendezvous)) 요소를 전달합니다. `send`가 먼저 호출되면, `receive`가 호출될 때까지 중단되고, `receive`가 먼저 호출되면, `send`가 호출될 때까지 중단됩니다.

[Channel()] 팩토리 함수와 [produce] 빌더는 모두 선택적 `capacity` 매개변수를 받아 _버퍼 크기_를 지정합니다. 버퍼는 송신자가 중단되기 전에 여러 요소를 보낼 수 있게 하며, 지정된 용량(capacity)을 가진 `BlockingQueue`와 유사하게 버퍼가 가득 차면 블록됩니다.

다음 코드의 동작을 살펴보세요:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-08.kt)에서 확인할 수 있습니다.
>
{style="note"}

이것은 용량이 _네_ 개인 버퍼링된 채널을 사용하여 "Sending"을 _다섯_ 번 출력합니다:

```text
Sending 0
Sending 1
Sending 2
Sending 3
Sending 4
```

<!--- TEST -->

처음 네 개의 요소가 버퍼에 추가되고, 송신자는 다섯 번째 요소를 보내려고 할 때 중단됩니다.

## 채널의 공정성

채널에 대한 `send` 및 `receive` 연산은 여러 코루틴에서의 호출 순서에 대해 _공정(fair)_합니다. 이들은 선입선출(first-in first-out) 순서로 처리됩니다. 예를 들어, `receive`를 먼저 호출하는 코루틴이 요소를 얻습니다. 다음 예시에서는 "ping"과 "pong" 두 코루틴이 공유 "table" 채널에서 "ball" 객체를 수신하고 있습니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-09.kt)에서 확인할 수 있습니다.
>
{style="note"}

"ping" 코루틴이 먼저 시작되므로, 공을 처음으로 수신합니다. "ping" 코루틴이 공을 다시 테이블로 보낸 후 즉시 공을 다시 수신하기 시작하더라도, "pong" 코루틴이 이미 공을 기다리고 있었기 때문에 "pong" 코루틴에 의해 공이 수신됩니다:

```text
ping Ball(hits=1)
pong Ball(hits=2)
ping Ball(hits=3)
pong Ball(hits=4)
```

<!--- TEST -->

때때로 채널은 사용되는 실행기(executor)의 특성 때문에 불공정해 보이는 실행을 생성할 수 있다는 점에 유의하세요. 자세한 내용은 [이 이슈](https://github.com/Kotlin/kotlinx.coroutines/issues/111)를 참조하세요.

## 티커 채널

티커(Ticker) 채널은 이 채널에서 마지막 소비 이후 주어진 지연 시간이 지날 때마다 `Unit`을 생산하는 특별한 랑데부 채널입니다. 단독으로는 쓸모없어 보일 수 있지만, 복잡한 시간 기반 [produce] 파이프라인과 윈도잉(windowing) 및 기타 시간 의존적인 처리를 수행하는 연산자를 생성하는 데 유용한 구성 요소(building block)입니다. 티커 채널은 [select]에서 "on tick" 동작을 수행하는 데 사용될 수 있습니다.

그런 채널을 생성하려면 팩토리 메서드 [ticker]를 사용하세요. 더 이상 요소가 필요 없음을 나타내려면 해당 채널에 [ReceiveChannel.cancel] 메서드를 사용하세요.

이제 실제로 어떻게 작동하는지 살펴보겠습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-10.kt)에서 확인할 수 있습니다.
>
{style="note"}

다음 줄을 출력합니다:

```text
Initial element is available immediately: kotlin.Unit
Next element is not ready in 100 ms: null
Next element is ready in 200 ms: kotlin.Unit
Consumer pauses for 300ms
Next element is available immediately after large consumer delay: kotlin.Unit
Next element is ready in 100ms after consumer pause in 300ms: kotlin.Unit
```

<!--- TEST -->

[ticker]는 가능한 소비자 일시 중지(pause)를 인지하며, 기본적으로 일시 중지가 발생하면 다음 생산 요소의 지연 시간을 조정하여 생산되는 요소의 고정된 속도를 유지하려고 노력한다는 점에 유의하세요.
 
선택적으로, 요소 간에 고정된 지연 시간을 유지하도록 [TickerMode.FIXED_DELAY]와 동일한 `mode` 매개변수를 지정할 수 있습니다.

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