[//]: # (title: 客户端引擎)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解处理网络请求的引擎。
</link-summary>

[Ktor HTTP 客户端](client-create-and-configure.md) 可用于不同平台，包括 JVM、[Android](https://kotlinlang.org/docs/android-overview.html)、[JavaScript](https://kotlinlang.org/docs/js-overview.html) 和 [Native](https://kotlinlang.org/docs/native-overview.html)。特定平台可能需要处理网络请求的特定引擎。
例如，你可以为 JVM 应用使用 `Apache` 或 `Jetty`，为 Android 使用 `OkHttp` 或 `Android`，为针对 Kotlin/Native 的桌面应用使用 `Curl`，等等。不同的引擎可能具有特定的功能并提供不同的配置选项。

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

针对 JVM 或同时针对 JVM 和 Android 的客户端引擎支持以下 Android/Java 版本：

| Engine  | Android version   | Java version |
|---------|-------------------|--------------|
| Apache  |                   | 8+           |
| Java    |                   | 11+          |
| Jetty   |                   | 11+          |
| CIO     | 7.0+ <sup>*</sup> | 8+           |
| Android | 1.x+              | 8+           |
| OkHttp  | 5.0+              | 8+           |

_* 要在较旧的 Android 版本上使用 CIO 引擎，你需要启用 [Java 8 API 脱糖 (desugaring)](https://developer.android.com/studio/write/java8-support)。_

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
| Curl    | ✅                  | ✖️         |

你还需要考虑以下影响一般客户端配置和特定插件使用的限制：
*   如果引擎支持 HTTP/2，你可以通过自定义引擎配置来启用它（参见 [Java](#java) 引擎的示例）。
*   要在 Ktor 客户端中配置 [SSL](client-ssl.md)，你需要自定义所选引擎的配置。
*   有些引擎不支持[代理](client-proxy.md#supported_engines)。
*   [日志 (Logging)](client-logging.md) 插件为不同平台提供了不同的日志类型。
*   [HttpTimeout](client-timeout.md#limitations) 插件对某些特定引擎存在一些限制。

## 添加引擎依赖 {id="dependencies"}

除了 `ktor-client-core` [工件](client-dependencies.md)之外，Ktor 客户端还需要为每个引擎添加特定的依赖项。对于每个受支持的平台，你可以在相应部分查看可用引擎和所需的依赖项：
*   [JVM](#jvm)
*   [JVM 和 Android](#jvm-android)
*   [JavaScript](#js)
*   [Native](#native)

> 对于不同的引擎，Ktor 提供了带有诸如 `-jvm` 或 `-js` 等后缀的平台特定工件，例如 `ktor-client-cio-jvm`。Gradle 会解析适用于给定平台的工件，而 Maven 不支持此功能。这意味着对于 Maven，你需要手动添加平台特定后缀。
>
{type="note"}

## 创建指定引擎的客户端 {id="create"}
要使用特定引擎创建 HTTP 客户端，请将引擎类作为参数传递给 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 构造函数。例如，你可以按如下方式创建使用 `CIO` 引擎的客户端：
```kotlin
```
{src="snippets/_misc_client/CioCreate.kt"}

### 默认引擎 {id="default"}
如果你调用不带参数的 `HttpClient` 构造函数，客户端将根据[构建脚本中添加的](#dependencies)工件自动选择一个引擎。
```kotlin
```
{src="snippets/_misc_client/DefaultEngineCreate.kt"}

这对于多平台项目很有用。例如，对于同时针对 [Android 和 iOS](client-create-multiplatform-application.md) 的项目，你可以将 [Android](#jvm-android) 依赖项添加到 `androidMain` 源集，并将 [Darwin](#darwin) 依赖项添加到 `iosMain` 源集。必要的依赖项将在编译时选择。

## 配置引擎 {id="configure"}
你可以使用 `engine` 方法配置引擎。所有引擎都共享 [HttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html) 暴露的一些常用属性，例如：

```kotlin
```
{src="snippets/_misc_client/BasicEngineConfigExample.kt" interpolate-variables="true" disable-links="false"}

要了解如何配置特定引擎，请参阅下面的相应部分。

## JVM {id="jvm"}
在本节中，我们将了解适用于 JVM 的引擎。

### Apache {id="apache"}
`Apache` 引擎支持 HTTP/1.1 并提供多种配置选项。
如果需要 HTTP/2 支持，你也可以使用 `Apache5` 引擎，它默认启用 HTTP/2。

1.  添加 `ktor-client-apache5` 或 `ktor-client-apache` 依赖项：

    <var name="artifact_name" value="ktor-client-apache5"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  将 `Apache5`/`Apache` 类作为参数传递给 `HttpClient` 构造函数：

    <tabs group="apache_version">
    <tab title="Apache5" group-key="5">

    ```kotlin
    ```
    {src="snippets/_misc_client/Apache5Create.kt" include-lines="1-2,4-5"}

    </tab>
    <tab title="Apache" group-key="4">

    ```kotlin
    ```
    {src="snippets/_misc_client/ApacheCreate.kt"}

    </tab>
    </tabs>

3.  要配置引擎，请将 `Apache5EngineConfig`/`ApacheEngineConfig` 暴露的设置传递给 `engine` 方法：

    <tabs group="apache_version">
    <tab title="Apache5" group-key="5">

    ```kotlin
    ```
    {src="snippets/_misc_client/Apache5Create.kt" include-lines="1-4,7-23"}

    </tab>
    <tab title="Apache" group-key="4">

    ```kotlin
    ```
    {src="snippets/_misc_client/ApacheConfig.kt" interpolate-variables="true" disable-links="false"}

    </tab>
    </tabs>

### Java {id="java"}
`Java` 引擎使用 Java 11 中引入的 [Java HTTP 客户端](https://openjdk.java.net/groups/net/httpclient/intro.html)。要使用它，请按照以下步骤操作：
1.  添加 `ktor-client-java` 依赖项：

    <var name="artifact_name" value="ktor-client-java"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  将 [Java](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java/index.html) 类作为参数传递给 `HttpClient` 构造函数：
    ```kotlin
    ```
    {src="snippets/_misc_client/JavaCreate.kt"}
3.  要配置引擎，请将 [JavaHttpConfig](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html) 暴露的设置传递给 `engine` 方法：
    ```kotlin
    ```
    {src="snippets/_misc_client/JavaConfig.kt" interpolate-variables="true" disable-links="false"}

### Jetty {id="jetty"}
`Jetty` 引擎仅支持 HTTP/2，并可以按以下方式配置：
1.  添加 `ktor-client-jetty-jakarta` 依赖项：

    <var name="artifact_name" value="ktor-client-jetty-jakarta"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  将 [Jetty](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html) 类作为参数传递给 `HttpClient` 构造函数：
    ```kotlin
    ```
    {src="snippets/_misc_client/JettyCreate.kt"}
3.  要配置引擎，请将 [JettyEngineConfig](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty-engine-config/index.html) 暴露的设置传递给 `engine` 方法：
    ```kotlin
    ```
    {src="snippets/_misc_client/JettyConfig.kt" interpolate-variables="true" disable-links="false"}

## JVM 和 Android {id="jvm-android"}

在本节中，我们将了解适用于 JVM/Android 的引擎及其配置。

### Android {id="android"}
`Android` 引擎针对 Android，并可以按以下方式配置：
1.  添加 `ktor-client-android` 依赖项：

    <var name="artifact_name" value="ktor-client-android"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  将 [Android](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android/index.html) 类作为参数传递给 `HttpClient` 构造函数：
    ```kotlin
    ```
    {src="snippets/_misc_client/AndroidCreate.kt"}
3.  要配置引擎，请将 [AndroidEngineConfig](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html) 暴露的设置传递给 `engine` 方法：
    ```kotlin
    ```
    {src="snippets/_misc_client/AndroidConfig.kt" interpolate-variables="true" disable-links="false"}

### OkHttp {id="okhttp"}
`OkHttp` 引擎基于 OkHttp，并可以按以下方式配置：
1.  添加 `ktor-client-okhttp` 依赖项：

    <var name="artifact_name" value="ktor-client-okhttp"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  将 [OkHttp](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html) 类作为参数传递给 `HttpClient` 构造函数：
    ```kotlin
    ```
    {src="snippets/_misc_client/OkHttpCreate.kt"}
3.  要配置引擎，请将 [OkHttpConfig](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html) 暴露的设置传递给 `engine` 方法：
    ```kotlin
    ```
    {src="snippets/_misc_client/OkHttpConfig.kt" interpolate-variables="true" disable-links="false"}

## Native {id="native"}
在本节中，我们将了解如何配置针对 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 的引擎。

> 在 Kotlin/Native 项目中使用 Ktor 需要新的内存管理器，该管理器从 Kotlin 1.7.20 开始默认启用。
>
{id="newmm-note"}

### Darwin {id="darwin"}
`Darwin` 引擎针对[基于 Darwin](https://en.wikipedia.org/wiki/Darwin_(operating_system)) 的操作系统（如 macOS、iOS、tvOS 等），并在底层使用 [NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession)。要使用 `Darwin` 引擎，请按照以下步骤操作：

1.  添加 `ktor-client-darwin` 依赖项：

    <var name="artifact_name" value="ktor-client-darwin"/>
    <var name="target" value="-macosx64"/>
    <include from="lib.topic" element-id="add_ktor_artifact_mpp"/>
2.  将 `Darwin` 类作为参数传递给 `HttpClient` 构造函数：
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.darwin.*

    val client = HttpClient(Darwin)
    ```
3.  要配置引擎，请将 [DarwinClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html) 暴露的设置传递给 `engine` 函数。
    例如，你可以使用 `configureRequest` 函数访问 `NSMutableURLRequest` 或使用 `configureSession` 来自定义会话配置。下面的代码片段展示了如何使用 `configureRequest`：
    ```kotlin
    ```
    {src="snippets/client-engine-darwin/src/nativeMain/kotlin/Main.kt" include-lines="8-14"}

    你可以在此处找到完整示例：[client-engine-darwin](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-darwin)。

### WinHttp {id="winhttp"}
`WinHttp` 引擎针对基于 Windows 的操作系统。
要使用 `WinHttp` 引擎，请按照以下步骤操作：

1.  添加 `ktor-client-winhttp` 依赖项：

    <var name="artifact_name" value="ktor-client-winhttp"/>
    <var name="target" value="-mingwx64"/>
    <include from="lib.topic" element-id="add_ktor_artifact_mpp"/>
2.  将 `WinHttp` 类作为参数传递给 `HttpClient` 构造函数：
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.winhttp.*

    val client = HttpClient(WinHttp)
    ```
3.  要配置引擎，请将 [WinHttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html) 暴露的设置传递给 `engine` 函数。
    例如，你可以使用 `protocolVersion` 属性来更改 HTTP 版本：
    ```kotlin
    ```
    {src="snippets/client-engine-winhttp/src/nativeMain/kotlin/Main.kt" include-lines="9-13"}

    你可以在此处找到完整示例：[client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)。

### Curl {id="curl"}

对于桌面平台，Ktor 还提供了 `Curl` 引擎。该引擎支持以下平台：`linuxX64`、`macosX64`、`macosArm64`、`mingwX64`。要使用 `Curl` 引擎，请按照以下步骤操作：

1.  安装 [libcurl 库](https://curl.se/libcurl/)。
    > 在 Linux 上，你必须安装 `libcurl` 的 `gnutls` 版本。
    > 要在 Ubuntu 上安装此版本，你可以运行：
    ```bash
    sudo apt-get install libcurl4-gnutls-dev
    ```

    > 在 Windows 上，你可能需要考虑使用 [MinGW/MSYS2](FAQ.topic#native-curl) 的 `curl` 二进制文件。
2.  添加 `ktor-client-curl` 依赖项：

    <var name="artifact_name" value="ktor-client-curl"/>
    <var name="target" value="-macosx64"/>
    <include from="lib.topic" element-id="add_ktor_artifact_mpp"/>
3.  将 `Curl` 类作为参数传递给 `HttpClient` 构造函数：
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.curl.*

    val client = HttpClient(Curl)
    ```

4.  要配置引擎，请将 `CurlClientEngineConfig` 暴露的设置传递给 `engine` 方法。
    下面的代码片段展示了如何出于测试目的禁用 SSL 验证：
    ```kotlin
    ```
    {src="snippets/client-engine-curl/src/nativeMain/kotlin/Main.kt" include-lines="8-12"}

    你可以在此处找到完整示例：[client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)。

## JVM、Android 和 Native {id="jvm-android-native"}

### CIO {id="cio"}
CIO 是一个完全异步的基于协程的引擎，可用于 JVM、Android 和 Native 平台。目前它仅支持 HTTP/1.x。要使用它，请按照以下步骤操作：
1.  添加 `ktor-client-cio` 依赖项：

    <var name="artifact_name" value="ktor-client-cio"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  将 [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 类作为参数传递给 `HttpClient` 构造函数：
    ```kotlin
    ```
    {src="snippets/_misc_client/CioCreate.kt"}

3.  要配置引擎，请将 [CIOEngineConfig](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html) 暴露的设置传递给 `engine` 方法：
    ```kotlin
    ```
    {src="snippets/_misc_client/CioConfig.kt" interpolate-variables="true" disable-links="false"}

## JavaScript {id="js"}

`Js` 引擎可用于 [JavaScript 项目](https://kotlinlang.org/docs/js-overview.html)。该引擎对浏览器应用使用 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，对 Node.js 使用 `node-fetch`。要使用它，请按照以下步骤操作：

1.  添加 `ktor-client-js` 依赖项：

    <var name="artifact_name" value="ktor-client-js"/>
    <var name="target" value=""/>
    <include from="lib.topic" element-id="add_ktor_artifact_mpp"/>
2.  将 `Js` 类作为参数传递给 `HttpClient` 构造函数：
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.js.*

    val client = HttpClient(Js)
    ```

    你也可以调用 `JsClient` 函数来获取 `Js` 引擎的单例：
    ```kotlin
    import io.ktor.client.engine.js.*

    val client = JsClient()
    ```

你可以在此处找到完整示例：[client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)。

## 示例：如何在多平台移动项目中配置引擎 {id="mpp-config"}

要在多平台移动项目中配置引擎特定选项，你可以使用 [`expect/actual` 声明](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html)。
让我们演示如何使用在 [](client-create-multiplatform-application.md) 教程中创建的项目来实现这一点：

1.  打开 `shared/src/commonMain/kotlin/com/example/kmmktor/Platform.kt` 文件并添加一个顶级 `httpClient` 函数，该函数接受客户端配置并返回 `HttpClient`：
    ```kotlin
    expect fun httpClient(config: HttpClientConfig<*>.() -> Unit = {}): HttpClient
    ```

2.  打开 `shared/src/androidMain/kotlin/com/example/kmmktor/Platform.kt` 并为 Android 模块添加 `httpClient` 函数的实际声明：
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
    此示例展示了如何配置 [OkHttp](#okhttp) 引擎，但你也可以使用其他[支持 Android 的](#jvm-android)引擎。

3.  打开 `shared/src/iosMain/kotlin/com/example/kmmktor/Platform.kt` 并为 iOS 模块添加 `httpClient` 函数的实际声明：
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

4.  最后，打开 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` 并将 `HttpClient()` 构造函数替换为 `httpClient` 函数调用：
    ```kotlin
    private val client = httpClient()