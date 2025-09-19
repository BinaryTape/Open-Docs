[//]: # (title: 순차 명세)

알고리즘이 올바른 순차적 동작을 제공하는지 확인하려면, 테스트 데이터 구조에 대한 간단한 순차적 구현을 작성하여 그 _순차 명세_를 정의할 수 있습니다.

> 이 기능은 두 개의 별개인 순차 테스트와 동시성 테스트 대신 단일 테스트를 작성할 수 있게 해줍니다.
>
{style="tip"}

검증을 위해 알고리즘의 순차 명세를 제공하려면:

1.  모든 테스트 메서드의 순차 버전을 구현합니다.
2.  순차 구현이 포함된 클래스를 `sequentialSpecification()` 옵션에 전달합니다:

   ```kotlin
   StressOptions().sequentialSpecification(SequentialQueue::class)
   ```

예를 들어, 다음은 자바 표준 라이브러리의 `j.u.c.ConcurrentLinkedQueue`의 정확성을 확인하는 테스트입니다.

```kotlin
import java.util.*
import java.util.concurrent.*
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class ConcurrentLinkedQueueTest {
    private val s = ConcurrentLinkedQueue<Int>()

    @Operation
    fun add(value: Int) = s.add(value)

    @Operation
    fun poll(): Int? = s.poll()
   
    @Test
    fun stressTest() = StressOptions()
        .sequentialSpecification(SequentialQueue::class.java)
        .check(this::class)
}

class SequentialQueue {
    private val s = LinkedList<Int>()

    fun add(x: Int) = s.add(x)
    fun poll(): Int? = s.poll()
}
```

> [예제 전체 코드](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedQueueTest.kt)를 확인하세요.
>
{style="note"}