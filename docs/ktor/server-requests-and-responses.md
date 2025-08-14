<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="使用 Ktor 和 Kotlin 处理 HTTP 请求并生成响应" id="server-requests-and-responses">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-server-routing-and-requests"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用的插件</b>: <Links href="/ktor/server-routing" summary="路由是用于处理服务器应用程序中传入请求的核心插件。">Routing</Links>
    </p>
</tldr>
<link-summary>
    了解使用 Ktor 和 Kotlin 构建任务管理器应用程序的路由、请求处理和参数基础知识。
</link-summary>
<card-summary>
    了解如何使用 Ktor 创建任务管理器应用程序来处理路由和请求。
</card-summary>
<web-summary>
    了解使用 Kotlin 和 Ktor 创建的服务进行验证、错误处理和单元测试的基础知识。
</web-summary>
<p>
    在本教程中，你将学习使用 Ktor 和 Kotlin 构建任务管理器应用程序的路由、请求处理和参数基础知识。
</p>
<p>
    学完本教程后，你将了解如何执行以下操作：
</p>
<list type="bullet">
    <li>处理 GET 和 POST 请求。</li>
    <li>从请求中提取信息。</li>
    <li>在转换数据时处理错误。</li>
    <li>使用单元测试验证路由。</li>
</list>
<chapter title="先决条件" id="prerequisites">
    <p>
        这是 Ktor 服务器入门指南的第二个教程。你可以独立完成本教程，但我们强烈建议你完成之前的教程，以了解如何 <Links href="/ktor/server-create-a-new-project" summary="了解如何使用 Ktor 打开、运行和测试服务器应用程序。">创建、打开和运行新的 Ktor 项目</Links>。
    </p>
    <p>对 HTTP 请求类型、标头和状态码有基本的了解也非常有用。</p>
    <p>我们建议你安装 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
        IDEA</a>，但你也可以使用你选择的其他 IDE。
    </p>
</chapter>
<chapter title="任务管理器应用程序" id="sample-application">
    <p>在本教程中，你将逐步构建一个具有以下功能的任务管理器应用程序：</p>
    <list type="bullet">
        <li>将所有可用任务显示为 HTML 表格。</li>
        <li>按优先级和名称显示任务，同样以 HTML 格式。</li>
        <li>通过提交 HTML 表单添加更多任务。</li>
    </list>
    <p>
        你将尽可能地实现一些基本功能，然后通过七次迭代改进和扩展这些功能。这些最基本的功能将包括一个包含一些模型类型、一个值列表和一个单一路由的项目。
    </p>
