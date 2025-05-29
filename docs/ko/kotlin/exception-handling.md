<!--- TEST_NAME ExceptionsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 코루틴 예외 처리)

이 섹션에서는 예외 처리와 예외 발생 시의 취소에 대해 다룹니다.
취소된 코루틴이 일시 중단 지점에서 [CancellationException]을 발생시키며, 코루틴 메커니즘에 의해 이 예외가 무시된다는 사실은 이미 알고 있습니다. 여기서는 취소 중 예외가 발생하거나, 동일한 코루틴의 여러 자식 코루틴이 예외를 발생시킬 경우 어떤 일이 일어나는지 살펴봅니다.

## 예외 전파

코루틴 빌더는 예외를 자동으로 전파하는 ([launch]) 방식과 사용자에게 노출하는 ([async] 및 [produce]) 두 가지 유형이 있습니다.
이러한 빌더가 다른 코루틴의 _자식_이 아닌 _루트_ 코루틴을 생성하는 데 사용될 때, 전자의 빌더는 예외를 Java의 `Thread.uncaughtExceptionHandler`와 유사하게 **포착되지 않은** 예외로 취급하며, 후자의 빌더는 사용자가 최종 예외를 소비하도록 의존합니다. 예를 들어 [await][Deferred.await] 또는 [receive][ReceiveChannel.receive]를 통해 소비할 수 있습니다 ([produce] 및 [receive][ReceiveChannel.receive]는 [채널](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/channels.md) 섹션에서 다룹니다).

[GlobalScope]를 사용하여 루트 코루틴을 생성하는 간단한 예제로 이를 시연할 수 있습니다.

> [GlobalScope]는 사소하지 않은 방식으로 역효과를 낼 수 있는 민감한(delicate) API입니다. 전체 애플리케이션의 루트 코루틴을 생성하는 것은 `GlobalScope`의 몇 안 되는 정당한 사용 사례 중 하나이므로, `@OptIn(DelicateCoroutinesApi::class)`를 사용하여 `GlobalScope` 사용에 명시적으로 옵트인해야 합니다.
>
{style="note"}

```kotlin
import kotlinx.coroutines.*

//sampleStart
@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val job = GlobalScope.launch { // launch로 생성된 루트 코루틴
        println("Throwing exception from launch")
        throw IndexOutOfBoundsException() // Thread.defaultUncaughtExceptionHandler에 의해 콘솔에 출력됩니다.
    }
    job.join()
    println("Joined failed job")
    val deferred = GlobalScope.async { // async로 생성된 루트 코루틴
        println("Throwing exception from async")
        throw ArithmeticException() // 아무것도 출력되지 않음, 사용자가 await를 호출하도록 의존함
    }
    try {
        deferred.await()
        println("Unreached")
    } catch (e: ArithmeticException) {
        println("Caught ArithmeticException")
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-01.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-01.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 (디버그 모드에서 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/coroutine-context-and-dispatchers.md#debugging-coroutines-and-threads)에서 확인할 수 있습니다):

```text
Throwing exception from launch
Exception in thread "DefaultDispatcher-worker-1 @coroutine#2" java.lang.IndexOutOfBoundsException
Joined failed job
Throwing exception from async
Caught ArithmeticException
```

<!--- TEST EXCEPTION-->

## CoroutineExceptionHandler

콘솔에 **포착되지 않은** 예외를 출력하는 기본 동작을 사용자 지정할 수 있습니다.
_루트_ 코루틴에 있는 [CoroutineExceptionHandler] 컨텍스트 요소는 이 루트 코루틴과 모든 자식 코루틴에 대한 일반적인 `catch` 블록으로 사용될 수 있으며, 여기에서 사용자 지정 예외 처리가 이루어질 수 있습니다.
이는 [`Thread.uncaughtExceptionHandler`](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html#setUncaughtExceptionHandler-java.lang.Thread.UncaughtExceptionHandler-)와 유사합니다.
`CoroutineExceptionHandler`에서는 예외로부터 복구할 수 없습니다. 핸들러가 호출될 때 코루틴은 이미 해당 예외와 함께 완료된 상태입니다. 일반적으로 핸들러는 예외를 기록하고, 어떤 종류의 오류 메시지를 표시하며, 애플리케이션을 종료하거나 재시작하는 데 사용됩니다.

`CoroutineExceptionHandler`는 **포착되지 않은** 예외 &mdash; 즉, 다른 방식으로 처리되지 않은 예외에 대해서만 호출됩니다.
특히, 모든 _자식_ 코루틴(다른 [Job]의 컨텍스트에서 생성된 코루틴)은 예외 처리를 부모 코루틴에 위임하며, 이 부모 코루틴 또한 다시 부모에게 위임하는 식으로 루트 코루틴까지 이어집니다. 따라서 이들의 컨텍스트에 설치된 `CoroutineExceptionHandler`는 절대로 사용되지 않습니다.
그 외에도, [async] 빌더는 항상 모든 예외를 포착하여 결과 [Deferred] 객체로 나타내므로, 이 빌더의 `CoroutineExceptionHandler`도 아무런 효과가 없습니다.

> 감독 스코프(supervision scope)에서 실행되는 코루틴은 예외를 부모에게 전파하지 않으며 이 규칙에서 제외됩니다. 이 문서의 [감독](#supervision) 섹션에서 더 자세한 내용을 제공합니다.
>
{style="note"}

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandler got $exception") 
    }
    val job = GlobalScope.launch(handler) { // 루트 코루틴, GlobalScope에서 실행됨
        throw AssertionError()
    }
    val deferred = GlobalScope.async(handler) { // 또한 루트 코루틴이지만, launch 대신 async를 사용함
        throw ArithmeticException() // 아무것도 출력되지 않음, 사용자가 deferred.await()를 호출하도록 의존함
    }
    joinAll(job, deferred)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-02.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-02.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
CoroutineExceptionHandler got java.lang.AssertionError
```

