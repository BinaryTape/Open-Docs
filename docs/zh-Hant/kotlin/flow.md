<!--- TEST_NAME FlowGuideTest --> 
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 非同步 Flow)

暫停函數 (suspending function) 會非同步地回傳單一值，但我們如何回傳多個非同步計算的值呢？這正是 Kotlin Flow 發揮作用的地方。

## 表示多個值

在 Kotlin 中可以使用 [集合 (collections)] 來表示多個值。例如，我們可以有一個 `simple` 函數，它回傳一個包含三個數字的 [List (列表)]，然後使用 [forEach] 將它們全部印出：

```kotlin
fun simple(): List<Int> = listOf(1, 2, 3)
 
fun main() {
    simple().forEach { value -> println(value) } 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-01.kt -->
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-01.kt)取得完整程式碼。
>
{style="note"}

此程式碼輸出：

```text
1
2
3
```

<!--- TEST -->

### 序列 (Sequences)

如果我們使用一些消耗 CPU 的阻塞式程式碼來計算這些數字（每次計算耗時 100 毫秒），那麼我們可以使用 [序列 (Sequence)] 來表示這些數字：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-02.kt)取得完整程式碼。
>
{style="note"}

此程式碼輸出相同的數字，但它在印出每個數字前會等待 100 毫秒。

<!--- TEST 
1
2
3
-->

### 暫停函數 (Suspending Functions)

然而，這種計算會阻塞執行程式碼的**主執行緒 (main thread)**。當這些值由非同步程式碼計算時，我們可以將 `simple` 函數標記為 `suspend` 修飾符，使其可以在不阻塞的情況下執行其工作並回傳結果為一個列表：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-03.kt)取得完整程式碼。
>
{style="note"}

此程式碼在等待一秒後印出數字。

<!--- TEST 
1
2
3
-->

### Flow (流)

使用 `List<Int>` 結果型別意味著我們只能一次性回傳所有值。為了表示正在非同步計算的值的流，我們可以使用 [`Flow<Int>`][Flow] 型別，就像我們對同步計算的值使用 `Sequence<Int>` 型別一樣：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-04.kt)取得完整程式碼。
>
{style="note"}

此程式碼在印出每個數字前等待 100 毫秒，且不會阻塞主執行緒。這可以透過從在主執行緒中執行的獨立協程 (coroutine) 每 100 毫秒印出「I'm not blocked」來驗證：

```text
I'm not blocked 1
1
I'm not blocked 2
2
I'm not blocked 3
3
```

<!--- TEST -->

請注意程式碼與之前範例中的 [Flow] 的以下差異：

*   [Flow] 型別的建構器函數稱為 [flow][_flow]。
*   `flow { ... }` 建構器區塊內的程式碼可以暫停。
*   `simple` 函數不再標記有 `suspend` 修飾符。
*   值是使用 [emit][FlowCollector.emit] 函數從 Flow 中_發射_出去的。
*   值是使用 [collect][collect] 函數從 Flow 中_收集_的。

> 我們可以將 [delay] 替換為 `simple` 的 `flow { ... }` 主體中的 `Thread.sleep`，並觀察到在這種情況下主執行緒會被阻塞。
>
{style="note"}

## Flow 是冷流

Flow 是_冷流 (cold streams)_，類似於序列 (sequences) &mdash; [flow][_flow] 建構器中的程式碼在 Flow 被收集之前不會執行。以下範例清楚說明了這一點：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-05.kt)取得完整程式碼。
>
{style="note"}

它會印出：

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
 
這是 `simple` 函數（回傳一個 Flow）未標記 `suspend` 修飾符的一個關鍵原因。`simple()` 呼叫本身會快速回傳，不會等待任何東西。每次收集時，Flow 都會重新開始，這就是為什麼每次我們再次呼叫 `collect` 時，都會看到「Flow started」。

## Flow 取消基礎

Flow 遵守協程的一般協同取消 (cooperative cancellation)。通常，當 Flow 在可取消的暫停函數（例如 [delay]）中暫停時，Flow 收集可以被取消。以下範例展示了當 Flow 在 [withTimeoutOrNull] 區塊中執行時，如何在逾時時被取消並停止執行其程式碼：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-06.kt)取得完整程式碼。
>
{style="note"}

請注意 `simple` 函數中的 Flow 如何只發射了兩個數字，產生以下輸出： 

```text
Emitting 1
1
Emitting 2
2
Done
```

<!--- TEST -->

有關更多詳細資訊，請參閱 [Flow 取消檢查](#flow-cancellation-checks) 部分。

## Flow 建構器

前面範例中的 `flow { ... }` 建構器是最基本的。還有其他建構器允許宣告 Flow：

*   [flowOf] 建構器定義了一個發射固定值集合的 Flow。
*   各種集合和序列可以使用 `.asFlow()` 擴充函數轉換為 Flow。

例如，將 Flow 中 1 到 3 的數字印出的程式碼片段可以改寫如下：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-07.kt)取得完整程式碼。
>
{style="note"}

<!--- TEST
1
2
3
-->

## Flow 中間運算子

Flow 可以像轉換集合和序列一樣使用運算子進行轉換。中間運算子 (Intermediate operators) 會應用於上游 Flow (upstream flow) 並回傳下游 Flow (downstream flow)。這些運算子與 Flow 一樣是冷流。對此類運算子的呼叫本身不是暫停函數。它會快速執行，回傳一個新的轉換後 Flow 的定義。 

基本運算子有像 [map] 和 [filter] 這樣熟悉的名字。這些運算子與序列的一個重要區別是，這些運算子內部的程式碼區塊可以呼叫暫停函數。 

例如，一個傳入請求的 Flow 可以使用 [map] 運算子映射到其結果，即使執行請求是一個由暫停函數實作的長時間執行操作：   

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-08.kt)取得完整程式碼。
>
{style="note"}

它會產生以下三行，每行都在前一行出現後一秒出現：

```text                                                                    
response 1
response 2
response 3
```

<!--- TEST -->

### Transform 運算子

在 Flow 轉換運算子中，最通用的一個叫做 [transform]。它可以用來模仿像 [map] 和 [filter] 這樣的簡單轉換，以及實作更複雜的轉換。使用 `transform` 運算子，我們可以 [emit][FlowCollector.emit] 任意次數的任意值。

例如，使用 `transform`，我們可以在執行長時間的非同步請求之前發射一個字串，然後緊接著發射回應：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-09.kt)取得完整程式碼。
>
{style="note"}

此程式碼的輸出為：

```text
Making request 1
response 1
Making request 2
response 2
Making request 3
response 3
```

<!--- TEST -->

### 限制大小的運算子

像 [take] 這樣限制大小的中間運算子會在達到相應限制時取消 Flow 的執行。協程中的取消總是透過拋出例外來執行，以便所有資源管理函數（例如 `try { ... } finally { ... }` 區塊）在取消情況下正常運作：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-10.kt)取得完整程式碼。
>
{style="note"}

此程式碼的輸出清楚顯示 `numbers()` 函數中 `flow { ... }` 主體的執行在發射第二個數字後停止了：

```text       
1
2
Finally in numbers
```

<!--- TEST -->

## Flow 終端運算子

Flow 上的終端運算子 (Terminal operators) 是_暫停函數_，它們啟動 Flow 的收集。 [collect] 運算子是最基本的一個，但還有其他終端運算子，可以使其更容易：

*   轉換為各種集合，例如 [toList] 和 [toSet]。
*   用於獲取第一個值和確保 Flow 發射單一值的運算子。
*   使用 [reduce] 和 [fold] 將 Flow 約束 (reduce) 為一個值。

例如：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-11.kt)取得完整程式碼。
>
{style="note"}

印出一個數字：

```text
55
```

<!--- TEST -->

## Flow 是序列化的

每個單獨的 Flow 收集都是循序執行的，除非使用了操作多個 Flow 的特殊運算子。收集直接在呼叫終端運算子的協程中工作。預設情況下不會啟動新的協程。每個發射的值都會被所有中間運算子從上游到下游處理，然後再傳遞給終端運算子。 

請參閱以下範例，它過濾偶數整數並將它們映射為字串：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-12.kt)取得完整程式碼。
>
{style="note"}

產生：

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

## Flow 上下文

Flow 的收集始終發生在呼叫協程的上下文中。例如，如果有一個 `simple` Flow，那麼以下程式碼將在該程式碼作者指定的上下文中執行，而不論 `simple` Flow 的實作細節如何：

```kotlin
withContext(context) {
    simple().collect { value ->
        println(value) // run in the specified context 
    }
}
```

<!--- CLEAR -->

Flow 的此屬性稱為_上下文保留 (context preservation)_。

因此，預設情況下，`flow { ... }` 建構器中的程式碼會在相應 Flow 的收集器所提供的上下文中執行。例如，考慮 `simple` 函數的實作，它會印出其被呼叫的執行緒 (thread) 並發射三個數字：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-13.kt)取得完整程式碼。
>
{style="note"}

執行此程式碼會產生：

```text  
[main @coroutine#1] Started simple flow
[main @coroutine#1] Collected 1
[main @coroutine#1] Collected 2
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

由於 `simple().collect` 是從主執行緒呼叫的，因此 `simple` 的 Flow 主體也在主執行緒中被呼叫。這對於不關心執行上下文且不阻塞呼叫者的快速執行或非同步程式碼來說，是完美的預設行為。 

### 使用 `withContext` 時的常見陷阱

然而，長時間執行且消耗 CPU 的程式碼可能需要在 [Dispatchers.Default] 的上下文中執行，而更新 UI 的程式碼可能需要在 [Dispatchers.Main] 的上下文中執行。通常，[withContext] 用於在 Kotlin 協程程式碼中更改上下文，但 `flow { ... }` 建構器中的程式碼必須遵守上下文保留屬性，並且不允許從不同的上下文 [emit][FlowCollector.emit]。 

嘗試執行以下程式碼：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-14.kt)取得完整程式碼。
>
{style="note"}

此程式碼會產生以下例外：

```text
Exception in thread "main" java.lang.IllegalStateException: Flow invariant is violated:
		Flow was collected in [CoroutineId(1), "coroutine#1":BlockingCoroutine{Active}@5511c7f8, BlockingEventLoop@2eac3323],
		but emission happened in [CoroutineId(1), "coroutine#1":DispatchedCoroutine{Active}@2dae0000, Dispatchers.Default].
		Please refer to 'flow' documentation or use 'flowOn' instead
	at ...
``` 

<!--- TEST EXCEPTION -->

### `flowOn` 運算子
   
此例外指向 [flowOn] 函數，該函數應用於更改 Flow 發射的上下文。更改 Flow 上下文的正確方法如下面範例所示，該範例還會印出相應執行緒的名稱以顯示其運作方式：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-15.kt)取得完整程式碼。
>
{style="note"}
  
請注意 `flow { ... }` 如何在背景執行緒中工作，而收集則在主執行緒中發生：   

```text
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 1
[main @coroutine#1] Collected 1
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 2
[main @coroutine#1] Collected 2
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 3
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

這裡需要注意的另一件事是，[flowOn] 運算子改變了 Flow 預設的循序性質。現在，收集發生在一個協程（「coroutine#1」）中，而發射則發生在另一個協程（「coroutine#2」）中，該協程與收集協程在另一個執行緒中併發執行。[flowOn] 運算子在需要更改其上下文中的 [CoroutineDispatcher] 時，會為上游 Flow 創建另一個協程。 

## 緩衝 (Buffering)

從收集 Flow 所需的總體時間來看，在不同協程中執行 Flow 的不同部分會很有幫助，尤其是在涉及長時間運行的非同步操作時。例如，考慮這樣一種情況：`simple` Flow 的發射很慢，產生一個元素需要 100 毫秒；而收集器也很慢，處理一個元素需要 300 毫秒。讓我們看看收集這樣一個包含三個數字的 Flow 需要多長時間：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-16.kt)取得完整程式碼。
>
{style="note"}

它會產生類似這樣的輸出，整個收集過程大約需要 1200 毫秒（三個數字，每個 400 毫秒）：

```text
1
2
3
Collected in 1220 ms
```

<!--- TEST ARBITRARY_TIME -->

我們可以在 Flow 上使用 [buffer] 運算子，讓 `simple` Flow 的發射程式碼與收集程式碼併發執行，而不是循序執行：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-17.kt)取得完整程式碼。
>
{style="note"}

它以更快的速度產生相同的數字，因為我們有效地建立了一個處理管線 (processing pipeline)，只需等待 100 毫秒即可獲取第一個數字，然後花費 300 毫秒處理每個數字。這樣，它大約需要 1000 毫秒才能執行完畢：

```text
1
2
3
Collected in 1071 ms
```                    

<!--- TEST ARBITRARY_TIME -->

> 請注意，[flowOn] 運算子在必須更改 [CoroutineDispatcher] 時使用相同的緩衝機制，但在這裡我們明確要求緩衝而不更改執行上下文。
>
{style="note"}

### 合併 (Conflation)

當一個 Flow 表示操作的部分結果或操作狀態更新時，可能不需要處理每個值，而是只需要處理最新值。在這種情況下，當收集器處理速度太慢時，可以使用 [conflate] 運算子來跳過中間值。以前面的範例為基礎：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-18.kt)取得完整程式碼。
>
{style="note"}

我們看到，當第一個數字仍在處理時，第二個和第三個數字已經產生，因此第二個數字被_合併_，只有最新（第三個）數字被傳遞給收集器：

```text
1
3
Collected in 758 ms
```             

<!--- TEST ARBITRARY_TIME -->

### 處理最新值

合併是當發射器和收集器都慢時加快處理速度的一種方法。它透過捨棄發射的值來實現。另一種方法是取消慢速的收集器，並在每次發射新值時重新啟動它。有一系列 `xxxLatest` 運算子執行與 `xxx` 運算子相同的基本邏輯，但在收到新值時取消其區塊中的程式碼。讓我們嘗試將前一個範例中的 [conflate] 更改為 [collectLatest]：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-19.kt)取得完整程式碼。
>
{style="note"}
 
由於 [collectLatest] 的主體需要 300 毫秒，但每 100 毫秒就會發射新值，我們可以看到該區塊在每個值上都會執行，但只對最後一個值完成：

```text 
Collecting 1
Collecting 2
Collecting 3
Done 3
Collected in 741 ms
``` 

<!--- TEST ARBITRARY_TIME -->

## 組合多個 Flow

有多種方法可以組合多個 Flow。

### Zip (合併)

就像 Kotlin 標準函式庫中的 [Sequence.zip] 擴充函數一樣，Flow 也有一個 [zip] 運算子，它結合兩個 Flow 的相應值：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-20.kt)取得完整程式碼。
>
{style="note"}

此範例會印出：

```text
1 -> one
2 -> two
3 -> three
```
 
<!--- TEST -->

### Combine (組合)

當 Flow 表示變數或操作的最新值時（另請參閱關於 [合併](#conflation) 的相關部分），可能需要執行一個依賴於相應 Flow 最新值的計算，並在任何上游 Flow 發射值時重新計算。相應的運算子系列稱為 [combine]。

例如，如果前一個範例中的數字每 300 毫秒更新一次，但字串每 400 毫秒更新一次，那麼使用 [zip] 運算子將它們壓縮 (zip) 仍然會產生相同的結果，儘管結果每 400 毫秒才印出一次：

> 在此範例中，我們使用 [onEach] 中間運算子來延遲每個元素，並使發射範例 Flow 的程式碼更具宣告性且更簡潔。
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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-21.kt)取得完整程式碼。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
1 -> one at 437 ms from start
2 -> two at 837 ms from start
3 -> three at 1243 ms from start
-->

然而，當這裡使用 [combine] 運算子而不是 [zip] 時：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-22.kt)取得完整程式碼。
>
{style="note"}

我們會得到一個截然不同的輸出，其中每一行都是在 `nums` 或 `strs` Flow 中任意一個發射時印出的：

```text 
1 -> one at 452 ms from start
2 -> one at 651 ms from start
2 -> two at 854 ms from start
3 -> two at 952 ms from start
3 -> three at 1256 ms from start
```

<!--- TEST ARBITRARY_TIME -->

## 扁平化 Flow

Flow 表示非同步接收的值序列，因此很容易遇到這樣的情況：每個值都會觸發對另一個值序列的請求。例如，我們可以有以下函數，它回傳兩個字串的 Flow，間隔 500 毫秒：

```kotlin
fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // wait 500 ms
    emit("$i: Second")    
}
```

<!--- CLEAR -->

現在，如果我們有一個包含三個整數的 Flow，並像這樣對每個整數呼叫 `requestFlow`：

```kotlin
(1..3).asFlow().map { requestFlow(it) }
```

<!--- CLEAR -->

那麼我們最終會得到一個 Flow 中的 Flow (`Flow<Flow<String>>`)，它需要被_扁平化 (flattened)_ 為單個 Flow 以進行進一步處理。集合和序列有 [flatten][Sequence.flatten] 和 [flatMap][Sequence.flatMap] 運算子來實現此目的。然而，由於 Flow 的非同步性質，它們需要不同的扁平化_模式_，因此存在一系列 Flow 扁平化運算子。

### `flatMapConcat`

Flow 中的 Flow 的串聯由 [flatMapConcat] 和 [flattenConcat] 運算子提供。它們是相應序列運算子最直接的類比。它們會等待內部 Flow 完成後才開始收集下一個，如下例所示：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-23.kt)取得完整程式碼。
>
{style="note"}

[flatMapConcat] 的循序性質在輸出中清晰可見：

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

另一種扁平化操作是同時收集所有傳入的 Flow 並將它們的值合併為單個 Flow，以便盡可能快地發射值。它由 [flatMapMerge] 和 [flattenMerge] 運算子實作。它們都接受一個可選的 `concurrency` 參數，該參數限制同時收集的併發 Flow 數量（預設等於 [DEFAULT_CONCURRENCY]）。 

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-24.kt)取得完整程式碼。
>
{style="note"}

[flatMapMerge] 的併發性質是顯而易見的：

```text                      
1: First at 136 ms from start
2: First at 231 ms from start
3: First at 333 ms from start
1: Second at 639 ms from start
2: Second at 732 ms from start
3: Second at 833 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->

