---
title: "Kotlin 1.9.20の新機能"
---
_[公開日: 2023年11月1日](releases#release-details)_

Kotlin 1.9.20 がリリースされました。[すべてのターゲットに対応した K2 コンパイラーがベータ版になりました](#new-kotlin-k2-compiler-updates)。
また、[Kotlin Multiplatform が Stable になりました](#kotlin-multiplatform-is-stable)。主なハイライトを以下に示します。

* [マルチプラットフォームプロジェクトをセットアップするための新しいデフォルト階層テンプレート](#template-for-configuring-multiplatform-projects)
* [Kotlin Multiplatform での Gradle 構成キャッシュの完全サポート](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Kotlin/Native でデフォルトで有効になっているカスタムメモリアロケーター](#custom-memory-allocator-enabled-by-default)
* [Kotlin/Native のガベージコレクターのパフォーマンス改善](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasm の新しいターゲットとターゲット名の変更](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Kotlin/Wasm の標準ライブラリでの WASI API のサポート](#support-for-the-wasi-api-in-the-standard-library)

この動画でアップデートの概要をご覧いただけます。

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

## IDE サポート

1.9.20 をサポートする Kotlin プラグインは、以下で使用できます。

| IDE            | サポートされているバージョン                     |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |
:::note
IntelliJ IDEA 2023.3.x および Android Studio Iguana (2023.2.1) Canary 15 以降、Kotlin プラグインは自動的に
含まれ、更新されます。必要なのは、プロジェクトで Kotlin のバージョンを更新することだけです。

:::

## New Kotlin K2 compiler updates（新しい Kotlin K2 コンパイラーのアップデート）

JetBrains の Kotlin チームは、新しい K2 コンパイラーの安定化を続けています。これにより、パフォーマンスが大幅に向上し、
新しい言語機能の開発が加速され、Kotlin がサポートするすべてのプラットフォームが統合され、より優れたアーキテクチャが提供されます。
マルチプラットフォームプロジェクト用です。

K2 は現在、すべてのターゲットで **ベータ** 版です。[リリースブログ記事で詳細をご覧ください](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### Kotlin/Wasm のサポート

今回のリリースから、Kotlin/Wasm は新しい K2 コンパイラーをサポートします。
[プロジェクトで有効にする方法をご覧ください](#how-to-enable-the-kotlin-k2-compiler)。

### K2 を使用した kapt compiler plugin（kapt コンパイラープラグイン）のプレビュー

:::note
kapt compiler plugin（kapt コンパイラープラグイン）での K2 のサポートは[試験的](components-stability)です。
オプトインが必要です（詳細は下記を参照）。評価目的でのみ使用してください。

1.9.20 では、K2 コンパイラーで [kapt compiler plugin](kapt) を試すことができます。
プロジェクトで K2 コンパイラーを使用するには、次のオプションを `gradle.properties` ファイルに追加します。

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

または、次の手順を完了して、kapt で K2 を有効にすることもできます。
1. `build.gradle.kts` ファイルで、[言語バージョンを設定](gradle-compiler-options#example-of-setting-languageversion) を `2.0` にします。
2. `gradle.properties` ファイルに、`kapt.use.k2=true` を追加します。

K2 コンパイラーで kapt を使用するときに問題が発生した場合は、
[課題追跡ツール](http://kotl.in/issue)に報告してください。

### How to enable the Kotlin K2 compiler（Kotlin K2 コンパイラーを有効にする方法）

#### Enable K2 in Gradle（Gradle で K2 を有効にする）

Kotlin K2 コンパイラーを有効にしてテストするには、次のコンパイラーオプションで新しい言語バージョンを使用します。

```bash
-language-version 2.0
```

`build.gradle.kts` ファイルで指定できます。

```kotlin
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = "2.0"
        }
    }
}
```

#### Enable K2 in Maven（Maven で K2 を有効にする）

Kotlin K2 コンパイラーを有効にしてテストするには、`pom.xml` ファイルの `<project/>` セクションを更新します。

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### Enable K2 in IntelliJ IDEA（IntelliJ IDEA で K2 を有効にする）

IntelliJ IDEA で Kotlin K2 コンパイラーを有効にしてテストするには、**Settings** | **Build, Execution, Deployment** |
**Compiler** | **Kotlin Compiler** に移動し、**Language Version** フィールドを `2.0 (experimental)` に更新します。

### Leave your feedback on the new K2 compiler（新しい K2 コンパイラーに関するフィードバックをお寄せください）

皆様からのフィードバックをお待ちしております。

* Kotlin で K2 開発者に直接フィードバックを提供する
  Slack – [招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  そして [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) チャンネルに参加してください。
* 新しい K2 コンパイラーで直面した問題を報告する
  [課題追跡ツール](https://kotl.in/issue)で報告してください。
* [Send usage statistics option（使用状況統計を送信するオプション）を有効にする](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)
  JetBrains が K2 の使用に関する匿名データを収集できるようにします。

## Kotlin/JVM

バージョン 1.9.20 以降、コンパイラーは Java 21 バイトコードを含むクラスを生成できます。

## Kotlin/Native

Kotlin 1.9.20 には、新しいメモリアロケーターがデフォルトで有効になっている Stable メモリマネージャー、ガベージコレクターのパフォーマンス改善、その他のアップデートが含まれています。

* [カスタムメモリアロケーターがデフォルトで有効](#custom-memory-allocator-enabled-by-default)
* [ガベージコレクターのパフォーマンス改善](#performance-improvements-for-the-garbage-collector)
* [`klib`アーティファクトのインクリメンタルコンパイル](#incremental-compilation-of-klib-artifacts)
* [ライブラリリンケージの問題の管理](#managing-library-linkage-issues)
* [クラスコンストラクター呼び出しでのコンパニオンオブジェクトの初期化](#companion-object-initialization-on-class-constructor-calls)
* [すべての cinterop 宣言に対するオプトイン要件](#opt-in-requirement-for-all-cinterop-declarations)
* [リンカーエラーのカスタムメッセージ](#custom-message-for-linker-errors)
* [レガシーメモリマネージャーの削除](#removal-of-the-legacy-memory-manager)
* [ターゲット層ポリシーの変更](#change-to-our-target-tiers-policy)

### Custom memory allocator enabled by default（カスタムメモリアロケーターがデフォルトで有効）

Kotlin 1.9.20 には、新しいメモリアロケーターがデフォルトで有効になっています。これは、以前のデフォルトアロケーターである
`mimaloc` を置き換え、ガベージコレクションをより効率的にし、[Kotlin/Native メモリマネージャー](native-memory-manager)のランタイムパフォーマンスを向上させるように設計されています。

新しいカスタムアロケーターは、システムメモリをページに分割し、連続した順序で独立したスイープを可能にします。
各割り当てはページ内のメモリーブロックになり、ページはブロックサイズを追跡します。
さまざまなページタイプがさまざまな割り当てサイズに最適化されています。
メモリーブロックの連続した配置により、割り当てられたすべてのブロックを効率的に反復処理できます。

スレッドがメモリを割り当てる場合、割り当てサイズに基づいて適切なページを検索します。
スレッドは、さまざまなサイズカテゴリのページのセットを維持します。
通常、特定のサイズの現在のページは割り当てに対応できます。
そうでない場合、スレッドは共有割り当てスペースから別のページを要求します。
このページは、すでに使用可能であるか、スイープが必要であるか、最初に作成する必要があります。

新しいアロケーターを使用すると、複数の独立した割り当てスペースを同時に使用できます。
これにより、Kotlin チームはパフォーマンスをさらに向上させるために、さまざまなページレイアウトを試すことができます。

#### How to enable the custom memory allocator（カスタムメモリアロケーターを有効にする方法）

Kotlin 1.9.20 以降、新しいメモリアロケーターがデフォルトです。追加のセットアップは必要ありません。

メモリ消費量が多い場合は、Gradle ビルドスクリプトで `-Xallocator=mimalloc` を使用して `mimaloc` またはシステムアロケーターに切り替えることができます。
または `-Xallocator=std` を使用します。新しいメモリアロケーターの改善にご協力いただくために、[YouTrack](https://kotl.in/issue)でこのような問題を報告してください。

新しいアロケーターの設計の技術的な詳細については、[README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README) を参照してください。

### Performance improvements for the garbage collector（ガベージコレクターのパフォーマンス改善）

Kotlin チームは、新しい Kotlin/Native メモリマネージャーのパフォーマンスと安定性の向上に引き続き取り組んでいます。
今回のリリースでは、次の 1.9.20 のハイライトを含む、ガベージコレクター (GC) に多くの重要な変更が加えられています。

* [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### Full parallel mark to reduce the pause time for the GC（GC の一時停止時間を短縮するための完全並列マーク）

以前は、デフォルトのガベージコレクターは部分的な並列マークのみを実行していました。ミューテータースレッドが一時停止すると、
スレッドローカル変数やコールスタックなどの独自のルートから GC の開始をマークします。
一方、別の GC スレッドは、グローバルルートからの開始と、ネイティブコードをアクティブに実行していて一時停止されていないすべてのミューテーターのルートをマークする役割を担っていました。

このアプローチは、グローバルオブジェクトの数が限られており、ミューテータースレッドが Kotlin コードを実行する実行可能状態でかなりの時間を費やしている場合にはうまく機能しました。ただし、これは一般的な iOS アプリケーションには当てはまりません。

GC は、一時停止されたミューテーター、GC スレッド、およびオプションのマーカースレッドを組み合わせてマークキューを処理する完全並列マークを使用します。デフォルトでは、マーキングプロセスは以下によって実行されます。

* 一時停止されたミューテーター。独自のルートを処理してから、コードをアクティブに実行せずにアイドル状態になる代わりに、
マーキングプロセス全体に貢献します。
* GC スレッド。これにより、少なくとも 1 つのスレッドがマーキングを実行することが保証されます。

この新しいアプローチにより、マーキングプロセスがより効率的になり、GC の一時停止時間が短縮されます。

#### Tracking memory in big chunks to improve the allocation performance（大きなチャンクでメモリを追跡して割り当てパフォーマンスを向上させる）

以前は、GC スケジューラーは各オブジェクトの割り当てを個別に追跡していました。ただし、新しいデフォルトのカスタム
アロケーターも `mimalloc` メモリアロケーターも、各オブジェクトに個別のストレージを割り当てません。一度に複数のオブジェクトに対して大きな領域を割り当てます。

Kotlin 1.9.20 では、GC は個々のオブジェクトの代わりに領域を追跡します。これにより、各割り当てで実行されるタスクの数を減らすことで、小さなオブジェクトの割り当てが高速化されます。
したがって、ガベージコレクターのメモリ使用量を最小限に抑えるのに役立ちます。

### Incremental compilation of klib artifacts（klib アーティファクトのインクリメンタルコンパイル）

この機能は[試験的](components-stability#stability-levels-explained)です。
いつでも削除または変更される可能性があります。オプトインが必要です（詳細は下記を参照）。
評価目的でのみ使用してください。[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしております。

Kotlin 1.9.20 では、Kotlin/Native の新しいコンパイル時間最適化が導入されています。
`klib` アーティファクトからネイティブコードへのコンパイルは、部分的にインクリメンタルになりました。

Kotlin ソースコードをデバッグモードでネイティブバイナリにコンパイルすると、コンパイルは 2 つの段階を経ます。

1. ソースコードは `klib` アーティファクトにコンパイルされます。
2. `klib` アーティファクトは、依存関係とともにバイナリにコンパイルされます。

2 番目の段階でコンパイル時間を最適化するために、チームはすでに依存関係のコンパイラーキャッシュを実装しています。
ネイティブコードへのコンパイルは 1 回のみで、バイナリがコンパイルされるたびに結果が再利用されます。
ただし、プロジェクトソースから構築された `klib` アーティファクトは、プロジェクトが変更されるたびに常にネイティブコードに完全に再コンパイルされていました。

新しいインクリメンタルコンパイルでは、プロジェクトモジュールの変更によりソースコードから `klib`
アーティファクトへの部分的な再コンパイルのみが発生する場合、`klib` の一部のみがさらにバイナリに再コンパイルされます。

インクリメンタルコンパイルを有効にするには、次のオプションを `gradle.properties` ファイルに追加します。

```none
kotlin.incremental.native=true
```

問題が発生した場合は、[YouTrack](https://kotl.in/issue)に報告してください。

### Managing library linkage issues（ライブラリリンケージの問題の管理）

今回のリリースでは、Kotlin/Native コンパイラーによる Kotlin ライブラリのリンケージの問題の処理方法が改善されています。エラーメッセージに、ハッシュの代わりに署名名を使用する、より読みやすい宣言が含まれるようになり、問題をより簡単に見つけて修正できます。次に例を示します。

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native コンパイラーは、サードパーティの Kotlin ライブラリ間のリンケージの問題を検出し、実行時にエラーを報告します。サードパーティの Kotlin ライブラリの作成者が、別のサードパーティの Kotlin ライブラリが使用する試験的な API で互換性のない変更を加えた場合、このような問題が発生する可能性があります。

Kotlin 1.9.20 以降、コンパイラーはデフォルトでサイレントモードでリンケージの問題を検出します。プロジェクトでこの設定を調整できます。

* これらの問題をコンパイルログに記録する場合は、`-Xpartial-linkage-loglevel=WARNING` コンパイラーオプションを使用して警告を有効にします。
* `-Xpartial-linkage-loglevel=ERROR` を使用して、報告された警告の重大度をコンパイルエラーに上げることもできます。
この場合、コンパイルは失敗し、コンパイルログにすべてのエラーが表示されます。このオプションを使用して、リンケージの問題をより詳しく調べます。

```kotlin
// Gradle ビルドファイルでコンパイラーオプションを渡す例：
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // リンケージの問題を警告として報告するには：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // リンケージ警告をエラーに上げるには：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

この機能で予期しない問題が発生した場合は、`-Xpartial-linkage=disable` コンパイラーオプションを使用していつでもオプトアウトできます。[課題追跡ツール](https://kotl.in/issue)にこのようなケースを報告することを躊躇しないでください。

### Companion object initialization on class constructor calls（クラスコンストラクター呼び出しでのコンパニオンオブジェクトの初期化）

Kotlin 1.9.20 以降、Kotlin/Native バックエンドは、クラスコンストラクターでコンパニオンオブジェクトの静的初期化子を呼び出します。

```kotlin
class Greeting {
    companion object {
        init {
            print("Hello, Kotlin!") 
        }
    }
}

fun main() {
    val start = Greeting() // Prints "Hello, Kotlin!"
}
```

この動作は Kotlin/JVM と統一されました。Kotlin/JVM では、Java 静的初期化子のセマンティクスに一致する対応するクラスがロード（解決）されるときにコンパニオンオブジェクトが初期化されます。

この機能の実装がプラットフォーム間でより一貫性を持つようになったため、Kotlin
Multiplatform プロジェクトでコードを共有することがより簡単になりました。

### Opt-in requirement for all cinterop declarations（すべての cinterop 宣言に対するオプトイン要件）

Kotlin 1.9.20 以降、`cinterop` ツールによって libcurl や libxml などの C および Objective-C ライブラリから生成されたすべての Kotlin 宣言には、`@ExperimentalForeignApi` が付加されます。オプトインアノテーションがない場合、コードはコンパイルされません。

この要件は、C および Objective-C ライブラリのインポートの[試験的](components-stability#stability-levels-explained)ステータスを反映しています。プロジェクトの特定領域での使用に限定することをお勧めします。これにより、インポートの安定化を開始した後の移行が容易になります。

Kotlin/Native に付属しているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIX など）については、API の一部のみが `@ExperimentalForeignApi` でオプトインする必要があります。このような場合は、オプトイン要件に関する警告が表示されます。

:::

### Custom message for linker errors（リンカーエラーのカスタムメッセージ）

ライブラリ作成者は、カスタムメッセージでリンカーエラーを解決するのに役立ちます。

Kotlin ライブラリが C または Objective-C ライブラリに依存している場合（たとえば、[CocoaPods 統合](native-cocoapods)を使用）、
そのユーザーはこれらの依存ライブラリをローカルマシンに用意するか、プロジェクトビルドスクリプトで明示的に構成する必要があります。
そうでない場合、ユーザーは紛らわしい「Framework not found（フレームワークが見つかりません）」メッセージを受け取っていました。

コンパイル失敗メッセージで特定の指示またはリンクを提供できるようになりました。これを行うには、`-Xuser-setup-hint`
コンパイラーオプションを `cinterop` に渡すか、`userSetupHint=message` プロパティを `.def` ファイルに追加します。

### Removal of the legacy memory manager（レガシーメモリマネージャーの削除）

[新しいメモリマネージャー](native-memory-manager) は Kotlin 1.6.20 で導入され、1.7.20 でデフォルトになりました。
それ以来、さらなるアップデートとパフォーマンスの改善を受け、Stable になりました。

非推奨サイクルを完了し、レガシーメモリマネージャーを削除する時期が来ました。まだ使用している場合は、`kotlin.native.binary.memoryModel=strict` オプションを `gradle.properties` から削除し、必要な変更を行うために[移行ガイド](native-migration-guide)に従ってください。

###  Change to our target tiers policy（ターゲット層ポリシーの変更）

[tier 1 サポート](native-target-support#tier-1)の要件をアップグレードすることにしました。Kotlin チームは現在、tier 1 の対象となるターゲットについて、コンパイラーリリース間のソースおよびバイナリ互換性を提供することに尽力しています。また、コンパイルして実行できるように、CI ツールで定期的にテストする必要があります。現在、tier 1 には macOS ホストの次のターゲットが含まれています。

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

Kotlin 1.9.20 では、以前に非推奨になった多数のターゲットも削除しました。具体的には、

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

現在[サポートされているターゲット](native-target-support)の完全なリストを参照してください。

## Kotlin Multiplatform

Kotlin 1.9.20 は Kotlin Multiplatform の安定化に重点を置いており、新しいプロジェクトウィザードやその他の注目すべき機能により、開発者のエクスペリエンスを向上させるための新たなステップを踏み出します。

* [Kotlin Multiplatform が Stable に](#kotlin-multiplatform-is-stable)
* [マルチプラットフォームプロジェクトを構成するためのテンプレート](#template-for-configuring-multiplatform-projects)
* [新しいプロジェクトウィザード](#new-project-wizard)
* [Gradle 構成キャッシュの完全サポート](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Gradle での新しい標準ライブラリバージョンの簡単な構成](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [サードパーティ cinterop ライブラリのデフォルトサポート](#default-support-for-third-party-cinterop-libraries)
* [Compose Multiplatform プロジェクトでの Kotlin/Native コンパイルキャッシュのサポート](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [互換性ガイドライン](#compatibility-guidelines)

### Kotlin Multiplatform is Stable（Kotlin Multiplatform が Stable に）

1.9.20 リリースは、Kotlin の進化における重要なマイルストーンを示しています。[Kotlin Multiplatform](multiplatform-intro) がついに
Stable になりました。これは、このテクノロジーをプロジェクトで安全に使用でき、本番環境に対応できることを意味します。また、Kotlin Multiplatform のさらなる開発は、当社の厳格な[下位互換性ルール](https://kotlinfoundation.org/language-committee-guidelines/)に従って継続されることを意味します。

Kotlin Multiplatform の一部の高度な機能はまだ進化していることに注意してください。これらを使用すると、使用している機能の現在の安定性ステータスを説明する警告が表示されます。IntelliJ IDEA で試験的な機能を使用する前に、
**Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform** で明示的に有効にする必要があります。

* Kotlin Multiplatform の安定化と今後の計画の詳細については、[Kotlin ブログ](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)にアクセスしてください。
* 安定化に向けて行われた重要な変更については、[Multiplatform 互換性ガイド](multiplatform-compatibility-guide)を確認してください。
* このリリースで部分的に安定化された Kotlin Multiplatform の重要な部分である[期待される宣言と実際の宣言のメカニズム](multiplatform-expect-actual)についてお読みください。

### Template for configuring multiplatform projects（マルチプラットフォームプロジェクトを構成するためのテンプレート）

Kotlin 1.9.20 以降、Kotlin Gradle プラグインは、一般的なマルチプラットフォームシナリオの共有ソースセットを自動的に作成します。
プロジェクトのセットアップがその 1 つである場合、ソースセット階層を手動で構成する必要はありません。
プロジェクトに必要なターゲットを明示的に指定するだけです。

Kotlin Gradle プラグインの新機能であるデフォルト階層テンプレートにより、セットアップが簡単になりました。
これは、プラグインに組み込まれたソースセット階層の定義済みのテンプレートです。
これには、宣言したターゲットに対して Kotlin が自動的に作成する中間ソースセットが含まれています。
[完全なテンプレートを参照](#see-the-full-hierarchy-template)。

#### Create your project easier（プロジェクトの作成が簡単に）

Android デバイスと iPhone デバイスの両方をターゲットとし、Apple シリコン MacBook で開発されたマルチプラットフォームプロジェクトについて考えてみましょう。
このプロジェクトのセットアップが Kotlin の異なるバージョン間でどのように異なるかを比較します。
<table>
<tr>
<td>
Kotlin 1.9.0 以前（標準的なセットアップ）
</td>
<td>
Kotlin 1.9.20
</td>
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

    // iosMain ソースセットが自動的に作成されます
}
```
</td>
</tr>
</table>

デフォルト階層テンプレートを使用すると、プロジェクトのセットアップに必要なボイラープレートコードの量が大幅に削減されることに注意してください。

コードで `androidTarget`、`iosArm64`、および `iosSimulatorArm64` ターゲットを宣言すると、Kotlin Gradle プラグインは
テンプレートから適切な共有ソースセットを見つけて、それらを作成します。結果の階層は次のようになります。

<img src="/img/default-hierarchy-example.svg" alt="An example of the default target hierarchy in use" width="350" style={{verticalAlign: 'middle'}}/>

緑色のソースセットは実際に作成されてプロジェクトに含まれ、デフォルトテンプレートの灰色のソースセットは無視されます。

#### Use completion for source sets（ソースセットの補完を使用する）

作成されたプロジェクト構造の操作を容易にするために、IntelliJ IDEA でデフォルト階層テンプレートで作成されたソースセットの補完が提供されるようになりました。

<img src="/img/multiplatform-hierarchy-completion.animated.gif" alt="IDE completion for source set names" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

Kotlin は、それぞれのターゲットを宣言していないために存在しないソースセットにアクセスしようとすると警告します。
下の例では、JVM ターゲットはありません（`androidTarget` のみ。これは同じではありません）。ただし、`jvmMain` ソースセットを使用してみます。
何が起こるか見てみましょう。

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

この場合、Kotlin はビルドログに警告を報告します。

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* `<-` register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### Set up the target hierarchy（ターゲット階層をセットアップする）

Kotlin 1.9.20 以降、デフォルト階層テンプレートは自動的に有効になります。ほとんどの場合、追加のセットアップは必要ありません。

ただし、1.9.20 より前に作成された既存のプロジェクトを移行する場合は、以前に
`dependsOn()` 呼び出しで中間ソースを手動で導入していた場合に警告が表示されることがあります。この問題を解決するには、次の手順を実行します。

* 中間ソースセットが現在デフォルト階層テンプレートでカバーされている場合は、すべての手動の `dependsOn()`
  呼び出しと、`by creating` コンストラクションで作成されたソースセットを削除します。

  すべてのデフォルトソースセットのリストを確認するには、[完全な階層テンプレートを参照](#see-the-full-hierarchy-template)。

* たとえば、macOS ターゲットと JVM ターゲット間でコードを共有する、デフォルト階層テンプレートが提供していない追加のソースセットが必要な場合は、`applyDefaultHierarchyTemplate()` でテンプレートを明示的に再適用し、`dependsOn()` で通常どおりに追加のソースセットを手動で構成して、階層を調整します。

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // デフォルト階層を明示的に適用します。たとえば、iosMain ソースセットが作成されます。
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

* テンプレートによって生成されるソースセットとまったく同じ名前のソースセットがプロジェクトにすでに存在する場合
  ただし、異なるターゲットセット間で共有されている場合、テンプレートのソースセット間のデフォルトの `dependsOn` 関係を変更する方法は現在ありません。

  ここで利用できるオプションの 1 つは、目的のソースセットをデフォルト階層テンプレートで探すか、手動で作成されたソースセットを探すことです。もう 1 つは、テンプレートを完全にオプトアウトすることです。

  オプトアウトするには、`kotlin.mpp.applyDefaultHierarchyTemplate=false` を `gradle.properties` に追加し、その他すべての
  ソースセットを手動で構成します。

  このような場合のセットアッププロセスを簡素化するために、独自の階層テンプレートを作成するための API を現在開発中です。

#### See the full hierarchy template（完全な階層テンプレートを参照）

プロジェクトのコンパイル先のターゲットを宣言すると、
プラグインはテンプレートから共有ソースセットを適切に選択し、プロジェクトに作成します。

<img src="/img/full-template-hierarchy.svg" alt="Default hierarchy template" style={{verticalAlign: 'middle'}}/>
:::note
この例では、プロジェクトの本番部分のみを示しており、`Main` サフィックスを省略しています
（たとえば、`commonMain` の代わりに `common` を使用）。ただし、`*Test` ソースについてもすべて同じです。

### New project wizard（新しいプロジェクトウィザード）

JetBrains チームは、クロスプラットフォームプロジェクトを作成する新しい方法である[Kotlin Multiplatform ウェブウィザード](https://kmp.jetbrains.com)を導入しています。

新しい Kotlin Multiplatform ウィザードの最初の実装では、最も一般的な Kotlin Multiplatform
ユースケースが対象となります。以前のプロジェクトテンプレートに関するすべてのフィードバックが組み込まれており、アーキテクチャが可能な限り堅牢で
信頼性の高いものになっています。

新しいウィザードは分散アーキテクチャを備えており、統合されたバックエンドと
さまざまなフロントエンドを持つことができます。ウェブバージョンはその最初のステップです。IDE バージョンの実装と
将来のコマンドラインツールの作成の両方を検討しています。ウェブでは、常に最新バージョンのウィザードを入手できますが、
IDE では、次のリリースまで待つ必要があります。

新しいウィザードを使用すると、プロジェクトのセットアップがこれまで以上に簡単になります。モバイル、サーバー、およびデスクトップ開発のターゲットプラットフォームを選択することで、ニーズに合わせてプロジェクトを調整できます。今後のリリースでは、ウェブ開発も追加する予定です。

<img src="/img/multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

新しいプロジェクトウィザードは、Kotlin でクロスプラットフォームプロジェクトを作成するための推奨される方法になりました。1.9.20 以降、Kotlin
プラグインは IntelliJ IDEA で **Kotlin Multiplatform** プロジェクトウィザードを提供しなくなりました。

新しいウィザードは、初期セットアップを簡単に案内し、オンボーディングプロセスを大幅にスムーズにします。
問題が発生した場合は、ウィザードの改善にご協力いただくために、[YouTrack](https://kotl.in/issue)に報告してください。

<a href="https://kmp.jetbrains.com">
   <img src="/img/multiplatform-create-project-button.png" alt="Create a project" />
</a>

### Full support for the Gradle configuration cache in Kotlin Multiplatform（Kotlin Multiplatform での Gradle 構成キャッシュの完全サポート）

以前は、Kotlin マルチプラットフォームライブラリで使用できる Gradle 構成
キャッシュの[プレビュー](whatsnew19#preview-of-the-gradle-configuration-cache)を導入しました。1.9.20 では、Kotlin Multiplatform プラグインがさらに一歩進んでいます。

[Kotlin CocoaPods Gradle プラグイン](native-cocoapods-dsl-reference) と、`embedAndSignAppleFrameworkForXcode` のように Xcode ビルドに必要な統合タスクで、Gradle 構成キャッシュをサポートするようになりました。

これで、すべてのマルチプラットフォームプロジェクトでビルド時間の短縮を活用できます。
Gradle 構成キャッシュは、後続のビルドに対して構成フェーズの結果を再利用することで、ビルドプロセスを高速化します。
詳細とセットアップ手順については、[Gradle ドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)を参照してください。

### Easier configuration of new standard library versions in Gradle（Gradle での新しい標準ライブラリバージョンの簡単な構成）

マルチプラットフォームプロジェクトを作成すると、標準ライブラリ (`stdlib`) の依存関係が各
ソースセットに自動的に追加されます。これが、マルチプラットフォームプロジェクトを開始する最も簡単な方法です。

以前は、標準ライブラリへの依存関係を手動で構成する場合は、
ソースセットごとに個別に構成する必要がありました。`kotlin-stdlib:1.9.20` 以降は、`commonMain` ルートソースセットで依存関係を**1 回**構成するだけで済みます。
<table>
<tr>
<td>
標準ライブラリバージョン 1.9.10 以前
</td>
<td>
標準ライブラリバージョン 1.9.20
</td>
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

        // JVM ソースセットの場合
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // JS ソースセットの場合
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

この変更は、標準ライブラリ