<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="将数据库与 Kotlin、Ktor 和 Exposed 集成" id="server-integrate-database">
<show-structure for="chapter" depth="2"/>
<tldr>
        <var name="example_name" value="tutorial-server-db-integration"/>
    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
        <p>
            <b>所用插件</b>: <Links href="/ktor/server-routing" summary="Routing 是服务器应用程序中用于处理传入请求的核心插件。">Routing</Links>,<Links href="/ktor/server-static-content" summary="了解如何提供静态内容，例如样式表、脚本、图片等。">Static Content</Links>,
            <Links href="/ktor/server-serialization" summary="Content Negotiation 插件主要有两个用途：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。">Content Negotiation</Links>, <Links href="/ktor/server-status-pages" summary="%plugin_name% 允许 Ktor 应用程序根据抛出的异常或状态码对任何故障状态做出适当的响应。">Status pages</Links>,
            <Links href="/ktor/server-serialization" summary="Content Negotiation 插件主要有两个用途：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。">kotlinx.serialization</Links>,
            <a href="https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/exposed/2.2/documentation.md">Exposed</a>,
            <a href="https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/postgres/2.2/documentation.md">Postgres</a>
        </p>
</tldr>
<card-summary>
        了解如何使用 Exposed SQL 库将 Ktor 服务连接到数据库版本库。
</card-summary>
<link-summary>
        了解如何使用 Exposed SQL 库将 Ktor 服务连接到数据库版本库。
</link-summary>
<web-summary>
        了解如何使用 Kotlin 和 Ktor 构建一个单页应用程序 (SPA)，其中 RESTful 服务连接到数据库版本库。它使用 Exposed SQL 库，并允许您模拟版本库进行测试。
</web-summary>
<p>
        在本文中，您将学习如何使用适用于 Kotlin 的 SQL 库 <a
            href="https://github.com/JetBrains/Exposed">Exposed</a> 将 Ktor 服务与关系型数据库集成。
</p>
<p>完成本教程后，您将学习如何执行以下操作：</p>
<list>
        <li>创建使用 JSON 序列化的 RESTful 服务。</li>
        <li>将不同的版本库注入到这些服务中。</li>
        <li>使用模拟版本库为您的服务创建单元测试。</li>
        <li>使用 Exposed 和依赖注入 (DI) 构建可用的版本库。</li>
        <li>部署访问外部数据库的服务。</li>
</list>
<p>
        在之前的教程中，我们使用任务管理器示例来涵盖基础知识，例如<Links href="/ktor/server-requests-and-responses" summary="了解如何使用 Ktor 在 Kotlin 中通过构建任务管理器应用程序来处理路由、请求和形参。">处理请求</Links>、
        <Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含生成 JSON 文件的 RESTful API 示例。">创建 RESTful API</Links> 或
        <Links href="/ktor/server-create-website" summary="了解如何使用 Kotlin、Ktor 和 Thymeleaf 模板构建网站。">使用 Thymeleaf 模板构建 Web 应用</Links>。
        虽然这些教程侧重于使用简单的内存 `TaskRepository` 实现前端功能，但本指南将重点转移到展示 Ktor 服务如何通过
        <a href="https://github.com/JetBrains/Exposed">Exposed SQL 库</a>与关系型数据库交互。
</p>
<p>
        尽管本指南更长、更复杂，但您仍将快速生成可用的代码，并逐步引入新特性。
</p>
<p>本指南将分为两部分：</p>
<list type="decimal">
        <li>
            <a href="#create-restful-service-and-repository">使用内存版本库创建应用程序。</a>
        </li>
        <li>
            <a href="#add-postgresql-repository">将内存版本库替换为使用 PostgreSQL 的版本库。</a>
        </li>
</list>
<chapter title="前提条件" id="prerequisites">
        <p>
            您可以独立完成本教程，但我们建议您完成<Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含生成 JSON 文件的 RESTful API 示例。">创建 RESTful API</Links> 教程，以熟悉 Content
            Negotiation 和 REST。
        </p>
        <p>我们建议您安装 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
            IDEA</a>，但您也可以使用您选择的其他 IDE。
        </p>
</chapter>
<chapter title="创建 RESTful 服务和内存版本库" id="create-restful-service-and-repository">
        <p>
            首先，您将重新创建任务管理器 RESTful 服务。最初，这将使用一个内存版本库，但您将构建一个设计，使其可以轻松替换，只需付出最小的努力。
        </p>
        <p>您将分六个阶段完成此操作：</p>
