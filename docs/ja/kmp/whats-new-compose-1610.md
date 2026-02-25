[//]: # (title: Compose Multiplatform 1.6.10 の新機能)

この機能リリースのハイライトは以下の通りです：

* [破壊的変更：新しい Compose コンパイラ Gradle プラグイン](#breaking-change-new-compose-compiler-gradle-plugin)
* [Compose Multiplatform リソースを使用したマルチモジュールプロジェクトのサポート](#support-for-multimodule-projects-with-compose-multiplatform-resources)
* [実験的なナビゲーションライブラリ](#experimental-navigation-library)
* [実験的な共通 ViewModel を含む Lifecycle ライブラリ](#lifecycle-library)
* [既知の問題：MissingResourceException](#known-issue-missingresourceexception)

このリリースの変更点の完全なリストは、[GitHub 上](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-may-2024)で確認できます。

## 依存関係

* Gradle プラグイン `org.jetbrains.compose`、バージョン 1.6.10。以下の Jetpack Compose ライブラリに基づいています：
  * [Compiler 1.5.14](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.14)
  * [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
  * [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
  * [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
  * [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
  * [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
* Lifecycle ライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0`。[Jetpack Lifecycle 2.8.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0) に基づいています。
* Navigation ライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha07`。[Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7) に基づいています。

## 破壊的変更：新しい Compose コンパイラ Gradle プラグイン

Kotlin 2.0.0 以降、Compose Multiplatform は新しい Compose コンパイラ Gradle プラグインを必要とします。
詳細は[マイグレーションガイド](compose-compiler.md#migrating-a-compose-multiplatform-project)を参照してください。

## プラットフォーム共通

### リソース

#### 安定版リソースライブラリ

[リソースライブラリ API](compose-multiplatform-resources.md) の大部分が安定版（Stable）とみなされるようになりました。

#### Compose Multiplatform リソースを使用したマルチモジュールプロジェクトのサポート

Compose Multiplatform 1.6.10 以降、任意の Gradle モジュールおよび任意のソースセットにリソースを保存できるようになり、リソースを含んだプロジェクトやライブラリを公開することも可能になりました。

マルチモジュールのサポートを有効にするには、プロジェクトを Kotlin バージョン 2.0.0 以降、および Gradle 7.6 以降にアップデートしてください。

#### マルチプラットフォームリソース用の設定 DSL

プロジェクト内での `Res` クラス生成を微調整できるようになりました。クラスのモダリティ（modality）や割り当てられるパッケージを変更したり、生成の条件（常に生成、生成しない、またはリソースライブラリへの明示的な依存関係がある場合のみ生成）を選択したりできます。

詳細は[ドキュメントのセクション](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)を参照してください。

#### リソース URI 生成用の公開関数

新しい `getUri()` 関数を使用すると、リソースのプラットフォーム依存の URI を外部ライブラリに渡すことができ、それらのライブラリがファイルに直接アクセスできるようになります。
詳細は[ドキュメント](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)を参照してください。

#### 文字列リソースの複数形対応

他のマルチプラットフォーム文字列リソースと同様に、複数形（quantity strings）を定義できるようになりました。
詳細は[ドキュメント](compose-multiplatform-resources-usage.md#plurals)を参照してください。

#### 3文字のロケールのサポート

[言語修飾子（Language qualifiers）](compose-multiplatform-resources-setup.md#language-and-regional-qualifiers)で、ロケールの alpha-3 (ISO 639-2) コードがサポートされました。

#### 画像およびフォント用の実験的なバイト配列関数

フォントや画像をバイト配列として取得できる 2 つの関数、`getDrawableResourceBytes()` と `getFontResourceBytes()` を試すことができます。
これらの関数は、サードパーティライブラリからマルチプラットフォームリソースにアクセスするのを支援することを目的としています。

詳細は [プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4651) を確認してください。

### 実験的なナビゲーションライブラリ

Jetpack Compose に基づいた共通ナビゲーションライブラリが利用可能になりました。
詳細は[ドキュメント](compose-navigation-routing.md)を参照してください。

このバージョンにおける主な制限事項：
* [ディープリンク](https://developer.android.com/guide/navigation/design/deep-link)（処理または追従）はまだサポートされていません。
* [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) 関数および[予測型「戻る」ジェスチャー（predictive back gestures）](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)は Android でのみサポートされています。

### Lifecycle ライブラリ

Jetpack Lifecycle に基づいた共通 Lifecycle ライブラリが利用可能になりました。詳細は[ドキュメント](compose-lifecycle.md)を参照してください。

このライブラリは主に共通ナビゲーション機能をサポートするために導入されましたが、実験的なクロスプラットフォーム `ViewModel` 実装も提供しており、プロジェクトで実装可能な共通 `LifecycleOwner` インターフェースも含まれています。

Compose Multiplatform は、一般的な `ViewModelStoreOwner` 実装も提供します。

### Kotlin 2.0.0 のサポート

Kotlin 2.0.0 が、新しい Compose コンパイラ用 Gradle プラグインと共にリリースされました。
最新のコンパイラバージョンで Compose Multiplatform を使用するには、プロジェクトのモジュールにプラグインを適用してください（詳細は[マイグレーションガイド](compose-compiler.md#migrating-a-compose-multiplatform-project)を参照してください）。

## デスクトップ

### BasicTextField2 の基本サポート

`BasicTextField2` Compose コンポーネントが、デスクトップターゲットでベースレベルでサポートされました。
プロジェクトでどうしても必要な場合やテスト目的で使用してください。ただし、カバーされていないエッジケースがある可能性があることに注意してください。
たとえば、`BasicTextField2` は現時点では IME イベントをサポートしていないため、中国語、日本語、韓国語の仮想キーボードを使用することはできません。

このコンポーネントの完全なサポートおよび他のプラットフォームへのサポートは、Compose Multiplatform 1.7.0 リリースで計画されています。

### DialogWindow 用の alwaysOnTop フラグ

ダイアログウィンドウが他のウィンドウに隠れてしまうのを防ぐために、`DialogWindow` コンポーザブルで `alwaysOnTop` フラグを使用できるようになりました。

詳細は [プルリクエスト](https://github.com/JetBrains/compose-multiplatform-core/pull/1120) を確認してください。

## iOS

### アクセシビリティサポートの改善

このリリースでは以下の通りです：

* ダイアログとポップアップがアクセシビリティ機能と適切に統合されました。
* `UIKitView` および `UIKitViewController` を使用して作成された相互運用（interop）ビューが、アクセシビリティサービスからアクセス可能になりました。
* `LiveRegion` セマンティクスがアクセシビリティ API でサポートされました。
* [アクセシビリティスクロール](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)がサポートされました。
* `HapticFeedback` がサポートされました。

### iOS 17 以上での選択コンテナの拡大鏡

iOS 上の Compose Multiplatform 選択コンテナが、ネイティブの拡大ツール（magnifier）をエミュレートするようになりました。

![テキスト拡大鏡がアクティブな iPhone チャットアプリのスクリーンショット](compose-1610-ios-magnifier.png){width=390}

### ダイアログ中央配置のためのソフトウェアキーボードインセット

`Dialog` コンポーザブルの動作が Android と共通化されました。画面にソフトウェアキーボードが表示されたとき、アプリケーションウィンドウの有効な高さを考慮してダイアログが中央に配置されます。
`DialogProperties.useSoftwareKeyboardInset` プロパティを使用して、この動作を無効にするオプションもあります。

## Web

### Kotlin/Wasm サポートが Alpha に

実験的な Compose Multiplatform for Web が Alpha になりました：

* Web 機能のほとんどは Compose Multiplatform for Desktop を反映しています。
* チームは Web プラットフォームのリリースに向けて取り組んでいます。
* 次のステップは、ほとんどのコンポーネントの徹底的なブラウザ適応です。

UI コードを共有した Web アプリの設定と実行方法については、[最初のアプリのチュートリアル](quickstart.md)に従ってください。

### 基本的な IME キーボードのサポート

Compose Multiplatform の Web ターゲットで、仮想（IME）キーボードの基本的なサポートが追加されました。

## Gradle プラグイン

### macOS 最小バージョンの変更が可能に

以前のバージョンでは、Intel バージョンを含めずに macOS アプリを App Store にアップロードすることはできませんでした。
プラットフォーム固有の Compose Multiplatform オプションで、アプリの最小 macOS バージョンを設定できるようになりました。

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

詳細は [プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4271) を確認してください。

### ProGuard サポート付きの uber JAR を作成するオプション

ProGuard Gradle タスクを使用して、uber JAR（アプリケーションとすべての依存関係の JAR を含む複雑なパッケージ）を作成できるようになりました。

詳細は[最小化と難読化](compose-native-distribution.md#minification-and-obfuscation)ガイドを参照してください。

### 既知の問題：MissingResourceException

Kotlin 1.9.x から 2.0.0 に切り替えた際（またはその逆）、`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` エラーが発生することがあります。
これを解決するには、プロジェクト内のすべての `build` ディレクトリを削除してください。これには、プロジェクトのルートおよびモジュールディレクトリにあるディレクトリが含まれます。