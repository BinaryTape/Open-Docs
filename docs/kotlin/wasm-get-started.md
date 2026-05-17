[//]: # (title: Kotlin/Wasm 与 Compose Multiplatform 入门)

<primary-label ref="beta"/> 

本教程演示如何在 IntelliJ IDEA 中运行包含 [](wasm-overview.md) 的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用，并生成作为网站一部分发布的工件。

## 创建项目

1. [设置 Kotlin Multiplatform 开发环境](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)。
2. 在 IntelliJ IDEA 中，选择 **File | New | Project**。
3. 在左侧面板中，选择 **Kotlin Multiplatform**。

   > 如果您没有使用 Kotlin Multiplatform IDE 插件，可以使用 [KMP Web 向导](https://kmp.jetbrains.com/?web=true&webui=compose&includeTests=true)生成相同的项目。
   >
   {style="note"}

4. 在 **New Project** 窗口中指定以下字段：

   * **Name:** WasmDemo
   * **Group:** wasm.project.demo

   > 如果您使用 Web 向导，请指定 “WasmDemo” 作为 **Project Name**，指定 “wasm.project.demo” 作为 **Project ID**。
   >
   {style="note"}

5. 选择 **Web** 目标和 **Share UI** 选项卡。确保未勾选其他选项。
6. 点击 **Create**。

   ![Kotlin Multiplatform 向导](wasm-kmp-wizard.png){width=600}

## 运行应用程序

项目加载后，在运行配置列表中选择 **webApp [wasmJs]** 并点击 **Run**。

![在 Web 上运行 Compose Multiplatform 应用](compose-run-web-light.png){width=300}

Web 应用程序会自动在浏览器中打开。或者，当运行完成后，您可以在浏览器中打开以下 URL：

```shell
   http://localhost:8080/
```
> 端口号可能会有所不同，因为 8080 端口可能已被占用。
> 您可以在 Gradle 构建的输出中找到实际的端口号。
>
{style="tip"}

点击 “Click me!” 按钮：

![Click me](wasm-composeapp-browser-clickme.png){width=600}

它将显示 Compose Multiplatform 徽标：

![浏览器中的 Compose 应用](wasm-composeapp-browser.png){width=600}

## 生成工件

生成项目的工件以在网站上发布：

1. 通过选择 **View** | **Tool Windows** | **Gradle** 打开 **Gradle** 工具窗口。
2. 在 **wasmdemo** | **Tasks** | **kotlin browser** 中，选择并运行 **wasmJsBrowserDistribution** 任务。

   > 运行任务需要 Gradle JVM 至少为 Java 11，通常我们建议 Compose Multiplatform 项目至少使用 Java 17。
   >
   {style="note"}

   ![运行 Gradle 任务](wasm-gradle-task-window-compose.png){width=400}

   此外，您也可以在终端的 `WasmDemo` 根目录下运行以下命令：

    ```bash
    ./gradlew wasmJsBrowserDistribution
    ```

应用程序任务完成后，您可以在 `webApp/build/dist/wasmJs/productionExecutable` 目录中找到生成的工件：

![工件目录](wasm-composeapp-directory.png){width=400}

## 发布应用程序

使用生成的工件部署您的 Kotlin/Wasm 应用程序。选择您偏好的发布选项，并按照说明部署工件。一些可选方案包括：

* [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
* [Cloudflare](https://developers.cloudflare.com/workers/)
* [Apache HTTP Server](https://httpd.apache.org/docs/2.4/getting-started.html)

网站创建完成后，请打开浏览器并导航到您平台的页面域名。例如，GitHub Pages：

   ![导航到 GitHub Pages](wasm-composeapp-github-clickme.png){width=600}

   恭喜！您已经发布了工件。

## 下一步

* [了解如何使用 Compose Multiplatform 在 iOS 和 Android 之间共享 UI](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
* 尝试更多 Kotlin/Wasm 示例：

  * [KotlinConf 应用程序](https://github.com/JetBrains/kotlinconf-app)
  * [Compose 图像查看器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI 示例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose 示例](https://github.com/Kotlin/kotlin-wasm-compose-template)

* 在 Kotlin Slack 中加入 Kotlin/Wasm 社区：

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="加入 Kotlin/Wasm 社区" style="block"/></a>