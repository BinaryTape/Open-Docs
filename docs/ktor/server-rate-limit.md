[//]: # (title: 限速)

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
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 提供了验证传入请求体（body）的能力。
</link-summary>

[%plugin_name%](%plugin_api_link%) 插件允许你限制客户端在特定时间段内可以发出的 [请求](server-requests.md) 数量。
Ktor 提供了不同的方式来配置限速，例如：
- 你可以为整个应用程序全局启用限速，或者为不同的 [资源](server-routing.md) 配置不同的速率限制。
- 你可以根据特定的请求参数（如 IP 地址、API 密钥或访问令牌等）配置限速。

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 %plugin_name% {id="configure"}

### 概述 {id="overview"}

Ktor 使用 _令牌桶_ 算法进行限速，其工作原理如下：
1. 最初，我们有一个由其容量（即令牌数量）定义的桶。
2. 每个传入请求尝试从桶中消耗一个令牌：
    - 如果有足够的容量，服务器会处理请求并发送包含以下响应头的响应：
        - `X-RateLimit-Limit`: 指定的桶容量。
        - `X-RateLimit-Remaining`: 桶中剩余的令牌数量。
        - `X-RateLimit-Reset`: 一个 UTC 时间戳（以秒为单位），指定桶重新填充的时间。
    - 如果容量不足，服务器会使用 `429 Too Many Requests` 响应拒绝请求，并添加 `Retry-After` 响应头，指示客户端在发出后续请求前应等待多长时间（以秒为单位）。
3. 在指定时间段后，桶容量会被重新填充。

### 注册限速器 {id="register"}
Ktor 允许你将限速全局应用于整个应用程序或特定路由：
- 要将限速应用于整个应用程序，请调用 `global` 方法并传入配置好的限速器。
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- `register` 方法注册一个限速器，该限速器可以应用于特定路由。
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="14-17,33"}

上面的代码示例展示了 `%plugin_name%` 插件的最小配置，但对于使用 `register` 方法注册的限速器，你还需要将其应用于 [特定路由](#rate-limiting-scope)。

### 配置限速 {id="configure-rate-limiting"}

在本节中，我们将了解如何配置限速：

1. （可选）`register` 方法允许你指定一个限速器名称，该名称可用于将限速规则应用于 [特定路由](#rate-limiting-scope)：
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2. `rateLimiter` 方法创建一个限速器，带有两个参数：`limit` 定义桶容量，而 `refillPeriod` 指定此桶的重新填充周期。
   以下示例中的限速器允许每分钟处理 30 个请求：
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21-22,32"}

3. （可选）`requestKey` 允许你指定一个函数，该函数为请求返回一个键。具有不同键的请求拥有独立的速率限制。
   以下示例中，`login` [查询参数](server-requests.md#query_parameters) 是一个用于区分不同用户的键：
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21,23-25,32"}

   > 请注意，键应具有良好的 `equals` 和 `hashCode` 实现。

4. （可选）`requestWeight` 设置一个函数，该函数返回请求消耗的令牌数量。以下示例中，请求键用于配置请求权重：
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21,23-32"}

5. （可选）`modifyResponse` 允许你覆盖随每个请求发送的默认 `X-RateLimit-*` 响应头：
   ```kotlin
   register(RateLimitName("protected")) {
       modifyResponse { applicationCall, state ->
           applicationCall.response.header("X-RateLimit-Custom-Header", "Some value")
       }
   }
   ```

### 定义限速范围 {id="rate-limiting-scope"}

配置限速器后，你可以使用 `rateLimit` 方法将其规则应用于特定路由：

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="40-46,60"}

此方法还可以接受 [限速器名称](#configure-rate-limiting)：

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="40,53-60"}

## 示例 {id="example"}

以下代码示例演示了如何使用 `RateLimit` 插件将不同的限速器应用于不同资源。[StatusPages](server-status-pages.md) 插件用于处理被拒绝的请求，对于这些请求，发送了 `429 Too Many Requests` 响应。

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt"}

你可以在此处找到完整示例: [rate-limit](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit)。