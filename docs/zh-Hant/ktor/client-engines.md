[//]: # (title: 客戶端引擎)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解處理網路請求的引擎。
</link-summary>

[Ktor HTTP 客戶端](client-create-and-configure.md) 可用於不同平台，包括 JVM、[Android](https://kotlinlang.org/docs/android-overview.html)、[JavaScript](https://kotlinlang.org/docs/js-overview.html) 和 [Native](https://kotlinlang.org/docs/native-overview.html)。特定平台可能需要處理網路請求的特定引擎。
例如，您可以為 JVM 應用程式使用 `Apache` 或 `Jetty`，為 Android 使用 `OkHttp` 或 `Android`，為針對 Kotlin/Native 的桌面應用程式使用 `Curl` 等。不同的引擎可能具有特定功能並提供不同的配置選項。

## 要求與限制 {id="requirements"}

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

針對 JVM 或同時針對 JVM 和 Android 的客戶端引擎支援以下 Android/Java 版本：

| Engine  | Android version   | Java version |
|---------|-------------------|--------------|
| Apache  |                   | 8+           |
| Java    |                   | 11+          |
| Jetty   |                   | 11+          |
| CIO     | 7.0+ <sup>*</sup> | 8+           |
| Android | 1.x+              | 8+           |
| OkHttp  | 5.0+              | 8+           |

_* 若要在舊版 Android 上使用 CIO 引擎，您需要啟用 [Java 8 API desugaring](https://developer.android.com/studio/write/java8-support)。_

### 限制 {id="limitations"}

下表顯示了特定引擎是否支援 HTTP/2 和 [WebSockets](client-websockets.topic)：

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

您還需要考慮影響一般客戶端配置和特定外掛程式使用的以下限制：
*   如果引擎支援 HTTP/2，您可以透過自訂引擎配置來啟用它（請參閱 [](#java) 引擎的範例）。
*   若要在 Ktor 客戶端中配置 [SSL](client-ssl.md)，您需要自訂所選引擎的配置。
*   有些引擎不支援[代理](client-proxy.md#supported_engines)。
*   [日誌記錄](client-logging.md)外掛程式為不同平台提供不同類型的日誌記錄器。
*   [HttpTimeout](client-timeout.md#limitations) 外掛程式對特定引擎有一些限制。

## 新增引擎依賴 {id="dependencies"}

除了 [ktor-client-core](client-dependencies.md) 構件外，Ktor 客戶端還需要為每個引擎新增特定依賴。對於每個支援的平台，您可以在相應部分查看可用的引擎和所需的依賴：
*   [JVM](#jvm)
*   [JVM 和 Android](#jvm-android)
*   [JavaScript](#js)
*   [Native](#native)

> 對於不同的引擎，Ktor 提供帶有 `-jvm` 或 `-js` 等後綴的特定平台構件，例如 `ktor-client-cio-jvm`。Gradle 會解析適合給定平台的構件，而 Maven 不支援此功能。這表示對於 Maven，您需要手動新增特定平台後綴。
>
{type="note"}

## 使用指定引擎建立客戶端 {id="create"}
若要使用特定引擎建立 HTTP 客戶端，請將引擎類別作為參數傳遞給 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 建構函式。例如，您可以如下建立一個使用 `CIO` 引擎的客戶端：
[object Promise]

### 預設引擎 {id="default"}
如果呼叫 `HttpClient` 建構函式時沒有參數，客戶端將根據[建置指令碼中新增的](dependencies)構件自動選擇引擎。
[object Promise]

這對於多平台專案很有用。例如，對於一個同時針對 [Android 和 iOS](client-create-multiplatform-application.md) 的專案，您可以將 [Android](#jvm-android) 依賴新增到 `androidMain` 源集，並將 [Darwin](#darwin) 依賴新增到 `iosMain` 源集。必要的依賴將在編譯時選取。

## 配置引擎 {id="configure"}
您可以使用 `engine` 方法配置引擎。所有引擎都共享 [HttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html) 暴露的幾個共同屬性，例如：

[object Promise]

要了解如何配置特定引擎，請參閱下面的相應部分。

## JVM {id="jvm"}
在本節中，我們將了解 JVM 可用的引擎。

### Apache {id="apache"}
`Apache` 引擎支援 HTTP/1.1 並提供多種配置選項。
如果您需要 HTTP/2 支援，也可以使用 `Apache5` 引擎，它預設啟用 HTTP/2。

1.  新增 `ktor-client-apache5` 或 `ktor-client-apache` 依賴：

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

2.  將 `Apache5`/`Apache` 類別作為參數傳遞給 `HttpClient` 建構函式：

    <tabs group="apache_version">
    <tab title="Apache5" group-key="5">

    [object Promise]

    </tab>
    <tab title="Apache" group-key="4">

    [object Promise]

    </tab>
    </tabs>

3.  若要配置引擎，請將 `Apache5EngineConfig`/`ApacheEngineConfig` 暴露的設定傳遞給 `engine` 方法：

    <tabs group="apache_version">
    <tab title="Apache5" group-key="5">

    [object Promise]

    </tab>
    <tab title="Apache" group-key="4">

    [object Promise]

    </tab>
    </tabs>

### Java {id="java"}
`Java` 引擎使用 Java 11 中引入的 [Java HTTP 客戶端](https://openjdk.java.net/groups/net/httpclient/intro.html)。若要使用它，請遵循以下步驟：
1.  新增 `ktor-client-java` 依賴：

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

2.  將 [Java](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java/index.html) 類別作為參數傳遞給 `HttpClient` 建構函式：
    [object Promise]
3.  若要配置引擎，請將 [JavaHttpConfig](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html) 暴露的設定傳遞給 `engine` 方法：
    [object Promise]

### Jetty {id="jetty"}
`Jetty` 引擎僅支援 HTTP/2，可以透過以下方式配置：
1.  新增 `ktor-client-jetty-jakarta` 依賴：

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

2.  將 [Jetty](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html) 類別作為參數傳遞給 `HttpClient` 建構函式：
    [object Promise]
3.  若要配置引擎，請將 [JettyEngineConfig](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty-engine-config/index.html) 暴露的設定傳遞給 `engine` 方法：
    [object Promise]

## JVM 和 Android {id="jvm-android"}

在本節中，我們將了解 JVM/Android 可用的引擎及其配置。

### Android {id="android"}
`Android` 引擎針對 Android，可以透過以下方式配置：
1.  新增 `ktor-client-android` 依賴：

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

2.  將 [Android](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android/index.html) 類別作為參數傳遞給 `HttpClient` 建構函式：
    [object Promise]
3.  若要配置引擎，請將 [AndroidEngineConfig](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html) 暴露的設定傳遞給 `engine` 方法：
    [object Promise]

### OkHttp {id="okhttp"}
`OkHttp` 引擎基於 OkHttp，可以透過以下方式配置：
1.  新增 `ktor-client-okhttp` 依賴：

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

2.  將 [OkHttp](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html) 類別作為參數傳遞給 `HttpClient` 建構函式：
    [object Promise]
3.  若要配置引擎，請將 [OkHttpConfig](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html) 暴露的設定傳遞給 `engine` 方法：
    [object Promise]

## Native {id="native"}
在本節中，我們將了解如何配置針對 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 的引擎。

> 在 Kotlin/Native 專案中使用 Ktor 需要一個[新記憶體管理員](https://kotlinlang.org/docs/native-memory-manager.html)，該管理員從 Kotlin 1.7.20 開始預設啟用。
>
{id="newmm-note"}

### Darwin {id="darwin"}
`Darwin` 引擎針對[基於 Darwin](https://en.wikipedia.org/wiki/Darwin_(operating_system)) 的作業系統（例如 macOS、iOS、tvOS 等），其底層使用 [NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession)。若要使用 `Darwin` 引擎，請遵循以下步驟：

1.  新增 `ktor-client-darwin` 依賴：

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

2.  將 `Darwin` 類別作為參數傳遞給 `HttpClient` 建構函式：
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.darwin.*

    val client = HttpClient(Darwin)
    ```
3.  若要配置引擎，請將 [DarwinClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html) 暴露的設定傳遞給 `engine` 函式。
    例如，您可以使用 `configureRequest` 函式存取 `NSMutableURLRequest` 或 `configureSession` 來自訂會話配置。以下程式碼片段展示了如何使用 `configureRequest`：
    [object Promise]

    您可以在這裡找到完整範例：[client-engine-darwin](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-darwin)。

### WinHttp {id="winhttp"}
`WinHttp` 引擎針對基於 Windows 的作業系統。
若要使用 `WinHttp` 引擎，請遵循以下步驟：

1.  新增 `ktor-client-winhttp` 依賴：

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

2.  將 `WinHttp` 類別作為參數傳遞給 `HttpClient` 建構函式：
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.winhttp.*

    val client = HttpClient(WinHttp)
    ```
3.  若要配置引擎，請將 [WinHttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html) 暴露的設定傳遞給 `engine` 函式。
    例如，您可以使用 `protocolVersion` 屬性來更改 HTTP 版本：
    [object Promise]

    您可以在這裡找到完整範例：[client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)。

### Curl {id="curl"}

對於桌面平台，Ktor 還提供 `Curl` 引擎。此引擎支援以下平台：`linuxX64`、`macosX64`、`macosArm64`、`mingwX64`。若要使用 `Curl` 引擎，請遵循以下步驟：

1.  安裝 [libcurl 函式庫](https://curl.se/libcurl/)。
    > 在 Linux 上，您必須安裝 libcurl 的 `gnutls` 版本。
    > 若要在 Ubuntu 上安裝此版本，您可以執行：
    ```bash
    sudo apt-get install libcurl4-gnutls-dev
    ```

    > 在 Windows 上，您可能需要考慮 [MinGW/MSYS2](FAQ.topic#native-curl) 的 `curl` 二進位檔案。
2.  新增 `ktor-client-curl` 依賴：

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

3.  將 `Curl` 類別作為參數傳遞給 `HttpClient` 建構函式：
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.curl.*

    val client = HttpClient(Curl)
    ```

4.  若要配置引擎，請將 `CurlClientEngineConfig` 暴露的設定傳遞給 `engine` 方法。
    以下程式碼片段展示了如何為測試目的禁用 SSL 驗證：
    [object Promise]

    您可以在這裡找到完整範例：[client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)。

## JVM、Android 和 Native {id="jvm-android-native"}

### CIO {id="cio"}
CIO 是一個完全非同步的協程式引擎，可用於 JVM、Android 和 Native 平台。它目前僅支援 HTTP/1.x。若要使用它，請遵循以下步驟：
1.  新增 `ktor-client-cio` 依賴：

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

2.  將 [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 類別作為參數傳遞給 `HttpClient` 建構函式：
    [object Promise]

3.  若要配置引擎，請將 [CIOEngineConfig](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html) 暴露的設定傳遞給 `engine` 方法：
    [object Promise]

## JavaScript {id="js"}

`Js` 引擎可用於 [JavaScript 專案](https://kotlinlang.org/docs/js-overview.html)。此引擎為瀏覽器應用程式使用 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)，為 Node.js 使用 `node-fetch`。若要使用它，請遵循以下步驟：

1.  新增 `ktor-client-js` 依賴：

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

2.  將 `Js` 類別作為參數傳遞給 `HttpClient` 建構函式：
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.js.*

    val client = HttpClient(Js)
    ```

    您也可以呼叫 `JsClient` 函式以獲取 `Js` 引擎單例：
    ```kotlin
    import io.ktor.client.engine.js.*

    val client = JsClient()
    ```

您可以在這裡找到完整範例：[client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)。

## 範例：如何在多平台行動專案中配置引擎 {id="mpp-config"}

若要在多平台行動專案中配置引擎特定選項，您可以使用 [expect/actual 宣告](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html)。
讓我們透過在 [](client-create-multiplatform-application.md) 教學中建立的專案來演示如何實現這一點：

1.  開啟 `shared/src/commonMain/kotlin/com/example/kmmktor/Platform.kt` 檔案，並新增一個頂層的 `httpClient` 函式，該函式接受客戶端配置並返回 `HttpClient`：
    ```kotlin
    expect fun httpClient(config: HttpClientConfig<*>.() -> Unit = {}): HttpClient
    ```

2.  開啟 `shared/src/androidMain/kotlin/com/example/kmmktor/Platform.kt` 並為 Android 模組新增 `httpClient` 函式的實際宣告：
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
    此範例展示如何配置 [OkHttp](#okhttp) 引擎，但您也可以使用 Android 支援的其他引擎。

3.  開啟 `shared/src/iosMain/kotlin/com/example/kmmktor/Platform.kt` 並為 iOS 模組新增 `httpClient` 函式的實際宣告：
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

4.  最後，開啟 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` 並將 `HttpClient()` 建構函式替換為 `httpClient` 函式呼叫：
    ```kotlin
    private val client = httpClient()