<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Kotlin RPC 入门" id="tutorial-first-steps-with-kotlin-rpc">
<show-structure for="chapter" depth="2"/>
<web-summary>
    在这份全面的指南中，探索 RPC 的基本原理并深入比较 RPC 与 REST。了解如何使用 Kotlin RPC 创建你的第一个应用程序。
</web-summary>
<link-summary>
    了解如何使用 Kotlin RPC 和 Ktor 创建你的第一个应用程序。
</link-summary>
<card-summary>
    了解如何使用 Kotlin RPC 和 Ktor 创建你的第一个应用程序。
</card-summary>
<tldr>
    <var name="example_name" value="tutorial-kotlin-rpc-app"/>
    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    <p>
        <b>使用的插件</b>: <Links href="/ktor/server-routing" summary="Routing is a core plugin for handling incoming requests in a server application.">Routing</Links>,
        <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>,
        <a href="https://github.com/Kotlin/kotlinx-rpc">kotlinx.rpc</a>
    </p>
</tldr>
<p>
    Kotlin RPC (Remote Procedure Call，远程过程调用) 是 Kotlin 生态系统激动人心的新增成员，它构建于稳固的基础之上，并基于 <code>kotlinx.rpc</code> 库运行。
</p>
<p>
    <code>kotlinx.rpc</code> 库使你能够仅使用常规的 Kotlin 语言构造，即可跨网络边界发起过程调用。因此，它提供了 REST 和 Google RPC (gRPC) 的替代方案。
</p>
<p>
    在本文中，我们将介绍 Kotlin RPC 的核心概念并构建一个简单的应用程序。你随后可以在你自己的项目中求值该库。
</p>
<chapter title="前提" id="prerequisites">
    <p>
        本教程假定你对 Kotlin 编程有基本理解。如果你是 Kotlin 新手，请考虑审阅一些<a href="https://kotlinlang.org/docs/getting-started.html">入门材料</a>。
    </p>
    <p>为了获得最佳体验，我们建议使用 <a
            href="https://www.jetbrains.com/idea/download">IntelliJ
        IDEA Ultimate</a> 作为你的集成开发环境 (IDE)，因为它提供了全面的支持和工具，将提高你的生产力。
    </p>
</chapter>
<chapter title="什么是 RPC？" id="what-is-rpc">
    <chapter title="本地过程调用与远程过程调用" id="local-vs-remote">
        <p>
            任何有编程经验的人都会熟悉过程调用的概念。这是任何编程语言中的基本概念。从技术上讲，这些是本地过程调用，因为它们始终发生在同一个程序中。
        </p>
        <p>
            远程过程调用是指函数调用和参数通过某种方式在网络上传输，以便实现可以在单独的 VM/可执行文件内发生。返回值则沿相反路径传回发起调用的机器。
        </p>
        <p>
            最简单的想法是，将发生调用的机器视为客户端，将实现驻留的机器视为服务器。然而，情况并非一定如此。RPC 调用可以双向发生，作为对等架构的一部分。但为了保持简单，我们假设采用客户端/服务器部署。
        </p>
    </chapter>
    <chapter title="RPC 框架基础" id="rpc-framework-fundamentals">
        <p>
            任何 RPC 框架都必须提供某些基本要素。在传统 IT 基础设施中实现远程过程调用时，这些是必不可少的。术语可能不同，职责划分也可能不同，但每个 RPC 框架都必须提供：
        </p>
        <list type="decimal">
            <li>
                声明将远程调用的过程的方式。在面向对象编程中，接口是逻辑选择。这可以是当前语言提供的接口构造，也可以是某种语言中立标准，例如 <a
                    href="https://webidl.spec.whatwg.org/">W3C 使用的 Web IDL</a>。
            </li>
            <li>
                指定用于参数和返回值的类型的方式。同样，你可以使用语言中立标准。然而，在当前语言中标注标准数据类型声明可能更简单。
            </li>
            <li>
                辅助类，称为 <format style="italic">客户端存根</format>，它们将用于将过程调用转换为可在网络上传输的格式，并解包生成的返回值。这些存根可以在编译期或在运行时动态创建。
            </li>
            <li>
                底层 <format style="italic">RPC 运行时</format>，它管理辅助类并监督远程过程调用的生命周期。在服务器端，此运行时需要嵌入到某种服务器中，以便它能够持续处理请求。
            </li>
            <li>
                需要选择（或定义）协议来表示被调用的过程、序列化发送的数据以及在网络上传输信息。过去，一些技术从头定义了新协议（CORBA 中的 IIOP），而另一些则专注于重用（SOAP 中的 HTTP POST）。
            </li>
        </list>
    </chapter>
    <chapter title="编组与序列化" id="marshaling-vs-serialization">
        <p>
            在 RPC 框架中，我们谈论 <format style="italic">编组</format> 和 <format style="italic">解组</format>。这是打包和解包要在网络上传输的信息的过程。它可以被认为是序列化的超集。在编组中，我们序列化对象，但我们还需要打包有关被调用的过程和调用发生上下文的信息。
        </p>
    </chapter>
    <p>
        介绍了 RPC 的核心概念后，让我们通过构建一个示例应用程序来了解它们如何在 <code>kotlinx.rpc</code> 中应用。
    </p>
