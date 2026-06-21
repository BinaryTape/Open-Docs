<!--- TEST_NAME FlowGuideTest --> 
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 플로우 연산자)

> 이 페이지는 현재 수정 중입니다. 플로우에 대한 최신 가이드는 [플로우 개요](coroutines-flow.md)에서 확인하세요.
>
{style="note"}

플로우는 컬렉션이나 시퀀스를 변환하는 것과 동일한 방식으로 연산자를 사용하여 변환할 수 있습니다.
중간 연산자(Intermediate operator)는 업스트림 플로우에 적용되어 다운스트림 플로우를 반환합니다.
이러한 연산자들은 콜드(cold) 방식으로 동작합니다. 이러한 연산자를 호출하는 것 자체는 일시 중단 함수가 아닙니다. 이는 빠르게 작동하여 새로운 변환된 플로우의 정의를 반환합니다.

기본 연산자들은 [map]이나 [filter]와 같이 익숙한 이름을 가지고 있습니다.
시퀀스와의 중요한 차이점은 이러한 연산자 내부의 코드 블록에서 일시 중단 함수를 호출할 수 있다는 점입니다.

예를 들어, 들어오는 요청 플로우를 결과 플로우로 매핑할 때, 요청을 수행하는 작업이 일시 중단 함수로 구현된 오래 걸리는 작업이더라도 [map] 연산자를 사용할 수 있습니다.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart           
suspend fun performRequest(request: Int): String {
    delay(1000) // 오래 걸리는 비동기 작업을 흉내냅니다.
    return "response $request"
}

fun main() = runBlocking<Unit> {
    (1..3).asFlow() // 요청 플로우
        .map { request -> performRequest(request) }
        .collect { response -> println(response) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-01.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-01.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드는 다음과 같이 세 줄을 출력하며, 각 줄은 이전 줄이 나타난 지 1초 후에 나타납니다:

```text                                                                    
response 1
response 2
response 3
```

<!--- TEST -->

### Transform 연산자

플로우 변환 연산자 중에서 가장 일반적인 것은 [transform]입니다. 이는 [map]이나 [filter]와 같은 단순한 변환을 흉내 내는 것뿐만 아니라, 더 복잡한 변환을 구현하는 데에도 사용할 수 있습니다.
`transform` 연산자를 사용하면 임의의 값을 임의의 횟수만큼 [방출(emit)][FlowCollector.emit]할 수 있습니다.

예를 들어, `transform`을 사용하여 오래 걸리는 비동기 요청을 수행하기 전에 문자열을 방출하고, 그 뒤에 응답을 방출할 수 있습니다.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

suspend fun performRequest(request: Int): String {
    delay(1000) // 오래 걸리는 비동기 작업을 흉내냅니다.
    return "response $request"
}

fun main() = runBlocking<Unit> {
//sampleStart
    (1..3).asFlow() // 요청 플로우
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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-02.kt)에서 확인할 수 있습니다.
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

[take]와 같은 크기 제한 중간 연산자는 해당 제한에 도달하면 플로우의 실행을 취소합니다. 코루틴에서의 취소는 항상 예외를 던지는 방식으로 수행되므로, 취소 시에도 모든 리소스 관리 함수(예: `try { ... } finally { ... }` 블록)가 정상적으로 작동합니다.

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
        .take(2) // 처음 두 개만 가져옵니다.
        .collect { value -> println(value) }
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-03.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-03.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 `numbers()` 함수의 `flow { ... }` 바디 실행이 두 번째 숫자를 방출한 후 중단되었음을 명확히 보여줍니다:

```text       
1
2
Finally in numbers
```

<!--- TEST -->

## 종단 플로우 연산자

플로우에서의 종단 연산자(Terminal operator)는 플로우 수집(collection)을 시작하는 *일시 중단 함수*입니다.
[collect] 연산자가 가장 기본적이지만, 작업을 더 쉽게 만들어주는 다른 종단 연산자들도 있습니다.

* [toList] 및 [toSet]과 같이 다양한 컬렉션으로 변환하는 연산자.
* [first] 값을 가져오거나 플로우가 단 하나의 값만 방출하도록 보장하는 [single] 연산자.
* [reduce] 및 [fold]를 사용하여 플로우를 하나의 값으로 축소하는 연산자.

예를 들면 다음과 같습니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart         
    val sum = (1..5).asFlow()
        .map { it * it } // 1부터 5까지의 제곱 수                           
        .reduce { a, b -> a + b } // 합산 (종단 연산자)
    println(sum)
//sampleEnd     
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-04.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-04.kt)에서 확인할 수 있습니다.
>
{style="note"}

단일 숫자를 출력합니다:

```text
55
```

<!--- TEST -->

## 버퍼링 (Buffering)

플로우의 서로 다른 부분을 서로 다른 코루틴에서 실행하는 것은 플로우를 수집하는 데 걸리는 전체 시간 측면에서 도움이 될 수 있으며, 특히 오래 걸리는 비동기 작업이 포함된 경우 더욱 그렇습니다. 예를 들어, `simple` 플로우가 요소를 생산하는 데 100ms가 걸리고 수집기(collector)가 요소를 처리하는 데 300ms가 걸리는 경우를 생각해 봅시다. 세 개의 숫자가 있는 이러한 플로우를 수집하는 데 시간이 얼마나 걸리는지 확인해 보겠습니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 100ms 동안 비동기적으로 기다린다고 가정합니다.
        emit(i) // 다음 값을 방출합니다.
    }
}

