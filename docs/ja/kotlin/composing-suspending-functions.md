<!--- TEST_NAME ComposingGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: サスペンド関数の構成)

このセクションでは、サスペンド関数のさまざまな構成方法について説明します。

## デフォルトで順次実行

リモートサービス呼び出しや計算のような有用な処理を行う2つのサスペンド関数が、別の場所で定義されていると仮定しましょう。ここではそれらが有用であると仮定しますが、実際にはこの例のためにそれぞれが1秒間遅延するだけです。

```kotlin
suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```

もしこれらを_順次_呼び出す必要がある場合 — つまり、まず`doSomethingUsefulOne`を呼び出し、_次に_`doSomethingUsefulTwo`を呼び出し、その結果の合計を計算する場合、どうすればよいでしょうか？実際には、最初の関数の結果を使用して、2番目の関数を呼び出す必要があるか、あるいはどのように呼び出すかを決定する場合に、この方法を使用します。

コルーチン内のコードは、通常のコードと同様に、デフォルトで_順次_実行されるため、通常の順次呼び出しを使用します。次の例では、両方のサスペンド関数の実行にかかる合計時間を測定することで、これを実演します。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = doSomethingUsefulOne()
        val two = doSomethingUsefulTwo()
        println("The answer is ${one + two}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-01.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-01.kt)で入手できます。
>
{style="note"}

これは次のような出力を生成します:

```text
The answer is 42
Completed in 2017 ms
```

<!--- TEST ARBITRARY_TIME -->

## asyncを使った並行処理

もし`doSomethingUsefulOne`と`doSomethingUsefulTwo`の呼び出し間に依存関係がなく、両方を_並行して_実行することで、より早く答えを得たい場合はどうでしょうか？ここで[async]が役に立ちます。
 
概念的には、[async]は[launch]と同じです。これは、他のすべてのコルーチンと並行して動作する軽量スレッドである、個別のコルーチンを開始します。違いは、`launch`が[Job]を返し、結果値を持ちませんが、`async`は[Deferred] — 後で結果を提供することを約束する軽量な非ブロッキングのFuture（フューチャー） — を返すことです。deferred値に対して`.await()`を使用すると、最終的な結果を取得できますが、`Deferred`も`Job`なので、必要に応じてキャンセルできます。

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = async { doSomethingUsefulOne() }
        val two = async { doSomethingUsefulTwo() }
        println("The answer is ${one.await() + two.await()}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-02.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-02.kt)で入手できます。
>
{style="note"}

これは次のような出力を生成します:

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

2つのコルーチンが並行して実行されるため、これは2倍高速です。コルーチンにおける並行処理は常に明示的であることに注意してください。

## 遅延開始のasync

オプションとして、[async]の`start`パラメータを[CoroutineStart.LAZY]に設定することで、遅延実行にできます。このモードでは、[await][Deferred.await]によって結果が必要とされたとき、またはその`Job`の[start][Job.start]関数が呼び出されたときにのみコルーチンが開始されます。次の例を実行してください。

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = async(start = CoroutineStart.LAZY) { doSomethingUsefulOne() }
        val two = async(start = CoroutineStart.LAZY) { doSomethingUsefulTwo() }
        // some computation
        one.start() // start the first one
        two.start() // start the second one
        println("The answer is ${one.await() + two.await()}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-03.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-03.kt)で入手できます。
>
{style="note"}

これは次のような出力を生成します:

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

このように、ここでは2つのコルーチンが定義されていますが、前の例のようにすぐに実行されるわけではなく、[start][Job.start]を呼び出すことで、いつ正確に実行を開始するかをプログラマが制御できます。まず`one`を開始し、次に`two`を開始し、その後個々のコルーチンが終了するのを待機します。

個々のコルーチンで最初に[start][Job.start]を呼び出さずに`println`で[await][Deferred.await]を呼び出すだけの場合、[await][Deferred.await]はコルーチンの実行を開始し、その完了を待機するため、これは順次的な振る舞いにつながることに注意してください。これは、遅延実行の意図されたユースケースではありません。`async(start = CoroutineStart.LAZY)`のユースケースは、値の計算にサスペンド関数が関与する場合において、標準の[lazy](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/lazy.html)関数の代替となります。

## asyncスタイルの関数

> このasync関数を使ったプログラミングスタイルは、他のプログラミング言語で一般的なスタイルであるため、ここでは例示のためだけに提供されています。Kotlinコルーチンでこのスタイルを使用することは、以下の理由により**強く推奨されません**。
>
{style="note"}

[async]コルーチンビルダーを使用し、構造化された並行処理をオプトアウトするために[GlobalScope]参照を使用することで、`doSomethingUsefulOne`と`doSomethingUsefulTwo`を_非同期に_呼び出すasyncスタイルの関数を定義できます。そのような関数には「...Async」というサフィックス（接尾辞）を付け、それらが非同期計算を開始するだけで、結果を得るには生成されたdeferred値を使用する必要があるという事実を強調します。

> [GlobalScope]は、些細ではない方法で裏目に出る可能性があるデリケートなAPIであり、そのうちの1つは以下で説明されます。そのため、`GlobalScope`を使用するには`@OptIn(DelicateCoroutinesApi::class)`で明示的にオプトインする必要があります。
>
{style="note"}

```kotlin
// The result type of somethingUsefulOneAsync is Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

// The result type of somethingUsefulTwoAsync is Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}
```

これらの`xxxAsync`関数は、_サスペンド_関数**ではない**ことに注意してください。これらはどこからでも使用できます。ただし、これらを使用すると、常に呼び出し元のコードとの非同期（ここでは_並行_を意味します）でのアクションの実行が伴います。

次の例は、コルーチンの外部でのそれらの使用方法を示しています:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

//sampleStart
// note that we don't have `runBlocking` to the right of `main` in this example
fun main() {
    val time = measureTimeMillis {
        // we can initiate async actions outside of a coroutine
        val one = somethingUsefulOneAsync()
        val two = somethingUsefulTwoAsync()
        // but waiting for a result must involve either suspending or blocking.
        // here we use `runBlocking { ... }` to block the main thread while waiting for the result
        runBlocking {
            println("The answer is ${one.await() + two.await()}")
        }
    }
    println("Completed in $time ms")
}
//sampleEnd

@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-04.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-04.kt)で入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
The answer is 42
Completed in 1085 ms
-->

もし`val one = somethingUsefulOneAsync()`の行と`one.await()`の式の間にコードに何らかの論理エラーがあり、プログラムが例外をスローし、プログラムによって実行されていた操作が中断された場合に何が起こるかを考えてみましょう。通常、グローバルなエラーハンドラーがこの例外をキャッチし、エラーを開発者向けにログに記録して報告できますが、プログラムは他の操作を続行できます。しかし、ここでは、`somethingUsefulOneAsync`を開始した操作が中断されたにもかかわらず、それがバックグラウンドでまだ実行されています。この問題は、以下のセクションで示すように、構造化された並行処理では発生しません。

## asyncを使った構造化された並行処理

[asyncを使った並行処理](#concurrent-using-async)の例を、`doSomethingUsefulOne`と`doSomethingUsefulTwo`を並行して実行し、それらの結合された結果を返す関数にリファクタリングしてみましょう。[async]は[CoroutineScope]の拡張であるため、必要なスコープを提供するために[coroutineScope][_coroutineScope]関数を使用します:

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```

このようにして、もし`concurrentSum`関数のコード内で何かがうまくいかず、例外がスローされた場合、そのスコープ内で起動されたすべてのコルーチンがキャンセルされます。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        println("The answer is ${concurrentSum()}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-05.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-05.kt)で入手できます。
>
{style="note"}

上記の`main`関数の出力から明らかなように、両方の操作は引き続き並行して実行されます:

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

キャンセルは常にコルーチン階層を通じて伝播されます:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
    try {
        failedConcurrentSum()
    } catch(e: ArithmeticException) {
        println("Computation failed with ArithmeticException")
    }
}

suspend fun failedConcurrentSum(): Int = coroutineScope {
    val one = async<Int> { 
        try {
            delay(Long.MAX_VALUE) // Emulates very long computation
            42
        } finally {
            println("First child was cancelled")
        }
    }
    val two = async<Int> { 
        println("Second child throws an exception")
        throw ArithmeticException()
    }
    one.await() + two.await()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-06.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-06.kt)で入手できます。
>
{style="note"}

子の1つ（つまり`two`）が失敗すると、最初の`async`と待機中の親の両方がキャンセルされることに注目してください:
```text
Second child throws an exception
First child was cancelled
Computation failed with ArithmeticException
```

<!--- TEST -->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Deferred]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/index.html
[CoroutineStart.LAZY]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-start/-l-a-z-y/index.html
[Deferred.await]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html
[Job.start]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/start.html
[GlobalScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html

<!--- END -->