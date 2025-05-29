[//]: # (title: 顺序规范)

为确保算法提供正确的顺序行为，你可以通过编写测试数据结构的直接顺序实现来定义其 _顺序规范_。

> 此特性还允许你编写一个单独的测试，而不是两个独立的顺序和并发测试。
>
{style="tip"}

为算法提供用于验证的顺序规范：

1. 实现所有测试方法的顺序版本。
2. 将包含顺序实现的类传递给 `sequentialSpecification()` 选项：

   ```kotlin
   StressOptions().sequentialSpecification(SequentialQueue::class)
   ```

例如，以下是用于检查 Java 标准库中 `j.u.c.ConcurrentLinkedQueue` 正确性的测试用例。

```kotlin
import org.jetbrains.kotlinx.lincheck.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*
import java.util.*
import java.util.concurrent.*

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

> 获取[完整的示例代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ConcurrentLinkedQueueTest.kt)。
>
{style="note"}