> 請注意，[flatMapMerge] 會循序呼叫其程式碼區塊（此範例中的 `{ requestFlow(it) }`），但會併發收集結果 Flow，這相當於先執行循序的 `map { requestFlow(it) }`，然後再對結果呼叫 [flattenMerge]。
>
{style="note"}

### `flatMapLatest`   

與 ["處理最新值"](#processing-the-latest-value) 章節中描述的 [collectLatest] 運算子類似，還存在相應的「最新 (Latest)」扁平化模式，其中一旦新的 Flow 發射，前一個 Flow 的收集就會被取消。它由 [flatMapLatest] 運算子實作。

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-25.kt)取得完整程式碼。
>
{style="note"}

此範例中的輸出很好地展示了 [flatMapLatest] 的運作方式：

```text                      
1: First at 142 ms from start
2: First at 322 ms from start
3: First at 425 ms from start
3: Second at 931 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->
  
> 請注意，[flatMapLatest] 在接收到新值時會取消其區塊中的所有程式碼（此範例中的 `{ requestFlow(it) }`）。
> 在此特定範例中沒有區別，因為 `requestFlow` 呼叫本身是快速的、非暫停的，並且無法被取消。然而，如果我們在 `requestFlow` 中使用像 `delay` 這樣的暫停函數，則輸出會有所不同。
>
{style="note"}

## Flow 例外

當發射器或運算子內部的程式碼拋出例外時，Flow 收集可能會因例外而完成。有幾種處理這些例外的方法。

### 收集器的 `try` 和 `catch`

收集器可以使用 Kotlin 的 [`try/catch`][exceptions] 區塊來處理例外： 

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-26.kt)取得完整程式碼。
>
{style="note"}

此程式碼成功地在 [collect] 終端運算子中捕獲了例外，正如我們所見，此後沒有再發射任何值：

```text 
Emitting 1
1
Emitting 2
2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST -->

