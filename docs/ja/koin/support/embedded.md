---
title: Koin Embedded
custom_edit_url: null
---

Koin Embedded は、Android/Kotlin の SDK およびライブラリ開発者を対象とした新しい Koin プロジェクトです。

このプロジェクトは、Koin プロジェクトを別のパッケージ名でリビルドし、パッケージ化するためのスクリプトを提案します。この目的は SDK やライブラリの開発において、埋め込まれたバージョンの Koin と、別のバージョンの Koin を使用する可能性のある利用側のアプリケーションとの間での競合を回避することにあります。

フィードバックやサポートが必要ですか？ [Koin チーム](mailto:koin@kotzilla.io)までお問い合わせください。

:::info
この取り組みは現在ベータ版です。フィードバックをお待ちしております。
:::

## 埋め込みバージョン (ベータ版)

Koin 埋め込みバージョンの例は以下の通りです： [Kotzilla リポジトリ](https://repository.kotzilla.io/#browse/browse:Koin-Embedded)
- 利用可能なパッケージ: `embedded-koin-core`, `embedded-koin-android`
- `org.koin.*` から `embedded.koin.*` へのリロケーション（再配置）

以下の Maven リポジトリを使用して Gradle 設定を行ってください：
```kotlin
maven { 'https://repository.kotzilla.io/repository/kotzilla-platform/' }
```

## リロケーションスクリプト (ベータ版)

特定のパッケージ名で Koin をリビルドするのに役立つスクリプトがいくつかあります。これにより Koin を埋め込み、Koin フレームワークの通常の使用法との競合を回避できます。

詳細については、Koin [リロケーションスクリプト](https://github.com/InsertKoinIO/koin-embedded?tab=readme-ov-file#koin-relocation-scripts)プロジェクトを確認してください。