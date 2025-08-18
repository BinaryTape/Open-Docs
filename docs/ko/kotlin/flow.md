<!--- TEST_NAME FlowGuideTest --> 
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 비동기 Flow)

`suspend` 함수는 비동기적으로 단일 값을 반환하지만, 여러 개의 비동기적으로 계산된 값을 어떻게 반환할 수 있을까요? 바로 Kotlin Flow가 필요한 지점입니다.

## 여러 값 표현하기

Kotlin에서는 [컬렉션]을 사용하여 여러 값을 표현할 수 있습니다. 예를 들어, 세 개의 숫자를 [List]로 반환한 다음 [forEach]를 사용하여 모두 출력하는 `simple` 함수를 만들 수 있습니다.

```kotlin
fun simple(): List<Int> = listOf(1, 2, 3)
 
fun main() {
    simple().forEach { value -> println(value) } 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-01.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-01.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
1
2
3
```

<!--- TEST -->

### 시퀀스

만약 CPU를 많이 소모하는 블로킹 코드(각 계산에 100ms 소요)로 숫자를 계산하는 경우, [Sequence]를 사용하여 숫자를 표현할 수 있습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-02.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드는 동일한 숫자를 출력하지만, 각 숫자를 출력하기 전에 100ms씩 기다립니다.

<!--- TEST 
1
2
3
-->

### suspend 함수

그러나 이 계산은 코드를 실행하는 메인 스레드를 블로킹합니다. 이러한 값이 비동기 코드에 의해 계산될 때는 `simple` 함수에 `suspend` 한정자를 붙여, 블로킹 없이 작업을 수행하고 결과를 리스트로 반환하도록 할 수 있습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-03.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드는 1초를 기다린 후 숫자를 출력합니다.

<!--- TEST 
1
2
3
-->

### Flow

결과 타입으로 `List<Int>`를 사용하면 모든 값을 한 번에만 반환할 수 있습니다. 비동기적으로 계산되는 값들의 스트림을 표현하려면, 동기적으로 계산되는 값에 `Sequence<Int>` 타입을 사용했던 것처럼 [`Flow<Int>`][Flow] 타입을 사용할 수 있습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-04.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드는 메인 스레드를 블로킹하지 않고 각 숫자를 출력하기 전에 100ms씩 기다립니다. 이는 메인 스레드에서 실행되는 별도의 코루틴에서 100ms마다 "I'm not blocked"를 출력하여 검증됩니다:

```text
I'm not blocked 1
1
I'm not blocked 2
2
I'm not blocked 3
3
```

<!--- TEST -->

이전 예제들의 [Flow] 코드와 다음 차이점들을 주목하세요:

*   [Flow] 타입의 빌더 함수는 [flow][_flow]라고 불립니다.
*   `flow { ... }` 빌더 블록 내부의 코드는 suspend될 수 있습니다.
*   `simple` 함수는 더 이상 `suspend` 한정자로 표시되지 않습니다.
*   값은 [emit][FlowCollector.emit] 함수를 사용하여 flow에서 _방출_됩니다.
*   값은 [collect][collect] 함수를 사용하여 flow에서 _수집_됩니다.

> `simple`의 `flow { ... }` 본문에서 [delay]를 `Thread.sleep`으로 대체하면 이 경우 메인 스레드가 블로킹되는 것을 확인할 수 있습니다.
>
{style="note"}

## Flow는 콜드(cold) 스트림입니다

Flow는 시퀀스와 유사한 _콜드_ 스트림입니다. [flow][_flow] 빌더 내부의 코드는 flow가 수집될 때까지 실행되지 않습니다. 다음 예제에서 이를 명확히 알 수 있습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-05.kt)에서 확인할 수 있습니다.
>
{style="note"}

출력은 다음과 같습니다:

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
 
이것이 `simple` 함수(flow를 반환하는)에 `suspend` 한정자가 붙지 않는 주요 이유입니다. `simple()` 호출 자체는 빠르게 반환되며 아무것도 기다리지 않습니다. flow는 수집될 때마다 새로 시작되며, 따라서 `collect`를 다시 호출할 때마다 "Flow started"가 표시됩니다.

## Flow 취소의 기본

Flow는 코루틴의 일반적인 협력적 취소를 따릅니다. 일반적으로, flow 수집은 flow가 취소 가능한 suspend 함수([delay]와 같은)에서 suspend될 때 취소될 수 있습니다. 다음 예제는 [withTimeoutOrNull] 블록에서 실행될 때 flow가 타임아웃으로 인해 어떻게 취소되고 코드 실행을 중지하는지 보여줍니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-06.kt)에서 확인할 수 있습니다.
>
{style="note"}

