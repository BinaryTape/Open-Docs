<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="创建服务器"
       id="server-create-and-configure" help-id="start_server;create_server">
<show-structure for="chapter" depth="2"/>
<tldr>
    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">embedded-server</a>,
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>,
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-yaml">engine-main-yaml</a>
    </p>
</tldr>
<link-summary>
    了解如何根据您的应用程序部署需求创建服务器。
</link-summary>
<p>
    在创建 Ktor 应用程序之前，您需要考虑应用程序将如何
    <Links href="/ktor/server-deployment" summary="代码示例:
        %example_name%">
        部署
    </Links>
    :
</p>
<list>
    <li>
        <p>
            作为
            <control><a href="#embedded">自包含包</a></control>
        </p>
        <p>
            在这种情况下，用于处理网络请求的应用程序<Links href="/ktor/server-engines" summary="了解用于处理网络请求的引擎。">引擎</Links>应成为您应用程序的一部分。
            您的应用程序可以控制引擎设置、连接和 SSL 选项。
        </p>
    </li>
    <li>
        <p>
            作为
            <control>
                <a href="#servlet">servlet</a>
            </control>
        </p>
        <p>
            在这种情况下，Ktor 应用程序可以部署在 servlet 容器（例如 Tomcat 或 Jetty）中，该容器控制应用程序生命周期和连接设置。
        </p>
    </li>
</list>
<chapter title="自包含包" id="embedded">
    <p>
        要将 Ktor 服务器应用程序作为自包含包交付，您需要首先创建服务器。
        服务器配置可以包含不同的设置：
        一个服务器<Links href="/ktor/server-engines" summary="了解用于处理网络请求的引擎。">引擎</Links>（例如 Netty、Jetty 等）、
        各种引擎特有的选项、主机和端口值等等。
        在 Ktor 中创建和运行服务器有两种主要方法：
    </p>
    <list>
        <li>
            <p>
                <code>embeddedServer</code> 函数是一种简单的方式，可以
                <a href="#embedded-server">
                    在代码中配置服务器参数
                </a>
                并快速运行应用程序。
            </p>
        </li>
        <li>
            <p>
                <code>EngineMain</code> 提供了更大的灵活性来配置服务器。您可以
                <a href="#engine-main">
                    在文件中指定服务器参数
                </a>
                并且无需重新编译您的应用程序即可更改配置。此外，您可以从命令行运行应用程序，并通过传递相应的命令行实参来覆盖所需的服务器参数。
            </p>
        </li>
    </list>
    <chapter title="代码中的配置" id="embedded-server">
        <p>
            <code>embeddedServer</code> 函数是一种简单的方式，可以在
            <Links href="/ktor/server-configuration-code" summary="了解如何在代码中配置各种服务器参数。">代码</Links>
            中配置服务器参数并快速运行应用程序。在下面的代码片段中，它接受一个
            <Links href="/ktor/server-engines" summary="了解用于处理网络请求的引擎。">引擎</Links>
            和端口作为形参来启动服务器。在下面的示例中，我们使用
            <code>Netty</code> 引擎运行服务器并监听 <code>8080</code> 端口：
        </p>
        [object Promise]
        <p>
            有关完整示例，请参见
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server">
                embedded-server
            </a>
            .
        </p>
    </chapter>
    <chapter title="文件中的配置" id="engine-main">
        <p>
            <code>EngineMain</code> 使用选定的引擎启动服务器，并加载放置在
            <Path>resources</Path>
            目录中的外部<Links href="/ktor/server-configuration-file" summary="了解如何在配置文件中配置各种服务器参数。">配置文件</Links>中指定的<Links href="/ktor/server-modules" summary="模块允许您通过对路由进行分组来构建应用程序。">应用程序模块</Links>：
            <Path>application.conf</Path>
            或
            <Path>application.yaml</Path>
            .
            除了要加载的模块之外，配置文件还可以包含各种服务器形参（例如，下面示例中的 <code>8080</code> 端口）。
        </p>
        <tabs>
            <tab title="Application.kt" id="application-kt">
                [object Promise]
            </tab>
            <tab title="application.conf" id="application-conf">
                [object Promise]
            </tab>
            <tab title="application.yaml" id="application-yaml">
                [object Promise]
            </tab>
        </tabs>
        <p>
            有关完整示例，请参见
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">
                engine-main
            </a>
            和
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-yaml">
                engine-main-yaml
            </a>
            .
        </p>
    </chapter>
</chapter>
<chapter title="Servlet" id="servlet">
    <p>
        Ktor 应用程序可以在包含 Tomcat 和 Jetty 的 servlet 容器中运行和部署。
        要在 servlet 容器中部署，您需要生成一个
        <Links href="/ktor/server-war" summary="了解如何使用 WAR 归档文件在 servlet 容器中运行和部署 Ktor 应用程序。">WAR</Links>
        归档文件，然后将其部署到支持 WAR 的服务器或云服务。
    </p>
</chapter>
</topic>