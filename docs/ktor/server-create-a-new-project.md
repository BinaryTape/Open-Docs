<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="创建、打开和运行新的 Ktor 项目"
       id="server-create-a-new-project"
       help-id="server_create_a_new_project">
<show-structure for="chapter" depth="2"/>
<tldr>
        <var name="example_name" value="tutorial-server-get-started"/>
<p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
</p>
</tldr>
<link-summary>
        了解如何使用 Ktor 打开、运行和测试服务器应用程序。
</link-summary>
<web-summary>
        开始构建你的第一个 Ktor 服务器应用程序。在本教程中，你将学习如何创建、打开和运行新的 Ktor 项目。
</web-summary>
<p>
        在本教程中，你将学习如何创建、打开和运行你的第一个 Ktor 服务器项目。一旦你成功运行起来，就可以尝试一系列任务来熟悉 Ktor。
</p>
<p>
        这是帮助你开始使用 Ktor 构建服务器应用程序的系列教程的第一部分。你可以独立完成每个教程，但是，我们强烈建议你按照建议的顺序进行：
</p>
<list type="decimal">
        <li>创建、打开和运行新的 Ktor 项目。</li>
        <li><Links href="/ktor/server-requests-and-responses" summary="了解如何使用 Ktor 在 Kotlin 中构建任务管理器应用程序，从而学习路由、处理请求和形参的基础知识。">处理请求并生成响应</Links>。</li>
        <li><Links href="/ktor/server-create-restful-apis" summary="了解如何使用 Kotlin 和 Ktor 构建后端服务，其中包括一个生成 JSON 文件的 RESTful API 示例。">创建生成 JSON 的 RESTful API</Links>。</li>
        <li><Links href="/ktor/server-create-website" summary="了解如何使用 Kotlin、Ktor 和 Thymeleaf 模板构建网站。">使用 Thymeleaf 模板创建网站</Links>。</li>
        <li><Links href="/ktor/server-create-websocket-application" summary="了解如何利用 WebSockets 的强大功能来发送和接收内容。">创建 WebSocket 应用程序</Links>。</li>
        <li><Links href="/ktor/server-integrate-database" summary="了解使用 Exposed SQL 库将 Ktor 服务连接到数据库版本库的过程。">使用 Exposed 集成数据库</Links>。</li>
