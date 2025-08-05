[//]: # (title: Compose Multiplatform 1.7.3 の新機能)

本リリースにおける主要な変更点は以下の通りです:

*   [型安全なナビゲーション](#type-safe-navigation)
*   [共有要素トランジション](#shared-element-transitions)
*   [Androidアセットにパッケージ化されたマルチプラットフォームリソース](#resources-packed-into-android-assets)
*   [カスタムリソースディレクトリ](#custom-resource-directories)
*   [マルチプラットフォームテストリソースのサポート](#support-for-multiplatform-test-resources)
*   [iOSでのタッチ相互運用の改善](#new-default-behavior-for-processing-touch-in-ios-native-elements)
*   [Material3の`adaptive`および`material3-window-size-class`が共通コードで利用可能に](#material3-adaptive-adaptive)
*   [デスクトップにドラッグ&ドロップを実装](#drag-and-drop)
*   [デスクトップで`BasicTextField`を採用](#basictextfield-renamed-from-basictextfield2-adopted-on-desktop)

本リリースの変更点の全リストは[GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#170-october-2024)で確認してください。

## 依存関係

*   Gradleプラグイン `org.jetbrains.compose`、バージョン1.7.3。Jetpack Composeライブラリに基づく:
    *   [Runtime 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.7.5)
    *   [UI 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.7.5)
    *   [Foundation 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.7.5)
    *   [Material 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-material#1.7.5)
    *   [Material3 1.3.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.1)
*   Lifecycleライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.3`。 [Jetpack Lifecycle 2.8.5](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.5)に基づく。
*   Navigationライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.8.0-alpha10`。 [Jetpack Navigation 2.8.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.8.0)に基づく。
*   Material3 Adaptiveライブラリ `org.jetbrains.compose.material3.adaptive:adaptive-*:1.0.0`。 [Jetpack Material3 Adaptive 1.0.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.0.0)に基づく。

## 破壊的変更

### 最小AGPバージョンが8.1.0に引き上げ

Compose Multiplatform 1.7.0で利用されているJetpack Compose 1.7.0とLifecycle 2.8.0のいずれも、AGP 7をサポートしていません。
そのため、Compose Multiplatform 1.7.3にアップデートする際には、AGPの依存関係もアップグレードする必要があるかもしれません。

> Android StudioでのAndroidコンポーザブル向けの新規実装されたプレビューには、[最新のAGPバージョン](#resources-packed-into-android-assets)が必要です。
>
{style="note"}

### JavaリソースAPIはマルチプラットフォームリソースライブラリに優先して非推奨化

<!-- TODO additional copy editing -->

このリリースでは、`compose.ui`パッケージで利用可能なJavaリソースAPIを明示的に非推奨とします:
`painterResource()`、`loadImageBitmap()`、`loadSvgPainter()`、`loadXmlImageVector()` 関数、
および `ClassLoaderResourceLoader` クラスとそれに依存する関数です。

[マルチプラットフォームリソースライブラリ](compose-multiplatform-resources.md)への移行を検討してください。
Compose MultiplatformでJavaリソースを使用することはできますが、フレームワークが提供する拡張機能（生成されたアクセサー、マルチモジュールサポート、ローカライズなど）の恩恵を受けることはできません。

それでもJavaリソースにアクセスする必要がある場合は、[プルリクエストで提案されている実装](https://github.com/JetBrains/compose-multiplatform-core/pull/1457)をコピーすることで、Compose Multiplatform 1.7.3にアップグレードし、可能な限りマルチプラットフォームリソースに切り替えた後でもコードが機能することを確認できます。

### iOSネイティブ要素でのタッチ処理の新しいデフォルト動作

1.7.3より前では、Compose Multiplatformは相互運用UIビューに着地したタッチイベントに応答できなかったため、相互運用ビューがこれらのタッチシーケンスを完全に処理していました。

Compose Multiplatform 1.7.3では、相互運用タッチシーケンスを処理するためのより洗練されたロジックが実装されています。
デフォルトでは、初期タッチ後に遅延が設けられるようになりました。これにより、親コンポーザブルはタッチシーケンスがネイティブビューとのインタラクションを意図したものかどうかを理解し、それに応じて反応できるようになります。

詳細については、[このページのiOSセクションでの説明](#ios-touch-interop)を参照するか、[この機能のドキュメント](compose-ios-touch.md)をお読みください。

### iOSでの最小フレーム持続時間無効化は必須

開発者は高リフレッシュレートディスプレイに関する警告表示に気づかないことが多く、ユーザーは120Hz対応デバイスでスムーズなアニメーションを利用できませんでした。
現在、このチェックを厳格に強制しています。`Info.plist`ファイルに`CADisableMinimumFrameDurationOnPhone`プロパティが存在しないか、`false`に設定されている場合、Compose Multiplatformでビルドされたアプリはクラッシュするようになります。

`ComposeUIViewControllerConfiguration.enforceStrictPlistSanityCheck`プロパティを`false`に設定することで、この動作を無効にできます。

### デスクトップでのModifier.onExternalDragの非推奨化

<!-- TODO additional copy editing -->

実験的な`Modifier.onExternalDrag`と関連APIは、新しい`Modifier.dragAndDropTarget`に優先して非推奨となりました。
`DragData`インターフェースは`compose.ui.draganddrop`パッケージに移動されました。

Compose Multiplatform 1.7.0で非推奨のAPIを使用している場合、非推奨エラーが発生します。
1.8.0では、`onExternalDrag`モディファイアは完全に削除される予定です。

## 全プラットフォーム共通

### 共有要素トランジション

Compose Multiplatformでは、一貫した要素を共有するコンポーザブル間でのシームレスなトランジション用のAPIが提供されるようになりました。
これらのトランジションはナビゲーションで役立つことが多く、ユーザーがUIの変更の軌跡を追うのに役立ちます。

APIの詳細については、[Jetpack Composeドキュメント](https://developer.android.com/develop/ui/compose/animation/shared-elements)を参照してください。

### 型安全なナビゲーション

Compose Multiplatformは、ナビゲーションルートを介してオブジェクトを渡すJetpack Composeの型安全なアプローチを採用しました。
Navigation 2.8.0の新しいAPIにより、Composeはナビゲーショングラフのコンパイル時安全性を提供できるようになりました。
これらのAPIは、XMLベースのナビゲーションにおける[Safe Args](https://developer.android.com/guide/navigation/use-graph/pass-data#Safe-args)プラグインと同じ結果を実現します。

詳細は、[Navigation ComposeにおけるGoogleの型安全に関するドキュメント](https://developer.android.com/guide/navigation/design/type-safety)を参照してください。

### マルチプラットフォームリソース

#### Androidアセットにパッケージ化されたリソース

すべてのマルチプラットフォームリソースがAndroidアセットにパッケージ化されるようになりました。これにより、Android StudioでAndroidソースセット内のCompose Multiplatformコンポーザブルのプレビューを生成できるようになります。

> Android Studioのプレビューは、Androidソースセット内のコンポーザブルでのみ利用可能です。
> また、AGPの最新バージョン（8.5.2、8.6.0-rc01、または8.7.0-alpha04）のいずれかが必要です。
>
{style="note"}

これにより、Android上のWebViewやメディアプレイヤーコンポーネントからマルチプラットフォームリソースに直接アクセスできるようになりました。
リソースは簡単なパスで到達できるため、例えば `Res.getUri(“files/index.html”)` のようにアクセスできます。

以下は、リソースHTMLページとリソース画像へのリンクを表示するAndroidコンポーザブルの例です:

```kotlin
// androidMain/kotlin/com/example/webview/App.kt
@OptIn(ExperimentalResourceApi::class)
@Composable
@Preview
fun App() {
    MaterialTheme {
        val uri = Res.getUri("files/webview/index.html")

        // Adding a WebView inside AndroidView with layout as full screen.
        AndroidView(factory = {
            WebView(it).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            }
        }, update = {
            it.loadUrl(uri)
        })
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="AndroidView(factory = { WebView(it).apply"}

この例は、このシンプルなHTMLファイルで動作します:

```html
<html>
<header>
    <title>
        Cat Resource
    </title>
</header>
<body>
    <img src="cat.jpg">
</body>
</html>
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="<title>Cat Resource</title>"}

この例のどちらのリソースファイルも `commonMain` ソースセットに配置されています:

![composeResourcesディレクトリのファイル構造](compose-resources-android-webview.png){width="230"}

#### カスタムリソースディレクトリ

構成DSLの新しい`customDirectory`設定を使用すると、[カスタムディレクトリを特定のソースセットに関連付ける](compose-multiplatform-resources-setup.md#custom-resource-directories)ことができます。これにより、例えばダウンロードしたファイルをリソースとして使用できるようになります。

#### マルチプラットフォームフォントキャッシュ

Compose Multiplatformは、Androidのフォントキャッシュ機能を他のプラットフォームにも提供し、`Font`リソースの過剰なバイト読み取りを排除します。

#### マルチプラットフォームテストリソースのサポート

リソースライブラリは、プロジェクトでのテストリソースの使用をサポートするようになりました。これは、次のことを意味します:

*   テストソースセットにリソースを追加できます。
*   対応するソースセットでのみ利用可能な生成されたアクセサーを使用できます。
*   テスト実行時のみテストリソースをアプリにパッケージ化できます。

#### 簡単なアクセスを可能にする文字列IDにマッピングされたリソース

各タイプのリソースは、そのファイル名でマッピングされます。例えば、`Res.allDrawableResources`プロパティを使用して、すべての`drawable`リソースのマップを取得し、その文字列IDを渡すことで必要なリソースにアクセスできます:

```kotlin
Image(painterResource(Res.allDrawableResources["compose_multiplatform"]!!), null)
```

#### バイト配列をImageBitmapまたはImageVectorに変換する関数

`ByteArray`を画像リソースに変換するための新しい関数があります:

*   `decodeToImageBitmap()`は、JPEG、PNG、BMP、またはWEBPファイルを`ImageBitmap`オブジェクトに変換します。
*   `decodeToImageVector()`は、XMLベクトルファイルを`ImageVector`オブジェクトに変換します。
*   `decodeToSvgPainter()`は、SVGファイルを`Painter`オブジェクトに変換します。この関数はAndroidでは利用できません。

詳細については、[ドキュメント](compose-multiplatform-resources-usage.md#convert-byte-arrays-into-images)を参照してください。

### 新しい共通モジュール

#### material3.adaptive:adaptive*

Material3アダプティブモジュールがCompose Multiplatformで共通コードで利用可能になりました。
これらを使用するには、モジュールの`build.gradle.kts`ファイルで、対応する依存関係を共通ソースセットに明示的に追加します:

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-layout:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-navigation:1.0.0-alpha03")
}
```

#### material3.material3-adaptive-navigation-suite

Composeで[アダプティブナビゲーションを構築する](https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation)ために必要なMaterial3アダプティブナビゲーションスイートが、Compose Multiplatformで共通コードで利用可能です。
これを使用するには、モジュールの`build.gradle.kts`ファイルで、依存関係を共通ソースセットに明示的に追加します:

```kotlin
commonMain.dependencies {
    implementation(compose.material3AdaptiveNavigationSuite)
}
```

#### material3:material3-window-size-class

[`WindowSizeClass`](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary)クラスを使用するには、モジュールの`build.gradle.kts`ファイルで、`material3-window-size-class`依存関係を共通ソースセットに明示的に追加します:

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3:material3-window-size-class:1.7.3")
}
```

`calculateWindowSizeClass()`関数はまだ共通コードでは利用できません。
ただし、プラットフォーム固有のコードでインポートして呼び出すことは可能です。例:

```kotlin
// desktopMain/kotlin/main.kt
import androidx.compose.material3.windowsizeclass.calculateWindowSizeClass

// ...

val size = calculateWindowSizeClass()
```

#### material-navigation

`material-navigation`ライブラリは、Compose Multiplatform Navigationに加えて共通コードで利用可能です。
これを使用するには、モジュールの`build.gradle.kts`ファイルで、以下の明示的な依存関係を共通ソースセットに追加します:

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.androidx.navigation:navigation-compose:2.8.0-alpha10")
    implementation("org.jetbrains.compose.material:material-navigation:1.7.0-beta02")
}
```

### SkiaがMilestone 126に更新

Compose Multiplatformで[Skiko](https://github.com/JetBrains/skiko)経由で利用されるSkiaのバージョンがMilestone 126に更新されました。

以前のSkiaバージョンはMilestone 116でした。これらのバージョン間の変更点は[リリースノート](https://skia.googlesource.com/skia/+/refs/heads/main/RELEASE_NOTES.md#milestone-126)で確認できます。

### GraphicsLayer – 新しい描画API

Jetpack Compose 1.7.0で追加された新しい描画レイヤーが、Compose Multiplatformでも利用可能になりました。

`Modifier.graphicsLayer`とは異なり、新しい`GraphicsLayer`クラスを使用すると、Composableコンテンツをどこにでもレンダリングできます。
これは、アニメーションコンテンツが異なるシーンでレンダリングされることが期待される場合に役立ちます。

詳細な説明と例については、[リファレンスドキュメント](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/layer/GraphicsLayer)を参照してください。

### LocalLifecycleOwnerがCompose UIから移動

`LocalLifecycleOwner`クラスがCompose UIパッケージからLifecycleパッケージに移動されました。

この変更により、Compose UIとは独立してこのクラスにアクセスし、そのComposeベースのヘルパーAPIを呼び出すことができます。
ただし、Compose UIバインディングがない場合、`LocalLifecycleOwner`インスタンスはプラットフォーム統合を持たず、したがってプラットフォーム固有のイベントをリッスンできないことに注意してください。

## iOS

### Compose MultiplatformとネイティブiOS間のタッチ相互運用の改善 {id="ios-touch-interop"}

このリリースでは、iOSの相互運用ビューにおけるタッチ処理が改善されました。
Compose Multiplatformは、タッチが相互運用ビューを意図しているのか、それともComposeによって処理されるべきなのかを検出するようになりました。
これにより、Compose Multiplatformアプリ内のUIKitまたはSwiftUI領域で発生するタッチイベントを処理できるようになります。

デフォルトでは、Compose Multiplatformは相互運用ビューへのタッチイベントの送信を150ミリ秒遅延させます:

*   この時間枠内に距離しきい値を超える移動があった場合、
    親コンポーザブルがタッチシーケンスをインターセプトし、相互運用ビューには転送されません。
*   顕著な移動がない場合、Composeはタッチシーケンスの残りを処理せず、
    代わりに相互運用ビューが単独で処理します。

この動作は、ネイティブの[`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview)がどのように機能するかと一致しています。
これにより、相互運用ビューで始まったタッチシーケンスが、Compose Multiplatformが認識する機会もなくインターセプトされてしまう状況を防ぐことができます。これは、ユーザーにとって不満の募る体験につながる可能性があります。
例えば、Lazy Listのようなスクロール可能なコンテキストで、画面の大部分を占める相互運用ビデオプレイヤーを想像してみてください。
画面のほとんどがすべてのタッチをインターセプトし、Compose Multiplatformがそれらを認識しない場合、リストをスクロールするのは困難になります。

### ネイティブパフォーマンスの改善

<!-- TODO additional copy editing -->

Kotlin 2.0.20では、Kotlin/NativeチームはiOS上のComposeアプリをより高速かつスムーズに動作させるために多大な進歩を遂げました。
Compose Multiplatform 1.7.3リリースでは、これらの最適化に加え、Jetpack Compose 1.7.0からのパフォーマンス改善も取り入れています。

Kotlin 2.0.0を搭載したCompose Multiplatform 1.6.11とKotlin 2.0.20を搭載したCompose Multiplatform 1.7.3を比較すると、全体的に優れた結果が得られます:

*   *LazyGrid*ベンチマークは、実際のユースケースに最も近い`LazyVerticalGrid`スクロールをシミュレートし、平均で**約9%**高速に動作します。
    また、フレーム落ちの数が大幅に減少し、これにより通常、ユーザーはUIの応答性が低いと感じます。
    ぜひご自身でお試しください。Compose Multiplatformで作成されたiOSアプリは、はるかにスムーズに感じるはずです。
*   *VisualEffects*ベンチマークは、多くのランダムに配置されたコンポーネントをレンダリングし、**3.6**倍高速に動作します:
    1000フレームあたりの平均CPU時間が8.8秒から2.4秒に短縮されました。
*   *AnimatedVisibility*コンポーザブルは画像の表示と非表示をアニメーション化し、**約6%**高速なレンダリングを示します。

さらに、Kotlin 2.0.20では、ガベージコレクターに実験的な[並行マークのサポート](https://kotlinlang.org/docs/whatsnew2020.html#concurrent-marking-in-garbage-collector)が導入されました。並行マークを有効にすると、ガベージコレクターの一時停止が短縮され、すべてのベンチマークでさらに大きな改善につながります。

これらのCompose固有のベンチマークのコードは、Compose Multiplatformリポジトリで確認できます:

*   [Kotlin/Nativeパフォーマンスベンチマーク](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/kn-performance)
*   [Kotlin/JVM対Kotlin/Nativeベンチマーク](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/ios/jvm-vs-kotlin-native)

## デスクトップ

### ドラッグ&ドロップ

ユーザーがコンテンツをComposeアプリケーションにドラッグしたり、アプリケーションからドラッグしたりできるようにするドラッグ&ドロップメカニズムが、デスクトップ版Compose Multiplatformに実装されました。
ドラッグ&ドロップの潜在的なソースとデスティネーションを指定するには、`dragAndDropSource`および`dragAndDropTarget`モディファイアを使用します。

> これらのモディファイアは共通コードで利用可能ですが、現在のところデスクトップとAndroidのソースセットでのみ動作します。
> 今後のリリースにご期待ください。
>
{style="note"}

一般的なユースケースについては、Jetpack Composeドキュメントの[専用記事](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)を参照してください。

### BasicTextField (BasicTextField2から改名) がデスクトップに採用

Jetpack Composeは`BasicTextField2`コンポーネントを安定版とし、`BasicTextField`に改名しました。
このリリースでは、Compose Multiplatformがデスクトップターゲット向けに変更を採用し、安定版1.7.0ではiOSもカバーする計画です。

新しい`BasicTextField`は以下の機能を提供します:

*   状態をより信頼性高く管理できます。
*   テキストフィールドのコンテンツをプログラムで変更するための新しい`TextFieldBuffer` APIを提供します。
*   視覚的な変換とスタイリングのためのいくつかの新しいAPIが含まれています。
*   フィールドの以前の状態に戻る機能を持つ`UndoState`へのアクセスを提供します。

### ComposePanelのレンダー設定

`ComposePanel`コンストラクターで新しい`RenderSettings.isVsyncEnabled`パラメーターを指定することで、バックエンドレンダリング実装に垂直同期を無効にするようヒントを与えることができます。
これにより、入力とUIの変更間の視覚的レイテンシーを減らすことができますが、画面のティアリングにつながる可能性もあります。

デフォルトの動作は変わりません: `ComposePanel`は、描画可能なプレゼンテーションをVSyncと同期させようとします。

## Web

### Kotlin/Wasmアプリケーションにとってskiko.jsは不要に

<!-- TODO additional copy editing -->

`skiko.js`ファイルは、Compose MultiplatformでビルドされたKotlin/Wasmアプリケーションにとって不要になりました。
`index.html`ファイルから削除でき、アプリのロード時間を改善できます。
`skiko.js`は、将来のリリースでKotlin/Wasmディストリビューションから完全に削除される予定です。

> `skiko.js`ファイルは、Kotlin/JSアプリケーションでは依然として必要です。
>
{style="note"}