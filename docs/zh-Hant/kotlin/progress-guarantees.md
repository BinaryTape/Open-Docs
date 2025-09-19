[//]: # (title: 進度保證)

許多並發演算法提供非阻塞的進度保證，例如鎖自由和等待自由。由於它們通常不平凡，因此很容易引入阻塞演算法的錯誤。Lincheck 可以透過模型檢查策略幫助您找到活性錯誤。

要檢查演算法的進度保證，請在 `ModelCheckingOptions()` 中啟用 `checkObstructionFreedom` 選項：

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

建立一個 `ConcurrentMapTest.kt` 檔案。
然後新增以下測試，以偵測到來自 Java 標準函式庫的 `ConcurrentHashMap::put(key: K, value: V)` 是一個阻塞操作：

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

執行 `modelCheckingTest()`。您應該會得到以下結果：

```text
= 需要阻礙自由，但找到了一個鎖 =
| ---------------------- |
|  Thread 1  | Thread 2  |
| ---------------------- |
| put(1, -1) |           |
| ---------------------- |
| put(2, -2) | put(3, 2) |
| ---------------------- |

---
所有在水平線 | ----- | 上方的操作都發生在線下方的操作之前
---

以下交錯執行導致錯誤：
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

現在我們來新增一個針對非阻塞的 `ConcurrentSkipListMap<K, V>` 的測試，預期該測試將成功通過：

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

> 常見的非阻塞進度保證（從最強到最弱）：
> 
> * **等待自由 (wait-freedom)**：當每個操作無論其他執行緒做什麼都能在有限步驟內完成時。
> * **鎖自由 (lock-freedom)**：保證系統範圍的進度，使得至少一個操作在有限步驟內完成，而特定操作可能會被卡住。
> * **阻礙自由 (obstruction-freedom)**：當所有其他執行緒暫停時，任何操作都能在有限步驟內完成。
>
{style="tip"}

目前，Lincheck 只支援阻礙自由進度保證。然而，大多數實際的活性錯誤增加了意料之外的阻塞程式碼，因此阻礙自由檢查也將有助於鎖自由和等待自由演算法。

> * 取得[完整範例程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentMapTest.kt)。
> * 請參閱[另一個範例](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ObstructionFreedomViolationTest.kt)，其中 Michael-Scott 佇列的實作測試了進度保證。
>
{style="note"}

## 下一步

學習如何[明確指定測試演算法的循序規範](sequential-specification.md)，以提高 Lincheck 測試的穩健性。