</chapter>
<chapter title="显示静态 HTML 内容" id="display-static-html">
    <p>在第一次迭代中，你将向应用程序添加一个新路由，该路由将返回静态 HTML 内容。</p>
    <p>使用 <a href="https://start.ktor.io">Ktor 项目生成器</a>，创建一个名为
        <control>ktor-task-app</control>
        的新项目。你可以接受所有默认选项，但可能希望更改 <control>artifact</control> 名称。
    </p>
    <tip>
        有关创建新项目的更多信息，请参阅 <Links href="/ktor/server-create-a-new-project" summary="了解如何使用 Ktor 打开、运行和测试服务器应用程序。">创建、打开和运行新的 Ktor 项目</Links>。如果你最近完成了该教程，可以随意重用在那里创建的项目。
    </tip>
    <procedure>
        <step>打开 <Path>src/main/kotlin/com/example/plugins</Path> 文件夹中的
            <Path>Routing.kt</Path>
            文件。
        </step>
        <step>
            <p>将现有的 <code>Application.configureRouting()</code> 函数替换为以下实现：</p>
            [object Promise]
            <p>通过此操作，你为 URL <code>/tasks</code> 和 GET 请求类型创建了一个新路由。GET 请求是 HTTP 中最基本的
                请求类型。当用户在浏览器地址栏中键入或点击常规 HTML 链接时，会触发它。 </p>
            <p>
                目前你只是返回静态内容。要通知客户端你将发送 HTML，你需要将 HTTP Content Type 标头设置为 <code>"text/html"</code>。
            </p>
        </step>
        <step>
            <p>
                添加以下导入以访问 <code>ContentType</code> 对象：
            </p>
            [object Promise]
        </step>
        <step>
            <p>在 IntelliJ IDEA 中，点击 <Path>Application.kt</Path> 文件中 <code>main()</code>
                函数旁边的运行槽图标（<img alt="IntelliJ IDEA 运行应用程序图标"
                                                                        src="intellij_idea_gutter_icon.svg" height="16"
                                                                        width="16"/>）以启动应用程序。
            </p>
        </step>
        <step>
            <p>
                在浏览器中导航到 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。你应该会看到待办事项列表显示出来：
            </p>
            <img src="tutorial_routing_and_requests_implementation_1.png"
                 alt="显示包含两个项目的待办事项列表的浏览器窗口"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="实现任务模型" id="implement-a-task-model">
    <p>
        创建项目并设置好基本路由后，你将通过以下方式扩展应用程序：
    </p>
    <list type="decimal">
        <li><a href="#create-model-types">创建模型类型以表示任务。</a></li>
        <li><a href="#create-sample-values">声明一个包含示例值的任务列表。</a></li>
        <li><a href="#add-a-route">修改路由和请求处理器以返回此列表。</a></li>
        <li><a href="#test">使用浏览器测试新特性是否有效。</a></li>
    </list>
    <procedure title="创建模型类型" id="create-model-types">
        <step>
            <p>在
                <Path>src/main/kotlin/com/example</Path>
                内部创建一个名为
                <Path>model</Path>
                的新子包。
            </p>
        </step>
        <step>
            <p>在
                <Path>model</Path>
                目录中创建一个新的
                <Path>Task.kt</Path>
                文件。
            </p>
        </step>
        <step>
            <p>打开
                <Path>Task.kt</Path>
                文件，添加以下 <code>enum</code> 来表示优先级，并添加一个 <code>class</code> 来
                表示任务：
            </p>
            [object Promise]
        </step>
        <step>
            <p>你将通过 HTML 表格向客户端发送任务信息，因此还要添加以下扩展函数：</p>
            [object Promise]
            <p>
                函数 <code>Task.taskAsRow()</code> 使 <code>Task</code> 对象能够渲染为表格
                行，而 <code><![CDATA[List<Task>.tasksAsTable()]]></code>
                允许任务的 List 渲染为表格。
            </p>
        </step>
    </procedure>
    <procedure title="创建示例值" id="create-sample-values">
        <step>
            <p>在你的
                <Path>model</Path>
                目录中创建一个新的
                <Path>TaskRepository.kt</Path>
                文件。
            </p>
        </step>
        <step>
            <p>打开
                <Path>TaskRepository.kt</Path>
                并添加以下代码来定义一个任务 List：
            </p>
            [object Promise]
        </step>
    </procedure>
    <procedure title="添加新路由" id="add-a-route">
        <step>
            <p>打开
                <Path>Routing.kt</Path>
                文件，将现有的 <code>Application.configureRouting()</code> 函数替换为以下实现：
            </p>
            [object Promise]
            <p>
                现在你不再向客户端返回静态内容，而是提供一个任务列表。由于 List
                无法直接通过网络发送，因此必须将其转换为客户端能理解的格式。在此示例中，任务被转换为 HTML 表格。
            </p>
        </step>
        <step>
            <p>添加所需的导入：</p>
            [object Promise]
        </step>
    </procedure>
    <procedure title="测试新特性" id="test">
        <step>
            <p>在 IntelliJ IDEA 中，点击重新运行按钮（<img alt="IntelliJ IDEA 重新运行按钮图标"
                                                                     src="intellij_idea_rerun_icon.svg"
                                                                     height="16"
                                                                     width="16"/>）
                以重新启动应用程序。</p>
        </step>
        <step>
            <p>在浏览器中导航到 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。
                它应该显示一个包含任务的 HTML 表格：</p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="显示包含四行的表格的浏览器窗口"
                 border-effect="rounded"
                 width="706"/>
            <p>如果是这样，恭喜你！应用程序的基本功能正在正常运行。</p>
        </step>
    </procedure>
