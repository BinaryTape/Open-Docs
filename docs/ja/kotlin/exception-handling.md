<!--- TEST_NAME ExceptionsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンの例外処理)

このセクションでは、例外処理と例外発生時のキャンセルについて説明します。
既に、キャンセルされたコルーチンはサスペンドポイントで[CancellationException]をスローし、それがコルーチン機構によって無視されることは知っています。ここでは、キャンセル中に例外がスローされた場合や、同じコルーチンの複数の子コルーチンが例外をスローした場合に何が起こるかを見ていきます。

## 例外の伝播

コルーチンビルダーには、例外を自動的に伝播する([launch])と、ユーザーに公開する([async]および[produce])の2種類があります。
これらのビルダーが他のコルーチンの_子_ではない_ルート_コルーチンを作成するために使用される場合、前者のビルダーはJavaの`Thread.uncaughtExceptionHandler`と同様に例外を**捕捉されない**例外として扱います。一方、後者は、例えば[await][Deferred.await]や[receive][ReceiveChannel.receive]を介して、ユーザーが最終的な例外を消費することに依存しています（[produce]と[receive][ReceiveChannel.channel]は[Channels](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/channels.md)セクションで説明されています）。

これは、[GlobalScope]を使用してルートコルーチンを作成する簡単な例で示すことができます。

> [GlobalScope]は、非自明な方法で裏目に出る可能性のあるデリケートなAPIです。アプリケーション全体のルートコルーチンを作成することは、`GlobalScope`の数少ない正当な使用例の1つであるため、`@OptIn(DelicateCoroutinesApi::class)`を使用して`GlobalScope`の使用を明示的にオプトインする必要があります。
>
{style="note"}

```kotlin
import kotlinx.coroutines.*

//sampleStart
@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val job = GlobalScope.launch { // root coroutine with launch
        println("Throwing exception from launch")
        throw IndexOutOfBoundsException() // Will be printed to the console by Thread.defaultUncaughtExceptionHandler
    }
    job.join()
    println("Joined failed job")
    val deferred = GlobalScope.async { // root coroutine with async
        println("Throwing exception from async")
        throw ArithmeticException() // Nothing is printed, relying on user to call await
    }
    try {
        deferred.await()
        println("Unreached")
    } catch (e: ArithmeticException) {
        println("Caught ArithmeticException")
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-01.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-01.kt)で入手できます。
>
{style="note"}

このコードの出力は（[debug](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/coroutine-context-and-dispatchers.md#debugging-coroutines-and-threads)有効時）：

```text
Throwing exception from launch
Exception in thread "DefaultDispatcher-worker-1 @coroutine#2" java.lang.IndexOutOfBoundsException
Joined failed job
Throwing exception from async
Caught ArithmeticException
```

<!--- TEST EXCEPTION-->

## CoroutineExceptionHandler

コンソールに**捕捉されない**例外を出力するデフォルトの動作をカスタマイズすることが可能です。
_ルート_コルーチン上の[CoroutineExceptionHandler]コンテキスト要素は、このルートコルーチンとそのすべての子コルーチンに対する汎用的な`catch`ブロックとして使用でき、カスタム例外処理を行うことができます。
これは[`Thread.uncaughtExceptionHandler`](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html#setUncaughtExceptionHandler-java.lang.Thread.UncaughtExceptionHandler-)に似ています。
`CoroutineExceptionHandler`内で例外から回復することはできません。ハンドラが呼び出された時点では、コルーチンは既に該当する例外で完了しています。通常、ハンドラは例外をログに記録したり、何らかのエラーメッセージを表示したり、アプリケーションを終了または再起動したりするために使用されます。

`CoroutineExceptionHandler`は、他のいかなる方法でも処理されなかった**捕捉されない**例外の場合にのみ呼び出されます。
特に、すべての_子_コルーチン（他の[Job]のコンテキストで作成されたコルーチン）は、その例外の処理を親コルーチンに委譲し、それがさらに親に委譲され、ルートに到達するまでこの委譲が続きます。そのため、子コルーチンのコンテキストにインストールされた`CoroutineExceptionHandler`は決して使用されません。
加えて、[async]ビルダーは常にすべての例外を捕捉し、その結果を[Deferred]オブジェクトで表現するため、`CoroutineExceptionHandler`も効果がありません。

> スーパービジョン (supervision) スコープで実行されるコルーチンは、親に例外を伝播せず、この規則から除外されます。このドキュメントのさらに後の[スーパービジョン](#supervision)セクションで詳細を説明します。
>
{style="note"}

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandler got $exception") 
    }
    val job = GlobalScope.launch(handler) { // root coroutine, running in GlobalScope
        throw AssertionError()
    }
    val deferred = GlobalScope.async(handler) { // also root, but async instead of launch
        throw ArithmeticException() // Nothing will be printed, relying on user to call deferred.await()
    }
    joinAll(job, deferred)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-02.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-02.kt)で入手できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
CoroutineExceptionHandler got java.lang.AssertionError
```

