<!--- TEST_NAME FlowGuideTest --> 
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 异步流)

一个挂起函数异步返回单个值，但我们如何返回多个异步计算的值？这就是 Kotlin Flow 的用武之地。

## 表示多个值

在 Kotlin 中，可以使用[集合]来表示多个值。
例如，我们可以有一个 `simple` 函数，它返回一个包含三个数字的 [List]，然后使用 [forEach] 打印它们：

```kotlin
fun simple(): List<Int> = listOf(1, 2, 3)
 
fun main() {
    simple().forEach { value -> println(value) } 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-01.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-01.kt)。
>
{style="note"}

此代码输出：

```text
1
2
3
```

<!--- TEST -->

### 序列

如果我们正在使用一些 CPU 密集型阻塞代码来计算数字（每次计算耗时 100 毫秒），那么我们可以使用 [Sequence] 来表示这些数字：

```kotlin
fun simple(): Sequence<Int> = sequence { // sequence 构建器
    for (i in 1..3) {
        Thread.sleep(100) // 假设我们正在计算它
        yield(i) // 生产下一个值
    }
}

fun main() {
    simple().forEach { value -> println(value) } 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-02.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-02.kt)。
>
{style="note"}

此代码输出相同的数字，但它在打印每个数字之前会等待 100 毫秒。

<!--- TEST 
1
2
3
-->

### 挂起函数

然而，此计算会阻塞运行代码的主线程。
当这些值由异步代码计算时，我们可以用 `suspend` 修饰符标记 `simple` 函数，
以便它可以在不阻塞的情况下执行其工作并以列表形式返回结果：

```kotlin
import kotlinx.coroutines.*                 
                           
//sampleStart
suspend fun simple(): List<Int> {
    delay(1000) // 假设我们在这里执行一些异步操作
    return listOf(1, 2, 3)
}

fun main() = runBlocking<Unit> {
    simple().forEach { value -> println(value) } 
}
//sampleEnd
```  
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-03.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-03.kt)。
>
{style="note"}

此代码在等待一秒后打印这些数字。

<!--- TEST 
1
2
3
-->

### 流

使用 `List<Int>` 结果类型意味着我们只能一次性返回所有值。要表示
异步计算的值流，我们可以使用 [`Flow<Int>`][Flow] 类型，就像我们对同步计算的值使用 `Sequence<Int>` 类型一样：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart               
fun simple(): Flow<Int> = flow { // flow 构建器
    for (i in 1..3) {
        delay(100) // 假设我们在这里做一些有用的事情
        emit(i) // 发射下一个值
    }
}

fun main() = runBlocking<Unit> {
    // 启动一个并发协程来检查主线程是否被阻塞
    launch {
        for (k in 1..3) {
            println("I'm not blocked $k")
            delay(100)
        }
    }
    // 收集流
    simple().collect { value -> println(value) } 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-04.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-04.kt)。
>
{style="note"}

此代码在打印每个数字之前等待 100 毫秒，而不阻塞主线程。这通过在主线程中运行的独立协程每 100 毫秒打印“I'm not blocked”来验证：

```text
I'm not blocked 1
1
I'm not blocked 2
2
I'm not blocked 3
3
```

<!--- TEST -->

请注意 [Flow] 代码与早期示例的以下差异：

* 类型为 [Flow] 的构建器函数称为 [flow][_flow]。
* `flow { ... }` 构建器块内部的代码可以挂起。
* `simple` 函数不再使用 `suspend` 修饰符标记。
* 值通过 [emit][FlowCollector.emit] 函数从流中_发射_。
* 值通过 [collect][collect] 函数从流中_收集_。

> 我们可以将 `simple` 的 `flow { ... }` 主体中的 [delay] 替换为 `Thread.sleep`，并观察到在此情况下主线程会被阻塞。
>
{style="note"}

## 流是冷的

流是_冷_流，类似于序列 — [flow][_flow] 构建器中的代码在流被收集之前不会运行。以下示例清楚地说明了这一点：

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-05.kt)。
>
{style="note"}

它打印：

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
 
这是 `simple` 函数（它返回一个流）没有使用 `suspend` 修饰符标记的一个关键原因。
`simple()` 调用本身会快速返回，并且不等待任何东西。每次收集流时，它都会重新开始，这就是为什么我们每次再次调用 `collect` 时都会看到“Flow started”。

