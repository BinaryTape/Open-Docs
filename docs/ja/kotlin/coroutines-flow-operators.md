<!--- TEST_NAME FlowGuideTest --> 
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: Flowオペレーター)

> 現在、このページを改訂中です。Flowに関する最新のガイドについては、[Flowの概要](coroutines-flow.md)から始めてください。
>
{style="note"}

Flowは、コレクションやシーケンスを変換するのと同じように、オペレーターを使用して変換できます。
中間オペレーター（Intermediate operators）は上流（upstream）のFlowに適用され、下流（downstream）のFlowを返します。
これらのオペレーターは「コールド（cold）」です。このようなオペレーターの呼び出し自体は中断関数（suspending function）ではありません。これらはすぐに実行され、新しく変換されたFlowの定義を返します。

基本的なオペレーターには、[map] や [filter] といったおなじみの名前が付いています。
シーケンスとの重要な違いは、これらのオペレーター内のコードブロックが中断関数を呼び出せる点です。

例えば、リクエストの送信が中断関数によって実装された時間のかかる操作であっても、リクエストのFlowを [map] オペレーターでその結果に変換することができます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart           
suspend fun performRequest(request: Int): String {
    delay(1000) // 長時間の非同期処理を模倣
    return "response $request"
}

fun main() = runBlocking<Unit> {
    (1..3).asFlow() // リクエストのFlow
        .map { request -> performRequest(request) }
        .collect { response -> println(response) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-01.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-01.kt)から入手できます。
>
{style="note"}

これは以下の3行を出力し、各行は前の行から1秒後に表示されます。

```text                                                                    
response 1
response 2
response 3
```

<!--- TEST -->

### Transformオペレーター

Flow変換オペレーターの中で最も汎用的なものは [transform] と呼ばれます。これは [map] や [filter] のような単純な変換を模倣するためだけでなく、より複雑な変換を実装するためにも使用できます。
`transform` オペレーターを使用すると、任意の値を任意の回数 [emit][FlowCollector.emit]（放出）することができます。

例えば、`transform` を使用して、長時間の非同期リクエストを実行する前に文字列を放出し、その後にレスポンスを続けることができます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

suspend fun performRequest(request: Int): String {
    delay(1000) // 長時間の非同期処理を模倣
    return "response $request"
}

fun main() = runBlocking<Unit> {
//sampleStart
    (1..3).asFlow() // リクエストのFlow
        .transform { request ->
            emit("Making request $request") 
            emit(performRequest(request)) 
        }
        .collect { response -> println(response) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-02.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-02.kt)から入手できます。
>
{style="note"}

このコードの出力は以下の通りです：

```text
Making request 1
response 1
Making request 2
response 2
Making request 3
response 3
```

<!--- TEST -->

### サイズ制限オペレーター

[take] のようなサイズ制限中間オペレーターは、対応する制限に達したときにFlowの実行をキャンセルします。コルーチンのキャンセルは常に例外を投げることによって行われるため、キャンセルの場合でもすべてのリソース管理関数（`try { ... } finally { ... }` ブロックなど）が正常に動作します。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun numbers(): Flow<Int> = flow {
    try {                          
        emit(1)
        emit(2) 
        println("This line will not execute")
        emit(3)    
    } finally {
        println("Finally in numbers")
    }
}

fun main() = runBlocking<Unit> {
    numbers() 
        .take(2) // 最初の2つだけを取得
        .collect { value -> println(value) }
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-03.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-03.kt)から入手できます。
>
{style="note"}

このコードの出力は、`numbers()` 関数の `flow { ... }` 本体の実行が2番目の数値を放出した後に停止したことを明確に示しています。

```text       
1
2
Finally in numbers
```

<!--- TEST -->

## 終端Flowオペレーター

Flowにおける終端オペレーター（Terminal operators）は、Flowの収集（collection）を開始する *中断関数* です。[collect] オペレーターは最も基本的なものですが、他にも便利な終端オペレーターがあります：

* [toList] や [toSet] などの様々なコレクションへの変換。
* 最初の値を取得する [first] や、Flowが [single]（単一）の値を放出することを保証するオペレーター。
* [reduce] や [fold] を使用してFlowを1つの値に集約（リデュース）する。

例：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart         
    val sum = (1..5).asFlow()
        .map { it * it } // 1から5までの数値の2乗                           
        .reduce { a, b -> a + b } // それらを合計する（終端オペレーター）
    println(sum)
//sampleEnd     
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-04.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-04.kt)から入手できます。
>
{style="note"}

単一の数値を出力します：

```text
55
```

<!--- TEST -->

## バッファリング（Buffering）

Flowの異なる部分を異なるコルーチンで実行することは、特に長時間の非同期操作が含まれる場合に、Flowの収集にかかる全体の時間の観点から役立ちます。例えば、`simple` Flowによる放出が遅く、1つの要素を生成するのに100 msかかり、収集側（collector）も遅く、1つの要素を処理するのに300 msかかる場合を考えてみましょう。3つの数値を持つこのようなFlowの収集にどれくらいの時間がかかるか見てみましょう。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 100 ms間非同期に待機しているふりをする
        emit(i) // 次の値を放出
    }
}

