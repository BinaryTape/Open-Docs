---
title: "Swift 套件導出設定"
---
:::info

   這是一種遠端整合方法。如果符合以下情況，它對您可能有效：<br/>

   *   您想要將最終應用程式的程式碼庫與通用程式碼庫分開。
   *   您已經在本機設定了一個以 iOS 為目標的 Kotlin Multiplatform 專案。
   *   您使用 Swift Package Manager (SPM) 來處理 iOS 專案中的相依性。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview)

:::

您可以設定 Kotlin/Native 輸出來用於 Apple 目標，並將其作為 Swift Package Manager (SPM) 相依性使用。

假設有一個具有 iOS 目標的 Kotlin Multiplatform 專案。您可能希望使這個 iOS 二進位檔作為相依性提供給從事原生 Swift 專案的 iOS 開發人員。使用 Kotlin Multiplatform 工具，您可以提供
一個可以與他們的 Xcode 專案無縫整合的工件 (Artifact)。

本教學示範如何透過使用 Kotlin Gradle 插件構建 [XCFrameworks](multiplatform-build-native-binaries#build-xcframeworks) 來實現此目的。

## 設定遠端整合

為了使您的框架 (Framework) 可用，您需要上傳兩個檔案：

*   一個包含 XCFramework 的 ZIP 壓縮檔。您需要將其上傳到具有直接存取的便捷檔案儲存空間（例如，
    建立一個附加了壓縮檔的 GitHub 版本、使用 Amazon S3 或 Maven）。
    選擇最容易整合到您工作流程中的選項。
*   描述套件的 `Package.swift` 檔案。您需要將其推送到單獨的 Git 儲存庫。

#### 專案配置選項

在本教學中，您將 XCFramework 作為二進位檔儲存在您喜歡的檔案儲存空間中，並將 `Package.swift` 檔案
儲存在單獨的 Git 儲存庫中。

但是，您可以以不同的方式配置您的專案。請考慮以下用於組織 Git 儲存庫的選項：

*   將 `Package.swift` 檔案和應封裝到 XCFramework 中的程式碼儲存在單獨的 Git 儲存庫中。
    這允許對 Swift 清單進行版本控制，使其與檔案描述的專案分開。這是建議的方法：
    它允許擴展並且通常更容易維護。
*   將 `Package.swift` 檔案放在 Kotlin Multiplatform 程式碼旁邊。這是一種更直接的方法，但
    請記住，在這種情況下，Swift 套件和程式碼將使用相同的版本控制。SPM 使用
    Git 標籤來對套件進行版本控制，這可能會與用於您專案的標籤發生衝突。
*   將 `Package.swift` 檔案儲存在消費者專案的儲存庫中。這有助於避免版本控制和維護問題。
    但是，這種方法可能會導致消費者專案的多儲存庫 SPM 設定以及進一步自動化的問題：

    *   在多套件專案中，只有一個消費者套件可以依賴於外部模組（以避免專案內的相依性衝突
        ）。因此，所有依賴於您的 Kotlin Multiplatform 模組的邏輯都應封裝在一個
        特定的消費者套件中。
    *   如果您使用自動化 CI 流程發佈 Kotlin Multiplatform 專案，則此流程需要包括
        將更新後的 `Package.swift` 檔案發佈到消費者儲存庫。這可能會導致消費者儲存庫的更新發生衝突，因此 CI 中的此階段可能難以維護。

### 配置您的 Multiplatform 專案

在以下範例中，Kotlin Multiplatform 專案的共享程式碼在本機儲存在 `shared` 模組中。
如果您的專案結構不同，請在程式碼和路徑範例中使用您模組的名稱替換「shared」。

要設定發佈 XCFramework：

1.  使用 iOS 目標列表中的 `XCFramework` 呼叫更新您的 `shared/build.gradle.kts` 配置檔案：

    ```kotlin
    import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework
    
    kotlin {
        // Other Kotlin Multiplatform targets
        // ...
        // Name of the module to be imported in the consumer project
        val xcframeworkName = "Shared"
        val xcf = XCFramework(xcframeworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64(),
        ).forEach { 
            it.binaries.framework {
                baseName = xcframeworkName
                
                // Specify CFBundleIdentifier to uniquely identify the framework
                binaryOption("bundleId", "org.example.${xcframeworkName}")
                xcf.add(this)
                isStatic = true
            }
        }
        //...
    }
    ```
    
2.  執行 Gradle 任務以建立框架：
    
    ```shell
    ./gradlew :shared:assembleSharedXCFramework
    ```
   
    產生的框架將作為專案目錄中的 `shared/build/XCFrameworks/release/Shared.xcframework` 資料夾建立。

    > 如果您使用 Compose Multiplatform 專案，請使用以下 Gradle 任務：
    >
    > ```shell
    > ./gradlew :composeApp:assembleSharedXCFramework
    > ```
    >
    > 然後，您可以在 `composeApp/build/XCFrameworks/release/Shared.xcframework` 資料夾中找到產生的框架。
    >
    

### 準備 XCFramework 和 Swift 套件清單 (Manifest)

1.  將 `Shared.xcframework` 資料夾壓縮到 ZIP 檔案中，並計算產生的壓縮檔的校驗和 (Checksum)，例如：
    
    `swift package compute-checksum Shared.xcframework.zip`

2.  將 ZIP 檔案上傳到您選擇的檔案儲存空間。該檔案應該可以透過
    直接連結存取。例如，以下是如何使用 GitHub 中的版本來執行此操作：
<h3>上傳到 GitHub 版本</h3>
<list type="decimal">
<li>前往 <a href="https://github.com">GitHub</a> 並登入您的帳戶。</li>
<li>導覽到您想要建立版本的儲存庫。</li>
<li>在右側的 <b>Releases</b> 區段中，按一下 <b>Create a new release</b> 連結。</li>
<li>填寫版本資訊，新增或建立新標籤，指定版本標題並撰寫描述。</li>
<li>
<p>
   透過底部的 <b>Attach binaries by dropping them here or selecting them</b> 欄位上傳包含 XCFramework 的 ZIP 檔案：
</p>
                   <img src="/img/github-release-description.png" alt="Fill in the release information" width="700"/>
               </li>
<li>按一下 <b>Publish release</b>。</li>
<li>
<p>
   在版本的 <b>Assets</b> 區段下，以滑鼠右鍵按一下 ZIP 檔案，然後在瀏覽器中選擇 <b>Copy link address</b> 或類似的選項：
</p>
                   <img src="/img/github-release-link.png" alt="Copy the link to the uploaded file" width="500"/>
               </li>
</list>
       
   

3.  [建議] 檢查連結是否有效以及檔案是否可以下載。在終端機中，執行以下命令：

    ```none
    curl <downloadable link to the uploaded XCFramework ZIP file>
    ```

4.  選擇任何目錄，並在本機建立一個包含以下程式碼的 `Package.swift` 檔案：

    ```Swift
    // swift-tools-version:5.3
    import PackageDescription
    
    let package = Package(
       name: "Shared",
       platforms: [
         .iOS(.v14),
       ],
       products: [
          .library(name: "Shared", targets: ["Shared"])
       ],
       targets: [
          .binaryTarget(
             name: "Shared",
             url: "<link to the uploaded XCFramework ZIP file>",
             checksum:"<checksum calculated for the ZIP file>")
       ]
    )
    ```
    
5.  在 `url` 欄位中，指定指向包含 XCFramework 的 ZIP 壓縮檔的連結。
6.  [建議] 為了驗證產生的清單，您可以在目錄中執行以下 shell 命令
    使用 `Package.swift` 檔案：

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```
    
    輸出將描述找到的任何錯誤，或者如果清單正確，則顯示成功的下載和剖析結果。

7.  將 `Package.swift` 檔案推送到您的遠端儲存庫。確保建立並推送一個帶有
    套件語義版本的 Git 標籤。

### 新增套件相依性

現在兩個檔案都可以存取，您可以將您建立的套件的相依性新增到現有的用戶端 iOS
專案，或建立一個新專案。要新增套件相依性：

1.  在 Xcode 中，選擇 **File | Add Package Dependencies**。
2.  在搜尋欄位中，輸入 Git 儲存庫的 URL，其中包含 `Package.swift` 檔案：

    <img src="/img/native-spm-url.png" alt="Specify repo with the package file" style={{verticalAlign: 'middle'}}/>

3.  按一下 **Add package** 按鈕，然後選擇套件的產品和相應的目標。

    > 如果您正在建立 Swift 套件，則對話框將有所不同。在這種情況下，請按一下 **Copy package** 按鈕。
    > 這將在您的剪貼簿中放置一個 `.package` 行。將此行貼到您自己的 `Package.swift` 檔案的 [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency)
    > 區塊中，並將必要的產品新增到適當的 `Target.Dependency` 區塊中。
    >
    

### 檢查您的設定

要檢查所有內容是否設定正確，請在 Xcode 中測試導入：

1.  在您的專案中，導覽到您的 UI 視圖檔案，例如 `ContentView.swift`。
2.  將程式碼替換為以下程式碼片段：
    
    ```Swift
    import SwiftUI
    import Shared
    
    struct ContentView: View {
        var body: some View {
            VStack {
                Image(systemName: "globe")
                    .imageScale(.large)
                    .foregroundStyle(.tint)
                Text("Hello, world! \(Shared.Platform_iosKt.getPlatform().name)")
            }
            .padding()
        }
    }
    
    #Preview {
        ContentView()
    }
    ```
    
    在這裡，您導入 `Shared` XCFramework，然後使用它在 `Text` 欄位中獲取平台名稱。

3.  確保預覽已使用新文字更新。

## 將多個模組匯出為 XCFramework

要使多個 Kotlin Multiplatform 模組中的程式碼作為 iOS 二進位檔提供，請將這些模組組合到一個
總括模組中。然後，構建並匯出此總括模組的 XCFramework。

例如，您有一個 `network` 和一個 `database` 模組，您將它們組合在一個 `together` 模組中：

1.  在 `together/build.gradle.kts` 檔案中，指定相依性和框架配置：

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget `->`
            // Same as in the example above,
            // with added export calls for dependencies
            iosTarget.binaries.framework {
                export(projects.network)
                export(projects.database)
    
                baseName = frameworkName
                xcf.add(this)
            }
        }
    
        // Dependencies set as "api" (as opposed to "implementation") to export underlying modules
        sourceSets {
            commonMain.dependencies {
                api(projects.network)
                api(projects.database)
            }
        }
    }
    ```

2.  每個包含的模組都應配置其 iOS 目標，例如：

    ```kotlin
    kotlin {
        androidTarget {
            //...
        }
        
        iosX64()
        iosArm64()
        iosSimulatorArm64()
        
        //...
    }
    ```

3.  在 `together` 資料夾中建立一個空的 Kotlin 檔案，例如 `together/src/commonMain/kotlin/Together.kt`。
    這是一種變通方法，因為如果匯出的模組不包含任何原始碼，則 Gradle 腳本目前無法組裝框架。

4.  執行組裝框架的 Gradle 任務：

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5.  按照[上一節](#prepare-the-xcframework-and-the-swift-package-manifest)中的步驟準備
    `together.xcframework`：將其存檔，計算校驗和，將存檔的 XCFramework 上傳到檔案儲存空間，
    建立並推送 `Package.swift` 檔案。

現在，您可以將相依性匯入到 Xcode 專案中。新增 `import together` 指令後，
您應該可以從 `network` 和 `database` 模組中匯入類別，以在 Swift 程式碼中使用。