<!--- TEST-->

## キャンセルと例外

キャンセルは例外と密接に関連しています。コルーチンは内部的にキャンセルに`CancellationException`を使用します。これらの例外はすべてのハンドラによって無視されるため、`catch`ブロックで取得できる追加のデバッグ情報のソースとしてのみ使用されるべきです。
[Job.cancel]を使用してコルーチンがキャンセルされると、そのコルーチンは終了しますが、その親はキャンセルされません。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        val child = launch {
            try {
                delay(Long.MAX_VALUE)
            } finally {
                println("Child is cancelled")
            }
        }
        yield()
        println("Cancelling child")
        child.cancel()
        child.join()
        yield()
        println("Parent is not cancelled")
    }
    job.join()
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-03.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-03.kt)で入手できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
Cancelling child
Child is cancelled
Parent is not cancelled
```

<!--- TEST-->

コルーチンが`CancellationException`以外の例外に遭遇した場合、その例外によって親をキャンセルします。
この動作はオーバーライドできず、[構造化された並行処理 (structured concurrency)](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/composing-suspending-functions.md#structured-concurrency-with-async)のための安定したコルーチン階層を提供するために使用されます。
子コルーチンに対しては[CoroutineExceptionHandler]の実装は使用されません。

> これらの例では、[CoroutineExceptionHandler]は常に[GlobalScope]で作成されたコルーチンにインストールされています。
> メインの[runBlocking]のスコープで起動されたコルーチンに例外ハンドラをインストールすることは意味がありません。なぜなら、子コルーチンが例外で完了した場合、インストールされたハンドラに関わらず、メインコルーチンは常にキャンセルされるためです。
>
{style="note"}

元の例外は、すべての子コルーチンが終了したときにのみ親によって処理されます。これは以下の例で示されています。

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandler got $exception") 
    }
    val job = GlobalScope.launch(handler) {
        launch { // the first child
            try {
                delay(Long.MAX_VALUE)
            } finally {
                withContext(NonCancellable) {
                    println("Children are cancelled, but exception is not handled until all children terminate")
                    delay(100)
                    println("The first child finished its non cancellable block")
                }
            }
        }
        launch { // the second child
            delay(10)
            println("Second child throws an exception")
            throw ArithmeticException()
        }
    }
    job.join()
//sampleEnd 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-04.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-04.kt)で入手できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
Second child throws an exception
Children are cancelled, but exception is not handled until all children terminate
The first child finished its non cancellable block
CoroutineExceptionHandler got java.lang.ArithmeticException
```

<!--- TEST-->

## 例外の集約

コルーチンの複数の子コルーチンが例外で失敗した場合、
一般的なルールは「最初の例外が勝つ」であり、最初の例外が処理されます。
最初の例外の後に発生するすべての追加例外は、抑制された例外 (suppressed ones) として最初の例外に付加されます。

<!--- INCLUDE
import kotlinx.coroutines.exceptions.*
-->

```kotlin
import kotlinx.coroutines.*
import java.io.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception with suppressed ${exception.suppressed.contentToString()}")
    }
    val job = GlobalScope.launch(handler) {
        launch {
            try {
                delay(Long.MAX_VALUE) // it gets cancelled when another sibling fails with IOException
            } finally {
                throw ArithmeticException() // the second exception
            }
        }
        launch {
            delay(100)
            throw IOException() // the first exception
        }
        delay(Long.MAX_VALUE)
    }
    job.join()  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-05.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-05.kt)で入手できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
CoroutineExceptionHandler got java.io.IOException with suppressed [java.lang.ArithmeticException]
```

<!--- TEST-->

> このメカニズムは現在、Java 1.7+以降のバージョンでのみ機能することに注意してください。
> JSおよびNativeの制限は一時的なものであり、将来的には解除されます。
>
{style="note"}

キャンセル例外は透過的であり、デフォルトでアンラップされます。

```kotlin
import kotlinx.coroutines.*
import java.io.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception")
    }
    val job = GlobalScope.launch(handler) {
        val innerJob = launch { // all this stack of coroutines will get cancelled
            launch {
                launch {
                    throw IOException() // the original exception
                }
            }
        }
        try {
            innerJob.join()
        } catch (e: CancellationException) {
            println("Rethrowing CancellationException with original cause")
            throw e // cancellation exception is rethrown, yet the original IOException gets to the handler  
        }
    }
    job.join()
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-06.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-06.kt)で入手できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
Rethrowing CancellationException with original cause
CoroutineExceptionHandler got java.io.IOException
```

