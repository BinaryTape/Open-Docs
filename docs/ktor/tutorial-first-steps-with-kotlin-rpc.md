<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Kotlin RPC 初步" id="tutorial-first-steps-with-kotlin-rpc">
<show-structure for="chapter" depth="2"/>
<web-summary>
    在这份全面的指南中，探索 RPC 的基本原理，并深入比较 RPC 和 REST。了解如何使用 Kotlin RPC 创建您的第一个应用程序。
</web-summary>
<link-summary>
    了解如何使用 Kotlin RPC 和 Ktor 创建您的第一个应用程序。
</link-summary>
<card-summary>
    了解如何使用 Kotlin RPC 和 Ktor 创建您的第一个应用程序。
</card-summary>
<tldr>
    <var name="example_name" value="tutorial-kotlin-rpc-app"/>
<p>
    <b>代码示例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用的插件</b>：<Links href="/ktor/server-routing" summary="Routing 是一个核心插件，用于处理服务器应用程序中的传入请求。">Routing</Links>、
        <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>、
        <a href="https://github.com/Kotlin/kotlinx-rpc">kotlinx.rpc</a>
    </p>
</tldr>
<p>
    Kotlin RPC (Remote Procedure Call，远程过程调用) 是 Kotlin 生态系统的一个令人兴奋的新增特性，它建立在成熟的基础之上，并运行在 <code>kotlinx.rpc</code> 库上。
</p>
<p>
    <code>kotlinx.rpc</code> 库使您能够仅使用常规 Kotlin 语言构造，跨网络边界进行过程调用。因此，它为 REST 和 Google RPC (gRPC) 提供了替代方案。
</p>
<p>
    在本文中，我们将介绍 Kotlin RPC 的核心概念并构建一个简单的应用程序。然后，您可以将该库应用到您自己的项目中进行求值。
</p>
<chapter title="先决条件" id="prerequisites">
    <p>
        本教程假设您对 Kotlin 编程有基本的了解。如果您是 Kotlin 的新手，请考虑查阅一些<a href="https://kotlinlang.org/docs/getting-started.html">
        入门材料</a>。
    </p>
    <p>为获得最佳体验，我们推荐使用 <a
            href="https://www.jetbrains.com/idea/download">IntelliJ
        IDEA Ultimate</a> 作为您的集成开发环境 (IDE)，因为它提供了全面的支持和工具，将提高您的生产力。
    </p>
</chapter>
<chapter title="什么是 RPC？" id="what-is-rpc">
    <chapter title="本地过程调用 vs. 远程过程调用" id="local-vs-remote">
        <p>
            任何有编程经验的人都会熟悉过程调用的概念。这是任何编程语言中的一个基本概念。从技术上讲，这些是
            本地过程调用，因为它们总是发生在同一个程序中。
        </p>
        <p>
            远程过程调用是指函数调用和实参以某种方式通过网络传输，以便实现可以在独立的 VM/可执行文件中发生。返回值则沿着相反的路径返回到发起调用的机器。
        </p>
        <p>
            最简单的理解方式是，发起调用的机器是客户端，而实现所在的机器是服务器。然而，这不一定是强制性的。RPC
            调用也可以双向发生，作为对等架构的一部分。但为了保持简单，我们假设是客户端/服务器部署。
        </p>
    </chapter>
    <chapter title="RPC 框架基础" id="rpc-framework-fundamentals">
        <p>
            任何 RPC 框架都必须提供某些基础功能。在传统的 IT 基础设施中实现远程
            过程调用时，这些是不可避免的。术语可能有所不同，职责划分也可能不同，但每个 RPC 框架都必须提供：
        </p>
        <list type="decimal">
            <li>
                一种声明将远程调用的过程的方法。在面向对象编程中，接口是逻辑上的选择。这可以是当前语言提供的接口构造，也可以是某种与语言无关的标准，例如 <a
                    href="https://webidl.spec.whatwg.org/">W3C 使用的 Web IDL</a>
            </li>
            <li>
                一种指定用于形参和返回值的类型的方法。同样，您可以使用与语言无关的标准。然而，在当前语言中注解标准数据类型声明可能更简单。
            </li>
            <li>
                辅助类，称为
                <format style="italic">客户端桩</format>
                （client stubs），用于将过程调用转换为可以通过网络发送的格式，并解包结果返回值。这些桩可以在
                编译期或运行时动态创建。
            </li>
            <li>
                一个底层的
                <format style="italic">RPC 运行时</format>
                （RPC Runtime），它管理辅助类并监督远程过程调用的生命周期。在
                服务器端，此运行时需要嵌入到某种服务器中，以便能够持续处理请求。
            </li>
            <li>
                需要选择（或定义）协议来表示被调用的过程、序列化正在发送的数据以及在网络上传输信息。过去，有些技术从头定义了新协议（CORBA 中的 IIOP），而另一些则专注于重用（SOAP 中的 HTTP POST）。
            </li>
        </list>
    </chapter>
    <chapter title="Marshaling 与 Serialization" id="marshaling-vs-serialization">
        <p>
            在 RPC 框架中，我们谈论
            <format style="italic">marshaling</format>
            （封送处理）和
            <format style="italic">unmarshaling</format>
            （解封送处理）。这是打包和解包要通过网络发送的信息的过程。它可以被认为是序列化（serialization）的超集。在封送处理中，我们正在序列化对象，但我们还需要打包有关被调用的过程以及该调用发生时的上下文信息。
        </p>
    </chapter>
    <p>
        在介绍了 RPC 的核心概念之后，让我们通过构建一个示例应用程序来看看它们如何在 <code>kotlinx.rpc</code> 中应用。
    </p>
