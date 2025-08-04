<!--- TEST_NAME ComposingGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 일시 중단 함수 구성하기)

이 섹션에서는 일시 중단 함수(suspending functions)를 구성하는 다양한 접근 방식에 대해 설명합니다.

## 기본적으로 순차적

어딘가에 정의된 두 개의 일시 중단 함수가 원격 서비스 호출이나 계산과 같은 유용한 작업을 수행한다고 가정해 봅시다. 이 예제에서는 유용한 작업을 하는 것처럼 보이지만, 실제로는 각 함수가 1초 동안 지연됩니다.

```kotlin
suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```

이 함수들을 _순차적으로_ 호출해야 한다면 어떻게 해야 할까요? &mdash; 먼저 `doSomethingUsefulOne`을 호출한 _다음_ `doSomethingUsefulTwo`를 호출하고, 그 결과의 합계를 계산해야 한다면요?
실제로 이러한 작업은 첫 번째 함수의 결과를 사용하여 두 번째 함수를 호출해야 할지 또는 어떻게 호출할지에 대한 결정을 내려야 할 때 수행합니다.

일반적인 코드와 마찬가지로 코루틴 내부의 코드도 기본적으로 _순차적_이므로 일반적인 순차적 호출을 사용합니다. 다음 예제는 두 일시 중단 함수를 실행하는 데 걸리는 총 시간을 측정하여 이를 보여줍니다.

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = doSomethingUsefulOne()
        val two = doSomethingUsefulTwo()
        println("The answer is ${one + two}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-01.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-01.kt)에서 확인할 수 있습니다.
>
{style="note"}

결과는 다음과 같습니다.

```text
The answer is 42
Completed in 2017 ms
```

<!--- TEST ARBITRARY_TIME -->

## `async`를 사용한 동시 실행

`doSomethingUsefulOne`과 `doSomethingUsefulTwo`의 호출 사이에 종속성이 없고, 두 함수를 _동시적으로_ 실행하여 더 빨리 결과를 얻고 싶다면 어떻게 해야 할까요? 바로 이때 [async]가 도움이 됩니다.

개념적으로 [async]는 [launch]와 같습니다. [async]는 다른 모든 코루틴과 동시에 작동하는 경량 스레드인 별도의 코루틴을 시작합니다. 차이점은 `launch`가 [Job]을 반환하고 결과 값을 전달하지 않는 반면, `async`는 [Deferred] &mdash; 나중에 결과를 제공하겠다는 약속을 나타내는 경량 비블로킹 퓨처(future)를 반환한다는 것입니다. `Deferred` 값에 `.await()`를 사용하여 최종 결과를 얻을 수 있지만, `Deferred`는 또한 [Job]이므로 필요하면 취소할 수도 있습니다.

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = async { doSomethingUsefulOne() }
        val two = async { doSomethingUsefulTwo() }
        println("The answer is ${one.await() + two.await()}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-02.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-02.kt)에서 확인할 수 있습니다.
>
{style="note"}

결과는 다음과 같습니다.

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

두 코루틴이 동시에 실행되므로 두 배 더 빠릅니다.
코루틴을 통한 동시성(concurrency)은 항상 명시적(explicit)이라는 점에 유의하세요.

## 지연 시작 `async`

선택적으로 [async]는 `start` 매개변수를 [CoroutineStart.LAZY]로 설정하여 지연(lazy)되도록 만들 수 있습니다.
이 모드에서는 [await][Deferred.await]를 통해 결과가 필요하거나 [Job]의 [start][Job.start] 함수가 호출될 때만 코루틴을 시작합니다. 다음 예제를 실행해 보세요.

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = async(start = CoroutineStart.LAZY) { doSomethingUsefulOne() }
        val two = async(start = CoroutineStart.LAZY) { doSomethingUsefulTwo() }
        // some computation
        one.start() // start the first one
        two.start() // start the second one
        println("The answer is ${one.await() + two.await()}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-03.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-03.kt)에서 확인할 수 있습니다.
>
{style="note"}

결과는 다음과 같습니다.

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

여기서는 두 코루틴이 정의되었지만 이전 예제처럼 바로 실행되지 않고, [start][Job.start]를 호출하여 정확히 언제 실행을 시작할지에 대한 제어권이 프로그래머에게 주어집니다. 먼저 `one`을 시작하고, 다음으로 `two`를 시작한 후, 각 코루틴이 끝날 때까지 기다립니다.

만약 각 코루틴에 대해 [start][Job.start]를 먼저 호출하지 않고 `println`에서 [await][Deferred.await]만 호출하면, [await][Deferred.await]가 코루틴 실행을 시작하고 완료될 때까지 기다리므로 순차적인 동작이 발생할 것입니다. 이는 지연(laziness)의 의도된 사용 사례가 아닙니다.
`async(start = CoroutineStart.LAZY)`의 사용 사례는 값 계산에 일시 중단 함수가 포함되는 경우 표준 [lazy](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/lazy.html) 함수를 대체하는 것입니다.

## 비동기 스타일 함수

> 이 비동기 함수 프로그래밍 스타일은 다른 프로그래밍 언어에서 인기 있는 스타일이기 때문에 여기에 예시로만 제공됩니다. 아래에 설명된 이유로 인해 이 스타일을 Kotlin 코루틴과 함께 사용하는 것은 **강력히 권장되지 않습니다**.
>
{style="note"}

[GlobalScope]를 사용하여 구조화된 동시성에서 벗어나도록 [async] 코루틴 빌더를 사용하여 `doSomethingUsefulOne`과 `doSomethingUsefulTwo`를 _비동기적으로_ 호출하는 비동기 스타일 함수를 정의할 수 있습니다.
이러한 함수는 비동기 계산을 시작할 뿐이며, 결과를 얻기 위해서는 결과 `Deferred` 값을 사용해야 한다는 점을 강조하기 위해 "...Async" 접미사를 붙입니다.

> [GlobalScope]는 사소하지 않은 방식으로 역효과를 낼 수 있는 섬세한 API이며, 그 중 하나는 아래에서 설명될 것입니다. 따라서 `@OptIn(DelicateCoroutinesApi::class)`를 사용하여 `GlobalScope` 사용에 명시적으로 옵트인(opt-in)해야 합니다.
>
{style="note"}

```kotlin
// The result type of somethingUsefulOneAsync is Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

// The result type of somethingUsefulTwoAsync is Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}
```

이 `xxxAsync` 함수들은 _일시 중단 함수(suspending functions)_가 **아닙니다**. 이 함수들은 어디에서든 사용할 수 있습니다.
그러나 이 함수들을 사용하는 것은 항상 호출하는 코드와 해당 액션의 비동기(여기서는 _동시적_ 의미) 실행을 암시합니다.

다음 예제는 코루틴 외부에서의 사용법을 보여줍니다.

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

//sampleStart
// note that we don't have `runBlocking` to the right of `main` in this example
fun main() {
    val time = measureTimeMillis {
        // we can initiate async actions outside of a coroutine
        val one = somethingUsefulOneAsync()
        val two = somethingUsefulTwoAsync()
        // but waiting for a result must involve either suspending or blocking.
        // here we use `runBlocking { ... }` to block the main thread while waiting for the result
        runBlocking {
            println("The answer is ${one.await() + two.await()}")
        }
    }
    println("Completed in $time ms")
}
//sampleEnd

@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-04.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-04.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST ARBITRARY_TIME
The answer is 42
Completed in 1085 ms
-->

`val one = somethingUsefulOneAsync()` 줄과 `one.await()` 표현식 사이에 코드에 논리 오류가 있고, 프로그램이 예외를 throw하여 수행 중인 작업이 중단되는 경우 어떤 일이 발생하는지 생각해 보세요.
일반적으로 전역 오류 핸들러는 이 예외를 잡아서 개발자에게 오류를 기록하고 보고할 수 있지만, 프로그램은 다른 작업을 계속할 수 있습니다. 그러나 여기서는 작업을 시작한 프로그램이 중단되었음에도 불구하고 `somethingUsefulOneAsync`가 여전히 백그라운드에서 실행되고 있습니다.
이러한 문제는 아래 섹션에서 보여지는 것처럼 구조화된 동시성(structured concurrency)에서는 발생하지 않습니다.

## `async`를 사용한 구조화된 동시성

[async`를 사용한 동시 실행](#concurrent-using-async) 예제를 `doSomethingUsefulOne`과 `doSomethingUsefulTwo`를 동시에 실행하고 그 결합된 결과를 반환하는 함수로 리팩토링해 봅시다.
[async]는 [CoroutineScope] 확장 함수이므로, 필요한 스코프를 제공하기 위해 [coroutineScope][_coroutineScope] 함수를 사용할 것입니다.

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```

이러면 `concurrentSum` 함수 코드 내부에서 문제가 발생하여 예외가 throw되는 경우, 해당 스코프 내에서 시작된 모든 코루틴이 취소됩니다.

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        println("The answer is ${concurrentSum()}")
    }
    println("Completed in $time ms")
//sampleEnd    
}

suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // pretend we are doing something useful here
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // pretend we are doing something useful here, too
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-05.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-05.kt)에서 확인할 수 있습니다.
>
{style="note"}

위 `main` 함수의 출력에서 볼 수 있듯이, 두 작업은 여전히 동시에 실행됩니다.

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

취소는 항상 코루틴 계층 구조를 통해 전파됩니다.

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
    try {
        failedConcurrentSum()
    } catch(e: ArithmeticException) {
        println("Computation failed with ArithmeticException")
    }
}

suspend fun failedConcurrentSum(): Int = coroutineScope {
    val one = async<Int> { 
        try {
            delay(Long.MAX_VALUE) // Emulates very long computation
            42
        } finally {
            println("First child was cancelled")
        }
    }
    val two = async<Int> { 
        println("Second child throws an exception")
        throw ArithmeticException()
    }
    one.await() + two.await()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-compose-06.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-06.kt)에서 확인할 수 있습니다.
>
{style="note"}

첫 번째 `async`와 대기 중인 부모 모두 자식 중 하나(`two`)의 실패 시 어떻게 취소되는지 주목하세요.
```text
Second child throws an exception
First child was cancelled
Computation failed with ArithmeticException
```

<!--- TEST -->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Deferred]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/index.html
[CoroutineStart.LAZY]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-start/-l-a-z-y/index.html
[Deferred.await]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html
[Job.start]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/start.html
[GlobalScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html

<!--- END -->