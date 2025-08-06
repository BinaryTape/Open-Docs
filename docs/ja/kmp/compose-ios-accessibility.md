[//]: # (title: iOSアクセシビリティ機能のサポート)

Compose Multiplatformのアクセシビリティサポートにより、障がいのある方もネイティブのiOS UIと同じくらい快適にCompose Multiplatform UIを操作できます。

*   スクリーンリーダーとVoiceOverは、Compose Multiplatform UIのコンテンツにアクセスできます。
*   Compose Multiplatform UIは、ネイティブのiOS UIと同じジェスチャーをサポートし、ナビゲーションや操作が可能です。

これは、Compose APIによって生成されたセマンティクスデータが、iOSアクセシビリティサービスによって利用されるネイティブオブジェクトとプロパティにマッピングされるようになったためです。Materialウィジェットで構築されたほとんどのインターフェースでは、これは自動的に行われます。

このセマンティクスデータは、テストやその他の自動化でも使用できます。`testTag`などのプロパティは、`accessibilityIdentifier`のようなネイティブのアクセシビリティプロパティに正しくマッピングされます。これにより、Compose MultiplatformからのセマンティクスデータがアクセシビリティサービスとXCTestフレームワークで利用可能になります。

## ハイコントラストテーマ

Compose MultiplatformはMaterial3ライブラリの[`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/)クラスを使用しており、現在、ハイコントラストカラーの既製サポートは不足しています。iOSでハイコントラストテーマを使用するには、アプリケーションパレットに追加のカラーセットを追加する必要があります。各カスタムカラーに対して、そのハイコントラストバージョンを手動で指定する必要があります。

iOSには**コントラストを上げる**アクセシビリティ設定があり、これは`UIAccessibilityDarkerSystemColorsEnabled`の値をチェックすることで検出できます。また、`UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`を追跡することもできます。これらのAPIを使用すると、システムアクセシビリティ設定が有効になったときに、ハイコントラストカラーパレットに切り替えることができます。

カラーパレットを定義する際は、WCAG準拠のコントラストチェッカーツールを使用して、選択した`onPrimary`カラーがプライマリカラーと、`onSurface`がサーフェスカラーと、その他も同様に十分なコントラストを持っていることを確認してください。カラー間のコントラスト比は少なくとも4.5:1であることを確認してください。カスタムの前景と背景の色の場合、特に小さいテキストではコントラスト比が7:1である必要があります。これは、`lightColorScheme`と`darkColorScheme`の両方に適用されます。

このコードは、テーマパッケージでハイコントラストのライトおよびダークカラーパレットを定義する方法を示しています。

```kotlin
import androidx.compose.ui.graphics.Color

// Defines a data class to hold the color palette for high-contrast themes
data class HighContrastColors(
    val primary: Color, // Main interactive elements, primary text, top app bars
    val onPrimary: Color, // Content displayed on top of a 'primary' color
    val secondary: Color, // Secondary interactive elements, floating action buttons
    val onSecondary: Color, // Content displayed on top of a 'secondary' color
    val tertiary: Color, // An optional third accent color
    val onTertiary: Color, // Content displayed on top of a 'tertiary' color
    val background: Color, // Main background of the screen
    val onBackground: Color, // Content displayed on top of a 'background' color
    val surface: Color, // Card backgrounds, sheets, menus, elevated surfaces
    val onSurface: Color, // Content displayed on top of a 'surface' color
    val error: Color, // Error states and messages
    val onError: Color, // Content displayed on top of an 'error' color
    val success: Color, // Success states and messages
    val onSuccess: Color, // Content displayed on top of a 'success' color
    val warning: Color, // Warning states and messages
    val onWarning: Color, // Content displayed on top of a 'warning' color
    val outline: Color, // Borders, dividers, disabled states
    val scrim: Color // Dimming background content behind modals/sheets
)

// Neutral colors
val Black = Color(0xFF000000)
val White = Color(0xFFFFFFFF)
val DarkGrey = Color(0xFF1A1A1A)
val MediumGrey = Color(0xFF888888)
val LightGrey = Color(0xFFE5E5E5)

// Primary accent colors
val RoyalBlue = Color(0xFF0056B3)
val SkyBlue = Color(0xFF007AFF)

// Secondary  and tertiary accent colors
val EmeraldGreen = Color(0xFF28A745)
val GoldenYellow = Color(0xFFFFC107)
val DeepPurple = Color(0xFF6F42C1)

// Status colors
val ErrorRed = Color(0xFFD32F2F)
val SuccessGreen = Color(0xFF388E3C)
val WarningOrange = Color(0xFFF57C00)

// Light high-contrast palette, dark content on light backgrounds
val LightHighContrastPalette =
    HighContrastColors(
        primary = RoyalBlue,
        onPrimary = White,
        secondary = EmeraldGreen,
        onSecondary = White,
        tertiary = DeepPurple,
        onTertiary = White,
        background = White,
        onBackground = Black,
        surface = LightGrey,
        onSurface = DarkGrey,
        error = ErrorRed,
        onError = White,
        success = SuccessGreen,
        onSuccess = White,
        warning = WarningOrange,
        onWarning = White,
        outline = MediumGrey,
        scrim = Black.copy(alpha = 0.6f)
    )

// Dark high-contrast palette, light content on dark backgrounds
val DarkHighContrastPalette =
    HighContrastColors(
        primary = SkyBlue,
        onPrimary = Black,
        secondary = EmeraldGreen,
        onSecondary = White,
        tertiary = GoldenYellow,
        onTertiary = Black,
        background = Black,
        onBackground = White,
        surface = DarkGrey,
        onSurface = LightGrey,
        error = ErrorRed,
        onError = White,
        success = SuccessGreen,
        onSuccess = White,
        warning = WarningOrange,
        onWarning = White,
        outline = MediumGrey,
        scrim = Black.copy(alpha = 0.6f)
    )
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="val LightHighContrastPalette = HighContrastColors( primary = RoyalBlue,"}

## トラックパッドとキーボードによる制御

iOS用Compose Multiplatformは、デバイスを制御するための追加の入力方法をサポートしています。タッチスクリーンに依存する代わりに、AssistiveTouchを有効にしてマウスやトラックパッドを使用したり、フルキーボードアクセスを有効にしてキーボードを使用したりできます。

*   AssistiveTouch（**設定** | **アクセシビリティ** | **タッチ** | **AssistiveTouch**）を使用すると、接続されたマウスまたはトラックパッドのポインタでiPhoneを制御できます。ポインタを使用して画面上のアイコンをクリックしたり、AssistiveTouchメニューをナビゲートしたり、オンスクリーンキーボードを使用して入力したりできます。

    iPadでは、マウスまたはトラックパッドを接続すると、基本的な使用はすぐにできます。ただし、ポインタのサイズを調整したり、トラッキング速度を変更したり、特定の操作をボタンに割り当てたりする場合は、AssistiveTouchを有効にする必要があります。
*   フルキーボードアクセス（**設定** | **アクセシビリティ** | **キーボード** | **フルキーボードアクセス**）は、接続されたキーボードでデバイスを制御できるようにします。**Tab**キーでナビゲートし、**Space**キーで項目をアクティブにできます。

## XCTestフレームワークでアクセシビリティをテストする

セマンティックアクセシビリティデータは、テストやその他の自動化で使用できます。`testTag`などのプロパティは、`accessibilityIdentifier`のようなネイティブのアクセシビリティプロパティに正しくマッピングされます。これにより、Compose MultiplatformからのセマンティックデータがアクセシビリティサービスとXCTestフレームワークで利用可能になります。

UIテストで自動化されたアクセシビリティ監査を使用できます。`XCUIApplication`に対して`performAccessibilityAudit()`を呼び出すと、Accessibility Inspectorと同様に、現在のビューのアクセシビリティの問題が監査されます。

```swift
func testAccessibilityTabView() throws {
	let app = XCUIApplication()
	app.launch()
	app.tabBars.buttons["MyLabel"].tap()

	try app.performAccessibilityAudit()
}
```

## アクセシビリティツリーの同期をカスタマイズする

デフォルト設定では：
*   iOSアクセシビリティツリーは、アクセシビリティサービスが実行されている場合にのみUIと同期されます。
*   同期イベントはログに記録されません。

新しいCompose Multiplatform APIを使用して、これらの設定をカスタマイズできます。

### ツリー同期オプションを選択する

> Compose Multiplatform 1.8.0では、[このオプションは削除されました](whats-new-compose-180.md#loading-accessibility-tree-on-demand)。
> アクセシビリティツリーは遅延同期されるため、追加の設定は不要になりました。
>
{style="tip"}

イベントとインタラクションをデバッグおよびテストするために、同期モードを次のように変更できます。
*   ツリーをUIと同期しない（例: アクセシビリティマッピングを一時的に無効にする）。
*   ツリーを常に同期する（UIが更新されるたびにツリーが書き換えられ、アクセシビリティ統合を徹底的にテストできる）。

> UIイベントごとにツリーを同期することは、デバッグやテストには非常に役立ちますが、アプリのパフォーマンスを低下させる可能性があることを覚えておいてください。
>
{style="note"}

アクセシビリティツリーを常に同期するオプションを有効にする例：

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.Always(debugLogger = null)
}) {
    // your @Composable content
}
```

`AccessibilitySyncOptions`クラスには、利用可能なすべてのオプションが含まれています。

```kotlin
// package androidx.compose.ui.platform

