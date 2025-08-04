[//]: # (title: 进展保证)

许多并发算法提供非阻塞进展保证，例如锁自由和等待自由。由于它们通常不平凡，很容易引入一个阻塞算法的 bug。Lincheck 可以帮助你使用模型检测策略发现活性 bug。

要检测算法的进展保证，请在 `ModelCheckingOptions()` 中启用 `checkObstructionFreedom` 选项：

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

创建一个 `ConcurrentMapTest.kt` 文件。然后添加以下测试来检测 Java 标准库中的 `ConcurrentHashMap::put(key: K, value: V)` 是一个阻塞操作：

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

运行 `modelCheckingTest()`。你将得到以下结果：

```text
= 需具备阻塞自由性，但检测到锁 =
| ---------------------- |
|  线程 1  | 线程 2  |
| ---------------------- |
| put(1, -1) |           |
| ---------------------- |
| put(2, -2) | put(3, 2) |
| ---------------------- |

---
水平线 | ----- | 上方的所有操作发生在该线下方操作之前
---

以下交错导致错误：
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                         线程 1                                         |                                         线程 2                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                                          | put(3, 2)                                                                                |
|                                                                                          |   put(3,2) 位于 ConcurrentHashMapTest.put(ConcurrentMapTest.kt:11)                         |
|                                                                                          |     putVal(3,2,false) 位于 ConcurrentHashMap.put(ConcurrentHashMap.java:1006)              |
|                                                                                          |       table.READ: Node[]@1 位于 ConcurrentHashMap.putVal(ConcurrentHashMap.java:1014)      |
|                                                                                          |       tabAt(Node[]@1,0): Node@1 位于 ConcurrentHashMap.putVal(ConcurrentHashMap.java:1018) |
|                                                                                          |       MONITORENTER 位于 ConcurrentHashMap.putVal(ConcurrentHashMap.java:1031)              |
|                                                                                          |       tabAt(Node[]@1,0): Node@1 位于 ConcurrentHashMap.putVal(ConcurrentHashMap.java:1032) |
|                                                                                          |       next.READ: null 位于 ConcurrentHashMap.putVal(ConcurrentHashMap.java:1046)           |
|                                                                                          |       switch                                                                             |
| put(2, -2)                                                                               |                                                                                          |
|   put(2,-2) 位于 ConcurrentHashMapTest.put(ConcurrentMapTest.kt:11)                        |                                                                                          |
|     putVal(2,-2,false) 位于 ConcurrentHashMap.put(ConcurrentHashMap.java:1006)             |                                                                                          |
|       table.READ: Node[]@1 位于 ConcurrentHashMap.putVal(ConcurrentHashMap.java:1014)      |                                                                                          |
|       tabAt(Node[]@1,0): Node@1 位于 ConcurrentHashMap.putVal(ConcurrentHashMap.java:1018) |                                                                                          |
|       MONITORENTER 位于 ConcurrentHashMap.putVal(ConcurrentHashMap.java:1031)              |                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
```

现在我们来为非阻塞的 `ConcurrentSkipListMap<K, V>` 添加一个测试，预期该测试将成功通过：

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

> 常见的非阻塞进展保证包括（从强到弱排列）：
> 
> * **等待自由**，指无论其他线程做什么，每个操作都在有限步内完成。
> * **锁自由**，保证系统级进展，即至少一个操作在有限步内完成，而特定操作可能会卡住。
> * **阻塞自由性**，指如果所有其他线程都暂停，任何操作都在有限步内完成。
>
{style="tip"}

目前，Lincheck 仅支持阻塞自由性进展保证。然而，大多数实际的活性 bug 都会添加意外的阻塞代码，因此阻塞自由性检测也将有助于无锁和无等待算法。

> * 获取[示例的完整代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentMapTest.kt)。
> * 参阅[另一个示例](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ObstructionFreedomViolationTest.kt)，其中 Michael-Scott 队列实现经过了进展保证检测。
>
{style="note"}

## 下一步

了解如何[显式指定测试算法的顺序规范](sequential-specification.md)，从而提高 Lincheck 测试的健壮性。