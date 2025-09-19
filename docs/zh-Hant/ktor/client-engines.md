[//]: # (title: 用戶端引擎)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解處理網路請求的引擎。
</link-summary>

[Ktor HTTP 用戶端](client-create-and-configure.md) 是多平台的，可在 JVM、
[Android](https://kotlinlang.org/docs/android-overview.html)、[JavaScript](https://kotlinlang.org/docs/js-overview.html)
（包括 WebAssembly）以及 [Native](https://kotlinlang.org/docs/native-overview.html) 目標平台執行。每個平台都需要
特定的引擎來處理網路請求。
例如，您可以將 `Apache` 或 `Jetty` 用於 JVM 應用程式，將 `OkHttp` 或 `Android`
用於 Android，將 `Curl` 用於針對 Kotlin/Native 的桌面應用程式。每個引擎在功能和
設定上略有不同，因此您可以根據您的平台和使用案例需求選擇最合適的引擎。

## 支援的平台 {id="platforms"}

下表列出了每個引擎支援的[平台](client-supported-platforms.md)：

| Engine    | Platforms                                                                                                         |
|-----------|-------------------------------------------------------------------------------------------------------------------|
| `Apache5` | [JVM](#jvm)                                                                                                       |
| `Java`    | [JVM](#jvm)                                                                                                       |
| `Jetty`   | [JVM](#jvm)                                                                                                       |
| `Android` | [JVM](#jvm), [Android](#jvm-android)                                                                              |
| `OkHttp`  | [JVM](#jvm), [Android](#jvm-android)                                                                              |
| `Darwin`  | [Native](#native)                                                                                                 |
| `WinHttp` | [Native](#native)                                                                                                 |
| `Curl`    | [Native](#native)                                                                                                 |
| `CIO`     | [JVM](#jvm), [Android](#jvm-android), [Native](#native), [JavaScript](#js), [WasmJs](#jvm-android-native-wasm-js) |
| `Js`      | [JavaScript](#js)                                                                                                 |

## 支援的 Android/Java 版本 {id="minimum-version"}

針對 JVM 或同時針對 JVM 和 Android 的用戶端引擎支援以下 Android/Java 版本：

| Engine    | Android version   | Java version |
|-----------|-------------------|--------------|
| `Apache5` |                   | 8+           |
| `Java`    |                   | 11+          |
| `Jetty`   |                   | 11+          |
| `CIO`     | 7.0+ <sup>*</sup> | 8+           |
| `Android` | 1.x+              | 8+           |
| `OkHttp`  | 5.0+              | 8+           |

_* 若要在較舊的 Android 版本上使用 CIO 引擎，您需要啟用 [Java 8 API desugaring](https://developer.android.com/studio/write/java8-support)。_

## 新增引擎依賴項 {id="dependencies"}

除了 [`ktor-client-core`](client-dependencies.md) artifact 之外，Ktor 用戶端還需要為特定引擎新增依賴項。每個支援的平台都有一組可用的引擎，詳述於相應的章節中：

* [JVM](#jvm)
* [JVM 和 Android](#jvm-android)
* [JavaScript](#js)
* [Native](#native)

> Ktor 提供帶有 `-jvm` 或 `-js` 等後綴的平台特定 artifact。例如，`ktor-client-cio-jvm`。
> 依賴項解析方式因建構工具而異。Gradle 會為給定平台解析適當的 artifact，而 Maven
> 不支援此功能。這意味著對於 Maven，您需要手動指定平台後綴。
>
{type="note"}

## 指定引擎 {id="create"}

若要使用特定引擎，請將引擎類別作為引數傳遞給 [
`HttpClient`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 建構函式。以下範例使用 `CIO` 引擎建立用戶端：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO)
```

## 預設引擎 {id="default"}

如果您省略引擎引數，用戶端將根據[建置腳本中的依賴項](#dependencies)自動選擇引擎。

```kotlin
import io.ktor.client.*

val client = HttpClient()
```

這在多平台專案中特別有用。例如，對於同時針對
[Android 和 iOS](client-create-multiplatform-application.md) 的專案，您可以將 [Android](#jvm-android) 依賴項
新增到 `androidMain` 原始碼集，並將 [Darwin](#darwin) 依賴項新增到 `iosMain` 原始碼集。在執行時建立 `HttpClient` 時會選取適當的引擎。

## 設定引擎 {id="configure"}

若要設定引擎，請使用 `engine {}` 函數。所有引擎都可以使用 [
`HttpClientEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html) 中的共同選項進行設定：

```kotlin
HttpClient() {
    engine {
        // this: HttpClientEngineConfig
        threadsCount = 4
        pipelining = true
    }
}
```

在接下來的章節中，您可以了解如何為不同平台設定特定的引擎。

## JVM {id="jvm"}

JVM 目標平台支援 [`Apache5`](#apache5)、[`Java`](#java) 和
[`Jetty`](#jetty) 引擎。

### Apache5 {id="apache5"}

`Apache5` 引擎同時支援 HTTP/1.1 和 HTTP/2，其中 HTTP/2 預設啟用。
這是新專案推薦使用的基於 Apache 的引擎。

> 舊版 `Apache` 引擎依賴於 Apache HttpClient 4，該版本已棄用。
> 為保持向後相容性而保留。所有新專案請使用 `Apache5`。
>
{style="note"}

1. 新增 `ktor-client-apache5` 依賴項：

   <var name="artifact_name" value="ktor-client-apache5"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>

2. 將 `Apache5` 類別作為引數傳遞給 `HttpClient` 建構函式：

   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.apache5.*
   
   val client = HttpClient(Apache5)
   ```

3. 使用 `engine {}` 區塊存取並設定 `Apache5EngineConfig` 中的屬性：

   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.apache5.*
   import org.apache.hc.core5.http.*
   
   val client = HttpClient(Apache5) {
       engine {
           // this: Apache5EngineConfig
           followRedirects = true
           socketTimeout = 10_000
           connectTimeout = 10_000
           connectionRequestTimeout = 20_000
           customizeClient {
               // this: HttpAsyncClientBuilder
               setProxy(HttpHost("127.0.0.1", 8080))
               // ...
           }
           customizeRequest {
               // this: RequestConfig.Builder
           }
       }
   }
   ```

### Java {id="java"}

`Java` 引擎使用 Java 11 中引入的 [Java HTTP Client](https://openjdk.java.net/groups/net/httpclient/intro.html)。若要使用它，請遵循以下步驟：

1. 新增 `ktor-client-java` 依賴項：

   <var name="artifact_name" value="ktor-client-java"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>
2. 將 [Java](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java/index.html) 類別作為引數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.java.*
   
   val client = HttpClient(Java)
   ```
3. 若要設定引擎，請在 `engine {}` 區塊中設定 [
   `JavaHttpConfig`](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html) 中的屬性：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.*
   import io.ktor.client.engine.java.*
   
   val client = HttpClient(Java) {
       engine {
           // this: JavaHttpConfig
           threadsCount = 8
           pipelining = true
           proxy = ProxyBuilder.http("http://proxy-server.com/")
           protocolVersion = java.net.http.HttpClient.Version.HTTP_2
       }
   }
   ```

### Jetty {id="jetty"}

`Jetty` 引擎僅支援 HTTP/2，可以透過以下方式設定：

1. 新增 `ktor-client-jetty-jakarta` 依賴項：

   <var name="artifact_name" value="ktor-client-jetty-jakarta"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>
2. 將
   [`Jetty`](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html)
   類別作為引數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.jetty.jakarta.*
   
   val client = HttpClient(Jetty)
   ```
3. 若要設定引擎，請在 `engine {}` 區塊中設定
   [`JettyEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty-engine-config/index.html) 中的屬性：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.jetty.jakarta.*
   import org.eclipse.jetty.util.ssl.SslContextFactory
   
   val client = HttpClient(Jetty) {
       engine {
           // this: JettyEngineConfig
           sslContextFactory = SslContextFactory.Client()
           clientCacheSize = 12
       }
   }
   ```

## JVM 和 Android {id="jvm-android"}

在本節中，我們將介紹適用於 JVM/Android 的引擎及其設定。

### Android {id="android"}

`Android` 引擎針對 Android，可以透過以下方式設定：

1. 新增 `ktor-client-android` 依賴項：

   <var name="artifact_name" value="ktor-client-android"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>
2. 將
   [`Android`](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android/index.html)
   類別作為引數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.android.*
   
   val client = HttpClient(Android)
   ```
3. 若要設定引擎，請在 `engine {}` 區塊中設定 [
   `AndroidEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html) 中的屬性：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.android.*
   import java.net.Proxy
   import java.net.InetSocketAddress
   
   val client = HttpClient(Android) {
       engine {
           // this: AndroidEngineConfig
           connectTimeout = 100_000
           socketTimeout = 100_000
           proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("localhost", 8080))
       }
   }
   ```

### OkHttp {id="okhttp"}

`OkHttp` 引擎基於 OkHttp，可以透過以下方式設定：

1. 新增 `ktor-client-okhttp` 依賴項：

   <var name="artifact_name" value="ktor-client-okhttp"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>
2. 將
   [`OkHttp`](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html)
   類別作為引數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.okhttp.*
   
   val client = HttpClient(OkHttp)
   ```
3. 若要設定引擎，請在 `engine {}` 區塊中設定 [
   `OkHttpConfig`](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html) 中的屬性：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.okhttp.*
   
   val client = HttpClient(OkHttp) {
       engine {
           // this: OkHttpConfig
           config {
               // this: OkHttpClient.Builder
               followRedirects(true)
               // ...
           }
           addInterceptor(interceptor)
           addNetworkInterceptor(interceptor)
   
           preconfigured = okHttpClientInstance
       }
   }
   ```

## Native {id="native"}

Ktor 為 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 目標平台提供了 [`Darwin`](#darwin)、[`WinHttp`](#winhttp) 和 [`Curl`](#curl) 引擎。

> 在 Kotlin/Native 專案中使用 Ktor 需要[新的記憶體管理器](https://kotlinlang.org/docs/native-memory-manager.html)，該管理器從 Kotlin 1.7.20 開始預設啟用。
>
{id="newmm-note" style="note"}

### Darwin {id="darwin"}

`Darwin` 引擎針對[基於 Darwin 的](https://en.wikipedia.org/wiki/Darwin_(operating_system)) 作業系統，例如 macOS、iOS、tvOS 和 watchOS。它
在底層使用 [`NSURLSession`](https://developer.apple.com/documentation/foundation/nsurlsession)。若要使用 `Darwin` 引擎，請遵循以下步驟：

1. 新增 `ktor-client-darwin` 依賴項：

   <var name="artifact_name" value="ktor-client-darwin"/>
   <var name="target" value="-macosx64"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%%target%&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>
2. 將 `Darwin` 類別作為引數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.darwin.*
   
   val client = HttpClient(Darwin)
   ```
3. 使用 `engine {}` 區塊並透過 [
   `DarwinClientEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html) 設定引擎。
   例如，您可以使用 `configureRequest` 自訂請求或使用 `configureSession` 自訂會話：
   ```kotlin
   val client = HttpClient(Darwin) {
       engine {
           configureRequest {
               setAllowsCellularAccess(true)
           }
       }
   }
   ```

   如需完整範例，請參閱 [client-engine-darwin](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-darwin)。

### WinHttp {id="winhttp"}

`WinHttp` 引擎針對基於 Windows 的作業系統。
若要使用 `WinHttp` 引擎，請遵循以下步驟：

1. 新增 `ktor-client-winhttp` 依賴項：

   <var name="artifact_name" value="ktor-client-winhttp"/>
   <var name="target" value="-mingwx64"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%%target%&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>
2. 將 `WinHttp` 類別作為引數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.winhttp.*
   
   val client = HttpClient(WinHttp)
   ```
3. 使用 `engine {}` 區塊並透過 [
   `WinHttpClientEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html) 設定引擎。
   例如，您可以使用 `protocolVersion` 屬性來變更 HTTP 版本：
   ```kotlin
   val client = HttpClient(WinHttp) {
       engine {
           protocolVersion = HttpProtocolVersion.HTTP_1_1
       }
   }
   ```

   如需完整範例，請參閱 [client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)。

### Curl {id="curl"}

對於桌面平台，Ktor 提供了 `Curl` 引擎。它支援 `linuxX64`、`linuxArm64`、`macosX64`、`macosArm64` 和 `mingwX64`。若要使用 `Curl` 引擎，請遵循以下步驟：

1. 安裝 [libcurl library](https://curl.se/libcurl/)。
   > 在 Linux 上，您必須安裝 `gnutls` 版本的 libcurl。
   > 若要在 Ubuntu 上安裝此版本，您可以執行：
   ```bash
   sudo apt-get install libcurl4-gnutls-dev
   ```

   > 在 Windows 上，您可能需要考慮 [MinGW/MSYS2](FAQ.topic#native-curl) `curl` 二進位檔。
2. 新增 `ktor-client-curl` 依賴項：

   <var name="artifact_name" value="ktor-client-curl"/>
   <var name="target" value="-macosx64"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%%target%&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>
2. 將 `Curl` 類別作為引數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.curl.*
   
   val client = HttpClient(Curl)
   ```

3. 使用 `engine {}` 區塊並透過 `CurlClientEngineConfig` 設定引擎。
   例如，停用 SSL 驗證以用於測試目的：
   ```kotlin
   val client = HttpClient(Curl) {
       engine {
           sslVerify = false
       }
   }
   ```

   如需完整範例，請參閱 [client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)。

## JVM、Android、Native、JS 和 WasmJs {id="jvm-android-native-wasm-js"}

### CIO {id="cio"}

CIO 引擎是一個完全非同步的基於協程的引擎，可在 JVM、Android、Native、JavaScript 和 WebAssembly JavaScript (WasmJs) 平台上使用。它目前僅支援 HTTP/1.x。若要使用它，請遵循以下步驟：

1. 新增 `ktor-client-cio` 依賴項：

   <var name="artifact_name" value="ktor-client-cio"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>
2. 將 [`CIO`](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 類別作為引數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   
   val client = HttpClient(CIO)
   ```

3. 使用 `engine {}` 區塊並透過 [
   `CIOEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html) 設定引擎：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   import io.ktor.network.tls.*
   
   val client = HttpClient(CIO) {
       engine {
           // this: CIOEngineConfig
           maxConnectionsCount = 1000
           endpoint {
               // this: EndpointConfig
               maxConnectionsPerRoute = 100
               pipelineMaxSize = 20
               keepAliveTime = 5000
               connectTimeout = 5000
               connectAttempts = 5
           }
           https {
               // this: TLSConfigBuilder
               serverName = "api.ktor.io"
               cipherSuites = CIOCipherSuites.SupportedSuites
               trustManager = myCustomTrustManager
               random = mySecureRandom
               addKeyStore(myKeyStore, myKeyStorePassword)
           }
       }
   }
   ```

## JavaScript {id="js"}

`Js` 引擎可用於 [JavaScript 專案](https://kotlinlang.org/docs/js-overview.html)。它對於瀏覽器應用程式使用 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，對於 Node.js 使用 `node-fetch`。若要使用它，請遵循以下步驟：

1. 新增 `ktor-client-js` 依賴項：

   <var name="artifact_name" value="ktor-client-js"/>
   <var name="target" value=""/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%%target%&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>
2. 將 `Js` 類別作為引數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.js.*
   
   val client = HttpClient(Js)
   ```

   您也可以呼叫 `JsClient()` 函數來取得 `Js` 引擎單例：
   ```kotlin
   import io.ktor.client.engine.js.*

   val client = JsClient()
   ```

如需完整範例，請參閱 [client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)。

## 限制 {id="limitations"}

### HTTP/2 和 WebSockets

並非所有引擎都支援 HTTP/2 協定。如果引擎支援 HTTP/2，您可以在引擎的設定中啟用它。例如，使用 [Java](#java) 引擎。

下表顯示特定引擎是否支援 HTTP/2 和 [WebSockets](client-websockets.topic)：

| Engine    | HTTP/2 | WebSockets |
|-----------|--------|------------|
| `Apache5` | ✅️     | ✖️         |
| `Java`    | ✅      | ✅️         |
| `Jetty`   | ✅      | ✖️         |
| `CIO`     | ✖️     | ✅          |
| `Android` | ✖️     | ✖️         |
| `OkHttp`  | ✅      | ✅          |
| `Js`      | ✅      | ✅          |
| `Darwin`  | ✅      | ✅          |
| `WinHttp` | ✅      | ✅          |
| `Curl`    | ✅      | ✅          |

### 安全性

[SSL](client-ssl.md) 必須針對每個引擎進行配置。每個引擎都提供其自己的 SSL 設定選項。

### 代理支援

某些引擎不支援代理。如需完整列表，請參閱[代理文件](client-proxy.md#supported_engines)。

### 記錄

[Logging](client-logging.md) 外掛程式提供不同類型的記錄器，具體取決於目標平台。

### 逾時

[HttpTimeout](client-timeout.md) 外掛程式對於特定引擎有一些限制。如需完整列表，請參閱[逾時限制](client-timeout.md#limitations)。

## 範例：如何在多平台行動專案中設定引擎 {id="mpp-config"}

在建構多平台專案時，您可以使用 [expected 和 actual 聲明](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html) 為每個目標平台選擇和設定引擎。這讓您可以在通用程式碼中共享大部分用戶端設定，同時在平台程式碼中應用引擎特定選項。
我們將演示如何使用在 [建立跨平台行動應用程式](client-create-multiplatform-application.md) 教學課程中建立的專案來實現這一點：

<procedure>

1. 開啟 **shared/src/commonMain/kotlin/com/example/kmmktor/Platform.kt**
   檔案並新增一個接受配置區塊並返回 `HttpClient` 的頂層 `httpClient()` 函數：
   ```kotlin
   expect fun httpClient(config: HttpClientConfig<*>.() -> Unit = {}): HttpClient
   ```

2. 開啟 **shared/src/androidMain/kotlin/com/example/kmmktor/Platform.kt**
   並為 Android 模組新增 `httpClient()` 函數的實際聲明：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.okhttp.*
   import java.util.concurrent.TimeUnit

   actual fun httpClient(config: HttpClientConfig<*>.() -> Unit) = HttpClient(OkHttp) {
      config(this)

      engine { 
         config {
            retryOnConnectionFailure(true)
            connectTimeout(0, TimeUnit.SECONDS)
         }
      }
   }
   ```

   > 此範例展示了如何設定 [`OkHttp`](#okhttp) 引擎，但您也可以使用[支援 Android 的](#jvm-android)其他引擎。
   >
   {style="tip"}

3. 開啟 **shared/src/iosMain/kotlin/com/example/kmmktor/Platform.kt** 並為 iOS 模組新增 `httpClient()`
   函數的實際聲明：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.darwin.*
   
   actual fun httpClient(config: HttpClientConfig<*>.() -> Unit) = HttpClient(Darwin) {
      config(this)
      engine {
         configureRequest {
            setAllowsCellularAccess(true)
         }
      }
   }
   ```
   您現在可以在共用程式碼中呼叫 `httpClient()`，而無需擔心使用哪個引擎。

4. 若要在共用程式碼中使用用戶端，請開啟 **shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt** 並將
   `HttpClient()` 建構函式替換為 `httpClient()` 函數呼叫：
   ```kotlin
   private val client = httpClient()
   ```

</procedure>