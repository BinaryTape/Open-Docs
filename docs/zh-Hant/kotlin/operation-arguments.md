[//]: # (title: 操作引數)

在本教學中，您將學習如何配置操作引數。

請考慮下方這個簡單的 `MultiMap` 實作。它基於 `ConcurrentHashMap`，內部儲存一個值列表：

```kotlin
import java.util.concurrent.*

class MultiMap<K, V> {
    private val map = ConcurrentHashMap<K, List<V>>()
   
    // 維護與指定鍵相關聯的值列表。
    fun add(key: K, value: V) {
        val list = map[key]
        if (list == null) {
            map[key] = listOf(value)
        } else {
            map[key] = list + value
        }
    }

    fun get(key: K): List<V> = map[key] ?: emptyList()
}
```

這個 `MultiMap` 實作是可線性化（linearizable）的嗎？如果不是，當存取一小部分鍵時，則更容易偵測到不正確的交錯（interleaving），從而增加了同時處理相同鍵的可能性。

為此，請為 `key: Int` 參數配置產生器：

1. 宣告 `@Param` 註解。
2. 指定整數產生器類別：`@Param(gen = IntGen::class)`。
   Lincheck 支援隨機參數產生器，適用於幾乎所有基本型別和字串，開箱即用。
3. 使用字串配置 `@Param(conf = "1:2")` 定義產生值的範圍。
4. 指定參數配置名稱（`@Param(name = "key")`），以便多個操作共用。

   下方是 `MultiMap` 的壓力測試，它為 `add(key, value)` 和 `get(key)` 操作產生 `[1..2]` 範圍內的鍵：
   
   ```kotlin
   import java.util.concurrent.*
   import org.jetbrains.lincheck.check
   import org.jetbrains.lincheck.datastructures.*
   import org.junit.*
   
   class MultiMap<K, V> {
       private val map = ConcurrentHashMap<K, List<V>>()
   
       // 維護與指定鍵相關聯的值列表。
       fun add(key: K, value: V) {
           val list = map[key]
           if (list == null) {
               map[key] = listOf(value)
           } else {
               map[key] = list + value
           }
       }

       fun get(key: K): List<V> = map[key] ?: emptyList()
   }
   
   @Param(name = "key", gen = IntGen::class, conf = "1:2")
   class MultiMapTest {
       private val map = MultiMap<Int, Int>()
   
       @Operation
       fun add(@Param(name = "key") key: Int, value: Int) = map.add(key, value)
   
       @Operation
       fun get(@Param(name = "key") key: Int) = map.get(key)
   
       @Test
       fun stressTest() = StressOptions().check(this::class)
   
       @Test
       fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
   }
   ```

5. 執行 `stressTest()` 並查看以下輸出：

   ```text
   = Invalid execution results =
   | ---------------------------------- |
   |    Thread 1     |     Thread 2     |
   | ---------------------------------- |
   | add(2, 0): void | add(2, -1): void |
   | ---------------------------------- |
   | get(2): [0]     |                  |
   | ---------------------------------- |
   ```
   
6. 最後，執行 `modelCheckingTest()`。它以以下輸出失敗：

   ```text
   = Invalid execution results =
   | ---------------------------------- |
   |    Thread 1     |     Thread 2     |
   | ---------------------------------- |
   | add(2, 0): void | add(2, -1): void |
   | ---------------------------------- |
   | get(2): [-1]    |                  |
   | ---------------------------------- |
   
   ---
   水平線 | ----- | 上方的所有操作都發生在線下方的操作之前
   ---

   以下交錯導致錯誤：
   | ---------------------------------------------------------------------- |
   |    Thread 1     |                       Thread 2                       |
   | ---------------------------------------------------------------------- |
   |                 | add(2, -1)                                           |
   |                 |   add(2,-1) at MultiMapTest.add(MultiMap.kt:31)      |
   |                 |     get(2): null at MultiMap.add(MultiMap.kt:15)     |
   |                 |     switch                                           |
   | add(2, 0): void |                                                      |
   |                 |     put(2,[-1]): [0] at MultiMap.add(MultiMap.kt:17) |
   |                 |   result: void                                       |
   | ---------------------------------------------------------------------- |
   ```

由於鍵的範圍很小，Lincheck 很快揭示了競爭條件：當兩個值被同一個鍵同時新增時，其中一個值可能會被覆蓋並丟失。

## 下一步

了解如何測試資料結構，這些資料結構對 [執行設定存取限制](constraints.md)，例如單生產者單消費者佇列。