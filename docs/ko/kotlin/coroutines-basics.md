<!--- TEST_NAME BasicsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 코루틴 기본 개념)

이 섹션에서는 코루틴의 기본 개념을 다룹니다.

## 첫 번째 코루틴

_코루틴_은 일시 중단 가능한 계산의 인스턴스입니다. 이는 나머지 코드와 동시에 작동하는 코드 블록을 실행한다는 점에서 스레드와 개념적으로 유사합니다. 하지만 코루틴은 특정 스레드에 묶여 있지 않습니다. 한 스레드에서 실행을 일시 중단하고 다른 스레드에서 재개할 수 있습니다.

코루틴은 경량 스레드로 생각할 수 있지만, 실제 사용 방식이 스레드와 매우 다른 여러 중요한 차이점이 있습니다.

다음 코드를 실행하여 첫 번째 작동 코루틴을 만들어보세요.

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { // 새로운 코루틴을 시작하고 계속 진행
        delay(1000L) // 1초 동안 논블로킹 지연 (기본 시간 단위는 밀리초)
        println("World!") // 지연 후 출력
    }
    println("Hello") // 이전 코루틴이 지연되는 동안 메인 코루틴은 계속 진행
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-01.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-01.kt)에서 확인할 수 있습니다.
>
{style="note"}

다음과 같은 결과를 확인할 수 있습니다.

```text
Hello
World!
```

<!--- TEST -->

이 코드가 무엇을 하는지 자세히 살펴보겠습니다.

`[launch]`는 _코루틴 빌더_입니다. 이는 나머지 코드와 동시에 새로운 코루틴을 시작하며, 이 코루틴은 독립적으로 계속 작동합니다. 그래서 `Hello`가 먼저 출력되었습니다.

`[delay]`는 특별한 _일시 중단 함수_입니다. 이는 특정 시간 동안 코루틴을 _일시 중단_합니다. 코루틴을 일시 중단하는 것은 기본 스레드를 _블록_하지 않고, 다른 코루틴이 실행되어 기본 스레드를 사용하여 코드를 실행하도록 허용합니다.

`[runBlocking]` 또한 일반적인 `fun main()`의 비 코루틴 세계와 `runBlocking { ... }` 중괄호 내부의 코루틴이 있는 코드를 연결하는 코루틴 빌더입니다. 이는 `runBlocking` 시작 중괄호 바로 뒤에 있는 `this: CoroutineScope` 힌트를 통해 IDE에서 강조 표시됩니다.

이 코드에서 `runBlocking`을 제거하거나 잊어버리면, `launch`는 `[CoroutineScope]`에만 선언되어 있기 때문에 `[launch]` 호출에서 오류가 발생합니다.

```
Unresolved reference: launch
```

`runBlocking`의 이름은 이를 실행하는 스레드(이 경우 — 메인 스레드)가 `runBlocking { ... }` 내부의 모든 코루틴이 실행을 완료할 때까지 호출 기간 동안 _블록_된다는 것을 의미합니다. `runBlocking`은 애플리케이션의 최상위 레벨에서 이처럼 사용되는 경우가 많으며, 실제 코드에서는 거의 볼 수 없습니다. 스레드는 비용이 많이 드는 리소스이며, 스레드를 블록하는 것은 비효율적이고 종종 바람직하지 않기 때문입니다.

### 구조화된 동시성

코루틴은 **구조화된 동시성** 원칙을 따릅니다. 이는 새로운 코루틴이 코루틴의 수명을 제한하는 특정 `[CoroutineScope]` 내에서만 시작될 수 있음을 의미합니다. 위 예시는 `[runBlocking]`이 해당 스코프를 설정함을 보여주며, 그래서 이전 예시는 1초 지연 후 `World!`가 출력될 때까지 기다린 다음 종료됩니다.

실제 애플리케이션에서는 많은 코루틴을 시작하게 될 것입니다. 구조화된 동시성은 코루틴이 손실되거나 누수되지 않도록 보장합니다. 외부 스코프는 모든 자식 코루틴이 완료될 때까지 완료될 수 없습니다. 또한 구조화된 동시성은 코드의 모든 오류가 적절하게 보고되고 절대 손실되지 않도록 보장합니다.

## 함수 추출 리팩토링

`launch { ... }` 내부의 코드 블록을 별도의 함수로 추출해봅시다. 이 코드에 대해 "함수 추출" 리팩토링을 수행하면, `suspend` 수정자가 붙은 새로운 함수를 얻게 됩니다. 이것이 첫 번째 _일시 중단 함수_입니다. 일시 중단 함수는 일반 함수와 마찬가지로 코루틴 내부에서 사용할 수 있지만, 추가적인 기능은 다른 일시 중단 함수(이 예시의 `delay`처럼)를 사용하여 코루틴의 실행을 _일시 중단_할 수 있다는 점입니다.

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { doWorld() }
    println("Hello")
}

// 이것이 첫 번째 일시 중단 함수입니다.
suspend fun doWorld() {
    delay(1000L)
    println("World!")
}
//샘플 끝
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-02.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-02.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST
Hello
World!
-->

