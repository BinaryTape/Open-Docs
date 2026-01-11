[//]: # (title: コンパイル時間改善のヒント)

<show-structure depth="1"/>

Kotlin/Nativeコンパイラは、そのパフォーマンスを向上させるための更新を常に受けています。最新のKotlin/Nativeコンパイラと適切に設定されたビルド環境があれば、Kotlin/Nativeターゲットを持つプロジェクトのコンパイル時間を大幅に改善できます。

Kotlin/Nativeのコンパイルプロセスを高速化するためのヒントを続けてお読みください。

## 一般的な推奨事項

### 最新バージョンのKotlinを使用する

これにより、常に最新のパフォーマンス改善が得られます。最新のKotlinバージョンは %kotlinVersion% です。

### 巨大なクラスの作成を避ける

コンパイルに時間がかかり、実行時にロードされる巨大なクラスの作成は避けるようにしてください。

### ビルド間でダウンロード済みおよびキャッシュされたコンポーネントを保持する

プロジェクトをコンパイルする際、Kotlin/Nativeは必要なコンポーネントをダウンロードし、その作業結果の一部を `$USER_HOME/.konan` ディレクトリにキャッシュします。コンパイラはこのディレクトリを以降のコンパイルに使用し、完了にかかる時間を短縮します。

コンテナ（Dockerなど）または継続的インテグレーションシステムでビルドを行う場合、コンパイラはビルドごとに `~/.konan` ディレクトリをゼロから作成する必要があるかもしれません。この手順を避けるには、ビルド間で `~/.konan` を保持するように環境を設定してください。たとえば、`konan.data.dir` Gradleプロパティを使用してその場所を再定義します。

あるいは、`-Xkonan-data-dir` コンパイラオプションを使用して、`cinterop` および `konanc` ツール経由でディレクトリへのカスタムパスを設定できます。

## Gradle設定

Gradleでの最初のコンパイルは、依存関係のダウンロード、キャッシュの構築、および追加の手順の実行が必要なため、通常は後続のコンパイルよりも時間がかかります。実際のコンパイル時間を正確に把握するには、プロジェクトを少なくとも2回ビルドする必要があります。

以下に、コンパイルパフォーマンスを向上させるためのGradle設定の推奨事項を示します。

### Gradleヒープサイズの増加

[Gradleヒープサイズ](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)を増やすには、`gradle.properties` ファイルに `org.gradle.jvmargs=-Xmx3g` を追加します。

[並列ビルド](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)を使用する場合、`org.gradle.workers.max` プロパティまたは `--max-workers` コマンドラインオプションを使用して適切なワーカー数を選択する必要があるかもしれません。デフォルト値はCPUプロセッサの数です。

### 必要なバイナリのみをビルドする

本当に必要な場合を除き、`build` や `assemble` など、プロジェクト全体をビルドするGradleタスクを実行しないでください。これらのタスクは同じコードを複数回ビルドするため、コンパイル時間が増加します。IntelliJ IDEAからテストを実行したり、Xcodeからアプリを起動したりするような一般的なケースでは、Kotlinツールは不要なタスクの実行を回避します。

一般的でないケースやビルド設定の場合、タスクを自分で選択する必要があるかもしれません。

* `linkDebug*`。開発中にコードを実行する場合、通常は1つのバイナリのみが必要なため、対応する `linkDebug*` タスクを実行するだけで十分なはずです。
* `embedAndSignAppleFrameworkForXcode`。iOSシミュレータとデバイスは異なるプロセッサアーキテクチャを持っているため、Kotlin/Nativeバイナリをユニバーサル（fat）フレームワークとして配布するのが一般的なアプローチです。

  ただし、ローカル開発中は、使用しているプラットフォーム専用の `.framework` ファイルをビルドする方が高速です。プラットフォーム固有のフレームワークをビルドするには、[embedAndSignAppleFrameworkForXcode](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html#connect-the-framework-to-your-project) タスクを使用します。

### 必要なターゲットのみをビルドする

上記の推奨事項と同様に、すべてのネイティブプラットフォーム用のバイナリを一度にビルドしないでください。たとえば、[XCFramework](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#build-xcframeworks) をコンパイルする（`*XCFramework` タスクを使用する）と、すべてのターゲットに対して同じコードがビルドされ、単一ターゲットのビルドよりも比例して多くの時間がかかります。

もしセットアップにXCFrameworkが必要な場合でも、ターゲットの数を減らすことができます。たとえば、IntelベースのMac上のiOSシミュレータでこのプロジェクトを実行しない場合、`iosX64` は必要ありません。

> 異なるターゲットのバイナリは、`linkDebug*$Target` および `linkRelease*$Target` Gradleタスクでビルドされます。実行されたタスクは、ビルドログ、または `--scan` オプションを付けてGradleビルドを実行することで[Gradleビルドスキャン](https://docs.gradle.org/current/userguide/build_scans.html)で確認できます。
>
{style="tip"}

### 不要なリリースバイナリをビルドしない

Kotlin/Nativeは、[デバッグモードとリリースモード](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#declare-binaries)の2つのビルドモードをサポートしています。リリースは高度に最適化されており、これには多くの時間がかかります。リリースバイナリのコンパイルは、デバッグバイナリよりも桁違いに時間がかかります。

実際のリリースを除けば、これらの最適化はすべて、通常の開発サイクルでは不要な場合があります。開発プロセス中に名前に `Release` を含むタスクを使用している場合は、`Debug` に置き換えることを検討してください。同様に、`assembleXCFramework` を実行する代わりに、たとえば `assembleSharedDebugXCFramework` を実行できます。

> リリースバイナリは `linkRelease*` Gradleタスクでビルドされます。ビルドログ、または `--scan` オプションを付けてGradleビルドを実行することで[Gradleビルドスキャン](https://docs.gradle.org/current/userguide/build_scans.html)でそれらを確認できます。
>
{style="tip"}

### Gradleデーモンを無効にしない

正当な理由がない限り、[Gradleデーモン](https://docs.gradle.org/current/userguide/gradle_daemon.html)を無効にしないでください。デフォルトでは、[Kotlin/NativeはGradleデーモンから実行されます](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。有効になっている場合、同じJVMプロセスが使用され、コンパイルごとにウォームアップする必要はありません。

### 推移的エクスポートを使用しない

[`transitiveExport = true`](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)を使用すると、多くの場合、デッドコードエリミネーションが無効になり、コンパイラは大量の未使用コードを処理する必要があります。これによりコンパイル時間が増加します。代わりに、必要なプロジェクトと依存関係をエクスポートするには、`export` メソッドを明示的に使用してください。

### モジュールを過度にエクスポートしない

不要な[モジュールエクスポート](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)は避けるようにしてください。エクスポートされた各モジュールは、コンパイル時間とバイナリサイズに悪影響を及ぼします。

### Gradleビルドキャッシュを使用する

Gradleの[ビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)機能を有効にします。

* **ローカルビルドキャッシュ**。ローカルキャッシュの場合、`gradle.properties` ファイルに `org.gradle.caching=true` を追加するか、コマンドラインで `--build-cache` オプションを付けてビルドを実行します。
* **リモートビルドキャッシュ**。継続的インテグレーション環境向けに[リモートビルドキャッシュを設定する方法](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)を学習してください。

### Gradleコンフィギュレーションキャッシュを使用する

Gradleの[コンフィギュレーションキャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)を使用するには、`gradle.properties` ファイルに `org.gradle.configuration-cache=true` を追加します。

> コンフィギュレーションキャッシュは、`link*` タスクの並列実行も可能にします。これにより、特に多くのCPUコアを持つマシンで負荷が大きくなる可能性があります。この問題は[KT-70915](https://youtrack.jetbrains.com/issue/KT-70915)で修正される予定です。
>
{style="note"}

### 以前に無効にした機能を有効にする

Gradleデーモンとコンパイラキャッシュを無効にするKotlin/Nativeプロパティがあります。

* `kotlin.native.disableCompilerDaemon=true`
* `kotlin.native.cacheKind=none`
* `kotlin.native.cacheKind.$target=none`。ここで `$target` はKotlin/Nativeのコンパイルターゲットです（例: `iosSimulatorArm64`）。

以前にこれらの機能で問題があり、`gradle.properties` ファイルまたはGradle引数にこれらの行を追加した場合は、それらを削除してビルドが正常に完了するかどうかを確認してください。これらのプロパティは、以前にすでに修正された問題を回避するために追加された可能性があります。

### klibアーティファクトのインクリメンタルコンパイルを試す

インクリメンタルコンパイルでは、プロジェクトモジュールによって生成された `klib` アーティファクトの一部のみが変更された場合、`klib` の一部だけがバイナリに再コンパイルされます。

この機能は[Experimental](components-stability.md#stability-levels-explained)です。これを有効にするには、`kotlin.incremental.native=true` オプションを `gradle.properties` ファイルに追加します。問題が発生した場合は、[YouTrackでissueを作成](https://kotl.in/issue)してください。

## Windows設定

WindowsセキュリティはKotlin/Nativeコンパイラの動作を遅くする可能性があります。これを回避するには、デフォルトで `%\USERPROFILE%` にある `.konan` ディレクトリをWindowsセキュリティの除外に追加します。[Windowsセキュリティに除外を追加する方法](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)を学習してください。

## LLVM設定
<primary-label ref="advanced"/>

上記のヒントがコンパイル時間の改善に役立たなかった場合は、[LLVMバックエンドのカスタマイズ](native-llvm-passes.md)を検討してください。