---
title: "Kotlin 2.0.0の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[公開日: 2024年5月21日](releases#release-details)_

Kotlin 2.0.0 がリリースされ、[新しい Kotlin K2 コンパイラー](#kotlin-k2-compiler)が Stable になりました! さらに、その他のハイライトを以下に示します。

* [新しい Compose コンパイラー Gradle プラグイン](#new-compose-compiler-gradle-plugin)
* [`invokedynamic` を使用したラムダ関数の生成](#generation-of-lambda-functions-using-invokedynamic)
* [kotlinx-metadata-jvm ライブラリが Stable に](#the-kotlinx-metadata-jvm-library-is-stable)
* [Apple プラットフォームでのサインポストを使用した Kotlin/Native での GC パフォーマンスの監視](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [Objective-C メソッドを使用した Kotlin/Native での競合の解決](#resolving-conflicts-with-objective-c-methods)
* [Kotlin/Wasm での名前付きエクスポートのサポート](#support-for-named-export)
* [Kotlin/Wasm の @JsExport を持つ関数での符号なしプリミティブ型のサポート](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
* [Binaryen を使用したデフォルトでの本番ビルドの最適化](#optimized-production-builds-by-default-using-binaryen)
* [マルチプラットフォームプロジェクトでのコンパイラーオプション用の新しい Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
* [enum class values ジェネリック関数の安定版への置き換え](#stable-replacement-of-the-enum-class-values-generic-function)
* [安定版の AutoCloseable インターフェース](#stable-autocloseable-interface)

Kotlin 2.0 は、JetBrains チームにとって大きな節目です。このリリースは KotlinConf 2024 の中心となりました。
オープニングキーノートをご覧ください。KotlinConf 2024 では、エキサイティングな最新情報が発表され、Kotlin 言語に関する最近の取り組みが説明されました。

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDE サポート

Kotlin 2.0.0 をサポートする Kotlin プラグインは、最新の IntelliJ IDEA と Android Studio にバンドルされています。
IDE で Kotlin プラグインを更新する必要はありません。
ビルドスクリプトで Kotlin のバージョンを Kotlin 2.0.0 に[変更](releases#update-to-a-new-kotlin-version)するだけです。

* IntelliJ IDEA の Kotlin K2 コンパイラーのサポートの詳細については、[IDE でのサポート](#support-in-ides)を参照してください。
* IntelliJ IDEA の Kotlin のサポートの詳細については、[Kotlin リリース](releases#ide-support)を参照してください。

## Kotlin K2 コンパイラー

K2 コンパイラーへの道のりは長いものでしたが、JetBrains チームはついにその安定化を発表する準備ができました。
Kotlin 2.0.0 では、新しい Kotlin K2 コンパイラーがデフォルトで使用され、すべてのターゲットプラットフォーム（JVM、Native、Wasm、JS）で [Stable](components-stability) です。
新しいコンパイラーは、パフォーマンスを大幅に向上させ、新しい言語機能の開発を迅速化し、Kotlin がサポートするすべてのプラットフォームを統合し、マルチプラットフォームプロジェクトのより良いアーキテクチャを提供します。

JetBrains チームは、選択されたユーザープロジェクトと社内プロジェクトから 1,000 万行のコードをコンパイルすることに成功し、新しいコンパイラーの品質を保証しました。
18,000 人の開発者が安定化プロセスに参加し、合計 80,000 のプロジェクトで新しい K2 コンパイラーをテストし、発見された問題を報告しました。

新しいコンパイラーへの移行プロセスをできるだけスムーズにするために、[K2 コンパイラー移行ガイド](k2-compiler-migration-guide)を作成しました。
このガイドでは、コンパイラーの多くの利点、発生する可能性のある変更点、および必要に応じて以前のバージョンにロールバックする方法について説明します。

[ブログ記事](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)では、さまざまなプロジェクトでの K2 コンパイラーのパフォーマンスについて説明しました。
K2 コンパイラーのパフォーマンスに関する実際のデータを確認し、自分のプロジェクトからパフォーマンスベンチマークを収集する方法に関する説明を見つけたい場合は、確認してください。

また、KotlinConf 2024 のこの講演もご覧ください。言語設計の責任者である Michail Zarečenskij が、Kotlin の機能の進化と K2 コンパイラーについて説明しています。

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 現在の K2 コンパイラーの制限事項

Gradle プロジェクトで K2 を有効にすると、Gradle のバージョンが 8.3 未満のプロジェクトに影響を与える可能性のある特定の制限事項があります。
次のケースでは、

* `buildSrc` からのソースコードのコンパイル。
* インクルードされたビルドでの Gradle プラグインのコンパイル。
* Gradle のバージョンが 8.3 未満のプロジェクトで使用されている場合の他の Gradle プラグインのコンパイル。
* Gradle プラグインの依存関係のビルド。

上記のいずれかの問題が発生した場合は、次の手順を実行して対処できます。

* `buildSrc`、Gradle プラグイン、およびそれらの依存関係の言語バージョンを設定します。

  ```kotlin
  kotlin {
      compilerOptions {
          languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
          apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
      }
  }
  ```

  > 特定のタスクの言語バージョンと API バージョンを構成すると、これらの値は `compilerOptions` 拡張機能によって設定された値を上書きします。
  > この場合、言語バージョンと API バージョンは 1.9 を超えないようにする必要があります。
  >
  

* プロジェクトの Gradle バージョンを 8.3 以降に更新します。

### スマートキャストの改善

Kotlin コンパイラーは、特定のケースでオブジェクトを自動的に型にキャストできるため、明示的にキャストする必要がありません。
これは[スマートキャスト](typecasts#smart-casts)と呼ばれます。
Kotlin K2 コンパイラーは、以前よりもさらに多くのシナリオでスマートキャストを実行できるようになりました。

Kotlin 2.0.0 では、次の領域でのスマートキャストに関連する改善が行われました。

* [ローカル変数とそれ以降のスコープ](#local-variables-and-further-scopes)
* [論理 `or` 演算子を使用した型チェック](#type-checks-with-logical-or-operator)
* [インライン関数](#inline-functions)
* [関数型を持つプロパティ](#properties-with-function-types)
* [例外処理](#exception-handling)
* [インクリメントおよびデクリメント演算子](#increment-and-decrement-operators)

#### ローカル変数とそれ以降のスコープ

以前は、`if` 条件内で変数が `null` ではないと評価された場合、変数はスマートキャストされました。
次に、この変数に関する情報は、`if` ブロックのスコープ内でさらに共有されます。

ただし、`if` 条件の**外側**で変数を宣言した場合、変数に関する情報は `if` 条件内では利用できなくなるため、スマートキャストできませんでした。
この動作は、`when` 式と `while` ループでも見られました。

Kotlin 2.0.0 以降では、`if`、`when`、または `while` 条件で使用する前に変数を宣言した場合、コンパイラーによって収集された変数に関する情報は、スマートキャストに対応するブロックでアクセスできるようになります。

これは、ブール条件を変数に抽出するなどの場合に役立ちます。
次に、変数に意味のある名前を付けることができ、コードの可読性が向上し、後でコードで変数を再利用できるようになります。
例:

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // Kotlin 2.0.0 では、コンパイラーは isCat に関する
        // 情報にアクセスできるため、animal が Cat 型に
        // スマートキャストされたことを認識しています。
        // したがって、purr() 関数を呼び出すことができます。
        // Kotlin 1.9.20 では、コンパイラーはスマートキャストを
        // 認識していないため、purr() 関数を呼び出すと
        // エラーが発生します。
        animal.purr()
    }
}

fun main() {
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```

#### 論理 or 演算子を使用した型チェック

Kotlin 2.0.0 では、オブジェクトの型チェックを `or` 演算子 (`||`) と組み合わせると、スマートキャストが最も近い共通のスーパータイプに対して行われます。
この変更前は、スマートキャストは常に `Any` 型に対して行われていました。

この場合でも、プロパティにアクセスしたり、関数を呼び出したりする前に、オブジェクト型を手動で確認する必要がありました。
例:

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus は共通のスーパータイプ Status にスマートキャストされます
        signalStatus.signal()
        // Kotlin 2.0.0 より前では、signalStatus は Any 型にスマートキャストされるため、signal() 関数を呼び出すと
        // 未解決の参照エラーが発生しました。signal() 関数は、別の型チェック後にのみ
        // 正常に呼び出すことができます。

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

:::note
共通のスーパータイプは、**和集合型**の**近似**です。
[和集合型](https://en.wikipedia.org/wiki/Union_type)は Kotlin ではサポートされていません。

:::

#### インライン関数

Kotlin 2.0.0 では、K2 コンパイラーはインライン関数を異なる方法で扱い、他のコンパイラー分析と組み合わせて、スマートキャストが安全かどうかを判断できます。

具体的には、インライン関数は暗黙的な [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) コントラクトを持つものとして扱われるようになりました。
これは、インライン関数に渡されるラムダ関数がインプレースで呼び出されることを意味します。
ラムダ関数はインプレースで呼び出されるため、コンパイラーはラムダ関数が関数本体に含まれる変数への参照をリークできないことを認識しています。

コンパイラーは、この知識を他のコンパイラー分析とともに使用して、キャプチャされた変数をスマートキャストすることが安全かどうかを判断します。
例:

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () `->` Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // Kotlin 2.0.0 では、コンパイラーは processor が
        // ローカル変数であり、inlineAction() がインライン関数であることを認識しているため、
        // processor への参照をリークできません。したがって、
        // processor をスマートキャストしても安全です。

        // processor が null でない場合、processor はスマートキャストされます
        if (processor != null) {
            // コンパイラーは processor が null ではないことを認識しているため、安全な呼び出しは必要ありません
            processor.process()

            // Kotlin 1.9.20 では、安全な呼び出しを実行する必要があります。
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 関数型を持つプロパティ

以前のバージョンの Kotlin では、関数型を持つクラスプロパティがスマートキャストされなかったことを意味するバグがありました。
この動作は Kotlin 2.0.0 および K2 コンパイラーで修正しました。例:

```kotlin
class Holder(val provider: (() `->` Unit)?) {
    fun process() {
        // Kotlin 2.0.0 では、provider が null でない場合、
        // provider はスマートキャストされます
        if (provider != null) {
            // コンパイラーは provider が null ではないことを認識しています
            provider()

            // 1.9.20 では、コンパイラーは provider が null ではないことを
            // 認識していないため、エラーが発生します。
            // Reference has a nullable type '(() `->` Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

この変更は、`invoke` 演算子をオーバーロードする場合にも適用されます。例:

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () `->` String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // 1.9.20 では、コンパイラーはエラーをトリガーします。
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 例外処理

Kotlin 2.0.0 では、例外処理が改善され、スマートキャスト情報を `catch` および `finally` ブロックに渡すことができるようになりました。
この変更により、オブジェクトに nullable 型があるかどうかをコンパイラーが追跡するため、コードがより安全になります。例:

```kotlin

fun testString() {
    var stringInput: String? = null
    // stringInput は String 型にスマートキャストされます
    stringInput = ""
    try {
        // コンパイラーは stringInput が null ではないことを認識しています
        println(stringInput.length)
        // 0

        // コンパイラーは stringInput の以前のスマートキャスト情報を拒否します。
        // 現在、stringInput は String? 型です。
        stringInput = null

        // 例外をトリガーします
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // Kotlin 2.0.0 では、コンパイラーは stringInput が
        // null になる可能性があることを認識しているため、stringInput は nullable のままです。
        println(stringInput?.length)
        // null

        // Kotlin 1.9.20 では、コンパイラーは安全な呼び出しは必要ないと
        // 言いますが、これは正しくありません。
    }
}

fun main() {
    testString()
}
```

#### インクリメントおよびデクリメント演算子

Kotlin 2.0.0 より前は、コンパイラーはインクリメントまたはデクリメント演算子を使用した後にオブジェクトの型が変更される可能性があることを理解していませんでした。
コンパイラーがオブジェクト型を正確に追跡できなかったため、コードが未解決の参照エラーにつながる可能性がありました。
Kotlin 2.0.0 では、これが修正されました。

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

    // unknownObject が Tau インターフェースから継承されているかどうかを確認します
    // 注: unknownObject が Rho インターフェースと Tau インターフェースの両方から継承されている可能性があります
    if (unknownObject is Tau) {

        // インターフェース Rho からオーバーロードされた inc() 演算子を使用します
        // Kotlin 2.0.0 では、unknownObject の型は Sigma にスマートキャストされます
        ++unknownObject

        // Kotlin 2.0.0 では、コンパイラーは unknownObject が Sigma 型であることを認識しているため、sigma() 関数を正常に呼び出すことができます
        unknownObject.sigma()

        // Kotlin 1.9.20 では、inc() が呼び出されたときにコンパイラーはスマートキャストを実行しないため、
        // コンパイラーは unknownObject が Tau 型であると考えています。sigma() 関数を呼び出すと、コンパイル時のエラーが発生します

        // Kotlin 2.0.0 では、コンパイラーは unknownObject が Sigma 型であることを認識しているため、tau() 関数を呼び出すと、コンパイル時のエラーが発生します
        unknownObject.tau()
        // 未解決の参照 'tau'

        // Kotlin 1.9.20 では、コンパイラーは誤って unknownObject が Tau 型であると考えているため、tau() 関数を呼び出すことができますが、
        // ClassCastException がスローされます
    }
}
```

### Kotlin マルチプラットフォームの改善

Kotlin 2.0.0 では、Kotlin マルチプラットフォームに関連する K2 コンパイラーで次の領域が改善されました。

* [コンパイル中の共通ソースとプラットフォームソースの分離](#separation-of-common-and-platform-sources-during-compilation)
* [expected 宣言と actual 宣言の異なる可視性レベル](#different-visibility-levels-of-expected-and-actual-declarations)

#### コンパイル中の共通ソースとプラットフォームソースの分離

以前は、Kotlin コンパイラーの設計により、コンパイル時に共通ソースセットとプラットフォームソースセットを分離できませんでした。
その結果、共通コードがプラットフォームコードにアクセスできるため、プラットフォーム間で異なる動作が発生していました。
さらに、共通コードからの一部のコンパイラー設定と依存関係がプラットフォームコードにリークしていました。

Kotlin 2.0.0 では、新しい Kotlin K2 コンパイラーの実装に、共通ソースセットとプラットフォームソースセット間の厳密な分離を保証するためのコンパイルスキームの再設計が含まれています。
この変更は、[expected 関数と actual 関数](multiplatform-expect-actual#expected-and-actual-functions)を使用する場合に最も顕著になります。
以前は、共通コード内の関数呼び出しがプラットフォームコード内の関数に解決される可能性がありました。例:
<table>
<tr>
<td>
共通コード
</td>
<td>
プラットフォームコード
</td>
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
// JavaScript プラットフォームには foo() 関数オーバーロードはありません
// on the JavaScript platform
```
</td>
</tr>
</table>

この例では、共通コードは実行されるプラットフォームに応じて異なる動作をします。

* JVM プラットフォームでは、共通コードで `foo()` 関数を呼び出すと、プラットフォームコードからの `foo()` 関数が `platform foo` として呼び出されます。
* JavaScript プラットフォームでは、共通コードで `foo()` 関数を呼び出すと、プラットフォームコードでそのような関数が利用できないため、共通コードからの `foo()` 関数が `common foo` として呼び出されます。

Kotlin 2.0.0 では、共通コードはプラットフォームコードにアクセスできないため、両方のプラットフォームが `foo()` 関数を共通コードの `foo()` 関数に `common foo` として正常に解決します。

プラットフォーム間での動作の一貫性の向上に加えて、IntelliJ IDEA または Android Studio とコンパイラーの間で動作が競合するケースを修正するために懸命に取り組みました。たとえば、[expected クラスと actual クラス](multiplatform-expect-actual#expected-and-actual-classes)を使用した場合、次のようになります。
<table>
<tr>
<td>
共通コード
</td>
<td>
プラットフォームコード
</td>
</tr>
<tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 2.0.0 より前
    // IDE のみのエラーをトリガーします
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class
    // Identity にはデフォルトのコンストラクターがありません。
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

この例では、expected クラス `Identity` にはデフォルトのコンストラクターがないため、共通コードで正常に呼び出すことはできません。
以前は、エラーは IDE によってのみ報告されていましたが、コードは JVM 上で正常にコンパイルされていました。
ただし、コンパイラーは現在、エラーを正しく報告しています。

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解決動作が変わらない場合

まだ新しいコンパイルスキームへの移行の途中であるため、同じソースセット内にない関数を呼び出す場合の解決動作は以前と同じです。
この違いは、主に共通コードでマルチプラットフォームライブラリからオーバーロードを使用する場合に顕著になります。

2 つの異なるシグネチャを持つ `whichFun()` 関数があるライブラリがあるとします。

```kotlin
// サンプルライブラリ

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

共通コードで `whichFun()` 関数を呼び出す場合、ライブラリで最も関連性の高い引数の型を持つ関数が解決されます。

```kotlin
// JVM ターゲットのサンプルライブラリを使用するプロジェクト

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

比較すると、`whichFun()` のオーバーロードを同じソースセット内で宣言する場合、コードはプラットフォーム固有のバージョンにアクセスできないため、共通コードからの関数が解決されます。

```kotlin
// サンプルライブラリは使用されていません

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

マルチプラットフォームライブラリと同様に、`commonTest` モジュールは別のソースセットにあるため、プラットフォーム固有のコードにも引き続きアクセスできます。
したがって、`commonTest` モジュール内の関数への呼び出しの解決は、古いコンパイルスキームと同じ動作を示します。

将来的には、これらの残りのケースは新しいコンパイルスキームとの整合性が高まります。

#### expected 宣言と actual 宣言の異なる可視性レベル

Kotlin 2.0.0 より前は、Kotlin マルチプラットフォームプロジェクトで [expected 宣言と actual 宣言](multiplatform-expect-actual)を使用する場合、同じ [可視性レベル](visibility-modifiers)を持つ必要がありました。
Kotlin 2.0.0 は、actual 宣言が expected 宣言よりも**許可されている**場合に**のみ**、異なる可視性レベルもサポートするようになりました。例:

```kotlin
expect internal class Attribute // 可視性は internal です
actual class Attribute          // 可視性はデフォルトで public であり、
                                // これはより許可されています
```

同様に、actual 宣言で [型エイリアス](type-aliases)を使用している場合、**基になる型**の可視性は、expected 宣言と同じか、それ以上許可されている必要があります。例:

```kotlin
expect internal class Attribute                 // 可視性は internal です
internal actual typealias Attribute = Expanded

class Expanded                                  // 可視性はデフォルトで public であり、
                                                // これはより許可されています
```

### コンパイラープラグインのサポート

現在、Kotlin K2 コンパイラーは次の Kotlin コンパイラープラグインをサポートしています。

* [`all-open`](all-open-plugin)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
* [kapt](whatsnew1920#preview-kapt-compiler-plugin-with-k2)
* [Lombok](lombok)
* [`no-arg`](no-arg-plugin)
* [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
* [SAM with receiver](sam-with-receiver-plugin)
* [serialization](serialization)
* [Power-assert](power-assert)

さらに、Kotlin K2 コンパイラーは以下をサポートしています。

* [Jetpack Compose](https://developer.android.com/jetpack/compose) コンパイラープラグイン 2.0.0。これは、[Kotlin リポジトリに移動](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)されました。
* [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 以降の [Kotlin Symbol Processing (KSP) プラグイン](ksp-overview)。

:::note
他のコンパイラープラグインを使用する場合は、ドキュメントをチェックして、K2 と互換性があるかどうかを確認してください。

### 実験的な Kotlin Power-assert コンパイラープラグイン

Kotlin Power-assert プラグインは [Experimental](components-stability#stability-levels-explained) です。
これはいつでも変更される可能性があります。

Kotlin 2.0.0 では、実験的な Power-assert コンパイラープラグインが導入されています。このプラグインは、障害メッセージにコンテキスト情報を含めることで、テストの作成エクスペリエンスを向上させ、デバッグをより簡単かつ効率的にします。

開発者は、効果的なテストを作成するために、複雑なアサーションライブラリを使用する必要があることがよくあります。Power-assert プラグインは、アサーション式の中間値を含む障害メッセージを自動的に生成することで、このプロセスを簡素化します。これにより、開発者はテストが失敗した理由をすばやく理解できます。

テストでアサーションが失敗すると、改善されたエラーメッセージには、アサーション内のすべての変数とサブ式の値が表示され、条件のどの部分が失敗の原因であるかが明確になります。これは、複数の条件がチェックされる複雑なアサーションに特に役立ちます。

プロジェクトでプラグインを有効にするには、`build.gradle(.kts)` ファイルで構成します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}

powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue"]
}
```

</TabItem>
</Tabs>

[ドキュメント](power-assert)で Kotlin Power-assert プラグインの詳細をご覧ください。

### Kotlin K2 コンパイラーを有効にする方法

Kotlin 2.0.0 以降、Kotlin K2 コンパイラーはデフォルトで有効になっています。追加のアクションは必要ありません。

### Kotlin Playground で Kotlin K2 コンパイラーを試す

Kotlin Playground は 2.0.0 リリースをサポートしています。[確認してください!](https://pl.kotl.in/czuoQprce)

### IDE でのサポート

デフォルトでは、IntelliJ IDEA と Android Studio は、コード分析、コード補完、強調表示、およびその他の IDE 関連機能のために以前のコンパイラーを依然として使用しています。
IDE で Kotlin 2.0 の完全なエクスペリエンスを得るには、K2 モードを有効にします。

IDE で、**設定** | **言語とフレームワーク** | **Kotlin** に移動し、**K2 モードを有効にする** オプションを選択します。
IDE は、K2 モードを使用してコードを分析します。

<img src="/img/k2-mode.png" alt="Enable K2 mode" width="200" style={{verticalAlign: 'middle'}}/>

K2 モードを有効にすると、コンパイラーの動作の変更により、IDE 分析に違いが生じる可能性があります。
新しい K2 コンパイラーが以前のコンパイラーとどのように異なるかについては、[移行ガイド](k2-compiler-migration-guide)を参照してください。

* [ブログ](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)で K2 モードの詳細をご覧ください。
* K2 モードに関するフィードバックを積極的に収集していますので、[パブリック Slack チャンネル](https://kotlinlang.slack.com/archives/C0B8H786P)でご意見をお聞かせください。

### 新しい K2 コンパイラーに関するフィードバックをお寄せください

フィードバックをお待ちしております!

* 新しい K2 コンパイラーで直面した問題を [課題トラッカー](https://kotl.in/issue) で報告してください。
* [「使用状況統計を送信」オプションを有効にする](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) と、JetBrains が K2 の使用に関する匿名データを収集できるようになります。

## Kotlin/JVM

バージョン 2.0.0 以降、コンパイラーは Java 22 バイトコードを含むクラスを生成できます。
このバージョンでは、次の変更も行われています。

* [`invokedynamic` を使用したラムダ関数の生成](#generation-of-lambda-functions-using-invokedynamic)
* [kotlinx-metadata-jvm ライブラリが Stable に](#the-kotlinx-metadata-jvm-library-is-stable)

### `invokedynamic` を使用したラムダ関数の生成

Kotlin 2.0.0 では、`invokedynamic` を使用してラムダ関数を生成するための新しいデフォルトメソッドが導入されています。この変更により、従来のアノニマスクラス生成と比較して、アプリケーションのバイナリサイズが削減されます。

最初のバージョン以降、Kotlin はラムダをアノニマスクラスとして生成してきました。ただし、[Kotlin 1.5.0](whatsnew15#lambdas-via-invokedynamic) 以降、`-Xlambdas=indy` コンパイラーオプションを使用することで、`invokedynamic` 生成のオプションが利用可能になりました。
Kotlin 2.0.0 では、`invokedynamic` がラムダ生成のデフォルトメソッドになりました。このメソッドは、より軽量なバイナリを生成し、Kotlin を JVM 最適化に適合させ、アプリケーションが JVM パフォーマンスの継続的な将来の改善から確実にメリットを得られるようにします。

現在、通常のラムダコンパイルと比較して、3 つの制限事項があります。

* `invokedynamic` にコンパイルされたラムダはシリアル化できません。
* 実験的な [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API は、`invokedynamic` によって生成されたラムダをサポートしていません。
* このようなラムダで `.toString()` を呼び出すと、可読性の低い文字列表現が生成されます。

```kotlin
fun main() {
    println({})

    // Kotlin 1.9.24 およびリフレクションでは、次を返します
    // () `->` kotlin.Unit
    
    // Kotlin 2.0.0 では、次を返します
    // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
}
```

ラムダ関数を生成する従来の動作を保持するには、次のいずれかを実行できます。

* `@JvmSerializableLambda` で特定のラムダに注釈を付けます。
* コンパイラーオプション `-Xlambdas=class` を使用して、レガシーメソッドを使用してモジュールのすべてのラムダを生成します。

### kotlinx-metadata-jvm ライブラリが Stable に

Kotlin 2.0.0 では、`kotlinx-metadata-jvm` ライブラリが [Stable](components-stability#stability-levels-explained) になりました。ライブラリが `kotlin` パッケージと座標に変更されたため、`kotlin-metadata-jvm` (「x」なし) として見つけることができます。

以前は、`kotlinx-metadata-jvm` ライブラリには独自の公開スキームとバージョンがありました。今後、Kotlin 標準ライブラリと同じ下位互換性保証を備えた Kotlin リリースサイクルの一部として、`kotlin-metadata-jvm` の更新を構築および公開します。

`kotlin-metadata-jvm` ライブラリは、Kotlin/JVM コンパイラーによって生成されたバイナリファイルのメタデータを読み取りおよび変更するための API を提供します。

<!-- `kotlinx-metadata-jvm` ライブラリの詳細については、[ドキュメント](kotlin-metadata-jvm.md)を参照してください。 -->

## Kotlin/Native

このバージョンでは、次の変更が行われています。

* [サインポストを使用した GC パフォーマンスの監視](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [Objective-C メソッドを使用した競合の解決](#resolving-conflicts-with-objective-c-methods)
* [Kotlin/Native でのコンパイラー引数のログレベルの変更](#changed-log-level-for-compiler-arguments)
* [標準ライブラリとプラットフォームの依存関係を Kotlin/Native に明示的に追加](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
* [Gradle 構成キャッシュでのタスクエラー](#tasks-error-in-gradle-configuration-cache)

### Apple プラットフォームでのサインポストを使用した GC パフォーマンスの監視

以前は、ログを調べることで Kotlin/Native のガベージコレクター (GC) のパフォーマンスを監視することしかできませんでした。
ただし、これらのログは、iOS アプリのパフォーマンスに関する問題を調査するための一般的なツールキットである Xcode Instruments と統合されていませんでした。

Kotlin 2.0.0 以降、GC は Instruments で利用可能なサインポストで一時停止を報告します。サインポストを使用すると、アプリ内でカスタムロギングが可能になるため、iOS アプリのパフォーマンスをデバッグする際に、GC の一時停止がアプリケーションのフリーズに対応しているかどうかを確認できます。

GC パフォーマンス分析の詳細については、[ドキュメント](native-memory-manager#monitor-gc-performance)を参照してください。

### Objective-C メソッドを使用した競合の解決

Objective-C メソッドは、異なる名前を持つことができますが、同じ数と型のパラメーターを持つことができます。たとえば、[`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc) と [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/