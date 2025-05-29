<!--- TEST_NAME CancellationGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: キャンセルとタイムアウト)

このセクションでは、コルーチンのキャンセルとタイムアウトについて説明します。

## コルーチン実行のキャンセル

長時間実行されるアプリケーションでは、バックグラウンドコルーチンをきめ細かく制御する必要がある場合があります。
たとえば、ユーザーがコルーチンを起動したページを閉じると、その結果は不要になり、その操作をキャンセルできます。
`launch`関数は、実行中のコルーチンをキャンセルするために使用できる`Job`を返します。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-01.kt)から取得できます。
>
{style="note"}

次の出力が生成されます。

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
```

<!--- TEST -->

`main`が`job.cancel`を呼び出すとすぐに、他のコルーチンからは何も出力されなくなります。これは、そのコルーチンがキャンセルされたためです。
また、`cancel`と`join`の呼び出しを組み合わせる`cancelAndJoin`という`Job`の拡張関数もあります。

## キャンセルは協調的

コルーチンのキャンセルは_協調的_です。コルーチンコードはキャンセル可能であるために協調する必要があります。
`kotlinx.coroutines`のすべてのサスペンド関数は_キャンセル可能_です。それらはコルーチンのキャンセルをチェックし、キャンセルされたときに`CancellationException`をスローします。
ただし、コルーチンが計算処理中にキャンセルのチェックを行わない場合、次の例に示すように、キャンセルすることはできません。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-02.kt)から取得できます。
>
{style="note"}

実行すると、キャンセルされた後でも、ジョブが5回のイテレーションを終えて自己完了するまで、「I'm sleeping」と表示され続けることがわかります。

<!--- TEST 
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm sleeping 3 ...
job: I'm sleeping 4 ...
main: Now I can quit.
-->

同様の問題は、`CancellationException`をキャッチし、それを再スローしないことによっても観察できます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-03.kt)から取得できます。
>
{style="note"}

`Exception`をキャッチすることはアンチパターンですが、この問題は、`CancellationException`を再スローしない[`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html)関数を使用する場合など、より巧妙な方法で表面化する可能性があります。

## 計算コードをキャンセル可能にする

計算コードをキャンセル可能にするには、2つのアプローチがあります。
1つ目は、キャンセルをチェックするサスペンド関数を定期的に呼び出す方法です。
その目的には、`yield`関数と`ensureActive`関数が非常に適しています。
もう1つは、`isActive`を使用してキャンセルの状態を明示的にチェックする方法です。
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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-04.kt)から取得できます。
>
{style="note"}

ご覧のとおり、このループはキャンセルされます。`isActive`は、`CoroutineScope`オブジェクトを介してコルーチンの内部で利用できる拡張プロパティです。

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
-->

## finallyによるリソースのクローズ

キャンセル可能なサスペンド関数は、キャンセル時に`CancellationException`をスローし、これは通常の方法で処理できます。
たとえば、`try {...} finally {...}`式とKotlinの[`use`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io/use.html)関数は、コルーチンがキャンセルされたときに、そのファイナライゼーションアクションを正常に実行します。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-05.kt)から取得できます。
>
{style="note"}

`join`と`cancelAndJoin`はどちらもすべてのファイナライゼーションアクションの完了を待機するため、上記の例では次の出力が生成されます。

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm running finally
main: Now I can quit.
```

<!--- TEST -->

## キャンセル不可なブロックの実行

前の例の`finally`ブロックでサスペンド関数を使用しようとすると、このコードを実行しているコルーチンがキャンセルされているため、`CancellationException`が発生します。通常、これは問題になりません。なぜなら、適切に動作するクローズ操作（ファイルのクローズ、ジョブのキャンセル、あらゆる種類の通信チャネルのクローズなど）は通常ノンブロッキングであり、サスペンド関数を伴わないためです。ただし、キャンセルされたコルーチンでサスペンドする必要があるまれなケースでは、次の例に示すように、`withContext`関数と`NonCancellable`コンテキストを使用して、対応するコードを`withContext(NonCancellable) {...}`でラップできます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-06.kt)から取得できます。
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

コルーチンの実行をキャンセルする最も明白で実用的な理由は、その実行時間がタイムアウトを超過したためです。
対応する`Job`への参照を手動で追跡し、遅延後に追跡対象をキャンセルする別のコルーチンを起動することもできますが、それを実行するすぐに使える`withTimeout`関数があります。
次の例を見てください。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-07.kt)から取得できます。
>
{style="note"}

次の出力が生成されます。

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Exception in thread "main" kotlinx.coroutines.TimeoutCancellationException: Timed out waiting for 1300 ms
```

<!--- TEST STARTS_WITH -->

`withTimeout`によってスローされる`TimeoutCancellationException`は、`CancellationException`のサブクラスです。
これまで、そのスタックトレースがコンソールに表示されるのを見たことはありませんでした。
これは、キャンセルされたコルーチン内では`CancellationException`がコルーチンの完了の正常な理由と見なされるためです。
しかし、この例では`main`関数の内部で`withTimeout`を直接使用しています。

キャンセルは単なる例外であるため、すべてのリソースは通常の方法でクローズされます。
タイムアウト時に特定のアクションを実行する必要がある場合は、タイムアウトするコードを`try {...} catch (e: TimeoutCancellationException) {...}`ブロックでラップするか、`withTimeout`と似ていますが例外をスローする代わりにタイムアウト時に`null`を返す`withTimeoutOrNull`関数を使用できます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-08.kt)から取得できます。
>
{style="note"}

このコードを実行しても、例外は発生しなくなります。

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Result is null
```

<!--- TEST -->

## 非同期タイムアウトとリソース

<!-- 
  NOTE: Don't change this section name. It is being referenced to from within KDoc of withTimeout functions.
-->

`withTimeout`におけるタイムアウトイベントは、そのブロック内で実行されているコードに対して非同期であり、タイムアウトブロックの内部から戻る直前であっても、いつでも発生する可能性があります。
ブロック内で開いたり取得したりしたリソースをブロック外でクローズまたは解放する必要がある場合、この点に留意してください。

たとえば、ここでは`Resource`クラスを使用して、クローズ可能なリソースを模倣します。このクラスは、`acquired`カウンターをインクリメントすることで作成された回数を追跡し、`close`関数でカウンターをデクリメントします。
ここで、多数のコルーチンを作成してみましょう。それぞれのコルーチンは、`withTimeout`ブロックの最後に`Resource`を作成し、ブロック外でリソースを解放します。
タイムアウトが`withTimeout`ブロックが完了した直後に発生しやすくなるように小さな遅延を追加します。これにより、リソースリークが発生します。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-09.kt)から取得できます。
>
{style="note"}

<!--- CLEAR -->

上記のコードを実行すると、常にゼロが出力されるわけではないことがわかります。これは、お使いのマシンのタイミングに依存する場合があります。実際にゼロ以外の値を確認するには、この例のタイムアウトを調整する必要があるかもしれません。

> ここで1万個のコルーチンから`acquired`カウンターを増減させることは、`runBlocking`が使用する同じスレッドから常に発生するため、完全にスレッドセーフであることに注意してください。
> これについては、コルーチンコンテキストの章でさらに詳しく説明します。
> 
{style="note"}

この問題を回避するには、`withTimeout`ブロックからリソースを返すのではなく、変数にリソースへの参照を格納することができます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-10.kt)から取得できます。
>
{style="note"}

この例では常にゼロが出力されます。リソースはリークしません。

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