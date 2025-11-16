[//]: # (title: Kotlin 2.1.20の新機能)

_[リリース日: 2025年3月20日](releases.md#release-details)_

Kotlin 2.1.20がリリースされました！主なハイライトは以下の通りです。

*   **K2コンパイラの更新**: [新しいkaptおよびLombokプラグインへの更新](#kotlin-k2-compiler)
*   **Kotlin Multiplatform**: [GradleのApplicationプラグインを置き換える新しいDSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
*   **Kotlin/Native**: [Xcode 16.3のサポートと新しいインライン化最適化](#kotlin-native)
*   **Kotlin/Wasm**: [デフォルトのカスタムフォーマッタ、DWARFのサポート、Provider APIへの移行](#kotlin-wasm)
*   **Gradleサポート**: [GradleのIsolated Projectsとの互換性、カスタムパブリケーションバリアント](#gradle)
*   **標準ライブラリ**: [共通のアトミック型、UUIDサポートの改善、新しい時間追跡機能](#standard-library)
*   **Composeコンパイラ**: [`@Composable`関数の制限緩和とその他の更新](#compose-compiler)
*   **ドキュメント**: [Kotlinドキュメントの注目すべき改善](#documentation-updates)。

## IDEサポート

2.1.20をサポートするKotlinプラグインは、最新のIntelliJ IDEAおよびAndroid Studioにバンドルされています。
IDEでKotlinプラグインを更新する必要はありません。
ビルドスクリプトでKotlinのバージョンを2.1.20に変更するだけです。

詳細については、[新しいリリースへの更新](releases.md#update-to-a-new-kotlin-version)を参照してください。

### OSGiサポートを使用するプロジェクトにおけるKotlinアーティファクトのソースのダウンロード

`kotlin-osgi-bundle`ライブラリのすべての依存関係のソースが、そのディストリビューションに含まれるようになりました。これにより、
IntelliJ IDEAはこれらのソースをダウンロードして、Kotlinシンボルのドキュメントを提供し、デバッグエクスペリエンスを向上させることができます。

## Kotlin K2コンパイラ

新しいKotlin K2コンパイラに対するプラグインのサポートを改善し続けています。このリリースでは、新しいkaptおよびLombokプラグインの更新が含まれています。

### 新しいデフォルトのkaptプラグイン
<primary-label ref="beta"/>

Kotlin 2.1.20より、kaptコンパイラプラグインのK2実装がすべてのプロジェクトでデフォルトで有効になります。

JetBrainsチームは、Kotlin 1.9.20でK2コンパイラとともにkaptプラグインの新しい実装をリリースしました。
それ以来、私たちはK2 kaptの内部実装をさらに開発し、その動作をK1バージョンと同様にしつつ、
パフォーマンスも大幅に改善しました。

K2コンパイラでkaptを使用中に問題が発生した場合は、
一時的に以前のプラグイン実装に戻すことができます。

そのためには、プロジェクトの`gradle.properties`ファイルに以下のオプションを追加してください。

```kotlin
kapt.use.k2=false
```

問題がありましたら、[イシュートラッカー](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)にご報告ください。

### Lombokコンパイラプラグイン: `@SuperBuilder`のサポートと`@Builder`の更新
<primary-label ref="experimental-general"/>

[Kotlin Lombokコンパイラプラグイン](lombok.md)が`@SuperBuilder`アノテーションをサポートし、クラス階層用のビルダーをより簡単に作成できるようになりました。以前は、KotlinでLombokを使用する開発者は、継承を扱う際にビルダーを手動で定義する必要がありました。`@SuperBuilder`を使用すると、ビルダーが自動的にスーパークラスのフィールドを継承し、オブジェクト構築時にそれらを初期化できるようになります。

さらに、この更新にはいくつかの改善とバグ修正が含まれています。

*   `@Builder`アノテーションがコンストラクタで動作するようになり、より柔軟なオブジェクト作成が可能になりました。詳細については、関連する[YouTrackイシュー](https://youtrack.jetbrains.com/issue/KT-71547)を参照してください。
*   KotlinにおけるLombokのコード生成に関連するいくつかの問題が解決され、全体的な互換性が向上しました。詳細については、[GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)を参照してください。

`@SuperBuilder`アノテーションの詳細については、公式の[Lombokドキュメント](https://projectlombok.org/features/experimental/SuperBuilder)を参照してください。

## Kotlin Multiplatform: GradleのApplicationプラグインを置き換える新しいDSL
<primary-label ref="experimental-opt-in"/>

Gradle 8.7以降、[Application](https://docs.gradle.org/current/userguide/application_plugin.html)プラグインは
Kotlin Multiplatform Gradleプラグインと互換性がなくなりました。Kotlin 2.1.20では、同様の機能を実現するためのExperimentalな
DSLが導入されました。新しい`executable {}`ブロックは、JVMターゲットの実行タスクとGradleの[ディストリビューション](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)を設定します。

ビルドスクリプトの`executable {}`ブロックの前に、以下の`@OptIn`アノテーションを追加してください。

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

例:

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

この例では、Gradleの[Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)プラグインが、最初の`executable {}`ブロックに適用されています。

問題が発生した場合は、[イシュートラッカー](https://kotl.in/issue)にご報告いただくか、[公開Slackチャンネル](https://kotlinlang.slack.com/archives/C19FD9681)でお知らせください。

## Kotlin/Native

### Xcode 16.3のサポート

Kotlin **2.1.21**以降、Kotlin/NativeコンパイラはXcodeの最新安定バージョンであるXcode 16.3をサポートします。
Xcodeを更新して、Appleオペレーティングシステム向けのKotlinプロジェクトの作業を続けることができます。

2.1.21リリースでは、Kotlin Multiplatformプロジェクトでコンパイルエラーを引き起こしていた関連する[cinteropのイシュー](https://youtrack.jetbrains.com/issue/KT-75781/)も修正されています。

### 新しいインライン化最適化
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20では、実際のコード生成フェーズの前に実行される新しいインライン化最適化パスが導入されました。

Kotlin/Nativeコンパイラにおける新しいインライン化パスは、標準のLLVMインライナーよりも優れたパフォーマンスを発揮し、生成されたコードのランタイムパフォーマンスを向上させるはずです。

新しいインライン化パスは現在[Experimental](components-stability.md#stability-levels-explained)です。試すには、
以下のコンパイラオプションを使用してください。

```none
-Xbinary=preCodegenInlineThreshold=40
```

私たちの実験では、閾値を40トークン（コンパイラによって解析されるコード単位）に設定すると、コンパイル最適化にとって妥当な妥協点となることが示されています。私たちのベンチマークによると、これにより全体的なパフォーマンスが9.5%向上します。もちろん、他の値を試すこともできます。

バイナリサイズやコンパイル時間の増加を経験した場合は、[YouTrack](https://kotl.in/issue)経由で問題を報告してください。

## Kotlin/Wasm

このリリースでは、Kotlin/Wasmのデバッグとプロパティの使用が改善されています。カスタムフォーマッタが開発
ビルドでそのまま動作するようになり、DWARFデバッグはコードの検査を容易にします。さらに、Provider APIは
Kotlin/WasmおよびKotlin/JSにおけるプロパティの使用を簡素化します。

### カスタムフォーマッタがデフォルトで有効に

以前は、Kotlin/Wasmコードを扱う際にWebブラウザでのデバッグを改善するために、カスタムフォーマッタを[手動で設定](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm)する必要がありました。

このリリースでは、開発ビルドでカスタムフォーマッタがデフォルトで有効になるため、追加のGradle設定は不要です。

この機能を使用するには、ブラウザの開発者ツールでカスタムフォーマッタが有効になっていることを確認するだけです。

*   Chrome DevToolsでは、**Settings | Preferences | Console**でカスタムフォーマッタのチェックボックスを見つけます。

    ![Chromeでカスタムフォーマッターを有効にする](wasm-custom-formatters-chrome.png){width=400}

*   Firefox DevToolsでは、**Settings | Advanced settings**でカスタムフォーマッタのチェックボックスを見つけます。

    ![Firefoxでカスタムフォーマッターを有効にする](wasm-custom-formatters-firefox.png){width=400}

この変更は主にKotlin/Wasmの開発ビルドに影響します。プロダクションビルドに特定の要件がある場合は、
それに応じてGradle設定を調整する必要があります。そのためには、`wasmJs {}`ブロックに以下のコンパイラオプションを追加します。

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

### Kotlin/WasmコードをデバッグするためのDWARFのサポート

Kotlin 2.1.20では、Kotlin/WasmでDWARF（debugging with arbitrary record format）のサポートが導入されました。

この変更により、Kotlin/Wasmコンパイラは生成されたWebAssembly (Wasm) バイナリにDWARFデータを埋め込むことができるようになります。
多くのデバッガや仮想マシンは、このデータを読み取ってコンパイルされたコードに関する洞察を提供できます。

DWARFは、主にスタンドアロンのWasm仮想マシン（VM）内でKotlin/Wasmアプリケーションをデバッグするのに役立ちます。この機能を
使用するには、Wasm VMとデバッガがDWARFをサポートしている必要があります。

DWARFのサポートにより、Kotlin/Wasmアプリケーションをステップ実行したり、変数を検査したり、コードの洞察を得ることができます。この機能を有効にするには、
以下のコンパイラオプションを使用してください。

```bash
-Xwasm-generate-dwarf
```
### Kotlin/WasmおよびKotlin/JSプロパティのProvider APIへの移行

以前、Kotlin/WasmおよびKotlin/JS拡張機能のプロパティはミュータブル（`var`）であり、ビルドスクリプトで直接代入されていました。

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

現在、プロパティは[Provider API](https://docs.gradle.org/current/userguide/properties_providers.html)を介して公開されており、
値を代入するには`.set()`関数を使用する必要があります。

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider APIは、値が遅延計算され、タスクの依存関係と適切に統合されることを保証し、ビルドパフォーマンスを向上させます。

この変更により、`NodeJsEnvSpec`や`YarnRootEnvSpec`などの`*EnvSpec`クラスに有利な直接のプロパティ代入は非推奨になりました。

さらに、混乱を避けるためにいくつかのエイリアスタスクが削除されました。

| Deprecated task        | Replacement                                                     |
|:-----------------------|:----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` or `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` or `jsBrowserDistribution`         |

ビルドスクリプトでKotlin/JSまたはKotlin/Wasmのみを使用している場合、Gradleが自動的に代入を処理するため、何もアクションは必要ありません。

ただし、Kotlin Gradle Pluginをベースとしたプラグインをメンテナンスしており、そのプラグインが`kotlin-dsl`を適用していない場合は、
プロパティの代入を`.set()`関数を使用するように更新する必要があります。

## Gradle

Kotlin 2.1.20はGradle 7.6.3から8.11までと完全に互換性があります。最新のGradle
リリースまでのGradleバージョンも使用できます。ただし、そうすると非推奨の警告が表示されたり、新しいGradle機能の一部が動作しない可能性があることに注意してください。

このバージョンのKotlinには、Kotlin GradleプラグインのGradleのIsolated Projectsとの互換性、およびカスタムGradleパブリケーションバリアントのサポートが含まれています。

### GradleのIsolated Projectsと互換性のあるKotlin Gradleプラグイン
<primary-label ref="experimental-opt-in"/>

> この機能は現在、Gradleでプレアルファ（pre-Alpha）状態です。JSおよびWasmターゲットは現在サポートされていません。
> Gradleバージョン8.10以降でのみ、評価目的でご利用ください。
>
{style="warning"}

Kotlin 2.1.0以降、プロジェクトで[GradleのIsolated Projects機能をプレビュー](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)できるようになりました。

以前は、この機能を試す前に、Kotlin Gradleプラグインを設定してプロジェクトをIsolated Projects機能と互換性があるようにする必要がありました。Kotlin 2.1.20では、この追加の手順は不要になりました。

現在、Isolated Projects機能を有効にするには、[システムプロパティを設定](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)するだけで済みます。

GradleのIsolated Projects機能は、マルチプラットフォームプロジェクトと、JVMまたはAndroidターゲットのみを含むプロジェクトの両方で、Kotlin Gradleプラグインでサポートされています。

特にマルチプラットフォームプロジェクトの場合、アップグレード後にGradleビルドで問題が発生した場合は、
以下の行を追加することで新しいKotlin Gradleプラグインの動作をオプトアウトできます。

```none
kotlin.kmp.isolated-projects.support=disable
```

ただし、マルチプラットフォームプロジェクトでこのGradleプロパティを使用すると、Isolated Projects機能は使用できません。

この機能に関するご意見は、[YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)でお知らせください。

### カスタムGradleパブリケーションバリアントの追加のサポート
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20は、カスタム[Gradleパブリケーションバリアント](https://docs.gradle.org/current/userguide/variant_attributes.html)の追加のサポートを導入します。この機能はマルチプラットフォームプロジェクトとJVMをターゲットとするプロジェクトで利用可能です。

> この機能では、既存のGradleバリアントを変更することはできません。
>
{style="note"}

この機能は[Experimental](components-stability.md#stability-levels-explained)です。
オプトインするには、`@OptIn(ExperimentalKotlinGradlePluginApi::class)`アノテーションを使用します。

カスタムGradleパブリケーションバリアントを追加するには、`adhocSoftwareComponent()`関数を呼び出します。この関数は、
Kotlin DSLで設定可能な[`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html)のインスタンスを返します。

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

> バリアントの詳細については、Gradleの[カスタマイズパブリッシングガイド](https://docs.gradle.org/current/userguide/publishing_customization.html)を参照してください。
>
{style="tip"}

## 標準ライブラリ

このリリースでは、共通のアトミック型、UUIDサポートの改善、新しい時間追跡機能といった、標準ライブラリの新しいExperimental機能が導入されています。

### 共通のアトミック型
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20では、標準ライブラリの`kotlin.concurrent.atomics`パッケージに共通のアトミック型が導入され、
スレッドセーフな操作のための共有されたプラットフォーム非依存のコードが可能になります。これにより、
ソースセット間でアトミック依存ロジックを重複させる必要がなくなり、Kotlin Multiplatformプロジェクトの開発が簡素化されます。

`kotlin.concurrent.atomics`パッケージとそのプロパティは[Experimental](components-stability.md#stability-levels-explained)です。
オプトインするには、`@OptIn(ExperimentalAtomicApi::class)`アノテーションまたはコンパイラオプション`-opt-in=kotlin.ExperimentalAtomicApi`を使用します。

以下は、`AtomicInt`を使用して複数のスレッド間で処理済みアイテムを安全にカウントする方法を示す例です。

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
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
//sampleEnd
    // Prints the total number of processed items
    println("Total processed items: ${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

Kotlinのアトミック型とJavaの[`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)アトミック型とのシームレスな相互運用を可能にするために、APIは`.asJavaAtomic()`および`.asKotlinAtomic()`拡張関数を提供します。JVM上では、Kotlinのアトミック型とJavaのアトミック型はランタイムで同じ型であるため、オーバーヘッドなしでJavaのアトミック型をKotlinのアトミック型に、またはその逆に変換できます。

以下は、KotlinとJavaのアトミック型が連携して動作する方法を示す例です。

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // Converts Kotlin's AtomicInt to Java's AtomicInteger
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic value: ${javaAtomic.get()}")
    // Java atomic value: 42

    // Converts Java's AtomicInteger back to Kotlin's AtomicInt
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic value: ${kotlinAgain.load()}")
    // Kotlin atomic value: 42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUIDのパース、フォーマット、比較可能性の変更
<primary-label ref="experimental-opt-in"/>

JetBrainsチームは、[2.0.20で標準ライブラリに導入された](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library)UUIDのサポートを改善し続けています。

以前は、`parse()`関数は16進数とダッシュ形式のUUIDのみを受け入れていました。Kotlin 2.1.20では、
16進数とダッシュ形式 _および_ プレーンな16進数形式（ダッシュなし）の _両方_ に`parse()`を使用できます。

このリリースでは、16進数とダッシュ形式での操作に特化した関数も導入されました。

*   `parseHexDash()`は、16進数とダッシュ形式からUUIDをパースします。
*   `toHexDashString()`は、`Uuid`を16進数とダッシュ形式の`String`に変換します（`toString()`の機能をミラーリング）。

これらの関数は、以前16進数形式のために導入された[`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html)および[`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html)と同様に機能します。
パースおよびフォーマット機能の明示的な命名は、コードの明確性とUUIDの全体的なエクスペリエンスを向上させるはずです。

KotlinのUUIDは`Comparable`になりました。Kotlin 2.1.20以降、`Uuid`型の値を直接比較したりソートしたりできます。
これにより、`<`および`>`演算子、および`Comparable`型またはそのコレクション（`sorted()`など）専用に利用可能な標準ライブラリの拡張機能の使用が可能になり、
また、`Comparable`インターフェースを必要とするあらゆる関数やAPIにUUIDを渡すこともできます。

標準ライブラリにおけるUUIDのサポートはまだ[Experimental](components-stability.md#stability-levels-explained)であることに注意してください。
オプトインするには、`@OptIn(ExperimentalUuidApi::class)`アノテーションまたはコンパイラオプション`-opt-in=kotlin.uuid.ExperimentalUuidApi`を使用します。

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
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
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### 新しい時間追跡機能
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20以降、標準ライブラリは時刻の瞬間を表す機能を提供します。この機能は
以前は公式Kotlinライブラリである[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/)でのみ利用可能でした。

`kotlinx.datetime.Clock`インターフェースは
標準ライブラリに[`kotlin.time.Clock`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-clock/)として導入され、`kotlinx.datetime.Instant`
クラスは[`kotlin.time.Instant`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-instant/)として導入されました。これらの概念は、より複雑なカレンダーやタイムゾーン機能が`kotlinx-datetime`に残るのに対し、
時刻の瞬間にのみ関心があるため、標準ライブラリの`time`パッケージと自然に整合します。

`Instant`と`Clock`は、タイムゾーンや日付を考慮せずに正確な時間追跡が必要な場合に役立ちます。例えば、
タイムスタンプ付きでイベントを記録したり、2つの時点間の期間を測定したり、システムプロセス用の現在の
瞬間を取得したりするのに使用できます。

他の言語との相互運用性を提供するために、追加の変換関数が利用可能です。

*   [`.toKotlinInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-kotlin-instant.html)は、時刻値を`kotlin.time.Instant`インスタンスに変換します。
*   [`.toJavaInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-java-instant.html)は、`kotlin.time.Instant`値を`java.time.Instant`値に変換します。
*   [`Instant.toJSDate()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-j-s-date.html)は、`kotlin.time.Instant`値をJS `Date`クラスのインスタンスに変換します。この変換は
    正確ではありません。JSは日付を表すのにミリ秒精度を使用しますが、Kotlinはナノ秒解像度を許容します。

標準ライブラリの新しい時間機能はまだ[Experimental](components-stability.md#stability-levels-explained)です。
オプトインするには、`@OptIn(ExperimentalTime::class)`アノテーションを使用します。

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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

実装に関する詳細情報は、この[KEEP提案](https://github.com/Kotlin/KEEP/pull/387/files)を参照してください。

## Composeコンパイラ

2.1.20では、Composeコンパイラは以前のリリースで導入された`@Composable`関数に対する一部の制限を緩和します。
さらに、ComposeコンパイラのGradleプラグインは、Androidとのすべてのプラットフォームでの動作を合わせるため、
ソース情報をデフォルトで含めるように設定されています。

### openな`@Composable`関数におけるデフォルト値を持つパラメーターのサポート

以前、コンパイラは、不正確なコンパイラ出力により、ランタイムでクラッシュを引き起こす可能性があったため、`open`な`@Composable`関数におけるデフォルト値を持つパラメーターを制限していました。この根本的な問題は解決され、Kotlin 2.1.20以降で使用する場合、デフォルト値を持つパラメーターは完全にサポートされます。

Composeコンパイラは、[バージョン1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)より前に`open`な関数でデフォルト値を持つパラメーターを許可していたため、
そのサポートはプロジェクト構成に依存します。

*   `open`なコンポーザブル関数がKotlinバージョン2.1.20以降でコンパイルされた場合、コンパイラはデフォルト値を持つパラメーターに対して正しいラッパーを生成します。これには、1.5.8より前のバイナリと互換性のあるラッパーが含まれ、ダウンストリームライブラリもこの`open`関数を使用できるようになります。
*   `open`なコンポーザブル関数がKotlin 2.1.20より古いバージョンでコンパイルされた場合、Composeは互換性モードを使用し、ランタイムでクラッシュが発生する可能性があります。互換性モードを使用している場合、コンパイラは潜在的な問題を強調するために警告を発します。

### finalでオーバーライドされた関数は再起動可能に

仮想関数（インターフェースを含む`open`および`abstract`のオーバーライド）は、[2.1.0リリースで再起動不可とされていました](whatsnew21.md#changes-to-open-and-overridden-composable-functions)。
この制限は、`final`クラスのメンバーであるか、それ自体が`final`である関数に対して緩和され、
通常どおり再起動またはスキップされます。

Kotlin 2.1.20にアップグレードした後、影響を受ける関数でいくつかの動作変更が見られるかもしれません。以前のバージョンの再起動不可ロジックを強制するには、
関数に`@NonRestartableComposable`アノテーションを適用してください。

### `ComposableSingletons`が公開APIから削除

`ComposableSingletons`は、`@Composable`ラムダを最適化する際にComposeコンパイラによって作成されるクラスです。
パラメーターをキャプチャしないラムダは一度割り当てられ、クラスのプロパティにキャッシュされるため、ランタイムでのアロケーションを節約します。
このクラスは内部可視性で生成され、コンパイル単位（通常はファイル）内のラムダを最適化することのみを目的としています。

しかし、この最適化は`inline`関数本体にも適用され、シングルトンラムダインスタンスが
公開APIに漏洩するという問題を引き起こしていました。この問題を解決するため、2.1.20以降、`@Composable`ラムダは
インライン関数内でシングルトンに最適化されなくなりました。同時に、Composeコンパイラは、
以前のモデルでコンパイルされたモジュールのバイナリ互換性をサポートするために、
インライン関数用のシングルトンクラスとラムダの生成を継続します。

### ソース情報がデフォルトで含まれるように

ComposeコンパイラGradleプラグインは、Androidではすでに[ソース情報を含める機能](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html)がデフォルトで有効になっています。
Kotlin 2.1.20以降、この機能はすべてのプラットフォームでデフォルトで有効になります。

このオプションを`freeCompilerArgs`を使用して設定していないか確認してください。この方法は、
プラグインと併用された場合に、オプションが事実上2回設定されることになり、ビルドが失敗する原因となる可能性があります。

## 破壊的変更と非推奨

*   Kotlin MultiplatformをGradleの今後の変更に合わせるため、`withJava()`関数を段階的に廃止しています。
    [Javaソースセットはデフォルトで作成されるようになりました](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)。[Javaテストフィクスチャ](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)Gradleプラグインを使用している場合は、
    互換性の問題を避けるため、直接[Kotlin 2.1.21](releases.md#release-details)にアップグレードしてください。
*   JetBrainsチームは`kotlin-android-extensions`プラグインの非推奨化を進めています。プロジェクトでこれを使用しようとすると、
    設定エラーが発生し、プラグインコードは実行されなくなります。
*   レガシープロパティ`kotlin.incremental.classpath.snapshot.enabled`がKotlin Gradleプラグインから削除されました。
    このプロパティは、JVMで組み込みのABIスナップショットにフォールバックする機会を提供していました。現在、プラグインは
    不要な再コンパイルを検出して回避するために他の方法を使用しており、このプロパティは廃止されました。

## ドキュメントの更新

Kotlinドキュメントにはいくつかの注目すべき変更が加えられました。

### 改良されたページと新しいページ

*   [Kotlinロードマップ](roadmap.md) – Kotlinの言語とエコシステムの進化における優先順位の更新されたリストをご覧ください。
*   [Gradleのベストプラクティス](gradle-best-practices.md)ページ – Gradleビルドを最適化し、パフォーマンスを向上させるための重要なベストプラクティスを学びましょう。
*   [Compose MultiplatformとJetpack Compose](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-and-jetpack-compose.html)
    – 2つのUIフレームワーク間の関係の概要。
*   [Kotlin MultiplatformとFlutter](https://kotlinlang.org/docs/multiplatform/kotlin-multiplatform-flutter.html)
    – 2つの人気のあるクロスプラットフォームフレームワークの比較をご覧ください。
*   [Cとの相互運用](native-c-interop.md) – KotlinとCの相互運用の詳細を探りましょう。
*   [数値型](numbers.md) – 数値を表現するためのさまざまなKotlin型について学びましょう。

### 新しく更新されたチュートリアル

*   [Maven Centralにライブラリを公開する](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-libraries.html)
    – 最も人気のあるMavenリポジトリにKMPライブラリアーティファクトを公開する方法を学びましょう。
*   [Kotlin/Nativeを動的ライブラリとして使用する](native-dynamic-libraries.md) – 動的Kotlinライブラリを作成します。
*   [Kotlin/NativeをAppleフレームワークとして使用する](apple-framework.md) – 独自のフレームワークを作成し、macOSおよびiOS上のSwift/Objective-CアプリケーションからKotlin/Nativeコードを使用します。

## Kotlin 2.1.20へのアップデート方法

IntelliJ IDEA 2023.3およびAndroid Studio Iguana (2023.2.1) Canary 15以降、KotlinプラグインはIDEにバンドルされた
プラグインとして配布されます。これは、JetBrains Marketplaceからプラグインをインストールできなくなったことを意味します。

新しいKotlinバージョンに更新するには、ビルドスクリプトで[Kotlinのバージョンを2.1.20に変更](releases.md#update-to-a-new-kotlin-version)してください。