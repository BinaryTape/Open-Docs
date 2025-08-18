[//]: # (title: Compose Multiplatform 1.7.3の新機能)

このフィーチャーリリースの主なハイライトは以下の通りです。

*   [型安全なナビゲーション](#type-safe-navigation)
*   [共有要素トランジション](#shared-element-transitions)
*   [Androidアセットにパッケージ化されたマルチプラットフォームリソース](#resources-packed-into-android-assets)
*   [カスタムリソースディレクトリ](#custom-resource-directories)
*   [マルチプラットフォームテストリソースのサポート](#support-for-multiplatform-test-resources)
*   [iOSでのタッチ操作の相互運用性の改善](#new-default-behavior-for-processing-touch-in-ios-native-elements)
*   [Material3 `adaptive` と `material3-window-size-class` が共通コードで利用可能に](#material3-adaptive-adaptive)
*   [デスクトップでのドラッグ＆ドロップ実装](#drag-and-drop)
*   [`BasicTextField` がデスクトップに採用](#basictextfield-renamed-from-basictextfield2-adopted-on-desktop)

このリリースの変更点の全リストは[GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#170-october-2024)で確認できます。

## 依存関係

*   Gradleプラグイン `org.jetbrains.compose`, バージョン 1.7.3。Jetpack Composeライブラリに基づいています。
    *   [Runtime 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.7.5)
    *   [UI 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.7.5)
    *   [Foundation 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.7.5)
    *   [Material 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-material#1.7.5)
    *   [Material3 1.3.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.1)
*   Lifecycleライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.3`。 [Jetpack Lifecycle 2.8.5](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.5)に基づいています。
*   Navigationライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.8.0-alpha10`。 [Jetpack Navigation 2.8.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.8.0)に基づいています。
*   Material3 Adaptiveライブラリ `org.jetbrains.compose.material3.adaptive:adaptive-*:1.0.0`。 [Jetpack Material3 Adaptive 1.0.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.0.0)に基づいています。

## 破壊的変更

### 最小AGPバージョンが8.1.0に引き上げられました

Compose Multiplatform 1.7.0で使用されているJetpack Compose 1.7.0とLifecycle 2.8.0のいずれも、AGP 7をサポートしていません。
そのため、Compose Multiplatform 1.7.3にアップデートする際には、AGPの依存関係もアップグレードする必要があるかもしれません。

> Android Studioで新たに実装されたAndroidコンポーザブルのプレビューには、[最新のAGPバージョン](#resources-packed-into-android-assets)のいずれかが必要です。
>
{style="note"}

### JavaリソースAPIはマルチプラットフォームリソースライブラリに優先して非推奨になりました

<!-- TODO additional copy editing -->

このリリースでは、`compose.ui`パッケージで利用可能なJavaリソースAPIを明示的に非推奨とします。
具体的には、`painterResource()`、`loadImageBitmap()`、`loadSvgPainter()`、`loadXmlImageVector()` 関数、
ならびに `ClassLoaderResourceLoader` クラスおよびそれに依存する関数です。

[マルチプラットフォームリソースライブラリ](compose-multiplatform-resources.md)への移行を検討してください。
JavaリソースをCompose Multiplatformで使用することはできますが、生成されたアクセサー、マルチモジュールサポート、ローカライゼーションなど、フレームワークが提供する拡張機能の恩恵を受けることはできません。

それでもJavaリソースにアクセスする必要がある場合は、[プルリクエストで提案されている実装](https://github.com/JetBrains/compose-multiplatform-core/pull/1457)をコピーすることで、Compose Multiplatform 1.7.3にアップグレードし、可能な限りマルチプラットフォームリソースに切り替えた後でもコードが動作することを確認できます。

### iOSネイティブ要素でのタッチ処理の新しいデフォルト動作

1.7.3以前では、Compose Multiplatformは相互運用UIビューに着地したタッチイベントに応答できず、相互運用ビューがこれらのタッチシーケンスを完全に処理していました。

Compose Multiplatform 1.7.3では、相互運用タッチシーケンスを処理するためのより洗練されたロジックが実装されています。
デフォルトでは、最初のタッチ後に遅延が設けられるようになり、これにより親コンポーザブルがタッチシーケンスがネイティブビューとのインタラクションを意図したものかどうかを理解し、それに応じて反応するのに役立ちます。

詳細については、[このページのiOSセクションでの説明](#ios-touch-interop)を参照するか、[この機能のドキュメント](compose-ios-touch.md)をお読みください。

### iOSでの最小フレーム期間の無効化は必須です

開発者は、高リフレッシュレートディスプレイに関する出力される警告に気付かないことが多く、ユーザーは120Hz対応デバイスでスムーズなアニメーションを利用できませんでした。
現在、このチェックを厳密に強制しています。`Info.plist`ファイル内の`CADisableMinimumFrameDurationOnPhone`プロパティが存在しないか`false`に設定されている場合、Compose Multiplatformでビルドされたアプリはクラッシュするようになります。

この動作を無効にするには、`ComposeUIViewControllerConfiguration.enforceStrictPlistSanityCheck`プロパティを`false`に設定します。

### デスクトップ版のModifier.onExternalDragは非推奨になりました

<!-- TODO additional copy editing -->

実験的な`Modifier.onExternalDrag`および関連APIは、新しい`Modifier.dragAndDropTarget`に優先して非推奨になりました。
`DragData`インターフェースは`compose.ui.draganddrop`パッケージに移動されました。

Compose Multiplatform 1.7.0で非推奨のAPIを使用している場合、非推奨エラーに遭遇します。
1.8.0では、`onExternalDrag`モディファイアは完全に削除される予定です。

## クロスプラットフォーム

### 共有要素トランジション

Compose Multiplatformは、一貫した要素を共有するコンポーザブル間のシームレスなトランジションのためのAPIを提供するようになりました。
これらのトランジションは、ユーザーがUIの変更の軌跡を追うのに役立つため、ナビゲーションでよく利用されます。

APIの詳細については、[Jetpack Composeドキュメント](https://developer.android.com/develop/ui/compose/animation/shared-elements)を参照してください。

### 型安全なナビゲーション

Compose Multiplatformは、Jetpack Composeの型安全なアプローチを採用し、ナビゲーションルートに沿ってオブジェクトを渡すようになりました。
Navigation 2.8.0の新しいAPIにより、Composeはナビゲーショングラフのコンパイル時の安全性を確保できるようになります。
これらのAPIは、XMLベースのナビゲーションにおける[Safe Args](https://developer.android.com/guide/navigation/use-graph/pass-data#Safe-args)プラグインと同じ結果を実現します。

詳細は、[GoogleのNavigation Composeにおける型安全性に関するドキュメント](https://developer.android.com/guide/navigation/design/type-safety)を参照してください。

### マルチプラットフォームリソース

#### Androidアセットにパッケージ化されたリソース

すべてのマルチプラットフォームリソースがAndroidアセットにパッケージ化されるようになりました。これにより、Android StudioでAndroidソースセット内のCompose Multiplatformコンポーザブルのプレビューを生成できます。

> Android StudioのプレビューはAndroidソースセット内のコンポーザブルでのみ利用可能です。
> また、最新バージョンのAGP (8.5.2、8.6.0-rc01、または8.7.0-alpha04) のいずれかが必要です。
>
{style="note"}

これにより、Android上のWebViewやメディアプレーヤーコンポーネントからマルチプラットフォームリソースに直接アクセスできるようになりました。
例えば、`Res.getUri(“files/index.html”)`のようなシンプルなパスでリソースにアクセスできます。

以下は、リソースHTMLページとリソース画像へのリンクを表示するAndroidコンポーザブルの例です。

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

この例は、以下のシンプルなHTMLファイルで動作します。

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

この例の2つのリソースファイルは、`commonMain`ソースセットに配置されています。

![composeResourcesディレクトリのファイル構造](compose-resources-android-webview.png){width="230"}

#### カスタムリソースディレクトリ

新しい`customDirectory`設定を構成DSLで使用すると、特定のソースセットに[カスタムディレクトリを関連付ける](compose-multiplatform-resources-setup.md#custom-resource-directories)ことができます。これにより、例えば、ダウンロードしたファイルをリソースとして使用することが可能になります。

#### マルチプラットフォームフォントキャッシュ

Compose Multiplatformは、Androidのフォントキャッシュ機能を他のプラットフォームにも提供し、`Font`リソースの過剰なバイト読み取りを排除します。

#### マルチプラットフォームテストリソースのサポート

リソースライブラリは、プロジェクトでのテストリソースの使用をサポートするようになり、以下のことが可能になります。

*   テストソースセットにリソースを追加する。
*   対応するソースセットでのみ利用可能な生成されたアクセサーを使用する。
*   テスト実行時のみ、テストリソースをアプリにパッケージ化する。

#### アクセスを容易にするために文字列IDにマッピングされたリソース

各タイプのリソースは、ファイル名とマッピングされています。例えば、`Res.allDrawableResources`プロパティを使用して、すべての`drawable`リソースのマップを取得し、その文字列IDを渡すことで必要なリソースにアクセスできます。

```kotlin
Image(painterResource(Res.allDrawableResources["compose_multiplatform"]!!), null)
```

#### バイト配列をImageBitmapまたはImageVectorに変換する関数

`ByteArray`を画像リソースに変換するための新しい関数が追加されました。

*   `decodeToImageBitmap()`は、JPEG、PNG、BMP、またはWEBPファイルを`ImageBitmap`オブジェクトに変換します。
*   `decodeToImageVector()`は、XMLベクターファイルを`ImageVector`オブジェクトに変換します。
*   `decodeToSvgPainter()`は、SVGファイルを`Painter`オブジェクトに変換します。この関数はAndroidでは利用できません。

詳細については、[ドキュメント](compose-multiplatform-resources-usage.md#convert-byte-arrays-into-images)を参照してください。

### 新しい共通モジュール

#### material3.adaptive:adaptive*

Material3アダプティブモジュールが、Compose Multiplatformで共通コードとして利用可能になりました。
これらを使用するには、モジュールの`build.gradle.kts`ファイルで、対応する依存関係を`commonMain`ソースセットに明示的に追加します。

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-layout:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-navigation:1.0.0-alpha03")
}
```

#### material3.material3-adaptive-navigation-suite

Composeで[アダプティブナビゲーションを構築](https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation)するために必要なMaterial3アダプティブナビゲーションスイートが、Compose Multiplatformで共通コードとして利用可能になりました。
これを使用するには、モジュールの`build.gradle.kts`ファイルで、依存関係を`commonMain`ソースセットに明示的に追加します。

```kotlin
commonMain.dependencies {
    implementation(compose.material3AdaptiveNavigationSuite)
}
```

#### material3:material3-window-size-class

[`WindowSizeClass`](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary)クラスを使用するには、モジュールの`build.gradle.kts`ファイルで、`material3-window-size-class`依存関係を`commonMain`ソースセットに明示的に追加します。

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3:material3-window-size-class:1.7.3")
}
```

`calculateWindowSizeClass()`関数は、まだ共通コードでは利用できません。
ただし、プラットフォーム固有のコードでインポートして呼び出すことはできます。例:

```kotlin
// desktopMain/kotlin/main.kt
import androidx.compose.material3.windowsizeclass.calculateWindowSizeClass

// ...

val size = calculateWindowSizeClass()
```

#### material-navigation

`material-navigation`ライブラリは、Compose Multiplatform Navigationに加えて、共通コードで利用可能です。
これを使用するには、モジュールの`build.gradle.kts`ファイルで、以下の明示的な依存関係を`commonMain`ソースセットに追加します。

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.androidx.navigation:navigation-compose:2.8.0-alpha10")
    implementation("org.jetbrains.compose.material:material-navigation:1.7.0-beta02")
}
```

### SkiaがMilestone 126にアップデートされました

Compose Multiplatformが[Skiko](https://github.com/JetBrains/skiko)経由で使用しているSkiaのバージョンがMilestone 126にアップデートされました。

以前のSkiaのバージョンはMilestone 116でした。これらのバージョン間の変更点は、[リリースノート](https://skia.googlesource.com/skia/+/refs/heads/main/RELEASE_NOTES.md#milestone-126)で確認できます。

### GraphicsLayer – 新しい描画API

Jetpack Compose 1.7.0で追加された新しい描画レイヤーが、Compose Multiplatformでも利用可能になりました。

`Modifier.graphicsLayer`とは異なり、新しい`GraphicsLayer`クラスを使用すると、Composableコンテンツをどこにでもレンダリングできます。
これは、アニメーションコンテンツが異なるシーンでレンダリングされることが期待される場合に役立ちます。

詳細な説明と例については、[リファレンスドキュメント](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/layer/GraphicsLayer)を参照してください。

### LocalLifecycleOwnerがCompose UIから移動されました

`LocalLifecycleOwner`クラスが、Compose UIパッケージからLifecycleパッケージに移動されました。

この変更により、Compose UIに依存せずにクラスにアクセスし、ComposeベースのヘルパーAPIを呼び出すことができます。
ただし、Compose UIバインディングがない場合、`LocalLifecycleOwner`インスタンスにはプラットフォーム統合がなく、プラットフォーム固有のイベントをリッスンできないことに注意してください。

## iOS

### Compose MultiplatformとネイティブiOS間のタッチ相互運用性の改善 {id="ios-touch-interop"}

このリリースでは、iOSの相互運用ビューのタッチハンドリングが改善されました。
Compose Multiplatformは、タッチが相互運用ビューを意図しているのか、それともComposeで処理されるべきなのかを検出するようになりました。
これにより、Compose Multiplatformアプリ内のUIKitまたはSwiftUI領域で発生するタッチイベントを処理することが可能になります。

デフォルトでは、Compose Multiplatformはタッチイベントを相互運用ビューに送信するのを150ミリ秒遅延させます。

*   この時間枠内にしきい値を超える移動があった場合、
    親のコンポーザブルがタッチシーケンスをインターセプトし、相互運用ビューには転送されません。
*   顕著な移動がない場合、Composeはタッチシーケンスの残りを処理せず、
    代わりに相互運用ビューが単独で処理します。

この動作は、ネイティブの[`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview)の動作と一致しています。
これにより、相互運用ビューで始まったタッチシーケンスが、Compose Multiplatformがそれを認識する機会もなくインターセプトされてしまう状況を防ぐことができます。これはユーザーにとって不満な体験につながる可能性があります。
例えば、レイジーリストのようなスクロール可能なコンテキストで、画面の大部分を占める大きな相互運用ビデオプレーヤーがある場合を想像してみてください。
ビデオがすべてのタッチをインターセプトし、Compose Multiplatformがそれらを認識していない場合、リストをスクロールするのは難しいでしょう。

### ネイティブパフォーマンスの改善

<!-- TODO additional copy editing -->

Kotlin 2.0.20では、Kotlin/NativeチームはiOSでのComposeアプリのパフォーマンスをより速く、よりスムーズにするために大きな進歩を遂げました。
Compose Multiplatform 1.7.3リリースでは、これらの最適化に加え、Jetpack Compose 1.7.0からのパフォーマンス改善も取り入れられています。

Kotlin 2.0.0と組み合わせたCompose Multiplatform 1.6.11と、Kotlin 2.0.20と組み合わせたCompose Multiplatform 1.7.3を比較すると、全体的に良い結果が見られます。

*   *LazyGrid*ベンチマークは、実際の使用例に最も近い`LazyVerticalGrid`のスクロールをシミュレートし、平均して**約9%**高速に実行されます。
    また、UIの応答性が低いとユーザーに感じさせる原因となるフレーム落ちの数も大幅に減少しています。
    ぜひご自身でお試しください。Compose MultiplatformでiOS向けに作成されたアプリは、はるかにスムーズに感じるはずです。
*   *VisualEffects*ベンチマークは、多数のランダムに配置されたコンポーネントをレンダリングし、**3.6倍**高速に動作します。
    1000フレームあたりの平均CPU時間は8.8秒から2.4秒に短縮されました。
*   *AnimatedVisibility*コンポーザブルは、画像の表示と非表示をアニメーション化し、**約6%**高速なレンダリングを示します。

さらに、Kotlin 2.0.20では、ガベージコレクターに実験的な[並行マーキングのサポート](https://kotlinlang.org/docs/whatsnew2020.html#concurrent-marking-in-garbage-collector)が導入されました。並行マーキングを有効にすると、ガベージコレクターの一時停止が短縮され、すべてのベンチマークでさらに大きな改善につながります。

これらのCompose固有のベンチマークのコードは、Compose Multiplatformリポジトリで確認できます。

*   [Kotlin/Nativeパフォーマンスベンチマーク](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/kn-performance)
*   [Kotlin/JVM対Kotlin/Nativeベンチマーク](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/ios/jvm-vs-kotlin-native)

## デスクトップ

### ドラッグ＆ドロップ

ユーザーがコンテンツをComposeアプリケーションにドラッグしたり、アプリケーションからドラッグしたりできるようにするドラッグ＆ドロップメカニズムが、デスクトップ版のCompose Multiplatformに実装されました。
ドラッグ＆ドロップの潜在的なソースと宛先を指定するには、`dragAndDropSource`および`dragAndDropTarget`修飾子を使用します。

> これらの修飾子は共通コードで利用可能ですが、現在はデスクトップおよびAndroidソースセットでのみ動作します。
> 今後のリリースにご期待ください。
>
{style="note"}

一般的な使用例については、Jetpack Composeドキュメントの[専用記事](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)を参照してください。

### BasicTextField（BasicTextField2から名称変更）がデスクトップに採用されました

Jetpack Composeは`BasicTextField2`コンポーネントを安定化させ、`BasicTextField`に名称変更しました。
このリリースでは、Compose Multiplatformがデスクトップターゲット向けにこの変更を採用しており、安定版1.7.0ではiOSもカバーする計画です。

新しい`BasicTextField`は以下の機能を提供します。

*   状態をより確実に管理できます。
*   テキストフィールドのコンテンツをプログラムで変更するための新しい`TextFieldBuffer` APIを提供します。
*   視覚的な変換とスタイリングのためのいくつかの新しいAPIが含まれています。
*   フィールドの以前の状態に戻る機能を持つ`UndoState`へのアクセスを提供します。

### ComposePanelのレンダー設定

`ComposePanel`コンストラクタで新しい`RenderSettings.isVsyncEnabled`パラメータを指定することで、バックエンドレンダリング実装に垂直同期を無効にするようヒントを与えることができます。
これにより、入力とUIの変更間の視覚的な遅延を減らすことができますが、テアリングが発生する可能性もあります。

デフォルトの動作は変わりません。`ComposePanel`は描画可能なプレゼンテーションをVSyncと同期しようとします。

## Web

### skiko.jsはKotlin/Wasmアプリケーションにとって冗長になりました

<!-- TODO additional copy editing -->

`skiko.js`ファイルは、Compose MultiplatformでビルドされたKotlin/Wasmアプリケーションにとって冗長になりました。
`index.html`ファイルから削除でき、アプリの読み込み時間を改善できます。
`skiko.js`は将来のリリースでKotlin/Wasmの配布物から完全に削除されます。

> `skiko.js`ファイルはKotlin/JSアプリケーションには依然として必要です。
>
{style="note"}