---
title: "Kotlin 2.1.20 の新機能"
---
_[公開日: 2025年3月20日](releases#release-details)_

Kotlin 2.1.20 リリースです！主なハイライトは次のとおりです。

* **K2 compiler のアップデート**: [新しい kapt と Lombok プラグインへのアップデート](kotlin-k2-compiler)
* **Kotlin Multiplatform**: [Gradle の Application プラグインを置き換える新しい DSL](kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* **Kotlin/Native**: [新しいインライン最適化](kotlin-native-new-inlining-optimization)
* **Kotlin/Wasm**: [デフォルトのカスタムフォーマッタ、DWARF のサポート、および Provider API への移行](kotlin-wasm)
* **Gradle のサポート**: [Gradle の Isolated Projects とカスタム publication variants との互換性](gradle)
* **Standard library**: [共通の atomic types、改善された UUID のサポート、および新しい時間追跡機能](standard-library)
* **Compose compiler**: [`@Composable` 関数に対する緩和された制限とその他のアップデート](compose-compiler)
* **Documentation**: [Kotlin ドキュメントへの注目すべき改善](documentation-updates)。

## IDE support

2.1.20 をサポートする Kotlin プラグインは、最新の IntelliJ IDEA および Android Studio にバンドルされています。
IDE で Kotlin プラグインをアップデートする必要はありません。
必要なのは、ビルドスクリプトで Kotlin のバージョンを 2.1.20 に変更することだけです。

詳細については、[Update to a new release](releases#update-to-a-new-kotlin-version) を参照してください。

### OSGi をサポートするプロジェクトで Kotlin artifacts のソースをダウンロードする

`kotlin-osgi-bundle` ライブラリのすべての依存関係のソースが、そのディストリビューションに含まれるようになりました。これにより、IntelliJ IDEA はこれらのソースをダウンロードして、Kotlin シンボルのドキュメントを提供し、デバッグエクスペリエンスを向上させることができます。

## Kotlin K2 compiler

新しい Kotlin K2 compiler のプラグインサポートを改善し続けています。このリリースでは、新しい kapt と Lombok プラグインがアップデートされています。

### 新しいデフォルトの kapt プラグイン

Kotlin 2.1.20 以降、kapt compiler プラグインの K2 実装がすべてのプロジェクトでデフォルトで有効になります。

JetBrains チームは、Kotlin 1.9.20 で K2 compiler を使用した kapt プラグインの新しい実装を開始しました。
それ以来、K2 kapt の内部実装をさらに開発し、その動作を K1 バージョンと同様にしながら、パフォーマンスも大幅に向上させました。

K2 compiler で kapt を使用する際に問題が発生した場合は、以前のプラグイン実装に一時的に戻すことができます。

これを行うには、プロジェクトの `gradle.properties` ファイルに次のオプションを追加します。

```kotlin
kapt.use.k2=false
```

問題が発生した場合は、[issue tracker](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) に報告してください。

### Lombok compiler plugin: `@SuperBuilder` のサポートと `@Builder` のアップデート

[Kotlin Lombok compiler plugin](lombok) は、`@SuperBuilder` アノテーションをサポートするようになり、クラス階層のビルダーを簡単に作成できます。これまで、Kotlin で Lombok を使用する開発者は、継承を扱うときに手動でビルダーを定義する必要がありました。`@SuperBuilder` を使用すると、ビルダーはスーパークラスフィールドを自動的に継承し、オブジェクトの構築時にそれらを初期化できます。

さらに、このアップデートにはいくつかの改善とバグ修正が含まれています。

* `@Builder` アノテーションがコンストラクターで動作するようになり、より柔軟なオブジェクトの作成が可能になりました。詳細については、対応する [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-71547) を参照してください。
* Kotlin での Lombok のコード生成に関連するいくつかの問題が解決され、全体的な互換性が向上しました。詳細については、[GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) を参照してください。

`@SuperBuilder` アノテーションの詳細については、公式の [Lombok documentation](https://projectlombok.org/features/experimental/SuperBuilder) を参照してください。

## Kotlin Multiplatform: Gradle の Application プラグインを置き換える新しい DSL

Gradle 8.7 以降、[Application](https://docs.gradle.org/current/userguide/application_plugin.html) プラグインは、Kotlin Multiplatform Gradle プラグインと互換性がなくなりました。Kotlin 2.1.20 では、同様の機能を実現するための Experimental DSL が導入されています。新しい `executable {}` ブロックは、JVM ターゲットの実行タスクと Gradle [distributions](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) を構成します。

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

この例では、Gradle の [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) プラグインが最初の `executable {}` ブロックに適用されます。

問題が発生した場合は、[issue tracker](https://kotl.in/issue) に報告するか、[public Slack channel](https://kotlinlang.slack.com/archives/C19FD9681) でお知らせください。

## Kotlin/Native: 新しいインライン最適化

Kotlin 2.1.20 では、実際のコード生成フェーズの前に実行される新しいインライン最適化パスが導入されています。

Kotlin/Native compiler の新しいインラインパスは、標準の LLVM インライナーよりもパフォーマンスが向上し、生成されたコードのランタイムパフォーマンスが向上するはずです。

新しいインラインパスは現在 [Experimental](components-stability#stability-levels-explained) です。試してみるには、次の compiler オプションを使用します。

```none
-Xbinary=preCodegenInlineThreshold=40
```

私たちの実験では、しきい値を 40 トークン (コンパイラによって解析されるコードユニット) に設定すると、コンパイルの最適化に妥当な妥協点が得られることがわかっています。私たちのベンチマークによると、これにより全体的なパフォーマンスが 9.5% 向上します。もちろん、他の値を試すこともできます。

バイナリサイズやコンパイル時間が増加した場合は、[YouTrack](https://kotl.in/issue) で問題を報告してください。

## Kotlin/Wasm

このリリースでは、Kotlin/Wasm のデバッグとプロパティの使用が改善されています。カスタムフォーマッタは、開発ビルドですぐに使用できるようになり、DWARF デバッグによりコードインスペクションが容易になります。さらに、Provider API は、Kotlin/Wasm および Kotlin/JS でのプロパティの使用を簡素化します。

### カスタムフォーマッタがデフォルトで有効

以前は、Kotlin/Wasm コードを使用する際に、Web ブラウザでのデバッグを改善するために、カスタムフォーマッタを [手動で構成する](whatsnew21#improved-debugging-experience-for-kotlin-wasm) 必要がありました。

このリリースでは、カスタムフォーマッタは開発ビルドでデフォルトで有効になっているため、追加の Gradle 構成は必要ありません。

この機能を使用するには、カスタムフォーマッタがブラウザの開発者ツールで有効になっていることを確認するだけです。

* Chrome DevTools で、**Settings | Preferences | Console** でカスタムフォーマッタのチェックボックスを見つけます。

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Enable custom formatters in Chrome" width="400" style={{verticalAlign: 'middle'}}/>

* Firefox DevTools で、**Settings | Advanced settings** でカスタムフォーマッタのチェックボックスを見つけます。

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Enable custom formatters in Firefox" width="400" style={{verticalAlign: 'middle'}}/>

この変更は主に Kotlin/Wasm 開発ビルドに影響します。本番ビルドに特定の要件がある場合は、それに応じて Gradle 構成を調整する必要があります。これを行うには、次の compiler オプションを `wasmJs {}` ブロックに追加します。

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

### Kotlin/Wasm コードをデバッグするための DWARF のサポート

Kotlin 2.1.20 では、Kotlin/Wasm で DWARF (debugging with arbitrary record format) のサポートが導入されています。

この変更により、Kotlin/Wasm compiler は DWARF データを生成された WebAssembly (Wasm) バイナリに埋め込むことができます。
多くのデバッガと仮想マシンは、このデータを読み取って、コンパイルされたコードに関する洞察を提供できます。

DWARF は、主にスタンドアロンの Wasm 仮想マシン (VM) 内で Kotlin/Wasm アプリケーションをデバッグする場合に役立ちます。この機能を使用するには、Wasm VM とデバッガが DWARF をサポートしている必要があります。

DWARF のサポートにより、Kotlin/Wasm アプリケーションをステップ実行したり、変数を調べたり、コードに関する洞察を得たりできます。この機能を有効にするには、次の compiler オプションを使用します。

```bash
-Xwasm-generate-dwarf
```
### Kotlin/Wasm および Kotlin/JS プロパティの Provider API への移行

以前は、Kotlin/Wasm および Kotlin/JS 拡張機能のプロパティは可変 (`var`) であり、ビルドスクリプトで直接割り当てられていました。

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

現在、プロパティは [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) を通じて公開されており、値の割り当てには `.set()` 関数を使用する必要があります。

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API は、値が遅延計算され、タスク依存関係と適切に統合されることを保証し、ビルドのパフォーマンスを向上させます。

この変更により、`NodeJsEnvSpec` や `YarnRootEnvSpec` などの `*EnvSpec` クラスを優先して、直接プロパティの割り当てが非推奨になります。

さらに、混乱を避けるために、いくつかエイリアスタスクが削除されました。

| 非推奨のタスク        | 代替手段                                                     |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` or `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` or `jsBrowserDistribution`         |

ビルドスクリプトで Kotlin/JS または Kotlin/Wasm のみを使用する場合は、Gradle が割り当てを自動的に処理するため、操作は必要ありません。

ただし、Kotlin Gradle Plugin に基づくプラグインを管理していて、プラグインが `kotlin-dsl` を適用していない場合は、`.set()` 関数を使用するようにプロパティの割り当てを更新する必要があります。

## Gradle

Kotlin 2.1.20 は、Gradle 7.6.3 から 8.11 まで完全に互換性があります。最新の Gradle リリースまでの Gradle バージョンを使用することもできます。ただし、そうすると非推奨の警告が表示される可能性があり、一部の新しい Gradle 機能が動作しない可能性があることに注意してください。

このバージョンの Kotlin には、Kotlin Gradle プラグインと Gradle の Isolated Projects との互換性、およびカスタム Gradle publication variants のサポートが含まれています。

### Gradle の Isolated Projects と互換性のある Kotlin Gradle プラグイン

:::note
この機能は現在、Gradle では pre-Alpha 状態です。JS および Wasm ターゲットは現在サポートされていません。Gradle バージョン 8.10 以降でのみ、評価目的でのみ使用してください。

Kotlin 2.1.0 以降、プロジェクトで [Gradle の Isolated Projects 機能のプレビュー](whatsnew21#preview-gradle-s-isolated-projects-in-kotlin-multiplatform) を利用できるようになりました。

以前は、Isolated Projects 機能を使用する前に、プロジェクトを Isolated Projects 機能と互換性を持たせるために Kotlin Gradle プラグインを構成する必要がありました。Kotlin 2.1.20 では、この追加の手順は不要になりました。

現在、Isolated Projects 機能を有効にするには、[システムプロパティを設定する](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it) だけで済みます。

Gradle の Isolated Projects 機能は、マルチプラットフォームプロジェクトと JVM または Android ターゲットのみを含むプロジェクトの両方の Kotlin Gradle プラグインでサポートされています。

特にマルチプラットフォームプロジェクトの場合、アップグレード後に Gradle ビルドに問題が発生した場合は、次を追加することで新しい Kotlin Gradle プラグインの動作をオプトアウトできます。

```none
kotlin.kmp.isolated-projects.support=disable
```

ただし、マルチプラットフォームプロジェクトでこの Gradle プロパティを使用する場合、Isolated Projects 機能は使用できません。

この機能の使用感について、[YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) でお知らせください。

### カスタム Gradle publication variants の追加のサポート

Kotlin 2.1.20 では、カスタム [Gradle publication variants](https://docs.gradle.org/current/userguide/variant_attributes.html) の追加のサポートが導入されています。
この機能は、マルチプラットフォームプロジェクトと JVM をターゲットとするプロジェクトで利用できます。

この機能を使用して既存の Gradle variants を変更することはできません。

:::

この機能は [Experimental](components-stability#stability-levels-explained) です。
オプトインするには、`@OptIn(ExperimentalKotlinGradlePluginApi::class)` アノテーションを使用します。

カスタム Gradle publication variant を追加するには、`adhocSoftwareComponent()` 関数を呼び出します。この関数は、Kotlin DSL で構成できる [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) のインスタンスを返します。

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

:::tip
variants の詳細については、Gradle の [Customizing publishing guide](https://docs.gradle.org/current/userguide/publishing_customization.html) を参照してください。

:::

## Standard library

このリリースでは、共通の atomic types、改善された UUID のサポート、および新しい時間追跡機能という、新しい Experimental 機能が standard library に追加されています。

### 共通の atomic types

Kotlin 2.1.20 では、standard library の `kotlin.concurrent.atomics` パッケージに共通の atomic types を導入し、スレッドセーフな操作のための共有のプラットフォームに依存しないコードを有効にしています。これにより、ソースセット全体で atomic に依存するロジックを複製する必要がなくなるため、Kotlin Multiplatform プロジェクトの開発が簡素化されます。

`kotlin.concurrent.atomics` パッケージとそのプロパティは [Experimental](components-stability#stability-levels-explained) です。
オプトインするには、`@OptIn(ExperimentalAtomicApi::class)` アノテーションまたは compiler オプション `-opt-in=kotlin.ExperimentalAtomicApi` を使用します。

`AtomicInt` を使用して、複数のスレッドで処理されたアイテムを安全にカウントする方法を示す例を次に示します。

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // Initializes the atomic counter for processed items
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // Splits the items into chunks for processing by multiple coroutines
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("Processing $item in thread ${Thread.currentThread()}")
                    processedItems += 1 // Increment counter atomically
                }
            }
         }
    }

    // Prints the total number of processed items
    println("Total processed items: ${processedItems.load()}")
}
```

Kotlin の atomic types と Java の [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) atomic types との間でシームレスな相互運用性を実現するために、API は `.asJavaAtomic()` および `.asKotlinAtomic()` 拡張機能を提供します。JVM では、Kotlin atomics と Java atomics はランタイムで同じタイプであるため、オーバーヘッドなしで Java atomics を Kotlin atomics に、またはその逆に変換できます。

Kotlin と Java の atomic types が連携して動作する方法を示す例を次に示します。

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // Converts Kotlin AtomicInt to Java's AtomicInteger
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic value: ${javaAtomic.get()}")
    // Java atomic value: 42

    // Converts Java's AtomicInteger back to Kotlin's AtomicInt
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic value: ${kotlinAgain.load()}")
    // Kotlin atomic value: 42
}

```

### UUID の解析、フォーマット、および比較可能性の変更

JetBrains チームは、[2.0.20 で standard library に導入された](whatsnew2020#support-for-uuids-in-the-common-kotlin-standard-library) UUID のサポートを改善し続けています。

以前は、`parse()` 関数は hex-and-dash 形式の UUID のみを受け入れていました。Kotlin 2.1.20 では、hex-and-dash 形式とプレーンな 16 進数形式 (ダッシュなし) _の両方_ に `parse()` を使用できます。

このリリースでは、hex-and-dash 形式での操作に固有の関数も導入されています。

* `parseHexDash()` は、hex-and-dash 形式から UUID を解析します。
* `toHexDashString()` は、`Uuid` を hex-and-dash 形式の `String` に変換します (`toString()` の機能を反映)。

これらの関数は、以前に 16 進数形式で導入された [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) および [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) と同様に動作します。解析およびフォーマット機能の明示的な命名は、コードの明瞭さと UUID に関する全体的なエクスペリエンスを向上させるはずです。

Kotlin の UUID は `Comparable` になりました。Kotlin 2.1.20 以降、`Uuid` 型の値を直接比較およびソートできます。これにより、`<` および `>` 演算子と、`Comparable` 型またはそのコレクション (例: `sorted()`) 専用に利用できる standard library 拡張機能を使用できるようになり、`Comparable` インターフェイスを必要とする任意の関数または API に UUID を渡すこともできます。

standard library の UUID のサポートは、引き続き [Experimental](components-stability#stability-levels-explained) であることに注意してください。
オプトインするには、`@OptIn(ExperimentalUuidApi::class)` アノテーションまたは compiler オプション `-opt-in=kotlin.uuid.ExperimentalUuidApi` を使用します。

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() accepts a UUID in a plain hexadecimal format
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // Converts it to the hex-and-dash format
    val hexDashFormat = uuid.toHexDashString()
 
    // Outputs the UUID in the hex-and-dash format
    println(hexDashFormat)

    // Outputs UUIDs in ascending order
    println(
        listOf(
            uuid,
            Uuid.parse("780e8400e29b41d4a716446655440005"),
            Uuid.parse("5ab88400e29b41d4a716446655440076")
        ).sorted()
    )
   }

```

### 新しい時間追跡機能

Kotlin 2.1.20 以降、standard library は時間の瞬間を表す機能を提供します。この機能は、以前は公式の Kotlin library である [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) でのみ利用可能でした。

[`kotlinx.datetime.Clock`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) インターフェイスが `kotlin.time.Clock` として standard library に導入され、[`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/) クラスが `kotlin.time.Instant` として導入されました。これらの概念は、`kotlinx-datetime` に残っているより複雑なカレンダーおよびタイムゾーン機能と比較して、時間の瞬間にのみ関係があるため、standard library の `time` パッケージと自然に一致します。

`Instant` と `Clock` は、タイムゾーンや日付を考慮せずに正確な時間追跡が必要な場合に役立ちます。たとえば、タイムスタンプ付きのイベントをログに記録したり、2 つの時点間の期間を測定したり、システムプロセスの現在の瞬間を取得したりするために使用できます。

他の言語との相互運用性を提供するために、追加のコンバーター関数が利用可能です。

* `.toKotlinInstant()` は、時間の値を `kotlin.time.Instant` インスタンスに変換します。
* `.toJavaInstant()` は、`kotlin.time.Instant` の値を `java.time.Instant` の値に変換します。
* `Instant.toJSDate()` は、`kotlin.time.Instant` の値を JS `Date` クラスのインスタンスに変換します。この変換は正確ではありません。JS は日付を表すためにミリ秒精度を使用しますが、Kotlin はナノ秒解像度を許可します。

standard library の新しい時間機能は、引き続き [Experimental](components-stability#stability-levels-explained) です。
オプトインするには、`@OptIn(ExperimentalTime::class)` アノテーションを使用します。

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // Get the current moment in time
    val currentInstant = Clock.System.now()
    println("Current time: $currentInstant")

    // Find the difference between two moments in time
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("Time elapsed since 2023-01-01: $duration")
}
```

実装の詳細については、この [KEEP proposal](https://github.com/Kotlin/KEEP/pull/387/files) を参照してください。

## Compose compiler

2.1.20 では、Compose compiler は以前のリリースで導入された `@Composable` 関数の一部の制限を緩和します。
さらに、Compose compiler Gradle プラグインは、Android 上の動作に合わせて、ソース情報をデフォルトで含めるように設定されています。

### open `@Composable` 関数のデフォルト引数のサポート

コンパイラは以前、実行時にクラッシュが発生する可能性のある不適切なコンパイラの出力により、open `@Composable` 関数のデフォルト引数を制限していました。根本的な問題は解決され、Kotlin 2.1.20 以降で使用すると、デフォルト引数が完全にサポートされます。

Compose compiler は、[バージョン 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8) より前に open 関数でデフォルト引数を許可していたため、サポートはプロジェクト構成によって異なります。

* open composable 関数が Kotlin バージョン 2.1.20 以降でコンパイルされている場合、コンパイラはデフォルト引数に対して正しいラッパーを生成します。これには、1.5.8 より前のバイナリと互換性のあるラッパーが含まれており、ダウンストリームライブラリもこの open 関数を使用できるようになります。
* open composable 関数が Kotlin 2.1.20 より前のバージョンでコンパイルされている場合、Compose は互換モードを使用します。これにより、実行時にクラッシュが発生する可能性があります。互換モードを使用すると、コンパイラは潜在的な問題を強調するために警告を発行します。

### 最終的なオーバーライド関数は再起動可能にすることができます

仮想関数 (`open` および `abstract` のオーバーライド。インターフェイスを含む) は、[2.1.0 リリースで再起動できないように強制されました](whatsnew21#changes-to-open-and-overridden-composable-functions)。
この制限は、最終クラスのメンバーである関数、またはそれ自体が `final` である関数に対して緩和されました。これらの関数は、通常どおりに再起動またはスキップされます。

Kotlin 2.1.20 にアップグレードすると、影響を受ける関数で一部の動作の変更が見られる場合があります。以前のバージョンから再起動できないロジックを強制するには、`@NonRestartableComposable` アノテーションを関数に適用します。

### `ComposableSingletons` がパブリック API から削除されました

`ComposableSingletons` は、`@Composable` ラムダを最適化するときに Compose compiler によって作成されるクラスです。パラメータをキャプチャしないラムダは一度だけ割り当てられ、クラスのプロパティにキャッシュされ、実行時の割り当てを節約します。クラスは内部の可視性で生成され、コンパイルユニット (通常はファイル) 内のラムダを最適化することのみを目的としています。

ただし、この最適化は `inline` 関数の本体にも適用されました。これにより、シングルトンラムダインスタンスがパブリック API にリークしました。この問題を修正するために、2.1.20 以降、`@Composable` ラムダはインライン関数内のシングルトンに最適化されなくなりました。同時に、Compose compiler は、以前のモデルでコンパイルされたモジュールのバイナリ互換性をサポートするために、インライン関数のシングルトンクラスとラムダを引き続き生成します。

### ソース情報がデフォルトで含まれるようになりました

Compose compiler Gradle プラグインは、Android で [ソース情報を含める](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html) 機能をすでにデフォルトで有効にしています。Kotlin 2.1.20 以降、この機能はすべてのプラットフォームでデフォルトで有効になります。

`freeCompilerArgs` を使用してこのオプションを設定したかどうかを確認してください。このメソッドをプラグインと一緒に使用すると、オプションが事実上 2 回設定されるため、ビルドが失敗する可能性があります。

## 破壊的な変更と非推奨

* Kotlin Multiplatform を Gradle の今後の変更に合わせるために、`withJava()` 関数を段階的に廃止しています。
  [Java ソースセットはデフォルトで作成されるようになりました](multiplatform-compatibility-guide#java-source-sets-created-by-default)。

* JetBrains チームは、`kotlin-android-extensions` プラグインの非推奨化を進めています。プロジェクトで使用しようとすると、構成エラーが発生し、プラグインコードは実行されません。

* レガシー `kotlin.incremental.classpath.snapshot.enabled` プロパティが Kotlin Gradle プラグインから削除されました。
  このプロパティは、JVM での組み込みの ABI スナップショットへのフォールバックの機会を提供するために使用されていました。プラグインは、不要な再コンパイルを検出して回避するために他のメソッドを使用するようになり、プロパティは不要になりました。

## ドキュメントのアップデート

Kotlin ドキュメントには、注目すべき変更がいくつか加えられました。

### リニューアルされたページと新しいページ

* [Kotlin roadmap](roadmap) – 言語とエコシステムの進化に関する Kotlin の優先順位の最新リストをご覧ください。
* [Gradle best practices](gradle-best-practices) ページ – Gradle ビルドを最適化し、パフォーマンスを向上させるための不可欠なベストプラクティスを学びます。
* [Compose Multiplatform and Jetpack Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-and-jetpack-compose.html) – 2 つの UI フレームワークの関係の概要。
* [Kotlin Multiplatform and Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) – 2 つの一般的なクロスプラットフォームフレームワークの比較をご覧ください。
* [Interoperability with C](native-c-interop) – Kotlin と C の相互運用性の詳細を調べてください。
* [Numbers](numbers) – 数値を表すさまざまな Kotlin タイプについて学びます。

### 新しいチュートリアルと更新されたチュートリアル

* [Publish your library to Maven Central](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html) – KMP ライブラリ artifacts を最も一般的な Maven リポジトリに公開する方法を学びます。
* [Kotlin/Native as a dynamic library](native-dynamic-libraries) – 動的な Kotlin ライブラリを作成します。
* [Kotlin/Native as an Apple framework](apple-framework) – 独自のフレームワークを作成し、macOS および iOS 上の Swift/Objective-C アプリケーションから Kotlin/Native コードを使用します。

## Kotlin 2.1.20 へのアップデート方法

IntelliJ IDEA 2023.3 および Android Studio Iguana (2023.2.1) Canary 15 以降、Kotlin プラグインは IDE に含まれているバンドルされたプラグインとして配布されます。つまり、JetBrains Marketplace からプラグインをインストールできなくなりました。

新しい Kotlin バージョンにアップデートするには、ビルドスクリプトで [Kotlin のバージョンを変更](releases#update-to-a-new-kotlin-version) して 2.1.20 にします。