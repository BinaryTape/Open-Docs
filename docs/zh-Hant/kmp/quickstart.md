[//]: # (title: Kotlin Multiplatform 快速入門)

<web-summary>JetBrains 為 IntelliJ IDEA 和 Android Studio 提供官方 Kotlin IDE 支援。</web-summary>

透過本教學，您可以讓一個簡單的 Kotlin Multiplatform 應用程式快速啟動並運行。

## 設定環境

Kotlin Multiplatform (KMP) 專案需要特定的環境，
但大多數要求會透過 IDE 中的預檢清楚說明。

從 IDE 和必要的插件開始：

1. 選擇並安裝 IDE。
    IntelliJ IDEA 和 Android Studio 都支援 Kotlin Multiplatform，因此您可以使用您偏好的 IDE。
    
    [JetBrains Toolbox App](https://www.jetbrains.com/toolbox/app/) 是安裝 IDE 的推薦工具。
    它允許您管理多個產品或版本，包括
    [搶先體驗計畫](https://www.jetbrains.com/resources/eap/) (EAP) 和每夜發佈 (Nightly releases)。

    對於獨立安裝，請下載 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 
    或 [Android Studio](https://developer.android.com/studio) 的安裝程式。

    Kotlin Multiplatform 所需的插件至少需要
    **IntelliJ IDEA 2025.2.2** 或 **Android Studio Otter 2025.2.1**。

2. 安裝 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)
    (不要與 Kotlin Multiplatform Gradle 插件混淆)。
    
3. 為 IntelliJ IDEA 安裝 Kotlin Multiplatform IDE 插件也會安裝所有必要的依賴項（如果您尚未安裝它們）
    (Android Studio 已綁定所有必要的插件)。
    
4. 如果您尚未設定 `ANDROID_HOME` 環境變數，請配置您的系統以識別它：

    <Tabs>
    <TabItem title= "Bash 或 Zsh">
   
    將以下命令新增到您的 `.profile` 或 `.zprofile` 中：
        
    ```shell
    export ANDROID_HOME=~/Library/Android/sdk
    ```
   
    </TabItem>
    <TabItem title= "Windows PowerShell 或 CMD">

    對於 PowerShell，您可以使用以下命令新增一個持久環境變數
    （詳情請參閱 [PowerShell 文件](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)）：

    ```shell
    [Environment]::SetEnvironmentVariable('ANDROID_HOME', '<path to the SDK>', 'Machine')
    ```

    對於 CMD，請使用 [`setx`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/setx) 命令：
    
    ```shell
    setx ANDROID_HOME "<path to the SDK>"
    ```
    </TabItem>
    </Tabs>

5. 若要建立 iOS 應用程式，您需要一台安裝了 [Xcode](https://apps.apple.com/us/app/xcode/id497799835) 的 macOS 主機。
    您的 IDE 將在底層運行 Xcode 以建構 iOS 框架。

    在開始使用 KMP 專案之前，請確保至少啟動一次 Xcode，以便它完成
    初始設定。

    > 每次 Xcode 更新時，您都需要手動啟動它並下載更新的工具。
    > Kotlin Multiplatform IDE 插件會執行預檢，當 Xcode 狀態不正確而無法工作時會提醒您。
    >
    {style="note"}

## 建立專案 

<Tabs>
<TabItem title= "IntelliJ IDEA">

使用 IDE 精靈建立新的 KMP 專案：

1. 在主選單中選擇 **檔案** | **新增** | **專案**。
2. 在左側列表中選擇 **Kotlin Multiplatform**。
3. 根據需要設定專案的名稱、位置和其他基本屬性。
4. 我們建議選擇一個版本的 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)
   (JBR) 作為您專案的 JDK，因為它提供了重要的修復，特別是為了提高
   桌面 KMP 應用程式的相容性。
   每個 IntelliJ IDEA 發行版中都包含相關版本的 JBR，因此無需額外設定。
5. 選擇您希望作為專案一部分的平台：
    * 所有目標平台都可以設定為從一開始就使用 Compose Multiplatform 共用 UI 代碼
      （不包含 UI 代碼的伺服器模組除外）。
    * 對於 iOS，您可以選擇兩種實作方式之一：
        * 共用 UI 代碼，使用 Compose Multiplatform，
        * 完全原生的 UI，使用 SwiftUI 製作並與具有共用邏輯的 Kotlin 模組連接。
    * 桌面目標包含 [Compose Hot Reload](compose-hot-reload.md) 功能的 Beta 版本，它允許您在更改相應代碼後立即看到 UI 變更。
      即使您不打算製作桌面應用程式，您可能也會想使用桌面版本來加速
      編寫 UI 代碼。

選擇完平台後，點擊 **建立 (Create)** 按鈕，等待 IDE 生成並匯入專案。

![IntelliJ IDEA Wizard with default settings and Android, iOS, desktop, and web platforms selected](idea-wizard-1step.png){width=600}

</TabItem>
<TabItem title= "Android Studio">

Kotlin Multiplatform IDE 插件嚴重依賴 K2 功能，沒有它將無法如描述般運作。
因此，在開始之前，請確保 K2 模式已啟用：
**設定** | **語言與框架** | **Kotlin** | **啟用 K2 模式**。

使用 IDE 精靈建立新的 KMP 專案：

1. 在主選單中選擇 **檔案** | **新增** | **新增專案**。
2. 在預設的 **手機和平板** 範本類別中選擇 **Kotlin Multiplatform**。

    ![First new project step in Android Studio](as-wizard-1.png){width="400"}

3. 根據需要設定專案的名稱、位置和其他基本屬性，然後點擊 **下一步 (Next)**。
4. 選擇您希望作為專案一部分的平台：
    * 所有目標平台都可以設定為從一開始就使用 Compose Multiplatform 共用 UI 代碼
      （不包含 UI 代碼的伺服器模組除外）。
    * 對於 iOS，您可以選擇兩種實作方式之一： 
      * 共用 UI 代碼，使用 Compose Multiplatform，
      * 完全原生的 UI，使用 SwiftUI 製作並與具有共用邏輯的 Kotlin 模組連接。  
    * 桌面目標包含 [Compose Hot Reload](compose-hot-reload.md) 功能的 Beta 版本，它允許您在更改相應代碼後立即看到 UI 變更。
      即使您不打算製作桌面應用程式，您可能也會想使用桌面版本來加速
      編寫 UI 代碼。
5. 當專案生成後，我們建議選擇一個版本的 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)
   (JBR) 作為您專案的 JDK，因為它提供了重要的修復，特別是為了提高
   桌面 KMP 應用程式的相容性。
   每個 IntelliJ IDEA 發行版中都包含相關版本的 JBR，因此無需額外設定。

選擇完平台後，點擊 **完成 (Finish)** 按鈕，等待 IDE 生成並匯入專案。

![Last step in the Android Studio wizard with Android, iOS, desktop, and web platforms selected](as-wizard-3step.png){width=600}

</TabItem>
</Tabs>

## 諮詢預檢

您可以透過打開 **專案環境預檢 (Project Environment Preflight Checks)** 工具視窗來確保專案設定沒有環境問題：
點擊右側邊欄或底部工具欄上的預檢圖示 ![Preflight checks icon with a plane](ide-preflight-checks.png){width="20"}

在此工具視窗中，您可以查看與這些檢查相關的訊息、重新運行它們或更改其設定。 

預檢命令也可在 **隨處搜尋 (Search Everywhere)** 對話框中找到。
按下雙擊 <shortcut>Shift</shortcut> 並搜尋包含「preflight」一詞的命令：

![The Search Everywhere menu with the word "preflight" entered](double-shift-preflight-checks.png){width=600}

## 運行範例應用程式

IDE 精靈建立的專案包括為 iOS、Android、
桌面和 Web 應用程式生成的運行配置，以及運行伺服器應用程式的 Gradle 任務。
每個平台的具體 Gradle 命令如下所列。

<Tabs>
<TabItem title="Android">

若要運行 Android 應用程式，請啟動 **composeApp** 運行配置：

![Dropdown with the Android run configuration highlighted](run-android-configuration.png){width=250}

若要手動建立 Android 運行配置，請選擇 **Android 應用程式 (Android App)** 作為運行配置範本，
並選擇模組 **[專案名稱].composeApp**。

預設情況下，它會在第一個可用的虛擬裝置上運行：

![Android app ran on a virtual device](run-android-app.png){width=300}

</TabItem>
<TabItem title="iOS">

> 您需要 macOS 主機才能建構 iOS 應用程式。
>
{style="note"}

如果您為專案選擇了 iOS 目標並設定了安裝 Xcode 的 macOS 機器，
您可以選擇 **iosApp** 運行配置並選擇一個模擬裝置：

![Dropdown with the iOS run configuration highlighted](run-ios-configuration.png){width=250}

當您運行 iOS 應用程式時，它會在底層使用 Xcode 建構，並在 iOS 模擬器中啟動。
首次建構會收集編譯所需的原生依賴項，並為後續運行預熱建構：

![iOS app ran on a virtual device](run-ios-app.png){width=350}

</TabItem>
<TabItem title="桌面">

桌面應用程式的預設運行配置建立為 **composeApp [desktop]**：

![Dropdown with the default desktop run configuration highlighted](run-desktop-configuration.png){width=250}

若要手動建立桌面運行配置，請選擇 **Gradle** 運行配置範本，並將其指向
**[應用程式名稱]:composeApp** Gradle 專案，並使用以下命令：

```shell
desktopRun -DmainClass=com.example.myapplication.MainKt --quiet
```

透過此配置，您可以運行 JVM 桌面應用程式：

![JVM app ran on a virtual device](run-desktop-app.png){width=600}

</TabItem>
<TabItem title="Web">

Web 應用程式的預設運行配置建立為 **composeApp [wasmJs]**：

![Dropdown with the default Wasm run configuration highlighted](run-wasm-configuration.png){width=250}

若要手動建立 Web 運行配置，請選擇 **Gradle** 運行配置範本，並將其指向
**[應用程式名稱]:composeApp** Gradle 專案，並使用以下命令：

```shell
wasmJsBrowserDevelopmentRun
```

當您運行此配置時，IDE 會建構 Kotlin/Wasm 應用程式並在預設瀏覽器中打開它：

![Web app ran on a virtual device](run-wasm-app.png){width=600}

</TabItem>
</Tabs>

## 疑難排解

### Java 和 JDK

Java 的常見問題：

*   某些工具可能找不到要運行的 Java 版本或使用了錯誤的版本。
    為了解決這個問題：
    *   將 `JAVA_HOME` 環境變數設定為安裝了適當 JDK 的目錄。
  
      > 我們建議使用 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)，
      > 這是一個支援類別重新定義的 OpenJDK 分支。
      >
      {style="note"}
  
    *   將 `JAVA_HOME` 內的 `bin` 資料夾路徑附加到 `PATH` 變數中，
      以便 JDK 中包含的工具可在終端機中使用。
*   如果您在 Android Studio 中遇到 Gradle JDK 的問題，請確保其配置正確：
    選擇 **設定** | **建構、執行、部署** | **建構工具** | **Gradle**。

### Android 工具

與 JDK 相同，如果您在啟動 `adb` 等 Android 工具時遇到問題，
請確保將 `ANDROID_HOME/tools`、`ANDROID_HOME/tools/bin` 和
`ANDROID_HOME/platform-tools` 的路徑新增到您的 `PATH` 環境變數中。

### Xcode

如果您的 iOS 運行配置報告沒有可運行的虛擬裝置，或者預檢失敗，請確保啟動 Xcode
並查看 iOS 模擬器是否有任何更新。

### 獲取協助

*   **Kotlin Slack**。獲取 [邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
*   **Kotlin Multiplatform 工具問題追蹤器**。[回報新問題](https://youtrack.jetbrains.com/newIssue?project=KMT)。

## 接下來

了解更多關於 KMP 專案結構和編寫共用代碼的資訊：
*   一系列關於使用共用 UI 代碼的教學：[建立您的 Compose Multiplatform 應用程式](compose-multiplatform-create-first-app.md)
*   一系列關於將共用代碼與原生 UI 結合使用的教學：[建立您的 Kotlin Multiplatform 應用程式](multiplatform-create-first-app.md)
*   深入了解 Kotlin Multiplatform 文件：
    *   [專案配置](multiplatform-project-configuration.md)
    *   [使用多平台依賴項](https://kotlinlang.org/docs/multiplatform-add-dependencies.html)
*   了解 Compose Multiplatform UI 框架、其基礎知識和平台特定功能：
    [Compose Multiplatform 和 Jetpack Compose](compose-multiplatform-and-jetpack-compose.md)。

探索已為 KMP 編寫的代碼：
*   我們的 [範例](multiplatform-samples.md) 頁面，包含 JetBrains 官方範例以及展示 KMP 功能的精選專案列表。
*   GitHub 主題：
    *   [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform)，使用 Kotlin Multiplatform 實作的專案。
    *   [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample)，
        使用 KMP 編寫的範例專案列表。
*   [klibs.io](https://klibs.io) – KMP 函式庫搜尋平台，迄今已索引超過 2000 個函式庫，
    包括 OkHttp、Ktor、Coil、Koin、SQLDelight 等。