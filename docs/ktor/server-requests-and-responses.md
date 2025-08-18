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
        <b>使用的插件</b>: <Links href="/ktor/server-routing" summary="Routing 是一个核心插件，用于处理服务器应用程序中的传入请求。">Routing</Links>
    </p>
</tldr>
<link-summary>
    通过构建任务管理器应用程序，学习如何使用 Ktor 在 Kotlin 中进行路由、处理请求和参数的基础知识。
</link-summary>
<card-summary>
    通过创建任务管理器应用程序，学习 Ktor 中路由和请求的工作原理。
</card-summary>
<web-summary>
    学习使用 Kotlin 和 Ktor 创建的服务进行验证、错误处理和单元测试的基础知识。
</web-summary>
<p>
    在本教程中，你将通过构建任务管理器应用程序，学习如何使用 Ktor 在 Kotlin 中进行路由、处理请求和参数的基础知识。
</p>
<p>
    完成本教程后，你将了解如何执行以下操作：
</p>
<list type="bullet">
    <li>处理 GET 和 POST 请求。</li>
    <li>从请求中提取信息。</li>
    <li>转换数据时处理错误。</li>
    <li>使用单元测试来验证路由。</li>
</list>
<chapter title="先决条件" id="prerequisites">
    <p>
        这是 Ktor 服务器入门指南的第二个教程。你可以独立完成本教程，但我们强烈建议你先完成前一个教程，学习如何<Links href="/ktor/server-create-a-new-project" summary="学习如何使用 Ktor 打开、运行和测试服务器应用程序。">创建、打开和运行新的 Ktor 项目</Links>。
    </p>
    <p>了解 HTTP 请求类型、标头和状态码的基本知识也很有用。</p>
    <p>我们推荐安装 <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ IDEA</a>，但你也可以使用其他你选择的 IDE。
    </p>
</chapter>
<chapter title="任务管理器应用程序" id="sample-application">
    <p>在本教程中，你将逐步构建一个具有以下功能的任务管理器应用程序：</p>
    <list type="bullet">
        <li>以 HTML 表格形式查看所有可用的任务。</li>
        <li>再次以 HTML 形式，按优先级和名称查看任务。</li>
        <li>通过提交 HTML 表单添加其他任务。</li>
    </list>
    <p>
        你将尽可能地实现一些基本功能，然后通过七次迭代改进和扩展此功能。这项基本功能将由一个包含某些模型类型、值列表和一个路由的项目组成。
    </p>
