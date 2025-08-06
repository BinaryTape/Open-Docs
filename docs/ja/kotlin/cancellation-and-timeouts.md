<!--- TEST_NAME CancellationGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: キャンセルとタイムアウト)

このセクションでは、コルーチンのキャンセルとタイムアウトについて説明します。

## コルーチンの実行をキャンセルする

長時間実行されるアプリケーションでは、バックグラウンドコルーチンをきめ細かく制御する必要がある場合があります。
たとえば、ユーザーがコルーチンを起動したページを閉じた場合、その結果はもはや不要となり、その操作をキャンセルできます。
[launch]関数は、実行中のコルーチンをキャンセルするために使用できる[Job]を返します。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        repeat(1000) { i ->
            println("job: I'm sleeping $i ...")
            delay(500L)
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancel() // cancels the job
    job.join() // waits for job's completion 
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-01.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-01.kt)から入手できます。
>
{style="note"}

これは以下の出力を生成します。

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
```

<!--- TEST -->

`main`が`job.cancel`を呼び出すとすぐに、キャンセルされたため、他のコルーチンからの出力は表示されません。
また、[Job]の拡張関数[cancelAndJoin]があり、[cancel][Job.cancel]と[join][Job.join]の呼び出しを組み合わせます。

## キャンセルは協調的である

コルーチンのキャンセルは_協調的_です。コルーチンコードは、キャンセル可能であるために協調する必要があります。
`kotlinx.coroutines`内のすべてのサスペンド関数は_キャンセル可能_です。これらはコルーチンのキャンセルをチェックし、キャンセルされたときに[CancellationException]をスローします。しかし、コルーチンが計算処理中にキャンセルのチェックを行わない場合、以下の例が示すように、キャンセルすることはできません。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        var nextPrintTime = startTime
        var i = 0
        while (i < 5) { // computation loop, just wastes CPU
            // print a message twice a second
            if (System.currentTimeMillis() >= nextPrintTime) {
                println("job: I'm sleeping ${i++} ...")
                nextPrintTime += 500L
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-02.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-02.kt)から入手できます。
>
{style="note"}

これを実行すると、キャンセル後もジョブが5回の繰り返し後に自己完了するまで「I'm sleeping」の出力が続くことがわかります。

<!--- TEST 
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm sleeping 3 ...
job: I'm sleeping 4 ...
main: Now I can quit.
-->

[CancellationException]をキャッチして再スローしないことでも、同様の問題が観察されます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch(Dispatchers.Default) {
        repeat(5) { i ->
            try {
                // print a message twice a second
                println("job: I'm sleeping $i ...")
                delay(500)
            } catch (e: Exception) {
                // log the exception
                println(e)
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-03.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-03.kt)から入手できます。
>
{style="note"}

`Exception`をキャッチすることはアンチパターンですが、この問題は、[CancellationException]を再スローしない[`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html)関数の使用時など、より巧妙な方法で表面化する可能性があります。

## 計算コードをキャンセル可能にする

計算コードをキャンセル可能にするには、2つのアプローチがあります。
1つ目は、キャンセルをチェックするサスペンド関数を定期的に呼び出す方法です。
その目的には、[yield]および[ensureActive]関数が最適です。
もう1つは、[isActive]を使用してキャンセルのステータスを明示的にチェックする方法です。
後者のアプローチを試してみましょう。

前の例の`while (i < 5)`を`while (isActive)`に置き換えて、再度実行してください。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        var nextPrintTime = startTime
        var i = 0
        while (isActive) { // cancellable computation loop
            // prints a message twice a second
            if (System.currentTimeMillis() >= nextPrintTime) {
                println("job: I'm sleeping ${i++} ...")
                nextPrintTime += 500L
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-04.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-04.kt)から入手できます。
>
{style="note"}

ご覧のとおり、このループはキャンセルされます。[isActive]は、[CoroutineScope]オブジェクトを介してコルーチン内で利用可能な拡張プロパティです。

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
-->

## `finally`でリソースを閉じる

キャンセル可能なサスペンド関数は、キャンセル時に[CancellationException]をスローし、これは通常の方法で処理できます。
たとえば、コルーチンがキャンセルされた場合、`try {...} finally {...}`式とKotlinの[use](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io/use.html)関数は、その終了処理を通常どおり実行します。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job: I'm sleeping $i ...")
                delay(500L)
            }
        } finally {
            println("job: I'm running finally")
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-05.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-05.kt)から入手できます。
>
{style="note"}

[join][Job.join]と[cancelAndJoin]は両方とも、すべての終了処理が完了するのを待つため、上記の例は以下の出力を生成します。

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm running finally
main: Now I can quit.
```

<!--- TEST -->

## キャンセル不可ブロックの実行

前の例の`finally`ブロックでサスペンド関数を使用しようとすると、このコードを実行しているコルーチンがキャンセルされるため、[CancellationException]が発生します。通常、これは問題ではありません。なぜなら、適切に動作するすべてのクローズ操作（ファイルのクローズ、ジョブのキャンセル、あらゆる種類の通信チャネルのクローズなど）は通常ノンブロッキングであり、サスペンド関数を含まないためです。しかし、キャンセルされたコルーチン内でサスペンドする必要がある稀なケースでは、以下の例が示すように、[withContext]関数と[NonCancellable]コンテキストを使用して、対応するコードを`withContext(NonCancellable) {...}`で囲むことができます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job: I'm sleeping $i ...")
                delay(500L)
            }
        } finally {
            withContext(NonCancellable) {
                println("job: I'm running finally")
                delay(1000L)
                println("job: And I've just delayed for 1 sec because I'm non-cancellable")
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-06.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-06.kt)から入手できます。
>
{style="note"}

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm running finally
job: And I've just delayed for 1 sec because I'm non-cancellable
main: Now I can quit.
-->

## タイムアウト

コルーチンの実行をキャンセルする最も明白な実用的な理由は、その実行時間がタイムアウトを超過したためです。
対応する[Job]への参照を手動で追跡し、遅延後に追跡対象をキャンセルする別のコルーチンを起動することもできますが、それを実行するためのすぐに使える[withTimeout]関数があります。
以下の例を見てください。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    withTimeout(1300L) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500L)
        }
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-07.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-07.kt)から入手できます。
>
{style="note"}

これは以下の出力を生成します。

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Exception in thread "main" kotlinx.coroutines.TimeoutCancellationException: Timed out waiting for 1300 ms
```

