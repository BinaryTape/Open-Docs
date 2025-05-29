[//]: # (title: Lincheck로 첫 테스트 작성하기)

이 튜토리얼에서는 첫 Lincheck 테스트를 작성하고, Lincheck 프레임워크를 설정하며, 기본 API를 사용하는 방법을 설명합니다. 잘못된 동시성 카운터 구현이 포함된 새 IntelliJ IDEA 프로젝트를 생성하고, 이에 대한 테스트를 작성한 다음, 버그를 찾아 분석할 것입니다.

## 프로젝트 생성

IntelliJ IDEA에서 기존 Kotlin 프로젝트를 열거나 [새 프로젝트를 생성하세요](https://kotlinlang.org/docs/jvm-get-started.html). 프로젝트 생성 시 Gradle 빌드 시스템을 사용하세요.

## 필요한 의존성 추가

1. `build.gradle(.kts)` 파일을 열고 `mavenCentral()`이 저장소 목록에 추가되었는지 확인하세요.
2. 다음 의존성을 Gradle 설정에 추가하세요:

   <tabs group="build-script">
   <tab title="코틀린" group-key="kotlin">

   ```kotlin
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheck 의존성
       testImplementation("org.jetbrains.kotlinx:lincheck:%lincheckVersion%")
       // 이 의존성을 통해 kotlin.test 및 JUnit과 함께 작업할 수 있습니다:
       testImplementation("junit:junit:4.13")
   }
   ```

   </tab>
   <tab title="그루비" group-key="groovy">
   
   ```groovy
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheck 의존성
       testImplementation "org.jetbrains.kotlinx:lincheck:%lincheckVersion%"
       // 이 의존성을 통해 kotlin.test 및 JUnit과 함께 작업할 수 있습니다:
       testImplementation "junit:junit:4.13"
   }
   ```
   </tab>
   </tabs>

## 동시성 카운터 작성 및 테스트 실행

1. `src/test/kotlin` 디렉터리에 `BasicCounterTest.kt` 파일을 생성하고 버그가 있는 동시성 카운터 및 이에 대한 Lincheck 테스트 코드를 추가하세요:

   ```kotlin
   import org.jetbrains.kotlinx.lincheck.annotations.*
   import org.jetbrains.kotlinx.lincheck.*
   import org.jetbrains.kotlinx.lincheck.strategy.stress.*
   import org.junit.*

   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter() // 초기 상태
   
       // Counter에 대한 연산
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test // JUnit
       fun stressTest() = StressOptions().check(this::class) // 마법의 버튼
   }
   ```

   이 Lincheck 테스트는 자동으로 다음을 수행합니다: 
   * 지정된 `inc()` 및 `get()` 연산을 사용하여 여러 무작위 동시성 시나리오를 생성합니다.
   * 생성된 각 시나리오에 대해 많은 호출을 수행합니다.
   * 각 호출 결과가 올바른지 확인합니다.

2. 위 테스트를 실행하면 다음 오류가 표시됩니다:

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   ```

   여기서 Lincheck는 카운터의 원자성을 위반하는 실행을 발견했습니다. 두 개의 동시 증가(increment)가 동일한 결과 `1`로 끝난 것입니다. 이는 하나의 증가가 손실되었고 카운터의 동작이 올바르지 않음을 의미합니다.

## 유효하지 않은 실행 추적

유효하지 않은 실행 결과를 보여주는 것 외에도, Lincheck는 오류로 이어지는 인터리빙(interleaving)을 제공할 수 있습니다. 이 기능은 [모델 검증(model checking)](testing-strategies.md#model-checking) 테스트 전략을 통해 접근할 수 있으며, 이 전략은 제한된 수의 컨텍스트 스위치를 사용하여 수많은 실행을 검사합니다.

1. 테스트 전략을 전환하려면 `options` 타입을 `StressOptions()`에서 `ModelCheckingOptions()`으로 교체하세요. 업데이트된 `BasicCounterTest` 클래스는 다음과 같습니다:

   ```kotlin
   import org.jetbrains.kotlinx.lincheck.annotations.*
   import org.jetbrains.kotlinx.lincheck.check
   import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
   import org.junit.*
   
   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter()
   
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test
       fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
   }
   ```

2. 테스트를 다시 실행하세요. 잘못된 결과로 이어지는 실행 추적을 얻을 수 있습니다:

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   
   다음 인터리빙(interleaving)이 오류로 이어집니다:
   | --------------------------------------------------------------------- |
   | Thread 1 |                          Thread  2                         |
   | --------------------------------------------------------------------- |
   |          | inc()                                                      |
   |          |   inc(): 1 at BasicCounterTest.inc(BasicCounterTest.kt:18) |
   |          |     value.READ: 0 at Counter.inc(BasicCounterTest.kt:10)   |
   |          |     switch                                                 |
   | inc(): 1 |                                                            |
   |          |     value.WRITE(1) at Counter.inc(BasicCounterTest.kt:10)  |
   |          |     value.READ: 1 at Counter.inc(BasicCounterTest.kt:10)   |
   |          |   result: 1                                                |
   | --------------------------------------------------------------------- |
   ```

   추적에 따르면 다음 이벤트가 발생했습니다:

   * **T2**: 두 번째 스레드가 `inc()` 연산을 시작하여 현재 카운터 값(`value.READ: 0`)을 읽고 일시 중지합니다.
   * **T1**: 첫 번째 스레드가 `inc()`를 실행하여 `1`을 반환하고 완료됩니다.
   * **T2**: 두 번째 스레드가 재개되어 이전에 얻은 카운터 값을 증가시키고, 카운터를 `1`로 잘못 업데이트합니다.

> [전체 코드를 얻으세요](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/BasicCounterTest.kt).
>
{style="note"}

## Java 표준 라이브러리 테스트

이제 표준 Java의 `ConcurrentLinkedDeque` 클래스에서 버그를 찾아봅시다. 아래 Lincheck 테스트는 데크(deque)의 헤드에 요소를 제거하고 추가하는 작업 사이에 발생하는 경쟁 상태(race condition)를 발견합니다:

```kotlin
import org.jetbrains.kotlinx.lincheck.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*
import java.util.concurrent.*

class ConcurrentDequeTest {
    private val deque = ConcurrentLinkedDeque<Int>()

    @Operation
    fun addFirst(e: Int) = deque.addFirst(e)

    @Operation
    fun addLast(e: Int) = deque.addLast(e)

    @Operation
    fun pollFirst() = deque.pollFirst()

    @Operation
    fun pollLast() = deque.pollLast()

    @Operation
    fun peekFirst() = deque.peekFirst()

    @Operation
    fun peekLast() = deque.peekLast()

    @Test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

`modelCheckingTest()`를 실행하세요. 테스트는 다음 출력과 함께 실패합니다:

```text
= Invalid execution results =
| ---------------------------------------- |
|      Thread 1     |       Thread 2       |
| ---------------------------------------- |
| addLast(22): void |                      |
| ---------------------------------------- |
| pollFirst(): 22   | addFirst(8): void    |
|                   | peekLast(): 22 [-,1] |
| ---------------------------------------- |

---
수평선 | ----- | 위의 모든 연산은 선 아래의 연산보다 먼저 발생합니다.
---
[..] 괄호 안의 값은 현재 연산 시작 시점에 각 병렬 스레드에서 완료된 연산의 수를 나타냅니다.
---

다음 인터리빙(interleaving)이 오류로 이어집니다:
| --------------------------------------------------------------------------------------------------------------------------------- |
|                                                Thread 1                                                    |       Thread 2       |
| --------------------------------------------------------------------------------------------------------------------------------- |
| pollFirst()                                                                                                |                      |
|   pollFirst(): 22 at ConcurrentDequeTest.pollFirst(ConcurrentDequeTest.kt:17)                              |                      |
|     first(): Node@1 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:915)                     |                      |
|     item.READ: null at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:917)                     |                      |
|     next.READ: Node@2 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:925)                   |                      |
|     item.READ: 22 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:917)                       |                      |
|     prev.READ: null at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:919)                     |                      |
|     switch                                                                                                 |                      |
|                                                                                                            | addFirst(8): void    |
|                                                                                                            | peekLast(): 22       |
|     compareAndSet(Node@2,22,null): true at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:920) |                      |
|     unlink(Node@2) at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:921)                      |                      |
|   result: 22                                                                                               |                      |
| --------------------------------------------------------------------------------------------------------------------------------- |
```

> [전체 코드를 얻으세요](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ConcurrentLinkedDequeTest.kt).
>
{style="note"}

## 다음 단계

[테스트 전략을 선택하고 테스트 실행을 구성하세요](testing-strategies.md).

## 참고 자료

*   [연산 인수를 생성하는 방법](operation-arguments.md)
*   [인기 있는 알고리즘 제약 조건](constraints.md)
*   [논블로킹 진행 보장 확인](progress-guarantees.md)
*   [알고리즘의 순차적 사양 정의](sequential-specification.md)