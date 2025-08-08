[//]: # (title: 建置最終原生二進位檔案)

依預設，Kotlin/Native 目標會編譯成 `*.klib` 程式庫構件，此構件可由 Kotlin/Native 本身作為依賴項使用，但無法執行或用作原生程式庫。

若要宣告最終的原生二進位檔案，例如可執行檔或共用程式庫，請使用原生目標的 `binaries` 屬性。此屬性代表為此目標建置的原生二進位檔案集合，除了預設的 `*.klib` 構件之外，還提供一組用於宣告和配置它們的方法。

> 依預設，`kotlin-multiplatform` 外掛程式不會建立任何生產二進位檔案。依預設唯一可用的二進位檔案是除錯測試可執行檔，可讓您從 `test` 編譯執行單元測試。
>
{style="note"}

Kotlin/Native 編譯器產生的二進位檔案可能包含第三方程式碼、資料或衍生作品。這表示如果您要分發 Kotlin/Native 編譯的最終二進位檔案，您應該始終在您的二進位分發中包含必要的 [授權檔案](https://kotlinlang.org/docs/native-binary-licenses.html)。

## 宣告二進位檔案

使用以下工廠方法來宣告 `binaries` 集合的元素。

| 工廠方法     | 二進位類型          | 適用於                                       |
|--------------|---------------------|----------------------------------------------|
| `executable` | 產品可執行檔        | 所有原生目標                                 |
| `test`       | 測試可執行檔        | 所有原生目標                                 |
| `sharedLib`  | 共用原生程式庫      | 所有原生目標                                 |
| `staticLib`  | 靜態原生程式庫      | 所有原生目標                                 |
| `framework`  | Objective-C 框架    | 僅適用於 macOS、iOS、watchOS 和 tvOS 目標 |

最簡單的版本不需要任何額外的參數，並為每個建置類型建立一個二進位檔案。目前有兩種建置類型可用：

* `DEBUG` – 產生一個非優化的二進位檔案，其中包含在處理 [除錯工具](https://kotlinlang.org/docs/native-debugging.html) 時有用的額外中繼資料
* `RELEASE` – 產生一個不含除錯資訊的優化二進位檔案

以下程式碼片段建立兩個可執行二進位檔案，分別為除錯版和發布版：

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

如果不需要 [額外配置](multiplatform-dsl-reference.md#native-targets)，您可以省略 lambda：

```kotlin
binaries {
    executable()
}
```

您可以指定為哪些建置類型建立二進位檔案。在以下範例中，僅建立 `debug` 可執行檔：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // 二進位配置。
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable([DEBUG]) {
        // 二進位配置。
    }
}
```

</tab>
</tabs>

您也可以宣告帶有自訂名稱的二進位檔案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // 二進位配置。
    }

    // 可以省略建置類型列表
    // （在這種情況下，將使用所有可用的建置類型）。
    executable("bar") {
        // 二進位配置。
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // 二進位配置。
    }

    // 可以省略建置類型列表
    // （在這種情況下，將使用所有可用的建置類型）。
    executable('bar') {
        // 二進位配置。
    }
}
```

</tab>
</tabs>

第一個引數設定了名稱前綴，這是二進位檔案的預設名稱。例如，對於 Windows，此程式碼會產生 `foo.exe` 和 `bar.exe` 檔案。您還可以使用名稱前綴來在 [建置腳本中存取二進位檔案](#access-binaries)。

## 存取二進位檔案

您可以存取二進位檔案以 [配置它們](multiplatform-dsl-reference.md#native-targets) 或取得其屬性（例如，輸出檔案的路徑）。

您可以透過其唯一名稱取得二進位檔案。此名稱基於名稱前綴（如果已指定）、建置類型和二進位類型，遵循以下模式：`<optional-name-prefix><build-type><binary-kind>`，例如 `releaseFramework` 或 `testDebugExecutable`。

> 靜態和共用程式庫分別帶有 `static` 和 `shared` 後綴，例如 `fooDebugStatic` 或 `barReleaseShared`。
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// 如果沒有此二進位檔案，則會失敗。
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// 如果沒有此二進位檔案，則傳回 null。
binaries.findByName("fooDebugExecutable")
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// 如果沒有此二進位檔案，則會失敗。
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// 如果沒有此二進位檔案，則傳回 null。
binaries.findByName('fooDebugExecutable')
```

</tab>
</tabs>

或者，您可以使用型別化 getter，透過其名稱前綴和建置類型存取二進位檔案。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// 如果沒有此二進位檔案，則會失敗。
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // 如果未設定名稱前綴，則可跳過第一個引數。
binaries.getExecutable("bar", "DEBUG") // 您也可以使用字串作為建置類型。

// 其他二進位類型也有類似的 getter：
// getFramework、getStaticLib 和 getSharedLib。

// 如果沒有此二進位檔案，則傳回 null。
binaries.findExecutable("foo", DEBUG)

// 其他二進位類型也有類似的 getter：
// findFramework、findStaticLib 和 findSharedLib。
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// 如果沒有此二進位檔案，則會失敗。
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // 如果未設定名稱前綴，則可跳過第一個引數。
binaries.getExecutable('bar', 'DEBUG') // 您也可以使用字串作為建置類型。

// 其他二進位類型也有類似的 getter：
// getFramework、getStaticLib 和 getSharedLib。

// 如果沒有此二進位檔案，則傳回 null。
binaries.findExecutable('foo', DEBUG)

// 其他二進位類型也有類似的 getter：
// findFramework、findStaticLib 和 findSharedLib。
```

</tab>
</tabs>

## 將依賴項匯出到二進位檔案

建置 Objective-C 框架或原生程式庫（共用或靜態）時，您可能需要打包的不僅是目前專案的類別，還有其依賴項的類別。使用 `export` 方法指定要匯出到二進位檔案的依賴項。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        macosMain.dependencies {
            // 將會匯出。
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // 將不會匯出。
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // 可以將不同組的依賴項匯出到不同的二進位檔案。
            export(project(':dependency'))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        macosMain.dependencies {
            // 將會匯出。
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // 將不會匯出。
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // 可以將不同組的依賴項匯出到不同的二進位檔案。
            export project(':dependency')
        }
    }
}
```

</tab>
</tabs>

例如，您在 Kotlin 中實作了多個模組，並希望從 Swift 存取它們。在 Swift 應用程式中使用多個 Kotlin/Native 框架受到限制，但您可以建立一個傘型框架 (umbrella framework) 並將所有這些模組匯出到其中。

> 您只能匯出相應原始碼集的 [`api` 依賴項](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)。
>
{style="note"}

當您匯出一個依賴項時，它會將其所有 API 包含到框架 API 中。編譯器會將此依賴項的程式碼新增到框架中，即使您只使用了其中一小部分。這會禁用匯出依賴項（以及在某種程度上禁用其依賴項）的無用程式碼消除。

依預設，匯出是非遞移的。這表示如果您匯出依賴於程式庫 `bar` 的程式庫 `foo`，則只有 `foo` 的方法會新增到輸出框架中。

您可以使用 `transitiveExport` 選項來更改此行為。如果設定為 `true`，則程式庫 `bar` 的宣告也會匯出。

> 不建議使用 `transitiveExport`：它會將匯出依賴項的所有遞移依賴項新增到框架中。
> 這可能會增加編譯時間和二進位檔案大小。
>
> 在大多數情況下，您不需要將所有這些依賴項新增到框架 API。
> 對於您需要從 Swift 或 Objective-C 程式碼直接存取的依賴項，請明確使用 `export`。
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 遞移匯出。
        transitiveExport = true
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    framework {
        export project(':dependency')
        // 遞移匯出。
        transitiveExport = true
    }
}
```

</tab>
</tabs>

## 建置通用框架

依預設，Kotlin/Native 產生的 Objective-C 框架僅支援一個平台。但是，您可以使用 [`lipo` 工具](https://llvm.org/docs/CommandGuide/llvm-lipo.html) 將此類框架合併為單一通用（胖）二進位檔案。此操作對於 32 位元和 64 位元 iOS 框架尤其有意義。在這種情況下，您可以在 32 位元和 64 位元裝置上使用產生的通用框架。

> 胖框架必須與初始框架具有相同的基本名稱。否則，您將會收到錯誤。
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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
    // 建立建置胖框架的任務。
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // 胖框架必須與初始框架具有相同的基本名稱。
        baseName = "MyFramework"
        // 預設目的地目錄為 "<build directory>/fat-framework"。
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // 指定要合併的框架。
        from(
            watchos32.binaries.getFramework("DEBUG"),
            watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

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
    // 建立建置胖框架的任務。
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // 胖框架必須與初始框架具有相同的基本名稱。
        baseName = "MyFramework"
        // 預設目的地目錄為 "<build directory>/fat-framework"。
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // 指定要合併的框架。
        from(
            targets.watchos32.binaries.getFramework("DEBUG"),
            targets.watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
</tabs>

## 建置 XCFrameworks

所有 Kotlin 多平台專案都可以使用 XCFrameworks 作為輸出，將所有目標平台和架構的邏輯收集到一個單一的綑綁包中。與 [通用（胖）框架](#build-universal-frameworks) 不同，您無需在將應用程式發佈到 App Store 之前移除所有不必要的架構。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

當您宣告 XCFrameworks 時，Kotlin Gradle 外掛程式將會註冊幾個 Gradle 任務：

* `assembleXCFramework`
* `assemble<Framework name>DebugXCFramework`
* `assemble<Framework name>ReleaseXCFramework`

<anchor name="build-frameworks"/>

如果您在專案中使用 [CocoaPods 整合](multiplatform-cocoapods-overview.md)，您可以使用 Kotlin CocoaPods Gradle 外掛程式建置 XCFrameworks。它包含以下任務，這些任務會使用所有已註冊的目標建置 XCFrameworks 並產生 `podspec` 檔案：

* `podPublishReleaseXCFramework`，它會產生一個發布版 XCFramework 和一個 `podspec` 檔案。
* `podPublishDebugXCFramework`，它會產生一個除錯版 XCFramework 和一個 `podspec` 檔案。
* `podPublishXCFramework`，它會產生除錯版和發布版 XCFramework 以及一個 `podspec` 檔案。

這可以幫助您透過 CocoaPods 將專案的共用部分與行動應用程式分開分發。您還可以將 XCFrameworks 用於發佈到私人或公共 `podspec` 儲存庫。

> 如果 Kotlin 框架是針對不同版本的 Kotlin 建置的，則不建議將其發佈到公共儲存庫。這樣做可能會導致終端使用者專案中的衝突。
>
{style="warning"}

## 自訂 Info.plist 檔案

當產生框架時，Kotlin/Native 編譯器會產生資訊屬性列表檔案 `Info.plist`。您可以使用相應的二進位選項自訂其屬性：

| 屬性                     | 二進位選項              |
|--------------------------|-------------------------|
| `CFBundleIdentifier`     | `bundleId`              |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`        | `bundleVersion`         |

若要啟用此功能，請傳遞 `-Xbinary=$option=$value` 編譯器旗標，或為特定框架設定 `binaryOption("option", "value")` Gradle DSL：

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}