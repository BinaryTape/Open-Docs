[//]: # (title: Ktor Client における SSL)

<show-structure for="chapter" depth="3"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-ssl-config"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor クライアントで SSL を構成するには、クライアントが使用する[エンジンの構成](client-engines.md#configure)をカスタマイズする必要があります。
このトピックでは、[JVM](client-engines.md#jvm) および [Android](client-engines.md#jvm-android) をターゲットとするエンジンに対して SSL 証明書を追加する方法を紹介します。

> Ktor API を使用して自己署名証明書を生成する方法については、[自己署名証明書の生成](server-ssl.md#self-signed)を参照してください。

## SSL 設定の読み込み {id="ssl-settings"}

このトピックでは、Ktor クライアントは、サーバー用に生成された既存の KeyStore ファイル（`keystore.jks`）から読み込まれた証明書を使用します。
異なるエンジンが SSL を構成するために異なる [JSSE API](https://docs.oracle.com/en/java/javase/17/security/java-secure-socket-extension-jsse-reference-guide.html#GUID-B7AB25FA-7F0C-4EFA-A827-813B2CE7FBDC) を使用する（例えば、Apache では `SSLContext`、Jetty では `TrustManager`）ことを考慮し、対応する SSL 構成を取得できるようにしておく必要があります。以下のコードスニペットは、既存の KeyStore ファイル（`keystore.jks`）から証明書を読み込み、SSL 構成を読み込むための関数を提供する `SslSettings` オブジェクトを作成します。

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

## Ktor での SSL 構成 {id="configure-ssl"}

このセクションでは、さまざまなエンジンに対して SSL を構成する方法を見ていきます。
完全な例はこちらで見ることができます: [client-ssl-config](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-ssl-config)

### JVM {id="jvm"}

#### Apache {id="apache"}

Apache で SSL を有効にするには、`SSLContext` を渡す必要があります。

```kotlin
val apacheClient = HttpClient(Apache5) {
    engine {
        sslContext = SslSettings.getSslContext()
    }
}
```

#### Java {id="java"}

Java クライアントの場合は、`config` ブロック内の `sslContext` 関数に `SSLContext` を渡します。

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

Jetty の場合は、`SslContextFactory` のインスタンスを作成し、`SSLContext` を渡す必要があります。

```kotlin
val jettyClient = HttpClient(Jetty) {
    engine {
        sslContextFactory = SslContextFactory.Client().apply {
            sslContext = SslSettings.getSslContext()
        }
    }
}
```

### JVM および Android {id="jvm-android"}

> Android をターゲットとするすべてのエンジンは、[ネットワークセキュリティ構成](https://developer.android.com/training/articles/security-config)を使用します。

#### CIO {id="cio"}

CIO エンジンでは、`https` ブロック内で HTTPS 設定を構成できます。
このブロック内では、[TLSConfigBuilder](https://api.ktor.io/ktor-network-tls/io.ktor.network.tls/-t-l-s-config-builder/index.html) によって提供される TLS パラメータにアクセスできます。
この例では、`TrustManager` インスタンスを使用して証明書を構成しています。

```kotlin
val cioClient = HttpClient(CIO) {
    engine {
        https {
            trustManager = SslSettings.getTrustManager()
        }
    }
}
```

> [sockets-client-tls](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/sockets-client-tls) の例では、すべての証明書を信頼する方法を示しています。
> このアプローチは開発目的のみに使用してください。

#### Android {id="android"}

Android エンジンは、SSL 設定を構成するために `sslManager` プロパティを使用します。 
このプロパティは、`SSLSocketFactory` を渡すことができる `HttpsURLConnection` をパラメータとして受け取ります。

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

OkHttp で SSL を使用するように構成するには、`sslSocketFactory` 関数に `SSLSocketFactory` と `X509TrustManager` を渡す必要があります。

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

Darwin エンジンで信頼済み証明書を構成するには、[CertificatePinner](https://api.ktor.io/ktor-client-darwin/io.ktor.client.engine.darwin.certificates/-certificate-pinner/index.html) を使用します。