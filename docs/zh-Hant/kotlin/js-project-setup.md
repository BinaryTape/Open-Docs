[//]: # (title: 設定 Kotlin/JS 專案)

Kotlin/JS 專案使用 Gradle 作為建置系統。為了讓開發人員輕鬆管理他們的 Kotlin/JS 專案，我們提供了 `kotlin.multiplatform` Gradle 外掛程式，該外掛程式提供專案組態工具以及輔助任務，用於自動化 JavaScript 開發中常見的例行程序。

此外掛程式使用 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/) 套件管理器在背景下載 npm 依賴項，並使用 [webpack](https://webpack.js.org/) 從 Kotlin 專案建置 JavaScript 捆綁包。依賴項管理和組態調整在很大程度上可以直接從 Gradle 建置檔中完成，並可選擇覆寫自動生成的組態以實現完全控制。

您可以手動將 `org.jetbrains.kotlin.multiplatform` 外掛程式應用到 Gradle 專案的 `build.gradle(.kts)` 檔案中：

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

Kotlin 多平台 Gradle 外掛程式讓您可以在建置腳本的 `kotlin {}` 區塊中管理專案的各個方面：

```groovy
kotlin {
    // ...
}
```

在 `kotlin {}` 區塊內，您可以管理以下方面：

*   [目標執行環境](#execution-environments)：瀏覽器或 Node.js
*   [支援 ES2015 功能](#support-for-es2015-features)：類別、模組和產生器
*   [專案依賴項](#dependencies)：Maven 和 npm
*   [執行組態](#run-task)
*   [測試組態](#test-task)
*   [捆綁](#webpack-bundling)和 [CSS 支援](#css)（適用於瀏覽器專案）
*   [目標目錄](#distribution-target-directory)和[模組名稱](#module-name)
*   [專案的 `package.json` 檔案](#package-json-customization)

## 執行環境

Kotlin/JS 專案可以針對兩種不同的執行環境：

*   瀏覽器：用於瀏覽器中的客戶端腳本
*   [Node.js](https://nodejs.org/)：用於在瀏覽器外部執行 JavaScript 程式碼，例如用於伺服器端腳本。

要為 Kotlin/JS 專案定義目標執行環境，請在 `js {}` 區塊內添加 `browser {}` 或 `nodejs {}`：

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

指令 `binaries.executable()` 明確指示 Kotlin 編譯器發出可執行 `.js` 檔案。省略 `binaries.executable()` 將導致編譯器僅產生 Kotlin 內部函式庫檔案，這些檔案可以從其他專案中使用，但無法獨立執行。

> 這通常比建立可執行檔案更快，並且在處理專案中的非葉模組時，這可能是一種最佳化方式。
>
{style="tip"}

Kotlin 多平台外掛程式會自動組態其任務，以配合選定的環境工作。這包括下載和安裝執行和測試應用程式所需的環境和依賴項。這使得開發人員可以無需額外組態即可建置、執行和測試簡單的專案。對於針對 Node.js 的專案，也可以選擇使用現有的 Node.js 安裝。了解如何[使用預安裝的 Node.js](#use-pre-installed-node-js)。

## 支援 ES2015 功能

Kotlin 提供對以下 ES2015 功能的[實驗性](components-stability.md#stability-levels-explained)支援：

*   模組：簡化程式碼庫並提高可維護性。
*   類別：允許融入物件導向程式設計 (OOP) 原則，使程式碼更清晰、更直觀。
*   產生器：用於編譯[掛起函式](composing-suspending-functions.md)，可改善最終捆綁包大小並有助於偵錯。

您可以透過將 `es2015` 編譯目標新增到 `build.gradle(.kts)` 檔案中，一次性啟用所有支援的 ES2015 功能：

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        target = "es2015"
    }
}
```

[在官方文件中了解更多關於 ES2015 (ECMAScript 2015, ES6) 的資訊](https://262.ecma-international.org/6.0/)。

## 依賴項

如同其他 Gradle 專案一樣，Kotlin/JS 專案支援在建置腳本的 `dependencies {}` 區塊中[傳統的 Gradle 依賴項宣告](https://docs.gradle.org/current/userguide/declaring_dependencies.html)：

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

Kotlin 多平台 Gradle 外掛程式也支援在建置腳本的 `kotlin {}` 區塊中為特定來源集宣告依賴項：

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

> 並非所有 Kotlin 程式語言可用的函式庫在目標為 JavaScript 時都可用：只有包含 Kotlin/JS 構件 (Artifact) 的函式庫才能使用。
>
{style="note"}

如果您添加的函式庫依賴於 [npm 中的套件](#npm-dependencies)，Gradle 也會自動解析這些傳遞性依賴項。

### Kotlin 標準函式庫

對[標準函式庫](https://kotlinlang.org/api/latest/jvm/stdlib/index.html)的依賴項會自動添加。標準函式庫的版本與 Kotlin 多平台外掛程式的版本相同。

對於多平台測試，[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 可用。當您建立多平台專案時，您可以透過在 `commonTest` 中使用單一依賴項，將測試依賴項添加到所有來源集：

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

### npm 依賴項

在 JavaScript 世界中，最常見的依賴項管理方式是 [npm](https://www.npmjs.com/)。它提供了最大的 JavaScript 模組公共儲存庫。

Kotlin 多平台 Gradle 外掛程式讓您可以在 Gradle 建置腳本中宣告 npm 依賴項，就像您宣告任何其他依賴項一樣。

要宣告 npm 依賴項，請在其宣告中將其名稱和版本傳遞給 `npm()` 函式。您還可以根據 [npm 的 semver 語法](https://docs.npmjs.com/about-semantic-versioning)指定一個或多個版本範圍。

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

預設情況下，此外掛程式使用單獨的 [Yarn](https://yarnpkg.com/lang/en/) 套件管理器實例來下載和安裝 npm 依賴項。它無需額外組態即可開箱即用，但您可以[根據特定需求進行調整](#yarn)。

您也可以直接使用 [npm](https://www.npmjs.com/) 套件管理器來處理 npm 依賴項。要將 npm 作為您的套件管理器，請在 `gradle.properties` 檔案中設定以下屬性：

```none
kotlin.js.yarn=false
```

除了常規依賴項之外，還有三種其他類型的依賴項可以從 Gradle DSL 中使用。要了解何時最好使用每種依賴項類型，請參考 npm 連結的官方文件：

*   [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)，透過 `devNpm(...)`，
*   [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies)，透過 `optionalNpm(...)`，以及
*   [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies)，透過 `peerNpm(...)`。

一旦安裝了 npm 依賴項，您就可以在程式碼中使用其 API，如[從 Kotlin 呼叫 JS](js-interop.md) 中所述。

## run 任務

Kotlin 多平台 Gradle 外掛程式提供了一個 `jsBrowserDevelopmentRun` 任務，讓您可以無需額外組態即可執行純 Kotlin/JS 專案。

對於在瀏覽器中執行 Kotlin/JS 專案，此任務是 `browserDevelopmentRun` 任務的別名（該任務在 Kotlin 多平台專案中也可用）。它使用 [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) 來提供您的 JavaScript 構件 (Artifact)。如果您想自訂 `webpack-dev-server` 使用的組態，例如調整伺服器運行的連接埠，請使用 [webpack 組態檔](#webpack-bundling)。

對於執行針對 Node.js 的 Kotlin/JS 專案，請使用 `jsNodeDevelopmentRun` 任務，它是 `nodeRun` 任務的別名。

要執行專案，請執行標準生命週期 `jsBrowserDevelopmentRun` 任務，或其對應的別名：

```bash
./gradlew jsBrowserDevelopmentRun
```

要在更改原始碼檔案後自動觸發應用程式的重新建置，請使用 Gradle 的[持續建置](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build)功能：

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

或

```bash
./gradlew jsBrowserDevelopmentRun -t
```

一旦您的專案建置成功，`webpack-dev-server` 將自動重新整理瀏覽器頁面。

## test 任務

Kotlin 多平台 Gradle 外掛程式會自動為專案設定測試基礎設施。對於瀏覽器專案，它會下載並安裝 [Karma](https://karma-runner.github.io/) 測試執行器及其他所需依賴項；對於 Node.js 專案，則使用 [Mocha](https://mochajs.org/) 測試框架。

此外掛程式還提供實用的測試功能，例如：

*   原始碼映射 (Source Maps) 生成
*   測試報告生成
*   在控制台中顯示測試執行結果

預設情況下，對於執行瀏覽器測試，此外掛程式使用 [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)。您也可以選擇其他瀏覽器來執行測試，方法是在建置腳本的 `useKarma {}` 區塊中添加相應的條目：

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

或者，您可以在 `gradle.properties` 檔案中為瀏覽器添加測試目標：

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

這種方法允許您為所有模組定義瀏覽器列表，然後在特定模組的建置腳本中添加特定的瀏覽器。

請注意，Kotlin 多平台 Gradle 外掛程式不會自動為您安裝這些瀏覽器，而只使用其執行環境中可用的瀏覽器。例如，如果您在持續整合伺服器上執行 Kotlin/JS 測試，請確保已安裝您要測試的瀏覽器。

如果您想跳過測試，請將行 `enabled = false` 添加到 `testTask {}` 中：

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

要執行測試，請執行標準生命週期 `check` 任務：

```bash
./gradlew check
```

要指定 Node.js 測試執行器使用的環境變數（例如，將外部資訊傳遞給您的測試，或微調套件解析），請在建置腳本的 `testTask {}` 區塊內使用 `environment()` 函式和鍵值對：

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

### Karma 組態

Kotlin 多平台 Gradle 外掛程式會在建置時自動生成 Karma 組態檔，其中包含您在 `build.gradle(.kts)` 中 [`kotlin.js.browser.testTask.useKarma {}` 區塊](#test-task)的設定。您可以在 `build/js/packages/projectName-test/karma.conf.js` 找到該檔案。要調整 Karma 使用的組態，請將您的額外組態檔放置在專案根目錄下名為 `karma.config.d` 的目錄中。此目錄中的所有 `.js` 組態檔都將被選取並在建置時自動合併到生成的 `karma.conf.js` 中。

所有 Karma 組態功能在 Karma 的[文件](https://karma-runner.github.io/5.0/config/configuration-file.html)中都有詳細說明。

## webpack 捆綁

對於瀏覽器目標，Kotlin 多平台 Gradle 外掛程式使用廣為人知的 [webpack](https://webpack.js.org/) 模組捆綁器。

### webpack 版本

Kotlin 多平台外掛程式使用 webpack %webpackMajorVersion%。

如果您有用早於 1.5.0 版本的外掛程式建立的專案，您可以透過在專案的 `gradle.properties` 中添加以下行，暫時切換回這些版本中使用的 webpack %webpackPreviousMajorVersion%：

```none
kotlin.js.webpack.major.version=4
```

### webpack 任務

最常見的 webpack 調整可以直接透過 Gradle 建置檔案中的 `kotlin.js.browser.webpackTask {}` 組態區塊進行：
*   `outputFileName` - webpacked 輸出檔案的名稱。它將在 webpack 任務執行後在 `<projectDir>/build/dist/<targetName>` 中生成。預設值是專案名稱。
*   `output.libraryTarget` - webpacked 輸出的模組系統。了解更多關於 [Kotlin/JS 專案可用的模組系統](js-modules.md)。預設值為 `umd`。

```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

您還可以在 `commonWebpackConfig {}` 區塊中組態捆綁、執行和測試任務中使用的通用 webpack 設定。

### webpack 組態檔

Kotlin 多平台 Gradle 外掛程式會在建置時自動生成一個標準的 webpack 組態檔。它位於 `build/js/packages/projectName/webpack.config.js`。

如果您想對 webpack 組態進行進一步調整，請將您的額外組態檔放置在專案根目錄下名為 `webpack.config.d` 的目錄中。在建置您的專案時，所有 `.js` 組態檔都將自動合併到 `build/js/packages/projectName/webpack.config.js` 檔案中。例如，要添加新的 [webpack 載入器 (Loader)](https://webpack.js.org/loaders/)，請將以下內容添加到 `webpack.config.d` 目錄內的一個 `.js` 檔案中：

> 在這種情況下，組態物件是 `config` 全域物件。您需要在您的腳本中修改它。
>
{style="note"}

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

所有 webpack 組態功能在其[文件](https://webpack.js.org/concepts/configuration/)中都有詳細說明。

### 建置可執行檔

為了透過 webpack 建置可執行 JavaScript 構件 (Artifact)，Kotlin 多平台 Gradle 外掛程式包含 `browserDevelopmentWebpack` 和 `browserProductionWebpack` 這兩個 Gradle 任務。

*   `browserDevelopmentWebpack` 會建立開發構件 (Artifact)，它們體積較大，但建立所需時間較短。因此，在積極開發期間使用 `browserDevelopmentWebpack` 任務。

*   `browserProductionWebpack` 會對生成的構件 (Artifact) 應用死程式碼消除並壓縮生成的 JavaScript 檔案，這需要更多時間，但生成的可執行檔體積較小。因此，在準備專案用於生產環境時使用 `browserProductionWebpack` 任務。

執行這些任務中的任何一個，以獲取用於開發或生產的相應構件 (Artifact)。生成的檔案將在 `build/dist` 中，除非[另行指定](#distribution-target-directory)。

```bash
./gradlew browserProductionWebpack
```

請注意，這些任務只有在您的目標被組態為生成可執行檔案（透過 `binaries.executable()`）時才可用。

## CSS

Kotlin 多平台 Gradle 外掛程式還支援 webpack 的 [CSS](https://webpack.js.org/loaders/css-loader/) 和 [style](https://webpack.js.org/loaders/style-loader/) 載入器 (Loader)。雖然所有選項都可以透過直接修改用於建置專案的 [webpack 組態檔](#webpack-bundling)來更改，但最常用的設定可以直接從 `build.gradle(.kts)` 檔案中取得。

要在專案中啟用 CSS 支援，請在 Gradle 建置檔案的 `commonWebpackConfig {}` 區塊中設定 `cssSupport.enabled` 選項。透過精靈建立新專案時，此組態也預設為啟用。

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

或者，您可以為 `webpackTask {}`、`runTask {}` 和 `testTask {}` 獨立添加 CSS 支援：

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

在您的專案中啟用 CSS 支援有助於防止在使用來自未組態專案的樣式表時發生的常見錯誤，例如 `Module parse failed: Unexpected character '@' (14:0)`。

您可以使用 `cssSupport.mode` 來指定如何處理遇到的 CSS。以下值可用：

*   `"inline"`（預設）：樣式被添加到全域 `<style>` 標籤中。
*   `"extract"`：樣式被提取到單獨的檔案中。然後可以從 HTML 頁面中包含它們。
*   `"import"`：樣式作為字串處理。如果您需要從程式碼中存取 CSS（例如 `val styles = require("main.css")`），這將很有用。

要在同一個專案中使用不同的模式，請使用 `cssSupport.rules`。在這裡，您可以指定一個 `KotlinWebpackCssRules` 列表，每個規則定義一個模式，以及[包含](https://webpack.js.org/configuration/module/#ruleinclude)和[排除](https://webpack.js.org/configuration/module/#ruleexclude)模式。

## Node.js

對於針對 Node.js 的 Kotlin/JS 專案，此外掛程式會自動在主機上下載並安裝 Node.js 環境。您也可以使用現有的 Node.js 實例，如果您有它。

### 組態 Node.js 設定

您可以為每個子專案組態 Node.js 設定，或將其設定為整個專案的設定。

例如，要為特定子專案設定 Node.js 版本，請將以下行添加到其 `build.gradle(.kts)` 檔案中的 Gradle 區塊中：

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

要為整個專案（包括所有子專案）設定版本，請將相同的程式碼應用於 `allProjects {}` 區塊：

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

> 使用 `NodeJsRootPlugin` 類別來組態整個專案的 Node.js 設定已棄用，並最終將停止支援。
>
{style="note"}

### 使用預安裝的 Node.js

如果 Node.js 已安裝在您建置 Kotlin/JS 專案的主機上，您可以組態 Kotlin 多平台 Gradle 外掛程式來使用它，而不是安裝自己的 Node.js 實例。

要使用預安裝的 Node.js 實例，請將以下行添加到您的 `build.gradle(.kts)` 檔案中：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    // Set to `true` for default behavior
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).download = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    // Set to `true` for default behavior
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().download = false
}
```

</tab>
</tabs>

## Yarn

預設情況下，為了在建置時下載並安裝您宣告的依賴項，此外掛程式會管理它自己的 [Yarn](https://yarnpkg.com/lang/en/) 套件管理器實例。它無需額外組態即可開箱即用，但您可以對其進行調整，或使用主機上已安裝的 Yarn。

### 額外 Yarn 功能：.yarnrc

要組態額外的 Yarn 功能，請將 `.yarnrc` 檔案放置在專案的根目錄中。在建置時，它會自動被選取。

例如，要為 npm 套件使用自訂註冊表 (Registry)，請將以下行添加到專案根目錄下名為 `.yarnrc` 的檔案中：

```text
registry "http://my.registry/api/npm/"
```

要了解更多關於 `.yarnrc` 的資訊，請造訪[官方 Yarn 文件](https://classic.yarnpkg.com/en/docs/yarnrc/)。

### 使用預安裝的 Yarn

如果 Yarn 已安裝在您建置 Kotlin/JS 專案的主機上，您可以組態 Kotlin 多平台 Gradle 外掛程式來使用它，而不是安裝自己的 Yarn 實例。

要使用預安裝的 Yarn 實例，請將以下行添加到 `build.gradle(.kts)` 中：

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

### 透過 kotlin-js-store 進行版本鎖定

> 透過 `kotlin-js-store` 進行版本鎖定自 Kotlin 1.6.10 起可用。
>
{style="note"}

專案根目錄中的 `kotlin-js-store` 目錄是由 Kotlin 多平台 Gradle 外掛程式自動生成的，用於存放 `yarn.lock` 檔案，這是版本鎖定所必需的。鎖定檔完全由 Yarn 外掛程式管理，並在執行 `kotlinNpmInstall` Gradle 任務期間更新。

為了遵循[推薦的做法](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，請將 `kotlin-js-store` 及其內容提交到您的版本控制系統中。這確保了您的應用程式在所有機器上都使用完全相同的依賴項樹進行建置。

如果需要，您可以在 `build.gradle(.kts)` 中更改目錄和鎖定檔名稱：

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

> 更改鎖定檔的名稱可能會導致依賴項檢查工具不再識別該檔案。
>
{style="warning"}

要了解更多關於 `yarn.lock` 的資訊，請造訪[官方 Yarn 文件](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)。

### 報告 yarn.lock 已更新

> Kotlin/JS 提供了 Gradle 設定，可以在 `yarn.lock` 檔案更新時通知您。
>
> 當您希望在 CI 建置過程中 `yarn.lock` 被靜默更改時收到通知，可以使用這些設定：

*   `YarnLockMismatchReport`，用於指定 `yarn.lock` 檔案的變更如何報告。您可以使用以下值之一：
    *   `FAIL`：使相應的 Gradle 任務失敗。這是預設值。
    *   `WARNING`：將變更資訊寫入警告日誌中。
    *   `NONE`：禁用報告。
*   `reportNewYarnLock`：明確報告最近建立的 `yarn.lock` 檔案。預設情況下，此選項已禁用：在首次啟動時生成新的 `yarn.lock` 檔案是常見做法。您可以使用此選項來確保該檔案已提交到您的儲存庫 (Repository)。
*   `yarnLockAutoReplace`：每次執行 Gradle 任務時自動替換 `yarn.lock`。

要使用這些選項，請更新 `build.gradle(.kts)` 如下：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) {
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

### 預設情況下安裝帶有 --ignore-scripts 的 npm 依賴項

> 預設情況下安裝帶有 `--ignore-scripts` 的 npm 依賴項自 Kotlin 1.6.10 起可用。
>
{style="note"}

為了降低從受損 npm 套件執行惡意程式碼的可能性，Kotlin 多平台 Gradle 外掛程式預設情況下會阻止在安裝 npm 依賴項期間執行[生命週期腳本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。

您可以透過將以下行添加到 `build.gradle(.kts)` 中來明確啟用生命週期腳本執行：

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

## 發布目標目錄

預設情況下，Kotlin/JS 專案建置的結果位於專案根目錄中的 `/build/dist/<targetName>/<binaryName>` 目錄下。

> 在 Kotlin 1.9.0 之前，預設的發布目標目錄是 `/build/distributions`。
>
{style="note" }

要在建置腳本的 `browser {}` 區塊中為專案發布檔案設定另一個位置，請添加一個 `distribution {}` 區塊並使用 `set()` 方法為 `outputDirectory` 屬性賦值。一旦您運行專案建置任務，Gradle 會將輸出捆綁包連同專案資源一起儲存到此位置。

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

要調整 JavaScript _模組_（在 `build/js/packages/myModuleName` 中生成）的名稱，包括相應的 `.js` 和 `.d.ts` 檔案，請使用 `moduleName` 選項：

```groovy
js {
    moduleName = "myModuleName"
}
```

請注意，這不會影響 `build/dist` 中的 webpacked 輸出。

## package.json 自訂

`package.json` 檔案包含 JavaScript 套件的中繼資料 (Metadata)。像 npm 這樣的熱門套件註冊表 (Registry) 要求所有發布的套件都必須有這樣一個檔案。它們使用此檔案來追蹤和管理套件發布。

Kotlin 多平台 Gradle 外掛程式會在建置時自動為 Kotlin/JS 專案生成 `package.json`。預設情況下，該檔案包含基本資料：名稱、版本、許可證、依賴項以及其他一些套件屬性。

除了基本的套件屬性之外，`package.json` 還可以定義 JavaScript 專案應如何行為，例如，識別可執行的腳本。

您可以透過 Gradle DSL 向專案的 `package.json` 添加自訂條目。要向您的 `package.json` 添加自訂欄位，請在編譯的 `packageJson` 區塊中使用 `customField()` 函式：

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

當您建置專案時，此程式碼會將以下區塊添加到 `package.json` 檔案中：

```json
"hello": {
    "one": 1,
    "two": 2
}
```

在 [npm 文件](https://docs.npmjs.com/cli/v6/configuring-npm/package-json)中了解更多關於為 npm 註冊表 (Registry) 編寫 `package.json` 檔案的資訊。