</chapter>
<chapter title="显示静态 HTML 内容" id="display-static-html">
    <p>在第一次迭代中，你将为应用程序添加一个新路由，它将返回静态 HTML 内容。</p>
    <p>使用 <a href="https://start.ktor.io">Ktor 项目生成器</a>，创建一个名为
        <control>ktor-task-app</control>
        的新项目。你可以接受所有默认选项，但可能希望更改
        <control>artifact</control>
        名称。
    </p>
    <tip>
        关于创建新项目的更多信息，请参见<Links href="/ktor/server-create-a-new-project" summary="学习如何使用 Ktor 打开、运行和测试服务器应用程序。">创建、打开和运行新的 Ktor 项目</Links>。如果你最近完成了该教程，可以随意重用在那里创建的项目。
    </tip>
    <procedure>
        <step>打开
            <Path>Routing.kt</Path>
            文件，该文件位于
            <Path>src/main/kotlin/com/example/plugins</Path>
            文件夹中。
        </step>
        <step>
            <p>将现有的 <code>Application.configureRouting()</code> 函数替换为以下实现：</p>
            <code-block lang="kotlin" code="                        fun Application.configureRouting() {&#10;                            routing {&#10;                                get(&quot;/tasks&quot;) {&#10;                                    call.respondText(&#10;                                        contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                            text = &quot;&quot;&quot;&#10;                                        &lt;h3&gt;TODO:&lt;/h3&gt;&#10;                                        &lt;ol&gt;&#10;                                            &lt;li&gt;A table of all the tasks&lt;/li&gt;&#10;                                            &lt;li&gt;A form to submit new tasks&lt;/li&gt;&#10;                                        &lt;/ol&gt;&#10;                                        &quot;&quot;&quot;.trimIndent()&#10;                                    )&#10;                                }&#10;                            }&#10;                        }"/>
            <p>这样，你已为 URL <code>/tasks</code> 和 GET 请求类型创建了一个新路由。GET 请求是 HTTP 中最基本的请求类型。当用户在浏览器的地址栏中键入或点击常规 HTML 链接时会触发它。</p>
            <p>
                目前你只返回静态内容。要通知客户端你将发送 HTML，你需要将 HTTP Content Type 标头设置为 <code>"text/html"</code>。
            </p>
        </step>
        <step>
            <p>
                添加以下导入以访问 <code>ContentType</code> 对象：
            </p>
            <code-block lang="kotlin" code="                    import io.ktor.http.ContentType"/>
        </step>
        <step>
            <p>在 IntelliJ IDEA 中，点击
                <Path>Application.kt</Path>
                中 <code>main()</code>
                函数旁边的运行边槽图标 (<img alt="intelliJ IDEA run application icon"
                                                src="intellij_idea_gutter_icon.svg" height="16"
                                                width="16"/>)，以启动应用程序。
            </p>
        </step>
        <step>
            <p>
                在浏览器中导航至 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。你应该会看到待办列表显示：
            </p>
            <img src="tutorial_routing_and_requests_implementation_1.png"
                 alt="A browser window displaying a to-do list with two items"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="实现任务模型" id="implement-a-task-model">
    <p>
        现在你已经创建了项目并设置了基本路由，接下来你将通过以下操作扩展你的应用程序：
    </p>
    <list type="decimal">
        <li><a href="#create-model-types">创建模型类型来表示任务。</a></li>
        <li><a href="#create-sample-values">声明包含示例值的任务列表。</a></li>
        <li><a href="#add-a-route">修改路由和请求处理程序以返回此列表。</a></li>
        <li><a href="#test">使用浏览器测试新特性是否正常工作。</a></li>
    </list>
    <procedure title="创建模型类型" id="create-model-types">
        <step>
            <p>在
                <Path>src/main/kotlin/com/example</Path>
                内部，创建一个名为
                <Path>model</Path>
                的新子包。
            </p>
        </step>
        <step>
            <p>在
                <Path>model</Path>
                目录中，创建一个新文件
                <Path>Task.kt</Path>
                。
            </p>
        </step>
        <step>
            <p>打开
                <Path>Task.kt</Path>
                文件，添加以下 <code>enum</code> 来表示优先级，并添加一个 <code>class</code> 来表示任务：
            </p>
            <code-block lang="kotlin" code="                    enum class Priority {&#10;                        Low, Medium, High, Vital&#10;                    }&#10;                    data class Task(&#10;                        val name: String,&#10;                        val description: String,&#10;                        val priority: Priority&#10;                    )"/>
        </step>
        <step>
            <p>你将把任务信息发送到客户端的 HTML 表格中，因此也请添加以下扩展函数：</p>
            <code-block lang="kotlin" code="                    fun Task.taskAsRow() = &quot;&quot;&quot;&#10;                        &lt;tr&gt;&#10;                            &lt;td&gt;$name&lt;/td&gt;&lt;td&gt;$description&lt;/td&gt;&lt;td&gt;$priority&lt;/td&gt;&#10;                        &lt;/tr&gt;&#10;                        &quot;&quot;&quot;.trimIndent()&#10;&#10;                    fun List&lt;Task&gt;.tasksAsTable() = this.joinToString(&#10;                        prefix = &quot;&lt;table rules=\&quot;all\&quot;&gt;&quot;,&#10;                        postfix = &quot;&lt;/table&gt;&quot;,&#10;                        separator = &quot;
