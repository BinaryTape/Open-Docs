[//]: # (title: Compose Multiplatform 1.6.0 の新機能)

Compose Multiplatform 1.6.0 リリースの主なハイライトは以下の通りです：

* [破壊的変更](#breaking-changes)
* [新しく改善されたリソース API](#improved-resources-api-all-platforms)
* [iOS アクセシビリティ機能の基本サポート](#accessibility-support)
* [全プラットフォーム向けの UI テスト API](#ui-testing-api-experimental-all-platforms)
* [ポップアップ、ダイアログ、ドロップダウンのための個別のプラットフォームビュー](#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)
* [Jetpack Compose および Material 3 からの変更を統合](#changes-from-jetpack-compose-and-material-3-all-platforms)
* [安定版での Kotlin/Wasm アーティファクト](#kotlin-wasm-artifacts-available-in-stable-versions-of-the-framework)
* [既知の問題：不足している依存関係](#known-issues-missing-dependencies)

## 依存関係 (Dependencies)

このバージョンの Compose Multiplatform は、以下の Jetpack Compose ライブラリに基づいています：

* [Compiler 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)
* [Runtime 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.1)
* [UI 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.1)
* [Foundation 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.1)
* [Material 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.1)
* [Material3 1.2.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.0)

## 破壊的変更 (Breaking changes)

### lineHeight が設定されたテキストのパディングがデフォルトでトリミングされるように

[LineHeightStyle.Trim](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/LineHeightStyle.Trim) のサポートが追加されたことで、Compose Multiplatform はテキストパディングのトリミング方法において Android と動作が一致するようになりました。
詳細は [プルリクエスト](https://github.com/JetBrains/compose-multiplatform-core/pull/897) を参照してください。

これは、[1.6.0-alpha01 リリース](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.0-alpha01) 以降の `compose.material` の変更に準拠しています：
* Android では `includeFontPadding` パラメータがデフォルトで `false` になりました。
  この変更の背景については、[Compose Multiplatform でこのフラグを実装しないことに関する議論](https://github.com/JetBrains/compose-multiplatform/issues/2477#issuecomment-1825716543) を参照してください。
* デフォルトの行高スタイル（line height style）が `Trim.None` および `Alignment.Center` に変更されました。Compose Multiplatform は `LineHeightStyle.Trim` をサポートし、デフォルト値として `Trim.None` を実装します。
* `Typography` の `TextStyle` に明示的な `lineHeight` が追加されました。これにより、[次の破壊的変更](#using-fontsize-in-materialtheme-requires-lineheight) が発生します。

### MaterialTheme で fontSize を使用する場合に lineHeight が必要に

> これは `material` コンポーネントにのみ影響します。`material3` にはすでにこの制限がありました。
>
{style="note"}

`MaterialTheme` の `Text` コンポーネントで `fontSize` 属性を設定し、`lineHeight` を含めない場合、実際の行高はフォントに合わせて変更されなくなりました。今後は、`fontSize` を設定するたびに、対応する `lineHeight` 属性を明示的に指定する必要があります。

Jetpack Compose では現在、フォントサイズを直接設定しないことを [推奨](https://issuetracker.google.com/issues/321872412) しています：

> 標準外のテキストサイズをサポートする場合、フォントサイズを直接変更するのではなく、Material デザインシステムに従って異なる [タイプスケール（type scale）](https://m2.material.io/design/typography/the-type-system.html#type-scale) を使用することを推奨します。あるいは、次のように行高を上書きすることもできます：
> `style = LocalTextStyle.current.copy(lineHeight = TextUnit.Unspecified)`、または `Typography` 全体をカスタムで作成してください。
>
{style="tip"}

### リソース管理の新しいアプローチ

Compose Multiplatform 1.6.0 のプレビュー版でリソース API を使用していた場合は、[最新バージョンのドキュメント](compose-multiplatform-resources.md) を確認してください。1.6.0-beta01 では、プロジェクトコードからリソースを利用できるようにするための、プロジェクトフォルダ内でのリソースファイルの保存方法が変更されました。

## 全プラットフォーム共通 (Across platforms)

### 改善されたリソース API (全プラットフォーム)

新しい実験的（Experimental）な API により、文字列とフォントのサポートが追加され、共通の（common）Kotlin コードでより快適にリソースを共有・アクセスできるようになりました：

* リソースは、設計された特定の構成や制約（以下をサポート）に従って整理できます：
  * ロケール（Locales）
  * 画像解像度
  * ダークテーマとライトテーマ
* Compose Multiplatform は、リソースへの直接的なアクセスを提供するために、プロジェクトごとに `Res` オブジェクトを生成するようになりました。

リソース修飾子（qualifiers）の詳細や、新しいリソース API のより詳細な概要については、[画像とリソース](compose-multiplatform-resources.md) を参照してください。

### UI テスト API (実験的、全プラットフォーム)

デスクトップと Android で既に利用可能だった Compose Multiplatform による UI テスト用の実験的 API が、全プラットフォームをサポートするようになりました。フレームワークがサポートするすべてのプラットフォームにおいて、アプリケーションの UI の動作を検証する共通テスト（common tests）を記述し、実行できます。この API は、Jetpack Compose と同じ finder、assertion、action、matcher を使用します。

> JUnit ベースのテストは、デスクトッププロジェクトでのみサポートされています。
>
{style="note"}

セットアップ手順とテスト例については、[Compose Multiplatform UI のテスト](compose-test.md) を参照してください。

### Jetpack Compose および Material 3 からの変更 (全プラットフォーム)

#### Jetpack Compose 1.6.1

Jetpack Compose の最新リリースの統合により、すべてのプラットフォームでパフォーマンスにプラスの影響があります。詳細は、[Android Developers Blog の発表](https://android-developers.googleblog.com/2024/01/whats-new-in-jetpack-compose-january-24-release.html) を参照してください。

このリリースのその他の注目すべき機能：
* デフォルトのフォントパディングの変更は Android ターゲットにのみ適用されました。ただし、この変更による [副作用](#using-fontsize-in-materialtheme-requires-lineheight) を考慮するようにしてください。
* マウスによる選択は、Compose Multiplatform の他のターゲットですでにサポートされていました。1.6.0 では、これに Android も含まれるようになりました。

Compose Multiplatform にまだ移植されていない Jetpack Compose の機能：
* [BasicTextField2](https://github.com/JetBrains/compose-multiplatform/issues/4218)
* [非線形フォントスケーリングのサポート](https://github.com/JetBrains/compose-multiplatform/issues/4305)
* [MultiParagraph.fillBoundingBoxes](https://github.com/JetBrains/compose-multiplatform/issues/4236)
* [マルチプラットフォームのドラッグ＆ドロップ](https://github.com/JetBrains/compose-multiplatform/issues/4235)。現在は Android でのみ動作します。デスクトップでは、既存の API である `Modifier.onExternalDrag` を使用できます。

JetBrains チームは、今後のバージョンの Compose Multiplatform でこれらの機能を採用できるよう取り組んでいます。

#### Compose Material 3 1.2.0

リリースのハイライト：
* 単一選択および複数選択が可能な新しい実験的コンポーネント `Segmented Button`。
* UI で情報を強調しやすくするために、サーフェス（surface）のオプションが増え、カラーセットが拡張されました。
  * 実装上の注意：`ColorScheme` オブジェクトがイミュータブル（不変）になりました。現在コードで `ColorScheme` の色を直接変更している場合は、今後は色の変更に [copy](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme#copy(androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color)) メソッドを使用する必要があります。
  * 単一の surface 値の代わりに、より柔軟な色の管理のために surface color と surface container の複数のオプションが用意されました。

Material 3 の変更の詳細については、[Material Design Blog のリリース記事](https://material.io/blog/material-3-compose-1-2) を参照してください。

### ポップアップ、ダイアログ、ドロップダウンのための個別のプラットフォームビュー (iOS、デスクトップ)

ポップアップ要素（ツールチップやドロップダウンメニューなど）が、最初の Composable キャンバスやアプリウィンドウによって制限されないことが重要な場合があります。これは、Composable ビューが画面全体を占めていないものの、アラートダイアログを表示する必要がある場合に特に重要になります。1.6.0 では、これを確実に行う方法が導入されました。

なお、ポップアップやダイアログは、自身の境界の外側に何かを描画すること（例えば、最前面のコンテナの影など）は依然としてできないことに注意してください。

#### iOS (安定版)

iOS では、この機能はデフォルトで有効になっています。
以前の動作に戻すには、`platformLayers` パラメータを `false` に設定します：

```kotlin
ComposeUIViewController(
    configure = {
        platformLayers = false
    }
) {
    // あなたの Compose コード
}
```

#### デスクトップ (実験的)

デスクトップでこの機能を使用するには、`compose.layers.type` システムプロパティを設定します。サポートされている値：
* `WINDOW`: `Popup` および `Dialog` コンポーネントを、装飾のない（undecorated）独立したウィンドウとして作成します。
* `COMPONENT`: `Popup` または `Dialog` を、同じウィンドウ内の個別の Swing コンポーネントとして作成します。これは、オフスクリーンレンダリングが有効で、`compose.swing.render.on.graphics` が `true` に設定されている場合にのみ動作します（1.5.0 Compose Multiplatform リリースノートの [Enhanced Swing interop](https://blog.jetbrains.com/kotlin/2023/08/compose-multiplatform-1-5-0-release/#enhanced-swing-interop) セクションを参照）。オフスクリーンレンダリングは `ComposePanel` コンポーネントでのみ動作し、フルウィンドウアプリケーションでは動作しないことに注意してください。

`COMPONENT` プロパティを使用するコードの例：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() = SwingUtilities.invokeLater {
    System.setProperty("compose.swing.render.on.graphics", "true")
    System.setProperty("compose.layers.type", "COMPONENT")

    val window = JFrame()
    window.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE

    val contentPane = JLayeredPane()
    contentPane.layout = null

    val composePanel = ComposePanel()
    composePanel.setBounds(200, 200, 200, 200)
    composePanel.setContent {
      ComposeContent()
    }
    composePanel.windowContainer = contentPane  // ダイアログにフルウィンドウを使用する
    contentPane.add(composePanel)

    window.contentPane.add(contentPane)
    window.setSize(800, 600)
    window.isVisible = true
  }

@Composable
fun ComposeContent() {
    Box(Modifier.fillMaxSize().background(Color.Green)) {
        Dialog(onDismissRequest = {}) {
            Box(Modifier.size(100.dp).background(Color.Yellow))
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="val window = JFrame()"}

親の `ComposePanel`（緑）の境界に関わらず、`Dialog`（黄）が完全に描画されます：

![親パネルの境界外に表示されるダイアログ](compose-desktop-separate-dialog.png){width=700}

### テキスト装飾のラインスタイルのサポート (iOS、デスクトップ、ウェブ)

Compose Multiplatform で、`PlatformTextStyle` クラスを使用してテキストの下線スタイルを設定できるようになりました。

> このクラスは共通ソースセット（common source set）では利用できず、プラットフォーム固有のコードで使用する必要があります。
>
{style="warning"}

点線の下線スタイルを設定する例：

```kotlin
Text(
  "Hello, Compose",
  style = TextStyle(
    textDecoration = TextDecoration.Underline,
    platformStyle = PlatformTextStyle (
      textDecorationLineStyle = TextDecorationLineStyle.Dotted
    )
  )
)
```

実線（solid）、2本の実線（double-width solid）、点線（dotted）、破線（dashed）、波線（wavy）のラインスタイルを使用できます。利用可能なすべてのオプションは [ソースコード](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui-text/src/skikoMain/kotlin/androidx/compose/ui/text/TextDecorationLineStyle.kt#L21) で確認できます。

### システムにインストールされたフォントへのアクセス (iOS、デスクトップ、ウェブ)

Compose Multiplatform アプリからシステムにインストールされているフォントにアクセスできるようになりました。`SystemFont` クラスを使用して、適切なフォントスタイルとフォントウェイトでフォントをロードします：

```kotlin
import androidx.compose.ui.text.platform.SystemFont

FontFamily(SystemFont("Menlo", weight = 700))
FontFamily(SystemFont("Times New Roman", FontWeight.Bold))
FontFamily(SystemFont("Webdings"))
```

デスクトップでは、フォントファミリー名のみを指定して、利用可能なすべてのフォントスタイルをロードするために `FontFamily` 関数を使用できます（詳細な例については [コードサンプル](https://github.com/JetBrains/compose-multiplatform-core/blob/release/1.6.0/compose/desktop/desktop/samples/src/jvmMain/kotlin/androidx/compose/desktop/examples/fonts/Fonts.jvm.kt) を参照してください）：

```kotlin
FontFamily("Menlo")
```

## iOS

### アクセシビリティのサポート

iOS 向けの Compose Multiplatform で、障害を持つ人々がネイティブの iOS UI と同等の快適さで Compose UI を操作できるようになりました：

* スクリーンリーダーや VoiceOver が Compose UI のコンテンツにアクセスできます。
* Compose UI は、ナビゲーションとインタラクションのために、ネイティブ UI と同じジェスチャーをサポートします。

これは、Compose Multiplatform のセマンティックデータをアクセシビリティサービスや XCTest フレームワークで利用できることも意味します。

実装とカスタマイズ API の詳細については、[iOS アクセシビリティ機能のサポート](compose-ios-accessibility.md) を参照してください。

### Composable ビューの不透明度の変更

`ComposeUIViewController` クラスに、ビューの背景の不透明度を透明に変更するための構成オプションが追加されました。

> 透明な背景はブレンディングの工程が追加されるため、パフォーマンスに悪影響を与えます。
>
{style="note"}

```kotlin
val appController = ComposeUIViewController(configure = {
      this.opaque = false
}) {
    App()
}
```

透明な背景で実現できることの例：

![Compose opaque = false デモ](compose-opaque-property.png){width=700}

### SelectionContainer 内のテキストをダブルタップおよびトリプルタップで選択

以前は、iOS 向けの Compose Multiplatform では、テキスト入力フィールド内でのみマルチタップによるテキスト選択が可能でした。今回の更新により、`SelectionContainer` 内の `Text` コンポーネントに表示されるテキストについても、ダブルタップおよびトリプルタップのジェスチャーによる選択が動作するようになりました。

### UIViewController との相互運用

`UIView` として実装されていない一部のネイティブ API（例えば `UITabBarController` や `UINavigationController`）は、[既存の相互運用メカニズム](compose-uikit-integration.md) を使用して Compose Multiplatform UI に埋め込むことができませんでした。

今回、Compose Multiplatform は `UIKitViewController` 関数を実装し、ネイティブの iOS ビューコントローラを Compose UI 内に埋め込めるようにしました。

### テキストフィールドでのロングタップ/シングルタップによるネイティブ風のキャレット動作

Compose Multiplatform は、テキストフィールドにおけるキャレットの挙動において、ネイティブ iOS の動作により近づきました：
* テキストフィールド内をシングルタップした後のキャレット位置が、より正確に決定されるようになりました。
* テキストフィールド内でのロングタップとドラッグにより、Android のように選択モードに入るのではなく、カーソルが移動するようになりました。

## デスクトップ (Desktop)

### 改善された相互運用ブレンディングの実験的サポート

以前は、`SwingPanel` ラッパーを使用して実装された相互運用ビューは常に矩形であり、常に Compose Multiplatform コンポーネントの手前に表示されていました。そのため、ポップアップ要素（ドロップダウンメニュー、トースト通知）の使用が困難でした。新しい実装によりこの問題が解決され、以下のユースケースで Swing を活用できるようになりました。

* クリッピング：矩形に制限されなくなりました。`SwingPanel` でクリップ（clip）やシャドウ（shadow）の修飾子が正しく動作するようになりました。

    ```kotlin
    // 実験的なブレンディングを有効にするために必要なフラグ
    System.setProperty("compose.interop.blending", "true")
  
    SwingPanel(
        modifier = Modifier.clip(RoundedCornerShape(6.dp))
        //...
    )
    ```
  
  左側はこの機能なしで `JButton` がクリップされている様子、右側は実験的なブレンディングを適用した様子です：

  ![SwingPanel による正しいクリッピング](compose-swingpanel-clipping.png)
* オーバーラップ：`SwingPanel` の上に任意の Compose Multiplatform コンテンツを描画し、通常通り操作することが可能になりました。ここでは、クリック可能な **OK** ボタンを持つ Swing パネルの上に "Snackbar" が表示されています：

  ![SwingPanel による正しいオーバーラップ](compose-swingpanel-overlapping.png)

既知の制限事項と追加の詳細は、[プルリクエストの説明](https://github.com/JetBrains/compose-multiplatform-core/pull/915) を参照してください。

## ウェブ (Web)

### 安定版フレームワークで Kotlin/Wasm アーティファクトが利用可能に

Compose Multiplatform の安定版が Kotlin/Wasm ターゲットをサポートするようになりました。1.6.0 に切り替えた後は、依存関係リストで `compose-ui` ライブラリの特定の `dev-wasm` バージョンを指定する必要はありません。

> Wasm ターゲットで Compose Multiplatform プロジェクトをビルドするには、Kotlin 1.9.22 以降が必要です。
>
{style="warning"}

## 既知の問題：不足している依存関係

デフォルトのプロジェクト構成では、いくつかのライブラリが不足する可能性があります：

* `org.jetbrains.compose.annotation-internal:annotation` または `org.jetbrains.compose.collection-internal:collection`

  ライブラリが Compose Multiplatform 1.6.0-beta02 に依存している場合、1.6.0 とバイナリ互換性がないため、これらが不足することがあります。どのライブラリが原因かを確認するには、次のコマンドを実行してください（`shared` をメインモジュールの名前に置き換えてください）：

  ```shell
  ./gradlew shared:dependencies
  ```

  そのライブラリを Compose Multiplatform 1.5.12 に依存するバージョンにダウングレードするか、ライブラリの作者に Compose Multiplatform 1.6.0 へのアップグレードを依頼してください。

* `androidx.annotation:annotation:...` または `androidx.collection:collection:...`

  Compose Multiplatform 1.6.0 は、Google Maven リポジトリでのみ利用可能な [collection](https://developer.android.com/jetpack/androidx/releases/collection) および [annotation](https://developer.android.com/jetpack/androidx/releases/annotation) ライブラリに依存しています。

  このリポジトリをプロジェクトで利用可能にするには、モジュールの `build.gradle.kts` ファイルに次の行を追加してください：

  ```kotlin
  repositories {
      //...
      google()
  }
  ```