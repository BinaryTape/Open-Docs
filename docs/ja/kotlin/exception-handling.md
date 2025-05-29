<!--- TEST_NAME ExceptionsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンの例外処理)

このセクションでは、例外処理と例外発生時のキャンセルについて説明します。
すでに、キャンセルされたコルーチンはサスペンションポイントで`CancellationException`をスローし、それがコルーチン機構によって無視されることを知っています。ここでは、キャンセル中に例外がスローされた場合、または同じコルーチンの複数の子コルーチンが例外をスローした場合に何が起こるかを見ていきます。

## 例外の伝播

コルーチンビルダーには2つの種類があります。例外を自動的に伝播するもの（`launch`）と、ユーザーに公開するもの（`async`および`produce`）です。
これらのビルダーが、他のコルーチンの*子*ではない*ルート*コルーチンを作成するために使用される場合、前者のビルダーは、Javaの`Thread.uncaughtExceptionHandler`と同様に、例外を**捕捉されない（uncaught）**例外として扱います。一方、後者のビルダーは、ユーザーが最終的な例外を消費することに依存しており、例えば`await`（`Deferred.await`）や`receive`（`ReceiveChannel.receive`）を介して行われます（`produce`と`receive`（`ReceiveChannel.receive`）については、[Channels](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/channels.md)セクションで説明されています）。

これは、`GlobalScope`を使用してルートコルーチンを作成する簡単な例で示されます。

> `GlobalScope`は、非自明な方法で裏目に出る可能性があるデリケートなAPIです。アプリケーション全体のルートコルーチンを作成することは、`GlobalScope`の数少ない正当な使用例の1つであるため、`@OptIn(DelicateCoroutinesApi::class)`を使用して`GlobalScope`の使用を明示的にオプトインする必要があります。
>
{style="note"}

```kotlin
import kotlinx.coroutines.*

//sampleStart
@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val job = GlobalScope.launch { // root coroutine with launch
        println("launchから例外をスローしています")
        throw IndexOutOfBoundsException() // Will be printed to the console by Thread.defaultUncaughtExceptionHandler
    }
    job.join()
    println("失敗したジョブに参加しました")
    val deferred = GlobalScope.async { // root coroutine with async
        println("asyncから例外をスローしています")
        throw ArithmeticException() // Nothing is printed, relying on user to call await
    }
    try {
        deferred.await()
        println("到達しませんでした")
    } catch (e: ArithmeticException) {
        println("ArithmeticExceptionを捕捉しました")
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-01.kt)で確認できます。
>
{style="note"}

このコードの出力は次のとおりです（[デバッグ](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/coroutine-context-and-dispatchers.md#debugging-coroutines-and-threads)付き）：

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
_ルート_コルーチンの`CoroutineExceptionHandler`コンテキスト要素は、このルートコルーチンとそのすべての子コルーチンに対する汎用的な`catch`ブロックとして使用でき、カスタム例外処理を行うことができます。
これは[`Thread.uncaughtExceptionHandler`](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html#setUncaughtExceptionHandler-java.lang.Thread.UncaughtExceptionHandler-)に似ています。
`CoroutineExceptionHandler`内で例外から回復することはできません。ハンドラが呼び出された時点では、コルーチンはすでに該当する例外で完了しています。通常、ハンドラは例外のログ記録、何らかのエラーメッセージの表示、アプリケーションの終了、および/または再起動のために使用されます。

`CoroutineExceptionHandler`は、**捕捉されない**例外、つまり他の方法で処理されなかった例外に対してのみ呼び出されます。
特に、すべての子コルーチン（別の`Job`のコンテキストで作成されたコルーチン）は、例外の処理を親コルーチンに委譲し、それがさらに親に委譲され、ルートに到達するまでそれが繰り返されます。そのため、それらのコンテキストにインストールされた`CoroutineExceptionHandler`が使用されることはありません。
さらに、`async`ビルダーは常にすべての例外を捕捉し、結果の`Deferred`オブジェクトにそれらを表すため、その`CoroutineExceptionHandler`も効果がありません。

> スーパービジョン**スコープ**で実行されるコルーチンは、例外を親に伝播せず、このルールから除外されます。詳細については、このドキュメントのさらに後の[スーパービジョン](#supervision)セクションを参照してください。
>
{style="note"}

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandlerが$exceptionを捕捉しました") 
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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-02.kt)で確認できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
CoroutineExceptionHandler got java.lang.AssertionError
```

