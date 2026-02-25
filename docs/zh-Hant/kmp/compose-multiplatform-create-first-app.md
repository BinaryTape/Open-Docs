[//]: # (title: 建立您的 Compose Multiplatform 應用程式)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行 —— 這兩個 IDE 共享相同的核心功能與 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是<strong>使用共享邏輯與 UI 建立 Compose Multiplatform 應用程式</strong>教學的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="第一步"/> <strong>建立您的 Compose Multiplatform 應用程式</strong><br/>
        <img src="icon-2-todo.svg" width="20" alt="第二步"/> 探索可組合程式碼 <br/>
        <img src="icon-3-todo.svg" width="20" alt="第三步"/> 修改專案 <br/>      
        <img src="icon-4-todo.svg" width="20" alt="第四步"/> 建立您自己的應用程式 <br/>
    </p>
</tldr>

在此，您將學習如何使用 IntelliJ IDEA 建立並執行您的第一個 Compose Multiplatform 應用程式。

透過 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) UI 架構，您可以將 Kotlin Multiplatform 的程式碼共享能力擴展到應用程式邏輯之外。您可以實作一次使用者介面，然後將其用於 Compose Multiplatform 支援的所有平台。

在本教學中，您將建置一個可在 Android、iOS、桌面與 Web 上執行的範例應用程式。為了建立使用者介面，您將使用 Compose Multiplatform 架構並學習其基礎知識：可組合函式（composable function）、主題、版面配置、事件與修飾符（modifier）。

