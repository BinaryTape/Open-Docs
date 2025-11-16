[//]: # (title: 建立您的 Compose 多平台應用程式)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學課程使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行操作 – 這兩個 IDE 共享相同的核心功能和 Kotlin 多平台支援。</p>
    <br/>
    <p>這是<strong>建立具有共享邏輯和 UI 的 Compose 多平台應用程式</strong>教學課程的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="第一步"/> <strong>建立您的 Compose 多平台應用程式</strong><br/>
        <img src="icon-2-todo.svg" width="20" alt="第二步"/> 探索可組合程式碼 <br/>
        <img src="icon-3-todo.svg" width="20" alt="第三步"/> 修改專案 <br/>      
        <img src="icon-4-todo.svg" width="20" alt="第四步"/> 建立您自己的應用程式 <br/>
    </p>
</tldr>

在此，您將學習如何使用 IntelliJ IDEA 建立並執行您的第一個 Compose Multiplatform 應用程式。

藉助 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) UI 框架，您可以將 Kotlin Multiplatform 的程式碼共享能力推向應用程式邏輯之外。您可以實作一次使用者介面，然後將其用於 Compose Multiplatform 支援的所有平台。

在本教學課程中，您將建置一個可在 Android、iOS、桌面和網路執行的範例應用程式。為了建立使用者介面，您將使用 Compose Multiplatform 框架並了解其基礎知識：可組合函式、主題、佈局、事件和修飾符。