</chapter>
<chapter title="你好，kotlinx.rpc" id="hello-kotlinx-rpc">
    <p>
        让我们创建一个通过网络订购披萨的应用程序。为了使代码尽可能简单，我们将使用基于控制台的客户端。
    </p>
    <chapter title="创建项目" id="create-project">
        <p>首先，你将创建一个包含客户端和服务器实现的项目。</p>
        <p>
            在更复杂的应用程序中，最佳实践是为客户端和服务器使用独立模块。然而，为了本教程的简单起见，我们将为两者使用一个单一模块。
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
                    或者，从主菜单中选择 <ui-path>File | New | Project</ui-path>。
                </p>
            </step>
            <step>
                在 <control>Name</control> 字段中，输入 <Path>KotlinRpcPizzaApp</Path> 作为你项目的名称。
                <img src="tutorial_kotlin_rpc_intellij_project.png" alt="IntelliJ New Kotlin Project window"
                     style="block" width="706" border-effect="rounded"/>
            </step>
            <step>
                保留其余默认设置，然后点击 <control>Create</control>。
            </step>
        </procedure>
        <p>
            通常，你会立即配置项目构建文件。然而，那是一个不会提高你对技术理解的实现细节，所以我们最后再回到那一步。
        </p>
    </chapter>
    <chapter title="添加共享类型" id="shared-types">
        <p>
            任何 RPC 项目的核心都是定义远程调用过程的接口，以及这些过程定义中使用的类型。
        </p>
        <p>
            在多模块项目中，这些类型需要共享。然而，在此示例中，此步骤不是必需的。
        </p>
        <procedure id="shared-types-procedure">
            <step>
                导航到 <Path>src/main/kotlin</Path> 文件夹并创建一个名为 <Path>model</Path> 的新子包。
            </step>
            <step>
                在 <Path>model</Path> 包内，创建一个新的 <Path>PizzaShop.kt</Path> 文件，其实现如下：
                <code-block lang="kotlin" code="package com.example.model&#10;&#10;import kotlinx.coroutines.flow.Flow&#10;import kotlinx.serialization.Serializable&#10;import kotlinx.rpc.annotations.Rpc&#10;&#10;@Rpc&#10;interface PizzaShop {&#10;    suspend fun orderPizza(pizza: Pizza): Receipt&#10;}&#10;&#10;@Serializable&#10;class Pizza(val name: String)&#10;&#10;@Serializable&#10;class Receipt(val amount: Double)"/>
                <p>
                    该接口需要包含来自 <code>kotlinx.rpc</code> 库的 <code>@Rpc</code> 注解。
                </p>
                <p>
                    因为你正在使用 <a href="https://github.com/Kotlin/kotlinx.serialization"><code>kotlinx.serialization</code></a>
                    来帮助在网络上传输信息，所以参数中使用的类型必须标记有 <code>Serializable</code> 注解。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="实现客户端" id="client-implementation">
        <procedure id="client-impl-procedure">
            <step>
                导航到 <Path>src/main/kotlin</Path> 并创建一个新的 <Path>Client.kt</Path> 文件。
            </step>
            <step>
                打开 <Path>Client.kt</Path> 并添加以下实现：
                <code-block lang="kotlin" code="package com.example&#10;&#10;import com.example.model.Pizza&#10;import com.example.model.PizzaShop&#10;import io.ktor.client.*&#10;import io.ktor.http.*&#10;import kotlinx.coroutines.runBlocking&#10;import kotlinx.rpc.withService&#10;import kotlinx.rpc.krpc.serialization.json.json&#10;import kotlinx.rpc.krpc.ktor.client.KtorRpcClient&#10;import kotlinx.rpc.krpc.ktor.client.installKrpc&#10;import kotlinx.rpc.krpc.ktor.client.rpc&#10;import kotlinx.rpc.krpc.ktor.client.rpcConfig&#10;&#10;fun main() = runBlocking {&#10;    val ktorClient = HttpClient {&#10;        installKrpc {&#10;            waitForServices = true&#10;        }&#10;    }&#10;&#10;    val client: KtorRpcClient = ktorClient.rpc {&#10;        url {&#10;            host = &quot;localhost&quot;&#10;            port = 8080&#10;            encodedPath = &quot;pizza&quot;&#10;        }&#10;&#10;        rpcConfig {&#10;            serialization {&#10;                json()&#10;            }&#10;        }&#10;    }&#10;&#10;    val pizzaShop: PizzaShop = client.withService&lt;PizzaShop&gt;()&#10;&#10;    val receipt = pizzaShop.orderPizza(Pizza(&quot;Pepperoni&quot;))&#10;    println(&quot;Your pizza cost ${receipt.amount}&quot;)&#10;    ktorClient.close()&#10;}"/>
            </step>
        </procedure>
        <p>
            你只需要 25 行代码即可为执行 RPC 调用做准备并实际执行。显然，这其中发生了很多事情，所以让我们将代码分解成几个部分。
        </p>
        <p>
            <code>kotlinx.rpc</code> 库使用 <Links href="/ktor/client-create-new-application" summary="Create your first client application for sending a request and receiving a response.">Ktor 客户端</Links> 来在客户端托管其运行时。该运行时不与 Ktor 耦合，也可以选择其他方案，但这促进了重用，并使得 <code>kotlinx.rpc</code> 易于集成到现有 KMP 应用程序中。
        </p>
        <p>
            Ktor 客户端和 Kotlin RPC 都基于协程构建，因此你使用 <code>runBlocking</code> 来创建初始协程，并在其中执行客户端的其余部分：
        </p>
        <code-block lang="kotlin" code="fun main() = runBlocking {&#10;}"/>
        <tip>
            请注意，<code>runBlocking</code> 专为快速原型和测试设计，而非生产代码。
        </tip>
        <p>
            接下来，你以标准方式创建 Ktor 客户端实例。<code>kotlinx.rpc</code> 在底层使用 <Links href="/ktor/client-websockets" summary="The Websockets plugin allows you to create a multi-way communication session between a server and a client.">WebSockets</Links> 插件来传输信息。你只需要通过使用 <code>installKrpc()</code> 函数确保其被加载：
        </p>
        <code-block lang="kotlin" code="    val ktorClient = HttpClient {&#10;        installKrpc {&#10;            waitForServices = true&#10;        }&#10;    }"/>
        <p>
            创建此 Ktor 客户端后，你将创建一个 <code>KtorRpcClient</code> 对象来调用远程过程。你需要配置服务器的位置以及用于传输信息的机制：
        </p>
        <code-block lang="kotlin" code="    val client: KtorRpcClient = ktorClient.rpc {&#10;        url {&#10;            host = &quot;localhost&quot;&#10;            port = 8080&#10;            encodedPath = &quot;pizza&quot;&#10;        }&#10;&#10;        rpcConfig {&#10;            serialization {&#10;                json()&#10;            }&#10;        }&#10;    }"/>
        <p>
            至此，标准设置已完成，你已准备好使用问题域特有的功能。你可以使用客户端创建一个实现 <code>PizzaShop</code> 接口方法的客户端代理对象：
        </p>
        <code-block lang="kotlin"
                    include-symbol="pizzaShop" code="package com.example&#10;&#10;import com.example.model.Pizza&#10;import com.example.model.PizzaShop&#10;import io.ktor.client.*&#10;import io.ktor.http.*&#10;import kotlinx.coroutines.runBlocking&#10;import kotlinx.rpc.withService&#10;import kotlinx.rpc.krpc.serialization.json.json&#10;import kotlinx.rpc.krpc.ktor.client.KtorRpcClient&#10;import kotlinx.rpc.krpc.ktor.client.installKrpc&#10;import kotlinx.rpc.krpc.ktor.client.rpc&#10;import kotlinx.rpc.krpc.ktor.client.rpcConfig&#10;&#10;fun main() = runBlocking {&#10;    val ktorClient = HttpClient {&#10;        installKrpc {&#10;            waitForServices = true&#10;        }&#10;    }&#10;&#10;    val client: KtorRpcClient = ktorClient.rpc {&#10;        url {&#10;            host = &quot;localhost&quot;&#10;            port = 8080&#10;            encodedPath = &quot;pizza&quot;&#10;        }&#10;&#10;        rpcConfig {&#10;            serialization {&#10;                json()&#10;            }&#10;        }&#10;    }&#10;&#10;    val pizzaShop: PizzaShop = client.withService&lt;PizzaShop&gt;()&#10;&#10;    /*&#10;    val receipt = pizzaShop.orderPizza(Pizza(&quot;Pepperoni&quot;))&#10;    println(&quot;Your pizza cost ${receipt.amount}&quot;)&#10;    */&#10;&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Pepperoni&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Hawaiian&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Calzone&quot;))&#10;&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Margherita&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Sicilian&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;California&quot;))&#10;&#10;    pizzaShop.viewOrders(&quot;AB12&quot;).collect {&#10;        println(&quot;AB12 ordered ${it.name}&quot;)&#10;    }&#10;&#10;    pizzaShop.viewOrders(&quot;CD34&quot;).collect {&#10;        println(&quot;CD34 ordered ${it.name}&quot;)&#10;    }&#10;&#10;    ktorClient.close()&#10;}"/>
        <p>
            然后你可以发起远程过程调用并使用结果：
        </p>
        <code-block lang="kotlin" code="    val receipt = pizzaShop.orderPizza(Pizza(&quot;Pepperoni&quot;))&#10;    println(&quot;Your pizza cost ${receipt.amount}&quot;)"/>
        <p>
            请注意，在这一点上为你完成了大量工作。调用的细节和所有参数都必须转换为消息，通过网络发送，然后接收并解码返回值。这种透明的发生方式是初始设置的回报。
        </p>
        <p>
            最后，我们需要像往常一样关闭客户端：
        </p>
        <code-block lang="kotlin" code="    ktorClient.close()"/>
    </chapter>
    <chapter title="实现服务器" id="server-implementation">
        <p>
            服务器端的实现分为两部分。首先，你需要创建我们接口的一个实现；其次，你需要将其托管在服务器中。
        </p>
        <procedure id="create-interface">
            <step>
                导航到 <Path>src/main/kotlin</Path> 并创建一个新的 <Path>Server.kt</Path> 文件。
            </step>
            <step>
                打开 <Path>Server.kt</Path> 并添加以下实现：
                <code-block lang="kotlin" code="package com.example&#10;&#10;import com.example.model.*&#10;import io.ktor.server.application.*&#10;&#10;class PizzaShopImpl : PizzaShop {&#10;    override suspend fun orderPizza(pizza: Pizza): Receipt {&#10;        return Receipt(7.89)&#10;    }&#10;}"/>
                <p>
                    显然，这不是一个真实世界的实现，但它足以让我们的演示运行起来。
                </p>
                <p>
                    实现的第二部分基于 Ktor 构建。
                </p>
            </step>
            <step>
                <p>
                    将以下代码添加到同一个文件中：
                </p>
                <code-block lang="kotlin" code="fun main() {&#10;    embeddedServer(Netty, port = 8080) {&#10;        module()&#10;        println(&quot;Server running&quot;)&#10;    }.start(wait = true)&#10;}&#10;&#10;fun Application.module() {&#10;    install(Krpc)&#10;&#10;    routing {&#10;        rpc(&quot;/pizza&quot;) {&#10;            rpcConfig {&#10;                serialization {&#10;                    json()&#10;                }&#10;            }&#10;&#10;            registerService&lt;PizzaShop&gt; { PizzaShopImpl() }&#10;        }&#10;    }&#10;}"/>
                <p>以下是详细说明：</p>
                <p>
                    首先，你创建 Ktor/Netty 实例，并使用指定的扩展函数进行配置：
                </p>
                <code-block lang="kotlin" code="    embeddedServer(Netty, port = 8080) {&#10;        module()&#10;        println(&quot;Server running&quot;)&#10;    }.start(wait = true)"/>
                <p>
                    然后，你声明一个扩展 Ktor Application 类型的设置函数。此函数安装 <code>kotlinx.rpc</code> 插件并声明一个或多个路由：
                </p>
                <code-block lang="kotlin" code="fun Application.module() {&#10;    install(Krpc)&#10;&#10;    routing {&#10;    }&#10;}"/>
                <p>
                    在路由部分中，你使用 <code>kotlinx.rpc</code> 对 Ktor Routing DSL 的扩展来声明一个端点。与客户端一样，你指定 URL 并配置序列化。但在此情况下，我们的实现将监听该 URL 以处理传入请求：
                </p>
                <code-block lang="kotlin" code="        rpc(&quot;/pizza&quot;) {&#10;            rpcConfig {&#10;                serialization {&#10;                    json()&#10;                }&#10;            }&#10;&#10;            registerService&lt;PizzaShop&gt; { PizzaShopImpl() }&#10;        }"/>
                <p>
                    请注意，你使用 <code>registerService</code> 将接口的实现提供给 RPC 运行时。你可能希望有多个实例，但这是后续文章的主题。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="添加依赖项" id="add-dependencies">
        <p>
            你现在已经拥有运行应用程序所需的所有代码，但目前它甚至无法编译，更不用说执行了。
            你可以使用 Ktor 项目生成器配合 <a href="https://start.ktor.io/p/kotlinx-rpc">kotlinx.rpc</a> 插件，
            或者你可以手动配置构建文件。这也不是太复杂。
        </p>
        <procedure id="configure-build-files">
            <step>
                在 <Path>build.gradle.kts</Path> 文件中，添加以下插件：
                <code-block lang="kotlin" code="plugins {&#10;    kotlin(&quot;jvm&quot;) version &quot;2.2.0&quot;&#10;    kotlin(&quot;plugin.serialization&quot;) version &quot;2.2.0&quot;&#10;    id(&quot;io.ktor.plugin&quot;) version &quot;3.2.0&quot;&#10;    id(&quot;org.jetbrains.kotlinx.rpc.plugin&quot;) version &quot;0.9.1&quot;&#10;}"/>
                <p>
                    Kotlin 插件的原因显而易见。至于其他插件，解释如下：
                </p>
                <list>
                    <li>
                        需要 <code>kotlinx.serialization</code> 插件来生成辅助类型，以便将 Kotlin 对象转换为 JSON。请记住，<code>kotlinx.serialization</code> 不使用反射。
                    </li>
                    <li>
                        Ktor 插件用于构建将应用程序及其所有依赖项打包在一起的胖 JAR。
                    </li>
                    <li>
                        需要 RPC 插件来生成客户端的存根。
                    </li>
                </list>
            </step>
            <step>
                添加以下依赖项：
                <code-block lang="kotlin" code="    implementation(&quot;io.ktor:ktor-client-cio-jvm&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-client:0.9.1&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-ktor-client:0.9.1&quot;)&#10;    implementation(&quot;io.ktor:ktor-server-netty-jvm&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-server:0.9.1&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-ktor-server:0.9.1&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-serialization-json:0.9.1&quot;)&#10;    implementation(&quot;ch.qos.logback:logback-classic:1.5.18&quot;)&#10;    testImplementation(kotlin(&quot;test&quot;))&#10;}"/>
                <p>
                    这添加了 Ktor 客户端和服务器，<code>kotlinx.rpc</code> 运行时的客户端和服务器部分，以及用于集成 <code>kotlinx.rpc</code> 和 <code>kotlinx-serialization</code> 的库。
                </p>
                <p>
                    有了这些，你现在就可以运行项目并开始发起 RPC 调用了。
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
                导航到 <Path>Server.kt</Path> 文件。
            </step>
            <step>
                <p>在 IntelliJ IDEA 中，点击 <code>main()</code> 函数旁边的运行按钮
                    (<img src="intellij_idea_gutter_icon.svg"
                          style="inline" height="16" width="16"
                          alt="intelliJ IDEA run icon"/>)
                    以启动应用程序。</p>
                <p>
                    你应该在 <control>Run</control> 工具面板中看到以下输出：
                </p>
                <img src="tutorial_kotlin_rpc_run_server.png" alt="Run server output in intelliJ IDEA"
                     style="block" width="706" border-effect="line"/>
            </step>
            <step>
                导航到 <Path>Client.kt</Path> 文件并运行应用程序。你应该在控制台中看到以下输出：
                <code-block lang="shell" code="                        Your pizza cost 7.89&#10;&#10;                        Process finished with exit code 0"/>
            </step>
        </procedure>
    </chapter>
