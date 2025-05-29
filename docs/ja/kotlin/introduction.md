[//]: # (title: Lincheck を使用した最初のテストの作成)

このチュートリアルでは、最初の Lincheck テストを作成し、Lincheck フレームワークをセットアップし、その基本的な API を使用する方法について説明します。
誤った並行カウンタの実装を持つ新しい IntelliJ IDEA プロジェクトを作成し、それに対するテストを記述し、
その後にバグを見つけて分析します。

## プロジェクトを作成する

既存の Kotlin プロジェクトを IntelliJ IDEA で開くか、[新しいプロジェクトを作成します](https://kotlinlang.org/docs/jvm-get-started.html)。
プロジェクトを作成する際は、Gradle ビルドシステムを使用してください。

## 必要な依存関係を追加する

1.  `build.gradle(.kts)` ファイルを開き、`mavenCentral()` がリポジトリリストに追加されていることを確認します。
2.  以下の依存関係を Gradle 設定に追加します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    repositories {
        mavenCentral()
    }

    dependencies {
        // Lincheck の依存関係
        testImplementation("org.jetbrains.kotlinx:lincheck:%lincheckVersion%")
        // この依存関係により、kotlin.test と JUnit を使用できます。
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
        // Lincheck の依存関係
        testImplementation "org.jetbrains.kotlinx:lincheck:%lincheckVersion%"
        // この依存関係により、kotlin.test と JUnit を使用できます。
        testImplementation "junit:junit:4.13"
    }
    ```
    </tab>
    </tabs>

## 並行カウンタを記述し、テストを実行する

1.  `src/test/kotlin` ディレクトリに `BasicCounterTest.kt` ファイルを作成し、
    バグのある並行カウンタとそれに対する Lincheck テストを含む以下のコードを追加します。

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.*
    import org.jetbrains.kotlinx.lincheck.strategy.stress.*
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

    この Lincheck テストは自動的に以下の処理を行います。
    *   指定された `inc()` および `get()` 操作で、いくつかのランダムな並行シナリオを生成します。
    *   生成された各シナリオに対して、多数の呼び出しを実行します。
    *   各呼び出し結果が正しいことを検証します。

2.  上記のテストを実行すると、以下のエラーが表示されます。

    ```text
    = Invalid execution results =
    | ------------------- |
    | Thread 1 | Thread 2 |
    | ------------------- |
    | inc(): 1 | inc(): 1 |
    | ------------------- |
    ```

    ここで Lincheck は、カウンタのアトミック性に違反する実行を発見しました。2つの並行インクリメントが
    同じ結果 `1` で終了しています。これは、1つのインクリメントが失われたことを意味し、カウンタの動作が正しくありません。

## 不正な実行をトレースする

不正な実行結果を表示するだけでなく、Lincheck はエラーにつながるインターリービングも提供できます。この機能は、
[モデル検査](testing-strategies.md#model-checking) テスト戦略で利用でき、
限られた数のコンテキストスイッチで多数の実行を検査します。

1.  テスト戦略を切り替えるには、`options` のタイプを `StressOptions()` から `ModelCheckingOptions()` に置き換えます。
    更新された `BasicCounterTest` クラスは次のようになります。

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
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

2.  テストを再度実行します。不正な結果につながる実行トレースが表示されます。

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

    *   **T2**: 2番目のスレッドが `inc()` 操作を開始し、現在のカウンタ値 (`value.READ: 0`) を読み取って一時停止します。
    *   **T1**: 1番目のスレッドが `inc()` を実行し、`1` を返し、終了します。
    *   **T2**: 2番目のスレッドが再開し、以前に取得したカウンタ値をインクリメントし、カウンタを誤って `1` に更新します。

> [完全なコードを見る](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/BasicCounterTest.kt)。
>
{style="note"}

## Java 標準ライブラリをテストする

それでは、Java の標準ライブラリ `ConcurrentLinkedDeque` クラスのバグを見つけてみましょう。
以下の Lincheck テストは、デックの先頭要素の削除と追加の間の競合を見つけます。

```kotlin
import org.jetbrains.kotlinx.lincheck.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*
import java.util.concurrent.*

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

`modelCheckingTest()` を実行します。テストは以下の出力で失敗します。

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
All operations above the horizontal line | ----- | happen before those below the line
---
Values in "[..]" brackets indicate the number of completed operations
in each of the parallel threads seen at the beginning of the current operation
---

The following interleaving leads to the error:
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

> [完全なコードを見る](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ConcurrentLinkedDequeTest.kt)。
>
{style="note"}

## 次のステップ

[テスト戦略を選択し、テスト実行を設定します](testing-strategies.md)。

## 関連項目

*   [操作引数の生成方法](operation-arguments.md)
*   [よくあるアルゴリズムの制約](constraints.md)
*   [ノンブロッキングな進行保証のチェック](progress-guarantees.md)
*   [アルゴリズムの逐次仕様を定義する](sequential-specification.md)