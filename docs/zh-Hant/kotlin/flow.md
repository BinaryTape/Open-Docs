<!--- TEST_NAME FlowGuideTest --> 
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 非同步 Flow)

一個暫停函式會非同步傳回單一值，但我們如何傳回多個非同步計算的值呢？這就是 Kotlin Flow 派上用場的地方。

## 表示多個值

在 Kotlin 中可以使用 [collections] 來表示多個值。例如，我們可以有一個 `simple` 函式，它傳回一個包含三個數字的 [List]，然後使用 [forEach] 將它們全部列印出來：

```kotlin
fun simple(): List<Int> = listOf(1, 2, 3)
 
fun main() {
    simple().forEach { value -> println(value) } 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-01.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-01.kt)。
>
{style="note"}

此程式碼輸出：

```text
1
2
3
```

<!--- TEST -->

### Sequence

如果我們正在使用一些耗費 CPU 的阻塞式程式碼來計算數字（每次計算需要 100 毫秒），那麼我們可以使用 [Sequence] 來表示這些數字：

```kotlin
fun simple(): Sequence<Int> = sequence { // sequence 建構器
    for (i in 1..3) {
        Thread.sleep(100) // 假設我們正在計算它
        yield(i) // 產生下一個值
    }
}

fun main() {
    simple().forEach { value -> println(value) } 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-02.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-02.kt)。
>
{style="note"}

此程式碼輸出相同的數字，但在列印每個數字之前會等待 100 毫秒。

<!--- TEST 
1
2
3
-->

### 暫停函式

然而，此計算會阻塞執行程式碼的主執行緒。當這些值由非同步程式碼計算時，我們可以為 `simple` 函式標記 `suspend` 修飾符，使其可以在不阻塞的情況下執行其工作並以列表形式傳回結果：

```kotlin
import kotlinx.coroutines.*                 
                           
//sampleStart
suspend fun simple(): List<Int> {
    delay(1000) // 假設我們正在這裡執行一些非同步操作
    return listOf(1, 2, 3)
}

fun main() = runBlocking<Unit> {
    simple().forEach { value -> println(value) } 
}
//sampleEnd
```  
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-03.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-03.kt)。
>
{style="note"}

此程式碼等待一秒後列印數字。

<!--- TEST 
1
2
3
-->

### Flow

使用 `List<Int>` 結果類型，表示我們只能一次傳回所有值。為了表示正在非同步計算的值串流，我們可以像使用 `Sequence<Int>` 類型處理同步計算的值一樣，使用 [`Flow<Int>`][Flow] 類型：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart               
fun simple(): Flow<Int> = flow { // flow 建構器
    for (i in 1..3) {
        delay(100) // 假設我們正在這裡做一些有用的事情
        emit(i) // 發射下一個值
    }
}

fun main() = runBlocking<Unit> {
    // 啟動一個並行協程以檢查主執行緒是否被阻塞
    launch {
        for (k in 1..3) {
            println("I'm not blocked $k")
            delay(100)
        }
    }
    // 收集 Flow
    simple().collect { value -> println(value) } 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-04.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-04.kt)。
>
{style="note"}

此程式碼在列印每個數字之前等待 100 毫秒，而不阻塞主執行緒。這可以透過從在主執行緒中執行的單獨協程每 100 毫秒列印一次「I'm not blocked」來驗證：

```text
I'm not blocked 1
1
I'm not blocked 2
2
I'm not blocked 3
3
```

<!--- TEST -->

請注意 [Flow] 程式碼與先前範例的以下差異：

* [Flow] 類型的建構函式被稱為 [flow][_flow]。
* `flow { ... }` 建構器區塊內的程式碼可以暫停。
* `simple` 函式不再使用 `suspend` 修飾符標記。
* 值透過 [emit][FlowCollector.emit] 函式從 Flow 中_發射_出來。
* 值透過 [collect][collect] 函式從 Flow 中_收集_。

> 我們可以將 `simple` 的 `flow { ... }` 主體中的 [delay] 替換為 `Thread.sleep`，並查看在這種情況下主執行緒是否被阻塞。
>
{style="note"}

## Flow 是冷的

Flow 是_冷_串流，類似於序列 — [flow][_flow] 建構器內的程式碼直到 Flow 被收集後才會執行。這在以下範例中變得清晰：

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-05.kt)。
>
{style="note"}

它列印：

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
 