本教學中需要注意的事項：
* 不需要具備 Compose Multiplatform、Android 或 iOS 的經驗。我們建議您在開始之前先熟悉 [Kotlin 基礎知識](https://kotlinlang.org/docs/getting-started.html)。
* 要完成本教學，您只需要 IntelliJ IDEA。它允許您嘗試 Android 和桌面平台的多平台開發。對於 iOS，您將需要一台安裝了 Xcode 的 macOS 電腦。這是 iOS 開發的一般限制。
* 如果您願意，可以只選擇您感興趣的特定平台，並忽略其他平台。

## 建立專案

1. 在[快速入門指南](quickstart.md)中，完成[設定您的 Kotlin Multiplatform 開發環境](quickstart.md#set-up-the-environment)的指示。
2. 在 IntelliJ IDEA 中，選取 **File** | **New** | **Project**。
3. 在左側面板中，選取 **Kotlin Multiplatform**。

    > 如果您沒有使用 Kotlin Multiplatform IDE 外掛程式，您可以使用 [KMP Web 精靈](https://kmp.jetbrains.com/?android=true&ios=true&iosui=compose&desktop=true&web=true&includeTests=true)產生相同的專案。
    >
    {style="note"}

4. 在 **New Project** 視窗中指定以下欄位：

    * **Name**: ComposeDemo
    * **Group**: compose.project
    * **Artifact**: demo

    > 如果使用 Web 精靈，請將 "ComposeDemo" 指定為 **Project Name**，將 "compose.project.demo" 指定為 **Project ID**。
    >
    {style="note"}

5. 選取 **Android**、**iOS**、**Desktop** 和 **Web** 目標。
    確保 iOS 和 Web 選取了 **Share UI** 選項。
6. 指定所有欄位與目標後，按一下 **Create**（Web 精靈中為 **Download**）。

   ![建立 Compose Multiplatform 專案](create-compose-multiplatform-project.png){width=800}

## 檢查專案結構

在 IntelliJ IDEA 中，導覽至 `ComposeDemo` 資料夾。
如果您在精靈中沒有選取 iOS，則不會有名稱為 "ios" 或 "apple" 開頭的資料夾。

> IDE 可能會自動建議將專案中的 Android Gradle 外掛程式升級至最新版本。
> 我們不建議升級，因為 Kotlin Multiplatform 與最新的 AGP 版本不相容
>（請參閱 [相容性表格](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)）。
>
{style="note"}

該專案包含兩個模組：

* _composeApp_ 是一個 Kotlin 模組，包含 Android、桌面、iOS 和 Web 應用程式之間共享的邏輯 —— 即您用於所有平台的程式碼。它使用 [Gradle](https://kotlinlang.org/docs/gradle.html) 作為建置系統，協助您自動化建置過程。
* _iosApp_ 是一個 Xcode 專案，可建置為 iOS 應用程式。它相依於並將共享模組作為 iOS 框架使用。

  ![Compose Multiplatform 專案結構](compose-project-structure.png)

**composeApp** 模組由以下原始碼集組成：`androidMain`、`commonMain`、`iosMain`、`jsMain`、`jvmMain`、`wasmJsMain` 和 `webMain`（如果您選擇包含測試，則還有 `commonTest`）。
「原始碼集」是一個 Gradle 概念，指邏輯上分組在一起的若干檔案，其中每個組都有自己的相依性。在 Kotlin Multiplatform 中，不同的原始碼集可以針對不同的平台。

`commonMain` 原始碼集使用通用 Kotlin 程式碼，而平台原始碼集使用針對每個目標的特定 Kotlin 程式碼：

* `jvmMain` 是桌面的原始碼檔案，使用 Kotlin/JVM。
* `androidMain` 也使用 Kotlin/JVM。
* `iosMain` 使用 Kotlin/Native。
* `jsMain` 使用 Kotlin/JS。
* `wasmJsMain` 使用 Kotlin/Wasm。
* `webMain` 是 Web [中間原始碼集](multiplatform-hierarchy.md#manual-configuration)，包含 `jsMain` 和 `wasmJsMain`。

當共享模組建置為 Android 程式庫時，通用的 Kotlin 程式碼會被視為 Kotlin/JVM。當它建置為 iOS 框架時，通用的 Kotlin 程式碼會被視為 Kotlin/Native。當共享模組建置為 Web 應用程式時，通用的 Kotlin 程式碼可以被視為 Kotlin/Wasm 和 Kotlin/JS。

![通用 Kotlin、Kotlin/JVM 與 Kotlin/Native](module-structure.svg){width=700}

通常情況下，盡可能將您的實作撰寫為通用程式碼，而不是在特定平台的原始碼集中重複功能。

在 `composeApp/src/commonMain/kotlin` 目錄中，開啟 `App.kt` 檔案。它包含 `App()` 函式，實作了一個極簡但完整的 Compose Multiplatform UI：

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

您可以在 Android、iOS、桌面與 Web 上執行應用程式。您不需要按任何特定順序執行應用程式，因此請從您最熟悉的平台開始。

> 您不需要使用 Gradle 建置任務。在多平台應用程式中，這將建置所有支援目標的偵錯版本與發佈版本。根據在 Multiplatform 精靈中選取的平台，這可能會花費一些時間。
> 使用執行組態會快得多；在這種情況下，僅會建置選取的目標。
>
{style="tip"}

### 在 Android 上執行您的應用程式

1. 在執行組態清單中，選取 **composeApp**。
2. 選擇您的 Android 虛擬裝置，然後按一下 **Run**：如果選取的虛擬裝置已關閉，您的 IDE 會啟動它並執行應用程式。

![在 Android 上執行 Compose Multiplatform 應用程式](compose-run-android.png){width=350}

![Android 上的第一個 Compose Multiplatform 應用程式](first-compose-project-on-android-1.png){width=300}

<snippet id="run_android_other_devices">

#### 在不同的 Android 模擬裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何 [配置 Android 模擬器並在不同的模擬裝置上執行您的應用程式](https://developer.android.com/studio/run/emulator#runningapp)。

#### 在實體 Android 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何 [配置並連接硬體裝置並在其上執行您的應用程式](https://developer.android.com/studio/run/device)。

</snippet>

### 在 iOS 上執行您的應用程式

如果您尚未在初始設定中啟動過 Xcode，請在執行 iOS 應用程式之前先啟動。

在 IntelliJ IDEA 的執行組態清單中選取 **iosApp**，在執行組態旁選取模擬裝置，然後按一下 **Run**。
如果您清單中沒有可用的 iOS 配置，請新增一個 [新的執行組態](#run-on-a-new-ios-simulated-device)。

![在 iOS 上執行 Compose Multiplatform 應用程式](compose-run-ios.png){width=350}

![iOS 上的第一個 Compose Multiplatform 應用程式](first-compose-project-on-ios-1.png){width=300}

<snippet id="run_ios_other_devices">

#### 在新的 iOS 模擬裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

如果您想在模擬裝置上執行應用程式，您可以新增一個新的執行組態。

1. 在執行組態清單中，按一下 **Edit Configurations**。

   ![編輯執行組態](ios-edit-configurations.png){width=450}

2. 按一下組態清單上方的 **+** 按鈕，然後選取 **Xcode Application**。

   ![iOS 應用程式的新執行組態](ios-new-configuration.png)

3. 為您的組態命名。
4. 選取 **Working directory**。為此，請導覽至您的專案（例如 **KotlinMultiplatformSandbox**）中的 `iosApp` 資料夾。

5. 按一下 **Run** 以在新的模擬裝置上執行您的應用程式。

#### 在實體 iOS 裝置上執行 {initial-collapse-state="collapsed" collapsible="true"}

您可以在實體 iOS 裝置上執行您的多平台應用程式。在開始之前，您需要設定與您的 [Apple ID](https://support.apple.com/en-us/HT204316) 關聯的團隊 ID（Team ID）。

##### 設定您的團隊 ID

要在專案中設定團隊 ID，您可以使用 IntelliJ IDEA 中的 KDoctor 工具，或是在 Xcode 中選擇您的團隊。

使用 KDoctor：

1. 在 IntelliJ IDEA 的終端機中執行以下指令：

   ```none
   kdoctor --team-ids 
   ```

   KDoctor 將列出您系統上目前配置的所有團隊 ID，例如：

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2. 在 IntelliJ IDEA 中開啟 `iosApp/Configuration/Config.xcconfig` 並指定您的團隊 ID。

或者，在 Xcode 中選擇團隊：

1. 前往 Xcode 並選取 **Open a project or file**。
2. 導覽至專案的 `iosApp/iosApp.xcworkspace` 檔案。
3. 在左側功能表中選取 `iosApp`。
4. 導覽至 **Signing & Capabilities**。
5. 在 **Team** 清單中，選取您的團隊。

   如果您尚未設定團隊，請使用 **Team** 清單中的 **Add an Account** 選項，並按照 Xcode 指示操作。

6. 確保套件識別碼（Bundle Identifier）是唯一的，且簽署憑證已成功指派。

##### 執行應用程式

使用傳輸線連接您的 iPhone。如果您已經在 Xcode 中註冊過該裝置，IntelliJ IDEA 應該會將其顯示在執行組態清單中。執行對應的 `iosApp` 組態。

如果您尚未在 Xcode 中註冊您的 iPhone，請遵循 [Apple 建議](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)。簡而言之，您應該：

1. 使用傳輸線連接您的 iPhone。
2. 在您的 iPhone 上，於 **設定** | **隱私權與安全性** 中啟用開發者模式。
3. 在 Xcode 中，前往頂部功能表並選擇 **視窗 (Window)** | **裝置與模擬器 (Devices and Simulators)**。
4. 按一下加號。選取您連接的 iPhone 並按一下 **Add**。
5. 使用您的 Apple ID 登入以啟用裝置上的開發能力。
6. 按照螢幕上的指示完成配對程序。

在 Xcode 中註冊 iPhone 後，在 IntelliJ IDEA 中 [建立一個新的執行組態](#run-on-a-new-ios-simulated-device)，並在 **Execution target** 清單中選取您的裝置。執行對應的 `iosApp` 組態。

</snippet>

### 在桌面上執行您的應用程式

在執行組態清單中選取 **composeApp [desktop]**，然後按一下 **Run**。預設情況下，該執行組態會在自己的作業系統視窗中啟動桌面應用程式：

![在桌面上執行 Compose Multiplatform 應用程式](compose-run-desktop.png){width=350}

![桌面上的第一個 Compose Multiplatform 應用程式](first-compose-project-on-desktop-1.png){width=500}

### 執行您的 Web 應用程式

1. 在執行組態清單中，選取：

   * **composeApp[js]**: 執行您的 Kotlin/JS 應用程式。
   * **composeApp[wasmJs]**: 執行您的 Kotlin/Wasm 應用程式。

   ![在 Web 上執行 Compose Multiplatform 應用程式](web-run-configuration.png){width=400}

2. 按一下 **Run**。

Web 應用程式會自動在您的瀏覽器中開啟。
或者，當執行完成時，您可以在瀏覽器中輸入以下 URL：

```shell
   http://localhost:8080/
```
> 連接埠號碼可能會有所不同，因為 8080 連接埠可能無法使用。
> 您可以在 Gradle 建置主控台中找到實際的連接埠號碼。
>
{style="tip"}

![Compose Web 應用程式](first-compose-project-on-web.png){width=600}

#### Web 目標的相容性模式

您可以為您的 Web 應用程式啟用相容性模式，以確保其開箱即可在所有瀏覽器上運作。
在這種模式下，現代瀏覽器使用 Wasm 版本，而較舊的瀏覽器則回退到 JS 版本。
此模式是透過對 `js` 與 `wasmJs` 目標進行交叉編譯（cross-compilation）來實現的。

要為您的 Web 應用程式啟用相容性模式：

1. 選取 **View | Tool Windows | Gradle** 開啟 Gradle 工具視窗。
2. 在 **composedemo | Tasks | compose** 中，選取並執行 **composeCompatibilityBrowserDistribution** 任務。

   > 您至少需要 Java 11 作為您的 Gradle JVM 才能成功載入任務，我們通常建議在 Compose Multiplatform 專案中使用至少 JetBrains Runtime 17。
   >
   {style="note"}

   ![執行相容性任務](web-compatibility-gradle-task.png){width=500}

   或者，您可以在終端機中從 `ComposeDemo` 根目錄執行以下指令：

    ```bash
    ./gradlew composeCompatibilityBrowserDistribution
    ```

一旦 Gradle 任務完成，相容的產物會產生在
`composeApp/build/dist/composeWebCompatibility/productionExecutable` 目錄中。
您可以使用這些產物來[發佈您的應用程式](https://kotlinlang.org/docs/wasm-get-started.html#publish-the-application)，使其在 `js` 和 `wasmJs` 目標上都能運作。

## 下一步

在教學的下一部分中，您將學習如何實作可組合函式並在每個平台上啟動您的應用程式。

**[繼續前往下一部分](compose-multiplatform-explore-composables.md)**

## 取得協助

* **Kotlin Slack**。取得 [邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入
  [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[回報新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。