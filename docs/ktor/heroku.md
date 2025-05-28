[//]: # (title: Heroku)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何准备并将 Ktor 应用程序部署到 Heroku。</link-summary>

在本教程中，我们将向您展示如何准备并将 Ktor 应用程序部署到 Heroku。

## 先决条件 {id="prerequisites"}
在开始本教程之前，请确保满足以下先决条件：
* 您拥有一个 Heroku 账户。
* 您的机器上已安装 [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)。

## 创建示例应用程序 {id="create-sample-app"}

按照 [](server-create-a-new-project.topic) 中的说明创建示例应用程序。

> 请注意，Ktor 提供了两种方法来 [创建和配置服务器](server-create-and-configure.topic)：通过代码或使用配置文件。部署时唯一的区别在于如何 [指定端口](#port) 用于监听传入请求。

## 准备应用程序 {id="prepare-app"}

### 步骤 1：配置端口 {id="port"}

首先，您需要指定一个用于监听传入请求的端口。由于 Heroku 使用 `PORT` 环境变量，您需要配置应用程序以使用此变量的值。根据 [配置 Ktor 服务器](server-create-and-configure.topic) 的方式，执行以下操作之一：
* 如果服务器配置是在代码中指定的，您可以使用 `System.getenv` 获取环境变量值。打开位于 `src/main/kotlin/com/example` 文件夹中的 `Application.kt` 文件，并如下所示更改 `embeddedServer` 函数的 `port` 参数值：
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = System.getenv("PORT").toInt()) {
          // ...
      }.start(wait = true)
   }
    ```

* 如果您的服务器配置是在 `application.conf` 文件中指定的，您可以使用 `${ENV}` 语法将环境变量分配给 `port` 参数。打开位于 `src/main/resources` 中的 `application.conf` 文件并如下所示更新它：
   ```
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```
   {style="block"}

### 步骤 2：添加 stage 任务 {id="stage"}
打开 `build.gradle.kts` 文件并添加一个自定义的 `stage` 任务，Heroku 使用它来生成可在 Heroku 平台上运行的可执行文件：
```kotlin
tasks {
    create("stage").dependsOn("installDist")
}
``` 
请注意，`installDist` 任务随 Gradle [应用程序插件](https://docs.gradle.org/current/userguide/application_plugin.html) 一同提供，该插件已添加到示例项目中。

### 步骤 3：创建 Procfile {id="procfile"}
在项目根目录中创建 [Procfile](https://devcenter.heroku.com/articles/procfile) 并添加以下内容：
```
web: ./build/install/ktor-get-started-sample/bin/ktor-get-started-sample
```
{style="block"}

此文件指定了由 [stage](#stage) 任务生成的应用程序可执行文件的路径，并允许 Heroku 启动应用程序。
您可能需要将 `ktor-get-started-sample` 替换为您的项目名称。

## 部署应用程序 {id="deploy-app"}

要使用 Git 将应用程序部署到 Heroku，请打开终端并按照以下步骤操作：

1.  在本地提交 [上一节](#prepare-app) 中所做的更改：
   ```Bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2.  登录 Heroku CLI：
   ```Bash
   heroku login
   ```
3.  使用 `heroku create` 命令创建 Heroku 应用程序。
   您需要将 `ktor-sample-heroku` 替换为您的应用程序名称：
   ```Bash
   heroku create ktor-sample-heroku
   ```
   此命令执行两项操作：
   * 创建一个新的 Heroku 应用程序，该应用程序可在 [web 控制台](https://dashboard.heroku.com/apps/) 上查看。
   * 向本地仓库添加一个名为 `heroku` 的 Git 远程仓库。

4.  要部署应用程序，请将更改推送到 `heroku main`...
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