</chapter>
<chapter title="扩展示例" id="extend-the-example">
    <p>
        最后，让我们增加示例应用程序的复杂性，为未来的开发打下坚实基础。
    </p>
    <procedure id="extend-server">
        <step>
            在 <Path>PizzaShop.kt</Path> 文件中，通过包含客户端 ID 来扩展 <code>orderPizza</code> 方法，并添加一个 <code>viewOrders</code> 方法，该方法返回指定客户端的所有待处理订单：
            <code-block lang="kotlin" code="package com.example.model&#10;&#10;import kotlinx.coroutines.flow.Flow&#10;import kotlinx.serialization.Serializable&#10;import kotlinx.rpc.annotations.Rpc&#10;&#10;@Rpc&#10;interface PizzaShop {&#10;    suspend fun orderPizza(clientID: String, pizza: Pizza): Receipt&#10;    fun viewOrders(clientID: String): Flow&lt;Pizza&gt;&#10;}"/>
            <p>
                你可以通过返回一个 <code>Flow</code> 而不是 <code>List</code> 或 <code>Set</code> 来利用协程库。这将允许你一次一片地将信息流式传输到客户端。
            </p>
        </step>
        <step>
            导航到 <Path>Server.kt</Path> 文件，并通过将当前订单存储在 `map` of `list` 中来实现此功能：
            <code-block lang="kotlin" code="class PizzaShopImpl : PizzaShop {&#10;    private val openOrders = mutableMapOf&lt;String, MutableList&lt;Pizza&gt;&gt;()&#10;&#10;    override suspend fun orderPizza(clientID: String, pizza: Pizza): Receipt {&#10;        if(openOrders.containsKey(clientID)) {&#10;            openOrders[clientID]?.add(pizza)&#10;        } else {&#10;            openOrders[clientID] = mutableListOf(pizza)&#10;        }&#10;        return Receipt(3.45)&#10;    }&#10;&#10;    override fun viewOrders(clientID: String): Flow&lt;Pizza&gt; {&#10;        val orders = openOrders[clientID]&#10;        if (orders != null) {&#10;            return flow {&#10;                for (order in orders) {&#10;                    emit(order)&#10;                    delay(1000)&#10;                }&#10;            }&#10;        }&#10;        return flow {}&#10;    }&#10;}"/>
            <p>
                请注意，每个客户端实例都会创建一个新的 <code>PizzaShopImpl</code> 实例。这通过隔离它们的状态来避免客户端之间的冲突。但是，它不解决单个服务器实例内的线程安全问题，特别是当多个服务并发访问同一实例时。
            </p>
        </step>
        <step>
            在 <Path>Client.kt</Path> 文件中，使用两个不同的客户端 ID 提交多个订单：
            <code-block lang="kotlin" code="    val pizzaShop: PizzaShop = client.withService&lt;PizzaShop&gt;()&#10;&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Pepperoni&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Hawaiian&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Calzone&quot;))&#10;&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Margherita&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Sicilian&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;California&quot;))"/>
            <p>
                然后，你使用 Coroutines 库和 <code>collect</code> 方法迭代结果：
            </p>
            <code-block lang="kotlin" code="    pizzaShop.viewOrders(&quot;AB12&quot;).collect {&#10;        println(&quot;AB12 ordered ${it.name}&quot;)&#10;    }&#10;&#10;    pizzaShop.viewOrders(&quot;CD34&quot;).collect {&#10;        println(&quot;CD34 ordered ${it.name}&quot;)&#10;    }"/>
        </step>
        <step>
            运行服务器和客户端。当你运行客户端时，你将看到结果递增地显示：
            <img src="tutorial_kotlin_rpc_run_client.gif" alt="Client output incrementally displaying results"
                 style="block" width="706" border-effect="line"/>
        </step>
    </procedure>
    <p>
        创建了一个工作示例后，现在让我们深入探讨一切是如何运作的。特别是，让我们比较和对比 Kotlin RPC 与两个主要替代方案——REST 和 gRPC。
    </p>
