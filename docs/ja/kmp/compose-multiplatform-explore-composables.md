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

`shared/src/commonMain/kotlin/App.kt` ファイルにある `App()` 関数を見てみましょう。

undefined

`App()` 関数は、`@Composable` アノテーションが付いた通常の Kotlin 関数です。
これらの種類の関数は、*コンポーザブル関数*（composable functions）または単に *コンポーザブル*（composables）と呼ばれます。
これらは Jetpack Compose または Compose Multiplatform に基づく UI の構成要素です。

この `App()` 関数はアプリの UI アーキテクチャのベースとして使用され、次のような構造を持っています。

* `MaterialTheme()` はアプリケーションの外観を設定します。デフォルト設定はカスタマイズ可能です。たとえば、色、形状、タイポグラフィを選択できます。
* `Column()` コンポーザブルはアプリケーションのレイアウトを制御します。ここでは、`AnimatedVisibility()` コンポーザブルの上に `Button` を表示しています。
* `Button()` には、ボタンの上にテキストをレンダリングする `Text` コンポーザブルが含まれています。
* `AnimatedVisibility()` の呼び出しは、ボタンが押されたときにアニメーションを使用して `Image` を表示・非表示にするように設定されています。
* `painterResource()` は、XML ファイルとして保存されたベクトル画像を読み込みます。

`Column()` 関数の `horizontalAlignment` パラメータは、カラムのコンテンツを中央に配置します。
これを有効にするには、カラムがコンテナの全幅を占める必要があります。
これは `modifier` パラメータを使用して実現できます。

修飾子（Modifiers）は、Jetpack Compose および Compose Multiplatform の主要なコンポーネントです。
これらは UI 内のコンポーザブルの外観や動作を調整するための主要なメカニズムを提供します。
修飾子は `Modifier` 型のメソッドを使用して作成されます。これらのメソッドをチェーンすると、各呼び出しが前の呼び出しから返された `Modifier` を変更できるため、順序が重要になります。
詳細は [Compose Multiplatform の修飾子の概要](https://kotlinlang.org/docs/multiplatform/compose-layout-modifiers.html#built-in-modifiers) および広範な [Jetpack Compose の修飾子のドキュメント](https://developer.android.com/jetpack/compose/modifiers) を参照してください。

## 状態の管理

読み込まれた画像には永続的な性質があります。つまり、ユーザーがボタンをクリックしない限り、再構成（recompositions）をまたいでも表示または非表示の状態が一定に保たれる必要があります。
`App()` コンポーザブル内の `showContent` プロパティは `mutableStateOf()` 関数を使用して構築されています。これは、観察（observe）可能な状態オブジェクトであることを意味します。

```kotlin
var showContent by remember { mutableStateOf(false) }
```

状態オブジェクトは `remember()` 関数の呼び出しでラップされています。これは、オブジェクトが一度構築されると、フレームワークによって保持（retain）されることを意味します。これにより、`showContent` プロパティは Boolean を含む状態オブジェクトである値を持ちます。フレームワークはこの状態オブジェクトをキャッシュし、コンポーザブルがそれを観察できるようにします。

状態の値が変化すると、それを観察しているコンポーザブルが再呼び出しされます。これにより、それらが生成するウィジェットを再描画できます。これは *再構成*（recomposition）と呼ばれます。

状態が変更される唯一の場所は、`Button()` 呼び出しの `onClick` パラメータ内です。
イベントハンドラーが `showContent` プロパティの値を反転させます。
その結果、親の `AnimatedVisibility()` コンポーザブルが `showContent` を観察しているため、`Greeting().greet()` の呼び出しとともに画像が表示または非表示になります。

## 各プラットフォームでの UI の起動

`App()` 関数は、プラットフォームごとに異なる方法で実行されます。

* Android では、アクティビティによって管理されます。
* iOS では、ビューコントローラーによって管理されます。
* デスクトップでは、ウィンドウによって管理されます。
* Web では、コンテナによって管理されます。

それぞれを見ていきましょう。

### Android の場合

Android の場合は、`androidApp/src/main/kotlin` にある `MainActivity.kt` ファイルを開きます。

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

これは、共通コードで宣言された `App()` コンポーザブルを呼び出す、`MainActivity` と呼ばれる [Android アクティビティ](https://developer.android.com/guide/components/activities/intro-activities) です。

### iOS の場合

iOS の場合は、`shared/src/iosMain/kotlin` にある `MainViewController.kt` ファイルを開きます。

```kotlin
fun MainViewController() = ComposeUIViewController { App() }
```

これは、Android のアクティビティと同じ役割を果たす [ビューコントローラー](https://developer.apple.com/documentation/uikit/view_controllers) です。iOS と Android の両方の型が、共通コードの `App()` コンポーザブルを単に呼び出していることに注目してください。

### デスクトップの場合

デスクトップの場合は、`desktopApp/src/main/kotlin` にある `main.kt` ファイルを確認します。

```kotlin
fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "ComposeDemo"
    ) {
        App()
    }
}
```

* ここでは、`application()` 関数が新しいデスクトップアプリケーションを起動します。この関数はラムダを受け取り、そこで UI を初期化します。
* 通常、`application()` 関数内では `Window` を作成し、そのプロパティと、ウィンドウが閉じられたときに実行されるプログラムの指示（`onCloseRequest`）を指定します。デフォルトのプロジェクトでは、アプリケーション全体が終了します（`::exitApplication`）。
* ウィンドウの中に、コンテンツを配置できます。Android や iOS と同様に、唯一のコンテンツは `App()` コンポーザブルによって提供される UI レイアウトです。

この例では、`App()` 関数はパラメータを受け取りません。より大規模なアプリケーションでは、通常、プラットフォーム固有の依存関係をパラメータとして渡します。これらの依存関係は、手動で記述するか、依存関係注入（DI）ライブラリを使用して渡されます。

### Web の場合

`webApp/src/webMain/kotlin/` ディレクトリにある `main.kt` ファイル内の `main()` 関数を見てみましょう。

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport {
        App()
    }
}
```

* `@OptIn(ExperimentalComposeUiApi::class)` アノテーションは、試験運用版（experimental）としてマークされており、将来のリリースで変更される可能性がある Compose API を使用していることをコンパイラに伝えます。
* `ComposeViewport{}` 関数は、アプリケーションの Compose 環境をセットアップします。
* Web アプリは、`ComposeViewport` 関数のパラメータとして指定されたコンテナに挿入されます。
* `App()` 関数は、Jetpack Compose を使用してアプリケーションの UI コンポーネントを構築する責任があります。

## 次のステップ

チュートリアルの次のパートでは、プロジェクトに依存関係を追加し、ユーザーインターフェースを変更します。

**[次のパートへ進む](compose-multiplatform-modify-project.md)**

## ヘルプを得る

* **Kotlin Slack**: [招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受け取って、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) チャンネルに参加してください。
* **Kotlin イシュートラッカー**: [新しい問題を報告](https://youtrack.jetbrains.com/newIssue?project=KT)してください。