</chapter>
<chapter title="重构模型" id="refactor-the-model">
    <p>
        在继续扩展应用程序功能之前，
        你需要通过将值列表封装在仓库中来重构设计。这将使你能够集中管理数据，从而专注于 Ktor 特有的代码。
    </p>
    <procedure>
        <step>
            <p>
                返回到
                <Path>TaskRepository.kt</Path>
                文件，将现有的任务列表替换为以下代码：
            </p>
            [object Promise]
            <p>
                这实现了一个基于列表的非常简单的数据仓库。为了示例目的，
                添加任务的顺序将被保留，但通过抛出异常来禁止重复。</p>
            <p>在后续教程中，你将学习如何通过 <a href="https://github.com/JetBrains/Exposed">Exposed 库</a>连接关系数据库来实现仓库。
            </p>
            <p>
                目前，你将在路由中利用该仓库。
            </p>
        </step>
        <step>
            <p>
                打开
                <Path>Routing.kt</Path>
                文件，将现有的 <code>Application.configureRouting()</code> 函数替换为以下实现：
            </p>
            [object Promise]
            <p>
                当请求到达时，使用仓库来获取当前的任务列表。然后，构建一个包含这些任务的
                HTTP 响应。
            </p>
        </step>
    </procedure>
    <procedure title="测试重构后的代码">
        <step>
            <p>在 IntelliJ IDEA 中，点击重新运行按钮（<img alt="IntelliJ IDEA 重新运行按钮图标"
                                                                     src="intellij_idea_rerun_icon.svg" height="16"
                                                                     width="16"/>）
                以重新启动应用程序。</p>
        </step>
        <step>
            <p>
                在浏览器中导航到 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>
                。输出应保持不变，并显示 HTML 表格：
            </p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="显示包含四行的表格的浏览器窗口"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="使用参数" id="work-with-parameters">
    <p>
        在此次迭代中，你将允许用户按优先级查看任务。为此，你的应用程序必须
        允许对以下 URL 进行 GET 请求：
    </p>
    <list type="bullet">
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Low">/tasks/byPriority/Low</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Medium">/tasks/byPriority/Medium</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/High">/tasks/byPriority/High</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Vital">/tasks/byPriority/Vital</a></li>
    </list>
    <p>
        你要添加的路由是
        <code>/tasks/byPriority/{priority?}</code>
        ，其中 <code>{priority?}</code> 表示你需要在运行时提取的路径参数，
        问号用于表示参数是可选的。查询参数可以是你喜欢的任何名称，但 <code>priority</code> 似乎是显而易见的最佳选择。
    </p>
    <p>
        处理请求的过程可概括如下：
    </p>
    <list type="decimal">
        <li>从请求中提取名为 <code>priority</code> 的路径参数。</li>
        <li>如果此参数缺失，则返回 <code>400</code> 状态码（Bad Request）。</li>
        <li>将参数的文本值转换为 <code>Priority</code> 枚举值。</li>
        <li>如果转换失败，则返回状态码为 <code>400</code> 的响应。</li>
        <li>使用仓库查找所有具有指定优先级的任务。</li>
        <li>如果没有匹配的任务，则返回 <code>404</code> 状态码（Not Found）。</li>
        <li>返回匹配的任务，格式化为 HTML 表格。</li>
    </list>
    <p>
        你将首先实现此功能，然后找到检查其是否正常工作的最佳方法。
    </p>
    <procedure title="添加新路由">
        <p>打开
            <Path>Routing.kt</Path>
            文件，并按如下所示将以下路由添加到你的代码中：
        </p>
        [object Promise]
        <p>
            如上所述，你已经为 URL
            <code>/tasks/byPriority/{priority?}</code>
            编写了一个处理器。符号
            <code>priority</code>
            表示用户添加的路径参数。不幸的是，在服务器上无法保证这是对应 Kotlin 枚举中的四个值之一，
            因此必须手动检测。
        </p>
        <p>
            如果路径参数缺失，服务器会向客户端返回 <code>400</code> 状态码。
            否则，它会提取
            参数的值并尝试将其转换为枚举成员。如果此操作失败，则会抛出异常，服务器会捕获该异常并返回 <code>400</code> 状态码。
        </p>
        <p>
            假设转换成功，则使用仓库查找匹配的 <code>Tasks</code>。如果
            没有
            指定优先级的任务，服务器会返回 <code>404</code> 状态码，否则它会
            以 HTML 表格的形式将匹配项发送回去。
        </p>
    </procedure>
    <procedure title="测试新路由">
        <p>
            你可以通过请求不同的 URL 在浏览器中测试此功能。
        </p>
        <step>
            <p>在 IntelliJ IDEA 中，点击重新运行按钮（<img alt="IntelliJ IDEA 重新运行按钮图标"
                                                                     src="intellij_idea_rerun_icon.svg"
                                                                     height="16"
                                                                     width="16"/>）
                以重新启动应用程序。</p>
        </step>
        <step>
            <p>
                要检索所有中等优先级的任务，请导航到 <a
                        href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>：
            </p>
            <img src="tutorial_routing_and_requests_implementation_4.png"
                 alt="显示包含中等优先级任务表格的浏览器窗口"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                不幸的是，在错误情况下，通过浏览器进行的测试是有限的。
                浏览器不会显示不成功响应的详细信息，除非你使用开发者扩展。
                一个更简单的替代方案是使用专业工具，例如 <a
                        href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>。
            </p>
        </step>
        <step>
            <p>
                在 Postman 中，发送对相同 URL
                <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>
                的 GET 请求。
            </p>
            <img src="tutorial_routing_and_requests_postman.png"
                 alt="Postman 中显示响应详细信息的 GET 请求"
                 border-effect="rounded"
                 width="706"/>
            <p>
                这显示了服务器的原始输出，以及请求和响应的所有详细信息。
            </p>
        </step>
        <step>
            <p>
                要检查请求重要任务时是否返回 <code>404</code> 状态码，请向 <code>http://0.0.0.0:8080/tasks/byPriority/Vital</code> 发送新的 GET
                请求。然后，你将在 <control>响应</control> 面板的右上角看到状态码。
            </p>
            <img src="tutorial_routing_and_requests_postman_vital.png"
                 alt="Postman 中显示状态码的 GET 请求"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                要验证指定无效优先级时是否返回 <code>400</code>，请创建另一个具有无效属性的 GET 请求：
            </p>
            <img src="tutorial_routing_and_requests_postman_bad_request.png"
                 alt="Postman 中状态码为 Bad Request 的 GET 请求"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="添加单元测试" id="add-unit-tests">
    <p>
        目前，你已添加了两个路由——一个用于检索所有任务，另一个用于按优先级检索任务。
        Postman 等工具使你能够充分测试这些路由，但它们需要手动检查，并且在 Ktor 外部运行。
    </p>
    <p>
        这在原型设计和小型应用程序中是可以接受的。然而，这种方法无法扩展到
        大型应用程序，大型应用程序可能需要频繁运行数千个测试。一个更好的解决方案是
        完全自动化你的测试。
    </p>
    <p>
        Ktor 提供了自己的 <Links href="/ktor/server-testing" summary="了解如何使用专用测试引擎测试服务器应用程序。">测试框架</Links> 来支持路由的自动化验证。
        接下来，你将为应用程序的现有功能编写一些测试。
    </p>
    <procedure>
        <step>
            <p>
                在
                <Path>src</Path>
                中创建一个名为
                <Path>test</Path>
                的新目录，并创建一个名为
                <Path>kotlin</Path>
                的子目录。
            </p>
        </step>
        <step>
            <p>
                在
                <Path>src/test/kotlin</Path>
                内部创建一个新的
                <Path>ApplicationTest.kt</Path>
                文件。
            </p>
        </step>
        <step>
            <p>打开
                <Path>ApplicationTest.kt</Path>
                文件并添加以下代码：
            </p>
            [object Promise]
            <p>
                在这些测试中的每一个中，都会创建一个新的 Ktor 实例。它在测试环境中运行，
                而不是
                像 Netty 这样的 Web 服务器。项目生成器为你编写的模块被加载，该模块反过来会
                调用路由函数。然后你可以使用内置的 <code>client</code> 对象向应用程序发送
                请求，并验证返回的响应。
            </p>
            <p>
                测试可以在 IDE 中运行，也可以作为 CI/CD 流水线的一部分运行。
            </p>
        </step>
        <step>
            <p>要在 IntelliJ IDE 中运行测试，请点击每个测试函数旁边的槽图标（<img
                    alt="IntelliJ IDEA 槽图标"
                    src="intellij_idea_gutter_icon.svg"
                    width="16" height="26"/>）。</p>
            <tip>
                有关如何在 IntelliJ IDE 中运行单元测试的更多详细信息，请参阅 <a
                    href="https://www.jetbrains.com/help/idea/performing-tests.html">IntelliJ IDEA 文档</a>。
            </tip>
        </step>
    </procedure>
