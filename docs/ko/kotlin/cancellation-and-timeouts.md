<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 취소와 타임아웃)

취소를 사용하면 코루틴이 완료되기 전에 중단할 수 있습니다.
이는 사용자가 창을 닫거나 사용자 인터페이스에서 다른 페이지로 이동하여 더 이상 필요하지 않은 작업(예: 코루틴이 여전히 실행 중인 경우)을 중단합니다.
또한 조기에 리소스를 해제하고, 코루틴이 폐기된 객체에 접근하는 것을 막는 데 사용할 수 있습니다.

> 취소는 다른 코루틴이 더 이상 필요하지 않은 경우에도 값을 계속 생성하는 장시간 실행 코루틴을 중단하는 데 사용할 수 있습니다. 예를 들어, [파이프라인](channels.md#pipelines)에서 그러합니다.
>
{style="tip"}

취소는 코루틴의 생명주기와 부모-자식 관계를 나타내는 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 핸들을 통해 작동합니다.
`Job`을 사용하면 코루틴이 활성 상태인지 확인할 수 있으며, [구조화된 동시성](coroutines-basics.md#coroutine-scope-and-structured-concurrency)에 정의된 대로 해당 자식과 함께 취소할 수 있습니다.

## 코루틴 취소하기

코루틴은 `Job` 핸들에서 [`cancel()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html) 함수가 호출될 때 취소됩니다.
[코루틴 빌더 함수](coroutines-basics.md#coroutine-builder-functions)(예:
[`.launch()`](coroutines-basics.md#coroutinescope-launch))는 `Job`을 반환합니다.
[`.async()`](coroutines-basics.md#coroutinescope-async) 함수는 `Job`을 구현하고 동일한 취소 동작을 지원하는 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/)를 반환합니다.

`cancel()` 함수는 수동으로 호출할 수 있으며, 부모 코루틴이 취소될 때 취소 전파를 통해 자동으로 호출될 수도 있습니다.

코루틴이 취소되면, 다음 번 취소 검사 시 [`CancellationException`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/)을 던집니다.
언제 어떻게 이런 일이 발생하는지에 대한 자세한 내용은 [일시 중단 지점과 취소](#suspension-points-and-cancellation)를 참조하세요.

> 코루틴이 취소될 때까지 일시 중단하려면 [`awaitCancellation()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/await-cancellation.html) 함수를 사용할 수 있습니다.
>
{style="tip"}

다음은 코루틴을 수동으로 취소하는 예제입니다:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 코루틴이 실행되기 시작했음을 알리는 신호로 사용됩니다.
        val job1Started = CompletableDeferred<Unit>()
        
        val job1: Job = launch {
            
            println("The coroutine has started")

            // CompletableDeferred를 완료하여
            // 코루틴이 실행되기 시작했음을 알립니다.
            job1Started.complete(Unit)
            try {
                // 무한히 일시 중단됩니다.
                // 취소가 없으면 이 호출은 결코 반환되지 않습니다.
                delay(Duration.INFINITE)
            } catch (e: CancellationException) {
                println("The coroutine was canceled: $e")
              
                // 취소 예외는 항상 다시 던져야 합니다!
                throw e
            }
            println("This line will never be executed")
        }
      
        // job1을 취소하기 전에 job1이 시작될 때까지 기다립니다.
        job1Started.await()

        // 코루틴을 취소하므로 delay()는 CancellationException을 던집니다.
        job1.cancel()

        // async는 Job을 상속하는 Deferred 핸들을 반환합니다.
        val job2 = async {
                  // 코루틴 본문이 실행되기 전에 취소되면,
                  // 이 줄은 출력되지 않을 수 있습니다.
                  println("The second coroutine has started")

            try {
                // delay(Duration.INFINITE)와 동일합니다.
                // 이 코루틴이 취소될 때까지 일시 중단됩니다.
                awaitCancellation()

            } catch (e: CancellationException) {
                println("The second coroutine was canceled")
                throw e
            }
        }
        job2.cancel()
    }
    // withContext() 또는 coroutineScope()와 같은 코루틴 빌더는
    // 자식 코루틴이 취소된 경우에도 모든 자식 코루틴이 완료될 때까지 기다립니다.
    println("All coroutines have completed")
}
//sampleEnd
```
{kotlin-runnable="true" id="manual-cancellation-example"}

이 예제에서 [`CompletableDeferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-completable-deferred/)는 코루틴이 실행되기 시작했음을 알리는 신호로 사용됩니다.
코루틴은 실행을 시작할 때 `complete()`를 호출하고, `await()`는 `CompletableDeferred`가 완료된 후에만 반환됩니다. 이렇게 하면 취소가 코루틴이 실행을 시작한 후에만 발생합니다.
`.async()`로 생성된 코루틴은 이 검사를 하지 않으므로, 블록 내부의 코드를 실행하기 전에 취소될 수 있습니다.

