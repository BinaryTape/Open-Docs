[//]: # (title: 壓力測試與模型檢查)

Lincheck 提供兩種測試策略：壓力測試和模型檢查。使用我們在 [上一步](introduction.md) 的 `BasicCounterTest.kt` 檔案中編寫的 `Counter`，了解這兩種方法在底層是如何運作的：

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

按照以下步驟，為 `Counter` 建立一個並發壓力測試：

1. 建立 `CounterTest` 類別。
2. 在此類別中，新增 `Counter` 類型的欄位 `c`，並在建構函式中建立一個實例。
3. 列出計數器操作並使用 `@Operation` 註解標記它們，將其實作委派給 `c`。
4. 使用 `StressOptions()` 指定壓力測試策略。
5. 呼叫 `StressOptions.check()` 函數以執行測試。

最終程式碼將如下所示：

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初始狀態
    
    // 對 Counter 的操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 執行測試
    fun stressTest() = StressOptions().check(this::class)
}
```

### 壓力測試運作原理 {initial-collapse-state="collapsed" collapsible="true"}

首先，Lincheck 使用標記有 `@Operation` 的操作生成一組並發情境。然後它會啟動原生執行緒，並在開始時同步它們，以確保操作同時啟動。最後，Lincheck 會在這些原生執行緒上多次執行每個情境，期望能遇到產生錯誤結果的交錯執行。

下圖顯示了 Lincheck 可能如何執行生成的情境的高階方案：

![Counter 的壓力執行](counter-stress.png){width=700}

## 模型檢查

關於壓力測試的主要問題是，你可能需要花費數小時來嘗試理解如何重現找到的錯誤。為了幫助你解決此問題，Lincheck 支援有界模型檢查，它會自動提供一個用於重現錯誤的交錯執行。

模型檢查測試的建構方式與壓力測試相同。只需將指定測試策略的 `StressOptions()` 替換為 `ModelCheckingOptions()` 即可。

### 編寫模型檢查測試

要將壓力測試策略更改為模型檢查，請在你的測試中將 `StressOptions()` 替換為 `ModelCheckingOptions()`：

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初始狀態

    // 對 Counter 的操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 執行測試
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

### 模型檢查運作原理 {initial-collapse-state="collapsed" collapsible="true"}

複雜並發演算法中的大多數錯誤都可以透過經典的交錯執行來重現，即將執行從一個執行緒切換到另一個執行緒。此外，弱記憶體模型（weak memory models）的模型檢查器非常複雜，因此 Lincheck 在 _序列一致性記憶體模型_ 下使用有界模型檢查。

簡而言之，Lincheck 會分析所有交錯執行，從一次上下文切換開始，然後兩次，持續這個過程直到檢查完指定數量的交錯執行。此策略允許以最少的上下文切換次數找到不正確的排程，使後續的錯誤調查更容易。

為了控制執行，Lincheck 會在測試程式碼中插入特殊的切換點 (switch points)。這些點會標識可以執行上下文切換的位置。本質上，這些是共享記憶體存取，例如 JVM 中的欄位和陣列元素讀取或更新，以及 `wait/notify` 和 `park/unpark` 呼叫。為了插入切換點，Lincheck 會使用 ASM 框架即時轉換測試程式碼，將內部函數呼叫新增到現有程式碼中。

由於模型檢查策略控制著執行，Lincheck 可以提供導致無效交錯執行的追蹤 (trace)，這在實踐中極為有用。你可以在 [使用 Lincheck 編寫你的第一個測試](introduction.md#trace-the-invalid-execution) 教學中看到 `Counter` 錯誤執行的追蹤範例。

## 哪種測試策略更好？

在序列一致性記憶體模型下，_模型檢查策略_ 更適合尋找錯誤，因為它能確保更好的覆蓋率，並在發現錯誤時提供失敗的執行追蹤。

儘管 _壓力測試_ 不保證任何覆蓋率，但對於檢查因低階效應（例如遺漏 `volatile` 修飾符）引入的錯誤演算法仍然很有幫助。壓力測試對於發現需要大量上下文切換才能重現的罕見錯誤也大有助益，而由於模型檢查策略的當前限制，不可能分析所有這類錯誤。

## 設定測試策略

若要設定測試策略，請在 `<TestingMode>Options` 類別中設定選項。

1. 為 `CounterTest` 設定情境生成和執行的選項：

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
            .actorsBefore(2) // 並行部分之前操作的數量
            .threads(2) // 並行部分中的執行緒數量
            .actorsPerThread(2) // 並行部分中每個執行緒的操作數量
            .actorsAfter(1) // 並行部分之後操作的數量
            .iterations(100) // 生成 100 個隨機並發情境
            .invocationsPerIteration(1000) // 每個生成的情境執行 1000 次
            .check(this::class) // 執行測試
    }
    ```

2. 再次執行 `stressTest()`，Lincheck 將生成類似於以下的情境：

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

   在這裡，並行部分之前有兩個操作，兩個操作各由兩個執行緒執行，之後再由一個單一操作結束。

你可以用相同的方式設定你的模型檢查測試。

## 情境最小化

你可能已經注意到，檢測到的錯誤通常以比測試配置中指定的小的情境來表示。Lincheck 會嘗試最小化錯誤，在不導致測試失敗的情況下，主動移除一個操作。

以下是上述計數器測試的最小化情境：

```text
= 無效執行結果 =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

由於分析較小的情境更容易，情境最小化功能預設是啟用的。若要禁用此功能，請在 `[Stress, ModelChecking]Options` 配置中新增 `minimizeFailedScenario(false)`。

## 記錄資料結構狀態

另一個有用的除錯功能是 _狀態記錄_。當分析導致錯誤的交錯執行時，你通常會在紙上畫出資料結構的變化，在每個事件之後改變狀態。為了自動化此過程，你可以提供一個特殊方法，它返回資料結構的 `String` 表示，這樣 Lincheck 就會在交錯執行中修改資料結構的每個事件之後列印狀態表示。

為此，請定義一個不帶引數且標記有 `@StateRepresentation` 註解的方法。該方法應該是執行緒安全的、非阻塞的，並且永遠不會修改資料結構。

1. 在 `Counter` 範例中，`String` 表示只是計數器的值。因此，要在追蹤中列印計數器狀態，請將 `stateRepresentation()` 函數新增到 `CounterTest`：

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

2. 現在執行 `modelCheckingTest()` 並檢查在修改計數器狀態的切換點處列印的 `Counter` 狀態（它們以 `STATE:` 開頭）：

    ```text
    = 無效執行結果 =
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

在壓力測試的情況下，Lincheck 會在情境的並行部分之前和之後，以及在結束時，列印狀態表示。

> * 取得這些範例的 [完整程式碼](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/CounterTest.kt)
> * 查看更多 [測試範例](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/lincheck_test/guide)
> {style="note"}

## 下一步

了解如何 [設定傳遞給操作的引數](operation-arguments.md) 以及何時可以使用它。