<!--- TEST-->

## キャンセルと例外

キャンセルは例外と密接に関連しています。コルーチンは内部的に`CancellationException`をキャンセルに使用します。これらの例外はすべてのハンドラによって無視されるため、追加のデバッグ情報のソースとしてのみ使用されるべきであり、`catch`ブロックで取得できます。
`Job.cancel`を使用してコルーチンがキャンセルされると、コルーチンは終了しますが、その親はキャンセルされません。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        val child = launch {
            try {
                delay(Long.MAX_VALUE)
            } finally {
                println("子がキャンセルされました")
            }
        }
        yield()
        println("子をキャンセルしています")
        child.cancel()
        child.join()
        yield()
        println("親はキャンセルされません")
    }
    job.join()
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-03.kt)で確認できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
Cancelling child
Child is cancelled
Parent is not cancelled
```

<!--- TEST-->

コルーチンが`CancellationException`以外の例外に遭遇した場合、その例外で親をキャンセルします。
この動作はオーバーライドできず、[構造化された並行処理](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/composing-suspending-functions.md#structured-concurrency-with-async)のための安定したコルーチン階層を提供するために使用されます。
`CoroutineExceptionHandler`の実装は、子コルーチンでは使用されません。

> これらの例では、`CoroutineExceptionHandler`は常に`GlobalScope`で作成されたコルーチンにインストールされます。メインの`runBlocking`のスコープで起動されたコルーチンに例外ハンドラをインストールしても意味がありません。なぜなら、子コルーチンが例外で完了すると、インストールされたハンドラに関わらずメインコルーチンは常にキャンセルされるためです。
>
{style="note"}

元の例外は、すべての子が終了したときにのみ親によって処理されます。これは次の例で示されています。

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandlerが$exceptionを捕捉しました") 
    }
    val job = GlobalScope.launch(handler) {
        launch { // the first child
            try {
                delay(Long.MAX_VALUE)
            } finally {
                withContext(NonCancellable) {
                    println("子がキャンセルされましたが、すべての子が終了するまで例外は処理されません")
                    delay(100)
                    println("最初の子は非キャンセル可能ブロックを終了しました")
                }
            }
        }
        launch { // the second child
            delay(10)
            println("2番目の子が例外をスローします")
            throw ArithmeticException()
        }
    }
    job.join()
//sampleEnd 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-04.kt)で確認できます。
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

コルーチンの複数の子が例外で失敗した場合、一般的なルールは「最初の例外が勝つ」というもので、最初の例外が処理されます。
最初の例外の後に発生した追加の例外はすべて、抑制されたものとして最初の例外にアタッチされます。

<!--- INCLUDE
import kotlinx.coroutines.exceptions.*
-->

```kotlin
import kotlinx.coroutines.*
import java.io.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandlerが抑制された${exception.suppressed.contentToString()}と共に$exceptionを捕捉しました")
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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-05.kt)で確認できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
CoroutineExceptionHandler got java.io.IOException with suppressed [java.lang.ArithmeticException]
```

<!--- TEST-->

> なお、このメカニズムは現在、Java 1.7+バージョンでのみ動作します。
> JSおよびNativeの制限は一時的なものであり、将来的に解除される予定です。
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
        println("CoroutineExceptionHandlerが$exceptionを捕捉しました")
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
            println("元の原因と共にCancellationExceptionを再スローしています")
            throw e // cancellation exception is rethrown, yet the original IOException gets to the handler  
        }
    }
    job.join()
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-06.kt)で確認できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
Rethrowing CancellationException with original cause
CoroutineExceptionHandler got java.io.IOException
```

