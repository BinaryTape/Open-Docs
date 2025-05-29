[//]: # (title: 스트레스 테스트와 모델 체킹)

Lincheck은 스트레스 테스트와 모델 체킹이라는 두 가지 테스트 전략을 제공합니다. [이전 단계](introduction.md)의 `BasicCounterTest.kt` 파일에서 작성한 `Counter`를 사용하여 두 접근 방식의 내부에서 어떤 일이 일어나는지 알아보세요.

```kotlin
class Counter {
    @Volatile
    private var value = 0

    fun inc(): Int = ++value
    fun get() = value
}
```

## 스트레스 테스트

### 스트레스 테스트 작성하기

다음 단계에 따라 `Counter`에 대한 동시성 스트레스 테스트를 작성하세요:

1. `CounterTest` 클래스를 생성합니다.
2. 이 클래스에 `Counter` 타입의 필드 `c`를 추가하고, 생성자에서 인스턴스를 생성합니다.
3. 카운터 연산을 나열하고 `@Operation` 어노테이션으로 표시한 다음, 해당 구현을 `c`에 위임합니다.
4. `StressOptions()`를 사용하여 스트레스 테스트 전략을 지정합니다.
5. 테스트를 실행하기 위해 `StressOptions.check()` 함수를 호출합니다.

결과 코드는 다음과 같습니다:

```kotlin
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*

class CounterTest {
    private val c = Counter() // Initial state
    
    // Operations on the Counter
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // Run the test
    fun stressTest() = StressOptions().check(this::class)
}
```

### 스트레스 테스트 작동 방식 {initial-collapse-state="collapsed" collapsible="true"}

먼저, Lincheck은 `@Operation`으로 표시된 연산을 사용하여 일련의 동시 시나리오를 생성합니다. 그런 다음, Lincheck은 네이티브 스레드를 시작하고, 연산이 동시에 시작되도록 초기에 동기화합니다. 마지막으로, Lincheck은 잘못된 결과를 생성하는 인터리빙을 발견하기를 기대하며, 이러한 네이티브 스레드에서 각 시나리오를 여러 번 실행합니다.

아래 그림은 Lincheck이 생성된 시나리오를 어떻게 실행하는지에 대한 상위 수준의 개요를 보여줍니다:

![Stress execution of the Counter](counter-stress.png){width=700}

## 모델 체킹

스트레스 테스트와 관련하여 주요 문제는 발견된 버그를 재현하는 방법을 이해하는 데 몇 시간을 소비할 수 있다는 점입니다. 이를 돕기 위해 Lincheck은 버그 재현을 위한 인터리빙을 자동으로 제공하는 바운드 모델 체킹을 지원합니다.

모델 체킹 테스트는 스트레스 테스트와 동일한 방식으로 구성됩니다. 테스트 전략을 지정하는 `StressOptions()`를 `ModelCheckingOptions()`로 바꾸기만 하면 됩니다.

### 모델 체킹 테스트 작성하기

스트레스 테스트 전략을 모델 체킹으로 변경하려면 테스트에서 `StressOptions()`를 `ModelCheckingOptions()`로 바꾸세요:

```kotlin
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*

class CounterTest {
    private val c = Counter() // Initial state

    // Operations on the Counter
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // Run the test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

### 모델 체킹 작동 방식 {initial-collapse-state="collapsed" collapsible="true"}

복잡한 동시성 알고리즘의 대부분 버그는 실행을 한 스레드에서 다른 스레드로 전환하는 일반적인 인터리빙으로 재현할 수 있습니다. 또한, 약한 메모리 모델을 위한 모델 체커는 매우 복잡하므로, Lincheck은 _순차 일관성 메모리 모델_ 하에서 바운드 모델 체킹을 사용합니다.

요컨대, Lincheck은 하나의 컨텍스트 스위치에서 시작하여 두 개, 그리고 지정된 수의 인터리빙이 검사될 때까지 프로세스를 계속하면서 모든 인터리빙을 분석합니다. 이 전략은 가능한 가장 적은 수의 컨텍스트 스위치로 잘못된 스케줄을 찾을 수 있게 하여, 추가 버그 조사를 더 쉽게 만듭니다.

실행을 제어하기 위해 Lincheck은 테스트 코드에 특별한 스위치 포인트를 삽입합니다. 이러한 포인트는 컨텍스트 스위치가 수행될 수 있는 위치를 식별합니다. 본질적으로, 이들은 JVM에서의 필드 및 배열 요소 읽기 또는 업데이트와 같은 공유 메모리 접근이며, `wait/notify` 및 `park/unpark` 호출도 포함합니다. 스위치 포인트를 삽입하기 위해 Lincheck은 ASM 프레임워크를 사용하여 테스트 코드를 즉시 변환하고, 기존 코드에 내부 함수 호출을 추가합니다.

모델 체킹 전략이 실행을 제어하므로, Lincheck은 잘못된 인터리빙으로 이어지는 트레이스를 제공할 수 있으며, 이는 실제 상황에서 매우 유용합니다. [Lincheck으로 첫 번째 테스트 작성하기](introduction.md#trace-the-invalid-execution) 튜토리얼에서 `Counter`의 잘못된 실행에 대한 트레이스 예시를 확인할 수 있습니다.

## 어떤 테스트 전략이 더 나을까요?

_모델 체킹 전략_은 더 나은 커버리지를 보장하고 오류가 발견되면 실패 실행 트레이스를 제공하기 때문에 순차 일관성 메모리 모델 하에서 버그를 찾는 데 더 선호됩니다.

_스트레스 테스트_는 커버리지를 보장하지 않지만, `volatile` 한정자 누락과 같은 저수준 효과로 인해 발생하는 버그에 대해 알고리즘을 확인하는 데 여전히 유용합니다. 또한 스트레스 테스트는 재현을 위해 많은 컨텍스트 스위치가 필요한 희귀한 버그를 발견하는 데 큰 도움이 되며, 모델 체킹 전략의 현재 제약으로 인해 이러한 버그를 모두 분석하는 것은 불가능합니다.

## 테스트 전략 구성하기

테스트 전략을 구성하려면 `<TestingMode>Options` 클래스에서 옵션을 설정하세요.

1. `CounterTest`에 대한 시나리오 생성 및 실행 옵션을 설정합니다:

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.stress.*
    import org.junit.*
    
    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
    
        @Test
        fun stressTest() = StressOptions() // Stress testing options:
            .actorsBefore(2) // Number of operations before the parallel part
            .threads(2) // Number of threads in the parallel part
            .actorsPerThread(2) // Number of operations in each thread of the parallel part
            .actorsAfter(1) // Number of operations after the parallel part
            .iterations(100) // Generate 100 random concurrent scenarios
            .invocationsPerIteration(1000) // Run each generated scenario 1000 times
            .check(this::class) // Run the test
    }
    ```

2. `stressTest()`를 다시 실행하면 Lincheck은 아래와 유사한 시나리오를 생성할 것입니다:

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

   여기서는 병렬 부분 전에 두 개의 연산이 있고, 두 연산 각각에 대해 두 개의 스레드가 있으며, 그 후에 단일 연산이 마지막에 이어집니다.

모델 체킹 테스트도 동일한 방식으로 구성할 수 있습니다.

## 시나리오 최소화

테스트 구성에 지정된 것보다 더 작은 시나리오로 감지된 오류가 일반적으로 표현된다는 것을 이미 알아챘을 수도 있습니다. Lincheck은 테스트가 실패하지 않도록 하면서 연산을 적극적으로 제거하여 오류를 최소화하려고 시도합니다.

다음은 위 카운터 테스트를 위한 최소화된 시나리오입니다:

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

더 작은 시나리오를 분석하는 것이 더 쉽기 때문에, 시나리오 최소화는 기본적으로 활성화되어 있습니다. 이 기능을 비활성화하려면 `[Stress, ModelChecking]Options` 구성에 `minimizeFailedScenario(false)`를 추가하세요.

## 데이터 구조 상태 로깅

디버깅을 위한 또 다른 유용한 기능은 _상태 로깅_입니다. 오류로 이어지는 인터리빙을 분석할 때, 일반적으로 각 이벤트 후에 상태를 변경하면서 데이터 구조의 변화를 종이에 그립니다. 이 절차를 자동화하기 위해, 데이터 구조의 `String` 표현을 반환하는 특별한 메서드를 제공할 수 있습니다. 그러면 Lincheck은 데이터 구조를 수정하는 인터리빙의 각 이벤트 후에 상태 표현을 출력합니다.

이를 위해 인수를 받지 않고 `@StateRepresentation` 어노테이션으로 표시된 메서드를 정의합니다. 이 메서드는 스레드 안전하고, 논블로킹이며, 데이터 구조를 절대 수정하지 않아야 합니다.

1. `Counter` 예제에서 `String` 표현은 단순히 카운터의 값입니다. 따라서 트레이스에 카운터 상태를 출력하려면 `stateRepresentation()` 함수를 `CounterTest`에 추가하세요:

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
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

2. `modelCheckingTest()`를 지금 실행하고 카운터 상태를 수정하는 스위치 포인트에서 출력되는 `Counter`의 상태를 확인하세요 (`STATE:`로 시작합니다):

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

스트레스 테스트의 경우, Lincheck은 시나리오의 병렬 부분 바로 이전과 이후, 그리고 마지막에 상태 표현을 출력합니다.

> * [이 예제들의 전체 코드](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/CounterTest.kt) 가져오기
> * 더 많은 [테스트 예제](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide) 보기
>
{style="note"}

## 다음 단계

[연산에 전달되는 인수를 구성하는 방법](operation-arguments.md)과 언제 유용할 수 있는지 알아보세요.