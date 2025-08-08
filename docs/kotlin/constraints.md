[//]: # (title: 数据结构约束)

某些数据结构可能要求部分操作不能并发执行，例如单生产者单消费者队列。Lincheck 为此类契约提供了开箱即用的支持，可根据限制生成并发场景。

考虑来自 [JCTools 库](https://github.com/JCTools/JCTools) 的 [单消费者队列](https://github.com/JCTools/JCTools/blob/66e6cbc9b88e1440a597c803b7df9bd1d60219f6/jctools-core/src/main/java/org/jctools/queues/atomic/MpscLinkedAtomicQueue.java)。让我们编写一个测试来检测其 `poll()`、`peek()` 和 `offer(x)` 操作的正确性。

在你的 `build.gradle(.kts)` 文件中，添加 JCTools 依赖项：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    // jctools 依赖项
    testImplementation("org.jctools:jctools-core:%jctoolsVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    // jctools 依赖项
    testImplementation "org.jctools:jctools-core:%jctoolsVersion%"
}
```
</tab>
</tabs>

为了满足单消费者限制，请确保所有 `poll()` 和 `peek()` 消费操作都从单个线程中调用。为此，我们可以将对应的 `@Operation` 注解的 `nonParallelGroup` 形参设置为相同的值，例如 `"consumers"`。

这是结果测试：

```kotlin
import org.jctools.queues.atomic.*
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
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

这是为此测试生成的场景示例：

```text
= 迭代 15 / 100 =
| --------------------- |
| 线程 1    | 线程 2    |
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

请注意，所有 `poll()` 和 `peek()` 消费调用都是从单个线程执行的，从而满足“单消费者”限制。

> [获取完整代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/MPSCQueueTest.kt).
>
{style="note"}

## 下一步

了解如何使用模型检测策略[检测你的算法的进度保证](progress-guarantees.md)。