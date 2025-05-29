<!--- TEST_NAME DispatcherGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンコンテキストとディスパッチャ)

コルーチンは常に、Kotlin標準ライブラリで定義されている[CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/)型の値で表現される何らかのコンテキスト内で実行されます。

コルーチンコンテキストは、さまざまな要素のセットです。主要な要素は、以前に説明したコルーチンの[Job]と、このセクションで説明するディスパッチャです。

## ディスパッチャとスレッド

コルーチンコンテキストには、対応するコルーチンが実行に使用するスレッドを決定する*コルーチンディスパッチャ*（[CoroutineDispatcher]を参照）が含まれます。コルーチンディスパッチャは、コルーチンの実行を特定のスレッドに制限したり、スレッドプールにディスパッチしたり、無制限に実行させたりできます。

[launch]や[async]など、すべてのコルーチンビルダーは、任意の[CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/)パラメーターを受け入れます。これは、新しいコルーチンやその他のコンテキスト要素のディスパッチャを明示的に指定するために使用できます。

次の例を試してみてください。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch { // context of the parent, main runBlocking coroutine
        println("main runBlocking      : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Unconfined) { // not confined -- will work with main thread
        println("Unconfined            : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Default) { // will get dispatched to DefaultDispatcher 
        println("Default               : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(newSingleThreadContext("MyOwnThread")) { // will get its own new thread
        println("newSingleThreadContext: I'm working in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-01.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-01.kt)から取得できます。
>
{style="note"}

以下のような出力が得られます（順序は異なる場合があります）。

```text
Unconfined            : I'm working in thread main
Default               : I'm working in thread DefaultDispatcher-worker-1
newSingleThreadContext: I'm working in thread MyOwnThread
main runBlocking      : I'm working in thread main
```

<!--- TEST LINES_START_UNORDERED -->

パラメーターなしで`launch { ... }`を使用すると、起動元の[CoroutineScope]からコンテキスト（ひいてはディスパッチャ）を継承します。この場合、`main`スレッドで実行されるメインの`runBlocking`コルーチンのコンテキストを継承します。

[Dispatchers.Unconfined]は特別なディスパッチャで、こちらも`main`スレッドで実行されているように見えますが、実際には後で説明する異なるメカニズムです。

スコープで他のディスパッチャが明示的に指定されていない場合、デフォルトのディスパッチャが使用されます。これは[Dispatchers.Default]によって表され、共有されたバックグラウンドスレッドプールを使用します。

[newSingleThreadContext]は、コルーチンを実行するためのスレッドを作成します。専用のスレッドは非常にコストのかかるリソースです。実際のアプリケーションでは、不要になったら[close][ExecutorCoroutineDispatcher.close]関数を使用して解放するか、トップレベルの変数に格納してアプリケーション全体で再利用する必要があります。

## Unconfinedディスパッチャとconfinedディスパッチャ

[Dispatchers.Unconfined]コルーチンディスパッチャは、呼び出し元のスレッドでコルーチンを開始しますが、最初のサスペンドポイントまでです。サスペンド後、呼び出されたサスペンド関数によって完全に決定されるスレッドでコルーチンを再開します。unconfinedディスパッチャは、CPU時間を消費せず、特定のUIスレッドに制限された共有データも更新しないコルーチンに適しています。

一方、ディスパッチャはデフォルトで外側の[CoroutineScope]から継承されます。[runBlocking]コルーチンのデフォルトディスパッチャは、特に呼び出し元のスレッドに制限されているため、それを継承すると、予測可能なFIFOスケジューリングにより、このスレッドへの実行を制限する効果があります。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch(Dispatchers.Unconfined) { // not confined -- will work with main thread
        println("Unconfined      : I'm working in thread ${Thread.currentThread().name}")
        delay(500)
        println("Unconfined      : After delay in thread ${Thread.currentThread().name}")
    }
    launch { // context of the parent, main runBlocking coroutine
        println("main runBlocking: I'm working in thread ${Thread.currentThread().name}")
        delay(1000)
        println("main runBlocking: After delay in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-02.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-02.kt)から取得できます。
>
{style="note"}

以下のような出力が得られます。

```text
Unconfined      : I'm working in thread main
main runBlocking: I'm working in thread main
Unconfined      : After delay in thread kotlinx.coroutines.DefaultExecutor
main runBlocking: After delay in thread main
```

<!--- TEST LINES_START -->

そのため、`runBlocking {...}`からコンテキストを継承したコルーチンは`main`スレッドで実行を継続しますが、unconfinedコルーチンは[delay]関数が使用しているデフォルトのエグゼキュータースレッドで再開します。

> unconfinedディスパッチャは高度なメカニズムであり、コルーチンの実行を後でディスパッチする必要がない、またはコルーチン内の何らかの操作を直ちに実行する必要があるため、望ましくない副作用が発生する場合がある特定の特殊なケースで役立ちます。
> unconfinedディスパッチャは一般的なコードで使用すべきではありません。
>
{style="note"}

## コルーチンとスレッドのデバッグ

コルーチンは、あるスレッドでサスペンドし、別のスレッドで再開できます。シングルスレッドディスパッチャを使用している場合でも、特別なツールがない場合、コルーチンが何を、どこで、いつ行っていたかを把握するのは難しいかもしれません。

### IDEAでのデバッグ

Kotlinプラグインのコルーチンデバッガは、IntelliJ IDEAでのコルーチンのデバッグを簡素化します。

> デバッグは`kotlinx-coroutines-core`バージョン1.3.8以降で機能します。
>
{style="note"}

**Debug**ツールウィンドウには、**Coroutines**タブが含まれています。このタブでは、現在実行中およびサスペンド中の両方のコルーチンに関する情報を見つけることができます。コルーチンは、実行中のディスパッチャごとにグループ化されます。

![Debugging coroutines](coroutine-idea-debugging-1.png){width=700}

コルーチンデバッガを使用すると、次のことができます。
*   各コルーチンの状態を確認する。
*   実行中およびサスペンド中のコルーチンの両方について、ローカル変数およびキャプチャされた変数の値を確認する。
*   完全なコルーチン作成スタックと、コルーチン内部のコールスタックを確認する。このスタックには、標準的なデバッグでは失われるような変数値を含むすべてのフレームが含まれます。
*   各コルーチンの状態とそのスタックを含む完全なレポートを取得する。それを取得するには、**Coroutines**タブ内で右クリックし、**Get Coroutines Dump**をクリックします。

コルーチンデバッグを開始するには、ブレークポイントを設定し、アプリケーションをデバッグモードで実行するだけです。

コルーチンデバッグの詳細については、[チュートリアル](https://kotlinlang.org/docs/tutorials/coroutines/debug-coroutines-with-idea.html)を参照してください。

### ロギングを使用したデバッグ

コルーチンデバッガなしでスレッドを使用するアプリケーションをデバッグするもう1つの方法は、各ログステートメントでスレッド名をログファイルに出力することです。この機能はロギングフレームワークで普遍的にサポートされています。コルーチンを使用する場合、スレッド名だけでは多くのコンテキストが得られないため、`kotlinx.coroutines`はそれを容易にするためのデバッグ機能を含んでいます。

`-Dkotlinx.coroutines.debug` JVMオプションを使用して次のコードを実行します。

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() = runBlocking<Unit> {
//sampleStart
    val a = async {
        log("I'm computing a piece of the answer")
        6
    }
    val b = async {
        log("I'm computing another piece of the answer")
        7
    }
    log("The answer is ${a.await() * b.await()}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-03.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-03.kt)から取得できます。
>
{style="note"}

3つのコルーチンがあります。`runBlocking`内のメインコルーチン（#1）と、遅延値`a`（#2）および`b`（#3）を計算する2つのコルーチンです。それらはすべて`runBlocking`のコンテキストで実行され、メインスレッドに制限されています。このコードの出力は次のとおりです。

```text
[main @coroutine#2] I'm computing a piece of the answer
[main @coroutine#3] I'm computing another piece of the answer
[main @coroutine#1] The answer is 42
```

<!--- TEST FLEXIBLE_THREAD -->

`log`関数はスレッド名を角括弧で出力し、それが`main`スレッドであり、現在実行中のコルーチンの識別子が追加されていることがわかります。この識別子は、デバッグモードがオンの場合、作成されたすべてのコルーチンに連続して割り当てられます。

> デバッグモードは、JVMが`-ea`オプションで実行される場合にもオンになります。
> デバッグ機能の詳細については、[DEBUG_PROPERTY_NAME]プロパティのドキュメントを参照してください。
>
{style="note"}

## スレッド間の移動

`-Dkotlinx.coroutines.debug` JVMオプション（[デバッグ](#debugging-coroutines-and-threads)を参照）を使用して次のコードを実行します。

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() {
    newSingleThreadContext("Ctx1").use { ctx1 ->
        newSingleThreadContext("Ctx2").use { ctx2 ->
            runBlocking(ctx1) {
                log("Started in ctx1")
                withContext(ctx2) {
                    log("Working in ctx2")
                }
                log("Back to ctx1")
            }
        }
    }
}
```
<!--- KNIT example-context-04.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-04.kt)から取得できます。
>
{style="note"}

上記の例は、コルーチン使用における新しいテクニックを示しています。

最初のテクニックは、指定されたコンテキストで[runBlocking]を使用する方法を示しています。2番目のテクニックは、[withContext]を呼び出すことです。これは、現在のコルーチンをサスペンドし、新しいコンテキストに切り替える可能性があります。ただし、新しいコンテキストが既存のコンテキストと異なる場合に限ります。具体的には、異なる[CoroutineDispatcher]を指定すると、追加のディスパッチが必要です。ブロックは新しいディスパッチャでスケジュールされ、完了すると元のディスパッチャに実行が戻ります。

その結果、上記のコードの出力は次のようになります。

```text
[Ctx1 @coroutine#1] Started in ctx1
[Ctx2 @coroutine#1] Working in ctx2
[Ctx1 @coroutine#1] Back to ctx1
```

<!--- TEST -->

上記の例では、Kotlin標準ライブラリの`use`関数を使用して、不要になった[newSingleThreadContext]によって作成されたスレッドリソースを適切に解放しています。

## コンテキスト内のJob

コルーチンの[Job]はそのコンテキストの一部であり、`coroutineContext[Job]`という式を使ってそこから取得できます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    println("My job is ${coroutineContext[Job]}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-05.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-05.kt)から取得できます。
>
{style="note"}

[デバッグモード](#debugging-coroutines-and-threads)では、次のような出力が得られます。

```
My job is "coroutine#1":BlockingCoroutine{Active}@6d311334
```

<!--- TEST lines.size == 1 && lines[0].startsWith("My job is \"coroutine#1\":BlockingCoroutine{Active}@") -->

[CoroutineScope]内の[isActive]は、`coroutineContext[Job]?.isActive == true`の便利なショートカットにすぎないことに注意してください。

## コルーチンの子

コルーチンが別のコルーチンの[CoroutineScope]で起動されると、[CoroutineScope.coroutineContext]を介してそのコンテキストを継承し、新しいコルーチンの[Job]は親コルーチンのジョブの*子*になります。親コルーチンがキャンセルされると、すべての子コルーチンも再帰的にキャンセルされます。

ただし、この親子関係は、次の2つの方法のいずれかで明示的にオーバーライドできます。

1.  コルーチンを起動する際に別のスコープが明示的に指定された場合（例: `GlobalScope.launch`）、親スコープから`Job`を継承しません。
2.  新しいコルーチンのコンテキストとして別の`Job`オブジェクトが渡された場合（以下の例に示すように）、親スコープの`Job`をオーバーライドします。

どちらの場合も、起動されたコルーチンは起動元のスコープに紐付けられず、独立して動作します。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    // launch a coroutine to process some kind of incoming request
    val request = launch {
        // it spawns two other jobs
        launch(Job()) { 
            println("job1: I run in my own Job and execute independently!")
            delay(1000)
            println("job1: I am not affected by cancellation of the request")
        }
        // and the other inherits the parent context
        launch {
            delay(100)
            println("job2: I am a child of the request coroutine")
            delay(1000)
            println("job2: I will not execute this line if my parent request is cancelled")
        }
    }
    delay(500)
    request.cancel() // cancel processing of the request
    println("main: Who has survived request cancellation?")
    delay(1000) // delay the main thread for a second to see what happens
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-06.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-06.kt)から取得できます。
>
{style="note"}

このコードの出力は次のとおりです。

```text
job1: I run in my own Job and execute independently!
job2: I am a child of the request coroutine
main: Who has survived request cancellation?
job1: I am not affected by cancellation of the request
```

<!--- TEST -->

## 親の責任

親コルーチンは、常にすべての子コルーチンの完了を待ちます。親は、起動するすべての子を明示的に追跡する必要はなく、最後に[Job.join]を使ってそれらを待つ必要もありません。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    // launch a coroutine to process some kind of incoming request
    val request = launch {
        repeat(3) { i -> // launch a few children jobs
            launch  {
                delay((i + 1) * 200L) // variable delay 200ms, 400ms, 600ms
                println("Coroutine $i is done")
            }
        }
        println("request: I'm done and I don't explicitly join my children that are still active")
    }
    request.join() // wait for completion of the request, including all its children
    println("Now processing of the request is complete")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-07.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-07.kt)から取得できます。
>
{style="note"}

結果は次のようになります。

```text
request: I'm done and I don't explicitly join my children that are still active
Coroutine 0 is done
Coroutine 1 is done
Coroutine 2 is done
Now processing of the request is complete
```

<!--- TEST -->

## デバッグ用のコルーチン命名

自動的に割り当てられるIDは、コルーチンが頻繁にログを出力し、同じコルーチンからのログレコードを関連付けたい場合に便利です。ただし、コルーチンが特定の要求の処理や特定のバックグラウンドタスクに関連付けられている場合、デバッグ目的で明示的に名前を付ける方が良いでしょう。[CoroutineName]コンテキスト要素は、スレッド名と同じ目的を果たします。デバッグモードがオンの場合、このコルーチンを実行しているスレッド名に含まれます。

次の例はこの概念を示しています。

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() = runBlocking(CoroutineName("main")) {
//sampleStart
    log("Started main coroutine")
    // run two background value computations
    val v1 = async(CoroutineName("v1coroutine")) {
        delay(500)
        log("Computing v1")
        6
    }
    val v2 = async(CoroutineName("v2coroutine")) {
        delay(1000)
        log("Computing v2")
        7
    }
    log("The answer for v1 * v2 = ${v1.await() * v2.await()}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-08.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-08.kt)から取得できます。
>
{style="note"}

`-Dkotlinx.coroutines.debug` JVMオプションを指定して生成される出力は次のようになります。

```text
[main @main#1] Started main coroutine
[main @v1coroutine#2] Computing v1
[main @v2coroutine#3] Computing v2
[main @main#1] The answer for v1 * v2 = 42
```

<!--- TEST FLEXIBLE_THREAD -->

## コンテキスト要素の結合

コルーチンコンテキストに複数の要素を定義する必要がある場合があります。そのためには`+`演算子を使用できます。たとえば、明示的に指定されたディスパッチャと明示的に指定された名前を持つコルーチンを同時に起動できます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch(Dispatchers.Default + CoroutineName("test")) {
        println("I'm working in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-09.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-09.kt)から取得できます。
>
{style="note"}

`-Dkotlinx.coroutines.debug` JVMオプションを指定したこのコードの出力は次のとおりです。

```text
I'm working in thread DefaultDispatcher-worker-1 @test#2
```

<!--- TEST FLEXIBLE_THREAD -->

## コルーチンスコープ

コンテキスト、子、ジョブに関する知識をまとめましょう。
アプリケーションにライフサイクルを持つオブジェクトがあるが、そのオブジェクトがコルーチンではないと仮定します。たとえば、Androidアプリケーションを作成しており、データの取得と更新、アニメーションの実行など、非同期操作を実行するために、Androidアクティビティのコンテキストでさまざまなコルーチンを起動しているとします。これらのコルーチンは、メモリリークを避けるためにアクティビティが破棄されたときにキャンセルされる必要があります。もちろん、アクティビティとそのコルーチンのライフサイクルを結びつけるために、コンテキストとジョブを手動で操作することもできますが、`kotlinx.coroutines`はそのような抽象化を提供します：[CoroutineScope]。すべてのコルーチンビルダーがそれに対する拡張として宣言されているため、コルーチンスコープにはすでに慣れているはずです。

アクティビティのライフサイクルに紐付けられた[CoroutineScope]のインスタンスを作成することで、コルーチンのライフサイクルを管理します。[CoroutineScope()]または[MainScope()]ファクトリ関数によって`CoroutineScope`インスタンスを作成できます。前者は汎用スコープを作成し、後者はUIアプリケーション用のスコープを作成し、デフォルトディスパッチャとして[Dispatchers.Main]を使用します。

```kotlin
class Activity {
    private val mainScope = MainScope()
    
    fun destroy() {
        mainScope.cancel()
    }
    // to be continued ...
```

これで、定義した`mainScope`を使用して、この`Activity`のスコープでコルーチンを起動できます。デモのために、異なる時間で遅延する10個のコルーチンを起動します。

```kotlin
    // class Activity continues
    fun doSomething() {
        // launch ten coroutines for a demo, each working for a different time
        repeat(10) { i ->
            mainScope.launch {
                delay((i + 1) * 200L) // variable delay 200ms, 400ms, ... etc
                println("Coroutine $i is done")
            }
        }
    }
} // class Activity ends
```

メイン関数では、アクティビティを作成し、テスト用の`doSomething`関数を呼び出し、500ms後にアクティビティを破棄します。これにより、`doSomething`から起動されたすべてのコルーチンがキャンセルされます。アクティビティが破棄された後、しばらく待ってもメッセージが印刷されないため、これが確認できます。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*

class Activity {
    private val mainScope = CoroutineScope(Dispatchers.Default) // use Default for test purposes
    
    fun destroy() {
        mainScope.cancel()
    }

    fun doSomething() {
        // launch ten coroutines for a demo, each working for a different time
        repeat(10) { i ->
            mainScope.launch {
                delay((i + 1) * 200L) // variable delay 200ms, 400ms, ... etc
                println("Coroutine $i is done")
            }
        }
    }
} // class Activity ends

fun main() = runBlocking<Unit> {
//sampleStart
    val activity = Activity()
    activity.doSomething() // run test function
    println("Launched coroutines")
    delay(500L) // delay for half a second
    println("Destroying activity!")
    activity.destroy() // cancels all coroutines
    delay(1000) // visually confirm that they don't work
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-10.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-10.kt)から取得できます。
>
{style="note"}

この例の出力は次のとおりです。

```text
Launched coroutines
Coroutine 0 is done
Coroutine 1 is done
Destroying activity!
```

<!--- TEST -->

ご覧のとおり、最初の2つのコルーチンのみがメッセージを出力し、残りは`Activity.destroy()`内の[`mainScope.cancel()`][CoroutineScope.cancel]の1回の呼び出しによってキャンセルされます。

> Androidは、ライフサイクルを持つすべてのエンティティにおいてコルーチンスコープを第一級でサポートしています。
> [関連ドキュメント](https://developer.android.com/topic/libraries/architecture/coroutines#lifecyclescope)を参照してください。
>
{style="note"}

### スレッドローカルデータ

コルーチンに、またはコルーチン間でスレッドローカルデータを渡せると便利な場合があります。しかし、コルーチンは特定のスレッドに紐付けられていないため、手動で行うとボイラープレートコードにつながる可能性が高いです。

[`ThreadLocal`](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html)については、[asContextElement]拡張関数が役に立ちます。これは、与えられた`ThreadLocal`の値を保持し、コルーチンがコンテキストを切り替えるたびにその値を復元する追加のコンテキスト要素を作成します。

実際に動作をデモンストレーションするのは簡単です。

```kotlin
import kotlinx.coroutines.*

val threadLocal = ThreadLocal<String?>() // declare thread-local variable

fun main() = runBlocking<Unit> {
//sampleStart
    threadLocal.set("main")
    println("Pre-main, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
    val job = launch(Dispatchers.Default + threadLocal.asContextElement(value = "launch")) {
        println("Launch start, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
        yield()
        println("After yield, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
    }
    job.join()
    println("Post-main, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-11.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-11.kt)から取得できます。
>
{style="note"}

この例では、[Dispatchers.Default]を使用してバックグラウンドスレッドプールで新しいコルーチンを起動しているため、スレッドプール内の異なるスレッドで動作しますが、コルーチンがどのスレッドで実行されるかに関わらず、`threadLocal.asContextElement(value = "launch")`を使用して指定したスレッドローカル変数の値を保持しています。
したがって、出力（[デバッグ](#debugging-coroutines-and-threads)を使用）は次のとおりです。

```text
Pre-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
Launch start, current thread: Thread[DefaultDispatcher-worker-1 @coroutine#2,5,main], thread local value: 'launch'
After yield, current thread: Thread[DefaultDispatcher-worker-2 @coroutine#2,5,main], thread local value: 'launch'
Post-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
```

<!--- TEST FLEXIBLE_THREAD -->

対応するコンテキスト要素を設定し忘れることは簡単です。その場合、コルーチンを実行しているスレッドが異なる場合、コルーチンからアクセスされたスレッドローカル変数は予期しない値を持つ可能性があります。
このような状況を避けるために、[ensurePresent]メソッドを使用して、不適切な使用時に即座に失敗することをお勧めします。

`ThreadLocal`は第一級のサポートを受けており、`kotlinx.coroutines`が提供するあらゆるプリミティブと共に使用できます。ただし、1つの主要な制限があります。スレッドローカルが変更された場合、新しい値はコルーチン呼び出し元に伝播されず（コンテキスト要素はすべての`ThreadLocal`オブジェクトへのアクセスを追跡できないため）、更新された値は次のサスペンド時に失われます。[withContext]を使用してコルーチン内のスレッドローカルの値を更新してください。[asContextElement]で詳細を確認できます。

あるいは、値は`class Counter(var i: Int)`のようなミュータブルボックスに格納することもできますが、この場合、このミュータブルボックス内の変数への潜在的な同時変更を同期する責任を完全に負います。

高度な使用法、例えばロギングMDC、トランザクションコンテキスト、または内部的にスレッドローカルを使用してデータを渡すその他のライブラリとの統合については、実装すべき[ThreadContextElement]インターフェースのドキュメントを参照してください。

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[CoroutineDispatcher]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/index.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[Dispatchers.Unconfined]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-unconfined.html
[Dispatchers.Default]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html
[newSingleThreadContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/new-single-thread-context.html
[ExecutorCoroutineDispatcher.close]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-executor-coroutine-dispatcher/close.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[DEBUG_PROPERTY_NAME]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-d-e-b-u-g_-p-r-o-p-e-r-t-y_-n-a-m-e.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[isActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html
[CoroutineScope.coroutineContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/coroutine-context.html
[Job.join]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[CoroutineName]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-name/index.html
[CoroutineScope()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope.html
[MainScope()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main-scope.html
[Dispatchers.Main]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html
[CoroutineScope.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[asContextElement]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/as-context-element.html
[ensurePresent]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-present.html
[ThreadContextElement]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-thread-context-element/index.html

<!--- END -->