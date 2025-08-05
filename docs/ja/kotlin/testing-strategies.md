[//]: # (title: ストレス テストとモデル検査)

Lincheckには、ストレス テストとモデル検査という2つのテスト戦略があります。 [前のステップ](introduction.md)の`BasicCounterTest.kt`ファイルで記述した`Counter`を使用して、両方のアプローチの内部で何が起こるかを見ていきましょう。

```kotlin
class Counter {
    @Volatile
    private var value = 0

    fun inc(): Int = ++value
    fun get() = value
}
```

## ストレス テスト

### ストレス テストの記述

以下の手順に従って、`Counter`の並行ストレス テストを作成します。

1. `CounterTest`クラスを作成します。
2. このクラスに、`Counter`型のフィールド`c`を追加し、コンストラクターでインスタンスを作成します。
3. カウンター操作をリストアップし、それらを`@Operation`アノテーションでマークし、その実装を`c`に委譲します。
4. `StressOptions()`を使用して、ストレス テスト戦略を指定します。
5. `StressOptions.check()`関数を呼び出してテストを実行します。

完成したコードは次のようになります。

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

### ストレス テストの仕組み {initial-collapse-state="collapsed" collapsible="true"}

まず、Lincheckは`@Operation`でマークされた操作を使用して並行シナリオのセットを生成します。次に、ネイティブ スレッドを起動し、操作が同時に開始されることを保証するために最初に同期させます。最後に、Lincheckはこれらのネイティブ スレッドで各シナリオを複数回実行し、誤った結果を生成するインターリービングに遭遇することを期待します。

下図は、Lincheckが生成されたシナリオをどのように実行するかを示す高レベルな概略図です。

![Stress execution of the Counter](counter-stress.png){width=700}

## モデル検査

ストレス テストに関する主な懸念は、発見されたバグを再現する方法を理解するために何時間も費やす可能性があることです。これを支援するために、Lincheckは、バグ再現のためのインターリービングを自動的に提供する有界モデル検査をサポートしています。

モデル検査テストは、ストレス テストと同じ方法で構築されます。テスト戦略を指定する`StressOptions()`を`ModelCheckingOptions()`に置き換えるだけです。

### モデル検査テストの記述

ストレス テスト戦略をモデル検査に変更するには、テストで`StressOptions()`を`ModelCheckingOptions()`に置き換えます。

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

### モデル検査の仕組み {initial-collapse-state="collapsed" collapsible="true"}

複雑な並行アルゴリズムにおけるほとんどのバグは、あるスレッドから別のスレッドへ実行を切り替える古典的なインターリービングで再現できます。さらに、弱いメモリモデルのモデルチェッカーは非常に複雑であるため、Lincheckは_シーケンシャル一貫性メモリモデル_の下で有界モデル検査を使用します。

要するに、Lincheckは、1回のコンテキストスイッチから始まり、次に2回というように、指定された数のインターリービングが検査されるまでプロセスを続行し、すべてのインターリービングを分析します。この戦略により、可能な限り少ないコンテキストスイッチで不正なスケジュールを発見でき、その後のバグ調査が容易になります。

実行を制御するために、Lincheckはテストコードに特別なスイッチポイントを挿入します。これらのポイントは、コンテキストスイッチを実行できる場所を識別します。基本的に、これらはJVMにおけるフィールドや配列要素の読み取りまたは更新、`wait/notify`や`park/unpark`呼び出しのような共有メモリアクセスです。スイッチポイントを挿入するために、LincheckはASMフレームワークを使用してテストコードをオンザフライで変換し、既存のコードに内部関数呼び出しを追加します。

モデル検査戦略が実行を制御するため、Lincheckは不正なインターリービングにつながるトレースを提供でき、これは実用的にも非常に役立ちます。`Counter`の不正な実行のトレースの例は、[Lincheckで最初のテストを記述する](introduction.md#trace-the-invalid-execution)チュートリアルで確認できます。

## どちらのテスト戦略が良いか？

_モデル検査戦略_は、シーケンシャル一貫性メモリモデル下でバグを見つけるのに優れています。これは、より良いカバレッジを保証し、エラーが見つかった場合に失敗した実行トレースを提供するからです。

_ストレス テスト_はカバレッジを保証しませんが、`volatile`修飾子の見落としなどの低レベルな効果によって引き起こされるバグに対してアルゴリズムをチェックするのに依然として役立ちます。ストレス テストは、再現するために多くのコンテキストスイッチを必要とする稀なバグを発見するのにも大いに役立ち、モデル検査戦略における現在の制限のため、それらすべてを分析することは不可能です。

## テスト戦略の構成

テスト戦略を構成するには、`<TestingMode>Options`クラスでオプションを設定します。

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
        fun stressTest() = StressOptions() // ストレス テストのオプション:
            .actorsBefore(2) // 並列処理前の操作数
            .threads(2) // 並列処理部のスレッド数
            .actorsPerThread(2) // 並列処理部の各スレッドにおける操作数
            .actorsAfter(1) // 並列処理後の操作数
            .iterations(100) // 100個のランダムな並行シナリオを生成
            .invocationsPerIteration(1000) // 各生成シナリオを1000回実行
            .check(this::class) // テストの実行
    }
    ```

2. もう一度`stressTest()`を実行すると、Lincheckは以下のようなシナリオを生成します。

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

   ここでは、並列処理部の前に2つの操作があり、2つのスレッドがそれぞれ2つの操作を行い、その後に最後に単一の操作が続きます。

モデル検査テストも同様に構成できます。

## シナリオの最小化

検出されたエラーは、通常、テスト構成で指定されたよりも小さいシナリオで表現されることにすでに気づいているかもしれません。Lincheckは、テストが失敗しないようにしながら、操作を積極的に削除することでエラーを最小化しようとします。

上記のカウンター テストの最小化されたシナリオは次のとおりです。

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

より小さなシナリオの方が分析しやすいため、シナリオの最小化はデフォルトで有効になっています。この機能を無効にするには、`[Stress, ModelChecking]Options`構成に`minimizeFailedScenario(false)`を追加します。

## データ構造の状態のロギング

デバッグのためのもう1つの便利な機能は、_状態ロギング_です。エラーにつながるインターリービングを分析する際、通常、各イベント後に状態を変更しながら、データ構造の変更を紙に書き出します。この手順を自動化するために、データ構造の`String`表現を返す特別なメソッドを提供できます。これにより、Lincheckはデータ構造を変更するインターリービングの各イベント後に状態表現を出力します。

これには、引数を取らず、`@StateRepresentation`アノテーションでマークされたメソッドを定義します。このメソッドはスレッドセーフで、ノンブロッキングであり、データ構造を一切変更してはいけません。

1. `Counter`の例では、`String`表現は単にカウンターの値です。したがって、トレースにカウンターの状態を出力するには、`stateRepresentation()`関数を`CounterTest`に追加します。

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

2. `modelCheckingTest()`を今すぐ実行し、カウンターの状態を変更するスイッチポイントで出力された`Counter`の状態を確認します（`STATE:`で始まります）。

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

ストレス テストの場合、Lincheckはシナリオの並列処理部の直前と直後、そして最後に状態表現を出力します。

> * これらの[完全なコード例を入手](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/CounterTest.kt)
> * その他の[テスト例を参照](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/lincheck_test/guide)
>
{style="note"}

## 次のステップ

[操作に渡される引数を構成する方法](operation-arguments.md)と、それがいつ役立つかについて学習します。