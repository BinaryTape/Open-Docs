<!--- TEST_NAME FlowGuideTest --> 
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 非同期フロー)

停止関数は非同期に単一の値を返しますが、複数の非同期的に計算された値を返すにはどうすればよいでしょうか？ここでKotlinのFlowが登場します。

## 複数の値を表現する

Kotlinでは、[コレクション]を使用して複数の値を表現できます。
たとえば、3つの数値の[List]を返し、[forEach]を使用してそれらすべてをプリントする`simple`関数を作成できます。

```kotlin
fun simple(): List<Int> = listOf(1, 2, 3)
 
fun main() {
    simple().forEach { value -> println(value) } 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-01.kt -->
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-01.kt)から入手できます。
>
{style="note"}

このコードは次を出力します。

```text
1
2
3
```

<!--- TEST -->

### シーケンス

数値がCPUを大量に消費するブロッキングコード（各計算に100ミリ秒かかる）で計算されている場合、[Sequence]を使用して数値を表現できます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-02.kt)から入手できます。
>
{style="note"}

このコードは同じ数値を出力しますが、それぞれを出力する前に100ミリ秒待機します。

<!--- TEST 
1
2
3
-->

### 停止関数

しかし、この計算はコードを実行しているメインスレッドをブロックします。
これらの値が非同期コードによって計算される場合、`simple`関数を`suspend`修飾子でマークすることで、ブロックせずにその作業を実行し、結果をリストとして返すことができます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-03.kt)から入手できます。
>
{style="note"}

このコードは、1秒待機した後で数値をプリントします。

<!--- TEST 
1
2
3
-->

### Flow

`List<Int>`の結果型を使用すると、すべての値を一度にしか返せません。非同期的に計算されている値のストリームを表現するには、同期的に計算された値に`Sequence<Int>`型を使用するのと同じように、[`Flow<Int>`][Flow]型を使用できます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-04.kt)から入手できます。
>
{style="note"}

このコードは、メインスレッドをブロックせずに各数値をプリントする前に100ミリ秒待機します。これは、メインスレッドで実行されている別のコルーチンから100ミリ秒ごとに「I'm not blocked」をプリントすることで検証されます。

```text
I'm not blocked 1
1
I'm not blocked 2
2
I'm not blocked 3
3
```

<!--- TEST -->

以前の例の[Flow]を使用したコードの以下の違いに注目してください。

*   [Flow]型のビルダー関数は[flow][_flow]と呼ばれます。
*   `flow { ... }`ビルダーブロック内のコードは停止できます。
*   `simple`関数にはもはや`suspend`修飾子は付けられません。
*   値は[emit][FlowCollector.emit]関数を使用してフローから_emit_されます。
*   値は[collect][collect]関数を使用してフローから_collect_されます。

> `simple`の`flow { ... }`のボディで[delay]を`Thread.sleep`に置き換えると、この場合、メインスレッドがブロックされることがわかります。
>
{style="note"}

## Flowはコールド

Flowはシーケンスと同様に_コールド_ストリームです。つまり、[flow][_flow]ビルダー内のコードは、フローが収集されるまで実行されません。これは以下の例で明らかになります。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-05.kt)から入手できます。
>
{style="note"}

これは次を出力します。

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
 
これは、`simple`関数（Flowを返す関数）に`suspend`修飾子が付けられていない主な理由です。
`simple()`呼び出し自体はすぐに返され、何も待機しません。フローは収集されるたびに新たに開始されるため、`collect`を再度呼び出すたびに「Flow started」と表示されます。

## Flowのキャンセルの基本

Flowは、コルーチンの一般的な協調キャンセルに従います。通常通り、フローがキャンセル可能な停止関数（[delay]など）で停止されている場合、フローの収集はキャンセルできます。
以下の例は、[withTimeoutOrNull]ブロックで実行されているときにフローがタイムアウトでキャンセルされ、コードの実行を停止する方法を示しています。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-06.kt)から入手できます。
>
{style="note"}

`simple`関数内のフローによって2つの数値のみがemitされ、以下の出力が生成されることに注目してください。

```text
Emitting 1
1
Emitting 2
2
Done
```

<!--- TEST -->

詳細については、「[フローのキャンセルチェック](#flow-cancellation-checks)」セクションを参照してください。

## Flowビルダー

以前の例の`flow { ... }`ビルダーは最も基本的なものです。フローを宣言できる他のビルダーもあります。

*   [flowOf]ビルダーは、固定された値のセットをemitするフローを定義します。
*   さまざまなコレクションやシーケンスは、`.asFlow()`拡張関数を使用してフローに変換できます。

たとえば、フローから1から3までの数値をプリントするスニペットは次のように書き換えられます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-07.kt)から入手できます。
>
{style="note"}

<!--- TEST
1
2
3
-->

## 中間Flowオペレーター

Flowは、コレクションやシーケンスを変換するのと同じように、オペレーターを使用して変換できます。
中間オペレーターはアップストリームフローに適用され、ダウンストリームフローを返します。
これらのオペレーターは、フローと同様にコールドです。そのようなオペレーターの呼び出し自体は、停止関数ではありません。
それは高速に動作し、新しい変換されたフローの定義を返します。

基本的なオペレーターには、[map]や[filter]のような馴染みのある名前があります。
これらのオペレーターとシーケンスの重要な違いは、これらのオペレーター内のコードブロックが停止関数を呼び出せることです。

たとえば、受信リクエストのフローは、リクエストの実行が停止関数によって実装される長時間の操作である場合でも、[map]オペレーターでその結果にマッピングできます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-08.kt)から入手できます。
>
{style="note"}

これは次の3行を生成し、それぞれが前の行から1秒後に表示されます。

```text                                                                    
response 1
response 2
response 3
```

<!--- TEST -->

### `transform`オペレーター

フロー変換オペレーターの中で、最も汎用的なものは[transform]と呼ばれます。それは[map]や[filter]のような単純な変換を模倣するためにも、より複雑な変換を実装するためにも使用できます。
`transform`オペレーターを使用すると、任意の値を任意の回数[emit][FlowCollector.emit]できます。

たとえば、`transform`を使用して、時間のかかる非同期リクエストを実行する前に文字列をemitし、その後にレスポンスを続けることができます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-09.kt)から入手できます。
>
{style="note"}

このコードの出力は次のとおりです。

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

[take]のようなサイズ制限中間オペレーターは、対応する制限に達するとフローの実行をキャンセルします。コルーチンでのキャンセルは常に例外をスローすることによって実行されるため、すべてのリソース管理関数（`try { ... } finally { ... }`ブロックなど）はキャンセルの場合でも正常に動作します。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-10.kt)から入手できます。
>
{style="note"}

このコードの出力は、`numbers()`関数内の`flow { ... }`ボディの実行が2番目の数値のemit後に停止したことを明確に示しています。

```text       
1
2
Finally in numbers
```

<!--- TEST -->

## 終端Flowオペレーター

フローの終端オペレーターは、フローの収集を開始する_停止関数_です。
[collect]オペレーターが最も基本的なものですが、他にも収集を容易にする終端オペレーターがあります。

*   [toList]や[toSet]などのさまざまなコレクションへの変換。
*   [first]値を取得し、フローが[single]値をemitすることを保証するオペレーター。
*   [reduce]と[fold]でフローを値に削減する。

例えば:

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-11.kt)から入手できます。
>
{style="note"}

単一の数値を出力します。

```text
55
```

<!--- TEST -->

## Flowは逐次的

複数のフローを操作する特殊なオペレーターが使用されない限り、フローの個々の収集は順次実行されます。収集は、終端オペレーターを呼び出すコルーチンで直接機能します。デフォルトでは新しいコルーチンは起動されません。
emitされた各値は、アップストリームからダウンストリームまですべての中間オペレーターによって処理され、その後、終端オペレーターに届けられます。

偶数整数をフィルタリングし、文字列にマッピングする次の例を参照してください。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-12.kt)から入手できます。
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

フローの収集は常に、呼び出し元のコルーチンのコンテキストで発生します。たとえば、`simple`フローがある場合、`simple`フローの実装詳細に関わらず、以下のコードはこのコードの作成者によって指定されたコンテキストで実行されます。

```kotlin
withContext(context) {
    simple().collect { value ->
        println(value) // run in the specified context 
    }
}
```

<!--- CLEAR -->

このフローのプロパティは、_コンテキストの保存_と呼ばれます。

したがって、デフォルトでは、`flow { ... }`ビルダー内のコードは、対応するフローのコレクターによって提供されるコンテキストで実行されます。たとえば、呼び出されたスレッドをプリントし、3つの数値をemitする`simple`関数の実装を考えてみましょう。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-13.kt)から入手できます。
>
{style="note"}

このコードを実行すると、次が生成されます。

```text  
[main @coroutine#1] Started simple flow
[main @coroutine#1] Collected 1
[main @coroutine#1] Collected 2
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

`simple().collect`がメインスレッドから呼び出されるため、`simple`のフローの本体もメインスレッドで呼び出されます。これは、実行コンテキストを気にせず、呼び出し元をブロックしない高速に実行される、または非同期コードにとって完璧なデフォルトです。

### `withContext`使用時の一般的な落とし穴

しかし、長時間実行されるCPUを大量に消費するコードは[Dispatchers.Default]のコンテキストで実行する必要があるかもしれませんし、UI更新コードは[Dispatchers.Main]のコンテキストで実行する必要があるかもしれません。通常、Kotlinコルーチンを使用するコードでコンテキストを変更するには[withContext]が使用されますが、`flow { ... }`ビルダー内のコードはコンテキストの保存プロパティを尊重する必要があり、異なるコンテキストから[emit][FlowCollector.emit]することは許可されていません。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-14.kt)から入手できます。
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

### `flowOn`オペレーター
   
この例外は、フローのemitのコンテキストを変更するために使用されるべき[flowOn]関数に言及しています。
フローのコンテキストを変更する正しい方法は以下の例に示されており、すべてがどのように機能するかを示すために対応するスレッド名もプリントされます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-15.kt)から入手できます。
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

ここで注目すべきもう1つの点は、[flowOn]オペレーターがフローのデフォルトの逐次的な性質を変更したことです。
今や収集は1つのコルーチン（「coroutine#1」）で発生し、emitは別のスレッドで収集コルーチンと並行して実行されている別のコルーチン（「coroutine#2」）で発生します。[flowOn]オペレーターは、コンテキスト内の[CoroutineDispatcher]を変更する必要がある場合に、アップストリームフローのために別のコルーチンを作成します。

## バッファリング

フローの異なる部分を異なるコルーチンで実行することは、フローを収集するのにかかる全体的な時間の観点から役立ちます。特に、長時間実行される非同期操作が関係している場合にそうです。たとえば、`simple`フローによるemitが遅く、要素の生成に100ミリ秒かかる場合を考えてみましょう。そして、コレクターも遅く、要素の処理に300ミリ秒かかります。そのそのようなフローを3つの数値で収集するのにどれくらいの時間がかかるか見てみましょう。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-16.kt)から入手できます。
>
{style="note"}

