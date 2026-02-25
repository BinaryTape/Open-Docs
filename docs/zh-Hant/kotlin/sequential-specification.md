[//]: # (title: 循序規格)

為了確保演算法提供正確的循序行為，您可以透過為測試資料結構撰寫直觀的循序實作，來定義其 *循序規格*。

> 此功能也讓您只需撰寫單一測試，而無需分別撰寫循序與並行兩項測試。
>
{style="tip"}

若要提供演算法的循序規格以進行驗證：

1. 實作所有測試方法的循序版本。
2. 將包含循序實作的類別傳遞給 `sequentialSpecification()` 選項：

   ```kotlin
   StressOptions().sequentialSpecification(SequentialQueue::class)
   ```

例如，以下是檢查 Java 標準程式庫中 `j.u.c.ConcurrentLinkedQueue` 正確性的測試。

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

> 獲取 [範例的完整程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedQueueTest.kt)。
>
{style="note"}