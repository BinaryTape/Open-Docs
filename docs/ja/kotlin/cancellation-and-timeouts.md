<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: キャンセルとタイムアウト)

キャンセル（Cancellation）により、コルーチンが完了する前に停止させることができます。
これにより、ユーザーがウィンドウを閉じたり、コルーチンが実行中のままユーザーインターフェースで別の画面に移動したりした際など、不要になった作業を停止させることができます。
また、リソースを早期に解放したり、破棄されたオブジェクトにコルーチンがアクセスし続けるのを防いだりするためにも使用できます。

> キャンセルを使用すると、他のコルーチンが値を必要としなくなった後も値を生成し続けるような長時間実行されるコルーチン（例えば [パイプライン](channels.md#pipelines) など）を停止させることができます。
>
{style="tip"}

キャンセルは、コルーチンのライフサイクルとその親子関係を表す [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) ハンドルを通じて機能します。
`Job` を使用すると、コルーチンがアクティブかどうかを確認したり、[構造化された並行性（structured concurrency）](coroutines-basics.md#coroutine-scope-and-structured-concurrency) の定義に従って、そのコルーチン自身とすべての子コルーチンをキャンセルしたりできます。

## コルーチンのキャンセル

コルーチンは、その `Job` ハンドルに対して [`cancel()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html) 関数が呼び出されるとキャンセルされます。
[`.launch()`](coroutines-basics.md#coroutinescope-launch) などの [コルーチンビルダー関数](coroutines-basics.md#coroutine-builder-functions) は `Job` を返します。[`.async()`](coroutines-basics.md#coroutinescope-async) 関数は [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/) を返しますが、これは `Job` を実装しており、同じキャンセル動作をサポートしています。

`cancel()` 関数を手動で呼び出すこともできますし、親コルーチンがキャンセルされたときにキャンセルの伝播を通じて自動的に呼び出されることもあります。

コルーチンがキャンセルされると、次にキャンセルを確認したときに [`CancellationException`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/) をスローします。
これがいつ、どのように発生するかについての詳細は、[中断ポイントとキャンセル](#suspension-points-and-cancellation) を参照してください。

> [`awaitCancellation()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/await-cancellation.html) 関数を使用すると、キャンセルされるまでコルーチンを中断させることができます。
>
{style="tip"}

コルーチンを手動でキャンセルする方法の例を以下に示します：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // コルーチンが実行を開始したことを示すシグナルとして使用
        val job1Started = CompletableDeferred<Unit>()
        
        val job1: Job = launch {
            
            println("The coroutine has started")

            // CompletableDeferred を完了させ、
            // コルーチンが実行を開始したことを通知する
            job1Started.complete(Unit)
            try {
                // 無期限に中断
                // キャンセルがなければ、この呼び出しは戻ってこない
                delay(Duration.INFINITE)
            } catch (e: CancellationException) {
                println("The coroutine was canceled: $e")
              
                // キャンセル例外は常に再スローしてください！
                throw e
            }
            println("This line will never be executed")
        }
      
        // job1 が開始されるのを待ってからキャンセルする
        job1Started.await()

        // コルーチンをキャンセルするため、delay() は CancellationException をスローする
        job1.cancel()

        // async は Job を継承した Deferred ハンドルを返す
        val job2 = async {
            // コルーチンが実行を開始する前にキャンセルされた場合、
            // この行は出力されない可能性がある
            println("The second coroutine has started")

            try {
                // delay(Duration.INFINITE) と同等
                // このコルーチンがキャンセルされるまで中断する
                awaitCancellation()

            } catch (e: CancellationException) {
                println("The second coroutine was canceled")
                throw e
            }
        }
        job2.cancel()
    }
    // withContext() や coroutineScope() などのコルーチンビルダーは、
    // 子コルーチンがキャンセルされた場合でも、
    // すべての子コルーチンが完了するのを待機する
    println("All coroutines have completed")
}
//sampleEnd
```
{kotlin-runnable="true" id="manual-cancellation-example"}

この例では、コルーチンが実行を開始したシグナルとして [`CompletableDeferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-completable-deferred/) が使用されています。
コルーチンは実行開始時に `complete()` を呼び出し、`await()` はその `CompletableDeferred` が完了したときにのみ戻ります。これにより、コルーチンが確実に開始された後にのみキャンセルが行われます。
`.async()` で作成されたコルーチンにはこのチェックがないため、ブロック内のコードが実行される前にキャンセルされる可能性があります。

