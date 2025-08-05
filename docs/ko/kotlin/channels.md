<!--- TEST_NAME ChannelsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 채널)

디퍼드 값(Deferred values)은 코루틴 간에 단일 값을 전달하는 편리한 방법을 제공합니다.
채널은 값 스트림을 전달하는 방법을 제공합니다.

## 채널 기본

[Channel]은 개념적으로 `BlockingQueue`와 매우 유사합니다. 주요 차이점은 블로킹 `put` 연산 대신 서스펜딩 [send][SendChannel.send] 연산을, 블로킹 `take` 연산 대신 서스펜딩 [receive][ReceiveChannel.receive] 연산을 사용한다는 것입니다.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<Int>()
    launch {
        // 이는 CPU를 많이 사용하는 연산 또는 비동기 로직일 수 있습니다.
        // 여기서는 단순히 5개의 제곱수를 보냅니다.
        for (x in 1..5) channel.send(x * x)
    }
    // 여기서는 수신된 5개의 정수를 출력합니다:
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

큐와 달리 채널은 더 이상 요소가 오지 않음을 나타내기 위해 닫을 수 있습니다. 수신자 측에서는 일반 `for` 루프를 사용하여 채널에서 요소를 수신하는 것이 편리합니다.

개념적으로, [close][SendChannel.close]는 채널에 특별한 닫힘 토큰을 보내는 것과 같습니다. 이 닫힘 토큰이 수신되는 즉시 반복이 중단되므로, 닫히기 전에 이전에 보낸 모든 요소가 수신된다는 보장이 있습니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<Int>()
    launch {
        for (x in 1..5) channel.send(x * x)
        channel.close() // 전송 완료
    }
    // 여기서는 `for` 루프를 사용하여 수신된 값들을 출력합니다 (채널이 닫힐 때까지).
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

## 채널 생산자 빌드

코루틴이 요소 시퀀스를 생성하는 패턴은 매우 흔합니다. 이는 동시성 코드에서 흔히 볼 수 있는 _생산자-소비자_ 패턴의 일부입니다. 이러한 생산자를 채널을 매개변수로 받는 함수로 추상화할 수 있지만, 이는 함수에서 결과가 반환되어야 한다는 일반적인 상식에 어긋납니다.

생산자 측에서 이를 올바르게 수행하기 쉽게 해주는 [produce]라는 편리한 코루틴 빌더와, 소비자 측에서 `for` 루프를 대체하는 확장 함수 [consumeEach]가 있습니다:

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