fun main() = runBlocking<Unit> { 
    val time = measureTimeMillis {
        simple().collect { value -> 
            delay(300) // 300 ms間処理しているふりをする
            println(value) 
        } 
    }   
    println("Collected in $time ms")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-05.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-05.kt)から入手できます。
>
{style="note"}

収集全体で約1200 ms（3つの数値、各400 ms）かかり、次のような結果になります：

```text
1
2
3
Collected in 1220 ms
```

<!--- TEST ARBITRARY_TIME -->

Flowで [buffer] オペレーターを使用すると、`simple` Flowの放出コードを収集コードと順次ではなく並行して実行できます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 100 ms間非同期に待機しているふりをする
        emit(i) // 次の値を放出
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .buffer() // 放出をバッファリングし、待機しない
            .collect { value -> 
                delay(300) // 300 ms間処理しているふりをする
                println(value) 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-06.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-06.kt)から入手できます。
>
{style="note"}

処理パイプラインを効果的に作成したため、同じ数値がより速く生成されます。最初の数値を待つのに100 msだけかかり、その後は各数値の処理に300 msしか費やしません。この方法では、実行に約1000 msかかります。

```text
1
2
3
Collected in 1071 ms
```                    

<!--- TEST ARBITRARY_TIME -->

> [flowOn] オペレーターは [CoroutineDispatcher] を変更する必要がある場合に同じバッファリングメカニズムを使用しますが、ここでは実行コンテキストを変更せずに明示的にバッファリングを要求しています。
>
{style="note"}

### コンフレーション（Conflation）

Flowが操作の中間結果や操作ステータスの更新を表す場合、各値を処理する必要はなく、最新の値のみを処理すればよい場合があります。この場合、[conflate] オペレーターを使用すると、収集側が遅すぎて処理が追いつかない場合に中間値をスキップできます。前の例を基にしてみましょう：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 100 ms間非同期に待機しているふりをする
        emit(i) // 次の値を放出
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .conflate() // 放出を合流（conflate）させ、各値をすべて処理しないようにする
            .collect { value -> 
                delay(300) // 300 ms間処理しているふりをする
                println(value) 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-07.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-07.kt)から入手できます。
>
{style="note"}

最初の数値がまだ処理されている間に2番目と3番目の数値がすでに生成されていたため、2番目の数値は *合流（conflated）* され、最新のもの（3番目）だけが収集側に届けられたことがわかります。

```text
1
3
Collected in 758 ms
```             

<!--- TEST ARBITRARY_TIME -->

### 最新値の処理

