[//]: # (title: Compose Multiplatform 1.6.10-rc02 の新機能)

この EAP 機能リリースの主なハイライトは以下の通りです：

* [Compose Multiplatform リソースを使用したマルチモジュールプロジェクトのサポート](#support-for-multimodule-projects-with-compose-multiplatform-resources)
* [実験的なナビゲーションライブラリ](#experimental-navigation-library)
* [実験的な共通 ViewModel を含む Lifecycle ライブラリ](#lifecycle-library)
* [既知の問題](#known-issues)

このリリースの変更点の完全なリストについては、[GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-beta01-april-2024) を参照してください。

## 依存関係

* Gradle プラグイン `org.jetbrains.compose`、バージョン 1.6.10-rc01。以下の Jetpack Compose ライブラリに基づいています：
  * [Compiler 1.5.13](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.13)
  * [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
  * [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
  * [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
  * [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
  * [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
* Lifecycle ライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0-rc02`。[Jetpack Lifecycle 2.8.0-rc01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0-rc01) に基づいています。
* Navigation ライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha05`。[Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7) に基づいています。

## 破壊的変更

### Kotlin 2.0.0 には新しい Compose コンパイラ Gradle プラグインが必要

Kotlin 2.0.0-RC2 以降、Compose Multiplatform には新しい Compose コンパイラ Gradle プラグインが必要になります。
詳細は [移行ガイド](compose-compiler.md#migrating-a-compose-multiplatform-project) を参照してください。

## プラットフォーム共通

### リソース

#### 安定版リソースライブラリ

[リソースライブラリ API](compose-multiplatform-resources.md) の大部分が安定版と見なされるようになりました。

#### Compose Multiplatform リソースを使用したマルチモジュールプロジェクトのサポート

Compose Multiplatform 1.6.10-beta01 以降、
リソースを任意の Gradle モジュールや任意のソースセットに保存できるようになり、リソースを含んだ状態でプロジェクトやライブラリを公開できるようになりました。

マルチモジュールサポートを有効にするには、プロジェクトを Kotlin バージョン 2.0.0 以降、および Gradle 7.6 以降に更新してください。

#### マルチプラットフォームリソースの設定 DSL

プロジェクトでの `Res` クラス生成を微調整できるようになりました。クラスのモダリティや割り当てられるパッケージを変更したり、生成の条件（常に生成、生成しない、またはリソースライブラリへの明示的な依存関係がある場合のみ生成）を選択したりできます。

詳細は [ドキュメントのセクション](compose-multiplatform-resources.md#configuration) を参照してください。

#### リソース URI 生成用のパブリック関数

新しい `getUri()` 関数を使用すると、リソースのプラットフォーム依存の URI を外部ライブラリに渡して、ライブラリがファイルに直接アクセスできるようになります。
詳細は [ドキュメント](compose-multiplatform-resources.md#accessing-multiplatform-resources-from-external-libraries) を参照してください。

#### 文字列リソースの複数形

他のマルチプラットフォーム文字列リソースとともに、複数形（quantity strings）を定義できるようになりました。
詳細は [ドキュメント](compose-multiplatform-resources.md#plurals) を参照してください。

#### 3文字のロケールをサポート

[言語修飾子](compose-multiplatform-resources.md#language-and-regional-qualifiers) で、ロケールの alpha-3 (ISO 639-2) コードがサポートされました。

#### 画像およびフォント用の実験的なバイト配列関数

フォントや画像をバイト配列として取得できる 2 つの関数 `getDrawableResourceBytes` と `getFontResourceBytes` を試すことができます。
これらの関数は、サードパーティライブラリからマルチプラットフォームリソースにアクセスするのを支援することを目的としています。

詳細は [プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4651) を参照してください。

### 実験的なナビゲーションライブラリ

Jetpack Compose に基づく共通ナビゲーションライブラリが利用可能になりました。
詳細は [ドキュメント](compose-navigation-routing.md) を参照してください。

このバージョンにおける主な制限事項：
* [ディープリンク](https://developer.android.com/guide/navigation/design/deep-link)（処理または追従）はまだサポートされていません。
* [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) 関数および [予測型戻るジェスチャー](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture) は Android でのみサポートされています。

### Lifecycle ライブラリ

Jetpack lifecycle に基づく共通 Lifecycle ライブラリが利用可能になりました。詳細は [ドキュメント](compose-lifecycle.md) を参照してください。

このライブラリは主に共通ナビゲーション機能をサポートするために導入されましたが、実験的なクロスプラットフォームの `ViewModel` 実装も提供しており、プロジェクトで実装可能な共通の `LifecycleOwner` インターフェースも含まれています。

Compose Multiplatform は、一般的な `ViewModelStoreOwner` 実装も提供します。

### Kotlin 2.0.0 のサポート

Kotlin 2.0.0-RC2 が、Compose コンパイラ用の新しい Gradle プラグインとともにリリースされました。
最新のコンパイラバージョンで Compose Multiplatform を使用するには、プロジェクトのモジュールにプラグインを適用してください（詳細は [移行ガイド](compose-compiler.md#migrating-a-compose-multiplatform-project) を参照）。

## デスクトップ

### BasicTextField2 の基本的なサポート

`BasicTextField2` Compose コンポーネントが、デスクトップターゲットで基本レベルでサポートされるようになりました。
プロジェクトで絶対に必要な場合やテスト目的で使用してください。ただし、カバーされていないエッジケースがある可能性があることに注意してください。
例えば、`BasicTextField2` は現在 IME イベントをサポートしていないため、中国語、日本語、または韓国語の仮想キーボードを使用することはできません。

このコンポーネントの完全なサポートおよび他のプラットフォームへの対応は、Compose Multiplatform 1.7.0 リリースで計画されています。

### DialogWindow の alwaysOnTop フラグ

ダイアログウィンドウが他のウィンドウに隠れてしまうのを防ぐために、`DialogWindow` コンポーザブルで `alwaysOnTop` フラグを使用できるようになりました。

詳細は [プルリクエスト](https://github.com/JetBrains/compose-multiplatform-core/pull/1120) を参照してください。

## iOS

### アクセシビリティサポートの改善

このリリースでは以下の通りです：

* ダイアログとポップアップがアクセシビリティ機能に適切に統合されました。
* `UIKitView` および `UIKitViewController` を使用して作成された相互運用ビューが、アクセシビリティサービスからアクセス可能になりました。
* `LiveRegion` セマンティクスがアクセシビリティ API でサポートされました。
* [アクセシビリティスクロール](https://github.com/JetBrains/compose-multiplatform-core/pull/1169) がサポートされました。
* `HapticFeedback` がサポートされました。

### iOS 17 以降の選択コンテナ拡大鏡

iOS 上の Compose Multiplatform 選択コンテナが、ネイティブの拡大鏡ツールをエミュレートするようになりました。

![テキスト拡大鏡がアクティブな iPhone チャットアプリのスクリーンショット](compose-1610-ios-magnifier.png){width=390}

### Dialog 中央配置のためのソフトウェアキーボードインセット

`Dialog` コンポーザブルの動作が Android と共通化されました。ソフトウェアキーボードが画面に表示される際、アプリケーションウィンドウの実効高さを考慮してダイアログが中央に配置されます。
`DialogProperties.useSoftwareKeyboardInset` プロパティを使用して、この動作を無効にするオプションもあります。

## Web

### 基本的な IME キーボードのサポート

Compose Multiplatform の Web ターゲットで、仮想（IME）キーボードの基本的なサポートが追加されました。

## Gradle プラグイン

### macOS の最小バージョンの変更が可能に

以前のバージョンでは、Intel バージョンを含めずに macOS アプリを App Store にアップロードすることはできませんでした。
プラットフォーム固有の Compose Multiplatform オプションで、アプリの最小 macOS バージョンを設定できるようになりました：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                minimumSystemVersion = "12.0"
            }
        }
    }
}
```

詳細は [プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4271) を参照してください。

### ProGuard サポート付きの uber JAR を作成するオプション

ProGuard Gradle タスクを使用して、uber JAR（アプリケーションとすべての依存関係の JAR を含む複雑なパッケージ）を作成できるようになりました。

詳細は [プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4136) を参照してください。

<!--TODO add link to the GitHub tutorial mentioned in PR when it's updated  -->

## 既知の問題

### MissingResourceException

Kotlin バージョンを 1.9.x から 2.0.0 に変更した際（またはその逆）、`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` エラーが発生することがあります。
これを解決するには、プロジェクト内の `build` ディレクトリを削除してください。これには、プロジェクトのルートフォルダとモジュールフォルダにあるフォルダが含まれます。

### NativeCodeGeneratorException

一部のプロジェクトで、以下のエラーにより iOS のコンパイルが失敗する場合があります：

```
org.jetbrains.kotlin.backend.konan.llvm.NativeCodeGeneratorException: Exception during generating code for following declaration: private fun $init_global()
```

詳細は [GitHub イシュー](https://github.com/JetBrains/compose-multiplatform/issues/4809) を確認してください。