---
title: "搭建 Kotlin/JS 项目"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin/JS 项目使用 Gradle 作为构建系统。为了让开发者能够轻松管理他们的 Kotlin/JS 项目，我们提供了 `kotlin.multiplatform` Gradle 插件，该插件提供了项目配置工具以及辅助任务，用于自动化 JavaScript 开发的典型例程。

该插件使用 [npm](https://www.npmjs.com/) 或 [Yarn](https://yarnpkg.com/) 包管理器在后台下载 npm 依赖项，并使用 [webpack](https://webpack.js.org/) 从 Kotlin 项目构建 JavaScript 包（bundle）。
依赖管理和配置调整可以在很大程度上直接从 Gradle 构建文件中完成，并且可以选择覆盖自动生成的配置以实现完全控制。

你可以在 `build.gradle(.kts)` 文件中手动将 `org.jetbrains.kotlin.multiplatform` 插件应用于 Gradle 项目：

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

Kotlin Multiplatform Gradle 插件允许你在构建脚本的 `kotlin {}` 块中管理项目的各个方面：

```groovy
kotlin {
    // ...
}
```

在 `kotlin {}` 块中，你可以管理以下方面：

* [目标执行环境](#execution-environments)：浏览器或 Node.js
* [对 ES2015 特性的支持](#support-for-es2015-features)：类、模块和生成器
* [项目依赖项](#dependencies)：Maven 和 npm
* [运行配置](#run-task)
* [测试配置](#test-task)
* 浏览器项目的 [打包](#webpack-bundling) 和 [CSS 支持](#css)
* [目标目录](#distribution-target-directory) 和 [模块名称](#module-name)
* [项目 `package.json` 文件](#package-json-customization)

## 执行环境

Kotlin/JS 项目可以面向两种不同的执行环境：

* 浏览器，用于浏览器中的客户端脚本
* [Node.js](https://nodejs.org/)，用于在浏览器之外运行 JavaScript 代码，例如，用于服务器端脚本。

要为 Kotlin/JS 项目定义目标执行环境，请添加带有 `browser {}` 或 `nodejs {}` 的 `js {}` 块：

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

指令 `binaries.executable()` 显式指示 Kotlin 编译器发出可执行的 `.js` 文件。
省略 `binaries.executable()` 将导致编译器仅生成 Kotlin 内部库文件，这些文件可以从其他项目中使用，但不能单独运行。

:::note
通常，这比创建可执行文件更快，并且在处理项目的非叶子模块时可能是一种优化方式。

Kotlin Multiplatform 插件会自动配置其任务以使用所选环境。
这包括下载和安装运行和测试应用程序所需的环境和依赖项。
这允许开发人员构建、运行和测试简单的项目，而无需额外的配置。对于面向 Node.js 的项目，还可以选择使用现有的 Node.js 安装。了解如何 [使用预安装的 Node.js](#use-pre-installed-node-js)。

## 对 ES2015 特性的支持

Kotlin 提供了对以下 ES2015 功能的 [Experimental](components-stability#stability-levels-explained) 支持：

* 简化代码库并提高可维护性的模块。
* 允许结合 OOP 原则的类，从而产生更清晰、更直观的代码。
* 用于编译 [挂起函数](composing-suspending-functions) 的生成器，可提高最终包的大小并有助于调试。

你可以通过将 `es2015` 编译目标添加到 `build.gradle(.kts)` 文件中来一次性启用所有受支持的 ES2015 功能：

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        target = "es2015"
    }
}
```

[在官方文档中了解有关 ES2015 (ECMAScript 2015, ES6) 的更多信息](https://262.ecma-international.org/6.0/)。

## 依赖项

像任何其他 Gradle 项目一样，Kotlin/JS 项目支持在构建脚本的 `dependencies {}` 块中使用传统的 Gradle [依赖声明](https://docs.gradle.org/current/userguide/declaring_dependencies.html)：

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

Kotlin Multiplatform Gradle 插件还支持在构建脚本的 `kotlin {}` 块中为特定源集声明依赖项：

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

并非所有可用于 Kotlin 编程语言的库都可用于面向 JavaScript：只有包含 Kotlin/JS 制品的库才能使用。

:::

如果你添加的库依赖于 [来自 npm 的包](#npm-dependencies)，Gradle 也会自动解析这些传递依赖项。

### Kotlin 标准库

会自动添加对 [标准库](https://kotlinlang.org/api/latest/jvm/stdlib/index.html) 的依赖项。标准库的版本与 Kotlin Multiplatform 插件的版本相同。

对于多平台测试，可以使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API。创建多平台项目时，可以通过在 `commonTest` 中使用单个依赖项将测试依赖项添加到所有源集：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // 自动引入所有平台依赖项
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
                implementation kotlin("test") // 自动引入所有平台依赖项
            }
        }
    }
}
```

</TabItem>
</Tabs>

### npm 依赖项

在 JavaScript 世界中，管理依赖项的最常见方法是 [npm](https://www.npmjs.com/)。
它提供了最大的 JavaScript 模块公共存储库。

Kotlin Multiplatform Gradle 插件允许你在 Gradle 构建脚本中声明 npm 依赖项，就像声明任何其他依赖项一样。

要声明 npm 依赖项，请将其名称和版本传递给依赖项声明中的 `npm()` 函数。
你还可以根据 [npm 的 semver 语法](https://docs.npmjs.com/about-semantic-versioning) 指定一个或多个版本范围。

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

默认情况下，该插件使用 [Yarn](https://yarnpkg.com/lang/en/) 包管理器的单独实例来下载和安装 npm 依赖项。
它可以直接使用，无需额外配置，但你可以 [根据具体需求进行调整](#yarn)。

你还可以直接使用 [npm](https://www.npmjs.com/) 包管理器来处理 npm 依赖项。
要使用 npm 作为包管理器，请在 `gradle.properties` 文件中设置以下属性：

```none
kotlin.js.yarn=false
```

除了常规依赖项之外，还有三种可以从 Gradle DSL 中使用的依赖项类型。
要了解何时最适合使用每种类型的依赖项，请查看 npm 链接的官方文档：

* [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies)，通过 `devNpm(...)`，
* [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies) 通过 `optionalNpm(...)`，以及
* [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies) 通过 `peerNpm(...)`。

安装 npm 依赖项后，你可以按照 [从 Kotlin 调用 JS](js-interop) 中的描述在代码中使用其 API。

## run 任务

Kotlin Multiplatform Gradle 插件提供了一个 `jsBrowserDevelopmentRun` 任务，允许你运行纯 Kotlin/JS 项目，而无需其他配置。

对于在浏览器中运行 Kotlin/JS 项目，此任务是 `browserDevelopmentRun` 任务的别名（该任务在 Kotlin 多平台项目中也可用）。它使用 [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) 来提供你的 JavaScript 制品。
如果你想自定义 `webpack-dev-server` 使用的配置，例如，调整服务器运行的端口，请使用 [webpack 配置文件](#webpack-bundling)。

对于运行面向 Node.js 的 Kotlin/JS 项目，请使用 `jsNodeDevelopmentRun` 任务，它是 `nodeRun` 任务的别名。

要运行项目，请执行标准生命周期 `jsBrowserDevelopmentRun` 任务或其对应的别名：

```bash
./gradlew jsBrowserDevelopmentRun
```

要更改源文件后自动触发应用程序的重新构建，请使用 Gradle [持续构建](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) 功能：

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

或者

```bash
./gradlew jsBrowserDevelopmentRun -t
```

项目构建成功后，`webpack-dev-server` 将自动刷新浏览器页面。

## test 任务

Kotlin Multiplatform Gradle 插件会自动为项目设置测试基础结构。对于浏览器项目，它会下载并安装 [Karma](https://karma-runner.github.io/) 测试运行器以及其他必需的依赖项；对于 Node.js 项目，将使用 [Mocha](https://mochajs.org/) 测试框架。

该插件还提供有用的测试功能，例如：

* Source maps 生成
* 测试报告生成
* 控制台中的测试运行结果

对于运行浏览器测试，该插件默认使用 [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README)。你还可以选择另一个浏览器来运行测试，方法是在构建脚本的 `useKarma {}` 块中添加相应的条目：

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

或者，你可以在 `gradle.properties` 文件中为浏览器添加测试目标：

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

此方法允许你为所有模块定义浏览器列表，然后在特定模块的构建脚本中添加特定浏览器。

请注意，Kotlin Multiplatform Gradle 插件不会自动为你安装这些浏览器，而只会使用其执行环境中可用的浏览器。例如，如果在持续集成服务器上执行 Kotlin/JS 测试，请确保已安装要测试的浏览器。

如果要跳过测试，请将 `enabled = false` 行添加到 `testTask {}`：

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

要指定 Node.js 测试运行器使用的环境变量（例如，将外部信息传递给测试，或微调包解析），请在构建脚本的 `testTask {}` 块中使用带有键值对的 `environment()` 函数：

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

Kotlin Multiplatform Gradle 插件会在构建时自动生成 Karma 配置文件，该文件包含来自 `build.gradle(.kts)` 中的 [`kotlin.js.browser.testTask.useKarma {}` 块](#test-task) 的设置。你可以在 `build/js/packages/projectName-test/karma.conf.js` 中找到该文件。
要调整 Karma 使用的配置，请将其他配置文件放置在项目根目录中名为 `karma.config.d` 的目录中。此目录中的所有 `.js` 配置文件都将被拾取，并在构建时自动合并到生成的 `karma.conf.js` 中。

Karma 的 [文档](https://karma-runner.github.io/5.0/config/configuration-file.html) 中很好地描述了所有 Karma 配置功能。

## webpack 打包

对于浏览器目标，Kotlin Multiplatform Gradle 插件使用广为人知的 [webpack](https://webpack.js.org/) 模块打包器。

### webpack 版本

Kotlin Multiplatform 插件使用 webpack 5。

如果你有使用低于 1.5.0 的插件版本创建的项目，你可以通过将以下行添加到项目的 `gradle.properties` 中来暂时切换回这些版本中使用的 webpack 4：

```none
kotlin.js.webpack.major.version=4
```

### webpack 任务

最常见的 webpack 调整可以直接通过 Gradle 构建文件中的 `kotlin.js.browser.webpackTask {}` 配置块进行：
* `outputFileName` - webpacked 输出文件的名称。在执行 webpack 任务后，它将在 `<projectDir>/build/dist/<targetName>` 中生成。默认值为项目名称。
* `output.libraryTarget` - webpacked 输出的模块系统。了解有关 [Kotlin/JS 项目的可用模块系统](js-modules) 的更多信息。默认值为 `umd`。
  
```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

你还可以配置通用 webpack 设置，以在 `commonWebpackConfig {}` 块中的打包、运行和测试任务中使用。

### webpack 配置文件

Kotlin Multiplatform Gradle 插件会在构建时自动生成一个标准的 webpack 配置文件。它位于 `build/js/packages/projectName/webpack.config.js` 中。

如果要对 webpack 配置进行进一步调整，请将其他配置文件放置在项目根目录中名为 `webpack.config.d` 的目录中。构建项目时，所有 `.js` 配置文件都将自动合并到 `build/js/packages/projectName/webpack.config.js` 文件中。
例如，要添加新的 [webpack loader](https://webpack.js.org/loaders/)，请将以下内容添加到 `webpack.config.d` 目录中的 `.js` 文件中：

:::note
在这种情况下，配置对象是 `config` 全局对象。你需要在脚本中修改它。

:::

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

其 [文档](https://webpack.js.org/concepts/configuration/) 中很好地描述了所有 webpack 配置功能。

### 构建可执行文件

为了通过 webpack 构建可执行的 JavaScript 制品，Kotlin Multiplatform Gradle 插件包含 `browserDevelopmentWebpack` 和 `browserProductionWebpack` Gradle 任务。

* `browserDevelopmentWebpack` 创建开发制品，这些制品尺寸较大，但创建时间很短。因此，在主动开发期间使用 `browserDevelopmentWebpack` 任务。

* `browserProductionWebpack` 将无用代码消除应用于生成的制品，并最小化生成的 JavaScript 文件，这需要更多时间，但会生成尺寸较小的可执行文件。因此，在准备将项目用于生产用途时，请使用 `browserProductionWebpack` 任务。
 
 执行这些任务中的任何一个以获取开发或生产的相应制品。除非 [另有说明](#distribution-target-directory)，否则生成的文件将在 `build/dist` 中可用。

```bash
./gradlew browserProductionWebpack
```

请注意，仅当你的目标配置为生成可执行文件（通过 `binaries.executable()`）时，这些任务才可用。

## CSS

Kotlin Multiplatform Gradle 插件还提供对 webpack 的 [CSS](https://webpack.js.org/loaders/css-loader/) 和 [style](https://webpack.js.org/loaders/style-loader/) loader 的支持。虽然可以通过直接修改用于构建项目的 [webpack 配置文件](#webpack-bundling) 来更改所有选项，但最常用的设置可以直接从 `build.gradle(.kts)` 文件中使用。

要在项目中启用 CSS 支持，请在 Gradle 构建文件的 `commonWebpackConfig {}` 块中设置 `cssSupport.enabled` 选项。使用向导创建新项目时，也会默认启用此配置。

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

或者，你可以为 `webpackTask {}`、`runTask {}` 和 `testTask {}` 独立添加 CSS 支持：

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

在项目中激活 CSS 支持有助于防止在尝试使用未配置项目中的样式表时发生的常见错误，例如 `Module parse failed: Unexpected character '@' (14:0)`。

你可以使用 `cssSupport.mode` 来指定应如何处理遇到的 CSS。以下值可用：

* `"inline"`（默认）：样式将添加到全局 `<style>` 标记。
* `"extract"`：样式将提取到单独的文件中。然后可以从 HTML 页面中包含它们。
* `"import"`：样式将处理为字符串。如果需要从代码访问 CSS（例如 `val styles = require("main.css")`），这将非常有用。

要对同一项目使用不同的模式，请使用 `cssSupport.rules`。在这里，你可以指定 `KotlinWebpackCssRules` 的列表，每个规则都定义一个模式，以及 [include](https://webpack.js.org/configuration/module/#ruleinclude) 和 [exclude](https://webpack.js.org/configuration/module/#ruleexclude) 模式。

## Node.js

对于面向 Node.js 的 Kotlin/JS 项目，该插件会自动在主机上下载并安装 Node.js 环境。
如果你有现有的 Node.js 实例，也可以使用它。

### 配置 Node.js 设置

你可以为每个子项目配置 Node.js 设置，或者为整个项目设置它们。

例如，要为特定子项目设置 Node.js 版本，请在 `build.gradle(.kts)` 文件中将其 Gradle 块添加到以下行：

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

要为整个项目（包括所有子项目）设置版本，请将相同的代码应用于 `allProjects {}` 块：

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
使用 `NodeJsRootPlugin` 类为整个项目配置 Node.js 设置已弃用，最终将停止支持。

:::

### 使用预安装的 Node.js

如果主机上已安装 Node.js，你可以在其中构建 Kotlin/JS 项目，你可以配置 Kotlin Multiplatform Gradle 插件以使用它，而不是安装自己的 Node.js 实例。

要使用预安装的 Node.js 实例，请将以下行添加到 `build.gradle(.kts)` 文件中：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    // 设置为 `true` 以获得默认行为
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).download = false
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    // 设置为 `true` 以获得默认行为
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().download = false
}
```

</TabItem>
</Tabs>

## Yarn

默认情况下，为了在构建时下载和安装你声明的依赖项，该插件会管理自己的 [Yarn](https://yarnpkg.com/lang/en/) 包管理器的实例。它可以直接使用，无需额外配置，但你可以调整它或使用主机上已安装的 Yarn。

### 其他 Yarn 功能：.yarnrc

要配置其他 Yarn 功能，请将 `.yarnrc` 文件放置在项目根目录中。
在构建时，它会被自动拾取。

例如，要使用 npm 包的自定义注册表，请将以下行添加到项目根目录中名为 `.yarnrc` 的文件中：

```text
registry "http://my.registry/api/npm/"
```

要了解有关 `.yarnrc` 的更多信息，请访问 [Yarn 官方文档](https://classic.yarnpkg.com/en/docs/yarnrc/)。

### 使用预安装的 Yarn

如果主机上已安装 Yarn，你可以在其中构建 Kotlin/JS 项目，你可以配置 Kotlin Multiplatform Gradle 插件以使用它，而不是安装自己的 Yarn 实例。

要使用预安装的 Yarn 实例，请将以下行添加到 `build.gradle(.kts)`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
    // "true" 用于默认行为
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

### 通过 kotlin-js-store 进行版本锁定

:::note
自 Kotlin 1.6.10 起，版本锁定通过 `kotlin-js-store` 提供。

:::

项目根目录中的 `kotlin-js-store` 目录由 Kotlin Multiplatform Gradle 插件自动生成，用于保存 `yarn.lock` 文件，这对于版本锁定是必需的。锁定文件完全由 Yarn 插件管理，并在执行 `kotlinNpmInstall` Gradle 任务期间更新。

为了遵循 [推荐做法](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，
请将 `kotlin-js-store` 及其内容提交到版本控制系统。它确保你的应用程序在所有计算机上都使用完全相同的依赖项树进行构建。

如果需要，你可以在 `build.gradle(.kts)` 中更改目录和锁定文件名：

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
更改锁定文件的名称可能会导致依赖项检查工具不再拾取该文件。

要了解有关 `yarn.lock` 的更多信息，请访问 [Yarn 官方文档](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/)。

### 报告 yarn.lock 已更新

Kotlin/JS 提供了 Gradle 设置，可以在 `yarn.lock` 文件已更新时通知你。
如果你希望在 CI 构建过程中 `yarn.lock` 已被静默更改时收到通知，则可以使用这些设置：

* `YarnLockMismatchReport`，用于指定如何报告对 `yarn.lock` 文件的更改。你可以使用以下值之一：
    * `FAIL` 使相应的 Gradle 任务失败。这是默认设置。
    * `WARNING` 在警告日志中写入有关更改的信息。
    * `NONE` 禁用报告。
* `reportNewYarnLock`，用于显式报告最近创建的 `yarn.lock` 文件。默认情况下，此选项已禁用：在首次启动时生成新的 `yarn.lock` 文件是一种常见的做法。你可以使用此选项来确保该文件已提交到你的存储库。
* `yarnLockAutoReplace`，每次运行 Gradle 任务时都会自动替换 `yarn.lock`。

要使用这些选项，请按如下所示更新 `build.gradle(.kts)`：

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

### 默认情况下使用 --ignore-scripts 安装 npm 依赖项

:::note
自 Kotlin 1.6.10 起，默认情况下可以使用 `--ignore-scripts` 安装 npm 依赖项。

:::

为了降低执行来自受损 npm 包的恶意代码的可能性，Kotlin Multiplatform Gradle 插件默认情况下会阻止在安装 npm 依赖项期间执行 [生命周期脚本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。

你可以通过将以下行添加到 `build.gradle(.kts)` 来显式启用生命周期脚本执行：

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

## 分发目标目录

默认情况下，Kotlin/JS 项目构建的结果位于项目根目录中的 `/build/dist/<targetName>/<binaryName>` 目录中。

> 在 Kotlin 1.9.0 之前，默认分发目标目录是 `/build/distributions`。

要为项目分发文件设置另一个位置，请在 `browser {}` 块内的构建脚本中，添加一个 `distribution {}` 块，并通过使用 `set()` 方法为 `outputDirectory` 属性赋值。
运行项目构建任务后，Gradle 会将输出包与项目资源一起保存在此位置。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

## 模块名称

要调整 JavaScript _模块_ 的名称（在 `build/js/packages/myModuleName` 中生成），包括
相应的 `.js` 和 `.d.ts` 文件，请使用 `moduleName` 选项：

```groovy
js {
    moduleName = "myModuleName"
}
```

请注意，这不会影响 `build/dist` 中的 webpacked 输出。

## package.json 自定义

`package.json` 文件包含 JavaScript 包的元数据。流行的包注册表（如 npm）要求所有
已发布的包都具有此类文件。他们使用它来跟踪和管理包发布。

Kotlin Multiplatform Gradle 插件在构建时会自动为 Kotlin/JS 项目生成 `package.json`。默认情况下，
该文件包含基本数据：名称、版本、许可证、依赖项和其他一些包属性。

除了基本的包属性之外，`package.json` 还可以定义 JavaScript 项目的行为方式，例如，
识别可运行的脚本。

你可以通过 Gradle DSL 将自定义条目添加到项目的 `package.json` 中。要将自定义字段添加到你的 `package.json` 中，
请在编译 `packageJson` 块中使用 `customField()` 函数：

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

构建项目时，此代码会将以下块添加到 `package.json` 文件中：

```json
"hello": {
    "one": 1,
    "two": 2
}
```

在 [npm 文档](https://