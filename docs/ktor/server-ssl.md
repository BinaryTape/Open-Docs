[//]: # (title: Ktor 服务器中的 SSL 和证书)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:ktor-network-tls-certificates</code>
</p>
<p>
<b>代码示例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main">ssl-engine-main</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server">ssl-embedded-server</a>
</p>
</tldr>

在大多数情况下，你的 Ktor 服务位于反向代理（例如 Nginx 或 Apache）之后。这意味着反向代理服务器会处理包括 SSL 在内的安全问题。

如有必要，你可以通过提供证书路径来配置 Ktor 直接提供 SSL 服务。Ktor 使用 [Java KeyStore (JKS)](https://docs.oracle.com/javase/8/docs/api/java/security/KeyStore.html) 作为证书的存储设施。你可以使用 [keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) 来转换和管理存储在 KeyStore 中的证书。如果你需要将证书颁发机构颁发的 PEM 证书转换为 Ktor 支持的 JKS 格式，这可能会很有用。

> 你可以使用 _Let's Encrypt_ 来获取免费证书，以便 Ktor 服务 `https://` 和 `wss://` 请求。

## 生成自签名证书 {id="self-signed"}

### 在代码中生成证书 {id="self-signed-code"}

Ktor 提供了通过调用 [buildKeyStore](https://api.ktor.io/ktor-network/ktor-network-tls/ktor-network-tls-certificates/io.ktor.network.tls.certificates/build-key-store.html) 函数来生成自签名证书以用于测试目的的能力，该函数返回一个 [KeyStore](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/security/KeyStore.html) 实例。要使用此函数，你需要在构建脚本中添加 `ktor-network-tls-certificates` artifact：

<var name="artifact_name" value="ktor-network-tls-certificates"/>

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
    

以下代码片段展示了如何生成证书并将其保存到 keystore 文件：

[object Promise]

由于 Ktor 在启动时需要证书，你必须在启动服务器之前创建证书。你可以在此处找到完整示例：[ssl-embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server)。

### 使用 keytool 生成证书 {id="self-signed-keytool"}

你可以使用 [keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) 来生成自签名证书：

```Bash
keytool -keystore keystore.jks -alias sampleAlias -genkeypair -keyalg RSA -keysize 4096 -validity 3 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

执行此命令后，`keytool` 会建议你指定一个 keystore 密码，然后生成一个 JKS 文件。

## 将 PEM 证书转换为 JKS {id="convert-certificate"}

如果你的证书颁发机构以 PEM 格式颁发证书，你需要将其转换为 JKS 格式，然后才能在 [Ktor 中配置 SSL](#configure-ssl-ktor)。你可以使用 `openssl` 和 `keytool` 工具来完成此操作。例如，如果你的私钥在 `key.pem` 文件中，公共证书在 `cert.pem` 中，转换过程可能如下所示：

1. 使用 `openssl` 将 PEM 转换为 PKCS12 格式，命令如下：
   ```Bash
   openssl pkcs12 -export -in cert.pem -inkey key.pem -out keystore.p12 -name "sampleAlias"
   ```
   系统将提示你输入 `key.pem` 的密码短语和 `keystore.p12` 的新密码。

2. 使用 `keytool` 将 PKCS12 转换为 JKS 格式：
   ```Bash
   keytool -importkeystore -srckeystore keystore.p12 -srcstoretype pkcs12 -destkeystore keystore.jks
   ```
   系统将提示你输入 `keystore.p12` 文件的密码和 `keystore.jks` 的新密码。`keystore.jks` 将被生成。

## 在 Ktor 中配置 SSL {id="configure-ssl-ktor"}

在 Ktor 中指定 SSL 设置取决于 [配置 Ktor 服务器](server-create-and-configure.topic) 的方式：使用配置文件或在代码中使用 `embeddedServer` 函数。

### 配置文件 {id="config-file"}

如果你的服务器是在 `application.conf` 或 `application.yaml` [配置文件](server-configuration-file.topic) 中配置的，你可以使用以下 [属性](server-configuration-file.topic#predefined-properties) 启用 SSL：

1. 使用 `ktor.deployment.sslPort` 属性指定 SSL 端口：

   <tabs group="config">
   <tab title="application.conf" group-key="hocon">

   [object Promise]

   </tab>
   <tab title="application.yaml" group-key="yaml">

   [object Promise]

   </tab>
   </tabs>

2. 在单独的 `security` 组中提供 keystore 设置：

   <tabs group="config">
   <tab title="application.conf" group-key="hocon">

   [object Promise]

   </tab>
   <tab title="application.yaml" group-key="yaml">

   [object Promise]

   </tab>
   </tabs>

关于完整示例，请参见 [ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

### embeddedServer {id="embedded-server"}

如果你使用 `embeddedServer` 函数来运行服务器，你需要在 [ApplicationEngine.Configuration](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html) 中配置 [自定义环境](server-configuration-code.topic#embedded-custom) 并使用 [sslConnector](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/ssl-connector.html) 提供 SSL 设置：

[object Promise]

关于完整示例，请参见 [ssl-embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server)。