[//]: # (title: Kotlin 2.3.0の新機能)

_[リリース日: 2025年12月16日](releases.md#release-details)_

Kotlin 2.3.0がリリースされました！主なハイライトは以下の通りです。

*   **言語**: [安定版かつデフォルト機能の増加、未使用の戻り値チェッカー、明示的なバッキングフィールド、コンテキスト依存の解決に対する変更](#language)。
*   **Kotlin/JVM**: [Java 25のサポート](#kotlin-jvm-support-for-java-25)。
*   **Kotlin/Native**: [Swiftエクスポートによる相互運用性の向上、リリースタスクのビルド時間の高速化、CおよびObjective-Cライブラリのインポートのベータ版](#kotlin-native)。
*   **Kotlin/Wasm**: [完全修飾名と新しい例外処理の提案がデフォルトで有効になり、Latin-1文字の新しいコンパクトストレージが追加されました](#kotlin-wasm)。
*   **Kotlin/JS**: [新しい実験的なsuspend関数のエクスポート、`LongArray`の表現、コンパニオンオブジェクトへの統一されたアクセスなどが含まれます](#kotlin-js)。
*   **Gradle**: [Gradle 9.0との互換性、および生成されたソースを登録するための新しいAPI](#gradle)。
*   **Composeコンパイラ**: [ミニファイされたAndroidアプリケーションのスタックトレース](#compose-compiler-stack-traces-for-minified-android-applications)。
*   **標準ライブラリ**: [安定した時間追跡機能、およびUUIDの生成とパースの改善](#standard-library)。

## IDEのサポート

2.3.0をサポートするKotlinプラグインは、IntelliJ IDEAおよびAndroid Studioの最新バージョンにバンドルされています。
IDEでKotlinプラグインを更新する必要はありません。
必要な作業は、ビルドスクリプトで[Kotlinのバージョンを2.3.0に変更する](releases.md#update-to-a-new-kotlin-version)ことだけです。

詳細については、[新しいリリースへの更新](releases.md#update-to-a-new-kotlin-version)を参照してください。

## 言語

Kotlin 2.3.0は、機能の安定化に重点を置き、未使用の戻り値を検出するための新しいメカニズムを導入し、
コンテキスト依存の解決を改善しました。

### 安定版機能

以前のKotlinリリースでは、いくつかの新しい言語機能が実験版およびベータ版として導入されました。
以下の機能は、Kotlin 2.3.0で[安定版](components-stability.md#stability-levels-explained)に昇格しました。

*   [ネストされた型エイリアスのサポート](whatsnew22.md#support-for-nested-type-aliases)
*   [`when`式のデータフローベースの網羅性チェック](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)

### デフォルトで有効になる機能

Kotlin 2.3.0では、[明示的な戻り型を持つ式本体での`return`文のサポート](whatsnew2220.md#support-for-return-statements-in-expression-bodies-with-explicit-return-types)が
デフォルトで有効になりました。

[Kotlin言語の機能と提案の全リスト](kotlin-language-features-and-proposals.md)を参照してください。

### 未使用の戻り値チェッカー
<primary-label ref="experimental-general"/>

Kotlin 2.3.0では、無視された結果を防ぐのに役立つ未使用の戻り値チェッカーが導入されました。
式が`Unit`または`Nothing`以外の値を返し、関数に渡されない、条件でチェックされない、またはその他に使用されない場合に警告を発します。

このチェッカーは、関数呼び出しが意味のある結果を生成するものの、それが気づかれずに破棄され、予期せぬ動作や追跡が困難な問題につながる可能性のあるバグを検出するのに役立ちます。

> チェッカーは、`++`や`--`などのインクリメント操作から返される値を無視します。
>
{style="note"}

以下の例を考えてみましょう。

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // チェッカーは、この結果が無視されているという警告を報告します。
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

この例では、文字列が作成されているものの使用されていないため、チェッカーはそれを無視された結果として報告します。

この機能は[実験的](components-stability.md#stability-levels-explained)です。
有効にするには、ビルドファイルに以下のコンパイラオプションを追加してください。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xreturn-value-checker=check</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

このオプションを使用すると、チェッカーはKotlin標準ライブラリのほとんどの関数など、マークされた式から無視された結果のみを報告します。

関数をマークするには、`@MustUseReturnValues`アノテーションを使用して、チェッカーが無視された戻り値を報告するスコープをマークします。

たとえば、ファイル全体をマークできます。

```kotlin
// このファイル内のすべての関数とクラスをマークし、チェッカーが未使用の戻り値を報告するようにします。
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

あるいは、特定のクラスをマークすることもできます。

```kotlin
// このクラス内のすべての関数をマークし、チェッカーが未使用の戻り値を報告するようにします。
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

ビルドファイルに以下のコンパイラオプションを追加することで、プロジェクト全体をマークすることもできます。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xreturn-value-checker=full</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

この設定では、Kotlinはコンパイルされたファイルを`@MustUseReturnValues`でアノテーションされているかのように自動的に扱い、チェッカーはプロジェクトの関数のすべての戻り値を報告します。

特定の関数での警告は、`@IgnorableReturnValue`アノテーションでマークすることで抑制できます。
`MutableList.add`のように、戻り値を無視することが一般的で期待される関数にアノテーションを付けます。

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

関数自体を無視可能としてマークせずに警告を抑制できます。
これを行うには、結果をアンダースコア (`_`) を持つ特別な無名変数に代入します。

```kotlin
// 無視できない関数
fun computeValue(): Int = 42

fun main() {
    // 警告を報告: 結果は無視されます
    computeValue()

    // 特別な未使用変数でこの呼び出しサイトでのみ警告を抑制します
    val _ = computeValue()
}
```

詳細については、機能の[KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)を参照してください。

[YouTrack](https://youtrack.jetbrains.com/issue/KT-12719)でフィードバックをお寄せいただけると幸いです。

### 明示的なバッキングフィールド
<primary-label ref="experimental-opt-in"/>

Kotlin 2.3.0では、明示的なバッキングフィールドが導入されました。これは、プロパティの値を保持する基となるフィールドを明示的に宣言するための新しい構文であり、既存の暗黙的なバッキングフィールドとは対照的です。

新しい明示的な構文は、プロパティの内部型が公開API型と異なる一般的なバッキングプロパティパターンを簡素化します。たとえば、`ArrayList`を使用しながら、それを読み取り専用の`List`または`MutableList`として公開する場合があります。
以前は、これには追加のプライベートプロパティが必要でした。

明示的なバッキングフィールドを使用すると、`field`の実装型がプロパティのスコープ内で直接定義されます。
これにより、別のプライベートプロパティの必要がなくなり、コンパイラは同じプライベートスコープ内でバッキングフィールドの型へのスマートキャストを自動的に実行できます。

変更前:

```kotlin
private val _city = MutableStateFlow<String>("")
val city: StateFlow<String> get() = _city

fun updateCity(newCity: String) {
    _city.value = newCity
}
```

変更後:

```kotlin
val city: StateFlow<String>
    field = MutableStateFlow("")

fun updateCity(newCity: String) {
    // スマートキャストが自動的に機能します
    city.value = newCity
}
```

この機能は[実験的](components-stability.md#stability-levels-explained)です。
有効にするには、ビルドファイルに以下のコンパイラオプションを追加してください。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-backing-fields")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xexplicit-backing-fields</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

詳細については、機能の[KEEP](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)を参照してください。

[YouTrack](https://youtrack.jetbrains.com/issue/KT-14663)でフィードバックをお寄せいただけると幸いです。

### コンテキスト依存の解決の変更
<primary-label ref="experimental-general"/>

コンテキスト依存の解決はまだ[実験的](components-stability.md#stability-levels-explained)ですが、ユーザーからのフィードバックに基づいて継続的に改善しています。

*   現在の型のsealedおよびエンクロージングスーパークラスが、検索のコンテキストスコープの一部として考慮されるようになりました。
    他のスーパークラスのスコープは考慮されません。モチベーションと例については、[KT-77823](https://youtrack.jetbrains.com/issue/KT-77823) YouTrackの問題を参照してください。
*   型演算子と等価性が関与する場合、コンパイラはコンテキスト依存の解決を使用すると解決があいまいになる場合に警告を報告するようになりました。これは、たとえば、クラスの競合する宣言がインポートされた場合に発生する可能性があります。モチベーションと例については、[KT-77821](https://youtrack.jetbrains.com/issue/KT-77821) YouTrackの問題を参照してください。

現在の提案の全文は[KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md)を参照してください。

## Kotlin/JVM: Java 25のサポート

Kotlin 2.3.0から、コンパイラはJava 25バイトコードを含むクラスを生成できるようになりました。

## Kotlin/Native

Kotlin 2.3.0では、SwiftエクスポートのサポートとCおよびObjective-Cライブラリのインポートが改善され、
リリースタスクのビルド時間が短縮されました。

### Swiftエクスポートによる相互運用性の向上
<primary-label ref="experimental-general"/>

Kotlin 2.3.0では、Swiftエクスポートを通じてKotlinとSwiftの相互運用性がさらに向上し、ネイティブenumクラスと可変引数関数のパラメーターがサポートされました。

以前は、Kotlinのenumは通常のSwiftクラスとしてエクスポートされていました。しかし、現在は直接マッピングされ、通常のネイティブSwift enumを使用できます。例:

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

さらに、Kotlinの[`vararg`](functions.md#variable-number-of-arguments-varargs)関数がSwiftの可変引数関数パラメーターに直接マッピングされるようになりました。

このような関数を使用すると、可変個の引数を渡すことができます。これは、引数の数が事前にわからない場合や、型を指定せずにコレクションを作成または渡したい場合に便利です。例:

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```Swift
// Swift
public func log(messages: Swift.String...)
```

> 可変引数関数のジェネリック型は、まだサポートされていません。
>
{style="note"}

### CおよびObjective-Cライブラリのインポートがベータ版になりました
<primary-label ref="beta"/>

[Cライブラリのインポート](native-c-interop.md)および[Objective-Cライブラリのインポート](native-objc-interop.md)のKotlin/Nativeプロジェクトへのサポートは、[ベータ版](components-stability.md#stability-levels-explained)です。

異なるバージョンのKotlin、依存関係、およびXcodeとの完全な互換性はまだ保証されていませんが、バイナリ互換性の問題が発生した場合にコンパイラがより良い診断を出力するようになりました。

インポートはまだ安定しておらず、CおよびObjective-Cの相互運用性に関連する特定の事柄、特に以下のようなものについては、プロジェクトでCおよびObjective-Cライブラリを使用する際に`@ExperimentalForeignApi`オプトインアノテーションが引き続き必要です。

*   ネイティブライブラリまたはメモリを扱う際に必要となる`kotlinx.cinterop.*`パッケージ内のいくつかのAPI。
*   [プラットフォームライブラリ](native-platform-libs.md)を除く、ネイティブライブラリ内のすべての宣言。

互換性を保ち、ソースコードを変更する必要がないように、新しい安定性ステータスはアノテーション名には反映されません。

詳細については、[CおよびObjective-Cライブラリのインポートの安定性](native-lib-import-stability.md)を参照してください。

### Objective-Cヘッダーのブロック型におけるデフォルトの明示的な名前

Kotlin 2.2.20で導入された、Kotlinの関数型における明示的なパラメーター名([whatsnew2220.md#explicit-names-in-block-types-for-objective-c-headers](whatsnew2220.md#explicit-names-in-block-types-for-objective-c-headers))が、Kotlin/NativeプロジェクトからエクスポートされるObjective-Cヘッダーのデフォルトになりました。これらのパラメーター名により、Xcodeのオートコンプリート候補が改善され、Clangの警告を回避するのに役立ちます。

以下のKotlinコードを考えてみましょう。

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlinは、Kotlin関数型からObjective-Cブロック型にパラメーター名を転送するため、Xcodeはそれらを候補に使用できます。

```ObjC
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

問題が発生した場合は、明示的なパラメーター名を無効にすることができます。
そのためには、`gradle.properties`ファイルに以下の[バイナリオプション](native-binary-options.md)を追加します。

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=false
```

問題があれば[YouTrack](https://kotl.in/issue)に報告してください。

### リリースタスクのビルド時間の高速化

Kotlin/Nativeは2.3.0でいくつかのパフォーマンス改善が施されました。これにより、`linkReleaseFrameworkIosArm64`のような`linkRelease*`などのリリースビルドタスクのビルド時間が高速化されました。

当社のベンチマークによると、プロジェクトのサイズにもよりますが、リリースビルドは最大40%高速化されています。これらの改善は、iOSをターゲットとするKotlin Multiplatformプロジェクトで最も顕著です。

プロジェクトのコンパイル時間を改善するための詳細なヒントについては、[ドキュメント](native-improving-compilation-time.md)を参照してください。

### Appleターゲットのサポートの変更

Kotlin 2.3.0では、Appleターゲットの最低サポートバージョンが引き上げられました。

*   iOSおよびtvOSの場合、12.0から14.0へ。
*   watchOSの場合、5.0から7.0へ。

公開データによると、古いバージョンの使用はすでに非常に限定的です。この変更により、Appleターゲット全体のメンテナンスが簡素化され、Kotlin/Nativeで[Mac Catalyst](https://developer.apple.com/documentation/uikit/mac-catalyst)をサポートする機会が開かれます。

プロジェクトで古いバージョンを維持する必要がある場合は、ビルドファイルに以下の行を追加してください。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
        binaries.configureEach {
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.ios=12.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.tvos=12.0"
        }
    }
}
```

このような設定は、正常にコンパイルされることを保証するものではなく、ビルド中または実行時にアプリが破損する可能性があることに注意してください。

このリリースでは、[IntelチップベースのAppleターゲットの非推奨化サイクル](whatsnew2220.md#deprecation-of-x86-64-apple-targets)の次のステップも踏み出しました。

Kotlin 2.3.0から、`macosX64`、`iosX64`、`tvosX64`、および`watchosX64`ターゲットはサポート層3に降格されます。
これは、CIでのテストが保証されず、異なるコンパイラリリース間でのソースおよびバイナリ互換性が提供されない可能性があることを意味します。Kotlin 2.4.0で`x86_64` Appleターゲットのサポートを最終的に削除する予定です。

詳細については、[Kotlin/Nativeターゲットサポート](native-target-support.md)を参照してください。

## Kotlin/Wasm

Kotlin 2.3.0では、Kotlin/Wasmターゲットの完全修飾名、`wasmWasi`ターゲットの新しい例外処理の提案がデフォルトで有効になり、Latin-1文字のコンパクトストレージが導入されました。

### 完全修飾名がデフォルトで有効になりました

Kotlin/Wasmターゲットでは、実行時に完全修飾名 (FQNs) がデフォルトで有効になっていませんでした。
FQNsを使用するには、`KClass.qualifiedName`プロパティのサポートを手動で有効にする必要がありました。

クラス名 (パッケージなし) のみがアクセス可能であり、JVMからWasmターゲットに移植されたコードや、実行時に完全修飾名を期待するライブラリで問題が発生していました。

Kotlin 2.3.0では、Kotlin/Wasmターゲットで`KClass.qualifiedName`プロパティがデフォルトで有効になりました。
これにより、追加の構成なしで実行時にFQNsが利用可能になります。

FQNsをデフォルトで有効にすることで、コードの移植性が向上し、完全修飾名を表示することで実行時エラーがより情報豊富になります。

この変更は、Latin-1文字列リテラルにコンパクトストレージを使用することでメタデータを削減するコンパイラ最適化のおかげで、コンパイルされたWasmバイナリのサイズを増加させません。

### Latin-1文字のコンパクトストレージ

以前は、Kotlin/Wasmは文字列リテラルデータをそのまま格納しており、すべての文字がUTF-16でエンコードされていました。これは、Latin-1文字のみ、または主にLatin-1文字を含むテキストには最適ではありませんでした。

Kotlin 2.3.0から、Kotlin/Wasmコンパイラは、Latin-1文字のみを含む文字列リテラルをUTF-8形式で格納します。

この最適化により、JetBrainsの[KotlinConfアプリケーション](https://github.com/JetBrains/kotlinconf-app)での実験が示すように、メタデータが大幅に削減されます。これにより、以下の結果が得られます。

*   最適化なしのビルドと比較して、最大13%小さいWasmバイナリ。
*   完全修飾名が有効になっている場合でも、以前のバージョンよりも最大8%小さいWasmバイナリ。

このコンパクトストレージは、ダウンロード時間と起動時間が重要なWeb環境にとって重要です。さらに、この最適化により、以前は[クラスの完全修飾名の格納と`KClass.qualifiedName`のデフォルト有効化](#fully-qualified-names-enabled-by-default)を妨げていたサイズ障壁が解消されました。

この変更はデフォルトで有効になっており、それ以上の操作は必要ありません。

### `wasmWasi`向けに新しい例外処理の提案がデフォルトで有効に

以前は、Kotlin/Wasmは`wasmWasi`を含むすべてのターゲットに[従来の例外処理の提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)を使用していました。しかし、ほとんどのスタンドアロンWebAssembly仮想マシン (VM) は[新しいバージョンの例外処理の提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)に準拠しています。

Kotlin 2.3.0から、新しいWebAssembly例外処理の提案が`wasmWasi`ターゲットでデフォルトで有効になり、最新のWebAssemblyランタイムとの互換性が向上します。

`wasmWasi`ターゲットの場合、この変更は、それをターゲットとするアプリケーションが通常、多様性の少ないランタイム環境 (多くの場合、単一の特定のVMで実行される) で実行され、通常はユーザーによって制御されるため、早期に導入しても安全であり、互換性問題のリスクを軽減します。

新しい例外処理の提案は、[`wasmJs`ターゲット](wasm-overview.md#kotlin-wasm-and-compose-multiplatform)では引き続きデフォルトでオフです。
`-Xwasm-use-new-exception-proposal`コンパイラオプションを使用することで、手動で有効にできます。

## Kotlin/JS

Kotlin 2.3.0では、JavaScriptへの`suspend`関数のエクスポートの実験的サポートと、Kotlinの`LongArray`型を表現するための`BigInt64Array`型が導入されました。

このリリースでは、インターフェース内のコンパニオンオブジェクトに統一された方法でアクセスできるようになり、コンパニオンオブジェクトを持つインターフェースで`@JsStatic`アノテーションを使用できるようになり、個々の関数とクラスで`@JsQualifier`アノテーションを使用できるようになり、新しいアノテーション`@JsExport.Default`を介したデフォルトエクスポートが可能になりました。

### `JsExport`による`suspend`関数の新しいエクスポート
<primary-label ref="experimental-opt-in"/>

以前は、`@JsExport`アノテーションは`suspend`関数 (またはそのような関数を含むクラスやインターフェース) をJavaScriptにエクスポートすることを許可していませんでした。各`suspend`関数を手動でラップする必要があり、これは面倒でエラーが発生しやすいものでした。

Kotlin 2.3.0から、`suspend`関数は`@JsExport`アノテーションを使用してJavaScriptに直接エクスポートできるようになりました。

`suspend`関数のエクスポートを有効にすることで、ボイラープレートが削減され、Kotlin/JSとJavaScript/TypeScript (JS/TS) の相互運用性が向上します。Kotlinの非同期関数は、追加のコードなしでJS/TSから直接呼び出せるようになりました。

この機能を有効にするには、`build.gradle.kts`ファイルに以下のコンパイラオプションを追加します。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xenable-suspend-function-exporting")
    }
}
```

有効にすると、`@JsExport`アノテーションでマークされたクラスと関数は、追加のラッパーなしで`suspend`関数を含めることができます。

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

この機能は[実験的](components-stability.md#stability-levels-explained)です。問題トラッカーである[YouTrack](https://youtrack.jetbrains.com/issue/KT-56281/KJS-Cant-export-suspend-functions)でフィードバックをお寄せいただけると幸いです。

### Kotlinの`LongArray`型を表現するための`BigInt64Array`型の使用
<primary-label ref="experimental-opt-in"/>

以前は、Kotlin/JSはその`LongArray`をJavaScriptの`Array<bigint>`として表現していました。このアプローチは機能しましたが、型付き配列を期待するJavaScript APIとの相互運用には理想的ではありませんでした。

このリリースから、Kotlin/JSはJavaScriptにコンパイルする際、Kotlinの`LongArray`の値を表現するためにJavaScriptの組み込み`BigInt64Array`型を使用するようになりました。

`BigInt64Array`を使用することで、型付き配列を使用するJavaScript APIとの相互運用が簡素化されます。また、`LongArray`を受け入れたり返したりするAPIをKotlinからJavaScriptに、より自然にエクスポートできるようになります。

この機能を有効にするには、`build.gradle.kts`ファイルに以下のコンパイラオプションを追加します。

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

この機能は[実験的](components-stability.md#stability-levels-explained)です。問題トラッカーである[YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray)でフィードバックをお寄せいただけると幸いです。

### JSモジュールシステム全体での統一されたコンパニオンオブジェクトへのアクセス

以前は、コンパニオンオブジェクトを持つKotlinインターフェースを`@JsExport`アノテーションを使用してJavaScript/TypeScriptにエクスポートする場合、ESモジュールと他のモジュールシステムとでは、TypeScriptでのインターフェースの消費方法が異なっていました。

その結果、モジュールシステムに応じて、TypeScript側で出力の消費を調整する必要がありました。

このKotlinコードを考えてみましょう。

```kotlin
@JsExport
interface Foo {
    companion object {
        fun bar() = "OK"
    }
}
```

モジュールシステムに応じて、呼び出し方が異なりました。

```kotlin
// CommonJS, AMD, UMD, no modulesで機能しました
Foo.bar()

// ES modulesで機能しました
Foo.getInstance().bar()
```

このリリースでは、KotlinはすべてのJavaScriptモジュールシステム全体でコンパニオンオブジェクトのエクスポートを統一します。

これで、すべてのモジュールシステム (ESモジュール、CommonJS、AMD、UMD、no modules) で、インターフェース内のコンパニオンオブジェクトは常に同じ方法 (クラス内のコンパニオンと同様) でアクセスされるようになりました。

```kotlin
// すべてのモジュールシステムで機能します
Foo.Companion.bar()
```

この改善により、コレクションの相互運用性も修正されました。以前は、コレクションファクトリ関数はモジュールシステムによって異なる方法でアクセスする必要がありました。

```kotlin
// CommonJS, AMD, UMD, no modulesで機能しました
KtList.fromJsArray([1, 2, 3])

// ES modulesで機能しました
KtList.getInstance().fromJsArray([1, 2, 3])
```

これで、コレクションファクトリ関数へのアクセスは、すべてのモジュールシステムで同様になりました。

```kotlin
// すべてのモジュールシステムで機能します
KtList.fromJsArray([1, 2, 3])
```

この変更により、モジュールシステム間の不整合な動作が減り、バグや相互運用性の問題が回避されます。

この機能はデフォルトで有効になっています。

### コンパニオンオブジェクトを持つインターフェースにおける`@JsStatic`アノテーションのサポート

以前は、`@JsStatic`アノテーションは、エクスポートされたインターフェース内のコンパニオンオブジェクト内では許可されていませんでした。

たとえば、以下のコードは、クラスコンパニオンオブジェクトのメンバーのみが`@JsStatic`でアノテーションできるため、エラーを生成しました。

```kotlin
@JsExport
interface Foo {
    companion object {
        @JsStatic // エラー
        fun bar() = "OK"
    }
}
```

この場合、`@JsStatic`アノテーションを削除し、JavaScript (JS) からコンパニオンに次のようにアクセスする必要がありました。

```kotlin
// すべてのモジュールシステム向け
Foo.Companion.bar()
```

これで、`@JsStatic`アノテーションはコンパニオンオブジェクトを持つインターフェースでサポートされました。
このようなコンパニオンでこのアノテーションを使用し、クラスの場合と同様にJSから直接関数を呼び出すことができます。

```kotlin
// すべてのモジュールシステム向け
Foo.bar()
```

この変更により、JSでのAPI消費が簡素化され、インターフェースでの静的ファクトリメソッドが可能になり、クラスとインターフェース間の不整合が解消されます。

この機能はデフォルトで有効になっています。

### 個々の関数とクラスで許可される`@JsQualifier`アノテーション

以前は、`@JsQualifier`アノテーションはファイルレベルでのみ適用でき、すべての外部JavaScript (JS) 宣言を別々のファイルに配置する必要がありました。

Kotlin 2.3.0からは、`@JsModule`および`@JsNonModule`アノテーションと同様に、`@JsQualifier`アノテーションを個々の関数とクラスに直接適用できるようになりました。

たとえば、次のような外部関数コードを、通常のKotlin宣言の横の同じファイルに記述できるようになりました。

```kotlin
@JsQualifier("jsPackage")
private external fun jsFun()
```

この変更により、Kotlin/JSの相互運用性が簡素化され、プロジェクト構造がよりクリーンになり、Kotlin/JSが他のプラットフォームでの外部宣言の処理方法と一致するようになります。

この機能はデフォルトで有効になっています。

### JavaScriptのデフォルトエクスポートのサポート

以前は、Kotlin/JSはKotlinコードからJavaScriptのデフォルトエクスポートを生成できませんでした。代わりに、Kotlin/JSは名前付きエクスポートのみを生成していました。例:

```javascript
export { SomeDeclaration };
```

デフォルトエクスポートが必要な場合は、コンパイラ内部で、`@JsName`アノテーションに`default`とスペースを引数として配置するなどの回避策を使用する必要がありました。

```kotlin
@JsExport
@JsName("default ")
class SomeDeclaration
```

Kotlin/JSは、新しいアノテーションを通じてデフォルトエクスポートを直接サポートするようになりました。

```kotlin
@JsExport.Default
```

このアノテーションをKotlin宣言 (クラス、オブジェクト、関数、またはプロパティ) に適用すると、生成されるJavaScriptにはESモジュール用の`export default`ステートメントが自動的に含まれます。

```javascript
export default HelloWorker;
```

> ESモジュール以外のモジュールシステムの場合、新しい`@JsExport.Default`アノテーションは通常の`@JsExport`アノテーションと同様に機能します。
>
{style="note"}

この変更により、KotlinコードがJavaScriptの慣習に準拠できるようになり、Cloudflare Workersのようなプラットフォームや`React.lazy`のようなフレームワークにとって特に重要です。

この機能はデフォルトで有効になっています。`@JsExport.Default`アノテーションを使用するだけです。

## Gradle

Kotlin 2.3.0はGradle 7.6.3から9.0.0まで完全に互換性があります。最新のGradleリリースまでのGradleバージョンも使用できます。ただし、その場合、非推奨の警告が表示され、一部の新しいGradle機能が機能しない可能性があることに注意してください。

さらに、サポートされるAndroid Gradleプラグインの最小バージョンは8.2.2になり、最大バージョンは8.13.0になりました。

Kotlin 2.3.0では、Gradleプロジェクトで生成されたソースを登録するための新しいAPIも導入されました。

### Gradleプロジェクトで生成されたソースを登録するための新しいAPI
<primary-label ref="experimental-general"/>

Kotlin 2.3.0では、[`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/)インターフェースに新しい[実験的](components-stability.md#stability-levels-explained)なAPIが導入されました。これを使用して、Gradleプロジェクトで生成されたソースを登録できます。

この新しいAPIは、生成されたコードと通常のソースファイルをIDEが区別するのに役立つ利便性の向上です。
このAPIを使用すると、IDEは生成されたコードをUIで異なる方法でハイライト表示し、プロジェクトがインポートされたときに生成タスクをトリガーできます。現在、IntelliJ IDEAにこのサポートを追加する作業を進めています。このAPIは、[KSP](ksp-overview.md) (Kotlin Symbol Processing) のようにコードを生成するサードパーティ製プラグインやツールにとっても特に便利です。

詳細については、[生成されたソースの登録](gradle-configure-project.md#register-generated-sources)を参照してください。

## 標準ライブラリ

Kotlin 2.3.0では、新しい時間追跡機能[`kotlin.time.Clock`および`kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)が安定化され、実験的なUUID APIにいくつかの改善が追加されました。

### UUIDの生成とパースの改善
<primary-label ref="experimental-opt-in"/>

Kotlin 2.3.0では、UUID APIにいくつかの改善が導入されました。これには以下が含まれます。

*   [無効なUUIDをパースする際に`null`を返すサポート](#support-for-returning-null-when-parsing-invalid-uuids)
*   [v4およびv7 UUIDを生成する新しい関数](#new-functions-to-generate-v4-and-v7-uuids)
*   [特定のタイムスタンプのv7 UUIDを生成するサポート](#support-for-generating-v7-uuids-for-specific-timestamps)

標準ライブラリのUUIDサポートは[実験的](components-stability.md#stability-levels-explained)ですが、[将来的に安定化される予定です](https://youtrack.jetbrains.com/issue/KT-81395)。
有効にするには、`@OptIn(ExperimentalUuidApi::class)`アノテーションを使用するか、ビルドファイルに以下のコンパイラオプションを追加してください。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-opt-in=kotlin.uuid.ExperimentalUuidApi")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-opt-in=kotlin.uuid.ExperimentalUuidApi</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

[YouTrack](https://youtrack.jetbrains.com/issue/KT-81395)または[関連するSlackチャンネル](https://slack-chats.kotlinlang.org/c/uuid)でフィードバックをお寄せいただけると幸いです。

#### 無効なUUIDをパースする際に`null`を返すサポート

Kotlin 2.3.0では、文字列から`Uuid`インスタンスを作成するための新しい関数が導入されました。文字列が無効なUUIDの場合、例外をスローする代わりに`null`を返します。

これらの関数には以下が含まれます。

*   `Uuid.parseOrNull()` – ハイフン区切り16進数形式または16進数形式のいずれかでUUIDをパースします。
*   `Uuid.parseHexDashOrNull()` – ハイフン区切り16進数形式でのみUUIDをパースし、それ以外の場合は`null`を返します。
*   `Uuid.parseHexOrNull()` – 純粋な16進数形式でのみUUIDをパースし、それ以外の場合は`null`を返します。

例を次に示します。

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    val valid = Uuid.parseOrNull("550e8400-e29b-41d4-a716-446655440000")
    println(valid)
    // 550e8400-e29b-41d4-a716-446655440000

    val invalid = Uuid.parseOrNull("not-a-uuid")
    println(invalid)
    // null

    val hexDashValid = Uuid.parseHexDashOrNull("550e8400-e29b-41d4-a716-446655440000")
    println(hexDashValid)
    // 550e8400-e29b-41d4-a716-446655440000

    val hexDashInvalid = Uuid.parseHexDashOrNull("550e8400e29b41d4a716446655440000")
    println(hexDashInvalid)
    // null
}
```
{kotlin-runnable="true"}

#### v4およびv7 UUIDを生成する新しい関数

Kotlin 2.3.0では、UUIDを生成するための2つの新しい関数`Uuid.generateV4()`と`Uuid.generateV7()`が導入されました。

バージョン4 UUIDを生成するには`Uuid.generateV4()`関数を、バージョン7 UUIDを生成するには`Uuid.generateV7()`関数を使用します。

> `Uuid.random()`関数は変更されておらず、`Uuid.generateV4()`と同様にバージョン4のUUIDを生成します。
>
{style="note"}

例を次に示します。

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    // v4 UUIDを生成します
    val v4 = Uuid.generateV4()
    println(v4)

    // v7 UUIDを生成します
    val v7 = Uuid.generateV7()
    println(v7)

    // v4 UUIDを生成します
    val random = Uuid.random()
    println(random)
}
```
{kotlin-runnable="true"}

#### 特定のタイムスタンプのv7 UUIDを生成するサポート

Kotlin 2.3.0では、特定の時点のバージョン7 UUIDを生成するために使用できる新しい`Uuid.generateV7NonMonotonicAt()`関数が導入されました。

> `Uuid.generateV7()`とは異なり、`Uuid.generateV7NonMonotonicAt()`は単調順序を保証しないため、同じタイムスタンプで作成された複数のUUIDが連続的でない場合があります。
>
{style="note"}

イベントIDの再作成や、何かが元々発生した時点を反映するデータベースエントリの生成など、既知のタイムスタンプに関連付けられた識別子が必要な場合にこの関数を使用します。

たとえば、特定のインスタントのバージョン7 UUIDを作成するには、以下のコードを使用します。

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid
import kotlin.time.ExperimentalTime
import kotlin.time.Instant

@OptIn(ExperimentalUuidApi::class, ExperimentalTime::class)
fun main() {
    val timestamp = Instant.fromEpochMilliseconds(1577836800000) // 2020-01-01T00:00:00Z

    // 指定されたタイムスタンプのv7 UUIDを生成します (単調性保証なし)
    val v7AtTimestamp = Uuid.generateV7NonMonotonicAt(timestamp)
    println(v7AtTimestamp)
}
```
{kotlin-runnable="true"}

## Composeコンパイラ: ミニファイされたAndroidアプリケーションのスタックトレース

Kotlin 2.3.0から、アプリケーションがR8によってミニファイされると、コンパイラはComposeスタックトレース用のProGuardマッピングを出力します。
これにより、以前はデバッグ可能なバリアントでのみ利用可能だった実験的なスタックトレース機能が拡張されます。

スタックトレースのリリースバリアントには、ミニファイされたアプリケーションでコンポーザブル関数を特定するために使用できるグループキーが含まれており、実行時にソース情報を記録するオーバーヘッドはありません。グループキースタックトレースには、Composeランタイム1.10以降でアプリケーションをビルドする必要があります。

グループキースタックトレースを有効にするには、`@Composable`コンテンツを初期化する前に以下の行を追加します。

```kotlin
Composer.setDiagnosticStackTraceMode(ComposeStackTraceMode.GroupKeys)
```

これらのスタックトレースを有効にすると、アプリがミニファイされている場合でも、Composeランタイムは、コンポジション、測定、または描画パス中にクラッシュが捕捉された後、独自のスタックトレースを追加します。

```text
java.lang.IllegalStateException: <message>
        at <original trace>
    Suppressed: androidx.compose.runtime.DiagnosticComposeException: Composition stack when thrown:
        at $compose.m$123(SourceFile:1)
        at $compose.m$234(SourceFile:1)
        ...
```

このモードでJetpack Compose 1.10によって生成されたスタックトレースには、まだ難読化を解除する必要があるグループキーのみが含まれます。
これは、Kotlin 2.3.0リリースでCompose Compiler Gradleプラグインによって対処されており、R8によって生成されたProGuardマッピングファイルにグループキーエントリが追加されるようになりました。コンパイラが一部の関数のマッピングを作成できない場合に新しい警告が表示されたら、[Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126)に報告してください。

> Compose Compiler Gradleプラグインは、R8マッピングファイルへの依存関係があるため、R8がビルドで有効になっている場合にのみ、グループキースタックトレースの難読化解除マッピングを作成します。
>
{style="note"}

デフォルトでは、マッピングファイルのGradleタスクは、トレースを有効にするかどうかにかかわらず実行されます。ビルドで問題が発生した場合は、この機能を完全に無効にできます。Gradle設定の`composeCompiler {}`ブロックに以下のプロパティを追加します。

```kotlin
composeCompiler {
    includeComposeMappingFile.set(false)
}
```

> Android Gradleプラグインによって提供されるプロジェクトファイルの一部コードがスタックトレースに表示されないという既知の問題があります: [KT-83099](https://youtrack.jetbrains.com/issue/KT-83099)。
>
{style="warning"}

発生した問題は[Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126)に報告してください。

## 破壊的変更と非推奨

このセクションでは、重要な破壊的変更と非推奨の機能について説明します。
完全な概要については、[互換性ガイド](compatibility-guide-23.md)を参照してください。

*   Kotlin 2.3.0から、コンパイラは[`-language-version=1.8`をサポートしなくなりました](compatibility-guide-23.md#drop-support-in-language-version-for-1-8-and-1-9)。
    JVM以外のプラットフォームでは`-language-version=1.9`のサポートもありません。
*   2.0より古い言語機能セット (JVMプラットフォームの1.9を除く) はサポートされませんが、言語自体はKotlin 1.0と完全に後方互換性があります。

    Gradleプロジェクトで`kotlin-dsl`と`kotlin("jvm")`の両方のプラグインを使用している場合、サポートされていないKotlinプラグインバージョンに関するGradleの警告が表示されることがあります。移行手順については、[互換性ガイド](compatibility-guide-23.md#unsupported-kgp-version-warning-when-using-kotlin-dsl-and-kotlin-jvm-plugins)を参照してください。

*   Kotlin Multiplatformでは、AndroidターゲットのサポートがGoogleの[`com.android.kotlin.multiplatform.library`プラグイン](https://developer.android.com/kotlin/multiplatform/plugin)を通じて利用できるようになりました。
    Androidターゲットを持つプロジェクトを新しいプラグインに移行し、`androidTarget`ブロックを`android`に名前変更してください。

*   Android Gradleプラグイン (AGP) 9.0.0以降でAndroidターゲットにKotlin Multiplatform Gradleプラグインを使い続ける場合、`androidTarget`ブロックを使用すると構成エラーが表示され、移行方法に関する診断メッセージが表示されます。詳細については、[Androidターゲット向けGoogleプラグインへの移行](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#migrate-to-google-s-plugin-for-android-targets)を参照してください。

*   AGP 9.0.0には[Kotlinの組み込みサポート](https://developer.android.com/build/releases/agp-preview#android-gradle-plugin-built-in-kotlin)が含まれています。
    Kotlin 2.3.0から、このバージョンのAGPで`kotlin-android`プラグインを使用すると、プラグインが不要になるため、[構成エラーが表示されます](compatibility-guide-23.md#deprecate-kotlin-android-plugin-for-agp-versions-9-0-0-and-later)。新しい診断メッセージは移行に役立ちます。
    古いAGPバージョンを使用している場合は、非推奨の警告が表示されます。

*   Antビルドシステムのサポートは利用できなくなりました。

## ドキュメントの更新

Kotlin Multiplatformのドキュメントがkotlinlang.orgに移動しました。これで、KotlinとKMPのドキュメントを1か所で切り替えることができます。
また、言語ガイドの目次を刷新し、新しいナビゲーションを導入しました。

前回のKotlinリリース以降のその他の注目すべき変更点:

*   [KMP概要](https://kotlinlang.org/docs/multiplatform/kmp-overview.html) – 単一ページでKotlin Multiplatformエコシステムを探索できます。
*   [Kotlin Multiplatformクイックスタート](https://kotlinlang.org/docs/multiplatform/quickstart.html) – KMP IDEプラグインで環境を設定する方法を学びます。
*   [Compose Multiplatform 1.9.3の新機能](https://kotlinlang.org/docs/multiplatform/whats-new-compose-190.html) – 最新リリースからのハイライトを学びます。
*   [Kotlin/JSの開始](js-get-started.md) – Kotlin/JavaScriptを使用してブラウザ用のWebアプリケーションを作成します。
*   [クラス](classes.md) – Kotlinでクラスを使用する際の基本とベストプラクティスを学びます。
*   [拡張機能](extensions.md) – Kotlinでクラスとインターフェースを拡張する方法を学びます。
*   [コルーチンの基本](coroutines-basics.md) – 主要なコルーチンコンセプトを探索し、最初のコルーチンを作成する方法を学びます。
*   [キャンセルとタイムアウト](cancellation-and-timeouts.md) – コルーチンのキャンセルがどのように機能するか、およびコルーチンがキャンセルに応答するようにする方法を学びます。
*   [Kotlin/Nativeライブラリ](native-libraries.md) – `klib`ライブラリアーティファクトを生成する方法を確認します。
*   [Kotlin Notebook概要](kotlin-notebook-overview.md) – Kotlin Notebookプラグインを使用してインタラクティブなノートブックドキュメントを作成します。
*   [JavaプロジェクトにKotlinを追加](mixing-java-kotlin-intellij.md) – KotlinとJavaの両方を使用するようにJavaプロジェクトを構成します。
*   [KotlinでJavaコードをテスト](jvm-test-using-junit.md) – JUnitを使用してJavaとKotlinの混合プロジェクトをテストします。
*   [新しい導入事例ページ](https://kotlinlang.org/case-studies/) – さまざまな企業がKotlinをどのように適用しているかを発見します。

## Kotlin 2.3.0への更新方法

Kotlinプラグインは、IntelliJ IDEAおよびAndroid Studioにバンドルされたプラグインとして配布されます。

新しいKotlinバージョンに更新するには、ビルドスクリプトで[Kotlinのバージョンを2.3.0に変更します](releases.md#update-to-a-new-kotlin-version)。