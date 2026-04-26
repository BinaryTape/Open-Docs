[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>程式碼範例</b>：<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-netty">http2-netty</a>、<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) 是一種現代的二進制雙工多路複用協定，旨在取代 HTTP/1.x。

Jetty 與 Netty 引擎提供了 Ktor 可使用的 HTTP/2 實作。然而，兩者之間存在顯著差異，且每個引擎都需要額外的配置。
一旦您的主機為 Ktor 配置妥當，HTTP/2 支援將會自動啟用。

關鍵需求：

*   一份 SSL 憑證（可以是自我簽署憑證）。
*   適用於特定引擎的 ALPN 實作（請參閱 Netty 與 Jetty 的對應章節）。

## SSL 憑證 {id="ssl_certificate"}

根據規格，HTTP/2 不需要加密，但所有瀏覽器都會要求與 HTTP/2 搭配使用加密連線。
這就是為什麼運作正常的 TLS 環境是啟用 HTTP/2 的先決條件。因此，需要憑證來啟用加密。
出於測試目的，可以使用 JDK 中的 `keytool` 產生憑證...

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

... 或使用 [buildKeyStore](server-ssl.md) 函式。

下一步是配置 Ktor 以使用您的金鑰庫。請參閱 `application.conf` / `application.yaml` [配置檔案](server-configuration-file.topic) 範例：

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

## ALPN 實作 {id="apln_implementation"}

HTTP/2 需要啟用 ALPN（[應用層協定協商](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation)）。第一個選項是使用需要新增到啟動類別路徑（boot classpath）的外部 ALPN 實作。
另一個選項是使用 OpenSSL 原生繫結和預先編譯的原生二進制檔案。
此外，每個特定的引擎可能僅支援其中一種方法。

### Jetty {id="jetty"}

由於自 Java 8 開始支援 ALPN API，Jetty 引擎不需要任何特定配置即可使用 HTTP/2。因此，您只需要：
1. 使用 Jetty 引擎[建立伺服器](server-engines.md#choose-create-server)。
2. 按照 [SSL 憑證](#ssl_certificate) 中的說明新增 SSL 配置。
3. 配置 `sslPort`。

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-jetty) 可執行範例展示了 Jetty 的 HTTP/2 支援。

### Netty {id="netty"}

要在 Netty 中啟用 HTTP/2，請使用 OpenSSL 繫結（[tcnative Netty 移植版本](https://netty.io/wiki/forked-tomcat-native.html)）。
下方的範例顯示如何將原生實作（靜態連結的 BoringSSL 程式庫，OpenSSL 的一個分支）新增到 `build.gradle.kts` 檔案中：

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

`tc.native.classifier` 應為以下之一：`linux-x86_64`、`osx-x86_64` 或 `windows-x86_64`。
[http2-netty](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-netty) 可執行範例展示了如何啟用 Netty 的 HTTP/2 支援。

#### 不具備 TLS 的 HTTP/2

Netty 引擎也支援 [基於純文字的 HTTP/2 (h2c)](https://httpwg.org/specs/rfc7540.html#discover-http)。
這允許在不使用 TLS 的情況下進行 HTTP/2 通訊，通常用於不需要加密的私有網路內。
用戶端可以透過 HTTP/1.1 請求發起通訊，然後升級到 HTTP/2。

要啟用 h2c，請在引擎配置中將 `enableH2c` 旗標設定為 `true`：

```kotlin
embeddedServer(Netty, configure = {
    connector {
        port = 8080
    }
    enableHttp2 = true
    enableH2c = true
})
```

請注意，h2c 需要 `enableHttp2 = true`，且如果伺服器上配置了 SSL 連接器，則無法使用。