[//]: # (title: 调试 Kotlin/Wasm 代码)

<primary-label ref="beta"/> 

本教程演示如何使用 IntelliJ IDEA 和浏览器调试使用 Kotlin/Wasm 构建的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用程序。

## 开始之前

1. [设置 Kotlin Multiplatform 开发环境](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)。
2. 按照说明[创建一个以 Kotlin/Wasm 为目标的 Kotlin Multiplatform 项目](wasm-get-started.md#create-a-project)。

> * 在 IntelliJ IDEA 中调试 Kotlin/Wasm 代码从 IDE 的 2025.3 版本开始可用，该版本目前处于[抢先体验计划 (EAP)](https://www.jetbrains.com/resources/eap/) 中，并且即将发布稳定版。如果你在不同版本的 IntelliJ IDEA 中创建了 `WasmDemo` 项目，请切换到 2025.3 版本并在其中打开该项目以继续本教程。
> * 要在 IntelliJ IDEA 中调试 Kotlin/Wasm 代码，你必须安装 JavaScript Debugger 插件。[查看有关该插件及其安装方法的更多信息。](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#ws_js_debugging_chrome_before_you_start)
>
{style="note"}

## 在 IntelliJ IDEA 中调试

你创建的 Kotlin Multiplatform 项目包含一个由 Kotlin/Wasm 驱动的 Compose Multiplatform 应用程序。你可以开箱即用地在 IntelliJ IDEA 中调试此应用程序，无需额外配置。

1. 在 IntelliJ IDEA 中，打开要调试的 Kotlin 文件。在本教程中，我们将使用 Kotlin Multiplatform 项目以下目录中的 `Greeting.kt` 文件：

   `WasmDemo/composeApp/src/wasmJsMain/kotlin/wasm.project.demo.wasmdemo`

2. 点击行号，在要检查的代码上设置断点。

   ![设置断点](wasm-breakpoints-intellij.png){width=650}

3. 在运行配置列表中，选择 **composeApp[wasmJs]**。
4. 点击屏幕顶部的调试图标，以调试模式运行代码。

   ![以调试模式运行](wasm-debug-run-configurations.png){width=600}

   应用程序启动后，它会在一个新的浏览器窗口中打开。

   ![浏览器中的 Compose 应用](wasm-composeapp-browser.png){width=600}

   此外，IntelliJ IDEA 中会自动打开 **Debug** 面板。

   ![Compose 应用调试器](wasm-debug-pane.png){width=600}

### 检查你的应用程序

> 如果你正在[在浏览器中调试](#debug-in-your-browser)，可以按照相同的步骤检查你的应用程序。
>
{style="note"}

1. 在应用程序的浏览器窗口中，点击 **Click me!** 按钮与应用程序交互。此操作会触发代码执行，调试器会在执行到达断点时暂停。

2. 在调试窗格中，使用调试控制按钮在断点处检查变量和代码执行情况：
    * ![步过](wasm-debug-step-over.png){width=30}{type="joined"} 步过：执行当前行并停在下一行。
    * ![步入](wasm-debug-step-into.png){width=30}{type="joined"} 步入：深入调查一个函数。
    * ![步出](wasm-debug-step-out.png){width=30}{type="joined"} 步出：执行代码直到退出当前函数。

3. 查看 **Threads & Variables** 窗格。它有助于你跟踪函数调用序列并精确定位任何错误的位置。

   ![查看 Threads & Variables](wasm-debug-panes-intellij.png){width=700}

4. 对代码进行更改并再次运行应用程序，以验证其运行情况。
5. 完成调试后，点击带有断点的行号以移除断点。

## 在浏览器中调试

你也可以在浏览器中调试此 Compose Multiplatform 应用程序，无需额外配置。 

当你运行开发 Gradle 任务 (`*DevRun`) 时，Kotlin 会自动将源文件提供给浏览器，允许你设置断点、检查变量并逐步执行 Kotlin 代码。

在浏览器中提供 Kotlin/Wasm 项目源码的配置现在已包含在 Kotlin Gradle 插件中。如果你之前在 `build.gradle.kts` 文件中添加过此配置，则应将其移除以避免冲突。

> 本教程使用 Chrome 浏览器，但你也可以使用其他浏览器执行这些步骤。有关更多信息，请参阅[浏览器版本](wasm-configuration.md#browser-versions)。
>
{style="tip"}

1. 按照说明[运行 Compose Multiplatform 应用程序](wasm-get-started.md#run-the-application)。

2. 在应用程序的浏览器窗口中，右键点击并选择 **检查** 操作以访问开发者工具。或者，你可以使用 **F12** 快捷键，或选择 **视图** | **开发者** | **开发者工具**。

3. 切换到 **Sources** 选项卡并选择要调试的 Kotlin 文件。在本教程中，我们将使用 `Greeting.kt` 文件。

4. 点击行号，在要检查的代码上设置断点。只有行号颜色较深的行才能设置断点——在本例中为 4、7、8 和 9。

   ![设置断点](wasm-breakpoints-browser.png){width=700}

5. 按照与[在 IntelliJ IDEA 中调试](#inspect-your-application)类似的方式检查你的应用程序。

    在浏览器中调试时，用于跟踪函数调用序列和定位错误的窗格是 **Scope** 和 **Call Stack**。

   ![检查调用堆栈](wasm-debug-scope.png){width=450}

### 使用自定义格式化程序

在浏览器中调试 Kotlin/Wasm 代码时，自定义格式化程序有助于以更加用户友好且易于理解的方式显示和定位变量值。

自定义格式化程序在 Kotlin/Wasm 开发构建中默认启用，但你仍需确保在浏览器的开发者工具中启用了自定义格式化程序：

* 在 Chrome DevTools 中，在 **Settings | Preferences | Console** 中找到 **Custom formatters** 复选框：

  ![在 Chrome 中启用自定义格式化程序](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox DevTools 中，在 **Settings | Advanced settings** 中找到 **Enable custom formatters** 复选框：

  ![在 Firefox 中启用自定义格式化程序](wasm-custom-formatters-firefox.png){width=400}

此功能使用 [自定义格式化程序 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)，并且在 Firefox 和基于 Chromium 的浏览器中受支持。

鉴于自定义格式化程序默认仅对 Kotlin/Wasm 开发构建有效，如果你想在生产构建中使用它们，则需要调整 Gradle 配置。将以下编译器选项添加到 `wasmJs {}` 块中：

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

* ![Slack](slack.svg){width=25}{type="joined"} Slack：[获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)，并在我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道中直接向开发者提供你的反馈。
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供你的反馈。

## 下一步

* 在此 [YouTube 视频](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s)中查看 Kotlin/Wasm 调试的实际操作。
* 尝试更多 Kotlin/Wasm 示例：
  * [KotlinConf 应用程序](https://github.com/JetBrains/kotlinconf-app)
  * [Compose 图像查看器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI 示例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose 示例](https://github.com/Kotlin/kotlin-wasm-compose-template)