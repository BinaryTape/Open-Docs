<!--- TEST_NAME SharedStateGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 공유 가변 상태와 동시성)

코루틴은 [Dispatchers.Default]와 같은 다중 스레드 디스패처를 사용하여 병렬로 실행될 수 있습니다. 이는 일반적인 병렬 처리 문제를 모두 야기합니다. 주요 문제는 **공유 가변 상태**에 대한 접근 동기화입니다. 코루틴 환경에서 이 문제에 대한 일부 해결책은 다중 스레드 환경의 해결책과 유사하지만, 다른 해결책은 독특합니다.

## 문제

100개의 코루틴이 각각 동일한 작업을 1,000번 수행하도록 시작해 보겠습니다. 비교를 위해 완료 시간도 측정할 것입니다.

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

다중 스레드 [Dispatchers.Default]를 사용하여 공유 가변 변수를 증가시키는 아주 간단한 작업으로 시작해 보겠습니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-01.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

최종적으로 무엇이 출력될까요? 100개의 코루틴이 어떠한 동기화도 없이 여러 스레드에서 `counter`를 동시에 증가시키기 때문에 "Counter = 100000"이 출력될 가능성은 거의 없습니다.

## `volatile`은 도움이 되지 않습니다

변수를 `volatile`로 만들면 동시성 문제가 해결된다는 흔한 오해가 있습니다. 한번 시도해 봅시다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-02.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST LINES_START
Completed 100000 actions in
Counter =
-->

이 코드는 더 느리게 작동하지만, 여전히 최종적으로 "Counter = 100000"을 항상 얻지는 못합니다. `volatile` 변수는 해당 변수에 대한 선형화 가능(이는 "아토믹"에 대한 기술 용어입니다)한 읽기 및 쓰기를 보장하지만, 더 큰 작업(이 경우 증가)의 아토믹성을 제공하지 않기 때문입니다.

## 스레드 안전 데이터 구조

스레드와 코루틴 모두에서 작동하는 일반적인 해결책은 공유 상태에서 수행해야 하는 해당 작업에 필요한 모든 동기화를 제공하는 스레드 안전(동기화된, 선형화 가능한, 또는 아토믹이라고도 함)한 데이터 구조를 사용하는 것입니다. 간단한 카운터의 경우 아토믹 `incrementAndGet` 연산을 가진 `AtomicInteger` 클래스를 사용할 수 있습니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-03.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

이는 이 특정 문제에 대한 가장 빠른 해결책입니다. 일반 카운터, 컬렉션, 큐 및 기타 표준 데이터 구조와 그에 대한 기본 연산에 적용됩니다. 하지만 복잡한 상태나 바로 사용할 수 있는 스레드 안전 구현이 없는 복잡한 연산에는 쉽게 확장되지 않습니다.

## 세밀한 스레드 제한(Thread confinement fine-grained)

_스레드 제한(Thread confinement)_은 특정 공유 상태에 대한 모든 접근이 단일 스레드로 제한되는 공유 가변 상태 문제에 대한 접근 방식입니다. 일반적으로 모든 UI 상태가 단일 이벤트 디스패치/애플리케이션 스레드에 제한되는 UI 애플리케이션에서 사용됩니다. 단일 스레드 컨텍스트를 사용하여 코루틴에서 쉽게 적용할 수 있습니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-04.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

이 코드는 매우 느리게 작동하는데, 이는 _세밀한(fine-grained)_ 스레드 제한을 수행하기 때문입니다. 각 개별 증가는 다중 스레드 [Dispatchers.Default] 컨텍스트에서 [withContext(counterContext)][withContext] 블록을 사용하여 단일 스레드 컨텍스트로 전환합니다.

## 전체적인 스레드 제한(Thread confinement coarse-grained)

실제로는 스레드 제한이 큰 덩어리(예: 상태 업데이트 비즈니스 로직의 큰 부분)로 수행되어 단일 스레드에 제한됩니다. 다음 예시는 각 코루틴을 단일 스레드 컨텍스트에서 시작하여 그렇게 수행합니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-05.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

이제 훨씬 빠르게 작동하며 올바른 결과를 생성합니다.

## 상호 배제(Mutual exclusion)

문제에 대한 상호 배제(mutual exclusion) 해결책은 공유 상태의 모든 수정을 동시에 실행되지 않는 _임계 영역(critical section)_으로 보호하는 것입니다. 블로킹 환경에서는 일반적으로 `synchronized` 또는 `ReentrantLock`를 사용합니다. 코루틴의 대안은 [뮤텍스(Mutex)]라고 불립니다. 이 함수는 임계 영역을 구분하는 [lock][Mutex.lock] 및 [unlock][Mutex.unlock] 함수를 가지고 있습니다. 핵심적인 차이점은 `Mutex.lock()`이 일시 중단 함수(suspending function)라는 것입니다. 스레드를 블록하지 않습니다.

또한 `mutex.lock(); try { ... } finally { mutex.unlock() }` 패턴을 편리하게 나타내는 [withLock] 확장 함수가 있습니다.

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
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-sync-06.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST ARBITRARY_TIME
Completed 100000 actions in xxx ms
Counter = 100000
-->

이 예시의 잠금은 세밀하게 이루어지므로, 그에 따른 비용이 발생합니다. 하지만 공유 상태를 주기적으로 반드시 수정해야 하지만, 이 상태가 특정 스레드에 제한되지 않는 일부 상황에서는 좋은 선택입니다.

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