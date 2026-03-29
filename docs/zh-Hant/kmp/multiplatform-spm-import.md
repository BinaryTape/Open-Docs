[//]: # (title: 將 Swift 軟件包作為相依性新增至 KMP 模組)
<primary-label ref="Experimental"/>

<tldr>
   <p>Swift 封裝管理員 (SwiftPM) 扮演與 CocoaPods 相同的角色：
   它讓你能透明地編排 iOS 應用程式的原生 iOS 相依性。</p>
   <p>在此你可以了解如何在 KMP 專案中設定 SwiftPM 相依性，
   以及必要時如何將 KMP 設定從 CocoaPods 遷移至 SwiftPM。</p>
</tldr>

> 此功能為 [實驗性](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 且 **不** 適用於生產環境。
> 請在專屬的 Kotlin Slack 頻道中分享你遇到的任何問題或回饋：[#kmp-swift-package-manager](https://kotlinlang.slack.com/archives/C09TW68099C)
>
{style="warning"}

支援 SwiftPM 匯入整合的 Kotlin Gradle 外掛程式允許你使用為 Apple 目標宣告的 SwiftPM 相依性，
從 Objective-C 和 Swift 程式碼中匯入 Objective-C API。

對於遞移相依性（相依於那些使用 SwiftPM 匯入的專案），
Kotlin Gradle 外掛程式會自動從 SwiftPM 相依性提供必要的 機器碼。
例如，在執行 Kotlin/Native 測試或連結 架構 時，你不需要進行任何額外的 配置。

> 目前尚不支援將使用 SwiftPM 匯入的 KMP 模組本身作為 Swift 軟件包 [匯出](multiplatform-spm-export.md)，且可能無法運作。
> 請參閱此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-84420) 了解更多詳細資訊，並讓我們知道你的使用案例。
>
{style="note"}

要配置你的專案：

1. [設定你的開發環境](#set-up-environment)
2. [將 SwiftPM 相依性新增至你的 KMP 模組](#add-and-call-swiftpm-dependencies)
3. [在你的 Kotlin 程式碼中使用匯入的 API](#use-imported-apis)

## 設定環境

要嘗試 SwiftPM 匯入功能，你需要使用特定的 Kotlin 開發版本。
請記住，此版本 **不** 適用於生產環境。
<!-- This will be invalidated when 2.4.0-Beta1 comes out. This is when we specify the feature stability level and change the page label. -->

要設定 Kotlin Multiplatform Gradle 外掛程式：

1. 在你的 `settings.gradle.kts` 檔案中，新增相依性和外掛程式的開發 軟件包 存儲庫：

    ```kotlin
    dependencyResolutionManagement {
        repositories {
            maven("https://packages.jetbrains.team/maven/p/kt/dev")
            mavenCentral()
        }
    }

    pluginManagement {
        repositories {
            maven("https://packages.jetbrains.team/maven/p/kt/dev")
            mavenCentral()
            gradlePluginPortal()
        }
    }
    ```

2. 在你的 Version Catalog 中，套用實驗性版本的 Kotlin Multiplatform Gradle 外掛程式：

    ```text
    kotlin = "%spmImport%"

    [plugins]
    kotlin-multiplatform = "%spmImport%"
    ```

3. 同步 Gradle 檔案並嘗試將 `kotlin.swiftPMDependencies {}` 區塊新增至 KMP 模組中的 `build.gradle.kts` 檔案。

   如果無法解析 `swiftPMDependencies` 名稱，請將以下區塊新增至根目錄的 `build.gradle.kts` 檔案，
   以強制使用實驗性 Kotlin Multiplatform Gradle 外掛程式版本：

    ```kotlin
    buildscript {
        dependencies.constraints {
            "classpath"("org.jetbrains.kotlin:kotlin-gradle-plugin:%spmImport%")
        }
    }
    ```

### 設定 KMP IDE 外掛程式

如果你使用的是為 KMP 專案建議的 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform/)，
請明確指定從 KMP 模組建置的 iOS 專案 路徑。

在呼叫 `iosTarget.binaries.framework` API 的 `build.gradle.kts` 檔案中，
加入設定 路徑 的 API 呼叫：

```kotlin
kotlin {
    // Example of iOS targets configuration
    listOf(
        iosArm64(),
        iosSimulatorArm64(),
        iosX64(),
    ).forEach { iosTarget ->
            iosTarget.binaries.framework { 
                baseName = "Shared"
                isStatic = false
            } 
    }

    swiftPMDependencies { 
        // Specify the path to the .xcodeproj file that uses
        // the `:embedAndSignAppleFrameworkForXcode` integration
        xcodeProjectPathForKmpIJPlugin.set(
            layout.projectDirectory.file("../iosApp/iosApp.xcodeproj")
        )
    }
}
```

## 新增並呼叫 SwiftPM 相依性

> 有關實際運作的範例，請參閱我們的範例專案。
> 在 `master` 分支 上，每個專案都使用 CocoaPods 設定，而 `spm_import` 分支 則使用 SwiftPM：
> 
> * [SwiftUI 與 Firebase 範例應用程式](https://github.com/Kotlin/kmp-with-cocoapods-firebase-sample/tree/spm_import)
> * [Compose Multiplatform iOS 範例應用程式](https://github.com/Kotlin/kmp-with-cocoapods-compose-sample/tree/spm_import)
>
{type="tip"}

### 配置建置檔案

特定的 SwiftPM 相依性可以新增在 `build.gradle.kts` 檔案的 `swiftPMDependencies` 區塊中，
即宣告 Apple 目標 的位置。
例如，對於 Firebase：

```kotlin
kotlin {
    iosArm64()
    iosSimulatorArm64()
    iosX64()

    swiftPMDependencies {
        // Import FirebaseAnalytics into your Kotlin code
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.5.0"),
            products = listOf(product("FirebaseAnalytics")),
        )
        // swift-protobuf is a transitive Firebase dependency,
        // so you only need to include it
        // if you want to use a specific version
        swiftPackage(
            url = url("https://github.com/apple/swift-protobuf.git"),
            version = exact("1.32.0"),
            products = listOf(),
        )
    }
}
```

SwiftPM 整合基於匯入 Clang 模組。
預設情況下，匯入機制會自動發現指定 Swift 軟件包 中的 Clang 模組，
並使所有可用的 模組 都能被 Kotlin 程式碼存取 —— 類似於 API 可見性在 Swift 和 Objective-C 中的運作方式。
<!-- TODO link to where it is explained? -->

要停用預設行為和自動 模組 發現，請將 `discoverClangModulesImplicitly` 設定為 `false`。
當 模組 發現被停用時，SwiftPM 匯入會使用產品名稱作為 Clang 模組 名稱。

To import Clang modules whose names differ from product names, use the `importedClangModules` parameter, for example:

```kotlin
kotlin {
    swiftPMDependencies {
        // If 'discoverClangModulesImplicitly' was set to 'true',
        // the 'importedClangModules' parameter below would be ignored
        discoverClangModulesImplicitly = false

        // Imported packages, their products, and Clang modules
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.5.0"),
            products = listOf(
                product("FirebaseAnalytics"),
                product("FirebaseFirestore")
            ),
            importedClangModules = listOf(
                "FirebaseAnalytics", 
                // Objective-C APIs of FirebaseFirestore are located
                // in the 'FirebaseFirestoreInternal' Clang module
                "FirebaseFirestoreInternal"
            ),
        )
    }
}
```

### 設定平台約束

某些 SwiftPM 相依性可能無法在你的建置 指令碼 中的所有 目標 上編譯或提供有效的 API。
例如，Google Maps SDK 目前僅支援 iOS 目標。

因此，當你的專案僅針對 iOS 時，你不需要明確宣告平台。
但只要你新增另一個 目標（例如 macOS），你就需要為每個相依性指定平台 約束。

為了確保相依性僅套用於相關的編譯，
請在 `product` 規格的 `platforms` 參數 中指定正確的 目標：

```kotlin
kotlin {
    iosArm64()
    iosSimulatorArm64()
    iosX64()
    macosArm64()

    swiftPMDependencies {
        swiftPackage(
            url = url("https://github.com/googlemaps/ios-maps-sdk.git"),
            version = exact("10.3.0"),
            products = listOf(
                product(
                    "GoogleMaps", 
                    platforms = setOf(
                        // The `GoogleMaps` package will be visible
                        // only to iOS compilations
                        iOS()
                    )
                )
            )
        ) 
    }
}
```

### 使用匯入的 API

匯入的 Objective-C API 包含在以 `swiftPMImport` 前綴開始，
並以專案及其群組的 Gradle 名稱結尾的 命名空間 中。

例如，Kotlin 建置 指令碼 如下指定群組 名稱：

```kotlin
// subproject/build.gradle.kts
group = "groupName"
```

此處 `groupName` 是專案的 Gradle 群組 名稱，而 `subproject` 是專案 名稱。
現在你可以在該 模組 的 `iosMain` 原始碼集 中匯入 Firebase API：

```kotlin
// subproject/src/iosMain/kotlin/useFirebaseAnalytics.kt
import swiftPMImport.groupName.subproject.FIRAnalytics
import swiftPMImport.groupName.subproject.FIRApp
```

## 其他匯入選項

### 匯入本機 Swift 軟件包

SwiftPM 匯入機制還允許從本機檔案系統匯入 Swift 軟件包。

讓我們考慮一個位於 `/path/to/ExamplePackage` 目錄 中、具有以下資訊清單的 Swift 軟件包：

```swift
// /path/to/ExamplePackage/Package.swift
let package = Package(
  name: "ExamplePackage",
  platforms: [.iOS("15.0")],
  products: [
    .library(name: "ExamplePackage", targets: ["ExamplePackage"]),
  ],
  dependencies: [
    .package(url: "https://github.com/grpc/grpc-swift.git", exact: "1.27.0",),
  ],
  targets: [
    // This target can be implemented in Swift with @objc API or in Objective-C
    .target(name: "ExamplePackage", dependencies: [.product(name: "GRPC", package: "grpc-swift")]),
  ]
)
```
{collapsible="true" collapsed-title-line-number="3"}

要在你的 Kotlin 建置 指令碼 中匯入它，請使用 `localSwiftPackage` API：

```kotlin
// <projectDir>/shared/build.gradle.kts
kotlin {
    swiftPMDependencies {
        localSwiftPackage(
            directory = project.layout.projectDirectory.dir("/path/to/ExamplePackage/"),
            products = listOf("ExamplePackage")
        )
    }
}
```

同步 Gradle 檔案以執行 SwiftPM 匯入，然後在你的 Kotlin 程式碼中使用匯入的 API：

```kotlin
// /path/to/shared/src/appleMain/kotlin/useExamplePackage.kt

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun useExamplePackage() {
    // If the Swift package is successfully imported,
    // the IDE suggests the correct import for the class
    HelloFromExamplePackage().hello()
}
```

### 特定部署版本

如果你的相依性需要更高的 [部署版本](https://developer.apple.com/documentation/packagedescription/supportedplatform)，
請在 `*MinimumDeploymentTarget` 參數 中指定。例如，針對 iOS：

```kotlin
kotlin {
    swiftPMDependencies {
        iosMinimumDeploymentTarget.set("16.0")
    }
}
```

### Swift 軟件包 的位置與版本

與 `Package.swift` 資訊清單檔案類似，你可以在 `swiftPackage()` 呼叫中指定 Swift 軟件包 的位置和 版本。
兩者都有幾個互斥的選項。 

要設定位置，你可以使用 URL 或 [SwiftPM 登錄 ID](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/usingswiftpackageregistry)：

```kotlin
swiftPackage(
    // Option 1, URL string
    // Points to the Git repository of the package
    url = url("https://github.com/firebase/firebase-ios-sdk.git")

    // Option 2, Swift Package Registry ID
    // See Apple documentation on using a package registry linked above  
    repository = id("...")
)
```

要指定 版本，請使用以下 Gradle 和 Git 風格的 版本 規格：

```kotlin
swiftPackage(
    // Similar to the Gradle 'require' version constraint,
    // starting with the specified version
    version = from("1.0")

    // Similar to the Gradle 'strict' version constraint,
    // exactly matching the specified version
    version = exact("2.0")

    // Git-specific version specification,
    // matching the specified branch or revision
    version = branch("master")
    // Or
    version = revision("e74b07278b926c9ec6f9643455ea00d1ce04a021")
)
```

## 動態 Kotlin/Native 架構 的已知限制

目前，SwiftPM 匯入整合不支援產生動態 Kotlin/Native 架構 時可能出現的所有 邊緣情況。你可能會在 Xcode 建置期間遇到問題，或在 執行階段 看到警告，例如：

* `Undefined symbols for architecture ...: "...", referenced from: ld: symbol(s) not found ...`
* `dyld: Symbol not found: ...`
* `objc[...]: Class _Foo is implemented in both /path/to/Shared and /path/to/Bar. This may cause spurious casting failures and mysterious crashes. One of the duplicates must be removed or renamed.`

這些問題的通用修正方法是將 `isStatic` 屬性設定為 `true` 來變更 架構 的連結模式：

```kotlin
// shared/build.gradle.kts
kotlin {
    listOf(
        iosArm64(),
        iosSimulatorArm64()
    ).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "Shared"

            // Set this property to "true"
            isStatic = true
        }
    }
}
```

如果你遇到任何這些問題、需要保持 `isStatic=false`，或者更改此 屬性 無助於解決建置失敗，請在我們的 Slack 頻道中告知我們。獲取 [邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#kmp-swift-package-manager](https://kotlinlang.slack.com/archives/C09TW68099C)。

## 下一步

進一步了解 [如何在 KMP 專案中從 CocoaPods 切換到 SwiftPM 相依性](multiplatform-cocoapods-spm-migration.md)。