`simple` 함수 내 flow에서 두 개의 숫자만 방출되고 다음 출력이 생성되는 방식에 주목하세요:

```text
Emitting 1
1
Emitting 2
2
Done
```

<!--- TEST -->

자세한 내용은 [Flow 취소 확인](#flow-cancellation-checks) 섹션을 참조하세요.

## Flow 빌더

이전 예제들의 `flow { ... }` 빌더는 가장 기본적인 것입니다. flow를 선언할 수 있는 다른 빌더들도 있습니다:

*   [flowOf] 빌더는 고정된 값 집합을 방출하는 flow를 정의합니다.
*   다양한 컬렉션과 시퀀스는 `.asFlow()` 확장 함수를 사용하여 flow로 변환할 수 있습니다.

예를 들어, flow에서 1부터 3까지의 숫자를 출력하는 코드를 다음과 같이 다시 작성할 수 있습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-07.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST
1
2
3
-->

## 중간 flow 연산자

Flow는 컬렉션이나 시퀀스를 변환하는 것과 동일한 방식으로 연산자를 사용하여 변환할 수 있습니다. 중간 연산자는 업스트림 flow에 적용되어 다운스트림 flow를 반환합니다. 이 연산자들은 flow와 마찬가지로 콜드(cold)합니다. 이러한 연산자에 대한 호출은 그 자체로 suspend 함수가 아닙니다. 이는 빠르게 작동하며, 새롭게 변환된 flow의 정의를 반환합니다.

기본 연산자들은 [map]과 [filter]처럼 익숙한 이름을 가지고 있습니다. 이 연산자들이 시퀀스와 다른 중요한 점은, 이 연산자 내부의 코드 블록에서 suspend 함수를 호출할 수 있다는 것입니다.

예를 들어, 수신되는 요청 flow는 [map] 연산자를 사용하여 결과로 매핑될 수 있습니다. 요청 수행이 suspend 함수로 구현된 장시간 실행 작업일지라도 마찬가지입니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-08.kt)에서 확인할 수 있습니다.
>
{style="note"}

이는 다음 세 줄을 생성하며, 각 줄은 이전 줄이 나타난 후 1초 뒤에 나타납니다:

```text                                                                    
response 1
response 2
response 3
```

<!--- TEST -->

### Transform 연산자

flow 변환 연산자 중에서 가장 일반적인 것은 [transform]이라고 불립니다. 이는 [map]과 [filter]와 같은 간단한 변환을 모방하는 데 사용될 수 있을 뿐만 아니라, 더 복잡한 변환을 구현하는 데도 사용됩니다. `transform` 연산자를 사용하면 임의의 값을 임의의 횟수만큼 [emit][FlowCollector.emit]할 수 있습니다.

