[//]: # (title: Ktor 客户端中的 SSL)

<show-structure for="chapter" depth="3"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-ssl-config"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

要在 Ktor 客户端中配置 SSL，你需要自定义客户端使用的[引擎配置](client-engines.md#configure)。
在本主题中，我们将展示如何为目标为 [JVM](client-engines.md#jvm) 和 [Android](client-engines.md#jvm-android) 的引擎添加 SSL 证书。

> 要了解如何使用 Ktor API 生成自签名证书，请参阅 [](server-ssl.md#self-signed)。

## 加载 SSL 设置 {id="ssl-settings"}

在本主题中，Ktor 客户端将使用从为服务器生成的现有 KeyStore 文件 (`keystore.jks`) 中加载的证书。
鉴于不同的引擎使用不同的 [JSSE API](https://docs.oracle.com/en/java/javase/17/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-B7AB25FA-7F0C-4EFA-A827-813B2CE7FBDC) 来配置 SSL（例如，Apache 使用 `SSLContext`，Jetty 使用 `TrustManager`），我们需要具备获取相应 SSL 配置的能力。下面的代码片段创建了 `SslSettings` 对象，该对象从现有 KeyStore 文件 (`keystore.jks`) 中加载证书，并提供了用于加载 SSL 配置的函数：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="66-90"}

## 在 Ktor 中配置 SSL {id="configure-ssl"}

在本节中，我们将看到如何为不同的引擎配置 SSL。
你可以在此处找到完整的示例：[client-ssl-config](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-ssl-config)。

### JVM {id="jvm"}

#### Apache {id="apache"}

要为 Apache 启用 SSL，你需要传入 `SSLContext`：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="20-24"}

#### Java {id="java"}

对于 Java 客户端，将 `SSLContext` 传入 `config` 块内的 `sslContext` 函数：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="25-31"}

#### Jetty {id="jetty"}

对于 Jetty，你需要创建一个 `SslContextFactory` 实例并传入 `SSLContext`：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="32-38"}

### JVM 和 Android {id="jvm-android"}

> 所有面向 Android 的引擎都使用 [网络安全配置](https://developer.android.com/training/articles/security-config)。

#### CIO {id="cio"}

CIO 引擎允许你在 `https` 块内配置 HTTPS 设置。
在此块内，你可以访问 [TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html) 提供的 TLS 参数。
在我们的示例中，使用 `TrustManager` 实例来配置证书：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="39-45"}

> [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls) 示例展示了如何信任所有证书。
> 这种方法应仅用于开发目的。

#### Android {id="android"}

Android 引擎使用 `sslManager` 属性来配置 SSL 设置。
此属性接受 `HttpsURLConnection` 作为参数，允许你传入 `SSLSocketFactory`：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="46-52"}

#### OkHttp {id="okhttp"}

要配置 OkHttp 使用 SSL，你需要将 `SSLSocketFactory` 和 `X509TrustManager` 传入 `sslSocketFactory` 函数：

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="53-59"}

### Darwin {id="darwin"}

要为 Darwin 引擎配置受信任的证书，请使用 [CertificatePinner](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin.certificates/-certificate-pinner/index.html)。