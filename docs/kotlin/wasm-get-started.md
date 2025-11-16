[//]: # (title: 开始使用 Kotlin/Wasm 和 Compose Multiplatform)

<primary-label ref="beta"/> 

本教程演示了如何在 IntelliJ IDEA 中使用 Kotlin/Wasm 运行 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用，并生成构件以作为网站的一部分发布。

## 创建项目

1. [为 Kotlin Multiplatform 开发设置环境](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)。
2. 在 IntelliJ IDEA 中，选择 **File | New | Project**。
3. 在左侧面板中，选择 **Kotlin Multiplatform**。

   > 如果你没有使用 Kotlin Multiplatform IDE 插件，你可以使用 [KMP Web 向导](https://kmp.jetbrains.com/?web=true&webui=compose&includeTests=true) 生成相同的项目。
   >
   {style="note"}

4. 在 **New Project** 窗口中指定以下字段：

   * **Name:** WasmDemo
   * **Group:** wasm.project.demo
   * **Artifact:** wasmdemo

   > 如果你使用 Web 向导，请将 "WasmDemo" 指定为项目名称，并将 "wasm.project.demo" 指定为项目 ID。
   >
   {style="note"}

5. 选择 **Web** 目标和 **Share UI** 标签页。确保没有选择其他选项。
6. 点击 **Create**。

   ![Kotlin Multiplatform wizard](wasm-kmp-wizard.png){width=600}

## 运行应用程序

项目加载后，在运行配置列表选择 **composeApp [wasmJs]**，然后点击 **Run**。

![Run the Compose Multiplatform app on web](compose-run-web-black.png){width=300}

Web 应用程序将在你的浏览器中自动打开。或者，你可以在运行完成后在浏览器中打开以下 URL：

```shell
   http://localhost:8080/
```
> 端口号可能不同，因为 8080 端口可能不可用。你可以在 Gradle 构建的输出中找到实际的端口号。
>
{style="tip"}

点击“Click me!”按钮：

![Click me](wasm-composeapp-browser-clickme.png){width=600}

它将显示 Compose Multiplatform 徽标：

![Compose app in browser](wasm-composeapp-browser.png){width=600}

## 生成构件

生成项目的构件以发布到网站上：

1. 通过选择 **View** | **Tool Windows** | **Gradle** 打开 **Gradle** 工具窗口。
2. 在 **wasmdemo** | **Tasks** | **kotlin browser** 中，选择并运行 **wasmJsBrowserDistribution** 任务。

   > 你需要至少 Java 11 作为你的 Gradle JVM 以便任务成功加载，通常，我们建议 Compose Multiplatform 项目至少使用 Java 17。
   >
   {style="note"}

   ![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

   或者，你可以在终端中从 `WasmDemo` 根目录运行以下命令：

    ```bash
    ./gradlew wasmJsBrowserDistribution
    ```

应用程序任务完成后，你可以在 `composeApp/build/dist/wasmJs/productionExecutable` 目录中找到生成的构件：

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## 发布应用程序

使用生成的构件来部署你的 Kotlin/Wasm 应用程序。选择你偏好的发布选项，并按照说明部署构件。一些替代方案包括：

* [GitHub pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
* [Cloudflare](https://developers.cloudflare.com/workers/)
* [Apache HTTP Server](https://httpd.apache.org/docs/2.4/getting-started.html)

网站创建后，打开浏览器并导航到你平台的页面域名。例如，GitHub Pages：

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=600}

   恭喜！你已发布你的构件。

## 接下来

* [了解如何在 iOS 和 Android 之间使用 Compose Multiplatform 共享 UI](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
* 尝试更多 Kotlin/Wasm 示例：

  * [KotlinConf 应用程序](https://github.com/JetBrains/kotlinconf-app)
  * [Compose 图片查看器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Jetsnack 应用程序](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
  * [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI 示例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose 示例](https://github.com/Kotlin/kotlin-wasm-compose-template)

* 加入 Kotlin Slack 中的 Kotlin/Wasm 社区：

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>