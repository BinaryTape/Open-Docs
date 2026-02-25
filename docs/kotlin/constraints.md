[//]: # (title: 数据结构约束)

某些数据结构可能要求一部分操作不能并发执行，例如单生产者单消费者队列。Lincheck 为此类约定提供了开箱即用的支持，并根据限制生成并发场景。

让我们以 [JCTools 库](https://github.com/JCTools/JCTools) 中的 [单消费者队列](https://github.com/JCTools/JCTools/blob/66e6cbc9b88e1440a597c803b7df9bd1d60219f6/jctools-core/src/main/java/org/jctools/queues/atomic/MpscLinkedAtomicQueue.java) 为例。我们将编写一个测试来检查其 `poll()`、`peek()` 和 `offer(x)` 操作的正确性。

在您的 `build.gradle(.kts)` 文件中，添加 JCTools 依赖项：

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

为了满足单消费者限制，请确保所有 `poll()` 和 `peek()` 消费操作都从单个线程调用。为此，我们可以将相应 `@Operation` 注解的 `nonParallelGroup` 参数设置为相同的值，例如 `"consumers"`。

以下是生成的测试：

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

以下是为此测试生成的场景示例：

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

请注意，所有消费性质的 `poll()` 和 `peek()` 调用都在单个线程中执行，从而满足了“单消费者”限制。

> [获取完整代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/MPSCQueueTest.kt)。
>
{style="note"}

## 下一步

详细了解如何使用模型检查策略[检查您的算法的进度保证](progress-guarantees.md)。