[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>代码示例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) 是一种现代的二进制双工多路复用协议，旨在替代 HTTP/1.x。

Jetty 和 Netty 引擎提供了 Ktor 可以使用的 HTTP/2 实现。然而，它们之间存在显著差异，并且每个引擎都需要额外配置。一旦你的主机为 Ktor 正确配置，HTTP/2 支持将自动激活。

关键要求：

*   SSL 证书（可以是自签名的）。
*   适用于特定引擎的 ALPN 实现（参见 Netty 和 Jetty 的对应章节）。

## SSL 证书 {id="ssl_certificate"}

根据规范，HTTP/2 不需要加密，但所有浏览器都将要求 HTTP/2 使用加密连接。因此，可用的 TLS 环境是启用 HTTP/2 的先决条件。所以，需要证书来启用加密。出于测试目的，可以使用 JDK 中的 `keytool` 生成证书……

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

……或者使用 [buildKeyStore](server-ssl.md) 函数。

下一步是配置 Ktor 使用你的 keystore。参见示例 `application.conf` / `application.yaml` [配置文件](server-configuration-file.topic)：

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

HTTP/2 需要启用 ALPN（[应用层协议协商](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation)）。第一种选择是使用需要添加到启动类路径的外部 ALPN 实现。另一种选择是使用 OpenSSL 原生绑定和预编译的原生二进制文件。此外，每个特定引擎只能支持这些方法中的一种。

### Jetty {id="jetty"}

由于从 Java 8 开始支持 ALPN API，Jetty 引擎不需要任何使用 HTTP/2 的特定配置。因此，你只需要：
1.  使用 Jetty 引擎[创建服务器](server-engines.md#choose-create-server)。
2.  添加 [SSL 证书](#ssl_certificate) 中所述的 SSL 配置。
3.  配置 `sslPort`。

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty) 可运行示例演示了 Jetty 的 HTTP/2 支持。

### Netty {id="netty"}

要在 Netty 中启用 HTTP/2，请使用 OpenSSL 绑定（[tcnative netty port](https://netty.io/wiki/forked-tomcat-native.html)）。下面这个例子演示了如何将原生实现（静态链接的 BoringSSL 库，OpenSSL 的一个分支）添加到 `build.gradle.kts` 文件：

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

`tc.native.classifier` 应该是以下之一：`linux-x86_64`、`osx-x86_64` 或 `windows-x86_64`。[http2-netty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty) 可运行示例演示了如何为 Netty 启用 HTTP/2 支持。