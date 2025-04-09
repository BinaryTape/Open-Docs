---
title: Gradleのベストプラクティス
---
[Gradle](https://docs.gradle.org/current/userguide/userguide.html)は、多くの Kotlin プロジェクトで使用されているビルドシステムで、ビルドプロセスを自動化および管理します。

Gradle を最大限に活用することは、ビルドの管理や待ち時間を減らし、コーディングにより多くの時間を費やすために不可欠です。ここでは、プロジェクトの**構成**と**最適化**という 2 つの主要な分野に分けて、一連のベストプラクティスを紹介します。

## 構成

このセクションでは、Gradle プロジェクトを構造化して、明確さ、保守性、およびスケーラビリティを向上させることに焦点を当てています。

### Kotlin DSL を使用する

従来の Groovy DSL の代わりに Kotlin DSL を使用します。別の言語を習得する必要がなくなり、厳密な型指定のメリットが得られます。厳密な型指定により、IDE はリファクタリングとオートコンプリートをより適切にサポートし、開発をより効率的に行うことができます。

詳細については、[Gradle’s Kotlin DSL primer](https://docs.gradle.org/current/userguide/kotlin_dsl.html)を参照してください。

Gradle の [blog](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds) で、Kotlin DSL が Gradle ビルドのデフォルトになったことについてお読みください。

### バージョンカタログを使用する

`libs.versions.toml` ファイルでバージョンカタログを使用して、依存関係の管理を一元化します。これにより、プロジェクト全体で一貫してバージョン、ライブラリ、およびプラグインを定義して再利用できます。

```kotlin
[versions]
kotlinxCoroutines = "1.10.1"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

次の依存関係を `build.gradle.kts` ファイルに追加します。

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

詳細については、Gradle のドキュメントの[Dependency management basics](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)を参照してください。

### Convention plugins を使用する

Convention plugins を使用して、複数のビルドファイル間で共通のビルドロジックをカプセル化して再利用します。共有設定をプラグインに移動すると、ビルドスクリプトを簡素化およびモジュール化できます。

初期設定には時間がかかる場合がありますが、完了すると、新しいビルドロジックの保守と追加が簡単になります。

詳細については、Gradle のドキュメントの[Convention plugins](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)を参照してください。

## 最適化

このセクションでは、Gradle ビルドのパフォーマンスと効率を向上させるための戦略について説明します。

### ローカルビルドキャッシュを使用する

ローカルビルドキャッシュを使用して、他のビルドで生成された出力を再利用することで時間を節約します。ビルドキャッシュは、以前に作成したビルドから出力を取得できます。

詳細については、Gradle のドキュメントの[Build cache](https://docs.gradle.org/current/userguide/build_cache.html)を参照してください。

### Configuration cache を使用する

:::note
Configuration cache は、まだすべてのコア Gradle プラグインをサポートしていません。最新情報については、Gradle の[table of supported plugins](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)を参照してください。

:::

Configuration cache を使用すると、構成フェーズの結果をキャッシュし、後続のビルドで再利用することで、ビルドのパフォーマンスを大幅に向上させることができます。Gradle がビルド構成または関連する依存関係の変更を検出しない場合、構成フェーズをスキップします。

詳細については、Gradle のドキュメントの[Configuration cache](https://docs.gradle.org/current/userguide/configuration_cache.html)を参照してください。

### 複数のターゲットのビルド時間を改善する

マルチプラットフォームプロジェクトに複数のターゲットが含まれている場合、`build` や `assemble` などのタスクは、ターゲットごとに同じコードを複数回コンパイルする可能性があり、コンパイル時間が長くなります。

特定のプラットフォームを積極的に開発およびテストしている場合は、代わりに、対応する `linkDebug*` タスクを実行します。

詳細については、[コンパイル時間を改善するためのヒント](native-improving-compilation-time#gradle-configuration)を参照してください。

### kapt から KSP への移行

[kapt](kapt) コンパイラプラグインに依存するライブラリを使用している場合は、代わりに [Kotlin Symbol Processing (KSP) API](ksp-overview) の使用に切り替えることができるかどうかを確認してください。KSP API は、アノテーション処理時間を短縮することで、ビルドのパフォーマンスを向上させます。KSP は、中間 Java スタブを生成せずにソースコードを直接処理するため、kapt よりも高速かつ効率的です。

移行手順のガイダンスについては、Google の[migration guide](https://developer.android.com/build/migrate-to-ksp)を参照してください。

KSP と kapt の比較の詳細については、[why KSP](ksp-why-ksp) を確認してください。

### モジュール化を使用する

:::note
モジュール化は、中規模から大規模のプロジェクトにのみメリットがあります。マイクロサービスアーキテクチャに基づくプロジェクトには利点はありません。

:::

モジュール化されたプロジェクト構造を使用して、ビルド速度を向上させ、より簡単な並行開発を可能にします。プロジェクトを 1 つのルートプロジェクトと 1 つ以上のサブプロジェクトに構造化します。変更がサブプロジェクトの 1 つにのみ影響する場合、Gradle はその特定のサブプロジェクトのみをリビルドします。

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

詳細については、Gradle のドキュメントの[Structuring projects with Gradle](https://docs.gradle.org/current/userguide/multi_project_builds.html)を参照してください。

### CI/CD をセットアップする

インクリメンタルビルドと依存関係のキャッシュを使用してビルド時間を大幅に短縮するために、CI/CD プロセスをセットアップします。これらのメリットを得るには、永続ストレージを追加するか、リモートビルドキャッシュを使用します。一部のプロバイダー（[GitHub](https://github.com/features/actions) など）は、このサービスをほぼすぐに提供するため、このプロセスに時間がかかる必要はありません。

Gradle のコミュニティクックブックの[Using Gradle with Continuous Integration systems](https://cookbook.gradle.org/ci/)をご覧ください。

### リモートビルドキャッシュを使用する

[ローカルビルドキャッシュ](#use-local-build-cache)と同様に、リモートビルドキャッシュは、他のビルドからの出力を再利用することで時間を節約するのに役立ちます。直前のビルドだけでなく、誰かがすでに実行した以前のビルドからタスク出力を取得できます。

リモートビルドキャッシュは、キャッシュサーバーを使用して、ビルド間でタスク出力を共有します。たとえば、CI/CD サーバーを備えた開発環境では、サーバー上のすべてのビルドがリモートキャッシュにデータを入力します。メインブランチをチェックアウトして新しい機能を開始すると、インクリメンタルビルドにすぐにアクセスできます。

インターネット接続が遅いと、キャッシュされた結果の転送が、タスクをローカルで実行するよりも遅くなる可能性があることに注意してください。

詳細については、Gradle のドキュメントの[Build cache](https://docs.gradle.org/current/userguide/build_cache.html)を参照してください。