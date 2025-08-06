[//]: # (title: Swift 套件匯出設定)

<tldr>
   這是一種遠端整合方法。如果符合以下條件，它會對您有所幫助：<br/>

   * 您希望將最終應用程式的程式碼庫與通用程式碼庫分開。
   * 您已經在本地機器上設定了一個以 iOS 為目標的 Kotlin Multiplatform 專案。
   * 您在 iOS 專案中使用 Swift 套件管理器 (SPM) 來處理依賴項。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview.md)
</tldr>

您可以將 Kotlin/Native 針對 Apple 目標的輸出設定為 Swift 套件管理器 (SPM) 依賴項。

考慮一個包含 iOS 目標的 Kotlin Multiplatform 專案。您可能希望將此 iOS 二進位檔作為依賴項提供給在原生 Swift 專案上工作的 iOS 開發人員。使用 Kotlin Multiplatform 工具，您可以提供一個能與其 Xcode 專案無縫整合的構件。

本教學將展示如何透過使用 Kotlin Gradle 外掛程式建構 [XCFrameworks](multiplatform-build-native-binaries.md#build-xcframeworks) 來實現這一點。

## 設定遠端整合

為了讓您的框架可供使用，您需要上傳兩個檔案：

*   包含 XCFramework 的 ZIP 壓縮檔。您需要將其上傳到一個方便且可直接存取的檔案儲存服務（例如，透過建立 GitHub release 並附加該壓縮檔，或使用 Amazon S3 或 Maven）。
    選擇最容易整合到您工作流程中的選項。
*   描述套件的 `Package.swift` 檔案。您需要將其推送到一個單獨的 Git 儲存庫。

#### 專案設定選項 {initial-collapse-state="collapsed" collapsible="true"}

在本教學中，您將把 XCFramework 作為二進位檔儲存在您偏好的檔案儲存服務中，並將 `Package.swift` 檔案儲存在單獨的 Git 儲存庫中。

然而，您可以以不同的方式設定您的專案。考慮以下組織 Git 儲存庫的選項：

*   將 `Package.swift` 檔案和應封裝到 XCFramework 中的程式碼儲存在不同的 Git 儲存庫中。
    這允許將 Swift 清單獨立於其描述的專案進行版本控制。這是推薦的方法：它允許擴展並且通常更容易維護。
*   將 `Package.swift` 檔案放在您的 Kotlin Multiplatform 程式碼旁邊。這是一種更直接的方法，但
    請記住，在這種情況下，Swift 套件和程式碼將使用相同的版本控制。SPM 使用 Git 標籤進行套件版本控制，這可能與您的專案使用的標籤衝突。
*   將 `Package.swift` 檔案儲存在消費者專案的儲存庫中。這有助於避免版本控制和維護問題。
    然而，這種方法可能導致消費者專案的多儲存庫 SPM 設定和進一步自動化出現問題：

    *   在一個多套件專案中，只有一個消費者套件可以依賴於外部模組（以避免專案內部的依賴衝突）。因此，所有依賴於您的 Kotlin Multiplatform 模組的邏輯都應該封裝在一個
        特定的消費者套件中。
    *   如果您使用自動化 CI 流程發布 Kotlin Multiplatform 專案，則此流程需要包含將更新的 `Package.swift` 檔案發布到消費者儲存庫。這可能導致消費者儲存庫的衝突更新，因此 CI 中的此類階段可能難以維護。

### 設定您的多平台專案

在以下範例中，Kotlin Multiplatform 專案的共用程式碼儲存在 `shared` 模組中。
如果您的專案結構不同，請將程式碼和路徑範例中的「shared」替換為您的模組名稱。

要設定 XCFramework 的發布：

1.  更新您的 `shared/build.gradle.kts` 設定檔，在 iOS 目標列表中加入 `XCFramework` 呼叫：

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

### 準備 XCFramework 和 Swift 套件清單

1.  將 `Shared.xcframework` 資料夾壓縮成 ZIP 檔案，並計算生成壓縮檔的校驗和 (checksum)，例如：

    `swift package compute-checksum Shared.xcframework.zip`

2.  將 ZIP 檔案上傳到您選擇的檔案儲存服務。該檔案應可透過直接連結存取。例如，以下是您如何使用 GitHub 中的發布功能來完成：

    <deflist collapsible="true">
        <def title="上傳到 GitHub release">
            <list type="decimal">
                <li>前往 <a href="https://github.com">GitHub</a> 並登入您的帳戶。</li>
                <li>導航到您要建立 release 的儲存庫。</li>
                <li>在右側的 **Releases** 區段中，點擊 **Create a new release** 連結。</li>
                <li>填寫 release 資訊，新增或建立新標籤，指定 release 標題並編寫描述。</li>
                <li>
                    <p>透過底部的 **Attach binaries by dropping them here or selecting them** 欄位上傳包含 XCFramework 的 ZIP 檔案：</p>
                    <img src="github-release-description.png" alt="Fill in the release information" width="700"/>
                </li>
                <li>點擊 **Publish release**。</li>
                <li>
                    <p>在 release 的 **Assets** 區段下，右鍵點擊 ZIP 檔案並選擇 **Copy link address** 或您瀏覽器中的類似選項：</p>
                    <img src="github-release-link.png" alt="Copy the link to the uploaded file" width="500"/>
                </li>
          </list>
        </def>
    </deflist>

3.  [建議] 檢查連結是否有效且檔案可以下載。在終端機中，執行以下命令：

    ```none
    curl <downloadable link to the uploaded XCFramework ZIP file>
    ```

4.  選擇任何目錄並在本地建立一個 `Package.swift` 檔案，其中包含以下程式碼：

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

5.  在 `url` 欄位中，指定指向您的 XCFramework ZIP 壓縮檔的連結。
6.  [建議] 要驗證生成的清單，您可以在包含 `Package.swift` 檔案的目錄中執行以下 shell 命令：

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```

    如果清單正確，輸出將描述找到的任何錯誤，或顯示成功的下載和解析結果。

7.  將 `Package.swift` 檔案推送到您的遠端儲存庫。確保建立並推送一個帶有套件語義化版本 (semantic version) 的 Git 標籤。

### 添加套件依賴項

現在這兩個檔案都可存取了，您可以將您建立的套件依賴項添加到現有的客戶端 iOS 專案中，或建立一個新專案。要添加套件依賴項：

1.  在 Xcode 中，選擇 **File | Add Package Dependencies** (檔案 | 添加套件依賴項)。
2.  在搜尋欄位中，輸入包含 `Package.swift` 檔案的 Git 儲存庫的 URL：

    ![指定包含套件檔案的儲存庫](multiplatform-spm-url.png)

3.  點擊 **Add package** (添加套件) 按鈕，然後為套件選擇產品和對應的目標。

    > 如果您正在建立一個 Swift 套件，對話框會有所不同。在這種情況下，點擊 **Copy package** (複製套件) 按鈕。
    > 這會將一行 `.package` 複製到您的剪貼簿中。將此行貼到您自己的 `Package.swift` 檔案的 [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency) 區塊中，並將必要的產品添加到適當的 `Target.Dependency` 區塊中。
    >
    {style="tip"}

### 檢查您的設定

要檢查所有設定是否正確，請在 Xcode 中測試導入：

1.  在您的專案中，導航到您的 UI 視圖檔案，例如 `ContentView.swift`。
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

3.  確保預覽已更新為新文字。

## 將多個模組匯出為 XCFramework

為了讓來自多個 Kotlin Multiplatform 模組的程式碼可作為 iOS 二進位檔使用，請將這些模組組合在一個單一的聚合模組 (umbrella module) 中。然後，建構並匯出此聚合模組的 XCFramework。

例如，您有一個 `network` 和一個 `database` 模組，您將它們組合在一個 `together` 模組中：

1.  在 `together/build.gradle.kts` 檔案中，指定依賴項和框架設定：

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

2.  每個包含的模組都應設定其 iOS 目標，例如：

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

3.  在 `together` 資料夾內建立一個空的 Kotlin 檔案，例如 `together/src/commonMain/kotlin/Together.kt`。
    這是一個暫時的解決方案，因為 Gradle 腳本目前無法在導出模組不包含任何原始碼的情況下組裝框架。

4.  執行組裝框架的 Gradle 任務：

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5.  按照 [上一節](#prepare-the-xcframework-and-the-swift-package-manifest) 中的步驟準備 `together.xcframework`：將其壓縮、計算校驗和、將壓縮後的 XCFramework 上傳到檔案儲存服務、建立並推送 `Package.swift` 檔案。

現在，您可以將依賴項導入到 Xcode 專案中。在添加 `import together` 指令後，您應該可以從 `network` 和 `database` 模組中匯入類別並在 Swift 程式碼中使用。