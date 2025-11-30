[//]: # (title: 直接整合)

<tldr>
   這是一種本地整合方法。如果您符合以下條件，此方法可能適合您：<br/>

   * 您已在本地機器上設定了以 iOS 為目標的 Kotlin Multiplatform 專案。
   * 您的 Kotlin Multiplatform 專案沒有 CocoaPods 依賴項。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview.md)
</tldr>

如果您希望透過在 Kotlin Multiplatform 專案和 iOS 專案之間共用程式碼，來同時開發這兩個專案，您可以透過一個特殊腳本設定直接整合。

此腳本自動化了在 Xcode 中將 Kotlin 框架連接到 iOS 專案的過程：

![直接整合圖](direct-integration-scheme.svg){width=700}

該腳本使用專為 Xcode 環境設計的 `embedAndSignAppleFrameworkForXcode` Gradle 任務。在設定過程中，您將其添加到 iOS 應用程式建置的執行腳本階段。之後，Kotlin 成品將在執行 iOS 應用程式建置之前被建置並包含在派生數據中。

一般而言，該腳本：

* 將編譯後的 Kotlin 框架複製到 iOS 專案結構中正確的目錄。
* 處理嵌入式框架的程式碼簽署過程。
* 確保 Kotlin 框架中的程式碼變更反映在 Xcode 中的 iOS 應用程式中。

## 如何設定

如果您目前正在使用 CocoaPods 插件連接您的 Kotlin 框架，請先遷移。如果您的專案沒有 CocoaPods 依賴項，請[跳過此步驟](#connect-the-framework-to-your-project)。

### 從 CocoaPods 插件遷移

要從 CocoaPods 插件遷移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或透過 <shortcut>Cmd + Shift + K</shortcut> 快捷鍵清理建置目錄。
2. 在包含 Podfile 的目錄中，運行以下命令：

    ```none
   pod deintegrate
   ```

3. 從您的 `build.gradle(.kts)` 文件中移除 `cocoapods {}` 區塊。
4. 刪除 `.podspec` 文件和 Podfile。

### 連接框架到您的專案

要將從 multiplatform 專案生成的 Kotlin 框架連接到您的 Xcode 專案：

1. 只有當 `binaries.framework` 組態選項被聲明時，`embedAndSignAppleFrameworkForXcode` 任務才會註冊。在您的 Kotlin Multiplatform 專案中，檢查 `build.gradle.kts` 文件中的 iOS 目標聲明。
2. 在 Xcode 中，雙擊專案名稱打開 iOS 專案設定。
3. 在左側的 **Targets** 部分，選擇您的目標，然後導航到 **Build Phases** 標籤。
4. 點擊 **+** 並選擇 **New Run Script Phase**。

   ![新增執行腳本階段](xcode-run-script-phase-1.png){width=700}

5. 調整以下腳本並將結果貼上到新階段的腳本文字欄位中：

   ```bash
   if [ "YES" = "$OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED" ]; then
       echo "Skipping Gradle build task invocation due to OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED environment variable set to \"YES\""
       exit 0
   fi
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode
   ```

   * 在 `cd` 命令中，指定您的 Kotlin Multiplatform 專案的根目錄路徑，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 命令中，指定共用模組的名稱，例如 `:shared` 或 `:composeApp`。
   
   當您啟動 iOS 運行組態時，IntelliJ IDEA 和 Android Studio 會在啟動 Xcode 建置之前建置 Kotlin 框架依賴項，並將 `OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED` 環境變數設定為 "YES"。所提供的 shell 腳本會檢查此變數，並防止 Kotlin 框架從 Xcode 進行第二次建置。
     
   > 當您為不支援此功能的專案啟動 iOS 運行組態時，IDE 會建議一個修復方案來設定建置防護。
   >
   {style="note"}

6. 禁用 **Based on dependency analysis** 選項。

   ![新增腳本](xcode-run-script-phase-2.png){width=700}

   這可確保 Xcode 在每次建置期間都執行該腳本，並且不會每次都警告缺少輸出依賴項。

7. 將 **Run Script** 階段向上移動，並將其放在 **Compile Sources** 階段之前。

   ![拖曳執行腳本階段](xcode-run-script-phase-3.png){width=700}

8. 在 **Build Settings** 標籤上，禁用 **Build Options** 下的 **User Script Sandboxing** 選項：

   ![使用者腳本沙盒化](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 如果您在未先禁用沙盒化的情況下建置了 iOS 專案，這可能需要重新啟動您的 Gradle Daemon。
   > 停止可能已被沙盒化的 Gradle Daemon 進程：
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {style="tip"}

9. 在 Xcode 中建置專案。如果一切設定正確，專案將成功建置。

> 如果您有不同於預設 `Debug` 或 `Release` 的自訂建置組態，請在 **Build Settings** 標籤上，在 **User-Defined** 下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 設定，並將其設置為 `Debug` 或 `Release`。
>
{style="note"}

## 接下來？

您在使用 Swift Package Manager 時，也可以利用本地整合。[了解如何在本地套件中添加對 Kotlin 框架的依賴項](multiplatform-spm-local-integration.md)。