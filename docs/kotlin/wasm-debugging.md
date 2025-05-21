---
title: "调试 Kotlin/Wasm 代码"
---
:::note
Kotlin/Wasm 处于 [Alpha](components-stability) 阶段。它可能随时更改。

:::

本教程演示了如何使用浏览器调试使用 Kotlin/Wasm 构建的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用程序。

## 开始之前

使用 Kotlin Multiplatform 向导创建一个项目：

1. 打开 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com/#newProject)。
2. 在 **New Project（新项目）** 选项卡上，根据你的偏好更改项目名称和 ID。在本教程中，我们将名称设置为“WasmDemo”，ID 设置为“wasm.project.demo”。

   > 这些是项目目录的名称和 ID。你也可以保留它们不变。
   >
   

3. 选择 **Web** 选项。确保未选择任何其他选项。
4. 点击 **Download（下载）** 按钮并解压生成的存档。

<img src="/img/wasm-compose-web-wizard.png" alt="Kotlin Multiplatform wizard" width="400" style={{verticalAlign: 'middle'}}/>

## 在 IntelliJ IDEA 中打开项目

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 的 Welcome（欢迎）屏幕上，点击 **Open（打开）** 或在菜单栏中选择 **File（文件） | Open（打开）**。
3. 导航到解压后的“WasmDemo”文件夹，然后点击 **Open（打开）**。

## 运行应用程序

1. 在 IntelliJ IDEA 中，选择 **View（视图） | Tool Windows（工具窗口） | Gradle**，打开 **Gradle** 工具窗口。

   > 你至少需要 Java 11 作为 Gradle JVM 才能成功加载任务。
   >
   

2. 在 **composeApp | Tasks（任务） | kotlin browser** 中，选择并运行 **wasmJsBrowserDevelopmentRun** 任务。

   <img src="/img/wasm-gradle-task-window.png" alt="Run the Gradle task" width="550" style={{verticalAlign: 'middle'}}/>

   或者，你可以在终端中从 `WasmDemo` 根目录运行以下命令：

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
   ```

3. 应用程序启动后，在浏览器中打开以下 URL：

   ```bash
   http://localhost:8080/
   ```

   > 端口号可能会有所不同，因为 8080 端口可能不可用。你可以在 Gradle 构建控制台中找到实际的端口号。
   >
   

   你将看到一个“Click me!（点击我！）”按钮。点击它：

   <img src="/img/wasm-composeapp-browser-clickme.png" alt="Click me" width="550" style={{verticalAlign: 'middle'}}/>

   现在你将看到 Compose Multiplatform 徽标：

   <img src="/img/wasm-composeapp-browser.png" alt="Compose app in browser" width="550" style={{verticalAlign: 'middle'}}/>

## 在浏览器中调试

:::note
目前，调试仅在浏览器中可用。将来，你将能够在 [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA) 中调试代码。

:::

你可以直接在浏览器中调试此 Compose Multiplatform 应用程序，而无需其他配置。

但是，对于其他项目，你可能需要在 Gradle 构建文件中配置其他设置。有关如何配置浏览器以进行调试的更多信息，请展开下一节。

### 配置浏览器以进行调试

#### 启用对项目源的访问

默认情况下，浏览器无法访问调试所需的某些项目源。要提供访问权限，你可以配置 Webpack DevServer 以提供这些源。在 `ComposeApp` 目录中，将以下代码段添加到你的 `build.gradle.kts` 文件中。

添加此导入作为顶级声明：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

将此代码段添加到位于 `kotlin{}` 中的 `wasmJs{}` target DSL 和 `browser{}` platform DSL 中的 `commonWebpackConfig{}` 块内：

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // Serve sources to debug inside browser
        add(project.rootDir.path)
        add(project.projectDir.path)
    }
}
```

结果代码块如下所示：

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

