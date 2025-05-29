<!--- TEST_NAME FlowGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 非同期Flow)

中断関数は非同期に単一の値を返しますが、非同期に計算された複数の値を返すにはどうすればよいでしょうか？ここでKotlinのFlowが登場します。

## 複数の値の表現

Kotlinでは、複数の値を[コレクション][collections]を使って表現できます。例えば、3つの数値の[リスト][List]を返す`simple`関数を作成し、[forEach][forEach]を使ってそれらすべてを出力できます。

```kotlin
fun simple(): List<Int> = listOf(1, 2, 3)
 
fun main() {
    simple().forEach { value -> println(value) } 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-01.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-01.kt)から入手できます。
>
{style="note"}

このコードは次のように出力されます。

```text
1
2
3
```

<!--- TEST -->

### シーケンス

CPUを大量に消費するブロッキングコードで数値を計算している場合（各計算に100msかかる）、[シーケンス][Sequence]を使って数値を表現できます。

```kotlin
fun simple(): Sequence<Int> = sequence { // sequence builder
    for (i in 1..3) {
        Thread.sleep(100) // pretend we are computing it
        yield(i) // yield next value
    }
}

fun main() {
    simple().forEach { value -> println(value) } 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-02.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-02.kt)から入手できます。
>
{style="note"}

このコードは同じ数値を表示しますが、それぞれの数値を出力する前に100ms待機します。

<!--- TEST 
1
2
3
-->

### 中断関数

しかし、この計算はコードを実行しているメインスレッドをブロックします。これらの値が非同期コードによって計算される場合、`simple`関数に`suspend`修飾子を付けて、ブロックせずに処理を実行し、結果をリストとして返すことができます。

```kotlin
import kotlinx.coroutines.*                 
                           
//sampleStart
suspend fun simple(): List<Int> {
    delay(1000) // pretend we are doing something asynchronous here
    return listOf(1, 2, 3)
}

fun main() = runBlocking<Unit> {
    simple().forEach { value -> println(value) } 
}
//sampleEnd
```  
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-03.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-03.kt)から入手できます。
>
{style="note"}

このコードは、1秒待ってから数値を表示します。

<!--- TEST 
1
2
3
-->

### Flow

`List<Int>`の結果型を使用すると、すべての値を一度に返すことしかできません。非同期に計算される値のストリームを表現するには、同期的に計算される値に`Sequence<Int>`型を使用するのと同様に、[`Flow<Int>`][Flow]型を使用できます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart               
fun simple(): Flow<Int> = flow { // flow builder
    for (i in 1..3) {
        delay(100) // pretend we are doing something useful here
        emit(i) // emit next value
    }
}

fun main() = runBlocking<Unit> {
    // Launch a concurrent coroutine to check if the main thread is blocked
    launch {
        for (k in 1..3) {
            println("I'm not blocked $k")
            delay(100)
        }
    }
    // Collect the flow
    simple().collect { value -> println(value) } 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-04.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-04.kt)から入手できます。
>
{style="note"}

このコードは、メインスレッドをブロックすることなく、各数値を出力する前に100ms待機します。これは、メインスレッドで実行されている別のコルーチンから100msごとに「I'm not blocked」と出力されることで確認できます。

```text
I'm not blocked 1
1
I'm not blocked 2
2
I'm not blocked 3
3
```

<!--- TEST -->

以前の例の[Flow]との以下の違いに注目してください。

*   [Flow]型のビルダー関数は[flow][\_flow]と呼ばれます。
*   `flow { ... }`ビルダーブロック内のコードは中断（suspend）できます。
*   `simple`関数には`suspend`修飾子が付けられていません。
*   値は[emit][FlowCollector.emit]関数を使ってFlowから_emit_されます。
*   値は[collect][collect]関数を使ってFlowから_collect_されます。

> `simple`の`flow { ... }`の本体で[delay][delay]を`Thread.sleep`に置き換えると、この場合メインスレッドがブロックされることがわかります。
>
{style="note"}

## Flowはコールドです

