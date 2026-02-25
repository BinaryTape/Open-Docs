[//]: # (title: 修改專案)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行 —— 這兩款 IDE 共享相同的核心功能與 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是<strong>使用共享邏輯與 UI 建立 Compose Multiplatform 應用程式</strong>教學的第三部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行 —— 這兩款 IDE 共享相同的核心功能與 Kotlin Multiplatform 支援。這是使用共享邏輯與 UI 建立 Compose Multiplatform 應用程式教學的第一部分。建立您的 Compose Multiplatform 應用程式、探索 composable 程式碼、修改專案、建立您自己的應用程式">建立您的 Compose Multiplatform 應用程式</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="第二步"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行 —— 這兩款 IDE 共享相同的核心功能與 Kotlin Multiplatform 支援。這是使用共享邏輯與 UI 建立 Compose Multiplatform 應用程式教學的第二部分。在繼續之前，請確保您已完成先前的步驟。建立您的 Compose Multiplatform 應用程式、探索 composable 程式碼、修改專案、建立您自己的應用程式">探索 composable 程式碼</Links><br/>
       <img src="icon-3.svg" width="20" alt="第三步"/> <strong>修改專案</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> 建立您自己的應用程式<br/>
    </p>
</tldr>

讓我們修改由 Kotlin Multiplatform 精靈產生的程式碼，並在 `App` composable 中顯示目前日期。為此，您將向專案新增一個新的相依性、強化 UI，並在各個平台上重新執行應用程式。

## 新增相依性

您可以使用平台特定（platform-specific）的程式庫以及 [expected 與 actual 宣告](multiplatform-expect-actual.md)來取得日期。但我們建議僅在沒有可用的 Kotlin Multiplatform 程式庫時才使用此方法。在這種情況下，您可以依賴 [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) 程式庫。

> 您可以在 [klibs.io](https://klibs.io/) 上探索適用於目標平台的 Kotlin Multiplatform 程式庫，這是 JetBrains 推出的一項用於探索多平台程式庫的實驗性搜尋服務。
>
{style="tip"}

要使用 `kotlinx-datetime` 程式庫：

1. 開啟 `composeApp/build.gradle.kts` 檔案並將相依性新增至專案：

    * 將主要的 `kotlinx-datetime` 相依性新增至配置通用程式碼原始碼集（common code source set）的部分。為了簡單起見，您可以直接包含版本號，而不是將其新增至版本目錄（version catalog）。
    * 對於 Web 目標，時區支援需要 `js-joda` 程式庫。在 `webMain` 相依性中新增對 `js-joda` npm 套件的參照。
      
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
    
2. 新增相依性後，系統會提示您重新同步專案。點擊 **Sync Gradle Changes** 按鈕以同步 Gradle 檔案：![同步 Gradle 檔案](gradle-sync.png){width=50}

3. 在 **終端** 工具視窗中，執行以下指令：

    ```shell
    ./gradlew kotlinUpgradeYarnLock kotlinWasmUpgradeYarnLock
    ```

   此 Gradle 任務可確保 `yarn.lock` 檔案更新為最新的相依性版本。
 
4. 在 `webMain` 原始碼集中，使用 `@JsModule` 註解來匯入 `js-joda` npm 套件： 

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

## 強化使用者介面

1. 開啟 `composeApp/src/commonMain/kotlin/App.kt` 檔案並新增以下函式，該函式會傳回包含目前日期的字串：

   ```kotlin
   fun todaysDate(): String {
       fun LocalDateTime.format() = toString().substringBefore('T')

       val now = Clock.System.now()
       val zone = TimeZone.currentSystemDefault()
       return now.toLocalDateTime(zone).format()
   }
   ```
2. 新增 IDE 建議的匯入。請確保從 `kotlin.time` 匯入 `Clock` 類別，而**不是**從 `kotlinx.datetime` 匯入。 
3. 在同一檔案中，修改 `App()` composable 以包含呼叫此函式並顯示結果的 `Text()` composable：
   
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

4. 依照 IDE 的建議匯入缺失的相依性。請確保從更新後的套件中匯入 `todaysDate()` 函式所有缺失的相依性，並在 IDE 提示時選擇加入（opt in）。

   ![未解決的參照](compose-unresolved-references.png)

## 重新執行應用程式

您現在可以針對 Android、iOS、桌面版和 Web 使用相同的執行配置 [重新執行應用程式](compose-multiplatform-create-first-app.md#run-your-application)：

<Tabs>
    <TabItem id="mobile-app" title="Android 與 iOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="在 Android 與 iOS 上的第一個 Compose Multiplatform 應用程式" width="500"/>
    </TabItem>
    <TabItem id="desktop-app" title="桌面版">
        <img src="first-compose-project-on-desktop-2.png" alt="在桌面版上的第一個 Compose Multiplatform 應用程式" width="400"/>
    </TabItem>
    <TabItem id="web-app" title="Web">
        <img src="first-compose-project-on-web-2.png" alt="在 Web 上的第一個 Compose Multiplatform 應用程式" width="400"/>
    </TabItem>
</Tabs>

## 下一步

在教學的下一部分中，您將學習新的 Compose Multiplatform 概念，並從頭開始建立您自己的應用程式。

**[前往下一部分](compose-multiplatform-new-project.md)**

## 取得協助

* **Kotlin Slack**。取得 [邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[回報新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。