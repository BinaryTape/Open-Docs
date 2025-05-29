[//]: # (title: Kotlin 2.1.20 の新機能)

_[リリース日: 2025年3月20日](releases.md#release-details)_

Kotlin 2.1.20 がリリースされました！主なハイライトは以下の通りです。

*   **K2 コンパイラの更新**: [新しい kapt および Lombok プラグインの更新](#kotlin-k2-compiler)
*   **Kotlin Multiplatform**: [Gradle の Application プラグインを置き換える新しい DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
*   **Kotlin/Native**: [Xcode 16.3 のサポートと新しいインライン化最適化](#kotlin-native)
*   **Kotlin/Wasm**: [デフォルトのカスタムフォーマッター、DWARF のサポート、Provider API への移行](#kotlin-wasm)
*   **Gradle サポート**: [Gradle の Isolated Projects とカスタムパブリケーションバリアントとの互換性](#gradle)
*   **標準ライブラリ**: [共通アトミック型、UUID サポートの改善、新しい時間追跡機能](#standard-library)
*   **Compose コンパイラ**: [`@Composable` 関数の制限緩和とその他の更新](#compose-compiler)
*   **ドキュメント**: [Kotlin ドキュメントの重要な改善](#documentation-updates)。

## IDE サポート

2.1.20 をサポートする Kotlin プラグインは、最新の IntelliJ IDEA および Android Studio にバンドルされています。
IDE の Kotlin プラグインを更新する必要はありません。
必要なのは、ビルドスクリプトで Kotlin のバージョンを 2.1.20 に変更することだけです。

詳細については、「[新しいリリースへの更新](releases.md#update-to-a-new-kotlin-version)」を参照してください。

### OSGi サポートを持つプロジェクトでの Kotlin アーティファクトのソースのダウンロード

`kotlin-osgi-bundle` ライブラリのすべての依存関係のソースが、その配布物に含められるようになりました。これにより、
IntelliJ IDEA はこれらのソースをダウンロードして Kotlin シンボルのドキュメントを提供し、デバッグエクスペリエンスを向上させることができます。

## Kotlin K2 コンパイラ

新しい Kotlin K2 コンパイラに対するプラグインのサポートを引き続き改善しています。このリリースでは、新しい kapt および Lombok プラグインが更新されました。

### 新しいデフォルトの kapt プラグイン
<primary-label ref="beta"/>

Kotlin 2.1.20 以降、kapt コンパイラプラグインの K2 実装がすべてのプロジェクトでデフォルトで有効になります。

JetBrains チームは、Kotlin 1.9.20 で K2 コンパイラによる kapt プラグインの新しい実装をローンチしました。
それ以来、私たちは K2 kapt の内部実装をさらに開発し、その動作を K1 バージョンと類似させるとともに、パフォーマンスも大幅に改善しました。

K2 コンパイラで kapt を使用する際に問題が発生した場合は、
一時的に以前のプラグイン実装に戻すことができます。

これを行うには、プロジェクトの `gradle.properties` ファイルに次のオプションを追加します。

```kotlin
kapt.use.k2=false
```

問題は [issue tracker](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) までご報告ください。

### Lombok コンパイラプラグイン: `@SuperBuilder` のサポートと `@Builder` の更新
<primary-label ref="experimental-general"/>

[Kotlin Lombok コンパイラプラグイン](lombok.md) は `@SuperBuilder` アノテーションをサポートするようになり、クラス階層のビルダー作成が容易になりました。以前は、Kotlin で Lombok を使用する開発者は、継承を扱う際に手動でビルダーを定義する必要がありました。`@SuperBuilder` を使用すると、ビルダーがスーパークラスのフィールドを自動的に継承し、オブジェクトを構築する際にそれらを初期化できるようになります。

さらに、この更新にはいくつかの改善とバグ修正が含まれています。

*   `@Builder` アノテーションがコンストラクタで機能するようになり、より柔軟なオブジェクト作成が可能になりました。詳細については、対応する [YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-71547) を参照してください。
*   Kotlin での Lombok のコード生成に関連するいくつかの問題が解決され、全体的な互換性が向上しました。詳細については、[GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) を参照してください。

`@SuperBuilder` アノテーションの詳細については、公式の [Lombok ドキュメント](https://projectlombok.org/features/experimental/SuperBuilder) を参照してください。

## Kotlin Multiplatform: Gradle の Application プラグインを置き換える新しい DSL
<primary-label ref="experimental-opt-in"/>

Gradle 8.7 以降、[Application](https://docs.gradle.org/current/userguide/application_plugin.html) プラグインは
Kotlin Multiplatform Gradle プラグインと互換性がなくなりました。Kotlin 2.1.20 では、同様の機能を実現するための実験的 DSL が導入されています。新しい `executable {}` ブロックは、JVM ターゲットの実行タスクと Gradle [ディストリビューション](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) を構成します。

ビルドスクリプトの `executable {}` ブロックの前に、次の `@OptIn` アノテーションを追加します。

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

例：

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // Configures a JavaExec task named "runJvm" and a Gradle distribution for the "main" compilation in this target
            executable {
                mainClass.set("foo.MainKt")
            }

            // Configures a JavaExec task named "runJvmAnother" and a Gradle distribution for the "main" compilation
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // Set a different class
                mainClass.set("foo.MainAnotherKt")
            }

            // Configures a JavaExec task named "runJvmTest" and a Gradle distribution for the "test" compilation
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // Configures a JavaExec task named "runJvmTestAnother" and a Gradle distribution for the "test" compilation
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

この例では、Gradle の [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)
プラグインが最初の `executable {}` ブロックに適用されます。

問題が発生した場合は、[issue tracker](https://kotl.in/issue) で報告するか、[public Slack channel](https://kotlinlang.slack.com/archives/C19FD9681) でお知らせください。

## Kotlin/Native

### Xcode 16.3 のサポート

Kotlin **2.1.21** 以降、Kotlin/Native コンパイラは Xcode 16.3（Xcode の最新安定バージョン）をサポートします。
Xcode を更新して、Apple オペレーティングシステム向けの Kotlin プロジェクトでの作業を続行してください。

2.1.21 リリースでは、Kotlin Multiplatform プロジェクトでのコンパイル失敗を引き起こした関連する [cinterop のイシュー](https://youtrack.jetbrains.com/issue/KT-75781/) も修正されています。

### 新しいインライン化最適化
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 では、実際のコード生成フェーズの前に、新しいインライン化最適化パスが導入されました。

Kotlin/Native コンパイラにおける新しいインライン化パスは、標準の LLVM インライナーよりも優れたパフォーマンスを発揮し、生成されたコードの実行時パフォーマンスを向上させるはずです。

新しいインライン化パスは現在 [実験的](components-stability.md#stability-levels-explained) です。試すには、次のコンパイラオプションを使用します。

```none
-Xbinary=preCodegenInlineThreshold=40
```

私たちの実験では、しきい値を 40 トークン（コンパイラによって解析されるコード単位）に設定すると、コンパイル最適化のための合理的な妥協点となることが示されています。ベンチマークによると、これにより全体的なパフォーマンスが 9.5% 向上します。もちろん、他の値を試すこともできます。

バイナリサイズやコンパイル時間の増加が発生した場合は、[YouTrack](https://kotl.in/issue) を通じて問題を報告してください。

## Kotlin/Wasm

このリリースでは、Kotlin/Wasm のデバッグとプロパティの使用が改善されています。開発ビルドではカスタムフォーマッターがすぐに機能するようになり、DWARF デバッグはコードインスペクションを容易にします。さらに、Provider API は Kotlin/Wasm および Kotlin/JS におけるプロパティの使用を簡素化します。

### カスタムフォーマッターがデフォルトで有効に

以前は、Kotlin/Wasm コードを扱う際にウェブブラウザでのデバッグを改善するために、カスタムフォーマッターを [手動で設定](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm) する必要がありました。

このリリースでは、開発ビルドでカスタムフォーマッターがデフォルトで有効になっているため、追加の Gradle 設定は不要です。

この機能を使用するには、ブラウザの開発者ツールでカスタムフォーマッターが有効になっていることを確認するだけで十分です。

*   Chrome DevTools では、**設定 | 環境設定 | コンソール** でカスタムフォーマッターのチェックボックスを見つけます。

    ![Chromeでカスタムフォーマッターを有効にする](wasm-custom-formatters-chrome.png){width=400}

*   Firefox DevTools では、**設定 | 詳細設定** でカスタムフォーマッターのチェックボックスを見つけます。

    ![Firefoxでカスタムフォーマッターを有効にする](wasm-custom-formatters-firefox.png){width=400}

この変更は主に Kotlin/Wasm の開発ビルドに影響します。プロダクションビルドに特定の要件がある場合は、それに応じて Gradle 設定を調整する必要があります。そのためには、`wasmJs {}` ブロックに次のコンパイラオプションを追加します。

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

### Kotlin/Wasm コードのデバッグのための DWARF のサポート

Kotlin 2.1.20 では、Kotlin/Wasm で DWARF (debugging with arbitrary record format) のサポートが導入されました。

この変更により、Kotlin/Wasm コンパイラは生成された WebAssembly (Wasm) バイナリに DWARF データを埋め込むことができます。
多くのデバッガや仮想マシンはこのデータを読み取り、コンパイルされたコードに関する洞察を提供できます。

DWARF は主に、スタンドアロンの Wasm 仮想マシン (VM) 内で Kotlin/Wasm アプリケーションをデバッグする場合に役立ちます。この機能を使用するには、Wasm VM とデバッガが DWARF をサポートしている必要があります。

DWARF のサポートにより、Kotlin/Wasm アプリケーションのステップ実行、変数の検査、コードの洞察を得ることができます。この機能を有効にするには、次のコンパイラオプションを使用します。

```bash
-Xwasm-generate-dwarf
```
### Kotlin/Wasm および Kotlin/JS プロパティの Provider API への移行

以前は、Kotlin/Wasm および Kotlin/JS 拡張機能のプロパティは可変 (`var`) であり、ビルドスクリプトで直接割り当てられていました。

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

現在、プロパティは [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) を介して公開されており、値を割り当てるには `.set()` 関数を使用する必要があります。

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API は、値が遅延計算され、タスク依存関係と適切に統合されることを保証し、ビルドパフォーマンスを向上させます。

この変更により、直接的なプロパティ割り当ては、`NodeJsEnvSpec` や `YarnRootEnvSpec` などの `*EnvSpec` クラスを優先して非推奨になりました。

さらに、混乱を避けるためにいくつかのエイリアスタスクが削除されました。

| 非推奨タスク        | 代替                                                     |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` または `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` または `jsBrowserDistribution`         |

ビルドスクリプトで Kotlin/JS または Kotlin/Wasm のみを使用している場合、Gradle が割り当てを自動的に処理するため、特別な操作は必要ありません。

ただし、Kotlin Gradle プラグインに基づいたプラグインを保守しており、そのプラグインが `kotlin-dsl` を適用しない場合は、プロパティの割り当てを `.set()` 関数を使用するように更新する必要があります。

## Gradle

Kotlin 2.1.20 は Gradle 7.6.3 から 8.11 までと完全に互換性があります。最新の Gradle リリースまで使用することもできます。ただし、その場合、非推奨の警告が表示されたり、一部の新しい Gradle 機能が動作しない可能性があることに注意してください。

このバージョンの Kotlin には、Kotlin Gradle プラグインと Gradle の Isolated Projects の互換性、およびカスタム Gradle パブリケーションバリアントのサポートが含まれています。

### Kotlin Gradle プラグインが Gradle の Isolated Projects と互換性を持つように
<primary-label ref="experimental-opt-in"/>

> この機能は現在、Gradle でプレアルファ状態です。JS および Wasm ターゲットは現時点ではサポートされていません。
> Gradle バージョン 8.10 以降でのみ、評価目的で単独で使用してください。
>
{style="warning"}

Kotlin 2.1.0 以降、プロジェクトで [Gradle の Isolated Projects 機能のプレビュー](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform) を試すことができました。

以前は、Isolated Projects 機能を試す前に、Kotlin Gradle プラグインを設定してプロジェクトをこの機能と互換性があるようにする必要がありました。Kotlin 2.1.20 では、この追加の手順は不要になりました。

現在、Isolated Projects 機能を有効にするには、[システムプロパティを設定する](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it) だけで済みます。

Gradle の Isolated Projects 機能は、Kotlin Gradle プラグインでマルチプラットフォームプロジェクトと、JVM または Android ターゲットのみを含むプロジェクトの両方でサポートされています。

特にマルチプラットフォームプロジェクトの場合、アップグレード後に Gradle ビルドで問題が発生した場合は、次の行を追加することで新しい Kotlin Gradle プラグインの動作をオプトアウトできます。

```none
kotlin.kmp.isolated-projects.support=disable
```

ただし、マルチプラットフォームプロジェクトでこの Gradle プロパティを使用する場合、Isolated Projects 機能を使用することはできません。

この機能に関するあなたの経験を [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) でお知らせください。

### カスタム Gradle パブリケーションバリアントの追加のサポート
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 では、カスタム [Gradle パブリケーションバリアント](https://docs.gradle.org/current/userguide/variant_attributes.html) の追加がサポートされます。
この機能は、マルチプラットフォームプロジェクトと JVM をターゲットとするプロジェクトで利用可能です。

> この機能では、既存の Gradle バリアントを変更することはできません。
>
{style="note"}

この機能は [実験的](components-stability.md#stability-levels-explained) です。
オプトインするには、`@OptIn(ExperimentalKotlinGradlePluginApi::class)` アノテーションを使用します。

カスタム Gradle パブリケーションバリアントを追加するには、`adhocSoftwareComponent()` 関数を呼び出します。この関数は [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) のインスタンスを返し、Kotlin DSL で設定できます。

```kotlin
plugins {
    // Only JVM and Multiplatform are supported
    kotlin("jvm")
    // or
    kotlin("multiplatform")
}

kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    publishing {
        // Returns an instance of AdhocSoftwareComponent
        adhocSoftwareComponent()
        // Alternatively, you can configure AdhocSoftwareComponent in the DSL block as follows
        adhocSoftwareComponent {
            // Add your custom variants here using the AdhocSoftwareComponent API
        }
    }
}
```

> バリアントの詳細については、Gradle の [公開のカスタマイズガイド](https://docs.gradle.org/current/userguide/publishing_customization.html) を参照してください。
>
{style="tip"}

## 標準ライブラリ

このリリースでは、標準ライブラリに新しい実験的機能が追加されます。共通のアトミック型、UUID のサポートの改善、新しい時間追跡機能です。

### 共通アトミック型
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 では、標準ライブラリの `kotlin.concurrent.atomics` パッケージに共通のアトミック型を導入し、スレッドセーフな操作のための共有されたプラットフォームに依存しないコードを可能にします。これにより、Kotlin Multiplatform プロジェクトでの開発において、ソースセット間でアトミックに依存するロジックを重複させる必要がなくなり、開発が簡素化されます。

`kotlin.concurrent.atomics` パッケージとそのプロパティは [実験的](components-stability.md#stability-levels-explained) です。
オプトインするには、`@OptIn(ExperimentalAtomicApi::class)` アノテーションを使用するか、コンパイラオプション `-opt-in=kotlin.ExperimentalAtomicApi` を使用します。

以下に、`AtomicInt` を使用して複数のスレッドで処理されたアイテムを安全にカウントする例を示します。

```kotlin
// 必要なライブラリをインポート
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // 処理済みアイテムのアトミックカウンターを初期化
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // 複数のコルーチンによる処理のためにアイテムをチャンクに分割
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("Processing $item in thread ${Thread.currentThread()}")
                    processedItems += 1 // カウンターをアトミックにインクリメント
                }
            }
         }
    }
//sampleEnd
    // 処理済みアイテムの合計数を表示
    println("Total processed items: ${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

Kotlin のアトミック型と Java の [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) アトミック型とのシームレスな相互運用性を提供するために、API は `.asJavaAtomic()` および `.asKotlinAtomic()` 拡張関数を提供します。JVM では、Kotlin のアトミック型と Java のアトミック型はランタイムで同じ型であるため、オーバーヘッドなしで Java のアトミック型を Kotlin のアトミック型に、またはその逆に変換できます。

以下に、Kotlin と Java のアトミック型が連携する例を示します。

```kotlin
// 必要なライブラリをインポート
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // Kotlin AtomicInt を Java の AtomicInteger に変換
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic value: ${javaAtomic.get()}")
    // Java atomic value: 42

    // Java の AtomicInteger を Kotlin の AtomicInt に戻す
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic value: ${kotlinAgain.load()}")
    // Kotlin atomic value: 42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUID の解析、フォーマット、比較可能性の変更
<primary-label ref="experimental-opt-in"/>

JetBrains チームは、[2.0.20 で標準ライブラリに導入された](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library) UUID のサポートを引き続き改善しています。

以前は、`parse()` 関数はハイフン付き16進数形式の UUID のみを受け付けていました。Kotlin 2.1.20 では、`parse()` をハイフン付き16進数形式とプレーンな16進数（ハイフンなし）形式の _両方_ に使用できます。

このリリースでは、ハイフン付き16進数形式での操作に特化した関数も導入されました。

*   `parseHexDash()` はハイフン付き16進数形式から UUID を解析します。
*   `toHexDashString()` は `Uuid` をハイフン付き16進数形式の `String` に変換します（`toString()` の機能と鏡像関係にあります）。

これらの関数は、以前に16進数形式のために導入された [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) および [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) と同様に機能します。解析およびフォーマット機能の明示的な命名は、コードの明確さと UUID を使用する全体的なエクスペリエンスを向上させるはずです。

Kotlin の UUID は `Comparable` になりました。Kotlin 2.1.20 以降、`Uuid` 型の値を直接比較およびソートできます。これにより、`<` および `>` 演算子の使用、`Comparable` 型またはそのコレクション（`sorted()` など）専用の標準ライブラリ拡張機能の使用が可能になり、UUID を `Comparable` インターフェースを必要とする関数や API に渡すこともできます。

標準ライブラリの UUID サポートはまだ [実験的](components-stability.md#stability-levels-explained) であることに注意してください。
オプトインするには、`@OptIn(ExperimentalUuidApi::class)` アノテーションを使用するか、コンパイラオプション `-opt-in=kotlin.uuid.ExperimentalUuidApi` を使用します。

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() はプレーンな16進数形式の UUID を受け付ける
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // ハイフン付き16進数形式に変換
    val hexDashFormat = uuid.toHexDashString()
 
    // ハイフン付き16進数形式で UUID を出力
    println(hexDashFormat)

    // UUID を昇順に出力
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

Kotlin 2.1.20 以降、標準ライブラリは時間の瞬間を表す機能を提供します。この機能は、以前は公式の Kotlin ライブラリである [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) でのみ利用可能でした。

[`kotlinx.datetime.Clock`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) インターフェースは `kotlin.time.Clock` として、[`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/) クラスは `kotlin.time.Instant` として標準ライブラリに導入されます。これらの概念は、より複雑なカレンダーおよびタイムゾーン機能が `kotlinx-datetime` に残されているのに対し、時間の瞬間にのみ関心があるため、標準ライブラリの `time` パッケージと自然に連携します。

`Instant` と `Clock` は、タイムゾーンや日付を考慮せずに正確な時間追跡が必要な場合に役立ちます。たとえば、タイムスタンプ付きイベントをログに記録したり、2つの時点間の期間を測定したり、システムプロセス用の現在の瞬間を取得したりするために使用できます。

他の言語との相互運用性を提供するために、追加の変換関数が利用可能です。

*   `.toKotlinInstant()` は時間値を `kotlin.time.Instant` インスタンスに変換します。
*   `.toJavaInstant()` は `kotlin.time.Instant` 値を `java.time.Instant` 値に変換します。
*   `Instant.toJSDate()` は `kotlin.time.Instant` 値を JS の `Date` クラスのインスタンスに変換します。この変換は厳密ではありません。JS は日付を表すためにミリ秒精度を使用しますが、Kotlin はナノ秒分解能を許容します。

標準ライブラリの新しい時間機能はまだ [実験的](components-stability.md#stability-levels-explained) です。
オプトインするには、`@OptIn(ExperimentalTime::class)` アノテーションを使用します。

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // 現在の時間を取得
    val currentInstant = Clock.System.now()
    println("Current time: $currentInstant")

    // 2つの時点間の差を見つける
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("Time elapsed since 2023-01-01: $duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

実装の詳細については、この [KEEP 提案](https://github.com/Kotlin/KEEP/pull/387/files) を参照してください。

## Compose コンパイラ

2.1.20 では、Compose コンパイラは以前のリリースで導入された `@Composable` 関数に対するいくつかの制限を緩和します。
さらに、Compose コンパイラ Gradle プラグインは、Android との動作を合わせるため、デフォルトでソース情報を含むように設定されます。

### open な `@Composable` 関数におけるデフォルト引数のサポート

コンパイラは以前、誤ったコンパイラ出力により open な `@Composable` 関数でのデフォルト引数を制限していました。これによりランタイムでクラッシュが発生する可能性がありました。根本的な問題は解決され、Kotlin 2.1.20 以降で使用する場合、デフォルト引数は完全にサポートされます。

Compose コンパイラは [バージョン 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8) より前に open 関数でのデフォルト引数を許可していたため、サポートはプロジェクト構成に依存します。

*   open なコンポーザブル関数が Kotlin バージョン 2.1.20 以降でコンパイルされる場合、コンパイラはデフォルト引数に対して正しいラッパーを生成します。これには 1.5.8 以前のバイナリと互換性のあるラッパーが含まれるため、ダウンストリームライブラリもこの open 関数を使用できるようになります。
*   open なコンポーザブル関数が Kotlin 2.1.20 より古いバージョンでコンパイルされる場合、Compose は互換性モードを使用し、ランタイムクラッシュを引き起こす可能性があります。互換性モードを使用する場合、コンパイラは潜在的な問題を強調するために警告を発します。

### final なオーバーライド関数が再起動可能に

仮想関数（`open` および `abstract` のオーバーライド、インターフェースを含む）は、[2.1.0 リリースで再起動不可に強制されました](whatsnew21.md#changes-to-open-and-overridden-composable-functions)。
この制限は、final クラスのメンバーである関数、またはそれ自体が `final` である関数に対して緩和され、通常通り再起動またはスキップされます。

Kotlin 2.1.20 にアップグレードした後、影響を受ける関数で動作の変更が見られるかもしれません。以前のバージョンの再起動不可ロジックを強制するには、関数に `@NonRestartableComposable` アノテーションを適用してください。

### `ComposableSingletons` がパブリック API から削除

`ComposableSingletons` は、Compose コンパイラが `@Composable` ラムダを最適化する際に作成するクラスです。パラメータをキャプチャしないラムダは一度アロケートされ、クラスのプロパティにキャッシュされるため、ランタイム時のアロケーションが節約されます。このクラスは内部可視性で生成され、コンパイルユニット（通常はファイル）内のラムダを最適化することのみを目的としています。

しかし、この最適化は `inline` 関数本体にも適用され、シングルトンラムダインスタンスがパブリック API にリークする結果となりました。この問題を修正するため、2.1.20 以降、`@Composable` ラムダはインライン関数内でシングルトンに最適化されなくなります。同時に、Compose コンパイラは、以前のモデルでコンパイルされたモジュールのバイナリ互換性をサポートするために、シングルトンクラスとラムダをインライン関数に対して引き続き生成します。

### ソース情報がデフォルトで含まれるように

Compose コンパイラ Gradle プラグインは、Android で [ソース情報を含む機能](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html) がデフォルトで有効になっています。Kotlin 2.1.20 以降、この機能はすべてのプラットフォームでデフォルトで有効になります。

`freeCompilerArgs` を使用してこのオプションを設定しているかどうかを確認してください。この方法を使用すると、オプションが実質的に二重に設定されるため、プラグインと併用した場合にビルドが失敗する可能性があります。

## 破壊的変更と非推奨

*   Kotlin Multiplatform を今後の Gradle の変更に合わせるため、`withJava()` 関数は段階的に廃止されます。
    [Java ソースセットはデフォルトで作成されるようになりました](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)。[Java テストフィクスチャ](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle プラグインを使用している場合、互換性の問題を回避するため、直接 [Kotlin 2.1.21](releases.md#release-details) にアップグレードしてください。
*   JetBrains チームは `kotlin-android-extensions` プラグインの非推奨化を進めています。プロジェクトで使用しようとすると、設定エラーが発生し、プラグインコードは実行されなくなります。
*   レガシーな `kotlin.incremental.classpath.snapshot.enabled` プロパティが Kotlin Gradle プラグインから削除されました。
    このプロパティは、以前は JVM 上で組み込みの ABI スナップショットにフォールバックする機会を提供していました。プラグインは現在、不要な再コンパイルを検出し回避するために他の方法を使用しており、このプロパティは廃止されました。

## ドキュメントの更新

Kotlin ドキュメントはいくつかの注目すべき変更を受けました。

### 再構成された新しいページ

*   [Kotlin ロードマップ](roadmap.md) – 言語とエコシステムの進化における Kotlin の優先事項の更新されたリストを参照してください。
*   [Gradle のベストプラクティス](gradle-best-practices.md) ページ – Gradle ビルドを最適化し、パフォーマンスを向上させるための重要なベストプラクティスを学びましょう。
*   [Compose Multiplatform と Jetpack Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-and-jetpack-compose.html)
    – 2つの UI フレームワーク間の関係の概要。
*   [Kotlin Multiplatform と Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html)
    – 2つの人気のあるクロスプラットフォームフレームワークの比較を参照してください。
*   [C との相互運用性](native-c-interop.md) – Kotlin と C の相互運用性の詳細を探ります。
*   [数値型](numbers.md) – 数値を表現するためのさまざまな Kotlin 型について学びましょう。

### 新しいおよび更新されたチュートリアル

*   [ライブラリを Maven Central に公開する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
    – 最も人気のある Maven リポジトリに KMP ライブラリアーティファクトを公開する方法を学びましょう。
*   [動的ライブラリとしての Kotlin/Native](native-dynamic-libraries.md) – 動的 Kotlin ライブラリを作成します。
*   [Apple フレームワークとしての Kotlin/Native](apple-framework.md) – 独自のフレームワークを作成し、macOS および iOS の Swift/Objective-C アプリケーションから Kotlin/Native コードを使用します。

## Kotlin 2.1.20 へのアップデート方法

IntelliJ IDEA 2023.3 および Android Studio Iguana (2023.2.1) Canary 15 以降、Kotlin プラグインは IDE に含まれるバンドルされたプラグインとして配布されます。これは、JetBrains Marketplace からプラグインをインストールできなくなったことを意味します。

新しい Kotlin バージョンにアップデートするには、ビルドスクリプトで [Kotlin のバージョンを 2.1.20 に変更](releases.md#update-to-a-new-kotlin-version) してください。