[//]: # (title: Compose Multiplatform 1.6.0の新機能)

Compose Multiplatform 1.6.0リリースのハイライトは以下の通りです：

*   [破壊的変更](#breaking-changes)
*   [改善された新しいResources API](#improved-resources-api-all-platforms)
*   [iOSアクセシビリティ機能の基本サポート](#accessibility-support)
*   [全プラットフォーム向けのUIテストAPI](#ui-testing-api-experimental-all-platforms)
*   [ポップアップ、ダイアログ、ドロップダウンのプラットフォームビューの分離](#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)。
*   [Jetpack ComposeとMaterial 3からの変更点の統合](#changes-from-jetpack-compose-and-material-3-all-platforms)
*   [安定版でのKotlin/Wasmアーティファクト](#kotlin-wasm-artifacts-available-in-stable-versions-of-the-framework)
*   [既知の問題: 依存関係の不足](#known-issues-missing-dependencies)

## Dependencies

このバージョンのCompose Multiplatformは、以下のJetpack Composeライブラリに基づいています：

*   [Compiler 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)
*   [Runtime 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.1)
*   [UI 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.1)
*   [Foundation 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.1)
*   [Material 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.1)
*   [Material3 1.2.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.0)

## Breaking changes

### Padding for text with lineHeight set trimmed by default

[`LineHeightStyle.Trim`](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/LineHeightStyle.Trim)のサポートが追加されたことで、Compose Multiplatformはテキストパディングのトリミング方法においてAndroidと整合性が取れるようになりました。
詳細は[プルリクエスト](https://github.com/JetBrains/compose-multiplatform-core/pull/897)を参照してください。

これは、[1.6.0-alpha01リリース](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.0-alpha01)からの`compose.material`の変更と一致しています：
*   `includeFontPadding`パラメーターはAndroidでデフォルトで`false`になりました。
    この変更のより深い理解については、[Compose Multiplatformでこのフラグを実装しないことに関する議論](https://github.com/JetBrains/compose-multiplatform/issues/2477#issuecomment-1825716543)を参照してください。
*   デフォルトの行高スタイルが`Trim.None`および`Alignment.Center`に変更されました。Compose Multiplatformは現在`LineHeightStyle.Trim`をサポートし、`Trim.None`をデフォルト値として実装しています。
*   `Typography`の`TextStyle`に明示的な`lineHeight`が追加され、これによって[次の破壊的変更](#using-fontsize-in-materialtheme-requires-lineheight)につながりました。

### Using fontSize in MaterialTheme requires lineHeight

> これは`material`コンポーネントのみに影響します。`material3`にはすでにこの制限がありました。
>
{style="note"}

`MaterialTheme`の`Text`コンポーネントに`fontSize`属性を設定しても`lineHeight`を含めない場合、実際の行の高さはフォントと一致するように変更されません。今後は、対応する`fontSize`を設定するたびに、明示的に`lineHeight`属性を指定する必要があります。

Jetpack Composeは現在、フォントサイズを直接設定しないことを[推奨](https://issuetracker.google.com/issues/321872412)しています：

> 非標準のテキストサイズをサポートするために、ユーザーはMaterialデザインシステムに従い、フォントサイズを直接変更するのではなく、異なる[タイプスケール](https://m2.material.io/design/typography/the-type-system.html#type-scale)を使用することをお勧めします。あるいは、ユーザーは次のように行の高さ（line height）を上書きすることもできます：
> `style = LocalTextStyle.current.copy(lineHeight = TextUnit.Unspecified)`、またはカスタムの`Typography`を完全に作成することも可能です。
>
{style="tip"}

### New approach to resource organization

Compose Multiplatform 1.6.0のプレビュー版でResources APIを使用していた場合は、[現行バージョンのドキュメント](compose-multiplatform-resources.md)を参照してください。1.6.0-beta01で、リソースファイルがプロジェクトコードから利用できるようにプロジェクトフォルダに保存される方法が変更されました。

## Across platforms

### Improved resources API (all platforms)

新しい実験的APIは文字列とフォントのサポートを追加し、共通Kotlinでリソースをより快適に共有およびアクセスできるようにします：

*   リソースは、特定の環境設定や制約に基づいて整理でき、以下をサポートします：
    *   ロケール
    *   画像解像度
    *   ダークテーマとライトテーマ
*   Compose Multiplatformは、各プロジェクトに対して`Res`オブジェクトを生成し、リソースへ直接アクセスできるようにします。

リソース修飾子の詳細、および新しいResources APIのより詳細な概要については、[Images and resources](compose-multiplatform-resources.md)を参照してください。

### UI testing API (Experimental, all platforms)

Compose MultiplatformでのUIテスト用の実験的APIは、これまでデスクトップとAndroidで利用可能でしたが、すべてのプラットフォームでサポートされるようになりました。フレームワークがサポートするプラットフォーム全体で、アプリケーションのUIの動作を検証する共通テストを作成および実行できます。このAPIは、Jetpack Composeと同じファインダー、アサーション、アクション、マッチャーを使用します。

> JUnitベースのテストは、デスクトッププロジェクトでのみサポートされています。
>
{style="note"}

設定手順とテスト例については、[Testing Compose Multiplatform UI](compose-test.md)を参照してください。

### Changes from Jetpack Compose and Material 3 (all platforms)

#### Jetpack Compose 1.6.1

Jetpack Composeの最新リリースを統合することで、すべてのプラットフォームでパフォーマンスが向上しました。詳細については、[Android Developers Blogのアナウンス](https://android-developers.googleblog.com/2024/01/whats-new-in-jetpack-compose-january-24-release.html)を参照してください。

このリリースのその他の注目すべき機能：
*   デフォルトのフォントパディングの変更は、Androidターゲットにのみ影響しました。ただし、この変更による[副作用](#using-fontsize-in-materialtheme-requires-lineheight)を考慮するようにしてください。
*   マウス選択はCompose Multiplatformの他のターゲットではすでにサポートされていました。1.6.0では、Androidも含まれるようになりました。

まだCompose Multiplatformに移植されていないJetpack Composeの機能：
*   [BasicTextField2](https://github.com/JetBrains/compose-multiplatform/issues/4218)
*   [Support for nonlinear font scaling](https://github.com/JetBrains/compose-multiplatform/issues/4305)
*   [MultiParagraph.fillBoundingBoxes](https://github.com/JetBrains/compose-multiplatform/issues/4236)
*   [Multiplatform drag and drop](https://github.com/JetBrains/compose-multiplatform/issues/4235)。現時点ではAndroidでのみ動作します。デスクトップでは、既存のAPIである`Modifier.onExternalDrag`を使用できます。

JetBrainsチームは、Compose Multiplatformの今後のバージョンでこれらの機能を採用するよう取り組んでいます。

#### Compose Material 3 1.2.0

リリースハイライト：
*   単一選択および複数選択が可能な新しい実験的コンポーネント`Segmented Button`。
*   UIで情報を強調しやすくするための、より多くのサーフェスオプションを備えた拡張カラーセット。
    *   実装に関する注意：`ColorScheme`オブジェクトはイミュータブルになりました。コードが現在`ColorScheme`のカラーを直接変更している場合、カラーを変更するには`copy`メソッドを使用する必要があります。
    *   単一のサーフェス値の代わりに、より柔軟なカラー管理のために、サーフェスカラーとサーフェスコンテナのいくつかのオプションが追加されました。

Material 3の変更点の詳細については、[Material Design Blogのリリース投稿](https://material.io/blog/material-3-compose-1-2)を参照してください。

### Separate platform views for popups, dialogs, and dropdowns (iOS, desktop)

時には、ポップアップ要素（例：ツールチップやドロップダウンメニュー）が、初期のコンポーザブルキャンバスやアプリウィンドウによって制限されないことが重要です。これは、コンポーザブルビューが全画面を占有していないにもかかわらず、アラートダイアログを生成する必要がある場合に特に関連します。1.6.0では、これを確実に実現する方法が提供されています。

ポップアップとダイアログは、自身の境界外に何も描画できないことに注意してください（例：最上位コンテナの影）。

#### iOS (Stable)

iOSでは、この機能はデフォルトでアクティブになっています。
以前の挙動に戻すには、`platformLayers`パラメーターを`false`に設定します：

```kotlin
ComposeUIViewController(
    configure = {
        platformLayers = false
    }
) {
    // your Compose code
}
```

#### Desktop (Experimental)

デスクトップでこの機能を使用するには、`compose.layers.type`システムプロパティを設定します。サポートされる値は以下の通りです：
*   `WINDOW`：`Popup`コンポーネントと`Dialog`コンポーネントを独立した装飾なしのウィンドウとして作成する場合。
*   `COMPONENT`：`Popup`または`Dialog`を同じウィンドウ内で独立したSwingコンポーネントとして作成する場合。これはオフスクリーンレンダリングでのみ機能し、`compose.swing.render.on.graphics`が`true`に設定されている必要があります（Compose Multiplatform 1.5.0リリースノートの[Enhanced Swing interop](https://blog.jetbrains.com/kotlin/2023/08/compose-multiplatform-1-5-0-release/#enhanced-swing-interop)セクションを参照）。オフスクリーンレンダリングは`ComposePanel`コンポーネントでのみ動作し、フルウィンドウアプリケーションでは動作しないことに注意してください。

`COMPONENT`プロパティを使用するコードの例：

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
    composePanel.windowContainer = contentPane  // Use the full window for dialogs
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

`Dialog` (黄色) は、親の`ComposePanel` (緑色) の境界に関わらず、完全に描画されます：

![Dialog outside the bounds of the parent panel](compose-desktop-separate-dialog.png){width=700}

### Support for text decoration line styles (iOS, desktop, web)

Compose Multiplatformでは、`PlatformTextStyle`クラスを使用してテキストの下線スタイルを設定できるようになりました。

> このクラスは共通ソースセットでは利用できず、プラットフォーム固有のコードで使用する必要があります。
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

実線、二重実線、点線、破線、波線の線スタイルを使用できます。利用可能なすべてのオプションは[ソースコード](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui-text/src/skikoMain/kotlin/androidx/compose/ui/text/TextDecorationLineStyle.kt#L21)を参照してください。

### Accessing fonts installed on the system (iOS, desktop, web)

Compose Multiplatformアプリからシステムにインストールされているフォントにアクセスできるようになりました。`SystemFont`クラスを使用して、適切なフォントスタイルとフォントウェイトでフォントをロードします：

```kotlin
import androidx.compose.ui.text.platform.SystemFont

FontFamily(SystemFont("Menlo", weight = 700))
FontFamily(SystemFont("Times New Roman", FontWeight.Bold))
FontFamily(SystemFont("Webdings"))
```

デスクトップでは、`FontFamily`関数を使用して、フォントファミリー名のみを指定することで可能なすべてのフォントスタイルをロードできます（詳細な例については[コードサンプル](https://github.com/JetBrains/compose-multiplatform-core/blob/release/1.6.0/compose/desktop/desktop/samples/src/jvmMain/kotlin/androidx/compose/desktop/examples/fonts/Fonts.jvm.kt)を参照）：

```kotlin
FontFamily("Menlo")
```

## iOS

### Accessibility support

iOS版Compose Multiplatformでは、障がいを持つ人々がネイティブiOS UIと同じレベルの快適さでCompose UIと対話できるようになりました：

*   スクリーンリーダーとVoiceOverがCompose UIのコンテンツにアクセスできます。
*   Compose UIは、ナビゲーションとインタラクションにネイティブUIと同じジェスチャーをサポートします。

これはまた、Compose MultiplatformのセマンティックデータをAccessibility ServicesおよびXCTestフレームワークで利用できるようにすることも意味します。

実装とカスタマイズAPIの詳細については、[Support for iOS accessibility features](compose-ios-accessibility.md)を参照してください。

### Changing opacity for composable view

`ComposeUIViewController`クラスには、ビューの背景の不透明度を透明に変更する、もう1つの設定オプションが追加されました。

> 透明な背景は、追加のブレンドステップを伴うため、パフォーマンスに悪影響を与えます。
>
{style="note"}

```kotlin
val appController = ComposeUIViewController(configure = {
      this.opaque = false
}) {
    App()
}
```

透明な背景が実現できることの例：

![Compose opaque = false demo](compose-opaque-property.png){width=700}

### Selecting text in SelectionContainer by double and triple tap

以前は、iOS版Compose Multiplatformでは、テキスト入力フィールドでのみテキスト選択にマルチタップを使用できました。現在では、`SelectionContainer`内の`Text`コンポーネントに表示されるテキストの選択にも、ダブルタップおよびトリプルタップジェスチャーが機能します。

### Interop with UIViewController

`UIView`として実装されていない一部のネイティブAPI（例：`UITabBarController`や`UINavigationController`）は、[既存の相互運用メカニズム](compose-uikit-integration.md)を使用してCompose Multiplatform UIに組み込むことができませんでした。

現在、Compose Multiplatformは`UIKitViewController`関数を実装しており、これによりCompose UIにネイティブiOSビューコントローラーを埋め込むことができます。

### Native-like caret behavior by long/single taps in text fields

Compose Multiplatformは、テキストフィールド内のキャレットのネイティブiOSの動作に近づきました：
*   テキストフィールドでのシングルタップ後のキャレットの位置は、より高い精度で決定されます。
*   テキストフィールドでの長押しとドラッグは、Androidのように選択モードに入るのではなく、カーソルを移動させます。

## Desktop

### Experimental support of improved interop blending

これまで、`SwingPanel`ラッパーを使用して実装された相互運用ビューは常に長方形であり、常に前景、つまりすべてのCompose Multiplatformコンポーネントの上にありました。このため、ポップアップ要素（ドロップダウンメニュー、トースト通知）の使用が困難でした。新しい実装ではこの問題が解決され、以下のユースケースでSwingを利用できるようになりました：

*   クリッピング。長方形の形状に限定されません。クリップおよびシャドウモディファイアが`SwingPanel`で正しく機能するようになりました。

    ```kotlin
    // Flag necessary to enable the experimental blending 
    System.setProperty("compose.interop.blending", "true")
  
    SwingPanel(
        modifier = Modifier.clip(RoundedCornerShape(6.dp))
        //...
    )
    ```
  
    この機能なしで`JButton`がクリップされる方法が左側に、実験的なブレンドが右側に示されています：

    ![Correct clipping with SwingPanel](compose-swingpanel-clipping.png)
*   重なり。`SwingPanel`の上に任意のCompose Multiplatformコンテンツを描画し、通常通りに操作することが可能です。
    ここでは、「Snackbar」がクリック可能な**OK**ボタン付きのSwingパネルの上にあります：

    ![Correct overlapping with SwingPanel](compose-swingpanel-overlapping.png)

既知の制限と追加の詳細は、[プルリクエストの説明](https://github.com/JetBrains/compose-multiplatform-core/pull/915)を参照してください。

## Web

### Kotlin/Wasm artifacts available in stable versions of the framework

Compose Multiplatformの安定版は、Kotlin/Wasmターゲットをサポートするようになりました。1.6.0に切り替えた後、依存関係リストで特定の`dev-wasm`バージョンの`compose-ui`ライブラリを指定する必要はありません。

> Wasmターゲットを持つCompose Multiplatformプロジェクトをビルドするには、Kotlin 1.9.22以降が必要です。
>
{style="warning"}

## Known issues: missing dependencies

デフォルトのプロジェクト設定では、いくつかのライブラリが不足する可能性があります：

*   `org.jetbrains.compose.annotation-internal:annotation`または`org.jetbrains.compose.collection-internal:collection`

    これらは、ライブラリがCompose Multiplatform 1.6.0-beta02に依存している場合、1.6.0とバイナリ互換性がないために不足する可能性があります。
    どのライブラリが原因であるかを特定するには、このコマンドを実行してください（`shared`をメインモジュールの名前に置き換えてください）：

    ```shell
    ./gradlew shared:dependencies
    ```

    ライブラリをCompose Multiplatform 1.5.12に依存するバージョンにダウングレードするか、ライブラリの作者にCompose Multiplatform 1.6.0へアップグレードするよう依頼してください。

*   `androidx.annotation:annotation:...`または`androidx.collection:collection:...`

    Compose Multiplatform 1.6.0は、[collection](https://developer.android.com/jetpack/androidx/releases/collection)および[annotation](https://developer.android.com/jetpack/androidx/releases/annotation)ライブラリに依存しており、これらはGoogle Mavenリポジトリでのみ利用可能です。

    このリポジトリをプロジェクトで利用可能にするには、モジュールの`build.gradle.kts`ファイルに以下の行を追加してください：

    ```kotlin
    repositories {
        //...
        google()
    }
    ```