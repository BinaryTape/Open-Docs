<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="在 Kotlin 中使用 Ktor 创建 WebSocket 应用程序" id="server-create-websocket-application">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-server-websockets"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用的插件</b>: <Links href="/ktor/server-routing" summary="路由是一个核心插件，用于处理服务器应用程序中的传入请求。">Routing</Links>、<Links href="/ktor/server-static-content" summary="了解如何提供静态内容，例如样式表、脚本、图像等。">Static Content</Links>、
        <Links href="/ktor/server-serialization" summary="ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。">Content Negotiation</Links>、 <Links href="/ktor/server-websockets" summary="Websockets 插件允许您在服务器和客户端之间创建多向通信会话。">WebSockets in Ktor Server</Links>、
        <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>
    </p>
</tldr>
<card-summary>
    了解如何利用 WebSockets 的强大功能来发送和接收内容。
</card-summary>
<link-summary>
    了解如何利用 WebSockets 的强大功能来发送和接收内容。
</link-summary>
<web-summary>
    了解如何使用 Ktor 在 Kotlin 中构建 WebSocket 应用程序。本教程将引导您完成通过 WebSockets 将后端服务与客户端连接的过程。
</web-summary>
<p>
    本文将引导您完成使用 Ktor 在 Kotlin 中创建 WebSocket 应用程序的过程。它建立在 <Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。">创建 RESTful API</Links> 教程中涵盖的材料基础上。
</p>
<p>本文将教您如何执行以下操作：</p>
<list>
    <li>创建使用 JSON 序列化的服务。</li>
    <li>通过 WebSocket 连接发送和接收内容。</li>
    <li>同时向多个客户端广播内容。</li>
</list>
<chapter title="先决条件" id="prerequisites">
    <p>您可以独立完成本教程，但我们建议您完成
        <Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。">创建 RESTful API</Links> 教程，以熟悉 <Links href="/ktor/server-serialization" summary="ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。">Content Negotiation</Links> 和 REST。
    </p>
    <p>我们建议您安装 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ IDEA</a>，但您可以使用您选择的其他 IDE。
    </p>
</chapter>
<chapter title="Hello WebSockets" id="hello-websockets">
    <p>
        在本教程中，您将通过添加通过 WebSocket 连接与客户端交换 <code>Task</code> 对象的能力，来构建在 <Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。">创建 RESTful API</Links> 教程中开发的任务管理器服务。为实现此目的，您需要添加 <Links href="/ktor/server-websockets" summary="Websockets 插件允许您在服务器和客户端之间创建多向通信会话。">WebSockets 插件</Links>。虽然您可以手动将其添加到现有项目中，但为了本教程的方便，我们将从头开始创建一个新项目。
    </p>
    <chapter title="创建带有插件的初始项目" id="create=project">
        <procedure>
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
                    <Path>com.example.ktor-websockets-task-app</Path>
                    作为项目 artifact 的名称。
                    <img src="tutorial_server_websockets_project_artifact.png"
                         alt="在 Ktor 项目生成器中命名项目 artifact"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
                <p>
                    在插件部分中，通过点击
                    <control>Add</control>
                    按钮来搜索并添加以下插件：
                </p>
                <list type="bullet">
                    <li>Routing</li>
                    <li>Content Negotiation</li>
                    <li>Kotlinx.serialization</li>
                    <li>WebSockets</li>
                    <li>Static Content</li>
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
                    <control>5 plugins</control>
                    按钮，以显示已添加的插件。
                </p>
                <p>您将看到一个将被添加到项目中的所有插件的列表：
                    <img src="tutorial_server_websockets_project_plugins.png"
                         alt="Ktor 项目生成器中的插件列表"
                         border-effect="line"
                         style="block"
                         width="706"/>
                </p>
            </step>
            <step>
<p>
    点击
    <control>Download</control>
    按钮以生成并下载您的 Ktor 项目。