예를 들어, `transform`을 사용하여 장시간 실행되는 비동기 요청을 수행하기 전에 문자열을 방출하고, 이어서 응답을 방출할 수 있습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-09.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
Making request 1
response 1
Making request 2
response 2
Making request 3
response 3
```

<!--- TEST -->

### 크기 제한 연산자

[take]와 같은 크기 제한 중간 연산자는 해당 제한에 도달하면 flow의 실행을 취소합니다. 코루틴에서의 취소는 항상 예외를 던지는 방식으로 수행되므로, 모든 리소스 관리 함수(예: `try { ... } finally { ... }` 블록)는 취소 시에도 정상적으로 작동합니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-10.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 `numbers()` 함수의 `flow { ... }` 본문 실행이 두 번째 숫자를 방출한 후 중지되었음을 명확하게 보여줍니다:

```text       
1
2
Finally in numbers
```

<!--- TEST -->

## 터미널 flow 연산자

flow의 터미널 연산자는 flow의 수집을 시작하는 _suspend 함수_입니다. [collect] 연산자가 가장 기본적인 것이지만, 더 쉽게 만들 수 있는 다른 터미널 연산자들도 있습니다:

*   [toList] 및 [toSet]와 같은 다양한 컬렉션으로의 변환.
*   [first] 값을 가져오고 flow가 [single] 값을 방출하도록 보장하는 연산자.
*   [reduce] 및 [fold]를 사용하여 flow를 값으로 축소하는 연산자.

예시:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-11.kt)에서 확인할 수 있습니다.
>
{style="note"}

단일 숫자를 출력합니다:

```text
55
```

<!--- TEST -->

## Flow는 순차적입니다

flow의 각 개별 수집은 여러 flow에 작동하는 특수 연산자가 사용되지 않는 한 순차적으로 수행됩니다. 수집은 터미널 연산자를 호출하는 코루틴에서 직접 작동합니다. 기본적으로 새 코루틴은 시작되지 않습니다. 각 방출된 값은 업스트림에서 다운스트림까지 모든 중간 연산자에 의해 처리된 다음 터미널 연산자로 전달됩니다.

짝수 정수를 필터링하고 문자열로 매핑하는 다음 예제를 참조하세요:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-12.kt)에서 확인할 수 있습니다.
>
{style="note"}

출력:

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

## Flow 컨텍스트

flow의 수집은 항상 호출하는 코루틴의 컨텍스트에서 발생합니다. 예를 들어, `simple` flow가 있다면, 다음 코드는 `simple` flow의 구현 세부 사항과 관계없이 이 코드 작성자가 지정한 컨텍스트에서 실행됩니다:

```kotlin
withContext(context) {
    simple().collect { value ->
        println(value) // run in the specified context 
    }
}
```

<!--- CLEAR -->

flow의 이 속성을 _컨텍스트 보존_이라고 합니다.

따라서 기본적으로 `flow { ... }` 빌더 내부의 코드는 해당 flow의 컬렉터가 제공하는 컨텍스트에서 실행됩니다. 예를 들어, 자신이 호출된 스레드를 출력하고 세 개의 숫자를 방출하는 `simple` 함수의 구현을 살펴보세요:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-13.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드를 실행하면:

```text  
[main @coroutine#1] Started simple flow
[main @coroutine#1] Collected 1
[main @coroutine#1] Collected 2
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

`simple().collect`이 메인 스레드에서 호출되기 때문에, `simple`의 flow 본문도 메인 스레드에서 호출됩니다. 이는 실행 컨텍스트를 신경 쓰지 않고 호출자를 블로킹하지 않는 빠르게 실행되거나 비동기 코드에 완벽한 기본 동작입니다.

### withContext 사용 시 흔한 실수

그러나 장시간 실행되는 CPU 소모 코드는 [Dispatchers.Default] 컨텍스트에서 실행되어야 할 수 있으며, UI 업데이트 코드는 [Dispatchers.Main] 컨텍스트에서 실행되어야 할 수 있습니다. 일반적으로 Kotlin 코루틴을 사용하는 코드에서는 [withContext]를 사용하여 컨텍스트를 변경하지만, `flow { ... }` 빌더 내의 코드는 컨텍스트 보존 속성을 존중해야 하며 다른 컨텍스트에서 [emit][FlowCollector.emit]하는 것은 허용되지 않습니다.

다음 코드를 실행해보세요:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-14.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드는 다음 예외를 발생시킵니다:

```text
Exception in thread "main" java.lang.IllegalStateException: Flow invariant is violated:
		Flow was collected in [CoroutineId(1), "coroutine#1":BlockingCoroutine{Active}@5511c7f8, BlockingEventLoop@2eac3323],
		but emission happened in [CoroutineId(1), "coroutine#1":DispatchedCoroutine{Active}@2dae0000, Dispatchers.Default].
		Please refer to 'flow' documentation or use 'flowOn' instead
	at ...
``` 

<!--- TEST EXCEPTION -->

### flowOn 연산자
   
이 예외는 flow 방출의 컨텍스트를 변경하는 데 사용해야 하는 [flowOn] 함수를 참조합니다. flow의 컨텍스트를 변경하는 올바른 방법은 아래 예제에 나와 있으며, 이 예제는 모든 것이 어떻게 작동하는지 보여주기 위해 해당 스레드의 이름도 출력합니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-15.kt)에서 확인할 수 있습니다.
>
{style="note"}
  
`flow { ... }`가 백그라운드 스레드에서 작동하고, 수집은 메인 스레드에서 발생하는 방식에 주목하세요:   

```text
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 1
[main @coroutine#1] Collected 1
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 2
[main @coroutine#1] Collected 2
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 3
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

여기서 주목할 또 다른 점은 [flowOn] 연산자가 flow의 기본 순차적 특성을 변경했다는 것입니다. 이제 수집은 하나의 코루틴("coroutine#1")에서 발생하고, 방출은 수집하는 코루틴과 동시에 다른 스레드에서 실행되는 다른 코루틴("coroutine#2")에서 발생합니다. [flowOn] 연산자는 컨텍스트의 [CoroutineDispatcher]를 변경해야 할 때 업스트림 flow를 위한 또 다른 코루틴을 생성합니다.

## 버퍼링

flow의 다른 부분을 다른 코루틴에서 실행하는 것은 flow를 수집하는 데 걸리는 전체 시간 관점에서 도움이 될 수 있습니다. 특히 장시간 실행되는 비동기 작업이 포함될 때 더욱 그렇습니다. 예를 들어, `simple` flow의 방출이 느려서 요소를 생성하는 데 100ms가 걸리고, 컬렉터도 느려서 요소를 처리하는 데 300ms가 걸리는 경우를 생각해 봅시다. 세 개의 숫자를 가진 이러한 flow를 수집하는 데 얼마나 걸리는지 살펴보겠습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-16.kt)에서 확인할 수 있습니다.
>
{style="note"}

이는 전체 수집에 약 1200ms(세 개의 숫자, 각 400ms)가 소요되는 다음과 같은 결과를 생성합니다:

```text
1
2
3
Collected in 1220 ms
```

<!--- TEST ARBITRARY_TIME -->

[buffer] 연산자를 flow에 사용하여 `simple` flow의 방출 코드를 수집 코드와 동시에 실행할 수 있습니다. 순차적으로 실행하는 것과는 대조적입니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-17.kt)에서 확인할 수 있습니다.
>
{style="note"}

이는 동일한 숫자를 더 빠르게 생성합니다. 효과적으로 처리 파이프라인을 생성했기 때문입니다. 첫 번째 숫자에 대해 100ms만 기다린 다음 각 숫자를 처리하는 데 300ms만 소비합니다. 이런 방식으로 실행하는 데 약 1000ms가 걸립니다:

```text
1
2
3
Collected in 1071 ms
```                    

<!--- TEST ARBITRARY_TIME -->

> [flowOn] 연산자는 [CoroutineDispatcher]를 변경해야 할 때 동일한 버퍼링 메커니즘을 사용하지만, 여기서는 실행 컨텍스트를 변경하지 않고 명시적으로 버퍼링을 요청합니다.
>
{style="note"}

### 컨플레이션

flow가 연산의 부분 결과 또는 연산 상태 업데이트를 나타내는 경우, 각 값을 처리할 필요 없이 최신 값만 처리하는 것이 적절할 수 있습니다. 이 경우 컬렉터가 값을 처리하기에 너무 느릴 때 [conflate] 연산자를 사용하여 중간 값을 건너뛸 수 있습니다. 이전 예제를 기반으로:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-18.kt)에서 확인할 수 있습니다.
>
{style="note"}

첫 번째 숫자가 아직 처리되는 동안 두 번째와 세 번째 숫자가 이미 생성되었음을 알 수 있습니다. 따라서 두 번째 숫자는 _컨플레이트(conflate)_되었고, 가장 최근 값(세 번째 숫자)만 컬렉터에게 전달되었습니다:

```text
1
3
Collected in 758 ms
```             

<!--- TEST ARBITRARY_TIME -->

### 최신 값 처리

컨플레이션은 방출자와 컬렉터 모두 느릴 때 처리 속도를 높이는 한 가지 방법입니다. 이는 방출된 값을 버림으로써 수행됩니다. 다른 방법은 느린 컬렉터를 취소하고 새 값이 방출될 때마다 다시 시작하는 것입니다. `xxx` 연산자와 동일한 필수 로직을 수행하지만, 새 값에 대해 블록 내부의 코드를 취소하는 `xxxLatest` 계열 연산자가 있습니다. 이전 예제에서 [conflate]를 [collectLatest]로 변경해 봅시다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-19.kt)에서 확인할 수 있습니다.
>
{style="note"}
 
[collectLatest]의 본문은 300ms가 걸리지만, 새 값은 100ms마다 방출되므로, 블록이 모든 값에 대해 실행되지만 마지막 값에 대해서만 완료되는 것을 볼 수 있습니다:

```text 
Collecting 1
Collecting 2
Collecting 3
Done 3
Collected in 741 ms
``` 

<!--- TEST ARBITRARY_TIME -->

## 여러 flow 결합하기

여러 flow를 결합하는 방법은 많이 있습니다.

### Zip

Kotlin 표준 라이브러리의 [Sequence.zip] 확장 함수와 마찬가지로, flow에는 두 flow의 해당 값을 결합하는 [zip] 연산자가 있습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-20.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 예제는 다음을 출력합니다:

```text
1 -> one
2 -> two
3 -> three
```
 
<!--- TEST -->

### Combine

flow가 변수 또는 연산의 최신 값을 나타낼 때(관련 [컨플레이션](#conflation) 섹션 참조), 해당 flow의 최신 값에 의존하는 계산을 수행하고 업스트림 flow 중 하나라도 값을 방출할 때마다 이를 다시 계산해야 할 수 있습니다. 해당 연산자 계열을 [combine]이라고 합니다.

예를 들어, 이전 예제의 숫자가 300ms마다 업데이트되고 문자열이 400ms마다 업데이트되는 경우, [zip] 연산자를 사용하여 결합하더라도 동일한 결과가 생성되지만, 결과는 400ms마다 출력됩니다:

> 이 예제에서는 각 요소를 지연시키고 샘플 flow를 방출하는 코드를 더 선언적이고 짧게 만들기 위해 [onEach] 중간 연산자를 사용합니다.
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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-21.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST ARBITRARY_TIME
1 -> one at 437 ms from start
2 -> two at 837 ms from start
3 -> three at 1243 ms from start
-->

그러나 여기서 [zip] 대신 [combine] 연산자를 사용하면:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-22.kt)에서 확인할 수 있습니다.
>
{style="note"}

우리는 상당히 다른 출력을 얻습니다. `nums` 또는 `strs` flow 중 하나에서 각 방출 시 한 줄이 출력됩니다:

```text 
1 -> one at 452 ms from start
2 -> one at 651 ms from start
2 -> two at 854 ms from start
3 -> two at 952 ms from start
3 -> three at 1256 ms from start
```

<!--- TEST ARBITRARY_TIME -->

## Flow 평탄화

Flow는 비동기적으로 수신된 값 시퀀스를 나타내므로, 각 값이 다른 값 시퀀스에 대한 요청을 트리거하는 상황에 쉽게 놓일 수 있습니다. 예를 들어, 500ms 간격으로 두 개의 문자열 flow를 반환하는 다음 함수를 만들 수 있습니다:

```kotlin
fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // wait 500 ms
    emit("$i: Second")    
}
```

<!--- CLEAR -->

이제 세 개의 정수 flow를 가지고 각 정수에 대해 다음과 같이 `requestFlow`를 호출하면:

```kotlin
(1..3).asFlow().map { requestFlow(it) }
```

<!--- CLEAR -->

그러면 추가 처리를 위해 단일 flow로 _평탄화_해야 하는 flow의 flow(`Flow<Flow<String>>`)를 얻게 됩니다. 컬렉션과 시퀀스에는 이를 위한 [flatten][Sequence.flatten] 및 [flatMap][Sequence.flatMap] 연산자가 있습니다. 그러나 flow의 비동기적 특성 때문에 다양한 _평탄화 모드_가 필요하며, 따라서 flow에는 여러 평탄화 연산자 계열이 존재합니다.

### flatMapConcat

flow의 flow에 대한 연결은 [flatMapConcat] 및 [flattenConcat] 연산자를 통해 제공됩니다. 이들은 해당 시퀀스 연산자의 가장 직접적인 유사체입니다. 다음 예제에서 보여주듯이, 이들은 다음 flow를 수집하기 시작하기 전에 내부 flow가 완료될 때까지 기다립니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-23.kt)에서 확인할 수 있습니다.
>
{style="note"}

[flatMapConcat]의 순차적 특성은 출력에서 명확하게 볼 수 있습니다:

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

또 다른 평탄화 연산은 들어오는 모든 flow를 동시에 수집하고 그 값들을 단일 flow로 병합하여 가능한 한 빨리 값이 방출되도록 하는 것입니다. 이는 [flatMapMerge] 및 [flattenMerge] 연산자에 의해 구현됩니다. 두 연산자 모두 동시에 수집되는 동시 flow의 수를 제한하는 선택적 `concurrency` 매개변수를 받습니다(기본적으로 [DEFAULT_CONCURRENCY]와 같습니다).

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-24.kt)에서 확인할 수 있습니다.
>
{style="note"}

[flatMapMerge]의 동시성 특성은 명백합니다:

```text                      
1: First at 136 ms from start
2: First at 231 ms from start
3: First at 333 ms from start
1: Second at 639 ms from start
2: Second at 732 ms from start
3: Second at 833 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->

> [flatMapMerge]는 코드 블록(이 예제에서는 `{ requestFlow(it) }`)을 순차적으로 호출하지만, 결과 flow를 동시에 수집합니다. 이는 먼저 순차적으로 `map { requestFlow(it) }`를 수행한 다음 결과에 대해 [flattenMerge]를 호출하는 것과 동일합니다.
>
{style="note"}

### flatMapLatest   

["최신 값 처리"](#processing-the-latest-value) 섹션에서 설명된 [collectLatest] 연산자와 유사하게, 새 flow가 방출되자마자 이전 flow의 수집이 취소되는 해당 "Latest" 평탄화 모드가 있습니다. 이는 [flatMapLatest] 연산자에 의해 구현됩니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-25.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 예제의 출력은 [flatMapLatest]가 어떻게 작동하는지 잘 보여줍니다:

```text                      
1: First at 142 ms from start
2: First at 322 ms from start
3: First at 425 ms from start
3: Second at 931 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->
  
> [flatMapLatest]는 새 값을 수신하면 블록 내의 모든 코드(이 예제에서는 `{ requestFlow(it) }`)를 취소합니다.
> 이 특정 예제에서는 `requestFlow` 호출 자체가 빠르고 suspend되지 않으며 취소될 수 없으므로 차이가 없습니다. 그러나 `requestFlow`에서 `delay`와 같은 suspend 함수를 사용한다면 출력에 차이가 있을 것입니다.
>
{style="note"}

## Flow 예외

flow 수집은 방출자 또는 연산자 내부 코드가 예외를 던질 때 예외와 함께 완료될 수 있습니다. 이러한 예외를 처리하는 방법은 여러 가지가 있습니다.

### 컬렉터의 try-catch

컬렉터는 예외를 처리하기 위해 Kotlin의 [`try/catch`][exceptions] 블록을 사용할 수 있습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-26.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드는 [collect] 터미널 연산자에서 예외를 성공적으로 포착하며, 보시다시피 그 이후로는 더 이상 값이 방출되지 않습니다:

```text 
Emitting 1
1
Emitting 2
2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST -->

### 모든 예외 포착

이전 예제는 실제로 방출자 또는 중간/터미널 연산자에서 발생하는 모든 예외를 포착합니다. 예를 들어, 방출된 값을 문자열로 [map][map]하도록 코드를 변경하되, 해당 코드가 예외를 발생시키도록 해 봅시다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-27.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 예외는 여전히 포착되고 수집은 중지됩니다:

```text 
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
```

<!--- TEST -->

## 예외 투명성

그러나 방출자의 코드가 예외 처리 동작을 어떻게 캡슐화할 수 있을까요?

Flow는 _예외에 투명해야_ 하며, `flow { ... }` 빌더에서 `try/catch` 블록 내부로부터 값을 [emit][FlowCollector.emit]하는 것은 예외 투명성을 위반하는 것입니다. 이는 예외를 던지는 컬렉터가 이전 예제에서처럼 `try/catch`를 사용하여 항상 이를 포착할 수 있도록 보장합니다.

방출자는 이 예외 투명성을 보존하고 예외 처리를 캡슐화할 수 있도록 [catch] 연산자를 사용할 수 있습니다. `catch` 연산자의 본문은 예외를 분석하고 어떤 예외가 포착되었는지에 따라 다른 방식으로 반응할 수 있습니다:

*   `throw`를 사용하여 예외를 다시 던질 수 있습니다.
*   [catch] 본문에서 [emit][FlowCollector.emit]을 사용하여 예외를 값 방출로 바꿀 수 있습니다.
*   예외는 무시되거나, 로깅되거나, 다른 코드에 의해 처리될 수 있습니다.

예를 들어, 예외를 포착할 때 텍스트를 방출해 봅시다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-28.kt)에서 확인할 수 있습니다.
>
{style="note"} 
 
코드 주변에 더 이상 `try/catch`가 없더라도 예제의 출력은 동일합니다. 

<!--- TEST  
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
-->

### 투명한 catch

예외 투명성을 준수하는 [catch] 중간 연산자는 업스트림 예외(즉, `catch` 위에 있는 모든 연산자에서 발생한 예외이며, 그 아래에 있는 연산자에서 발생한 예외는 아님)만 포착합니다. 만약 `collect { ... }` 블록( `catch` 아래에 위치)에서 예외를 던지면 그 예외는 전달됩니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-29.kt)에서 확인할 수 있습니다.
>
{style="note"}
 
