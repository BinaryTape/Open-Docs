[//]: # (title: 修改專案)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學課程使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行，這兩種 IDE 都擁有相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是「<strong>使用共用邏輯和 UI 建立 Compose Multiplatform 應用程式</strong>」教學課程的第三部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">建立您的 Compose Multiplatform 應用程式</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="第二步"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the second part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">探索可組合程式碼</Links><br/>
       <img src="icon-3.svg" width="20" alt="第三步"/> <strong>修改專案</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> 建立您自己的應用程式<br/>
    </p>
</tldr>

讓我們修改由 Kotlin Multiplatform 精靈產生的程式碼，並在 `App` composable 中顯示當前日期。為此，您將為專案添加新的依賴項、增強使用者介面，並在每個平台上重新執行應用程式。

## 添加新的依賴項

您可以使用平台特定的函式庫和[預期與實際宣告](multiplatform-expect-actual.md)來擷取日期。但我們建議您僅在沒有可用的 Kotlin Multiplatform 函式庫時才使用此方法。在這種情況下，您可以依賴 [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) 函式庫。

> 您可以在 [klibs.io](https://klibs.io/) 上探索適用於您目標平台的 Kotlin Multiplatform 函式庫，這是 JetBrains 用於發現多平台函式庫的實驗性搜尋服務。
>
{style="tip"}

要使用 `kotlinx-datetime` 函式庫：

1. 開啟 `composeApp/build.gradle.kts` 檔案，並將其添加為專案的依賴項。

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

    * 主要依賴項被添加到了配置通用程式碼原始碼集的區段。
    * 為求簡潔，版本號直接包含在內，而不是添加到版本目錄。
    * 為了在 web 目標中支援時區，必要的 npm 套件參考已包含在 `webMain` 依賴項中。

2. 添加依賴項後，系統會提示您重新同步專案。點擊 **Sync Gradle Changes** 按鈕以同步 Gradle 檔案：![同步 Gradle 檔案](gradle-sync.png){width=50}

3. 在 **Terminal** 工具視窗中，執行以下指令：

    ```shell
    ./gradlew kotlinUpgradeYarnLock kotlinWasmUpgradeYarnLock
    ```

   此 Gradle 任務確保 `yarn.lock` 檔案與最新的依賴項版本同步。

## 增強使用者介面

1. 開啟 `composeApp/src/commonMain/kotlin/App.kt` 檔案，並添加以下函數，該函數會回傳一個包含當前日期的字串：

   ```kotlin
   @OptIn(ExperimentalTime::class)
   fun todaysDate(): String {
       fun LocalDateTime.format() = toString().substringBefore('T')

       val now = Clock.System.now()
       val zone = TimeZone.currentSystemDefault()
       return now.toLocalDateTime(zone).format()
   }
   ```
2. 添加 IDE 建議的匯入。請確保從 `kotlin.time` 匯入 `Clock` 類別，**而不是** `kotlinx.datetime`。
3. 在同一個檔案中，修改 `App()` composable 以包含呼叫此函數並顯示結果的 `Text()` composable：
   
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

4. 按照 IDE 的建議匯入遺失的依賴項。
   請確保從更新的套件匯入 `todaysDate()` 函數的所有遺失依賴項，並在 IDE 提示時選擇加入。

   ![未解析的引用](compose-unresolved-references.png)

## 重新執行應用程式

您現在可以使用相同的[執行設定](compose-multiplatform-create-first-app.md#run-your-application)在 Android、iOS、桌面和網路平台上重新執行應用程式：

<Tabs>
    <TabItem id="mobile-app" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="Android 和 iOS 上的第一個 Compose Multiplatform 應用程式" width="500"/>
    </TabItem>
    <TabItem id="desktop-app" title="桌面">
        <img src="first-compose-project-on-desktop-2.png" alt="桌面上的第一個 Compose Multiplatform 應用程式" width="400"/>
    </TabItem>
    <TabItem id="web-app" title="網路">
        <img src="first-compose-project-on-web-2.png" alt="網路上的第一個 Compose Multiplatform 應用程式" width="400"/>
    </TabItem>
</Tabs>

## 下一步

在本教學課程的下一部分中，您將學習新的 Compose Multiplatform 概念並從頭開始建立您自己的應用程式。

**[繼續前往下一部分](compose-multiplatform-new-project.md)**

## 取得協助

*   **Kotlin Slack**。取得[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
*   **Kotlin 問題追蹤器**。[回報新的問題](https://youtrack.jetbrains.com/newIssue?project=KT)。