<!--- TEST-->

## スーパービジョン

これまでに学習したように、キャンセルはコルーチン階層全体に伝播する双方向の関係です。単方向のキャンセルが必要なケースを見てみましょう。

このような要件の良い例は、そのスコープ内でジョブが定義されているUIコンポーネントです。UIの子タスクのいずれかが失敗した場合でも、UIコンポーネント全体をキャンセル（実質的に強制終了）する必要は必ずしもありません。しかし、UIコンポーネントが破棄された（そしてそのジョブがキャンセルされた）場合、その結果はもはや必要なくなるため、すべての子ジョブをキャンセルする必要があります。

もう1つの例は、複数の子ジョブを生成し、その実行を_監視_し、失敗を追跡して失敗したジョブのみを再起動する必要があるサーバープロセスです。

### スーパーバイザージョブ

これらの目的には[SupervisorJob][SupervisorJob()]を使用できます。
これは通常の[Job][Job()]に似ていますが、キャンセルが下方向のみに伝播するという唯一の例外があります。これは以下の例で簡単に示すことができます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val supervisor = SupervisorJob()
    with(CoroutineScope(coroutineContext + supervisor)) {
        // launch the first child -- its exception is ignored for this example (don't do this in practice!)
        val firstChild = launch(CoroutineExceptionHandler { _, _ ->  }) {
            println("The first child is failing")
            throw AssertionError("The first child is cancelled")
        }
        // launch the second child
        val secondChild = launch {
            firstChild.join()
            // Cancellation of the first child is not propagated to the second child
            println("The first child is cancelled: ${firstChild.isCancelled}, but the second one is still active")
            try {
                delay(Long.MAX_VALUE)
            } finally {
                // But cancellation of the supervisor is propagated
                println("The second child is cancelled because the supervisor was cancelled")
            }
        }
        // wait until the first child fails & completes
        firstChild.join()
        println("Cancelling the supervisor")
        supervisor.cancel()
        secondChild.join()
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-01.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-01.kt)で入手できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
The first child is failing
The first child is cancelled: true, but the second one is still active
Cancelling the supervisor
The second child is cancelled because the supervisor was cancelled
```

<!--- TEST-->

### スーパービジョンスコープ

[coroutineScope][_coroutineScope]の代わりに、_スコープ付き_並行処理には[supervisorScope][_supervisorScope]を使用できます。これはキャンセルを一方方向にのみ伝播し、自身が失敗した場合にのみすべての子をキャンセルします。また、[coroutineScope][_coroutineScope]と同様に、完了するまですべての子を待ちます。

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    try {
        supervisorScope {
            val child = launch {
                try {
                    println("The child is sleeping")
                    delay(Long.MAX_VALUE)
                } finally {
                    println("The child is cancelled")
                }
            }
            // Give our child a chance to execute and print using yield 
            yield()
            println("Throwing an exception from the scope")
            throw AssertionError()
        }
    } catch(e: AssertionError) {
        println("Caught an assertion error")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-02.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-02.kt)で入手できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
The child is sleeping
Throwing an exception from the scope
The child is cancelled
Caught an assertion error
```

<!--- TEST-->

#### 監視下のコルーチンにおける例外

通常のジョブとスーパーバイザージョブのもう1つの重要な違いは、例外処理です。
すべての子コルーチンは、例外処理メカニズムを介して自身で例外を処理する必要があります。
この違いは、子コルーチンの失敗が親に伝播しないという事実から生じます。
これは、[supervisorScope][_supervisorScope]の内部で直接起動されたコルーチンが、ルートコルーチンと同様に、自身のスコープにインストールされた[CoroutineExceptionHandler]を_使用する_ことを意味します（詳細については、[CoroutineExceptionHandler](#coroutineexceptionhandler)セクションを参照してください）。

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandler got $exception") 
    }
    supervisorScope {
        val child = launch(handler) {
            println("The child throws an exception")
            throw AssertionError()
        }
        println("The scope is completing")
    }
    println("The scope is completed")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-03.kt -->
> 完全なコードは[こちら](https://github.2.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-03.kt)で入手できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
The scope is completing
The child throws an exception
CoroutineExceptionHandler got java.lang.AssertionError
The scope is completed
```

<!--- TEST-->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[CancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[Deferred.await]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html
[GlobalScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[CoroutineExceptionHandler]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/index.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Deferred]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/index.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[SupervisorJob()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-supervisor-job.html
[Job()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[_supervisorScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html

<!--- INDEX kotlinx.coroutines.channels -->

[produce]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/produce.html
[ReceiveChannel.receive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html

<!--- END -->