`catch` 연산자가 있음에도 불구하고 "Caught ..." 메시지는 출력되지 않습니다: 

```text  
Emitting 1
1
Emitting 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
	at ...
```

<!--- TEST EXCEPTION -->

### 선언적인 방식으로 예외 처리

[catch] 연산자의 선언적인 특성과 모든 예외를 처리하고자 하는 요구를 결합할 수 있습니다. 이를 위해 [collect] 연산자의 본문을 [onEach]로 옮기고 `catch` 연산자 앞에 두면 됩니다. 이 flow의 수집은 매개변수 없는 `collect()` 호출에 의해 트리거되어야 합니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-30.kt)에서 확인할 수 있습니다.
>
{style="note"} 
 
이제 "Caught ..." 메시지가 출력되는 것을 볼 수 있으며, 따라서 명시적으로 `try/catch` 블록을 사용하지 않고도 모든 예외를 포착할 수 있습니다: 

```text 
Emitting 1
1
Emitting 2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## Flow 완료

flow 수집이 완료되면(정상적으로든 예외적으로든) 특정 동작을 실행해야 할 수 있습니다. 이미 눈치챘겠지만, 이는 명령형 또는 선언형의 두 가지 방식으로 수행할 수 있습니다.

### 명령형 finally 블록

`try`/`catch` 외에도 컬렉터는 `finally` 블록을 사용하여 `collect` 완료 시 동작을 실행할 수 있습니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-31.kt)에서 확인할 수 있습니다.
>
{style="note"} 

이 코드는 `simple` flow에 의해 생성된 세 개의 숫자와 그 뒤에 "Done" 문자열을 출력합니다:

```text
1
2
3
Done
```

<!--- TEST  -->

### 선언적인 처리

선언적인 접근 방식을 위해, flow에는 flow가 완전히 수집되었을 때 호출되는 [onCompletion] 중간 연산자가 있습니다.

이전 예제는 [onCompletion] 연산자를 사용하여 다시 작성할 수 있으며 동일한 출력을 생성합니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-32.kt)에서 확인할 수 있습니다.
>
{style="note"} 

<!--- TEST 
1
2
3
Done
-->

[onCompletion]의 주요 장점은 람다의 널 허용 `Throwable` 매개변수로, flow 수집이 정상적으로 완료되었는지 또는 예외적으로 완료되었는지를 판단하는 데 사용할 수 있다는 것입니다. 다음 예제에서는 `simple` flow가 숫자 1을 방출한 후 예외를 던집니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-33.kt)에서 확인할 수 있습니다.
>
{style="note"}

예상했듯이, 다음을 출력합니다:

```text
1
Flow completed exceptionally
Caught exception
```

<!--- TEST -->

[onCompletion] 연산자는 [catch]와 달리 예외를 처리하지 않습니다. 위 예제 코드에서 볼 수 있듯이, 예외는 여전히 다운스트림으로 전달됩니다. 이는 추가 `onCompletion` 연산자로 전달되며 `catch` 연산자로 처리될 수 있습니다.

### 성공적인 완료

[catch] 연산자와의 또 다른 차이점은 [onCompletion]이 모든 예외를 보며, 업스트림 flow가 성공적으로 완료된 경우에만(취소 또는 실패 없이) `null` 예외를 수신한다는 것입니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-34.kt)에서 확인할 수 있습니다.
>
{style="note"}

flow가 다운스트림 예외로 인해 중단되었기 때문에 완료 원인이 null이 아님을 알 수 있습니다:

```text 
1
Flow completed with java.lang.IllegalStateException: Collected 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## 명령형 대 선언형

