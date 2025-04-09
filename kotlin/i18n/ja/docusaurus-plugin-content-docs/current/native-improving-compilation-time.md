---
title: コンパイル時間を改善するためのヒント
---
<show-structure depth="1"/>

Kotlin/Nativeコンパイラーは、パフォーマンスを向上させるためのアップデートを常に受信しています。最新のKotlin/Native
コンパイラーと適切に構成されたビルド環境を使用すると、Kotlin/Native ターゲットを持つプロジェクトのコンパイル時間を大幅に改善できます。

Kotlin/Native のコンパイル処理を高速化する方法についてのヒントをお読みください。

## 一般的な推奨事項

### 最新バージョンの Kotlin を使用する

これにより、常に最新のパフォーマンス改善が得られます。最新の Kotlin バージョンは 2.1.20 です。

### 巨大なクラスの作成を避ける

コンパイルに時間がかかり、実行時にロードに時間がかかる巨大なクラスの作成は避けるようにしてください。

### ダウンロードおよびキャッシュされたコンポーネントをビルド間で保持する

プロジェクトのコンパイル時、Kotlin/Native は必要なコンポーネントをダウンロードし、作業の結果の一部を `$USER_HOME/.konan` ディレクトリにキャッシュします。コンパイラーはこのディレクトリーを後続のコンパイルに使用し、完了までの時間を短縮します。

コンテナー (Docker など) または継続的インテグレーションシステムでビルドする場合、コンパイラーはビルドごとに `~/.konan` ディレクトリーを最初から作成する必要がある場合があります。この手順を避けるには、ビルド間で `~/.konan` を保持するように環境を構成します。たとえば、`kotlin.data.dir` Gradle プロパティを使用して場所を再定義します。

または、`-Xkonan-data-dir` コンパイラーオプションを使用して、`cinterop` および `konanc` ツールを介してディレクトリーへのカスタムパスを構成できます。

## Gradle の構成

Gradle を使用した最初のコンパイルは、依存関係のダウンロード、キャッシュの構築、追加の手順の実行が必要なため、通常、後続のコンパイルよりも時間がかかります。実際のコンパイル時間を正確に把握するには、プロジェクトを少なくとも 2 回ビルドする必要があります。

以下に、コンパイルのパフォーマンスを向上させるための Gradle の構成に関する推奨事項をいくつか示します。

### Gradle のヒープサイズを増やす

[Gradle ヒープサイズ](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)を増やすには、`org.gradle.jvmargs=-Xmx3g` を `gradle.properties` ファイルに追加します。

[並列ビルド](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)を使用する場合は、`org.gradle.workers.max` プロパティまたは `--max-workers` コマンドラインオプションを使用して、適切なワーカー数を選択する必要がある場合があります。デフォルト値は CPU プロセッサーの数です。

### 必要なバイナリのみをビルドする

本当に必要な場合を除き、`build` や `assemble` など、プロジェクト全体をビルドする Gradle タスクを実行しないでください。これらのタスクは同じコードを複数回ビルドするため、コンパイル時間が長くなります。IntelliJ IDEA からテストを実行したり、Xcode からアプリを起動したりする場合など、一般的なケースでは、Kotlin ツールは不要なタスクの実行を回避します。

一般的でないケースまたはビルド構成がある場合は、自分でタスクを選択する必要がある場合があります。

