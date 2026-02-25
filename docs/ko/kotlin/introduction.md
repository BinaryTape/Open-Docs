[//]: # (title: Lincheck으로 첫 번째 테스트 작성하기)

이 튜토리얼에서는 첫 번째 Lincheck 테스트를 작성하고, Lincheck 프레임워크를 설정하며, 기본 API를 사용하는 방법을 설명합니다. 
버그가 있는 동시성 카운터(concurrent counter) 구현을 포함한 새 IntelliJ IDEA 프로젝트를 생성하고 이에 대한 테스트를 작성한 후, 버그를 찾아 분석해 보겠습니다.

## 프로젝트 생성

IntelliJ IDEA에서 기존 Kotlin 프로젝트를 열거나 [새 프로젝트를 생성](https://kotlinlang.org/docs/jvm-get-started.html)하세요.
프로젝트를 생성할 때 Gradle 빌드 시스템을 사용하세요.

## 필수 의존성 추가

1. `build.gradle(.kts)` 파일을 열고 저장소(repository) 목록에 `mavenCentral()`이 추가되어 있는지 확인하세요.
2. Gradle 설정에 다음 의존성들을 추가하세요:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheck 의존성
       testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
       // kotlin.test 및 JUnit을 사용하기 위한 의존성:
       testImplementation("junit:junit:4.13")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheck 의존성
       testImplementation "org.jetbrains.lincheck:lincheck:%lincheckVersion%"
       // kotlin.test 및 JUnit을 사용하기 위한 의존성:
       testImplementation "junit:junit:4.13"
   }
   ```
   </tab>
   </tabs>

## 동시성 카운터 작성 및 테스트 실행

1. `src/test/kotlin` 디렉토리에 `BasicCounterTest.kt` 파일을 생성하고, 버그가 있는 동시성 카운터와 이를 위한 Lincheck 테스트 코드를 추가하세요:

   ```kotlin
   import org.jetbrains.lincheck.*
   import org.jetbrains.lincheck.datastructures.*
   import org.junit.*

   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter() // 초기 상태
   
       // Counter에 대한 연산들
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test // JUnit
       fun stressTest() = StressOptions().check(this::class) // 마법의 버튼
   }
   ```

   이 Lincheck 테스트는 자동으로 다음을 수행합니다: 
   * 지정된 `inc()` 및 `get()` 연산을 사용하여 여러 개의 무작위 동시성 시나리오를 생성합니다.
   * 생성된 각 시나리오에 대해 수많은 호출을 수행합니다.
   * 각 호출 결과가 올바른지 확인합니다.

2. 위의 테스트를 실행하면 다음과 같은 오류를 확인할 수 있습니다:

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   ```

   여기서 Lincheck은 카운터의 원자성(atomicity)을 위반하는 실행을 발견했습니다. 두 개의 동시 증가(increment) 연산이 동일한 결과인 `1`로 끝난 것입니다. 이는 한 번의 증가 연산이 유실되었음을 의미하며, 카운터의 동작이 올바르지 않음을 나타냅니다.

## 잘못된 실행 추적하기

Lincheck은 잘못된 실행 결과를 보여주는 것 외에도, 오류로 이어지는 인터리빙(interleaving)을 제공할 수 있습니다. 이 기능은 [모델 검사(model checking)](testing-strategies.md#model-checking) 테스트 전략을 통해 사용할 수 있으며, 이 전략은 제한된 횟수의 컨텍스트 스위칭(context switching)으로 수많은 실행을 조사합니다.

1. 테스트 전략을 전환하려면 `options` 타입을 `StressOptions()`에서 `ModelCheckingOptions()`로 변경하세요. 업데이트된 `BasicCounterTest` 클래스는 다음과 같습니다:

   ```kotlin
   import org.jetbrains.lincheck.*
   import org.jetbrains.lincheck.datastructures.*
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

2. 테스트를 다시 실행하세요. 잘못된 결과로 이어지는 실행 추적(execution trace) 정보를 얻을 수 있습니다:

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   
   The following interleaving leads to the error:
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

   추적 결과에 따르면 다음과 같은 이벤트가 발생했습니다:

   * **T2**: 두 번째 스레드가 `inc()` 연산을 시작하여 현재 카운터 값을 읽고(`value.READ: 0`) 일시 중단됩니다.
   * **T1**: 첫 번째 스레드가 `inc()`를 실행하여 `1`을 반환하고 종료됩니다.
   * **T2**: 두 번째 스레드가 재개되어 이전에 가져온 카운터 값을 증가시키고, 카운터를 잘못된 값인 `1`로 업데이트합니다.

> [전체 코드 받기](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/BasicCounterTest.kt).
>
{style="note"}

## Java 표준 라이브러리 테스트하기

이제 Java 표준 라이브러리의 `ConcurrentLinkedDeque` 클래스에서 버그를 찾아보겠습니다.
아래의 Lincheck 테스트는 데크(deque)의 앞부분에 요소를 추가하고 제거하는 사이의 레이스 컨디션(race condition)을 찾아냅니다:

```kotlin
import java.util.concurrent.*
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

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

`modelCheckingTest()`를 실행하세요. 테스트는 실패하며 다음과 같은 출력을 보여줍니다:

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
All operations above the horizontal line | ----- | happen before those below the line
---
Values in "[..]" brackets indicate the number of completed operations
in each of the parallel threads seen at the beginning of the current operation
---

The following interleaving leads to the error:
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

> [전체 코드 받기](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedDequeTest.kt).
>
{style="note"}

## 다음 단계

[테스트 전략을 선택하고 테스트 실행을 설정](testing-strategies.md)하세요.

## 참고 항목

* [연산 인자를 생성하는 방법](operation-arguments.md)
* [대중적인 알고리즘 제약 사항](constraints.md)
* [논블로킹 진행 보장 확인](progress-guarantees.md)
* [알고리즘의 순차 명세 정의](sequential-specification.md)