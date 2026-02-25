[//]: # (title: 进度保证)

许多并发算法提供了非阻塞进度保证，例如无锁 (lock-freedom) 和无等待 (wait-freedom)。由于这些算法通常比较复杂，很容易引入阻塞算法的 bug。Lincheck 可以通过模型检查策略帮助您查找活跃性 bug。

要检查算法的进度保证，请在 `ModelCheckingOptions()` 中启用 `checkObstructionFreedom` 选项：

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

创建一个 `ConcurrentMapTest.kt` 文件。
然后添加以下测试，以检测 Java 标准库中的 `ConcurrentHashMap::put(key: K, value: V)` 是否为一个阻塞操作：

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

运行 `modelCheckingTest()`。您应该会得到以下结果：

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

现在，让我们为非阻塞的 `ConcurrentSkipListMap<Int, Int>` 添加一个测试，预期该测试将成功通过：

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

> 常见的非阻塞进度保证包括（从最强到最弱）：
> 
> * **无等待 (wait-freedom)**：无论其他线程做什么，每个操作都在有限的步骤内完成。
> * **无锁 (lock-freedom)**：保证系统范围内的进度，即使某个特定操作可能卡住，至少有一个操作能在有限的步骤内完成。
> * **无阻碍 (obstruction-freedom)**：如果所有其他线程都暂停，任何操作都在有限的步骤内完成。
>
{style="tip"}

目前，Lincheck 仅支持无阻碍 (obstruction-freedom) 进度保证。然而，大多数现实生活中的活跃性 bug 都会引入意外的阻塞代码，因此无阻碍检查也将有助于检测无锁和无等待算法。

> * 获取 [该示例的完整代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentMapTest.kt)。
> * 查看 [另一个示例](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ObstructionFreedomViolationTest.kt)，该示例测试了 Michael-Scott 队列实现的进度保证。
>
{style="note"}

## 下一步

了解如何显式地 [指定顺序规范](sequential-specification.md) 测试算法，从而提高 Lincheck 测试的健壮性。