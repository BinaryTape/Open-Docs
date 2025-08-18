[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>コード例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2)は、HTTP/1.xの後継として設計された、最新のバイナリ二重多重化プロトコルです。

JettyおよびNettyエンジンは、Ktorが利用できるHTTP/2実装を提供します。ただし、これらには大きな違いがあり、各エンジンには追加の設定が必要です。ホストがKtor用に適切に設定されると、HTTP/2のサポートが自動的に有効になります。

主な要件:

*   SSL証明書（自己署名でも可）。
*   特定のエンジンに適したALPN実装（NettyとJettyの対応するセクションを参照）。

## SSL証明書 {id="ssl_certificate"}

仕様によると、HTTP/2は暗号化を必須としませんが、すべてのブラウザはHTTP/2で使用するために暗号化された接続を要求します。そのため、動作するTLS環境がHTTP/2を有効にするための前提条件となります。したがって、暗号化を有効にするには証明書が必要です。テスト目的の場合、JDKの`keytool`を使用して生成できます...

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

...または[buildKeyStore](server-ssl.md)関数を使用します。

次のステップは、Ktorがキーストアを使用するように設定することです。例の`application.conf` / `application.yaml` [設定ファイル](server-configuration-file.topic)を参照してください。

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

## ALPN実装 {id="apln_implementation"}

HTTP/2を有効にするには、ALPN ([Application-Layer Protocol Negotiation](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation)) が有効になっている必要があります。最初のオプションは、ブートクラスパスに追加する必要がある外部のALPN実装を使用することです。もう1つのオプションは、OpenSSLネイティブバインディングとプリコンパイルされたネイティブバイナリを使用することです。また、特定のエンジンはこれらの方法のいずれか1つしかサポートしない場合があります。

### Jetty {id="jetty"}

Java 8以降でALPN APIがサポートされているため、JettyエンジンはHTTP/2を使用するための特定の設定を必要としません。したがって、次のことを行うだけです。
1.  Jettyエンジンで[サーバーを作成](server-engines.md#choose-create-server)します。
2.  [SSL証明書](#ssl_certificate)で説明されているようにSSL設定を追加します。
3.  `sslPort`を設定します。

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty)実行可能な例は、JettyのHTTP/2サポートを示しています。

### Netty {id="netty"}

NettyでHTTP/2を有効にするには、OpenSSLバインディング ([tcnative netty port](https://netty.io/wiki/forked-tomcat-native.html)) を使用します。以下の例は、ネイティブ実装（OpenSSLのフォークである静的リンクされたBoringSSLライブラリ）を`build.gradle.kts`ファイルに追加する方法を示しています。

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

`tc.native.classifier`は、`linux-x86_64`、`osx-x86_64`、または`windows-x86_64`のいずれかである必要があります。[http2-netty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty)実行可能な例は、NettyのHTTP/2サポートを有効にする方法を示しています。