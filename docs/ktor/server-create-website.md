<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="使用 Ktor 在 Kotlin 中创建网站" id="server-create-website">
<tldr>
        <var name="example_name" value="tutorial-server-web-application"/>
    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
        <p>
            <b>使用的插件</b>: <Links href="/ktor/server-routing" summary="路由是服务器应用程序中用于处理传入请求的核心插件。">Routing</Links>,
            <Links href="/ktor/server-static-content" summary="了解如何提供静态内容，例如样式表、脚本、图像等。">Static Content</Links>,
            <Links href="/ktor/server-thymeleaf" summary="所需依赖项：io.ktor:%artifact_name%
        代码示例：
            %example_name%
        原生服务器支持：✖️">Thymeleaf</Links>
        </p>
</tldr>
<web-summary>
    了解如何使用 Ktor 和 Kotlin 构建网站。本教程将展示如何将 Thymeleaf 模板与 Ktor 路由结合，以在服务器端生成基于 HTML 的用户界面。
</web-summary>
<card-summary>
    了解如何使用 Ktor 和 Thymeleaf 模板在 Kotlin 中构建网站。
</card-summary>
<link-summary>
    了解如何使用 Ktor 和 Thymeleaf 模板在 Kotlin 中构建网站。
</link-summary>
<p>
    在本教程中，我们将向您展示如何使用 Ktor 和
    <a href="https://www.thymeleaf.org/">Thymeleaf</a> 模板在 Kotlin 中构建交互式网站。
</p>
<p>
    在<Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。">上一教程</Links>中，您学习了如何创建 RESTful 服务，我们假设该服务将由用 JavaScript 编写的单页应用程序 (SPA) 使用。尽管这是一种非常流行的架构，但它并不适合所有项目。
</p>
<p>
    您可能希望将所有实现保留在服务器端，并且只向客户端发送标记的原因有很多，例如：
</p>
<list>
    <li>简单性 - 维护单一代码库。</li>
    <li>安全性 - 防止将可能向攻击者提供信息的数据或代码放置在浏览器上。
    </li>
    <li>
        可支持性 - 允许客户端使用尽可能广泛的客户端，包括旧版浏览器和禁用 JavaScript 的浏览器。
    </li>
</list>
<p>
    Ktor 通过与<Links href="/ktor/server-templating" summary="了解如何使用 HTML/CSS 或 JVM 模板引擎构建视图。">多种服务器页面技术</Links>集成来支持这种方法。
</p>
<chapter title="先决条件" id="prerequisites">
    <p>
        您可以独立完成本教程，但我们强烈建议您完成
        <Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。">前一个教程</Links>，以了解如何创建 RESTful API。
    </p>
    <p>我们建议您安装<a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
        IDEA</a>，但您可以使用您选择的其他 IDE。
    </p>
</chapter>
<chapter title="Hello Task Manager Web 应用程序" id="hello-task-manager">
    <p>
        在本教程中，您将把在<Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。">上一教程</Links>中构建的任务管理器转换为 Web
        应用程序。为此，您将使用多个 Ktor <Links href="/ktor/server-plugins" summary="插件提供通用功能，例如序列化、内容编码、压缩等。">插件</Links>。
    </p>
    <p>
        虽然您可以手动将这些插件添加到现有项目，但生成一个新项目并逐步整合上一教程中的代码会更容易。我们将一路提供所有必要的代码，因此您无需手头拥有之前的项目。
    </p>
    <procedure title="使用插件创建初始项目" id="create-project">
        <step>
<p>
    导航到
    <a href="https://start.ktor.io/">Ktor 项目生成器</a>
    。
</p>
        </step>
        <step>
            <p>
                在
                <control>Project artifact</control>
                字段中，输入
                <Path>com.example.ktor-task-web-app</Path>
                作为您项目的 artifact 名称。
                <img src="server_create_web_app_generator_project_artifact.png"
                     alt="Ktor 项目生成器项目 artifact 名称"
                     style="block"
                     border-effect="line" width="706"/>
            </p>
        </step>
        <step>
            <p>在下一个屏幕中，通过点击
                <control>Add</control>
                按钮搜索并添加以下插件：
            </p>
            <list>
                <li>Routing</li>
                <li>Static Content</li>
                <li>Thymeleaf</li>
            </list>
            <p>
                <img src="ktor_project_generator_add_plugins.gif"
                     alt="在 Ktor 项目生成器中添加插件"
                     border-effect="line"
                     style="block"
                     width="706"/>
                添加插件后，您将在项目设置下方看到所有
                三个插件。
                <img src="server_create_web_app_generator_plugins.png"
                     alt="Ktor 项目生成器插件列表"
                     style="block"
                     border-effect="line" width="706"/>
            </p>
        </step>
        <step>
<p>
    点击<control>Download</control>按钮生成并下载您的 Ktor 项目。
