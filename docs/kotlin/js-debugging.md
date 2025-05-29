[//]: # (title: 调试 Kotlin/JS 代码)

JavaScript 源码映射提供了打包器或代码压缩器生成的压缩代码与开发者使用的实际源代码之间的映射。通过这种方式，源码映射可以在代码执行期间提供调试支持。

Kotlin 多平台 Gradle 插件会自动为项目构建生成源码映射，无需任何额外配置即可使用。

## 在浏览器中调试

大多数现代浏览器都提供了工具，允许检查页面内容并调试其上执行的代码。有关更多详细信息，请参阅您浏览器的文档。

要在浏览器中调试 Kotlin/JS：

1.  通过调用可用的 `运行` Gradle 任务之一来运行项目，例如在多平台项目中运行 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`。
    了解更多关于[运行 Kotlin/JS](running-kotlin-js.md#run-the-browser-target) 的信息。
2.  在浏览器中导航到页面并启动其开发者工具（例如，通过右键单击并选择**检查**操作）。了解如何在常用浏览器中[查找开发者工具](https://balsamiq.com/support/faqs/browserconsole/)。
3.  如果您的程序正在向控制台输出信息，请导航到**控制台**标签页以查看此输出。根据您使用的浏览器，这些日志可以引用其来源的 Kotlin 源文件和行号：

![Chrome DevTools console](devtools-console.png){width="600"}

4.  单击右侧的文件引用以导航到相应的代码行。
    或者，您可以手动切换到**源**标签页并在文件树中找到您需要的文件。导航到 Kotlin 文件会显示常规的 Kotlin 代码（而非压缩的 JavaScript）：

![Debugging in Chrome DevTools](devtools-sources.png){width="600"}

现在您可以开始调试程序了。通过单击行号来设置断点。开发者工具甚至支持在语句内设置断点。与常规 JavaScript 代码一样，所有设置的断点在页面重新加载后都会保留。这也使得可以调试 Kotlin 的 `main()` 方法，该方法在脚本首次加载时执行。

## 在 IDE 中调试

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/) 提供了一套强大的工具，用于在开发过程中调试代码。

要在 IntelliJ IDEA 中调试 Kotlin/JS，您需要一个 **JavaScript 调试**配置。要添加此调试配置：

1.  转到 **运行 | 编辑配置**。
2.  点击 **+** 并选择 **JavaScript 调试**。
3.  指定配置的**名称**并提供项目运行的 **URL**（默认为 `http://localhost:8080`）。

![JavaScript debug configuration](debug-config.png){width=700}

4.  保存配置。

了解更多关于[设置 JavaScript 调试配置](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html) 的信息。

现在，您已准备好调试项目！

1.  通过调用可用的 `运行` Gradle 任务之一来运行项目，例如在多平台项目中运行 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`。
    了解更多关于[运行 Kotlin/JS](running-kotlin-js.md#run-the-browser-target) 的信息。
2.  运行您之前创建的 JavaScript 调试配置，启动调试会话：

![JavaScript debug configuration](debug-config-run.png){width=700}

3.  您可以在 IntelliJ IDEA 的**调试**窗口中看到程序的控制台输出。输出项引用了它们来源的 Kotlin 源文件和行号：

![JavaScript debug output in the IDE](ide-console-output.png){width=700}

4.  单击右侧的文件引用以导航到相应的代码行。

现在，您可以使用 IDE 提供的一整套工具来调试程序：断点、单步执行、表达式求值等。了解更多关于[在 IntelliJ IDEA 中调试](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html) 的信息。

> 由于当前 JavaScript 调试器在 IntelliJ IDEA 中的一些限制，您可能需要重新运行 JavaScript 调试才能使执行在断点处停止。
>
{style="note"}

## 在 Node.js 中调试

如果您的项目以 Node.js 为目标，您可以在此运行时中调试它。

要调试以 Node.js 为目标的 Kotlin/JS 应用程序：

1.  通过运行 `build` Gradle 任务来构建项目。
2.  在项目的 `build/js/packages/your-module/kotlin/` 目录中找到生成的 Node.js `.js` 文件。
3.  按照 [Node.js 调试指南](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides) 中的说明在 Node.js 中调试。

## 接下来是什么？

既然您知道如何开始 Kotlin/JS 项目的调试会话，学习如何高效地使用调试工具：

*   了解如何[在 Google Chrome 中调试 JavaScript](https://developer.chrome.com/docs/devtools/javascript/)
*   熟悉 [IntelliJ IDEA JavaScript 调试器](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)
*   了解如何[在 Node.js 中调试](https://nodejs.org/en/docs/guides/debugging-getting-started/)。

## 如果您遇到任何问题

如果您在调试 Kotlin/JS 时遇到任何问题，请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告。