&quot;,&#10;                        transform = Task::taskAsRow&#10;                    )"/>
            <p>
                <code>Task.taskAsRow()</code> 函数使 <code>Task</code> 对象能够渲染为表格行，而 <code>List&lt;Task&gt;.tasksAsTable()</code>
                允许将任务列表渲染为表格。
            </p>
        </step>
    </procedure>
    <procedure title="创建示例值" id="create-sample-values">
        <step>
            <p>在你的
                <Path>model</Path>
                目录中，创建一个新文件
                <Path>TaskRepository.kt</Path>
                。
            </p>
        </step>
        <step>
            <p>打开
                <Path>TaskRepository.kt</Path>
                并添加以下代码来定义一个任务列表：
            </p>
            <code-block lang="kotlin" code="                    val tasks = mutableListOf(&#10;                        Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;                        Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;                        Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;                        Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;                    )"/>
        </step>
    </procedure>
    <procedure title="添加新路由" id="add-a-route">
        <step>
            <p>打开
                <Path>Routing.kt</Path>
                文件，并将现有 <code>Application.configureRouting()</code> 函数替换为以下实现：
            </p>
            <code-block lang="kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            get(&quot;/tasks&quot;) {&#10;                                call.respondText(&#10;                                    contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                    text = tasks.tasksAsTable()&#10;                                )&#10;                            }&#10;                        }&#10;                    }"/>
            <p>
                现在你不再向客户端返回静态内容，而是提供任务列表。由于列表无法直接通过网络发送，因此必须将其转换为客户端能理解的格式。在此例中，任务被转换为 HTML 表格。
            </p>
        </step>
        <step>
            <p>添加所需的导入：</p>
            <code-block lang="kotlin" code="                    import model.*"/>
        </step>
    </procedure>
    <procedure title="测试新特性" id="test">
        <step>
            <p>在 IntelliJ IDEA 中，点击重新运行按钮 (<img alt="intelliJ IDEA rerun button icon"
                                                       src="intellij_idea_rerun_icon.svg"
                                                       height="16"
                                                       width="16"/>)
                以重新启动应用程序。</p>
        </step>
        <step>
            <p>在浏览器中导航至 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。它应该显示一个包含任务的 HTML 表格：</p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="A browser window displaying a table with four rows"
                 border-effect="rounded"
                 width="706"/>
            <p>如果是这样，恭喜你！应用程序的基本功能已正常工作。</p>
        </step>
    </procedure>
