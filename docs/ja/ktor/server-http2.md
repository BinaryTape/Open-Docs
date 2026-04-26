[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>コード例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) は、HTTP/1.x の代替として設計された、最新のバイナリ双方向マルチプレキシングプロトコルです。

Jetty および Netty エンジンは、Ktor で使用可能な HTTP/2 実装を提供しています。ただし、エンジンごとに大きな違いがあり、それぞれに追加の設定が必要です。
ホストが Ktor に対して適切に設定されると、HTTP/2 サポートは自動的に有効化されます。

主な要件:

* SSL 証明書（自己署名証明書でも可）。
* 特定のエンジンに適した ALPN 実装（Netty および Jetty の対応するセクションを参照）。

## SSL 証明書 {id="ssl_certificate"}

仕様では HTTP/2 に暗号化は必須ではありませんが、すべてのブラウザにおいて HTTP/2 を使用するには暗号化された接続が必要となります。
そのため、HTTP/2 を有効にするには、稼働する TLS 環境が前提条件となります。したがって、暗号化を有効にするために証明書が必要です。
テスト目的であれば、JDK の `keytool` を使用して生成できます...

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

... または [buildKeyStore](server-ssl.md) 関数を使用することでも生成可能です。

次のステップは、作成したキーストアを使用するように Ktor を設定することです。以下の `application.conf` / `application.yaml` [設定ファイル](server-configuration-file.topic) の例を確認してください。

<Tabs group="config">
<TabItem title="application.conf" group-key="hocon">

```shell
ktor {
    deployment {
        port = 8080
        sslPort = 8443
    }

    application {
        modules = [ com.example.ApplicationKt.main ]
    }

    security {
        ssl {
            keyStore = test.jks
            keyAlias = testkey
            keyStorePassword = foobar
            privateKeyPassword = foobar
        }
    }
}

```

</TabItem>
<TabItem title="application.yaml" group-key="yaml">

```yaml
ktor:
    deployment:
        port: 8080
        sslPort: 8443
    application:
        modules:
            - com.example.ApplicationKt.main

    security:
        ssl:
            keyStore: test.jks
            keyAlias: testkey
            keyStorePassword: foobar
            privateKeyPassword: foobar
```

</TabItem>
</Tabs>

## ALPN 実装 {id="apln_implementation"}

HTTP/2 では、ALPN（[Application-Layer Protocol Negotiation](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation)）を有効にする必要があります。1 つ目のオプションは、ブートクラスパスに追加する必要がある外部 ALPN 実装を使用することです。
もう 1 つのオプションは、OpenSSL ネイティブバインディングとプリコンパイル済みのネイティブバイナリを使用することです。
また、各エンジンはいずれか一方の方法のみをサポートしています。

### Jetty {id="jetty"}

ALPN API は Java 8 以降でサポートされているため、Jetty エンジンで HTTP/2 を使用するために特別な設定は必要ありません。したがって、以下の手順のみが必要となります。
1. Jetty エンジンを使用して [サーバーを作成](server-engines.md#choose-create-server) します。
2. [SSL 証明書](#ssl_certificate) で説明されているように SSL 設定を追加します。
3. `sslPort` を設定します。

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-jetty) の実行可能なサンプルで、Jetty の HTTP/2 サポートを確認できます。

### Netty {id="netty"}

Netty で HTTP/2 を有効にするには、OpenSSL バインディング（[tcnative netty port](https://netty.io/wiki/forked-tomcat-native.html)）を使用します。
以下の例は、`build.gradle.kts` ファイルにネイティブ実装（OpenSSL のフォークである、静的にリンクされた BoringSSL ライブラリ）を追加する方法を示しています。

```kotlin
val osName = System.getProperty("os.name").lowercase()
val tcnative_classifier = when {
    osName.contains("win") -> "windows-x86_64"
    osName.contains("linux") -> "linux-x86_64"
    osName.contains("mac") -> "osx-x86_64"
    else -> null
}

dependencies {
    if (tcnative_classifier != null) {
        implementation("io.netty:netty-tcnative-boringssl-static:$tcnative_version:$tcnative_classifier")
    } else {
        implementation("io.netty:netty-tcnative-boringssl-static:$tcnative_version")
    }
}
```

`tc.native.classifier` は、`linux-x86_64`、`osx-x86_64`、`windows-x86_64` のいずれかである必要があります。
[http2-netty](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-netty) の実行可能なサンプルで、Netty の HTTP/2 サポートを有効にする方法を確認できます。

#### TLS なしの HTTP/2

Netty エンジンは、[HTTP/2 over cleartext (h2c)](https://httpwg.org/specs/rfc7540.html#discover-http) もサポートしています。
これにより、暗号化が不要なプライベートネットワーク内などで、TLS なしで HTTP/2 通信を行うことができます。
クライアントは HTTP/1.1 リクエストで通信を開始し、その後 HTTP/2 にアップグレードできます。

h2c を有効にするには、エンジン設定で `enableH2c` フラグを `true` に設定します。

```kotlin
embeddedServer(Netty, configure = {
    connector {
        port = 8080
    }
    enableHttp2 = true
    enableH2c = true
})
```

h2c には `enableHttp2 = true` が必要であり、サーバーに SSL コネクタが設定されている場合は使用できないことに注意してください。