[//]: # (title: Gradleのベストプラクティス)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html)は、ビルドプロセスを自動化および管理するために多くのKotlinプロジェクトで使用されているビルドシステムです。

Gradleを最大限に活用することは、ビルドの管理や待機に費やす時間を減らし、コーディングに多くの時間を費やすために不可欠です。ここでは、プロジェクトを**整理**し、**最適化**するという2つの主要な領域に分けられたベストプラクティスを提供します。

## 整理

このセクションでは、明確さ、保守性、スケーラビリティを向上させるためにGradleプロジェクトを構造化することに焦点を当てます。

### Kotlin DSLを使用する

従来のGroovy DSLの代わりにKotlin DSLを使用してください。別の言語を学ぶ必要がなくなり、厳密な型付けの恩恵を受けることができます。厳密な型付けにより、IDEはリファクタリングとオートコンプリートのより良いサポートを提供し、開発をより効率的にします。

詳細については、[GradleのKotlin DSL入門](https://docs.gradle.org/current/userguide/kotlin_dsl.html)を参照してください。

Gradleの[ブログ](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)で、Kotlin DSLがGradleビルドのデフォルトになったことについて読むことができます。

### バージョンカタログを使用する

`libs.versions.toml`ファイルでバージョンカタログを使用して、依存関係管理を一元化します。これにより、バージョン、ライブラリ、プラグインをプロジェクト間で一貫して定義および再利用できます。

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

以下の依存関係を`build.gradle.kts`ファイルに追加します。

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

詳細については、Gradleの[依存関係管理の基本](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)に関するドキュメントを参照してください。

### コンベンションプラグインを使用する

<primary-label ref="advanced"/>

複数のビルドファイル間で共通のビルドロジックをカプセル化し、再利用するためにコンベンションプラグインを使用します。共有設定をプラグインに移動することで、ビルドスクリプトを簡素化し、モジュール化するのに役立ちます。

初期のセットアップには時間がかかる場合がありますが、完了すればメンテナンスが容易になり、新しいビルドロジックの追加も簡単です。

詳細については、Gradleの[コンベンションプラグイン](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)に関するドキュメントを参照してください。

## 最適化

このセクションでは、Gradleビルドのパフォーマンスと効率を向上させるための戦略を提供します。

### ローカルビルドキャッシュを使用する

ローカルビルドキャッシュを使用して、他のビルドによって生成された出力を再利用することで時間を節約します。ビルドキャッシュは、すでに作成した以前のビルドからの出力を取得できます。

詳細については、Gradleの[ビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)に関するドキュメントを参照してください。

### 設定キャッシュを使用する

> 設定キャッシュはまだすべてのコアGradleプラグインをサポートしていません。最新の情報については、Gradleの[サポートされているプラグインの表](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)を参照してください。
>
{style="note"}

設定キャッシュを使用して、設定フェーズの結果をキャッシュし、後続のビルドで再利用することで、ビルドパフォーマンスを大幅に向上させます。Gradleがビルド設定または関連する依存関係に変更がないことを検出した場合、設定フェーズをスキップします。

詳細については、Gradleの[設定キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)に関するドキュメントを参照してください。

### 複数ターゲットのビルド時間を改善する

マルチプラットフォームプロジェクトに複数のターゲットが含まれている場合、`build`や`assemble`のようなタスクは、各ターゲットに対して同じコードを複数回コンパイルすることがあり、コンパイル時間の延長につながります。

特定のプラットフォームを活発に開発およびテストしている場合は、代わりに`linkDebug*`タスクを実行してください。

詳細については、「[コンパイル時間を改善するためのヒント](native-improving-compilation-time.md#gradle-configuration)」を参照してください。

### kaptからKSPへの移行

`kapt`コンパイラプラグインに依存するライブラリを使用している場合、代わりに`Kotlin Symbol Processing (KSP) API`の使用に切り替えられるかどうかを確認してください。`KSP API`はアノテーション処理時間を短縮することでビルドパフォーマンスを向上させます。`KSP`は、中間Javaスタブを生成せずにソースコードを直接処理するため、`kapt`よりも高速で効率的です。

移行手順については、Googleの[移行ガイド](https://developer.android.com/build/migrate-to-ksp)を参照してください。

`KSP`が`kapt`とどのように比較されるかについては、「[なぜKSPなのか](ksp-why-ksp.md)」を参照してください。

### モジュール化を使用する

<primary-label ref="advanced"/>

> モジュール化は、中規模から大規模のプロジェクトにのみメリットがあります。マイクロサービスアーキテクチャに基づくプロジェクトにはメリットを提供しません。
>
{style="note"}

モジュール化されたプロジェクト構造を使用して、ビルド速度を向上させ、より簡単な並行開発を可能にします。プロジェクトを1つのルートプロジェクトと1つ以上のサブプロジェクトに構造化します。変更がサブプロジェクトのいずれか1つにのみ影響する場合、Gradleはその特定のサブプロジェクトのみを再ビルドします。

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

詳細については、Gradleの[Gradleでのプロジェクト構造化](https://docs.gradle.org/current/userguide/multi_project_builds.html)に関するドキュメントを参照してください。

### CI/CDをセットアップする
<primary-label ref="advanced"/>

インクリメンタルビルドと依存関係のキャッシュを使用することで、ビルド時間を大幅に短縮するためにCI/CDプロセスをセットアップします。これらのメリットを得るには、永続ストレージを追加するか、リモートビルドキャッシュを使用します。[GitHub](https://github.com/features/actions)のような一部のプロバイダーは、このサービスをほぼそのまま提供しているため、このプロセスに時間がかかる必要はありません。

Gradleのコミュニティクックブック「[継続的インテグレーションシステムでのGradleの使用](https://cookbook.gradle.org/ci/)」を参照してください。

### リモートビルドキャッシュを使用する
<primary-label ref="advanced"/>

[ローカルビルドキャッシュ](#use-local-build-cache)と同様に、リモートビルドキャッシュは、他のビルドからの出力を再利用することで時間を節約するのに役立ちます。最後のビルドだけでなく、誰かがすでに実行した以前のビルドからのタスク出力を取得できます。

リモートビルドキャッシュは、キャッシュサーバーを使用してビルド間でタスク出力を共有します。例えば、CI/CDサーバーがある開発環境では、サーバー上のすべてのビルドがリモートキャッシュを生成します。新しい機能を始めるためにメインブランチをチェックアウトすると、すぐにインクリメンタルビルドにアクセスできます。

インターネット接続が遅いと、キャッシュされた結果の転送がローカルでのタスク実行よりも遅くなる可能性があることに留意してください。

詳細については、Gradleの[ビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)に関するドキュメントを参照してください。