[//]: # (title: 设置 Kotlin/JS 项目)

Kotlin/JS 项目使用 Gradle 作为构建系统。为了让开发者轻松管理其 Kotlin/JS 项目，我们提供了 `kotlin.multiplatform` Gradle 插件，该插件提供了项目配置工具以及自动化 JavaScript 开发中常见例程的辅助任务。

该插件在后台使用 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/) 包管理器下载 npm 依赖项，并使用 [webpack](https://webpack.js.org/) 从 Kotlin 项目构建 JavaScript bundle。依赖项管理和配置调整大部分可以直接从 Gradle 构建文件中完成，并可选择覆盖自动生成的配置以实现完全控制。

你可以在 `build.gradle(.kts)` 文件中手动将 `org.jetbrains.kotlin.multiplatform` 插件应用到 Gradle 项目：

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

Kotlin Multiplatform Gradle 插件允许你在构建脚本的 `kotlin {}` 代码块中管理项目的各个方面：

```groovy
kotlin {
    // ...
}
```

在 `kotlin {}` 代码块内部，你可以管理以下方面：

*   [目标执行环境](#execution-environments)：浏览器或 Node.js
*   [对 ES2015 特性的支持](#support-for-es2015-features)：类、模块和生成器
*   [配置输出粒度](#configure-output-granularity)
*   [TypeScript 声明文件（`d.ts`）的生成](#generation-of-typescript-declaration-files-d-ts)
*   [项目依赖项](#dependencies)：Maven 和 npm
*   [运行配置](#run-task)
*   [测试配置](#test-task)
*   浏览器项目的 [打包](#webpack-bundling) 和 [CSS 支持](#css)
*   [目标目录](#distribution-target-directory) 和 [模块名称](#module-name)
*   [项目的 `package.json` 文件](#package-json-customization)

## 执行环境

Kotlin/JS 项目可以面向两种不同的执行环境：

*   Browser：用于浏览器中的客户端脚本。
*   [Node.js](https://nodejs.org/)：用于在浏览器外部运行 JavaScript 代码，例如用于服务器端脚本。

要为 Kotlin/JS 项目定义目标执行环境，请添加 `js {}` 代码块，并在其中包含 `browser {}` 或 `nodejs {}`：

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

`binaries.executable()` 指令明确指示 Kotlin 编译器输出可执行的 `.js` 文件。
省略 `binaries.executable()` 将导致编译器只生成 Kotlin 内部库文件，这些文件可用于其他项目，但不能单独运行。

> 这通常比创建可执行文件更快，并且在处理项目的非叶子模块时，可以作为一种可能的优化。
>
{style="tip"}

Kotlin Multiplatform 插件自动为所选环境配置其任务。这包括下载和安装运行和测试应用程序所需的环境和依赖项。这使得开发者无需额外配置即可构建、运行和测试简单的项目。对于面向 Node.js 的项目，还可以选择使用现有的 Node.js 安装。了解如何[使用预安装的 Node.js](#use-pre-installed-node-js)。

## 对 ES2015 特性的支持

Kotlin 为以下 ES2015 特性提供[实验性的](components-stability.md#stability-levels-explained)支持：

*   模块：简化你的代码库并提高可维护性。
*   类：允许整合面向对象编程 (OOP) 原则，从而产生更清晰、更直观的代码。
*   生成器：用于编译[挂起函数](https://kotlinlang.org/docs/composing-suspending-functions.html)，可减小最终 bundle 大小并有助于调试。

你可以通过在 `build.gradle(.kts)` 文件中添加 `es2015` 编译目标，一次性启用所有受支持的 ES2015 特性：

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    compilerOptions {
        target = "es2015"
    }
}
```

[在官方文档中了解更多关于 ES2015 (ECMAScript 2015, ES6) 的信息](https://262.ecma-international.org/6.0/)。

## 配置输出粒度

你可以选择编译器在项目中输出 `.js` 文件的方式：

*   **每个模块一个文件**。默认情况下，JS 编译器为每个项目模块输出单独的 `.js` 文件作为编译结果。
*   **每个项目一个文件**。你可以通过在 `gradle.properties` 文件中添加以下行，将整个项目编译成单个 `.js` 文件：

    ```none
    kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
    ```

*   **每个文件一个文件**。你可以设置更细粒度的输出，为每个 Kotlin 文件生成一个（或两个，如果文件包含导出的声明）JavaScript 文件。要启用按文件编译模式：
    1.  设置 `es2015` 作为[编译目标](#support-for-es2015-features)，以在项目中支持 ES2015 特性。
    2.  在 `gradle.properties` 文件中添加以下行：
        ```none
        kotlin.js.ir.output.granularity=per-file // 'per-module' is the default
        ```

## TypeScript 声明文件（`d.ts`）的生成
<primary-label ref="experimental-opt-in"/>

Kotlin/JS 编译器可以从你的 Kotlin 代码生成 TypeScript 定义。这些定义可供 JavaScript 工具和 IDE 在处理混合应用程序时使用，以：

*   提供自动补全
*   支持静态分析器
*   简化在 JavaScript 和 TypeScript 项目中添加 Kotlin 代码

生成 TypeScript 定义对于[业务逻辑共享用例](js-overview.md#use-cases-for-kotlin-js)尤其有价值。

编译器会收集任何标记有 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 的顶层声明，并自动在 `.d.ts` 文件中生成 TypeScript 定义。

要生成 TypeScript 定义，请在 Gradle 构建文件中显式配置。
在 `js {}` 代码块中，将 `generateTypeScriptDefinitions()` 函数添加到你的 `build.gradle.kts` 文件中（参见 [js 项目设置](#execution-environments)）：

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

你可以在 `build/js/packages/<package_name>/kotlin` 目录中找到这些定义，与相应的未 webpack 打包的 JavaScript 代码放在一起。

## 依赖项

像任何其他 Gradle 项目一样，Kotlin/JS 项目支持在构建脚本的 `dependencies {}` 代码块中进行传统的 Gradle [依赖项声明](https://docs.gradle.org/current/userguide/declaring_dependencies.html)：

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

Kotlin Multiplatform Gradle 插件还支持在构建脚本的 `kotlin {}` 代码块中为特定源代码集声明依赖项：

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

> 并非所有适用于 Kotlin 编程语言的库都可在面向 JavaScript 时使用：只能使用包含 Kotlin/JS 构件的库。
>
{style="note"}

如果你添加的库依赖于 [npm 的包](#npm-dependencies)，Gradle 也会自动解析这些传递依赖项。

### Kotlin 标准库

[标准库](https://kotlinlang.org/api/latest/jvm/stdlib/index.html)的依赖项是自动添加的。标准库的版本与 Kotlin Multiplatform 插件的版本相同。

对于多平台测试，[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 可用。当你创建多平台项目时，可以通过在 `commonTest` 中使用单个依赖项，将测试依赖项添加到所有源代码集：

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

### npm 依赖项

在 JavaScript 世界中，管理依赖项最常见的方式是 [npm](https://www.npmjs.com/)。它提供了最大的 JavaScript 模块公共仓库。

Kotlin Multiplatform Gradle 插件允许你在 Gradle 构建脚本中声明 npm 依赖项，就像你声明任何其他依赖项一样。

要声明 npm 依赖项，请在依赖项声明内部将其名称和版本传递给 `npm()` 函数。你还可以根据 [npm 的 semver 语法](https://docs.npmjs.com/about-semantic-versioning)指定一个或多个版本区间。

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

默认情况下，该插件使用 [Yarn](https://yarnpkg.com/lang/en/) 包管理器的一个独立实例来下载和安装 npm 依赖项。它开箱即用，无需额外配置，但你可以[根据特定需求进行调整](#yarn)。

你也可以直接使用 [npm](https://www.npmjs.com/) 包管理器来处理 npm 依赖项。要使用 npm 作为你的包管理器，请在 `gradle.properties` 文件中设置以下属性：

```none
kotlin.js.yarn=false
```

除了常规依赖项之外，还有三种可以在 Gradle DSL 中使用的依赖项类型。要了解每种依赖项类型何时最适合使用，请查阅 npm 官方文档中链接的信息：

*   [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)，通过 `devNpm(...)`
*   [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies)，通过 `optionalNpm(...)`
*   [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies)，通过 `peerNpm(...)`

一旦 npm 依赖项安装完毕，你就可以在代码中像 [从 Kotlin 调用 JS](js-interop.md) 中描述的那样使用其 API。

## run task

Kotlin Multiplatform Gradle 插件提供了一个 `jsBrowserDevelopmentRun` 任务，允许你无需额外配置即可运行纯 Kotlin/JS 项目。

对于在浏览器中运行 Kotlin/JS 项目，此任务是 `browserDevelopmentRun` 任务的别名（该任务在 Kotlin 多平台项目中也可用）。它使用 [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) 来提供你的 JavaScript 构件。如果你想自定义 `webpack-dev-server` 使用的配置，例如调整服务器运行的端口，请使用 [webpack 配置文件](#webpack-bundling)。

对于运行面向 Node.js 的 Kotlin/JS 项目，请使用 `jsNodeDevelopmentRun` 任务，它是 `nodeRun` 任务的别名。

要运行项目，请执行标准生命周期 `jsBrowserDevelopmentRun` 任务，或其对应的别名：

```bash
./gradlew jsBrowserDevelopmentRun
```

要在更改源文件后自动触发应用程序的重新构建，请使用 Gradle [持续构建](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) 特性：

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

或者

```bash
./gradlew jsBrowserDevelopmentRun -t
```

一旦你的项目构建成功，`webpack-dev-server` 将自动刷新浏览器页面。

## test task

Kotlin Multiplatform Gradle 插件自动为项目设置测试基础架构。对于浏览器项目，它会下载并安装 [Karma](https://karma-runner.github.io/) 测试运行器以及其他所需的依赖项；对于 Node.js 项目，则使用 [Mocha](https://mochajs.org/) 测试框架。

该插件还提供有用的测试特性，例如：

*   源代码映射生成
*   测试报告生成
*   控制台中的测试运行结果

对于运行浏览器测试，插件默认使用 [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)。你还可以通过在构建脚本的 `useKarma {}` 代码块中添加相应的条目来选择另一个浏览器进行测试：

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

或者，你可以在 `gradle.properties` 文件中添加浏览器的测试目标：

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

这种方法允许你为所有模块定义浏览器列表，然后在特定模块的构建脚本中添加特定浏览器。

请注意，Kotlin Multiplatform Gradle 插件不会自动为你安装这些浏览器，而只会使用在其执行环境中可用的浏览器。例如，如果你在持续集成服务器上执行 Kotlin/JS 测试，请确保你想要测试的浏览器已安装。

如果你想跳过测试，请在 `testTask {}` 中添加 `enabled = false` 行：

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

要运行测试，请执行标准生命周期 `check` 任务：

```bash
./gradlew check
```

要指定 Node.js 测试运行器使用的环境变量（例如，将外部信息传递给测试，或微调包解析），请在构建脚本的 `testTask {}` 代码块中使用带有键值对的 `environment()` 函数：

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

Kotlin Multiplatform Gradle 插件在构建时自动生成 Karma 配置文件，其中包含你在 `build.gradle(.kts)` 中 [`kotlin.js.browser.testTask.useKarma {}` 代码块](#test-task)的设置。你可以在 `build/js/packages/projectName-test/karma.conf.js` 找到该文件。
要对 Karma 使用的配置进行调整，请将你的额外配置文件放置在项目根目录下名为 `karma.config.d` 的目录中。此目录中的所有 `.js` 配置文件都将在构建时自动被拾取并合并到生成的 `karma.conf.js` 中。

所有 Karma 配置能力都在 Karma 的[文档](https://karma-runner.github.io/5.0/config/configuration-file.html)中详细描述。

## webpack 打包

对于浏览器目标，Kotlin Multiplatform Gradle 插件使用广为人知的 [webpack](https://webpack.js.org/) 模块打包器。

### webpack 版本

Kotlin Multiplatform 插件使用 webpack %webpackMajorVersion%。

如果你有使用早于 1.5.0 的插件版本创建的项目，你可以通过在项目的 `gradle.properties` 中添加以下行，暂时切换回这些版本中使用的 webpack %webpackPreviousMajorVersion%：

```none
kotlin.js.webpack.major.version=4
```

### webpack task

最常见的 webpack 调整可以直接通过 Gradle 构建文件中的 `kotlin.js.browser.webpackTask {}` 配置代码块完成：
*   `outputFileName` - webpack 打包输出文件的名称。它将在 webpack 任务执行后生成在 `<projectDir>/build/dist/<targetName>` 中。默认值是项目名称。
*   `output.libraryTarget` - webpack 打包输出的模块系统。了解更多关于 [Kotlin/JS 项目可用的模块系统](js-modules.md)。默认值是 `umd`。

```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

你还可以在 `commonWebpackConfig {}` 代码块中配置用于打包、运行和测试任务的常见 webpack 设置。

### webpack 配置文件

Kotlin Multiplatform Gradle 插件在构建时自动生成一个标准的 webpack 配置文件。它位于 `build/js/packages/projectName/webpack.config.js`。

如果你想对 webpack 配置进行进一步调整，请将你的额外配置文件放置在项目根目录下名为 `webpack.config.d` 的目录中。构建项目时，所有 `.js` 配置文件将自动合并到 `build/js/packages/projectName/webpack.config.js` 文件中。
例如，要添加新的 [webpack loader](https://webpack.js.org/loaders/)，请将以下内容添加到 `webpack.config.d` 目录下的 `.js` 文件中：

> 在这种情况下，配置对象是全局对象 `config`。你需要在脚本中修改它。
>
{style="note"}

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

所有 webpack 配置能力都在其[文档](https://webpack.js.org/concepts/configuration/)中详细描述。

### 构建可执行文件

为了通过 webpack 构建可执行 JavaScript 构件，Kotlin Multiplatform Gradle 插件包含 `browserDevelopmentWebpack` 和 `browserProductionWebpack` Gradle 任务。

*   `browserDevelopmentWebpack` 创建开发构件，这些构件尺寸较大，但创建时间很短。因此，在活跃开发期间使用 `browserDevelopmentWebpack` 任务。

*   `browserProductionWebpack` 对生成的构件应用无用代码消除并压缩生成的 JavaScript 文件，这需要更多时间，但生成的可执行文件尺寸更小。因此，在为生产使用准备项目时使用 `browserProductionWebpack` 任务。

执行这些任务中的任何一个以获取用于开发或生产的相应构件。生成的文件将位于 `build/dist`，除非[另行指定](#distribution-target-directory)。

```bash
./gradlew browserProductionWebpack
```

请注意，只有当你的目标配置为生成可执行文件（通过 `binaries.executable()`）时，这些任务才可用。

## CSS

Kotlin Multiplatform Gradle 插件还支持 webpack 的 [CSS](https://webpack.js.org/loaders/css-loader/) 和 [style](https://webpack.js.org/loaders/style-loader/) loader。虽然所有选项都可以通过直接修改用于构建项目的 [webpack 配置文件](#webpack-bundling)来更改，但最常用的设置可以直接从 `build.gradle(.kts)` 文件中获取。

要在项目中启用 CSS 支持，请在 Gradle 构建文件的 `commonWebpackConfig {}` 代码块中设置 `cssSupport.enabled` 选项。使用向导创建新项目时，此配置也默认启用。

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

或者，你可以为 `webpackTask {}`、`runTask {}` 和 `testTask {}` 独立添加 CSS 支持：

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

在项目中激活 CSS 支持有助于防止在使用未配置项目中的样式表时发生的常见错误，例如 `Module parse failed: Unexpected character '@' (14:0)`。

你可以使用 `cssSupport.mode` 来指定如何处理遇到的 CSS。以下值可用：

*   `"inline"` (默认)：样式被添加到全局 `<style>` 标签中。
*   `"extract"`：样式被提取到单独的文件中。然后可以从 HTML 页面中包含它们。
*   `"import"`：样式作为字符串处理。如果你需要从代码中访问 CSS（例如 `val styles = require("main.css")`），这会很有用。

要对同一项目使用不同的模式，请使用 `cssSupport.rules`。在这里，你可以指定一个 `KotlinWebpackCssRules` 列表，其中每个规则都定义一个模式，以及 [include](https://webpack.js.org/configuration/module/#ruleinclude) 和 [exclude](https://webpack.js.org/configuration/module/#ruleexclude) 模式。

## Node.js

对于面向 Node.js 的 Kotlin/JS 项目，该插件会自动在主机上下载并安装 Node.js 环境。如果你已经安装了 Node.js，也可以使用现有的实例。

### 配置 Node.js 设置

你可以为每个子项目配置 Node.js 设置，或为整个项目进行设置。

例如，要为特定子项目设置 Node.js 版本，请在其 `build.gradle(.kts)` 文件中的 Gradle 代码块中添加以下行：

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

要为整个项目（包括所有子项目）设置版本，请将相同的代码应用到 `allProjects {}` 代码块中：

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

> 使用 `NodeJsRootPlugin` 类配置整个项目的 Node.js 设置已被弃用，并将最终停止支持。
>
{style="note"}

### 使用预安装的 Node.js

如果 Node.js 已安装在你构建 Kotlin/JS 项目的主机上，你可以配置 Kotlin Multiplatform Gradle 插件以使用它，而不是安装自己的 Node.js 实例。

要使用预安装的 Node.js 实例，请在 `build.gradle(.kts)` 文件中添加以下行：

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

默认情况下，为了在构建时下载和安装你声明的依赖项，该插件管理自己的 [Yarn](https://yarnpkg.com/lang/en/) 包管理器实例。它开箱即用，无需额外配置，但你可以对其进行调整或使用主机上已安装的 Yarn。

### 额外的 Yarn 特性：.yarnrc

要配置额外的 Yarn 特性，请将 `.yarnrc` 文件放置在项目的根目录中。在构建时，它会自动被拾取。

例如，要为 npm 包使用自定义仓库，请在项目根目录下名为 `.yarnrc` 的文件中添加以下行：

```text
registry "http://my.registry/api/npm/"
```

要了解更多关于 `.yarnrc` 的信息，请访问 [Yarn 官方文档](https://classic.yarnpkg.com/en/docs/yarnrc/)。

### 使用预安装的 Yarn

如果 Yarn 已安装在你构建 Kotlin/JS 项目的主机上，你可以配置 Kotlin Multiplatform Gradle 插件以使用它，而不是安装自己的 Yarn 实例。

要使用预安装的 Yarn 实例，请在 `build.gradle(.kts)` 中添加以下行：

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

### 通过 kotlin-js-store 进行版本锁定

> 通过 `kotlin-js-store` 进行版本锁定自 Kotlin 1.6.10 起可用。
>
{style="note"}

项目根目录下的 `kotlin-js-store` 目录由 Kotlin Multiplatform Gradle 插件自动生成，用于存放 `yarn.lock` 文件，该文件是版本锁定所必需的。锁定文件完全由 Yarn 插件管理，并在执行 `kotlinNpmInstall` Gradle 任务期间更新。

为了遵循[推荐做法](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，请将 `kotlin-js-store` 及其内容提交到你的版本控制系统。这确保了你的应用程序在所有机器上都使用完全相同的依赖项树进行构建。

如果需要，你可以在 `build.gradle(.kts)` 中更改目录和锁定文件名称：

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

> 更改锁定文件的名称可能会导致依赖项探查工具无法再识别该文件。
>
{style="warning"}

要了解更多关于 `yarn.lock` 的信息，请访问 [Yarn 官方文档](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)。

### 报告 yarn.lock 已更新

Kotlin/JS 提供 Gradle 设置，可以通知你 `yarn.lock` 文件是否已更新。当你想在 CI 构建过程中悄悄更改 `yarn.lock` 时，可以使用这些设置：

*   `YarnLockMismatchReport`：指定如何报告 `yarn.lock` 文件的更改。你可以使用以下值之一：
    *   `FAIL`：使相应的 Gradle 任务失败。这是默认值。
    *   `WARNING`：在警告日志中写入有关更改的信息。
    *   `NONE`：禁用报告。
*   `reportNewYarnLock`：显式报告新创建的 `yarn.lock` 文件。默认情况下，此选项是禁用的：在第一次启动时生成新的 `yarn.lock` 文件是常见做法。你可以使用此选项来确保该文件已提交到你的版本库。
*   `yarnLockAutoReplace`：每次运行 Gradle 任务时自动替换 `yarn.lock`。

要使用这些选项，请按如下方式更新 `build.gradle(.kts)`：

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

### 默认使用 --ignore-scripts 安装 npm 依赖项

> 默认使用 `--ignore-scripts` 安装 npm 依赖项自 Kotlin 1.6.10 起可用。
>
{style="note"}

为了降低从受损 npm 包执行恶意代码的可能性，Kotlin Multiplatform Gradle 插件默认阻止在安装 npm 依赖项期间执行[生命周期脚本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。

你可以通过在 `build.gradle(.kts)` 中添加以下行来显式启用生命周期脚本执行：

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

## 分发目标目录

默认情况下，Kotlin/JS 项目构建的结果位于项目根目录下的 `/build/dist/<targetName>/<binaryName>` 目录中。

> 在 Kotlin 1.9.0 之前，默认的分发目标目录是 `/build/distributions`。
>
{style="note"}

要为项目分发文件设置另一个位置，请在构建脚本的 `browser {}` 代码块中添加一个 `distribution {}` 代码块，并使用 `set()` 方法为 `outputDirectory` 属性赋值。一旦你运行项目构建任务，Gradle 会将输出 bundle 和项目资源保存到此位置。

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

## 模块名称

要调整 JavaScript _模块_的名称（该模块生成在 `build/js/packages/myModuleName` 中），包括相应的 `.js` 和 `.d.ts` 文件，请使用 `outputModuleName` 选项：

```groovy
js {
    outputModuleName = "myModuleName"
}
```

请注意，这不会影响 `build/dist` 中的 webpack 打包输出。

## package.json 自定义

`package.json` 文件包含 JavaScript 包的元数据。npm 等流行包仓库要求所有发布的包都拥有此类文件。它们使用它来跟踪和管理包发布。

Kotlin Multiplatform Gradle 插件在构建时自动为 Kotlin/JS 项目生成 `package.json`。默认情况下，该文件包含基本数据：名称、版本、许可证、依赖项以及一些其他包属性。

除了基本的包属性之外，`package.json` 还可以定义 JavaScript 项目应如何运行，例如，识别可运行的脚本。

你可以通过 Gradle DSL 向项目的 `package.json` 添加自定义条目。要向 `package.json` 添加自定义字段，请在 compilations `packageJson` 代码块中使用 `customField()` 函数：

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

当你构建项目时，此代码会将以下代码块添加到 `package.json` 文件中：

```json
"hello": {
    "one": 1,
    "two": 2
}
```

在 [npm 文档](https://docs.npmjs.com/cli/v6/configuring-npm/package-json)中了解更多关于为 npm 仓库编写 `package.json` 文件的信息。