[//]: # (title: 진행 보장)

많은 동시성 알고리즘은 락-프리(lock-freedom) 및 웨이트-프리(wait-freedom)와 같은 논블로킹 진행 보장(non-blocking progress guarantees)을 제공합니다. 이러한 알고리즘은 대개 간단하지 않으므로, 알고리즘을 차단(block)하는 버그를 쉽게 추가할 수 있습니다. Lincheck은 모델 검사(model checking) 전략을 사용하여 라이브니스(liveness) 버그를 찾는 데 도움을 줄 수 있습니다.

알고리즘의 진행 보장을 확인하려면, `ModelCheckingOptions()`에서 `checkObstructionFreedom` 옵션을 활성화하십시오:

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

`ConcurrentMapTest.kt` 파일을 생성합니다.
그런 다음 자바 표준 라이브러리의 `ConcurrentHashMap::put(key: K, value: V)`가 블로킹(blocking) 연산임을 감지하기 위해 다음 테스트를 추가합니다:

```kotlin
import java.util.concurrent.*
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class ConcurrentHashMapTest {
    private val map = ConcurrentHashMap<Int, Int>()

    @Operation
    fun put(key: Int, value: Int) = map.put(key, value)

    @Test
    fun modelCheckingTest() = ModelCheckingOptions()
        .actorsBefore(1) // To init the HashMap
        .actorsPerThread(1)
        .actorsAfter(0)
        .minimizeFailedScenario(false)
        .checkObstructionFreedom()
        .check(this::class)
}
```

`modelCheckingTest()`를 실행합니다. 다음 결과가 나타날 것입니다:

```text
= Obstruction-freedom is required but a lock has been found =
| ---------------------- |
|  Thread 1  | Thread 2  |
| ---------------------- |
| put(1, -1) |           |
| ---------------------- |
| put(2, -2) | put(3, 2) |
| ---------------------- |

---
All operations above the horizontal line | ----- | happen before those below the line
---

The following interleaving leads to the error:
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                         Thread 1                                         |                                         Thread 2                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                                          | put(3, 2)                                                                                |
|                                                                                          |   put(3,2) at ConcurrentHashMapTest.put(ConcurrentMapTest.kt:11)                         |
|                                                                                          |     putVal(3,2,false) at ConcurrentHashMap.put(ConcurrentHashMap.java:1006)              |
|                                                                                          |       table.READ: Node[]@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1014)      |
|                                                                                          |       tabAt(Node[]@1,0): Node@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1018) |
|                                                                                          |       MONITORENTER at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1031)              |
|                                                                                          |       tabAt(Node[]@1,0): Node@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1032) |
|                                                                                          |       next.READ: null at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1046)           |
|                                                                                          |       switch                                                                             |
| put(2, -2)                                                                               |                                                                                          |
|   put(2,-2) at ConcurrentHashMapTest.put(ConcurrentMapTest.kt:11)                        |                                                                                          |
|     putVal(2,-2,false) at ConcurrentHashMap.put(ConcurrentHashMap.java:1006)             |                                                                                          |
|       table.READ: Node[]@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1014)      |                                                                                          |
|       tabAt(Node[]@1,0): Node@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1018) |                                                                                          |
|       MONITORENTER at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1031)              |                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
```

이제 논블로킹(non-blocking) `ConcurrentSkipListMap<K, V>`에 대한 테스트를 추가하여, 테스트가 성공적으로 통과할 것으로 예상해 봅시다:

```kotlin
class ConcurrentSkipListMapTest {
    private val map = ConcurrentSkipListMap<Int, Int>()

    @Operation
    fun put(key: Int, value: Int) = map.put(key, value)

    @Test
    fun modelCheckingTest() = ModelCheckingOptions()
        .checkObstructionFreedom()
        .check(this::class)
}
```

> 일반적인 논블로킹 진행 보장(non-blocking progress guarantees)은 (강도 순으로 가장 강한 것부터 가장 약한 것까지) 다음과 같습니다:
>
> *   **웨이트-프리(wait-freedom)**: 다른 스레드가 무엇을 하든 각 연산이 유한한 단계 내에 완료됩니다.
> *   **락-프리(lock-freedom)**: 특정 연산이 정체될 수 있는 동안에도 최소한 하나의 연산이 유한한 단계 내에 완료되도록 시스템 전반의 진행을 보장합니다.
> *   **옵스트럭션-프리(obstruction-freedom)**: 다른 모든 스레드가 일시 중지될 경우 어떤 연산이든 유한한 단계 내에 완료됩니다.
>
{style="tip"}

현재로서는 Lincheck은 옵스트럭션-프리(obstruction-freedom) 진행 보장만을 지원합니다. 그러나 대부분의 실제 라이브니스(liveness) 버그는 예상치 못한 블로킹(blocking) 코드를 추가하므로, 옵스트럭션-프리 검사는 락-프리(lock-free) 및 웨이트-프리(wait-free) 알고리즘에도 도움이 될 것입니다.

> *   [예제 전체 코드](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentMapTest.kt)를 확인해 보세요.
> *   마이클-스콧 큐(Michael-Scott queue) 구현의 진행 보장을 테스트하는 [다른 예제](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ObstructionFreedomViolationTest.kt)를 확인해 보세요.
>
{style="note"}

## 다음 단계

Lincheck 테스트의 견고성을 향상시키기 위해, 테스트 알고리즘의 [순차적 사양(sequential specification)을 명시적으로 지정](sequential-specification.md)하는 방법을 알아보세요.