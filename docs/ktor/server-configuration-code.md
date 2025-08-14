<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="代码中的配置"
       id="server-configuration-code" help-id="Configuration-code;server-configuration-in-code">
<show-structure for="chapter"/>
<link-summary>
        了解如何在代码中配置各种服务器参数。
</link-summary>
<p>
        Ktor 允许您直接在代码中配置各种服务器参数，包括主机地址、端口、<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">服务器模块</Links>等。配置方法取决于您设置服务器的方式 — 使用 <Links href="/ktor/server-create-and-configure" summary="了解如何根据应用程序部署需求创建服务器。">embeddedServer 或 EngineMain</Links>。
</p>
<p>
        通过 <code>embeddedServer</code>，您可以通过将所需实参直接传递给函数来配置服务器。<a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html">embeddedServer</a> 函数接受不同的形参来配置服务器，包括 <Links href="/ktor/server-engines" summary="了解处理网络请求的引擎。">服务器引擎</Links>、服务器监听的主机和端口，以及其他配置。
</p>
<p>
        在本节中，我们将查看运行 <code>embeddedServer</code> 的几个不同示例，说明如何配置服务器以发挥其优势。
</p>
<chapter title="基本配置" id="embedded-basic">
        <p>
            下面的代码片段展示了一个使用 Netty 引擎和 <code>8080</code> 端口的基本服务器设置。
        </p>
        [object Promise]
        <p>
            请注意，您可以将 <code>port</code> 形参设置为 <code>0</code> 以在随机端口上运行服务器。<code>embeddedServer</code> 函数返回一个引擎实例，因此您可以使用 <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/resolved-connectors.html">ApplicationEngine.resolvedConnectors</a> 函数在代码中获取端口值。
        </p>
</chapter>
<chapter title="引擎配置" id="embedded-engine">
        <snippet id="embedded-engine-configuration">
            <p>
                <code>embeddedServer</code> 函数允许您使用 <code>configure</code> 形参传递引擎特有的选项。此形参包含所有引擎通用的选项，并由 <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">ApplicationEngine.Configuration</a> 类暴露。
            </p>
            <p>
                下面的示例展示了如何使用 <code>Netty</code> 引擎配置服务器。在 <code>configure</code> 代码块中，我们定义一个 <code>connector</code> 以指定主机和端口，并自定义各种服务器参数：
            </p>
            [object Promise]
            <p>
                <code>connectors.add()</code> 方法定义了一个带有指定主机 (<code>127.0.0.1</code>) 和端口 (<code>8080</code>) 的 connector。
            </p>
            <p>除了这些选项，您还可以配置其他引擎特有的属性。</p>
            <chapter title="Netty" id="netty-code">
                <p>
                    Netty 特有的选项由 <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html">NettyApplicationEngine.Configuration</a> 类暴露。
                </p>
                [object Promise]
            </chapter>
            <chapter title="Jetty" id="jetty-code">
                <p>
                    Jetty 特有的选项由 <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html">JettyApplicationEngineBase.Configuration</a> 类暴露。
                </p>
                <p>您可以在 <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html">configureServer</a> 代码块中配置 Jetty 服务器，该代码块提供了对 <a href="https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html">Server</a> 实例的访问。
                </p>
                <p>
                    使用 <code>idleTimeout</code> 属性指定连接在关闭之前可以空闲的时长。
                </p>
                [object Promise]
            </chapter>
            <chapter title="CIO" id="cio-code">
                <p>CIO 特有的选项由 <a href="https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html">CIOApplicationEngine.Configuration</a> 类暴露。
                </p>
                [object Promise]
            </chapter>
            <chapter title="Tomcat" id="tomcat-code">
                <p>如果您使用 Tomcat 作为引擎，则可以使用 <a href="https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html">configureTomcat</a> 属性对其进行配置，该属性提供了对 <a href="https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html">Tomcat</a> 实例的访问。
                </p>
                [object Promise]
            </chapter>
        </snippet>
</chapter>
<chapter title="自定义环境" id="embedded-custom">
        <p>
            下面的示例展示了如何使用由 <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">ApplicationEngine.Configuration</a> 类表示的自定义配置来运行具有多个连接器端点的服务器。
        </p>
        [object Promise]
        <p>
            有关完整示例，请参见 <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-multiple-connectors">embedded-server-multiple-connectors</a>。
        </p>
        <tip>
            <p>
                您还可以使用自定义环境来<a href="#embedded-server">提供 HTTPS 服务</a>。
            </p>
        </tip>
</chapter>
<chapter id="command-line" title="命令行配置">
        <p>
            Ktor 允许您使用命令行实参动态配置 <code>embeddedServer</code>。这在需要运行时指定端口、主机或超时等配置的情况下特别有用。
        </p>
        <p>
            为此，请使用 <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-command-line-config.html">CommandLineConfig</a> 类将命令行实参解析为配置对象，并在配置代码块中传递它：
        </p>
        [object Promise]
        <p>
            在此示例中，<code>Application.Configuration</code> 中的 <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/take-from.html"><code>takeFrom()</code></a> 函数用于覆盖引擎配置值，例如 <code>port</code> 和 <code>host</code>。<a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/load-common-configuration.html"><code>loadCommonConfiguration()</code></a> 函数从根环境加载配置，例如超时。
        </p>
        <p>
            要运行服务器，请通过以下方式指定实参：
        </p>
        [object Promise]
        <tip>
            对于静态配置，您可以使用配置文件或环境变量。了解更多信息，请参见<a href="#command-line">文件中的配置</a>。
        </tip>
</chapter>
</topic>