`[//]: # (title: Kotlin %kotlinEapVersion% の新機能)`

<primary-label ref="eap"/>

_[リリース日: %kotlinEapReleaseDate%](eap.md#build-details)_

> このドキュメントは早期アクセスプレビュー (EAP) リリースのすべての機能を網羅しているわけではありませんが、
> いくつかの主要な改善点に焦点を当てています。
>
> 変更点の全リストは[GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)を参照してください。
>
{style="note"}

Kotlin %kotlinEapVersion% がリリースされました！このEAPリリースの詳細を以下に示します。

*   **言語**: [より安定したデフォルト機能、未使用の戻り値に対する新しいチェッカー、およびコンテキスト依存の解決に対する変更](#language)。
*   **Kotlin/JVM**: [Java 25 のサポート](#kotlin-jvm-support-for-java-25)。
*   **Kotlin/Native**: [Swiftエクスポートによる相互運用性の向上、およびジェネリック型境界における型チェックのデフォルト有効化](#kotlin-native)。
*   **Kotlin/Wasm**: [完全修飾名と新しい例外処理提案のデフォルト有効化](#kotlin-wasm)。
*   **Kotlin/JS**: [新しい試験版の`suspend`関数エクスポートと`LongArray`の表現](#kotlin-js)。
*   **Gradle**: [Gradle 9.0との互換性、および生成されたソースを登録するための新しいAPI](#gradle)。
*   **標準ライブラリ**: [安定版の時間追跡機能](#standard-library)。

## IDEのサポート

Kotlin %kotlinEapVersion% をサポートするKotlinプラグインは、IntelliJ IDEAおよびAndroid Studioの最新バージョンにバンドルされています。
IDEのKotlinプラグインを更新する必要はありません。
必要なのは、ビルドスクリプトでKotlinのバージョンを[ %kotlinEapVersion% に変更](configure-build-for-eap.md)することだけです。

詳細については、[新しいリリースへの更新](releases.md#update-to-a-new-kotlin-version)を参照してください。

## 言語

Kotlin %kotlinEapVersion% は、機能の安定化に焦点を当て、未使用の戻り値に対する新しいチェックメカニズムを導入し、コンテキスト依存の解決を改善します。

### 安定版機能

以前のKotlinリリースでは、いくつかの新しい言語機能が試験版およびベータ版として導入されました。
今回のリリースで、以下の機能が[安定版](components-stability.md#stability-levels-explained)になったことをお知らせいたします。

*   [ネストされた型エイリアスのサポート](whatsnew22.md#support-for-nested-type-aliases)
*   [`when` 式のデータフローに基づく網羅性チェック](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)

### デフォルトで有効になった機能

Kotlin %kotlinEapVersion% では、以下の言語機能がデフォルトで有効になりました。

*   [`suspend`関数型を持つラムダに対するオーバーロード解決の改善](whatsnew2220.md#improved-overload-resolution-for-lambdas-with-suspend-function-types)
*   [明示的な戻り値型を持つ式本体での`return`文のサポート](whatsnew2220.md#support-for-return-statements-in-expression-bodies-with-explicit-return-types)

[Kotlinの言語設計機能と提案の全リストを参照してください](kotlin-language-features-and-proposals.md)。

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

[YouTrack](https://youtrack.jetbrains.com/issue/KT-12719)にてフィードバックをいただけると幸いです。詳細については、この機能の[KEEP]( https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)を参照してください。

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

## Kotlin/JVM: Java 25 のサポート

Kotlin %kotlinEapVersion% 以降、コンパイラはJava 25のバイトコードを含むクラスを生成できるようになります。

## Kotlin/Native

### Swiftエクスポートによる相互運用性の向上
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% は、Swiftエクスポートを通じてKotlinとSwiftの相互運用性をさらに向上させ、ネイティブのenumクラスと可変引数関数のパラメータのサポートを追加します。

以前は、Kotlinのenumは通常のSwiftクラスとしてエクスポートされていました。現在では直接マッピングされ、通常のネイティブSwift enumを使用できます。例えば：

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```Swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    var rgb: Int { get } 
}
```

Kotlinの[`vararg`](functions.md#variable-number-of-arguments-varargs)関数も、Swiftの可変引数関数パラメータに直接マッピングされるようになりました。

このような関数では、可変数の引数を渡すことができます。これは、引数の数が事前にわからない場合や、型を指定せずにコレクションを作成または渡したい場合に便利です。例えば：

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```Swift
// Swift
func log(_ messages: String...)
```

> 可変引数関数のパラメータにおけるジェネリック型はまだサポートされていません。
>
{style="note"}

### デバッグモードでのジェネリック型境界における型チェック

Kotlin %kotlinEapVersion% 以降、デバッグモードでジェネリック型境界における型チェックがデフォルトで有効になり、チェックされないキャストに関連するエラーをより早期に発見できるようになります。この変更により、安全性が向上し、無効なジェネリックキャストのデバッグがプラットフォーム間でより予測可能になります。

これまで、ヒープ汚染やメモリ安全性の違反につながるチェックされないキャストは、Kotlin/Nativeでは見過ごされる可能性がありました。現在、そのようなケースは、Kotlin/JVMやKotlin/JSと同様に、実行時キャストエラーで一貫して失敗するようになりました。例:

```kotlin
fun main() {
    val list = listOf("hello")
    val x = (list as List<Int>)[0]
    println(x) // ClassCastExceptionエラーをスローするようになりました
}
```

このコードは以前は `6` を出力していましたが、現在では予想どおりデバッグモードで `ClassCastException` エラーをスローします。

詳細については、[型チェックとキャスト](typecasts.md)を参照してください。

## Kotlin/Wasm

### 完全修飾名のデフォルト有効化

Kotlin/Wasmターゲットでは、実行時に完全修飾名（FQNs）がデフォルトで有効になっていませんでした。
`KClass.qualifiedName`プロパティのサポートを手動で有効にする必要がありました。

以前は、クラス名（パッケージなし）のみがアクセス可能であり、これは、JVMからWasmターゲットに移植されたコードや、実行時に完全修飾名を期待するライブラリで問題を引き起こしていました。

Kotlin %kotlinEapVersion% では、Kotlin/Wasmターゲットで`KClass.qualifiedName`プロパティがデフォルトで有効になっています。
これは、FQNsが追加の設定なしで実行時に利用できることを意味します。

FQNをデフォルトで有効にすることで、コードのポータビリティが向上し、完全修飾名を表示することで実行時エラーがより情報豊富になります。

この変更は、Latin-1文字列リテラルにコンパクトストレージを使用することでメタデータを削減するコンパイラ最適化のおかげで、コンパイルされたWasmバイナリのサイズを増加させません。

### `wasmWasi`向けに新しい例外処理提案がデフォルトで有効化

以前は、Kotlin/Wasmは[`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi)を含むすべてのターゲットに対して、[レガシー例外処理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)を使用していました。しかし、ほとんどのスタンドアロンWebAssembly仮想マシン（VM）は、[新しいバージョンの例外処理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)に準拠しています。

Kotlin %kotlinEapVersion% 以降、新しいWebAssembly例外処理提案が`wasmWasi`ターゲットでデフォルトで有効になり、最新のWebAssemblyランタイムとの互換性が向上します。

`wasmWasi`ターゲットの場合、この変更を早期に導入しても安全です。これは、そのターゲットを対象とするアプリケーションは通常、多様性の低いランタイム環境（多くの場合、単一の特定のVM上で実行）で動作し、ユーザーによって制御されることが多いため、互換性の問題のリスクが軽減されるためです。

新しい例外処理提案は、[`wasmJs`ターゲット](wasm-overview.md#kotlin-wasm-and-compose-multiplatform)ではデフォルトで無効のままです。
`-Xwasm-use-new-exception-proposal`コンパイラオプションを使用して手動で有効にすることができます。

## Kotlin/JS

### `JsExport`による`suspend`関数の新しいエクスポート
<primary-label ref="experimental-opt-in"/>

以前は、`@JsExport`アノテーションは、`suspend`関数（またはそのような関数を含むクラスやインターフェース）をJavaScriptにエクスポートすることを許可していませんでした。各`suspend`関数を手動でラップする必要があり、これは煩雑でエラーが発生しやすいものでした。

Kotlin %kotlinEapVersion% 以降、`suspend`関数は`@JsExport`アノテーションを使用してJavaScriptに直接エクスポートできます。

`suspend`関数のエクスポートを有効にすることで、ボイラープレートコードの必要性が排除され、Kotlin/JSとJavaScript/TypeScript (JS/TS) の相互運用性が向上します。Kotlinの非同期関数は、追加のコードなしでJS/TSから直接呼び出すことができるようになります。

この機能を有効にするには、`build.gradle.kts` ファイルに以下のコンパイラオプションを追加します。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-XXLanguage:+JsAllowExportingSuspendFunctions")
    }
}
```

有効にすると、`@JsExport`アノテーションでマークされたクラスや関数は、追加のラッパーなしで`suspend`関数を含めることができます。

それらは通常のJavaScript非同期関数として利用でき、非同期関数としてオーバーライドすることもできます。

```kotlin
@JsExport
open class Foo {
    suspend fun foo() = "Foo"
}
```

```typescript
class Bar extends Foo {
    override async foo(): Promise<string> {
        return "Bar"
    }
}
```

この機能は[試験的](components-stability.md#stability-levels-explained)です。課題トラッカーの[YouTrack](https://youtrack.jetbrains.com/issue/KT-56281/KJS-Cant-export-suspend-functions)にてフィードバックをいただけると幸いです。

### Kotlinの`LongArray`型を表現するための`BigInt64Array`型の使用
<primary-label ref="experimental-opt-in"/>

以前、Kotlin/JSは`LongArray`をJavaScriptの`Array<bigint>`として表現していました。このアプローチは機能しましたが、型付き配列を期待するJavaScript APIとの相互運用性には理想的ではありませんでした。

今回のリリースから、Kotlin/JSはJavaScriptにコンパイルする際に、Kotlinの`LongArray`値を表現するためにJavaScript組み込みの`BigInt64Array`型を使用するようになりました。

`BigInt64Array`を使用することで、型付き配列を使用するJavaScript APIとの相互運用が簡素化されます。また、`LongArray`を受け取る、または返すAPIをKotlinからJavaScriptへより自然にエクスポートできるようになります。

この機能を有効にするには、`build.gradle.kts` ファイルに以下のコンパイラオプションを追加します。

```kotlin
kotlin {
    js {
        // ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

この機能は[試験的](components-stability.md#stability-levels-explained)です。課題トラッカーの[YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray)にてフィードバックをいただけると幸いです。

## Gradle

Kotlin %kotlinEapVersion% は、Gradle 7.6.3から9.0.0まで完全に互換性があります。最新のGradleリリースまでのGradleバージョンも使用できます。ただし、そのようにすると非推奨の警告が表示され、一部の新しいGradle機能が動作しない可能性があることに注意してください。

さらに、サポートされるAndroid Gradleプラグインの最小バージョンは8.2.2となり、最大バージョンは8.13.0です。

### Gradleプロジェクトで生成されたソースを登録するための新しいAPI
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% は、Gradleプロジェクトで生成されたソースを登録するために使用できる、[`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/)インターフェースに新しい[試験的](components-stability.md#stability-levels-explained)APIを導入します。

この新しいAPIは、IDEが生成されたコードと通常のソースファイルを区別するのに役立つ、開発体験を向上させる機能です。このAPIにより、IDEは生成されたコードをUIで異なる方法でハイライトし、プロジェクトがインポートされたときに生成タスクをトリガーできるようになります。現在、IntelliJ IDEAでのこのサポートの追加に取り組んでいます。このAPIは、[KSP](ksp-overview.md) (Kotlin Symbol Processing) のような、コードを生成するサードパーティのプラグインやツールにとっても特に有用です。

KotlinまたはJavaファイルを含むディレクトリを登録するには、`build.gradle(.kts)`ファイルで[`SourceDirectorySet`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.file/-source-directory-set/index.html)型の`generatedKotlin`プロパティを使用します。例えば：

```kotlin
val generatorTask = project.tasks.register("generator") {
    val outputDirectory = project.layout.projectDirectory.dir("src/main/kotlinGen")
    outputs.dir(outputDirectory)
    doLast {
        outputDirectory.file("generated.kt").asFile.writeText(
            // language=kotlin
            """
            fun printHello() {
                println("hello")
            }
            """.trimIndent()
        )
    }
}

kotlin.sourceSets.getByName("main").generatedKotlin.srcDir(generatorTask)
```

この例では、出力ディレクトリを`"src/main/kotlinGen"`とする新しいタスク`"generator"`を作成します。タスクが実行されると、`doLast {}`ブロックが出力ディレクトリに`generated.kt`ファイルを作成します。最後に、この例はタスクの出力を生成されたソースとして登録します。

新しいAPIの一部として、`allKotlinSources`プロパティは`KotlinSourceSet.kotlin`および`KotlinSourceSet.generatedKotlin`プロパティに登録されたすべてのソースへのアクセスを提供します。

## 標準ライブラリ

Kotlin %kotlinEapVersion% では、新しい時間追跡機能である[`kotlin.time.Clock` と `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)が[安定版](components-stability.md#stability-levels-explained)になりました。

## Composeコンパイラ: 縮小されたAndroidアプリケーションのスタックトレース

Kotlin 2.3.0以降、アプリケーションがR8によって縮小されると、コンパイラはComposeのスタックトレース用のProGuardマッピングを出力します。これは、以前はデバッグ可能なバリアントでのみ利用可能だった試験版のスタックトレース機能を拡張します。

スタックトレースのリリースバリアントには、実行時にソース情報を記録するオーバーヘッドなしで、縮小されたアプリケーション内のコンポーザブル関数を識別するために使用できるグループキーが含まれています。グループキースタックトレースを使用するには、アプリケーションがComposeランタイム1.10以降でビルドされている必要があります。

グループキースタックトレースを有効にするには、`@Composable`コンテンツを初期化する前に以下の行を追加します。

```kotlin
Composer.setDiagnosticStackTraceMode(ComposeStackTraceMode.GroupKeys)
```

これらのスタックトレースが有効になっている場合、アプリが縮小されている場合でも、Composeランタイムは、コンポジション、測定、または描画パス中にクラッシュが捕捉された後、独自のスタックトレースを追加します。

```text
java.lang.IllegalStateException: <message>
          at <original trace>
Suppressed: androidx.compose.runtime.DiagnosticComposeException: Composition stack when thrown:
         at $compose.m$123(SourceFile:1)
         at $compose.m$234(SourceFile:1)
          ...
```

このモードでJetpack Compose 1.10によって生成されたスタックトレースには、まだ難読化を解除する必要があるグループキーのみが含まれています。これはKotlin 2.3.0リリースで対処され、ComposeコンパイラのGradleプラグインがR8によって生成されるProGuardマッピングファイルにグループキーエントリを追加するようになりました。コンパイラが一部の関数のマッピングを作成できない場合に新しい警告が表示される場合は、[Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126)に報告してください。

> ComposeコンパイラGradleプラグインは、R8マッピングファイルへの依存関係があるため、
> ビルドでR8が有効になっている場合にのみ、グループキースタックトレースの難読化解除マッピングを作成します。
>
{style="note"}