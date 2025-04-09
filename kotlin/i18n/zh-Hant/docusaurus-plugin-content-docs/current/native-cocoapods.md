---
title: "CocoaPods 概觀與設定"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info

   這是一個本地整合方法。 如果符合以下條件，它可以為您工作：<br/>

   * 您有一個使用 CocoaPods 的 iOS 專案的單一程式碼庫 (mono repository) 設定。
   * 您的 Kotlin Multiplatform 專案具有 CocoaPods 依賴項。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview)

:::

Kotlin/Native 提供了與 [CocoaPods 依賴管理器](https://cocoapods.org/)的整合。 您可以新增對 Pod 程式庫的依賴，以及將具有原生目標的多平台專案用作 CocoaPods 依賴項。

您可以直接在 IntelliJ IDEA 或 Android Studio 中管理 Pod 依賴項，並享受所有額外功能，例如程式碼醒目提示和完成。 您可以使用 Gradle 建構整個 Kotlin 專案，而無需切換到 Xcode。

如果您想更改 Swift/Objective-C 程式碼或在 Apple 模擬器或裝置上執行您的應用程式，您才需要 Xcode。 為了與 Xcode 正確協同工作，您應該[更新您的 Podfile](#update-podfile-for-xcode)。

根據您的專案和目的，您可以在[Kotlin 專案和 Pod 程式庫](native-cocoapods-libraries)以及[Kotlin Gradle 專案和 Xcode 專案](native-cocoapods-xcode)之間新增依賴關係。

## 設定使用 CocoaPods 的環境

使用您選擇的安裝工具安裝 [CocoaPods 依賴管理器](https://cocoapods.org/)：

<Tabs>
<TabItem value="RVM" label="RVM">

1. 如果您還沒有安裝 [Ruby 版本管理器](https://rvm.io/rvm/install)，請安裝它。
2. 安裝 Ruby。您可以選擇特定版本：

    ```bash
    rvm install ruby 3.0.0
    ```

3. 安裝 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem value="Rbenv" label="Rbenv">

1. 如果您還沒有安裝 [GitHub 上的 rbenv](https://github.com/rbenv/rbenv#installation)，請安裝它。
2. 安裝 Ruby。您可以選擇特定版本：

    ```bash
    rbenv install 3.0.0
    ```

3. 將 Ruby 版本設定為特定目錄的本機版本，或設定為整部機器的全域版本：

    ```bash
    rbenv global 3.0.0
    ```
    
4. 安裝 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem value="Default Ruby" label="Default Ruby">

:::note
此安裝方式不適用於配備 Apple M 晶片的裝置。 使用其他工具設定使用 CocoaPods 的環境。

:::

您可以使用 macOS 上預設的 Ruby 安裝 CocoaPods 依賴管理器：

```bash
sudo gem install cocoapods
```

</TabItem>
<TabItem value="Homebrew" label="Homebrew">

:::caution
使用 Homebrew 安裝 CocoaPods 可能會導致相容性問題。

安裝 CocoaPods 時，Homebrew 也會安裝 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem，這是使用 Xcode 所必需的。
但是，它無法使用 Homebrew 更新，如果安裝的 Xcodeproj 尚未支援最新的 Xcode 版本，
您將在 Pod 安裝時遇到錯誤。 如果是這種情況，請嘗試其他工具來安裝 CocoaPods。

:::

1. 如果您還沒有安裝 [Homebrew](https://brew.sh/)，請安裝它。
2. 安裝 CocoaPods：

    ```bash
    brew install cocoapods
    ```

</TabItem>
</Tabs>

如果您在安裝過程中遇到問題，請查看[可能的問題和解決方案](#possible-issues-and-solutions)章節。

## 建立專案

設定好您的環境後，您可以建立一個新的 Kotlin Multiplatform 專案。 為此，請使用 Kotlin Multiplatform 網頁精靈或 Android Studio 的 Kotlin Multiplatform 插件。

### 使用網頁精靈

要使用網頁精靈建立專案並配置 CocoaPods 整合：

1. 開啟 [Kotlin Multiplatform 精靈](https://kmp.jetbrains.com)並為您的專案選擇目標平台。
2. 點擊 **Download (下載)** 按鈕並解壓縮下載的封存檔。
3. 在 Android Studio 中，在功能表中選擇 **File (檔案) | Open (開啟)**。
4. 導航到解壓縮的專案資料夾，然後點擊 **Open (開啟)**。
5. 將 Kotlin CocoaPods Gradle 插件新增到版本目錄。 在 `gradle/libs.versions.toml` 檔案中，
   將以下宣告新增到 `[plugins]` 區塊：
 
   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```
   
6. 導航到您專案的根 `build.gradle.kts` 檔案，並將以下別名新增到 `plugins {}` 區塊：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

7. 開啟您想要整合 CocoaPods 的模組，例如 `composeApp` 模組，並將以下別名新增到 `plugins {}` 區塊：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

現在您已準備好在您的 Kotlin Multiplatform 專案中使用 CocoaPods。

### 在 Android Studio 中

要在 Android Studio 中建立具有 CocoaPods 整合的專案：

1. 將 [Kotlin Multiplatform 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 安裝到 Android Studio。
2. 在 Android Studio 中，在功能表中選擇 **File (檔案)** | **New (新增)** | **New Project (新專案)**。
3. 在專案範本清單中，選擇 **Kotlin Multiplatform App (Kotlin 多平台應用程式)**，然後點擊 **Next (下一步)**。
4. 為您的應用程式命名，然後點擊 **Next (下一步)**。
5. 選擇 **CocoaPods Dependency Manager (CocoaPods 依賴管理器)** 作為 iOS 框架發佈選項。

   <img src="/img/as-project-wizard.png" alt="Android Studio wizard with the Kotlin Multiplatform plugin" width="700" style={{verticalAlign: 'middle'}}/>

6. 保持所有其他選項預設。 點擊 **Finish (完成)**。

   該插件將自動產生設定了 CocoaPods 整合的專案。

## 配置現有專案

如果您已經有一個專案，您可以手動新增和配置 Kotlin CocoaPods Gradle 插件：

1. 在您專案的 `build.gradle(.kts)` 中，同時套用 CocoaPods 插件和 Kotlin Multiplatform 插件：
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
        kotlin("native.cocoapods") version "2.1.20"
    }
    ```

2. 在 `cocoapods` 區塊中配置 Podspec 檔案的 `version`、`summary`、`homepage` 和 `baseName`：
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
        kotlin("native.cocoapods") version "2.1.20"
    }
 
    kotlin {
        cocoapods {
            // Required properties
            // Specify the required Pod version here
            // Otherwise, the Gradle project version is used
            version = "1.0"
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"
   
            // Optional properties
            // Configure the Pod name here instead of changing the Gradle project name
            name = "MyCocoaPod"

            framework {
                // Required properties              
                // Framework name configuration. Use this property instead of deprecated 'frameworkName'
                baseName = "MyFramework"
                
                // Optional properties
                // Specify the framework linking type. It's dynamic by default. 
                isStatic = false
                // Dependency export
                // Uncomment and specify another project module if you have one:
                // export(project(":<your other KMP module>"))
                transitiveExport = false // This is default.
            }

            // Maps custom Xcode configuration to NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > 在 [Kotlin Gradle 插件儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt) 中查看 Kotlin DSL 的完整語法。
    >
    
    
3. 在 IntelliJ IDEA 中執行 **Reload All Gradle Projects (重新載入所有 Gradle 專案)**（或在 Android Studio 中執行 **Sync Project with Gradle Files (將專案與 Gradle 檔案同步)**）
   以重新匯入專案。
4. 產生 [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) 以避免相容性
   在 Xcode 建構期間出現問題。

套用後，CocoaPods 插件會執行以下操作：

* 將 `debug` 和 `release` 框架新增為所有 macOS、iOS、tvOS 和 watchOS 目標的輸出二進位檔。
* 建立一個 `podspec` 任務，該任務會為專案產生一個 [Podspec](https://guides.cocoapods.org/syntax/podspec.html)
檔案。

`Podspec` 檔案包含輸出框架的路徑和腳本階段，這些階段可自動執行在 Xcode 專案建構過程中建構此框架。

## 更新 Xcode 的 Podfile

如果您想將您的 Kotlin 專案匯入到 Xcode 專案：

1. 變更您的 Podfile：

   * 如果您的專案有任何 Git、HTTP 或自訂 Podspec 儲存庫依賴項，您應該在 Podfile 中指定 Podspec 的路徑。

     例如，如果您新增對 `podspecWithFilesExample` 的依賴，請在 Podfile 中宣告 Podspec 的路徑：

     ```ruby
     target 'ios-app' do
        # ... other dependencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path` 應該包含 Pod 的檔案路徑。

   * 當您從自訂 Podspec 儲存庫新增程式庫時，您還應該指定 [位置](https://guides.cocoapods.org/syntax/podfile.html#source)
     在 Podfile 的開頭處指定規格：

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... other dependencies ...
         pod 'example'
     end
     ```

2. 在您的專案目錄中執行 `pod install`。

   當您第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。 此檔案
   包括您的原始 `.xcodeproj` 和 CocoaPods 專案。
3. 關閉您的 `.xcodeproj` 並改為開啟新的 `.xcworkspace` 檔案。 這樣您就可以避免專案依賴項的問題。
4. 在 IntelliJ IDEA 中執行 **Reload All Gradle Projects (重新載入所有 Gradle 專案)**（或在 Android Studio 中執行 **Sync Project with Gradle Files (將專案與 Gradle 檔案同步)**）
   以重新匯入專案。

如果您沒有在 Podfile 中進行這些變更，`podInstall` 任務將會失敗，並且 CocoaPods 插件將在日誌中顯示
錯誤訊息。

## 可能的問題和解決方案

### CocoaPods 安裝

#### Ruby 安裝

CocoaPods 是用 Ruby 建構的，您可以使用 macOS 上應該可用的預設 Ruby 安裝它。
Ruby 1.9 或更高版本具有內建的 RubyGems 套件管理框架，可協助您安裝 [CocoaPods 依賴管理器](https://guides.cocoapods.org/using/getting-started.html#installation)。

如果您在安裝 CocoaPods 並使其運作時遇到問題，請按照[本指南](https://www.ruby-lang.org/en/documentation/installation/)
安裝 Ruby 或參閱 [RubyGems 網站](https://rubygems.org/pages/download/) 以安裝該框架。

#### 版本相容性

我們建議使用最新的 Kotlin 版本。 如果您目前的版本早於 1.7.0，您還需要額外
安裝 [`cocoapods-generate`](https://github.com/square/cocoapods-generate#installation") 插件。

但是，`cocoapods-generate` 與 Ruby 3.0.0 或更高版本不相容。 在這種情況下，請降級 Ruby 或將 Kotlin 升級到 1.7.0 或更高版本。

### 使用 Xcode 時的建構錯誤

CocoaPods 安裝的一些變體可能會導致 Xcode 中出現建構錯誤。
通常，Kotlin Gradle 插件會在 `PATH` 中探索 `pod` 執行檔，但這可能會因您的環境而異。

要明確設定 CocoaPods 安裝路徑，您可以手動或使用 shell 命令將其新增到專案的 `local.properties` 檔案中：

* 如果使用程式碼編輯器，請將以下行新增到 `local.properties` 檔案中：

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 如果使用終端機，請執行以下命令：

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 找不到模組

您可能會遇到與 [C 互操作](native-c-interop) 問題相關的 `module 'SomeSDK' not found` 錯誤。
嘗試以下解決方法以避免此錯誤：

#### 指定框架名稱

1. 瀏覽下載的 Pod 目錄 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...`
   以尋找 `module.modulemap` 檔案。
2. 檢查模組內的框架名稱，例如 `SDWebImageMapKit {}`。 如果框架名稱與 Pod
名稱不符，請明確指定它：

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```
#### 指定標頭

如果 Pod 不包含 `.modulemap` 檔案，例如 `pod("NearbyMessages")`，請明確指定主要標頭：

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

有關更多資訊，請查看 [CocoaPods 文件](https://guides.cocoapods.org/)。 如果沒有任何效果，並且您仍然
遇到此錯誤，請在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中報告問題。

### Rsync 錯誤

您可能會遇到 `rsync error: some files could not be transferred` 錯誤。 這是一個 [已知問題](https://github.com/CocoaPods/CocoaPods/issues/11946)
如果 Xcode 中的應用程式目標已啟用使用者腳本的沙箱，則會發生這種情況。

要解決此問題：

1. 在應用程式目標中停用使用者腳本的沙箱：

   <img src="/img/disable-sandboxing-cocoapods.png" alt="Disable sandboxing CocoaPods" width="700" style={{verticalAlign: 'middle'}}/>

2. 停止可能已進行沙箱處理的 Gradle daemon 進程：

    ```shell
    ./gradlew --stop
    ```