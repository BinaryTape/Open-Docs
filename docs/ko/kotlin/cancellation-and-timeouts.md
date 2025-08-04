<!--- TEST_NAME CancellationGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 취소와 타임아웃)

이 섹션에서는 코루틴 취소 및 타임아웃에 대해 다룹니다.

## 코루틴 실행 취소하기

장시간 실행되는 애플리케이션에서는 백그라운드 코루틴에 대한 세밀한 제어가 필요할 수 있습니다.
예를 들어, 사용자가 코루틴을 시작한 페이지를 닫아서 더 이상 결과가 필요하지 않고 해당 작업을 취소할 수 있는 경우가 있습니다.
`launch` 함수는 실행 중인 코루틴을 취소하는 데 사용할 수 있는 `Job`을 반환합니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        repeat(1000) { i ->
            println("job: I'm sleeping $i ...")
            delay(500L)
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancel() // cancels the job
    job.join() // waits for job's completion 
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-01.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-01.kt)에서 확인할 수 있습니다.
>
{style="note"}

다음 출력을 생성합니다:

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
```

<!--- TEST -->

`main`이 `job.cancel`을 호출하자마자 다른 코루틴에서 출력이 나타나지 않습니다. 이는 해당 코루틴이 취소되었기 때문입니다.
`cancel`과 `join` 호출을 결합하는 `Job` 확장 함수 `cancelAndJoin`도 있습니다.

## 취소는 협력적입니다

코루틴 취소는 _협력적(cooperative)_입니다. 코루틴 코드는 취소 가능(cancellable)하려면 협력해야 합니다.
`kotlinx.coroutines`의 모든 `suspending` 함수는 _취소 가능(cancellable)_합니다.
이 함수들은 코루틴 취소를 확인하고 취소될 때 `CancellationException`을 던집니다.
그러나 코루틴이 계산 작업을 수행 중이고 취소를 확인하지 않으면, 다음 예제에서 보여주듯이 취소될 수 없습니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        var nextPrintTime = startTime
        var i = 0
        while (i < 5) { // computation loop, just wastes CPU
            // print a message twice a second
            if (System.currentTimeMillis() >= nextPrintTime) {
                println("job: I'm sleeping ${i++} ...")
                nextPrintTime += 500L
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-02.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-02.kt)에서 확인할 수 있습니다.
>
{style="note"}

실행해보면 취소 후에도 작업이 다섯 번의 반복 후에 스스로 완료될 때까지 "I'm sleeping"이 계속 출력되는 것을 볼 수 있습니다.

<!--- TEST 
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm sleeping 3 ...
job: I'm sleeping 4 ...
main: Now I can quit.
-->

`CancellationException`을 잡고 다시 던지지 않음으로써 동일한 문제를 관찰할 수 있습니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch(Dispatchers.Default) {
        repeat(5) { i ->
            try {
                // print a message twice a second
                println("job: I'm sleeping $i ...")
                delay(500)
            } catch (e: Exception) {
                // log the exception
                println(e)
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-03.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-03.kt)에서 확인할 수 있습니다.
>
{style="note"}

`Exception`을 잡는 것은 안티 패턴이지만, 이 문제는 `CancellationException`을 다시 던지지 않는 [`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html) 함수를 사용할 때와 같이 더 미묘한 방식으로 나타날 수 있습니다.

## 계산 코드를 취소 가능하게 만들기

계산 코드를 취소 가능하게 만드는 두 가지 접근 방식이 있습니다.
첫 번째는 취소를 확인하는 `suspending` 함수를 주기적으로 호출하는 것입니다.
이를 위한 훌륭한 선택으로는 `yield` 및 `ensureActive` 함수가 있습니다.
다른 하나는 `isActive`를 사용하여 취소 상태를 명시적으로 확인하는 것입니다.
후자의 접근 방식을 시도해 보겠습니다.

