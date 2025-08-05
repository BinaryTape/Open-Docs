[//]: # (title: CocoaPods 概觀與設定)

<tldr>
   這是一種本機整合方法。如果符合以下條件，它可能對您有用：<br/>

   * 您有一個使用 CocoaPods 的 iOS 專案，並採用單一儲存庫設定。
   * 您的 Kotlin Multiplatform 專案具有 CocoaPods 依賴項。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native 提供了與 [CocoaPods 依賴項管理工具](https://cocoapods.org/) 的整合。您可以添加對 Pod 函式庫的依賴項，也可以將 Kotlin 專案用作 CocoaPods 依賴項。

您可以直接在 IntelliJ IDEA 或 Android Studio 中管理 Pod 依賴項，並享受所有附加功能，例如程式碼高亮顯示和自動完成。您可以使用 Gradle 建置整個 Kotlin 專案，而無需切換到 Xcode。 

僅當您需要更改 Swift/Objective-C 程式碼或在 Apple 模擬器或裝置上執行您的應用程式時，才需要 Xcode。若要使用 Xcode，請先[更新您的 Podfile](#update-podfile-for-xcode)。

## 設定使用 CocoaPods 的環境

使用您選擇的安裝工具安裝 [CocoaPods 依賴項管理工具](https://cocoapods.org/)：

<tabs>
<tab title="RVM">

1. 如果尚未安裝 [RVM](https://rvm.io/rvm/install)，請安裝它。
2. 安裝 Ruby。您可以選擇特定版本：

    ```bash
    rvm install ruby 3.0.0
    ```

3. 安裝 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="Rbenv">

1. 如果尚未從 GitHub 安裝 [rbenv](https://github.com/rbenv/rbenv#installation)，請安裝它。
2. 安裝 Ruby。您可以選擇特定版本：

    ```bash
    rbenv install 3.0.0
    ```

3. 將 Ruby 版本設定為特定目錄的本機版本或整機的全域版本：

    ```bash
    rbenv global 3.0.0
    ```
    
4. 安裝 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="預設 Ruby">

> 此安裝方法不適用於配備 Apple M 晶片的裝置。請使用其他工具來設定 CocoaPods 工作環境。
>
{style="note"}

您可以使用 macOS 上應有的預設 Ruby 安裝 CocoaPods 依賴項管理工具：

```bash
sudo gem install cocoapods
```

</tab>
<tab title="Homebrew">

> 使用 Homebrew 安裝 CocoaPods 可能會導致相容性問題。
>
> 安裝 CocoaPods 時，Homebrew 還會安裝 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem，這是使用 Xcode 所必需的。
> 然而，它無法透過 Homebrew 更新，如果已安裝的 Xcodeproj 尚不支援最新的 Xcode 版本，您將會遇到 Pod 安裝錯誤。如果遇到這種情況，請嘗試其他工具來安裝 CocoaPods。
>
{style="warning"}

1. 如果尚未安裝 [Homebrew](https://brew.sh/)，請安裝它。
2. 安裝 CocoaPods：

    ```bash
    brew install cocoapods
    ```

</tab>
</tabs>

如果在安裝過程中遇到問題，請查看[可能的問題與解決方案](#possible-issues-and-solutions)部分。

## 建立專案

設定好環境後，您可以建立一個新的 Kotlin Multiplatform 專案。為此，請使用 Kotlin Multiplatform 網頁精靈或 Android Studio 的 Kotlin Multiplatform 外掛程式。

### 使用網頁精靈

若要使用網頁精靈建立專案並設定 CocoaPods 整合：

1. 開啟 [Kotlin Multiplatform 精靈](https://kmp.jetbrains.com) 並選擇專案的目標平台。
2. 點擊 **Download** (下載) 按鈕並解壓縮下載的封存檔。
3. 在 Android Studio 中，從選單中選擇 **File | Open** (檔案 | 開啟)。
4. 導航到解壓縮的專案資料夾，然後點擊 **Open** (開啟)。
5. 將 Kotlin CocoaPods Gradle 外掛程式新增到版本目錄中。在 `gradle/libs.versions.toml` 檔案中，將以下宣告新增到 `[plugins]` 區塊：
 
   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```
   
6. 導航到專案的根 `build.gradle.kts` 檔案，並將以下別名新增到 `plugins {}` 區塊：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

7. 開啟您想要整合 CocoaPods 的模組，例如 `composeApp` 模組，並將以下別名新增到 `plugins {}` 區塊：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

現在您已準備好[在 Kotlin Multiplatform 專案中設定 CocoaPods](#configure-the-project)。

### 在 Android Studio 中

若要在 Android Studio 中建立整合了 CocoaPods 的專案：

1. 在 Android Studio 中安裝 [Kotlin Multiplatform 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)。
2. 在 Android Studio 中，從選單中選擇 **File** | **New** | **New Project** (檔案 | 新增 | 新增專案)。
3. 在專案範本清單中，選擇 **Kotlin Multiplatform App**，然後點擊 **Next** (下一步)。
4. 為您的應用程式命名，然後點擊 **Next** (下一步)。
5. 選擇 **CocoaPods Dependency Manager** 作為 iOS 框架分發選項。

   ![Android Studio wizard with the Kotlin Multiplatform plugin](as-project-wizard.png){width=700}

6. 保持所有其他選項為預設值。點擊 **Finish** (完成)。

   該外掛程式將自動產生已設定好 CocoaPods 整合的專案。

## 設定專案

若要在多平台專案中設定 Kotlin CocoaPods Gradle 外掛程式：

1. 在專案的共享模組 `build.gradle(.kts)` 中，應用 CocoaPods 外掛程式以及 Kotlin Multiplatform 外掛程式。

   > 如果您已使用 [網頁精靈](#using-web-wizard) 或 [Android Studio 的 Kotlin Multiplatform 外掛程式](#in-android-studio) 建立專案，請跳過此步驟。
   > 
   {style="note"}
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. 在 `cocoapods` 區塊中設定 Podspec 檔案的 `version`、`summary`、`homepage` 和 `baseName`：
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
 
    kotlin {
        cocoapods {
            // 必填屬性
            // 在此處指定所需的 Pod 版本
            // 否則，將使用 Gradle 專案版本
            version = "1.0"
            summary = "Kotlin/Native 模組的一些描述"
            homepage = "Kotlin/Native 模組首頁的連結"
   
            // 選填屬性
            // 在此處設定 Pod 名稱，而不是更改 Gradle 專案名稱
            name = "MyCocoaPod"

            framework {
                // 必填屬性              
                // 框架名稱設定。請使用此屬性而非已淘汰的 'frameworkName'
                baseName = "MyFramework"
                
                // 選填屬性
                // 指定框架連結類型。預設為動態連結。 
                isStatic = false
                // 依賴項匯出
                // 如果您有其他專案模組，請取消註解並指定：
                // export(project(":<您的其他 KMP 模組>"))
                transitiveExport = false // 這是預設值。
            }

            // 將自訂 Xcode 設定對應到 NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > 請參閱 [Kotlin Gradle 外掛程式儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt) 中 Kotlin DSL 的完整語法。
    >
    {style="note"}
    
3. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects** (建置 | 重新載入所有 Gradle 專案) (或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files** (檔案 | 將專案與 Gradle 檔案同步)) 以重新匯入專案。
4. 產生 [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) 以避免 Xcode 建置期間的相容性問題。

應用後，CocoaPods 外掛程式會執行以下操作：

* 為所有 macOS、iOS、tvOS 和 watchOS 目標添加 `debug` 和 `release` 框架作為輸出二進位檔。
* 建立一個 `podspec` 任務，為專案產生一個 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 檔案。

該 `Podspec` 檔案包含指向輸出框架的路徑，以及在 Xcode 專案建置過程中自動建置此框架的腳本階段。

## 更新 Xcode 的 Podfile

如果您想將 Kotlin 專案匯入 Xcode 專案：

1. 在 Kotlin 專案的 iOS 部分，更改 Podfile：

   * 如果您的專案有任何 Git、HTTP 或自訂 Podspec 儲存庫依賴項，請在 Podfile 中指定 Podspec 的路徑。

     例如，如果您新增了對 `podspecWithFilesExample` 的依賴項，請在 Podfile 中宣告 Podspec 的路徑：

     ```ruby
     target 'ios-app' do
        # ... other dependencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path` 應包含 Pod 的檔案路徑。

   * 如果您從自訂 Podspec 儲存庫新增函式庫，請在 Podfile 開頭指定 specs 的[位置](https://guides.cocoapods.org/syntax/podfile.html#source)：

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... other dependencies ...
         pod 'example'
     end
     ```

2. 在專案目錄中執行 `pod install`。

   當您首次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。此檔案包含您的原始 `.xcodeproj` 和 CocoaPods 專案。
3. 關閉您的 `.xcodeproj` 並改為開啟新的 `.xcworkspace` 檔案。這樣可以避免專案依賴項的問題。
4. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects** (建置 | 重新載入所有 Gradle 專案) (或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files** (檔案 | 將專案與 Gradle 檔案同步)) 以重新匯入專案。

如果您未在 Podfile 中進行這些更改，`podInstall` 任務將會失敗，並且 CocoaPods 外掛程式將在日誌中顯示錯誤訊息。

## 可能的問題與解決方案

### CocoaPods 安裝 {initial-collapse-state="collapsed" collapsible="true"}

#### Ruby 安裝

CocoaPods 是使用 Ruby 建置的，您可以使用 macOS 上應有的預設 Ruby 安裝它。Ruby 1.9 或更高版本具有內建的 RubyGems 套件管理框架，可幫助您安裝 [CocoaPods 依賴項管理工具](https://guides.cocoapods.org/using/getting-started.html#installation)。

如果您在安裝 CocoaPods 並使其運作時遇到問題，請遵循[此指南](https://www.ruby-lang.org/en/documentation/installation/)安裝 Ruby 或參考 [RubyGems 網站](https://rubygems.org/pages/download/)安裝該框架。

#### 版本相容性

我們建議使用最新的 Kotlin 版本。如果您目前的版本早於 1.7.0，您將需要額外安裝 [`cocoapods-generate`](https://github.com/square/cocoapods-generate#installation") 外掛程式。

然而，`cocoapods-generate` 不相容於 Ruby 3.0.0 或更高版本。在這種情況下，請降級 Ruby 或將 Kotlin 升級到 1.7.0 或更高版本。

### 使用 Xcode 時的建置錯誤 {initial-collapse-state="collapsed" collapsible="true"}

某些 CocoaPods 安裝變體可能導致 Xcode 中的建置錯誤。通常，Kotlin Gradle 外掛程式會在 `PATH` 中發現 `pod` 可執行檔，但這可能因您的環境而異。

若要明確設定 CocoaPods 安裝路徑，您可以手動將其新增到專案的 `local.properties` 檔案中，或使用 shell 命令：

* 如果使用程式碼編輯器，請將以下行新增到 `local.properties` 檔案中：

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 如果使用終端機，請執行以下命令：

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 找不到模組或框架 {initial-collapse-state="collapsed" collapsible="true"}

安裝 Pods 時，您可能會遇到與 [C interop](https://kotlinlang.org/docs/native-c-interop.html) 問題相關的 `module 'SomeSDK' not found` 或 `framework 'SomeFramework' not found` 錯誤。若要解決此類錯誤，請嘗試以下解決方案：

#### 更新套件

更新您的安裝工具和已安裝的套件 (gems)：

<tabs>
<tab title="RVM">

1. 更新 RVM：

   ```bash
   rvm get stable
   ```

2. 更新 Ruby 的套件管理工具 RubyGems：

    ```bash
    gem update --system
    ```

3. 將所有已安裝的 gem 升級到最新版本：

    ```bash
    gem update
    ```

</tab>
<tab title="Rbenv">

1. 更新 Rbenv：

    ```bash
    cd ~/.rbenv
    git pull
    ```

2. 更新 Ruby 的套件管理工具 RubyGems：

    ```bash
    gem update --system
    ```

3. 將所有已安裝的 gem 升級到最新版本：

    ```bash
    gem update
    ```

</tab>
<tab title="Homebrew">

1. 更新 Homebrew 套件管理工具： 

   ```bash
   brew update
   ```

2. 將所有已安裝的套件升級到最新版本：

   ```bash
   brew upgrade
   ````

</tab>
</tabs>

#### 指定框架名稱 

1. 瀏覽下載的 Pod 目錄 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...` 尋找 `module.modulemap` 檔案。
2. 檢查模組內的框架名稱，例如 `SDWebImageMapKit {}`。如果框架名稱與 Pod 名稱不符，請明確指定：

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```

#### 指定標頭檔

如果 Pod 不包含 `.modulemap` 檔案，例如 `pod("NearbyMessages")`，請明確指定主要標頭檔：

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

如需更多資訊，請查看 [CocoaPods 文件](https://guides.cocoapods.org/)。如果以上方法均無效，且您仍然遇到此錯誤，請在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中回報問題。

### Rsync 錯誤 {initial-collapse-state="collapsed" collapsible="true"}

您可能會遇到 `rsync error: some files could not be transferred` 錯誤。這是一個[已知問題](https://github.com/CocoaPods/CocoaPods/issues/11946)，當 Xcode 中的應用程式目標啟用了使用者腳本的沙盒化時會發生。

若要解決此問題：

1. 在應用程式目標中禁用使用者腳本的沙盒化：

   ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png){width=700}

2. 停止可能已沙盒化的 Gradle 守護行程：

    ```shell
    ./gradlew --stop
    ```

## 接下來

* [在您的 Kotlin 專案中新增對 Pod 函式庫的依賴項](multiplatform-cocoapods-libraries.md)
* [設定 Kotlin 專案與 Xcode 專案之間的依賴項](multiplatform-cocoapods-xcode.md)
* [查看完整的 CocoaPods Gradle 外掛程式 DSL 參考](multiplatform-cocoapods-dsl-reference.md)