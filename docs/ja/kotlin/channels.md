<!--- TEST_NAME ChannelsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: チャネル)

Deferred値は、コルーチン間で単一の値を転送するための便利な方法を提供します。
チャネルは、値のストリームを転送する方法を提供します。

## チャネルの基本

[Channel]は、概念的には`BlockingQueue`と非常によく似ています。主な違いは、
ブロッキングな`put`操作の代わりにサスペンドする[send][SendChannel.send]を持ち、
ブロッキングな`take`操作の代わりにサスペンドする[receive][ReceiveChannel.receive]を持つことです。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-01.kt)で確認できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
1
4
9
16
25
Done!
```

<!--- TEST -->

## チャネルのクローズとイテレーション

キューとは異なり、チャネルはこれ以上要素が来ないことを示すためにクローズすることができます。
受信側では、チャネルから要素を受信するのに通常の`for`ループを使用すると便利です。

概念的に、[close][SendChannel.close]は特別なクローズトークンをチャネルに送信するようなものです。
このクローズトークンが受信されるとすぐにイテレーションは停止するため、
クローズされる前に送信されたすべての要素が受信されることが保証されます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-02.kt)で確認できます。
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

## チャネルプロデューサーの構築

コルーチンが要素のシーケンスを生成するパターンは非常に一般的です。
これは、並行処理コードでよく見られる_プロデューサー・コンシューマー_パターンの一部です。
このようなプロデューサーをチャネルをパラメータとして受け取る関数に抽象化することもできますが、
これは関数から結果が返されるべきという常識に反します。

プロデューサー側でこれを正しく行うことを容易にする便利なコルーチンビルダー[produce]と、
コンシューマー側の`for`ループを置き換える拡張関数[consumeEach]があります。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-03.kt)で確認できます。
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

## パイプライン

パイプラインとは、1つのコルーチンが値のストリーム（おそらく無限）を生成するパターンです。

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1
    while (true) send(x++) // infinite stream of integers starting from 1
}
```

そして別のコルーチン（または複数のコルーチン）がそのストリームを消費し、
何らかの処理を行い、別の結果を生成します。
以下の例では、数値が単に二乗されます。

```kotlin
fun CoroutineScope.square(numbers: ReceiveChannel<Int>): ReceiveChannel<Int> = produce {
    for (x in numbers) send(x * x)
}
```

メインコードはパイプライン全体を開始して接続します。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-04.kt)で確認できます。
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

> コルーチンを作成するすべての関数は[CoroutineScope]の拡張として定義されているため、
> [構造化された並行処理](composing-suspending-functions.md#structured-concurrency-with-async)に依存して、
> アプリケーション内に残留するグローバルコルーチンがないことを確認できます。
>
{style="note"}

## パイプラインによる素数

コルーチンのパイプラインを使用して素数を生成する例で、パイプラインを極限まで活用してみましょう。
まず、無限の数値シーケンスから始めます。

```kotlin
fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // infinite stream of integers from start
}
```

次のパイプラインステージは、入力ストリームの数値をフィルタリングし、
指定された素数で割り切れるすべての数値を除外します。

```kotlin
fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) = produce<Int> {
    for (x in numbers) if (x % prime != 0) send(x)
}
```

次に、2から始まる数値のストリームを開始し、現在のチャネルから素数を取り出し、
見つかった素数ごとに新しいパイプラインステージを起動して、パイプラインを構築します。

```
numbersFrom(2) -> filter(2) -> filter(3) -> filter(5) -> filter(7) ... 
```

次の例は、メインスレッドのコンテキストでパイプライン全体を実行し、最初の10個の素数をプリントします。
すべてのコルーチンがメインの[runBlocking]コルーチンのスコープで起動されるため、
起動したすべてのコルーチンの明示的なリストを保持する必要はありません。
最初の10個の素数をプリントした後、[cancelChildren][kotlin.coroutines.CoroutineContext.cancelChildren]
拡張関数を使用してすべての子コルーチンをキャンセルします。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-05.kt)で確認できます。
>
{style="note"}

このコードの出力は次のとおりです。

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

[`iterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/iterator.html)
コルーチンビルダーを標準ライブラリから使用して、同じパイプラインを構築できることに注意してください。
`produce`を`iterator`に、`send`を`yield`に、`receive`を`next`に、
`ReceiveChannel`を`Iterator`に置き換え、コルーチンスコープを取り除きます。
`runBlocking`も必要ありません。
しかし、上記のようにチャネルを使用するパイプラインの利点は、
[Dispatchers.Default]コンテキストで実行した場合に実際に複数のCPUコアを使用できることです。

いずれにせよ、これは素数を見つけるための非常に非実用的な方法です。実際には、パイプラインには
他のサスペンドする呼び出し（リモートサービスへの非同期呼び出しなど）が含まれており、
これらのパイプラインは`sequence`/`iterator`では構築できません。
なぜなら、これらは任意のサスペンドを許可しないからです。完全に非同期である`produce`とは異なります。

## ファンアウト

複数のコルーチンが同じチャネルから受信し、それらの間で作業を分散することができます。
まず、定期的に整数を生成するプロデューサーコルーチンから始めましょう（1秒あたり10個の数値）。

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1 // start from 1
    while (true) {
        send(x++) // produce next
        delay(100) // wait 0.1s
    }
}
```

次に、いくつかのプロセッサーコルーチンを用意できます。
この例では、それらは自身のIDと受信した数値をプリントするだけです。

```kotlin
fun CoroutineScope.launchProcessor(id: Int, channel: ReceiveChannel<Int>) = launch {
    for (msg in channel) {
        println("Processor #$id received $msg")
    }    
}
```

では、5つのプロセッサーを起動し、ほぼ1秒間動作させてみましょう。何が起こるか見てください。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-06.kt)で確認できます。
>
{style="note"}