</chapter>
<chapter title="重构模型" id="refactor-the-model">
    <p>
        在继续扩展应用程序的功能之前，你需要通过将值列表封装在版本库中来重构设计。这将使你能够集中管理数据，从而专注于 Ktor 特有的代码。
    </p>
    <procedure>
        <step>
            <p>
                返回 <Path>TaskRepository.kt</Path> 文件，并将现有任务列表替换为以下代码：
            </p>
            <code-block lang="kotlin" code="package model&#10;&#10;object TaskRepository {&#10;    private val tasks = mutableListOf(&#10;        Task(&quot;cleaning&quot;, &quot;Clean the house&quot;, Priority.Low),&#10;        Task(&quot;gardening&quot;, &quot;Mow the lawn&quot;, Priority.Medium),&#10;        Task(&quot;shopping&quot;, &quot;Buy the groceries&quot;, Priority.High),&#10;        Task(&quot;painting&quot;, &quot;Paint the fence&quot;, Priority.Medium)&#10;    )&#10;&#10;    fun allTasks(): List&lt;Task&gt; = tasks&#10;&#10;    fun tasksByPriority(priority: Priority) = tasks.filter {&#10;        it.priority == priority&#10;    }&#10;&#10;    fun taskByName(name: String) = tasks.find {&#10;        it.name.equals(name, ignoreCase = true)&#10;    }&#10;&#10;    fun addTask(task: Task) {&#10;        if(taskByName(task.name) != null) {&#10;            throw IllegalStateException(&quot;Cannot duplicate task names!&quot;)&#10;        }&#10;        tasks.add(task)&#10;    }&#10;}"/>
            <p>
                这实现了一个非常简单的基于列表的任务数据存储。为了示例目的，任务的添加顺序将被保留，但通过抛出异常来禁止重复项。</p>
            <p>在后续教程中，你将学习如何通过 <a href="https://github.com/JetBrains/Exposed">Exposed 库</a>实现连接到关系型数据库的版本库。
            </p>
            <p>
                目前，你将在路由中使用此版本库。
            </p>
        </step>
        <step>
            <p>
                打开
                <Path>Routing.kt</Path>
                文件，并将现有 <code>Application.configureRouting()</code> 函数替换为以下实现：
            </p>
            <code-block lang="Kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            get(&quot;/tasks&quot;) {&#10;                                val tasks = TaskRepository.allTasks()&#10;                                call.respondText(&#10;                                    contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                    text = tasks.tasksAsTable()&#10;                                )&#10;                            }&#10;                        }&#10;                    }"/>
            <p>
                当请求到来时，版本库用于获取当前的任务列表。然后，构建包含这些任务的 HTTP 响应。
            </p>
        </step>
    </procedure>
    <procedure title="测试重构后的代码">
        <step>
            <p>在 IntelliJ IDEA 中，点击重新运行按钮 (<img alt="intelliJ IDEA rerun button icon"
                                                       src="intellij_idea_rerun_icon.svg" height="16"
                                                       width="16"/>)
                以重新启动应用程序。</p>
        </step>
        <step>
            <p>
                在浏览器中导航至 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。输出应保持不变，显示 HTML 表格：
            </p>
            <img src="tutorial_routing_and_requests_implementation_2.png"
                 alt="A browser window displaying a table with four rows"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="处理参数" id="work-with-parameters">
    <p>
        在此次迭代中，你将允许用户按优先级查看任务。为此，你的应用程序必须允许对以下 URL 发送 GET 请求：
    </p>
    <list type="bullet">
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Low">/tasks/byPriority/Low</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Medium">/tasks/byPriority/Medium</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/High">/tasks/byPriority/High</a></li>
        <li><a href="http://0.0.0.0:8080/tasks/byPriority/Vital">/tasks/byPriority/Vital</a></li>
    </list>
    <p>
        你将添加的路由是
        <code>/tasks/byPriority/{priority?}</code>
        ，其中 <code>{priority?}</code> 表示你需要在运行时提取的路径参数，问号用于表示参数是可选的。查询参数可以是你喜欢的任何名称，但 <code>priority</code> 似乎是显而易见的选择。
    </p>
    <p>
        处理请求的过程可总结如下：
    </p>
    <list type="decimal">
        <li>从请求中提取一个名为 <code>priority</code> 的路径参数。</li>
        <li>如果此参数缺失，则返回 <code>400</code> 状态（Bad Request）。</li>
        <li>将参数的文本值转换为 <code>Priority</code> 枚举值。</li>
        <li>如果失败，则返回状态码为 <code>400</code> 的响应。</li>
        <li>使用版本库查找所有具有指定优先级的任务。</li>
        <li>如果没有匹配的任务，则返回 <code>404</code> 状态（Not Found）。</li>
        <li>返回匹配的任务，格式化为 HTML 表格。</li>
    </list>
    <p>
        你将首先实现此功能，然后找到检测其是否正常工作的最佳方式。
    </p>
    <procedure title="添加新路由">
        <p>打开
            <Path>Routing.kt</Path>
            文件，并将以下路由添加到你的代码中，如下所示：
        </p>
        <code-block lang="kotlin" code="                routing {&#10;                    get(&quot;/tasks&quot;) { ... }&#10;&#10;                    //add the following route&#10;                    get(&quot;/tasks/byPriority/{priority?}&quot;) {&#10;                        val priorityAsText = call.parameters[&quot;priority&quot;]&#10;                        if (priorityAsText == null) {&#10;                            call.respond(HttpStatusCode.BadRequest)&#10;                            return@get&#10;                        }&#10;&#10;                        try {&#10;                            val priority = Priority.valueOf(priorityAsText)&#10;                            val tasks = TaskRepository.tasksByPriority(priority)&#10;&#10;                            if (tasks.isEmpty()) {&#10;                                call.respond(HttpStatusCode.NotFound)&#10;                                return@get&#10;                            }&#10;&#10;                            call.respondText(&#10;                                contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                text = tasks.tasksAsTable()&#10;                            )&#10;                        } catch(ex: IllegalArgumentException) {&#10;                            call.respond(HttpStatusCode.BadRequest)&#10;                        }&#10;                    }&#10;                }"/>
        <p>
            如上所述，你已为 URL
            <code>/tasks/byPriority/{priority?}</code>
            编写了一个处理程序。符号
            <code>priority</code>
            代表用户添加的路径参数。不幸的是，在服务器上无法保证这对应于 Kotlin 枚举中的四个值之一，因此必须手动检测。
        </p>
        <p>
            如果路径参数缺失，服务器将向客户端返回 <code>400</code> 状态码。否则，它会提取参数的值并尝试将其转换为枚举的成员。如果此操作失败，则会抛出异常，服务器会捕获该异常并返回 <code>400</code> 状态码。
        </p>
        <p>
            假设转换成功，版本库将用于查找匹配的 <code>Tasks</code>。如果没有指定优先级的任务，服务器会返回 <code>404</code> 状态码，否则会以 HTML 表格的形式发送匹配项。
        </p>
    </procedure>
    <procedure title="测试新路由">
        <p>
            你可以通过在浏览器中请求不同的 URL 来测试此功能。
        </p>
        <step>
            <p>在 IntelliJ IDEA 中，点击重新运行按钮 (<img alt="intelliJ IDEA rerun button icon"
                                                       src="intellij_idea_rerun_icon.svg"
                                                       height="16"
                                                       width="16"/>)
                以重新启动应用程序。</p>
        </step>
        <step>
            <p>
                要检索所有中等优先级任务，请导航至 <a
                    href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>：
            </p>
            <img src="tutorial_routing_and_requests_implementation_4.png"
                 alt="A browser window displaying a table with Medium priority tasks"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                不幸的是，在出现错误的情况下，你通过浏览器进行的测试是有限的。除非你使用开发者扩展，否则浏览器不会显示不成功响应的详细信息。一个更简单的替代方案是使用专业工具，例如 <a
                    href="https://learning.postman.com/docs/sending-requests/requests/">Postman</a>。
            </p>
        </step>
        <step>
            <p>
                在 Postman 中，发送针对相同 URL
                <code>http://0.0.0.0:8080/tasks/byPriority/Medium</code>
                的 GET 请求。
            </p>
            <img src="tutorial_routing_and_requests_postman.png"
                 alt="A GET request in Postman showing the response details"
                 border-effect="rounded"
                 width="706"/>
            <p>
                这显示了服务器的原始输出，以及请求和响应的所有详细信息。
            </p>
        </step>
        <step>
            <p>
                要检测对紧急任务的请求是否返回 <code>404</code> 状态码，请向
                <code>http://0.0.0.0:8080/tasks/byPriority/Vital</code>
                发送新的 GET 请求。然后你将在
                <control>Response</control>
                面板的右上角看到显示的状态码。
            </p>
            <img src="tutorial_routing_and_requests_postman_vital.png"
                 alt="A GET request in Postman showing the status code"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                要验证当指定无效优先级时是否返回 <code>400</code>，请创建另一个包含无效属性的 GET 请求：
            </p>
            <img src="tutorial_routing_and_requests_postman_bad_request.png"
                 alt="A GET request in Postman with a Bad Request status code"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="添加单元测试" id="add-unit-tests">
    <p>
        到目前为止，你已经添加了两个路由——一个用于检索所有任务，另一个用于按优先级检索任务。像 Postman 这样的工具使你能够完全测试这些路由，但它们需要手动探查并在 Ktor 外部运行。
    </p>
    <p>
        这在原型设计和小型应用程序中是可以接受的。然而，这种方法不适用于大型应用程序，其中可能需要频繁运行数千个测试。一个更好的解决方案是完全自动化你的测试。
    </p>
    <p>
        Ktor 提供其自己的<Links href="/ktor/server-testing" summary="学习如何使用特殊的测试引擎测试你的服务器应用程序。">测试框架</Links>来支持路由的自动化验证。接下来，你将为你应用程序的现有功能编写一些测试。
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
                内部，创建一个新文件
                <Path>ApplicationTest.kt</Path>
                。
            </p>
        </step>
        <step>
            <p>打开
                <Path>ApplicationTest.kt</Path>
                文件并添加以下代码：
            </p>
            <code-block lang="kotlin" code="                    package com.example&#10;&#10;                    import io.ktor.client.request.*&#10;                    import io.ktor.client.statement.*&#10;                    import io.ktor.http.*&#10;                    import io.ktor.server.testing.*&#10;                    import org.junit.Test&#10;                    import kotlin.test.assertContains&#10;                    import kotlin.test.assertEquals&#10;&#10;&#10;                    class ApplicationTest {&#10;                        @Test&#10;                        fun tasksCanBeFoundByPriority() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Medium&quot;)&#10;                            val body = response.bodyAsText()&#10;&#10;                            assertEquals(HttpStatusCode.OK, response.status)&#10;                            assertContains(body, &quot;Mow the lawn&quot;)&#10;                            assertContains(body, &quot;Paint the fence&quot;)&#10;                        }&#10;&#10;                        @Test&#10;                        fun invalidPriorityProduces400() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Invalid&quot;)&#10;                            assertEquals(HttpStatusCode.BadRequest, response.status)&#10;                        }&#10;&#10;                        @Test&#10;                        fun unusedPriorityProduces404() = testApplication {&#10;                            application {&#10;                                module()&#10;                            }&#10;&#10;                            val response = client.get(&quot;/tasks/byPriority/Vital&quot;)&#10;                            assertEquals(HttpStatusCode.NotFound, response.status)&#10;                        }&#10;                    }"/>
            <p>
                在每个测试中都创建了一个新的 Ktor 实例。这在测试环境中运行，而不是像 Netty 这样的 Web 服务器中运行。项目生成器为你编写的模块会被加载，这反过来会调用路由函数。然后，你可以使用内置的 <code>client</code> 对象向应用程序发送请求，并验证返回的响应。
            </p>
            <p>
                测试可以在 IDE 内部运行，也可以作为 CI/CD 流水线的一部分运行。
            </p>
        </step>
        <step>
            <p>要在 IntelliJ IDE 中运行测试，请点击每个测试函数旁边的边槽图标 (<img
                    alt="intelliJ IDEA gutter icon"
                    src="intellij_idea_gutter_icon.svg"
                    width="16" height="26"/>)。</p>
            <tip>
                有关如何在 IntelliJ IDE 中运行单元测试的更多详细信息，请参见<a
                    href="https://www.jetbrains.com/help/idea/performing-tests.html">IntelliJ IDEA 文档</a>。
            </tip>
        </step>
    </procedure>
