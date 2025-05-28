[//]: # (title: Ktor 伺服器中的 SSL 與憑證)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>必備依賴</b>: <code>io.ktor:ktor-network-tls-certificates</code>
</p>
<p>
<b>程式碼範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main">ssl-engine-main</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server">ssl-embedded-server</a>
</p>
</tldr>

在大多數情況下，您的 Ktor 服務會置於反向代理 (reverse proxy) 後方，例如 Nginx 或 Apache。
這表示反向代理伺服器負責處理安全考量，包括 SSL。

如果有必要，您可以透過提供憑證路徑來配置 Ktor 直接提供 SSL 服務。
Ktor 使用 [Java KeyStore (JKS)](https://docs.oracle.com/javase/8/docs/api/java/security/KeyStore.html) 作為憑證的儲存設施 (storage facility)。
您可以使用 [keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) 來轉換和管理儲存在 KeyStore 中的憑證。
如果您需要將憑證頒發機構 (certificate authority) 頒發的 PEM 憑證轉換為 Ktor 支援的 JKS 格式，這可能會很有用。

> 您可以使用 _Let's Encrypt_ 來取得免費憑證，以透過 Ktor 提供 `https://` 和 `wss://` 請求服務。

## 產生自簽章憑證 {id="self-signed"}

### 在程式碼中產生憑證 {id="self-signed-code"}

Ktor 透過呼叫 [buildKeyStore](https://api.ktor.io/ktor-network/ktor-network-tls/ktor-network-tls-certificates/io.ktor.network.tls.certificates/build-key-store.html) 函數，提供產生用於測試目的的自簽章憑證 (self-signed certificate) 的能力，該函數會回傳一個 [KeyStore](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/security/KeyStore.html) 實例 (instance)。
若要使用此函數，您需要在建置腳本 (build script) 中加入 `ktor-network-tls-certificates` 構件 (artifact)：

<var name="artifact_name" value="ktor-network-tls-certificates"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

下方的程式碼片段展示了如何產生憑證並將其儲存到金鑰儲存 (keystore) 檔案中：

```kotlin
```

{src="snippets/ssl-embedded-server/src/main/kotlin/com/example/Application.kt" include-lines="19-28,41"}

由於 Ktor 在啟動時需要憑證，您必須在啟動伺服器之前建立憑證。
您可以在此處找到完整的範例：[ssl-embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server)。

### 使用 keytool 產生憑證 {id="self-signed-keytool"}

您可以使用 [keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) 來產生自簽章憑證 (self-signed certificate)：

```Bash
keytool -keystore keystore.jks -alias sampleAlias -genkeypair -keyalg RSA -keysize 4096 -validity 3 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

執行此命令後，`keytool` 會建議您指定金鑰儲存密碼 (keystore password)，然後產生一個 JKS 檔案。

## 將 PEM 憑證轉換為 JKS {id="convert-certificate"}

如果您的憑證頒發機構 (certificate authority) 以 PEM 格式頒發憑證，您需要在 [Ktor 中配置 SSL](#configure-ssl-ktor) 之前將其轉換為 JKS 格式。
您可以使用 `openssl` 和 `keytool` 工具來執行此操作。
例如，如果您在 `key.pem` 檔案中有一個私鑰 (private key)，在 `cert.pem` 檔案中有一個公開憑證 (public certificate)，則轉換過程可能如下所示：

1.  使用 `openssl` 將 PEM 轉換為 PKCS12 格式，使用以下命令：
    ```Bash
    openssl pkcs12 -export -in cert.pem -inkey key.pem -out keystore.p12 -name "sampleAlias"
    ```
    系統將提示您輸入 `key.pem` 的密碼 (passphrase) 以及 `keystore.p12` 的新密碼。

2.  使用 `keytool` 將 PKCS12 轉換為 JKS 格式：
    ```Bash
    keytool -importkeystore -srckeystore keystore.p12 -srcstoretype pkcs12 -destkeystore keystore.jks
    ```
    系統將提示您輸入 `keystore.p12` 檔案的密碼，以及 `keystore.jks` 的新密碼。
    `keystore.jks` 將會產生。

## 在 Ktor 中配置 SSL {id="configure-ssl-ktor"}

在 Ktor 中指定 SSL 設定取決於 [配置 Ktor 伺服器](server-create-and-configure.topic) 的方式：透過使用配置檔案 (configuration file) 或在程式碼中使用 `embeddedServer` 函數。

### 配置檔案 {id="config-file"}

如果您的伺服器配置在 `application.conf` 或 `application.yaml` [配置檔案](server-configuration-file.topic) 中，您可以使用以下 [屬性](server-configuration-file.topic#predefined-properties) 來啟用 SSL：

1.  使用 `ktor.deployment.sslPort` 屬性指定 SSL 埠號 (port)：

    <tabs group="config">
    <tab title="application.conf" group-key="hocon">

    ```shell
    ```
    {style="block" src="snippets/ssl-engine-main/src/main/resources/application.conf" include-lines="1-2,4-5,18"}

    </tab>
    <tab title="application.yaml" group-key="yaml">

    ```yaml
    ```
    {style="block" src="snippets/ssl-engine-main/src/main/resources/_application.yaml" include-lines="1-2,4"}

    </tab>
    </tabs>

2.  在單獨的 `security` 群組中提供金鑰儲存 (keystore) 設定：

    <tabs group="config">
    <tab title="application.conf" group-key="hocon">

    ```shell
    ```
    {style="block" src="snippets/ssl-engine-main/src/main/resources/application.conf" include-lines="1,10-18"}

    </tab>
    <tab title="application.yaml" group-key="yaml">

    ```yaml
    ```
    {style="block" src="snippets/ssl-engine-main/src/main/resources/_application.yaml" include-lines="1,9-14"}

    </tab>
    </tabs>

如需完整範例，請參閱 [ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

### embeddedServer {id="embedded-server"}

如果您使用 `embeddedServer` 函數來執行伺服器，您需要在 [ApplicationEngine.Configuration](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html) 中配置一個 [自訂環境 (custom environment)](server-configuration-code.topic#embedded-custom)，並在其中使用 [sslConnector](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/ssl-connector.html) 提供 SSL 設定：

```kotlin
```

{src="snippets/ssl-embedded-server/src/main/kotlin/com/example/Application.kt" include-lines="3-41"}

如需完整範例，請參閱 [ssl-embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server)。