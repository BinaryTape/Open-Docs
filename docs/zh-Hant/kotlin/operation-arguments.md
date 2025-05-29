[//]: # (title: 操作引數)

在本教學課程中，您將學習如何設定操作引數。

考量以下這個直觀的 `MultiMap` 實作。它基於 `ConcurrentHashMap`，內部儲存一個值列表：

```kotlin
import java.util.concurrent.*

class MultiMap<K, V> {
    private val map = ConcurrentHashMap<K, List<V>>()
   
    // Maintains a list of values 
    // associated with the specified key.
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

這個 `MultiMap` 實作是線性化的 (linearizable) 嗎？如果不是，當存取一小範圍的鍵時，更容易偵測到不正確的交錯 (interleaving)，從而增加同時處理相同鍵的可能性。

為此，請為 `key: Int` 參數設定產生器：

1. 宣告 `@Param` 註解。
2. 指定整數產生器類別：`@Param(gen = IntGen::class)`。
   Lincheck 開箱即用 (out of the box) 地支援幾乎所有原生型別 (primitives) 和字串的隨機參數產生器。
3. 使用字串配置 `@Param(conf = "1:2")` 定義值的產生範圍。
4. 指定參數配置名稱 (`@Param(name = "key")`)，以便在多個操作中共享它。

   以下是 `MultiMap` 的壓力測試 (stress test)，它為 `add(key, value)` 和 `get(key)` 操作產生範圍在 `[1..2]` 之間的鍵：
   
   ```kotlin
   import java.util.concurrent.*
   import org.jetbrains.kotlinx.lincheck.annotations.*
   import org.jetbrains.kotlinx.lincheck.check
   import org.jetbrains.kotlinx.lincheck.paramgen.*
   import org.jetbrains.kotlinx.lincheck.strategy.stress.*
   import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
   import org.junit.*
   
   class MultiMap<K, V> {
       private val map = ConcurrentHashMap<K, List<V>>()
   
       // Maintains a list of values 
       // associated with the specified key.
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
   
6. 最後，執行 `modelCheckingTest()`。它會失敗並顯示以下輸出：

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
   所有在水平線 | ----- | 之上的操作發生在線下方的操作之前
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

由於鍵的範圍很小，Lincheck 快速揭示了競爭 (race)：當兩個值被同一個鍵同時加入時，其中一個值可能會被覆寫並遺失。

## 下一步

學習如何測試對執行設定[存取限制](constraints.md)的資料結構，例如單一生產者單一消費者佇列 (single-producer single-consumer queues)。