<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="如何使用 Ktor 在 Kotlin 中创建 RESTful API" id="server-create-restful-apis"
       help-id="create-restful-apis">
<show-structure for="chapter" depth="2"/>
<tldr>
        <var name="example_name" value="tutorial-server-restful-api"/>
<p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
</p>
        <p>
            <b>使用的插件</b>: <Links href="/ktor/server-routing" summary="路由是服务器应用程序中用于处理传入请求的核心插件。">Routing</Links>,<Links href="/ktor/server-static-content" summary="了解如何提供静态内容，例如样式表、脚本、图像等。">Static Content</Links>,
            <Links href="/ktor/server-serialization" summary="ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。">Content Negotiation</Links>, <a
                href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>
        </p>
</tldr>
<card-summary>
        了解如何使用 Ktor 构建 RESTful API。本教程涵盖了在实际示例上的设置、路由和测试。
</card-summary>
<web-summary>
        学习使用 Ktor 构建 Kotlin RESTful API。本教程涵盖了在实际示例上的设置、路由和测试。这是 Kotlin 后端开发者的理想入门教程。
</web-summary>
<link-summary>
        了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。
</link-summary>
<p>
        在本教程中，我们将解释如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。
</p>
<p>
        在<Links href="/ktor/server-requests-and-responses" summary="通过构建任务管理器应用程序，学习使用 Ktor 在 Kotlin 中进行路由、处理请求和参数的基础知识。">上一个教程</Links>中，我们向你介绍了验证、错误处理和单元测试的基础知识。本教程将通过创建一个用于管理任务的 RESTful 服务来扩展这些主题。
</p>
<p>
        你将学习如何执行以下操作：
</p>
<list>
        <li>创建使用 JSON 序列化的 RESTful 服务。</li>
        <li>理解内容协商（Content Negotiation）的过程。</li>
        <li>在 Ktor 中定义 REST API 的路由。</li>
</list>
<chapter title="先决条件" id="prerequisites">
        <p>你可以独立完成本教程，
            但是，我们强烈建议你完成上一个教程，学习如何<Links href="/ktor/server-requests-and-responses" summary="通过构建任务管理器应用程序，学习使用 Ktor 在 Kotlin 中进行路由、处理请求和参数的基础知识。">处理请求和生成响应</Links>。
        </p>
        <p>我们建议你安装 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
            IDEA</a>，但你也可以使用其他你选择的 IDE。
        </p>
</chapter>
<chapter title="你好，RESTful 任务管理器" id="hello-restful-task-manager">
        <p>在本教程中，你将把现有的任务管理器重写为一个 RESTful 服务。为此，你将使用几个 Ktor <Links href="/ktor/server-plugins" summary="插件提供通用功能，例如序列化、内容编码、压缩等。">插件</Links>。</p>
        <p>
            虽然你可以手动将其添加到现有项目中，但更简单的方法是生成一个新项目，然后增量添加上一个教程中的代码。你将在此过程中重申所有代码，因此无需手头拥有上一个项目。
        </p>
        <procedure title="创建带插件的新项目">
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
                    字段中，输入
                    <Path>com.example.ktor-rest-task-app</Path>
                    作为你的项目 artifact 的名称。
                    <img src="tutorial_creating_restful_apis_project_artifact.png"
                         alt="在 Ktor 项目生成器中命名项目 artifact"
                         style="block"
                         border-effect="line"
                         width="706"/>
                </p>
            </step>
            <step>
                <p>
                    在插件部分中，点击
                    <control>添加</control>
                    按钮搜索并添加以下插件：
                </p>
                <list type="bullet">
                    <li>Routing</li>
                    <li>Content Negotiation</li>
                    <li>Kotlinx.serialization</li>
                    <li>Static Content</li>
                </list>
                <p>
                    <img src="ktor_project_generator_add_plugins.gif" alt="在 Ktor 项目生成器中添加插件"
                         border-effect="line"
                         style="block"
                         width="706"/>
                    添加插件后，你将在项目设置下方看到所有
                    四个插件。
                    <img src="tutorial_creating_restful_apis_plugins_list.png"
                         alt="Ktor 项目生成器中的插件列表"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
