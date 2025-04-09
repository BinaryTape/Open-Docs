---
title: "调试 Kotlin/JS 代码"
---
JavaScript 源码映射（source maps）提供了由打包器（bundlers）或精简器（minifiers）生成的压缩代码与开发者使用的实际源码之间的映射。 这样，源码映射就支持在代码执行期间进行调试。

Kotlin Multiplatform Gradle 插件会自动为项目构建生成源码映射，无需任何额外配置即可使用。

## 在浏览器中调试

大多数现代浏览器都提供了一些工具，允许检查页面内容和调试在其上执行的代码。 有关更多详细信息，请参阅浏览器的文档。

要在浏览器中调试 Kotlin/JS：

1. 通过调用可用的 _run_ Gradle 任务之一来运行项目，例如，多平台项目中的 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`。
   了解更多关于[运行 Kotlin/JS](running-kotlin-js#run-the-browser-target)。
2. 在浏览器中导航到该页面并启动其开发者工具（例如，右键单击并选择 **Inspect** 操作）。 了解如何在流行的浏览器中[查找开发者工具](https://balsamiq.com/support/faqs/browserconsole/)。
3. 如果您的程序正在将信息记录到控制台，请导航到 **Console** 选项卡以查看此输出。 根据您的浏览器，这些日志可以引用它们来自的 Kotlin 源文件和行：

<img src="/img/devtools-console.png" alt="Chrome DevTools console" width="600" style={{verticalAlign: 'middle'}}/>

4. 单击右侧的文件引用以导航到相应的代码行。 或者，您可以手动切换到 **Sources** 选项卡并在文件树中找到所需的文件。 导航到 Kotlin 文件会显示常规 Kotlin 代码（而不是压缩的 JavaScript）：

<img src="/img/devtools-sources.png" alt="Debugging in Chrome DevTools" width="600" style={{verticalAlign: 'middle'}}/>

您现在可以开始调试程序了。 通过单击其中一个行号来设置断点。 开发者工具甚至支持在语句中设置断点。 与常规 JavaScript 代码一样，任何设置的断点都将在页面重新加载后保留。 这也使得可以调试 Kotlin 的 `main()` 方法，该方法在首次加载脚本时执行。

## 在 IDE 中调试

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/) 提供了一套强大的工具，用于在开发过程中调试代码。

要在 IntelliJ IDEA 中调试 Kotlin/JS，您需要一个 **JavaScript Debug** 配置。 要添加此类调试配置：

1. 转到 **Run | Edit Configurations**。
2. 单击 **+** 并选择 **JavaScript Debug**。
3. 指定配置 **Name** 并提供项目运行的 **URL**（默认为 `http://localhost:8080`）。

<img src="/img/debug-config.png" alt="JavaScript debug configuration" width="700" style={{verticalAlign: 'middle'}}/>

4. 保存配置。

了解更多关于[设置 JavaScript 调试配置](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)。

现在您已准备好调试您的项目！

1. 通过调用可用的 _run_ Gradle 任务之一来运行项目，例如，多平台项目中的 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`。
   了解更多关于[运行 Kotlin/JS](running-kotlin-js#run-the-browser-target)。
2. 通过运行您之前创建的 JavaScript 调试配置来启动调试会话：

<img src="/img/debug-config-run.png" alt="JavaScript debug configuration" width="700" style={{verticalAlign: 'middle'}}/>

3. 您可以在 IntelliJ IDEA 的 **Debug** 窗口中看到程序的控制台输出。 输出项引用了它们来自的 Kotlin 源文件和行：

<img src="/img/ide-console-output.png" alt="JavaScript debug output in the IDE" width="700" style={{verticalAlign: 'middle'}}/>

4. 单击右侧的文件引用以导航到相应的代码行。

您现在可以使用 IDE 提供的全套工具开始调试程序：断点、单步执行、表达式求值等等。 了解更多关于[在 IntelliJ IDEA 中调试](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)。

:::note
由于 IntelliJ IDEA 中当前 JavaScript 调试器的限制，您可能需要重新运行 JavaScript 调试才能使执行在断点处停止。

:::

## 在 Node.js 中调试

如果您的项目以 Node.js 为目标，您可以在此运行时中对其进行调试。

要调试以 Node.js 为目标的 Kotlin/JS 应用程序：

1. 通过运行 `build` Gradle 任务来构建项目。
2. 在项目目录中的 `build/js/packages/your-module/kotlin/` 目录中找到 Node.js 的结果 `.js` 文件。
3. 在 Node.js 中调试它，如 [Node.js 调试指南](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides)中所述。

## 接下来做什么？

现在您知道如何使用 Kotlin/JS 项目启动调试会话，请学习如何有效地使用调试工具：

* 了解如何在 [Google Chrome 中调试 JavaScript](https://developer.chrome.com/docs/devtools/javascript/)
* 熟悉 [IntelliJ IDEA JavaScript 调试器](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)
* 了解如何在 [Node.js 中调试](https://nodejs.org/en/docs/guides/debugging-getting-started/)。

## 如果您遇到任何问题

如果您在调试 Kotlin/JS 时遇到任何问题，请将其报告给我们的问题跟踪器 [YouTrack](https://kotl.in/issue)