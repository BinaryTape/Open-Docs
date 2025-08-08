[//]: # (title: Amperによるプロジェクト構成)

[Amper](https://github.com/JetBrains/amper/tree/HEAD)は、プロジェクトのビルド、パッケージング、公開などの構成を支援するためにJetBrainsが開発した新しいツールです。Amperを使用すると、ビルドシステムの対応に費やす時間を減らし、代わりに実際のビジネス課題の解決に集中できます。

Amperを使用すると、JVM、Android、iOS、macOS、Linuxで動作するKotlinマルチプラットフォームアプリケーション、およびこれらすべてのサポートされているターゲットで動作するマルチプラットフォームライブラリの構成ファイルを作成できます。

> Amperは現在[実験的 (Experimental)](supported-platforms.md#general-kotlin-stability-levels)です。
> ご自身のKotlinマルチプラットフォームプロジェクトでぜひお試しください。
> [YouTrack](https://youtrack.jetbrains.com/issues/AMPER)へのフィードバックをお待ちしております。
>
{style="warning"}

## Amperの仕組み

Amperは現在、バックエンドとしてGradleを、プロジェクト構成を定義するフロントエンドとしてYAMLを使用しています。カスタムタスク、CocoaPods、Mavenへのライブラリ公開、およびGradle連携を通じたデスクトップアプリケーションのパッケージングをサポートしています。

Amperを使用すると、プラットフォーム固有のアプリケーションと共有Kotlinライブラリの構成を設定できます。これらは、特殊な宣言型DSLを使用して、`.yaml`モジュールマニフェストファイル内でモジュールとして宣言されます。

このDSLの核となるコンセプトはKotlin Multiplatformです。Amperを使用すると、複雑なGradleの概念に深く踏み込むことなく、Kotlinマルチプラットフォームプロジェクトを素早く簡単に構成できます。Amper DSLは、依存関係、設定などを含むマルチプラットフォーム構成を扱うための特殊な構文を提供します。

以下は、JVM、Android、iOSアプリケーションで使用できるKotlinマルチプラットフォーム共有ライブラリのAmperマニフェストファイルの例です。

```yaml
product:
  type: lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64, iosX64 ]

# Shared Compose Multiplatform dependencies:
dependencies:
  - org.jetbrains.compose.foundation:foundation:1.5.0-rc01: exported
  - org.jetbrains.compose.material3:material3:1.5.0-rc01: exported

# Android-only dependencies  
dependencies@android:
  # Integration compose with activities
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

# iOS-only dependencies with a dependency on a CocoaPod
# Note that CocoaPods dependencies are not yet implemented in the prototype
dependencies@ios:
  - pod: 'FirebaseCore'
    version: '~> 6.6'

settings:
  # Enable Kotlin serialization
  kotlin:
    serialization: json

  # Enable Compose Multiplatform framework
  compose: enabled
```

*   `product`セクションは、プロジェクトタイプとターゲットプラットフォームのリストを定義します。
*   `dependencies`セクションは、KotlinおよびMavenの依存関係だけでなく、CocoaPodsやSwift Package Managerなどのプラットフォーム固有のパッケージマネージャーも追加します。
*   `@platform`修飾子は、依存関係や設定を含むプラットフォーム固有のセクションを示します。

## Amperを試す

Amperは以下のいずれかの方法で試すことができます。

*   JVMおよびAndroidプロジェクト向けに[IntelliJ IDEA](https://www.jetbrains.com/idea/nextversion/) 2023.3以降（ビルド233.11555から）を使用します。
*   コマンドラインまたはCI/CDツールからAmperプロジェクトをビルドするために[Gradle](https://docs.gradle.org/current/userguide/userguide.html)を使用します。

[このチュートリアル](https://github.com/JetBrains/amper/tree/HEAD/docs/Tutorial.md)に従って、Amperで最初のKotlinマルチプラットフォームプロジェクトを作成してください。[ドキュメント](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)を探索して、Amperの機能と設計について詳しく学んでください。

お持ちのフィードバックは、[イシュートラッカー](https://youtrack.jetbrains.com/issues/AMPER)までお気軽にお寄せください。皆様のご意見は、Amperの未来を形作るのに役立ちます。

## 次のステップ

*   [JetBrainsブログ](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)で、Amperを開発した動機、ユースケース、プロジェクトの現状、そして将来について詳しく確認してください。
*   [Amper FAQ](https://github.com/JetBrains/amper/tree/HEAD/docs/FAQ.md)で、よくある質問に対する回答を見つけてください。
*   Amperの機能と設計のさまざまな側面を網羅した[Amperドキュメント](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)を読んでください。