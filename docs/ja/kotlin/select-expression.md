<!--- TEST_NAME SelectGuideTest --> 
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: select式 (実験的))

`select`式は、複数の`suspend`関数を同時に待機し、最初に利用可能になったものを_選択_することを可能にします。

> `select`式は`kotlinx.coroutines`の実験的な機能です。そのAPIは、`kotlinx.coroutines`ライブラリの今後のアップデートで破壊的変更を伴う可能性があり、進化が予想されます。
>
{style="note"}

## チャネルからの選択

文字列の2つのプロデューサー`fizz`と`buzz`があるとしましょう。`fizz`は500msごとに"Fizz"という文字列を生成します。

```kotlin
fun CoroutineScope.fizz() = produce<String> {
    while (true) { // 500msごとに"Fizz"を送信
        delay(500)
        send("Fizz")
    }
}
```

そして`buzz`は1000msごとに"Buzz!"という文字列を生成します。

```kotlin
fun CoroutineScope.buzz() = produce<String> {
    while (true) { // 1000msごとに"Buzz!"を送信
        delay(1000)
        send("Buzz!")
    }
}
```

`[receive][ReceiveChannel.receive]` `suspend`関数を使用すると、一方または他方のチャネルから_いずれか_を受信できます。しかし、`[select]`式は、`[onReceive][ReceiveChannel.onReceive]`句を使用して_両方_から同時に受信することを可能にします。

```kotlin
suspend fun selectFizzBuzz(fizz: ReceiveChannel<String>, buzz: ReceiveChannel<String>) {
    select<Unit> { // <Unit> は、この select 式が結果を生成しないことを意味します 
        fizz.onReceive { value ->  // これは最初のselect句です
            println("fizz -> '$value'")
        }
        buzz.onReceive { value ->  // これは2番目のselect句です
            println("buzz -> '$value'")
        }
    }
}
```

これを7回実行してみましょう。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

fun CoroutineScope.fizz() = produce<String> {
    while (true) { // sends "Fizz" every 500 ms
        delay(500)
        send("Fizz")
    }
}

fun CoroutineScope.buzz() = produce<String> {
    while (true) { // sends "Buzz!" every 1000 ms
        delay(1000)
        send("Buzz!")
    }
}

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

fun main() = runBlocking<Unit> {
//sampleStart
    val fizz = fizz()
    val buzz = buzz()
    repeat(7) {
        selectFizzBuzz(fizz, buzz)
    }
    coroutineContext.cancelChildren() // cancel fizz & buzz coroutines
//sampleEnd        
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-01.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-01.kt)で入手できます。
>
{style="note"}

このコードの結果は次のとおりです。

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

## クローズ時の選択

`select`内の`[onReceive][ReceiveChannel.onReceive]`句は、チャネルが閉じられると失敗し、対応する`select`が例外をスローします。チャネルが閉じられたときに特定の操作を実行するには、`[onReceiveCatching][ReceiveChannel.onReceiveCatching]`句を使用できます。次の例では、`select`が選択された句の結果を返す式であることも示しています。

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

"Hello"文字列を4回生成するチャネル`a`と、"World"を4回生成するチャネル`b`で使用してみましょう。

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
    repeat(8) { // print first eight results
        println(selectAorB(a, b))
    }
    coroutineContext.cancelChildren()  
//sampleEnd      
}    
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-02.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-02.kt)で入手できます。
>
{style="note"}

このコードの結果は非常に興味深いので、さらに詳しく分析します。

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

ここからいくつかの観察ができます。

まず、`select`は最初の句に_バイアスがかかっています_。複数の句が同時に選択可能な場合、それらの中で最初のものが選択されます。ここでは、両方のチャネルが常に文字列を生成しているため、`select`の最初の句である`a`チャネルが優先されます。しかし、バッファリングされていないチャネルを使用しているため、`a`はその`[send][SendChannel.send]`呼び出しで時々中断され、`b`にも送信する機会を与えます。

2番目の観察は、チャネルがすでに閉じられている場合、`[onReceiveCatching][ReceiveChannel.onReceiveCatching]`がすぐに選択されることです。

## 送信のための選択

`select`式には`[onSend][SendChannel.onSend]`句があり、選択のバイアスのかかった性質と組み合わせて非常に役立ちます。

プライマリチャネルのコンシューマーが追いつけない場合に、その値を`side`チャネルに送信する整数プロデューサーの例を書いてみましょう。

```kotlin
fun CoroutineScope.produceNumbers(side: SendChannel<Int>) = produce<Int> {
    for (num in 1..10) { // 1から10までの10個の数値を生成
        delay(100) // 100msごとに
        select<Unit> {
            onSend(num) {} // プライマリチャネルに送信
            side.onSend(num) {} // またはサイドチャネルに     
        }
    }
}
```