* `linkDebug*`. 開発中にコードを実行するには、通常 1 つのバイナリのみが必要なため、対応する `linkDebug*` タスクを実行するだけで十分です。
* `embedAndSignAppleFrameworkForXcode`. iOS シミュレーターとデバイスはプロセッサーアーキテクチャが異なるため、Kotlin/Native バイナリをユニバーサル (fat) フレームワークとして配布するのが一般的なアプローチです。

  ただし、ローカル開発中は、使用しているプラットフォームでのみ `.framework` ファイルをビルドする方が高速です。プラットフォーム固有のフレームワークを構築するには、[embedAndSignAppleFrameworkForXcode](multiplatform-direct-integration#connect-the-framework-to-your-project) タスクを使用します。

### 必要なターゲットのみをビルドする

上記の推奨事項と同様に、すべてのネイティブプラットフォームのバイナリを一度にビルドしないでください。たとえば、[XCFramework](multiplatform-build-native-binaries#build-xcframeworks) (`*XCFramework` タスクを使用) をコンパイルすると、すべてのターゲットに対して同じコードがビルドされるため、単一のターゲットをビルドするよりも比例して時間がかかります。

セットアップに XCFramework が必要な場合は、ターゲットの数を減らすことができます。たとえば、Intel ベースの Mac でこのプロジェクトを iOS シミュレーターで実行しない場合は、`iosX64` は必要ありません。

:::note
異なるターゲットのバイナリは、`linkDebug*$Target` および `linkRelease*$Target` Gradle タスクでビルドされます。実行されたタスクは、ビルドログまたは
[Gradle ビルドスキャン](https://docs.gradle.org/current/userguide/build_scans.html) で、`--scan` オプションを指定して Gradle ビルドを実行することで確認できます。

### 不要なリリースバイナリをビルドしない

Kotlin/Native は、[デバッグとリリース](multiplatform-build-native-binaries#declare-binaries)の 2 つのビルドモードをサポートしています。リリースは高度に最適化されており、時間がかかります。リリースバイナリのコンパイルには、デバッグバイナリよりも桁違いに時間がかかります。

実際のリリースとは別に、これらの最適化はすべて、一般的な開発サイクルでは不要な場合があります。開発プロセス中に名前に `Release` が含まれるタスクを使用する場合は、代わりに `Debug` に置き換えることを検討してください。同様に、`assembleXCFramework` を実行する代わりに、`assembleSharedDebugXCFramework` を実行できます。

リリースバイナリは `linkRelease*` Gradle タスクでビルドされます。これらはビルドログまたは、`--scan` オプションを指定して Gradle ビルドを実行することで、[Gradle ビルドスキャン](https://docs.gradle.org/current/userguide/build_scans.html) で確認できます。

### Gradle デーモンを無効にしない

正当な理由がない限り、[Gradle デーモン](https://docs.gradle.org/current/userguide/gradle_daemon.html)を無効にしないでください。デフォルトでは、[Kotlin/Native は Gradle デーモンから実行されます](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。有効にすると、同じ JVM プロセスが使用され、コンパイルごとにウォームアップする必要がありません。

### 推移的なエクスポートを使用しない

[`transitiveExport = true`](multiplatform-build-native-binaries#export-dependencies-to-binaries) を使用すると、多くの場合、デッドコード除去が無効になるため、コンパイラーは大量の未使用コードを処理する必要があります。これにより、コンパイル時間が長くなります。代わりに、必要なプロジェクトと依存関係をエクスポートするには、`export` メソッドを明示的に使用します。

### モジュールをエクスポートしすぎない

不要な[モジュールのエクスポート](multiplatform-build-native-binaries#export-dependencies-to-binaries)は避けるようにしてください。エクスポートされた各モジュールは、コンパイル時間とバイナリサイズに悪影響を及ぼします。

### Gradle ビルドキャッシュを使用する

Gradle [ビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)機能を有効にします。

* **ローカルビルドキャッシュ**。ローカルキャッシュの場合、`org.gradle.caching=true` を `gradle.properties` ファイルに追加するか、コマンドラインで `--build-cache` オプションを指定してビルドを実行します。
* **リモートビルドキャッシュ**。[リモートビルドキャッシュの構成](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)方法については、継続的インテグレーション環境を参照してください。

### Gradle 構成キャッシュを使用する

Gradle [構成キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)を使用するには、`org.gradle.configuration-cache=true` を `gradle.properties` ファイルに追加します。

構成キャッシュを使用すると、`link*` タスクを並行して実行できるようになり、特に多数の CPU コアを使用する場合に、マシンに大きな負荷がかかる可能性があります。この問題は [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915) で修正される予定です。

:::

### 以前に無効にした機能を有効にする

Gradle デーモンとコンパイラーキャッシュを無効にする Kotlin/Native プロパティがあります。

* `kotlin.native.disableCompilerDaemon=true`
* `kotlin.native.cacheKind=none`
* `kotlin.native.cacheKind.$target=none`。ここで `$target` は Kotlin/Native コンパイルターゲットです (例: `iosSimulatorArm64`)。

これらの機能に以前問題があり、これらの行を `gradle.properties` ファイルまたは Gradle 引数に追加した場合は、削除してビルドが正常に完了するかどうかを確認してください。これらのプロパティは、すでに修正されている問題を回避するために以前に追加された可能性があります。

### klib アーティファクトのインクリメンタルコンパイルを試す

インクリメンタルコンパイルでは、プロジェクトモジュールによって生成された `klib` アーティファクトの一部のみが変更された場合、`klib` の一部のみがバイナリに再コンパイルされます。

この機能は[試験的](components-stability#stability-levels-explained)です。有効にするには、`kotlin.incremental.native=true` オプションを `gradle.properties` ファイルに追加します。問題が発生した場合は、[YouTrack で issue を作成](https://kotl.in/issue)してください。

## Windows の構成

Windows セキュリティは、Kotlin/Native コンパイラーの速度を低下させる可能性があります。これを回避するには、デフォルトで `%\USERPROFILE%` にある `.konan` ディレクトリを Windows セキュリティの除外に追加します。[Windows セキュリティに除外を追加](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)する方法をご覧ください。