<!--- TEST STARTS_WITH -->

[withTimeout]によってスローされる[TimeoutCancellationException]は、[CancellationException]のサブクラスです。
これまでそのスタックトレースがコンソールに表示されることはありませんでした。それは、キャンセルされたコルーチン内では`CancellationException`がコルーチン完了の通常の理由と見なされるためです。
しかし、この例では、`main`関数のすぐ内側で`withTimeout`を使用しました。

キャンセルは単なる例外であるため、すべてのリソースは通常の方法で閉じられます。
タイムアウト時に特定の追加アクションを実行する必要がある場合は、タイムアウトコードを`try {...} catch (e: TimeoutCancellationException) {...}`ブロックで囲むか、[withTimeout]に似ていますが例外をスローする代わりにタイムアウト時に`null`を返す[withTimeoutOrNull]関数を使用できます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val result = withTimeoutOrNull(1300L) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500L)
        }
        "Done" // will get cancelled before it produces this result
    }
    println("Result is $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-08.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-08.kt)から入手できます。
>
{style="note"}

このコードを実行しても、例外は発生しません。

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Result is null
```

<!--- TEST -->

## 非同期タイムアウトとリソース

[withTimeout]でのタイムアウトイベントは、そのブロック内で実行されているコードに対して非同期であり、タイムアウトブロックの内部から戻る直前であっても、いつでも発生する可能性があります。ブロック内でリソースを開いたり取得したりする場合で、そのリソースをブロックの外で閉じたり解放したりする必要がある場合は、この点に注意してください。

たとえば、ここでは`Resource`クラスを使用してクローズ可能なリソースを模倣します。このクラスは、`acquired`カウンターをインクリメントすることで作成された回数を追跡し、`close`関数でカウンターをデクリメントします。
ここで、多数のコルーチンを作成します。それぞれのコルーチンは、`withTimeout`ブロックの最後に`Resource`を作成し、ブロックの外でリソースを解放します。`withTimeout`ブロックが既に終了しているときにタイムアウトが発生する可能性が高まるように、わずかな遅延を追加します。これにより、リソースリークが発生します。

```kotlin
import kotlinx.coroutines.*

//sampleStart
var acquired = 0

class Resource {
    init { acquired++ } // Acquire the resource
    fun close() { acquired-- } // Release the resource
}

fun main() {
    runBlocking {
        repeat(10_000) { // Launch 10K coroutines
            launch { 
                val resource = withTimeout(60) { // Timeout of 60 ms
                    delay(50) // Delay for 50 ms
                    Resource() // Acquire a resource and return it from withTimeout block     
                }
                resource.close() // Release the resource
            }
        }
    }
    // Outside of runBlocking all coroutines have completed
    println(acquired) // Print the number of resources still acquired
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-09.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-09.kt)から入手できます。
>
{style="note"}

<!--- CLEAR -->

上記のコードを実行すると、常にゼロが出力されるわけではないことがわかります。ただし、これはお使いのマシンのタイミングに依存する可能性があります。非ゼロの値を実際に確認するには、この例のタイムアウトを調整する必要があるかもしれません。

> ここで10K個のコルーチンから`acquired`カウンターをインクリメントおよびデクリメントしても、`runBlocking`によって使用されるのと同じスレッドから常に発生するため、完全にスレッドセーフであることに注意してください。
> 詳細については、コルーチンコンテキストに関する章で説明します。
>
{style="note"}

この問題を回避するには、`withTimeout`ブロックからリソースを返すのではなく、変​​数にリソースへの参照を格納できます。

```kotlin
import kotlinx.coroutines.*

var acquired = 0

class Resource {
    init { acquired++ } // Acquire the resource
    fun close() { acquired-- } // Release the resource
}

fun main() {
//sampleStart
    runBlocking {
        repeat(10_000) { // Launch 10K coroutines
            launch { 
                var resource: Resource? = null // Not acquired yet
                try {
                    withTimeout(60) { // Timeout of 60 ms
                        delay(50) // Delay for 50 ms
                        resource = Resource() // Store a resource to the variable if acquired      
                    }
                    // We can do something else with the resource here
                } finally {  
                    resource?.close() // Release the resource if it was acquired
                }
            }
        }
    }
    // Outside of runBlocking all coroutines have completed
    println(acquired) // Print the number of resources still acquired
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-10.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-10.kt)から入手できます。
>
{style="note"}

この例は常にゼロを出力します。リソースはリークしません。

<!--- TEST 
0
-->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[cancelAndJoin]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[Job.join]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[CancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html
[yield]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html
[ensureActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html
[isActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[NonCancellable]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/index.html
[withTimeout]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout.html
[TimeoutCancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-timeout-cancellation-exception/index.html
[withTimeoutOrNull]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html

<!--- END -->