這是 `simple` 函式（它傳回 Flow）未以 `suspend` 修飾符標記的關鍵原因。`simple()` 呼叫本身會快速傳回，並且不會等待任何東西。Flow 每次被收集時都會重新開始，這就是為什麼我們每次再次呼叫 `collect` 時都會看到「Flow started」。

## Flow 取消基礎知識

Flow 遵循協程的一般協同取消原則。與往常一樣，當 Flow 在可取消的暫停函式（如 [delay]）中暫停時，Flow 收集可以被取消。以下範例顯示了 Flow 在 [withTimeoutOrNull] 區塊中執行時如何在逾時時被取消並停止執行其程式碼：

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
    withTimeoutOrNull(250) { // 250 毫秒後逾時 
        simple().collect { value -> println(value) } 
    }
    println("Done")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-06.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-06.kt)。
>
{style="note"}

請注意在 `simple` 函式中，Flow 只發射了兩個數字，產生以下輸出：

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

先前範例中的 `flow { ... }` 建構器是最基本的一個。還有其他建構器允許宣告 Flow：

* [flowOf] 建構器定義了一個發射固定值集合的 Flow。
* 各種集合和序列可以使用 `.asFlow()` 擴充函式轉換為 Flow。

例如，從 Flow 列印數字 1 到 3 的片段可以重寫如下：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart
    // 將整數範圍轉換為 Flow
    (1..3).asFlow().collect { value -> println(value) }
//sampleEnd 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-07.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-07.kt)。
>
{style="note"}

<!--- TEST
1
2
3
-->

## 中間 Flow 運算符

Flow 可以使用運算符進行轉換，方式與轉換集合和序列相同。中間運算符作用於上游 Flow 並傳回下游 Flow。這些運算符是冷的，就像 Flow 一樣。對此類運算符的呼叫本身不是暫停函式。它執行迅速，傳回新轉換的 Flow 的定義。

基本運算符具有諸如 [map] 和 [filter] 等熟悉名稱。這些運算符與序列的一個重要區別是，這些運算符內部的程式碼區塊可以呼叫暫停函式。

例如，傳入請求的 Flow 可以使用 [map] 運算符映射到其結果，即使執行請求是透過暫停函式實作的長時間執行操作：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart           
suspend fun performRequest(request: Int): String {
    delay(1000) // 模擬長時間執行的非同步工作
    return "response $request"
}

fun main() = runBlocking<Unit> {
    (1..3).asFlow() // 請求的 Flow
        .map { request -> performRequest(request) }
        .collect { response -> println(response) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-08.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-08.kt)。
>
{style="note"}

它產生以下三行，每行都在前一行之後一秒出現：

```text                                                                    
response 1
response 2
response 3
```

<!--- TEST -->

### Transform 運算符

在 Flow 轉換運算符中，最通用的一個是 [transform]。它可以用來模仿 [map] 和 [filter] 等簡單轉換，以及實作更複雜的轉換。使用 `transform` 運算符，我們可以 [emit][FlowCollector.emit] 任意值任意次數。

例如，使用 `transform`，我們可以在執行長時間執行的非同步請求之前發射一個字串，然後跟隨一個回應：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

suspend fun performRequest(request: Int): String {
    delay(1000) // 模擬長時間執行的非同步工作
    return "response $request"
}

fun main() = runBlocking<Unit> {
//sampleStart
    (1..3).asFlow() // 請求的 Flow
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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-09.kt)。
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

### 限制大小的運算符

[take] 等限制大小的中間運算符會在達到相應限制時取消 Flow 的執行。協程中的取消總是透過拋出例外來執行，以便所有資源管理函式（如 `try { ... } finally { ... }` 區塊）在取消情況下正常運作：

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
        .take(2) // 只取前兩個
        .collect { value -> println(value) }
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-10.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-10.kt)。
>
{style="note"}

此程式碼的輸出清楚地顯示，`numbers()` 函式中 `flow { ... }` 主體的執行在發射第二個數字後停止：

```text       
1
2
Finally in numbers
```

<!--- TEST -->

## 終端 Flow 運算符

Flow 上的終端運算符是_暫停函式_，用於啟動 Flow 的收集。 [collect] 運算符是最基本的一個，但還有其他終端運算符，可以使其更容易：

* 轉換為各種集合，如 [toList] 和 [toSet]。
* 取得 [first] 值並確保 Flow 發射 [single] 值的運算符。
* 使用 [reduce] 和 [fold] 將 Flow 歸約為一個值。