## 流取消基础

流遵循协程的一般协作式取消机制。通常，当流在可取消的挂起函数（例如 [delay]）中挂起时，流收集可以被取消。
以下示例展示了当流在 [withTimeoutOrNull] 块中运行时因超时而取消，并停止执行其代码：

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
    withTimeoutOrNull(250) { // 在 250 毫秒后超时 
        simple().collect { value -> println(value) } 
    }
    println("Done")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-06.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-06.kt)。
>
{style="note"}

请注意，`simple` 函数中的流只发射了两个数字，产生了以下输出：

```text
Emitting 1
1
Emitting 2
2
Done
```

<!--- TEST -->

有关更多详细信息，请参见 [流取消检测](#flow-cancellation-checks) 部分。

## 流构建器

前面示例中的 `flow { ... }` 构建器是最基本的。还有其他允许声明流的构建器：

* [flowOf] 构建器定义了一个发射固定值集的流。
* 各种集合和序列都可以使用 `.asFlow()` 扩展函数转换为流。

例如，从流中打印数字 1 到 3 的代码片段可以重写如下：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart
    // 将整数区间转换为流
    (1..3).asFlow().collect { value -> println(value) }
//sampleEnd 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-07.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-07.kt)。
>
{style="note"}

<!--- TEST
1
2
3
-->

## 中间流操作符

流可以使用操作符进行转换，就像转换集合和序列一样。
中间操作符应用于上游流并返回下游流。
这些操作符是冷的，就像流一样。调用此类操作符本身不是一个挂起函数。
它快速工作，返回一个新的转换流的定义。

基本操作符有熟悉的名称，例如 [map] 和 [filter]。
这些操作符与序列的一个重要区别是，这些操作符内部的代码块可以调用挂起函数。

例如，即使执行请求是一个由挂起函数实现的耗时操作，输入请求流也可以
通过 [map] 操作符映射到其结果：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart           
suspend fun performRequest(request: Int): String {
    delay(1000) // 模拟长时间运行的异步工作
    return "response $request"
}

fun main() = runBlocking<Unit> {
    (1..3).asFlow() // 请求流
        .map { request -> performRequest(request) }
        .collect { response -> println(response) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-08.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-08.kt)。
>
{style="note"}

它产生以下三行输出，每一行都在前一行出现后一秒显示：

```text                                                                    
response 1
response 2
response 3
```

<!--- TEST -->

### transform 操作符

在流转换操作符中，最通用的是 [transform]。它可以用以模拟
简单的转换，例如 [map] 和 [filter]，以及实现更复杂的转换。
使用 `transform` 操作符，我们可以任意次地 [发射][FlowCollector.emit] 任意值。

例如，使用 `transform`，我们可以在执行长时间运行的异步请求之前
发射一个字符串，然后紧接着是响应：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

suspend fun performRequest(request: Int): String {
    delay(1000) // 模拟长时间运行的异步工作
    return "response $request"
}

fun main() = runBlocking<Unit> {
//sampleStart
    (1..3).asFlow() // 请求流
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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-09.kt)。
>
{style="note"}

此代码的输出是：

```text
Making request 1
response 1
Making request 2
response 2
Making request 3
response 3
```

<!--- TEST -->

### 限长操作符

像 [take] 这样的限长中间操作符会在达到相应限制时取消流的执行。
协程中的取消总是通过抛出异常来执行，以便所有资源管理函数（例如 `try { ... } finally { ... }` 块）在取消情况下正常运行：

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
        .take(2) // 只取前两个
        .collect { value -> println(value) }
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-10.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-10.kt)。
>
{style="note"}

此代码的输出清楚地表明，`numbers()` 函数中 `flow { ... }` 主体的执行在发射第二个数字后停止：

```text       
1
2
Finally in numbers
```

<!--- TEST -->

## 终端流操作符

流上的终端操作符是_挂起函数_，它们启动流的收集。
[collect] 操作符是最基本的，但还有其他终端操作符，它们可以使操作更简单：

* 转换为各种集合，例如 [toList] 和 [toSet]。
* 用于获取 [first] 值并确保流发射 [single] 值的操作符。
* 使用 [reduce] 和 [fold] 将流归约为一个值。

例如：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart         
    val sum = (1..5).asFlow()
        .map { it * it } // 1 到 5 的数字的平方                           
        .reduce { a, b -> a + b } // 求和（终端操作符）
    println(sum)
//sampleEnd     
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-11.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-11.kt)。
>
{style="note"}