コンフレーションは、放出側と収集側の両方が遅い場合に処理を高速化する1つの方法です。これは放出された値を破棄することで実現されます。もう1つの方法は、遅い収集側をキャンセルし、新しい値が放出されるたびに再起動することです。`xxxLatest` オペレーター群があり、`xxx` オペレーターと同じ基本ロジックを実行しますが、新しい値が来るとブロック内のコードをキャンセルします。前の例で [conflate] を [collectLatest] に変更してみましょう：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 100 ms間非同期に待機しているふりをする
        emit(i) // 次の値を放出
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .collectLatest { value -> // 最新の値でキャンセル＆再起動
                println("Collecting $value") 
                delay(300) // 300 ms間処理しているふりをする
                println("Done $value") 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-08.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-08.kt)から入手できます。
>
{style="note"}

[collectLatest] の本体には300 msかかりますが、新しい値は100 msごとに放出されるため、ブロックはすべての値に対して実行されますが、完了するのは最後の値だけであることがわかります。

```text 
Collecting 1
Collecting 2
Collecting 3
Done 3
Collected in 741 ms
``` 

<!--- TEST ARBITRARY_TIME -->

## 複数のFlowの合成

複数のFlowを合成する方法はたくさんあります。

### Zip

Kotlin標準ライブラリの [Sequence.zip] 拡張関数と同様に、Flowには2つのFlowの対応する値を組み合わせる [zip] オペレーターがあります。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow() // 数値 1..3
    val strs = flowOf("one", "two", "three") // 文字列 
    nums.zip(strs) { a, b -> "$a -> $b" } // 単一の文字列に合成
        .collect { println(it) } // 収集して出力
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-09.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-09.kt)から入手できます。
>
{style="note"}

この例は以下を出力します：

```text
1 -> one
2 -> two
3 -> three
```

<!--- TEST -->

### Combine

