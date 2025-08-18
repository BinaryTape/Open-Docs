<!--- TEST_NAME SharedStateGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 共有ミュータブルステートと並行処理)

コルーチンは、[Dispatchers.Default] のようなマルチスレッドディスパッチャーを使用して並行して実行できます。これは、
通常の並行処理に関するすべての問題を引き起こします。主な問題は、**共有ミュータブルステート**へのアクセス同期です。
コルーチンにおけるこの問題の解決策には、マルチスレッドの世界での解決策と似ているものもありますが、コルーチン特有のものもあります。

## 問題

100個のコルーチンを起動し、それぞれが同じアクションを1000回実行してみましょう。
さらに比較するために、それらの完了時間も計測します。

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

まずは、マルチスレッドの [Dispatchers.Default] を使用して共有ミュータブル変数をインクリメントするという非常にシンプルなアクションから始めます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-01.kt)から入手できます。
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

最終的に何が出力されるでしょうか？100個のコルーチンが同期なしに複数のスレッドから`counter`を並行してインクリメントするため、「Counter = 100000」と出力されることはまずありません。

## `volatile`は役に立たない

変数を `volatile` にすることで並行処理の問題が解決されるという誤解がよくあります。試してみましょう。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-02.kt)から入手できます。
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

このコードは動作が遅くなりますが、最終的に「Counter = 100000」が常に得られるわけではありません。`volatile`変数は、対応する変数への線形化可能（これは「アトミック」の技術用語です）な読み書きを保証しますが、より大きなアクション（この場合はインクリメント）のアトミシティは提供しないためです。

## スレッドセーフなデータ構造

スレッドとコルーチンの両方で機能する一般的な解決策は、共有ステートで実行する必要がある対応する操作に必要なすべての同期を提供する、スレッドセーフ（同期、線形化可能、またはアトミックとも呼ばれます）なデータ構造を使用することです。
単純なカウンターの場合、アトミックな `incrementAndGet` 操作を持つ `AtomicInteger` クラスを使用できます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-03.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

これは、この特定の問題に対する最速の解決策です。これは、単純なカウンター、コレクション、キュー、その他の標準的なデータ構造、およびそれらに対する基本的な操作で機能します。しかし、複雑なステートや、すぐに使用できるスレッドセーフな実装がない複雑な操作には、容易にスケールしません。

## スレッド隔離（きめ細かい）

_スレッド隔離（Thread confinement）_とは、特定の共有ステートへのすべてのアクセスを単一のスレッドに限定する、共有ミュータブルステートの問題に対するアプローチです。これは通常、すべてのUIステートが単一のイベントディスパッチ/アプリケーションスレッドに限定されるUIアプリケーションで使用されます。コルーチンでは、単一スレッドコンテキストを使用することで簡単に適用できます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-04.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

このコードは非常に遅く動作します。それは_きめ細かい（fine-grained）_スレッド隔離を行っているためです。各インクリメントは、マルチスレッドの [Dispatchers.Default] コンテキストから、[withContext(counterContext)][withContext] ブロックを使用して単一スレッドコンテキストに切り替わります。

## スレッド隔離（粗い）

実際には、スレッド隔離は大きなチャンクで行われます。たとえば、ステートを更新するビジネスロジックの大きなまとまりが単一のスレッドに限定されます。以下の例では、各コルーチンを最初に単一スレッドコンテキストで実行することで、これを実現しています。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-05.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

これにより、はるかに高速に動作し、正しい結果が生成されます。

## 相互排他

この問題に対する相互排他による解決策は、共有ステートのすべての変更を、並行して実行されることのない_クリティカルセクション_で保護することです。ブロッキングの世界では、通常`synchronized`や`ReentrantLock`を使用します。コルーチンの代替は[Mutex]と呼ばれます。これは、クリティカルセクションを区切るための[lock][Mutex.lock]関数と[unlock][Mutex.unlock]関数を持っています。重要な違いは、`Mutex.lock()`がサスペンド関数であることです。これはスレッドをブロックしません。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-06.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

この例のロックはきめ細かいため、パフォーマンスの代償を払います。しかし、定期的に共有ステートをどうしても変更する必要があるものの、そのステートが限定される自然なスレッドがない状況においては、良い選択肢となります。

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