[//]: # (title: ナビゲーションとルーティング)

ナビゲーションはUIアプリケーションの主要な部分であり、ユーザーが異なるアプリケーション画面間を移動できるようにします。
Compose Multiplatformは、[Jetpack Composeのナビゲーションアプローチ](https://developer.android.com/guide/navigation/design#frameworks)を採用しています。

> ナビゲーションライブラリは現在[ベータ版](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)です。
> Compose Multiplatformプロジェクトでお試しください。
> [YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP)にてフィードバックをいただけると幸いです。
>
{style="tip"}

## セットアップ

ナビゲーションライブラリを使用するには、以下の依存関係を`commonMain`ソースセットに追加します。

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%"}

> Compose Multiplatform %org.jetbrains.compose% は、ナビゲーションライブラリのバージョン %org.jetbrains.androidx.navigation% を必要とします。
>
{style="note"}

## サンプルプロジェクト

Compose Multiplatformナビゲーションライブラリの動作を確認するには、[Navigate between screens with Compose](https://developer.android.com/codelabs/basic-android-kotlin-compose-navigation#0) Android codelabから変換された[nav_cupcakeプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/nav_cupcake)をチェックしてください。

Jetpack Composeと同様に、ナビゲーションを実装するには、以下の手順を実行します。
1.  ナビゲーショングラフに含める[ルートをリストアップ](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L50)します。各ルートは、パスを定義する一意の文字列である必要があります。
2.  ナビゲーションを管理するための主要なコンポーザブルプロパティとして、[`NavHostController`インスタンスを作成](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L89)します。
3.  アプリに[`NavHost`コンポーザブルを追加](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L109)します。
    1.  以前に定義したルートのリストから開始デスティネーションを選択します。
    2.  ナビゲーショングラフを、`NavHost`の作成の一部として直接作成するか、`NavController.createGraph()`関数を使用してプログラムで作成します。

各バックスタックエントリ（グラフに含まれる各ナビゲーションルート）は、`LifecycleOwner`インターフェースを実装します。
アプリの異なる画面間の切り替えにより、その状態が`RESUMED`から`STARTED`へ、そして元に戻ります。
`RESUMED`は「安定した」状態とも表現されます。新しい画面が準備され、アクティブになった時点でナビゲーションは完了と見なされます。
Compose Multiplatformにおける現在の実装の詳細については、[](compose-lifecycle.md)ページを参照してください。

## Webアプリにおけるブラウザナビゲーションのサポート
<secondary-label ref="Experimental"/>

Web向けのCompose Multiplatformは、共通のナビゲーションライブラリAPIを完全にサポートしており、さらにアプリがブラウザからナビゲーション入力を受け取ることができるようになります。
ユーザーはブラウザの**戻る**ボタンと**進む**ボタンを使用して、ブラウザの履歴に反映されたナビゲーションルート間を移動したり、アドレスバーを使用して現在地を把握し、直接目的地に移動したりできます。

Webアプリを共通コードで定義されたナビゲーショングラフにバインドするには、Kotlin/Wasmコードで`window.bindToNavigation()`メソッドを使用できます。
同じメソッドをKotlin/JSでも使用できますが、Wasmアプリケーションが初期化され、Skiaがグラフィックスのレンダリングの準備ができていることを確認するために、`onWasmReady {}`ブロックでラップしてください。
設定方法の例を以下に示します。

```kotlin
//commonMain source set
@Composable
fun App(
    onNavHostReady: suspend (NavController) -> Unit = {}
) {
    val navController = rememberNavController()
    NavHost(...) {
        //...
    }
    LaunchedEffect(navController) {
        onNavHostReady(navController)
    }
}

//wasmJsMain source set
@OptIn(ExperimentalComposeUiApi::class)
@ExperimentalBrowserHistoryApi
fun main() {
    val body = document.body ?: return
    ComposeViewport(body) {
        App(
          onNavHostReady = { window.bindToNavigation(it) }
        )
    }
}

//jsMain source set
@OptIn(ExperimentalComposeUiApi::class)
@ExperimentalBrowserHistoryApi
fun main() {
    onWasmReady {
        val body = document.body ?: return@onWasmReady
        ComposeViewport(body) {
            App(
                onNavHostReady = { window.bindToNavigation(it) }
            )
        }
    }
}
```

`window.bindToNavigation(navController)`呼び出し後：
*   ブラウザに表示されるURLは、現在のルート（URLフラグメント内、`#`文字の後）を反映します。
*   アプリは手動で入力されたURLを解析し、アプリ内のデスティネーションに変換します。

デフォルトでは、型安全なナビゲーションを使用する場合、デスティネーションは、[`kotlinx.serialization`のデフォルト](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serial-name/)に従って、引数が追加されたURLフラグメントに変換されます。
`<app package>.<serializable type>/<argument1>/<argument2>`。
例: `example.org#org.example.app.StartScreen/123/Alice%2520Smith`。

### ルートをURLに変換し、元に戻す方法をカスタマイズする

Compose Multiplatformアプリはシングルページアプリであるため、フレームワークは通常Webナビゲーションを模倣するためにアドレスバーを操作します。
URLをより読みやすくし、実装をURLパターンから分離したい場合は、画面に直接名前を割り当てるか、デスティネーションルートに対して完全にカスタムな処理を開発できます。

*   単純にURLを読みやすくするには、`@SerialName`アノテーションを使用して、シリアライズ可能なオブジェクトまたはクラスのシリアル名を明示的に設定します。

    ```kotlin
    // アプリケーションパッケージとオブジェクト名の代わりに、
    // このルートはURLにシンプルに「#start」として変換されます
    @Serializable @SerialName("start") data object StartScreen
    ```
*   すべてのURLを完全に構築するには、オプションの`getBackStackEntryRoute`ラムダを使用できます。

#### 完全なURLのカスタマイズ

完全にカスタムなルートからURLへの変換を実装するには：

1.  オプションの`getBackStackEntryRoute`ラムダを`window.bindToNavigation()`関数に渡し、必要に応じてルートがURLフラグメントに変換される方法を指定します。
2.  必要に応じて、アドレスバーのURLフラグメントを捕捉し（誰かがアプリのURLをクリックまたは貼り付けた場合）、ユーザーを適切にナビゲートするためにURLをルートに変換するコードを追加します。

以下に示すウェブコードのサンプル（`commonMain/kotlin/org.example.app/App.kt`）で使用する、シンプルな型安全ナビゲーショングラフの例を以下に示します。

```kotlin
// Serializable object and classes for route arguments in the navigation graph
@Serializable data object StartScreen
@Serializable data class Id(val id: Long)
@Serializable data class Patient(val name: String, val age: Long)

@Composable
internal fun App(
    onNavHostReady: suspend (NavController) -> Unit = {}
) = AppTheme {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = StartScreen
    ) {
        composable<StartScreen> {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text("Starting screen")
                // Button that opens the 'Id' screen with a suitable parameter
                Button(onClick = { navController.navigate(Id(222)) }) {
                    Text("Pass 222 as a parameter to the ID screen")
                }
                // Button that opens the 'Patient' screen with suitable parameters
                Button(onClick = { navController.navigate(Patient( "Jane Smith-Baker", 33)) }) {
                    Text("Pass 'Jane Smith-Baker' and 33 to the Person screen")
                }
            }
        }
        composable<Id> {...}
        composable<Patient> {...}
    }
    LaunchedEffect(navController) {
        onNavHostReady(navController)
    }
}
```
{default-state="collapsed" collapsible="true" collapsed-title="NavHost(navController = navController, startDestination = StartScreen)"}

`wasmJsMain/kotlin/main.kt`で、`.bindToNavigation()`呼び出しにラムダを追加します。

```kotlin
@OptIn(
    ExperimentalComposeUiApi::class,
    ExperimentalBrowserHistoryApi::class,
    ExperimentalSerializationApi::class
)
fun main() {
    val body = document.body ?: return
    ComposeViewport(body) {
        App(
            onNavHostReady = { navController ->
                window.bindToNavigation(navController) { entry ->
                    val route = entry.destination.route.orEmpty()
                    when {
                        // Identifies the route using its serial descriptor
                        route.startsWith(StartScreen.serializer().descriptor.serialName) -> {
                            // Sets the corresponding URL fragment to "#start"
                            // instead of "#org.example.app.StartScreen"
                            //
                            // This string must always start with the `#` character to keep
                            // the processing at the front end
                            "#start"
                        }
                        route.startsWith(Id.serializer().descriptor.serialName) -> {
                            // Accesses the route arguments
                            val args = entry.toRoute<Id>()

                            // Sets the corresponding URL fragment to "#find_id_222"
                            // instead of "#org.example.app.ID%2F222"
                            "#find_id_${args.id}"
                        }
                        route.startsWith(Patient.serializer().descriptor.serialName) -> {
                            val args = entry.toRoute<Patient>()
                            // Sets the corresponding URL fragment to "#patient_Jane%20Smith-Baker_33"
                            // instead of "#org.company.app.Patient%2FJane%2520Smith-Baker%2F33"
                            "#patient_${args.name}_${args.age}"
                        }
                        // Doesn't set a URL fragment for all other routes
                        else -> ""
                    }
                }
            }
        )
    }
}
```
<!--{default-state="collapsed" collapsible="true" collapsed-title="window.bindToNavigation(navController) { entry ->"}-->

> ルートに対応するすべての文字列が`#`文字で始まることを確認し、データをURLフラグメント内に保持してください。
> そうしないと、ユーザーがURLをコピー＆ペーストした際に、ブラウザが誤ったエンドポイントにアクセスしようとし、アプリに制御が渡らなくなります。
>
{style="note"}

