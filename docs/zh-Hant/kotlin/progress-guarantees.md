[//]: # (title: 進度保證)

許多並行演算法提供非阻塞式進度保證，例如無鎖 (lock-freedom) 和無等待 (wait-freedom)。由於它們通常不簡單，很容易加入一個會阻塞演算法的錯誤。Lincheck 可以透過模型檢查策略 (model checking strategy) 幫助您找到活性錯誤 (liveness bugs)。

若要檢查演算法的進度保證，請在 `ModelCheckingOptions()` 中啟用 `checkObstructionFreedom` 選項：

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

建立一個 `ConcurrentMapTest.kt` 檔案。
然後加入以下測試，以偵測 Java 標準函式庫中的 `ConcurrentHashMap::put(key: K, value: V)` 是一個阻塞操作：

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

執行 `modelCheckingTest()`。您應該會得到以下結果：

```text
= 需要無阻礙 (Obstruction-freedom)，但發現了鎖 =
| ---------------------- |
|  執行緒 1  | 執行緒 2  |
| ---------------------- |
| put(1, -1) |           |
| ---------------------- |
| put(2, -2) | put(3, 2) |
| ---------------------- |

---
水平線 | ----- | 上方的所有操作，發生在該線下方的操作之前
---

以下交錯導致錯誤：
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

現在，讓我們為非阻塞的 `ConcurrentSkipListMap<K, V>` 加入一個測試，預期測試能成功通過：

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

> 常見的非阻塞式進度保證（從最強到最弱）包括：
>
> * **無等待 (wait-freedom)**：當每個操作無論其他執行緒如何運作，都能在有界步數內完成。
> * **無鎖 (lock-freedom)**：保證系統範圍的進度，至少一個操作能在有界步數內完成，而特定操作可能會被卡住。
> * **無阻礙 (obstruction-freedom)**：當所有其他執行緒暫停時，任何操作都能在有界步數內完成。
>
{style="tip"}

目前，Lincheck 僅支援無阻礙的進度保證。然而，大多數實際生活中的活性錯誤都加入了非預期的阻塞程式碼，因此無阻礙檢查也將有助於無鎖和無等待演算法。

> * 獲取範例的[完整程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ConcurrentMapTest.kt)。
> * 請參閱[另一個範例](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ObstructionFreedomViolationTest.kt)，該範例測試了 Michael-Scott 佇列實作的進度保證。
>
{style="note"}

## 下一步

了解如何明確[指定](sequential-specification.md)測試演算法的循序規格，以提高 Lincheck 測試的穩健性。