<!--- TEST_NAME DispatcherGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 코루틴 컨텍스트와 디스패처)

코루틴은 항상 Kotlin 표준 라이브러리에 정의된 [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 타입의 값으로 표현되는 특정 컨텍스트에서 실행됩니다.

코루틴 컨텍스트는 다양한 요소들의 집합입니다. 주요 요소로는 이전에 살펴보았던 코루틴의 [Job]과, 이 섹션에서 다룰 디스패처가 있습니다.

## 디스패처와 스레드

코루틴 컨텍스트에는 해당 코루틴이 실행에 사용할 스레드를 결정하는 _코루틴 디스패처_([CoroutineDispatcher] 참조)가 포함됩니다. 코루틴 디스패처는 코루틴 실행을 특정 스레드에 한정하거나, 스레드 풀로 디스패치하거나, 혹은 비제한적으로 실행되도록 할 수 있습니다.

[launch] 및 [async]와 같은 모든 코루틴 빌더는 선택적 [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 매개변수를 받으며, 이를 사용하여 새 코루틴에 대한 디스패처 및 다른 컨텍스트 요소를 명시적으로 지정할 수 있습니다.

다음 예제를 시도해보세요:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch { // context of the parent, main runBlocking coroutine
        println("main runBlocking      : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Unconfined) { // not confined -- will work with main thread
        println("Unconfined            : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Default) { // will get dispatched to DefaultDispatcher 
        println("Default               : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(newSingleThreadContext("MyOwnThread")) { // will get its own new thread
        println("newSingleThreadContext: I'm working in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-01.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-01.kt)에서 확인할 수 있습니다.
>
{style="note"}

다음 출력을 생성합니다 (순서는 다를 수 있습니다):

```text
Unconfined            : I'm working in thread main
Default               : I'm working in thread DefaultDispatcher-worker-1
newSingleThreadContext: I'm working in thread MyOwnThread
main runBlocking      : I'm working in thread main
```

<!--- TEST LINES_START_UNORDERED -->

`launch { ... }`가 매개변수 없이 사용되면, 해당 코루틴이 시작되는 [CoroutineScope]로부터 컨텍스트(및 디스패처)를 상속받습니다. 이 경우, `main` 스레드에서 실행되는 메인 `runBlocking` 코루틴의 컨텍스트를 상속받습니다.

[Dispatchers.Unconfined]는 `main` 스레드에서 실행되는 것처럼 보이는 특별한 디스패처입니다. 하지만 실제로는 나중에 설명할 다른 메커니즘입니다.

스코프에 다른 디스패처가 명시적으로 지정되지 않은 경우 기본 디스패처가 사용됩니다. 이는 [Dispatchers.Default]로 표현되며, 공유 백그라운드 스레드 풀을 사용합니다.

[newSingleThreadContext]는 코루틴 실행을 위한 스레드를 생성합니다. 전용 스레드는 매우 값비싼(expensive) 리소스입니다. 실제 애플리케이션에서는 더 이상 필요하지 않을 때 [close][ExecutorCoroutineDispatcher.close] 함수를 사용하여 해제하거나, 최상위 변수에 저장하여 애플리케이션 전체에서 재사용해야 합니다.

## 비제한 디스패처와 제한 디스패처

[Dispatchers.Unconfined] 코루틴 디스패처는 호출자 스레드에서 코루틴을 시작하지만, 이는 첫 번째 중단점까지만 해당됩니다. 중단(suspension) 후에는 호출된 중단 함수에 의해 완전히 결정된 스레드에서 코루틴을 재개합니다. 비제한 디스패처는 CPU 시간을 소모하지 않거나 특정 스레드에 한정된 공유 데이터(예: UI)를 업데이트하지 않는 코루틴에 적합합니다.

반면, 디스패처는 기본적으로 외부 [CoroutineScope]로부터 상속됩니다. 특히 [runBlocking] 코루틴의 기본 디스패처는 호출자 스레드에 한정되므로, 이를 상속하면 예측 가능한 FIFO 스케줄링으로 이 스레드에 실행을 한정하는 효과를 가집니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch(Dispatchers.Unconfined) { // not confined -- will work with main thread
        println("Unconfined      : I'm working in thread ${Thread.currentThread().name}")
        delay(500)
        println("Unconfined      : After delay in thread ${Thread.currentThread().name}")
    }
    launch { // context of the parent, main runBlocking coroutine
        println("main runBlocking: I'm working in thread ${Thread.currentThread().name}")
        delay(1000)
        println("main runBlocking: After delay in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-02.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-02.kt)에서 확인할 수 있습니다.
>
{style="note"}

출력은 다음과 같습니다:

```text
Unconfined      : I'm working in thread main
main runBlocking: I'm working in thread main
Unconfined      : After delay in thread kotlinx.coroutines.DefaultExecutor
main runBlocking: After delay in thread main
```

<!--- TEST LINES_START -->

따라서 `runBlocking {...}`으로부터 컨텍스트를 상속받은 코루틴은 `main` 스레드에서 계속 실행되는 반면, 비제한 코루틴은 [delay] 함수가 사용하는 기본 실행기(executor) 스레드에서 재개됩니다.

> 비제한 디스패처는 코루틴의 특정 작업이 즉시 수행되어야 하므로, 나중에 실행하기 위한 디스패칭이 필요 없거나 바람직하지 않은 부작용을 일으킬 수 있는 특정 특수한 경우(corner cases)에 유용할 수 있는 고급 메커니즘입니다. 비제한 디스패처는 일반적인 코드에서 사용해서는 안 됩니다.
>
{style="note"}

## 코루틴 및 스레드 디버깅

코루틴은 한 스레드에서 중단되고 다른 스레드에서 재개될 수 있습니다. 단일 스레드 디스패처를 사용하더라도 특별한 도구가 없다면 코루틴이 무엇을, 어디서, 언제 수행했는지 파악하기 어려울 수 있습니다.

### IDEA로 디버깅하기

Kotlin 플러그인의 코루틴 디버거는 IntelliJ IDEA에서 코루틴 디버깅을 단순화합니다.

> 디버깅은 `kotlinx-coroutines-core` 버전 1.3.8 이상에서 작동합니다.
>
{style="note"}

**Debug** 도구 창에는 **Coroutines** 탭이 있습니다. 이 탭에서는 현재 실행 중인 코루틴과 중단된 코루틴에 대한 정보를 찾을 수 있습니다. 코루틴은 실행 중인 디스패처별로 그룹화됩니다.

![Debugging coroutines](coroutine-idea-debugging-1.png){width=700}

코루틴 디버거를 사용하면 다음을 수행할 수 있습니다:
*   각 코루틴의 상태를 확인합니다.
*   실행 중인 코루틴과 중단된 코루틴 모두에서 지역 변수 및 캡처된 변수 값을 확인합니다.
*   전체 코루틴 생성 스택과 코루틴 내부의 호출 스택을 볼 수 있습니다. 이 스택에는 표준 디버깅 중에는 손실될 수 있는 변수 값이 포함된 모든 프레임이 포함됩니다.
*   각 코루틴의 상태와 스택이 포함된 전체 보고서를 얻습니다. 이를 얻으려면 **Coroutines** 탭 내부에서 마우스 오른쪽 버튼을 클릭한 다음 **Get Coroutines Dump**를 클릭합니다.

코루틴 디버깅을 시작하려면 중단점(breakpoint)을 설정하고 애플리케이션을 디버그 모드로 실행하기만 하면 됩니다.

코루틴 디버깅에 대한 자세한 내용은 [튜토리얼](https://kotlinlang.org/docs/tutorials/coroutines/debug-coroutines-with-idea.html)에서 알아볼 수 있습니다.

### 로깅을 사용한 디버깅

코루틴 디버거 없이 스레드를 사용하는 애플리케이션을 디버깅하는 또 다른 접근 방식은 각 로그 문에서 스레드 이름을 로그 파일에 출력하는 것입니다. 이 기능은 로깅 프레임워크에서 보편적으로 지원됩니다. 코루틴을 사용할 때 스레드 이름만으로는 많은 컨텍스트를 제공하지 못하므로, `kotlinx.coroutines`는 이를 더 쉽게 만들기 위한 디버깅 기능을 포함합니다.

다음 코드를 `-Dkotlinx.coroutines.debug` JVM 옵션과 함께 실행하세요:

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() = runBlocking<Unit> {
//sampleStart
    val a = async {
        log("I'm computing a piece of the answer")
        6
    }
    val b = async {
        log("I'm computing another piece of the answer")
        7
    }
    log("The answer is ${a.await() * b.await()}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-03.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-03.kt)에서 확인할 수 있습니다.
>
{style="note"}

세 개의 코루틴이 있습니다. `runBlocking` 내부의 메인 코루틴(#1)과 지연된 값 `a`(#2) 및 `b`(#3)를 계산하는 두 개의 코루틴입니다. 이들은 모두 `runBlocking`의 컨텍스트에서 실행되며 `main` 스레드에 한정됩니다. 이 코드의 출력은 다음과 같습니다:

```text
[main @coroutine#2] I'm computing a piece of the answer
[main @coroutine#3] I'm computing another piece of the answer
[main @coroutine#1] The answer is 42
```

<!--- TEST FLEXIBLE_THREAD -->

`log` 함수는 스레드 이름을 대괄호 안에 출력하며, 현재 실행 중인 코루틴의 식별자가 추가된 `main` 스레드임을 확인할 수 있습니다. 이 식별자는 디버깅 모드가 켜져 있을 때 생성된 모든 코루틴에 순차적으로 할당됩니다.

> JVM이 `-ea` 옵션으로 실행될 때도 디버깅 모드가 켜집니다. 디버깅 기능에 대한 자세한 내용은 [DEBUG_PROPERTY_NAME] 속성 문서를 참조하세요.
>
{style="note"}

## 스레드 간 점프

다음 코드를 `-Dkotlinx.coroutines.debug` JVM 옵션과 함께 실행하세요([debug](#debugging-coroutines-and-threads) 참조):

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() {
    newSingleThreadContext("Ctx1").use { ctx1 ->
        newSingleThreadContext("Ctx2").use { ctx2 ->
            runBlocking(ctx1) {
                log("Started in ctx1")
                withContext(ctx2) {
                    log("Working in ctx2")
                }
                log("Back to ctx1")
            }
        }
    }
}
```
<!--- KNIT example-context-04.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-04.kt)에서 확인할 수 있습니다.
>
{style="note"}

위 예제는 코루틴 사용의 새로운 기술을 보여줍니다.

첫 번째 기술은 지정된 컨텍스트와 함께 [runBlocking]을 사용하는 방법을 보여줍니다. 두 번째 기술은 [withContext]를 호출하는 것을 포함하며, 이는 현재 코루틴을 중단하고 새 컨텍스트로 전환할 수 있습니다. 단, 새 컨텍스트가 기존 컨텍스트와 다를 경우에만 그렇습니다. 특히, 다른 [CoroutineDispatcher]를 지정하면 추가적인 디스패치가 필요합니다. 즉, 블록이 새 디스패처에 스케줄링되고, 완료되면 실행이 원래 디스패처로 돌아옵니다.

결과적으로 위 코드의 출력은 다음과 같습니다:

```text
[Ctx1 @coroutine#1] Started in ctx1
[Ctx2 @coroutine#1] Working in ctx2
[Ctx1 @coroutine#1] Back to ctx1
```

<!--- TEST -->

위 예제는 Kotlin 표준 라이브러리의 `use` 함수를 사용하여 [newSingleThreadContext]로 생성된 스레드 리소스를 더 이상 필요하지 않을 때 적절하게 해제하는 방법을 보여줍니다.

## 컨텍스트의 Job

코루틴의 [Job]은 해당 컨텍스트의 일부이며, `coroutineContext[Job]` 표현식을 사용하여 가져올 수 있습니다:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    println("My job is ${coroutineContext[Job]}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-05.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-05.kt)에서 확인할 수 있습니다.
>
{style="note"}

[디버그 모드](#debugging-coroutines-and-threads)에서는 다음과 같은 출력을 생성합니다.

```
My job is "coroutine#1":BlockingCoroutine{Active}@6d311334
```

<!--- TEST lines.size == 1 && lines[0].startsWith("My job is \"coroutine#1\":BlockingCoroutine{Active}@") -->

[CoroutineScope]의 [isActive]는 `coroutineContext[Job]?.isActive == true`의 편리한 단축키일 뿐입니다.

## 코루틴의 자식

다른 코루틴의 [CoroutineScope]에서 코루틴이 시작되면, [CoroutineScope.coroutineContext]를 통해 컨텍스트를 상속받고, 새 코루틴의 [Job]은 부모 코루틴 Job의 _자식_이 됩니다. 부모 코루틴이 취소되면 모든 자식 코루틴도 재귀적으로 취소됩니다.

그러나 이 부모-자식 관계는 다음 두 가지 방법 중 하나로 명시적으로 재정의될 수 있습니다.

1.  코루틴을 시작할 때 다른 스코프가 명시적으로 지정되면(예: `GlobalScope.launch`), 부모 스코프로부터 `Job`을 상속받지 않습니다.
2.  새 코루틴의 컨텍스트로 다른 `Job` 객체가 전달되면(아래 예제 참조), 부모 스코프의 `Job`을 재정의합니다.

두 경우 모두, 시작된 코루틴은 시작된 스코프에 묶이지 않고 독립적으로 동작합니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    // launch a coroutine to process some kind of incoming request
    val request = launch {
        // it spawns two other jobs
        launch(Job()) { 
            println("job1: I run in my own Job and execute independently!")
            delay(1000)
            println("job1: I am not affected by cancellation of the request")
        }
        // and the other inherits the parent context
        launch {
            delay(100)
            println("job2: I am a child of the request coroutine")
            delay(1000)
            println("job2: I will not execute this line if my parent request is cancelled")
        }
    }
    delay(500)
    request.cancel() // cancel processing of the request
    println("main: Who has survived request cancellation?")
    delay(1000) // delay the main thread for a second to see what happens
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-06.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-06.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드의 출력은 다음과 같습니다:

```text
job1: I run in my own Job and execute independently!
job2: I am a child of the request coroutine
main: Who has survived request cancellation?
job1: I am not affected by cancellation of the request
```

<!--- TEST -->

## 부모의 책임

부모 코루틴은 항상 모든 자식 코루틴의 완료를 기다립니다. 부모는 시작한 모든 자식을 명시적으로 추적할 필요가 없으며, 마지막에 [Job.join]을 사용하여 자식을 기다릴 필요도 없습니다:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    // launch a coroutine to process some kind of incoming request
    val request = launch {
        repeat(3) { i -> // launch a few children jobs
            launch  {
                delay((i + 1) * 200L) // variable delay 200ms, 400ms, 600ms
                println("Coroutine $i is done")
            }
        }
        println("request: I'm done and I don't explicitly join my children that are still active")
    }
    request.join() // wait for completion of the request, including all its children
    println("Now processing of the request is complete")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-07.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-07.kt)에서 확인할 수 있습니다.
>
{style="note"}

결과는 다음과 같습니다:

```text
request: I'm done and I don't explicitly join my children that are still active
Coroutine 0 is done
Coroutine 1 is done
Coroutine 2 is done
Now processing of the request is complete
```

<!--- TEST -->

## 디버깅을 위한 코루틴 이름 지정

코루틴이 자주 로깅하고 동일한 코루틴에서 오는 로그 기록을 연관시킬 필요가 있을 때 자동 할당된 ID가 유용합니다. 그러나 코루틴이 특정 요청 처리 또는 특정 백그라운드 작업과 연결된 경우, 디버깅 목적으로 명시적으로 이름을 지정하는 것이 좋습니다.
[CoroutineName] 컨텍스트 요소는 스레드 이름과 동일한 목적을 가집니다. [디버깅 모드](#debugging-coroutines-and-threads)가 켜져 있을 때 이 코루틴을 실행하는 스레드 이름에 포함됩니다.

다음 예제는 이 개념을 보여줍니다:

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() = runBlocking(CoroutineName("main")) {
//sampleStart
    log("Started main coroutine")
    // run two background value computations
    val v1 = async(CoroutineName("v1coroutine")) {
        delay(500)
        log("Computing v1")
        6
    }
    val v2 = async(CoroutineName("v2coroutine")) {
        delay(1000)
        log("Computing v2")
        7
    }
    log("The answer for v1 * v2 = ${v1.await() * v2.await()}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-08.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-08.kt)에서 확인할 수 있습니다.
>
{style="note"}

`-Dkotlinx.coroutines.debug` JVM 옵션으로 생성되는 출력은 다음과 유사합니다:

```text
[main @main#1] Started main coroutine
[main @v1coroutine#2] Computing v1
[main @v2coroutine#3] Computing v2
[main @main#1] The answer for v1 * v2 = 42
```

<!--- TEST FLEXIBLE_THREAD -->

## 컨텍스트 요소 결합

때때로 코루틴 컨텍스트에 여러 요소를 정의해야 할 때가 있습니다. 이를 위해 `+` 연산자를 사용할 수 있습니다. 예를 들어, 명시적으로 지정된 디스패처와 명시적으로 지정된 이름을 동시에 사용하여 코루틴을 시작할 수 있습니다:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch(Dispatchers.Default + CoroutineName("test")) {
        println("I'm working in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-09.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-09.kt)에서 확인할 수 있습니다.
>
{style="note"}

`-Dkotlinx.coroutines.debug` JVM 옵션과 함께 이 코드의 출력은 다음과 같습니다:

```text
I'm working in thread DefaultDispatcher-worker-1 @test#2
```

<!--- TEST FLEXIBLE_THREAD -->

## 코루틴 스코프

컨텍스트, 자식, Job에 대한 지식을 함께 정리해 봅시다. 우리의 애플리케이션에 라이프사이클을 가진 객체가 있지만, 그 객체는 코루틴이 아니라고 가정해 봅시다. 예를 들어, 안드로이드 애플리케이션을 개발하면서 데이터 가져오기 및 업데이트, 애니메이션 등의 비동기 작업을 수행하기 위해 안드로이드 액티비티(activity)의 컨텍스트에서 다양한 코루틴을 시작하고 있습니다. 이러한 코루틴은 메모리 누수를 방지하기 위해 액티비티가 소멸될 때 취소되어야 합니다. 물론 컨텍스트와 Job을 수동으로 조작하여 액티비티와 코루틴의 라이프사이클을 연결할 수 있지만, `kotlinx.coroutines`는 이를 캡슐화하는 추상화: [CoroutineScope]를 제공합니다.
모든 코루틴 빌더가 [CoroutineScope]의 확장 함수로 선언되어 있으므로, 이미 코루틴 스코프에 익숙할 것입니다.

우리는 액티비티의 라이프사이클에 묶인 [CoroutineScope] 인스턴스를 생성하여 코루틴의 라이프사이클을 관리합니다. `CoroutineScope` 인스턴스는 [CoroutineScope()] 또는 [MainScope()] 팩토리 함수로 생성할 수 있습니다. 전자는 범용 스코프를 생성하는 반면, 후자는 UI 애플리케이션을 위한 스코프를 생성하고 [Dispatchers.Main]을 기본 디스패처로 사용합니다:

```kotlin
class Activity {
    private val mainScope = MainScope()
    
    fun destroy() {
        mainScope.cancel()
    }
    // to be continued ...
```

이제 정의된 `mainScope`를 사용하여 이 `Activity` 스코프 내에서 코루틴을 시작할 수 있습니다. 데모를 위해, 우리는 다른 시간 동안 지연되는 열 개의 코루틴을 시작합니다:

```kotlin
    // class Activity continues
    fun doSomething() {
        // launch ten coroutines for a demo, each working for a different time
        repeat(10) { i ->
            mainScope.launch {
                delay((i + 1) * 200L) // variable delay 200ms, 400ms, ... etc
                println("Coroutine $i is done")
            }
        }
    }
} // class Activity ends
```

`main` 함수에서는 액티비티를 생성하고, 테스트 `doSomething` 함수를 호출한 다음, 500ms 후에 액티비티를 소멸시킵니다. 이렇게 하면 `doSomething`에서 시작된 모든 코루틴이 취소됩니다. 액티비티 소멸 후에 메시지가 더 이상 출력되지 않는 것을 통해 이를 확인할 수 있습니다. 심지어 조금 더 기다려도 마찬가지입니다.

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*

class Activity {
    private val mainScope = CoroutineScope(Dispatchers.Default) // use Default for test purposes
    
    fun destroy() {
        mainScope.cancel()
    }

    fun doSomething() {
        // launch ten coroutines for a demo, each working for a different time
        repeat(10) { i ->
            mainScope.launch {
                delay((i + 1) * 200L) // variable delay 200ms, 400ms, ... etc
                println("Coroutine $i is done")
            }
        }
    }
} // class Activity ends

fun main() = runBlocking<Unit> {
//sampleStart
    val activity = Activity()
    activity.doSomething() // run test function
    println("Launched coroutines")
    delay(500L) // delay for half a second
    println("Destroying activity!")
    activity.destroy() // cancels all coroutines
    delay(1000) // visually confirm that they don't work
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-10.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-10.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 예제의 출력은 다음과 같습니다:

```text
Launched coroutines
Coroutine 0 is done
Coroutine 1 is done
Destroying activity!
```

<!--- TEST -->

보시다시피, 처음 두 개의 코루틴만 메시지를 출력하고 나머지는 `Activity.destroy()`에서 [`mainScope.cancel()`][CoroutineScope.cancel] 한 번의 호출로 취소됩니다.

> 안드로이드에는 라이프사이클을 가진 모든 엔티티에서 코루틴 스코프에 대한 1차 지원이 있다는 점에 유의하세요. [관련 문서](https://developer.android.com/topic/libraries/architecture/coroutines#lifecyclescope)를 참조하세요.
>
{style="note"}

### 스레드 로컬 데이터

때로는 코루틴 간에 스레드 로컬 데이터를 전달하는 것이 편리할 때가 있습니다. 그러나 코루틴은 특정 스레드에 묶이지 않으므로, 수동으로 처리하면 상투적인 코드(boilerplate)를 유발할 가능성이 높습니다.

[`ThreadLocal`](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html)의 경우, [asContextElement] 확장 함수가 도움이 됩니다. 이 함수는 주어진 `ThreadLocal`의 값을 유지하고 코루틴이 컨텍스트를 전환할 때마다 해당 값을 복원하는 추가적인 컨텍스트 요소를 생성합니다.

작동하는 모습을 보여주기 쉽습니다:

```kotlin
import kotlinx.coroutines.*

val threadLocal = ThreadLocal<String?>() // declare thread-local variable

fun main() = runBlocking<Unit> {
//sampleStart
    threadLocal.set("main")
    println("Pre-main, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
    val job = launch(Dispatchers.Default + threadLocal.asContextElement(value = "launch")) {
        println("Launch start, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
        yield()
        println("After yield, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
    }
    job.join()
    println("Post-main, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-context-11.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-context-11.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 예제에서는 [Dispatchers.Default]를 사용하여 백그라운드 스레드 풀에서 새 코루틴을 시작합니다. 따라서 스레드 풀의 다른 스레드에서 작동하지만, 코루틴이 어떤 스레드에서 실행되든 `threadLocal.asContextElement(value = "launch")`를 사용하여 지정한 스레드 로컬 변수의 값을 계속 가집니다.
따라서 ([디버그](#debugging-coroutines-and-threads)와 함께) 출력은 다음과 같습니다:

```text
Pre-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
Launch start, current thread: Thread[DefaultDispatcher-worker-1 @coroutine#2,5,main], thread local value: 'launch'
After yield, current thread: Thread[DefaultDispatcher-worker-2 @coroutine#2,5,main], thread local value: 'launch'
Post-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
```

<!--- TEST FLEXIBLE_THREAD -->

해당 컨텍스트 요소를 설정하는 것을 잊기 쉽습니다. 코루틴에서 접근하는 스레드 로컬 변수는 코루틴을 실행하는 스레드가 다를 경우 예상치 못한 값을 가질 수 있습니다. 이러한 상황을 피하기 위해 [ensurePresent] 메서드를 사용하여 부적절한 사용에 대해 즉시 실패(fail-fast)하도록 하는 것이 좋습니다.

`ThreadLocal`은 일등석(first-class) 지원을 받으며 `kotlinx.coroutines`가 제공하는 모든 원시 타입(primitive)과 함께 사용할 수 있습니다. 하지만 한 가지 중요한 제한 사항이 있습니다. 스레드 로컬이 변경되면 새 값이 코루틴 호출자에게 전파되지 않으며(컨텍스트 요소는 모든 `ThreadLocal` 객체 접근을 추적할 수 없기 때문), 업데이트된 값은 다음 중단 시 손실됩니다.
코루틴 내에서 스레드 로컬의 값을 업데이트하려면 [withContext]를 사용하세요. 자세한 내용은 [asContextElement]를 참조하세요.

대안으로, `class Counter(var i: Int)`와 같은 변경 가능한 박스(mutable box)에 값을 저장할 수 있으며, 이는 다시 스레드 로컬 변수에 저장됩니다. 그러나 이 경우, 이 변경 가능한 박스 안에 있는 변수에 대한 잠재적인 동시 수정을 동기화할 책임은 전적으로 사용자에게 있습니다.

고급 사용, 예를 들어 로깅 MDC, 트랜잭션 컨텍스트 또는 데이터를 전달하기 위해 내부적으로 스레드 로컬을 사용하는 다른 라이브러리와의 통합을 위해서는 구현해야 할 [ThreadContextElement] 인터페이스 문서를 참조하세요.

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[CoroutineDispatcher]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/index.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[Dispatchers.Unconfined]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-unconfined.html
[Dispatchers.Default]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html
[newSingleThreadContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/new-single-thread-context.html
[ExecutorCoroutineDispatcher.close]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-executor-coroutine-dispatcher/close.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[DEBUG_PROPERTY_NAME]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-d-e-b-u-g_-p-r-o-p-e-r-t-y_-n-a-m-e.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[isActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html
[CoroutineScope.coroutineContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/coroutine-context.html
[Job.join]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[CoroutineName]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-name/index.html
[CoroutineScope()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope.html
[MainScope()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main-scope.html
[Dispatchers.Main]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html
[CoroutineScope.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[asContextElement]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/as-context-element.html
[ensurePresent]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-present.html
[ThreadContextElement]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-thread-context-element/index.html

<!--- END -->