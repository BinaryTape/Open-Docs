[//]: # (title: 壓力測試與模型檢查)

Lincheck 提供兩種測試策略：壓力測試和模型檢查。使用我們在 [上一步](introduction.md) 的 `BasicCounterTest.kt` 檔案中編寫的 `Counter`，了解這兩種方法在底層如何運作：

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

按照以下步驟為 `Counter` 建立一個並發壓力測試：

1.  建立 `CounterTest` 類別。
2.  在此類別中，新增 `Counter` 類型的欄位 `c`，並在建構函式中建立一個實例。
3.  列出計數器操作並使用 `@Operation` 註解標記它們，將其實作委派給 `c`。
4.  使用 `StressOptions()` 指定壓力測試策略。
5.  呼叫 `StressOptions.check()` 函式來執行測試。

結果程式碼將會像這樣：

```kotlin
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*

class CounterTest {
    private val c = Counter() // Initial state
    
    // Operations on the Counter
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // Run the test
    fun stressTest() = StressOptions().check(this::class)
}
```

### 壓力測試如何運作 {initial-collapse-state="collapsed" collapsible="true"}

首先，Lincheck 使用標記有 `@Operation` 的操作生成一系列並發情境。然後它啟動原生執行緒，並在開始時同步它們，以確保操作同時開始。最後，Lincheck 在這些原生執行緒上多次執行每個情境，期望找到一個會產生不正確結果的執行交錯。

下圖展示了 Lincheck 如何執行生成情境的高階示意圖：

![Stress execution of the Counter](counter-stress.png){width=700}

## 模型檢查

關於壓力測試的主要問題是，您可能需要花費數小時才能理解如何重現發現的錯誤。為了幫助您解決這個問題，Lincheck 支援有界模型檢查，它會自動提供一個用於重現錯誤的執行交錯。

模型檢查測試的建構方式與壓力測試相同。只需將指定測試策略的 `StressOptions()` 替換為 `ModelCheckingOptions()` 即可。

### 編寫模型檢查測試

要將壓力測試策略更改為模型檢查，請在您的測試中將 `StressOptions()` 替換為 `ModelCheckingOptions()`：

```kotlin
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*

class CounterTest {
    private val c = Counter() // Initial state

    // Operations on the Counter
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // Run the test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

### 模型檢查如何運作 {initial-collapse-state="collapsed" collapsible="true"}

複雜並發演算法中的大多數錯誤都可以透過經典的執行交錯來重現，即在一個執行緒和另一個執行緒之間切換執行。此外，針對弱記憶體模型（weak memory model）的模型檢查器非常複雜，因此 Lincheck 在 _順序一致性記憶體模型_ 下使用有界模型檢查。

簡而言之，Lincheck 分析所有執行交錯，從一個上下文切換開始，然後是兩個，依此類推，直到檢查了指定數量的執行交錯。這種策略允許找到具有最少上下文切換次數的不正確排程（schedule），從而使後續的錯誤調查更容易。

為了控制執行，Lincheck 將特殊的切換點插入到測試程式碼中。這些點識別了可以執行上下文切換的位置。本質上，這些是共享記憶體存取，例如 JVM 中的欄位和陣列元素讀取或更新，以及 `wait/notify` 和 `park/unpark` 呼叫。為了插入切換點，Lincheck 使用 ASM 框架即時（on the fly）轉換測試程式碼，將內部函式呼叫添加到現有程式碼中。

由於模型檢查策略控制著執行，Lincheck 可以提供導致無效執行交錯的追蹤，這在實踐中非常有幫助。您可以在 [使用 Lincheck 編寫您的第一個測試](introduction.md#trace-the-invalid-execution) 教學中查看 `Counter` 不正確執行的追蹤範例。

## 哪種測試策略更好？

_模型檢查策略_ 更適合在順序一致性記憶體模型下查找錯誤，因為它能確保更好的覆蓋率，並在發現錯誤時提供失敗的執行追蹤。

儘管 _壓力測試_ 不保證任何覆蓋率，但對於檢查由低階效應（例如遺漏 `volatile` 修飾符）引起的演算法錯誤仍然很有幫助。壓力測試對於發現需要大量上下文切換才能重現的罕見錯誤也大有幫助，而且由於模型檢查策略的當前限制，不可能分析所有這些錯誤。

## 設定測試策略

要設定測試策略，請在 `<TestingMode>Options` 類別中設定選項。

1.  為 `CounterTest` 設定情境生成和執行的選項：

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.stress.*
    import org.junit.*
    
    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
    
        @Test
        fun stressTest() = StressOptions() // Stress testing options:
            .actorsBefore(2) // Number of operations before the parallel part
            .threads(2) // Number of threads in the parallel part
            .actorsPerThread(2) // Number of operations in each thread of the parallel part
            .actorsAfter(1) // Number of operations after the parallel part
            .iterations(100) // Generate 100 random concurrent scenarios
            .invocationsPerIteration(1000) // Run each generated scenario 1000 times
            .check(this::class) // Run the test
    }
    ```

2.  再次執行 `stressTest()`，Lincheck 將生成類似於以下的情境：

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

    在此，平行部分之前有兩個操作，兩個執行緒各執行兩個操作，之後再跟隨一個單一操作。

您可以以相同的方式設定您的模型檢查測試。

## 情境最小化

您可能已經注意到，檢測到的錯誤通常以比測試設定中指定的情境更小的形式呈現。Lincheck 嘗試最小化錯誤，在不影響測試失敗的情況下，積極移除操作。

以下是上述計數器測試的最小化情境：

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

由於較小的情境更容易分析，因此情境最小化功能預設為啟用。若要禁用此功能，請將 `minimizeFailedScenario(false)` 添加到 `[Stress, ModelChecking]Options` 設定中。

## 日誌記錄資料結構狀態

另一個有用的除錯功能是 _狀態日誌記錄_。當分析導致錯誤的執行交錯時，您通常會在紙上繪製資料結構的變化，在每個事件之後改變狀態。為了自動化此過程，您可以提供一個特殊方法，該方法返回資料結構的 `String` 表示，這樣 Lincheck 就會在修改資料結構的執行交錯中的每個事件之後列印狀態表示。

為此，請定義一個不帶參數且標記有 `@StateRepresentation` 註解的方法。該方法應是執行緒安全的、非阻塞的，並且絕不修改資料結構。

1.  在 `Counter` 範例中，`String` 表示就是計數器的值。因此，若要在追蹤中列印計數器狀態，請將 `stateRepresentation()` 函式添加到 `CounterTest`：

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
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

2.  現在執行 `modelCheckingTest()` 並檢查在修改計數器狀態的切換點列印的 `Counter` 狀態（它們以 `STATE:` 開頭）：

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

在壓力測試的情況下，Lincheck 會在情境的平行部分之前和之後，以及在結束時列印狀態表示。

> * 取得這些範例的 [完整程式碼](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/CounterTest.kt)
> * 查看更多 [測試範例](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide)
>
{style="note"}

## 下一步

了解如何 [設定傳遞給操作的引數](operation-arguments.md) 以及何時會很有用。