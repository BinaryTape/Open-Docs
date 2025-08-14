<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   title="使用 Kotlin Multiplatform 构建全栈应用程序" id="full-stack-development-with-kotlin-multiplatform">
<show-structure for="chapter, procedure" depth="2"/>
<web-summary>
    了解如何使用 Kotlin 和 Ktor 开发跨平台全栈应用程序。在本教程中，你将学习如何利用 Kotlin Multiplatform 为 Android、iOS 和桌面平台进行构建，并使用 Ktor 轻松处理数据。
</web-summary>
<link-summary>
    了解如何使用 Kotlin 和 Ktor 开发跨平台全栈应用程序。
</link-summary>
<card-summary>
    了解如何使用 Kotlin 和 Ktor 开发跨平台全栈应用程序。
</card-summary>
<tldr>
    <var name="example_name" value="full-stack-task-manager"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用的插件</b>：<Links href="/ktor/server-routing" summary="Routing is a core plugin for handling incoming requests in a server application.">Routing</Links>、
        <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>、
        <Links href="/ktor/server-serialization" summary="The ContentNegotiation plugin serves two primary purposes: negotiating media types between the client and server and serializing/deserializing the content in a specific format.">Content Negotiation</Links>、
        <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>、
        <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">Kotlin Multiplatform</a>
    </p>
</tldr>
<p>
    在本文中，你将学习如何使用 Kotlin 开发全栈应用程序，使其在 Android、iOS 和桌面平台运行，并利用 Ktor 实现无缝数据处理。
</p>
<p>完成本教程后，你将了解如何执行以下操作：</p>
<list>
    <li>使用 <a
            href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">
        Kotlin Multiplatform</a> 创建全栈应用程序。
    </li>
    <li>理解通过 IntelliJ IDEA 生成的项目。</li>
    <li>创建调用 Ktor 服务的 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 客户端。
    </li>
    <li>在设计中跨不同层重用共享类型。</li>
    <li>正确包含和配置多平台库。</li>
</list>
<p>
    在之前的教程中，我们使用了任务管理器示例来
    <Links href="/ktor/server-requests-and-responses" summary="Learn the basics of routing, handling requests, and parameters in Kotlin with Ktor by
    building a task manager application.">处理请求</Links>、
    <Links href="/ktor/server-create-restful-apis" summary="Learn how to build a backend service using Kotlin and Ktor, featuring an example of a
    RESTful API that generates JSON files.">创建 RESTful API</Links> 以及
    <Links href="/ktor/server-integrate-database" summary="Learn the process of connecting Ktor services to database repositories with the Exposed SQL Library.">与 Exposed 集成数据库</Links>。
    客户端应用程序保持尽可能精简，以便你能够专注于学习 Ktor 的基础知识。
</p>
<p>
    你将创建一个面向 Android、iOS 和桌面平台的客户端，使用 Ktor 服务获取要显示的数据。在可能的情况下，你将在客户端和服务器之间共享数据类型，从而加快开发速度并减少潜在错误。
</p>
<chapter title="先决条件" id="prerequisites">
    <p>
        与之前的文章一样，你将使用 IntelliJ IDEA 作为 IDE。有关安装和配置环境的信息，请参阅
        <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html">
            Kotlin Multiplatform 快速入门
        </a>指南。
    </p>
    <p>
        如果你是第一次使用 Compose Multiplatform，我们建议你在开始本教程之前先完成
        <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html">
            Compose Multiplatform 入门
        </a>
        教程。为了降低任务的复杂性，你可以专注于单个客户端平台。例如，如果你从未使用过 iOS，那么专注于桌面或 Android 开发可能是明智之举。
    </p>
