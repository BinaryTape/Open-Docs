[//]: # (title: データ構造の制約)

一部のデータ構造では、単一プロデューサー単一コンシューマーキューのように、一部の操作が並行して実行されないことが要求される場合があります。Lincheckはこのような制約を標準でサポートしており、制限に従って並行シナリオを生成します。

[JCToolsライブラリ](https://github.com/JCTools/JCTools)の[単一コンシューマーキュー](https://github.com/JCTools/JCTools/blob/66e6cbc9b88e1440a597c803b7df9bd1d60219f6/jctools-core/src/main/java/org/jctools/queues/atomic/MpscLinkedAtomicQueue.java)を考えてみましょう。その`poll()`、`peek()`、および`offer(x)`操作の正しさを検証するためのテストを書きましょう。

`build.gradle(.kts)`ファイルに、JCToolsの依存関係を追加します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // jctools依存関係
       testImplementation("org.jctools:jctools-core:%jctoolsVersion%")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // jctools依存関係
       testImplementation "org.jctools:jctools-core:%jctoolsVersion%"
   }
   ```
   </tab>
   </tabs>

単一コンシューマーの制限を満たすためには、すべての`poll()`および`peek()`の消費操作が単一スレッドから呼び出されることを保証します。そのためには、対応する`@Operation`アノテーションの`nonParallelGroup`パラメーターを、例えば`"consumers"`のような同じ値に設定します。

以下に結果のテストを示します。

```kotlin
import org.jctools.queues.atomic.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
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

以下に、このテストのために生成されたシナリオの例を示します。

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

注目すべきは、すべての消費操作である`poll()`および`peek()`の呼び出しが単一スレッドから実行されるため、「単一コンシューマー」の制限を満たしている点です。

> [完全なコードはこちら](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/MPSCQueueTest.kt)。
>
{style="note"}

## 次のステップ

モデル検査戦略を用いて[アルゴリズムの進行保証をチェックする方法](progress-guarantees.md)を学びましょう。