fun main() = runBlocking<Unit> { 
    val time = measureTimeMillis {
        simple().collect { value -> 
            delay(300) // 300ms 동안 처리한다고 가정합니다.
            println(value) 
        } 
    }   
    println("Collected in $time ms")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-05.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-05.kt)에서 확인할 수 있습니다.
>
{style="note"}

전체 수집에 약 1200ms가 걸리며(세 개의 숫자, 각각 400ms 소요) 다음과 같은 결과가 생성됩니다:

```text
1
2
3
Collected in 1220 ms
```

<!--- TEST ARBITRARY_TIME -->

플로우에 [buffer] 연산자를 사용하여 `simple` 플로우의 방출 코드와 수집 코드를 순차적으로 실행하는 대신 동시에 실행할 수 있습니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 100ms 동안 비동기적으로 기다린다고 가정합니다.
        emit(i) // 다음 값을 방출합니다.
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .buffer() // 방출을 버퍼링하며, 기다리지 않습니다.
            .collect { value -> 
                delay(300) // 300ms 동안 처리한다고 가정합니다.
                println(value) 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-06.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-06.kt)에서 확인할 수 있습니다.
>
{style="note"}

효과적으로 처리 파이프라인을 생성했기 때문에 동일한 숫자를 더 빠르게 생성합니다. 첫 번째 숫자를 위해 100ms만 기다리면 되고, 그 후에는 각 숫자를 처리하는 데 300ms만 소요됩니다. 이 방식으로는 약 1000ms가 걸립니다.

```text
1
2
3
Collected in 1071 ms
```                    

<!--- TEST ARBITRARY_TIME -->

> [flowOn] 연산자도 [CoroutineDispatcher]를 변경해야 할 때 동일한 버퍼링 메커니즘을 사용하지만, 여기서는 실행 컨텍스트를 변경하지 않고 명시적으로 버퍼링을 요청했습니다.
>
{style="note"}

### Conflation (결합)

플로우가 연산의 중간 결과나 연산 상태 업데이트를 나타내는 경우, 각 값을 모두 처리할 필요 없이 가장 최근의 값만 처리해도 될 때가 있습니다. 이 경우 [conflate] 연산자를 사용하여 수집기가 너무 느려 처리하지 못할 때 중간 값들을 건너뛸 수 있습니다. 이전 예제를 바탕으로 살펴보겠습니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 100ms 동안 비동기적으로 기다린다고 가정합니다.
        emit(i) // 다음 값을 방출합니다.
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .conflate() // 방출을 결합(conflate)하여 모든 값을 처리하지 않습니다.
            .collect { value -> 
                delay(300) // 300ms 동안 처리한다고 가정합니다.
                println(value) 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-07.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-07.kt)에서 확인할 수 있습니다.
