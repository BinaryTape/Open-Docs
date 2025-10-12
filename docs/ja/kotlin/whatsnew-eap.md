`[//]: # (title: Kotlin %kotlinEapVersion% の新機能)`

_[リリース日: %kotlinEapReleaseDate%](eap.md#build-details)_

> このドキュメントは早期アクセスプレビュー (EAP) リリースのすべての機能を網羅しているわけではありませんが、
> いくつかの主要な改善点に焦点を当てています。
>
> 変更点の全リストは[GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)を参照してください。
>
{style="note"}

Kotlin %kotlinEapVersion% がリリースされました！このEAPリリースの詳細の一部を以下に示します。

*   [機能の安定化: ネストされた型エイリアス、網羅的な `when`、新しい時間追跡機能](#stable-features)
*   [言語: 未使用の戻り値チェッカーとコンテキスト依存の解決における変更](#language)
*   [Kotlin/Native: デバッグモードでのジェネリック型境界における型チェックのデフォルト有効化](#kotlin-native-type-checks-on-generic-type-boundaries-in-debug-mode)

## IDEのサポート

Kotlin %kotlinEapVersion% をサポートするKotlinプラグインは、IntelliJ IDEAおよびAndroid Studioの最新バージョンにバンドルされています。
IDEのKotlinプラグインを更新する必要はありません。
必要なのは、ビルドスクリプトでKotlinのバージョンを[ %kotlinEapVersion% に変更](configure-build-for-eap.md)することだけです。

詳細については、[新しいリリースへの更新](releases.md#update-to-a-new-kotlin-version)を参照してください。

## 安定版機能

以前のKotlinリリースでは、いくつかの新しい言語機能と標準ライブラリ機能が試験版およびベータ版として導入されました。
今回のリリースで、以下の機能が[安定版](components-stability.md#stability-levels-explained)になったことをお知らせいたします。

*   [ネストされた型エイリアスのサポート](whatsnew22.md#support-for-nested-type-aliases)
*   [`when` 式のデータフローに基づく網羅性チェック](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)
*   [新しい時間追跡機能: `kotlin.time.Clock` と `kotlin.time.Instant` ](whatsnew2120.md#new-time-tracking-functionality)

[Kotlinの言語設計機能と提案の全リストを参照してください](kotlin-language-features-and-proposals.md)。

## 言語

Kotlin %kotlinEapVersion% は、未使用の戻り値について新しいチェックメカニズムを導入し、
コンテキスト依存の解決の改善に焦点を当てています。

### 未使用の戻り値チェッカー
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% は、未使用の戻り値チェッカーという新しい機能を導入します。
この機能は、式が `Unit` または `Nothing` 以外の値を返し、それが関数に渡されたり、条件でチェックされたり、その他の方法で使用されたりしない場合に警告します。
これは、関数呼び出しが意味のある結果を生成するにもかかわらず、その結果がサイレントに破棄され、予期せぬ動作や追跡が困難な問題につながる可能性があるバグを検出するのに役立ちます。

> チェッカーは、`++` や `--` などのインクリメント操作から返される値を無視します。
>
{style="note"}

次の例を考えてみましょう。

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // チェッカーはこの結果が無視されていることを警告します
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

この例では、文字列が作成されても使用されないため、チェッカーはそれを無視された結果として報告します。

この機能は[試験的](components-stability.md#stability-levels-explained)です。
この機能を利用するには、`build.gradle.kts` ファイルに以下のコンパイラオプションを追加します。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

このオプションを使用すると、チェッカーは、Kotlin標準ライブラリのほとんどの関数のように、マークされた式からの無視された結果のみを報告します。
関数をマークするには、チェッカーに無視された戻り値を報告させたいスコープに `@MustUseReturnValues` アノテーションを使用します。
たとえば、ファイル全体をマークできます。

```kotlin
// このファイル内のすべての関数とクラスをマークし、チェッカーが未使用の戻り値を報告するようにします
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

または特定のクラスをマークできます。

```kotlin
// このクラス内のすべての関数をマークし、チェッカーが未使用の戻り値を報告するようにします
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

`full` モードを使用してプロジェクト全体をマークすることもできます。
そのためには、`build.gradle.kts` ファイルに以下のコンパイラオプションを追加します。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

このモードでは、Kotlinはコンパイルされたファイルを `@MustUseReturnValues` でアノテーションされているかのように自動的に扱い、チェッカーはプロジェクトの関数からのすべての戻り値に適用されます。
特定の関数で警告を抑制するには、`@IgnorableReturnValue` アノテーションを付けてマークします。
`MutableList.add` のように、結果を無視することが一般的で期待される関数にアノテーションを付けます。

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```
関数自体を無視可能としてマークせずに警告を抑制することもできます。
これを行うには、結果をアンダースコア構文 (`_`) を持つ特別な無名変数に割り当てます。

```kotlin
// 無視できない関数
fun computeValue(): Int = 42

fun main() {

    // 警告を報告: 結果は無視されます
    computeValue()

    // この呼び出し箇所でのみ、特別な未使用変数で警告を抑制します
    val _ = computeValue()
}
```

[YouTrack](https://youtrack.jetbrains.com/issue/KT-12719)にてフィードバックをいただけると幸いです。詳細については、この機能の[KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)を参照してください。

### コンテキスト依存の解決における変更
<primary-label ref="experimental-general"/>

> IntelliJ IDEAでのこの機能のコード分析、コード補完、およびハイライトのサポートは、現在[2025.3 EAPビルド](https://www.jetbrains.com/idea/nextversion/)でのみ利用可能です。
>
{style = "note"}

コンテキスト依存の解決は依然として[試験的](components-stability.md#stability-levels-explained)ですが、
ユーザーからのフィードバックに基づいて機能の改善を続けています。

*   現在の型のシールド型および囲んでいるスーパータイプが、検索のコンテキストスコープの一部として考慮されるようになりました。
    他のスーパータイプスコープは考慮されません。
*   型演算子や等価性を持つケースでは、コンパイラはコンテキスト依存の解決を使用することで解決が曖昧になる場合に警告を報告するようになりました。
    これは、たとえば、クラスの競合する宣言がインポートされた場合に発生する可能性があります。

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md)で現在の提案の全文を参照してください。

## Kotlin/Native: デバッグモードでのジェネリック型境界における型チェック

Kotlin %kotlinEapVersion% 以降、デバッグモードでジェネリック型境界における型チェックがデフォルトで有効になり、
チェックされないキャストに関連するエラーをより早期に発見できるようになります。この変更により、安全性が向上し、無効な
ジェネリックキャストのデバッグがプラットフォーム間でより予測可能になります。

これまで、ヒープ汚染やメモリ安全性の違反につながるチェックされないキャストは、Kotlin/Nativeでは見過ごされる可能性がありました。
現在、そのようなケースは、Kotlin/JVMやKotlin/JSと同様に、実行時キャストエラーで一貫して失敗するようになりました。例:

```kotlin
fun main() {
    val list = listOf("hello")
    val x = (list as List<Int>)[0]
    println(x) // ClassCastExceptionエラーをスローするようになりました
}
```

このコードは以前は `6` を出力していましたが、現在では予想どおりデバッグモードで `ClassCastException` エラーをスローします。
詳細については、[型チェックとキャスト](typecasts.md)を参照してください。

## Gradle: Kotlin/JVM コンパイルでBuild Tools APIがデフォルトで使用されるように
<primary-label ref="experimental-general"/>

Kotlin 2.3.0-Beta1では、Kotlin GradleプラグインのKotlin/JVMコンパイルで[Build Tools API](build-tools-api.md) (BTA) がデフォルトで使用されるようになりました。
これは、内部コンパイルインフラストラクチャにおける重要な変更です。

今回のリリースでBTAをデフォルトとしたのは、テスト期間を設けるためです。これまでどおりすべてが動作すると予想しています。
何か問題に気づいた場合は、[課題トラッカー](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration)でフィードバックを共有してください。

Kotlin 2.3.0-Beta2ではKotlin/JVMコンパイルのBTAを再度無効にし、Kotlin 2.3.20からはすべてのユーザーに対して完全に有効化する予定です。