### 所有例外都被捕獲

前面的範例實際上捕獲了發射器或任何中間或終端運算子中發生的任何例外。例如，讓我們修改程式碼，讓發射的值 [map] 到字串，但相應的程式碼會產生例外：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-27.kt)取得完整程式碼。
>
{style="note"}

此例外仍然被捕獲，並且收集停止：

```text 
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
```

<!--- TEST -->

## 例外透明度

但是發射器的程式碼如何封裝其例外處理行為呢？  

Flow 必須對例外是_透明的 (transparent to exceptions)_，在 `flow { ... }` 建構器中從 `try/catch` 區塊內部 [emit][FlowCollector.emit] 值是違反例外透明度的。這保證了拋出例外的收集器始終可以使用 `try/catch` 來捕獲它，如同前面的範例一樣。

發射器可以使用一個 [catch] 運算子，它保留了這種例外透明度並允許封裝其例外處理。`catch` 運算子的主體可以分析例外並根據捕獲的例外以不同方式回應：

*   例外可以使用 `throw` 重新拋出。
*   例外可以透過從 [catch] 的主體中使用 [emit][FlowCollector.emit] 轉化為值的發射。
*   例外可以被忽略、記錄或由其他程式碼處理。

例如，讓我們在捕獲例外時發射文本：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-28.kt)取得完整程式碼。
>
{style="note"} 
 
