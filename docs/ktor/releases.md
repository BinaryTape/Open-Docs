[//]: # (title: Ktor 发布版本)

<show-structure for="chapter" depth="2"/>

Ktor 遵循 [语义化版本控制](https://semver.org/)：

- _主版本_ (x.0.0) 包含不兼容的 API 变更。
- _次版本_ (x.y.0) 提供向后兼容的新功能。
- _补丁版本_ (x.y.z) 包含向后兼容的修复。

对于每个主版本和次要发布，我们还会发布一些预览 (EAP) 版本，以便您在这些新特性发布之前进行尝试。有关更多详细信息，请参见 [抢先体验计划](https://ktor.io/eap/)。

## Gradle 插件 {id="gradle"}

[Gradle Ktor 插件](https://github.com/ktorio/ktor-build-plugins) 和框架处于相同的发布周期。您可以在 [Gradle 插件门户](https://plugins.gradle.org/plugin/io.ktor.plugin) 上找到所有插件发布版本。

## IntelliJ Ultimate 插件 {id="intellij"}

[IntelliJ Ktor 插件](https://www.jetbrains.com/help/idea/ktor.html) 独立于 Ktor 框架发布，并使用与 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html) 相同的发布周期。

### 更新到新发布版本 {id="update"}

IntelliJ Ktor 插件允许您将 Ktor 项目迁移到最新版本。您可以从[迁移项目](https://www.jetbrains.com/help/idea/ktor.html#migrate) 部分了解更多信息。

## 发布详情 {id="release-details"}

下表列出了最新 Ktor 发布版本的详细信息。

<table>
<tr><td>版本</td><td>发布日期</td><td>亮点</td></tr>
<tr><td>3.2.3</td><td>2025 年 7 月 29 日</td><td>
<p>
一个补丁发布版本，引入了 YAML 配置处理、DI 解析和 Wasm/JS 稳定性的改进，以及 multipart 解析、CIO <code>100 Continue</code> 响应格式化、<code>ByteReadChannel</code> 中的无限读取循环和服务器关闭问题的修复。
</p>
<var name="version" value="3.2.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.2.2</td><td>2025 年 7 月 14 日</td><td>
<p>
一个补丁发布版本，改进了 SSE 字段序列化顺序并解决了包括 CORS 预检请求处理、测试应用程序流式传输、配置反序列化错误以及跨平台缺失标头在内的多个问题——其中包括 3.2.1 版本中影响 wasmJs 和 Darwin 目标平台的回归问题。
</p>
<var name="version" value="3.2.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.2.1</td><td>2025 年 7 月 4 日</td><td>
<p>
一个补丁发布版本，包含时间 API、模板化和发布方面的改进，以及针对 3.2.0 中引入的插件行为、Netty、OkHttp 和启动问题的关键错误修复。
</p>
<var name="version" value="3.2.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.2.0</td><td>2025 年 6 月 12 日</td><td>
<p>
一个次要发布版本，引入了类型化配置反序列化、新的依赖注入和 HTMX 模块、Gradle 版本目录支持以及挂起模块支持。有关更多信息，请参见<Links href="/ktor/whats-new-320" summary="undefined">Ktor 3.2.0 中的新功能</Links>。
</p>
<var name="version" value="3.2.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.1.3</td><td>2025 年 5 月 5 日</td><td><p>
一个补丁发布版本，包括更快的字节操作和多部分处理等性能改进，以及更安全的令牌刷新处理。它还修复了指标中的内存问题，改进了标头行为，并解决了 WebSockets、OkHttp、Apache5 和 Netty 中的错误，此外还更新了 JTE 以支持 Kotlin 2.1.0。
</p>
<var name="version" value="3.1.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.1.2</td><td>2025 年 3 月 27 日</td><td><p>
一个补丁发布版本，将 Kotlin 更新到 2.1.20 并修复了各种问题，包括 Base64 解码、认证令牌清除、Android 服务器启动错误、WebSocket 标头格式化和 SSE 会话取消。
</p>
<var name="version" value="3.1.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.1.1</td><td>2025 年 2 月 24 日</td><td><p>
一个补丁发布版本，改进了日志记录并修复了 WebSocket 超时处理。它修复了多个错误，包括 HTTP 缓存不一致、表单数据复制错误、gzip 处理崩溃和导致段池损坏的并发问题。
</p>
<var name="version" value="3.1.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.1.0</td><td>2025 年 2 月 11 日</td><td><p>
一个次要发布版本，引入了各种 SSE 特性和扩展的 CIO 引擎与 WebSocket 支持。它增强了平台兼容性、日志记录和认证，同时修复了与字节通道处理、HTTP 请求失败和并发问题相关的关键错误。
</p>
<var name="version" value="3.1.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.0.3</td><td>2024 年 12 月 18 日</td><td><p>
一个补丁发布版本，包含各种错误修复，包括修复 <code>browserProductionWebpack</code> 中的构建错误、Gzip 内容处理和 <code>FormFieldLimit</code> 配置覆盖。此发布版本还包括核心性能改进和适当的测试应用程序关闭。
</p>
<var name="version" value="3.0.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.0.2</td><td>2024 年 12 月 4 日</td><td><p>
一个补丁发布版本，解决了与响应损坏、截断的正文、连接处理和不正确标头相关的多个错误，并提供了扩展的二进制编码支持和针对 Android 的性能增强。
</p>
<var name="version" value="3.0.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.13</td><td>2024 年 11 月 20 日</td><td><p>
一个补丁发布版本，包含错误修复、安全补丁和改进，包括新增对 <code>watchosDeviceArm64</code> 目标平台的支持。
</p>
<var name="version" value="2.3.13"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.0.1</td><td>2024 年 10 月 29 日</td><td><p>
一个补丁发布版本，包含客户端和服务器日志记录的改进，以及各种错误修复。
</p>
<var name="version" value="3.0.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.0.0</td><td>2024 年 10 月 9 日</td><td><p>
一个主要发布版本，包含改进和错误修复，包括新增对 Android 原生目标平台的支持。有关破坏性变更的更多信息，请参见<Links href="/ktor/migrating-3" summary="undefined">迁移指南</Links>。
</p>
<var name="version" value="3.0.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-rc-2</td><td>2024 年 10 月 2 日</td><td><p>
一个主要发布候选版本，包含各种改进，附带破坏性变更、错误修复和特性，例如 XML 的多平台支持。
</p>
<var name="version" value="3.0.0-rc-2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-rc-1</td><td>2024 年 9 月 9 日</td><td><p>
一个主要发布候选版本，包含显著的改进和错误修复。此更新增强了向后兼容性，并具有扩展的 <code>staticZip</code> 支持。
</p>
<var name="version" value="3.0.0-rc-1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-beta-2</td><td>2024 年 7 月 15 日</td><td><p>
一个主要预发布版本，包含各种改进和错误修复，包括 SSE 支持改进和针对 Kotlin/Wasm 的 Ktor 客户端。
</p>
<var name="version" value="3.0.0-beta-2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.12</td><td>2024 年 6 月 20 日</td><td><p>
一个补丁发布版本，包括 Ktor Core 和 Ktor Server 中的错误修复，以及 Netty 和 OpenAPI 的版本更新。
</p>
<var name="version" value="2.3.12"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.11</td><td>2024 年 5 月 9 日</td><td><p>
一个补丁发布版本，包括修复将套接字超时应用于测试客户端引擎的错误。
</p>
<var name="version" value="2.3.11"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.10</td><td>2024 年 4 月 8 日</td><td><p>
一个补丁发布版本，包含 CallLogging 和 SSE 服务端插件的各种错误修复、改进的 Android 客户端日志记录等。
</p>
<var name="version" value="2.3.10"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.9</td><td>2024 年 3 月 4 日</td><td><p>
一个补丁发布版本，包含 ContentNegotiation 客户端插件的错误修复，以及新增的通过 HTTP 发送安全 Cookie 的支持。
</p>
<var name="version" value="2.3.9"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.8</td><td>2024 年 1 月 31 日</td><td><p>
一个补丁发布版本，包含 URLBuilder、CORS 和 WebSocket 插件的各种错误修复。
</p>
<var name="version" value="2.3.8"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.7</td><td>2023 年 12 月 7 日</td><td>
<p>
一个补丁发布版本，包含 ContentNegotiation、WebSockets 中的错误修复以及 Native Server 中的内存使用问题。
</p>
<var name="version" value="2.3.7"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-beta-1</td><td>2023 年 11 月 23 日</td><td>
<p>
一个主要预发布版本，包含各种改进和错误修复，包括客户端和服务器 SSE 支持。
</p>
<var name="version" value="3.0.0-beta-1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.6</td><td>2023 年 11 月 7 日</td><td>
<p>
一个补丁发布版本，包括修复 2.3.5 中的一项破坏性变更，以及其他各种错误修复。
</p>
<var name="version" value="2.3.6"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.5</td><td>2023 年 10 月 5 日</td><td>
<p>
一个补丁发布版本，包括 Darwin 和 Apache5 引擎配置中的修复。
</p>
<var name="version" value="2.3.5"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.4</td><td>2023 年 8 月 31 日</td><td>
<p>
一个补丁发布版本，包括 HTTP Cookie 标头和 NoTransformationFoundException 错误中的错误修复。
</p>
<var name="version" value="2.3.4"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.3</td><td>2023 年 8 月 1 日</td><td>
<p>
一个补丁发布版本，包含对 <code>linuxArm64</code> 的客户端和服务器支持以及各种错误修复。
</p>
<var name="version" value="2.3.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.2</td><td>2023 年 6 月 28 日</td><td>
<p>
一个补丁发布版本，将 Kotlin 版本升级到 <code>1.8.22</code> 并包含各种错误修复。
</p>
<var name="version" value="2.3.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.1</td><td>2023 年 5 月 31 日</td><td>
<p>
一个补丁发布版本，包含服务器配置的改进和各种错误修复。
</p>
<var name="version" value="2.3.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.3.0</td><td>2023 年 4 月 19 日</td><td>
<p>
一个特性发布版本，新增了对多个配置文件、Routing 中的正则表达式模式等的支持。
</p>
<var name="version" value="2.3.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.2.4</td><td>2023 年 2 月 28 日</td><td>
<p>
一个补丁发布版本，包含 HTTP 客户端、Routing 和 ContentNegotiation 中的各种错误修复。
</p>
<var name="version" value="2.2.4"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.2.3</td><td>2023 年 1 月 31 日</td><td>
<p>
一个补丁发布版本，包括 OAuth2 的多平台功能和各种错误修复。
</p>
<var name="version" value="2.2.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.2.2</td><td>2023 年 1 月 3 日</td><td>
<p>
一个补丁发布版本，包含 <code>2.2.1</code> 的错误修复、Swagger 插件中的改进和修复等。
</p>
<var name="version" value="2.2.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.2.1</td><td>2022 年 12 月 7 日</td><td>
<p>
针对 <code>2.2.0</code> 中 <code>java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU</code> 错误的补丁发布版本。
</p>
<var name="version" value="2.2.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.2.0</td><td>2022 年 12 月 7 日</td><td>
<p>
一个多特性发布版本，包括 Swagger UI 托管、新的插件 API、对会话的多平台支持等。有关更多信息，请参见<Links href="/ktor/migration-to-22x" summary="undefined">从 2.0.x 迁移到 2.2.x</Links> 指南。
</p>
<var name="version" value="2.2.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.1.3</td><td>2022 年 10 月 26 日</td><td>
<p>
一个补丁发布版本，包含各种错误修复。
</p>
<var name="version" value="2.1.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.1.2</td><td>2022 年 9 月 29 日</td><td>
<p>
一个补丁发布版本，包含 Routing、Testing 引擎和 Ktor 客户端中的错误修复。
</p>
<var name="version" value="2.1.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.1.1</td><td>2022 年 9 月 6 日</td><td>
<p>
一个补丁发布版本，包含 Ktor 客户端和服务器中的各种错误修复。
</p>
<var name="version" value="2.1.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.1.0</td><td>2022 年 8 月 11 日</td><td>
<p>
一个次要发布版本，新增了对 YAML 配置的支持以及其他各种改进和错误修复。
</p>
<var name="version" value="2.1.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.0.3</td><td>2022 年 6 月 28 日</td><td>
<p>
一个补丁发布版本，包含错误修复并将 <code>kotlinx.coroutines</code> 版本升级到 <code>1.6.2</code>。
</p>
<var name="version" value="2.0.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.0.2</td><td>2022 年 5 月 27 日</td><td>
<p>
一个补丁发布版本，包含各种改进、错误修复和依赖项版本升级。
</p>
<var name="version" value="2.0.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.0.1</td><td>2022 年 4 月 28 日</td><td>
<p>
一个补丁发布版本，包含各种错误修复并将 Kotlin 版本更新到 <code>1.6.21</code>。
</p>
<var name="version" value="2.0.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>2.0.0</td><td>2022 年 4 月 11 日</td><td>
<p>
一个主要发布版本，更新了 API 文档并包含各种新特性。有关破坏性变更以及如何从 <code>1.x.x</code> 迁移的更多信息，请参见<Links href="/ktor/migration-to-20x" summary="undefined">迁移指南</Links>。
</p>
<var name="version" value="2.0.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
<tr><td>1.6.8</td><td>2022 年 3 月 15 日</td><td>
<p>
一个补丁发布版本，包含依赖项版本升级。
</p>
<var name="version" value="1.6.8"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">在 GitHub 上查看变更日志</a>
    </p>
    
</td></tr>
</table>