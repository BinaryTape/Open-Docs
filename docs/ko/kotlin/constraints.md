[//]: # (title: 데이터 구조 제약 조건)

일부 데이터 구조는 단일 생산자 단일 소비자 큐와 같이 일부 연산이 동시에 실행되지 않아야 할 수 있습니다. Lincheck은 이러한 계약에 대한 기본 지원을 제공하여 제약 조건에 따라 동시성 시나리오를 생성합니다.

[JCTools 라이브러리](https://github.com/JCTools/JCTools)의 [단일 소비자 큐](https://github.com/JCTools/JCTools/blob/66e6cbc9b88e1440a597c803b7df9bd1d60219f6/jctools-core/src/main/java/org/jctools/queues/atomic/MpscLinkedAtomicQueue.java)를 고려해 봅시다. `poll()`, `peek()`, `offer(x)` 연산의 정확성을 확인하는 테스트를 작성해 보겠습니다.

`build.gradle(.kts)` 파일에 JCTools 의존성을 추가하세요:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // jctools dependency
       testImplementation("org.jctools:jctools-core:%jctoolsVersion%")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // jctools dependency
       testImplementation "org.jctools:jctools-core:%jctoolsVersion%"
   }
   ```
   </tab>
   </tabs>

단일 소비자 제약 조건을 충족하려면, 모든 `poll()` 및 `peek()` 소비 연산이 단일 스레드에서 호출되도록 확인하세요. 이를 위해 해당 `@Operation` 어노테이션의 `nonParallelGroup` 매개변수를 동일한 값(예: `"consumers"`)으로 설정할 수 있습니다.

다음은 결과 테스트 코드입니다:

```kotlin
import org.jctools.queues.atomic.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*

class MPSCQueueTest {
    private val queue = MpscLinkedAtomicQueue<Int>()

    @Operation
    fun offer(x: Int) = queue.offer(x)

    @Operation(nonParallelGroup = "consumers") 
    fun poll(): Int? = queue.poll()

    @Operation(nonParallelGroup = "consumers")
    fun peek(): Int? = queue.peek()

    @Test
    fun stressTest() = StressOptions().check(this::class)

    @Test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

다음은 이 테스트를 위해 생성된 시나리오 예시입니다:

```text
= Iteration 15 / 100 =
| --------------------- |
| Thread 1  | Thread 2  |
| --------------------- |
| poll()    |           |
| poll()    |           |
| peek()    |           |
| peek()    |           |
| peek()    |           |
| --------------------- |
| offer(-1) | offer(0)  |
| offer(0)  | offer(-1) |
| peek()    | offer(-1) |
| offer(1)  | offer(1)  |
| peek()    | offer(1)  |
| --------------------- |
| peek()    |           |
| offer(-2) |           |
| offer(-2) |           |
| offer(2)  |           |
| offer(-2) |           |
| --------------------- |
```

모든 `poll()` 및 `peek()` 소비 호출이 단일 스레드에서 수행되므로 "단일 소비자" 제약 조건을 충족한다는 점에 유의하세요.

> [전체 코드 보기](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/MPSCQueueTest.kt).
>
{style="note"}

## 다음 단계

모델 체킹 전략으로 [알고리즘의 진행 보장(progress guarantees)을 확인하는 방법](progress-guarantees.md)을 알아보세요.