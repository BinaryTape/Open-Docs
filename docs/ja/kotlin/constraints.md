[//]: # (title: データ構造の制約)

データ構造の中には、単一プロデューサー・単一コンシューマー（single-producer single-consumer）キューのように、操作の一部が並行して実行されないことを要求するものがあります。Lincheckはこのようなコントラクトを標準でサポートしており、制約に従って並行シナリオを生成します。

[JCToolsライブラリ](https://github.com/JCTools/JCTools)の[single-consumer queue](https://github.com/JCTools/JCTools/blob/66e6cbc9b88e1440a597c803b7df9bd1d60219f6/jctools-core/src/main/java/org/jctools/queues/atomic/MpscLinkedAtomicQueue.java)を例に考えてみましょう。このキューの `poll()`、`peek()`、および `offer(x)` 操作の正確性を検証するテストを作成します。

`build.gradle(.kts)` ファイルに、JCToolsの依存関係を追加します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // jctoolsの依存関係
       testImplementation("org.jctools:jctools-core:%jctoolsVersion%")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // jctoolsの依存関係
       testImplementation "org.jctools:jctools-core:%jctoolsVersion%"
   }
   ```
   </tab>
   </tabs>

単一コンシューマーの制約を満たすには、すべての `poll()` と `peek()` というコンシューマー操作が単一のスレッドから呼び出されるようにする必要があります。そのために、対応する `@Operation` アノテーションの `nonParallelGroup` パラメータを同じ値（例：`"consumers"`）に設定します。

作成されたテストは以下の通りです：

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

このテストに対して生成されるシナリオの例を以下に示します：

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

すべてのコンシューマー操作である `poll()` と `peek()` の呼び出しが単一のスレッドから実行されており、「単一コンシューマー」制約が満たされていることに注目してください。

> [完全なコードを入手する](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/MPSCQueueTest.kt)。
>
{style="note"}

## 次のステップ

モデル検査戦略を使用して、[アルゴリズムの進行保証（progress guarantees）を確認する方法](progress-guarantees.md)を学びましょう。