Flowはシーケンスと同様に_コールド_ストリームです。— [flow][\_flow]ビルダー内のコードは、Flowがcollectされるまで実行されません。これは次の例で明らかになります。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart      
fun simple(): Flow<Int> = flow { 
    println("Flow started")
    for (i in 1..3) {
        delay(100)
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    println("Calling simple function...")
    val flow = simple()
    println("Calling collect...")
    flow.collect { value -> println(value) } 
    println("Calling collect again...")
    flow.collect { value -> println(value) } 
}
//sampleEnd
```  
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-05.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-05.kt)から入手できます。
>
{style="note"}

これは次のように出力されます。

```text
Calling simple function...
Calling collect...
Flow started
1
2
3
Calling collect again...
Flow started
1
2
3
```

<!--- TEST -->
 
これが、`simple`関数（Flowを返す）に`suspend`修飾子が付けられていない主な理由です。`simple()`の呼び出し自体はすぐに戻り、何も待機しません。Flowはcollectされるたびに最初から開始されるため、`collect`を呼び出すたびに「Flow started」と表示されます。

## Flowのキャンセル基礎

Flowはコルーチンの一般的な協調的キャンセルに従います。通常通り、Flowの収集は、Flowがキャンセル可能な中断関数（[delay][delay]など）で中断されている場合にキャンセルできます。[withTimeoutOrNull][withTimeoutOrNull]ブロック内で実行される場合、Flowがタイムアウトによってキャンセルされ、コードの実行を停止する方法を次の例に示します。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart           
fun simple(): Flow<Int> = flow { 
    for (i in 1..3) {
        delay(100)          
        println("Emitting $i")
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    withTimeoutOrNull(250) { // Timeout after 250ms 
        simple().collect { value -> println(value) } 
    }
    println("Done")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-06.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-06.kt)から入手できます。
>
{style="note"}

`simple`関数内のFlowによって2つの数値のみがemitされ、次の出力が生成されることに注目してください。

```text
Emitting 1
1
Emitting 2
2
Done
```

<!--- TEST -->

詳細は「[Flowのキャンセルチェック](#flow-cancellation-checks)」セクションを参照してください。

## Flowビルダー

これまでの例で登場した`flow { ... }`ビルダーは最も基本的なものです。他にもFlowを宣言できるビルダーがあります。

*   [flowOf][flowOf]ビルダーは、固定された値のセットをemitするFlowを定義します。
*   様々なコレクションやシーケンスは、`.asFlow()`拡張関数を使ってFlowに変換できます。

例えば、Flowから1から3までの数値を表示するスニペットは、次のように書き直すことができます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart
    // Convert an integer range to a flow
    (1..3).asFlow().collect { value -> println(value) }
//sampleEnd 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-07.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-07.kt)から入手できます。
>
{style="note"}

<!--- TEST
1
2
3
-->

## 中間Flow演算子

Flowは、コレクションやシーケンスを変換するのと同じように、演算子を使って変換できます。中間演算子はアップストリームのFlowに適用され、ダウンストリームのFlowを返します。これらの演算子はFlowと同様にコールドです。このような演算子の呼び出し自体は中断関数ではありません。それは素早く動作し、変換された新しいFlowの定義を返します。

基本的な演算子には、[map][map]や[filter][filter]といったおなじみの名前があります。これらの演算子とシーケンスとの重要な違いは、これらの演算子内のコードブロックが中断関数を呼び出せることです。

例えば、入力リクエストのFlowは、[map][map]演算子を使って結果にマップできます。たとえリクエストの実行が中断関数によって実装される時間のかかる操作であってもです。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart           
suspend fun performRequest(request: Int): String {
    delay(1000) // imitate long-running asynchronous work
    return "response $request"
}

fun main() = runBlocking<Unit> {
    (1..3).asFlow() // a flow of requests
        .map { request -> performRequest(request) }
        .collect { response -> println(response) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-08.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-08.kt)から入手できます。
>
{style="note"}

これは次の3行を生成し、それぞれ前の行の1秒後に表示されます。

```text                                                                    
response 1
response 2
response 3
```

<!--- TEST -->

### transform演算子

Flow変換演算子の中で最も一般的なものは[transform][transform]です。[map][map]や[filter][filter]のような単純な変換を模倣できるだけでなく、より複雑な変換も実装できます。`transform`演算子を使用すると、[emit][FlowCollector.emit]によって任意の値を任意の回数emitできます。

例えば、`transform`を使って、時間のかかる非同期リクエストを実行する前に文字列をemitし、その後に応答をemitすることができます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

suspend fun performRequest(request: Int): String {
    delay(1000) // imitate long-running asynchronous work
    return "response $request"
}

fun main() = runBlocking<Unit> {
//sampleStart
    (1..3).asFlow() // a flow of requests
        .transform { request ->
            emit("Making request $request") 
            emit(performRequest(request)) 
        }
        .collect { response -> println(response) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-09.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-09.kt)から入手できます。
>
{style="note"}

このコードの出力は次の通りです。

```text
Making request 1
response 1
Making request 2
response 2
Making request 3
response 3
```

<!--- TEST -->

### サイズ制限演算子

[take][take]のようなサイズ制限中間演算子は、対応する制限に達したときにFlowの実行をキャンセルします。コルーチンでのキャンセルは常に例外をスローすることによって実行されるため、すべてのリソース管理関数（`try { ... } finally { ... }`ブロックなど）はキャンセル時にも正常に動作します。

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
        .take(2) // take only the first two
        .collect { value -> println(value) }
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-10.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-10.kt)から入手できます。
>
{style="note"}

このコードの出力は、`numbers()`関数内の`flow { ... }`の本体の実行が2番目の値をemitした後に停止したことを明確に示しています。

```text       
1
2
Finally in numbers
```

<!--- TEST -->

## ターミナルFlow演算子

Flowのターミナル演算子は、Flowの収集を開始する_中断関数_です。[collect][collect]演算子は最も基本的なものですが、他にもFlowの収集を容易にするターミナル演算子があります。

*   [toList][toList]や[toSet][toSet]など、様々なコレクションへの変換。
*   [first][first]値を取得する演算子と、Flowが[single][single]値をemitすることを保証する演算子。
*   [reduce][reduce]と[fold][fold]によるFlowの値への還元。

例:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart         
    val sum = (1..5).asFlow()
        .map { it * it } // squares of numbers from 1 to 5                           
        .reduce { a, b -> a + b } // sum them (terminal operator)
    println(sum)
//sampleEnd     
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-11.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-11.kt)から入手できます。
>
{style="note"}

単一の数値が出力されます。

```text
55
```

<!--- TEST -->

## Flowはシーケンシャルです

Flowの個々の収集は、複数のFlowに対して動作する特殊な演算子を使用しない限り、シーケンシャルに実行されます。収集は、ターミナル演算子を呼び出すコルーチンで直接動作します。デフォルトでは新しいコルーチンは起動されません。emitされた各値は、アップストリームからダウンストリームまでのすべての中間演算子によって処理され、その後ターミナル演算子に渡されます。

偶数をフィルタリングし、それらを文字列にマップする次の例を見てください。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart         
    (1..5).asFlow()
        .filter {
            println("Filter $it")
            it % 2 == 0              
        }              
        .map { 
            println("Map $it")
            "string $it"
        }.collect { 
            println("Collect $it")
        }    
//sampleEnd                  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-12.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-12.kt)から入手できます。
>
{style="note"}

出力:

```text
Filter 1
Filter 2
Map 2
Collect string 2
Filter 3
Filter 4
Map 4
Collect string 4
Filter 5
```

<!--- TEST -->

## Flowコンテキスト

Flowの収集は常に呼び出し元のコルーチンのコンテキストで発生します。例えば、`simple` Flowがある場合、次のコードは、`simple` Flowの実装詳細に関わらず、このコードの作成者によって指定されたコンテキストで実行されます。

```kotlin
withContext(context) {
    simple().collect { value ->
        println(value) // run in the specified context 
    }
}
```

<!--- CLEAR -->

Flowのこのプロパティは、_コンテキストの保存_と呼ばれます。

したがって、デフォルトでは、`flow { ... }`ビルダー内のコードは、対応するFlowのコレクターによって提供されるコンテキストで実行されます。例えば、呼び出されたスレッドを出力し、3つの数値をemitする`simple`関数の実装を考えてみましょう。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")
           
//sampleStart
fun simple(): Flow<Int> = flow {
    log("Started simple flow")
    for (i in 1..3) {
        emit(i)
    }
}  

fun main() = runBlocking<Unit> {
    simple().collect { value -> log("Collected $value") } 
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-13.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-13.kt)から入手できます。
>
{style="note"}

このコードを実行すると、次のように出力されます。

```text  
[main @coroutine#1] Started simple flow
[main @coroutine#1] Collected 1
[main @coroutine#1] Collected 2
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

`simple().collect`がメインスレッドから呼び出されるため、`simple`のFlowの本体もメインスレッドで呼び出されます。これは、高速に実行されるコードや非同期コードにとって完璧なデフォルトであり、実行コンテキストを気にせず、呼び出し元をブロックしません。

### withContextを使用する際の一般的な落とし穴

ただし、時間のかかるCPUを大量に消費するコードは[Dispatchers.Default][Dispatchers.Default]のコンテキストで実行する必要がある場合がありますし、UI更新コードは[Dispatchers.Main][Dispatchers.Main]のコンテキストで実行する必要があるかもしれません。通常、[withContext][withContext]はKotlinコルーチンを使用するコードでコンテキストを変更するために使用されますが、`flow { ... }`ビルダー内のコードはコンテキストの保存プロパティを尊重する必要があり、異なるコンテキストから[emit][FlowCollector.emit]することは許可されていません。

次のコードを実行してみてください。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
                      
//sampleStart
fun simple(): Flow<Int> = flow {
    // The WRONG way to change context for CPU-consuming code in flow builder
    kotlinx.coroutines.withContext(Dispatchers.Default) {
        for (i in 1..3) {
            Thread.sleep(100) // pretend we are computing it in CPU-consuming way
            emit(i) // emit next value
        }
    }
}

fun main() = runBlocking<Unit> {
    simple().collect { value -> println(value) } 
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-14.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-14.kt)から入手できます。
>
{style="note"}

このコードは次の例外を生成します。

```text
Exception in thread "main" java.lang.IllegalStateException: Flow invariant is violated:
		Flow was collected in [CoroutineId(1), "coroutine#1":BlockingCoroutine{Active}@5511c7f8, BlockingEventLoop@2eac3323],
		but emission happened in [CoroutineId(1), "coroutine#1":DispatchedCoroutine{Active}@2dae0000, Dispatchers.Default].
		Please refer to 'flow' documentation or use 'flowOn' instead
	at ...
``` 

<!--- TEST EXCEPTION -->

### flowOn演算子
   
この例外は、Flowのemitのコンテキストを変更するために使用されるべき[flowOn][flowOn]関数を参照しています。Flowのコンテキストを変更する正しい方法は次の例で示されています。これは、すべてがどのように機能するかを示すために対応するスレッド名も出力します。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")
           
//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        Thread.sleep(100) // pretend we are computing it in CPU-consuming way
        log("Emitting $i")
        emit(i) // emit next value
    }
}.flowOn(Dispatchers.Default) // RIGHT way to change context for CPU-consuming code in flow builder

fun main() = runBlocking<Unit> {
    simple().collect { value ->
        log("Collected $value") 
    } 
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-15.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-15.kt)から入手できます。
>
{style="note"}
  
`flow { ... }`がバックグラウンドスレッドで動作し、収集がメインスレッドで発生することに注目してください。

```text
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 1
[main @coroutine#1] Collected 1
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 2
[main @coroutine#1] Collected 2
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 3
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

ここで観察すべきもう1つの点は、[flowOn][flowOn]演算子がFlowのデフォルトのシーケンシャルな性質を変更したことです。これで、収集は1つのコルーチン（"coroutine#1"）で発生し、emitは収集するコルーチンと並行して別のスレッドで実行されている別のコルーチン（"coroutine#2"）で発生します。[flowOn][flowOn]演算子は、コンテキストの[CoroutineDispatcher][CoroutineDispatcher]を変更する必要がある場合に、アップストリームのFlow用に別のコルーチンを作成します。

## バッファリング

Flowの異なる部分を異なるコルーチンで実行することは、特に時間のかかる非同期操作が関係している場合、Flowを収集するのにかかる全体の時間という観点から役立ちます。例えば、`simple` Flowによるemitが遅く、要素の生成に100msかかり、コレクターも遅く、要素の処理に300msかかるとします。3つの数値を持つそのようなFlowを収集するのにどれくらいの時間がかかるか見てみましょう。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // pretend we are asynchronously waiting 100 ms
        emit(i) // emit next value
    }
}

fun main() = runBlocking<Unit> { 
    val time = measureTimeMillis {
        simple().collect { value -> 
            delay(300) // pretend we are processing it for 300 ms
            println(value) 
        } 
    }   
    println("Collected in $time ms")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-16.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-16.kt)から入手できます。
>
{style="note"}

これは次のような出力を生成し、全体の収集に約1200msかかります（3つの数値、それぞれ400ms）。

```text
1
2
3
Collected in 1220 ms
```

<!--- TEST ARBITRARY_TIME -->

Flowで[buffer][buffer]演算子を使用すると、`simple` Flowのemitするコードを収集するコードと並行して実行できます。シーケンシャルに実行するのとは対照的です。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // pretend we are asynchronously waiting 100 ms
        emit(i) // emit next value
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .buffer() // buffer emissions, don't wait
            .collect { value -> 
                delay(300) // pretend we are processing it for 300 ms
                println(value) 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-17.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-17.kt)から入手できます。
>
{style="note"}

これにより同じ数値がより速く生成されます。なぜなら、効果的に処理パイプラインを作成し、最初の数値で100ms待つだけで、各数値の処理には300msしかかからないからです。このようにして、実行には約1000msかかります。

```text
1
2
3
Collected in 1071 ms
```                    

<!--- TEST ARBITRARY_TIME -->

> [flowOn][flowOn]演算子は、[CoroutineDispatcher][CoroutineDispatcher]を変更する必要がある場合に同じバッファリングメカニズムを使用しますが、ここでは実行コンテキストを変更せずに明示的にバッファリングを要求しています。
>
{style="note"}

### コンフレーション (Conflation)

Flowが操作の部分的な結果や操作のステータス更新を表現している場合、すべての値を処理する必要はなく、最新のデータのみを処理すればよい場合があります。この場合、コレクターが値を処理するには遅すぎる場合に、[conflate][conflate]演算子を使って中間値をスキップできます。前の例を基に見てみましょう。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // pretend we are asynchronously waiting 100 ms
        emit(i) // emit next value
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .conflate() // conflate emissions, don't process each one
            .collect { value -> 
                delay(300) // pretend we are processing it for 300 ms
                println(value) 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-18.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-18.kt)から入手できます。
>
{style="note"}

最初の数値がまだ処理されている間に2番目と3番目の数値がすでに生成されていたため、2番目の値は_コンフレーション_され、最新の値（3番目の値）のみがコレクターに渡されたことがわかります。

```text
1
3
Collected in 758 ms
```             

<!--- TEST ARBITRARY_TIME -->

### 最新の値の処理

コンフレーション (Conflation) は、エミッターとコレクターの両方が遅い場合に処理を高速化する方法の1つです。これはemitされた値を破棄することで実現します。もう1つの方法は、遅いコレクターをキャンセルし、新しい値がemitされるたびに再起動することです。`xxx`演算子と同じ基本的なロジックを実行しますが、新しい値が来るとブロック内のコードをキャンセルする`xxxLatest`演算子のファミリーがあります。前の例で[conflate][conflate]を[collectLatest][collectLatest]に変更してみましょう。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // pretend we are asynchronously waiting 100 ms
        emit(i) // emit next value
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .collectLatest { value -> // cancel & restart on the latest value
                println("Collecting $value") 
                delay(300) // pretend we are processing it for 300 ms
                println("Done $value") 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-19.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-19.kt)から入手できます。
>
{style="note"}
 
[collectLatest][collectLatest]の本体は300msかかりますが、新しい値は100msごとにemitされるため、ブロックはすべての値で実行されますが、最後の値でのみ完了することがわかります。

```text 
Collecting 1
Collecting 2
Collecting 3
Done 3
Collected in 741 ms
``` 

<!--- TEST ARBITRARY_TIME -->

## 複数のFlowの結合

複数のFlowを結合する方法はたくさんあります。

### Zip

Kotlin標準ライブラリの[Sequence.zip][Sequence.zip]拡張関数と同様に、Flowには2つのFlowの対応する値を結合する[zip][zip]演算子があります。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow() // numbers 1..3
    val strs = flowOf("one", "two", "three") // strings 
    nums.zip(strs) { a, b -> "$a -> $b" } // compose a single string
        .collect { println(it) } // collect and print
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-20.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-20.kt)から入手できます。
>
{style="note"}

この例は次のように出力します。

```text
1 -> one
2 -> two
3 -> three
```
 
<!--- TEST -->

### Combine

Flowが変数や操作の最新の値を表現している場合（関連セクション「[コンフレーション (Conflation)](#conflation)」も参照）、対応するFlowの最新の値に依存する計算を実行し、アップストリームのいずれかのFlowが値をemitするたびにそれを再計算する必要がある場合があります。対応する演算子ファミリーは[combine][combine]と呼ばれます。

例えば、前の例で数値が300msごとに更新され、文字列が400msごとに更新される場合でも、[zip][zip]演算子を使ってそれらをzipすると同じ結果が生成されますが、結果は400msごとに表示されます。

> この例では、[onEach][onEach]中間演算子を使用して各要素を遅延させ、サンプルFlowをemitするコードをより宣言的で短くしています。
>
{style="note"}

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow().onEach { delay(300) } // numbers 1..3 every 300 ms
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // strings every 400 ms
    val startTime = System.currentTimeMillis() // remember the start time 
    nums.zip(strs) { a, b -> "$a -> $b" } // compose a single string with "zip"
        .collect { value -> // collect and print 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-21.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-21.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
1 -> one at 437 ms from start
2 -> two at 837 ms from start
3 -> three at 1243 ms from start
-->

しかし、ここで[zip][zip]の代わりに[combine][combine]演算子を使用すると、

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow().onEach { delay(300) } // numbers 1..3 every 300 ms
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // strings every 400 ms          
    val startTime = System.currentTimeMillis() // remember the start time 
    nums.combine(strs) { a, b -> "$a -> $b" } // compose a single string with "combine"
        .collect { value -> // collect and print 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-22.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-22.kt)から入手できます。
>
{style="note"}

`nums`または`strs`のいずれかのFlowからの各emitのたびに1行が出力される、かなり異なる出力が得られます。

```text 
1 -> one at 452 ms from start
2 -> one at 651 ms from start
2 -> two at 854 ms from start
3 -> two at 952 ms from start
3 -> three at 1256 ms from start
```

<!--- TEST ARBITRARY_TIME -->

## Flowの平坦化

Flowは非同期に受信される値のシーケンスを表現するため、各値が別の値のシーケンスへのリクエストをトリガーする状況に陥りやすいです。例えば、500ms間隔で2つの文字列のFlowを返す次の関数があるとします。

```kotlin
fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // wait 500 ms
    emit("$i: Second")    
}
```

<!--- CLEAR -->

さて、3つの整数のFlowがあり、それぞれに対して`requestFlow`を次のように呼び出すと、

```kotlin
(1..3).asFlow().map { requestFlow(it) }
```

<!--- CLEAR -->

FlowのFlow（`Flow<Flow<String>>`）になり、さらなる処理のために単一のFlowに_平坦化_する必要があります。コレクションやシーケンスには、このための[flatten][Sequence.flatten]および[flatMap][Sequence.flatMap]演算子があります。しかし、Flowの非同期的な性質のため、これらは異なる_平坦化モード_を必要とし、Flowには平坦化演算子のファミリーが存在します。

### flatMapConcat

FlowのFlowの連結は、[flatMapConcat][flatMapConcat]および[flattenConcat][flattenConcat]演算子によって提供されます。これらは対応するシーケンス演算子と最も直接的な類似物です。これらは、次の例が示すように、内側のFlowが完了するのを待ってから次のFlowの収集を開始します。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // wait 500 ms
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // remember the start time 
    (1..3).asFlow().onEach { delay(100) } // emit a number every 100 ms 
        .flatMapConcat { requestFlow(it) }                                                                           
        .collect { value -> // collect and print 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-23.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-23.kt)から入手できます。
>
{style="note"}

[flatMapConcat][flatMapConcat]のシーケンシャルな性質は、出力から明確に見られます。

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

もう1つの平坦化操作は、着信するすべてのFlowを並行して収集し、それらの値を単一のFlowにマージすることです。これにより、値は可能な限り早くemitされます。これは[flatMapMerge][flatMapMerge]および[flattenMerge][flattenMerge]演算子によって実装されています。両方とも、同時に収集される並行Flowの数を制限するオプションの`concurrency`パラメータを受け入れます（デフォルトでは[DEFAULT_CONCURRENCY][DEFAULT_CONCURRENCY]と等しいです）。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // wait 500 ms
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // remember the start time 
    (1..3).asFlow().onEach { delay(100) } // a number every 100 ms 
        .flatMapMerge { requestFlow(it) }                                                                           
        .collect { value -> // collect and print 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-24.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-24.kt)から入手できます。
>
{style="note"}

[flatMapMerge][flatMapMerge]の並行性は明らかです。

```text                      
1: First at 136 ms from start
2: First at 231 ms from start
3: First at 333 ms from start
1: Second at 639 ms from start
2: Second at 732 ms from start
3: Second at 833 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->

> [flatMapMerge][flatMapMerge]はコードブロック（この例では`{ requestFlow(it) }`）をシーケンシャルに呼び出しますが、結果のFlowは並行して収集することに注意してください。これは、最初にシーケンシャルな`map { requestFlow(it) }`を実行し、その結果に対して[flattenMerge][flattenMerge]を呼び出すのと同等です。
>
{style="note"}

### flatMapLatest   

「[最新の値の処理](#processing-the-latest-value)」セクションで説明した[collectLatest][collectLatest]演算子と同様に、新しいFlowがemitされるとすぐに以前のFlowの収集がキャンセルされる対応する「最新」の平坦化モードがあります。これは[flatMapLatest][flatMapLatest]演算子によって実装されています。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // wait 500 ms
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // remember the start time 
    (1..3).asFlow().onEach { delay(100) } // a number every 100 ms 
        .flatMapLatest { requestFlow(it) }                                                                           
        .collect { value -> // collect and print 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-25.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-25.kt)から入手できます。
>
{style="note"}

この例の出力は、[flatMapLatest][flatMapLatest]がどのように機能するかをよく示しています。

```text                      
1: First at 142 ms from start
2: First at 322 ms from start
3: First at 425 ms from start
3: Second at 931 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->
  
> [flatMapLatest][flatMapLatest]は、新しい値が受信されると、そのブロック内のすべてのコード（この例では`{ requestFlow(it) }`）をキャンセルすることに注意してください。
> この特定の例では違いはありません。なぜなら、`requestFlow`の呼び出し自体は高速で、中断せず、キャンセルできないからです。しかし、`requestFlow`で`delay`のような中断関数を使用した場合、出力の違いが見られるでしょう。
>
{style="note"}

## Flowの例外

Flowの収集は、エミッターまたは演算子内のコードが例外をスローした場合に、例外で完了する可能性があります。これらの例外を処理する方法はいくつかあります。

### コレクターのtry-catch

コレクターはKotlinの[`try/catch`][exceptions]ブロックを使用して例外を処理できます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i) // emit next value
    }
}

fun main() = runBlocking<Unit> {
    try {
        simple().collect { value ->         
            println(value)
            check(value <= 1) { "Collected $value" }
        }
    } catch (e: Throwable) {
        println("Caught $e")
    } 
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-26.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-26.kt)から入手できます。
>
{style="note"}

このコードは[collect][collect]ターミナル演算子内の例外を正常にキャッチし、ご覧の通り、それ以降は値がemitされません。

```text 
Emitting 1
1
Emitting 2
2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST -->

### すべてがキャッチされる

前の例は、実際にはエミッターまたは任意の中間・ターミナル演算子で発生するあらゆる例外をキャッチします。例えば、emitされた値が文字列に[マップ][map]されるようにコードを変更し、対応するコードが例外を生成するようにしてみましょう。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<String> = 
    flow {
        for (i in 1..3) {
            println("Emitting $i")
            emit(i) // emit next value
        }
    }
    .map { value ->
        check(value <= 1) { "Crashed on $value" }                 
        "string $value"
    }

fun main() = runBlocking<Unit> {
    try {
        simple().collect { value -> println(value) }
    } catch (e: Throwable) {
        println("Caught $e")
    } 
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-27.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-27.kt)から入手できます。
>
{style="note"}

この例外は依然としてキャッチされ、収集は停止されます。

```text 
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
```

<!--- TEST -->

## 例外の透過性

しかし、エミッターのコードはその例外処理動作をどのようにカプセル化できるでしょうか？

Flowは_例外に対して透過的_でなければならず、`flow { ... }`ビルダー内で`try/catch`ブロック内から値を[emit][FlowCollector.emit]することは、例外の透過性の違反となります。これにより、例外をスローするコレクターが、前の例のように常に`try/catch`を使用してそれをキャッチできることが保証されます。

エミッターは、この例外の透過性を維持し、その例外処理のカプセル化を可能にする[catch][catch]演算子を使用できます。`catch`演算子の本体は例外を分析し、どの例外がキャッチされたかによって異なる方法で反応できます。

*   例外は`throw`を使って再スローできます。
*   例外は[catch][catch]の本体から[emit][FlowCollector.emit]を使って値のemitに変換できます。
*   例外は無視されたり、ログに記録されたり、他のコードによって処理されたりする場合があります。

例えば、例外をキャッチしたときにテキストをemitしてみましょう。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun simple(): Flow<String> = 
    flow {
        for (i in 1..3) {
            println("Emitting $i")
            emit(i) // emit next value
        }
    }
    .map { value ->
        check(value <= 1) { "Crashed on $value" }                 
        "string $value"
    }

fun main() = runBlocking<Unit> {
//sampleStart
    simple()
        .catch { e -> emit("Caught $e") } // emit on exception
        .collect { value -> println(value) }
//sampleEnd
}            
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-28.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-28.kt)から入手できます。
>
{style="note"} 
 
`try/catch`がコードの周りにないにも関わらず、例の出力は同じです。

<!--- TEST  
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
-->

### 透過的なcatch

[catch][catch]中間演算子は、例外の透過性を尊重し、アップストリームの例外のみをキャッチします（つまり、`catch`の上にあるすべての演算子からの例外で、それより下にあるものではありません）。`collect { ... }`内のブロック（`catch`の下に配置される）が例外をスローした場合、それはエスケープします。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    simple()
        .catch { e -> println("Caught $e") } // does not catch downstream exceptions
        .collect { value ->
            check(value <= 1) { "Collected $value" }                 
            println(value) 
        }
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-29.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-29.kt)から入手できます。
>
{style="note"}
 
`catch`演算子があるにも関わらず、「Caught ...」メッセージは表示されません。

```text  
Emitting 1
1
Emitting 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
	at ...
```

<!--- TEST EXCEPTION -->

### 宣言的なキャッチ

[catch][catch]演算子の宣言的な性質と、すべての例外を処理したいという要望を組み合わせることができます。これは、[collect][collect]演算子の本体を[onEach][onEach]に移動し、それを`catch`演算子の前に配置することで実現します。このFlowの収集は、パラメータなしの`collect()`の呼び出しによってトリガーされる必要があります。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    simple()
        .onEach { value ->
            check(value <= 1) { "Collected $value" }                 
            println(value) 
        }
        .catch { e -> println("Caught $e") }
        .collect()
//sampleEnd
}            
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-30.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-30.kt)から入手できます。
>
{style="note"} 
 
