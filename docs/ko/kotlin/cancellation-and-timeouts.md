<!--- TEST_NAME CancellationGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 코루틴 취소 및 타임아웃)

이 섹션에서는 코루틴 취소 및 타임아웃에 대해 다룹니다.

## 코루틴 실행 취소하기

장기 실행 애플리케이션에서는 백그라운드 코루틴에 대한 세밀한 제어가 필요할 수 있습니다. 예를 들어, 사용자가 코루틴을 시작한 페이지를 닫아서 더 이상 결과가 필요하지 않거나 해당 작업을 취소할 수 있습니다. `[launch]` 함수는 실행 중인 코루틴을 취소하는 데 사용할 수 있는 `[Job]`을 반환합니다.

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

이 코드는 다음 출력을 생성합니다:

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
```

<!--- TEST -->

`main` 함수가 `job.cancel`을 호출하자마자, 해당 코루틴이 취소되었기 때문에 다른 코루틴의 출력을 더 이상 볼 수 없습니다. 또한 `[Job.cancel]`과 `[Job.join]` 호출을 결합하는 `[Job]` 확장 함수 `[cancelAndJoin]`도 있습니다.

## 취소는 협력적입니다

코루틴 취소는 _협력적_입니다. 코루틴 코드가 취소되려면 협력해야 합니다. `kotlinx.coroutines`의 모든 중단 함수는 _취소 가능_합니다. 이 함수들은 코루틴 취소 여부를 확인하고, 취소되면 `[CancellationException]`을 발생시킵니다. 하지만 코루틴이 계산 작업을 수행 중이며 취소 여부를 확인하지 않는다면, 다음 예시처럼 취소될 수 없습니다.

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

이 코드를 실행해보면, 취소된 후에도 해당 작업이 다섯 번 반복 후 스스로 완료될 때까지 "I'm sleeping"을 계속 출력하는 것을 볼 수 있습니다.

<!--- TEST 
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm sleeping 3 ...
job: I'm sleeping 4 ...
main: Now I can quit.
-->

`[CancellationException]`을 catch하고 다시 throw하지 않으면 동일한 문제가 관찰될 수 있습니다.

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

`Exception`을 catch하는 것은 안티 패턴이지만, 이 문제는 `[CancellationException]`을 다시 throw하지 않는 [`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html) 함수를 사용할 때처럼 더 미묘한 방식으로 나타날 수 있습니다.

## 계산 코드를 취소 가능하게 만들기

계산 코드를 취소 가능하게 만드는 두 가지 접근 방식이 있습니다. 첫 번째는 취소 여부를 확인하는 중단 함수를 주기적으로 호출하는 것입니다. 이 목적에 훌륭한 선택인 `[yield]` 및 `[ensureActive]` 함수가 있습니다. 다른 하나는 `[isActive]`를 사용하여 취소 상태를 명시적으로 확인하는 것입니다. 후자의 접근 방식을 시도해 봅시다.

이전 예제의 `while (i < 5)`를 `while (isActive)`로 바꾼 후 다시 실행하십시오.

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

보시다시피, 이제 이 루프는 취소됩니다. `[isActive]`는 `[CoroutineScope]` 객체를 통해 코루틴 내부에서 사용 가능한 확장 프로퍼티입니다.

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
-->

## `finally`로 리소스 닫기

취소 가능한 중단 함수는 취소 시 `[CancellationException]`을 발생시키며, 이는 일반적인 방식으로 처리할 수 있습니다. 예를 들어, `try {...} finally {...}` 표현식과 Kotlin의 [`use`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io/use.html) 함수는 코루틴이 취소될 때 최종화 작업을 정상적으로 실행합니다.

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

`[Job.join]`과 `[cancelAndJoin]` 모두 모든 최종화 작업이 완료될 때까지 기다리므로, 위 예제는 다음 출력을 생성합니다.

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

이전 예제의 `finally` 블록에서 중단 함수를 사용하려는 모든 시도는 `[CancellationException]`을 발생시킵니다. 이는 이 코드를 실행하는 코루틴이 취소되었기 때문입니다. 일반적으로 이것은 문제가 되지 않습니다. 모든 올바른 종료 작업(파일 닫기, 작업 취소 또는 모든 종류의 통신 채널 닫기)은 일반적으로 비차단이며 중단 함수를 포함하지 않기 때문입니다. 하지만 드물게 취소된 코루틴에서 중단해야 하는 경우, 다음 예시가 보여주듯이 `[withContext]` 함수와 `[NonCancellable]` 컨텍스트를 사용하여 해당 코드를 `withContext(NonCancellable) {...}`로 감쌀 수 있습니다.

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