</list>
<chapter id="create-project" title="创建新的 Ktor 项目">
        <p>
            创建新的 Ktor 项目最快的方法之一是<a href="#create-project-with-the-ktor-project-generator">使用基于 Web 的 Ktor 项目生成器</a>。
        </p>
        <p>
            或者，你可以<a href="#create_project_with_intellij">使用 IntelliJ IDEA Ultimate 专用 Ktor 插件</a>或<a href="#create_project_with_ktor_cli_tool">Ktor CLI 工具</a>来生成项目。
        </p>
        <chapter title="使用 Ktor 项目生成器"
                 id="create-project-with-the-ktor-project-generator">
            <p>
                要使用 Ktor 项目生成器创建新项目，请按照以下步骤操作：
            </p>
            <procedure>
                <step>
                    <p>导航到<a href="https://start.ktor.io/">Ktor 项目生成器</a>。</p>
                </step>
                <step>
                    <p>在
                        <control>项目 artifact</control>
                        字段中，输入
                        <Path>com.example.ktor-sample-app</Path>
                        作为你的项目 artifact 名称。
                        <img src="ktor_project_generator_new_project_artifact_name.png"
                             alt="Ktor 项目生成器，项目 Artifact 名称为 org.example.ktor-sample-app"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>点击
                        <control>配置</control>
                        以打开设置下拉菜单：
                        <img src="ktor_project_generator_new_project_configure.png"
                             style="block"
                             alt="Ktor 项目设置的展开视图" border-effect="line" width="706"/>
                    </p>
                    <p>
                        以下设置可用：
                    </p>
                    <list>
                        <li>
    <p>
        <control>构建系统</control>
        :
        选择所需的<Links href="/ktor/server-dependencies" summary="了解如何将 Ktor 服务器依赖项添加到现有 Gradle/Maven 项目。">构建系统</Links>。
        可以是使用 Kotlin 或 Groovy DSL 的<emphasis>Gradle</emphasis>，也可以是<emphasis>Maven</emphasis>。
    </p>
                        </li>
                        <li>
    <p>
        <control>Ktor 版本</control>
        :
        选择所需的 Ktor 版本。
    </p>
                        </li>
                        <li>
    <p>
        <control>引擎</control>
        :
        选择用于运行服务器的<Links href="/ktor/server-engines" summary="了解处理网络请求的引擎。">引擎</Links>。
    </p>
                        </li>
                        <li>
    <p>
        <control>配置</control>
        :
        选择是在<Links href="/ktor/server-configuration-file" summary="了解如何在配置文件中配置各种服务器形参。">YAML 或 HOCON 文件中</Links>，还是在<Links href="/ktor/server-configuration-code" summary="了解如何在代码中配置各种服务器形参。">代码中</Links>指定服务器形参。
    </p>
                        </li>
                        <li>
    <p>
        <control>包含示例</control>
        :
        保持此选项启用以添加插件的示例代码。
    </p>
                        </li>
                    </list>
                    <p>在本教程中，你可以保留这些设置的默认值。</p>
                </step>
                <step>
                    <p>点击
                        <control>完成</control>
                        以保存配置并关闭菜单。
                    </p>
                </step>
                <step>
                    <p>下方你会找到一组可以添加到项目中的<Links href="/ktor/server-plugins" summary="插件提供通用功能，例如序列化、内容编码、压缩等。">插件</Links>。插件是 Ktor 应用程序中提供通用功能的构建块，例如身份验证、序列化和内容编码、压缩、Cookie 支持等等。
                    </p>
                    <p>为了本教程的目的，你在此阶段无需添加任何插件。</p>
                </step>
                <step>
                    <p>
                        点击<control>下载</control>按钮以生成并下载你的 Ktor 项目。
                        <img src="ktor_project_generator_new_project_download.png"
                             alt="Ktor 项目生成器下载按钮"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <p>你的下载应该会自动开始。</p>
            </procedure>
            <p>现在你已经生成了一个新项目，继续<a href="#unpacking">解压并运行你的 Ktor 项目</a>。</p>
        </chapter>
        <chapter title="使用 IntelliJ IDEA Ultimate 的 Ktor 插件" id="create_project_with_intellij"
                 collapsible="true">
            <p>
                本节描述了使用 IntelliJ IDEA Ultimate 的<a
                    href="https://plugins.jetbrains.com/plugin/16008-ktor">Ktor 插件</a>进行项目设置。
            </p>
            <p>
                要创建新的 Ktor 项目，<a href="https://www.jetbrains.com/help/idea/run-for-the-first-time.html">打开 IntelliJ IDEA</a>，并按照以下步骤操作：
            </p>
            <procedure>
                <step>
    <p>
        在欢迎屏幕上，点击<control>新建项目</control>。
    </p>
    <p>
        否则，从主菜单中选择<ui-path>文件 | 新建 | 项目</ui-path>。
    </p>
                </step>
                <step>
                    <p>
                        在<control>新建项目</control>向导中，从左侧列表中选择<control>Ktor</control>。
                    </p>
                </step>
                <step>
                    <p>
                        在右侧窗格中，你可以指定以下设置：
                    </p>
                    <img src="ktor_idea_new_project_settings.png" alt="Ktor 项目设置" width="706"
                         border-effect="rounded"/>
                    <list>
                        <li>
                            <p>
                                <control>名称</control>
                                :
                                指定项目名称。输入
                                <Path>ktor-sample-app</Path>
                                作为你的项目名称。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>位置</control>
                                :
                                为你的项目指定一个目录。
                            </p>
                        </li>
                        <li>
    <p>
        <control>网站</control>
        :
        指定用于生成包名的域。
    </p>
                        </li>
                        <li>
    <p>
        <control>Artifact</control>
        :
        此字段显示生成的 artifact 名称。
    </p>
                        </li>
                        <li>
    <p>
        <control>引擎</control>
        :
        选择用于运行服务器的<Links href="/ktor/server-engines" summary="了解处理网络请求的引擎。">引擎</Links>。
    </p>
                        </li>
                        <li>
    <p>
        <control>包含示例</control>
        :
        保持此选项启用以添加插件的示例代码。
    </p>
                        </li>
                    </list>
                </step>
                <step>
                    <p>
                        点击
                        <control>高级设置</control>
                        以展开附加设置菜单：
                    </p>
                    <img src="ktor_idea_new_project_advanced_settings.png" alt="Ktor 项目高级设置"
                         width="706" border-effect="rounded"/>
                    <p>
                        以下设置可用：
                    </p>
                    <list>
                        <li>
    <p>
        <control>构建系统</control>
        :
        选择所需的<Links href="/ktor/server-dependencies" summary="了解如何将 Ktor 服务器依赖项添加到现有 Gradle/Maven 项目。">构建系统</Links>。
        可以是使用 Kotlin 或 Groovy DSL 的<emphasis>Gradle</emphasis>，也可以是<emphasis>Maven</emphasis>。
    </p>
                        </li>
                        <li>
    <p>
        <control>Ktor 版本</control>
        :
        选择所需的 Ktor 版本。
    </p>
                        </li>
                        <li>
    <p>
        <control>配置</control>
        :
        选择是在<Links href="/ktor/server-configuration-file" summary="了解如何在配置文件中配置各种服务器形参。">YAML 或 HOCON 文件中</Links>，还是在<Links href="/ktor/server-configuration-code" summary="了解如何在代码中配置各种服务器形参。">代码中</Links>指定服务器形参。
    </p>
                        </li>
                    </list>
                    <p>为了本教程的目的，你可以保留这些设置的默认值。</p>
                </step>
                <step>
                    <p>
                        点击
                        <control>下一步</control>
                        以进入下一页。
                    </p>
                    <img src="ktor_idea_new_project_plugins_list.png" alt="Ktor 插件" width="706"
                         border-effect="rounded"/>
                    <p>
                        在此页面上，你可以选择一组<Links href="/ktor/server-plugins" summary="插件提供通用功能，例如序列化、内容编码、压缩等。">插件</Links>——它们是提供 Ktor 应用程序通用功能的构建块，例如身份验证、序列化和内容编码、压缩、Cookie 支持等等。
                    </p>
                    <p>为了本教程的目的，你在此阶段无需添加任何插件。</p>
                </step>
                <step>
                    <p>
                        点击<control>创建</control>并等待 IntelliJ IDEA 生成项目并安装依赖项。
                    </p>
                </step>
            </procedure>
            <p>
                现在你已经创建了一个新项目，继续学习如何<a href="#open-explore-run">打开、探查和运行</a>应用程序。
            </p>
        </chapter>
        <chapter title="使用 Ktor CLI 工具" id="create_project_with_ktor_cli_tool"
                 collapsible="true">
            <p>
                本节描述了使用<a href="https://github.com/ktorio/ktor-cli">Ktor CLI 工具</a>进行项目设置。
            </p>
            <p>
                要创建新的 Ktor 项目，打开你选择的终端并按照以下步骤操作：
            </p>
            <procedure>
                <step>
                    使用以下命令之一安装 Ktor CLI 工具：
                    <tabs>
                        <tab title="macOS/Linux" id="macos-linux">
                            [object Promise]
                        </tab>
                        <tab title="Windows" id="windows">
                            [object Promise]
                        </tab>
                    </tabs>
                </step>
                <step>
                    要在交互模式下生成新项目，请使用以下命令：
                    [object Promise]
                </step>
                <step>
                    输入
                    <Path>ktor-sample-app</Path>
                    作为你的项目名称：
                    <img src="server_create_cli_tool_name_dark.png"
                         alt="在交互模式下使用 Ktor CLI 工具"
                         border-effect="rounded"
                         style="block"
                         width="706"/>
                    <p>
                        （可选）你还可以通过编辑项目名称下方的<ui-path>位置</ui-path>路径来更改项目保存的位置。
                    </p>
                </step>
                <step>
                    按下<shortcut>Enter</shortcut>以继续。
                </step>
                <step>
                    在下一步中，你可以搜索并添加<Links href="/ktor/server-plugins" summary="插件提供通用功能，例如序列化、内容编码、压缩等。">插件</Links>到你的项目中。插件是 Ktor 应用程序中提供通用功能的构建块，例如身份验证、序列化和内容编码、压缩、Cookie 支持等等。
                    <img src="server_create_cli_tool_add_plugins_dark.png"
                         alt="使用 Ktor CLI 工具向项目添加插件"
                         border-effect="rounded"
                         style="block"
                         width="706"/>
                    <p>为了本教程的目的，你在此阶段无需添加任何插件。</p>
                </step>
                <step>
                    按下<shortcut>CTRL+G</shortcut>以生成项目。
                    <p>
                        或者，你也可以通过选择<control>创建项目 (CTRL+G)</control>并按下<shortcut>Enter</shortcut>来生成项目。
                    </p>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="解压并运行你的 Ktor 项目" id="unpacking">
        <p>
            在本节中，你将学习如何从命令行解压、构建和运行项目。以下描述假设：
        </p>
        <list type="bullet">
            <li>你已创建并下载了一个名为
                <Path>ktor-sample-app</Path>
                的项目。
            </li>
            <li>该项目已放置在你的主目录中名为
                <Path>myprojects</Path>
                的文件夹中。
            </li>
        </list>
        <p>如有必要，请更改名称和路径以匹配你自己的设置。</p>
        <p>打开你选择的命令行工具并按照步骤操作：</p>
        <procedure>
            <step>
                <p>在终端中，导航到你下载项目的文件夹：</p>
                [object Promise]
            </step>
            <step>
                <p>将 ZIP 归档文件解压到同名文件夹中：</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
                <p>你的目录现在将包含 ZIP 归档文件和解压后的文件夹。</p>
            </step>
            <step>
                <p>从该目录，导航到新创建的文件夹：</p>
                [object Promise]
            </step>
            <step>
                <p>在 macOS/UNIX 系统上，你需要使 gradlew Gradle 辅助脚本可执行。为此，请使用<code>chmod</code>命令：</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                </tabs>
            </step>
            <step>
                <p>要构建项目，请使用以下命令：</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
                <p>如果你看到构建成功，则可以再次通过 Gradle 执行项目。</p>
            </step>
            <step>
                <p>要运行项目，请使用以下命令：</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
            </step>
            <step>
                <p>要验证项目是否正在运行，请在输出中提到的 URL (<a
                        href="http://0.0.0.0:8080">http://0.0.0.0:8080</a>) 打开浏览器。你应该会在屏幕上看到“Hello World!”消息：</p>
                <img src="server_get_started_ktor_sample_app_output.png" alt="生成的 Ktor 项目输出"
                     border-effect="line" width="706"/>
            </step>
        </procedure>
        <p>恭喜！你已成功启动 Ktor 项目。</p>
        <p>请注意，命令行没有响应，因为底层进程正在忙于运行 Ktor 应用程序。你可以按<shortcut>CTRL+C</shortcut>来终止应用程序。
        </p>
    </chapter>
    <chapter title="在 IntelliJ IDEA 中打开、探查和运行你的 Ktor 项目" id="open-explore-run">
        <chapter title="打开项目" id="open">
            <p>如果你安装了<a href="https://www.jetbrains.com/idea/">IntelliJ IDEA</a>，可以轻松地从命令行打开项目。
            </p>
            <p>
                确保你位于项目文件夹中，然后键入<code>idea</code>命令，后跟一个句点以表示当前文件夹：
            </p>
            [object Promise]
            <p>
                或者，要手动打开项目，请启动 IntelliJ IDEA。
            </p>
            <p>
                如果欢迎屏幕打开，点击<control>打开</control>。否则，在主菜单中转到<ui-path>文件 | 打开</ui-path>并选择
                <Path>ktor-sample-app</Path>
                文件夹以将其打开。
            </p>
            <tip>
                有关管理项目的更多详细信息，请参阅<a href="https://www.jetbrains.com/help/idea/creating-and-managing-projects.html">IntelliJ IDEA 文档</a>。
            </tip>
        </chapter>
        <chapter title="探查项目" id="explore">
            <p>无论你选择哪种选项，项目都应按如下所示打开：</p>
            <img src="server_get_started_idea_project_view.png" alt="IDE 中生成的 Ktor 项目视图" width="706"/>
            <p>
                为了解释项目布局，我们已在<control>项目</control>视图中展开了结构并选择了
                <Path>settings-gradle.kts</Path>
                文件。
            </p>
            <p>
                你会看到运行应用程序的代码位于<Path>src/main/kotlin</Path>下的包中。默认包名为
                <Path>com.example</Path>
                ，其中包含一个名为
                <Path>plugins</Path>
                的子包。
                这些包中已创建了两个文件，名为
                <Path>Application.kt</Path>
                和
                <Path>Routing.kt</Path>
            </p>
            <img src="server_get_started_idea_main_folder.png" alt="Ktor 项目 src 文件夹结构" width="400"/>
            <p>项目名称在
                <Path>settings-gradle.kts</Path>
                中配置。
            </p>
            <img src="server_get_started_idea_settings_file.png" alt="settings.gradle.kt 的内容" width="706"/>
            <p>
                配置文件和其他类型的内容位于
                <Path>src/main/resources</Path>
                文件夹中。
            </p>
            <img src="server_get_started_idea_resources_folder.png" alt="Ktor 项目 resources 文件夹结构"
                 width="400"/>
            <p>
                已在<Path>src/test/kotlin</Path>下的包中创建了一个骨架测试。
            </p>
            <img src="server_get_started_idea_test_folder.png" alt="Ktor 项目 test 文件夹结构" width="400"/>
        </chapter>
        <chapter title="运行项目" id="run">
            <procedure>
                <p>要在 IntelliJ IDEA 中运行项目：</p>
                <step>
                    <p>通过点击右侧边栏上的 Gradle 图标 (<img alt="intelliJ IDEA Gradle 图标"
                                                          src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
                        打开<a href="https://www.jetbrains.com/help/idea/jetgradle-tool-window.html">Gradle 工具窗口</a>。</p>
                    <img src="server_get_started_idea_gradle_tab.png" alt="IntelliJ IDEA 中的 Gradle 标签页"
                         border-effect="line" width="706"/>
                </step>
                <step>
                    <p>在此工具窗口中，导航到
                        <ui-path>Tasks | application</ui-path>
                        并双击
                        <control>运行</control>
                        任务。
                    </p>
                    <img src="server_get_started_idea_gradle_run.png" alt="IntelliJ IDEA 中的 Gradle 标签页"
                         border-effect="line" width="450"/>
                </step>
                <step>
                    <p>你的 Ktor 应用程序将在 IDE 底部的<a
                            href="https://www.jetbrains.com/help/idea/run-tool-window.html">运行工具窗口</a>中启动：</p>
                    <img src="server_get_started_idea_run_terminal.png" alt="在终端中运行的项目" width="706"/>
                    <p>以前在命令行中显示的消息现在将在<ui-path>运行</ui-path>工具窗口中可见。
                    </p>
                </step>
                <step>
                    <p>要确认项目正在运行，请在指定的 URL
                        (<a href="http://0.0.0.0:8080">http://0.0.0.0:8080</a>) 打开浏览器。</p>
                    <p>你应该会再次看到“Hello World!”消息显示在屏幕上：</p>
                    <img src="server_get_started_ktor_sample_app_output.png" alt="浏览器屏幕中的 Hello World"
                         width="706"/>
                </step>
            </procedure>
            <p>
                你可以通过<ui-path>运行</ui-path>工具窗口管理应用程序。
            </p>
            <list type="bullet">
                <li>
                    要终止应用程序，点击停止按钮 <img src="intellij_idea_terminate_icon.svg"
                                                                             style="inline" height="16" width="16"
                                                                             alt="intelliJ IDEA 终止图标"/>
                </li>
                <li>
                    要重新启动进程，点击重新运行按钮 <img src="intellij_idea_rerun_icon.svg"
                                                                        style="inline" height="16" width="16"
                                                                        alt="intelliJ IDEA 重新运行图标"/>
                </li>
            </list>
            <p>
                这些选项在<a href="https://www.jetbrains.com/help/idea/run-tool-window.html#run-toolbar">IntelliJ IDEA 运行工具窗口文档</a>中有进一步解释。
            </p>
        </chapter>
    </chapter>
    <chapter title="要尝试的其他任务" id="additional-tasks">
        <p>以下是一些你可能希望尝试的其他任务：</p>
        <list type="decimal">
            <li><a href="#change-the-default-port">更改默认端口。</a></li>
            <li><a href="#change-the-port-via-yaml">通过 YAML 更改端口。</a></li>
            <li><a href="#add-a-new-http-endpoint">添加新的 HTTP 端点。</a></li>
            <li><a href="#configure-static-content">配置静态内容。</a></li>
            <li><a href="#write-an-integration-test">编写集成测试。</a></li>
            <li><a href="#register-error-handlers">注册错误处理程序。</a></li>
        </list>
        <p>
            这些任务相互独立，但复杂性逐渐增加。按照声明的顺序尝试它们是渐进学习最简单的方法。为简单起见并避免重复，以下描述假设你按顺序尝试这些任务。
        </p>
        <p>
            需要编码的地方，我们已指定了代码和相应的导入。IDE 可能会自动为你添加这些导入。
        </p>
        <chapter title="更改默认端口" id="change-the-default-port">
            <p>
                在<ui-path>项目</ui-path>视图中，导航到<Path>src/main/kotlin</Path>文件夹，然后进入为你创建的单个包，并按照步骤操作：
            </p>
            <procedure>
                <step>
                    <p>打开
                        <Path>Application.kt</Path>
                        文件。你应该会找到类似以下的代码：
                    </p>
                    [object Promise]
                </step>
                <step>
                    <p>在<code>embeddedServer()</code>函数中，将<code>port</code>形参更改为你选择的另一个数字，例如“9292”。</p>
                    [object Promise]
                </step>
                <step>
                    <p>点击重新运行按钮 (<img alt="intelliJ IDEA 重新运行按钮图标"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        以重新启动应用程序。</p>
                </step>
                <step>
                    <p>要验证你的应用程序是否正在新的端口号下运行，你可以在新的 URL (<a href="http://0.0.0.0:9292">http://0.0.0.0:9292</a>) 打开浏览器，或
                        <a href="https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html#creating-http-request-files">在 IntelliJ IDEA 中创建新的 HTTP 请求文件</a>：</p>
                    <img src="server_get_started_port_change.png"
                         alt="在 IntelliJ IDEA 中使用 HTTP 请求文件测试端口更改" width="706"/>
                </step>
            </procedure>
        </chapter>
        <chapter title="通过 YAML 更改端口" id="change-the-port-via-yaml">
            <p>
                创建新的 Ktor 项目时，你可以选择将配置外部存储在 YAML 或
                HOCON 文件中：
            </p>
            <img src="ktor_project_generator_configuration_options.png" width="400"
                 alt="Ktor 项目生成器配置选项"/>
            <p>
                如果你选择将配置外部存储，那么<Path>Application.kt</Path>中的代码将是：
            </p>
            [object Promise]
            <p>
                这些是存储在<Path>src/main/resources/</Path>中配置文件中的值：
            </p>
            <tabs>
                <tab title="application.yaml (YAML)" group-key="yaml">
                    [object Promise]
                </tab>
                <tab title="application.conf (HOCON)" group-key="hocon">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                在这种情况下，你无需更改任何代码即可更改端口号。只需更改 YAML 或 HOCON
                文件中的值并重新启动应用程序。更改可以通过与上述<a href="#change-the-default-port">默认端口</a>相同的方式进行验证。
            </p>
        </chapter>
        <chapter title="添加新的 HTTP 端点" id="add-a-new-http-endpoint">
            <p>接下来，你将创建一个新的 HTTP 端点，它将响应 GET 请求。</p>
            <p>
                在<ui-path>项目</ui-path>工具窗口中，导航到<Path>src/main/kotlin/com/example</Path>文件夹并按照步骤操作：
            </p>
            <procedure>
                <step>
                    <p>打开<Path>Application.kt</Path>文件并找到<code>configureRouting()</code>函数。
                    </p>
                </step>
                <step>
                    <p>在 IntelliJ IDEA 中，将光标放在函数名上并按下
                        <shortcut>⌘Cmd+B</shortcut>
                        ，导航到<code>configureRouting()</code>函数。
                    </p>
                    <p>或者，你也可以通过打开<code>Routing.kt</code>文件来导航到该函数。</p>
                    <p>这是你应该看到的代码：</p>
                    [object Promise]
                </step>
                <step>
                    <p>要创建新的端点，插入下面所示的额外五行代码：</p>
                    [object Promise]
                    <p>请注意，你可以将<code>/test1</code> URL 更改为你喜欢的任何内容。</p>
                </step>
                <step>
                    <p>为了使用<code>ContentType</code>，添加以下导入：</p>
                    [object Promise]
                </step>
                <step>
                    <p>点击重新运行按钮 (<img alt="intelliJ IDEA 重新运行按钮图标"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        以重新启动应用程序。</p>
                </step>
                <step>
                    <p>在浏览器中请求新的 URL (<a
                            href="http://0.0.0.0:9292/test1">http://0.0.0.0:9292/test1</a>)。你应该使用的端口号将取决于你是否尝试了第一个任务（<a
                                href="#change-the-default-port">更改默认端口</a>）。你应该会看到以下输出：</p>
                    <img src="server_get_started_add_new_http_endpoint_output.png"
                         alt="显示“Hello from Ktor”的浏览器屏幕" width="706"/>
                    <p>如果你已创建 HTTP 请求文件，你也可以在那里验证新的端点：</p>
                    <img src="server_get_started_add_new_http_endpoint.png" alt="IntelliJ IDEA 中的 HTTP 请求文件"
                         width="450"/>
                    <p>请注意，需要包含三个井号 (###) 的行来分隔不同的请求。</p>
                </step>
            </procedure>
        </chapter>
        <chapter title="配置静态内容" id="configure-static-content">
            <p>在
                <ui-path>项目</ui-path>
                工具窗口中，导航到
                <Path>src/main/kotlin/com/example/plugins</Path>
                文件夹并按照步骤操作：
            </p>
            <procedure>
                <step>
                    <p>打开<code>Routing.kt</code>文件。</p>
                    <p>这应该是默认内容：</p>
                    [object Promise]
                    <p>对于此任务，你是否已插入<a href="#add-a-new-http-endpoint">添加新的 HTTP 端点</a>中指定的额外端点内容无关紧要。</p>
                </step>
                <step>
                    <p>将以下行添加到路由部分：</p>
                    [object Promise]
                    <p>此行的含义如下：</p>
                    <list type="bullet">
                        <li>调用<code>staticResources()</code>告诉 Ktor，我们希望应用程序能够提供标准的网站内容，例如 HTML 和 JavaScript 文件。尽管此内容可以在浏览器中执行，但从服务器的角度来看，它被视为静态内容。
                        </li>
                        <li>URL <code>/content</code>指定了应该用于获取此内容的路径。
                        </li>
                        <li>路径<code>mycontent</code>是静态内容将所在的文件夹名称。Ktor 将在<code>resources</code>目录中查找此文件夹。
                        </li>
                    </list>
                </step>
                <step>
                    <p>添加以下导入：</p>
                    [object Promise]
                </step>
                <step>
                    <p>在<control>项目</control>工具窗口中，右键点击<code>src/main/resources</code>文件夹并选择
                        <control>新建 | 目录</control>
                        。
                    </p>
                    <p>或者，选择<code>src/main/resources</code>文件夹，按下
                        <shortcut>⌘Cmd+N</shortcut>
                        ，然后点击
                        <control>目录</control>
                        。
                    </p>
                </step>
                <step>
                    <p>将新目录命名为<code>mycontent</code>并按下
                        <shortcut>↩Enter</shortcut>
                        。
                    </p>
                </step>
                <step>
                    <p>右键点击新创建的文件夹并点击
                        <control>新建 | 文件</control>
                        。
                    </p>
                </step>
                <step>
                    <p>将新文件命名为“sample.html”并按下
                        <shortcut>↩Enter</shortcut>
                        。
                    </p>
                </step>
                <step>
                    <p>用有效的 HTML 填充新创建的文件页面，例如：</p>
                    [object Promise]
                </step>
                <step>
                    <p>点击重新运行按钮 (<img alt="intelliJ IDEA 重新运行按钮图标"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        以重新启动应用程序。</p>
                </step>
                <step>
                    <p>当你在<a href="http://0.0.0.0:9292/content/sample.html">http://0.0.0.0:9292/content/sample.html</a>打开浏览器时，你的示例页面内容应该会显示出来：</p>
                    <img src="server_get_started_configure_static_content_output.png"
                         alt="浏览器中静态页面的输出" width="706"/>
                </step>
            </procedure>
        </chapter>
        <chapter title="编写集成测试" id="write-an-integration-test">
            <p>
                Ktor 支持<Links href="/ktor/server-testing" summary="了解如何使用特殊测试引擎测试你的服务器应用程序。">创建集成测试</Links>，并且你的生成项目捆绑了此功能。
            </p>
            <p>要使用此功能，请按照以下步骤操作：</p>
            <procedure>
                <step>
                    <p>
                        在<Path>src</Path>下创建一个名为“test”的新目录，并创建一个名为“kotlin”的子目录。
                    </p>
                </step>
                <step>
                    <p>在<Path>src/test/kotlin</Path>内部创建一个名为“com.example”的新包。
                    </p>
                </step>
                <step>
                    <p>
                        在<Path>src/test/kotlin/com.example</Path>中创建一个名为“ApplicationTest.kt”的新文件。
                    </p>
                </step>
                <step>
                    <p>打开<code>ApplicationTest.kt</code>文件并添加以下代码：</p>
                    [object Promise]
                    <p><code>testApplication()</code>方法创建了 Ktor 的新实例。此实例在测试环境中运行，而不是在 Netty 等服务器中运行。</p>
                    <p>然后，你可以使用<code>application()</code>方法调用从
                        <code>embeddedServer()</code>调用的相同设置。</p>
                    <p>最后，你可以使用内置的<code>client</code>对象和 JUnit 断言发送示例请求并检测响应。</p>
                </step>
                <step>
                    <p>添加以下必需的导入：</p>
                    [object Promise]
                </step>
            </procedure>
            <p>
                该测试可以通过 IntelliJ IDEA 中执行测试的任何标准方式运行。请注意，因为你正在运行
                Ktor 的新实例，所以测试的成功或失败不取决于你的应用程序是否在
                0.0.0.0 运行。
            </p>
            <p>
                如果你已成功完成<a href="#add-a-new-http-endpoint">添加新的 HTTP 端点</a>，你应该能够添加此附加测试：
            </p>
            [object Promise]
            <p>需要以下附加导入：</p>
            [object Promise]
        </chapter>
        <chapter title="注册错误处理程序" id="register-error-handlers">
            <p>
                你可以通过使用<Links href="/ktor/server-status-pages" summary="%plugin_name% 允许 Ktor 应用程序根据抛出的异常或状态码适当地响应任何失败状态。">StatusPages 插件</Links>来处理 Ktor 应用程序中的错误。
            </p>
            <p>
                此插件默认不包含在你的项目中。你本可以通过 Ktor
                项目生成器中的<ui-path>插件</ui-path>部分或 IntelliJ IDEA
                中的项目向导将其添加到你的项目中。由于你已经创建了项目，在接下来的步骤中，你将学习如何手动添加和配置插件。
            </p>
            <p>
                实现此目的有四个步骤：
            </p>
            <list type="decimal">
                <li><a href="#add-dependency">在 Gradle 构建文件中添加新的依赖项。</a></li>
                <li><a href="#install-plugin-and-specify-handler">安装插件并指定异常处理程序。</a></li>
                <li><a href="#write-sample-code">编写示例代码以触发处理程序。</a></li>
                <li><a href="#restart-and-invoke">重新启动并调用示例代码。</a></li>
            </list>
            <procedure title="添加新的依赖项" id="add-dependency">
                <p>在<control>项目</control>工具窗口中，导航到项目根文件夹并按照步骤操作：
                </p>
                <step>
                    <p>打开<code>build.gradle.kts</code>文件。</p>
                </step>
                <step>
                    <p>在依赖项部分添加额外的依赖项，如下所示：</p>
                    [object Promise]
                    <p>完成此操作后，你需要重新加载项目以获取此新依赖项。</p>
                </step>
                <step>
                    <p>通过在 macOS 上按下<shortcut>Shift+⌘Cmd+I</shortcut>或
                        <shortcut>Ctrl+Shift+O</shortcut>
                        在 Windows 上按下，重新加载项目。
                    </p>
                </step>
            </procedure>
            <procedure title="安装插件并指定异常处理程序"
                       id="install-plugin-and-specify-handler">
                <step>
                    <p>导航到<code>Routing.kt</code>中的<code>configureRouting()</code>方法并添加以下代码行：</p>
                    [object Promise]
                    <p>这些行安装了<code>StatusPages</code>插件，并指定了当抛出<code>IllegalStateException</code>类型的异常时要采取的操作。</p>
                </step>
                <step>
                    <p>添加以下导入：</p>
                    [object Promise]
                </step>
            </procedure>
            <p>
                请注意，HTTP 错误代码通常会在响应中设置，但为了此任务的目的，输出直接显示在浏览器中。
            </p>
            <procedure title="编写示例代码以触发处理程序" id="write-sample-code">
                <step>
                    <p>保持在<code>configureRouting()</code>方法中，添加如下所示的额外行：</p>
                    [object Promise]
                    <p>你现在已添加了一个带有 URL <code>/error-test</code>的端点。当此端点被触发时，将抛出处理程序中使用的类型的异常。</p>
                </step>
            </procedure>
            <procedure title="重新启动并调用示例代码" id="restart-and-invoke">
                <step>
                    <p>点击重新运行按钮 (<img alt="intelliJ IDEA 重新运行按钮图标"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        以重新启动应用程序。</p></step>
                <step>
                    <p>在你的浏览器中，导航到 URL <a href="http://0.0.0.0:9292/error-test">http://0.0.0.0:9292/error-test</a>。
                        你应该会看到如下所示的错误消息：</p>
                    <img src="server_get_started_register_error_handler_output.png"
                         alt="显示消息“App in illegal state as Too Busy”的浏览器屏幕" width="706"/>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="下一步" id="next_steps">
        <p>
            如果你已经完成了所有附加任务，那么你现在已经掌握了配置 Ktor
            服务器、集成 Ktor 插件以及实现新路由的知识。然而，这仅仅是开始。要更深入地了解 Ktor
            的基础概念，请继续本指南中的下一个教程。
        </p>
        <p>
            接下来，你将学习如何通过<Links href="/ktor/server-requests-and-responses" summary="了解如何使用 Ktor 在 Kotlin 中构建任务管理器应用程序，从而学习路由、处理请求和形参的基础知识。">创建任务管理器应用程序来处理请求和生成响应</Links>。
        </p>
    </chapter>
</topic>