これで、「Caught ...」メッセージが表示されることがわかります。つまり、`try/catch`ブロックを明示的に使用せずにすべての例外をキャッチできます。

```text 
Emitting 1
1
Emitting 2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## Flowの完了

Flowの収集が完了した場合（正常に、または例外的に）、アクションを実行する必要がある場合があります。すでに気づかれたかもしれませんが、これは命令型と宣言型の2つの方法で実行できます。

### 命令型のfinallyブロック

`try`/`catch`に加えて、コレクターは`finally`ブロックを使用して`collect`の完了時にアクションを実行することもできます。

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
<!--- KNIT example-flow-31.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-31.kt)から入手できます。
>
{style="note"} 

このコードは、`simple` Flowによって生成された3つの数値の後に「Done」という文字列を出力します。

```text
1
2
3
Done
```

<!--- TEST  -->

### 宣言的なハンドリング

宣言的なアプローチの場合、FlowにはFlowが完全に収集されたときに呼び出される[onCompletion][onCompletion]中間演算子があります。

前の例は、[onCompletion][onCompletion]演算子を使用して書き換えられ、同じ出力を生成します。

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
<!--- KNIT example-flow-32.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-32.kt)から入手できます。
>
{style="note"} 

<!--- TEST 
1
2
3
Done
-->

[onCompletion][onCompletion]の主な利点は、Flowの収集が正常に完了したか、例外的に完了したかを判断するために使用できるラムダのnull許容`Throwable`パラメータです。次の例では、`simple` Flowは数値1をemitした後に例外をスローします。

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
<!--- KNIT example-flow-33.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-33.kt)から入手できます。
>
{style="note"}

予想される通り、次のように出力されます。

```text
1
Flow completed exceptionally
Caught exception
```

<!--- TEST -->

[onCompletion][onCompletion]演算子は、[catch][catch]とは異なり、例外を処理しません。上記のコード例からわかるように、例外は依然としてダウンストリームに流れます。それはさらに`onCompletion`演算子に渡され、`catch`演算子で処理できます。

### 正常な完了

[catch][catch]演算子とのもう1つの違いは、[onCompletion][onCompletion]がすべての例外を認識し、アップストリームのFlowが正常に完了した場合にのみ（キャンセルや失敗なしで）`null`例外を受け取ることです。

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
<!--- KNIT example-flow-34.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-34.kt)から入手できます。
>
{style="note"}

ダウンストリームの例外によりFlowが中断されたため、完了の原因がnullではないことがわかります。

```text 
1
Flow completed with java.lang.IllegalStateException: Collected 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## 命令型と宣言型

