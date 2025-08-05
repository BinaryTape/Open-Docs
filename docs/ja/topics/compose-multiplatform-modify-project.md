[//]: # (title: プロジェクトを修正する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に手順を進めることができます。両IDEは同じコア機能とKotlin Multiplatformのサポートを共有しています。</p>
    <br/>
    <p>これは「<strong>共有ロジックとUIを持つCompose Multiplatformアプリを作成する</strong>」チュートリアルの第3部です。進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="compose-multiplatform-create-first-app.md">Compose Multiplatformアプリを作成する</a><br/>
       <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="compose-multiplatform-explore-composables.md">コンポーザブルコードを探索する</a><br/>
       <img src="icon-3.svg" width="20" alt="Third step"/> <strong>プロジェクトを修正する</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 独自のアプリケーションを作成する<br/>
    </p>
</tldr>

Kotlin Multiplatformウィザードによって生成されたコードを修正し、`App`コンポーザブル内に現在の日付を表示しましょう。これを行うには、プロジェクトに新しい依存関係を追加し、UIを拡張し、各プラットフォームでアプリケーションを再実行します。

## 新しい依存関係を追加する

プラットフォーム固有のライブラリと[期待される/実際の宣言 (expected and actual declarations)](multiplatform-expect-actual.md)を使用して日付を取得することもできます。しかし、このアプローチはKotlin Multiplatformライブラリが利用できない場合にのみ使用することをお勧めします。この場合は、[kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime)ライブラリに頼ることができます。

> あなたのターゲットプラットフォームで利用可能なKotlin Multiplatformライブラリは、JetBrainsが提供するマルチプラットフォームライブラリ発見のための実験的な検索サービスである[klibs.io](https://klibs.io/)で探索できます。
>
{style="tip"}

`kotlinx-datetime`ライブラリを使用するには：

1.  `composeApp/build.gradle.kts`ファイルを開き、プロジェクトへの依存関係として追加します。

    ```kotlin
    kotlin {
        // ...
        sourceSets {
            // ...
            commonMain.dependencies {
                // ...
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%")
            }
            wasmJsMain.dependencies {
                implementation(npm("@js-joda/timezone", "2.22.0"))
            }
        }
    }
    
    ```

    *   主な依存関係は、共通コードのソースセットを設定するセクションに追加されます。
    *   簡単にするため、バージョン番号はバージョンカタログに追加されずに直接含まれています。
    *   Webターゲットでのタイムゾーンをサポートするために、必要なnpmパッケージへの参照が`wasmJsMain`の依存関係に含まれています。

2.  依存関係を追加すると、プロジェクトの再同期を促されます。「**Sync Gradle Changes**」ボタンをクリックしてGradleファイルを同期します。 ![Synchronize Gradle files](gradle-sync.png){width=50}

3.  **Terminal**ツールウィンドウで、次のコマンドを実行します。

    ```shell
    ./gradlew kotlinUpgradeYarnLock
    ```

    このGradleタスクは、`yarn.lock`ファイルが最新の依存関係バージョンで更新されることを保証します。

## ユーザーインターフェースを拡張する

1.  `composeApp/src/commonMain/kotlin/App.kt`ファイルを開き、現在の日付を含む文字列を返す次の関数を追加します。

    ```kotlin
    fun todaysDate(): String {
        fun LocalDateTime.format() = toString().substringBefore('T')
    
        val now = Clock.System.now()
        val zone = TimeZone.currentSystemDefault()
        return now.toLocalDateTime(zone).format()
    }
    ```

2.  同じファイル内で、この関数を呼び出して結果を表示する`Text()`コンポーザブルを含むように`App()`コンポーザブルを修正します。
   
    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var showContent by remember { mutableStateOf(false) }
            val greeting = remember { Greeting().greet() }
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Today's date is ${todaysDate()}",
                    modifier = Modifier.padding(20.dp),
                    fontSize = 24.sp,
                    textAlign = TextAlign.Center
                )
                Button(onClick = { showContent = !showContent }) {
                    Text("Click me!")
                }
                AnimatedVisibility(showContent) {
                    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                        Image(painterResource(Res.drawable.compose_multiplatform), null)
                        Text("Compose: $greeting")
                    }
                }
            }
        }
    }
    ```

3.  不足している依存関係をインポートするために、IDEの提案に従ってください。
    `todaysDate()`関数のすべての不足している依存関係が`kotlinx.datetime`パッケージからインポートされていることを確認してください。**NOT** `kotlin.time`です。

    ![Unresolved references](compose-unresolved-references.png)

4.  Webアプリがコンテナとして`Element`を使用するのを、外部から指定された`id`を持つHTML要素を使用するように切り替えます。

    1.  `composeApp/src/wasmJsMain/resources/index.html`ファイルで、`<body>`内に名前付き要素を追加します。

        ```html
        <body>
        <div id="composeApplication" style="width:400px; height: 600px;"></div>
        </body>
        ```
    2.  `composeApp/src/wasmJsMain/kotlin/main.kt`ファイルで、`ComposeViewport`の呼び出しを、HTMLファイルで指定したIDを指す`String`バリアントに変更します。

        ```kotlin
        @OptIn(ExperimentalComposeUiApi::class)
        fun main() {
            ComposeViewport(viewportContainerId = "composeApplication") {
                App()
            }
        }
        ```

## アプリケーションを再実行する

Android、iOS、デスクトップ、およびWeb用の同じ実行構成を使用して、アプリケーションを再実行できるようになりました。

<tabs>
    <tab id="mobile-app" title="AndroidとiOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="First Compose Multiplatform app on Android and iOS" width="500"/>
    </tab>
    <tab id="desktop-app" title="デスクトップ">
        <img src="first-compose-project-on-desktop-2.png" alt="First Compose Multiplatform app on desktop" width="400"/>
    </tab>
    <tab id="web-app" title="Web">
        <img src="first-compose-project-on-web-2.png" alt="First Compose Multiplatform app on web" width="400"/>
    </tab>
</tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage1).
>
{style="tip"}
-->

## 次のステップ

チュートリアルの次のパートでは、新しいCompose Multiplatformのコンセプトを学び、ゼロから独自のアプリケーションを作成します。

**[次のパートに進む](compose-multiplatform-new-project.md)**

## ヘルプ

*   **Kotlin Slack**。[招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受け取り、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlin issue tracker**。[新しいイシューを報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。