</p>
            </step>
        </procedure>
    </chapter>
    <chapter title="添加启动代码" id="add-starter-code">
        <p>下载完成后，在 IntelliJ IDEA 中打开您的项目并按照以下步骤操作：</p>
        <procedure>
            <step>
                导航到
                <Path>src/main/kotlin</Path>
                并创建一个新的子包，名为
                <Path>model</Path>
                。
            </step>
            <step>
                <p>
                    在
                    <Path>model</Path>
                    包内创建一个新的
                    <Path>Task.kt</Path>
                    文件。
                </p>
            </step>
            <step>
                <p>
                    打开
                    <Path>Task.kt</Path>
                    文件并添加一个 <code>enum</code> 来表示优先级，以及一个 <code>data class</code> 来表示任务：
                </p>
                [object Promise]
                <p>
                    请注意，<code>Task</code> 类使用 <code>kotlinx.serialization</code> 库中的 <code>Serializable</code> 类型进行注解。这意味着实例可以转换为 JSON 并从 JSON 转换，从而允许其内容通过网络传输。
                </p>
                <p>
                    由于您包含了 WebSockets 插件，因此在
                    <Path>src/main/kotlin/com/example/plugins</Path>
                    中生成了一个
                    <Path>Sockets.kt</Path>
                    文件。
                </p>
            </step>
            <step>
                <p>
                    打开
                    <Path>Sockets.kt</Path>
                    文件并用以下实现替换现有的 <code>Application.configureSockets()</code> 函数：
                </p>
                [object Promise]
                <p>
                    在此代码中，会执行以下步骤：
                </p>
                <list type="decimal">
                    <li>WebSockets 插件已安装并配置了标准设置。</li>
                    <li><code>contentConverter</code> 属性已设置，使插件能够通过 <a
                            href="https://github.com/Kotlin/kotlinx.serialization">kotlinx.serialization</a>
                        库序列化和反序列化通过它发送和接收的对象。
                    </li>
                    <li>路由配置了一个单独的端点，相对 URL 为 <code>/tasks</code>。
                    </li>
                    <li>收到请求后，任务列表会通过 WebSocket 连接进行序列化并发送。</li>
                    <li>一旦所有项都已发送，服务器会关闭连接。</li>
                </list>
                <p>
                    为了演示目的，在发送任务之间引入了一秒的延迟。这使我们能够观察任务在客户端中增量出现。如果没有此延迟，则示例将与之前文章中开发的 <Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。">RESTful 服务</Links> 和 <Links href="/ktor/server-create-website" summary="了解如何使用 Ktor 和 Thymeleaf 模板在 Kotlin 中构建网站。">Web 应用程序</Links> 看起来完全相同。
                </p>
                <p>
                    此迭代的最后一步是为此端点创建一个客户端。由于您包含了
                    <Links href="/ktor/server-static-content" summary="了解如何提供静态内容，例如样式表、脚本、图像等。">Static Content</Links> 插件，因此在
                    <Path>src/main/resources/static</Path>
                    中生成了一个
                    <Path>index.html</Path>
                    文件。
                </p>
            </step>
            <step>
                <p>
                    打开
                    <Path>index.html</Path>
                    文件并用以下内容替换现有内容：
                </p>
                [object Promise]
                <p>
                    此页面使用所有现代浏览器中可用的 <a href="https://websockets.spec.whatwg.org//#websocket">WebSocket 类型</a>。我们在 JavaScript 中创建此对象，将端点的 URL 传递给构造函数。随后，我们为 <code>onopen</code>、<code>onclose</code>
                    和 <code>onmessage</code> 事件附加事件处理程序。触发 <code>onmessage</code> 事件后，我们使用 `document` 对象的方法将一行追加到表中。
                </p>
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
                    导航到 <a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。
                    您应该会看到一个带有按钮和空表的表单：
                </p>
                <img src="tutorial_server_websockets_iteration_1.png"
                     alt="显示带有按钮的 HTML 表单的网页"
                     border-effect="rounded"
                     width="706"/>
                <p>
                    当您点击表单时，任务应从服务器加载，以每秒一个的速度显示。结果是，表格应该增量填充。您还可以通过在浏览器的
                    <control>开发人员工具</control>
                    中打开
                    <control>JavaScript 控制台</control>
                    来查看日志消息。
                </p>
                <img src="tutorial_server_websockets_iteration_1_click.gif"
                     alt="网页显示点击按钮时的列表项"
                     border-effect="rounded"
                     width="706"/>
                <p>
                    通过此操作，您可以看到服务按预期运行。WebSocket 连接已打开，项已发送到客户端，然后连接关闭。底层网络存在很多复杂性，但 Ktor 默认处理了所有这些。
                </p>
            </step>
        </procedure>
    </chapter>
