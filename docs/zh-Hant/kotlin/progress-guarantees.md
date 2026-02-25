[//]: # (title: 進展保證)

許多並行演算法提供非阻塞 (non-blocking) 的進展保證，例如 lock-freedom 和 wait-freedom。由於這些演算法通常非常複雜，因此很容易引入會阻塞演算法的錯誤。Lincheck 透過模型檢查策略，協助您發現存活性錯誤。

若要檢查演算法的進展保證，請在 `ModelCheckingOptions()` 中啟用 `checkObstructionFreedom` 選項：

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

建立一個 `ConcurrentMapTest.kt` 檔案。
接著加入以下測試，以偵測 Java 標準程式庫中的 `ConcurrentHashMap::put(key: K, value: V)` 是否為阻塞操作：

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

現在讓我們為非阻塞的 `ConcurrentSkipListMap<K, V>` 加入測試，並預期該測試能成功通過：

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

> 常見的非阻塞進展保證如下（由強到弱）：
> 
> * **wait-freedom**：無論其他執行緒做什麼，每個操作都能在有限的步驟內完成。
> * **lock-freedom**：保證系統層級的進展，即使某個特定操作可能卡住，但至少會有一個操作能在有限的步驟內完成。
> * **obstruction-freedom**：如果所有其他執行緒都暫停，任何操作都能在有限的步驟內完成。
>
{style="tip"}

目前 Lincheck 僅支援 obstruction-freedom 進展保證。然而，大多數實際發生的存活性錯誤都是因為加入了非預期的阻塞程式碼，因此 obstruction-freedom 檢查對於 lock-free 和 wait-free 演算法也會有所幫助。

> * 取得[範例的完整程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentMapTest.kt)。
> * 參閱[另一個範例](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ObstructionFreedomViolationTest.kt)，該範例對 Michael-Scott 佇列實作進行了進展保證測試。
>
{style="note"}

## 下一步

了解如何明確地[指定測試演算法的循序規格](sequential-specification.md)，以提高 Lincheck 測試的穩健性。