>
{style="note"}

첫 번째 숫자가 여전히 처리되는 동안 두 번째와 세 번째 숫자가 이미 생성되었으므로, 두 번째 숫자는 *결합(conflated)*되고 가장 최근의 값(세 번째 값)만 수집기에 전달되었음을 알 수 있습니다:

```text
1
3
Collected in 758 ms
```             

<!--- TEST ARBITRARY_TIME -->

### 최신 값 처리

Conflation은 방출기와 수집기 모두 느릴 때 처리를 가속화하는 한 가지 방법입니다. 이는 방출된 값을 떨어뜨림으로써 수행됩니다. 또 다른 방법은 새로운 값이 방출될 때마다 느린 수집기를 취소하고 다시 시작하는 것입니다. `xxx` 연산자와 동일한 필수 로직을 수행하지만 새로운 값이 들어오면 블록 내부의 코드를 취소하는 `xxxLatest` 연산자 군이 있습니다. 이전 예제에서 [conflate]를 [collectLatest]로 변경해 보겠습니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 100ms 동안 비동기적으로 기다린다고 가정합니다.
        emit(i) // 다음 값을 방출합니다.
    }
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val time = measureTimeMillis {
        simple()
            .collectLatest { value -> // 최신 값에 대해 취소 및 재시작
                println("Collecting $value") 
                delay(300) // 300ms 동안 처리한다고 가정합니다.
                println("Done $value") 
            } 
    }   
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-08.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-08.kt)에서 확인할 수 있습니다.
>
{style="note"}

[collectLatest]의 바디는 300ms가 걸리지만 새로운 값은 100ms마다 방출되므로, 블록은 모든 값에 대해 실행되지만 마지막 값에 대해서만 완료되는 것을 볼 수 있습니다:

```text 
Collecting 1
Collecting 2
Collecting 3
Done 3
Collected in 741 ms
``` 

<!--- TEST ARBITRARY_TIME -->

## 여러 플로우 합성하기

여러 플로우를 합성하는 방법은 매우 많습니다.

### Zip

Kotlin 표준 라이브러리의 [Sequence.zip] 확장 함수와 마찬가지로, 플로우에는 두 플로우의 대응하는 값을 결합하는 [zip] 연산자가 있습니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow() // 숫자 1..3
    val strs = flowOf("one", "two", "three") // 문자열 
    nums.zip(strs) { a, b -> "$a -> $b" } // 단일 문자열로 합성
        .collect { println(it) } // 수집 및 출력
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-09.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-09.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 예제는 다음과 같이 출력합니다:

```text
1 -> one
2 -> two
3 -> three
```

<!--- TEST -->

### Combine

