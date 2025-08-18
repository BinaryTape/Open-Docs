[//]: # (title: Ktor ClientにおけるSSL)

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

KtorクライアントでSSLを構成するには、クライアントで使用される[エンジンの設定](client-engines.md#configure)をカスタマイズする必要があります。
このトピックでは、[JVM](client-engines.md#jvm)および[Android](client-engines.md#jvm-android)をターゲットとするエンジンにSSL証明書を追加する方法を説明します。

> Ktor APIを使用して自己署名証明書を生成する方法については、[自己署名証明書を生成する](server-ssl.md#self-signed)を参照してください。

## SSL設定の読み込み {id="ssl-settings"}

このトピックでは、Ktorクライアントは、サーバー用に生成された既存のKeyStoreファイル（`keystore.jks`）からロードされた証明書を使用します。
異なるエンジンがSSLを構成するために異なる[JSSE API](https://docs.oracle.com/en/java/javase/17/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-B7AB25FA-7F0C-4EFA-A827-813B2CE7FBDC)を使用しているため（例：Apacheの場合は`SSLContext`、Jettyの場合は`TrustManager`）、対応するSSL設定を取得する機能が必要です。以下のコードスニペットは、既存のKeyStoreファイル（`keystore.jks`）から証明書をロードし、SSL設定をロードするための関数を提供する`SslSettings`オブジェクトを作成します。

```kotlin
object SslSettings {
    fun getKeyStore(): KeyStore {
        val keyStoreFile = FileInputStream("keystore.jks")
        val keyStorePassword = "foobar".toCharArray()
        val keyStore: KeyStore = KeyStore.getInstance(KeyStore.getDefaultType())
        keyStore.load(keyStoreFile, keyStorePassword)
        return keyStore
    }

    fun getTrustManagerFactory(): TrustManagerFactory? {
        val trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
        trustManagerFactory.init(getKeyStore())
        return trustManagerFactory
    }

    fun getSslContext(): SSLContext? {
        val sslContext = SSLContext.getInstance("TLS")
        sslContext.init(null, getTrustManagerFactory()?.trustManagers, null)
        return sslContext
    }

    fun getTrustManager(): X509TrustManager {
        return getTrustManagerFactory()?.trustManagers?.first { it is X509TrustManager } as X509TrustManager
    }
}
```

## KtorにおけるSSLの構成 {id="configure-ssl"}

このセクションでは、異なるエンジンに対してSSLを構成する方法を見ていきます。
完全な例はこちらにあります: [client-ssl-config](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-ssl-config)。

### JVM {id="jvm"}

#### Apache {id="apache"}

ApacheでSSLを有効にするには、`SSLContext`を渡す必要があります。

```kotlin
val apacheClient = HttpClient(Apache5) {
    engine {
        sslContext = SslSettings.getSslContext()
    }
}
```

#### Java {id="java"}

Javaクライアントの場合、`config`ブロック内の`sslContext`関数に`SSLContext`を渡します。

```kotlin
val javaClient = HttpClient(Java) {
    engine {
        config {
            sslContext(SslSettings.getSslContext())
        }
    }
}
```

#### Jetty {id="jetty"}

Jettyの場合、`SslContextFactory`のインスタンスを作成し、`SSLContext`を渡す必要があります。

```kotlin
val jettyClient = HttpClient(Jetty) {
    engine {
        sslContextFactory = SslContextFactory.Client().apply {
            sslContext = SslSettings.getSslContext()
        }
    }
}
```

### JVMおよびAndroid {id="jvm-android"}

> Androidをターゲットとするすべてのエンジンは、[ネットワークセキュリティ構成](https://developer.android.com/training/articles/security-config)を使用します。

#### CIO {id="cio"}

CIOエンジンでは、`https`ブロック内でHTTPS設定を構成できます。
このブロック内では、[TLSConfigBuilder](https://api.ktor.io/ktor-network/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html)が提供するTLSパラメータにアクセスできます。
この例では、`TrustManager`インスタンスが証明書を構成するために使用されます。

```kotlin
val cioClient = HttpClient(CIO) {
    engine {
        https {
            trustManager = SslSettings.getTrustManager()
        }
    }
}
```

> [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/sockets-client-tls)の例は、すべての証明書を信頼する方法を示しています。
> このアプローチは開発目的でのみ使用してください。

#### Android {id="android"}

Androidエンジンは、SSL設定を構成するために`sslManager`プロパティを使用します。
このプロパティは、パラメータとして`HttpsURLConnection`を受け入れ、`SSLSocketFactory`を渡すことができます。

```kotlin
val androidClient = HttpClient(Android) {
    engine {
        sslManager = { httpsURLConnection ->
            httpsURLConnection.sslSocketFactory = SslSettings.getSslContext()?.socketFactory
        }
    }
}
```

#### OkHttp {id="okhttp"}

OkHttpでSSLを使用するように構成するには、`SSLSocketFactory`と`X509TrustManager`を`sslSocketFactory`関数に渡す必要があります。

```kotlin
val okHttpClient = HttpClient(OkHttp) {
    engine {
        config {
            sslSocketFactory(SslSettings.getSslContext()!!.socketFactory, SslSettings.getTrustManager())
        }
    }
}
```

### Darwin {id="darwin"}

Darwinエンジンで信頼された証明書を構成するには、[CertificatePinner](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin.certificates/-certificate-pinner/index.html)を使用します。