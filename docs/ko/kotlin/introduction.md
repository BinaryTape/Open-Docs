[//]: # (title: Lincheck으로 첫 테스트 작성하기)

이 튜토리얼은 첫 Lincheck 테스트를 작성하고, Lincheck 프레임워크를 설정하며, 기본 API를 사용하는 방법을 보여줍니다. 잘못된 동시성 카운터 구현이 포함된 새로운 IntelliJ IDEA 프로젝트를 생성하고, 이에 대한 테스트를 작성한 다음 버그를 찾아 분석할 것입니다.

## 프로젝트 생성

IntelliJ IDEA에서 기존 Kotlin 프로젝트를 열거나 [새 프로젝트를 생성합니다](https://kotlinlang.org/docs/jvm-get-started.html). 프로젝트를 생성할 때는 Gradle 빌드 시스템을 사용하세요.

## 필요한 종속성 추가

1. `build.gradle(.kts)` 파일을 열고 `mavenCentral()`이 리포지토리 목록에 추가되어 있는지 확인합니다.
2. 다음 종속성을 Gradle 구성에 추가합니다.

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheck 종속성
       testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
       // 이 종속성을 사용하면 kotlin.test 및 JUnit과 함께 작업할 수 있습니다.
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
       // Lincheck 종속성
       testImplementation "org.jetbrains.lincheck:lincheck:%lincheckVersion%"
       // 이 종속성을 사용하면 kotlin.test 및 JUnit과 함께 작업할 수 있습니다.
       testImplementation "junit:junit:4.13"
   }
   ```
   </tab>
   </tabs>

## 동시성 카운터 작성 및 테스트 실행

1. `src/test/kotlin` 디렉터리에 `BasicCounterTest.kt` 파일을 생성하고 버그가 있는 동시성 카운터와 이에 대한 Lincheck 테스트 코드를 추가합니다.

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
   
       // 카운터에 대한 작업
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test // JUnit
       fun stressTest() = StressOptions().check(this::class) // 마법의 버튼
   }
   ```

   이 Lincheck 테스트는 자동으로 다음을 수행합니다.
   * 지정된 `inc()` 및 `get()` 작업으로 여러 임의의 동시성 시나리오를 생성합니다.
   * 생성된 각 시나리오에 대해 많은 호출을 수행합니다.
   * 각 호출 결과가 올바른지 확인합니다.

2. 위 테스트를 실행하면 다음과 같은 오류가 표시됩니다.

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   ```

   여기서 Lincheck은 카운터 원자성을 위반하는 실행을 발견했습니다. 두 번의 동시 증분(increment)이 동일한 결과 `1`로 끝났습니다. 이는 한 번의 증분이 손실되었음을 의미하며, 카운터의 동작이 올바르지 않습니다.

## 유효하지 않은 실행 추적

유효하지 않은 실행 결과를 보여주는 것 외에도 Lincheck은 오류로 이어지는 인터리빙(interleaving)을 제공할 수 있습니다. 이 기능은 제한된 수의 컨텍스트 스위치(context switch)로 수많은 실행을 검사하는 [모델 검증 (model checking)](testing-strategies.md#model-checking) 테스트 전략을 통해 접근할 수 있습니다.

1. 테스트 전략을 전환하려면 `options` 타입을 `StressOptions()`에서 `ModelCheckingOptions()`로 변경합니다. 업데이트된 `BasicCounterTest` 클래스는 다음과 같습니다.

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

2. 테스트를 다시 실행합니다. 올바르지 않은 결과로 이어지는 실행 트레이스(execution trace)를 얻게 됩니다.

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

   트레이스(trace)에 따르면 다음 이벤트가 발생했습니다.

   * **T2**: 두 번째 스레드가 `inc()` 작업을 시작하고 현재 카운터 값(`value.READ: 0`)을 읽은 후 일시 중지합니다.
   * **T1**: 첫 번째 스레드가 `inc()`를 실행하여 `1`을 반환하고 완료합니다.
   * **T2**: 두 번째 스레드가 다시 시작하여 이전에 얻은 카운터 값을 증가시키고, 카운터를 `1`로 잘못 업데이트합니다.

> [전체 코드 보기](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/BasicCounterTest.kt).
>
{style="note"}

## Java 표준 라이브러리 테스트

이제 표준 Java의 `ConcurrentLinkedDeque` 클래스에서 버그를 찾아봅시다. 아래 Lincheck 테스트는 데크(deque)의 헤드에 요소를 제거하고 추가하는 과정에서 발생하는 경쟁 조건(race condition)을 찾습니다.

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

`modelCheckingTest()`를 실행합니다. 테스트는 다음과 같은 출력과 함께 실패할 것입니다.

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

> [전체 코드 보기](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedDequeTest.kt).
>
{style="note"}

## 다음 단계

[테스트 전략을 선택하고 테스트 실행을 구성하세요](testing-strategies.md).

## 참고 항목

* [작업 인수를 생성하는 방법](operation-arguments.md)
* [인기 있는 알고리즘 제약 조건](constraints.md)
* [비블로킹 진행 보장 확인](progress-guarantees.md)
* [알고리즘의 순차 사양 정의](sequential-specification.md)