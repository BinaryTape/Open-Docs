[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>程式碼範例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) 是一種現代的二進位雙工多工協定，旨在取代 HTTP/1.x。

Jetty 和 Netty 引擎提供了 Ktor 可使用的 HTTP/2 實作。然而，它們存在顯著差異，且每個引擎都需要額外設定。一旦您的主機為 Ktor 正確設定完成，HTTP/2 支援將自動啟用。

主要要求：

*   SSL 憑證（可以是自簽署的）。
*   適用於特定引擎的 ALPN 實作（請參閱 Netty 和 Jetty 對應的章節）。

## SSL 憑證 {id="ssl_certificate"}

根據規範，HTTP/2 不要求加密，但所有瀏覽器將要求搭配 HTTP/2 使用加密連線。這就是為什麼一個可用的 TLS 環境是啟用 HTTP/2 的先決條件。因此，需要憑證來啟用加密。
為了測試目的，它可以使用 JDK 中的 `keytool` 生成...

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

... 或透過使用 [buildKeyStore](server-ssl.md) 函數。

下一步是設定 Ktor 使用您的金鑰庫。請參閱範例 `application.conf` / `application.yaml` [設定檔](server-configuration-file.topic)：

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

## ALPN 實作 {id="apln_implementation"}

HTTP/2 要求必須啟用 ALPN ([應用層協定協商](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation))。第一種選擇是使用需要新增到啟動類別路徑的外部 ALPN 實作。
另一種選擇是使用 OpenSSL 原生綁定和預編譯的原生二進位檔。
此外，每個特定引擎只能支援其中一種方法。

### Jetty {id="jetty"}

由於 ALPN API 從 Java 8 開始支援，Jetty 引擎不需要任何特定設定即可使用 HTTP/2。因此，您只需要：
1.  使用 Jetty 引擎[建立伺服器](server-engines.md#choose-create-server)。
2.  新增如 [](#ssl_certificate) 中所述的 SSL 設定。
3.  設定 `sslPort`。

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty) 可執行範例演示了 Jetty 的 HTTP/2 支援。

### Netty {id="netty"}

若要在 Netty 中啟用 HTTP/2，請使用 OpenSSL 綁定 ([tcnative netty port](https://netty.io/wiki/forked-tomcat-native.html))。
以下範例展示了如何將原生實作（靜態連結的 BoringSSL 函式庫，它是 OpenSSL 的一個分支）新增到 `build.gradle.kts` 檔案：

[object Promise]

`tc.native.classifier` 應為下列其中之一：`linux-x86_64`、`osx-x86_64` 或 `windows-x86_64`。
[http2-netty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty) 可執行範例演示了如何啟用 Netty 的 HTTP/2 支援。