> `CancellationException` をキャッチすると、キャンセルの伝播が途切れる可能性があります。
> キャッチする必要がある場合は、コルーチン階層を通じてキャンセルが正しく伝播するように再スローしてください。
>
> 詳細については、[コルーチンの例外処理](exception-handling.md#cancellation-and-exceptions) を参照してください。
>
{style="warning"}

### キャンセルの伝播

[構造化された並行性（structured concurrency）](coroutines-basics.md#coroutine-scope-and-structured-concurrency) により、あるコルーチンをキャンセルすると、そのすべての子コルーチンもキャンセルされます。
これにより、親がすでに停止した後に子コルーチンが動作し続けるのを防ぎます。

例を以下に示します：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 子コルーチンが起動されたことを示すシグナルとして使用
        val childrenLaunched = CompletableDeferred<Unit>()

        // 2つの子コルーチンを起動
        val parentJob = launch {
            launch {
                println("Child coroutine 1 has started running")
                try {
                    awaitCancellation()
                } finally {
                    println("Child coroutine 1 has been canceled")
                }
            }
            launch {
                println("Child coroutine 2 has started running")
                try {
                    awaitCancellation()
                } finally {
                    println("Child coroutine 2 has been canceled")
                }
            }
            // CompletableDeferred を完了させ、
            // 子コルーチンが起動されたことを通知する
            childrenLaunched.complete(Unit)
        }
        // 親コルーチンがすべての子を起動したというシグナルを待つ
        childrenLaunched.await()

        // 親コルーチンをキャンセルすると、そのすべての子もキャンセルされる
        parentJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="cancellation-propagation-example"}

この例では、各子コルーチンが [`finally` ブロック](exceptions.md#the-finally-block) を使用しているため、コルーチンがキャンセルされたときにその中のコードが実行されます。
ここでは `CompletableDeferred` が子コルーチンの起動を通知していますが、それらが実際に実行を開始したことまでは保証しません。実行開始前にキャンセルされた場合、何も出力されません。

## コルーチンをキャンセルに反応させる {id="cancellation-is-cooperative"}

Kotlinにおいて、コルーチンのキャンセルは *協調的（cooperative）* です。
これは、コルーチンが [中断](#suspension-points-and-cancellation) するか、[明示的にキャンセルを確認](#check-for-cancellation-explicitly) することによって協力した場合にのみ、キャンセルに反応することを意味します。

このセクションでは、キャンセル可能なコルーチンを作成する方法を学びます。

### 中断ポイントとキャンセル

コルーチンがキャンセルされると、コード内の中断可能なポイント、つまり *中断ポイント（suspension point）* に到達するまで実行を継続します。
コルーチンがそこで中断する場合、中断関数は自身がキャンセルされているかどうかを確認します。
キャンセルされている場合、コルーチンは停止し `CancellationException` をスローします。

`suspend` 関数の呼び出しは中断ポイントですが、常に中断するとは限りません。
例えば、`Deferred` の結果を待機する場合、その `Deferred` がまだ完了していない場合にのみコルーチンは中断します。

以下は、中断を伴う一般的な中断関数を使用した例です。これによりコルーチンはキャンセル時に確認を行い、停止することができます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.channels.Channel
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJobs = listOf(
            launch {
                // キャンセルされるまで中断
                awaitCancellation()
            },
            launch {
                // キャンセルされるまで中断
                delay(Duration.INFINITE)
            },
            launch {
                val channel = Channel<Int>()
                // 送信されない値を待っている間中断する
                channel.receive()
            },
            launch {
                val deferred = CompletableDeferred<Int>()
                // 完了しない値を待っている間中断する
                deferred.await()
            },
            launch {
                val mutex = Mutex(locked = true)
                // 無期限にロックされたままのミューテックスを待っている間中断する
                mutex.lock()
            }
        )
        
        // 子コルーチンが開始し中断するまでの時間を与える
        delay(100.milliseconds)
        
        // すべての子コルーチンをキャンセルする
        childJobs.forEach { it.cancel() }
    }
    println("All child jobs completed!")
}
```
{kotlin-runnable="true" id="suspension-points-example"}

> `kotlinx.coroutines` ライブラリのすべての中断関数は、内部で [`suspendCancellableCoroutine()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/suspend-cancellable-coroutine.html) を使用しており、コルーチンの中断時にキャンセルを確認するため、キャンセルと協調します。
> 対照的に、[`suspendCoroutine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/suspend-coroutine.html) を使用するカスタム中断関数は、キャンセルに反応しません。
>
{style="tip"}

### 明示的にキャンセルを確認する

コルーチンが長時間 [中断](#suspension-points-and-cancellation) しない場合、明示的にキャンセルを確認しない限り、キャンセルされても停止しません。

キャンセルを確認するには、以下のAPIを使用します：

* [`isActive`](#isactive) プロパティは、コルーチンがキャンセルされると `false` になります。
* [`ensureActive()`](#ensureactive) 関数は、コルーチンがキャンセルされている場合、即座に `CancellationException` をスローします。
* [`yield()`](#yield) 関数はコルーチンを中断させ、スレッドを解放して他のコルーチンに実行の機会を与えます。コルーチンを中断させることで、キャンセルを確認し、キャンセルされていれば `CancellationException` をスローさせることができます。

これらのAPIは、中断ポイント間で長時間実行されるコルーチンや、中断ポイントで中断する可能性が低い場合に役立ちます。

#### isActive

長時間実行される計算処理の中で [`isActive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html) プロパティを使用して、定期的にキャンセルを確認します。
このプロパティは、コルーチンがアクティブでなくなったときに `false` になります。これを利用して、処理を継続する必要がなくなったときにコルーチンを適切に停止させることができます。