これは次のようなものを生成し、全体の収集には約1200ミリ秒かかります（3つの数値、それぞれに400ミリ秒）。

```text
1
2
3
Collected in 1220 ms
```

<!--- TEST ARBITRARY_TIME -->

フローに[buffer]オペレーターを使用すると、`simple`フローのemitコードを収集コードと並行して実行できます（逐次的に実行するのではなく）。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-17.kt)から入手できます。
>
{style="note"}

同じ数値がより速く生成されます。これは、処理パイプラインを効果的に作成したためで、最初の数値のために100ミリ秒だけ待てばよく、その後は各数値を処理するために300ミリ秒しか費やしません。この方法では、実行に約1000ミリ秒かかります。

```text
1
2
3
Collected in 1071 ms
```                    

<!--- TEST ARBITRARY_TIME -->

> [flowOn]オペレーターは[CoroutineDispatcher]を変更する必要があるときに同じバッファリングメカニズムを使用しますが、ここでは実行コンテキストを変更せずに明示的にバッファリングを要求していることに注意してください。
>
{style="note"}

### コンフレーション

フローが操作の部分的な結果または操作ステータスの更新を表す場合、各値を処理する必要はなく、代わりに最新の値のみを処理すればよい場合があります。この場合、[conflate]オペレーターを使用して、コレクターが値を処理するには遅すぎる場合に中間値をスキップできます。前の例に基づいて考えてみましょう。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-18.kt)から入手できます。
>
{style="note"}

