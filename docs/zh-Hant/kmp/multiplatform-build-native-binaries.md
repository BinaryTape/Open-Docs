[//]: # (title: 建置最終原生二進位檔)

依預設，Kotlin/Native 目標會編譯為 `*.klib` 函式庫產物，此產物可被 Kotlin/Native 本身作為依賴項使用，但無法被執行或作為原生函式庫使用。

若要宣告最終原生二進位檔（例如可執行檔或共享函式庫），請使用原生目標的 `binaries` 屬性。此屬性代表為此目標建置的原生二進位檔集合，除了預設的 `*.klib` 產物外，還提供一組用於宣告和配置它們的方法。

> `kotlin-multiplatform` 外掛程式預設不會建立任何生產環境二進位檔。預設唯一可用的二進位檔是偵錯測試可執行檔，可讓您從 `test` 編譯執行單元測試。
>
{style="note"}

Kotlin/Native 編譯器產生的二進位檔可包含第三方程式碼、資料或衍生作品。這表示如果您分發 Kotlin/Native 編譯的最終二進位檔，您應始終將必要的[授權檔案](https://kotlinlang.org/docs/native-binary-licenses.html)包含在您的二進位發布中。

## 宣告二進位檔

使用以下工廠方法宣告 `binaries` 集合的元素。

| 工廠方法 | 二進位種類 | 適用於 |
|----------------|-----------------------|--------------------------------------------|
| `executable`   | 產品可執行檔    | 所有原生目標                         |
| `test`         | 測試可執行檔       | 所有原生目標                         |
| `sharedLib`    | 共享原生函式庫 | 所有原生目標                         |
| `staticLib`    | 靜態原生函式庫 | 所有原生目標                         |
| `framework`    | Objective-C 框架 | 僅限 macOS、iOS、watchOS 和 tvOS 目標 |

最簡單的版本不需要任何額外參數，並為每個建置類型建立一個二進位檔。目前，有兩種建置類型可用：

*   `DEBUG` – 產生一個未最佳化的二進位檔，帶有在處理[偵錯工具](https://kotlinlang.org/docs/native-debugging.html)時有幫助的額外中繼資料
*   `RELEASE` – 產生一個不含偵錯資訊的最佳化二進位檔

以下程式碼片段建立兩個可執行二進位檔，分別是偵錯和釋出版本：

```kotlin
kotlin {
    linuxX64 { // 請改為定義您的目標。
        binaries {
            executable {
                // 二進位配置。
            }
        }
    }
}
```

如果不需要[額外配置](multiplatform-dsl-reference.md#native-targets)，您可以省略 lambda：

```kotlin
binaries {
    executable()
}
```

您可以指定為哪些建置類型建立二進位檔。在以下範例中，僅建立 `debug` 可執行檔：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // 二進位配置。
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    executable([DEBUG]) {
        // 二進位配置。
    }
}
```

</TabItem>
</Tabs>

您也可以宣告具有自訂名稱的二進位檔：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // 二進位配置。
    }

    // 可以省略建置類型列表
    // (在這種情況下，將使用所有可用的建置類型)。
    executable("bar") {
        // 二進位配置。
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // 二進位配置。
    }

    // 可以省略建置類型列表
    // (在這種情況下，將使用所有可用的建置類型)。
    executable('bar') {
        // 二進位配置。
    }
}
```

</TabItem>
</Tabs>

第一個參數設定一個名稱前綴，這是二進位檔案的預設名稱。例如，對於 Windows，此程式碼會產生 `foo.exe` 和 `bar.exe` 檔案。您也可以使用名稱前綴來[在建置腳本中存取二進位檔](#access-binaries)。

## 存取二進位檔

您可以透過其唯一名稱來存取二進位檔以[配置它們](multiplatform-dsl-reference.md#native-targets)或取得其屬性（例如，輸出檔案的路徑）。

此名稱基於名稱前綴（如果已指定）、建置類型和二進位種類，遵循以下模式：`<optional-name-prefix><build-type><binary-kind>`，例如 `releaseFramework` 或 `testDebugExecutable`。

> 靜態和共享函式庫分別帶有 `static` 和 `shared` 字尾，例如 `fooDebugStatic` 或 `barReleaseShared`。
>
{style="note"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
// 如果沒有此二進位檔，則失敗。
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// 如果沒有此二進位檔，則返回 null。
binaries.findByName("fooDebugExecutable")
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
// 如果沒有此二進位檔，則失敗。
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// 如果沒有此二進位檔，則返回 null。
binaries.findByName('fooDebugExecutable')
```

</TabItem>
</Tabs>

或者，您可以使用型別化 getter 透過名稱前綴和建置類型存取二進位檔。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
// 如果沒有此二進位檔，則失敗。
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // 如果未設定名稱前綴，則省略第一個參數。
binaries.getExecutable("bar", "DEBUG") // 您也可以為建置類型使用字串。

// 其他二進位種類也有類似的 getter：
// getFramework、getStaticLib 和 getSharedLib。

// 如果沒有此二進位檔，則返回 null。
binaries.findExecutable("foo", DEBUG)

// 其他二進位種類也有類似的 getter：
// findFramework、findStaticLib 和 findSharedLib。
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
// 如果沒有此二進位檔，則失敗。
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // 如果未設定名稱前綴，則省略第一個參數。
binaries.getExecutable('bar', 'DEBUG') // 您也可以為建置類型使用字串。

// 其他二進位種類也有類似的 getter：
// getFramework、getStaticLib 和 getSharedLib。

// 如果沒有此二進位檔，則返回 null。
binaries.findExecutable('foo', DEBUG)

// 其他二進位種類也有類似的 getter：
// findFramework、findStaticLib 和 findSharedLib。
```

</TabItem>
</Tabs>

## 將依賴項匯出到二進位檔

建置 Objective-C 框架或原生函式庫（共享或靜態）時，您可能需要不僅封裝當前專案的類別，還需封裝其依賴項的類別。使用 `export` 方法指定要將哪些依賴項匯出到二進位檔。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
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
            // 可以將不同組的依賴項匯出到不同的二進位檔。
            export(project(':dependency'))
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
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
            // 可以將不同組的依賴項匯出到不同的二進位檔。
            export project(':dependency')
        }
    }
}
```

</TabItem>
</Tabs>

例如，您在 Kotlin 中實作了多個模組並希望從 Swift 存取它們。在 Swift 應用程式中使用多個 Kotlin/Native 框架受到限制，但您可以建立一個傘狀框架並將所有這些模組匯出到其中。

> 您只能匯出相應原始碼集的 [`api` 依賴項](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)。
>
{style="note"}

當您匯出依賴項時，它會將其所有 API 包含到框架 API 中。編譯器會將此依賴項中的程式碼新增到框架中，即使您只使用了其中的一小部分。這會停用對匯出依賴項（以及在某種程度上，其依賴項）的無用程式碼消除。

預設情況下，匯出是非遞移的。這意味著如果您匯出依賴於函式庫 `bar` 的函式庫 `foo`，則只有 `foo` 的方法會新增到輸出框架中。

您可以使用 `transitiveExport` 選項更改此行為。如果設定為 `true`，則函式庫 `bar` 的宣告也會被匯出。

> 不建議使用 `transitiveExport`：它會將匯出依賴項的所有遞移依賴項新增到框架中。這可能會增加編譯時間和二進位檔大小。
>
> 在大多數情況下，您不需要將所有這些依賴項新增到框架 API 中。
> 對於您需要直接從 Swift 或 Objective-C 程式碼存取的依賴項，請明確使用 `export`。
>
{style="warning"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 遞移匯出。
        transitiveExport = true
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    framework {
        export project(':dependency')
        // 遞移匯出。
        transitiveExport = true
    }
}
```

</TabItem>
</Tabs>

## 建置通用框架

預設情況下，Kotlin/Native 產生的 Objective-C 框架僅支援一個平台。然而，您可以使用 [`lipo` 工具](https://llvm.org/docs/CommandGuide/llvm-lipo.html)將此類框架合併為單一的通用（fat）二進位檔。此操作對於 32 位元和 64 位元 iOS 框架尤其有意義。在這種情況下，您可以在 32 位元和 64 位元裝置上使用生成的通用框架。

> Fat 框架必須與初始框架具有相同的基本名稱。否則，您將會收到錯誤。
>
{style="warning"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 建立並配置目標。
    val watchos32 = watchosArm32("watchos32")
    val watchos64 = watchosArm64("watchos64")
    configure(listOf(watchos32, watchos64)) {
        binaries.framework {
            baseName = "MyFramework"
        }
    }
    // 建立一個建置 fat 框架的任務。
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // Fat 框架必須與初始框架具有相同的基本名稱。
        baseName = "MyFramework"
        // 預設目標目錄是 "<build directory>/fat-framework"。
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // 指定要合併的框架。
        from(
            watchos32.binaries.getFramework("DEBUG"),
            watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 建立並配置目標。
    targets {
        watchosArm32("watchos32")
        watchosArm64("watchos64")
        configure([watchos32, watchos64]) {
            binaries.framework {
                baseName = "MyFramework"
            }
        }
    }
    // 建立一個建置 fat 框架的任務。
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // Fat 框架必須與初始框架具有相同的基本名稱。
        baseName = "MyFramework"
        // 預設目標目錄是 "<build directory>/fat-framework"。
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
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

## 建置 XCFramework

所有 Kotlin Multiplatform 專案都可以使用 XCFramework 作為輸出，將所有目標平台和架構的邏輯收集到單一捆綁包中。與[通用（fat）框架](#build-universal-frameworks)不同，您無需在將應用程式發布到 App Store 之前移除所有不必要的架構。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
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
<TabItem title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
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

當您宣告 XCFrameworks 時，Kotlin Gradle 外掛程式將會註冊多個 Gradle 任務：

*   `assembleXCFramework`
*   `assemble<Framework name>DebugXCFramework`
*   `assemble<Framework name>ReleaseXCFramework`

undefined

如果您在專案中使用 [CocoaPods 整合](multiplatform-cocoapods-overview.md)，您可以透過 Kotlin CocoaPods Gradle 外掛程式建置 XCFramework。它包含以下任務，這些任務會建置包含所有註冊目標的 XCFramework，並生成 podspec 檔案：

*   `podPublishReleaseXCFramework`，它生成一個釋出 XCFramework 以及一個 podspec 檔案。
*   `podPublishDebugXCFramework`，它生成一個偵錯 XCFramework 以及一個 podspec 檔案。
*   `podPublishXCFramework`，它生成偵錯和釋出 XCFrameworks 以及一個 podspec 檔案。

這可以幫助您透過 CocoaPods 將專案的共享部分與行動應用程式分開分發。您也可以使用 XCFrameworks 發布到私有或公共 podspec 儲存庫。

> 如果 Kotlin 框架是針對不同版本的 Kotlin 建置的，則不建議將其發布到公共儲存庫。這樣做可能會導致終端使用者專案中出現衝突。
>
{style="warning"}

## 自訂 Info.plist 檔案

當產生框架時，Kotlin/Native 編譯器會生成資訊屬性列表檔案 `Info.plist`。您可以使用相應的二進位選項自訂其屬性：

| 屬性                     | 二進位選項              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

若要啟用此功能，請傳遞 `-Xbinary=$option=$value` 編譯器旗標，或為特定框架設定 `binaryOption("option", "value")` Gradle DSL：

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}
```