これで、Flowを収集し、その完了と例外を命令型と宣言型の両方の方法で処理する方法がわかりました。ここで当然の疑問は、どちらのアプローチが推奨され、なぜか、ということです。ライブラリとして、私たちは特定のアプローチを推奨せず、どちらのオプションも有効であり、個人の好みやコーディングスタイルに応じて選択すべきだと考えています。

## Flowの起動

Flowを使って、何らかのソースから来る非同期イベントを表現するのは簡単です。この場合、着信するイベントに対する反応を持つコードの一部を登録し、さらに作業を続行する`addEventListener`関数の類似物が必要です。[onEach][onEach]演算子がこの役割を果たすことができます。ただし、`onEach`は中間演算子です。Flowを収集するためのターミナル演算子も必要です。そうでなければ、`onEach`を呼び出すだけでは効果がありません。
 
`onEach`の後に[collect][collect]ターミナル演算子を使用すると、その後のコードはFlowが収集されるまで待機します。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
// Imitate a flow of events
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .collect() // <--- Collecting the flow waits
    println("Done")
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-35.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-35.kt)から入手できます。
>
{style="note"} 
  
ご覧の通り、次のように出力されます。

```text 
Event: 1
Event: 2
Event: 3
Done
```    

<!--- TEST -->
 