이전 예제의 `while (i < 5)`를 `while (isActive)`로 바꾸고 다시 실행해 보세요.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        var nextPrintTime = startTime
        var i = 0
        while (isActive) { // cancellable computation loop
            // prints a message twice a second
            if (System.currentTimeMillis() >= nextPrintTime) {
                println("job: I'm sleeping ${i++} ...")
                nextPrintTime += 500L
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-04.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-04.kt)에서 확인할 수 있습니다.
>
{style="note"}

보시다시피, 이제 이 루프는 취소됩니다. `isActive`는 `CoroutineScope` 객체를 통해 코루틴 내부에서 사용할 수 있는 확장 프로퍼티입니다.

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
-->

## finally를 사용하여 리소스 닫기

취소 가능한 `suspending` 함수는 취소 시 `CancellationException`을 던지며, 이는 일반적인 방식으로 처리할 수 있습니다.
예를 들어, `try {...} finally {...}` 표현식과 Kotlin의 [`use`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io/use.html) 함수는 코루틴이 취소될 때도 정상적으로 최종화 작업을 실행합니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job: I'm sleeping $i ...")
                delay(500L)
            }
        } finally {
            println("job: I'm running finally")
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-05.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-05.kt)에서 확인할 수 있습니다.
>
{style="note"}

`join`과 `cancelAndJoin`은 모두 모든 최종화 작업이 완료될 때까지 기다리므로, 위 예제는 다음 출력을 생성합니다.

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm running finally
main: Now I can quit.
```

<!--- TEST -->

## 취소 불가능 블록 실행

이전 예제의 `finally` 블록에서 `suspending` 함수를 사용하려고 시도하면 해당 코드를 실행하는 코루틴이 취소되었기 때문에 `CancellationException`이 발생합니다. 일반적으로 잘 동작하는 모든 닫기 작업(파일 닫기, 작업 취소 또는 모든 종류의 통신 채널 닫기)은 보통 논블로킹이며 어떤 `suspending` 함수도 포함하지 않으므로, 이는 문제가 되지 않습니다. 그러나 취소된 코루틴 내에서 `suspend`해야 하는 드문 경우에는 다음 예제에서 보여주듯이 `withContext` 함수와 `NonCancellable` 컨텍스트를 사용하여 해당 코드를 `withContext(NonCancellable) {...}`로 감쌀 수 있습니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job: I'm sleeping $i ...")
                delay(500L)
            }
        } finally {
            withContext(NonCancellable) {
                println("job: I'm running finally")
                delay(1000L)
                println("job: And I've just delayed for 1 sec because I'm non-cancellable")
            }
        }
    }
    delay(1300L) // delay a bit
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // cancels the job and waits for its completion
    println("main: Now I can quit.")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-06.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-06.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm running finally
job: And I've just delayed for 1 sec because I'm non-cancellable
main: Now I can quit.
-->

## 타임아웃

코루틴 실행을 취소하는 가장 명백하고 실용적인 이유는 실행 시간이 특정 타임아웃을 초과했기 때문입니다.
해당 `Job`에 대한 참조를 수동으로 추적하고 지연 후 추적된 코루틴을 취소하기 위해 별도의 코루틴을 시작할 수도 있지만, 이를 수행하는 `withTimeout` 함수가 이미 준비되어 있습니다.
다음 예제를 살펴보세요.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    withTimeout(1300L) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500L)
        }
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-07.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-07.kt)에서 확인할 수 있습니다.
>
{style="note"}

다음 출력을 생성합니다:

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Exception in thread "main" kotlinx.coroutines.TimeoutCancellationException: Timed out waiting for 1300 ms
```

<!--- TEST STARTS_WITH -->

`withTimeout`이 던지는 `TimeoutCancellationException`은 `CancellationException`의 하위 클래스입니다.
이전에 콘솔에 스택 트레이스가 출력되는 것을 보지 못했습니다. 이는 취소된 코루틴 내부에서 `CancellationException`이 코루틴 완료의 일반적인 이유로 간주되기 때문입니다.
그러나 이 예제에서는 `main` 함수 내부에서 `withTimeout`을 바로 사용했습니다.

