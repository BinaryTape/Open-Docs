<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 취소와 타임아웃)

취소(Cancellation)를 사용하면 코루틴이 완료되기 전에 실행을 중단할 수 있습니다.
사용자가 창을 닫거나 사용자 인터페이스에서 다른 화면으로 이동하는 등 코루틴이 여전히 실행 중이지만 더 이상 필요하지 않은 작업을 중단할 때 유용합니다.
또한 리소스를 조기에 해제하거나, 코루틴이 폐기된 객체에 접근하는 것을 방지하기 위해 사용할 수도 있습니다.

> [파이프라인(pipelines)](channels.md#pipelines)과 같이 다른 코루틴에서 더 이상 필요하지 않음에도 계속해서 값을 생성하는 오래 실행되는 코루틴을 중단하기 위해 취소를 사용할 수 있습니다.
>
{style="tip"}

취소는 코루틴의 생명주기와 부모-자식 관계를 나타내는 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 핸들을 통해 작동합니다.
`Job`을 사용하면 코루틴이 활성 상태인지 확인하고, [구조화된 동시성(structured concurrency)](coroutines-basics.md#coroutine-scope-and-structured-concurrency)에 정의된 대로 해당 코루틴과 그 자식 코루틴들을 취소할 수 있습니다.

## 코루틴 취소 {id="cancel-coroutines"}

코루틴은 `Job` 핸들에서 [`cancel()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html) 함수가 호출될 때 취소됩니다.
[`.launch()`](coroutines-basics.md#coroutinescope-launch)와 같은 [코루틴 빌더 함수](coroutines-basics.md#coroutine-builder-functions)는 `Job`을 반환합니다. [`.async()`](coroutines-basics.md#coroutinescope-async) 함수는 `Job`을 구현하고 동일한 취소 동작을 지원하는 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/)를 반환합니다.

`cancel()` 함수를 직접 호출할 수도 있고, 부모 코루틴이 취소될 때 취소 전파(cancellation propagation)를 통해 자동으로 호출될 수도 있습니다.

코루틴이 취소되면 다음 번에 취소 여부를 확인할 때 [`CancellationException`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/)을 던집니다.
이것이 어떻게 그리고 언제 발생하는지에 대한 자세한 내용은 [중단 지점과 취소](#suspension-points-and-cancellation)를 참조하세요.

> [`awaitCancellation()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/await-cancellation.html) 함수를 사용하여 코루틴이 취소될 때까지 중단시킬 수 있습니다.
>
{style="tip"}

다음은 코루틴을 수동으로 취소하는 예제입니다:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 코루틴이 실행을 시작했음을 알리는 신호로 사용됨
        val job1Started = CompletableDeferred<Unit>()
        
        val job1: Job = launch {
            
            println("The coroutine has started")

            // CompletableDeferred를 완료하여
            // 코루틴이 실행을 시작했음을 알림
            job1Started.complete(Unit)
            try {
                // 무기한 중단
                // 취소가 없다면 이 호출은 절대 반환되지 않음
                delay(Duration.INFINITE)
            } catch (e: CancellationException) {
                println("The coroutine was canceled: $e")
              
                // 항상 취소 예외를 다시 던지세요!
                throw e
            }
            println("This line will never be executed")
        }
      
        // job1이 취소되기 전에 시작될 때까지 대기
        job1Started.await()

        // 코루틴을 취소하므로 delay()가 CancellationException을 던짐
        job1.cancel()

        // async는 Job을 상속받는 Deferred 핸들을 반환함
        val job2 = async {
            // 코루틴 본문이 실행되기 전에 취소되면
            // 이 라인은 출력되지 않을 수 있음
            println("The second coroutine has started")

            try {
                // delay(Duration.INFINITE)와 동일
                // 이 코루틴이 취소될 때까지 중단됨
                awaitCancellation()

            } catch (e: CancellationException) {
                println("The second coroutine was canceled")
                throw e
            }
        }
        job2.cancel()
    }
    // withContext()나 coroutineScope()와 같은 코루틴 빌더는
    // 자식 코루틴이 취소되더라도 
    // 모든 자식 코루틴이 완료될 때까지 기다림
    println("All coroutines have completed")
}
//sampleEnd
```
{kotlin-runnable="true" id="manual-cancellation-example"}

이 예제에서 [`CompletableDeferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-completable-deferred/)는 코루틴이 실행을 시작했다는 신호로 사용됩니다.
코루틴은 실행을 시작할 때 `complete()`를 호출하고, `await()`는 해당 `CompletableDeferred`가 완료된 후에만 반환됩니다. 이렇게 하면 코루틴이 실행을 시작한 후에만 취소가 발생합니다.
`.async()`로 생성된 코루틴은 이러한 확인 절차가 없으므로, 블록 내부의 코드를 실행하기 전에 취소될 수 있습니다.

