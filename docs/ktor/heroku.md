[//]: # (title: Heroku)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何准备 Ktor 应用程序并将其部署到 Heroku。</link-summary>

在本教程中，我们将向你展示如何准备 Ktor 应用程序并将其部署到 Heroku。

## 必备条件 {id="prerequisites"}
在开始本教程之前，请确保满足以下必备条件：
*   你有一个 Heroku 账户。
*   [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) 已安装在你的机器上。

## 创建一个示例应用程序 {id="create-sample-app"}

按照[创建、打开并运行新的 Ktor 项目](server-create-a-new-project.topic)中所述创建一个示例应用程序。

> 请注意，Ktor 提供了两种[创建和配置服务器](server-create-and-configure.topic)的方式：在代码中或使用配置文件。部署时唯一的区别在于如何[指定](#port)用于监听传入请求的端口。

## 准备应用程序 {id="prepare-app"}

### 步骤 1：配置端口 {id="port"}

首先，你需要指定用于监听传入请求的端口。由于 Heroku 使用 `PORT` 环境变量，你需要将应用程序配置为使用此变量的值。根据[配置 Ktor 服务器](server-create-and-configure.topic)的方式，执行以下操作之一：
*   如果服务器配置在代码中指定，你可以使用 `System.getenv` 获取环境变量的值。打开 `src/main/kotlin/com/example` 文件夹中的 `Application.kt` 文件，并更改 `embeddedServer` 函数的 `port` 形参值，如下所示：
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = System.getenv("PORT").toInt()) {
          // ...
      }.start(wait = true)
   }
    ```

*   如果你的服务器配置在 `application.conf` 文件中指定，你可以使用 `${ENV}` 语法将环境变量赋值给 `port` 形参。打开 `src/main/resources` 中的 `application.conf` 文件并进行如下更新：
   ```
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```
   {style="block"}

### 步骤 2：添加一个 stage 任务 {id="stage"}
打开 `build.gradle.kts` 文件并添加一个自定义 `stage` 任务，Heroku 使用该任务来生成一个可执行文件，以便在 Heroku 平台上运行：
```kotlin
tasks {
    create("stage").dependsOn("installDist")
}
``` 
请注意，`installDist` 任务来自 Gradle [application 插件](https://docs.gradle.org/current/userguide/application_plugin.html)，该插件已添加到示例项目中。

### 步骤 3：创建一个 Procfile {id="procfile"}
在项目根目录中创建一个 [Procfile](https://devcenter.heroku.com/articles/procfile) 并添加以下内容：
```
web: ./build/install/ktor-get-started-sample/bin/ktor-get-started-sample
```
{style="block"}

此文件指定了由 `stage` 任务生成的应用程序可执行文件的路径，并允许 Heroku 启动应用程序。
你可能需要将 `ktor-get-started-sample` 替换为你的项目名称。

## 部署应用程序 {id="deploy-app"}

要使用 Git 将应用程序部署到 Heroku，请打开终端并按照以下步骤操作：

1.  在本地提交[上一节](#prepare-app)中所做的更改：
   ```Bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2.  登录到 Heroku CLI：
   ```Bash
   heroku login
   ```
3.  使用 `heroku create` 命令创建一个 Heroku 应用程序。
    你需要将 `ktor-sample-heroku` 替换为你的应用程序名称：
   ```Bash
   heroku create ktor-sample-heroku
   ```
   此命令执行两项操作：
   *   创建一个新的 Heroku 应用程序，可在 [web 控制台](https://dashboard.heroku.com/apps/)上查看。
   *   将名为 `heroku` 的新 Git 远程添加到本地版本库。

4.  要部署应用程序，将更改推送到 `heroku main`...
   ```Bash
   git push heroku main
   ```
   ... 并等待 Heroku 构建并发布应用程序：
   ```
   ...
   remote: https://ktor-sample-heroku.herokuapp.com/ deployed to Heroku
   remote:
   remote: Verifying deploy... done.
   ```
   {style="block"}