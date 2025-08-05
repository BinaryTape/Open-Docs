[//]: # (title: 使用 Kotlin 專案作為 CocoaPods 依賴)

<tldr>

*   在加入 Pod 依賴之前，請[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
*   您可以在我們的 [GitHub 儲存庫](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)中找到一個範例專案。

</tldr>

您可以將整個 Kotlin 專案作為 Pod 依賴使用。為此，您需要將此依賴包含在您專案的 Podfile 中，並指定其名稱以及包含已生成 Podspec 的專案目錄路徑。

此依賴將與該專案一起自動建置（和重建）。這種方法簡化了導入 Xcode 的過程，無需手動編寫相應的 Gradle 任務和 Xcode 建置步驟。

您可以將 Kotlin 專案與具有一個或多個目標的 Xcode 專案之間新增依賴。也可以在 Kotlin 專案與多個 Xcode 專案之間新增依賴。然而，在這種情況下，您需要為每個 Xcode 專案手動呼叫 `pod install`。對於單一 Xcode 專案，這是自動完成的。

> *   為正確地將依賴導入 Kotlin/Native 模組，Podfile 必須包含 [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) 或 [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) 指令。
> *   如果您未指定最低部署目標版本，且依賴的 Pod 需要更高的部署目標，您將會收到錯誤。
>
{style="note"}

## 具有一個目標的 Xcode 專案

若要在具有一個目標的 Xcode 專案中將 Kotlin 專案用作 Pod 依賴：

1.  如果沒有 Xcode 專案，請建立一個。
2.  在 Xcode 中，請確保在應用程式目標的 **Build Options** 下停用 **User Script Sandboxing**：

    ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png)

3.  在 Kotlin 專案的 iOS 部分建立一個 Podfile。
4.  在共享模組的 `build.gradle(.kts)` 檔案中，使用 `podfile = project.file()` 新增 Podfile 的路徑。

    此步驟透過為您的 Podfile 呼叫 `pod install`，幫助您的 Xcode 專案與 Kotlin 專案依賴同步。
5.  為 Pod 函式庫指定最低部署目標版本：

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

6.  在 Podfile 中，新增您要包含在 Xcode 專案中的 Kotlin 專案的名稱和路徑：

    ```ruby
    target 'ios-app' do
        use_frameworks!
        platform :ios, '16.0'
    
        # Pods for iosApp
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7.  在專案目錄中執行 `pod install`。

    當您第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。此檔案包含您的原始 `.xcodeproj` 和 CocoaPods 專案。
8.  關閉您的 `.xcodeproj`，並改為開啟新的 `.xcworkspace` 檔案。這樣可以避免專案依賴問題。
9.  在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新導入專案。

## 具有多個目標的 Xcode 專案

若要在具有多個目標的 Xcode 專案中將 Kotlin 專案用作 Pod 依賴：

1.  如果沒有 Xcode 專案，請建立一個。
2.  在 Kotlin 專案的 iOS 部分建立一個 Podfile。
3.  在共享模組的 `build.gradle(.kts)` 檔案中，使用 `podfile = project.file()` 新增您專案 Podfile 的路徑。

    此步驟透過為您的 Podfile 呼叫 `pod install`，幫助您的 Xcode 專案與 Kotlin 專案依賴同步。
4.  使用 `pod()` 新增您要在專案中使用的 Pod 函式庫的依賴。
5.  對於每個目標，指定 Pod 函式庫的最低部署目標版本：

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
            // Specify the path to the Podfile
            podfile = project.file("../severalTargetsXcodeProject/Podfile")
        }
    }
    ```

6.  在 Podfile 中，新增您要包含在 Xcode 專案中的 Kotlin 專案的名稱和路徑：

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

7.  在專案目錄中執行 `pod install`。

    當您第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。此檔案包含您的原始 `.xcodeproj` 和 CocoaPods 專案。
8.  關閉您的 `.xcodeproj`，並改為開啟新的 `.xcworkspace` 檔案。這樣可以避免專案依賴問題。
9.  在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新導入專案。

## 接下來

*   [在您的 Kotlin 專案中新增 Pod 函式庫的依賴](multiplatform-cocoapods-libraries.md)
*   [查看如何將框架連接到您的 iOS 專案](multiplatform-direct-integration.md)
*   [查看完整的 CocoaPods Gradle 外掛程式 DSL 參考](multiplatform-cocoapods-dsl-reference.md)