> `CancellationException`을 캐치하면 취소 전파가 중단될 수 있습니다.
> 만약 이를 캐치해야 한다면, 취소가 코루틴 계층 구조를 통해 올바르게 전파될 수 있도록 다시 던지(rethrow)세요.
>
> 자세한 내용은 [코루틴 예외 처리](exception-handling.md#cancellation-and-exceptions)를 참조하세요.
>
{style="warning"}

### 취소 전파 {id="cancellation-propagation"}

[구조화된 동시성](coroutines-basics.md#coroutine-scope-and-structured-concurrency)은 코루틴을 취소하면 모든 자식 코루틴도 취소되도록 보장합니다.
이를 통해 부모가 이미 중단된 후에도 자식 코루틴이 계속 작업하는 것을 방지합니다.

다음은 그 예제입니다:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 자식 코루틴들이 실행되었음을 알리는 신호로 사용됨
        val childrenLaunched = CompletableDeferred<Unit>()

        // 두 개의 자식 코루틴을 실행
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
            // 자식 코루틴들이 실행되었음을 알림
            childrenLaunched.complete(Unit)
        }
        // 부모 코루틴이 모든 자식을 실행했다는
        // 신호를 보낼 때까지 대기
        childrenLaunched.await()

        // 부모 코루틴을 취소하면 모든 자식 코루틴이 취소됨
        parentJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="cancellation-propagation-example"}

