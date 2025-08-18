[//]: # (title: Compose Multiplatform 1.6.10 の新機能)

この機能リリースにおけるハイライトは以下のとおりです。

*   [破壊的変更: 新しいComposeコンパイラーGradleプラグイン](#breaking-change-new-compose-compiler-gradle-plugin)
*   [Compose Multiplatformリソースを使用したマルチモジュールプロジェクトのサポート](#support-for-multimodule-projects-with-compose-multiplatform-resources)
*   [実験的なナビゲーションライブラリ](#experimental-navigation-library)
*   [実験的な共通ViewModelを備えたライフサイクルライブラリ](#lifecycle-library)
*   [既知の問題: MissingResourceException](#known-issue-missingresourceexception)

このリリースの変更点の全リストは、[GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-may-2024)で確認できます。

## 依存関係

*   Gradleプラグイン `org.jetbrains.compose`、バージョン 1.6.10。Jetpack Composeライブラリに基づいています。
    *   [Compiler 1.5.14](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.14)
    *   [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
    *   [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
    *   [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
    *   [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
    *   [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
*   ライフサイクルライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0`。 [Jetpack Lifecycle 2.8.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0)に基づいています。
*   ナビゲーションライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha07`。 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)に基づいています。

## 破壊的変更: 新しいComposeコンパイラーGradleプラグイン

Kotlin 2.0.0以降、Compose Multiplatformは新しいComposeコンパイラーGradleプラグインを必要とします。
詳細については、[移行ガイド](compose-compiler.md#migrating-a-compose-multiplatform-project)を参照してください。

## クロスプラットフォーム

### リソース

#### 安定版リソースライブラリ

[リソースライブラリAPI](compose-multiplatform-resources.md)の大部分が安定版と見なされるようになりました。

#### Compose Multiplatformリソースを使用したマルチモジュールプロジェクトのサポート

Compose Multiplatform 1.6.10以降、リソースを任意のGradleモジュールおよび任意のソースセットに保存したり、
リソースを含んだプロジェクトやライブラリを公開したりできるようになりました。

マルチモジュールサポートを有効にするには、プロジェクトをKotlin 2.0.0以降、Gradle 7.6以降に更新してください。

#### マルチプラットフォームリソースの設定DSL

プロジェクト内の`Res`クラス生成を微調整できるようになりました。クラスのモダリティと割り当てられたパッケージを変更できるほか、常に生成する、決して生成しない、リソースライブラリへの明示的な依存関係がある場合にのみ生成するなど、生成条件を選択できます。

詳細については、[ドキュメントのセクション](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)を参照してください。

#### リソースURIを生成する公開関数

新しい`getUri()`関数を使用すると、プラットフォーム固有のリソースURIを外部ライブラリに渡して、ファイルに直接アクセスできるようになります。
詳細については、[ドキュメント](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)を参照してください。

#### 文字列リソースの複数形

他のマルチプラットフォーム文字列リソースとともに、複数形（数量文字列）を定義できるようになりました。
詳細については、[ドキュメント](compose-multiplatform-resources-usage.md#plurals)を参照してください。

#### 3文字ロケールのサポート

[言語修飾子](compose-multiplatform-resources-setup.md#language-and-regional-qualifiers)が、ロケール用のアルファ3 (ISO 639-2) コードをサポートするようになりました。

#### 画像とフォント用の実験的なバイト配列関数

フォントと画像をバイト配列として取得できる2つの関数、`getDrawableResourceBytes()`と`getFontResourceBytes()`を試すことができます。
これらの関数は、サードパーティライブラリからマルチプラットフォームリソースにアクセスするのに役立つことを目的としています。

詳細は[プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4651)を参照してください。

### 実験的なナビゲーションライブラリ

Jetpack Composeに基づいた共通ナビゲーションライブラリが利用可能になりました。
詳細については、[ドキュメント](compose-navigation-routing.md)を参照してください。

このバージョンの主な制限事項:
*   [ディープリンク](https://developer.android.com/guide/navigation/design/deep-link)（処理または追跡）はまだサポートされていません。
*   [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button)関数と[予測型戻るジェスチャー](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)は、Androidでのみサポートされています。

### ライフサイクルライブラリ

Jetpackライフサイクルに基づいた共通ライフサイクルライブラリが利用可能になりました。詳細は[ドキュメント](compose-lifecycle.md)を参照してください。

このライブラリは、主に共通ナビゲーション機能をサポートするために導入されましたが、実験的なクロスプラットフォーム`ViewModel`実装も提供し、プロジェクトで実装できる共通の`LifecycleOwner`インターフェースも含まれています。

Compose Multiplatformは、一般的な`ViewModelStoreOwner`実装も提供します。

### Kotlin 2.0.0のサポート

Kotlin 2.0.0は、Composeコンパイラー用の新しいGradleプラグインとともにリリースされました。
最新のコンパイラーバージョンでCompose Multiplatformを使用するには、プロジェクトのモジュールにプラグインを適用してください（詳細については[移行ガイド](compose-compiler.md#migrating-a-compose-multiplatform-project)を参照してください）。

## デスクトップ

### BasicTextField2の基本的なサポート

`BasicTextField2` Composeコンポーネントは、デスクトップターゲットで基本的なレベルでサポートされるようになりました。
プロジェクトで絶対に必要とする場合、またはテストするために使用できますが、未対応のエッジケースが存在する可能性があることに注意してください。
たとえば、`BasicTextField2`は現時点ではIMEイベントをサポートしていないため、中国語、日本語、韓国語の仮想キーボードは使用できません。

このコンポーネントの完全なサポートと他のプラットフォームのサポートは、Compose Multiplatform 1.7.0リリースで計画されています。

### DialogWindowのalwaysOnTopフラグ

ダイアログウィンドウが上書きされることを避けるため、`DialogWindow`コンポーザブルの`alwaysOnTop`フラグを使用できるようになりました。

詳細については、[プルリクエスト](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)を参照してください。

## iOS

### アクセシビリティサポートの改善

このリリースでは:

*   ダイアログとポップアップがアクセシビリティ機能と適切に統合されました。
*   `UIKitView`および`UIKitViewController`を使用して作成された相互運用ビューが、アクセシビリティサービスからアクセス可能になりました。
*   `LiveRegion`セマンティクスがアクセシビリティAPIでサポートされました。
*   [アクセシビリティスクロール](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)がサポートされました。
*   `HapticFeedback`がサポートされました。

### iOS 17以降の選択コンテナ拡大鏡

iOS上のCompose Multiplatform選択コンテナは、ネイティブの拡大ツールをエミュレートするようになりました。

![iPhoneチャットアプリのスクリーンショット（テキスト拡大鏡が有効な状態）](compose-1610-ios-magnifier.png){width=390}

### ダイアログ中央寄せのためのソフトウェアキーボードインセット

`Dialog`コンポーザブルの動作がAndroidと揃いました。ソフトウェアキーボードが画面に表示されると、ダイアログはアプリケーションウィンドウの有効な高さを考慮して中央に配置されるようになりました。
`DialogProperties.useSoftwareKeyboardInset`プロパティを使用してこれを無効にするオプションがあります。

## Web

### Kotlin/WasmサポートがAlphaに

Web向けの実験的Compose MultiplatformがAlphaになりました。

*   ほとんどのWeb機能はデスクトップ向けCompose Multiplatformとほぼ同じです。
*   チームはWebプラットフォームをリリースに導くことに尽力しています。
*   次のステップは、ほとんどのコンポーネントの徹底的なブラウザ適応です。

共有UIコードでWebアプリをセットアップして実行する方法については、[最初のアプリチュートリアル](quickstart.md)を参照してください。

### 基本的なIMEキーボードサポート

Compose MultiplatformのWebターゲットで、仮想（IME）キーボードの基本的なサポートが追加されました。

## Gradleプラグイン

### macOSの最小バージョンを変更する可能性

以前のバージョンでは、Intelバージョンを含めずにmacOSアプリをApp Storeにアップロードすることはできませんでした。
プラットフォーム固有のCompose Multiplatformオプションで、アプリのmacOSの最小バージョンを設定できるようになりました。

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

詳細については、[プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4271)を参照してください。

### ProGuardサポート付きのuber JARを作成するオプション

ProGuard Gradleタスクを使用して、uber JAR（アプリケーションとすべての依存関係のJARを含む複雑なパッケージ）を作成できるようになりました。

詳細については、[ミニファイと難読化](compose-native-distribution.md#minification-and-obfuscation)ガイドを参照してください。

### 既知の問題: MissingResourceException

Kotlin 1.9.xから2.0.0に切り替えた後（またはその逆）、`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...`エラーが発生する場合があります。
これを解決するには、プロジェクト内のすべての`build`ディレクトリを削除してください。
これには、プロジェクトのルートディレクトリとモジュールディレクトリにあるディレクトリが含まれます。