</chapter>
<chapter title="RPC 与 REST" id="rpc-vs-rest">
    <p>
        RPC 的概念比 REST 早得多，<a
            href="https://en.wikipedia.org/wiki/Remote_procedure_call">至少可以追溯到 1981 年</a>。与 REST 相比，基于 RPC 的方法不限制你使用统一接口（例如 HTTP 请求类型），在代码中更易于使用，并且由于二进制消息传递而具有更高的性能。
    </p>
    <p>
        然而，REST 有三个主要优势：
    </p>
    <list type="decimal">
        <li>
            它可以直接由浏览器中的 JavaScript 客户端使用，因此可以作为单页应用程序的一部分。由于 RPC 框架依赖于生成的存根和二进制消息传递，它们与 JavaScript 生态系统不太兼容。
        </li>
        <li>
            当特性涉及网络时，REST 会使其显而易见。这有助于避免 Martin Fowler 指出的<a
                href="https://martinfowler.com/articles/distributed-objects-microservices.html">分布式对象反模式</a>。当团队将其面向对象设计拆分为两个或多个部分，而未考虑将本地过程调用变为远程调用所带来的性能和可靠性影响时，就会发生这种情况。
        </li>
        <li>
            REST API 基于一系列约定构建，这些约定使其相对容易创建、文档化、监控、调试和测试。有一个庞大的工具生态系统来支持这一点。
        </li>
    </list>
    <p>
        这些权衡意味着 Kotlin RPC 最适合在两种场景中使用。首先，是在使用 Compose Multiplatform 的 KMP 客户端中；其次，是在云中协作的微服务之间。Kotlin/Wasm 的未来发展可能会使 <code>kotlinx.rpc</code> 更适用于基于浏览器的应用程序。
    </p>