最初の数値がまだ処理されている間、2番目と3番目の数値はすでに生成されていたため、2番目のものは_コンフレーション_され、最新のもの（3番目のもの）だけがコレクターに届けられたことがわかります。

```text
1
3
Collected in 758 ms
```             

<!--- TEST ARBITRARY_TIME -->

### 最新の値を処理する

コンフレーションは、emit元とコレクターの両方が遅い場合に処理を高速化する1つの方法です。これは、emitされた値をドロップすることで行われます。
もう1つの方法は、遅いコレクターをキャンセルし、新しい値がemitされるたびにそれを再起動することです。
`xxxLatest`オペレーターには、`xxx`オペレーターと同じ本質的なロジックを実行しますが、新しい値でブロック内のコードをキャンセルする一連のものが存在します。前の例で[conflate]を[collectLatest]に変更してみましょう。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-19.kt)から入手できます。
>
{style="note"}
 
[collectLatest]のボディは300ミリ秒かかりますが、新しい値は100ミリ秒ごとにemitされるため、ブロックはすべての値で実行されますが、最後の値に対してのみ完了することがわかります。

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

Kotlin標準ライブラリの[Sequence.zip]拡張関数と同様に、Flowには2つのフローの対応する値を結合する[zip]オペレーターがあります。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-20.kt)から入手できます。
>
{style="note"}

