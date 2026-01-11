[//]: # (title: Kotlin 1.9.20の新機能)

_[公開日: 2023年11月1日](releases.md#release-details)_

Kotlin 1.9.20がリリースされました。[全てのターゲットに対応したK2コンパイラがベータ版になりました](#new-kotlin-k2-compiler-updates)、
そして[Kotlin Multiplatformが安定版になりました](#kotlin-multiplatform-is-stable)。さらに、主なハイライトは以下の通りです。

*   [マルチプラットフォームプロジェクトの設定における新しいデフォルト階層テンプレート](#template-for-configuring-multiplatform-projects)
*   [Kotlin MultiplatformにおけるGradle Configuration Cacheの完全サポート](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
*   [Kotlin/Nativeでカスタムメモリ割り当て機能がデフォルトで有効に](#custom-memory-allocator-enabled-by-default)
*   [Kotlin/Nativeにおけるガベージコレクタのパフォーマンス改善](#performance-improvements-for-the-garbage-collector)
*   [Kotlin/Wasmにおける新しいターゲットと名称変更されたターゲット](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
*   [Kotlin/Wasmの標準ライブラリにおけるWASI APIのサポート](#support-for-the-wasi-api-in-the-standard-library)

これらのアップデートの簡単な概要は、こちらのビデオでもご覧いただけます。

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

## IDEサポート

1.9.20をサポートするKotlinプラグインは以下で利用可能です。

| IDE | サポートされているバージョン |
|---|---|
| IntelliJ IDEA | 2023.1.x, 2023.2.x, 2023.x |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> IntelliJ IDEA 2023.3.x および Android Studio Iguana (2023.2.1) Canary 15 以降、Kotlinプラグインは自動的に
> 含まれ、更新されます。必要なのは、プロジェクトのKotlinバージョンを更新することだけです。
>
{style="note"}

## Kotlin K2コンパイラの新しいアップデート

JetBrainsのKotlinチームは、新しいK2コンパイラの安定化を続けています。これにより、大幅なパフォーマンス向上、
新しい言語機能開発の加速、Kotlinがサポートする全てのプラットフォームの統合、マルチプラットフォームプロジェクトのためのより良いアーキテクチャがもたらされます。

K2は現在、全てのターゲットで**ベータ版**です。[リリースブログ投稿で詳細を読む](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### Kotlin/Wasmのサポート

このリリース以降、Kotlin/Wasmは新しいK2コンパイラをサポートします。
[プロジェクトで有効にする方法を学ぶ](#how-to-enable-the-kotlin-k2-compiler)。

### K2対応kaptコンパイラプラグインのプレビュー

> kaptコンパイラプラグインにおけるK2のサポートは[Experimental (実験的)](components-stability.md)です。
> オプトインが必要です（詳細は下記参照）。評価目的のみで使用してください。
>
{style="warning"}

1.9.20では、K2コンパイラで[kaptコンパイラプラグイン](kapt.md)を試用できます。
プロジェクトでK2コンパイラを使用するには、`gradle.properties`ファイルに以下のオプションを追加します。

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

あるいは、以下の手順でkaptにK2を有効にできます。
1. `build.gradle.kts`ファイルで、[言語バージョン](gradle-compiler-options.md#example-of-setting-languageversion)を`2.0`に設定します。
2. `gradle.properties`ファイルに`kapt.use.k2=true`を追加します。

K2コンパイラでkaptを使用する際に問題が発生した場合は、[課題トラッカー](http://kotl.in/issue)に報告してください。

### Kotlin K2コンパイラの有効化方法

#### GradleでK2を有効にする

Kotlin K2コンパイラを有効にしてテストするには、以下のコンパイラオプションで新しい言語バージョンを使用します。

```bash
-language-version 2.0
```

`build.gradle.kts`ファイルで以下のように指定できます。

```kotlin
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = "2.0"
        }
    }
}
```

#### MavenでK2を有効にする

Kotlin K2コンパイラを有効にしてテストするには、`pom.xml`ファイルの`<project/>`セクションを更新します。

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### IntelliJ IDEAでK2を有効にする

IntelliJ IDEAでKotlin K2コンパイラを有効にしてテストするには、**Settings** | **Build, Execution, Deployment** |
**Compiler** | **Kotlin Compiler** に移動し、**Language Version**フィールドを`2.0 (experimental)`に更新します。

### 新しいK2コンパイラに関するフィードバックのお願い

皆様からのフィードバックをお待ちしております！

*   Kotlin SlackのK2開発者に直接フィードバックを送る – [招待状を取得](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)し、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257)チャンネルに参加してください。
*   新しいK2コンパイラで直面した問題は、[課題トラッカー](https://kotl.in/issue)に報告してください。
*   K2の使用に関する匿名データをJetBrainsが収集できるように、[使用統計の送信オプションを有効にする](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)。

## Kotlin/JVM

バージョン1.9.20以降、コンパイラはJava 21のバイトコードを含むクラスを生成できます。

## Kotlin/Native

Kotlin 1.9.20には、新しいメモリ割り当て機能がデフォルトで有効になった安定版メモリマネージャ、ガベージコレクタのパフォーマンス改善、その他のアップデートが含まれます。

*   [カスタムメモリ割り当て機能がデフォルトで有効に](#custom-memory-allocator-enabled-by-default)
*   [ガベージコレクタのパフォーマンス改善](#performance-improvements-for-the-garbage-collector)
*   [`klib`成果物のインクリメンタルコンパイル](#incremental-compilation-of-klib-artifacts)
*   [ライブラリリンクの問題の管理](#managing-library-linkage-issues)
*   [クラスコンストラクタ呼び出し時のコンパニオンオブジェクト初期化](#companion-object-initialization-on-class-constructor-calls)
*   [全てのcinterop宣言に対するオプトイン要件](#opt-in-requirement-for-all-cinterop-declarations)
*   [リンカエラーのカスタムメッセージ](#custom-message-for-linker-errors)
*   [レガシーメモリマネージャの削除](#removal-of-the-legacy-memory-manager)
*   [ターゲットティアポリシーの変更](#change-to-our-target-tiers-policy)

### カスタムメモリ割り当て機能がデフォルトで有効に

Kotlin 1.9.20では、新しいメモリ割り当て機能がデフォルトで有効になっています。これは、以前のデフォルトのアロケータである、
`mimalloc`を置き換えるように設計されており、ガベージコレクションをより効率的にし、[Kotlin/Nativeメモリマネージャ](native-memory-manager.md)のランタイムパフォーマンスを向上させます。

新しいカスタムアロケータは、システムメモリをページに分割し、連続した順序での独立したスイープを可能にします。
各割り当てはページ内のメモリブロックとなり、ページはブロックサイズを追跡します。
異なるページタイプは、様々な割り当てサイズに合わせて最適化されています。
メモリブロックの連続した配置は、全ての割り当て済みブロックの効率的なイテレーションを保証します。

スレッドがメモリを割り当てる際、割り当てサイズに基づいて適切なページを検索します。
スレッドは、異なるサイズカテゴリのために一連のページを保持します。
通常、与えられたサイズに対する現在のページは割り当てを収容できます。
そうでない場合、スレッドは共有割り当てスペースから別のページを要求します。
このページは既に利用可能であるか、スイープが必要であるか、または最初に作成する必要がある場合があります。

新しいアロケータは、複数の独立した割り当てスペースを同時に可能にし、
Kotlinチームが異なるページレイアウトを試してパフォーマンスをさらに向上させることができます。

#### カスタムメモリ割り当て機能を有効にする方法

Kotlin 1.9.20以降、新しいメモリ割り当て機能がデフォルトです。追加のセットアップは不要です。

高いメモリ消費を経験した場合、Gradleビルドスクリプトで`-Xallocator=mimalloc`
または`-Xallocator=std`を使用して`mimalloc`またはシステムアロケータに戻すことができます。新しいメモリ割り当て機能を改善するために、[YouTrack](https://kotl.in/issue)でそのような問題を報告してください。

新しいアロケータの設計に関する技術的な詳細については、この[README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)を参照してください。

### ガベージコレクタのパフォーマンス改善

Kotlinチームは、新しいKotlin/Nativeメモリマネージャのパフォーマンスと安定性の改善を続けています。
このリリースでは、ガベージコレクタ（GC）にいくつかの重要な変更が加えられ、1.9.20のハイライトは以下の通りです。

*   [GCのポーズ時間を短縮するための完全並行マーク](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
*   [割り当てパフォーマンスを向上させるための大きなチャンクでのメモリ追跡](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### GCのポーズ時間を短縮するための完全並行マーク

以前は、デフォルトのガベージコレクタは部分的な並行マークしか実行しませんでした。ミューテータスレッドが一時停止している間、
スレッドローカル変数やコールスタックなど、自身のルートからGCの開始をマークしていました。
一方、別のGCスレッドは、グローバルルートからのマーク開始、およびネイティブコードを積極的に実行しており一時停止していない全てのミューテータのルートを担当していました。

このアプローチは、グローバルオブジェクトの数が限られており、ミューテータスレッドがKotlinコードの実行にかなりの時間を費やしている場合にうまく機能しました。しかし、一般的なiOSアプリケーションではそうではありません。

現在、GCは一時停止中のミューテータ、GCスレッド、およびオプションのマーカースレッドを組み合わせてマークキューを処理する完全並行マークを使用しています。デフォルトでは、マーク処理は以下によって実行されます。

*   一時停止中のミューテータ。自身のルートを処理し、コードをアクティブに実行していない間アイドル状態になるのではなく、マークプロセス全体に貢献します。
*   GCスレッド。これにより、少なくとも1つのスレッドがマーキングを実行します。

この新しいアプローチにより、マーキングプロセスがより効率的になり、GCのポーズ時間が短縮されます。

#### 割り当てパフォーマンスを向上させるための大きなチャンクでのメモリ追跡

以前は、GCスケジューラは各オブジェクトの割り当てを個別に追跡していました。しかし、新しいデフォルトのカスタム
アロケータも`mimalloc`メモリ割り当て機能も、各オブジェクトに個別のストレージを割り当てるのではなく、複数のオブジェクトのために一度に大きな領域を割り当てます。

Kotlin 1.9.20では、GCは個々のオブジェクトではなく領域を追跡します。これにより、各割り当てで実行されるタスクの数を減らすことで、小さなオブジェクトの割り当てが高速化され、したがってガベージコレクタのメモリ使用量を最小限に抑えるのに役立ちます。

### `klib`成果物のインクリメンタルコンパイル

> この機能は[Experimental (実験的)](components-stability.md#stability-levels-explained)です。
> いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。
> 評価目的のみで使用してください。[YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.9.20では、Kotlin/Nativeの新しいコンパイル時間最適化が導入されました。
`klib`成果物のネイティブコードへのコンパイルが部分的にインクリメンタルになりました。

デバッグモードでKotlinソースコードをネイティブバイナリにコンパイルする場合、コンパイルは2つのステージを経て行われます。

1.  ソースコードが`klib`成果物にコンパイルされます。
2.  `klib`成果物が、依存関係と共にバイナリにコンパイルされます。

第2ステージでのコンパイル時間を最適化するために、チームは既に依存関係のコンパイラキャッシュを実装しています。
これらは一度だけネイティブコードにコンパイルされ、その結果はバイナリがコンパイルされるたびに再利用されます。
しかし、プロジェクトソースからビルドされた`klib`成果物は、プロジェクトが変更されるたびに常にネイティブコードに完全に再コンパイルされていました。

新しいインクリメンタルコンパイルでは、プロジェクトモジュールの変更がソースコードの`klib`成果物への部分的な再コンパイルのみを引き起こす場合、`klib`の一部だけがさらにバイナリに再コンパイルされます。

インクリメンタルコンパイルを有効にするには、`gradle.properties`ファイルに以下のオプションを追加します。

```none
kotlin.incremental.native=true
```

何か問題に直面した場合は、[YouTrack](https://kotl.in/issue)に報告してください。

### ライブラリリンクの問題の管理

このリリースでは、Kotlin/NativeコンパイラがKotlinライブラリのリンクの問題を処理する方法が改善されました。エラーメッセージはハッシュの代わりにシグネチャ名を使用するため、より読みやすい宣言が含まれるようになり、問題をより簡単に見つけて修正できるようになりました。以下に例を示します。

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Nativeコンパイラは、サードパーティのKotlinライブラリ間のリンクの問題を検出し、ランタイム時にエラーを報告します。
あるサードパーティのKotlinライブラリの作成者が、別のサードパーティのKotlinライブラリが利用する実験的なAPIに互換性のない変更を加えた場合、そのような問題に直面する可能性があります。

Kotlin 1.9.20以降、コンパイラはデフォルトでサイレントモードでリンクの問題を検出します。プロジェクトでこの設定を調整できます。

*   これらの問題をコンパイルログに記録したい場合は、`-Xpartial-linkage-loglevel=WARNING`コンパイラオプションで警告を有効にします。
*   報告された警告の重大度を`-Xpartial-linkage-loglevel=ERROR`でコンパイルエラーに上げることも可能です。
この場合、コンパイルは失敗し、コンパイルログに全てのエラーが表示されます。このオプションを使用して、リンクの問題をより詳細に調べることができます。

```kotlin
// An example of passing compiler options in a Gradle build file:
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // リンクの問題を警告として報告するには:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // リンクの警告をエラーに上げるには:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

この機能で予期せぬ問題に直面した場合は、`-Xpartial-linkage=disable`コンパイラオプションでいつでもオプトアウトできます。[課題トラッカー](https://kotl.in/issue)にそのようなケースを報告することを躊躇しないでください。

### クラスコンストラクタ呼び出し時のコンパニオンオブジェクト初期化

Kotlin 1.9.20以降、Kotlin/Nativeバックエンドはクラスコンストラクタでコンパニオンオブジェクトの静的イニシャライザを呼び出します。

```kotlin
class Greeting {
    companion object {
        init {
            print("Hello, Kotlin!") 
        }
    }
}

fun main() {
    val start = Greeting() // "Hello, Kotlin!" を出力
}
```

この動作は、Kotlin/JVMと統一されました。Kotlin/JVMでは、Javaの静的イニシャライザのセマンティクスに合致する対応するクラスがロード（解決）されたときに、コンパニオンオブジェクトが初期化されます。

この機能の実装がプラットフォーム間でより一貫するようになったため、Kotlin Multiplatformプロジェクトでコードを共有することが容易になりました。

### 全てのcinterop宣言に対するオプトイン要件

Kotlin 1.9.20以降、`cinterop`ツールによってCおよびObjective-Cライブラリ（libcurlやlibxmlなど）から生成される全てのKotlin宣言は、`@ExperimentalForeignApi`でマークされます。オプトインアノテーションが欠落している場合、コードはコンパイルされません。

この要件は、CおよびObjective-Cライブラリのインポートの[Experimental (実験的)](components-stability.md#stability-levels-explained)ステータスを反映しています。プロジェクト内の特定の領域にその使用を限定することをお勧めします。これにより、インポートの安定化が開始された際の移行が容易になります。

> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）に関しては、一部のAPIのみ`@ExperimentalForeignApi`によるオプトインが必要です。そのような場合、オプトイン要件に関する警告が表示されます。
>
{style="note"}

### リンカエラーのカスタムメッセージ

ライブラリの作成者は、カスタムメッセージでユーザーがリンカエラーを解決するのを支援できるようになりました。

KotlinライブラリがCまたはObjective-Cライブラリに依存している場合（例えば、[CocoaPods連携](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)を使用している場合）、そのユーザーはこれらの依存ライブラリをマシン上にローカルに持っているか、プロジェクトのビルドスクリプトで明示的に設定する必要があります。そうでない場合、ユーザーは以前は紛らわしい「Framework not found」メッセージを受け取っていました。

コンパイル失敗メッセージに特定の指示やリンクを提供できるようになりました。これを行うには、`-Xuser-setup-hint`コンパイラオプションを`cinterop`に渡すか、`.def`ファイルに`userSetupHint=message`プロパティを追加します。

### レガシーメモリマネージャの削除

[新しいメモリマネージャ](native-memory-manager.md)はKotlin 1.6.20で導入され、1.7.20でデフォルトになりました。
それ以来、さらなるアップデートとパフォーマンス改善を受け、安定版となりました。

非推奨サイクルを完了し、レガシーメモリマネージャを削除する時が来ました。まだ使用している場合は、
`gradle.properties`から`kotlin.native.binary.memoryModel=strict`オプションを削除し、必要な変更を行うために[移行ガイド](native-migration-guide.md)に従ってください。

### ターゲットティアポリシーの変更

[Tier 1サポート](native-target-support.md#tier-1)の要件をアップグレードすることにしました。Kotlinチームは現在、
Tier 1に該当するターゲットについて、コンパイラリリース間でソースおよびバイナリ互換性を提供することにコミットしています。また、コンパイルと実行ができるようにCIツールで定期的にテストされる必要があります。現在、Tier 1にはmacOSホスト向けの以下のターゲットが含まれます。

*   `macosX64`
*   `macosArm64`
*   `iosSimulatorArm64`
*   `iosX64`

Kotlin 1.9.20では、以前非推奨となっていたいくつかのターゲットも削除しました。具体的には以下の通りです。

*   `iosArm32`
*   `watchosX86`
*   `wasm32`
*   `mingwX86`
*   `linuxMips32`
*   `linuxMipsel32`

現在[サポートされているターゲット](native-target-support.md)の全リストを参照してください。

## Kotlin Multiplatform

Kotlin 1.9.20は、Kotlin Multiplatformの安定化に重点を置き、新しいプロジェクトウィザードやその他の注目すべき機能により開発者エクスペリエンスを向上させるための新たな一歩を踏み出します。

*   [Kotlin Multiplatformが安定版になりました](#kotlin-multiplatform-is-stable)
*   [マルチプラットフォームプロジェクト構成用テンプレート](#template-for-configuring-multiplatform-projects)
*   [新しいプロジェクトウィザード](#new-project-wizard)
*   [Gradle Configuration Cacheの完全サポート](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
*   [Gradleにおける新しい標準ライブラリバージョンの設定をより簡単に](#easier-configuration-of-new-standard-library-versions-in-gradle)
*   [サードパーティcinteropライブラリのデフォルトサポート](#default-support-for-third-party-cinterop-libraries)
*   [Compose MultiplatformプロジェクトにおけるKotlin/Nativeコンパイルキャッシュのサポート](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
*   [互換性ガイドライン](#compatibility-guidelines)

### Kotlin Multiplatformが安定版になりました

1.9.20リリースは、Kotlinの進化における重要な節目となります。[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html)がついに
安定版となりました。これは、このテクノロジーがプロジェクトでの使用に安全であり、本番環境で100%利用可能であることを意味します。また、Kotlin Multiplatformのさらなる開発は、当社の厳格な[後方互換性ルール](https://kotlinfoundation.org/language-committee-guidelines/)に従って継続されることも意味します。

Kotlin Multiplatformの一部の高度な機能はまだ進化中であることに注意してください。それらを使用する際には、使用している機能の現在の安定性ステータスを説明する警告が表示されます。IntelliJ IDEAで実験的な機能を使用する前に、**Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform** で明示的に有効にする必要があります。

*   [Kotlinブログ](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)にアクセスして、Kotlin Multiplatformの安定化と今後の計画について詳しくご覧ください。
*   安定化に向けてどのような重要な変更が行われたかについては、[Multiplatform互換性ガイド](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html)をご確認ください。
*   このリリースで部分的に安定化されたKotlin Multiplatformの重要な要素である、[expectedおよびactual宣言のメカニズム](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)についてお読みください。

### マルチプラットフォームプロジェクト構成用テンプレート

Kotlin 1.9.20以降、Kotlin Gradleプラグインは、一般的なマルチプラットフォームシナリオのために共有ソースセットを自動的に作成します。
もしあなたのプロジェクト設定がそれらのいずれかであれば、ソースセット階層を手動で設定する必要はありません。
プロジェクトに必要なターゲットを明示的に指定するだけです。

Kotlin Gradleプラグインの新機能であるデフォルト階層テンプレートのおかげで、セットアップが簡単になりました。
これはプラグインに組み込まれたソースセット階層の事前定義されたテンプレートです。
宣言したターゲットに対してKotlinが自動的に作成する中間ソースセットが含まれています。[完全なテンプレートを見る](#see-the-full-hierarchy-template)。

#### プロジェクトをより簡単に作成

AndroidおよびiPhoneデバイスの両方をターゲットとし、AppleシリコンMacBookで開発されるマルチプラットフォームプロジェクトを考えてみましょう。
Kotlinの異なるバージョン間でこのプロジェクトがどのように設定されているかを比較します。

<table>
   <tr>
       <td>Kotlin 1.9.0以前 (標準的なセットアップ)</td>
       <td>Kotlin 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting

        val iosMain by creating {
            dependsOn(commonMain)
        }

        val iosArm64Main by getting {
            dependsOn(iosMain)
        }

        val iosSimulatorArm64Main by getting {
            dependsOn(iosMain)
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    // The iosMain source set is created automatically
}
```

</td>
</tr>
</table>

デフォルト階層テンプレートの使用により、プロジェクトのセットアップに必要なボイラープレートコードの量が大幅に削減される点に注目してください。

コード内で`androidTarget`、`iosArm64`、および`iosSimulatorArm64`ターゲットを宣言すると、Kotlin Gradleプラグインは
テンプレートから適切な共有ソースセットを見つけて作成します。結果として得られる階層は次のようになります。

![An example of the default target hierarchy in use](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

緑色のソースセットは実際に作成されてプロジェクトに含まれ、灰色のデフォルトテンプレートからのソースセットは無視されます。

#### ソースセットの補完を使用

作成されたプロジェクト構造を操作しやすくするため、IntelliJ IDEAはデフォルト階層テンプレートで作成されたソースセットの補完を提供するようになりました。

<img src="multiplatform-hierarchy-completion.animated.gif" alt="IDE completion for source set names" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

Kotlinはまた、対応するターゲットを宣言していないために存在しないソースセットにアクセスしようとすると警告します。
以下の例では、JVMターゲットがありません（`androidTarget`のみで、同じではありません）。しかし、`jvmMain`ソースセットを使用してみましょう。

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        jvmMain {
        }
    }
}
```

この場合、Kotlinはビルドログに警告を報告します。

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### ターゲット階層を設定する

Kotlin 1.9.20以降、デフォルト階層テンプレートは自動的に有効になります。ほとんどの場合、追加のセットアップは不要です。

しかし、1.9.20より前に作成された既存のプロジェクトを移行している場合、以前に
`dependsOn()`呼び出しで手動で中間ソースを導入していた場合に警告に遭遇する可能性があります。この問題を解決するには、以下の手順を実行してください。

*   中間ソースセットが現在デフォルト階層テンプレートでカバーされている場合、全ての手動`dependsOn()`
    呼び出しと`by creating`構成で作成されたソースセットを削除します。

    全てのデフォルトソースセットのリストを確認するには、[完全な階層テンプレート](#see-the-full-hierarchy-template)を参照してください。

*   デフォルト階層テンプレートが提供しない追加のソースセット（例えば、macOSとJVMターゲット間でコードを共有するソースセット）を持ちたい場合は、`applyDefaultHierarchyTemplate()`でテンプレートを明示的に再適用し、通常通り`dependsOn()`で追加ソースセットを手動で設定して階層を調整します。

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()

        // デフォルト階層を明示的に適用します。例えば、iosMainソースセットが作成されます:
        applyDefaultHierarchyTemplate()

        sourceSets {
            // 追加のjvmAndMacosソースセットを作成します
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }

            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

*   プロジェクトに、テンプレートによって生成されるものと全く同じ名前だが、異なるターゲットセット間で共有されているソースセットが既に存在する場合、テンプレートのソースセット間のデフォルトの`dependsOn`関係を現在変更する方法はありません。

    ここで可能な選択肢は、デフォルト階層テンプレート内または手動で作成されたソースセットの中から、目的に合った異なるソースセットを見つけることです。もう1つの選択肢は、テンプレートから完全にオプトアウトすることです。

    オプトアウトするには、`kotlin.mpp.applyDefaultHierarchyTemplate=false`を`gradle.properties`に追加し、他の全てのソースセットを手動で設定します。

    現在、そのような場合のセットアッププロセスを簡素化するために、独自の階層テンプレートを作成するためのAPIに取り組んでいます。

#### 完全な階層テンプレートを見る {initial-collapse-state="collapsed" collapsible="true"}

プロジェクトがコンパイルするターゲットを宣言すると、
プラグインはそれに応じてテンプレートから共有ソースセットを選択し、プロジェクト内に作成します。

![Default hierarchy template](full-template-hierarchy.svg)

> この例はプロジェクトのプロダクション部分のみを示しており、`Main`サフィックスは省略されています
> （例えば、`commonMain`の代わりに`common`を使用しています）。しかし、`*Test`ソースについても同様です。
>
{style="tip"}

### 新しいプロジェクトウィザード

JetBrainsチームは、クロスプラットフォームプロジェクトを作成する新しい方法である[Kotlin Multiplatformウェブウィザード](https://kmp.jetbrains.com)を導入しています。

この新しいKotlin Multiplatformウィザードの最初の実装は、最も一般的なKotlin Multiplatform
のユースケースをカバーしています。以前のプロジェクトテンプレートに関する全てのフィードバックを組み込み、アーキテクチャを可能な限り堅牢で信頼性の高いものにしています。

新しいウィザードは分散アーキテクチャを採用しており、統一されたバックエンドと
異なるフロントエンドを持つことができ、ウェブバージョンがその第一歩です。将来的にはIDEバージョンと
コマンドラインツールの両方の実装を検討しています。ウェブでは常に最新版のウィザードを利用できますが、
IDEでは次期リリースを待つ必要があります。

新しいウィザードを使えば、プロジェクトのセットアップがこれまで以上に簡単になります。
モバイル、サーバー、デスクトップ開発のターゲットプラットフォームを選択することで、プロジェクトをニーズに合わせて調整できます。将来のリリースでは、Web開発も追加する予定です。

<img src="multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

新しいプロジェクトウィザードは、Kotlinでクロスプラットフォームプロジェクトを作成するための推奨される方法となりました。1.9.20以降、Kotlin
プラグインはIntelliJ IDEAで**Kotlin Multiplatform**プロジェクトウィザードを提供しなくなりました。

新しいウィザードは初期設定を容易にガイドし、オンボーディングプロセスをはるかにスムーズにします。
問題が発生した場合は、ウィザードの使用体験を改善するために[YouTrack](https://kotl.in/issue)に報告してください。

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="Create a project" style="block"/>
</a>

### Kotlin MultiplatformにおけるGradle Configuration Cacheの完全サポート

以前、Kotlinマルチプラットフォームライブラリで利用可能だったGradleコンフィギュレーションキャッシュの[プレビュー](whatsnew19.md#preview-of-the-gradle-configuration-cache)を導入しました。1.9.20では、Kotlin Multiplatformプラグインがさらに一歩進みました。

現在、[Kotlin CocoaPods Gradleプラグイン](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)だけでなく、
`embedAndSignAppleFrameworkForXcode`のようなXcodeビルドに必要な統合タスクでもGradleコンフィギュレーションキャッシュをサポートしています。

全てのマルチプラットフォームプロジェクトは、ビルド時間の改善の恩恵を受けることができます。
Gradleコンフィギュレーションキャッシュは、設定フェーズの結果を後続のビルドで再利用することで、ビルドプロセスを高速化します。
詳細およびセットアップ手順については、[Gradleドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)を参照してください。

### Gradleにおける新しい標準ライブラリバージョンの設定をより簡単に

マルチプラットフォームプロジェクトを作成すると、標準ライブラリ（`stdlib`）の依存関係が各ソースセットに自動的に追加されます。
これは、マルチプラットフォームプロジェクトを開始する最も簡単な方法です。

以前は、標準ライブラリへの依存関係を手動で設定したい場合、各ソースセットに個別に設定する必要がありました。
`kotlin-stdlib:1.9.20`以降は、`commonMain`ルートソースセットで**一度だけ**依存関係を設定すればよくなりました。

<table>
   <tr>
       <td>標準ライブラリバージョン1.9.10以前</td>
       <td>標準ライブラリバージョン1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // For the common source set
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // For the JVM source set
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // For the JS source set
        val jsMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-js:1.9.10")
            }
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.20")
            }
        }
    }
}
```

</td>
</tr>
</table>

この変更は、標準ライブラリのGradleメタデータに新しい情報を含めることで可能になりました。これにより、
Gradleは他のソースセットに対して正しい標準ライブラリ成果物を自動的に解決できます。

### サードパーティcinteropライブラリのデフォルトサポート

Kotlin 1.9.20では、[Kotlin CocoaPods Gradle](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)プラグインが適用されているプロジェクトの全てのcinterop依存関係に対して、デフォルトのサポート（オプトインによるサポートではなく）が追加されました。

これにより、プラットフォーム固有の依存関係に制限されることなく、より多くのネイティブコードを共有できるようになります。例えば、
`iosMain`共有ソースセットに[Podライブラリへの依存関係](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)を追加できます。

以前は、これはKotlin/Nativeディストリビューションに同梱されている[プラットフォーム固有のライブラリ](native-platform-libs.md)（Foundation、UIKit、POSIXなど）でのみ機能しました。全てのサードパーティPodライブラリがデフォルトで共有ソースセットで利用できるようになりました。それらをサポートするために個別のGradleプロパティを指定する必要はありません。

### Compose MultiplatformプロジェクトにおけるKotlin/Nativeコンパイルキャッシュのサポート

このリリースでは、主にiOS向けのCompose Multiplatformプロジェクトに影響を与えていたCompose Multiplatformコンパイラプラグインとの互換性問題が解決されます。

この問題を回避するには、`kotlin.native.cacheKind=none`というGradleプロパティを使用してキャッシュを無効にする必要がありました。しかし、この回避策はパフォーマンスコストを伴い、Kotlin/Nativeコンパイラでキャッシュが機能しないため、コンパイル時間が遅くなりました。

問題が修正されたため、`gradle.properties`ファイルから`kotlin.native.cacheKind=none`を削除し、Compose Multiplatformプロジェクトで改善されたコンパイル時間を享受できます。

コンパイル時間を改善するための詳細なヒントについては、[Kotlin/Nativeドキュメント](native-improving-compilation-time.md)を参照してください。

### 互換性ガイドライン

プロジェクトを設定する際には、Kotlin Multiplatform Gradleプラグインと、利用可能なGradle、Xcode、
Android Gradleプラグイン（AGP）のバージョンとの互換性を確認してください。

| Kotlin Multiplatform Gradle plugin | Gradle | Android Gradle plugin | Xcode |
|---|---|---|---|
| 1.9.20 | 7.5 以降 | 7.4.2–8.2 | 15.0。詳細は下記参照 |

このリリース時点でのXcodeの推奨バージョンは15.0です。Xcode 15.0に同梱されているライブラリは完全にサポートされており、
Kotlinコード内のどこからでもアクセスできます。

ただし、Xcode 14.3はほとんどの場合で引き続き動作するはずです。ローカルマシンでバージョン14.3を使用している場合、
Xcode 15に同梱されているライブラリは表示されますが、アクセスできないことに注意してください。

## Kotlin/Wasm

1.9.20で、Kotlin Wasmは安定性の[アルファレベル](components-stability.md)に達しました。

*   [Wasm GCフェーズ4および最終オペコードとの互換性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
*   [新しい`wasm-wasi`ターゲット、および`wasm`ターゲットの`wasm-js`への名称変更](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
*   [標準ライブラリにおけるWASI APIのサポート](#support-for-the-wasi-api-in-the-standard-library)
*   [Kotlin/Wasm APIの改善](#kotlin-wasm-api-improvements)

> Kotlin Wasmは[Alpha (アルファ版)](components-stability.md)です。
> いつでも変更される可能性があります。評価目的のみで使用してください。
>
> [YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。
>
{style="note"}

### Wasm GCフェーズ4および最終オペコードとの互換性

Wasm GCは最終フェーズに移行し、バイナリ表現で使用される定数であるオペコードの更新が必要です。
Kotlin 1.9.20は最新のオペコードをサポートしているため、Wasmプロジェクトを最新バージョンのKotlinに更新することを強くお勧めします。
また、Wasm環境で最新バージョンのブラウザを使用することもお勧めします。
*   ChromeおよびChromiumベースのブラウザではバージョン119以降。
*   Firefoxではバージョン119以降。Firefox 119では、[Wasm GCを手動で有効にする](wasm-configuration.md)必要があることに注意してください。

### 新しい`wasm-wasi`ターゲット、および`wasm`ターゲットの`wasm-js`への名称変更

このリリースでは、Kotlin/Wasmの新しいターゲットである`wasm-wasi`を導入します。また、`wasm`ターゲットを`wasm-js`に名称変更します。
Gradle DSLでは、これらのターゲットはそれぞれ`wasmWasi {}`および`wasmJs {}`として利用可能です。

プロジェクトでこれらのターゲットを使用するには、`build.gradle.kts`ファイルを更新します。

```kotlin
kotlin {
    wasmWasi {
        // ...
    }
    wasmJs {
        // ...
    }
}
```

以前に導入された`wasm {}`ブロックは、`wasmJs {}`を優先して非推奨になりました。

既存のKotlin/Wasmプロジェクトを移行するには、以下の手順を実行してください。
*   `build.gradle.kts`ファイルで、`wasm {}`ブロックを`wasmJs {}`に名称変更します。
*   プロジェクト構造で、`wasmMain`ディレクトリを`wasmJsMain`に名称変更します。

### 標準ライブラリにおけるWASI APIのサポート

このリリースでは、Wasmプラットフォーム用のシステムインターフェースである[WASI](https://github.com/WebAssembly/WASI)のサポートが含まれました。
WASIのサポートにより、標準化されたAPIセットを提供することで、ブラウザ外（例えばサーバーサイドアプリケーションなど）でKotlin/Wasmをより簡単に使用できるようになります。さらに、WASIは能力ベースのセキュリティを提供し、外部リソースへのアクセス時にもう1つのセキュリティレイヤーを追加します。

Kotlin/Wasmアプリケーションを実行するには、Wasm Garbage Collection (GC)をサポートするVM（例: Node.jsまたはDeno）が必要です。
Wasmtime、WasmEdgeなどは、完全なWasm GCサポートに向けてまだ取り組んでいます。

WASI関数をインポートするには、`@WasmImport`アノテーションを使用します。

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[GitHubリポジトリで完全な例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)を見つけることができます。

> `wasmWasi`をターゲットとしている間は、[JavaScriptとの相互運用性](wasm-js-interop.md)を使用することはできません。
>
{style="note"}

### Kotlin/Wasm APIの改善

このリリースでは、Kotlin/Wasm APIにいくつかの利便性（Quality-of-life）改善がもたらされます。
例えば、DOMイベントリスナーで値を返す必要がなくなりました。

<table>
   <tr>
       <td>1.9.20以前</td>
       <td>1.9.20以降</td>
   </tr>
   <tr>
<td>

```kotlin
fun main() {
    window.onload = {
        document.body?.sayHello()
        null
    }
}
```

</td>
<td>

```kotlin
fun main() {
    window.onload = { document.body?.sayHello() }
}
```

</td>
</tr>
</table>

## Gradle

Kotlin 1.9.20はGradle 6.8.3から8.1まで完全に互換性があります。最新のGradle
リリースまでのバージョンも使用できますが、その場合、非推奨警告に遭遇したり、一部の新しいGradle機能が動作しない可能性があることに留意してください。

このバージョンには以下の変更が含まれています。
*   [内部宣言にアクセスするためのテストフィクスチャのサポート](#support-for-test-fixtures-to-access-internal-declarations)
*   [Konanディレクトリへのパスを設定する新しいプロパティ](#new-property-to-configure-paths-to-konan-directories)
*   [Kotlin/Nativeタスクの新しいビルドレポートメトリクス](#new-build-report-metrics-for-kotlin-native-tasks)

### 内部宣言にアクセスするためのテストフィクスチャのサポート

Kotlin 1.9.20では、Gradleの`java-test-fixtures`プラグインを使用している場合、[テストフィクスチャ](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)が
メインソースセットクラス内の`internal`宣言にアクセスできるようになりました。さらに、任意のテストソースも、テストフィクスチャクラス内の`internal`宣言を見ることができます。

### Konanディレクトリへのパスを設定する新しいプロパティ

Kotlin 1.9.20では、`kotlin.data.dir` Gradleプロパティが利用可能になり、`~/.konan`ディレクトリへのパスをカスタマイズできるため、環境変数`KONAN_DATA_DIR`を介して設定する必要がありません。

あるいは、`-Xkonan-data-dir`コンパイラオプションを使用して、`cinterop`および`konanc`ツールを介して`~/.konan`ディレクトリへのカスタムパスを設定することもできます。

### Kotlin/Nativeタスクの新しいビルドレポートメトリクス

Kotlin 1.9.20では、GradleビルドレポートにKotlin/Nativeタスクのメトリクスが含まれるようになりました。これらのメトリクスを含むビルドレポートの例を以下に示します。

```none
Total time for Kotlin tasks: 20.81 s (93.1 % of all tasks time)
Time   |% of Kotlin time|Task                            
15.24 s|73.2 %          |:compileCommonMainKotlinMetadata
5.57 s |26.8 %          |:compileNativeMainKotlinMetadata

Task ':compileCommonMainKotlinMetadata' finished in 15.24 s
Task info:
  Kotlin language version: 2.0
Time metrics:
  Total Gradle task time: 15.24 s
  Spent time before task action: 0.16 s
  Task action before worker execution: 0.21 s
  Run native in process: 2.70 s
    Run entry point: 2.64 s
Size metrics:
  Start time of task action: 2023-07-27T11:04:17

Task ':compileNativeMainKotlinMetadata' finished in 5.57 s
Task info:
  Kotlin language version: 2.0
Time metrics:
  Total Gradle task time: 5.57 s
  Spent time before task action: 0.04 s
  Task action before worker execution: 0.02 s
  Run native in process: 1.48 s
    Run entry point: 1.47 s
Size metrics:
  Start time of task action: 2023-07-27T11:04:32
```

さらに、`kotlin.experimental.tryK2`ビルドレポートには、コンパイルされたKotlin/Nativeタスクが含まれ、使用された言語バージョンがリストされるようになりました。

```none
##### 'kotlin.experimental.tryK2' results #####
:lib:compileCommonMainKotlinMetadata: 2.0 language version
:lib:compileKotlinJvm: 2.0 language version
:lib:compileKotlinIosArm64: 2.0 language version
:lib:compileKotlinIosSimulatorArm64: 2.0 language version
:lib:compileKotlinLinuxX64: 2.0 language version
:lib:compileTestKotlinJvm: 2.0 language version
:lib:compileTestKotlinIosSimulatorArm64: 2.0 language version
:lib:compileTestKotlinLinuxX64: 2.0 language version
##### 100% (8/8) tasks have been compiled with Kotlin 2.0 #####
```

> Gradle 8.0を使用している場合、特にGradle設定キャッシュが有効になっていると、ビルドレポートに問題が発生する可能性があります。これは既知の問題であり、Gradle 8.1以降で修正されています。
>
{style="note"}

## 標準ライブラリ

Kotlin 1.9.20では、[Kotlin/Native標準ライブラリが安定版](#the-kotlin-native-standard-library-becomes-stable)になり、いくつかの新機能が追加されました。
*   [Enumクラスの`values`汎用関数の置き換え](#replacement-of-the-enum-class-values-generic-function)
*   [Kotlin/JSにおけるHashMap操作のパフォーマンス改善](#improved-performance-of-hashmap-operations-in-kotlin-js)

### Enumクラスの`values`汎用関数の置き換え

> この機能は[Experimental (実験的)](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
> オプトインが必要です（詳細は下記参照）。評価目的のみで使用してください。[YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.9.0で、enumクラスの`entries`プロパティが安定版になりました。`entries`プロパティは、合成関数
`values()`に代わるモダンでパフォーマンスの高い機能です。Kotlin 1.9.20の一部として、汎用関数
`enumValues<T>()`の代替として`enumEntries<T>()`が追加されました。

> `enumValues<T>()`関数は引き続きサポートされていますが、パフォーマンスへの影響が少ないため、代わりに`enumEntries<T>()`関数を使用することをお勧めします。`enumValues<T>()`を呼び出すたびに新しい配列が作成されますが、`enumEntries<T>()`を呼び出すたびに同じリストが返されるため、はるかに効率的です。
>
{style="tip"}

例：

```kotlin
enum class RGB { RED, GREEN, BLUE }

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// RED, GREEN, BLUE
```

#### `enumEntries`関数の有効化方法

この機能を試すには、`@OptIn(ExperimentalStdlibApi)`でオプトインし、言語バージョン1.9以降を使用します。最新バージョンのKotlin Gradleプラグインを使用している場合、この機能をテストするために言語バージョンを指定する必要はありません。

### Kotlin/Native標準ライブラリが安定版に

Kotlin 1.9.0で、Kotlin/Native標準ライブラリが安定版になる際に取った行動を[説明しました](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization)。Kotlin 1.9.20では、
この作業を最終的に完了し、Kotlin/Native標準ライブラリを安定版にしました。このリリースの主なハイライトは以下の通りです。

*   [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/)クラスは`kotlin.native`パッケージから`kotlinx.cinterop`パッケージに移動されました。
*   Kotlin 1.9.0の一部として導入された`ExperimentalNativeApi`および`NativeRuntimeApi`アノテーションのオプトイン要件レベルが、`WARNING`から`ERROR`に引き上げられました。
*   Kotlin/Nativeコレクションは、例えば[`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/)や[`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/)コレクションでの同時変更を検出するようになりました。
*   `Throwable`クラスの[`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html)関数は、`STDOUT`ではなく`STDERR`に出力されるようになりました。
    > `printStackTrace()`の出力形式は安定版ではなく、変更される可能性があります。
    >
    {style="warning"}

#### Atomics APIの改善

Kotlin 1.9.0で、Kotlin/Native標準ライブラリが安定版になる際にAtomics APIも安定版になる準備が整うとお伝えしました。Kotlin 1.9.20には、以下の追加の変更が含まれます。

*   実験的な`AtomicIntArray`、`AtomicLongArray`、`AtomicArray<T>`クラスが導入されました。これらの新しいクラスは、
Javaのatomic配列と一貫性を持つように特別に設計されており、将来的に共通標準ライブラリに含めることができます。
    > `AtomicIntArray`、`AtomicLongArray`、`AtomicArray<T>`クラスは
    > [Experimental (実験的)](components-stability.md#stability-levels-explained)です。これらはいつでも削除または変更される可能性があります。
    > 試すには、`@OptIn(ExperimentalStdlibApi)`でオプトインしてください。評価目的のみで使用してください。
    > [YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。
    >
    {style="warning"}
*   `kotlin.native.concurrent`パッケージにおいて、Kotlin 1.9.0で非推奨レベル`WARNING`で非推奨化されたAtomics APIの非推奨レベルが`ERROR`に引き上げられました。
*   `kotlin.concurrent`パッケージにおいて、非推奨レベル`ERROR`であった[`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html)および[`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html)クラスの[メンバ関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions)が削除されました。
*   `AtomicReference`クラスの全ての[メンバ関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions)がatomic intrinsic関数を使用するようになりました。

Kotlin 1.9.20の全ての変更に関する詳細については、[YouTrackチケット](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)を参照してください。

### Kotlin/JSにおけるHashMap操作のパフォーマンス改善

Kotlin 1.9.20では、Kotlin/JSにおける`HashMap`操作のパフォーマンスが向上し、メモリフットプリントが削減されました。内部的には、
Kotlin/JSはその内部実装をオープンアドレス方式に変更しました。これにより、以下の状況でパフォーマンスの改善が見られるはずです。

*   `HashMap`に新しい要素を挿入する。
*   `HashMap`内の既存要素を検索する。
*   `HashMap`内のキーまたは値をイテレートする。

## ドキュメントの更新

Kotlinドキュメントにいくつかの注目すべき変更がありました。
*   [JVM Metadata](https://kotlinlang.org/api/kotlinx-metadata-jvm/) APIリファレンス – Kotlin/JVMでメタデータを解析する方法を探る。
*   [時間計測ガイド](time-measurement.md) – Kotlinで時間を計算および測定する方法を学ぶ。
*   [Kotlinツアー](kotlin-tour-welcome.md)のCollections章が改善されました – 理論と実践の両方を含む章で、Kotlinプログラミング言語の基本を学ぶ。
*   [明確な非NULL許容型](generics.md#definitely-non-nullable-types) – 明確な非NULL許容ジェネリック型について学ぶ。
*   改善された[配列ページ](arrays.md) – 配列とその使用時期について学ぶ。
*   [Kotlin Multiplatformにおけるexpectedおよびactual宣言](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) – Kotlin Multiplatformにおけるexpectedおよびactual宣言のKotlinメカニズムについて学ぶ。

## Kotlin 1.9.20のインストール

### IDEバージョンを確認する

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.xおよび2023.2.xは、Kotlin
プラグインをバージョン1.9.20に自動的に更新することを提案します。IntelliJ IDEA 2023.3にはKotlin 1.9.20プラグインが含まれる予定です。

Android Studio Hedgehog (231) および Iguana (232) は、今後のリリースでKotlin 1.9.20をサポートする予定です。

新しいコマンドラインコンパイラは、[GitHubリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20)からダウンロードできます。

### Gradle設定を構成する

Kotlinの成果物と依存関係をダウンロードするには、`settings.gradle(.kts)`ファイルを更新してMaven Centralリポジトリを使用するようにします。

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

リポジトリが指定されていない場合、Gradleは廃止されたJCenterリポジトリを使用するため、Kotlin成果物で問題が発生する可能性があります。