<p>
        点击
        <control>下载</control>
        按钮以生成并下载你的 Ktor 项目。
</p>
            </step>
        </procedure>
        <procedure title="添加启动代码" id="add-starter-code">
            <step>
                <p>在 IntelliJ IDEA 中打开你的项目，如<a href="server-create-a-new-project.topic#open-explore-run">在 IntelliJ IDEA 中打开、探查和运行 Ktor 项目</a>教程中所述。</p>
            </step>
            <step>
                <p>
                    导航到
                    <Path>src/main/kotlin/com/example</Path>
                    并创建一个名为
                    <Path>model</Path>
                    的子包。
                </p>
            </step>
            <step>
                <p>
                    在
                    <Path>model</Path>
                    包内，创建一个新的
                    <Path>Task.kt</Path>
                    文件。
                </p>
            </step>
            <step>
                <p>
                    打开
                    <Path>Task.kt</Path>
                    文件并添加一个 <code>enum</code> 来表示优先级，以及一个 <code>class</code>
                    来表示任务：
                </p>
                [object Promise]
                <p>
                    在上一个教程中，你使用了扩展函数将 <code>Task</code> 转换为 HTML。在本例中，
                    <code>Task</code> 类使用来自
                    <code>kotlinx.serialization</code> 库的 <a
                        href="https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serializable/"><code>Serializable</code></a>
                    类型进行了注解。
                </p>
            </step>
            <step>
                <p>
                    打开
                    <Path>Routing.kt</Path>
                    文件，并将现有代码替换为以下实现：
                </p>
                [object Promise]
                <p>
                    与上一个教程类似，你为 URL <code>/tasks</code> 的 GET 请求创建了一个路由。
                    这次，你无需手动转换任务列表，而是直接返回列表。
                </p>
            </step>
            <step>
