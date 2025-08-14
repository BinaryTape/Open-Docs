[//]: # (title: KtorサーバーにおけるSSLと証明書)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-network-tls-certificates</code>
</p>
<p>
<b>コード例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main">ssl-engine-main</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server">ssl-embedded-server</a>
</p>
</tldr>

多くの場合、KtorサービスはNginxやApacheなどのリバースプロキシの背後に配置されます。
これは、リバースプロキシサーバーがSSLを含むセキュリティ上の懸念を処理することを意味します。

必要に応じて、Ktorが直接SSLを提供できるように、証明書へのパスを提供して設定できます。
Ktorは、証明書のストレージ機能として[Java KeyStore (JKS)](https://docs.oracle.com/javase/8/docs/api/java/security/KeyStore.html)を使用します。
KeyStoreに保存されている証明書を変換および管理するには、[keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html)を使用できます。
これは、認証局によって発行されたPEM証明書をKtorでサポートされているJKS形式に変換する必要がある場合に役立つことがあります。

> Ktorで`https://`および`wss://`リクエストを提供するために、_Let's Encrypt_を使用して無料の証明書を取得できます。

## 自己署名証明書を生成する {id="self-signed"}

### コードで証明書を生成する {id="self-signed-code"}

Ktorは、テスト目的で自己署名証明書を生成する機能を提供しており、これは[buildKeyStore](https://api.ktor.io/ktor-network/ktor-network-tls/ktor-network-tls-certificates/io.ktor.network.tls.certificates/build-key-store.html)関数を呼び出すことで可能になります。この関数は[KeyStore](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/security/KeyStore.html)インスタンスを返します。
この関数を使用するには、ビルドスクリプトに`ktor-network-tls-certificates`アーティファクトを追加する必要があります。

<var name="artifact_name" value="ktor-network-tls-certificates"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

以下のコードスニペットは、証明書を生成してキーストアファイルに保存する方法を示しています。

[object Promise]

Ktorは起動時に証明書を必要とするため、サーバーを起動する前に証明書を作成する必要があります。
完全な例は、こちらで見つけることができます: [ssl-embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server)。

### keytoolを使用して証明書を生成する {id="self-signed-keytool"}

自己署名証明書を生成するには、[keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html)を使用できます。

```Bash
keytool -keystore keystore.jks -alias sampleAlias -genkeypair -keyalg RSA -keysize 4096 -validity 3 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

このコマンドを実行した後、`keytool`はキーストアのパスワードを指定するように促し、その後JKSファイルを生成します。

## PEM証明書をJKSに変換する {id="convert-certificate"}

認証局がPEM形式で証明書を発行する場合、[KtorでSSLを設定する](#configure-ssl-ktor)前にJKS形式に変換する必要があります。
これを行うには、`openssl`および`keytool`ユーティリティを使用できます。
たとえば、`key.pem`ファイルに秘密鍵があり、`cert.pem`に公開証明書がある場合、変換プロセスは次のようになります。

1. 以下のコマンドを使用して、`openssl`でPEMをPKCS12形式に変換します:
   ```Bash
   openssl pkcs12 -export -in cert.pem -inkey key.pem -out keystore.p12 -name "sampleAlias"
   ```
   `key.pem`のパスフレーズと、`keystore.p12`の新しいパスワードの入力を求められます。

2. `keytool`を使用してPKCS12をJKS形式に変換します:
   ```Bash
   keytool -importkeystore -srckeystore keystore.p12 -srcstoretype pkcs12 -destkeystore keystore.jks
   ```
   `keystore.p12`ファイルのパスワードと、`keystore.jks`の新しいパスワードの入力を求められます。
   `keystore.jks`が生成されます。

## KtorでSSLを設定する {id="configure-ssl-ktor"}

KtorでSSL設定を指定する方法は、[Ktorサーバーを設定する](server-create-and-configure.topic)方法によって異なります。設定ファイルを使用するか、`embeddedServer`関数を使用してコード内で設定するかのいずれかです。

### 設定ファイル {id="config-file"}

サーバーが`application.conf`または`application.yaml`[設定ファイル](server-configuration-file.topic)で設定されている場合、以下の[プロパティ](server-configuration-file.topic#predefined-properties)を使用してSSLを有効にできます。

1. `ktor.deployment.sslPort`プロパティを使用してSSLポートを指定します:

   <tabs group="config">
   <tab title="application.conf" group-key="hocon">

   [object Promise]

   </tab>
   <tab title="application.yaml" group-key="yaml">

   [object Promise]

   </tab>
   </tabs>

2. 別個の`security`グループでキーストア設定を提供します:

   <tabs group="config">
   <tab title="application.conf" group-key="hocon">

   [object Promise]

   </tab>
   <tab title="application.yaml" group-key="yaml">

   [object Promise]

   </tab>
   </tabs>

完全な例は、[ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)を参照してください。

### embeddedServer {id="embedded-server"}

`embeddedServer`関数を使用してサーバーを実行する場合、[ApplicationEngine.Configuration](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html)で[カスタム環境](server-configuration-code.topic#embedded-custom)を設定し、そこで[sslConnector](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/ssl-connector.html)を使用してSSL設定を提供する必要があります。

[object Promise]

完全な例は、[ssl-embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-embedded-server)を参照してください。