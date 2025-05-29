[//]: # (title: Kotlin 2.0.0の新機能)

_[リリース日: 2024年5月21日](releases.md#release-details)_

Kotlin 2.0.0がリリースされ、[新しいKotlin K2コンパイラ](#kotlin-k2-compiler)がStableになりました！その他にも、以下のハイライトがあります。

*   [新しいComposeコンパイラGradleプラグイン](#new-compose-compiler-gradle-plugin)
*   [invokedynamicを使用したラムダ関数の生成](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvmライブラリがStableになりました](#the-kotlinx-metadata-jvm-library-is-stable)
*   [Appleプラットフォームでサインポストを使用したKotlin/NativeでのGCパフォーマンスの監視](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [Objective-Cメソッドとの競合の解決 (Kotlin/Native)](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Wasmでの名前付きエクスポートのサポート](#support-for-named-export)
*   [Kotlin/Wasmの`@JsExport`関数での符号なしプリミティブ型のサポート](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [Binaryenを使用したプロダクションビルドのデフォルト最適化](#optimized-production-builds-by-default-using-binaryen)
*   [マルチプラットフォームプロジェクトでのコンパイラオプション向け新しいGradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [enumクラスの`values`総称関数のStableな代替](#stable-replacement-of-the-enum-class-values-generic-function)
*   [Stableな`AutoCloseable`インターフェース](#stable-autocloseable-interface)

Kotlin 2.0はJetBrainsチームにとって大きな節目です。このリリースはKotlinConf 2024の中心でもありました。オープニングの基調講演では、Kotlin言語の最近の作業に関するエキサイティングなアップデートを発表しました。

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDEのサポート

Kotlin 2.0.0をサポートするKotlinプラグインは、最新のIntelliJ IDEAおよびAndroid Studioにバンドルされています。IDEでKotlinプラグインを更新する必要はありません。必要なのは、ビルドスクリプトで[Kotlinのバージョンを2.0.0に変更する](releases.md#update-to-a-new-kotlin-version)ことだけです。

*   IntelliJ IDEAのKotlin K2コンパイラのサポートに関する詳細は、[IDEでのサポート](#support-in-ides)を参照してください。
*   IntelliJ IDEAのKotlinサポートに関する詳細は、[Kotlinリリース](releases.md#ide-support)を参照してください。

## Kotlin K2コンパイラ

K2コンパイラへの道のりは長く、JetBrainsチームはついにその安定化を発表する準備ができました。Kotlin 2.0.0では、新しいKotlin K2コンパイラがデフォルトで使用され、すべてのターゲットプラットフォーム（JVM、Native、Wasm、JS）で[Stable](components-stability.md)です。この新しいコンパイラは、主要なパフォーマンスの向上、新しい言語機能開発の高速化、Kotlinがサポートするすべてのプラットフォームの統合、そしてマルチプラットフォームプロジェクトのためのより良いアーキテクチャをもたらします。

JetBrainsチームは、選択されたユーザーおよび内部プロジェクトから1,000万行のコードを正常にコンパイルすることで、新しいコンパイラの品質を保証しました。18,000人の開発者が安定化プロセスに関与し、合計80,000のプロジェクトで新しいK2コンパイラをテストし、見つかった問題を報告しました。

新しいコンパイラへの移行プロセスをできるだけスムーズにするために、[K2コンパイラ移行ガイド](k2-compiler-migration-guide.md)を作成しました。このガイドでは、コンパイラの多くの利点、発生する可能性のある変更点、および必要に応じて以前のバージョンにロールバックする方法について説明しています。

[ブログ記事](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)では、さまざまなプロジェクトでのK2コンパイラのパフォーマンスを調査しました。K2コンパイラの実際のパフォーマンスデータや、独自のプロジェクトからパフォーマンスベンチマークを収集する方法を知りたい場合は、ぜひチェックしてください。

また、KotlinConf 2024でのこの講演も視聴できます。そこでは、言語設計のリードであるMichail Zarečenskijが、Kotlinにおける機能の進化とK2コンパイラについて議論しています。

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 現在のK2コンパイラの制限事項

GradleプロジェクトでK2を有効にすると、以下の場合にGradleバージョン8.3未満を使用するプロジェクトに影響を与える可能性のある特定の制限事項が伴います。

*   `buildSrc`からのソースコードのコンパイル。
*   インクルードビルド内のGradleプラグインのコンパイル。
*   Gradleバージョン8.3未満のプロジェクトで使用される他のGradleプラグインのコンパイル。
*   Gradleプラグインの依存関係のビルド。

上記のいずれかの問題に遭遇した場合は、以下の手順で対処できます。

*   `buildSrc`、任意のGradleプラグイン、およびその依存関係の言語バージョンを設定します。

  ```kotlin
  kotlin {
      compilerOptions {
          languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
          apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
      }
  }
  ```

  > 特定のタスクの言語バージョンとAPIバージョンを設定する場合、これらの値は`compilerOptions`拡張によって設定された値をオーバーライドします。この場合、言語バージョンとAPIバージョンは1.9より高く設定することはできません。
  >
  {style="note"}

*   プロジェクトのGradleバージョンを8.3以降に更新します。

### スマートキャストの改善

Kotlinコンパイラは、特定のケースでオブジェクトを自動的に型にキャストできるため、明示的にキャストする手間が省けます。これは[スマートキャスト](typecasts.md#smart-casts)と呼ばれます。Kotlin K2コンパイラは、これまで以上に多くのシナリオでスマートキャストを実行するようになりました。

Kotlin 2.0.0では、以下の領域でスマートキャストに関する改善を行いました。

*   [ローカル変数とそれ以降のスコープ](#local-variables-and-further-scopes)
*   [論理`or`演算子による型チェック](#type-checks-with-logical-or-operator)
*   [インライン関数](#inline-functions)
*   [関数型を持つプロパティ](#properties-with-function-types)
*   [例外処理](#exception-handling)
*   [インクリメントおよびデクリメント演算子](#increment-and-decrement-operators)

#### ローカル変数とそれ以降のスコープ

以前は、変数が`if`条件内で`null`でないと評価された場合、その変数はスマートキャストされました。この変数に関する情報は、`if`ブロックのスコープ内でそれ以降も共有されました。

しかし、変数を`if`条件の**外側**で宣言した場合、`if`条件内でその変数に関する情報が利用できなかったため、スマートキャストできませんでした。この動作は`when`式や`while`ループでも見られました。

Kotlin 2.0.0からは、`if`、`when`、または`while`条件で使用する前に変数を宣言した場合、コンパイラが変数について収集した情報は、スマートキャストのために対応するブロックでアクセスできるようになります。

これは、ブール条件を変数に抽出したい場合などに役立ちます。そうすることで、変数に意味のある名前を付け、コードの可読性を向上させ、後でコード内で変数を再利用することが可能になります。例:

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // In Kotlin 2.0.0, the compiler can access
        // information about isCat, so it knows that
        // animal was smart-cast to the type Cat.
        // Therefore, the purr() function can be called.
        // In Kotlin 1.9.20, the compiler doesn't know
        // about the smart cast, so calling the purr()
        // function triggers an error.
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

Kotlin 2.0.0では、オブジェクトの型チェックを`or`演算子 (`||`) と組み合わせると、最も近い共通のスーパータイプにスマートキャストが行われます。この変更以前は、常に`Any`型にスマートキャストされていました。

この場合、オブジェクトのプロパティにアクセスしたり、関数を呼び出す前に、オブジェクトの型を手動でチェックする必要がありました。例:

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
        // Prior to Kotlin 2.0.0, signalStatus is smart cast
        // to type Any, so calling the signal() function triggered an
        // Unresolved reference error. The signal() function can only
        // be called successfully after another type check:

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 共通のスーパータイプは、ユニオン型の**近似**です。[ユニオン型](https://en.wikipedia.org/wiki/Union_type)はKotlinではサポートされていません。
>
{style="note"}

#### インライン関数

Kotlin 2.0.0では、K2コンパイラはインライン関数を異なる方法で扱います。これにより、他のコンパイラ分析と組み合わせて、スマートキャストが安全かどうかを判断できます。

具体的には、インライン関数は暗黙的な[`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)コントラクトを持つものとして扱われるようになりました。これは、インライン関数に渡されるラムダ関数がインプレースで呼び出されることを意味します。ラムダ関数がインプレースで呼び出されるため、コンパイラはラムダ関数がその関数本体に含まれる変数の参照を漏洩できないことを認識しています。

コンパイラは、この知識と他のコンパイラ分析を使用して、キャプチャされた変数のスマートキャストが安全かどうかを決定します。例:

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // In Kotlin 2.0.0, the compiler knows that processor
        // is a local variable, and inlineAction() is an inline function, so
        // references to processor can't be leaked. Therefore, it's safe
        // to smart-cast processor.

        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call
            // is needed
            processor.process()

            // In Kotlin 1.9.20, you have to perform a safe call:
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 関数型を持つプロパティ

以前のバージョンのKotlinでは、関数型を持つクラスプロパティがスマートキャストされないというバグがありました。Kotlin 2.0.0とK2コンパイラでこの動作を修正しました。例:

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // In Kotlin 2.0.0, if provider isn't null, then
        // provider is smart-cast
        if (provider != null) {
            // The compiler knows that provider isn't null
            provider()

            // In 1.9.20, the compiler doesn't know that provider isn't
            // null, so it triggers an error:
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

この変更は、`invoke`演算子をオーバーロードした場合にも適用されます。例:

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // In 1.9.20, the compiler triggers an error:
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 例外処理

Kotlin 2.0.0では例外処理の改善を行い、スマートキャスト情報を`catch`ブロックと`finally`ブロックに渡せるようになりました。この変更により、コンパイラがオブジェクトがnullable型であるかどうかを追跡するため、コードの安全性が向上します。例:

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // In Kotlin 2.0.0, the compiler knows stringInput
        // can be null, so stringInput stays nullable.
        println(stringInput?.length)
        // null

        // In Kotlin 1.9.20, the compiler says that a safe call isn't
        // needed, but this is incorrect.
    }
}

//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### インクリメントおよびデクリメント演算子

Kotlin 2.0.0より前では、コンパイラはインクリメントまたはデクリメント演算子の使用後にオブジェクトの型が変更される可能性があることを理解していませんでした。コンパイラがオブジェクトの型を正確に追跡できなかったため、コードが未解決参照エラーにつながる可能性がありました。Kotlin 2.0.0でこれが修正されました。

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

    // Check if unknownObject inherits from the Tau interface
    // Note, it's possible that unknownObject inherits from both
    // Rho and Tau interfaces.
    if (unknownObject is Tau) {

        // Use the overloaded inc() operator from interface Rho.
        // In Kotlin 2.0.0, the type of unknownObject is smart-cast to
        // Sigma.
        ++unknownObject

        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so the sigma() function can be called successfully.
        unknownObject.sigma()

        // In Kotlin 1.9.20, the compiler doesn't perform a smart cast
        // when inc() is called so the compiler still thinks that
        // unknownObject has type Tau. Calling the sigma() function
        // throws a compile-time error.

        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so calling the tau() function throws a compile-time
        // error.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // In Kotlin 1.9.20, since the compiler mistakenly thinks that
        // unknownObject has type Tau, the tau() function can be called,
        // but it throws a ClassCastException.
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin Multiplatformの改善

Kotlin 2.0.0では、Kotlin Multiplatformに関連するK2コンパイラの改善を以下の領域で行いました。

*   [コンパイル時の共通ソースとプラットフォームソースの分離](#separation-of-common-and-platform-sources-during-compilation)
*   [`expect`および`actual`宣言の異なる可視性レベル](#different-visibility-levels-of-expected-and-actual-declarations)

#### コンパイル時の共通ソースとプラットフォームソースの分離

以前は、Kotlinコンパイラの設計により、コンパイル時に共通ソースセットとプラットフォームソースセットを分離することができませんでした。その結果、共通コードがプラットフォームコードにアクセスでき、プラットフォーム間で動作が異なるという問題が発生していました。さらに、共通コードの一部のコンパイラ設定と依存関係がプラットフォームコードに漏洩していました。

Kotlin 2.0.0では、新しいKotlin K2コンパイラの実装にコンパイルスキームの再設計が含まれており、共通ソースセットとプラットフォームソースセット間の厳密な分離を保証します。この変更は、[expectおよびactual関数](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions)を使用する際に最も顕著です。以前は、共通コードの関数呼び出しがプラットフォームコードの関数に解決される可能性がありました。例:

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
// There is no foo() function overload
// on the JavaScript platform
```

</td>
</tr>
</table>

この例では、共通コードは実行されるプラットフォームによって動作が異なります。

*   JVMプラットフォームでは、共通コードで`foo()`関数を呼び出すと、プラットフォームコードの`foo()`関数が`platform foo`として呼び出されます。
*   JavaScriptプラットフォームでは、プラットフォームコードに`foo()`関数がないため、共通コードで`foo()`関数を呼び出すと、共通コードの`foo()`関数が`common foo`として呼び出されます。

Kotlin 2.0.0では、共通コードはプラットフォームコードにアクセスできないため、両方のプラットフォームで`foo()`関数が共通コードの`foo()`関数（`common foo`）に正常に解決されます。

プラットフォーム間の動作の一貫性が向上したことに加えて、IntelliJ IDEAまたはAndroid Studioとコンパイラの間で動作が競合していたケースを修正する努力も行いました。たとえば、[expectおよびactualクラス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes)を使用した場合、次のことが発生しました。

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
    // Before 2.0.0,
    // it triggers an IDE-only error
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

この例では、expectクラス`Identity`にはデフォルトコンストラクタがないため、共通コードで正常に呼び出すことができません。以前は、IDEによってのみエラーが報告され、コードはJVMで正常にコンパイルされていました。しかし、現在はコンパイラが次のようにエラーを正しく報告します。

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解決動作が変わらない場合

新しいコンパイルスキームへの移行はまだ進行中であるため、同じソースセット内にない関数を呼び出す場合の解決動作はまだ同じです。この違いは、マルチプラットフォームライブラリのオーバーロードを共通コードで使用する場合に主に気づくでしょう。

たとえば、署名が異なる2つの`whichFun()`関数を持つライブラリがあるとします。

```kotlin
// Example library

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

共通コードで`whichFun()`関数を呼び出すと、ライブラリで最も関連性の高い引数型を持つ関数が解決されます。

```kotlin
// A project that uses the example library for the JVM target

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

比較として、同じソースセット内で`whichFun()`のオーバーロードを宣言した場合、コードがプラットフォーム固有のバージョンにアクセスできないため、共通コードの関数が解決されます。

```kotlin
// Example library isn't used

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

マルチプラットフォームライブラリと同様に、`commonTest`モジュールは別のソースセットにあるため、プラットフォーム固有のコードにもまだアクセスできます。したがって、`commonTest`モジュールの関数呼び出しの解決は、古いコンパイルスキームと同じ動作を示します。

将来的には、これらの残りのケースは新しいコンパイルスキームとより一貫したものになる予定です。

#### `expect`および`actual`宣言の異なる可視性レベル

Kotlin 2.0.0より前では、Kotlinマルチプラットフォームプロジェクトで[expectおよびactual宣言](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)を使用する場合、同じ[可視性レベル](visibility-modifiers.md)である必要がありました。Kotlin 2.0.0では、異なる可視性レベルもサポートするようになりましたが、**ただし**`actual`宣言が`expect`宣言よりも_より許可的_である場合に限られます。例:

```kotlin
expect internal class Attribute // Visibility is internal
actual class Attribute          // Visibility is public by default,
                                // which is more permissive
```

同様に、`actual`宣言で[型エイリアス](type-aliases.md)を使用している場合、**基底型**の可視性は、`expect`宣言と同じか、より許可的である必要があります。例:

```kotlin
expect internal class Attribute                 // Visibility is internal
internal actual typealias Attribute = Expanded

class Expanded                                  // Visibility is public by default,
                                                // which is more permissive
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

*   [Jetpack Compose](https://developer.android.com/jetpack/compose)コンパイラプラグイン2.0.0。これは[Kotlinリポジトリに移動されました](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
*   [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html)以降の[Kotlin Symbol Processing (KSP)プラグイン](ksp-overview.md)。

> 追加のコンパイラプラグインを使用している場合は、そのドキュメントでK2との互換性を確認してください。
>
{style="tip"}

### 実験的なKotlin Power-assertコンパイラプラグイン

> Kotlin Power-assertプラグインは[実験的](components-stability.md#stability-levels-explained)です。いつでも変更される可能性があります。
>
{style="warning"}

Kotlin 2.0.0では、実験的なPower-assertコンパイラプラグインが導入されました。このプラグインは、失敗メッセージにコンテキスト情報を含めることでテスト作成のエクスペリエンスを向上させ、デバッグをより簡単かつ効率的にします。

開発者は、効果的なテストを作成するために複雑なアサーションライブラリを使用する必要があることがよくあります。Power-assertプラグインは、アサーション式の途中値を含む失敗メッセージを自動的に生成することで、このプロセスを簡素化します。これは、開発者がテストが失敗した理由をすばやく理解するのに役立ちます。

テストでアサーションが失敗すると、改善されたエラーメッセージは、アサーション内のすべての変数と部分式の値を示し、条件のどの部分が失敗の原因となったかを明確にします。これは、複数の条件がチェックされる複雑なアサーションで特に役立ちます。

プロジェクトでプラグインを有効にするには、`build.gradle(.kts)`ファイルで設定します。

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

[ドキュメントでKotlin Power-assertプラグイン](power-assert.md)について詳しく学びましょう。

### Kotlin K2コンパイラを有効にする方法

Kotlin 2.0.0以降、Kotlin K2コンパイラはデフォルトで有効になっています。追加のアクションは必要ありません。

### Kotlin PlaygroundでKotlin K2コンパイラを試す

Kotlin Playgroundは2.0.0リリースをサポートしています。[試してみましょう！](https://pl.kotl.in/czuoQprce)

### IDEでのサポート

デフォルトでは、IntelliJ IDEAおよびAndroid Studioは、コード分析、コード補完、ハイライト、およびその他のIDE関連機能に以前のコンパイラを引き続き使用します。IDEでKotlin 2.0のフルエクスペリエンスを得るには、K2モードを有効にします。

IDEで、**Settings** | **Languages & Frameworks** | **Kotlin** に移動し、**Enable K2 mode** オプションを選択します。IDEはK2モードを使用してコードを分析します。

![Enable K2 mode](k2-mode.png){width=200}

K2モードを有効にした後、コンパイラの動作変更によりIDE分析に違いが生じる場合があります。[移行ガイド](k2-compiler-migration-guide.md)で、新しいK2コンパイラが以前のものとどのように異なるかを確認してください。

*   K2モードの詳細については、[ブログ](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)をご覧ください。
*   K2モードに関するフィードバックを積極的に収集していますので、[公開Slackチャンネル](https://kotlinlang.slack.com/archives/C0B8H786P)でご意見をお聞かせください。

### 新しいK2コンパイラに関するフィードバックを送る

皆様からのフィードバックをお待ちしております！

*   新しいK2コンパイラで直面した問題は、[Issueトラッカー](https://kotl.in/issue)に報告してください。
*   JetBrainsがK2の使用状況に関する匿名データを収集できるように、[「使用状況統計の送信」オプション](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)を有効にしてください。

## Kotlin/JVM

バージョン2.0.0以降、コンパイラはJava 22バイトコードを含むクラスを生成できます。このバージョンでは、以下の変更も加えられています。

*   [invokedynamicを使用したラムダ関数の生成](#generation-of-lambda-functions-using-invokedynamic)
*   [`kotlinx-metadata-jvm`ライブラリがStableになりました](#the-kotlinx-metadata-jvm-library-is-stable)

### invokedynamicを使用したラムダ関数の生成

Kotlin 2.0.0では、`invokedynamic`を使用したラムダ関数の生成の新しいデフォルトメソッドが導入されました。この変更により、従来の匿名クラス生成と比較して、アプリケーションのバイナリサイズが削減されます。

最初のバージョン以降、Kotlinはラムダを匿名クラスとして生成してきました。しかし、[Kotlin 1.5.0](whatsnew15.md#lambdas-via-invokedynamic)以降、`-Xlambdas=indy`コンパイラオプションを使用することで、`invokedynamic`生成のオプションが利用可能になりました。Kotlin 2.0.0では、`invokedynamic`がラムダ生成のデフォルトメソッドになりました。このメソッドはより軽量なバイナリを生成し、KotlinをJVMの最適化に合わせることで、アプリケーションがJVMパフォーマンスの継続的および将来的な改善から利益を得ることを保証します。

現在、通常のラムダコンパイルと比較して3つの制限があります。

*   `invokedynamic`にコンパイルされたラムダはシリアライズできません。
*   実験的な[`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html)APIは、`invokedynamic`によって生成されたラムダをサポートしていません。
*   そのようなラムダで`.toString()`を呼び出すと、可読性の低い文字列表現が生成されます。

```kotlin
fun main() {
    println({})

    // With Kotlin 1.9.24 and reflection, returns
    // () -> kotlin.Unit

    // With Kotlin 2.0.0, returns
    // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
}
```

ラムダ関数の従来の生成動作を維持するには、以下のいずれかの方法を使用できます。

*   特定のラムダに`@JvmSerializableLambda`アノテーションを付けます。
*   モジュール内のすべてのラムダを従来のメソッドを使用して生成するには、コンパイラオプション`-Xlambdas=class`を使用します。

### `kotlinx-metadata-jvm`ライブラリがStableになりました

Kotlin 2.0.0では、`kotlinx-metadata-jvm`ライブラリが[Stable](components-stability.md#stability-levels-explained)になりました。このライブラリは`kotlin`パッケージおよび座標系に変更されたため、`kotlin-metadata-jvm`（「x」なし）として見つけることができます。

以前は、`kotlinx-metadata-jvm`ライブラリは独自のパブリッシングスキームとバージョンを持っていました。今後は、Kotlinのリリースサイクルの一部として`kotlin-metadata-jvm`の更新をビルドおよび公開し、Kotlin標準ライブラリと同じ後方互換性保証を提供します。

`kotlin-metadata-jvm`ライブラリは、Kotlin/JVMコンパイラによって生成されたバイナリファイルのメタデータを読み取りおよび変更するためのAPIを提供します。

<!-- Learn more about the `kotlinx-metadata-jvm` library in the [documentation](kotlin-metadata-jvm.md). -->

## Kotlin/Native

このバージョンでは、以下の変更が行われています。

*   [サインポストによるGCパフォーマンスの監視](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [Objective-Cメソッドとの競合の解決](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Nativeにおけるコンパイラ引数のログレベルの変更](#changed-log-level-for-compiler-arguments)
*   [Kotlin/Nativeへの標準ライブラリとプラットフォーム依存関係の明示的な追加](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
*   [Gradleコンフィギュレーションキャッシュにおけるタスクエラー](#tasks-error-in-gradle-configuration-cache)

### Appleプラットフォームでサインポストを使用したGCパフォーマンスの監視

以前は、Kotlin/Nativeのガベージコレクタ（GC）のパフォーマンスを監視するには、ログを調べるしかありませんでした。しかし、これらのログは、iOSアプリのパフォーマンスの問題を調査するための一般的なツールキットであるXcode Instrumentsと統合されていませんでした。

Kotlin 2.0.0以降、GCはInstrumentsで利用可能なサインポストによって一時停止を報告します。サインポストはアプリ内でカスタムロギングを可能にするため、iOSアプリのパフォーマンスをデバッグする際に、GCの一時停止がアプリケーションのフリーズに対応しているかどうかを確認できます。

GCパフォーマンス分析の詳細については、[ドキュメント](native-memory-manager.md#monitor-gc-performance)を参照してください。

### Objective-Cメソッドとの競合の解決

Objective-Cのメソッドは、異なる名前を持つことができますが、同じ数の引数と型を持つことができます。たとえば、[`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc)と[`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc)などです。Kotlinでは、これらのメソッドは同じシグネチャを持つため、これらを使用しようとすると、競合するオーバーロードエラーが発生します。

以前は、このコンパイルエラーを回避するために、競合するオーバーロードを手動で抑制する必要がありました。Objective-CとのKotlinの相互運用性を向上させるために、Kotlin 2.0.0では新しい`@ObjCSignatureOverride`アノテーションが導入されました。

このアノテーションは、Objective-Cクラスから同じ引数型だが異なる引数名を持つ複数の関数が継承される場合に、競合するオーバーロードを無視するようにKotlinコンパイラに指示します。

このアノテーションを適用することは、一般的なエラー抑制よりも安全です。このアノテーションは、サポートおよびテスト済みのObjective-Cメソッドのオーバーライドの場合にのみ使用でき、一般的な抑制は重要なエラーを隠し、静かに壊れたコードにつながる可能性があります。

### Kotlin/Nativeにおけるコンパイラ引数のログレベルの変更

このリリースでは、`compile`、`link`、`cinterop`などのKotlin/Native Gradleタスクにおけるコンパイラ引数のログレベルが`info`から`debug`に変更されました。

デフォルト値が`debug`であるため、ログレベルは他のGradleコンパイルタスクと一貫性があり、すべてのコンパイラ引数を含む詳細なデバッグ情報を提供します。

### Kotlin/Nativeへの標準ライブラリとプラットフォーム依存関係の明示的な追加

以前は、Kotlin/Nativeコンパイラは標準ライブラリとプラットフォームの依存関係を暗黙的に解決していました。これは、Kotlin GradleプラグインがKotlinターゲット間で動作する方法に不整合を引き起こしていました。

現在、各Kotlin/Native Gradleコンパイルは、[`compileDependencyFiles`コンパイルパラメータ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compilation-parameters)を介して、標準ライブラリとプラットフォームの依存関係をコンパイル時のライブラリパスに明示的に含めます。

### Gradleコンフィギュレーションキャッシュにおけるタスクエラー

Kotlin 2.0.0以降、`invocation of Task.project at execution time is unsupported`というメッセージを伴うコンフィギュレーションキャッシュエラーに遭遇する可能性があります。

このエラーは、`NativeDistributionCommonizerTask`や`KotlinNativeCompile`などのタスクで発生します。

しかし、これは誤検知エラー (false-positive error) です。根本的な問題は、`publish*`タスクのように、Gradleコンフィギュレーションキャッシュと互換性のないタスクが存在することです。

この不一致は、エラーメッセージが異なる根本原因を示唆しているため、すぐには明らかにならないかもしれません。

正確な原因がエラーレポートに明示的に記載されていないため、[Gradleチームはすでにレポートの修正に取り組んでいます](https://github.com/gradle/gradle/issues/21290)。

## Kotlin/Wasm

Kotlin 2.0.0は、パフォーマンスとJavaScriptとの相互運用性を向上させます。

*   [Binaryenを使用したプロダクションビルドのデフォルト最適化](#optimized-production-builds-by-default-using-binaryen)
*   [名前付きエクスポートのサポート](#support-for-named-export)
*   [`@JsExport`関数での符号なしプリミティブ型のサポート](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [Kotlin/WasmでのTypeScript宣言ファイルの生成](#generation-of-typescript-declaration-files-in-kotlin-wasm)
*   [JavaScript例外のキャッチのサポート](#support-for-catching-javascript-exceptions)
*   [新しい例外処理プロポーザルがオプションとしてサポートされるようになりました](#new-exception-handling-proposal-is-now-supported-as-an-option)
*   [`withWasm()`関数がJSおよびWASIバリアントに分割されました](#the-withwasm-function-is-split-into-js-and-wasi-variants)

### Binaryenを使用したプロダクションビルドのデフォルト最適化

Kotlin/Wasmツールチェーンは、以前の手動設定アプローチとは異なり、プロダクションコンパイル中にすべてのプロジェクトに[Binaryen](https://github.com/WebAssembly/binaryen)ツールを適用するようになりました。私たちの見積もりによると、これによりプロジェクトの実行時パフォーマンスが向上し、バイナリサイズが削減されるはずです。

> この変更はプロダクションコンパイルのみに影響します。開発用コンパイルプロセスは変更されません。
>
{style="note"}

### 名前付きエクスポートのサポート

以前は、Kotlin/Wasmからエクスポートされたすべての宣言は、デフォルトエクスポートを使用してJavaScriptにインポートされていました。

```javascript
//JavaScript:
import Module from "./index.mjs"

Module.add()
```

現在では、`@JsExport`でマークされた各Kotlin宣言を名前でインポートできます。

```kotlin
// Kotlin:
@JsExport
fun add(a: Int, b: Int) = a + b
```

```javascript
//JavaScript:
import { add } from "./index.mjs"
```

名前付きエクスポートにより、KotlinとJavaScriptモジュール間でコードを共有しやすくなります。可読性が向上し、モジュール間の依存関係管理に役立ちます。

### `@JsExport`関数での符号なしプリミティブ型のサポート

Kotlin 2.0.0以降、外部宣言や、Kotlin/Wasm関数をJavaScriptコードで利用可能にする`@JsExport`アノテーションを持つ関数内で[符号なしプリミティブ型](unsigned-integer-types.md)を使用できるようになりました。

これにより、以前の[符号なしプリミティブ型](unsigned-integer-types.md)をエクスポートされた宣言や外部宣言内で直接使用することを妨げていた制限が緩和されます。現在では、符号なしプリミティブ型を戻り値またはパラメータ型として持つ関数をエクスポートしたり、符号なしプリミティブ型を返したり消費したりする外部宣言を使用したりすることができます。

Kotlin/WasmとJavaScriptの相互運用性の詳細については、[ドキュメント](wasm-js-interop.md#use-javascript-code-in-kotlin)を参照してください。

### Kotlin/WasmでのTypeScript宣言ファイルの生成

> Kotlin/WasmでのTypeScript宣言ファイルの生成は[実験的](components-stability.md#stability-levels-explained)です。いつでも中止または変更される可能性があります。
>
{style="warning"}

Kotlin 2.0.0では、Kotlin/WasmコンパイラがKotlinコード内のすべての`@JsExport`宣言からTypeScript定義を生成できるようになりました。これらの定義は、IDEやJavaScriptツールによってコード補完を提供したり、型チェックを支援したり、KotlinコードをJavaScriptに含めやすくしたりするために使用できます。

Kotlin/Wasmコンパイラは、`@JsExport`でマークされた[トップレベル関数](wasm-js-interop.md#functions-with-the-jsexport-annotation)をすべて収集し、自動的にTypeScript定義を`.d.ts`ファイルに生成します。

TypeScript定義を生成するには、`build.gradle(.kts)`ファイルの`wasmJs {}`ブロックに`generateTypeScriptDefinitions()`関数を追加します。

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

### JavaScript例外のキャッチのサポート

以前は、Kotlin/WasmコードはJavaScript例外をキャッチできなかったため、プログラムのJavaScript側から発生するエラーを処理することが困難でした。

Kotlin 2.0.0では、Kotlin/Wasm内でJavaScript例外をキャッチするサポートを実装しました。この実装により、`Throwable`や`JsException`などの特定の型を持つ`try-catch`ブロックを使用して、これらのエラーを適切に処理できます。

さらに、例外の有無にかかわらずコードを実行するのに役立つ`finally`ブロックも正しく機能します。JavaScript例外のキャッチのサポートを導入していますが、コールスタックのようなJavaScript例外が発生した場合に追加の情報は提供されません。ただし、[これらの実装に取り組んでいます](https://youtrack.jetbrains.com/issue/KT-68185/WasmJs-Attach-js-exception-object-to-JsException)。

### 新しい例外処理プロポーザルがオプションとしてサポートされるようになりました

このリリースでは、Kotlin/Wasm内でWebAssemblyの[新しい例外処理プロポーザル](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)の新しいバージョンをサポートします。

このアップデートにより、新しいプロポーザルがKotlinの要件に合致し、最新バージョンのプロポーザルのみをサポートする仮想マシン上でKotlin/Wasmを使用できるようになります。

新しい例外処理プロポーザルは、デフォルトでオフになっている`-Xwasm-use-new-exception-proposal`コンパイラオプションを使用することで有効にできます。

### `withWasm()`関数がJSおよびWASIバリアントに分割されました

階層テンプレートのWasmターゲットを提供していた`withWasm()`関数は非推奨となり、専門化された`withWasmJs()`および`withWasmWasi()`関数に置き換えられました。

これにより、ツリー定義内の異なるグループ間でWASIおよびJSターゲットを分離できるようになりました。

## Kotlin/JS

その他の変更に加えて、このバージョンではKotlinにモダンなJSコンパイルが導入され、ES2015標準のより多くの機能がサポートされます。

*   [新しいコンパイルターゲット](#new-compilation-target)
*   [ES2015ジェネレーターとしての`suspend`関数](#suspend-functions-as-es2015-generators)
*   [`main`関数への引数渡し](#passing-arguments-to-the-main-function)
*   [Kotlin/JSプロジェクトのファイルごとのコンパイル](#per-file-compilation-for-kotlin-js-projects)
*   [コレクションの相互運用性の向上](#improved-collection-interoperability)
*   [`createInstance()`のサポート](#support-for-createinstance)
*   [型安全なプレーンJavaScriptオブジェクトのサポート](#support-for-type-safe-plain-javascript-objects)
*   [npmパッケージマネージャーのサポート](#support-for-npm-package-manager)
*   [コンパイルタスクの変更](#changes-to-compilation-tasks)
*   [従来のKotlin/JS JARアーティファクトの廃止](#discontinuing-legacy-kotlin-js-jar-artifacts)

### 新しいコンパイルターゲット

Kotlin 2.0.0では、Kotlin/JSに新しいコンパイルターゲット`es2015`を追加しました。これは、KotlinでサポートされているES2015機能を一度にすべて有効にする新しい方法です。

`build.gradle(.kts)`ファイルで次のように設定できます。

```kotlin
kotlin {
    js {
        compilerOptions {
            target.set("es2015")
        }
    }
}
```

新しいターゲットは、[ESクラスとモジュール](whatsnew19.md#experimental-support-for-es2015-classes-and-modules)および新しくサポートされた[ESジェネレーター](#suspend-functions-as-es2015-generators)を自動的に有効にします。

### ES2015ジェネレーターとしての`suspend`関数

このリリースでは、[suspend関数](composing-suspending-functions.md)をコンパイルするためのES2015ジェネレーターの[実験的な](components-stability.md#stability-levels-explained)サポートが導入されました。

ステートマシンではなくジェネレーターを使用することで、プロジェクトの最終的なバンドルサイズが改善されるはずです。たとえば、JetBrainsチームはES2015ジェネレーターを使用することで、Spaceプロジェクトのバンドルサイズを20%削減することに成功しました。

[ES2015 (ECMAScript 2015, ES6)の詳細については、公式ドキュメント](https://262.ecma-international.org/6.0/)をご覧ください。

### `main`関数への引数渡し

Kotlin 2.0.0以降、`main()`関数の`args`のソースを指定できるようになりました。この機能により、コマンドラインでの作業が容易になり、引数を渡すのが簡単になります。

これを行うには、新しい`passAsArgumentToMainFunction()`関数を持つ`js {}`ブロックを定義し、文字列の配列を返します。

```kotlin
kotlin {
    js {
        binary.executable()
        passAsArgumentToMainFunction("Deno.args")
    }
}
```

この関数は実行時に実行されます。JavaScript式を受け取り、`main()`関数の呼び出しの代わりに、それを`args: Array<String>`引数として使用します。

また、Node.jsランタイムを使用している場合は、特殊なエイリアスを利用できます。これにより、`process.argv`を手動で毎回追加する代わりに、一度`args`パラメータに渡すことができます。

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

Kotlin 2.0.0では、Kotlin/JSプロジェクトの出力に対する新しい粒度オプションが導入されました。Kotlinファイルごとに1つのJavaScriptファイルを生成するファイルごとのコンパイルを設定できるようになりました。これは、最終的なバンドルサイズを大幅に最適化し、プログラムの読み込み時間を改善するのに役立ちます。

以前は、出力オプションは2つしかありませんでした。Kotlin/JSコンパイラは、プロジェクト全体に対して単一の`.js`ファイルを生成できました。しかし、このファイルは大きすぎて使いにくい場合があります。プロジェクトから関数を使用したい場合はいつでも、JavaScriptファイル全体を依存関係として含める必要がありました。または、プロジェクトモジュールごとに個別の`.js`ファイルのコンパイルを設定することもできました。これは依然としてデフォルトのオプションです。

モジュールファイルも大きすぎる可能性があるため、Kotlin 2.0.0では、Kotlinファイルごとに1つ（ファイルがエクスポートされた宣言を含む場合は2つ）のJavaScriptファイルを生成する、よりきめ細やかな出力を追加します。ファイルごとのコンパイルモードを有効にするには:

1.  ECMAScriptモジュールをサポートするために、[`useEsModules()`](whatsnew19.md#experimental-support-for-es2015-classes-and-modules)関数をビルドファイルに追加します。

    ```kotlin
    // build.gradle.kts
    kotlin {
        js(IR) {
            useEsModules() // Enables ES2015 modules
            browser()
        }
    }
    ```

    これには、新しい`es2015`[コンパイルターゲット](#new-compilation-target)を使用することもできます。

2.  `-Xir-per-file`コンパイラオプションを適用するか、`gradle.properties`ファイルを更新します。

    ```none
    # gradle.properties
    kotlin.js.ir.output.granularity=per-file // `per-module` is the default
    ```

### コレクションの相互運用性の向上

Kotlin 2.0.0以降、署名内にKotlinコレクション型を持つ宣言をJavaScript（およびTypeScript）にエクスポートできるようになりました。これは、`Set`、`Map`、`List`コレクション型とその可変な counterparts に適用されます。

JavaScriptでKotlinコレクションを使用するには、まず必要な宣言に[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/)アノテーションを付けます。

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

その後、通常のJavaScript配列としてJavaScriptからそれらを消費できます。

```javascript
// JavaScript
import { User, me, KtList } from "my-module"

const allMyFriendNames = me.friends
    .asJsReadonlyArrayView()
    .map(x => x.name) // ['Kodee']
```

> 残念ながら、JavaScriptからKotlinコレクションを作成することはまだできません。この機能はKotlin 2.0.20で追加する予定です。
>
{style="note"}

### `createInstance()`のサポート

Kotlin 2.0.0以降、Kotlin/JSターゲットから[`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html)関数を使用できるようになりました。以前はJVMでのみ利用可能でした。

[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/)インターフェースからのこの関数は、指定されたクラスの新しいインスタンスを作成します。これは、Kotlinクラスへの実行時参照を取得するのに役立ちます。

### 型安全なプレーンJavaScriptオブジェクトのサポート

> `js-plain-objects`プラグインは[実験的](components-stability.md#stability-levels-explained)です。いつでも中止または変更される可能性があります。`js-plain-objects`プラグインはK2コンパイラ**のみ**をサポートします。
>
{style="warning"}

JavaScript APIでの作業を容易にするために、Kotlin 2.0.0では新しいプラグイン[`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)を提供します。これを使用して型安全なプレーンJavaScriptオブジェクトを作成できます。このプラグインは、`@JsPlainObject`アノテーションを持つ[外部インターフェース](wasm-js-interop.md#external-interfaces)についてコードをチェックし、以下を追加します。

*   コンストラクタとして使用できるコンパニオンオブジェクト内のインライン`invoke`演算子関数。
*   オブジェクトのコピーを作成し、そのプロパティの一部を調整するために使用できる`.copy()`関数。

例:

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface User {
    var name: String
    val age: Int
    val email: String?
}

fun main() {
    // Creates a JavaScript object
    val user = User(name = "Name", age = 10)
    // Copies the object and adds an email
    val copy = user.copy(age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

このアプローチで作成されたJavaScriptオブジェクトは、実行時ではなくコンパイル時またはIDEによってハイライトされるエラーが表示されるため、より安全です。

JavaScriptオブジェクトの形状を記述するために外部インターフェースを使用してJavaScript APIと対話する`fetch()`関数を使用するこの例を考えてみましょう。

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface FetchOptions {
    val body: String?
    val method: String
}

// A wrapper for Window.fetch
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// A compile-time error is triggered as "metod" is not recognized
// as method
fetch("https://google.com", options = FetchOptions(metod = "POST"))
// A compile-time error is triggered as method is required
fetch("https://google.com", options = FetchOptions(body = "SOME STRING"))
```

比較として、`js()`関数を使用してJavaScriptオブジェクトを作成した場合、エラーは実行時にのみ検出されるか、まったくトリガーされません。

```kotlin
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// No error is triggered. As "metod" is not recognized, the wrong method
// (GET) is used.
fetch("https://google.com", options = js("{ metod: 'POST' }"))

// By default, the GET method is used. A runtime error is triggered as
// body shouldn't be present.
fetch("https://google.com", options = js("{ body: 'SOME STRING' }"))
// TypeError: Window.fetch: HEAD or GET Request cannot have a body
```

`js-plain-objects`プラグインを使用するには、`build.gradle(.kts)`ファイルに以下を追加します。

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

以前は、KotlinマルチプラットフォームGradleプラグインは、npm依存関係をダウンロードしてインストールするために[Yarn](https://yarnpkg.com/lang/en/)をパッケージマネージャーとしてのみ使用できました。Kotlin 2.0.0からは、代わりに[npm](https://www.npmjs.com/)をパッケージマネージャーとして使用できます。npmをパッケージマネージャーとして使用することで、セットアップ中に管理するツールが1つ少なくなります。

後方互換性のため、Yarnは依然としてデフォルトのパッケージマネージャーです。npmをパッケージマネージャーとして使用するには、`gradle.properties`ファイルで次のプロパティを設定します。

```kotlin
kotlin.js.yarn = false
```

### コンパイルタスクの変更

以前は、`webpack`タスクと`distributeResources`コンパイルタスクの両方が同じディレクトリをターゲットにしていました。さらに、`distribution`タスクも`dist`をその出力ディレクトリとして宣言していました。これにより、出力が重複し、コンパイル警告が発生していました。

そこで、Kotlin 2.0.0以降、以下の変更を実装しました。

*   `webpack`タスクは個別のフォルダをターゲットにするようになりました。
*   `distributeResources`タスクは完全に削除されました。
*   `distribution`タスクは`Copy`型になり、`dist`フォルダをターゲットにするようになりました。

### 従来のKotlin/JS JARアーティファクトの廃止

Kotlin 2.0.0以降、Kotlinディストリビューションには、`.jar`拡張子を持つ従来のKotlin/JSアーティファクトは含まれなくなりました。従来のアーティファクトは、サポートされていない古いKotlin/JSコンパイラで使用されており、`klib`形式を使用するIRコンパイラには不要でした。

## Gradleの改善

Kotlin 2.0.0は、Gradle 6.8.3から8.5まで完全に互換性があります。最新のGradleリリースまでのGradleバージョンを使用することもできますが、その場合、非推奨警告や新しいGradle機能が動作しない可能性があることに注意してください。

このバージョンでは、以下の変更が行われています。

*   [マルチプラットフォームプロジェクトでのコンパイラオプション向け新しいGradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [新しいComposeコンパイラGradleプラグイン](#new-compose-compiler-gradle-plugin)
*   [JVMおよびAndroidパブリッシュ済みライブラリを区別する新しい属性](#new-attribute-to-distinguish-jvm-and-android-published-libraries)
*   [Kotlin/NativeにおけるCInteropProcessのGradle依存関係処理の改善](#improved-gradle-dependency-handling-for-cinteropprocess-in-kotlin-native)
*   [Gradleにおける可視性の変更](#visibility-changes-in-gradle)
*   [GradleプロジェクトにおけるKotlinデータの新しいディレクトリ](#new-directory-for-kotlin-data-in-gradle-projects)
*   [必要時にKotlin/Nativeコンパイラをダウンロード](#kotlin-native-compiler-downloaded-when-needed)
*   [古いコンパイラオプション定義方法の非推奨化](#deprecated-old-ways-of-defining-compiler-options)
*   [サポートされる最小AGPバージョンの引き上げ](#bumped-minimum-supported-agp-version)
*   [最新言語バージョン試用向けの新しいGradleプロパティ](#new-gradle-property-for-trying-the-latest-language-version)
*   [ビルドレポートの新しいJSON出力形式](#new-json-output-format-for-build-reports)
*   [`kapt`設定がスーパー設定からアノテーションプロセッサを継承](#kapt-configurations-inherit-annotation-processors-from-superconfigurations)
*   [Kotlin Gradleプラグインが非推奨のGradle規約を使用しないように](#kotlin-gradle-plugin-no-longer-uses-deprecated-gradle-conventions)

### マルチプラットフォームプロジェクトでのコンパイラオプション向け新しいGradle DSL

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも中止または変更される可能性があります。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 2.0.0より前では、Gradleを使用したマルチプラットフォームプロジェクトでのコンパイラオプションの設定は、タスクごと、コンパイルごと、またはソースセットごとのような低レベルでしか不可能でした。プロジェクトでコンパイラオプションをより一般的に設定しやすくするために、Kotlin 2.0.0には新しいGradle DSLが付属しています。

この新しいDSLを使用すると、すべてのターゲットと`commonMain`のような共有ソースセットの拡張レベル、および特定のターゲットのターゲットレベルでコンパイラオプションを設定できます。

```kotlin
kotlin {
    compilerOptions {
        // Extension-level common compiler options that are used as defaults
        // for all targets and shared source sets
        allWarningsAsErrors.set(true)
    }
    jvm {
        compilerOptions {
            // Target-level JVM compiler options that are used as defaults
            // for all compilations in this target
            noJdk.set(true)
        }
    }
}
```

プロジェクト全体の構成は、現在3つの層から成り立っています。最も上位は拡張レベル、次にターゲットレベル、最も下位はコンパイルユニット（通常はコンパイルタスク）です。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

上位レベルの設定は、下位レベルの規約（デフォルト）として使用されます。

*   拡張コンパイラオプションの値は、`commonMain`、`nativeMain`、`commonTest`などの共有ソースセットを含む、ターゲットコンパイラオプションのデフォルトです。
*   ターゲットコンパイラオプションの値は、コンパイルユニット（タスク）コンパイラオプション、たとえば`compileKotlinJvm`や`compileTestKotlinJvm`タスクのデフォルトとして使用されます。

一方、下位レベルで行われた設定は、上位レベルの関連設定をオーバーライドします。

*   タスクレベルのコンパイラオプションは、ターゲットまたは拡張レベルの関連構成をオーバーライドします。
*   ターゲットレベルのコンパイラオプションは、拡張レベルの関連構成をオーバーライドします。

プロジェクトを設定する際には、コンパイラオプションの古い設定方法の一部が[非推奨](#deprecated-old-ways-of-defining-compiler-options)になっていることに留意してください。

この新しいDSLをマルチプラットフォームプロジェクトで試して、[YouTrack](https://kotl.in/issue)にフィードバックを残していただくことをお勧めします。このDSLをコンパイラオプションを設定するための推奨アプローチとする予定です。

### 新しいComposeコンパイラGradleプラグイン

コンポーザブルをKotlinコードに変換するJetpack Composeコンパイラは、Kotlinリポジトリにマージされました。これにより、ComposeコンパイラがKotlinと同時に常にリリースされるため、ComposeプロジェクトのKotlin 2.0.0への移行が容易になります。これにより、Composeコンパイラのバージョンも2.0.0に上がります。

プロジェクトで新しいComposeコンパイラを使用するには、`build.gradle(.kts)`ファイルで`org.jetbrains.kotlin.plugin.compose`Gradleプラグインを適用し、そのバージョンをKotlin 2.0.0と一致させます。

この変更の詳細と移行手順については、[Composeコンパイラのドキュメント](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html)を参照してください。

### JVMおよびAndroidパブリッシュ済みライブラリを区別する新しい属性

Kotlin 2.0.0以降、[`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)Gradle属性がすべてのKotlinバリアントとともにデフォルトで公開されます。

この属性は、KotlinマルチプラットフォームライブラリのJVMバリアントとAndroidバリアントを区別するのに役立ちます。特定のライブラリバリアントが特定のJVM環境により適していることを示します。ターゲット環境は「android」、「standard-jvm」、または「no-jvm」のいずれかです。

この属性を公開することで、JVMおよびAndroidターゲットを持つKotlinマルチプラットフォームライブラリを、Javaのみのプロジェクトのような非マルチプラットフォームクライアントからより堅牢に消費できるようになるはずです。

必要に応じて、属性の公開を無効にすることができます。これを行うには、`gradle.properties`ファイルに次のGradleオプションを追加します。

```none
kotlin.publishJvmEnvironmentAttribute=false
```

### Kotlin/NativeにおけるCInteropProcessのGradle依存関係処理の改善

このリリースでは、Kotlin/NativeプロジェクトにおけるGradleタスクの依存関係管理を改善するために、`defFile`プロパティの処理を強化しました。

このアップデート以前は、`defFile`プロパティがまだ実行されていない別のタスクの出力として指定されている場合、Gradleビルドが失敗する可能性がありました。この問題の回避策は、このタスクへの依存関係を追加することでした。

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

これを修正するために、`definitionFile`という新しい`RegularFileProperty`プロパティが追加されました。現在、Gradleは、接続されたタスクがビルドプロセスの後半で実行された後に、`definitionFile`プロパティの存在を遅延検証します。この新しいアプローチにより、追加の依存関係は不要になります。

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

> `defFile`と`defFileProperty`パラメータは非推奨です。
>
{style="warning"}

### Gradleにおける可視性の変更

> この変更はKotlin DSLユーザーのみに影響します。
>
{style="note"}

Kotlin 2.0.0では、ビルドスクリプトの制御と安全性を高めるために、Kotlin Gradleプラグインを変更しました。以前は、特定のDSLコンテキストを意図したKotlin DSL関数とプロパティが、意図せずに他のDSLコンテキストに漏洩することがありました。この漏洩は、誤ったコンパイラオプションの使用、設定の複数回の適用、その他の設定ミスにつながる可能性がありました。

```kotlin
kotlin {
    // Target DSL couldn't access methods and properties defined in the
    // kotlin{} extension DSL
    jvm {
        // Compilation DSL couldn't access methods and properties defined
        // in the kotlin{} extension DSL and Kotlin jvm{} target DSL
        compilations.configureEach {
            // Compilation task DSLs couldn't access methods and
            // properties defined in the kotlin{} extension, Kotlin jvm{}
            // target or Kotlin compilation DSL
            compileTaskProvider.configure {
                // For example:
                explicitApi()
                // ERROR as it is defined in the kotlin{} extension DSL
                mavenPublication {}
                // ERROR as it is defined in the Kotlin jvm{} target DSL
                defaultSourceSet {}
                // ERROR as it is defined in the Kotlin compilation DSL
            }
        }
    }
}
```

この問題を修正するために、`@KotlinGradlePluginDsl`アノテーションを追加しました。これにより、Kotlin GradleプラグインのDSL関数とプロパティが意図しないレベルで公開されるのを防ぎます。以下のレベルが互いに分離されます。

*   Kotlin拡張
*   Kotlinターゲット
*   Kotlinコンパイル
*   Kotlinコンパイルタスク

最も一般的なケースについては、ビルドスクリプトが誤って構成されている場合に修正方法の提案を含むコンパイラ警告を追加しました。例:

```kotlin
kotlin {
    jvm {
        sourceSets.getByName("jvmMain").dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.7.3")
        }
    }
}
```

この場合、`sourceSets`に対する警告メッセージは次のようになります。

```none
[DEPRECATION] 'sourceSets: NamedDomainObjectContainer<KotlinSourceSet>' is deprecated.Accessing 'sourceSets' container on the Kotlin target level DSL is deprecated. Consider configuring 'sourceSets' on the Kotlin extension level.
```

この変更に関するフィードバックをお待ちしております！[#gradle Slackチャンネル](https://kotlinlang.slack.com/archives/C19FD9681)でKotlin開発者に直接コメントをお寄せください。[Slack招待を受け取る](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。

### GradleプロジェクトにおけるKotlinデータの新しいディレクトリ

> `.kotlin`ディレクトリをバージョン管理システムにコミットしないでください。たとえば、Gitを使用している場合は、プロジェクトの`.gitignore`ファイルに`.kotlin`を追加してください。
>
{style="warning"}

Kotlin 1.8.20では、Kotlin GradleプラグインはデータをGradleプロジェクトキャッシュディレクトリ（`<project-root-directory>/.gradle/kotlin`）に保存するように切り替えました。しかし、`.gradle`ディレクトリはGradle専用であり、結果として将来性がありません。

これを解決するため、Kotlin 2.0.0からは、Kotlinデータはデフォルトで`<project-root-directory>/.kotlin`に保存されるようになりました。後方互換性のため、一部のデータは引き続き`.gradle/kotlin`ディレクトリに保存されます。

設定できる新しいGradleプロパティは次のとおりです。

| Gradleプロパティ                                    | 説明                                                                                                          |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | プロジェクトレベルのデータが保存される場所を設定します。デフォルト: `<project-root-directory>/.kotlin`       |
| `kotlin.project.persistent.dir.gradle.disableWrite` | `.gradle`ディレクトリへのKotlinデータの書き込みを無効にするかどうかを制御するブール値。デフォルト: `false` |

これらのプロパティをプロジェクトの`gradle.properties`ファイルに追加すると、有効になります。

### 必要時にKotlin/Nativeコンパイラをダウンロード

Kotlin 2.0.0より前では、マルチプラットフォームプロジェクトのGradleビルドスクリプトに[Kotlin/Nativeターゲット](native-target-support.md)が設定されている場合、Gradleは常に[コンフィギュレーションフェーズ](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:configuration)でKotlin/Nativeコンパイラをダウンロードしていました。

これは、[実行フェーズ](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)で実行される予定のKotlin/Nativeターゲットのコードをコンパイルするタスクがなくても発生していました。この方法でのKotlin/Nativeコンパイラのダウンロードは、CIプロセスの一部としてKotlinプロジェクトのテストやチェックのみを行いたいユーザーにとっては特に非効率的でした。

Kotlin 2.0.0では、Kotlin Gradleプラグインでこの動作を変更し、Kotlin/Nativeコンパイラが[実行フェーズ](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)で、そしてKotlin/Nativeターゲットのコンパイルが要求された場合に**のみ**ダウンロードされるようになりました。

また、Kotlin/Nativeコンパイラの依存関係は、コンパイラの一部としてではなく、実行フェーズでダウンロードされるようになりました。

新しい動作で問題が発生した場合は、`gradle.properties`ファイルに次のGradleプロパティを追加することで、一時的に以前の動作に戻すことができます。

```none
kotlin.native.toolchain.enabled=false
```

Kotlin 1.9.20-Beta以降、Kotlin/NativeディストリビューションはCDNとともに[Maven Central](https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/)にも公開されています。

これにより、KotlinがArtifactoryを探してダウンロードする方法を変更できるようになりました。デフォルトでは、CDNの代わりに、プロジェクトの`repositories {}`ブロックで指定したMavenリポジトリを使用するようになりました。

`gradle.properties`ファイルに次のGradleプロパティを設定することで、一時的にこの動作を元に戻すことができます。

```none
kotlin.native.distribution.downloadFromMaven=false
```

問題が発生した場合は、[YouTrack](https://kotl.in/issue)のIssueトラッカーに報告してください。デフォルトの動作を変更するこれら両方のGradleプロパティは一時的なものであり、将来のリリースで削除される予定です。

### 古いコンパイラオプション定義方法の非推奨化

このリリースでは、コンパイラオプションの設定方法を引き続き改善しています。これにより、異なる方法間の曖昧さを解消し、プロジェクト設定をより簡潔にすることができます。

Kotlin 2.0.0以降、コンパイラオプションを指定するための以下のDSLは非推奨となりました。

*   すべてのKotlinコンパイルタスクを実装する`KotlinCompile`インターフェースの`kotlinOptions` DSL。代わりに`KotlinCompilationTask<CompilerOptions>`を使用してください。
*   `KotlinCompilation`インターフェースの`HasCompilerOptions`型の`compilerOptions`プロパティ。このDSLは他のDSLと一貫性がなく、`KotlinCompilation.compileTaskProvider`コンパイルタスク内の`compilerOptions`と同じ`KotlinCommonCompilerOptions`オブジェクトを設定していたため、混乱を招いていました。

  代わりに、Kotlinコンパイルタスクの`compilerOptions`プロパティを使用することをお勧めします。

  ```kotlin
  kotlinCompilation.compileTaskProvider.configure {
      compilerOptions { ... }
  }
  ```

  例:

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

*   `KotlinCompilation`インターフェースの`kotlinOptions` DSL。
*   `KotlinNativeArtifactConfig`インターフェース、`KotlinNativeLink`クラス、`KotlinNativeLinkArtifactTask`クラスの`kotlinOptions` DSL。代わりに`toolOptions` DSLを使用してください。
*   `KotlinJsDce`インターフェースの`dceOptions` DSL。代わりに`toolOptions` DSLを使用してください。

Kotlin Gradleプラグインでのコンパイラオプションの指定方法の詳細については、[オプションの定義方法](gradle-compiler-options.md#how-to-define-options)を参照してください。

### サポートされる最小AGPバージョンの引き上げ

Kotlin 2.0.0以降、サポートされる最小Android Gradleプラグインバージョンは7.1.3です。

### 最新言語バージョン試用向けの新しいGradleプロパティ

Kotlin 2.0.0より前は、新しいK2コンパイラを試すためのGradleプロパティ`kotlin.experimental.tryK2`がありました。Kotlin 2.0.0でK2コンパイラがデフォルトで有効になったため、このプロパティをプロジェクトで最新言語バージョンを試すための新しい形式`kotlin.experimental.tryNext`に進化させることにしました。このプロパティを`gradle.properties`ファイルで使用すると、Kotlin Gradleプラグインは、Kotlinバージョンのデフォルト値よりも1つ上の言語バージョンにインクリメントします。たとえば、Kotlin 2.0.0では、デフォルトの言語バージョンは2.0であるため、このプロパティは言語バージョン2.1を設定します。

この新しいGradleプロパティは、以前の`kotlin.experimental.tryK2`と同様のメトリクスを[ビルドレポート](gradle-compilation-and-caches.md#build-reports)に生成します。設定された言語バージョンは出力に含まれます。例:

```none
##### 'kotlin.experimental.tryNext' results #####
:app:compileKotlin: 2.1 language version
:lib:compileKotlin: 2.1 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.1 #####
```

ビルドレポートの有効化方法とその内容の詳細については、[ビルドレポート](gradle-compilation-and-caches.md#build-reports)を参照してください。

### ビルドレポートの新しいJSON出力形式

Kotlin 1.7.0では、コンパイラのパフォーマンスを追跡するためにビルドレポートを導入しました。時が経つにつれて、これらのレポートをさらに詳細で、パフォーマンスの問題を調査する際に役立つように、より多くのメトリクスを追加してきました。以前は、ローカルファイルの唯一の出力形式は`*.txt`形式でした。Kotlin 2.0.0では、他のツールを使用して分析しやすくするためにJSON出力形式をサポートしています。

ビルドレポートのJSON出力形式を設定するには、`gradle.properties`ファイルで次のプロパティを宣言します。

```none
kotlin.build.report.output=json

// The directory to store your build reports
kotlin.build.report.json.directory=my/directory/path
```

または、次のコマンドを実行します。

```shell
./gradlew assemble -Pkotlin.build.report.output=json -Pkotlin.build.report.json.directory="my/directory/path"
```

設定が完了すると、Gradleは指定したディレクトリに`$ {project_name}-date-time-<sequence_number>.json`という名前でビルドレポートを生成します。

以下は、ビルドメトリクスと集計されたメトリクスを含むJSON出力形式のビルドレポートの例の一部です。

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

### `kapt`設定がスーパー設定からアノテーションプロセッサを継承

Kotlin 2.0.0より前では、共通のアノテーションプロセッサのセットを別のGradle設定で定義し、サブプロジェクトのkapt固有の設定でこの設定を拡張した場合、kaptはアノテーションプロセッサを見つけることができなかったため、アノテーション処理をスキップしていました。Kotlin 2.0.0では、kaptがアノテーションプロセッサへの間接的な依存関係があることを正常に検出できるようになりました。

例として、[Dagger](https://dagger.dev/)を使用するサブプロジェクトの場合、`build.gradle(.kts)`ファイルで次の設定を使用します。

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

この例では、`commonAnnotationProcessors` Gradle設定は、すべてのプロジェクトで使用したい共通のアノテーション処理設定です。[`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)メソッドを使用して、`commonAnnotationProcessors`をスーパー設定として追加します。kaptは、`commonAnnotationProcessors` Gradle設定がDaggerアノテーションプロセッサに依存していることを認識します。したがって、kaptはDaggerアノテーションプロセッサをアノテーション処理の設定に含めます。

Christoph Loy氏による[実装](https://github.com/JetBrains/kotlin/pull/5198)に感謝いたします！

### Kotlin Gradleプラグインが非推奨のGradle規約を使用しないように

Kotlin 2.0.0より前では、Gradle 8.2以降を使用した場合、Kotlin GradleプラグインがGradle 8.2で非推奨となったGradle規約を誤って使用していました。これにより、Gradleがビルドの非推奨警告を報告していました。Kotlin 2.0.0では、Kotlin Gradleプラグインが更新され、Gradle 8.2以降を使用してもこれらの非推奨警告がトリガーされなくなりました。

## 標準ライブラリ

このリリースでは、Kotlin標準ライブラリのさらなる安定性がもたらされ、既存の関数がさらに多くのプラットフォームで共通になりました。

*   [enumクラスの`values`総称関数のStableな代替](#stable-replacement-of-the-enum-class-values-generic-function)
*   [Stableな`AutoCloseable`インターフェース](#stable-autocloseable-interface)
*   [`AbstractMutableList.modCount`共通protectedプロパティ](#common-protected-property-abstractmutablelist-modcount)
*   [`AbstractMutableList.removeRange`共通protected関数](#common-protected-function-abstractmutablelist-removerange)
*   [`String.toCharArray(destination)`共通関数](#common-string-tochararray-destination-function)

### enumクラスの`values`総称関数のStableな代替

Kotlin 2.0.0では、`enumEntries<T>()`関数が[Stable](components-stability.md#stability-levels-explained)になりました。`enumEntries<T>()`関数は、総称関数`enumValues<T>()`の代替です。新しい関数は、指定されたenum型`T`のすべてのenumエントリのリストを返します。enumクラスの`entries`プロパティは以前に導入され、合成関数`values()`の代替として安定化されました。`entries`プロパティの詳細については、[Kotlin 1.8.20の新機能](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)を参照してください。

> `enumValues<T>()`関数は引き続きサポートされていますが、パフォーマンスへの影響が少ないため、代わりに`enumEntries<T>()`関数を使用することをお勧めします。`enumValues<T>()`を呼び出すたびに新しい配列が作成されますが、`enumEntries<T>()`を呼び出すたびに同じリストが返されるため、はるかに効率的です。
>
{style="tip"}

例:

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// RED, GREEN, BLUE
```

### Stableな`AutoCloseable`インターフェース

Kotlin 2.0.0では、共通の[`AutoCloseable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/)インターフェースが[Stable](components-stability.md#stability-levels-explained)になりました。これにより、リソースを簡単に閉じることができ、いくつかの便利な関数が含まれています。

*   `use()`拡張関数は、選択したリソースに対して指定されたブロック関数を実行し、例外がスローされたかどうかに関わらず、正しくクローズします。
*   `AutoCloseable()`コンストラクタ関数は、`AutoCloseable`インターフェースのインスタンスを作成します。

以下の例では、`XMLWriter`インターフェースを定義し、それを実装するリソースがあると仮定します。たとえば、このリソースはファイルを開き、XMLコンテンツを書き込み、閉じることができるクラスである可能性があります。

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

### `AbstractMutableList.modCount`共通protectedプロパティ

このリリースでは、`AbstractMutableList`インターフェースの[`modCount`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/mod-count.html)`protected`プロパティが共通になりました。以前は、`modCount`プロパティは各プラットフォームで利用可能でしたが、共通ターゲットでは利用できませんでした。これで、`AbstractMutableList`のカスタム実装を作成し、共通コードでこのプロパティにアクセスできるようになりました。

このプロパティは、コレクションに行われた構造的な変更の数を追跡します。これには、コレクションのサイズを変更する操作や、進行中のイテレーションが不正な結果を返す原因となるような方法でリストを変更する操作が含まれます。

カスタムリストを実装する際に、`modCount`プロパティを使用して同時変更を登録および検出できます。

### `AbstractMutableList.removeRange`共通protected関数

このリリースでは、`AbstractMutableList`インターフェースの[`removeRange()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/remove-range.html)`protected`関数が共通になりました。以前は、各プラットフォームで利用可能でしたが、共通ターゲットでは利用できませんでした。これで、`AbstractMutableList`のカスタム実装を作成し、共通コードでこの関数をオーバーライドできるようになりました。

この関数は、指定された範囲に従ってこのリストから要素を削除します。この関数をオーバーライドすることで、カスタム実装を利用し、リスト操作のパフォーマンスを向上させることができます。

### `String.toCharArray(destination)`共通関数

このリリースでは、共通の[`String.toCharArray(destination)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html)関数が導入されました。以前は、JVMでのみ利用可能でした。

既存の[`String.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html)関数と比較してみましょう。これは、指定された文字列から文字を含む新しい`CharArray`を作成します。しかし、新しい共通の`String.toCharArray(destination)`関数は、`String`の文字を既存の`destination CharArray`に移動します。これは、すでに埋めたいバッファがある場合に便利です。

```kotlin
fun main() {
    val myString = "Kotlin is awesome!"
    val destinationArray = CharArray(myString.length)

    // Convert the string and store it in the destinationArray:
    myString.toCharArray(destinationArray)

    for (char in destinationArray) {
        print("$char ")
        // K o t l i n   i s   a w e s o m e !
    }
}
```
{kotlin-runnable="true"}

## Kotlin 2.0.0のインストール

IntelliJ IDEA 2023.3およびAndroid Studio Iguana (2023.2.1) Canary 15以降、KotlinプラグインはIDEにバンドルされたプラグインとして配布されます。これは、JetBrains Marketplaceからプラグインをインストールできなくなったことを意味します。

新しいKotlinバージョンに更新するには、ビルドスクリプトで[Kotlinのバージョンを2.0.0に変更します](releases.md#update-to-a-new-kotlin-version)。