範例的輸出是相同的，儘管我們不再在程式碼周圍使用 `try/catch`。 

<!--- TEST  
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
-->

### 透明的 `catch`

[catch] 中間運算子，遵守例外透明度，只捕獲上游例外（即來自 `catch` 上方所有運算子的例外，而不是其下方的例外）。如果 `collect { ... }` 中的區塊（放置在 `catch` 下方）拋出例外，那麼它將會逸出 (escape)：  

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-29.kt)取得完整程式碼。
>
{style="note"}
 
儘管有 `catch` 運算子，但「Caught ...」訊息並未印出： 

```text  
Emitting 1
1
Emitting 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
	at ...
```

<!--- TEST EXCEPTION -->

### 宣告式捕獲例外

我們可以將 [catch] 運算子的宣告式特性與處理所有例外的需求結合起來，方法是將 [collect] 運算子的主體移至 [onEach] 中，並將其置於 `catch` 運算子之前。此 Flow 的收集必須由不帶參數的 `collect()` 呼叫觸發：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-30.kt)取得完整程式碼。
>
{style="note"} 
 
現在我們可以看到「Caught ...」訊息被印出，因此我們可以在不顯式使用 `try/catch` 區塊的情況下捕獲所有例外： 

```text 
Emitting 1
1
Emitting 2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## Flow 完成

當 Flow 收集完成時（正常或因例外），它可能需要執行一個動作。如您所知，這可以透過兩種方式完成：命令式 (imperative) 或宣告式 (declarative)。

### 命令式的 `finally` 區塊

除了 `try`/`catch` 之外，收集器還可以使用 `finally` 區塊在 `collect` 完成時執行動作。

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-31.kt)取得完整程式碼。
>
{style="note"} 

此程式碼印出 `simple` Flow 產生的三個數字，後接字串「Done」：

```text
1
2
3
Done
```

<!--- TEST  -->

### 宣告式處理

對於宣告式方法，Flow 有 [onCompletion] 中間運算子，它在 Flow 完全收集時被呼叫。

前面的範例可以使用 [onCompletion] 運算子重寫，並產生相同的輸出：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-32.kt)取得完整程式碼。
>
{style="note"} 

<!--- TEST 
1
2
3
Done
-->

[onCompletion] 的主要優勢是 Lambda 的可空 `Throwable` 參數，它可以用於判斷 Flow 收集是正常完成還是因例外而完成。在以下範例中，`simple` Flow 在發射數字 1 後拋出例外：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-33.kt)取得完整程式碼。
>
{style="note"}

正如您所預期的，它會印出：

```text
1
Flow completed exceptionally
Caught exception
```

<!--- TEST -->

[onCompletion] 運算子與 [catch] 不同，它不處理例外。從上面的範例程式碼中我們可以看到，例外仍然向下流動 (flows downstream)。它將被傳遞給進一步的 `onCompletion` 運算子，並可以使用 `catch` 運算子處理。

### 成功完成

與 [catch] 運算子的另一個區別是，[onCompletion] 會看到所有例外，並且僅在上游 Flow 成功完成時（沒有取消或失敗）才接收到 `null` 例外。

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-34.kt)取得完整程式碼。
>
{style="note"}

我們可以看到完成原因不是 null，因為 Flow 因下游例外而被中止：

```text 
1
Flow completed with java.lang.IllegalStateException: Collected 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## 命令式與宣告式

