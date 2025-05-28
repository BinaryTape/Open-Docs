[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>代码示例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) 是一种现代二进制双工多路复用协议，旨在取代 HTTP/1.x。

Jetty 和 Netty 引擎提供 HTTP/2 实现，供 Ktor 使用。然而，它们之间存在显著差异，且每个引擎都需要额外的配置。一旦您的主机为 Ktor 正确配置，HTTP/2 支持将自动激活。

关键要求：

*   SSL 证书 (可以是自签名)。
*   适用于特定引擎的 ALPN 实现 (请参阅 Netty 和 Jetty 的相应章节)。

## SSL 证书 {id="ssl_certificate"}

根据规范，HTTP/2 不需要加密，但所有浏览器都要求 HTTP/2 使用加密连接。这就是为什么一个可用的 TLS 环境是启用 HTTP/2 的先决条件。因此，启用加密需要一个证书。出于测试目的，可以使用 JDK 中的 `keytool` 生成...

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

... 或使用 [buildKeyStore](server-ssl.md) 函数。

下一步是配置 Ktor 以使用您的密钥库。请参阅示例 `application.conf` / `application.yaml` [配置文件](server-configuration-file.topic)：

<tabs group="config">
<tab title="application.conf" group-key="hocon">

```shell
```
{src="snippets/http2-netty/src/main/resources/application.conf"}

</tab>
<tab title="application.yaml" group-key="yaml">

```yaml
```
{src="snippets/http2-netty/src/main/resources/_application.yaml"}

</tab>
</tabs>

## ALPN 实现 {id="apln_implementation"}

HTTP/2 需要启用 ALPN ([Application-Layer Protocol Negotiation](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation))。第一种选择是使用外部 ALPN 实现，该实现需要添加到启动类路径 (boot classpath)。另一种选择是使用 OpenSSL 原生绑定 (native bindings) 和预编译的原生二进制文件 (precompiled native binaries)。此外，每个特定引擎只能支持这些方法中的一种。

### Jetty {id="jetty"}

由于 ALPN API 从 Java 8 开始得到支持，Jetty 引擎使用 HTTP/2 不需要任何特定配置。因此，您只需：
1.  [创建服务器](server-engines.md#choose-create-server) 并使用 Jetty 引擎。
2.  添加 SSL 配置，如 [](#ssl_certificate) 所述。
3.  配置 `sslPort`。

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty) 可运行示例演示了 Jetty 的 HTTP/2 支持。

### Netty {id="netty"}

要在 Netty 中启用 HTTP/2，请使用 OpenSSL 绑定 ([tcnative netty port](https://netty.io/wiki/forked-tomcat-native.html))。以下示例展示了如何将原生实现 (静态链接的 BoringSSL 库，OpenSSL 的一个分支) 添加到 `build.gradle.kts` 文件中：

```kotlin
```
{src="snippets/http2-netty/build.gradle.kts" include-lines="20-28,34-39"}

`tc.native.classifier` 应该是以下之一：`linux-x86_64`、`osx-x86_64` 或 `windows-x86_64`。[http2-netty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty) 可运行示例演示了如何为 Netty 启用 HTTP/2 支持。