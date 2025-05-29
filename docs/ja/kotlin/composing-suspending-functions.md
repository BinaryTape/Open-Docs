<!--- TEST_NAME ComposingGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: サスペンド関数の構成)

このセクションでは、サスペンド関数のさまざまな構成アプローチについて説明します。

## デフォルトでは逐次的

どこかで定義された、リモートサービス呼び出しや計算のような何らかの有用な処理を行う2つのサスペンド関数があると仮定します。それらが有用であると仮定しますが、この例の目的のため、実際にはそれぞれが1秒間遅延するだけです。

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

まず`doSomethingUsefulOne`を呼び出し、_次に_`doSomethingUsefulTwo`を呼び出して、それらの結果の合計を計算する必要がある場合、どうすればよいでしょうか？実際には、最初の関数の結果を使って、2番目の関数を呼び出す必要があるかどうか、またはどのように呼び出すかを決定する場合にこれを行います。

コルーチン内のコードは、通常のコードと同様に、デフォルトで_逐次的_であるため、通常の逐次的呼び出しを使用します。次の例では、両方のサスペンド関数の実行にかかる合計時間を測定することで、それを示します。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-01.kt)から入手できます。
>
{style="note"}

以下のような結果が出力されます。

```text
The answer is 42
Completed in 2017 ms
```

<!--- TEST ARBITRARY_TIME -->

## async を使った並行処理

`doSomethingUsefulOne`と`doSomethingUsefulTwo`の呼び出し間に依存関係がなく、両方を_並行して_実行することで、より速く結果を得たい場合はどうでしょうか？ここで [async] が役立ちます。

概念的に、[async] は [launch] と同じです。それは、他のすべてのコルーチンと並行して動作する軽量なスレッドである独立したコルーチンを開始します。違いは、`launch` が [Job] を返し、結果値を保持しないのに対し、`async` は [Deferred] (後で結果を提供するという約束を表す軽量なノンブロッキングフューチャー) を返す点です。遅延値に対して `.await()` を使用してその最終的な結果を取得できますが、`Deferred` は [Job] でもあるため、必要に応じてキャンセルできます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-02.kt)から入手できます。
>
{style="note"}

以下のような結果が出力されます。

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

これは2つのコルーチンが並行して実行されるため、2倍高速です。コルーチンでの並行処理は常に明示的であることに注意してください。

## 遅延開始の async

オプションとして、[async] は `start` パラメータを [CoroutineStart.LAZY] に設定することで遅延実行にできます。このモードでは、コルーチンはその結果が [await][Deferred.await] によって要求された場合、またはその `Job` の [start][Job.start] 関数が呼び出された場合にのみ開始されます。次の例を実行してください。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-03.kt)から入手できます。
>
{style="note"}

以下のような結果が出力されます。

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

つまり、ここでは2つのコルーチンが定義されていますが、前の例のように実行されるわけではありません。代わりに、[start][Job.start] を呼び出すことで、いつ実行を開始するかはプログラマーに制御が委ねられます。まず `one` を開始し、次に `two` を開始し、個々のコルーチンが完了するのを待ちます。

なお、個々のコルーチンで最初に [start][Job.start] を呼び出さずに `println` で [await][Deferred.await] を呼び出しただけでは、[await][Deferred.await] がコルーチンの実行を開始し、その完了を待つため、逐次的な動作になります。これは遅延実行の意図されたユースケースではありません。`async(start = CoroutineStart.LAZY)` のユースケースは、値の計算にサスペンド関数が関わる場合における標準の [lazy](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/lazy.html) 関数の代替です。

## Asyncスタイルの関数

> このasync関数を用いたプログラミングスタイルは、他のプログラミング言語で人気のあるスタイルであるため、ここでは説明のためだけに提供されています。以下の理由により、Kotlinコルーチンでこのスタイルを使用することは**強く推奨されません**。
>
{style="note"}

構造化された並行処理からオプトアウトするために [GlobalScope] を参照し、[async] コルーチンビルダーを使用して `doSomethingUsefulOne` と `doSomethingUsefulTwo` を_非同期に_呼び出す asyncスタイルの関数を定義できます。これらの関数は、非同期計算を開始するだけであり、結果を取得するためには、生成された遅延値を使用する必要があるという事実を強調するために、「...Async」のサフィックスを付けて命名します。

> [GlobalScope] は非自明な方法で裏目に出る可能性があるデリケートなAPIであり、そのうちの1つは以下で説明されます。そのため、`@OptIn(DelicateCoroutinesApi::class)` を使って `GlobalScope` の使用を明示的にオプトインする必要があります。
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

これらの `xxxAsync` 関数は_サスペンド_関数では**ありません**。これらはどこからでも使用できます。しかし、これらを使用すると、常に呼び出し元のコードと並行して（ここでいう_並行_とは、非同期的な）アクションが実行されることになります。

次の例は、コルーチンの外での使用を示しています。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-04.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
The answer is 42
Completed in 1085 ms
-->

`val one = somethingUsefulOneAsync()` の行と `one.await()` 式の間にコードに論理エラーがあり、プログラムが例外をスローして、プログラムが実行していた操作が中断された場合に何が起こるか考えてみましょう。通常、グローバルなエラーハンドラはこの例外を捕捉し、開発者向けにエラーをログに記録して報告できますが、プログラムはそれ以外の操作を続行できます。しかし、ここでは`somethingUsefulOneAsync`が、それを開始した操作が中断されたにもかかわらず、バックグラウンドでまだ実行されています。この問題は、以下のセクションで示すように、構造化された並行処理では発生しません。

## async を使った構造化された並行処理

[async を使った並行処理](#concurrent-using-async) の例を、`doSomethingUsefulOne` と `doSomethingUsefulTwo` を並行して実行し、それらの結合された結果を返す関数にリファクタリングしてみましょう。[async] は [CoroutineScope] の拡張であるため、必要なスコープを提供するために [coroutineScope][_coroutineScope] 関数を使用します。

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```

このようにして、`concurrentSum` 関数のコード内で何らかの問題が発生し、例外がスローされた場合、そのスコープで起動されたすべてのコルーチンはキャンセルされます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-05.kt)から入手できます。
>
{style="note"}

上記の `main` 関数の出力から明らかなように、両方の操作は依然として並行して実行されます。

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

キャンセルは常にコルーチン階層を通じて伝播されます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-06.kt)から入手できます。
>
{style="note"}

最初の `async` と待機中の親の両方が、いずれかの子（具体的には `two`）の失敗によってキャンセルされることに注目してください。
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