URLにカスタム書式が設定されている場合、手動で入力されたURLをデスティネーションルートに一致させるための逆処理を追加する必要があります。
照合を行うコードは、`window.bindToNavigation()`呼び出しが`window.location`をナビゲーショングラフにバインドする前に実行される必要があります。

<tabs>
    <tab title="Kotlin/Wasm">
        <code-block lang="Kotlin">
        @OptIn(
            ExperimentalComposeUiApi::class,
            ExperimentalBrowserHistoryApi::class,
            ExperimentalSerializationApi::class
        )
        fun main() {
            val body = document.body ?: return
            ComposeViewport(body) {
                App(
                    onNavHostReady = { navController ->
                        // Accesses the fragment substring of the current URL
                        val initRoute = window.location.hash.substringAfter('#', "")
                        when {
                            // Identifies the corresponding route and navigates to it
                            initRoute.startsWith("start") -> {
                                navController.navigate(StartScreen)
                            }
                            initRoute.startsWith("find_id") -> {
                                // Parses the string to extract route parameters before navigating to it
                                val id = initRoute.substringAfter("find_id_").toLong()
                                navController.navigate(Id(id))
                            }
                            initRoute.startsWith("patient") -> {
                                val name = initRoute.substringAfter("patient_").substringBefore("_")
                                val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                navController.navigate(Patient(name, id))
                            }
                        }
                        window.bindToNavigation(navController) { ... }
                    }
                )
            }
        }
        </code-block>
    </tab>
    <tab title="Kotlin/JS">
        <code-block lang="kotlin">
        @OptIn(
            ExperimentalComposeUiApi::class,
            ExperimentalBrowserHistoryApi::class,
            ExperimentalSerializationApi::class
        )
        fun main() {
            onWasmReady {
                val body = document.body ?: return@onWasmReady
                ComposeViewport(body) {
                    App(
                        onNavHostReady = { navController ->
                            // Accesses the fragment substring of the current URL
                            val initRoute = window.location.hash.substringAfter('#', "")
                            when {
                                // Identifies the corresponding route and navigates to it
                                initRoute.startsWith("start") -> {
                                    navController.navigate(StartScreen)
                                }
                                initRoute.startsWith("find_id") -> {
                                    // Parses the string to extract route parameters before navigating to it
                                    val id = initRoute.substringAfter("find_id_").toLong()
                                    navController.navigate(Id(id))
                                }
                                initRoute.startsWith("patient") -> {
                                    val name = initRoute.substringAfter("patient_").substringBefore("_")
                                    val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                    navController.navigate(Patient(name, id))
                                }
                            }
                            window.bindToNavigation(navController) { ... }
                        }
                    )
                }
            }
        }
        </code-block>
    </tab>
</tabs>