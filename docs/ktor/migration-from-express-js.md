<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="从 Express 迁移到 Ktor"
       id="migration-from-express-js" help-id="express-js;migrating-from-express-js">
    <show-structure for="chapter" depth="2"/>
    <link-summary>本指南展示了如何创建、运行和测试一个简单的 Ktor 应用程序。</link-summary>
    <tldr>
        <p>
            <b>代码示例</b>:
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express">migrating-express</a>
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor">migrating-express-ktor</a>
        </p>
    </tldr>
    <p>
        在本指南中，我们将探讨在基本场景下如何将 Express 应用程序迁移到 Ktor：从生成应用程序和编写第一个应用程序，到创建用于扩展应用程序功能的中间件。
    </p>
    <chapter title="生成应用程序" id="generate">
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        你可以使用 <code>express-generator</code> 工具生成一个新的 Express 应用程序：
                    </p>
                    [object Promise]
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor 提供了以下生成应用程序骨架的方式：
                    </p>
                    <list>
                        <li>
                            <p>
                                <a href="https://start.ktor.io/">Ktor 项目生成器</a> — 使用基于 Web 的生成器。
                            </p>
                        </li>
                        <li>
                            <p>
                                <a href="https://github.com/ktorio/ktor-cli">
                                    Ktor CLI 工具
                                </a> — 使用 <code>ktor new</code> 命令通过命令行界面生成 Ktor 项目：
                            </p>
                            [object Promise]
                        </li>
                        <li>
                            <p>
                                <a href="https://www.npmjs.com/package/generator-ktor">
                                    Yeoman 生成器
                                </a>
                                — 交互式地配置项目设置并选择所需的插件：
                            </p>
                            [object Promise]
                        </li>
                        <li>
                            <p>
                                <a href="https://ktor.io/idea/">IntelliJ IDEA Ultimate</a> — 使用内置的 Ktor 项目向导。
                            </p>
                        </li>
                    </list>
                    <p>
                        关于详细说明，请参见<Links href="/ktor/server-create-a-new-project" summary="了解如何使用 Ktor 打开、运行和测试服务器应用程序。">创建、打开和运行新的 Ktor 项目</Links>教程。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="Hello world" id="hello">
        <p>
            在本节中，我们将探讨如何创建最简单的服务器应用程序，它接受 <code>GET</code> 请求并以预定义的纯文本进行响应。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        以下示例展示了 Express 应用程序，它启动一个服务器并在端口
                        <control>3000</control>
                        监听连接。
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/1_hello/app.js">1_hello</a>
                        项目。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        在 Ktor 中，你可以使用 <a href="#embedded-server">embeddedServer</a>
                        函数在代码中配置服务器参数并快速运行应用程序。
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/1_hello/src/main/kotlin/com/example/Application.kt">1_hello</a>
                        项目。
                    </p>
                    <p>
                        你还可以在使用 HOCON 或 YAML 格式的<a href="#engine-main">外部配置文件</a>中指定服务器设置。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            请注意，上面的 Express 应用程序会添加
            <control>Date</control>
            、
            <control>X-Powered-By</control>
            和
            <control>ETag</control>
            响应头，其内容可能如下所示：
        </p>
        [object Promise]
        <p>
            要在 Ktor 中为每个响应添加默认的
            <control>Server</control>
            和
            <control>Date</control>
            头，
            你需要安装 <Links href="/ktor/server-default-headers" summary="所需的依赖项：io.ktor:%artifact_name%
        原生服务器支持：✅">DefaultHeaders</Links> 插件。
            <Links href="/ktor/server-conditional-headers" summary="所需的依赖项：io.ktor:%artifact_name%
        代码示例：
            %example_name%
        原生服务器支持：✅">ConditionalHeaders</Links> 插件可用于配置
            <control>Etag</control>
            响应头。
        </p>
    </chapter>
    <chapter title="提供静态内容服务" id="static">
        <p>
            在本节中，我们将看到如何在 Express 和 Ktor 中提供静态文件服务，例如图像、CSS 文件和 JavaScript 文件。
            假设我们有一个
            <Path>public</Path>
            文件夹，其中包含主
            <Path>index.html</Path>
            页面
            和一组链接的资产。
        </p>
        [object Promise]
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        在 Express 中，将文件夹名称传递给
                        <control>express.static</control>
                        函数。
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/2_static/app.js">2_static</a>
                        项目。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        在 Ktor 中，使用 <a href="#folders"><code>staticFiles()</code></a>
                        函数将对
                        <Path>/</Path>
                        路径的任何请求映射到
                        <Path>public</Path>
                        物理文件夹。
                        此函数支持递归地提供
                        <Path>public</Path>
                        文件夹中的所有文件服务。
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见 <a
                            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/2_static/src/main/kotlin/com/example/Application.kt">2_static</a>
                        项目。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            当提供静态内容服务时，Express 会添加多个响应头，其内容可能如下所示：
        </p>
        [object Promise]
        <p>
            要在 Ktor 中管理这些头，你需要安装以下插件：
        </p>
        <list>
            <li>
                <p>
                    <control>Accept-Ranges</control>
                    : <Links href="/ktor/server-partial-content" summary="所需的依赖项：io.ktor:%artifact_name%
