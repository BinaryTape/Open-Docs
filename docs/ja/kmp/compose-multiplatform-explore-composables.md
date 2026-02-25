[//]: # (title: Composableコードの探索)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルでは IntelliJ IDEA を使用しますが、Android Studio でも同様に進めることができます。どちらの IDE も共通のコア機能と Kotlin Multiplatform サポートを共有しています。</p>
    <br/>
    <p>これは、<strong>共有ロジックと UI を備えた Compose Multiplatform アプリの作成</strong>チュートリアルの第 2 部です。次に進む前に、前のステップを完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">Compose Multiplatform アプリの作成</Links><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>Composableコードの探索</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/> プロジェクトの変更<br/>      
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 独自のアプリケーションの作成<br/>
    </p>
</tldr>

Kotlin Multiplatform ウィザードで作成されたサンプルコンポーザブルを詳しく見てみましょう。まず、共通の UI を実装し、すべてのプラットフォームで使用できるコンポーザブル `App()` 関数があります。次に、各プラットフォームでこの UI を起動するプラットフォーム固有のコードがあります。

## Composable 関数の実装

`composeApp/src/commonMain/kotlin/App.kt` ファイルにある `App()` 関数を見てみましょう。

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

`App()` 関数は、`@Composable` アノテーションが付いた通常の Kotlin 関数です。これらの種類の関数は、*composable 関数*（composable functions）または単に *composables* と呼ばれます。これらは Compose Multiplatform に基づく UI の構成要素です。

composable 関数は、次のような一般的な構造を持っています。

* `MaterialTheme` はアプリケーションの外観を設定します。デフォルト設定はカスタマイズ可能です。たとえば、色、形状、タイポグラフィを選択できます。
* `Column` コンポーザブルはアプリケーションのレイアウトを制御します。ここでは、`AnimatedVisibility` コンポーザブルの上に `Button` を表示しています。
* `Button` には、テキストをレンダリングする `Text` コンポーザブルが含まれています。
* `AnimatedVisibility` は、アニメーションを使用して `Image` を表示・非表示にします。
* `painterResource` は、XML リソースに保存されたベクトルアイコンを読み込みます。

`Column` の `horizontalAlignment` パラメータは、そのコンテンツを中央に配置します。しかし、これを有効にするには、カラムがコンテナの全幅を占める必要があります。これは `modifier` パラメータを使用して実現されます。

Modifier（修飾子）は、Compose Multiplatform の主要なコンポーネントです。これは、UI 内のコンポーザブルの外観や動作を調整するために使用する主要なメカニズムです。Modifier は `Modifier` 型のメソッドを使用して作成されます。これらのメソッドをチェーンすると、各呼び出しが前の呼び出しから返された `Modifier` を変更できるため、順序が重要になります。
詳細は [JetPack Compose のドキュメント](https://developer.android.com/jetpack/compose/modifiers) を参照してください。

### 状態の管理

サンプルコンポーザブルの最後の側面は、状態（state）の管理方法です。`App` コンポーザブル内の `showContent` プロパティは `mutableStateOf()` 関数を使用して構築されています。これは、観察（observe）可能な状態オブジェクトであることを意味します。

```kotlin
var showContent by remember { mutableStateOf(false) }
```

状態オブジェクトは `remember()` 関数の呼び出しでラップされています。これは、オブジェクトが一度構築されると、フレームワークによって保持（retain）されることを意味します。これを実行することで、値が Boolean を含む状態オブジェクトであるプロパティを作成します。フレームワークはこの状態オブジェクトをキャッシュし、コンポーザブルがそれを観察できるようにします。

状態の値が変化すると、それを観察しているコンポーザブルが再呼び出しされます。これにより、それらが生成するウィジェットを再描画できます。これは *再構成*（recomposition）と呼ばれます。

このアプリケーションにおいて、状態が変更される唯一の場所はボタンのクリックイベント内です。`onClick` イベントハンドラーが `showContent` プロパティの値を反転させます。その結果、親の `AnimatedVisibility` コンポーザブルが `showContent` を観察しているため、`Greeting().greet()` の呼び出しとともに画像が表示または非表示になります。

## 各プラットフォームでの UI の起動

`App()` 関数の実行はプラットフォームごとに異なります。Android ではアクティビティ、iOS ではビューコントローラー、デスクトップではウィンドウ、Web ではコンテナによって管理されます。それぞれを見ていきましょう。

### Android の場合

Android の場合は、`composeApp/src/androidMain/kotlin` にある `MainActivity.kt` ファイルを開きます。

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

これは `App` コンポーザブルを呼び出す `MainActivity` という [Android アクティビティ](https://developer.android.com/guide/components/activities/intro-activities) です。

### iOS の場合

iOS の場合は、`composeApp/src/iosMain/kotlin` にある `MainViewController.kt` ファイルを開きます。

```kotlin
fun MainViewController() = ComposeUIViewController { App() }
```

これは、Android のアクティビティと同じ役割を果たす [ビューコントローラー](https://developer.apple.com/documentation/uikit/view_controllers) です。iOS と Android の両方の型が、単に `App` コンポーザブルを呼び出していることに注目してください。

### デスクトップの場合

デスクトップの場合は、`composeApp/src/jvmMain/kotlin` にある `main()` 関数を確認します。

```kotlin
fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "ComposeDemo") {
        App()
    }
}
```

* ここでは、`application()` 関数が新しいデスクトップアプリケーションを起動します。
* この関数はラムダを受け取り、そこで UI を初期化します。通常は `Window` を作成し、プロパティや、ウィンドウが閉じられたときにプログラムがどのように反応すべきかを指示する命令を指定します。このケースでは、アプリケーション全体が終了します。
* このウィンドウの中に、コンテンツを配置できます。Android や iOS と同様に、唯一のコンテンツは `App()` 関数です。

現在、`App` 関数はパラメータを宣言していません。より大規模なアプリケーションでは、通常、プラットフォーム固有の依存関係をパラメータとして渡します。これらの依存関係は、手動で作成するか、依存関係注入（DI）ライブラリを使用して作成されます。

### Web の場合

`composeApp/src/webMain/kotlin/main.kt` ファイルにある `main()` 関数を見てみましょう。

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport {
        App()
    }
}
```

* `@OptIn(ExperimentalComposeUiApi::class)` アノテーションは、試験運用版（experimental）としてマークされており、将来のリリースで変更される可能性がある API を使用していることをコンパイラに伝えます。
* `ComposeViewport{}` 関数は、アプリケーションの Compose 環境をセットアップします。
* Web アプリは、`ComposeViewport` 関数のパラメータとして指定されたコンテナに挿入されます。
* `App()` 関数は、Jetpack Compose を使用してアプリケーションの UI コンポーネントを構築する責任があります。

`main.kt` ファイルは、Web ターゲットの共通コードを含む `webMain` ディレクトリに配置されています。

## 次のステップ

チュートリアルの次のパートでは、プロジェクトに依存関係を追加し、ユーザーインターフェースを変更します。

**[次のパートへ進む](compose-multiplatform-modify-project.md)**

## ヘルプを得る

* **Kotlin Slack**: [招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受け取って、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) チャンネルに参加してください。
* **Kotlin イシュートラッカー**: [新しい問題を報告](https://youtrack.jetbrains.com/newIssue?project=KT)してください。