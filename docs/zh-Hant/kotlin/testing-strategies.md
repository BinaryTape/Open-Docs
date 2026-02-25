[//]: # (title: 壓力測試與模型檢查)

Lincheck 提供兩種測試策略：壓力測試與模型檢查。透過我們在[上一步](introduction.md)的 `BasicCounterTest.kt` 檔案中編寫的 `Counter`，來了解這兩種方法幕後的運作機制：

```kotlin
class Counter {
    @Volatile
    private var value = 0

    fun inc(): Int = ++value
    fun get() = value
}
```

## 壓力測試

### 編寫壓力測試

按照以下步驟，為 `Counter` 建立一個並行壓力測試：

1. 建立 `CounterTest` 類別。
2. 在此類別中，加入 `Counter` 型別的欄位 `c`，並在建構函式中建立執行個體。
3. 列出計數器操作並使用 `@Operation` 註解進行標記，將其導向至 `c` 的實作。
4. 使用 `StressOptions()` 指定壓力測試策略。
5. 呼叫 `StressOptions.check()` 函式來執行測試。

產出的程式碼如下所示：

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初始狀態
    
    // Counter 上的操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 執行測試
    fun stressTest() = StressOptions().check(this::class)
}
```

### 壓力測試的運作原理 {initial-collapse-state="collapsed" collapsible="true"}

首先，Lincheck 會使用標記了 `@Operation` 的操作產生一組並行場景。接著它會啟動原生執行緒，並在開始時進行同步，以確保操作同時啟動。最後，Lincheck 在這些原生執行緒上多次執行每個場景，期望能觸發產生錯誤結果的交錯（interleaving）。

下圖顯示了 Lincheck 如何執行產生的場景之高階架構：

![Counter 的壓力執行](counter-stress.png){width=700}

## 模型檢查

壓力測試的主要疑慮在於，你可能需要花費數小時來嘗試理解如何重現發現的錯誤。為了協助解決這個問題，Lincheck 支援有界模型檢查，它會自動提供用於重現錯誤的交錯方式。

模型檢查測試的建構方式與壓力測試相同。只需將指定測試策略的 `StressOptions()` 替換為 `ModelCheckingOptions()` 即可。

### 編寫模型檢查測試

要將壓力測試策略更改為模型檢查，請在測試中將 `StressOptions()` 替換為 `ModelCheckingOptions()`：

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初始狀態

    // Counter 上的操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 執行測試
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

### 模型檢查的運作原理 {initial-collapse-state="collapsed" collapsible="true"}

複雜並行演算法中的大多數錯誤都可以透過經典的交錯方式（將執行從一個執行緒切換到另一個執行緒）來重現。此外，弱記憶體模型的模型檢查器非常複雜，因此 Lincheck 在「順序一致性記憶體模型」下使用有界模型檢查。

簡而言之，Lincheck 會分析所有交錯，從一個上下文切換開始，然後是兩個，持續這個過程直到檢查完指定數量的交錯。這種策略可以用盡可能少的上下文切換次數找到不正確的排程，使後續的錯誤調查變得更容易。

為了控制執行，Lincheck 會在測試程式碼中插入特殊的切換點。這些點標識了可以執行上下文切換的位置。本質上，這些是共用記憶體存取，例如 JVM 中的欄位和陣列元素讀取或更新，以及 `wait/notify` 和 `park/unpark` 呼叫。為了插入切換點，Lincheck 使用 ASM 架構即時轉換測試程式碼，在現有程式碼中加入內部函式呼叫。

由於模型檢查策略控制了執行過程，Lincheck 可以提供導致無效交錯的追蹤，這在實踐中非常有幫助。你可以在 [使用 Lincheck 編寫你的第一個測試](introduction.md#trace-the-invalid-execution) 教學中看到 `Counter` 錯誤執行的追蹤範例。

## 哪種測試策略更好？

「模型檢查策略」更適合在順序一致性記憶體模型下尋找錯誤，因為它能確保更好的涵蓋率，並在發現錯誤時提供失敗的執行追蹤。

雖然「壓力測試」不保證任何涵蓋率，但對於檢查由低階效應（例如遺漏 `volatile` 修飾符）引起的演算法錯誤仍然很有幫助。壓力測試對於發現需要多次上下文切換才能重現的罕見錯誤也有很大幫助，而由於目前模型檢查策略的限制，無法分析所有這些錯誤。

## 配置測試策略

要配置測試策略，請在 `<TestingMode>Options` 類別中設定選項。

1. 為 `CounterTest` 設定場景產生和執行的選項：

    ```kotlin
    import org.jetbrains.lincheck.*
    import org.jetbrains.lincheck.datastructures.*
    import org.junit.*
    
    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
    
        @Test
        fun stressTest() = StressOptions() // 壓力測試選項：
            .actorsBefore(2) // 平行部分之前的操作數量
            .threads(2) // 平行部分的執行緒數量
            .actorsPerThread(2) // 平行部分每個執行緒的操作數量
            .actorsAfter(1) // 平行部分之後的操作數量
            .iterations(100) // 產生 100 個隨機並行場景
            .invocationsPerIteration(1000) // 每個產生的場景執行 1000 次
            .check(this::class) // 執行測試
    }
    ```

2. 再次執行 `stressTest()`，Lincheck 將會產生類似於下方的場景：

   ```text 
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc()    |          |
   | inc()    |          |
   | ------------------- |
   | get()    | inc()    |
   | inc()    | get()    |
   | ------------------- |
   | inc()    |          |
   | ------------------- |
   ```

   在這裡，平行部分之前有兩個操作，平行部分有兩個執行緒，每個執行緒有兩個操作，最後跟著一個操作。

你可以用同樣的方式配置模型檢查測試。

## 場景最小化

你可能已經注意到，偵測到的錯誤通常以比測試配置中指定的場景更小的場景來表示。Lincheck 會嘗試最小化錯誤，在保持測試失敗的前提下，主動移除盡可能多的操作。

以下是上述計數器測試的最小化場景：

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

由於較小的場景更容易分析，因此場景最小化預設為啟用。若要停用此功能，請在 `[Stress, ModelChecking]Options` 配置中加入 `minimizeFailedScenario(false)`。

## 記錄資料結構狀態

另一個對偵錯非常有用的功能是「狀態記錄」。在分析導致錯誤的交錯時，你通常會在紙上繪製資料結構的變化，在每個事件後更改狀態。為了使此程序自動化，你可以提供一個回傳資料結構 `String` 表示形式的特殊方法，這樣 Lincheck 就會在修改資料結構的交錯中的每個事件後，印出狀態表示。

為此，請定義一個不帶參數且標記有 `@StateRepresentation` 註解的方法。該方法必須是執行緒安全的、非阻塞的，且絕不能修改資料結構。

1. 在 `Counter` 範例中，`String` 表示形式僅僅是計數器的值。因此，要在追蹤中印出計數器狀態，請將 `stateRepresentation()` 函式加入 `CounterTest`：

    ```kotlin
    import org.jetbrains.lincheck.*
    import org.jetbrains.lincheck.datastructures.*
    import org.junit.Test

    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
        
        @StateRepresentation
        fun stateRepresentation() = c.get().toString()
        
        @Test
        fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
    }
    ```

2. 現在執行 `modelCheckingTest()`，並檢查在修改計數器狀態的切換點印出的 `Counter` 狀態（它們以 `STATE:` 開頭）：

    ```text
    = Invalid execution results =
    | ------------------- |
    | Thread 1 | Thread 2 |
    | ------------------- |
    | STATE: 0            |
    | ------------------- |
    | inc(): 1 | inc(): 1 |
    | ------------------- |
    | STATE: 1            |
    | ------------------- |
    
    The following interleaving leads to the error:
    | -------------------------------------------------------------------- |
    | Thread 1 |                         Thread 2                          |
    | -------------------------------------------------------------------- |
    |          | inc()                                                     |
    |          |   inc(): 1 at CounterTest.inc(CounterTest.kt:10)          |
    |          |     value.READ: 0 at Counter.inc(BasicCounterTest.kt:10)  |
    |          |     switch                                                |
    | inc(): 1 |                                                           |
    | STATE: 1 |                                                           |
    |          |     value.WRITE(1) at Counter.inc(BasicCounterTest.kt:10) |
    |          |     STATE: 1                                              |
    |          |     value.READ: 1 at Counter.inc(BasicCounterTest.kt:10)  |
    |          |   result: 1                                               |
    | -------------------------------------------------------------------- |
    ```

在壓力測試的情況下，Lincheck 會在場景的平行部分之前、之後以及最後印出狀態表示。

> * 取得[這些範例的完整程式碼](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/CounterTest.kt)
> * 查看更多[測試範例](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/lincheck_test/guide)
>
{style="note"}

## 下一步

了解如何[配置傳遞給操作的引數](operation-arguments.md)以及何時會有幫助。