</chapter>
<chapter title="创建新项目" id="create-project">
    <p>
        请使用 IntelliJ IDEA 中的 Kotlin Multiplatform 项目向导，而不是 Ktor 项目生成器。
        它将创建一个基本的多平台项目，你可以在其中扩展客户端和服务。客户端既可以使用像 SwiftUI 这样的原生 UI 库，但在此教程中，你将通过使用 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 为所有平台创建一个共享 UI。
    </p>
    <procedure id="generate-project">
        <step>
            启动 IntelliJ IDEA。
        </step>
        <step>
            在 IntelliJ IDEA 中，选择
            <ui-path>文件 | 新建 | 项目</ui-path>
            。
        </step>
        <step>
            在左侧面板中，选择
            <ui-path>Kotlin Multiplatform</ui-path>
            。
        </step>
        <step>
            在
            <ui-path>新建项目</ui-path>
            窗口中指定以下字段：
            <list>
                <li>
                    <ui-path>名称</ui-path>
                    : full-stack-task-manager
                </li>
                <li>
                    <ui-path>组</ui-path>
                    : com.example.ktor
                </li>
            </list>
        </step>
        <step>
            <p>
                选择
                <ui-path>Android</ui-path>
                、
                <ui-path>Desktop</ui-path>
                和
                <ui-path>Server</ui-path>
                作为目标平台。
            </p>
        </step>
        <step>
            <p>
                如果你使用的是 Mac，请同时选择
                <ui-path>iOS</ui-path>
                。确保
                <ui-path>共享 UI</ui-path>
                选项已选中。
                <img style="block" src="full_stack_development_tutorial_create_project.png"
                     alt="Kotlin Multiplatform wizard settings" width="706" border-effect="rounded"/>
            </p>
        </step>
        <step>
            <p>
                点击
                <control>创建</control>
                按钮，等待 IDE 生成并导入项目。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="运行服务" id="run-service">
    <procedure id="run-service-procedure">
        <step>
            在
            <ui-path>项目</ui-path>
            视图中，导航到
            <Path>server/src/main/kotlin/com/example/ktor/full_stack_task_manager</Path>
            并打开
            <Path>Application.kt</Path>
            文件。
        </step>
        <step>
            点击 <code>main()</code> 函数旁的
            <ui-path>运行</ui-path>
            按钮
            (<img src="intellij_idea_run_icon.svg"
                  style="inline" height="16" width="16"
                  alt="IntelliJ IDEA run icon"/>)
            以启动应用程序。
            <p>
                <ui-path>运行</ui-path>
                工具窗口中将打开一个新标签页，日志以消息 "Responding at http://0.0.0.0:8080" 结束。
            </p>
        </step>
        <step>
            <p>
                导航到 <a href="http://0.0.0.0:8080/">http://0.0.0.0:8080/</a> 以打开应用程序。
                你应该会在浏览器中看到 Ktor 显示的消息。
                <img src="full_stack_development_tutorial_run.png"
                     alt="A Ktor server browser response" width="706"
                     border-effect="rounded" style="block"/>
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="检查项目" id="examine-project">
    <p>
        <Path>server</Path>
        文件夹是项目中的三个 Kotlin 模块之一。另外两个是
        <Path>shared</Path>
        和
        <Path>composeApp</Path>
        。
    </p>
    <p>
        <Path>server</Path>
        模块的结构与 <a href="https://start.ktor.io/">Ktor 项目生成器</a> 生成的结构非常相似。
        你有一个专用的构建文件来
        声明插件和依赖项，以及一个包含用于构建和启动 Ktor 服务的代码的源代码集：
    </p>
    <img src="full_stack_development_tutorial_server_folder.png"
         alt="Contents of the server folder in a Kotlin Multiplatform project" width="300"
         border-effect="line"/>
    <p>
        如果你查看
        <Path>Application.kt</Path>
        文件中的路由指令，会看到对 <code>greet()</code> 函数的调用：
    </p>
    [object Promise]
    <p>
        这会创建一个 <code>Greeting</code> 类型的实例并调用其 <code>greet()</code> 方法。
        <code>Greeting</code> 类定义在 <Path>shared</Path> 模块中：
        <img src="full_stack_development_tutorial_shared_module.png"
             alt="Greeting.kt and Platform.kt opened in IntelliJ IDEA" width="706"
             border-effect="line" style="block"/>
    </p>
    <p>
        <Path>shared</Path>
        模块包含将在不同目标平台中使用的代码。
    </p>
    <p>
        <Path>shared</Path> 模块集中的 <Path>commonMain</Path> 源代码集保存了将在所有平台使用的类型。
        如你所见，这就是定义 <code>Greeting</code> 类型的地方。
        这里也是你放置将在服务器和所有不同客户端平台之间共享的公共代码的地方。
    </p>
    <p>
        <Path>shared</Path>
        模块还包含为每个你希望提供客户端的平台设定的源代码集。这是因为
        <Path>commonMain</Path>
        中声明的类型可能需要因目标平台而异的功能。以
        <code>Greeting</code> 类型为例，你希望使用平台特有的 API 来获取当前平台的名称。
        这通过 <a
            href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html">预期与实际声明</a> 实现。
    </p>
    <p>
        在 <Path>shared</Path> 模块的 <Path>commonMain</Path> 源代码集中，你使用 <code>expect</code> 关键字声明一个 <code>getPlatform()</code> 函数：
    </p>
    <tabs>
        <tab title="commonMain/Platform.kt" id="commonMain">
            [object Promise]
        </tab>
    </tabs>
    <p>然后每个目标平台
        必须提供 <code>getPlatform()</code> 函数的 <code>actual</code> 声明，如下所示：
    </p>
    <tabs>
        <tab title="Platform.ios.kt" id="iosMain">
            [object Promise]
        </tab>
        <tab title="Platform.android.kt" id="androidMain">
            [object Promise]
        </tab>
        <tab title="Platform.jvm.kt" id="jvmMain">
            [object Promise]
        </tab>
        <tab title="Platform.wasmJs.kt" id="wasmJsMain">
            [object Promise]
        </tab>
    </tabs>
    <p>
        项目中还有一个额外的模块，即
        <Path>composeApp</Path>
        模块。
        它包含 Android、iOS、桌面和 Web 客户端应用程序的代码。
        这些应用程序目前尚未链接到 Ktor 服务，但它们确实使用了共享的
        <code>Greeting</code> 类。
    </p>