<!--- TEST-->

## 취소 및 예외

취소는 예외와 밀접하게 관련되어 있습니다. 코루틴은 내부적으로 취소를 위해 `CancellationException`을 사용하며, 이러한 예외는 모든 핸들러에 의해 무시되므로, `catch` 블록을 통해 얻을 수 있는 추가 디버그 정보의 소스로만 사용되어야 합니다.
코루틴이 [Job.cancel]을 사용하여 취소되면 종료되지만, 부모 코루틴을 취소하지는 않습니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        val child = launch {
            try {
                delay(Long.MAX_VALUE)
            } finally {
                println("Child is cancelled") // 자식이 취소됨
            }
        }
        yield()
        println("Cancelling child") // 자식 취소 중
        child.cancel()
        child.join()
        yield()
        println("Parent is not cancelled") // 부모는 취소되지 않음
    }
    job.join()
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-03.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-03.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
Cancelling child
Child is cancelled
Parent is not cancelled
```

<!--- TEST-->

코루틴이 `CancellationException` 외의 예외를 만나면, 해당 예외로 부모 코루틴을 취소합니다.
이 동작은 재정의할 수 없으며, [구조적 동시성](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/composing-suspending-functions.md#structured-concurrency-with-async)을 위한 안정적인 코루틴 계층을 제공하는 데 사용됩니다.
[CoroutineExceptionHandler] 구현은 자식 코루틴에는 사용되지 않습니다.

> 이 예제들에서 [CoroutineExceptionHandler]는 항상 [GlobalScope]에서 생성된 코루틴에 설치됩니다. 메인 [runBlocking] 스코프에서 시작된 코루틴에 예외 핸들러를 설치하는 것은 의미가 없는데, 이는 자식 코루틴이 예외와 함께 완료될 때 설치된 핸들러와 관계없이 메인 코루틴은 항상 취소될 것이기 때문입니다.
>
{style="note"}

원래 예외는 모든 자식 코루틴이 종료될 때만 부모에 의해 처리되며, 다음 예제에서 이를 보여줍니다.

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandler got $exception") 
    }
    val job = GlobalScope.launch(handler) {
        launch { // 첫 번째 자식
            try {
                delay(Long.MAX_VALUE)
            } finally {
                withContext(NonCancellable) {
                    println("Children are cancelled, but exception is not handled until all children terminate") // 자식들이 취소되었지만, 모든 자식이 종료될 때까지 예외는 처리되지 않습니다.
                    delay(100)
                    println("The first child finished its non cancellable block") // 첫 번째 자식이 취소 불가능 블록을 마쳤습니다.
                }
            }
        }
        launch { // 두 번째 자식
            delay(10)
            println("Second child throws an exception") // 두 번째 자식이 예외를 발생시킵니다.
            throw ArithmeticException()
        }
    }
    job.join()
//sampleEnd 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-04.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-04.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
Second child throws an exception
Children are cancelled, but exception is not handled until all children terminate
The first child finished its non cancellable block
CoroutineExceptionHandler got java.lang.ArithmeticException
```

