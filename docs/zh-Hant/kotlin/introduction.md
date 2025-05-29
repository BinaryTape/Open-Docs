[//]: # (title: 撰寫您的第一個 Lincheck 測試)

本教學示範如何編寫您的第一個 Lincheck 測試，設定 Lincheck 框架，並使用其基本 API。您將建立一個新的 IntelliJ IDEA 專案，其中包含一個不正確的併發計數器實作，並為其編寫測試，之後再找出並分析該錯誤。

## 建立專案

在 IntelliJ IDEA 中開啟現有的 Kotlin 專案，或[建立一個新專案](https://kotlinlang.org/docs/jvm-get-started.html)。建立專案時，請使用 Gradle 建構系統。

## 新增所需依賴項

1. 開啟 `build.gradle(.kts)` 檔案，並確保 `mavenCentral()` 已新增至儲存庫清單。
2. 將以下依賴項新增至 Gradle 設定中：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheck 依賴項
       testImplementation("org.jetbrains.kotlinx:lincheck:%lincheckVersion%")
       // 此依賴項可讓您使用 kotlin.test 和 JUnit：
       testImplementation("junit:junit:4.13")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheck 依賴項
       testImplementation "org.jetbrains.kotlinx:lincheck:%lincheckVersion%"
       // 此依賴項可讓您使用 kotlin.test 和 JUnit：
       testImplementation "junit:junit:4.13"
   }
   ```
   </tab>
   </tabs>

## 編寫併發計數器並執行測試

1. 在 `src/test/kotlin` 目錄中，建立一個 `BasicCounterTest.kt` 檔案，並新增以下包含有錯誤的併發計數器及 Lincheck 測試的程式碼：

   ```kotlin
   import org.jetbrains.kotlinx.lincheck.annotations.*
   import org.jetbrains.kotlinx.lincheck.*
   import org.jetbrains.kotlinx.lincheck.strategy.stress.*
   import org.junit.*

   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter() // 初始狀態
   
       // 對計數器的操作
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test // JUnit
       fun stressTest() = StressOptions().check(this::class) // 神奇按鈕
   }
   ```

   此 Lincheck 測試會自動執行以下操作：
   * 產生數個隨機的併發情境，並使用指定的 `inc()` 和 `get()` 操作。
   * 對每個產生出的情境執行大量呼叫 (invocation)。
   * 驗證每個呼叫結果是否正確。

2. 執行上述測試，您將會看到以下錯誤：

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   ```

   在這裡，Lincheck 發現了一個違反計數器原子性 (atomicity) 的執行 — 兩個併發遞增 (increment) 產生了相同的結果 `1`。這表示其中一個遞增操作已遺失，且計數器的行為不正確。

## 追蹤無效執行

