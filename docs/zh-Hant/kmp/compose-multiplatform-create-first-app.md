[//]: # (title: 建立你的 Compose Multiplatform 應用程式)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學課程使用 IntelliJ IDEA，但你也可以在 Android Studio 中進行，這兩種 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是「<strong>建立具有共享邏輯和 UI 的 Compose Multiplatform 應用程式</strong>」教學課程的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>建立你的 Compose Multiplatform 應用程式</strong><br/>
        <img src="icon-2-todo.svg" width="20" alt="Second step"/> 探索可組合程式碼 <br/>
        <img src="icon-3-todo.svg" width="20" alt="Third step"/> 修改專案 <br/>      
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 建立你自己的應用程式 <br/>
    </p>
</tldr>

在這裡，你將學習如何使用 IntelliJ IDEA 建立並執行你的第一個 Compose Multiplatform 應用程式。

藉由 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) UI 框架，你可以將 Kotlin Multiplatform 的程式碼共享功能推展到應用程式邏輯之外。你可以實作一次使用者介面，然後將其用於 Compose Multiplatform 支援的所有平台。

在本教學課程中，你將建立一個可在 Android、iOS、桌面和網路上執行的範例應用程式。為了建立使用者介面，你將使用 Compose Multiplatform 框架並學習其基礎知識：可組合函式、主題、排版、事件和修飾符。