코루틴 실행을 취소하는 가장 명확한 실제적인 이유는 실행 시간이 특정 타임아웃을 초과했기 때문입니다. 해당 `[Job]`에 대한 참조를 수동으로 추적하고 지연 후 추적된 코루틴을 취소하기 위해 별도의 코루틴을 시작할 수도 있지만, 이를 수행하는 `[withTimeout]` 함수가 이미 준비되어 있습니다. 다음 예제를 살펴보세요.

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

이 코드는 다음 출력을 생성합니다:

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Exception in thread "main" kotlinx.coroutines.TimeoutCancellationException: Timed out waiting for 1300 ms
```

<!--- TEST STARTS_WITH -->

`[withTimeout]`에 의해 발생되는 `[TimeoutCancellationException]`은 `[CancellationException]`의 서브클래스입니다. 우리는 이전에 콘솔에 해당 스택 트레이스가 출력되는 것을 보지 못했습니다. 이는 취소된 코루틴 내부에서 `CancellationException`이 코루틴 완료의 정상적인 이유로 간주되기 때문입니다. 하지만 이 예제에서는 `main` 함수 바로 안에서 `withTimeout`을 사용했습니다.

취소는 단지 예외일 뿐이므로, 모든 리소스는 일반적인 방식으로 닫힙니다. 특정 종류의 타임아웃 시 추가 작업을 수행해야 하는 경우, 타임아웃이 있는 코드를 `try {...} catch (e: TimeoutCancellationException) {...}` 블록으로 감싸거나, `[withTimeout]`과 유사하지만 예외를 throw하는 대신 타임아웃 시 `null`을 반환하는 `[withTimeoutOrNull]` 함수를 사용할 수 있습니다.

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

이 코드를 실행할 때 더 이상 예외가 발생하지 않습니다.

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Result is null
```

<!--- TEST -->

## 비동기 타임아웃 및 리소스

<!-- 
  NOTE: Don't change this section name. It is being referenced to from within KDoc of withTimeout functions.
-->

`[withTimeout]`의 타임아웃 이벤트는 해당 블록에서 실행되는 코드에 대해 비동기적이며, 타임아웃 블록 내부에서 반환하기 직전에도 언제든지 발생할 수 있습니다. 블록 내부에서 열거나 획득한 리소스를 블록 외부에서 닫거나 해제해야 하는 경우 이 점을 명심하십시오.

예를 들어, 여기서 우리는 `Resource` 클래스를 사용하여 닫을 수 있는 리소스를 모방합니다. 이 클래스는 `acquired` 카운터를 증가시켜 생성된 횟수를 추적하고 `close` 함수에서 카운터를 감소시킵니다. 이제 많은 코루틴을 생성해 봅시다. 각 코루틴은 `withTimeout` 블록의 끝에서 `Resource`를 생성하고 블록 외부에서 리소스를 해제합니다. `withTimeout` 블록이 이미 끝났을 때 타임아웃이 발생할 가능성을 높이기 위해 작은 지연을 추가했는데, 이는 리소스 누수를 유발할 것입니다.

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

위 코드를 실행하면, 머신의 타이밍에 따라 달라질 수 있지만 항상 0을 출력하지 않는 것을 볼 수 있습니다. 실제로 0이 아닌 값을 보려면 이 예제의 타임아웃을 조정해야 할 수도 있습니다.

> 참고로, 여기서 1만 개의 코루틴에서 `acquired` 카운터를 증가/감소시키는 것은 `runBlocking`이 사용하는 동일한 스레드에서 항상 발생하므로 완전히 스레드 안전합니다. 이에 대한 자세한 내용은 코루틴 컨텍스트 챕터에서 설명할 것입니다.
>
{style="note"}

이 문제를 해결하려면 `withTimeout` 블록에서 리소스를 반환하는 대신 변수에 리소스에 대한 참조를 저장할 수 있습니다.

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

이 예제는 항상 0을 출력합니다. 리소스는 누수되지 않습니다.

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