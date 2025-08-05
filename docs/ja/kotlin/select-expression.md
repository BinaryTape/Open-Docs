<!--- TEST_NAME SelectGuideTest --> 
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: Select式 (実験的))

select式 (Select expression) を使用すると、複数のサスペンド関数 (suspending function) を同時に待機し、利用可能になった最初のものを_選択_することができます。

> select式は`kotlinx.coroutines`の実験的な機能です。そのAPIは、今後の`kotlinx.coroutines`ライブラリのアップデートで、破壊的変更を伴う可能性があり、進化することが予想されます。
>
{style="note"}

## チャネルからの選択

文字列のプロデューサーである`fizz`と`buzz`を2つ用意しましょう。`fizz`は500ミリ秒ごとに"Fizz"という文字列を生成します。

```kotlin
fun CoroutineScope.fizz() = produce<String> {
    while (true) { // 500ミリ秒ごとに"Fizz"を送信
        delay(500)
        send("Fizz")
    }
}
```

そして`buzz`は1000ミリ秒ごとに"Buzz!"という文字列を生成します。

```kotlin
fun CoroutineScope.buzz() = produce<String> {
    while (true) { // 1000ミリ秒ごとに"Buzz!"を送信
        delay(1000)
        send("Buzz!")
    }
}
```

[receive][ReceiveChannel.receive]サスペンド関数を使用すると、どちらか一方のチャネルから受け取ることができます。しかし、[select]式を使用すると、その[onReceive][ReceiveChannel.onReceive]句を使って_両方_から同時に受け取ることができます。

```kotlin
suspend fun selectFizzBuzz(fizz: ReceiveChannel<String>, buzz: ReceiveChannel<String>) {
    select<Unit> { // <Unit> はこのselect式がいかなる結果も生成しないことを意味します 
        fizz.onReceive { value ->  // これは最初のselect句です
            println("fizz -> '$value'")
        }
        buzz.onReceive { value ->  // これは2番目のselect句です
            println("buzz -> '$value'")
        }
    }
}
```

これを全部で7回実行してみましょう。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

fun CoroutineScope.fizz() = produce<String> {
    while (true) { // 500ミリ秒ごとに"Fizz"を送信
        delay(500)
        send("Fizz")
    }
}

fun CoroutineScope.buzz() = produce<String> {
    while (true) { // 1000ミリ秒ごとに"Buzz!"を送信
        delay(1000)
        send("Buzz!")
    }
}

