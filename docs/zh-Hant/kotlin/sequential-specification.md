[//]: # (title: 循序規範)

為了確保演算法提供正確的循序行為，您可以透過撰寫測試資料結構的直接循序實作來定義其_循序規範_。

> 此功能也允許您撰寫單一測試，而非兩個獨立的循序測試和並行測試。
>
{style="tip"}

為了提供演算法的循序規範以進行驗證：

1. 實作所有測試方法的循序版本。
2. 將帶有循序實作的類別傳遞給 `sequentialSpecification()` 選項：

   ```kotlin
   StressOptions().sequentialSpecification(SequentialQueue::class)
   ```

例如，以下是檢查來自 Java 標準函式庫的 `j.u.c.ConcurrentLinkedQueue` 正確性的測試。

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

> 取得[範例的完整程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedQueueTest.kt)。
>
{style="note"}