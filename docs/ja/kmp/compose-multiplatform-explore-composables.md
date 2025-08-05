[//]: # (title: コンポーザブルコードを探求する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformのサポートは共通しています。</p>
    <br/>
    <p>これは「<strong>共有ロジックとUIを持つCompose Multiplatformアプリを作成する</strong>」チュートリアルの第2部です。先に進む前に、前のステップを完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="compose-multiplatform-create-first-app.md">Compose Multiplatformアプリを作成する</a><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>コンポーザブルコードを探求する</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/> プロジェクトを変更する<br/>      
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 独自のアプリケーションを作成する<br/>
    </p>
</tldr>

Kotlin Multiplatformウィザードによって作成されたサンプルコンポーザブルを詳しく見ていきましょう。まず、共通UIを実装し、すべてのプラットフォームで使用できるコンポーザブルな`App()`関数があります。次に、このUIを各プラットフォームで起動するためのプラットフォーム固有のコードがあります。

## コンポーザブル関数の実装

`composeApp/src/commonMain/kotlin/App.kt`ファイルで、`App()`関数を見てみましょう。

```kotlin
@Composable
@Preview
fun App() {
  MaterialTheme {
    var showContent by remember { mutableStateOf(false) }
    Column(
      modifier = Modifier
        .safeContentPadding()
        .fillMaxSize(),
      horizontalAlignment = Alignment.CenterHorizontally,
    ) {
      Button(onClick = { showContent = !showContent }) {
        Text("Click me!")
      }
      AnimatedVisibility(showContent) {
        val greeting = remember { Greeting().greet() }
        Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
          Image(painterResource(Res.drawable.compose_multiplatform), null)
          Text("Compose: $greeting")
        }
      }
    }
  }
}
```

`App()`関数は、`@Composable`アノテーションが付けられた通常のKotlin関数です。これらの種類の関数は「コンポーザブル関数」または単に「コンポーザブル」と呼ばれます。これらはCompose MultiplatformベースのUIの構成要素です。

コンポーザブル関数は、次の一般的な構造を持っています。

*   `MaterialTheme`はアプリケーションの外観を設定します。デフォルト設定はカスタマイズできます。例えば、色、シェイプ、タイポグラフィを選択できます。
*   `Column`コンポーザブルはアプリケーションのレイアウトを制御します。ここでは、`AnimatedVisibility`コンポーザブルの上に`Button`を表示しています。
*   `Button`は`Text`コンポーザブルを含み、いくつかのテキストを表示します。
*   `AnimatedVisibility`はアニメーションを使って`Image`を表示/非表示にします。
*   `painterResource`はXMLリソースに格納されているベクターアイコンをロードします。

`Column`の`horizontalAlignment`パラメーターはそのコンテンツを中央揃えにします。しかし、これが効果を発揮するには、カラムがそのコンテナの全幅を占める必要があります。これは`modifier`パラメーターを使って実現されます。

修飾子（Modifier）はCompose Multiplatformの主要なコンポーネントです。これは、UI内のコンポーザブルの外観や動作を調整するために使用する主要な仕組みです。修飾子は`Modifier`型のメソッドを使用して作成されます。これらのメソッドを連結すると、各呼び出しは前の呼び出しから返された`Modifier`を変更できるため、順序が重要になります。詳細は[JetPack Composeドキュメント](https://developer.android.com/jetpack/compose/modifiers)を参照してください。

### 状態の管理

サンプルコンポーザブルの最後の側面は、状態の管理方法です。`App`コンポーザブルの`showContent`プロパティは`mutableStateOf()`関数を使用して構築されており、これは監視可能な状態オブジェクトであることを意味します。

```kotlin
var showContent by remember { mutableStateOf(false) }
```

状態オブジェクトは`remember()`関数への呼び出しでラップされており、これは一度構築されるとフレームワークによって保持されることを意味します。これを実行することで、値がブール値を含む状態オブジェクトであるプロパティを作成します。フレームワークはこの状態オブジェクトをキャッシュし、コンポーザブルがそれを監視できるようにします。

状態の値が変更されると、それを監視しているすべてのコンポーザブルが再呼び出しされます。これにより、それらが生成するウィジェットが再描画されます。これは「リコンポジション」と呼ばれます。

あなたのアプリケーションでは、状態が変更される唯一の場所はボタンのクリックイベント内です。`onClick`イベントハンドラーは`showContent`プロパティの値を反転させます。その結果、親の`AnimatedVisibility`コンポーザブルが`showContent`を監視しているため、画像が`Greeting().greet()`の呼び出しとともに表示または非表示になります。

## さまざまなプラットフォームでのUI起動

`App()`関数の実行はプラットフォームごとに異なります。Androidではアクティビティによって、iOSではビューコントローラーによって、デスクトップではウィンドウによって、ウェブではコンテナによって管理されます。それぞれを見ていきましょう。

### Androidの場合

Androidの場合、`composeApp/src/androidMain/kotlin`にある`MainActivity.kt`ファイルを開きます。

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            App()
        }
    }
}
```

これは、`App`コンポーザブルを呼び出す[Androidアクティビティ](https://developer.android.com/guide/components/activities/intro-activities)である`MainActivity`です。

### iOSの場合

iOSの場合、`composeApp/src/iosMain/kotlin`にある`MainViewController.kt`ファイルを開きます。

```kotlin
fun MainViewController() = ComposeUIViewController { App() }
```

これは[ビューコントローラー](https://developer.apple.com/documentation/uikit/view_controllers)であり、Androidのアクティビティと同じ役割を果たします。iOSとAndroidの両方の型が単に`App`コンポーザブルを呼び出していることに注目してください。

### デスクトップの場合

デスクトップの場合、`composeApp/src/desktopMain/kotlin`にある`main()`関数を見てください。

```kotlin
fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "ComposeDemo") {
        App()
    }
}
```

*   ここでは、`application()`関数が新しいデスクトップアプリケーションを起動します。
*   この関数はラムダを取り、そこでUIを初期化します。通常、`Window`を作成し、ウィンドウが閉じられたときにプログラムがどのように反応すべきかを指示するプロパティと命令を指定します。この場合、アプリケーション全体がシャットダウンします。
*   このウィンドウ内にコンテンツを配置できます。AndroidやiOSと同様に、唯一のコンテンツは`App()`関数です。

現在、`App`関数はパラメーターを何も宣言していません。大規模なアプリケーションでは、通常、プラットフォーム固有の依存関係にパラメーターを渡します。これらの依存関係は手動で作成することも、依存性注入ライブラリを使用することもできます。

### ウェブの場合

`composeApp/src/wasmJsMain/kotlin/main.kt`ファイルで、`main()`関数を見てください。

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport(document.body!!) { App() }
}
```

*   `@OptIn(ExperimentalComposeUiApi::class)`アノテーションは、実験的とマークされており、今後のリリースで変更される可能性があるAPIを使用していることをコンパイラに伝えます。
*   `ComposeViewport()`関数は、アプリケーションのCompose環境をセットアップします。
*   ウェブアプリは、`ComposeViewport`関数のパラメーターとして指定されたコンテナに挿入されます。この例では、ドキュメント全体のbodyがコンテナとして機能します。
*   `App()`関数は、Jetpack Composeを使用してアプリケーションのUIコンポーネントを構築する役割を担います。

## 次のステップ

チュートリアルの次のパートでは、プロジェクトに依存関係を追加し、ユーザーインターフェースを変更します。

**[次のパートに進む](compose-multiplatform-modify-project.md)**

## ヘルプ

*   **Kotlin Slack**。招待を受け取り、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。[招待はこちら](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。
*   **Kotlin課題トラッカー**。[新しい問題を報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。