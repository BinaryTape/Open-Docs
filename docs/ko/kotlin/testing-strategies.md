[//]: # (title: 스트레스 테스트 및 모델 검사)

Lincheck은 스트레스 테스트(stress testing)와 모델 검사(model checking)라는 두 가지 테스트 전략을 제공합니다. [이전 단계](lincheck-getting-started.md)의 `BasicCounterTest.kt` 파일에서 작성한 `Counter`를 사용하여 두 방식의 내부 동작 원리를 알아보세요:

```kotlin
class Counter {
    @Volatile
    private var value = 0

    fun inc(): Int = ++value
    fun get() = value
}
```

## 스트레스 테스트 (Stress testing)

### 스트레스 테스트 작성하기

다음 단계에 따라 `Counter`에 대한 동시성 스트레스 테스트를 생성합니다:

1. `CounterTest` 클래스를 생성합니다.
2. 이 클래스에 `Counter` 타입의 필드 `c`를 추가하고 생성자에서 인스턴스를 생성합니다.
3. 카운터 연산들을 나열하고 `@Operation` 어노테이션을 표시하여 구현을 `c`에 위임합니다.
4. `StressOptions()`를 사용하여 스트레스 테스트 전략을 지정합니다.
5. `StressOptions.check()` 함수를 호출하여 테스트를 실행합니다.

결과 코드는 다음과 같습니다:

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 초기 상태
    
    // Counter에 대한 연산들
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 테스트 실행
    fun stressTest() = StressOptions().check(this::class)
}
```

### 스트레스 테스트의 동작 방식 {initial-collapse-state="collapsed" collapsible="true"}

먼저, Lincheck은 `@Operation`으로 표시된 연산들을 사용하여 일련의 동시성 시나리오를 생성합니다. 그런 다음 네이티브 스레드를 실행하고, 연산이 동시에 시작되도록 시작 지점에서 스레드들을 동기화합니다. 마지막으로, Lincheck은 이러한 네이티브 스레드에서 각 시나리오를 여러 번 실행하며 잘못된 결과를 초래하는 인터리빙(interleaving)이 발생하기를 기다립니다.

아래 그림은 Lincheck이 생성된 시나리오를 실행하는 방식에 대한 대략적인 구조를 보여줍니다:

![Counter의 스트레스 실행](counter-stress.png){width=700}

## 모델 검사 (Model checking)

스트레스 테스트의 주요 문제점은 발견된 버그를 재현하는 방법을 이해하는 데 몇 시간이 걸릴 수 있다는 것입니다. 이를 돕기 위해 Lincheck은 버그 재현을 위한 인터리빙을 자동으로 제공하는 한정 모델 검사(bounded model checking)를 지원합니다.

모델 검사 테스트는 스트레스 테스트와 동일한 방식으로 구성됩니다. 테스트 전략을 지정하는 `StressOptions()`를 `ModelCheckingOptions()`로 바꾸기만 하면 됩니다.

### 모델 검사 테스트 작성하기

스트레스 테스트 전략을 모델 검사로 변경하려면 테스트에서 `StressOptions()`를 `ModelCheckingOptions()`로 교체하세요:

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 초기 상태

    // Counter에 대한 연산들
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 테스트 실행
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

### 모델 검사의 동작 방식 {initial-collapse-state="collapsed" collapsible="true"}

복잡한 동시성 알고리즘의 대부분의 버그는 한 스레드에서 다른 스레드로 실행을 전환하는 고전적인 인터리빙으로 재현할 수 있습니다. 게다가 약한 메모리 모델(weak memory models)을 위한 모델 검사기는 매우 복잡하기 때문에, Lincheck은 _순차적 일관성 메모리 모델(sequential consistency memory model)_ 하에서 한정 모델 검사를 사용합니다.

간단히 말해, Lincheck은 하나의 컨텍스트 스위치(context switch)부터 시작하여 두 개, 그리고 지정된 수의 인터리빙이 검사될 때까지 모든 인터리빙을 분석합니다. 이 전략을 통해 가능한 가장 적은 수의 컨텍스트 스위치로 잘못된 스케줄을 찾을 수 있으므로, 이후 버그 조사가 더 쉬워집니다.

실행을 제어하기 위해 Lincheck은 테스트 코드에 특수한 스위치 포인트(switch point)를 삽입합니다. 이 포인트들은 컨텍스트 스위치가 수행될 수 있는 위치를 식별합니다. 기본적으로 이는 JVM에서의 필드 및 배열 요소 읽기 또는 업데이트와 같은 공유 메모리 액세스와 `wait/notify`, `park/unpark` 호출입니다. 스위치 포인트를 삽입하기 위해 Lincheck은 ASM 프레임워크를 사용하여 테스트 코드를 즉석에서 변환하고, 기존 코드에 내부 함수 호출을 추가합니다.

모델 검사 전략은 실행을 제어하므로, Lincheck은 잘못된 인터리빙으로 이어지는 추적(trace) 정보를 제공할 수 있으며 이는 실무에서 매우 유용합니다. [Lincheck으로 첫 번째 테스트 작성하기](lincheck-getting-started.md#write-your-first-test) 튜토리얼에서 `Counter`의 잘못된 실행에 대한 추적 예시를 확인할 수 있습니다.

## 어떤 테스트 전략이 더 좋은가요?

순차적 일관성 메모리 모델 하에서 버그를 찾는 데는 _모델 검사 전략_이 더 바람직합니다. 이는 더 나은 커버리지를 보장하고 오류가 발견될 경우 실패한 실행 추적 정보를 제공하기 때문입니다.

_스트레스 테스트_는 커버리지를 보장하지는 않지만, `volatile` 수식어 누락과 같은 저수준 효과로 인해 발생하는 버그를 알고리즘에서 확인하는 데 여전히 도움이 됩니다. 또한 스트레스 테스트는 재현을 위해 많은 컨텍스트 스위치가 필요한 드문 버그를 발견하는 데 큰 도움이 되며, 현재 모델 검사 전략의 제한 사항으로 인해 분석이 불가능한 경우에도 유용합니다.

## 테스트 전략 구성하기

테스트 전략을 구성하려면 `<TestingMode>Options` 클래스에서 옵션을 설정하세요.

1. `CounterTest`에 대한 시나리오 생성 및 실행 옵션을 설정합니다:

    ```kotlin
    import org.jetbrains.lincheck.*
    import org.jetbrains.lincheck.datastructures.*
    import org.junit.*
    
    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
    
        @Test
        fun stressTest() = StressOptions() // 스트레스 테스트 옵션:
            .actorsBefore(2) // 병렬 부분 이전의 연산 수
            .threads(2) // 병렬 부분의 스레드 수
            .actorsPerThread(2) // 병렬 부분의 각 스레드당 연산 수
            .actorsAfter(1) // 병렬 부분 이후의 연산 수
            .iterations(100) // 100개의 무작위 동시성 시나리오 생성
            .invocationsPerIteration(1000) // 생성된 각 시나리오를 1000번 실행
            .check(this::class) // 테스트 실행
    }
    ```

2. `stressTest()`를 다시 실행하면 Lincheck은 아래와 유사한 시나리오를 생성합니다:

   ```text 
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc()    |          |
   | inc()    |          |
   | ------------------- |
   | get()    | inc()    |
   | inc()    | get()    |
   | ------------------- |
   | inc()    |          |
   | ------------------- |
   ```

   여기서는 병렬 부분 이전에 두 개의 연산이 있고, 각각 두 개의 연산을 수행하는 두 개의 스레드가 있으며, 마지막에 하나의 연산이 뒤따릅니다.

모델 검사 테스트도 동일한 방식으로 구성할 수 있습니다.

## 시나리오 최소화 (Scenario minimization)

검출된 오류가 일반적으로 테스트 구성에서 지정한 것보다 작은 시나리오로 표현된다는 것을 이미 눈치채셨을 것입니다. Lincheck은 테스트 실패 상태를 유지하면서 가능한 한 연산을 제거하여 오류를 최소화하려고 시도합니다.

다음은 위 카운터 테스트에 대해 최소화된 시나리오입니다:

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

더 작은 시나리오를 분석하는 것이 더 쉽기 때문에 시나리오 최소화는 기본적으로 활성화되어 있습니다. 이 기능을 비활성화하려면 `[Stress, ModelChecking]Options` 구성에 `minimizeFailedScenario(false)`를 추가하세요.

## 데이터 구조 상태 로깅

디버깅에 유용한 또 다른 기능은 _상태 로깅(state logging)_입니다. 오류로 이어지는 인터리빙을 분석할 때, 보통 종이에 데이터 구조의 변화를 그리며 각 이벤트 후의 상태를 변경해 나갑니다. 이 절차를 자동화하기 위해 데이터 구조의 `String` 표현을 반환하는 특수한 메서드를 제공할 수 있으며, 그러면 Lincheck은 데이터 구조를 수정하는 인터리빙의 각 이벤트 후에 상태 표현을 출력합니다.

이를 위해 인자가 없고 `@StateRepresentation` 어노테이션이 표시된 메서드를 정의합니다. 이 메서드는 스레드 안전(thread-safe)하고 논블로킹(non-blocking)이어야 하며, 데이터 구조를 절대 수정해서는 안 됩니다.

1. `Counter` 예제에서 `String` 표현은 단순히 카운터의 값입니다. 따라서 추적 정보에 카운터 상태를 출력하려면 `CounterTest`에 `stateRepresentation()` 함수를 추가합니다:

    ```kotlin
    import org.jetbrains.lincheck.*
    import org.jetbrains.lincheck.datastructures.*
    import org.junit.Test

    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
        
        @StateRepresentation
        fun stateRepresentation() = c.get().toString()
        
        @Test
        fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
    }
    ```

2. 이제 `modelCheckingTest()`를 실행하고 카운터 상태를 수정하는 스위치 포인트에서 출력된 `Counter`의 상태를 확인합니다(`STATE:`로 시작함):

    ```text
    = Invalid execution results =
    | ------------------- |
    | Thread 1 | Thread 2 |
    | ------------------- |
    | STATE: 0            |
    | ------------------- |
    | inc(): 1 | inc(): 1 |
    | ------------------- |
    | STATE: 1            |
    | ------------------- |
    
    The following interleaving leads to the error:
    | -------------------------------------------------------------------- |
    | Thread 1 |                         Thread 2                          |
    | -------------------------------------------------------------------- |
    |          | inc()                                                     |
    |          |   inc(): 1 at CounterTest.inc(CounterTest.kt:10)          |
    |          |     value.READ: 0 at Counter.inc(BasicCounterTest.kt:10)  |
    |          |     switch                                                |
    | inc(): 1 |                                                           |
    | STATE: 1 |                                                           |
    |          |     value.WRITE(1) at Counter.inc(BasicCounterTest.kt:10) |
    |          |     STATE: 1                                              |
    |          |     value.READ: 1 at Counter.inc(BasicCounterTest.kt:10)  |
    |          |   result: 1                                               |
    | -------------------------------------------------------------------- |
    ```

스트레스 테스트의 경우, Lincheck은 시나리오의 병렬 부분 직전과 직후, 그리고 마지막에 상태 표현을 출력합니다.

> * 이 예제들의 [전체 코드](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/CounterTest.kt)를 확인하세요.
> * 더 많은 [테스트 예제](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/lincheck_test/guide)를 확인하세요.
>
{style="note"}

## 다음 단계

[연산에 전달되는 인자를 구성하는 방법](operation-arguments.md)과 이것이 언제 유용한지 알아보세요.