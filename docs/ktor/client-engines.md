[//]: # (title: 客户端引擎)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解处理网络请求的引擎。
</link-summary>

[Ktor HTTP 客户端](client-create-and-configure.md) 是多平台的，可在 JVM、
[Android](https://kotlinlang.org/docs/android-overview.html)、[JavaScript](https://kotlinlang.org/docs/js-overview.html)
（包括 WebAssembly）以及 [Native](https://kotlinlang.org/docs/native-overview.html) 目标平台运行。每个平台都需要
一个特定的引擎来处理网络请求。
例如，对于 JVM 应用程序，可以使用 `Apache` 或 `Jetty`；对于 Android，可以使用 `OkHttp` 或 `Android`；
对于面向 Kotlin/Native 的桌面应用程序，可以使用 `Curl`。每个引擎在特性和
配置上略有不同，因此你可以选择最符合你的平台和用例需求的引擎。

## 支持的平台 {id="platforms"}

下表列出了每个引擎支持的[平台](client-supported-platforms.md)：

| Engine | Platforms |
|---|---|
| `Apache5` | [JVM](#jvm) |
| `Java` | [JVM](#jvm) |
| `Jetty` | [JVM](#jvm) |
| `Android` | [JVM](#jvm), [Android](#jvm-android) |
| `OkHttp` | [JVM](#jvm), [Android](#jvm-android) |
| `Darwin` | [Native](#native) |
| `WinHttp` | [Native](#native) |
| `Curl` | [Native](#native) |
| `CIO` | [JVM](#jvm), [Android](#jvm-android), [Native](#native), [JavaScript](#js), [WasmJs](#jvm-android-native-wasm-js) |
| `Js` | [JavaScript](#js) |

## 支持的 Android/Java 版本 {id="minimum-version"}

面向 JVM 或同时面向 JVM 和 Android 的客户端引擎支持以下 Android/Java 版本：

| Engine | Android version | Java version |
|---|---|
| `Apache5` | | 8+ |
| `Java` | | 11+ |
| `Jetty` | | 11+ |
| `CIO` | 7.0+ <sup>*</sup> | 8+ |
| `Android` | 1.x+ | 8+ |
| `OkHttp` | 5.0+ | 8+ |

_* 要在旧版 Android 上使用 CIO 引擎，你需要启用 [Java 8 API desugaring](https://developer.android.com/studio/write/java8-support)。_

## 添加引擎依赖项 {id="dependencies"}

除了 [`ktor-client-core`](client-dependencies.md) 构件之外，Ktor 客户端还需要为特定的引擎添加依赖项。每个支持的平台都有一组可用的引擎，详见相应部分：

* [JVM](#jvm)
* [JVM 和 Android](#jvm-android)
* [JavaScript](#js)
* [Native](#native)

> Ktor 提供带有 `-jvm` 或 `-js` 等后缀的平台特有构件。例如，`ktor-client-cio-jvm`。依赖项解析因构建工具而异。Gradle 可以解析适用于给定平台的构件，而 Maven 不支持此功能。这意味着对于 Maven，你需要手动指定平台后缀。
>
{type="note"}

## 指定引擎 {id="create"}

要使用特定引擎，请将引擎类作为实参传递给 [
`HttpClient`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 构造函数。以下示例创建了一个使用 `CIO` 引擎的客户端：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO)
```

## 默认引擎 {id="default"}

如果你省略引擎实参，客户端将根据[构建脚本中的依赖项](#dependencies)自动选择一个引擎。

```kotlin
import io.ktor.client.*

val client = HttpClient()
```

这在多平台项目中特别有用。例如，对于同时面向 [Android 和 iOS](client-create-multiplatform-application.md) 的项目，你可以将 [Android](#jvm-android) 依赖项添加到 `androidMain` 源代码集，并将 [Darwin](#darwin) 依赖项添加到 `iosMain` 源代码集。在 `HttpClient` 创建时，将会在运行时选择合适的引擎。

## 配置引擎 {id="configure"}

要配置引擎，请使用 `engine {}` 函数。所有引擎都可以使用 [
`HttpClientEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html) 中的通用选项进行配置：

```kotlin
HttpClient() {
    engine {
        // this: HttpClientEngineConfig
        threadsCount = 4
        pipelining = true
    }
}
```

在接下来的部分中，你将了解如何为不同平台配置特定的引擎。

## JVM {id="jvm"}

JVM 目标平台支持 [`Apache5`](#apache5)、[`Java`](#java) 和
[`Jetty`](#jetty) 引擎。

### Apache5 {id="apache5"}

`Apache5` 引擎支持 HTTP/1.1 和 HTTP/2，其中 HTTP/2 默认启用。这是新项目推荐使用的基于 Apache 的引擎。

> 旧版 `Apache` 引擎依赖于已弃用的 Apache HttpClient 4。它仅为向后兼容性保留。对于所有新项目，请使用 `Apache5`。
>
{style="note"}

1. 添加 `ktor-client-apache5` 依赖项：

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

2. 将 `Apache5` 类作为实参传递给 `HttpClient` 构造函数：

   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.apache5.*
   
   val client = HttpClient(Apache5)
   ```

3. 使用 `engine {}` 代码块访问并设置 `Apache5EngineConfig` 中的属性：

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

`Java` 引擎使用 Java 11 中引入的 [Java HTTP Client](https://openjdk.java.net/groups/net/httpclient/intro.html)。要使用它，请按照以下步骤操作：

1. 添加 `ktor-client-java` 依赖项：

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
2. 将 [Java](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java/index.html) 类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.java.*
   
   val client = HttpClient(Java)
   ```
3. 要配置引擎，请在 `engine {}` 代码块中设置 [
   `JavaHttpConfig`](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html) 中的属性：
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

`Jetty` 引擎仅支持 HTTP/2，可按以下方式配置：

1. 添加 `ktor-client-jetty-jakarta` 依赖项：

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
2. 将
   [`Jetty`](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html)
   类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.jetty.jakarta.*
   
   val client = HttpClient(Jetty)
   ```
3. 要配置引擎，请在 `engine {}` 代码块中设置
   [`JettyEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty-engine-config/index.html) 中的属性：
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

在本节中，我们将介绍适用于 JVM/Android 的引擎及其配置。

### Android {id="android"}

`Android` 引擎面向 Android 平台，可按以下方式配置：

1. 添加 `ktor-client-android` 依赖项：

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
2. 将
   [`Android`](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android/index.html)
   类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.android.*
   
   val client = HttpClient(Android)
   ```
3. 要配置引擎，请在 `engine {}` 代码块中设置
   [
   `AndroidEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html) 中的属性：
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

基于 OkHttp 的 `OkHttp` 引擎可按以下方式配置：

1. 添加 `ktor-client-okhttp` 依赖项：

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
2. 将
   [`OkHttp`](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html)
   类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.okhttp.*
   
   val client = HttpClient(OkHttp)
   ```
3. 要配置引擎，请在 `engine {}` 代码块中设置
   [
   `OkHttpConfig`](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html) 中的属性：
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

Ktor 为 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 目标平台提供了 [`Darwin`](#darwin)、[`WinHttp`](#winhttp) 和 [`Curl`](#curl) 引擎。

> 在 Kotlin/Native 项目中使用 Ktor 需要新的内存管理器，该管理器从 Kotlin 1.7.20 开始默认启用。
>
{id="newmm-note" style="note"}

### Darwin {id="darwin"}

`Darwin` 引擎面向基于 [Darwin](https://en.wikipedia.org/wiki/Darwin_(operating_system)) 的操作系统，例如 macOS、iOS、tvOS 和 watchOS。它在底层使用 [`NSURLSession`](https://developer.apple.com/documentation/foundation/nsurlsession)。要使用 `Darwin` 引擎，请按照以下步骤操作：

1. 添加 `ktor-client-darwin` 依赖项：

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
2. 将 `Darwin` 类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.darwin.*
   
   val client = HttpClient(Darwin)
   ```
3. 在 `engine {}` 代码块中使用
   [
   `DarwinClientEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html) 配置引擎。例如，你可以使用 `configureRequest` 来自定义请求，或使用 `configureSession` 来自定义会话：
   ```kotlin
   val client = HttpClient(Darwin) {
       engine {
           configureRequest {
               setAllowsCellularAccess(true)
           }
       }
   }
   ```

   有关完整示例，请参见 [client-engine-darwin](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-darwin)。

### WinHttp {id="winhttp"}

`WinHttp` 引擎面向基于 Windows 的操作系统。
要使用 `WinHttp` 引擎，请按照以下步骤操作：

1. 添加 `ktor-client-winhttp` 依赖项：

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
2. 将 `WinHttp` 类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.winhttp.*
   
   val client = HttpClient(WinHttp)
   ```
3. 在 `engine {}` 代码块中使用
   [
   `WinHttpClientEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html) 配置引擎。例如，你可以使用 `protocolVersion` 属性更改 HTTP 版本：
   ```kotlin
   val client = HttpClient(WinHttp) {
       engine {
           protocolVersion = HttpProtocolVersion.HTTP_1_1
       }
   }
   ```

   有关完整示例，请参见 [client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)。

### Curl {id="curl"}

对于桌面平台，Ktor 提供了 `Curl` 引擎。它支持 `linuxX64`、`linuxArm64`、`macosX64`、`macosArm64` 和 `mingwX64`。要使用 `Curl` 引擎，请按照以下步骤操作：

1. 添加 `ktor-client-curl` 依赖项：

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
2. 将 `Curl` 类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.curl.*
   
   val client = HttpClient(Curl)
   ```

3. 在 `engine {}` 代码块中使用 `CurlClientEngineConfig` 配置引擎。
   例如，为测试目的禁用 SSL 验证：
   ```kotlin
   val client = HttpClient(Curl) {
       engine {
           sslVerify = false
       }
   }
   ```

   有关完整示例，请参见 [client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)。

## JVM、Android、Native、JS 和 WasmJs {id="jvm-android-native-wasm-js"}

### CIO {id="cio"}

CIO 引擎是一个完全异步的基于协程的引擎，可在 JVM、Android、Native、JavaScript 和 WebAssembly JavaScript (WasmJs) 平台使用。它目前仅支持 HTTP/1.x。要使用它，请按照以下步骤操作：

1. 添加 `ktor-client-cio` 依赖项：

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
2. 将 [`CIO`](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   
   val client = HttpClient(CIO)
   ```

3. 在 `engine {}` 代码块中使用
   [
   `CIOEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html) 配置引擎：
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

`Js` 引擎可用于 [JavaScript 项目](https://kotlinlang.org/docs/js-overview.html)。它对浏览器应用程序使用 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，对 Node.js 使用 `node-fetch`。要使用它，请按照以下步骤操作：

1. 添加 `ktor-client-js` 依赖项：

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
2. 将 `Js` 类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.js.*
   
   val client = HttpClient(Js)
   ```

   你也可以调用 `JsClient()` 函数来获取 `Js` 引擎单例：
   ```kotlin
   import io.ktor.client.engine.js.*

   val client = JsClient()
   ```

有关完整示例，请参见 [client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)。

## 限制 {id="limitations"}

### HTTP/2 和 WebSockets

并非所有引擎都支持 HTTP/2 协议。如果引擎支持 HTTP/2，你可以在引擎的配置中启用它。例如，使用 [Java](#java) 引擎。

下表显示了特定引擎是否支持 HTTP/2 和 [WebSockets](client-websockets.topic)：

| Engine | HTTP/2 | WebSockets |
|---|---|---|
| `Apache5` | ✅️ | ✖️ |
| `Java` | ✅ | ✅️ |
| `Jetty` | ✅ | ✖️ |
| `CIO` | ✖️ | ✅ |
| `Android` | ✖️ | ✖️ |
| `OkHttp` | ✅ | ✅ |
| `Js` | ✅ | ✅ |
| `Darwin` | ✅ | ✅ |
| `WinHttp` | ✅ | ✅ |
| `Curl` | ✅ | ✅ |

### 安全性

[SSL](client-ssl.md) 必须按引擎配置。每个引擎都提供自己的 SSL 配置选项。

### 代理支持

一些引擎不支持代理。有关完整列表，请参见[代理文档](client-proxy.md#supported_engines)。

### 日志记录

[Logging](client-logging.md) 插件根据目标平台提供不同的日志记录器类型。

### 超时

[HttpTimeout](client-timeout.md) 插件对某些引擎有一些限制。有关完整列表，请参见[超时限制](client-timeout.md#limitations)。

## 示例：如何在多平台移动项目配置引擎 {id="mpp-config"}

在构建多平台项目时，你可以使用[期望与实际声明](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html)来为每个目标平台选择和配置引擎。这允许你在公共代码中共享大部分客户端配置，同时在平台代码中应用引擎特有的选项。我们将使用在[创建跨平台移动应用程序](client-create-multiplatform-application.md)教程中创建的项目来演示如何实现这一点：

<procedure>

1. 打开 **shared/src/commonMain/kotlin/com/example/kmmktor/Platform.kt** 文件，并添加一个顶层 `httpClient()` 函数，该函数接受配置代码块并返回一个 `HttpClient`：
   ```kotlin
   expect fun httpClient(config: HttpClientConfig<*>.() -> Unit = {}): HttpClient
   ```

2. 打开 **shared/src/androidMain/kotlin/com/example/kmmktor/Platform.kt**，并为 Android 模块添加 `httpClient()` 函数的实际声明：
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

   > 此示例展示了如何配置 [`OkHttp`](#okhttp) 引擎，但你也可以使用其他[支持 Android](#jvm-android) 的引擎。
   >
   {style="tip"}

3. 打开 **shared/src/iosMain/kotlin/com/example/kmmktor/Platform.kt**，并为 iOS 模块添加 `httpClient()` 函数的实际声明：
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
   现在你可以在共享代码中调用 `httpClient()`，而无需担心使用哪个引擎。

4. 要在共享代码中使用客户端，请打开 **shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt**，并将 `HttpClient()` 构造函数替换为 `httpClient()` 函数调用：
   ```kotlin
   private val client = httpClient()
   ```

</procedure>