<!--- TEST-->

## 예외 집계

코루틴의 여러 자식 코루틴이 예외로 실패할 경우, 일반적인 규칙은 "첫 번째 예외가 우선한다"는 것입니다. 즉, 첫 번째 예외가 처리됩니다.
첫 번째 예외 이후에 발생하는 모든 추가 예외는 억제된 예외(suppressed ones)로 첫 번째 예외에 첨부됩니다.

<!--- INCLUDE
import kotlinx.coroutines.exceptions.*
-->

```kotlin
import kotlinx.coroutines.*
import java.io.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception with suppressed ${exception.suppressed.contentToString()}")
    }
    val job = GlobalScope.launch(handler) {
        launch {
            try {
                delay(Long.MAX_VALUE) // 다른 형제(sibling)가 IOException으로 실패하면 취소됩니다.
            } finally {
                throw ArithmeticException() // 두 번째 예외
            }
        }
        launch {
            delay(100)
            throw IOException() // 첫 번째 예외
        }
        delay(Long.MAX_VALUE)
    }
    job.join()  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-05.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-05.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
CoroutineExceptionHandler got java.io.IOException with suppressed [java.lang.ArithmeticException]
```

<!--- TEST-->

> 이 메커니즘은 현재 Java 1.7 이상 버전에서만 작동합니다. JS 및 Native 제한은 일시적이며 향후 해제될 예정입니다.
>
{style="note"}

취소 예외는 투명하며 기본적으로 언랩됩니다:

```kotlin
import kotlinx.coroutines.*
import java.io.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception")
    }
    val job = GlobalScope.launch(handler) {
        val innerJob = launch { // 이 코루틴 스택 전체가 취소될 것입니다.
            launch {
                launch {
                    throw IOException() // 원래 예외
                }
            }
        }
        try {
            innerJob.join()
        } catch (e: CancellationException) {
            println("Rethrowing CancellationException with original cause") // 원래 원인과 함께 CancellationException을 다시 던집니다.
            throw e // 취소 예외는 다시 던져지지만, 원래 IOException은 핸들러에 도달합니다.
        }
    }
    job.join()
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-exceptions-06.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-06.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
Rethrowing CancellationException with original cause
CoroutineExceptionHandler got java.io.IOException
```

<!--- TEST-->

## 감독(Supervision)

이전에 학습했듯이, 취소는 코루틴 계층 전체에 걸쳐 전파되는 양방향 관계입니다.
단방향 취소가 필요한 경우를 살펴보겠습니다.

이러한 요구 사항의 좋은 예시는 스코프에 작업이 정의된 UI 컴포넌트입니다. UI의 자식 작업 중 하나라도 실패하더라도 전체 UI 컴포넌트를 취소(사실상 종료)하는 것이 항상 필요한 것은 아니지만, UI 컴포넌트가 파괴되고(그리고 그 작업이 취소되면) 모든 자식 작업의 결과가 더 이상 필요하지 않으므로 자식 작업들도 모두 취소해야 합니다.

또 다른 예시는 여러 자식 작업을 생성하고 이들의 실행을 _감독_하며 실패를 추적하고 실패한 작업만 재시작해야 하는 서버 프로세스입니다.

### 감독 작업

