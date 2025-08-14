[//]: # (title: KtorクライアントにおけるSSL)

<show-structure for="chapter" depth="3"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-ssl-config"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

KtorクライアントでSSLを設定するには、クライアントが使用する[エンジンの設定](client-engines.md#configure)をカスタマイズする必要があります。
このトピックでは、[JVM](client-engines.md#jvm)および[Android](client-engines.md#jvm-android)をターゲットとするエンジンにSSL証明書を追加する方法を示します。

> Ktor APIを使用して自己署名証明書を生成する方法については、[](server-ssl.md#self-signed)を参照してください。

## SSL設定の読み込み {id="ssl-settings"}

このトピックでは、Ktorクライアントは、サーバー用に生成された既存のKeyStoreファイル (`keystore.jks`) から読み込まれた証明書を使用します。
異なるエンジンがSSLを設定するために異なる[JSSE API](https://docs.oracle.com/en/java/javase/17/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-B7AB25FA-7F0C-4EFA-A827-813B2CE7FBDC)（例えば、Apacheの場合は`SSLContext`、Jettyの場合は`TrustManager`）を使用することを考えると、対応するSSL設定を取得できる必要があります。以下のコードスニペットは、既存のKeyStoreファイル (`keystore.jks`) から証明書を読み込み、SSL設定を読み込むための関数を提供する`SslSettings`オブジェクトを作成します。

[object Promise]

## KtorでSSLを設定する {id="configure-ssl"}

このセクションでは、さまざまなエンジンでSSLを設定する方法を見ていきます。
完全な例はこちらにあります：[client-ssl-config](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-ssl-config)。

### JVM {id="jvm"}

#### Apache {id="apache"}

ApacheでSSLを有効にするには、`SSLContext`を渡す必要があります。

[object Promise]

#### Java {id="java"}

Javaクライアントの場合、`config`ブロック内の`sslContext`関数に`SSLContext`を渡します。

[object Promise]

#### Jetty {id="jetty"}

Jettyの場合、`SslContextFactory`のインスタンスを作成し、`SSLContext`を渡す必要があります。

[object Promise]

### JVMおよびAndroid {id="jvm-android"}

> Androidをターゲットとするすべてのエンジンは、[ネットワークセキュリティ構成](https://developer.android.com/training/articles/security-config)を使用します。

#### CIO {id="cio"}

CIOエンジンでは、`https`ブロック内でHTTPS設定を構成できます。
このブロック内で、[TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html)によって提供されるTLSパラメータにアクセスできます。
この例では、証明書を設定するために`TrustManager`インスタンスが使用されます。

[object Promise]

> [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)の例では、すべての証明書を信頼する方法を示しています。
> このアプローチは開発目的のみに使用してください。

#### Android {id="android"}

Androidエンジンは、SSL設定を構成するために`sslManager`プロパティを使用します。
このプロパティは、`SSLSocketFactory`を渡すことができる`HttpsURLConnection`をパラメータとして受け入れます。

[object Promise]

#### OkHttp {id="okhttp"}

OkHttpでSSLを使用するように設定するには、`SSLSocketFactory`と`X509TrustManager`を`sslSocketFactory`関数に渡す必要があります。

[object Promise]

### Darwin {id="darwin"}

Darwinエンジンで信頼された証明書を設定するには、[CertificatePinner](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin.certificates/-certificate-pinner/index.html)を使用します。