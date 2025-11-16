[//]: # (title: 發布您的應用程式)

一旦您的應用程式準備好發布，就可以透過發布它們來交付給使用者。

對於行動應用程式，每個平台都有多個可用的應用程式商店。然而，在本文中，我們將專注於官方商店：[Google Play Store](https://play.google.com/store) 和 [Apple App Store](https://www.apple.com/ios/app-store/)。對於網頁應用程式，我們將使用 [GitHub pages](https://pages.github.com/)。

您將學習如何準備 Kotlin Multiplatform 應用程式以供發布，我們將強調此過程中需要特別注意的部分。

## Android 應用程式

由於 [Kotlin 是 Android 開發的主要語言](https://developer.android.com/kotlin)，Kotlin Multiplatform 對於專案的編譯和 Android 應用程式的建構沒有明顯影響。無論是從共享模組產生的 Android 函式庫，還是 Android 應用程式本身，都是典型的 Android Gradle 模組；它們與其他 Android 函式庫和應用程式沒有區別。因此，從 Kotlin Multiplatform 專案發布 Android 應用程式，與 [Android 開發者文件](https://developer.android.com/studio/publish)中描述的常規過程沒有不同。

## iOS 應用程式

Kotlin Multiplatform 專案中的 iOS 應用程式是從典型的 Xcode 專案建構的，因此其發布的主要階段與 [iOS 開發者文件](https://developer.apple.com/ios/submit/)中描述的相同。

> 隨著 2024 春季 App Store 政策的變更，缺少或不完整的隱私權宣告檔可能會導致您的應用程式收到警告甚至遭到拒絕。
> 有關詳細資訊和因應措施，特別是針對 Kotlin Multiplatform 應用程式，請參閱 [iOS 應用程式的隱私權宣告檔](https://kotlinlang.org/docs/apple-privacy-manifest.html)。
>
{style="note"}

Kotlin Multiplatform 專案的特殊之處在於將共享的 Kotlin 模組編譯為框架並將其連結到 Xcode 專案。通常，共享模組與 Xcode 專案之間的整合由 [Kotlin Multiplatform plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 自動完成。然而，如果您不使用該外掛程式，在 Xcode 中建構和打包 iOS 專案時請記住以下事項：

*   共享的 Kotlin 函式庫會編譯成原生框架。
*   您需要將針對特定平台編譯的框架連接到 iOS 應用程式專案。
*   在 Xcode 專案設定中，指定框架的路徑以供建構系統搜尋。
*   建構專案後，您應啟動並測試應用程式，以確保在執行階段使用框架時沒有任何問題。

有兩種方法可以將共享的 Kotlin 模組連接到 iOS 專案：
*   使用 [Kotlin CocoaPods Gradle plugin](multiplatform-cocoapods-overview.md)，它允許您將具備原生目標的多平台專案用作 iOS 專案中的 CocoaPods 依賴項。
*   手動配置您的 Multiplatform 專案以建立一個 iOS 框架，並配置 Xcode 專案以獲取其最新版本。
    Kotlin Multiplatform 精靈或 Kotlin Multiplatform plugin for Android Studio 通常會執行此配置。
    請參閱 [將框架連接至您的 iOS 專案](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)以了解如何在 Xcode 中直接新增框架。

### 配置您的 iOS 應用程式

您可以在不使用 Xcode 的情況下配置影響最終應用程式的基本屬性。

#### Bundle ID

[Bundle ID](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier#discussion) 在作業系統中唯一識別您的應用程式。要更改它，請在 Android Studio 中開啟 `iosApp/Configuration/Config.xcconfig` 檔案並更新 `BUNDLE_ID`。

#### 應用程式名稱

應用程式名稱設定目標可執行檔和應用程式套件名稱。要更改您的應用程式名稱：

*   如果您尚未在 Android Studio 中開啟專案，可以直接在任何文字編輯器中更改 `iosApp/Configuration/Config.xcconfig` 檔案中的 `APP_NAME` 選項。
*   如果您已在 Android Studio 中開啟專案，請執行以下操作：

    1.  關閉專案。
    2.  在任何文字編輯器中，更改 `APP_NAME` 選項在 `iosApp/Configuration/Config.xcconfig` 檔案中。
    3.  在 Android Studio 中重新開啟專案。

如果您需要配置其他設定，請使用 Xcode：在 Android Studio 中開啟專案後，在 Xcode 中開啟 `iosApp/iosApp.xcworkspace` 檔案並在那裡進行更改。

### 符號化當機報告

為了幫助開發人員改進他們的應用程式，iOS 提供了一種分析應用程式當機的方法。為了進行詳細的當機分析，它使用特殊的偵錯符號 (`.dSYM`) 檔案，將當機報告中的記憶體位址與原始碼中的位置（例如函式或行號）進行匹配。

預設情況下，從共享 Kotlin 模組產生的 iOS 框架的發行版本會隨附一個 `.dSYM` 檔案。這有助於您分析共享模組程式碼中發生的當機。

有關當機報告符號化的更多資訊，請參閱 [Kotlin/Native 文件](https://kotlinlang.org/docs/native-debugging.html#debug-ios-applications)。

## 網頁應用程式

要發布您的網頁應用程式，請建立包含構成您應用程式的已編譯檔案和資源的構件。這些構件對於將您的應用程式部署到 GitHub Pages 等網頁代管平台是必需的。

### 產生構件

為執行 **wasmJsBrowserDistribution** 任務建立一個執行組態：

1.  選取 **Run | Edit Configurations** 選單項目。
2.  點擊加號按鈕並從下拉式清單中選擇 **Gradle**。
3.  在 **Tasks and arguments** 欄位中，貼上此指令：

    ```shell
    wasmJsBrowserDistribution
    ```

4.  點擊 **OK**。

現在，您可以使用此組態來執行任務：

![執行 Wasm 發布任務](compose-run-wasm-distribution-task.png){width=350}

任務完成後，您可以在 `composeApp/build/dist/wasmJs/productionExecutable` 目錄中找到產生的構件：

![構件目錄](compose-web-artifacts.png){width=400}

### 在 GitHub Pages 上發布您的應用程式

構件準備就緒後，您可以在網頁代管平台部署您的應用程式：

1.  將您的 `productionExecutable` 目錄的內容複製到您要建立網站的儲存庫中。
2.  遵循 GitHub 關於[建立網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)的指示。

    > 將變更推送至 GitHub 後，您的網站可能需要長達 10 分鐘才能發布。
    >
    {style="note"}

3.  在瀏覽器中，導覽至您的 GitHub pages 網域。

    ![導覽至 GitHub pages](publish-your-application-on-web.png){width=650}

    恭喜！您已在 GitHub pages 上發布您的構件。

### 偵錯您的網頁應用程式

您可以開箱即用地在瀏覽器中偵錯您的網頁應用程式，無需額外配置。要了解如何在瀏覽器中偵錯，請參閱 Kotlin 文件中的[在瀏覽器中偵錯](https://kotlinlang.org/docs/wasm-debugging.html#debug-in-your-browser)指南。