[//]: # (title: Compose Multiplatform 1.6.10-rc02 の新機能)

今回のEAP機能リリースでの主な変更点は以下のとおりです。

*   [Compose Multiplatformリソースを使用したマルチモジュールプロジェクトのサポート](#support-for-multimodule-projects-with-compose-multiplatform-resources)
*   [実験的なナビゲーションライブラリ](#experimental-navigation-library)
*   [実験的な共通ViewModelを備えたライフサイクルライブラリ](#lifecycle-library)
*   [既知の問題](#known-issues)

このリリースの変更点の全リストは、[GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-beta01-april-2024)で確認できます。

## 依存関係

*   Gradleプラグイン `org.jetbrains.compose`、バージョン 1.6.10-rc01。Jetpack Composeライブラリに基づいています。
    *   [Compiler 1.5.13](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.13)
    *   [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
    *   [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
    *   [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
    *   [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
    *   [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
*   ライフサイクルライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0-rc02`。[Jetpack Lifecycle 2.8.0-rc01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0-rc01)に基づいています。
*   ナビゲーションライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha05`。[Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)に基づいています。

## 破壊的変更

### Kotlin 2.0.0には新しいComposeコンパイラGradleプラグインが必要です

Kotlin 2.0.0-RC2以降、Compose Multiplatformは新しいComposeコンパイラGradleプラグインを必要とします。
詳細は[移行ガイド](compose-compiler.md#migrating-a-compose-multiplatform-project)を参照してください。

## 全プラットフォーム共通

### リソース

#### 安定版リソースライブラリ

[リソースライブラリAPI](compose-multiplatform-resources.md)の大部分が安定版と見なされるようになりました。

#### Compose Multiplatformリソースを使用したマルチモジュールプロジェクトのサポート

Compose Multiplatform 1.6.10-beta01以降、リソースを任意のGradleモジュールおよび任意のソースセットに保存し、リソースを含むプロジェクトやライブラリを公開できるようになりました。

マルチモジュールサポートを有効にするには、プロジェクトをKotlinバージョン2.0.0以降およびGradle 7.6以降に更新してください。

#### マルチプラットフォームリソースのための設定DSL

プロジェクトでの`Res`クラスの生成を細かく調整できるようになりました。クラスのモダリティと割り当てられたパッケージを変更したり、常に、決して、またはリソースライブラリへの明示的な依存関係がある場合にのみ、生成条件を選択したりできます。

詳細は[ドキュメントのセクション](compose-multiplatform-resources.md#configuration)を参照してください。

#### リソースURIを生成する公開関数

新しい`getUri()`関数を使用すると、プラットフォーム依存のURIを外部ライブラリに渡し、ファイルを直接アクセスできるようになります。
詳細は[ドキュメント](compose-multiplatform-resources.md#accessing-multiplatform-resources-from-external-libraries)を参照してください。

#### 文字列リソースの複数形

他のマルチプラットフォーム文字列リソースとともに、複数形（数量文字列）を定義できるようになりました。
詳細は[ドキュメント](compose-multiplatform-resources.md#plurals)を参照してください。

#### 3文字ロケールのサポート

[言語修飾子](compose-multiplatform-resources.md#language-and-regional-qualifiers)が、ロケールにアルファ3（ISO 639-2）コードをサポートするようになりました。

#### 画像とフォントのための実験的なバイト配列関数

画像とフォントをバイト配列として取得できる2つの関数、`getDrawableResourceBytes`と`getFontResourceBytes`を試すことができます。
これらの関数は、サードパーティライブラリからマルチプラットフォームリソースにアクセスするのに役立ちます。

詳細は[プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4651)を参照してください。

### 実験的なナビゲーションライブラリ

Jetpack Composeに基づいた共通ナビゲーションライブラリが利用可能になりました。
詳細は[ドキュメント](compose-navigation-routing.md)を参照してください。

このバージョンの主な制限事項:
*   [ディープリンク](https://developer.android.com/guide/navigation/design/deep-link)（その処理または追跡）はまだサポートされていません。
*   [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button)関数と[予測型戻るジェスチャー](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)はAndroidでのみサポートされています。

### ライフサイクルライブラリ

Jetpackライフサイクルに基づいた共通ライフサイクルライブラリが利用可能になりました。詳細は[ドキュメント](compose-lifecycle.md)を参照してください。

このライブラリは、主に共通ナビゲーション機能をサポートするために導入されましたが、実験的なクロスプラットフォーム`ViewModel`実装も提供し、プロジェクトに実装できる共通`LifecycleOwner`インターフェースも含まれています。

Compose Multiplatformは、一般的な`ViewModelStoreOwner`実装も提供します。

### Kotlin 2.0.0のサポート

Kotlin 2.0.0-RC2は、Composeコンパイラ用の新しいGradleプラグインとともにリリースされました。
最新のコンパイラバージョンでCompose Multiplatformを使用するには、プロジェクトのモジュールにプラグインを適用してください（詳細は[移行ガイド](compose-compiler.md#migrating-a-compose-multiplatform-project)を参照）。

## デスクトップ

### BasicTextField2の基本的なサポート

`BasicTextField2` Composeコンポーネントが、デスクトップターゲットで基本的なレベルでサポートされるようになりました。
プロジェクトで絶対に必要な場合や、テスト目的で使用できますが、未検出のエッジケースが存在する可能性があることに注意してください。
例えば、`BasicTextField2`は現在IMEイベントをサポートしていないため、中国語、日本語、韓国語の仮想キーボードを使用することはできません。

このコンポーネントの完全なサポートと他のプラットフォームのサポートは、Compose Multiplatform 1.7.0リリースで計画されています。

### DialogWindowのalwaysOnTopフラグ

ダイアログウィンドウが上書きされるのを防ぐため、`DialogWindow`コンポーザブルで`alwaysOnTop`フラグを使用できるようになりました。

詳細は[プルリクエスト](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)を参照してください。

## iOS

### アクセシビリティサポートの改善

このリリースでの変更点：

*   ダイアログとポップアップがアクセシビリティ機能と適切に統合されました。
*   `UIKitView`および`UIKitViewController`を使用して作成された相互運用ビューが、アクセシビリティサービスからアクセス可能になりました。
*   `LiveRegion`セマンティクスがアクセシビリティAPIでサポートされました。
*   [アクセシビリティスクロール](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)がサポートされました。
*   `HapticFeedback`がサポートされました。

### iOS 17以降の選択コンテナ拡大鏡

iOS上のCompose Multiplatform選択コンテナが、ネイティブの拡大ツールをエミュレートするようになりました。

![Screenshot of iPhone chat app with the text magnifier active](compose-1610-ios-magnifier.png){width=390}

### ダイアログセンタリングのためのソフトウェアキーボードインセット

`Dialog`コンポーザブルの動作がAndroidと同様に整列されました。ソフトウェアキーボードが画面に表示された場合、ダイアログはアプリケーションウィンドウの実効高さを考慮して中央に配置されます。
`DialogProperties.useSoftwareKeyboardInset`プロパティを使用して、これを無効にするオプションがあります。

## Web

### 基本的なIMEキーボードサポート

Compose MultiplatformのWebターゲットが、仮想（IME）キーボードの基本的なサポートを持つようになりました。

## Gradleプラグイン

### macOSの最小バージョン変更の可能性

以前のバージョンでは、Intel版を含まずにmacOSアプリをApp Storeにアップロードすることはできませんでした。
プラットフォーム固有のCompose Multiplatformオプションで、アプリの最小macOSバージョンを設定できるようになりました。

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

詳細は[プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4271)を参照してください。

### Proguardサポート付きuber JARを作成するオプション

ProGuard Gradleタスクを使用して、uber JAR（アプリケーションとすべての依存関係のJARを含む複雑なパッケージ）を作成できるようになりました。

詳細は[プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4136)を参照してください。

<!--TODO add link to the GitHub tutorial mentioned in PR when it's updated  -->

## 既知の問題

### MissingResourceException

Kotlinのバージョンを1.9.xから2.0.0（またはその逆）に変更した後、`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...`エラーが発生する場合があります。
これを解決するには、プロジェクトの`build`ディレクトリ（プロジェクトのルートフォルダーおよびモジュールフォルダーにあるフォルダーを含む）を削除してください。

### NativeCodeGeneratorException

一部のプロジェクトでiOSのコンパイルが以下のエラーで失敗する可能性があります。

```
org.jetbrains.kotlin.backend.konan.llvm.NativeCodeGeneratorException: Exception during generating code for following declaration: private fun $init_global()
```

詳細は[GitHubイシュー](https://github.com/JetBrains/compose-multiplatform/issues/4809)を参照してください。