이제 flow를 수집하고, 완료 및 예외를 명령형과 선언형 모두로 처리하는 방법을 알게 되었습니다. 여기서 자연스럽게 드는 질문은 어떤 접근 방식이 선호되며 그 이유는 무엇인가입니다? 라이브러리로서 우리는 특정 접근 방식을 옹호하지 않으며, 두 가지 옵션 모두 유효하고 개발자의 선호도와 코드 스타일에 따라 선택되어야 한다고 생각합니다.

## Flow 실행

flow를 사용하여 특정 소스에서 발생하는 비동기 이벤트를 표현하는 것은 쉽습니다. 이 경우, 들어오는 이벤트에 대한 반응으로 코드 조각을 등록하고 추가 작업을 계속하는 `addEventListener` 함수와 유사한 것이 필요합니다. [onEach] 연산자가 이 역할을 수행할 수 있습니다. 그러나 `onEach`는 중간 연산자입니다. flow를 수집하려면 터미널 연산자도 필요합니다. 그렇지 않으면 `onEach`를 호출하는 것만으로는 아무런 효과가 없습니다.

[onEach] 뒤에 [collect] 터미널 연산자를 사용하면, 그 뒤의 코드는 flow가 수집될 때까지 기다립니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-35.kt)에서 확인할 수 있습니다.
>
{style="note"} 
  
