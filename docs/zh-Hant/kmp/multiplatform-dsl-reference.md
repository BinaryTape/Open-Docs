[//]: # (title: 多平台 Gradle DSL 參考)

Kotlin 多平台 Gradle 外掛程式是建立 Kotlin 多平台專案的工具。在此，我們提供其內容的參考資料；您在編寫 Kotlin 多平台專案的 Gradle 建置腳本時，可將其作為提醒。深入了解 [Kotlin 多平台專案的概念，以及如何建立和設定它們](multiplatform-discover-project.md)。

## ID 和版本

Kotlin 多平台 Gradle 外掛程式的完整合格名稱是 `org.jetbrains.kotlin.multiplatform`。如果您使用 Kotlin Gradle DSL，可以使用 `kotlin("multiplatform")` 應用此外掛程式。此外掛程式版本與 Kotlin 發行版本相符。最新版本是 %kotlinVersion%。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

## 頂層區塊

`kotlin {}` 是 Gradle 建置腳本中用於多平台專案設定的頂層區塊。在 `kotlin {}` 內部，您可以編寫以下區塊：

| **區塊**             | **描述**                                                                                                                              |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | 宣告專案的特定目標。可用目標的名稱列於 [目標](#targets) 區段。                                                                    |
| `targets`            | 列出專案的所有目標。                                                                                                                  |
| `sourceSets`         | 設定預定義並宣告專案的自訂 [原始碼集](#source-sets)。                                                                          |
| `compilerOptions`    | 指定通用的擴充功能層級 [編譯器選項](#compiler-options)，這些選項將作為所有目標和共享原始碼集的預設值。 |

## 目標

一個 _目標_ 是建置的一部分，負責編譯、測試和打包針對其中一個支援平台的軟體片段。Kotlin 為每個平台提供目標，因此您可以指示 Kotlin 為該特定目標編譯程式碼。深入了解 [設定目標](multiplatform-discover-project.md#targets)。

每個目標可以有一個或多個 [編譯](#compilations)。除了用於測試和生產目的的預設編譯之外，您還可以 [建立自訂編譯](multiplatform-configure-compilations.md#create-a-custom-compilation)。

多平台專案的目標在 `kotlin {}` 內相應的區塊中描述，例如 `jvm`、`androidTarget`、`iosArm64`。可用目標的完整列表如下：

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
        <td>如果您打算在 JavaScript 執行時環境中執行專案，請使用它。</td>
    </tr>
    <tr>
        <td><code>wasmWasi</code></td>
        <td>如果您需要支援 <a href="https://github.com/WebAssembly/WASI">WASI</a> 系統介面，請使用它。</td>
    </tr>
    <tr>
        <td>Kotlin/JS</td>
        <td><code>js</code></td>
        <td>
            <p>選擇執行環境：</p>
            <list>
                <li><code>browser {}</code> 適用於在瀏覽器中執行的應用程式。</li>
                <li><code>nodejs {}</code> 適用於在 Node.js 上執行的應用程式。</li>
            </list>
            <p>深入了解 <a href="https://kotlinlang.org/docs/js-project-setup.html#execution-environments">設定 Kotlin/JS 專案</a>。</p>
        </td>
    </tr>
    <tr>
        <td>Kotlin/Native</td>
        <td></td>
        <td>
            <p>深入了解 <a href="https://kotlinlang.org/docs/native-target-support.html">Kotlin/Native 目標支援</a> 中目前支援的 macOS、Linux 和 Windows 主機目標。</p>
        </td>
    </tr>
    <tr>
        <td>Android 應用程式與函式庫</td>
        <td><code>androidTarget</code></td>
        <td>
            <p>手動應用 Android Gradle 外掛程式：<code>com.android.application</code> 或 <code>com.android.library</code>。</p>
            <p>每個 Gradle 子專案只能建立一個 Android 目標。</p>
        </td>
    </tr>
</table>

> 當前主機不支援的目標在建置期間會被忽略，因此不會發佈。
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

目標的設定可以包含兩個部分：

*   適用於所有目標的 [通用設定](#common-target-configuration)。
*   目標特定設定。

每個目標可以有一個或多個 [編譯](#compilations)。

### 通用目標設定

在任何目標區塊中，您可以使用以下宣告：

| **名稱**            | **描述**                                                                                                                                                                                                       |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | 此目標的 Kotlin 平台。可用值：`jvm`、`androidJvm`、`js`、`wasm`、`native`、`common`。                                                                                        |
| `artifactsTaskName` | 建置此目標的結果構件的任務名稱。                                                                                                                                                                 |
| `components`        | 用於設定 Gradle 發佈的組件。                                                                                                                                                                     |
| `compilerOptions`   | 用於目標的 [編譯器選項](#compiler-options)。此宣告會覆寫在 [頂層](multiplatform-dsl-reference.md#top-level-blocks) 設定的任何 `compilerOptions {}`。 |

### Web 目標

`js {}` 區塊描述 Kotlin/JS 目標的設定，而 `wasmJs {}` 區塊描述可與 JavaScript 互通的 Kotlin/Wasm 目標的設定。它們可以根據目標執行環境包含以下兩個區塊之一：

| **名稱**              | **描述**                   |
|-----------------------|----------------------------|
| [`browser`](#browser) | 瀏覽器目標的設定。         |
| [`nodejs`](#node-js)  | Node.js 目標的設定。       |

深入了解 [設定 Kotlin/JS 專案](https://kotlinlang.org/docs/js-project-setup.html)。

一個單獨的 `wasmWasi {}` 區塊描述支援 WASI 系統介面的 Kotlin/Wasm 目標的設定。在此，僅有 [`nodejs`](#node-js) 執行環境可用：

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

所有 web 目標，`js`、`wasmJs` 和 `wasmWasi`，也支援 `binaries.executable()` 呼叫。它明確指示 Kotlin 編譯器發出可執行檔。如需更多資訊，請參閱 Kotlin/JS 文件中的 [執行環境](https://kotlinlang.org/docs/js-project-setup.html#execution-environments)。

#### 瀏覽器

`browser {}` 可以包含以下設定區塊：

| **名稱**       | **描述**                                         |
|----------------|--------------------------------------------------|
| `testRuns`     | 測試執行的設定。                                 |
| `runTask`      | 專案執行的設定。                                 |
| `webpackTask`  | 使用 [Webpack](https://webpack.js.org/) 進行專案打包的設定。 |
| `distribution` | 輸出檔案的路徑。                                 |

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

`nodejs {}` 可以包含測試和執行任務的設定：

| **名稱**   | **描述**                   |
|------------|----------------------------|
| `testRuns` | 測試執行的設定。           |
| `runTask`  | 專案執行的設定。           |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### 原生目標

對於原生目標，以下特定區塊可用：

| **名稱**    | **描述**                                 |
|-------------|------------------------------------------|
| `binaries`  | 要生成的 [二進位檔](#binaries) 的設定。  |
| `cinterops` | 與 C 函式庫 [互通](#cinterops) 的設定。 |

#### 二進位檔

二進位檔有以下幾種：

| **名稱**     | **描述**           |
|--------------|--------------------|
| `executable` | 產品可執行檔。     |
| `test`       | 測試可執行檔。     |
| `sharedLib`  | 共享函式庫。       |
| `staticLib`  | 靜態函式庫。       |
| `framework`  | Objective-C 框架。 |

```kotlin
kotlin {
    linuxX64 { // 請改用您的目標。
        binaries {
            executable {
                // 二進位設定。
            }
        }
    }
}
```

對於二進位設定，以下參數可用：

| **名稱**      | **描述**                                                                                                                                                                                                                               |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | 建置二進位檔的編譯。預設情況下，`test` 二進位檔基於 `test` 編譯，而其他二進位檔則基於 `main` 編譯。                                                                                                                                     |
| `linkerOpts`  | 在二進位檔建置期間傳遞給系統連結器的選項。                                                                                                                                                                         |
| `baseName`    | 輸出檔案的自訂基本名稱。最終檔案名稱將透過在此基本名稱中新增系統相關的前綴和後綴來形成。                                                                                                                       |
| `entryPoint`  | 可執行二進位檔的進入點函式。預設情況下，它是根套件中的 `main()`。                                                                                                                                                                      |
| `outputFile`  | 存取輸出檔案。                                                                                                                                                                                                           |
| `linkTask`    | 存取連結任務。                                                                                                                                                                                                           |
| `runTask`     | 存取可執行二進位檔的執行任務。對於 `linuxX64`、`macosX64` 或 `mingwX64` 以外的目標，該值為 `null`。                                                                                                                             |
| `isStatic`    | 適用於 Objective-C 框架。包含靜態函式庫而不是動態函式庫。                                                                                                                                                   |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // 基於測試編譯建置二進位檔。
        compilation = compilations["test"]

        // 連結器的自訂命令列選項。
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 輸出檔案的基本名稱。
        baseName = "foo"

        // 自訂進入點函式。
        entryPoint = "org.example.main"

        // 存取輸出檔案。
        println("Executable path: ${outputFile.absolutePath}")

        // 存取連結任務。
        linkTask.dependsOn(additionalPreprocessingTask)

        // 存取執行任務。
        // 請注意，對於非主機平台，runTask 為 null。
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // 在框架中包含靜態函式庫而非動態函式庫。
        isStatic = true
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // 基於測試編譯建置二進位檔。
        compilation = compilations.test

        // 連結器的自訂命令列選項。
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 輸出檔案的基本名稱。
        baseName = 'foo'

        // 自訂進入點函式。
        entryPoint = 'org.example.main'

        // 存取輸出檔案。
        println("Executable path: ${outputFile.absolutePath}")

        // 存取連結任務。
        linkTask.dependsOn(additionalPreprocessingTask)

        // 存取執行任務。
        // 請注意，對於非主機平台，runTask 為 null。
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework' [RELEASE]) {
        // 在框架中包含靜態函式庫而非動態函式庫。
        isStatic = true
    }
}
```

</tab>
</tabs>

深入了解 [建置原生二進位檔](multiplatform-build-native-binaries.md)。

#### C 互通 (Cinterops)

`cinterops` 是與原生函式庫互通的描述集合。若要提供與函式庫的互通，請在 `cinterops` 中新增一個項目並定義其參數：

| **名稱**         | **描述**                                                                   |
|------------------|----------------------------------------------------------------------------|
| `definitionFile` | 描述原生 API 的 `.def` 檔案。                                              |
| `packageName`    | 生成的 Kotlin API 的套件前綴。                                             |
| `compilerOpts`   | 透過 cinterop 工具傳遞給編譯器的選項。                                     |
| `includeDirs`    | 尋找標頭的目錄。                                                           |
| `header`         | 要包含在繫結中的標頭。                                                     |
| `headers`        | 要包含在繫結中的標頭列表。                                                 |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 替換為您需要的目標。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的定義檔。
                // 預設路徑為 src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))

                // 放置生成 Kotlin API 的套件。
                packageName("org.sample")

                // 要透過 cinterop 工具傳遞給編譯器的選項。
                compilerOpts("-Ipath/to/headers")

                // 標頭搜尋的目錄（` -I<path>` 編譯器選項的類似物）。
                includeDirs.allHeaders("path1", "path2")

                // includeDirs.allHeaders 的捷徑。
                includeDirs("include/directory", "another/directory")

                // 要包含在繫結中的標頭檔案。
                header("path/to/header.h")
                headers("path/to/header1.h", "path/to/header2.h")
            }

            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 替換為您需要的目標。
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的定義檔。
                    // 預設路徑為 src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")

                    // 放置生成 Kotlin API 的套件。
                    packageName 'org.sample'

                    // 要透過 cinterop 工具傳遞給編譯器的選項。
                    compilerOpts '-Ipath/to/headers'

                    // 標頭搜尋的目錄（` -I<path>` 編譯器選項的類似物）。
                    includeDirs.allHeaders("path1", "path2")

                    // includeDirs.allHeaders 的捷徑。
                    includeDirs("include/directory", "another/directory")

                    // 要包含在繫結中的標頭檔案。
                    header("path/to/header.h")
                    headers("path/to/header1.h", "path/to/header2.h")
                }

                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</tab>
</tabs>

如需更多 cinterop 屬性，請參閱 [定義檔](https://kotlinlang.org/docs/native-definition-file.html#properties)。

### Android 目標

Kotlin 多平台外掛程式有一個特定函式，可協助您為 Android 目標設定 [建置變體](https://developer.android.com/studio/build/build-variants)：

| **名稱**                      | **描述**                                                                                                                                               |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 指定要發佈的建置變體。深入了解 [發佈 Android 函式庫](multiplatform-publish-lib-setup.md#publish-an-android-library)。 |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

深入了解 [針對 Android 的編譯](multiplatform-configure-compilations.md#compilation-for-android)。

> `kotlin {}` 區塊內的 `androidTarget` 設定不會取代任何 Android 專案的建置設定。深入了解 [Android 開發者文件](https://developer.android.com/studio/build) 中編寫 Android 專案建置腳本的資訊。
>
{style="note"}

## 原始碼集

`sourceSets {}` 區塊描述專案的原始碼集。原始碼集包含共同參與編譯的 Kotlin 原始碼檔案，以及它們的資源和依賴項。

多平台專案包含針對其目標的 [預定義](#predefined-source-sets) 原始碼集；開發者也可以根據自身需求建立 [自訂](#custom-source-sets) 原始碼集。

### 預定義原始碼集

預定義原始碼集在建立多平台專案時會自動設定。可用的預定義原始碼集如下：

| **名稱**                                    | **描述**                                                                                                                                                                                                              |
|---------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | 在所有平台之間共享的程式碼和資源。在所有多平台專案中可用。用於專案的所有主要 [編譯](#compilations)。                                                                                                   |
| `commonTest`                                | 在所有平台之間共享的測試程式碼和資源。在所有多平台專案中可用。用於專案的所有測試編譯。                                                                                                                |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | 編譯的目標特定原始碼。_&lt;targetName&gt;_ 是預定義目標的名稱，_&lt;compilationName&gt;_ 是此目標的編譯名稱。範例：`jsTest`、`jvmMain`。 |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</tab>
</tabs>

深入了解 [原始碼集](multiplatform-discover-project.md#source-sets)。

### 自訂原始碼集

自訂原始碼集由專案開發者手動建立。若要建立自訂原始碼集，請在 `sourceSets` 區段內新增一個帶有其名稱的區段。如果使用 Kotlin Gradle DSL，請將自訂原始碼集標記為 `by creating`。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        val myMain by creating { /* ... */ } // 建立一個名為 'MyMain' 的新原始碼集
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        myMain { /* ... */ } // 建立或設定一個名為 'myMain' 的原始碼集
    }
}
```

</tab>
</tabs>

請注意，新建立的原始碼集未與其他原始碼集連接。若要在專案的編譯中使用它，請 [將其與其他原始碼集連接](multiplatform-hierarchy.md#manual-configuration)。

### 原始碼集參數

原始碼集的設定儲存在 `sourceSets {}` 的相應區塊中。原始碼集有以下參數：

| **名稱**           | **描述**                                                                      |
|--------------------|-------------------------------------------------------------------------------|
| `kotlin.srcDir`    | 原始碼集目錄中 Kotlin 原始碼檔案的位置。                                      |
| `resources.srcDir` | 原始碼集目錄中資源的位置。                                                    |
| `dependsOn`        | 與另一個原始碼集的 [連接](multiplatform-hierarchy.md#manual-configuration)。 |
| `dependencies`     | 原始碼集的 [依賴項](#dependencies)。                                          |
| `languageSettings` | 應用於共享原始碼集的 [語言設定](#language-settings)。                         |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

## 編譯

一個目標可以有一個或多個編譯，例如用於生產或測試。有 [預定義編譯](#predefined-compilations) 在目標建立時會自動新增。您可以另外建立 [自訂編譯](#custom-compilations)。

若要參考目標的所有或某些特定編譯，請使用 `compilations` 物件集合。從 `compilations` 中，您可以透過其名稱參考編譯。

深入了解 [設定編譯](multiplatform-configure-compilations.md)。

### 預定義編譯

預定義編譯會為專案的每個目標自動建立，除了 Android 目標。可用的預定義編譯如下：

| **名稱** | **描述**                   |
|----------|----------------------------|
| `main`   | 用於生產原始碼的編譯。     |
| `test`   | 用於測試的編譯。           |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // 取得主要編譯輸出
        }

        compilations["test"].runtimeDependencyFiles // 取得測試執行時類別路徑
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main.output // 取得主要編譯輸出
        compilations.test.runtimeDependencyFiles // 取得測試執行時類別路徑
    }
}
```

</tab>
</tabs>

### 自訂編譯

除了預定義編譯之外，您可以建立您自己的自訂編譯。若要做到這一點，請在新的編譯與 `main` 編譯之間設定 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 關係。如果您使用 Kotlin Gradle DSL，請將自訂編譯標記為 `by creating`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // 將 main 及其類別路徑作為依賴項匯入並建立內部可見性
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // 建立一個測試任務來執行此編譯產生的測試
                testRuns.create("integration") {
                    // 設定測試任務
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // 將 main 及其類別路徑作為依賴項匯入並建立內部可見性
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // 建立一個測試任務來執行此編譯產生的測試
            testRuns.create('integration') {
                // 設定測試任務
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</tab>
</tabs>

透過關聯編譯，您將主要編譯輸出新增為依賴項，並建立編譯之間的 `internal` 可見性。

深入了解建立 [自訂編譯](multiplatform-configure-compilations.md#create-a-custom-compilation)。

### 編譯參數

編譯有以下參數：

| **名稱**                 | **描述**                                                                                                                                                                                                              |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | 此編譯的預設原始碼集。                                                                                                                                                                                                |
| `kotlinSourceSets`       | 參與編譯的原始碼集。                                                                                                                                                                                                  |
| `allKotlinSourceSets`    | 參與編譯的原始碼集及其透過 `dependsOn()` 的連接。                                                                                                                                                                       |
| `compilerOptions`        | 應用於編譯的編譯器選項。可用選項列表請參閱 [編譯器選項](https://kotlinlang.org/docs/gradle-compiler-options.html)。                                                                                               |
| `compileKotlinTask`      | 用於編譯 Kotlin 原始碼的 Gradle 任務。                                                                                                                                                                              |
| `compileKotlinTaskName`  | `compileKotlinTask` 的名稱。                                                                                                                                                                                          |
| `compileAllTaskName`     | 編譯所有編譯原始碼的 Gradle 任務名稱。                                                                                                                                                                              |
| `output`                 | 編譯輸出。                                                                                                                                                                                                            |
| `compileDependencyFiles` | 編譯的編譯時依賴檔 (類別路徑)。對於所有 Kotlin/Native 編譯，這會自動包含標準函式庫和平台依賴項。                                                                                                                       |
| `runtimeDependencyFiles` | 編譯的執行時依賴檔 (類別路徑)。                                                                                                                                                                                       |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 為 'main' 編譯設定 Kotlin 編譯器選項：
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }

            compileKotlinTask // 取得 Kotlin 任務 'compileKotlinJvm'
            output // 取得主要編譯輸出
        }

        compilations["test"].runtimeDependencyFiles // 取得測試執行時類別路徑
    }

    // 設定所有目標的所有編譯：
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                // 為 'main' 編譯設定 Kotlin 編譯器選項：
                jvmTarget = JvmTarget.JVM_1_8
            }
        }

        compilations.main.compileKotlinTask // 取得 Kotlin 任務 'compileKotlinJvm'
        compilations.main.output // 取得主要編譯輸出
        compilations.test.runtimeDependencyFiles // 取得測試執行時類別路徑
    }

    // 設定所有目標的所有編譯：
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

## 編譯器選項

您可以在專案中透過三個不同的層級設定編譯器選項：

*   **擴充功能層級**，在 `kotlin {}` 區塊中。
*   **目標層級**，在目標區塊中。
*   **編譯單元層級**，通常在特定的編譯任務中。

![Kotlin 編譯器選項層級](compiler-options-levels.svg){width=700}

較高層級的設定會作為下層級的預設值：

*   擴充功能層級設定的編譯器選項是目標層級選項的預設值，包括 `commonMain`、`nativeMain` 和 `commonTest` 等共享原始碼集。
*   目標層級設定的編譯器選項是編譯單元 (任務) 層級選項的預設值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任務。

較低層級的設定會覆寫較高層級的類似設定：

*   任務層級的編譯器選項會覆寫目標或擴充功能層級的類似設定。
*   目標層級的編譯器選項會覆寫擴充功能層級的類似設定。

如需可能的編譯器選項列表，請參閱 [所有編譯器選項](https://kotlinlang.org/docs/gradle-compiler-options.html#all-compiler-options)。

### 擴充功能層級

若要為專案中的所有目標設定編譯器選項，請在頂層使用 `compilerOptions {}` 區塊：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // 設定所有目標的所有編譯
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // 設定所有目標的所有編譯：
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

### 目標層級

若要為專案中的特定目標設定編譯器選項，請在目標區塊內使用 `compilerOptions {}` 區塊：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        // 設定 JVM 目標的所有編譯
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        // 設定 JVM 目標的所有編譯
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</tab>
</tabs>

### 編譯單元層級

若要為特定任務設定編譯器選項，請在任務內部使用 `compilerOptions {}` 區塊：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

若要為特定編譯設定編譯器選項，請在編譯的任務提供者中，使用 `compilerOptions {}` 區塊：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 設定 'main' 編譯：
                compilerOptions {
                    allWarningsAsErrors.set(true)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 設定 'main' 編譯：
                compilerOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</tab>
</tabs>

### 從 `kotlinOptions {}` 遷移到 `compilerOptions {}` {collapsible="true"}

在 Kotlin 2.2.0 之前，您可以D使用 `kotlinOptions {}` 區塊設定編譯器選項。由於 `kotlinOptions {}` 區塊在 Kotlin 2.2.0 中已棄用，您需要改為在您的建置腳本中使用 `compilerOptions {}` 區塊。如需更多資訊，請參閱 [從 `kotlinOptions{}` 遷移到 `compilerOptions{}`](https://kotlinlang.org/docs/gradle-compiler-options.html#migrate-from-kotlinoptions-to-compileroptions)。

## 依賴項

原始碼集宣告的 `dependencies {}` 區塊包含此原始碼集的依賴項。

深入了解 [設定依賴項](https://kotlinlang.org/docs/gradle-configure-project.html)。

依賴項有四種類型：

| **名稱**         | **描述**                                                   |
|------------------|------------------------------------------------------------|
| `api`            | 用於當前模組 API 的依賴項。                                |
| `implementation` | 在模組中使用但未向外部暴露的依賴項。                       |
| `compileOnly`    | 僅用於當前模組編譯的依賴項。                               |
| `runtimeOnly`    | 在執行時可用但在任何模組編譯期間不可見的依賴項。           |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

此外，原始碼集可以相互依賴並形成層次結構。在這種情況下，使用 [`dependsOn()`](#source-set-parameters) 關係。

原始碼集依賴項也可以在建置腳本的頂層 `dependencies {}` 區塊中宣告。在這種情況下，它們的宣告遵循 `<sourceSetName><DependencyKind>` 模式，例如 `commonMainApi`。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    "commonMainApi"("com.example:foo-common:1.0")
    "jvm6MainApi"("com.example:foo-jvm6:1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    commonMainApi 'com.example:foo-common:1.0'
    jvm6MainApi 'com.example:foo-jvm6:1.0'
}
```

</tab>
</tabs>

## 語言設定

原始碼集中的 `languageSettings {}` 區塊定義專案分析和編譯的某些方面。僅當設定專門適用於共享原始碼集時，才使用 `languageSettings {}` 區塊。對於所有其他情況，請使用 `compilerOptions {}` 區塊在擴充功能或目標層級 [設定編譯器選項](#compiler-options)。

以下語言設定可用：

| **名稱**                | **描述**                                                                                                                                                                                                                                                                                  |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `languageVersion`       | 提供與指定 Kotlin 版本的原始碼相容性。                                                                                                                                                                                                                                                   |
| `apiVersion`            | 僅允許使用指定 Kotlin 綁定函式庫版本的宣告。                                                                                                                                                                                                                                             |
| `enableLanguageFeature` | 啟用指定的語言功能。可用值對應於當前是實驗性或在某個時候被引入為實驗性的語言功能。                                                                                                                                                                                          |
| `optIn`                 | 允許使用指定的 [選入註解](https://kotlinlang.org/docs/opt-in-requirements.html)。                                                                                                                                                                                                    |
| `progressiveMode`       | 啟用 [漸進模式](https://kotlinlang.org/docs/whatsnew13.html#progressive-mode)。                                                                                                                                                                                                            |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "%languageVersion%" // 可能的值：「1.8」、「1.9」、「2.0」、「2.1」
            apiVersion = "%apiVersion%" // 可能的值：「1.8」、「1.9」、「2.0」、「2.1」
            enableLanguageFeature("InlineClasses") // 語言功能名稱
            optIn("kotlin.ExperimentalUnsignedTypes") // 註解完整合格名稱
            progressiveMode = true // 預設為 false
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '%languageVersion%' // 可能的值：「1.8」、「1.9」、「2.0」、「2.1」
            apiVersion = '%apiVersion%' // 可能的值：「1.8」、「1.9」、「2.0」、「2.1」
            enableLanguageFeature('InlineClasses') // 語言功能名稱
            optIn('kotlin.ExperimentalUnsignedTypes') // 註解完整合格名稱
            progressiveMode = true // 預設為 false
        }
    }
}
```

</tab>
</tabs>