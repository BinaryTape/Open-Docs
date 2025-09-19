[//]: # (title: ナビゲーションとルーティング)

ナビゲーションは、ユーザーがアプリケーションの異なる画面間を移動できるようにする、UIアプリケーションの重要な要素です。
Compose Multiplatformは、[Jetpack Composeのナビゲーションアプローチ](https://developer.android.com/guide/navigation/design#frameworks)を採用しています。

## セットアップ

Navigationライブラリを使用するには、以下の依存関係を`commonMain`ソースセットに追加します。

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

## サンプルプロジェクト

Compose Multiplatformナビゲーションライブラリの動作を確認するには、[nav_cupcakeプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/nav_cupcake)をご覧ください。これは、[Composeで画面間を移動する](https://developer.android.com/codelabs/basic-android-kotlin-compose-navigation#0)Android codelabから変換されたものです。

Jetpack Composeと同様に、ナビゲーションを実装するには、次の手順を実行する必要があります。
1.  ナビゲーショングラフに含める[`ルートを一覧表示`します](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L50)。各ルートは、パスを定義する一意の文字列である必要があります。
2.  ナビゲーションを管理するための主要なコンポーザブルプロパティとして、[`NavHostController`インスタンスを作成します](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L89)。
3.  アプリに[`NavHost`コンポーザブルを追加します](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L109)：
    1.  以前に定義したルートのリストから開始デスティネーションを選択します。
    2.  ナビゲーショングラフを作成します。これは、`NavHost`の作成の一部として直接行うことも、`NavController.createGraph()`関数を使用してプログラムで行うこともできます。

各バックスタックエントリ（グラフに含まれる各ナビゲーションルート）は、`LifecycleOwner`インターフェースを実装します。
アプリの異なる画面間の切り替えにより、その状態が`RESUMED`から`STARTED`に、そして元に戻ります。
`RESUMED`は「確定済み」とも表現されます。新しい画面が準備され、アクティブになった時点でナビゲーションは完了したと見なされます。
Compose Multiplatformにおける現在の実装の詳細については、[ライフサイクル](compose-lifecycle.md)ページをご覧ください。

## Webアプリケーションでのブラウザナビゲーションのサポート
<secondary-label ref="Experimental"/>

Web向けのCompose Multiplatformは、共通のNavigationライブラリAPIを完全にサポートしており、さらにブラウザからのナビゲーション入力をアプリが受け取れるようにします。
ユーザーはブラウザの**「戻る」**および**「進む」**ボタンを使用してブラウザの履歴に反映されたナビゲーションルート間を移動できるほか、アドレスバーを使用して現在位置を把握し、直接目的地に移動することもできます。

Webアプリを共通コードで定義されたナビゲーショングラフにバインドするには、Kotlin/Wasmコードで`NavController.bindToBrowserNavigation()`メソッドを使用できます。
Kotlin/JSでも同じメソッドを使用できますが、Wasmアプリケーションが初期化され、Skiaがグラフィックをレンダリングする準備ができていることを確認するために、`onWasmReady {}`ブロックでラップする必要があります。
以下にその設定方法の例を示します。

```kotlin
// commonMainソースセット
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

// wasmJsMainソースセット
@OptIn(ExperimentalComposeUiApi::class)
@ExperimentalBrowserHistoryApi
fun main() {
    val body = document.body ?: return
    ComposeViewport(body) {
        App(
          onNavHostReady = { it.bindToBrowserNavigation() }
        )
    }
}

// jsMainソースセット
@OptIn(ExperimentalComposeUiApi::class)
@ExperimentalBrowserHistoryApi
fun main() {
    onWasmReady {
        val body = document.body ?: return@onWasmReady
        ComposeViewport(body) {
            App(
                onNavHostReady = { it.bindToBrowserNavigation() }
            )
        }
    }
}
```

`navController.bindToBrowserNavigation()`呼び出し後：
*   ブラウザに表示されるURLは、現在のルート（URLフラグメント内、`#`文字の後）を反映します。
*   アプリは手動で入力されたURLを解析し、それらをアプリ内のデスティネーションに変換します。

デフォルトでは、型安全なナビゲーションを使用する場合、デスティネーションは[`kotlinx.serialization`のデフォルト](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serial-name/)に従って、引数が追加されたURLフラグメントに変換されます。
`<app package>.<serializable type>/<argument1>/<argument2>`。
例: `example.org#org.example.app.StartScreen/123/Alice%2520Smith`。

### ルートからURLへの変換、およびその逆のカスタマイズ

Compose Multiplatformアプリはシングルページアプリであるため、フレームワークはアドレスバーを操作して、通常のWebナビゲーションを模倣します。
URLをより読みやすくし、実装をURLパターンから分離したい場合は、画面に直接名前を割り当てるか、デスティネーションルートのカスタム処理を完全に開発できます。

*   URLを単に読みやすくするには、`@SerialName`アノテーションを使用して、シリアライズ可能なオブジェクトまたはクラスのシリアル名を明示的に設定します。

    ```kotlin
    // アプリパッケージとオブジェクト名を使用する代わりに、
    // このルートはURLに単に "#start" として変換されます。
    @Serializable @SerialName("start") data object StartScreen
    ```
*   すべてのURLを完全に構築するには、オプションの`getBackStackEntryRoute`ラムダを使用できます。

#### 完全なURLのカスタマイズ

ルートからURLへの変換を完全にカスタムで実装するには：

1.  オプションの`getBackStackEntryRoute`ラムダを`navController.bindToBrowserNavigation()`関数に渡し、必要に応じてルートがどのようにURLフラグメントに変換されるべきかを指定します。
2.  必要に応じて、アドレスバーのURLフラグメントを捕捉し（誰かがアプリのURLをクリックまたは貼り付けた場合）、URLをルートに変換して、それに応じてユーザーをナビゲートするコードを追加します。

以下に、以下のWebコードサンプル（`commonMain/kotlin/org.example.app/App.kt`）で使用するシンプルな型安全なナビゲーショングラフの例を示します。

```kotlin
// ナビゲーショングラフ内のルート引数用のシリアライズ可能なオブジェクトとクラス
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
                // 適切なパラメーターで「Id」画面を開くボタン
                Button(onClick = { navController.navigate(Id(222)) }) {
                    Text("Pass 222 as a parameter to the ID screen")
                }
                // 適切なパラメーターで「Patient」画面を開くボタン
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

`wasmJsMain/kotlin/main.kt`で、`.bindToBrowserNavigation()`呼び出しにラムダを追加します。

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
                navController.bindToBrowserNavigation() { entry ->
                    val route = entry.destination.route.orEmpty()
                    when {
                        // シリアルディスクリプタを使用してルートを識別する
                        route.startsWith(StartScreen.serializer().descriptor.serialName) -> {
                            // 対応するURLフラグメントを
                            // "#org.example.app.StartScreen" の代わりに
                            // "#start" に設定する
                            //
                            // この文字列は、フロントエンドでの処理を維持するために
                            // 常に`#`文字で始まる必要があります。
                            "#start"
                        }
                        route.startsWith(Id.serializer().descriptor.serialName) -> {
                            // ルート引数にアクセスする
                            val args = entry.toRoute<Id>()

                            // 対応するURLフラグメントを
                            // "#org.example.app.ID%2F222" の代わりに
                            // "#find_id_222" に設定する
                            "#find_id_${args.id}"
                        }
                        route.startsWith(Patient.serializer().descriptor.serialName) -> {
                            val args = entry.toRoute<Patient>()
                            // 対応するURLフラグメントを
                            // "#org.company.app.Patient%2FJane%2520Smith-Baker%2F33" の代わりに
                            // "#patient_Jane%20Smith-Baker_33" に設定する
                            "#patient_${args.name}_${args.age}"
                        }
                        // その他のすべてのルートにはURLフラグメントを設定しない
                        else -> ""
                    }
                }
            }
        )
    }
}
```
<!--{default-state="collapsed" collapsible="true" collapsed-title="navController.bindToBrowserNavigation() { entry ->"}-->

> ルートに対応するすべての文字列が`#`文字で始まることを確認し、データをURLフラグメント内に保持してください。
> そうしないと、ユーザーがURLをコピー＆ペーストしたときに、ブラウザが誤ったエンドポイントにアクセスしようとし、アプリに制御が渡されなくなります。
>
{style="note"}

