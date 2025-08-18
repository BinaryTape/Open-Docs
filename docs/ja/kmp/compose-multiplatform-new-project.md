[//]: # (title: 独自のアプリケーションを作成する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformサポートは共通しています。</p>
    <br/>
    <p>これは「<strong>共有ロジックとUIを持つCompose Multiplatformアプリを作成する</strong>」チュートリアルの最終パートです。先に進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformサポートは共通しています。これは共有ロジックとUIを持つCompose Multiplatformアプリを作成するチュートリアルの最初のパートです。Compose Multiplatformアプリを作成する コンポーザブルコードを探る プロジェクトを修正する 独自のアプリケーションを作成する">Compose Multiplatformアプリを作成する</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="2番目のステップ"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformサポートは共通しています。これは共有ロジックとUIを持つCompose Multiplatformアプリを作成するチュートリアルの2番目のパートです。先に進む前に、前の手順を完了していることを確認してください。Compose Multiplatformアプリを作成する コンポーザブルコードを探る プロジェクトを修正する 独自のアプリケーションを作成する">コンポーザブルコードを探る</Links><br/>
       <img src="icon-3-done.svg" width="20" alt="3番目のステップ"/> <Links href="/kmp/compose-multiplatform-modify-project" summary="このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformサポートは共通しています。これは共有ロジックとUIを持つCompose Multiplatformアプリを作成するチュートリアルの3番目のパートです。先に進む前に、前の手順を完了していることを確認してください。Compose Multiplatformアプリを作成する コンポーザブルコードを探る プロジェクトを修正する 独自のアプリケーションを作成する">プロジェクトを修正する</Links><br/>
       <img src="icon-4.svg" width="20" alt="4番目のステップ"/> <strong>独自のアプリケーションを作成する</strong><br/>
    </p>
</tldr>

ウィザードで作成されたサンプルプロジェクトを探求し、強化したところで、あなたはすでに知っている概念を使い、新しい概念を導入しながら、ゼロから独自のアプリケーションを作成することができます。

ユーザーが国と都市を入力し、アプリがその国の首都の時刻を表示する「ローカル時刻表示アプリケーション」を作成します。Compose Multiplatformアプリのすべての機能は、マルチプラットフォームライブラリを使用して共通コードで実装されます。ドロップダウンメニュー内に画像をロードして表示し、イベント、スタイル、テーマ、モディファイア、レイアウトを使用します。

各ステージで、アプリケーションを3つのプラットフォーム（iOS、Android、デスクトップ）すべてで実行することも、ニーズに最適な特定のプラットフォームに集中することもできます。

> プロジェクトの最終状態は、[GitHubリポジトリ](https://github.com/kotlin-hands-on/get-started-with-cm/)で確認できます。
>
{style="note"}

## 基礎を構築する

まず、新しい`App`コンポーザブルを実装します。

1.  `composeApp/src/commonMain/kotlin`にある`App.kt`ファイルを開き、コードを次の`App`コンポーザブルに置き換えます。

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var timeAtLocation by remember { mutableStateOf("No location selected") }
   
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(timeAtLocation)
                Button(onClick = { timeAtLocation = "13:30" }) {
                    Text("Show Time At Location")
                }
            }
        }
    }
    ```

   *   このレイアウトは、2つのコンポーザブルを含むColumnです。1つ目は`Text`コンポーザブル、2つ目は`Button`です。
   *   これら2つのコンポーザブルは、`timeAtLocation`プロパティという単一の共有状態によってリンクされています。`Text`コンポーザブルはこの状態のオブザーバーです。
   *   `Button`コンポーザブルは、`onClick`イベントハンドラーを使用して状態を変更します。

2.  AndroidとiOSでアプリケーションを実行します。

   ![AndroidとiOSでの新しいCompose Multiplatformアプリ](first-compose-project-on-android-ios-3.png){width=500}

   アプリケーションを実行し、ボタンをクリックすると、ハードコードされた時刻が表示されます。

3.  デスクトップでアプリケーションを実行します。動作しますが、UIに対してウィンドウが明らかに大きすぎます。

   ![デスクトップでの新しいCompose Multiplatformアプリ](first-compose-project-on-desktop-3.png){width=400}

4.  これを修正するには、`composeApp/src/desktopMain/kotlin`にある`main.kt`ファイルを次のように更新します。

    ```kotlin
    fun main() = application {
       val state = rememberWindowState(
           size = DpSize(400.dp, 250.dp),
           position = WindowPosition(300.dp, 300.dp)
       )
       Window(
           title = "Local Time App",
           onCloseRequest = ::exitApplication,
           state = state,
           alwaysOnTop = true
       ) {
           App()
       }
    }
    ```

    ここでは、ウィンドウのタイトルを設定し、`WindowState`型を使用してウィンドウの初期サイズと画面上の位置を設定しています。

    > デスクトップアプリでリアルタイムに変更を見るには、[Compose Hot Reload](compose-hot-reload.md)を使用します。
    > 1. `main.kt`ファイルで、ガターにある**Run**アイコンをクリックします。
    > 2. **Run 'main [desktop]' with Compose Hot Reload (Alpha)**を選択します。
    > ![ガターからCompose Hot Reloadを実行する](compose-hot-reload-gutter-run.png){width=350}
    >
    > アプリが自動的に更新されるのを見るには、変更されたファイルを保存します（<shortcut>⌘ S</shortcut> / <shortcut>Ctrl+S</shortcut>）。
    >
    > Compose Hot Reloadは現在[アルファ版](https://kotlinlang.org/components-stability.html#stability-levels-explained)であり、その機能は変更される可能性があります。
    >
    {style="tip"}

5.  IDEの指示に従って、不足している依存関係をインポートします。
6.  デスクトップアプリケーションを再度実行します。見た目が改善されているはずです。

   ![デスクトップ上のCompose Multiplatformアプリの改善された外観](first-compose-project-on-desktop-4.png){width=350}

   ### Compose Hot Reloadのデモ {initial-collapse-state="collapsed" collapsible="true"}

   ![Compose Hot Reload](compose-hot-reload-resize.gif)

## ユーザー入力をサポートする

次に、ユーザーが都市名を入力してその場所の時刻を確認できるようにします。これを実現する最も簡単な方法は、`TextField`コンポーザブルを追加することです。

1.  現在の`App`の実装を以下に置き換えます。

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var location by remember { mutableStateOf("Europe/Paris") }
            var timeAtLocation by remember { mutableStateOf("No location selected") }
    
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(timeAtLocation)
                TextField(value = location, onValueChange = { location = it })
                Button(onClick = { timeAtLocation = "13:30" }) {
                    Text("Show Time At Location")
                }
            }
        }
    }
    ```

    新しいコードは、`TextField`と`location`プロパティの両方を追加します。ユーザーがテキストフィールドに入力すると、`onValueChange`イベントハンドラーを使用してプロパティの値が段階的に更新されます。