@ExperimentalComposeApi
sealed class AccessibilitySyncOptions {
    
    // Option to never synchronize the accessibility tree
    object Never: AccessibilitySyncOptions

    // Option to synchronize the tree only when Accessibility Services are running
    //
    // You can include an AccessibilityDebugLogger to log interactions and tree syncing events
    class WhenRequiredByAccessibilityServices(debugLogger: AccessibilityDebugLogger?)

    // Option to always synchronize the accessibility tree
    //
    // You can include an AccessibilityDebugLogger to log interactions and tree syncing events
    class Always(debugLogger: AccessibilityDebugLogger?)
}
```

### ロギングインターフェースを実装する

`AccessibilityDebugLogger`インターフェースを実装することで、選択した出力にカスタムメッセージを書き込むことができます。

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.WhenRequiredByAccessibilityServices(object: AccessibilityDebugLogger {
         override fun log(message: Any?) {
             if (message == null) {
                 println()
             } else { 
                 println("[a11y]: $message") 
             } 
         } 
    })
}) {
    // your @Composable content
}
```

## 次のステップ

*   [Appleのアクセシビリティ](https://developer.apple.com/accessibility/)ガイドで詳細を学びましょう。
*   [Kotlin Multiplatformウィザード](https://kmp.jetbrains.com/)によって生成されたプロジェクトを、通常のiOSアクセシビリティワークフローで試してみてください。