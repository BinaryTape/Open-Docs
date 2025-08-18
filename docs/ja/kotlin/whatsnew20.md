[//]: # (title: Kotlin 2.0.0 の新機能)

_[公開日: 2024年5月21日](releases.md#release-details)_

Kotlin 2.0.0 がリリースされ、[新しいKotlin K2コンパイラ](#kotlin-k2-compiler) が安定版となりました！さらに、主なハイライトは以下の通りです。

*   [新しいComposeコンパイラGradleプラグイン](#new-compose-compiler-gradle-plugin)
*   [invokedynamic を使用したラムダ関数の生成](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm ライブラリがStableに](#the-kotlinx-metadata-jvm-library-is-stable)
*   [Appleプラットフォームにおけるsignpostsを用いたKotlin/NativeのGCパフォーマンス監視](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [Objective-C メソッドとの競合の解決 (Kotlin/Native)](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Wasmにおける名前付きエクスポートのサポート](#support-for-named-export)
*   [Kotlin/Wasmにおける `@JsExport` を持つ関数での符号なしプリミティブ型のサポート](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [Binaryen を使用したプロダクションビルドのデフォルトでの最適化](#optimized-production-builds-by-default-using-binaryen)
*   [マルチプラットフォームプロジェクトにおけるコンパイラオプションの新しいGradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [enum class の `values` ジェネリック関数の安定版置換](#stable-replacement-of-the-enum-class-values-generic-function)
*   [AutoCloseable インターフェースの安定版](#stable-autocloseable-interface)

Kotlin 2.0は、JetBrainsチームにとって非常に大きな節目となります。今回のリリースはKotlinConf 2024の中心でした。Kotlin言語に関するエキサイティングなアップデートと最近の取り組みについて発表したオープニング基調講演をご覧ください。

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDEサポート

Kotlin 2.0.0 をサポートするKotlinプラグインは、最新のIntelliJ IDEAおよびAndroid Studioに同梱されています。
IDEのKotlinプラグインを更新する必要はありません。
必要なのは、ビルドスクリプトで[KotlinのバージョンをKotlin 2.0.0に変更する](releases.md#update-to-a-new-kotlin-version)ことだけです。

*   IntelliJ IDEAのKotlin K2コンパイラサポートの詳細については、[IDEでのサポート](#support-in-ides) を参照してください。
*   IntelliJ IDEAのKotlinサポートの詳細については、[Kotlinリリース](releases.md#ide-support) を参照してください。

## Kotlin K2コンパイラ

K2コンパイラへの道は長いものでしたが、JetBrainsチームはついにその安定化を発表する準備が整いました。
Kotlin 2.0.0では、新しいKotlin K2コンパイラがデフォルトで使用され、すべてのターゲットプラットフォーム（JVM、Native、Wasm、JS）で[Stable](components-stability.md)です。この新しいコンパイラは、大幅なパフォーマンス向上、新しい言語機能開発の高速化、Kotlinがサポートするすべてのプラットフォームの統合、そしてマルチプラットフォームプロジェクトのためのより優れたアーキテクチャをもたらします。

JetBrainsチームは、選択したユーザープロジェクトおよび内部プロジェクトの1000万行のコードを正常にコンパイルすることで、新しいコンパイラの品質を保証しました。18,000人の開発者が安定化プロセスに参加し、合計80,000のプロジェクトで新しいK2コンパイラをテストし、発見した問題を報告しました。

新しいコンパイラへの移行プロセスを可能な限りスムーズにするために、[K2コンパイラ移行ガイド](k2-compiler-migration-guide.md) を作成しました。
このガイドでは、コンパイラの多くの利点、発生する可能性のある変更点、および必要に応じて以前のバージョンにロールバックする方法について説明しています。

[ブログ投稿](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/) で、さまざまなプロジェクトにおけるK2コンパイラのパフォーマンスについて調査しました。K2コンパイラの実際のパフォーマンスデータや、ご自身のプロジェクトからパフォーマンスベンチマークを収集する方法を知りたい場合は、ぜひご覧ください。

また、KotlinConf 2024でのこの講演では、リード言語デザイナーのMichail Zarečenskijが、Kotlinにおける機能進化とK2コンパイラについて語っています。

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 現在のK2コンパイラの制限事項

GradleプロジェクトでK2を有効にすると、Gradleバージョン8.3より低いバージョンを使用しているプロジェクトで、以下の場合に影響を与える特定の制限事項があります。

*   `buildSrc` からのソースコードのコンパイル。
*   インクルードビルドにおけるGradleプラグインのコンパイル。
*   Gradleバージョン8.3より低いプロジェクトで使用されている他のGradleプラグインのコンパイル。
*   Gradleプラグインの依存関係のビルド。

上記の問題に遭遇した場合は、以下の手順で対処できます。

*   `buildSrc`、すべてのGradleプラグイン、およびその依存関係の言語バージョンを設定します。

  ```kotlin
  kotlin {
      compilerOptions {
          languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
          apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
      }
  }
  ```

  > 特定のタスクの言語バージョンとAPIバージョンを設定する場合、これらの値は `compilerOptions` 拡張によって設定された値をオーバーライドします。この場合、言語バージョンとAPIバージョンは1.9より高く設定すべきではありません。
  >
  {style="note"}

*   プロジェクトのGradleバージョンを8.3以降に更新します。

### スマートキャストの改善

Kotlinコンパイラは、特定のケースでオブジェクトを型に自動的にキャストできるため、明示的にキャストする手間を省くことができます。これは[スマートキャスト](typecasts.md#smart-casts) と呼ばれます。
Kotlin K2コンパイラは、以前よりもさらに多くのシナリオでスマートキャストを実行できるようになりました。

Kotlin 2.0.0では、スマートキャストに関連する以下の領域で改善を行いました。

*   [ローカル変数とより広範囲のスコープ](#local-variables-and-further-scopes)
*   [論理 `or` 演算子による型チェック](#type-checks-with-logical-or-operator)
*   [インライン関数](#inline-functions)
*   [関数型を持つプロパティ](#properties-with-function-types)
*   [例外処理](#exception-handling)
*   [インクリメント/デクリメント演算子](#increment-and-decrement-operators)

#### ローカル変数とより広範囲のスコープ

以前は、`if` 条件内で変数が `null` でないと評価された場合、変数はスマートキャストされました。
この変数に関する情報は、`if` ブロックのスコープ内でさらに共有されていました。

しかし、変数を `if` 条件の**外側**で宣言した場合、`if` 条件内では変数に関する情報が利用できなかったため、スマートキャストできませんでした。この動作は、`when` 式や `while` ループでも見られました。

Kotlin 2.0.0からは、`if`、`when`、または `while` 条件で使用する前に変数を宣言した場合、コンパイラが変数について収集した情報は、スマートキャストのために対応するブロックでアクセスできるようになります。

これは、ブール条件を変数に抽出したい場合に役立ちます。これにより、変数に意味のある名前を付け、コードの可読性を向上させ、後でコード内で変数を再利用できるようになります。例：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // Kotlin 2.0.0 では、コンパイラは
        // isCat に関する情報にアクセスできるため、
        // animal が Cat 型にスマートキャストされたことを認識します。
        // したがって、purr() 関数を呼び出すことができます。
        // Kotlin 1.9.20 では、コンパイラは
        // スマートキャストについて認識しないため、
        // purr() 関数の呼び出しはエラーを発生させます。
        animal.purr()
    }
}

fun main() {
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-local-variables" validate="false"}

#### 論理OR演算子による型チェック

Kotlin 2.0.0では、オブジェクトの型チェックを `or` 演算子 (`||`) で結合した場合、それらの最も近い共通のスーパータイプにスマートキャストが行われます。この変更以前は、スマートキャストは常に `Any` 型に行われていました。

この場合、オブジェクトのプロパティにアクセスしたり、関数を呼び出す前に、オブジェクトの型を手動でチェックする必要がありました。例：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus は共通のスーパータイプ Status にスマートキャストされる
        signalStatus.signal()
        // Kotlin 2.0.0 以前は、signalStatus は Any 型にスマートキャストされ、
        // signal() 関数の呼び出しは Unresolved reference エラーを引き起こしていました。
        // signal() 関数は、別の型チェックの後でなければ正常に呼び出すことができませんでした。

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 共通のスーパータイプは、ユニオン型の**近似**です。[ユニオン型](https://en.wikipedia.org/wiki/Union_type) はKotlinではサポートされていません。
>
{style="note"}

#### インライン関数

Kotlin 2.0.0では、K2コンパイラはインライン関数を異なる方法で扱い、他のコンパイラ分析と組み合わせてスマートキャストが安全であるかどうかを判断できるようになりました。

具体的には、インライン関数は暗黙的な [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) コントラクトを持つように扱われるようになりました。これは、インライン関数に渡されたすべてのラムダ関数がその場で呼び出されることを意味します。ラムダ関数がその場で呼び出されるため、コンパイラはラムダ関数がその関数本体内に含まれる変数の参照を漏らすことがないことを認識します。

コンパイラはこの知識と他のコンパイラ分析を使用して、キャプチャされた変数のスマートキャストが安全であるかどうかを決定します。例：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // Kotlin 2.0.0 では、コンパイラは processor が
        // ローカル変数であり、inlineAction() がインライン関数であることを認識するため、
        // processor への参照が漏れることはありません。したがって、
        // processor をスマートキャストすることは安全です。

        // processor が null でない場合、processor はスマートキャストされる
        if (processor != null) {
            // コンパイラは processor が null でないことを認識するため、
            // 安全な呼び出しは不要です
            processor.process()

            // Kotlin 1.9.20 では、安全な呼び出しを実行する必要がありました。
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 関数型を持つプロパティ

以前のバージョンのKotlinでは、関数型を持つクラスプロパティがスマートキャストされないというバグがありました。
Kotlin 2.0.0 と K2 コンパイラでこの動作を修正しました。例：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // Kotlin 2.0.0 では、provider が null でない場合、
        // provider はスマートキャストされる
        if (provider != null) {
            // コンパイラは provider が null でないことを認識している
            provider()

            // 1.9.20 では、コンパイラは provider が null でないことを認識しないため、
            // エラーが発生します。
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

この変更は、`invoke` 演算子をオーバーロードした場合にも適用されます。例：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // 1.9.20 では、コンパイラはエラーを発生させます。
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 例外処理

Kotlin 2.0.0では、スマートキャスト情報を `catch` ブロックと `finally` ブロックに渡せるように例外処理が改善されました。この変更により、コンパイラがオブジェクトがnullable型であるかどうかを追跡するため、コードがより安全になります。例：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput は String 型にスマートキャストされる
    stringInput = ""
    try {
        // コンパイラは stringInput が null でないことを認識している
        println(stringInput.length)
        // 0

        // コンパイラは stringInput の以前のスマートキャスト情報を破棄します。
        // これで stringInput は String? 型になります。
        stringInput = null

        // 例外を発生させる
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // Kotlin 2.0.0 では、コンパイラは stringInput が
        // null である可能性があることを認識しているため、stringInput は null のままです。
        println(stringInput?.length)
        // null

        // Kotlin 1.9.20 では、コンパイラは安全な呼び出しが不要だと判断しますが、
        // これは誤りです。
    }
}

//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### インクリメント/デクリメント演算子

Kotlin 2.0.0以前は、コンパイラはインクリメント/デクリメント演算子を使用した後にオブジェクトの型が変わることを認識していませんでした。コンパイラがオブジェクトの型を正確に追跡できなかったため、コードが未解決の参照エラーにつながる可能性がありました。Kotlin 2.0.0でこれが修正されました。

```kotlin
interface Rho {
    operator fun inc(): Sigma = TODO()
}

interface Sigma : Rho {
    fun sigma() = Unit
}

interface Tau {
    fun tau() = Unit
}

fun main(input: Rho) {
    var unknownObject: Rho = input

    // unknownObject が Tau インターフェースを継承しているかチェック
    // unknownObject が Rho と Tau の両方のインターフェースを継承している可能性もある
    if (unknownObject is Tau) {

        // インターフェース Rho のオーバーロードされた inc() 演算子を使用する。
        // Kotlin 2.0.0 では、unknownObject の型は Sigma にスマートキャストされる。
        ++unknownObject

        // Kotlin 2.0.0 では、コンパイラは unknownObject が Sigma 型であることを認識しているため、
        // sigma() 関数を正常に呼び出すことができる。
        unknownObject.sigma()

        // Kotlin 1.9.20 では、inc() が呼び出されてもコンパイラはスマートキャストを実行しないため、
        // unknownObject は Tau 型であると誤解している。sigma() 関数を呼び出すと
        // コンパイル時エラーが発生する。

        // Kotlin 2.0.0 では、コンパイラは unknownObject が Sigma 型であることを認識しているため、
        // tau() 関数を呼び出すとコンパイル時エラーが発生する。
        unknownObject.tau()
        // Unresolved reference 'tau'

        // Kotlin 1.9.20 では、コンパイラが誤って unknownObject を Tau 型であると認識しているため、
        // tau() 関数を呼び出すことはできるが、ClassCastException がスローされる。
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin Multiplatformの改善点

Kotlin 2.0.0では、Kotlin Multiplatformに関連するK2コンパイラの改善を以下の領域で行いました。

*   [コンパイル時の共通ソースとプラットフォームソースの分離](#separation-of-common-and-platform-sources-during-compilation)
*   [expectedおよびactual宣言の異なる可視性レベル](#different-visibility-levels-of-expected-and-actual-declarations)

#### コンパイル時の共通ソースとプラットフォームソースの分離

以前は、Kotlinコンパイラの設計上、共通ソースセットとプラットフォームソースセットをコンパイル時に分離することができませんでした。その結果、共通コードがプラットフォームコードにアクセスでき、プラットフォーム間で異なる動作を引き起こしていました。さらに、共通コードからの一部コンパイラ設定と依存関係がプラットフォームコードに漏洩していました。

Kotlin 2.0.0では、新しいKotlin K2コンパイラの導入に伴い、コンパイルスキームを再設計し、共通ソースセットとプラットフォームソースセットの厳密な分離を保証しました。この変更は、[expectedおよびactual関数](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions) を使用する際に最も顕著に現れます。
以前は、共通コード内の関数呼び出しがプラットフォームコード内の関数に解決される可能性がありました。例：

<table>
   <tr>
       <td>共通コード</td>
       <td>プラットフォームコード</td>
   </tr>
   <tr>
<td>

```kotlin
fun foo(x: Any) = println("common foo")

fun exampleFunction() {
    foo(42)
}
```

</td>
<td>

```kotlin
// JVM
fun foo(x: Int) = println("platform foo")

// JavaScript
// JavaScript プラットフォームには
// foo() 関数のオーバーロードはない
```

</td>
</tr>
</table>

この例では、共通コードは実行されるプラットフォームによって異なる動作をします。

*   JVMプラットフォームでは、共通コードの `foo()` 関数の呼び出しは、プラットフォームコードの `foo()` 関数（`platform foo`）を呼び出します。
*   JavaScriptプラットフォームでは、共通コードの `foo()` 関数の呼び出しは、プラットフォームコードにそのような関数が存在しないため、共通コードの `foo()` 関数（`common foo`）を呼び出します。

Kotlin 2.0.0では、共通コードはプラットフォームコードにアクセスできないため、両方のプラットフォームで `foo()` 関数は共通コードの `foo()` 関数（`common foo`）に正常に解決されます。

プラットフォーム間の動作の一貫性向上に加えて、IntelliJ IDEAまたはAndroid Studioとコンパイラ間の動作の競合があったケースの修正にも力を入れました。例えば、[expectedおよびactualクラス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes) を使用した場合、以下のようになります。

<table>
   <tr>
       <td>共通コード</td>
       <td>プラットフォームコード</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 2.0.0 以前は、
    // IDEのみでエラーが発生
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class
    // Identity has no default constructor.
}
```

</td>
<td>

```kotlin
actual class Identity {
    actual fun confirmIdentity() = "expect class fun: jvm"
}
```

</td>
</tr>
</table>

この例では、expectedクラス `Identity` にはデフォルトコンストラクタがないため、共通コードで正常に呼び出すことができません。
以前は、IDEによってのみエラーが報告されていましたが、JVMではコードは正常にコンパイルされていました。しかし、現在はコンパイラが正しくエラーを報告します。

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解決動作が変わらない場合

新しいコンパイルスキームへの移行はまだ進行中であるため、同じソースセット内にない関数を呼び出す場合、解決動作はまだ同じです。この違いは主に、共通コードでマルチプラットフォームライブラリからのオーバーロードを使用する場合に気づくでしょう。

シグネチャが異なる2つの `whichFun()` 関数を持つライブラリがあると仮定します。

```kotlin
// ライブラリの例

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

共通コードで `whichFun()` 関数を呼び出すと、ライブラリ内で最も関連性の高い引数型を持つ関数が解決されます。

```kotlin
// JVM ターゲット用の例のライブラリを使用するプロジェクト

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

比較として、`whichFun()` のオーバーロードを同じソースセット内で宣言した場合、コードがプラットフォーム固有のバージョンにアクセスできないため、共通コードからの関数が解決されます。

```kotlin
// 例のライブラリは使用しない

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

マルチプラットフォームライブラリと同様に、`commonTest` モジュールは別のソースセットにあるため、プラットフォーム固有のコードにアクセスできます。したがって、`commonTest` モジュール内の関数呼び出しの解決は、古いコンパイルスキームと同じ動作を示します。

将来的には、これらの残りのケースも新しいコンパイルスキームとより一貫したものになる予定です。

#### expectedおよびactual宣言の異なる可視性レベル

Kotlin 2.0.0以前は、Kotlin Multiplatformプロジェクトで[expectedおよびactual宣言](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) を使用する場合、それらは同じ[可視性レベル](visibility-modifiers.md) を持っている必要がありました。
Kotlin 2.0.0では、異なる可視性レベルもサポートされるようになりましたが、**actual宣言がexpected宣言よりも_より寛容である_場合に限ります**。例：

```kotlin
expect internal class Attribute // 可視性は internal
actual class Attribute          // 可視性はデフォルトで public、
                                // これはより寛容
```

同様に、actual宣言で[型エイリアス](type-aliases.md) を使用している場合、**基になる型の可視性**は、expected宣言と同じか、より寛容である必要があります。例：

```kotlin
expect internal class Attribute                 // 可視性は internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 可視性はデフォルトで public、
                                                // これはより寛容
```

### コンパイラプラグインのサポート

現在、Kotlin K2コンパイラは以下のKotlinコンパイラプラグインをサポートしています。

*   [`all-open`](all-open-plugin.md)
*   [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
*   [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
*   [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
*   [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
*   [Lombok](lombok.md)
*   [`no-arg`](no-arg-plugin.md)
*   [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
*   [SAM with receiver](sam-with-receiver-plugin.md)
*   [serialization](serialization.md)
*   [Power-assert](power-assert.md)

さらに、Kotlin K2コンパイラは以下もサポートしています。

*   [Jetpack Compose](https://developer.android.com/jetpack/compose) コンパイラプラグイン 2.0.0（[Kotlinリポジトリに移動](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)）。
*   [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 以降の[Kotlin Symbol Processing (KSP) プラグイン](ksp-overview.md)。

> 追加のコンパイラプラグインを使用している場合は、K2との互換性についてそれらのドキュメントを確認してください。
>
{style="tip"}

### 実験的なKotlin Power-assertコンパイラプラグイン

> Kotlin Power-assert プラグインは[実験的機能](components-stability.md#stability-levels-explained)です。
> いつでも変更される可能性があります。
>
{style="warning"}

Kotlin 2.0.0 では、実験的な Power-assert コンパイラプラグインが導入されました。このプラグインは、失敗メッセージにコンテキスト情報を含めることでテスト作成の体験を向上させ、デバッグをより簡単かつ効率的にします。

開発者は、効果的なテストを書くために複雑なアサーションライブラリを使用する必要があることがよくあります。Power-assert プラグインは、アサーション式の途中値を含む失敗メッセージを自動的に生成することで、このプロセスを簡素化します。これは、開発者がテストが失敗した理由を迅速に理解するのに役立ちます。

テストでアサーションが失敗すると、改善されたエラーメッセージには、アサーション内のすべての変数と部分式の値が表示され、条件のどの部分が失敗の原因であるかが明確になります。これは、複数の条件がチェックされる複雑なアサーションで特に役立ちます。

プロジェクトでプラグインを有効にするには、`build.gradle(.kts)` ファイルで次のように設定します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}

powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue"]
}
```

</tab>
</tabs>

[ドキュメントでKotlin Power-assertプラグイン](power-assert.md) の詳細をご覧ください。

### Kotlin K2コンパイラを有効にする方法

Kotlin 2.0.0以降、Kotlin K2コンパイラはデフォルトで有効になっています。追加のアクションは不要です。

### Kotlin PlaygroundでKotlin K2コンパイラを試す

Kotlin Playgroundは2.0.0リリースをサポートしています。[試してみてください！](https://pl.kotl.in/czuoQprce)

### IDEでのサポート

デフォルトでは、IntelliJ IDEAとAndroid Studioは、コード分析、コード補完、ハイライト、およびその他のIDE関連機能に以前のコンパイラを使用しています。IDEで完全なKotlin 2.0エクスペリエンスを得るには、K2モードを有効にします。

IDEで、**Settings** | **Languages & Frameworks** | **Kotlin** に移動し、**Enable K2 mode** オプションを選択します。
IDEはK2モードを使用してコードを分析します。

![Enable K2 mode](k2-mode.png){width=200}

K2モードを有効にすると、コンパイラの動作変更によりIDE分析に違いがあることに気づくかもしれません。新しいK2コンパイラが以前のものとどのように異なるかについては、[移行ガイド](k2-compiler-migration-guide.md) でご確認ください。

*   K2モードの詳細については、[ブログ](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/) をご覧ください。
*   K2モードに関するフィードバックを積極的に収集していますので、[公開Slackチャンネル](https://kotlinlang.slack.com/archives/C0B8H786P) でご意見をお聞かせください。

### 新しいK2コンパイラに関するフィードバックを送る

皆様からのフィードバックをお待ちしております！

*   新しいK2コンパイラで直面した問題は、[課題トラッカー](https://kotl.in/issue) で報告してください。
*   JetBrainsがK2の使用状況に関する匿名データを収集できるように、[「使用状況統計を送信」オプション](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) を有効にしてください。

## Kotlin/JVM

バージョン2.0.0以降、コンパイラはJava 22バイトコードを含むクラスを生成できます。
このバージョンには、以下の変更も含まれています。

*   [invokedynamic を使用したラムダ関数の生成](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm ライブラリがStableに](#the-kotlinx-metadata-jvm-library-is-stable)

### invokedynamic を使用したラムダ関数の生成

Kotlin 2.0.0では、`invokedynamic` を使用してラムダ関数を生成する新しいデフォルトの方法が導入されました。この変更により、従来の匿名クラス生成と比較してアプリケーションのバイナリサイズが削減されます。

最初のバージョン以降、Kotlinはラムダを匿名クラスとして生成してきました。しかし、[Kotlin 1.5.0](whatsnew15.md#lambdas-via-invokedynamic) 以降、`-Xlambdas=indy` コンパイラオプションを使用することで `invokedynamic` 生成のオプションが利用可能になりました。Kotlin 2.0.0では、`invokedynamic` がラムダ生成のデフォルトの方法になりました。この方法により、より軽量なバイナリが生成され、KotlinがJVMの最適化に適合し、アプリケーションがJVMパフォーマンスの継続的および将来的な改善の恩恵を受けることができます。

現在、通常のラムダコンパイルと比較して、以下の3つの制限があります。

*   `invokedynamic` にコンパイルされたラムダはシリアル化できません。
*   実験的な [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API は `invokedynamic` で生成されたラムダをサポートしていません。
*   そのようなラムダに対して `.toString()` を呼び出すと、可読性の低い文字列表現が生成されます。

```kotlin
fun main() {
    println({})

    // Kotlin 1.9.24 とリフレクションの場合、以下を返す
    // () -> kotlin.Unit
    
    // Kotlin 2.0.0 の場合、以下を返す
    // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
}
```

ラムダ関数の従来の生成動作を保持するには、以下のいずれかを実行します。

*   特定のラムダに `@JvmSerializableLambda` アノテーションを付与します。
*   コンパイラオプション `-Xlambdas=class` を使用して、モジュール内のすべてのラムダを従来の方式で生成します。

### kotlinx-metadata-jvm ライブラリがStableに

Kotlin 2.0.0では、`kotlinx-metadata-jvm` ライブラリが[Stable](components-stability.md#stability-levels-explained) になりました。ライブラリが `kotlin` パッケージと座標に変更されたため、`kotlin-metadata-jvm` (xなし) として見つけることができます。

以前は、`kotlinx-metadata-jvm` ライブラリは独自の公開スキームとバージョンを持っていました。今後は、`kotlin-metadata-jvm` のアップデートをKotlinリリースサイクルの一部としてビルドおよび公開し、Kotlin標準ライブラリと同じ後方互換性の保証を提供します。

`kotlin-metadata-jvm` ライブラリは、Kotlin/JVMコンパイラによって生成されたバイナリファイルのメタデータを読み書きするためのAPIを提供します。

<!-- Learn more about the `kotlinx-metadata-jvm` library in the [documentation](kotlin-metadata-jvm.md). -->

## Kotlin/Native

このバージョンでは、以下の変更が加えられました。

*   [signpostsを用いたGCパフォーマンス監視](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [Objective-C メソッドとの競合の解決](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Nativeにおけるコンパイラ引数のログレベルの変更](#changed-log-level-for-compiler-arguments)
*   [Kotlin/Nativeへの標準ライブラリおよびプラットフォーム依存関係の明示的な追加](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
*   [Gradle設定キャッシュにおけるタスクエラー](#tasks-error-in-gradle-configuration-cache)

### Appleプラットフォームにおけるsignpostsを用いたGCパフォーマンス監視

以前は、Kotlin/Nativeのガベージコレクタ（GC）のパフォーマンスは、ログを調べることによってのみ監視可能でした。しかし、これらのログは、iOSアプリのパフォーマンス問題を調査するための一般的なツールキットであるXcode Instrumentsと統合されていませんでした。

Kotlin 2.0.0以降、GCはInstrumentsで利用可能なsignpostsでポーズを報告します。signpostsはアプリ内でカスタムロギングを可能にするため、iOSアプリのパフォーマンスをデバッグする際、GCポーズがアプリケーションのフリーズに対応しているかを確認できるようになりました。

GCパフォーマンス分析の詳細については、[ドキュメント](native-memory-manager.md#monitor-gc-performance) をご覧ください。

### Objective-C メソッドとの競合の解決

Objective-Cのメソッドは異なる名前を持つことができますが、パラメータの数と型が同じである場合があります。例えば、
[`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc)
と [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc) です。
Kotlinでは、これらのメソッドは同じシグネチャを持つため、使用しようとすると競合するオーバーロードエラーが発生します。

以前は、このコンパイルエラーを回避するために、競合するオーバーロードを手動で抑制する必要がありました。Objective-CとのKotlinの相互運用性を向上させるため、Kotlin 2.0.0では新しい `@ObjCSignatureOverride` アノテーションが導入されました。

このアノテーションは、Objective-Cクラスから引数型が同じだが引数名が異なる関数が複数継承されている場合に、Kotlinコンパイラに競合するオーバーロードを無視するよう指示します。

このアノテーションを適用することは、一般的なエラー抑制よりも安全です。このアノテーションは、サポートされテストされているObjective-Cメソッドのオーバーライドの場合にのみ使用できますが、一般的な抑制は重要なエラーを隠し、静かに壊れたコードにつながる可能性があります。

### Kotlin/Nativeにおけるコンパイラ引数のログレベルの変更

今回のリリースでは、`compile`、`link`、`cinterop` などのKotlin/Native Gradleタスクにおけるコンパイラ引数のログレベルが、`info` から `debug` に変更されました。

`debug` がデフォルト値となったことで、ログレベルは他のGradleコンパイルタスクと一貫性を持つようになり、すべてのコンパイラ引数を含む詳細なデバッグ情報が提供されます。

### Kotlin/Nativeへの標準ライブラリおよびプラットフォーム依存関係の明示的な追加

以前は、Kotlin/Nativeコンパイラは標準ライブラリとプラットフォームの依存関係を暗黙的に解決していました。これは、Kotlin GradleプラグインがKotlinターゲット間で動作する方法に不整合を引き起こしていました。

現在、各Kotlin/Native Gradleコンパイルは、[`compileDependencyFiles` コンパイルパラメータ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compilation-parameters) を介して、コンパイル時ライブラリパスに標準ライブラリとプラットフォームの依存関係を明示的に含めています。

### Gradle設定キャッシュにおけるタスクエラー

Kotlin 2.0.0以降、次のようなメッセージを含む設定キャッシュエラーが発生する可能性があります。
`invocation of Task.project at execution time is unsupported`

このエラーは、`NativeDistributionCommonizerTask` や `KotlinNativeCompile` などのタスクで発生します。

しかし、これは偽陽性エラーです。根本的な問題は、`publish*` タスクなど、Gradle設定キャッシュと互換性のないタスクが存在することです。

エラーメッセージが異なる根本原因を示唆しているため、この不一致はすぐに明らかにならない場合があります。

正確な原因がエラー報告に明示されていないため、[Gradleチームはすでに報告を修正するために問題に対処しています](https://github.com/gradle/gradle/issues/21290)。

## Kotlin/Wasm

Kotlin 2.0.0は、パフォーマンスとJavaScriptとの相互運用性を向上させます。

*   [Binaryen を使用したプロダクションビルドのデフォルトでの最適化](#optimized-production-builds-by-default-using-binaryen)
*   [名前付きエクスポートのサポート](#support-for-named-export)
*   [`@JsExport` を持つ関数での符号なしプリミティブ型のサポート](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [Kotlin/WasmにおけるTypeScript宣言ファイルの生成](#generation-of-typescript-declaration-files-in-kotlin-wasm)
*   [JavaScript例外のキャッチのサポート](#support-for-catching-javascript-exceptions)
*   [新しい例外処理提案がオプションとしてサポートされるようになりました](#new-exception-handling-proposal-is-now-supported-as-an-option)
*   [`withWasm()` 関数がJSとWASIのバリアントに分割](#the-withwasm-function-is-split-into-js-and-wasi-variants)

### Binaryen を使用したプロダクションビルドのデフォルトでの最適化

Kotlin/Wasmツールチェーンは、以前の手動設定アプローチとは異なり、プロダクションコンパイル時にすべてのプロジェクトに[Binaryen](https://github.com/WebAssembly/binaryen)ツールを適用するようになりました。私たちの見積もりでは、これによりプロジェクトの実行時パフォーマンスが向上し、バイナリサイズが削減されるはずです。

> この変更はプロダクションコンパイルにのみ影響します。開発コンパイルプロセスは同じままです。
>
{style="note"}

### 名前付きエクスポートのサポート

以前は、Kotlin/Wasmからのすべてのエクスポートされた宣言は、デフォルトのエクスポートを使用してJavaScriptにインポートされていました。

```javascript
//JavaScript:
import Module from "./index.mjs"

Module.add()
```

現在では、`@JsExport` でマークされた各Kotlin宣言を名前でインポートできます。

```kotlin
// Kotlin:
@JsExport
fun add(a: Int, b: Int) = a + b
```

```javascript
//JavaScript:
import { add } from "./index.mjs"
```

名前付きエクスポートにより、KotlinとJavaScriptモジュール間のコード共有が容易になります。これにより可読性が向上し、モジュール間の依存関係管理に役立ちます。

### `@JsExport` を持つ関数での符号なしプリミティブ型のサポート

Kotlin 2.0.0以降、[符号なしプリミティブ型](unsigned-integer-types.md) を、Kotlin/Wasm関数をJavaScriptコードで利用可能にする `@JsExport` アノテーションを持つ外部宣言や関数内で使用できるようになりました。

これにより、以前の制限（符号なしプリミティブ型をエクスポートされた宣言や外部宣言内で直接使用できない）が緩和されます。現在、符号なしプリミティブ型を戻り値型またはパラメータ型として持つ関数をエクスポートしたり、符号なしプリミティブ型を返したり使用する外部宣言を利用したりできるようになりました。

Kotlin/WasmとJavaScriptの相互運用性の詳細については、[ドキュメント](wasm-js-interop.md#use-javascript-code-in-kotlin) を参照してください。

### Kotlin/WasmにおけるTypeScript宣言ファイルの生成

> Kotlin/WasmでのTypeScript宣言ファイルの生成は[実験的機能](components-stability.md#stability-levels-explained)です。
> いつでも廃止または変更される可能性があります。
>
{style="warning"}

Kotlin 2.0.0では、Kotlin/WasmコンパイラはKotlinコード内の`@JsExport`宣言からTypeScript定義を生成できるようになりました。これらの定義は、IDEやJavaScriptツールによってコードの自動補完、型チェックの支援、KotlinコードのJavaScriptへの組み込みを容易にするために使用できます。

Kotlin/Wasmコンパイラは、`@JsExport`でマークされたすべての[トップレベル関数](wasm-js-interop.md#functions-with-the-jsexport-annotation)を収集し、自動的に`.d.ts`ファイルにTypeScript定義を生成します。

TypeScript定義を生成するには、`build.gradle(.kts)`ファイル内の`wasmJs {}`ブロックに`generateTypeScriptDefinitions()`関数を追加します。

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

また、新しい`es2015` [コンパイルターゲット](#new-compilation-target) を使用することもできます。

### JavaScript例外のキャッチのサポート

以前は、Kotlin/WasmコードはJavaScriptの例外をキャッチできなかったため、プログラムのJavaScript側で発生するエラーを処理することが困難でした。

Kotlin 2.0.0では、Kotlin/Wasm内でJavaScript例外をキャッチするサポートを実装しました。この実装により、`Throwable` や `JsException` などの特定の型を使用して `try-catch` ブロックを使用し、これらのエラーを適切に処理できます。

さらに、例外の有無にかかわらずコードを実行するのに役立つ `finally` ブロックも正しく動作します。JavaScript例外のキャッチのサポートを導入していますが、JavaScript例外（コールスタックなど）が発生した場合に提供される追加情報はありません。ただし、[これらの実装に取り組んでいます](https://youtrack.jetbrains.com/issue/KT-68185/WasmJs-Attach-js-exception-object-to-JsException)。

### 新しい例外処理提案がオプションとしてサポートされるようになりました

このリリースでは、Kotlin/WasmにおけるWebAssemblyの[新しい例外処理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)のサポートを導入します。

このアップデートにより、新しい提案がKotlinの要件に合致し、最新バージョンの提案のみをサポートする仮想マシンでKotlin/Wasmを使用できるようになります。

`-Xwasm-use-new-exception-proposal` コンパイラオプションを使用することで、新しい例外処理提案を有効にできます。このオプションはデフォルトでは無効になっています。

### `withWasm()` 関数がJSとWASIのバリアントに分割

階層テンプレートのWasmターゲットを提供していた `withWasm()` 関数は、より特化した `withWasmJs()` と `withWasmWasi()` 関数に置き換えられ、非推奨になりました。

これで、WASIとJSターゲットをツリー定義の異なるグループ間で分離できるようになりました。

## Kotlin/JS

このバージョンには、他の変更に加え、KotlinにモダンなJSコンパイルがもたらされ、ES2015標準のより多くの機能をサポートします。

*   [新しいコンパイルターゲット](#new-compilation-target)
*   [ES2015ジェネレータとしてのSuspend関数](#suspend-functions-as-es2015-generators)
*   [main関数への引数渡し](#passing-arguments-to-the-main-function)
*   [Kotlin/JSプロジェクトのファイルごとのコンパイル](#per-file-compilation-for-kotlin-js-projects)
*   [改善されたコレクション相互運用性](#improved-collection-interoperability)
*   [createInstance() のサポート](#support-for-createinstance)
*   [型安全なプレーンJavaScriptオブジェクトのサポート](#support-for-type-safe-plain-javascript-objects)
*   [npmパッケージマネージャーのサポート](#support-for-npm-package-manager)
*   [コンパイルタスクの変更](#changes-to-compilation-tasks)
*   [レガシーなKotlin/JS JARアーティファクトの廃止](#discontinuing-legacy-kotlin-js-jar-artifacts)

### 新しいコンパイルターゲット

Kotlin 2.0.0では、Kotlin/JSに新しいコンパイルターゲット `es2015` を追加します。これは、KotlinでサポートされているES2015のすべての機能を一度に有効にする新しい方法です。

`build.gradle(.kts)` ファイルで次のように設定できます。

```kotlin
kotlin {
    js {
        compilerOptions {
            target.set("es2015")
        }
    }
}
```

新しいターゲットは、[ESクラスとモジュール](whatsnew19.md#experimental-support-for-es2015-classes-and-modules) および新たにサポートされた[ESジェネレータ](#suspend-functions-as-es2015-generators) を自動的に有効にします。

### ES2015ジェネレータとしてのSuspend関数

このリリースでは、[Suspend関数](composing-suspending-functions.md) をコンパイルするためのES2015ジェネレータの[実験的サポート](components-stability.md#stability-levels-explained) が導入されました。

ステートマシンではなくジェネレータを使用することで、プロジェクトの最終バンドルサイズが改善されるはずです。たとえば、JetBrainsチームはES2015ジェネレータを使用することで、Spaceプロジェクトのバンドルサイズを20%削減することに成功しました。

[ES2015 (ECMAScript 2015, ES6) の詳細については、公式ドキュメント](https://262.ecma-international.org/6.0/) をご覧ください。

### main関数への引数渡し

Kotlin 2.0.0 以降、`main()` 関数の `args` のソースを指定できるようになりました。この機能により、コマンドラインでの作業が容易になり、引数を渡すのが簡単になります。

これを行うには、`js {}` ブロックを新しい `passAsArgumentToMainFunction()` 関数で定義します。この関数は文字列の配列を返します。

```kotlin
kotlin {
    js {
        binary.executable()
        passAsArgumentToMainFunction("Deno.args")
    }
}
```

この関数は実行時に実行されます。JavaScript式を受け取り、`main()` 関数呼び出しの代わりに `args: Array<String>` 引数として使用します。

また、Node.jsランタイムを使用している場合は、特別なエイリアスを利用できます。これにより、`process.argv` を毎回手動で追加する代わりに、一度 `args` パラメータに渡すことができます。

```kotlin
kotlin {
    js {
        binary.executable()
        nodejs {
            passProcessArgvToMainFunction()
        }
    }
}
```

### Kotlin/JSプロジェクトのファイルごとのコンパイル

Kotlin 2.0.0 では、Kotlin/JS プロジェクトの出力に対する新しい粒度オプションが導入されました。Kotlin ファイルごとに1つの JavaScript ファイルを生成するファイルごとのコンパイルを設定できるようになりました。これにより、最終的なバンドルサイズを大幅に最適化し、プログラムの読み込み時間を改善するのに役立ちます。

以前は、出力オプションは2つしかありませんでした。Kotlin/JS コンパイラは、プロジェクト全体に対して1つの `.js` ファイルを生成できましたが、このファイルは大きすぎて使いにくい場合がありました。プロジェクトから関数を使用したい場合は、依存関係としてJavaScriptファイル全体を含める必要がありました。あるいは、プロジェクトモジュールごとに個別の `.js` ファイルのコンパイルを設定することもできました。これは依然としてデフォルトのオプションです。

モジュールファイルも大きすぎる可能性があったため、Kotlin 2.0.0 では、Kotlin ファイルごとに1つ（または、エクスポートされた宣言が含まれている場合は2つ）の JavaScript ファイルを生成する、よりきめ細かい出力が追加されました。ファイルごとのコンパイルモードを有効にするには：

1.  ECMAScriptモジュールをサポートするために、ビルドファイルに[`useEsModules()`](whatsnew19.md#experimental-support-for-es2015-classes-and-modules)関数を追加します。

    ```kotlin
    // build.gradle.kts
    kotlin {
        js(IR) {
            useEsModules() // ES2015 modules を有効にする
            browser()
        }
    }
    ```

    これには、新しい`es2015` [コンパイルターゲット](#new-compilation-target)を使用することもできます。

2.  `-Xir-per-file` コンパイラオプションを適用するか、`gradle.properties` ファイルを次のように更新します。

    ```none
    # gradle.properties
    kotlin.js.ir.output.granularity=per-file // `per-module` がデフォルト
    ```

### 改善されたコレクション相互運用性

Kotlin 2.0.0以降、シグネチャ内にKotlinコレクション型を持つ宣言をJavaScript（およびTypeScript）にエクスポートすることが可能になりました。これは、`Set`、`Map`、`List` コレクション型とその可変バージョンに適用されます。

JavaScriptでKotlinコレクションを使用するには、まず必要な宣言を[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) アノテーションでマークします。

```kotlin
// Kotlin
@JsExport
data class User(
    val name: String,
    val friends: List<User> = emptyList()
)

@JsExport
val me = User(
    name = "Me",
    friends = listOf(User(name = "Kodee"))
)
```

その後、JavaScriptから通常のJavaScript配列としてそれらを使用できます。

```javascript
// JavaScript
import { User, me, KtList } from "my-module"

const allMyFriendNames = me.friends
    .asJsReadonlyArrayView()
    .map(x => x.name) // ['Kodee']
```

> 残念ながら、JavaScriptからKotlinコレクションを作成することはまだできません。Kotlin 2.0.20でこの機能を追加する予定です。
>
{style="note"}

### createInstance() のサポート

Kotlin 2.0.0以降、Kotlin/JSターゲットから[`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html)関数を使用できるようになりました。以前は、JVMでのみ利用可能でした。

この関数は、[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/)インターフェースから提供され、指定されたクラスの新しいインスタンスを作成します。これは、Kotlinクラスの実行時参照を取得するのに役立ちます。

### 型安全なプレーンJavaScriptオブジェクトのサポート

> `js-plain-objects` プラグインは[実験的機能](components-stability.md#stability-levels-explained)です。
> いつでも廃止または変更される可能性があります。`js-plain-objects` プラグインはK2コンパイラのみをサポートします。
>
{style="warning"}

JavaScript APIとの連携を容易にするため、Kotlin 2.0.0では、型安全なプレーンJavaScriptオブジェクトを作成するために使用できる新しいプラグイン [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects) を提供しています。このプラグインは、`@JsPlainObject` アノテーションを持つ[外部インターフェース](wasm-js-interop.md#external-interfaces)についてコードをチェックし、以下を追加します。

*   コンストラクタとして使用できるコンパニオンオブジェクト内のインライン `invoke` 演算子関数。
*   オブジェクトのコピーを作成し、そのプロパティの一部を調整するために使用できる `.copy()` 関数。

例：

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface User {
    var name: String
    val age: Int
    val email: String?
}

fun main() {
    // JavaScript オブジェクトを作成する
    val user = User(name = "Name", age = 10)
    // オブジェクトをコピーし、email を追加する
    val copy = user.copy(age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

このアプローチで作成されたJavaScriptオブジェクトは、実行時にのみエラーを確認するのではなく、コンパイル時またはIDEでハイライト表示されるため、より安全です。

外部インターフェースを使用してJavaScriptオブジェクトの形状を記述する `fetch()` 関数を使用してJavaScript APIと対話する例を考えてみましょう。

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface FetchOptions {
    val body: String?
    val method: String
}

// Window.fetch のラッパー
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// "metod" がメソッドとして認識されないため、コンパイル時エラーが発生する
fetch("https://google.com", options = FetchOptions(metod = "POST"))
// method が必須であるため、コンパイル時エラーが発生する
fetch("https://google.com", options = FetchOptions(body = "SOME STRING")) 
```

比較として、JavaScriptオブジェクトを作成するために代わりに `js()` 関数を使用すると、
エラーは実行時にのみ検出されるか、まったく発生しません。

```kotlin
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// エラーは発生しない。"metod" が認識されないため、間違ったメソッド（GET）が使用される。
fetch("https://google.com", options = js("{ metod: 'POST' }"))

// デフォルトでは GET メソッドが使用される。body が存在すべきではないため、
// 実行時エラーが発生する。
fetch("https://google.com", options = js("{ body: 'SOME STRING' }"))
// TypeError: Window.fetch: HEAD or GET Request cannot have a body
```

`js-plain-objects` プラグインを使用するには、`build.gradle(.kts)` ファイルに以下を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.js-plain-objects") version "2.0.0"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.js-plain-objects" version "2.0.0"
}
```

</tab>
</tabs>

### npmパッケージマネージャーのサポート

以前は、Kotlin Multiplatform Gradleプラグインは、npm依存関係をダウンロードしてインストールするために[Yarn](https://yarnpkg.com/lang/en/)をパッケージマネージャーとして使用することしかできませんでした。Kotlin 2.0.0からは、代わりに[npm](https://www.npmjs.com/)をパッケージマネージャーとして使用できます。npmをパッケージマネージャーとして使用することで、設定中に管理するツールが1つ減ります。

後方互換性のため、Yarnは引き続きデフォルトのパッケージマネージャーです。npmをパッケージマネージャーとして使用するには、`gradle.properties`ファイルで以下のプロパティを設定します。

```kotlin
kotlin.js.yarn = false
```

### コンパイルタスクの変更

以前は、`webpack` と `distributeResources` のコンパイルタスクが同じディレクトリをターゲットにしていました。さらに、`distribution` タスクも `dist` を出力ディレクトリとして宣言していました。これにより、出力が重複し、コンパイル警告が発生していました。

そこで、Kotlin 2.0.0から、以下の変更を実装しました。

*   `webpack` タスクは別のフォルダをターゲットにするようになりました。
*   `distributeResources` タスクは完全に削除されました。
*   `distribution` タスクは `Copy` 型になり、`dist` フォルダをターゲットにするようになりました。

### レガシーなKotlin/JS JARアーティファクトの廃止

Kotlin 2.0.0以降、Kotlinディストリビューションには、`.jar` 拡張子を持つレガシーなKotlin/JSアーティファクトは含まれなくなりました。レガシーアーティファクトは、サポートされていない古いKotlin/JSコンパイラで使用されており、`klib` 形式を使用するIRコンパイラでは不要でした。

## Gradleの改善点

Kotlin 2.0.0はGradle 6.8.3から8.5まで完全に互換性があります。最新のGradleバージョンまで使用することもできますが、その場合、非推奨警告に遭遇したり、一部の新しいGradle機能が動作しない可能性があることに留意してください。

このバージョンには、以下の変更が含まれています。

*   [マルチプラットフォームプロジェクトにおけるコンパイラオプションの新しいGradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [新しいComposeコンパイラGradleプラグイン](#new-compose-compiler-gradle-plugin)
*   [JVMおよびAndroid公開ライブラリを区別するための新しい属性](#new-attribute-to-distinguish-jvm-and-android-published-libraries)
*   [Kotlin/NativeにおけるCInteropProcessのGradle依存関係処理の改善](#improved-gradle-dependency-handling-for-cinteropprocess-in-kotlin-native)
*   [Gradleにおける可視性の変更](#visibility-changes-in-gradle)
*   [GradleプロジェクトにおけるKotlinデータ用の新しいディレクトリ](#new-directory-for-kotlin-data-in-gradle-projects)
*   [Kotlin/Nativeコンパイラが必要なときにダウンロードされる](#kotlin-native-compiler-downloaded-when-needed)
*   [コンパイラオプション定義の旧方式の非推奨化](#deprecated-old-ways-of-defining-compiler-options)
*   [サポートされるAGPの最小バージョンを引き上げ](#bumped-minimum-supported-agp-version)
*   [最新の言語バージョンを試すための新しいGradleプロパティ](#new-gradle-property-for-trying-the-latest-language-version)
*   [ビルドレポートの新しいJSON出力形式](#new-json-output-format-for-build-reports)
*   [kapt設定がスーパー設定からアノテーションプロセッサを継承する](#kapt-configurations-inherit-annotation-processors-from-superconfigurations)
*   [Kotlin Gradleプラグインが非推奨のGradle規約を使用しなくなる](#kotlin-gradle-plugin-no-longer-uses-deprecated-gradle-conventions)

### マルチプラットフォームプロジェクトにおけるコンパイラオプションの新しいGradle DSL

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも廃止または変更される可能性があります。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 2.0.0以前は、Gradleでマルチプラットフォームプロジェクトのコンパイラオプションを設定できるのは、タスクごと、コンパイルごと、ソースセットごとといった低レベルのみでした。プロジェクト全体でコンパイラオプションをより一般的に設定しやすくするために、Kotlin 2.0.0には新しいGradle DSLが付属しています。

この新しいDSLを使用すると、すべてのターゲットと`commonMain`のような共有ソースセットの拡張レベルで、および特定のターゲットのターゲットレベルでコンパイラオプションを設定できます。

```kotlin
kotlin {
    compilerOptions {
        // すべてのターゲットおよび共有ソースセットのデフォルトとして使用される
        // 拡張レベルの共通コンパイラオプション
        allWarningsAsErrors.set(true)
    }
    jvm {
        compilerOptions {
            // このターゲットのすべてのコンパイルのデフォルトとして使用される
            // ターゲットレベルのJVMコンパイラオプション
            noJdk.set(true)
        }
    }
}
```

プロジェクト全体の構成は、現在3つのレイヤーで構成されています。最も高いのは拡張レベルで、次にターゲットレベル、そして最も低いのはコンパイル単位（通常はコンパイルタスク）です。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

上位レベルの設定は、下位レベルの規約（デフォルト）として使用されます。

*   拡張コンパイラオプションの値は、`commonMain`、`nativeMain`、`commonTest` などの共有ソースセットを含むターゲットコンパイラオプションのデフォルトです。
*   ターゲットコンパイラオプションの値は、たとえば `compileKotlinJvm` や `compileTestKotlinJvm` タスクなど、コンパイル単位（タスク）コンパイラオプションのデフォルトとして使用されます。

逆に、下位レベルで行われた設定は、上位レベルの関連設定をオーバーライドします。

*   タスクレベルのコンパイラオプションは、ターゲットレベルまたは拡張レベルの関連設定をオーバーライドします。
*   ターゲットレベルのコンパイラオプションは、拡張レベルの関連設定をオーバーライドします。

プロジェクトを設定する際には、コンパイラオプションを設定する一部の古い方法が[非推奨](#deprecated-old-ways-of-defining-compiler-options) になっていることに注意してください。

この新しいDSLをマルチプラットフォームプロジェクトで試していただき、[YouTrack](https://kotl.in/issue)でフィードバックをお寄せください。このDSLをコンパイラオプションを設定する推奨アプローチとする予定です。

### 新しいComposeコンパイラGradleプラグイン

コンポーザブルをKotlinコードに変換するJetpack Composeコンパイラが、Kotlinリポジトリにマージされました。これにより、Composeコンパイラが常にKotlinと同時にリリースされるため、ComposeプロジェクトのKotlin 2.0.0への移行が容易になります。これにより、Composeコンパイラのバージョンも2.0.0に上がります。

プロジェクトで新しいComposeコンパイラを使用するには、`build.gradle(.kts)`ファイルで`org.jetbrains.kotlin.plugin.compose` Gradleプラグインを適用し、そのバージョンをKotlin 2.0.0と同じに設定します。

この変更の詳細と移行手順については、[Composeコンパイラのドキュメント](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html) を参照してください。

### JVMおよびAndroid公開ライブラリを区別するための新しい属性

Kotlin 2.0.0以降、[`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) Gradle属性が、すべてのKotlinバリアントとともにデフォルトで公開されます。

この属性は、Kotlin MultiplatformライブラリのJVMバリアントとAndroidバリアントを区別するのに役立ちます。特定のライブラリバリアントが特定のJVM環境に適していることを示します。ターゲット環境は「android」、「standard-jvm」、または「no-jvm」になります。

この属性を公開することで、Javaのみのプロジェクトなど、マルチプラットフォームではないクライアントからも、JVMとAndroidターゲットを持つKotlin Multiplatformライブラリをより堅牢に利用できるようになるはずです。

必要に応じて、属性の公開を無効にすることができます。そのためには、`gradle.properties`ファイルに以下のGradleオプションを追加します。

```none
kotlin.publishJvmEnvironmentAttribute=false
```

### Kotlin/NativeにおけるCInteropProcessのGradle依存関係処理の改善

このリリースでは、Kotlin/NativeプロジェクトにおけるGradleタスクの依存関係管理を向上させるため、`defFile` プロパティの処理を強化しました。

このアップデート以前は、`defFile` プロパティが、まだ実行されていない別のタスクの出力として指定されている場合、Gradleビルドが失敗する可能性がありました。この問題の回避策は、このタスクへの依存関係を追加することでした。

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    defFileProperty.set(createDefFileTask.flatMap { it.defFile.asFile })
                    project.tasks.named(interopProcessingTaskName).configure {
                        dependsOn(createDefFileTask)
                    }
                }
            }
        }
    }
}
```

これを修正するために、`definitionFile`という新しい`RegularFileProperty`プロパティが追加されました。これで、Gradleはビルドプロセスの後半で接続されたタスクが実行された後に、`definitionFile`プロパティの存在を遅延的に検証します。この新しいアプローチにより、追加の依存関係は不要になります。

`CInteropProcess`タスクと`CInteropSettings`クラスは、`defFile`と`defFileProperty`の代わりに`definitionFile`プロパティを使用します。

<tabs group ="build-script">
<tab id="kotlin" title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>
<tab id="groovy" title="Groovy" group-key="groovy">

```groovy
kotlin {
    macosArm64("native") {
        compilations.main {
            cinterops {
                cinterop {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>
</tabs>

> `defFile` と `defFileProperty` パラメータは非推奨になりました。
>
{style="warning"}

### Gradleにおける可視性の変更

> この変更はKotlin DSLユーザーにのみ影響します。
>
{style="note"}

Kotlin 2.0.0 では、ビルドスクリプトの制御と安全性を向上させるために、Kotlin Gradle Plugin を変更しました。以前は、特定の DSL コンテキスト向けに意図された Kotlin DSL 関数とプロパティが、意図せず他の DSL コンテキストに漏洩していました。この漏洩は、誤ったコンパイラオプションの使用、設定の複数回適用、その他の設定ミスにつながる可能性がありました。

```kotlin
kotlin {
    // Target DSL は、
    // kotlin{} 拡張 DSL で定義されたメソッドやプロパティにアクセスできなかった
    jvm {
        // Compilation DSL は、
        // kotlin{} 拡張 DSL や Kotlin jvm{} ターゲット DSL で定義された
        // メソッドやプロパティにアクセスできなかった
        compilations.configureEach {
            // Compilation task DSL は、
            // kotlin{} 拡張、Kotlin jvm{} ターゲット、
            // または Kotlin compilation DSL で定義された
            // メソッドやプロパティにアクセスできなかった
            compileTaskProvider.configure {
                // 例：
                explicitApi()
                // ERROR (kotlin{} 拡張 DSL で定義されているため)
                mavenPublication {}
                // ERROR (Kotlin jvm{} ターゲット DSL で定義されているため)
                defaultSourceSet {}
                // ERROR (Kotlin compilation DSL で定義されているため)
            }
        }
    }
}
```

この問題を修正するために、`@KotlinGradlePluginDsl` アノテーションが追加され、Kotlin GradleプラグインのDSL関数とプロパティが、意図されていないレベルに公開されるのを防ぐようになりました。以下のレベルは互いに分離されています。

*   Kotlin拡張
*   Kotlinターゲット
*   Kotlinコンパイル
*   Kotlinコンパイルタスク

最も一般的なケースについては、ビルドスクリプトが誤って設定されている場合に、修正方法の提案を含むコンパイラの警告を追加しました。例：

```kotlin
kotlin {
    jvm {
        sourceSets.getByName("jvmMain").dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.7.3")
        }
    }
}
```

この場合、`sourceSets` の警告メッセージは次のようになります。

```none
[DEPRECATION] 'sourceSets: NamedDomainObjectContainer<KotlinSourceSet>' is deprecated.Accessing 'sourceSets' container on the Kotlin target level DSL is deprecated. Consider configuring 'sourceSets' on the Kotlin extension level.
```

この変更に関するフィードバックをお待ちしております！[#gradle Slackチャンネル](https://kotlinlang.slack.com/archives/C19FD9681) でKotlin開発者に直接コメントを共有してください。[Slack招待状を入手する](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。

### GradleプロジェクトにおけるKotlinデータ用の新しいディレクトリ

> `.kotlin` ディレクトリをバージョン管理にコミットしないでください。
> たとえば、Gitを使用している場合、プロジェクトの `.gitignore` ファイルに `.kotlin` を追加してください。
>
{style="warning"}

Kotlin 1.8.20 では、Kotlin Gradle プラグインがデータを Gradle プロジェクトキャッシュディレクトリ（`<project-root-directory>/.gradle/kotlin`）に保存するように切り替わりました。しかし、`.gradle` ディレクトリは Gradle 専用であり、結果として将来にわたって保証されるものではありません。

これを解決するため、Kotlin 2.0.0 以降、Kotlin データはデフォルトで `<project-root-directory>/.kotlin` に保存されるようになります。
後方互換性のため、一部のデータは引き続き `.gradle/kotlin` ディレクトリに保存されます。

設定可能な新しいGradleプロパティは以下の通りです。

| Gradle プロパティ                                     | 説明                                                                                                        |
|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | プロジェクトレベルのデータが保存される場所を設定します。デフォルト: `<project-root-directory>/.kotlin`       |
| `kotlin.project.persistent.dir.gradle.disableWrite` | `.gradle` ディレクトリへのKotlinデータの書き込みを無効にするかどうかを制御するブール値。デフォルト: `false` |

これらのプロパティをプロジェクトの `gradle.properties` ファイルに追加すると、有効になります。

### Kotlin/Nativeコンパイラが必要なときにダウンロードされる

Kotlin 2.0.0以前は、マルチプラットフォームプロジェクトのGradleビルドスクリプトに[Kotlin/Nativeターゲット](native-target-support.md)が設定されている場合、Gradleは常に[設定フェーズ](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:configuration)でKotlin/Nativeコンパイラをダウンロードしていました。

これは、[実行フェーズ](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)で実行されるべきKotlin/Nativeターゲットのコードをコンパイルするタスクがなくても発生していました。このようにKotlin/Nativeコンパイラをダウンロードする方法は、CIプロセスの一部としてKotlinプロジェクトのテストやチェックを実行したいだけのユーザーにとっては特に非効率的でした。

Kotlin 2.0.0では、Kotlin Gradleプラグインのこの動作を変更し、Kotlin/Nativeコンパイラが[実行フェーズ](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)で、**かつ** Kotlin/Nativeターゲットのコンパイルが要求された場合に**のみ**ダウンロードされるようにしました。

その結果、Kotlin/Nativeコンパイラの依存関係も、コンパイラの一部としてではなく、実行フェーズでダウンロードされるようになりました。

新しい動作で問題が発生した場合は、`gradle.properties`ファイルに以下のGradleプロパティを追加することで、一時的に以前の動作に戻すことができます。

```none
kotlin.native.toolchain.enabled=false
```

Kotlin 1.9.20-Beta以降、Kotlin/NativeディストリビューションはCDNとともに[Maven Central](https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/)にも公開されています。

これにより、KotlinがL必要なアーティファクトを探してダウンロードする方法が変更されました。デフォルトでは、CDNの代わりに、プロジェクトの`repositories {}`ブロックで指定したMavenリポジトリを使用するようになりました。

`gradle.properties`ファイルに以下のGradleプロパティを設定することで、一時的にこの動作を元に戻すことができます。

```none
kotlin.native.distribution.downloadFromMaven=false
```

問題があれば、[課題トラッカー (YouTrack)](https://kotl.in/issue) まで報告してください。これらのデフォルト動作を変更する両方のGradleプロパティは一時的なものであり、将来のリリースで削除される予定です。

### コンパイラオプション定義の旧方式の非推奨化

今回のリリースでは、コンパイラオプションの設定方法をさらに洗練しています。これにより、さまざまな方法間のあいまいさを解消し、プロジェクト構成をよりシンプルにすることができます。

Kotlin 2.0.0以降、コンパイラオプションを指定する以下のDSLは非推奨となりました。

*   すべてのKotlinコンパイルタスクを実装する `KotlinCompile` インターフェースの `kotlinOptions` DSL。代わりに `KotlinCompilationTask<CompilerOptions>` を使用してください。
*   `KotlinCompilation` インターフェースの `HasCompilerOptions` 型を持つ `compilerOptions` プロパティ。このDSLは他のDSLと一貫性がなく、`KotlinCompilation.compileTaskProvider` コンパイルタスク内の `compilerOptions` と同じ `KotlinCommonCompilerOptions` オブジェクトを設定するため、混乱を招いていました。

    代わりに、Kotlinコンパイルタスクの `compilerOptions` プロパティを使用することをお勧めします。

    ```kotlin
    kotlinCompilation.compileTaskProvider.configure {
        compilerOptions { ... }
    }
    ```

    例：

    ```kotlin
    kotlin {
        js(IR) {
            compilations.all {
                compileTaskProvider.configure {
                    compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
                }
            }
        }
    }
    ```

*   `KotlinCompilation` インターフェースの `kotlinOptions` DSL。
*   `KotlinNativeArtifactConfig` インターフェース、`KotlinNativeLink` クラス、および `KotlinNativeLinkArtifactTask` クラスの `kotlinOptions` DSL。代わりに `toolOptions` DSL を使用してください。
*   `KotlinJsDce` インターフェースの `dceOptions` DSL。代わりに `toolOptions` DSL を使用してください。

Kotlin Gradleプラグインでのコンパイラオプションの指定方法の詳細については、[オプションの定義方法](gradle-compiler-options.md#how-to-define-options) を参照してください。

### サポートされるAGPの最小バージョンを引き上げ

Kotlin 2.0.0以降、サポートされるAndroid Gradleプラグインの最小バージョンは7.1.3です。

### 最新の言語バージョンを試すための新しいGradleプロパティ

Kotlin 2.0.0以前は、新しいK2コンパイラを試すために `kotlin.experimental.tryK2` というGradleプロパティがありました。Kotlin 2.0.0でK2コンパイラがデフォルトで有効になったため、このプロパティを新しい形式に進化させ、プロジェクトで最新の言語バージョンを試すために使用できるようになりました。それが `kotlin.experimental.tryNext` です。このプロパティを `gradle.properties` ファイルで使用すると、Kotlin Gradleプラグインは言語バージョンを、Kotlinバージョンのデフォルト値よりも1つ高くインクリメントします。例えば、Kotlin 2.0.0ではデフォルトの言語バージョンは2.0なので、このプロパティは言語バージョン2.1を設定します。

この新しいGradleプロパティは、以前の`kotlin.experimental.tryK2`と同様の指標を[ビルドレポート](gradle-compilation-and-caches.md#build-reports)で生成します。設定された言語バージョンが出力に含まれます。例：

```none
##### 'kotlin.experimental.tryNext' results #####
:app:compileKotlin: 2.1 language version
:lib:compileKotlin: 2.1 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.1 #####
```

ビルドレポートを有効にする方法とその内容の詳細については、[ビルドレポート](gradle-compilation-and-caches.md#build-reports) を参照してください。

### ビルドレポートの新しいJSON出力形式

Kotlin 1.7.0では、コンパイラパフォーマンスを追跡するのに役立つビルドレポートを導入しました。時が経つにつれて、これらのレポートをより詳細でパフォーマンス問題の調査に役立つように、さらに多くの指標を追加してきました。以前は、ローカルファイルの出力形式は `*.txt` 形式のみでした。Kotlin 2.0.0では、他のツールを使用して分析をさらに容易にするために、JSON出力形式をサポートしています。

ビルドレポートのJSON出力形式を設定するには、`gradle.properties` ファイルに以下のプロパティを宣言します。

```none
kotlin.build.report.output=json

// ビルドレポートを保存するディレクトリ
kotlin.build.report.json.directory=my/directory/path
```

または、次のコマンドを実行することもできます。

```shell
./gradlew assemble -Pkotlin.build.report.output=json -Pkotlin.build.report.json.directory="my/directory/path"
```

設定が完了すると、Gradleは指定したディレクトリに `${project_name}-date-time-<sequence_number>.json` という名前でビルドレポートを生成します。

以下は、ビルドメトリクスと集計メトリクスを含むJSON出力形式のビルドレポートの例です。

```json
"buildOperationRecord": [
    {
     "path": ":lib:compileKotlin",
      "classFqName": "org.jetbrains.kotlin.gradle.tasks.KotlinCompile_Decorated",
      "startTimeMs": 1714730820601,
      "totalTimeMs": 2724,
      "buildMetrics": {
        "buildTimes": {
          "buildTimesNs": {
            "CLEAR_OUTPUT": 713417,
            "SHRINK_AND_SAVE_CURRENT_CLASSPATH_SNAPSHOT_AFTER_COMPILATION": 19699333,
            "IR_TRANSLATION": 281000000,
            "NON_INCREMENTAL_LOAD_CURRENT_CLASSPATH_SNAPSHOT": 14088042,
            "CALCULATE_OUTPUT_SIZE": 1301500,
            "GRADLE_TASK": 2724000000,
            "COMPILER_INITIALIZATION": 263000000,
            "IR_GENERATION": 74000000,
...
          }
        }
...
 "aggregatedMetrics": {
    "buildTimes": {
      "buildTimesNs": {
        "CLEAR_OUTPUT": 782667,
        "SHRINK_AND_SAVE_CURRENT_CLASSPATH_SNAPSHOT_AFTER_COMPILATION": 22031833,
        "IR_TRANSLATION": 333000000,
        "NON_INCREMENTAL_LOAD_CURRENT_CLASSPATH_SNAPSHOT": 14890292,
        "CALCULATE_OUTPUT_SIZE": 2370750,
        "GRADLE_TASK": 3234000000,
        "COMPILER_INITIALIZATION": 292000000,
        "IR_GENERATION": 89000000,
...
      }
    }
```

### kapt設定がスーパー設定からアノテーションプロセッサを継承する

Kotlin 2.0.0以前は、アノテーションプロセッサの共通セットを個別のGradle設定で定義し、サブプロジェクトのkapt固有の設定でこの設定を拡張しようとすると、kaptはアノテーションプロセッサを見つけられないためアノテーション処理をスキップしていました。Kotlin 2.0.0では、kaptはアノテーションプロセッサへの間接的な依存関係が間接的に存在することを正常に検出できます。

例として、[Dagger](https://dagger.dev/) を使用するサブプロジェクトの場合、`build.gradle(.kts)` ファイルで次の設定を使用します。

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

この例では、`commonAnnotationProcessors` Gradle 設定は、すべてのプロジェクトで使用したい共通のアノテーション処理設定です。[`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) メソッドを使用して、`commonAnnotationProcessors` をスーパー設定として追加します。kaptは、`commonAnnotationProcessors` Gradle 設定がDaggerアノテーションプロセッサに依存していることを認識します。したがって、kaptはDaggerアノテーションプロセッサをアノテーション処理の設定に含めます。

[実装](https://github.com/JetBrains/kotlin/pull/5198) を提供してくれたChristoph Loyに感謝します！

### Kotlin Gradleプラグインが非推奨のGradle規約を使用しなくなる

Kotlin 2.0.0以前は、Gradle 8.2以降を使用している場合、Kotlin GradleプラグインはGradle 8.2で非推奨となったGradle規約を誤って使用していました。これにより、Gradleはビルドの非推奨警告を報告していました。Kotlin 2.0.0では、Kotlin Gradleプラグインが更新され、Gradle 8.2以降を使用してもこれらの非推奨警告をトリガーしなくなりました。

## 標準ライブラリ

このリリースでは、Kotlin標準ライブラリのさらなる安定化が図られ、既存の関数がすべてのプラットフォームで共通化されました。

*   [enum class の `values` ジェネリック関数の安定版置換](#stable-replacement-of-the-enum-class-values-generic-function)
*   [AutoCloseable インターフェースの安定版](#stable-autocloseable-interface)
*   [共通の protected プロパティ AbstractMutableList.modCount](#common-protected-property-abstractmutablelist-modcount)
*   [共通の protected 関数 AbstractMutableList.removeRange](#common-protected-function-abstractmutablelist-removerange)
*   [共通の String.toCharArray(destination) 関数](#common-string-tochararray-destination-function)

### enum class の `values` ジェネリック関数の安定版置換

Kotlin 2.0.0では、`enumEntries<T>()` 関数が[Stable](components-stability.md#stability-levels-explained)になります。
`enumEntries<T>()` 関数は、ジェネリックな `enumValues<T>()` 関数の代替です。新しい関数は、指定されたenum型 `T` のすべてのenumエントリのリストを返します。enumクラスの `entries` プロパティは以前に導入され、合成関数 `values()` を置き換えるために安定化されました。`entries` プロパティの詳細については、[Kotlin 1.8.20の新機能](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function) を参照してください。

> `enumValues<T>()` 関数はまだサポートされていますが、パフォーマンスへの影響が少ないため、`enumEntries<T>()` 関数を使用することをお勧めします。`enumValues<T>()` を呼び出すたびに新しい配列が作成されますが、`enumEntries<T>()` を呼び出すたびに同じリストが返されるため、はるかに効率的です。
>
{style="tip"}

例：

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// RED, GREEN, BLUE
```

### AutoCloseable インターフェースの安定版

Kotlin 2.0.0 では、共通の [`AutoCloseable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/)
インターフェースが[Stable](components-stability.md#stability-levels-explained) になりました。これにより、リソースを簡単に閉じることができ、いくつかの便利な関数が含まれています。

*   `use()` 拡張関数：選択したリソースに対して指定されたブロック関数を実行し、例外がスローされるかどうかにかかわらず、正しく閉じます。
*   `AutoCloseable()` コンストラクタ関数：`AutoCloseable` インターフェースのインスタンスを作成します。

以下の例では、`XMLWriter` インターフェースを定義し、それを実装するリソースがあることを想定しています。
たとえば、このリソースは、ファイルを開き、XMLコンテンツを書き込み、その後ファイルを閉じるクラスである可能性があります。

```kotlin
interface XMLWriter {
    fun document(encoding: String, version: String, content: XMLWriter.() -> Unit)
    fun element(name: String, content: XMLWriter.() -> Unit)
    fun attribute(name: String, value: String)
    fun text(value: String)

    fun flushAndClose()
}

fun writeBooksTo(writer: XMLWriter) {
    val autoCloseable = AutoCloseable { writer.flushAndClose() }
    autoCloseable.use {
        writer.document(encoding = "UTF-8", version = "1.0") {
            element("bookstore") {
                element("book") {
                    attribute("category", "fiction")
                    element("title") { text("Harry Potter and the Prisoner of Azkaban") }
                    element("author") { text("J. K. Rowling") }
                    element("year") { text("1999") }
                    element("price") { text("29.99") }
                }
                element("book") {
                    attribute("category", "programming")
                    element("title") { text("Kotlin in Action") }
                    element("author") { text("Dmitry Jemerov") }
                    element("author") { text("Svetlana Isakova") }
                    element("year") { text("2017") }
                    element("price") { text("25.19") }
                }
            }
        }
    }
}
```

### 共通の protected プロパティ AbstractMutableList.modCount

今回のリリースでは、`AbstractMutableList` インターフェースの [`modCount`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/mod-count.html) `protected`プロパティが共通化されました。以前は、`modCount` プロパティは各プラットフォームで利用可能でしたが、共通ターゲットでは利用できませんでした。これで、`AbstractMutableList` のカスタム実装を作成し、共通コードでこのプロパティにアクセスできるようになりました。

このプロパティは、コレクションに対して行われた構造変更の数を追跡します。これには、コレクションのサイズを変更する操作や、進行中のイテレーションが誤った結果を返す可能性がある方法でリストを変更する操作が含まれます。

カスタムリストを実装する際に、`modCount` プロパティを使用して、並行変更を登録および検出できます。

### 共通の protected 関数 AbstractMutableList.removeRange

今回のリリースでは、`AbstractMutableList` インターフェースの [`removeRange()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/remove-range.html) `protected`関数が共通化されました。以前は、各プラットフォームで利用可能でしたが、共通ターゲットでは利用できませんでした。これで、`AbstractMutableList` のカスタム実装を作成し、共通コードでこの関数をオーバーライドできるようになりました。

この関数は、指定された範囲に従ってこのリストから要素を削除します。この関数をオーバーライドすることで、カスタム実装を利用し、リスト操作のパフォーマンスを向上させることができます。

### 共通の String.toCharArray(destination) 関数

今回のリリースでは、共通の [`String.toCharArray(destination)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 関数が導入されました。以前は、JVMでのみ利用可能でした。

既存の [`String.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 関数と比較してみましょう。こちらは、指定された文字列の文字を含む新しい `CharArray` を作成します。一方、新しい共通の `String.toCharArray(destination)` 関数は、`String` の文字を既存の `CharArray` に移動します。これは、すでに埋めたいバッファがある場合に便利です。

```kotlin
fun main() {
    val myString = "Kotlin is awesome!"
    val destinationArray = CharArray(myString.length)

    // 文字列を変換し、destinationArray に格納する:
    myString.toCharArray(destinationArray)

    for (char in destinationArray) {
        print("$char ")
        // K o t l i n   i s   a w e s o m e ! 
    }
}
```
{kotlin-runnable="true"}

## Kotlin 2.0.0 をインストールする

IntelliJ IDEA 2023.3およびAndroid Studio Iguana (2023.2.1) Canary 15以降、KotlinプラグインはIDEにバンドルされたプラグインとして配布されています。これは、JetBrains Marketplaceからプラグインをインストールできなくなったことを意味します。

新しいKotlinバージョンに更新するには、ビルドスクリプトで[Kotlinのバージョンを2.0.0に変更します](releases.md#update-to-a-new-kotlin-version)。