보시다시피, 다음을 출력합니다:

```text 
Event: 1
Event: 2
Event: 3
Done
```    

<!--- TEST -->
 
여기서 [launchIn] 터미널 연산자가 유용하게 사용됩니다. `collect`를 `launchIn`으로 대체함으로써 flow의 수집을 별도의 코루틴에서 시작하여, 이후 코드의 실행이 즉시 계속되도록 할 수 있습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-36.kt)에서 확인할 수 있습니다.
>
{style="note"} 
  
출력:

```text          
Done
Event: 1
Event: 2
Event: 3
```    

<!--- TEST -->

`launchIn`에 필요한 매개변수는 flow를 수집할 코루틴이 시작될 [CoroutineScope]를 지정해야 합니다. 위 예제에서 이 스코프는 [runBlocking] 코루틴 빌더에서 나오므로, flow가 실행되는 동안 이 [runBlocking] 스코프는 자식 코루틴의 완료를 기다리고 메인 함수가 반환되어 이 예제를 종료하는 것을 방지합니다.

실제 애플리케이션에서는 스코프가 제한된 수명을 가진 엔티티에서 나옵니다. 이 엔티티의 수명이 종료되는 즉시 해당 스코프는 취소되어 해당 flow의 수집을 취소합니다. 이러한 방식으로 `onEach { ... }.launchIn(scope)` 쌍은 `addEventListener`처럼 작동합니다. 그러나 취소 및 구조화된 동시성이 이 목적을 달성하므로 해당 `removeEventListener` 함수는 필요하지 않습니다.

