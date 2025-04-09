---
title: "建構最終原生二進位檔案 (實驗性 DSL)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>
:::note
以下描述的新 DSL 處於 [實驗性階段](components-stability)。它可能隨時變更。
我們鼓勵您將其用於評估目的。

如果新的 DSL 不適合您，請參閱[先前建構原生二進位檔的方法](multiplatform-build-native-binaries)。

[Kotlin/Native 目標](multiplatform-dsl-reference#native-targets)會編譯為 `*.klib` 函式庫構件，
可以被 Kotlin/Native 本身作為依賴項使用，但不能作為原生函式庫使用。
 
要宣告最終的原生二進位檔，請使用帶有 `kotlinArtifacts` DSL 的新二進位檔格式。除了預設的 `*.klib` 構件外，它還表示為此目標建構的一組原生二進位檔，並提供一組用於宣告和配置它們的方法。
 
預設情況下，`kotlin-multiplatform` 外掛程式不會建立任何生產二進位檔。預設情況下，唯一可用的二進位檔是一個偵錯測試可執行檔，可讓您從 `test` 編譯中執行單元測試。

:::

Kotlin 構件 DSL 可以幫助您解決一個常見問題：當您需要從您的應用程式存取多個 Kotlin 模組時。
由於對多個 Kotlin/Native 構件的使用受到限制，您可以使用新的 DSL 將多個 Kotlin 模組匯出到單個構件中。

## 宣告二進位檔

`kotlinArtifacts {}` 是 Gradle 建構腳本中用於構件配置的頂層區塊。使用以下幾種二進位檔來宣告 `kotlinArtifacts {}` DSL 的元素：

| Factory method | Binary kind                                                                               | Available for                                |
|----------------|-------------------------------------------------------------------------------------------|----------------------------------------------|
| `sharedLib`    | [共享原生函式庫](native-faq#how-do-i-create-a-shared-library) (Shared native library)  | 除了 `WebAssembly` 之外的所有原生目標       |
| `staticLib`    | [靜態原生函式庫](native-faq#how-do-i-create-a-static-library-or-an-object-file) (Static native library) | 除了 `WebAssembly` 之外的所有原生目標       |
| `framework`    | Objective-C 框架 (Objective-C framework)                                                                  | 僅限 macOS、iOS、watchOS 和 tvOS 目標       |
| `fatFramework` | 通用 Fat 框架 (Universal fat framework)                                                                 | 僅限 macOS、iOS、watchOS 和 tvOS 目標       |
| `XCFramework`  | XCFramework 框架 (XCFramework framework)                                                                  | 僅限 macOS、iOS、watchOS 和 tvOS 目標       |

在 `kotlinArtifacts` 元素中，您可以編寫以下區塊：

* [Native.Library](#library)
* [Native.Framework](#framework)
* [Native.FatFramework](#fat-frameworks)
* [Native.XCFramework](#xcframeworks)

最簡單的版本需要所選建構類型的 `target`（或 `targets`）參數。目前，有兩種建構類型可用：

* `DEBUG` – 產生帶有偵錯資訊的非最佳化二進位檔
* `RELEASE` – 產生不帶偵錯資訊的最佳化二進位檔

在 `modes` 參數中，您可以指定要為其建立二進位檔的建構類型。預設值包括 `DEBUG` 和 `RELEASE` 可執行二進位檔：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library {
        target = iosX64 // Define your target instead
        modes(DEBUG, RELEASE)
        // Binary configuration
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library {
        target = iosX64 // Define your target instead
        modes(DEBUG, RELEASE)
        // Binary configuration
    }
}
```

</TabItem>
</Tabs>

您也可以使用自訂名稱宣告二進位檔：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library("mylib") {
        // Binary configuration
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library("mylib") {
        // Binary configuration
    }
}
```

</TabItem>
</Tabs>

此引數設定名稱字首，它是二進位檔的預設名稱。例如，對於 Windows，此程式碼產生 `mylib.dll` 檔案。

## 配置二進位檔

對於二進位檔配置，可以使用以下通用參數：

| **Name**        | **Description**                                                                                                                                        |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `isStatic`      | 可選的連結類型，用於定義函式庫類型。預設情況下，它是 `false` 並且函式庫是動態的。                                                                                    |
| `modes`         | 可選的建構類型，`DEBUG` 和 `RELEASE`。                                                                                                                 |
| `kotlinOptions` | 應用於編譯的可選編譯器選項。請參閱可用的[編譯器選項](gradle-compiler-options)清單。                                                                               |
| `addModule`     | 除了當前模組之外，您還可以將其他模組新增到產生的構件中。                                                                                                           |
| `setModules`    | 您可以覆寫將新增到產生的構件中的所有模組的清單。                                                                                                                |
| `target`        | 宣告專案的特定目標。可用目標的名稱列在 [Targets](multiplatform-dsl-reference#targets) 區段中。                                                                   |

### 函式庫和框架

在建構 Objective-C 框架或原生函式庫（共享或靜態）時，您可能不僅需要打包當前專案的類別，還需要將任何其他多平台模組的類別打包到單個實體中，並將所有這些模組匯出到其中。

#### Library

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library("myslib") {
        target = linuxX64
        isStatic = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs += "-Xmen=pool"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library("myslib") {
        target = linuxX64
        it.static = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs += "-Xmen=pool"
        }
    }
}
```

</TabItem>
</Tabs>

已註冊的 Gradle 任務是 `assembleMyslibSharedLibrary`，它將所有類型的已註冊 "myslib" 組裝到一個動態函式庫中。

#### Framework

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        isStatic = false
        kotlinOptions {
            verbose = false
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        it.static = false
        kotlinOptions {
            verbose = false
        }
    }
}
```

</TabItem>
</Tabs>

已註冊的 Gradle 任務是 `assembleMyframeFramework`，它將所有類型的已註冊 "myframe" 框架組裝起來。

:::tip
如果由於某種原因，新的 DSL 無法正常工作，請嘗試[先前的方法](multiplatform-build-native-binaries#export-dependencies-to-binaries)
將依賴項匯出到二進位檔。

:::

### Fat 框架

預設情況下，Kotlin/Native 產生的 Objective-C 框架僅支援一個平台。但是，您可以將此類框架合併到單個通用（fat）二進位檔中。這對於 32 位和 64 位 iOS 框架尤其有意義。
在這種情況下，您可以在 32 位和 64 位裝置上使用產生的通用框架。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.FatFramework("myfatframe") {
        targets(iosX32, iosX64)
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.FatFramework("myfatframe") {
        targets(iosX32, iosX64)
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</TabItem>
</Tabs>

已註冊的 Gradle 任務是 `assembleMyfatframeFatFramework`，它將所有類型的已註冊 "myfatframe" fat 框架組裝起來。

:::tip
如果由於某種原因，新的 DSL 無法正常工作，請嘗試[先前的方法](multiplatform-build-native-binaries#build-universal-frameworks)
建構 fat 框架。

:::

### XCFrameworks

所有 Kotlin Multiplatform 專案都可以使用 XCFrameworks 作為輸出，以在單個套件中收集所有目標平台和架構的邏輯。與[通用（fat）框架](#fat-frameworks)不同，您無需
在將應用程式發佈到 App Store 之前，移除所有不必要的架構。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.XCFramework("sdk") {
        targets(iosX64, iosArm64, iosSimulatorArm64)
        setModules(
            project(":shared"),
            project(":lib")
        )
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.XCFramework("sdk") {
        targets(iosX64, iosArm64, iosSimulatorArm64)
        setModules(
            project(":shared"), 
            project(":lib")
        )
    }
}
```

</TabItem>
</Tabs>

已註冊的 Gradle 任務是 `assembleSdkXCFramework`，它將所有類型的已註冊 "sdk" XCFrameworks 組裝起來。

:::tip
如果由於某種原因，新的 DSL 無法正常工作，請嘗試[先前的方法](multiplatform-build-native-binaries#build-xcframeworks)
建構 XCFrameworks。

:::