이 예제에서 각 자식 코루틴은 [`finally` 블록](exceptions.md#the-finally-block)을 사용하므로 코루틴이 취소될 때 블록 내부의 코드가 실행됩니다.
여기서 `CompletableDeferred`는 자식 코루틴들이 취소되기 전에 실행되었음을 알리지만, 실행이 시작되었음을 보장하지는 않습니다. 만약 실행 전에 취소된다면 아무것도 출력되지 않습니다.

## 코루틴이 취소에 반응하도록 만들기 {id="cancellation-is-cooperative"}

Kotlin에서 코루틴 취소는 *협력적(cooperative)*입니다.
즉, 코루틴은 [중단](#suspension-points-and-cancellation)되거나 [명시적으로 취소 여부를 확인](#check-for-cancellation-explicitly)하여 협력할 때만 취소에 반응합니다.

이 섹션에서는 취소 가능한 코루틴을 만드는 방법을 배울 수 있습니다.

### 중단 지점과 취소 {id="suspension-points-and-cancellation"}

코루틴이 취소되면 코드 내에서 중단될 수 있는 지점, 즉 *중단 지점(suspension point)*에 도달할 때까지 계속 실행됩니다.
코루틴이 해당 지점에서 중단되면, 중단 함수는 취소 여부를 확인합니다.
취소되었다면 코루틴은 중단되고 `CancellationException`을 던집니다.

`suspend` 함수를 호출하는 것은 중단 지점이지만, 항상 중단되는 것은 아닙니다.
예를 들어 `Deferred` 결과를 기다릴 때(await), 해당 `Deferred`가 아직 완료되지 않은 경우에만 코루틴이 중단됩니다.

다음은 중단이 발생하는 일반적인 중단 함수들을 사용하여 코루틴이 취소되었을 때 이를 확인하고 중단할 수 있도록 하는 예제입니다:

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
                // 취소될 때까지 중단
                awaitCancellation()
            },
            launch {
                // 취소될 때까지 중단
                delay(Duration.INFINITE)
            },
            launch {
                val channel = Channel<Int>()
                // 절대 전송되지 않는 값을 기다리며 중단
                channel.receive()
            },
            launch {
                val deferred = CompletableDeferred<Int>()
                // 절대 완료되지 않는 값을 기다리며 중단
                deferred.await()
            },
            launch {
                val mutex = Mutex(locked = true)
                // 무기한 잠겨 있는 뮤텍스를 기다리며 중단
                mutex.lock()
            }
        )
        
        // 자식 코루틴들이 시작되고 중단될 시간을 줌
        delay(100.milliseconds)
        
        // 모든 자식 코루틴 취소
        childJobs.forEach { it.cancel() }
    }
    println("All child jobs completed!")
}
```
{kotlin-runnable="true" id="suspension-points-example"}

> `kotlinx.coroutines` 라이브러리의 모든 중단 함수는 내부적으로 [`suspendCancellableCoroutine()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/suspend-cancellable-coroutine.html)을 사용하여 코루틴이 중단될 때 취소 여부를 확인하므로 취소에 협력적입니다.
> 반면, [`suspendCoroutine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/suspend-coroutine.html)을 사용하는 커스텀 중단 함수는 취소에 반응하지 않습니다.
>
{style="tip"}

### 명시적으로 취소 확인 {id="check-for-cancellation-explicitly"}

코루틴이 오랫동안 [중단](#suspension-points-and-cancellation)되지 않는다면, 명시적으로 취소 여부를 확인하지 않는 한 취소되어도 중단되지 않습니다.

취소 여부를 확인하려면 다음 API를 사용하세요:

* [`isActive`](#isactive) 속성은 코루틴이 취소되었을 때 `false`가 됩니다.
* [`ensureActive()`](#ensureactive) 함수는 코루틴이 취소된 경우 즉시 `CancellationException`을 던집니다.
* [`yield()`](#yield) 함수는 코루틴을 중단시켜 스레드를 양보하고 다른 코루틴이 실행될 기회를 줍니다. 코루틴을 중단시키면 취소 여부를 확인하고 취소된 경우 `CancellationException`을 던질 수 있습니다.

이러한 API는 코루틴이 중단 지점 사이에서 오랫동안 실행되거나 중단 지점에서 중단될 가능성이 낮은 경우에 유용합니다.

#### isActive {id="isactive"}

오래 걸리는 계산 작업에서 [`isActive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html) 속성을 사용하여 주기적으로 취소 여부를 확인하세요.
이 속성은 코루틴이 더 이상 활성 상태가 아닐 때 `false`가 되며, 이를 사용하여 코루틴이 작업을 계속할 필요가 없을 때 우아하게 중단할 수 있습니다:

다음은 그 예제입니다:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds
import kotlin.random.Random

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val unsortedList = MutableList(10) { Random.nextInt() }
        
        // 오래 걸리는 계산 작업 시작
        val listSortingJob = launch {
            var i = 0

            // 코루틴이 활성 상태인 동안 반복해서 리스트 정렬
            while (isActive) {
                unsortedList.sort()
                ++i
            }
            println(
                "Stopped sorting the list after $i iterations"
            )
        }
        // 100밀리초 동안 리스트를 정렬한 후, 충분히 정렬되었다고 간주
        delay(100.milliseconds)

        // 결과가 충분히 만족스러울 때 정렬 취소
        listSortingJob.cancel()

        // 데이터 경합을 방지하기 위해 공유 리스트에 접근하기 전
        // 정렬 코루틴이 끝날 때까지 대기
        listSortingJob.join()
        println("The list is probably sorted: $unsortedList")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="isactive-example"}

이 예제에서 [`join()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html) 함수는 코루틴이 끝날 때까지 현재 코루틴을 중단시킵니다. 이를 통해 정렬 코루틴이 여전히 실행 중일 때 리스트에 접근하지 않도록 보장합니다.

> [`cancelAndJoin()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html) 함수를 사용하면 한 번의 호출로 코루틴을 취소하고 완료될 때까지 기다릴 수 있습니다.
>
{style="note"}