</chapter>
<chapter title="理解 WebSockets" id="understanding-websockets">
    <p>
        在进入下一次迭代之前，回顾一些 WebSockets 的基础知识可能会有所帮助。
        如果您已经熟悉 WebSockets，可以继续**改进服务的设计**。
    </p>
    <p>
        在之前的教程中，您的客户端发送 HTTP 请求并接收 HTTP 响应。这工作得很好，并使互联网具有**可伸缩性**和弹性。
    </p>
    <p>但是，它不适用于以下场景：</p>
    <list>
        <li>内容随时间增量生成。</li>
        <li>内容频繁地根据事件而变化。</li>
        <li>客户端需要在内容生成时与服务器**交互**。</li>
        <li>一个客户端发送的数据需要快速传播给其他客户端。</li>
    </list>
    <p>
        这些场景的示例包括股票交易、购买电影和音乐会门票、在线拍卖竞价以及社交媒体中的聊天**功能**。WebSockets 就是为处理这些情况而开发的。
    </p>
    <p>
        WebSocket 连接通过 TCP 建立，可以持续很长时间。该连接提供“全双工通信”，这意味着客户端可以同时向服务器发送消息并接收来自服务器的消息。
    </p>
    <p>
        WebSocket API 定义了四个事件（open、message、close 和 error）和两个操作（send 和 close）。访问此**功能**的方式在不同的语言和库中可能有所不同。
        例如，在 Kotlin 中，您可以将传入消息的序列作为 [Flow](https://kotlinlang.org/docs/flow.html) 来消费。
    </p>
</chapter>
<chapter title="改进设计" id="improve-design">
    <p>接下来，您将重构现有代码，为更高级的示例腾出空间。</p>
    <procedure>
        <step>
            <p>
                在
                <Path>model</Path>
                包中，创建一个新的
                <Path>TaskRepository.kt</Path>
                文件。
            </p>
        </step>
        <step>
            <p>
                打开
                <Path>TaskRepository.kt</Path>
                并添加一个 <code>TaskRepository</code> 类型：
            </p>
            [object Promise]
            <p>您可能会回想起之前教程中的这段代码。</p>
        </step>
        <step>
            导航到
            <Path>plugins</Path>
            包并打开
            <Path>Sockets.kt</Path>
            文件。
        </step>
        <step>
            <p>
                您现在可以通过利用 <code>TaskRepository</code> 来简化 <code>Application.configureSockets()</code> 中的路由：
            </p>
            [object Promise]
        </step>
    </procedure>
</chapter>
<chapter title="通过 WebSockets 发送消息" id="send-messages">
    <p>
        为了说明 WebSockets 的强大功能，您将创建一个新的端点，其中：
    </p>
    <list>
        <li>
            当客户端启动时，它会接收所有现有任务。
        </li>
        <li>
            客户端可以创建和发送任务。
        </li>
        <li>
            当一个客户端发送任务时，其他客户端会收到通知。
        </li>
    </list>
    <procedure>
        <step>
            <p>
                在
                <Path>Sockets.kt</Path>
                文件中，用以下实现替换当前的 <code>configureSockets()</code> 方法：
            </p>
            [object Promise]
            <p>通过这段代码，您已完成以下操作：</p>
            <list>
                <li>
                    将发送所有现有任务的**功能**重构为一个辅助方法。
                </li>
                <li>
                    在 <code>routing</code> 部分，您创建了一个线程安全的 <code>session</code> 对象列表，用于跟踪所有客户端。
                </li>
                <li>
                    添加了一个新端点，相对 URL 为 <code>/task2</code>。当客户端连接到此端点时，相应的 <code>session</code> 对象会添加到列表中。然后服务器进入无限循环，等待接收新任务。收到新任务后，服务器会将其存储到版本库中，并将副本发送给所有客户端，包括当前客户端。
                </li>
            </list>
            <p>
                为了测试此**功能**，您将创建一个新页面，该页面扩展了
                <Path>index.html</Path>
                中的**功能**。
            </p>
        </step>
        <step>
            <p>
                在
                <Path>src/main/resources/static</Path>
                中创建一个名为
                <Path>wsClient.html</Path>
                的新 HTML 文件。
            </p>
        </step>
        <step>
            <p>
                打开
                <Path>wsClient.html</Path>
                并添加以下内容：
            </p>
            [object Promise]
            <p>
                此新页面引入了一个 HTML 表单，用户可以在其中输入新任务的信息。
                提交表单后，将调用 <code>sendTaskToServer</code> 事件处理程序。它会使用表单数据构建一个 JavaScript 对象，并使用 WebSocket 对象的 <code>send</code> 方法将其发送到服务器。
            </p>
        </step>
        <step>
<p>
    在 IntelliJ IDEA 中，点击重新运行按钮 (<img src="intellij_idea_rerun_icon.svg"
                                                   style="inline" height="16" width="16"
                                                   alt="intelliJ IDEA rerun icon"/>) 以重新启动应用程序。
</p>
        </step>
        <step>
            <p>要测试此**功能**，请并排打开两个浏览器并按照以下步骤操作。</p>
            <list type="decimal">
                <li>
                    在浏览器 A 中，导航到
                    <a href="http://0.0.0.0:8080/static/wsClient.html">http://0.0.0.0:8080/static/wsClient.html</a>
                    。您应该会看到默认任务。
                </li>
                <li>
                    在浏览器 A 中添加一个新任务。新任务应该出现在该页面的表格中。
                </li>
                <li>
                    在浏览器 B 中，导航到
                    <a href="http://0.0.0.0:8080/static/wsClient.html">http://0.0.0.0:8080/static/wsClient.html</a>
                    。您应该会看到默认任务，以及您在浏览器 A 中添加的任何新任务。
                </li>
                <li>
                    在任一浏览器中添加任务。您应该会看到新项出现在两个页面上。
                </li>
            </list>
            <img src="tutorial_server_websockets_iteration_2_test.gif"
                 alt="两个并排的网页，演示通过 HTML 表单创建新任务"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="添加自动化测试" id="add-automated-tests">
    <p>
        为了简化您的质量保证流程，并使其快速、可重现和免手动，您可以使用 Ktor 内置的
        <Links href="/ktor/server-testing" summary="了解如何使用特殊的测试引擎测试您的服务器应用程序。">自动化测试支持</Links>。请按照以下步骤操作：
    </p>
    <procedure>
        <step>
            <p>
                将以下依赖项添加到
                <Path>build.gradle.kts</Path>
                中，以允许您在 Ktor 客户端中配置对 <Links href="/ktor/server-serialization" summary="ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。">Content Negotiation</Links>
                的支持：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
<p>在 IntelliJ IDEA 中，点击编辑器右侧的通知 Gradle 图标
    (<img alt="intelliJ IDEA gradle icon"
          src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
    以加载 Gradle 更改。</p>
            </p>
        </step>
        <step>
            <p>
                导航到
                <Path>src/test/kotlin/com/example</Path>
                并打开
                <Path>ApplicationTest.kt</Path>
                文件。
            </p>
        </step>
        <step>
            <p>
                用以下实现替换生成的测试类：
            </p>
            [object Promise]
            <p>
                通过此设置，您：
            </p>
            <list>
                <li>
                    配置您的服务在测试环境中运行，并启用与生产环境中相同的功能，包括 Routing、JSON 序列化和 WebSockets。
                </li>
                <li>
                    在 <Links href="/ktor/client-create-and-configure" summary="了解如何创建和配置 Ktor 客户端。">Ktor 客户端</Links> 中配置**内容协商**和 WebSocket 支持。如果没有这些，客户端在使用 WebSocket 连接时将不知道如何（反）序列化 JSON 对象。
                </li>
                <li>
                    **声明**服务预期返回的 <code>Tasks</code> 列表。
                </li>
                <li>
                    使用客户端对象的 <code>websocket</code> 方法向 <code>/tasks</code> 发送请求。
                </li>
                <li>
                    将传入任务作为 <code>flow</code> 消费，并将其增量添加到列表中。
                </li>
                <li>
                    一旦所有任务都已接收，请按常规方式将 <code>expectedTasks</code> 与 <code>actualTasks</code> 进行比较。
                </li>
            </list>
        </step>
    </procedure>
</chapter>
<chapter title="后续步骤" id="next-steps">
    <p>
        做得好！通过结合 WebSocket 通信和使用 Ktor 客户端进行自动化测试，您显著增强了您的任务管理器服务。
    </p>
    <p>
        继续到
        <Links href="/ktor/server-integrate-database" summary="了解如何使用 Exposed SQL 库将 Ktor 服务连接到数据库版本库的过程。">下一个教程</Links>
        ，探索您的服务如何使用 Exposed 库与关系数据库无缝**交互**。
    </p>
</chapter>
</topic>