この例は次を出力します。

```text
1 -> one
2 -> two
3 -> three
```
 
<!--- TEST -->

### Combine

フローが変数または操作の最新値を表す場合（関連する「[コンフレーション](#conflation)」セクションも参照）、対応するフローの最新値に依存する計算を実行し、いずれかのアップストリームフローが値をemitするたびにそれを再計算する必要があるかもしれません。対応するオペレーターのファミリーは[combine]と呼ばれます。

たとえば、前の例の数値が300ミリ秒ごとに更新され、文字列が400ミリ秒ごとに更新される場合でも、[zip]オペレーターを使用してそれらをzipすると、400ミリ秒ごとに結果がプリントされるものの、同じ結果が生成されます。

> この例では、各要素を遅延させ、サンプルフローをemitするコードをより宣言的かつ短くするために、[onEach]中間オペレーターを使用しています。
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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-21.kt)から入手できます。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
1 -> one at 437 ms from start
2 -> two at 837 ms from start
3 -> three at 1243 ms from start
-->

しかし、ここで[zip]の代わりに[combine]オペレーターを使用すると、

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-22.kt)から入手できます。
>
{style="note"}

`nums`または`strs`フローのいずれかからの各emitで1行がプリントされる、かなり異なる出力が得られます。

```text 
1 -> one at 452 ms from start
2 -> one at 651 ms from start
2 -> two at 854 ms from start
3 -> two at 952 ms from start
3 -> three at 1256 ms from start
```

<!--- TEST ARBITRARY_TIME -->

## Flowのフラット化

Flowは非同期に受信される値のシーケンスを表すため、各値が別の値のシーケンスへのリクエストをトリガーする状況に陥りやすいです。たとえば、500ミリ秒間隔で2つの文字列のフローを返す次の関数があるとします。

```kotlin
fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // wait 500 ms
    emit("$i: Second")    
}
```

<!--- CLEAR -->

さて、3つの整数のフローがあり、それぞれに対してこのように`requestFlow`を呼び出すと、

```kotlin
(1..3).asFlow().map { requestFlow(it) }
```

<!--- CLEAR -->

その後、さらなる処理のために単一のフローに_フラット化_する必要があるフローのフロー（`Flow<Flow<String>>`）になってしまいます。コレクションとシーケンスには、このための[flatten][Sequence.flatten]および[flatMap][Sequence.flatMap]オペレーターがあります。しかし、フローの非同期的な性質のため、それらは異なる_フラット化モード_を必要とし、したがって、フローには一連のフラット化オペレーターが存在します。

### `flatMapConcat`

フローのフローの連結は、[flatMapConcat]および[flattenConcat]オペレーターによって提供されます。それらは、対応するシーケンスオペレーターの最も直接的な類義語です。以下の例が示すように、次のフローの収集を開始する前に、内部フローが完了するのを待ちます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-23.kt)から入手できます。
>
{style="note"}

[flatMapConcat]の逐次的な性質は、出力で明確に確認できます。

```text                      
1: First at 121 ms from start
1: Second at 622 ms from start
2: First at 727 ms from start
2: Second at 1227 ms from start
3: First at 1328 ms from start
3: Second at 1829 ms from start
```

<!--- TEST ARBITRARY_TIME -->

### `flatMapMerge`

