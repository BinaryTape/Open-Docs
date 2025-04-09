---
title: "多平台 Gradle DSL 參考"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform Gradle 外掛程式是用於建立 Kotlin Multiplatform 專案的工具。
在此我們提供其內容的參考；在為 Kotlin Multiplatform 專案編寫 Gradle 建置腳本時，可將其作為提醒。瞭解 [Kotlin Multiplatform 專案的概念、如何建立和設定它們](multiplatform-intro)。

## ID 和版本

Kotlin Multiplatform Gradle 外掛程式的完整名稱為 `org.jetbrains.kotlin.multiplatform`。
如果您使用 Kotlin Gradle DSL，您可以使用 `kotlin("multiplatform")` 應用此外掛程式。
外掛程式版本與 Kotlin 發佈版本相符。最新版本為 2.1.20。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

## 頂層區塊 (Top-level blocks)

`kotlin {}` 是 Gradle 建置腳本中用於多平台專案配置的頂層區塊 (top-level block)。
在 `kotlin {}` 內部，您可以編寫以下區塊：

| **區塊 (Block)**            | **描述 (Description)**                                                                                                                          |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | 宣告專案的特定目標 (target)。可用目標 (target) 的名稱列於 [目標 (Targets)](#targets) 區段。                 |
| `targets`            | 列出專案的所有目標 (target)。                                                                                                        |
| `sourceSets`         | 配置預定義和宣告自定義專案的 [源集 (source sets)](#source-sets)。                                                    |
| `compilerOptions`    | 指定通用擴展級別 [編譯器選項 (compiler options)](#compiler-options)，這些選項用作所有目標 (target) 和共享源集 (shared source sets) 的預設值。 |

## 目標 (Targets)

_目標 (target)_ 是建置的一部分，負責編譯、測試和封裝旨在支援平台之一的軟體。Kotlin 為每個平台提供目標 (target)，因此您可以指示 Kotlin 為該特定目標 (target) 編譯程式碼。瞭解更多關於 [設定目標 (target)](multiplatform-discover-project#targets) 的資訊。

每個目標 (target) 可以有一個或多個 [編譯 (compilations)](#compilations)。除了用於測試和生產目的的預設編譯 (default compilations) 之外，您還可以 [建立自定義編譯 (custom compilations)](multiplatform-configure-compilations#create-a-custom-compilation)。

多平台專案的目標 (target) 在 `kotlin {}` 內部的相應區塊中進行描述，例如，`jvm`、`androidTarget`、`iosArm64`。
可用目標 (target) 的完整清單如下：
<table>
<tr>
        <th>目標平台 (Target platform)</th>
        <th>目標 (Target)</th>
        <th>備註 (Comments)</th>
</tr>
<tr>
<td>
Kotlin/JVM
</td>
<td>
`jvm`
</td>
<td>
</td>
</tr>
<tr>
<td rowspan="2">
Kotlin/Wasm
</td>
<td>
`wasmJs`
</td>
<td>
如果您計劃在 JavaScript 運行時環境中運行您的專案，請使用它。
</td>
</tr>
<tr>
<td>
`wasmWasi`
</td>
<td>
如果您需要支援 <a href="https://github.com/WebAssembly/WASI">WASI</a> 系統介面，請使用它。
</td>
</tr>
<tr>
<td>
Kotlin/JS
</td>
<td>
`js`
</td>
<td>

<p>
   選擇執行環境：
</p>
<list>
<li>`browser {}` 用於在瀏覽器中運行的應用程式。</li>
<li>`nodejs {}` 用於在 Node.js 上運行的應用程式。</li>
</list>
<p>
   在 <a href="js-project-setup#execution-environments">設定 Kotlin/JS 專案</a> 中瞭解更多資訊。
</p>
</td>
</tr>
<tr>
<td>
Kotlin/Native
</td>
<td>
</td>
<td>

<p>
   在 <a href="native-target-support">Kotlin/Native 目標 (target) 支援</a> 中瞭解目前 macOS、Linux 和 Windows 主機支援的目標 (target)。
</p>
</td>
</tr>
<tr>
<td>
Android 應用程式和函式庫
</td>
<td>
`androidTarget`
</td>
<td>

<p>
   手動應用 Android Gradle 外掛程式：`com.android.application` 或 `com.android.library`。
</p>
<p>
   每個 Gradle 子專案只能建立一個 Android 目標 (target)。
</p>
</td>
</tr>
</table>
:::note
建置期間會忽略目前主機不支援的目標 (target)，因此不會發佈。

:::

```groovy
kotlin {
    jvm()
    iosArm64()
    macosX64()
    js().browser()
}
```

目標 (target) 的配置可以包括兩個部分：

* [所有目標 (target) 均可使用的通用配置](#common-target-configuration)。
* 目標 (target) 特定配置。

每個目標 (target) 可以有一個或多個 [編譯 (compilations)](#compilations)。

### 通用目標配置 (Common target configuration)

在任何目標 (target) 區塊中，您可以使用以下宣告：

| **名稱 (Name)**            | **描述 (Description)**                                                                                                                                                                            | 
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | 此目標 (target) 的 Kotlin 平台。可用值：`jvm`、`androidJvm`、`js`、`wasm`、`native`、`common`。                                                                              |
| `artifactsTaskName` | 建置此目標 (target) 的結果成品 (artifacts) 的任務名稱。                                                                                                                   |
| `components`        | 用於設定 Gradle 發佈的元件 (components)。                                                                                                                                             |
| `compilerOptions`   | 用於目標 (target) 的 [編譯器選項 (Compiler options)](#compiler-options)。此宣告會覆蓋在 [頂層](multiplatform-dsl-reference#top-level-blocks) 配置的任何 `compilerOptions {}`。 |

### Web 目標 (targets)

`js {}` 區塊描述 Kotlin/JS 目標 (target) 的配置，而 `wasmJs {}` 區塊描述可與 JavaScript 互操作的 Kotlin/Wasm 目標 (target) 的配置。它們可以包含兩個區塊之一，具體取決於目標 (target) 執行
環境：

| **名稱 (Name)**              | **描述 (Description)**                      | 
|-----------------------|--------------------------------------|
| [`browser`](#browser) | 瀏覽器目標 (target) 的配置。 |
| [`nodejs`](#node-js)  | Node.js 目標 (target) 的配置。 |

瞭解更多關於 [配置 Kotlin/JS 專案](js-project-setup) 的資訊。

單獨的 `wasmWasi {}` 區塊描述了支援 WASI 系統介面的 Kotlin/Wasm 目標 (target) 的配置。
在此，只有 [`nodejs`](#node-js) 執行環境可用：

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

所有 Web 目標 (target) `js`、`wasmJs` 和 `wasmWasi` 也支援 `binaries.executable()` 呼叫。它明確指示 Kotlin 編譯器發出可執行檔。有關更多資訊，請參閱 Kotlin/JS 文件中的 [執行環境](js-project-setup#execution-environments)。

#### 瀏覽器 (Browser)

`browser {}` 可以包含以下配置區塊：

| **名稱 (Name)**       | **描述 (Description)**                                                         | 
|----------------|-------------------------------------------------------------------------|
| `testRuns`     | 測試執行的配置。                                        |
| `runTask`      | 專案運行的配置。                                       |
| `webpackTask`  | 使用 [Webpack](https://webpack.js.org/) 進行專案打包的配置。 |
| `distribution` | 輸出檔案的路徑。                                                   |

```kotlin
kotlin {
    js().browser {
        webpackTask { /* ... */ }
        testRuns { /* ... */ }
        distribution {
            directory = File("$projectDir/customdir/")
        }
    }
}
```

#### Node.js

`nodejs {}` 可以包含測試和運行任務的配置：

| **名稱 (Name)**   | **描述 (Description)**                   | 
|------------|-----------------------------------|
| `testRuns` | 測試執行的配置。  |
| `runTask`  | 專案運行的配置。 |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### Native 目標 (targets)

對於 native 目標 (targets)，可以使用以下特定區塊：

| **名稱 (Name)**    | **描述 (Description)**                                          | 
|-------------|----------------------------------------------------------|
| `binaries`  | 要產生的 [二進制檔 (binaries)](#binaries) 的配置。       |
| `cinterops` | [與 C 函式庫互操作 (interop with C libraries)](#cinterops) 的配置。 |

#### 二進制檔 (Binaries)

有以下幾種二進制檔 (binaries)：

| **名稱 (Name)**     | **描述 (Description)**        | 
|--------------|------------------------|
| `executable` | 產品可執行檔。    |
| `test`       | 測試可執行檔。       |
| `sharedLib`  | 共享函式庫。        |
| `staticLib`  | 靜態函式庫。        |
| `framework`  | Objective-C 框架。 |

```kotlin
kotlin {
    linuxX64 { // 使用您的目標 (target) 代替。
        binaries {
            executable {
                // 二進制檔 (binary) 配置。
            }
        }
    }
}
```

對於二進制檔 (binary) 配置，可以使用以下參數：

| **名稱 (Name)**      | **描述 (Description)**                                                                                                                                                   | 
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | 從中建置二進制檔 (binary) 的編譯 (compilation)。預設情況下，`test` 二進制檔 (binaries) 基於 `test` 編譯 (compilation)，而其他二進制檔 (binaries) 基於 `main` 編譯 (compilation)。 |
| `linkerOpts`  | 在二進制檔 (binary) 建置期間傳遞給系統連結器的選項。                                                                                                         |
| `baseName`    | 輸出檔案的自定義基本名稱。最終檔案名稱將通過將系統相關的前綴和後綴新增到此基本名稱來形成。                         |
| `entryPoint`  | 可執行二進制檔 (binaries) 的進入點函式。預設情況下，它是根套件 (root package) 中的 `main()`。                                                                  |
| `outputFile`  | 存取輸出檔案。                                                                                                                                        |
| `linkTask`    | 存取連結任務。                                                                                                                                          |
| `runTask`     | 存取可執行二進制檔 (binaries) 的運行任務。對於 `linuxX64`、`macosX64` 或 `mingwX64` 以外的目標 (targets)，該值為 `null`。                                 |
| `isStatic`    | 用於 Objective-C 框架。包含靜態函式庫而不是動態函式庫。                                                                                   |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // 在測試編譯 (compilation) 的基礎上建置二進制檔 (binary)。
        compilation = compilations["test"]

        // 用於連結器的自定義命令行選項。
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 輸出檔案的基本名稱。
        baseName = "foo"

        // 自定義進入點函式。
        entryPoint = "org.example.main"

        // 存取輸出檔案。
        println("Executable path: ${outputFile.absolutePath}")

        // 存取連結任務。
        linkTask.dependsOn(additionalPreprocessingTask)

        // 存取運行任務。
        // 請注意，對於非主機平台，runTask 為空 (null)。
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // 將靜態函式庫（而不是動態函式庫）包含到框架中。
        isStatic = true
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // 在測試編譯 (compilation) 的基礎上建置二進制檔 (binary)。
        compilation = compilations.test

        // 用於連結器的自定義命令行選項。
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 輸出檔案的基本名稱。
        baseName = 'foo'

        // 自定義進入點函式。
        entryPoint = 'org.example.main'

        // 存取輸出檔案。
        println("Executable path: ${outputFile.absolutePath}")

        // 存取連結任務。
        linkTask.dependsOn(additionalPreprocessingTask)

        // 存取運行任務。
        // 請注意，對於非主機平台，runTask 為空 (null)。
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework' [RELEASE]) {
        // 將靜態函式庫（而不是動態函式庫）包含到框架中。
        isStatic = true
    }
}
```

</TabItem>
</Tabs>

瞭解更多關於 [建置 native 二進制檔 (binaries)](multiplatform-build-native-binaries) 的資訊。

#### CInterops

`cinterops` 是與 native 函式庫互操作的描述集合。
要提供與函式庫的互操作性，請向 `cinterops` 新增一個條目並定義其參數：

| **名稱 (Name)**         | **描述 (Description)**                                       | 
|------------------|-------------------------------------------------------|
| `definitionFile` | 描述 native API 的 `.def` 檔案。            |
| `packageName`    | 為產生的 Kotlin API 新增套件 (package) 前綴。          |
| `compilerOpts`   | 要通過 cinterop 工具傳遞給編譯器的選項。 |
| `includeDirs`    | 要尋找標頭的目錄。                      |
| `header`         | 要包含在綁定中的標頭。                |
| `headers`        | 要包含在綁定中的標頭清單。   |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    linuxX64 { // 替換為您需要的目標 (target)。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述 native API 的 Def 檔案。
                // 預設路徑為 src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))

                // 放置產生的 Kotlin API 的套件 (package)。
                packageName("org.sample")

                // 要通過 cinterop 工具傳遞給編譯器的選項。
                compilerOpts("-Ipath/to/headers")

                // 用於標頭搜尋的目錄（類似於 -I<path> 編譯器選項）。
                includeDirs.allHeaders("path1", "path2")

                // includeDirs.allHeaders 的快捷方式。
                includeDirs("include/directory", "another/directory")

                // 要包含在綁定中的標頭檔案。
                header("path/to/header.h")
                headers("path/to/header1.h", "path/to/header2.h")
            }

            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    linuxX64 { // 替換為您需要的目標 (target)。
        compilations.main {
            cinterops {
                myInterop {
                    // 描述 native API 的 Def 檔案。
                    // 預設路徑為 src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")

                    // 放置產生的 Kotlin API 的套件 (package)。
                    packageName 'org.sample'

                    // 要通過 cinterop 工具傳遞給編譯器的選項。
                    compilerOpts '-Ipath/to/headers'

                    // 用於標頭搜尋的目錄（類似於 -I<path> 編譯器選項）。
                    includeDirs.allHeaders("path1", "path2")

                    // includeDirs.allHeaders 的快捷方式。
                    includeDirs("include/directory", "another/directory")

                    // 要包含在綁定中的標頭檔案。
                    header("path/to/header.h")
                    headers("path/to/header1.h", "path/to/header2.h")
                }

                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</TabItem>
</Tabs>

有關更多 cinterop 屬性，請參閱 [定義檔案](native-definition-file#properties)。

### Android 目標 (targets)

Kotlin Multiplatform 外掛程式包含兩個用於 Android 目標 (targets) 的特定函數。
兩個函數可幫助您配置 [建置變體 (build variants)](https://developer.android.com/studio/build/build-variants)：

| **名稱 (Name)**                      | **描述 (Description)**                                                                                                                                | 
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 指定要發佈的建置變體 (build variants)。瞭解更多關於 [發佈 Android 函式庫](multiplatform-publish-lib#publish-an-android-library) 的資訊。 |
| `publishAllLibraryVariants()` | 發佈所有建置變體 (build variants)。                                                                                                                  |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

瞭解更多關於 [Android 編譯 (compilation)](multiplatform-configure-compilations#compilation-for-android) 的資訊。

:::note
`kotlin {}` 區塊內的 `androidTarget` 配置不會替換任何 Android 專案的建置配置。
在 [Android 開發人員文件](https://developer.android.com/studio/build) 中瞭解更多關於為 Android 專案編寫建置腳本的資訊。

:::

## 源集 (Source sets)

`sourceSets {}` 區塊描述專案的源集 (source sets)。源集 (source set) 包含一起參與編譯 (compilations) 的 Kotlin 源檔案，以及它們的資源、依賴關係和語言設定。

多平台專案包含其目標 (targets) 的 [預定義](#predefined-source-sets) 源集 (source sets)；
開發人員還可以根據自己的需要建立 [自定義](#custom-source-sets) 源集 (source sets)。

### 預定義源集 (Predefined source sets)

預定義源集 (predefined source sets) 在建立多平台專案時自動設定。
可用的預定義源集 (predefined source sets) 如下：

| **名稱 (Name)**                                    | **描述 (Description)**                                                                                                                                                                                               | 
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | 在所有平台之間共享的程式碼和資源。在所有多平台專案中可用。用於專案的所有主要 [編譯 (compilations)](#compilations) 中。                                                        |
| `commonTest`                                | 在所有平台之間共享的測試程式碼和資源。在所有多平台專案中可用。用於專案的所有測試編譯 (compilations) 中。                                                                    |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | 編譯 (compilation) 的目標 (target) 特定來源。_&lt;targetName&gt;_ 是預定義目標 (target) 的名稱，_&lt;compilationName&gt;_ 是此目標 (target) 的編譯 (compilation) 名稱。範例：`jsTest`、`jvmMain`。 |

使用 Kotlin Gradle DSL，預定義源集 (predefined source sets) 的區段應標記為 `by getting`。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting { /* ... */ }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
    sourceSets { 
        commonMain { /* ... */ } 
    }
}
```

</TabItem>
</Tabs>

瞭解更多關於 [源集 (source sets)](multiplatform-discover-project#source-sets) 的資訊。

### 自定義源集 (Custom source sets)

自定義源集 (custom source sets) 由專案開發人員手動建立。
要建立自定義源集 (custom source set)，請在 `sourceSets` 區段內新增一個具有其名稱的區段。
如果使用 Kotlin Gradle DSL，請將自定義源集 (custom source sets) 標記為 `by creating`。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin { 
    sourceSets { 
        val myMain by creating { /* ... */ } // 建立一個名為“MyMain”的新源集 (source set)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
    sourceSets { 
        myMain { /* ... */ } // 建立或配置一個名為“myMain”的源集 (source set)
    }
}
```

</TabItem>
</Tabs>

請注意，新建立的源集 (source set) 未連接到其他源集 (source sets)。要在專案的編譯 (compilations) 中使用它，
[將其與其他源集 (source sets) 連接](multiplatform-hierarchy#manual-configuration)。

### 源集 (Source set) 參數

源集 (source sets) 的配置儲存在 `sourceSets {}` 的相應區塊內。源集 (source set) 具有以下參數：

| **名稱 (Name)**           | **描述 (Description)**                                                                        | 
|--------------------|----------------------------------------------------------------------------------------|
| `kotlin.srcDir`    | 源集 (source set) 目錄中 Kotlin 源檔案的位置。                       |
| `resources.srcDir` | 源集 (source set) 目錄中資源的位置。                                 |
| `dependsOn`        | [與另一個源集 (source set) 的連接](multiplatform-hierarchy#manual-configuration)。 |
| `dependencies`     | 源集 (source set) 的 [依賴關係](#dependencies)。                                       |
| `languageSettings` | 應用於源集 (source set) 的 [語言設定](#language-settings)。                     |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin { 
    sourceSets { 
        val commonMain by getting {
            kotlin.srcDir("src")
            resources.srcDir("res")

            dependencies {
                /* ... */
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
    sourceSets { 
        commonMain {
            kotlin.srcDir('src')
            resources.srcDir('res')

            dependencies {
                /* ... */
            }
        }
    }
}
``` 

</TabItem>
</Tabs>

## 編譯 (Compilations)

目標 (target) 可以有一個或多個編譯 (compilations)，例如，用於生產或測試。有 [預定義的編譯 (predefined compilations)](#predefined-compilations)
在建立目標 (target) 時會自動新增。您可以另外建立 [自定義編譯 (custom compilations)](#custom-compilations)。

要引用目標 (target) 的所有或某些特定編譯 (compilations)，請使用 `compilations` 物件集合。
從 `compilations`，您可以通過其名稱引用編譯 (compilation)。

瞭解更多關於 [配置編譯 (compilations)](multiplatform-configure-compilations) 的資訊。

### 預定義的編譯 (Predefined compilations)

為專案的每個目標 (target) 自動建立預定義的編譯 (predefined compilations)，Android 目標 (targets) 除外。
可用的預定義的編譯 (predefined compilations) 如下：

| **名稱 (Name)** | **描述 (Description)**                     | 
|----------|-------------------------------------|
| `main`   | 用於生產來源的編譯 (compilation)。 |
| `test`   | 用於測試的編譯 (compilation)。              |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // 取得主要編譯 (compilation) 輸出
        }

        compilations["test"].runtimeDependencyFiles // 取得測試運行時類別路徑
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm {
        compilations.main.output // 取得主要編譯 (compilation) 輸出
        compilations.test.runtimeDependencyFiles // 取得測試運行時類別路徑
    }
}
```

</TabItem>
</Tabs>

### 自定義編譯 (Custom compilations)

除了預定義的編譯 (predefined compilations) 之外，您還可以建立自己的自定義編譯 (custom compilations)。
要建立自定義編譯 (custom compilation)，請在 `compilations` 集合中新增一個新項目。
如果使用 Kotlin Gradle DSL，請將自定義編譯 (custom compilations) 標記為 `by creating`。

瞭解更多關於建立 [自定義編譯 (custom compilation)](multiplatform-configure-compilations#create-a-custom-compilation) 的資訊。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm() {
        compilations {
            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        /* ... */
                    }
                }

                // 建立一個測試任務來運行此編譯 (compilation) 產生的測試：
                tasks.register<Test>("integrationTest") {
                    /* ... */
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    /* ... */
                }
            }

            // 建立一個測試任務來運行此編譯 (compilation) 產生的測試：
            tasks.register('jvmIntegrationTest', Test) {
                /* ... */
            }
        }
    }
}
```

</TabItem>
</Tabs>

### 編譯 (Compilation) 參數

編譯 (compilation) 具有以下參數：

| **名稱 (Name)**                 | **描述 (Description)**                                                                                                                                                           | 
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | 編譯 (compilation) 的預設源集 (default source set)。                                                                                                                                     |
| `kotlinSourceSets`       | 參與編譯 (compilation) 的源集 (source sets)。                                                                                                                             |
| `allKotlinSourceSets`    | 參與編譯 (compilation) 的源集 (source sets) 及其通過 `dependsOn()` 的連接。                                                                                     |
| `compilerOptions`        | 應用於編譯 (compilation) 的編譯器選項 (compiler options)。有關可用選項的清單，請參閱 [編譯器選項 (Compiler options)](gradle-compiler-options)。                                       |
| `compileKotlinTask`      | 用於編譯 Kotlin 來源的 Gradle 任務。                                                                                                                                 |
| `compileKotlinTaskName`  | `compileKotlinTask` 的名稱。                                                                                                                                              |
| `compileAllTaskName`     | 用於編譯編譯 (compilation) 的所有來源的 Gradle 任務的名稱。                                                                                                       |
| `output`                 | 編譯 (compilation) 輸出。                                                                                                                                                   |
| `compileDependencyFiles` | 編譯 (compilation) 的編譯時依賴檔案 (classpath)。對於所有 Kotlin/Native 編譯 (compilations)，這會自動包含標準函式庫和平台依賴關係。 |
| `runtimeDependencyFiles` | 編譯 (compilation) 的運行時依賴檔案 (classpath)。                                                                                                                  |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 設定“main”編譯 (compilation) 的 Kotlin 編譯器選項：
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        
            compileKotlinTask // 取得 Kotlin 任務“compileKotlinJvm” 
            output // 取得主要編譯 (compilation) 輸出
        }
        
        compilations["test"].runtimeDependencyFiles // 取得測試運行時類別路徑
    }

    // 配置所有目標 (targets) 的所有編譯 (compilations)：
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    // 設定“main”編譯 (compilation) 的 Kotlin 編譯器選項：
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // 取得 Kotlin 任務“compileKotlinJvm” 
        compilations.main.output // 取得主要編譯 (compilation) 輸出
        compilations.test.runtimeDependencyFiles // 取得測試運行時類別路徑
    }

    // 配置所有目標 (targets) 的所有編譯 (compilations)：
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 編譯器選項 (Compiler options)

您可以在專案中的三個不同層級配置編譯器選項 (compiler options)：

* **擴展層級 (Extension level)**，在 `kotlin {}` 區塊中。
* **目標 (Target) 層級**，在目標 (target) 區塊中。
* **編譯單元層級 (Compilation unit level)**，通常在特定的編譯任務中。

<img src="/img/compiler-options-levels.svg" alt="Kotlin 編譯器選項層級 (compiler options levels)" width="700" style={{verticalAlign: 'middle'}}/>

較高層級的設定充當較低層級的預設值：

* 在擴展層級 (extension level) 設定的編譯器選項 (compiler options) 是目標 (target) 層級選項的預設值，包括共享源集 (shared source sets)，例如 `commonMain`、`nativeMain` 和 `commonTest`。
* 在目標 (target) 層級設定的編譯器選項 (compiler options) 是編譯單元（任務）層級選項的預設值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任務。

在較低層級進行的配置會覆蓋較高層級的類似設定：

* 任務層級 (Task-level) 編譯器選項 (compiler options) 覆蓋目標 (target) 或擴展層級 (extension level) 的類似設定。
* 目標 (Target) 層級編譯器選項 (compiler options) 覆蓋擴展層級 (extension level) 的類似設定。

有關可能的編譯器選項 (compiler options) 清單，請參閱 [所有編譯器選項 (All compiler options)](gradle-compiler-options#all-compiler-options)。

### 擴展層級 (Extension level)

要為專案中的所有目標 (targets) 配置編譯器選項 (compiler options)，請在頂層使用 `compilerOptions {}` 區塊：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    // 配置所有目標 (targets) 的所有編譯 (compilations)
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    // 配置所有目標 (targets) 的所有編譯 (compilations)：
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

### 目標 (Target) 層級

要為專案中的特定目標 (target) 配置編譯器選項 (compiler options)，請在目標 (target) 區塊內使用 `compilerOptions {}` 區塊：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        // 配置 JVM 目標 (target) 的所有編譯 (
```
</TabItem>
</Tabs>