[//]: # (title: 設定 Kotlin/JS 專案)

Kotlin/JS 專案使用 Gradle 作為建置系統。為了讓開發人員能夠輕鬆管理他們的 Kotlin/JS 專案，我們提供了 `kotlin.multiplatform` Gradle 插件，該插件提供了專案配置工具以及自動化 JavaScript 開發中常見例行工作的輔助任務。

該插件使用 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/) 套件管理器在背景下載 npm 相依性，並使用 [webpack](https://webpack.js.org/) 從 Kotlin 專案建置 JavaScript 綁定（bundle）。相依性管理和配置調整大部分可以直接從 Gradle 建置檔案中完成，並可選擇覆寫自動生成的配置以實現完全控制。

您可以手動將 `org.jetbrains.kotlin.multiplatform` 插件應用於 `build.gradle(.kts)` 檔案中的 Gradle 專案：

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

Kotlin Multiplatform Gradle 插件讓您可以在建置腳本的 `kotlin {}` 區塊中管理專案的各個方面：

```groovy
kotlin {
    // ...
}
```

在 `kotlin {}` 區塊內部，您可以管理以下方面：

* [目標執行環境](#execution-environments)：瀏覽器或 Node.js 
* [支援 ES2015 功能](#support-for-es2015-features)：類別、模組和產生器
* [配置輸出粒度](#configure-output-granularity)
* [生成 TypeScript 宣告檔案（d.ts）](#generation-of-typescript-declaration-files-d-ts)
* [專案相依性](#dependencies)：Maven 和 npm
* [執行配置](#run-task)
* [測試配置](#test-task)
* [綁定](#webpack-bundling)和[CSS 支援](#css)（適用於瀏覽器專案）
* [目標目錄](#distribution-target-directory)和[模組名稱](#module-name)
* [專案的 `package.json` 檔案](#package-json-customization)

## 執行環境

Kotlin/JS 專案可以針對兩種不同的執行環境： 

* 瀏覽器：用於瀏覽器中的客戶端腳本
* [Node.js](https://nodejs.org/)：用於在瀏覽器外部執行 JavaScript 程式碼，例如用於伺服器端腳本。

若要定義 Kotlin/JS 專案的目標執行環境，請在內部新增包含 `browser {}` 或 `nodejs {}` 的 `js {}` 區塊：

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

指令 `binaries.executable()` 明確指示 Kotlin 編譯器發出可執行檔的 `.js` 檔案。
省略 `binaries.executable()` 將導致編譯器僅產生 Kotlin 內部函式庫檔案，這些檔案可以從其他專案中使用，但無法獨立執行。

> 這通常比建立可執行檔更快，並且在處理專案的非葉模組時，這可能是一種優化方式。
>
{style="tip"}

Kotlin Multiplatform 插件會自動配置其任務以與所選環境配合使用。
這包括下載和安裝執行和測試應用程式所需的環境和相依性。
這允許開發人員在無需額外配置的情況下建置、執行和測試簡單的專案。對於針對 Node.js 的專案，還可以選擇使用現有的 Node.js 安裝。了解如何[使用預先安裝的 Node.js](#use-pre-installed-node-js)。

## 支援 ES2015 功能

Kotlin 為以下 ES2015 功能提供[實驗性](components-stability.md#stability-levels-explained)支援：

* 模組：簡化您的程式碼庫並提高可維護性。
* 類別：允許納入 OOP 原則，產生更簡潔、更直觀的程式碼。
* 產生器：用於編譯[暫停函式](https://kotlinlang.org/docs/composing-suspending-functions.html)，可改善最終綁定（bundle）大小並有助於偵錯。

您可以透過將 `es2015` 編譯目標新增到您的 `build.gradle(.kts)` 檔案中，一次性啟用所有支援的 ES2015 功能：

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    compilerOptions {
        target = "es2015"
    }
}
```

[在官方文件中了解更多關於 ES2015 (ECMAScript 2015, ES6) 的資訊](https://262.ecma-international.org/6.0/)。

## 配置輸出粒度

您可以選擇編譯器如何在專案中輸出 `.js` 檔案：

* **每個模組一個**。預設情況下，JS 編譯器會為每個專案模組輸出單獨的 `.js` 檔案作為編譯結果。
* **每個專案一個**。您可以透過將以下行新增到 `gradle.properties` 檔案中，將整個專案編譯成一個單一的 `.js` 檔案：

  ```none
  kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
  ```

* **每個檔案一個**。您可以設定更細粒度的輸出，為每個 Kotlin 檔案生成一個 (或兩個，如果檔案包含匯出的宣告) JavaScript 檔案。若要啟用每個檔案的編譯模式：
  1. 將 `es2015` 設定為[編譯目標](#support-for-es2015-features)，以支援專案中的 ES2015 功能。
  2. 將以下行新增到 `gradle.properties` 檔案中：
     ```none
     kotlin.js.ir.output.granularity=per-file // 'per-module' is the default
     ```

## 生成 TypeScript 宣告檔案（d.ts）
<primary-label ref="experimental-opt-in"/>

Kotlin/JS 編譯器可以從您的 Kotlin 程式碼生成 TypeScript 定義。這些定義可供 JavaScript 工具和 IDE 在處理混合應用程式時使用，以：

* 提供自動完成
* 支援靜態分析器
* 簡化 JavaScript 和 TypeScript 專案中 Kotlin 程式碼的添加

生成 TypeScript 定義對於[業務邏輯共享用例](js-overview.md#use-cases-for-kotlin-js)特別有價值。

編譯器會收集所有標記為 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 的頂層宣告，並自動生成 TypeScript 定義到一個 `.d.ts` 檔案中。

若要生成 TypeScript 定義，請在您的 Gradle 建置檔案中明確配置。將 `generateTypeScriptDefinitions()` 函式新增到您的 `build.gradle.kts` 檔案中，位於 [`js {}` 區塊](js-project-setup.md#execution-environments)內部：

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

您可以在 `build/js/packages/<package_name>/kotlin` 目錄中找到這些定義，與相應的未經 webpack 處理的 JavaScript 程式碼並列。

## 相依性

如同任何其他 Gradle 專案，Kotlin/JS 專案支援在建置腳本的 `dependencies {}` 區塊中進行傳統的 Gradle [相依性宣告](https://docs.gradle.org/current/userguide/declaring_dependencies.html)：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation("org.example.myproject", "1.1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation 'org.example.myproject:1.1.0'
}
```

</tab>
</tabs>

Kotlin Multiplatform Gradle 插件還支援在建置腳本的 `kotlin {}` 區塊中，針對特定原始碼集進行相依性宣告：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation("org.example.myproject:1.1.0")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jsMain {
            dependencies {
                implementation 'org.example.myproject:1.1.0'
            }
        }
    }
}
```

</tab>
</tabs>

> 並非所有 Kotlin 程式語言可用的函式庫在以 JavaScript 為目標時都可用：只有包含 Kotlin/JS Artifact 的函式庫才能使用。
>
{style="note"}

如果您新增的函式庫對 [來自 npm 的套件](#npm-dependencies)有相依性，Gradle 也會自動解析這些遞移性相依性。

### Kotlin 標準函式庫

對[標準函式庫](https://kotlinlang.org/api/latest/jvm/stdlib/index.html)的相依性會自動新增。標準函式庫的版本與 Kotlin Multiplatform 插件的版本相同。

對於多平台測試，可以使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API。當您建立多平台專案時，可以透過在 `commonTest` 中使用單一相依性，將測試相依性新增到所有原始碼集：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // Brings all the platform dependencies automatically
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // Brings all the platform dependencies automatically
            }
        }
    }
}
```

</tab>
</tabs>

### npm 相依性

在 JavaScript 世界中，管理相依性最常見的方式是 [npm](https://www.npmjs.com/)。它提供了最大的 JavaScript 模組公共儲存庫。

Kotlin Multiplatform Gradle 插件允許您在 Gradle 建置腳本中宣告 npm 相依性，就像宣告任何其他相依性一樣。

若要宣告 npm 相依性，請在相依性宣告內部將其名稱和版本傳遞給 `npm()` 函式。您還可以根據 [npm 的語義化版本控制語法](https://docs.npmjs.com/about-semantic-versioning)指定一個或多個版本範圍。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(npm("react", "> 14.0.0 <=16.9.0"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation npm('react', '> 14.0.0 <=16.9.0')
}
```

</tab>
</tabs>

預設情況下，該插件使用獨立的 [Yarn](https://yarnpkg.com/lang/en/) 套件管理器實例來下載和安裝 npm 相依性。它無需額外配置即可直接使用，但您可以[根據特定需求進行調整](#yarn)。

您也可以直接使用 [npm](https://www.npmjs.com/) 套件管理器來處理 npm 相依性。若要使用 npm 作為您的套件管理器，請在您的 `gradle.properties` 檔案中設定以下屬性：

```none
kotlin.js.yarn=false
```

除了常規相依性之外，還有三種其他類型的相依性可以從 Gradle DSL 中使用。若要了解每種類型的相依性何時最適合使用，請查閱 npm 提供的官方文件連結：

* [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)，透過 `devNpm(...)`，
* [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies)，透過 `optionalNpm(...)`，和
* [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies)，透過 `peerNpm(...)`。

一旦安裝了 npm 相依性，您就可以在程式碼中使用其 API，如[從 Kotlin 呼叫 JS](js-interop.md) 中所述。

## run 任務

Kotlin Multiplatform Gradle 插件提供了一個 `jsBrowserDevelopmentRun` 任務，讓您無需額外配置即可執行純 Kotlin/JS 專案。

對於在瀏覽器中執行 Kotlin/JS 專案，此任務是 `browserDevelopmentRun` 任務的別名（該任務在 Kotlin 多平台專案中也可用）。它使用 [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) 來提供您的 JavaScript Artifacts。
如果您想自訂 `webpack-dev-server` 使用的配置，例如調整伺服器運行的連接埠，請使用 [webpack 配置檔案](#webpack-bundling)。

對於針對 Node.js 的 Kotlin/JS 專案，請使用 `jsNodeDevelopmentRun` 任務，它是 `nodeRun` 任務的別名。

若要執行專案，請執行標準生命週期 `jsBrowserDevelopmentRun` 任務，或其對應的別名：

```bash
./gradlew jsBrowserDevelopmentRun
```

若要在更改原始碼檔案後自動觸發應用程式的重新建置，請使用 Gradle [連續建置](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build)功能：

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

或 

```bash
./gradlew jsBrowserDevelopmentRun -t
```

一旦您的專案建置成功，`webpack-dev-server` 將自動重新整理瀏覽器頁面。

## test 任務

Kotlin Multiplatform Gradle 插件會自動為專案設定測試基礎設施。對於瀏覽器專案，它會下載並安裝 [Karma](https://karma-runner.github.io/) 測試執行器及其他所需相依性；對於 Node.js 專案，則使用 [Mocha](https://mochajs.org/) 測試框架。 

該插件還提供了有用的測試功能，例如：

* 原始碼映射（Source map）生成
* 測試報告生成
* 控制台中的測試執行結果

對於執行瀏覽器測試，該插件預設使用 [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)。
您也可以透過在建置腳本的 `useKarma {}` 區塊內部新增相應的條目來選擇其他瀏覽器執行測試：

```groovy
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useIe()
                    useSafari()
                    useFirefox()
                    useChrome()
                    useChromeCanary()
                    useChromeHeadless()
                    usePhantomJS()
                    useOpera()
                }
            }
        }
        binaries.executable()
        // ...
    }
}
```

或者，您可以在 `gradle.properties` 檔案中新增瀏覽器的測試目標：

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

這種方法允許您為所有模組定義瀏覽器列表，然後在特定模組的建置腳本中新增特定的瀏覽器。 

請注意，Kotlin Multiplatform Gradle 插件不會自動為您安裝這些瀏覽器，它只會使用在其執行環境中可用的瀏覽器。如果您在持續整合伺服器上執行 Kotlin/JS 測試，例如，請確保您要測試的瀏覽器已安裝。

如果您想跳過測試，請在 `testTask {}` 中新增 `enabled = false` 行：

```groovy
kotlin {
    js {
        browser {
            testTask {
                enabled = false
            }
        }
        binaries.executable()
        // ...
    }
}
```

若要執行測試，請執行標準生命週期 `check` 任務：

```bash
./gradlew check
```

若要指定您的 Node.js 測試執行器使用的環境變數（例如，將外部資訊傳遞給您的測試，或微調套件解析），請在您的建置腳本的 `testTask {}` 區塊內部使用帶有鍵值對的 `environment()` 函式：

```groovy
kotlin {
    js {
        nodejs {
            testTask {
                environment("key", "value")
            }
        }
    }
}
```

### Karma 配置

Kotlin Multiplatform Gradle 插件會在建置時自動生成 Karma 配置檔案，其中包含您在 `build.gradle(.kts)` 中 [`kotlin.js.browser.testTask.useKarma {}` 區塊](#test-task)的設定。您可以在 `build/js/packages/projectName-test/karma.conf.js` 找到該檔案。 
若要對 Karma 使用的配置進行調整，請將您的額外配置檔案放置在專案根目錄下名為 `karma.config.d` 的目錄中。此目錄中的所有 `.js` 配置檔案將會被自動讀取並在建置時合併到生成的 `karma.conf.js` 中。

所有 Karma 配置功能在其[文件](https://karma-runner.github.io/5.0/config/configuration-file.html)中都有詳細說明。

## webpack 綁定

對於瀏覽器目標，Kotlin Multiplatform Gradle 插件使用廣為人知的 [webpack](https://webpack.js.org/) 模組綁定器。

### webpack 版本 

Kotlin Multiplatform 插件使用 webpack %webpackMajorVersion%。

如果您有使用早於 1.5.0 版本插件建立的專案，您可以透過將以下行新增到專案的 `gradle.properties` 中，暫時切換回這些版本中使用的 webpack %webpackPreviousMajorVersion%：

```none
kotlin.js.webpack.major.version=4
```

### webpack 任務

最常見的 webpack 調整可以直接透過 Gradle 建置檔案中的 `kotlin.js.browser.webpackTask {}` 配置區塊進行：
* `outputFileName` - 被 webpack 處理後的輸出檔案名稱。在執行 webpack 任務後，它將生成在 `<projectDir>/build/dist/<targetName>` 中。預設值為專案名稱。
* `output.libraryTarget` - 被 webpack 處理後的輸出的模組系統。了解更多關於[Kotlin/JS 專案可用的模組系統](js-modules.md)。預設值為 `umd`。
  
```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

您還可以在 `commonWebpackConfig {}` 區塊中配置用於綁定、執行和測試任務的通用 webpack 設定。

### webpack 配置檔案 

Kotlin Multiplatform Gradle 插件會在建置時自動生成一個標準的 webpack 配置檔案。它位於 `build/js/packages/projectName/webpack.config.js`。

如果您想進一步調整 webpack 配置，請將您的額外配置檔案放置在專案根目錄下名為 `webpack.config.d` 的目錄中。當建置您的專案時，所有 `.js` 配置檔案將會自動合併到 `build/js/packages/projectName/webpack.config.js` 檔案中。
例如，若要新增一個 [webpack loader](https://webpack.js.org/loaders/)，請將以下內容新增到 `webpack.config.d` 目錄中的 `.js` 檔案中：

> 在這種情況下，配置物件是全域的 `config` 物件。您需要在腳本中修改它。
>
{style="note"}

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

所有 webpack 配置功能在其[文件](https://webpack.js.org/concepts/configuration/)中都有詳細說明。

### 建置可執行檔

為了透過 webpack 建置可執行 JavaScript Artifacts，Kotlin Multiplatform Gradle 插件包含了 `browserDevelopmentWebpack` 和 `browserProductionWebpack` Gradle 任務。

* `browserDevelopmentWebpack` 任務建立開發 Artifacts，這些 Artifacts 體積較大，但建立所需時間較短。因此，在活躍開發期間請使用 `browserDevelopmentWebpack` 任務。

* `browserProductionWebpack` 任務會對生成的 Artifacts 應用死碼消除並壓縮生成的 JavaScript 檔案，這需要更多時間，但會生成體積更小的可執行檔。因此，在為您的專案準備生產環境使用時，請使用 `browserProductionWebpack` 任務。
 
執行這些任務中的任何一個，以獲取各自用於開發或生產的 Artifacts。生成的檔案將位於 `build/dist` 中，除非[另行指定](#distribution-target-directory)。

```bash
./gradlew browserProductionWebpack
```

請注意，這些任務僅在您的目標配置為生成可執行檔（透過 `binaries.executable()`）時才可用。

## CSS

Kotlin Multiplatform Gradle 插件還支援 webpack 的 [CSS](https://webpack.js.org/loaders/css-loader/) 和 [style](https://webpack.js.org/loaders/style-loader/) loader。雖然所有選項都可以透過直接修改用於建置專案的 [webpack 配置檔案](#webpack-bundling)來更改，但最常用的設定可以直接從 `build.gradle(.kts)` 檔案中取得。

若要在專案中開啟 CSS 支援，請在 Gradle 建置檔案的 `commonWebpackConfig {}` 區塊中設定 `cssSupport.enabled` 選項。使用精靈建立新專案時，此配置也預設啟用。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
browser {
    commonWebpackConfig {
        cssSupport {
            it.enabled = true
        }
    }
}
```

</tab>
</tabs>

或者，您可以為 `webpackTask {}`、`runTask {}` 和 `testTask {}` 獨立新增 CSS 支援：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
browser {
    webpackTask {
        cssSupport {
            enabled.set(true)
        }
    }
    runTask {
        cssSupport {
            enabled.set(true)
        }
    }
    testTask {
        useKarma {
            // ...
            webpackConfig.cssSupport {
                enabled.set(true)
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
browser {
    webpackTask {
        cssSupport {
            it.enabled = true
        }
    }
    runTask {
        cssSupport {
            it.enabled = true
        }
    }
    testTask {
        useKarma {
            // ...
            webpackConfig.cssSupport {
                it.enabled = true
            }
        }
    }
}
```

</tab>
</tabs>

在您的專案中啟用 CSS 支援有助於防止在嘗試使用來自未配置專案的樣式表時發生的常見錯誤，例如 `Module parse failed: Unexpected character '@' (14:0)`。

您可以使用 `cssSupport.mode` 來指定如何處理遇到的 CSS。以下值可用：

* `"inline"`（預設）：樣式會新增到全域 `<style>` 標籤中。
* `"extract"`：樣式會提取到單獨的檔案中。然後可以從 HTML 頁面中引入它們。
* `"import"`：樣式會被處理為字串。如果您需要從程式碼中存取 CSS（例如 `val styles = require("main.css")`），這會很有用。

若要針對同一專案使用不同的模式，請使用 `cssSupport.rules`。在這裡，您可以指定一個 `KotlinWebpackCssRules` 列表，每個規則都定義了一種模式，以及[包含](https://webpack.js.org/configuration/module/#ruleinclude)和[排除](https://webpack.js.org/configuration/module/#ruleexclude)模式。

## Node.js

對於針對 Node.js 的 Kotlin/JS 專案，該插件會自動在主機上下載並安裝 Node.js 環境。
如果您已有 Node.js 實例，也可以使用它。

### 配置 Node.js 設定

您可以為每個子專案配置 Node.js 設定，或為整個專案設定它們。

例如，若要為特定子專案設定 Node.js 版本，請將以下行新增到其 `build.gradle(.kts)` 檔案中的 Gradle 區塊：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</tab>
</tabs>

若要為整個專案（包括所有子專案）設定版本，請將相同的程式碼應用於 `allProjects {}` 區塊：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
allprojects {
    project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
        project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</tab>
</tabs>

> 使用 `NodeJsRootPlugin` 類別配置整個專案的 Node.js 設定已被棄用，並最終將停止支援。
> 
{style="note"}

### 使用預先安裝的 Node.js

如果 Node.js 已安裝在您建置 Kotlin/JS 專案的主機上，您可以配置 Kotlin Multiplatform Gradle 插件以使用它，而不是安裝其自己的 Node.js 實例。

若要使用預先安裝的 Node.js 實例，請將以下行新增到您的 `build.gradle(.kts)` 檔案中：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    // Set to `true` for default behavior
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().download = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    // Set to `true` for default behavior
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).download = false
}
```

</tab>
</tabs>

## Yarn

預設情況下，為了在建置時下載並安裝您宣告的相依性，該插件會管理自己的 [Yarn](https://yarnpkg.com/lang/en/) 套件管理器實例。它無需額外配置即可直接使用，但您可以調整它，或者使用您主機上已安裝的 Yarn。

### 其他 Yarn 功能：.yarnrc

若要配置其他 Yarn 功能，請將 `.yarnrc` 檔案放置在專案的根目錄中。
在建置時，它會被自動讀取。

例如，若要為 npm 套件使用自訂註冊表，請將以下行新增到專案根目錄中名為 `.yarnrc` 的檔案中：

```text
registry "http://my.registry/api/npm/"
```

若要了解更多關於 `.yarnrc` 的資訊，請造訪[官方 Yarn 文件](https://classic.yarnpkg.com/en/docs/yarnrc/)。

### 使用預先安裝的 Yarn

如果 Yarn 已安裝在您建置 Kotlin/JS 專案的主機上，您可以配置 Kotlin Multiplatform Gradle 插件以使用它，而不是安裝其自己的 Yarn 實例。

若要使用預先安裝的 Yarn 實例，請將以下行新增到 `build.gradle(.kts)`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
    // "true" for default behavior
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
}
 
```

</tab>
</tabs>

### 透過 kotlin-js-store 鎖定版本

> 透過 `kotlin-js-store` 鎖定版本自 Kotlin 1.6.10 起可用。
>
{style="note"}

專案根目錄中的 `kotlin-js-store` 目錄由 Kotlin Multiplatform Gradle 插件自動生成，用於存放 `yarn.lock` 檔案，該檔案對於版本鎖定是必需的。鎖定檔案完全由 Yarn 插件管理，並在執行 `kotlinNpmInstall` Gradle 任務期間更新。

為遵循[推薦做法](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，請將 `kotlin-js-store` 及其內容提交到您的版本控制系統。這確保您的應用程式在所有機器上都使用完全相同的相依性樹進行建置。

如有需要，您可以在 `build.gradle(.kts)` 中更改目錄和鎖定檔案名稱：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</tab>
</tabs>

> 更改鎖定檔案的名稱可能會導致相依性檢查工具不再讀取該檔案。
> 
{style="warning"}

若要了解更多關於 `yarn.lock` 的資訊，請造訪[官方 Yarn 文件](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)。

### 報告 yarn.lock 已更新

Kotlin/JS 提供了 Gradle 設定，可以在 `yarn.lock` 檔案更新時通知您。
當您希望在 CI 建置過程中 `yarn.lock` 被靜默更改時收到通知時，可以使用這些設定：

* `YarnLockMismatchReport`：指定如何報告對 `yarn.lock` 檔案的更改。您可以使用以下值之一：
    * `FAIL`：使相應的 Gradle 任務失敗。這是預設值。
    * `WARNING`：在警告日誌中寫入有關更改的資訊。
    * `NONE`：禁用報告。
* `reportNewYarnLock`：明確報告最近建立的 `yarn.lock` 檔案。預設情況下，此選項是禁用的：在首次啟動時生成新的 `yarn.lock` 檔案是一種常見做法。您可以使用此選項來確保該檔案已提交到您的儲存庫。
* `yarnLockAutoReplace`：每次執行 Gradle 任務時自動替換 `yarn.lock`。

若要使用這些選項，請按如下方式更新 `build.gradle(.kts)`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).reportNewYarnLock = false // true
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockAutoReplace = false // true
}
```

</tab>
</tabs>

### 預設情況下使用 --ignore-scripts 安裝 npm 相依性

> 預設情況下使用 `--ignore-scripts` 安裝 npm 相依性自 Kotlin 1.6.10 起可用。
>
{style="note"}

為了降低從受損 npm 套件執行惡意程式碼的可能性，Kotlin Multiplatform Gradle 插件預設會阻止在安裝 npm 相依性期間執行[生命週期腳本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。

您可以透過將以下行新增到 `build.gradle(.kts)` 中來明確啟用生命週期腳本執行：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> { 
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
```

</tab>
</tabs>

## 發行目標目錄

預設情況下，Kotlin/JS 專案建置的結果位於專案根目錄中的 `/build/dist/<targetName>/<binaryName>` 目錄下。

> 在 Kotlin 1.9.0 之前，預設的發行目標目錄是 `/build/distributions`。
>
{style="note" }

若要為專案發行檔案設定另一個位置，請在您的建置腳本中，於 `browser {}` 區塊內部新增一個 `distribution {}` 區塊，並使用 `set()` 方法為 `outputDirectory` 屬性賦值。
一旦您執行專案建置任務，Gradle 將會把輸出綁定（bundle）與專案資源一起儲存在此位置。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    js {
        browser {
            distribution {
                outputDirectory.set(projectDir.resolve("output"))
            }
        }
        binaries.executable()
        // ...
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    js {
        browser {
            distribution {
                outputDirectory = file("$projectDir/output")
            }
        }
        binaries.executable()
        // ...
    }
}
```

</tab>
</tabs>

## 模組名稱

若要調整 JavaScript _模組_（在 `build/js/packages/myModuleName` 中生成），包括相應的 `.js` 和 `.d.ts` 檔案的名稱，請使用 `outputModuleName` 選項：

```groovy
js {
    outputModuleName = "myModuleName"
}
```

請注意，這不會影響 `build/dist` 中的 webpack 輸出。

## package.json 自訂

`package.json` 檔案包含 JavaScript 套件的元數據。流行的套件註冊表（例如 npm）要求所有已發布的套件都必須有這樣一個檔案。它們使用此檔案來追蹤和管理套件發布。  

Kotlin Multiplatform Gradle 插件在建置時會自動為 Kotlin/JS 專案生成 `package.json`。預設情況下，該檔案包含基本資料：名稱、版本、許可證、相依性以及其他一些套件屬性。

除了基本的套件屬性之外，`package.json` 還可以定義 JavaScript 專案應如何行為，例如，識別可執行的腳本。

您可以透過 Gradle DSL 向專案的 `package.json` 新增自訂條目。若要為您的 `package.json` 新增自訂欄位，請在編譯的 `packageJson` 區塊中使用 `customField()` 函式：

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

當您建置專案時，此程式碼會將以下區塊新增到 `package.json` 檔案中：

```json
"hello": {
    "one": 1,
    "two": 2
}
```

在 [npm 文件](https://docs.npmjs.com/cli/v6/configuring-npm/package-json)中了解更多關於為 npm 註冊表編寫 `package.json` 檔案的資訊。