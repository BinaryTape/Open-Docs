<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 코루틴 기본 개념)

여러 태스크를 동시에 수행하는 애플리케이션(동시성(concurrency)으로 알려진 개념)을 만들려면
Kotlin은 _코루틴_을 사용합니다. 코루틴은 명확하고 순차적인 스타일로 동시성 코드를 작성할 수 있게 해주는 일시 중단 가능한 계산입니다.
코루틴은 다른 코루틴과 동시에, 잠재적으로는 병렬로 실행될 수 있습니다.

JVM 및 Kotlin/Native에서 코루틴과 같은 모든 동시성 코드는 운영 체제가 관리하는 _스레드_에서 실행됩니다.
코루틴은 스레드를 블록하는 대신 실행을 일시 중단할 수 있습니다.
이를 통해 한 코루틴은 일부 데이터가 도착하기를 기다리는 동안 일시 중단하고, 다른 코루틴은 동일한 스레드에서 실행되어 리소스의 효과적인 활용을 보장할 수 있습니다.

![Comparing parallel and concurrent threads](parallelism-and-concurrency.svg){width="700"}

코루틴과 스레드의 차이점에 대한 자세한 내용은 [코루틴과 JVM 스레드 비교](#comparing-coroutines-and-jvm-threads)를 참조하세요.

## 일시 중단 함수

코루틴의 가장 기본적인 구성 요소는 _일시 중단 함수_입니다.
이는 코드 구조에 영향을 주지 않고 실행 중인 작업을 일시 중지하고 나중에 재개할 수 있도록 합니다.

일시 중단 함수를 선언하려면 `suspend` 키워드를 사용합니다.

```kotlin
suspend fun greet() {
    println("Hello world from a suspending function")
}
```

일시 중단 함수는 다른 일시 중단 함수에서만 호출할 수 있습니다.
Kotlin 애플리케이션의 진입점에서 일시 중단 함수를 호출하려면 `main()` 함수에 `suspend` 키워드를 표시합니다.

```kotlin
suspend fun main() {
    showUserInfo()
}

suspend fun showUserInfo() {
    println("Loading user...")
    greet()
    println("User: John Smith")
}

suspend fun greet() {
    println("Hello world from a suspending function")
}
```
{kotlin-runnable="true"}

이 예제는 아직 동시성을 사용하지 않지만, 함수에 `suspend` 키워드를 표시함으로써
다른 일시 중단 함수를 호출하고 내부에서 동시성 코드를 실행할 수 있게 합니다.

`suspend` 키워드는 핵심 Kotlin 언어의 일부이지만, 대부분의 코루틴 기능은
[`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) 라이브러리를 통해 사용할 수 있습니다.

## 프로젝트에 kotlinx.coroutines 라이브러리 추가

프로젝트에 `kotlinx.coroutines` 라이브러리를 포함하려면 빌드 도구에 따라 해당 종속성 구성을 추가하세요.

<tabs group="build-tool">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
}
```
</tab>

<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlinx</groupId>
            <artifactId>kotlinx-coroutines-core</artifactId>
            <version>%coroutinesVersion%</version>
        </dependency>
    </dependencies>
    ...
</project>
```

</tab>
</tabs>

## 첫 번째 코루틴 생성

> 이 페이지의 예제에서는 코루틴 빌더 함수인 `CoroutineScope.launch()` 및 `CoroutineScope.async()`와 함께 명시적인 `this` 표현식을 사용합니다.
> 이러한 코루틴 빌더는 `CoroutineScope`의 [확장 함수](extensions.md)이며, `this` 표현식은 현재 `CoroutineScope`를 리시버로 참조합니다.
>
> 실용적인 예제는 [코루틴 스코프에서 코루틴 빌더 추출](#extract-coroutine-builders-from-the-coroutine-scope)을 참조하세요.
>
{style="note"}

Kotlin에서 코루틴을 생성하려면 다음이 필요합니다.

*   [일시 중단 함수](#suspending-functions).
*   예를 들어 `withContext()` 함수 내부와 같이 코루틴이 실행될 수 있는 [코루틴 스코프](#coroutine-scope-and-structured-concurrency).
*   코루틴을 시작하기 위한 `CoroutineScope.launch()`와 같은 [코루틴 빌더](#coroutine-builder-functions).
*   코루틴이 사용할 스레드를 제어하는 [디스패처](#coroutine-dispatchers).

여러 코루틴을 멀티스레드 환경에서 사용하는 예제를 살펴보겠습니다.

1.  `kotlinx.coroutines` 라이브러리를 임포트합니다.

    ```kotlin
    import kotlinx.coroutines.*
    ```

2.  일시 중지 및 재개할 수 있는 함수에 `suspend` 키워드를 표시합니다.

    ```kotlin
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
    }
    
    suspend fun main() {}
    ```

    > 일부 프로젝트에서는 `main()` 함수를 `suspend`로 표시할 수 있지만, 기존 코드와 통합하거나 프레임워크를 사용하는 경우에는 불가능할 수 있습니다.
    > 이 경우 프레임워크 문서에서 일시 중단 함수 호출을 지원하는지 확인하세요.
    > 지원하지 않는다면 [`runBlocking()`](#runblocking)을 사용하여 현재 스레드를 블록하면서 호출하세요.
    >
    {style="note"}

3.  데이터 가져오기 또는 데이터베이스 쓰기와 같은 일시 중단 작업을 시뮬레이션하기 위해 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html#) 함수를 추가합니다.

    ```kotlin
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
        delay(1000L)
    }
   ```

    <!-- > Use [`kotlin.time.Duration`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-duration/) from the Kotlin standard library to express durations like `delay(1.seconds)` instead of using milliseconds.
    >
    {style="tip"} -->

4.  공유 스레드 풀에서 실행되는 멀티스레드 동시성 코드의 진입점을 정의하기 위해 [`withContext(Dispatchers.Default)`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html#)를 사용합니다.

    ```kotlin
    suspend fun main() {
        withContext(Dispatchers.Default) {
            // Add the coroutine builders here
        }
    }
    ```

   > 일시 중단 함수인 `withContext()`는 일반적으로 [컨텍스트 전환](coroutine-context-and-dispatchers.md#jumping-between-threads)에 사용되지만, 이 예제에서는
   > 동시성 코드의 비블록킹 진입점도 정의합니다.
   > 이 함수는 [`Dispatchers.Default` 디스패처](#coroutine-dispatchers)를 사용하여 공유 스레드 풀에서 코드를 실행하여 멀티스레드 실행을 수행합니다.
   > 기본적으로 이 풀은 런타임에 사용 가능한 CPU 코어 수만큼의 스레드를 사용하며, 최소 두 개의 스레드를 사용합니다.
   >
   > `withContext()` 블록 내부에서 시작된 코루틴은 동일한 코루틴 스코프를 공유하며, 이는 [구조화된 동시성](#coroutine-scope-and-structured-concurrency)을 보장합니다.
   >
   {style="note"}

5.  [`CoroutineScope.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)와 같은 [코루틴 빌더 함수](#coroutine-builder-functions)를 사용하여 코루틴을 시작합니다.

    ```kotlin
    suspend fun main() {
        withContext(Dispatchers.Default) { // this: CoroutineScope
            // Starts a coroutine inside the scope with CoroutineScope.launch()
            this.launch { greet() }
            println("The withContext() on the thread: ${Thread.currentThread().name}")
        }
    }
    ```

6.  이러한 조각들을 결합하여 공유 스레드 풀에서 여러 코루틴을 동시에 실행합니다.

    ```kotlin
    // Imports the coroutines library
    import kotlinx.coroutines.*

    // Imports the kotlin.time.Duration to express duration in seconds
    import kotlin.time.Duration.Companion.seconds

    // Defines a suspending function
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
        // Suspends for 1 second and releases the thread
        delay(1.seconds) 
        // The delay() function simulates a suspending API call here
        // You can add suspending API calls here like a network request
    }

    suspend fun main() {
        // Runs the code inside this block on a shared thread pool
        withContext(Dispatchers.Default) { // this: CoroutineScope
            this.launch() {
                greet()
            }
   
            // Starts another coroutine
            this.launch() {
                println("The CoroutineScope.launch() on the thread: ${Thread.currentThread().name}")
                delay(1.seconds)
                // The delay function simulates a suspending API call here
                // You can add suspending API calls here like a network request
            }
    
            println("The withContext() on the thread: ${Thread.currentThread().name}")
        }
    }
    ```
    {kotlin-runnable="true"}

이 예제를 여러 번 실행해 보세요.
프로그램을 실행할 때마다 출력 순서와 스레드 이름이 변경될 수 있음을 알 수 있습니다. 이는 OS가 스레드가 실행될 시기를 결정하기 때문입니다.

> 추가 정보를 위해 코드 출력에서 스레드 이름 옆에 코루틴 이름을 표시할 수 있습니다.
> 이렇게 하려면 빌드 도구 또는 IDE 실행 구성에서 `-Dkotlinx.coroutines.debug` VM 옵션을 전달하세요.
>
> 자세한 내용은 [코루틴 디버깅](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/topics/debugging.md)을 참조하세요.
>
{style="tip"}

## 코루틴 스코프와 구조화된 동시성

애플리케이션에서 많은 코루틴을 실행할 때, 이들을 그룹으로 관리하는 방법이 필요합니다.
Kotlin 코루틴은 이러한 구조를 제공하기 위해 _구조화된 동시성_이라는 원칙에 의존합니다.

이 원칙에 따라 코루틴은 연결된 수명 주기를 가진 부모-자식 태스크의 트리 계층 구조를 형성합니다.
코루틴의 수명 주기는 생성부터 완료, 실패 또는 취소에 이르는 상태의 시퀀스입니다.

부모 코루틴은 자식 코루틴이 완료될 때까지 기다린 후 종료됩니다.
부모 코루틴이 실패하거나 취소되면 모든 자식 코루틴도 재귀적으로 취소됩니다.
이러한 방식으로 코루틴을 연결하면 취소 및 오류 처리가 예측 가능하고 안전해집니다.

구조화된 동시성을 유지하려면 새 코루틴은 수명 주기를 정의하고 관리하는 [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) 내에서만 시작될 수 있습니다.
`CoroutineScope`에는 디스패처 및 기타 실행 속성을 정의하는 _코루틴 컨텍스트_가 포함됩니다.
다른 코루틴 내부에서 코루틴을 시작하면 자동으로 부모 스코프의 자식이 됩니다.

`CoroutineScope`에서 `CoroutineScope.launch()`와 같은 [코루틴 빌더 함수](#coroutine-builder-functions)를 호출하면 해당 스코프와 연결된 코루틴의 자식 코루틴이 시작됩니다.
빌더 블록 내부에서 [리시버](lambdas.md#function-literals-with-receiver)는 중첩된 `CoroutineScope`이므로, 그곳에서 시작하는 모든 코루틴은 해당 `CoroutineScope`의 자식이 됩니다.

### `coroutineScope()` 함수로 코루틴 스코프 생성

현재 코루틴 컨텍스트로 새 코루틴 스코프를 생성하려면
[`coroutineScope()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html) 함수를 사용합니다.
이 함수는 코루틴 서브트리의 루트 코루틴을 생성합니다.
이 함수는 블록 내부에서 시작된 코루틴의 직접적인 부모이며, 해당 코루틴이 시작하는 모든 코루틴의 간접적인 부모입니다.
`coroutineScope()`는 일시 중단 블록을 실행하고, 해당 블록과 그 안에서 시작된 모든 코루틴이 완료될 때까지 기다립니다.

다음은 예제입니다.

```kotlin
// Imports the kotlin.time.Duration to express duration in seconds
import kotlin.time.Duration.Companion.seconds

import kotlinx.coroutines.*

// If the coroutine context doesn't specify a dispatcher,
// CoroutineScope.launch() uses Dispatchers.Default
//sampleStart
suspend fun main() {
    // Root of the coroutine subtree
    coroutineScope { // this: CoroutineScope
        this.launch {
            this.launch {
                delay(2.seconds)
                println("Child of the enclosing coroutine completed")
            }
            println("Child coroutine 1 completed")
        }
        this.launch {
            delay(1.seconds)
            println("Child coroutine 2 completed")
        }
    }
    // Runs only after all children in the coroutineScope have completed
    println("Coroutine scope completed")
}
//sampleEnd
```
{kotlin-runnable="true"}

이 예제에서 지정된 [디스패처](#coroutine-dispatchers)가 없으므로 `coroutineScope()` 블록 내의 `CoroutineScope.launch()` 빌더 함수는 현재 컨텍스트를 상속합니다.
해당 컨텍스트에 지정된 디스패처가 없으면 `CoroutineScope.launch()`는 공유 스레드 풀에서 실행되는 `Dispatchers.Default`를 사용합니다.

### 코루틴 스코프에서 코루틴 빌더 추출

경우에 따라 [`CoroutineScope.launch()`](#coroutinescope-launch)와 같은 코루틴 빌더 호출을 별도의 함수로 추출할 수 있습니다.

다음 예제를 살펴보세요.

```kotlin
suspend fun main() {
    coroutineScope { // this: CoroutineScope
        // Calls CoroutineScope.launch() where CoroutineScope is the receiver
        this.launch { println("1") }
        this.launch { println("2") }
    } 
}
```

> 명시적인 `this` 표현식 없이 `launch`로 `this.launch`를 작성할 수도 있습니다.
> 이 예제들은 `CoroutineScope`의 확장 함수임을 강조하기 위해 명시적인 `this` 표현식을 사용합니다.
>
> Kotlin에서 리시버가 있는 람다가 어떻게 작동하는지에 대한 자세한 내용은 [리시버가 있는 함수 리터럴](lambdas.md#function-literals-with-receiver)을 참조하세요.
>
{style="tip"}

`coroutineScope()` 함수는 `CoroutineScope` 리시버를 가진 람다를 받습니다.
이 람다 내부에서 암시적 리시버는 `CoroutineScope`이므로, `CoroutineScope.launch()` 및 [`CoroutineScope.async()`](#coroutinescope-async)와 같은 빌더 함수는 해당 리시버의 [확장 함수](extensions.md#extension-functions)로 해결됩니다.

코루틴 빌더를 다른 함수로 추출하려면 해당 함수가 `CoroutineScope` 리시버를 선언해야 합니다. 그렇지 않으면 컴파일 오류가 발생합니다.

```kotlin
import kotlinx.coroutines.*
//sampleStart
suspend fun main() {
    coroutineScope {
        launchAll()
    }
}

fun CoroutineScope.launchAll() { // this: CoroutineScope
    // Calls .launch() on CoroutineScope
    this.launch { println("1") }
    this.launch { println("2") } 
}
//sampleEnd
/* -- Calling launch without declaring CoroutineScope as the receiver results in a compilation error --

fun launchAll() {
    // Compilation error: this is not defined
    this.launch { println("1") }
    this.launch { println("2") }
}
 */
```
{kotlin-runnable="true"}

## 코루틴 빌더 함수

코루틴 빌더 함수는 실행할 코루틴을 정의하는 `suspend` [람다](lambdas.md)를 받는 함수입니다.
다음은 몇 가지 예시입니다.

*   [`CoroutineScope.launch()`](#coroutinescope-launch)
*   [`CoroutineScope.async()`](#coroutinescope-async)
*   [`runBlocking()`](#runblocking)
*   [`withContext()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html)
*   [`coroutineScope()`](#create-a-coroutine-scope-with-the-coroutinescope-function)

코루틴 빌더 함수는 실행할 `CoroutineScope`를 필요로 합니다.
이는 기존 스코프이거나 `coroutineScope()`, [`runBlocking()`](#runblocking), 또는 [`withContext()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html#)와 같은 도우미 함수로 생성한 스코프일 수 있습니다.
각 빌더는 코루틴이 어떻게 시작하고 결과와 어떻게 상호작용하는지를 정의합니다.

### `CoroutineScope.launch()`

[`CoroutineScope.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html#) 코루틴 빌더 함수는 `CoroutineScope`의 확장 함수입니다.
이 함수는 기존 [코루틴 스코프](#coroutine-scope-and-structured-concurrency) 내에서 나머지 스코프를 블록하지 않고 새 코루틴을 시작합니다.

결과가 필요 없거나 결과를 기다리고 싶지 않을 때 다른 작업과 함께 태스크를 실행하려면 `CoroutineScope.launch()`를 사용합니다.

```kotlin
// Imports the kotlin.time.Duration to enable expressing duration in milliseconds
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

suspend fun main() {
    withContext(Dispatchers.Default) {
        performBackgroundWork()
    }
}

//sampleStart
suspend fun performBackgroundWork() = coroutineScope { // this: CoroutineScope
    // Starts a coroutine that runs without blocking the scope
    this.launch {
        // Suspends to simulate background work
        delay(100.milliseconds)
        println("Sending notification in background")
    }

    // Main coroutine continues while a previous one suspends
    println("Scope continues")
}
//샘플 끝
```
{kotlin-runnable="true"}

이 예제를 실행한 후, `main()` 함수가 `CoroutineScope.launch()`에 의해 블록되지 않고 코루틴이 백그라운드에서 작업하는 동안 다른 코드를 계속 실행하는 것을 볼 수 있습니다.

> `CoroutineScope.launch()` 함수는 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 핸들을 반환합니다.
> 시작된 코루틴이 완료될 때까지 기다리려면 이 핸들을 사용합니다.
> 자세한 내용은 [취소 및 타임아웃](cancellation-and-timeouts.md#cancelling-coroutine-execution)을 참조하세요.
>
{style="tip"}

### `CoroutineScope.async()`

[`CoroutineScope.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 코루틴 빌더 함수는 `CoroutineScope`의 확장 함수입니다.
이 함수는 기존 [코루틴 스코프](#coroutine-scope-and-structured-concurrency) 내에서 동시 계산을 시작하고, 최종 결과를 나타내는 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/) 핸들을 반환합니다.
결과가 준비될 때까지 코드를 일시 중단하려면 `.await()` 함수를 사용합니다.

```kotlin
// Imports the kotlin.time.Duration to enable expressing duration in milliseconds
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

//sampleStart
suspend fun main() = withContext(Dispatchers.Default) { // this: CoroutineScope
    // Starts downloading the first page
    val firstPage = this.async {
        delay(50.milliseconds)
        "First page"
    }

    // Starts downloading the second page in parallel
    val secondPage = this.async {
        delay(100.milliseconds)
        "Second page"
    }

    // Awaits both results and compares them
    val pagesAreEqual = firstPage.await() == secondPage.await()
    println("Pages are equal: $pagesAreEqual")
}
//샘플 끝
```
{kotlin-runnable="true"}

### `runBlocking()`

[`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 코루틴 빌더 함수는 코루틴 스코프를 생성하고, 해당 스코프에서 시작된 코루틴이 완료될 때까지 현재 [스레드](#comparing-coroutines-and-jvm-threads)를 블록합니다.

비일시 중단 코드에서 일시 중단 코드를 호출할 다른 방법이 없을 때만 `runBlocking()`을 사용하세요.

```kotlin
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.*

// A third-party interface you can't change
interface Repository {
    fun readItem(): Int
}

object MyRepository : Repository {
    override fun readItem(): Int {
        // Bridges to a suspending function
        return runBlocking {
            myReadItem()
        }
    }
}

suspend fun myReadItem(): Int {
    delay(100.milliseconds)
    return 4
}
```

## 코루틴 디스패처

[_코루틴 디스패처_](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/#)는 코루틴 실행에 어떤 스레드 또는 스레드 풀을 사용할지 제어합니다.
코루틴이 항상 단일 스레드에 묶여 있는 것은 아닙니다.
디스패처에 따라 한 스레드에서 일시 중단하고 다른 스레드에서 재개할 수 있습니다.
이를 통해 각 코루틴에 별도의 스레드를 할당하지 않고도 많은 코루틴을 동시에 실행할 수 있습니다.

> 코루틴이 다른 스레드에서 일시 중단하고 재개할 수 있음에도 불구하고,
> 코루틴이 일시 중단되기 전에 작성된 값은 코루틴이 재개될 때 여전히 동일한 코루틴 내에서 사용 가능하도록 보장됩니다.
>
{style="tip"}

디스패처는 [코루틴 스코프](#coroutine-scope-and-structured-concurrency)와 함께 작동하여 코루틴이 언제 어디서 실행될지 정의합니다.
코루틴 스코프가 코루틴의 수명 주기를 제어하는 반면, 디스패처는 실행에 사용되는 스레드를 제어합니다.

> 모든 코루틴에 디스패처를 지정할 필요는 없습니다.
> 기본적으로 코루틴은 부모 스코프로부터 디스패처를 상속받습니다.
> 다른 컨텍스트에서 코루틴을 실행하려면 디스패처를 지정할 수 있습니다.
>
> 코루틴 컨텍스트에 디스패처가 포함되어 있지 않으면 코루틴 빌더는 `Dispatchers.Default`를 사용합니다.
>
{style="note"}

`kotlinx.coroutines` 라이브러리에는 다양한 사용 사례를 위한 여러 디스패처가 포함되어 있습니다.
예를 들어, [`Dispatchers.Default`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html)는 공유 스레드 풀에서 코루틴을 실행하여 메인 스레드와 별도로 백그라운드에서 작업을 수행합니다. 따라서 데이터 처리와 같은 CPU 집약적인 작업에 이상적인 선택입니다.

`CoroutineScope.launch()`와 같은 코루틴 빌더에 디스패처를 지정하려면 인수로 전달합니다.

```kotlin
suspend fun runWithDispatcher() = coroutineScope { // this: CoroutineScope
    this.launch(Dispatchers.Default) {
        println("Running on ${Thread.currentThread().name}")
    }
}
```

또는 `withContext()` 블록을 사용하여 해당 블록 내의 모든 코드를 지정된 디스패처에서 실행할 수 있습니다.

```kotlin
// Imports the kotlin.time.Duration to enable expressing duration in milliseconds
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

//sampleStart
suspend fun main() = withContext(Dispatchers.Default) { // this: CoroutineScope
    println("Running withContext block on ${Thread.currentThread().name}")

    val one = this.async {
        println("First calculation starting on ${Thread.currentThread().name}")
        val sum = (1L..500_000L).sum()
        delay(200L)
        println("First calculation done on ${Thread.currentThread().name}")
        sum
    }

    val two = this.async {
        println("Second calculation starting on ${Thread.currentThread().name}")
        val sum = (500_001L..1_000_000L).sum()
        println("Second calculation done on ${Thread.currentThread().name}")
        sum
    }

    // Waits for both calculations and prints the result
    println("Combined total: ${one.await() + two.await()}")
}
//샘플 끝
```
{kotlin-runnable="true"}

코루틴 디스패처 및 그 용도(예: [`Dispatchers.IO`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-i-o.html) 및 [`Dispatchers.Main`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main.html)와 같은 다른 디스패처 포함)에 대해 자세히 알아보려면 [코루틴 컨텍스트 및 디스패처](coroutine-context-and-dispatchers.md)를 참조하세요.

## 코루틴과 JVM 스레드 비교

코루틴은 JVM의 스레드처럼 코드를 동시에 실행하는 일시 중단 가능한 계산이지만, 내부적으로는 다르게 작동합니다.

_스레드_는 운영 체제에서 관리합니다. 스레드는 여러 CPU 코어에서 태스크를 병렬로 실행할 수 있으며, JVM에서 동시성을 처리하는 표준 접근 방식을 나타냅니다.
스레드를 생성하면 운영 체제는 해당 스택에 메모리를 할당하고 커널을 사용하여 스레드 간에 전환합니다.
이것은 스레드를 강력하게 만들지만 리소스 집약적이기도 합니다.
각 스레드는 일반적으로 몇 메가바이트의 메모리를 필요로 하며, 일반적으로 JVM은 한 번에 수천 개의 스레드만 처리할 수 있습니다.

반면에 코루틴은 특정 스레드에 묶여 있지 않습니다.
코루틴은 한 스레드에서 일시 중단하고 다른 스레드에서 재개할 수 있으므로, 많은 코루틴이 동일한 스레드 풀을 공유할 수 있습니다.
코루틴이 일시 중단되면 스레드는 블록되지 않고 다른 태스크를 실행할 수 있는 상태를 유지합니다.
이것은 코루틴을 스레드보다 훨씬 가볍게 만들고, 시스템 리소스를 소진하지 않고도 하나의 프로세스에서 수백만 개의 코루틴을 실행할 수 있게 합니다.

![Comparing coroutines and threads](coroutines-and-threads.svg){width="700"}

각각 5초를 기다린 다음 마침표(` . `)를 출력하는 50,000개의 코루틴 예제를 살펴보겠습니다.

```kotlin
import kotlin.time.Duration.Companion.seconds
import kotlinx.coroutines.*

suspend fun main() {
    withContext(Dispatchers.Default) {
        // Launches 50,000 coroutines that each wait five seconds, then print a period
        printPeriods()
    }
}

//sampleStart
suspend fun printPeriods() = coroutineScope { // this: CoroutineScope
    // Launches 50,000 coroutines that each wait five seconds, then print a period
    repeat(50_000) {
        this.launch {
            delay(5.seconds)
            print(".")
        }
    }
}
//샘플 끝
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이제 JVM 스레드를 사용하는 동일한 예제를 살펴보겠습니다.

```kotlin
import kotlin.concurrent.thread

fun main() {
    repeat(50_000) {
        thread {
            Thread.sleep(5000L)
            print(".")
        }
    }
}
```
{kotlin-runnable="true" validate="false"}

이 버전을 실행하면 각 스레드가 자체 메모리 스택을 필요로 하므로 훨씬 더 많은 메모리를 사용합니다.
50,000개의 스레드의 경우 최대 100GB가 될 수 있으며, 동일한 수의 코루틴의 경우 약 500MB와 비교됩니다.

운영 체제, JDK 버전 및 설정에 따라 JVM 스레드 버전은 메모리 부족 오류를 발생시키거나 한 번에 너무 많은 스레드가 실행되지 않도록 스레드 생성을 늦출 수 있습니다.

## 다음 단계

*   [일시 중단 함수 구성](composing-suspending-functions.md)에서 일시 중단 함수를 결합하는 방법에 대해 자세히 알아보세요.
*   [취소 및 타임아웃](cancellation-and-timeouts.md)에서 코루틴을 취소하고 타임아웃을 처리하는 방법을 알아보세요.
*   [코루틴 컨텍스트 및 디스패처](coroutine-context-and-dispatchers.md)에서 코루틴 실행 및 스레드 관리에 대해 더 자세히 알아보세요.
*   [비동기 흐름](flow.md)에서 여러 비동기적으로 계산된 값을 반환하는 방법을 알아보세요.