2.  IDEの指示に従って、不足している依存関係をインポートします。
3.  ターゲットとする各プラットフォームでアプリケーションを実行します。

<Tabs>
    <TabItem id="mobile-user-input" title="AndroidとiOS">
        <img src="first-compose-project-on-android-ios-4.png" alt="AndroidとiOSにおけるCompose Multiplatformアプリのユーザー入力" width="500"/>
    </TabItem>
    <TabItem id="desktop-user-input" title="デスクトップ">
        <img src="first-compose-project-on-desktop-5.png" alt="デスクトップにおけるCompose Multiplatformアプリのユーザー入力" width="350"/>
    </TabItem>
</Tabs>

## 時刻を計算する

次のステップは、与えられた入力を使用して時刻を計算することです。これを行うには、`currentTimeAt()`関数を作成します。

1.  `App.kt`ファイルに戻り、以下の関数を追加します。

    ```kotlin
    fun currentTimeAt(location: String): String? {
        fun LocalTime.formatted() = "$hour:$minute:$second"

        return try {
            val time = Clock.System.now()
            val zone = TimeZone.of(location)
            val localTime = time.toLocalDateTime(zone).time
            "The time in $location is ${localTime.formatted()}"
        } catch (ex: IllegalTimeZoneException) {
            null
        }
    }
    ```

    この関数は、以前に作成した（そしてもはや不要な）`todaysDate()`に似ています。

2.  IDEの指示に従って、不足している依存関係をインポートします。
3.  `App`コンポーザブルを調整して`currentTimeAt()`を呼び出します。

    ```kotlin
    @Composable
    @Preview
    fun App() {
    MaterialTheme {
    var location by remember { mutableStateOf("Europe/Paris") }
    var timeAtLocation by remember { mutableStateOf("No location selected") }

       Column(
           modifier = Modifier
               .safeContentPadding()
               .fillMaxSize()
           ) {
               Text(timeAtLocation)
               TextField(value = location, onValueChange = { location = it })
               Button(onClick = { timeAtLocation = currentTimeAt(location) ?: "Invalid Location" }) {
                   Text("Show Time At Location")
               }
           }
       }
    }
    ```