</chapter>
<chapter title="运行客户端应用程序" id="run-client-app">
    <p>
        你可以通过执行目标的运行配置来运行客户端应用程序。要在 iOS 模拟器上运行应用程序，请按照以下步骤操作：
    </p>
    <procedure id="run-ios-app-procedure">
        <step>
            在 IntelliJ IDEA 中，选择
            <Path>iosApp</Path>
            运行配置和模拟设备。
            <img src="full_stack_development_tutorial_run_configurations.png"
                 alt="运行与调试窗口" width="400"
                 border-effect="line" style="block"/>
        </step>
        <step>
            点击
            <ui-path>运行</ui-path>
            按钮
            (<img src="intellij_idea_run_icon.svg"
                  style="inline" height="16" width="16"
                  alt="IntelliJ IDEA 运行图标"/>)
            以运行配置。
        </step>
        <step>
            <p>
                当你运行 iOS 应用程序时，它会在后台使用 Xcode 构建，并在 iOS 模拟器中启动。
                该应用程序显示一个按钮，点击时会切换图片。
                <img style="block" src="full_stack_development_tutorial_run_ios.gif"
                     alt="在 iOS 模拟器中运行应用程序" width="300" border-effect="rounded"/>
            </p>
            <p>
                当按钮首次按下时，当前平台的详细信息会添加到其文本中。实现此功能的代码位于
                <Path>composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager/App.kt</Path>
                ：
            </p>
            [object Promise]
            <p>
                这是一个可组合函数，你将在本文后面进行修改。目前重要的是，它显示了一个 UI 并使用了共享的 <code>Greeting</code> 类型，而 <code>Greeting</code> 类型又使用了实现通用 <code>Platform</code> 接口的平台特有类。
            </p>
        </step>
    </procedure>
    <p>
        现在你已经了解了生成项目的结构，可以逐步添加任务管理器功能。
    </p>
