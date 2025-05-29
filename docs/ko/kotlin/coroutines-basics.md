<!--- TEST_NAME BasicsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 코루틴 기초)

이 섹션에서는 기본적인 코루틴 개념을 다룹니다.

## 첫 번째 코루틴

_코루틴_은 일시 중단 가능한 연산의 인스턴스입니다. 이는 다른 코드와 동시에 작동하는 코드 블록을 실행한다는 점에서 스레드와 개념적으로 유사합니다. 하지만 코루틴은 특정 스레드에 묶여 있지 않습니다. 한 스레드에서 실행을 일시 중단하고 다른 스레드에서 재개할 수 있습니다.

코루틴은 경량 스레드로 간주될 수 있지만, 실제 사용 방식이 스레드와 매우 달라지는 몇 가지 중요한 차이점이 있습니다.

첫 번째 동작하는 코루틴을 얻으려면 다음 코드를 실행하세요:

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { // launch a new coroutine and continue
        delay(1000L) // non-blocking delay for 1 second (default time unit is ms)
        println("World!") // print after delay
    }
    println("Hello") // main coroutine continues while a previous one is delayed
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-01.kt -->
> 전체 코드는 [여기서](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-01.kt) 확인할 수 있습니다.
>
{style="note"}

다음과 같은 결과를 볼 수 있습니다:

```text
Hello
World!
```

<!--- TEST -->

이 코드가 무엇을 하는지 자세히 살펴보겠습니다.

`[launch]`는 `_코루틴 빌더_`입니다. 이는 다른 코드와 독립적으로 계속 작동하면서 새로운 코루틴을 동시에 실행합니다. 그래서 `Hello`가 먼저 출력된 것입니다.

`[delay]`는 특별한 `_일시 중단 함수_`입니다. 이는 코루틴을 특정 시간 동안 `_일시 중단_`합니다. 코루틴을 일시 중단하는 것은 기저 스레드를 `_블록_`하지 않으며, 다른 코루틴이 실행되고 해당 코드를 위해 기저 스레드를 사용하도록 허용합니다.

`[runBlocking]` 또한 일반적인 `fun main()`의 비-코루틴 세계와 `runBlocking { ... }` 중괄호 내부의 코루틴 코드를 연결하는 코루틴 빌더입니다. 이는 IDE에서 `runBlocking` 여는 중괄호 바로 뒤에 나타나는 `this: CoroutineScope` 힌트로 강조됩니다.

이 코드에서 `runBlocking`을 제거하거나 잊어버리면, `launch`가 `[CoroutineScope]`에서만 선언되기 때문에 `[launch]` 호출에서 오류가 발생합니다:

```
Unresolved reference: launch
```

`runBlocking`이라는 이름은 이를 실행하는 스레드(이 경우 &mdash; 메인 스레드)가 `runBlocking { ... }` 내부의 모든 코루틴이 실행을 완료할 때까지 호출 지속 시간 동안 `_블록_`된다는 것을 의미합니다. 스레드는 값비싼 자원이며, 이를 블록하는 것은 비효율적이고 종종 바람직하지 않기 때문에, `runBlocking`은 애플리케이션의 최상위 레벨에서 자주 사용되지만 실제 코드 내부에서는 거의 볼 수 없습니다.

### 구조화된 동시성

코루틴은 `**구조화된 동시성**` 원칙을 따릅니다. 이는 새로운 코루틴이 코루틴의 생명주기를 제한하는 특정 `[CoroutineScope]` 내에서만 실행될 수 있음을 의미합니다. 위 예제는 `[runBlocking]`이 해당 스코프를 설정하며, 이것이 이전 예제가 1초 지연 후 `World!`가 출력될 때까지 기다렸다가 종료되는 이유입니다.

실제 애플리케이션에서는 많은 코루틴을 실행할 것입니다. 구조화된 동시성은 코루틴이 사라지거나 누수되지 않도록 보장합니다. 외부 스코프는 모든 자식 코루틴이 완료될 때까지 완료될 수 없습니다. 또한 구조화된 동시성은 코드의 모든 오류가 적절하게 보고되고 절대 손실되지 않도록 보장합니다.

## 함수 추출 리팩토링

`launch { ... }` 내부의 코드 블록을 별도의 함수로 추출해봅시다. 이 코드에 "함수 추출" 리팩토링을 수행하면 `suspend` 변경자가 붙은 새로운 함수를 얻게 됩니다. 이것이 첫 번째 `_일시 중단 함수_`입니다. 일시 중단 함수는 일반 함수처럼 코루틴 내부에서 사용될 수 있지만, 추가적인 기능은 다른 일시 중단 함수(이 예제에서는 `delay`와 같은)를 사용하여 코루틴의 실행을 `_일시 중단_`할 수 있다는 것입니다.

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
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-02.kt -->
> 전체 코드는 [여기서](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-02.kt) 확인할 수 있습니다.
>
{style="note"}

<!--- TEST
Hello
World!
-->