もう1つのフラット化操作は、受信するすべてのフローを並行して収集し、それらの値を単一のフローにマージして、可能な限り早く値がemitされるようにすることです。
それは[flatMapMerge]および[flattenMerge]オペレーターによって実装されます。それらは両方とも、同時に収集される並行フローの数を制限するオプションの`concurrency`パラメーターを受け入れます（デフォルトでは[DEFAULT_CONCURRENCY]に等しいです）。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-24.kt)から入手できます。
>
{style="note"}

[flatMapMerge]の並行的な性質は明らかです。

```text                      
1: First at 136 ms from start
2: First at 231 ms from start
3: First at 333 ms from start
1: Second at 639 ms from start
2: Second at 732 ms from start
3: Second at 833 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->

> [flatMapMerge]はそのコードブロック（この例では`{ requestFlow(it) }`）を逐次的に呼び出しますが、結果のフローを並行して収集することに注意してください。これは、まず逐次的な`map { requestFlow(it) }`を実行し、その結果に対して[flattenMerge]を呼び出すことと同じです。
>
{style="note"}

### `flatMapLatest`   

「[最新の値を処理する](#processing-the-latest-value)」セクションで説明した[collectLatest]オペレーターと同様に、新しいフローがemitされるとすぐに以前のフローの収集がキャンセルされる、対応する「Latest」フラット化モードがあります。
それは[flatMapLatest]オペレーターによって実装されます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-25.kt)から入手できます。
>
{style="note"}

この例の出力は、[flatMapLatest]がどのように機能するかをよく示しています。

```text                      
1: First at 142 ms from start
2: First at 322 ms from start
3: First at 425 ms from start
3: Second at 931 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->
  
> [flatMapLatest]は、新しい値が受信されたときに、そのブロック（この例では`{ requestFlow(it) }`）内のすべてのコードをキャンセルすることに注意してください。
> `requestFlow`の呼び出し自体は高速で、停止せず、キャンセルできないため、この特定の例では違いはありません。しかし、`requestFlow`で`delay`のような停止関数を使用した場合、出力に違いが見られるでしょう。
>
{style="note"}

## Flowの例外

フローの収集は、emit元またはオペレーター内のコードが例外をスローした場合に例外で完了する可能性があります。これらの例外を処理する方法はいくつかあります。

### コレクターの`try`と`catch`

コレクターは、Kotlinの[`try/catch`][exceptions]ブロックを使用して例外を処理できます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-26.kt)から入手できます。
>
{style="note"}

このコードは[collect]終端オペレーターで例外を正常にキャッチし、ご覧のとおり、その後は値がemitされません。

```text 
Emitting 1
1
Emitting 2
2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST -->

### すべてがキャッチされる

前の例では、実際にはemit元、または任意の中間オペレーターや終端オペレーターで発生するすべての例外がキャッチされます。
たとえば、emitされた値が文字列に[map]されるようにコードを変更し、対応するコードが例外を生成するようにしてみましょう。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-27.kt)から入手できます。
>
{style="note"}

この例外は引き続きキャッチされ、収集は停止します。

```text 
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
```

<!--- TEST -->

## 例外の透過性

しかし、emit元のコードはどのようにして例外処理の振る舞いをカプセル化できるのでしょうか？

Flowは_例外に対して透過的_である必要があり、`flow { ... }`ビルダー内で`try/catch`ブロックの内部から値を[emit][FlowCollector.emit]することは、例外透過性の違反です。これにより、例外をスローするコレクターは、前の例のように`try/catch`を使用して常にそれをキャッチできることが保証されます。

emit元は、この例外透過性を保持し、例外処理のカプセル化を可能にする[catch]オペレーターを使用できます。`catch`オペレーターのボディは例外を分析し、どの例外がキャッチされたかに応じてさまざまな方法で反応できます。

*   例外は`throw`を使用して再スローできます。
*   例外は、[catch]のボディから[emit][FlowCollector.emit]を使用して値のemitに変換できます。
*   例外は無視されたり、ログに記録されたり、他のコードによって処理されたりすることができます。

たとえば、例外をキャッチしたときにテキストをemitしてみましょう。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-28.kt)から入手できます。
>
{style="note"} 
 
コードの周りに`try/catch`がなくなったにもかかわらず、例の出力は同じです。

<!--- TEST  
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
-->

### 透過的な`catch`

[catch]中間オペレーターは、例外透過性を尊重し、アップストリームの例外のみをキャッチします（つまり、`catch`よりも上にあるすべてのオペレーターからの例外であり、それより下にあるものではありません）。
`collect { ... }`内のブロック（`catch`の下に配置される）が例外をスローすると、それはエスケープします。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-29.kt)から入手できます。
>
{style="note"}
 
`catch`オペレーターがあるにもかかわらず、「Caught ...」メッセージはプリントされません。

```text  
Emitting 1
1
Emitting 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
	at ...
