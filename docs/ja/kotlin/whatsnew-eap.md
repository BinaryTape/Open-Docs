---
title: "Kotlin 2.1.20-RC3の新機能"
---
_[公開日: 2025年3月14日](eap#build-details)_

:::note
このドキュメントでは、Early Access Preview (EAP) リリースのすべての機能について網羅しているわけではありませんが、主要な改善点を紹介しています。

変更点の完全なリストは、[GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20-RC3) を参照してください。

:::

Kotlin 2.1.20-RC3 リリースが公開されました。
この EAP リリースの詳細を以下に示します。

* [](#kotlin-k2-compiler-new-default-kapt-plugin)
* [](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* [](#kotlin-native-new-inlining-optimization)
* [Kotlin/Wasm: デフォルトのカスタムフォーマッタと Provider API への移行](#kotlin-wasm)
* [Gradle: Gradle 8.11 のサポート、Isolated Projects との互換性、およびカスタム publication variants](#support-for-adding-custom-gradle-publication-variants)
* [標準ライブラリ: 共通の atomic 型、UUID サポートの改善、および新しい時間追跡機能](#standard-library)
* [](#compose-compiler-source-information-included-by-default)

## IDE のサポート

2.1.20-RC3 をサポートする Kotlin プラグインは、最新の IntelliJ IDEA および Android Studio にバンドルされています。
IDE で Kotlin プラグインを更新する必要はありません。
必要なのは、ビルドスクリプトで Kotlin のバージョンを 2.1.20-RC3 に [変更](configure-build-for-eap) することだけです。

詳細については、[新しいリリースへの更新](releases#update-to-a-new-kotlin-version) を参照してください。

## Kotlin K2 compiler: 新しいデフォルト kapt プラグイン

Kotlin 2.1.20-RC3 以降、kapt コンパイラプラグインの K2 実装がすべてのプロジェクトでデフォルトで有効になります。

JetBrains チームは、Kotlin 1.9.20 で K2 コンパイラを使用した kapt プラグインの新しい実装を開始しました。
それ以来、K2 kapt の内部実装をさらに開発し、その動作を K1 バージョンと同様にしながら、パフォーマンスを大幅に向上させました。

K2 コンパイラで kapt を使用する際に問題が発生した場合は、以前のプラグイン実装に一時的に戻すことができます。

これを行うには、プロジェクトの `gradle.properties` ファイルに次のオプションを追加します。

```kotlin
kapt.use.k2=false
```

問題が発生した場合は、[issue tracker](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) に報告してください。

## Kotlin Multiplatform: Gradle の Application プラグインを置き換える新しい DSL

Gradle 8.7 以降、[Application](https://docs.gradle.org/current/userguide/application_plugin.html) プラグインは、Kotlin Multiplatform Gradle プラグインと互換性がなくなりました。Kotlin 2.1.20-RC3 では、同様の機能を実現するための Experimental DSL が導入されています。新しい `executable {}` ブロックは、JVM ターゲットの実行タスクと Gradle [distributions](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) を構成します。

DSL を使用する前に、次のコードをビルドスクリプトに追加します。

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

次に、新しい `executable {}` ブロックを追加します。例:

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

Kotlin 2.1.20-RC3 では、実際のコード生成フェーズの前に実行される新しいインライン最適化パスが導入されています。

Kotlin/Native コンパイラの新しいインラインパスは、標準の LLVM インライナーよりも優れたパフォーマンスを発揮し、生成されたコードのランタイムパフォーマンスを向上させるはずです。

新しいインラインパスは現在 [Experimental](components-stability#stability-levels-explained) です。試してみるには、次のコンパイラオプションを使用します。

```none
-Xbinary=preCodegenInlineThreshold=40
```

私たちの実験では、40 は最適化の適切な妥協点となるしきい値であることが示されています。私たちのベンチマークによると、これにより全体的なパフォーマンスが 9.5% 向上します。もちろん、他の値も試すことができます。

バイナリサイズまたはコンパイル時間が増加した場合は、[YouTrack](https://kotl.in/issue) で問題を報告してください。

## Kotlin/Wasm

### デフォルトで有効になっているカスタムフォーマッタ

以前は、Kotlin/Wasm コードを操作する際に Web ブラウザでのデバッグを改善するために、カスタムフォーマッタを [手動で構成](whatsnew21#improved-debugging-experience-for-kotlin-wasm) する必要がありました。

このリリースでは、開発ビルドでカスタムフォーマッタがデフォルトで有効になっているため、追加の Gradle 構成は必要ありません。

この機能を使用するには、ブラウザの開発者ツールでカスタムフォーマッタが有効になっていることを確認するだけです。

* Chrome DevTools では、**Settings | Preferences | Console** 経由で利用できます。

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Chrome でカスタムフォーマッタを有効にする" width="400" style={{verticalAlign: 'middle'}}/>

* Firefox DevTools では、**Settings | Advanced settings** 経由で利用できます。

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Firefox でカスタムフォーマッタを有効にする" width="400" style={{verticalAlign: 'middle'}}/>

この変更は主に開発ビルドに影響します。本番ビルドに特定の要件がある場合は、それに応じて Gradle 構成を調整する必要があります。次のコンパイラオプションを `wasmJs {}` ブロックに追加します。

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

### Kotlin/Wasm および Kotlin/JS プロパティの Provider API への移行

以前は、Kotlin/Wasm および Kotlin/JS 拡張機能のプロパティはミュータブル (`var`) であり、ビルドスクリプトで直接割り当てられていました。

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

現在、プロパティは [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) を介して公開されており、値を割り当てるには `.set()` 関数を使用する必要があります。

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API は、値が遅延的に計算され、タスクの依存関係と適切に統合され、ビルドのパフォーマンスが向上することを保証します。

この変更により、`NodeJsEnvSpec` や `YarnRootEnvSpec` などの `*EnvSpec` クラスを優先して、直接的なプロパティ割り当ては非推奨になりました。

さらに、混乱を避けるために、いくつかエイリアスタスクが削除されました。

| 非推奨のタスク        | 代替                                                              |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` or `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` or `jsBrowserDistribution`         |

ビルドスクリプトで Kotlin/JS または Kotlin/Wasm のみを使用する場合、Gradle が割り当てを自動的に処理するため、アクションは必要ありません。

ただし、Kotlin Gradle Plugin に基づいてプラグインを保守していて、プラグインが `kotlin-dsl` を適用しない場合は、`.set()` 関数を使用するようにプロパティの割り当てを更新する必要があります。

## Gradle

### バージョン 8.11 のサポート
Kotlin %kotlinEapVersion% は、最新の安定版 Gradle バージョン 8.11 と互換性があり、その機能をサポートするようになりました。

### Kotlin Gradle plugin は Gradle の Isolated Projects と互換性があります

:::note
この機能は現在、Gradle ではプレアルファ状態です。
Gradle バージョン 8.10 以降でのみ使用し、評価目的でのみ使用してください。

Kotlin 2.1.0 以降、プロジェクトで [Gradle の Isolated Projects 機能をプレビュー](whatsnew21#preview-gradle-s-isolated-projects-in-kotlin-multiplatform) できるようになりました。

以前は、Kotlin Gradle plugin を構成して、Isolated Projects 機能と互換性のあるプロジェクトにする必要がありました。Kotlin %kotlinEapVersion% では、この追加の手順は不要になりました。

Isolated Projects 機能を有効にするには、[システムプロパティを設定](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it) するだけです。

Gradle の Isolated Projects 機能は、マルチプラットフォームプロジェクトと、JVM または Android ターゲットのみを含むプロジェクトの両方の Kotlin Gradle プラグインでサポートされています。

特にマルチプラットフォームプロジェクトの場合、アップグレード後に Gradle ビルドで問題が発生した場合は、次を設定して、新しい Kotlin Gradle プラグインの動作をオプトアウトできます。

```none
kotlin.kmp.isolated-projects.support=disable
```

ただし、マルチプラットフォームプロジェクトでこの Gradle プロパティを使用する場合、Isolated Projects 機能を使用することはできません。

この機能に関するフィードバックは、[YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) でお寄せください。

### カスタム Gradle publication variants の追加のサポート

Kotlin %kotlinEapVersion% では、カスタム [Gradle publication variants](https://docs.gradle.org/current/userguide/variant_attributes.html) の追加がサポートされるようになりました。
この機能は、マルチプラットフォームプロジェクトと JVM をターゲットとするプロジェクトで利用できます。

この機能を使用して既存の Gradle variants を変更することはできません。

:::

この機能は [Experimental](components-stability#stability-levels-explained) です。
オプトインするには、`@OptIn(ExperimentalKotlinGradlePluginApi::class)` アノテーションを使用します。

カスタム Gradle publication variant を追加するには、[`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) のインスタンスを返す `adhocSoftwareComponent()` 関数を呼び出します。
Kotlin DSL で構成できます。

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

## 標準ライブラリ

### 共通の atomic 型

Kotlin %kotlinEapVersion% では、標準ライブラリの `kotlin.concurrent.atomics` パッケージに共通の atomic 型が導入され、スレッドセーフな操作のための共有されたプラットフォームに依存しないコードが有効になります。これにより、ソースセット全体で atomic に依存するロジックを複製する必要がなくなり、Kotlin Multiplatform プロジェクトの開発が簡素化されます。

`kotlin.concurrent.atomics` パッケージとそのプロパティは [Experimental](components-stability#stability-levels-explained) です。
オプトインするには、`@OptIn(ExperimentalAtomicApi::class)` アノテーションまたはコンパイラオプション `-opt-in=kotlin.ExperimentalAtomicApi` を使用します。

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

Kotlin の atomic 型と Java の [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) atomic 型間のシームレスな相互運用性を実現するために、API は `.asJavaAtomic()` および `.asKotlinAtomic()` 拡張機能を提供します。JVM では、Kotlin atomics と Java atomics はランタイムで同じ型であるため、オーバーヘッドなしで Java atomics を Kotlin atomics に、またはその逆に変換できます。

Kotlin と Java の atomic 型が連携する方法を示す例を次に示します。

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

JetBrains チームは、[2.0.20 で標準ライブラリに導入された](whatsnew2020#support-for-uuids-in-the-common-kotlin-standard-library) UUID のサポートを改善し続けています。

以前は、`parse()` 関数は、16 進数とダッシュの形式の UUID のみを受け入れていました。Kotlin %kotlinEapVersion% では、`parse()` を 16 進数とダッシュの形式_と_プレーンな 16 進数 (ダッシュなし) 形式の両方に使用できます。

また、このリリースでは、16 進数とダッシュの形式での操作に固有の関数も導入しました。

* `parseHexDash()` は、16 進数とダッシュの形式で UUID を解析します。
* `toHexDashString()` は、`Uuid` を 16 進数とダッシュの形式で `String` に変換します (`toString()` の機能を反映)。

これらの関数は、以前に 16 進数形式で導入された [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) および [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) と同様に機能します。解析およびフォーマット機能の明示的な命名により、コードの明確さと UUID の全体的なエクスペリエンスが向上するはずです。

Kotlin の UUID は `Comparable` になりました。Kotlin %kotlinEapVersion% 以降、`Uuid` 型の値を直接比較および並べ替えることができます。これにより、`<` および `>` 演算子、`Comparable` 型またはそのコレクション (例: `sorted()`) でのみ利用可能な標準ライブラリ拡張機能の使用が可能になり、`Comparable` インターフェイスを必要とする関数または API に UUID を渡すことができます。

標準ライブラリでの UUID のサポートは、まだ [Experimental](components-stability#stability-levels-explained) であることに注意してください。
オプトインするには、`@OptIn(ExperimentalUuidApi::class)` アノテーションまたはコンパイラオプション `-opt-in=kotlin.uuid.ExperimentalUuidApi` を使用します。

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

Kotlin %kotlinEapVersion% 以降、標準ライブラリは特定の時点を表す機能を提供します。
この機能は、以前は公式 Kotlin ライブラリである [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) でのみ利用可能でした。

[kotlinx.datetime.Clock](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) インターフェイスは `kotlin.time.Clock` として標準ライブラリに導入され、[`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/) クラスは `kotlin.time.Instant` として導入されます。これらの概念は、`kotlinx-datetime` に残っているより複雑なカレンダーおよびタイムゾーン機能と比較して、時間のみに関係しているため、標準ライブラリの `time` パッケージと自然に一致します。

`Instant` と `Clock` は、タイムゾーンや日付を考慮せずに正確な時間追跡が必要な場合に役立ちます。
たとえば、タイムスタンプ付きのイベントをログに記録したり、2 つの時点間の期間を測定したり、システムプロセスの現在の時点を取得したりするために使用できます。

他の言語との相互運用性を提供するために、追加のコンバーター関数が利用可能です。

* `.toKotlinInstant()` は、時間値を `kotlin.time.Instant` インスタンスに変換します。
* `.toJavaInstant()` は、`kotlin.time.Instant` 値を `java.time.Instant` 値に変換します。
* `Instant.toJSDate()` は、`kotlin.time.Instant` 値を JS `Date` クラスのインスタンスに変換します。この変換は正確ではありません。JS は日付を表すためにミリ秒の精度を使用しますが、Kotlin ではナノ秒の解像度を使用できます。

標準ライブラリの新しい時間機能は、まだ [Experimental](components-stability#stability-levels-explained) です。
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

## Compose コンパイラ: デフォルトでソース情報が含まれる

Compose コンパイラ Gradle プラグインを使用すると、すべてのプラットフォームで [ソース情報を含める](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html) ことができます。
`includeSourceInformation` オプションは Android で既に有効になっていましたが、この変更によりプラ​​グインの動作がプラットフォーム間で統一され、新しいランタイム機能のサポートが可能になります。

このオプションを `freeCompilerArgs` を使用して設定したかどうかを確認することを忘れないでください。プラグインと一緒に使用すると、オプションが 2 回設定されているため、ビルドが失敗する可能性があります。

## 破壊的な変更と非推奨

Kotlin Multiplatform を Gradle の今後の変更に合わせるために、`withJava()` 関数の段階的な廃止を進めています。
[Java ソースセットはデフォルトで作成されるようになりました](multiplatform-compatibility-guide#java-source-sets-created-by-default)。

## Kotlin %kotlinEapVersion% にアップデートする方法

IntelliJ IDEA 2023.3 および Android Studio Iguana (2023.2.1) Canary 15 以降、Kotlin プラグインは IDE に含まれるバンドルプラグインとして配布されます。つまり、JetBrains Marketplace からプラグインをインストールできなくなりました。
バンドルされたプラグインは、今後の Kotlin EAP リリースをサポートします。

新しい Kotlin EAP バージョンにアップデートするには、ビルドスクリプトで Kotlin のバージョンを %kotlinEapVersion% に [変更](configure-build-for-eap#adjust-the-kotlin-version) します。