파이프라인은 하나의 코루틴이 잠재적으로 무한한 값 스트림을 생성하는 패턴입니다:

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1
    while (true) send(x++) // 1부터 시작하는 무한 정수 스트림
}
```

그리고 다른 코루틴 또는 코루틴들이 해당 스트림을 소비하고, 일부 처리를 수행하며, 다른 결과를 생성합니다. 아래 예시에서는 숫자가 단순히 제곱됩니다:

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
    val numbers = produceNumbers() // 1부터 정수를 생성
    val squares = square(numbers) // 정수를 제곱
    repeat(5) {
        println(squares.receive()) // 처음 다섯 개 출력
    }
    println("Done!") // 완료
    coroutineContext.cancelChildren() // 자식 코루틴 취소
//sampleEnd
}

fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1
    while (true) send(x++) // 1부터 시작하는 무한 정수 스트림
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

> 코루틴을 생성하는 모든 함수는 [CoroutineScope]의 확장 함수로 정의되어, 애플리케이션에 남아 있는 전역 코루틴이 없도록 [구조화된 동시성](composing-suspending-functions.md#structured-concurrency-with-async)에 의존할 수 있습니다.
>
{style="note"}

## 파이프라인을 사용한 소수

코루틴 파이프라인을 사용하여 소수를 생성하는 예시로 파이프라인을 극한으로 활용해 봅시다. 무한한 숫자 시퀀스에서 시작합니다.

```kotlin
fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // 시작 값부터 무한 정수 스트림
}
```

다음 파이프라인 단계는 들어오는 숫자 스트림을 필터링하여 주어진 소수로 나누어지는 모든 숫자를 제거합니다:

```kotlin
fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) = produce<Int> {
    for (x in numbers) if (x % prime != 0) send(x)
}
```

이제 2부터 숫자 스트림을 시작하고, 현재 채널에서 소수를 가져오며, 찾아낸 각 소수에 대해 새로운 파이프라인 단계를 시작함으로써 파이프라인을 구축합니다:
 
```
numbersFrom(2) -> filter(2) -> filter(3) -> filter(5) -> filter(7) ... 
```
 
다음 예시는 메인 스레드의 컨텍스트에서 전체 파이프라인을 실행하며 처음 10개의 소수를 출력합니다. 모든 코루틴이 메인 [runBlocking] 코루틴의 스코프 내에서 시작되므로, 우리가 시작한 모든 코루틴의 명시적인 목록을 유지할 필요가 없습니다. 처음 10개의 소수를 출력한 후, 모든 자식 코루틴을 취소하기 위해 [cancelChildren][kotlin.coroutines.CoroutineContext.cancelChildren] 확장 함수를 사용합니다.

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
    coroutineContext.cancelChildren() // 메인 코루틴이 종료되도록 모든 자식 코루틴 취소
//sampleEnd    
}

fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // 시작 값부터 무한 정수 스트림
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

표준 라이브러리의 [`iterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/iterator.html) 코루틴 빌더를 사용하여 동일한 파이프라인을 구축할 수 있다는 점에 유의하십시오. `produce`를 `iterator`로, `send`를 `yield`로, `receive`를 `next`로, `ReceiveChannel`을 `Iterator`로 바꾸고 코루틴 스코프를 제거하십시오. `runBlocking`도 필요하지 않을 것입니다. 그러나 위에 보이는 바와 같이 채널을 사용하는 파이프라인의 이점은 [Dispatchers.Default] 컨텍스트에서 실행할 경우 실제로 여러 CPU 코어를 사용할 수 있다는 점입니다.

어쨌든, 이는 소수를 찾는 데 매우 비실용적인 방법입니다. 실제로는 파이프라인에 다른 서스펜딩 호출(예: 원격 서비스에 대한 비동기 호출)이 포함되며, 이러한 파이프라인은 `sequence`/`iterator`를 사용하여 구축할 수 없습니다. 이는 `produce`와 같이 완전 비동기 방식이 아닌, 임의의 서스펜션을 허용하지 않기 때문입니다.
 
## 팬아웃