</chapter>
<chapter title="添加模型类型" id="add-model-types">
    <p>
        首先，添加模型类型并确保客户端和服务器都可以访问它们。
    </p>
    <procedure id="add-model-types-procedure">
        <step>
            导航到
            <Path>shared/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager</Path>
            并创建一个名为
            <Path>model</Path>
            的新包。
        </step>
        <step>
            在新包内，创建一个名为
            <Path>Task.kt</Path>
            的新文件。
        </step>
        <step>
            <p>
                添加一个 <code>enum</code> 来表示优先级，以及一个 <code>class</code> 来表示任务。
                <code>Task</code> 类使用 <code>kotlinx.serialization</code> 库中的 <code>Serializable</code> 类型进行注解：
            </p>
            [object Promise]
            <p>
                你会注意到导入和注解都无法编译。这是因为项目尚未依赖 <code>kotlinx.serialization</code> 库。
            </p>
        </step>
        <step>
            <p>
                导航到
                <Path>shared/build.gradle.kts</Path>
                并添加序列化插件：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                在同一文件中，向
                <Path>commonMain</Path>
                源代码集添加新的依赖项：
            </p>
            [object Promise]
        </step>
        <step>
            导航到
            <Path>gradle/libs.versions.toml</Path>
            并定义以下内容：
            [object Promise]
        </step>
        <!-- the plugin version can also be set in the version catalog -->
        <step>
            在 IntelliJ IDEA 中，选择
            <ui-path>构建 | 同步项目与 Gradle 文件</ui-path>
            以应用更新。Gradle 导入完成后，你应该会发现你的
            <Path>Task.kt</Path>
            文件能够成功编译。
        </step>
    </procedure>
    <!-- The following seems like a lot of nuance to cover for this newbie-oriented tutorial.
     I think at this point it's enough to know that the serialization library requires a Gradle plugin.
     If it's important, it would be nice to make the terminology more precise: earlier we said it won't compile, and now
     we're saying it would, so I'm not sure what's going on in the end.
     -->
    <p>
        请注意，即使不包含序列化插件，代码也能编译，但是，序列化 <code>Task</code> 对象跨网络所需的类型将不会生成。这将导致在尝试调用服务时出现运行时错误。
    </p>
    <p>
        将序列化插件放置在另一个模块（例如
        <Path>server</Path>
        或
        <Path>composeApp</Path>
        ）不会在构建时引起错误。但同样，序列化所需的额外类型将不会生成，从而导致运行时错误。
    </p>