:::note
目前，你无法调试库源。
[我们将来会支持这一点](https://youtrack.jetbrains.com/issue/KT-64685)。

:::

#### 使用自定义格式化程序（custom formatters）

自定义格式化程序有助于在调试 Kotlin/Wasm 代码时，以更用户友好和易于理解的方式显示和定位变量值。

默认情况下，自定义格式化程序在开发版本中启用，因此你不需要其他 Gradle 配置。

此功能在 Firefox 和基于 Chromium 的浏览器中受支持，因为它使用 [custom formatters API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)。

要使用此功能，请确保在浏览器的开发者工具中启用了自定义格式化程序：

* 在 Chrome DevTools 中，在 **Settings（设置） | Preferences（偏好设置） | Console（控制台）** 中找到自定义格式化程序复选框：

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Enable custom formatters in Chrome" width="400" style={{verticalAlign: 'middle'}}/>

* 在 Firefox DevTools 中，在 **Settings（设置） | Advanced settings（高级设置）** 中找到自定义格式化程序复选框：

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Enable custom formatters in Firefox" width="400" style={{verticalAlign: 'middle'}}/>

自定义格式化程序适用于 Kotlin/Wasm 开发版本。如果你对生产版本有特定要求，则需要相应地调整 Gradle 配置。将以下编译器选项添加到 `wasmJs {}` 块中：

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

启用自定义格式化程序后，你可以继续学习调试教程。

### 调试 Kotlin/Wasm 应用程序

:::tip
本教程使用 Chrome 浏览器，但你应该可以使用其他浏览器按照这些步骤操作。有关更多信息，请参见 [浏览器版本](wasm-troubleshooting#browser-versions)。

:::

1. 在应用程序的浏览器窗口中，右键单击并选择 **Inspect（检查）** 操作以访问开发者工具。
   或者，你可以使用 **F12** 快捷方式或选择 **View（视图） | Developer（开发者） | Developer Tools（开发者工具）**。

2. 切换到 **Sources（源代码）** 选项卡，然后选择要调试的 Kotlin 文件。在本教程中，我们将使用 `Greeting.kt` 文件。

3. 点击行号以在你想要检查的代码上设置断点。只有数字较深的行才能设置断点。

   <img src="/img/wasm-breakpoints.png" alt="Set breakpoints" width="600" style={{verticalAlign: 'middle'}}/>

4. 点击 **Click me!（点击我！）** 按钮以与应用程序交互。此操作触发代码的执行，并且调试器会在执行到达断点时暂停。

5. 在调试窗格中，使用调试控制按钮来检查断点处的变量和代码执行：
   * <img src="/img/wasm-step-into.png" alt="Step into" width="30" style={{verticalAlign: 'middle'}}/> Step into（步入）以更深入地调查函数。
   * <img src="/img/wasm-step-over.png" alt="Step over" width="30" style={{verticalAlign: 'middle'}}/> Step over（步过）以执行当前行并在下一行暂停。
   * <img src="/img/wasm-step-out.png" alt="Step out" width="30" style={{verticalAlign: 'middle'}}/> Step out（步出）以执行代码直到它退出当前函数。

   <img src="/img/wasm-debug-controls.png" alt="Debug controls" width="600" style={{verticalAlign: 'middle'}}/>

6. 检查 **Call stack（调用堆栈）** 和 **Scope（作用域）** 窗格以跟踪函数调用的顺序并查明任何错误的位置。

   <img src="/img/wasm-debug-scope.png" alt="Check call stack" width="550" style={{verticalAlign: 'middle'}}/>

   要改进变量值的可视化效果，请参阅 [Configure your browser for debugging（配置你的浏览器以进行调试）](#configure-your-browser-for-debugging) 部分中的 _Use custom formatters（使用自定义格式化程序）_。

7. 更改你的代码并再次 [run the application（运行应用程序）](#run-the-application) 以验证一切是否按预期工作。
8. 点击带有断点的行号以删除断点。

## 留下反馈

我们感谢你对调试体验的任何反馈！

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack：[获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并在我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道中直接向开发人员提供反馈。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供你的反馈。

## 接下来是什么？

* 在此 [YouTube 视频](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s) 中查看 Kotlin/Wasm 调试的实际应用。
* 尝试来自我们的 `kotlin-wasm-examples` 存储库的 Kotlin/Wasm 示例：
   * [Compose image viewer（Compose 图像查看器）](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack application（Jetsnack 应用程序）](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js example（Node.js 示例）](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI example（WASI 示例）](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose example（Compose 示例）](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)