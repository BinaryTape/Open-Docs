---
title: "直接整合 (Direct integration)"
---
:::info

   這是一種本地整合方法。 如果符合以下條件，它對您有效：<br/>

   * 您已經在本地機器上設定了以 iOS 為目標的 Kotlin Multiplatform 專案。
   * 您的 Kotlin Multiplatform 專案沒有 CocoaPods 依賴項。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview)

:::

如果您想同時開發 Kotlin Multiplatform 專案和 iOS 專案，並在它們之間共享程式碼，則可以使用特殊腳本設定直接整合。

此腳本會自動執行將 Kotlin framework 連接到 Xcode 中 iOS 專案的過程：

<img src="/img/direct-integration-scheme.svg" alt="Direct integration diagram" width="700" style={{verticalAlign: 'middle'}}/>

該腳本使用專為 Xcode 環境設計的 `embedAndSignAppleFrameworkForXcode` Gradle task。
在設定過程中，您會將其添加到 iOS 應用程式構建的 Run Script Phase（執行腳本階段）。 之後，Kotlin artifact（成品）會在執行 iOS 應用程式構建之前構建並包含在衍生資料中。

一般來說，腳本會：

* 將編譯後的 Kotlin framework 複製到 iOS 專案結構中的正確目錄中。
* 處理嵌入式 framework 的程式碼簽署過程。
* 確保 Kotlin framework 中的程式碼變更反映在 Xcode 的 iOS 應用程式中。

## 如何設定

如果您目前使用 CocoaPods plugin 連接您的 Kotlin framework，請先遷移。
如果您的專案沒有 CocoaPods 依賴項，請[跳過此步驟](#connect-the-framework-to-your-project)。

### 從 CocoaPods plugin 遷移

若要從 CocoaPods plugin 遷移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或使用
   <shortcut>Cmd + Shift + K</shortcut> 快捷鍵來清除構建目錄。
2. 在包含 `Podfile` 檔案的目錄中，執行以下命令：

    ```none
   pod deintegrate
   ```

3. 從您的 `build.gradle(.kts)` 檔案中移除 `cocoapods {}` 區塊。
4. 刪除 `.podspec` 和 `Podfile` 檔案。

### 將 framework 連接到您的專案

若要將從 multiplatform 專案產生的 Kotlin framework 連接到您的 Xcode 專案：

1. 只有在宣告了 `binaries.framework` configuration option 時，`embedAndSignAppleFrameworkForXcode` task 才會註冊。 在您的 Kotlin Multiplatform 專案中，檢查 `build.gradle.kts` 檔案中的 iOS target declaration（目標宣告）。
2. 在 Xcode 中，雙擊專案名稱以開啟 iOS 專案設定。
3. 在專案設定的 **Build Phases** 標籤上，點擊 **+** 並選擇 **New Run Script Phase**。

   <img src="/img/xcode-run-script-phase-1.png" alt="Add run script phase" width="700" style={{verticalAlign: 'middle'}}/>

4. 調整以下腳本，然後將結果複製到 Run Script Phase（執行腳本階段）：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * 在 `cd` 命令中，指定 Kotlin Multiplatform 專案的根目錄路徑，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 命令中，指定共享模組的名稱，例如 `:shared` 或 `:composeApp`。

   <img src="/img/xcode-run-script-phase-2.png" alt="Add the script" width="700" style={{verticalAlign: 'middle'}}/>

5. 將 **Run Script** 階段拖曳到 **Compile Sources** 階段之前。

   <img src="/img/xcode-run-script-phase-3.png" alt="Drag the Run Script phase" width="700" style={{verticalAlign: 'middle'}}/>

6. 在 **Build Settings** 標籤上，停用 **Build Options** 下的 **User Script Sandboxing** 選項：

   <img src="/img/disable-sandboxing-in-xcode-project-settings.png" alt="User Script Sandboxing" width="700" style={{verticalAlign: 'middle'}}/>

   > 如果您在未先停用沙箱的情況下構建了 iOS 專案，則可能需要重新啟動 Gradle daemon。
   > 停止可能已被沙箱化的 Gradle daemon 程式：
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > 

7. 在 Xcode 中構建專案。 如果一切設定正確，專案將成功構建。

:::note
如果您有與預設 `Debug` 或 `Release` 不同的自訂構建配置，請在 **Build Settings** 標籤上，在 **User-Defined** 下新增 `KOTLIN_FRAMEWORK_BUILD_TYPE` 設定，並將其設定為 `Debug` 或 `Release`。

:::

## 接下來是什麼？

在使用 Swift Package Manager 時，您也可以利用本地整合。 [了解如何在本地套件中新增對 Kotlin framework 的依賴](multiplatform-spm-local-integration)。