> `CancellationException`을 catch하면 취소 전파를 방해할 수 있습니다.
> 반드시 catch해야 한다면, 코루틴 계층 구조를 통해 취소가 올바르게 전파되도록 다시 던지세요.
>
> 자세한 내용은 [코루틴 예외 처리](exception-handling.md#cancellation-and-exceptions)를 참조하세요.
>
{style="warning"}

### 취소 전파

[구조화된 동시성](coroutines-basics.md#coroutine-scope-and-structured-concurrency)은 코루틴을 취소하면 모든 자식 코루틴도 취소되도록 보장합니다.
이는 부모가 이미 중단된 후에도 자식 코루틴이 계속 작동하는 것을 방지합니다.

다음은 예제입니다:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 자식 코루틴이 시작되었음을 알리는 신호로 사용됩니다.
        val childrenLaunched = CompletableDeferred<Unit>()

        // 두 개의 자식 코루틴을 시작합니다.
        val parentJob = launch {
            launch {
                println("Child coroutine 1 has started running")
                try {
                    awaitCancellation()
                } finally {
                    println("Child coroutine 1 has been canceled")
                }
            }
            launch {
                println("Child coroutine 2 has started running")
                try {
                    awaitCancellation()
                } finally {
                    println("Child coroutine 2 has been canceled")
                }
            }
            // CompletableDeferred를 완료하여
            // 자식 코루틴이 시작되었음을 알립니다.
            childrenLaunched.complete(Unit)
        }
        // 부모 코루틴이 모든 자식을 시작했음을 알릴 때까지 기다립니다.
        childrenLaunched.await()

        // 부모 코루틴을 취소하면 모든 자식 코루틴이 취소됩니다.
        parentJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="cancellation-propagation-example"}

이 예제에서 각 자식 코루틴은 [`finally` 블록](exceptions.md#the-finally-block)을 사용하므로, 코루틴이 취소될 때 해당 코드 내부가 실행됩니다.
여기서 `CompletableDeferred`는 자식 코루틴이 취소되기 전에 시작되었음을 알리지만, 실행 시작을 보장하지는 않습니다. 먼저 취소되면 아무것도 출력되지 않습니다.

## 코루틴이 취소에 반응하도록 만들기 {id="cancellation-is-cooperative"}

Kotlin에서 코루틴 취소는 _협력적(cooperative)_입니다.
이는 코루틴이 [일시 중단](#suspension-points-and-cancellation)하거나 [명시적으로 취소를 검사](#check-for-cancellation-explicitly)하여 협력할 때만 취소에 반응한다는 의미입니다.

이 섹션에서는 취소 가능한 코루틴을 만드는 방법을 배울 수 있습니다.

### 일시 중단 지점과 취소

코루틴이 취소되면, 코드가 일시 중단될 수 있는 지점(일시 중단 지점이라고도 함)에 도달할 때까지 계속 실행됩니다.
코루틴이 그 지점에서 일시 중단되면, suspending 함수는 취소되었는지 확인합니다.
취소되었다면, 코루틴은 중단되고 `CancellationException`을 던집니다.

`suspend` 함수 호출은 일시 중단 지점이지만, 항상 일시 중단되는 것은 아닙니다.
예를 들어, `Deferred` 결과를 기다릴 때, 코루틴은 해당 `Deferred`가 아직 완료되지 않은 경우에만 일시 중단됩니다.

다음은 일시 중단되어 코루틴이 취소될 때 검사하고 중단할 수 있도록 하는 일반적인 suspending 함수를 사용하는 예제입니다:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.channels.Channel
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJobs = listOf(
            launch {
                // 취소될 때까지 일시 중단됩니다.
                awaitCancellation()
            },
            launch {
                // 취소될 때까지 일시 중단됩니다.
                delay(Duration.INFINITE)
            },
            launch {
                val channel = Channel<Int>()
                // 결코 전송되지 않는 값을 기다리면서 일시 중단됩니다.
                channel.receive()
            },
            launch {
                val deferred = CompletableDeferred<Int>()
                // 결코 완료되지 않는 값을 기다리면서 일시 중단됩니다.
                deferred.await()
            },
            launch {
                val mutex = Mutex(locked = true)
                // 무기한 잠겨 있는 뮤텍스를 기다리면서 일시 중단됩니다.
                mutex.lock()
            }
        )
        
        // 자식 코루틴이 시작되고 일시 중단될 시간을 줍니다.
        delay(100.milliseconds)
        
        // 모든 자식 코루틴을 취소합니다.
        childJobs.forEach { it.cancel() }
    }
    println("All child jobs completed!")
}
```
{kotlin-runnable="true" id="suspension-points-example"}

> `kotlinx.coroutines` 라이브러리의 모든 suspending 함수는 내부적으로 [`suspendCancellableCoroutine()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/suspend-cancellable-coroutine.html)을 사용하므로 취소와 협력합니다. 이 함수는 코루틴이 일시 중단될 때 취소를 검사합니다.
> 반면, [`suspendCoroutine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/suspend-coroutine.html)을 사용하는 사용자 정의 suspending 함수는 취소에 반응하지 않습니다.
>
{style="tip"}

### 명시적으로 취소 검사하기

코루틴이 오랫동안 [일시 중단](#suspension-points-and-cancellation)되지 않는 경우, 명시적으로 취소를 검사하지 않으면 취소될 때 중단되지 않습니다.

취소를 검사하려면 다음 API를 사용하세요:

*   [`isActive`](#isactive) 프로퍼티는 코루틴이 취소될 때 `false`입니다.
*   [`ensureActive()`](#ensureactive) 함수는 코루틴이 취소된 경우 즉시 `CancellationException`을 던집니다.
*   [`yield()`](#yield) 함수는 코루틴을 일시 중단하여 스레드를 해제하고 다른 코루틴이 해당 스레드에서 실행될 기회를 제공합니다. 코루틴을 일시 중단하면 취소를 검사하고 취소된 경우 `CancellationException`을 던질 수 있습니다.

이러한 API는 코루틴이 일시 중단 지점 사이에서 오랫동안 실행되거나 일시 중단 지점에서 일시 중단될 가능성이 낮은 경우에 유용합니다.

#### isActive

장시간 실행되는 계산에서 [`isActive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html) 프로퍼티를 사용하여 주기적으로 취소를 검사하세요.
이 프로퍼티는 코루틴이 더 이상 활성 상태가 아닐 때 `false`이며, 이를 사용하여 작업 계속이 더 이상 필요하지 않을 때 코루틴을 정상적으로 중단할 수 있습니다.