例如：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart         
    val sum = (1..5).asFlow()
        .map { it * it } // 從 1 到 5 的數字平方                           
        .reduce { a, b -> a + b } // 求和（終端運算符）
    println(sum)
//sampleEnd     
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-11.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-11.kt)。
>
{style="note"}

列印單一數字：

```text
55
```

<!--- TEST -->

## Flow 是循序的

Flow 的每次單獨收集都是循序執行的，除非使用作用於多個 Flow 的特殊運算符。收集直接在呼叫終端運算符的協程中運作。預設情況下不會啟動新的協程。每個發射的值都由從上游到下游的所有中間運算符處理，然後傳遞給終端運算符。

請看以下範例，它過濾偶數整數並將它們映射為字串：

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-12.kt)。
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

Flow 的收集總是在呼叫協程的上下文中發生。例如，如果有一個 `simple` Flow，那麼以下程式碼會在程式碼作者指定的上下文中執行，而不論 `simple` Flow 的實作細節為何：

```kotlin
withContext(context) {
    simple().collect { value ->
        println(value) // 在指定上下文中執行 
    }
}
```

<!--- CLEAR -->

Flow 的這個屬性稱為_上下文保留_。

因此，預設情況下，`flow { ... }` 建構器中的程式碼會在相應 Flow 的收集器提供的上下文中執行。例如，考慮 `simple` 函式的實作，它會列印其被呼叫的執行緒並發射三個數字：

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-13.kt)。
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

由於 `simple().collect` 是從主執行緒呼叫的，因此 `simple` 的 Flow 主體也在主執行緒中呼叫。對於不關心執行上下文且不阻塞呼叫者的快速執行或非同步程式碼來說，這是一個完美的預設值。

### 使用 withContext 時的常見陷阱

然而，長時間執行且耗費 CPU 的程式碼可能需要在 [Dispatchers.Default] 的上下文中執行，而更新 UI 的程式碼可能需要在 [Dispatchers.Main] 的上下文中執行。通常，[withContext] 用於在 Kotlin 協程程式碼中改變上下文，但 `flow { ... }` 建構器中的程式碼必須遵守上下文保留屬性，並且不允許從不同的上下文 [emit][FlowCollector.emit] 值。

嘗試執行以下程式碼：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
                      
//sampleStart
fun simple(): Flow<Int> = flow {
    // 在 Flow 建構器中為耗費 CPU 的程式碼改變上下文的錯誤方式
    kotlinx.coroutines.withContext(Dispatchers.Default) {
        for (i in 1..3) {
            Thread.sleep(100) // 假設我們正在以耗費 CPU 的方式計算它
            emit(i) // 發射下一個值
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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-14.kt)。
>
{style="note"}

此程式碼產生以下例外：

```text
Exception in thread "main" java.lang.IllegalStateException: Flow invariant is violated:
		Flow was collected in [CoroutineId(1), "coroutine#1":BlockingCoroutine{Active}@5511c7f8, BlockingEventLoop@2eac3323],
		but emission happened in [CoroutineId(1), "coroutine#1":DispatchedCoroutine{Active}@2dae0000, Dispatchers.Default].
		Please refer to 'flow' documentation or use 'flowOn' instead
	at ...
``` 

<!--- TEST EXCEPTION -->

### flowOn 運算符
   
該例外指的是 [flowOn] 函式，它應用於改變 Flow 發射的上下文。改變 Flow 上下文的正確方式如下例所示，該範例還列印了相應執行緒的名稱以展示其運作方式：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")
           
//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        Thread.sleep(100) // 假設我們正在以耗費 CPU 的方式計算它
        log("Emitting $i")
        emit(i) // 發射下一個值
    }
}.flowOn(Dispatchers.Default) // 在 Flow 建構器中為耗費 CPU 的程式碼改變上下文的正確方式

fun main() = runBlocking<Unit> {
    simple().collect { value ->
        log("Collected $value") 
    } 
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-15.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-15.kt)。
>
{style="note"}
  
請注意 `flow { ... }` 如何在背景執行緒中運作，而收集則在主執行緒中發生：

