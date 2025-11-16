[//]: # (title: CocoaPods 概觀與設定)

<tldr>
   這是一種本機整合方法。如果符合以下條件，它會對您有用：<br/>

   * 您有一個使用 CocoaPods 的 iOS 專案的單一儲存庫（mono repository）設定。
   * 您的 Kotlin Multiplatform 專案具有 CocoaPods 依賴項。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native 提供與 [CocoaPods 依賴項管理器](https://cocoapods.org/)的整合。您可以添加對 Pod 函式庫的依賴項，也可以將 Kotlin 專案用作 CocoaPods 依賴項。

您可以直接在 IntelliJ IDEA 或 Android Studio 中管理 Pod 依賴項，並享有所有附加功能，例如程式碼高亮顯示與補齊。您可以在不切換到 Xcode 的情況下，使用 Gradle 建置整個 Kotlin 專案。

您僅在需要更改 Swift/Objective-C 程式碼或在 Apple 模擬器或裝置上執行應用程式時才需要 Xcode。若要使用 Xcode，請先[更新您的 Podfile](#update-podfile-for-xcode)。

## 設定使用 CocoaPods 的環境

使用您選擇的安裝工具安裝 [CocoaPods 依賴項管理器](https://cocoapods.org/)：

<Tabs>
<TabItem title="RVM">

1. 如果您尚未安裝 [RVM](https://rvm.io/rvm/install)，請安裝它。
2. 安裝 Ruby。您可以選擇特定版本：

    ```bash
    rvm install ruby %rubyVersion%
    ```

3. 安裝 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="Rbenv">

1. 如果您尚未安裝 [GitHub 上的 rbenv](https://github.com/rbenv/rbenv#installation)，請安裝它。
2. 安裝 Ruby。您可以選擇特定版本：

    ```bash
    rbenv install %rubyVersion%
    ```

3. 將 Ruby 版本設定為特定目錄的本機或整部機器的全域：

    ```bash
    rbenv global %rubyVersion%
    ```
    
4. 安裝 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="預設 Ruby">

> 這種安裝方式不適用於配備 Apple M 晶片的裝置。請使用其他工具來設定使用 CocoaPods 的環境。
>
{style="note"}

您可以使用 macOS 上應有的預設 Ruby 來安裝 CocoaPods 依賴項管理器：

```bash
sudo gem install cocoapods
```

</TabItem>
<TabItem title="Homebrew">

> 使用 Homebrew 安裝 CocoaPods 可能會導致相容性問題。
>
> 當安裝 CocoaPods 時，Homebrew 也會安裝 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem，這是使用 Xcode 所必需的。然而，它無法透過 Homebrew 更新，如果已安裝的 Xcodeproj 尚不支援最新的 Xcode 版本，您將在 Pod 安裝時遇到錯誤。如果發生這種情況，請嘗試使用其他工具安裝 CocoaPods。
>
{style="warning"}

1. 如果您尚未安裝 [Homebrew](https://brew.sh/)，請安裝它。
2. 安裝 CocoaPods：

    ```bash
    brew install cocoapods
    ```

</TabItem>
</Tabs>

如果在安裝過程中遇到問題，請檢查 [可能的問題與解決方案](#possible-issues-and-solutions) 部分。

## 建立專案

當您的 CocoaPods 環境設定完成後，您可以配置您的 Kotlin Multiplatform 專案以使用 Pods。以下步驟說明如何在一個全新生成的專案上進行配置：

1. 使用 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)（在 macOS 上）或 [Kotlin Multiplatform 網路精靈](https://kmp.jetbrains.com) 產生一個新的 Android 和 iOS 專案。
   如果使用網路精靈，請解壓縮壓縮檔並將專案匯入您的 IDE。
2. 在 `gradle/libs.versions.toml` 檔案中，將 Kotlin CocoaPods Gradle 外掛程式添加到 
   `[plugins]` 區塊：

   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```

3. 導航到您專案的根目錄 `build.gradle.kts` 檔案，並將以下別名添加到 `plugins {}` 區塊：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

4. 開啟您想要整合 CocoaPods 的模組，例如 `composeApp` 模組，並將以下別名添加到 `build.gradle.kts` 檔案的 `plugins {}` 區塊：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

現在您已準備好[在您的 Kotlin Multiplatform 專案中配置 CocoaPods](#configure-the-project)。

## 配置專案

若要在您的多平台專案中配置 Kotlin CocoaPods Gradle 外掛程式：

1. 在您專案的共享模組的 `build.gradle(.kts)` 中，應用 CocoaPods 外掛程式以及 Kotlin Multiplatform 外掛程式。

   > 如果您是使用 [IDE 外掛程式或網路精靈](#create-a-project) 建立專案，請跳過此步驟。
   > 
   {style="note"}
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. 在 `cocoapods` 區塊中配置 Podspec 檔案的 `version`、`summary`、`homepage` 和 `baseName`：
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
 
    kotlin {
        cocoapods {
            // 必要屬性
            // 在此處指定所需的 Pod 版本
            // 否則，將使用 Gradle 專案版本
            version = "1.0"
            summary = "Kotlin/Native 模組的某些描述"
            homepage = "Kotlin/Native 模組首頁連結"
   
            // 可選屬性
            // 在此處配置 Pod 名稱，而非更改 Gradle 專案名稱
            name = "MyCocoaPod"

            framework {
                // 必要屬性              
                // 框架名稱配置。請使用此屬性而非已棄用的 'frameworkName'
                baseName = "MyFramework"
                
                // 可選屬性
                // 指定框架連結類型。預設為動態連結。 
                isStatic = false
                // 依賴項匯出
                // 如果您有其他專案模組，請取消註解並指定：
                // export(project(":<your other KMP module>"))
                transitiveExport = false // 這是預設值。
            }

            // 將自訂 Xcode 配置映射到 NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > 請參閱 [Kotlin Gradle 外掛程式儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt) 中的 Kotlin DSL 完整語法。
    >
    {style="note"}
    
3. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。
4. 產生 [Gradle 包裝器](https://docs.gradle.org/current/userguide/gradle_wrapper.html) 以避免 Xcode 建置期間的相容性問題。

應用後，CocoaPods 外掛程式會執行以下操作：

* 將 `debug` 和 `release` 框架作為所有 macOS、iOS、tvOS 和 watchOS 目標的輸出二進位檔案。
* 建立一個 `podspec` 任務，該任務為專案產生一個 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 檔案。

`Podspec` 檔案包含指向輸出框架的路徑和腳本階段，這些腳本階段可在 Xcode 專案的建置流程中自動化建置此框架。

## 更新 Xcode 的 Podfile

如果您想將 Kotlin 專案匯入 Xcode 專案：

1. 在您的 Kotlin 專案的 iOS 部分中，對 Podfile 進行更改：

   * 如果您的專案有任何 Git、HTTP 或自訂 Podspec 儲存庫依賴項，請在 Podfile 中指定 Podspec 的路徑。

     例如，如果您添加了對 `podspecWithFilesExample` 的依賴項，請在 Podfile 中宣告 Podspec 的路徑：

     ```ruby
     target 'ios-app' do
        # ... other dependencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path` 應該包含 Pod 的檔案路徑。

   * 如果您從自訂 Podspec 儲存庫添加函式庫，請在 Podfile 的開頭指定 specs 的[位置](https://guides.cocoapods.org/syntax/podfile.html#source)：

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... other dependencies ...
         pod 'example'
     end
     ```

2. 在您的專案目錄中執行 `pod install`。

   當您第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。此檔案包含您原始的 `.xcodeproj` 和 CocoaPods 專案。
3. 關閉您的 `.xcodeproj` 並改為開啟新的 `.xcworkspace` 檔案。這樣可以避免專案依賴項的問題。
4. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。

如果您不在 Podfile 中進行這些更改，`podInstall` 任務將會失敗，CocoaPods 外掛程式將在日誌中顯示錯誤訊息。

## 可能的問題與解決方案

### CocoaPods 安裝 {initial-collapse-state="collapsed" collapsible="true"}

#### Ruby 安裝

CocoaPods 是使用 Ruby 建置的，您可以使用 macOS 上應有的預設 Ruby 來安裝它。Ruby 1.9 或更高版本內建有 RubyGems 套件管理框架，可幫助您安裝 [CocoaPods 依賴項管理器](https://guides.cocoapods.org/using/getting-started.html#installation)。

如果您在安裝 CocoaPods 並使其運作時遇到問題，請遵循[本指南](https://www.ruby-lang.org/en/documentation/installation/)來安裝 Ruby，或參考 [RubyGems 網站](https://rubygems.org/pages/download/)來安裝該框架。

#### 版本相容性

我們建議使用最新的 Kotlin 版本。
此 CocoaPods 設定所需的最低版本為 1.7.0。

### 使用 Xcode 時的建置錯誤 {initial-collapse-state="collapsed" collapsible="true"}

CocoaPods 安裝的某些變體可能導致 Xcode 中的建置錯誤。通常，Kotlin Gradle 外掛程式會在 `PATH` 中發現 `pod` 可執行檔，但這可能會因您的環境而異。

若要明確設定 CocoaPods 安裝路徑，您可以手動或使用 shell 命令將其添加到專案的 `local.properties` 檔案中：

* 如果使用程式碼編輯器，請將以下行添加到 `local.properties` 檔案中：

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 如果使用終端機，請執行以下命令：

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 找不到模組或框架 {initial-collapse-state="collapsed" collapsible="true"}

安裝 Pods 時，您可能會遇到與 [C 互通（interop）](https://kotlinlang.org/docs/native-c-interop.html) 問題相關的 `找不到模組 'SomeSDK'` 或 `找不到框架 'SomeFramework'` 錯誤。若要解決此類錯誤，請嘗試以下解決方案：

#### 更新套件

更新您的安裝工具和已安裝的套件（gems）：

<Tabs>
<TabItem title="RVM">

1. 更新 RVM：

   ```bash
   rvm get stable
   ```

2. 更新 Ruby 的套件管理器 RubyGems：

    ```bash
    gem update --system
    ```

3. 將所有已安裝的 gems 升級到最新版本：

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Rbenv">

1. 更新 Rbenv：

    ```bash
    cd ~/.rbenv
    git pull
    ```

2. 更新 Ruby 的套件管理器 RubyGems：

    ```bash
    gem update --system
    ```

3. 將所有已安裝的 gems 升級到最新版本：

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Homebrew">

1. 更新 Homebrew 套件管理器： 

   ```bash
   brew update
   ```

2. 將所有已安裝的套件升級到最新版本：

   ```bash
   brew upgrade
   ````

</TabItem>
</Tabs>

#### 指定框架名稱 

1. 檢查下載的 Pod 目錄 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...` 中是否存在 `module.modulemap` 檔案。
2. 檢查模組內的框架名稱，例如 `SDWebImageMapKit {}`。如果框架名稱與 Pod 名稱不匹配，請明確指定：

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```

#### 指定標頭

如果 Pod 不包含 `.modulemap` 檔案，例如 `pod("NearbyMessages")`，請明確指定主標頭：

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

有關更多資訊，請查閱 [CocoaPods 文件](https://guides.cocoapods.org/)。如果所有方法都無效，並且您仍然遇到此錯誤，請在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中報告問題。

### Rsync 錯誤 {initial-collapse-state="collapsed" collapsible="true"}

您可能會遇到 `rsync error: some files could not be transferred` 錯誤。這是一個[已知問題](https://github.com/CocoaPods/CocoaPods/issues/11946)，當 Xcode 中的應用程式目標啟用了使用者腳本的沙盒化時會發生。

為了解決這個問題：

1. 在應用程式目標中禁用使用者腳本的沙盒化：

   ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png){width=700}

2. 停止可能已沙盒化的 Gradle 守護程式程序：

    ```shell
    ./gradlew --stop
    ```

## 後續步驟

* [在您的 Kotlin 專案中添加對 Pod 函式庫的依賴項](multiplatform-cocoapods-libraries.md)
* [設定 Kotlin 專案與 Xcode 專案之間的依賴項](multiplatform-cocoapods-xcode.md)
* [查看完整的 CocoaPods Gradle 外掛程式 DSL 參考](multiplatform-cocoapods-dsl-reference.md)