コンシューマーは非常に遅く、各数値の処理に250msかかります。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

fun CoroutineScope.produceNumbers(side: SendChannel<Int>) = produce<Int> {
    for (num in 1..10) { // produce 10 numbers from 1 to 10
        delay(100) // every 100 ms
        select<Unit> {
            onSend(num) {} // Send to the primary channel
            side.onSend(num) {} // or to the side channel     
        }
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val side = Channel<Int>() // allocate side channel
    launch { // this is a very fast consumer for the side channel
        side.consumeEach { println("Side channel has $it") }
    }
    produceNumbers(side).consumeEach { 
        println("Consuming $it")
        delay(250) // let us digest the consumed number properly, do not hurry
    }
    println("Done consuming")
    coroutineContext.cancelChildren()  
//sampleEnd      
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-03.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-03.kt)で入手できます。
>
{style="note"}
  
では、何が起こるか見てみましょう。
 
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

## Deferred値の選択

`Deferred`値は`[onAwait][Deferred.onAwait]`句を使用して選択できます。ランダムな遅延の後で`Deferred`文字列値を返す`async`関数から始めましょう。

```kotlin
fun CoroutineScope.asyncString(time: Int) = async {
    delay(time.toLong())
    "Waited for $time ms"
}
```

ランダムな遅延でそれらを1ダース開始してみましょう。

```kotlin
fun CoroutineScope.asyncStringsList(): List<Deferred<String>> {
    val random = Random(3)
    return List(12) { asyncString(random.nextInt(1000)) }
}
```

これで、`main`関数はそれらのうち最初に完了するものを待ち、まだアクティブな`Deferred`値の数を数えます。ここで、`select`式がKotlin DSLであるという事実を利用したことに注目してください。そのため、任意のコードを使用して句を提供できます。この場合、`Deferred`値のリストを反復処理して、各`Deferred`値に`onAwait`句を提供します。

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
                "Deferred $index produced answer '$answer'"
            }
        }
    }
    println(result)
    val countActive = list.count { it.isActive }
    println("$countActive coroutines are still active")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-04.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-04.kt)で入手できます。
>
{style="note"}

出力は次のとおりです。

```text
Deferred 4 produced answer 'Waited for 128 ms'
11 coroutines are still active
```

<!--- TEST -->

## Deferred値のチャネルを切り替える

`Deferred`文字列値のチャネルを消費し、受信した各`Deferred`値を待機するチャネルプロデューサー関数を書いてみましょう。ただし、次の`Deferred`値が来るか、チャネルが閉じられるまでです。この例では、`[onReceiveCatching][ReceiveChannel.onReceiveCatching]`と`[onAwait][Deferred.onAwait]`句を同じ`select`にまとめます。

```kotlin
fun CoroutineScope.switchMapDeferreds(input: ReceiveChannel<Deferred<String>>) = produce<String> {
    var current = input.receive() // 最初に受信したDeferred値から開始
    while (isActive) { // キャンセルまたはクローズされるまでループ
        val next = select<Deferred<String>?> { // このselectから次のDeferred値またはnullを返す
            input.onReceiveCatching { update ->
                update.getOrNull()
            }
            current.onAwait { value ->
                send(value) // 現在のDeferredが生成した値を送信
                input.receiveCatching().getOrNull() // そして入力チャネルから次のDeferredを使用
            }
        }
        if (next == null) {
            println("Channel was closed")
            break // ループを抜ける
        } else {
            current = next
        }
    }
}
```

これをテストするために、指定された時間の後に指定された文字列に解決されるシンプルな`async`関数を使用します。

```kotlin
fun CoroutineScope.asyncString(str: String, time: Long) = async {
    delay(time)
    str
}
```

`main`関数は、`switchMapDeferreds`の結果を出力するコルーチンを起動し、いくつかのテストデータをそれに送信するだけです。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*
    
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
            println("Channel was closed")
            break // out of loop
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
    val chan = Channel<Deferred<String>>() // the channel for test
    launch { // launch printing coroutine
        for (s in switchMapDeferreds(chan)) 
            println(s) // print each received string
    }
    chan.send(asyncString("BEGIN", 100))
    delay(200) // enough time for "BEGIN" to be produced
    chan.send(asyncString("Slow", 500))
    delay(100) // not enough time to produce slow
    chan.send(asyncString("Replace", 100))
    delay(500) // give it time before the last one
    chan.send(asyncString("END", 500))
    delay(1000) // give it time to process
    chan.close() // close the channel ... 
    delay(500) // and wait some time to let it finish
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-05.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-05.kt)で入手できます。
>
{style="note"}

このコードの結果：

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