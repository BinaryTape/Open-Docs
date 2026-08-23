[//]: # (title: デスクトップ専用 API)

Compose Multiplatform を使用して、macOS、Linux、Windows のデスクトップアプリケーションを作成できます。このページでは、デスクトップ固有のコンポーネントとイベントの概要を簡単に説明します。各セクションには、詳細なチュートリアルへのリンクが含まれています。

## コンポーネント

<!-- * [Images and icons](#images-and-icons) -->
* [ウィンドウとダイアログ](compose-desktop-top-level-windows-management.md)
* [コンテキストメニュー](compose-desktop-context-menus.md)
* [トレイと通知](compose-desktop-tray.md)
* [メニューバー](compose-desktop-menu-bar.md)
* [スクロールバー](compose-desktop-scrollbars.md)
* [ツールチップ](compose-desktop-tooltips.md)

<!-- ### Images and icons

You can use the `Image` composable and the `painterResource()` function to display images stored as resources in your
application:

```kotlin
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication {
    Image(
        painter = painterResource("sample.png"),
        contentDescription = "Sample",
        modifier = Modifier.fillMaxSize()
    )
}
```

`painterResource()` supports rasterized image formats, such as `.png`, `.jpg`, `.bmp`, `.webp`, and the Android XML vector
drawable format. You can also use images stored in the device memory, load images from the network,
or create them in your project using `Canvas()`.

With Compose Multiplatform, you can set the application window icon and the application tray icon as well.

* For more information on working with images using Compose Multiplatform in desktop projects, see
  the [Image and in-app icon manipulations](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Image_And_Icons_Manipulations)
  tutorial.
* For more information on using resources in common code in Compose Multiplatform projects, see [Images and resources](compose-multiplatform-resources.md). -->

## イベント

* [マウスイベント](compose-desktop-mouse-events.md)
* [キーボードイベント](compose-desktop-keyboard.md)
* [タブ移動によるナビゲーション](#tabbing-navigation-between-components)

### コンポーネント間のタブ移動によるナビゲーション

<shortcut>Tab</shortcut> キーボードショートカットで次のコンポーネントへ、<shortcut>⇧ + Tab</shortcut> で前のコンポーネントへと、コンポーネント間のナビゲーションを設定できます。

デフォルトでは、タブ移動によるナビゲーションにより、フォーカス可能なコンポーネント間を出現順に移動できます。フォーカス可能なコンポーネントには、`TextField`、`OutlinedTextField`、`BasicTextField` コンポーザブル、および `Modifier.clickable` を使用する `Button`、`IconButton`、`MenuItem` などのコンポーネントが含まれます。

例えば、以下はユーザーが標準のショートカットを使用して 5 つのテキストフィールド間を移動できるウィンドウです。

```kotlin
import androidx.compose.ui.window.application
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Spacer
import androidx.compose.material.OutlinedTextField
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp

fun main() = application {
    Window(
        state = WindowState(size = DpSize(350.dp, 500.dp)),
        onCloseRequest = ::exitApplication
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier.padding(50.dp)
            ) {
                for (x in 1..5) {
                    val text = remember { mutableStateOf("") }
                    OutlinedTextField(
                        value = text.value,
                        singleLine = true,
                        onValueChange = { text.value = it }
                    )
                    Spacer(modifier = Modifier.height(20.dp))
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Column() { for (x in 1..5) { OutlinedTextField("}

また、フォーカス不可能なコンポーネントをフォーカス可能にしたり、タブ移動の順序をカスタマイズしたり、コンポーネントにフォーカスを当てたりすることもできます。

詳細については、[Tabbing navigation and keyboard focus](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tab_Navigation) チュートリアルを参照してください。

## 次のステップ

* [Compose Multiplatform デスクトッププロジェクトのユニットテストを作成する方法](compose-desktop-ui-testing.md)を学ぶ。
* [デスクトッププラットフォーム向けのネイティブ配布、インストーラー、パッケージを作成する方法](compose-native-distribution.md)を学ぶ。
* [Swing との相互運用性を設定し、Swing アプリケーションを Compose Multiplatform に移行](compose-desktop-swing-interoperability.md)する。
* [さまざまなプラットフォームでのアクセシビリティサポート](compose-desktop-accessibility.md)について学ぶ。