服务器示例：
download-file,
客户端示例：
client-download-file-range
        原生服务器支持：✅">PartialContent</Links>
                </p>
            </li>
            <li>
                <p>
                    <control>Cache-Control</control>
                    : <Links href="/ktor/server-caching-headers" summary="所需的依赖项：io.ktor:%artifact_name%
        代码示例：
            %example_name%
        原生服务器支持：✅">CachingHeaders</Links>
                </p>
            </li>
            <li>
                <p>
                    <control>ETag</control>
                    和
                    <control>Last-Modified</control>
                    :
                    <Links href="/ktor/server-conditional-headers" summary="所需的依赖项：io.ktor:%artifact_name%
        代码示例：
            %example_name%
        原生服务器支持：✅">ConditionalHeaders</Links>
                </p>
            </li>
        </list>
    </chapter>
    <chapter title="路由" id="routing">
        <p>
            <Links href="/ktor/server-routing" summary="路由是服务器应用程序中用于处理传入请求的核心插件。">路由</Links>允许处理发往特定端点的传入请求，
            该端点由特定的 HTTP 请求方法（例如 <code>GET</code>、<code>POST</code> 等）和路径定义。
            以下示例展示了如何处理发往
            <Path>/</Path>
            路径的 <code>GET</code> 和
            <code>POST</code> 请求。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                        项目。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    [object Promise]
                    <tip>
                        <p>
                            关于如何接收
                            <code>POST</code>、<code>PUT</code> 或
                            <code>PATCH</code> 请求的请求体，请参见 undefined。
                        </p>
                    </tip>
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                        项目。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            以下示例演示了如何按路径对路由处理器进行分组。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        在 Express 中，你可以通过使用
                        <code>app.route()</code> 为路由路径创建可链式调用的路由处理器。
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                        项目。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor 提供了一个 <code>route</code> 函数，
                        你可以通过它定义路径，然后将该路径的动词作为嵌套函数放置。
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                        项目。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            这两个框架都允许你将相关路由分组到单个文件中。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        Express 提供了 <code>express.Router</code> 类来创建可挂载的路由处理器。
                        假设我们在应用程序目录中有一个
                        <Path>birds.js</Path>
                        路由文件。
                        这个路由模块可以像
                        <Path>app.js</Path>
                        中所示那样加载到应用程序中：
                    </p>
                    <tabs>
                        <tab title="birds.js">
                            [object Promise]
                        </tab>
                        <tab title="app.js">
                            [object Promise]
                        </tab>
                    </tabs>
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/3_router/app.js">3_router</a>
                        项目。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        在 Ktor 中，一种常见的模式是使用 <code>Routing</code> 类型上的扩展函数
                        来定义实际路由。
                        以下示例（
                        <Path>Birds.kt</Path>
                        ）定义了 <code>birdsRoutes</code> 扩展函数。
                        你可以通过在 <code>routing</code> 代码块中调用此函数，将相应的路由包含到应用程序（
                        <Path>Application.kt</Path>
                        ）中：
                    </p>
                    <tabs>
                        <tab title="Birds.kt" id="birds-kt">
                            [object Promise]
                        </tab>
                        <tab title="Application.kt" id="application-kt">
                            [object Promise]
                        </tab>
                    </tabs>
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/3_router/src/main/kotlin/com/example/Application.kt">3_router</a>
                        项目。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            除了将 URL 路径指定为字符串之外，Ktor 还包括实现 <Links href="/ktor/server-resources" summary="Resources 插件允许你实现类型安全的路由。">类型安全路由</Links>的能力。
        </p>
    </chapter>
    <chapter title="路由和查询参数" id="route-query-param">
        <p>
            本节将向我们展示如何访问路由和查询参数。
        </p>
        <p>
            路由（或路径）参数是用于捕获其在 URL 中指定位置值的命名 URL 段。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        要在 Express 中访问路由参数，你可以使用 <code>Request.params</code>。
                        例如，以下代码片段中的 <code>req.parameters["login"]</code> 将针对
                        <Path>/user/admin</Path>
                        路径返回
                        <emphasis>admin</emphasis>
                        ：
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/4_parameters/app.js">4_parameters</a>
                        项目。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        在 Ktor 中，路由参数使用 <code>{param}</code> 语法定义。
                        你可以在路由处理器中使用 <code>call.parameters</code> 来访问路由参数：
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt">4_parameters</a>
                        项目。
                    </p>
                </td>
            </tr>
        </table>
        <p>
            下表比较了如何访问查询字符串的参数。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        要在 Express 中访问路由参数，你可以使用 <code>Request.params</code>。
                        例如，以下代码片段中的 <code>req.parameters["login"]</code> 将针对
                        <Path>/user/admin</Path>
                        路径返回
                        <emphasis>admin</emphasis>
                        ：
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/4_parameters/app.js">4_parameters</a>
                        项目。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        在 Ktor 中，路由参数使用 <code>{param}</code> 语法定义。
                        你可以在路由处理器中使用 <code>call.parameters</code> 来访问路由参数：
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/4_parameters/src/main/kotlin/com/example/Application.kt">4_parameters</a>
                        项目。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="发送响应" id="send-response">
        <p>
            在前面的章节中，我们已经看到了如何以纯文本内容进行响应。
            让我们看看如何发送 JSON、文件和重定向响应。
        </p>
        <chapter title="JSON" id="send-json">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中发送带有适当内容类型的 JSON 响应，
                            请调用 <code>res.json</code> 函数：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            项目。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，你需要安装 <Links href="/ktor/server-serialization" summary="ContentNegotiation 插件主要有两个用途：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。">ContentNegotiation</Links>
                            插件并
                            配置 JSON 序列化器：
                        </p>
                        [object Promise]
                        <p>
                            要将数据序列化为 JSON，你需要创建一个带有
                            <code>@Serializable</code> 注解的数据类：
                        </p>
                        [object Promise]
                        <p>
                            然后，你可以使用 <code>call.respond</code> 在响应中发送此类的对象：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            项目。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="文件" id="send-file">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中以文件进行响应，请使用 <code>res.sendFile</code>：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            项目。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktor 提供了 <code>call.respondFile</code> 函数，用于向客户端发送文件：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            项目。
                        </p>
                    </td>
                </tr>
            </table>
            <p>
                当以文件进行响应时，Express 应用程序会添加
                <control>Accept-Ranges</control>
                HTTP 响应头。
                服务器使用此头来宣告其支持客户端进行文件下载的部分请求。
                在 Ktor 中，你需要安装 <Links href="/ktor/server-partial-content" summary="所需的依赖项：io.ktor:%artifact_name%
