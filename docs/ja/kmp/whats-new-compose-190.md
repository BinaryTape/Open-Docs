`[//]: # (title: Compose Multiplatform 1.9.1 の新機能)`

本機能リリースの主な変更点は以下のとおりです。

*   [`@Preview` アノテーションのパラメータ](#parameters-for-the-preview-annotation)
*   [カスタマイズ可能なシャドウ](#customizable-shadows)
*   [新しいコンテキストメニュー API](#new-context-menu-api)
*   [Material 3 Expressive テーマ](#material-3-expressive-theme)
*   [iOS でのフレームレート設定](#frame-rate-configuration)
*   [Web 版 Compose Multiplatform がベータ版に](#compose-multiplatform-for-web-in-beta)
*   [ウェブターゲットでのアクセシビリティサポート](#accessibility-support)
*   [HTML コンテンツ埋め込み用の新しい API](#new-api-for-embedding-html-content)

このリリースでの変更点の完全なリストは [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.9.0) を参照してください。

## 依存関係

*   Gradle プラグイン `org.jetbrains.compose`、バージョン 1.9.1。Jetpack Compose ライブラリに基づいています。
    *   [Runtime 1.9.3](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.9.3)
    *   [UI 1.9.3](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.9.3)
    *   [Foundation 1.9.3](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.9.3)
    *   [Material 1.9.3](https://developer.android.com/jetpack/androidx/releases/compose-material#1.9.3)
    *   [Material3 1.4.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0)

*   Compose Material3 ライブラリ `org.jetbrains.compose.material3:1.9.0`。[Jetpack Material3 1.4.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0) に基づいています。
    Compose Multiplatform と Material3 の[バージョン管理の分離](#decoupled-material3-versioning)により、プロジェクトでより新しいプレリリースバージョンを選択できます。
*   Compose Material3 Adaptive ライブラリ `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha05`。[Jetpack Material3 Adaptive 1.2.0-alpha10](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.2.0-alpha10) に基づいています。
*   Lifecycle ライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.5`。[Jetpack Lifecycle 2.9.4](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.4) に基づいています。
*   Navigation ライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.9.1`。[Jetpack Navigation 2.9.4](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.4) に基づいています。
*   Savedstate ライブラリ `org.jetbrains.androidx.savedstate:savedstate:1.3.5`。[Jetpack Savedstate 1.3.3](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.3) に基づいています。
*   WindowManager Core ライブラリ `org.jetbrains.androidx.window:window-core:1.4.0`。[Jetpack WindowManager 1.4.0](https://developer.android.com/jetpack/androidx/releases/window#1.4.0) に基づいています。

## クロスプラットフォーム

### `@Preview` アノテーションのパラメータ

Compose Multiplatform の `@Preview` アノテーションには、デザイン時プレビューで `@Composable` 関数がどのようにレンダリングされるかを設定するための追加パラメータが含まれるようになりました。

*   `name`: プレビューの表示名。
*   `group`: プレビューのグループ名。関連するプレビューを論理的に整理し、選択的に表示できます。
*   `widthDp`: 最大幅 (dp)。
*   `heightDp`: 最大高さ (dp)。
*   `locale`: アプリケーションの現在のロケール。
*   `showBackground`: プレビューにデフォルトの背景色を適用するためのフラグ。
*   `backgroundColor`: プレビューの背景色を定義する 32 ビット ARGB カラー整数。

これらの新しいプレビューパラメータは、IntelliJ IDEA と Android Studio の両方で認識され、機能します。

### カスタマイズ可能なシャドウ

Compose Multiplatform 1.9.0 では、Jetpack Compose の新しいシャドウプリミティブと API を採用し、カスタマイズ可能なシャドウを導入しました。以前からサポートされていた `shadow` モディファイアに加えて、新しい API を使用して、より高度で柔軟なシャドウ効果を作成できるようになりました。

異なる種類のシャドウを作成するために、2 つの新しいプリミティブが利用可能です。
`DropShadowPainter()` と `InnerShadowPainter()`。

これらの新しいシャドウを UI コンポーネントに適用するには、`dropShadow` または `innerShadow` モディファイアでシャドウ効果を設定します。

<list columns="2">
   <li><code-block lang="kotlin" code="        Box(&#10;            Modifier.size(120.dp)&#10;                .dropShadow(&#10;                    RectangleShape,&#10;                    DropShadow(12.dp)&#10;                )&#10;                .background(Color.White)&#10;        )&#10;        Box(&#10;            Modifier.size(120.dp)&#10;                .innerShadow(&#10;                    RectangleShape,&#10;                    InnerShadow(12.dp)&#10;                )&#10;        )"/></li>
   <li><img src="compose-advanced-shadows.png" type="inline" alt="Customizable shadows" width="200"/></li>
</list>

あらゆる形状と色のシャドウを描画したり、シャドウジオメトリをマスクとして使用して、内部グラデーションで塗りつぶされたシャドウを作成することもできます。

<img src="compose-expressive-shadows.png" alt="Expressive shadows" width="244"/>

詳細については、[shadow API リファレンス](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/shadow/package-summary.html)を参照してください。

### 新しいコンテキストメニュー API

Jetpack Compose の新しいカスタムコンテキストメニュー API を `SelectionContainer` および `BasicTextField` に採用しました。iOS と Web の実装は完了しており、デスクトップでは初期サポートが提供されています。

<list columns="2">
   <li><img src="compose_basic_text_field.png" type="inline" alt="Context menu for BasicTextField" width="420"/></li>
   <li><img src="compose_selection_container.png" type="inline" alt="Context menu for SelectionContainer" width="440"/></li>
</list>

この新しい API を有効にするには、アプリケーションのエントリポイントで次の設定を使用します。

```kotlin
ComposeFoundationFlags.isNewContextMenuEnabled = true
```

詳細については、[コンテキストメニュー API リファレンス](https://developer.android.com/reference/kotlin/androidx/compose/foundation/text/contextmenu/data/package-summary)を参照してください。

### Material 3 Expressive テーマ
<primary-label ref="Experimental"/>

Compose Multiplatform は、Material 3 ライブラリの実験的な [`MaterialExpressiveTheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary?hl=en#MaterialExpressiveTheme(androidx.compose.material3.ColorScheme,androidx.compose.material3.MotionScheme,androidx.compose.material3.Shapes,androidx.compose.material3.Typography,kotlin.Function0)) をサポートするようになりました。Expressive テーマを使用すると、Material Design アプリをカスタマイズして、よりパーソナライズされたエクスペリエンスを実現できます。

>Jetpack Material3 の [1.4.0-beta01 リリース](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0-beta01)に合わせて、
> `ExperimentalMaterial3ExpressiveApi` および `ExperimentalMaterial3ComponentOverrideApi` タグが付けられたすべての公開 API は削除されました。
>
>これらの実験的な機能を引き続き使用したい場合は、以前の Material3 アルファバージョンを明示的に含める必要があります。
{style="note"}

Expressive テーマを使用するには:

1.  最新の Material 3 の実験版を含めます。

    ```kotlin
    implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
    ```

2.  `@OptIn(ExperimentalMaterial3ExpressiveApi::class)` オプトインを付けて `MaterialExpressiveTheme()` 関数を使用し、`colorScheme`、`motionScheme`、`shapes`、`typography` パラメータを設定することで、UI 要素全体のテーマを設定します。

その後、[`Button()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-button.html) や [`Checkbox()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-checkbox.html) などの Material コンポーネントは、提供された値を自動的に使用します。

<img src="compose_expressive_theme.animated.gif" alt="Material 3 Expressive" width="250" preview-src="compose_expressive_theme.png"/>

### `androidx.compose.runtime:runtime` のマルチプラットフォームターゲット

Compose Multiplatform と Jetpack Compose の整合性を向上させるため、すべてのターゲットを `androidx.compose.runtime:runtime` アーティファクトに直接サポートを追加しました。

`org.jetbrains.compose.runtime:runtime` アーティファクトは引き続き完全に互換性があり、エイリアスとして機能します。

### `suspend` ラムダを持つ `runComposeUiTest()`

`runComposeUiTest()` 関数は `suspend` ラムダを受け入れるようになり、`awaitIdle()` などのサスペンド関数を使用できるようになりました。

新しい API は、ウェブ環境での適切な非同期処理を含め、サポートされているすべてのプラットフォームで正しいテスト実行を保証します。

*   JVM およびネイティブターゲットの場合、`runComposeUiTest()` は `runBlocking()` と同様に機能しますが、遅延をスキップします。
*   ウェブターゲット (Wasm および JS) の場合、`Promise` を返し、遅延をスキップしてテスト本体を実行します。

## iOS

### フレームレート設定

Compose Multiplatform for iOS は、コンポーザブルをレンダリングするための優先フレームレートの設定をサポートするようになりました。アニメーションがカクつく場合は、フレームレートを上げることを検討してください。一方、アニメーションが遅いまたは静止している場合は、電力消費を減らすために低いフレームレートで実行することを好むかもしれません。

優先フレームレートカテゴリは次のように設定できます。

```kotlin
Modifier.preferredFrameRate(FrameRateCategory.High)
```

または、コンポーザブルに特定のフレームレートが必要な場合は、非負の数値を使用して 1 秒あたりのフレーム数で優先フレームレートを定義できます。

```kotlin
Modifier.preferredFrameRate(30f)
```

同じ `@Composable` ツリー内で `preferredFrameRate` を複数回適用した場合、指定された値のうち最も高い値が適用されます。
ただし、デバイスのハードウェアによってサポートされるフレームレートは制限される場合があり、通常は最大 120 Hz です。

### IME オプション

Compose Multiplatform 1.9.0 では、テキスト入力コンポーネント向けの iOS 固有の IME カスタマイズのサポートが導入されました。
これで、`PlatformImeOptions` を使用して、キーボードタイプ、自動修正、リターンキーの動作などのネイティブ UIKit テキスト入力特性をテキストフィールドコンポーネントで直接設定できます。

```kotlin
BasicTextField(
    value = "",
    onValueChange = {},
    keyboardOptions = KeyboardOptions(
        platformImeOptions = PlatformImeOptions {
            keyboardType(UIKeyboardTypeEmailAddress)
        }
    )
)
```

## Web

### Web 版 Compose Multiplatform がベータ版に

Web 版 Compose Multiplatform がベータ版になりました。ぜひお試しください。
このマイルストーンに到達するために行われた進捗の詳細については、[ブログ記事](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/)を参照してください。

安定版のリリースに向けて、ロードマップには以下が含まれます。

*   モバイルブラウザでのドラッグアンドドロップ機能のサポート実装。
*   アクセシビリティサポートの改善。
*   `TextField` コンポーネントに関連する問題への対処。

### アクセシビリティサポート

Compose Multiplatform は、ウェブターゲットに対する初期のアクセシビリティサポートを提供するようになりました。このバージョンでは、スクリーンリーダーが説明ラベルにアクセスできるようになり、ユーザーはアクセシブルナビゲーションモードでボタンをナビゲートしてクリックできるようになります。

このバージョンでは、以下の機能はまだサポートされていません。

*   スクロールとスライダーを持つ相互運用およびコンテナビューのアクセシビリティ。
*   トラバーサルインデックス。

コンポーネントの[セマンティックプロパティ](compose-accessibility.md#semantic-properties)を定義して、コンポーネントのテキスト説明、機能タイプ、現在の状態、または一意の識別子など、さまざまな詳細をアクセシビリティサービスに提供できます。

たとえば、コンポーザブルに `Modifier.semantics { heading() }` を設定することで、この要素がドキュメント内の章やサブセクションのタイトルと同様に、見出しとして機能することをアクセシビリティサービスに通知します。スクリーンリーダーはこの情報をコンテンツナビゲーションに利用し、ユーザーが見出し間を直接移動できるようになります。

```kotlin
Text(
    text = "This is heading", 
    modifier = Modifier.semantics { heading() }
)
```

アクセシビリティサポートはデフォルトで有効になっていますが、`isA11YEnabled` を調整することでいつでも無効にできます。

```kotlin
ComposeViewport(
    viewportContainer = document.body!!,
    configure = { isA11YEnabled = false }
) {
    Text("Hello, Compose Multiplatform for web")
}
```

### HTML コンテンツ埋め込み用の新しい API

新しい `WebElementView()` コンポーザブル関数を使用すると、HTML 要素をウェブアプリケーションにシームレスに統合できます。

埋め込み HTML 要素は、Compose コードで定義されたサイズに基づいてキャンバス領域をオーバーレイします。この領域内の入力イベントをインターセプトし、それらのイベントが Compose Multiplatform によって受信されるのを防ぎます。

以下は、`WebElementView()` を使用して、Compose アプリケーション内にインタラクティブな地図ビューを表示する HTML 要素を作成および埋め込む例です。

```kotlin
private val ttOSM =
    "https://www.openstreetmap.org/export/embed.html?bbox=4.890965223312379%2C52.33722052818563%2C4.893990755081177%2C52.33860862450587&amp;layer=mapnik"

@Composable
fun Map() {
    Box(
        modifier = Modifier.fillMaxWidth().fillMaxHeight()
    ) {
        WebElementView(
            factory = {
                (document.createElement("iframe")
                        as HTMLIFrameElement)
                    .apply { src = ttOSM }
            },
            modifier = Modifier.fillMaxSize(),
            update = { iframe -> iframe.src = iframe.src }
        )
    }
}
```

この関数は `ComposeViewport` エントリポイントでのみ使用できます。`CanvasBasedWindow` は非推奨です。

### ナビゲーショングラフへのバインディングのための簡易化された API

Compose Multiplatform は、ブラウザのナビゲーション状態を `NavController` にバインドするための新しい API を導入しました。

```kotlin
suspend fun NavController.bindToBrowserNavigation()
```

新しい関数は `window` API と直接対話する必要性を排除し、Kotlin/Wasm と Kotlin/JS の両方のソースセットを簡素化します。

以前使用されていた `Window.bindToNavigation()` 関数は、新しい `NavController.bindToBrowserNavigation()` 関数に有利なように非推奨になりました。

変更前:

```kotlin
LaunchedEffect(Unit) {
    // Directly interacts with the window object
    window.bindToNavigation(navController)
}
```

変更後:

```kotlin
LaunchedEffect(Unit) {
    // Implicitly accesses the window object
    navController.bindToBrowserNavigation()
}
```

## Desktop

### ディスプレイ前のウィンドウ設定

Compose Multiplatform には、新しい `SwingFrame()` および `SwingDialog()` コンポーザブルが追加されました。
これらは既存の `Window()` および `DialogWindow()` 関数に似ていますが、`init` ブロックが含まれています。

以前は、ディスプレイ前に設定する必要がある特定のウィンドウプロパティを設定できませんでした。
新しい `init` ブロックは、ウィンドウまたはダイアログが画面に表示される前に実行されるため、`java.awt.Window.setType` のようなプロパティを設定したり、早期に準備が必要なイベントリスナーを追加したりすることができます。

ウィンドウまたはダイアログが表示された後に変更できないプロパティにのみ `init` ブロックを使用することをお勧めします。
その他のすべての設定については、コードが互換性を保ち、将来のアップデートで正しく機能するように、`LaunchedEffect(window)` パターンを引き続き使用してください。

## Gradle プラグイン

### Material3 のバージョン管理の分離

Material3 ライブラリと Compose Multiplatform Gradle プラグインのバージョンと安定性レベルを合わせる必要がなくなりました。`compose.material3` DSL エイリアスは、Jetpack Compose の安定版リリースからの Material3 1.9.0 を参照しますが、プロジェクトでプレリリースバージョンを選択できます。

Expressive デザインサポート付きの Material3 バージョンを使用したい場合は、`build.gradle.kts` の Material 3 依存関係を以下に置き換えてください。

```kotlin
implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
```

### 統合されたウェブディストリビューション

新しい `composeCompatibilityBrowserDistribution` Gradle タスクは、Kotlin/JS と Kotlin/Wasm ディストリビューションを単一のパッケージに結合します。
これにより、最新の Wasm 機能がブラウザでサポートされていない場合でも、Wasm アプリケーションが JS ターゲットにフォールバックできるようになります。