本教學課程的注意事項：
*   不需要有 Compose Multiplatform、Android 或 iOS 的經驗。我們建議你在開始之前熟悉 [Kotlin 的基礎知識](https://kotlinlang.org/docs/getting-started.html)。
*   完成本教學課程，你只需要 IntelliJ IDEA。它允許你在 Android 和桌面上嘗試多平台開發。對於 iOS，你需要一台安裝了 Xcode 的 macOS 機器。這是 iOS 開發的一般限制。
*   如果你願意，你可以將選擇限制在你感興趣的特定平台，並省略其他平台。

## 建立專案

1.  在 [快速入門](quickstart.md) 中，完成 [設定 Kotlin Multiplatform 開發環境](quickstart.md#set-up-the-environment) 的說明。
2.  在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
3.  在左側面板中，選擇 **Kotlin Multiplatform**。

    > 如果你沒有使用 Kotlin Multiplatform IDE 外掛程式，你可以使用 [KMP 網路精靈](https://kmp.jetbrains.com/?android=true&ios=true&iosui=compose&desktop=true&web=true&includeTests=true) 生成相同的專案。
    >
    {style="note"}

4.  在 **New Project** 視窗中指定以下欄位：

    *   **Name** (名稱)：ComposeDemo
    *   **Group** (群組)：compose.project
    *   **Artifact** (構件)：demo

    > 如果使用網路精靈，請將「ComposeDemo」指定為 **Project Name** (專案名稱)，將「compose.project.demo」指定為 **Project ID** (專案 ID)。
    >
    {style="note"}

5.  選擇 **Android**、**iOS**、**Desktop** 和 **Web** 目標平台。
    請確保為 iOS 選取了 **Share UI** (共享 UI) 選項。
6.  指定所有欄位和目標平台後，點擊 **Create** (建立) (在網路精靈中為 **Download** (下載))。

   ![Create Compose Multiplatform project](create-compose-multiplatform-project.png){width=800}

## 檢查專案結構

在 IntelliJ IDEA 中，導航到「ComposeDemo」資料夾。
如果你在精靈中沒有選擇 iOS，你就不會有以「ios」或「apple」開頭的資料夾。

> IntelliJ IDEA 可能會自動建議將專案中的 Android Gradle 外掛程式升級到最新版本。
> 我們不建議升級，因為 Kotlin Multiplatform 與最新的 AGP 版本不相容
> (請參閱 [相容性表](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility))。
>
{style="note"}

專案包含兩個模組：

*   _composeApp_ 是一個 Kotlin 模組，包含 Android、桌面、iOS 和 Web 應用程式之間共享的邏輯 — 你用於所有平台的程式碼。它使用 [Gradle](https://kotlinlang.org/docs/gradle.html) 作為建置系統，幫助你自動化建置過程。
*   _iosApp_ 是一個 Xcode 專案，可建置為 iOS 應用程式。它依賴於共享模組並將其作為 iOS 框架使用。

  ![Compose Multiplatform project structure](compose-project-structure.png){width=350}

**composeApp** 模組包含以下源集：`androidMain`、`commonMain`、`desktopMain`、`iosMain` 和 `wasmJsMain`。
_源集_ 是 Gradle 中將多個檔案邏輯分組在一起的概念，其中每個組都有自己的依賴項。在 Kotlin Multiplatform 中，不同的源集可以針對不同的平台。

`commonMain` 源集使用通用的 Kotlin 程式碼，而平台源集使用特定於每個目標的 Kotlin 程式碼。Kotlin/JVM 用於 `androidMain` 和 `desktopMain`。Kotlin/Native 用於 `iosMain`。另一方面，Kotlin/Wasm 用於 `wasmJsMain`。

當共享模組被建置為 Android 函式庫時，通用的 Kotlin 程式碼會被視為 Kotlin/JVM。當它被建置為 iOS 框架時，通用的 Kotlin 程式碼會被視為 Kotlin/Native。當共享模組被建置為 Web 應用程式時，通用的 Kotlin 程式碼會被視為 Kotlin/Wasm。

![Common Kotlin, Kotlin/JVM, and Kotlin/Native](module-structure.png){width=700}

通常，盡可能將你的實作寫成通用程式碼，而不是在平台特定的源集中重複功能。

在 `composeApp/src/commonMain/kotlin` 目錄中，打開 `App.kt` 檔案。它包含 `App()` 函式，實作了一個極簡但完整的 Compose Multiplatform UI：

```kotlin
@Composable
@Preview
fun App() {
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(
            modifier = Modifier
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                    Image(painterResource(Res.drawable.compose_multiplatform), null)
                    Text("Compose: $greeting")
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="fun App()"}

讓我們在所有支援的平台上執行應用程式。

## 執行你的應用程式

你可以在 Android、iOS、桌面和網路上執行應用程式。你無需按特定順序執行應用程式，因此請從你最熟悉的平台開始。

> 你無需使用 Gradle 建置任務。在多平台應用程式中，這將建置所有支援目標的偵錯和發行版本。根據在 Multiplatform 精靈中選擇的平台，這可能需要一些時間。
> 使用執行設定會快得多；在這種情況下，只會建置選定的目標。
>
{style="tip"}

### 在 Android 上執行你的應用程式

1.  在執行設定列表中，選擇 **composeApp**。
2.  選擇你的 Android 虛擬裝置，然後點擊 **Run** (執行)：你的 IDE 會啟動選定的虛擬裝置 (如果它已關閉)，並執行應用程式。

![Run the Compose Multiplatform app on Android](compose-run-android.png){width=350}

![First Compose Multiplatform app on Android](first-compose-project-on-android-1.png){width=300}

<snippet id="run_android_other_devices">

#### 在不同的 Android 模擬裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何 [配置 Android 模擬器並在不同的模擬裝置上執行你的應用程式](https://developer.android.com/studio/run/emulator#runningapp)。

#### 在真實 Android 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何 [配置和連接硬體裝置並在上面執行你的應用程式](https://developer.android.com/studio/run/device)。

</snippet>

### 在 iOS 上執行你的應用程式

如果你尚未在初始設定中啟動 Xcode，請在執行 iOS 應用程式之前執行此操作。

在 IntelliJ IDEA 中，在執行設定列表中選擇 **iosApp**，選擇執行設定旁邊的模擬裝置，然後點擊 **Run** (執行)。
如果列表中沒有可用的 iOS 設定，請新增一個 [新的執行設定](#run-on-a-new-ios-simulated-device)。

![Run the Compose Multiplatform app on iOS](compose-run-ios.png){width=350}

![First Compose Multiplatform app on iOS](first-compose-project-on-ios-1.png){width=300}

<snippet id="run_ios_other_devices">

#### 在新的 iOS 模擬裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

如果你想在模擬裝置上執行應用程式，可以新增一個新的執行設定。

1.  在執行設定列表中，點擊 **Edit Configurations** (編輯設定)。

   ![Edit run configurations](ios-edit-configurations.png){width=450}

2.  點擊設定列表上方的 **+** 按鈕，然後選擇 **Xcode Application**。

   ![New run configuration for iOS application](ios-new-configuration.png)

3.  命名你的設定。
4.  選擇 **Working directory** (工作目錄)。為此，導航到你的專案，例如 **KotlinMultiplatformSandbox**，在 `iosApp` 資料夾中。

5.  點擊 **Run** (執行) 以在新模擬裝置上執行你的應用程式。

#### 在真實 iOS 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

你可以在真實的 iOS 裝置上執行你的多平台應用程式。在開始之前，
你需要設定與你的 [Apple ID](https://support.apple.com/en-us/HT204316) 相關聯的 Team ID。

##### 設定你的 Team ID

要在專案中設定 Team ID，你可以在 IntelliJ IDEA 中使用 KDoctor 工具，或在 Xcode 中選擇你的團隊。

對於 KDoctor：

1.  在 IntelliJ IDEA 中，在終端機中執行以下命令：

   ```none
   kdoctor --team-ids 
   ```

   KDoctor 將列出目前系統上配置的所有 Team ID，例如：

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2.  在 IntelliJ IDEA 中，打開 `iosApp/Configuration/Config.xcconfig` 並指定你的 Team ID。

或者，在 Xcode 中選擇團隊：

1.  前往 Xcode 並選擇 **Open a project or file** (打開專案或檔案)。
2.  導航到你專案的 `iosApp/iosApp.xcworkspace` 檔案。
3.  在左側選單中，選擇 `iosApp`。
4.  導航到 **Signing & Capabilities** (簽署與能力)。
5.  在 **Team** (團隊) 列表中，選擇你的團隊。

   如果你尚未設定你的團隊，請使用 **Team** 列表中的 **Add an Account** (新增帳戶) 選項並依照 Xcode 指示操作。

6.  確保 Bundle Identifier (應用程式套件識別碼) 是唯一的，並且 Signing Certificate (簽署憑證) 已成功分配。

##### 執行應用程式

用傳輸線連接你的 iPhone。如果你已在 Xcode 中註冊該裝置，IntelliJ IDEA 應在執行設定列表中顯示它。執行相應的 `iosApp` 設定。

如果你尚未在 Xcode 中註冊你的 iPhone，請遵循 [Apple 建議](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)。
簡而言之，你應該：

1.  用傳輸線連接你的 iPhone。
2.  在你的 iPhone 上，在 **Settings** (設定) | **Privacy & Security** (隱私與安全性) 中啟用開發者模式。
3.  在 Xcode 中，前往頂部選單並選擇 **Window** (視窗) | **Devices and Simulators** (裝置與模擬器)。
4.  點擊加號。選擇你連接的 iPhone 並點擊 **Add** (新增)。
5.  使用你的 Apple ID 登入以在裝置上啟用開發功能。
6.  遵循螢幕上的指示完成配對過程。

一旦你在 Xcode 中註冊了你的 iPhone，在 IntelliJ IDEA 中 [建立一個新的執行設定](#run-on-a-new-ios-simulated-device)
並在 **Execution target** (執行目標) 列表中選擇你的裝置。執行相應的 `iosApp` 設定。

</snippet>

### 在桌面上執行你的應用程式

在執行設定列表中選擇 **composeApp [desktop]**，然後點擊 **Run** (執行)。預設情況下，執行設定會在自己的作業系統視窗中啟動桌面應用程式：

![Run the Compose Multiplatform app on desktop](compose-run-desktop.png){width=350}

![First Compose Multiplatform app on desktop](first-compose-project-on-desktop-1.png){width=500}

### 執行你的 Web 應用程式

在執行設定列表中選擇 **composeApp [wasmJs]**，然後點擊 **Run** (執行)。

![Run the Compose Multiplatform app on web](compose-run-web.png){width=350}

Web 應用程式會自動在你的瀏覽器中打開。或者，你可以在執行完成後在瀏覽器中輸入以下 URL：

```shell
   http://localhost:8080/
```
> 連接埠號碼可能會有所不同，因為 8080 連接埠可能不可用。
> 你可以在 Gradle 建置控制台中找到實際的連接埠號碼。
>
{style="tip"}

![Compose web application](first-compose-project-on-web.png){width=550}

## 下一步

在本教學課程的下一部分中，你將學習如何實作可組合函式並在每個平台上啟動你的應用程式。

**[繼續前往下一部分](compose-multiplatform-explore-composables.md)**

## 取得協助

*   **Kotlin Slack**。取得 [邀請函](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入
    [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
*   **Kotlin 問題追蹤器**。 [回報新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。