</chapter>
<chapter title="Hello, kotlinx.rpc" id="hello-kotlinx-rpc">
    <p>
        让我们创建一个通过网络订购披萨的应用程序。为了让代码尽可能简单，我们将使用一个基于控制台的客户端。
    </p>
    <chapter title="创建项目" id="create-project">
        <p>首先，您将创建一个包含客户端和服务器实现的项。</p>
        <p>
            在更复杂的应用程序中，最佳实践是为客户端和服务器使用单独的模块。
            然而，为了本教程的简单起见，我们将为两者使用单个模块。
        </p>
        <procedure id="create-project-procedure">
            <step>
                启动 <a href="https://www.jetbrains.com/idea/download/">IntelliJ IDEA</a>。
            </step>
            <step>
<p>
    在欢迎屏幕上，点击 <control>New Project</control>。
</p>
<p>
    否则，从主菜单中选择 <ui-path>File | New | Project</ui-path>。
</p>
            </step>
            <step>
                在
                <control>Name</control>
                字段中，输入
                <Path>KotlinRpcPizzaApp</Path>
                作为您的项名称。
                <img src="tutorial_kotlin_rpc_intellij_project.png" alt="IntelliJ 新建 Kotlin 项目窗口"
                     style="block" width="706" border-effect="rounded"/>
            </step>
            <step>
                保留其余默认设置，然后点击
                <control>Create</control>
                。
            </step>
        </procedure>
        <p>
            通常，您会立即配置项目构建文件。然而，这是一个实现细节，不会增强您对技术的理解，所以我们将在
            最后回到这一步。
        </p>
    </chapter>
    <chapter title="添加共享类型" id="shared-types">
        <p>
            任何 RPC 项的核心都是定义远程调用过程的接口，以及这些过程中使用的类型。
        </p>
        <p>
            在多模块项目中，这些类型需要共享。然而，在这个示例中，这一步不是必需的。
        </p>
        <procedure id="shared-types-procedure">
            <step>
                导航到 <Path>src/main/kotlin</Path>
                文件夹并创建一个名为
                <Path>model</Path>
                的新子包。
            </step>
            <step>
                在 <Path>model</Path>
                包内，创建一个新的
                <Path>PizzaShop.kt</Path>
                文件，其实现如下：
                [object Promise]
                <p>
                    接口需要有来自 <code>kotlinx.rpc</code>
                    库的 <code>@Rpc</code> 注解。
                </p>
                <p>
                    因为您正在使用 <a href="https://github.com/Kotlin/kotlinx.serialization"><code>kotlinx.serialization</code></a>
                    来帮助在网络上传输信息，所以形参中使用的类型必须用
                    <code>Serializable</code> 注解标记。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="实现客户端" id="client-implementation">
        <procedure id="client-impl-procedure">
            <step>
                导航到
                <Path>src/main/kotlin</Path>
                并创建一个新的
                <Path>Client.kt</Path>
                文件。
            </step>
            <step>
                打开
                <Path>Client.kt</Path>
                并添加以下实现：
                [object Promise]
            </step>
        </procedure>
        <p>
            您只需要 25 行代码即可准备并执行 RPC 调用。显然，其中有很多内容，
            所以让我们将代码分解为几个部分。
        </p>
        <p>
            <code>kotlinx.rpc</code> 库使用 <Links href="/ktor/client-create-new-application" summary="创建您的第一个客户端应用程序，用于发送请求和接收响应。">Ktor
            client</Links> 在客户端托管其运行时。该运行时不与 Ktor 耦合，也可以选择其他方案，
            但这促进了复用，并使得 <code>kotlinx.rpc</code> 易于集成到
            现有 KMP 应用程序中。
        </p>
        <p>
            Ktor 客户端和 Kotlin RPC 都围绕协程构建，因此您使用 <code>runBlocking</code> 来
            创建初始协程，并在其中执行客户端的其余部分：
        </p>
        [object Promise]
        <tip>
            请注意，<code>runBlocking</code> 专为临时测试和演示设计，而非生产代码。
        </tip>
        <p>
            接下来，您以标准方式创建 Ktor 客户端实例。<code>kotlinx.rpc</code> 使用
            底层的 <Links href="/ktor/client-websockets" summary="Websockets 插件允许您在服务器和客户端之间创建多向通信会话。">WebSockets</Links> 插件来传输信息。您
            只需通过使用 <code>installKrpc()</code> 函数确保其已加载：
        </p>
        [object Promise]
        <p>
            创建此 Ktor 客户端后，您会创建一个 <code>KtorRpcClient</code> 对象来调用远程
            过程。您需要配置服务器的位置和用于传输信息的机制：
        </p>
        [object Promise]
        <p>
            至此，标准设置已完成，您可以开始使用特定于问题领域的功能了。您可以使用客户端创建实现
            <code>PizzaShop</code> 接口方法的客户端代理对象：
        </p>
        [object Promise]
        <p>
            然后您可以进行远程过程调用并使用结果：
        </p>
        [object Promise]
        <p>
            请注意，此时为您完成了大量工作。调用和
            所有实参的详细信息都必须转换为消息，通过网络发送，然后接收并解码返回值。
            这种透明的发生方式正是初始设置的回报。
        </p>
        <p>
            最后，我们需要像往常一样关闭客户端：
        </p>
        [object Promise]
    </chapter>
    <chapter title="实现服务器" id="server-implementation">
        <p>
            服务器端的实现分为两部分。首先，您需要创建我们接口的实现；其次，您需要将其托管在服务器中。
        </p>
        <procedure id="create-interface">
            <step>
                导航到
                <Path>src/main/kotlin</Path>
                并创建一个新的
                <Path>Server.kt</Path>
                文件。
            </step>
            <step>
                打开
                <Path>Server.kt</Path>
                并添加以下接口：
                [object Promise]
                <p>
                    显然，这不是一个真实的实现，但足以让我们的演示运行起来。
                </p>
                <p>
                    实现的第二部分基于 Ktor。
                </p>
            </step>
            <step>
                <p>
                    将以下代码添加到同一个文件中：
                </p>
                [object Promise]
                <p>以下是分解：</p>
                <p>
                    首先，您创建一个 Ktor/Netty 实例，并使用指定的扩展函数进行
                    配置：
                </p>
                [object Promise]
                <p>
                    然后，您声明一个扩展 Ktor Application 类型的设置函数。这会安装
                    <code>kotlinx.rpc</code> 插件并声明一个或多个路由：
                </p>
                [object Promise]
                <p>
                    在路由部分，您使用 <code>kotlinx.rpc</code> 对 Ktor Routing DSL
                    的扩展来声明一个端点。与客户端一样，您指定 URL 并配置序列化。
                    但在这个例子中，我们的实现将监听该 URL 以接收传入请求：
                </p>
                [object Promise]
                <p>
                    请注意，您使用 <code>registerService</code> 将接口的实现
                    提供给 RPC 运行时。您可能希望有多个实例，但这是后续文章的
                    一个话题。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="添加依赖项" id="add-dependencies">
        <p>
            您现在拥有运行应用程序所需的所有代码，但目前它甚至无法
            编译，更不用说执行了。
            您可以使用带有 <a href="https://start.ktor.io/p/kotlinx-rpc">kotlinx.rpc</a> 插件的 Ktor 项目生成器，
            或者您可以手动配置构建文件。
            这也不是太复杂。
        </p>
        <procedure id="configure-build-files">
            <step>
                在
                <Path>build.gradle.kts</Path>
                文件中，添加以下插件：
                [object Promise]
                <p>
                    Kotlin 插件的原因显而易见。解释其他插件：
                </p>
                <list>
                    <li>
                        <code>kotlinx.serialization</code> 插件是生成辅助类型以将 Kotlin 对象转换为 JSON 所必需的。请记住，<code>kotlinx.serialization</code> 不使用反射。
                    </li>
                    <li>
                        Ktor 插件用于构建将应用程序与其所有依赖项打包在一起的胖 JAR。
                    </li>
                    <li>
                        需要 RPC 插件来生成客户端的桩。
                    </li>
                </list>
            </step>
            <step>
                添加以下依赖项：
                [object Promise]
                <p>
                    这添加了 Ktor 客户端和服务器、<code>kotlinx.rpc</code> 运行时的客户端和服务器部分，
                    以及用于集成 <code>kotlinx.rpc</code> 和 <code>kotlinx-serialization</code> 的库。
                </p>
                <p>
                    有了这些，您现在就可以运行项目并开始进行 RPC 调用了。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="运行应用程序" id="run-application">
        <p>
            要运行演示，请按照以下步骤操作：
        </p>
        <procedure id="run-app-procedure">
            <step>
                导航到
                <Path>Server.kt</Path>
                文件。
            </step>
            <step>
                <p>在 IntelliJ IDEA 中，点击 <code>main()</code> 函数旁边的运行按钮
                    （<img src="intellij_idea_gutter_icon.svg"
                          style="inline" height="16" width="16"
                          alt="IntelliJ IDEA 运行图标"/>）
                    以启动应用程序。</p>
                <p>
                    您应该在 <control>Run</control>
                    工具面板中看到输出：
                </p>
                <img src="tutorial_kotlin_rpc_run_server.png" alt="IntelliJ IDEA 中运行服务器的输出"
                     style="block" width="706" border-effect="line"/>
            </step>
            <step>
                导航到
                <Path>Client.kt</Path>
                文件并运行应用程序。您应该在
                控制台中看到以下输出：
                [object Promise]
            </step>
        </procedure>
    </chapter>
