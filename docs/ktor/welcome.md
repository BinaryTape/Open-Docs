---
aside: false
---
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="欢迎"
       id="welcome">
    <section-starting-page>
        <title>Ktor 文档</title>
        <description>
            Ktor 是一个用于轻松构建异步服务器端和客户端应用程序的框架。
        </description>
        <spotlight>
            <card href="/ktor/server-create-a-new-project" summary="了解如何使用 Ktor 创建、运行和测试服务器应用程序。">
                Ktor 服务器入门
            </card>
            <card href="/ktor/client-create-new-application" summary="了解如何使用 Ktor 创建、运行和测试客户端应用程序。">
                Ktor 客户端入门
            </card>
        </spotlight>
        <primary>
            <title>Ktor 服务器</title>
            <card href="/ktor/server-requests-and-responses" summary="通过创建任务管理器应用程序，了解 Ktor 中的路由和请求如何工作。">
                处理请求并生成响应
            </card>
            <card href="/ktor/server-create-restful-apis" summary="了解如何使用 Ktor 构建 RESTful API。本教程涵盖了在实际示例中的设置、路由和测试。">创建 RESTful API</card>
            <card href="/ktor/server-create-website" summary="了解如何使用 Kotlin、Ktor 和 Thymeleaf 模板构建网站。">创建网站</card>
            <card href="/ktor/server-create-websocket-application" summary="了解如何利用 WebSockets 的强大功能来发送和接收内容。">
                创建 WebSocket 应用程序
            </card>
            <card href="/ktor/server-integrate-database" summary="了解使用 Exposed SQL Library 将 Ktor 服务连接到数据库仓库的过程。">集成数据库</card>
        </primary>
        <misc>
            <links narrow="true">
                <group>
                    <title>服务器配置</title>
                    <Links href="/ktor/server-create-a-new-project" summary="了解如何使用 Ktor 打开、运行和测试服务器应用程序。">创建、打开和运行新的 Ktor 项目</Links>
                    <Links href="/ktor/server-dependencies" summary="了解如何将 Ktor 服务器依赖项添加到现有的 Gradle/Maven 项目中。">添加服务器依赖项</Links>
                    <Links href="/ktor/server-create-and-configure" summary="了解如何根据应用程序部署需求创建服务器。">创建服务器</Links>
                    <Links href="/ktor/server-configuration-code" summary="了解如何在代码中配置各种服务器参数。">代码配置</Links>
                    <Links href="/ktor/server-configuration-file" summary="了解如何在配置文件中配置各种服务器参数。">文件配置</Links>
                    <Links href="/ktor/server-plugins" summary="插件提供常见功能，例如序列化、内容编码、压缩等。">服务器插件</Links>
                </group>
                <group>
                    <title>路由</title>
                    <Links href="/ktor/server-routing" summary="路由是用于处理服务器应用程序中传入请求的核心插件。">路由</Links>
                    <Links href="/ktor/server-resources" summary="Resources 插件允许您实现类型安全的路由。">类型安全的路由</Links>
                    <Links href="/ktor/server-application-structure" summary="了解如何构建应用程序以在应用程序增长时保持其可维护性。">应用程序结构</Links>
                    <Links href="/ktor/server-requests" summary="了解如何在路由处理程序中处理传入请求。">处理请求</Links>
                    <Links href="/ktor/server-responses" summary="了解如何发送不同类型的响应。">发送响应</Links>
                    <Links href="/ktor/server-static-content" summary="了解如何提供静态内容，例如样式表、脚本、图像等。">提供静态内容</Links>
                </group>
                <group>
                    <title>插件</title>
                    <Links href="/ktor/server-serialization" summary="ContentNegotiation 插件主要有两个目的：协商客户端和服务器之间的媒体类型，以及以特定格式序列化/反序列化内容。">Ktor 服务器中的内容协商和序列化</Links>
                    <Links href="/ktor/server-templating" summary="了解如何使用 HTML/CSS 或 JVM 模板引擎构建视图。">模板化</Links>
                    <Links href="/ktor/server-auth" summary="Authentication 插件处理 Ktor 中的身份验证和授权。">Ktor 服务器中的身份验证和授权</Links>
                    <Links href="/ktor/server-sessions" summary="Sessions 插件提供了一种在不同 HTTP 请求之间持久化数据的机制。">会话</Links>
                    <Links href="/ktor/server-websockets" summary="Websockets 插件允许您在服务器和客户端之间创建多向通信会话。">Ktor 服务器中的 WebSockets</Links>
                    <Links href="/ktor/server-server-sent-events" summary="SSE 插件允许服务器通过 HTTP 连接向客户端发送基于事件的更新。">Ktor 服务器中的服务器发送事件</Links>
                    <Links href="/ktor/server-swagger-ui" summary="SwaggerUI 插件允许您为项目生成 Swagger UI。">Swagger UI</Links> / <Links href="/ktor/server-openapi" summary="OpenAPI 插件允许您为项目生成 OpenAPI 文档。">OpenAPI</Links>
                    <Links href="/ktor/server-custom-plugins" summary="了解如何创建自己的自定义插件。">自定义服务器插件</Links>
                </group>
                <group>
                    <title>运行、调试和测试</title>
                    <Links href="/ktor/server-run" summary="了解如何运行服务器 Ktor 应用程序。">运行</Links>
                    <Links href="/ktor/server-auto-reload" summary="了解如何使用自动重载在代码更改时重新加载应用程序类。">自动重载</Links>
                    <Links href="/ktor/server-testing" summary="了解如何使用特殊的测试引擎测试服务器应用程序。">Ktor 服务器中的测试</Links>
                </group>
                <group>
                    <title>部署</title>
                    <Links href="/ktor/server-fatjar" summary="了解如何使用 Ktor Gradle 插件创建和运行可执行 Fat JAR。">创建 Fat JAR</Links>
                    <Links href="/ktor/server-war" summary="了解如何使用 WAR 归档在 Servlet 容器中运行和部署 Ktor 应用程序。">WAR</Links>
                    <Links href="/ktor/graalvm" summary="了解如何在不同平台使用 GraalVM 创建原生镜像。">GraalVM</Links>
                    <Links href="/ktor/docker" summary="了解如何将应用程序部署到 Docker 容器。">Docker</Links>
                    <Links href="/ktor/google-app-engine" summary="了解如何将项目部署到 Google App Engine 标准环境。">Google App Engine</Links>
                    <Links href="/ktor/heroku" summary="了解如何准备 Ktor 应用程序并将其部署到 Heroku。">Heroku</Links>
                </group>
            </links>
            <cards>
                <title>Ktor 客户端</title>
                <card href="/ktor/client-create-new-application" summary="使用 Ktor 创建客户端应用程序。">
                    创建客户端应用程序
                </card>
                <card href="/ktor/client-create-multiplatform-application" summary="创建一个 Kotlin 多平台移动应用程序，并了解如何使用 Ktor Client 发起请求和接收响应。">
                    创建跨平台移动应用程序
                </card>
            </cards>
            <links narrow="true">
                <group>
                    <title>客户端设置</title>
                    <Links href="/ktor/client-create-new-application" summary="创建您的第一个客户端应用程序，用于发送请求和接收响应。">创建客户端应用程序</Links>
                    <Links href="/ktor/client-dependencies" summary="了解如何向现有项目添加客户端依赖项。">添加客户端依赖项</Links>
                    <Links href="/ktor/client-create-and-configure" summary="了解如何创建和配置 Ktor 客户端。">创建和配置客户端</Links>
                    <Links href="/ktor/client-engines" summary="了解处理网络请求的引擎。">客户端引擎</Links>
                    <Links href="/ktor/client-plugins" summary="了解提供常见功能的插件，例如日志记录、序列化、授权等。">客户端插件</Links>
                </group>
                <group>
                    <title>请求</title>
                    <Links href="/ktor/client-requests" summary="了解如何发起请求并指定各种请求参数：请求 URL、HTTP 方法、请求头和请求正文。">发起请求</Links>
                    <Links href="/ktor/client-resources" summary="了解如何使用 Resources 插件发起类型安全的请求。">类型安全的请求</Links>
                    <Links href="/ktor/client-default-request" summary="DefaultRequest 插件允许您为所有请求配置默认参数。">默认请求</Links>
                    <Links href="/ktor/client-request-retry" summary="HttpRequestRetry 插件允许您为失败的请求配置重试策略。">重试失败的请求</Links>
                </group>
                <group>
                    <title>响应</title>
                    <Links href="/ktor/client-responses" summary="了解如何接收响应、获取响应正文和获取响应参数。">接收响应</Links>
                    <Links href="/ktor/client-response-validation" summary="了解如何根据其状态码验证响应。">响应验证</Links>
                </group>
                <group>
                    <title>插件</title>
                    <Links href="/ktor/client-auth" summary="Auth 插件处理客户端应用程序中的身份验证和授权。">Ktor 客户端中的身份验证和授权</Links>
                    <Links href="/ktor/client-cookies" summary="HttpCookies 插件自动处理 cookie，并将它们保留在存储中以供不同调用使用。">Cookie</Links>
                    <Links href="/ktor/client-content-encoding" summary="ContentEncoding 插件允许您启用指定的压缩算法（如 'gzip' 和 'deflate'）并配置其设置。">内容编码</Links>
                    <Links href="/ktor/client-bom-remover" summary="BOMRemover 插件允许您从响应正文中移除字节顺序标记 (BOM)。">BOM 移除器</Links>
                    <Links href="/ktor/client-caching" summary="HttpCache 插件允许您将先前获取的资源保存在内存或持久化缓存中。">缓存</Links>
                    <Links href="/ktor/client-websockets" summary="Websockets 插件允许您在服务器和客户端之间创建多向通信会话。">Ktor 客户端中的 WebSockets</Links>
                    <Links href="/ktor/client-server-sent-events" summary="SSE 插件允许客户端通过 HTTP 连接从服务器接收基于事件的更新。">Ktor 客户端中的服务器发送事件</Links>
                    <Links href="/ktor/client-custom-plugins" summary="了解如何创建自己的自定义客户端插件。">自定义客户端插件</Links>
                </group>
                <group>
                    <title>测试</title>
                    <Links href="/ktor/client-testing" summary="了解如何使用 MockEngine 模拟 HTTP 调用来测试您的客户端。">Ktor 客户端中的测试</Links>
                </group>
            </links>
            <cards>
                <title>集成</title>
                <card href="/ktor//ktor/full-stack-development-with-kotlin-multiplatform" summary="了解如何使用 Kotlin 和 Ktor 开发跨平台全栈应用程序。">使用 Kotlin 多平台构建全栈应用程序</card>
                <card href="/ktor//ktor/tutorial-first-steps-with-kotlin-rpc" summary="了解如何使用 Kotlin RPC 和 Ktor 创建您的第一个应用程序。">Kotlin RPC 入门</card>
            </cards>
        </misc>
    </section-starting-page>
</topic>