URLにカスタムフォーマットがある場合、手動で入力されたURLをデスティネーションルートと照合するために、逆処理を追加する必要があります。
照合を行うコードは、`navController.bindToBrowserNavigation()`呼び出しがブラウザの場所をナビゲーショングラフにバインドする前に実行する必要があります。

<Tabs>
    <TabItem title="Kotlin/Wasm">
        <code-block lang="Kotlin" code="        @OptIn(&#10;            ExperimentalComposeUiApi::class,&#10;            ExperimentalBrowserHistoryApi::class,&#10;            ExperimentalSerializationApi::class&#10;        )&#10;        fun main() {&#10;            val body = document.body ?: return&#10;            ComposeViewport(body) {&#10;                App(&#10;                    onNavHostReady = { navController -&gt;&#10;                        // 現在のURLのフラグメントサブ文字列にアクセスする&#10;                        val initRoute = window.location.hash.substringAfter('#', &quot;&quot;)&#10;                        when {&#10;                            // 対応するルートを識別し、そこにナビゲートする&#10;                            initRoute.startsWith(&quot;start&quot;) -&gt; {&#10;                                navController.navigate(StartScreen)&#10;                            }&#10;                            initRoute.startsWith(&quot;find_id&quot;) -&gt; {&#10;                                // 文字列を解析してルートパラメータを抽出し、そこにナビゲートする&#10;                                val id = initRoute.substringAfter(&quot;find_id_&quot;).toLong()&#10;                                navController.navigate(Id(id))&#10;                            }&#10;                            initRoute.startsWith(&quot;patient&quot;) -&gt; {&#10;                                val name = initRoute.substringAfter(&quot;patient_&quot;).substringBefore(&quot;_&quot;)&#10;                                val id = initRoute.substringAfter(&quot;patient_&quot;).substringAfter(&quot;_&quot;).toLong()&#10;                                navController.navigate(Patient(name, id))&#10;                            }&#10;                        }&#10;                        navController.bindToBrowserNavigation() { ... }&#10;                    }&#10;                )&#10;            }&#10;        }"/>
    </TabItem>
    <TabItem title="Kotlin/JS">
        <code-block lang="kotlin" code="        @OptIn(&#10;            ExperimentalComposeUiApi::class,&#10;            ExperimentalBrowserHistoryApi::class,&#10;            ExperimentalSerializationApi::class&#10;        )&#10;        fun main() {&#10;            onWasmReady {&#10;                val body = document.body ?: return@onWasmReady&#10;                ComposeViewport(body) {&#10;                    App(&#10;                        onNavHostReady = { navController -&gt;&#10;                            // 現在のURLのフラグメントサブ文字列にアクセスする&#10;                            val initRoute = window.location.hash.substringAfter('#', &quot;&quot;)&#10;                            when {&#10;                                // 対応するルートを識別し、そこにナビゲートする&#10;                                initRoute.startsWith(&quot;start&quot;) -&gt; {&#10;                                    navController.navigate(StartScreen)&#10;                                }&#10;                                initRoute.startsWith(&quot;find_id&quot;) -&gt; {&#10;                                    // 文字列を解析してルートパラメータを抽出し、そこにナビゲートする&#10;                                    val id = initRoute.substringAfter(&quot;find_id_&quot;).toLong()&#10;                                    navController.navigate(Id(id))&#10;                                }&#10;                                initRoute.startsWith(&quot;patient&quot;) -&gt; {&#10;                                    val name = initRoute.substringAfter(&quot;patient_&quot;).substringBefore(&quot;_&quot;)&#10;                                    val id = initRoute.substringAfter(&quot;patient_&quot;).substringAfter(&quot;_&quot;).toLong()&#10;                                    navController.navigate(Patient(name, id))&#10;                                }&#10;                            }&#10;                            navController.bindToBrowserNavigation() { ... }&#10;                        }&#10;                    )&#10;                }&#10;            }&#10;        }"/>
    </TabItem>
</Tabs>