다음은 예제입니다:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds
import kotlin.random.Random

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val unsortedList = MutableList(10) { Random.nextInt() }
        
        // 장시간 실행되는 계산을 시작합니다.
        val listSortingJob = launch {
            var i = 0

            // 코루틴이 활성 상태인 동안 리스트를 반복적으로 정렬합니다.
            while (isActive) {
                unsortedList.sort()
                ++i
            }
            println(
                "Stopped sorting the list after $i iterations"
            )
        }
        // 100밀리초 동안 리스트를 정렬한 후, 충분히 정렬되었다고 간주합니다.
        delay(100.milliseconds)

        // 결과가 충분히 좋으면 정렬을 취소합니다.        
        listSortingJob.cancel()

        // 데이터 경쟁을 피하기 위해 공유 리스트에 접근하기 전에
        // 정렬 코루틴이 완료될 때까지 기다립니다.
        listSortingJob.join()
        println("The list is probably sorted: $unsortedList")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="isactive-example"}

이 예제에서 [`join()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html) 함수는 코루틴이 완료될 때까지 일시 중단됩니다. 이는 정렬 코루틴이 여전히 실행 중일 때 리스트에 접근하지 않도록 보장합니다.

> [`cancelAndJoin()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html) 함수를 사용하여 코루틴을 취소하고 단일 호출로 완료될 때까지 기다릴 수 있습니다.
>
{style="note"}