</chapter>
<chapter title="处理 POST 请求" id="handle-post-requests">
    <p>
        你可以按照上述过程创建任意数量的 GET 请求附加路由。这些将允许用户使用我们喜欢的任何搜索条件来获取任务。但用户也希望能够创建新任务。
    </p>
    <p>
        在这种情况下，合适的 HTTP 请求类型是 POST。POST 请求通常在用户完成并提交 HTML 表单时触发。
    </p>
    <p>
        与 GET 请求不同，POST 请求具有一个 <code>body</code>，其中包含表单中所有输入的名称和值。此信息经过编码，以分离不同输入的数据并转义非法字符。你无需担心此过程的详细信息，因为浏览器和 Ktor 将为我们管理它。
    </p>
    <p>
        接下来，你将通过以下步骤扩展现有应用程序以允许创建新任务：
    </p>
    <list type="decimal">
        <li><a href="#create-static-content">创建一个包含 HTML 表单的静态内容文件夹。</a></li>
        <li><a href="#register-folder">让 Ktor 知道此文件夹，以便可以提供其内容。</a></li>
        <li><a href="#add-form-handler">添加新的请求处理程序来处理表单提交。</a></li>
        <li><a href="#test-functionality">测试已完成的功能。</a></li>
    </list>
    <procedure title="创建静态内容" id="create-static-content">
        <step>
            <p>
                在
                <Path>src/main/resources</Path>
                内部，创建一个名为
                <Path>task-ui</Path>
                的新目录。
                这将是你静态内容的文件夹。
            </p>
        </step>
        <step>
            <p>
                在
                <Path>task-ui</Path>
                文件夹中，创建一个新文件
                <Path>task-form.html</Path>
                。
            </p>
        </step>
        <step>
            <p>打开新创建的
                <Path>task-form.html</Path>
                文件并向其中添加以下内容：
            </p>
            <code-block lang="html" code="&lt;!DOCTYPE html&gt;&#10;&lt;html lang=&quot;en&quot;&gt;&#10;&lt;head&gt;&#10;    &lt;meta charset=&quot;UTF-8&quot;&gt;&#10;    &lt;title&gt;Adding a new task&lt;/title&gt;&#10;&lt;/head&gt;&#10;&lt;body&gt;&#10;&lt;h1&gt;Adding a new task&lt;/h1&gt;&#10;&lt;form method=&quot;post&quot; action=&quot;/tasks&quot;&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;name&quot;&gt;Name: &lt;/label&gt;&#10;        &lt;input type=&quot;text&quot; id=&quot;name&quot; name=&quot;name&quot; size=&quot;10&quot;&gt;&#10;    &lt;/div&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;description&quot;&gt;Description: &lt;/label&gt;&#10;        &lt;input type=&quot;text&quot; id=&quot;description&quot; name=&quot;description&quot; size=&quot;20&quot;&gt;&#10;    &lt;/div&gt;&#10;    &lt;div&gt;&#10;        &lt;label for=&quot;priority&quot;&gt;Priority: &lt;/label&gt;&#10;        &lt;select id=&quot;priority&quot; name=&quot;priority&quot;&gt;&#10;            &lt;option name=&quot;Low&quot;&gt;Low&lt;/option&gt;&#10;            &lt;option name=&quot;Medium&quot;&gt;Medium&lt;/option&gt;&#10;            &lt;option name=&quot;High&quot;&gt;High&lt;/option&gt;&#10;            &lt;option name=&quot;Vital&quot;&gt;Vital&lt;/option&gt;&#10;        &lt;/select&gt;&#10;    &lt;/div&gt;&#10;    &lt;input type=&quot;submit&quot;&gt;&#10;&lt;/form&gt;&#10;&lt;/body&gt;&#10;&lt;/html&gt;"/>
        </step>
    </procedure>
    <procedure title="向 Ktor 注册文件夹" id="register-folder">
        <step>
            <p>
                导航至
                <Path>src/main/kotlin/com/example/plugins</Path>
                中的
                <Path>Routing.kt</Path>
                文件。
            </p>
        </step>
        <step>
            <p>
                将以下对 <code>staticResources()</code> 的调用添加到 <code>Application.configureRouting()</code>
                函数中：
            </p>
            <code-block lang="kotlin" code="                    fun Application.configureRouting() {&#10;                        routing {&#10;                            //add the following line&#10;                            staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                            get(&quot;/tasks&quot;) { ... }&#10;&#10;                            get(&quot;/tasks/byPriority/{priority?}&quot;) { … }&#10;                        }&#10;                    }"/>
            <p>这将需要以下导入：</p>
            <code-block lang="kotlin" code="                    import io.ktor.server.http.content.staticResources"/>
        </step>
        <step>
            <p>重新启动应用程序。</p>
        </step>
        <step>
            <p>
                在浏览器中导航至 <a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>。HTML 表单应该会显示：
            </p>
            <img src="tutorial_routing_and_requests_implementation_6.png"
                 alt="A browser window displaying an HTML form"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
    <procedure title="添加表单处理程序" id="add-form-handler">
        <p>
            在
            <Path>Routing.kt</Path>
            中，将以下附加路由添加到 <code>configureRouting()</code> 函数中：
        </p>
        <code-block lang="kotlin" code="                fun Application.configureRouting() {&#10;                    routing {&#10;                        //...&#10;&#10;                        //add the following route&#10;                        post(&quot;/tasks&quot;) {&#10;                            val formContent = call.receiveParameters()&#10;&#10;                            val params = Triple(&#10;                                formContent[&quot;name&quot;] ?: &quot;&quot;,&#10;                                formContent[&quot;description&quot;] ?: &quot;&quot;,&#10;                                formContent[&quot;priority&quot;] ?: &quot;&quot;&#10;                            )&#10;&#10;                            if (params.toList().any { it.isEmpty() }) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                                return@post&#10;                            }&#10;&#10;                            try {&#10;                                val priority = Priority.valueOf(params.third)&#10;                                TaskRepository.addTask(&#10;                                    Task(&#10;                                        params.first,&#10;                                        params.second,&#10;                                        priority&#10;                                    )&#10;                                )&#10;&#10;                                call.respond(HttpStatusCode.NoContent)&#10;                            } catch (ex: IllegalArgumentException) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                            } catch (ex: IllegalStateException) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                            }&#10;                        }&#10;                    }&#10;                }"/>
        <p>
            如你所见，新路由映射到 POST 请求而不是 GET 请求。Ktor
            通过调用 <code>receiveParameters()</code> 处理请求体。这会返回请求体中存在的参数集合。
        </p>
        <p>
            共有三个参数，因此你可以将关联的值存储在 <a
                href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-triple/">Triple</a> 中。如果参数不存在，则存储一个空字符串。
        </p>
        <p>
            如果任何值为空，服务器将返回状态码为 <code>400</code> 的响应。然后，它将尝试将第三个参数转换为 <code>Priority</code>，如果成功，则将信息作为新 <code>Task</code> 添加到版本库中。这两个操作都可能导致异常，在这种情况下，再次返回状态码 <code>400</code>。
        </p>
        <p>
            否则，如果一切成功，服务器将向客户端返回 <code>204</code> 状态码（
            No Content）。这表示他们的请求已成功，但没有新的信息可以发送给他们。
        </p>
    </procedure>
    <procedure title="测试已完成的功能" id="test-functionality">
        <step>
            <p>
                重新启动应用程序。
            </p>
        </step>
        <step>
            <p>在浏览器中导航至 <a href="http://0.0.0.0:8080/task-ui/task-form.html">http://0.0.0.0:8080/task-ui/task-form.html</a>。
            </p>
        </step>
        <step>
            <p>
                使用示例数据填写表单，然后点击
                <control>Submit</control>
                。
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_1.png"
                 alt="A browser window displaying an HTML form with sample data"
                 border-effect="rounded"
                 width="706"/>
            <p>当你提交表单时，不应被重定向到新页面。</p>
        </step>
        <step>
            <p>
                导航至 URL <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。你应该
                会看到新任务已添加。
            </p>
            <img src="tutorial_routing_and_requests_iteration_6_test_2.png"
                 alt="A browser window displaying an HTML table with tasks"
                 border-effect="rounded"
                 width="706"/>
        </step>
        <step>
            <p>
                为了验证该功能，请将以下测试添加到 <Path>ApplicationTest.kt</Path>：
            </p>
            <code-block lang="kotlin" code="                    @Test&#10;                    fun newTasksCanBeAdded() = testApplication {&#10;                        application {&#10;                            module()&#10;                        }&#10;&#10;                        val response1 = client.post(&quot;/tasks&quot;) {&#10;                            header(&#10;                                HttpHeaders.ContentType,&#10;                                ContentType.Application.FormUrlEncoded.toString()&#10;                            )&#10;                            setBody(&#10;                                listOf(&#10;                                    &quot;name&quot; to &quot;swimming&quot;,&#10;                                    &quot;description&quot; to &quot;Go to the beach&quot;,&#10;                                    &quot;priority&quot; to &quot;Low&quot;&#10;                                ).formUrlEncode()&#10;                            )&#10;                        }&#10;&#10;                        assertEquals(HttpStatusCode.NoContent, response1.status)&#10;&#10;                        val response2 = client.get(&quot;/tasks&quot;)&#10;                        assertEquals(HttpStatusCode.OK, response2.status)&#10;                        val body = response2.bodyAsText()&#10;&#10;                        assertContains(body, &quot;swimming&quot;)&#10;                        assertContains(body, &quot;Go to the beach&quot;)&#10;                    }"/>
            <p>
                在此测试中，两个请求发送到服务器：一个 POST 请求创建新任务，一个 GET
                请求确认新任务已添加。进行第一个请求时，使用
                <code>setBody()</code> 方法将内容插入请求体中。测试框架提供了一个作用于集合的 <code>formUrlEncode()</code>
                扩展方法，它抽象了像浏览器那样格式化数据的过程。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="重构路由" id="refactor-the-routing">
    <p>
        如果你检查目前的路由，你会发现所有路由都以 <code>/tasks</code> 开头。你可以通过将它们放入自己的子路由来消除这种重复：
    </p>
    <code-block lang="kotlin" code="            fun Application.configureRouting() {&#10;                routing {&#10;                    staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                    route(&quot;/tasks&quot;) {&#10;                        get {&#10;                            //Code remains the same&#10;                        }&#10;&#10;                        get(&quot;/byPriority/{priority?}&quot;) {&#10;                            //Code remains the same&#10;                        }&#10;&#10;                        post {&#10;                            //Code remains the same&#10;                        }&#10;                    }&#10;            }"/>
    <p>
        如果你的应用程序达到拥有多个子路由的阶段，那么将每个子路由放入自己的辅助函数中是合适的。但是，目前这不是必需的。
    </p>
    <p>
        你的路由组织得越好，就越容易扩展它们。例如，你可以添加一个按名称查找任务的路由：
    </p>
    <code-block lang="kotlin" code="            fun Application.configureRouting() {&#10;                routing {&#10;                    staticResources(&quot;/task-ui&quot;, &quot;task-ui&quot;)&#10;&#10;                    route(&quot;/tasks&quot;) {&#10;                        get {&#10;                            //Code remains the same&#10;                        }&#10;                        get(&quot;/byName/{taskName}&quot;) {&#10;                            val name = call.parameters[&quot;taskName&quot;]&#10;                            if (name == null) {&#10;                                call.respond(HttpStatusCode.BadRequest)&#10;                                return@get&#10;                            }&#10;&#10;                            val task = TaskRepository.taskByName(name)&#10;                            if (task == null) {&#10;                                call.respond(HttpStatusCode.NotFound)&#10;                                return@get&#10;                            }&#10;&#10;                            call.respondText(&#10;                                contentType = ContentType.parse(&quot;text/html&quot;),&#10;                                text = listOf(task).tasksAsTable()&#10;                            )&#10;                        }&#10;&#10;                        get(&quot;/byPriority/{priority?}&quot;) {&#10;                            //Code remains the same&#10;                        }&#10;&#10;                        post {&#10;                            //Code remains the same&#10;                        }&#10;                    }&#10;                }&#10;            }"/>
</chapter>
<chapter title="后续步骤" id="next-steps">
    <p>
        你现在已经实现了基本的路由和请求处理功能。此外，你还了解了验证、错误处理和单元测试。所有这些主题都将在后续教程中扩展。
    </p>
    <p>
        继续阅读<Links href="/ktor/server-create-restful-apis" summary="学习如何使用 Kotlin 和 Ktor 构建后端服务，其中包含一个生成 JSON 文件的 RESTful API 示例。">下一个教程</Links>，学习如何为你的任务管理器创建一个生成 JSON 文件的 RESTful API。
    </p>
</chapter>
</topic>