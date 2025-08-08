[//]: # (title: 直接整合)

<tldr>
   這是一種本地整合方法。如果符合以下條件，它會對您有所幫助：<br/>

   * 您已在本地機器上設定好目標為 iOS 的 Kotlin 多平台專案。
   * 您的 Kotlin 多平台專案沒有 CocoaPods 依賴項。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview.md)
</tldr>

如果您想透過在 Kotlin 多平台專案和 iOS 專案之間共享程式碼來同時開發它們，
您可以使用特殊指令碼設定直接整合。

此指令碼可自動化將 Kotlin 框架連接到 Xcode 中的 iOS 專案的過程：

![直接整合圖](direct-integration-scheme.svg){width=700}

該指令碼使用專為 Xcode 環境設計的 `embedAndSignAppleFrameworkForXcode` Gradle 任務。
在設定過程中，您將其新增到 iOS 應用程式建置的執行指令碼階段。之後，Kotlin Artifact
會在執行 iOS 應用程式建置之前建置並包含在衍生資料中。

總體而言，該指令碼：

* 將編譯後的 Kotlin 框架複製到 iOS 專案結構中正確的目錄。
* 處理嵌入式框架的程式碼簽章流程。
* 確保 Kotlin 框架中的程式碼更改反映在 Xcode 的 iOS 應用程式中。

## 如何設定

如果您目前使用 CocoaPods 外掛程式連接您的 Kotlin 框架，請先進行遷移。
如果您的專案沒有 CocoaPods 依賴項，請[跳過此步驟](#connect-the-framework-to-your-project)。

### 從 CocoaPods 外掛程式遷移

要從 CocoaPods 外掛程式遷移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或快捷鍵
   <shortcut>Cmd + Shift + K</shortcut> 清理建置目錄。
2. 在包含 Podfile 的目錄中，執行以下指令：

    ```none
   pod deintegrate
   ```

3. 從您的 `build.gradle(.kts)` 檔案中移除 `cocoapods {}` 區塊。
4. 刪除 `.podspec` 檔案和 Podfile。

### 連接框架到您的專案

要將從多平台專案生成的 Kotlin 框架連接到您的 Xcode 專案：

1. 僅當 `binaries.framework` 配置選項已宣告時，`embedAndSignAppleFrameworkForXcode` 任務才會註冊。
   在您的 Kotlin 多平台專案中，檢查 `build.gradle.kts` 檔案中的 iOS 目標宣告。
2. 在 Xcode 中，按兩下專案名稱，開啟 iOS 專案設定。
3. 在左側的 **Targets** 部分中，選擇您的目標，然後導覽至 **Build Phases** 標籤頁。
4. 按一下 **+** 並選擇 **New Run Script Phase**。

   ![新增執行指令碼階段](xcode-run-script-phase-1.png){width=700}

5. 調整以下指令碼並將結果貼到執行指令碼欄位中：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * 在 `cd` 指令中，指定您的 Kotlin 多平台專案根目錄的路徑，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 指令中，指定共享模組的名稱，例如 `:shared` 或 `:composeApp`。

   ![新增指令碼](xcode-run-script-phase-2.png){width=700}

6. 停用 **Based on dependency analysis** 選項。

   這可確保 Xcode 在每次建置時執行指令碼，並且不會每次都警告輸出依賴項遺失。
7. 將「執行指令碼」階段往上移動，置於「編譯原始碼」階段之前。

   ![拖曳執行指令碼階段](xcode-run-script-phase-3.png){width=700}

8. 在 **Build Settings** 標籤頁上，在 **Build Options** 下停用 **User Script Sandboxing** 選項：

   ![使用者指令碼沙盒化](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 如果您在未先停用沙盒化的情況下建置了 iOS 專案，這可能需要重新啟動您的 Gradle Daemon。
   > 停止可能已被沙盒化的 Gradle Daemon 處理程序：
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {style="tip"}

9. 在 Xcode 中建置專案。如果一切設定正確，專案將成功建置。

> 如果您有不同於預設 `Debug` 或 `Release` 的自訂建置配置，請在 **Build Settings** 標籤頁的
> **User-Defined** 下新增 `KOTLIN_FRAMEWORK_BUILD_TYPE` 設定，並將其設定為 `Debug` 或 `Release`。
>
{style="note"}

## 接下來？

在使用 Swift 套件管理器時，您也可以利用本地整合。
[了解如何在本地套件中新增 Kotlin 框架的依賴項](multiplatform-spm-local-integration.md)。