[//]: # (title: Kotlin %kotlinEapVersion% の新機能)

<primary-label ref="eap"/>

<web-summary>Kotlin Early Access Preview (EAP) のリリースノートを確認し、正式リリース前の最新の実験的 Kotlin 機能を試してみましょう。</web-summary>

_[リリース日: %kotlinEapReleaseDate%](eap.md#build-details)_

> このドキュメントは Early Access Preview (EAP) リリースのすべての機能を網羅しているわけではありませんが、主要な改善点について詳しく説明します。
>
> 変更点の完全なリストについては、[GitHub の変更履歴](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)を参照してください。
>
{style="note"}

Kotlin %kotlinEapVersion% がリリースされました！この EAP リリースの主な内容は以下の通りです。

* **標準ライブラリ**: [コルーチンのスタックトレース復元のサポート](#standard-library-support-for-coroutine-stack-trace-recovery)
* **Kotlin/Native**: [`klib` アーティファクトに対するデフォルトのインクリメンタルコンパイル](#kotlin-native-incremental-compilation-enabled-by-default)
* **Kotlin/Wasm**: [トップレベルの `require()` 呼び出しの変更とコンパニオンオブジェクトの初期化順序の改善](#kotlin-wasm)
* **Kotlin/JS**: [ブラウザテスト用の新しい DSL](#kotlin-js-new-dsl-for-browser-testing)
* **ビルドツール API**: [新しいターゲット（Kotlin/JS、Kotlin/Wasm、および Kotlin メタデータ）のサポート](#build-tools-api-support-for-kotlin-js-kotlin-wasm-and-kotlin-metadata)

> Kotlin のリリースサイクルに関する情報は、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## Kotlin %kotlinEapVersion% へのアップデート

最新バージョンの Kotlin は、最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) および [Android Studio](https://developer.android.com/studio) に含まれています。

新しい Kotlin バージョンにアップデートするには、IDE が最新バージョンに更新されていることを確認し、ビルドスクリプト内の [Kotlin バージョンを %kotlinEapVersion% に変更](releases.md#update-to-a-new-kotlin-version)してください。

## 標準ライブラリ: コルーチンのスタックトレース復元のサポート
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% では、標準ライブラリに `StackTraceRecoverable` インターフェースが追加されました。これにより、`kotlinx.coroutines` への依存関係を追加することなく、スタックトレース復元のための新しい例外インスタンスの作成方法を定義できるようになり、`kotlinx.coroutines` ライブラリとの統合が改善されます。

スタックトレース復元は、あるコルーチンが例外をスローし、別のコルーチンがそれを再スロー（rethrow）する場合のデバッグに役立ちます。これにより、例外がどこで発生し、どのコルーチンがそれを再スローしたかを確認できるようになります。

`kotlinx.coroutines` ライブラリは、追加のコルーチンスタックトレース情報を含む新しい例外インスタンスを作成することで、スタックトレース復元を実行します。これは、例外メッセージのみ、原因（cause）のみ、その両方、または引数なしのコンストラクタを持つ例外に対して自動的に行われます。

例外のコンストラクタに行番号やエラーコードなどの追加の必須引数がある場合は、`StackTraceRecoverable` インターフェースを実装して、`kotlinx.coroutines` ライブラリがその例外の新しいインスタンスをどのように作成するかを定義します。

そのためには、`copyForStackTraceRecovery()` 関数をオーバーライドします。この関数はスタックトレース復元のための新しい例外インスタンスを返します。`kotlinx.coroutines` ライブラリに例外をコピーさせたくない場合は `null` を返します。

> `StackTraceRecoverable` インターフェースはすべてのターゲットで使用可能ですが、`kotlinx.coroutines` ライブラリがスタックトレース復元のためにこれを使用するのは JVM 上のみです。
>
{style="note"}

これらの API は [実験的 (Experimental)](components-stability.md#stability-levels-explained) であり、`@OptIn(ExperimentalStdlibCoroutineSupportApi::class)` アノテーションによるオプトインが必要です。

以下は、スタックトレース復元用の新しいインスタンスを作成する際に `line` プロパティを保持するカスタム例外の例です。

```kotlin
import kotlin.coroutines.ExperimentalStdlibCoroutineSupportApi
import kotlin.coroutines.StackTraceRecoverable

@OptIn(ExperimentalStdlibCoroutineSupportApi::class)
class FileEditException
// cause を IllegalStateException コンストラクタに渡すために
// 実装にはプライベートコンストラクタが必要です
private constructor(
    val line: Int,
    private val detail: String,
    cause: Throwable?,
) : IllegalStateException("When editing line $line: $detail", cause),
    // スタックトレース復元の目的で StackTraceRecoverable を実装します
    StackTraceRecoverable<FileEditException> {

    constructor(line: Int, detail: String) : this(line, detail, null)

    // 行番号とメッセージの詳細をコピーします
    override fun copyForStackTraceRecovery(): FileEditException =
        FileEditException(line, detail, this)
}

@OptIn(ExperimentalStdlibCoroutineSupportApi::class) 
fun main() {
    val original = FileEditException(15, "Unexpected token")
    val copy = original.copyForStackTraceRecovery()

    println(copy.message)
    // When editing line 15: Unexpected token

    println(copy.cause == original)
    // true
}
```

詳細については、この機能の [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0461-stacktrace-recoverable.md) を参照してください。フィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-86595) でお待ちしております。

## Kotlin/Native: インクリメンタルコンパイルのデフォルト有効化

Kotlin %kotlinEapVersion% 以降、`klib` アーティファクトのインクリメンタルコンパイルがデフォルトで有効になりました。

インクリメンタルコンパイルを使用すると、プロジェクトモジュールによって生成された `klib` アーティファクトの一部のみが変更された場合、その `klib` の影響を受ける部分のみがさらにバイナリへと再コンパイルされます。

この最適化は [Kotlin 1.9.20](whatsnew1920.md#incremental-compilation-of-klib-artifacts) で初めて導入され、デバッグビルドのコンパイル時間を大幅に短縮することが実証されています。

一部のケースでは、この最適化によってクリーンビルドのパフォーマンスが低下する可能性があることに注意してください。

この機能で予期しない問題が発生した場合は、手動で無効にすることができます。無効にするには、`gradle.properties` ファイルに以下のオプションを設定してください。

```none
kotlin.incremental.native=false
```

問題が発生した場合は、イシュートラッカー [YouTrack](https://kotl.in/issue) で報告してください。コンパイル時間の改善に関するその他のヒントについては、[ドキュメント](native-improving-compilation-time.md) を参照してください。

## Kotlin/Wasm

Kotlin %kotlinEapVersion% では、`@JsFun` 宣言におけるトップレベルの `require()` 呼び出しの処理方法が変更され、コンパニオンオブジェクトの初期化順序が JVM の動作に合わせられました。

### `@JsFun` 宣言におけるトップレベルの `require()` 呼び出しの変更

Kotlin/Wasm は、`@JsFun` 宣言がトップレベルの `require()` 関数を使用している場合にエラーを報告するようになりました。

以前、コンパイラは `import-object.mjs` ファイル内に `require` 変数を生成しており、`@JsFun` 宣言から `require()` を呼び出すことが可能でした。

この動作は意図せずコンパイラの実装詳細を公開してしまっていました。この動作からの移行をサポートするため、Kotlin/Wasm はこの生成された `require` 宣言を削除し、コンパイラはこのような呼び出しに対してエラーを報告するようになりました。例：

```kotlin
// エラーを報告します
@JsFun("(mod) => require(mod)")
external fun loadModule(mod: String): JsAny
```

この変更に備えて、`@JsFun` 宣言内のトップレベルの `require()` 呼び出しを `@JsModule` アノテーションに置き換えてください。

```kotlin
@JsModule("module")
external val module: Module

external interface Module {
    // 期待されるモジュールメンバーを定義します
}
```

動的なモジュール読み込みには、代わりに `import()` 式を使用してください。webpack が動的インポートを解析するのを防ぐために、`/* webpackIgnore: true */` マジックコメントを追加してください。

```kotlin
@JsFun(
    """
    ((module) => () => module)(
        await import(/* webpackIgnore: true */ "module")
    )
"""
)
private external fun loadModuleDynamically(): JsAny?
```

また、`import()` 式を条件付きで使用することもできます。例えば、Node.js で実行されている場合にのみモジュールを読み込むことができます。

```kotlin
@JsFun(
    """
    ((module) => () => module)(
        ((typeof process !== "undefined") && (process.release.name === "node"))
            ? await import(/* webpackIgnore: true */ "module")
            : null
    )
"""
)
private external fun loadNodeModule(): JsAny?
```

プロジェクトがトップレベルの `require()` 関数を必要とする依存関係に依存している場合は、ワークアラウンドとして `globalThis` のプロパティに追加してください。

```kotlin
@JsFun(
    """
    ((module) => {
        globalThis.require = module.default.createRequire(import.meta.url)
        return () => {}
    })(await import("node:module"))
"""
)
external fun defineRequire()
```

問題が発生した場合は、[イシュートラッカー](https://youtrack.jetbrains.com/projects/KT/issues/KT-86192) でフィードバックを共有してください。

### コンパニオンオブジェクトの初期化順序の改善

Kotlin/Wasm は、JVM の動作に合わせて、サブクラスのコンパニオンオブジェクトよりも先にスーパークラスのコンパニオンオブジェクトを初期化するようになりました。以前は、初期化が逆になる可能性があり、プラットフォーム間で動作が一致していませんでした。

このアップデートにより、クロスプラットフォームの一貫性が向上し、クラス初期化の動作におけるプラットフォーム固有の違いが減少します。また、中間クラスがコンパニオンオブジェクトを宣言していないケースを含む、より深い継承階層におけるコンパニオンオブジェクトの初期化を正しく処理できるようになります。

## Kotlin/JS: ブラウザテスト用の新しい DSL
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% では、ブラウザ環境で Kotlin/JS テストを実行するための新しい実験的な DSL が導入されました。

現在、Kotlin Gradle プラグインは、異なるブラウザ間で JavaScript テストを実行するためのブラウザランチャーとして [Karma](https://github.com/karma-runner/karma) を使用しています。Karma プロジェクトは 2 年前から非推奨となっており、ブラウザテストをサポートするための代替手段を模索してきました。

新しい DSL は、内部でさまざまなツールを管理するマネージャーとして Karma を置き換えることを目的としており、以下のものが含まれています。

* テストランナーとしての [Mocha](https://mochajs.org/)。
* バンドラーとしての [Webpack](https://webpack.js.org/)（[将来のリリース](https://youtrack.jetbrains.com/issue/KT-48308/) で [Vite](https://vite.dev/) に置き換えられる予定です）。
* ブラウザドライバーおよび Chromium、Firefox、WebKit (Safari) ブラウザエンジンの配布マネージャーとしての [Playwright](https://playwright.dev/)。

新しいテスト用 DSL を試すには、Kotlin/JS ターゲット内の `browser{}` ブロックにオプトインの `test{}` ブロックを追加してください。

```kotlin
kotlin {
    js {
        browser {
            @OptIn(ExperimentalJsTestDsl::class)
            // 新しい test{} ブロックを追加し構成します
            test {
                // すべてのブラウザに共通のオプションを設定します
                browserDefaults {
                    timeout = Duration.ofSeconds(2)
                    headless = true
                }
                // Chromium テストランナーを有効にします
                chromium {
                    // 共通のタイムアウトオプションをオーバーライドします
                    timeout = Duration.ofSeconds(5)
                    launchArgs.add("--no-sandbox")
                }
                // Firefox テストランナーを有効にします
                firefox()
                // WebKit テストランナーを有効にします
                webkit { }
                // 追加の WebKit テストランナーを有効にし構成します
                webkit("noheadless") {
                    // カスタムオプションを設定します
                    headless = false
                }
            }
        }
    }
}
```

新しい DSL は活発に開発中です。フィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-66897) でお待ちしております。

## ビルドツール API: Kotlin/JS、Kotlin/Wasm、および Kotlin メタデータのサポート
<primary-label ref="experimental-general"/>

[Kotlin 2.2.0](whatsnew22.md#new-experimental-build-tools-api) では、ビルドツール API (BTA) が Kotlin/JVM で利用可能になりました。Kotlin 2.4.20-Beta1 では、新しいターゲット（Kotlin/JS、Kotlin/Wasm、および Kotlin メタデータ）のサポートを追加することで、BTA の安定化に向けた次のステップに進みます。

これにより、Kotlin Gradle プラグインとコンパイラの相互作用がより一貫したものになります。また、一部のケースでは、より高速で安定したコンパイルの恩恵を受けることができます。

BTA は、ビルドシステムと Kotlin コンパイラエコシステムの間の抽象化レイヤーとして機能するユニバーサルな API です。これは、利用可能なビルドツールにおいて、Kotlin の機能のサポートと Kotlin コンパイラとの互換性を確保するのに役立ちます。

Kotlin Gradle プラグインにおける新しいターゲットへの BTA サポートを段階的に展開する予定です。

* Kotlin 2.4.20-Beta1 では、フィードバックを収集するために、Kotlin/JS、Kotlin/Wasm、および Kotlin メタデータで BTA がデフォルトで有効になっています。プロジェクトでの追加の変更は必要ありません。
* Kotlin 2.4.20-Beta2 から最終的な Kotlin 2.4.20 リリースの間は、新しいターゲットでの BTA はオプトインとして利用可能になります。試すには、`gradle.properties` ファイルに対応するプロパティを追加してください。

  ```kotlin
  kotlin.wasm.runViaBuildToolsApi = true
  kotlin.js.runViaBuildToolsApi = true
  kotlin.metadata.runViaBuildToolsApi = true
  ```

* Kotlin 2.5.0 以降、BTA は Kotlin/JS、Kotlin/Wasm、および Kotlin メタデータで再びデフォルトで有効になります。

BTA の提案について詳しく知りたい、またはフィードバックを共有したい場合は、この [KEEP](https://github.com/Kotlin/KEEP/blob/build-tools-api/proposals/extensions/build-tools-api.md) を参照してください。