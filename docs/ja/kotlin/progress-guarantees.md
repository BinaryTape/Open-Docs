[//]: # (title: 進行保証)

多くの並行アルゴリズムは、ロックフリーや待機フリーなどの非ブロッキングな進行保証を提供します。これらは通常、自明ではないため、アルゴリズムをブロックするバグを混入させやすいです。Lincheckは、モデル検査戦略を使用して活性バグを見つけるのに役立ちます。

アルゴリズムの進行保証をチェックするには、`ModelCheckingOptions()` で `checkObstructionFreedom` オプションを有効にします。

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

`ConcurrentMapTest.kt` ファイルを作成します。
次に、Java標準ライブラリの `ConcurrentHashMap::put(key: K, value: V)` がブロッキング操作であることを検出するために、以下のテストを追加します。

```kotlin
import org.jetbrains.kotlinx.lincheck.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*
import java.util.concurrent.*

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

`modelCheckingTest()` を実行します。以下の結果が得られます。

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
|   put(2,-2) at ConcurrentHashMapTest.put(ConcurrentMap.kt:11)                        |                                                                                          |
|     putVal(2,-2,false) at ConcurrentHashMap.put(ConcurrentHashMap.java:1006)             |                                                                                          |
|       table.READ: Node[]@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1014)      |                                                                                          |
|       tabAt(Node[]@1,0): Node@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1018) |                                                                                          |
|       MONITORENTER at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1031)              |                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
```

次に、非ブロッキングな `ConcurrentSkipListMap<K, V>` のテストを追加しましょう。このテストは正常にパスすることを期待します。

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

> 一般的な非ブロッキング進行保証は（強いものから弱いものへ）以下の通りです。
>
> *   **待機フリー (wait-freedom)**: 他のスレッドが何をしていても、各操作が限られたステップ数で完了します。
> *   **ロックフリー (lock-freedom)**: システム全体での進行を保証し、特定の操作が停止している可能性がある場合でも、少なくとも1つの操作が限られたステップ数で完了します。
> *   **障害フリー (obstruction-freedom)**: 他のすべてのスレッドが一時停止した場合に、任意の操作が限られたステップ数で完了します。
>
{style="tip"}

現時点では、Lincheckは障害フリーの進行保証のみをサポートしています。しかし、ほとんどの実際の活性バグは予期せぬブロッキングコードを混入させるため、障害フリーチェックはロックフリーおよび待機フリーのアルゴリズムにも役立ちます。

> *   [例の完全なコード](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ConcurrentMapTest.kt)を取得する。
> *   Michael-Scottキューの実装が進行保証のためにテストされている[別の例](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ObstructionFreedomViolationTest.kt)を見る。
>
{style="note"}

## 次のステップ

Lincheckテストの堅牢性を向上させるために、テスト対象アルゴリズムの[順次仕様](sequential-specification.md)を明示的に指定する方法を学びましょう。