---
title: "CocoaPods Gradle 外掛程式 DSL 參考資料"
---
Kotlin CocoaPods Gradle 外掛程式是用於建立 Podspec 檔案的工具。 這些檔案是將您的 Kotlin 專案與 [CocoaPods 依賴管理工具](https://cocoapods.org/)整合的必要檔案。

本參考文件包含 Kotlin CocoaPods Gradle 外掛程式的完整區塊（block）、函數和屬性列表，您可以在使用 [CocoaPods 整合](native-cocoapods)時使用。

* 了解如何[設定環境並配置 Kotlin CocoaPods Gradle 外掛程式](native-cocoapods)。
* 根據您的專案和目的，您可以在 [Kotlin 專案和 Pod 函式庫](native-cocoapods-libraries) 之間以及 [Kotlin Gradle 專案和 Xcode 專案](native-cocoapods-xcode) 之間新增依賴項。

## 啟用外掛程式

若要套用 CocoaPods 外掛程式，請將以下程式碼行新增至 `build.gradle(.kts)` 檔案：

```kotlin
plugins {
   kotlin("multiplatform") version "2.1.20"
   kotlin("native.cocoapods") version "2.1.20"
}
```

外掛程式版本與 [Kotlin 發佈版本](releases) 相符。 最新的穩定版本是 2.1.20。

## cocoapods 區塊（block）

`cocoapods` 區塊是用於 CocoaPods 配置的頂層區塊。 它包含有關 Pod 的一般資訊，包括 Pod 版本、摘要和首頁等必要資訊，以及可選功能。

您可以在其中使用以下區塊（block）、函數和屬性：

| **名稱 (Name)**                              | **描述 (Description)**                                                                                                                                                                                                                  | 
|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | Pod 的版本。 如果未指定，則使用 Gradle 專案版本。 如果未配置這些屬性，您將收到錯誤。                                                                                                                                                                          |
| `summary`                             | 從此專案建置的 Pod 的必要描述。                                                                                                                                                                       |
| `homepage`                            | 從此專案建置的 Pod 的首頁的必要連結。                                                                                                                                                              |
| `authors`                             | 指定從此專案建置的 Pod 的作者。                                                                                                                                                                            |
| `podfile`                             | 配置現有的 `Podfile` 檔案。                                                                                                                                                                                          |
| `noPodspec()`                         | 設定外掛程式，使其不為 `cocoapods` 區段產生 Podspec 檔案。                                                                                                                                                    |
| `name`                                | 從此專案建置的 Pod 的名稱。 如果未提供，則使用專案名稱。                                                                                                                                          |
| `license`                             | 從此專案建置的 Pod 的授權、其類型和文字。                                                                                                                                                          |
| `framework`                           | `framework` 區塊配置外掛程式產生的 framework。                                                                                                                                                             |
| `source`                              | 從此專案建置的 Pod 的位置。                                                                                                                                                                                 |
| `extraSpecAttributes`                 | 配置其他 Podspec 屬性，如 `libraries` 或 `vendored_frameworks`。                                                                                                                                                   |
| `xcodeConfigurationToNativeBuildType` | 將自定義 Xcode 配置對應到 NativeBuildType：將 "Debug" 對應到 `NativeBuildType.DEBUG`，將 "Release" 對應到 `NativeBuildType.RELEASE`。                                                                                               |
| `publishDir`                          | 配置 Pod 發佈的輸出目錄。                                                                                                                                                                              |
| `pods`                                | 傳回 Pod 依賴項的列表。                                                                                                                                                                                              |
| `pod()`                               | 將 CocoaPods 依賴項新增到由此專案建置的 Pod。                                                                                                                                                                  |
| `specRepos`                           | 使用 `url()` 新增規格儲存庫。 當私有 Pod 用作依賴項時，這是必要的。 有關更多資訊，請參閱 [CocoaPods 文件](https://guides.cocoapods.org/making/private-cocoapods.html)。 |

### 目標 (Targets)

| iOS                 | macOS        | tvOS                 | watchOS                 |
|---------------------|--------------|----------------------|-------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

對於每個目標 (target)，請使用 `deploymentTarget` 屬性來指定 Pod 函式庫的最小目標版本。

套用後，CocoaPods 會將 `debug` 和 `release` framework 新增為所有目標的輸出二進位檔案。

```kotlin
kotlin {
    iosArm64()
   
    cocoapods {
        version = "2.0"
        name = "MyCocoaPod"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"
        
        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        license = "{ :type => 'MIT', :text => 'License text'}"
        source = "{ :git => 'git@github.com:vkormushkin/kmmpodlibrary.git', :tag => '$version' }"
        authors = "Kotlin Dev"
        
        specRepos {
            url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
        }
        pod("example")
        
        xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
   }
}
```

### framework 區塊（block）

`framework` 區塊嵌套在 `cocoapods` 內部，並配置由此專案建置的 Pod 的 framework 屬性。

:::note
請注意，`baseName` 是必填欄位。

:::

| **名稱 (Name)**           | **描述 (Description)**                                                                         | 
|--------------------|-----------------------------------------------------------------------------------------|
| `baseName`         | 必要的 framework 名稱。 使用此屬性代替已棄用的 `frameworkName`。 |
| `isStatic`         | 定義 framework 連結類型。 預設情況下為動態。                            |
| `transitiveExport` | 啟用依賴項導出。                                                              |                                                      

```kotlin
kotlin {
    cocoapods {
        version = "2.0"
        framework {
            baseName = "MyFramework"
            isStatic = false
            export(project(":anotherKMMModule"))
            transitiveExport = true
        }
    }
}
```

## pod() 函數

`pod()` 函數呼叫將 CocoaPods 依賴項新增到由此專案建置的 Pod。 每個依賴項都需要單獨的函數呼叫。

您可以在函數參數中指定 Pod 函式庫的名稱，並在其配置區塊（block）中指定其他參數值，如函式庫的 `version` 和 `source`：

| **名稱 (Name)**                     | **描述 (Description)**                                                                                                                                                                                                                                                                                    | 
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                    | 函式庫版本。 若要使用函式庫的最新版本，請省略該參數。                                                                                                                                                                                                                 |
| `source`                     | 從以下位置配置 Pod：<list><li>使用 `git()` 的 Git 儲存庫。 在 `git()` 之後的區塊中，您可以指定 `commit` 以使用特定提交、指定 `tag` 以使用特定標籤，以及指定 `branch` 以使用儲存庫中的特定分支</li><li>使用 `path()` 的本機儲存庫</li></list> |
| `packageName`                | 指定套件名稱 (package name)。                                                                                                                                                                                                                                                                        |
| `extraOpts`                  | 指定 Pod 函式庫的選項列表。 例如，特定標誌： ```Kotlin
extraOpts = listOf("-compiler-option")
```                                                                                                                                        |
| `linkOnly`                   | 指示 CocoaPods 外掛程式使用具有動態 framework 的 Pod 依賴項，而不產生 cinterop 綁定。 如果與靜態 framework 一起使用，則該選項將完全刪除 Pod 依賴項。                                                                                           |
| `interopBindingDependencies` | 包含其他 Pod 的依賴項列表。 建立新 Pod 的 Kotlin 綁定時，會使用此列表。                                                                                                                                                                                   |
| `useInteropBindingFrom()`    | 指定用作依賴項的現有 Pod 的名稱。 應在函數執行之前宣告此 Pod。 該函數指示 CocoaPods 外掛程式在建立新 Pod 的綁定時使用現有 Pod 的 Kotlin 綁定。                                     |

```kotlin
kotlin {
    iosArm64()
    cocoapods {
        version = "2.0"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        ios.deploymentTarget = "16.0"
      
        pod("pod_dependency") {
            version = "1.0"
            extraOpts += listOf("-compiler-option")
            linkOnly = true
            source = path(project.file("../pod_dependency"))
        }
    }
}
```