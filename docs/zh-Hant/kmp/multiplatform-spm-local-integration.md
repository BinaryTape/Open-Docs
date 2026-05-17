[//]: # (title: 在本機 Swift 軟件包中使用 Kotlin)

<tldr>
   這是一種本機整合方法。如果符合以下情況，它可能適合您：<br/>

   * 您有一個包含本機 SwiftPM 模組的 iOS 應用程式。
   * 您已經在本機電腦上設定了針對 iOS 的 Kotlin Multiplatform 專案。
   * 您現有的 iOS 專案具有靜態連結類型。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview.md)
</tldr>

在本教學中，您將學習如何使用 Swift 封裝管理員 (SwiftPM) 將 Kotlin Multiplatform 專案中的 Kotlin 架構整合到本機軟件包中。

![直接整合圖示](direct-integration-scheme.svg){width=700}

要設定整合，您將新增一個特殊的指令碼，該指令碼使用 `embedAndSignAppleFrameworkForXcode` Gradle 任務作為您專案組建組態中的預置操作 (pre-action)。要查看通用程式碼中所做的變更反映在您的 Xcode 專案中，您只需要重新組建 Kotlin Multiplatform 專案即可。

透過這種方式，您可以輕鬆地在本機 Swift 軟件包中使用 Kotlin 程式碼，與一般的直接整合方法相比，後者將指令碼新增到組建階段，並且需要重新組建 Kotlin Multiplatform 和 iOS 專案才能從通用程式碼獲取變更。

> 如果您不熟悉 Kotlin Multiplatform，請先學習如何[設定環境](quickstart.md)以及[從頭開始建立跨平台應用程式](compose-multiplatform-create-first-app.md)。
>
{style="tip"}

## 設定專案

此功能從 Kotlin 2.0.0 開始提供。

> 要檢查 Kotlin 版本，請導覽至 Kotlin Multiplatform 專案根目錄中的 `build.gradle(.kts)` 檔案。您將在檔案頂部的 `plugins {}` 區塊中看到目前版本。
> 
> 或者，檢查 `gradle/libs.versions.toml` 檔案中的版本目錄 (version catalog)。
> 
{style="tip"}

本教學假設您的專案在專案的組建階段中使用帶有 `embedAndSignAppleFrameworkForXcode` 任務的[直接整合](multiplatform-direct-integration.md)方法。如果您是透過 CocoaPods 外掛程式或透過帶有 `binaryTarget` 的 Swift 軟件包連接 Kotlin 架構，請先進行遷移。

### 從 SwiftPM binaryTarget 整合遷移 {initial-collapse-state="collapsed" collapsible="true"}

要從使用 `binaryTarget` 的 SwiftPM 整合遷移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或使用 <shortcut>Cmd + Shift + K</shortcut> 快速鍵清理組建目錄。
2. 在每個 `Package.swift` 檔案中，移除對包含 Kotlin 架構的軟件包的相依性，以及對產品的目標相依性。

### 從 CocoaPods 外掛程式遷移 {initial-collapse-state="collapsed" collapsible="true"}

> 如果您在 `cocoapods {}` 區塊中對其他 Pod 有相依性，則必須採用 CocoaPods 整合方法。目前，在多模組 SwiftPM 專案中不可能同時擁有對 Pod 和對 Kotlin 架構的相依性。
>
{style="warning"}

要從 CocoaPods 外掛程式遷移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或使用 <shortcut>Cmd + Shift + K</shortcut> 快速鍵清理組建目錄。
2. 在包含 Podfile 的目錄中，執行以下指令：

    ```none
   pod deintegrate
   ```

3. 從您的 `build.gradle(.kts)` 檔案中移除 `cocoapods {}` 區塊。
4. 刪除 `.podspec` 檔案和 Podfile。

## 將架構連接到您的專案

> 目前不支援整合到 `swift build`。
>
{style="note"}

為了能夠在本機 Swift 軟件包中使用 Kotlin 程式碼，請將從多平台專案產生的 Kotlin 架構連接到您的 Xcode 專案：

1. 在 Xcode 中，前往 **Product** | **Scheme** | **Edit scheme** 或點擊頂部列中的配置圖示並選擇 **Edit scheme**：

   ![編輯配置](xcode-edit-schemes.png){width=700}

2. 選擇 **Build** | **Pre-actions** 項目，然後點擊 **+** | **New Run Script Action**：

   ![新增執行指令碼操作](xcode-new-run-script-action.png){width=700}

3. 調整以下指令碼並將其新增為操作：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * 在 `cd` 指令中，指定 Kotlin Multiplatform 專案根目錄的路徑，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 指令中，指定共用模組的名稱，例如 `:shared` 或 `:sharedLogic`。
  
4. 在 **Provide build settings from** 區段中選擇您應用程式的目標：

   ![填寫執行指令碼操作](xcode-filled-run-script-action.png){width=700}

5. 您現在可以將共用模組匯入到您的本機 Swift 軟件包中並使用 Kotlin 程式碼。

   在 Xcode 中，導覽至您的本機 Swift 軟件包並定義一個包含模組匯入的函式，例如：

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SwiftPM 用法](xcode-spm-usage.png){width=700}

6. 在 iOS 專案的 `ContentView.swift` 檔案中，您現在可以透過匯入本機軟件包來使用此函式：

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
   
7. 在 Xcode 中組建專案。如果一切設定正確，專案組建將會成功。
   
還有一些值得考慮的因素： 

* 如果您有不同於預設 `Debug` 或 `Release` 的自訂組建組態，請在 **Build Settings** 分頁的 **User-Defined** 下新增 `KOTLIN_FRAMEWORK_BUILD_TYPE` 設定，並將其設定為 `Debug` 或 `Release`。
* 如果您遇到指令碼沙盒化錯誤，請透過按兩下專案名稱開啟 iOS 專案設定，然後在 **Build Settings** 分頁中，停用 **Build Options** 下的 **User Script Sandboxing**。

## 下一步

* [選擇您的整合方法](multiplatform-ios-integration-overview.md)
* [進一步了解如何設定 Swift 軟件包匯出](multiplatform-spm-export.md)