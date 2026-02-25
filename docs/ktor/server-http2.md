[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>代码示例</b>：<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) 是一种现代的二进制双工多路复用协议，旨在作为 HTTP/1.x 的替代方案。

Jetty 和 Netty 引擎提供了 Ktor 可以使用的 HTTP/2 实现。然而，它们之间存在显著差异，且每个引擎都需要额外的配置。
一旦您的主机为 Ktor 进行了正确配置，HTTP/2 支持将自动激活。

关键要求：

*   SSL 证书（可以是自签名的）。
*   适用于特定引擎的 ALPN 实现（请参阅 Netty 和 Jetty 的相应部分）。

## SSL 证书 {id="ssl_certificate"}

根据规范，HTTP/2 并不要求加密，但所有浏览器都要求在配合 HTTP/2 使用时必须采用加密连接。
这就是为什么有效的 TLS 环境是启用 HTTP/2 的前提条件。因此，需要一个证书来启用加密。
出于测试目的，可以使用 JDK 中的 `keytool` 生成证书……

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

……或者通过使用 [buildKeyStore](server-ssl.md) 函数生成。

下一步是配置 Ktor 使用您的密钥库。请参阅 `application.conf` / `application.yaml` [配置文件](server-configuration-file.topic) 示例：

<Tabs group="config">
<TabItem title="application.conf" group-key="hocon">

```shell
ktor {
    deployment {
        port = 8080
        sslPort = 8443
    }

    application {
        modules = [ com.example.ApplicationKt.main ]
    }

    security {
        ssl {
            keyStore = test.jks
            keyAlias = testkey
            keyStorePassword = foobar
            privateKeyPassword = foobar
        }
    }
}

```

</TabItem>
<TabItem title="application.yaml" group-key="yaml">

```yaml
ktor:
    deployment:
        port: 8080
        sslPort: 8443
    application:
        modules:
            - com.example.ApplicationKt.main

    security:
        ssl:
            keyStore: test.jks
            keyAlias: testkey
            keyStorePassword: foobar
            privateKeyPassword: foobar
```

</TabItem>
</Tabs>

## ALPN 实现 {id="apln_implementation"}

HTTP/2 要求启用 ALPN（[应用层协议协商](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation)）。第一种选择是使用外部 ALPN 实现，该实现需要添加到引导类路径（boot classpath）中。
另一种选择是使用 OpenSSL 原生绑定和预编译的原生二进制文件。
此外，每个特定的引擎可能仅支持其中一种方法。

### Jetty {id="jetty"}

由于 Java 8 开始支持 ALPN API，Jetty 引擎在使用 HTTP/2 时不需要任何特定配置。因此，您只需要：
1. 使用 Jetty 引擎[创建一个服务器](server-engines.md#choose-create-server)。
2. 按照 [SSL 证书](#ssl_certificate) 中的说明添加 SSL 配置。
3. 配置 `sslPort`。

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty) 可运行示例演示了对 Jetty 的 HTTP/2 支持。

### Netty {id="netty"}

要在 Netty 中启用 HTTP/2，请使用 OpenSSL 绑定（[tcnative netty port](https://netty.io/wiki/forked-tomcat-native.html)）。
下面的示例展示了如何将原生实现（静态链接的 BoringSSL 库，OpenSSL 的一个分支）添加到 `build.gradle.kts` 文件中：

```kotlin
val osName = System.getProperty("os.name").lowercase()
val tcnative_classifier = when {
    osName.contains("win") -> "windows-x86_64"
    osName.contains("linux") -> "linux-x86_64"
    osName.contains("mac") -> "osx-x86_64"
    else -> null
}

dependencies {
    if (tcnative_classifier != null) {
        implementation("io.netty:netty-tcnative-boringssl-static:$tcnative_version:$tcnative_classifier")
    } else {
        implementation("io.netty:netty-tcnative-boringssl-static:$tcnative_version")
    }
}
```

`tc.native.classifier` 应为以下之一：`linux-x86_64`、`osx-x86_64` 或 `windows-x86_64`。
[http2-netty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty) 可运行示例演示了如何为 Netty 启用 HTTP/2 支持。

#### 不带 TLS 的 HTTP/2

Netty 引擎还支持 [明文 HTTP/2 (h2c)](https://httpwg.org/specs/rfc7540.html#discover-http)。
这允许在不使用 TLS 的情况下进行 HTTP/2 通信，通常用于不需要加密的私有网络中。
客户端可以使用 HTTP/1.1 请求发起通信，然后升级到 HTTP/2。

要启用 h2c，请在引擎配置中将 `enableH2c` 标志设置为 `true`：

```kotlin
embeddedServer(Netty, configure = {
    connector {
        port = 8080
    }
    enableHttp2 = true
    enableH2c = true
})
```

请注意，h2c 要求 `enableHttp2 = true`，并且如果服务器上配置了 SSL 连接器，则无法使用 h2c。