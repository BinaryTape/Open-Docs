[//]: # (title: 使用 Maven Assembly 插件创建胖 JAR)

<tldr>
<p>
<control>示例项目</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assembly 插件](http://maven.apache.org/plugins/maven-assembly-plugin/) 提供了将项目输出组合成一个单一的可分发归档文件的能力，该归档文件包含依赖项、模块、站点文档和其他文件。

## 配置 Assembly 插件 {id="configure-plugin"}

要构建分发包，你需要首先配置 Assembly 插件：

1.  前往 **pom.xml** 文件并确保已指定[主应用程序类](server-dependencies.topic#create-entry-point)：
    ```xml
    <properties>
        <main.class>com.example.ApplicationKt</main.class>
    </properties>
    ```

    > 如果你使用不带显式 `main()` 函数的 [EngineMain](server-create-and-configure.topic#engine-main)，则应用程序的主类取决于所使用的引擎，并可能如下所示：`io.ktor.server.netty.EngineMain`。
    {style="tip"}

2.  将 `maven-assembly-plugin` 添加到 `plugins` 代码块中，如下所示：
    ```xml
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-assembly-plugin</artifactId>
        <version>2.6</version>
        <configuration>
            <descriptorRefs>
                <descriptorRef>jar-with-dependencies</descriptorRef>
            </descriptorRefs>
            <archive>
                <manifest>
                    <addClasspath>true</addClasspath>
                    <mainClass>${main.class}</mainClass>
                </manifest>
            </archive>
        </configuration>
        <executions>
            <execution>
                <id>assemble-all</id>
                <phase>package</phase>
                <goals>
                    <goal>single</goal>
                </goals>
            </execution>
        </executions>
    </plugin>
    ```

## 构建分发包 {id="build"}

要为应用程序构建分发包，请打开终端并执行以下命令：

```Bash
mvn package
```

这将创建一个新的 **target** 目录，用于存放分发包，其中包含 **.jar** 文件。

> 要了解如何使用生成的包来使用 Docker 部署应用程序，请参见 [Docker](docker.md) 帮助主题。

## 运行应用程序 {id="run"}

要运行已构建的应用程序，请按照以下步骤操作：

1.  在新终端窗口中，使用 `java -jar` 命令运行应用程序。对于示例项目，它如下所示：
    ```Bash
    java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
    ```
2.  应用运行后，你将看到一条确认消息：
    ```Bash
    [main] INFO  Application - Responding at http://0.0.0.0:8080
    ```
3.  点击 URL 链接，在默认浏览器中打开应用程序：

    <img src="server_get_started_ktor_sample_app_output.png" alt="生成的 Ktor 项目输出"
                       border-effect="rounded" width="706"/>