</chapter>
<chapter title="Kotlin RPC 与 Google RPC" id="kotlin-rpc-vs-google-rpc">
    <p>
        Google RPC 是目前软件行业中主导的 RPC 技术。一种名为 Protocol Buffers (protobuf) 的标准用于使用语言中立的接口定义语言 (IDL) 定义数据结构和消息负载。这些 IDL 定义可以转换为各种编程语言，并使用紧凑高效的二进制格式进行序列化。Quarkus 和 Micronaut 等微服务框架已经支持 gRPC。
    </p>
    <p>
        Kotlin RPC 很难与 gRPC 竞争，这对 Kotlin 社区也没有益处。幸好，目前没有这方面的计划。相反，其意图是让 <code>kotlinx.rpc</code> 与 gRPC 兼容且可互操作。<code>kotlinx.rpc</code> 服务将能够使用 gRPC 作为其网络协议，而 <code>kotlinx.rpc</code> 客户端将能够调用 gRPC 服务。<code>kotlinx.rpc</code> 将使用其自己的 kRPC 协议作为默认选项（如我们当前示例所示），但没有什么能阻止你选择 gRPC。
    </p>
</chapter>
<chapter title="后续步骤" id="next-steps">
    <p>
        Kotlin RPC 将 Kotlin 生态系统扩展到新方向，为创建和使用服务提供了 REST 和 GraphQL 的替代方案。它基于 Ktor、协程和 <code>kotlinx-serialization</code> 等成熟的库和框架构建。对于希望利用 Kotlin Multiplatform 和 Compose Multiplatform 的团队，它将为分布式消息传递提供一个简单高效的选项。
    </p>
    <p>
        如果本介绍激发了你的兴趣，请务必查看 <a href="https://kotlin.github.io/kotlinx-rpc/get-started.html">官方的 <code>kotlinx.rpc</code> 文档</a>和<a
            href="https://github.com/Kotlin/kotlinx-rpc/tree/main/samples">示例</a>。
    </p>
    <p>
        <code>kotlinx.rpc</code> 库尚处于早期阶段，因此我们鼓励你探索它并分享你的反馈。错误和特性请求可以在 <a href="https://youtrack.jetbrains.com/issues/KRPC">YouTrack</a> 上找到，而一般性讨论则在 <a
            href="https://kotlinlang.slack.com/archives/C072YJ3Q91V">Slack</a> 上进行（<a
            href="https://surveys.jetbrains.com/s3/kotlin-slack-sign-up">请求访问</a>）。
    </p>
</chapter>
</topic>