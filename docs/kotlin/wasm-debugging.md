[//]: # (title: 调试 Kotlin/Wasm 代码)

> Kotlin/Wasm 处于 [Alpha](components-stability.md) 阶段。它可能随时更改。
>
{style="note"}

本教程演示了如何使用浏览器调试你用 Kotlin/Wasm 构建的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用程序。

## 开始之前

使用 Kotlin Multiplatform 向导创建项目：

1. 打开 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com/#newProject)。
2. 在 **New Project**（新项目）选项卡上，将项目名称和 ID 更改为你喜欢的。在本教程中，我们将名称设置为 "WasmDemo"，ID 设置为 "wasm.project.demo"。

   > 这些是项目目录的名称和 ID。你也可以保持它们不变。
   >
   {style="tip"}

3. 选择 **Web** 选项。确保没有选择其他选项。
4. 点击 **Download**（下载）按钮并解压生成的归档文件。

   ![Kotlin Multiplatform 向导](wasm-compose-web-wizard.png){width=450}

## 在 IntelliJ IDEA 中打开项目

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 的欢迎屏幕上，点击 **Open**（打开）或在菜单栏中选择 **File | Open**（文件 | 打开）。
3. 导航到解压后的 "WasmDemo" 文件夹并点击 **Open**（打开）。

## 运行应用程序

1. 在 IntelliJ IDEA 中，通过选择 **View** | **Tool Windows** | **Gradle**（视图 | 工具窗口 | Gradle）打开 **Gradle** 工具窗口。

   > 你的 Gradle JVM 至少需要 Java 11，才能成功加载任务。
   >
   {style="note"}

2. 在 **composeApp** | **Tasks** | **kotlin browser** 中，选择并运行 **wasmJsBrowserDevelopmentRun** 任务。

   ![运行 Gradle 任务](wasm-gradle-task-window.png){width=450}

   或者，你可以在 `WasmDemo` 根目录的终端中运行以下命令：

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
   ```

3. 应用程序启动后，在浏览器中打开以下 URL：

   ```bash
   http://localhost:8080/
   ```

   > 端口号可能会有所不同，因为 8080 端口可能不可用。你可以在 Gradle 构建控制台中找到实际的端口号。
   >
   {style="tip"}

   你将看到一个 "Click me!"（点击我！）按钮。点击它：

   ![点击我](wasm-composeapp-browser-clickme.png){width=550}

   现在你将看到 Compose Multiplatform 标志：

   ![浏览器中的 Compose 应用程序](wasm-composeapp-browser.png){width=550}

## 在浏览器中调试

> 目前，调试只能在浏览器中进行。将来，你将能够在 [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA) 中调试代码。
>
{style="note"}

你可以开箱即用地在浏览器中调试这个 Compose Multiplatform 应用程序，无需额外配置。

但是，对于其他项目，你可能需要在 Gradle 构建文件中配置其他设置。有关如何为调试配置浏览器的更多信息，请展开下一节。

### 配置浏览器以进行调试 {initial-collapse-state="collapsed" collapsible="true"}

#### 启用对项目源文件的访问

默认情况下，浏览器无法访问调试所需的一些项目源文件。要提供访问权限，你可以配置 Webpack DevServer 来提供这些源文件。在 `ComposeApp` 目录中，将以下代码片段添加到你的 `build.gradle.kts` 文件中。

将此导入作为顶级声明添加：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

将此代码片段添加到 `kotlin{}` 中的 `wasmJs{}` 目标 DSL 和 `browser{}` 平台 DSL 中 `commonWebpackConfig{}` 块内部：

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // Serve sources to debug inside browser
        add(project.rootDir.path)
        add(project.projectDir.path)
    }
}
```

最终的代码块如下所示：

```kotlin
kotlin {
    @OptIn(ExperimentalWasmDsl::class)
    wasmJs {
        moduleName = "composeApp"
        browser {
            commonWebpackConfig {
                outputFileName = "composeApp.js"
                devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
                    static = (static ?: mutableListOf()).apply {
                        // Serve sources to debug inside browser
                        add(project.rootDir.path)
                        add(project.projectDir.path)
                    }
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"}

> 目前，你无法调试库源文件。[我们将在未来支持此功能](https://youtrack.jetbrains.com/issue/KT-64685)。
>
{style="note"}

#### 使用自定义格式化程序

自定义格式化程序有助于在调试 Kotlin/Wasm 代码时以更用户友好和易于理解的方式显示和定位变量值。

自定义格式化程序在开发构建中默认启用，因此你无需额外的 Gradle 配置。

此功能在 Firefox 和基于 Chromium 的浏览器中受支持，因为它使用 [自定义格式化程序 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)。

要使用此功能，请确保你的浏览器开发者工具中启用了自定义格式化程序：

* 在 Chrome DevTools 中，在 **Settings | Preferences | Console**（设置 | 首选项 | 控制台）中找到自定义格式化程序复选框：

  ![在 Chrome 中启用自定义格式化程序](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox DevTools 中，在 **Settings | Advanced settings**（设置 | 高级设置）中找到自定义格式化程序复选框：

  ![在 Firefox 中启用自定义格式化程序](wasm-custom-formatters-firefox.png){width=400}

自定义格式化程序适用于 Kotlin/Wasm 开发构建。如果你对生产构建有特定要求，则需要相应地调整 Gradle 配置。将以下编译器选项添加到 `wasmJs {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

启用自定义格式化程序后，你可以继续调试教程。

### 调试你的 Kotlin/Wasm 应用程序

> 本教程使用 Chrome 浏览器，但你应该能够使用其他浏览器按照这些步骤操作。有关更多信息，请参阅[浏览器版本](wasm-troubleshooting.md#browser-versions)。
>
{style="tip"}

1. 在应用程序的浏览器窗口中，右键单击并选择 **Inspect**（检查）操作以访问开发者工具。
   或者，你可以使用 **F12** 快捷键或选择 **View** | **Developer** | **Developer Tools**（视图 | 开发者 | 开发者工具）。

2. 切换到 **Sources**（源）选项卡并选择要调试的 Kotlin 文件。在本教程中，我们将使用 `Greeting.kt` 文件。

3. 点击行号以在你想要检查的代码上设置断点。只有深色数字的行才能设置断点。

   ![设置断点](wasm-breakpoints.png){width=700}

4. 点击 **Click me!**（点击我！）按钮与应用程序交互。此操作会触发代码执行，当执行到达断点时，调试器会暂停。

5. 在调试窗格中，使用调试控制按钮检查断点处的变量和代码执行：
   * ![步进](wasm-step-into.png){width=30}{type="joined"} **步进**（Step into）以更深入地调查函数。
   * ![步过](wasm-step-over.png){width=30}{type="joined"} **步过**（Step over）以执行当前行并在下一行暂停。
   * ![步出](wasm-step-out.png){width=30}{type="joined"} **步出**（Step out）以执行代码直到它退出当前函数。

   ![调试控件](wasm-debug-controls.png){width=450}

6. 检查 **Call stack**（调用堆栈）和 **Scope**（作用域）窗格，以跟踪函数调用序列并查明任何错误的位置。

   ![检查调用堆栈](wasm-debug-scope.png){width=450}

   为了更好地可视化变量值，请参阅[配置浏览器以进行调试](#configure-your-browser-for-debugging)部分中的 _使用自定义格式化程序_。

7. 更改代码并再次[运行应用程序](#run-the-application)以验证一切是否按预期工作。
8. 点击设置了断点的行号以移除断点。

## 提供反馈

我们非常感谢你对调试体验的任何反馈！

* ![Slack](slack.svg){width=25}{type="joined"} Slack：[获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并在我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道中直接向开发者提供反馈。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供你的反馈。

## 接下来是什么？

* 观看此 [YouTube 视频](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s)，了解 Kotlin/Wasm 调试的实际操作。
* 尝试我们 `kotlin-wasm-examples` 仓库中的 Kotlin/Wasm 示例：
   * [Compose 图像查看器](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack 应用程序](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)