服务器示例：
download-file,
客户端示例：
client-download-file-range
        原生服务器支持：✅">PartialContent</Links> 插件以
                支持部分请求。
            </p>
        </chapter>
        <chapter title="文件附件" id="send-file-attachment">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            <code>res.download</code> 函数将指定的文件作为附件传输：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            项目。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，你需要手动配置
                            <control>Content-Disposition</control>
                            头，以将文件作为附件传输：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            项目。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="重定向" id="redirect">
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中生成重定向响应，请调用 <code>redirect</code> 函数：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/5_send_response/app.js">5_send_response</a>
                            项目。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，使用 <code>respondRedirect</code> 发送重定向响应：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/5_send_response/src/main/kotlin/com/example/Application.kt">5_send_response</a>
                            项目。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
    </chapter>
    <chapter title="模板" id="templates">
        <p>
            Express 和 Ktor 都支持使用模板引擎来处理视图。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        假设我们在
                        <Path>views</Path>
                        文件夹中有以下 Pug 模板：
                    </p>
                    [object Promise]
                    <p>
                        要以这个模板进行响应，请调用 <code>res.render</code>：
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/6_templates/app.js">6_templates</a>
                        项目。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor 支持多种 <Links href="/ktor/server-templating" summary="了解如何使用 HTML/CSS 或 JVM 模板引擎构建视图。">JVM 模板引擎</Links>，
                        例如 FreeMarker、Velocity 等。
                        例如，如果你需要以放置在应用程序资源中的 FreeMarker 模板进行响应，
                        请安装并配置 <code>FreeMarker</code> 插件，然后使用 <code>call.respond</code> 发送模板：
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/6_templates/src/main/kotlin/com/example/Application.kt">6_templates</a>
                        项目。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="接收请求" id="receive-request">
        <p>
            本节将展示如何接收不同格式的请求体。
        </p>
        <chapter title="原始文本" id="receive-raw-text">
            <p>
                下面的 <code>POST</code> 请求将文本数据发送到服务器：
            </p>
            [object Promise]
            <p>
                让我们看看如何在服务器端将此请求体作为纯文本接收。
            </p>
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中解析传入的请求体，你需要添加 <code>body-parser</code>：
                        </p>
                        [object Promise]
                        <p>
                            在 <code>post</code> 处理器中，
                            你需要传递文本解析器（<code>bodyParser.text</code>）。
                            请求体将在 <code>req.body</code> 属性下可用：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            项目。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，你可以使用 <code>call.receiveText</code> 将请求体作为文本接收：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            项目。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="JSON" id="receive-json">
            <p>
                在本节中，我们将探讨如何接收 JSON 体。
                以下示例展示了一个 <code>POST</code> 请求，其请求体中包含一个 JSON 对象：
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中接收 JSON，请使用 <code>bodyParser.json</code>：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            项目。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，你需要安装 <Links href="/ktor/server-serialization" summary="ContentNegotiation 插件主要有两个用途：在客户端和服务器之间协商媒体类型，以及以特定格式序列化/反序列化内容。">ContentNegotiation</Links>
                            插件
                            并配置 <code>Json</code> 序列化器：
                        </p>
                        [object Promise]
                        <p>
                            要将接收到的数据反序列化为对象，你需要创建一个数据类：
                        </p>
                        [object Promise]
                        <p>
                            然后，使用接受此数据类作为形参的 <code>receive</code> 方法：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            项目。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="URL 编码" id="receive-url-encoded">
            <p>
                现在让我们看看如何接收使用
                <control>application/x-www-form-urlencoded</control>
                类型发送的表单数据。
                以下代码片段展示了一个带有表单数据的示例 <code>POST</code> 请求：
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            与纯文本和 JSON 类似，Express 需要 <code>body-parser</code>。
                            你需要将解析器类型设置为 <code>bodyParser.urlencoded</code>：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            项目。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，使用 <code>call.receiveParameters</code> 函数：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            项目。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="原始数据" id="receive-raw-data">
            <p>
                下一个用例是处理二进制数据。
                以下请求将带有
                <control>application/octet-stream</control>
                类型的 PNG 图像发送到服务器：
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            要在 Express 中处理二进制数据，请将解析器类型设置为 <code>raw</code>：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            项目。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            Ktor 提供了 <code>ByteReadChannel</code> 和 <code>ByteWriteChannel</code>
                            ，用于异步读取/写入字节序列：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive
                                request</a>
                            项目。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
        <chapter title="多部分" id="receive-multipart">
            <p>
                在最后一节中，让我们看看如何处理
                <emphasis>多部分</emphasis>
                请求体。
                下面的 <code>POST</code> 请求使用
                <control>multipart/form-data</control>
                类型发送带有描述的 PNG 图像：
            </p>
            [object Promise]
            <table style="header-column">
                <tr>
                    <td>
                        <control>Express</control>
                    </td>
                    <td>
                        <p>
                            Express 需要一个单独的模块来解析多部分数据。
                            在下面的示例中，
                            <control>multer</control>
                            用于将文件上传到服务器：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/7_receive_request/app.js">7_receive_request</a>
                            项目。
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <control>Ktor</control>
                    </td>
                    <td>
                        <p>
                            在 Ktor 中，如果你需要接收作为多部分请求一部分发送的文件，
                            请调用 <code>receiveMultipart</code> 函数，然后根据需要遍历每个部分。
                            在下面的示例中，<code>PartData.FileItem</code> 用于将文件作为字节流接收：
                        </p>
                        [object Promise]
                        <p>
                            有关完整示例，请参见
                            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/7_receive_request/src/main/kotlin/com/example/Application.kt">7_receive_request</a>
                            项目。
                        </p>
                    </td>
                </tr>
            </table>
        </chapter>
    </chapter>
    <chapter title="创建中间件" id="middleware">
        <p>
            我们将探讨的最后一件事是如何创建中间件，它允许你扩展服务器功能。
            以下示例展示了如何使用 Express 和 Ktor 实现请求日志记录。
        </p>
        <table style="header-column">
            <tr>
                <td>
                    <control>Express</control>
                </td>
                <td>
                    <p>
                        在 Express 中，中间件是使用 <code>app.use</code> 绑定到应用程序的函数：
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express/8_middleware/app.js">8_middleware</a>
                        项目。
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <control>Ktor</control>
                </td>
                <td>
                    <p>
                        Ktor 允许你使用 <Links href="/ktor/server-custom-plugins" summary="了解如何创建自己的自定义插件。">自定义插件</Links>扩展其功能。
                        以下代码示例展示了如何处理 <code>onCall</code> 以实现请求日志记录：
                    </p>
                    [object Promise]
                    <p>
                        有关完整示例，请参见
                        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/migrating-express-ktor/8_middleware/src/main/kotlin/com/example/Application.kt">8_middleware</a>
                        项目。
                    </p>
                </td>
            </tr>
        </table>
    </chapter>
    <chapter title="下一步" id="next">
        <p>
            本指南中仍有许多未涵盖的用例，
            例如会话管理、授权、数据库集成等。
            对于这些功能中的大部分，Ktor 提供了专门的插件，
            可以在应用程序中安装并根据需要进行配置。
            要继续你的 Ktor 之旅，
            请访问
            <control><a href="https://ktor.io/learn/">学习页面</a></control>
            ，该页面提供了一系列分步指南和即用型示例。
        </p>
    </chapter>
</topic>