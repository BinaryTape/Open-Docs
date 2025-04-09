---
title: "將 Kotlin Gradle 專案作為 CocoaPods 依賴項使用"
---
要使用具有原生目標的 Kotlin Multiplatform 專案作為 CocoaPods 依賴項，[請完成初始配置](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)。
您可以透過其名稱和包含產生的 Podspec 的專案目錄路徑，將此類依賴項包含在 Xcode 專案的 Podfile 中。

此依賴項將與此專案一起自動建置（和重建）。 這種方法簡化了匯入到 Xcode 的過程，而無需手動編寫相應的 Gradle 任務和 Xcode 建置步驟。

您可以在 Kotlin Gradle 專案和具有一個或多個目標的 Xcode 專案之間新增依賴項。 也可以在 Gradle 專案和多個 Xcode 專案之間新增依賴項。 但是，在這種情況下，您需要為每個 Xcode 專案手動呼叫 `pod install` 來新增依賴項。 在其他情況下，它是自動完成的。

:::note
* 為了將依賴項正確匯入到 Kotlin/Native 模組中，`Podfile` 必須包含
  [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) 或
  [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) 指令。
* 如果您未指定最小部署目標版本，並且依賴的 Pod 需要更高的部署目標，
  您將收到錯誤。

:::

## 具有一個目標的 Xcode 專案

1. 如果您尚未建立具有 `Podfile` 的 Xcode 專案，請先建立。
2. 請務必在應用程式目標中的 **Build Options**（建置選項）下停用 **User Script Sandboxing**（使用者腳本沙箱）：

   <img src="/img/disable-sandboxing-cocoapods.png" alt="Disable sandboxing CocoaPods" style={{verticalAlign: 'middle'}}/>

3. 將 Xcode 專案 `Podfile` 的路徑與 `podfile = project.file(..)` 新增到 Kotlin 專案的 `build.gradle(.kts)` 檔案中。
   此步驟有助於透過為您的 `Podfile` 呼叫 `pod install` 來同步您的 Xcode 專案與 Gradle 專案依賴項。
4. 指定 Pod 函式庫的最小部署目標版本。

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

5. 將您要包含在 Xcode 專案中的 Gradle 專案的名稱和路徑新增到 `Podfile`。

    ```ruby
    use_frameworks!

    platform :ios, '16.0'

    target 'ios-app' do
            pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

6. 在您的專案目錄中執行 `pod install`。

   當您第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。 此檔案
   包含您原始的 `.xcodeproj` 和 CocoaPods 專案。
7. 關閉您的 `.xcodeproj` 並改為開啟新的 `.xcworkspace` 檔案。 這樣可以避免專案依賴項的問題。
8. 在 IntelliJ IDEA 中執行 **Reload All Gradle Projects**（重新載入所有 Gradle 專案）（或在 Android Studio 中執行 **Sync Project with Gradle Files**（將專案與 Gradle 檔案同步））
   以重新匯入專案。

## 具有多個目標的 Xcode 專案

1. 如果您尚未建立具有 `Podfile` 的 Xcode 專案，請先建立。
2. 將 Xcode 專案 `Podfile` 的路徑與 `podfile = project.file(..)` 新增到 Kotlin 專案的 `build.gradle(.kts)`。
   此步驟有助於透過為您的 `Podfile` 呼叫 `pod install` 來同步您的 Xcode 專案與 Gradle 專案依賴項。
3. 使用 `pod()` 將依賴項新增到您想要在專案中使用的 Pod 函式庫。
4. 針對每個目標，指定 Pod 函式庫的最小部署目標版本。

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
            podfile = project.file("../severalTargetsXcodeProject/Podfile") // specify the path to the Podfile
        }
    }
    ```

5. 將您要包含在 Xcode 專案中的 Gradle 專案的名稱和路徑新增到 `Podfile`。

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

6. 在您的專案目錄中執行 `pod install`。

   當您第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。 此檔案
   包含您原始的 `.xcodeproj` 和 CocoaPods 專案。
7. 關閉您的 `.xcodeproj` 並改為開啟新的 `.xcworkspace` 檔案。 這樣可以避免專案依賴項的問題。
8. 在 IntelliJ IDEA 中執行 **Reload All Gradle Projects**（重新載入所有 Gradle 專案）（或在 Android Studio 中執行 **Sync Project with Gradle Files**（將專案與 Gradle 檔案同步））
   以重新匯入專案。

您可以在[此處](https://github.com/Kotlin/kmm-with-cocoapods-multitarget-xcode-sample)找到範例專案。

## 接下來

請參閱[將 framework 連接到您的 iOS 專案](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html#connect-the-framework-to-your-ios-project)
以了解如何將自訂建置腳本新增到 Xcode 專案中的建置階段。