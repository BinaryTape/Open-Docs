---
title: "Kotlin/Wasm 和 Compose Multiplatform 入门"
---
:::note
Kotlin/Wasm 处于 [Alpha](components-stability) 阶段。它可能随时更改。

[加入 Kotlin/Wasm 社区。](https://slack-chats.kotlinlang.org/c/webassembly)

:::

本教程演示了如何在 IntelliJ IDEA 中使用 [Kotlin/Wasm](wasm-overview) 运行 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用程序，并生成构件以作为网站发布在 [GitHub pages](https://pages.github.com/) 上。

## 开始之前

使用 Kotlin Multiplatform 向导创建一个项目：

1. 打开 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com/#newProject)。
2. 在 **New Project（新建项目）** 选项卡上，根据您的喜好更改项目名称和 ID。在本教程中，我们将名称设置为“WasmDemo”，ID 设置为“wasm.project.demo”。

   > 这些是项目目录的名称和 ID。您也可以保留它们不变。
   >
   

3. 选择 **Web** 选项。确保未选择其他选项。
4. 单击 **Download（下载）** 按钮并解压缩生成的文件。

<img src="/img/wasm-compose-web-wizard.png" alt="Kotlin Multiplatform wizard" width="400" style={{verticalAlign: 'middle'}}/>

## 在 IntelliJ IDEA 中打开项目

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 的欢迎屏幕上，单击 **Open（打开）** 或在菜单栏中选择 **File（文件）| Open（打开）**。
3. 导航到解压缩后的 "WasmDemo" 文件夹，然后单击 **Open（打开）**。

## 运行应用程序

1. 在 IntelliJ IDEA 中，通过选择 **View（视图）** | **Tool Windows（工具窗口）** | **Gradle** 打开 **Gradle** 工具窗口。
   
   项目加载后，您可以在 Gradle 工具窗口中找到 Gradle 任务。

   > 您至少需要 Java 11 作为 Gradle JVM 才能成功加载任务。
   >
   

2. 在 **composeApp** | **Tasks（任务）** | **kotlin browser** 中，选择并运行 **wasmJsBrowserDevelopmentRun** 任务。

   <img src="/img/wasm-gradle-task-window.png" alt="Run the Gradle task" width="600" style={{verticalAlign: 'middle'}}/>

   或者，您可以从 `WasmDemo` 根目录的终端中运行以下命令：

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun -t
   ```

3. 应用程序启动后，在浏览器中打开以下 URL：

   ```bash
   http://localhost:8080/
   ```

   > 端口号可能会有所不同，因为 8080 端口可能不可用。您可以在 Gradle 构建控制台中找到实际的端口号。
   >
   

   您会看到一个“Click me!（点我！）”按钮。点击它：

   <img src="/img/wasm-composeapp-browser-clickme.png" alt="Click me" width="650" style={{verticalAlign: 'middle'}}/>

   现在您将看到 Compose Multiplatform 徽标：

   <img src="/img/wasm-composeapp-browser.png" alt="Compose app in browser" width="650" style={{verticalAlign: 'middle'}}/>

## 生成构件

在 **composeApp** | **Tasks（任务）** | **kotlin browser** 中，选择并运行 **wasmJsBrowserDistribution** 任务。

<img src="/img/wasm-gradle-task-window-compose.png" alt="Run the Gradle task" width="600" style={{verticalAlign: 'middle'}}/>

或者，您可以从 `WasmDemo` 根目录的终端中运行以下命令：

```bash
./gradlew wasmJsBrowserDistribution
```

应用程序任务完成后，您可以在 `composeApp/build/dist/wasmJs/productionExecutable` 目录中找到生成的构件：

<img src="/img/wasm-composeapp-directory.png" alt="Artifacts directory" width="600" style={{verticalAlign: 'middle'}}/>

## 在 GitHub Pages 上发布

1. 将 `productionExecutable` 目录中的所有内容复制到要创建站点的存储库中。
2. 按照 GitHub 的说明 [创建您的站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)。

   > 将更改推送到 GitHub 后，最多可能需要 10 分钟才能将更改发布到您的站点。
   >
   

3. 在浏览器中，导航到您的 GitHub Pages 域名。

   <img src="/img/wasm-composeapp-github-clickme.png" alt="Navigate to GitHub pages" width="650" style={{verticalAlign: 'middle'}}/>

   恭喜！您已在 GitHub Pages 上发布了您的构件。

## 接下来做什么？

在 Kotlin Slack 中加入 Kotlin/Wasm 社区：

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="/img/join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" /></a>

尝试更多 Kotlin/Wasm 示例：

* [Compose 图像查看器](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnack 应用程序](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASI 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
* [Compose 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)
  ```