[//]: # (title: ストレス テストとモデル検査)

Lincheckは、ストレス テストとモデル検査という2つのテスト戦略を提供します。これら両方のアプローチの内部で何が起こるかについて、[前のステップ](introduction.md)の`BasicCounterTest.kt`ファイルでコーディングした`Counter`を使って学びましょう。

```kotlin
class Counter {
    @Volatile
    private var value = 0

    fun inc(): Int = ++value
    fun get() = value
}
```

## ストレス テスト

### ストレス テストを作成する

`Counter`の並行ストレス テストを、以下の手順で作成します。

1.  `CounterTest`クラスを作成します。
2.  このクラスに、`Counter`型のフィールド`c`を追加し、コンストラクタでインスタンスを生成します。
3.  カウンタの操作をリストアップし、`@Operation`アノテーションでマークし、その実装を`c`に委譲します。
4.  `StressOptions()`を使用してストレス テスト戦略を指定します。
5.  `StressOptions.check()`関数を呼び出してテストを実行します。

結果のコードは次のようになります。

```kotlin
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*

class CounterTest {
    private val c = Counter() // Initial state
    
    // Operations on the Counter
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // Run the test
    fun stressTest() = StressOptions().check(this::class)
}
```

### ストレス テストの仕組み {initial-collapse-state="collapsed" collapsible="true"}

まず、Lincheckは`@Operation`でマークされた操作を使用して、一連の並行シナリオを生成します。次に、ネイティブ スレッドを起動し、操作が同時に開始されることを保証するために、開始時にそれらを同期させます。最後に、Lincheckはこれらのネイティブ スレッド上で各シナリオを複数回実行し、誤った結果を生成するインターリービングに遭遇することを期待します。

以下の図は、Lincheckが生成されたシナリオをどのように実行するかを示す高レベルの概略図です。

![Counterのストレス実行](counter-stress.png){width=700}

## モデル検査

ストレス テストに関する主な懸念は、見つかったバグをどのように再現するかを理解するのに何時間も費やす可能性があることです。
これを助けるために、Lincheckはバグを再現するためのインターリービングを自動的に提供する、有界モデル検査をサポートしています。

モデル検査テストは、ストレス テストと同じ方法で構築されます。テスト戦略を指定する`StressOptions()`を`ModelCheckingOptions()`に置き換えるだけです。

### モデル検査テストを作成する

ストレス テスト戦略をモデル検査に変更するには、テストで`StressOptions()`を`ModelCheckingOptions()`に置き換えます。

```kotlin
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*

class CounterTest {
    private val c = Counter() // Initial state

    // Operations on the Counter
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // Run the test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

### モデル検査の仕組み {initial-collapse-state="collapsed" collapsible="true"}

複雑な並行アルゴリズムのほとんどのバグは、あるスレッドから別のスレッドへの実行を切り替える古典的なインターリービングで再現できます。さらに、弱メモリ モデル用のモデルチェッカーは非常に複雑なため、Lincheckは_逐次一貫性メモリ モデル_の下で有界モデル検査を使用します。

簡潔に言えば、Lincheckは、まず1つのコンテキスト スイッチから、次に2つ、そして指定された数のインターリービングが検査されるまでプロセスを続行し、すべてのインターリービングを分析します。この戦略により、可能な限り少ないコンテキスト スイッチで誤ったスケジュールを見つけることができ、その後のバグ調査が容易になります。

実行を制御するために、Lincheckはテスト コードに特別なスイッチ ポイントを挿入します。これらのポイントは、コンテキスト スイッチを実行できる場所を識別します。基本的に、これらはJVMでのフィールドや配列要素の読み書き、`wait/notify`や`park/unpark`呼び出しなどの共有メモリ アクセスです。スイッチ ポイントを挿入するために、LincheckはASMフレームワークを使用してテスト コードをその場で変換し、既存のコードに内部関数呼び出しを追加します。

モデル検査戦略が実行を制御するため、Lincheckは無効なインターリービングにつながるトレースを提供でき、これは実用上非常に役立ちます。`Counter`の不正な実行のトレース例は、[Lincheckを使った最初のテストを記述する](introduction.md#trace-the-invalid-execution)チュートリアルで確認できます。

## どちらのテスト戦略が優れていますか？

_モデル検査戦略_は、逐次一貫性メモリ モデル下のバグを見つけるのに優れており、より良いカバレッジを保証し、エラーが発見された場合には失敗した実行トレースを提供します。

_ストレス テスト_はカバレッジを保証しませんが、`volatile`修飾子の欠落など、低レベルの効果によって導入されたバグがないかアルゴリズムをチェックするのに依然として役立ちます。ストレス テストは、再現に多くのコンテキスト スイッチを必要とする稀なバグを発見するのにも非常に役立ち、現在のモデル検査戦略の制限によりそれらすべてを分析することは不可能です。

## テスト戦略を構成する

テスト戦略を構成するには、`<TestingMode>Options`クラスでオプションを設定します。

1.  `CounterTest`のシナリオ生成と実行のためのオプションを設定します。

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.stress.*
    import org.junit.*
    
    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
    
        @Test
        fun stressTest() = StressOptions() // Stress testing options:
            .actorsBefore(2) // Number of operations before the parallel part
            .threads(2) // Number of threads in the parallel part
            .actorsPerThread(2) // Number of operations in each thread of the parallel part
            .actorsAfter(1) // Number of operations after the parallel part
            .iterations(100) // Generate 100 random concurrent scenarios
            .invocationsPerIteration(1000) // Run each generated scenario 1000 times
            .check(this::class) // Run the test
    }
    ```

2.  `stressTest()`を再度実行すると、Lincheckは次のようなシナリオを生成します。

    ```text 
    | ------------------- |
    | Thread 1 | Thread 2 |
    | ------------------- |
    | inc()    |          |
    | inc()    |          |
    | ------------------- |
    | get()    | inc()    |
    | inc()    | get()    |
    | ------------------- |
    | inc()    |          |
    | ------------------- |
    ```

    ここでは、並行処理部分の前に2つの操作があり、2つの操作ごとに2つのスレッドがあり、その後に最後に1つの操作が続きます。

モデル検査テストも同じ方法で構成できます。

## シナリオの最小化

検出されたエラーは、テスト構成で指定されたよりも小さいシナリオで表現されることが多いことにすでに気づいているかもしれません。Lincheckは、テストが失敗しなくなるまで、操作を積極的に削除することでエラーを最小化しようとします。

上記のカウンタ テストの最小化されたシナリオは次のとおりです。

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

小さいシナリオの方が分析しやすいため、シナリオの最小化はデフォルトで有効になっています。この機能を無効にするには、`[Stress, ModelChecking]Options`構成に`minimizeFailedScenario(false)`を追加します。

## データ構造の状態をログに記録する

デバッグのためのもう1つの便利な機能は_状態ロギング_です。エラーにつながるインターリービングを分析する場合、通常は紙にデータ構造の変更を書き出し、各イベント後に状態を変更します。この手順を自動化するために、データ構造の`String`表現を返す特別なメソッドを提供できます。そうすると、Lincheckはデータ構造を変更するインターリービングの各イベントの後に状態表現を出力します。

このためには、引数を取らず、`@StateRepresentation`アノテーションでマークされたメソッドを定義します。このメソッドはスレッドセーフで、ノンブロッキングであり、データ構造を変更してはなりません。

1.  `Counter`の例では、`String`表現は単にカウンタの値です。したがって、トレースにカウンタの状態を出力するには、`CounterTest`に`stateRepresentation()`関数を追加します。

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
    import org.junit.Test

    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
        
        @StateRepresentation
        fun stateRepresentation() = c.get().toString()
        
        @Test
        fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
    }
    ```

2.  `modelCheckingTest()`を今すぐ実行し、カウンタの状態を変更するスイッチ ポイントで出力される`Counter`の状態（`STATE:`で始まる）を確認してください。

    ```text
    = Invalid execution results =
    | ------------------- |
    | Thread 1 | Thread 2 |
    | ------------------- |
    | STATE: 0            |
    | ------------------- |
    | inc(): 1 | inc(): 1 |
    | ------------------- |
    | STATE: 1            |
    | ------------------- |
    
    The following interleaving leads to the error:
    | -------------------------------------------------------------------- |
    | Thread 1 |                         Thread 2                          |
    | -------------------------------------------------------------------- |
    |          | inc()                                                     |
    |          |   inc(): 1 at CounterTest.inc(CounterTest.kt:10)          |
    |          |     value.READ: 0 at Counter.inc(BasicCounterTest.kt:10)  |
    |          |     switch                                                |
    | inc(): 1 |                                                           |
    | STATE: 1 |                                                           |
    |          |     value.WRITE(1) at Counter.inc(BasicCounterTest.kt:10) |
    |          |     STATE: 1                                              |
    |          |     value.READ: 1 at Counter.inc(BasicCounterTest.kt:10)  |
    |          |   result: 1                                               |
    | -------------------------------------------------------------------- |
    ```

ストレス テストの場合、Lincheckはシナリオの並行処理部分の直前と直後、そして終了時に状態表現を出力します。

> *   これらの例の[全コード](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/CounterTest.kt)を入手する
> *   その他の[テスト例](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide)を見る
>
{style="note"}

## 次のステップ

[操作に渡される引数を構成する方法](operation-arguments.md)と、それがいつ役立つかについて学びましょう。