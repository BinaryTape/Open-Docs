[//]: # (title: 调试 Kotlin/Wasm 代码)

<primary-label ref="beta"/> 

本教程演示如何使用 IntelliJ IDEA 和浏览器调试你通过 Kotlin/Wasm 构建的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用程序。

## 开始之前

1.  [为 Kotlin Multiplatform 开发设置环境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment)。
2.  按照说明[创建一个面向 Kotlin/Wasm 的 Kotlin Multiplatform 项目](wasm-get-started.md#create-a-project)。

> *   在 IntelliJ IDEA 中调试 Kotlin/Wasm 代码从 IDE 2025.3 版本开始提供，目前处于 [抢先体验计划 (EAP)](https://www.jetbrains.com/resources/eap/) 阶段，并正在走向稳定。如果你是在不同版本的 IntelliJ IDEA 中创建的 `WasmDemo` 项目，请切换到 2025.3 版本并在其中打开项目，以继续本教程。
> *   要在 IntelliJ IDEA 中调试 Kotlin/Wasm 代码，必须安装 JavaScript Debugger 插件。[了解更多关于该插件以及如何安装的信息。](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#ws_js_debugging_chrome_before_you_start)
>
{style="note"}

## 在 IntelliJ IDEA 中调试

你创建的 Kotlin Multiplatform 项目包含一个由 Kotlin/Wasm 提供支持的 Compose Multiplatform 应用程序。你可以[开箱即用](https://www.techtarget.com/whatis/definition/out-of-the-box-OOTB)地在 IntelliJ IDEA 中调试此应用程序，无需额外配置。

1.  在 IntelliJ IDEA 中，打开要调试的 Kotlin 文件。在本教程中，我们将使用 Kotlin Multiplatform 项目以下目录中的 `Greeting.kt` 文件：

    `WasmDemo/composeApp/src/wasmJsMain/kotlin/wasm.project.demo.wasmdemo`

2.  点击行号以在你想要探查的代码上设置断点。

    ![设置断点](wasm-breakpoints-intellij.png){width=650}

3.  在运行配置列表中，选择 **composeApp[wasmJs]**。
4.  点击屏幕顶部的调试图标，以调试模式运行代码。

    ![以调试模式运行](wasm-debug-run-configurations.png){width=600}

    应用程序启动后，它会在新的浏览器窗口中打开。

    ![浏览器中的 Compose 应用程序](wasm-composeapp-browser.png){width=600}

    同时，**Debug** 面板会在 IntelliJ IDEA 中自动打开。

    ![Compose 应用程序调试器](wasm-debug-pane.png){width=600}

### 探查你的应用程序

> 如果你正在[浏览器中调试](#debug-in-your-browser)，你可以按照相同的步骤来探查你的应用程序。
>
{style="note"}

1.  在应用程序的浏览器窗口中，点击“点击我！”按钮与应用程序进行交互。此操作会触发代码执行，当执行到达断点时，调试器会暂停。

2.  在调试窗格中，使用调试控制按钮在断点处探查变量和代码执行：
    *   ![步过](wasm-debug-step-over.png){width=30}{type="joined"} 步过以执行当前行并在下一行暂停。
    *   ![步入](wasm-debug-step-into.png){width=30}{type="joined"} 步入以更深入地探究函数。
    *   ![步出](wasm-debug-step-out.png){width=30}{type="joined"} 步出以执行代码直到退出当前函数。

3.  检查 **Threads & Variables** 窗格。它有助于你追溯函数调用序列，并找出任何错误的位置。

    ![检查线程与变量](wasm-debug-panes-intellij.png){width=700}

4.  更改你的代码并再次运行应用程序以验证其工作情况。
5.  完成调试后，点击带有断点的行号以移除断点。

## 在浏览器中调试

你也可以在浏览器中调试这个 Compose Multiplatform 应用程序，无需额外配置。

当你运行开发 Gradle 任务 (`*DevRun`) 时，Kotlin 会自动将源代码文件提供给浏览器，从而允许你设置断点、探查变量并单步调试 Kotlin 代码。

用于在浏览器中提供 Kotlin/Wasm 项目源代码的配置现在已包含在 Kotlin Gradle 插件中。如果你之前已将此配置添加到 `build.gradle.kts` 文件中，则应将其移除以避免冲突。

> 本教程使用 Chrome 浏览器，但你应该能够使用其他浏览器遵循这些步骤。有关更多信息，请参见 [浏览器版本](wasm-configuration.md#browser-versions)。
>
{style="tip"}

1.  按照说明[运行 Compose Multiplatform 应用程序](wasm-get-started.md#run-the-application)。

2.  在应用程序的浏览器窗口中，右键单击并选择 **检查** 操作以访问开发者工具。此外，你也可以使用 **F12** 快捷键或选择 **视图** | **开发者** | **开发者工具**。

3.  切换到 **源代码** 选项卡并选择要调试的 Kotlin 文件。在本教程中，我们将使用 `Greeting.kt` 文件。

4.  点击行号以在你想要探查的代码上设置断点。只有数字颜色较深的行才能设置断点 — 在此示例中为 4、7、8 和 9。

    ![设置断点](wasm-breakpoints-browser.png){width=700}

5.  探查你的应用程序，类似于[在 IntelliJ IDEA 中调试](#inspect-your-application)。

    在浏览器中调试时，用于追溯函数调用序列并找出任何错误的窗格是 **Scope** 和 **Call Stack**。

    ![检查调用堆栈](wasm-debug-scope.png){width=450}

### 使用自定义格式化器

自定义格式化器有助于在浏览器中调试 Kotlin/Wasm 代码时，以更用户友好和易于理解的方式显示和定位变量值。

自定义格式化器在 Kotlin/Wasm 开发构建中默认已启用，但你仍需确保在浏览器的开发者工具中启用了自定义格式化器：

*   在 Chrome DevTools 中，在 **设置 | 偏好设置 | 控制台** 中找到 **Custom formatters** 复选框：

    ![在 Chrome 中启用自定义格式化器](wasm-custom-formatters-chrome.png){width=400}

*   在 Firefox DevTools 中，在 **设置 | 高级设置** 中找到 **Enable custom formatters** 复选框：

    ![在 Firefox 中启用自定义格式化器](wasm-custom-formatters-firefox.png){width=400}

此特性使用了 [自定义格式化器 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)，并在 Firefox 和基于 Chromium 的浏览器中受支持。

鉴于自定义格式化器默认仅适用于 Kotlin/Wasm 开发构建，如果你想在生产构建中使用它们，则需要调整你的 Gradle 配置。将以下编译器选项添加到 `wasmJs {}` 代码块中：

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

## 留下反馈

我们非常感谢你对调试体验的任何反馈！

*   ![Slack](slack.svg){width=25}{type="joined"} Slack: [获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并直接向我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道中的开发者提供反馈。
*   在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供你的反馈。

## 接下来？

*   观看此 [YouTube 视频](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s) 中的 Kotlin/Wasm 调试实际操作。
*   尝试更多 Kotlin/Wasm 示例：
    *   [KotlinConf 应用程序](https://github.com/JetBrains/kotlinconf-app)
    *   [Compose 图片查看器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
    *   [Jetsnack 应用程序](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
    *   [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
    *   [WASI 示例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
    *   [Compose 示例](https://github.com/Kotlin/kotlin-wasm-compose-template)