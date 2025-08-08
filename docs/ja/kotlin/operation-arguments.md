[//]: # (title: オペレーション引数)

このチュートリアルでは、オペレーション引数を構成する方法を学びます。

以下に示すシンプルな`MultiMap`の実装を考えてみましょう。これは`ConcurrentHashMap`をベースにしており、内部的に値のリストを格納します。

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

この`MultiMap`の実装は線形化可能 (linearizable) でしょうか？そうでない場合、キーの狭い範囲にアクセスしたときに、不正なインターリービングが検出される可能性が高くなり、同じキーを並行して処理する可能性が増大します。

このため、`key: Int`パラメータのジェネレーターを次のように構成します。

1.  `@Param`アノテーションを宣言します。
2.  整数ジェネレータークラスを指定します: `@Param(gen = IntGen::class)`。
    Lincheckは、ほぼすべてのプリミティブ型と文字列に対応したランダムなパラメータジェネレーターを標準でサポートしています。
3.  文字列設定`@Param(conf = "1:2")`で、生成される値の範囲を定義します。
4.  パラメータ構成名 (`@Param(name = "key")`) を指定して、複数のオペレーションで共有します。

    以下は、`[1..2]`の範囲で`add(key, value)`および`get(key)`オペレーションのキーを生成する`MultiMap`のストレス テストです。

    ```kotlin
    import java.util.concurrent.*
    import org.jetbrains.lincheck.check
    import org.jetbrains.lincheck.datastructures.*
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

5.  `stressTest()`を実行すると、次の出力が表示されます。

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

6.  最後に、`modelCheckingTest()`を実行します。以下の出力で失敗します。

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
    水平線 | ----- | より上のすべての操作は、線の下の操作より前に発生します
    ---

    次のインターリービングがエラーにつながります:
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

キーの範囲が狭いため、Lincheckはすぐに競合状態を明らかにします。同じキーによって2つの値が並行して追加されると、いずれかの値が上書きされて失われる可能性があります。

## 次のステップ

単一プロデューサー単一コンシューマーキュー (single-producer single-consumer queues) のように、[実行に対するアクセス制約](constraints.md)を設定するデータ構造をテストする方法を学びます。