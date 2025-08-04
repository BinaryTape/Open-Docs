[//]: # (title: 進行保証)

多くの並行アルゴリズムは、ロックフリーや待機フリーといったノンブロッキングな進行保証を提供します。これらのアルゴリズムは通常自明ではないため、アルゴリズムをブロックするバグを簡単に組み込んでしまう可能性があります。Lincheckは、モデル検査戦略を用いて活性バグを見つけるのに役立ちます。

アルゴリズムの進行保証を確認するには、`ModelCheckingOptions()` で `checkObstructionFreedom` オプションを有効にします。

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

`ConcurrentMapTest.kt` ファイルを作成します。
次に、Java標準ライブラリの `ConcurrentHashMap::put(key: K, value: V)` がブロッキング操作であることを検出するために、以下のテストを追加します。

```kotlin
import java.util.concurrent.*
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class ConcurrentHashMapTest {
    private val map = ConcurrentHashMap<Int, Int>()

    @Operation
    fun put(key: Int, value: Int) = map.put(key, value)

    @Test
    fun modelCheckingTest() = ModelCheckingOptions()
        .actorsBefore(1) // To init the HashMap
        .actorsPerThread(1)
        .actorsAfter(0)
        .minimizeFailedScenario(false)
        .checkObstructionFreedom()
        .check(this::class)
}
```

`modelCheckingTest()` を実行します。以下の結果が得られるはずです。

```text
= Obstruction-freedom is required but a lock has been found =
| ---------------------- |
|  Thread 1  | Thread 2  |
| ---------------------- |
| put(1, -1) |           |
| ---------------------- |
| put(2, -2) | put(3, 2) |
| ---------------------- |

---
All operations above the horizontal line | ----- | happen before those below the line
---

The following interleaving leads to the error:
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                         Thread 1                                         |                                         Thread 2                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                                          | put(3, 2)                                                                                |
|                                                                                          |   put(3,2) at ConcurrentHashMapTest.put(ConcurrentMapTest.kt:11)                         |
|                                                                                          |     putVal(3,2,false) at ConcurrentHashMap.put(ConcurrentHashMap.java:1006)              |
|                                                                                          |       table.READ: Node[]@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1014)      |
|                                                                                          |       tabAt(Node[]@1,0): Node@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1018) |
|                                                                                          |       MONITORENTER at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1031)              |
|                                                                                          |       tabAt(Node[]@1,0): Node@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1032) |
|                                                                                          |       next.READ: null at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1046)           |
|                                                                                          |       switch                                                                             |
| put(2, -2)                                                                               |                                                                                          |
|   put(2,-2) at ConcurrentHashMapTest.put(ConcurrentMapTest.kt:11)                        |                                                                                          |
|     putVal(2,-2,false) at ConcurrentHashMap.put(ConcurrentHashMap.java:1006)             |                                                                                          |
|       table.READ: Node[]@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1014)      |                                                                                          |
|       tabAt(Node[]@1,0): Node@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1018) |                                                                                          |
|       MONITORENTER at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1031)              |                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
```

さて、ノンブロッキングな `ConcurrentSkipListMap<K, V>` のテストを追加し、テストが正常にパスすることを期待しましょう。

```kotlin
class ConcurrentSkipListMapTest {
    private val map = ConcurrentSkipListMap<Int, Int>()

    @Operation
    fun put(key: Int, value: Int) = map.put(key, value)

    @Test
    fun modelCheckingTest() = ModelCheckingOptions()
        .checkObstructionFreedom()
        .check(this::class)
}
```

> 一般的なノンブロッキング進行保証は（強い順から弱い順に）次のとおりです。
>
> *   **待機フリー**：他のスレッドが何をしていても、各操作が有限のステップ数で完了します。
> *   **ロックフリー**：システム全体の進行を保証し、特定の操作が停止している可能性がある間でも、少なくとも1つの操作が有限のステップ数で完了します。
> *   **閉塞フリー**：他のすべてのスレッドが一時停止した場合、任意の操作が有限のステップ数で完了します。
>
{style="tip"}

現時点では、Lincheckは閉塞フリーの進行保証のみをサポートしています。しかし、ほとんどの実際の活性バグは予期せぬブロッキングコードを追加するため、閉塞フリーのチェックはロックフリーおよび待機フリーのアルゴリズムにも役立ちます。

> *   [サンプルの完全なコード](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentMapTest.kt)を入手してください。
> *   Michael-Scottキューの実装が進行保証のためにテストされている[別の例](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ObstructionFreedomViolationTest.kt)を参照してください。
>
{style="note"}

## 次のステップ

テストアルゴリズムの[シーケンシャル仕様](sequential-specification.md)を明示的に指定してLincheckテストの堅牢性を向上させる方法を学びましょう。