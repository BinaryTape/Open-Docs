[//]: # (title: 顺序规范)

为了确保算法提供正确的顺序行为，你可以通过编写测试数据结构的直接顺序实现来定义其 _顺序规范_。

> 该特性还允许你编写单个测试，而不是两个独立的顺序测试和并发测试。
>
{style="tip"}

为验证算法提供顺序规范：

1. 实现所有测试方法的顺序版本。
2. 将包含顺序实现的类传递给 `sequentialSpecification()` 选项：

   ```kotlin
   StressOptions().sequentialSpecification(SequentialQueue::class)
   ```

例如，以下是用于检测 Java 标准库中 `j.u.c.ConcurrentLinkedQueue` 正确性的测试。

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

> 获取[示例的完整代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedQueueTest.kt)。
>
{style="note"}