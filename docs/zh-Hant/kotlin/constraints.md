[//]: # (title: 資料結構約束)

有些資料結構可能要求部分操作不能並行執行，例如單一生產者單一消費者佇列。Lincheck 為此類契約提供了開箱即用的支援，並根據限制生成並發場景。

考慮來自 [JCTools 函式庫](https://github.com/JCTools/JCTools) 的 [單一消費者佇列](https://github.com/JCTools/JCTools/blob/66e6cbc9b88e1440a597c803b7df9bd1d60219f6/jctools-core/src/main/java/org/jctools/queues/atomic/MpscLinkedAtomicQueue.java)。讓我們編寫一個測試來檢查其 `poll()`、`peek()` 和 `offer(x)` 操作的正確性。

在你的 `build.gradle(.kts)` 檔案中，新增 JCTools 依賴項：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // jctools 依賴項
       testImplementation("org.jctools:jctools-core:%jctoolsVersion%")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // jctools 依賴項
       testImplementation "org.jctools:jctools-core:%jctoolsVersion%"
   }
   ```
   </tab>
   </tabs>

為了滿足單一消費者限制，請確保所有 `poll()` 和 `peek()` 消費操作都從單一執行緒呼叫。為此，我們可以將相應的 `@Operation` 註解的 `nonParallelGroup` 參數設定為相同的值，例如 `"consumers"`。

以下是最終的測試程式碼：

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

以下是為此測試生成的場景範例：

```text
= 迭代 15 / 100 =
| --------------------- |
| 執行緒 1  | 執行緒 2  |
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

請注意，所有消費型的 `poll()` 和 `peek()` 調用都是從單一執行緒執行的，因此滿足了「單一消費者」限制。

> [獲取完整程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/MPSCQueueTest.kt)。
>
{style="note"}

## 下一步

了解如何使用模型檢查策略來[檢查你的演算法是否提供進度保證](progress-guarantees.md)。