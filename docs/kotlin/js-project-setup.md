[//]: # (title: 设置 Kotlin/JS 项目)

Kotlin/JS 项目使用 Gradle 作为构建系统。为了让开发者轻松管理其 Kotlin/JS 项目，我们提供了 `kotlin.multiplatform` Gradle 插件，它提供了项目配置工具以及用于自动化 JavaScript 开发典型例程的辅助任务。

该插件使用 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/) 包管理器在后台下载 npm 依赖项，并使用 [webpack](https://webpack.js.org/) 从 Kotlin 项目构建 JavaScript 打包文件 (bundle)。依赖管理和配置调整大部分可以直接在 Gradle 构建文件中完成，并可选择覆盖自动生成的配置以实现完全控制。

你可以在 `build.gradle(.kts)` 文件中手动将 `org.jetbrains.kotlin.multiplatform` 插件应用于 Gradle 项目：

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

Kotlin Multiplatform Gradle 插件允许你在构建脚本的 `kotlin {}` 块中管理项目的各个方面：

```groovy
kotlin {
    // ...
}
```

在 `kotlin {}` 块内，你可以管理以下方面：

*   [目标执行环境](#execution-environments)：浏览器或 Node.js
*   [ES2015 特性支持](#support-for-es2015-features)：类、模块和生成器
*   [项目依赖](#dependencies)：Maven 和 npm
*   [运行配置](#run-task)
*   [测试配置](#test-task)
*   [打包](#webpack-bundling) 和 [CSS 支持](#css)（针对浏览器项目）
*   [目标目录](#distribution-target-directory) 和 [模块名称](#module-name)
*   [项目的 `package.json` 文件](#package-json-customization)

## 执行环境

Kotlin/JS 项目可以针对两种不同的执行环境：

*   浏览器：用于浏览器中的客户端脚本。
*   [Node.js](https://nodejs.org/)：用于在浏览器外部运行 JavaScript 代码，例如用于服务器端脚本。

要为 Kotlin/JS 项目定义目标执行环境，请添加包含 `browser {}` 或 `nodejs {}` 的 `js {}` 块：

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

`binaries.executable()` 指令明确指示 Kotlin 编译器生成可执行的 `.js` 文件。省略 `binaries.executable()` 将导致编译器仅生成 Kotlin 内部库文件，这些文件可供其他项目使用，但无法独立运行。

> 这通常比创建可执行文件更快，并且在处理项目的非叶子模块时，这可能是一种优化手段。
>
{style="tip"}

Kotlin Multiplatform 插件会自动配置其任务，以适应所选环境。这包括下载和安装运行和测试应用程序所需的运行环境和依赖项。这使得开发者无需额外配置即可构建、运行和测试简单的项目。对于面向 Node.js 的项目，你也可以选择使用现有的 Node.js 安装。了解如何[使用预安装的 Node.js](#use-pre-installed-node-js)。

## ES2015 特性支持

Kotlin 对以下 ES2015 特性提供[实验性 (Experimental)](components-stability.md#stability-levels-explained) 支持：

*   模块：简化代码库并提高可维护性。
*   类：允许引入面向对象编程 (OOP) 原则，从而生成更清晰、更直观的代码。
*   生成器：用于编译[挂起函数 (suspend functions)](composing-suspending-functions.md)，可减小最终打包文件大小并有助于调试。

你可以通过在 `build.gradle(.kts)` 文件中添加 `es2015` 编译目标，一次性启用所有支持的 ES2015 特性：

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        target = "es2015"
    }
}
```

[在官方文档中了解有关 ES2015 (ECMAScript 2015, ES6) 的更多信息](https://262.ecma-international.org/6.0/)。

## 依赖项

与任何其他 Gradle 项目一样，Kotlin/JS 项目支持在构建脚本的 `dependencies {}` 块中进行传统的 Gradle [依赖声明](https://docs.gradle.org/current/userguide/declaring_dependencies.html)：

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

Kotlin Multiplatform Gradle 插件还支持在构建脚本的 `kotlin {}` 块中为特定源集 (source sets) 声明依赖项：

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

> 并非所有适用于 Kotlin 编程语言的库在面向 JavaScript 时都可用：只能使用包含 Kotlin/JS 构件 (artifacts) 的库。
>
{style="note"}

如果你添加的库依赖于 [npm 包](#npm-dependencies)，Gradle 也会自动解析这些传递依赖项。

### Kotlin 标准库

[标准库](https://kotlinlang.org/api/latest/jvm/stdlib/index.html) 的依赖项会自动添加。标准库的版本与 Kotlin Multiplatform 插件的版本相同。

对于多平台测试，可以使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API。当你创建多平台项目时，可以通过在 `commonTest` 中使用单个依赖项，将测试依赖项添加到所有源集 (source sets)：

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

在 JavaScript 世界中，管理依赖项最常见的方式是 [npm](https://www.npmjs.com/)。它提供了最大的公共 JavaScript 模块仓库。

Kotlin Multiplatform Gradle 插件允许你在 Gradle 构建脚本中声明 npm 依赖项，就像声明任何其他依赖项一样。

要声明 npm 依赖项，请在依赖声明中将其名称和版本传递给 `npm()` 函数。你还可以根据 [npm 的语义版本 (semver) 语法](https://docs.npmjs.com/about-semantic-versioning) 指定一个或多个版本范围。

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

默认情况下，该插件使用 [Yarn](https://yarnpkg.com/lang/en/) 包管理器的独立实例来下载和安装 npm 依赖项。它开箱即用，无需额外配置，但你可以根据[特定需求进行调整](#yarn)。

你也可以直接使用 [npm](https://www.npmjs.com/) 包管理器来处理 npm 依赖项。要使用 npm 作为包管理器，请在 `gradle.properties` 文件中设置以下属性：

```none
kotlin.js.yarn=false
```

除了常规依赖项之外，还有三种其他类型的依赖项可以在 Gradle DSL 中使用。要了解每种依赖项何时使用最合适，请查阅 npm 官方文档中的链接：

*   [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)，通过 `devNpm(...)`，
*   [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies)，通过 `optionalNpm(...)`，和
*   [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies)，通过 `peerNpm(...)`。

一旦安装了 npm 依赖项，你就可以在代码中使用其 API，具体请参见[从 Kotlin 调用 JS](js-interop.md)。

## run 任务

Kotlin Multiplatform Gradle 插件提供了一个 `jsBrowserDevelopmentRun` 任务，允许你无需额外配置即可运行纯 Kotlin/JS 项目。

对于在浏览器中运行 Kotlin/JS 项目，此任务是 `browserDevelopmentRun` 任务的别名（该任务在 Kotlin 多平台项目中也可用）。它使用 [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) 来提供你的 JavaScript 构件 (artifacts)。如果你想自定义 `webpack-dev-server` 使用的配置，例如调整服务器运行的端口，请使用 [webpack 配置文件](#webpack-bundling)。

对于运行面向 Node.js 的 Kotlin/JS 项目，请使用 `jsNodeDevelopmentRun` 任务，它是 `nodeRun` 任务的别名。

要运行项目，请执行标准生命周期 `jsBrowserDevelopmentRun` 任务，或其对应的别名：

```bash
./gradlew jsBrowserDevelopmentRun
```

要在对源文件进行更改后自动触发应用程序的重新构建，请使用 Gradle 的[连续构建 (continuous build)](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) 特性：

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

或

```bash
./gradlew jsBrowserDevelopmentRun -t
```

一旦项目构建成功，`webpack-dev-server` 将自动刷新浏览器页面。

## test 任务

Kotlin Multiplatform Gradle 插件会自动为项目设置测试基础设施。对于浏览器项目，它会下载并安装 [Karma](https://karma-runner.github.io/) 测试运行器以及其他所需的依赖项；对于 Node.js 项目，则使用 [Mocha](https://mochajs.org/) 测试框架。

该插件还提供有用的测试功能，例如：

*   源映射生成
*   测试报告生成
*   控制台中的测试运行结果

默认情况下，对于运行浏览器测试，该插件使用 [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)。你还可以通过在构建脚本的 `useKarma {}` 块内添加相应的条目，选择另一个浏览器来运行测试：

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

这种方法允许你为所有模块定义一个浏览器列表，然后可以在特定模块的构建脚本中添加特定的浏览器。

请注意，Kotlin Multiplatform Gradle 插件不会自动为你安装这些浏览器，它只使用其执行环境中可用的浏览器。例如，如果你正在持续集成服务器上执行 Kotlin/JS 测试，请确保安装了你希望测试所用的浏览器。

如果你想跳过测试，请将 `enabled = false` 行添加到 `testTask {}` 中：

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

要指定 Node.js 测试运行器使用的环境变量（例如，向测试传递外部信息，或微调包解析），请在构建脚本的 `testTask {}` 块内使用 `environment()` 函数，并传入键值对：

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

Kotlin Multiplatform Gradle 插件会在构建时自动生成 Karma 配置文件，其中包含你在 `build.gradle(.kts)` 文件中 [`kotlin.js.browser.testTask.useKarma {}` 块](#test-task) 中的设置。你可以在 `build/js/packages/projectName-test/karma.conf.js` 找到该文件。要对 Karma 使用的配置进行调整，请将你的额外配置文件放置在项目根目录下名为 `karma.config.d` 的目录中。该目录中的所有 `.js` 配置文件都将被自动获取并在构建时合并到生成的 `karma.conf.js` 中。

所有 Karma 配置能力在 Karma 的[文档](https://karma-runner.github.io/5.0/config/configuration-file.html)中都有详细描述。

## webpack 打包

对于浏览器目标，Kotlin Multiplatform Gradle 插件使用广为人知的 [webpack](https://webpack.js.org/) 模块打包器 (module bundler)。

### webpack 版本

Kotlin Multiplatform 插件使用 webpack %webpackMajorVersion%。

如果你有使用 1.5.0 之前插件版本创建的项目，可以通过在项目的 `gradle.properties` 中添加以下行，暂时切换回这些版本中使用的 webpack %webpackPreviousMajorVersion%：

```none
kotlin.js.webpack.major.version=4
```

### webpack 任务

最常见的 webpack 调整可以直接通过 Gradle 构建文件中的 `kotlin.js.browser.webpackTask {}` 配置块进行：
*   `outputFileName` - webpack 打包后的输出文件名称。在执行 webpack 任务后，它将在 `<projectDir>/build/dist/<targetName>` 中生成。默认值为项目名称。
*   `output.libraryTarget` - webpack 打包输出的模块系统。了解更多关于 [Kotlin/JS 项目可用的模块系统](js-modules.md)。默认值为 `umd`。

```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

你还可以在 `commonWebpackConfig {}` 块中配置用于打包、运行和测试任务的通用 webpack 设置。

### webpack 配置文件

Kotlin Multiplatform Gradle 插件会在构建时自动生成一个标准的 webpack 配置文件。它位于 `build/js/packages/projectName/webpack.config.js`。

如果你想对 webpack 配置进行进一步调整，请将你的额外配置文件放置在项目根目录下名为 `webpack.config.d` 的目录中。构建项目时，所有 `.js` 配置文件都将自动合并到 `build/js/packages/projectName/webpack.config.js` 文件中。例如，要添加新的 [webpack loader](https://webpack.js.org/loaders/)，请将以下内容添加到 `webpack.config.d` 目录中的 `.js` 文件中：

> 在这种情况下，配置对象是全局 `config` 对象。你需要在脚本中修改它。
>
{style="note"}

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

所有 webpack 配置能力在其[文档](https://webpack.js.org/concepts/configuration/)中都有详细描述。

### 构建可执行文件

为了通过 webpack 构建可执行的 JavaScript 构件 (artifacts)，Kotlin Multiplatform Gradle 插件包含 `browserDevelopmentWebpack` 和 `browserProductionWebpack` Gradle 任务。

*   `browserDevelopmentWebpack` 创建开发构件 (artifacts)，它们体积较大，但创建时间短。因此，在活跃开发期间请使用 `browserDevelopmentWebpack` 任务。

*   `browserProductionWebpack` 对生成的构件 (artifacts) 应用死代码消除 (dead code elimination) 并最小化生成的 JavaScript 文件，这需要更多时间，但生成的包体积更小。因此，在为生产环境准备项目时，请使用 `browserProductionWebpack` 任务。

执行这些任务中的任意一个，即可获取用于开发或生产的相应构件 (artifacts)。生成的文件将位于 `build/dist` 中，除非[另有指定](#distribution-target-directory)。

请注意，这些任务仅在你的目标配置为生成可执行文件（通过 `binaries.executable()`）时才可用。

## CSS

Kotlin Multiplatform Gradle 插件还提供对 webpack 的 [CSS](https://webpack.js.org/loaders/css-loader/) 和 [style](https://webpack.js.org/loaders/style-loader/) 加载器 (loaders) 的支持。虽然所有选项都可以通过直接修改用于构建项目的 [webpack 配置文件](#webpack-bundling) 来更改，但最常用的设置可以直接在 `build.gradle(.kts)` 文件中获取。

要在项目中开启 CSS 支持，请在 Gradle 构建文件的 `commonWebpackConfig {}` 块中设置 `cssSupport.enabled` 选项。使用向导创建新项目时，此配置也默认启用。

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

在项目中激活 CSS 支持有助于防止在使用未配置项目的样式表时出现的常见错误，例如 `Module parse failed: Unexpected character '@' (14:0)`。

你可以使用 `cssSupport.mode` 来指定如何处理遇到的 CSS。可用值如下：

*   `"inline"` (默认)：样式被添加到全局 `<style>` 标签中。
*   `"extract"`：样式被提取到单独的文件中。然后可以从 HTML 页面中引用它们。
*   `"import"`：样式被处理为字符串。如果你需要从代码中访问 CSS（例如 `val styles = require("main.css")`），这会很有用。

要在同一个项目中使用不同的模式，请使用 `cssSupport.rules`。在这里，你可以指定一个 `KotlinWebpackCssRules` 列表，每个规则定义一个模式，以及 [include](https://webpack.js.org/configuration/module/#ruleinclude) 和 [exclude](https://webpack.js.org/configuration/module/#ruleexclude) 模式。

## Node.js

对于面向 Node.js 的 Kotlin/JS 项目，该插件会自动在主机上下载并安装 Node.js 环境。你也可以使用现有的 Node.js 实例（如果你有）。

### 配置 Node.js 设置

你可以为每个子项目配置 Node.js 设置，也可以为整个项目设置它们。

例如，要为特定子项目设置 Node.js 版本，请在其 `build.gradle(.kts)` 文件中的 Gradle 块中添加以下行：

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

要为整个项目（包括所有子项目）设置版本，请将相同的代码应用于 `allProjects {}` 块：

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

> 使用 `NodeJsRootPlugin` 类配置整个项目的 Node.js 设置已被弃用，并最终将停止支持。
>
{style="note"}

### 使用预安装的 Node.js

如果 Node.js 已安装在构建 Kotlin/JS 项目的主机上，你可以配置 Kotlin Multiplatform Gradle 插件以使用它，而不是安装自己的 Node.js 实例。

要使用预安装的 Node.js 实例，请在 `build.gradle(.kts)` 文件中添加以下行：

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

默认情况下，为了在构建时下载和安装你声明的依赖项，该插件会管理其自己的 [Yarn](https://yarnpkg.com/lang/en/) 包管理器实例。它开箱即用，无需额外配置，但你可以对其进行调整或使用主机上已安装的 Yarn。

### 额外的 Yarn 功能：.yarnrc

要配置额外的 Yarn 功能，请在项目根目录中放置一个 `.yarnrc` 文件。在构建时，它会被自动获取。

例如，要为 npm 包使用自定义注册表，请在项目根目录下名为 `.yarnrc` 的文件中添加以下行：

```text
registry "http://my.registry/api/npm/"
```

要了解更多关于 `.yarnrc` 的信息，请访问 [Yarn 官方文档](https://classic.yarnpkg.com/en/docs/yarnrc/)。

### 使用预安装的 Yarn

如果 Yarn 已安装在构建 Kotlin/JS 项目的主机上，你可以配置 Kotlin Multiplatform Gradle 插件以使用它，而不是安装自己的 Yarn 实例。

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

项目根目录下的 `kotlin-js-store` 目录由 Kotlin Multiplatform Gradle 插件自动生成，用于保存 `yarn.lock` 文件，该文件对于版本锁定 (version locking) 是必需的。锁定文件 (lockfile) 完全由 Yarn 插件管理，并在执行 `kotlinNpmInstall` Gradle 任务期间更新。

为了遵循[推荐实践](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，请将 `kotlin-js-store` 及其内容提交到你的版本控制系统。这确保了你的应用程序在所有机器上都使用完全相同的依赖树进行构建。

如果需要，你可以在 `build.gradle(.kts)` 中更改目录名和锁定文件名：

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

> 更改锁定文件的名称可能会导致依赖检查工具无法再识别该文件。
>
{style="warning"}

要了解更多关于 `yarn.lock` 的信息，请访问 [Yarn 官方文档](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)。

### 报告 yarn.lock 已更新

Kotlin/JS 提供了 Gradle 设置，可以通知你 `yarn.lock` 文件是否已更新。当你希望在 CI 构建过程中 `yarn.lock` 悄悄发生更改时收到通知，可以使用这些设置：

*   `YarnLockMismatchReport`：指定如何报告 `yarn.lock` 文件的更改。你可以使用以下值之一：
    *   `FAIL`：使相应的 Gradle 任务失败。这是默认值。
    *   `WARNING`：将有关更改的信息写入警告日志。
    *   `NONE`：禁用报告。
*   `reportNewYarnLock`：明确报告最近创建的 `yarn.lock` 文件。默认情况下，此选项是禁用的：在首次启动时生成新的 `yarn.lock` 文件是一种常见做法。你可以使用此选项来确保该文件已提交到你的仓库 (repository)。
*   `yarnLockAutoReplace`：每次运行 Gradle 任务时自动替换 `yarn.lock`。

要使用这些选项，请按如下方式更新 `build.gradle(.kts)`：

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

### 默认使用 --ignore-scripts 安装 npm 依赖项

> 默认情况下使用 `--ignore-scripts` 安装 npm 依赖项的功能自 Kotlin 1.6.10 起可用。
>
{style="note"}

为了减少执行来自受损 npm 包的恶意代码的可能性，Kotlin Multiplatform Gradle 插件默认情况下会阻止在安装 npm 依赖项期间执行[生命周期脚本 (lifecycle scripts)](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。

你可以通过在 `build.gradle(.kts)` 中添加以下行来明确启用生命周期脚本执行：

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

## 发布目标目录

默认情况下，Kotlin/JS 项目构建的结果位于项目根目录下的 `/build/dist/<targetName>/<binaryName>` 目录中。

> 在 Kotlin 1.9.0 之前，默认的发布目标目录是 `/build/distributions`。
>
{style="note" }

要为项目发布文件设置另一个位置，请在构建脚本的 `browser {}` 块内，添加一个 `distribution {}` 块，并使用 `set()` 方法为 `outputDirectory` 属性赋值。一旦你运行项目构建任务，Gradle 会将输出打包文件 (bundle) 和项目资源一起保存到此位置。

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

要调整 JavaScript _模块_（在 `build/js/packages/myModuleName` 中生成）的名称，包括相应的 `.js` 和 `.d.ts` 文件，请使用 `moduleName` 选项：

```groovy
js {
    moduleName = "myModuleName"
}
```

请注意，这不会影响 `build/dist` 中的 webpack 打包输出。

## package.json 自定义

`package.json` 文件包含 JavaScript 包的元数据 (metadata)。流行的包注册表，如 npm，要求所有已发布的包都包含此类文件。它们用它来跟踪和管理包的发布。

Kotlin Multiplatform Gradle 插件会在构建时自动为 Kotlin/JS 项目生成 `package.json`。默认情况下，该文件包含基本数据：名称、版本、许可证、依赖项以及一些其他包属性。

除了基本的包属性之外，`package.json` 还可以定义 JavaScript 项目应如何运行，例如，识别可运行的脚本。

你可以通过 Gradle DSL 向项目的 `package.json` 添加自定义条目。要向 `package.json` 添加自定义字段，请在 compilations `packageJson` 块中使用 `customField()` 函数：

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

当你构建项目时，此代码会将以下块添加到 `package.json` 文件中：

```json
"hello": {
    "one": 1,
    "two": 2
}
```

在 [npm 文档](https://docs.npmjs.com/cli/v6/configuring-npm/package-json) 中了解更多关于为 npm 注册表编写 `package.json` 文件的信息。