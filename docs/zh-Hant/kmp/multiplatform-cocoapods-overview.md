[//]: # (title: CocoaPods 概覽與設定)

<tldr>
   這是一種本機整合方法。如果符合以下情況，此方法可能適合您：<br/>

   * 您擁有一個包含使用 CocoaPods 的 iOS 專案的 Monorepo 設定。
   * 您的 Kotlin Multiplatform 專案具有 CocoaPods 相依性。<br/>

   [選擇最適合您的整合方法](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native 提供了與 [CocoaPods 相依性管理器](https://cocoapods.org/) 的整合。您可以新增對 Pod 程式庫的相依性，也可以將 Kotlin 專案作為 CocoaPods 相依性使用。

> CocoaPods 整合方法無法與用於 [直接整合](multiplatform-direct-integration.md) 的 `embedAndSignAppleFrameworkForXcode` 機制同時使用。
>
{style="warning"}

您可以直接在 IntelliJ IDEA 或 Android Studio 中管理 Pod 相依性，並享有程式碼醒目提示與補全等所有額外功能。您可以使用 Gradle 組建整個 Kotlin 專案，而無需切換到 Xcode。 

只有在您想要變更 Swift/Objective-C 程式碼，或在 Apple 模擬器或裝置上執行應用程式時，才需要 Xcode。若要使用 Xcode，請先 [更新您的 Podfile](#update-podfile-for-xcode)。

## 設定 CocoaPods 的工作環境

使用您選擇的安裝工具安裝 [CocoaPods 相依性管理器](https://cocoapods.org/)：

<Tabs>
<TabItem title="RVM">

1. 如果您尚未安裝 [RVM](https://rvm.io/rvm/install)，請先進行安裝。
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

1. 如果您尚未安裝 [來自 GitHub 的 rbenv](https://github.com/rbenv/rbenv#installation)，請先進行安裝。
2. 安裝 Ruby。您可以選擇特定版本：

    ```bash
    rbenv install %rubyVersion%
    ```

3. 將 Ruby 版本設定為特定目錄的本機版本或整個電腦的全域版本：

    ```bash
    rbenv global %rubyVersion%
    ```
    
4. 安裝 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="Default Ruby">

> 此安裝方式不適用於配備 Apple M 晶片的裝置。請使用其他工具來設定 CocoaPods 的工作環境。
>
{style="note"}

您可以使用 macOS 預設提供的 Ruby 來安裝 CocoaPods 相依性管理器：

```bash
sudo gem install cocoapods
```

</TabItem>
<TabItem title="Homebrew">

> 使用 Homebrew 安裝 CocoaPods 可能會導致相容性問題。
>
> 安裝 CocoaPods 時，Homebrew 也會安裝組建 Xcode 專案所需的 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem。
> 然而，它無法透過 Homebrew 更新，如果安裝的 Xcodeproj 尚未支援最新的 Xcode 版本，您在安裝 Pod 時會遇到錯誤。如果是這種情況，請嘗試使用其他工具安裝 CocoaPods。
>
{style="warning"}

1. 如果您尚未安裝 [Homebrew](https://brew.sh/)，請先進行安裝。
2. 安裝 CocoaPods：

    ```bash
    brew install cocoapods
    ```

</TabItem>
</Tabs>

如果您在安裝過程中遇到問題，請參閱 [可能的問題與解決方案](#possible-issues-and-solutions) 章節。

## 建立專案

設定好 CocoaPods 環境後，您就可以設定 Kotlin Multiplatform 專案來搭配 Pod 使用。以下步驟顯示了在新產生的專案上的組態設定：

1. 使用 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 或 [Kotlin Multiplatform Web 精靈](https://kmp.jetbrains.com) 產生新的 Android 和 iOS 專案。
   如果使用 Web 精靈，請解包封存檔並在您的 IDE 中匯入專案。
2. 在版本目錄（`gradle/libs.versions.toml` 檔案）中，將 Kotlin CocoaPods Gradle 外掛程式新增至 `[plugins]` 區塊：

   ```toml
   [plugins]
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```

3. 導覽至專案根目錄的 `build.gradle.kts` 檔案，並在 `plugins {}` 區塊中新增以下別名：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

4. 開啟您想要整合 CocoaPods 的模組（例如 `sharedLogic` 模組），並在 `build.gradle.kts` 檔案的 `plugins {}` 區塊中新增以下別名：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

現在您已準備好 [在您的 Kotlin Multiplatform 專案中設定 CocoaPods](#configure-the-project)。

## 設定專案

若要在您的多平台專案中設定 Kotlin CocoaPods Gradle 外掛程式：

1. 在專案共享模組的 `build.gradle(.kts)` 中，套用 CocoaPods 外掛程式以及 Kotlin Multiplatform 外掛程式。

   > 如果您是 [透過 IDE 外掛程式或 Web 精靈](#create-a-project) 建立專案的，請跳過此步驟。
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
            // 必要屬性
            // 在此指定要求的 Pod 版本
            // 否則，將使用 Gradle 專案版本
            version = "1.0"
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"
   
            // 選填屬性
            // 在此設定 Pod 名稱，而不是變更 Gradle 專案名稱
            name = "MyCocoaPod"

            framework {
                // 必要屬性              
                // 框架名稱設定。使用此屬性代替已棄用的 'frameworkName'
                baseName = "MyFramework"
                
                // 選填屬性
                // 指定框架連結型別。預設為動態。 
                isStatic = false
                // 相依性匯出
                // 如果您有其他專案模組，請取消註解並指定該模組：
                // export(project(":<your other KMP module>"))
                transitiveExport = false // 這是預設值。
            }

            // 將自訂 Xcode 組態對應到 NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > 在 [Kotlin Gradle 外掛程式儲存庫](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt) 中查看 Kotlin DSL 的完整語法。
    >
    {style="note"}
    
3. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。
4. 產生 [Gradle 包裝函式](https://docs.gradle.org/current/userguide/gradle_wrapper.html) 以避免 Xcode 組建期間出現相容性問題。

套用後，CocoaPods 外掛程式會執行以下操作：

* 為所有 macOS、iOS、tvOS 和 watchOS 目標新增 `debug` 和 `release` 框架作為輸出二進位檔。
* 建立一個 `podspec` 任務，該任務會為專案產生一個 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 檔案。

`Podspec` 檔案包含指向輸出框架的路徑，以及在 Xcode 專案組建過程中自動組建此框架的指令碼階段。

## 為 Xcode 更新 Podfile

如果您想將 Kotlin 專案匯入 Xcode 專案：

1. 在 Kotlin 專案的 iOS 部分，對 Podfile 進行變更：

   * If your project has any Git, HTTP, or custom Podspec repository dependencies, specify the path to
     the Podspec in the Podfile.

     例如，如果您新增了對 `podspecWithFilesExample` 的相依性，請在 Podfile 中宣告 Podspec 的路徑：

     ```ruby
     target 'ios-app' do
        # ... 其他相依性 ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path` 應包含指向 Pod 的檔案路徑。

   * 如果您從自訂 Podspec 儲存庫新增程式庫，請在 Podfile 的開頭指定 specs 的 [位置](https://guides.cocoapods.org/syntax/podfile.html#source)：

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... 其他相依性 ...
         pod 'example'
     end
     ```

2. 在您的專案目錄中執行 `pod install`。

   當您第一次執行 `pod install` 時，它會建立 `.xcworkspace` 檔案。此檔案包含您原本的 `.xcodeproj` 和 CocoaPods 專案。
3. 關閉您的 `.xcodeproj` 並改為開啟新的 `.xcworkspace` 檔案。這樣可以避免專案相依性問題。
4. 在 IntelliJ IDEA 中執行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中執行 **File** | **Sync Project with Gradle Files**）以重新匯入專案。

如果您未在 Podfile 中進行這些變更，`podInstall` 任務將會失敗，且 CocoaPods 外掛程式會在日誌中顯示錯誤訊息。

## 可能的問題與解決方案

### CocoaPods 安裝 {initial-collapse-state="collapsed" collapsible="true"}

#### Ruby 安裝

CocoaPods 是使用 Ruby 建構的，您可以使用 macOS 預設提供的 Ruby 進行安裝。Ruby 1.9 或更新版本內建了 RubyGems 封裝管理架構，可協助您安裝 [CocoaPods 相依性管理器](https://guides.cocoapods.org/using/getting-started.html#installation)。

如果您在安裝 CocoaPods 並使其運作時遇到問題，請參考 [此指南](https://www.ruby-lang.org/en/documentation/installation/) 安裝 Ruby，或參閱 [RubyGems 網站](https://rubygems.org/pages/download/) 來安裝此架構。

#### 版本相容性

我們建議使用最新的 Kotlin 版本。此 CocoaPods 設定要求的最低版本為 1.7.0。

### 使用 Xcode 時的組建錯誤 {initial-collapse-state="collapsed" collapsible="true"}

某些 CocoaPods 安裝變體可能會導致 Xcode 中的組建錯誤。通常，Kotlin Gradle 外掛程式會在 `PATH` 中尋找 `pod` 可執行檔，但這可能會因您的環境而異，而不夠穩定。

若要明確設定 CocoaPods 的安裝路徑，您可以手動或使用 shell 指令將其新增到專案的 `local.properties` 檔案中：

* 如果使用程式碼編輯器，請將以下內容新增到 `local.properties` 檔案：

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 如果使用終端機，請執行以下指令：

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 找不到模組或框架 {initial-collapse-state="collapsed" collapsible="true"}

安裝 Pod 時，您可能會遇到與 [C 互通性](https://kotlinlang.org/docs/native-c-interop.html) 問題相關的 `module 'SomeSDK' not found` 或 `framework 'SomeFramework' not found` 錯誤。若要解決此類錯誤，請嘗試以下解決方案：

#### 更新套件

更新您的安裝工具和已安裝的套件 (gems)：

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

1. 在下載的 Pod 目錄 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...` 中尋找 `module.modulemap` 檔案。
2. 檢查模組內部的框架名稱，例如 `SDWebImageMapKit {}`。如果框架名稱與 Pod 名稱不符，請明確指定：

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```

#### 指定標頭

如果 Pod 不包含 `.modulemap` 檔案（例如 `pod("NearbyMessages")`），請明確指定主標頭：

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

如需更多資訊，請參閱 [CocoaPods 文件](https://guides.cocoapods.org/)。如果仍無法解決問題且仍遇到此錯誤，請在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中回報問題。

### 應用程式套件中遺失資源 {initial-collapse-state="collapsed" collapsible="true"}

如果您的 iOS 應用程式組建成功但在啟動時崩潰，或者最終的 `.ipa` 封裝中遺失了自訂字型和圖片等資源，則 Pod 與專案整合的方式可能存在問題。

**若要防止此問題**：請不要直接執行 `pod install` 指令，而是使用 Kotlin CocoaPods Gradle 外掛程式提供的 Gradle `podInstall` 任務。此任務會為您建立所需的目錄並完成所有設定：

```bash
./gradlew podInstall
open iosApp/iosApp.xcworkspace
```

**為什麼會發生此問題**：當您在乾淨的專案上（例如：在複製儲存庫後或在 CI/CD 管線中工作時）執行原生的 `pod install` 指令時，資源目錄尚未建立。Compose Multiplatform Gradle 外掛程式在產生的 `.podspec` 檔案中指定了資源的位置：`spec.resources = ['build/compose/cocoapods/compose-resources']`，但該路徑僅在組建後才存在。因此，CocoaPods 會忽略遺失的目錄，並在沒有這些資源的情況下設定 Xcode 專案。當專案完成組建並產生資源時，Xcode 不會將它們複製到最終的套件中。

### Rsync 錯誤 {initial-collapse-state="collapsed" collapsible="true"}

您可能會遇到 `rsync error: some files could not be transferred` 錯誤。這是一個 [已知問題](https://github.com/CocoaPods/CocoaPods/issues/11946)，如果 Xcode 中的應用程式目標啟用了使用者指令碼的沙盒化 (sandboxing)，就會發生這種情況。

若要解決此問題：

1. 在應用程式目標中停用使用者指令碼的沙盒化：

   ![停用 CocoaPods 沙盒化](disable-sandboxing-cocoapods.png){width=700}

2. 停止可能已被沙盒化的 Gradle 精靈程序：

    ```shell
    ./gradlew --stop
    ```

## 下一步

* [在您的 Kotlin 專案中新增對 Pod 程式庫的相依性](multiplatform-cocoapods-libraries.md)
* [設定 Kotlin 專案與 Xcode 專案之間的相依性](multiplatform-cocoapods-xcode.md)
* [參閱完整的 CocoaPods Gradle 外掛程式 DSL 參考](multiplatform-cocoapods-dsl-reference.md)