#### ensureActive()

[`ensureActive()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html) 함수를 사용하여 취소를 검사하고, 코루틴이 취소된 경우 `CancellationException`을 던져 현재 계산을 중지하세요.

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJob = launch {
            var start = 0
            try {
                while (true) {
                    ++start
                    // 현재 숫자에 대해 콜라츠 추측을 검사합니다.
                    var n = start
                    while (n != 1) {
                        // 코루틴이 취소되면 CancellationException을 던집니다.
                        ensureActive()
                        n = if (n % 2 == 0) n / 2 else 3 * n + 1
                    }
                }
            } finally {
                println("Checked the Collatz conjecture for 0..${start-1}")
            }
        }
        // 1초 동안 계산을 실행합니다.
        delay(100.milliseconds)

        // 코루틴을 취소합니다.
        childJob.cancel()
    }
}
```
{kotlin-runnable="true" id="ensurective-example"}

#### yield()

[`yield()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html) 함수는 코루틴을 일시 중단하고 다시 시작하기 전에 취소를 검사합니다.
일시 중단하지 않으면, 동일한 스레드의 코루틴은 순차적으로 실행됩니다.

다른 코루틴이 하나가 완료되기 전에 동일한 스레드 또는 스레드 풀에서 실행될 수 있도록 `yield`를 사용하세요:

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() {
    // runBlocking은 모든 코루틴 실행을 위해 현재 스레드를 사용합니다.
    runBlocking {
        val coroutineCount = 5
        repeat(coroutineCount) { coroutineIndex ->
            launch {
                val id = coroutineIndex + 1
                repeat(5) { iterationIndex ->
                    val iteration = iterationIndex + 1
                    // 다른 코루틴이 실행될 기회를 주기 위해 일시적으로 일시 중단합니다.
                    // 이것이 없으면 코루틴은 순차적으로 실행됩니다.
                    yield()
                    // 코루틴 인덱스와 반복 인덱스를 출력합니다.
                    println("$id * $iteration = ${id * iteration}")
                }
            }
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="yield-example"}

이 예제에서 각 코루틴은 `yield()`를 사용하여 다른 코루틴이 반복 사이에 실행되도록 합니다.

### 코루틴이 취소될 때 블로킹 코드 인터럽트하기

JVM에서 `Thread.sleep()` 또는 `BlockingQueue.take()`와 같은 일부 함수는 현재 스레드를 블로킹할 수 있습니다.
이러한 블로킹 함수는 인터럽트될 수 있으며, 이는 함수를 조기에 중단시킵니다.
그러나 코루틴에서 이 함수들을 호출할 때 취소는 스레드를 인터럽트하지 않습니다.

코루틴을 취소할 때 스레드를 인터럽트하려면 [`runInterruptible()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-interruptible.html) 함수를 사용하세요.

```kotlin
import kotlinx.coroutines.*

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val childStarted = CompletableDeferred<Unit>()
        val childJob = launch {
            try {
                // 취소는 스레드 인터럽트를 트리거합니다.
                runInterruptible {
                    childStarted.complete(Unit)
                    try {
                        // 현재 스레드를 매우 오랫동안 블로킹합니다.
                        Thread.sleep(Long.MAX_VALUE)
                    } catch (e: InterruptedException) {
                        println("Thread interrupted (Java): $e")
                        throw e
                    }
                }
            } catch (e: CancellationException) {
                println("Coroutine canceled (Kotlin): $e")
                throw e
            }
        }
        childStarted.await()

        // 코루틴을 취소하고 Thread.sleep()을 실행하여 스레드를 인터럽트합니다.
        childJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="interrupt-cancellation-example"}

## 코루틴 취소 시 값을 안전하게 처리하기

일시 중단된 코루틴이 취소되면, 값들이 이미 사용 가능하더라도 어떤 값도 반환하지 않고 `CancellationException`으로 재개됩니다.
이러한 동작을 _즉각적인 취소(prompt cancellation)_라고 합니다.
이는 취소된 코루틴의 스코프 내에서 코드가 계속 실행되는 것을 방지합니다(예: 이미 닫힌 화면 업데이트).

다음은 예제입니다:

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// UI 스레드를 사용하는 코루틴 스코프를 정의합니다.
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            val contents = withContext(Dispatchers.IO) {
                Files.newBufferedReader(
                    path, Charset.forName("US-ASCII")
                ).use {
                    it.readLines()
                }
            }
            // 여기서 updateUi를 호출하는 것은 안전합니다.
            // 취소의 경우, withContext()는 어떤 값도 반환하지 않습니다.
            updateUi(contents)
        }
    }

    // 사용자가 화면을 떠난 후 호출되면 예외를 던집니다.
    private fun updateUi(contents: List<String>) {
      contents.forEach { line -> addOneLineToUi(line) }
    }
  
    private fun addOneLineToUi(line: String) {
        // UI에 한 줄을 추가하는 코드의 플레이스홀더입니다.
    }

    // UI 스레드에서만 호출 가능합니다.
    fun leaveScreen() {
        // 화면을 떠날 때 스코프를 취소합니다.
        // 더 이상 UI를 업데이트할 수 없습니다.
        scope.cancel()
    }
}
```

이 예제에서 `withContext(Dispatchers.IO)`는 취소와 협력하여 `leaveScreen()` 함수가 파일 내용을 반환하기 전에 코루틴을 취소하면 `updateUI()`가 실행되는 것을 방지합니다.

즉각적인 취소는 값이 더 이상 유효하지 않은 후에도 값을 사용하는 것을 막지만, 중요한 값이 여전히 사용 중일 때 코드를 중단시켜 해당 값을 잃을 수도 있습니다.
이것은 코루틴이 `AutoCloseable` 리소스와 같은 값을 수신했지만, 이를 닫는 코드 부분에 도달하기 전에 취소될 때 발생할 수 있습니다.
이를 방지하려면, 값을 수신하는 코루틴이 취소되더라도 실행이 보장되는 위치에 정리 로직을 유지하세요.

다음은 예제입니다:

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// scope는 UI 스레드를 사용하는 코루틴 스코프입니다.
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            // finally 블록에서 닫을 수 있도록 reader를 변수에 저장합니다.
            var reader: BufferedReader? = null
            
            try {
                withContext(Dispatchers.IO) {
                    reader = Files.newBufferedReader(
                        path, Charset.forName("US-ASCII")
                    )
                }
                // withContext() 완료 후 저장된 reader를 사용합니다.
                updateUi(reader!!)
            } finally {
                // 코루틴이 취소되더라도 reader가 닫히도록 보장합니다.
                reader?.close()
            }
        }
    }

    private suspend fun updateUi(reader: BufferedReader) {
        // 파일 내용을 표시합니다.
        while (true) {
            val line = withContext(Dispatchers.IO) {
                reader.readLine()
            }
            if (line == null)
                break
            addOneLineToUi(line)
        }
    }

    private fun addOneLineToUi(line: String) {
        // UI에 한 줄을 추가하는 코드의 플레이스홀더입니다.
    }

    // UI 스레드에서만 호출 가능합니다.
    fun leaveScreen() {
        // 화면을 떠날 때 스코프를 취소합니다.
        // 더 이상 UI를 업데이트할 수 없습니다.
        scope.cancel()
    }
}
```

이 예제에서는 `BufferedReader`를 변수에 저장하고 `finally` 블록에서 닫아, 코루틴이 취소되더라도 리소스가 해제되도록 보장합니다.

### 취소 불가능 블록 실행

코루틴의 특정 부분이 취소에 영향을 받지 않도록 할 수 있습니다.
이렇게 하려면 `withContext()` 코루틴 빌더 함수에 [`NonCancellable`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/)을 인수로 전달하세요.

> `.launch()` 또는 `.async()`와 같은 다른 코루틴 빌더와 `NonCancellable`을 사용하는 것을 피하세요. 그렇게 하면 부모-자식 관계가 깨져 구조화된 동시성을 방해합니다.
>
{style="warning"}

`NonCancellable`은 suspending `close()` 함수로 리소스를 닫는 것과 같이 특정 작업이 코루틴이 완료되기 전에 취소되더라도 완료되도록 해야 할 때 유용합니다.

다음은 예제입니다:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

//sampleStart
val serviceStarted = CompletableDeferred<Unit>()

fun startService() {
    println("Starting the service...")
    serviceStarted.complete(Unit)
}

suspend fun shutdownServiceAndWait() {
    println("Shutting down...")
    delay(100.milliseconds)
    println("Successfully shut down!")
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJob = launch {
            startService()
            try {
                awaitCancellation()
            } finally {
                withContext(NonCancellable) {
                    // withContext(NonCancellable)이 없으면,
                    // 코루틴이 취소되었기 때문에 이 함수는 완료되지 않습니다.
                    shutdownServiceAndWait()
                }
            }
        }
        serviceStarted.await()
        childJob.cancel()
    }
    println("Exiting the program")
}
//sampleEnd
```
{kotlin-runnable="true" id="noncancellable-blocks-example"}