여러 코루틴이 동일한 채널에서 수신하여 작업을 서로 분배할 수 있습니다. 주기적으로 정수(초당 10개)를 생성하는 생산자 코루틴부터 시작해봅시다:

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1 // 1부터 시작
    while (true) {
        send(x++) // 다음 생성
        delay(100) // 0.1초 대기
    }
}
```

그다음 여러 프로세서 코루틴을 가질 수 있습니다. 이 예시에서는 단순히 자신의 ID와 수신된 숫자를 출력합니다:

```kotlin
fun CoroutineScope.launchProcessor(id: Int, channel: ReceiveChannel<Int>) = launch {
    for (msg in channel) {
        println("Processor #$id received $msg")
    }    
}
```

이제 5개의 프로세서를 시작하고 거의 1초 동안 작업하도록 해봅시다. 무슨 일이 일어나는지 확인해 보세요:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking<Unit> {
//sampleStart
    val producer = produceNumbers()
    repeat(5) { launchProcessor(it, producer) }
    delay(950)
    producer.cancel() // 생산자 코루틴을 취소하여 모두 종료
//sampleEnd
}

fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1 // 1부터 시작
    while (true) {
        send(x++) // 다음 생성
        delay(100) // 0.1초 대기
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

출력은 다음 예시와 유사할 것이며, 각 특정 정수를 수신하는 프로세서 ID는 다를 수 있습니다:

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

생산자 코루틴을 취소하면 해당 채널이 닫히므로, 프로세서 코루틴이 수행하는 채널 반복이 궁극적으로 종료된다는 점에 유의하십시오.

또한, `launchProcessor` 코드에서 팬아웃(fan-out)을 수행하기 위해 `for` 루프를 사용하여 채널을 명시적으로 반복하는 방식에 주목하십시오. `consumeEach`와 달리, 이 `for` 루프 패턴은 여러 코루틴에서 사용하기에 완벽하게 안전합니다. 프로세서 코루틴 중 하나가 실패하더라도 다른 코루틴들은 여전히 채널을 처리할 것입니다. 반면 `consumeEach`를 통해 작성된 프로세서는 정상 또는 비정상 완료 시 항상 기본 채널을 소비(취소)합니다.     

## 팬인

여러 코루틴이 동일한 채널로 전송할 수 있습니다. 예를 들어, 문자열 채널과 지정된 지연 시간으로 이 채널에 특정 문자열을 반복적으로 전송하는 서스펜딩 함수를 만들어 봅시다:

```kotlin
suspend fun sendString(channel: SendChannel<String>, s: String, time: Long) {
    while (true) {
        delay(time)
        channel.send(s)
    }
}
```

이제 문자열을 전송하는 몇몇 코루틴을 시작하면 어떤 일이 일어나는지 살펴봅시다 (이 예시에서는 메인 코루틴의 자식으로서 메인 스레드의 컨텍스트에서 시작합니다):

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<String>()
    launch { sendString(channel, "foo", 200L) }
    launch { sendString(channel, "BAR!", 500L) }
    repeat(6) { // 처음 여섯 개 수신
        println(channel.receive())
    }
    coroutineContext.cancelChildren() // 메인 코루틴이 종료되도록 모든 자식 코루틴 취소
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

지금까지 보여드린 채널에는 버퍼가 없었습니다. 버퍼링되지 않은 채널은 송신자와 수신자가 서로 만날 때(즉, 랑데부(rendezvous) 시) 요소를 전송합니다. `send`가 먼저 호출되면 `receive`가 호출될 때까지 서스펜드되고, `receive`가 먼저 호출되면 `send`가 호출될 때까지 서스펜드됩니다.

[Channel()] 팩토리 함수와 [produce] 빌더 모두 _버퍼 크기_를 지정하는 선택적 `capacity` 매개변수를 받습니다. 버퍼는 송신자가 서스펜드되기 전에 여러 요소를 보낼 수 있도록 허용하며, 이는 버퍼가 가득 찼을 때 블록하는 지정된 용량의 `BlockingQueue`와 유사합니다.

다음 코드의 동작을 살펴보세요:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking<Unit> {
//sampleStart
    val channel = Channel<Int>(4) // 버퍼링된 채널 생성
    val sender = launch { // 송신자 코루틴 시작
        repeat(10) {
            println("Sending $it") // 각 요소 전송 전 출력
            channel.send(it) // 버퍼가 가득 차면 서스펜드됨
        }
    }
    // 아무것도 수신하지 않음... 그냥 대기....
    delay(1000)
    sender.cancel() // 송신자 코루틴 취소
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-08.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-08.kt)에서 확인할 수 있습니다.
>
{style="note"}

용량이 _4_인 버퍼링된 채널을 사용하여 "sending"을 _다섯_ 번 출력합니다:

```text
Sending 0
Sending 1
Sending 2
Sending 3
Sending 4
```

<!--- TEST -->

처음 네 개의 요소는 버퍼에 추가되고, 송신자는 다섯 번째 요소를 보내려고 할 때 서스펜드됩니다.

## 채널의 공정성

채널에 대한 `send` 및 `receive` 연산은 여러 코루틴으로부터의 호출 순서에 따라 _공정_합니다. 이들은 선입선출(FIFO) 순서로 처리됩니다. 즉, `receive`를 호출하는 첫 번째 코루틴이 요소를 받습니다. 다음 예시에서는 "ping"과 "pong" 두 코루틴이 공유된 "table" 채널에서 "ball" 객체를 수신하고 있습니다.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

//sampleStart
data class Ball(var hits: Int)

fun main() = runBlocking {
    val table = Channel<Ball>() // 공유 테이블
    launch { player("ping", table) }
    launch { player("pong", table) }
    table.send(Ball(0)) // 공을 서브
    delay(1000) // 1초 지연
    coroutineContext.cancelChildren() // 게임 오버, 취소
}

suspend fun player(name: String, table: Channel<Ball>) {
    for (ball in table) { // 루프에서 공을 수신
        ball.hits++
        println("$name $ball")
        delay(300) // 잠시 대기
        table.send(ball) // 공을 다시 전송
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-09.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-09.kt)에서 확인할 수 있습니다.
>
{style="note"}

"ping" 코루틴이 먼저 시작되었으므로, 공을 가장 먼저 수신합니다. "ping" 코루틴이 공을 다시 테이블로 보낸 직후 다시 공을 수신하기 시작하더라도, "pong" 코루틴이 이미 공을 기다리고 있었기 때문에 "pong" 코루틴이 공을 수신합니다:

```text
ping Ball(hits=1)
pong Ball(hits=2)
ping Ball(hits=3)
pong Ball(hits=4)
```

<!--- TEST -->

때로는 채널이 사용되는 실행자의 특성으로 인해 불공정해 보이는 실행을 생성할 수 있다는 점에 유의하십시오. 자세한 내용은 [이 이슈](https://github.com/Kotlin/kotlinx.coroutines/issues/111)를 참조하십시오.

## 티커 채널

티커 채널은 이 채널에서 마지막으로 소비된 이후 주어진 지연 시간이 경과할 때마다 `Unit`을 생성하는 특별한 랑데부 채널입니다. 단독으로는 쓸모없어 보일 수 있지만, 복잡한 시간 기반 [produce] 파이프라인과 윈도잉(windowing) 및 기타 시간 의존적 처리(time-dependent processing)를 수행하는 연산자를 생성하는 데 유용한 구성 요소입니다. 티커 채널은 [select]에서 "틱 발생 시" 동작을 수행하는 데 사용될 수 있습니다.

이러한 채널을 생성하려면 팩토리 메서드 [ticker]를 사용하십시오. 더 이상 요소가 필요하지 않음을 나타내려면 [ReceiveChannel.cancel] 메서드를 사용하십시오.

이제 실제 작동 방식을 살펴보겠습니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

//sampleStart
fun main() = runBlocking<Unit> {
    val tickerChannel = ticker(delayMillis = 200, initialDelayMillis = 0) // 티커 채널 생성
    var nextElement = withTimeoutOrNull(1) { tickerChannel.receive() }
    println("초기 요소는 즉시 사용 가능: $nextElement") // 초기 지연 없음

    nextElement = withTimeoutOrNull(100) { tickerChannel.receive() } // 이후 모든 요소는 200ms 지연
    println("100ms 내에 다음 요소가 준비되지 않음: $nextElement")

    nextElement = withTimeoutOrNull(120) { tickerChannel.receive() }
    println("200ms 내에 다음 요소가 준비됨: $nextElement")

    // 긴 소비 지연 에뮬레이션
    println("소비자 300ms 동안 일시 중지")
    delay(300)
    // 다음 요소 즉시 사용 가능
    nextElement = withTimeoutOrNull(1) { tickerChannel.receive() }
    println("큰 소비자 지연 후 다음 요소 즉시 사용 가능: $nextElement")
    // `receive` 호출 간의 일시 중지가 고려되어 다음 요소가 더 빨리 도착한다는 점에 유의하세요.
    nextElement = withTimeoutOrNull(120) { tickerChannel.receive() }
    println("소비자 300ms 일시 중지 후 100ms 내에 다음 요소가 준비됨: $nextElement")

    tickerChannel.cancel() // 더 이상 요소가 필요하지 않음을 나타냄
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
초기 요소는 즉시 사용 가능: kotlin.Unit
100ms 내에 다음 요소가 준비되지 않음: null
200ms 내에 다음 요소가 준비됨: kotlin.Unit
소비자 300ms 동안 일시 중지
큰 소비자 지연 후 다음 요소 즉시 사용 가능: kotlin.Unit
소비자 300ms 일시 중지 후 100ms 내에 다음 요소가 준비됨: kotlin.Unit
```

<!--- TEST -->

[ticker]는 가능한 소비자 일시 중지를 인식하며, 기본적으로 일시 중지가 발생할 경우 다음 생성될 요소의 지연 시간을 조정하여 생성되는 요소의 고정된 속도를 유지하려고 시도한다는 점에 유의하십시오.
 
선택적으로, 요소 간의 고정 지연 시간을 유지하기 위해 [TickerMode.FIXED_DELAY]와 동일한 `mode` 매개변수를 지정할 수 있습니다.

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