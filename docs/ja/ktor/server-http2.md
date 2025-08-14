[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>コード例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2)は、HTTP/1.xに代わるものとして設計された、最新のバイナリの双方向多重化プロトコルです。

JettyおよびNettyエンジンは、Ktorが使用できるHTTP/2の実装を提供します。しかし、両者には大きな違いがあり、各エンジンに追加の設定が必要です。ホストがKtor用に適切に設定されると、HTTP/2のサポートは自動的に有効化されます。

主な要件:

*   SSL証明書（自己署名でも可）。
*   特定のエンジンに適したALPN実装（NettyとJettyの対応するセクションを参照）。

## SSL証明書 {id="ssl_certificate"}

仕様上、HTTP/2は暗号化を必須とはしていませんが、すべてのブラウザはHTTP/2と使用するために暗号化された接続を要求します。そのため、動作するTLS環境がHTTP/2を有効にするための前提条件となります。したがって、暗号化を有効にするには証明書が必要です。テスト目的であれば、JDKの`keytool`で生成できます...

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

...または[buildKeyStore](server-ssl.md)関数を使用します。

次のステップは、Ktorでキーストアを使用するように設定することです。例として、`application.conf` / `application.yaml` [設定ファイル](server-configuration-file.topic)を参照してください。

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

## ALPNの実装 {id="apln_implementation"}

HTTP/2を有効にするには、ALPN ([Application-Layer Protocol Negotiation](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation))を有効にする必要があります。最初の選択肢は、ブートクラスパスに追加する必要がある外部ALPN実装を使用することです。もう1つの選択肢は、OpenSSLネイティブバインディングとプリコンパイルされたネイティブバイナリを使用することです。また、各特定のエンジンはこれらの方法のいずれか1つしかサポートできません。

### Jetty {id="jetty"}

Java 8からALPN APIがサポートされているため、JettyエンジンはHTTP/2を使用するための特別な設定を必要としません。したがって、次のことだけが必要です。
1.  Jettyエンジンで[サーバーを作成します](server-engines.md#choose-create-server)。
2.  [](#ssl_certificate)に記載されているように、SSL設定を追加します。
3.  `sslPort`を設定します。

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty)の実行可能な例は、JettyにおけるHTTP/2のサポートを示しています。

### Netty {id="netty"}

NettyでHTTP/2を有効にするには、OpenSSLバインディング（[tcnative netty port](https://netty.io/wiki/forked-tomcat-native.html)）を使用します。
以下の例は、ネイティブ実装（OpenSSLのフォークである静的リンクされたBoringSSLライブラリ）を`build.gradle.kts`ファイルに追加する方法を示しています。

[object Promise]

`tc.native.classifier`は、`linux-x86_64`、`osx-x86_64`、または`windows-x86_64`のいずれかである必要があります。
[http2-netty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty)の実行可能な例は、NettyでHTTP/2のサポートを有効にする方法を示しています。

    ```