</p>
        </step>
    </procedure>
    <procedure title="添加启动代码" id="add-starter-code">
        <step>
            在 IntelliJ IDEA 或您选择的其他 IDE 中打开您的项目。
        </step>
        <step>
            导航到<Path>src/main/kotlin/com/example</Path>，并创建一个名为<Path>model</Path>的子包。
        </step>
        <step>
            在<Path>model</Path>包内，创建一个新文件<Path>Task.kt</Path>。
        </step>
        <step>
            <p>
                在<Path>Task.kt</Path>文件中，添加一个 <code>enum</code> 来表示优先级，以及一个 <code>data class</code> 来表示任务：
            </p>
            [object Promise]
            <p>
                再次，我们希望创建 <code>Task</code> 对象并以可显示的形式将其发送给客户端。
            </p>
            <p>
                您可能记得：
            </p>
            <list>
                <li>
                    在<Links href="/ktor/server-requests-and-responses" summary="了解使用 Kotlin 和 Ktor 进行路由、处理请求和参数的基础知识，通过构建任务管理器应用程序。">处理请求并生成响应</Links>
                    教程中，我们添加了手写的扩展函数来将 Task 转换为 HTML。
                </li>
                <li>
                    在<Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。">创建 RESTful API</Links>教程中，我们使用
                    <code>kotlinx.serialization</code> 库中的 <code>Serializable</code> 类型注解了 <code>Task</code> 类。
                </li>
            </list>
            <p>
                在这种情况下，我们的目标是创建一个服务器页面，能够将任务内容写入浏览器。
            </p>
        </step>
        <step>
            打开<Path>plugins</Path>包内的<Path>Templating.kt</Path>文件。
        </step>
        <step>
            <p>
                在 <code>configureTemplating()</code> 方法中，添加一个用于 <code>/tasks</code> 的路由，如下所示：
            </p>
            [object Promise]
            <p>
                当服务器收到对 <code>/tasks</code> 的请求时，它会创建一个任务 list，然后将其传递给 Thymeleaf 模板。<code>ThymeleafContent</code> 类型接受我们希望触发的模板名称以及我们希望在页面上可访问的值表。
            </p>
            <p>
                在方法顶部的 Thymeleaf 插件初始化中，您可以看到 Ktor 将在<Path>templates/thymeleaf</Path>中查找服务器页面。与静态内容一样，它会期望此文件夹位于<Path>resources</Path>目录下。它还会期望一个<Path>.html</Path>后缀。
            </p>
            <p>
                在这种情况下，名称 <code>all-tasks</code> 将映射到路径
                <code>src/main/resources/templates/thymeleaf/all-tasks.html</code>
            </p>
        </step>
        <step>
            导航到<Path>src/main/resources/templates/thymeleaf</Path>，并创建一个新文件<Path>all-tasks.html</Path>。
        </step>
        <step>
            <p>打开<Path>all-tasks.html</Path>文件并添加以下内容：
            </p>
            [object Promise]
        </step>
        <step>
<p>在 IntelliJ IDEA 中，点击运行按钮
    (<img src="intellij_idea_gutter_icon.svg"
          style="inline" height="16" width="16"
          alt="intelliJ IDEA run icon"/>)
    启动应用程序。</p>
        </step>
        <step>
            <p>
                在浏览器中导航到<a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>。您应该会看到所有当前任务显示在一个表格中，如下所示：
            </p>
            <img src="server_create_web_app_all_tasks.png"
                 alt="一个显示任务列表的网页浏览器窗口" border-effect="rounded" width="706"/>
            <p>
                与所有服务器页面框架一样，Thymeleaf 模板将静态内容（发送到浏览器）与动态内容（在服务器上执行）混合在一起。如果选择其他框架，例如 <a href="https://freemarker.apache.org/">Freemarker</a>，可以使用略有不同的语法提供相同的功能。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="添加 GET 路由" id="add-get-routes">
    <p>既然您已熟悉请求服务器页面的过程，请继续将之前教程中的功能转移到本教程中。</p>
    <p>因为您包含了
        <control>Static Content</control>
        插件，<Path>Routing.kt</Path>文件中将存在以下代码：
    </p>
    [object Promise]
    <p>
        这意味着，例如，对 <code>/static/index.html</code> 的请求将从以下路径提供内容：
    </p>
    <code>src/main/resources/static/index.html</code>
    <p>
        由于此文件已是生成项目的一部分，您可以将其用作您希望添加功能的首页。
    </p>
    <procedure title="复用索引页面">
        <step>
            <p>
                打开<Path>src/main/resources/static</Path>内的<Path>index.html</Path>文件，并将其内容替换为以下实现：
            </p>
            [object Promise]
        </step>
        <step>
<p>
    在 IntelliJ IDEA 中，点击重新运行按钮 (<img src="intellij_idea_rerun_icon.svg"
                                                   style="inline" height="16" width="16"
                                                   alt="intelliJ IDEA 重新运行图标"/>) 重启应用程序。
