[//]: # (title: 使用 Lincheck 撰寫您的第一個測試)

本教學示範如何撰寫您的第一個 Lincheck 測試、設定 Lincheck 架構並使用其基本 API。
您將在 IntelliJ IDEA 中建立一個包含錯誤並行計數器實作的新專案，並為其撰寫測試，
隨後尋找並分析該錯誤。

## 建立專案

在 IntelliJ IDEA 中開啟現有的 Kotlin 專案，或[建立一個新專案](https://kotlinlang.org/docs/jvm-get-started.html)。
建立專案時，請使用 Gradle 建置系統。

## 新增必要的相依性

1. 開啟 `build.gradle(.kts)` 檔案，並確保 `mavenCentral()` 已新增至存儲庫清單中。
2. 將以下相依性新增至 Gradle 配置：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheck 相依性
       testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
       // 此相依性讓您可以使用 kotlin.test 和 JUnit：
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
       // Lincheck 相依性
       testImplementation "org.jetbrains.lincheck:lincheck:%lincheckVersion%"
       // 此相依性讓您可以使用 kotlin.test 和 JUnit：
       testImplementation "junit:junit:4.13"
   }
   ```
   </tab>
   </tabs>

## 撰寫並行計數器並執行測試

1. 在 `src/test/kotlin` 目錄中，建立 `BasicCounterTest.kt` 檔案，
   並新增以下包含有錯誤的並行計數器及其 Lincheck 測試的程式碼：

   ```kotlin
   import org.jetbrains.lincheck.*
   import org.jetbrains.lincheck.datastructures.*
   import org.junit.*

   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter() // 初始狀態
   
       // Counter 上的操作
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test // JUnit
       fun stressTest() = StressOptions().check(this::class) // 魔法按鈕
   }
   ```

   此 Lincheck 測試會自動： 
   * 使用指定的 `inc()` 和 `get()` 操作產生數個隨機並行場景。
   * 對每個產生的場景執行大量的呼叫。
   * 驗證每次呼叫的結果是否正確。

2. 執行上述測試，您將看到以下錯誤：

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   ```

   在此，Lincheck 發現了一個違反計數器原子性（atomicity）的執行過程——兩次並行遞增以相同的結果 `1` 結束。這表示其中一次遞增已遺失，該計數器的行為是不正確的。

## 追蹤無效執行

除了顯示無效的執行結果外，Lincheck 還能提供導致錯誤的交錯（interleaving）過程。此
功能可透過 [模型檢查](testing-strategies.md#model-checking) 測試策略存取，
該策略會檢查在有限次的上下文切換下的眾多執行過程。

1. 若要切換測試策略，請將 `options` 類型從 `StressOptions()` 替換為 `ModelCheckingOptions()`。
更新後的 `BasicCounterTest` 類別如下所示：

   ```kotlin
   import org.jetbrains.lincheck.*
   import org.jetbrains.lincheck.datastructures.*
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

2. 再次執行測試。您將得到導致不正確結果的執行追蹤：

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

   * **T2**：第二個執行緒開始 `inc()` 操作，讀取目前的計數器值 (`value.READ: 0`) 並暫停。
   * **T1**：第一個執行緒執行 `inc()`，傳回 `1` 並完成。
   * **T2**：第二個執行緒恢復執行並增加先前取得的計數器值，錯誤地將計數器更新為 `1`。

> [取得完整程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/BasicCounterTest.kt)。
>
{style="note"}

## 測試 Java 標準程式庫

現在讓我們在標準 Java 的 `ConcurrentLinkedDeque` 類別中尋找錯誤。 
下方的 Lincheck 測試發現了在雙端隊列（deque）前端移除和新增元素之間的競爭（race）：

```kotlin
import java.util.concurrent.*
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

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
All operations above the horizontal line | ----- | happen before those below the line
---
Values in "[..]" brackets indicate the number of completed operations
in each of the parallel threads seen at the beginning of the current operation
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

> [取得完整程式碼](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedDequeTest.kt)。
>
{style="note"}

## 下一步

選擇 [您的測試策略並配置測試執行](testing-strategies.md)。

## 請參閱

* [如何產生操作引數](operation-arguments.md)
* [常見演算法約束](constraints.md)
* [檢查非阻塞進度保證](progress-guarantees.md)
* [定義演算法的循序規範](sequential-specification.md)