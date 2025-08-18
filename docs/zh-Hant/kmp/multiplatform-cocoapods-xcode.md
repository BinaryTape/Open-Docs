[//]: # (title: 將 Kotlin 專案作為 CocoaPods 依賴項使用)

<tldr>

* 在新增 Pod 依賴項之前，請[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
* 您可以在我們的 [GitHub 儲存庫](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)中找到一個範例專案。

</tldr>

您可以將整個 Kotlin 專案作為 Pod 依賴項使用。為此，您需要在專案的 Podfile 中包含此類依賴項，指定其名稱以及包含生成的 Podspec 的專案目錄的路徑。

此依賴項將隨此專案自動建置（並重新建置）。這種方法簡化了匯入 Xcode 的過程，無需手動編寫相應的 Gradle 任務和 Xcode 建置步驟。

您可以在 Kotlin 專案和具有一個或多個目標的 Xcode 專案之間新增依賴項。在 Kotlin 專案和多個 Xcode 專案之間新增依賴項也是可行的。然而，在這種情況下，您需要為每個 Xcode 專案手動呼叫 `pod install`。對於單個 Xcode 專案，此操作會自動完成。

> * 為了將依賴項正確匯入 Kotlin/Native 模組，Podfile 必須包含 [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) 或 [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) 指令之一。
> * 如果您未指定最低部署目標版本，且某個依賴 Pod 需要更高的部署目標，您將會遇到錯誤。
>
{style="note"}

## 具有單一目標的 Xcode 專案

若要將 Kotlin 專案作為 Pod 依賴項在具有單一目標的 Xcode 專案中使用：

1. 如果您沒有 Xcode 專案，請建立一個。
2. 在 Xcode 中，請確保在應用程式目標的 **建置選項 (Build Options)** 下停用 **使用者腳本沙盒 (User Script Sandboxing)**：

   ![停用 CocoaPods 沙盒](disable-sandboxing-cocoapods.png)

3. 在您的 Kotlin 專案的 iOS 部分中，建立一個 Podfile。
4. 在共用模組的 `build.gradle(.kts)` 檔案中，使用 `podfile = project.file()` 新增 Podfile 的路徑。

   這一步驟透過為您的 Podfile 呼叫 `pod install` 來幫助同步您的 Xcode 專案與 Kotlin 專案的依賴項。
5. 指定 Pod 函式庫的最低部署目標版本：

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"
   
            pod("SDWebImage") {
                version = "5.20.0"
            }
            podfile = project.file("../ios-app/Podfile")
        }
    }
    ```

6. 在 Podfile 中，新增您想要包含在 Xcode 專案中的 Kotlin 專案的名稱和路徑：

    ```ruby
    target 'ios-app' do
        use_frameworks!
        platform :ios, '16.0'
    
        # Pods for iosApp
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. 在您的專案目錄中執行 `pod install`。

   當您第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。此檔案包含您原始的 `.xcodeproj` 和 CocoaPods 專案。
8. 關閉您的 `.xcodeproj` 並改為開啟新的 `.xcworkspace` 檔案。這樣可以避免專案依賴問題。
9. 在 IntelliJ IDEA 中執行 **建置 (Build)** | **重新載入所有 Gradle 專案 (Reload All Gradle Projects)**（或在 Android Studio 中執行 **檔案 (File)** | **與 Gradle 檔案同步專案 (Sync Project with Gradle Files)**）以重新匯入專案。

## 具有多個目標的 Xcode 專案

若要將 Kotlin 專案作為 Pod 依賴項在具有多個目標的 Xcode 專案中使用：

1. 如果您沒有 Xcode 專案，請建立一個。
2. 在您的 Kotlin 專案的 iOS 部分中，建立一個 Podfile。
3. 在共用模組的 `build.gradle(.kts)` 檔案中，使用 `podfile = project.file()` 新增專案 Podfile 的路徑。

   這一步驟透過為您的 Podfile 呼叫 `pod install` 來幫助同步您的 Xcode 專案與 Kotlin 專案的依賴項。
4. 使用 `pod()` 為您想在專案中使用的 Pod 函式庫新增依賴項。
5. 對於每個目標，指定 Pod 函式庫的最低部署目標版本：

    ```kotlin
    kotlin {
        iosArm64()
        tvosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"
            tvos.deploymentTarget = "16.0"

            pod("SDWebImage") {
                version = "5.20.0"
            }
            // 指定 Podfile 的路徑
            podfile = project.file("../severalTargetsXcodeProject/Podfile")
        }
    }
    ```

6. 在 Podfile 中，新增您想要包含在 Xcode 專案中的 Kotlin 專案的名稱和路徑：

    ```ruby
    target 'iosApp' do
      use_frameworks!
      platform :ios, '16.0'
   
      # Pods for iosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end

    target 'TVosApp' do
      use_frameworks!
      platform :tvos, '16.0'

      # Pods for TVosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. 在您的專案目錄中執行 `pod install`。

   當您第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。此檔案包含您原始的 `.xcodeproj` 和 CocoaPods 專案。
8. 關閉您的 `.xcodeproj` 並改為開啟新的 `.xcworkspace` 檔案。這樣可以避免專案依賴問題。
9. 在 IntelliJ IDEA 中執行 **建置 (Build)** | **重新載入所有 Gradle 專案 (Reload All Gradle Projects)**（或在 Android Studio 中執行 **檔案 (File)** | **與 Gradle 檔案同步專案 (Sync Project with Gradle Files)**）以重新匯入專案。

## 後續步驟

* [在您的 Kotlin 專案中新增對 Pod 函式庫的依賴](multiplatform-cocoapods-libraries.md)
* [了解如何將框架連接到您的 iOS 專案](multiplatform-direct-integration.md)
* [查看完整的 CocoaPods Gradle 外掛程式 DSL 參考](multiplatform-cocoapods-dsl-reference.md)