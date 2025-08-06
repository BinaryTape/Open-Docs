[//]: # (title: Gradle のベストプラクティス)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html) は、多くの Kotlin プロジェクトでビルドプロセスを自動化および管理するために使用されるビルドシステムです。

Gradle を最大限に活用することは、ビルドの管理や待機に費やす時間を減らし、より多くの時間をコーディングに費やすために不可欠です。ここでは、プロジェクトの**整理**と**最適化**という2つの主要な領域に分けられた一連のベストプラクティスを提供します。

## 整理

このセクションでは、明確さ、保守性、スケーラビリティを向上させるための Gradle プロジェクトの構造化に焦点を当てます。

### Kotlin DSL を使用する

従来の Groovy DSL の代わりに Kotlin DSL を使用します。これにより、別の言語を学習する手間が省け、厳密な型付けの利点が得られます。厳密な型付けにより、IDE はリファクタリングとオートコンプリートのサポートを向上させ、開発をより効率的にします。

詳細については、[Gradle の Kotlin DSL 入門](https://docs.gradle.org/current/userguide/kotlin_dsl.html)を参照してください。

Kotlin DSL が Gradle ビルドのデフォルトになったことについては、Gradle の[ブログ](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)を読んでください。

### バージョンカタログを使用する

`libs.versions.toml` ファイルでバージョンカタログを使用して、依存関係管理を一元化します。これにより、バージョン、ライブラリ、プラグインをプロジェクト間で一貫して定義および再利用できます。

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

以下の依存関係を `build.gradle.kts` ファイルに追加します。

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

詳細については、Gradle のドキュメントの[依存関係管理の基本](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)を参照してください。

### コンベンションプラグインを使用する

<primary-label ref="advanced"/>

コンベンションプラグインを使用して、複数のビルドファイルにわたる共通のビルドロジックをカプセル化し、再利用します。共有設定をプラグインに移動すると、ビルドスクリプトの簡素化とモジュール化に役立ちます。

初期設定には時間がかかる場合がありますが、完了すればメンテナンスや新しいビルドロジックの追加が容易になります。

詳細については、Gradle のドキュメントの[コンベンションプラグイン](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)を参照してください。

## 最適化

このセクションでは、Gradle ビルドのパフォーマンスと効率を向上させる戦略を提供します。

### ローカルビルドキャッシュを使用する

ローカルビルドキャッシュを使用して、他のビルドで生成された出力を再利用することで時間を節約します。ビルドキャッシュは、以前に作成したすべてのビルドから出力を取得できます。

詳細については、Gradle のドキュメントの[ビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)を参照してください。

### 設定キャッシュを使用する

> 設定キャッシュは、まだすべてのコア Gradle プラグインをサポートしていません。最新情報については、Gradle の[サポートされているプラグインの表](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)を参照してください。
>
{style="note"}

設定キャッシュを使用して、設定フェーズの結果をキャッシュし、後続のビルドで再利用することで、ビルドパフォーマンスを大幅に向上させます。Gradle がビルド設定または関連する依存関係に変更がないことを検出した場合、設定フェーズをスキップします。

詳細については、Gradle のドキュメントの[設定キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)を参照してください。

### 複数のターゲットのビルド時間を改善する

マルチプラットフォームプロジェクトに複数のターゲットが含まれている場合、`build` や `assemble` などのタスクは、各ターゲットに対して同じコードを複数回コンパイルし、コンパイル時間の延長につながる可能性があります。

特定のプラットフォームを積極的に開発およびテストしている場合は、代わりに該当する `linkDebug*` タスクを実行してください。

詳細については、[コンパイル時間を改善するためのヒント](native-improving-compilation-time.md#gradle-configuration)を参照してください。

### kapt から KSP へ移行する

[kapt](kapt.md) コンパイラプラグインに依存するライブラリを使用している場合は、代わりに [Kotlin Symbol Processing (KSP) API](ksp-overview.md) の使用に切り替えられるかどうかを確認してください。KSP API は、アノテーション処理時間を短縮することでビルドパフォーマンスを向上させます。KSP は、中間 Java スタブを生成することなくソースコードを直接処理するため、kapt よりも高速で効率的です。

移行手順については、Google の[移行ガイド](https://developer.android.com/build/migrate-to-ksp)を参照してください。

KSP と kapt の比較について詳しく知るには、[なぜ KSP なのか](ksp-why-ksp.md)を確認してください。

### モジュール化を使用する

<primary-label ref="advanced"/>

> モジュール化は、中規模から大規模のプロジェクトにのみメリットがあります。マイクロサービスアーキテクチャに基づくプロジェクトには利点を提供しません。
>
{style="note"}

モジュール化されたプロジェクト構造を使用して、ビルド速度を向上させ、並行開発を容易にします。プロジェクトを1つのルートプロジェクトと1つ以上のサブプロジェクトに構成します。変更がサブプロジェクトの1つのみに影響する場合、Gradle はその特定のサブプロジェクトのみを再ビルドします。

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

詳細については、Gradle のドキュメントの[Gradle を使用したプロジェクトの構造化](https://docs.gradle.org/current/userguide/multi_project_builds.html)を参照してください。

### CI/CD をセットアップする

<primary-label ref="advanced"/>

インクリメンタルビルドと依存関係のキャッシュを使用することで、ビルド時間を大幅に短縮するために CI/CD プロセスをセットアップします。これらの利点を得るには、永続ストレージを追加するか、リモートビルドキャッシュを使用します。[GitHub](https://github.com/features/actions) のような一部のプロバイダーは、このサービスをほぼすぐに利用できる形で提供しているため、このプロセスは時間のかかるものである必要はありません。

[継続的インテグレーションシステムでの Gradle の使用](https://cookbook.gradle.org/ci/)に関する Gradle のコミュニティクックブックを確認してください。

### リモートビルドキャッシュを使用する

<primary-label ref="advanced"/>

[ローカルビルドキャッシュ](#use-local-build-cache)と同様に、リモートビルドキャッシュは、他のビルドからの出力を再利用することで時間を節約するのに役立ちます。それは、最後のビルドだけでなく、誰かがすでに実行した以前のすべてのビルドからタスク出力を取得できます。

リモートビルドキャッシュは、キャッシュサーバーを使用してビルド間でタスク出力を共有します。たとえば、CI/CD サーバーがある開発環境では、サーバー上のすべてのビルドによってリモートキャッシュが埋められます。新しい機能を開発するためにメインブランチをチェックアウトすると、すぐにインクリメンタルビルドにアクセスできます。

インターネット接続が遅い場合、キャッシュされた結果の転送がタスクをローカルで実行するよりも遅くなる可能性があることに留意してください。

詳細については、Gradle のドキュメントの[ビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)を参照してください。