```

<!--- TEST EXCEPTION -->

### 宣言的なキャッチ

[catch]オペレーターの宣言的な性質と、すべての例外を処理したいという要望を組み合わせるには、[collect]オペレーターのボディを[onEach]に移動し、それを`catch`オペレーターの前に置きます。このフローの収集は、パラメータなしの`collect()`の呼び出しによってトリガーされる必要があります。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-30.kt)から入手できます。
>
{style="note"} 
 
これで、「Caught ...」メッセージがプリントされ、`try/catch`ブロックを明示的に使用せずにすべての例外をキャッチできることがわかります。

```text 
Emitting 1
1
Emitting 2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## Flowの完了

フローの収集が完了すると（正常に、または例外的に）、アクションを実行する必要がある場合があります。
すでにお気づきかもしれませんが、これには命令的または宣言的な2つの方法があります。

### 命令的な`finally`ブロック

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-31.kt)から入手できます。
>
{style="note"} 

このコードは、`simple`フローによって生成された3つの数値に続いて「Done」文字列をプリントします。

```text
1
2
3
Done
```

<!--- TEST  -->

### 宣言的な処理

宣言的なアプローチの場合、フローには[onCompletion]中間オペレーターがあり、フローが完全に収集されたときに呼び出されます。

前の例は[onCompletion]オペレーターを使用して書き換えられ、同じ出力を生成します。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-32.kt)から入手できます。
>
{style="note"} 

<!--- TEST 
1
2
3
Done
-->

[onCompletion]の主な利点は、フローの収集が正常に完了したか、例外的に完了したかを判断するために使用できるラムダのnullableな`Throwable`パラメータです。次の例では、`simple`フローは数値1をemitした後に例外をスローします。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-33.kt)から入手できます。
>
{style="note"}

ご想像のとおり、次がプリントされます。

```text
1
Flow completed exceptionally
Caught exception
```

<!--- TEST -->

[onCompletion]オペレーターは、[catch]とは異なり、例外を処理しません。上記の例のコードからわかるように、例外は依然としてダウンストリームに流れます。それはさらに`onCompletion`オペレーターに届けられ、`catch`オペレーターで処理できます。

### 正常な完了

[catch]オペレーターとのもう1つの違いは、[onCompletion]がすべての例外を確認し、アップストリームフローの正常な完了（キャンセルまたは失敗なし）の場合にのみ`null`例外を受け取ることです。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-34.kt)から入手できます。
>
{style="note"}

フローがダウンストリームの例外によって中断されたため、完了原因がnullではないことがわかります。

