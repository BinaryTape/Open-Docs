[//]: # (title: Ktor Client 中的 SSL)

<show-structure for="chapter" depth="3"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-ssl-config"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

為了在 Ktor client 中配置 SSL，您需要自訂 client 所使用的[引擎配置](client-engines.md#configure)。
在本主題中，我們將向您展示如何為目標為 [JVM](client-engines.md#jvm) 和 [Android](client-engines.md#jvm-android) 的引擎新增 SSL 憑證。

> 若要了解如何使用 Ktor API 產生自簽憑證，請參閱 [](server-ssl.md#self-signed)。

## 載入 SSL 設定 {id="ssl-settings"}

在本主題中，Ktor client 將使用從為伺服器產生的現有 KeyStore 檔案 (`keystore.jks`) 載入的憑證。
由於不同的引擎使用不同的 [JSSE API](https://docs.oracle.com/en/java/javase/17/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-B7AB25FA-7F0C-4EFA-A827-813B2CE7FBDC) 來配置 SSL (例如，Apache 的 `SSLContext` 或 Jetty 的 `TrustManager`)，因此我們需要能夠取得相應的 SSL 配置。下面的程式碼片段建立了 `SslSettings` 物件，該物件從現有的 KeyStore 檔案 (`keystore.jks`) 載入憑證，並提供用於載入 SSL 配置的函式：

[object Promise]

## 在 Ktor 中配置 SSL {id="configure-ssl"}

在本節中，我們將了解如何為不同的引擎配置 SSL。
您可以在此處找到完整的範例：[client-ssl-config](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-ssl-config)。

### JVM {id="jvm"}

#### Apache {id="apache"}

要為 Apache 啟用 SSL，您需要傳遞 `SSLContext`：

[object Promise]

#### Java {id="java"}

對於 Java client，將 `SSLContext` 傳遞給 `config` 區塊內的 `sslContext` 函式：

[object Promise]

#### Jetty {id="jetty"}

對於 Jetty，您需要建立 `SslContextFactory` 的實例並傳遞 `SSLContext`：

[object Promise]

### JVM 和 Android {id="jvm-android"}

> 所有目標為 Android 的引擎都使用[網路安全配置](https://developer.android.com/training/articles/security-config)。

#### CIO {id="cio"}

CIO 引擎允許您在 `https` 區塊內配置 HTTPS 設定。
在此區塊內，您可以存取由 [TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html) 提供的 TLS 參數。
在我們的範例中，`TrustManager` 實例用於配置憑證：

[object Promise]

> [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls) 範例展示了如何信任所有憑證。
> 此方法僅應用於開發目的。

#### Android {id="android"}

Android 引擎使用 `sslManager` 屬性來配置 SSL 設定。
此屬性接受 `HttpsURLConnection` 作為參數，允許您傳遞 `SSLSocketFactory`：

[object Promise]

#### OkHttp {id="okhttp"}

要配置 OkHttp 以使用 SSL，您需要將 `SSLSocketFactory` 和 `X509TrustManager` 傳遞給 `sslSocketFactory` 函式：

[object Promise]

### Darwin {id="darwin"}

要為 Darwin 引擎配置信任的憑證，請使用 [CertificatePinner](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin.certificates/-certificate-pinner/index.html)。