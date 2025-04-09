---
title: 建立最終原生二進位檔
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

預設情況下，Kotlin/Native 目標會編譯為 `*.klib` 函式庫成品，該成品可以被 Kotlin/Native 本身作為依賴項使用，但不能被執行或用作原生函式庫。

若要宣告最終的原生二進位檔案，例如可執行檔或共享函式庫，請使用原生目標的 `binaries` 屬性。
此屬性表示為此目標構建的原生二進位檔案的集合，除了預設的 `*.klib` 成品之外，還提供了一組用於宣告和配置它們的方法。

:::note
預設情況下，`kotlin-multiplatform` 外掛程式不會建立任何生產二進位檔案。預設情況下，唯一可用的二進位檔案是一個除錯測試可執行檔，可讓您從 `test` 編譯中執行單元測試。

:::

Kotlin/Native 編譯器產生的二進位檔案可以包含協力廠商程式碼、資料或衍生作品。
這意味著，如果您分發 Kotlin/Native 編譯的最終二進位檔案，
您應始終將必要的 [授權檔案](native-binary-licenses) 包含到您的二進位檔案發佈中。

## 宣告二進位檔案

使用以下工廠方法來宣告 `binaries` 集合的元素。

| 工廠方法     | 二進位檔案種類         | 適用於                                |
|----------------|-----------------------|----------------------------------------------|
| `executable`   | 產品可執行檔        | 所有原生目標                           |
| `test`         | 測試可執行檔         | 所有原生目標                           |
| `sharedLib`    | 共享原生函式庫      | 除了 `WebAssembly` 之外的所有原生目標 |
| `staticLib`    | 靜態原生函式庫      | 除了 `WebAssembly` 之外的所有原生目標 |
| `framework`    | Objective-C 框架 | 僅適用於 macOS、iOS、watchOS 和 tvOS 目標   |

最簡單的版本不需要任何額外的參數，並且為每個構建類型建立一個二進位檔案。目前，
有兩種構建類型可用：

* `DEBUG` – 產生帶有除錯資訊的非最佳化二進位檔案
* `RELEASE` – 產生沒有除錯資訊的最佳化二進位檔案

以下程式碼片段建立兩個可執行二進位檔案，除錯和發佈：

```kotlin
kotlin {
    linuxX64 { // 定義您的目標。
        binaries {
            executable {
                // 二進位檔案配置。
            }
        }
    }
}
```

如果不需要 [其他配置](multiplatform-dsl-reference#native-targets)，您可以刪除 lambda：

```kotlin
binaries {
    executable()
}
```

您可以指定為哪些構建類型建立二進位檔案。在以下範例中，僅建立 `debug` 可執行檔：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // 二進位檔案配置。
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable([DEBUG]) {
        // 二進位檔案配置。
    }
}
```

</TabItem>
</Tabs>

您也可以宣告具有自訂名稱的二進位檔案：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // 二進位檔案配置。
    }

    // 可以刪除構建類型清單
    // （在這種情況下，將使用所有可用的構建類型）。
    executable("bar") {
        // 二進位檔案配置。
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // 二進位檔案配置。
    }

    // 可以刪除構建類型清單
    // （在這種情況下，將使用所有可用的構建類型）。
    executable('bar') {
        // 二進位檔案配置。
    }
}
```

</TabItem>
</Tabs>