```text
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 1
[main @coroutine#1] Collected 1
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 2
[main @coroutine#1] Collected 2
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 3
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

這裡另一個值得觀察的事情是，[flowOn] 運算符改變了 Flow 預設的循序性質。現在收集發生在一個協程（「coroutine#1」）中，而發射發生在另一個協程（「coroutine#2」）中，該協程在另一個執行緒中與收集協程並行執行。[flowOn] 運算符在必須改變其上下文中的 [CoroutineDispatcher] 時，會為上游 Flow 創建另一個協程。

## 緩衝

在不同的協程中執行 Flow 的不同部分，從收集 Flow 所需的總體時間來看是有幫助的，尤其當涉及長時間執行的非同步操作時。例如，考慮一個 `simple` Flow 發射緩慢的情況，產生一個元素需要 100 毫秒；而收集器也很慢，處理一個元素需要 300 毫秒。讓我們看看收集這樣一個包含三個數字的 Flow 需要多長時間：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假設我們正在非同步等待 100 毫秒
        emit(i) // 發射下一個值
    }
}

fun main() = runBlocking<Unit> { 
    val time = measureTimeMillis {
        simple().collect { value -> 
            delay(300) // 假設我們正在處理它 300 毫秒
            println(value) 
        } 
    }   
    println("Collected in $time ms")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-16.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-16.kt)。
>
{style="note"}

它會產生類似這樣的輸出，整個收集過程約需 1200 毫秒（三個數字，每個 400 毫秒）：

```text
1
2
3
Collected in 1220 ms
```

<!--- TEST ARBITRARY_TIME -->

我們可以在 Flow 上使用 [buffer] 運算符，讓 `simple` Flow 的發射程式碼與收集程式碼並行執行，而不是循序執行：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假設我們正在非同步等待 100 毫秒
        emit(i) // 發射下一個值
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .buffer() // 緩衝發射，不要等待
            .collect { value -> 
                delay(300) // 假設我們正在處理它 300 毫秒
                println(value) 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-17.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-17.kt)。
>
{style="note"}

它會產生相同的數字但速度更快，因為我們有效地建立了一個處理管線，只需等待 100 毫秒即可獲得第一個數字，然後每個數字只需花費 300 毫秒處理。這樣執行大約需要 1000 毫秒：

```text
1
2
3
Collected in 1071 ms
```                    

<!--- TEST ARBITRARY_TIME -->

> 請注意，[flowOn] 運算符在必須改變 [CoroutineDispatcher] 時使用了相同的緩衝機制，但在這裡我們明確要求緩衝而不改變執行上下文。
>
{style="note"}

### 合併 (Conflation)

當 Flow 表示操作的部分結果或操作狀態更新時，可能不需要處理每個值，而是只處理最新的值。在這種情況下，當收集器處理這些值的速度太慢時，可以使用 [conflate] 運算符來跳過中間值。沿用先前的範例：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假設我們正在非同步等待 100 毫秒
        emit(i) // 發射下一個值
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .conflate() // 合併發射，不要處理每個
            .collect { value -> 
                delay(300) // 假設我們正在處理它 300 毫秒
                println(value) 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-18.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-18.kt)。
>
{style="note"}

我們看到，當第一個數字仍在處理時，第二和第三個數字已經產生，因此第二個數字被_合併_了，只有最新的（第三個）被傳遞給收集器：

```text
1
3
Collected in 758 ms
```             

<!--- TEST ARBITRARY_TIME -->

### 處理最新值

合併 (Conflation) 是加速處理的一種方式，當發射器和收集器都慢速時。它透過丟棄發射的值來實現這一點。另一種方式是取消慢速的收集器，並在每次發射新值時重新啟動它。有一系列 `xxxLatest` 運算符執行與 `xxx` 運算符相同本質的邏輯，但在接收到新值時會取消其區塊中的程式碼。讓我們嘗試在先前的範例中將 [conflate] 更改為 [collectLatest]：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假設我們正在非同步等待 100 毫秒
        emit(i) // 發射下一個值
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .collectLatest { value -> // 在最新值時取消並重新啟動
                println("Collecting $value") 
                delay(300) // 假設我們正在處理它 300 毫秒
                println("Done $value") 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-19.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-19.kt)。
>
{style="note"}
 
由於 [collectLatest] 的主體需要 300 毫秒，但每 100 毫秒會發射一個新值，我們看到該區塊對每個值都執行，但只對最後一個值完成：

```text 
Collecting 1
Collecting 2
Collecting 3
Done 3
Collected in 741 ms
``` 

<!--- TEST ARBITRARY_TIME -->

## 組合多個 Flow

有許多方式可以組合多個 Flow。

### Zip

就像 Kotlin 標準函式庫中的 [Sequence.zip] 擴充函式一樣，Flow 也有一個 [zip] 運算符，它組合了兩個 Flow 的相應值：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow() // 數字 1..3
    val strs = flowOf("one", "two", "three") // 字串 
    nums.zip(strs) { a, b -> "$a -> $b" } // 組合一個字串
        .collect { println(it) } // 收集並列印
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-20.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-20.kt)。
>
{style="note"}

此範例列印：

```text
1 -> one
2 -> two
3 -> three
```
 
<!--- TEST -->

### Combine

當 Flow 表示變數或操作的最新值（另請參閱有關 [合併](#conflation) 的相關部分）時，可能需要執行一個依賴於相應 Flow 最新值的計算，並在任何上游 Flow 發射一個值時重新計算它。相應的運算符家族稱為 [combine]。

例如，如果先前範例中的數字每 300 毫秒更新一次，但字串每 400 毫秒更新一次，那麼使用 [zip] 運算符壓縮它們仍然會產生相同的結果，儘管結果每 400 毫秒列印一次：

> 在此範例中，我們使用 [onEach] 中間運算符來延遲每個元素，並使發射範例 Flow 的程式碼更具宣告性且更簡潔。
>
{style="note"}

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow().onEach { delay(300) } // 數字 1..3，每 300 毫秒
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 字串，每 400 毫秒
    val startTime = System.currentTimeMillis() // 記住開始時間 
    nums.zip(strs) { a, b -> "$a -> $b" } // 使用 "zip" 組合一個字串
        .collect { value -> // 收集並列印 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-21.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-21.kt)。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
1 -> one at 437 ms from start
2 -> two at 837 ms from start
3 -> three at 1243 ms from start
-->

然而，當這裡使用 [combine] 運算符而不是 [zip] 時：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow().onEach { delay(300) } // 數字 1..3，每 300 毫秒
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 字串，每 400 毫秒          
    val startTime = System.currentTimeMillis() // 記住開始時間 
    nums.combine(strs) { a, b -> "$a -> $b" } // 使用 "combine" 組合一個字串
        .collect { value -> // 收集並列印 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-22.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-22.kt)。
>
{style="note"}

我們得到一個相當不同的輸出，其中每次從 `nums` 或 `strs` Flow 發射時都會列印一行：

```text 
1 -> one at 452 ms from start
2 -> one at 651 ms from start
2 -> two at 854 ms from start
3 -> two at 952 ms from start
3 -> three at 1256 ms from start
```

<!--- TEST ARBITRARY_TIME -->

## 扁平化 Flow

Flow 表示非同步接收的值序列，因此很容易陷入每個值都觸發對另一個值序列的請求的情況。例如，我們可以有以下函式，它傳回一個包含兩個字串的 Flow，間隔 500 毫秒：

```kotlin
fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 等待 500 毫秒
    emit("$i: Second")    
}
```

<!--- CLEAR -->

現在，如果我們有一個包含三個整數的 Flow，並像這樣在每個整數上呼叫 `requestFlow`：

```kotlin
(1..3).asFlow().map { requestFlow(it) }
```

<!--- CLEAR -->

那麼我們最終會得到一個 Flow 中的 Flow (`Flow<Flow<String>>`)，它需要被_扁平化_為單一 Flow 以便進一步處理。集合和序列有 [flatten][Sequence.flatten] 和 [flatMap][Sequence.flatMap] 運算符用於此目的。然而，由於 Flow 的非同步性質，它們需要不同的_扁平化模式_，因此，存在一個 Flow 上的扁平化運算符家族。

### flatMapConcat

Flow 中 Flow 的串聯由 [flatMapConcat] 和 [flattenConcat] 運算符提供。它們是最直接的相應序列運算符的類比。它們等待內部 Flow 完成後才開始收集下一個，如下例所示：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 等待 500 毫秒
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // 記住開始時間 
    (1..3).asFlow().onEach { delay(100) } // 每 100 毫秒發射一個數字 
        .flatMapConcat { requestFlow(it) }                                                                           
        .collect { value -> // 收集並列印 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-23.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-23.kt)。
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

### flatMapMerge

另一種扁平化操作是並行收集所有傳入的 Flow 並將它們的值合併到單一 Flow 中，以便值會盡快被發射。它由 [flatMapMerge] 和 [flattenMerge] 運算符實現。它們都接受一個可選的 `concurrency` 參數，該參數限制了同時收集的並行 Flow 數量（預設為 [DEFAULT_CONCURRENCY]）。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 等待 500 毫秒
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // 記住開始時間 
    (1..3).asFlow().onEach { delay(100) } // 每 100 毫秒一個數字 
        .flatMapMerge { requestFlow(it) }                                                                           
        .collect { value -> // 收集並列印 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-24.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-24.kt)。
>
{style="note"}

[flatMapMerge] 的並行性質是顯而易見的：

```text                      
1: First at 136 ms from start
2: First at 231 ms from start
3: First at 333 ms from start
1: Second at 639 ms from start
2: Second at 732 ms from start
3: Second at 833 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->

