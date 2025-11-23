[//]: # (title: Amperでのプロジェクト設定)

[Amper](https://amper.org)は、JetBrainsが開発した新しいツールで、プロジェクトのビルド、パッケージング、公開などの設定に役立ちます。Amperを使用すると、ビルドシステムの扱いに費やす時間を削減し、代わりに実際のビジネス課題の解決に集中できます。

Amperを使用すると、JVM、Android、iOS、macOS、Windows、Linuxで動作するKotlin Multiplatformアプリケーション、およびこれらすべてのサポートされているターゲットで動作するマルチプラットフォームライブラリの構成ファイルを作成できます。

> Amperは現在[実験的 (Experimental)](supported-platforms.md#general-kotlin-stability-levels)です。
> Kotlin Multiplatformプロジェクトでお試しいただけます。
> [YouTrack](https://youtrack.jetbrains.com/issues/AMPER)でのフィードバックをお待ちしております。
>
{style="warning"}

## Amperの仕組み

AmperはスタンドアロンのCLIアプリケーションであり、YAMLファイルを使用してプロジェクトを構成できます。

Amperを使用すると、プラットフォーム固有のアプリケーションと共有Kotlinライブラリを設定できます。これらは、特別な宣言型DSLを使用して、`module.yaml`マニフェストファイル内でモジュールとして宣言されます。

このDSLの核となるコンセプトはKotlin Multiplatformです。Amperを使用すると、複雑な概念に深く踏み込むことなく、Kotlin Multiplatformプロジェクトを迅速かつ簡単に構成できます。Amper DSLは、依存関係や設定など、マルチプラットフォーム構成を扱うための特別な構文を提供します。

以下は、JVM、Android、iOSアプリケーションで使用できるKotlin Multiplatform共有ライブラリのAmperモジュールファイルの例です。

```yaml
product:
  type: lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64, iosX64 ]

# 共有Compose Multiplatformの依存関係:
dependencies:
  - org.jetbrains.compose.foundation:foundation:1.5.0-rc01: exported
  - org.jetbrains.compose.material3:material3:1.5.0-rc01: exported

# Androidのみの依存関係  
dependencies@android:
  # アクティビティとのCompose統合
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

settings:
  # Kotlinシリアライゼーションを有効にする
  kotlin:
    serialization: json

  # Compose Multiplatformフレームワークを有効にする
  compose: enabled
```

*   `product`セクションは、プロジェクトの種類とターゲットプラットフォームのリストを定義します。
*   `dependencies`セクションはMavenの依存関係を追加し、将来的にはCocoaPodsやSwift Package Managerなどのプラットフォーム固有のパッケージマネージャーもサポートする可能性があります。
*   `@platform`修飾子は、依存関係や設定を含むプラットフォーム固有のセクションを示します。

## Amperを試す

Amperの[Getting Startedガイド](https://jb.gg/amper/get-started)をチェックして、ご自身でお試しください。

ご意見がございましたら、お気軽に[課題トラッカー](https://jb.gg/amper-issues)にご提出ください。皆様からのご意見は、Amperの将来を形作る上で役立ちます。

## 次のステップ

*   Amper開発の動機、ユースケース、プロジェクトの現状、将来についてさらに詳しく知るには、[JetBrainsブログ](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)をご覧ください。
*   ガイドと包括的なドキュメントを読むには、[Amperウェブサイト](https://amper.org)をご覧ください。