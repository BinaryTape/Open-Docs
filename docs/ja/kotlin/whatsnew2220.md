[//]: # (title: Kotlin 2.2.20 の新機能)

_[公開日: 2025年9月10日](releases.md#release-details)_

<tldr><p>バグ修正リリース 2.2.21 の詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21">変更履歴</a>をご覧ください。</p></tldr>

Kotlin 2.2.20 がリリースされ、Web開発に重要な変更が加えられました。[Kotlin/Wasm は現在ベータ版](#kotlin-wasm)であり、
[JavaScript相互運用における例外処理の改善](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop)、
[npm依存関係管理](#separated-npm-dependencies)、[組み込みのブラウザデバッグサポート](#support-for-debugging-in-browsers-without-configuration)、
および[jsおよびwasmJsターゲット用の新しい共有ソースセット](#shared-source-set-for-js-and-wasmjs-targets)が含まれています。

さらに、主なハイライトは次のとおりです。

*   **Kotlin Multiplatform**: [Swiftエクスポートがデフォルトで利用可能に](#swift-export-available-by-default)、[Kotlinライブラリの安定したクロスプラットフォームコンパイル](#stable-cross-platform-compilation-for-kotlin-libraries)、および[共通依存関係を宣言するための新しいアプローチ](#new-approach-for-declaring-common-dependencies)。
*   **言語**: [suspend関数型を持つオーバーロードにラムダを渡す際のオーバーロード解決の改善](#improved-overload-resolution-for-lambdas-with-suspend-function-types)。
*   **Kotlin/Native**: [Xcode 26のサポート、スタックカナリア、およびリリースバイナリのバイナリサイズの縮小](#kotlin-native)。
*   **Kotlin/JS**: [Kotlinの`Long`値がJavaScriptの`BigInt`型にコンパイル](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type)。

> Web向けCompose Multiplatformがベータ版になりました。詳細は[ブログ記事](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/)をご覧ください。
>
{style="note"}

この動画で、アップデートの簡単な概要もご覧いただけます。

<video src="https://www.youtube.com/v/QWpp5-LlTqA" title="Kotlin 2.2.21 の新機能"/>

## IDEサポート

Kotlin 2.2.20をサポートするKotlinプラグインは、IntelliJ IDEAおよびAndroid Studioの最新バージョンにバンドルされています。
更新するには、ビルドスクリプトでKotlinのバージョンを2.2.20に変更するだけです。

詳細は[新しいリリースへの更新](releases.md#update-to-a-new-kotlin-version)をご覧ください。

## 言語

Kotlin 2.2.20では、Kotlin 2.3.0で計画されている今後の言語機能を試すことができます。これには、
[suspend関数型を持つオーバーロードにラムダを渡す際のオーバーロード解決の改善](#improved-overload-resolution-for-lambdas-with-suspend-function-types)と
[明示的な戻り値型を持つ式本体での`return`文のサポート](#support-for-return-statements-in-expression-bodies-with-explicit-return-types)が含まれます。このリリースには、
[when`式の網羅性チェックの改善](#data-flow-based-exhaustiveness-checks-for-when-expressions)、
[reified `Throwable`キャッチのサポート](#support-for-reified-types-in-catch-clauses)、および[Kotlinコントラクトの改善](#improved-kotlin-contracts)も含まれます。

### suspend関数型を持つラムダのオーバーロード解決の改善

これまで、通常の関数型と`suspend`関数型の両方で関数をオーバーロードすると、ラムダを渡す際にオーバーロード解決の曖昧性エラーが発生していました。明示的な型キャストでこのエラーを回避できましたが、コンパイラは`No cast needed`という警告を誤って報告していました。

```kotlin
// Defines two overloads
fun transform(block: () -> Int) {}
fun transform(block: suspend () -> Int) {}

fun test() {
    // Fails with overload resolution ambiguity
    transform({ 42 })

    // Uses an explicit cast, but the compiler incorrectly reports 
    // a "No cast needed" warning
    transform({ 42 } as () -> Int)
}
```

この変更により、通常の関数型と`suspend`関数型の両方のオーバーロードを定義した場合、キャストなしのラムダは通常のオーバーロードに解決されます。`suspend`キーワードを使用して、明示的にsuspendオーバーロードに解決してください。

```kotlin
// Resolves to transform(() -> Int)
transform({ 42 })

// Resolves to transform(suspend () -> Int)
transform(suspend { 42 })
```

この挙動はKotlin 2.3.0でデフォルトで有効になります。今すぐテストするには、以下のコンパイラオプションを使用して言語バージョンを`2.3`に設定してください。

```kotlin
-language-version 2.3
```

または、`build.gradle(.kts)`ファイルで設定してください。

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-23610)でフィードバックをお寄せいただけると幸いです。

### 明示的な戻り値型を持つ式本体での`return`文のサポート

これまで、式本体で`return`を使用すると、関数の戻り値型が`Nothing`と推論される可能性があったため、コンパイラエラーが発生していました。

```kotlin
fun example() = return 42
// Error: Returns are prohibited for functions with an expression body
```

この変更により、戻り値型が明示的に記述されている限り、式本体で`return`を使用できるようになりました。

```kotlin
// Specifies the return type explicitly
fun getDisplayNameOrDefault(userId: String?): String = getDisplayName(userId ?: return "default")

// Fails because it doesn't specify the return type explicitly
fun getDisplayNameOrDefault(userId: String?) = getDisplayName(userId ?: return "default")
```

同様に、式本体を持つ関数内のラムダおよびネストされた式内の`return`文は、意図せずにコンパイルされていました。Kotlinは、戻り値型が明示的に指定されている限り、これらのケースをサポートするようになりました。明示的な戻り値型がないケースはKotlin 2.3.0で非推奨になります。

```kotlin
// Return type isn't explicitly specified, and the return statement is inside a lambda
// which will be deprecated
fun returnInsideLambda() = run { return 42 }

// Return type isn't explicitly specified, and the return statement is inside the initializer
// of a local variable, which will be deprecated
fun returnInsideIf() = when {
    else -> {
        val result = if (someCondition()) return "" else "value"
        result
    }
}
```

この挙動はKotlin 2.3.0でデフォルトで有効になります。今すぐテストするには、以下のコンパイラオプションを使用して言語バージョンを`2.3`に設定してください。

```kotlin
-language-version 2.3
```

または、`build.gradle(.kts)`ファイルで設定してください。

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-76926)でフィードバックをお寄せいただけると幸いです。

### `when`式のデータフローに基づく網羅性チェック
<primary-label ref="experimental-opt-in"/>

> IntelliJ IDEAでのこの機能のコード分析、コード補完、ハイライトのサポートは、現在[2025.3 EAPビルド](https://www.jetbrains.com/idea/nextversion/)でのみ利用可能です。
>
{style = "note"}

Kotlin 2.2.20では、`when`式の**データフローに基づく**網羅性チェックが導入されました。
これまで、コンパイラのチェックは`when`式自体に限定されており、冗長な`else`ブランチを追加せざるを得ないことがよくありました。
このアップデートにより、コンパイラは以前の条件チェックと早期リターンを追跡するようになり、冗長な`else`ブランチを削除できるようになりました。

たとえば、コンパイラは`if`条件が満たされたときに関数がリターンすることを認識するため、`when`式は残りのケースを処理するだけで済みます。

```kotlin
enum class UserRole { ADMIN, MEMBER, GUEST }

fun getPermissionLevel(role: UserRole): Int {
    // Covers the Admin case outside of the when expression
    if (role == UserRole.ADMIN) return 99

    return when (role) {
        UserRole.MEMBER -> 10
        UserRole.GUEST -> 1
        // このelseブランチを含める必要がなくなりました
        // else -> throw IllegalStateException()
    }
}
```

この機能は[Experimental](components-stability.md#stability-levels-explained)です。
これを有効にするには、`build.gradle(.kts)`ファイルに以下のコンパイラオプションを追加してください。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xdata-flow-based-exhaustiveness")
    }
}
```

### `catch`句におけるreified型のサポート
<primary-label ref="experimental-opt-in"/>

> IntelliJ IDEAでのこの機能のコード分析、コード補完、ハイライトのサポートは、現在[2025.3 EAPビルド](https://www.jetbrains.com/idea/nextversion/)でのみ利用可能です。
> 
{style = "note"}

Kotlin 2.2.20では、コンパイラは`inline`関数の`catch`句で[reifiedジェネリック型パラメータ](inline-functions.md#reified-type-parameters)の使用を許可するようになりました。

例を示します。

```kotlin
inline fun <reified ExceptionType : Throwable> handleException(block: () -> Unit) {
    try {
        block()
        // この変更後、これは許可されます
    } catch (e: ExceptionType) {
        println("Caught specific exception: ${e::class.simpleName}")
    }
}

fun main() {
    // IOExceptionをスローする可能性のあるアクションを実行しようとします
    handleException<java.io.IOException> {
        throw java.io.IOException("File not found")
    }
    // Caught specific exception: IOException
}
```

これまで、`inline`関数でreified `Throwable`型をキャッチしようとするとエラーが発生していました。

この挙動はKotlin 2.4.0でデフォルトで有効になります。
今すぐ使用するには、`build.gradle(.kts)`ファイルに以下のコンパイラオプションを追加してください。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-reified-type-in-catch")
    }
}
```

Kotlinチームは、外部コントリビューターの[Iven Krall](https://github.com/kralliv)氏の貢献に感謝いたします。

### Kotlinコントラクトの改善
<primary-label ref="experimental-opt-in"/>

> IntelliJ IDEAでのこの機能のコード分析、コード補完、ハイライトのサポートは、現在[2025.3 EAPビルド](https://www.jetbrains.com/idea/nextversion/)でのみ利用可能です。
>
{style = "note"}

Kotlin 2.2.20では、[Kotlinコントラクト](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/contract.html)にいくつかの改善が導入されました。これには以下が含まれます。

*   [コントラクト型アサーションにおけるジェネリクスのサポート](#support-for-generics-in-contract-type-assertions)。
*   [プロパティアクセサーおよび特定の演算子関数内でのコントラクトのサポート](#support-for-contracts-inside-property-accessors-and-specific-operator-functions)。
*   [コントラクトにおける`returnsNotNull()`関数のサポート](#support-for-the-returnsnotnull-function-in-contracts) (条件が満たされたときに非nullの戻り値を保証する手段として)。
*   [新しい`holdsIn`キーワード](#new-holdsin-keyword)。ラムダ内で条件が`true`であると仮定することを可能にします。

これらの改善は[Experimental](components-stability.md#stability-levels-explained)です。オプトインするには、コントラクトを宣言する際に`@OptIn(ExperimentalContracts::class)`アノテーションを使用する必要があります。`holdsIn`キーワードと`returnsNotNull()`関数も`@OptIn(ExperimentalExtendedContracts::class)`アノテーションを必要とします。

これらの改善を使用するには、以下の各セクションで説明されているコンパイラオプションも追加する必要があります。

弊社の[課題トラッカー](https://kotl.in/issue)でフィードバックをお寄せいただけると幸いです。

#### コントラクト型アサーションにおけるジェネリクスのサポート

ジェネリック型に対して型アサーションを実行するコントラクトを記述できるようになりました。

```kotlin
import kotlin.contracts.*

sealed class Failure {
    class HttpError(val code: Int) : Failure()
    // Insert other failure types here
}

sealed class Result<out T, out F : Failure> {
    class Success<T>(val data: T) : Result<T, Nothing>()
    class Failed<F : Failure>(val failure: F) : Result<Nothing, F>()
}

@OptIn(ExperimentalContracts::class)
// ジェネリック型をアサートするためにコントラクトを使用します
fun <T, F : Failure> Result<T, F>.isHttpError(): Boolean {
    contract {
        returns(true) implies (this@isHttpError is Result.Failed<Failure.HttpError>)
    }
    return this is Result.Failed && this.failure is Failure.HttpError
}
```

この例では、コントラクトが`Result`オブジェクトに対して型アサーションを実行し、コンパイラが安全に[スマートキャスト](typecasts.md#smart-casts)してアサートされたジェネリック型にすることを可能にします。

この機能は[Experimental](components-stability.md#stability-levels-explained)です。オプトインするには、`build.gradle(.kts)`ファイルに以下のコンパイラオプションを追加してください。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### プロパティアクセサーおよび特定の演算子関数内でのコントラクトのサポート

プロパティアクセサーと特定の演算子関数内でコントラクトを定義できるようになりました。
これにより、より多くの種類の宣言でコントラクトを使用できるようになり、柔軟性が向上します。

たとえば、ゲッター内でコントラクトを使用して、レシーバーオブジェクトのスマートキャストを有効にできます。

```kotlin
import kotlin.contracts.*

val Any.isHelloString: Boolean
    get() {
        @OptIn(ExperimentalContracts::class)
        // ゲッターがtrueを返すときにレシーバーをStringにスマートキャストできるようにします
        contract { returns(true) implies (this@isHelloString is String) }
        return "hello" == this
    }

fun printIfHelloString(x: Any) {
    if (x.isHelloString) {
        // レシーバーをStringにスマートキャストした後、長さを出力します
        println(x.length)
        // 5
    }
}
```

さらに、以下の演算子関数でコントラクトを使用できます。

*   `invoke`
*   `contains`
*   `rangeTo`、`rangeUntil`
*   `componentN`
*   `iterator`
*   `unaryPlus`、`unaryMinus`、`not`
*   `inc`、`dec`

ここでは、演算子関数でコントラクトを使用してラムダ内の変数の初期化を保証する例を示します。

```kotlin
import kotlin.contracts.*

class Runner {
    @OptIn(ExperimentalContracts::class)
    // ラムダ内で割り当てられた変数の初期化を有効にします
    operator fun invoke(block: () -> Unit) {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        block()
    }
}

fun testOperator(runner: Runner) {
    val number: Int
    runner {
        number = 1
    }
    // コントラクトによって保証された明確な初期化の後、値を出力します
    println(number)
    // 1
}
```

この機能は[Experimental](components-stability.md#stability-levels-explained)です。オプトインするには、`build.gradle(.kts)`ファイルに以下のコンパイラオプションを追加してください。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### コントラクトにおけるreturnsNotNull()関数のサポート

Kotlin 2.2.20では、コントラクト用の[`returnsNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/returns-not-null.html)関数が導入されました。
この関数を使用して、特定の条件が満たされたときに、関数が非null値を返すことを保証できます。
これにより、nullableとnon-nullableの関数オーバーロードを個別に用意する代わりに、単一の簡潔な関数でコードを簡素化できます。

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun decode(encoded: String?): String? {
    contract {
        // 入力が非nullの場合に非nullの戻り値を保証します
        (encoded != null) implies (returnsNotNull())
    }
    if (encoded == null) return null
    return java.net.URLDecoder.decode(encoded, "UTF-8")
}

fun useDecodedValue(s: String?) {
    // 戻り値がnullになる可能性があるため、セーフコールを使用します
    decode(s)?.length
    if (s != null) {
        // スマートキャスト後、戻り値を非nullとして扱います
        decode(s).length
    }
}
```

この例では、`decode()`関数内のコントラクトにより、入力が非nullの場合にコンパイラが戻り値をスマートキャストできるようになり、余分なnullチェックや複数のオーバーロードの必要がなくなります。

この機能は[Experimental](components-stability.md#stability-levels-explained)です。オプトインするには、`build.gradle(.kts)`ファイルに以下のコンパイラオプションを追加してください。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-condition-implies-returns-contracts")
    }
}
```

#### 新しい`holdsIn`キーワード

Kotlin 2.2.20では、コントラクト用の新しい[`holdsIn`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/holds-in.html)キーワードが導入されました。
これを使用して、特定のラムダ内でブール条件が`true`であると仮定されることを保証できます。これにより、コントラクトを使用して条件付きスマートキャストを持つDSLを構築できます。

例を示します。

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun <T> T.alsoIf(condition: Boolean, block: (T) -> Unit): T {
    contract {
        // ラムダが最大1回実行されることを宣言します
        callsInPlace(block, InvocationKind.AT_MOST_ONCE)
        // 条件がラムダ内でtrueであると仮定されることを宣言します
        condition holdsIn block
    }
    if (condition) block(this)
    return this
}

fun useApplyIf(input: Any) {
    val result = listOf(1, 2, 3)
        .first()
        .alsoIf(input is Int) {
            // 入力パラメータはラムダ内でIntにスマートキャストされます
            // 入力とリストの最初の要素の合計を出力します
            println(input + it)
            // 2
        }
        .toString()
}
```

この機能は[Experimental](components-stability.md#stability-levels-explained)です。オプトインするには、`build.gradle(.kts)`ファイルに以下のコンパイラオプションを追加してください。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-holdsin-contract")
    }
}
```

## Kotlin/JVM: `when`式での`invokedynamic`のサポート
<primary-label ref="experimental-opt-in"/> 

Kotlin 2.2.20では、`when`式を`invokedynamic`でコンパイルできるようになりました。これまで、複数の型チェックを含む`when`式は、バイトコードで長い`instanceof`チェックの連鎖にコンパイルされていました。

現在では、以下の条件が満たされた場合、Javaの`switch`ステートメントによって生成されるバイトコードと同様に、`invokedynamic`を`when`式で使用してより小さなバイトコードを生成できます。

*   `else`を除くすべての条件が`is`または`null`チェックであること。
*   式に[ガード条件 (`if`)](control-flow.md#guard-conditions-in-when-expressions)が含まれていないこと。
*   条件に、変更可能なKotlinコレクション (`MutableList`) や関数型 (`kotlin.Function1`、`kotlin.Function2`など) のように直接型チェックできない型が含まれていないこと。
*   `else`以外に少なくとも2つの条件があること。
*   すべてのブランチが`when`式の同じ主題をチェックしていること。

たとえば、以下のようになります。

```kotlin
open class Example

class A : Example()
class B : Example()
class C : Example()

fun test(e: Example) = when (e) {
    // SwitchBootstraps.typeSwitchでinvokedynamicを使用します
    is A -> 1
    is B -> 2
    is C -> 3
    else -> 0
}
```

この新機能が有効になると、この例の`when`式は、複数の`instanceof`チェックの代わりに単一の`invokedynamic`型スイッチにコンパイルされます。

この機能を有効にするには、JVMターゲット21以上でKotlinコードをコンパイルし、以下のコンパイラオプションを追加してください。

```bash
-Xwhen-expressions=indy
```

または、`build.gradle(.kts)`ファイルの`compilerOptions {}`ブロックに追加してください。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-expressions=indy")
    }
}
```

この機能は[Experimental](components-stability.md#stability-levels-explained)です。課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-65688)でフィードバックをお寄せいただけると幸いです。

## Kotlin Multiplatform

Kotlin 2.2.20では、Kotlin Multiplatformに重要な変更が導入されました。Swiftエクスポートがデフォルトで利用可能になり、新しい共有ソースセットが追加され、共通依存関係を管理する新しいアプローチを試すことができます。

### Swiftエクスポートがデフォルトで利用可能に
<primary-label ref="experimental-general"/> 

Kotlin 2.2.20では、Swiftエクスポートの実験的なサポートが導入されました。
これにより、Kotlinソースを直接エクスポートし、Objective-Cヘッダーが不要になるため、SwiftからKotlinコードを慣用的に呼び出すことができます。

これにより、Appleターゲットのマルチプラットフォーム開発が大幅に改善されるはずです。たとえば、トップレベル関数を持つKotlinモジュールがある場合、Swiftエクスポートにより、Objective-Cのアンダースコアやマングルされた名前を削除し、クリーンでモジュール固有のインポートが可能になります。

主な機能は次のとおりです。

*   **マルチモジュールサポート**。各Kotlinモジュールは個別のSwiftモジュールとしてエクスポートされ、関数呼び出しを簡素化します。
*   **パッケージサポート**。Kotlinパッケージはエクスポート中に明示的に保持され、生成されたSwiftコードでの命名衝突を回避します。
*   **型エイリアス**。Kotlinの型エイリアスはSwiftにエクスポートされ、保持されるため、可読性が向上します。
*   **プリミティブのnull許容性の強化**。`Int?`のような型を`KotlinInt`のようなラッパークラスにボックス化してnull許容性を保持する必要があったObjective-C相互運用とは異なり、Swiftエクスポートはnull許容性情報を直接変換します。
*   **オーバーロード**。Kotlinのオーバーロードされた関数をSwiftで曖昧さなく呼び出すことができます。
*   **フラット化されたパッケージ構造**。KotlinパッケージをSwiftのenumに変換し、生成されたSwiftコードからパッケージプレフィックスを削除できます。
*   **モジュール名のカスタマイズ**。KotlinプロジェクトのGradle設定で、結果のSwiftモジュール名をカスタマイズできます。

#### Swiftエクスポートを有効にする方法

この機能は現在[Experimental](components-stability.md#stability-levels-explained)であり、iOSフレームワークをXcodeプロジェクトに接続するために[直接統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)を使用するプロジェクトでのみ機能します。
これは、IntelliJ IDEAのKotlin Multiplatformプラグインまたは[Webウィザード](https://kmp.jetbrains.com/)で作成されたマルチプラットフォームプロジェクトの標準的な設定です。

Swiftエクスポートを試すには、Xcodeプロジェクトを設定します。

1.  Xcodeで、プロジェクト設定を開きます。
2.  **Build Phases**タブで、`embedAndSignAppleFrameworkForXcode`タスクを含む**Run Script**フェーズを見つけます。
3.  Run Scriptフェーズで、`embedSwiftExportForXcode`タスクを特徴とするようにスクリプトを調整します。

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4.  プロジェクトをビルドします。Swiftモジュールはビルド出力ディレクトリに生成されます。

この機能はデフォルトで利用可能です。以前のリリースで既に有効にしている場合は、`gradle.properties`ファイルから`kotlin.experimental.swift-export.enabled`を削除できます。

> 時間を節約するには、Swiftエクスポートがすでに設定されている弊社の[公開サンプル](https://github.com/Kotlin/swift-export-sample)をクローンしてください。
>
{style="tip"}

Swiftエクスポートの詳細については、弊社の[ドキュメント](native-swift-export.md)をご覧ください。

#### フィードバックを送る

今後のKotlinリリースでは、Swiftエクスポートのサポートを拡大し、段階的に安定させる予定です。
Kotlin 2.2.20以降は、特にコルーチンとフロー周りのKotlinとSwift間の相互運用性の向上に注力します。

Swiftエクスポートのサポートは、Kotlin Multiplatformにとって大きな変更です。皆様からのフィードバックをお待ちしております。

*   Kotlin Slackで開発チームに直接連絡してください – [招待を取得](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)して[#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9)チャンネルに参加してください。
*   Swiftエクスポートで直面する問題を[YouTrack](https://kotl.in/issue)で報告してください。

### `js`および`wasmJs`ターゲット用の共有ソースセット

これまで、Kotlin MultiplatformはJavaScript (`js`) とWebAssembly (`wasmJs`) のWebターゲット用の共有ソースセットをデフォルトで含んでいませんでした。
`js`と`wasmJs`の間でコードを共有するには、カスタムソースセットを手動で設定するか、`js`用と`wasmJs`用で2箇所にコードを記述する必要がありました。例:

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// jsMain
external interface Navigator { val clipboard: Clipboard }
// JSとWasmで異なる相互運用
external interface Clipboard { fun readText(): Promise<String> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    // JSとWasmで異なる相互運用
    return navigator.clipboard.readText().await()
}

// wasmJsMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

このリリースから、[デフォルト階層テンプレート](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)を使用すると、Kotlin GradleプラグインがWeb用の新しい共有ソースセット (`webMain`と`webTest`で構成) を追加します。

この変更により、`web`ソースセットは`js`と`wasmJs`の両方のソースセットの親となります。更新されたソースセット階層は次のようになります。

![Webでデフォルト階層テンプレートを使用する例](default-hierarchy-example-with-web.svg)

新しいソースセットにより、`js`と`wasmJs`の両方のターゲットに対して1つのコードを記述できます。共有コードを`webMain`に配置すると、両方で自動的に機能します。

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
@OptIn(ExperimentalWasmJsInterop::class)
private suspend fun <R : JsAny?> Promise<R>.await(): R = suspendCancellableCoroutine { continuation ->
    this.then(
        onFulfilled = { continuation.resumeWith(Result.success(it)); null },
        onRejected = { continuation.resumeWithException(it.asJsException()); null }
    )
}

external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

actual suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

このアップデートにより、`js`と`wasmJs`ターゲット間のコード共有が簡素化されます。特に以下の2つのケースで役立ちます。

*   ライブラリ作者で、コードを重複させることなく`js`と`wasmJs`の両方のターゲットをサポートしたい場合。
*   WebをターゲットとするCompose Multiplatformアプリケーションを開発している場合、より広範なブラウザ互換性のために`js`と`wasmJs`の両方のターゲットのクロスコンパイルを有効にします。このフォールバックモードにより、Webサイトを作成すると、現代のブラウザは`wasmJs`を使用し、古いブラウザは`js`を使用するため、すべてのブラウザでそのまま動作します。

この機能を試すには、`build.gradle(.kts)`ファイルの`kotlin {}`ブロックで[デフォルト階層テンプレート](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)を使用してください。

```kotlin
kotlin {
    js()
    wasmJs()

    // webMainとwebTestを含むデフォルトのソースセット階層を有効にします
    applyDefaultHierarchyTemplate()
}
```

デフォルト階層を使用する前に、カスタム共有ソースセットを持つプロジェクトがある場合や、`js("web")`ターゲットの名前を変更している場合は、潜在的な競合がないか慎重に検討してください。これらの競合を解決するには、競合するソースセットまたはターゲットの名前を変更するか、デフォルト階層を使用しないでください。

### Kotlinライブラリの安定したクロスプラットフォームコンパイル

Kotlin 2.2.20では、重要な[ロードマップ項目](https://youtrack.jetbrains.com/issue/KT-71290)が完了し、Kotlinライブラリのクロスプラットフォームコンパイルが安定化されました。

Kotlinライブラリを公開するための`.klib`アーティファクトを、どのホストでも生成できるようになりました。これにより、特にこれまでMacマシンが必要だったAppleターゲットの公開プロセスが大幅に合理化されます。

この機能はデフォルトで利用可能です。既に`kotlin.native.enableKlibsCrossCompilation=true`でクロスコンパイルを有効にしている場合は、`gradle.properties`ファイルからこれを削除できます。

残念ながら、いくつかの制限はまだ存在します。以下の場合は、引き続きMacマシンを使用する必要があります。

*   ライブラリまたは依存するモジュールに[cinteropの依存関係](native-c-interop.md)がある場合。
*   プロジェクトに[CocoaPodsの統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)が設定されている場合。
*   Appleターゲット用の[最終バイナリ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)をビルドまたはテストする必要がある場合。

マルチプラットフォームライブラリの公開に関する詳細については、弊社の[ドキュメント](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)をご覧ください。

### 共通依存関係を宣言するための新しいアプローチ
<primary-label ref="experimental-opt-in"/>

Gradleでマルチプラットフォームプロジェクトを設定するのを簡素化するため、Kotlin 2.2.20では、プロジェクトがGradle 8.8以降を使用している場合、トップレベルの`dependencies {}`ブロックを使用して`kotlin {}`ブロック内で共通依存関係を宣言できるようになりました。
これらの依存関係は、`commonMain`ソースセットで宣言されたかのように動作します。この機能は、Kotlin/JVMおよびAndroid専用プロジェクトで使用するdependenciesブロックと同様に機能し、Kotlin Multiplatformでは現在[Experimental](components-stability.md#stability-levels-explained)です。

プロジェクトレベルで共通依存関係を宣言することで、ソースセット間の繰り返しの設定が減り、ビルド設定の合理化に役立ちます。必要に応じて、各ソースセットにプラットフォーム固有の依存関係を追加することもできます。

この機能を試すには、トップレベルの`dependencies {}`ブロックの前に`@OptIn(ExperimentalKotlinGradlePluginApi::class)`アノテーションを追加してオプトインしてください。例:

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

この機能に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-76446)でお寄せいただけると幸いです。

### 依存関係におけるターゲットサポートの新しい診断

Kotlin 2.2.20以前は、ビルドスクリプト内の依存関係がソースセットで必要なすべてのターゲットをサポートしていない場合、Gradleによって生成されるエラーメッセージでは問題を理解することが困難でした。

Kotlin 2.2.20では、各依存関係がどのターゲットをサポートし、どのターゲットをサポートしないかを明確に示す新しい診断が導入されました。

この診断はデフォルトで有効になっています。何らかの理由で無効にする必要がある場合は、この[YouTrack課題](https://kotl.in/kmp-dependencies-diagnostic-issue)にコメントでお知らせください。
`gradle.properties`ファイルで診断を無効にするには、以下のGradleプロパティを使用できます。

| プロパティ                                                 | 説明                                                       |
|----------------------------------------------------------|----------------------------------------------------------------|
| `kotlin.kmp.eagerUnresolvedDependenciesDiagnostic=false` | メタデータコンパイルとインポートのみで診断を実行                 |
| `kotlin.kmp.unresolvedDependenciesDiagnostic=false`      | 診断を完全に無効にする                                         |

## Kotlin/Native

このリリースでは、Xcode 26のサポート、Objective-C/Swiftとの相互運用性、デバッグ、新しいバイナリオプションに改善が加えられました。

### Xcode 26のサポート

Kotlin 2.2.2**1**以降、Kotlin/NativeコンパイラはXcode 26をサポートします。これはXcodeの最新の安定バージョンです。
Xcodeをアップデートし、最新のAPIにアクセスして、Appleオペレーティングシステム向けのKotlinプロジェクトの開発を継続できます。

### バイナリにおけるスタックカナリアのサポート

Kotlin 2.2.20から、Kotlinは生成されるKotlin/Nativeバイナリでのスタックカナリアのサポートを追加しました。スタック保護の一部として、このセキュリティ機能はスタック破壊から保護し、一般的なアプリケーションの脆弱性の一部を軽減します。SwiftとObjective-Cでは既に利用可能でしたが、Kotlinでもサポートされるようになりました。

Kotlin/Nativeでのスタック保護の実装は、[Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector)のスタックプロテクターの挙動に従います。

スタックカナリアを有効にするには、以下の[バイナリオプション](native-binary-options.md)を`gradle.properties`ファイルに追加してください。

```none
kotlin.native.binary.stackProtector=yes
```

このプロパティは、スタック破壊に対して脆弱なすべてのKotlin関数に対してこの機能を有効にします。代替モードは次のとおりです。

*   `kotlin.native.binary.stackProtector=strong`。これは、スタック破壊に対して脆弱な関数に対してより強力なヒューリスティックを使用します。
*   `kotlin.native.binary.stackProtector=all`。これは、すべての関数に対してスタックプロテクターを有効にします。

場合によっては、スタック保護がパフォーマンスコストを伴う可能性があることに注意してください。

### リリースバイナリのバイナリサイズの縮小
<primary-label ref="experimental-opt-in"/> 

Kotlin 2.2.20では、リリースバイナリのバイナリサイズを削減できる`smallBinary`オプションが導入されました。
この新しいオプションは、LLVMコンパイルフェーズ中のコンパイラのデフォルトの最適化引数として、事実上`-Oz`を設定します。

`smallBinary`オプションを有効にすると、リリースバイナリをより小さくし、ビルド時間を短縮できます。ただし、場合によってはランタイムパフォーマンスに影響を与える可能性があります。

この新機能は現在[Experimental](components-stability.md#stability-levels-explained)です。プロジェクトでこれを試すには、以下の[バイナリオプション](native-binary-options.md)を`gradle.properties`ファイルに追加してください。

```none
kotlin.native.binary.smallBinary=true
```

Kotlinチームは、この機能の実装にご協力いただいた[Troels Lund](https://github.com/troelsbjerre)氏に感謝いたします。

### デバッガーのオブジェクト概要の改善

Kotlin/Nativeは、LLDBやGDBなどのデバッガーツール向けに、より明確なオブジェクト概要を生成するようになりました。これにより、生成されるデバッグ情報の可読性が向上し、デバッグエクスペリエンスが合理化されます。

たとえば、以下のオブジェクトを考えてみましょう。

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

これまで、検査ではオブジェクトのメモリアドレスへのポインタを含む限られた情報しか表示されませんでした。

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

Kotlin 2.2.20では、デバッガーが実際の値を含むより豊富な詳細を表示するようになりました。

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

Kotlinチームは、この機能の実装にご協力いただいた[Nikita Nazarov](https://github.com/nikita-nazarov)氏に感謝いたします。

Kotlin/Nativeでのデバッグの詳細については、[ドキュメント](native-debugging.md)をご覧ください。

### Objective-Cヘッダーのブロック型における明示的な名前

Kotlin 2.2.20では、Kotlin/NativeプロジェクトからエクスポートされるObjective-CヘッダーのKotlinの関数型に明示的なパラメータ名を追加するオプションが導入されました。パラメータ名により、Xcodeのオートコンプリート候補が改善され、Clangの警告を回避するのに役立ちます。

これまで、ブロック型におけるパラメータ名は、生成されたObjective-Cヘッダーでは省略されていました。このような場合、Xcodeのオートコンプリートは、Objective-Cブロックでパラメータ名なしで関数を呼び出すことを提案していました。生成されたブロックはClangの警告を引き起こしました。

たとえば、以下のKotlinコードの場合:

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

生成されたObjective-Cヘッダーにはパラメータ名がありませんでした。

```objc
// Objective-C:
+ (void)greetUserBlock:(void (^)(NSString *))block __attribute__((swift_name("greetUser(block:)")));
```

そのため、XcodeでObjective-Cから`greetUserBlock()`関数を呼び出すと、IDEは次のように提案しました。

```objc
// Objective-C:
greetUserBlock:^(NSString *) {
    // ...
};
```

提案中の不足しているパラメータ名`(NSString *)`がClangの警告を引き起こしました。

新しいオプションを使用すると、KotlinはKotlin関数型からのパラメータ名をObjective-Cブロック型に転送するため、Xcodeは提案でそれらを使用します。

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

明示的なパラメータ名を有効にするには、以下の[バイナリオプション](native-binary-options.md)を`gradle.properties`ファイルに追加してください。

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=true
```

Kotlinチームは、この機能の実装にご協力いただいた[Yijie Jiang](https://github.com/edisongz)氏に感謝いたします。

### Kotlin/Nativeディストリビューションのサイズ縮小

Kotlin/Nativeディストリビューションには、コンパイラコードを含む2つのJARファイルが含まれていました。

*   `konan/lib/kotlin-native.jar`
*   `konan/lib/kotlin-native-compiler-embeddable.jar`。

Kotlin 2.2.20から、`kotlin-native.jar`は公開されなくなりました。

削除されたJARファイルは、不要になった組み込みコンパイラのレガシーバージョンです。この変更により、ディストリビューションのサイズが大幅に縮小されます。

その結果、以下のオプションは非推奨となり、削除されました。

*   `kotlin.native.useEmbeddableCompilerJar=false` Gradleプロパティ。代わりに、組み込みコンパイラJARファイルは常にKotlin/Nativeプロジェクトで使用されます。
*   `KotlinCompilerPluginSupportPlugin.getPluginArtifactForNative()`関数。代わりに、[`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html)関数が常に使用されます。

詳細については、[YouTrack課題](https://kotl.in/KT-51301)をご覧ください。

### Objective-CヘッダーへのKDocのエクスポートがデフォルトに

[KDoc](kotlin-doc.md)コメントがデフォルトでエクスポートされるようになりました。Kotlin/Nativeの最終バイナリのコンパイル中にObjective-Cヘッダーを生成する際。

これまで、`-Xexport-kdoc`オプションはビルドファイルに手動で追加する必要がありました。現在では、コンパイルタスクに自動的に渡されます。

このオプションはKDocコメントをklibsに埋め込み、Appleフレームワークを生成する際にklibsからコメントを抽出します。その結果、Xcodeなどでオートコンプリート時にクラスやメソッドのコメントが表示されるようになります。

`build.gradle(.kts)`ファイルの`binaries {}`ブロックで、klibsから生成されるAppleフレームワークへのKDocコメントのエクスポートを無効にできます。

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

kotlin {
    iosArm64 {
        binaries {
            framework { 
                baseName = "sdk"
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                exportKdoc.set(false)
            }
        }
    }
}
```

詳細については、[弊社のドキュメント](native-objc-interop.md#provide-documentation-with-kdoc-comments)をご覧ください。

### x86_64 Appleターゲットの非推奨化

Appleは数年前にIntelチップ搭載デバイスの生産を終了し、[最近](https://www.youtube.com/live/51iONeETSng?t=3288s)、macOS Tahoe 26がIntelベースのアーキテクチャをサポートする最後のOSバージョンになると[発表しました](https://www.youtube.com/live/51iONeETSng?t=3288s)。

これにより、特にmacOS 26に付属するサポート対象のXcodeバージョンを更新する将来のKotlinリリースでは、ビルドエージェントでこれらのターゲットを適切にテストすることがますます困難になります。

Kotlin 2.2.20から、`macosX64`および`iosX64`ターゲットはサポートティア2に降格されました。これは、ターゲットがコンパイルされることを確認するためにCIで定期的にテストされることを意味しますが、実行されることを確認するために自動的にテストされない場合があります。

Kotlin 2.2.20−2.4.0リリースサイクル中に、すべての`x86_64` Appleターゲットを段階的に非推奨にし、最終的にサポートを削除する予定です。これには以下のターゲットが含まれます。

*   `macosX64`
*   `iosX64`
*   `tvosX64`
*   `watchosX64`

サポートティアの詳細については、[Kotlin/Nativeターゲットサポート](native-target-support.md)をご覧ください。

## Kotlin/Wasm

Kotlin/Wasmは現在ベータ版であり、npm依存関係の分離、[JavaScript相互運用における例外処理の改善](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop)、
[組み込みのブラウザデバッグサポート](#support-for-debugging-in-browsers-without-configuration)などの改善とともに、より高い安定性を提供します。

### npm依存関係の分離

これまで、Kotlin/Wasmプロジェクトでは、[npm](https://www.npmjs.com/)のすべての依存関係が、Kotlinツーリングの依存関係とプロジェクトの依存関係の両方を含めて、プロジェクトフォルダにまとめてインストールされていました。
それらはまた、プロジェクトのロックファイル (`package-lock.json`または`yarn.lock`) にも一緒に記録されていました。

その結果、Kotlinツーリングの依存関係が更新されるたびに、何も追加または変更していなくてもロックファイルを更新する必要がありました。

Kotlin 2.2.20から、Kotlinツーリングのnpm依存関係はプロジェクトの外にインストールされるようになりました。現在、ツーリングとユーザーの依存関係は別々のディレクトリにあります。

*   **ツーリングの依存関係のディレクトリ:**

    `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

*   **ユーザーの依存関係のディレクトリ:**

    `build/wasm/node_modules`

さらに、プロジェクトディレクトリ内のロックファイルには、ユーザー定義の依存関係のみが含まれます。

この改善により、ロックファイルが自身の依存関係のみに集中し、プロジェクトをよりクリーンに保ち、ファイルの不要な変更を減らすのに役立ちます。

この変更は`wasm-js`ターゲットに対してデフォルトで有効になっています。`js`ターゲットに対してはまだこの変更は実装されていません。将来のリリースで実装する予定はありますが、Kotlin 2.2.20では`js`ターゲットのnpm依存関係の挙動は以前と同じままです。

### Kotlin/WasmおよびJavaScript相互運用における例外処理の改善

これまで、KotlinはJavaScript (JS) でスローされ、Kotlin/Wasmコードに渡される例外 (エラー) を理解するのが困難でした。

場合によっては、例外がWasmコードからJSにスローまたは渡され、詳細なしに`WebAssembly.Exception`にラップされるという逆方向の問題も発生しました。これらのKotlinの例外処理の問題はデバッグを困難にしていました。

Kotlin 2.2.20から、例外に関する開発者のエクスペリエンスが両方向で改善されました。

*   JSから例外がスローされた場合、Kotlin側でより多くの情報を確認できます。
    そのような例外がKotlinを介してJSに戻る際に、WebAssemblyにラップされなくなりました。
*   Kotlinから例外がスローされた場合、JS側でJSエラーとしてキャッチできるようになりました。

新しい例外処理は、[`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag)機能をサポートするモダンなブラウザで自動的に機能します。

*   Chrome 115+
*   Firefox 129+
*   Safari 18.4+

古いブラウザでは、例外処理の挙動は変更されません。

### 設定なしでのブラウザデバッグのサポート

これまで、ブラウザはデバッグに必要なKotlin/Wasmプロジェクトのソースに自動的にアクセスできませんでした。
ブラウザでKotlin/Wasmアプリケーションをデバッグするには、`build.gradle(.kts)`ファイルに以下のスニペットを追加して、これらのソースをサービスするようにビルドを手動で設定する必要がありました。

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        add(project.rootDir.path)
    }
}
```

Kotlin 2.2.20から、[モダンなブラウザ](wasm-configuration.md#browser-versions)でのアプリケーションのデバッグはすぐに機能します。
Gradle開発タスク (`*DevRun`) を実行すると、Kotlinはソースファイルをブラウザに自動的に提供し、ブレークポイントの設定、変数の検査、Kotlinコードのステップ実行を追加設定なしで可能にします。

この変更により、手動設定の必要がなくなり、デバッグが簡素化されます。必要な設定はKotlin Gradleプラグインに含まれるようになりました。以前にこの設定を`build.gradle(.kts)`ファイルに追加していた場合、競合を避けるために削除する必要があります。

ブラウザでのデバッグは、すべてのGradle `*DevRun`タスクに対してデフォルトで有効になっています。これらのタスクはアプリケーションだけでなくそのソースファイルも提供するため、ローカル開発のみに使用し、ソースが公開されてしまう可能性のあるクラウド環境や本番環境での実行は避けてください。

#### デバッグ中の繰り返しの再読み込みを処理する

デフォルトでソースをサービスすると、[Kotlinのコンパイルとバンドルが完了する前に、ブラウザでアプリケーションが繰り返し再読み込みされる](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0)可能性があります。
回避策として、webpackの設定を調整してKotlinソースファイルを無視し、サービスされる静的ファイルの監視を無効にしてください。
プロジェクトのルートにある`webpack.config.d`ディレクトリに、以下の内容を持つ`.js`ファイルを追加してください。

```kotlin
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
        return { directory: file,
                 watch: false,
        }
    } else {
        return file
    }
    })
}
```

### 空の`yarn.lock`ファイルの排除

これまで、Kotlin Gradleプラグイン (KGP) は、Kotlinツールチェーンで必要とされるnpmパッケージに関する情報と、プロジェクトまたは使用されるライブラリからの既存の[npm](https://www.npmjs.com/)依存関係を含む`yarn.lock`ファイルを自動的に生成していました。

現在、KGPはツールチェーンの依存関係を個別に管理し、プロジェクトにnpm依存関係がない限り、プロジェクトレベルの`yarn.lock`ファイルは生成されなくなりました。

KGPは、npm依存関係が追加されると自動的に`yarn.lock`ファイルを作成し、npm依存関係が削除されると`yarn.lock`ファイルを削除します。

この変更により、プロジェクト構造がクリーンになり、実際のnpm依存関係がいつ導入されたかを追跡しやすくなります。

この挙動を設定するために追加のステップは不要です。Kotlin 2.2.20以降、Kotlin/Wasmプロジェクトではデフォルトで適用されます。

### 完全修飾クラス名における新しいコンパイラエラー

Kotlin/Wasmでは、コンパイラはデフォルトで生成されたバイナリにクラスの完全修飾名 (FQN) を格納しません。
このアプローチにより、アプリケーションサイズの増加を回避します。

その結果、以前のKotlinリリースでは、`KClass::qualifiedName`プロパティを呼び出すと、クラスの修飾名の代わりに空の文字列が返されていました。

Kotlin 2.2.20から、Kotlin/Wasmプロジェクトで`KClass::qualifiedName`プロパティを使用すると、完全修飾名機能を明示的に有効にしない限り、コンパイラはエラーを報告します。

この変更により、`qualifiedName`プロパティを呼び出す際の予期しない空の文字列を防ぎ、コンパイル時に問題を捕捉することで開発者のエクスペリエンスを向上させます。

診断はデフォルトで有効になっており、エラーは自動的に報告されます。診断を無効にし、Kotlin/WasmでFQNの保存を許可するには、`build.gradle(.kts)`ファイルに以下のオプションを追加して、すべてのクラスの完全修飾名を格納するようにコンパイラに指示してください。

```kotlin
kotlin {
    wasmJs {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-kclass-fqn")
        }
    }
}
```

> このオプションを有効にすると、アプリケーションサイズが増加することに注意してください。
>
{style="note"}

## Kotlin/JS

Kotlin 2.2.20では、`BigInt`型を使用してKotlinの`Long`型を表現するのをサポートし、エクスポートされた宣言で`Long`を使用できるようにします。さらに、このリリースではNode.js引数をクリーンアップするためのDSL関数が追加されました。

### Kotlinの`Long`型を表現するための`BigInt`型の使用
<primary-label ref="experimental-opt-in"/>

ES2020標準以前、JavaScript (JS) は53ビットを超える正確な整数に対するプリミティブ型をサポートしていませんでした。

このため、Kotlin/JSは`Long`値 (64ビット幅) を、2つの`number`プロパティを含むJavaScriptオブジェクトとして表現していました。このカスタム実装により、KotlinとJavaScript間の相互運用性がより複雑になっていました。

Kotlin 2.2.20から、Kotlin/JSは、モダンなJavaScript (ES2020) にコンパイルする際、Kotlinの`Long`値を表現するためにJavaScriptに組み込みの`BigInt`型を使用するようになりました。

この変更は、Kotlin 2.2.20で導入された機能である[JavaScriptへの`Long`型のエクスポート](#usage-of-long-in-exported-declarations)も可能にします。結果として、この変更はKotlinとJavaScript間の相互運用性を簡素化します。

これを有効にするには、`build.gradle(.kts)`ファイルに以下のコンパイラオプションを追加する必要があります。

```kotlin
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

この機能は[Experimental](components-stability.md#stability-levels-explained)です。課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-57128)でフィードバックをお寄せいただけると幸いです。

#### エクスポートされた宣言での`Long`の使用

Kotlin/JSはカスタムの`Long`表現を使用していたため、JavaScriptからKotlinの`Long`と対話する直接的な方法を提供することは困難でした。その結果、`Long`型を使用するKotlinコードをJavaScriptにエクスポートすることはできませんでした。この問題は、関数パラメータ、クラスプロパティ、コンストラクタなど、`Long`を使用するすべてのコードに影響しました。

Kotlinの`Long`型がJavaScriptの`BigInt`型にコンパイルできるようになったため、Kotlin/JSは`Long`値をJavaScriptにエクスポートするのをサポートし、KotlinコードとJavaScriptコード間の相互運用性を簡素化します。

この機能を有効にするには:

1.  `build.gradle(.kts)`ファイルの`freeCompilerArgs`属性に以下のコンパイラオプションを追加して、Kotlin/JSで`Long`のエクスポートを許可してください。

    ```kotlin
    kotlin {
        js {
            ...
            compilerOptions {                   
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2.  `BigInt`型を有効にしてください。[Kotlinの`Long`型を表現するための`BigInt`型の使用](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type)で有効にする方法をご覧ください。

### よりクリーンな引数のための新しいDSL関数

Node.jsでKotlin/JSアプリケーションを実行する際、プログラムに渡される引数 (`args`) には、これまで以下が含まれていました。

*   実行可能ファイル`Node`へのパス。
*   スクリプトへのパス。
*   指定した実際のコマンドライン引数。

しかし、`args`の期待される挙動は、コマンドライン引数のみを含むことでした。これを実現するには、`drop()`関数を使用して最初の2つの引数を手動でスキップする必要がありました。`build.gradle(.kts)`ファイル内またはKotlinコードで:

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

この回避策は繰り返しの手間がかかり、エラーが発生しやすく、プラットフォーム間でコードを共有する際にはうまく機能しませんでした。

この問題を解決するため、Kotlin 2.2.20では`passCliArgumentsToMainFunction()`という新しいDSL関数が導入されました。

この関数を使用すると、コマンドライン引数のみが含まれ、`Node`とスクリプトのパスは除外されます。

```kotlin
fun main(args: Array<String>) {
    // drop()は不要になり、カスタム引数のみが含まれます
    println(args.joinToString(", "))
}
```

この変更により、ボイラープレートコードが削減され、手動で引数を削除することによる間違いが防止され、クロスプラットフォームの互換性が向上します。

この機能を有効にするには、`build.gradle(.kts)`ファイル内に以下のDSL関数を追加してください。

```kotlin
kotlin {
    js {
        nodejs {
            passCliArgumentsToMainFunction()
        }
    }
}
```

## Gradle

Kotlin 2.2.20では、GradleビルドレポートにKotlin/Nativeタスク用の新しいコンパイラパフォーマンスメトリクスが追加され、インクリメンタルコンパイルの使い勝手が向上しました。

### Kotlin/Nativeタスクのビルドレポートにおける新しいコンパイラパフォーマンスメトリクス

Kotlin 1.7.0では、コンパイラのパフォーマンス追跡を支援する[ビルドレポート](gradle-compilation-and-caches.md#build-reports)を導入しました。それ以来、これらのレポートをさらに詳細でパフォーマンス問題の調査に役立つものにするために、より多くのメトリクスを追加してきました。

Kotlin 2.2.20では、ビルドレポートにKotlin/Nativeタスクのコンパイラパフォーマンスメトリクスが含まれるようになりました。

ビルドレポートとその設定方法の詳細については、[ビルドレポートの有効化](gradle-compilation-and-caches.md#enabling-build-reports)をご覧ください。

### Kotlin/JVMにおけるインクリメンタルコンパイルの改善のプレビュー
<primary-label ref="experimental-general"/>

Kotlin 2.0.0では、最適化されたフロントエンドを持つ新しいK2コンパイラが導入されました。Kotlin 2.2.20では、新しいフロントエンドを使用してKotlin/JVMの特定の複雑なインクリメンタルコンパイルシナリオでパフォーマンスを向上させることで、これをさらに発展させています。

これらの改善は、挙動の安定化に取り組んでいる間、デフォルトでは無効になっています。これらを有効にするには、`gradle.properties`ファイルに以下のプロパティを追加してください。

```none
kotlin.incremental.jvm.fir=true
```

現在、[`kapt`コンパイラプラグイン](kapt.md)はこの新しい挙動と互換性がありません。今後のKotlinリリースでサポートを追加する予定です。

この機能に関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-72822)でお寄せいただけると幸いです。

### インクリメンタルコンパイルがインライン関数のラムダの変更を検出

Kotlin 2.2.20以前は、インクリメンタルコンパイルを有効にしてインライン関数内のラムダのロジックを変更した場合、コンパイラは他のモジュール内のそのインライン関数の呼び出しサイトを再コンパイルしませんでした。その結果、それらの呼び出しサイトはラムダの以前のバージョンを使用し、予期しない挙動を引き起こす可能性がありました。

Kotlin 2.2.20では、コンパイラはインライン関数のラムダの変更を検出し、その呼び出しサイトを自動的に再コンパイルするようになりました。

### ライブラリ公開の改善

Kotlin 2.2.20では、ライブラリ公開を容易にする新しいGradleタスクが追加されました。これらのタスクは、キーペアの生成、公開鍵のアップロード、およびMaven Centralリポジトリへのアップロード前に検証プロセスが成功することを確認するためのローカルチェックの実行に役立ちます。

これらのタスクを公開プロセスの一部として使用する方法の詳細については、[Maven Centralへのライブラリ公開](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)をご覧ください。

#### PGPキーを生成およびアップロードするための新しいGradleタスク

Kotlin 2.2.20以前は、マルチプラットフォームライブラリをMaven Centralリポジトリに公開したい場合、公開物に署名するためのキーペアを生成するために`gpg`のようなサードパーティプログラムをインストールする必要がありました。現在、Kotlin Gradleプラグインには、キーペアを生成し、公開鍵をアップロードできるGradleタスクが付属しているため、別のプログラムをインストールする必要がありません。

##### キーペアの生成

`generatePgpKeys`タスクはキーペアを生成します。実行する際、プライベートキーストアのパスワードとあなたの名前を以下の形式で指定する必要があります。

```bash
./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
```

このタスクはキーペアを`build/pgp`ディレクトリに保存します。

> 偶発的な削除や不正アクセスを防ぐため、キーペアを安全な場所に移動してください。
> 
{style="warning"}

##### 公開鍵のアップロード

`uploadPublicPgpKey`タスクは、公開鍵をUbuntuのキーサーバーである`keyserver.ubuntu.com`にアップロードします。実行する際、`.asc`形式の公開鍵へのパスを指定してください。

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

#### ローカルで検証をテストするための新しいGradleタスク

Kotlin 2.2.20では、ライブラリをMaven Centralリポジトリにアップロードする前に、ローカルで検証をテストするためのGradleタスクも追加されました。

Kotlin GradleプラグインをGradleの[Signing Plugin](https://docs.gradle.org/current/userguide/signing_plugin.html)および[Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html)と共に使用している場合、`checkSigningConfiguration`および`checkPomFileFor<PUBLICATION_NAME>Publication`タスクを実行して、セットアップがMaven Centralの要件を満たしているか検証できます。`<PUBLICATION_NAME>`を公開物の名前に置き換えてください。

これらのタスクは`build`または`check` Gradleタスクの一部として自動的に実行されないため、手動で実行する必要があります。たとえば、`KotlinMultiplatform`公開物がある場合:

```bash
./gradlew checkSigningConfiguration checkPomFileForKotlinMultiplatformPublication
```

`checkSigningConfiguration`タスクは以下をチェックします。

*   Signing Pluginにキーが設定されていること。
*   設定された公開鍵が`keyserver.ubuntu.com`または`keys.openpgp.org`のキーサーバーのいずれかにアップロードされていること。
*   すべての公開物に署名が有効になっていること。

これらのチェックのいずれかが失敗した場合、タスクは問題を修正する方法に関する情報とともにエラーを返します。

`checkPomFileFor<PUBLICATION_NAME>Publication`タスクは、`pom.xml`ファイルがMaven Centralの[要件](https://central.sonatype.org/publish/requirements/#required-pom-metadata)を満たしているかチェックします。
満たしていない場合、タスクは`pom.xml`ファイルのどの部分が非準拠であるかについての詳細とともにエラーを返します。

## Maven: `kotlin-maven-plugin`におけるKotlinデーモンのサポート

Kotlin 2.2.20では、[Kotlin 2.2.0で導入されたビルドツールAPI](whatsnew22.md#new-experimental-build-tools-api)をさらに一歩進め、`kotlin-maven-plugin`で[Kotlinデーモン](kotlin-daemon.md)のサポートを追加しました。Kotlinデーモンを使用すると、Kotlinコンパイラは独立した別のプロセスで実行され、他のMavenプラグインがシステムプロパティを上書きするのを防ぎます。この[YouTrack課題](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path)で例を見ることができます。

Kotlin 2.2.20から、Kotlinデーモンはデフォルトで使用されます。以前の挙動に戻したい場合は、`pom.xml`ファイルで以下のプロパティを`false`に設定してオプトアウトしてください。

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin 2.2.20では、KotlinデーモンのデフォルトJVM引数をカスタマイズするために使用できる新しい`jvmArgs`プロパティも導入されました。たとえば、`-Xmx`および`-Xms`オプションを上書きするには、`pom.xml`ファイルに以下を追加してください。

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## Kotlinコンパイラオプションの新しい共通スキーマ

Kotlin 2.2.20では、[`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description)の下で公開されているすべてのコンパイラオプションの共通スキーマが導入されました。
このアーティファクトには、すべてのコンパイラオプション、それらの説明、および各オプションが導入または安定化されたバージョンなどのメタデータの、コード表現とJSON相当 (非JVMコンシューマ向け) の両方が含まれています。このスキーマを使用して、オプションのカスタムビューを生成したり、必要に応じて分析したりできます。

## 標準ライブラリ

このリリースでは、標準ライブラリに新しい実験的な機能が導入されました。Kotlin/JSでのインターフェース型識別のためのリフレクションサポート、共通アトミック型用の更新関数、および配列サイズ変更のための`copyOf()`オーバーロードです。

### Kotlin/JSにおけるリフレクションによるインターフェース型識別のサポート
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20は、[Experimental](components-stability.md#stability-levels-explained)な[`KClass.isInterface`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/is-interface.html)プロパティをKotlin/JS標準ライブラリに追加します。

このプロパティを使用すると、クラス参照がKotlinインターフェースを表しているかどうかをチェックできます。これにより、Kotlin/JSはKotlin/JVMとのパリティに近づき、Kotlin/JVMでは`KClass.java.isInterface`を使用してクラスがインターフェースを表しているかどうかをチェックできます。

オプトインするには、`@OptIn(ExperimentalStdlibApi::class)`アノテーションを使用してください。

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun inspect(klass: KClass<*>) {
    // インターフェースの場合はtrueを出力します
    println(klass.isInterface)
}
```

課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-78581)でフィードバックをお寄せいただけると幸いです。

### 共通アトミック型のための新しい更新関数
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20では、共通アトミック型およびそれらの配列対応要素を更新するための新しい実験的な関数が導入されました。
各関数は、これらの更新関数のいずれかを使用して新しい値をアトミックに計算し、現在の値を置き換えます。戻り値は使用する関数によって異なります。

*   [`update()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update.html)と[`updateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-at.html)は、結果を返さずに新しい値を設定します。
*   [`fetchAndUpdate()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update.html)と[`fetchAndUpdateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update-at.html)は、新しい値を設定し、変更前の以前の値を返します。
*   [`updateAndFetch()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch.html)と[`updateAndFetchAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch-at.html)は、新しい値を設定し、変更後の更新された値を返します。

これらの関数を使用して、乗算やビット演算など、すぐにサポートされていないアトミックな変換を実装できます。
この変更以前は、共通アトミック型をインクリメントし、以前の値を読み取るには、[`compareAndSet()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-atomic-int/compare-and-set.html)関数を使ったループが必要でした。

共通アトミック型のすべてのAPIと同様に、これらの関数は[Experimental](components-stability.md#stability-levels-explained)です。
オプトインするには、`@OptIn(ExperimentalAtomicApi::class)`アノテーションを使用してください。

様々な種類の更新を実行し、以前の値または更新された値のいずれかを返すコードの例を以下に示します。

```kotlin
import kotlin.concurrent.atomics.*
import kotlin.random.Random

@OptIn(ExperimentalAtomicApi::class)
fun main() {
    val counter = AtomicLong(Random.nextLong())
    val minSetBitsThreshold = 20

    // 結果を使用せずに新しい値を設定します
    counter.update { if (it < 0xDECAF) 0xCACA0 else 0xC0FFEE }

    // 現在の値を取得し、それを更新します
    val previousValue = counter.fetchAndUpdate { 0x1CEDL.shl(Long.SIZE_BITS - it.countLeadingZeroBits()) or it }

    // 値を更新し、結果を取得します
    val current = counter.updateAndFetch {
        if (it.countOneBits() < minSetBitsThreshold) it.shl(20) or 0x15BADL else it
    }

    val hexFormat = HexFormat {
        upperCase = true
        number {
            removeLeadingZeros = true
        }
    }
    println("Previous value: ${previousValue.toHexString(hexFormat)}")
    println("Current value: ${current.toHexString(hexFormat)}")
    println("Expected status flag set: ${current and 0xBAD != 0xBADL}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.2.20"}

課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-76389)でフィードバックをお寄せいただけると幸いです。

### 配列の`copyOf()`オーバーロードのサポート
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20では、[`copyOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/copy-of.html)関数の実験的なオーバーロードが導入されました。
ジェネリック型`Array<T>`の配列およびすべてのプリミティブ配列型で利用できます。

この関数を使用して、配列を大きくし、イニシャライザラムダからの値を使用して新しい要素を埋めることができます。
これにより、カスタムのボイラープレートコードを削減し、ジェネリックな`Array<T>`をリサイズするとnullableな結果 (`Array<T?>`) が生成されるという一般的な問題点を解決できます。

例を示します。

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val row1: Array<String> = arrayOf("one", "two")
    // ラムダを使用して配列のサイズを変更し、新しい要素を設定します
    val row2: Array<String> = row1.copyOf(4) { "default" }
    println(row2.contentToString())
    // [one, two, default, default]
}
```

このAPIは[Experimental](components-stability.md#stability-levels-explained)です。オプトインするには、`@OptIn(ExperimentalStdlibApi::class)`アノテーションを使用してください。

弊社の[課題トラッカー](https://youtrack.jetbrains.com/issue/KT-70984)でフィードバックをお寄せいただけると幸いです。

## Composeコンパイラ

このリリースでは、Composeコンパイラは新しい警告の追加と、ビルドメトリクスの出力を読みやすく改善することで、使い勝手の向上をもたらします。

### デフォルトパラメータの言語バージョン制限

このリリースでは、コンパイルで指定された言語バージョンが、抽象またはオープンなコンポーザブル関数におけるデフォルトパラメータをサポートするために必要なバージョンよりも低い場合、Composeコンパイラはエラーを報告します。

デフォルトパラメータは、Composeコンパイラにおいて、抽象関数ではKotlin 2.1.0から、オープン関数ではKotlin 2.2.0からサポートされています。古いKotlin言語バージョンをターゲットにしながら新しいバージョンのComposeコンパイラを使用する場合、ライブラリ開発者は、言語バージョンがサポートしていなくても、抽象またはオープン関数におけるデフォルトパラメータが引き続き公開APIに表示される可能性があることに注意する必要があります。

### K2コンパイラ向けのComposableターゲット警告

このリリースでは、K2コンパイラを使用する際に[`@ComposableTarget`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/ComposableTarget)の不一致に関する警告が追加されました。

例:

```text
@Composable fun App() {
  Box { // <-- `Box`は`@UiComposable`です
    Path(...) // <-- `Path`は`@VectorComposable`です
    ^^^^^^^^^
    warning: UI composableが期待される場所でVector composable関数を呼び出しています
  }
}
```
### ビルドメトリクスにおける完全修飾名

ビルドメトリクスで報告されるクラス名と関数名は完全修飾されるようになり、異なるパッケージで同じ名前を持つ宣言を区別しやすくなりました。

さらに、ビルドメトリクスにはデフォルトパラメータからの複雑な式のダンプが含まれなくなり、読みやすくなりました。

## 破壊的変更と非推奨化

このセクションでは、注目すべき重要な破壊的変更と非推奨化について説明します。

*   [`kapt`コンパイラプラグイン](kapt.md)は、デフォルトでK2コンパイラを使用するようになりました。その結果、プラグインがK2コンパイラを使用するかどうかを制御する`kapt.use.k2`プロパティは非推奨になりました。このプロパティを`false`に設定してK2コンパイラの使用をオプトアウトすると、Gradleは警告を表示します。

## ドキュメントの更新

Kotlinのドキュメントにいくつかの注目すべき変更が加えられました。

*   [Kotlinロードマップ](roadmap.md) – Kotlinの言語とエコシステム進化における優先順位の更新されたリストをご覧ください。
*   [プロパティ](properties.md) – Kotlinでプロパティを使用する様々な方法について学びましょう。
*   [条件とループ](control-flow.md) – Kotlinで条件とループがどのように機能するかを学びましょう。
*   [Kotlin/JavaScript](js-overview.md) – Kotlin/JSのユースケースを探ってみましょう。
*   [Webをターゲットにする](gradle-configure-project.md#targeting-the-web) – GradleがWeb開発に提供する様々なターゲットについて学びましょう。
*   [Kotlinデーモン](kotlin-daemon.md) – Kotlinデーモンと、それがビルドシステムやKotlinコンパイラとどのように連携するかについて学びましょう。
*   [コルーチンの概要ページ](coroutines-overview.md) – コルーチンの概念について学び、学習を始めましょう。
*   [Kotlin/Nativeバイナリオプション](native-binary-options.md) – Kotlin/Nativeのバイナリオプションとその設定方法について学びましょう。
*   [Kotlin/Nativeのデバッグ](native-debugging.md) – Kotlin/Nativeでデバッグする様々な方法を探ってみましょう。
*   [LLVMバックエンドをカスタマイズするためのヒント](native-llvm-passes.md) – Kotlin/NativeがLLVMをどのように使用し、最適化パスを調整するかを学びましょう。
*   [ExposedのDAO APIの利用開始](https://www.jetbrains.com/help/exposed/get-started-with-exposed-dao.html) – Exposedのデータアクセスオブジェクト (DAO) APIを使用して、リレーショナルデータベースにデータを保存および取得する方法を学びましょう。
*   ExposedドキュメントのR2DBCに関する新しいページ:
    *   [データベースの操作](https://www.jetbrains.com/help/exposed/working-with-database.html)
    *   [ConnectionFactoryの操作](https://www.jetbrains.com/help/exposed/working-with-connectionfactory.html)
    *   [カスタム型マッピング](https://www.jetbrains.com/help/exposed/custom-type-mapping.html)
*   [HTMX統合](https://ktor.io/docs/htmx-integration.html) – KtorがHTMXを実験的にファーストクラスでサポートする方法を学びましょう。

## Kotlin 2.2.20へのアップデート方法

Kotlinプラグインは、IntelliJ IDEAおよびAndroid Studioにバンドルされたプラグインとして配布されています。

新しいKotlinバージョンにアップデートするには、ビルドスクリプトで[Kotlinバージョンを2.2.20に変更](releases.md#update-to-a-new-kotlin-version)してください。