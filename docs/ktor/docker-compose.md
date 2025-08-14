<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   id="docker-compose" title="Docker Compose">
<show-structure for="chapter" depth="2"/>
<tldr>
    <p>
        <control>初始项目</control>
        : <a
            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-db-integration">tutorial-server-db-integration</a>
    </p>
    <p>
        <control>最终项目</control>
        : <a
            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-docker-compose">tutorial-server-docker-compose</a>
    </p>
</tldr>
<p>在本主题中，我们将向你展示如何在 <a href="https://docs.docker.com/compose/">Docker Compose</a> 下运行 Ktor 服务端应用程序。我们将使用在 <Links href="/ktor/server-integrate-database" summary="了解如何使用 Exposed SQL 库将 Ktor 服务连接到数据库仓库的过程。">集成数据库</Links> 教程中创建的项目，该项目使用 <a href="https://github.com/JetBrains/Exposed">Exposed</a> 连接到 <a href="https://www.postgresql.org/docs/">PostgreSQL</a> 数据库，其中数据库和 Web 应用程序独立运行。</p>
<chapter title="准备应用程序" id="prepare-app">
    <chapter title="提取数据库设置" id="extract-db-settings">
        <p>
            在 <a href="server-integrate-database.topic#config-db-connection">配置数据库连接</a> 教程中创建的项目使用硬编码属性来建立数据库连接。</p>
        <p>
            让我们将 PostgreSQL 数据库的连接设置提取到 <Links href="/ktor/server-configuration-file" summary="了解如何在配置文件中配置各种服务器参数。">自定义配置组</Links> 中。
        </p>
        <procedure>
            <step>
                <p>打开 <Path>src/main/resources</Path> 目录下的 <Path>application.yaml</Path> 文件，并在 <code>ktor</code> 组之外添加 <code>storage</code> 组，如下所示：
                </p>
                [object Promise]
                <p>这些设置将在稍后的 <a href="#configure-docker">
                    <Path>compose.yml</Path>
                </a> 文件中配置。
                </p>
            </step>
            <step>
                <p>
                    打开 <Path>src/main/kotlin/com/example/plugins/</Path> 目录下的 <Path>Databases.kt</Path> 文件，并更新 <code>configureDatabases()</code> 函数，使其从配置文件加载存储设置：
                </p>
                [object Promise]
                <p>
                    <code>configureDatabases()</code> 函数现在接受 <code>ApplicationConfig</code> 并使用 <code>config.property</code> 加载自定义设置。
                </p>
            </step>
            <step>
                <p>
                    打开 <Path>src/main/kotlin/com/example/</Path> 目录下的 <Path>Application.kt</Path> 文件，并将 <code>environment.config</code> 传递给 <code>configureDatabases()</code> 以在应用程序启动时加载连接设置：
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="配置 Ktor 插件" id="configure-ktor-plugin">
        <p>为了在 Docker 上运行，应用程序需要将所有必需的文件部署到容器中。根据你使用的构建系统，有不同的插件可以实现此目的：</p>
        <list>
            <li><Links href="/ktor/server-fatjar" summary="了解如何使用 Ktor Gradle 插件创建和运行可执行的 fat JAR。">使用 Ktor Gradle 插件创建 fat JAR</Links></li>
            <li><Links href="/ktor/maven-assembly-plugin" summary="示例项目：tutorial-server-get-started-maven">使用 Maven Assembly 插件创建 fat JAR</Links></li>
        </list>
        <p>在我们的示例中，Ktor 插件已在 <Path>build.gradle.kts</Path> 文件中应用。
        </p>
        [object Promise]
    </chapter>
</chapter>
<chapter title="配置 Docker" id="configure-docker">
    <chapter title="准备 Docker 镜像" id="prepare-docker-image">
        <p>
            要将应用程序 Docker 化，请在项目的根目录下创建一个新的 <Path>Dockerfile</Path> 文件，并插入以下内容：
        </p>
        [object Promise]
        <tip>
            有关此多阶段构建工作原理的更多信息，请参见 <a href="docker.md#prepare-docker">准备 Docker 镜像</a>。
        </tip>
        <tip id="jdk_image_replacement_tip">
  <p>
   本示例使用 Amazon Corretto Docker 镜像，但你可以将其替换为任何其他合适的替代方案，例如：
  </p>
  <list>
<li><a href="https://hub.docker.com/_/eclipse-temurin">Eclipse Temurin</a></li>
<li><a href="https://hub.docker.com/_/ibm-semeru-runtimes">IBM Semeru</a></li>
<li><a href="https://hub.docker.com/_/ibmjava">IBM Java</a></li>
<li><a href="https://hub.docker.com/_/sapmachine">SAP Machine JDK</a></li>
  </list>
</tip>
    </chapter>
    <chapter title="配置 Docker Compose" id="configure-docker-compose">
        <p>在项目的根目录下，创建一个新的 <Path>compose.yml</Path> 文件并添加以下内容：
        </p>
        [object Promise]
        <list>
            <li><code>web</code> 服务用于运行打包在 <a href="#prepare-docker-image">镜像</a> 中的 Ktor 应用程序。
            </li>
            <li><code>db</code> 服务使用 <code>postgres</code> 镜像来创建 <code>ktor_tutorial_db</code> 数据库以存储任务。
            </li>
        </list>
    </chapter>
</chapter>
<chapter title="构建并运行服务" id="build-run">
    <procedure>
        <step>
            <p>
                运行以下命令来创建包含 Ktor 应用程序的 <a href="#configure-ktor-plugin">fat JAR</a>：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                使用 <code>docker compose up</code> 命令来构建镜像并启动容器：
            </p>
            [object Promise]
        </step>
        <step>
            等待 Docker Compose 完成镜像的构建。
        </step>
        <step>
            <p>
                导航到 <a href="http://localhost:8080/static/index.html">http://localhost:8080/static/index.html</a> 以打开 Web 应用程序。你将看到任务管理器客户端页面，其中显示了用于筛选和添加新任务的三个表单，以及一个任务表。
            </p>
            <img src="tutorial_server_db_integration_manual_test.gif"
                 alt="显示任务管理器客户端的浏览器窗口"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
</topic>