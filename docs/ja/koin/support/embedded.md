---
title: "Koin Embedded"
custom_edit_url: null
---
Koin Embedded は、Android/Kotlin SDK & Library の開発者を対象とした、新しい Koin プロジェクトです。

このプロジェクトは、異なるパッケージ名で Koin プロジェクトを再構築 & パッケージ化するためのスクリプトを提供します。これは SDK & Library 開発における、組み込みの Koin のバージョンと、別のバージョンの Koin を使用する可能性のある、コンシューミングアプリケーションとの間の競合を避けることを目的としています。

フィードバックや協力が必要ですか？ [Koin Team](mailto:koin@kotzilla.io) にご連絡ください。

## Embedded Version (組み込みバージョン)

Koin の組み込みバージョンの例：[Kotzilla Repository](https://repository.kotzilla.io/)
- 利用可能なパッケージ: `embedded-koin-core`、`embedded-koin-android`
- `org.koin.*` から `embedded.koin.*` へのリロケーション (再配置)

この Maven リポジトリで Gradle の設定を行います:
```kotlin
maven { 'https://repository.kotzilla.io/repository/kotzilla-platform/' }
```

## Relocation Scripts (リロケーションスクリプト)

Koin を特定パッケージ名で再構築し、組み込むことで、Koin フレームワークの通常の使用との競合を回避するためのスクリプトを以下に示します。

詳細は、Koin の[relocation scripts](https://github.com/InsertKoinIO/koin-embedded?tab=readme-ov-file) プロジェクトを参照してください。
    ```