```text 
1
Flow completed with java.lang.IllegalStateException: Collected 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## 命令的 vs 宣言的

これで、フローを収集し、その完了と例外を命令的および宣言的の両方の方法で処理する方法がわかりました。
ここでの当然の疑問は、どちらのアプローチが推奨され、なぜかということです。
ライブラリとしては、特定のどのアプローチも推奨せず、どちらのオプションも有効であり、個人の好みとコードスタイルに応じて選択されるべきだと考えます。

## Flowの起動

フローを使用して、何らかのソースから来る非同期イベントを表現するのは簡単です。
この場合、受信イベントに対する反応としてコードの一部を登録し、さらなる作業を継続する`addEventListener`関数に似たものが必要です。[onEach]オペレーターがこの役割を果たすことができます。
しかし、`onEach`は中間オペレーターです。フローを収集するための終端オペレーターも必要です。
そうでなければ、`onEach`を呼び出すだけでは効果がありません。
 
`onEach`の後に[collect]終端オペレーターを使用すると、その後のコードはフローが収集されるまで待機します。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-35.kt)から入手できます。
>
{style="note"} 
  
ご覧のとおり、次がプリントされます。

```text 
Event: 1
Event: 2
Event: 3
Done
```    

<!--- TEST -->
 
ここで[launchIn]終端オペレーターが役立ちます。`collect`を`launchIn`に置き換えることで、別のコルーチンでフローの収集を起動し、その後のコードの実行がすぐに継続するようにできます。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-36.kt)から入手できます。
>
{style="note"} 
  
これは次を出力します。

```text          
Done
Event: 1
Event: 2
Event: 3
```    

<!--- TEST -->

`launchIn`の必須パラメータは、フローを収集するためのコルーチンが起動される[CoroutineScope]を指定する必要があります。上記の例では、このスコープは[runBlocking]コルーチンビルダーから来るため、フローが実行されている間、この[runBlocking]スコープはその子コルーチンの完了を待機し、main関数が戻ってこの例を終了するのを防ぎます。

実際のアプリケーションでは、スコープは限られた寿命を持つエンティティから来ます。このエンティティの寿命が終了するとすぐに、対応するスコープがキャンセルされ、対応するフローの収集もキャンセルされます。このように、`onEach { ... }.launchIn(scope)`のペアは`addEventListener`のように機能します。しかし、キャンセルと構造化された並行性がこの目的を果たすため、対応する`removeEventListener`関数は必要ありません。

[launchIn]は[Job]も返し、これはスコープ全体をキャンセルすることなく、対応するフロー収集コルーチンを[cancel][Job.cancel]したり、それに[join][Job.join]したりするために使用できることに注意してください。

### Flowのキャンセルチェック

利便性のために、[flow][_flow]ビルダーは、emitされる各値に対して追加の[ensureActive]キャンセルチェックを実行します。
これは、`flow { ... }`からemitするビジーループがキャンセル可能であることを意味します。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-37.kt)から入手できます。
>
{style="note"}

3までの数値と、4番目の数値をemitしようとした後に[CancellationException]のみが取得されます。

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

しかし、他のほとんどのフローオペレーターは、パフォーマンス上の理由から、独自の追加のキャンセルチェックを実行しません。
たとえば、[IntRange.asFlow]拡張を使用して同じビジーループを記述し、どこも停止しない場合、キャンセルチェックは行われません。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-38.kt)から入手できます。
>
{style="note"}

1から5まですべての数値が収集され、キャンセルは`runBlocking`から戻る直前にのみ検出されます。

```text
1
2
3
4
5
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@3327bd23
```

<!--- TEST EXCEPTION -->

#### ビジーフローをキャンセル可能にする

コルーチンを使用したビジーループがある場合は、明示的にキャンセルをチェックする必要があります。
`.onEach { currentCoroutineContext().ensureActive() }`を追加できますが、そのために[cancellable]オペレーターが用意されています。

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
> 全体のコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-39.kt)から入手できます。
>
{style="note"}

`cancellable`オペレーターを使用すると、1から3までの数値のみが収集されます。

```text
1
2
3
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@5ec0a365
```

<!--- TEST EXCEPTION -->

## FlowとReactive Streams

[Reactive Streams](https://www.reactive-streams.org/)やRxJava、Project Reactorなどのリアクティブフレームワークに精通している人にとっては、Flowの設計は非常に馴染み深く見えるかもしれません。

実際、その設計はReactive Streamsとその様々な実装に触発されています。しかし、Flowの主な目標は、可能な限りシンプルな設計を持ち、Kotlinと停止に友好的であり、構造化された並行性を尊重することです。この目標を達成することは、リアクティブの先駆者とその多大な貢献なしには不可能でした。完全な話は、「[Reactive Streams and Kotlin Flows](https://medium.com/@elizarov/reactive-streams-and-kotlin-flows-bfd12772cda4)」の記事で読むことができます。

異なる点はあるものの、概念的にはFlowはリアクティブストリームであり、リアクティブ（仕様およびTCK準拠）なPublisherに変換することも、その逆も可能です。
そのような変換は`kotlinx.coroutines`によってすぐに提供されており、対応するリアクティブモジュール（Reactive Streams用には`kotlinx-coroutines-reactive`、Project Reactor用には`kotlinx-coroutines-reactor`、RxJava2/RxJava3用には`kotlinx-coroutines-rx2`/`kotlinx-coroutines-rx3`）で見つけることができます。
統合モジュールには、`Flow`との相互変換、Reactorの`Context`との統合、および様々なリアクティブエンティティを扱うための停止に友好的な方法が含まれています。
 
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