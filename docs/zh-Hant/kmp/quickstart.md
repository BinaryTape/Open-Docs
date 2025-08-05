[//]: # (title: Kotlin Multiplatform 快速入門)

<web-summary>JetBrains 為 IntelliJ IDEA 和 Android Studio 提供官方的 Kotlin IDE 支援。</web-summary>

透過本教學課程，您可以快速讓一個簡單的 Kotlin Multiplatform 應用程式啟動並運行。

## 設定環境

Kotlin Multiplatform (KMP) 專案需要特定的環境，
但大多數要求都會透過 IDE 中的預檢（preflight checks）清楚說明。

從 IDE 和必要的配套外掛程式開始：

1. 選擇並安裝 IDE。
    IntelliJ IDEA 和 Android Studio 都支援 Kotlin Multiplatform，因此您可以使用您偏好的 IDE。

    [JetBrains Toolbox App](https://www.jetbrains.com/toolbox/app/) 是安裝 IDE 的推薦工具。
    它允許您管理多個產品或版本，包括
    [早期存取計畫 (Early Access Program)](https://www.jetbrains.com/resources/eap/) (EAP) 和 Nightly 版本。

    對於獨立安裝，請下載 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
    或 [Android Studio](https://developer.android.com/studio) 的安裝程式。

    Kotlin Multiplatform 所需的外掛程式要求 **IntelliJ IDEA 2025.1.1.1**
    或 **Android Studio Narwhal 2025.1.1**。

2. 安裝 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)
    （請勿與 Kotlin Multiplatform Gradle 外掛程式混淆）。

    > Kotlin Multiplatform 外掛程式尚未在 Windows 或 Linux 上的 IDE 中提供。
    > 但在這些平台上也不是絕對必要：
    > 您仍然可以按照教學課程生成並執行 KMP 專案。
    >
    {style="note"}

3. 為 IntelliJ IDEA 安裝 Kotlin Multiplatform IDE 外掛程式也會安裝所有必要的依賴項（如果尚未安裝的話）
    （Android Studio 已綑綁所有必要的外掛程式）。

    如果您在 Windows 或 Linux 上使用 IntelliJ IDEA，請確保手動安裝所有必要的外掛程式：
    * [Android](https://plugins.jetbrains.com/plugin/22989-android)
    * [Android Design Tools](https://plugins.jetbrains.com/plugin/22990-android-design-tools)
    * [Jetpack Compose](https://plugins.jetbrains.com/plugin/18409-jetpack-compose)
    * [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support)
    * [Compose Multiplatform for Desktop IDE Support](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-for-desktop-ide-support)
      （僅當您沒有 Kotlin Multiplatform 外掛程式時才需要）。

4. 如果您尚未設定 `ANDROID_HOME` 環境變數，請配置您的系統來識別它：

    <tabs>
    <tab title= "Bash 或 Zsh">

    將以下命令添加到您的 `.profile` 或 `.zprofile`：

    ```shell
    export ANDROID_HOME=~/Library/Android/sdk
    ```

    </tab>
    <tab title= "Windows PowerShell 或 CMD">

    對於 PowerShell，您可以使用以下命令添加持久性環境變數
    （詳情請參閱 [PowerShell docs](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)）：

    ```shell
    [Environment]::SetEnvironmentVariable('ANDROID_HOME', '<path to the SDK>', 'Machine')
    ```

    對於 CMD，使用 [`setx`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/setx) 命令：

    ```shell
    setx ANDROID_HOME "<path to the SDK>"
    ```
    </tab>
    </tabs>

5. 要創建 iOS 應用程式，您需要一個安裝了 [Xcode](https://apps.apple.com/us/app/xcode/id497799835) 的 macOS 主機。
    您的 IDE 將在底層運行 Xcode 來建構 iOS 框架。

    在開始使用 KMP 專案之前，請確保至少啟動 Xcode 一次，以便它完成
    初始設定。

    > 每次 Xcode 更新時，您都需要手動啟動它並下載更新的工具。
    > Kotlin Multiplatform IDE 外掛程式會執行預檢，當 Xcode 狀態不對時會提醒您。
    >
    {style="note"}

## 創建專案

### 在 macOS 上

在 macOS 上，Kotlin Multiplatform 外掛程式在 IDE 內部提供了一個專案生成精靈：

<tabs>
<tab title= "IntelliJ IDEA">

使用 IDE 精靈創建一個新的 KMP 專案：

1. 在主菜單中選擇 **File** | **New** | **Project**。
2. 在左側列表中選擇 **Kotlin Multiplatform**。
3. 根據需要設定專案的名稱、位置和其他基本屬性。
4. 我們建議選擇一個版本的 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)
   (JBR) 作為您的專案的 JDK，因為它提供了重要的修復，特別是為了提高桌面 KMP 應用程式的相容性。
   每個 IntelliJ IDEA 發行版都包含相關版本的 JBR，因此無需額外設定。
5. 選擇您希望專案包含的平台：
    * 所有目標平台都可以設定為從一開始就使用 Compose Multiplatform 來共享使用者介面程式碼
      （伺服器模組除外，它沒有使用者介面程式碼）。
    * 對於 iOS，您可以選擇兩種實作方式之一：
        * 共享使用者介面程式碼，使用 Compose Multiplatform，
        * 完全原生使用者介面，使用 SwiftUI 製作並透過共享邏輯連接到 Kotlin 模組。
    * 桌面目標包含 [](compose-hot-reload.md) 功能的 Alpha 版本，它允許您在更改相應程式碼後立即看到使用者介面變更。
      即使您不打算製作桌面應用程式，您可能也希望使用桌面版本來加快
      編寫使用者介面程式碼。

選擇完平台後，點擊 **Create** 按鈕並等待 IDE 生成並匯入專案。

![IntelliJ IDEA 精靈，包含預設設定並選取 Android、iOS、桌面和網路平台](idea-wizard-1step.png){width=800}

</tab>
<tab title= "Android Studio">

Kotlin Multiplatform IDE 外掛程式高度依賴 K2 功能，如果沒有它，將無法按所述運行。
因此，在開始之前，請確保已啟用 K2 模式：
**Settings** | **Languages & Frameworks** | **Kotlin** | **Enable K2 mode**。

使用 IDE 精靈創建一個新的 KMP 專案：

1. 在主菜單中選擇 **File** | **New** | **New project**。
2. 在預設的 **Phone and Tablet** 範本類別中選擇 **Kotlin Multiplatform**。

    ![Android Studio 中的新專案第一步](as-wizard-1.png){width="400"}

3. 根據需要設定專案的名稱、位置和其他基本屬性，然後點擊 **Next**。
4. 選擇您希望專案包含的平台：
    * 所有目標平台都可以設定為從一開始就使用 Compose Multiplatform 來共享使用者介面程式碼
      （伺服器模組除外，它沒有使用者介面程式碼）。
    * 對於 iOS，您可以選擇兩種實作方式之一：
      * 共享使用者介面程式碼，使用 Compose Multiplatform，
      * 完全原生使用者介面，使用 SwiftUI 製作並透過共享邏輯連接到 Kotlin 模組。
    * 桌面目標包含熱重載功能的 Alpha 版本，它允許您在更改相應程式碼後立即看到使用者介面變更。
      即使您不打算製作桌面應用程式，您可能也希望使用桌面版本來加快
      編寫使用者介面程式碼。
5. 專案生成後，我們建議選擇一個版本的 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)
   (JBR) 作為您的專案的 JDK，因為它提供了重要的修復，特別是為了提高桌面 KMP 應用程式的相容性。
   每個 IntelliJ IDEA 發行版都包含相關版本的 JBR，因此無需額外設定。

選擇完平台後，點擊 **Finish** 按鈕並等待 IDE 生成並匯入專案。

![Android Studio 精靈的最後一步，選取 Android、iOS、桌面和網路平台](as-wizard-3step.png){width=800}

</tab>
</tabs>

### 在 Windows 或 Linux 上

如果您在 Windows 或 Linux 上：

1. 使用 [web KMP 精靈](https://kmp.jetbrains.com/)生成專案。
2. 解壓縮封存檔並在您的 IDE 中打開生成的資料夾。
3. 等待匯入完成，然後前往 [](#run-the-sample-apps) 部分了解如何建構和運行應用程式。

## 查閱預檢

您可以透過開啟 **Project Environment Preflight Checks** 工具視窗來確保專案設定沒有環境問題：
點擊右側邊欄或底部工具列上的預檢圖標 ![帶飛機的預檢圖標](ide-preflight-checks.png){width="20"}

在這個工具視窗中，您可以查看與這些檢查相關的訊息、重新執行它們或更改其設定。

預檢命令也可以在 **Search Everywhere** 對話框中找到。
按兩下 <shortcut>Shift</shortcut> 並搜尋包含「preflight」字樣的命令：

![輸入「preflight」字樣後的 Search Everywhere 選單](double-shift-preflight-checks.png)

## 運行範例應用程式

IDE 精靈創建的專案包括為 iOS、Android、
桌面和網路應用程式生成的執行配置，以及用於運行伺服器應用程式的 Gradle 任務。
在 Windows 和 Linux 上，請參閱下面每個平台的 Gradle 命令。

<tabs>
<tab title="Android">

要運行 Android 應用程式，請啟動 **composeApp** 執行配置：

![選取 Android 執行配置的下拉選單](run-android-configuration.png){width=250}

要在 Windows 或 Linux 上運行 Android 應用程式，請創建一個 **Android App** 執行配置
並選擇模組 **[project name].composeApp**。

預設情況下，它會在第一個可用的虛擬裝置上運行：

![在虛擬裝置上運行的 Android 應用程式](run-android-app.png){width=350}

</tab>
<tab title="iOS">

> 您需要 macOS 主機來建構 iOS 應用程式。
>
{style="note"}

如果您為專案選擇了 iOS 目標並設定了帶有 Xcode 的 macOS 機器，
您可以選擇 **iosApp** 執行配置並選擇一個模擬裝置：

![選取 iOS 執行配置的下拉選單](run-ios-configuration.png){width=250}

當您運行 iOS 應用程式時，它會在底層使用 Xcode 進行建構並在 iOS 模擬器中啟動。
首次建構會收集編譯所需的原生依賴項，並為後續運行預熱建構：

![在虛擬裝置上運行的 iOS 應用程式](run-ios-app.png){width=350}

</tab>
<tab title="Desktop">

桌面應用程式的預設執行配置是 **composeApp [desktop]**：

![選取預設桌面執行配置的下拉選單](run-desktop-configuration.png){width=250}

要在 Windows 或 Linux 上運行桌面應用程式，請創建一個 **Gradle** 執行配置，指向
**[app name]:composeApp** Gradle 專案，並使用以下命令：

```shell
desktopRun -DmainClass=com.example.myapplication.MainKt --quiet
```

透過此配置，您可以運行 JVM 桌面應用程式：

![在虛擬裝置上運行的 JVM 應用程式](run-desktop-app.png){width=600}

</tab>
<tab title="Web">

網路應用程式的預設執行配置是 **composeApp [wasmJs]**：

![選取預設 Wasm 執行配置的下拉選單](run-wasm-configuration.png){width=250}

要在 Windows 或 Linux 上運行網路應用程式，請創建一個 **Gradle** 執行配置，指向
**[app name]:composeApp** Gradle 專案，並使用以下命令：

```shell
wasmJsBrowserDevelopmentRun
```

當您運行此配置時，IDE 會建構 Kotlin/Wasm 應用程式並在預設瀏覽器中打開它：

![在虛擬裝置上運行的網路應用程式](run-wasm-app.png){width=600}

</tab>
</tabs>

## 故障排除

### Java 和 JDK

Java 的常見問題：

* 某些工具可能找不到要運行的 Java 版本或使用了錯誤的版本。
  為了解決這個問題：
    * 將 `JAVA_HOME` 環境變數設定為適當 JDK 的安裝目錄。

      > 我們建議使用 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)，
      > 這是支援類別重新定義的 OpenJDK 分支。
      >
      {style="note"}

    * 將 `JAVA_HOME` 內部 `bin` 資料夾的路徑附加到 `PATH` 變數中，
      以便 JDK 中包含的工具在終端中可用。
* 如果您在 Android Studio 中遇到 Gradle JDK 問題，請確保其配置正確：
  選擇 **Settings** | **Build, Execution, Deployment** | **Build Tools** | **Gradle**。

### Android 工具

與 JDK 相同，如果您在啟動 `adb` 等 Android 工具時遇到問題，
請確保將 `ANDROID_HOME/tools`、`ANDROID_HOME/tools/bin` 和
`ANDROID_HOME/platform-tools` 的路徑添加到您的 `PATH` 環境變數中。

### Xcode

如果您的 iOS 執行配置報告沒有虛擬裝置可運行，請務必啟動 Xcode
並查看 iOS 模擬器是否有任何更新。

### 取得協助

* **Kotlin Slack**。取得 [邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin Multiplatform Tooling 問題追蹤器**。[報告新問題](https://youtrack.jetbrains.com/newIssue?project=KMT)。

## 後續步驟

了解 KMP 專案的結構和編寫共享程式碼的更多資訊：
* 關於使用共享使用者介面程式碼的系列教學課程：[](compose-multiplatform-create-first-app.md)
* 關於使用共享程式碼以及原生使用者介面的系列教學課程：[](multiplatform-create-first-app.md)
* 深入了解 Kotlin Multiplatform 文件：
  * [專案配置](multiplatform-project-configuration.md)
  * [使用多平台依賴項](https://kotlinlang.org/docs/multiplatform-add-dependencies.html)
* 了解 Compose Multiplatform 使用者介面框架、其基本原理和平台特定功能：
    [](compose-multiplatform-and-jetpack-compose.md)。

發現已為 KMP 編寫的程式碼：
* 我們的 [範例](multiplatform-samples.md) 頁面，包含官方 JetBrains 範例以及精選的
    展示 KMP 功能的專案列表。
* GitHub 主題：
  * [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform)，用 Kotlin Multiplatform 實作的專案。
  * [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample)，
      用 KMP 編寫的範例專案列表。
* [klibs.io](https://klibs.io) – KMP 函式庫的搜尋平台，迄今已索引超過 2000 個函式庫，
    包括 OkHttp、Ktor、Coil、Koin、SQLDelight 等。