## 타임아웃

타임아웃을 사용하면 지정된 기간 후에 코루틴을 자동으로 취소할 수 있습니다.
이는 너무 오래 걸리는 작업을 중지하여 애플리케이션의 반응성을 유지하고 불필요하게 스레드를 블로킹하는 것을 방지하는 데 유용합니다.

타임아웃을 지정하려면 `Duration`과 함께 [`withTimeoutOrNull()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html) 함수를 사용하세요.

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

//sampleStart
suspend fun slowOperation(): Int {
    try {
        delay(300.milliseconds)
        return 5
    } catch (e: CancellationException) {
        println("The slow operation has been canceled: $e")
        throw e
    }
}

suspend fun fastOperation(): Int {
    try {
        delay(15.milliseconds)
        return 14
    } catch (e: CancellationException) {
        println("The fast operation has been canceled: $e")
        throw e
    }
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        val slow = withTimeoutOrNull(100.milliseconds) {
            slowOperation()
        }
        println("The slow operation finished with $slow")
        val fast = withTimeoutOrNull(100.milliseconds) {
            fastOperation()
        }
        println("The fast operation finished with $fast")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="timeout-example"}

타임아웃이 지정된 `Duration`을 초과하면 `withTimeoutOrNull()`은 `null`을 반환합니다.