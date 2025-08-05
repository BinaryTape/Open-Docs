[//]: # (title: 修改專案)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行，這兩個 IDE 都具備相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是**使用共享邏輯和 UI 建立 Compose Multiplatform 應用程式**教學的第三部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="compose-multiplatform-create-first-app.md">建立您的 Compose Multiplatform 應用程式</a><br/>
       <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="compose-multiplatform-explore-composables.md">探索可組合程式碼</a><br/>
       <img src="icon-3.svg" width="20" alt="第三步"/> <strong>修改專案</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> 建立您自己的應用程式<br/>
    </p>
</tldr>

讓我們修改 Kotlin Multiplatform 精靈產生的程式碼，並在 `App`
可組合函式中顯示當前日期。為此，您將為專案新增一個依賴項，增強使用者介面，並在每個平台上重新執行應用程式。

## 新增依賴項

您可以使用平台特定的函式庫以及 [預期與實際宣告](multiplatform-expect-actual.md) 來取得日期。
但我們建議您僅在沒有可用的 Kotlin Multiplatform 函式庫時才使用這種方法。在這種情況下，
您可以依賴 [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) 函式庫。

> 您可以在 [klibs.io](https://klibs.io/) 上探索適用於您目標平台的 Kotlin Multiplatform 函式庫，
> 這是 JetBrains 用於探索多平台函式庫的實驗性搜尋服務。
>
{style="tip"}

若要使用 `kotlinx-datetime` 函式庫：

1. 開啟 `composeApp/build.gradle.kts` 檔案並將其新增為專案的依賴項。

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

    * 主要依賴項已新增到配置通用程式碼原始碼集的部分。
    * 為求簡潔，版本號碼直接包含在內，而不是新增到版本目錄中。
    * 為支援網路目標中的時區，已將必要 npm 套件的引用包含在 `wasmJsMain`
     依賴項中。

2. 依賴項新增後，系統將提示您重新同步專案。點擊 **Sync Gradle Changes** 按鈕以同步 Gradle 檔案： ![同步 Gradle 檔案](gradle-sync.png){width=50}

3. 在 **Terminal** 工具視窗中，執行以下指令：

    ```shell
    ./gradlew kotlinUpgradeYarnLock
    ```

   此 Gradle 任務可確保 `yarn.lock` 檔案使用最新的依賴項版本進行更新。

## 增強使用者介面

1. 開啟 `composeApp/src/commonMain/kotlin/App.kt` 檔案並新增以下函式，該函式會傳回包含當前日期的字串：

   ```kotlin
   fun todaysDate(): String {
       fun LocalDateTime.format() = toString().substringBefore('T')

       val now = Clock.System.now()
       val zone = TimeZone.currentSystemDefault()
       return now.toLocalDateTime(zone).format()
   }
   ```

2. 在同一個檔案中，修改 `App()` 可組合函式，以包含呼叫此函式並顯示結果的 `Text()` 可組合函式：
   
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

3. 依照 IDE 的建議匯入缺少的依賴項。
   請確保從 `kotlinx.datetime` 套件匯入 `todaysDate()` 函式所有缺少的依賴項，**而不是** `kotlin.time`。

   ![未解析的引用](compose-unresolved-references.png)

4. 將網頁應用程式從使用 `Element` 作為容器切換為使用帶有外部指定 `id` 的 HTML 元素：

    1. 在 `composeApp/src/wasmJsMain/resources/index.html` 檔案中，在 `<body>` 內新增一個命名元素：

        ```html
        <body>
        <div id="composeApplication" style="width:400px; height: 600px;"></div>
        </body>
        ```
    2. 在 `composeApp/src/wasmJsMain/kotlin/main.kt` 檔案中，將 `ComposeViewport` 呼叫更改為 `String` 變體，
        指向您在 HTML 檔案中指定的 ID：

        ```kotlin
        @OptIn(ExperimentalComposeUiApi::class)
        fun main() {
            ComposeViewport(viewportContainerId = "composeApplication") {
                App()
            }
        }
        ```

## 重新執行應用程式

您現在可以使用 Android、iOS、桌面和網路的相同執行配置重新執行應用程式：

<tabs>
    <tab id="mobile-app" title="Android 與 iOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="Android 與 iOS 上的第一個 Compose Multiplatform 應用程式" width="500"/>
    </tab>
    <tab id="desktop-app" title="桌面">
        <img src="first-compose-project-on-desktop-2.png" alt="桌面上的第一個 Compose Multiplatform 應用程式" width="400"/>
    </tab>
    <tab id="web-app" title="網路">
        <img src="first-compose-project-on-web-2.png" alt="網路上的第一個 Compose Multiplatform 應用程式" width="400"/>
    </tab>
</tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage1).
>
{style="tip"}
-->

## 下一步

在教學的下一個部分中，您將學習新的 Compose Multiplatform 概念並從頭開始建立您自己的應用程式。

**[繼續到下一部分](compose-multiplatform-new-project.md)**

## 取得協助

* **Kotlin Slack**。取得 [邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入
  [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[回報新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。