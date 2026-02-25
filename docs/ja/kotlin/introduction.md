[//]: # (title: Lincheckで最初のテストを作成する)

このチュートリアルでは、最初のLincheckテストの作成方法、Lincheckフレームワークのセットアップ方法、および基本的なAPIの使用方法を説明します。
不正確な並行カウンタの実装を含む新しいIntelliJ IDEAプロジェクトを作成し、それに対するテストを記述して、その後にバグを見つけて分析します。

## プロジェクトの作成

既存のKotlinプロジェクトをIntelliJ IDEAで開くか、[新しく作成](https://kotlinlang.org/docs/jvm-get-started.html)してください。
プロジェクトを作成する際は、Gradleビルドシステムを使用してください。

## 必要な依存関係の追加

1. `build.gradle(.kts)` ファイルを開き、`mavenCentral()` がリポジトリリストに追加されていることを確認します。
2. Gradleの設定に以下の依存関係を追加します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheckの依存関係
       testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
       // この依存関係により、kotlin.testおよびJUnitを使用できます:
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
       // この依存関係により、kotlin.testおよびJUnitを使用できます:
       testImplementation "junit:junit:4.13"
   }
   ```
   </tab>
   </tabs>

## 並行カウンタの記述とテストの実行

1. `src/test/kotlin` ディレクトリに `BasicCounterTest.kt` ファイルを作成し、バグのある並行カウンタとそのLincheckテストを含む以下のコードを追加します。

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
       private val c = Counter() // 初期状態
   
       // Counterに対する操作
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test // JUnit
       fun stressTest() = StressOptions().check(this::class) // 魔法のボタン
   }
   ```

   このLincheckテストは自動的に以下を行います：
   * 指定された `inc()` および `get()` 操作を使用して、いくつかのランダムな並行シナリオを生成します。
   * 生成された各シナリオに対して、多数の呼び出しを実行します。
   * 各呼び出しの結果が正しいことを検証します。

2. 上記のテストを実行すると、次のエラーが表示されます：

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   ```

   ここでLincheckは、カウンタのアトミック性に違反する実行を検出しました。2つの並行するインクリメントが同じ結果 `1` で終了しています。これは、1つのインクリメントが失われたことを意味し、カウンタの動作が正しくないことを示しています。

## 無効な実行のトレース

Lincheckは、無効な実行結果を表示するだけでなく、エラーに至るインターリービング（実行順序）も提供できます。この機能は、限られた回数のコンテキストスイッチで多数の実行を検査する [モデル検査](testing-strategies.md#model-checking) テスト戦略で利用できます。

1. テスト戦略を切り替えるには、`options` の型を `StressOptions()` から `ModelCheckingOptions()` に変更します。更新された `BasicCounterTest` クラスは以下のようになります：

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

2. 再度テストを実行します。不正確な結果に至る実行トレースが得られます：

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

   トレースによると、以下のイベントが発生しています：

   * **T2**: 2番目のスレッドが `inc()` 操作を開始し、現在のカウンタ値を読み取り（`value.READ: 0`）、一時停止します。
   * **T1**: 1番目のスレッドが `inc()` を実行し、`1` を返して終了します。
   * **T2**: 2番目のスレッドが再開し、以前に取得したカウンタ値をインクリメントして、誤ってカウンタを `1` に更新します。

> [完全なコードを取得する](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/BasicCounterTest.kt)。
>
{style="note"}

## Java標準ライブラリのテスト

次に、Java標準ライブラリの `ConcurrentLinkedDeque` クラスのバグを見つけてみましょう。
以下のLincheckテストは、デックの先頭への要素の削除と追加の間の競合を検出します。

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

`modelCheckingTest()` を実行します。テストは失敗し、以下の出力が表示されます：

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

> [完全なコードを取得する](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedDequeTest.kt)。
>
{style="note"}

## 次のステップ

[テスト戦略を選択し、テスト実行を設定する](testing-strategies.md)に進みます。

## 関連項目

* [操作引数の生成方法](operation-arguments.md)
* [一般的なアルゴリズムの制約](constraints.md)
* [非ブロッキングの進行保証のチェック](progress-guarantees.md)
* [アルゴリズムの逐次仕様の定義](sequential-specification.md)