<list type="decimal">
            <li>
                <a href="#create-project">创建初始项目。</a>
            </li>
            <li>
                <a href="#add-starter-code">添加启动代码。</a>
            </li>
            <li>
                <a href="#add-routes">添加 CRUD 路由。</a>
            </li>
            <li>
                <a href="#add-client-page">添加单页应用程序 (SPA)。</a>
            </li>
            <li>
                <a href="#test-manually">手动测试应用程序。</a>
            </li>
            <li>
                <a href="#add-automated-tests">添加自动化测试。</a>
            </li>
</list>
<chapter title="创建带有插件的新项目" id="create-project">
            <p>
                要使用 Ktor 项目生成器创建新项目，请按照以下步骤操作：
            </p>
<procedure id="create-project-procedure">
                <step>
    <p>
        导航到
        <a href="https://start.ktor.io/">Ktor 项目生成器</a>
        。
    </p>
                </step>
                <step>
                    <p>在
                        <control>Project artifact</control>
                        （项目 artifact）字段中，输入
                        <Path>com.example.ktor-exposed-task-app</Path>
                        作为您的项目 artifact 名称。
                        <img src="tutorial_server_db_integration_project_artifact.png"
                             alt="在 Ktor 项目生成器中命名项目 artifact"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>
                        在插件部分，通过点击
                        <control>Add</control>
                        （添加）按钮搜索并添加以下插件：
                    </p>
<list type="bullet">
                        <li>Routing</li>
                        <li>Content Negotiation</li>
                        <li>Kotlinx.serialization</li>
                        <li>Static Content</li>
                        <li>Status Pages</li>
                        <li>Exposed</li>
                        <li>Postgres</li>
</list>
                    <p>
                        <img src="ktor_project_generator_add_plugins.gif"
                             alt="在 Ktor 项目生成器中添加插件"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>
                        添加插件后，点击插件部分右上角的
                        <control>7 plugins</control>
                        （7 个插件）按钮以查看已添加的插件。
                    </p>
                    <p>您将看到一个将被添加到项目中的所有插件列表：
                        <img src="tutorial_server_db_integration_plugin_list.png"
                             alt="Ktor 项目生成器中的插件下拉菜单"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
    <p>
        点击
        <control>Download</control>
        （下载）按钮以生成并下载您的 Ktor 项目。
    </p>
                </step>
                <step>
                    <p>
                        在 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
                            IDEA</a> 或您选择的其他 IDE 中打开生成的项目。
                    </p>
                </step>
                <step>
                    <p>
                        导航到
                        <Path>src/main/kotlin/com/example</Path>
                        并删除文件
                        <Path>CitySchema.kt</Path>
                        和
                        <Path>UsersSchema.kt</Path>
                        。
                    </p>
                </step>
                <step id="delete-function">
                    <p>
                        打开
                        <Path>Databases.kt</Path>
                        文件并移除 `configureDatabases()` 函数的内容。
                    </p>
[object Promise]
                    <p>
                        移除此功能的原因是 Ktor 项目生成器已添加示例代码，以展示如何将用户和城市数据持久化到 HSQLDB 或 PostgreSQL。在本教程中，您不需要该示例代码。
                    </p>
                </step>
</procedure>
</chapter>
<chapter title="添加启动代码" id="add-starter-code">
<procedure id="add-starter-code-procedure">
                <step>
                    导航到
                    <Path>src/main/kotlin/com/example</Path>
                    并创建一个名为
                    <Path>model</Path>
                    的子包。
                </step>
                <step>
                    在
                    <Path>model</Path>
                    包中，创建一个新的
                    <Path>Task.kt</Path>
                    文件。
                </step>
                <step>
                    <p>
                        打开
                        <Path>Task.kt</Path>
                        并添加一个 `enum` 来表示优先级，以及一个 `class` 来表示任务。
                    </p>
[object Promise]
                    <p>
                        `Task` 类使用 <Links href="/ktor/server-serialization" summary="Content Negotiation 插件主要有两个用途：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。">kotlinx.serialization</Links> 库中的 `Serializable` 类型进行注解。
                    </p>
                    <p>
                        与之前的教程一样，您将创建一个内存版本库。但是，这次的版本库将实现一个 `interface`，以便您以后可以轻松替换它。
                    </p>
                </step>
                <step>
                    在
                    <Path>model</Path>
                    子包中，创建一个新的
                    <Path>TaskRepository.kt</Path>
                    文件。
                </step>
                <step>
                    <p>
                        打开
                        <Path>TaskRepository.kt</Path>
                        并添加以下 `interface`：
                    </p>