</chapter>
<chapter title="扩展示例" id="extend-the-example">
    <p>
        最后，让我们增强示例应用程序的复杂性，为未来的
        开发奠定坚实的基础。
    </p>
    <procedure id="extend-server">
        <step>
            在
            <Path>PizzaShop.kt</Path>
            文件中，通过包含客户端 ID 来扩展 <code>orderPizza</code> 方法，并添加一个
            <code>viewOrders</code> 方法，该方法返回指定客户端的所有待处理订单：
            [object Promise]
            <p>
                您可以利用 coroutines 库，通过返回一个 <code>Flow</code> 而不是一个
                <code>List</code> 或 <code>Set</code>。这将允许您一次将一份披萨的信息
                流式传输给客户端。
            </p>
        </step>
        <step>
            导航到
            <Path>Server.kt</Path>
            文件，并通过将当前订单存储在列表的 map 中来实现此功能：
            [object Promise]
            <p>
                请注意，为每个客户端实例创建了 <code>PizzaShopImpl</code> 的新实例。
                这通过隔离它们的状态来避免客户端之间的冲突。然而，它并未解决单个服务器实例内的线程
                安全问题，特别是当多个服务同时访问同一个实例时。
            </p>
        </step>
        <step>
            在
            <Path>Client.kt</Path>
            文件中，使用两个不同的客户端 ID 提交多个订单：
            [object Promise]
            <p>
                然后，您使用 <code>Coroutines</code> 库和
                <code>collect</code> 方法迭代结果：
            </p>
            [object Promise]
        </step>
        <step>
            运行服务器和客户端。当您运行客户端时，您将看到结果增量显示：
            <img src="tutorial_kotlin_rpc_run_client.gif" alt="客户端输出增量显示结果"
                 style="block" width="706" border-effect="line"/>
        </step>
    </procedure>
    <p>
        创建了一个工作示例后，现在让我们深入了解一切是如何运作的。特别是，让我们
        比较和对比 Kotlin RPC 与两种主要替代方案——REST 和 gRPC。
    </p>