Flowが変数や操作の最新値を表す場合（[コンフレーション](#conflation)に関する関連セクションも参照）、対応するFlowの最新値に依存する計算を行い、上流のFlowのいずれかが値を放出するたびに再計算する必要があるかもしれません。対応するオペレーター群は [combine] と呼ばれます。

例えば、前の例の数値が300 msごとに更新され、文字列が400 msごとに更新される場合、[zip] オペレーターを使用してそれらをジップすると、結果は400 msごとに出力されますが、同じ結果が得られます。

> この例では、各要素を遅延させ、サンプルFlowを放出するコードをより宣言的かつ短くするために、[onEach] 中間オペレーターを使用しています。
>
{style="note"}

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow().onEach { delay(300) } // 300 msごとに数値 1..3
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 400 msごとに文字列
    val startTime = System.currentTimeMillis() // 開始時間を記録 
    nums.zip(strs) { a, b -> "$a -> $b" } // "zip" で単一の文字列を合成
        .collect { value -> // 収集して出力 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-10.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-10.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
1 -> one at 437 ms from start
2 -> two at 837 ms from start
3 -> three at 1243 ms from start
-->

しかし、ここで [zip] の代わりに [combine] オペレーターを使用すると：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow().onEach { delay(300) } // 300 msごとに数値 1..3
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 400 msごとに文字列          
    val startTime = System.currentTimeMillis() // 開始時間を記録 
    nums.combine(strs) { a, b -> "$a -> $b" } // "combine" で単一の文字列を合成
        .collect { value -> // 収集して出力 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-11.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-11.kt)から入手できます。
>
{style="note"}

`nums` または `strs` Flowのいずれかから放出があるたびに1行が出力される、かなり異なる出力が得られます。

```text 
1 -> one at 452 ms from start
2 -> one at 651 ms from start
2 -> two at 854 ms from start
3 -> two at 952 ms from start
3 -> three at 1256 ms from start
```

<!--- TEST ARBITRARY_TIME -->

## Flowのフラット化

Flowは非同期に受け取られる値のシーケンスを表すため、各値が別の値のシーケンスへのリクエストをトリガーする状況に陥りやすいです。例えば、500 ms間隔で2つの文字列のFlowを返す次の関数があるとします。

```kotlin
fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 500 ms待機
    emit("$i: Second")    
}
```

<!--- CLEAR -->

ここで、3つの整数のFlowがあり、それらの各々に対して次のように `requestFlow` を呼び出すとします。

```kotlin
(1..3).asFlow().map { requestFlow(it) }
```

<!--- CLEAR -->

その結果、さらなる処理のために単一のFlowに「フラット化（flatten）」する必要があるFlowのFlow（`Flow<Flow<String>>`）が出来上がります。コレクションやシーケンスには、このための [flatten][Sequence.flatten] や [flatMap][Sequence.flatMap] オペレーターがあります。しかし、Flowの非同期な性質上、フラット化には異なる *モード* が必要となるため、Flowには一連のフラット化オペレーターが存在します。

### flatMapConcat

FlowのFlowの連結（Concatenation）は、[flatMapConcat] および [flattenConcat] オペレーターによって提供されます。これらは対応するシーケンスのオペレーターの最も直接的なアナログです。次の例に示すように、これらは次のFlowの収集を開始する前に、内部のFlowが完了するのを待ちます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 500 ms待機
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // 開始時間を記録 
    (1..3).asFlow().onEach { delay(100) } // 100 msごとに数値を放出 
        .flatMapConcat { requestFlow(it) }                                                                           
        .collect { value -> // 収集して出力 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-12.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-12.kt)から入手できます。
>
{style="note"}

[flatMapConcat] の逐次的な性質は、出力から明確に見て取れます。

```text                      
1: First at 121 ms from start
1: Second at 622 ms from start
2: First at 727 ms from start
2: Second at 1227 ms from start
3: First at 1328 ms from start
3: Second at 1829 ms from start
```

<!--- TEST ARBITRARY_TIME -->

### flatMapMerge

別のフラット化操作は、入ってくるすべてのFlowを並行して収集し、それらの値を単一のFlowにマージして、値ができるだけ早く放出されるようにすることです。
これは [flatMapMerge] および [flattenMerge] オペレーターによって実装されています。これらは両方とも、同時に収集される並行Flowの数を制限するオプションの `concurrency` パラメータを受け取ります（デフォルトでは [DEFAULT_CONCURRENCY] に等しい）。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 500 ms待機
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // 開始時間を記録 
    (1..3).asFlow().onEach { delay(100) } // 100 msごとに数値 
        .flatMapMerge { requestFlow(it) }                                                                           
        .collect { value -> // 収集して出力 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-13.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-13.kt)から入手できます。
>
{style="note"}

[flatMapMerge] の並行性は明らかです。

```text                      
1: First at 136 ms from start
2: First at 231 ms from start
3: First at 333 ms from start
1: Second at 639 ms from start
2: Second at 732 ms from start
3: Second at 833 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->

> [flatMapMerge] はそのコードブロック（この例では `{ requestFlow(it) }`）を逐次的に呼び出しますが、結果のFlowを並行して収集することに注意してください。これは、最初に逐次的な `map { requestFlow(it) }` を実行し、次にその結果に対して [flattenMerge] を呼び出すのと同等です。
>
{style="note"}

### flatMapLatest

[「最新値の処理」](#processing-the-latest-value) セクションで説明した [collectLatest] オペレーターと同様の方法で、新しいFlowが放出されるとすぐに前のFlowの収集がキャンセルされる、対応する「Latest」フラット化モードがあります。これは [flatMapLatest] オペレーターによって実装されています。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 500 ms待機
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // 開始時間を記録 
    (1..3).asFlow().onEach { delay(100) } // 100 msごとに数値 
        .flatMapLatest { requestFlow(it) }                                                                           
        .collect { value -> // 収集して出力 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-14.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-14.kt)から入手できます。
>
{style="note"}

この例の出力は、[flatMapLatest] がどのように機能するかをよく示しています。

```text                      
1: First at 142 ms from start
2: First at 322 ms from start
3: First at 425 ms from start
3: Second at 931 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->

> [flatMapLatest] は、新しい値を受け取ると、そのブロック内のすべてのコード（この例では `{ requestFlow(it) }`）をキャンセルすることに注意してください。
> この特定の例では、`requestFlow` 自体の呼び出しが高速で非中断であり、キャンセルできないため、違いはありません。しかし、`requestFlow` 内で `delay` のような中断関数を使用していた場合、出力に違いが現れます。
>
{style="note"}

## Flowの完了

Flowの収集が完了したとき（通常終了または例外終了）、特定のアクションを実行する必要がある場合があります。既にお気づきかもしれませんが、これは命令的または宣言的な2つの方法で行うことができます。

### 命令的なfinallyブロック

`try`/`catch` に加えて、収集側は `finally` ブロックを使用して `collect` 完了時にアクションを実行することもできます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = (1..3).asFlow()

fun main() = runBlocking<Unit> {
    try {
        simple().collect { value -> println(value) }
    } finally {
        println("Done")
    }
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-15.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-15.kt)から入手できます。
>
{style="note"}

このコードは、`simple` Flowによって生成された3つの数値を出力し、その後に "Done" 文字列を出力します。

```text
1
2
3
Done
```

<!--- TEST  -->

### 宣言的な処理

宣言的なアプローチとして、FlowにはFlowが完全に収集されたときに呼び出される [onCompletion] 中間オペレーターがあります。

前の例は [onCompletion] オペレーターを使用して書き換えることができ、同じ出力を生成します。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun simple(): Flow<Int> = (1..3).asFlow()

fun main() = runBlocking<Unit> {
//sampleStart
    simple()
        .onCompletion { println("Done") }
        .collect { value -> println(value) }
//sampleEnd
}            
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-16.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-16.kt)から入手できます。
>
{style="note"}

<!--- TEST 
1
2
3
Done
-->

[onCompletion] の主な利点は、Flowの収集が正常に完了したか例外的に完了したかを判断するために使用できるラムダの null 許容な `Throwable` パラメータです。次の例では、`simple` Flowは数値 1 を放出した後に例外をスローします。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    emit(1)
    throw RuntimeException()
}

fun main() = runBlocking<Unit> {
    simple()
        .onCompletion { cause -> if (cause != null) println("Flow completed exceptionally") }
        .catch { cause -> println("Caught exception") }
        .collect { value -> println(value) }
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-17.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-17.kt)から入手できます。
>
{style="note"}

予想通り、以下のように出力されます：

```text
1
Flow completed exceptionally
Caught exception
```

<!--- TEST -->

[onCompletion] オペレーターは、[catch] とは異なり、例外を処理しません。上記のコード例からわかるように、例外は依然として下流に流れます。それはさらなる `onCompletion` オペレーターに渡され、`catch` オペレーターで処理することができます。

### 正常終了

[catch] オペレーターとのもう1つの違いは、[onCompletion] がすべての例外を確認し、上流のFlowが正常に完了した場合（キャンセルや失敗なし）にのみ `null` 例外を受け取ることです。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = (1..3).asFlow()

fun main() = runBlocking<Unit> {
    simple()
        .onCompletion { cause -> println("Flow completed with $cause") }
        .collect { value ->
            check(value <= 1) { "Collected $value" }                 
            println(value) 
        }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-18.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-18.kt)から入手できます。
>
{style="note"}

下流の例外によりFlowが中止されたため、完了の原因（cause）が null ではないことがわかります。

```text 
1
Flow completed with java.lang.IllegalStateException: Collected 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## Flowの起動（Launching flow）

Flowを使用して、何らかのソースから送られてくる非同期イベントを表現するのは簡単です。この場合、入ってくるイベントに対する反応を伴うコードを登録し、さらに作業を続ける `addEventListener` 関数のようなアナログが必要です。[onEach] オペレーターがこの役割を果たすことができます。しかし、`onEach` は中間オペレーターです。Flowを収集するためには終端オペレーターも必要です。そうでなければ、単に `onEach` を呼び出すだけでは効果がありません。

`onEach` の後に [collect] 終端オペレーターを使用すると、その後のコードはFlowが収集されるまで待機します。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
// イベントのFlowを模倣
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .collect() // <--- Flowの収集を待機する
    println("Done")
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-19.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-19.kt)から入手できます。
>
{style="note"}

ご覧の通り、以下のように出力されます：

```text 
Event: 1
Event: 2
Event: 3
Done
```    

<!--- TEST -->

ここで [launchIn] 終端オペレーターが役に立ちます。`collect` を `launchIn` に置き換えることで、別のコルーチンでFlowの収集を開始できるため、以降のコードの実行がすぐに続行されます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

// イベントのFlowを模倣
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

//sampleStart
fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .launchIn(this) // <--- 別のコルーチンでFlowを起動
    println("Done")
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-20.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-20.kt)から入手できます。
>
{style="note"}

以下のように出力されます：

```text          
Done
Event: 1
Event: 2
Event: 3
```    

<!--- TEST -->

`launchIn` に必要なパラメータには、Flowを収集するコルーチンを起動する [CoroutineScope] を指定する必要があります。上の例では、このスコープは [runBlocking] コルーチンビルダーから提供されているため、Flowが実行されている間、この [runBlocking] スコープはその子コルーチンの完了を待ち、main関数がリターンしてこの例を終了するのを防ぎます。

実際のアプリケーションでは、スコープは有効期間が限られたエンティティから提供されます。そのエンティティの有効期間が終了するとすぐに、対応するスコープがキャンセルされ、対応するFlowの収集もキャンセルされます。このようにして、`onEach { ... }.launchIn(scope)` のペアは `addEventListener` のように機能します。ただし、キャンセルと構造化された並行性（structured concurrency）がその目的を果たすため、対応する `removeEventListener` 関数は必要ありません。

[launchIn] も [Job] を返すことに注意してください。これを使用して、スコープ全体をキャンセルすることなく、対応するFlow収集コルーチンのみを [キャンセル][Job.cancel] したり、[join][Job.join] したりすることができます。

<!-- stdlib references -->

[collections]: https://kotlinlang.org/docs/reference/collections-overview.html
[List]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/
[forEach]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/for-each.html
[Sequence]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/
[Sequence.zip]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/zip.html
[Sequence.flatten]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/flatten.html
[Sequence.flatMap]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/flat-map.html
[exceptions]: https://kotlinlang.org/docs/reference/exceptions.html

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[CoroutineDispatcher]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/index.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[Job.join]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html

<!--- INDEX kotlinx.coroutines.flow -->

[map]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html
[filter]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html
[transform]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html
[FlowCollector.emit]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html
[take]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/take.html
[collect]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html
[toList]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/to-list.html
[toSet]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/to-set.html
[first]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/first.html
[single]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/single.html
[reduce]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/reduce.html
[fold]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/fold.html
[buffer]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html
[flowOn]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow-on.html
[conflate]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/conflate.html
[collectLatest]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect-latest.html
[zip]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/zip.html
[combine]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/combine.html
[onEach]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/on-each.html
[flatMapConcat]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flat-map-concat.html
[flattenConcat]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flatten-concat.html
[flatMapMerge]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flat-map-merge.html
[flattenMerge]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flatten-merge.html
[DEFAULT_CONCURRENCY]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-d-e-f-a-u-l-t_-c-o-n-c-u-r-r-e-n-c-y.html
[flatMapLatest]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flat-map-latest.html
[onCompletion]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/on-completion.html
[catch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/catch.html
[launchIn]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/launch-in.html

<!--- END -->