</chapter>
<chapter title="创建服务器" id="create-server">
    <p>
        下一阶段是为我们的任务管理器创建服务器实现。
    </p>
    <procedure id="create-server-procedure">
        <step>
            导航到
            <Path>server/src/main/kotlin/com/example/ktor/full_stack_task_manager</Path>
            文件夹并创建一个名为
            <Path>model</Path>
            的子包。
        </step>
        <step>
            <p>
                在该包内，创建一个新的
                <Path>TaskRepository.kt</Path>
                文件，并为我们的版本库添加以下接口：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                在同一个包中，创建一个名为
                <Path>InMemoryTaskRepository.kt</Path>
                的新文件，其中包含以下类：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                导航到
                <Path>server/src/main/kotlin/.../Application.kt</Path>
                并将现有代码替换为以下实现：
            </p>
            [object Promise]
            <p>
                此实现与之前的教程非常相似，不同之处在于，为了简化，现在你已将所有路由代码放在 <code>Application.module()</code> 函数中。
            </p>
            <p>
                输入此代码并添加导入后，你会发现多个编译错误，因为代码使用了多个需要作为依赖项包含的 Ktor 插件，
                包括用于与 Web 客户端交互的 <Links href="/ktor/server-cors" summary="Required dependencies: io.ktor:%artifact_name%
    Code example:
        %example_name%
    Native server support: ✅">CORS</Links> 插件。
            </p>
        </step>
        <step>
            打开
            <Path>gradle/libs.versions.toml</Path>
            文件并定义以下库：
            [object Promise]
        </step>
        <step>
            <p>
                打开服务器模块构建文件 (
                <Path>server/build.gradle.kts</Path>
                ) 并添加以下依赖项：
            </p>
            [object Promise]
        </step>
        <step>
            再次在主菜单中选择 <ui-path>构建 | 同步项目与 Gradle 文件</ui-path>。
            导入完成后，你应该会发现 <code>ContentNegotiation</code> 类型和 <code>json()</code> 函数的导入能够正常工作。
        </step>
        <step>
            重新运行服务器。你会发现这些路由可以从浏览器访问。
        </step>
        <step>
            <p>
                导航到 <a href="http://0.0.0.0:8080/tasks"></a>
                和 <a href="http://0.0.0.0:8080/tasks/byPriority/Medium"></a>
                以查看包含任务的 JSON 格式服务器响应。
                <img style="block" src="full_stack_development_tutorial_run_server.gif"
                     width="707" border-effect="rounded" alt="Server response in browser"/>
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="创建客户端" id="create-client">
    <p>
        为了让你的客户端能够访问服务器，你需要包含 Ktor 客户端。这涉及三种类型的依赖项：
    </p>
    <list>
        <li>Ktor 客户端的核心功能。</li>
        <li>用于处理网络的平台特有引擎。</li>
        <li>对内容协商和序列化的支持。</li>
    </list>
    <procedure id="create-client-procedure">
        <step>
            在
            <Path>gradle/libs.versions.toml</Path>
            文件中，添加以下库：
            [object Promise]
        </step>
        <step>
            导航到
            <Path>composeApp/build.gradle.kts</Path>
            并添加以下依赖项：
            [object Promise]
            <p>
                完成此操作后，你可以添加一个 <code>TaskApi</code> 类型，以便客户端作为 Ktor 客户端的轻量级包装器。
            </p>
        </step>
        <step>
            在主菜单中选择 <ui-path>构建 | 同步项目与 Gradle 文件</ui-path>
            以导入构建文件中的更改。
        </step>
        <step>
            导航到
            <Path>composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager</Path>
            并创建一个名为
            <Path>network</Path>
            的新包。
        </step>
        <step>
            <p>
                在新包内，创建一个新的
                <Path>HttpClientManager.kt</Path>
                用于客户端配置：
            </p>
            [object Promise]
            <p>
                请注意，你应该将 <code>1.2.3.4</code> 替换为你当前机器的 IP 地址。你将无法从 Android 虚拟设备或 iOS 模拟器上运行的代码调用 <code>0.0.0.0</code> 或 <code>localhost</code>。
                <!-- should we include instructions on finding out the IP address?
                     `ipconfig getifaddr en0`or something -->
            </p>
        </step>
        <step>
            <p>
                在相同的
                <Path>composeApp/.../full_stack_task_manager/network</Path>
                包中，创建一个新的
                <Path>TaskApi.kt</Path>
                文件，其中包含以下实现：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                导航到
                <Path>commonMain/.../App.kt</Path>
                并将 App 可组合项替换为以下实现。
                这将使用 <code>TaskApi</code> 类型从服务器检索任务列表，然后
                在列中显示每个任务的名称：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                在服务器运行的同时，通过运行 <ui-path>iosApp</ui-path> 运行配置来测试 iOS 应用程序。
            </p>
        </step>
        <step>
            <p>
                点击
                <control>获取任务</control>
                按钮以显示任务列表：
                <img style="block" src="full_stack_development_tutorial_run_iOS.png"
                     alt="应用程序在 iOS 上运行" width="363" border-effect="rounded"/>
            </p>
            <note>
                在此演示中，为了清晰起见，我们简化了流程。在实际应用程序中，避免通过网络发送未加密数据至关重要。
            </note>
        </step>
        <step>
            <p>
                在 Android 平台上，你需要显式地授予应用程序网络权限，并允许它以明文形式发送和接收数据。要启用这些权限，请打开
                <Path>composeApp/src/androidMain/AndroidManifest.xml</Path>
                并添加以下设置：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                使用 <ui-path>composeApp</ui-path> 运行配置运行 Android 应用程序。
                你现在应该会发现 Android 客户端也能运行了：
                <img style="block" src="full_stack_development_tutorial_run_android.png"
                     alt="应用程序在 Android 上运行" width="350" border-effect="rounded"/>
            </p>
        </step>
        <step>
            <p>
                对于桌面客户端，你应该为包含窗口分配尺寸和标题。
                打开文件
                <Path>composeApp/src/desktopMain/.../main.kt</Path>
                并通过更改 <code>title</code> 和设置 <code>state</code> 属性来修改代码：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                使用 <ui-path>composeApp [desktop]</ui-path> 运行配置运行桌面应用程序：
                <img style="block" src="full_stack_development_tutorial_run_desktop_resized.png"
                     alt="应用程序在桌面设备上运行" width="400" border-effect="rounded"/>
            </p>
        </step>
        <step>
            <p>
                使用 <ui-path>composeApp [wasmJs]</ui-path> 运行配置运行 Web 客户端：
            </p>
            <img style="block" src="full_stack_development_tutorial_run_web.png"
                 alt="应用程序在桌面设备上运行" width="400" border-effect="rounded"/>
        </step>
    </procedure>