플로우가 변수나 연산의 가장 최근 값을 나타낼 때([conflation](#conflation) 섹션 참조), 해당 플로우들의 가장 최근 값에 의존하는 계산을 수행하고 업스트림 플로우 중 하나가 값을 방출할 때마다 이를 다시 계산해야 할 수도 있습니다. 이에 해당하는 연산자 군을 [combine]이라고 합니다.

예를 들어, 이전 예제의 숫자들이 300ms마다 업데이트되고 문자열이 400ms마다 업데이트된다면, [zip] 연산자를 사용하여 압축할 경우 결과는 400ms마다 출력되지만 결과는 동일하게 유지됩니다:

> 이 예제에서는 각 요소에 지연을 주고 샘플 플로우를 방출하는 코드를 더 선언적이고 짧게 만들기 위해 [onEach] 중간 연산자를 사용합니다.
>
{style="note"}

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow().onEach { delay(300) } // 300ms마다 숫자 1..3
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 400ms마다 문자열
    val startTime = System.currentTimeMillis() // 시작 시간 기록 
    nums.zip(strs) { a, b -> "$a -> $b" } // "zip"으로 단일 문자열 합성
        .collect { value -> // 수집 및 출력 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-10.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-10.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST ARBITRARY_TIME
1 -> one at 437 ms from start
2 -> two at 837 ms from start
3 -> three at 1243 ms from start
-->

하지만 여기서 [zip] 대신 [combine] 연산자를 사용하면 다음과 같습니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> { 
//sampleStart                                                                           
    val nums = (1..3).asFlow().onEach { delay(300) } // 300ms마다 숫자 1..3
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 400ms마다 문자열          
    val startTime = System.currentTimeMillis() // 시작 시간 기록 
    nums.combine(strs) { a, b -> "$a -> $b" } // "combine"으로 단일 문자열 합성
        .collect { value -> // 수집 및 출력 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-11.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-11.kt)에서 확인할 수 있습니다.
>
{style="note"}

`nums` 또는 `strs` 플로우 중 하나에서 방출이 일어날 때마다 한 줄씩 출력되는 상당히 다른 출력을 얻게 됩니다:

```text 
1 -> one at 452 ms from start
2 -> one at 651 ms from start
2 -> two at 854 ms from start
3 -> two at 952 ms from start
3 -> three at 1256 ms from start
```

<!--- TEST ARBITRARY_TIME -->

## 플로우 플래트닝 (Flattening flows)

플로우는 비동기적으로 수신된 값의 시퀀스를 나타내므로, 각 값이 또 다른 값의 시퀀스에 대한 요청을 트리거하는 상황이 발생하기 쉽습니다. 예를 들어, 500ms 간격으로 두 개의 문자열 플로우를 반환하는 다음과 같은 함수가 있을 수 있습니다:

```kotlin
fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 500ms 대기
    emit("$i: Second")    
}
```

<!--- CLEAR -->

이제 세 개의 정수 플로우가 있고 각각에 대해 `requestFlow`를 호출하면 다음과 같습니다:

```kotlin
(1..3).asFlow().map { requestFlow(it) }
```

<!--- CLEAR -->

그러면 추가 처리를 위해 단일 플로우로 *플래트닝(flattened, 평탄화)*해야 하는 플로우들의 플로우(`Flow<Flow<String>>`)가 생깁니다. 컬렉션과 시퀀스에는 이를 위한 [flatten][Sequence.flatten] 및 [flatMap][Sequence.flatMap] 연산자가 있습니다. 하지만 플로우의 비동기적 특성 때문에 다양한 플래트닝 *모드*가 필요하며, 따라서 플로우에는 플래트닝 연산자 군이 존재합니다.

### flatMapConcat

플로우들의 플로우를 연결(Concatenation)하는 기능은 [flatMapConcat] 및 [flattenConcat] 연산자가 제공합니다. 이들은 해당 시퀀스 연산자와 가장 직접적인 유사체입니다. 다음 예제에서 볼 수 있듯이, 이들은 다음 플로우를 수집하기 전에 내부 플로우가 완료될 때까지 기다립니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 500ms 대기
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // 시작 시간 기록 
    (1..3).asFlow().onEach { delay(100) } // 100ms마다 숫자 방출 
        .flatMapConcat { requestFlow(it) }                                                                           
        .collect { value -> // 수집 및 출력 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-12.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-12.kt)에서 확인할 수 있습니다.
>
{style="note"}

[flatMapConcat]의 순차적인 특성은 출력에서 명확히 확인할 수 있습니다:

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

또 다른 플래트닝 연산은 모든 유입되는 플로우를 동시에 수집하고 그 값들을 단일 플로우로 병합하여 가능한 한 빨리 값이 방출되도록 하는 것입니다. 이는 [flatMapMerge] 및 [flattenMerge] 연산자에 의해 구현됩니다. 두 연산자 모두 동시에 수집되는 동시 플로우의 수를 제한하는 선택적 `concurrency` 파라미터를 허용합니다(기본값은 [DEFAULT_CONCURRENCY]와 같습니다).

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 500ms 대기
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // 시작 시간 기록 
    (1..3).asFlow().onEach { delay(100) } // 100ms마다 숫자 
        .flatMapMerge { requestFlow(it) }                                                                           
        .collect { value -> // 수집 및 출력 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-13.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-13.kt)에서 확인할 수 있습니다.
>
{style="note"}

[flatMapMerge]의 동시 처리(concurrent) 특성은 자명합니다:

```text                      
1: First at 136 ms from start
2: First at 231 ms from start
3: First at 333 ms from start
1: Second at 639 ms from start
2: Second at 732 ms from start
3: Second at 833 ms from start
```                                               

<!--- TEST ARBITRARY_TIME -->

> [flatMapMerge]는 코드 블록(이 예제에서는 `{ requestFlow(it) }`)을 순차적으로 호출하지만, 결과 플로우들은 동시에 수집한다는 점에 유의하세요. 이는 먼저 순차적으로 `map { requestFlow(it) }`를 수행한 다음 결과에 [flattenMerge]를 호출하는 것과 같습니다.
>
{style="note"}

### flatMapLatest

["최신 값 처리"](#processing-the-latest-value) 섹션에서 설명한 [collectLatest] 연산자와 유사하게, 새로운 플로우가 방출되는 즉시 이전 플로우의 수집이 취소되는 "Latest" 플래트닝 모드가 있습니다. 이는 [flatMapLatest] 연산자에 의해 구현됩니다.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First") 
    delay(500) // 500ms 대기
    emit("$i: Second")    
}

fun main() = runBlocking<Unit> { 
//sampleStart
    val startTime = System.currentTimeMillis() // 시작 시간 기록 
    (1..3).asFlow().onEach { delay(100) } // 100ms마다 숫자 
        .flatMapLatest { requestFlow(it) }                                                                           
        .collect { value -> // 수집 및 출력 
            println("$value at ${System.currentTimeMillis() - startTime} ms from start") 
        } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-14.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-14.kt)에서 확인할 수 있습니다.
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

> [flatMapLatest]는 새로운 값을 받으면 해당 블록의 모든 코드(이 예제에서는 `{ requestFlow(it) }`)를 취소합니다. 이 예제에서는 `requestFlow` 호출 자체가 빠르고 일시 중단되지 않으며 취소할 수 없기 때문에 큰 차이가 없습니다. 그러나 `requestFlow`에서 `delay`와 같은 일시 중단 함수를 사용한다면 출력의 차이를 확인할 수 있을 것입니다.
>
{style="note"}

## 플로우 완료

플로우 수집이 완료될 때(정상적으로 또는 예외적으로), 특정 동작을 실행해야 할 수도 있습니다. 이미 눈치채셨겠지만, 이는 명령형(imperative) 또는 선언적(declarative) 두 가지 방식으로 수행할 수 있습니다.

### 명령형 finally 블록

수집기는 `try`/`catch` 외에도 `finally` 블록을 사용하여 `collect` 완료 시 동작을 실행할 수 있습니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-15.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드는 `simple` 플로우에서 생성된 세 개의 숫자를 출력한 후 "Done" 문자열을 출력합니다:

```text
1
2
3
Done
```

<!--- TEST  -->

### 선언적 핸들링

선언적 접근 방식을 위해 플로우에는 플로우가 완전히 수집되었을 때 호출되는 [onCompletion] 중간 연산자가 있습니다.

이전 예제는 [onCompletion] 연산자를 사용하여 다음과 같이 재작성할 수 있으며 동일한 출력을 생성합니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-16.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST 
1
2
3
Done
-->

[onCompletion]의 주요 장점은 람다의 nullable `Throwable` 파라미터를 사용하여 플로우 수집이 정상적으로 완료되었는지 아니면 예외가 발생하여 완료되었는지 판단할 수 있다는 점입니다. 다음 예제에서 `simple` 플로우는 숫자 1을 방출한 후 예외를 던집니다:

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-17.kt)에서 확인할 수 있습니다.
>
{style="note"}

예상할 수 있듯이 다음과 같이 출력됩니다:

```text
1
Flow completed exceptionally
Caught exception
```

<!--- TEST -->

[onCompletion] 연산자는 [catch]와 달리 예외를 처리하지 않습니다. 위 예제 코드에서 볼 수 있듯이, 예외는 여전히 다운스트림으로 흐릅니다. 예외는 추가적인 `onCompletion` 연산자들에게 전달될 것이며 `catch` 연산자로 처리될 수 있습니다.

### 성공적인 완료

[catch] 연산자와의 또 다른 차이점은 [onCompletion]이 모든 예외를 확인하며, 업스트림 플로우가 (취소나 실패 없이) 성공적으로 완료되었을 때만 `null` 예외를 받는다는 것입니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-18.kt)에서 확인할 수 있습니다.
>
{style="note"}

다운스트림 예외로 인해 플로우가 중단되었기 때문에 완료 원인(completion cause)이 null이 아님을 알 수 있습니다:

```text 
1
Flow completed with java.lang.IllegalStateException: Collected 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## 플로우 실행하기

어떤 소스로부터 오는 비동기 이벤트를 나타내는 데 플로우를 사용하는 것은 매우 쉽습니다. 이 경우, 들어오는 이벤트에 대한 반응으로 코드 조각을 등록하고 이후 작업을 계속 진행하는 `addEventListener` 함수와 유사한 기능이 필요합니다. [onEach] 연산자가 이 역할을 수행할 수 있습니다. 하지만 `onEach`는 중간 연산자입니다. 플로우를 수집하려면 종단 연산자도 필요합니다. 그렇지 않으면 단순히 `onEach`를 호출하는 것은 아무런 효과가 없습니다.

`onEach` 뒤에 [collect] 종단 연산자를 사용하면, 그 뒤의 코드는 플로우가 수집될 때까지 기다리게 됩니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
// 이벤트 플로우를 흉내냅니다.
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .collect() // <--- 플로우 수집이 끝날 때까지 기다립니다.
    println("Done")
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-19.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-19.kt)에서 확인할 수 있습니다.
>
{style="note"}

출력은 다음과 같습니다:

```text 
Event: 1
Event: 2
Event: 3
Done
```    

<!--- TEST -->

이때 [launchIn] 종단 연산자가 유용하게 쓰입니다. `collect`를 `launchIn`으로 바꾸면 별도의 코루틴에서 플로우 수집을 시작할 수 있으므로, 이후 코드의 실행이 즉시 계속됩니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

// 이벤트 플로우를 흉내냅니다.
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

//sampleStart
fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .launchIn(this) // <--- 별도의 코루틴에서 플로우를 실행합니다.
    println("Done")
}            
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-flow-20.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-20.kt)에서 확인할 수 있습니다.
>
{style="note"}

다음과 같이 출력됩니다:

```text          
Done
Event: 1
Event: 2
Event: 3
```    

<!--- TEST -->

`launchIn`에 필요한 파라미터는 플로우를 수집할 코루틴이 실행될 [CoroutineScope]를 지정해야 합니다. 위 예제에서 이 스코프는 [runBlocking] 코루틴 빌더에서 제공되므로, 플로우가 실행되는 동안 이 [runBlocking] 스코프는 자식 코루틴이 완료될 때까지 기다리며 main 함수가 반환되어 예제가 종료되는 것을 방지합니다.

실제 애플리케이션에서 스코프는 수명이 제한된 엔티티에서 제공될 것입니다. 해당 엔티티의 수명이 종료되는 즉시 대응하는 스코프가 취소되어 해당 플로우의 수집도 취소됩니다. 이런 방식으로 `onEach { ... }.launchIn(scope)` 쌍은 `addEventListener`와 유사하게 작동합니다. 하지만 취소와 구조화된 동시성(structured concurrency)이 이 목적을 달성해주므로, 이에 대응하는 `removeEventListener` 함수는 필요하지 않습니다.

[launchIn]은 또한 [Job]을 반환하며, 이는 전체 스코프를 취소하지 않고 해당 플로우 수집 코루틴만 [취소][Job.cancel]하거나 [대기][Job.join]하는 데 사용할 수 있습니다.

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