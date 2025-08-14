[//]: # (title: Ktor Server 中的 SSL 與憑證)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-network-tls-certificates</code>
</p>
<p>
<b>程式碼範例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main">ssl-engine-main</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server">ssl-embedded-server</a>
</p>
</tldr>

在大多數情況下，您的 Ktor 服務位於 Nginx 或 Apache 等反向代理之後。
這表示反向代理伺服器負責安全顧慮，包括 SSL。

如有必要，您可以透過提供憑證路徑來配置 Ktor 直接提供 SSL 服務。
Ktor 使用 [Java KeyStore (JKS)](https://docs.oracle.com/javase/8/docs/api/java/security/KeyStore.html) 作為憑證的儲存設施。
您可以使用 [keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) 來轉換及管理儲存在 KeyStore 中的憑證。
如果您需要將憑證頒發機構頒發的 PEM 憑證轉換為 Ktor 支援的 JKS 格式，這可能會很有用。

> 您可以使用 _Let's Encrypt_ 取得免費憑證，以便 Ktor 提供 `https://` 和 `wss://` 請求服務。

## 生成自簽憑證 {id="self-signed"}

### 在程式碼中生成憑證 {id="self-signed-code"}

Ktor 提供了生成自簽憑證以供測試之用的能力，方法是呼叫
[buildKeyStore](https://api.ktor.io/ktor-network/ktor-network-tls/ktor-network-tls-certificates/io.ktor.network.tls.certificates/build-key-store.html)
函式，該函式會返回一個
[KeyStore](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/security/KeyStore.html) 實例。
要使用此函式，您需要在建置腳本中添加 `ktor-network-tls-certificates` artifact：

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
    

以下程式碼片段展示了如何生成憑證並將其儲存到 keystore 檔案：

[object Promise]

由於 Ktor 在啟動時需要憑證，您必須在啟動伺服器之前建立憑證。
您可以點擊此處找到完整範例：[ssl-embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server)。

### 使用 keytool 生成憑證 {id="self-signed-keytool"}

您可以使用 [keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) 生成自簽憑證：

```Bash
keytool -keystore keystore.jks -alias sampleAlias -genkeypair -keyalg RSA -keysize 4096 -validity 3 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

執行此命令後，`keytool` 會建議您指定 keystore 密碼，然後生成一個 JKS 檔案。

## 將 PEM 憑證轉換為 JKS {id="convert-certificate"}

如果您的憑證頒發機構以 PEM 格式頒發憑證，您需要先將其轉換為 JKS 格式，然後再[在 Ktor 中配置 SSL](#configure-ssl-ktor)。
您可以使用 `openssl` 和 `keytool` 工具來完成此操作。
例如，如果您在 `key.pem` 檔案中有私鑰，在 `cert.pem` 中有公開憑證，則轉換過程可能如下所示：

1. 使用 `openssl` 將 PEM 轉換為 PKCS12 格式，命令如下：
   ```Bash
   openssl pkcs12 -export -in cert.pem -inkey key.pem -out keystore.p12 -name "sampleAlias"
   ```
   系統將提示您輸入 `key.pem` 的密碼，以及 `keystore.p12` 的新密碼。

2. 使用 `keytool` 將 PKCS12 轉換為 JKS 格式：
   ```Bash
   keytool -importkeystore -srckeystore keystore.p12 -srcstoretype pkcs12 -destkeystore keystore.jks
   ```
   系統將提示您輸入 `keystore.p12` 檔案的密碼，以及 `keystore.jks` 的新密碼。
   `keystore.jks` 將會被生成。

## 在 Ktor 中配置 SSL {id="configure-ssl-ktor"}

在 Ktor 中指定 SSL 設定取決於用於[配置 Ktor 伺服器](server-create-and-configure.topic)的方式：透過使用配置檔案或在程式碼中使用 `embeddedServer` 函式。

### 配置檔案 {id="config-file"}

如果您的伺服器配置在 `application.conf`
或 `application.yaml` [配置檔案](server-configuration-file.topic)中，您可以使用以下[屬性](server-configuration-file.topic#predefined-properties)啟用 SSL：

1. 使用 `ktor.deployment.sslPort` 屬性指定 SSL 埠：

   <tabs group="config">
   <tab title="application.conf" group-key="hocon">

   [object Promise]

   </tab>
   <tab title="application.yaml" group-key="yaml">

   [object Promise]

   </tab>
   </tabs>

2. 在單獨的 `security` 群組中提供 keystore 設定：

   <tabs group="config">
   <tab title="application.conf" group-key="hocon">

   [object Promise]

   </tab>
   <tab title="application.yaml" group-key="yaml">

   [object Promise]

   </tab>
   </tabs>

完整範例請參見 [ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

### embeddedServer {id="embedded-server"}

如果您使用 `embeddedServer` 函式來執行伺服器，您需要在
[ApplicationEngine.Configuration](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html)
中配置[自定義環境](server-configuration-code.topic#embedded-custom)，
並在其中使用 [sslConnector](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/ssl-connector.html) 提供 SSL 設定：

[object Promise]

完整範例請參見 [ssl-embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server)。