</chapter>
<chapter title="RPC vs. REST" id="rpc-vs-rest">
    <p>
        RPC 的概念比 REST 早得多，<a
            href="https://en.wikipedia.org/wiki/Remote_procedure_call">至少可以追溯到 1981 年</a>。与 REST 相比，基于 RPC 的方法不限制您使用统一接口（例如 HTTP
        请求类型），在代码中处理起来更简单，并且由于二进制消息传递而具有更高的性能。
    </p>
    <p>
        然而，REST 有三大优势：
    </p>
    <list type="decimal">
        <li>
            它可以直接被浏览器中的 JavaScript 客户端使用，因此可以作为单页
            应用程序的一部分。由于 RPC 框架依赖于生成的桩和二进制消息传递，因此它们与 JavaScript 生态系统融合得不好。
        </li>
        <li>
            REST 使功能涉及网络时变得显而易见。这有助于避免 Martin Fowler 提出的<a
                href="https://martinfowler.com/articles/distributed-objects-microservices.html">分布式
            对象反模式</a>。当团队在不考虑将本地过程调用远程化的性能和可靠性影响的情况下，将其面向对象设计拆分为两块或更多块时，就会发生这种情况。
        </li>
        <li>
            REST API 建立在一系列约定之上，这些约定使其相对易于创建、文档化、
            监控、调试和测试。有一个庞大的工具生态系统来支持这一点。
        </li>
    </list>
    <p>
        这些权衡意味着 Kotlin RPC 最适合在两种场景中使用。首先，在使用 <a
            href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 的 KMP 客户端中；其次，
        在云中协作的微服务之间。Kotlin/Wasm</a> 的未来发展可能会使 <code>kotlinx.rpc</code>
        更适用于基于浏览器的应用程序。
    </p>
