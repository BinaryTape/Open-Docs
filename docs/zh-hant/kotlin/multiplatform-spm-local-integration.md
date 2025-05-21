---
title: "從本地 Swift 套件使用 Kotlin"
---
:::info

   這是本機整合方法。如果符合以下情況，它可能對您有效：<br/>

   * 您有一個帶有本機 SPM 模組的 iOS 應用程式。
   * 您已經在本機電腦上設定了以 iOS 為目標的 Kotlin Multiplatform 專案。
   * 您現有的 iOS 專案具有靜態連結類型。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview)

:::

在本教學中，您將學習如何使用 Swift 套件管理器 (SPM) 將 Kotlin Multiplatform 專案中的 Kotlin 框架整合到本機套件中。

<img src="/img/direct-integration-scheme.svg" alt="Direct integration diagram" width="700" style={{verticalAlign: 'middle'}}/>

若要設定整合，您將新增一個特殊腳本，該腳本使用 `embedAndSignAppleFrameworkForXcode` Gradle 任務作為專案建置設定中的 pre-action （預先操作）。要查看 common code（通用程式碼）中所做的變更反映在您的 Xcode 專案中，您只需要重建 Kotlin Multiplatform 專案。

這樣，與常規的 direct integration method（直接整合方法）相比，您可以輕鬆地在本機 Swift 套件中使用 Kotlin 程式碼，該方法將腳本添加到建置階段，並且需要重建 Kotlin Multiplatform 和 iOS 專案才能從通用程式碼中獲取變更。

:::note
如果您不熟悉 Kotlin Multiplatform，請先學習如何[設定環境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html)
和[從頭開始建立跨平台應用程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)。

## 設定專案

此功能從 Kotlin 2.0.0 開始可用。

要檢查 Kotlin 版本，請導航到 Kotlin Multiplatform 專案根目錄中的 `build.gradle(.kts)` 檔案。您將在檔案頂部的 `plugins {}` 區塊中看到目前版本。

或者，檢查 `gradle/libs.versions.toml` 檔案中的 version catalog （版本目錄）。

本教學假設您的專案使用 [direct integration（直接整合）](multiplatform-direct-integration)
方法，並在專案的建置階段中使用 `embedAndSignAppleFrameworkForXcode` 任務。如果您透過 CocoaPods 插件或透過帶有 `binaryTarget` 的 Swift 套件連接 Kotlin 框架，請先遷移。

### 從 SPM binaryTarget 整合遷移

要從帶有 `binaryTarget` 的 SPM 整合遷移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或使用
   <shortcut>Cmd + Shift + K</shortcut> 快捷鍵來清除建置目錄。
2. 在每個 `Package.swift` 檔案中，移除對包含 Kotlin 框架的套件的依賴，以及對產品的目標依賴。

### 從 CocoaPods 插件遷移

如果您在 `cocoapods {}` 區塊中對其他 Pod 有依賴，則必須採用 CocoaPods 整合方法。
目前，在多模式 SPM 專案中，不可能同時依賴 Pod 和 Kotlin 框架。

要從 CocoaPods 插件遷移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或使用
   <shortcut>Cmd + Shift + K</shortcut> 快捷鍵來清除建置目錄。
2. 在包含 `Podfile` 的目錄中，執行以下命令：

    ```none
   pod deintegrate
   ```

3. 從您的 `build.gradle(.kts)` 檔案中移除 `cocoapods {}` 區塊。
4. 刪除 `.podspec` 和 `Podfile` 檔案。

## 將框架連接到您的專案

目前不支援整合到 `swift build` 中。

:::

為了能夠在本機 Swift 套件中使用 Kotlin 程式碼，請將從 multiplatform（多平台）專案產生的 Kotlin 框架連接到您的 Xcode 專案：

1. 在 Xcode 中，前往 **Product** | **Scheme** | **Edit scheme** 或點擊頂部欄中的 scheme（配置）圖示，然後選擇 **Edit scheme**：

   <img src="/img/xcode-edit-schemes.png" alt="Edit scheme" width="700" style={{verticalAlign: 'middle'}}/>

2. 選擇 **Build** | **Pre-actions** 項目，然後點擊 **+** | **New Run Script Action**：

   <img src="/img/xcode-new-run-script-action.png" alt="New run script action" width="700" style={{verticalAlign: 'middle'}}/>

3. 調整以下腳本，並將其新增為一個 action（動作）：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * 在 `cd` 命令中，指定 Kotlin Multiplatform 專案根目錄的路徑，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 命令中，指定 shared module（共享模組）的名稱，例如 `:shared` 或 `:composeApp`。
  
4. 在 **Provide build settings from** 區段中，選擇您應用程式的目標：

   <img src="/img/xcode-filled-run-script-action.png" alt="Filled run script action" width="700" style={{verticalAlign: 'middle'}}/>

5. 您現在可以將 shared module（共享模組）匯入到您的本機 Swift 套件中，並使用 Kotlin 程式碼。

   在 Xcode 中，導航到您的本機 Swift 套件，並定義一個帶有模組匯入的函數，例如：

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() `->` String {
       return Greeting.greet()
   }
   ```

   <img src="/img/xcode-spm-usage.png" alt="SPM usage" width="700" style={{verticalAlign: 'middle'}}/>

6. 在 iOS 專案的 `ContentView.swift` 檔案中，您現在可以透過匯入本機套件來使用此函數：

   ```Swift
   import SwiftUI
   import SpmLocalPackage
   
   struct ContentView: View {
       var body: some View {
           Vstack {
               Image(systemName: "globe")
                   .imageScale(.large)
                   .foregroundStyle(.tint)
               Text(greetingsFromSpmLocalPackage())
           }
           .padding()
       }
   }
   
   #Preview {
       ContentView()
   }
   ```
   
7. 在 Xcode 中建置專案。如果一切設定正確，專案建置將會成功。
   
還有一些其他因素值得考慮：

* 如果您有一個與預設 `Debug` 或 `Release` 不同的自訂建置配置，請在 **Build Settings**
  標籤上，在 **User-Defined** 下新增 `KOTLIN_FRAMEWORK_BUILD_TYPE` 設定，並將其設定為 `Debug` 或 `Release`。
* 如果您遇到腳本沙箱的錯誤，請透過雙擊專案名稱來開啟 iOS 專案設定，
  然後在 **Build Settings** 標籤上，在 **Build Options** 下停用 **User Script Sandboxing**。

## 接下來做什麼

* [選擇您的整合方法](multiplatform-ios-integration-overview)
* [學習如何設定 Swift 套件匯出](native-spm)

  ```