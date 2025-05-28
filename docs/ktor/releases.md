[//]: # (title: Ktor 发布版本)

<show-structure for="chapter" depth="2"/>

Ktor 遵循 [语义化版本控制](https://semver.org/)：

- _主版本_ (x.0.0) 包含不兼容的 API 更改。
- _次版本_ (x.y.0) 提供向后兼容的新功能。
- _补丁版本_ (x.y.z) 包含向后兼容的修复。

对于每个主版本和次版本，我们还会发布一些预览版（[抢先体验计划 (Early Access Program)](https://ktor.io/eap/)，简称 EAP）供您在正式发布前试用新功能。更多详细信息，请参阅 [抢先体验计划](https://ktor.io/eap/)。

## Gradle 插件 {id="gradle"}

[Gradle Ktor 插件](https://github.com/ktorio/ktor-build-plugins) 和框架处于相同的发布周期。您可以在 [Gradle 插件门户](https://plugins.gradle.org/plugin/io.ktor.plugin) 上找到所有插件发布版本。

## IntelliJ Ultimate 插件 {id="intellij"}

[IntelliJ Ktor 插件](https://www.jetbrains.com/help/idea/ktor.html) 独立于 Ktor 框架发布，并采用与 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html) 相同的发布周期。

### 更新到新版本 {id="update"}

IntelliJ Ktor 插件允许您将 Ktor 项目迁移到最新版本。您可以从 [迁移项目](https://www.jetbrains.com/help/idea/ktor.html#migrate) 部分了解更多信息。

## 发布详情 {id="release-details"}

下表列出了最新 Ktor 发布版本的详细信息。

<table>
<tr><td>版本</td><td>发布日期</td><td>亮点</td></tr>
<tr><td>3.1.3</td><td>May 5, 2025</td><td><p>
一个补丁版本，包含性能改进，例如更快的
<a href="https://youtrack.jetbrains.com/issue/KTOR-8412">
字节操作
</a>
和
<a href="https://youtrack.jetbrains.com/issue/KTOR-8407">
多部分处理
</a>
，以及
<a href="https://youtrack.jetbrains.com/issue/KTOR-8107">
更安全的令牌刷新处理
</a>
。它还修复了
<a href="https://youtrack.jetbrains.com/issue/KTOR-8276">
指标中的内存问题
</a>
，
<a href="https://youtrack.jetbrains.com/issue/KTOR-8326">
改进了请求头行为
</a>
，并解决了 WebSockets、OkHttp、Apache5 和 Netty 中的错误，此外还
<a href="https://youtrack.jetbrains.com/issue/KTOR-8030">
更新了 JTE 以支持 Kotlin 2.1.0
</a>。
</p>
<var name="version" value="3.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.2</td><td>March 27, 2025</td><td><p>
一个补丁版本，将 Kotlin 更新到 2.1.20 并修复了各种问题，包括 Base64 解码、认证令牌清除、Android 服务器启动错误、WebSocket 请求头格式化和 SSE 会话取消。
</p>
<var name="version" value="3.1.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.1</td><td>February 24, 2025</td><td><p>
一个补丁版本，改进了日志记录并修复了 WebSocket 超时处理。它修复了多个错误，包括 HTTP 缓存不一致、表单数据复制错误、gzip 处理崩溃以及导致分段池损坏的并发问题。
</p>
<var name="version" value="3.1.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.0</td><td>February 11, 2025</td><td><p>
一个次要版本，引入了各种 SSE 功能并扩展了 CIO 引擎和 WebSocket 支持。它增强了平台兼容性、日志记录和认证，同时修复了与字节通道处理、HTTP 请求失败和并发问题相关的关键错误。
</p>
<var name="version" value="3.1.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.3</td><td>December 18, 2024</td><td><p>
一个补丁版本，包含各种错误修复，包括修复 `browserProductionWebpack` 中的构建错误、gzip 内容处理和 `FormFieldLimit` 配置覆盖。此版本还包括核心性能改进和正确的测试应用程序关闭。
</p>
<var name="version" value="3.0.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.2</td><td>December 4, 2024</td><td><p>
一个补丁版本，解决了与响应损坏、截断主体、连接处理和错误请求头相关的多个错误修复，并扩展了二进制编码支持和针对 Android 的性能增强。
</p>
<var name="version" value="3.0.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.13</td><td>November 20, 2024</td><td><p>
一个补丁版本，包含错误修复、安全补丁和改进，包括增加了对 `watchosDeviceArm64` 目标的支持。
</p>
<var name="version" value="2.3.13"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.1</td><td>October 29, 2024</td><td><p>
一个补丁版本，包括客户端和服务器日志记录的改进以及各种错误修复。
</p>
<var name="version" value="3.0.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0</td><td>October 9, 2024</td><td><p>
一个主版本，包含改进和错误修复，包括增加了对 Android Native 目标的支持。有关重大更改的更多信息，请参阅<a href="https://ktor.io/docs/migrating-3.html">迁移指南</a>。
</p>
<var name="version" value="3.0.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-rc-2</td><td>October 2, 2024</td><td><p>
一个主要发布候选版本，包含各种改进（含重大更改）、错误修复和功能，例如对 XML 的多平台支持。
</p>
<var name="version" value="3.0.0-rc-2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-rc-1</td><td>September 9, 2024</td><td><p>
一个主要发布候选版本，包含重大改进和错误修复。此更新增强了向后兼容性，并提供了扩展的 `staticZip` 支持。有关重大更改的更多信息，请参阅<a href="https://ktor.io/docs/eap/migrating-3.html">迁移指南</a>。
</p>
<var name="version" value="3.0.0-rc-1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-beta-2</td><td>July 15, 2024</td><td><p>
一个主要的预发布版本，包含各种改进和错误修复，包括 SSE 支持的改进以及适用于 Kotlin/Wasm 的 Ktor 客户端。有关重大更改的更多信息，请参阅<a href="https://ktor.io/docs/3.0.0-beta-2/migrating-3.html">迁移指南</a>。
</p>
<var name="version" value="3.0.0-beta-2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.12</td><td>June 20, 2024</td><td><p>
一个补丁版本，包括 Ktor Core 和 Ktor Server 中的错误修复，以及 Netty 和 OpenAPI 的版本更新。
</p>
<var name="version" value="2.3.12"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.11</td><td>May 9, 2024</td><td><p>
一个补丁版本，包括修复将套接字超时应用于测试客户端 (Test Client) 引擎的错误。
</p>
<var name="version" value="2.3.11"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.10</td><td>April 8, 2024</td><td><p>
一个补丁版本，包括 CallLogging 和 SSE 服务器插件的各种错误修复，改进的 Android 客户端日志记录等等。
</p>
<var name="version" value="2.3.10"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.9</td><td>March 4, 2024</td><td><p>
一个补丁版本，包括 ContentNegotiation 客户端插件的错误修复，并增加了对通过 HTTP 发送安全 Cookie 的支持。
</p>
<var name="version" value="2.3.9"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.8</td><td>January 31, 2024</td><td><p>
一个补丁版本，包括 URLBuilder、CORS 和 WebSocket 插件的各种错误修复。
</p>
<var name="version" value="2.3.8"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.7</td><td>December 7, 2023</td><td>
<p>
一个补丁版本，包括 ContentNegotiation、WebSockets 和 Native Server 内存使用方面的错误修复。
</p>
<var name="version" value="2.3.7"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-beta-1</td><td>November 23, 2023</td><td>
<p>
一个主要的预发布版本，包含各种改进和错误修复，包括客户端和服务器的 SSE 支持。
</p>
<var name="version" value="3.0.0-beta-1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.6</td><td>November 7, 2023</td><td>
<p>
一个补丁版本，包括修复 `2.3.5` 中的重大更改以及各种其他错误修复。
</p>
<var name="version" value="2.3.6"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.5</td><td>October 5, 2023</td><td>
<p>
一个补丁版本，包括修复 Darwin 和 Apache5 引擎配置中的问题。
</p>
<var name="version" value="2.3.5"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.4</td><td>August 31, 2023</td><td>
<p>
一个补丁版本，包括修复 HTTP Cookie 请求头中的错误以及 NoTransformationFoundException 错误。
</p>
<var name="version" value="2.3.4"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.3</td><td>August 1, 2023</td><td>
<p>
一个补丁版本，包括对 `linuxArm64` 的客户端和服务器支持以及各种错误修复。
</p>
<var name="version" value="2.3.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.2</td><td>June 28, 2023</td><td>
<p>
一个补丁版本，将 Kotlin 版本升级到 `1.8.22` 并包含各种错误修复。
</p>
<var name="version" value="2.3.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.1</td><td>May 31, 2023</td><td>
<p>
一个补丁版本，包括服务器配置的改进以及各种错误修复。
</p>
<var name="version" value="2.3.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.0</td><td>April 19, 2023</td><td>
<p>
一个功能版本，增加了对多个配置文件、路由 (Routing) 中的正则表达式模式等支持。
</p>
<var name="version" value="2.3.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.4</td><td>February 28, 2023</td><td>
<p>
一个补丁版本，包含 HTTP 客户端、路由 (Routing) 和 ContentNegotiation 中的各种错误修复。
</p>
<var name="version" value="2.2.4"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.3</td><td>January 31, 2023</td><td>
<p>
一个补丁版本，包括 OAuth2 的多平台功能和各种错误修复。
</p>
<var name="version" value="2.2.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.2</td><td>January 3, 2023</td><td>
<p>
一个补丁版本，包括修复 `2.2.1` 中的错误、Swagger 插件的改进和修复等等。
</p>
<var name="version" value="2.2.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.1</td><td>December 7, 2022</td><td>
<p>
修复 `2.2.0` 中 `java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU` 错误的补丁版本。
</p>
<var name="version" value="2.2.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.0</td><td>December 7, 2022</td><td>
<p>
一个多功能版本，包括 Swagger UI 托管、新的插件 API、会话 (Sessions) 的多平台支持等等。更多信息，请参阅<a href="migration-to-22x.md">从 2.0.x 迁移到 2.2.x</a> 指南。
</p>
<var name="version" value="2.2.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.3</td><td>October 26, 2022</td><td>
<p>
一个包含各种错误修复的补丁版本。
</p>
<var name="version" value="2.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.2</td><td>September 29, 2022</td><td>
<p>
一个补丁版本，包含路由 (Routing)、测试引擎 (Testing engine) 和 Ktor 客户端中的错误修复。
</p>
<var name="version" value="2.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.1</td><td>September 6, 2022</td><td>
<p>
一个补丁版本，包含 Ktor 客户端和服务器中的各种错误修复。
</p>
<var name="version" value="2.1.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.0</td><td>August 11, 2022</td><td>
<p>
一个次要版本，增加了对 YAML 配置的支持以及各种其他改进和错误修复。
</p>
<var name="version" value="2.1.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.3</td><td>June 28, 2022</td><td>
<p>
一个补丁版本，包含错误修复并将 `kotlinx.coroutines` 版本升级到 `1.6.2`。
</p>
<var name="version" value="2.0.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.2</td><td>May 27, 2022</td><td>
<p>
一个补丁版本，包含各种改进、错误修复和依赖项版本升级。
</p>
<var name="version" value="2.0.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.1</td><td>April 28, 2022</td><td>
<p>
一个补丁版本，包含各种错误修复并将 Kotlin 版本更新到 `1.6.21`。
</p>
<var name="version" value="2.0.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.0</td><td>April 11, 2022</td><td>
<p>
一个主版本，包含更新的 API 文档和各种新功能。有关重大更改以及如何从 `1.x.x` 迁移的更多信息，请参阅<a href="migration-to-20x.md">迁移指南</a>。
</p>
<var name="version" value="2.0.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>1.6.8</td><td>March 15, 2022</td><td>
<p>
一个补丁版本，包含依赖项版本升级。
</p>
<var name="version" value="1.6.8"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
</table>