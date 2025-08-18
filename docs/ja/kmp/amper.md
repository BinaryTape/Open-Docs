[//]: # (title: Amperでのプロジェクト設定)

[Amper](https://github.com/JetBrains/amper/tree/HEAD)は、JetBrainsが開発した新しいツールで、プロジェクトのビルド、パッケージング、公開などの設定に役立ちます。Amperを使用すると、ビルドシステムの扱いに費やす時間を削減し、代わりに実際のビジネス課題の解決に集中できます。

Amperを使用すると、JVM、Android、iOS、macOS、Linuxで動作するKotlin Multiplatformアプリケーション、およびこれらすべてのサポートされているターゲットで動作するマルチプラットフォームライブラリの構成ファイルを作成できます。

> Amperは現在[実験的 (Experimental)](supported-platforms.md#general-kotlin-stability-levels)です。
> Kotlin Multiplatformプロジェクトでお試しいただけます。
> [YouTrack](https://youtrack.jetbrains.com/issues/AMPER)でのフィードバックをお待ちしております。
>
{style="warning"}

## Amperの仕組み

Amperは現在、バックエンドとしてGradleを、プロジェクト構成を定義するフロントエンドとしてYAMLを使用しています。カスタムタスク、CocoaPods、Mavenへのライブラリ公開、およびGradleの相互運用を介したデスクトップアプリケーションのパッケージングをサポートしています。

Amperを使用すると、プラットフォーム固有のアプリケーションと共有Kotlinライブラリの構成を設定できます。これらは、特別な宣言型DSLを使用して、`.yaml`モジュールマニフェストファイル内でモジュールとして宣言されます。

このDSLの核となるコンセプトはKotlin Multiplatformです。Amperを使用すると、複雑なGradleの概念に深く踏み込むことなく、Kotlin Multiplatformプロジェクトを迅速かつ簡単に構成できます。Amper DSLは、依存関係や設定など、マルチプラットフォーム構成を扱うための特別な構文を提供します。

以下は、JVM、Android、iOSアプリケーションで使用できるKotlin Multiplatform共有ライブラリのAmperマニフェストファイルの例です。

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

*   `product`セクションは、プロジェクトの種類とターゲットプラットフォームのリストを定義します。
*   `dependencies`セクションは、KotlinおよびMavenの依存関係だけでなく、CocoaPodsやSwift Package Managerなどのプラットフォーム固有のパッケージマネージャーも追加します。
*   `@platform`修飾子は、依存関係や設定を含むプラットフォーム固有のセクションを示します。

## Amperを試す

Amperは以下のいずれかの方法で試すことができます。

*   JVMおよびAndroidプロジェクトでは、[IntelliJ IDEA](https://www.jetbrains.com/idea/nextversion/) 2023.3以降（ビルド233.11555以降）を使用する。
*   コマンドラインまたはCI/CDツールからAmperプロジェクトをビルドするには、[Gradle](https://docs.gradle.org/current/userguide/userguide.html)を使用する。

[このチュートリアル](https://github.com/JetBrains/amper/tree/HEAD/docs/Tutorial.md)に従って、Amperで最初のKotlin Multiplatformプロジェクトを作成してください。Amperの機能と設計についてさらに学ぶには、[ドキュメント](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)を参照してください。

ご意見がございましたら、お気軽に[課題トラッカー](https://youtrack.jetbrains.com/issues/AMPER)にご提出ください。皆様からのご意見は、Amperの将来を形作る上で役立ちます。

## 次のステップ

*   Amper開発の動機、ユースケース、プロジェクトの現状、将来についてさらに詳しく知るには、[JetBrainsブログ](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)をご覧ください。
*   よくある質問への回答を見つけるには、[Amper FAQ](https://github.com/JetBrains/amper/tree/HEAD/docs/FAQ.md)を参照してください。
*   Amperの機能と設計のさまざまな側面をカバーする[Amperドキュメント](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)をお読みください。