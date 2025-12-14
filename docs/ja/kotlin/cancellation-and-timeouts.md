<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: キャンセルとタイムアウト)

キャンセル機能を使用すると、コルーチンが完了する前に停止できます。
これにより、ユーザーがウィンドウを閉じたり、コルーチンがまだ実行中にユーザーインターフェースで別の画面に移動したりするなど、不要になった処理を停止できます。
また、リソースを早期に解放したり、コルーチンが破棄されたオブジェクトにアクセスするのを防いだりするためにも使用できます。

> キャンセル機能は、コルーチンが値を生成し続けても、他のコルーチンがそれを必要としなくなった場合に、長時間実行されるコルーチンを停止するために使用できます。たとえば、[パイプライン](channels.md#pipelines)などで活用できます。
>
{style="tip"}

キャンセルは、コルーチンのライフサイクルとその親子関係を表す[`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/)ハンドルを通じて機能します。
`Job`を使用すると、コルーチンがアクティブであるかどうかを確認したり、[構造化された並行処理](coroutines-basics.md#coroutine-scope-and-structured-concurrency)で定義されているように、その子コルーチンとともにコルーチンをキャンセルしたりできます。

## コルーチンのキャンセル

コルーチンは、その`Job`ハンドルで[`cancel()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html)関数が呼び出されるとキャンセルされます。
[コルーチンビルダー関数](coroutines-basics.md#coroutine-builder-functions)（例：[`.launch()`](coroutines-basics.md#coroutinescope-launch)）は`Job`を返します。
[`.async()`](coroutines-basics.md#coroutinescope-async)関数は[`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/)を返します。これは`Job`を実装しており、同じキャンセル動作をサポートします。

`cancel()`関数は手動で呼び出すこともできますし、親コルーチンがキャンセルされたときにキャンセル伝播を通じて自動的に呼び出されることもあります。

コルーチンがキャンセルされると、次にキャンセルチェックを行ったときに[`CancellationException`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/)がスローされます。
これがどのように、いつ発生するかについての詳細は、「[サスペンションポイントとキャンセル](#suspension-points-and-cancellation)」を参照してください。

> [`awaitCancellation()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/await-cancellation.html)関数を使用すると、コルーチンがキャンセルされるまでサスペンドさせることができます。
>
{style="tip"}

コルーチンを手動でキャンセルする方法の例を次に示します。

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // Used as a signal that the coroutine has started running
        val job1Started = CompletableDeferred<Unit>()
        
        val job1: Job = launch {
            
            println("The coroutine has started")

            // Completes the CompletableDeferred,
            // signaling that the coroutine has started running
            job1Started.complete(Unit)
            try {
                // Suspends indefinitely
                // Without cancellation, this call would never return
                delay(Duration.INFINITE)
            } catch (e: CancellationException) {
                println("The coroutine was canceled: $e")
              
                // Always rethrow cancellation exceptions!
                throw e
            }
            println("This line will never be executed")
        }
      
        // Waits for job1 to start before canceling it
        job1Started.await()

        // Cancels the coroutine, so delay() throws a CancellationException
        job1.cancel()

        // async returns a Deferred handle, which inherits from Job
        val job2 = async {
                  // If the coroutine is canceled before its body starts executing,
                  // this line may not be printed
                  println("The second coroutine has started")

            try {
                // Equivalent to delay(Duration.INFINITE)
                // Suspends until this coroutine is canceled
                awaitCancellation()

            } catch (e: CancellationException) {
                println("The second coroutine was canceled")
                throw e
            }
        }
        job2.cancel()
    }
    // Coroutine builders such as withContext() or coroutineScope()
    // wait for all child coroutines to complete,
    // even when the children are canceled
    println("All coroutines have completed")
}
//sampleEnd
```
{kotlin-runnable="true" id="manual-cancellation-example"}

この例では、[`CompletableDeferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-completable-deferred/)がコルーチンが実行を開始したというシグナルとして使用されています。
コルーチンは実行開始時に`complete()`を呼び出し、`await()`はその`CompletableDeferred`が完了した後にのみ返されます。これにより、キャンセルはコルーチンが実行を開始した後にのみ行われます。
`.async()`によって作成されたコルーチンにはこのチェックがないため、ブロック内のコードを実行する前にキャンセルされる可能性があります。

> `CancellationException`をキャッチすると、キャンセルの伝播が中断される可能性があります。
> もしキャッチする必要がある場合は、コルーチン階層を通じてキャンセルが正しく伝播されるように再スローしてください。
>
> 詳細については、「[コルーチンの例外処理](exception-handling.md#cancellation-and-exceptions)」を参照してください。
>
{style="warning"}

### キャンセル伝播

[構造化された並行処理](coroutines-basics.md#coroutine-scope-and-structured-concurrency)は、コルーチンをキャンセルすると、そのすべての子コルーチンもキャンセルされることを保証します。
これにより、親が既に停止した後も子コルーチンが動作し続けることを防ぎます。

例を次に示します。

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // Used as a signal that the child coroutines have been launched
        val childrenLaunched = CompletableDeferred<Unit>()

        // Launches two child coroutines
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
            // Completes the CompletableDeferred,
            // signaling that the child coroutines have been launched
            childrenLaunched.complete(Unit)
        }
        // Waits for the parent coroutine to signal that it has launched
        // all of its children
        childrenLaunched.await()

        // Cancels the parent coroutine, which cancels all its children
        parentJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="cancellation-propagation-example"}

この例では、各子コルーチンは[`finally`ブロック](exceptions.md#the-finally-block)を使用しているため、コルーチンがキャンセルされるとその中のコードが実行されます。
ここで`CompletableDeferred`は、子コルーチンがキャンセルされる前に起動されたことを通知しますが、実行を開始することは保証しません。もし先にキャンセルされた場合、何も出力されません。

## コルーチンをキャンセルに反応させる {id="cancellation-is-cooperative"}

Kotlinでは、コルーチンのキャンセルは_協調的_です。
これは、コルーチンが[サスペンド](#suspension-points-and-cancellation)するか、[明示的にキャンセルをチェック](#check-for-cancellation-explicitly)することで協力した場合にのみ、キャンセルに反応することを意味します。

このセクションでは、キャンセル可能なコルーチンを作成する方法を学びます。

### サスペンションポイントとキャンセル

コルーチンがキャンセルされると、_サスペンションポイント_とも呼ばれる、コード内でサスペンドする可能性のある箇所に到達するまで実行を継続します。
そこでコルーチンがサスペンドすると、サスペンド関数はキャンセルされたかどうかをチェックします。
もしキャンセルされていれば、コルーチンは停止し、`CancellationException`をスローします。

`suspend`関数の呼び出しはサスペンションポイントですが、常にサスペンドするわけではありません。
たとえば、`Deferred`の結果を待つ場合、コルーチンはその`Deferred`がまだ完了していない場合にのみサスペンドします。

コルーチンがキャンセルされたときにチェックして停止できるように、サスペンドする一般的なサスペンド関数を使用した例を次に示します。

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
                // Suspends until canceled
                awaitCancellation()
            },
            launch {
                // Suspends until canceled
                delay(Duration.INFINITE)
            },
            launch {
                val channel = Channel<Int>()
                // Suspends while waiting for a value that is never sent
                channel.receive()
            },
            launch {
                val deferred = CompletableDeferred<Int>()
                // Suspends while waiting for a value that is never completed
                deferred.await()
            },
            launch {
                val mutex = Mutex(locked = true)
                // Suspends while waiting for a mutex that remains locked indefinitely
                mutex.lock()
            }
        )
        
        // Gives the child coroutines time to start and suspend
        delay(100.milliseconds)
        
        // Cancels all child coroutines
        childJobs.forEach { it.cancel() }
    }
    println("All child jobs completed!")
}
```
{kotlin-runnable="true" id="suspension-points-example"}

> `kotlinx.coroutines`ライブラリ内のすべてのサスペンド関数は、コルーチンがサスペンドしたときにキャンセルをチェックする[`suspendCancellableCoroutine()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/suspend-cancellable-coroutine.html)を内部的に使用しているため、キャンセルに協調します。
> 対照的に、[`suspendCoroutine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/suspend-coroutine.html)を使用するカスタムのサスペンド関数はキャンセルに反応しません。
>
{style="tip"}

### キャンセルを明示的にチェックする

コルーチンが長時間[サスペンド](#suspension-points-and-cancellation)しない場合、明示的にキャンセルをチェックしない限り、キャンセルされても停止しません。

キャンセルをチェックするには、以下のAPIを使用します。

*   [`isActive`](#isactive)プロパティは、コルーチンがキャンセルされると`false`になります。
*   [`ensureActive()`](#ensureactive)関数は、コルーチンがキャンセルされた場合、即座に`CancellationException`をスローします。
*   [`yield()`](#yield)関数はコルーチンをサスペンドさせ、スレッドを解放して他のコルーチンがそのスレッドで実行する機会を与えます。コルーチンをサスペンドすることで、キャンセルをチェックし、キャンセルされていれば`CancellationException`をスローできます。

これらのAPIは、コルーチンがサスペンションポイント間で長時間実行される場合や、サスペンションポイントでサスペンドする可能性が低い場合に役立ちます。

#### isActive

長時間実行される計算処理では、[`isActive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html)プロパティを定期的に使用してキャンセルをチェックします。
このプロパティは、コルーチンがアクティブでなくなったときに`false`になります。これは、コルーチンが操作を続行する必要がなくなったときに、コルーチンを正常に停止するために使用できます。

例を次に示します。

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds
import kotlin.random.Random

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val unsortedList = MutableList(10) { Random.nextInt() }
        
        // Starts a long-running computation
        val listSortingJob = launch {
            var i = 0

            // Repeatedly sorts the list while the coroutine remains active
            while (isActive) {
                unsortedList.sort()
                ++i
            }
            println(
                "Stopped sorting the list after $i iterations"
            )
        }
        // Sorts the list for 100 milliseconds, then considers it sorted enough
        delay(100.milliseconds)

        // Cancels the sorting when the result is good enough        
        listSortingJob.cancel()

        // Waits until the sorting coroutine finishes
        // before accessing the shared list to avoid data races
        listSortingJob.join()
        println("The list is probably sorted: $unsortedList")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="isactive-example"}

この例では、[`join()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html)関数は、コルーチンが終了するまでサスペンドします。これにより、ソートコルーチンがまだ実行中にリストにアクセスされないことが保証されます。

> [`cancelAndJoin()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html)関数を使用すると、コルーチンをキャンセルして、単一の呼び出しでその完了を待つことができます。
>
{style="note"}

#### ensureActive()

[`ensureActive()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html)関数を使用してキャンセルをチェックし、コルーチンがキャンセルされた場合は`CancellationException`をスローして現在の計算処理を停止します。

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
                    // Checks the Collatz conjecture for the current number
                    var n = start
                    while (n != 1) {
                        // Throws CancellationException if the coroutine is canceled
                        ensureActive()
                        n = if (n % 2 == 0) n / 2 else 3 * n + 1
                    }
                }
            } finally {
                println("Checked the Collatz conjecture for 0..${start-1}")
            }
        }
        // Runs the computation for one second
        delay(100.milliseconds)

        // Cancels the coroutine
        childJob.cancel()
    }
}
```
{kotlin-runnable="true" id="ensurective-example"}

#### yield()

[`yield()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html)関数はコルーチンをサスペンドさせ、再開する前にキャンセルをチェックします。
サスペンドしない場合、同じスレッド上のコルーチンは順次実行されます。

`yield`を使用して、他のコルーチンが完了する前に、同じスレッドまたはスレッドプールで他のコルーチンを実行できるようにします。

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() {
    // runBlocking uses the current thread for running all coroutines
    runBlocking {
        val coroutineCount = 5
        repeat(coroutineCount) { coroutineIndex ->
            launch {
                val id = coroutineIndex + 1
                repeat(5) { iterationIndex ->
                    val iteration = iterationIndex + 1
                    // Temporarily suspends to give other coroutines a chance to run
                    // Without this, the coroutines run sequentially
                    yield()
                    // Prints the coroutine index and iteration index
                    println("$id * $iteration = ${id * iteration}")
                }
            }
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="yield-example"}

この例では、各コルーチンが`yield()`を使用して、イテレーション間に他のコルーチンが実行できるようにしています。

### コルーチンがキャンセルされたときにブロッキングコードを中断する

JVMでは、`Thread.sleep()`や`BlockingQueue.take()`などの一部の関数は現在のスレッドをブロックする可能性があります。
これらのブロッキング関数は中断することができ、これにより早期に停止します。
しかし、コルーチンからこれらの関数を呼び出しても、キャンセルによってスレッドは中断されません。

コルーチンをキャンセルする際にスレッドを中断するには、[`runInterruptible()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-interruptible.html)関数を使用します。

```kotlin
import kotlinx.coroutines.*

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val childStarted = CompletableDeferred<Unit>()
        val childJob = launch {
            try {
                // Cancellation triggers a thread interruption
                runInterruptible {
                    childStarted.complete(Unit)
                    try {
                        // Blocks the current thread for a very long time
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

        // Cancels the coroutine and interrupts the thread
        // by running Thread.sleep()
        childJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="interrupt-cancellation-example"}

## コルーチンのキャンセル時に値を安全に処理する

サスペンドされたコルーチンがキャンセルされると、値が既に利用可能であったとしても、値を返す代わりに`CancellationException`を伴って再開します。
この動作は_プロンプトキャンセル (prompt cancellation)_と呼ばれます。
これにより、キャンセルされたコルーチンのスコープでコードが続行されること（たとえば、既に閉じられた画面を更新することなど）を防ぎます。

例を次に示します。

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// Defines a coroutine scope that uses the UI thread
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
            // It's safe to call updateUi here,
            // In case of cancellation, withContext() wouldn't return any values
            updateUi(contents)
        }
    }

    // Throws an exception if called after the user left the screen
    private fun updateUi(contents: List<String>) {
      contents.forEach { line -> addOneLineToUi(line) }
    }
  
    private fun addOneLineToUi(line: String) {
        // Placeholder for code that adds one line to the UI
    }

    // Only callable from the UI thread
    fun leaveScreen() {
        // Cancels the scope when leaving the screen
        // You can no longer update the UI
        scope.cancel()
    }
}
```

この例では、`withContext(Dispatchers.IO)`はキャンセルに協調し、`leaveScreen()`関数がファイルのコンテンツを返す前にコルーチンをキャンセルした場合に`updateUI()`が実行されるのを防ぎます。

プロンプトキャンセルは、値が有効でなくなった後にそれを使用することを防ぎますが、重要な値がまだ使用されている間にコードを停止することもあり、その値が失われる可能性があります。
これは、コルーチンが`AutoCloseable`リソースなどの値を受け取ったものの、それを閉じるコード部分に到達する前にキャンセルされた場合に発生する可能性があります。
これを防ぐには、値を受け取るコルーチンがキャンセルされた場合でも実行が保証される場所にクリーンアップロジックを配置します。

例を次に示します。

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// scope is a coroutine scope using the UI thread
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            // Stores the reader in a variable, so the finally block can close it
            var reader: BufferedReader? = null
            
            try {
                withContext(Dispatchers.IO) {
                    reader = Files.newBufferedReader(
                        path, Charset.forName("US-ASCII")
                    )
                }
                // Uses the stored reader after withContext() completes
                updateUi(reader!!)
            } finally {
                // Ensures the reader is closed even when the coroutine is canceled
                reader?.close() // Release the resource if it was acquired
            }
        }
    }

    private suspend fun updateUi(reader: BufferedReader) {
        // Shows the file contents
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
        // Placeholder for code that adds one line to the UI
    }

    // Only callable from the UI thread
    fun leaveScreen() {
        // Cancels the scope when leaving the screen
        // You can no longer update the UI
        scope.cancel()
    }
}
```

この例では、`BufferedReader`を変数に格納し、`finally`ブロックでそれを閉じることで、コルーチンがキャンセルされた場合でもリソースが解放されることを保証します。

### キャンセル不可ブロックの実行

コルーチンの特定の箇所へのキャンセルによる影響を防ぐことができます。
これを行うには、`withContext()`コルーチンビルダー関数に引数として[`NonCancellable`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/)を渡します。

> `NonCancellable`を`.launch()`や`.async()`のような他のコルーチンビルダーと一緒に使用することは避けてください。これを行うと、親子関係を壊すことで構造化された並行処理が中断されます。
>
{style="warning"}

`NonCancellable`は、サスペンドする`close()`関数を持つリソースを閉じるなど、特定の操作をコルーチンが終了する前にキャンセルされた場合でも完了させる必要がある場合に役立ちます。

例を次に示します。

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
                    // Without withContext(NonCancellable),
                    // This function doesn't complete because the coroutine is canceled
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

タイムアウトを使用すると、指定された期間の後にコルーチンを自動的にキャンセルできます。
これは、時間がかかりすぎる操作を停止し、アプリケーションの応答性を維持し、スレッドの不要なブロックを回避するのに役立ちます。

タイムアウトを指定するには、[`withTimeoutOrNull()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html)関数を`Duration`と共に使用します。

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

タイムアウトが指定された`Duration`を超過した場合、`withTimeoutOrNull()`は`null`を返します。