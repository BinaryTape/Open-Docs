---
title: "建立 Kotlin/JS 專案"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin/JS 專案使用 Gradle 作為建置系統 (build system)。為了讓開發者能輕鬆管理他們的 Kotlin/JS 專案，我們提供了 `kotlin.multiplatform` Gradle 插件，此插件提供了專案組態工具，以及用於自動化 JavaScript 開發常見例行程序的輔助任務 (helper task)。

此插件會在背景使用 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/) 套件管理器下載 npm 依賴項，並使用 [webpack](https://webpack.js.org/) 從 Kotlin 專案建置 JavaScript 捆綁包 (bundle)。依賴項管理和組態調整的大部分可以直接從 Gradle 建置檔案進行，並可選擇覆寫自動產生的組態以獲得完全控制。

您可以在 `build.gradle(.kts)` 檔案中手動將 `org.jetbrains.kotlin.multiplatform` 插件應用於 Gradle 專案：

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

Kotlin Multiplatform Gradle 插件可讓您在建置腳本的 `kotlin {}` 區塊中管理專案的各個方面：

```groovy
kotlin {
    // ...
}
```

在 `kotlin {}` 區塊內，您可以管理以下各個方面：

* [目標執行環境](#execution-environments)：瀏覽器或 Node.js
* [對 ES2015 功能的支援](#support-for-es2015-features)：類別 (classes)、模組 (modules) 和產生器 (generators)
* [專案依賴項](#dependencies)：Maven 和 npm
* [執行組態](#run-task)
* [測試組態](#test-task)
* 瀏覽器專案的 [捆綁 (bundling)](#webpack-bundling) 和 [CSS 支援](#css)
* [目標目錄](#distribution-target-directory) 和 [模組名稱](#module-name)
* 專案的 [`package.json` 檔案](#package-json-customization)

## 執行環境

Kotlin/JS 專案可以針對兩種不同的執行環境：

* 用於瀏覽器中客戶端腳本的瀏覽器
* [Node.js](https://nodejs.org/) 用於在瀏覽器之外執行 JavaScript 程式碼，例如，用於伺服器端腳本。

若要定義 Kotlin/JS 專案的目標執行環境，請新增包含 `browser {}` 或 `nodejs {}` 的 `js {}` 區塊：

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

指令 `binaries.executable()` 明確指示 Kotlin 編譯器發出可執行 `.js` 檔案。
省略 `binaries.executable()` 將導致編譯器僅產生 Kotlin 內部函式庫檔案，這些檔案可以從其他專案中使用，但無法自行執行。

:::note
這通常比建立可執行檔案更快，
並且在處理專案的非葉模組時，可以作為一種可能的最佳化方式。

Kotlin Multiplatform 插件會自動組態其任務，以便與選定的環境搭配使用。
這包括下載並安裝執行和測試應用程式所需的環境和依賴項。
這讓開發者無需額外組態即可建置、執行和測試簡單的專案。對於以 Node.js 為目標的專案，還可以選擇使用現有的 Node.js 安裝。瞭解如何[使用預先安裝的 Node.js](#use-pre-installed-node-js)。

## 對 ES2015 功能的支援

Kotlin 提供對以下 ES2015 功能的 [Experimental](components-stability#stability-levels-explained) 支援：

* 簡化程式碼庫並提高可維護性的模組 (Modules)。
* 允許整合 OOP 原則的類別 (Classes)，從而產生更簡潔、更直觀的程式碼。
* 用於編譯 [暫停函式](composing-suspending-functions) 的產生器 (Generators)，可改善最終捆綁包大小並協助進行偵錯。

您可以透過將 `es2015` 編譯目標新增至 `build.gradle(.kts)` 檔案，一次啟用所有支援的 ES2015 功能：

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        target = "es2015"
    }
}
```

[在官方文件中瞭解更多關於 ES2015 (ECMAScript 2015, ES6) 的資訊](https://262.ecma-international.org/6.0/)。

## 依賴項

與任何其他 Gradle 專案一樣，Kotlin/JS 專案支援在建置腳本的 `dependencies {}` 區塊中使用傳統的 Gradle [依賴項宣告](https://docs.gradle.org/current/userguide/declaring_dependencies.html)：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation("org.example.myproject", "1.1.0")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation 'org.example.myproject:1.1.0'
}
```

</TabItem>
</Tabs>

Kotlin Multiplatform Gradle 插件也支援在建置腳本的 `kotlin {}` 區塊中，針對特定來源集 (source set) 進行依賴項宣告：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

並非所有適用於 Kotlin 程式語言的函式庫都可以在以 JavaScript 為目標時使用：只有包含 Kotlin/JS 成品的函式庫才能使用。

:::

如果您新增的函式庫依賴於 [npm 中的套件](#npm-dependencies)，Gradle 也會自動解析這些傳遞依賴項。

### Kotlin 標準函式庫

系統會自動新增對[標準函式庫](https://kotlinlang.org/api/latest/jvm/stdlib/index.html)的依賴項。標準函式庫的版本與 Kotlin Multiplatform 插件的版本相同。

對於多平台測試，可以使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API。當您建立多平台專案時，可以使用 `commonTest` 中的單個依賴項，將測試依賴項新增至所有來源集：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // Brings all the platform dependencies automatically
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

### npm 依賴項

在 JavaScript 世界中，管理依賴項最常見的方式是 [npm](https://www.npmjs.com/)。
它提供了最大的 JavaScript 模組公共儲存庫。

Kotlin Multiplatform Gradle 插件可讓您在 Gradle 建置腳本中宣告 npm 依賴項，就像宣告任何其他依賴項一樣。

若要宣告 npm 依賴項，請將其名稱和版本傳遞給依賴項宣告中的 `npm()` 函式。
您也可以根據 [npm 的 semver 語法](https://docs.npmjs.com/about-semantic-versioning) 指定一個或多個版本範圍。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation(npm("react", "> 14.0.0 &lt;=16.9.0"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation npm('react', '> 14.0.0 &lt;=16.9.0')
}
```

</TabItem>
</Tabs>

預設情況下，此插件會使用 [Yarn](https://yarnpkg.com/lang/en/) 套件管理器的單獨實例來下載和安裝 npm 依賴項。
它可以直接使用，無需額外組態，但您可以[根據特定需求進行調整](#yarn)。

您也可以直接使用 [npm](https://www.npmjs.com/) 套件管理器來處理 npm 依賴項。
若要使用 npm 作為您的套件管理器，請在 `gradle.properties` 檔案中設定以下屬性：

```none
kotlin.js.yarn=false
```

除了常規依賴項之外，還有三種類型的依賴項可以從 Gradle DSL 中使用。
若要瞭解更多關於何時最適合使用每種類型的依賴項的資訊，請參閱 npm 連結的官方文件：

* [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)，透過 `devNpm(...)`，
* [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies) 透過 `optionalNpm(...)`，以及
* [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies) 透過 `peerNpm(...)`。

安裝 npm 依賴項後，您就可以按照 [從 Kotlin 呼叫 JS](js-interop) 中的描述，在您的程式碼中使用其 API。

## run 任務

Kotlin Multiplatform Gradle 插件提供了一個 `jsBrowserDevelopmentRun` 任務，可讓您執行純 Kotlin/JS 專案，而無需額外組態。

若要在瀏覽器中執行 Kotlin/JS 專案，此任務是 `browserDevelopmentRun` 任務的別名 (在 Kotlin 多平台專案中也可用)。它使用 [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) 來提供您的 JavaScript 成品。
如果您想要自訂 `webpack-dev-server` 使用的組態，例如，調整伺服器執行的連接埠，請使用 [webpack 組態檔案](#webpack-bundling)。

若要執行以 Node.js 為目標的 Kotlin/JS 專案，請使用 `jsNodeDevelopmentRun` 任務，該任務是 `nodeRun` 任務的別名。

若要執行專案，請執行標準生命週期 `jsBrowserDevelopmentRun` 任務，或其對應的別名：

```bash
./gradlew jsBrowserDevelopmentRun
```

若要在變更原始檔後自動觸發應用程式的重新建置，請使用 Gradle [持續建置](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) 功能：

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

或

```bash
./gradlew jsBrowserDevelopmentRun -t
```

專案建置成功後，`webpack-dev-server` 會自動重新整理瀏覽器頁面。

## test 任務

Kotlin Multiplatform Gradle 插件會自動為專案設定測試基礎結構。對於瀏覽器專案，它會下載並安裝 [Karma](https://karma-runner.github.io/) 測試執行器以及其他必要的依賴項；對於 Node.js 專案，則使用 [Mocha](https://mochajs.org/) 測試框架。

此插件還提供實用的測試功能，例如：

* 來源對應產生
* 測試報告產生
* 主控台中顯示測試執行結果

若要執行瀏覽器測試，此插件預設會使用 [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README)。您也可以選擇其他瀏覽器來執行測試，方法是在建置腳本的 `useKarma {}` 區塊中新增相應的條目：

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

或者，您也可以在 `gradle.properties` 檔案中新增瀏覽器的測試目標：

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

這種方法可讓您為所有模組定義瀏覽器清單，然後在特定模組的建置腳本中新增特定瀏覽器。

請注意，Kotlin Multiplatform Gradle 插件不會自動為您安裝這些瀏覽器，而只會使用在其執行環境中可用的瀏覽器。如果您在持續整合伺服器上執行 Kotlin/JS 測試，例如，請確保已安裝您要測試的瀏覽器。

如果您想要跳過測試，請將 `enabled = false` 行新增至 `testTask {}`：

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

若要指定 Node.js 測試執行器使用的環境變數 (例如，將外部資訊傳遞給您的測試，或微調套件解析)，請在建置腳本的 `testTask {}` 區塊中使用帶有鍵值對的 `environment()` 函式：

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

Kotlin Multiplatform Gradle 插件會在建置時自動產生 Karma 組態檔案，其中包含 `build.gradle(.kts)` 中 [`kotlin.js.browser.testTask.useKarma {}` 區塊](#test-task)中的設定。您可以在 `build/js/packages/projectName-test/karma.conf.js` 中找到該檔案。
若要調整 Karma 使用的組態，請將其他組態檔案放在專案根目錄中名為 `karma.config.d` 的目錄中。此目錄中的所有 `.js` 組態檔案都會被提取，並在建置時自動合併到產生的 `karma.conf.js` 中。

所有 Karma 組態功能都在 Karma 的[文件](https://karma-runner.github.io/5.0/config/configuration-file.html)中得到了很好的描述。

## webpack 捆綁 (bundling)

對於瀏覽器目標，Kotlin Multiplatform Gradle 插件使用廣為人知的 [webpack](https://webpack.js.org/) 模組捆綁器。

### webpack 版本

Kotlin Multiplatform 插件使用 webpack 5。

如果您有使用 1.5.0 之前插件版本建立的專案，
您可以透過將以下程式碼行新增至專案的 `gradle.properties` 中，暫時切換回這些版本中使用的 webpack 4：

```none
kotlin.js.webpack.major.version=4
```

### webpack 任務

最常見的 webpack 調整可以直接透過 Gradle 建置檔案中的
`kotlin.js.browser.webpackTask {}` 組態區塊進行：
* `outputFileName` - webpack 輸出檔案的名稱。在執行 webpack 任務後，它將在 `<projectDir>/build/dist/<targetName>` 中產生。預設值是專案名稱。
* `output.libraryTarget` - webpack 輸出的模組系統。瞭解更多關於 [Kotlin/JS 專案可用的模組系統](js-modules)的資訊。預設值為 `umd`。
  
```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

您也可以在 `commonWebpackConfig {}` 區塊中組態用於捆綁、執行和測試任務的常見 webpack 設定。

### webpack 組態檔案

Kotlin Multiplatform Gradle 插件會在建置時自動產生標準 webpack 組態檔案。
它位於 `build/js/packages/projectName/webpack.config.js` 中。

如果您想要對 webpack 組態進行進一步調整，請將其他組態檔案放在專案根目錄中名為 `webpack.config.d` 的目錄中。在建置專案時，所有 `.js` 組態檔案都會自動合併到 `build/js/packages/projectName/webpack.config.js` 檔案中。
例如，若要新增新的 [webpack loader](https://webpack.js.org/loaders/)，請將以下程式碼新增至 `webpack.config.d` 目錄中的 `.js` 檔案：

:::note
在這種情況下，組態物件是 `config` 全域物件。您需要在您的腳本中修改它。

:::

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

所有 webpack 組態
功能都在其[文件](https://webpack.js.org/concepts/configuration/)中得到了很好的描述。

### 建置可執行檔

為了透過 webpack 建置可執行的 JavaScript 成品，Kotlin Multiplatform Gradle 插件包含 `browserDevelopmentWebpack`
和 `browserProductionWebpack` Gradle 任務。

* `browserDevelopmentWebpack` 建立開發成品，這些成品體積較大，但建立時間很短。
因此，在主動開發期間使用 `browserDevelopmentWebpack` 任務。

* `browserProductionWebpack` 會將無效程式碼消除應用於產生的成品，並縮小產生的 JavaScript 檔案，這需要更多時間，但會產生體積更小的可執行檔。因此，在準備將專案用於生產用途時，請使用 `browserProductionWebpack` 任務。
 
 執行這些任務中的任何一個，以獲得開發或生產的相應成品。除非[另有指定](#distribution-target-directory)，否則產生的檔案將在 `build/dist` 中可用。

```bash
./gradlew browserProductionWebpack
```

請注意，只有在將您的目標組態為產生可執行檔案 (透過 `binaries.executable()`) 時，這些任務才可用。

## CSS

Kotlin Multiplatform Gradle 插件還支援 webpack 的 [CSS](https://webpack.js.org/loaders/css-loader/) 和
[樣式](https://webpack.js.org/loaders/style-loader/) 載入器。雖然可以透過直接修改用於建置專案的 [webpack 組態檔案](#webpack-bundling) 來變更所有選項，但最常用的設定可以直接從 `build.gradle(.kts)` 檔案中使用。

若要在您的專案中開啟 CSS 支援，請在 `commonWebpackConfig {}` 區塊中，於 Gradle 建置檔案中設定 `cssSupport.enabled` 選項。使用精靈建立新專案時，預設也會啟用此組態。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
browser {
    commonWebpackConfig {
        cssSupport {
            it.enabled = true
        }
    }
}
```

</TabItem>
</Tabs>

或者，您可以獨立地為 `webpackTask {}`、`runTask {}` 和 `testTask {}` 新增 CSS 支援：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

在您的專案中啟用 CSS 支援有助於防止嘗試從未組態的專案使用樣式表時發生的常見錯誤，例如 `Module parse failed: Unexpected character '@' (14:0)`。

您可以使用 `cssSupport.mode` 來指定應如何處理遇到的 CSS。以下值可用：

* `"inline"` (預設)：樣式會新增至全域 `<style>` 標籤。
* `"extract"`：樣式會提取到單獨的檔案中。然後可以從 HTML 頁面中包含這些樣式。
* `"import"`：樣式會作為字串處理。如果您需要從程式碼存取 CSS (例如 `val styles = require("main.css")`)，這可能會很有用。

若要為同一個專案使用不同的模式，請使用 `cssSupport.rules`。在這裡，您可以指定 `KotlinWebpackCssRules` 的清單，每個清單都定義一個模式，以及 [include](https://webpack.js.org/configuration/module/#ruleinclude) 和 [exclude](https://webpack.js.org/configuration/module/#ruleexclude) 模式。

## Node.js

對於以 Node.js 為目標的 Kotlin/JS 專案，此插件會自動在主機上下載並安裝 Node.js 環境。
如果您有現有的 Node.js 實例，也可以使用它。

### 組態 Node.js 設定

您可以為每個子專案組態 Node.js 設定，或為整個專案設定它們。

例如，若要為特定子專案設定 Node.js 版本，請將以下程式碼行新增至 `build.gradle(.kts)` 檔案中的 Gradle 區塊：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</TabItem>
</Tabs>

若要為整個專案 (包括所有子專案) 設定版本，請將相同的程式碼套用至 `allProjects {}` 區塊：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
allprojects {
    project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
        project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</TabItem>
</Tabs>

:::note
使用 `NodeJsRootPlugin` 類別為整個專案組態 Node.js 設定已被取代，最終將停止支援。

:::

### 使用預先安裝的 Node.js

如果 Node.js 已安裝在您建置 Kotlin/JS 專案的主機上，您可以將 Kotlin Multiplatform Gradle
插件組態為使用它，而不是安裝自己的 Node.js 實例。

若要使用預先安裝的 Node.js 實例，請將以下程式碼行新增至 `build.gradle(.kts)` 檔案：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    // Set to `true` for default behavior
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).download = false
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    // Set to `true` for default behavior
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().download = false
}
```

</TabItem>
</Tabs>

## Yarn

預設情況下，為了在建置時下載和安裝您宣告的依賴項，此插件會管理自己的 [Yarn](https://yarnpkg.com/lang/en/) 套件管理器實例。
它可以直接使用，無需額外組態，但您可以對其進行調整，或使用已安裝在您主機上的 Yarn。

### 其他 Yarn 功能：.yarnrc

若要組態其他 Yarn 功能，請將 `.yarnrc` 檔案放在專案的根目錄中。
在建置時，系統會自動提取它。

例如，若要為 npm 套件使用自訂登錄檔，請將以下程式碼行新增至專案根目錄中名為
`.yarnrc` 的檔案中：

```text
registry "http://my.registry/api/npm/"
```

若要瞭解更多關於 `.yarnrc` 的資訊，請造訪 [Yarn 官方文件](https://classic.yarnpkg.com/en/docs/yarnrc/)。

### 使用預先安裝的 Yarn

如果 Yarn 已安裝在您建置 Kotlin/JS 專案的主機上，您可以將 Kotlin Multiplatform Gradle
插件組態為使用它，而不是安裝自己的 Yarn 實例。

若要使用預先安裝的 Yarn 實例，請將以下程式碼行新增至 `build.gradle(.kts)`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
    // "true" for default behavior
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
}
 
```

</TabItem>
</Tabs>

### 透過 kotlin-js-store 進行版本鎖定

:::note
透過 `kotlin-js-store` 進行版本鎖定自 Kotlin 1.6.10 起可用。

:::

專案根目錄中的 `kotlin-js-store` 目錄由 Kotlin Multiplatform Gradle 插件自動產生，用於儲存 `yarn.lock` 檔案，這對於版本鎖定是必要的。鎖定檔案完全由 Yarn 插件管理，並在執行 `kotlinNpmInstall` Gradle 任務期間更新。

若要遵循[建議的做法](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，
請將 `kotlin-js-store` 及其內容提交到您的版本控制系統。這可確保您的應用程式在所有機器上都使用完全相同的依賴項樹建置。

如果需要，您可以在 `build.gradle(.kts)` 中變更目錄和鎖定檔案名稱：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</TabItem>
</Tabs>

:::note
變更鎖定檔案的名稱可能會導致依賴項檢查工具不再提取該檔案。

若要瞭解更多關於 `yarn.lock` 的資訊，請造訪 [Yarn 官方文件](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)。

### 報告 yarn.lock 已更新

Kotlin/JS 提供了 Gradle 設定，可以在 `yarn.lock` 檔案已更新時通知您。
如果您想要在 CI 建置過程中靜默變更 `yarn.lock` 時收到通知，可以使用這些設定：

* `YarnLockMismatchReport`，指定如何報告對 `yarn.lock` 檔案的變更。您可以使用以下值之一：
    * `FAIL` 使對應的 Gradle 任務失敗。這是預設值。
    * `WARNING` 將有關變更的資訊寫入警告日誌。
    * `NONE` 停用報告。
* `reportNewYarnLock`，明確報告最近建立的 `yarn.lock` 檔案。預設情況下，此選項已停用：在第一次啟動時產生新的 `yarn.lock` 檔案是一種常見的做法。您可以使用此選項來確保該檔案已提交到您的儲存庫。
* `yarnLockAutoReplace`，每次執行 Gradle 任務時都會自動取代 `yarn.lock`。

若要使用這些選項，請按如下所示更新 `build.gradle(.kts)`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) \{
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
\}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) \{
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).reportNewYarnLock = false // true
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockAutoReplace = false // true
\}
```

</TabItem>
</Tabs>

### 預設情況下使用 --ignore-scripts 安裝 npm 依賴項

預設情況下使用 `--ignore-scripts` 安裝 npm 依賴項自 Kotlin 1.6.10 起可用。

:::

為了降低執行來自受感染 npm 套件的惡意程式碼的可能性，Kotlin Multiplatform Gradle 插件會預設阻止在安裝 npm 依賴項期間執行[生命週期腳本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。

您可以透過將以下程式碼行新增至 `build.gradle(.kts)` 來明確啟用生命週期腳本執行：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> { 
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
```

</TabItem>
</Tabs>

## 發佈目標目錄

預設情況下，Kotlin/JS 專案建置的結果位於專案根目錄中的 `/build/dist/<targetName>/<binaryName>` 目錄中