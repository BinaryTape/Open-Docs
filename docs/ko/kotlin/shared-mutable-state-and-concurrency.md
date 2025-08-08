<!--- TEST_NAME SharedStateGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 공유 가변 상태와 동시성)

코루틴은 [Dispatchers.Default]와 같은 다중 스레드 디스패처를 사용하여 병렬로 실행될 수 있습니다. 이는 일반적인 병렬 처리 문제를 모두 나타냅니다. 주요 문제는 **공유 가변 상태**에 대한 접근 동기화입니다. 코루틴 환경에서 이 문제에 대한 몇몇 해결책은 다중 스레드 환경의 해결책과 유사하지만, 다른 해결책들은 고유합니다.

## 문제

100개의 코루틴을 시작하여 각 코루틴이 동일한 동작을 1,000번 수행하도록 해봅시다. 또한, 추가 비교를 위해 이들의 완료 시간을 측정할 것입니다.

```kotlin
suspend fun massiveRun(action: suspend () -> Unit) {
    val n = 100  // 시작할 코루틴의 수
    val k = 1000 // 각 코루틴이 동작을 반복하는 횟수
    val time = measureTimeMillis {
        coroutineScope { // 코루틴을 위한 스코프 
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

우리는 다중 스레드 [Dispatchers.Default]를 사용하여 공유 가변 변수를 증가시키는 아주 간단한 동작부터 시작합니다.

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

마지막에 무엇이 출력될까요? 100개의 코루틴이 어떤 동기화 없이 여러 스레드에서 동시에 `counter`를 증가시키기 때문에 "Counter = 100000"이 출력될 가능성은 매우 낮습니다.

## Volatile은 도움이 되지 않습니다

변수를 `volatile`로 만들면 동시성 문제가 해결된다는 흔한 오해가 있습니다. 한번 시도해 봅시다:

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
@Volatile // 코틀린에서 `volatile`은 어노테이션입니다 
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

이 코드는 더 느리게 동작하지만, `volatile` 변수는 해당 변수에 대한 선형화 가능(linearizable, 이는 "원자적(atomic)"이라는 기술 용어입니다) 읽기 및 쓰기를 보장할 뿐, 더 큰 동작(이 경우 증가)의 원자성을 제공하지 않으므로 여전히 "Counter = 100000"이 항상 출력되지는 않습니다.

## 스레드 안전 데이터 구조

스레드와 코루틴 모두에 적용되는 일반적인 해결책은 공유 상태에서 수행되어야 하는 해당 연산에 필요한 모든 동기화를 제공하는 스레드 안전(동기화된, 선형화 가능, 또는 원자적이라고도 함) 데이터 구조를 사용하는 것입니다. 간단한 카운터의 경우, 원자적인 `incrementAndGet` 연산을 가진 `AtomicInteger` 클래스를 사용할 수 있습니다.

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

이것이 이 특정 문제에 대한 가장 빠른 해결책입니다. 이는 일반 카운터, 컬렉션, 큐 및 기타 표준 데이터 구조와 그에 대한 기본 연산에 작동합니다. 그러나 이는 복잡한 상태나 바로 사용할 수 있는 스레드 안전 구현이 없는 복잡한 연산에는 쉽게 확장되지 않습니다.

## 스레드 격리: 세분화된 방식

_스레드 격리(Thread confinement)_는 특정 공유 상태에 대한 모든 접근이 단일 스레드에 한정되는 공유 가변 상태 문제에 대한 접근 방식입니다. 이는 일반적으로 UI 애플리케이션에서 사용되며, 모든 UI 상태는 단일 이벤트 디스패치/애플리케이션 스레드에 한정됩니다. 코루틴에서는 단일 스레드 컨텍스트를 사용하여 쉽게 적용할 수 있습니다.

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
            // 각 증가 작업을 단일 스레드 컨텍스트에 한정
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

이 코드는 _세분화된(fine-grained)_ 스레드 격리를 수행하므로 매우 느리게 동작합니다. 각 개별 증가 작업은 [withContext(counterContext)][withContext] 블록을 사용하여 다중 스레드 [Dispatchers.Default] 컨텍스트에서 단일 스레드 컨텍스트로 전환합니다.

## 스레드 격리: 포괄적인 방식

실제로는 스레드 격리가 큰 단위로 수행됩니다. 예를 들어, 상태를 업데이트하는 비즈니스 로직의 큰 부분들이 단일 스레드에 한정됩니다. 다음 예시는 각 코루틴을 단일 스레드 컨텍스트에서 시작함으로써 이러한 방식으로 이를 수행합니다.

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
    // 모든 작업을 단일 스레드 컨텍스트에 한정
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

이제 이것은 훨씬 빠르게 동작하며 올바른 결과를 생성합니다.

## 상호 배제

이 문제에 대한 상호 배제(Mutual exclusion) 해결책은 공유 상태의 모든 수정을 동시에 실행되지 않는 _임계 영역(critical section)_으로 보호하는 것입니다. 블로킹 환경에서는 일반적으로 `synchronized`나 `ReentrantLock`을 사용합니다. 코루틴의 대안은 [Mutex]라고 불립니다. 이는 임계 영역을 구분하기 위한 [lock][Mutex.lock] 및 [unlock][Mutex.unlock] 함수를 가지고 있습니다. 주요 차이점은 `Mutex.lock()`이 일시 중단 함수라는 것입니다. 이는 스레드를 블록(차단)하지 않습니다.

또한 `mutex.lock(); try { ... } finally { mutex.unlock() }` 패턴을 편리하게 나타내는 [withLock] 확장 함수도 있습니다.

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
            // 각 증가 작업을 락으로 보호
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

이 예시의 잠금은 세분화되어 있으므로, 그에 따른 비용이 발생합니다. 그러나 공유 상태를 주기적으로 반드시 수정해야 하지만, 해당 상태가 한정되는 자연스러운 스레드가 없는 일부 상황에서는 좋은 선택입니다.

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