ここで[launchIn][launchIn]ターミナル演算子が役立ちます。`collect`を`launchIn`に置き換えることで、別のコルーチンでFlowの収集を起動できるため、その後のコードの実行はすぐに続行されます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

// Imitate a flow of events
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

//sampleStart
fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .launchIn(this) // <--- Launching the flow in a separate coroutine
    println("Done")
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-36.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-36.kt)から入手できます。
>
{style="note"} 
  
次のように出力されます。

```text          
Done
Event: 1
Event: 2
Event: 3
```    

<!--- TEST -->

`launchIn`の必須パラメータは、Flowを収集するコルーチンが起動される[CoroutineScope][CoroutineScope]を指定する必要があります。上記の例では、このスコープは[runBlocking][runBlocking]コルーチンビルダーから来ており、Flowが実行されている間、この[runBlocking][runBlocking]スコープはその子コルーチンの完了を待ち、メイン関数が戻ってこの例を終了するのを防ぎます。

実際のアプリケーションでは、スコープは限られたライフタイムを持つエンティティから来ます。このエンティティのライフタイムが終了するとすぐに、対応するスコープがキャンセルされ、対応するFlowの収集もキャンセルされます。このようにして、`onEach { ... }.launchIn(scope)`のペアは`addEventListener`のように機能します。しかし、対応する`removeEventListener`関数は必要ありません。キャンセルと構造化された並行性がこの目的を果たすからです。