<p>在 IntelliJ IDEA 中，点击运行按钮
        (<img src="intellij_idea_gutter_icon.svg"
              style="inline" height="16" width="16"
              alt="IntelliJ IDEA 运行图标"/>)
        来启动应用程序。</p>
            </step>
            <step>
                <p>
                    在浏览器中导航到 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。你应该会看到任务列表的 JSON 版本，如下所示：
                </p>
            </step>
            <img src="tutorial_creating_restful_apis_starter_code_preview.png"
                 alt="浏览器屏幕中显示的 JSON 数据"
                 border-effect="rounded"
                 width="706"/>
            <p>显然，很多工作正在替我们完成。到底发生了什么？</p>
        </procedure>
    </chapter>
    <chapter title="理解内容协商" id="content-negotiation">
        <chapter title="通过浏览器进行内容协商" id="via-browser">
            <p>
                当你创建项目时，你包含了 <Links href="/ktor/server-serialization" summary="ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。">Content Negotiation</Links>
                插件。此插件会查看客户端可以渲染的内容类型，并将其与当前服务可以提供的内容类型进行匹配。因此，得名
                <format style="italic">内容协商</format>。
            </p>
            <p>
                在 HTTP 中，客户端通过 <code>Accept</code> 请求头指示它能渲染哪些内容类型。此请求头的值是一个或多个内容类型。在上面的情况下，你可以使用浏览器内置的开发工具检查此请求头的值。
            </p>
            <p>
                考虑以下示例：
            </p>
            [object Promise]
            <p>请注意 <code>*/*</code> 的包含。此请求头表示它接受 HTML、XML 或图像——但它也
                接受任何其他内容类型。</p>
            <p>Content Negotiation 插件需要找到一种格式来将数据发送回浏览器。如果你查看
                项目中的生成代码，你会在
                <Path>src/main/kotlin/com/example</Path> 内部找到一个名为
                <Path>Serialization.kt</Path> 的文件，其中包含以下内容：
            </p>
            [object Promise]
            <p>
                此代码安装了 <code>ContentNegotiation</code> 插件，并配置了 <code>kotlinx.serialization</code>
                插件。有了它，当客户端发送请求时，服务器可以发送序列化为 JSON 的对象。
            </p>
            <p>
                对于来自浏览器的请求，<code>ContentNegotiation</code> 插件知道它只能
                返回 JSON，并且浏览器会尝试显示它收到的任何内容。因此，请求成功。
            </p>
        </chapter>
        <procedure title="通过 JavaScript 进行内容协商" id="via-javascript">
            <p>
                在生产环境中，你不会希望直接在浏览器中显示 JSON。相反，会有 JavaScript 代码在浏览器中运行，它会发出请求，然后将返回的数据作为单页应用程序 (SPA) 的一部分显示。通常，这类应用程序会使用 <a href="https://react.dev/">React</a>、<a href="https://angular.io/">Angular</a> 或 <a href="https://vuejs.org/">Vue.js</a> 等框架编写。
            </p>
            <step>
                <p>
                    为了模拟这种情况，打开
                    <Path>src/main/resources/static</Path> 内部的
                    <Path>index.html</Path> 页面，并将其默认内容替换为以下内容：
                </p>
                [object Promise]
                <p>
                    此页面包含一个 HTML 表单和一个空表。提交表单后，JavaScript 事件处理程序会向 <code>/tasks</code> 端点发送请求，并将 <code>Accept</code> 请求头设置为
                    <code>application/json</code>。返回的数据随后被反序列化并添加到 HTML 表格中。
                </p>
            </step>
            <step>
<p>
        在 IntelliJ IDEA 中，点击重新运行按钮 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEA 重新运行图标"/>) 来重启应用程序。
</p>
            </step>
            <step>
                <p>
                    导航到 URL <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。
                    你应该能够通过点击
                    <control>查看任务</control>
                    按钮来获取数据：
                </p>
                <img src="tutorial_creating_restful_apis_tasks_via_js.png"
                     alt="显示按钮和以 HTML 表格形式显示任务的浏览器窗口"
                     border-effect="line"
                     width="706"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="添加 GET 路由" id="porting-get-routes">
        <p>
            现在你已经熟悉了内容协商的过程，请继续将<Links href="/ktor/server-requests-and-responses" summary="通过构建任务管理器应用程序，学习使用 Ktor 在 Kotlin 中进行路由、处理请求和参数的基础知识。">上一个教程</Links>中的功能
            转移到本教程中。
        </p>
        <chapter title="复用任务仓库" id="task-repository">
            <p>
                你可以不经修改地复用 Tasks 的仓库，所以我们先做这件事。
            </p>
            <procedure>
                <step>
                    <p>
                        在
                        <Path>model</Path>
                        包内创建一个新的
                        <Path>TaskRepository.kt</Path>
                        文件。
                    </p>
                </step>
                <step>
                    <p>
                        打开
                        <Path>TaskRepository.kt</Path>
                        并添加以下代码：
                    </p>
                    [object Promise]
                </step>
            </procedure>
        </chapter>
        <chapter title="复用 GET 请求的路由" id="get-requests">
            <p>
                现在你已经创建了仓库，可以实现 GET 请求的路由了。之前的
                代码可以简化，因为你不再需要担心将任务转换为 HTML：
            </p>
            <procedure>
                <step>
                    <p>
                        导航到
                        <Path>src/main/kotlin/com/example</Path> 中的
                        <Path>Routing.kt</Path> 文件。
                    </p>
                </step>
                <step>
                    <p>
                        使用以下实现更新 <code>Application.configureRouting()</code> 函数中 <code>/tasks</code> 路由的代码：
                    </p>
                    [object Promise]
                    <p>
                        有了这个，你的服务器可以响应以下 GET 请求：</p>
                    <list>
                        <li><code>/tasks</code> 返回仓库中的所有任务。</li>
                        <li><code>/tasks/byName/{taskName}</code> 返回按指定
                            <code>taskName</code> 筛选的任务。
                        </li>
                        <li><code>/tasks/byPriority/{priority}</code> 返回按指定
                            <code>priority</code> 筛选的任务。
                        </li>
                    </list>
                </step>
                <step>
<p>
        在 IntelliJ IDEA 中，点击重新运行按钮 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEA 重新运行图标"/>) 来重启应用程序。
</p>
                </step>
            </procedure>
        </chapter>
        <chapter title="测试功能" id="test-tasks-routes">
            <procedure title="使用浏览器">
                <p>你可以在浏览器中测试这些路由。例如，导航到 <a
                        href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>
                    以查看所有优先级为 <code>Medium</code> 的任务，以 JSON 格式显示：</p>
                <img src="tutorial_creating_restful_apis_tasks_medium_priority.png"
                     alt="显示中等优先级任务的 JSON 格式的浏览器窗口"
                     border-effect="rounded"
                     width="706"/>
                <p>
                    鉴于这类请求通常来自 JavaScript，因此更
                    细粒度的测试是更可取的。为此，你可以使用专门的工具，例如 <a
                        href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>。
                </p>
            </procedure>
            <procedure title="使用 Postman">
                <step>
                    <p>在 Postman 中，创建新的 GET 请求，URL 为
                        <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>。</p>
                </step>
                <step>
                    <p>
                        在
                        <ui-path>请求头</ui-path>
                        窗格中，将
                        <ui-path>Accept</ui-path>
                        请求头的值设置为 <code>application/json</code>。
                    </p>
                </step>
                <step>
                    <p>点击
                        <control>发送</control>
                        以发送请求并在响应查看器中查看响应。
                    </p>
                    <img src="tutorial_creating_restful_apis_tasks_medium_priority_postman.png"
                         alt="Postman 中显示中等优先级任务 JSON 格式的 GET 请求"
                         border-effect="rounded"
                         width="706"/>
                </step>
            </procedure>
            <procedure title="使用 HTTP 请求文件">
                <p>在 IntelliJ IDEA Ultimate 中，你可以在 HTTP 请求文件中执行相同的步骤。</p>
                <step>
                    <p>
                        在项目根目录中，创建一个新的
                        <Path>REST Task Manager.http</Path>
                        文件。
                    </p>
                </step>
                <step>
                    <p>
                        打开
                        <Path>REST Task Manager.http</Path>
                        文件并添加以下 GET 请求：
                    </p>
                    [object Promise]
                </step>
                <step>
                    <p>
                        要在 IntelliJ IDEA 中发送请求，点击旁边的侧边栏图标 (<img
                            alt="IntelliJ IDEA 侧边栏图标"
                            src="intellij_idea_gutter_icon.svg"
                            width="16" height="26"/>)。
                    </p>
                </step>
                <step>
                    <p>这将在
                        <Path>Services</Path>
                        工具窗口中打开并运行：
                    </p>
                    <img src="tutorial_creating_restful_apis_tasks_medium_priority_http_file.png"
                         alt="HTTP 文件中显示中等优先级任务 JSON 格式的 GET 请求"
                         border-effect="rounded"
                         width="706"/>
                </step>
            </procedure>
            <note>
                另一种测试路由的方法是使用 Kotlin
                Notebook 中的 <a
                    href="https://khttp.readthedocs.io/en/latest/">khttp</a> 库。
            </note>
        </chapter>
    </chapter>
    <chapter title="为 POST 请求添加路由" id="add-a-route-for-post-requests">
        <p>
            在上一个教程中，任务是通过 HTML 表单创建的。然而，由于你现在正在构建 RESTful 服务，你不再需要这样做。相反，你将利用 <code>kotlinx.serialization</code>
            框架，它将完成大部分繁重的工作。
        </p>
        <procedure>
            <step>
                <p>
                    打开
                    <Path>src/main/kotlin/com/example</Path> 内部的
                    <Path>Routing.kt</Path> 文件。
                </p>
            </step>
            <step>
                <p>
                    向 <code>Application.configureRouting()</code> 函数添加新的 POST 路由，如下所示：
                </p>
                [object Promise]
                <p>
                    添加以下新的导入：
                </p>
                [object Promise]
                <p>
                    当 POST 请求发送到 <code>/tasks</code> 时，<code>kotlinx.serialization</code> 框架用于将请求体转换为 <code>Task</code> 对象。如果成功，任务将被添加到仓库中。如果反序列化过程失败，服务器需要处理 <code>SerializationException</code>，而如果任务重复，则需要处理 <code>IllegalStateException</code>。
                </p>
            </step>
            <step>
                <p>
                    重启应用程序。
                </p>
            </step>
            <step>
                <p>
                    要在 Postman 中测试此功能，创建一个新的 POST 请求，URL 为 <code>http://0.0.0.0:8080/tasks</code>。
                </p>
            </step>
            <step>
                <p>
                    在
                    <ui-path>请求体</ui-path>
                    窗格中，添加以下 JSON 文档来表示一个新任务：
                </p>
                [object Promise]
                <img src="tutorial_creating_restful_apis_add_task.png"
                     alt="Postman 中用于添加新任务的 POST 请求"
                     border-effect="line"
                     width="706"/>
            </step>
            <step>
                <p>点击
                    <control>发送</control>
                    以发送请求。
                </p>
            </step>
            <step>
                <p>
                    你可以通过向 <a
                        href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a> 发送 GET 请求来验证任务是否已添加。
                </p>
            </step>
            <step>
                <p>
                    在 IntelliJ IDEA Ultimate 中，你可以通过将以下内容添加到你的 HTTP
                    请求文件中来执行相同的步骤：
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="添加移除支持" id="remove-tasks">
        <p>
            你已几乎完成向服务添加基本操作。这些操作通常被概括为 CRUD 操作——即创建（Create）、读取（Read）、更新（Update）和删除（Delete）的缩写。现在你将实现删除操作。
        </p>
        <procedure>
            <step>
                <p>
                    在
                    <Path>TaskRepository.kt</Path>
                    文件中，在 <code>TaskRepository</code> 对象内添加以下方法，用于根据任务名称移除任务：
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    打开
                    <Path>Routing.kt</Path>
                    文件，并在 <code>routing()</code> 函数中添加一个端点来处理 DELETE 请求：
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    重启应用程序。
                </p>
            </step>
            <step>
                <p>
                    将以下 DELETE 请求添加到你的 HTTP 请求文件中：
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    要在 IntelliJ IDEA 中发送 DELETE 请求，点击旁边的侧边栏图标 (<img
                        alt="IntelliJ IDEA 侧边栏图标"
                        src="intellij_idea_gutter_icon.svg"
                        width="16" height="26"/>)。
                </p>
            </step>
            <step>
                <p>你将在
                    <Path>Services</Path>
                    工具窗口中看到响应：
                </p>
                <img src="tutorial_creating_restful_apis_delete_task.png"
                     alt="HTTP 请求文件中的 DELETE 请求"
                     border-effect="line"
                     width="706"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="使用 Ktor Client 创建单元测试" id="create-unit-tests">
        <p>
            到目前为止，你都是手动测试应用程序，但是，正如你已经注意到的，这种方法耗时且无法扩展。相反，你可以使用内置的
            <code>client</code> 对象来获取和反序列化 JSON，从而实现 <Links href="/ktor/server-testing" summary="了解如何使用特殊的测试引擎测试服务器应用程序。">JUnit 测试</Links>。
        </p>
        <procedure>
            <step>
                <p>
                    打开
                    <Path>src/test/kotlin/com/example</Path> 中的
                    <Path>ApplicationTest.kt</Path> 文件。
                </p>
            </step>
            <step>
                <p>
                    将
                    <Path>ApplicationTest.kt</Path> 文件的内容替换为以下内容：
                </p>
                [object Promise]
                <p>
                    请注意，你需要将 <code>ContentNegotiation</code> 和
                    <code>kotlinx.serialization</code> 插件安装到 <a href="client-create-and-configure.md#plugins">Plugins</a> 中，就像你在服务器上所做的那样。
                </p>
            </step>
            <step>
                <p>
                    将以下依赖项添加到你的版本目录中，该目录位于
                    <Path>gradle/libs.versions.toml</Path>：
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    将新依赖项添加到你的
                    <Path>build.gradle.kts</Path>
                    文件中：
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="使用 JsonPath 创建单元测试" id="unit-tests-via-jsonpath">
        <p>
            使用 Ktor client 或类似库测试服务很方便，但从质量保证 (QA) 的角度来看，它有一个缺点。服务器不直接处理 JSON，因此无法确定其对 JSON 结构的假设是否正确。
        </p>
        <p>
            例如，诸如以下假设：
        </p>
        <list>
            <li>值以 <code>array</code> 形式存储，而实际使用的是 <code>object</code>。</li>
            <li>属性以 <code>numbers</code> 形式存储，而实际是 <code>strings</code>。</li>
            <li>成员以声明顺序序列化，但实际并非如此。</li>
        </list>
        <p>
            如果你的服务旨在供多个客户端使用，那么对 JSON
            结构的信心至关重要。为此，请使用 Ktor Client 从服务器检索文本，然后使用 <a href="https://mvnrepository.com/artifact/com.jayway.jsonpath/json-path">JSONPath</a>
            库分析此内容。</p>
        <procedure>
            <step>
                <p>在你的
                    <Path>build.gradle.kts</Path>
                    文件中，将 JSONPath 库添加到 <code>dependencies</code> 代码块：
                </p>
                [object Promise]
            </step>
            <step>
                <p>
                    导航到
                    <Path>src/test/kotlin/com/example</Path> 文件夹并创建一个新的
                    <Path>ApplicationJsonPathTest.kt</Path>
                    文件。
                </p>
            </step>
            <step>
                <p>
                    打开
                    <Path>ApplicationJsonPathTest.kt</Path>
                    文件并添加以下内容：
                </p>
                [object Promise]
                <p>
                    JsonPath 查询的工作方式如下：
                </p>
                <list>
                    <li>
                        <code>$[*].name</code> 表示“将文档视为一个 array，并返回每个条目的 name 属性的值”。
                    </li>
                    <li>
                        <code>$[?(@.priority == '$priority')].name</code> 表示“返回 array 中优先级等于所提供值的每个条目的 name 属性的值”。
                    </li>
                </list>
                <p>
                    你可以使用这些查询来确认你对返回 JSON 的理解。当你进行代码重构和服务重新部署时，即使序列化中的任何修改不会中断当前框架的反序列化，它们也会被识别出来。这让你能够自信地重新发布公开可用的 API。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="后续步骤" id="next-steps">
        <p>
            恭喜！你现在已经完成了为任务管理器应用程序创建 RESTful API 服务，并掌握了使用 Ktor Client 和 JsonPath 进行单元测试的细节。</p>
        <p>
            继续学习
            <Links href="/ktor/server-create-website" summary="了解如何使用 Kotlin 和 Ktor 以及 Thymeleaf 模板构建网站。">下一个教程</Links>
            以学习如何复用你的 API 服务来构建 Web 应用程序。
        </p>
    </chapter>
</topic>