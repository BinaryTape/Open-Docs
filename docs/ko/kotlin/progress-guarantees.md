[//]: # (title: 진행 보장)

많은 동시성 알고리즘은 잠금 자유(lock-freedom)나 대기 자유(wait-freedom)와 같은 비차단 진행 보장(non-blocking progress guarantees)을 제공합니다. 이러한 알고리즘은 보통 복잡하기 때문에, 알고리즘을 차단(block)하게 만드는 버그를 추가하기 쉽습니다. Lincheck은 모델 검사(model checking) 전략을 사용하여 활성 버그(liveness bugs)를 찾는 데 도움을 줄 수 있습니다.

알고리즘의 진행 보장을 확인하려면 `ModelCheckingOptions()`에서 `checkObstructionFreedom` 옵션을 활성화하세요.

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

`ConcurrentMapTest.kt` 파일을 생성합니다.
그런 다음 Java 표준 라이브러리의 `ConcurrentHashMap::put(key: K, value: V)`가 차단 작업(blocking operation)임을 감지하기 위해 다음 테스트를 추가합니다.

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
        .actorsBefore(1) // HashMap을 초기화하기 위해
        .actorsPerThread(1)
        .actorsAfter(0)
        .minimizeFailedScenario(false)
        .checkObstructionFreedom()
        .check(this::class)
}
```

`modelCheckingTest()`를 실행합니다. 다음과 같은 결과를 얻게 될 것입니다.

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

이제 비차단 방식인 `ConcurrentSkipListMap<K, V>`에 대한 테스트를 추가해 보겠습니다. 이 테스트는 성공적으로 통과할 것입니다.

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

> 일반적인 비차단 진행 보장은 다음과 같습니다(가장 강한 것부터 약한 것 순서).
> 
> * **대기 자유(wait-freedom)**: 다른 스레드의 동작과 관계없이 각 작업이 한정된 단계 내에 완료되는 경우입니다.
> * **잠금 자유(lock-freedom)**: 특정 작업이 멈춰 있더라도 시스템 전체의 진행을 보장하여 최소한 하나의 작업은 한정된 단계 내에 완료되는 경우입니다.
> * **방해 자유(obstruction-freedom)**: 다른 모든 스레드가 일시 중지된 경우, 어떤 작업이든 한정된 단계 내에 완료되는 경우입니다.
>
{style="tip"}

현재 Lincheck은 방해 자유(obstruction-freedom) 진행 보장만 지원합니다. 그러나 실제 발생하는 대부분의 활성 버그는 예상치 못한 차단 코드를 추가하기 때문에, 방해 자유 검사는 잠금 자유 및 대기 자유 알고리즘의 문제를 찾는 데도 도움이 됩니다.

> * [예제 전체 코드](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentMapTest.kt)를 확인하세요.
> * Michael-Scott 큐 구현의 진행 보장을 테스트하는 [또 다른 예제](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ObstructionFreedomViolationTest.kt)를 확인하세요.
>
{style="note"}

## 다음 단계

테스트 알고리즘의 [순차 사양(sequential specification)](sequential-specification.md)을 명시적으로 지정하여 Lincheck 테스트의 견고함을 향상하는 방법을 배워보세요.