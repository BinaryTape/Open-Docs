[//]: # (title: 資料結構限制)

某些資料結構可能要求部分操作不應同時執行，例如單生產者單消費者佇列。Lincheck 為此類契約提供了開箱即用支援，可根據限制生成並行情境。

考慮 [JCTools 函式庫](https://github.com/JCTools/JCTools) 中的 [單消費者佇列](https://github.com/JCTools/JCTools/blob/66e6cbc9b88e1440a597c803b7df9bd1d60219f6/jctools-core/src/main/java/org/jctools/queues/atomic/MpscLinkedAtomicQueue.java)。讓我們編寫一個測試來檢查其 `poll()`、`peek()` 和 `offer(x)` 操作的正確性。

在您的 `build.gradle(.kts)` 檔案中，加入 JCTools 相依性：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // jctools dependency
       testImplementation("org.jctools:jctools-core:%jctoolsVersion%")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // jctools dependency
       testImplementation "org.jctools:jctools-core:%jctoolsVersion%"
   }
   ```
   </tab>
   </tabs>

為滿足單消費者限制，請確保所有 `poll()` 和 `peek()` 消費操作都從單一執行緒呼叫。為此，我們可以將對應 `@Operation` 註解的 `nonParallelGroup` 參數設定為相同的值，例如 `"consumers"`。

以下是最終的測試：

```kotlin
import org.jctools.queues.atomic.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
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

以下是為此測試生成的情境範例：

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

請注意，所有消費性的 `poll()` 和 `peek()` 呼叫均從單一執行緒執行，因此滿足「單消費者」限制。

> [取得完整程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/MPSCQueueTest.kt)。
>
{style="note"}

## 下一步

了解如何使用模型檢查策略來[檢查您的演算法是否具有進度保證](progress-guarantees.md)。