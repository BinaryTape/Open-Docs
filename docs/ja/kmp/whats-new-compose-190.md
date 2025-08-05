[//]: # (title: Compose Multiplatformの新機能 %org.jetbrains.compose-eap%)

このEAPフィーチャーリリースにおける主要な変更点は以下の通りです。

*   [Material 3 Expressive テーマ](#new-material-3-expressive-theme)
*   [カスタマイズ可能なシャドウ](#customizable-shadows)
*   [`@Preview` アノテーションのパラメータ](#parameters-for-the-preview-annotation)
*   [iOSでのフレームレート設定](#frame-rate-configuration)
*   [ウェブターゲットでのアクセシビリティサポート](#accessibility-support)
*   [HTMLコンテンツ埋め込み用の新しいAPI](#new-api-for-embedding-html-content)

このリリースの変更点については、[GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.9.0-beta01)で完全なリストをご確認ください。

## 依存関係

*   Gradle Plugin `org.jetbrains.compose`、バージョン %org.jetbrains.compose-eap%。Jetpack Compose ライブラリに基づいています：
    *   [Runtime 1.9.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.9.0-beta02)
    *   [UI 1.9.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.9.0-beta02)
    *   [Foundation 1.9.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.9.0-beta02)
    *   [Material 1.9.0-beta02](https://developer.android.com/jetpack/androidx/releases/compose-material#1.9.0-beta02)
    *   [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
*   Compose Material3 ライブラリ `org.jetbrains.compose.material3:1.9.0-alpha04`。[Jetpack Material3 1.4.0-alpha17](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0-alpha17)に基づいています。

    共通のMaterial3ライブラリの安定版はJetpack Compose Material3 1.3.2に基づいていますが、Compose MultiplatformとMaterial3の[バージョン非連動化](#decoupled-material3-versioning)により、プロジェクトでより新しいEAPバージョンを選択できます。
*   Compose Material3 Adaptive ライブラリ `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha04`。[Jetpack Material3 Adaptive 1.2.0-alpha08](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.2.0-alpha08)に基づいています。
*   Graphics-Shapes ライブラリ `org.jetbrains.androidx.graphics:graphics-shapes:1.0.0-alpha09`。[Jetpack Graphics-Shapes 1.0.1](https://developer.android.com/jetpack/androidx/releases/graphics#graphics-shapes-1.0.1)に基づいています。
*   Lifecycle ライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.1`。[Jetpack Lifecycle 2.9.1](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.1)に基づいています。
*   Navigation ライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta04`。[Jetpack Navigation 2.9.1](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.1)に基づいています。
*   Savedstate ライブラリ `org.jetbrains.androidx.savedstate:savedstate:1.3.1`。[Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0)に基づいています。
*   WindowManager Core ライブラリ `org.jetbrains.androidx.window:window-core:1.4.0-alpha09`。[Jetpack WindowManager 1.4.0](https://developer.android.com/jetpack/androidx/releases/window#1.4.0)に基づいています。

## クロスプラットフォーム

### 新しい Material 3 Expressive テーマ
<secondary-label ref="Experimental"/>

Compose Multiplatformは、Material 3ライブラリからの試験的な [`MaterialExpressiveTheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary?hl=en#MaterialExpressiveTheme(androidx.compose.material3.ColorScheme,androidx.compose.material3.MotionScheme,androidx.compose.material3.Shapes,androidx.compose.material3.Typography,kotlin.Function0)) をサポートするようになりました。Expressive themingにより、Material Designアプリをよりパーソナライズされた体験のためにカスタマイズできます。

Expressive テーマを使用するには：

1.  Material 3 の最新バージョンを含めます：

    ```kotlin
    implementation("org.jetbrains.compose.material3:material3:%org.jetbrains.compose.material3%")
    ```

2.  `@OptIn(ExperimentalMaterial3ExpressiveApi::class)` オプトインで `MaterialExpressiveTheme()` 関数を使用し、`colorScheme`、`motionScheme`、`shapes`、`typography` パラメータを設定してUI要素の全体的なテーマを設定します。

[`Button()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-button.html) や [`Checkbox()`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-checkbox.html) などのMaterialコンポーネントは、提供した値を自動的に使用するようになります。

<img src="compose_expressive_theme.animated.gif" alt="Material 3 Expressive" width="250" preview-src="compose_expressive_theme.png"/>

### カスタマイズ可能なシャドウ

Compose Multiplatform %org.jetbrains.compose-eap% では、Jetpack Compose の新しいシャドウプリミティブとAPIを採用し、カスタマイズ可能なシャドウを導入しました。以前からサポートされていた `shadow` 修飾子に加えて、新しいAPIを使用してより高度で柔軟なシャドウエフェクトを作成できるようになりました。

異なる種類のシャドウを作成するための2つの新しいプリミティブが利用可能です：
`DropShadowPainter()` と `InnerShadowPainter()`。

これらの新しいシャドウをUIコンポーネントに適用するには、`dropShadow` または `innerShadow` 修飾子でシャドウエフェクトを設定します：

<list columns="2">
   <li><code-block lang="kotlin">
        Box(
            Modifier.size(120.dp)
                .dropShadow(
                    RectangleShape,
                    DropShadow(12.dp)
                )
                .background(Color.White)
        )
        Box(
            Modifier.size(120.dp)
                .innerShadow(
                    RectangleShape,
                    InnerShadow(12.dp)
                )
        )
   </code-block></li>
   <li><img src="compose-advanced-shadows.png" type="inline" alt="Customizable shadows" width="200"/></li>
</list>

あらゆる形状と色のシャドウを描画したり、シャドウジオメトリをマスクとして使用して内側のグラデーションフィルシャドウを作成することも可能です：

<img src="compose-expressive-shadows.png" alt="Expressive shadows" width="244"/>

詳細については、[shadow API リファレンス](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/shadow/package-summary.html)を参照してください。

### `@Preview` アノテーションのパラメータ

Compose Multiplatform の `@Preview` アノテーションには、デザインタイムプレビューで `@Composable` 関数がどのようにレンダリングされるかを設定するための追加パラメータが含まれるようになりました：

*   `name`: プレビューの表示名。
*   `group`: プレビューのグループ名。関連するプレビューを論理的に整理し、選択的に表示できます。
*   `widthDp`: 最大幅 (dp単位)。
*   `heightDp`: 最大高さ (dp単位)。
*   `locale`: アプリケーションの現在のロケール。
*   `showBackground`: プレビューにデフォルトの背景色を適用するためのフラグ。
*   `backgroundColor`: プレビューの背景色を定義する32ビットARGBカラー整数。

これらの新しいプレビューパラメータは、IntelliJ IDEA と Android Studio の両方で認識され、機能します。

### `androidx.compose.runtime:runtime` 内のマルチプラットフォームターゲット

Compose MultiplatformとJetpack Composeの連携を改善するため、`androidx.compose.runtime:runtime` アーティファクトにすべてのターゲットのサポートを直接追加しました。

`org.jetbrains.compose.runtime:runtime` アーティファクトは完全に互換性を維持し、現在はエイリアスとして機能します。

### `suspend` ラムダを持つ `runComposeUiTest()`

`runComposeUiTest()` 関数が `suspend` ラムダを受け入れるようになり、`awaitIdle()` などの suspending 関数を使用できるようになりました。

新しいAPIは、ウェブ環境での適切な非同期処理を含む、すべてのサポートされているプラットフォームで正しいテスト実行を保証します：

*   JVM およびネイティブターゲットの場合、`runComposeUiTest()` は `runBlocking()` と同様に機能しますが、遅延をスキップします。
*   ウェブターゲット (Wasm および JS) の場合、`Promise` を返し、遅延をスキップしてテスト本体を実行します。

## iOS

### フレームレート設定

Compose Multiplatform for iOS は、コンポーザブルのレンダリングのための推奨フレームレートを設定する機能をサポートするようになりました。アニメーションがカクつく場合、フレームレートを上げたいかもしれません。一方、アニメーションが遅い、または静止している場合、消費電力を減らすために低いフレームレートで実行したいと考えるかもしれません。

推奨フレームレートカテゴリは次のように設定できます：

```kotlin
Modifier.preferredFrameRate(FrameRateCategory.High)
```

あるいは、コンポーザブルに特定のフレームレートが必要な場合は、非負の数値を使用して1秒あたりのフレーム数で推奨フレームレートを定義できます：

```kotlin
Modifier.preferredFrameRate(30f)
```

## Web

### アクセシビリティサポート

Compose Multiplatformは、ウェブターゲット向けの初期アクセシビリティサポートを提供するようになりました。このバージョンでは、スクリーンリーダーが説明ラベルにアクセスできるようになり、ユーザーはアクセシブルナビゲーションモードでボタンをナビゲートしたりクリックしたりできるようになります。

このバージョンでは、以下の機能はまだサポートされていません：

*   スクロールとスライダーを備えたインターオップビューおよびコンテナビューのアクセシビリティ。
*   トラバーサルインデックス。

コンポーネントの[セマンティックプロパティ](compose-accessibility.md#semantic-properties)を定義することで、コンポーネントのテキスト説明、機能タイプ、現在の状態、または一意の識別子など、さまざまな詳細をアクセシビリティサービスに提供できます。

例えば、コンポーザブルに `Modifier.semantics { heading() }` を設定することで、その要素がドキュメントの章やサブセクションのタイトルと同様に見出しとして機能することをアクセシビリティサービスに通知します。スクリーンリーダーはこの情報をコンテンツナビゲーションに利用でき、ユーザーは見出し間を直接移動できるようになります。

```kotlin
Text(
    text = "This is heading", 
    modifier = Modifier.semantics { heading() }
)
```

アクセシビリティサポートは現在デフォルトで有効になっていますが、`isA11YEnabled` を調整することでいつでも無効にできます：

```kotlin
ComposeViewport(
    viewportContainer = document.body!!,
    configure = { isA11YEnabled = false }
) {
    Text("Hello, Compose Multiplatform for web")
}
```

### HTMLコンテンツ埋め込み用の新しいAPI

新しい `WebElementView()` コンポーザブル関数を使用すると、HTML要素をウェブアプリケーションにシームレスに統合できます。

埋め込まれたHTML要素は、Composeコードで定義されたサイズに基づいてキャンバス領域にオーバーレイされます。その領域内の入力イベントをインターセプトし、それらのイベントがCompose Multiplatformに受信されるのを防ぎます。

以下は、`WebElementView()` を使用してHTML要素を作成し、Composeアプリケーション内にインタラクティブな地図ビューを表示する例です：

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

この関数は `ComposeViewport` エントリポイントでのみ使用できます。`CanvasBasedWindow` は非推奨になりました。

### コンテキストメニュー

Compose Multiplatform %org.jetbrains.compose-eap% は、ウェブコンテキストメニューに関して以下の更新をもたらします：

*   テキストコンテキストメニュー: 標準のComposeテキストコンテキストメニューが、モバイルモードとデスクトップモードの両方で完全にサポートされるようになりました。
*   新しいカスタマイズ可能なコンテキストメニュー: カスタムウェブコンテキストメニューのためのJetpack Composeの新しいAPIを採用しました。現時点では、デスクトップモードでのみ利用可能です。

    この新しいAPIを有効にするには、アプリケーションのエントリポイントで以下の設定を使用します：

    ```kotlin
    ComposeFoundationFlags.isNewContextMenuEnabled = true
    ```

### ナビゲーショングラフへのバインディングAPIの簡素化

Compose Multiplatformは、ブラウザのナビゲーション状態を `NavController` にバインドするための新しいAPIを導入しました：

```kotlin
suspend fun NavController.bindToBrowserNavigation()
```

この新しい関数により、`window` APIと直接対話する必要がなくなり、Kotlin/Wasm と Kotlin/JS の両方のソースセットが簡素化されます。

以前使用されていた `Window.bindToNavigation()` 関数は、新しい `NavController.bindToBrowserNavigation()` 関数を優先して非推奨になりました。

変更前：

```kotlin
LaunchedEffect(Unit) {
    // Directly interacts with the window object
    window.bindToNavigation(navController)
}
```

変更後：

```kotlin
LaunchedEffect(Unit) {
    // Implicitly accesses the window object
    navController.bindToBrowserNavigation()
}
```

## Gradle プラグイン

### Material3 のバージョン非連動化

Material3 ライブラリと Compose Multiplatform Gradle プラグインのバージョンおよび安定性レベルは、もはや整合させる必要がなくなりました。`compose.material3` DSL エイリアスは、以前のJetpack Compose安定版リリースからのMaterial3 1.8.2を参照するようになりました。

Expressive design サポート付きの新しいMaterial3バージョンを使用したい場合は、`build.gradle.kts` 内のMaterial 3の依存関係を以下のように置き換えてください：

```kotlin
implementation("org.jetbrains.compose.material3:material3:%org.jetbrains.compose.material3%")