</p>
        </step>
        <step>
            <p>
                在浏览器中导航到<a href="http://localhost:8080/static/index.html">http://localhost:8080/static/index.html</a>。您应该会看到一个链接按钮和三个 HTML 表单，它们允许您查看、筛选和创建任务：
            </p>
            <img src="server_create_web_app_tasks_form.png"
                 alt="一个显示 HTML 表单的网页浏览器" border-effect="rounded" width="706"/>
            <p>
                请注意，当您按 <code>name</code> 或 <code>priority</code> 筛选任务时，您是通过 GET 请求提交 HTML 表单的。这意味着参数将作为查询字符串添加到 URL 之后。
            </p>
            <p>
                例如，如果您搜索 <code>Medium</code> 优先级的任务，将向服务器发送的请求是：
            </p>
            <code>http://localhost:8080/tasks/byPriority?priority=Medium</code>
        </step>
    </procedure>
    <procedure title="复用 TaskRepository" id="task-repository">
        <p>
            任务的仓库可以与上一教程中的保持一致。
        </p>
        <p>
            在<Path>model</Path>包内，创建一个新文件<Path>TaskRepository.kt</Path>并添加以下代码：
        </p>
        [object Promise]
    </procedure>
    <procedure title="复用 GET 请求的路由" id="reuse-routes">
        <p>
            现在您已经创建了仓库，可以实现 GET 请求的路由了。
        </p>
        <step>
            导航到<Path>src/main/kotlin/com/example/plugins</Path>中的<Path>Templating.kt</Path>文件。
        </step>
        <step>
            <p>
                将当前版本的 <code>configureTemplating()</code> 替换为以下实现：
            </p>
            [object Promise]
            <p>
                上述代码可总结如下：
            </p>
            <list>
                <li>
                    在对 <code>/tasks</code> 的 GET 请求中，服务器从仓库中检索所有任务，并使用
                    <Path>all-tasks</Path>
                    模板生成发送到浏览器的下一个视图。
                </li>
                <li>
                    在对 <code>/tasks/byName</code> 的 GET 请求中，服务器从 <code>queryString</code> 中检索参数
                    <code>taskName</code>，找到匹配的任务，并使用
                    <Path>single-task</Path>
                    模板生成发送到浏览器的下一个视图。
                </li>
                <li>
                    在对 <code>/tasks/byPriority</code> 的 GET 请求中，服务器从
                    <code>queryString</code> 中检索参数
                    <code>priority</code>，找到匹配的任务，并使用
                    <Path>tasks-by-priority</Path>
                    模板生成发送到浏览器的下一个视图。
                </li>
            </list>
            <p>为了使这一切正常工作，您需要添加额外的模板。</p>
        </step>
        <step>
            导航到<Path>src/main/resources/templates/thymeleaf</Path>，并创建一个新文件<Path>single-task.html</Path>。
        </step>
        <step>
            <p>
                打开<Path>single-task.html</Path>文件并添加以下内容：
            </p>
            [object Promise]
        </step>
        <step>
            <p>在同一文件夹中，创建一个名为
                <Path>tasks-by-priority.html</Path>
                的新文件。
            </p>
        </step>
        <step>
            <p>
                打开<Path>tasks-by-priority.html</Path>文件并添加以下内容：
            </p>
            [object Promise]
        </step>
    </procedure>
</chapter>
<chapter title="添加对 POST 请求的支持" id="add-post-requests">
    <p>
        接下来，您将向 <code>/tasks</code> 添加一个 POST 请求处理器，以执行以下操作：
    </p>
    <list>
        <li>从表单参数中提取信息。</li>
        <li>使用仓库添加一个新任务。</li>
        <li>通过复用
            <control>all-tasks</control>
            模板来显示任务。
        </li>
    </list>
    <procedure>
        <step>
            导航到<Path>src/main/kotlin/com/example/plugins</Path>中的<Path>Templating.kt</Path>文件。
        </step>
        <step>
            <p>
                在 <code>configureTemplating()</code> 方法中添加以下 <code>post</code> 请求路由：
            </p>
            [object Promise]
        </step>
        <step>
<p>
    在 IntelliJ IDEA 中，点击重新运行按钮 (<img src="intellij_idea_rerun_icon.svg"
                                                   style="inline" height="16" width="16"
                                                   alt="intelliJ IDEA 重新运行图标"/>) 重启应用程序。
</p>
        </step>
        <step>
            在浏览器中导航到<a href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>。
        </step>
        <step>
            <p>
                在<control>Create or edit a task</control>表单中输入新的任务详情。
            </p>
            <img src="server_create_web_app_new_task.png"
                 alt="一个显示 HTML 表单的网页浏览器" border-effect="rounded" width="706"/>
        </step>
        <step>
            <p>点击<control>Submit</control>按钮提交表单。
                您将看到新任务显示在所有任务的 list 中：
            </p>
            <img src="server_create_web_app_new_task_added.png"
                 alt="一个显示任务列表的网页浏览器" border-effect="rounded" width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="后续步骤" id="next-steps">
    <p>
        恭喜！您现在已经完成了将任务管理器重建成一个 Web 应用程序，并学会了如何利用 Thymeleaf 模板。</p>
    <p>
        继续<Links href="/ktor/server-create-websocket-application" summary="了解如何利用 WebSockets 发送和接收内容。">下一教程</Links>以了解如何使用 Web Sockets。
    </p>
</chapter>
</topic>