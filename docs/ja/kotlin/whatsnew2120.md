[//]: # (title: Kotlin 2.1.20 の新機能)

<web-summary>新しい言語機能、Kotlin Multiplatform、JVM、Native、JS、Wasm のアップデート、Gradle および Maven のビルドツールサポートを含む、Kotlin 2.1.20 のリリースノートをお読みください。</web-summary>

_[リリース日: 2025年3月20日](releases.md#release-history)_

Kotlin 2.1.20 がリリースされました！主なハイライトは以下の通りです：

* **K2 コンパイラのアップデート**: [新しい kapt および Lombok プラグインのアップデート](#kotlin-k2-compiler)
* **Kotlin Multiplatform**: [Gradle の Application プラグインを置き換える新しい DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* **Kotlin/Native**: [Xcode 16.3 のサポートと新しいインライン化の最適化](#kotlin-native)
* **Kotlin/Wasm**: [デフォルトのカスタムフォーマッタ、DWARF のサポート、Provider API への移行](#kotlin-wasm)
* **Gradle サポート**: [Gradle の Isolated Projects（隔離されたプロジェクト）との互換性とカスタムパブリケーションバリアント](#gradle)
* **標準ライブラリ**: [共通アトミック型、UUID サポートの改善、新しい時間追跡機能](#standard-library)
* **Compose コンパイラ**: [`@Composable` 関数に対する制限の緩和とその他のアップデート](#compose-compiler)
* **ドキュメント**: [Kotlin ドキュメントの注目すべき改善](#documentation-updates)

> Kotlin のリリースサイクルの詳細については、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## IDE のサポート

2.1.20 をサポートする Kotlin プラグインは、最新の IntelliJ IDEA および Android Studio にバンドルされています。
IDE の Kotlin プラグインを更新する必要はありません。
ビルドスクリプト内の Kotlin バージョンを 2.1.20 に変更するだけで済みます。

詳細は [新しいリリースへのアップデート](releases.md#update-to-a-new-kotlin-version) を参照してください。

### OSGi サポートのあるプロジェクトでの Kotlin アーティファクトのソースダウンロード

`kotlin-osgi-bundle` ライブラリのすべての依存関係のソースが、配布物に含まれるようになりました。これにより、
IntelliJ IDEA がこれらのソースをダウンロードして Kotlin シンボルのドキュメントを提供し、デバッグ体験を向上させることができます。

## Kotlin K2 コンパイラ

新しい Kotlin K2 コンパイラのプラグインサポートを継続的に改善しています。このリリースでは、新しい kapt
および Lombok プラグインのアップデートが行われました。

### 新しいデフォルトの kapt プラグイン
<primary-label ref="beta"/>

Kotlin 2.1.20 以降、すべてのプロジェクトで K2 実装の kapt コンパイラプラグインがデフォルトで有効になります。

JetBrains チームは、Kotlin 1.9.20 で K2 コンパイラ用の kapt プラグインの新しい実装をリリースしました。
それ以来、K2 kapt の内部実装をさらに発展させ、その動作を K1 バージョンと同様にしながら、パフォーマンスも大幅に向上させました。

K2 コンパイラで kapt を使用しているときに問題が発生した場合は、
一時的に以前のプラグイン実装に戻すことができます。

これを行うには、プロジェクトの `gradle.properties` ファイルに以下のオプションを追加します：

```kotlin
kapt.use.k2=false
```

問題が発生した場合は、弊社の [イシュートラッカー](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) に報告してください。

### Lombok コンパイラプラグイン: `@SuperBuilder` のサポートと `@Builder` のアップデート
<primary-label ref="experimental-general"/>

[Kotlin Lombok コンパイラプラグイン](lombok.md) が `@SuperBuilder` アノテーションをサポートし、クラス階層のビルダー作成が容易になりました。以前は、Kotlin で Lombok を使用する開発者は、継承を扱う際に手動でビルダーを定義する必要がありました。`@SuperBuilder` を使用すると、ビルダーは自動的にスーパークラスのフィールドを継承し、オブジェクト構築時にそれらを初期化できるようになります。

さらに、このアップデートにはいくつかの改善とバグ修正が含まれています：

* `@Builder` アノテーションがコンストラクタでも動作するようになり、より柔軟なオブジェクト作成が可能になりました。詳細は対応する [YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-71547) を参照してください。
* Kotlin での Lombok のコード生成に関するいくつかの問題が解決され、全体的な互換性が向上しました。詳細は [GitHub のチェンジログ](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) を参照してください。

`@SuperBuilder` アノテーションの詳細については、公式の [Lombok ドキュメント](https://projectlombok.org/features/experimental/SuperBuilder) を参照してください。

## Kotlin Multiplatform: Gradle の Application プラグインを置き換える新しい DSL
<primary-label ref="experimental-opt-in"/>

Gradle 8.7 以降、[Application](https://docs.gradle.org/current/userguide/application_plugin.html) プラグインは
Kotlin Multiplatform Gradle プラグインと互換性がなくなりました。Kotlin 2.1.20 では、同様の機能を実現するための実験的な
DSL が導入されました。新しい `executable {}` ブロックは、JVM ターゲットの実行タスクと Gradle
[ディストリビューション](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) を設定します。

ビルドスクリプトの `executable {}` ブロックの前に、以下の `@OptIn` アノテーションを追加してください：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

例：

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // このターゲットの "main" コンパイル用に、"runJvm" という名前の JavaExec タスクと Gradle ディストリビューションを設定します
            executable {
                mainClass.set("foo.MainKt")
            }

            // "main" コンパイル用に、"runJvmAnother" という名前の JavaExec タスクと Gradle ディストリビューションを設定します
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // 別のクラスを設定
                mainClass.set("foo.MainAnotherKt")
            }

            // "test" コンパイル用に、"runJvmTest" という名前の JavaExec タスクと Gradle ディストリビューションを設定します
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // "test" コンパイル用に、"runJvmTestAnother" という名前の JavaExec タスクと Gradle ディストリビューションを設定します
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

この例では、最初の `executable {}` ブロックで Gradle の [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) プラグインが適用されます。

問題が発生した場合は、[イシュートラッカー](https://kotl.in/issue) で報告するか、[公開 Slack チャンネル](https://kotlinlang.slack.com/archives/C19FD9681) でお知らせください。

## Kotlin/Native

### Xcode 16.3 のサポート

Kotlin **2.1.21** 以降、Kotlin/Native コンパイラは Xcode の最新安定版である Xcode 16.3 をサポートします。
Xcode をアップデートして、Apple オペレーティングシステム向けの Kotlin プロジェクトの開発を継続してください。

2.1.21 リリースでは、Kotlin Multiplatform プロジェクトでコンパイル失敗を引き起こしていた関連する [cinterop の問題](https://youtrack.jetbrains.com/issue/KT-75781/) も修正されています。

### 新しいインライン化の最適化
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 では、実際のコード生成フェーズの前に実行される、新しいインライン化の最適化パスが導入されました。

Kotlin/Native コンパイラの新しいインライン化パスは、標準の LLVM インライナよりも優れたパフォーマンスを発揮し、生成されたコードのランタイムパフォーマンスを向上させるはずです。

この新しいインライン化パスは現在 [実験的 (Experimental)](components-stability.md#stability-levels-explained) です。試してみるには、以下のコンパイラオプションを使用してください：

```none
-Xbinary=preCodegenInlineThreshold=40
```

弊社の実験では、しきい値を 40 トークン（コンパイラによって解析されるコードユニット）に設定することで、コンパイルの最適化において合理的な妥協点が得られることが示されています。弊社のベンチマークによると、これにより全体で 9.5% のパフォーマンス向上が得られます。もちろん、他の値を試すことも可能です。

バイナリサイズの増加やコンパイル時間の増大が発生した場合は、[YouTrack](https://kotl.in/issue) 経由で報告してください。

## Kotlin/Wasm

このリリースでは、Kotlin/Wasm のデバッグとプロパティの使用が改善されています。カスタムフォーマッタが開発ビルドでそのまま動作するようになり、DWARF デバッグによってコードの調査が容易になりました。さらに、Provider API により Kotlin/Wasm および Kotlin/JS でのプロパティの使用が簡素化されました。

### カスタムフォーマッタがデフォルトで有効に

以前は、Kotlin/Wasm コードを扱う際の Web ブラウザでのデバッグ体験を向上させるために、カスタムフォーマッタを [手動で設定](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm) する必要がありました。

このリリースでは、開発ビルドでカスタムフォーマッタがデフォルトで有効になっているため、追加の Gradle 設定は不要です。

この機能を使用するには、ブラウザの開発者ツールでカスタムフォーマッタが有効になっていることを確認するだけです：

* Chrome DevTools では、**Settings | Preferences | Console** にあるカスタムフォーマッタのチェックボックスを確認してください：

  ![Chrome でカスタムフォーマッタを有効にする](wasm-custom-formatters-chrome.png){width=400}

* Firefox DevTools では、**Settings | Advanced settings** にあるカスタムフォーマッタのチェックボックスを確認してください：

  ![Firefox でカスタムフォーマッタを有効にする](wasm-custom-formatters-firefox.png){width=400}

この変更は主に Kotlin/Wasm の開発ビルドに影響します。本番ビルドに特定の要件がある場合は、適宜 Gradle 設定を調整する必要があります。そのためには、`wasmJs {}` ブロックに以下のコンパイラオプションを追加します：

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

### Kotlin/Wasm コードデバッグのための DWARF サポート

Kotlin 2.1.20 では、Kotlin/Wasm における DWARF（Debugging With Arbitrary Record Format）のサポートが導入されました。

この変更により、Kotlin/Wasm コンパイラは生成された WebAssembly (Wasm) バイナリに DWARF データを埋め込むことができるようになります。多くのデバッガや仮想マシンはこのデータを読み取って、コンパイルされたコードに関する洞察を提供できます。

DWARF は主に、スタンドアロンの Wasm 仮想マシン (VM) 内で Kotlin/Wasm アプリケーションをデバッグする場合に役立ちます。この機能を使用するには、Wasm VM とデバッガが DWARF をサポートしている必要があります。

DWARF サポートにより、Kotlin/Wasm アプリケーションのステップ実行、変数の検査、コードの洞察が可能になります。この機能を有効にするには、以下のコンパイラオプションを使用してください：

```bash
-Xwasm-generate-dwarf
```

### Kotlin/Wasm および Kotlin/JS プロパティの Provider API への移行

以前は、Kotlin/Wasm および Kotlin/JS 拡張機能のプロパティは可変 (`var`) であり、ビルドスクリプトで直接割り当てられていました：

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

現在、プロパティは [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) を通じて公開されており、値を割り当てるには `.set()` 関数を使用する必要があります：

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API は、値が遅延計算され、タスクの依存関係と適切に統合されることを保証し、ビルドパフォーマンスを向上させます。

この変更に伴い、プロパティへの直接割り当ては非推奨となり、`NodeJsEnvSpec` や `YarnRootEnvSpec` などの `*EnvSpec` クラスの使用が推奨されます。

さらに、混乱を避けるためにいくつかのエイリアスタスクが削除されました：

| 非推奨のタスク | 置き換え |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` または `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` または `jsBrowserDistribution`         |

ビルドスクリプトで Kotlin/JS または Kotlin/Wasm のみを使用している場合、Gradle が自動的に割り当てを処理するため、アクションは不要です。

ただし、Kotlin Gradle プラグインに基づいたプラグインを保守しており、そのプラグインが `kotlin-dsl` を適用していない場合は、プロパティの割り当てを `.set()` 関数を使用するように更新する必要があります。

## Gradle

Kotlin 2.1.20 は、Gradle 7.6.3 から 8.11 までと完全に互換性があります。最新の Gradle リリースまでのバージョンも使用できますが、その場合は非推奨の警告が表示されたり、一部の新しい Gradle 機能が動作しなかったりする可能性があることに注意してください。

このバージョンの Kotlin には、Kotlin Gradle プラグインと Gradle の Isolated Projects（隔離されたプロジェクト）との互換性、およびカスタム Gradle パブリケーションバリアントのサポートが含まれています。

### Gradle の Isolated Projects と互換性のある Kotlin Gradle プラグイン
<primary-label ref="experimental-opt-in"/>

> この機能は現在、Gradle ではプレアルファの状態です。JS および Wasm ターゲットは現時点ではサポートされていません。
> Gradle バージョン 8.10 以降でのみ使用し、評価目的のみに留めてください。
>
{style="warning"}

Kotlin 2.1.0 以降、プロジェクトで [Gradle の Isolated Projects 機能のプレビュー](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform) が可能になりました。

以前は、Isolated Projects 機能を試す前に、プロジェクトをこの機能と互換性を持たせるために Kotlin Gradle プラグインを設定する必要がありました。Kotlin 2.1.20 では、この追加ステップは不要になりました。

現在は、Isolated Projects 機能を有効にするには、[システムプロパティを設定する](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it) だけです。

Gradle の Isolated Projects 機能は、マルチプラットフォームプロジェクト、および JVM または Android ターゲットのみを含むプロジェクトの両方の Kotlin Gradle プラグインでサポートされています。

特にマルチプラットフォームプロジェクトにおいて、アップグレード後に Gradle ビルドに問題が発生した場合は、以下を追加することで新しい Kotlin Gradle プラグインの動作を無効にできます：

```none
kotlin.kmp.isolated-projects.support=disable
```

ただし、マルチプラットフォームプロジェクトでこの Gradle プロパティを使用する場合、Isolated Projects 機能を使用することはできません。

この機能に関する体験については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) でお知らせください。

### カスタム Gradle パブリケーションバリアントの追加サポート
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 では、カスタム [Gradle パブリケーションバリアント (publication variants)](https://docs.gradle.org/current/userguide/variant_attributes.html) を追加するためのサポートが導入されました。この機能は、マルチプラットフォームプロジェクトおよび JVM をターゲットとするプロジェクトで利用可能です。

> この機能で既存の Gradle バリアントを変更することはできません。
>
{style="note"}

この機能は [実験的 (Experimental)](components-stability.md#stability-levels-explained) です。
オプトインするには、`@OptIn(ExperimentalKotlinGradlePluginApi::class)` アノテーションを使用してください。

カスタム Gradle パブリケーションバリアントを追加するには、`adhocSoftwareComponent()` 関数を呼び出します。この関数は [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) のインスタンスを返し、これを Kotlin DSL で設定できます：

```kotlin
plugins {
    // JVM と Multiplatform のみがサポートされています
    kotlin("jvm")
    // または
    kotlin("multiplatform")
}

kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    publishing {
        // AdhocSoftwareComponent のインスタンスを返します
        adhocSoftwareComponent()
        // または、以下のように DSL ブロック内で AdhocSoftwareComponent を設定できます
        adhocSoftwareComponent {
            // AdhocSoftwareComponent API を使用してここにカスタムバリアントを追加します
        }
    }
}
```

> バリアントの詳細については、Gradle の [パブリケーションのカスタマイズガイド](https://docs.gradle.org/current/userguide/publishing_customization.html) を参照してください。
>
{style="tip"}

## 標準ライブラリ

このリリースでは、標準ライブラリに新しい実験的機能が導入されました：共通アトミック型、UUID のサポート改善、および新しい時間追跡機能です。

### 共通アトミック型
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 では、標準ライブラリの `kotlin.concurrent.atomics` パッケージに共通アトミック型を導入し、スレッドセーフな操作のためのプラットフォームに依存しない共有コードを可能にしました。これにより、ソースセット間でアトミック性に依存するロジックを重複させる必要がなくなり、Kotlin Multiplatform プロジェクトの開発が簡素化されます。

`kotlin.concurrent.atomics` パッケージとそのプロパティは [実験的 (Experimental)](components-stability.md#stability-levels-explained) です。オプトインするには、`@OptIn(ExperimentalAtomicApi::class)` アノテーションまたはコンパイラオプション `-opt-in=kotlin.ExperimentalAtomicApi` を使用してください。

以下は、`AtomicInt` を使用して複数のスレッド間で処理済みアイテムを安全にカウントする方法を示す例です：

```kotlin
// 必要なライブラリをインポート
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // 処理済みアイテムのアトミックカウンタを初期化
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // 複数のコルーチンで処理するためにアイテムをチャンクに分割
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("thread ${Thread.currentThread()} で $item を処理中")
                    processedItems += 1 // カウンタをアトミックにインクリメント
                }
            }
         }
    }
//sampleEnd
    // 処理されたアイテムの総数を出力
    println("処理済みアイテムの総数: ${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

Kotlin のアトミック型と Java の [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) アトミック型との間のシームレスな相互運用を可能にするため、この API は `.asJavaAtomic()` および `.asKotlinAtomic()` 拡張関数を提供しています。JVM では、Kotlin のアトミックと Java のアトミックは実行時に同じ型であるため、オーバーヘッドなしで Java のアトミックを Kotlin のアトミックに、またはその逆に変換できます。

以下は、Kotlin と Java のアトミック型を併用する方法を示す例です：

```kotlin
// 必要なライブラリをインポート
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // Kotlin の AtomicInt を Java の AtomicInteger に変換
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java アトミックの値: ${javaAtomic.get()}")
    // Java アトミックの値: 42

    // Java の AtomicInteger を Kotlin の AtomicInt に戻す
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin アトミックの値: ${kotlinAgain.load()}")
    // Kotlin アトミックの値: 42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUID の解析、フォーマット、および比較可能性の変更
<primary-label ref="experimental-opt-in"/>

JetBrains チームは、[2.0.20 で標準ライブラリに導入された](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library) UUID のサポートを継続的に改善しています。

以前は、`parse()` 関数は 16 進数とハイフンの形式の UUID のみを受け入れていました。Kotlin 2.1.20 以降、16 進数とハイフンの形式と、プレーンな 16 進数（ハイフンなし）の形式の _両方_ で `parse()` を使用できるようになりました。

また、このリリースでは 16 進数とハイフンの形式での操作に特化した関数も導入されました：

* `parseHexDash()` は、16 進数とハイフンの形式から UUID を解析します。
* `toHexDashString()` は、`Uuid` を 16 進数とハイフンの形式の `String` に変換します（`toString()` の機能をミラーリング）。

これらの関数は、16 進数形式向けに以前導入された [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) および [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) と同様に動作します。解析およびフォーマット機能の明示的な命名により、コードの明確さと UUID に関する全体的な体験が向上するはずです。

Kotlin の UUID が `Comparable` になりました。Kotlin 2.1.20 以降、`Uuid` 型の値を直接比較およびソートできます。これにより、`<` および `>` 演算子の使用や、`Comparable` 型またはそのコレクション専用の標準ライブラリ拡張（`sorted()` など）の使用が可能になり、`Comparable` インターフェースを必要とする関数や API に UUID を渡すこともできるようになります。

標準ライブラリでの UUID サポートはまだ [実験的 (Experimental)](components-stability.md#stability-levels-explained) であることに注意してください。オプトインするには、`@OptIn(ExperimentalUuidApi::class)` アノテーションまたはコンパイラオプション `-opt-in=kotlin.uuid.ExperimentalUuidApi` を使用してください：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() はプレーンな 16 進数形式の UUID を受け入れます
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // 16 進数とハイフンの形式に変換
    val hexDashFormat = uuid.toHexDashString()
 
    // 16 進数とハイフンの形式で UUID を出力
    println(hexDashFormat)

    // UUID を昇順で出力
    println(
        listOf(
            uuid,
            Uuid.parse("780e8400e29b41d4a716446655440005"),
            Uuid.parse("5ab88400e29b41d4a716446655440076")
        ).sorted()
    )
   }
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### 新しい時間追跡機能
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 以降、標準ライブラリで時間の特定の瞬間を表現できる機能が提供されます。この機能は、以前は公式の Kotlin ライブラリである [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) でのみ利用可能でした。

`kotlinx.datetime.Clock` インターフェースが [`kotlin.time.Clock`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-clock/) として、`kotlinx.datetime.Instant` クラスが [`kotlin.time.Instant`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-instant/) として標準ライブラリに導入されました。これらの概念は、標準ライブラリの `time` パッケージと自然に調和します。なぜなら、これらは `kotlinx-datetime` に残されているより複雑なカレンダーやタイムゾーンの機能と比較して、時間の瞬間のみを扱うからです。

`Instant` と `Clock` は、タイムゾーンや日付を考慮せずに正確な時間追跡が必要な場合に便利です。例えば、タイムスタンプ付きのイベントのログ記録、2 つの時点間の期間の測定、システムプロセスの現在の瞬間の取得などに使用できます。

他の言語との相互運用性を提供するため、追加の変換関数が用意されています：

* [`.toKotlinInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-kotlin-instant.html) は、時間値を `kotlin.time.Instant` インスタンスに変換します。
* [`.toJavaInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-java-instant.html) は、`kotlin.time.Instant` 値を `java.time.Instant` 値に変換します。
* [`Instant.toJSDate()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-j-s-date.html) は、`kotlin.time.Instant` 値を JS の `Date` クラスのインスタンスに変換します。この変換は精密ではありません。JS は日付の表現にミリ秒精度を使用しますが、Kotlin はナノ秒分解能を許容します。

標準ライブラリの新しい時間機能はまだ [実験的 (Experimental)](components-stability.md#stability-levels-explained) です。オプトインするには、`@OptIn(ExperimentalTime::class)` アノテーションを使用してください：

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // 現在の瞬間を取得
    val currentInstant = Clock.System.now()
    println("現在時刻: $currentInstant")

    // 2 つの時点の差を求める
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("2023-01-01 からの経過時間: $duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

実装の詳細については、この [KEEP プロポーザル](https://github.com/Kotlin/KEEP/pull/387/files) を参照してください。

## Compose コンパイラ

2.1.20 では、Compose コンパイラが以前のリリースで導入された `@Composable` 関数に対するいくつかの制限を緩和しました。さらに、Compose コンパイラ Gradle プラグインがデフォルトでソース情報を含めるように設定され、Android と同様にすべてのプラットフォームで動作が統一されました。

### オープンな `@Composable` 関数におけるデフォルト値を持つパラメータのサポート

以前のコンパイラでは、コンパイラの出力が不正確で実行時にクラッシュが発生する可能性があるため、オープンな `@Composable` 関数でのデフォルト値を持つパラメータを制限していました。根本的な問題が解決されたため、Kotlin 2.1.20 以降ではデフォルト値を持つパラメータが完全にサポートされます。

Compose コンパイラは、[バージョン 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8) より前はオープン関数でのデフォルト値を許可していたため、サポート状況はプロジェクトの設定に依存します：

* オープンな composable 関数が Kotlin バージョン 2.1.20 以降でコンパイルされる場合、コンパイラはデフォルト値を持つパラメータに対して正しいラッパーを生成します。これには 1.5.8 未満のバイナリと互換性のあるラッパーも含まれ、ダウンストリームのライブラリもこのオープン関数を使用できるようになります。
* オープンな composable 関数が 2.1.20 より古い Kotlin でコンパイルされる場合、Compose は互換モードを使用しますが、これは実行時クラッシュを引き起こす可能性があります。互換モードを使用する場合、コンパイラは潜在的な問題を指摘するために警告を出力します。

### final なオーバーライド関数が再開可能 (restartable) になることを許可

仮想関数（インターフェースを含む `open` および `abstract` のオーバーライド）は、[2.1.0 リリースで強制的に再開不可能 (non-restartable) にされていました](whatsnew21.md#changes-to-open-and-overridden-composable-functions)。この制限が緩和され、final なクラスのメンバである関数、またはそれ自体が `final` である関数については、通常通り再開（またはスキップ）されるようになります。

Kotlin 2.1.20 にアップグレードした後、影響を受ける関数の動作にいくつかの変化が見られる場合があります。以前のバージョンの再開不可能（non-restartable）なロジックを強制するには、関数に `@NonRestartableComposable` アノテーションを適用してください。

### `ComposableSingletons` が公開 API から削除

`ComposableSingletons` は、`@Composable` ラムダを最適化する際に Compose コンパイラによって作成されるクラスです。パラメータをキャプチャしないラムダは一度だけ割り当てられ、クラスのプロパティにキャッシュされるため、実行時の割り当てが節約されます。このクラスは内部（internal）の可視性で生成され、通常はコンパイルユニット（通常はファイル）内のラムダを最適化することのみを目的としています。

しかし、この最適化は `inline` 関数のボディにも適用されており、その結果シングルトンラムダのインスタンスが公開 API に漏洩していました。この問題を解決するため、2.1.20 以降、インライン関数内の `@Composable` ラムダはシングルトンに最適化されなくなります。同時に、Compose コンパイラは、以前のモデルでコンパイルされたモジュールに対するバイナリ互換性をサポートするため、インライン関数用のシングルトンクラスとラムダの生成を継続します。

### ソース情報がデフォルトで含まれるように

Compose コンパイラ Gradle プラグインでは、Android 上で [ソース情報を含める (including source information)](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html) 機能がすでにデフォルトで有効になっています。Kotlin 2.1.20 以降、この機能はすべてのプラットフォームでデフォルトで有効になります。

`freeCompilerArgs` を使用してこのオプションを設定しているかどうかを必ず確認してください。プラグインと併用した場合、オプションが実質的に 2 回設定されることになり、ビルドが失敗する原因となります。

## 破壊的変更と非推奨

* Kotlin Multiplatform を Gradle の今後の変更に合わせるため、`withJava()` 関数を段階的に廃止しています。[Java ソースセットは現在デフォルトで作成されます](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)。[Java test fixtures](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle プラグインを使用している場合は、互換性の問題を避けるために直接 [Kotlin 2.1.21](releases.md#release-history) にアップグレードしてください。
* JetBrains チームは `kotlin-android-extensions` プラグインの非推奨化を進めています。プロジェクトで使用しようとすると、設定エラーが表示されるようになり、プラグインのコードは実行されません。
* レガシーな `kotlin.incremental.classpath.snapshot.enabled` プロパティが Kotlin Gradle プラグインから削除されました。このプロパティは、JVM 上で組み込みの ABI スナップショットにフォールバックする機会を提供していましたが、現在プラグインは不要な再コンパイルを検出して回避するために他の方法を使用しており、このプロパティは不要になりました。

## ドキュメントの更新

Kotlin ドキュメントにいくつかの注目すべき変更が加えられました：

### 刷新および新規ページ

* [Kotlin ロードマップ (Kotlin roadmap)](roadmap.md) – 言語とエコシステムの進化に関する Kotlin の優先事項の更新されたリストを確認してください。
* [Gradle のベストプラクティス (Gradle best practices)](gradle-best-practices.md) ページ – Gradle ビルドの最適化とパフォーマンス向上のための重要なベストプラクティスを学んでください。
* [Compose Multiplatform と Jetpack Compose](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-and-jetpack-compose.html) – 2 つの UI フレームワークの関係の概要です。
* [Kotlin Multiplatform と Flutter](https://kotlinlang.org/docs/multiplatform/kotlin-multiplatform-flutter.html) – 2 つの人気のあるクロスプラットフォームフレームワークの比較を確認してください。
* [C との相互運用性 (Interoperability with C)](native-c-interop.md) – Kotlin の C との相互運用性の詳細を詳しく解説しています。
* [数値 (Numbers)](numbers.md) – 数値を表現するためのさまざまな Kotlin 型について学んでください。

### 新規および更新されたチュートリアル

* [Maven Central へのライブラリのパブリッシュ (Publish your library to Maven Central)](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-libraries.html) – KMP ライブラリアーティファクトを最も人気のある Maven リポジトリにパブリッシュする方法を学んでください。
* [動的ライブラリとしての Kotlin/Native (Kotlin/Native as a dynamic library)](native-dynamic-libraries.md) – 動的な Kotlin ライブラリを作成します。
* [Apple フレームワークとしての Kotlin/Native (Kotlin/Native as an Apple framework)](apple-framework.md) – 独自のフレームワークを作成し、macOS および iOS 上の Swift/Objective-C アプリケーションから Kotlin/Native コードを使用します。

## Kotlin 2.1.20 へのアップデート方法

IntelliJ IDEA 2023.3 および Android Studio Iguana (2023.2.1) Canary 15 以降、Kotlin プラグインは IDE に含まれるバンドルプラグインとして配布されています。つまり、JetBrains Marketplace からプラグインをインストールすることはできなくなりました。

新しい Kotlin バージョンにアップデートするには、ビルドスクリプト内の [Kotlin バージョンを 2.1.20 に変更](releases.md#update-to-a-new-kotlin-version) してください。