이러한 목적을 위해 [SupervisorJob][SupervisorJob()]을 사용할 수 있습니다.
이는 일반적인 [Job][Job()]과 유사하지만, 취소가 아래로만 전파된다는 유일한 예외가 있습니다. 다음 예제를 사용하여 이를 쉽게 시연할 수 있습니다:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val supervisor = SupervisorJob()
    with(CoroutineScope(coroutineContext + supervisor)) {
        // 첫 번째 자식 시작 -- 이 예제에서는 예외가 무시됩니다 (실제 상황에서는 이렇게 하지 마십시오!)
        val firstChild = launch(CoroutineExceptionHandler { _, _ ->  }) {
            println("The first child is failing")
            throw AssertionError("The first child is cancelled")
        }
        // 두 번째 자식 시작
        val secondChild = launch {
            firstChild.join()
            // 첫 번째 자식의 취소는 두 번째 자식에게 전파되지 않습니다.
            println("The first child is cancelled: ${firstChild.isCancelled}, but the second one is still active")
            try {
                delay(Long.MAX_VALUE)
            } finally {
                // 하지만 감독 작업(supervisor)의 취소는 전파됩니다.
                println("The second child is cancelled because the supervisor was cancelled")
            }
        }
        // 첫 번째 자식이 실패하고 완료될 때까지 기다립니다.
        firstChild.join()
        println("Cancelling the supervisor")
        supervisor.cancel()
        secondChild.join()
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-01.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-01.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
The first child is failing
The first child is cancelled: true, but the second one is still active
Cancelling the supervisor
The second child is cancelled because the supervisor was cancelled
```

<!--- TEST-->

### 감독 스코프

[coroutineScope][_coroutineScope] 대신 _스코프된_ 동시성을 위해 [supervisorScope][_supervisorScope]를 사용할 수 있습니다. 이는 취소를 한 방향으로만 전파하며, 자기 자신이 실패한 경우에만 모든 자식 코루틴을 취소합니다. [coroutineScope][_coroutineScope]와 마찬가지로 완료되기 전에 모든 자식 코루틴을 기다립니다.

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    try {
        supervisorScope {
            val child = launch {
                try {
                    println("The child is sleeping")
                    delay(Long.MAX_VALUE)
                } finally {
                    println("The child is cancelled")
                }
            }
            // yield를 사용하여 자식이 실행되고 출력할 기회를 줍니다.
            yield()
            println("Throwing an exception from the scope")
            throw AssertionError()
        }
    } catch(e: AssertionError) {
        println("Caught an assertion error")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-02.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-02.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
The child is sleeping
Throwing an exception from the scope
The child is cancelled
Caught an assertion error
```

<!--- TEST-->

#### 감독되는 코루틴의 예외

일반 작업과 감독 작업 간의 또 다른 중요한 차이점은 예외 처리입니다.
모든 자식 코루틴은 예외 처리 메커니즘을 통해 스스로 예외를 처리해야 합니다.
이러한 차이점은 자식의 실패가 부모에게 전파되지 않는다는 사실에서 비롯됩니다.
이는 [supervisorScope][_supervisorScope] 내에서 직접 시작된 코루틴이 루트 코루틴과 동일한 방식으로 해당 스코프에 설치된 [CoroutineExceptionHandler]를 _사용한다는_ 것을 의미합니다 (자세한 내용은 [CoroutineExceptionHandler](#coroutineexceptionhandler) 섹션을 참조하십시오).

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception -> 
        println("CoroutineExceptionHandler got $exception") 
    }
    supervisorScope {
        val child = launch(handler) {
            println("The child throws an exception")
            throw AssertionError()
        }
        println("The scope is completing") // 스코프가 완료되고 있습니다.
    }
    println("The scope is completed") // 스코프가 완료되었습니다.
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-supervision-03.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-03.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
The scope is completing
The child throws an exception
CoroutineExceptionHandler got java.lang.AssertionError
The scope is completed
```

<!--- TEST-->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[CancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[Deferred.await]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html
[GlobalScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[CoroutineExceptionHandler]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/index.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Deferred]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/index.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[SupervisorJob()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-supervisor-job.html
[Job()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[_supervisorScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html

<!--- INDEX kotlinx.coroutines.channels -->

[produce]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/produce.html
[ReceiveChannel.receive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html

<!--- END -->