suspend fun selectFizzBuzz(fizz: ReceiveChannel<String>, buzz: ReceiveChannel<String>) {
    select<Unit> { // <Unit> はこのselect式がいかなる結果も生成しないことを意味します 
        fizz.onReceive { value ->  // これは最初のselect句です
            println("fizz -> '$value'")
        }
        buzz.onReceive { value ->  // これは2番目のselect句です
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
    coroutineContext.cancelChildren() // fizzとbuzzコルーチンをキャンセル
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

`select`内の[onReceive][ReceiveChannel.onReceive]句は、チャネルが閉じられると失敗し、対応する`select`が例外をスローします。チャネルが閉じられたときに特定の操作を実行するために、[onReceiveCatching][ReceiveChannel.onReceiveCatching]句を使用できます。以下の例は、`select`が選択された句の結果を返す式であることも示しています。

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

これを、"Hello"文字列を4回生成するチャネル`a`と、"World"を4回生成するチャネル`b`で使用してみましょう。

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
    repeat(8) { // 最初の8つの結果を出力
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

このコードの結果はかなり興味深いので、さらに詳しく分析してみましょう。

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

これからいくつかの所見を述べることができます。

まず第一に、`select`は最初の句に_バイアスがかかっています_。複数の句が同時に選択可能な場合、その中で最初のものが選択されます。ここでは、両方のチャネルが常に文字列を生成しているため、`select`内の最初の句であるチャネル`a`が優先されます。しかし、バッファなしのチャネルを使用しているため、`a`は[send][SendChannel.send]呼び出しで時々サスペンドされ、`b`も送信する機会が与えられます。

2番目の所見は、チャネルがすでに閉じている場合、[onReceiveCatching][ReceiveChannel.onReceiveCatching]がすぐに選択されるということです。

## 送信の選択

Select式には[onSend][SendChannel.onSend]句があり、選択のバイアスのかかった特性と組み合わせて非常に有効に活用できます。

プライマリチャネルのコンシューマーが追いつけない場合、値を`side`チャネルに送信する整数のプロデューサーの例を書いてみましょう。

```kotlin
fun CoroutineScope.produceNumbers(side: SendChannel<Int>) = produce<Int> {
    for (num in 1..10) { // 1から10までの10個の数値を生成
        delay(100) // 100ミリ秒ごとに
        select<Unit> {
            onSend(num) {} // プライマリチャネルに送信
            side.onSend(num) {} // またはサイドチャネルに
        }
    }
}
```

コンシューマーはかなり遅く、各数値を処理するのに250ミリ秒かかります。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

fun CoroutineScope.produceNumbers(side: SendChannel<Int>) = produce<Int> {
    for (num in 1..10) { // 1から10までの10個の数値を生成
        delay(100) // 100ミリ秒ごとに
        select<Unit> {
            onSend(num) {} // プライマリチャネルに送信
            side.onSend(num) {} // またはサイドチャネルに     
        }
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val side = Channel<Int>() // サイドチャネルを割り当て
    launch { // これはサイドチャネルの非常に高速なコンシューマーです
        side.consumeEach { println("Side channel has $it") }
    }
    produceNumbers(side).consumeEach { 
        println("Consuming $it")
        delay(250) // 消費された数値を適切に処理しましょう、急がないでください
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

Deferred値は[onAwait][Deferred.onAwait]句を使用して選択できます。ランダムな遅延の後、Deferredな文字列値を返す非同期関数から始めましょう。

```kotlin
fun CoroutineScope.asyncString(time: Int) = async {
    delay(time.toLong())
    "Waited for $time ms"
}
```

ランダムな遅延でそれらを12個開始してみましょう。

```kotlin
fun CoroutineScope.asyncStringsList(): List<Deferred<String>> {
    val random = Random(3)
    return List(12) { asyncString(random.nextInt(1000)) }
}
```

ここで、main関数はそれらの最初のものが完了するのを待機し、まだアクティブなDeferred値の数をカウントします。ここでは`select`式がKotlin DSLであるという事実を利用していることに注意してください。そのため、任意のコードを使用して句を提供できます。この場合、Deferred値のリストを反復処理して、各Deferred値に`onAwait`句を提供します。

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

Deferred文字列値のチャネルを消費し、受信した各Deferred値を待機しますが、次のDeferred値が来るかチャネルが閉じられるまでだけ待機するチャネルプロデューサー関数を記述しましょう。この例では、[onReceiveCatching][ReceiveChannel.onReceiveCatching]と[onAwait][Deferred.onAwait]句を同じ`select`内にまとめています。

```kotlin
fun CoroutineScope.switchMapDeferreds(input: ReceiveChannel<Deferred<String>>) = produce<String> {
    var current = input.receive() // 最初に受信したDeferred値から開始
    while (isActive) { // キャンセルまたはクローズされていない間ループ
        val next = select<Deferred<String>?> { // このselectから次のDeferred値を返すか、nullを返す
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
            break // ループから抜ける
        } else {
            current = next
        }
    }
}
```

これをテストするために、指定された時間の後に指定された文字列に解決するシンプルな非同期関数を使用します。

```kotlin
fun CoroutineScope.asyncString(str: String, time: Long) = async {
    delay(time)
    str
}
```

main関数は、`switchMapDeferreds`の結果を出力するためにコルーチンを起動し、いくつかのテストデータをそれに送信します。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*
    
fun CoroutineScope.switchMapDeferreds(input: ReceiveChannel<Deferred<String>>) = produce<String> {
    var current = input.receive() // 最初に受信したDeferred値から開始
    while (isActive) { // キャンセルまたはクローズされていない間ループ
        val next = select<Deferred<String>?> { // このselectから次のDeferred値を返すか、nullを返す
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
            break // ループから抜ける
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
    val chan = Channel<Deferred<String>>() // テスト用のチャネル
    launch { // 出力コルーチンを起動
        for (s in switchMapDeferreds(chan)) 
            println(s) // 受信した各文字列を出力
    }
    chan.send(asyncString("BEGIN", 100))
    delay(200) // "BEGIN"が生成されるのに十分な時間
    chan.send(asyncString("Slow", 500))
    delay(100) // "Slow"を生成するのに十分な時間ではない
    chan.send(asyncString("Replace", 100))
    delay(500) // 最後のものより前に時間を与える
    chan.send(asyncString("END", 500))
    delay(1000) // 処理する時間を与える
    chan.close() // チャネルを閉じる... 
    delay(500) // そして終了するまでしばらく待つ
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-05.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-05.kt)で入手できます。
>
{style="note"}

このコードの結果は次のとおりです。

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