> 請注意，[flatMapMerge] 循序呼叫其程式碼區塊（在此範例中為 `{ requestFlow(it) }`），但並行收集結果 Flow，這等同於先執行循序的 `map { requestFlow(it) }`，然後再對結果呼叫 [flattenMerge]。
>
{style="note"}

### flatMapLatest   

與在「[處理最新值](#processing-the-latest-value)」部分中描述的 [collectLatest] 運算符類似，存在相應的「最新」扁平化模式，其中一旦有新 Flow 發射，前一個 Flow 的收集就會被取消。它由 [flatMapLatest] 運算符實現。

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 等待 500 毫秒
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // 記住開始時間 
    (1..3).asFlow().onEach { delay(100) } // 每 100 毫秒一個數字 
        .flatMapLatest { requestFlow(it) }                                                                           
        .collect { value -> // 收集並列印 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-25.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-25.kt)。
>
{style="note"}

此範例的輸出很好地展示了 [flatMapLatest] 的運作方式：

```text                      
1: First at 142 ms from start
2: First at 322 ms from start
3: First at 425 ms from start
3: Second at 931 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->
  
> 請注意，[flatMapLatest] 在接收到新值時會取消其區塊中的所有程式碼（在此範例中為 `{ requestFlow(it) }`）。
> 在此特定範例中沒有區別，因為 `requestFlow` 的呼叫本身是快速、非暫停且無法取消的。然而，如果我們在 `requestFlow` 中使用像 `delay` 這樣的暫停函式，輸出將會有所不同。
>
{style="note"}

## Flow 例外

當發射器或運算符內部的程式碼拋出例外時，Flow 收集可能會因例外而完成。有幾種處理這些例外的方式。

### 收集器 try 和 catch

收集器可以使用 Kotlin 的 [`try/catch`][exceptions] 區塊來處理例外：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i) // 發射下一個值
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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-26.kt)。
>
{style="note"}

此程式碼成功捕獲了 [collect] 終端運算符中的例外，並且，正如我們所見，此後沒有再發射任何值：

```text 
Emitting 1
1
Emitting 2
2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST -->

### 所有例外皆被捕獲

先前範例實際上捕獲了發射器或任何中間或終端運算符中發生的任何例外。例如，讓我們修改程式碼，使發射的值被 [映射][map] 為字串，但相應的程式碼會產生例外：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<String> = 
    flow {
        for (i in 1..3) {
            println("Emitting $i")
            emit(i) // 發射下一個值
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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-27.kt)。
>
{style="note"}

此例外仍然被捕獲，且收集停止：

```text 
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
```

<!--- TEST -->

## 例外透明性

但是，發射器的程式碼如何封裝其例外處理行為呢？

Flow 必須_對例外透明_，並且在 `flow { ... }` 建構器內部從 `try/catch` 區塊中 [emit][FlowCollector.emit] 值是違反例外透明性的行為。這保證了拋出例外的收集器總是可以像先前的範例一樣使用 `try/catch` 來捕獲它。

發射器可以使用 [catch] 運算符，該運算符保留此例外透明性並允許封裝其例外處理。`catch` 運算符的主體可以分析例外並根據捕獲到的例外以不同方式回應：

* 例外可以使用 `throw` 重新拋出。
* 例外可以透過從 [catch] 主體中 [emit][FlowCollector.emit] 值來轉化為值的發射。
* 例外可以被忽略、記錄，或由其他程式碼處理。

例如，讓我們在捕獲到例外時發射文本：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun simple(): Flow<String> = 
    flow {
        for (i in 1..3) {
            println("Emitting $i")
            emit(i) // 發射下一個值
        }
    }
    .map { value ->
        check(value <= 1) { "Crashed on $value" }                 
        "string $value"
    }

fun main() = runBlocking<Unit> {
//sampleStart
    simple()
        .catch { e -> emit("Caught $e") } // 在例外時發射
        .collect { value -> println(value) }
//sampleEnd
}            
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-28.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-28.kt)。
>
{style="note"} 
 
範例的輸出是相同的，即使我們不再在程式碼周圍使用 `try/catch`。

<!--- TEST  
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
-->

### 透明的 Catch

[catch] 中間運算符，遵守例外透明性，只捕獲上游例外（即來自 `catch` 上方所有運算符的例外，而非其下方）。如果 `collect { ... }` 中的區塊（位於 `catch` 下方）拋出例外，那麼它會逸出：

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
        .catch { e -> println("Caught $e") } // 不捕獲下游例外
        .collect { value ->
            check(value <= 1) { "Collected $value" }                 
            println(value) 
        }
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-29.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-29.kt)。
>
{style="note"}
 
儘管有 `catch` 運算符，但「Caught ...」訊息未被列印：

```text  
Emitting 1
1
Emitting 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
	at ...
```

<!--- TEST EXCEPTION -->

### 宣告式捕獲

我們可以將 [catch] 運算符的宣告式性質與處理所有例外的願望結合起來，方法是將 [collect] 運算符的主體移至 [onEach] 中，並將其放在 `catch` 運算符之前。此 Flow 的收集必須由不帶參數的 `collect()` 呼叫觸發：

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-30.kt)。
>
{style="note"} 
 