</chapter>
<chapter title="Kotlin RPC vs. Google RPC" id="kotlin-rpc-vs-google-rpc">
    <p>
        Google RPC 是目前软件行业中占主导地位的 RPC 技术。一个名为 Protocol
        Buffers (protobuf) 的标准用于使用与语言无关的接口定义语言 (IDL) 来定义数据结构和消息负载。这些 IDL 定义可以转换为各种编程
        语言，并使用紧凑高效的二进制格式进行序列化。像 Quarkus 和 Micronaut 这样的微服务框架已经支持 gRPC。
    </p>
    <p>
        Kotlin RPC 很难与 gRPC 竞争，而且这也不会给 Kotlin 社区带来任何好处。
        谢天谢地，目前没有这样的计划。相反，其意图是让 kotlinx.rpc 与 gRPC 兼容并互操作。
        kotlinx.rpc 服务将有可能使用 gRPC 作为其网络协议，并且 kotlinx.rpc 客户端
        可以调用 gRPC 服务。<code>kotlinx.rpc</code> 将使用<a
            href="https://kotlin.github.io/kotlinx-rpc/transport.html">自己的 kRPC 协议</a>作为默认
        选项（如我们当前示例所示），但没有任何会阻止您选择 gRPC。
    </p>
</chapter>
<chapter title="后续步骤" id="next-steps">
    <p>
        Kotlin RPC 在新的方向上扩展了 Kotlin 生态系统，为创建和消费服务提供了 REST 和 GraphQL 的替代方案。它建立在经过验证的库和框架之上，例如 Ktor、Coroutines
        和 <code>kotlinx-serialization</code>。对于寻求利用 Kotlin Multiplatform 和 Compose Multiplatform 的团队，它将为分布式消息传递提供一个简单高效的选项。
    </p>
    <p>
        如果本介绍激起了您的兴趣，请务必查看
        <a href="https://kotlin.github.io/kotlinx-rpc/get-started.html">官方的 <code>kotlinx.rpc</code>
        文档</a>和<a
            href="https://github.com/Kotlin/kotlinx-rpc/tree/main/samples">示例</a>。
    </p>
    <p>
        <code>kotlinx.rpc</code>
        库仍处于早期阶段，因此我们鼓励您探索它并分享您的反馈。
        Bug 和功能请求可以在 <a href="https://youtrack.jetbrains.com/issues/KRPC">YouTrack</a> 上找到，
        而一般性讨论则在 <a
            href="https://kotlinlang.slack.com/archives/C072YJ3Q91V">Slack</a> 上进行（<a
            href="https://surveys.jetbrains.com/s3/kotlin-slack-sign-up">请求访问</a>）。
    </p>
</chapter>