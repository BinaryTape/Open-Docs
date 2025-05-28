[//]: # (title: 使用 Maven Assembly 插件创建胖 JAR)

<tldr>
<p>
<control>示例项目</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assembly 插件](http://maven.apache.org/plugins/maven-assembly-plugin/) 提供了将项目输出合并为一个可分发的单个归档文件的能力，该归档文件包含依赖项、模块、站点文档和其他文件。

## 配置 Assembly 插件 {id="configure-plugin"}

要构建一个 Assembly，你需要首先配置 Assembly 插件：

1. 导航到 **pom.xml** 文件并确保已指定 [主应用程序类](server-dependencies.topic#create-entry-point)：
   ```xml
   ```
   {src="snippets/tutorial-server-get-started-maven/pom.xml" include-lines="10,18-19"}

   > 如果你使用 [EngineMain](server-create-and-configure.topic#engine-main) 而没有显式的 `main()` 函数，应用程序的主类取决于所使用的引擎，并且可能如下所示： `io.ktor.server.netty.EngineMain`。
   {style="tip"}

2. 将 `maven-assembly-plugin` 添加到 `plugins` 块，如下所示：
   ```xml
   ```
   {src="snippets/tutorial-server-get-started-maven/pom.xml" include-lines="111-135"}

## 构建一个 Assembly {id="build"}

要为应用程序构建一个 Assembly，请打开终端并执行以下命令：

```Bash
mvn package
```

这将创建一个新的 **target** 目录，用于存放 Assembly，其中包含 **.jar** 文件。

> 要了解如何使用生成的包通过 Docker 部署你的应用程序，请参阅 [](docker.md) 帮助主题。

## 运行应用程序 {id="run"}

要运行已构建的应用程序，请按照以下步骤操作：

1. 在新终端窗口中，使用 `java -jar` 命令运行应用程序。对于示例项目，它看起来如下：
   ```Bash
   java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
   ```
2. 一旦你的应用程序运行起来，你将看到一条确认消息：
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
3. 点击 URL 链接在你的默认浏览器中打开应用程序：

   <img src="server_get_started_ktor_sample_app_output.png" alt="生成的 Ktor 项目输出"
                     border-effect="rounded" width="706"/>