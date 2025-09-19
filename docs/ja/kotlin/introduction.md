[//]: # (title: Lincheckで初めてのテストを作成する)

このチュートリアルでは、初めてのLincheckテストを作成する方法、Lincheckフレームワークをセットアップする方法、およびその基本的なAPIを使用する方法について説明します。誤った並行カウンタの実装を含む新しいIntelliJ IDEAプロジェクトを作成し、それに対するテストを記述し、その後バグを見つけて分析します。

## プロジェクトを作成する

IntelliJ IDEAで既存のKotlinプロジェクトを開くか、[新しいプロジェクトを作成](https://kotlinlang.org/docs/jvm-get-started.html)します。
プロジェクトを作成する際は、Gradleビルドシステムを使用してください。

## 必要な依存関係を追加する

1. `build.gradle(.kts)`ファイルを開き、`mavenCentral()`がリポジトリリストに追加されていることを確認します。
2. 次の依存関係をGradle設定に追加します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheckの依存関係
       testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
       // この依存関係により、kotlin.testおよびJUnitを操作できます。
       testImplementation("junit:junit:4.13")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheckの依存関係
       testImplementation "org.jetbrains.lincheck:lincheck:%lincheckVersion%"
       // この依存関係により、kotlin.testおよびJUnitを操作できます。
       testImplementation "junit:junit:4.13"
   }
   ```
   </tab>
   </tabs>

## 並行カウンタを記述してテストを実行する

1. `src/test/kotlin`ディレクトリに`BasicCounterTest.kt`ファイルを作成し、バグのある並行カウンタとそのLincheckテストを含む以下のコードを追加します。

   ```kotlin
   import org.jetbrains.lincheck.*
   import org.jetbrains.lincheck.datastructures.*
   import org.junit.*

   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter() // Initial state
   
       // Operations on the Counter
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test // JUnit
       fun stressTest() = StressOptions().check(this::class) // The magic button
   }
   ```

   このLincheckテストは自動的に以下を実行します。
   * 指定された`inc()`および`get()`操作を使用して、複数のランダムな並行シナリオを生成します。
   * 生成された各シナリオに対して、多数の呼び出しを実行します。
   * 各呼び出し結果が正しいことを検証します。

2. 上記のテストを実行すると、次のエラーが表示されます。

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   ```

   ここでLincheckは、カウンタの原子性（atomicity）に違反する実行を見つけました。2つの並行インクリメントが同じ結果 `1` で終了しています。これは、1つのインクリメントが失われ、カウンタの動作が不正であることを意味します。

## 不正な実行をトレースする

Lincheckは、不正な実行結果を表示するだけでなく、エラーにつながるインターリービングも提供できます。この機能は、[モデル検査（model checking）](testing-strategies.md#model-checking)テスト戦略で利用できます。この戦略では、制限された数のコンテキストスイッチで多数の実行を検査します。

1. テスト戦略を切り替えるには、`options`の型を`StressOptions()`から`ModelCheckingOptions()`に置き換えます。更新された`BasicCounterTest`クラスは次のようになります。

   ```kotlin
   import org.jetbrains.lincheck.*
   import org.jetbrains.lincheck.datastructures.*
   import org.junit.*
   
   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter()
   
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test
       fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
   }
   ```

2. テストを再度実行します。不正な結果につながる実行トレースが表示されます。

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   
   The following interleaving leads to the error:
   | --------------------------------------------------------------------- |
   | Thread 1 |                          Thread  2                         |
   | --------------------------------------------------------------------- |
   |          | inc()                                                      |
   |          |   inc(): 1 at BasicCounterTest.inc(BasicCounterTest.kt:18) |
   |          |     value.READ: 0 at Counter.inc(BasicCounterTest.kt:10)   |
   |          |     switch                                                 |
   | inc(): 1 |                                                            |
   |          |     value.WRITE(1) at Counter.inc(BasicCounterTest.kt:10)  |
   |          |     value.READ: 1 at Counter.inc(BasicCounterTest.kt:10)   |
   |          |   result: 1                                                |
   | --------------------------------------------------------------------- |
   ```

   トレースによると、以下のイベントが発生しています。

   * **T2**: 2番目のスレッドが`inc()`操作を開始し、現在のカウンタ値（`value.READ: 0`）を読み取り、一時停止します。
   * **T1**: 1番目のスレッドが`inc()`を実行し、`1`を返し、終了します。
   * **T2**: 2番目のスレッドが再開し、以前に取得したカウンタ値をインクリメントし、カウンタを不正に`1`に更新します。

> [完全なコードを入手する](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/BasicCounterTest.kt)。
>
{style="note"}

## Java標準ライブラリをテストする

次に、Java標準の`ConcurrentLinkedDeque`クラスのバグを見つけてみましょう。
以下のLincheckテストは、デキューの先頭に要素を削除および追加する際の競合状態を見つけます。

```kotlin
import java.util.concurrent.*
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class ConcurrentDequeTest {
    private val deque = ConcurrentLinkedDeque<Int>()

    @Operation
    fun addFirst(e: Int) = deque.addFirst(e)

    @Operation
    fun addLast(e: Int) = deque.addLast(e)

    @Operation
    fun pollFirst() = deque.pollFirst()

    @Operation
    fun pollLast() = deque.pollLast()

    @Operation
    fun peekFirst() = deque.peekFirst()

    @Operation
    fun peekLast() = deque.peekLast()

    @Test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

`modelCheckingTest()`を実行します。テストは次の出力で失敗します。

```text
= Invalid execution results =
| ---------------------------------------- |
|      Thread 1     |       Thread 2       |
| ---------------------------------------- |
| addLast(22): void |                      |
| ---------------------------------------- |
| pollFirst(): 22   | addFirst(8): void    |
|                   | peekLast(): 22 [-,1] |
| ---------------------------------------- |

---
水平線 | ----- | の上のすべての操作は、線の下の操作より前に発生します
---
"[..]"括弧内の値は、現在の操作の開始時に各並列スレッドで確認された完了済み操作の数を示します
---

次のインターリービングがエラーにつながります。
| --------------------------------------------------------------------------------------------------------------------------------- |
|                                                Thread 1                                                    |       Thread 2       |
| --------------------------------------------------------------------------------------------------------------------------------- |
| pollFirst()                                                                                                |                      |
|   pollFirst(): 22 at ConcurrentDequeTest.pollFirst(ConcurrentDequeTest.kt:17)                              |                      |
|     first(): Node@1 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:915)                     |                      |
|     item.READ: null at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:917)                     |                      |
|     next.READ: Node@2 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:925)                   |                      |
|     item.READ: 22 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:917)                       |                      |
|     prev.READ: null at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:919)                     |                      |
|     switch                                                                                                 |                      |
|                                                                                                            | addFirst(8): void    |
|                                                                                                            | peekLast(): 22       |
|     compareAndSet(Node@2,22,null): true at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:920) |                      |
|     unlink(Node@2) at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:921)                      |                      |
|   result: 22                                                                                               |                      |
| --------------------------------------------------------------------------------------------------------------------------------- |
```

> [完全なコードを入手する](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedDequeTest.kt)。
>
{style="note"}

## 次のステップ

[テスト戦略を選択し、テスト実行を構成する](testing-strategies.md)。

## 関連項目

* [操作引数を生成する方法](operation-arguments.md)
* [一般的なアルゴリズム制約](constraints.md)
* [非ブロック進行保証の確認](progress-guarantees.md)
* [アルゴリズムの逐次仕様を定義する](sequential-specification.md)