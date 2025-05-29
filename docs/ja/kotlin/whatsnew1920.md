[//]: # (title: Kotlin 1.9.20の新機能)

_[リリース日: 2023年11月1日](releases.md#release-details)_

Kotlin 1.9.20がリリースされ、[すべてのターゲットに対応したK2コンパイラがベータ版となり](#new-kotlin-k2-compiler-updates)、
[Kotlin Multiplatformは安定版となりました](#kotlin-multiplatform-is-stable)。さらに、主なハイライトは以下の通りです。

* [マルチプラットフォームプロジェクト設定用の新しいデフォルト階層テンプレート](#template-for-configuring-multiplatform-projects)
* [Kotlin MultiplatformにおけるGradleコンフィグレーションキャッシュの完全サポート](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Kotlin/Nativeでカスタムメモリ割り当て機能がデフォルトで有効に](#custom-memory-allocator-enabled-by-default)
* [Kotlin/Nativeのガベージコレクタのパフォーマンス改善](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasmの新しいターゲットと名称変更されたターゲット](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [標準ライブラリにおけるKotlin/WasmのWASI APIサポート](#support-for-the-wasi-api-in-the-standard-library)

これらのアップデートの概要をまとめた短いビデオもご覧いただけます。

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

## IDEサポート

1.9.20をサポートするKotlinプラグインは、以下のIDEで利用できます。

| IDE            | サポートされているバージョン                     |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> IntelliJ IDEA 2023.3.xおよびAndroid Studio Iguana (2023.2.1) Canary 15以降、Kotlinプラグインは自動的に
> 含まれ、更新されます。プロジェクトのKotlinバージョンを更新するだけで済みます。
>
{style="note"}

## 新しいKotlin K2コンパイラの更新

JetBrainsのKotlinチームは、新しいK2コンパイラの安定化を続けています。これは、大幅なパフォーマンス向上、
新しい言語機能開発の加速、Kotlinがサポートするすべてのプラットフォームの統合、そして
マルチプラットフォームプロジェクトのためのより良いアーキテクチャをもたらします。

K2は現在、すべてのターゲットで**ベータ版**です。[リリースブログ記事で詳細を読む](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### Kotlin/Wasmのサポート

今回のリリース以降、Kotlin/Wasmは新しいK2コンパイラをサポートします。
[プロジェクトで有効にする方法を学ぶ](#how-to-enable-the-kotlin-k2-compiler)。

### K2でのkaptコンパイラプラグインのプレビュー

> kaptコンパイラプラグインにおけるK2のサポートは[試験運用版](components-stability.md)です。
> オプトインが必要であり（詳細は下記参照）、評価目的でのみ使用してください。
>
{style="warning"}

1.9.20では、K2コンパイラで[kaptコンパイラプラグイン](kapt.md)を使用してみることができます。
プロジェクトでK2コンパイラを使用するには、`gradle.properties`ファイルに以下のオプションを追加します。

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

あるいは、以下の手順でkaptのK2を有効にできます。
1. `build.gradle.kts`ファイルで、[言語バージョンを設定](gradle-compiler-options.md#example-of-setting-languageversion)を`2.0`に設定します。
2. `gradle.properties`ファイルに`kapt.use.k2=true`を追加します。

K2コンパイラでkaptを使用する際に問題が発生した場合は、[イシュートラッカー](http://kotl.in/issue)に報告してください。

### Kotlin K2コンパイラを有効にする方法

#### GradleでK2を有効にする

Kotlin K2コンパイラを有効にしてテストするには、以下のコンパイラオプションで新しい言語バージョンを使用します。

```bash
-language-version 2.0
```

`build.gradle.kts`ファイルで指定できます。

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

IntelliJ IDEAでKotlin K2コンパイラを有効にしてテストするには、**Settings (設定)** | **Build, Execution, Deployment (ビルド、実行、デプロイ)** |
**Compiler (コンパイラ)** | **Kotlin Compiler (Kotlinコンパイラ)** に移動し、**Language Version (言語バージョン)** フィールドを `2.0 (experimental)` に更新します。

### 新しいK2コンパイラに関するフィードバックをお寄せください

皆様からのフィードバックをお待ちしております！

* Kotlin SlackのK2開発者に直接フィードバックを提供してください — [招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  そして [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) チャンネルに参加してください。
* 新しいK2コンパイラで直面した問題は、[イシュートラッカー](https://kotl.in/issue)に報告してください。
* [使用統計の送信オプションを有効にする](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)ことで、JetBrainsがK2の使用状況に関する匿名データを収集できるようになります。

## Kotlin/JVM

バージョン1.9.20から、コンパイラはJava 21バイトコードを含むクラスを生成できるようになりました。

## Kotlin/Native

Kotlin 1.9.20には、新しいメモリ割り当て機能がデフォルトで有効な安定版メモリマネージャ、ガベージコレクタのパフォーマンス改善、およびその他のアップデートが含まれています。

* [カスタムメモリ割り当て機能がデフォルトで有効に](#custom-memory-allocator-enabled-by-default)
* [ガベージコレクタのパフォーマンス改善](#performance-improvements-for-the-garbage-collector)
* [`klib` アーティファクトのインクリメンタルコンパイル](#incremental-compilation-of-klib-artifacts)
* [ライブラリリンクの問題の管理](#managing-library-linkage-issues)
* [クラスコンストラクタ呼び出し時のコンパニオンオブジェクトの初期化](#companion-object-initialization-on-class-constructor-calls)
* [すべてのcinterop宣言に対するオプトイン要件](#opt-in-requirement-for-all-cinterop-declarations)
* [リンカーエラーのカスタムメッセージ](#custom-message-for-linker-errors)
* [レガシーメモリマネージャの削除](#removal-of-the-legacy-memory-manager)
* [ターゲットティアポリシーの変更](#change-to-our-target-tiers-policy)

### カスタムメモリ割り当て機能がデフォルトで有効に

Kotlin 1.9.20では、新しいメモリ割り当て機能がデフォルトで有効になっています。これは、以前のデフォルトのアロケータである
`mimalloc`を置き換え、ガベージコレクションをより効率的にし、[Kotlin/Nativeメモリマネージャ](native-memory-manager.md)のランタイムパフォーマンスを向上させるように設計されています。

新しいカスタムアロケータは、システムメモリをページに分割し、連続した順序での独立したスイープを可能にします。
各割り当てはページ内のメモリブロックとなり、ページはブロックサイズを追跡します。
異なるページタイプは、さまざまな割り当てサイズに最適化されています。
メモリブロックの連続した配置により、すべての割り当て済みブロックを効率的にイテレートできます。

スレッドがメモリを割り当てる際、割り当てサイズに基づいて適切なページを検索します。
スレッドは、異なるサイズカテゴリのページのセットを維持します。
通常、特定のサイズに対する現在のページは、割り当てに対応できます。
そうでない場合、スレッドは共有割り当て空間から別のページを要求します。
このページはすでに利用可能であるか、スイープが必要であるか、または最初に作成される必要がある場合があります。

新しいアロケータは、複数の独立した割り当て空間を同時に可能にするため、
Kotlinチームは、パフォーマンスをさらに向上させるために異なるページレイアウトを試すことができます。

#### カスタムメモリ割り当て機能を有効にする方法

Kotlin 1.9.20以降、新しいメモリ割り当て機能はデフォルトです。追加のセットアップは不要です。

メモリ消費量が高い場合は、Gradleビルドスクリプトで`-Xallocator=mimalloc`または`-Xallocator=std`を指定して、`mimalloc`またはシステムアロケータに切り替えることができます。
新しいメモリ割り当て機能の改善にご協力いただくため、このような問題は[YouTrack](https://kotl.in/issue)にご報告ください。

新しいアロケータ設計の技術的な詳細については、この[README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)を参照してください。

### ガベージコレクタのパフォーマンス改善

Kotlinチームは、新しいKotlin/Nativeメモリマネージャのパフォーマンスと安定性の改善を続けています。
今回のリリースでは、ガベージコレクタ (GC) にいくつかの重要な変更が加えられました。以下に1.9.20のハイライトを挙げます。

* [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### GCの一時停止時間を短縮するための完全並行マーク

以前のデフォルトのガベージコレクタは、部分的な並行マークのみを実行していました。ミューテーター（mutator）スレッドが一時停止すると、
スレッドローカル変数やコールスタックなどのGC自身のルートからマークを開始します。
一方、別のGCスレッドは、グローバルルート、およびネイティブコードをアクティブに実行しており一時停止していないすべてのミューテーターの
ルートからのマークを担当していました。

このアプローチは、グローバルオブジェクトの数が限られており、ミューテータースレッドがKotlinコードの実行にかなりの時間を費やしている場合にはうまく機能しました。しかし、一般的なiOSアプリケーションではそうではありません。

現在、GCは完全な並行マークを使用しており、一時停止中のミューテーター、GCスレッド、およびオプションのマーカーを組み合わせて
マークキューを処理します。デフォルトでは、マーキングプロセスは以下によって実行されます。

* 一時停止中のミューテーター。自身のルートを処理した後、アクティブにコードを実行していない間アイドル状態になるのではなく、
  マーキングプロセス全体に貢献します。
* GCスレッド。これにより、少なくとも1つのスレッドがマーキングを実行することが保証されます。

この新しいアプローチにより、マーキングプロセスがより効率的になり、GCの一時停止時間が短縮されます。

#### 割り当てパフォーマンスを向上させるための大きなチャンクでのメモリ追跡

以前、GCスケジューラは各オブジェクトの割り当てを個別に追跡していました。しかし、新しいデフォルトのカスタム
アロケータも`mimalloc`メモリ割り当て機能も、各オブジェクトに個別のストレージを割り当てるのではなく、一度に複数のオブジェクトのために大きな領域を割り当てます。

Kotlin 1.9.20では、GCは個々のオブジェクトではなく領域を追跡します。これにより、各割り当てで実行されるタスクの数を減らすことで、小さいオブジェクトの割り当てを高速化し、
ガベージコレクタのメモリ使用量を最小限に抑えるのに役立ちます。

### `klib` アーティファクトのインクリメンタルコンパイル

> この機能は[試験運用版](components-stability.md#stability-levels-explained)です。
> いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記参照）。
> 評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.9.20では、Kotlin/Nativeの新しいコンパイル時間最適化が導入されました。
`klib`アーティファクトのネイティブコードへのコンパイルが部分的にインクリメンタルになりました。

Kotlinソースコードをデバッグモードでネイティブバイナリにコンパイルする場合、コンパイルは2つの段階を経ます。

1. ソースコードが`klib`アーティファクトにコンパイルされます。
2. `klib`アーティファクトと依存関係がバイナリにコンパイルされます。

第2段階でのコンパイル時間を最適化するために、チームはすでに依存関係用のコンパイラキャッシュを実装しています。
これらはネイティブコードに一度だけコンパイルされ、その結果はバイナリがコンパイルされるたびに再利用されます。
しかし、プロジェクトのソースからビルドされた`klib`アーティファクトは、プロジェクトの変更があるたびに常にネイティブコードに完全に再コンパイルされていました。

新しいインクリメンタルコンパイルでは、プロジェクトモジュールの変更がソースコードの`klib`アーティファクトへの部分的な再コンパイルのみを引き起こす場合、
`klib`の一部のみがさらにバイナリに再コンパイルされます。

インクリメンタルコンパイルを有効にするには、`gradle.properties`ファイルに以下のオプションを追加します。

```none
kotlin.incremental.native=true
```

問題が発生した場合は、[YouTrack](https://kotl.in/issue)に報告してください。

### ライブラリリンクの問題の管理

今回のリリースでは、Kotlin/NativeコンパイラがKotlinライブラリ内のリンクの問題を処理する方法が改善されました。エラーメッセージは、
ハッシュではなくシグネチャ名を使用するため、より読みやすい宣言を含むようになり、問題の発見と修正が容易になります。例を次に示します。

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Nativeコンパイラは、サードパーティのKotlinライブラリ間のリンクの問題を検出し、ランタイム時にエラーを報告します。
別のサードパーティのKotlinライブラリが利用している試験運用版APIで、あるサードパーティのKotlinライブラリの作成者が互換性のない変更を行った場合に、そのような問題に直面する可能性があります。

Kotlin 1.9.20以降、コンパイラはデフォルトでサイレントモードでリンクの問題を検出します。この設定はプロジェクトで調整できます。

* これらの問題をコンパイルログに記録したい場合は、`-Xpartial-linkage-loglevel=WARNING`コンパイラオプションで警告を有効にします。
* 報告された警告の深刻度を`-Xpartial-linkage-loglevel=ERROR`でコンパイルエラーに引き上げることも可能です。
  この場合、コンパイルは失敗し、すべてのエラーがコンパイルログに表示されます。このオプションを使用して、リンクの問題をより詳しく調べてください。

```kotlin
// Gradleビルドファイルでコンパイラオプションを渡す例:
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // リンクの問題を警告として報告するには:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // リンクの警告をエラーに引き上げるには:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

この機能で予期せぬ問題が発生した場合は、いつでも`-Xpartial-linkage=disable`コンパイラオプションでオプトアウトできます。
そのようなケースは、[イシュートラッカー](https://kotl.in/issue)に報告することをためらわないでください。

### クラスコンストラクタ呼び出し時のコンパニオンオブジェクトの初期化

Kotlin 1.9.20以降、Kotlin/Nativeバックエンドはクラスコンストラクタ内でコンパニオンオブジェクトの静的イニシャライザを呼び出します。

```kotlin
class Greeting {
    companion object {
        init {
            print("Hello, Kotlin!") 
        }
    }
}

fun main() {
    val start = Greeting() // "Hello, Kotlin!" を出力します
}
```

この動作はKotlin/JVMと統一されました。Kotlin/JVMでは、Javaの静的イニシャライザのセマンティクスに合致する対応するクラスがロード（解決）されるときに、コンパニオンオブジェクトが初期化されます。

この機能の実装がプラットフォーム間でより一貫性を持つようになったことで、Kotlin Multiplatformプロジェクトでのコード共有が容易になりました。

### すべてのcinterop宣言に対するオプトイン要件

Kotlin 1.9.20以降、`cinterop`ツールによってCおよびObjective-Cライブラリ（libcurlやlibxmlなど）から生成されるすべてのKotlin宣言は、
`@ExperimentalForeignApi`でマークされます。オプトインアノテーションが欠落している場合、コードはコンパイルされません。

この要件は、CおよびObjective-Cライブラリのインポートが[試験運用版](components-stability.md#stability-levels-explained)のステータスであることを反映しています。
インポートの安定化が開始された際に移行が容易になるよう、プロジェクト内の特定の領域にその使用を限定することをお勧めします。

> Kotlin/Nativeに付属するネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）に関しては、
> そのAPIの一部のみが`@ExperimentalForeignApi`によるオプトインを必要とします。そのような場合、オプトイン要件に関する警告が表示されます。
>
{style="note"}

### リンカーエラーのカスタムメッセージ

ライブラリの作成者は、カスタムメッセージでユーザーがリンカーエラーを解決するのを助けることができるようになりました。

たとえば、Kotlinライブラリが[CocoaPods連携](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)を使用してCまたはObjective-Cライブラリに依存している場合、
そのユーザーはこれらの依存ライブラリをマシン上にローカルに持っているか、プロジェクトビルドスクリプトで明示的に設定する必要があります。
そうでない場合、ユーザーは以前は「Framework not found」という混乱を招くメッセージを受け取っていました。

コンパイル失敗メッセージに特定の指示やリンクを提供するオプションが追加されました。これを行うには、
`-Xuser-setup-hint`コンパイラオプションを`cinterop`に渡すか、`.def`ファイルに`userSetupHint=message`プロパティを追加します。

### レガシーメモリマネージャの削除

[新しいメモリマネージャ](native-memory-manager.md)はKotlin 1.6.20で導入され、1.7.20でデフォルトになりました。
それ以来、さらなる更新とパフォーマンス改善が加えられ、安定版となりました。

非推奨サイクルの完了とレガシーメモリマネージャの削除の時期が来ました。まだ使用している場合は、`gradle.properties`から
`kotlin.native.binary.memoryModel=strict`オプションを削除し、[移行ガイド](native-migration-guide.md)に従って必要な変更を行ってください。

### ターゲットティアポリシーの変更

[ティア1サポート](native-target-support.md#tier-1)の要件をアップグレードすることを決定しました。Kotlinチームは現在、ティア1に該当するターゲットについて、
コンパイラのリリース間でソースおよびバイナリの互換性を提供することにコミットしています。また、それらはコンパイルおよび実行できるように
CIツールで定期的にテストされる必要があります。現在、ティア1にはmacOSホスト向けの以下のターゲットが含まれています。

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

Kotlin 1.9.20では、以前に非推奨とされた以下のいくつかのターゲットも削除されました。

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

現在[サポートされているターゲット](native-target-support.md)の完全なリストを参照してください。

## Kotlin Multiplatform

Kotlin 1.9.20はKotlin Multiplatformの安定化に重点を置き、新しいプロジェクトウィザードやその他の注目すべき機能により、
開発者エクスペリエンスを向上させるための新たな一歩を踏み出します。

* [Kotlin Multiplatformが安定版に](#kotlin-multiplatform-is-stable)
* [マルチプラットフォームプロジェクト設定用のテンプレート](#template-for-configuring-multiplatform-projects)
* [新しいプロジェクトウィザード](#new-project-wizard)
* [Gradleコンフィグレーションキャッシュの完全サポート](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Gradleでの新しい標準ライブラリバージョンの設定がより簡単に](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [サードパーティcinteropライブラリのデフォルトサポート](#default-support-for-third-party-cinterop-libraries)
* [Compose MultiplatformプロジェクトにおけるKotlin/Nativeコンパイルキャッシュのサポート](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [互換性ガイドライン](#compatibility-guidelines)

### Kotlin Multiplatformが安定版に

1.9.20リリースは、Kotlinの進化における重要なマイルストーンを示しています。[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)がついに
安定版となりました。これは、この技術がプロジェクトで安全に使用でき、本番環境で100%利用可能であることを意味します。また、
Kotlin Multiplatformのさらなる開発は、当社の厳格な[後方互換性ルール](https://kotlinfoundation.org/language-committee-guidelines/)に従って継続されることを意味します。

Kotlin Multiplatformの一部の高度な機能はまだ進化中であることに注意してください。これらを使用する際には、使用している機能の
現在の安定性ステータスを説明する警告が表示されます。IntelliJ IDEAで試験運用版の機能を使用する前に、
**Settings (設定)** | **Advanced Settings (詳細設定)** | **Kotlin** | **Experimental Multiplatform (試験運用版マルチプラットフォーム)** で明示的に有効にする必要があります。

* Kotlin Multiplatformの安定化と今後の計画について詳しくは、[Kotlinブログ](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)をご覧ください。
* 安定化までの間に加えられた重要な変更点については、[マルチプラットフォーム互換性ガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html)をご確認ください。
* このリリースで部分的に安定化されたKotlin Multiplatformの重要な要素である、[expect/actual宣言のメカニズム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)についてお読みください。

### マルチプラットフォームプロジェクト設定用のテンプレート

Kotlin 1.9.20以降、Kotlin Gradleプラグインは、一般的なマルチプラットフォームのシナリオに合わせて、共有ソースセットを自動的に作成します。
プロジェクトの設定がその1つである場合、ソースセット階層を手動で設定する必要はありません。
プロジェクトに必要なターゲットを明示的に指定するだけで済みます。

Kotlin Gradleプラグインの新しい機能であるデフォルト階層テンプレートにより、設定がより簡単になりました。
これは、プラグインに組み込まれたソースセット階層の事前定義されたテンプレートです。
宣言したターゲットの中間ソースセットがKotlinによって自動的に作成されます。[完全なテンプレートを確認する](#see-the-full-hierarchy-template)。

#### プロジェクトをより簡単に作成する

AndroidとiPhoneの両方のデバイスをターゲットとし、AppleシリコンのMacBookで開発されるマルチプラットフォームプロジェクトを考えてみましょう。
Kotlinの異なるバージョン間でこのプロジェクトがどのように設定されているかを比較します。

<table>
   <tr>
       <td>Kotlin 1.9.0以前（標準的なセットアップ）</td>
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

    // iosMainソースセットは自動的に作成されます
}
```

</td>
</tr>
</table>

デフォルト階層テンプレートを使用することで、プロジェクトを設定するために必要なボイラープレートコードの量が大幅に削減されることに注目してください。

コード内で`androidTarget`、`iosArm64`、`iosSimulatorArm64`ターゲットを宣言すると、Kotlin Gradleプラグインは
テンプレートから適切な共有ソースセットを見つけて作成します。結果の階層は次のようになります。

![An example of the default target hierarchy in use](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

緑色のソースセットは実際に作成され、プロジェクトに含まれますが、デフォルトテンプレートの灰色のソースセットは無視されます。

#### ソースセットの補完を使用する

作成されたプロジェクト構造を扱いやすくするために、IntelliJ IDEAはデフォルト階層テンプレートで作成されたソースセットの補完を提供するようになりました。

<img src="multiplatform-hierarchy-completion.animated.gif" alt="IDE completion for source set names" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

Kotlinはまた、関連するターゲットを宣言していないために存在しないソースセットにアクセスしようとすると警告します。
以下の例では、JVMターゲットがありません（`androidTarget`のみで、これは同じではありません）。しかし、`jvmMain`ソースセットを使用しようとして、何が起こるかを見てみましょう。

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

ただし、1.9.20より前に作成された既存のプロジェクトを移行している場合、以前に`dependsOn()`呼び出しで手動で中間ソースを導入していた場合に警告に遭遇する可能性があります。この問題を解決するには、以下の手順を実行します。

* 中間ソースセットが現在デフォルト階層テンプレートでカバーされている場合、すべての手動`dependsOn()`
  呼び出しと`by creating`構成で作成されたソースセットを削除します。

  すべてのデフォルトソースセットのリストを確認するには、[完全な階層テンプレート](#see-the-full-hierarchy-template)を参照してください。

* デフォルト階層テンプレートが提供しない追加のソースセット（たとえば、macOSとJVMターゲット間でコードを共有するソースセットなど）が必要な場合は、`applyDefaultHierarchyTemplate()`でテンプレートを明示的に再適用し、
  `dependsOn()`で通常どおり追加のソースセットを手動で設定して階層を調整します。

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // デフォルト階層を明示的に適用します。これにより、たとえばiosMainソースセットが作成されます。
      applyDefaultHierarchyTemplate()

      sourceSets {
          // 追加のjvmAndMacosソースセットを作成
          val jvmAndMacos by creating {
              dependsOn(commonMain.get())
          }

          macosArm64Main.get().dependsOn(jvmAndMacos)
          jvmMain.get().dependsOn(jvmAndMacos)
      }
  }
  ```

* プロジェクト内に、テンプレートによって生成されるソースセットと全く同じ名前を持つが、異なるターゲットセット間で共有されているソースセットがすでに存在する場合、
  テンプレートのソースセット間のデフォルトの`dependsOn`関係を変更する方法は現在ありません。

  ここでの1つの選択肢は、デフォルト階層テンプレート内にあるか、手動で作成されたかに関わらず、目的の異なるソースセットを見つけることです。もう1つは、テンプレートを完全にオプトアウトすることです。

  オプトアウトするには、`kotlin.mpp.applyDefaultHierarchyTemplate=false`を`gradle.properties`に追加し、他のすべての
  ソースセットを手動で設定します。

  このような場合に設定プロセスを簡素化するために、独自の階層テンプレートを作成するためのAPIを現在開発中です。

#### 完全な階層テンプレートを表示する {initial-collapse-state="collapsed" collapsible="true"}

プロジェクトがコンパイルするターゲットを宣言すると、
プラグインはそれに応じてテンプレートから共有ソースセットを選択し、プロジェクト内にそれらを作成します。

![Default hierarchy template](full-template-hierarchy.svg)

> この例では、プロジェクトのプロダクション部分のみを示しており、`Main`サフィックスは省略されています
> （たとえば、`commonMain`の代わりに`common`を使用）。ただし、`*Test`ソースについてもすべて同じです。
>
{style="tip"}

### 新しいプロジェクトウィザード

JetBrainsチームは、クロスプラットフォームプロジェクトを作成する新しい方法である[Kotlin Multiplatformウェブウィザード](https://kmp.jetbrains.com)を導入しています。

この新しいKotlin Multiplatformウィザードの最初の実装は、最も人気のあるKotlin Multiplatformのユースケースをカバーしています。
以前のプロジェクトテンプレートに関するすべてのフィードバックを取り入れ、アーキテクチャを可能な限り堅牢で信頼性の高いものにしています。

新しいウィザードは分散アーキテクチャを採用しており、統合されたバックエンドと
異なるフロントエンドを持つことができ、ウェブ版がその最初のステップとなります。将来的にはIDE版の実装と
コマンドラインツールの作成も検討しています。ウェブでは常に最新バージョンのウィザードを利用できますが、
IDEでは次のリリースを待つ必要があります。

新しいウィザードにより、プロジェクトのセットアップがこれまで以上に簡単になりました。
モバイル、サーバー、デスクトップ開発のターゲットプラットフォームを選択することで、ニーズに合わせてプロジェクトをカスタマイズできます。
今後のリリースでは、ウェブ開発も追加する予定です。

<img src="multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

新しいプロジェクトウィザードは、Kotlinでクロスプラットフォームプロジェクトを作成するための推奨される方法になりました。1.9.20以降、Kotlin
プラグインはIntelliJ IDEAで**Kotlin Multiplatform**プロジェクトウィザードを提供しなくなりました。

新しいウィザードは、初期セットアップを簡単に案内し、オンボーディングプロセスをはるかにスムーズにします。
問題が発生した場合は、[YouTrack](https://kotl.in/issue)に報告して、ウィザードでのエクスペリエンス向上にご協力ください。

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="Create a project" style="block"/>
</a>

### Gradleコンフィグレーションキャッシュの完全サポート

以前、Kotlinマルチプラットフォームライブラリで利用可能なGradleコンフィグレーションキャッシュの[プレビュー](whatsnew19.md#preview-of-the-gradle-configuration-cache)を導入しました。1.9.20では、Kotlin Multiplatformプラグインはさらに一歩進んでいます。

[Kotlin CocoaPods Gradleプラグイン](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)に加え、
`embedAndSignAppleFrameworkForXcode`のようなXcodeビルドに必要な統合タスクでもGradleコンフィグレーションキャッシュをサポートするようになりました。

これで、すべてのマルチプラットフォームプロジェクトがビルド時間の改善の恩恵を受けることができます。
Gradleコンフィグレーションキャッシュは、設定フェーズの結果を後続のビルドで再利用することで、ビルドプロセスを高速化します。
詳細と設定手順については、[Gradleドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)を参照してください。

### Gradleでの新しい標準ライブラリバージョンの設定がより簡単に

マルチプラットフォームプロジェクトを作成すると、標準ライブラリ（`stdlib`）の依存関係が
各ソースセットに自動的に追加されます。これは、マルチプラットフォームプロジェクトを開始する最も簡単な方法です。

以前は、標準ライブラリへの依存関係を手動で設定したい場合、
各ソースセットに個別に設定する必要がありました。`kotlin-stdlib:1.9.20`以降は、
`commonMain`ルートソースセットに**一度だけ**依存関係を設定するだけで済みます。

<table>
   <tr>
       <td>標準ライブラリバージョン 1.9.10以前</td>
       <td>標準ライブラリバージョン 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // 共通ソースセットの場合
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // JVMソースセットの場合
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // JSソースセットの場合
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
Gradleは他のソースセットに対して正しい標準ライブラリアーティファクトを自動的に解決できます。

### サードパーティcinteropライブラリのデフォルトサポート

Kotlin 1.9.20では、[Kotlin CocoaPods Gradle](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)プラグインが適用されているプロジェクトにおいて、すべてのcinterop依存関係のデフォルトサポート（オプトインによるサポートではなく）が追加されました。

これは、プラットフォーム固有の依存関係に制限されることなく、より多くのネイティブコードを共有できるようになったことを意味します。たとえば、
`iosMain`共有ソースセットに[Podライブラリへの依存関係](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html)を追加できます。

以前は、これはKotlin/Nativeディストリビューションに付属する[プラットフォーム固有のライブラリ](native-platform-libs.md)（Foundation、UIKit、POSIXなど）でのみ機能していました。
すべてのサードパーティPodライブラリがデフォルトで共有ソースセットで利用可能になりました。これらをサポートするために、個別のGradleプロパティを指定する必要はなくなりました。

### Compose MultiplatformプロジェクトにおけるKotlin/Nativeコンパイルキャッシュのサポート

今回のリリースでは、Compose Multiplatformコンパイラプラグインとの互換性問題が解決されました。これは主に
iOS向けのCompose Multiplatformプロジェクトに影響を与えていました。

この問題を回避するために、`kotlin.native.cacheKind=none`Gradleプロパティを使用してキャッシュを無効にする必要がありました。しかし、この
回避策はパフォーマンスコストを伴い、Kotlin/Nativeコンパイラでキャッシュが機能しないため、コンパイル時間が遅くなりました。

問題が解決されたため、`gradle.properties`ファイルから`kotlin.native.cacheKind=none`を削除し、
Compose Multiplatformプロジェクトで改善されたコンパイル時間を享受できます。

コンパイル時間を改善するためのその他のヒントについては、[Kotlin/Nativeドキュメント](native-improving-compilation-time.md)を参照してください。

### 互換性ガイドライン

プロジェクトを設定する際は、Kotlin Multiplatform Gradleプラグインと利用可能なGradle、Xcode、
Android Gradleプラグイン (AGP) のバージョンとの互換性を確認してください。

| Kotlin Multiplatform Gradleプラグイン | Gradle | Android Gradleプラグイン | Xcode |
|---------------------------|------|----|----|
| 1.9.20        | 7.5以降 | 7.4.2–8.2 | 15.0。詳細は下記参照 |

今回のリリースから、Xcodeの推奨バージョンは15.0です。Xcode 15.0に同梱されているライブラリは完全にサポートされており、
Kotlinコードのどこからでもアクセスできます。

ただし、Xcode 14.3はほとんどの場合引き続き動作するはずです。ローカルマシンでバージョン14.3を使用している場合、Xcode 15に同梱されているライブラリは表示されますが、アクセスはできません。

## Kotlin/Wasm

1.9.20で、Kotlin Wasmは安定性の[アルファレベル](components-stability.md)に達しました。

* [Wasm GCフェーズ4および最終オペコードとの互換性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
* [新しい`wasm-wasi`ターゲット、および`wasm`ターゲットから`wasm-js`への名称変更](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [標準ライブラリにおけるWASI APIのサポート](#support-for-the-wasi-api-in-the-standard-library)
* [Kotlin/Wasm APIの改善](#kotlin-wasm-api-improvements)

> Kotlin Wasmは[アルファ版](components-stability.md)です。
> いつでも変更される可能性があります。評価目的でのみ使用してください。
>
> [YouTrack](https://kotl.in/issue)でフィードバックをいただけると幸いです。
>
{style="note"}

### Wasm GCフェーズ4および最終オペコードとの互換性

Wasm GCは最終フェーズに移行し、バイナリ表現で使用される定数であるオペコードの更新が必要です。
Kotlin 1.9.20は最新のオペコードをサポートしているため、Wasmプロジェクトを最新バージョンのKotlinに更新することを強くお勧めします。
また、Wasm環境では最新バージョンのブラウザを使用することをお勧めします。
* ChromeおよびChromiumベースのブラウザではバージョン119以降。
* Firefoxではバージョン119以降。Firefox 119では、[手動でWasm GCを有効にする](wasm-troubleshooting.md)必要があることに注意してください。

### 新しい`wasm-wasi`ターゲット、および`wasm`ターゲットから`wasm-js`への名称変更

今回のリリースでは、Kotlin/Wasmの新しいターゲットである`wasm-wasi`を導入します。また、`wasm`ターゲットを`wasm-js`に名称変更します。
Gradle DSLでは、これらのターゲットはそれぞれ`wasmWasi {}`と`wasmJs {}`として利用できます。

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

以前導入された`wasm {}`ブロックは、`wasmJs {}`を優先して非推奨となりました。

既存のKotlin/Wasmプロジェクトを移行するには、以下の手順を実行します。
* `build.gradle.kts`ファイルで、`wasm {}`ブロックを`wasmJs {}`にリネームします。
* プロジェクト構造で、`wasmMain`ディレクトリを`wasmJsMain`にリネームします。

### 標準ライブラリにおけるWASI APIのサポート

今回のリリースでは、Wasmプラットフォームのシステムインターフェースである[WASI](https://github.com/WebAssembly/WASI)のサポートが含まれています。
WASIのサポートにより、標準化されたAPIセットが提供され、たとえばサーバーサイドアプリケーションなど、ブラウザ以外でKotlin/Wasmを使用することが容易になります。
さらに、WASIは機能ベースのセキュリティを提供し、外部リソースへのアクセスに別のセキュリティレイヤーを追加します。

Kotlin/Wasmアプリケーションを実行するには、Node.jsやDenoなど、Wasmガベージコレクション（GC）をサポートするVMが必要です。
Wasmtime、WasmEdgeなどは、まだ完全なWasm GCサポートに向けて取り組んでいます。

WASI関数をインポートするには、`@WasmImport`アノテーションを使用します。

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[完全な例はGitHubリポジトリ](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)にあります。

> `wasmWasi`をターゲットとする場合、[JavaScriptとの相互運用](wasm-js-interop.md)は利用できません。
>
{style="note"}

### Kotlin/Wasm APIの改善

今回のリリースでは、Kotlin/Wasm APIにいくつかの利便性（quality-of-life）の向上がもたらされました。
たとえば、DOMイベントリスナーで値を返す必要がなくなりました。

<table>
   <tr>
       <td>1.9.20以前</td>
       <td>1.9.20で</td>
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

Kotlin 1.9.20は、Gradle 6.8.3から8.1まで完全に互換性があります。最新のGradle
リリースまでのGradleバージョンも使用できますが、その場合、非推奨の警告や新しいGradle機能が動作しない可能性があることに注意してください。

今回のバージョンでは以下の変更があります。
* [内部宣言にアクセスするためのテストフィクスチャのサポート](#support-for-test-fixtures-to-access-internal-declarations)
* [Konanディレクトリへのパスを設定するための新しいプロパティ](#new-property-to-configure-paths-to-konan-directories)
* [Kotlin/Nativeタスクの新しいビルドレポートメトリクス](#new-build-report-metrics-for-kotlin-native-tasks)

### 内部宣言にアクセスするためのテストフィクスチャのサポート

Kotlin 1.9.20では、Gradleの`java-test-fixtures`プラグインを使用している場合、[テストフィクスチャ](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)は
メインソースセットクラス内の`internal`宣言にアクセスできるようになりました。さらに、テストソースはテストフィクスチャクラス内の
任意の`internal`宣言も参照できます。

### Konanディレクトリへのパスを設定するための新しいプロパティ

Kotlin 1.9.20では、`kotlin.data.dir` Gradleプロパティを使用して、`~/.konan`ディレクトリへのパスをカスタマイズできるようになりました。
これにより、環境変数`KONAN_DATA_DIR`を通じて設定する必要がなくなります。

あるいは、`-Xkonan-data-dir`コンパイラオプションを使用して、`cinterop`および`konanc`ツールを介して`~/.konan`ディレクトリへのカスタムパスを設定することもできます。

### Kotlin/Nativeタスクの新しいビルドレポートメトリクス

Kotlin 1.9.20では、GradleビルドレポートにKotlin/Nativeタスクのメトリクスが含まれるようになりました。これらのメトリクスを含むビルドレポートの例を次に示します。

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

さらに、`kotlin.experimental.tryK2`ビルドレポートには、コンパイルされたKotlin/Nativeタスクが含まれ、
使用された言語バージョンがリストされるようになりました。

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

> Gradle 8.0を使用している場合、特にGradleコンフィグレーションキャッシュが有効になっていると、ビルドレポートにいくつかの問題が発生する可能性があります。
> これは既知の問題であり、Gradle 8.1以降で修正されています。
>
{style="note"}

## 標準ライブラリ

Kotlin 1.9.20では、[Kotlin/Native標準ライブラリが安定版になり](#the-kotlin-native-standard-library-becomes-stable)、
いくつかの新機能が追加されました。
* [Enumクラスの`values`ジェネリック関数の置き換え](#replacement-of-the-enum-class-values-generic-function)
* [Kotlin/JSにおけるHashMap操作のパフォーマンス向上](#improved-performance-of-hashmap-operations-in-kotlin-js)

### Enumクラスの`values`ジェネリック関数の置き換え

> この機能は[試験運用版](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
> オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.9.0では、enumクラスの`entries`プロパティが安定版になりました。`entries`プロパティは、合成`values()`関数の
モダンで高性能な代替です。Kotlin 1.9.20の一部として、ジェネリックな`enumValues<T>()`関数の代替として
`enumEntries<T>()`が導入されました。

> `enumValues<T>()`関数は引き続きサポートされていますが、パフォーマンスへの影響が少ないため、`enumEntries<T>()`関数の使用をお勧めします。
> `enumValues<T>()`を呼び出すたびに新しい配列が作成されますが、`enumEntries<T>()`を呼び出すたびに同じリストが返されるため、
> はるかに効率的です。
>
{style="tip"}

例:

```kotlin
enum class RGB { RED, GREEN, BLUE }

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// RED, GREEN, BLUE
```

#### `enumEntries`関数を有効にする方法

この機能を試すには、`@OptIn(ExperimentalStdlibApi)`でオプトインし、言語バージョン1.9以降を使用します。
最新バージョンのKotlin Gradleプラグインを使用している場合、この機能をテストするために言語バージョンを指定する必要はありません。

### Kotlin/Native標準ライブラリが安定版に

Kotlin 1.9.0では、Kotlin/Native標準ライブラリの安定化目標に向けた取り組みを[説明しました](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization)。
Kotlin 1.9.20では、この作業を最終的に完了し、Kotlin/Native標準ライブラリを安定版とします。このリリースからの主なハイライトは以下の通りです。

* [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/)クラスが`kotlin.native`パッケージから`kotlinx.cinterop`パッケージに移動されました。
* Kotlin 1.9.0で導入された`ExperimentalNativeApi`および`NativeRuntimeApi`アノテーションのオプトイン要件レベルが`WARNING`から`ERROR`に引き上げられました。
* Kotlin/Nativeコレクションは、たとえば[`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/)や[`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/)コレクションで並行変更を検出するようになりました。
* `Throwable`クラスの[`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html)関数は、`STDOUT`ではなく`STDERR`に出力するようになりました。
  > `printStackTrace()`の出力形式は安定版ではなく、変更される可能性があります。
  >
  {style="warning"}

#### Atomics APIの改善

Kotlin 1.9.0では、Kotlin/Native標準ライブラリが安定版になった際にAtomics APIも安定版になる予定であると述べました。
Kotlin 1.9.20には、以下の追加の変更が含まれています。

* 試験運用版の`AtomicIntArray`、`AtomicLongArray`、および`AtomicArray<T>`クラスが導入されました。これらの新しいクラスは、
  将来的に共通標準ライブラリに含まれるように、Javaのアトミック配列との一貫性を保つように特別に設計されています。
  > `AtomicIntArray`、`AtomicLongArray`、および`AtomicArray<T>`クラスは
  > [試験運用版](components-stability.md#stability-levels-explained)です。これらはいつでも削除または変更される可能性があります。
  > これらを試すには、`@OptIn(ExperimentalStdlibApi)`でオプトインしてください。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue)で
  > フィードバックをいただけると幸いです。
  >
  {style="warning"}
* `kotlin.native.concurrent`パッケージでは、Kotlin 1.9.0で非推奨レベル`WARNING`で非推奨化されたAtomics APIの非推奨レベルが`ERROR`に引き上げられました。
* `kotlin.concurrent`パッケージでは、非推奨レベルが`ERROR`であった[`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html)および[`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html)クラスのメンバー関数が削除されました。
* `AtomicReference`クラスのすべての[メンバー関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions)がアトミック組み込み関数を使用するようになりました。

Kotlin 1.9.20のすべての変更に関する詳細については、[YouTrackチケット](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)を参照してください。

### Kotlin/JSにおけるHashMap操作のパフォーマンス向上

Kotlin 1.9.20では、Kotlin/JSにおける`HashMap`操作のパフォーマンスが向上し、メモリフットプリントが削減されました。内部的に、
Kotlin/JSは内部実装をオープンアドレス法に変更しました。これにより、以下の状況でパフォーマンスの向上が見られるはずです。
* `HashMap`に新しい要素を挿入する場合。
* `HashMap`内の既存の要素を検索する場合。
* `HashMap`内のキーまたは値をイテレートする場合。

## ドキュメントの更新

Kotlinのドキュメントにはいくつかの注目すべき変更が加えられました。
* [JVMメタデータ](https://kotlinlang.org/api/kotlinx-metadata-jvm/) APIリファレンス – Kotlin/JVMでメタデータを解析する方法を探る。
* [時間計測ガイド](time-measurement.md) – Kotlinで時間を計算し計測する方法を学ぶ。
* [Kotlinツアー](kotlin-tour-welcome.md)のコレクション章を改善 – 理論と実践の両方を含む章で、Kotlinプログラミング言語の基礎を学ぶ。
* [Definitely non-nullable型](generics.md#definitely-non-nullable-types) – Definitely non-nullableジェネリック型について学ぶ。
* [配列ページ](arrays.md)を改善 – 配列とそれらをいつ使用するかについて学ぶ。
* [Kotlin Multiplatformのexpect/actual宣言](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) – Kotlin MultiplatformにおけるKotlinのexpect/actual宣言のメカニズムについて学ぶ。

## Kotlin 1.9.20のインストール

### IDEバージョンの確認

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.xおよび2023.2.xは、Kotlin
プラグインをバージョン1.9.20に更新することを自動的に提案します。IntelliJ IDEA 2023.3には、Kotlin 1.9.20プラグインが含まれる予定です。

Android Studio Hedgehog (231)およびIguana (232)は、今後のリリースでKotlin 1.9.20をサポートする予定です。

新しいコマンドラインコンパイラは、[GitHubリリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20)からダウンロードできます。

### Gradle設定の構成

Kotlinアーティファクトと依存関係をダウンロードするには、`settings.gradle(.kts)`ファイルを更新してMaven Centralリポジトリを使用します。

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

リポジトリが指定されていない場合、Gradleは廃止されたJCenterリポジトリを使用するため、Kotlinアーティファクトに関する問題につながる可能性があります。