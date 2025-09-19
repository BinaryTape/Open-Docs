[//]: # (title: Swingとの相互運用性)

ここでは、Compose MultiplatformアプリケーションでSwingコンポーネントを使用する方法、およびその逆のパターン、この相互運用の制限と利点、そしてこのアプローチを使用すべきか否かについて学びます。

Compose MultiplatformとSwing間の相互運用性は、以下を目的としています。
* SwingアプリケーションからCompose Multiplatformへの移行プロセスを簡素化し、スムーズにする。
* Composeの同等なコンポーネントが利用できない場合に、Swingコンポーネントを使用してCompose Multiplatformアプリケーションを強化する。

多くの場合、Compose Multiplatformアプリケーション内でSwingコンポーネントを使用するよりも、不足しているコンポーネントをCompose Multiplatformで直接実装し（そしてコミュニティに貢献する）、その方がより効果的です。

## Swing相互運用のユースケースと制限

### Swingアプリケーション内のCompose Multiplatformコンポーネント

最初のユースケースは、Compose MultiplatformコンポーネントをSwingアプリケーションに追加することです。これは、`ComposePanel` Swingコンポーネントを使用してアプリケーションのCompose Multiplatform部分をレンダリングすることで実現できます。Swingの観点から見ると、`ComposePanel`は別のSwingコンポーネントであり、それに応じて処理されます。

ポップアップ、ツールチップ、コンテキストメニューを含むすべてのCompose Multiplatformコンポーネントは、Swingの`ComposePanel`内でレンダリングされ、その内部で配置およびサイズ変更されることに注意してください。したがって、これらのコンポーネントをSwingベースの実装に置き換えることを検討するか、2つの新しい実験的な機能を試してみてください。

[オフスクリーンレンダリング](#experimental-off-screen-rendering)
: ComposeパネルをSwingコンポーネント上に直接レンダリングすることを可能にします。

[ポップアップ、ダイアログ、ドロップダウンの個別のプラットフォームビュー](#experimental-separate-views-for-popups)
: ポップアップは、初期のコンポーザブルキャンバスやアプリウィンドウに制限されなくなります。

以下に、`ComposePanel`を使用するいくつかのシナリオを示します。
* アニメーションオブジェクトまたはアニメーションオブジェクトのパネル全体をアプリケーションに埋め込む（たとえば、絵文字の選択、またはイベントに対するアニメーション反応を伴うツールバーなど）。
* グラフィックスやインフォグラフィックスなどのインタラクティブなレンダリング領域をアプリケーションに実装する。これはCompose Multiplatformを使用するとより簡単かつ便利に実現できます。
* 複雑なレンダリング領域（場合によってはアニメーションを含む）をアプリケーションに統合する。これはCompose Multiplatformを使用するとよりシンプルです。
* Compose Multiplatformは便利なコンポーネントレイアウトシステムと、カスタムコンポーネントを迅速に作成するための幅広い組み込みコンポーネントとオプションを提供するため、Swingベースのアプリケーションのユーザーインターフェースの複雑な部分を置き換える。

### Compose Multiplatformアプリケーション内のSwingコンポーネント

もう一つのユースケースは、Swingには存在するがCompose Multiplatformには同等のものがないコンポーネントを使用する必要がある場合です。ゼロから新しい実装を作成するのが時間のかかる場合は、`SwingPanel`を試してみてください。`SwingPanel`関数は、Compose Multiplatformコンポーネントの上に配置されたSwingコンポーネントのサイズ、位置、およびレンダリングを管理するラッパーとして機能します。

`SwingPanel`内のSwingコンポーネントは常にCompose Multiplatformコンポーネントの上にレイヤーされるため、`SwingPanel`の下に配置されたものはすべてSwingコンポーネントによってクリップされることに注意してください。クリッピングやオーバーラップの問題を回避するには、[実験的な相互運用ブレンディング](#experimental-interop-blending)を試してください。それでも不正確なレンダリングのリスクがある場合は、それに応じてUIを再設計するか、`SwingPanel`の使用を避け、不足しているコンポーネントを実装して技術開発に貢献することを試みることができます。

以下に、`SwingPanel`を使用するシナリオを示します。
* アプリケーションがポップアップ、ツールチップ、またはコンテキストメニューを必要としないか、少なくともそれらが`SwingPanel`内にない場合。
* `SwingPanel`が固定位置に留まる場合。この場合、Swingコンポーネントの位置が変化する際に、グリッチやアーティファクトのリスクを減らすことができます。ただし、この条件は必須ではなく、個々のケースごとにテストする必要があります。

Compose MultiplatformとSwingは両方の方法で組み合わせることができ、柔軟なUI設計を可能にします。`ComposePanel`内に`SwingPanel`を配置することができ、さらにその`ComposePanel`も別の`SwingPanel`内に配置することができます。ただし、このようなネストされた組み合わせを使用する前に、潜在的なレンダリングのグリッチを考慮してください。コードサンプルについては、[ネストされた`SwingPanel`と`ComposePanel`によるレイアウト](#layout-with-nested-swing-and-compose-multiplatform-components)を参照してください。

## SwingアプリケーションでCompose Multiplatformを使用する

`ComposePanel`を使用すると、Swingベースのアプリケーション内でCompose MultiplatformでUIを作成できます。`ComposePanel`のインスタンスをSwingレイアウトに追加し、`setContent`内でコンポジションを定義します。

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.ComposePanel
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.JButton
import javax.swing.JFrame
import javax.swing.SwingUtilities
import javax.swing.WindowConstants

val northClicks = mutableStateOf(0)
val westClicks = mutableStateOf(0)
val eastClicks = mutableStateOf(0)

fun main() = SwingUtilities.invokeLater {
    val window = JFrame()

    // Creates ComposePanel
    val composePanel = ComposePanel()
    window.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE
    window.title = "SwingComposeWindow"

    window.contentPane.add(actionButton("NORTH", action = { northClicks.value++ }), BorderLayout.NORTH)
    window.contentPane.add(actionButton("WEST", action = { westClicks.value++ }), BorderLayout.WEST)
    window.contentPane.add(actionButton("EAST", action = { eastClicks.value++ }), BorderLayout.EAST)
    window.contentPane.add(
        actionButton(
            text = "SOUTH/REMOVE COMPOSE",
            action = {
                window.contentPane.remove(composePanel)
            }
        ),
        BorderLayout.SOUTH
    )

    // Adds ComposePanel to JFrame
    window.contentPane.add(composePanel, BorderLayout.CENTER)

    // Sets the content
    composePanel.setContent {
        ComposeContent()
    }

    window.setSize(800, 600)
    window.isVisible = true
}

fun actionButton(text: String, action: () -> Unit): JButton {
    val button = JButton(text)
    button.toolTipText = "Tooltip for $text button."
    button.preferredSize = Dimension(100, 100)
    button.addActionListener { action() }
    return button
}

@Composable
fun ComposeContent() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Row {
            Counter("West", westClicks)
            Spacer(modifier = Modifier.width(25.dp))
            Counter("North", northClicks)
            Spacer(modifier = Modifier.width(25.dp))
            Counter("East", eastClicks)
        }
    }
}

@Composable
fun Counter(text: String, counter: MutableState<Int>) {
    Surface(
        modifier = Modifier.size(130.dp, 130.dp),
        color = Color(180, 180, 180),
        shape = RoundedCornerShape(4.dp)
    ) {
        Column {
            Box(
                modifier = Modifier.height(30.dp).fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "${text}Clicks: ${counter.value}")
            }
            Spacer(modifier = Modifier.height(25.dp))
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Button(onClick = { counter.value++ }) {
                    Text(text = text, color = Color.White)
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="composePanel.setContent { ComposeContent() }"}

<img src="compose-desktop-swing-composepanel.animated.gif" alt="IntegrationWithSwing" preview-src="compose-desktop-swing-composepanel.png" width="799"/>

### 実験的なオフスクリーンレンダリング

実験的なモードでは、`ComposePanel`をSwingコンポーネント上に直接レンダリングできます。これにより、`ComposePanel`が表示、非表示、またはサイズ変更されたときに発生する過渡的なレンダリングの問題が防止されます。また、SwingコンポーネントとComposeパネルを組み合わせる際に適切なレイヤー化を可能にします。Swingコンポーネントを`ComposePanel`の上または下に表示することができます。ただし、デフォルトのSkiaレンダリングと比較して、パネルサイズが増加するにつれてパフォーマンスのペナルティが発生する可能性があります。

このモードは`ComposePanel`コンポーネントのみに影響します。
現時点では、`ComposeWindow`や`ComposeDialog`に対応する設定はありません。

> オフスクリーンレンダリングは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)であり、評価目的でのみ使用してください。
>
{style="warning"}

特定の`ComposePanel`に対してオフスクリーンレンダリングを有効にするには、作成時に`RenderSettings.SwingGraphics`値を渡します。

```kotlin
val composePanel = ComposePanel(renderSettings = RenderSettings.SwingGraphics)
```

プロジェクト内のすべての`ComposePanel`でオフスクリーンレンダリングをデフォルトで有効にするには、`compose.swing.render.on.graphics`機能フラグを使用します。

* 起動時にコマンドラインJVM引数としてフラグを指定します。

    ```shell
    -Dcompose.swing.render.on.graphics=true
    ```
* または、エントリポイントで`System.setProperty()`関数への引数としてフラグを渡します。

    ```kotlin
    fun main() {
        System.setProperty("compose.swing.render.on.graphics", "true")
        ...
    }
    ```

### ポップアップ用の実験的な個別のビュー

ツールチップやドロップダウンメニューなどのポップアップ要素が、初期のコンポーザブルキャンバスやアプリウィンドウに制限されないことが重要になる場合があります。たとえば、コンポーザブルビューが全画面を占有していないが、アラートダイアログを生成する必要がある場合などです。

> ポップアップ用の個別のビューまたはウィンドウの作成は[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)です。オプトインが必要です（詳細は下記参照）が、評価目的でのみ使用してください。
>
{style="warning"}

デスクトップ上でポップアップ用の個別のビューまたはウィンドウを作成するには、`compose.layers.type`システムプロパティを設定します。サポートされている値は次のとおりです。
* `WINDOW`は、`Popup`および`Dialog`コンポーネントを個別の装飾なしウィンドウとして作成します。
* `COMPONENT`は、`Popup`または`Dialog`を同じウィンドウ内の個別のSwingコンポーネントとして作成します。この設定にはオフスクリーンレンダリングの有効化が必要であり（[実験的なオフスクリーンレンダリング](#experimental-off-screen-rendering)セクションを参照）、オフスクリーンレンダリングは`ComposePanel`コンポーネントでのみ機能し、フルウィンドウアプリケーションでは機能しないことに注意してください。

ポップアップとダイアログは、自身の境界外（たとえば、最上位コンテナの影など）に何も描画できないことに注意してください。

以下に、`COMPONENT`プロパティを使用するコードの例を以下に示します。

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.ComposePanel
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import javax.swing.JFrame
import javax.swing.JLayeredPane
import javax.swing.SwingUtilities
import javax.swing.WindowConstants

@OptIn(ExperimentalComposeUiApi::class)
fun main() = SwingUtilities.invokeLater {
    System.setProperty("compose.swing.render.on.graphics", "true")
    System.setProperty("compose.layers.type", "COMPONENT")

    val window = JFrame()
    window.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE

    val contentPane = JLayeredPane()
    contentPane.layout = null

    val composePanel = ComposePanel()
    composePanel.setBounds(200, 200, 200, 200)
    composePanel.setContent {
        ComposeContent()
    }
    
    // Uses the full window for dialogs
    composePanel.windowContainer = contentPane
    contentPane.add(composePanel)

    window.contentPane.add(contentPane)
    window.setSize(800, 600)
    window.isVisible = true
}

@Composable
fun ComposeContent() {
    Box(Modifier.fillMaxSize().background(Color.Green)) {
        Dialog(onDismissRequest = {}) {
            Box(Modifier.size(100.dp).background(Color.Yellow))
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="@OptIn(ExperimentalComposeUiApi::class) fun main()"}

## Compose MultiplatformアプリケーションでSwingを使用する

`SwingPanel`を使用すると、Compose Multiplatformアプリケーション内でSwingでUIを作成できます。`SwingPanel`の`factory`パラメータを使用してSwingの`JPanel`を作成します。

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.SwingPanel
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.singleWindowApplication
import java.awt.Component
import javax.swing.BoxLayout
import javax.swing.JButton
import javax.swing.JPanel

fun main() = singleWindowApplication(title = "SwingPanel") {
    val counter = remember { mutableStateOf(0) }

    val inc: () -> Unit = { counter.value++ }
    val dec: () -> Unit = { counter.value-- }

    Box(
        modifier = Modifier.fillMaxWidth().height(60.dp).padding(top = 20.dp),
        contentAlignment = Alignment.Center
    ) {
        Text("Counter: ${counter.value}")
    }

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.padding(top = 80.dp, bottom = 20.dp)
        ) {
            Button("1. Compose Button: increment", inc)
            Spacer(modifier = Modifier.height(20.dp))

            SwingPanel(
                background = Color.LightGray,
                modifier = Modifier.size(270.dp, 90.dp),
                factory = {
                    JPanel().apply {
                        layout = BoxLayout(this, BoxLayout.Y_AXIS)
                        add(actionButton("1. Swing Button: decrement", dec))
                        add(actionButton("2. Swing Button: decrement", dec))
                        add(actionButton("3. Swing Button: decrement", dec))
                    }
                }
            )

            Spacer(modifier = Modifier.height(20.dp))
            Button("2. Compose Button: increment", inc)
        }
    }
}

@Composable
fun Button(text: String = "", action: (() -> Unit)? = null) {
    Button(
        modifier = Modifier.size(270.dp, 30.dp),
        onClick = { action?.invoke() }
    ) {
        Text(text)
    }
}

fun actionButton(
    text: String,
    action: () -> Unit
): JButton {
    val button = JButton(text)
    button.alignmentX = Component.CENTER_ALIGNMENT
    button.addActionListener { action() }

    return button
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="factory = { JPanel().apply { layout = BoxLayout(this, BoxLayout.Y_AXIS)"}

<img src="compose-desktop-swingpanel.animated.gif" alt="SwingPanel" preview-src="compose-desktop-swingpanel.png" width="600"/>

### Composeの状態変化時にSwingコンポーネントを更新する

Swingコンポーネントを最新の状態に保つには、コンポーザブルの状態が変化したり、レイアウトがインフレートされたりするたびに呼び出される`update: (T) -> Unit`コールバックを提供します。以下のコードサンプルは、コンポーザブルの状態が変化するたびに`SwingPanel`内のSwingコンポーネントを更新する方法を示しています。

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.width
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.awt.SwingPanel
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.application
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.rememberWindowState
import java.awt.BorderLayout
import javax.swing.JPanel
import javax.swing.JLabel

val swingLabel = JLabel()

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = rememberWindowState(width = 400.dp, height = 200.dp),
        title = "SwingLabel"
    ) {
        val clicks = remember { mutableStateOf(0) }
        Column(
            modifier = Modifier.fillMaxSize().padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            SwingPanel(
                modifier = Modifier.fillMaxWidth().height(40.dp),
                factory = {
                    JPanel().apply {
                        add(swingLabel, BorderLayout.CENTER)
                    }
                },
                update = {
                    swingLabel.text = "SwingLabel clicks: ${clicks.value}"
                }
            )
            Spacer(modifier = Modifier.height(40.dp))
            Row (
                modifier = Modifier.height(40.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(onClick = { clicks.value++ }) {
                    Text(text = "Increment")
                }
                Spacer(modifier = Modifier.width(20.dp))
                Button(onClick = { clicks.value-- }) {
                    Text(text = "Decrement")
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="factory = { JPanel().apply { add(swingLabel, BorderLayout.CENTER)} }, update = {"}

<img src="compose-desktop-swinglabel.animated.gif" alt="SwingLabel" preview-src="compose-desktop-swinglabel.png" width="600"/>

### 実験的な相互運用ブレンディング

デフォルトでは、`SwingPanel`ラッパーを使用して実装された相互運用ビューは長方形でフォアグラウンドにあり、すべてのCompose Multiplatformコンポーネントの上に表示されます。ポップアップ要素をより使いやすくするために、相互運用ブレンディングの実験的サポートを導入しました。

> 相互運用ブレンディングは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)であり、評価目的でのみ使用してください。
>
{style="warning"}

この実験的な機能を有効にするには、`compose.interop.blending`システムプロパティを`true`に設定します。このプロパティは、アプリケーションでComposeコードを実行する前に有効にする必要があるため、`-Dcompose.interop.blending=true`コマンドラインJVM引数で設定するか、エントリポイントで`System.setProperty()`を使用してください。

```kotlin
fun main() {
    System.setProperty("compose.interop.blending", "true")
    ...
}
```

相互運用ブレンディングを有効にすると、以下のユースケースでSwingに依存できます。

*   **クリッピング**。四角形に制限されなくなります。`clip`および`shadow`モディファイアが`SwingPanel`で正しく機能します。
*   **オーバーラップ**。`SwingPanel`の上に任意のCompose Multiplatformコンテンツを描画し、通常どおり操作することが可能です。

詳細と既知の制限については、[GitHubの記述](https://github.com/JetBrains/compose-multiplatform-core/pull/915)を参照してください。

## ネストされたSwingとCompose Multiplatformコンポーネントによるレイアウト

相互運用性により、SwingとCompose Multiplatformを両方の方法で組み合わせることができます。つまり、SwingコンポーネントをCompose Multiplatformアプリケーションに追加したり、Compose MultiplatformコンポーネントをSwingアプリケーションに追加したりできます。複数のコンポーネントをネストし、アプローチを自由に組み合わせたい場合も、このシナリオはサポートされています。

以下のコードサンプルは、`SwingPanel`を`ComposePanel`に追加する方法を示しています。この`ComposePanel`はすでに別の`SwingPanel`の中にあり、Swing-Compose Multiplatform-Swing構造を作成します。

```kotlin
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.*
import androidx.compose.ui.awt.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.window.*
import androidx.compose.ui.unit.*
import java.awt.BorderLayout
import java.awt.Dimension
import java.awt.Insets
import javax.swing.*
import javax.swing.border.EmptyBorder

val Gray = java.awt.Color(64, 64, 64)
val DarkGray = java.awt.Color(32, 32, 32)
val LightGray = java.awt.Color(210, 210, 210)

data class Item(
    val text: String,
    val icon: ImageVector,
    val color: Color,
    val state: MutableState<Boolean> = mutableStateOf(false)
)
val panelItemsList = listOf(
    Item(text = "Person", icon = Icons.Filled.Person, color = Color(10, 232, 162)),
    Item(text = "Favorite", icon = Icons.Filled.Favorite, color = Color(150, 232, 150)),
    Item(text = "Search", icon = Icons.Filled.Search, color = Color(232, 10, 162)),
    Item(text = "Settings", icon = Icons.Filled.Settings, color = Color(232, 162, 10)),
    Item(text = "Close", icon = Icons.Filled.Close, color = Color(232, 100, 100))
)
val itemSize = 50.dp

fun java.awt.Color.toCompose(): Color {
    return Color(red, green, blue)
}

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = rememberWindowState(width = 500.dp, height = 500.dp),
        title = "Layout"
    ) {
        Column(
            modifier = Modifier.fillMaxSize().background(color = Gray.toCompose()).padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = "Compose Area", color = LightGray.toCompose())
            Spacer(modifier = Modifier.height(40.dp))
            SwingPanel(
                background = DarkGray.toCompose(),
                modifier = Modifier.fillMaxSize(),
                factory = {
                    ComposePanel().apply {
                        setContent {
                            Box {
                                SwingPanel(
                                    modifier = Modifier.fillMaxSize(),
                                    factory = { SwingComponent() }
                                )
                                Box (
                                    modifier = Modifier.align(Alignment.TopStart)
                                        .padding(start = 20.dp, top = 80.dp)
                                        .background(color = DarkGray.toCompose())
                                ) {
                                    SwingPanel(
                                        modifier = Modifier.size(itemSize * panelItemsList.size, itemSize),
                                        factory = {
                                            ComposePanel().apply {
                                                setContent {
                                                    ComposeOverlay()
                                                }
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            )
        }
    }
}

fun SwingComponent() : JPanel {
    return JPanel().apply {
        background = DarkGray
        border = EmptyBorder(20, 20, 20, 20)
        layout = BorderLayout()
        add(
            JLabel("TextArea Swing Component").apply {
                foreground = LightGray
                verticalAlignment = SwingConstants.NORTH
                horizontalAlignment = SwingConstants.CENTER
                preferredSize = Dimension(40, 160)
            },
            BorderLayout.NORTH
        )
        add(
            JTextArea().apply {
                background = LightGray
                lineWrap = true
                wrapStyleWord = true
                margin = Insets(10, 10, 10, 10)
                text = "The five boxing wizards jump quickly. " +
                "Crazy Fredrick bought many very exquisite opal jewels. " +
                "Pack my box with five dozen liquor jugs.
" +
                "Cozy sphinx waves quart jug of bad milk. " +
                "The jay, pig, fox, zebra and my wolves quack!"
            },
            BorderLayout.CENTER
        )
    }
}

@Composable
fun ComposeOverlay() {
    Box(
        modifier = Modifier.fillMaxSize().
            background(color = DarkGray.toCompose()),
        contentAlignment = Alignment.Center
    ) {
        Row(
            modifier = Modifier.background(
                shape = RoundedCornerShape(4.dp),
                color = Color.DarkGray.copy(alpha = 0.5f)
            )
        ) {
            for (item in panelItemsList) {
                SelectableItem(
                    text = item.text,
                    icon = item.icon,
                    color = item.color,
                    selected = item.state
                )
            }
        }
    }
}

@Composable
fun SelectableItem(
    text: String,
    icon: ImageVector,
    color: Color,
    selected: MutableState<Boolean>
) {
    Box(
        modifier = Modifier.size(itemSize)
            .clickable { selected.value = !selected.value },
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.alpha(if (selected.value) 1.0f else 0.5f),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(modifier = Modifier.size(32.dp), imageVector = icon, contentDescription = null, tint = color)
            Text(text = text, color = Color.White, fontSize = 10.sp)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fun SwingComponent() : JPanel { return JPanel().apply {"}

<img src="compose-desktop-swing-layout.animated.gif" alt="Swing layout" preview-src="compose-desktop-swing-layout.png" width="600"/>

## 次のステップ

[その他のデスクトップ固有のコンポーネント](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)に関するチュートリアルをご覧ください。