[object Promise]
                </step>
                <step>
                    在同一目录中创建一个新的
                    <Path>FakeTaskRepository.kt</Path>
                    文件。
                </step>
                <step>
                    <p>
                        打开
                        <Path>FakeTaskRepository.kt</Path>
                        并添加以下 `class`：
                    </p>
[object Promise]
                </step>
</procedure>
</chapter>
<chapter title="添加路由" id="add-routes">
<procedure id="add-routes-procedure">
                <step>
                    打开
                    <Path>src/main/kotlin/com/example</Path>
                    中的
                    <Path>Serialization.kt</Path>
                    文件。
                </step>
                <step>
                    <p>
                        将现有 `Application.configureSerialization()` 函数替换为以下实现：
                    </p>
[object Promise]
                    <p>
                        这与您在 <Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含生成 JSON 文件的 RESTful API 示例。">创建
                        RESTful API</Links> 教程中实现的路由相同，不同之处在于您现在将版本库作为形参传递给 `routing()` 函数。由于形参的类型是 `interface`，因此可以注入许多不同的实现。
                    </p>
                    <p>
                        现在您已向 `configureSerialization()` 添加了形参，现有调用将不再编译。幸运的是，此函数只被调用一次。
                    </p>
                </step>
                <step>
                    打开
                    <Path>src/main/kotlin/com/example</Path>
                    内的
                    <Path>Application.kt</Path>
                    文件。
                </step>
                <step>
                    <p>
                        将 `module()` 函数替换为以下实现：
                    </p>
[object Promise]
                    <p>
                        您现在正在将 `FakeTaskRepository` 的实例注入到 `configureSerialization()` 中。
                        长期目标是能够将其替换为 `PostgresTaskRepository`。
                    </p>
                </step>
</procedure>
</chapter>
<chapter title="添加客户端页面" id="add-client-page">
<procedure id="add-client-page-procedure">
                <step>
                    打开
                    <Path>src/main/resources/static</Path>
                    中的
                    <Path>index.html</Path>
                    文件。
                </step>
                <step>
                    <p>
                        将当前内容替换为以下实现：
                    </p>
[object Promise]
                    <p>
                        这与之前教程中使用的 SPA 相同。由于它用 JavaScript 编写，并且只使用浏览器中可用的库，因此您无需担心客户端依赖项。
                    </p>
                </step>
</procedure>
</chapter>
<chapter title="手动测试应用程序" id="test-manually">
<procedure id="test-manually-procedure">
                <p>
                    由于首次迭代使用内存版本库而非连接到数据库，因此您需要确保应用程序已正确配置。
                </p>
                <step>
                    <p>
                        导航到
                        <Path>src/main/resources/application.yaml</Path>
                        并移除 `postgres` 配置。
                    </p>
[object Promise]
                </step>
                <step>
    <p>在 IntelliJ IDEA 中，点击运行按钮
        (<img src="intellij_idea_gutter_icon.svg"
              style="inline" height="16" width="16"
              alt="intelliJ IDEA run icon"/>)
        以启动应用程序。</p>
                </step>
                <step>
                    <p>
                        在浏览器中导航到 <a
                            href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>
                        。您应该会看到由三个表单和一个显示过滤结果的表格组成的客户端页面。
                    </p>
                    <img src="tutorial_server_db_integration_index_page.png"
                         alt="显示任务管理器客户端的浏览器窗口"
                         border-effect="rounded"
                         width="706"/>
                </step>
                <step>
                    <p>
                        通过使用
                        <control>Go</control>
                        （前往）按钮填写并发送表单来测试应用程序。使用表格项上的
                        <control>View</control>
                        （查看）和
                        <control>Delete</control>
                        （删除）按钮。
                    </p>
                    <img src="tutorial_server_db_integration_manual_test.gif"
                         alt="显示任务管理器客户端的浏览器窗口"
                         border-effect="rounded"
                         width="706"/>
                </step>
</procedure>
</chapter>
<chapter title="添加自动化单元测试" id="add-automated-tests">
<procedure id="add-automated-tests-procedure">
                <step>
                    <p>
                        打开
                        <Path>src/test/kotlin/com/example</Path>
                        中的
                        <Path>ApplicationTest.kt</Path>
                        ，并添加以下测试：
                    </p>
