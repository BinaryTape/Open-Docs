<!--- TEST_NAME DispatcherGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンのコンテキストとディスパッチャー)

コルーチンは常に、Kotlin標準ライブラリで定義されている [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 型の値で表される何らかのコンテキストで実行されます。

コルーチンコンテキストは様々な要素の集合です。主要な要素は、以前に説明したコルーチンの [Job] と、このセクションで説明するディスパッチャーです。

## ディスパッチャーとスレッド

コルーチンコンテキストには、対応するコルーチンが実行に使用するスレッドを決定する _コルーチンディスパッチャー_ ( [CoroutineDispatcher] を参照) が含まれています。コルーチンディスパッチャーは、コルーチンの実行を特定のスレッドに限定したり、スレッドプールにディスパッチしたり、束縛されずに実行させたりすることができます。

[launch] や [async] のようなすべてのコルーチンビルダーは、オプションの [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) パラメーターを受け入れます。これを使用して、新しいコルーチンやその他のコンテキスト要素のディスパッチャーを明示的に指定できます。

次の例を試してみてください:

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-01.kt)から入手できます。
>
{style="note"}

これは次の出力を生成します (順序は異なる場合があります):

```text
Unconfined            : I'm working in thread main
Default               : I'm working in thread DefaultDispatcher-worker-1
newSingleThreadContext: I'm working in thread MyOwnThread
main runBlocking      : I'm working in thread main
```

<!--- TEST LINES_START_UNORDERED -->

パラメーターなしで `launch { ... }` を使用すると、起動元の [CoroutineScope] からコンテキスト（およびディスパッチャー）を継承します。この場合、`main` スレッドで実行されるメインの `runBlocking` コルーチンのコンテキストを継承します。

[Dispatchers.Unconfined] は特別なディスパッチャーで、これも `main` スレッドで実行されているように見えますが、実際には異なるメカニズムであり、後で説明されます。

スコープで他のディスパッチャーが明示的に指定されていない場合、デフォルトのディスパッチャーが使用されます。これは [Dispatchers.Default] によって表され、共有されたバックグラウンドスレッドプールを使用します。

[newSingleThreadContext] は、コルーチンを実行するためのスレッドを作成します。専用のスレッドは非常に高価なリソースです。実際のアプリケーションでは、不要になったら [close][ExecutorCoroutineDispatcher.close] 関数を使用して解放するか、トップレベル変数に格納してアプリケーション全体で再利用する必要があります。

## Unconfined ディスパッチャー vs confined ディスパッチャー

[Dispatchers.Unconfined] コルーチンディスパッチャーは、呼び出し元のスレッドでコルーチンを起動しますが、最初のサスペンドポイントまでしかそうしません。サスペンド後、コルーチンは、呼び出されたサスペンド関数によって完全に決定されるスレッドで再開されます。unconfined ディスパッチャーは、CPU時間を消費せず、特定のスレッドに限定された共有データ（UIなど）を更新しないコルーチンに適しています。

一方、ディスパッチャーはデフォルトで外側の [CoroutineScope] から継承されます。[runBlocking] コルーチンのデフォルトのディスパッチャーは特に、呼び出し元のスレッドに限定されているため、それを継承すると、予測可能なFIFOスケジューリングでこのスレッドへの実行が限定される効果があります。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-02.kt)から入手できます。
>
{style="note"}

出力は次のとおりです:

```text
Unconfined      : I'm working in thread main
main runBlocking: I'm working in thread main
Unconfined      : After delay in thread kotlinx.coroutines.DefaultExecutor
main runBlocking: After delay in thread main
```

<!--- TEST LINES_START -->

したがって、`runBlocking {...}` からコンテキストを継承したコルーチンは `main` スレッドで実行を継続しますが、unconfined コルーチンは [delay] 関数が使用しているデフォルトのエグゼキュータースレッドで再開します。

> unconfined ディスパッチャーは高度なメカニズムであり、コルーチンの実行のためのディスパッチが不要な場合や、コルーチン内の一部の操作をすぐに実行する必要があるため望ましくない副作用が生じるような、特定のコーナーケースで役立ちます。unconfined ディスパッチャーは一般的なコードでは使用すべきではありません。
>
{style="note"}

## コルーチンとスレッドのデバッグ

コルーチンは、あるスレッドでサスペンドし、別のスレッドで再開することができます。単一スレッドディスパッチャーであっても、特別なツールがない場合、コルーチンが何を、どこで、いつ行っていたかを把握するのは難しいかもしれません。

