[//]: # (title: コンポーザブルコードの探索)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同様に進めることができます。両方のIDEは同じコア機能とKotlin Multiplatformのサポートを共有しています。</p>
    <br/>
    <p>これは「<strong>共有ロジックとUIを持つCompose Multiplatformアプリを作成する</strong>」チュートリアルの第2部です。続行する前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">Compose Multiplatformアプリを作成する</Links><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>コンポーザブルコードの探索</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/> プロジェクトを変更する<br/>      
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 独自のアプリケーションを作成する<br/>
    </p>
</tldr>

Kotlin Multiplatformウィザードによって作成されたサンプルコンポーザブルを詳しく見てみましょう。まず、共通UIを実装し、すべてのプラットフォームで使用できるコンポーザブルな`App()`関数があります。次に、各プラットフォームでこのUIを起動するプラットフォーム固有のコードがあります。

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
                .background(MaterialTheme.colorScheme.primaryContainer)
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Image(painterResource(Res.drawable.compose_multiplatform), null)
                    Text("Compose: $greeting")
                }
            }
        }
    }
}
```

`App()`関数は、`@Composable`でアノテーションされた通常のKotlin関数です。これらの種類の関数は、_コンポーザブル関数_または単に_コンポーザブル_と呼ばれます。それらはCompose Multiplatformに基づいたUIの構成要素です。

コンポーザブル関数には、次の一般的な構造があります。

*   `MaterialTheme`はアプリケーションの外観を設定します。デフォルト設定はカスタマイズできます。たとえば、色、形状、タイポグラフィを選択できます。
*   `Column`コンポーザブルはアプリケーションのレイアウトを制御します。ここでは、`AnimatedVisibility`コンポーザブルの上に`Button`を表示します。
*   `Button`は`Text`コンポーザブルを含み、いくつかのテキストをレンダリングします。
*   `AnimatedVisibility`はアニメーションを使用して`Image`を表示および非表示にします。
*   `painterResource`はXMLリソースに格納されているベクターアイコンをロードします。

`Column`の`horizontalAlignment`パラメーターは、そのコンテンツを中央に配置します。しかし、これが効果を発揮するには、カラムがそのコンテナの全幅を占める必要があります。これは`modifier`パラメーターを使用して実現されます。

モディファイアはCompose Multiplatformの主要なコンポーネントです。これは、UI内のコンポーザブルの表示や動作を調整するために使用する主要なメカニズムです。モディファイアは`Modifier`型のメソッドを使用して作成されます。これらのメソッドをチェーンすると、各呼び出しは前の呼び出しから返された`Modifier`を変更できるため、順序が重要になります。
詳細については、[JetPack Composeドキュメント](https://developer.android.com/jetpack/compose/modifiers)を参照してください。

### 状態の管理

サンプルコンポーザブルの最後の側面は、状態の管理方法です。`App`コンポーザブルの`showContent`プロパティは、`mutableStateOf()`関数を使用して構築されます。これは、監視可能な状態オブジェクトであることを意味します。

```kotlin
var showContent by remember { mutableStateOf(false) }
```

状態オブジェクトは`remember()`関数への呼び出しでラップされており、これは一度構築され、その後フレームワークによって保持されることを意味します。これを実行することで、値がブール値を含む状態オブジェクトであるプロパティを作成します。フレームワークはこの状態オブジェクトをキャッシュし、コンポーザブルがそれを監視できるようにします。

状態の値が変更されると、それを監視するすべてのコンポーザブルが再呼び出しされます。これにより、それらが生成するウィジェットが再描画されることになります。これは_リコンポジション_と呼ばれます。

アプリケーションでは、状態が変更される唯一の場所はボタンのクリックイベント内です。`onClick`イベントハンドラは`showContent`プロパティの値を反転させます。結果として、親の`AnimatedVisibility`コンポーザブルが`showContent`を監視しているため、画像が`Greeting().greet()`の呼び出しとともに表示または非表示になります。

## 異なるプラットフォームでのUIの起動

`App()`関数の実行はプラットフォームごとに異なります。Androidではアクティビティによって管理され、iOSではビューコントローラによって、デスクトップではウィンドウによって、ウェブではコンテナによって管理されます。それぞれを調べてみましょう。

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

これは`App`コンポーザブルを呼び出す[Androidアクティビティ](https://developer.android.com/guide/components/activities/intro-activities)である`MainActivity`です。

### iOSの場合

iOSの場合、`composeApp/src/iosMain/kotlin`にある`MainViewController.kt`ファイルを開きます。

```kotlin
fun MainViewController() = ComposeUIViewController { App() }
```

これは、Androidのアクティビティと同じ役割を果たす[ビューコントローラ](https://developer.apple.com/documentation/uikit/view_controllers)です。iOSとAndroidの両方のタイプが単に`App`コンポーザブルを呼び出していることに注目してください。

### デスクトップの場合

デスクトップの場合、`composeApp/src/jvmMain/kotlin`にある`main()`関数を見てください。

```kotlin
fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "ComposeDemo") {
        App()
    }
}
```

*   ここで、`application()`関数は新しいデスクトップアプリケーションを起動します。
*   この関数はラムダを受け取り、そこでUIを初期化します。通常、`Window`を作成し、ウィンドウが閉じられたときにプログラムがどのように反応すべきかを指示するプロパティと命令を指定します。このケースでは、アプリケーション全体がシャットダウンします。
*   このウィンドウ内にコンテンツを配置できます。AndroidやiOSと同様に、唯一のコンテンツは`App()`関数です。

現在、`App`関数はパラメーターを宣言していません。大規模なアプリケーションでは、通常、プラットフォーム固有の依存関係にパラメーターを渡します。これらの依存関係は手動で作成することも、依存性注入ライブラリを使用することもできます。

### ウェブの場合

`composeApp/src/webMain/kotlin/main.kt`ファイルで、`main()`関数を見てみましょう。

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport {
        App()
    }
}
```

*   `@OptIn(ExperimentalComposeUiApi::class)`アノテーションは、実験的としてマークされており、将来のリリースで変更される可能性があるAPIを使用していることをコンパイラに伝えます。
*   `ComposeViewport{}`関数は、アプリケーションのCompose環境を設定します。
*   Webアプリは、`ComposeViewport`関数のパラメーターとして指定されたコンテナに挿入されます。
*   `App()`関数は、Jetpack Composeを使用してアプリケーションのUIコンポーネントを構築する役割を担います。

`main.kt`ファイルは、Webターゲット用の共通コードを含む`webMain`ディレクトリにあります。

## 次のステップ

チュートリアルの次のパートでは、プロジェクトに依存関係を追加し、ユーザーインターフェースを変更します。

**[次のパートに進む](compose-multiplatform-modify-project.md)**

## ヘルプ

*   **Kotlin Slack**。招待状を[入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)して、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlinイシュートラッカー**。[新しいイシューを報告](https://youtrack.jetbrains.com/newIssue?project=KT)してください。