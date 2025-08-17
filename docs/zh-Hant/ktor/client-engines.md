[//]: # (title: 用戶端引擎)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解處理網路請求的引擎。
</link-summary>

[Ktor HTTP 用戶端](client-create-and-configure.md) 可用於不同平台，包括 JVM、[Android](https://kotlinlang.org/docs/android-overview.html)、[JavaScript](https://kotlinlang.org/docs/js-overview.html) 和 [Native](https://kotlinlang.org/docs/native-overview.html)。特定平台可能需要特定的引擎來處理網路請求。
例如，您可以使用 `Apache` 或 `Jetty` 用於 JVM 應用程式，`OkHttp` 或 `Android` 用於 Android，`Curl` 用於針對 Kotlin/Native 的桌面應用程式等等。不同的引擎可能具有特定的功能並提供不同的設定選項。

## 需求與限制 {id="requirements"}

### 支援的平台 {id="platforms"}

下表列出了每個引擎支援的[平台](client-supported-platforms.md)：

| Engine  | Platforms                                               |
|---------|---------------------------------------------------------|
| Apache  | [JVM](#jvm)                                             |
| Java    | [JVM](#jvm)                                             |
| Jetty   | [JVM](#jvm)                                             |
| Android | [JVM](#jvm), [Android](#jvm-android)                    |
| OkHttp  | [JVM](#jvm), [Android](#jvm-android)                    |
| Darwin  | [Native](#native)                                       |
| WinHttp | [Native](#native)                                       |
| Curl    | [Native](#native)                                       |
| CIO     | [JVM](#jvm), [Android](#jvm-android), [Native](#native) |
| Js      | [JavaScript](#js)                                       |

### 支援的 Android/Java 版本 {id="minimal-version"}

針對 JVM 或同時針對 JVM 和 Android 的用戶端引擎支援以下 Android/Java 版本：

| Engine  | Android version   | Java version |
|---------|-------------------|--------------|
| Apache  |                   | 8+           |
| Java    |                   | 11+          |
| Jetty   |                   | 11+          |
| CIO     | 7.0+ <sup>*</sup> | 8+           |
| Android | 1.x+              | 8+           |
| OkHttp  | 5.0+              | 8+           |

_* 若要在較舊的 Android 版本上使用 CIO 引擎，您需要啟用 [Java 8 API desugaring](https://developer.android.com/studio/write/java8-support)。_

### 限制 {id="limitations"}

下表顯示特定引擎是否支援 HTTP/2 和 [WebSockets](client-websockets.topic)：

| Engine  | HTTP/2             | WebSockets |
|---------|--------------------|------------|
| Apache  | ✅️ _(for Apache5)_ | ✖️         |
| Java    | ✅                  | ✅️         |
| Jetty   | ✅                  | ✖️         |
| CIO     | ✖️                 | ✅          |
| Android | ✖️                 | ✖️         |
| OkHttp  | ✅                  | ✅          |
| Js      | ✅                  | ✅          |
| Darwin  | ✅                  | ✅          |
| WinHttp | ✅                  | ✅          |
| Curl    | ✅                  | ✅         |

您還需要考慮以下會影響一般用戶端設定及特定外掛程式使用的限制：
- 如果引擎支援 HTTP/2，您可以透過自訂引擎設定來啟用它（請參閱 [Java](#java) 引擎的範例）。
- 若要在 Ktor 用戶端中設定 [SSL](client-ssl.md)，您需要自訂所選引擎的設定。
- 某些引擎不支援 [代理](client-proxy.md#supported_engines)。
- [Logging](client-logging.md) 外掛程式為不同平台提供不同類型的記錄器。
- [HttpTimeout](client-timeout.md#limitations) 外掛程式對於特定引擎有一些限制。

## 新增引擎依賴項 {id="dependencies"}

除了 [ktor-client-core](client-dependencies.md) artifact 之外，Ktor 用戶端需要為每個引擎新增特定的依賴項。對於每個支援的平台，您可以在相應的章節中看到可用的引擎和所需的依賴項：
* [JVM](#jvm)
* [JVM 和 Android](#jvm-android)
* [JavaScript](#js)
* [Native](#native)

> 對於不同的引擎，Ktor 提供帶有 `-jvm` 或 `-js` 等後綴的平台特定 artifact，例如 `ktor-client-cio-jvm`。Gradle 會為給定平台解析適當的 artifact，而 Maven 不支援此功能。這意味著對於 Maven，您需要手動新增平台特定後綴。
>
{type="note"}

## 使用指定引擎建立用戶端 {id="create"}
若要使用特定引擎建立 HTTP 用戶端，請將引擎類別作為參數傳遞給 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 建構函式。例如，您可以如下所示使用 `CIO` 引擎建立用戶端：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO)
```

### 預設引擎 {id="default"}
如果您在沒有引數的情況下呼叫 `HttpClient` 建構函式，用戶端將根據 [建置腳本中新增的](#dependencies) artifact 自動選擇引擎。
```kotlin
import io.ktor.client.*

val client = HttpClient()
```

這對於多平台專案很有用。例如，對於同時針對 [Android 和 iOS](client-create-multiplatform-application.md) 的專案，您可以將 [Android](#jvm-android) 依賴項新增到 `androidMain` 原始碼集，並將 [Darwin](#darwin) 依賴項新增到 `iosMain` 原始碼集。必要的依賴項將在編譯時選取。

## 設定引擎 {id="configure"}
您可以使用 `engine` 方法來設定引擎。所有引擎都共用 [HttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html) 公開的多個共同屬性，例如：

```kotlin
HttpClient() {
    engine {
        // this: HttpClientEngineConfig
        threadsCount = 4
        pipelining = true
    }
}
```

若要了解如何設定特定引擎，請參閱下面的相應章節。

## JVM {id="jvm"}
在本節中，我們將介紹適用於 JVM 的引擎。

### Apache {id="apache"}
`Apache` 引擎支援 HTTP/1.1 並提供多個設定選項。
如果您需要 HTTP/2 支援，也可以使用 `Apache5` 引擎，其預設啟用 HTTP/2。

1. 新增 `ktor-client-apache5` 或 `ktor-client-apache` 依賴項：

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
2. 將 `Apache5`/`Apache` 類別作為參數傳遞給 `HttpClient` 建構函式：

   <Tabs group="apache_version">
   <TabItem title="Apache5" group-key="5">

   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.apache5.*
   
   val client = HttpClient(Apache5)
   ```

   </TabItem>
   <TabItem title="Apache" group-key="4">

   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.apache.*
   
   val client = HttpClient(Apache)
   ```

   </TabItem>
   </Tabs>

3. 若要設定引擎，請將 `Apache5EngineConfig`/`ApacheEngineConfig` 公開的設定傳遞給 `engine` 方法：

   <Tabs group="apache_version">
   <TabItem title="Apache5" group-key="5">

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

   </TabItem>
   <TabItem title="Apache" group-key="4">

   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.apache.*
   import org.apache.http.HttpHost
   
   val client = HttpClient(Apache) {
       engine {
           // this: ApacheEngineConfig
           followRedirects = true
           socketTimeout = 10_000
           connectTimeout = 10_000
           connectionRequestTimeout = 20_000
           customizeClient {
               // this: HttpAsyncClientBuilder
               setProxy(HttpHost("127.0.0.1", 8080))
               setMaxConnTotal(1000)
               setMaxConnPerRoute(100)
               // ...
           }
           customizeRequest {
               // this: RequestConfig.Builder
           }
       }
   }
   ```

   </TabItem>
   </Tabs>

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
2. 將 [Java](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java/index.html) 類別作為參數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.java.*
   
   val client = HttpClient(Java)
   ```
3. 若要設定引擎，請將 [JavaHttpConfig](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html) 公開的設定傳遞給 `engine` 方法：
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
2. 將 [Jetty](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html) 類別作為參數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.jetty.jakarta.*
   
   val client = HttpClient(Jetty)
   ```
3. 若要設定引擎，請將 [JettyEngineConfig](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty-engine-config/index.html) 公開的設定傳遞給 `engine` 方法：
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
2. 將 [Android](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android/index.html) 類別作為參數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.android.*
   
   val client = HttpClient(Android)
   ```
3. 若要設定引擎，請將 [AndroidEngineConfig](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html) 公開的設定傳遞給 `engine` 方法：
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
2. 將 [OkHttp](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html) 類別作為參數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.okhttp.*
   
   val client = HttpClient(OkHttp)
   ```
3. 若要設定引擎，請將 [OkHttpConfig](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html) 公開的設定傳遞給 `engine` 方法：
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
在本節中，我們將介紹如何設定針對 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 的引擎。

> 在 Kotlin/Native 專案中使用 Ktor 需要[新的記憶體管理器](https://kotlinlang.org/docs/native-memory-manager.html)，該管理器從 Kotlin 1.7.20 開始預設啟用。
>
{id="newmm-note"}

### Darwin {id="darwin"}
`Darwin` 引擎針對基於 [Darwin](https://en.wikipedia.org/wiki/Darwin_(operating_system)) 的作業系統（例如 macOS、iOS、tvOS 等），並在底層使用 [NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession)。若要使用 `Darwin` 引擎，請遵循以下步驟：

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
2. 將 `Darwin` 類別作為參數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.darwin.*
   
   val client = HttpClient(Darwin)
   ```
3. 若要設定引擎，請將 [DarwinClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html) 公開的設定傳遞給 `engine` 函數。
   例如，您可以使用 `configureRequest` 函數存取 `NSMutableURLRequest` 或使用 `configureSession` 自訂會話設定。下面的程式碼片段展示了如何使用 `configureRequest`：
   ```kotlin
   val client = HttpClient(Darwin) {
       engine {
           configureRequest {
               setAllowsCellularAccess(true)
           }
       }
   }
   ```

   您可以在這裡找到完整範例：[client-engine-darwin](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-darwin)。

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
2. 將 `WinHttp` 類別作為參數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.winhttp.*
   
   val client = HttpClient(WinHttp)
   ```
3. 若要設定引擎，請將 [WinHttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html) 公開的設定傳遞給 `engine` 函數。
   例如，您可以使用 `protocolVersion` 屬性來變更 HTTP 版本：
   ```kotlin
   val client = HttpClient(WinHttp) {
       engine {
           protocolVersion = HttpProtocolVersion.HTTP_1_1
       }
   }
   ```

   您可以在這裡找到完整範例：[client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)。

### Curl {id="curl"}

對於桌面平台，Ktor 也提供了 `Curl` 引擎。此引擎支援以下平台：`linuxX64`、`linuxArm64`、`macosX64`、`macosArm64`、`mingwX64`。若要使用 `Curl` 引擎，請遵循以下步驟：

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
3. 將 `Curl` 類別作為參數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.curl.*
   
   val client = HttpClient(Curl)
   ```

4. 若要設定引擎，請將 `CurlClientEngineConfig` 公開的設定傳遞給 `engine` 方法。
   下面的程式碼片段展示了如何為測試目的停用 SSL 驗證：
   ```kotlin
   val client = HttpClient(Curl) {
       engine {
           sslVerify = false
       }
   }
   ```

   您可以在這裡找到完整範例：[client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)。

## JVM、Android 和 Native {id="jvm-android-native"}

### CIO {id="cio"}
CIO 是一個完全非同步的基於協程的引擎，可用於 JVM、Android 和 Native 平台。目前它僅支援 HTTP/1.x。若要使用它，請遵循以下步驟：
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
2. 將 [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 類別作為參數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   
   val client = HttpClient(CIO)
   ```

3. 若要設定引擎，請將 [CIOEngineConfig](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html) 公開的設定傳遞給 `engine` 方法：
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

`Js` 引擎可用於 [JavaScript 專案](https://kotlinlang.org/docs/js-overview.html)。此引擎對於瀏覽器應用程式使用 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，對於 Node.js 使用 `node-fetch`。若要使用它，請遵循以下步驟：

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
2. 將 `Js` 類別作為參數傳遞給 `HttpClient` 建構函式：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.js.*
   
   val client = HttpClient(Js)
   ```

   您也可以呼叫 `JsClient` 函數來取得 `Js` 引擎單例：
   ```kotlin
   import io.ktor.client.engine.js.*

   val client = JsClient()
   ```

您可以在這裡找到完整範例：[client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)。

## 範例：如何在多平台行動專案中設定引擎 {id="mpp-config"}

若要在多平台行動專案中設定引擎特定選項，您可以使用 [expect/actual declarations](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html)。
讓我們演示如何使用在 [建立跨平台行動應用程式](client-create-multiplatform-application.md) 教學課程中建立的專案來實現這一點：

1. 開啟 `shared/src/commonMain/kotlin/com/example/kmmktor/Platform.kt` 檔案並新增頂層 `httpClient` 函數，該函數接受用戶端設定並返回 `HttpClient`：
   ```kotlin
   expect fun httpClient(config: HttpClientConfig<*>.() -> Unit = {}): HttpClient
   ```

2. 開啟 `shared/src/androidMain/kotlin/com/example/kmmktor/Platform.kt` 並為 Android 模組新增 `httpClient` 函數的實際聲明：
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
   此範例展示了如何設定 [OkHttp](#okhttp) 引擎，但您也可以使用其他 [Android 支援的](#jvm-android) 引擎。

3. 開啟 `shared/src/iosMain/kotlin/com/example/kmmktor/Platform.kt` 並為 iOS 模組新增 `httpClient` 函數的實際聲明：
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

4. 最後，開啟 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` 並將 `HttpClient()` 建構函式替換為 `httpClient` 函數呼叫：
   ```kotlin
   private val client = httpClient()
   ```