### IDEAでのデバッグ

KotlinプラグインのCoroutine Debuggerは、IntelliJ IDEAでのコルーチンのデバッグを簡素化します。

> デバッグは `kotlinx-coroutines-core` のバージョン1.3.8以降で機能します。
>
{style="note"}

**Debug** ツールウィンドウには **Coroutines** タブがあります。このタブでは、現在実行中のコルーチンとサスペンド中のコルーチンの両方に関する情報を見つけることができます。コルーチンは、実行されているディスパッチャーごとにグループ化されています。

![Debugging coroutines](coroutine-idea-debugging-1.png){width=700}

コルーチンデバッガーを使用すると、次のことができます:
*   各コルーチンの状態を確認する。
*   実行中およびサスペンド中のコルーチンの両方について、ローカル変数およびキャプチャされた変数の値を確認する。
*   完全なコルーチン作成スタック、およびコルーチン内の呼び出しスタックを確認する。スタックには、標準デバッグ中に失われる可能性のあるものも含め、すべてのフレームと変数値が含まれます。
*   各コルーチンの状態とそのスタックを含む完全なレポートを取得する。これを行うには、**Coroutines** タブ内で右クリックし、**Get Coroutines Dump** をクリックします。

コルーチンデバッグを開始するには、ブレークポイントを設定し、アプリケーションをデバッグモードで実行するだけです。

コルーチンデバッグの詳細については、[チュートリアル](https://kotlinlang.org/docs/tutorials/coroutines/debug-coroutines-with-idea.html)を参照してください。

### ロギングを使用したデバッグ

Coroutine Debuggerを使用せずにスレッドを持つアプリケーションをデバッグするもう1つのアプローチは、各ログステートメントでスレッド名をログファイルに出力することです。この機能は、ロギングフレームワークで普遍的にサポートされています。コルーチンを使用する場合、スレッド名だけでは多くのコンテキストが得られないため、`kotlinx.coroutines` にはこれを容易にするデバッグ機能が含まれています。

次のコードを `-Dkotlinx.coroutines.debug` JVMオプションで実行します:

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-03.kt)から入手できます。
>
{style="note"}

コルーチンは3つあります。`runBlocking` 内のメインコルーチン（#1）と、遅延値 `a`（#2）と `b`（#3）を計算する2つのコルーチンです。これらはすべて `runBlocking` のコンテキストで実行され、メインスレッドに限定されています。このコードの出力は次のとおりです:

```text
[main @coroutine#2] I'm computing a piece of the answer
[main @coroutine#3] I'm computing another piece of the answer
[main @coroutine#1] The answer is 42
```

<!--- TEST FLEXIBLE_THREAD -->

`log` 関数は、スレッド名を角括弧で囲んで出力し、それが `main` スレッドであり、現在実行中のコルーチンの識別子が付加されていることがわかります。この識別子は、デバッグモードがオンの場合、作成されたすべてのコルーチンに連続して割り当てられます。

> デバッグモードは、JVMが `-ea` オプションで実行されたときにもオンになります。デバッグ機能の詳細については、[DEBUG_PROPERTY_NAME] プロパティのドキュメントを参照してください。
>
{style="note"}

## スレッド間の移動

次のコードを `-Dkotlinx.coroutines.debug` JVMオプションで実行します ( [debug](#debugging-coroutines-and-threads) を参照):

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-04.kt)から入手できます。
>
{style="note"}

上記の例は、コルーチンの新しい使用方法を示しています。

最初のテクニックは、指定されたコンテキストで [runBlocking] を使用する方法を示しています。
2番目のテクニックは [withContext] を呼び出すことを含みます。これは、現在のコルーチンをサスペンドし、新しいコンテキストに切り替える可能性があります。新しいコンテキストが既存のコンテキストと異なる場合に限ります。
特に、異なる [CoroutineDispatcher] を指定した場合、追加のディスパッチが必要です。ブロックは新しいディスパッチャーにスケジュールされ、完了すると実行は元のディスパッチャーに戻ります。

結果として、上記のコードの出力は次のようになります:

```text
[Ctx1 @coroutine#1] Started in ctx1
[Ctx2 @coroutine#1] Working in ctx2
[Ctx1 @coroutine#1] Back to ctx1
```

<!--- TEST -->

上記の例では、Kotlin標準ライブラリの `use` 関数を使用して、[newSingleThreadContext] によって作成されたスレッドリソースが不要になったときに適切に解放されています。

## コンテキスト内のJob

コルーチンの [Job] はそのコンテキストの一部であり、`coroutineContext[Job]` 式を使用してそこから取得できます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-05.kt)から入手できます。
>
{style="note"}