#### ensureActive() {id="ensureactive"}

[`ensureActive()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html) 함수를 사용하여 취소 여부를 확인하고, 코루틴이 취소된 경우 `CancellationException`을 던져 현재 계산을 중단하세요:

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
                    // 현재 숫자에 대해 콜라츠 추측 확인
                    var n = start
                    while (n != 1) {
                        // 코루틴이 취소된 경우 CancellationException 발생
                        ensureActive()
                        n = if (n % 2 == 0) n / 2 else 3 * n + 1
                    }
                }
            } finally {
                println("Checked the Collatz conjecture for 0..${start-1}")
            }
        }
        // 1초 동안 계산 실행
        delay(100.milliseconds)

        // 코루틴 취소
        childJob.cancel()
    }
}
```
{kotlin-runnable="true" id="ensurective-example"}

#### yield() {id="yield"}

[`yield()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html) 함수는 코루틴을 중단시키고 재개하기 전에 취소 여부를 확인합니다.
중단 없이는 동일한 스레드에 있는 코루틴들이 순차적으로 실행됩니다.

`yield`를 사용하면 다른 코루틴이 동일한 스레드 또는 스레드 풀에서 실행될 수 있도록 기회를 줄 수 있습니다:

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() {
    // runBlocking은 모든 코루틴을 실행하기 위해 현재 스레드를 사용함
    runBlocking {
        val coroutineCount = 5
        repeat(coroutineCount) { coroutineIndex ->
            launch {
                val id = coroutineIndex + 1
                repeat(5) { iterationIndex ->
                    val iteration = iterationIndex + 1
                    // 다른 코루틴이 실행될 기회를 주기 위해 일시적으로 중단
                    // 이것이 없으면 코루틴들은 순차적으로 실행됨
                    yield()
                    // 코루틴 인덱스와 반복 인덱스 출력
                    println("$id * $iteration = ${id * iteration}")
                }
            }
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="yield-example"}

이 예제에서 각 코루틴은 `yield()`를 사용하여 반복 사이에 다른 코루틴이 실행될 수 있도록 합니다.

### 코루틴 취소 시 블로킹 코드 인터럽트 {id="interrupt-blocking-code-when-coroutines-are-canceled"}

JVM에서 `Thread.sleep()`이나 `BlockingQueue.take()`와 같은 일부 함수는 현재 스레드를 차단(block)할 수 있습니다.
이러한 블로킹 함수는 인터럽트(interrupted)될 수 있으며, 이는 함수를 조기에 중단시킵니다.
하지만 코루틴 내에서 이들을 호출하면 취소가 발생해도 스레드가 인터럽트되지 않습니다.

코루틴을 취소할 때 스레드를 인터럽트하려면 [`runInterruptible()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-interruptible.html) 함수를 사용하세요:

```kotlin
import kotlinx.coroutines.*

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val childStarted = CompletableDeferred<Unit>()
        val childJob = launch {
            try {
                // 취소 시 스레드 인터럽트 유발
                runInterruptible {
                    childStarted.complete(Unit)
                    try {
                        // 매우 오랜 시간 동안 현재 스레드를 차단
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

        // 코루틴을 취소하고 Thread.sleep()을 실행 중인
        // 스레드를 인터럽트함
        childJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="interrupt-cancellation-example"}

## 코루틴 취소 시 안전한 값 처리 {id="handle-values-safely-when-canceling-coroutines"}

중단된 코루틴이 취소되면, 설령 결과값이 이미 사용 가능하더라도 값을 반환하는 대신 `CancellationException`과 함께 재개됩니다.
이러한 동작을 *즉각적인 취소(prompt cancellation)*라고 합니다.
이는 이미 닫힌 화면을 업데이트하는 것과 같이 취소된 코루틴의 범위에서 코드가 계속 실행되는 것을 방지합니다.

다음은 그 예제입니다:

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// UI 스레드를 사용하는 코루틴 스코프 정의
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
            // 여기서 updateUi를 호출하는 것은 안전함
            // 취소된 경우 withContext()는 어떤 값도 반환하지 않기 때문임
            updateUi(contents)
        }
    }

    // 사용자가 화면을 떠난 후 호출되면 예외 발생
    private fun updateUi(contents: List<String>) {
      contents.forEach { line -> addOneLineToUi(line) }
    }
  
    private fun addOneLineToUi(line: String) {
        // UI에 한 줄을 추가하는 코드의 플레이스홀더
    }

    // UI 스레드에서만 호출 가능
    fun leaveScreen() {
        // 화면을 떠날 때 스코프 취소
        // 더 이상 UI를 업데이트할 수 없음
        scope.cancel()
    }
}
```

이 예제에서 `withContext(Dispatchers.IO)`는 취소에 협력하며, 파일의 내용을 반환하기 전에 `leaveScreen()` 함수가 코루틴을 취소하면 `updateUI()`가 실행되지 않도록 방지합니다.

즉각적인 취소는 더 이상 유효하지 않은 값을 사용하는 것을 방지하지만, 중요한 값을 사용 중인 동안 코드를 중단시켜 해당 값을 잃어버리게 만들 수도 있습니다.
예를 들어 코루틴이 `AutoCloseable` 리소스와 같은 값을 받았지만, 이를 닫는 코드에 도달하기 전에 취소되는 경우가 발생할 수 있습니다.
이를 방지하려면 값을 받는 코루틴이 취소되더라도 반드시 실행되도록 보장되는 곳에 정리(cleanup) 로직을 두어야 합니다.

다음은 그 예제입니다:

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// scope는 UI 스레드를 사용하는 코루틴 스코프임
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            // finally 블록에서 닫을 수 있도록 reader를 변수에 저장
            var reader: BufferedReader? = null
            
            try {
                withContext(Dispatchers.IO) {
                    reader = Files.newBufferedReader(
                        path, Charset.forName("US-ASCII")
                    )
                }
                // withContext()가 완료된 후 저장된 reader 사용
                updateUi(reader!!)
            } finally {
                // 코루틴이 취소되더라도 reader가 닫히도록 보장
                reader?.close()
            }
        }
    }

    private suspend fun updateUi(reader: BufferedReader) {
        // 파일 내용 표시
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
        // UI에 한 줄을 추가하는 코드의 플레이스홀더
    }

    // UI 스레드에서만 호출 가능
    fun leaveScreen() {
        // 화면을 떠날 때 스코프 취소
        // 더 이상 UI를 업데이트할 수 없음
        scope.cancel()
    }
}
```

이 예제에서는 `BufferedReader`를 변수에 저장하고 `finally` 블록에서 닫음으로써 코루틴이 취소되더라도 리소스가 해제되도록 보장합니다.

### 취소 불가능한 블록 실행 {id="run-non-cancelable-blocks"}

코루틴의 특정 부분에 취소가 영향을 미치지 않도록 방지할 수 있습니다.
이를 위해 `withContext()` 코루틴 빌더 함수의 인자로 [`NonCancellable`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/)을 전달하세요.

> `.launch()`나 `.async()`와 같은 다른 코루틴 빌더와 함께 `NonCancellable`을 사용하지 마세요. 부모-자식 관계를 끊어 구조화된 동시성을 방해합니다.
>
{style="warning"}

`NonCancellable`은 중단 함수인 `close()`를 사용하여 리소스를 닫는 작업처럼, 코루틴이 완료되기 전에 취소되더라도 반드시 완료되어야 하는 특정 작업을 수행할 때 유용합니다.

다음은 그 예제입니다:

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
                    // 코루틴이 취소되었으므로 이 함수는 완료되지 않음
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

## 타임아웃 {id="timeout"}

타임아웃(Timeouts)을 사용하면 지정된 시간이 지난 후 코루틴을 자동으로 취소할 수 있습니다.
너무 오래 걸리는 작업을 중단하여 애플리케이션의 반응성을 유지하고 불필요한 스레드 점유를 방지하는 데 유용합니다.

타임아웃을 지정하려면 [`withTimeoutOrNull()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html) 함수를 `Duration`과 함께 사용하세요:

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

지정된 `Duration`을 초과하면 `withTimeoutOrNull()`은 `null`을 반환합니다.