4.  `wasmJsMain/kotlin/main.kt`ファイルで、Web用のタイムゾーンサポートを初期化するために、`main()`関数の前に以下のコードを追加します。

    ```kotlin
    @JsModule("@js-joda/timezone")
    external object JsJodaTimeZoneModule
    
    private val jsJodaTz = JsJodaTimeZoneModule
    ```

5.  アプリケーションを再度実行し、有効なタイムゾーンを入力します。
6.  ボタンをクリックします。正しい時刻が表示されるはずです。

<Tabs>
    <TabItem id="mobile-time-display" title="AndroidとiOS">
        <img src="first-compose-project-on-android-ios-5.png" alt="AndroidとiOSにおけるCompose Multiplatformアプリの時刻表示" width="500"/>
    </TabItem>
    <TabItem id="desktop-time-display" title="デスクトップ">
        <img src="first-compose-project-on-desktop-6.png" alt="デスクトップにおけるCompose Multiplatformアプリの時刻表示" width="350"/>
    </TabItem>
</Tabs>

## スタイルを改善する

アプリケーションは動作していますが、見た目に問題があります。コンポーザブルの間隔を適切にし、時刻メッセージをより目立つように表示できます。

1.  これらの問題を解決するには、以下のバージョンの`App`コンポーザブルを使用します。

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var location by remember { mutableStateOf("Europe/Paris") }
            var timeAtLocation by remember { mutableStateOf("No location selected") }
   
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(
                    timeAtLocation,
                    style = TextStyle(fontSize = 20.sp),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().align(Alignment.CenterHorizontally)
                )
                TextField(
                    value = location,
                    onValueChange = { location = it },
                    modifier = Modifier.padding(top = 10.dp)
                )
                Button(
                    onClick = { timeAtLocation = currentTimeAt(location) ?: "Invalid Location" },
                    modifier = Modifier.padding(top = 10.dp)
                ) {
                    Text("Show Time")
                }
            }
        }
    }
    ```

    *   `modifier`パラメーターは、`Column`の周囲全体、および`Button`と`TextField`の上部にパディングを追加します。
    *   `Text`コンポーザブルは利用可能な水平方向のスペースを埋め、そのコンテンツを中央に配置します。
    *   `style`パラメーターは、`Text`の見た目をカスタマイズします。

2.  IDEの指示に従って、不足している依存関係をインポートします。
    `Alignment`には`androidx.compose.ui`バージョンを使用してください。

3.  アプリケーションを実行して、見た目がどのように改善されたかを確認します。

<Tabs>
    <TabItem id="mobile-improved-style" title="AndroidとiOS">
        <img src="first-compose-project-on-android-ios-6.png" alt="AndroidとiOSにおけるCompose Multiplatformアプリの改善されたスタイル" width="500"/>
    </TabItem>
    <TabItem id="desktop-improved-style" title="デスクトップ">
        <img src="first-compose-project-on-desktop-7.png" alt="デスクトップにおけるCompose Multiplatformアプリの改善されたスタイル" width="350"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage2).
>
{style="tip"}
-->

## デザインをリファクタリングする

アプリケーションは動作していますが、スペルミスが起こりやすいです。たとえば、ユーザーが「France」の代わりに「Franse」と入力した場合、アプリはその入力を処理できません。ユーザーに定義済みリストから国を選択してもらう方が望ましいでしょう。

1.  これを実現するには、`App`コンポーザブルのデザインを変更します。

    ```kotlin
    data class Country(val name: String, val zone: TimeZone)
    
    fun currentTimeAt(location: String, zone: TimeZone): String {
        fun LocalTime.formatted() = "$hour:$minute:$second"
    
        val time = Clock.System.now()
        val localTime = time.toLocalDateTime(zone).time
    
        return "The time in $location is ${localTime.formatted()}"
    }
    
    fun countries() = listOf(
        Country("Japan", TimeZone.of("Asia/Tokyo")),
        Country("France", TimeZone.of("Europe/Paris")),
        Country("Mexico", TimeZone.of("America/Mexico_City")),
        Country("Indonesia", TimeZone.of("Asia/Jakarta")),
        Country("Egypt", TimeZone.of("Africa/Cairo")),
    )
    
    @Composable
    @Preview
    fun App(countries: List<Country> = countries()) {
        MaterialTheme {
            var showCountries by remember { mutableStateOf(false) }
            var timeAtLocation by remember { mutableStateOf("No location selected") }
    
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(
                    timeAtLocation,
                    style = TextStyle(fontSize = 20.sp),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().align(Alignment.CenterHorizontally)
                )
                Row(modifier = Modifier.padding(start = 20.dp, top = 10.dp)) {
                    DropdownMenu(
                        expanded = showCountries,
                        onDismissRequest = { showCountries = false }
                    ) {
                        countries().forEach { (name, zone) ->
                            DropdownMenuItem(
                                text = {   Text(name)},
                                onClick = {
                                    timeAtLocation = currentTimeAt(name, zone)
                                    showCountries = false
                                }
                            )
                        }
                    }
                }
    
                Button(modifier = Modifier.padding(start = 20.dp, top = 10.dp),
                    onClick = { showCountries = !showCountries }) {
                    Text("Select Location")
                }
            }
        }
    }
    ```

   *   名前とタイムゾーンからなる`Country`型があります。
   *   `currentTimeAt()`関数は、2番目のパラメーターとして`TimeZone`を取ります。
   *   `App`は、パラメーターとして国のリストを必要とするようになりました。`countries()`関数がリストを提供します。
   *   `TextField`が`DropdownMenu`に置き換えられました。`showCountries`プロパティの値が`DropdownMenu`の表示を決定します。各国には`DropdownMenuItem`があります。

2.  IDEの指示に従って、不足している依存関係をインポートします。
3.  アプリケーションを実行して、再設計されたバージョンを確認します。

<Tabs>
    <TabItem id="mobile-country-list" title="AndroidとiOS">
        <img src="first-compose-project-on-android-ios-7.png" alt="AndroidとiOSにおけるCompose Multiplatformアプリの国リスト" width="500"/>
    </TabItem>
    <TabItem id="desktop-country-list" title="デスクトップ">
        <img src="first-compose-project-on-desktop-8.png" alt="デスクトップにおけるCompose Multiplatformアプリの国リスト" width="350"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage3).
>
{style="tip"}
-->

> [Koin](https://insert-koin.io/)のような依存性注入フレームワークを使用して、場所のテーブルを構築および注入することで、デザインをさらに改善できます。データが外部に保存されている場合は、[Ktor](https://ktor.io/docs/create-client.html)ライブラリを使用してネットワーク経由でフェッチするか、[SQLDelight](https://github.com/cashapp/sqldelight)ライブラリを使用してデータベースからフェッチできます。
>
{style="note"}

## 画像を導入する

国のリストは動作しますが、視覚的に魅力的ではありません。国名を国旗の画像に置き換えることで改善できます。

Compose Multiplatformは、すべてのプラットフォームで共通コードを通じてリソースにアクセスするためのライブラリを提供しています。Kotlin Multiplatformウィザードは、このライブラリをすでに加えて設定しているため、ビルドファイルを変更することなくリソースのロードを開始できます。

プロジェクトで画像をサポートするには、画像ファイルをダウンロードし、適切なディレクトリに保存し、それらをロードして表示するコードを追加する必要があります。

1.  [Flag CDN](https://flagcdn.com/)などの外部リソースを使用して、すでに作成した国のリストに一致する国旗をダウンロードします。この場合、これらは[日本](https://flagcdn.com/w320/jp.png)、[フランス](https://flagcdn.com/w320/fr.png)、[メキシコ](https://flagcdn.com/w320/mx.png)、[インドネシア](https://flagcdn.com/w320/id.png)、[エジプト](https://flagcdn.com/w320/eg.png)です。

2.  画像を`composeApp/src/commonMain/composeResources/drawable`ディレクトリに移動して、すべてのプラットフォームで同じ国旗が利用できるようにします。

   ![Compose Multiplatformリソースのプロジェクト構造](compose-resources-project-structure.png){width=300}

3.  アプリケーションをビルドまたは実行して、追加されたリソースへのアクセサーを含む`Res`クラスを生成します。

4.  画像をサポートするために、`commonMain/kotlin/.../App.kt`ファイル内のコードを更新します。

    ```kotlin
    import compose.project.demo.generated.resources.eg
    import compose.project.demo.generated.resources.fr
    import compose.project.demo.generated.resources.id
    import compose.project.demo.generated.resources.jp
    import compose.project.demo.generated.resources.mx
   
   data class Country(val name: String, val zone: TimeZone, val image: DrawableResource)

    fun currentTimeAt(location: String, zone: TimeZone): String {
        fun LocalTime.formatted() = "$hour:$minute:$second"

        val time = Clock.System.now()
        val localTime = time.toLocalDateTime(zone).time

        return "The time in $location is ${localTime.formatted()}"
    }

    val defaultCountries = listOf(
        Country("Japan", TimeZone.of("Asia/Tokyo"), Res.drawable.jp),
        Country("France", TimeZone.of("Europe/Paris"), Res.drawable.fr),
        Country("Mexico", TimeZone.of("America/Mexico_City"), Res.drawable.mx),
        Country("Indonesia", TimeZone.of("Asia/Jakarta"), Res.drawable.id),
        Country("Egypt", TimeZone.of("Africa/Cairo"), Res.drawable.eg)
    )

    @Composable
    @Preview
    fun App(countries: List<Country> = defaultCountries) {
        MaterialTheme {
            var showCountries by remember { mutableStateOf(false) }
            var timeAtLocation by remember { mutableStateOf("No location selected") }

            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(
                    timeAtLocation,
                    style = TextStyle(fontSize = 20.sp),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().align(Alignment.CenterHorizontally)
                )
                Row(modifier = Modifier.padding(start = 20.dp, top = 10.dp)) {
                    DropdownMenu(
                        expanded = showCountries,
                        onDismissRequest = { showCountries = false }
                    ) {
                        countries.forEach { (name, zone, image) ->
                            DropdownMenuItem(
                                text = { Row(verticalAlignment = Alignment.CenterVertically) {
                                    Image(
                                        painterResource(image),
                                        modifier = Modifier.size(50.dp).padding(end = 10.dp),
                                        contentDescription = "$name flag"
                                    )
                                    Text(name)
                                } },
                                onClick = {
                                    timeAtLocation = currentTimeAt(name, zone)
                                    showCountries = false
                                }
                            )
                        }
                    }
                }

                Button(modifier = Modifier.padding(start = 20.dp, top = 10.dp),
                    onClick = { showCountries = !showCountries }) {
                    Text("Select Location")
                }
            }
        }
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true"  collapsed-title="data class Country(val name: String, val zone: TimeZone, val image: DrawableResource)"}

    *   `Country`型は、関連する画像へのパスを格納します。
    *   `App`に渡される国のリストにはこれらのパスが含まれます。
    *   `App`は、各`DropdownMenuItem`に`Image`を表示し、その後に国名の`Text`コンポーザブルを表示します。
    *   各`Image`はデータをフェッチするために`Painter`オブジェクトを必要とします。