例を以下に示します：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds
import kotlin.random.Random

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val unsortedList = MutableList(10) { Random.nextInt() }
        
        // 長時間実行される計算を開始
        val listSortingJob = launch {
            var i = 0

            // コルーチンがアクティブな間、リストのソートを繰り返す
            while (isActive) {
                unsortedList.sort()
                ++i
            }
            println(
                "Stopped sorting the list after $i iterations"
            )
        }
        // 100ミリ秒間リストをソートし、その後十分にソートされたとみなす
        delay(100.milliseconds)

        // 結果が十分になったところでソートをキャンセルする
        listSortingJob.cancel()

        // データ競合を避けるため、共有リストにアクセスする前に
        // ソート用のコルーチンが終了するのを待つ
        listSortingJob.join()
        println("The list is probably sorted: $unsortedList")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="isactive-example"}

この例では、[`join()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html) 関数によって、コルーチンが終了するまで現在の中断関数を中断させます。これにより、ソート中のコルーチンがまだ実行されている間にリストにアクセスすることを確実に防ぎます。

> [`cancelAndJoin()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html) 関数を使用すると、1回の呼び出しでコルーチンのキャンセルとその終了待機を両方行うことができます。
>
{style="note"}

#### ensureActive()

[`ensureActive()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html) 関数を使用してキャンセルを確認し、コルーチンがキャンセルされている場合は `CancellationException` をスローして現在の計算を停止します。

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJob = launch {
            var start = 0
            try {
                while (true) {
                    ++start
                    // 現在の数値についてコラッツ予想をチェック
                    var n = start
                    while (n != 1) {
                        // コルーチンがキャンセルされている場合、CancellationException をスローする
                        ensureActive()
                        n = if (n % 2 == 0) n / 2 else 3 * n + 1
                    }
                }
            } finally {
                println("Checked the Collatz conjecture for 0..${start-1}")
            }
        }
        // 100ミリ秒間計算を実行
        delay(100.milliseconds)

        // コルーチンをキャンセル
        childJob.cancel()
    }
}
```
{kotlin-runnable="true" id="ensurective-example"}

#### yield()

[`yield()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html) 関数はコルーチンを中断し、再開前にキャンセルを確認します。
中断しない限り、同じスレッド上のコルーチンは逐次実行されます。

`yield` を使用すると、あるコルーチンが終了する前に、同じスレッドまたはスレッドプール上の他のコルーチンが実行される機会を与えることができます。

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() {
    // runBlocking は現在のスレッドを使用してすべてのコルーチンを実行する
    runBlocking {
        val coroutineCount = 5
        repeat(coroutineCount) { coroutineIndex ->
            launch {
                val id = coroutineIndex + 1
                repeat(5) { iterationIndex ->
                    val iteration = iterationIndex + 1
                    // 一時的に中断して、他のコルーチンに実行の機会を与える
                    // これがない場合、コルーチンは一つずつ順番に実行される
                    yield()
                    // コルーチン番号とイテレーション番号を表示
                    println("$id * $iteration = ${id * iteration}")
                }
            }
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="yield-example"}

この例では、各コルーチンが `yield()` を使用して、イテレーションの合間に他のコルーチンを実行させています。

### コルーチンキャンセル時のブロッキングコードの割り込み

JVMでは、`Thread.sleep()` や `BlockingQueue.take()` などの一部の関数が現在のスレッドをブロックすることがあります。
これらのブロッキング関数は割り込み（interrupt）が可能で、途中で停止させることができます。
しかし、コルーチンからこれらを呼び出した場合、キャンセルしてもスレッドに割り込みは発生しません。

コルーチンをキャンセルするときにスレッドに割り込みをかけるには、[`runInterruptible()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-interruptible.html) 関数を使用します：

```kotlin
import kotlinx.coroutines.*

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val childStarted = CompletableDeferred<Unit>()
        val childJob = launch {
            try {
                // キャンセルによりスレッドの割り込み（interruption）が発生する
                runInterruptible {
                    childStarted.complete(Unit)
                    try {
                        // 現在のスレッドを非常に長い時間ブロックする
                        Thread.sleep(Long.MAX_VALUE)
                    } catch (e: InterruptedException) {
                        println("Thread interrupted (Java): $e")
                        throw e
                    }
                }
            } catch (e: CancellationException) {
                println("Coroutine canceled (Kotlin): $e")
                throw e
            }
        }
        childStarted.await()

        // コルーチンをキャンセルし、
        // Thread.sleep() を実行しているスレッドに割り込みをかける
        childJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="interrupt-cancellation-example"}

## コルーチンキャンセル時の安全な値の処理

中断されたコルーチンがキャンセルされると、値がすでに利用可能であっても、値を返す代わりに `CancellationException` で再開されます。
この動作は *即時キャンセル（prompt cancellation）* と呼ばれます。
これにより、すでに閉じられた画面を更新するなど、キャンセルされたコルーチンのスコープでコードが続行されるのを防ぎます。

例を以下に示します：

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// UIスレッドを使用するコルーチンスコープを定義
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            val contents = withContext(Dispatchers.IO) {
                Files.newBufferedReader(
                    path, Charset.forName("US-ASCII")
                ).use {
                    it.readLines()
                }
            }
            // ここで updateUi を呼び出すのは安全です。
            // キャンセルされた場合、withContext() は値を返しません。
            updateUi(contents)
        }
    }

    // ユーザーが画面を離れた後に呼び出されると例外をスローする
    private fun updateUi(contents: List<String>) {
      contents.forEach { line -> addOneLineToUi(line) }
    }
  
    private fun addOneLineToUi(line: String) {
        // UIに1行追加するコードのプレースホルダー
    }

    // UIスレッドからのみ呼び出し可能
    fun leaveScreen() {
        // 画面を離れるときにスコープをキャンセルする
        // 以降 UI の更新はできなくなる
        scope.cancel()
    }
}
```

この例では、`withContext(Dispatchers.IO)` がキャンセルと協調し、ファイルの内容を返す前に `leaveScreen()` 関数がコルーチンをキャンセルした場合、`updateUI()` が実行されるのを防ぎます。

即時キャンセルは、無効になった後の値の使用を防ぐ一方で、重要な値がまだ使用されている最中にコードを停止させてしまい、その値を失うことにつながる可能性もあります。
これは、コルーチンが `AutoCloseable` リソースなどの値を受け取ったものの、それを閉じるコードの部分に到達する前にキャンセルされた場合に発生する可能性があります。
これを防ぐには、値を処理するコルーチンがキャンセルされた場合でも確実に実行される場所にクリーンアップロジックを置いてください。

例を以下に示します：

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// scope は UI スレッドを使用するコルーチンスコープ
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            // finally ブロックで閉じることができるように、reader を変数に保存する
            var reader: BufferedReader? = null
            
            try {
                withContext(Dispatchers.IO) {
                    reader = Files.newBufferedReader(
                        path, Charset.forName("US-ASCII")
                    )
                }
                // withContext() 完了後に保存された reader を使用する
                updateUi(reader!!)
            } finally {
                // コルーチンがキャンセルされた場合でも、reader が確実に閉じられるようにする
                reader?.close()
            }
        }
    }

    private suspend fun updateUi(reader: BufferedReader) {
        // ファイルの内容を表示する
        while (true) {
            val line = withContext(Dispatchers.IO) {
                reader.readLine()
            }
            if (line == null)
                break
            addOneLineToUi(line)
        }
    }

    private fun addOneLineToUi(line: String) {
        // UIに1行追加するコードのプレースホルダー
    }

    // UIスレッドからのみ呼び出し可能
    fun leaveScreen() {
        // 画面を離れるときにスコープをキャンセルする
        // 以降 UI の更新はできなくなる
        scope.cancel()
    }
}
```

この例では、`BufferedReader` を変数に保存し、`finally` ブロックで閉じることで、コルーチンがキャンセルされた場合でもリソースが確実に解放されるようにしています。

### キャンセル不可なブロックの実行

コルーチンの一部のパーツに対して、キャンセルが影響しないようにすることができます。
そのためには、[`NonCancellable`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/) を `withContext()` コルーチンビルダー関数の引数として渡します。

> `.launch()` や `.async()` などの他のコルーチンビルダーで `NonCancellable` を使用しないでください。親子関係が壊れ、構造化された並行性が損なわれます。
>
{style="warning"}

`NonCancellable` は、中断を伴う `close()` 関数によるリソースのクローズなど、特定の操作をコルーチンのキャンセルに関わらず完了させたい場合に役立ちます。

例を以下に示します：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

//sampleStart
val serviceStarted = CompletableDeferred<Unit>()

fun startService() {
    println("Starting the service...")
    serviceStarted.complete(Unit)
}

suspend fun shutdownServiceAndWait() {
    println("Shutting down...")
    delay(100.milliseconds)
    println("Successfully shut down!")
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJob = launch {
            startService()
            try {
                awaitCancellation()
            } finally {
                withContext(NonCancellable) {
                    // withContext(NonCancellable) がない場合、
                    // コルーチンがキャンセルされているため、この関数は完了しない
                    shutdownServiceAndWait()
                }
            }
        }
        serviceStarted.await()
        childJob.cancel()
    }
    println("Exiting the program")
}
//sampleEnd
```
{kotlin-runnable="true" id="noncancellable-blocks-example"}

## タイムアウト

タイムアウトを使用すると、指定した時間の経過後にコルーチンを自動的にキャンセルできます。
時間がかかりすぎる操作を停止させるのに役立ち、アプリケーションのレスポンスを維持し、不必要にスレッドをブロックし続けるのを避けることができます。

タイムアウトを指定するには、[`withTimeoutOrNull()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html) 関数に `Duration` を指定して使用します：

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

//sampleStart
suspend fun slowOperation(): Int {
    try {
        delay(300.milliseconds)
        return 5
    } catch (e: CancellationException) {
        println("The slow operation has been canceled: $e")
        throw e
    }
}

suspend fun fastOperation(): Int {
    try {
        delay(15.milliseconds)
        return 14
    } catch (e: CancellationException) {
        println("The fast operation has been canceled: $e")
        throw e
    }
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        val slow = withTimeoutOrNull(100.milliseconds) {
            slowOperation()
        }
        println("The slow operation finished with $slow")
        val fast = withTimeoutOrNull(100.milliseconds) {
            fastOperation()
        }
        println("The fast operation finished with $fast")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="timeout-example"}

指定した `Duration` を経過した場合、`withTimeoutOrNull()` は `null` を返します。