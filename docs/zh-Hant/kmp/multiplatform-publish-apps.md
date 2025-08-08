[//]: # (title: 發佈您的應用程式)

一旦您的應用程式準備好發佈，就該將它們交付給使用者了。

對於行動應用程式，每個平台都有多個可用的商店。然而，在本文中，我們將重點關注官方商店：[Google Play Store](https://play.google.com/store) 和 [Apple App Store](https://www.apple.com/ios/app-store/)。對於網路應用程式，我們將使用 [GitHub Pages](https://pages.github.com/)。

您將學習如何準備 Kotlin Multiplatform 應用程式以供發佈，我們將重點介紹此過程中值得特別關注的部分。

## Android 應用程式

由於 [Kotlin 是 Android 開發的主要語言](https://developer.android.com/kotlin)，Kotlin Multiplatform 對於專案編譯和 Android 應用程式建構沒有明顯影響。無論是從共享模組產生的 Android 函式庫，還是 Android 應用程式本身，都是典型的 Android Gradle 模組；它們與其他 Android 函式庫和應用程式沒有區別。因此，從 Kotlin Multiplatform 專案發佈 Android 應用程式與 [Android 開發者文件](https://developer.android.com/studio/publish)中描述的常規流程沒有區別。

## iOS 應用程式

Kotlin Multiplatform 專案中的 iOS 應用程式是從典型的 Xcode 專案建構的，因此發佈它所涉及的主要階段與 [iOS 開發者文件](https://developer.apple.com/ios/submit/)中描述的相同。

> 隨著 2024 年春季 App Store 政策的變更，遺失或不完整的隱私清單可能會導致您的應用程式收到警告甚至遭到拒絕。
> 有關詳細資訊和變通方法，特別是對於 Kotlin Multiplatform 應用程式，請參閱 [iOS 應用程式的隱私清單](https://kotlinlang.org/docs/apple-privacy-manifest.html)。
>
{style="note"}

Kotlin Multiplatform 專案的特殊之處在於將共享 Kotlin 模組編譯為框架並將其連結到 Xcode 專案。通常，共享模組與 Xcode 專案之間的整合是由 [Kotlin Multiplatform 適用於 Android Studio 的外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)自動完成的。但是，如果您不使用該外掛程式，請在 Xcode 中建構和捆綁 iOS 專案時注意以下幾點：

*   共享 Kotlin 函式庫編譯為原生框架。
*   您需要將為特定平台編譯的框架連接到 iOS 應用程式專案。
*   在 Xcode 專案設定中，指定框架的路徑以供建構系統搜尋。
*   建構專案後，您應該啟動並測試應用程式，以確保在執行時使用框架時沒有問題。

有兩種方法可以將共享 Kotlin 模組連接到 iOS 專案：
*   使用 [Kotlin CocoaPods Gradle 外掛程式](multiplatform-cocoapods-overview.md)，它允許您將具有原生目標的多平台專案用作 iOS 專案中的 CocoaPods 依賴項。
*   手動配置您的 Multiplatform 專案以建立一個 iOS 框架，並配置 Xcode 專案以取得其最新版本。Kotlin Multiplatform 精靈或 Kotlin Multiplatform 適用於 Android Studio 的外掛程式通常會完成此配置。請參閱[連接框架到您的 iOS 專案](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)，以了解如何在 Xcode 中直接新增框架。

### 配置您的 iOS 應用程式

您可以在不使用 Xcode 的情況下配置影響最終應用程式的基本屬性。

#### 套件 ID

[套件 ID](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier#discussion) 在作業系統中唯一識別您的應用程式。要更改它，請在 Android Studio 中開啟 `iosApp/Configuration/Config.xcconfig` 檔案並更新 `BUNDLE_ID`。

#### 應用程式名稱

應用程式名稱設定目標可執行檔和應用程式套件名稱。要更改您的應用程式名稱：

*   如果您還**沒有**在 Android Studio 中開啟專案，您可以直接在任何文字編輯器中更改 `iosApp/Configuration/Config.xcconfig` 檔案中的 `APP_NAME` 選項。
*   如果您已在 Android Studio 中開啟專案，請執行以下操作：

    1.  關閉專案。
    2.  在任何文字編輯器中，更改 `iosApp/Configuration/Config.xcconfig` 檔案中的 `APP_NAME` 選項。
    3.  重新開啟 Android Studio 中的專案。

如果您需要配置其他設定，請使用 Xcode：在 Android Studio 中開啟專案後，在 Xcode 中開啟 `iosApp/iosApp.xcworkspace` 檔案並在那裡進行更改。

### 符號化崩潰報告

為了幫助開發人員改進他們的應用程式，iOS 提供了一種分析應用程式崩潰的方法。為了進行詳細的崩潰分析，它使用特殊的偵錯符號 (`.dSYM`) 檔案，將崩潰報告中的記憶體位址與原始碼中的位置（例如函數或行號）匹配。

預設情況下，從共享 Kotlin 模組產生的 iOS 框架的發佈版本都帶有隨附的 `.dSYM` 檔案。這有助於您分析共享模組程式碼中發生的崩潰。

當 iOS 應用程式從位元碼重建時，其 `dSYM` 檔案會變得無效。對於這種情況，您可以將共享模組編譯為靜態框架，該框架將偵錯資訊儲存在其內部。有關設定從 Kotlin 模組產生的二進位檔中崩潰報告符號化的說明，請參閱 [Kotlin/Native 文件](https://kotlinlang.org/docs/native-ios-symbolication.html)。

## 網路應用程式

要發佈您的網路應用程式，請建立包含構成應用程式的編譯檔案和資源的產物。這些產物對於將您的應用程式部署到像 GitHub Pages 這樣的網路託管平台是必要的。

### 生成產物

為執行 **wasmJsBrowserDistribution** 任務建立一個執行配置：

1.  選擇 **Run | Edit Configurations** 選單項目。
2.  點擊加號按鈕並從下拉式清單中選擇 **Gradle**。
3.  在 **Tasks and arguments** 欄位中，貼上此命令：

    ```shell
    wasmJsBrowserDistribution
    ```

4.  點擊 **OK**。

現在，您可以使用此配置來執行任務：

![執行 Wasm 發佈任務](compose-run-wasm-distribution-task.png){width=350}

任務完成後，您可以在 `composeApp/build/dist/wasmJs/productionExecutable` 目錄中找到生成的產物：

![產物目錄](compose-web-artifacts.png){width=400}

### 在 GitHub Pages 上發佈您的應用程式

準備好產物後，您可以將您的應用程式部署到網路託管平台：

1.  將 `productionExecutable` 目錄的內容複製到您要建立網站的儲存庫中。
2.  按照 GitHub 有關[建立您的網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)的說明操作。

    > 在您將變更推送到 GitHub 後，您的網站發佈可能需要長達 10 分鐘。
    >
    {style="note"}

3.  在瀏覽器中，導覽至您的 GitHub Pages 網域。

    ![導覽至 GitHub Pages](publish-your-application-on-web.png){width=650}

    恭喜！您已在 GitHub Pages 上發佈了您的產物。

### 偵錯您的網路應用程式

您可以開箱即用在瀏覽器中偵錯您的網路應用程式，無需額外配置。要了解如何在瀏覽器中偵錯，請參閱 Kotlin 文件中的[在您的瀏覽器中偵錯](https://kotlinlang.org/docs/wasm-debugging.html#debug-in-your-browser)指南。