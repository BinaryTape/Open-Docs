[//]: # (title: 操作引数)

このチュートリアルでは、操作引数を設定する方法を学びます。

以下のシンプルな `MultiMap` 実装を考えてみましょう。これは `ConcurrentHashMap` に基づいており、内部的に値のリストを格納しています。

```kotlin
import java.util.concurrent.*

class MultiMap<K, V> {
    private val map = ConcurrentHashMap<K, List<V>>()
   
    // 指定されたキーに関連付けられた値のリストを管理します。
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

この `MultiMap` 実装は線形化可能 (linearizable) でしょうか？もしそうでない場合、少数のキー範囲にアクセスする際に正しくないインターリービングが検出されやすくなり、同じキーが同時に処理される可能性が高まります。

このため、`key: Int` パラメータのジェネレーターを設定します。

1.  `@Param` アノテーションを宣言します。
2.  整数ジェネレータークラスを指定します: `@Param(gen = IntGen::class)`。
    Lincheck は、ほとんどすべてのプリミティブ型と文字列に対して、すぐに利用可能なランダムなパラメータジェネレーターをサポートしています。
3.  文字列設定 `@Param(conf = "1:2")` を使用して生成される値の範囲を定義します。
4.  パラメータ設定名 (`@Param(name = "key")`) を指定し、複数の操作で共有します。

    以下は、`MultiMap` のストレステストで、`add(key, value)` および `get(key)` 操作のキーを `[1..2]` の範囲で生成します。

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
    
        // 指定されたキーに関連付けられた値のリストを管理します。
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

5.  `stressTest()` を実行すると、以下の出力が表示されます。

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

6.  最後に、`modelCheckingTest()` を実行します。以下の出力で失敗します。

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
    水平線 | ----- | より上のすべての操作は、線より下の操作の前に発生します。
    ---

    以下のインターリービングがエラーを引き起こします:
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

キーの範囲が狭いため、Lincheck はすぐに競合を明らかにします。同じキーに対して2つの値が同時に追加されると、どちらかの値が上書きされて失われる可能性があります。

## 次のステップ

シングルプロデューサー・シングルコンシューマーキュー (single-producer single-consumer queues) など、[実行に対するアクセス制約を設定するデータ構造](constraints.md)をテストする方法を学びましょう。