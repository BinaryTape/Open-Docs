[//]: # (title: プロジェクトの変更)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルでは IntelliJ IDEA を使用しますが、Android Studio でも同様に進めることができます。どちらの IDE もコア機能と Kotlin Multiplatform サポートを共有しています。</p>
    <br/>
    <p>これは「<strong>共有ロジックと UI を備えた Compose Multiplatform アプリの作成</strong>」チュートリアルの第 3 パートです。先に進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">Compose Multiplatform アプリの作成</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="Second step"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the second part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">コンポーザブルコードの探索</Links><br/>
       <img src="icon-3.svg" width="20" alt="Third step"/> <strong>プロジェクトの変更</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 独自のアプリケーションの作成<br/>
    </p>
</tldr>

Kotlin Multiplatform ウィザードで生成されたコードを変更し、`App` コンポーザブル内に現在の日付を表示してみましょう。これを行うには、プロジェクトに新しい依存関係を追加し、UI を強化して、各プラットフォームでアプリケーションを再実行します。

## 新しい依存関係の追加

プラットフォーム固有のライブラリと [expected and actual 宣言](multiplatform-expect-actual.md)を使用して日付を取得することもできます。しかし、Kotlin Multiplatform ライブラリが利用できない場合にのみ、そのアプローチを使用することをお勧めします。このケースでは、[kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) ライブラリを利用できます。

> [klibs.io](https://klibs.io/) では、ターゲットプラットフォームで利用可能な Kotlin Multiplatform ライブラリを探索できます。これはマルチプラットフォームライブラリを見つけるための JetBrains による実験的な検索サービスです。
>
{style="tip"}

`kotlinx-datetime` ライブラリを使用するには：

1. `composeApp/build.gradle.kts` ファイルを開き、プロジェクトに依存関係を追加します。

    * 共通コードのソースセット（source set）を構成するセクションに、メインの `kotlinx-datetime` 依存関係を追加します。簡略化のため、バージョンカタログに追加する代わりに、バージョン番号を直接含めることができます。
    * Web ターゲットの場合、タイムゾーンのサポートには `js-joda` ライブラリが必要です。`webMain` の依存関係に `js-joda` npm パッケージへの参照を追加します。
      
    ```kotlin
    kotlin {
        // ...
        sourceSets {
            // ...
            commonMain.dependencies {
                // ...
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%")
            }
            webMain.dependencies {
                implementation(npm("@js-joda/timezone", "2.22.0"))
            }
        }
    }
    
    ```
    
2. 依存関係が追加されると、プロジェクトの再同期を求められます。**Sync Gradle Changes** ボタンをクリックして、Gradle ファイルを同期します。 ![Gradle ファイルの同期](gradle-sync.png){width=50}

3. **Terminal** ツールウィンドウで、次のコマンドを実行します。

    ```shell
    ./gradlew kotlinUpgradeYarnLock kotlinWasmUpgradeYarnLock
    ```

   この Gradle タスクにより、`yarn.lock` ファイルが最新の依存関係バージョンで更新されます。
 
4. `webMain` ソースセットで、`@JsModule` アノテーションを使用して `js-joda` npm パッケージをインポートします。 

    ```kotlin
    import androidx.compose.ui.ExperimentalComposeUiApi
    import androidx.compose.ui.window.ComposeViewport
    import kotlin.js.ExperimentalWasmJsInterop
    import kotlin.js.JsModule

    @OptIn(ExperimentalWasmJsInterop::class)
    @JsModule("@js-joda/timezone")
    external object JsJodaTimeZoneModule
    
    private val jsJodaTz = JsJodaTimeZoneModule
    
    @OptIn(ExperimentalComposeUiApi::class)
    fun main() {
        ComposeViewport {
            App()
        }
    }
    ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title='@JsModule("@js-joda/timezone")'}

## ユーザーインターフェースの強化

1. `composeApp/src/commonMain/kotlin/App.kt` ファイルを開き、現在の日付を含む文字列を返す次の関数を追加します。

   ```kotlin
   fun todaysDate(): String {
       fun LocalDateTime.format() = toString().substringBefore('T')

       val now = Clock.System.now()
       val zone = TimeZone.currentSystemDefault()
       return now.toLocalDateTime(zone).format()
   }
   ```
2. IDE によって提案されるインポートを追加します。`Clock` クラスは `kotlinx.datetime` **ではなく** `kotlin.time` からインポートするようにしてください。 
3. 同じファイルで、この関数を呼び出して結果を表示する `Text()` コンポーザブルを含むように `App()` コンポーザブルを変更します。
   
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

4. IDE の提案に従って、不足している依存関係をインポートします。
   更新されたパッケージから `todaysDate()` 関数の不足しているすべての依存関係をインポートしていることを確認し、IDE からプロンプトが表示された場合はオプトイン（opt in）してください。

   ![未解決の参照](compose-unresolved-references.png)

## アプリケーションの再実行

Android、iOS、デスクトップ、および Web で同じ実行構成を使用して、[アプリケーションを再実行](compose-multiplatform-create-first-app.md#run-your-application)できるようになりました。

<Tabs>
    <TabItem id="mobile-app" title="Android および iOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="Android および iOS 上の最初の Compose Multiplatform アプリ" width="500"/>
    </TabItem>
    <TabItem id="desktop-app" title="デスクトップ">
        <img src="first-compose-project-on-desktop-2.png" alt="デスクトップ上の最初の Compose Multiplatform アプリ" width="400"/>
    </TabItem>
    <TabItem id="web-app" title="Web">
        <img src="first-compose-project-on-web-2.png" alt="Web 上の最初の Compose Multiplatform アプリ" width="400"/>
    </TabItem>
</Tabs>

## 次のステップ

チュートリアルの次のパートでは、新しい Compose Multiplatform の概念を学び、独自のアプリケーションをゼロから作成します。

**[次のパートへ進む](compose-multiplatform-new-project.md)**

## ヘルプの参照

* **Kotlin Slack**: [招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受け取り、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) チャンネルに参加してください。
* **Kotlin イシュートラッカー**: [新しい問題を報告](https://youtrack.jetbrains.com/newIssue?project=KT)してください。