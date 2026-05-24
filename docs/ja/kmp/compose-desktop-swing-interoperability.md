[//]: # (title: Swingとの相互運用性)

ここでは、Compose Multiplatform アプリケーションでの Swing コンポーネントの使用方法、およびその逆（Swing での Compose コンポーネントの使用）について学びます。また、この相互運用性の制限と利点、そしてこのアプローチを採用すべき場合と避けるべき場合についても説明します。

Compose Multiplatform と Swing の相互運用性は、以下の目的を支援するために提供されています。

* Swing アプリケーションから Compose Multiplatform への移行プロセスを簡素化し、スムーズにする。
* Compose に同等のコンポーネントが存在しない場合に、Swing コンポーネントを使用して Compose Multiplatform アプリケーションを強化する。

多くの場合、Compose Multiplatform アプリケーション内で Swing コンポーネントを使用するよりも、不足しているコンポーネントを Compose Multiplatform で直接実装（し、コミュニティに貢献）する方が効果的です。

## Swing 相互運用のユースケースと制限事項

### Swing アプリ内での Compose Multiplatform コンポーネント

最初のユースケースは、Swing アプリケーションに Compose Multiplatform コンポーネントを追加する場合です。これは、アプリケーションの Compose Multiplatform 部分をレンダリングするための Swing コンポーネントである `ComposePanel` を使用して実現できます。Swing の観点からは、`ComposePanel` は単なる一つの Swing コンポーネントとして扱われます。

ポップアップ、ツールチップ、コンテキストメニューを含むすべての Compose Multiplatform コンポーネントは、Swing の `ComposePanel` 内でレンダリングされ、その内部で配置とサイズ変更が行われることに注意してください。そのため、これらのコンポーネントを Swing ベースの実装に置き換えるか、以下の 2 つの新しい実験的な機能を試すことを検討してください。

[オフスクリーンレンダリング](#experimental-off-screen-rendering)
: Compose パネルを Swing コンポーネント上に直接レンダリングできるようにします。

[ポップアップ、ダイアログ、ドロップダウン用の個別のプラットフォームビュー](#experimental-separate-views-for-popups)
: ポップアップが、最初のコンポーザブルキャンバスやアプリウィンドウによって制限されなくなります。

`ComposePanel` を使用するいくつかのシナリオを以下に示します。
* アニメーション化されたオブジェクトや、アニメーションオブジェクトのパネル全体をアプリケーションに埋め込む（例：絵文字の選択や、イベントに対するアニメーション反応を伴うツールバー）。
* グラフィックスやインフォグラフィックスなど、Compose Multiplatform を使用する方が簡単で便利なインタラクティブなレンダリング領域をアプリケーションに実装する。
* 複雑なレンダリング領域（アニメーションを含む可能性がある）をアプリケーションに統合する。これは Compose Multiplatform の方がシンプルです。
* Swing ベースのアプリケーションの複雑な UI 部分を置き換える。Compose Multiplatform は便利なコンポーネントレイアウトシステムと、幅広い組み込みコンポーネント、カスタムコンポーネントを迅速に作成するためのオプションを提供します。

### Compose Multiplatform アプリ内での Swing コンポーネント

もう一つのユースケースは、Swing には存在するが Compose Multiplatform には同等のものがないコンポーネントを使用する必要がある場合です。新しい実装をゼロから作成するのに時間がかかりすぎる場合は、`SwingPanel` を試してください。`SwingPanel` 関数は、Compose Multiplatform コンポーネントの上に配置された Swing コンポーネントのサイズ、位置、レンダリングを管理するラッパーとして機能します。

`SwingPanel` 内の Swing コンポーネントは、常に Compose Multiplatform コンポーネントの上にレイヤー化されるため、`SwingPanel` の下に配置されたものは Swing コンポーネントによってクリップ（切り抜き）されることに注意してください。クリッピングやオーバーラップの問題を回避するには、[実験的なインターオペラビリティ・ブレンディング（interop blending）](#experimental-interop-blending)を試してください。それでも誤ったレンダリングのリスクがある場合は、UI を適宜再設計するか、`SwingPanel` の使用を避けて不足しているコンポーネントを実装し、技術開発に貢献することを検討してください。

`SwingPanel` を使用するシナリオを以下に示します。
* アプリケーションがポップアップ、ツールチップ、コンテキストメニューを必要としないか、少なくともそれらが `SwingPanel` の内部にない場合。
* `SwingPanel` が固定位置に留まる場合。この場合、Swing コンポーネントの位置が変更されたときに発生するグリッチやアーティファクトのリスクを軽減できます。ただし、この条件は必須ではなく、特定のケースごとにテストする必要があります。
  
Compose Multiplatform と Swing は双方向に組み合わせることができ、柔軟な UI 設計が可能です。`ComposePanel` の中に `SwingPanel` を配置し、さらにそれを別の `SwingPanel` の中に配置することもできます。ただし、このようなネストされた組み合わせを使用する前に、潜在的なレンダリングの不具合を考慮してください。コードサンプルについては、[ネストされた `SwingPanel` と `ComposePanel` によるレイアウト](#layout-with-nested-swing-and-compose-multiplatform-components)を参照してください。

## Swing アプリケーションで Compose Multiplatform を使用する

`ComposePanel` を使用すると、Swing ベースのアプリケーション内で Compose Multiplatform を使用した UI を作成できます。
Swing のレイアウトに `ComposePanel` のインスタンスを追加し、`setContent` 内で Composition を定義します。

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

    // ComposePanel を作成
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

    // JFrame に ComposePanel を追加
    window.contentPane.add(composePanel, BorderLayout.CENTER)

    // コンテンツを設定
    composePanel.setContent {
        ComposeContent()
    }

    window.setSize(800, 600)
    window.isVisible = true
}

fun actionButton(text: String, action: () -> Unit): JButton {
    val button = JButton(text)
    button.toolTipText = "$text ボタンのツールチップ"
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

<img src="compose-desktop-swing-composepanel.animated.gif" alt="Swingとの統合" preview-src="compose-desktop-swing-composepanel.png" width="799"/>

### 実験的なオフスクリーンレンダリング

実験的なモードでは、`ComposePanel` を Swing コンポーネント上に直接レンダリングできます。
これにより、`ComposePanel` が表示、非表示、またはサイズ変更されたときの遷移レンダリングの問題が防止されます。
また、Swing コンポーネントと Compose パネルを組み合わせる際に、適切なレイヤー化が可能になります。つまり、Swing コンポーネントを `ComposePanel` の上または下に表示できます。
ただし、デフォルトの Skia レンダリングと比較すると、パネルのサイズに応じてパフォーマンスの低下が生じる可能性があります。

このモードは `ComposePanel` コンポーネントにのみ影響します。
現時点では、`ComposeWindow` や `ComposeDialog` に対応する設定はありません。

> オフスクリーンレンダリングは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)な機能であり、評価目的でのみ使用してください。
>
{style="warning"}

特定の `ComposePanel` に対してオフスクリーンレンダリングを有効にするには、作成時に `RenderSettings.SwingGraphics` 値を渡します。

```kotlin
val composePanel = ComposePanel(renderSettings = RenderSettings.SwingGraphics)
```

プロジェクト内のすべての `ComposePanel` に対してデフォルトでオフスクリーンレンダリングを有効にするには、`compose.swing.render.on.graphics` 機能フラグを使用します。

* 起動時にコマンドライン JVM 引数としてフラグを指定する：

    ```shell
    -Dcompose.swing.render.on.graphics=true
    ```
* または、エントリポイントで `System.setProperty()` 関数に引数としてフラグを渡す：

    ```kotlin
    fun main() {
        System.setProperty("compose.swing.render.on.graphics", "true")
        ...
    }
    ```

### 実験的なポップアップ用の個別ビュー

ツールチップやドロップダウンメニューなどのポップアップ要素が、最初のコンポーザブルキャンバスやアプリウィンドウに制限されないことが重要な場合があります。例えば、コンポーザブルビューが全画面を占有していないが、アラートダイアログを表示する必要がある場合などです。

> ポップアップ用の個別のビューまたはウィンドウの作成は[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)な機能です。オプトインが必要です（詳細は以下を参照）。評価目的でのみ使用してください。
>
{style="warning"}

デスクトップでポップアップ用の個別のビューまたはウィンドウを作成するには、`compose.layers.type` システムプロパティを設定します。サポートされている値は以下の通りです。
* `WINDOW`: `Popup` および `Dialog` コンポーネントを個別の装飾なしウィンドウ（undecorated windows）として作成します。
* `COMPONENT`: `Popup` または `Dialog` を同じウィンドウ内の個別の Swing コンポーネントとして作成します。この設定には、オフスクリーンレンダリングが有効である必要があります（[実験的なオフスクリーンレンダリング](#experimental-off-screen-rendering)セクションを参照）。オフスクリーンレンダリングは `ComposePanel` コンポーネントでのみ機能し、フルウィンドウアプリケーションでは機能しません。

ポップアップやダイアログは、自身の境界の外側（例えば、最上位コンテナの影など）には何も描画できないことに注意してください。

以下は、`COMPONENT` プロパティを使用したコードの例です。

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
    
    // ダイアログにウィンドウ全体を使用
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

## Compose Multiplatform アプリケーションで Swing を使用する

`SwingPanel` を使用すると、Compose Multiplatform アプリケーション内で Swing を使用した UI を作成できます。
`SwingPanel` の `factory` パラメータを使用して、Swing の `JPanel` を作成します。

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

### Compose の状態変化に合わせて Swing コンポーネントを更新する

Swing コンポーネントを最新の状態に保つには、`update: (T) -> Unit` コールバックを提供します。これは、コンポーザブルの状態が変化したり、レイアウトがインフレートされたりするたびに呼び出されます。
次のコードサンプルは、コンポーザブルの状態が変化するたびに `SwingPanel` 内の Swing コンポーネントを更新する方法を示しています。

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

### 実験的なインターオペラビリティ・ブレンディング

デフォルトでは、`SwingPanel` ラッパーを使用して実装された相互運用ビューは矩形であり、常に最前面（Compose Multiplatform コンポーネントの上）に表示されます。ポップアップ要素を使いやすくするために、実験的なインターオペラビリティ・ブレンディング（interop blending）のサポートを導入しました。

> インターオペラビリティ・ブレンディングは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)な機能であり、評価目的でのみ使用してください。
>
{style="warning"}

この実験的機能を有効にするには、システムプロパティ `compose.interop.blending` を `true` に設定します。
このプロパティは、アプリケーションで Compose コードを実行する前に有効にする必要があるため、コマンドライン JVM 引数 `-Dcompose.interop.blending=true` を介して設定するか、エントリポイントで `System.setProperty()` を使用します。

```kotlin
fun main() {
    System.setProperty("compose.interop.blending", "true")
    ...
}
```

インターオペラビリティ・ブレンディングを有効にすると、次のユースケースで Swing を活用できます。

* **クリッピング（Clipping）**: 矩形に制限されなくなります。`clip` や `shadow` モディファイアが `SwingPanel` と正しく連動します。
* **オーバーラップ（Overlapping）**: `SwingPanel` の上に Compose Multiplatform のコンテンツを描画し、通常通りに操作することが可能になります。

詳細および既知の制限事項については、[GitHub の説明](https://github.com/JetBrains/compose-multiplatform-core/pull/915)を参照してください。

## ネストされた Swing と Compose Multiplatform コンポーネントによるレイアウト

相互運用性により、Swing コンポーネントを Compose Multiplatform アプリケーションに追加すること、および Compose Multiplatform コンポーネントを Swing アプリケーションに追加することの両方を組み合わせることができます。複数のコンポーネントをネストし、これらのアプローチを自由に組み合わせたい場合も、このシナリオはサポートされています。

次のコードサンプルは、すでに別の `SwingPanel` の中にある `ComposePanel` に `SwingPanel` を追加し、Swing-Compose Multiplatform-Swing という構造を作成する方法を示しています。

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

<img src="compose-desktop-swing-layout.animated.gif" alt="Swing レイアウト" preview-src="compose-desktop-swing-layout.png" width="600"/>

## 次のステップ

[その他のデスクトップ固有のコンポーネント](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)に関するチュートリアルをご覧ください。