打印一个数字：

```text
55
```

<!--- TEST -->

## 流是顺序的

除非使用对多个流进行操作的特殊操作符，否则流的每次单独收集都是按顺序执行的。收集直接在调用终端操作符的协程中工作。默认情况下不会启动新的协程。每个发射的值都由所有中间操作符从上游到下游进行处理，然后传递给终端操作符。

请看以下示例，它过滤偶数整数并将它们映射为字符串：

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-12.kt)。
>
{style="note"}

产生：

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

## 流上下文

流的收集始终发生在调用协程的上下文中。例如，如果有一个 `simple` 流，那么以下代码运行在
此代码作者指定的上下文中，无论 `simple` 流的实现细节如何：

```kotlin
withContext(context) {
    simple().collect { value ->
        println(value) // 在指定的上下文中运行 
    }
}
```

<!--- CLEAR -->

流的这个属性称为_上下文保留_。

因此，默认情况下，`flow { ... }` 构建器中的代码运行在由相应流的收集器提供的上下文中。例如，考虑 `simple` 函数的实现，它会打印其被调用的线程并发射三个数字：

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-13.kt)。
>
{style="note"}

运行此代码产生：

```text  
[main @coroutine#1] Started simple flow
[main @coroutine#1] Collected 1
[main @coroutine#1] Collected 2
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

由于 `simple().collect` 是从主线程调用的，因此 `simple` 流的主体也在主线程中被调用。
对于不关心执行上下文且不阻塞调用者的快速运行或异步代码，这是完美的默认设置。

### 使用 withContext 时的常见陷阱

然而，耗时且 CPU 密集型代码可能需要在 [Dispatchers.Default] 的上下文中执行，而 UI 更新代码可能需要在 [Dispatchers.Main] 的上下文中执行。通常，[withContext] 用于在使用 Kotlin 协程的代码中更改上下文，但 `flow { ... }` 构建器中的代码必须遵守上下文保留属性，并且不允许从不同的上下文中 [发射][FlowCollector.emit] 值。

尝试运行以下代码：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
                      
//sampleStart
fun simple(): Flow<Int> = flow {
    // 在 flow 构建器中为 CPU 密集型代码更改上下文的_错误_方法
    kotlinx.coroutines.withContext(Dispatchers.Default) {
        for (i in 1..3) {
            Thread.sleep(100) // 假设我们正在以 CPU 密集型方式计算它
            emit(i) // 发射下一个值
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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-14.kt)。
>
{style="note"}

此代码会产生以下异常：

```text
Exception in thread "main" java.lang.IllegalStateException: Flow invariant is violated:
		Flow was collected in [CoroutineId(1), "coroutine#1":BlockingCoroutine{Active}@5511c7f8, BlockingEventLoop@2eac3323],
		but emission happened in [CoroutineId(1), "coroutine#1":DispatchedCoroutine{Active}@2dae0000, Dispatchers.Default].
		Please refer to 'flow' documentation or use 'flowOn' instead
	at ...
``` 

<!--- TEST EXCEPTION -->

### flowOn 操作符
   
异常指的是 [flowOn] 函数，该函数应被用于更改流发射的上下文。
更改流上下文的正确方法如下例所示，它也打印相应线程的名称以展示其工作原理：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")
           
//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        Thread.sleep(100) // 假设我们正在以 CPU 密集型方式计算它
        log("Emitting $i")
        emit(i) // 发射下一个值
    }
}.flowOn(Dispatchers.Default) // 在 flow 构建器中为 CPU 密集型代码更改上下文的_正确_方法

fun main() = runBlocking<Unit> {
    simple().collect { value ->
        log("Collected $value") 
    } 
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-15.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-15.kt)。
>
{style="note"}
  
请注意 `flow { ... }` 如何在后台线程中工作，而收集则发生在主线程中：   

```text
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 1
[main @coroutine#1] Collected 1
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 2
[main @coroutine#1] Collected 2
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 3
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

这里还要注意一点，[flowOn] 操作符改变了流的默认顺序性。
现在，收集发生在一个协程（"coroutine#1"）中，而发射发生在另一个
在另一个线程中与收集协程并发运行的协程（"coroutine#2"）中。当 [flowOn] 操作符
必须更改其上下文中的 [CoroutineDispatcher] 时，它会为上游流创建另一个协程。

## 缓冲

在不同的协程中运行流的不同部分有助于缩短收集流的总体时间，尤其是在涉及长时间运行的异步操作时。例如，考虑一个情况：`simple` 流的发射很慢，产生一个元素需要 100 毫秒；并且收集器也很慢，处理一个元素需要 300 毫秒。让我们看看收集这样一个包含三个数字的流需要多长时间：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假设我们正在异步等待 100 毫秒
        emit(i) // 发射下一个值
    }
}