本教學課程注意事項：
* 無需 Compose Multiplatform、Android 或 iOS 的先前經驗。我們建議您在開始之前熟悉 [Kotlin 基礎知識](https://kotlinlang.org/docs/getting-started.html)。
* 要完成本教學課程，您只需要 IntelliJ IDEA。它允許您在 Android 和桌面版上嘗試多平台開發。對於 iOS，您需要一台安裝了 Xcode 的 macOS 電腦。這是 iOS 開發的一般限制。
* 如果您願意，可以將您的選擇限制在您感興趣的特定平台，並省略其他平台。

## 建立專案

1. 在[快速入門](quickstart.md)中，完成[設定 Kotlin 多平台開發環境](quickstart.md#set-up-the-environment)的說明。
2. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
3. 在左側面板中，選擇 **Kotlin Multiplatform**。

    > 如果您沒有使用 Kotlin Multiplatform IDE 外掛程式，您可以使用 [KMP 網頁精靈](https://kmp.jetbrains.com/?android=true&ios=true&iosui=compose&desktop=true&web=true&includeTests=true)生成相同的專案。
    >
    {style="note"}

4. 在 **New Project** 視窗中指定以下欄位：

    * **Name**：ComposeDemo
    * **Group**：compose.project
    * **Artifact**：demo

    > 如果使用網頁精靈，請將「ComposeDemo」指定為 **Project Name**，將「compose.project.demo」指定為 **Project ID**。
    >
    {style="note"}

5. 選擇 **Android**、**iOS**、**Desktop** 和 **Web** 目標平台。
    確保已選取 iOS 和 Web 的 **Share UI** 選項。
6. 指定所有欄位和目標平台後，點擊 **Create**（在網頁精靈中為 **Download**）。

   ![建立 Compose 多平台專案](create-compose-multiplatform-project.png){width=800}

## 檢查專案結構

在 IntelliJ IDEA 中，導覽至 `ComposeDemo` 資料夾。
如果您在精靈中沒有選擇 iOS，您將不會有以「ios」或「apple」開頭的資料夾。

> IDE 可能會自動建議將專案中的 Android Gradle plugin 升級到最新版本。
> 我們不建議升級，因為 Kotlin Multiplatform 與最新的 AGP 版本不相容
> （請參閱[相容性表格](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)）。
>
{style="note"}

專案包含兩個模組：

* _composeApp_ 是一個 Kotlin 模組，其中包含 Android、桌面、iOS 和網路應用程式之間共享的邏輯 — 您用於所有平台的程式碼。它使用 [Gradle](https://kotlinlang.org/docs/gradle.html) 作為建置系統，可幫助您自動化建置過程。
* _iosApp_ 是一個 Xcode 專案，可建置為一個 iOS 應用程式。它依賴並使用共享模組作為一個 iOS 框架。

  ![Compose 多平台專案結構](compose-project-structure.png)

**composeApp** 模組由以下原始碼集組成：`androidMain`、`commonMain`、`iosMain`、`jsMain`、`jvmMain`、`wasmJsMain` 和 `webMain`（如果您選擇包含測試，則包含 `commonTest`）。
_原始碼集_ 是 Gradle 中將多個檔案邏輯分組在一起的概念，其中每個組都有自己的相依性。在 Kotlin Multiplatform 中，不同的原始碼集可以目標不同的平台。

`commonMain` 原始碼集包含通用 Kotlin 程式碼，而平台原始碼集則包含各目標平台特定的 Kotlin 程式碼：
* `jvmMain` 是用於桌面的原始檔，它使用 Kotlin/JVM。
* `androidMain` 也使用 Kotlin/JVM。
* `iosMain` 使用 Kotlin/Native。
* `jsMain` 使用 Kotlin/JS。
* `wasmJsMain` 使用 Kotlin/Wasm。
* `webMain` 是網頁的[中介原始碼集](multiplatform-hierarchy.md#manual-configuration)，包含 `jsMain` 和 `wasmJsMain`。

當共享模組建置成 Android 函式庫時，通用 Kotlin 程式碼被視為 Kotlin/JVM。當它建置成 iOS 框架時，通用 Kotlin 程式碼被視為 Kotlin/Native。當共享模組建置成網路應用程式時，通用 Kotlin 程式碼可以被視為 Kotlin/Wasm 和 Kotlin/JS。

![通用 Kotlin、Kotlin/JVM 和 Kotlin/Native](module-structure.svg){width=700}

通常，盡可能將您的實作寫成通用程式碼，而不是在平台特定原始碼集中重複功能。

在 `composeApp/src/commonMain/kotlin` 目錄中，開啟 `App.kt` 檔案。它包含 `App()` 函式，該函式實作一個簡約但完整的 Compose Multiplatform UI：

```kotlin
@Composable
@Preview
fun App() {
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(
            modifier = Modifier
                .background(MaterialTheme.colorScheme.primaryContainer)
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
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

## 執行您的應用程式

您可以在 Android、iOS、桌面和網路應用程式上執行。您不必以任何特定順序執行應用程式，因此從您最熟悉的平台開始。

> 您不需要使用 Gradle 建置任務。在多平台應用程式中，這將建置所有支援目標的偵錯版和發佈版。根據 Multiplatform 精靈中選擇的平台，這可能需要一些時間。
> 使用執行設定要快得多；在這種情況下，只建置選定的目標。
>
{style="tip"}

### 在 Android 上執行您的應用程式

1. 在執行設定清單中，選擇 **composeApp**。
2. 選擇您的 Android 虛擬裝置，然後點擊 **Run**：您的 IDE 會啟動選定的虛擬裝置（如果它已關閉電源），並執行應用程式。

![在 Android 上執行 Compose 多平台應用程式](compose-run-android.png){width=350}

![Android 上的第一個 Compose 多平台應用程式](first-compose-project-on-android-1.png){width=300}

<snippet id="run_android_other_devices">

#### 在不同的 Android 模擬裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何[設定 Android 模擬器並在不同的模擬裝置上執行您的應用程式](https://developer.android.com/studio/run/emulator#runningapp)。

#### 在真實 Android 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何[設定和連接硬體裝置並在其上執行您的應用程式](https://developer.android.com/studio/run/device)。

</snippet>

### 在 iOS 上執行您的應用程式

如果您尚未啟動 Xcode 作為初始設定的一部分，請在執行 iOS 應用程式之前執行此操作。

在 IntelliJ IDEA 中，在執行設定清單中選擇 **iosApp**，選擇執行設定旁邊的模擬裝置，然後點擊 **Run**。
如果清單中沒有可用的 iOS 設定，請新增一個[新的執行設定](#run-on-a-new-ios-simulated-device)。

![在 iOS 上執行 Compose 多平台應用程式](compose-run-ios.png){width=350}

![iOS 上的第一個 Compose 多平台應用程式](first-compose-project-on-ios-1.png){width=300}

<snippet id="run_ios_other_devices">

#### 在新的 iOS 模擬裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

如果您想在模擬裝置上執行應用程式，可以新增一個新的執行設定。

1. 在執行設定清單中，點擊 **Edit Configurations**。

   ![編輯執行設定](ios-edit-configurations.png){width=450}

2. 點擊設定清單上方的 **+** 按鈕，然後選擇 **Xcode Application**。

   ![用於 iOS 應用程式的新執行設定](ios-new-configuration.png)

3. 為您的設定命名。
4. 選擇 **Working directory**。為此，導覽至您的專案，例如 **KotlinMultiplatformSandbox**，在 `iosApp` 資料夾中。

5. 點擊 **Run** 以在新模擬裝置上執行您的應用程式。

#### 在真實 iOS 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

您可以在真實 iOS 裝置上執行您的多平台應用程式。在開始之前，
您需要設定與您的 [Apple ID](https://support.apple.com/en-us/HT204316) 相關聯的 Team ID。

##### 設定您的 Team ID

要在專案中設定 Team ID，您可以使用 IntelliJ IDEA 中的 KDoctor 工具或在 Xcode 中選擇您的團隊。

對於 KDoctor：

1. 在 IntelliJ IDEA 中，在終端機中執行以下命令：

   ```none
   kdoctor --team-ids 
   ```

   KDoctor 將列出目前系統上配置的所有 Team ID，例如：

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2. 在 IntelliJ IDEA 中，開啟 `iosApp/Configuration/Config.xcconfig` 並指定您的 Team ID。

或者，在 Xcode 中選擇團隊：

1. 進入 Xcode 並選擇 **Open a project or file**。
2. 導覽至您專案的 `iosApp/iosApp.xcworkspace` 檔案。
3. 在左側選單中，選擇 `iosApp`。
4. 導覽至 **Signing & Capabilities**。
5. 在 **Team** 清單中，選擇您的團隊。

   如果您尚未設定您的團隊，請使用 **Add an Account** 選項在 **Team** 清單中，並按照 Xcode 指示操作。

6. 確保 Bundle Identifier 是唯一的，並且 Signing Certificate 已成功指派。

##### 執行應用程式

用傳輸線連接您的 iPhone。如果您已在 Xcode 中註冊該裝置，IntelliJ IDEA 應在執行設定清單中顯示它。執行對應的 `iosApp` 設定。

如果您尚未在 Xcode 中註冊您的 iPhone，請遵循 [Apple 建議](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)。
簡而言之，您應該：

1. 用傳輸線連接您的 iPhone。
2. 在您的 iPhone 上，在 **Settings** | **Privacy & Security** 中啟用開發者模式。
3. 在 Xcode 中，前往頂部選單並選擇 **Window** | **Devices and Simulators**。
4. 點擊加號。選擇您連接的 iPhone 並點擊 **Add**。
5. 使用您的 Apple ID 登入以啟用裝置上的開發功能。
6. 按照螢幕上的指示完成配對過程。

在 Xcode 中註冊您的 iPhone 後，在 IntelliJ IDEA 中[建立一個新的執行設定](#run-on-a-new-ios-simulated-device)，並在 **Execution target** 清單中選擇您的裝置。執行對應的 `iosApp` 設定。

</snippet>

### 在桌面執行您的應用程式

在執行設定清單中選擇 **composeApp [desktop]** 並點擊 **Run**。預設情況下，執行設定會在自己的作業系統視窗中啟動桌面應用程式：

![在桌面上執行 Compose 多平台應用程式](compose-run-desktop.png){width=350}

![桌面上的第一個 Compose 多平台應用程式](first-compose-project-on-desktop-1.png){width=500}

### 執行您的網路應用程式

1. 在執行設定清單中，選擇：

   * **composeApp[js]**：執行您的 Kotlin/JS 應用程式。
   * **composeApp[wasmJs]**：執行您的 Kotlin/Wasm 應用程式。

   ![在網頁上執行 Compose 多平台應用程式](web-run-configuration.png){width=400}

2. 點擊 **Run**。

網路應用程式將在您的瀏覽器中自動開啟。或者，當執行完成時，您可以在瀏覽器中輸入以下網址：

```shell
   http://localhost:8080/
```
> 埠號可能會有所不同，因為 8080 埠可能不可用。
> 您可以在 Gradle 建置控制台中找到實際的埠號。
>
{style="tip"}

![Compose 網路應用程式](first-compose-project-on-web.png){width=600}

#### 網頁目標的相容模式

您可以為您的網路應用程式啟用相容模式，以確保它在所有瀏覽器中開箱即用。在此模式下，現代瀏覽器使用 Wasm 版本，而舊版瀏覽器則會回退到 JS 版本。此模式是透過對 `js` 和 `wasmJs` 目標進行交叉編譯來實現的。

若要為您的網路應用程式啟用相容模式：

1. 透過選擇 **View | Tool Windows | Gradle** 來開啟 Gradle 工具視窗。
2. 在 **composedemo | Tasks | compose** 中，選擇並執行 **composeCompatibilityBrowserDistribution** 任務。

   > 您需要至少 Java 11 作為您的 Gradle JVM 才能成功載入任務，我們通常建議 Compose Multiplatform 專案使用至少 JetBrains Runtime 17。
   >
   {style="note"}

   ![執行相容模式任務](web-compatibility-gradle-task.png){width=500}

   或者，您可以從 `ComposeDemo` 根目錄下的終端機執行以下命令：

    ```bash
    ./gradlew composeCompatibilityBrowserDistribution
    ```

Gradle 任務完成後，相容的 artifacts 將在
`composeApp/build/dist/composeWebCompatibility/productionExecutable` 目錄中生成。
您可以使用這些 artifacts 來[發佈您的應用程式](https://kotlinlang.org/docs/wasm-get-started.html#publish-the-application)，
使其同時適用於 `js` 和 `wasmJs` 目標。

## 下一步

在本教學課程的下一部分，您將學習如何實作可組合函式並在每個平台上啟動您的應用程式。

**[繼續前往下一部分](compose-multiplatform-explore-composables.md)**

## 取得幫助

* **Kotlin Slack**。取得[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入
  [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin issue tracker**。[報告新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。