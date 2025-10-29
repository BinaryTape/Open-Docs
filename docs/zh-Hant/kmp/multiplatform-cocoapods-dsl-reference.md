[//]: # (title: CocoaPods Gradle 外掛程式 DSL 參考)

<tldr>

*   在新增 Pod 依賴項之前，請[完成初始設定](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
*   請參閱[在 Kotlin 專案中設定不同 Pod 依賴項的範例專案](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)。
*   請查閱[一個具有多個目標的 Xcode 專案依賴於 Kotlin 函式庫的範例專案](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)。

</tldr>
<show-structure for="chapter,procedure" depth="2"/>

Kotlin CocoaPods Gradle 外掛程式是一個用於建立 Podspec 檔案的工具。這些檔案對於將您的 Kotlin 專案與 [CocoaPods 依賴管理器](https://cocoapods.org/)整合是必要的。

本 DSL 參考列出了 Kotlin CocoaPods Gradle 外掛程式的主要區塊、函式和屬性，您可以在設定 CocoaPods 整合時使用它們。

## 啟用外掛程式

要套用 CocoaPods 外掛程式，請將以下幾行加入 `build.gradle(.kts)` 檔案中：

```kotlin
plugins {
   kotlin("multiplatform") version "%kotlinVersion%"
   kotlin("native.cocoapods") version "%kotlinVersion%"
}
```

外掛程式版本與 [Kotlin 發布版本](https://kotlinlang.org/docs/releases.html)相符。最新穩定版本為 %kotlinVersion%。

## `cocoapods {}` 區塊

`cocoapods {}` 區塊是 CocoaPods 配置的頂層區塊。它包含有關 Pod 的一般資訊，包括 Pod 版本、摘要和首頁等必填資訊，以及選用功能。

您可以在其內部使用以下區塊、函式和屬性：

| **名稱**                              | **描述**                                                                                                                                                                                                                  |
|:--------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | Pod 的版本。如果未指定，則使用 Gradle 專案版本。如果這些屬性均未配置，您將會收到錯誤。                                                                                                                                           |
| `summary`                             | 由此專案建立的 Pod 所需的描述。                                                                                                                                                                       |
| `homepage`                            | 由此專案建立的 Pod 首頁的必填連結。                                                                                                                                                              |
| `authors`                             | 指定由此專案建立的 Pod 的作者。                                                                                                                                                                            |
| `podfile`                             | 配置現有的 Podfile。                                                                                                                                                                                                 |
| `noPodspec()`                         | 設定外掛程式不為 `cocoapods` 區段產生 Podspec 檔案。                                                                                                                                                    |
| `name`                                | 由此專案建立的 Pod 的名稱。如果未提供，則使用專案名稱。                                                                                                                                          |
| `license`                             | 由此專案建立的 Pod 的許可證、其類型和文字。                                                                                                                                                          |
| `framework`                           | 框架區塊配置由外掛程式產生的框架。                                                                                                                                                             |
| `source`                              | 由此專案建立的 Pod 的位置。                                                                                                                                                                                 |
| `extraSpecAttributes`                 | 配置其他 Podspec 屬性，例如 `libraries` 或 `vendored_frameworks`。                                                                                                                                                   |
| `xcodeConfigurationToNativeBuildType` | 將自訂 Xcode 配置映射到 NativeBuildType：將 "Debug" 映射到 `NativeBuildType.DEBUG`，將 "Release" 映射到 `NativeBuildType.RELEASE`。                                                                                               |
| `publishDir`                          | 配置 Pod 發布的輸出目錄。                                                                                                                                                                              |
| `pods`                                | 回傳 Pod 依賴項的列表。                                                                                                                                                                                              |
| `pod()`                               | 將 CocoaPods 依賴項新增至由此專案建立的 Pod。                                                                                                                                                                  |
| `specRepos`                           | 使用 `url()` 新增規格儲存庫。當私有 Pod 作為依賴項使用時，這是必要的。有關更多資訊，請參閱 [CocoaPods 文件](https://guides.cocoapods.org/making/private-cocoapods.html)。 |

### 目標

| iOS                 | macOS        | tvOS                 | watchOS                 |
|:--------------------|:-------------|:---------------------|:------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

對於每個目標，使用 `deploymentTarget` 屬性指定 Pod 函式庫的最小目標版本。

套用後，CocoaPods 會為所有目標新增 `debug` 和 `release` 框架作為輸出二進位檔。

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

`framework {}` 區塊嵌套在 `cocoapods` 內部，並配置由此專案建立的 Pod 的框架屬性。

> 請注意，`baseName` 是必填欄位。
>
{style="note"}

| **名稱**           | **描述**                                                                         |
|:-------------------|:-----------------------------------------------------------------------------------------|
| `baseName`         | 必填的框架名稱。請使用此屬性而非已棄用的 `frameworkName`。 |
| `isStatic`         | 定義框架連結類型。預設為動態連結。                            |
| `transitiveExport` | 啟用依賴項匯出。                                                              |

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

`pod()` 函式呼叫會將 CocoaPods 依賴項新增至由此專案建立的 Pod。每個依賴項都需要單獨的函式呼叫。

您可以在函式參數中指定 Pod 函式庫的名稱，並在其配置區塊中指定額外參數值，例如函式庫的 `version` 和 `source`：

| **名稱**                     | **描述**                                                                                                                                                                                                                                                                                                                   |
|:-----------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                    | 函式庫版本。若要使用函式庫的最新版本，請省略此參數。                                                                                                                                                                                                                 |
| `source`                     | 配置 Pod 來源：<list><li>使用 `git()` 的 Git 儲存庫。在 `git()` 後的區塊中，您可以指定 `commit` 以使用特定提交，`tag` 以使用特定標籤，以及 `branch` 以使用儲存庫中的特定分支。</li><li>使用 `path()` 的本地儲存庫。</li></list> |
| `packageName`                | 指定套件名稱。                                                                                                                                                                                                                                                                                                       |
| `extraOpts`                  | 指定 Pod 函式庫的選項列表。例如，特定旗標：<code-block lang="Kotlin" code="extraOpts = listOf(&quot;-compiler-option&quot;)"/>                                                                                                                                        |
| `linkOnly`                   | 指示 CocoaPods 外掛程式使用帶有動態框架的 Pod 依賴項，而不產生 cinterop 綁定。如果與靜態框架一起使用，此選項將完全移除 Pod 依賴項。                                                                                           |
| `interopBindingDependencies` | 包含其他 Pod 的依賴項列表。此列表用於為新 Pod 建立 Kotlin 綁定時。                                                                                                                                                    |
| `useInteropBindingFrom()`    | 指定作為依賴項使用的現有 Pod 名稱。此 Pod 應在函式執行前宣告。此函式指示 CocoaPods 外掛程式在為新 Pod 建立綁定時，使用現有 Pod 的 Kotlin 綁定。                                                                    |

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

## 後續步驟

*   [查閱 Kotlin Gradle 外掛程式儲存庫中 Kotlin DSL 的完整語法](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)
*   [在您的 Kotlin 專案中新增 Pod 函式庫的依賴項](multiplatform-cocoapods-libraries.md)
*   [設定 Kotlin 專案與 Xcode 專案之間的依賴關係](multiplatform-cocoapods-xcode.md)