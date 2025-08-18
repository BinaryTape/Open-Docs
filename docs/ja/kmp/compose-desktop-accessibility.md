[//]: # (title: デスクトップアクセシビリティ機能のサポート)

Compose Multiplatformは[Jetpack Compose](https://developer.android.com/jetpack/compose)を基盤として構築されており、ほとんどのアクセシビリティ機能を全てのプラットフォームにわたる共通コードで利用可能にします。デスクトップにおけるアクセシビリティサポートの現在の状況は以下の通りです。

| プラットフォーム | アクセシビリティのステータス |
|----------|----------------------------------|
| macOS    | 完全にサポート                  |
| Windows  | Java Access Bridgeを介してサポート |
| Linux    | サポートされていません            | 

## Windowsでのアクセシビリティの有効化

Windows上のアクセシビリティはJava Access Bridgeを介して提供されますが、これはデフォルトで無効になっています。
Windowsでアクセシビリティ機能を開発するには、以下のコマンドでJava Access Bridgeを有効にします。

```Console
%\JAVA_HOME%\bin\jabswitch.exe /enable
```

[//]: # (TODO: CMP-373が修正されたらこの回避策を削除する)

アクセシビリティ機能を含むネイティブ配布を作成するには、`modules` DSLメソッドを使用して`jdk.accessibility`モジュールを追加します。

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("jdk.accessibility")
        }
    }
}
```

## 例: セマンティックルールを持つカスタムボタン

カスタムボタンを持つシンプルなアプリを作成し、スクリーンリーダーツール用の説明テキストを指定してみましょう。
スクリーンリーダーが有効になっていると、ボタンの説明から「Click to increment value」というテキストが聞こえます。

```kotlin
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.*
import androidx.compose.ui.window.*

fun main() = singleWindowApplication(
    title = "Custom Button", state = WindowState(size = DpSize(300.dp, 200.dp))
) {
    var count by remember { mutableStateOf(0) }

    Box(modifier = Modifier.padding(50.dp)) {
        Box(modifier = Modifier
            .background(Color.LightGray)
            .fillMaxSize()
            .clickable { count += 1 }
            // Uses text from the content  
            .semantics(mergeDescendants = true) {
                // Assigns the type of UI element
                role = Role.Button
                // Adds some help text to button
                contentDescription = "Click to increment value"
            }
        ) {
            val text = when (count) {
                0 -> "Click Me!"
                1 -> "Clicked"
                else -> "Clicked $count times"
            }
            Text(text, modifier = Modifier.align(Alignment.Center), fontSize = 24.sp)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title=".clickable { count += 1 } .semantics(mergeDescendants = true)"}

macOS上でアプリケーション内の要素のアクセシビリティ情報をテストするには、[Accessibility Inspector](https://developer.apple.com/documentation/accessibility/accessibility-inspector)を使用できます
（**Xcode** | **開発者ツールを開く** | **アクセシビリティインスペクタ**）。

<img src="compose-desktop-accessibility-macos.png" alt="macOS上のアクセシビリティインスペクター" width="700"/>

Windowsでは、[JAWS](https://www.freedomscientific.com/Products/Blindness/JAWS)の**スピーチ履歴の表示**機能、または[NVDA](https://www.nvaccess.org/)の**スピーチビューアー**を使用できます。

<img src="compose-desktop-accessibility.png" alt="Windows上のアクセシビリティ" width="600"/>

その他の例については、[Jetpack Composeにおけるアクセシビリティ](https://developer.android.com/develop/ui/compose/accessibility)ガイドを参照してください。

## 次は何ですか？

[その他のデスクトップコンポーネント](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)に関するチュートリアルを探索してください。