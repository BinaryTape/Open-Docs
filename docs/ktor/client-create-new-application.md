<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="创建客户端应用程序"
       id="client-create-new-application"
       help-id="getting_started_ktor_client;client-getting-started;client-get-started;client-create-a-new-application">
    <show-structure for="chapter" depth="2"/>
    <tldr>
        <var name="example_name" value="tutorial-client-get-started"/>
    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    </tldr>
    <link-summary>
        创建你的第一个客户端应用程序，用于发送请求和接收响应。
    </link-summary>
    <p>
        Ktor 包含一个多平台异步 HTTP 客户端，它允许你<Links href="/ktor/client-requests" summary="了解如何发送请求以及指定各种请求参数：请求 URL、HTTP 方法、请求头和请求体。">发送请求</Links>并<Links href="/ktor/client-responses" summary="了解如何接收响应、获取响应体以及获取响应参数。">处理响应</Links>，通过<Links href="/ktor/client-plugins" summary="了解提供常见功能的插件，例如日志记录、序列化、授权等。">插件</Links>（例如<Links href="/ktor/client-auth" summary="Auth 插件处理客户端应用程序中的身份验证和授权。">身份验证</Links>、<Links href="/ktor/client-serialization" summary="ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及在发送请求和接收响应时以特定格式序列化/反序列化内容。">JSON 序列化</Links>等）扩展其功能。
    </p>
    <p>
        在本教程中，我们将向你展示如何创建你的第一个 Ktor 客户端应用程序，该应用程序发送请求并打印响应。
    </p>
    <chapter title="前提条件" id="prerequisites">
    <p>
        在开始本教程之前，请<a href="https://www.jetbrains.com/help/idea/installation-guide.html">安装 IntelliJ IDEA Community 或 Ultimate 版</a>。
    </p>
    </chapter>
    <chapter title="创建新项目" id="new-project">
        <p>
            你可以在现有项目中手动<Links href="/ktor/client-create-and-configure" summary="了解如何创建和配置 Ktor 客户端。">创建和配置</Links> Ktor 客户端，但是从头开始的便捷方式是使用 IntelliJ IDEA 捆绑的 Kotlin 插件生成一个新项目。
        </p>
        <p>
            要创建新的 Kotlin 项目，请<a href="https://www.jetbrains.com/help/idea/run-for-the-first-time.html">打开 IntelliJ IDEA</a> 并按照以下步骤操作：
        </p>
        <procedure>
            <step>
    <p>
        在欢迎界面，点击<control>New Project</control>。
    </p>
    <p>
        否则，从主菜单中选择<ui-path>文件 | 新建 | 项目</ui-path>。
    </p>
            </step>
            <step>
                <p>
                    在<control>New Project</control>向导中，从左侧列表中选择<control>Kotlin</control>。
                </p>
            </step>
            <step>
                <p>
                    在右侧窗格中，指定以下设置：
                </p>
                <img src="client_get_started_new_project.png" alt="IntelliJ IDEA 中的新 Kotlin 项目窗口"
                     border-effect="rounded"
                     width="706"/>
                <list id="kotlin_app_settings">
                    <li>
                        <p>
                            <control>Name</control>
                            ：指定项目名称。
                        </p>
                    </li>
                    <li>
                        <p>
                            <control>Location</control>
                            ：指定项目的目录。
                        </p>
                    </li>
                    <li>
                        <p>
                            <control>Build system</control>
                            ：确保选择<control>Gradle</control>。
                        </p>
                    </li>
                    <li>
                        <p>
                            <control>Gradle DSL</control>
                            ：选择<control>Kotlin</control>。
                        </p>
                    </li>
                    <li>
                        <p>
                            <control>Add sample code</control>
                            ：选择此选项可在生成的项目中包含示例代码。
                        </p>
                    </li>
                </list>
            </step>
            <step>
                <p>
                    点击<control>Create</control>并等待 IntelliJ IDEA 生成项目并安装依赖项。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="添加依赖项" id="add-dependencies">
        <p>
            让我们为 Ktor 客户端添加所需的依赖项。
        </p>
        <procedure>
            <step>
                <p>
                    打开<Path>gradle.properties</Path>文件，并添加以下行以指定 Ktor 版本：
                </p>
                <note id="eap-note">
                    <p>
                        要使用 Ktor 的 EAP 版本，你需要添加一个<a href="#repositories">Space 仓库</a>。
                    </p>
                </note>
            </step>
            <step>
                <p>
                    打开<Path>build.gradle.kts</Path>文件，并将以下构件添加到依赖项代码块中：
                </p>
                <list>
                    <li><code>ktor-client-core</code> 是提供主要客户端功能的核心依赖项，
                    </li>
                    <li>
                        <code>ktor-client-cio</code> 是用于处理网络请求的<Links href="/ktor/client-engines" summary="了解处理网络请求的引擎。">引擎</Links>的依赖项。
                    </li>
                </list>
            </step>
            <step>
                <p>
                    点击<control>Load Gradle Changes</control>图标，该图标位于<Path>build.gradle.kts</Path>文件右上角，以安装新添加的依赖项。
                </p>
                <img src="client_get_started_load_gradle_changes_name.png" alt="加载 Gradle 更改" width="706"/>
            </step>
        </procedure>
    </chapter>
    <chapter title="创建客户端" id="create-client">
        <p>
            要添加客户端实现，请导航到<Path>src/main/kotlin</Path>并按照以下步骤操作：
        </p>
        <procedure>
            <step>
                <p>
                    打开<Path>Main.kt</Path>文件，并用以下实现替换现有代码：
                </p>
                <p>
                    在 Ktor 中，客户端由 <a
                        href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html">HttpClient</a>类表示。
                </p>
            </step>
            <step>
                <p>
                    使用<a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/get.html"><code>HttpClient.get()</code></a>方法<Links href="/ktor/client-requests" summary="了解如何发送请求以及指定各种请求参数：请求 URL、HTTP 方法、请求头和请求体。">发送 GET 请求</Links>。 <Links href="/ktor/client-responses" summary="了解如何接收响应、获取响应体以及获取响应参数。">响应</Links>将作为 <code>HttpResponse</code> 类对象接收。
                </p>
                <p>
                    添加上述代码后，IDE 会针对 <code>get()</code> 函数显示以下错误：<emphasis>挂起函数 'get' 只能从协程或另一个挂起函数调用</emphasis>。
                </p>
                <img src="client_get_started_suspend_error.png" alt="挂起函数错误" width="706"/>
                <p>
                    要解决此问题，你需要使 <code>main()</code> 函数成为挂起函数。
                </p>
                <tip>
                    要了解有关调用 <code>suspend</code> 函数的更多信息，请参阅<a
                        href="https://kotlinlang.org/docs/coroutines-basics.html">协程基础</a>。
                </tip>
            </step>
            <step>
                <p>
                    在 IntelliJ IDEA 中，点击定义旁边的红色灯泡，然后选择<control>Make main suspend</control>。
                </p>
                <img src="client_get_started_suspend_error_fix.png" alt="使 main 函数挂起" width="706"/>
            </step>
            <step>
                <p>
                    使用 <code>println()</code> 函数打印服务器返回的<a href="#status">状态码</a>，并使用 <code>close()</code> 函数关闭流并释放与其关联的任何资源。<Path>Main.kt</Path>文件应如下所示：
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="运行应用程序" id="make-request">
        <p>
            要运行应用程序，请导航到<Path>Main.kt</Path>文件并按照以下步骤操作：
        </p>
        <procedure>
            <step>
                <p>
                    在 IntelliJ IDEA 中，点击 <code>main()</code> 函数旁边的行号区图标，然后选择<control>Run 'MainKt'</control>。
                </p>
                <img src="client_get_started_run_main.png" alt="运行应用" width="706"/>
            </step>
            <step>
                等待 IntelliJ IDEA 运行应用程序。
            </step>
            <step>
                <p>
                    你将在 IDE 底部**运行**窗格中看到输出。
                </p>
                <img src="client_get_started_run_output_with_warning.png" alt="服务器响应" width="706"/>
                <p>
                    尽管服务器返回了 <code>200 OK</code> 消息，你还会看到一条错误消息，指出 SLF4J 未能找到 <code>StaticLoggerBinder</code> 类，因此默认使用空操作（NOP）日志记录器实现。这实际上意味着日志记录已禁用。
                </p>
                <p>
                    你现在拥有了一个可用的客户端应用程序。但是，要修复此警告并能够通过日志记录调试 HTTP 调用，需要<a href="#enable-logging">额外步骤</a>。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="启用日志记录" id="enable-logging">
        <p>
            由于 Ktor 在 JVM 上使用 SLF4J 抽象层进行日志记录，因此要启用日志记录，你需要<a href="#jvm">提供一个日志框架</a>，例如<a href="https://logback.qos.ch/">Logback</a>。
        </p>
        <procedure id="enable-logging-procedure">
            <step>
                <p>
                    在<Path>gradle.properties</Path>文件中，指定日志框架的版本：
                </p>
            </step>
            <step>
                <p>
                    打开<Path>build.gradle.kts</Path>文件，并将以下构件添加到依赖项代码块中：
                </p>
            </step>
            <step>
                点击<control>Load Gradle Changes</control>图标以安装新添加的依赖项。
            </step>
            <step>
    <p>
        在 IntelliJ IDEA 中，点击重新运行按钮 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEA 重新运行图标"/>) 以重启应用程序。
    </p>
            </step>
            <step>
                <p>
                    你应该不再看到错误，但相同的 <code>200 OK</code> 消息将显示在 IDE 底部**运行**窗格中。
                </p>
                <img src="client_get_started_run_output.png" alt="服务器响应" width="706"/>
                <p>
                    至此，你已启用日志记录。要开始查看日志，你需要添加日志配置。
                </p>
            </step>
            <step>
                <p>导航到<Path>src/main/resources</Path>，并创建一个新的<Path>logback.xml</Path>文件，其中包含以下实现：
                </p>
            </step>
            <step>
    <p>
        在 IntelliJ IDEA 中，点击重新运行按钮 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEA 重新运行图标"/>) 以重启应用程序。
    </p>
            </step>
            <step>
                <p>
                    现在，你可以在**运行**窗格中打印的响应上方看到跟踪日志：
                </p>
                <img src="client_get_started_run_output_with_logs.png" alt="服务器响应" width="706"/>
            </step>
        </procedure>
        <tip>
            Ktor 提供了一种简单直接的方式，通过 <Links href="/ktor/client-logging" summary="所需依赖项: io.ktor:ktor-client-logging 代码示例: %example_name%">Logging</Links> 插件为 HTTP 调用添加日志，而添加配置文件则允许你在复杂应用程序中微调日志行为。
        </tip>
    </chapter>
    <chapter title="后续步骤" id="next-steps">
        <p>
            为了更好地理解和扩展此配置，请探索如何<Links href="/ktor/client-create-and-configure" summary="了解如何创建和配置 Ktor 客户端。">创建和配置 Ktor 客户端</Links>。
        </p>
    </chapter>
</topic>