fun main() = runBlocking<Unit> { 
    val time = measureTimeMillis {
        simple().collect { value -> 
            delay(300) // 假设我们正在处理它 300 毫秒
            println(value) 
        } 
    }   
    println("Collected in $time ms")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-16.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-16.kt)。
>
{style="note"}

它产生类似这样的输出，整个收集过程耗时约 1200 毫秒（三个数字，每个 400 毫秒）：

```text
1
2
3
Collected in 1220 ms
```

<!--- TEST ARBITRARY_TIME -->

我们可以在流上使用 [buffer] 操作符，使 `simple` 流的发射代码与收集代码并发运行，
而不是顺序运行：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假设我们正在异步等待 100 毫秒
        emit(i) // 发射下一个值
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .buffer() // 缓冲发射，不等待
            .collect { value -> 
                delay(300) // 假设我们正在处理它 300 毫秒
                println(value) 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-17.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-17.kt)。
>
{style="note"}

它产生相同的数字，但速度更快，因为我们有效地创建了一个处理流水线，
只需等待第一个数字 100 毫秒，然后只花费 300 毫秒处理
每个数字。这样它大约需要 1000 毫秒来运行：

```text
1
2
3
Collected in 1071 ms
```                    

<!--- TEST ARBITRARY_TIME -->

> 请注意，当 [flowOn] 操作符需要更改 [CoroutineDispatcher] 时，它使用相同的缓冲机制，
> 但在这里我们显式请求缓冲而不更改执行上下文。
>
{style="note"}

### 合并 (Conflation)

当流表示操作的部分结果或操作状态更新时，可能不需要处理每个值，
而只需处理最新的值。在这种情况下，当收集器处理速度太慢时，可以使用 [conflate] 操作符来跳过
中间值。在前面的示例基础上：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假设我们正在异步等待 100 毫秒
        emit(i) // 发射下一个值
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .conflate() // 合并发射，不处理每个
            .collect { value -> 
                delay(300) // 假设我们正在处理它 300 毫秒
                println(value) 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-18.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-18.kt)。
>
{style="note"}

我们看到，当第一个数字仍在处理时，第二个和第三个数字已经产生，所以
第二个数字被_合并_了，只有最新的（第三个）数字传递给了收集器：

```text
1
3
Collected in 758 ms
```             

<!--- TEST ARBITRARY_TIME -->

### 处理最新值

合并是在发射器和收集器都慢时加速处理的一种方法。它通过丢弃发射的值来实现。
另一种方法是取消慢速收集器，并在每次发射新值时重新启动它。有
一系列 `xxxLatest` 操作符，它们执行与 `xxx` 操作符相同的基本逻辑，但在有新值时取消其块中的代码。
让我们尝试将前面示例中的 [conflate] 更改为 [collectLatest]：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假设我们正在异步等待 100 毫秒
        emit(i) // 发射下一个值
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .collectLatest { value -> // 在最新值上取消并重新启动
                println("Collecting $value") 
                delay(300) // 假设我们正在处理它 300 毫秒
                println("Done $value") 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-19.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-19.kt)。
>
{style="note"}
 
由于 [collectLatest] 的主体需要 300 毫秒，但新值每 100 毫秒发射一次，我们看到该块
会在每个值上运行，但只对最后一个值完成：

```text 
Collecting 1
Collecting 2
Collecting 3
Done 3
Collected in 741 ms
``` 

<!--- TEST ARBITRARY_TIME -->

## 组合多个流

有许多方法可以组合多个流。

### Zip

