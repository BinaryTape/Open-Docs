[//]: # (title: デスクトップのアクセシビリティ機能のサポート)

Compose Multiplatformは[Jetpack Compose](https://developer.android.com/jackpack/compose)をベースに構築されており、ほとんどのアクセシビリティ機能をすべてのプラットフォームの共通コードで利用できるようになっています。デスクトップにおけるアクセシビリティサポートの現在の状況は以下の通りです。

| プラットフォーム | アクセシビリティのステータス             |
|----------|----------------------------------|
| MacOS    | 完全対応                  |
| Windows  | Java Access Bridge経由で対応 |
| Linux    | 未対応                    | 

## Windowsでのアクセシビリティの有効化

Windows上のアクセシビリティはJava Access Bridgeを介して提供されますが、これはデフォルトで無効になっています。
Windowsでアクセシビリティ機能を開発するには、次のコマンドを使用してJava Access Bridgeを有効にします。

```Console
%\JAVA_HOME%\bin\jabswitch.exe /enable
```

[//]: # (TODO remove this workaround when CMP-373 is fixed)

アクセシビリティ機能を含むネイティブディストリビューションを作成するには、`modules` DSLメソッドを使用して `jdk.accessibility` モジュールを追加します。

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("jdk.accessibility")
        }
    }
}
```

## 例：セマンティックルールを使用したカスタムボタン

カスタムボタンを持つシンプルなアプリを作成し、スクリーンリーダーツール向けの説明テキストを指定してみましょう。
スクリーンリーダーを有効にすると、ボタンの説明から「Click to increment value」というテキストが読み上げられます。

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
            // コンテンツからのテキストを使用
            .semantics(mergeDescendants = true) {
                // UI要素のタイプを割り当てる
                role = Role.Button
                // ボタンにヘルプテキストを追加する
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

macOSでアプリケーション内の要素のアクセシビリティ情報をテストするには、[Accessibility Inspector](https://developer.apple.com/documentation/accessibility/accessibility-inspector)（**Xcode** | **Open Developer Tool** | **Accessibility Inspector**）を使用できます。

<img src="compose-desktop-accessibility-macos.png" alt="Accessibility inspector on mcOS" width="700"/>

Windowsでは、[JAWS](https://www.freedomscientific.com/Products/Blindness/JAWS)の **Show Speech History** 機能、または [NVDA](https://www.nvaccess.org/) の **Speech Viewer** を使用できます。

<img src="compose-desktop-accessibility.png" alt="Accessibility on Windows" width="600"/>

その他の例については、[Accessibility in Jetpack Compose](https://developer.android.com/develop/ui/compose/accessibility) ガイドを参照してください。

## 次のステップ

[その他のデスクトップコンポーネント](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)に関するチュートリアルを確認してください。