취소는 단순히 예외일 뿐이므로, 모든 리소스는 평소와 같이 닫힙니다.
특정 타임아웃 발생 시 추가 작업을 수행해야 하는 경우 `try {...} catch (e: TimeoutCancellationException) {...}` 블록으로 타임아웃 코드를 감싸거나, `withTimeout`과 유사하지만 예외를 던지는 대신 타임아웃 시 `null`을 반환하는 `withTimeoutOrNull` 함수를 사용할 수 있습니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val result = withTimeoutOrNull(1300L) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500L)
        }
        "Done" // will get cancelled before it produces this result
    }
    println("Result is $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-08.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-08.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드를 실행하면 더 이상 예외가 발생하지 않습니다.

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Result is null
```

<!--- TEST -->

## 비동기 타임아웃과 리소스

<!-- 
  NOTE: Don't change this section name. It is being referenced to from within KDoc of withTimeout functions.
-->

`withTimeout`의 타임아웃 이벤트는 해당 블록에서 실행되는 코드에 대해 비동기적이며, 타임아웃 블록 내부에서 반환되기 직전까지 언제든지 발생할 수 있습니다.
블록 내부에서 리소스를 열거나 획득하고 이 리소스가 블록 외부에서 닫히거나 해제되어야 하는 경우 이 점을 명심하십시오.

예를 들어, 여기서는 `Resource` 클래스를 사용하여 닫을 수 있는 리소스를 모방합니다. 이 클래스는 `acquired` 카운터를 증가시켜 생성된 횟수를 추적하고 `close` 함수에서 카운터를 감소시킵니다.
이제 많은 코루틴을 생성해 보겠습니다. 각 코루틴은 `withTimeout` 블록의 끝에서 `Resource`를 생성하고 블록 외부에서 리소스를 해제합니다.
작은 지연을 추가하여 `withTimeout` 블록이 이미 완료된 바로 그 시점에 타임아웃이 발생할 가능성을 높이고, 이는 리소스 누수를 유발할 것입니다.

```kotlin
import kotlinx.coroutines.*

//sampleStart
var acquired = 0

class Resource {
    init { acquired++ } // Acquire the resource
    fun close() { acquired-- } // Release the resource
}

fun main() {
    runBlocking {
        repeat(10_000) { // Launch 10K coroutines
            launch { 
                val resource = withTimeout(60) { // Timeout of 60 ms
                    delay(50) // Delay for 50 ms
                    Resource() // Acquire a resource and return it from withTimeout block     
                }
                resource.close() // Release the resource
            }
        }
    }
    // Outside of runBlocking all coroutines have completed
    println(acquired) // Print the number of resources still acquired
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-09.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-09.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- CLEAR -->

위 코드를 실행하면 항상 0이 출력되지 않는 것을 볼 수 있습니다. 이는 시스템 타이밍에 따라 달라질 수 있습니다.
이 예제에서 0이 아닌 값을 실제로 보려면 타임아웃을 조정해야 할 수도 있습니다.

> 1만 개의 코루틴에서 `acquired` 카운터를 증가 및 감소시키는 것은 항상 `runBlocking`에 사용되는 동일한 스레드에서 발생하므로 완전히 스레드 안전(thread-safe)합니다.
> 이에 대한 자세한 내용은 코루틴 컨텍스트 챕터에서 설명됩니다.
>
{style="note"}

이 문제를 해결하려면 `withTimeout` 블록에서 리소스를 반환하는 대신 변수에 리소스 참조를 저장할 수 있습니다.

```kotlin
import kotlinx.coroutines.*

var acquired = 0

class Resource {
    init { acquired++ } // Acquire the resource
    fun close() { acquired-- } // Release the resource
}

fun main() {
//sampleStart
    runBlocking {
        repeat(10_000) { // Launch 10K coroutines
            launch { 
                var resource: Resource? = null // Not acquired yet
                try {
                    withTimeout(60) { // Timeout of 60 ms
                        delay(50) // Delay for 50 ms
                        resource = Resource() // Store a resource to the variable if acquired      
                    }
                    // We can do something else with the resource here
                } finally {  
                    resource?.close() // Release the resource if it was acquired
                }
            }
        }
    }
    // Outside of runBlocking all coroutines have completed
    println(acquired) // Print the number of resources still acquired
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-10.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-10.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 예제는 항상 0을 출력합니다. 리소스가 누수되지 않습니다.

<!--- TEST 
0
-->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[cancelAndJoin]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[Job.join]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[CancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html
[yield]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html
[ensureActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html
[isActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[NonCancellable]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/index.html
[withTimeout]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout.html
[TimeoutCancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-timeout-cancellation-exception/index.html
[withTimeoutOrNull]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html

<!--- END -->