第一個參數設定名稱前綴，這是二進位檔案的預設名稱。例如，對於 Windows，程式碼
產生檔案 `foo.exe` 和 `bar.exe`。您也可以使用名稱前綴來 [在構建腳本中存取二進位檔案](#access-binaries)。

## 存取二進位檔案

您可以存取二進位檔案以 [配置它們](multiplatform-dsl-reference#native-targets) 或取得它們的屬性（例如，輸出檔案的路徑）。

您可以通過其唯一名稱取得二進位檔案。此名稱基於名稱前綴（如果已指定）、構建類型和
二進位檔案種類，遵循模式：`<optional-name-prefix><build-type><binary-kind>`，例如，`releaseFramework` 或
`testDebugExecutable`。

:::note
靜態和共享函式庫分別具有後綴 static 和 shared，例如，`fooDebugStatic` 或 `barReleaseShared`。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// 如果沒有這樣的二進位檔案，則失敗。
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// 如果沒有這樣的二進位檔案，則傳回 null。
binaries.findByName("fooDebugExecutable")
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// 如果沒有這樣的二進位檔案，則失敗。
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// 如果沒有這樣的二進位檔案，則傳回 null。
binaries.findByName('fooDebugExecutable')
```

</TabItem>
</Tabs>

或者，您可以使用類型化的 getter 按其名稱前綴和構建類型存取二進位檔案。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// 如果沒有這樣的二進位檔案，則失敗。
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // 如果未設定名稱前綴，則跳過第一個參數。
binaries.getExecutable("bar", "DEBUG") // 您也可以使用字串作為構建類型。

// 類似的 getter 可用於其他二進位檔案種類：
// getFramework、getStaticLib 和 getSharedLib。

// 如果沒有這樣的二進位檔案，則傳回 null。
binaries.findExecutable("foo", DEBUG)

// 類似的 getter 可用於其他二進位檔案種類：
// findFramework、findStaticLib 和 findSharedLib。
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// 如果沒有這樣的二進位檔案，則失敗。
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // 如果未設定名稱前綴，則跳過第一個參數。
binaries.getExecutable('bar', 'DEBUG') // 您也可以使用字串作為構建類型。

// 類似的 getter 可用於其他二進位檔案種類：
// getFramework、getStaticLib 和 getSharedLib。

// 如果沒有這樣的二進位檔案，則傳回 null。
binaries.findExecutable('foo', DEBUG)

// 類似的 getter 可用於其他二進位檔案種類：
// findFramework、findStaticLib 和 findSharedLib。
```

</TabItem>
</Tabs>

## 將依賴項匯出到二進位檔案

在構建 Objective-C 框架或原生函式庫（共享或靜態）時，您可能不僅需要打包目前專案的類別，
還需要打包其依賴項的類別。使用 `export` 方法指定要匯出到二進位檔案的依賴項。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        macosMain.dependencies {
            // 將被匯出。
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // 將不被匯出。
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // 可以將不同的依賴項集合匯出到不同的二進位檔案。
            export(project(':dependency'))
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        macosMain.dependencies {
            // 將被匯出。
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // 將不被匯出。
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // 可以將不同的依賴項集合匯出到不同的二進位檔案。
            export project(':dependency')
        }
    }
}
```

</TabItem>
</Tabs>

例如，您在 Kotlin 中實現了幾個模組，並且想要從 Swift 存取它們。在 Swift 應用程式中使用
多個 Kotlin/Native 框架受到限制，但您可以建立一個總括框架並
將所有這些模組匯出到其中。

:::note
您只能匯出相應原始碼集的 [`api` 依賴項](gradle-configure-project#dependency-types)。

:::

當您匯出依賴項時，它會將其所有 API 包含到框架 API 中。
編譯器會將來自此依賴項的程式碼新增到框架，即使您只使用了其中的一小部分。
這會為匯出的依賴項（以及在某種程度上為其依賴項）停用無效程式碼消除。

預設情況下，匯出以非遞移方式運作。這意味著，如果您匯出依賴於函式庫 `bar` 的函式庫 `foo`，
則只會將 `foo` 的方法新增到輸出框架。

您可以使用 `transitiveExport` 選項來變更此行為。如果設定為 `true`，則也會匯出函式庫 `bar` 的宣告。

:::caution
不建議使用 `transitiveExport`：它會將匯出的依賴項的所有遞移依賴項新增到框架。
這可能會增加編譯時間和二進位檔案大小。

在大多數情況下，您不需要將所有這些依賴項新增到框架 API。
對於您需要從 Swift 或 Objective-C 程式碼直接存取的依賴項，請明確使用 `export`。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 以遞移方式匯出。
        transitiveExport = true
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    framework {
        export project(':dependency')
        // 以遞移方式匯出。
        transitiveExport = true
    }
}
```

</TabItem>
</Tabs>

## 構建通用框架

預設情況下，Kotlin/Native 產生的 Objective-C 框架僅支援一個平台。但是，您可以使用 [`lipo` 工具](https://llvm.org/docs/CommandGuide/llvm-lipo.html) 將此類
框架合併為單個通用（胖）二進位檔案。對於 32 位元和 64 位元 iOS 框架，此操作尤其有意義。在這種情況下，您可以在 32 位元和 64 位元裝置上使用產生的通用
框架。

:::caution
胖框架必須與初始框架具有相同的基本名稱。否則，您將收到錯誤。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 建立和配置目標。
    val watchos32 = watchosArm32("watchos32")
    val watchos64 = watchosArm64("watchos64")
    configure(listOf(watchos32, watchos64)) {
        binaries.framework {
            baseName = "my_framework"
        }
    }
    // 建立一個任務來構建胖框架。
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // 胖框架必須與初始框架具有相同的基本名稱。
        baseName = "my_framework"
        // 預設目標目錄為 "<build directory>/fat-framework"。
        destinationDir = buildDir.resolve("fat-framework/debug")
        // 指定要合併的框架。
        from(
            watchos32.binaries.getFramework("DEBUG"),
            watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 建立和配置目標。
    targets {
        watchosArm32("watchos32")
        watchosArm64("watchos64")
        configure([watchos32, watchos64]) {
            binaries.framework {
                baseName = "my_framework"
            }
        }
    }
    // 建立一個構建胖框架的任務。
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // 胖框架必須與初始框架具有相同的基本名稱。
        baseName = "my_framework"
        // 預設目標目錄為 "<build directory>/fat-framework"。
        destinationDir = file("$buildDir/fat-framework/debug")
        // 指定要合併的框架。
        from(
            targets.watchos32.binaries.getFramework("DEBUG"),
            targets.watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
</Tabs>

## 構建 XCFrameworks

所有 Kotlin 多平台專案都可以使用 XCFrameworks 作為輸出，以在單個捆綁包中收集所有目標平台和架構的邏輯。
與 [通用（胖）框架](#build-universal-frameworks) 不同，您無需在將應用程式發佈到 App Store 之前移除所有不必要的架構。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform") version "2.1.20"
}

kotlin {
    val xcf = XCFramework()
    val iosTargets = listOf(iosX64(), iosArm64(), iosSimulatorArm64())
    
    iosTargets.forEach {
        it.binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)
    def iosTargets = [iosX64(), iosArm64(), iosSimulatorArm64()]
    
    iosTargets.forEach {
        it.binaries.framework {
            baseName = 'shared'
            xcf.add(it)
        }
    }
}
```

</TabItem>
</Tabs>

當您宣告 XCFrameworks 時，Kotlin Gradle 外掛程式將註冊多個 Gradle 任務：

* `assembleXCFramework`
* `assemble<Framework name>DebugXCFramework`
* `assemble<Framework name>ReleaseXCFramework`

<anchor name="build-frameworks"/>

如果您在專案中使用 [CocoaPods 整合](native-cocoapods)，則可以使用 Kotlin
CocoaPods Gradle 外掛程式構建 XCFrameworks。它包含以下任務，這些任務使用所有註冊的目標構建 XCFrameworks，並
產生 podspec 檔案：

* `podPublishReleaseXCFramework`，它產生發佈 XCFramework 以及 podspec 檔案。
* `podPublishDebugXCFramework`，它產生除錯 XCFramework 以及 podspec 檔案。
* `podPublishXCFramework`，它產生除錯和發佈 XCFrameworks 以及 podspec 檔案。

這可以幫助您通過 CocoaPods 將專案的共享部分與行動應用程式分開分發。您也可以使用 XCFrameworks
發佈到私有或公共 podspec 儲存庫。

:::caution
如果 Kotlin 框架是為不同版本的
Kotlin 構建的，則不建議將其發佈到公共儲存庫。這樣做可能會導致最終使用者專案中的衝突。

:::

## 自訂 Info.plist 檔案

在產生框架時，Kotlin/Native 編譯器會產生資訊屬性清單檔案 `Info.plist`。
您可以使用相應的二進位檔案選項自訂其屬性：

| 屬性                         | 二進位檔案選項               |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

若要啟用該功能，請傳遞 `-Xbinary=$option=$value` 編譯器標誌或為特定框架設定 `binaryOption("option", "value")`
Gradle DSL：

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}
```