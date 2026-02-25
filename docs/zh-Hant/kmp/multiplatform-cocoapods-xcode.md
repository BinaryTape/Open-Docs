[//]: # (title: 將 Kotlin 專案作為 CocoaPods 相依性使用)

<tldr>

* 在新增 Pod 相依性之前，請先[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
* 你可以在我們的 [GitHub 存儲庫](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)中找到範例專案。

</tldr>

你可以將整個 Kotlin 專案作為 Pod 相依性使用。若要執行此操作，你需要在專案的 Podfile 中包含該相依性，並指定其名稱以及包含產生的 Podspec 的專案目錄路徑。

此相依性將與該專案一起自動組建（及重新組建）。這種方法簡化了匯入到 Xcode 的過程，因為不再需要手動編寫對應的 Gradle 任務和 Xcode 組建步驟。

你可以在一個 Kotlin 專案與具有一個或多個目標的 Xcode 專案之間新增相依性。也可以在一個 Kotlin 專案與多個 Xcode 專案之間新增相依性。但是，在這種情況下，你需要為每個 Xcode 專案手動呼叫 `pod install`。對於單個 Xcode 專案，這是自動完成的。

> * 為了正確地將相依性匯入到 Kotlin/Native 模組中，Podfile 必須包含 [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) 或 [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) 指示詞。
> * 如果你沒有指定最低部署目標版本，而某個相依 Pod 需要更高的部署目標，則會收到錯誤。
>
{style="note"}

## 具有單個目標的 Xcode 專案

要在具有單個目標的 Xcode 專案中將 Kotlin 專案作為 Pod 相依性使用：

1. 如果你還沒有 Xcode 專案，請建立一個。
2. 在 Xcode 中，確保在應用程式目標的 **Build Options** 下停用 **User Script Sandboxing**：

   ![停用 CocoaPods 沙盒](disable-sandboxing-cocoapods.png)

3. 在 Kotlin 專案的 iOS 部分，建立一個 Podfile。
4. 在共用模組的 `build.gradle(.kts)` 檔案中，使用 `podfile = project.file()` 新增 Podfile 的路徑。

   此步驟透過為你的 Podfile 呼叫 `pod install`，幫助同步你的 Xcode 專案與 Kotlin 專案相依性。
5. 指定 Pod 程式庫的最低部署目標版本：

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

6. 在 Podfile 中，新增你要包含在 Xcode 專案中的 Kotlin 專案名稱和路徑：

    ```ruby
    target 'ios-app' do
        use_frameworks!
        platform :ios, '16.0'
    
        # iosApp 的 Pods
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. 在你的專案目錄中執行 `pod install`。

   當你第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。此檔案包含你原始的 `.xcodeproj` 和 CocoaPods 專案。
8. 關閉你的 `.xcodeproj` 並改為開啟新的 `.xcworkspace` 檔案。透過這種方式，你可以避免專案相依性方面的問題。
9. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。

## 具有多個目標的 Xcode 專案

要在具有多個目標的 Xcode 專案中將 Kotlin 專案作為 Pod 相依性使用：

1. 如果你還沒有 Xcode 專案，請建立一個。
2. 在 Kotlin 專案的 iOS 部分，建立一個 Podfile。
3. 在共用模組的 `build.gradle(.kts)` 檔案中，使用 `podfile = project.file()` 新增專案 Podfile 的路徑。

   此步驟透過為你的 Podfile 呼叫 `pod install`，幫助同步你的 Xcode 專案與 Kotlin 專案相依性。
4. 使用 `pod()` 向你要在專案中使用的 Pod 程式庫新增相依性。
5. 為每個目標指定 Pod 程式庫的最低部署目標版本：

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

6. 在 Podfile 中，新增你要包含在 Xcode 專案中的 Kotlin 專案名稱和路徑：

    ```ruby
    target 'iosApp' do
      use_frameworks!
      platform :ios, '16.0'
   
      # iosApp 的 Pods
      pod 'kotlin_library', :path => '../kotlin-library'
    end

    target 'TVosApp' do
      use_frameworks!
      platform :tvos, '16.0'

      # TVosApp 的 Pods
      pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. 在你的專案目錄中執行 `pod install`。

   當你第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。此檔案包含你原始的 `.xcodeproj` 和 CocoaPods 專案。
8. 關閉你的 `.xcodeproj` 並改為開啟新的 `.xcworkspace` 檔案。透過這種方式，你可以避免專案相依性方面的問題。
9. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。

## 接下來的操作

* [在你的 Kotlin 專案中新增對 Pod 程式庫的相依性](multiplatform-cocoapods-libraries.md)
* [查看如何將框架連接到你的 iOS 專案](multiplatform-direct-integration.md)
* [查看完整的 CocoaPods Gradle 外掛程式 DSL 參考](multiplatform-cocoapods-dsl-reference.md)