就像 Kotlin 标准库中的 [Sequence.zip] 扩展函数一样，
流有一个 [zip] 操作符，它组合两个流的对应值：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow() // 数字 1..3
    val strs = flowOf("one", "two", "three") // 字符串 
    nums.zip(strs) { a, b -> "$a -> $b" } // 组合单个字符串
        .collect { println(it) } // 收集并打印
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-20.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-20.kt)。
>
{style="note"}

此示例打印：

```text
1 -> one
2 -> two
3 -> three
```
 
<!--- TEST -->

### Combine

当流表示变量或操作的最新值时（另请参见关于[合并](#conflation)的相关部分），可能需要执行一个计算，该计算依赖于相应流的最新值，并且每当任何上游流发射一个值时都重新计算它。相应的操作符家族称为 [combine]。

例如，如果前面示例中的数字每 300 毫秒更新一次，但字符串每 400 毫秒更新一次，
那么使用 [zip] 操作符压缩它们仍会产生相同的结果，
尽管结果每 400 毫秒打印一次：

> 在此示例中，我们使用 [onEach] 中间操作符来延迟每个元素，并使发射示例流的代码更具声明性且更短。
>
{style="note"}

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow().onEach { delay(300) } // 数字 1..3 每 300 毫秒
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 字符串每 400 毫秒
    val startTime = System.currentTimeMillis() // 记住开始时间 
    nums.zip(strs) { a, b -> "$a -> $b" } // 使用 "zip" 组合单个字符串
        .collect { value -> // 收集并打印 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-21.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-21.kt)。
>
{style="note"}

<!--- TEST ARBITRARY_TIME
1 -> one at 437 ms from start
2 -> two at 837 ms from start
3 -> three at 1243 ms from start
-->

然而，当在这里使用 [combine] 操作符而不是 [zip] 时：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow().onEach { delay(300) } // 数字 1..3 每 300 毫秒
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 字符串每 400 毫秒          
    val startTime = System.currentTimeMillis() // 记住开始时间 
    nums.combine(strs) { a, b -> "$a -> $b" } // 使用 "combine" 组合单个字符串
        .collect { value -> // 收集并打印 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-22.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-22.kt)。
>
{style="note"}

我们得到了一个完全不同的输出，其中每当 `nums` 或 `strs` 流发射一个值时，就会打印一行：

```text 
1 -> one at 452 ms from start
2 -> one at 651 ms from start
2 -> two at 854 ms from start
3 -> two at 952 ms from start
3 -> three at 1256 ms from start
```

<!--- TEST ARBITRARY_TIME -->

## 扁平化流

流表示异步接收的值序列，因此很容易遇到这样一种情况：每个值都会触发对另一个值序列的请求。例如，我们可以有以下函数，它返回一个包含两个字符串的流，间隔 500 毫秒：

```kotlin
fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 等待 500 毫秒
    emit("$i: Second")    
}
```

<!--- CLEAR -->

现在，如果有一个包含三个整数的流，并像这样在每个整数上调用 `requestFlow`：

```kotlin
(1..3).asFlow().map { requestFlow(it) }
```

<!--- CLEAR -->

那么我们最终会得到一个流的流（`Flow<Flow<String>>`），它需要_扁平化_为一个单一流以进行进一步处理。集合和序列有 [flatten][Sequence.flatten] 和 [flatMap][Sequence.flatMap] 操作符来完成此操作。然而，由于流的异步特性，它们需要不同的扁平化_模式_，因此，存在一系列扁平化操作符。

### flatMapConcat

流的流的串联由 [flatMapConcat] 和 [flattenConcat] 操作符提供。它们是
相应序列操作符最直接的模拟。它们会等待内部流完成，然后
再开始收集下一个流，如下例所示：

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
    val startTime = System.currentTimeMillis() // 记住开始时间 
    (1..3).asFlow().onEach { delay(100) } // 每 100 毫秒发射一个数字 
        .flatMapConcat { requestFlow(it) }                                                                           
        .collect { value -> // 收集并打印 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-23.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-23.kt)。
>
{style="note"}

[flatMapConcat] 的顺序性在输出中清晰可见：

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

另一种扁平化操作是并发收集所有输入的流，并将其值合并为一个单一流，以便尽快发射值。
它由 [flatMapMerge] 和 [flattenMerge] 操作符实现。它们都接受一个可选的
`concurrency` 参数，该参数限制同时收集的并发流的数量
（默认等于 [DEFAULT_CONCURRENCY]）。

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
    val startTime = System.currentTimeMillis() // 记住开始时间 
    (1..3).asFlow().onEach { delay(100) } // 每 100 毫秒一个数字 
        .flatMapMerge { requestFlow(it) }                                                                           
        .collect { value -> // 收集并打印 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-24.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-24.kt)。
>
{style="note"}

[flatMapMerge] 的并发特性显而易见：

```text                      
1: First at 136 ms from start
2: First at 231 ms from start
3: First at 333 ms from start
1: Second at 639 ms from start
2: Second at 732 ms from start
3: Second at 833 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->

> 请注意，[flatMapMerge] 按顺序调用其代码块（本示例中为 `{ requestFlow(it) }`），但
> 并发收集结果流，这等同于先执行顺序的 `map { requestFlow(it) }`，
> 然后对结果调用 [flattenMerge]。
>
{style="note"}

### flatMapLatest   

与 ["处理最新值"](#processing-the-latest-value) 部分中描述的 [collectLatest] 操作符类似，
也存在相应的“最新”扁平化模式，即一旦发射新流，前一个流的收集就会被取消。
它由 [flatMapLatest] 操作符实现。

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
    val startTime = System.currentTimeMillis() // 记住开始时间 
    (1..3).asFlow().onEach { delay(100) } // 每 100 毫秒一个数字 
        .flatMapLatest { requestFlow(it) }                                                                           
        .collect { value -> // 收集并打印 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-25.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-25.kt)。
>
{style="note"}

此示例中的输出很好地展示了 [flatMapLatest] 的工作方式：

```text                      
1: First at 142 ms from start
2: First at 322 ms from start
3: First at 425 ms from start
3: Second at 931 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->
  
> 请注意，当接收到新值时，[flatMapLatest] 会取消其块中（本示例中为 `{ requestFlow(it) }`）的所有代码。
> 在此特定示例中，这没有什么区别，因为对 `requestFlow` 的调用本身是快速的、非挂起的，
> 并且无法取消。然而，如果我们在 `requestFlow` 中使用像 `delay` 这样的挂起函数，
> 输出差异将是可见的。
>
{style="note"}

## 流异常

当发射器或操作符内部的代码抛出异常时，流收集可能会因异常而完成。
有几种方法可以处理这些异常。

### 收集器 try 和 catch

收集器可以使用 Kotlin 的 [`try/catch`][exceptions] 块来处理异常：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i) // 发射下一个值
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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-26.kt)。
>
{style="note"}

此代码成功捕获了 [collect] 终端操作符中的异常，并且，如我们所见，此后不再发射任何值：

```text 
Emitting 1
1
Emitting 2
2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST -->

### 所有异常均被捕获

前面的示例实际上捕获了发射器或任何中间或终端操作符中发生的任何异常。
例如，让我们更改代码，使发射的值被 [map][map] 为字符串，
但相应的代码会产生异常：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<String> = 
    flow {
        for (i in 1..3) {
            println("Emitting $i")
            emit(i) // 发射下一个值
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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-27.kt)。
>
{style="note"}

此异常仍被捕获，并且收集停止：

```text 
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
```

<!--- TEST -->

## 异常透明性

但是，发射器的代码如何封装其异常处理行为呢？

流必须对异常_透明_，并且在 `flow { ... }` 构建器内部的 `try/catch` 块中 [发射][FlowCollector.emit] 值是违反异常透明性的行为。这保证了抛出异常的收集器总是可以使用 `try/catch` 捕获它，如前面的示例所示。

发射器可以使用 [catch] 操作符，该操作符保留了异常透明性并允许封装其异常处理。
`catch` 操作符的主体可以分析异常，并根据捕获到哪种异常以不同方式对其作出反应：

* 异常可以使用 `throw` 重新抛出。
* 异常可以从 [catch] 的主体中使用 [emit][FlowCollector.emit] 转换为值的发射。
* 异常可以被忽略、记录日志或由其他代码处理。

例如，让我们在捕获异常时发射文本：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun simple(): Flow<String> = 
    flow {
        for (i in 1..3) {
            println("Emitting $i")
            emit(i) // 发射下一个值
        }
    }
    .map { value ->
        check(value <= 1) { "Crashed on $value" }                 
        "string $value"
    }

fun main() = runBlocking<Unit> {
//sampleStart
    simple()
        .catch { e -> emit("Caught $e") } // 在异常时发射
        .collect { value -> println(value) }
//sampleEnd
}            
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-28.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-28.kt)。
>
{style="note"} 
 
示例的输出相同，即使代码周围不再有 `try/catch`。

<!--- TEST  
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
-->

### 透明 catch

[catch] 中间操作符，遵循异常透明性，只捕获上游异常
（即 `catch` 上方所有操作符的异常，而不是其下方的异常）。
如果 `collect { ... }` 中的块（位于 `catch` 下方）抛出异常，那么它会逃逸：

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
        .catch { e -> println("Caught $e") } // 不捕获下游异常
        .collect { value ->
            check(value <= 1) { "Collected $value" }                 
            println(value) 
        }
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-29.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-29.kt)。
>
{style="note"}
 
尽管有 `catch` 操作符，但没有打印“Caught ...”消息：

```text  
Emitting 1
1
Emitting 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
	at ...
```

<!--- TEST EXCEPTION -->

### 声明式捕获

我们可以将 [catch] 操作符的声明性与处理所有异常的需求结合起来，方法是将 [collect] 操作符的主体移动到 [onEach] 中，并将其放在 `catch` 操作符之前。必须通过调用不带参数的 `collect()` 来触发此流的收集：

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-30.kt)。
>
{style="note"} 
 
现在我们可以看到打印了“Caught ...”消息，因此我们无需显式使用 `try/catch` 块即可捕获所有异常：

```text 
Emitting 1
1
Emitting 2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## 流完成

当流收集完成时（正常完成或因异常完成），可能需要执行一个动作。
你可能已经注意到，这可以通过两种方式完成：命令式或声明式。

### 命令式 finally 块

除了 `try`/`catch`，收集器还可以使用 `finally` 块在 `collect` 完成时执行一个动作。

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-31.kt)。
>
{style="note"} 

此代码打印 `simple` 流产生的三个数字，后跟字符串“Done”：

```text
1
2
3
Done
```

<!--- TEST  -->

### 声明式处理

对于声明式方法，流有一个 [onCompletion] 中间操作符，当流完全收集时会调用它。

前面的示例可以使用 [onCompletion] 操作符重写，并产生相同的输出：

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-32.kt)。
>
{style="note"} 

<!--- TEST 
1
2
3
Done
-->

[onCompletion] 的主要优点是 lambda 表达式中有一个可空的 `Throwable` 参数，可用于
确定流收集是正常完成还是因异常完成。在以下
示例中，`simple` 流在发射数字 1 后抛出异常：

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-33.kt)。
>
{style="note"}