[launchIn][launchIn]は[Job][Job]も返すことに注意してください。これは、スコープ全体をキャンセルすることなく、対応するFlow収集コルーチンのみを[キャンセル][Job.cancel]したり、[結合][Job.join]したりするために使用できます。

### Flowのキャンセルチェック

便宜上、[flow][\_flow]ビルダーは、emitされる各値に対してキャンセルに関する追加の[ensureActive][ensureActive]チェックを実行します。これは、`flow { ... }`からemitするビジーループがキャンセル可能であることを意味します。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart           
fun foo(): Flow<Int> = flow { 
    for (i in 1..5) {
        println("Emitting $i") 
        emit(i) 
    }
}

fun main() = runBlocking<Unit> {
    foo().collect { value -> 
        if (value == 3) cancel()  
        println(value)
    } 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-37.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-37.kt)から入手できます。
>
{style="note"}

3までの数値のみが取得され、数値4をemitしようとした後に[CancellationException][CancellationException]が発生します。

```text 
Emitting 1
1
Emitting 2
2
Emitting 3
3
Emitting 4
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@6d7b4f4c
```

<!--- TEST EXCEPTION -->

ただし、他のほとんどのFlow演算子は、パフォーマンス上の理由から、独自の追加のキャンセルチェックを行いません。例えば、同じビジーループを記述するために[IntRange.asFlow][IntRange.asFlow]拡張機能を使用し、どこも中断しない場合、キャンセルチェックは行われません。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart           
fun main() = runBlocking<Unit> {
    (1..5).asFlow().collect { value -> 
        if (value == 3) cancel()  
        println(value)
    } 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-38.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-38.kt)から入手できます。
