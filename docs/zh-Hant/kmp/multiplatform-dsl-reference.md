[//]: # (title: 多平台 Gradle DSL 參考)

Kotlin 多平台 Gradle 外掛程式是建立 Kotlin 多平台專案的工具。
在此提供其內容參考；您可以在撰寫 Kotlin 多平台專案的 Gradle 建置指令碼時，將其作為提示使用。深入了解 [Kotlin 多平台專案的概念，以及如何建立和配置它們](multiplatform-discover-project.md)。

## ID 與版本

Kotlin 多平台 Gradle 外掛程式的完全限定名稱為 `org.jetbrains.kotlin.multiplatform`。
如果您使用 Kotlin Gradle DSL，可以使用 `kotlin("multiplatform")` 來套用此外掛程式。
此外掛程式版本與 Kotlin 發行版本相符。最新版本為 %kotlinVersion%。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</TabItem>
</Tabs>

## 頂層區塊

`kotlin {}` 是 Gradle 建置指令碼中用於多平台專案配置的頂層區塊。
在 `kotlin {}` 內部，您可以撰寫以下區塊：

| **區塊**             | **描述**                                                                                                                               |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | 宣告專案的特定目標。可用目標的名稱列於「[目標](#targets)」區段中。                                                                       |
| `targets`            | 列出專案的所有目標。                                                                                                                   |
| `sourceSets`         | 設定預定義並宣告專案的自訂[原始碼集](#source-sets)。                                                                                 |
| `compilerOptions`    | 指定共同的擴充層級[編譯器選項](#compiler-options)，這些選項將作為所有目標和共享原始碼集的預設值。 |
| `dependencies`       | 配置[共同依賴項](#configure-dependencies-at-the-top-level)。(實驗性)                                                              |

## 目標

_目標_ 是建置的一部分，負責編譯、測試和打包針對其中一個支援平台的軟體。Kotlin 為每個平台提供目標，因此您可以指示 Kotlin 為該特定目標編譯程式碼。深入了解[設定目標](multiplatform-discover-project.md#targets)。

每個目標可以有一個或多個[編譯](#compilations)。除了用於測試和生產目的的預設編譯之外，您還可以[建立自訂編譯](multiplatform-configure-compilations.md#create-a-custom-compilation)。

多平台專案的目標在 `kotlin {}` 內部對應的區塊中描述，例如 `jvm`、`androidTarget`、`iosArm64`。
可用目標的完整列表如下：

<table>
    
<tr>
<th>目標平台</th>
        <th>目標</th>
        <th>備註</th>
</tr>

    
<tr>
<td>Kotlin/JVM</td>
        <td><code>jvm</code></td>
        <td></td>
</tr>

    
<tr>
<td rowspan="2">Kotlin/Wasm</td>
        <td><code>wasmJs</code></td>
        <td>如果您計畫在 JavaScript 執行時環境中執行專案，請使用此項。</td>
</tr>

    
<tr>
<td><code>wasmWasi</code></td>
        <td>如果您需要支援 <a href="https://github.com/WebAssembly/WASI">WASI</a> 系統介面，請使用此項。</td>
</tr>

    
<tr>
<td>Kotlin/JS</td>
        <td><code>js</code></td>
        <td>
            <p>選擇執行環境：</p>
            <list>
                <li><code>browser {}</code> 用於在瀏覽器中執行的應用程式。</li>
                <li><code>nodejs {}</code> 用於在 Node.js 上執行的應用程式。</li>
            </list>
            <p>在<a href="https://kotlinlang.org/docs/js-project-setup.html#execution-environments">設定 Kotlin/JS 專案</a>中了解更多資訊。</p>
        </td>
</tr>

    
<tr>
<td>Kotlin/Native</td>
        <td></td>
        <td>
            <p>在<a href="https://kotlinlang.org/docs/native-target-support.html">Kotlin/Native 目標支援</a>中了解 macOS、Linux 和 Windows 主機目前支援的目標。</p>
        </td>
</tr>

    
<tr>
<td>Android 應用程式與函式庫</td>
        <td><code>androidTarget</code></td>
        <td>
            <p>手動套用 Android Gradle 外掛程式：<code>com.android.application</code> 或 <code>com.android.library</code>。</p>
            <p>每個 Gradle 子專案只能建立一個 Android 目標。</p>
        </td>
</tr>

</table>

> 建置期間，不支援目前主機的目標將被忽略，因此不會發佈。
>
{style="note"}

```groovy
kotlin {
    jvm()
    iosArm64()
    macosX64()
    js().browser()
}
```

目標的配置可以包含兩部分：

*   適用於所有目標的[共同配置](#common-target-configuration)。
*   目標特定配置。

每個目標可以有一個或多個[編譯](#compilations)。

### 共同目標配置

在任何目標區塊中，您可以使用以下宣告：

| **名稱**            | **描述**                                                                                                                                                                       |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | 此目標的 Kotlin 平台。可用值：`jvm`、`androidJvm`、`js`、`wasm`、`native`、`common`。                                                                    |
| `artifactsTaskName` | 建置此目標結果產物的任務名稱。                                                                                                                                             |
| `components`        | 用於設定 Gradle 發佈的元件。                                                                                                                                               |
| `compilerOptions`   | 用於目標的[編譯器選項](#compiler-options)。此宣告會覆寫在[頂層](multiplatform-dsl-reference.md#top-level-blocks)配置的任何 `compilerOptions {}`。 |

### Web 目標

`js {}` 區塊描述 Kotlin/JS 目標的配置，而 `wasmJs {}` 區塊描述可與 JavaScript 互通的 Kotlin/Wasm 目標的配置。它們可以根據目標執行環境包含以下兩個區塊之一：

| **名稱**              | **描述**                   |
|-----------------------|----------------------------|
| [`browser`](#browser) | 瀏覽器目標的配置。       |
| [`nodejs`](#node-js)  | Node.js 目標的配置。       |

深入了解[配置 Kotlin/JS 專案](https://kotlinlang.org/docs/js-project-setup.html)。

獨立的 `wasmWasi {}` 區塊描述支援 WASI 系統介面的 Kotlin/Wasm 目標的配置。
在這裡，只有 [`nodejs`](#node-js) 執行環境可用：

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

所有 web 目標，`js`、`wasmJs` 和 `wasmWasi`，也支援 `binaries.executable()` 呼叫。它明確地指示 Kotlin 編譯器發出可執行檔。如需更多資訊，請參閱 Kotlin/JS 文件中的[執行環境](https://kotlinlang.org/docs/js-project-setup.html#execution-environments)。

#### 瀏覽器

`browser {}` 可以包含以下配置區塊：

| **名稱**       | **描述**                                                   |
|----------------|------------------------------------------------------------|
| `testRuns`     | 測試執行的配置。                                           |
| `runTask`      | 專案執行的配置。                                           |
| `webpackTask`  | 使用 [Webpack](https://webpack.js.org/) 捆綁專案的配置。 |
| `distribution` | 輸出檔案的路徑。                                           |

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

`nodejs {}` 可以包含測試和執行任務的配置：

| **名稱**   | **描述**                 |
|------------|--------------------------|
| `testRuns` | 測試執行的配置。         |
| `runTask`  | 專案執行的配置。         |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### 原生目標

對於原生目標，提供以下特定區塊：

| **名稱**    | **描述**                                       |
|-------------|------------------------------------------------|
| `binaries`  | 要產生的[二進位檔](#binaries)配置。             |
| `cinterops` | 與 [C 函式庫互通](#cinterops)的配置。           |

#### 二進位檔

二進位檔有以下幾種：

| **名稱**     | **描述**         |
|--------------|------------------|
| `executable` | 產品可執行檔。   |
| `test`       | 測試可執行檔。   |
| `sharedLib`  | 共享函式庫。     |
| `staticLib`  | 靜態函式庫。     |
| `framework`  | Objective-C 框架。 |

```kotlin
kotlin {
    linuxX64 { // 請改用您的目標。
        binaries {
            executable {
                // Binary configuration.
            }
        }
    }
}
```

對於二進位檔配置，以下參數可用：

| **名稱**      | **描述**                                                                                                                                                                                             |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | 建置二進位檔的編譯。預設情況下，`test` 二進位檔基於 `test` 編譯，而其他二進位檔則基於 `main` 編譯。                                                             |
| `linkerOpts`  | 在二進位檔建置期間傳遞給系統連結器的選項。                                                                                                                                                           |
| `baseName`    | 輸出檔案的自訂基本名稱。最終檔案名稱將透過向此基本名稱添加與系統相關的前綴和後綴來形成。                                                                                                   |
| `entryPoint`  | 可執行二進位檔的進入點函數。預設為根套件中的 `main()`。                                                                                                                                            |
| `outputFile`  | 存取輸出檔案。                                                                                                                                                                                       |
| `linkTask`    | 存取連結任務。                                                                                                                                                                                       |
| `runTask`     | 存取可執行二進位檔的執行任務。對於 `linuxX64`、`macosX64` 或 `mingwX64` 以外的目標，其值為 `null`。                                                                                |
| `isStatic`    | 適用於 Objective-C 框架。包含靜態函式庫而非動態函式庫。                                                                                                                                             |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // Build a binary on the basis of the test compilation.
        compilation = compilations["test"]

        // Custom command line options for the linker.
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // Base name for the output file.
        baseName = "foo"

        // Custom entry point function.
        entryPoint = "org.example.main"

        // Accessing the output file.
        println("Executable path: ${outputFile.absolutePath}")

        // Accessing the link task.
        linkTask.dependsOn(additionalPreprocessingTask)

        // Accessing the run task.
        // Note that the runTask is null for non-host platforms.
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // Include a static library instead of a dynamic one into the framework.
        isStatic = true
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // Build a binary on the basis of the test compilation.
        compilation = compilations.test

        // Custom command line options for the linker.
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // Base name for the output file.
        baseName = 'foo'

        // Custom entry point function.
        entryPoint = 'org.example.main'

        // Accessing the output file.
        println("Executable path: ${outputFile.absolutePath}")

        // Accessing the link task.
        linkTask.dependsOn(additionalPreprocessingTask)

        // Accessing the run task.
        // Note that the runTask is null for non-host platforms.
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework' [RELEASE]) {
        // Include a static library instead of a dynamic one into the framework.
        isStatic = true
    }
}
```

</TabItem>
</Tabs>

深入了解[建置原生二進位檔](multiplatform-build-native-binaries.md)。

#### C 互通

`cinterops` 是與原生函式庫互通的描述集合。
要提供與函式庫的互通，請將一個條目添加到 `cinterops` 並定義其參數：

| **名稱**         | **描述**                                           |
|------------------|----------------------------------------------------|
| `definitionFile` | 描述原生 API 的 `.def` 檔案。                      |
| `packageName`    | 生成的 Kotlin API 的套件前綴。                     |
| `compilerOpts`   | cinterop 工具要傳遞給編譯器的選項。                |
| `includeDirs`    | 尋找標頭的目錄。                                   |
| `header`         | 要包含在綁定中的標頭。                             |
| `headers`        | 要包含在綁定中的標頭列表。                         |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Definition file describing the native API.
                // The default path is src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))

                // Package to place the Kotlin API generated.
                packageName("org.sample")

                // Options to be passed to compiler by cinterop tool.
                compilerOpts("-Ipath/to/headers")

                // Directories for header search (an analogue of the -I<path> compiler option).
                includeDirs.allHeaders("path1", "path2")

                // A shortcut for includeDirs.allHeaders.
                includeDirs("include/directory", "another/directory")

                // Header files to be included in the bindings.
                header("path/to/header.h")
                headers("path/to/header1.h", "path/to/header2.h")
            }

            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.main {
            cinterops {
                myInterop {
                    // Definition file describing the native API.
                    // The default path is src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")

                    // Package to place the Kotlin API generated.
                    packageName 'org.sample'

                    // Options to be passed to compiler by cinterop tool.
                    compilerOpts '-Ipath/to/headers'

                    // Directories for header search (an analogue of the -I<path> compiler option).
                    includeDirs.allHeaders("path1", "path2")

                    // A shortcut for includeDirs.allHeaders.
                    includeDirs("include/directory", "another/directory")

                    // Header files to be included in the bindings.
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

如需更多 cinterop 屬性，請參閱[定義檔](https://kotlinlang.org/docs/native-definition-file.html#properties)。

### Android 目標

Kotlin 多平台外掛程式具有特定功能，可協助您為 Android 目標配置[建置變體](https://developer.android.com/studio/build/build-variants)：

| **名稱**                   | **描述**                                                                                                                       |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()` | 指定要發佈的建置變體。深入了解[發佈 Android 函式庫](multiplatform-publish-lib-setup.md#publish-an-android-library)。 |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

深入了解[Android 的編譯](multiplatform-configure-compilations.md#compilation-for-android)。

> `kotlin {}` 區塊內的 `androidTarget` 配置不會取代任何 Android 專案的建置配置。
> 深入了解在 [Android 開發者文件](https://developer.android.com/studio/build)中撰寫 Android 專案的建置指令碼。
>
{style="note"}

## 原始碼集

`sourceSets {}` 區塊描述專案的原始碼集。原始碼集包含一同參與編譯的 Kotlin 原始碼檔案，以及它們的資源和依賴項。

多平台專案包含其目標的[預定義原始碼集](#predefined-source-sets)；開發人員也可以根據需要建立[自訂原始碼集](#custom-source-sets)。

### 預定義原始碼集

預定義原始碼集在建立多平台專案時自動設定。
可用的預定義原始碼集如下：

| **名稱**                                    | **描述**                                                                                                                                                                                                                                 |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | 在所有平台之間共享的程式碼和資源。在所有多平台專案中可用。用於專案的所有主要[編譯](#compilations)。                                                                           |
| `commonTest`                                | 在所有平台之間共享的測試程式碼和資源。在所有多平台專案中可用。用於專案的所有測試編譯。                                                                                     |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | 目標特定原始碼用於編譯。_&lt;targetName&gt;_ 是預定義目標的名稱，_&lt;compilationName&gt;_ 是此目標編譯的名稱。範例：`jsTest`、`jvmMain`。 |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets { 
        commonMain { /* ... */ }
    }
}
```

</TabItem>
</Tabs>

深入了解[原始碼集](multiplatform-discover-project.md#source-sets)。

### 自訂原始碼集

自訂原始碼集由專案開發人員手動建立。
要建立自訂原始碼集，請在 `sourceSets` 區段內添加一個帶有其名稱的區段。
如果使用 Kotlin Gradle DSL，請將自訂原始碼集標記為 `by creating`。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets { 
        val myMain by creating { /* ... */ } // create a new source set by the name 'MyMain'
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets { 
        myMain { /* ... */ } // create or configure a source set by the name 'myMain' 
    }
}
```

</TabItem>
</Tabs>

請注意，新建立的原始碼集未與其他原始碼集連接。要在專案的編譯中使用它，請[將其與其他原始碼集連接](multiplatform-hierarchy.md#manual-configuration)。

### 原始碼集參數

原始碼集的配置儲存在 `sourceSets {}` 對應的區塊中。原始碼集具有以下參數：

| **名稱**           | **描述**                                                                       |
|--------------------|--------------------------------------------------------------------------------|
| `kotlin.srcDir`    | 原始碼集目錄中 Kotlin 原始碼檔案的位置。                                       |
| `resources.srcDir` | 原始碼集目錄中資源的位置。                                                     |
| `dependsOn`        | [與另一個原始碼集的連接](multiplatform-hierarchy.md#manual-configuration)。 |
| `dependencies`     | 原始碼集的[依賴項](#dependencies)。                                            |
| `languageSettings` | 應用於共享原始碼集的[語言設定](#language-settings)。                         |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin { 
    //...
    sourceSets { 
        commonMain {
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
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin { 
    //...
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

## 編譯

一個目標可以有一個或多個編譯，例如，用於生產或測試。有[預定義的編譯](#predefined-compilations)在目標建立時自動添加。您還可以額外建立[自訂編譯](#custom-compilations)。

要引用目標的所有或某些特定編譯，請使用 `compilations` 物件集合。
從 `compilations` 中，您可以按名稱引用編譯。

深入了解[配置編譯](multiplatform-configure-compilations.md)。

### 預定義編譯

預定義編譯會為專案的每個目標自動建立，Android 目標除外。
可用的預定義編譯如下：

| **名稱** | **描述**                     |
|----------|------------------------------|
| `main`   | 用於生產原始碼的編譯。       |
| `test`   | 用於測試的編譯。             |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // get the main compilation output
        }

        compilations["test"].runtimeDependencyFiles // get the test runtime classpath
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main.output // get the main compilation output
        compilations.test.runtimeDependencyFiles // get the test runtime classpath
    }
}
```

</TabItem>
</Tabs>

### 自訂編譯

除了預定義編譯之外，您還可以建立自己的自訂編譯。
為此，請在新的編譯和 `main` 編譯之間建立 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 關係。如果您使用 Kotlin Gradle DSL，請將自訂編譯標記為 `by creating`：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // Import main and its classpath as dependencies and establish internal visibility
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // Create a test task to run the tests produced by this compilation
                testRuns.create("integration") {
                    // Configure the test task
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // Import main and its classpath as dependencies and establish internal visibility
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // Create a test task to run the tests produced by this compilation
            testRuns.create('integration') {
                // Configure the test task
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</TabItem>
</Tabs>

透過關聯編譯，您可以將主要編譯輸出添加為依賴項，並在編譯之間建立 `internal` 可見性。

深入了解建立[自訂編譯](multiplatform-configure-compilations.md#create-a-custom-compilation)。

### 編譯參數

一個編譯具有以下參數：

| **名稱**                 | **描述**                                                                                                                                                                                      |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | 編譯的預設原始碼集。                                                                                                                                                                      |
| `kotlinSourceSets`       | 參與編譯的原始碼集。                                                                                                                                                                      |
| `allKotlinSourceSets`    | 參與編譯的原始碼集及其透過 `dependsOn()` 的連接。                                                                                                                                       |
| `compilerOptions`        | 應用於編譯的編譯器選項。有關可用選項的列表，請參閱[編譯器選項](https://kotlinlang.org/docs/gradle-compiler-options.html)。                                                             |
| `compileKotlinTask`      | 編譯 Kotlin 原始碼的 Gradle 任務。                                                                                                                                                        |
| `compileKotlinTaskName`  | `compileKotlinTask` 的名稱。                                                                                                                                                               |
| `compileAllTaskName`     | 編譯編譯所有原始碼的 Gradle 任務名稱。                                                                                                                                                    |
| `output`                 | 編譯輸出。                                                                                                                                                                                |
| `compileDependencyFiles` | 編譯的編譯時依賴檔案（classpath）。對於所有 Kotlin/Native 編譯，這會自動包含標準函式庫和平台依賴項。                                                                                     |
| `runtimeDependencyFiles` | 編譯的運行時依賴檔案（classpath）。                                                                                                                                                        |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // Set up the Kotlin compiler options for the 'main' compilation:
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        
            compileKotlinTask // get the Kotlin task 'compileKotlinJvm' 
            output // get the main compilation output
        }
        
        compilations["test"].runtimeDependencyFiles // get the test runtime classpath
    }

    // Configure all compilations of all targets:
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    // Setup the Kotlin compiler options for the 'main' compilation:
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // get the Kotlin task 'compileKotlinJvm' 
        compilations.main.output // get the main compilation output
        compilations.test.runtimeDependencyFiles // get the test runtime classpath
    }

    // Configure all compilations of all targets:
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 編譯器選項

您可以在專案中配置三個不同層級的編譯器選項：

*   **擴充層級**：在 `kotlin {}` 區塊中。
*   **目標層級**：在目標區塊中。
*   **編譯單元層級**：通常在特定的編譯任務中。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

較高層級的設定作為較低層級的預設值：

*   在擴充層級設定的編譯器選項是目標層級選項的預設值，包括 `commonMain`、`nativeMain` 和 `commonTest` 等共享原始碼集。
*   在目標層級設定的編譯器選項是編譯單元（任務）層級選項的預設值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任務。

較低層級的配置會覆寫較高層級的類似設定：

*   任務層級的編譯器選項會覆寫目標或擴充層級的類似設定。
*   目標層級的編譯器選項會覆寫擴充層級的類似設定。

有關可能的編譯器選項列表，請參閱[所有編譯器選項](https://kotlinlang.org/docs/gradle-compiler-options.html#all-compiler-options)。

### 擴充層級

要為專案中的所有目標配置編譯器選項，請在頂層使用 `compilerOptions {}` 區塊：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // Configures all compilations of all targets
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    // Configures all compilations of all targets:
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

### 目標層級

要為專案中的特定目標配置編譯器選項，請在目標區塊內使用 `compilerOptions {}` 區塊：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        // Configures all compilations of the JVM target
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        // Configures all compilations of the JVM target
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</TabItem>
</Tabs>

### 編譯單元層級

要為特定任務配置編譯器選項，請在任務內部使用 `compilerOptions {}` 區塊：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

要為特定編譯配置編譯器選項，請在編譯的任務提供者中，使用 `compilerOptions {}` 區塊：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // Configures the 'main' compilation:
                compilerOptions {
                    allWarningsAsErrors.set(true)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // Configures the 'main' compilation:
                compilerOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</TabItem>
</Tabs>

### 從 `kotlinOptions {}` 遷移到 `compilerOptions {}` {collapsible="true"}

在 Kotlin 2.2.0 之前，您可以使用 `kotlinOptions {}` 區塊配置編譯器選項。由於 `kotlinOptions {}`
區塊在 Kotlin 2.2.0 中已棄用，您需要在建置指令碼中使用 `compilerOptions {}` 區塊。
請參閱[從 `kotlinOptions{}` 遷移到 `compilerOptions{}`](https://kotlinlang.org/docs/gradle-compiler-options.html#migrate-from-kotlinoptions-to-compileroptions)，以獲取更多資訊。

## 依賴項

原始碼集宣告的 `dependencies {}` 區塊包含此原始碼集的依賴項。

深入了解[配置依賴項](https://kotlinlang.org/docs/gradle-configure-project.html)。

依賴項有四種類型：

| **名稱**         | **描述**                                                             |
|------------------|----------------------------------------------------------------------|
| `api`            | 在目前模組的 API 中使用的依賴項。                                  |
| `implementation` | 在模組中使用但未向外部公開的依賴項。                               |
| `compileOnly`    | 僅用於目前模組編譯的依賴項。                                       |
| `runtimeOnly`    | 在運行時可用但在任何模組編譯期間不可見的依賴項。                   |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                api("com.example:foo-metadata:1.0")
            }
        }
        jvmMain {
            dependencies {
                implementation("com.example:foo-jvm:1.0")
            }
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
        commonMain {
            dependencies {
                api 'com.example:foo-metadata:1.0'
            }
        }
        jvmMain {
            dependencies {
                implementation 'com.example:foo-jvm:1.0'
            }
        }
    }
}
```

</TabItem>
</Tabs>

此外，原始碼集可以相互依賴並形成層次結構。
在這種情況下，使用 [`dependsOn()`](#source-set-parameters) 關係。

### 在頂層配置依賴項
<primary-label ref="Experimental"/>

您可以使用頂層 `dependencies {}` 區塊配置共同依賴項。在此宣告的依賴項行為，如同它們已添加到 `commonMain` 或 `commonTest` 原始碼集一樣。

若要使用頂層 `dependencies {}` 區塊，請在區塊前添加 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 註解以選擇加入。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
    }
}
```

</TabItem>
</Tabs>

將平台特定的依賴項添加到對應目標的 `sourceSets {}` 區塊內。

您可以在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446) 中分享對此功能的意見回饋。

## 語言設定

原始碼集中的 `languageSettings {}` 區塊定義了專案分析和編譯的某些方面。僅當設定專門適用於共享原始碼集時，才使用 `languageSettings {}` 區塊。對於所有其他情況，請使用 `compilerOptions {}` 區塊在擴充或目標層級[配置編譯器選項](#compiler-options)。

以下語言設定可用：

| **名稱**                | **描述**                                                                                                                                                                                                |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `languageVersion`       | 提供與指定 Kotlin 版本相容的原始碼。                                                                                                                                                           |
| `apiVersion`            | 允許僅使用指定 Kotlin 捆綁函式庫版本中的宣告。                                                                                                                                                  |
| `enableLanguageFeature` | 啟用指定的語言功能。可用值對應於目前實驗性或在某個時候引入的語言功能。                                                                                                                          |
| `optIn`                 | 允許使用指定的[選擇性加入註解](https://kotlinlang.org/docs/opt-in-requirements.html)。                                                                                                          |
| `progressiveMode`       | 啟用[漸進模式](https://kotlinlang.org/docs/whatsnew13.html#progressive-mode)。                                                                                                                  |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "%languageVersion%" // possible values: "1.8", "1.9", "2.0", "2.1"
            apiVersion = "%apiVersion%" // possible values: "1.8", "1.9", "2.0", "2.1"
            enableLanguageFeature("InlineClasses") // language feature name
            optIn("kotlin.ExperimentalUnsignedTypes") // annotation FQ-name
            progressiveMode = true // false by default
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '%languageVersion%' // possible values: '1.8', '1.9', '2.0', '2.1'
            apiVersion = '%apiVersion%' // possible values: '1.8', '1.9', '2.0', '2.1'
            enableLanguageFeature('InlineClasses') // language feature name
            optIn('kotlin.ExperimentalUnsignedTypes') // annotation FQ-name
            progressiveMode = true // false by default
        }
    }
}
```

</TabItem>
</Tabs>