5.  IDEの指示に従って、不足している依存関係をインポートします。
6.  アプリケーションを実行して、新しい動作を確認します。

<Tabs>
    <TabItem id="mobile-flags" title="AndroidとiOS">
        <img src="first-compose-project-on-android-ios-8.png" alt="AndroidとiOSにおけるCompose Multiplatformアプリの国旗" width="500"/>
    </TabItem>
    <TabItem id="desktop-flags" title="デスクトップ">
        <img src="first-compose-project-on-desktop-9.png" alt="デスクトップにおけるCompose Multiplatformアプリの国旗" width="350"/>
    </TabItem>
</Tabs>

> プロジェクトの最終状態は、[GitHubリポジトリ](https://github.com/kotlin-hands-on/get-started-with-cm/)で確認できます。
>
{style="note"}

## 次のステップ

マルチプラットフォーム開発をさらに探求し、より多くのプロジェクトを試すことをお勧めします。

*   [Androidアプリをクロスプラットフォーム化する](multiplatform-integrate-in-existing-app.md)
*   [KtorとSQLDelightを使用したマルチプラットフォームアプリを作成する](multiplatform-ktor-sqldelight.md)
*   [UIをネイティブに保ちながらiOSとAndroid間でビジネスロジックを共有する](multiplatform-create-first-app.md)
*   [Kotlin/WasmでCompose Multiplatformアプリを作成する](https://kotlinlang.org/docs/wasm-get-started.html)
*   [サンプルプロジェクトの厳選されたリストを見る](multiplatform-samples.md)

コミュニティに参加しましょう:

*   ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**: [リポジトリ](https://github.com/JetBrains/compose-multiplatform)をスターして貢献しましょう
*   ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**: [招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受け取り、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加しましょう
*   ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**: ["kotlin-multiplatform"タグ](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)を購読しましょう
*   ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTubeチャンネル**: [Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C)に関するビデオを購読して視聴しましょう