<!--- TEST-->

## スーパービジョン

以前に学習したように、キャンセルはコルーチンの階層全体に伝播する双方向の関係です。ここでは、単方向のキャンセルが必要なケースを見てみましょう。

このような要件の良い例は、そのスコープ内でジョブが定義されているUIコンポーネントです。UIの子タスクのいずれかが失敗した場合、必ずしもUIコンポーネント全体をキャンセル（実質的に強制終了）する必要はありませんが、UIコンポーネントが破棄された場合（およびそのジョブがキャンセルされた場合）、その結果はもはや必要ないため、すべての子ジョブをキャンセルする必要があります。

もう1つの例は、複数の子ジョブを生成し、それらの実行を_監視_し、失敗を追跡して、失敗したジョブのみを再起動する必要があるサーバープロセスです。

### スーパービジョンジョブ

これらの目的には、`SupervisorJob`（`SupervisorJob()`）を使用できます。
これは通常の`Job`（`Job()`）に似ていますが、キャンセルが下方向にのみ伝播するという唯一の例外があります。これは次の例で簡単に示すことができます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val supervisor = SupervisorJob()
    with(CoroutineScope(coroutineContext + supervisor)) {
        // launch the first child -- its exception is ignored for this example (don't do this in practice!)
        val firstChild = launch(CoroutineExceptionHandler { _, _ ->  }) {
            println("最初の子は失敗しています")
            throw AssertionError("最初の子はキャンセルされました")
        }
        // launch the second child
        val secondChild = launch {
            firstChild.join()
            // Cancellation of the first child is not propagated to the second child
            println("最初の子はキャンセルされました: ${firstChild.isCancelled}、しかし2番目の子はまだアクティブです")
            try {
                delay(Long.MAX_VALUE)
            } finally {
                // But cancellation of the supervisor is propagated
                println("スーパーバイザーがキャンセルされたため、2番目の子もキャンセルされました")
            }
        }
        // wait until the first child fails & completes
        firstChild.join()
        println("スーパーバイザーをキャンセルしています")
        supervisor.cancel()
        secondChild.join()
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-01.kt)で確認できます。
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

`coroutineScope`の代わりに、_スコープ付き_の並行処理には`supervisorScope`を使用できます。これはキャンセルを一方向にのみ伝播し、自身が失敗した場合にのみすべての子をキャンセルします。
また、`coroutineScope`と同様に、完了する前にすべての子を待ちます。

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    try {
        supervisorScope {
            val child = launch {
                try {
                    println("子はスリープしています")
                    delay(Long.MAX_VALUE)
                } finally {
                    println("子はキャンセルされました")
                }
            }
            // Give our child a chance to execute and print using yield 
            yield()
            println("スコープから例外をスローしています")
            throw AssertionError()
        }
    } catch(e: AssertionError) {
        println("アサーションエラーを捕捉しました")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-02.kt)で確認できます。
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

#### スーパーバイズされたコルーチンにおける例外

通常のジョブとスーパーバイザージョブのもう一つの重要な違いは、例外処理です。
すべての子は、例外処理メカニズムを介して自身で例外を処理する必要があります。
この違いは、子の失敗が親に伝播しないという事実から生じます。
これは、`supervisorScope`内で直接起動されたコルーチンは、ルートコルーチンと同様に、そのスコープにインストールされた`CoroutineExceptionHandler`を_使用する_ことを意味します（詳細については、[CoroutineExceptionHandler](#coroutineexceptionhandler)セクションを参照してください）。

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandlerが$exceptionを捕捉しました") 
    }
    supervisorScope {
        val child = launch(handler) {
            println("子が例外をスローします")
            throw AssertionError()
        }
        println("スコープが完了しています")
    }
    println("スコープが完了しました")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-03.kt)で確認できます。
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