</chapter>
<chapter title="处理 POST 请求" id="handle-post-requests">
    <p>
        你可以按照上述过程为 GET 请求创建任意数量的附加路由。这些
        路由将允许用户使用我们喜欢的任何搜索条件来获取任务。但用户也希望能够
        创建新任务。
    </p>
    <p>
        在这种情况下，适当的 HTTP 请求类型是 POST。POST 请求通常在用户完成并提交 HTML 表单时触发。
    </p>
    <p>
        与 GET 请求不同，POST 请求有一个 <code>body</code>（正文），其中包含表单中所有
        输入的名称和值。这些信息经过编码，用于分离来自不同输入的数据并转义非法字符。你无需担心此过程的详细信息，因为浏览器
        和 Ktor 将为我们处理它。
    </p>
    <p>
        接下来，你将通过以下步骤扩展现有应用程序以允许创建新任务：
    </p>
    <list type="decimal">
        <li><a href="#create-static-content">创建包含 HTML 表单的静态内容文件夹</a>。</li>
        <li><a href="#register-folder">让 Ktor 识别此文件夹，以便可以提供其内容</a>。</li>
        <li><a href="#add-form-handler">添加新的请求处理器以处理表单提交</a>。</li>
        <li><a href="#test-functionality">测试完成的功能</a>。</li>
    </list>
    <procedure title="创建静态内容" id="create-static-content">
        <step>
            <p>
                在
                <Path>src/main/resources</Path>
                内部创建一个名为
                <Path>task-ui</Path>
                的新目录。
                这将是你的静态内容文件夹。
            </p>
        </step>
        <step>
            <p>
                在
                <Path>task-ui</Path>
                文件夹中，创建一个新的
                <Path>task-form.html</Path>
                文件。
            </p>
        </step>
        <step>
            <p>打开新创建的
                <Path>task-form.html</Path>
                文件并向其中添加以下内容：
            </p>
            [object Promise]
        </step>
    </procedure>
    <procedure title="向 Ktor 注册文件夹" id="register-folder">
        <step>
            <p>
                导航到
                <Path>src/main/kotlin/com/example/plugins</Path>
                文件夹中的
                <Path>Routing.kt</Path>
                文件。
            </p>
        </step>
        <step>
            <p>
                将以下对 <code>staticResources()</code> 的调用添加到 <code>Application.configureRouting()</code>
                函数中：
            </p>
            [object Promise]
            <p>这需要以下导入：</p>
            [object Promise]
        </step>
        <step>
            <p>重启应用程序。 </p>
        </step>
        <step>
            <p>
                在浏览器中导航到 <a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>
                。HTML 表单应该会显示出来：
            </p>
            <img src="tutorial_routing_and_requests_implementation_6.png"
                 alt="显示 HTML 表单的浏览器窗口"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
    <procedure title="添加表单处理器" id="add-form-handler">
        <p>
            在
            <Path>Routing.kt</Path>
            中，将以下附加路由添加到 <code>configureRouting()</code> 函数中：
        </p>
        [object Promise]
        <p>
            如你所见，新路由映射到 POST 请求而不是 GET 请求。Ktor
            通过调用 <code>receiveParameters()</code> 处理请求正文。这会返回
            请求正文中存在的参数的集合。
        </p>
        <p>
            有三个参数，因此你可以将相关值存储在 <a
                href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-triple/">三元组</a> 中。如果参数
            不存在，则存储一个空字符串。
        </p>
        <p>
            如果任何值为空，服务器将返回状态码
            为 <code>400</code> 的响应。然后，它将尝试将第三个参数转换为 <code>Priority</code>
            ，如果成功，则将
            信息作为新的 <code>Task</code> 添加到仓库中。这两个操作都可能导致
            异常，在这种情况下，再次返回状态码 <code>400</code>。
        </p>
        <p>
            否则，如果一切成功，服务器将向客户端返回 <code>204</code> 状态码（
            无内容）。这
            表示其请求已成功，但没有新的信息可以作为
            结果发送给他们。
        </p>
    </procedure>
    <procedure title="测试完成的功能" id="test-functionality">
        <step>
            <p>
                重启应用程序。
            </p>
        </step>
        <step>
            <p>在浏览器中导航到 <a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>
                。
            </p>
        </step>
        <step>
            <p>
                用示例数据填充表单并点击
                <control>Submit</control>
                。
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_1.png"
                 alt="显示带有示例数据的 HTML 表单的浏览器窗口"
                 border-effect="rounded"
                 width="706"/>
            <p>当你提交表单后，你不应被重定向到新页面。</p>
        </step>
        <step>
            <p>
                导航到 URL <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。你应该
                会看到新任务已添加。
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_2.png"
                 alt="显示包含任务的 HTML 表格的浏览器窗口"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                要验证功能，请将以下测试添加到 <Path>ApplicationTest.kt</Path> 中：
            </p>
            [object Promise]
            <p>
                在此测试中，向服务器发送两个请求：一个 POST 请求用于创建新任务，一个 GET
                请求用于确认新任务已添加。在发出第一个请求时，使用
                <code>setBody()</code> 方法将内容插入到请求的正文中。测试
                框架提供了集合上的 <code>formUrlEncode()</code>
                扩展方法，该方法抽象了像浏览器一样格式化数据的过程。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="重构路由" id="refactor-the-routing">
    <p>
        如果你检查到目前为止的路由，你会发现所有路由都以 <code>/tasks</code> 开头。你可以
        通过将它们放入自己的子路由来消除这种重复：
    </p>
    [object Promise]
    <p>
        如果你的应用程序达到了拥有多个子路由的阶段，那么将每个子路由放入自己的辅助函数中是合适的。然而，目前这不是必需的。
    </p>
    <p>
        路由组织得越好，就越容易扩展。例如，你可以添加一个按名称查找任务的路由：
    </p>
    [object Promise]
</chapter>
<chapter title="后续步骤" id="next-steps">
    <p>
        你现在已经实现了基本的路由和请求处理功能。此外，你还了解了
        验证、错误处理和单元测试。所有这些主题都将在后续教程中进行扩展。
    </p>
    <p>
        继续学习 <Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。">下一教程</Links>，了解如何为你的任务管理器创建生成 JSON 文件的 RESTful API。
    </p>
</chapter>
</topic>