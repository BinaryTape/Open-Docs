<!--- TEST_NAME SharedStateGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 共有可能なミュータブルステートと並行処理)

コルーチンは、[Dispatchers.Default] のようなマルチスレッドディスパッチャーを使用して並行して実行できます。これは、典型的な並行処理におけるあらゆる問題を引き起こします。その主な問題は、**共有可能なミュータブルステート**へのアクセスの同期です。コルーチンの世界におけるこの問題のいくつかの解決策は、マルチスレッドの世界での解決策と類似していますが、他は独特です。

## 問題

100個のコルーチンを起動し、それぞれが同じアクションを1000回実行するようにしてみましょう。また、今後の比較のためにそれらの完了時間も測定します。

```kotlin
suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}
```

まず、マルチスレッドの[Dispatchers.Default]を使用して共有可能なミュータブル変数をインクリメントする、非常にシンプルなアクションから始めます。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*    

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
var counter = 0

fun main() = runBlocking {
    withContext(Dispatchers.Default) {
        massiveRun {
            counter++
        }
    }
    println("Counter = $counter")
}
//sampleEnd    
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-01.kt -->
> 全コードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-01.kt)から入手できます。
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

最終的に何が出力されるでしょうか？100個のコルーチンが何の同期もなしに複数のスレッドから`counter`を並行してインクリメントするため、"Counter = 100000"と出力される可能性は非常に低いです。

## volatileは役に立ちません

変数を`volatile`にすることで並行処理の問題が解決するというよくある誤解があります。試してみましょう。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
@Volatile // in Kotlin `volatile` is an annotation 
var counter = 0

fun main() = runBlocking {
    withContext(Dispatchers.Default) {
        massiveRun {
            counter++
        }
    }
    println("Counter = $counter")
}
//sampleEnd    
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-02.kt -->
> 全コードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-02.kt)から入手できます。
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

このコードは動作が遅くなりますが、最終的に常に"Counter = 100000"が得られるわけではありません。なぜなら、volatile変数は対応する変数への線形化可能 (これは「アトミック」という技術用語です) な読み書きを保証しますが、より大きなアクション (我々のケースではインクリメント) のアトミック性を提供しないからです。

## スレッドセーフなデータ構造

スレッドとコルーチンの両方で機能する一般的な解決策は、共有ステート上で実行する必要がある対応する操作に必要なすべての同期を提供する、スレッドセーフ (同期化された、線形化可能な、またはアトミックとも呼ばれる) なデータ構造を使用することです。単純なカウンターの場合、アトミックな`incrementAndGet`操作を持つ`AtomicInteger`クラスを使用できます。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import java.util.concurrent.atomic.*
import kotlin.system.*

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
val counter = AtomicInteger()

fun main() = runBlocking {
    withContext(Dispatchers.Default) {
        massiveRun {
            counter.incrementAndGet()
        }
    }
    println("Counter = $counter")
}
//sampleEnd    
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-03.kt -->
> 全コードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-03.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

これは、この特定の問題に対する最も高速な解決策です。単純なカウンター、コレクション、キュー、その他の標準的なデータ構造やそれらに対する基本的な操作で機能します。しかし、複雑なステートや、すぐに利用できるスレッドセーフな実装がない複雑な操作には簡単にはスケールしません。

## スレッドコンファインメント (きめ細かな)

_スレッドコンファインメント_は、特定の共有ステートへのすべてのアクセスが単一のスレッドに閉じ込められる、共有可能なミュータブルステートの問題へのアプローチです。これは通常、すべてのUIステートが単一のイベントディスパッチ/アプリケーションスレッドに閉じ込められるUIアプリケーションで使用されます。シングルスレッドコンテキストを使用することで、コルーチンで簡単に適用できます。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
val counterContext = newSingleThreadContext("CounterContext")
var counter = 0

fun main() = runBlocking {
    withContext(Dispatchers.Default) {
        massiveRun {
            // confine each increment to a single-threaded context
            withContext(counterContext) {
                counter++
            }
        }
    }
    println("Counter = $counter")
}
//sampleEnd      
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-04.kt -->
> 全コードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-04.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

このコードは、_きめ細かな_スレッドコンファインメントを行うため、非常に遅く動作します。個々のインクリメントごとに、[withContext(counterContext)][withContext]ブロックを使用して、マルチスレッドの[Dispatchers.Default]コンテキストからシングルスレッドコンテキストへ切り替わります。

## スレッドコンファインメント (粗粒度)

実際には、スレッドコンファインメントは大きな塊で行われます。例えば、ステートを更新するビジネスロジックの大きなまとまりが単一のスレッドに閉じ込められます。以下の例は、最初から各コルーチンをシングルスレッドコンテキストで実行することで、そのように行います。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
val counterContext = newSingleThreadContext("CounterContext")
var counter = 0

fun main() = runBlocking {
    // confine everything to a single-threaded context
    withContext(counterContext) {
        massiveRun {
            counter++
        }
    }
    println("Counter = $counter")
}
//sampleEnd     
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-05.kt -->
> 全コードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-05.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

これにより、はるかに高速に動作し、正しい結果が生成されます。

## 相互排他

問題に対する相互排他的な解決策は、共有ステートのすべての変更を、決して並行して実行されない_クリティカルセクション_で保護することです。ブロッキングの世界では、通常、そのために`synchronized`や`ReentrantLock`を使用するでしょう。コルーチンの代替手段は[Mutex]と呼ばれます。これはクリティカルセクションを区切るための[lock][Mutex.lock]関数と[unlock][Mutex.unlock]関数を持っています。主な違いは、`Mutex.lock()`がサスペンド関数であることです。これはスレッドをブロックしません。

また、`mutex.lock(); try { ... } finally { mutex.unlock() }`パターンを便利に表現する[withLock]拡張関数もあります。

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.*
import kotlin.system.*

suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // number of coroutines to launch
    val k = 1000 // times an action is repeated by each coroutine
    val time = measureTimeMillis {
        coroutineScope { // scope for coroutines 
            repeat(n) {
                launch {
                    repeat(k) { action() }
                }
            }
        }
    }
    println("Completed ${n * k} actions in $time ms")    
}

//sampleStart
val mutex = Mutex()
var counter = 0

fun main() = runBlocking {
    withContext(Dispatchers.Default) {
        massiveRun {
            // protect each increment with lock
            mutex.withLock {
                counter++
            }
        }
    }
    println("Counter = $counter")
}
//sampleEnd    
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-sync-06.kt -->
> 全コードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-06.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

この例でのロックはきめ細かいため、その代償を払います。しかし、何らかの共有ステートを定期的にどうしても変更する必要があるが、このステートが閉じ込められる自然なスレッドがないような状況では、良い選択肢です。

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[Dispatchers.Default]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html

<!--- INDEX kotlinx.coroutines.sync -->

[Mutex]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-mutex/index.html
[Mutex.lock]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-mutex/lock.html
[Mutex.unlock]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-mutex/unlock.html
[withLock]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/with-lock.html

<!--- END -->