正如你可能预期的，它打印：

```text
1
Flow completed exceptionally
Caught exception
```

<!--- TEST -->

[onCompletion] 操作符与 [catch] 不同，它不处理异常。从上面的
示例代码中我们可以看到，异常仍然向下游流动。它将被传递给后续的 `onCompletion` 操作符，
并可以使用 `catch` 操作符进行处理。

### 成功完成

与 [catch] 操作符的另一个区别是，[onCompletion] 会看到所有异常，并且只有在上游流成功完成（没有取消或失败）时才会收到 `null` 异常。

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-34.kt)。
>
{style="note"}

我们可以看到完成原因不是 null，因为流由于下游异常而中止：

```text 
1
Flow completed with java.lang.IllegalStateException: Collected 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## 命令式与声明式

现在我们知道如何以命令式和声明式两种方式收集流，并处理其完成和异常。
这里自然而然的问题是，哪种方法更受青睐，以及为什么？
作为库，我们不提倡任何特定的方法，并认为这两种选项
都有效，应根据您自己的偏好和代码风格进行选择。

## 启动流

使用流来表示来自某个源的异步事件很容易。
在这种情况下，我们需要一个 `addEventListener` 函数的模拟，它注册一段代码以响应传入事件并继续后续工作。[onEach] 操作符可以担任此角色。
然而，`onEach` 是一个中间操作符。我们还需要一个终端操作符来收集流。否则，仅调用 `onEach` 没有效果。
 
如果我们在 [onEach] 之后使用 [collect] 终端操作符，那么其后的代码将等待流被收集完毕：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
// 模拟事件流
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .collect() // <--- 收集流会等待
    println("Done")
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-35.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-35.kt)。
>
{style="note"} 
  
如你所见，它打印：

```text 
Event: 1
Event: 2
Event: 3
Done
```    

<!--- TEST -->
 
[launchIn] 终端操作符在这里派上用场。通过将 `collect` 替换为 `launchIn`，我们可以
在单独的协程中启动流的收集，以便后续代码的执行立即继续：

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

// 模拟事件流
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

//sampleStart
fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .launchIn(this) // <--- 在单独的协程中启动流
    println("Done")
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-36.kt -->
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-36.kt)。
>
{style="note"} 
  
它打印：

```text          
Done
Event: 1
Event: 2
Event: 3
```    

<!--- TEST -->

`launchIn` 的必需参数必须指定一个 [CoroutineScope]，流的收集协程将在此作用域中启动。
在上述示例中，此作用域来自 [runBlocking] 协程构建器，因此当流运行时，此 [runBlocking] 作用域会等待其子协程完成，并阻止主函数返回和终止此示例。

在实际应用程序中，作用域将来自一个具有有限生命周期的实体。
一旦此实体的生命周期终止，相应的范围就被取消，从而取消相应流的收集。
这样，`onEach { ... }.launchIn(scope)` 的组合就像 `addEventListener` 一样工作。
然而，没有必要使用相应的 `removeEventListener` 函数，因为取消和结构化并发可以实现此目的。

请注意，[launchIn] 也返回一个 [Job]，它可以用于仅 [取消][Job.cancel] 相应的流收集协程而不取消整个作用域，或者 [join][Job.join] 它。

### 流取消检测

为了方便，[flow][_flow] 构建器在每个发射的值上执行额外的 [ensureActive] 取消检测。
这意味着从 `flow { ... }` 发射的忙碌循环是可取消的：

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-37.kt)。
>
{style="note"}

我们只得到了数字 3 及之前的数字，并在尝试发射数字 4 后得到了一个 [CancellationException]：

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

#### 使忙碌流可取消 

然而，大多数其他流操作符出于性能原因，不会自行进行额外的取消检测。
例如，如果你使用 [IntRange.asFlow] 扩展来编写相同的忙碌循环，并且不在任何地方挂起，
那么就不会进行取消检测：

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-38.kt)。
>
{style="note"}

收集了从 1 到 5 的所有数字，并且只有在 `runBlocking` 返回之前才检测到取消：

```text
1
2
3
4
5
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@3327bd23
```

<!--- TEST EXCEPTION -->

在你有包含协程的忙碌循环的情况下，你必须显式检测取消。
你可以添加 `.onEach { currentCoroutineContext().ensureActive() }`，但为此提供了一个现成的 [cancellable] 操作符：

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
> 完整代码可在此处获取：[here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-39.kt)。
>
{style="note"}

使用 `cancellable` 操作符，只收集了数字 1 到 3：

```text
1
2
3
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@5ec0a365
```

<!--- TEST EXCEPTION -->

## 流与反应式流 (Reactive Streams)

对于熟悉 [Reactive Streams](https://www.reactive-streams.org/) 或 RxJava 和 Project Reactor 等反应式框架的人来说，
Flow 的设计可能看起来非常熟悉。

确实，它的设计灵感来源于 Reactive Streams 及其各种实现。但 Flow 的主要目标是拥有尽可能简单的设计，
对 Kotlin 和挂起友好，并遵循结构化并发。如果没有反应式领域的先行者及其巨大的贡献，实现这一目标将是不可能的。
您可以在文章 [Reactive Streams and Kotlin Flows](https://medium.com/@elizarov/reactive-streams-and-kotlin-flows-bfd12772cda4) 中阅读完整的故事。

尽管概念上有所不同，但 Flow *是*一个反应式流，并且可以将其转换为反应式（符合规范和 TCK）的 Publisher，反之亦然。
`kotlinx.coroutines` 开箱即用地提供了此类转换器，可以在相应的反应式模块中找到（`kotlinx-coroutines-reactive` 适用于 Reactive Streams，`kotlinx-coroutines-reactor` 适用于 Project Reactor，`kotlinx-coroutines-rx2`/`kotlinx-coroutines-rx3` 适用于 RxJava2/RxJava3）。
集成模块包括与 `Flow` 之间的转换、与 Reactor 的 `Context` 集成以及与各种反应式实体协作的挂起友好方式。
 
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