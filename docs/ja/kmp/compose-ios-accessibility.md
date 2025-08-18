[//]: # (title: iOSアクセシビリティ機能への対応)

Compose Multiplatformのアクセシビリティ対応により、障がいのある方々がCompose Multiplatform UIをネイティブのiOS UIと同じくらい快適に操作できるようになります。

* スクリーンリーダーとVoiceOverは、Compose Multiplatform UIのコンテンツにアクセスできます。
* Compose Multiplatform UIは、ナビゲーションと操作のためにネイティブのiOS UIと同じジェスチャーをサポートします。

これは、Compose APIによって生成されるセマンティクスデータが、iOSアクセシビリティサービスによって利用されるネイティブのオブジェクトとプロパティにマッピングされるようになったためです。Materialウィジェットで構築されたほとんどのインターフェースでは、これは自動的に行われるはずです。

このセマンティックデータは、テストやその他の自動化にも利用できます。`testTag`のようなプロパティは、`accessibilityIdentifier`のようなネイティブのアクセシビリティプロパティに正確にマッピングされます。これにより、Compose MultiplatformからのセマンティックデータがアクセシビリティサービスとXCTestフレームワークで利用可能になります。

## ハイコントラストテーマ

Compose Multiplatformは、Material3ライブラリの[`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/)クラスを使用しており、現状ではハイコントラストカラーの標準サポートがありません。iOSでハイコントラストテーマを実装するには、アプリケーションのカラーパレットに追加のカラーセットを追加する必要があります。各カスタムカラーについて、そのハイコントラストバージョンを手動で指定する必要があります。

iOSには**コントラストを上げる**アクセシビリティ設定があり、これは`UIAccessibilityDarkerSystemColorsEnabled`の値をチェックすることで検出できます。`UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`を監視することもできます。これらのAPIを使用すると、システムアクセシビリティ設定が有効になっているときにハイコントラストのカラーパレットに切り替えることができます。

カラーパレットを定義する際には、WCAG準拠のコントラストチェッカーツールを使用して、選択した`onPrimary`カラーが`primary`カラーに対して、`onSurface`が`surface`カラーに対して、その他も同様に十分なコントラストを持っていることを確認してください。カラー間のコントラスト比が少なくとも4.5:1であることを確認してください。カスタムの前景色と背景色の場合、特に小さいテキストでは、コントラスト比は7:1にする必要があります。これは、`lightColorScheme`と`darkColorScheme`の両方に適用されます。

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

## トラックパッドとキーボードによる操作

iOS用Compose Multiplatformは、デバイスを操作するための追加の入力方法をサポートしています。タッチスクリーンに頼る代わりに、AssistiveTouchを有効にしてマウスまたはトラックパッドを使用するか、またはフルキーボードアクセスを有効にしてキーボードを使用することができます。

* AssistiveTouch（**設定** | **アクセシビリティ** | **タッチ** | **AssistiveTouch**）を使用すると、接続されたマウスまたはトラックパッドのポインターでiPhoneを操作できます。ポインターを使用して、画面上のアイコンをクリックしたり、AssistiveTouchメニューをナビゲートしたり、オンスクリーンキーボードを使用して入力したりできます。

  iPadでは、マウスまたはトラックパッドの接続は基本的な使用には標準で利用できます。ただし、ポインターのサイズを調整したり、トラッキング速度を変更したり、特定の操作をボタンに割り当てたりしたい場合は、それでもAssistiveTouchを有効にする必要があります。
* フルキーボードアクセス（**設定** | **アクセシビリティ** | **キーボード** | **フルキーボードアクセス**）は、接続されたキーボードでのデバイス操作を可能にします。**Tab**キーなどを使ってナビゲートし、**Space**キーを使ってアイテムをアクティブにできます。

## XCTestフレームワークでアクセシビリティをテストする

セマンティックアクセシビリティデータは、テストやその他の自動化に利用できます。`testTag`のようなプロパティは、`accessibilityIdentifier`のようなネイティブのアクセシビリティプロパティに正確にマッピングされます。これにより、Compose MultiplatformからのセマンティックデータがアクセシビリティサービスとXCTestフレームワークで利用可能になります。

UIテストで自動アクセシビリティ監査を利用できます。`XCUIApplication`に対して`performAccessibilityAudit()`を呼び出すと、アクセシビリティインスペクターが行うのと同様に、現在のビューのアクセシビリティ問題を監査します。

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
* iOSアクセシビリティツリーは、アクセシビリティサービスが実行されている場合にのみUIと同期されます。
* 同期イベントはログに記録されません。

これらの設定は、新しいCompose Multiplatform APIでカスタマイズできます。

### ツリー同期オプションを選択する

> [!TIP]
> Compose Multiplatform 1.8.0では、アクセシビリティツリーは遅延同期されるため追加の設定が不要になったため、[このオプションは削除されました](whats-new-compose-180.md#loading-accessibility-tree-on-demand)。
>

イベントとインタラクションをデバッグおよびテストするために、同期モードを次のように変更できます。
* ツリーをUIと同期しない（例えば、アクセシビリティマッピングを一時的に無効にするため）。
* 常にツリーを同期する（UIが更新されるたびにツリーが書き換えられるようにし、アクセシビリティの統合を徹底的にテストするため）。

> [!NOTE]
> 各UIイベント後にツリーを同期することは、デバッグやテストには非常に役立ちますが、アプリのパフォーマンスを低下させる可能性があることに注意してください。
>

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

`AccessibilityDebugLogger`インターフェースを実装することで、任意の出力にカスタムメッセージを書き込むことができます。

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

* [Appleアクセシビリティ](https://developer.apple.com/accessibility/)ガイドで詳細を確認してください。
* 通常のiOSアクセシビリティワークフローで、[Kotlin Multiplatformウィザード](https://kmp.jetbrains.com/)によって生成されたプロジェクトを試してみてください。