[launchIn]은 또한 [Job]을 반환하는데, 이는 전체 스코프를 취소하지 않고 해당 flow 수집 코루틴을 [cancel][Job.cancel]하거나 [join][Job.join]하는 데 사용될 수 있습니다.

### Flow 취소 확인

편의를 위해, [flow][_flow] 빌더는 각 방출된 값에 대해 취소를 위한 추가 [ensureActive] 확인을 수행합니다. 이는 `flow { ... }`에서 방출하는 바쁜 루프가 취소 가능함을 의미합니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-37.kt)에서 확인할 수 있습니다.
>
{style="note"}

숫자 3까지만 얻고, 숫자 4를 방출하려고 시도한 후 [CancellationException]을 얻게 됩니다:

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

그러나 대부분의 다른 flow 연산자는 성능상의 이유로 자체적으로 추가 취소 확인을 수행하지 않습니다. 예를 들어, [IntRange.asFlow] 확장을 사용하여 동일한 바쁜 루프를 작성하고 어디에서도 suspend하지 않으면 취소 확인이 없습니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-38.kt)에서 확인할 수 있습니다.
>
{style="note"}

1부터 5까지의 모든 숫자가 수집되고 `runBlocking`에서 반환되기 직전에만 취소가 감지됩니다:

```text
1
2
3
4
5
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@3327bd23
```

