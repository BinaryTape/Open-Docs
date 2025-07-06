---
title: Koin Embedded
custom_edit_url: null
---

Koin Embeddedは、Android/Kotlin SDKおよびライブラリ開発者をターゲットとした、新しいKoinプロジェクトです。

このプロジェクトは、異なるパッケージ名でKoinプロジェクトを再ビルドおよびパッケージ化するのに役立つスクリプトを提案します。その目的は、SDKおよびライブラリ開発において、埋め込みKoinバージョンと、衝突する可能性のある別のKoinバージョンを使用する利用側のアプリケーションとの間の衝突を避けることです。

フィードバックやヘルプについては、[Koinチーム](mailto:koin@kotzilla.io)にお問い合わせください。

:::info
この取り組みは現在ベータ版であり、フィードバックを募集しています
:::

## 埋め込みバージョン (ベータ版)

こちらはKoin埋め込みバージョンの例です: [Kotzilla Repository](https://repository.kotzilla.io/#browse/browse:Koin-Embedded)
- 利用可能なパッケージ: `embedded-koin-core`、`embedded-koin-android`
- `org.koin.*`から`embedded.koin.*`へのリロケーション

Gradle設定でこのMavenリポジトリを設定してください:
```kotlin
maven { 'https://repository.kotzilla.io/repository/kotzilla-platform/' }
```

## リロケーションスクリプト (ベータ版)

こちらは、指定されたパッケージ名でKoinを再ビルドし、それを埋め込み、Koinフレームワークの通常の使用との衝突を避けるのに役立つスクリプトです。

詳細については、Koinの[リロケーションスクリプト](https://github.com/InsertKoinIO/koin-embedded?tab=readme-ov-file#koin-relocation-scripts)プロジェクトを参照してください。