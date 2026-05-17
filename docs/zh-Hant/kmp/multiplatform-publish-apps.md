[//]: # (title: 發佈您的應用程式)

當您的應用程式準備好發佈時，就該透過發佈將其交付給使用者。

對於行動應用程式，每個平台都有多個商店可供選擇。但在本文中，我們將專注於官方商店：
[Google Play Store](https://play.google.com/store) 和 [Apple App Store](https://www.apple.com/ios/app-store/)。對於 Web 應用程式，我們將使用 [GitHub pages](https://pages.github.com/)。

您將學習如何為發佈準備 Kotlin Multiplatform 應用程式，我們也將強調此過程中值得特別注意的部分。

## Android 應用程式

由於 [Kotlin 是 Android 開發的主要語言](https://developer.android.com/kotlin)，Kotlin Multiplatform 對專案編譯和 Android 應用程式的組建沒有明顯影響。從共用模組產生的 Android 程式庫和 Android 應用程式本身都是典型的 Android Gradle 模組；它們與其他 Android 程式庫和應用程式沒有區別。因此，從 Kotlin Multiplatform 專案發佈 Android 應用程式與 [Android 開發人員文件](https://developer.android.com/studio/publish)中描述的一般流程沒有區別。

## iOS 應用程式

Kotlin Multiplatform 專案中的 iOS 應用程式是從典型的 Xcode 專案建置的，因此發佈涉及的主要階段與 [iOS 開發人員文件](https://developer.apple.com/ios/submit/)中所述相同。

> 隨著 2024 年春季 App Store 政策的變更，缺失或不完整的隱私資訊清單可能會導致您的應用程式收到警告甚至被拒絕。
> 有關詳細資訊和解決方案，特別是針對 Kotlin Multiplatform 應用程式，請參閱 [iOS 應用程式的隱私資訊清單](https://kotlinlang.org/docs/apple-privacy-manifest.html)。
>
{style="note"}

Kotlin Multiplatform 專案的特殊之處在於將共用的 Kotlin 模組編譯為架構並將其連結到 Xcode 專案。通常，共用模組與 Xcode 專案之間的整合是由 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)自動完成的。但是，如果您不使用該外掛程式，在 Xcode 中建置和封裝 iOS 專案時請注意以下事項：

* 共用的 Kotlin 程式庫會編譯為原生架構。
* 您需要將為特定平台編譯的架構連接到 iOS 應用程式專案。
* 在 Xcode 專案設定中，指定架構的路徑以便建構系統進行搜尋。
* 建置專案後，您應該啟動並測試應用程式，以確保在執行階段使用架構時沒有問題。

有兩種方法可以將共用的 Kotlin 模組連接到 iOS 專案：
* 使用 [Kotlin CocoaPods Gradle 外掛程式](multiplatform-cocoapods-overview.md)，它允許您將具有原生目標的多平台專案作為 iOS 專案中的 CocoaPods 相依性。
* 手動配置您的 Multiplatform 專案以建立 iOS 架構，並配置 Xcode 專案以獲取其最新版本。
  Kotlin Multiplatform 精靈或 Kotlin Multiplatform IDE 外掛程式通常會處理此配置。
  請參閱[將架構連接到您的 iOS 專案](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)以了解如何在 Xcode 中直接加入架構。

### 配置您的 iOS 應用程式

您可以在不使用 Xcode 的情況下配置影響最終應用程式的基本屬性。

#### Bundle ID

[bundle ID](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier#discussion) 在作業系統中唯一識別您的應用程式。要更改它，請在 Android Studio 中開啟 `iosApp/Configuration/Config.xcconfig` 檔案並更新 `BUNDLE_ID`。

#### 應用程式名稱

應用程式名稱設定目標可執行檔和應用程式 bundle 名稱。要更改您的應用程式名稱：

* 如果您 *尚未* 在 Android Studio 中開啟專案，可以直接在任何文字編輯器中更改 `iosApp/Configuration/Config.xcconfig` 檔案中的 `APP_NAME` 選項。
* 如果您已經在 Android Studio 中開啟了專案，請執行以下操作：

  1. 關閉專案。
  2. 在任何文字編輯器中，更改 `iosApp/Configuration/Config.xcconfig` 檔案中的 `APP_NAME` 選項。
  3. 在 Android Studio 中重新開啟專案。

如果您需要配置其他設定，請使用 Xcode：在 Android Studio 中開啟專案後，在 Xcode 中開啟 `iosApp/iosApp.xcworkspace` 檔案並在該處進行更改。

### 符號化損毀報告

為了幫助開發人員改進他們的應用程式，iOS 提供了分析應用程式損毀的方法。為了進行詳細的損毀分析，它使用特殊的偵錯符號 (`.dSYM`) 檔案，將損毀報告中的記憶體位址與原始碼中的位置（例如函式或行號）進行比對。

預設情況下，從共用 Kotlin 模組產生的 iOS 架構的 Release 版本會附帶一個 `.dSYM` 檔案。這可以幫助您分析共用模組程式碼中發生的損毀。

有關損毀報告符號化的更多資訊，請參閱 [Kotlin/Native 文件](https://kotlinlang.org/docs/native-debugging.html#debug-ios-applications)。

## Web 應用程式

要發佈您的 Web 應用程式，請建立包含組成應用程式的編譯檔案和資源的構件。這些構件是將您的應用程式部署到 GitHub Pages 等 Web 代管平台所必需的。

### 產生構件

建立一個用於執行 **wasmJsBrowserDistribution** 任務的執行配置：

1. 選取 **Run | Edit Configurations** 功能表項目。
2. 點擊加號按鈕，並從下拉式清單中選擇 **Gradle**。
3. 在 **Tasks and arguments** 欄位中，貼上此指令：

   ```shell
   wasmJsBrowserDistribution
   ```

4. 點擊 **OK**。

現在，您可以使用此配置來執行任務：

![執行 Wasm 發佈任務](compose-run-wasm-distribution-task.png){width=350}

任務完成後，您可以在 `sharedUI/build/dist/wasmJs/productionExecutable` 目錄中找到產生的構件：

![構件目錄](compose-web-artifacts.png){width=400}

### 在 GitHub Pages 上發佈您的應用程式

準備好構件後，您可以將應用程式部署到 Web 代管平台：

1. 將 `productionExecutable` 目錄的內容複製到您要建立網站的存儲庫中。
2. 按照 GitHub 的說明[建立您的網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)。

   > 在您將變更推送到 GitHub 後，網站變更最多可能需要 10 分鐘才能發佈。
   >
   {style="note"}

3. 在瀏覽器中，導覽至您的 GitHub Pages 網域。

   ![導覽至 GitHub Pages](publish-your-application-on-web.png){width=650}

   恭喜！您已在 GitHub Pages 上發佈了您的構件。

### 偵錯您的 Web 應用程式

您可以直接在瀏覽器中對 Web 應用程式進行偵錯，無需額外配置。要了解如何在瀏覽器中偵錯，請參閱 Kotlin 文件中的[在瀏覽器中偵錯](https://kotlinlang.org/docs/wasm-debugging.html#debug-in-your-browser)指南。