[//]: # (title: 速率限制)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RateLimit"/>
<var name="package_name" value="io.ktor.server.plugins.ratelimit"/>
<var name="artifact_name" value="ktor-server-rate-limit"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-rate-limit/io.ktor.server.plugins.ratelimit/-rate-limit.html"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="rate-limit"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 并允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links> 支持</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 插件提供验证传入请求正文的功能。
</link-summary>

[%plugin_name%](%plugin_api_link%) 插件允许您限制客户端在特定时间内可以发出的[请求](server-requests.md)数量。
Ktor 提供了不同的方式来配置速率限制，例如：
- 您可以全局启用速率限制以应用于整个应用程序，或者为不同的[资源](server-routing.md)配置不同的速率限制。
- 您可以根据特定的请求参数（例如 IP 地址、API 密钥或访问令牌等）配置速率限制。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 安装 %plugin_name% {id="install_plugin"}

    <p>
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序中，
        请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过对路由进行分组来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code>...
    </p>
    <list>
        <li>
            ...在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ...在显式定义的 <code>module</code> 内部，该模块是 <code>Application</code> 类的扩展函数。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## 配置 %plugin_name% {id="configure"}

### 概述 {id="overview"}

Ktor 使用_令牌桶_算法进行速率限制，其工作原理如下：
1. 一开始，我们有一个由其容量（令牌数量）定义的桶。
2. 每个传入请求都会尝试从桶中消耗一个令牌：
    - 如果有足够的容量，服务器会处理请求并发送带有以下标头的响应：
        - `X-RateLimit-Limit`: 指定的桶容量。
        - `X-RateLimit-Remaining`: 桶中剩余的令牌数量。
        - `X-RateLimit-Reset`: 一个 UTC 时间戳（以秒为单位），指定桶的重新填充时间。
    - 如果容量不足，服务器会使用 `429 Too Many Requests` 响应拒绝请求，并添加 `Retry-After` 标头，指示客户端应等待多长时间（以秒为单位）然后才能发起后续请求。
3. 在指定的时间段后，桶容量会被重新填充。

### 注册速率限制器 {id="register"}
Ktor 允许您全局应用于整个应用程序或应用于特定路由进行速率限制：
- 要对整个应用程序应用速率限制，请调用 `global` 方法并传入一个已配置的速率限制器。
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- `register` 方法注册一个可以应用于特定路由的速率限制器。
   [object Promise]

上述代码示例展示了 `%plugin_name%` 插件的最小配置，但对于使用 `register` 方法注册的速率限制器，您还需要将其应用于[特定路由](#rate-limiting-scope)。

### 配置速率限制 {id="configure-rate-limiting"}

在本节中，我们将介绍如何配置速率限制：

1. （可选）`register` 方法允许您指定一个速率限制器名称，该名称可用于将速率限制规则应用于[特定路由](#rate-limiting-scope)：
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2. `rateLimiter` 方法创建一个带有两个参数的速率限制器：`limit` 定义了桶容量，而 `refillPeriod` 指定了该桶的重新填充周期。
   下面示例中的速率限制器允许每分钟处理 30 个请求：
   [object Promise]

3. （可选）`requestKey` 允许您指定一个函数，该函数返回请求的键。
   具有不同键的请求具有独立的速率限制。
   在下面的示例中，`login` [查询参数](server-requests.md#query_parameters)是用于区分不同用户的键：
   [object Promise]

   > 请注意，键应具有良好的 `equals` 和 `hashCode` 实现。

4. （可选）`requestWeight` 设置一个函数，该函数返回请求消耗的令牌数量。
   在下面的示例中，请求键用于配置请求权重：
   [object Promise]

5. （可选）`modifyResponse` 允许您覆盖随每个请求发送的默认 `X-RateLimit-*` 标头：
   ```kotlin
   register(RateLimitName("protected")) {
       modifyResponse { applicationCall, state ->
           applicationCall.response.header("X-RateLimit-Custom-Header", "Some value")
       }
   }
   ```

### 定义速率限制作用域 {id="rate-limiting-scope"}

配置速率限制器后，您可以使用 `rateLimit` 方法将其规则应用于特定路由：

[object Promise]

此方法还可以接受一个[速率限制器名称](#configure-rate-limiting)：

[object Promise]

## 示例 {id="example"}

下面的代码示例展示了如何使用 `RateLimit` 插件将不同的速率限制器应用于不同的资源。
[StatusPages](server-status-pages.md) 插件用于处理被拒绝的请求，这些请求发送了 `429 Too Many Requests` 响应。

[object Promise]

您可以在此处找到完整示例：[rate-limit](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit)。