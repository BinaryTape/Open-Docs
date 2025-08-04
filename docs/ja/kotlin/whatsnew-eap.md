[//]: # (title: Kotlin %kotlinEapVersion% の新機能)

_[リリース日: %kotlinEapReleaseDate%](eap.md#build-details)_

> このドキュメントは早期アクセスプレビュー (EAP) リリースのすべての機能を網羅しているわけではありませんが、
> 主要な改善点に焦点を当てています。
>
> 変更点の全リストは[GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)を参照してください。
>
{style="note"}

Kotlin %kotlinEapVersion% がリリースされました！
このEAPリリースの詳細の一部を以下に示します。

*   Kotlin Multiplatform: [Swiftエクスポートがデフォルトで利用可能に](#swift-export-available-by-default)、[`js` および `wasmJs` ターゲットの共有ソースセット](#shared-source-set-for-js-and-wasmjs-targets)、[Kotlinライブラリの安定したクロスプラットフォームコンパイル](#stable-cross-platform-compilation-for-kotlin-libraries)、および[共通依存関係を宣言する新しいアプローチ](#new-approach-for-declaring-common-dependencies)。
*   言語: [中断関数型を持つオーバーロードにラムダを渡す際のオーバーロード解決の改善](#improved-overload-resolution-for-lambdas-with-suspend-function-types)。
*   Kotlin/Native: [バイナリでのスタックカナリアのサポート](#support-for-stack-canaries-in-binaries)と[iOSターゲットのバイナリサイズの縮小](#smaller-binary-size-for-ios-targets)。
*   Kotlin/Wasm: [Kotlin/WasmとJavaScript相互運用における例外処理の改善](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop)。
*   Kotlin/JS: [`Long` 値がJavaScript `BigInt` にコンパイルされるように](#usage-of-bigint-type-to-represent-kotlin-s-long-type)。

## IDEのサポート

Kotlin %kotlinEapVersion% をサポートするKotlinプラグインは、IntelliJ IDEAおよびAndroid Studioの最新バージョンにバンドルされています。
IDEのKotlinプラグインを更新する必要はありません。
必要なのは、ビルドスクリプトでKotlinのバージョンを[ %kotlinEapVersion% に変更](configure-build-for-eap.md)することだけです。

詳細については、[新しいリリースへの更新](releases.md#update-to-a-new-kotlin-version)を参照してください。

## 言語

Kotlin %kotlinEapVersion% では、Kotlin 2.3.0 で予定されている今後の言語機能を試すことができます。これには、[中断関数型を持つオーバーロードにラムダを渡す際のオーバーロード解決の改善](#improved-overload-resolution-for-lambdas-with-suspend-function-types)と、[明示的な戻り値型を持つ式本体での `return` ステートメントのサポート](#support-for-return-statements-in-expression-bodies-with-explicit-return-types)が含まれます。

### 中断関数型を持つラムダのオーバーロード解決の改善

これまで、通常関数型と `suspend` 関数型の両方で関数をオーバーロードすると、ラムダを渡す際に曖昧さエラーが発生していました。このエラーは明示的な型キャストで回避できましたが、コンパイラは誤って `No cast needed` 警告を報告していました。

```kotlin
// 2つのオーバーロードを定義
fun transform(block: () -> Int) {}
fun transform(block: suspend () -> Int) {}

fun test() {
    // オーバーロード解決の曖昧さで失敗
    transform({ 42 })

    // 明示的なキャストを使用するが、コンパイラは誤って「キャスト不要」警告を報告
    transform({ 42 } as () -> Int)
}
```

この変更により、通常関数型と `suspend` 関数型の両方のオーバーロードを定義した場合、キャストなしのラムダは通常のオーバーロードに解決されます。明示的に中断オーバーロードに解決するには、`suspend` キーワードを使用します。

```kotlin
// transform(() -> Int) に解決
transform({ 42 })

// transform(suspend () -> Int) に解決
transform(suspend { 42 })
```

この動作はKotlin 2.3.0でデフォルトで有効になります。今すぐテストするには、以下のコンパイラオプションを使用して言語バージョンを `2.3` に設定してください。

```kotlin
-language-version 2.3
```

または、`build.gradle(.kts)` ファイルで設定します。

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

課題トラッカーの[YouTrack](https://youtrack.jetbrains.com/issue/KT-23610)にてフィードバックをいただけると幸いです。

### 明示的な戻り値型を持つ式本体での `return` ステートメントのサポート

これまで、式本体で `return` を使用すると、関数の戻り値型が `Nothing` と推論される可能性があるため、コンパイラエラーが発生していました。

```kotlin
fun example() = return 42
// エラー: 式本体を持つ関数ではreturnは禁止されています
```

この変更により、戻り値型が明示的に記述されている限り、式本体で `return` を使用できるようになりました。

```kotlin
// 戻り値型を明示的に指定
fun getDisplayNameOrDefault(userId: String?): String = getDisplayName(userId ?: return "default")

// 戻り値型を明示的に指定しないため失敗
fun getDisplayNameOrDefault(userId: String?) = getDisplayName(userId ?: return "default")
```

同様に、式本体を持つ関数のラムダ内およびネストされた式内の `return` ステートメントは、意図せずコンパイルされていました。Kotlinは、戻り値型が明示的に指定されている限り、これらのケースをサポートするようになりました。明示的な戻り値型を持たないケースはKotlin 2.3.0で非推奨になります。

```kotlin
// 戻り値型が明示的に指定されておらず、returnステートメントがラムダ内にあり、非推奨になる
fun returnInsideLambda() = run { return 42 }

// 戻り値型が明示的に指定されておらず、returnステートメントがローカル変数の初期化子内にあり、非推奨になる
fun returnInsideIf() = when {
    else -> {
        val result = if (someCondition()) return "" else "value"
        result
    }
}
```

この動作はKotlin 2.3.0でデフォルトで有効になります。今すぐテストするには、以下のコンパイラオプションを使用して言語バージョンを `2.3` に設定してください。

```kotlin
-language-version 2.3
```

または、`build.gradle(.kts)` ファイルで設定します。

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

課題トラッカーの[YouTrack](https://youtrack.jetbrains.com/issue/KT-76926)にてフィードバックをいただけると幸いです。

## Kotlin/JVM: when式での invokedynamic のサポート
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% では、`when` 式を `invokedynamic` でコンパイルできるようになりました。
以前は、複数の型チェックを含む `when` 式は、バイトコードで長い `instanceof` チェックのチェーンにコンパイルされていました。

以下の条件が満たされた場合、`when` 式で `invokedynamic` を使用して、Javaの `switch` ステートメントによって生成されるバイトコードと同様に、より小さなバイトコードを生成できるようになりました。

*   `else` を除くすべての条件が `is` または `null` チェックである。
*   式に[ガード条件 (`if`)](control-flow.md#guard-conditions-in-when-expressions)が含まれていない。
*   条件に、可変Kotlinコレクション (`MutableList`) や関数型 (`kotlin.Function1`、`kotlin.Function2` など) のように直接型チェックできない型が含まれていない。
*   `else` 以外に少なくとも2つの条件がある。
*   すべてのブランチが `when` 式の同じ対象をチェックしている。

例:

```kotlin
open class Example

class A : Example()
class B : Example()
class C : Example()

fun test(e: Example) = when (e) {
    // invokedynamic を SwitchBootstraps.typeSwitch と共に使用
    is A -> 1
    is B -> 2
    is C -> 3
    else -> 0
}
```

新しい機能を有効にすると、この例の `when` 式は、複数の `instanceof` チェックではなく、単一の `invokedynamic` 型スイッチにコンパイルされます。

この機能を有効にするには、KotlinコードをJVMターゲット21以上でコンパイルし、以下のコンパイラオプションを追加します。

```bash
-Xwhen-expressions=indy
```

または、`build.gradle(.kts)` ファイルの `compilerOptions {}` ブロックに追加します。

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-expressions=indy")
    }
}
```

この機能は[試験的](components-stability.md#stability-levels-explained)です。フィードバックや質問がある場合は、[YouTrack](https://youtrack.jetbrains.com/issue/KT-65688)で共有してください。

## Kotlin Multiplatform

Kotlin %kotlinEapVersion% は、Kotlin Multiplatformに大きな変更をもたらします。Swiftエクスポートがデフォルトで利用可能になり、新しい共有ソースセットが追加され、共通依存関係を管理する新しいアプローチを試すことができます。

### Swiftエクスポートがデフォルトで利用可能に
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% は、Swiftエクスポートの試験的サポートを導入します。これにより、Kotlinソースを直接エクスポートし、SwiftからKotlinコードを慣用的に呼び出すことができ、Objective-Cヘッダーは不要になります。

これは、Appleターゲットのマルチプラットフォーム開発を大幅に改善するはずです。たとえば、トップレベル関数を持つKotlinモジュールがある場合、Swiftエクスポートにより、クリーンなモジュール固有のインポートが可能になり、紛らわしいObjective-Cのアンダースコアやマングルされた名前が排除されます。

主な機能は次のとおりです。

*   **マルチモジュールサポート**。各Kotlinモジュールは個別のSwiftモジュールとしてエクスポートされ、関数呼び出しを簡素化します。
*   **パッケージサポート**。Kotlinパッケージはエクスポート時に明示的に保持され、生成されたSwiftコードでの名前の競合を回避します。
*   **型エイリアス**。Kotlinの型エイリアスはエクスポートされ、Swiftで保持されるため、可読性が向上します。
*   **プリミティブのnull許容性強化**。`Int?` のような型を null許容性を保持するために `KotlinInt` のようなラッパークラスにボックス化する必要があったObjective-C相互運用とは異なり、Swiftエクスポートは null許容性情報を直接変換します。
*   **オーバーロード**。Kotlinのオーバーロードされた関数をSwiftで曖昧さなく呼び出すことができます。
*   **フラット化されたパッケージ構造**。KotlinパッケージをSwift enumに変換し、生成されたSwiftコードからパッケージプレフィックスを削除できます。
*   **モジュール名のカスタマイズ**。KotlinプロジェクトのGradle設定で、結果のSwiftモジュール名をカスタマイズできます。

#### Swiftエクスポートを有効にする方法

この機能は現在[試験的](components-stability.md#stability-levels-explained)であり、iOSフレームワークをXcodeプロジェクトに接続するために[直接統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)を使用するプロジェクトでのみ機能します。これは、IntelliJ IDEAのKotlin Multiplatformプラグインまたは[Webウィザード](https://kmp.jetbrains.com/)で作成されたKotlin Multiplatformプロジェクトの標準構成です。

Swiftエクスポートを試すには、Xcodeプロジェクトを設定します。

1.  Xcodeで、プロジェクト設定を開きます。
2.  **Build Phases**タブで、`embedAndSignAppleFrameworkForXcode` タスクを含む**Run Script**フェーズを見つけます。
3.  スクリプトを調整して、スクリプト実行フェーズで `embedSwiftExportForXcode` タスクを使用するようにします。

  ```bash
  ./gradlew :<Shared module name>:embedSwiftExportForXcode
  ```

  ![Swiftエクスポートスクリプトの追加](xcode-swift-export-run-script-phase.png){width=700}

4.  プロジェクトをビルドします。Swiftモジュールはビルド出力ディレクトリに生成されます。

この機能はデフォルトで利用可能です。以前のリリースですでに有効にしていた場合は、`kotlin.experimental.swift-export.enabled` を `gradle.properties` ファイルから削除できます。

> 時間を節約するには、Swiftエクスポートが既にセットアップされている[公開サンプル](https://github.com/Kotlin/swift-export-sample)をクローンしてください。
>
{style="tip"}

Swiftエクスポートの詳細については、[README](https://github.com/JetBrains/kotlin/tree/master/docs/swift-export#readme)を参照してください。

#### フィードバックを残す

今後のKotlinリリースでは、Swiftエクスポートのサポートを拡大し、徐々に安定させる予定です。
Kotlin 2.2.20以降、特にコルーチンとフロー周辺のKotlinとSwift間の相互運用性の改善に注力します。

Swiftエクスポートのサポートは、Kotlin Multiplatformにとって重要な変更です。皆様からのフィードバックをいただけると幸いです。

*   Kotlin Slackで開発チームに直接連絡する – [招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)と[#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9)チャンネルに参加できます。
*   Swiftエクスポートに関する問題は[YouTrack](https://kotl.in/issue)に報告してください。

### js および wasmJs ターゲットの共有ソースセット

これまで、Kotlin MultiplatformにはJavaScript (`js`) およびWebAssembly (`wasmJs`) Webターゲットの共有ソースセットがデフォルトで含まれていませんでした。
`js` と `wasmJs` の間でコードを共有するには、カスタムソースセットを手動で設定するか、`js` 用と `wasmJs` 用に2つの場所でコードを記述する必要がありました。例:

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

このリリースから、Kotlin Gradleプラグインは、デフォルトの階層テンプレートを使用する際、Web用の新しい共有ソースセット (`webMain` と `webTest` で構成) を追加します。

この変更により、`web` ソースセットが `js` および `wasmJs` の両方のソースセットの親になります。更新されたソースセット階層は次のようになります。

![Webを使用したデフォルト階層テンプレートの例](default-hierarchy-example-with-web.svg)

新しいソースセットを使用すると、`js` と `wasmJs` の両方のターゲットに1つのコードを記述できます。
共有コードを `webMain` に配置すると、両方のターゲットで自動的に機能します。

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

この更新により、`js` と `wasmJs` ターゲット間でのコード共有が簡素化されます。これは、特に次の2つのケースで役立ちます。

*   コードを重複させることなく、`js` と `wasmJs` の両方のターゲットをサポートしたいライブラリ作成者向け。
*   WebをターゲットとするCompose Multiplatformアプリケーションを構築する開発者向け。これにより、より広範なブラウザ互換性のために、`js` と `wasmJs` の両方のターゲットへのクロスコンパイルが可能になります。このフォールバックモードを考慮すると、Webサイトを作成するとき、すべてのブラウザでそのまま動作します。最新のブラウザは `wasmJs` を使用し、古いブラウザは `js` を使用します。

この機能を試すには、`build.gradle(.kts)` ファイルの `kotlin {}` ブロックで[デフォルトの階層テンプレート](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)を使用してください。

デフォルトの階層を使用する前に、カスタム共有ソースセットを持つプロジェクトがある場合や、`js("web")` ターゲットの名前を変更した場合の潜在的な競合を慎重に検討してください。これらの競合を解決するには、競合するソースセットまたはターゲットの名前を変更するか、デフォルトの階層を使用しないでください。

### Kotlinライブラリの安定したクロスプラットフォームコンパイル

Kotlin %kotlinEapVersion% は、Kotlinライブラリのクロスプラットフォームコンパイルを安定させる重要な[ロードマップ項目](https://youtrack.jetbrains.com/issue/KT-71290)を完了します。

Kotlinライブラリを公開するための `.klib` アーティファクトを生成するために、任意のホストを使用できるようになりました。これにより、特に以前はMacマシンが必要だったAppleターゲットの公開プロセスが大幅に効率化されます。

この機能はデフォルトで利用可能です。`kotlin.native.enableKlibsCrossCompilation=true` でクロスコンパイルをすでに有効にしていた場合は、`gradle.properties` ファイルから削除できるようになりました。

残念ながら、いくつかの制限がまだ残っています。以下の場合には、依然としてMacマシンを使用する必要があります。

*   ライブラリに[cinterop依存関係](native-c-interop.md)がある場合。
*   プロジェクトに[CocoaPods統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)が設定されている場合。
*   Appleターゲットの[最終バイナリ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)をビルドまたはテストする必要がある場合。

マルチプラットフォームライブラリの公開に関する詳細については、[ドキュメント](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)を参照してください。

### 共通依存関係を宣言する新しいアプローチ
<primary-label ref="experimental-opt-in"/>

Gradleを使用したマルチプラットフォームプロジェクトのセットアップを簡素化するために、Kotlin %kotlinEapVersion% では、トップレベルの `dependencies {}` ブロックを使用して `kotlin {}` ブロック内で共通依存関係を宣言できるようになりました。これらの依存関係は、`commonMain` ソースセットで宣言されたかのように動作します。この機能は、Kotlin/JVMおよびAndroid専用プロジェクトで使用するdependenciesブロックと同様に機能し、Kotlin Multiplatformでは現在[試験的](components-stability.md#stability-levels-explained)です。プロジェクトレベルで共通依存関係を宣言することで、ソースセット間での繰り返しの設定が減り、ビルド設定の合理化に役立ちます。必要に応じて、各ソースセットにプラットフォーム固有の依存関係を追加することは引き続き可能です。

この機能を試すには、トップレベルの `dependencies {}` ブロックの前に `@OptIn(ExperimentalKotlinGradlePluginApi::class)` アノテーションを追加してオプトインしてください。例:

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

この機能に関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-76446)でいただけると幸いです。

## Kotlin/Native

Kotlin %kotlinEapVersion% は、Kotlin/Nativeバイナリとデバッグの改善をもたらします。

### バイナリでのスタックカナリアのサポート

%kotlinEapVersion% から、Kotlinは結果のKotlin/Nativeバイナリでスタックカナリアのサポートを追加します。スタック保護の一部として、このセキュリティ機能はスタック破壊を防ぎ、一般的なアプリケーションの脆弱性を緩和します。SwiftおよびObjective-Cですでに利用可能でしたが、Kotlinでもサポートされるようになりました。

#### スタックカナリアを有効にする方法

Kotlin/Nativeでのスタック保護の実装は、[Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector)のスタックプロテクターの動作に準拠しています。

スタックカナリアを有効にするには、`gradle.properties` ファイルに以下のプロパティを追加します。

```none
kotlin.native.binary.stackProtector=yes
```

このプロパティは、スタック破壊に対して脆弱なすべてのKotlin関数に対して機能を有効にします。代替モードは次のとおりです。

*   `kotlin.native.binary.stackProtector=strong`: スタック破壊に対して脆弱な関数に対してより強力なヒューリスティックを使用します。
*   `kotlin.native.binary.stackProtector=all`: すべての関数に対してスタックプロテクターを有効にします。

場合によっては、スタック保護がパフォーマンスコストを伴う可能性があることに注意してください。

### iOSターゲットのバイナリサイズの縮小
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% では、iOSターゲットのバイナリサイズを削減できる `smallBinary` オプションが導入されました。
この新しいオプションは、LLVMコンパイルフェーズ中のコンパイラのデフォルト最適化引数として `-Oz` を効果的に設定します。

`smallBinary` オプションを有効にすると、リリースバイナリを小さくし、ビルド時間を改善できます。ただし、場合によってはランタイムパフォーマンスに影響を与える可能性があります。

#### バイナリサイズを縮小する方法

新しい機能は現在[試験的](components-stability.md#stability-levels-explained)です。プロジェクトで試すには、`-Xbinary=smallBinary=true` コンパイラオプションを使用するか、`gradle.properties` ファイルを次のように更新します。

```none
kotlin.native.binary.smallBinary=true
```

特定のバイナリの場合、`build.gradle(.kts)` ファイルで `binaryOption("smallBinary", "true")` を設定します。例:

```kotlin
kotlin {
    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64(),
    ).forEach {
        it.binaries.framework {
            binaryOption("smallBinary", "true")
        }
    }
}
```

この機能の実装にご協力いただいた[Troels Lund](https://github.com/troelsbjerre)氏にKotlinチームは感謝します。

### デバッガオブジェクトの概要の改善

Kotlin/Nativeは、LLDBやGDBなどのデバッガツールに対して、より明確なオブジェクトの概要を生成するようになりました。これにより、生成されるデバッグ情報の可読性が向上し、デバッグエクスペリエンスが合理化されます。

以前は、次のようなオブジェクトを検査した場合：

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

メモリアドレスへのポインタを含む限られた情報しか表示されませんでした。

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

Kotlin %kotlinEapVersion% では、デバッガは実際の値を含むより豊富な詳細を表示します。

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

この機能の実装にご協力いただいた[Nikita Nazarov](https://github.com/nikita-nazarov)氏にKotlinチームは感謝します。

Kotlin/Nativeでのデバッグの詳細については、[ドキュメント](native-debugging.md)を参照してください。

## Kotlin/Wasm

Kotlin/Wasmには、npm依存関係の分離やJavaScript相互運用における例外処理の改善など、いくつかの品質向上 (QoL改善) がもたらされます。

### 分離された npm 依存関係

以前は、Kotlin/Wasmプロジェクトでは、すべての[npm](https://www.npmjs.com/)依存関係がプロジェクトフォルダにまとめてインストールされていました。これには、独自の依存関係とKotlinツールの依存関係の両方が含まれていました。これらの依存関係は、プロジェクトのロックファイル (`package-lock.json` または `yarn.lock`) にもまとめて記録されていました。

結果として、Kotlinツールの依存関係が更新されるたびに、何も追加または変更していなくても、ロックファイルを更新する必要がありました。

Kotlin %kotlinEapVersion% から、Kotlinツールのnpm依存関係はプロジェクトの外にインストールされるようになりました。これにより、ツールとユーザーの依存関係が別々のディレクトリを持つようになります。

*   **ツール依存関係のディレクトリ:**

  `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

*   **ユーザー依存関係のディレクトリ:**

  `build/wasm/node_modules`

また、プロジェクトディレクトリ内のロックファイルには、ユーザー定義の依存関係のみが含まれます。

この改善により、ロックファイルは独自の依存関係のみに焦点を絞られ、プロジェクトをよりクリーンに保ち、ファイルへの不必要な変更を減らすことができます。

この変更は、`wasm-js` ターゲットではデフォルトで有効になっています。`js` ターゲットにはまだ実装されていません。今後のリリースで実装する計画はありますが、Kotlin %kotlinEapVersion% では `js` ターゲットのnpm依存関係の動作は変更ありません。

### Kotlin/WasmとJavaScript相互運用における例外処理の改善

これまで、KotlinはJavaScript (JS) でスローされ、Kotlin/Wasmコードに伝播する例外 (エラー) を理解するのが困難でした。

場合によっては、WebAssemblyコードからJSに例外がスローまたは渡され、詳細なしで `WebAssembly.Exception` にラップされるという逆方向でも問題が発生しました。これらのKotlinの例外処理の問題は、デバッグを困難にしていました。

Kotlin %kotlinEapVersion% から、例外に関する開発者のエクスペリエンスが両方向で改善されます。

*   JavaScriptから例外がスローされた場合: Kotlin側でより多くの情報を確認できます。
    このような例外がKotlinを介してJSに伝播する場合、WebAssemblyにラップされなくなります。
*   Kotlinから例外がスローされた場合: JSエラーとしてJavaScript側でキャッチできるようになりました。

新しい例外処理は、[`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag)機能をサポートするモダンブラウザで自動的に機能します。

*   Chrome 115+
*   Firefox 129+
*   Safari 18.4+

古いブラウザでは、例外処理の動作は変更ありません。

## Kotlin/JS

Kotlin %kotlinEapVersion% は、Kotlinの `Long` 型を表す `BigInt` 型の使用をサポートし、エクスポートされた宣言で `Long` を有効にします。さらに、このリリースではNode.js引数をクリーンアップするためのDSL関数が追加されました。

### KotlinのLong型を表すBigInt型の使用
<primary-label ref="experimental-opt-in"/>

ES2020標準以前、JavaScript (JS) は53ビットより大きい正確な整数のプリミティブ型をサポートしていませんでした。

このため、Kotlin/JSは `Long` 値 (64ビット幅) を、2つの `number` プロパティを含むJavaScriptオブジェクトとして表現していました。このカスタム実装により、KotlinとJavaScript間の相互運用性がより複雑になっていました。

Kotlin %kotlinEapVersion% から、Kotlin/JSは、最新のJavaScript (ES2020) にコンパイルする際、Kotlinの `Long` 値を表すためにJavaScriptの組み込み `BigInt` 型を使用するようになりました。

この変更により、[ `Long` 型をJavaScriptにエクスポートする](#usage-of-long-in-exported-declarations)機能も有効になり、KotlinとJavaScript間の相互運用性が簡素化されます。

有効にするには、`build.gradle(.kts)` ファイルに以下のコンパイラオプションを追加します。

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

この機能はまだ[試験的](components-stability.md#stability-levels-explained)です。問題がある場合は、課題トラッカーの[YouTrack](https://youtrack.jetbrains.com/issue/KT-57128)に報告してください。

#### エクスポートされた宣言でのLongの使用

Kotlin/JSはカスタムの `Long` 表現を使用していたため、JavaScriptからKotlinの `Long` と直接やり取りする簡単な方法を提供するのは困難でした。結果として、`Long` 型を使用するKotlinコードをJavaScriptにエクスポートすることはできませんでした。
この問題は、関数パラメーター、クラスプロパティ、コンストラクタなど、`Long` を使用するすべてのコードに影響を与えました。

Kotlinの `Long` 型がJavaScriptの `BigInt` 型にコンパイルできるようになったため、Kotlin/JSは `Long` 値をJavaScriptにエクスポートするのをサポートし、KotlinとJavaScriptコード間の相互運用性を簡素化します。

この機能を有効にするには：

1.  Kotlin/JSで `Long` のエクスポートを許可します。`build.gradle(.kts)` ファイルの `freeCompilerArgs` 属性に以下のコンパイラ引数を追加します。

    ```kotlin
    // build.gradle.kts
    kotlin {
        js {
            ...
            compilerOptions {                   
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2.  `BigInt` 型を有効にします。[Kotlinの `Long` 型を表す `BigInt` 型の使用](#usage-of-bigint-type-to-represent-kotlin-s-long-type)で有効にする方法を参照してください。

### よりクリーンな引数用の新しいDSL関数

Node.jsでKotlin/JSアプリケーションを実行する場合、プログラムに渡される引数 (`args`) には、次のものが含まれていました。

*   実行可能ファイル `Node` へのパス。
*   スクリプトへのパス。
*   提供した実際のコマンドライン引数。

しかし、`args` の期待される動作はコマンドライン引数のみを含むことでした。これを実現するには、`build.gradle(.kts)` ファイルまたはKotlinコード内で `drop()` 関数を使用して最初の2つの引数を手動でスキップする必要がありました。

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

この回避策は繰り返しの作業でエラーが発生しやすく、プラットフォーム間でコードを共有する際にはうまく機能しませんでした。

この問題を修正するため、Kotlin %kotlinEapVersion% では `passCliArgumentsToMainFunction()` という新しいDSL関数が導入されました。

この関数を使用すると、引数にはコマンドライン引数のみが含まれ、`Node` とスクリプトのパスは除外されます。

```kotlin
fun main(args: Array<String>) {
    // drop()は不要で、カスタム引数のみが含まれる
    println(args.joinToString(", "))
}
```

この変更により、ボイラープレートコードが削減され、手動で引数を削除することによる間違いが回避され、クロスプラットフォーム互換性が向上します。

この機能を有効にするには、`build.gradle(.kts)` ファイル内に以下のDSL関数を追加します。

```kotlin
kotlin {
    js {
        nodejs {
            passCliArgumentsToMainFunction()
        }
    }
}
```

## Gradle: Kotlin/Nativeタスクのビルドレポートにおける新しいコンパイラパフォーマンス指標

Kotlin 1.7.0では、コンパイラのパフォーマンス追跡を支援するために[ビルドレポート](gradle-compilation-and-caches.md#build-reports)を導入しました。それ以来、パフォーマンス問題の調査にさらに詳細で役立つように、より多くの指標を追加してきました。

Kotlin %kotlinEapVersion% では、ビルドレポートにKotlin/Nativeタスクのコンパイラパフォーマンス指標が含まれるようになりました。

ビルドレポートとそれらを構成する方法の詳細については、[ビルドレポートの有効化](gradle-compilation-and-caches.md#enabling-build-reports)を参照してください。

## Maven: kotlin-maven-pluginにおけるKotlinデーモンのサポート

[Kotlin 2.2.0でのビルドツールAPIの導入](whatsnew22.md#new-experimental-build-tools-api)により、Kotlin %kotlinEapVersion% は、`kotlin-maven-plugin` でKotlinデーモンのサポートを追加することで、さらに一歩踏み込みました。Kotlinデーモンを使用すると、Kotlinコンパイラは別の隔離されたプロセスで実行され、他のMavenプラグインがシステムプロパティを上書きするのを防ぎます。この[YouTrack課題](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path)で例を確認できます。

Kotlin %kotlinEapVersion% から、Kotlinデーモンがデフォルトで使用されるようになりました。これにより、[インクリメンタルコンパイル](maven.md#enable-incremental-compilation)の追加の利点が得られ、ビルド時間を短縮するのに役立ちます。以前の動作に戻したい場合は、`pom.xml` ファイルで次のプロパティを `false` に設定してオプトアウトしてください。

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin %kotlinEapVersion% はまた、新しい `jvmArgs` プロパティを導入しました。これを使用して、KotlinデーモンのデフォルトのJVM引数をカスタマイズできます。たとえば、`-Xmx` および `-Xms` オプションをオーバーライドするには、`pom.xml` ファイルに以下を追加します。

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## 標準ライブラリ: Kotlin/JSにおけるリフレクションによるインターフェース型識別のサポート
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% は、Kotlin/JS標準ライブラリに試験的な `KClass.isInterface` プロパティを追加します。

このプロパティを使用すると、クラス参照がKotlinインターフェースを表しているかどうかをチェックできるようになりました。これにより、`KClass.java.isInterface` を使用してクラスがインターフェースを表しているかどうかをチェックできるKotlin/JVMとのパリティがKotlin/JSで近づきました。

オプトインするには、`@OptIn(ExperimentalStdlibApi::class)` アノテーションを使用します。

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun inspect(klass: KClass<*>) {
    // インターフェースの場合はtrueを出力
    println(klass.isInterface)
}
```

課題トラッカーの[YouTrack](https://youtrack.jetbrains.com/issue/KT-78581)にてフィードバックをいただけると幸いです。