[object Promise]
                    <p>
                        为了使这些测试能够编译和运行，您需要添加对 Ktor Client 的 <a
                            href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html">Content
                        Negotiation</a>
                        插件的依赖项。
                    </p>
                </step>
                <step>
                    <p>
                        打开
                        <Path>gradle/libs.versions.toml</Path>
                        文件并指定以下库：
                    </p>
[object Promise]
                </step>
                <step>
                    <p>
                        打开
                        <Path>build.gradle.kts</Path>
                        并添加以下依赖项：
                    </p>
[object Promise]
                </step>
                <step>
    <p>在 IntelliJ IDEA 中，点击编辑器右侧的 Gradle 通知图标
        (<img alt="intelliJ IDEA gradle icon"
              src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
        以加载 Gradle 变更。</p>
                </step>
                <step>
    <p>在 IntelliJ IDEA 中，点击测试类定义旁的运行按钮
        (<img src="intellij_idea_gutter_icon.svg"
              style="inline" height="16" width="16"
              alt="intelliJ IDEA run icon"/>)
        以运行测试。</p>
                    <p>您应该会看到测试在
                        <control>运行</control>
                        窗格中成功运行。
                    </p>
                    <img src="tutorial_server_db_integration_test_results.png"
                         alt="成功的测试结果显示在 IntelliJ IDEA 的运行窗格中"
                         border-effect="line"
                         width="706"/>
                </step>
</procedure>
</chapter>
</chapter>
<chapter title="添加 PostgreSQL 版本库" id="add-postgresql-repository">
        <p>
            既然您有了一个使用内存数据的工作应用程序，下一步就是将数据存储外部化到 PostgreSQL 数据库。
        </p>
        <p>
            您将通过以下方式实现此目标：
        </p>
<list type="decimal">
            <li><a href="#create-schema">在 PostgreSQL 中创建数据库模式。</a></li>
            <li><a href="#adapt-repo">调整 `TaskRepository` 以进行异步访问。</a></li>
            <li><a href="#config-db-connection">在应用程序中配置数据库连接。</a></li>
            <li><a href="#create-mapping">将 `Task` 类型映射到关联的数据库表。</a></li>
            <li><a href="#create-new-repo">根据此映射创建一个新的版本库。</a></li>
            <li><a href="#switch-repo">在启动代码中切换到此新版本库。</a></li>
</list>
<chapter title="创建数据库模式" id="create-schema">
<procedure id="create-schema-procedure">
                <step>
                    <p>
                        使用您选择的数据库管理工具，在 PostgreSQL 中创建一个新数据库。
                        名称不重要，只要您记住它即可。在此示例中，我们将使用
                        <Path>ktor_tutorial_db</Path>
                        。
                    </p>
                    <tip>
                        <p>
                            有关 PostgreSQL 的更多信息，请参阅<a
                                href="https://www.postgresql.org/docs/current/">官方文档</a>。
                        </p>
                        <p>
                            在 IntelliJ IDEA 中，您可以使用数据库工具<a
                                href="https://www.jetbrains.com/help/idea/postgresql.html">连接并管理您的 PostgreSQL
                            数据库。</a>
                        </p>
</tip>
                </step>
                <step>
                    <p>
                        对您的数据库运行以下 SQL 命令。这些命令将创建并填充数据库模式：
                    </p>
[object Promise]
                    <p>
                        请注意以下几点：
                    </p>
<list>
                        <li>
                            您正在创建一个名为
                            <Path>task</Path>
                            的单个表，其中包含
                            <Path>name</Path>
                            、
                            <Path>description</Path>
                            和
                            <Path>priority</Path>
                            的列。这些列需要映射到 `Task` 类的属性。
                        </li>
                        <li>
                            如果表已存在，您正在重新创建该表，因此您可以重复运行此脚本。
                        </li>
                        <li>
                            还有一个名为
                            <Path>id</Path>
                            的额外列，其类型为 `SERIAL`。它将是一个整数值，用于为每一行提供主键。这些值将由数据库代表您分配。
                        </li>
</list>
                </step>
</procedure>
</chapter>
<chapter title="调整现有版本库" id="adapt-repo">
<procedure id="adapt-repo-procedure">
                <p>
                    在对数据库执行查询时，最好让它们异步运行，以避免阻塞处理 HTTP 请求的线程。在 Kotlin 中，这最好通过<a
                        href="https://kotlinlang.org/docs/coroutines-overview.html">协程</a>来管理。
                </p>
                <step>
                    <p>
                        打开
                        <Path>src/main/kotlin/com/example/model</Path>
                        中的
                        <Path>TaskRepository.kt</Path>
                        文件。
                    </p>
                </step>
                <step>
                    <p>
                        将 `suspend` 关键字添加到所有接口方法中：
                    </p>
[object Promise]
                    <p>
                        这将允许接口的实现方法在不同的协程调度器上启动作业。
                    </p>
                    <p>
                        您现在需要调整 `FakeTaskRepository` 的方法以匹配，尽管在该实现中您无需切换调度器。
                    </p>
                </step>
                <step>
                    <p>
                        打开
                        <Path>FakeTaskRepository.kt</Path>
                        文件并将 `suspend` 关键字添加到所有方法中：
                    </p>
[object Promise]
                    <p>
                        到目前为止，您尚未引入任何新功能。相反，您为创建将异步对数据库运行查询的 `PostgresTaskRepository` 奠定了基础。
                    </p>
                </step>
</procedure>
</chapter>
<chapter title="配置数据库连接" id="config-db-connection">
<procedure id="config-db-connection-procedure">
                <p>
                    在本教程的<a href="#delete-function">第一部分</a>中，您删除了 `Databases.kt` 文件中 `configureDatabases()` 方法中的示例代码。现在您已准备好添加自己的实现。
                </p>
                <step>
                    打开
                    <Path>src/main/kotlin/com/example</Path>
                    中的
                    <Path>Databases.kt</Path>
                    文件。
                </step>
                <step>
                    <p>
                        使用 `Database.connect()` 函数连接到您的数据库，调整设置值以匹配您的环境：
                    </p>
[object Promise]
                    <p>请注意，`url` 包含以下组件：</p>
<list>
                        <li>
                            <code>localhost:5432</code> 是 PostgreSQL 数据库正在运行的主机和端口。
                        </li>
                        <li>
                            <code>ktor_tutorial_db</code> 是运行服务时创建的数据库名称。
                        </li>
</list>
                    <tip>
                        有关更多信息，请参阅
                        <a href="https://jetbrains.github.io/Exposed/database-and-datasource.html">
                            在 Exposed 中使用 Database 和 DataSource</a>。
</tip>
                </step>
</procedure>
</chapter>
<chapter title="创建对象/关系映射" id="create-mapping">
<procedure id="create-mapping-procedure">
                <step>
                    导航到
                    <Path>src/main/kotlin/com/example</Path>
                    并创建一个名为
                    <Path>db</Path>
                    的新包。
                </step>
                <step>
                    在
                    <Path>db</Path>
                    包中，创建一个新的
                    <Path>mapping.kt</Path>
                    文件。
                </step>
                <step>
                    <p>
                        打开
                        <Path>mapping.kt</Path>
                        并添加 `TaskTable` 和 `TaskDAO` 类型：
                    </p>
[object Promise]
                    <p>
                        这些类型使用 Exposed 库将 `Task` 类型中的属性映射到数据库中 `task` 表的列。`TaskTable` 类型定义了基本映射，而 `TaskDAO` 类型添加了用于创建、查找、更新和删除任务的辅助方法。
                    </p>
                    <p>
                        Ktor 项目生成器尚未添加对 DAO 类型的支持，因此您需要在 Gradle 构建文件中添加相关依赖项。
                    </p>
                </step>
                <step>
                    <p>
                        打开
                        <Path>gradle/libs.versions.toml</Path>
                        文件并指定以下库：
                    </p>
[object Promise]
                </step>
                <step>
                    <p>
                        打开
                        <Path>build.gradle.kts</Path>
                        文件并添加以下依赖项：
                    </p>
[object Promise]
                </step>
                <step>
    <p>在 IntelliJ IDEA 中，点击编辑器右侧的 Gradle 通知图标
        (<img alt="intelliJ IDEA gradle icon"
              src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
        以加载 Gradle 变更。</p>
                </step>
                <step>
                    <p>
                        导航回
                        <Path>mapping.kt</Path>
                        文件并添加以下两个辅助函数：
                    </p>
[object Promise]
                    <p>
                        `suspendTransaction()` 接受一个代码块，并通过 IO Dispatcher 在数据库事务中运行它。这旨在将阻塞的作业卸载到线程池中。
                    </p>
                    <p>
                        `daoToModel()` 将 `TaskDAO` 类型的实例转换为 `Task` 对象。
                    </p>
                </step>
                <step>
                    <p>
                        添加以下缺失的导入：
                    </p>
[object Promise]
                </step>
</procedure>
</chapter>
<chapter title="编写新版本库" id="create-new-repo">
<procedure id="create-new-repo-procedure">
                <p>您现在拥有创建数据库特有版本库所需的所有资源。</p>
                <step>
                    导航到
                    <Path>src/main/kotlin/com/example/model</Path>
                    并创建一个新的
                    <Path>PostgresTaskRepository.kt</Path>
                    文件。
                </step>
                <step>
                    <p>
                        打开
                        <Path>PostgresTaskRepository.kt</Path>
                        文件并创建一个包含以下实现的新类型：
                    </p>
[object Promise]
                    <p>
                        在此实现中，您使用 `TaskDAO` 和 `TaskTable` 类型的辅助方法与数据库交互。创建此新版本库后，剩下的唯一任务是在您的路由中切换使用它。
                    </p>
                </step>
</procedure>
</chapter>
<chapter title="切换到新版本库" id="switch-repo">
<procedure id="switch-repo-procedure">
                <p>要切换到外部数据库，您只需更改版本库类型。</p>
                <step>
                    打开
                    <Path>src/main/kotlin/com/example</Path>
                    中的
                    <Path>Application.kt</Path>
                    文件。
                </step>
                <step>
                    <p>
                        在 `Application.module()` 函数中，将 `FakeTaskRepository` 替换为 `PostgresTaskRepository`：
                    </p>
[object Promise]
                    <p>
                        由于您是通过接口注入依赖项的，因此实现的切换对于管理路由的代码是透明的。
                    </p>
                </step>
                <step>
    <p>
        在 IntelliJ IDEA 中，点击重新运行按钮 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="intelliJ IDEA rerun icon"/>) 以重启应用程序。
    </p>
                </step>
                <step>
                    导航到 <a
                        href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。
                    UI 保持不变，但它现在从数据库获取数据。
                </step>
                <step>
                    <p>
                        为了验证这一点，使用表单添加一个新任务，并查询 PostgreSQL 中任务表中的数据。
                    </p>
                    <tip>
                        <p>
                            在 IntelliJ IDEA 中，您可以使用<a href="https://www.jetbrains.com/help/idea/query-consoles.html#create_console">查询控制台</a>和 `SELECT` SQL 语句来查询表数据：
                        </p>
[object Promise]
                        <p>
                            查询后，数据应显示在
                            <ui-path>服务</ui-path>
                            窗格中，包括新任务：
                        </p>
                        <img src="tutorial_server_db_integration_task_table.png"
                             alt="IntelliJ IDEA 的服务窗格中显示的任务表"
                             border-effect="line"
                             width="706"/>
</tip>
                </step>
</procedure>
</chapter>
        <p>
            至此，您已成功完成将数据库集成到您的应用程序中。
        </p>
        <p>
            由于 `FakeTaskRepository` 类型在生产代码中不再需要，您可以将其移动到测试源代码集，即
            <Path>src/test/com/example</Path>
            。
        </p>
        <p>
            最终的项目结构应如下所示：
        </p>
        <img src="tutorial_server_db_integration_src_folder.png"
             alt="IntelliJ IDEA 的项目视图中显示的 src 文件夹"
             border-effect="line"
             width="400"/>
</chapter>
<chapter title="后续步骤" id="next-steps">
        <p>
            您现在有一个与 Ktor RESTful 服务通信的应用程序。该应用程序反过来使用通过 <a href="https://github.com/JetBrains/Exposed">Exposed</a> 编写的版本库来访问
            <a href="https://www.postgresql.org/docs/">PostgreSQL</a>。您还有<a href="#add-automated-tests">一套测试</a>，用于验证核心功能，而无需 Web 服务器或数据库。
        </p>
        <p>
            这种结构可以根据需要进行扩展以支持任意功能，但是，您可能需要首先考虑设计的非功能性方面，例如容错性、安全性和可伸缩性。您可以从<a href="docker-compose.topic#extract-db-settings">将数据库设置提取</a>到<Links href="/ktor/server-configuration-file" summary="了解如何在配置文件中配置各种服务器参数。">配置文件</Links>开始。
        </p>
</chapter>
</topic>