現在我們知道如何收集 Flow，以及如何以命令式和宣告式兩種方式處理其完成和例外。這裡的自然問題是，哪種方法更受青睞以及為什麼？作為一個函式庫，我們不提倡任何特定的方法，並認為這兩種選項都有效，應根據您自己的偏好和程式碼風格進行選擇。 

## 啟動 Flow

使用 Flow 來表示來自某些來源的非同步事件很簡單。在這種情況下，我們需要一個類似於 `addEventListener` 函數的東西，它註冊一段程式碼以響應傳入的事件並繼續進一步的工作。[onEach] 運算子可以扮演這個角色。然而，`onEach` 是一個中間運算子。我們還需要一個終端運算子來收集 Flow。否則，單獨呼叫 `onEach` 沒有任何效果。
 
如果我們在 [onEach] 之後使用 [collect] 終端運算子，那麼它之後的程式碼將會等待直到 Flow 被收集：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-35.kt)取得完整程式碼。
>
{style="note"} 
  
正如您所見，它會印出：

```text 
Event: 1
Event: 2
Event: 3
Done
```    

<!--- TEST -->
 
[launchIn] 終端運算子在此處派上用場。透過將 `collect` 替換為 `launchIn`，我們可以在單獨的協程中啟動 Flow 的收集，以便後續程式碼的執行立即繼續：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-36.kt)取得完整程式碼。
>
{style="note"} 
  