## 스코프 빌더

다양한 빌더가 제공하는 코루틴 스코프 외에도, `[coroutineScope][_coroutineScope]` 빌더를 사용하여 자신만의 스코프를 선언할 수 있습니다. 이는 코루틴 스코프를 생성하며, 실행된 모든 자식이 완료될 때까지 완료되지 않습니다.

`[runBlocking]`과 `[coroutineScope][_coroutineScope]` 빌더는 둘 다 자신의 본문과 모든 자식이 완료될 때까지 기다리기 때문에 비슷해 보일 수 있습니다. 주요 차이점은 `[runBlocking]` 메서드는 대기하는 동안 현재 스레드를 `_블록_`하는 반면, `[coroutineScope][_coroutineScope]`는 단순히 일시 중단하여 기저 스레드를 다른 용도로 사용할 수 있도록 해제한다는 것입니다. 이러한 차이 때문에 `[runBlocking]`은 일반 함수이고 `[coroutineScope][_coroutineScope]`는 일시 중단 함수입니다.

어떤 일시 중단 함수에서도 `coroutineScope`를 사용할 수 있습니다. 예를 들어, `Hello`와 `World`를 동시에 출력하는 코드를 `suspend fun doWorld()` 함수로 옮길 수 있습니다:

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
> 전체 코드는 [여기서](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-03.kt) 확인할 수 있습니다.
>
{style="note"}

이 코드 또한 다음을 출력합니다:

```text
Hello
World!
```

<!--- TEST -->

## 스코프 빌더와 동시성

`[coroutineScope][_coroutineScope]` 빌더는 여러 동시 작업을 수행하기 위해 어떤 일시 중단 함수 내부에서도 사용될 수 있습니다. `doWorld` 일시 중단 함수 내에서 두 개의 동시 코루틴을 실행해봅시다:

```kotlin
import kotlinx.coroutines.*

//sampleStart
// doWorld를 순차적으로 실행한 다음 "Done"을 실행합니다.
fun main() = runBlocking {
    doWorld()
    println("Done")
}

// 두 섹션을 동시에 실행합니다.
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
> 전체 코드는 [여기서](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-04.kt) 확인할 수 있습니다.
>
{style="note"}

`launch { ... }` 블록 내부의 두 코드 조각은 `_동시에_` 실행됩니다. 시작 후 1초 뒤에 `World 1`이 먼저 출력되고, 그 다음 시작 후 2초 뒤에 `World 2`가 출력됩니다. `doWorld` 내부의 `[coroutineScope][_coroutineScope]`는 둘 다 완료된 후에만 완료되므로, `doWorld`는 그 후에야 반환되고 `Done` 문자열이 출력될 수 있도록 허용합니다:

```text
Hello
World 1
World 2
Done
```

<!--- TEST -->

## 명시적인 Job

`[launch]` 코루틴 빌더는 실행된 코루틴에 대한 핸들인 `[Job]` 객체를 반환하며, 그 완료를 명시적으로 기다리는 데 사용될 수 있습니다. 예를 들어, 자식 코루틴의 완료를 기다린 다음 "Done" 문자열을 출력할 수 있습니다:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch { // 새로운 코루틴을 실행하고 해당 Job에 대한 참조를 유지합니다.
        delay(1000L)
        println("World!")
    }
    println("Hello")
    job.join() // 자식 코루틴이 완료될 때까지 기다립니다.
    println("Done") 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-05.kt -->
> 전체 코드는 [여기서](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-05.kt) 확인할 수 있습니다.
>
{style="note"}

이 코드는 다음을 생성합니다:

```text
Hello
World!
Done
```

<!--- TEST -->

## 코루틴은 경량입니다

코루틴은 JVM 스레드보다 자원 소모가 적습니다. 스레드를 사용할 때 JVM의 사용 가능한 메모리를 고갈시키는 코드는 코루틴을 사용하면 자원 제한에 부딪히지 않고 표현할 수 있습니다. 예를 들어, 다음 코드는 각각 5초를 기다린 다음 마침표(`.`)를 출력하면서도 매우 적은 메모리를 소비하는 50,000개의 개별 코루틴을 실행합니다:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    repeat(50_000) { // 많은 코루틴을 실행합니다.
        launch {
            delay(5000L)
            print(".")
        }
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-06.kt -->
> 전체 코드는 [여기서](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-06.kt) 확인할 수 있습니다.
>
{style="note"}

<!--- TEST lines.size == 1 && lines[0] == ".".repeat(50_000) -->

스레드를 사용하여 동일한 프로그램을 작성한다면 (`runBlocking`을 제거하고, `launch`를 `thread`로, `delay`를 `Thread.sleep`으로 교체), 많은 메모리를 소비할 것입니다. 운영 체제, JDK 버전 및 설정에 따라, 메모리 부족 오류를 발생시키거나, 너무 많은 동시 실행 스레드가 없도록 스레드를 천천히 시작할 것입니다.

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html

<!--- END -->