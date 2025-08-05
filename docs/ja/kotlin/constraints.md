[//]: # (title: データ構造の制約)

一部のデータ構造では、単一プロデューサー・単一コンシューマーキューのように、一部の操作を並行して実行してはならない場合があります。Lincheckは、このような契約に対して組み込みのサポートを提供し、制約に従って並行シナリオを生成します。

[JCToolsライブラリ](https://github.com/JCTools/JCTools)の[単一コンシューマーキュー](https://github.com/JCTools/JCTools/blob/66e6cbc9b88e1440a597c803b7df9bd1d60219f6/jctools-core/src/main/java/org/jctools/queues/atomic/MpscLinkedAtomicQueue.java)について考えてみましょう。その`poll()`、`peek()`、および`offer(x)`操作の正確性を確認するためのテストを記述します。

`build.gradle(.kts)`ファイルに、JCToolsの依存関係を追加します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // jctools dependency
       testImplementation("org.jctools:jctools-core:%jctoolsVersion%")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // jctools dependency
       testImplementation "org.jctools:jctools-core:%jctoolsVersion%"
   }
   ```
   </tab>
   </tabs>

単一コンシューマーの制約を満たすには、すべての`poll()`および`peek()`消費操作が単一のスレッドから呼び出されるようにします。そのためには、対応する`@Operation`アノテーションの`nonParallelGroup`パラメーターを、例えば`"consumers"`のように同じ値に設定します。

以下が、そのテストです。

```kotlin
import org.jctools.queues.atomic.*
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class MPSCQueueTest {
    private val queue = MpscLinkedAtomicQueue<Int>()

    @Operation
    fun offer(x: Int) = queue.offer(x)

    @Operation(nonParallelGroup = "consumers") 
    fun poll(): Int? = queue.poll()

    @Operation(nonParallelGroup = "consumers")
    fun peek(): Int? = queue.peek()

    @Test
    fun stressTest() = StressOptions().check(this::class)

    @Test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

このテスト用に生成されたシナリオの例を以下に示します。

```text
= Iteration 15 / 100 =
| --------------------- |
| Thread 1  | Thread 2  |
| --------------------- |
| poll()    |           |
| poll()    |           |
| peek()    |           |
| peek()    |           |
| peek()    |           |
| --------------------- |
| offer(-1) | offer(0)  |
| offer(0)  | offer(-1) |
| peek()    | offer(-1) |
| offer(1)  | offer(1)  |
| peek()    | offer(1)  |
| --------------------- |
| peek()    |           |
| offer(-2) |           |
| offer(-2) |           |
| offer(2)  |           |
| offer(-2) |           |
| --------------------- |
```

すべての消費`poll()`および`peek()`呼び出しが単一スレッドから実行されているため、「単一コンシューマー」の制約を満たしていることに注意してください。

> [完全なコードを取得する](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/MPSCQueueTest.kt)。
>
{style="note"}

## 次のステップ

モデルチェック戦略を使用して、[アルゴリズムの進行保証をチェックする方法](progress-guarantees.md)を学習します。