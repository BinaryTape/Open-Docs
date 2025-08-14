[//]: # (title: AWS Elastic Beanstalk)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>初始项目</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">embedded-server</a> 或 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>最终项目</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/aws-elastic-beanstalk">aws-elastic-beanstalk</a>
</p>
</tldr>

在本教程中，我们将向您展示如何准备并将 Ktor 应用程序部署到 AWS Elastic Beanstalk。您可以根据[创建 Ktor 服务器](server-create-and-configure.topic)的方式使用以下初始项目之一：
* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)
* [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)

> 有关部署 Java 应用程序的更多信息，请参见 [Elastic Beanstalk 文档](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Java.html)。

## 先决条件 {id="prerequisites"}
在开始本教程之前，您需要创建一个 AWS 账户。

## 克隆示例应用程序 {id="clone"}
要打开一个示例应用程序，请按照以下步骤操作：

1. 克隆 Ktor 文档版本库并打开 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets) 项目。
2. 打开 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 或 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 示例。这些示例展示了[创建和配置 Ktor 服务器](server-create-and-configure.topic)的不同方法：在代码中或通过使用配置文件。部署这些项目的唯一区别在于如何[指定](#port)用于监听传入请求的端口。

## 准备应用程序 {id="prepare-app"}

### 步骤 1: 配置端口 {id="port"}

首先，您需要指定一个用于监听传入请求的端口。Elastic Beanstalk 将请求转发到您应用程序的 5000 端口。您可以选择通过设置 `PORT` 环境变量来覆盖默认端口。根据[配置 Ktor 服务器](server-create-and-configure.topic)的方式，您可以通过以下任一方法配置端口：
* 如果您选择了在代码中指定服务器配置的 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 示例，您可以使用 `System.getenv` 获取环境变量值，或者在未指定环境变量的情况下使用默认值 _5000_。打开位于 `src/main/kotlin/com/example` 文件夹中的 `Application.kt` 文件，并按如下所示更改 `embeddedServer` 函数的 `port` 形参值：
   ```kotlin
   fun main() {
      embeddedServer(Netty, port = (System.getenv("PORT")?:"5000").toInt()) {
      // ...
      }.start(wait = true)
   }
    ```

* 如果您选择了在 `application.conf` 文件中指定服务器配置的 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 示例，您可以使用 `${ENV}` 语法将环境变量赋值给 `port` 形参。打开位于 `src/main/resources` 中的 `application.conf` 文件，并按如下所示更新它：
   [object Promise]

### 步骤 2: 应用 Ktor 插件 {id="configure-ktor-plugin"}
本教程展示了如何使用 [fat JAR](server-fatjar.md) 将应用程序部署到 Elastic Beanstalk。要生成 fat JAR，您需要应用 Ktor 插件。打开 `build.gradle.kts` 文件并将该插件添加到 `plugins` 代码块：
[object Promise]

然后，确保[主应用程序类](server-dependencies.topic#create-entry-point)已配置：
[object Promise]

## 构建 Fat JAR {id="build"}
要构建 Fat JAR，请打开终端并执行由 [Ktor 插件](#configure-ktor-plugin)提供的 `buildFatJar` 任务：

<tabs group="os">
<tab title="Linux/macOS" group-key="unix">
[object Promise]
</tab>
<tab title="Windows" group-key="windows">
[object Promise]
</tab>
</tabs>

当此构建完成时，您应该在 `build/libs` 目录中看到 `aws-elastic-beanstalk-all.jar` 文件。

## 部署应用程序 {id="deploy-app"}
要部署应用程序，请登录 [AWS 管理控制台](https://aws.amazon.com/console/)并按照以下步骤操作：
1. 在 **AWS 服务**组中打开 **Elastic Beanstalk** 服务。
2. 在打开的页面上，点击 **Create Application**。
3. 指定以下应用程序设置：
   * **应用程序名称**: 指定应用程序名称（例如，_Sample Ktor app_）。
   * **平台**: 从列表中选择 _Java_。
   * **平台分支**: 选择 _Corretto 11 running on 64bit Amazon Linux 2_。
   * **应用程序代码**: 选择 _上传您的代码_。
   * **源代码来源**: 选择 _本地文件_。然后，点击 **选择文件**按钮并选择在[上一步](#build)中生成的 Fat JAR。等待文件上传完成。
4. 点击 **创建应用程序** 按钮，等待几分钟，直到 Beanstalk 创建环境并发布应用程序：
   ```
   INFO    Instance deployment completed successfully.
   INFO    Application available at Samplektorapp-env.eba-bnye2kpu.us-east-2.elasticbeanstalk.com.
   INFO    Successfully launched environment: Samplektorapp-env
   ```
   {style="block"}