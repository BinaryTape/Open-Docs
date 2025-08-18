[//]: # (title: プロジェクトの修正)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同様に進めることができます。両IDEは同じコア機能とKotlin Multiplatformのサポートを共有しています。</p>
    <br/>
    <p>これは「**共有ロジックとUIを持つCompose Multiplatformアプリの作成**」チュートリアルの3番目のパートです。進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">Compose Multiplatformアプリを作成する</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="Second step"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the second part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">コンポーザブルコードを探索する</Links><br/>
       <img src="icon-3.svg" width="20" alt="Third step"/> <strong>プロジェクトを修正する</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 独自のアプリケーションを作成する<br/>
    </p>
</tldr>

Kotlin Multiplatformウィザードによって生成されたコードを修正し、`App`コンポーザブル内に現在の日付を表示しましょう。これを行うには、プロジェクトに新しい依存関係を追加し、UIを強化し、各プラットフォームでアプリケーションを再実行します。

## 新しい依存関係を追加する

プラットフォーム固有のライブラリと[expect/actual宣言](multiplatform-expect-actual.md)を使用して日付を取得することもできます。しかし、このアプローチはKotlin Multiplatformライブラリが利用できない場合にのみ使用することをお勧めします。この場合は、[kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime)ライブラリを使用できます。

> ターゲットプラットフォームで利用可能なKotlin Multiplatformライブラリは、マルチプラットフォームライブラリを発見するためのJetBrainsの実験的な検索サービスである[klibs.io](https://klibs.io/)で探索できます。
>
{style="tip"}

`kotlinx-datetime`ライブラリを使用するには:

1. `composeApp/build.gradle.kts`ファイルを開き、それをプロジェクトの依存関係として追加します。

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
    *   簡潔にするため、バージョン番号はバージョンカタログに追加する代わりに直接含まれています。
    *   Webターゲットでタイムゾーンをサポートするために、必要なnpmパッケージへの参照が`wasmJsMain`依存関係に含まれます。

2. 依存関係が追加されると、プロジェクトの再同期を促されます。**Sync Gradle Changes**ボタンをクリックしてGradleファイルを同期します。 ![Synchronize Gradle files](gradle-sync.png){width=50}

3. **Terminal**ツールウィンドウで、以下のコマンドを実行します。

    ```shell
    ./gradlew kotlinUpgradeYarnLock
    ```

   このGradleタスクにより、`yarn.lock`ファイルが最新の依存関係バージョンで更新されます。

## ユーザーインターフェースを強化する

1. `composeApp/src/commonMain/kotlin/App.kt`ファイルを開き、現在の日付を含む文字列を返す以下の関数を追加します。

   ```kotlin
   fun todaysDate(): String {
       fun LocalDateTime.format() = toString().substringBefore('T')

       val now = Clock.System.now()
       val zone = TimeZone.currentSystemDefault()
       return now.toLocalDateTime(zone).format()
   }
   ```

2. 同じファイルで、`App()`コンポーザブルを修正し、この関数を呼び出して結果を表示する`Text()`コンポーザブルを含めます。
   
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

3. IDEの提案に従って、不足している依存関係をインポートします。
   `todaysDate()`関数の不足しているすべての依存関係を`kotlin.time` **ではなく**、`kotlinx.datetime`パッケージからインポートするようにしてください。

   ![Unresolved references](compose-unresolved-references.png)

4. Webアプリのコンテナとして`Element`を使用するのを、外部で指定された`id`を持つHTML要素を使用するように切り替えます。

    1. `composeApp/src/wasmJsMain/resources/index.html`ファイルで、`<body>`内に名前付き要素を追加します。

        ```html
        <body>
        <div id="composeApplication" style="width:400px; height: 600px;"></div>
        </body>
        ```
    2. `composeApp/src/wasmJsMain/kotlin/main.kt`ファイルで、`ComposeViewport`の呼び出しを、HTMLファイルで指定したIDを指す`String`バリアントに変更します。

        ```kotlin
        @OptIn(ExperimentalComposeUiApi::class)
        fun main() {
            ComposeViewport(viewportContainerId = "composeApplication") {
                App()
            }
        }
        ```

## アプリケーションを再実行する

Android、iOS、デスクトップ、およびWebの同じ実行設定を使用して、アプリケーションを再実行できるようになりました。

<Tabs>
    <TabItem id="mobile-app" title="Android と iOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="First Compose Multiplatform app on Android and iOS" width="500"/>
    </TabItem>
    <TabItem id="desktop-app" title="デスクトップ">
        <img src="first-compose-project-on-desktop-2.png" alt="First Compose Multiplatform app on desktop" width="400"/>
    </TabItem>
    <TabItem id="web-app" title="Web">
        <img src="first-compose-project-on-web-2.png" alt="First Compose Multiplatform app on web" width="400"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage1).
>
{style="tip"}
-->

## 次のステップ

チュートリアルの次のパートでは、新しいCompose Multiplatformの概念を学び、最初から独自のアプリケーションを作成します。

**[次のパートに進む](compose-multiplatform-new-project.md)**

## ヘルプ

*   **Kotlin Slack**。[招待状を受け取り](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlin課題トラッカー**。[新しい課題を報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。