[デバッグモード](#debugging-coroutines-and-threads)では、次のような出力が得られます。

```
My job is "coroutine#1":BlockingCoroutine{Active}@6d311334
```

<!--- TEST lines.size == 1 && lines[0].startsWith("My job is \"coroutine#1\":BlockingCoroutine{Active}@") -->

[CoroutineScope] の [isActive] は、`coroutineContext[Job]?.isActive == true` の便利なショートカットにすぎないことに注意してください。

## コルーチンの子

別のコルーチンの [CoroutineScope] でコルーチンが起動されると、[CoroutineScope.coroutineContext] を介してそのコンテキストを継承し、新しいコルーチンの [Job] は親コルーチンのJobの _子_ となります。親コルーチンがキャンセルされると、そのすべての子も再帰的にキャンセルされます。

ただし、この親子関係は、次の2つの方法のいずれかで明示的にオーバーライドできます。

1.  コルーチンを起動する際に異なるスコープを明示的に指定した場合（例: `GlobalScope.launch`）、親スコープから `Job` を継承しません。
2.  新しいコルーチンのコンテキストとして異なる `Job` オブジェクトが渡された場合（以下の例に示すように）、親スコープの `Job` をオーバーライドします。

どちらの場合も、起動されたコルーチンは起動元のスコープに束縛されず、独立して動作します。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-06.kt)から入手できます。
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

## 親の責務

親コルーチンは、常にすべての子の完了を待ちます。親は、起動したすべての子を明示的に追跡したり、最後にそれらを待つために [Job.join] を使用したりする必要はありません。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-07.kt)から入手できます。
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

## デバッグのためのコルーチンの命名

自動的に割り当てられるIDは、コルーチンが頻繁にログを出力し、同じコルーチンからのログレコードを関連付けたいだけの場合には適しています。しかし、コルーチンが特定の要求の処理や特定のバックグラウンドタスクの実行に結びついている場合、デバッグ目的でそれを明示的に命名する方が良いでしょう。[CoroutineName] コンテキスト要素は、スレッド名と同じ目的を果たします。これは、[デバッグモード](#debugging-coroutines-and-threads)がオンの場合、このコルーチンを実行しているスレッド名に含まれます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-08.kt)から入手できます。
>
{style="note"}

`-Dkotlinx.coroutines.debug` JVMオプションで生成される出力は次のようになります。

```text
[main @main#1] Started main coroutine
[main @v1coroutine#2] Computing v1
[main @v2coroutine#3] Computing v2
[main @main#1] The answer for v1 * v2 = 42
```

<!--- TEST FLEXIBLE_THREAD -->

## コンテキスト要素の結合

コルーチンコンテキストに複数の要素を定義する必要がある場合があります。そのために `+` 演算子を使用できます。
例えば、明示的に指定されたディスパッチャーと明示的に指定された名前を同時に持つコルーチンを起動できます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-09.kt)から入手できます。
>
{style="note"}

`-Dkotlinx.coroutines.debug` JVMオプションでのこのコードの出力は次のとおりです。

```text
I'm working in thread DefaultDispatcher-worker-1 @test#2
```

<!--- TEST FLEXIBLE_THREAD -->

## コルーチンスコープ

コンテキスト、子、ジョブに関する知識をまとめましょう。
アプリケーションにライフサイクルを持つオブジェクトがあるが、そのオブジェクトがコルーチンではないと仮定します。
例えば、Androidアプリケーションを作成していて、データフェッチと更新、アニメーションなどを実行するために、Androidアクティビティのコンテキストで様々なコルーチンを起動しているとします。これらのコルーチンは、メモリリークを避けるために、アクティビティが破棄されるときにキャンセルされなければなりません。
もちろん、手動でコンテキストとジョブを操作してアクティビティとそのコルーチンのライフサイクルを結合することもできますが、`kotlinx.coroutines` はそれをカプセル化する抽象化として [CoroutineScope] を提供しています。すべてのコルーチンビルダーはそれの拡張として宣言されているため、コルーチンスコープにはすでにおなじみのはずです。

