[//]: # (title: ストレス・テストとモデル・チェック)

Lincheckは、ストレス・テストとモデル・チェックという2つのテスト戦略を提供しています。[前のステップ](lincheck-getting-started.md)で`BasicCounterTest.kt`ファイルに記述した`Counter`を使用して、両方のアプローチの内部で何が起こっているのかを学びましょう。

```kotlin
class Counter {
    @Volatile
    private var value = 0

    fun inc(): Int = ++value
    fun get() = value
}
```

## ストレス・テスト

### ストレス・テストを作成する

以下の手順に従って、`Counter`の並行ストレス・テストを作成します。

1. `CounterTest`クラスを作成します。
2. このクラスに`Counter`型のフィールド`c`を追加し、コンストラクタでインスタンスを生成します。
3. カウンターの操作をリストアップし、`@Operation`アノテーションを付けて、その実装を`c`に委譲します。
4. `StressOptions()`を使用してストレス・テスト戦略を指定します。
5. テストを実行するために`StressOptions.check()`関数を呼び出します。

結果のコードは以下のようになります。

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初期状態
    
    // Counterに対する操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // テストの実行
    fun stressTest() = StressOptions().check(this::class)
}
```

### ストレス・テストの仕組み {initial-collapse-state="collapsed" collapsible="true"}

最初に、Lincheckは`@Operation`が付与された操作を使用して、一連の並行シナリオを生成します。次に、ネイティブ・スレッドを起動し、操作が同時に開始されることを保証するために開始時に同期させます。最後に、Lincheckはこれらのネイティブ・スレッド上で各シナリオを複数回実行し、誤った結果を生み出すインターリービング（interleaving：割り込み）が発生することを期待します。

下の図は、Lincheckが生成されたシナリオをどのように実行するかについてのハイレベルなスキームを示しています。

![Counterのストレス実行](counter-stress.png){width=700}

## モデル・チェック

ストレス・テストに関する主な懸念事項は、見つかったバグを再現する方法を理解するのに何時間もかかる可能性があることです。これを支援するために、Lincheckはバグを再現するためのインターリービングを自動的に提供する限定モデル・チェック（bounded model checking）をサポートしています。

モデル・チェック・テストは、ストレス・テストと同じ方法で構築されます。テスト戦略を指定する`StressOptions()`を`ModelCheckingOptions()`に置き換えるだけです。

### モデル・チェック・テストを作成する

ストレス・テスト戦略をモデル・チェックに変更するには、テスト内の`StressOptions()`を`ModelCheckingOptions()`に置き換えます。

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初期状態

    // Counterに対する操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // テストの実行
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

### モデル・チェックの仕組み {initial-collapse-state="collapsed" collapsible="true"}

複雑な並行アルゴリズムにおけるほとんどのバグは、実行をあるスレッドから別のスレッドへ切り替える典型的なインターリービングで再現可能です。また、弱いメモリ・モデル（weak memory models）用のモデル・チェッカーは非常に複雑なため、Lincheckは逐次整合性メモリ・モデル（sequential consistency memory model）の下で限定モデル・チェックを使用します。

簡単に言うと、Lincheckは、1つのコンテキスト・スイッチから始め、次に2つと、指定された数のインターリービングが調査されるまで、すべてのインターリービングを分析します。この戦略により、可能な限り少ないコンテキスト・スイッチ数で誤ったスケジュールを見つけることができ、その後のバグ調査が容易になります。

実行を制御するために、Lincheckはテスト・コードに特別なスイッチ・ポイント（switch points）を挿入します。これらのポイントは、コンテキスト・スイッチを実行できる場所を特定します。本質的に、これらはJVMにおけるフィールドや配列要素の読み取りまたは更新、および`wait/notify`や`park/unpark`の呼び出しといった共有メモリ・アクセスです。スイッチ・ポイントを挿入するために、LincheckはASMフレームワークを使用して実行時にテスト・コードを変換し、既存のコードに内部関数の呼び出しを追加します。

モデル・チェック戦略は実行を制御するため、Lincheckは無効なインターリービングにつながるトレース（trace）を提供することができ、これは実務において非常に役立ちます。`Counter`の誤った実行に対するトレースの例は、[Lincheckで最初のテストを書く](lincheck-getting-started.md#write-your-first-test)チュートリアルで見ることができます。

## どちらのテスト戦略が優れていますか？

モデル・チェック戦略（model checking strategy）は、より優れたカバレッジを保証し、エラーが見つかった場合に失敗した実行トレースを提供するため、逐次整合性メモリ・モデル下でのバグ発見に適しています。

ストレス・テスト（stress testing）はカバレッジを保証しませんが、`volatile`修飾子の欠落など、低レベルの効果によって導入されたバグのアルゴリズムをチェックするのに依然として役立ちます。また、ストレス・テストは、再現するために多くのコンテキスト・スイッチを必要とする稀なバグを発見するのにも非常に役立ちます。これらは、現在のモデル・チェック戦略の制限により、すべてを分析することが不可能なためです。

## テスト戦略の設定

テスト戦略を設定するには、`<TestingMode>Options`クラスでオプションを設定します。

1. `CounterTest`のシナリオ生成と実行のオプションを設定します。

    ```kotlin
    import org.jetbrains.lincheck.*
    import org.jetbrains.lincheck.datastructures.*
    import org.junit.*
    
    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
    
        @Test
        fun stressTest() = StressOptions() // ストレス・テストのオプション:
            .actorsBefore(2) // 並列パートの前の操作数
            .threads(2) // 並列パートのスレッド数
            .actorsPerThread(2) // 並列パートの各スレッドの操作数
            .actorsAfter(1) // 並列パートの後の操作数
            .iterations(100) // 100個のランダムな並行シナリオを生成
            .invocationsPerIteration(1000) // 各生成シナリオを1000回実行
            .check(this::class) // テストの実行
    }
    ```

2. 再度`stressTest()`を実行すると、Lincheckは以下のようなシナリオを生成します。

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

   ここでは、並列パートの前に2つの操作があり、2つのスレッドでそれぞれ2つの操作が行われ、その後に最後に1つの操作が続きます。

モデル・チェック・テストも同様に設定できます。

## シナリオの最小化

検出されたエラーが、通常、テスト設定で指定されたものよりも小さいシナリオで表示されることにすでに気づいているかもしれません。Lincheckは、テストの失敗を維持したまま操作を可能な限り削除することで、エラーの最小化を試みます。

上記のカウンター・テストの最小化されたシナリオは以下の通りです。

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

小さいシナリオの方が分析が容易なため、シナリオの最小化はデフォルトで有効になっています。この機能を無効にするには、`[Stress, ModelChecking]Options`設定に`minimizeFailedScenario(false)`を追加します。

## データ構造の状態のロギング

デバッグに役立つもう1つの機能は状態ロギング（state logging）です。エラーにつながるインターリービングを分析するとき、通常は紙にデータ構造の変化を書き出し、各イベントの後に状態を変更します。この手順を自動化するために、データ構造の`String`表現を返す特別なメソッドを提供できます。これにより、Lincheckはデータ構造を変更するインターリービング内の各イベントの後に、状態表現を出力します。

このために、引数を取らず、`@StateRepresentation`アノテーションが付与されたメソッドを定義します。このメソッドはスレッドセーフで、非ブロッキングであり、データ構造を決して変更しないものである必要があります。

1. `Counter`の例では、`String`表現は単にカウンターの値です。したがって、トレースにカウンターの状態を出力するには、`CounterTest`に`stateRepresentation()`関数を追加します。

    ```kotlin
    import org.jetbrains.lincheck.*
    import org.jetbrains.lincheck.datastructures.*
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

2. `modelCheckingTest()`を実行し、カウンターの状態を変更するスイッチ・ポイントで出力される`Counter`の状態を確認します（これらは`STATE:`で始まります）。

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

ストレス・テストの場合、Lincheckはシナリオ의並列パートの直前と直後、および最後に状態表現を出力します。

> * [これらの例の完全なコード](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/CounterTest.kt)を入手する。
> * さらなる[テスト例](https://github.com/JetBrains/lincheck/tree/master/lincheck/src/jvm/test/org/jetbrains/lincheck_test/guide)を見る。
>
{style="note"}

## 次のステップ

[操作に渡される引数を設定する方法](operation-arguments.md)と、それがどのような場合に役立つかを学びます。