>
{style="note"}

1から5までのすべての数値が収集され、キャンセルは`runBlocking`からの戻り直前にのみ検出されます。

```text
1
2
3
4
5
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@3327bd23
```

<!--- TEST EXCEPTION -->

#### ビジーなFlowをキャンセル可能にする 

コルーチンでビジーループを使用している場合は、明示的にキャンセルをチェックする必要があります。
`.onEach { currentCoroutineContext().ensureActive() }`を追加できますが、それを行うために[cancellable][cancellable]演算子がすぐに利用できます。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart           
fun main() = runBlocking<Unit> {
    (1..5).asFlow().cancellable().collect { value -> 
        if (value == 3) cancel()  
        println(value)
    } 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-39.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-39.kt)から入手できます。
>
{style="note"}

`cancellable`演算子を使用すると、1から3までの数値のみが収集されます。

```text
1
2
3
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@5ec0a365
```

<!--- TEST EXCEPTION -->

## FlowとReactive Streams

[Reactive Streams](https://www.reactive-streams.org/)やRxJava、Project Reactorなどのリアクティブフレームワークに精通している人にとっては、Flowの設計は非常によく似ているように見えるかもしれません。

実際、その設計はReactive Streamsとその様々な実装に触発されました。しかし、Flowの主な目標は、可能な限りシンプルな設計を持ち、Kotlinと中断（suspension）に優しく、構造化された並行性を尊重することです。この目標達成は、リアクティブの先駆者たちの計り知れない努力なしには不可能だったでしょう。詳細な記事は「[Reactive Streams and Kotlin Flows](https://medium.com/@elizarov/reactive-streams-and-kotlin-flows-bfd12772cda4)」を参照してください。

概念的にはFlowは異なるものの、リアクティブストリーム_です_。そして、それをリアクティブな（仕様およびTCK準拠の）Publisherに変換したり、その逆に変換したりすることが可能です。
このような変換器は`kotlinx.coroutines`によってすぐに利用可能であり、対応するリアクティブモジュール（Reactive Streams用には`kotlinx-coroutines-reactive`、Project Reactor用には`kotlinx-coroutines-reactor`、RxJava2/RxJava3用には`kotlinx-coroutines-rx2`/`kotlinx-coroutines-rx3`）で見つけることができます。
統合モジュールには、Flowとの相互変換、Reactorの`Context`との統合、そして様々なリアクティブエンティティを扱うための中断に優しい方法が含まれています。
 
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

[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[withTimeoutOrNull]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html
[Dispatchers.Default]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html
[Dispatchers.Main]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[CoroutineDispatcher]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/index.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[Job.join]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[ensureActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html
[CancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html

<!--- INDEX kotlinx.coroutines.flow -->

[Flow]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/index.html
[_flow]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html
[FlowCollector.emit]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html
[collect]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html
[flowOf]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow-of.html
[map]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html
[filter]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html
[transform]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html
[take]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/take.html
[toList]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/to-list.html
[toSet]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/to-set.html
[first]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/first.html
[single]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/single.html
[reduce]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/reduce.html
[fold]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/fold.html
[flowOn]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow-on.html
[buffer]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html
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
[catch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/catch.html
[onCompletion]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/on-completion.html
[launchIn]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/launch-in.html
[IntRange.asFlow]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/as-flow.html
[cancellable]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/cancellable.html

<!--- END -->