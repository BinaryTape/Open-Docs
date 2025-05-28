[//]: # (title: Ktor ClientにおけるSSL)

<show-structure for="chapter" depth="3"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-ssl-config"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

KtorクライアントでSSLを設定するには、クライアントで使用される[エンジンの構成](client-engines.md#configure)をカスタマイズする必要があります。
このトピックでは、[JVM](client-engines.md#jvm)および[Android](client-engines.md#jvm-android)をターゲットとするエンジンにSSL証明書を追加する方法を説明します。

> Ktor APIを使用して自己署名証明書を生成する方法については、[](server-ssl.md#self-signed)を参照してください。

## SSL設定のロード {id="ssl-settings"}

このトピックでは、Ktorクライアントはサーバー用に生成された既存のKeyStoreファイル（`keystore.jks`）からロードされた証明書を使用します。
異なるエンジンがSSLを設定するために異なる[JSSE API](https://docs.oracle.com/en/java/javase/17/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-B7AB25FA-7F0C-4EFA-A827-813B2CE7FBDC)を使用するため（例えば、Apacheには`SSLContext`、Jettyには`TrustManager`）、対応するSSL構成を取得する機能が必要です。以下のコードスニペットは、既存のKeyStoreファイル（`keystore.jks`）から証明書をロードし、SSL構成をロードするための関数を提供する`SslSettings`オブジェクトを作成します。

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="66-90"}

## KtorにおけるSSLの設定 {id="configure-ssl"}

このセクションでは、さまざまなエンジンにSSLを設定する方法を見ていきます。
完全な例はこちらで確認できます: [client-ssl-config](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-ssl-config)。

### JVM {id="jvm"}

#### Apache {id="apache"}

ApacheでSSLを有効にするには、`SSLContext`を渡す必要があります。

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="20-24"}

#### Java {id="java"}

Javaクライアントの場合、`SSLContext`を`config`ブロック内の`sslContext`関数に渡します。

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="25-31"}

#### Jetty {id="jetty"}

Jettyの場合、`SslContextFactory`のインスタンスを作成し、`SSLContext`を渡す必要があります。

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="32-38"}

### JVMおよびAndroid {id="jvm-android"}

> Androidをターゲットとするすべてのエンジンは、[ネットワークセキュリティ構成](https://developer.android.com/training/articles/security-config)を使用します。

#### CIO {id="cio"}

CIOエンジンでは、`https`ブロック内でHTTPS設定を構成できます。
このブロック内では、[TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html)によって提供されるTLSパラメータにアクセスできます。
この例では、`TrustManager`インスタンスを使用して証明書を構成します。

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="39-45"}

> [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)の例では、すべての証明書を信頼する方法が示されています。
> このアプローチは、開発目的でのみ使用してください。

#### Android {id="android"}

Androidエンジンは、`sslManager`プロパティを使用してSSL設定を構成します。
このプロパティは、`SSLSocketFactory`を渡すことができる`HttpsURLConnection`をパラメータとして受け取ります。

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="46-52"}

#### OkHttp {id="okhttp"}

OkHttpでSSLを使用するように設定するには、`SSLSocketFactory`と`X509TrustManager`を`sslSocketFactory`関数に渡す必要があります。

```kotlin
```
{src="snippets/client-ssl-config/src/main/kotlin/com/example/Application.kt" include-lines="53-59"}

### Darwin {id="darwin"}

Darwinエンジンで信頼できる証明書を設定するには、[CertificatePinner](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin.certificates/-certificate-pinner/index.html)を使用します。