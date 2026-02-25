[//]: # (title: 推奨されるIDEおよびコードエディタ)

## IntelliJ IDEA および Android Studio

[IntelliJ IDEA](https://www.jetbrains.com/idea/) は、Kotlin Multiplatform の完全なサポートを提供しています。
[Android Studio](https://developer.android.com/studio) も、Kotlin Multiplatform のためのもう一つの安定したソリューションです。
どちらも IntelliJ プラットフォームをベースに構築されているため、通常は同じ機能を共有しています。
ただし、特定のアップデートが同時にリリースされない場合があります。

IntelliJ IDEA 2025.2.2 または Android Studio Otter 2025.2.1 以降では、
iOS アプリの基本的な起動およびデバッグ機能、プリフライト環境チェック、およびその他の便利な KMP 機能を提供する [Kotlin Multiplatform IDE プラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)
をインストールできます。

ベースとなる Kotlin Multiplatform 機能に加えて、このプラグインは Compose Multiplatform 
ライブラリのサポートも提供しており、より快適な UI 開発を可能にします。

* マルチプラットフォームリソース向けの利便性向上（QOL）自動化。
* 共通（common）の Compose コードで動作する `@Preview` アノテーションのサポート。
* [Compose Hot Reload](compose-hot-reload.md) のサポート。これには、ホットリロード実行構成の自動検出、
  ログや設定との IDE 統合、および
  全体的な体験をよりスムーズにするための専用の IDE アクションやツールバーが含まれます。

## Xcode

Kotlin Multiplatform プロジェクトで iOS をターゲットにする場合、iOS 固有のコードを記述し、
iOS アプリケーションを実行するために、マシンに [Xcode](https://developer.apple.com/xcode/) をインストールする必要があります。

アプリを App Store Connect にアップロードするには、Xcode 16 以降でビルドしてください。

## その他の IDE およびコードエディタ

基本的な Kotlin Multiplatform サポートで十分な場合は、Kotlin をサポートする任意の IDE を使用できます。