アクティビティのライフサイクルに結合された [CoroutineScope] のインスタンスを作成することで、コルーチンのライフサイクルを管理します。`CoroutineScope` インスタンスは、[CoroutineScope()] または [MainScope()] ファクトリ関数によって作成できます。前者は汎用スコープを作成し、後者はUIアプリケーション用のスコープを作成し、デフォルトのディスパッチャーとして [Dispatchers.Main] を使用します。

```kotlin
class Activity {
    private val mainScope = MainScope()
    
    fun destroy() {
        mainScope.cancel()
    }
    // to be continued ...
```

これで、定義した `mainScope` を使用して、この `Activity` のスコープ内でコルーチンを起動できます。
デモのために、異なる時間だけ遅延する10個のコルーチンを起動します。

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

メイン関数では、アクティビティを作成し、テスト用の `doSomething` 関数を呼び出し、500ミリ秒後にアクティビティを破棄します。これにより、`doSomething` から起動されたすべてのコルーチンがキャンセルされます。アクティビティの破棄後、少し長く待ってもメッセージがそれ以上出力されないことから、このことを確認できます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-10.kt)から入手できます。
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

ご覧のとおり、最初の2つのコルーチンのみがメッセージを出力し、残りは `Activity.destroy()` 内の [`mainScope.cancel()`][CoroutineScope.cancel] の1回の呼び出しによってキャンセルされます。

> Androidには、ライフサイクルを持つすべてのエンティティにおいてコルーチンスコープのファーストパーティサポートがあることに注意してください。[対応するドキュメント](https://developer.android.com/topic/libraries/architecture/coroutines#lifecyclescope)を参照してください。
>
{style="note"}

### スレッドローカルデータ

コルーチンにスレッドローカルなデータを渡したり、コルーチン間でデータを渡したりできると便利な場合があります。しかし、コルーチンは特定のスレッドに束縛されていないため、手動で行うとボイラープレート（定型コード）が増える可能性があります。

[`ThreadLocal`](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html) の場合、[asContextElement] 拡張関数が役立ちます。これは、指定された `ThreadLocal` の値を保持し、コルーチンがコンテキストを切り替えるたびにその値を復元する追加のコンテキスト要素を作成します。

これを実際に示すのは簡単です。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-11.kt)から入手できます。
>
{style="note"}

この例では、[Dispatchers.Default] を使用してバックグラウンドスレッドプールで新しいコルーチンを起動しているため、スレッドプール内の異なるスレッドで動作しますが、コルーチンがどのスレッドで実行されても、`threadLocal.asContextElement(value = "launch")` を使用して指定したスレッドローカル変数の値を持っています。
したがって、出力（[デバッグ](#debugging-coroutines-and-threads)付き）は次のとおりです。

```text
Pre-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
Launch start, current thread: Thread[DefaultDispatcher-worker-1 @coroutine#2,5,main], thread local value: 'launch'
After yield, current thread: Thread[DefaultDispatcher-worker-2 @coroutine#2,5,main], thread local value: 'launch'
Post-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
```

<!--- TEST FLEXIBLE_THREAD -->

対応するコンテキスト要素を設定し忘れるのは簡単です。コルーチンからアクセスされるスレッドローカル変数は、コルーチンを実行しているスレッドが異なる場合、予期しない値を持つ可能性があります。このような状況を避けるために、[ensurePresent] メソッドを使用して、不適切な使用方法でフェイルファストすることをお勧めします。

`ThreadLocal` はファーストクラスのサポートがあり、`kotlinx.coroutines` が提供するあらゆるプリミティブと共に使用できます。ただし、1つの主要な制限があります。スレッドローカルが変更されても、新しい値はコルーチンの呼び出し元に伝播されず（コンテキスト要素はすべての `ThreadLocal` オブジェクトアクセスを追跡できないため）、更新された値は次のサスペンド時に失われます。コルーチン内のスレッドローカルの値を更新するには、[withContext] を使用してください。[asContextElement] で詳細を参照してください。

あるいは、`class Counter(var i: Int)` のような可変のボックスに値を格納し、それがスレッドローカル変数に格納されるという方法もあります。
ただし、この場合、この可変のボックス内の変数の、起こりうる同時変更を同期する責任は完全に開発者にあります。

より高度な使用方法、例えば、ロギングMDC、トランザクションコンテキスト、または内部でスレッドローカルを使用してデータを渡すその他のライブラリとの統合については、実装すべき [ThreadContextElement] インターフェースのドキュメントを参照してください。

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