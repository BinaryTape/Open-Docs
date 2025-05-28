[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>程式碼範例</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) 是一個現代二進制雙工多工協定，旨在取代 HTTP/1.x。

Jetty 和 Netty 引擎提供了 Ktor 可以使用的 HTTP/2 實作。然而，兩者存在顯著差異，並且每個引擎都需要額外的配置。一旦您的主機為 Ktor 正確配置，HTTP/2 支援將會自動啟用。

主要需求：

*   SSL 憑證 (可以是自簽憑證)。
*   適用於特定引擎的 ALPN 實作 (請參閱 Netty 和 Jetty 對應章節)。

## SSL 憑證 {id="ssl_certificate"}

根據規範，HTTP/2 不要求加密，但所有瀏覽器都將要求使用加密連線來配合 HTTP/2。這就是為什麼一個可運作的 TLS 環境是啟用 HTTP/2 的先決條件。因此，啟用加密需要憑證。為了測試目的，可以使用 JDK 中的 `keytool` 產生...

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

...或者使用 [buildKeyStore](server-ssl.md) 函數。

下一步是配置 Ktor 以使用您的金鑰庫。請參閱 `application.conf` / `application.yaml` [配置檔](server-configuration-file.topic) 範例：

<tabs group="config">
<tab title="application.conf" group-key="hocon">

```shell
```
{src="snippets/http2-netty/src/main/resources/application.conf"}

</tab>
<tab title="application.yaml" group-key="yaml">

```yaml
```
{src="snippets/http2-netty/src/main/resources/_application.yaml"}

</tab>
</tabs>

## ALPN 實作 {id="apln_implementation"}

HTTP/2 要求啟用 ALPN ([應用層協定協商](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation))。第一種選擇是使用需要新增到啟動類別路徑 (boot classpath) 的外部 ALPN 實作。另一種選擇是使用 OpenSSL 原生繫結和預編譯的原生二進位檔。此外，每個特定引擎可能只支援這些方法中的一種。

### Jetty {id="jetty"}

由於 ALPN API 從 Java 8 開始支援，Jetty 引擎不需要任何特定配置來使用 HTTP/2。因此，您只需：
1.  使用 Jetty 引擎[建立伺服器](server-engines.md#choose-create-server)。
2.  按照[](#ssl_certificate)中的描述新增 SSL 配置。
3.  配置 `sslPort`。

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty) 可執行範例展示了 Jetty 的 HTTP/2 支援。

### Netty {id="netty"}

要在 Netty 中啟用 HTTP/2，請使用 OpenSSL 繫結 ([tcnative netty port](https://netty.io/wiki/forked-tomcat-native.html))。以下範例展示了如何將原生實作 (靜態連結的 BoringSSL 函式庫，OpenSSL 的分支) 新增到 `build.gradle.kts` 檔案中：

```kotlin
```
{src="snippets/http2-netty/build.gradle.kts" include-lines="20-28,34-39"}

`tc.native.classifier` 應為以下其中之一：`linux-x86_64`、`osx-x86_64` 或 `windows-x86_64`。[http2-netty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty) 可執行範例展示了如何啟用 Netty 的 HTTP/2 支援。