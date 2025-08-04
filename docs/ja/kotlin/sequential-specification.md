[//]: # (title: 逐次仕様)

アルゴリズムが正しい逐次的な動作を提供することを確実にするには、テスト対象のデータ構造を素直な逐次実装で記述することにより、その_逐次仕様_を定義できます。

> この機能により、2つの別々の逐次テストと並行テストの代わりに、単一のテストを作成することもできます。
>
{style="tip"}

アルゴリズムの検証のための逐次仕様を提供するには：

1.  すべてのテストメソッドの逐次バージョンを実装します。
2.  逐次実装を持つクラスを `sequentialSpecification()` オプションに渡します。

   ```kotlin
   StressOptions().sequentialSpecification(SequentialQueue::class)
   ```

たとえば、Java標準ライブラリの `j.u.c.ConcurrentLinkedQueue` の正しさをチェックするテストは次のとおりです。

```kotlin
import java.util.*
import java.util.concurrent.*
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class ConcurrentLinkedQueueTest {
    private val s = ConcurrentLinkedQueue<Int>()

    @Operation
    fun add(value: Int) = s.add(value)

    @Operation
    fun poll(): Int? = s.poll()
   
    @Test
    fun stressTest() = StressOptions()
        .sequentialSpecification(SequentialQueue::class.java)
        .check(this::class)
}

class SequentialQueue {
    private val s = LinkedList<Int>()

    fun add(x: Int) = s.add(x)
    fun poll(): Int? = s.poll()
}
```

> [例の完全なコード](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedQueueTest.kt)を取得します。
>
{style="note"}