它會印出：

```text          
Done
Event: 1
Event: 2
Event: 3
```    

<!--- TEST -->

`launchIn` 所需的參數必須指定一個 [CoroutineScope]，其中用於收集 Flow 的協程被啟動。在上述範例中，這個 scope 來自 [runBlocking] 協程建構器，因此在 Flow 執行時，這個 [runBlocking] scope 會等待其子協程完成，並阻止主函數回傳並終止此範例。 

在實際應用中，scope 將來自具有有限生命週期的實體。一旦此實體的生命週期終止，相應的 scope 就會被取消，從而取消對相應 Flow 的收集。透過這種方式，`onEach { ... }.launchIn(scope)` 這對操作就像 `addEventListener` 一樣。然而，不需要相應的 `removeEventListener` 函數，因為取消和結構化併發 (structured concurrency) 達到了這個目的。

請注意，[launchIn] 也會回傳一個 [Job]，可用於僅 [取消][Job.cancel] 相應的 Flow 收集協程，而不會取消整個 scope，或用於 [join][Job.join] 它。

### Flow 取消檢查

為方便起見，[flow][_flow] 建構器在每個發射的值上執行額外的 [ensureActive] 取消檢查。這意味著從 `flow { ... }` 發射的繁忙迴圈是可取消的：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-37.kt)取得完整程式碼。
>
{style="note"}