</chapter>
<chapter title="改进 UI" id="improve-ui">
    <p>
        客户端现在正在与服务器通信，但这远不是一个吸引人的 UI。
    </p>
    <procedure id="improve-ui-procedure">
        <step>
            <p>
                打开位于
                <Path>composeApp/src/commonMain/.../full_stack_task_manager</Path>
                的
                <Path>App.kt</Path>
                文件，并将现有的 <code>App</code> 替换为下面的 <code>App</code> 和 <code>TaskCard</code> 可组合项：
            </p>
            [object Promise]
            <p>
                通过此实现，你的客户端现在具有了一些基本功能。
            </p>
            <p>
                通过使用 <code>LaunchedEffect</code> 类型，所有任务都在启动时加载，而 <code>LazyColumn</code>
                可组合项允许用户滚动浏览任务。
            </p>
            <p>
                最后，创建了一个单独的 <code>TaskCard</code> 可组合项，它反过来使用一个
                <code>Card</code> 来显示每个 <code>Task</code> 的详细信息。已经添加了按钮来删除和更新任务。
            </p>
        </step>
        <step>
            <p>
                重新运行客户端应用程序——例如，Android 应用程序。
                你现在可以滚动浏览任务，查看其详细信息，并删除它们：
                <img style="block" src="full_stack_development_tutorial_improved_ui.gif"
                     alt="在 Android 上运行的应用程序，UI 已改进" width="350" border-effect="rounded"/>
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="添加更新功能" id="add-update-functionality">
    <p>
        为了完成客户端，整合允许更新任务详细信息的功能。
    </p>
    <procedure id="add-update-func-procedure">
        <step>
            导航到
            <Path>composeApp/src/commonMain/.../full_stack_task_manager</Path>
            中的
            <Path>App.kt</Path>
            文件。
        </step>
        <step>
            <p>
                添加 <code>UpdateTaskDialog</code> 可组合项和必要的导入，如下所示：
            </p>
            [object Promise]
            <p>
                这是一个可组合项，它通过对话框显示 <code>Task</code> 的详细信息。<code>description</code> 和 <code>priority</code> 放置在 <code>TextField</code> 可组合项中，以便可以更新它们。当用户按下更新按钮时，它会触发 <code>onConfirm()</code> 回调。
            </p>
        </step>
        <step>
            <p>
                更新同一文件中的 <code>App</code> 可组合项：
            </p>
            [object Promise]
            <p>
                你正在存储一个额外的状态，即当前选中的任务。如果此值不为 null，则我们调用 <code>UpdateTaskDialog</code> 可组合项，并将 <code>onConfirm()</code> 回调设置为使用 <code>TaskApi</code> 向服务器发送 POST 请求。
            </p>
            <p>
                最后，当你创建 <code>TaskCard</code> 可组合项时，你使用 <code>onUpdate()</code> 回调来设置 <code>currentTask</code> 状态变量。
            </p>
        </step>
        <step>
            重新运行客户端应用程序。你现在应该能够使用按钮更新每个任务的详细信息。
            <img style="block" src="full_stack_development_tutorial_update_task.gif"
                 alt="在 Android 上删除任务" width="350" border-effect="rounded"/>
        </step>
    </procedure>
</chapter>
<chapter title="后续步骤" id="next-steps">
    <p>
        在本文中，你已经在 Kotlin Multiplatform 应用程序的上下文中使用了 Ktor。你现在可以创建一个包含多个服务和客户端的项目，面向各种不同的平台。
    </p>
    <p>
        如你所见，可以构建特性而无需任何代码重复或冗余。项目所有层所需的类型可以放置在
        <Path>shared</Path>
        多平台模块中。服务才需要的功能放在
        <Path>server</Path>
        模块中，而客户端才需要的功能则放在
        <Path>composeApp</Path>
        中。
    </p>
    <p>
        这种开发不可避免地需要客户端和服务器技术知识。但是你可以使用 <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">Kotlin
        Multiplatform</a> 库和 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">
        Compose Multiplatform</a> 来最大程度地减少你需要学习的新内容。即使你最初只专注于一个平台，随着应用程序需求的增长，你也可以轻松添加其他平台。
    </p>
</chapter>
</topic>