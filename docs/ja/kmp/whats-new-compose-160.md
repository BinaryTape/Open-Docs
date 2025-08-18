[//]: # (title: Compose Multiplatform 1.6.0の新機能)

Compose Multiplatform 1.6.0 リリースにおける主な変更点は以下の通りです。

*   [破壊的変更](#breaking-changes)
*   [リソースAPIの改善と新機能](#improved-resources-api-all-platforms)
*   [iOSアクセシビリティ機能の基本サポート](#accessibility-support)
*   [全プラットフォーム向けのUIテストAPI](#ui-testing-api-experimental-all-platforms)
*   [ポップアップ、ダイアログ、ドロップダウン向けのプラットフォームビューの分離](#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)
*   [Jetpack ComposeおよびMaterial 3からの変更のマージ](#changes-from-jetpack-compose-and-material-3-all-platforms)
*   [安定版でのKotlin/Wasmアーティファクトの利用](#kotlin-wasm-artifacts-available-in-stable-versions-of-the-framework)
*   [既知の問題：不足している依存関係](#known-issues-missing-dependencies)

## 依存関係

このバージョンのCompose Multiplatformは、以下のJetpack Composeライブラリに基づいています。

*   [Compiler 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)
*   [Runtime 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.1)
*   [UI 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.1)
*   [Foundation 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.1)
*   [Material 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.1)
*   [Material3 1.2.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.0)

## 破壊的変更

### `lineHeight`が設定されたテキストのパディングがデフォルトでトリミングされるように

[LineHeightStyle.Trim](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/LineHeightStyle.Trim)のサポートが追加されたことで、Compose Multiplatformはテキストのパディングがトリミングされる方法においてAndroidと整合性が取れるようになりました。
詳細は[プルリクエスト](https://github.com/JetBrains/compose-multiplatform-core/pull/897)を参照してください。

これは、[1.6.0-alpha01リリース](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.0-alpha01)での`compose.material`の変更に沿ったものです。
*   `includeFontPadding`パラメーターがAndroidでデフォルトで`false`になりました。
    この変更の詳細については、[Compose Multiplatformでこのフラグを実装しないことに関する議論](https://github.com/JetBrains/compose-multiplatform/issues/2477#issuecomment-1825716543)を参照してください。
*   デフォルトの行高スタイルが`Trim.None`と`Alignment.Center`に変更されました。Compose Multiplatformは現在`LineHeightStyle.Trim`をサポートし、`Trim.None`をデフォルト値として実装しています。
*   `Typography`の`TextStyle`に明示的な`lineHeight`が追加され、これにより[次の破壊的変更](#using-fontsize-in-materialtheme-requires-lineheight)につながりました。

### `MaterialTheme`で`fontSize`を使用するには`lineHeight`が必要に

> これは`material`コンポーネントのみに影響します。`material3`にはすでにこの制限がありました。
>
{style="note"}

`MaterialTheme`の`Text`コンポーネントで`fontSize`属性を設定し、`lineHeight`を含めない場合、実際の行高はフォントに一致するように変更されません。
今後は、対応する`fontSize`を設定するたびに`lineHeight`属性を明示的に指定する必要があります。

Jetpack Composeは現在、フォントサイズを直接設定しないことを[推奨](https://issuetracker.google.com/issues/321872412)しています。

> 非標準のテキストサイズをサポートするために、Material Designシステムに従い、フォントサイズを直接変更するのではなく、別の[タイプスケール](https://m2.material.io/design/typography/the-type-system.html#type-scale)を使用することをお勧めします。
> または、`style = LocalTextStyle.current.copy(lineHeight = TextUnit.Unspecified)`のように行高を上書きするか、カスタムの`Typography`を完全に作成することもできます。
>
{style="tip"}

### リソース管理の新しいアプローチ

Compose Multiplatform 1.6.0のプレビューバージョンでリソースAPIを使用していた場合、[現行バージョンのドキュメント](compose-multiplatform-resources.md)を参照して慣れてください。1.6.0-beta01で、リソースファイルをプロジェクトコードで利用できるようにするためのプロジェクトフォルダーへの保存方法が変更されました。

## プラットフォーム共通

### リソースAPIの改善 (全プラットフォーム)

新しい実験的なAPIは、文字列とフォントのサポートを追加し、共通Kotlinでリソースをより快適に共有およびアクセスできるようにします。

*   リソースは、特定の用途や制約（ロケール、画像解像度、ダークテーマとライトテーマなど）に合わせて整理でき、以下をサポートします。
    *   ロケール
    *   画像解像度
    *   ダークテーマとライトテーマ
*   Compose Multiplatformは、各プロジェクトに対して`Res`オブジェクトを生成し、リソースに直接アクセスできるようにします。

リソース修飾子の詳細、および新しいリソースAPIの詳細な概要については、[画像とリソース](compose-multiplatform-resources.md)を参照してください。

### UIテストAPI (実験的、全プラットフォーム)

デスクトップとAndroidではすでに利用可能だったCompose MultiplatformでのUIテスト用の実験的APIが、すべてのプラットフォームでサポートされるようになりました。
フレームワークがサポートするプラットフォーム間でアプリケーションのUIの動作を検証する共通テストを作成し、実行できます。
このAPIは、Jetpack Composeと同じファインダー、アサーション、アクション、マッチャーを使用します。

> JUnitベースのテストはデスクトッププロジェクトでのみサポートされています。
>
{style="note"}

セットアップ手順とテスト例については、[Compose Multiplatform UIのテスト](compose-test.md)を参照してください。

### Jetpack ComposeおよびMaterial 3からの変更 (全プラットフォーム)

#### Jetpack Compose 1.6.1

Jetpack Composeの最新リリースをマージすることで、すべてのプラットフォームでのパフォーマンスが向上します。
詳細については、[Android Developers Blogのアナウンス](https://android-developers.googleblog.com/2024/01/whats-new-in-jetpack-compose-january-24-release.html)を参照してください。

このリリースからのその他の注目すべき機能：
*   デフォルトのフォントパディングの変更はAndroidターゲットにのみ適用されました。ただし、この変更による[副作用](#using-fontsize-in-materialtheme-requires-lineheight)を考慮するようにしてください。
*   マウス選択は、以前から他のターゲットのCompose Multiplatformでサポートされていました。1.6.0では、Androidも含まれます。

Compose Multiplatformにまだ移植されていないJetpack Composeの機能：
*   [BasicTextField2](https://github.com/JetBrains/compose-multiplatform/issues/4218)
*   [非線形フォントスケーリングのサポート](https://github.com/JetBrains/compose-multiplatform/issues/4305)
*   [MultiParagraph.fillBoundingBoxes](https://github.com/JetBrains/compose-multiplatform/issues/4236)
*   [マルチプラットフォームドラッグ＆ドロップ](https://github.com/JetBrains/compose-multiplatform/issues/4235)。現時点ではAndroidでのみ動作します。デスクトップでは既存のAPIである`Modifier.onExternalDrag`を使用できます。

JetBrainsチームは、Compose Multiplatformの今後のバージョンでこれらの機能を採用することに取り組んでいます。

#### Compose Material 3 1.2.0

リリースのハイライト：
*   単一選択および複数選択が可能な新しい実験的なコンポーネント`Segmented Button`。
*   UIで情報を強調しやすくするために、より多くのサーフェスオプションを備えた拡張されたカラーセット。
    *   実装に関する注意：`ColorScheme`オブジェクトはイミュータブルになりました。コードが現在`ColorScheme`のカラーを直接変更している場合、カラーを変更するには[copy](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme#copy(androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color))メソッドを使用する必要があります。
    *   単一のサーフェス値の代わりに、より柔軟なカラー管理のためにサーフェスカラーとサーフェスコンテナーに複数のオプションが用意されました。

Material 3の変更点の詳細については、[Material Design Blogのリリース記事](https://material.io/blog/material-3-compose-1-2)を参照してください。

### ポップアップ、ダイアログ、ドロップダウン向けのプラットフォームビューの分離 (iOS、デスクトップ)

ポップアップ要素（例：ツールチップやドロップダウンメニュー）が、初期のコンポーザブルキャンバスやアプリウィンドウによって制限されないことが重要な場合があります。
これは、コンポーザブルビューが全画面を占有せず、アラートダイアログを生成する必要がある場合に特に重要になります。
1.6.0では、これを確実に実現する方法が提供されています。

ポップアップとダイアログは、依然としてそれら自身の境界（例：最上位コンテナーの影）の外側には何も描画できないことに注意してください。

#### iOS (Stable)

iOSでは、この機能はデフォルトで有効になっています。
古い動作に戻すには、`platformLayers`パラメーターを`false`に設定します。

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

デスクトップでこの機能を使用するには、`compose.layers.type`システムプロパティを設定します。
サポートされる値：
*   `WINDOW`：`Popup`および`Dialog`コンポーネントを独立した装飾のないウィンドウとして作成します。
*   `COMPONENT`：`Popup`または`Dialog`を同じウィンドウ内に独立したSwingコンポーネントとして作成します。これはオフスクリーンレンダリングでのみ機能し、`compose.swing.render.on.graphics`を`true`に設定する必要があります（1.5.0 Compose Multiplatformリリースノートの[拡張Swing相互運用](https://blog.jetbrains.com/kotlin/2023/08/compose-multiplatform-1-5-0-release/#enhanced-swing-interop)セクションを参照）。オフスクリーンレンダリングは`ComposePanel`コンポーネントでのみ機能し、全画面アプリケーションでは機能しないことに注意してください。

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

`Dialog`（黄色）は、親の`ComposePanel`（緑色）の境界に関係なく完全に描画されます。

![Dialog outside the bounds of the parent panel](compose-desktop-separate-dialog.png){width=700}

### テキスト装飾の線スタイルのサポート (iOS、デスクトップ、Web)

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

実線、二重幅の実線、点線、破線、波線の線スタイルを使用できます。すべての利用可能なオプションは[ソースコード](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui-text/src/skikoMain/kotlin/androidx/compose/ui/text/TextDecorationLineStyle.kt#L21)で確認できます。

### システムにインストールされているフォントへのアクセス (iOS、デスクトップ、Web)

Compose Multiplatformアプリからシステムにインストールされているフォントにアクセスできるようになりました。`SystemFont`クラスを使用して、適切なフォントスタイルとフォントウェイトでフォントを読み込みます。

```kotlin
import androidx.compose.ui.text.platform.SystemFont

FontFamily(SystemFont("Menlo", weight = 700))
FontFamily(SystemFont("Times New Roman", FontWeight.Bold))
FontFamily(SystemFont("Webdings"))
```

デスクトップでは、フォントファミリー名のみを指定して、利用可能なすべてのフォントスタイルを`FontFamily`関数で読み込むことができます（詳細な例は[コードサンプル](https://github.com/JetBrains/compose-multiplatform-core/blob/release/1.6.0/compose/desktop/desktop/samples/src/jvmMain/kotlin/androidx/compose/desktop/examples/fonts/Fonts.jvm.kt)を参照）。

```kotlin
FontFamily("Menlo")
```

## iOS

### アクセシビリティサポート

iOS版Compose Multiplatformは、障害を持つ人々がネイティブiOS UIと同じレベルの快適さでCompose UIと対話できるようにします。

*   スクリーンリーダーとVoiceOverがCompose UIのコンテンツにアクセスできます。
*   Compose UIは、ナビゲーションとインタラクションのためにネイティブUIと同じジェスチャーをサポートします。

これは、Compose MultiplatformのセマンティックデータをアクセシビリティサービスとXCTestフレームワークで利用できるようにすることも意味します。

実装とカスタマイズAPIの詳細については、[iOSアクセシビリティ機能のサポート](compose-ios-accessibility.md)を参照してください。

### コンポーザブルビューの不透明度変更

`ComposeUIViewController`クラスに、ビューの背景の不透明度を透明に変更する設定オプションが追加されました。

> 透明な背景は、追加のブレンディングステップを必要とするため、パフォーマンスに悪影響を与えます。
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

![Compose opaque = false demo](compose-opaque-property.png){width=700}

### `SelectionContainer`内のテキストのダブルタップとトリプルタップによる選択

以前は、iOS版Compose Multiplatformでは、テキスト入力フィールドでのみ複数のタップによるテキスト選択が可能でした。
今回のバージョンから、`SelectionContainer`内の`Text`コンポーネントに表示されるテキストの選択にも、ダブルタップとトリプルタップジェスチャーが機能するようになりました。

### `UIViewController`との相互運用

`UITabBarController`や`UINavigationController`など、`UIView`として実装されていない一部のネイティブAPIは、[既存の相互運用メカニズム](compose-uikit-integration.md)を使用してCompose Multiplatform UIに組み込むことができませんでした。

今回のバージョンから、Compose Multiplatformは`UIKitViewController`関数を実装し、ネイティブiOSビューコントローラーをCompose UIに組み込むことを可能にしました。

### テキストフィールドにおけるシングルタップ・ロングタップによるネイティブのようなキャレット動作

Compose Multiplatformは、テキストフィールドにおけるネイティブiOSのキャレット動作に近づきました。
*   テキストフィールドでのシングルタップ後のキャレットの位置がより正確に決定されます。
*   テキストフィールドでのロングタップとドラッグは、Androidのように選択モードに入るのではなく、カーソルを移動させます。

## Desktop

### 改善された相互運用ブレンディングの実験的サポート

以前は、`SwingPanel`ラッパーを使用して実装された相互運用ビューは常に長方形であり、常に前面、つまり任意のCompose Multiplatformコンポーネントの上部に表示されていました。
これにより、ポップアップ要素（ドロップダウンメニュー、トースト通知）の使用が困難になっていました。
新しい実装ではこの問題が解決され、以下のユースケースでSwingを利用できるようになりました。

*   クリッピング。長方形の形状に限定されません。クリップ修飾子とシャドウ修飾子が`SwingPanel`で正しく機能するようになりました。

    ```kotlin
    // Flag necessary to enable the experimental blending 
    System.setProperty("compose.interop.blending", "true")
  
    SwingPanel(
        modifier = Modifier.clip(RoundedCornerShape(6.dp))
        //...
    )
    ```
  
  この機能なしで`JButton`がクリッピングされる様子が左側に、実験的ブレンディングが右側に示されています。

  ![Correct clipping with SwingPanel](compose-swingpanel-clipping.png)
*   オーバーラッピング。`SwingPanel`の上に任意のCompose Multiplatformコンテンツを描画し、通常通り操作することが可能です。
    以下の例では、「Snackbar」がクリック可能な**OK**ボタン付きのSwingパネルの上に表示されています。

  ![Correct overlapping with SwingPanel](compose-swingpanel-overlapping.png)

既知の制限事項と追加の詳細については、[プルリクエストの説明](https://github.com/JetBrains/compose-multiplatform-core/pull/915)を参照してください。

## Web

### 安定版フレームワークでKotlin/Wasmアーティファクトが利用可能に

Compose Multiplatformの安定版は、Kotlin/Wasmターゲットをサポートするようになりました。
1.6.0に切り替えた後、依存関係リストで特定の`dev-wasm`バージョンの`compose-ui`ライブラリを指定する必要はありません。

> WasmターゲットでCompose Multiplatformプロジェクトをビルドするには、Kotlin 1.9.22以降が必要です。
>
{style="warning"}

## 既知の問題：不足している依存関係

デフォルトのプロジェクト設定で不足する可能性のあるライブラリがいくつかあります。

*   `org.jetbrains.compose.annotation-internal:annotation` または `org.jetbrains.compose.collection-internal:collection`

    これらは、ライブラリがCompose Multiplatform 1.6.0-beta02に依存している場合に不足する可能性があります。1.6.0-beta02は1.6.0とバイナリ互換性がありません。
    どのライブラリが原因であるかを特定するには、このコマンドを実行してください（`shared`をメインモジュールの名前に置き換えてください）。

    ```shell
    ./gradlew shared:dependencies
    ```

    ライブラリをCompose Multiplatform 1.5.12に依存するバージョンにダウングレードするか、ライブラリの作者にCompose Multiplatform 1.6.0にアップグレードするよう依頼してください。

*   `androidx.annotation:annotation:...` または `androidx.collection:collection:...`

    Compose Multiplatform 1.6.0は、Google Mavenリポジトリでのみ利用可能な[collection](https://developer.android.com/jetpack/androidx/releases/collection)および[annotation](https://developer.android.com/jetpack/androidx/releases/annotation)ライブラリに依存しています。

    このリポジトリをプロジェクトで利用可能にするには、モジュールの`build.gradle.kts`ファイルに以下の行を追加してください。

    ```kotlin
    repositories {
        //...
        google()
    }