我們只得到數字 3 及以下，並在嘗試發射數字 4 後得到一個 [CancellationException]：

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

然而，出於性能原因，大多數其他 Flow 運算子本身不執行額外的取消檢查。例如，如果您使用 [IntRange.asFlow] 擴充功能來編寫相同的繁忙迴圈，並且沒有在任何地方暫停，那麼就沒有取消檢查：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-38.kt)取得完整程式碼。
>
{style="note"}

所有 1 到 5 的數字都被收集，並且只有在從 `runBlocking` 回傳之前才檢測到取消：

```text
1
2
3
4
5
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@3327bd23
```

<!--- TEST EXCEPTION -->

#### 使繁忙的 Flow 可取消 

如果您在協程中有一個繁忙的迴圈，則必須明確檢查取消。您可以添加 `.onEach { currentCoroutineContext().ensureActive() }`，但有一個現成的 [cancellable] 運算子可供使用：

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
> 您可以在[這裡](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-39.kt)取得完整程式碼。
>
{style="note"}

使用 `cancellable` 運算子，只收集了 1 到 3 的數字：

```text
1
2
3
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@5ec0a365
```

<!--- TEST EXCEPTION -->

## Flow 與 Reactive Streams

對於熟悉 [Reactive Streams](https://www.reactive-streams.org/) 或 RxJava 和 Project Reactor 等響應式框架的人來說，Flow 的設計可能看起來非常熟悉。

確實，它的設計靈感來自 Reactive Streams 及其各種實作。但 Flow 的主要目標是盡可能簡單的設計，對 Kotlin 和暫停友善，並尊重結構化併發 (structured concurrency)。如果沒有響應式領域的先驅者及其巨大的貢獻，實現這一目標將是不可能的。您可以在 [Reactive Streams and Kotlin Flows](https://medium.com/@elizarov/reactive-streams-and-kotlin-flows-bfd12772cda4) 文章中閱讀完整的故事。

儘管有所不同，但在概念上，Flow *是*一個響應式流 (reactive stream)，並且可以將其轉換為響應式（符合規範和 TCK）的 Publisher，反之亦然。`kotlinx.coroutines` 開箱即用提供此類轉換器，並可在相應的響應式模組中找到（`kotlinx-coroutines-reactive` 用於 Reactive Streams，`kotlinx-coroutines-reactor` 用於 Project Reactor，以及 `kotlinx-coroutines-rx2`/`kotlinx-coroutines-rx3` 用於 RxJava2/RxJava3）。整合模組包括 Flow 的來回轉換、與 Reactor 的 `Context` 整合，以及與各種響應式實體協作的暫停友善方式。
 
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