現在我們可以看到「Caught ...」訊息被列印出來，因此我們無需明確使用 `try/catch` 區塊即可捕獲所有例外：

```text 
Emitting 1
1
Emitting 2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## Flow 完成

當 Flow 收集完成時（正常或異常），可能需要執行一個動作。正如您可能已經注意到的，這可以透過兩種方式完成：命令式或宣告式。

### 命令式 finally 區塊

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-31.kt)。
>
{style="note"} 

此程式碼列印 `simple` Flow 產生的三個數字，然後是「Done」字串：

```text
1
2
3
Done
```

<!--- TEST  -->

### 宣告式處理

對於宣告式方法，Flow 具有 [onCompletion] 中間運算符，該運算符會在 Flow 完全收集後被調用。

先前範例可以使用 [onCompletion] 運算符重寫，並產生相同的輸出：

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-32.kt)。
>
{style="note"} 

<!--- TEST 
1
2
3
Done
-->

[onCompletion] 的主要優點是 lambda 的可空 `Throwable` 參數，它可以用來判斷 Flow 收集是正常完成還是異常完成。在以下範例中，`simple` Flow 在發射數字 1 後拋出例外：

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-33.kt)。
>
{style="note"}

正如您所預期的，它會列印：

```text
1
Flow completed exceptionally
Caught exception
```

<!--- TEST -->

[onCompletion] 運算符與 [catch] 不同，它不處理例外。正如我們從上面範例程式碼中看到，例外仍然會流向下游。它將被傳遞給後續的 `onCompletion` 運算符，並可以使用 `catch` 運算符處理。

### 成功完成

與 [catch] 運算符的另一個區別是，[onCompletion] 會看到所有例外，並且僅在上游 Flow 成功完成時（沒有取消或失敗）才會收到 `null` 例外。

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-34.kt)。
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

現在我們知道如何收集 Flow，以及以命令式和宣告式兩種方式處理其完成和例外。這裡的自然問題是，哪種方法更受青睞，為什麼？作為一個函式庫，我們不提倡任何特定方法，並認為這兩種選項都是有效的，應根據您自己的偏好和程式碼風格進行選擇。

## 啟動 Flow

使用 Flow 來表示來自某個來源的非同步事件非常容易。在這種情況下，我們需要一個類似 `addEventListener` 函式的類比，該函式註冊一段程式碼以響應傳入事件並繼續進一步工作。[onEach] 運算符可以扮演這個角色。然而，`onEach` 是一個中間運算符。我們還需要一個終端運算符來收集 Flow。否則，單獨呼叫 `onEach` 沒有效果。

如果我們在 `onEach` 之後使用 [collect] 終端運算符，那麼它之後的程式碼將會等待 Flow 被收集：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
// 模仿事件的 Flow
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .collect() // <--- 收集 Flow 會等待
    println("Done")
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-35.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-35.kt)。
>
{style="note"} 
  
正如您所見，它會列印：

```text 
Event: 1
Event: 2
Event: 3
Done
```    

<!--- TEST -->
 
[launchIn] 終端運算符在這裡派上用場。透過將 `collect` 替換為 `launchIn`，我們可以在單獨的協程中啟動 Flow 的收集，以便後續程式碼的執行立即繼續：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

// 模仿事件的 Flow
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

//sampleStart
fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .launchIn(this) // <--- 在單獨的協程中啟動 Flow
    println("Done")
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-36.kt -->
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-36.kt)。
>
{style="note"} 
  
它列印：

```text          
Done
Event: 1
Event: 2
Event: 3
```    

<!--- TEST -->

`launchIn` 的必需參數必須指定一個 [CoroutineScope]，用於啟動收集 Flow 的協程。在上述範例中，此範圍來自 [runBlocking] 協程建構器，因此當 Flow 執行時，此 [runBlocking] 範圍會等待其子協程完成，並防止主函式返回並終止此範例。

在實際應用程式中，範圍將來自具有有限生命週期的實體。一旦此實體的生命週期終止，相應的範圍就會被取消，從而取消相應 Flow 的收集。這樣一來，`onEach { ... }.launchIn(scope)` 的組合就像 `addEventListener` 一樣運作。然而，不需要相應的 `removeEventListener` 函式，因為取消和結構化並行處理可以實現此目的。

請注意，[launchIn] 也會傳回一個 [Job]，該 [Job] 可用於僅 [取消][Job.cancel] 相應的 Flow 收集協程，而無需取消整個範圍，或 [加入][Job.join] 它。

### Flow 取消檢查

為了方便起見，[flow][_flow] 建構器對每個發射的值執行額外的 [ensureActive] 取消檢查。這表示從 `flow { ... }` 發射的繁忙迴圈是可取消的：

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-37.kt)。
>
{style="note"}

我們只得到數字到 3，並在嘗試發射數字 4 後得到一個 [CancellationException]：

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

然而，大多數其他 Flow 運算符出於性能原因，不會自行執行額外的取消檢查。例如，如果您使用 [IntRange.asFlow] 擴充函式編寫相同的繁忙迴圈，並且沒有在任何地方暫停，那麼就沒有取消檢查：

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-38.kt)。
>
{style="note"}

從 1 到 5 的所有數字都被收集了，並且取消僅在從 `runBlocking` 返回之前才被偵測到：

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

在您有繁忙迴圈與協程的情況下，您必須明確檢查取消。您可以新增 `.onEach { currentCoroutineContext().ensureActive() }`，但有一個現成的 [cancellable] 運算符可用於此目的：

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
> 您可以在這裡取得完整程式碼：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-39.kt)。
>
{style="note"}

帶有 `cancellable` 運算符後，只會收集數字 1 到 3：

```text
1
2
3
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@5ec0a365
```

<!--- TEST EXCEPTION -->

## Flow 和 Reactive Streams

對於那些熟悉 [Reactive Streams](https://www.reactive-streams.org/) 或 RxJava 和 Project Reactor 等響應式框架的人來說，Flow 的設計可能看起來非常熟悉。

事實上，它的設計靈感來自 Reactive Streams 及其各種實作。但 Flow 的主要目標是擁有盡可能簡單的設計，對 Kotlin 和暫停友好，並尊重結構化並行處理。若無響應式先驅及其巨大的工作，則無法實現此目標。您可以在 [Reactive Streams and Kotlin Flows](https://medium.com/@elizarov/reactive-streams-and-kotlin-flows-bfd12772cda4) 文章中閱讀完整故事。

儘管概念上有所不同，但 Flow *是*一個響應式串流，並且可以將其轉換為響應式（符合規範和 TCK）的 Publisher，反之亦然。這樣的轉換器由 `kotlinx.coroutines` 開箱即用地提供，並且可以在相應的響應式模組中找到（`kotlinx-coroutines-reactive` 用於 Reactive Streams，`kotlinx-coroutines-reactor` 用於 Project Reactor，以及 `kotlinx-coroutines-rx2`/`kotlinx-coroutines-rx3` 用於 RxJava2/RxJava3）。整合模組包括與 `Flow` 之間的轉換、與 Reactor 的 `Context` 整合以及與各種響應式實體協同工作的暫停友好方式。
 
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