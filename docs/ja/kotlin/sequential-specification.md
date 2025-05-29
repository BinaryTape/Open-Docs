[//]: # (title: シーケンシャル仕様)

アルゴリズムが正しいシーケンシャルな動作を提供することを確認するには、テスト対象のデータ構造の簡潔なシーケンシャルな実装を記述することで、その_シーケンシャル仕様_を定義できます。

> この機能により、別々のシーケンシャルテストと並行テストを2つ書く代わりに、1つのテストで済ませることができます。
>
{style="tip"}

検証のためにアルゴリズムのシーケンシャル仕様を提供するには：

1.  すべてのテストメソッドのシーケンシャルバージョンを実装します。
2.  シーケンシャル実装を持つクラスを`sequentialSpecification()`オプションに渡します。

   ```kotlin
   StressOptions().sequentialSpecification(SequentialQueue::class)
   ```

例えば、以下はJava標準ライブラリの`j.u.c.ConcurrentLinkedQueue`の正しさをチェックするテストです。

```kotlin
import org.jetbrains.kotlinx.lincheck.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*
import java.util.*
import java.util.concurrent.*

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

> [例の全コード](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ConcurrentLinkedQueueTest.kt)を入手する。
>
{style="note"}