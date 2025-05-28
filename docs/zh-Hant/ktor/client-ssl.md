[//]: # (title: Ktor Client 中的 SSL)

<show-structure for="chapter" depth="3"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-ssl-config"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

要在 Ktor 客戶端中配置 SSL，您需要自訂客戶端使用的[引擎組態](client-engines.md#configure)。
在本主題中，我們將向您展示如何為針對 [JVM](client-engines.md#jvm) 和 [Android](client-engines.md#jvm-android) 的引擎新增 SSL 憑證。

> 若要了解如何使用 Ktor API 產生自簽章憑證，請參閱 [](server-ssl.md#self-signed)。

## 載入 SSL 設定 {id="ssl-settings"}

在本主題中，Ktor 客戶端將使用從為伺服器產生的現有 KeyStore 檔案 (`keystore.jks`) 中載入的憑證。
鑑於不同的引擎使用不同的 [JSSE API](https://docs.oracle.com/en/java/javase/17/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-B7AB25FA-7F0C-4EFA-A827-813B2CE7FBDC) 來配置 SSL（例如，Apache 的 `SSLContext` 或 Jetty 的 `TrustManager`），我們需要有能力取得相應的 SSL 配置。下面的程式碼片段建立 `SslSettings` 物件，該物件從現有的 KeyStore 檔案 (`keystore.jks`) 載入憑證並提供載入 SSL 配置的函數：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="66-90"}

## 在 Ktor 中配置 SSL {id="configure-ssl"}

在本節中，我們將了解如何為不同的引擎配置 SSL。
您可以在此處找到完整的範例：[client-ssl-config](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-ssl-config)。

### JVM {id="jvm"}

#### Apache {id="apache"}

若要為 Apache 啟用 SSL，您需要傳遞 `SSLContext`：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="20-24"}

#### Java {id="java"}

對於 Java 客戶端，將 `SSLContext` 傳遞給 `config` 區塊中的 `sslContext` 函數：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="25-31"}

#### Jetty {id="jetty"}

對於 Jetty，您需要建立一個 `SslContextFactory` 實例並傳遞 `SSLContext`：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="32-38"}

### JVM and Android {id="jvm-android"}

> 所有針對 Android 的引擎都使用[網路安全配置](https://developer.android.com/training/articles/security-config)。

#### CIO {id="cio"}

CIO 引擎允許您在 `https` 區塊中配置 HTTPS 設定。
在此區塊內，您可以存取由 [TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html) 提供的 TLS 參數。
在我們的範例中，使用 `TrustManager` 實例來配置憑證：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="39-45"}

> [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls) 範例展示了如何信任所有憑證。
> 這種方法僅應用於開發目的。

#### Android {id="android"}

Android 引擎使用 `sslManager` 屬性來配置 SSL 設定。
此屬性接受 `HttpsURLConnection` 作為參數，讓您可以傳遞 `SSLSocketFactory`：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="46-52"}

#### OkHttp {id="okhttp"}

若要配置 OkHttp 以使用 SSL，您需要將 `SSLSocketFactory` 和 `X509TrustManager` 傳遞給 `sslSocketFactory` 函數：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="53-59"}

### Darwin {id="darwin"}

若要為 Darwin 引擎配置信任的憑證，請使用 [CertificatePinner](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin.certificates/-certificate-pinner/index.html)。