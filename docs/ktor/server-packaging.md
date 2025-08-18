[//]: # (title: 创建应用程序分发)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[Ktor Gradle plugin](https://github.com/ktorio/ktor-build-plugins) 会自动应用 Gradle [Application plugin](https://docs.gradle.org/current/userguide/application_plugin.html)，该插件提供了打包应用程序的能力，包括代码依赖项和生成的启动脚本。在本主题中，我们将向您展示如何打包和运行 Ktor 应用程序。

## 配置 Ktor 插件 {id="configure-plugin"}
要创建应用程序分发，您需要首先应用 Ktor 插件：
1. 打开 `build.gradle.kts` 文件并将插件添加到 `plugins` 代码块中：
   ```kotlin
   plugins {
       id("io.ktor.plugin") version "3.2.3"
   }
   ```

2. 确保已配置[主应用程序类](server-dependencies.topic#create-entry-point)：
   ```kotlin
   application {
       mainClass.set("com.example.ApplicationKt")
   }
   ```

## 打包应用程序 {id="package"}
Application plugin 提供了各种打包应用程序的方式，例如，`installDist` 任务可以安装带有所有运行时依赖项和启动脚本的应用程序。要创建完整的应用程序分发归档，您可以使用 `distZip` 和 `distTar` 任务。

在本主题中，我们将使用 `installDist`：
1. 打开终端。
2. 根据您的操作系统，以下列出一种方式运行 `installDist` 任务：
   
   <Tabs group="os">
   <TabItem title="Linux/macOS" group-key="unix">
   <code-block code="./gradlew installDist"/>
   </TabItem>
   <TabItem title="Windows" group-key="windows">
   <code-block code="gradlew.bat installDist"/>
   </TabItem>
   </Tabs>

   Application plugin 将在 `build/install/<project_name>` 文件夹中创建应用程序镜像。

## 运行应用程序 {id="run"}
要运行[已打包的应用程序](#package)：
1. 在终端中进入 `build/install/<project_name>/bin` 文件夹。
2. 根据您的操作系统，运行 `<project_name>` 或 `<project_name>.bat` 可执行文件，例如：

   <snippet id="run_executable">
   <Tabs group="os">
   <TabItem title="Linux/macOS" group-key="unix">
   <code-block code="./ktor-sample"/>
   </TabItem>
   <TabItem title="Windows" group-key="windows">
   <code-block code="ktor-sample.bat"/>
   </TabItem>
   </Tabs>
   </snippet>
   
3. 等待显示以下消息：
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
   在浏览器中打开链接以查看正在运行的应用程序：

   <img src="ktor_idea_new_project_browser.png" alt="浏览器中的 Ktor 应用" width="430"/>