## 스코프 빌더

다른 빌더가 제공하는 코루틴 스코프 외에도, `[coroutineScope][_coroutineScope]` 빌더를 사용하여 자신만의 스코프를 선언할 수 있습니다. 이는 코루틴 스코프를 생성하며, 시작된 모든 자식 코루틴이 완료될 때까지 완료되지 않습니다.

`[runBlocking]`과 `[coroutineScope][_coroutineScope]` 빌더는 본문과 모든 자식 코루틴이 완료될 때까지 기다리기 때문에 비슷해 보일 수 있습니다. 주요 차이점은 `[runBlocking]` 메서드는 대기하는 동안 현재 스레드를 _블록_하는 반면, `[coroutineScope][_coroutineScope]`는 단순히 일시 중단하여 기본 스레드를 다른 용도로 사용할 수 있게 해준다는 점입니다. 이러한 차이 때문에 `[runBlocking]`은 일반 함수이고 `[coroutineScope][_coroutineScope]`는 일시 중단 함수입니다.

어떤 일시 중단 함수에서도 `coroutineScope`를 사용할 수 있습니다. 예를 들어, `Hello`와 `World`의 동시 출력을 `suspend fun doWorld()` 함수로 옮길 수 있습니다.

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking {
    doWorld()
}

suspend fun doWorld() = coroutineScope {  // this: CoroutineScope
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-03.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-03.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드도 다음과 같이 출력합니다.

```text
Hello
World!
```

<!--- TEST -->

## 스코프 빌더와 동시성

`[coroutineScope][_coroutineScope]` 빌더는 여러 동시 작업을 수행하기 위해 모든 일시 중단 함수 내에서 사용될 수 있습니다. `doWorld` 일시 중단 함수 내에서 두 개의 동시 코루틴을 시작해봅시다.

```kotlin
import kotlinx.coroutines.*

//sampleStart
// doWorld를 순차적으로 실행한 다음 "Done"을 실행
fun main() = runBlocking {
    doWorld()
    println("Done")
}

// 두 섹션을 동시에 실행
suspend fun doWorld() = coroutineScope { // this: CoroutineScope
    launch {
        delay(2000L)
        println("World 2")
    }
    launch {
        delay(1000L)
        println("World 1")
    }
    println("Hello")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-04.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-04.kt)에서 확인할 수 있습니다.
>
{style="note"}

`launch { ... }` 블록 내부의 두 코드 조각은 _동시에_ 실행되며, 시작 후 1초 뒤에 `World 1`이 먼저 출력되고, 2초 뒤에 `World 2`가 출력됩니다. `doWorld` 내의 `[coroutineScope][_coroutineScope]`는 둘 다 완료된 후에야 완료되므로, `doWorld`는 그 후에야 반환되고 `Done` 문자열이 출력되도록 허용합니다.

```text
Hello
World 1
World 2
Done
```

<!--- TEST -->

## 명시적 잡(Job)

`[launch]` 코루틴 빌더는 시작된 코루틴에 대한 핸들이며 그 완료를 명시적으로 기다리는 데 사용될 수 있는 `[Job]` 객체를 반환합니다. 예를 들어, 자식 코루틴의 완료를 기다린 다음 "Done" 문자열을 출력할 수 있습니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch { // 새로운 코루틴을 시작하고 해당 Job에 대한 참조 유지
        delay(1000L)
        println("World!")
    }
    println("Hello")
    job.join() // 자식 코루틴이 완료될 때까지 대기
    println("Done") 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-05.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-05.kt)에서 확인할 수 있습니다.
>
{style="note"}

이 코드는 다음을 생성합니다.

```text
Hello
World!
Done
```

<!--- TEST -->

## 코루틴은 경량이다

코루틴은 JVM 스레드보다 리소스 집약적이지 않습니다. 스레드를 사용할 때 JVM의 가용 메모리를 소모시키는 코드를 리소스 제한에 도달하지 않고 코루틴을 사용하여 표현할 수 있습니다. 예를 들어, 다음 코드는 각각 5초를 기다린 다음 마침표('.')를 출력하면서 아주 적은 메모리를 소비하는 50,000개의 고유한 코루틴을 시작합니다.

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    repeat(50_000) { // 많은 코루틴 시작
        launch {
            delay(5000L)
            print(".")
        }
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-06.kt -->
> 전체 코드는 [여기](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-06.kt)에서 확인할 수 있습니다.
>
{style="note"}

<!--- TEST lines.size == 1 && lines[0] == ".".repeat(50_000) -->

스레드를 사용하여 동일한 프로그램을 작성하면(`runBlocking`을 제거하고, `launch`를 `thread`로 바꾸고, `delay`를 `Thread.sleep`으로 바꾸면) 많은 메모리를 소비할 것입니다. 운영 체제, JDK 버전 및 설정에 따라, 메모리 부족 오류를 발생시키거나 스레드를 천천히 시작하여 동시에 실행되는 스레드가 너무 많지 않도록 할 것입니다.

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html

<!--- END -->