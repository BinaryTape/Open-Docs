[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>代码示例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) 是一种现代二进制双工多路复用协议，旨在替代 HTTP/1.x。

Jetty 和 Netty 引擎提供了 Ktor 可以使用的 HTTP/2 实现。然而，它们之间存在显著差异，并且每个引擎都需要额外配置。一旦你的主机为 Ktor 正确配置，HTTP/2 支持将自动激活。

主要要求：

*   SSL 证书（可以是自签名）。
*   适用于特定引擎的 ALPN 实现（请参见 Netty 和 Jetty 的相应部分）。

## SSL 证书 {id="ssl_certificate"}

根据规范，HTTP/2 不要求加密，但所有浏览器都要求 HTTP/2 使用加密连接。这就是为什么正常工作的 TLS 环境是启用 HTTP/2 的先决条件。因此，需要证书才能启用加密。出于测试目的，可以使用 JDK 中的 `keytool` 生成……

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

……或者使用 [buildKeyStore](server-ssl.md) 函数。

下一步是配置 Ktor 使用你的密钥库。请参见示例 `application.conf` / `application.yaml` [配置文件](server-configuration-file.topic)：

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

## ALPN 实现 {id="apln_implementation"}

HTTP/2 要求启用 ALPN（[应用层协议协商](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation)）。第一个选项是使用需要添加到启动类路径的外部 ALPN 实现。另一个选项是使用 OpenSSL 原生绑定和预编译的原生二进制文件。此外，每个特定引擎可能仅支持这些方法中的一种。

### Jetty {id="jetty"}

由于 ALPN API 从 Java 8 开始支持，Jetty 引擎不需要任何特定配置即可使用 HTTP/2。因此，你只需要：
1.  使用 Jetty 引擎[创建服务器](server-engines.md#choose-create-server)。
2.  如 [](#ssl_certificate) 中所述添加 SSL 配置。
3.  配置 `sslPort`。

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty) 可运行示例演示了 Jetty 的 HTTP/2 支持。

### Netty {id="netty"}

要在 Netty 中启用 HTTP/2，请使用 OpenSSL 绑定（[tcnative netty port](https://netty.io/wiki/forked-tomcat-native.html)）。以下示例展示了如何将原生实现（静态链接的 BoringSSL 库，OpenSSL 的一个分支）添加到 `build.gradle.kts` 文件中：

[object Promise]

`tc.native.classifier` 应为以下之一：`linux-x86_64`、`osx-x86_64` 或 `windows-x86_64`。[http2-netty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty) 可运行示例演示了如何启用 Netty 的 HTTP/2 支持。