[//]: # (title: コンパイル時間を改善するためのヒント)

<show-structure depth="1"/>

Kotlin/Nativeコンパイラは、そのパフォーマンスを向上させるためのアップデートを常に受けています。最新のKotlin/Nativeコンパイラと適切に設定されたビルド環境を使用することで、Kotlin/Nativeターゲットを持つプロジェクトのコンパイル時間を大幅に改善できます。

Kotlin/Nativeのコンパイルプロセスを高速化するためのヒントを読み進めてください。

## 一般的な推奨事項

### 最新バージョンのKotlinを使用する

これにより、常に最新のパフォーマンス改善が得られます。最新のKotlinバージョンは`%kotlinVersion%`です。

### 巨大なクラスの作成を避ける

コンパイルと実行時のロードに時間がかかる巨大なクラスの作成は避けるようにしてください。

### ビルド間でダウンロードおよびキャッシュされたコンポーネントを保持する

プロジェクトをコンパイルする際、Kotlin/Nativeは必要なコンポーネントをダウンロードし、その作業の一部結果を`$USER_HOME/.konan`ディレクトリにキャッシュします。コンパイラはこのディレクトリを以降のコンパイルに使用し、完了までの時間を短縮します。

コンテナ（Dockerなど）や継続的インテグレーションシステムでビルドする場合、コンパイラはビルドごとに`~/.konan`ディレクトリをゼロから作成する必要があるかもしれません。この手順を避けるには、ビルド間で`~/.konan`を保持するように環境を設定します。例えば、`kotlin.data.dir` Gradleプロパティを使用してその場所を再定義します。

または、`-Xkonan-data-dir`コンパイラオプションを使用して、`cinterop`および`konanc`ツールを介してディレクトリへのカスタムパスを設定することもできます。

## Gradleの設定

Gradleでの最初のコンパイルは、依存関係のダウンロード、ビルドキャッシュの構築、追加手順の実行が必要なため、通常、以降のコンパイルよりも時間がかかります。実際のコンパイル時間を正確に把握するには、プロジェクトを少なくとも2回ビルドする必要があります。

以下は、より良いコンパイルパフォーマンスを実現するためのGradle設定に関するいくつかの推奨事項です。

### Gradleヒープサイズの増加

[Gradleヒープサイズ](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)を増やすには、`org.gradle.jvmargs=-Xmx3g`を`gradle.properties`ファイルに追加します。

[並列ビルド](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)を使用する場合、`org.gradle.workers.max`プロパティまたは`--max-workers`コマンドラインオプションを使用して、適切なワーカー数を選択する必要があるかもしれません。デフォルト値はCPUプロセッサの数です。

### 必要なバイナリのみをビルドする

本当に必要でない限り、`build`や`assemble`など、プロジェクト全体をビルドするGradleタスクを実行しないでください。これらのタスクは同じコードを複数回ビルドするため、コンパイル時間が増加します。IntelliJ IDEAからテストを実行したり、Xcodeからアプリを起動したりするなどの一般的なケースでは、Kotlinツールは不要なタスクの実行を回避します。

非典型的なケースやビルド設定がある場合、タスクを自分で選択する必要があるかもしれません。

* `linkDebug*`。開発中にコードを実行するには、通常1つのバイナリのみが必要なため、対応する`linkDebug*`タスクを実行するだけで十分です。
* `embedAndSignAppleFrameworkForXcode`。iOSシミュレータとデバイスは異なるプロセッサアーキテクチャを持つため、Kotlin/Nativeバイナリをユニバーサル（fat）フレームワークとして配布するのが一般的なアプローチです。

  しかし、ローカル開発中は、使用しているプラットフォーム専用の`.framework`ファイルをビルドする方が高速です。プラットフォーム固有のフレームワークをビルドするには、[embedAndSignAppleFrameworkForXcode](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html#connect-the-framework-to-your-project)タスクを使用します。

### 必要なターゲットのみをビルドする

上記の推奨事項と同様に、すべてのネイティブプラットフォームのバイナリを一度にビルドしないでください。例えば、[XCFramework](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks)をコンパイルする（`*XCFramework`タスクを使用する）と、すべてのターゲットに対して同じコードがビルドされるため、単一ターゲットのビルドよりも比例して時間がかかります。

設定でXCFrameworkが必要な場合でも、ターゲットの数を減らすことができます。例えば、IntelベースのMac上のiOSシミュレータでこのプロジェクトを実行しないのであれば、`iosX64`は必要ありません。

> 異なるターゲットのバイナリは、`linkDebug*$Target`および`linkRelease*$Target` Gradleタスクでビルドされます。
> 実行されたタスクは、ビルドログまたは`--scan`オプションを付けてGradleビルドを実行することで、
> [Gradleビルドスキャン](https://docs.gradle.org/current/userguide/build_scans.html)で確認できます。
>
{style="tip"}

### 不要なリリースバイナリをビルドしない

Kotlin/Nativeは、[デバッグとリリース](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries)の2つのビルドモードをサポートしています。リリースは高度に最適化されており、これには多くの時間がかかります。リリースバイナリのコンパイルは、デバッグバイナリよりも桁違いに多くの時間を要します。

実際のリリースを除けば、通常の開発サイクルではこれらの最適化はすべて不要かもしれません。開発プロセス中に名前に`Release`を含むタスクを使用している場合は、それを`Debug`に置き換えることを検討してください。同様に、`assembleXCFramework`を実行する代わりに、例えば`assembleSharedDebugXCFramework`を実行できます。

> リリースバイナリは、`linkRelease*` Gradleタスクでビルドされます。それらはビルドログまたは
> `--scan`オプションを付けてGradleビルドを実行することで、
> [Gradleビルドスキャン](https://docs.gradle.org/current/userguide/build_scans.html)で確認できます。
>
{style="tip"}

### Gradleデーモンを無効にしない

よほどの理由がない限り、[Gradleデーモン](https://docs.gradle.org/current/userguide/gradle_daemon.html)を無効にしないでください。デフォルトでは、[Kotlin/NativeはGradleデーモンから実行されます](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。有効になっている場合、同じJVMプロセスが使用され、コンパイルごとにウォームアップする必要はありません。

### 推移的なエクスポートを使用しない

[`transitiveExport = true`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)を使用すると、多くの場合でデッドコード削除が無効になるため、コンパイラは多くの未使用コードを処理する必要があります。これによりコンパイル時間が増加します。代わりに、必要なプロジェクトと依存関係をエクスポートするために`export`メソッドを明示的に使用してください。

### モジュールを過度にエクスポートしない

不要な[モジュールエクスポート](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)は避けるようにしてください。エクスポートされる各モジュールは、コンパイル時間とバイナリサイズに悪影響を及ぼします。

### Gradleビルドキャッシュを使用する

Gradleの[ビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)機能を有効にします。

*   **ローカルビルドキャッシュ**。ローカルキャッシュの場合、`org.gradle.caching=true`を`gradle.properties`ファイルに追加するか、コマンドラインで`--build-cache`オプションを付けてビルドを実行します。
*   **リモートビルドキャッシュ**。継続的インテグレーション環境向けに[リモートビルドキャッシュを設定する方法](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)を学びます。

### Gradleコンフィギュレーションキャッシュを使用する

Gradleの[コンフィギュレーションキャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)を使用するには、`org.gradle.configuration-cache=true`を`gradle.properties`ファイルに追加します。

> コンフィギュレーションキャッシュは、特に多くのCPUコアを搭載したマシンで、マシンに大きな負荷をかける可能性がある`link*`タスクの並列実行も可能にします。この問題は[KT-70915](https://youtrack.jetbrains.com/issue/KT-70915)で修正される予定です。
>
{style="note"}

### 以前無効にした機能を有効にする

Gradleデーモンとコンパイラキャッシュを無効にするKotlin/Nativeプロパティがあります。

*   `kotlin.native.disableCompilerDaemon=true`
*   `kotlin.native.cacheKind=none`
*   `kotlin.native.cacheKind.$target=none`。ここで`$target`はKotlin/Nativeのコンパイルターゲット（例: `iosSimulatorArm64`）です。

以前これらの機能で問題があり、これらの行を`gradle.properties`ファイルまたはGradle引数に追加した場合は、それらを削除し、ビルドが正常に完了するかどうかを確認してください。これらのプロパティは、すでに修正された問題を回避するために以前追加された可能性があります。

### klib成果物のインクリメンタルコンパイルを試す

インクリメンタルコンパイルでは、プロジェクトモジュールによって生成された`klib`成果物の一部のみが変更された場合、`klib`の一部だけがバイナリに再コンパイルされます。

この機能は[実験的](components-stability.md#stability-levels-explained)です。これを有効にするには、`kotlin.incremental.native=true`オプションを`gradle.properties`ファイルに追加します。何か問題に直面した場合は、[YouTrackでissue](https://kotl.in/issue)を作成してください。

## Windowsの設定

WindowsセキュリティはKotlin/Nativeコンパイラの速度を低下させる可能性があります。これを避けるには、デフォルトで`%\USERPROFILE%`に位置する`.konan`ディレクトリをWindowsセキュリティの除外に追加します。[Windowsセキュリティに除外を追加する方法](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)を学びましょう。