<!--- TEST EXCEPTION -->

#### 바쁜 flow를 취소 가능하게 만들기

코루틴과 함께 바쁜 루프를 사용하는 경우 명시적으로 취소를 확인해야 합니다. `.onEach { currentCoroutineContext().ensureActive() }`를 추가할 수 있지만, 이를 위해 준비된 [cancellable] 연산자가 제공됩니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-39.kt)에서 확인할 수 있습니다.
>
{style="note"}

`cancellable` 연산자를 사용하면 1부터 3까지의 숫자만 수집됩니다:

```text
1
2
3
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@5ec0a365
```

<!--- TEST EXCEPTION -->

## Flow와 Reactive Streams

[Reactive Streams](https://www.reactive-streams.org/) 또는 RxJava 및 Project Reactor와 같은 반응형 프레임워크에 익숙한 사람들에게 Flow의 디자인은 매우 친숙하게 느껴질 수 있습니다.

실제로 Flow의 디자인은 Reactive Streams와 그 다양한 구현에서 영감을 받았습니다. 그러나 Flow의 주요 목표는 가능한 한 단순한 디자인을 가지며, Kotlin 및 suspend 친화적이고 구조화된 동시성을 존중하는 것입니다. 이러한 목표는 반응형 개척자들과 그들의 엄청난 노력 없이는 불가능했을 것입니다. 전체 이야기는 [Reactive Streams and Kotlin Flows](https://medium.com/@elizarov/reactive-streams-and-kotlin-flows-bfd12772cda4) 문서에서 읽을 수 있습니다.

개념적으로 Flow는 다르지만 *반응형 스트림*이며, 이를 반응형(사양 및 TCK 준수) Publisher로 변환하거나 그 반대로 변환하는 것이 가능합니다. 이러한 변환기는 `kotlinx.coroutines`에서 기본으로 제공되며 해당 반응형 모듈(Reactive Streams용 `kotlinx-coroutines-reactive`, Project Reactor용 `kotlinx-coroutines-reactor`, RxJava2/RxJava3용 `kotlinx-coroutines-rx2`/`kotlinx-coroutines-rx3`)에서 찾을 수 있습니다. 통합 모듈에는 `Flow`와의 상호 변환, Reactor의 `Context`와의 통합, 그리고 다양한 반응형 엔티티와 함께 작동하는 suspend 친화적인 방법이 포함됩니다.
 
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