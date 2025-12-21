[//]: # (title: Swift 套件匯出設定)

<tldr>
   這是一種遠端整合方法。在以下情況下，它可能適合您：<br/>

   * 您想將最終應用程式的程式碼庫與通用程式碼庫分開。
   * 您已經在本地機器上設定了一個針對 iOS 的 Kotlin Multiplatform 專案。
   * 您在 iOS 專案中使用 Swift 套件管理器來處理相依性。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview.md)
</tldr>

您可以將 Apple 目標的 Kotlin/Native 輸出設定為 Swift 套件管理器 (SPM) 的相依性來使用。

考慮一個具有 iOS 目標的 Kotlin Multiplatform 專案。您可能希望將此 iOS 二進位檔作為相依性提供給開發原生 Swift 專案的 iOS 開發者。使用 Kotlin Multiplatform 工具，您可以提供一個能與他們的 Xcode 專案無縫整合的構件。

本教學將展示如何使用 Kotlin Gradle 外掛程式來建構 [XCFrameworks](multiplatform-build-native-binaries.md#build-xcframeworks)。

## 設定遠端整合

為了使您的框架可被使用，您需要上傳兩個檔案：

* 一個包含 XCFramework 的 ZIP 壓縮檔。您需要將其上傳到一個方便且可直接存取的文件儲存空間（例如，在 GitHub 發布中附加此壓縮檔、使用 Amazon S3 或 Maven）。
  選擇最容易整合到您工作流程中的選項。
* 描述套件的 `Package.swift` 檔案。您需要將其推送到一個單獨的 Git 儲存庫。

#### 專案設定選項 {initial-collapse-state="collapsed" collapsible="true"}

在本教學中，您將把 XCFramework 作為二進位檔儲存在您偏好的檔案儲存空間中，並將 `Package.swift` 檔案儲存在一個單獨的 Git 儲存庫中。

不過，您可以以不同的方式配置您的專案。考慮以下組織 Git 儲存庫的選項：

* 將 `Package.swift` 檔案和應封裝到 XCFramework 中的程式碼儲存在不同的 Git 儲存庫中。這允許 Swift 描述檔與其描述的專案分開版本控制。這是推薦的方法：它允許擴展，並且通常更容易維護。
* 將 `Package.swift` 檔案放在您的 Kotlin Multiplatform 程式碼旁邊。這是一種更直接的方法，但請記住，在這種情況下，Swift 套件和程式碼將使用相同的版本控制。SPM 使用 Git 標籤來對套件進行版本控制，這可能會與您專案中使用的標籤產生衝突。
* 將 `Package.swift` 檔案儲存在消費者專案的儲存庫中。這有助於避免版本控制和維護問題。然而，這種方法可能會導致消費者專案的多儲存庫 SPM 設定和進一步自動化方面產生問題：

  * 在一個多套件專案中，只有一個消費者套件可以依賴外部模組（以避免專案內部產生相依性衝突）。因此，所有依賴您的 Kotlin Multiplatform 模組的邏輯都應該封裝在一個特定的消費者套件中。
  * 如果您使用自動化的 CI 流程發布 Kotlin Multiplatform 專案，則此流程需要包含將更新的 `Package.swift` 檔案發布到消費者儲存庫。這可能會導致消費者儲存庫的更新產生衝突，因此 CI 中的此階段可能難以維護。

### 配置您的 Multiplatform 專案

在以下範例中，Kotlin Multiplatform 專案的共享程式碼本地儲存在 `shared` 模組中。
如果您的專案結構不同，請在程式碼和路徑範例中將「shared」替換為您的模組名稱。

要設定 XCFramework 的發布：

1. 使用 iOS 目標列表中的 `XCFramework` 呼叫更新您的 `shared/build.gradle.kts` 設定檔：

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
   
2. 執行 Gradle 任務以建立框架：
   
   ```shell
   ./gradlew :shared:assembleSharedXCFramework
   ```
  
   生成的框架將在您的專案目錄中建立為 `shared/build/XCFrameworks/release/Shared.xcframework` 資料夾。

   > 如果您使用 Compose Multiplatform 專案，請使用以下 Gradle 任務：
   >
   > ```shell
   > ./gradlew :composeApp:assembleSharedXCFramework
   > ```
   >
   > 然後您可以在 `composeApp/build/XCFrameworks/release/Shared.xcframework` 資料夾中找到生成的框架。
   >
   {style="tip"}

### 準備 XCFramework 和 Swift 套件描述檔

1. 將 `Shared.xcframework` 資料夾壓縮成一個 ZIP 檔案，並計算生成的壓縮檔的校驗和，例如：
   
   `swift package compute-checksum Shared.xcframework.zip`

2. 將 ZIP 檔案上傳到您選擇的文件儲存空間。該檔案應該可以透過直接連結存取。例如，以下是您如何使用 GitHub 中的發布來執行此操作：
   
   <deflist collapsible="true">
       <def title="上傳至 GitHub 發布">
           <list type="decimal">
               <li>前往 <a href="https://github.com">GitHub</a> 並登入您的帳戶。</li>
               <li>導航至您要建立發布的儲存庫。</li>
               <li>在右側的<b>發布 (Releases)</b> 部分中，點擊<b>建立新發布 (Create a new release)</b> 連結。</li>
               <li>填寫發布資訊、新增或建立新標籤、指定發布標題並編寫描述。</li>
               <li>
                   <p>透過底部的<b>透過拖放或選擇二進位檔來附加 (Attach binaries by dropping them here or selecting them)</b> 欄位上傳包含 XCFramework 的 ZIP 檔案：</p>
                   <img src="github-release-description.png" alt="填寫發布資訊" width="700"/>
               </li>
               <li>點擊<b>發布發行版 (Publish release)</b>。</li>
               <li>
                   <p>在發布的<b>資產 (Assets)</b> 部分下，右鍵點擊 ZIP 檔案並選擇<b>複製連結地址 (Copy link address)</b> 或瀏覽器中的類似選項：</p>
                   <img src="github-release-link.png" alt="複製已上傳檔案的連結" width="500"/>
               </li>
         </list>
       </def>
   </deflist>

3. [推薦] 檢查連結是否有效以及檔案是否可下載。在終端機中，執行以下命令：

    ```none
    curl <downloadable link to the uploaded XCFramework ZIP file>
    ```

4. 選擇任何目錄並在本地建立一個包含以下程式碼的 `Package.swift` 檔案：

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
   
5. 在 `url` 欄位中，指定您的 ZIP 壓縮檔（包含 XCFramework）的連結。
6. [推薦] 要驗證生成的描述檔，您可以在包含 `Package.swift` 檔案的目錄中執行以下 Shell 命令：

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```
    
    如果描述檔正確，輸出將描述找到的任何錯誤或顯示成功的下載和解析結果。

7. 將 `Package.swift` 檔案推送到您的遠端儲存庫。請務必建立並推送帶有套件語義化版本的 Git 標籤。

### 新增套件相依性

現在兩個檔案都可存取了，您可以將建立的套件的相依性新增到現有的客戶端 iOS 專案中，或建立一個新專案。要新增套件相依性：

1. 在 Xcode 中，選擇 **檔案 (File) | 新增套件相依性 (Add Package Dependencies)**。
2. 在搜尋欄位中，輸入包含 `Package.swift` 檔案的 Git 儲存庫 URL：

   ![指定含有套件檔案的儲存庫](multiplatform-spm-url.png)

3. 點擊**新增套件 (Add package)** 按鈕，然後為套件選擇產品和對應的目標。

   > 如果您正在建立一個 Swift 套件，對話框會有所不同。在這種情況下，點擊**複製套件 (Copy package)** 按鈕。
   > 這會將一行 `.package` 放入您的剪貼簿。將此行貼到您自己的 `Package.swift` 檔案的 [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency) 區塊中，並將必要的產品新增到適當的 `Target.Dependency` 區塊中。
   >
   {style="tip"}

### 檢查您的設定

為了檢查所有設定是否正確，請在 Xcode 中測試導入：

1. 在您的專案中，導航到您的 UI 檢視檔案，例如 `ContentView.swift`。
2. 將程式碼替換為以下程式碼片段：
   
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

3. 確保預覽已更新為新文字。

## 將多個模組匯出為 XCFramework

為了將來自多個 Kotlin Multiplatform 模組的程式碼作為 iOS 二進位檔提供，請將這些模組組合成一個單一的傘狀模組。然後，建構並匯出此傘狀模組的 XCFramework。

例如，您有一個 `network` 和一個 `database` 模組，您將它們組合成一個 `together` 模組：

1. 在 `together/build.gradle.kts` 檔案中，指定相依性和框架配置：

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget ->
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

2. 每個包含的模組都應配置其 iOS 目標，例如：

    ```kotlin
    kotlin {
        android {
            //...
        }
        
        iosX64()
        iosArm64()
        iosSimulatorArm64()
        
        //...
    }
    ```

3. 在 `together` 資料夾中建立一個空的 Kotlin 檔案，例如 `together/src/commonMain/kotlin/Together.kt`。
   這是一個權宜之計，因為如果匯出的模組不包含任何原始碼，Gradle 腳本目前無法組裝框架。

4. 執行組裝框架的 Gradle 任務：

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5. 依照 [上一節](#prepare-the-xcframework-and-the-swift-package-manifest) 的步驟準備 `together.xcframework`：將其壓縮、計算校驗和、將壓縮的 XCFramework 上傳到文件儲存空間、建立並推送 `Package.swift` 檔案。

現在，您可以將相依性導入 Xcode 專案。新增 `import together` 指令後，您應該可以從 `network` 和 `database` 模組中匯入類別到 Swift 程式碼。