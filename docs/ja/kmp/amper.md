[//]: # (title: Kotlin Toolchain によるプロジェクト構成)

[Kotlin Toolchain](https://kotlin-toolchain.org/) は、ビルド、パッケージング、パブリッシングなどのプロジェクト構成を支援するために JetBrains によって作成されたツールです。Kotlin Toolchain を使用すると、ビルドシステムの対応に費やす時間を減らし、代わりに実際のビジネス上の課題の解決に集中できます。

Kotlin Toolchain を使用すると、JVM、Android、iOS、macOS、Windows、および Linux で動作する Kotlin Multiplatform アプリケーションや、これらのサポートされているすべてのターゲットで動作するマルチプラットフォームライブラリの構成ファイルを作成できます。

> Kotlin Toolchain は [Alpha](supported-platforms.md#general-kotlin-stability-levels) です。
> ぜひ Kotlin Multiplatform プロジェクトでお試しください。
> フィードバックは [YouTrack](https://youtrack.jetbrains.com/issues/AMPER) にてお待ちしております。
>
{style="warning"}

## Kotlin Toolchain の仕組み

Kotlin Toolchain はスタンドアロンの CLI アプリケーションであり、YAML ファイルを使用してプロジェクトを構成できます。

Kotlin Toolchain を使用すると、プラットフォーム固有のアプリケーションや共有 Kotlin ライブラリをセットアップできます。これらは、特別な宣言型 DSL を使用して `module.yaml` マニフェストファイル内のモジュールとして宣言されます。

この DSL の核となる概念は Kotlin Multiplatform です。Kotlin Toolchain を使用すると、複雑な概念を深く掘り下げることなく、Kotlin Multiplatform プロジェクトを迅速かつ簡単に構成できます。Kotlin Toolchain DSL は、依存関係や設定など、マルチプラットフォーム構成を扱うための特別な構文を提供します。

以下は、JVM、Android、および iOS アプリケーションで使用できる Kotlin Multiplatform 共有ライブラリの Kotlin モジュールファイルの例です。

```yaml
product:
  type: kmp/lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64 ]

# 共有 Compose Multiplatform の依存関係:
dependencies:
  - $compose.foundation: exported
  - $compose.material3: exported

# Android 専用の依存関係  
dependencies@android:
  # Compose と Activity の統合
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

settings:
  # Kotlin serialization を有効化
  kotlin:
    serialization: json

  # Compose Multiplatform フレームワークを有効化
  compose:
    enabled: true
```

* `product` セクションは、プロジェクトのタイプとターゲットプラットフォームのリストを定義します。
* `dependencies` セクションは Maven 依存関係を追加します。将来的に CocoaPods や Swift Package Manager などのプラットフォーム固有のパッケージマネージャーをサポートする可能性があります。
* `$compose` 名前空間は、すべてのオプションの Compose モジュールへのアクセスを提供する組み込みのライブラリカタログです。
* `@platform` 修飾子は、依存関係や設定を含むプラットフォーム固有のセクションをマークします。

## Kotlin Toolchain を試す

実際に試してみるには、Kotlin Toolchain の [Getting Started ガイド](https://kotlin-toolchain.org/dev/getting-started/) を確認してください。

ご意見やご感想がありましたら、お気軽に [イシュートラッカー](https://jb.gg/amper-issues) までお寄せください。皆様からのフィードバックは、Kotlin Toolchain の将来を形作るのに役立ちます。

## 次のステップ

<!---
* Check out the [JetBrains blog](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)
  to learn more about our motivation behind creating Kotlin Toolchain, 
  its use cases, the current state of the project, and its future.
-->
* [Kotlin Toolchain のウェブサイト](https://kotlin-toolchain.org) をチェックして、ガイドや包括的なドキュメントを読んでください。