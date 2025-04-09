---
title: "K2 コンパイラ移行ガイド"
---
Kotlin言語とエコシステムが進化を続けるにつれて、Kotlinコンパイラーも進化してきました。最初のステップは、ロジックを共有する新しいJVMとJS IR (Intermediate Representation)バックエンドの導入であり、これにより異なるプラットフォーム上のターゲットに対するコード生成が簡素化されました。そして今、その進化の次の段階として、K2と呼ばれる新しいフロントエンドが登場します。

<img src="/img/k2-compiler-architecture.svg" alt="Kotlin K2 compiler architecture" width="700" style={{verticalAlign: 'middle'}}/>

K2コンパイラーの登場により、Kotlinのフロントエンドは完全に書き直され、より効率的な新しいアーキテクチャを備えています。新しいコンパイラーがもたらす根本的な変更は、より多くのセマンティック情報を含む1つの統合されたデータ構造の使用です。このフロントエンドは、セマンティック分析、呼び出し解決、および型推論の実行を担当します。

新しいアーキテクチャと強化されたデータ構造により、K2コンパイラーは次の利点を提供できます。

* **改善された呼び出し解決と型推論**。コンパイラーはより一貫して動作し、コードをより良く理解します。
* **新しい言語機能のためのシンタックスシュガーの導入が容易**。将来的には、新しい機能が導入されたときに、より簡潔で読みやすいコードを使用できるようになります。
* **コンパイル時間の短縮**。コンパイル時間は[大幅に高速化](#performance-improvements)される可能性があります。
* **強化されたIDEのパフォーマンス**。IntelliJ IDEAでK2モードを有効にすると、IntelliJ IDEAはK2コンパイラーのフロントエンドを使用してKotlinコードを分析し、安定性とパフォーマンスの向上をもたらします。詳細については、[IDEでのサポート](#support-in-ides)を参照してください。

このガイドでは以下について説明します。

* 新しいK2コンパイラーの利点
* 移行中に発生する可能性のある変更点と、それに応じてコードを適合させる方法
* 以前のバージョンにロールバックする方法

:::note
新しいK2コンパイラーは、2.0.0以降でデフォルトで有効になっています。Kotlin 2.0.0で提供される新機能、および新しいK2コンパイラーの詳細については、[Kotlin 2.0.0の新機能](whatsnew20)を参照してください。

:::

## パフォーマンスの改善

K2コンパイラーのパフォーマンスを評価するために、2つのオープンソースプロジェクトである[Anki-Android](https://github.com/ankidroid/Anki-Android)と[Exposed](https://github.com/JetBrains/Exposed)でパフォーマンステストを実行しました。以下は、私たちが見つけた主なパフォーマンスの改善点です。

* K2コンパイラーは、最大94％のコンパイル速度の向上をもたらします。たとえば、Anki-Androidプロジェクトでは、クリーンビルド時間がKotlin 1.9.23の57.7秒からKotlin 2.0.0の29.7秒に短縮されました。
* 初期化フェーズは、K2コンパイラーで最大488％高速化されます。たとえば、Anki-Androidプロジェクトでは、インクリメンタルビルドの初期化フェーズがKotlin 1.9.23の0.126秒からKotlin 2.0.0のわずか0.022秒に短縮されました。
* Kotlin K2コンパイラーは、以前のコンパイラーと比較して分析フェーズで最大376％高速です。たとえば、Anki-Androidプロジェクトでは、インクリメンタルビルドの分析時間がKotlin 1.9.23の0.581秒からKotlin 2.0.0のわずか0.122秒に短縮されました。

これらの改善点の詳細、およびK2コンパイラーのパフォーマンスを分析した方法の詳細については、[ブログ投稿](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)を参照してください。

## 言語機能の改善

Kotlin K2コンパイラーは、[スマートキャスト](#smart-casts)および[Kotlin Multiplatform](#kotlin-multiplatform)に関連する言語機能を改善します。

### スマートキャスト

Kotlinコンパイラーは、特定のケースでオブジェクトを自動的に型にキャストできるため、明示的に指定する手間が省けます。これは[スマートキャスト](typecasts#smart-casts)と呼ばれます。Kotlin K2コンパイラーは、以前よりもさらに多くのシナリオでスマートキャストを実行するようになりました。

Kotlin 2.0.0では、次の領域でスマートキャストに関連する改善が行われました。

* [ローカル変数とそれ以降のスコープ](#local-variables-and-further-scopes)
* [論理`or`演算子を使用した型チェック](#type-checks-with-the-logical-or-operator)
* [インライン関数](#inline-functions)
* [関数型を持つプロパティ](#properties-with-function-types)
* [例外処理](#exception-handling)
* [インクリメントおよびデクリメント演算子](#increment-and-decrement-operators)

#### ローカル変数とそれ以降のスコープ

以前は、変数が`if`条件内で`null`ではないと評価された場合、変数はスマートキャストされていました。この変数に関する情報は、`if`ブロックのスコープ内でさらに共有されていました。

ただし、変数を`if`条件の**外**で宣言した場合、変数に関する情報は`if`条件内で利用できなかったため、スマートキャストできませんでした。この動作は、`when`式や`while`ループでも見られました。

Kotlin 2.0.0以降では、`if`、`when`、または`while`条件で使用する前に変数を宣言した場合、コンパイラーによって収集された変数に関する情報は、スマートキャストのために対応するブロックでアクセスできるようになります。

これは、ブール条件を変数に抽出したい場合などに役立ちます。その後、変数に意味のある名前を付けることができ、コードの可読性が向上し、後でコードで変数を再利用できるようになります。例：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // Kotlin 2.0.0では、コンパイラーはisCatに関する情報にアクセスできるため、
        // animalがCat型にスマートキャストされたことを認識しています。
        // したがって、purr()関数を呼び出すことができます。
        // Kotlin 1.9.20では、コンパイラーはスマートキャストについて認識していないため、
        // purr()関数を呼び出すとエラーが発生します。
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```

#### 論理`or`演算子を使用した型チェック

Kotlin 2.0.0では、オブジェクトの型チェックを`or`演算子（`||`）と組み合わせると、スマートキャストが最も近い共通のスーパータイプに対して行われます。この変更前は、スマートキャストは常に`Any`型に対して行われていました。

この場合でも、プロパティにアクセスしたり関数を呼び出したりする前に、オブジェクト型を手動で確認する必要がありました。例：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatusは、共通のスーパータイプStatusにスマートキャストされます
        signalStatus.signal()
        // Kotlin 2.0.0より前は、signalStatusはAny型にスマートキャストされていたため、
        // signal()関数を呼び出すと、未解決の参照エラーが発生しました。signal()関数は、
        // 別の型チェックの後にのみ正常に呼び出すことができます。

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

:::note
共通のスーパータイプは、[union型](https://en.wikipedia.org/wiki/Union_type)の**近似**です。Union型は、[現在Kotlinではサポートされていません](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。

:::

#### インライン関数

Kotlin 2.0.0では、K2コンパイラーはインライン関数を異なる方法で扱い、他のコンパイラー分析と組み合わせて、スマートキャストが安全かどうかを判断できるようにします。

具体的には、インライン関数は暗黙的な[`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)コントラクトを持つものとして扱われるようになりました。これは、インライン関数に渡されるラムダ関数がインプレースで呼び出されることを意味します。ラムダ関数はインプレースで呼び出されるため、コンパイラーはラムダ関数が関数本体に含まれる変数への参照をリークできないことを認識しています。

コンパイラーは、この知識を他のコンパイラー分析と組み合わせて、キャプチャされた変数をスマートキャストすることが安全かどうかを判断します。例：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // Kotlin 2.0.0では、コンパイラーはprocessorがローカル変数であり、
        // inlineAction()がインライン関数であることを認識しているため、processorへの参照を
        // リークすることはできません。したがって、processorをスマートキャストすることは安全です。

        // processorがnullでない場合、processorはスマートキャストされます
        if (processor != null) {
            // コンパイラーはprocessorがnullではないことを認識しているため、安全な呼び出しは
            // 必要ありません
            processor.process()

            // Kotlin 1.9.20では、安全な呼び出しを実行する必要があります。
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 関数型を持つプロパティ

以前のバージョンのKotlinでは、関数型を持つクラスプロパティがスマートキャストされないというバグがありました。Kotlin 2.0.0およびK2コンパイラーでこの動作を修正しました。例：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // Kotlin 2.0.0では、providerがnullでない場合、
        // スマートキャストされます
        if (provider != null) {
            // コンパイラーはproviderがnullではないことを認識しています
            provider()

            // 1.9.20では、コンパイラーはproviderがnullではないことを
            // 認識していないため、エラーが発生します。
            // Reference has a nullable type '(() `->` Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

この変更は、`invoke`演算子をオーバーロードする場合にも適用されます。例：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // 1.9.20では、コンパイラーはエラーを発生させます。
            // Reference has a nullable type 'Provider?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 例外処理

Kotlin 2.0.0では、例外処理を改善し、スマートキャスト情報を`catch`および`finally`ブロックに渡すことができるようにしました。この変更により、コンパイラーがオブジェクトがnullable型かどうかを追跡するため、コードがより安全になります。例：

```kotlin

fun testString() {
    var stringInput: String? = null
    // stringInputはString型にスマートキャストされます
    stringInput = ""
    try {
        // コンパイラーはstringInputがnullではないことを認識しています
        println(stringInput.length)
        // 0

        // コンパイラーはstringInputの以前のスマートキャスト情報を拒否します。
        // 現在、stringInputはString?型を持っています。
        stringInput = null

        // 例外をトリガーする
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // Kotlin 2.0.0では、コンパイラーはstringInputがnullになる可能性があることを
        // 認識しているため、stringInputはnullableのままです。
        println(stringInput?.length)
        // null

        // Kotlin 1.9.20では、コンパイラーは安全な呼び出しは
        // 必要ないと述べていますが、これは正しくありません。
    }
}

fun main() {
    testString()
}
```

#### インクリメントおよびデクリメント演算子

Kotlin 2.0.0より前は、コンパイラーはオブジェクトの型がインクリメントまたはデクリメント演算子の使用後に変更される可能性があることを理解していませんでした。コンパイラーがオブジェクト型を正確に追跡できなかったため、コードが未解決の参照エラーにつながる可能性がありました。Kotlin 2.0.0では、これが修正されました。

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

    // unknownObjectがTauインターフェースから継承されているかどうかを確認します
    // 注：unknownObjectがRhoおよびTauインターフェースの両方から継承される可能性があります。
    if (unknownObject is Tau) {

        // インターフェースRhoからオーバーロードされたinc()演算子を使用します。
        // Kotlin 2.0.0では、unknownObjectの型はSigmaにスマートキャストされます。
        ++unknownObject

        // Kotlin 2.0.0では、コンパイラーはunknownObjectが型Sigmaを持っていることを認識しているため、
        // sigma()関数を正常に呼び出すことができます。
        unknownObject.sigma()

        // Kotlin 1.9.20では、コンパイラーはinc()が呼び出されたときにスマートキャストを
        // 実行しないため、コンパイラーはまだunknownObjectが型Tauを持っていると考えています。
        // sigma()関数を呼び出すと、コンパイル時エラーが発生します。

        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so calling the tau() function throws a compile-time 
        // error.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // Kotlin 1.9.20では、コンパイラーは誤ってunknownObjectが型Tauを
        // 持っていると考えているため、tau()関数を呼び出すことができますが、
        // ClassCastExceptionがスローされます。
    }
}
```

### Kotlin Multiplatform

K2コンパイラーには、次の領域のKotlin Multiplatformに関連する改善があります。

* [コンパイル中の共通ソースとプラットフォームソースの分離](#separation-of-common-and-platform-sources-during-compilation)
* [expectedおよびactual宣言の異なる可視性レベル](#different-visibility-levels-of-expected-and-actual-declarations)

#### コンパイル中の共通ソースとプラットフォームソースの分離

以前は、Kotlinコンパイラーの設計により、コンパイル時に共通ソースセットとプラットフォームソースセットを分離することができませんでした。その結果、共通コードがプラットフォームコードにアクセスする可能性があり、プラットフォーム間で異なる動作が生じました。さらに、共通コードからの一部のコンパイラー設定と依存関係がプラットフォームコードにリークしていました。

Kotlin 2.0.0では、新しいKotlin K2コンパイラーの実装に、共通ソースセットとプラットフォームソースセット間の厳密な分離を保証するためのコンパイルスキームの再設計が含まれています。この変更は、[expected関数とactual関数](multiplatform-expect-actual#expected-and-actual-functions)を使用する場合に最も顕著です。以前は、共通コード内の関数呼び出しがプラットフォームコード内の関数に解決される可能性がありました。例：

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
// JavaScriptプラットフォームにはfoo()関数のオーバーロードはありません
```
</td>
</tr>
</table>

この例では、共通コードは実行されるプラットフォームによって異なる動作をします。

* JVMプラットフォームでは、共通コードで`foo()`関数を呼び出すと、プラットフォームコードから`foo()`関数が`platform foo`として呼び出されます。
* JavaScriptプラットフォームでは、共通コードで`foo()`関数を呼び出すと、プラットフォームコードにそのような関数がないため、共通コードから`foo()`関数が`common foo`として呼び出されます。

Kotlin 2.0.0では、共通コードはプラットフォームコードにアクセスできないため、両方のプラットフォームで`foo()`関数が共通コード内の`foo()`関数に正常に解決されます：`common foo`。

プラットフォーム間での動作の一貫性の向上に加えて、IntelliJ IDEAまたはAndroid Studioとコンパイラーの間で競合する動作があった場合の修正にも取り組みました。たとえば、[expectedクラスとactualクラス](multiplatform-expect-actual#expected-and-actual-classes)を使用した場合、次のようになります。
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
    // 2.0.0より前は、IDEのみのエラーが発生します
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class Identity has no default constructor.
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

この例では、expectedクラス`Identity`にデフォルトコンストラクターがないため、共通コードで正常に呼び出すことができません。以前は、エラーはIDEによってのみ報告されていましたが、コードはJVMで正常にコンパイルされていました。ただし、現在、コンパイラーは正しくエラーを報告します。

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解決動作が変更されない場合

新しいコンパイルスキームへの移行はまだ進行中であるため、同じソースセット内にない関数を呼び出す場合、解決動作は以前と同じです。この違いは、共通コードでマルチプラットフォームライブラリからのオーバーロードを使用する場合に主に気付くでしょう。

署名の異なる2つの`whichFun()`関数を持つライブラリがあるとします。

```kotlin
// Example library

// MODULE: common
fun whichFun(x: Any) = println("common function") 

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

共通コードで`whichFun()`関数を呼び出す場合、ライブラリ内で最も関連性の高い引数型を持つ関数が解決されます。

```kotlin
// JVMターゲットのサンプルライブラリを使用するプロジェクト

// MODULE: common
fun main(){
    whichFun(2) 
    // platform function
}
```

比較すると、同じソースセット内で`whichFun()`のオーバーロードを宣言する場合、コードはプラットフォーム固有のバージョンにアクセスできないため、共通コードからの関数が解決されます。

```kotlin
// サンプルライブラリは使用されていません

// MODULE: common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

マルチプラットフォームライブラリと同様に、`commonTest`モジュールは別のソースセットにあるため、プラットフォーム固有のコードにも引き続きアクセスできます。したがって、`commonTest`モジュール内の関数への呼び出しの解決は、古いコンパイルスキームと同じ動作を示します。

将来的には、これらの残りのケースは新しいコンパイルスキームとより一致するようになります。

#### expectedおよびactual宣言の異なる可視性レベル

Kotlin 2.0.0より前は、Kotlin Multiplatformプロジェクトで[expectedおよびactual宣言](multiplatform-expect-actual)を使用する場合、それらは同じ[可視性レベル](visibility-modifiers)を持つ必要がありました。Kotlin 2.0.0では、異なる可視性レベルもサポートされるようになりましたが、actual宣言がexpected宣言よりも_より_寛容な場合に**のみ**サポートされます。例：

```kotlin
expect internal class Attribute // Visibility is internal
actual class Attribute          // Visibility is public by default,
                                // which is more permissive
```

同様に、actual宣言で[型エイリアス](type-aliases)を使用している場合、**基になる型**の可視性は、expected宣言と同じか、より寛容である必要があります。例：

```kotlin
expect internal class Attribute                 // Visibility is internal
internal actual typealias Attribute = Expanded

class Expanded                                  // Visibility is public by default,
                                                // which is more permissive
```

## Kotlin K2コンパイラーを有効にする方法

Kotlin 2.0.0以降、Kotlin K2コンパイラーはデフォルトで有効になっています。

Kotlinバージョンをアップグレードするには、[Gradle](gradle-configure-project#apply-the-plugin)および[Maven](maven#configure-and-enable-the-plugin)ビルドスクリプトでバージョンを2.0.0以降のリリースに変更します。

IntelliJ IDEAまたはAndroid Studioで最高の体験を得るには、IDEで[K2モードを有効にする](#support-in-ides)ことを検討してください。

### GradleでKotlinビルドレポートを使用する

Kotlin[ビルドレポート](gradle-compilation-and-caches#build-reports)は、Kotlinコンパイラタスクのさまざまなコンパイルフェーズで費やされた時間、使用されたコンパイラとKotlinバージョン、およびコンパイルがインクリメンタルであったかどうかに関する情報を提供します。これらのビルドレポートは、ビルドパフォーマンスを評価するのに役立ちます。[Gradleビルドスキャン](https://scans.gradle.com/)よりもKotlinコンパイルパイプラインに関する詳細な情報を提供します。なぜなら、すべてのGradleタスクのパフォーマンスの概要を提供してくれるからです。

#### ビルドレポートを有効にする方法

ビルドレポートを有効にするには、`gradle.properties`ファイルでビルドレポートの出力の保存場所を宣言します。

```none
kotlin.build.report.output=file
```

次の値とその組み合わせを出力に使用できます。

| オプション | 説明 |
|---|---|
| `file` | 人間が読める形式でビルドレポートをローカルファイルに保存します。デフォルトでは、`${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`になります |
| `single_file` | オブジェクト形式でビルドレポートを指定されたローカルファイルに保存します。 |
| `build_scan` | [ビルドスキャン](https://scans.gradle.com/)の`カスタム値`セクションにビルドレポートを保存します。Gradle Enterpriseプラグインは、カスタム値の数とその長さを制限することに注意してください。大規模なプロジェクトでは、一部の値が失われる可能性があります。 |
| `http` | HTTP(S)を使用してビルドレポートを投稿します。POSTメソッドは、JSON形式でメトリックを送信します。[Kotlinリポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)で送信されるデータの現在のバージョンを確認できます。[このブログ投稿](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)でHTTPエンドポイントのサンプルを見つけることができます。 |
| `json` | ビルドレポートをJSON形式でローカルファイルに保存します。`kotlin.build.report.json.directory`でビルドレポートの場所を設定します。デフォルトでは、`${project_name}-build-<date-time>-<index>.json`という名前になります。 |

ビルドレポートで何ができるかの詳細については、[ビルドレポート](gradle-compilation-and-caches#build-reports)を参照してください。

## IDEでのサポート

デフォルトでは、IntelliJ IDEAとAndroid Studio 2024.1の両方で、コード分析、コード補完、強調表示、およびその他のIDE関連機能に以前のコンパイラーが使用されます。これは、新しいKotlin K2コンパイラーの統合に取り組んでいる間、パフォーマンスと安定性を確保するためです。

新しいKotlin K2コンパイラーで同じ機能を使用する場合は、IntelliJ IDEAおよびAndroid Studio 2024.1からサポートを利用できます。K2モードを有効にするには：

1. IDEで、**設定** | **言語とフレームワーク** | **Kotlin**に移動します。
2. **K2モードを有効にする**オプションを選択します。

K2モードの詳細については、[ブログ](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)を参照してください。

:::note
[安定](components-stability#stability-levels-explained)言語機能は、Kotlin 2.1.0以降で導入する予定です。それまでは、コード分析に以前のコンパイラーを引き続き使用できます。認識されない言語機能によるコードの強調表示の問題は発生しません。

:::

IDEでコード分析に使用するコンパイラーに関係なく、ビルドシステムで使用されるコンパイラーは**独立**しており、ビルドスクリプトで個別に構成されることに注意することが重要です。[ビルドスクリプトでKotlinバージョンをKotlin 2.0.0にアップグレードする](#how-to-enable-the-kotlin-k2-compiler)と、新しいK2コンパイラーはビルドシステムによってのみデフォルトで使用されます。

## Kotlin PlaygroundでKotlin K2コンパイラーを試す

Kotlin Playgroundは、Kotlin 2.0.0以降のリリースをサポートしています。[確認してください！](https://pl.kotl.in/czuoQprce)

## 以前のコンパイラーにロールバックする方法

Kotlin 2.0.0以降のリリースで以前のコンパイラーを使用するには、次のいずれかを実行します。

* `build.gradle.kts`ファイルで、[言語バージョンを設定する](gradle-compiler-options#example-of-setting-languageversion)を`1.9`に設定します。

  OR
* 次のコンパイラーオプションを使用します：`-language-version 1.9`。

## 変更点

新しいフロントエンドの導入により、Kotlinコンパイラーはいくつかの変更を受けました。まず、コードに影響を与える最も重要な変更点を強調表示し、何が変更されたかを説明し、今後のベストプラクティスを詳しく説明します。詳細については、[主題別](#per-subject-area)にこれらの変更を整理して、さらに読みやすくしました。

このセクションでは、次の変更点を強調表示します。

* [バッキングフィールドを持つオープンプロパティの即時初期化](#immediate-initialization-of-open-properties-with-backing-fields)
* [投影されたレシーバーでの非推奨のsynthetic setter](#deprecated-synthetics-setter-on-a-projected-receiver)
* [アクセスできないジェネリック型の使用の禁止](#forbidden-use-of-inaccessible-generic-types)
* [同じ名前のKotlinプロパティとJavaフィールドの一貫した解決順序](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
* [Javaプリミティブ配列のnull安全性の向上](#improved-null-safety-for-java-primitive-arrays)
* [expectedクラスの抽象メンバーに対するより厳格なルール](#stricter-rules-for-abstract-members-in-expected-classes)

### バッキングフィールドを持つオープンプロパティの即時初期化

**変更点：**

Kotlin 2.0では、バッキングフィールドを持つすべての`open`プロパティはすぐに初期化する必要があります。そうでない場合、コンパイルエラーが発生します。以前は、`open var`プロパティのみをすぐに初期化する必要がありましたが、現在はバッキングフィールドを持つ`open val`プロパティにも適用されます。

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // 以前はコンパイルに成功していたKotlin 2.0以降のエラー
        this.a = 1 //Error: open val must have initializer
        // 常にエラー
        this.b = 1 // Error: open var must have initializer
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

この変更により、コンパイラーの動作がより予測可能になります。`open val`プロパティがカスタムセッターを持つ`var`プロパティによってオーバーライドされる例を考えてみましょう。

カスタムセッターを使用する場合、遅延初期化は、バッキングフィールドを初期化するのか、セッターを呼び出すのかが不明確になるため、混乱を招く可能性があります。以前は、セッターを呼び出す場合、古いコンパイラーはセッターがバッキングフィールドを初期化することを保証できませんでした。

**現在のベストプラクティス：**

バッキングフィールドを持つオープンプロパティを常に初期化することをお勧めします。このプラクティスはより効率的でエラーが発生しにくいと考えているためです。

ただし、プロパティをすぐに初期化しない場合は、次のことができます。

* プロパティを`final`にする。
* 遅延初期化を可能にするプライベートバッキングプロパティを使用する。

詳細については、[YouTrackの対応するissue](https://youtrack.jetbrains.com/issue/KT-57555)を参照してください。

### 投影されたレシーバーでの非推奨のsynthetic setter

**変更点：**

Javaクラスのsynthetic setterを使用して、クラスの投影された型と競合する型を割り当てると、エラーがトリガーされます。

`getFoo()`メソッドと`setFoo()`メソッドを含む`Container`という名前のJavaクラスがあるとします。

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

次のKotlinコードがあり、`Container`クラスのインスタンスが投影された型を持っている場合、`setFoo()`メソッドを使用すると常にエラーが生成されます。ただし、Kotlin 2.0.0以降でのみ、synthetic `foo`プロパティがエラーをトリガーします。

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // Kotlin 1.0以降のエラー

    // Synthetic setter `foo`は`setFoo()`メソッドに解決されます
    starProjected.foo = sampleString
    // Kotlin 2.0.0以降のエラー

    inProjected.setFoo(sampleString)
    // Kotlin 1.0以降のエラー

    // Synthetic setter `foo`は`setFoo()`メソッドに解決されます
    inProjected.foo = sampleString
    // Kotlin 2.0.0以降のエラー
}
```

**現在のベストプラクティス：**

この変更によりコードにエラーが発生する場合は、型宣言の構造を見直すことをお勧めします。型投影を使用する必要がない場合や、コードから割り当てを削除する必要がある場合があります。

詳細については、[YouTrackの対応するissue](https://youtrack.jetbrains.com/issue/KT-54309)を参照してください。

### アクセスできないジェネリック型の使用の禁止

**変更点：**

K2コンパイラーの新しいアーキテクチャにより、アクセスできないジェネリック型の処理方法を変更しました。通常、コード内でアクセスできないジェネリック型に依存することは絶対に避けるべきです。これは、プロジェクトのビルド構成に誤りがあり、コンパイラーがコンパイルに必要な情報にアクセスできないことを示しているためです。Kotlin 2.0.0では、アクセスできないジェネリック型で関数リテラルを宣言または呼び出すことはできず、アクセスできないジェネリック型引数を持つジェネリック型を使用することもできません。この制限は、コードの後でコンパイラーエラーを回避するのに役立ちます。

たとえば、あるモジュールでジェネリッククラスを宣言したとします。

```kotlin
// Module one
class Node<V>(val value: V)
```

別のモジュール（モジュール2）があり、モジュール1に依存関係が構成されている場合、コードは`Node<V>`クラスにアクセスして、関数型で型として使用できます。

```kotlin
// Module two
fun execute(func: (Node<Int>) -> Unit) {}
// 関数は正常にコンパイルされます
```

ただし、プロジェクトの構成が誤っており、3番目のモジュール（モジュール3）がモジュール2にのみ依存している場合、Kotlinコンパイラーは3番目のモジュールをコンパイルするときに**モジュール1**の`Node<V>`クラスにアクセスできません。現在、モジュール3で`Node<V>`型を使用するラムダまたは匿名関数は、Kotlin 2.0.0でエラーをトリガーするため、コードの後で回避可能なコンパイラーエラー、クラッシュ、および実行時例外を防ぐことができます。

```kotlin
// Module three
fun test() {
    // 暗黙的なラムダパラメータ（it）の型がアクセスできないNodeに解決されるため、
    // Kotlin 2.0.0でエラーが発生します
    execute {}

    // 未使用のラムダパラメータ（_）の型がアクセスできないNodeに解決されるため、
    // Kotlin 2.0.0でエラーが発生します
    execute { _ -> }

    // 未使用の匿名関数のパラメータ（_）の型がアクセスできないNodeに解決されるため、
    // Kotlin 2.0.0でエラーが発生します
    execute(fun (_) {})
}
```

関数リテラルにアクセスできないジェネリック型の値パラメータが含まれている場合にエラーがトリガーされるだけでなく、型にアクセスできないジェネリック型引数がある場合にもエラーが発生します。

たとえば、モジュール1で同じジェネリッククラス宣言があるとします。モジュール2では、別のジェネリッククラス`Container<C>`を宣言します。さらに、ジェネリッククラス`Node<V>`を型引数として持つ`Container<C>`を使用する関数をモジュール2で宣言します。
<table>
<tr>
<td>
モジュール1
</td>
<td>
モジュール2
</td>
</tr>
<tr>
<td>

```kotlin
// Module one
class Node<V>(val value: V)
```
</td>
<td>

```kotlin
// Module two
class Container<C>(vararg val content: C)

// ジェネリッククラス型を持ち、
// ジェネリッククラス
```
</td>
</tr>
</table>