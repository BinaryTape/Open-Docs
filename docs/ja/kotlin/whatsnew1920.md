[//]: # (title: Kotlin 1.9.20 の新機能)

<web-summary>新しい言語機能、Kotlin Multiplatform、JVM、Native、JS、Wasm へのアップデート、および Gradle と Maven のビルドツールサポートを含む Kotlin 1.9.20 リリースノートをお読みください。</web-summary>

_[リリース日: 2023年11月1日](releases.md#release-history)_

Kotlin 1.9.20 リリースが公開されました。[すべてのターゲットに対する K2 コンパイラがベータ版](#new-kotlin-k2-compiler-updates)となり、[Kotlin Multiplatform が安定版](#kotlin-multiplatform-is-stable)になりました。また、主なハイライトは以下の通りです：

* [マルチプラットフォームプロジェクトをセットアップするための新しいデフォルト階層テンプレート](#template-for-configuring-multiplatform-projects)
* [Kotlin Multiplatform における Gradle 構成キャッシュの完全サポート](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Kotlin/Native でカスタムメモリマロケーターがデフォルトで有効に](#custom-memory-allocator-enabled-by-default)
* [Kotlin/Native のガベージコレクタのパフォーマンス向上](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasm における新しいターゲットと名称変更](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Kotlin/Wasm 標準ライブラリでの WASI API サポート](#support-for-the-wasi-api-in-the-standard-library)

こちらのビデオでもアップデートの短い概要をご覧いただけます：

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

> Kotlin のリリースサイクルの詳細については、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## IDE サポート

1.9.20 をサポートする Kotlin プラグインは、以下で利用可能です：

| IDE            | サポートされているバージョン                     |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> IntelliJ IDEA 2023.3.x および Android Studio Iguana (2023.2.1) Canary 15 以降、Kotlin プラグインは自動的に含まれ、更新されます。必要な作業は、プロジェクト内の Kotlin バージョンを更新することだけです。
>
{style="note"}

## 新しい Kotlin K2 コンパイラのアップデート

JetBrains の Kotlin チームは、新しい K2 コンパイラの安定化を引き続き進めています。これにより、大幅なパフォーマンスの向上、新しい言語機能の開発の加速、Kotlin がサポートするすべてのプラットフォームの統合、およびマルチプラットフォームプロジェクトのためのより優れたアーキテクチャが実現されます。

K2 は現在、すべてのターゲットにおいて**ベータ版**です。[詳細はリリースのブログ投稿をご覧ください](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### Kotlin/Wasm のサポート

本リリースより、Kotlin/Wasm は新しい K2 コンパイラをサポートします。[プロジェクトで有効にする方法についてはこちら](#how-to-enable-the-kotlin-k2-compiler)をご覧ください。

### K2 を使用した kapt コンパイラプラグインのプレビュー

> kapt コンパイラプラグインにおける K2 サポートは[実験的](components-stability.md)です。オプトインが必要です（詳細は後述）。評価目的でのみ使用してください。
>
{style="warning"}

1.9.20 では、K2 コンパイラで [kapt コンパイラプラグイン](kapt.md)を試用できます。プロジェクトで K2 コンパイラを使用するには、`gradle.properties` ファイルに以下のオプションを追加してください：

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

あるいは、以下の手順で kapt の K2 を有効にすることもできます：
1. `build.gradle.kts` ファイルで、[言語バージョンを `2.0` に設定](gradle-compiler-options.md#example-of-setting-languageversion)します。
2. `gradle.properties` ファイルに `kapt.use.k2=true` を追加します。

K2 コンパイラで kapt を使用する際に問題が発生した場合は、[課題トラッカー](http://kotl.in/issue)に報告してください。

### Kotlin K2 コンパイラを有効にする方法

#### Gradle で K2 を有効にする

Kotlin K2 コンパイラを有効にしてテストするには、以下のコンパイラオプションを使用して新しい言語バージョンを使用します：

```bash
-language-version 2.0
```

`build.gradle.kts` ファイルで指定できます：

```kotlin
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = "2.0"
        }
    }
}
```

#### Maven で K2 を有効にする

Kotlin K2 コンパイラを有効にしてテストするには、`pom.xml` ファイルの `<project/>` セクションを更新します：

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### IntelliJ IDEA で K2 を有効にする

IntelliJ IDEA で Kotlin K2 コンパイラを有効にしてテストするには、**Settings** | **Build, Execution, Deployment** | **Compiler** | **Kotlin Compiler** に移動し、**Language Version** フィールドを `2.0 (experimental)` に更新します。

### 新しい K2 コンパイラへのフィードバックをお寄せください

皆様からのフィードバックをお待ちしております！

* Kotlin Slack で K2 開発者に直接フィードバックを提供してください – [招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) して、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) チャンネルに参加してください。
* 新しい K2 コンパイラで直面した問題については、[課題トラッカー](https://kotl.in/issue)に報告してください。
* [使用統計の送信オプションを有効](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)にして、JetBrains が K2 の使用に関する匿名データを収集できるようにしてください。

## Kotlin/JVM

バージョン 1.9.20 以降、コンパイラは Java 21 バイトコードを含むクラスを生成できるようになります。

## Kotlin/Native

Kotlin 1.9.20 には、新しいメモリマロケーターがデフォルトで有効になった安定版のメモリマネージャー、ガベージコレクタのパフォーマンス向上、およびその他のアップデートが含まれています：

* [カスタムメモリマロケーターがデフォルトで有効に](#custom-memory-allocator-enabled-by-default)
* [ガベージコレクタのパフォーマンス向上](#performance-improvements-for-the-garbage-collector)
* [`klib` アーティファクトのインクリメンタルコンパイル](#incremental-compilation-of-klib-artifacts)
* [ライブラリのリンケージ問題の管理](#managing-library-linkage-issues)
* [クラスコンストラクタ呼び出し時のコンパニオンオブジェクトの初期化](#companion-object-initialization-on-class-constructor-calls)
* [すべての cinterop 宣言に対するオプトインの要求](#opt-in-requirement-for-all-cinterop-declarations)
* [リンカーエラーのカスタムメッセージ](#custom-message-for-linker-errors)
* [レガシーメモリマネージャーの削除](#removal-of-the-legacy-memory-manager)
* [ターゲットティア（Target Tiers）ポリシーの変更](#change-to-our-target-tiers-policy)

### カスタムメモリマロケーターがデフォルトで有効に

Kotlin 1.9.20 では、新しいメモリマロケーターがデフォルトで有効になっています。これは、ガベージコレクションをより効率的にし、[Kotlin/Native メモリマネージャー](native-memory-manager.md)の実行時パフォーマンスを向上させるために、以前のデフォルトアロケーターである `mimalloc` を置き換えるように設計されています。

新しいカスタムアロケーターはシステムメモリをページに分割し、連続した順序で独立したスイープ（一掃）を可能にします。各割り当てはページ内のメモリブロックとなり、ページがブロックサイズを追跡します。さまざまな割り当てサイズに合わせて最適化された異なるページタイプがあります。メモリブロックの連続した配置により、すべての割り当て済みブロックに対する効率的な反復処理が保証されます。

スレッドがメモリを割り当てる際、割り当てサイズに基づいて適切なページを検索します。スレッドは、異なるサイズカテゴリごとにページのセットを保持します。通常、特定のサイズの現在のページで割り当てに対応できます。対応できない場合、スレッドは共有アロケーションスペースから別のページを要求します。このページは、すでに利用可能であるか、スイープが必要であるか、あるいは最初に作成する必要がある場合があります。

新しいアロケーターでは、複数の独立したアロケーションスペースを同時に持つことができるため、Kotlin チームはパフォーマンスをさらに向上させるためにさまざまなページレイアウトを実験できるようになります。

#### カスタムメモリマロケーターを有効にする方法

Kotlin 1.9.20 以降、新しいメモリマロケーターがデフォルトになります。追加のセットアップは必要ありません。

メモリ消費量が多い場合は、Gradle ビルドスクリプトで `-Xallocator=mimalloc` または `-Xallocator=std` を使用して `mimalloc` またはシステムアロケーターに戻すことができます。新しいメモリマロケーターを改善するために、そのような問題は [YouTrack](https://kotl.in/issue) で報告してください。

新しいアロケーターの設計に関する技術的な詳細については、この [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md) を参照してください。

### ガベージコレクタのパフォーマンス向上

Kotlin チームは、新しい Kotlin/Native メモリマネージャーのパフォーマンスと安定性の向上を続けています。このリリースでは、ガベージコレクタ (GC) に多くの重要な変更が加えられており、1.9.20 のハイライトには以下が含まれます：

* [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### GC の休止時間を短縮するための完全並列マーク

以前は、デフォルトのガベージコレクタは部分的な並列マークのみを実行していました。ミューテーター（mutator）スレッドが休止されると、スレッドローカル変数やコールスタックなどの独自ルートから GC の開始をマークしていました。一方、別の GC スレッドが、グローバルルートおよび、ネイティブコードをアクティブに実行しており休止されていないすべてのミューテーターのルートからの開始のマークを担当していました。

このアプローチは、グローバルオブジェクトの数が限られており、ミューテータースレッドが Kotlin コードを実行する実行可能（runnable）状態でかなりの時間を費やす場合にはうまく機能しました。しかし、一般的な iOS アプリケーションではそうではありません。

現在、GC は休止されたミューテーター、GC スレッド、およびオプションのマーカースレッドを組み合わせてマークキューを処理する完全並列マークを使用します。デフォルトでは、マーキングプロセスは以下によって実行されます：

* 休止されたミューテーター。独自のルートを処理した後にコードをアクティブに実行していない間アイドル状態になるのではなく、マーキングプロセス全体に貢献します。
* GC スレッド。これにより、少なくとも 1 つのスレッドがマーキングを実行することが保証されます。

この新しいアプローチにより、マーキングプロセスがより効率的になり、GC の休止時間が短縮されます。

#### 割り当てパフォーマンス向上のための大きなチャンクでのメモリ追跡

以前は、GC スケジューラは各オブジェクトの割り当てを個別に追跡していました。しかし、新しいデフォルトのカスタムアロケーターも `mimalloc` メモリアロケーターも、オブジェクトごとに個別のストレージを割り当てるわけではなく、複数のオブジェクトに対して一度に大きな領域を割り当てます。

Kotlin 1.9.20 では、GC は個々のオブジェクトではなく領域を追跡します。これにより、各割り当てで実行されるタスクの数が減り、小さなオブジェクトの割り当てが高速化され、ガベージコレクタのメモリ使用量の最小化に役立ちます。

### klib アーティファクトのインクリメンタルコンパイル

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。オプトインが必要です（詳細は後述）。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.9.20 では、Kotlin/Native 用の新しいコンパイル時間最適化が導入されました。`klib` アーティファクトのネイティブコードへのコンパイルが、部分的にインクリメンタル（増分）になりました。

デバッグモードで Kotlin ソースコードをネイティブバイナリにコンパイルする場合、コンパイルは 2 つの段階を経ます：

1. ソースコードが `klib` アーティファクトにコンパイルされます。
2. `klib` アーティファクトが依存関係とともにバイナリにコンパイルされます。

第 2 段階のコンパイル時間を最適化するために、チームはすでに依存関係用のコンパイラキャッシュを実装しています。これらは一度だけネイティブコードにコンパイルされ、バイナリがコンパイルされるたびに結果が再利用されます。しかし、プロジェクトソースから構築された `klib` アーティファクトは、プロジェクトが変更されるたびに常に完全にネイティブコードに再コンパイルされていました。

新しいインクリメンタルコンパイルを使用すると、プロジェクトモジュールの変更によってソースコードが `klib` アーティファクトへ部分的にしか再コンパイルされない場合、その `klib` の一部だけがさらにバイナリへと再コンパイルされます。

インクリメンタルコンパイルを有効にするには、`gradle.properties` ファイルに以下のオプションを追加してください：

```none
kotlin.incremental.native=true
```

問題が発生した場合は、[YouTrack](https://kotl.in/issue) に報告してください。

### ライブラリのリンケージ問題の管理

このリリースでは、Kotlin/Native コンパイラが Kotlin ライブラリのリンケージ問題を処理する方法が改善されました。エラーメッセージにハッシュではなくシグネチャ名が使用されるようになり、より読みやすい宣言が含まれるようになったため、問題の特定と修正が容易になりました。例を挙げます：

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native コンパイラは、サードパーティの Kotlin ライブラリ間のリンケージ問題を検出し、実行時にエラーを報告します。あるサードパーティ Kotlin ライブラリの作成者が、別のサードパーティ Kotlin ライブラリが消費する実験的 API に互換性のない変更を加えた場合、このような問題に直面する可能性があります。

Kotlin 1.9.20 以降、コンパイラはデフォルトでサイレントモードでリンケージ問題を検出します。プロジェクトでこの設定を調整できます：

* コンパイルログにこれらの問題を記録したい場合は、`-Xpartial-linkage-loglevel=WARNING` コンパイラオプションを使用して警告を有効にします。
* 報告された警告の重大度を `-Xpartial-linkage-loglevel=ERROR` でコンパイルエラーに引き上げることも可能です。この場合、コンパイルは失敗し、コンパイルログにすべてのエラーが表示されます。このオプションを使用して、リンケージ問題をより詳しく調査してください。

```kotlin
// Gradle ビルドファイルでコンパイラオプションを渡す例：
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // リンケージ問題を警告として報告する場合：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // リンケージ警告をエラーに引き上げる場合：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

この機能で予期しない問題が発生した場合は、`-Xpartial-linkage=disable` コンパイラオプションを使用していつでもオプトアウトできます。そのような事例は遠慮なく[弊社の課題トラッカー](https://kotl.in/issue)に報告してください。

### クラスコンストラクタ呼び出し時のコンパニオンオブジェクトの初期化

Kotlin 1.9.20 以降、Kotlin/Native バックエンドはクラスコンストラクタ内でコンパニオンオブジェクトの静的初期化子（static initializers）を呼び出します：

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

この動作は Kotlin/JVM と統一されました。Kotlin/JVM では、Java の静的初期化子のセマンティクスに一致する対応するクラスがロード（解決）されたときに、コンパニオンオブジェクトが初期化されます。

この機能の実装がプラットフォーム間でより一貫したものになったため、Kotlin Multiplatform プロジェクトでのコード共有が容易になります。

### すべての cinterop 宣言に対するオプトインの要求

Kotlin 1.9.20 以降、libcurl や libxml などの C および Objective-C ライブラリから `cinterop` ツールによって生成されたすべての Kotlin 宣言に `@ExperimentalForeignApi` のマークが付きます。オプトインアノテーションがない場合、コードはコンパイルされません。

この要件は、C および Objective-C ライブラリのインポートの[実験的 (Experimental)](components-stability.md#stability-levels-explained) ステータスを反映したものです。プロジェクトの特定の領域にのみ使用を制限することをお勧めします。これにより、インポートの安定化が始まった際の移行が容易になります。

> Kotlin/Native とともに提供されるネイティブプラットフォームライブラリ（Foundation、UIKit、POSIX など）については、一部の API のみが `@ExperimentalForeignApi` によるオプトインを必要とします。そのような場合、オプトイン要件を伴う警告が表示されます。
>
{style="note"}

### リンカーエラーのカスタムメッセージ

ライブラリの作者であれば、カスタムメッセージを使用して、ユーザーがリンカーエラーを解決するのを助けることができるようになりました。

Kotlin ライブラリが C または Objective-C ライブラリに依存している場合（例：[CocoaPods 統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)を使用している場合）、そのユーザーはこれらの依存ライブラリをマシン上にローカルに持っているか、プロジェクトのビルドスクリプトで明示的に構成する必要があります。そうでない場合、ユーザーには紛らわしい "Framework not found" というメッセージが表示されていました。

コンパイル失敗メッセージに、具体的な指示やリンクを提供できるようになりました。これを行うには、`-Xuser-setup-hint` コンパイラオプションを `cinterop` に渡すか、`.def` ファイルに `userSetupHint=message` プロパティを追加します。

### レガシーメモリマネージャーの削除

[新しいメモリマネージャー](native-memory-manager.md)は Kotlin 1.6.20 で導入され、1.7.20 でデフォルトになりました。それ以来、継続的なアップデートとパフォーマンスの改善が行われ、安定版となりました。

非推奨サイクルを完了し、レガシーメモリマネージャーを削除する時が来ました。まだ使用している場合は、`gradle.properties` から `kotlin.native.binary.memoryModel=strict` オプションを削除し、[移行ガイド](native-migration-guide.md)に従って必要な変更を行ってください。

### ターゲットティア（Target Tiers）ポリシーの変更

[ティア 1 サポート](native-target-support.md#tier-1)の要件をアップグレードすることに決定しました。Kotlin チームは、ティア 1 に該当するターゲットについて、コンパイラリリース間でのソースおよびバイナリの互換性を提供することを約束します。また、コンパイルと実行が可能であることを確認するために、CI ツールで定期的にテストされる必要があります。現在、ティア 1 には macOS ホスト用の以下のターゲットが含まれています：

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

Kotlin 1.9.20 では、以前に非推奨となっていた以下の多数のターゲットも削除されました：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

現在[サポートされているターゲット](native-target-support.md)の全リストをご覧ください。

## Kotlin Multiplatform

Kotlin 1.9.20 は Kotlin Multiplatform の安定化に焦点を当てており、新しいプロジェクトウィザードやその他の注目すべき機能により、開発者体験を向上させるための新たなステップを踏み出しています：

* [Kotlin Multiplatform が安定版に](#kotlin-multiplatform-is-stable)
* [マルチプラットフォームプロジェクト構成のためのテンプレート](#template-for-configuring-multiplatform-projects)
* [新しいプロジェクトウィザード](#new-project-wizard)
* [Gradle 構成キャッシュの完全サポート](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Gradle での新しい標準ライブラリバージョンの構成が容易に](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [サードパーティ cinterop ライブラリのデフォルトサポート](#default-support-for-third-party-cinterop-libraries)
* [Compose Multiplatform プロジェクトにおける Kotlin/Native コンパイルキャッシュのサポート](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [互換性ガイドライン](#compatibility-guidelines)

### Kotlin Multiplatform が安定版に

1.9.20 リリースは Kotlin の進化における重要なマイルストーンとなります。[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) がついに安定版となりました。これは、このテクノロジーをプロジェクトで安全に使用でき、プロダクション環境への準備が 100% 整ったことを意味します。また、Kotlin Multiplatform の今後の開発は、当社の厳格な[後方互換性ルール](https://kotlinfoundation.org/language-committee-guidelines/)に従って継続されることも意味します。

Kotlin Multiplatform の一部の高度な機能はまだ進化中であることに注意してください。それらを使用する際は、使用している機能の現在の安定性ステータスを説明する警告が表示されます。IntelliJ IDEA で実験的な機能を使用する前に、**Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform** で明示的に有効にする必要があります。

* Kotlin Multiplatform の安定化と将来の計画の詳細については、[Kotlin ブログ](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)をご覧ください。
* 安定化への過程で行われた重要な変更については、[Multiplatform 互換性ガイド](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html)を確認してください。
* Kotlin Multiplatform の重要な部分であり、本リリースで部分的に安定化した [expected と actual 宣言のメカニズム](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)についてお読みください。

### マルチプラットフォームプロジェクト構成のためのテンプレート

Kotlin 1.9.20 以降、Kotlin Gradle プラグインは一般的なマルチプラットフォームシナリオに対して共有ソースセットを自動的に作成します。プロジェクトのセットアップがそれらのいずれかである場合、ソースセットの階層を手動で構成する必要はありません。プロジェクトに必要なターゲットを明示的に指定するだけです。

Kotlin Gradle プラグインの新機能であるデフォルト階層テンプレート（default hierarchy template）のおかげで、セットアップが簡単になりました。これはプラグインに組み込まれたソースセット階層の定義済みテンプレートです。これには、宣言したターゲットに対して Kotlin が自動的に作成する中間ソースセットが含まれます。[全テンプレートを見る](#see-the-full-hierarchy-template)。

#### プロジェクト作成がより簡単に

Android と iPhone の両方のデバイスをターゲットとし、Apple シリコンの MacBook で開発されているマルチプラットフォームプロジェクトを考えてみましょう。Kotlin のバージョン間で、このプロジェクトのセットアップがどのように異なるか比較してください：

<table>
   <tr>
       <td>Kotlin 1.9.0 以前（標準的なセットアップ）</td>
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

    // iosMain ソースセットは自動的に作成されます
}
```

</td>
</tr>
</table>

デフォルト階層テンプレートを使用することで、プロジェクトのセットアップに必要なボイラープレートコードが大幅に削減されていることがわかります。

コード内で `androidTarget`、`iosArm64`、および `iosSimulatorArm64` ターゲットを宣言すると、Kotlin Gradle プラグインはテンプレートから適切な共有ソースセットを見つけ、それらを自動的に作成します。結果として得られる階層は次のようになります：

![使用中のデフォルトターゲット階層の例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

緑色のソースセットは実際に作成されプロジェクトに含まれますが、デフォルトテンプレートの灰色のソースセットは無視されます。

#### ソースセットの補完機能の使用

作成されたプロジェクト構造を扱いやすくするため、IntelliJ IDEA はデフォルト階層テンプレートで作成されたソースセットの補完機能を提供するようになりました。

<img src="multiplatform-hierarchy-completion.animated.gif" alt="ソースセット名の IDE 補完" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

対応するターゲットを宣言していないために存在しないソースセットにアクセスしようとすると、Kotlin は警告を表示します。以下の例では、JVM ターゲットがありません（`androidTarget` のみで、これは同じではありません）。しかし、`jvmMain` ソースセットを使おうとするとどうなるか見てみましょう：

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

この場合、Kotlin はビルドログに警告を出力します：

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### ターゲット階層のセットアップ

Kotlin 1.9.20 以降、デフォルト階層テンプレートは自動的に有効になります。ほとんどの場合、追加のセットアップは必要ありません。

ただし、1.9.20 より前に作成された既存のプロジェクトを移行する場合、以前に `dependsOn()` 呼び出しで中間ソースを手動で導入していたとすると、警告が表示されることがあります。この問題を解決するには、以下を行ってください：

* 中間ソースセットが現在デフォルト階層テンプレートでカバーされている場合は、すべての手動の `dependsOn()` 呼び出し、および `by creating` 構文で作成されたソースセットを削除してください。

  すべてのデフォルトソースセットのリストを確認するには、[全階層テンプレート](#see-the-full-hierarchy-template)を参照してください。

* デフォルト階層テンプレートが提供しない追加のソースセット（例えば、macOS と JVM ターゲット間でコードを共有するものなど）が必要な場合は、`applyDefaultHierarchyTemplate()` でテンプレートを明示的に再適用し、通常通り `dependsOn()` で追加のソースセットを手動で構成することで階層を調整してください：

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // デフォルト階層を明示的に適用します。これにより、例えば iosMain ソースセットが作成されます：
      applyDefaultHierarchyTemplate()

      sourceSets {
          // 追加の jvmAndMacos ソースセットを作成します
          val jvmAndMacos by creating {
              dependsOn(commonMain.get())
          }

          macosArm64Main.get().dependsOn(jvmAndMacos)
          jvmMain.get().dependsOn(jvmAndMacos)
      }
  }
  ```

* プロジェクト内にテンプレートによって生成されるものとまったく同じ名前のソースセットがすでにあるが、それらが異なるターゲットセット間で共有されている場合、現在、テンプレートのソースセット間のデフォルトの `dependsOn` 関係を変更する方法はありません。

  ここでの 1 つの選択肢は、デフォルト階層テンプレート内または手動で作成されたもののいずれかから、目的に合った別のソースセットを見つけることです。もう 1 つは、テンプレートから完全にオプトアウトすることです。

  オプトアウトするには、`gradle.properties` に `kotlin.mpp.applyDefaultHierarchyTemplate=false` を追加し、他のすべてのソースセットを手動で構成してください。

  現在、このような場合のセットアッププロセスを簡素化するために、独自の階層テンプレートを作成するための API に取り組んでいます。

#### 全階層テンプレートを表示する {initial-collapse-state="collapsed" collapsible="true"}

プロジェクトがコンパイルされるターゲットを宣言すると、プラグインはそれに応じてテンプレートから共有ソースセットを選択し、プロジェクト内に作成します。

![デフォルト階層テンプレート](full-template-hierarchy.svg)

> この例はプロジェクトのプロダクション部分のみを示しており、`Main` サフィックスを省略しています（例：`commonMain` の代わりに `common` を使用）。ただし、`*Test` ソースについてもすべて同様です。
>
{style="tip"}

### 新しいプロジェクトウィザード

JetBrains チームは、クロスプラットフォームプロジェクトを作成する新しい方法として、[Kotlin Multiplatform Web ウィザード](https://kmp.jetbrains.com)を導入します。

この新しい Kotlin Multiplatform ウィザードの最初の実装は、最も一般的な Kotlin Multiplatform のユースケースをカバーしています。これまでのプロジェクトテンプレートに関するすべてのフィードバックを取り入れ、アーキテクチャを可能な限り堅牢で信頼性の高いものにしています。

新しいウィザードは、統一されたバックエンドとさまざまなフロントエンドを持つことができる分散型アーキテクチャを採用しており、Web バージョンはその第一歩です。将来的には、IDE バージョンの実装とコマンドラインツールの作成の両方を検討しています。Web では常に最新バージョンのウィザードを利用できますが、IDE では次のリリースを待つ必要があります。

新しいウィザードを使えば、プロジェクトのセットアップはこれまで以上に簡単になります。モバイル、サーバー、デスクトップ開発のターゲットプラットフォームを選択することで、ニーズに合わせてプロジェクトをカスタマイズできます。今後のリリースでは Web 開発も追加する予定です。

<img src="multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

新しいプロジェクトウィザードは、Kotlin でクロスプラットフォームプロジェクトを作成するための推奨される方法となりました。1.9.20 以降、Kotlin プラグインは IntelliJ IDEA で **Kotlin Multiplatform** プロジェクトウィザードを提供しなくなりました。

新しいウィザードは初期セットアップを簡単にガイドし、オンボーディングプロセスをよりスムーズにします。問題が発生した場合は、ウィザードの体験を改善するために [YouTrack](https://kotl.in/issue) に報告してください。

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="Create a project" style="block"/>
</a>

### Kotlin Multiplatform における Gradle 構成キャッシュの完全サポート

以前、Kotlin マルチプラットフォームライブラリで利用可能だった Gradle 構成キャッシュの[プレビュー](whatsnew19.md#preview-of-the-gradle-configuration-cache)を導入しました。1.9.20 では、Kotlin Multiplatform プラグインはさらに一歩前進しました。

[Kotlin CocoaPods Gradle プラグイン](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)に加え、`embedAndSignAppleFrameworkForXcode` のように Xcode ビルドに必要な統合タスクでも、Gradle 構成キャッシュをサポートするようになりました。

これで、すべてのマルチプラットフォームプロジェクトでビルド時間の短縮というメリットを享受できます。Gradle 構成キャッシュは、構成フェーズの結果を後続のビルドで再利用することで、ビルドプロセスを高速化します。詳細とセットアップ手順については、[Gradle ドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)を参照してください。

### Gradle での新しい標準ライブラリバージョンの構成が容易に

マルチプラットフォームプロジェクトを作成すると、標準ライブラリ (`stdlib`) への依存関係が各ソースセットに自動的に追加されます。これは、マルチプラットフォームプロジェクトを開始する最も簡単な方法です。

以前は、標準ライブラリへの依存関係を手動で構成したい場合、各ソースセットに対して個別に構成する必要がありました。`kotlin-stdlib:1.9.20` 以降、`commonMain` ルートソースセットで **1 回** 構成するだけでよくなります：

<table>
   <tr>
       <td>標準ライブラリバージョン 1.9.10 以前</td>
       <td>標準ライブラリバージョン 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // 共通ソースセット用
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // JVM ソースセット用
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // JS ソースセット用
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

この変更は、標準ライブラリの Gradle メタデータに新しい情報を含めることで可能になりました。これにより、Gradle は他のソースセットに対して正しい標準ライブラリアーティファクトを自動的に解決できます。

### サードパーティ cinterop ライブラリのデフォルトサポート

Kotlin 1.9.20 では、[Kotlin CocoaPods Gradle](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) プラグインが適用されているプロジェクトにおいて、すべての cinterop 依存関係に対してデフォルトのサポート（オプトインによるサポートではなく）が追加されました。

これにより、プラットフォーム固有の依存関係に制限されることなく、より多くのネイティブコードを共有できるようになります。例えば、`iosMain` 共有ソースセットに [Pod ライブラリへの依存関係](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)を追加できます。

以前は、これは Kotlin/Native ディストリビューションに同梱されている[プラットフォーム固有のライブラリ](native-platform-libs.md)（Foundation、UIKit、POSIX など）でのみ機能していました。現在は、すべてのサードパーティ Pod ライブラリがデフォルトで共有ソースセットで利用可能です。それらをサポートするために別途 Gradle プロパティを指定する必要はもうありません。

### Compose Multiplatform プロジェクトにおける Kotlin/Native コンパイルキャッシュのサポート

本リリースでは、主に iOS 用の Compose Multiplatform プロジェクトに影響を与えていた Compose Multiplatform コンパイラプラグインとの互換性の問題が解決されました。

この問題を回避するには、`kotlin.native.cacheKind=none` という Gradle プロパティを使用してキャッシュを無効にする必要がありました。しかし、この回避策にはパフォーマンス上のコストがかかりました。Kotlin/Native コンパイラでキャッシュが機能しないため、コンパイル時間が遅くなっていたのです。

問題が修正されたため、`gradle.properties` ファイルから `kotlin.native.cacheKind=none` を削除し、Compose Multiplatform プロジェクトでのコンパイル時間の改善を享受できます。

コンパイル時間を改善するためのその他のヒントについては、[Kotlin/Native ドキュメント](native-improving-compilation-time.md)を参照してください。

### 互換性ガイドライン

プロジェクトを構成する際は、Kotlin Multiplatform Gradle プラグインと、利用可能な Gradle、Xcode、および Android Gradle プラグイン (AGP) バージョンとの互換性を確認してください：

| Kotlin Multiplatform Gradle プラグイン | Gradle | Android Gradle プラグイン | Xcode |
|---------------------------|------|----|----|
| 1.9.20        | 7.5 以降 | 7.4.2–8.2 | 15.0. 詳細は後述 |

本リリースの時点で、推奨される Xcode のバージョンは 15.0 です。Xcode 15.0 で提供されるライブラリは完全にサポートされており、Kotlin コードのどこからでもアクセスできます。

ただし、Xcode 14.3 もほとんどの場合動作するはずです。ローカルマシンでバージョン 14.3 を使用している場合、Xcode 15 で提供されるライブラリは表示されますが、アクセスはできないことに注意してください。

## Kotlin/Wasm

1.9.20 において、Kotlin Wasm は安定性の [Alpha レベル](components-stability.md)に到達しました。

* [Wasm GC フェーズ 4 および最終オペコードとの互換性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
* [新しい `wasm-wasi` ターゲット、および `wasm` ターゲットの `wasm-js` への名称変更](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [標準ライブラリでの WASI API サポート](#support-for-the-wasi-api-in-the-standard-library)
* [Kotlin/Wasm API の改善](#kotlin-wasm-api-improvements)

> Kotlin Wasm は [Alpha](components-stability.md) です。
> いつでも変更される可能性があります。評価目的でのみ使用してください。
>
> [YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="note"}

### Wasm GC フェーズ 4 および最終オペコードとの互換性

Wasm GC は最終フェーズに移行しており、バイナリ表現で使用される定数番号であるオペコード（opcodes）の更新が必要です。Kotlin 1.9.20 は最新のオペコードをサポートしているため、Wasm プロジェクトを最新バージョンの Kotlin に更新することを強くお勧めします。また、Wasm 環境を備えた最新バージョンのブラウザを使用することもお勧めします：
* Chrome および Chromium ベースのブラウザの場合はバージョン 119 以降。
* Firefox の場合はバージョン 119 以降。Firefox 119 では、[手動で Wasm GC をオンにする](wasm-configuration.md)必要があることに注意してください。

### 新しい wasm-wasi ターゲット、および wasm ターゲットの wasm-js への名称変更

本リリースでは、Kotlin/Wasm の新しいターゲットとして `wasm-wasi` を導入します。また、`wasm` ターゲットを `wasm-js` に名称変更します。Gradle DSL では、これらのターゲットはそれぞれ `wasmWasi {}` および `wasmJs {}` として利用可能です。

プロジェクトでこれらのターゲットを使用するには、`build.gradle.kts` ファイルを更新してください：

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

以前導入された `wasm {}` ブロックは、`wasmJs {}` を推奨するため非推奨となりました。

既存の Kotlin/Wasm プロジェクトを移行するには、以下を行ってください：
* `build.gradle.kts` ファイルで、`wasm {}` ブロックを `wasmJs {}` に変更します。
* プロジェクト構造で、`wasmMain` ディレクトリを `wasmJsMain` に変更します。

### 標準ライブラリでの WASI API サポート

本リリースでは、Wasm プラットフォーム用のシステムインターフェースである [WASI](https://github.com/WebAssembly/WASI) のサポートが含まれています。WASI サポートにより、システムリソースにアクセスするための標準化された API セットを提供することで、ブラウザ以外の場所（サーバーサイドアプリケーションなど）で Kotlin/Wasm を使用することが容易になります。さらに、WASI は外部リソースにアクセスする際のもう一つのセキュリティ層である、ケイパビリティベース（capability-based）のセキュリティを提供します。

Kotlin/Wasm アプリケーションを実行するには、Node.js や Deno など、Wasm ガベージコレクション (GC) をサポートする VM が必要です。Wasmtime、WasmEdge などは、依然として完全な Wasm GC サポートに向けて取り組んでいる最中です。

WASI 関数をインポートするには、`@WasmImport` アノテーションを使用します：

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[GitHub リポジトリで完全な例を確認できます](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)。

> `wasmWasi` をターゲットにする場合、[JavaScript との相互運用](wasm-js-interop.md)を使用することはできません。
>
{style="note"}

### Kotlin/Wasm API の改善

このリリースでは、Kotlin/Wasm API に対していくつかの使い勝手の向上（quality-of-life improvements）が行われました。例えば、DOM イベントリスナーで値を返す必要がなくなりました：

<table>
   <tr>
       <td>1.9.20 より前</td>
       <td>1.9.20 以降</td>
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

Kotlin 1.9.20 は、Gradle 6.8.3 から 8.1 までと完全に互換性があります。最新の Gradle リリースまでのバージョンも使用できますが、その場合、非推奨の警告が表示されたり、一部の新しい Gradle 機能が動作しなかったりする可能性があることに注意してください。

このバージョンでは以下の変更が行われました：
* [internal 宣言にアクセスするためのテストフィクスチャのサポート](#support-for-test-fixtures-to-access-internal-declarations)
* [Konan ディレクトリへのパスを構成するための新しいプロパティ](#new-property-to-configure-paths-to-konan-directories)
* [Kotlin/Native タスクの新しいビルドレポートメトリクス](#new-build-report-metrics-for-kotlin-native-tasks)

### internal 宣言にアクセスするためのテストフィクスチャのサポート

Kotlin 1.9.20 では、Gradle の `java-test-fixtures` プラグインを使用している場合、[テストフィクスチャ (test fixtures)](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) がメインソースセットのクラス内の `internal` 宣言にアクセスできるようになりました。さらに、任意のテストソースからも、テストフィクスチャクラス内の `internal` 宣言を参照できるようになりました。

### Konan ディレクトリへのパスを構成するための新しいプロパティ

Kotlin 1.9.20 では、`~/.konan` ディレクトリへのパスをカスタマイズするための `konan.data.dir` Gradle プロパティが利用可能になりました。これにより、環境変数 `KONAN_DATA_DIR` を通じて構成する必要がなくなります。

あるいは、`-Xkonan-data-dir` コンパイラオプションを使用して、`cinterop` および `konanc` ツールを介して `~/.konan` ディレクトリへのカスタムパスを構成することもできます。

### Kotlin/Native タスクの新しいビルドレポートメトリクス

Kotlin 1.9.20 では、Gradle ビルドレポートに Kotlin/Native タスクのメトリクスが含まれるようになりました。以下は、これらのメトリクスを含むビルドレポートの例です：

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

さらに、`kotlin.experimental.tryK2` ビルドレポートに、コンパイルされた Kotlin/Native タスクと使用された言語バージョンが含まれるようになりました：

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

> Gradle 8.0 を使用している場合、特に Gradle 構成キャッシュが有効なときに、ビルドレポートでいくつかの問題が発生する可能性があります。これは既知の問題であり、Gradle 8.1 以降で修正されています。
>
{style="note"}

## 標準ライブラリ

Kotlin 1.9.20 では、[Kotlin/Native 標準ライブラリが安定版](#the-kotlin-native-standard-library-becomes-stable)になり、いくつかの新機能があります：
* [Enum クラスの values ジェネリック関数の置き換え](#replacement-of-the-enum-class-values-generic-function)
* [Kotlin/JS における HashMap 操作のパフォーマンス向上](#improved-performance-of-hashmap-operations-in-kotlin-js)

### Enum クラスの values ジェネリック関数の置き換え

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。オプトインが必要です（詳細は後述）。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.9.0 では、enum クラスの `entries` プロパティが安定版になりました。`entries` プロパティは、合成関数 `values()` に代わる、モダンでパフォーマンスの高い代替手段です。Kotlin 1.9.20 の一部として、ジェネリック関数 `enumValues<T>()` の代替となる `enumEntries<T>()` が導入されました。

> `enumValues<T>()` 関数は引き続きサポートされますが、パフォーマンスへの影響が少ない `enumEntries<T>()` 関数を使用することをお勧めします。`enumValues<T>()` を呼び出すたびに新しい配列が作成されるのに対し、`enumEntries<T>()` を呼び出すたびに常に同じリストが返されるため、はるかに効率的です。
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

#### enumEntries 関数の有効化方法

この機能を試すには、`@OptIn(ExperimentalStdlibApi)` でオプトインし、言語バージョン 1.9 以降を使用してください。最新バージョンの Kotlin Gradle プラグインを使用している場合、機能をテストするために言語バージョンを指定する必要はありません。

### Kotlin/Native 標準ライブラリが安定版に

Kotlin 1.9.0 では、Kotlin/Native 標準ライブラリを安定化という目標に近づけるために行った[取り組みについて説明](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization)しました。Kotlin 1.9.20 では、ついにこの作業が完了し、Kotlin/Native 標準ライブラリが安定版となりました。本リリースのハイライトは以下の通りです：

* [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/) クラスが `kotlin.native` パッケージから `kotlinx.cinterop` パッケージに移動されました。
* Kotlin 1.9.0 で導入された `ExperimentalNativeApi` および `NativeRuntimeApi` アノテーションのオプトイン要求レベルが `WARNING` から `ERROR` に引き上げられました。
* Kotlin/Native コレクション（[`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/) や [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/) など）が並行修正を検出するようになりました。
* `Throwable` クラスの [`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html) 関数が、`STDOUT` ではなく `STDERR` に出力するようになりました。
  > `printStackTrace()` の出力形式は安定しておらず、変更される可能性があります。
  >
  {style="warning"}

#### Atomics API の改善

Kotlin 1.9.0 では、Kotlin/Native 標準ライブラリが安定版になったときに、Atomics API も安定版にする準備が整うとお伝えしました。Kotlin 1.9.20 では、以下の追加の変更が含まれています：

* 実験的な `AtomicIntArray`、`AtomicLongArray`、および `AtomicArray<T>` クラスが導入されました。これらの新しいクラスは、将来的に共通標準ライブラリに含めることができるよう、Java のアトミック配列と一貫性を持たせるように特別に設計されています。
  > `AtomicIntArray`、`AtomicLongArray`、および `AtomicArray<T>` クラスは[実験的](components-stability.md#stability-levels-explained)です。いつでも変更または廃止される可能性があります。これらを試すには、`@OptIn(ExperimentalStdlibApi)` でオプトインしてください。評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。
  >
  {style="warning"}
* `kotlin.native.concurrent` パッケージにおいて、Kotlin 1.9.0 で非推奨レベル `WARNING` とされていた Atomics API の非推奨レベルが `ERROR` に引き上げられました。
* `kotlin.concurrent` パッケージにおいて、非推奨レベル `ERROR` であった [`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html) および [`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html) クラスのメンバ関数が削除されました。
* `AtomicReference` クラスのすべての[メンバ関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions)が、アトミックな組み込み関数（atomic intrinsic functions）を使用するようになりました。

Kotlin 1.9.20 におけるすべての変更の詳細については、当社の [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)を参照してください。

### Kotlin/JS における HashMap 操作のパフォーマンス向上

Kotlin 1.9.20 では、Kotlin/JS における `HashMap` 操作のパフォーマンスが向上し、メモリフットプリントが削減されました。内部的に、Kotlin/JS は内部実装をオープンアドレッシング（open addressing）に変更しました。これにより、以下の操作でパフォーマンスの向上が見られるはずです：
* `HashMap` への新しい要素の挿入。
* `HashMap` 内の既存要素の検索。
* `HashMap` のキーまたは値の反復処理。

## ドキュメントの更新

Kotlin ドキュメントにいくつかの注目すべき変更が加えられました：
* [JVM Metadata](https://kotlinlang.org/api/kotlinx-metadata-jvm/) API リファレンス – Kotlin/JVM でメタデータを解析する方法を確認できます。
* [時間計測ガイド](time-measurement.md) – Kotlin で時間を計算および計測する方法を学べます。
* [Kotlin ツアー](kotlin-tour-welcome.md)のコレクションの章の改善 – 理論と実践の両方を含む章で Kotlin プログラミング言語の基礎を学べます。
* [限定的に null 非許容な型（Definitely non-nullable types）](generics.md#definitely-non-nullable-types) – 限定的に null 非許容なジェネリック型について学べます。
* [配列ページ](arrays.md)の改善 – 配列とその使用時期について学べます。
* [Kotlin Multiplatform における expected と actual 宣言](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) – Kotlin Multiplatform における Kotlin の expected と actual 宣言のメカニズムについて学べます。

## Kotlin 1.9.20 のインストール

### IDE バージョンの確認

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x および 2023.2.x は、Kotlin プラグインをバージョン 1.9.20 に更新することを自動的に提案します。IntelliJ IDEA 2023.3 には Kotlin 1.9.20 プラグインが含まれます。

Android Studio Hedgehog (231) および Iguana (232) は、今後のリリースで Kotlin 1.9.20 をサポートする予定です。

新しいコマンドラインコンパイラは、[GitHub リリースページ](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20)からダウンロード可能です。

### Gradle 設定の構成

Kotlin のアーティファクトと依存関係をダウンロードするには、`settings.gradle(.kts)` ファイルを更新して Maven Central リポジトリを使用するようにしてください：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

リポジトリが指定されていない場合、Gradle は廃止予定の JCenter リポジトリを使用するため、Kotlin アーティファクトで問題が発生する可能性があります。