除了顯示無效的執行結果外，Lincheck 還能提供導致錯誤的交錯執行 (interleaving)。此功能可透過[模型檢查](testing-strategies.md#model-checking)測試策略來使用，該策略會檢查具有有限數量的上下文切換 (context switch) 的眾多執行。

1. 若要切換測試策略，請將 `options` 類型從 `StressOptions()` 替換為 `ModelCheckingOptions()`。更新後的 `BasicCounterTest` 類別將會像這樣：

   ```kotlin
   import org.jetbrains.kotlinx.lincheck.annotations.*
   import org.jetbrains.kotlinx.lincheck.check
   import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
   import org.junit.*
   
   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter()
   
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test
       fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
   }
   ```

2. 再次執行測試。您將會得到導致不正確結果的執行追蹤 (execution trace)：

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   
   The following interleaving leads to the error:
   | --------------------------------------------------------------------- |
   | Thread 1 |                          Thread  2                         |
   | --------------------------------------------------------------------- |
   |          | inc()                                                      |
   |          |   inc(): 1 at BasicCounterTest.inc(BasicCounterTest.kt:18) |
   |          |     value.READ: 0 at Counter.inc(BasicCounterTest.kt:10)   |
   |          |     switch                                                 |
   | inc(): 1 |                                                            |
   |          |     value.WRITE(1) at Counter.inc(BasicCounterTest.kt:10)  |
   |          |     value.READ: 1 at Counter.inc(BasicCounterTest.kt:10)   |
   |          |   result: 1                                                |
   | --------------------------------------------------------------------- |
   ```

   根據追蹤，發生了以下事件：

   * **T2**：第二個執行緒啟動 `inc()` 操作，讀取目前的計數器值 (`value.READ: 0`) 並暫停。
   * **T1**：第一個執行緒執行 `inc()`，回傳 `1`，並結束。
   * **T2**：第二個執行緒恢復並遞增先前取得的計數器值，錯誤地將計數器更新為 `1`。

> [獲取完整程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/BasicCounterTest.kt)。
>
{style="note"}

## 測試 Java 標準函式庫

現在，讓我們在標準 Java 的 `ConcurrentLinkedDeque` 類別中找出一個錯誤。下面的 Lincheck 測試會找出在移除和新增元素到雙端佇列 (deque) 頭部時的競態條件 (race condition)：

```kotlin
import org.jetbrains.kotlinx.lincheck.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*
import java.util.concurrent.*

class ConcurrentDequeTest {
    private val deque = ConcurrentLinkedDeque<Int>()

    @Operation
    fun addFirst(e: Int) = deque.addFirst(e)

    @Operation
    fun addLast(e: Int) = deque.addLast(e)

    @Operation
    fun pollFirst() = deque.pollFirst()

    @Operation
    fun pollLast() = deque.pollLast()

    @Operation
    fun peekFirst() = deque.peekFirst()

    @Operation
    fun peekLast() = deque.peekLast()

    @Test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

執行 `modelCheckingTest()`。測試將失敗並顯示以下輸出：

```text
= Invalid execution results =
| ---------------------------------------- |
|      Thread 1     |       Thread 2       |
| ---------------------------------------- |
| addLast(22): void |                      |
| ---------------------------------------- |
| pollFirst(): 22   | addFirst(8): void    |
|                   | peekLast(): 22 [-,1] |
| ---------------------------------------- |

---
水平線 | ----- | 上方的所有操作發生在線下方的操作之前
---
方括號 "[..]" 中的值表示在目前操作開始時，每個並行執行緒中已完成的操作數量
---

The following interleaving leads to the error:
| --------------------------------------------------------------------------------------------------------------------------------- |
|                                                Thread 1                                                    |       Thread 2       |
| --------------------------------------------------------------------------------------------------------------------------------- |
| pollFirst()                                                                                                |                      |
|   pollFirst(): 22 at ConcurrentDequeTest.pollFirst(ConcurrentDequeTest.kt:17)                              |                      |
|     first(): Node@1 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:915)                     |                      |
|     item.READ: null at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:917)                     |                      |
|     next.READ: Node@2 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:925)                   |                      |
|     item.READ: 22 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:917)                       |                      |
|     prev.READ: null at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:919)                     |                      |
|     switch                                                                                                 |                      |
|                                                                                                            | addFirst(8): void    |
|                                                                                                            | peekLast(): 22       |
|     compareAndSet(Node@2,22,null): true at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:920) |                      |
|     unlink(Node@2) at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:921)                      |                      |
|   result: 22                                                                                               |                      |
| --------------------------------------------------------------------------------------------------------------------------------- |
```

> [獲取完整程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ConcurrentLinkedDequeTest.kt)。
>
{style="note"}

## 下一步

選擇[您的測試策略並設定測試執行](testing-strategies.md)。

## 另請參閱

* [如何產生操作參數 (operation arguments)](operation-arguments.md)
* [常見演算法約束 (constraints)](constraints.md)
* [檢查非阻塞式進度保證 (non-blocking progress guarantees)](progress-guarantees.md)
* [定義演算法的循序規範 (sequential specification)](sequential-specification.md)