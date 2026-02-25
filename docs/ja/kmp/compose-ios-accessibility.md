[//]: # (title: iOSアクセシビリティ機能のサポート)

Compose Multiplatformのアクセシビリティサポートにより、障がいを持つ方が、ネイティブのiOS UIと同じように快適にCompose Multiplatform UIを操作できるようになります。

* スクリーンリーダーやVoiceOverがCompose Multiplatform UIのコンテンツにアクセスできます。
* Compose Multiplatform UIは、ナビゲーションやインタラクションにおいて、ネイティブのiOS UIと同じジェスチャーをサポートしています。

これは、Compose APIによって生成されたセマンティクスデータが、iOSアクセシビリティサービスによって使用されるネイティブのオブジェクトやプロパティにマッピングされるようになったことで実現されました。Materialウィジェットを使用して構築されたほとんどのインターフェースでは、これが自動的に行われます。

また、このセマンティクスデータをテストやその他の自動化で使用することもできます。`testTag`などのプロパティは、`accessibilityIdentifier`などのネイティブアクセシビリティプロパティに正しくマッピングされます。これにより、Compose MultiplatformからのセマンティクスデータがアクセシビリティサービスやXCTestフレームワークで利用可能になります。

## ハイコントラストテーマ

Compose Multiplatformは、Material3ライブラリの[`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/)クラスを使用していますが、現在のところハイコントラストカラーの標準サポート（out-of-the-box）はありません。iOSでハイコントラストテーマを実現するには、アプリケーションのパレットに別途色のセットを追加する必要があります。カスタムカラーごとに、ハイコントラスト版を手動で指定する必要があります。

iOSには**コントラストを上げる**（Increase Contrast）アクセシビリティ設定があり、これは`UIAccessibilityDarkerSystemColorsEnabled`の値をチェックすることで検出できます。また、`UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`を監視することも可能です。これらのAPIを使用することで、システムのアクセシビリティ設定が有効になった際にハイコントラストなカラーパレットに切り替えることができます。

カラーパレットを定義する際は、WCAG準拠のコントラストチェッカーツールを使用して、選択した`onPrimary`が`primary`カラーに対して、`onSurface`がサーフェスカラーに対して十分なコントラストを持っているかなどを確認してください。色のコントラスト比は少なくとも4.5:1以上にしてください。カスタムの前景・背景色、特に小さなテキストの場合は、コントラスト比を7:1にする必要があります。これは`lightColorScheme`と`darkColorScheme`の両方に適用されます。

以下のコードは、テーマパッケージ内でハイコントラストなライトおよびダークカラーパレットを定義する方法を示しています。

```kotlin
import androidx.compose.ui.graphics.Color

// ハイコントラストテーマのカラーパレットを保持するデータクラスを定義
data class HighContrastColors(
    val primary: Color, // メインのインタラクティブ要素、プライマリテキスト、トップアプリバー
    val onPrimary: Color, // 「primary」カラーの上に表示されるコンテンツ
    val secondary: Color, // セカンダリのインタラクティブ要素、フローティングアクションボタン
    val onSecondary: Color, // 「secondary」カラーの上に表示されるコンテンツ
    val tertiary: Color, // オプションの3番目のアクセントカラー
    val onTertiary: Color, // 「tertiary」カラーの上に表示されるコンテンツ
    val background: Color, // 画面のメイン背景
    val onBackground: Color, // 「background」カラーの上に表示されるコンテンツ
    val surface: Color, // カードの背景、シート、メニュー、浮き上がったサーフェス
    val onSurface: Color, // 「surface」カラーの上に表示されるコンテンツ
    val error: Color, // エラー状態とメッセージ
    val onError: Color, // 「error」カラーの上に表示されるコンテンツ
    val success: Color, // 成功状態とメッセージ
    val onSuccess: Color, // 「success」カラーの上に表示されるコンテンツ
    val warning: Color, // 警告状態とメッセージ
    val onWarning: Color, // 「warning」カラーの上に表示されるコンテンツ
    val outline: Color, // ボーダー、区切り線、無効状態
    val scrim: Color // モーダル/シートの背後で背景コンテンツを暗くする色
)

// ニュートラルカラー
val Black = Color(0xFF000000)
val White = Color(0xFFFFFFFF)
val DarkGrey = Color(0xFF1A1A1A)
val MediumGrey = Color(0xFF888888)
val LightGrey = Color(0xFFE5E5E5)

// プライマリアクセントカラー
val RoyalBlue = Color(0xFF0056B3)
val SkyBlue = Color(0xFF007AFF)

// セカンダリおよびターシャリアクセントカラー
val EmeraldGreen = Color(0xFF28A745)
val GoldenYellow = Color(0xFFFFC107)
val DeepPurple = Color(0xFF6F42C1)

// ステータスカラー
val ErrorRed = Color(0xFFD32F2F)
val SuccessGreen = Color(0xFF388E3C)
val WarningOrange = Color(0xFFF57C00)

// ライトハイコントラストパレット：明るい背景に暗いコンテンツ
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

// ダークハイコントラストパレット：暗い背景に明るいコンテンツ
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

iOS版Compose Multiplatformは、デバイスを操作するための追加の入力方法をサポートしています。タッチスクリーンに頼る代わりに、マウスやトラックパッドを使用するためのAssistiveTouch、またはキーボードを使用するための「フルキーボードアクセス」を有効にすることができます。

* AssistiveTouch（**設定** | **アクセシビリティ** | **タッチ** | **AssistiveTouch**）を使用すると、接続したマウスやトラックパッドのポインタでiPhoneを操作できます。ポインタを使用して画面上のアイコンをクリックしたり、AssistiveTouchメニュー内を移動したり、画面上のキーボードを使用して入力したりできます。

  iPadでは、マウスやトラックパッドを接続するだけで基本的な操作が可能です。ただし、ポインタのサイズ調整、軌跡の速さの変更、ボタンへの特定の操作の割り当てなどを行いたい場合は、AssistiveTouchを有効にする必要があります。
* フルキーボードアクセス（**設定** | **アクセシビリティ** | **キーボード** | **フルキーボードアクセス**）を使用すると、接続したキーボードでデバイスを操作できます。**Tab**キーなどで移動し、**スペース**キーで項目をアクティブにすることができます。

## XCTestフレームワークによるアクセシビリティテスト

テストやその他の自動化において、セマンティクスなアクセシビリティデータを使用できます。`testTag`などのプロパティは、`accessibilityIdentifier`などのネイティブアクセシビリティプロパティに正しくマッピングされます。これにより、Compose MultiplatformからのセマンティクスデータがアクセシビリティサービスやXCTestフレームワークで利用可能になります。

UIテストで自動アクセシビリティ監査（audit）を使用できます。`XCUIApplication`に対して`performAccessibilityAudit()`を呼び出すと、アクセシビリティ・インスペクタと同様に、現在のビューのアクセシビリティの問題を監査します。

```swift
func testAccessibilityTabView() throws {
	let app = XCUIApplication()
	app.launch()
	app.tabBars.buttons["MyLabel"].tap()

	try app.performAccessibilityAudit()
}
```

## アクセシビリティツリーの同期のカスタマイズ

デフォルト設定では以下のようになります。
* iOSアクセシビリティツリーは、アクセシビリティサービスが実行されている場合にのみUIと同期されます。
* 同期イベントはログに記録されません。

新しいCompose Multiplatform APIを使用して、これらの設定をカスタマイズできます。

### ツリー同期オプションの選択

> Compose Multiplatform 1.8.0では、アクセシビリティツリーが遅延（lazy）同期されるようになり、追加の設定が不要になったため、[このオプションは削除されました](whats-new-compose-180.md#loading-accessibility-tree-on-demand)。
>
{style="tip"}

イベントやインタラクションをデバッグおよびテストするために、同期モードを以下のように変更できます。
* ツリーをUIと同期しない（例：アクセシビリティマッピングを一時的に無効にする）。
* ツリーを常に同期する（UIが更新されるたびにツリーが再書き込みされるようにし、アクセシビリティの統合を徹底的にテストする）。

> UIイベントごとにツリーを同期することはデバッグやテストには非常に便利ですが、アプリのパフォーマンスを低下させる可能性があることに注意してください。
>
{style="note"}

アクセシビリティツリーを常に同期するオプションを有効にする例：

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.Always(debugLogger = null)
}) {
    // あなたの @Composable コンテンツ
}
```

`AccessibilitySyncOptions`クラスには、利用可能なすべてのオプションが含まれています。

```kotlin
// package androidx.compose.ui.platform

@ExperimentalComposeApi
sealed class AccessibilitySyncOptions {
    
    // アクセシビリティツリーを同期しないオプション
    object Never: AccessibilitySyncOptions

    // アクセシビリティサービスが実行されている場合にのみツリーを同期するオプション
    //
    // インタラクションやツリー同期イベントをログに記録するために AccessibilityDebugLogger を含めることができます
    class WhenRequiredByAccessibilityServices(debugLogger: AccessibilityDebugLogger?)

    // アクセシビリティツリーを常に同期するオプション
    //
    // インタラクションやツリー同期イベントをログに記録するために AccessibilityDebugLogger を含めることができます
    class Always(debugLogger: AccessibilityDebugLogger?)
}
```

### ロギングインターフェースの実装

`AccessibilityDebugLogger`インターフェースを実装して、任意の出力先にカスタムメッセージを書き込むことができます。

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
    // あなたの @Composable コンテンツ
}
```

## 次のステップ

* [Appleアクセシビリティ](https://developer.apple.com/accessibility/)ガイドで詳細を学ぶ。
* [Kotlin Multiplatformウィザード](https://kmp.jetbrains.com/)で生成されたプロジェクトを、普段のiOSアクセシビリティワークフローで試してみる。