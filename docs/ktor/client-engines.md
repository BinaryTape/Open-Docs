[//]: # (title: 客户端引擎)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解处理网络请求的引擎。
</link-summary>

[Ktor HTTP 客户端](client-create-and-configure.md) 可用于不同平台，包括 JVM、[Android](https://kotlinlang.org/docs/android-overview.html)、[JavaScript](https://kotlinlang.org/docs/js-overview.html) 和[原生](https://kotlinlang.org/docs/native-overview.html)。特定平台可能需要特定的引擎来处理网络请求。例如，你可以将 `Apache` 或 `Jetty` 用于 JVM 应用程序，`OkHttp` 或 `Android` 用于 Android，`Curl` 用于面向 Kotlin/Native 的桌面应用程序等。不同的引擎可能具有特定特性并提供不同的配置选项。

## 要求与限制 {id="requirements"}

### 支持的平台 {id="platforms"}

下表列出了每个引擎支持的[平台](client-supported-platforms.md)：

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

### 支持的 Android/Java 版本 {id="minimal-version"}

面向 JVM 或同时面向 JVM 和 Android 的客户端引擎支持以下 Android/Java 版本：

| Engine  | Android version   | Java version |
|---------|-------------------|--------------|
| Apache  |                   | 8+           |
| Java    |                   | 11+          |
| Jetty   |                   | 11+          |
| CIO     | 7.0+ <sup>*</sup> | 8+           |
| Android | 1.x+              | 8+           |
| OkHttp  | 5.0+              | 8+           |

_* 若要在旧版 Android 上使用 CIO 引擎，你需要启用 [Java 8 API desugaring](https://developer.android.com/studio/write/java8-support)。_

### 限制 {id="limitations"}

下表显示了特定引擎是否支持 HTTP/2 和 [WebSockets](client-websockets.topic)：

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

你还需要考虑以下影响常规客户端配置和特定插件使用的限制：
- 如果引擎支持 HTTP/2，你可以通过自定义引擎配置来启用它（关于 [Java](#java) 引擎的示例，请参见该部分）。
- 若要在 Ktor 客户端中配置 [SSL](client-ssl.md)，你需要自定义所选引擎的配置。
- 某些引擎不支持 [代理](client-proxy.md#supported_engines)。
- [Logging](client-logging.md) 插件为不同平台提供了不同类型的日志记录器。
- [HttpTimeout](client-timeout.md#limitations) 插件对某些特定引擎存在一些限制。

## 添加引擎依赖项 {id="dependencies"}

除了 [ktor-client-core](client-dependencies.md) artifact 外，Ktor 客户端还需要为每个引擎添加特定的依赖项。对于每个支持的平台，你可以在对应部分查看可用的引擎和所需的依赖项：
* [JVM](#jvm)
* [JVM 和 Android](#jvm-android)
* [JavaScript](#js)
* [原生](#native)

> 对于不同的引擎，Ktor 提供了带有 `-jvm` 或 `-js` 等后缀的平台特有 artifact，例如 `ktor-client-cio-jvm`。Gradle 会解析适合给定平台的 artifact，而 Maven 不支持此功能。这意味着对于 Maven，你需要手动添加平台特有的后缀。
>
{type="note"}

## 使用指定引擎创建客户端 {id="create"}
要使用特定引擎创建 HTTP 客户端，请将引擎类作为实参传递给 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 构造函数。例如，你可以如下所示使用 `CIO` 引擎创建客户端：
[object Promise]

### 默认引擎 {id="default"}
如果你调用不带实参的 `HttpClient` 构造函数，客户端将根据[构建脚本](#dependencies)中添加的 artifact 自动选择引擎。
[object Promise]

这对于多平台项目非常有用。例如，对于面向 [Android 和 iOS](client-create-multiplatform-application.md) 的项目，你可以将 [Android](#jvm-android) 依赖项添加到 `androidMain` 源代码集，将 [Darwin](#darwin) 依赖项添加到 `iosMain` 源代码集。必要的依赖项将在编译期选择。

## 配置引擎 {id="configure"}
你可以使用 `engine` 方法配置引擎。所有引擎都共享 [HttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html) 公开的几个公共属性，例如：

[object Promise]

要了解如何配置特定引擎，请参见下面的对应部分。

## JVM {id="jvm"}
在本节中，我们将介绍 JVM 可用的引擎。

### Apache {id="apache"}
`Apache` 引擎支持 HTTP/1.1 并提供了多种配置选项。如果你需要 HTTP/2 支持，也可以使用 `Apache5` 引擎，它默认启用 HTTP/2。

1. 添加 `ktor-client-apache5` 或 `ktor-client-apache` 依赖项：

   <var name="artifact_name" value="ktor-client-apache5"/>
   
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
    
2. 将 `Apache5`/`Apache` 类作为实参传递给 `HttpClient` 构造函数：

   <tabs group="apache_version">
   <tab title="Apache5" group-key="5">
   
   [object Promise]
   
   </tab>
   <tab title="Apache" group-key="4">
   
   [object Promise]
   
   </tab>
   </tabs>

3. 要配置引擎，将 `Apache5EngineConfig`/`ApacheEngineConfig` 公开的设置传递给 `engine` 方法：

   <tabs group="apache_version">
   <tab title="Apache5" group-key="5">

   [object Promise]

   </tab>
   <tab title="Apache" group-key="4">

   [object Promise]

   </tab>
   </tabs>

### Java {id="java"}
`Java` 引擎使用 Java 11 中引入的 [Java HTTP 客户端](https://openjdk.java.net/groups/net/httpclient/intro.html)。要使用它，请按照以下步骤操作：
1. 添加 `ktor-client-java` 依赖项：

   <var name="artifact_name" value="ktor-client-java"/>
   
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
    
2. 将 [Java](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java/index.html) 类作为实参传递给 `HttpClient` 构造函数：
   [object Promise]
3. 要配置引擎，将 [JavaHttpConfig](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html) 公开的设置传递给 `engine` 方法：
   [object Promise]

### Jetty {id="jetty"}
`Jetty` 引擎仅支持 HTTP/2，可按以下方式配置：
1. 添加 `ktor-client-jetty-jakarta` 依赖项：

   <var name="artifact_name" value="ktor-client-jetty-jakarta"/>
   
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
    
2. 将 [Jetty](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html) 类作为实参传递给 `HttpClient` 构造函数：
   [object Promise]
3. 要配置引擎，将 [JettyEngineConfig](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty-engine-config/index.html) 公开的设置传递给 `engine` 方法：
   [object Promise]

## JVM 和 Android {id="jvm-android"}

在本节中，我们将介绍 JVM/Android 可用的引擎及其配置。

### Android {id="android"}
`Android` 引擎面向 Android，可按以下方式配置：
1. 添加 `ktor-client-android` 依赖项：

   <var name="artifact_name" value="ktor-client-android"/>
   
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
    
2. 将 [Android](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android/index.html) 类作为实参传递给 `HttpClient` 构造函数：
   [object Promise]
3. 要配置引擎，将 [AndroidEngineConfig](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html) 公开的设置传递给 `engine` 方法：
   [object Promise]

### OkHttp {id="okhttp"}
`OkHttp` 引擎基于 OkHttp，可按以下方式配置：
1. 添加 `ktor-client-okhttp` 依赖项：

   <var name="artifact_name" value="ktor-client-okhttp"/>
   
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
    
2. 将 [OkHttp](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html) 类作为实参传递给 `HttpClient` 构造函数：
   [object Promise]
3. 要配置引擎，将 [OkHttpConfig](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html) 公开的设置传递给 `engine` 方法：
   [object Promise]

## 原生 {id="native"}
在本节中，我们将介绍如何配置面向 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 的引擎。

> 在 Kotlin/Native 项目中使用 Ktor 需要新的[内存管理器](https://kotlinlang.org/docs/native-memory-manager.html)，该管理器从 Kotlin 1.7.20 开始默认启用。
>
{id="newmm-note"}

### Darwin {id="darwin"}
`Darwin` 引擎面向 [基于 Darwin](https://en.wikipedia.org/wiki/Darwin_(operating_system)) 的操作系统（如 macOS、iOS、tvOS 等），并在底层使用 [NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession)。要使用 `Darwin` 引擎，请按照以下步骤操作：

1. 添加 `ktor-client-darwin` 依赖项：

   <var name="artifact_name" value="ktor-client-darwin"/>
   <var name="target" value="-macosx64"/>
   
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
    
2. 将 `Darwin` 类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.darwin.*
   
   val client = HttpClient(Darwin)
   ```
3. 要配置引擎，将 [DarwinClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html) 公开的设置传递给 `engine` 函数。
   例如，你可以使用 `configureRequest` 函数来访问 `NSMutableURLRequest`，或使用 `configureSession` 来自定义会话配置。下面的代码片段展示了如何使用 `configureRequest`：
   [object Promise]

   可以在此处找到完整示例：[client-engine-darwin](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-darwin)。

### WinHttp {id="winhttp"}
`WinHttp` 引擎面向基于 Windows 的操作系统。
要使用 `WinHttp` 引擎，请按照以下步骤操作：

1. 添加 `ktor-client-winhttp` 依赖项：

   <var name="artifact_name" value="ktor-client-winhttp"/>
   <var name="target" value="-mingwx64"/>
   
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
    
2. 将 `WinHttp` 类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.winhttp.*
   
   val client = HttpClient(WinHttp)
   ```
3. 要配置引擎，将 [WinHttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html) 公开的设置传递给 `engine` 函数。
   例如，你可以使用 `protocolVersion` 属性来更改 HTTP 版本：
   [object Promise]

   可以在此处找到完整示例：[client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)。

### Curl {id="curl"}

对于桌面平台，Ktor 还提供了 `Curl` 引擎。此引擎支持以下平台：`linuxX64`、`macosX64`、`macosArm64`、`mingwX64`。要使用 `Curl` 引擎，请按照以下步骤操作：

1. 安装 [libcurl 库](https://curl.se/libcurl/)。
   > 在 Linux 上，你必须安装 `gnutls` 版本的 libcurl。
   > 要在 Ubuntu 上安装此版本，你可以运行：
   ```bash
   sudo apt-get install libcurl4-gnutls-dev
   ```

   > 在 Windows 上，你可能需要考虑 [MinGW/MSYS2](FAQ.topic#native-curl) 的 `curl` 二进制文件。
2. 添加 `ktor-client-curl` 依赖项：

   <var name="artifact_name" value="ktor-client-curl"/>
   <var name="target" value="-macosx64"/>
   
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
    
3. 将 `Curl` 类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.curl.*
   
   val client = HttpClient(Curl)
   ```

4. 要配置引擎，将 `CurlClientEngineConfig` 公开的设置传递给 `engine` 方法。
   下面的代码片段展示了如何出于测试目的禁用 SSL 验证：
   [object Promise]

   可以在此处找到完整示例：[client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)。

## JVM、Android 和原生 {id="jvm-android-native"}

### CIO {id="cio"}
CIO 是一个完全异步的基于协程的引擎，可用于 JVM、Android 和原生平台。它目前仅支持 HTTP/1.x。要使用它，请按照以下步骤操作：
1. 添加 `ktor-client-cio` 依赖项：

   <var name="artifact_name" value="ktor-client-cio"/>
   
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
    
2. 将 [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 类作为实参传递给 `HttpClient` 构造函数：
   [object Promise]

3. 要配置引擎，将 [CIOEngineConfig](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html) 公开的设置传递给 `engine` 方法：
   [object Promise]

## JavaScript {id="js"}

`Js` 引擎可用于 [JavaScript 项目](https://kotlinlang.org/docs/js-overview.html)。此引擎对浏览器应用程序使用 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，对 Node.js 使用 `node-fetch`。要使用它，请按照以下步骤操作：

1. 添加 `ktor-client-js` 依赖项：

   <var name="artifact_name" value="ktor-client-js"/>
   <var name="target" value=""/>
   
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
    
2. 将 `Js` 类作为实参传递给 `HttpClient` 构造函数：
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.js.*
   
   val client = HttpClient(Js)
   ```

   你也可以调用 `JsClient` 函数来获取 `Js` 引擎单例：
   ```kotlin
   import io.ktor.client.engine.js.*

   val client = JsClient()
   ```

可以在此处找到完整示例：[client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)。

## 示例：如何在多平台移动项目中配置引擎 {id="mpp-config"}

若要在多平台移动项目中配置引擎特有的选项，你可以使用 [expect/actual 声明](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html)。
让我们演示如何使用在 [](client-create-multiplatform-application.md) 教程中创建的项目来实现这一点：

1. 打开 `shared/src/commonMain/kotlin/com/example/kmmktor/Platform.kt` 文件并添加一个顶层 `httpClient` 函数，该函数接受客户端配置并返回 `HttpClient`：
   ```kotlin
   expect fun httpClient(config: HttpClientConfig<*>.() -> Unit = {}): HttpClient
   ```
   
2. 打开 `shared/src/androidMain/kotlin/com/example/kmmktor/Platform.kt` 并添加 `httpClient` 函数用于 Android 模块的 actual 声明：
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
   此示例展示了如何配置 [OkHttp](#okhttp) 引擎，但你也可以使用 [Android 支持的](#jvm-android) 其他引擎。

3. 打开 `shared/src/iosMain/kotlin/com/example/kmmktor/Platform.kt` 并添加 `httpClient` 函数用于 iOS 模块的 actual 声明：
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

4. 最后，打开 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` 并将 `HttpClient()` 构造函数替换为 `httpClient` 函数调用：
   ```kotlin
   private val client = httpClient()