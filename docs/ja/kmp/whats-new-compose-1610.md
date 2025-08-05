[//]: # (title: Compose Multiplatform 1.6.10 の新機能)

この機能リリースにおける主な変更点は以下のとおりです。

*   [破壊的変更: 新しい Compose コンパイラの Gradle プラグイン](#breaking-change-new-compose-compiler-gradle-plugin)
*   [Compose Multiplatform リソースを使用するマルチモジュールプロジェクトのサポート](#support-for-multimodule-projects-with-compose-multiplatform-resources)
*   [実験的なナビゲーションライブラリ](#experimental-navigation-library)
*   [実験的な共通 ViewModel を備えたライフサイクルライブラリ](#lifecycle-library)
*   [既知の問題: MissingResourceException](#known-issue-missingresourceexception)

このリリースにおける変更点の全リストは[GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#1610-may-2024)で確認できます。

## 依存関係

*   Gradle プラグイン `org.jetbrains.compose`、バージョン 1.6.10。Jetpack Compose ライブラリに基づいています:
    *   [Compiler 1.5.14](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.14)
    *   [Runtime 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.7)
    *   [UI 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.7)
    *   [Foundation 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.7)
    *   [Material 1.6.7](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.7)
    *   [Material3 1.2.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.1)
*   Lifecycle ライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.0`。 [Jetpack Lifecycle 2.8.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.0)に基づいています。
*   Navigation ライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.7.0-alpha07`。 [Jetpack Navigation 2.7.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.7.7)に基づいています。

## 破壊的変更: 新しい Compose コンパイラの Gradle プラグイン

Kotlin 2.0.0 以降、Compose Multiplatform では新しい Compose コンパイラの Gradle プラグインが必要です。
詳細については、[移行ガイド](compose-compiler.md#migrating-a-compose-multiplatform-project)を参照してください。

## クロスプラットフォーム

### リソース

#### 安定版リソースライブラリ

[リソースライブラリ API](compose-multiplatform-resources.md) の大部分が安定版と見なされるようになりました。

#### Compose Multiplatform リソースを使用するマルチモジュールプロジェクトのサポート

Compose Multiplatform 1.6.10 以降、リソースを任意の Gradle モジュールおよび任意のソースセットに保存したり、リソースを含んだプロジェクトやライブラリを公開したりできるようになりました。

マルチモジュールサポートを有効にするには、プロジェクトを Kotlin バージョン 2.0.0 以降、Gradle 7.6 以降に更新してください。

#### マルチプラットフォームリソースの構成 DSL

プロジェクトで `Res` クラスの生成を細かく調整できるようになりました。クラスのモダリティと割り当てられたパッケージを変更したり、常に生成、生成しない、リソースライブラリへの明示的な依存関係がある場合にのみ生成、といった生成条件を選択したりできます。

詳細については、[ドキュメントのセクション](compose-multiplatform-resources-usage.md#customizing-accessor-class-generation)を参照してください。

#### リソース URI 生成のための公開関数

新しい `getUri()` 関数により、リソースのプラットフォーム依存の URI を外部ライブラリに渡して、ファイルに直接アクセスできるようになります。
詳細については、[ドキュメント](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)を参照してください。

#### 文字列リソースの複数形

他のマルチプラットフォーム文字列リソースとともに、複数形（数量文字列）を定義できるようになりました。
詳細については、[ドキュメント](compose-multiplatform-resources-usage.md#plurals)を参照してください。

#### 3文字ロケールのサポート

[言語修飾子](compose-multiplatform-resources-setup.md#language-and-regional-qualifiers)がロケールのアルファベット3文字（ISO 639-2）コードをサポートするようになりました。

#### 画像とフォント用の実験的なバイト配列関数

フォントと画像をバイト配列として取得できる `getDrawableResourceBytes()` と `getFontResourceBytes()` の2つの関数を試すことができます。
これらの関数は、サードパーティライブラリからマルチプラットフォームリソースにアクセスするのに役立つことを目的としています。

詳細については、[プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/4651)を参照してください。

### 実験的なナビゲーションライブラリ

Jetpack Compose に基づく共通ナビゲーションライブラリが利用可能になりました。
詳細については、[ドキュメント](compose-navigation-routing.md)を参照してください。

このバージョンの主な制限事項:
*   [ディープリンク](https://developer.android.com/guide/navigation/design/deep-link)（処理または追従）はまだサポートされていません。
*   [BackHandler](https://developer.android.com/develop/ui/compose/libraries#handling_the_system_back_button) 関数および [予測型戻るジェスチャー](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture)は Android でのみサポートされています。

### ライフサイクルライブラリ

Jetpack Lifecycle に基づく共通ライフサイクルライブラリが利用可能になりました。詳細については、[ドキュメント](compose-lifecycle.md)を参照してください。

このライブラリは、主に共通ナビゲーション機能をサポートするために導入されましたが、実験的なクロスプラットフォーム `ViewModel` 実装も提供しており、プロジェクトに実装できる共通の `LifecycleOwner` インターフェースも含まれています。

Compose Multiplatform は、汎用的な `ViewModelStoreOwner` 実装も提供します。

### Kotlin 2.0.0 のサポート

Kotlin 2.0.0 は、Compose コンパイラ用の新しい Gradle プラグインと共にリリースされました。
最新のコンパイラバージョンで Compose Multiplatform を使用するには、プロジェクトのモジュールにプラグインを適用してください（詳細については、[移行ガイド](compose-compiler.md#migrating-a-compose-multiplatform-project)を参照してください）。

## デスクトップ

### BasicTextField2 の基本サポート

`BasicTextField2` Compose コンポーネントが、デスクトップターゲットで基本的なレベルでサポートされるようになりました。
プロジェクトで絶対に必要である場合や、テストするために使用できますが、未対応のエッジケースが存在する可能性があることに留意してください。
たとえば、`BasicTextField2` は現時点では IME イベントをサポートしていないため、中国語、日本語、または韓国語の仮想キーボードを使用することはできません。

Compose Multiplatform 1.7.0 リリースでは、このコンポーネントの完全なサポートと他のプラットフォームのサポートが計画されています。

### DialogWindow の alwaysOnTop フラグ

ダイアログウィンドウが上書きされるのを避けるために、`DialogWindow` コンポーザブルに `alwaysOnTop` フラグを使用できるようになりました。

詳細については、[プルリクエスト](https://github.com/JetBrains/compose-multiplatform-core/pull/1120)を参照してください。

## iOS

### アクセシビリティサポートの改善

このリリースでは:

*   ダイアログとポップアップがアクセシビリティ機能と適切に統合されました。
*   `UIKitView` および `UIKitViewController` を使用して作成された相互運用ビューが Accessibility Services からアクセス可能になりました。
*   `LiveRegion` セマンティクスがアクセシビリティ API でサポートされました。
*   [アクセシビリティスクロール](https://github.com/JetBrains/compose-multiplatform-core/pull/1169)がサポートされました。
*   `HapticFeedback` がサポートされました。

### iOS 17 以降の選択コンテナ拡大鏡

iOS の Compose Multiplatform 選択コンテナは、ネイティブの拡大ツールをエミュレートするようになりました。

![iPhoneチャットアプリでテキスト拡大鏡が有効になっているスクリーンショット](compose-1610-ios-magnifier.png){width=390}

### ダイアログの中央配置におけるソフトウェアキーボードインセット

`Dialog` コンポーザブルの動作が Android と合わせられました。ソフトウェアキーボードが画面に表示されると、ダイアログはアプリケーションウィンドウの実効高さを考慮して中央に配置されます。
`DialogProperties.useSoftwareKeyboardInset` プロパティを使用して、この機能を無効にするオプションがあります。

## Web

### Kotlin/Wasm のアルファ版サポート

Web 用の実験的な Compose Multiplatform がアルファ版になりました:

*   Web 機能のほとんどは、デスクトップ版の Compose Multiplatform のミラーです。
*   チームは Web プラットフォームをリリースすることに注力しています。
*   次のステップとして、ほとんどのコンポーネントの徹底的なブラウザへの適応を予定しています。

共有 UI コードを持つ Web アプリをセットアップして実行する方法については、[最初のアプリのチュートリアル](quickstart.md)に従ってください。

### 基本的な IME キーボードサポート

Compose Multiplatform の Web ターゲットで、仮想（IME）キーボードの基本的なサポートが追加されました。

## Gradle プラグイン

### macOS の最小バージョンを変更する機能

以前のバージョンでは、Intel 版を含めないと macOS アプリを App Store にアップロードできませんでした。
プラットフォーム固有の Compose Multiplatform オプションで、アプリの macOS 最小バージョンを設定できるようになりました:

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

### Proguard サポート付きの uber JAR を作成するオプション

ProGuard Gradle タスクを使用して、uber JAR（アプリケーションの JAR とすべての依存関係を含む複雑なパッケージ）を作成できるようになりました。

詳細については、[縮小と難読化](compose-native-distribution.md#minification-and-obfuscation)ガイドを参照してください。

### 既知の問題: MissingResourceException

Kotlin 1.9.x から 2.0.0 へ（またはその逆へ）切り替えた後、`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...` エラーが発生する場合があります。
これを解決するには、プロジェクト内のすべての `build` ディレクトリを削除してください。
これには、プロジェクトのルートディレクトリおよびモジュールディレクトリにあるディレクトリも含まれます。