出力は以下のものと似ているでしょう。ただし、各特定の整数を受け取るプロセッサーIDは異なる場合があります。

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

プロデューサーコルーチンをキャンセルするとそのチャネルがクローズされ、
結果的にプロセッサーコルーチンが行っているチャネルのイテレーションが終了することに注意してください。

また、`launchProcessor`コードでファンアウトを実行するために、`for`ループを使ってチャネルを明示的にイテレートする方法にも注意してください。
`consumeEach`とは異なり、この`for`ループパターンは複数のコルーチンから使用しても完全に安全です。
プロセッサーコルーチンの1つが失敗しても、他のコルーチンは引き続きチャネルを処理しますが、
`consumeEach`経由で記述されたプロセッサーは、通常の完了または異常な完了時に常に基になるチャネルを消費（キャンセル）します。

## ファンイン

複数のコルーチンが同じチャネルに送信できます。
例えば、文字列のチャネルと、指定された遅延でこのチャネルに指定された文字列を繰り返し送信する
サスペンド関数があるとしましょう。

```kotlin
suspend fun sendString(channel: SendChannel<String>, s: String, time: Long) {
    while (true) {
        delay(time)
        channel.send(s)
    }
}
```

では、文字列を送信するいくつかのコルーチンを起動した場合に何が起こるか見てみましょう
（この例では、メインコルーチンの子としてメインスレッドのコンテキストで起動します）。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-07.kt)で確認できます。
>
{style="note"}

出力は次のとおりです。

```text
foo
foo
BAR!
foo
foo
BAR!
```

<!--- TEST -->

## バッファ付きチャネル

これまでに示されたチャネルにはバッファがありませんでした。アンバッファードチャネルは、
送信者と受信者が出会う（ランデブー）ときに要素を転送します。
`send`が最初に呼び出されると、`receive`が呼び出されるまでサスペンドされ、
`receive`が最初に呼び出されると、`send`が呼び出されるまでサスペンドされます。

[Channel()]ファクトリ関数と[produce]ビルダーの両方が、オプションの`capacity`パラメータを取り、
_バッファサイズ_を指定できます。バッファを使用すると、送信者はサスペンドする前に複数の要素を送信できます。
これは、容量が指定された`BlockingQueue`に似ており、バッファが満杯になるとブロックします。

次のコードの挙動を見てみましょう。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-08.kt)で確認できます。
>
{style="note"}

容量が_4_のバッファ付きチャネルを使用しているため、「sending」を_5_回プリントします。

```text
Sending 0
Sending 1
Sending 2
Sending 3
Sending 4
```

<!--- TEST -->

最初の4つの要素がバッファに追加され、送信者は5番目の要素を送信しようとするとサスペンドします。

## チャネルの公平性

チャネルへの`send`および`receive`操作は、複数のコルーチンからの呼び出し順序に関して_公平_です。
それらは先入れ先出し（FIFO）順序で処理されます。例えば、`receive`を最初に呼び出したコルーチンが要素を取得します。
次の例では、「ping」と「pong」の2つのコルーチンが、共有の「table」チャネルから「ball」オブジェクトを受信しています。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-09.kt)で確認できます。
>
{style="note"}

「ping」コルーチンが最初に起動されるため、ボールを最初に受信します。
「ping」コルーチンはボールをテーブルに戻した直後に再びボールを受信し始めますが、
「pong」コルーチンがすでに待機していたため、ボールは「pong」コルーチンによって受信されます。

```text
ping Ball(hits=1)
pong Ball(hits=2)
ping Ball(hits=3)
pong Ball(hits=4)
```

<!--- TEST -->

使用されているエグゼキュータの性質により、チャネルが不公平に見える実行を生成する場合があります。
詳細については[こちらのイシュー](https://github.com/Kotlin/kotlinx.coroutines/issues/111)を参照してください。

## ティッカーチャネル

ティッカーチャネルは特別なランデブーチャネルで、このチャネルからの最後の消費から指定された遅延が経過するたびに`Unit`を生成します。
単体では役に立たないように見えるかもしれませんが、複雑な時間ベースの[produce]パイプラインや、
ウィンドウ処理やその他の時間依存の処理を行う演算子を作成するための便利な構成要素です。
ティッカーチャネルは「ティック時」のアクションを実行するために[select]で使用できます。

このようなチャネルを作成するには、ファクトリメソッド[ticker]を使用します。
これ以上要素が必要ないことを示すには、それに対して[ReceiveChannel.cancel]メソッドを使用します。

では、実際にどのように動作するか見てみましょう。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-10.kt)で確認できます。
>
{style="note"}

次の行をプリントします。

```text
Initial element is available immediately: kotlin.Unit
Next element is not ready in 100 ms: null
Next element is ready in 200 ms: kotlin.Unit
Consumer pauses for 300ms
Next element is available immediately after large consumer delay: kotlin.Unit
Next element is ready in 100ms after consumer pause in 300ms: kotlin.Unit
```

<!--- TEST -->

[ticker]は消費者のポーズを認識しており、デフォルトで、ポーズが発生した場合に次に生成される要素の遅延を調整し、
生成される要素の固定レートを維持しようとすることに注意してください。

オプションで、要素間の固定遅延を維持するために、[TickerMode.FIXED_DELAY]に等しい`mode`パラメータを指定できます。

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