[//]: # (title: Kotlin/Wasm 和 Compose Multiplatform 入门)

> Kotlin/Wasm 处于 [Alpha](components-stability.md) 阶段，可能会随时更改。
>
> [加入 Kotlin/Wasm 社区。](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

本教程演示如何在 IntelliJ IDEA 中使用 [Kotlin/Wasm](wasm-overview.md) 运行 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用程序，并生成工件以作为网站发布到 [GitHub Pages](https://pages.github.com/)。

## 开始之前

使用 Kotlin Multiplatform 向导创建项目：

1.  打开 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com/#newProject)。
2.  在 **New Project** 选项卡上，将项目名称和 ID 更改为你偏好的设置。在本教程中，我们将名称设置为 "WasmDemo"，ID 设置为 "wasm.project.demo"。

    > 这些是项目目录的名称和 ID。你也可以保留它们不变。
    >
    {style="tip"}

3.  选择 **Web** 选项。确保没有选择其他选项。
4.  点击 **Download** 按钮并解压生成的归档文件。

    ![Kotlin Multiplatform 向导](wasm-compose-web-wizard.png){width=400}

## 在 IntelliJ IDEA 中打开项目

1.  下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2.  在 IntelliJ IDEA 的欢迎屏幕上，点击 **Open** 或在菜单栏中选择 **File | Open**。
3.  导航到已解压的 "WasmDemo" 文件夹并点击 **Open**。

## 运行应用程序

1.  在 IntelliJ IDEA 中，通过选择 **View** | **Tool Windows** | **Gradle** 打开 **Gradle** 工具窗口。

    项目加载后，你可以在 Gradle 工具窗口中找到 Gradle 任务。

    > 你需要至少 Java 11 作为 Gradle JVM，才能成功加载任务。
    >
    {style="note"}

2.  在 **wasmdemo** | **Tasks** | **kotlin browser** 中，选择并运行 **wasmJsBrowserDevelopmentRun** 任务。

    ![运行 Gradle 任务](wasm-gradle-task-window.png){width=400}

    或者，你可以在 `WasmDemo` 根目录的终端中运行以下命令：

    ```bash
    ./gradlew wasmJsBrowserDevelopmentRun -t
    ```

3.  应用程序启动后，在浏览器中打开以下 URL：

    ```bash
    http://localhost:8080/
    ```

    > 端口号可能会有所不同，因为 8080 端口可能不可用。你可以在 Gradle 构建控制台中找到实际的端口号。
    >
    {style="tip"}

    你将看到一个 "Click me!" 按钮。点击它：

    ![点击我](wasm-composeapp-browser-clickme.png){width=650}

    现在你将看到 Compose Multiplatform 标志：

    ![浏览器中的 Compose 应用](wasm-composeapp-browser.png){width=650}

## 生成工件

在 **wasmdemo** | **Tasks** | **kotlin browser** 中，选择并运行 **wasmJsBrowserDistribution** 任务。

![运行 Gradle 任务](wasm-gradle-task-window-compose.png){width=400}

或者，你可以在 `WasmDemo` 根目录的终端中运行以下命令：

```bash
./gradlew wasmJsBrowserDistribution
```

应用程序任务完成后，你可以在 `composeApp/build/dist/wasmJs/productionExecutable` 目录中找到生成的工件：

![工件目录](wasm-composeapp-directory.png){width=400}

## 发布到 GitHub Pages

1.  将 `productionExecutable` 目录中的所有内容复制到你想要创建站点的仓库中。
2.  按照 GitHub 的说明[创建你的站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)。

    > 将更改推送到 GitHub 后，你的网站可能需要长达 10 分钟才能发布更改。
    >
    {style="note"}

3.  在浏览器中，导航到你的 GitHub Pages 域名。

    ![导航到 GitHub Pages](wasm-composeapp-github-clickme.png){width=650}

    恭喜！你已成功将工件发布到 GitHub Pages。

## 接下来是什么？

加入 Kotlin Slack 上的 Kotlin/Wasm 社区：

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="加入 Kotlin/Wasm 社区" style="block"/></a>

尝试更多 Kotlin/Wasm 示例：

*   [Compose 图片查看器](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
*   [Jetsnack 应用程序](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
*   [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
*   [WASI 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
*   [Compose 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)