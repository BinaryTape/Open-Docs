[//]: # (title: 进展保证)

许多并发算法提供非阻塞的进展保证，例如无锁和无等待。由于它们通常不平凡（复杂），很容易添加一个会阻塞算法的 bug。Lincheck 可以使用模型检测策略帮助您发现活跃性 bug。

要检查算法的进展保证，请在 `ModelCheckingOptions()` 中启用 `checkObstructionFreedom` 选项：

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

创建一个 `ConcurrentMapTest.kt` 文件。
然后添加以下测试，以检测 Java 标准库中的 `ConcurrentHashMap::put(key: K, value: V)` 是一个阻塞操作：

```kotlin
import org.jetbrains.kotlinx.lincheck.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*
import java.util.concurrent.*

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

运行 `modelCheckingTest()`。您应该得到以下结果：

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

现在，让我们为非阻塞的 `ConcurrentSkipListMap<K, V>` 添加一个测试，预期测试将成功通过：

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

> 常见的非阻塞进展保证（从强到弱）包括：
> 
> * **无等待（wait-freedom）**：无论其他线程做什么，每个操作都在有界步数内完成。
> * **无锁（lock-freedom）**：保证系统范围的进展，即至少一个操作在有界步数内完成，而某个特定操作可能会卡住。
> * **无阻塞性（obstruction-freedom）**：如果所有其他线程暂停，任何操作都在有界步数内完成。
>
{style="tip"}

目前，Lincheck 仅支持无阻塞性进展保证。然而，大多数现实生活中的活跃性 bug 会添加意外的阻塞代码，因此无阻塞性检查也将有助于无锁和无等待算法。

> * 获取[示例的完整代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ConcurrentMapTest.kt)。
> * 查看[另一个示例](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ObstructionFreedomViolationTest.kt)，其中 Michael-Scott 队列实现正在接受进展保证的测试。
>
{style="note"}

## 下一步

了解如何明确[指定](sequential-specification.md)被测算法的顺序规范，从而提高 Lincheck 测试的健壮性。