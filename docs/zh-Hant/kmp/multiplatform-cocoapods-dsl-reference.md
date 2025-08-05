[//]: # (title: CocoaPods Gradle 外掛程式 DSL 參考)

<tldr>

* 在新增 Pod 相依性之前，請[完成初始設定](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
* 請參閱[在 Kotlin 專案中設定不同 Pod 相依性](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)的範例專案。
* 查看[具有多個目標的 Xcode 專案依賴於 Kotlin 程式庫](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)的範例專案。

</tldr>

Kotlin CocoaPods Gradle 外掛程式是用於建立 Podspec 檔案的工具。這些檔案對於將您的 Kotlin 專案與 [CocoaPods 相依性管理器](https://cocoapods.org/)整合是必要的。

此 DSL 參考列出了 Kotlin CocoaPods Gradle 外掛程式的主要區塊、函式和屬性，您可以在設定 CocoaPods 整合時使用它們。

## 啟用外掛程式

要套用 CocoaPods 外掛程式，請將以下行新增到 `build.gradle(.kts)` 檔案：

```kotlin
plugins {
   kotlin("multiplatform") version "%kotlinVersion%"
   kotlin("native.cocoapods") version "%kotlinVersion%"
}
```

外掛程式版本與 [Kotlin 發佈版本](https://kotlinlang.org/docs/releases.html)相符。最新的穩定版本是 %kotlinVersion%。

## `cocoapods {}` 區塊

`cocoapods {}` 區塊是 CocoaPods 設定的頂層區塊。它包含 Pod 的一般資訊，包括 Pod 版本、摘要和首頁等必要資訊，以及選用功能。

您可以在其內部使用以下區塊、函式和屬性：

| **名稱**                              | **描述**                                                                                                                                                                                                                  |
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | Pod 的版本。如果未指定，則使用 Gradle 專案版本。如果這些屬性均未配置，您將收到錯誤。                                                                             |
| `summary`                             | 從此專案建置的 Pod 的必要描述。                                                                                                                                                                       |
| `homepage`                            | 指向從此專案建置的 Pod 首頁的必要連結。                                                                                                                                                              |
| `authors`                             | 指定從此專案建置的 Pod 的作者。                                                                                                                                                                            |
| `podfile`                             | 設定現有的 Podfile。                                                                                                                                                                                                 |
| `noPodspec()`                         | 設定外掛程式不為 `cocoapods` 區段產生 Podspec 檔案。                                                                                                                                                    |
| `name`                                | 從此專案建置的 Pod 的名稱。如果未提供，則使用專案名稱。                                                                                                                                          |
| `license`                             | 從此專案建置的 Pod 的授權，其類型和文字。                                                                                                                                                          |
| `framework`                           | `framework` 區塊配置外掛程式產生的框架。                                                                                                                                                             |
| `source`                              | 從此專案建置的 Pod 的位置。                                                                                                                                                                                 |
| `extraSpecAttributes`                 | 配置其他 Podspec 屬性，例如 `libraries` 或 `vendored_frameworks`。                                                                                                                                                   |
| `xcodeConfigurationToNativeBuildType` | 將自訂 Xcode 配置映射到 NativeBuildType："Debug" 到 `NativeBuildType.DEBUG` 和 "Release" 到 `NativeBuildType.RELEASE`。                                                                                               |
| `publishDir`                          | 配置 Pod 發佈的輸出目錄。                                                                                                                                                                              |
| `pods`                                | 返回 Pod 相依性的列表。                                                                                                                                                                                              |
| `pod()`                               | 將 CocoaPods 相依性新增到從此專案建置的 Pod。                                                                                                                                                                  |
| `specRepos`                           | 使用 `url()` 新增規範儲存庫。當使用私有 Pod 作為相依性時，這是必要的。有關更多資訊，請參閱 [CocoaPods 文件](https://guides.cocoapods.org/making/private-cocoapods.html)。 |

### 目標

| iOS                 | macOS        | tvOS                 | watchOS                 |
|---------------------|--------------|----------------------|-------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

對於每個目標，使用 `deploymentTarget` 屬性指定 Pod 程式庫的最低目標版本。

套用後，CocoaPods 會將 `debug` 和 `release` 框架作為所有目標的輸出二進位檔案新增。

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

### `framework {}` 區塊

`framework {}` 區塊巢狀於 `cocoapods` 內部，並配置從專案建置的 Pod 的框架屬性。

> 請注意，`baseName` 是必填欄位。
>
{style="note"}

| **名稱**           | **描述**                                                                         |
|--------------------|-----------------------------------------------------------------------------------------|
| `baseName`         | 一個必要的框架名稱。使用此屬性而非已棄用的 `frameworkName`。 |
| `isStatic`         | 定義框架連結類型。預設為動態。                                                           |
| `transitiveExport` | 啟用相依性匯出。                                                              |

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

## `pod()` 函式

`pod()` 函式呼叫會將 CocoaPods 相依性新增到從此專案建置的 Pod。每個相依性都需要單獨的函式呼叫。

您可以在函式參數中指定 Pod 程式庫的名稱，並在其配置區塊中指定其他參數值，例如程式庫的 `version` 和 `source`：

| **名稱**                     | **描述**                                                                                                                                                                                                                                                                                    |
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                    | 程式庫版本。若要使用程式庫的最新版本，請省略此參數。                                                                                                                                                                                                                 |
| `source`                     | 從以下位置配置 Pod： <list><li>使用 `git()` 的 Git 儲存庫。在 `git()` 之後的區塊中，您可以指定 `commit` 以使用特定提交，`tag` 以使用特定標籤，以及 `branch` 以使用儲存庫中的特定分支。</li><li>使用 `path()` 的本地儲存庫。</li></list> |
| `packageName`                | 指定套件名稱。                                                                                                                                                                                                                                                                        |
| `extraOpts`                  | 指定 Pod 程式庫的選項列表。例如，特定標誌：<code-block lang="Kotlin">extraOpts = listOf("-compiler-option")</code-block>                                                                                                                                        |
| `linkOnly`                   | 指示 CocoaPods 外掛程式使用帶有動態框架的 Pod 相依性，而不產生 cinterop 綁定。如果與靜態框架一起使用，該選項將完全移除 Pod 相依性。                                                                                           |
| `interopBindingDependencies` | 包含其他 Pod 的相依性列表。此列表用於為新 Pod 建置 Kotlin 綁定。                                                                                                                                                                                   |
| `useInteropBindingFrom()`    | 指定用作相依性的現有 Pod 的名稱。此 Pod 應在函式執行前宣告。該函式指示 CocoaPods 外掛程式在使用現有 Pod 的 Kotlin 綁定為新 Pod 建置綁定時使用該綁定。                                     |

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

## 下一步

* [請參閱 Kotlin Gradle 外掛程式儲存庫中 Kotlin DSL 的完整語法](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)
* [在您的 Kotlin 專案中新增對 Pod 程式庫的相依性](multiplatform-cocoapods-libraries.md)
* [設定 Kotlin 專案和 Xcode 專案之間的相依性](multiplatform-cocoapods-xcode.md)