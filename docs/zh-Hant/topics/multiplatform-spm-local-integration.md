[//]: # (title: 在本地 Swift 套件中使用 Kotlin)

<tldr>
   這是一種本地整合方法。如果符合以下條件，它會對您有所幫助：<br/>

   * 您有一個帶有本地 SPM 模組的 iOS 應用程式。
   * 您已經在本地機器上設定了一個以 iOS 為目標的 Kotlin 多平台專案。
   * 您現有的 iOS 專案具有靜態連結類型。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview.md)
</tldr>

在本教學中，您將學習如何使用 Swift 套件管理器 (SPM) 將 Kotlin 多平台專案中的 Kotlin 框架整合到本地套件中。

![直接整合圖](direct-integration-scheme.svg){width=700}

要設定整合，您需要新增一個特殊腳本，該腳本在專案的建置設定中將 `embedAndSignAppleFrameworkForXcode` Gradle 任務用作預先動作。要查看通用程式碼中所做的更改反映在 Xcode 專案中，您只需重建 Kotlin 多平台專案。

這樣，您可以輕鬆地在本地 Swift 套件中使用 Kotlin 程式碼，相較於在建置階段添加腳本並需要重建 Kotlin 多平台專案和 iOS 專案才能獲取通用程式碼中更改的常規直接整合方法。

> 如果您不熟悉 Kotlin Multiplatform，請先學習如何[設定環境](quickstart.md)並[從頭開始建立跨平台應用程式](compose-multiplatform-create-first-app.md)。
>
{style="tip"}

## 設定專案

此功能從 Kotlin 2.0.0 開始提供。

> 要檢查 Kotlin 版本，請導航到 Kotlin 多平台專案根目錄下的 `build.gradle(.kts)` 檔案。您將在檔案頂部的 `plugins {}` 區塊中看到當前版本。
>
> 或者，檢查 `gradle/libs.versions.toml` 檔案中的版本目錄。
>
{style="tip"}

本教學假設您的專案使用[直接整合](multiplatform-direct-integration.md)方法，並在專案的建置階段中使用 `embedAndSignAppleFrameworkForXcode` 任務。如果您透過 CocoaPods 外掛程式或透過帶有 `binaryTarget` 的 Swift 套件連接 Kotlin 框架，請先進行遷移。

### 從 SPM binaryTarget 整合遷移 {initial-collapse-state="collapsed" collapsible="true"}

要從帶有 `binaryTarget` 的 SPM 整合遷移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或快捷鍵 <shortcut>Cmd + Shift + K</shortcut> 清理建置目錄。
2. 在每個 `Package.swift` 檔案中，移除對內部包含 Kotlin 框架的套件的依賴項以及對產品的目標依賴項。

### 從 CocoaPods 外掛程式遷移 {initial-collapse-state="collapsed" collapsible="true"}

> 如果您在 `cocoapods {}` 區塊中依賴於其他 Pods，則必須採用 CocoaPods 整合方法。目前，在多模態 SPM 專案中同時依賴 Pods 和 Kotlin 框架是不可能的。
>
{style="warning"}

要從 CocoaPods 外掛程式遷移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或快捷鍵 <shortcut>Cmd + Shift + K</shortcut> 清理建置目錄。
2. 在 Podfile 所在的目錄中，執行以下命令：

    ```none
   pod deintegrate
   ```

3. 從您的 `build.gradle(.kts)` 檔案中移除 `cocoapods {}` 區塊。
4. 刪除 `.podspec` 檔案和 Podfile。

## 將框架連接到您的專案

> 目前不支援整合到 `swift build` 中。
>
{style="note"}

為了能夠在本地 Swift 套件中使用 Kotlin 程式碼，請將從多平台專案生成的 Kotlin 框架連接到您的 Xcode 專案：

1. 在 Xcode 中，前往 **Product** | **Scheme** | **Edit scheme** 或點擊頂部欄中的 Scheme 圖標並選擇 **Edit scheme**：

   ![編輯 Scheme](xcode-edit-schemes.png){width=700}

2. 選擇 **Build** | **Pre-actions** 項目，然後點擊 **+** | **New Run Script Action**：

   ![新增執行腳本動作](xcode-new-run-script-action.png){width=700}

3. 調整以下腳本並將其添加為動作：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode
   ```

   * 在 `cd` 命令中，指定 Kotlin 多平台專案的根目錄路徑，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 命令中，指定共享模組的名稱，例如 `:shared` 或 `:composeApp`。
  
4. 在 **Provide build settings from** 區段中選擇您的應用程式目標：

   ![已填寫的執行腳本動作](xcode-filled-run-script-action.png){width=700}

5. 您現在可以將共享模組導入到您的本地 Swift 套件中並使用 Kotlin 程式碼。

   在 Xcode 中，導航到您的本地 Swift 套件並定義一個帶有模組導入的函數，例如：

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SPM 使用](xcode-spm-usage.png){width=700}

6. 在您的 iOS 專案的 `ContentView.swift` 檔案中，您現在可以透過導入本地套件來使用此函數：

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
   
還有幾個值得考慮的因素：

* 如果您有一個不同於預設 `Debug` 或 `Release` 的自訂建置配置，請在 **Build Settings** 分頁上，在 **User-Defined** 下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 設定並將其設置為 `Debug` 或 `Release`。
* 如果您遇到腳本沙箱化錯誤，請雙擊專案名稱打開 iOS 專案設定，然後在 **Build Settings** 分頁上，在 **Build Options** 下禁用 **User Script Sandboxing**。

## 接下來

* [選擇您的整合方法](multiplatform-ios-integration-overview.md)
* [學習如何設定 Swift 套件匯出](multiplatform-spm-export.md)