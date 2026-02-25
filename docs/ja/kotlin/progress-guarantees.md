[//]: # (title: 進捗保証)

多くの並行アルゴリズムは、ロックフリー（lock-freedom）やウェイトフリー（wait-freedom）などの、ノンブロッキングな進捗保証（progress guarantees）を提供しています。これらは通常複雑であるため、アルゴリズムをブロックしてしまうバグを混入させてしまうことが容易に起こり得ます。Lincheckは、モデル検査（model checking）戦略を使用して、ライブネス（liveness）バグを見つけるのに役立ちます。

アルゴリズムの進捗保証をチェックするには、`ModelCheckingOptions()` で `checkObstructionFreedom` オプションを有効にします。

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

`ConcurrentMapTest.kt` ファイルを作成します。
次に、以下のテストを追加して、Java標準ライブラリの `ConcurrentHashMap::put(key: K, value: V)` がブロッキング操作であることを検出します。

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
        .actorsBefore(1) // HashMapを初期化するため
        .actorsPerThread(1)
        .actorsAfter(0)
        .minimizeFailedScenario(false)
        .checkObstructionFreedom()
        .check(this::class)
}
```

`modelCheckingTest()` を実行します。次のような結果が得られるはずです。

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

次に、ノンブロッキングな `ConcurrentSkipListMap<K, V>` のテストを追加しましょう。このテストは正常にパスすることが期待されます。

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

> 一般的なノンブロッキングの進捗保証は以下の通りです（強い順）。
> 
> * **ウェイトフリー（wait-freedom）**: 他のスレッドが何をしていようと、各操作が有限のステップ数で完了する場合。
> * **ロックフリー（lock-freedom）**: 特定の操作が停滞する可能性はあるものの、少なくとも1つの操作が有限のステップ数で完了することを保証し、システム全体の進捗を維持する場合。
> * **オブストラクションフリー（obstruction-freedom）**: 他のすべてのスレッドが一時停止している場合に、任意の操作が有限のステップ数で完了する場合。
>
{style="tip"}

現時点では、Lincheckはオブストラクションフリーの進捗保証のみをサポートしています。しかし、現実のライブネスバグのほとんどは予期しないブロッキングコードの追加によるものであるため、オブストラクションフリーのチェックは、ロックフリーやウェイトフリーのアルゴリズムにも役立ちます。

> * [サンプルの完全なコード](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentMapTest.kt)を入手してください。
> * Michael-Scott キューの実装で進捗保証をテストしている[別の例](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ObstructionFreedomViolationTest.kt)も参照してください。
>
{style="note"}

## 次のステップ

テスト対象アルゴリズムの[逐次仕様（sequential specification）を明示的に指定](sequential-specification.md)する方法を学び、Lincheckテストの堅牢性を向上させます。