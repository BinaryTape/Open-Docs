[//]: # (title: 逐次仕様)

アルゴリズムが正しい逐次的な動作を提供していることを確実にするために、テスト対象のデータ構造をシンプルに逐次実装したものを記述することで、その _逐次仕様_ (sequential specification) を定義できます。

> この機能により、逐次テストと並行テストの2つを個別に作成する代わりに、単一のテストを作成することも可能になります。
>
{style="tip"}

検証のためにアルゴリズムの逐次仕様を提供するには：

1. すべてのテスト対象メソッドの逐次バージョンを実装します。
2. 逐次実装を含むクラスを `sequentialSpecification()` オプションに渡します。

   ```kotlin
   StressOptions().sequentialSpecification(SequentialQueue::class)
   ```

例えば、Java標準ライブラリの `j.u.c.ConcurrentLinkedQueue` の正確性をチェックするためのテストは以下のようになります。

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

> [サンプルの完全なコード](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedQueueTest.kt)を確認してください。
>
{style="note"}