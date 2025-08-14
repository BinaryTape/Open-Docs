[//]: # (title: 클라이언트 엔진)

<show-structure for="chapter" depth="2"/>

<link-summary>
네트워크 요청을 처리하는 엔진에 대해 알아봅니다.
</link-summary>

[Ktor HTTP 클라이언트](client-create-and-configure.md)는 JVM, [Android](https://kotlinlang.org/docs/android-overview.html), [JavaScript](https://kotlinlang.org/docs/js-overview.html), [Native](https://kotlinlang.org/docs/native-overview.html)를 포함한 다양한 플랫폼에서 사용될 수 있습니다. 특정 플랫폼은 네트워크 요청을 처리하는 특정 엔진을 필요로 할 수 있습니다. 예를 들어, JVM 애플리케이션에는 `Apache` 또는 `Jetty`를, Android에는 `OkHttp` 또는 `Android`를, Kotlin/Native를 대상으로 하는 데스크톱 애플리케이션에는 `Curl` 등을 사용할 수 있습니다. 다양한 엔진은 특정 기능을 가지고 있으며 다른 구성 옵션을 제공할 수 있습니다.

## 요구 사항 및 제한 사항 {id="requirements"}

### 지원되는 플랫폼 {id="platforms"}

아래 표는 각 엔진이 지원하는 [플랫폼](client-supported-platforms.md)을 나열합니다.

| 엔진  | 플랫폼                                              |
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

### 지원되는 Android/Java 버전 {id="minimal-version"}

JVM 또는 JVM 및 Android를 모두 대상으로 하는 클라이언트 엔진은 다음 Android/Java 버전을 지원합니다.

| 엔진  | Android 버전      | Java 버전 |
|---------|-------------------|--------------|
| Apache  |                   | 8+           |
| Java    |                   | 11+          |
| Jetty   |                   | 11+          |
| CIO     | 7.0+ <sup>*</sup> | 8+           |
| Android | 1.x+              | 8+           |
| OkHttp  | 5.0+              | 8+           |

_* CIO 엔진을 이전 Android 버전에서 사용하려면 [Java 8 API desugaring](https://developer.android.com/studio/write/java8-support)을 활성화해야 합니다._

### 제한 사항 {id="limitations"}

아래 표는 특정 엔진이 HTTP/2 및 [WebSockets](client-websockets.topic)를 지원하는지 여부를 보여줍니다.

| 엔진  | HTTP/2             | WebSockets |
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

또한 일반적인 클라이언트 구성 및 특정 플러그인 사용에 영향을 미치는 다음 제한 사항을 고려해야 합니다.
- 엔진이 HTTP/2를 지원하는 경우, 엔진 구성을 사용자 지정하여 활성화할 수 있습니다([Java](#java) 엔진의 예시 참조).
- Ktor 클라이언트에서 [SSL](client-ssl.md)을 구성하려면 선택한 엔진의 구성을 사용자 지정해야 합니다.
- 일부 엔진은 [프록시](client-proxy.md#supported_engines)를 지원하지 않습니다.
- [로깅](client-logging.md) 플러그인은 플랫폼별로 다른 로거 유형을 제공합니다.
- [HttpTimeout](client-timeout.md#limitations) 플러그인은 특정 엔진에 대한 몇 가지 제한 사항이 있습니다.

## 엔진 종속성 추가 {id="dependencies"}

[ktor-client-core](client-dependencies.md) 아티팩트 외에도 Ktor 클라이언트는 각 엔진에 대한 특정 종속성을 추가해야 합니다. 지원되는 각 플랫폼에 대해 해당 섹션에서 사용 가능한 엔진과 필요한 종속성을 확인할 수 있습니다.
* [JVM](#jvm)
* [JVM 및 Android](#jvm-android)
* [JavaScript](#js)
* [Native](#native)

> Ktor는 다른 엔진에 대해 `-jvm` 또는 `-js`와 같은 접미사가 붙은 플랫폼별 아티팩트를 제공합니다(예: `ktor-client-cio-jvm`). Gradle은 주어진 플랫폼에 적합한 아티팩트를 해결하지만 Maven은 이 기능을 지원하지 않습니다. 즉, Maven의 경우 플랫폼별 접미사를 수동으로 추가해야 합니다.
> {type="note"}

## 지정된 엔진으로 클라이언트 생성 {id="create"}
특정 엔진으로 HTTP 클라이언트를 생성하려면 엔진 클래스를 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 생성자에 인수로 전달합니다. 예를 들어, `CIO` 엔진으로 클라이언트를 다음과 같이 생성할 수 있습니다.
[object Promise]

### 기본 엔진 {id="default"}
인수 없이 `HttpClient` 생성자를 호출하면 클라이언트는 [빌드 스크립트에 추가된](#dependencies) 아티팩트에 따라 엔진을 자동으로 선택합니다.
[object Promise]

이는 멀티플랫폼 프로젝트에 유용할 수 있습니다. 예를 들어, [Android 및 iOS](client-create-multiplatform-application.md)를 모두 대상으로 하는 프로젝트의 경우, `androidMain` 소스 세트에 [Android](#jvm-android) 종속성을 추가하고 `iosMain` 소스 세트에 [Darwin](#darwin) 종속성을 추가할 수 있습니다. 필요한 종속성은 컴파일 시 선택됩니다.

## 엔진 구성 {id="configure"}
`engine` 메서드를 사용하여 엔진을 구성할 수 있습니다. 모든 엔진은 [HttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html)에서 노출하는 몇 가지 공통 속성을 공유합니다. 예를 들어:

[object Promise]

특정 엔진을 구성하는 방법은 아래 해당 섹션을 참조하십시오.

## JVM {id="jvm"}
이 섹션에서는 JVM에서 사용 가능한 엔진에 대해 살펴보겠습니다.

### Apache {id="apache"}
`Apache` 엔진은 HTTP/1.1을 지원하며 여러 구성 옵션을 제공합니다. HTTP/2 지원이 필요한 경우 기본적으로 HTTP/2가 활성화된 `Apache5` 엔진을 사용할 수도 있습니다.

1. `ktor-client-apache5` 또는 `ktor-client-apache` 종속성을 추가합니다.

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

2. `Apache5`/`Apache` 클래스를 `HttpClient` 생성자에 인수로 전달합니다.

   <tabs group="apache_version">
   <tab title="Apache5" group-key="5">

   [object Promise]

   </tab>
   <tab title="Apache" group-key="4">

   [object Promise]

   </tab>
   </tabs>

3. 엔진을 구성하려면 `Apache5EngineConfig`/`ApacheEngineConfig`에 의해 노출되는 설정을 `engine` 메서드에 전달합니다.

   <tabs group="apache_version">
   <tab title="Apache5" group-key="5">

   [object Promise]

   </tab>
   <tab title="Apache" group-key="4">

   [object Promise]

   </tab>
   </tabs>

### Java {id="java"}
`Java` 엔진은 Java 11에 도입된 [Java HTTP 클라이언트](https://openjdk.java.net/groups/net/httpclient/intro.html)를 사용합니다. 사용 방법은 다음과 같습니다.
1. `ktor-client-java` 종속성을 추가합니다.

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

2. [Java](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java/index.html) 클래스를 `HttpClient` 생성자에 인수로 전달합니다.
   [object Promise]
3. 엔진을 구성하려면 [JavaHttpConfig](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html)에 의해 노출되는 설정을 `engine` 메서드에 전달합니다.
   [object Promise]

### Jetty {id="jetty"}
`Jetty` 엔진은 HTTP/2만 지원하며 다음 방법으로 구성할 수 있습니다.
1. `ktor-client-jetty-jakarta` 종속성을 추가합니다.

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

2. [Jetty](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html) 클래스를 `HttpClient` 생성자에 인수로 전달합니다.
   [object Promise]
3. 엔진을 구성하려면 [JettyEngineConfig](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-Jetty-engine-config/index.html)에 의해 노출되는 설정을 `engine` 메서드에 전달합니다.
   [object Promise]

## JVM 및 Android {id="jvm-android"}

이 섹션에서는 JVM/Android에서 사용 가능한 엔진과 그 구성에 대해 살펴보겠습니다.

### Android {id="android"}
`Android` 엔진은 Android를 대상으로 하며 다음 방법으로 구성할 수 있습니다.
1. `ktor-client-android` 종속성을 추가합니다.

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

2. [Android](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android/index.html) 클래스를 `HttpClient` 생성자에 인수로 전달합니다.
   [object Promise]
3. 엔진을 구성하려면 [AndroidEngineConfig](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html)에 의해 노출되는 설정을 `engine` 메서드에 전달합니다.
   [object Promise]

### OkHttp {id="okhttp"}
`OkHttp` 엔진은 OkHttp를 기반으로 하며 다음 방법으로 구성할 수 있습니다.
1. `ktor-client-okhttp` 종속성을 추가합니다.

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

2. [OkHttp](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html) 클래스를 `HttpClient` 생성자에 인수로 전달합니다.
   [object Promise]
3. 엔진을 구성하려면 [OkHttpConfig](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html)에 의해 노출되는 설정을 `engine` 메서드에 전달합니다.
   [object Promise]

## Native {id="native"}
이 섹션에서는 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)를 대상으로 하는 엔진을 구성하는 방법을 살펴보겠습니다.

> Kotlin/Native 프로젝트에서 Ktor를 사용하려면 [새 메모리 관리자](https://kotlinlang.org/docs/native-memory-manager.html)가 필요하며, 이는 Kotlin 1.7.20부터 기본적으로 활성화되어 있습니다.
> {id="newmm-note"}

### Darwin {id="darwin"}
`Darwin` 엔진은 [Darwin 기반](https://en.wikipedia.org/wiki/Darwin_(operating_system)) 운영 체제(macOS, iOS, tvOS 등)를 대상으로 하며 내부적으로 [NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession)을 사용합니다. `Darwin` 엔진을 사용하려면 다음 단계를 따르십시오.

1. `ktor-client-darwin` 종속성을 추가합니다.

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

2. `Darwin` 클래스를 `HttpClient` 생성자에 인수로 전달합니다.
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.darwin.*

   val client = HttpClient(Darwin)
   ```
3. 엔진을 구성하려면 [DarwinClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html)에 의해 노출되는 설정을 `engine` 함수에 전달합니다.
   예를 들어, `configureRequest` 함수를 사용하여 `NSMutableURLRequest`에 액세스하거나 `configureSession`을 사용하여 세션 구성을 사용자 지정할 수 있습니다. 다음 코드 스니펫은 `configureRequest`를 사용하는 방법을 보여줍니다.
   [object Promise]

   전체 예제는 [client-engine-darwin](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-darwin)에서 찾을 수 있습니다.

### WinHttp {id="winhttp"}
`WinHttp` 엔진은 Windows 기반 운영 체제를 대상으로 합니다. `WinHttp` 엔진을 사용하려면 다음 단계를 따르십시오.

1. `ktor-client-winhttp` 종속성을 추가합니다.

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

2. `WinHttp` 클래스를 `HttpClient` 생성자에 인수로 전달합니다.
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.winhttp.*

   val client = HttpClient(WinHttp)
   ```
3. 엔진을 구성하려면 [WinHttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html)에 의해 노출되는 설정을 `engine` 함수에 전달합니다.
   예를 들어, `protocolVersion` 속성을 사용하여 HTTP 버전을 변경할 수 있습니다.
   [object Promise]

   전체 예제는 [client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)에서 찾을 수 있습니다.

### Curl {id="curl"}

데스크톱 플랫폼의 경우 Ktor는 `Curl` 엔진도 제공합니다. 이 엔진은 `linuxX64`, `macosX64`, `macosArm64`, `mingwX64` 플랫폼에서 지원됩니다. `Curl` 엔진을 사용하려면 다음 단계를 따르십시오.

1. [libcurl 라이브러리](https://curl.se/libcurl/)를 설치합니다.
   > Linux에서는 libcurl의 `gnutls` 버전을 설치해야 합니다.
   > Ubuntu에서 이 버전을 설치하려면 다음을 실행할 수 있습니다.
   ```bash
   sudo apt-get install libcurl4-gnutls-dev
   ```

   > Windows에서는 [MinGW/MSYS2](FAQ.topic#native-curl) `curl` 바이너리를 고려해 볼 수 있습니다.
2. `ktor-client-curl` 종속성을 추가합니다.

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

3. `Curl` 클래스를 `HttpClient` 생성자에 인수로 전달합니다.
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.curl.*

   val client = HttpClient(Curl)
   ```

4. 엔진을 구성하려면 `CurlClientEngineConfig`에 의해 노출되는 설정을 `engine` 메서드에 전달합니다.
   다음 코드 스니펫은 테스트 목적으로 SSL 확인을 비활성화하는 방법을 보여줍니다.
   [object Promise]

   전체 예제는 [client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)에서 찾을 수 있습니다.

## JVM, Android, 및 Native {id="jvm-android-native"}

### CIO {id="cio"}
CIO는 JVM, Android, Native 플랫폼에서 사용할 수 있는 완전 비동기 코루틴 기반 엔진입니다. 현재 HTTP/1.x만 지원합니다. 사용 방법은 다음과 같습니다.
1. `ktor-client-cio` 종속성을 추가합니다.

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

2. [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html) 클래스를 `HttpClient` 생성자에 인수로 전달합니다.
   [object Promise]

3. 엔진을 구성하려면 [CIOEngineConfig](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html)에 의해 노출되는 설정을 `engine` 메서드에 전달합니다.
   [object Promise]

## JavaScript {id="js"}

`Js` 엔진은 [JavaScript 프로젝트](https://kotlinlang.org/docs/js-overview.html)에 사용할 수 있습니다. 이 엔진은 브라우저 애플리케이션의 경우 [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)를, Node.js의 경우 `node-fetch`를 사용합니다. 사용 방법은 다음과 같습니다.

1. `ktor-client-js` 종속성을 추가합니다.

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

2. `Js` 클래스를 `HttpClient` 생성자에 인수로 전달합니다.
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.js.*

   val client = HttpClient(Js)
   ```

   `JsClient` 함수를 호출하여 `Js` 엔진 싱글톤을 가져올 수도 있습니다.
   ```kotlin
   import io.ktor.client.engine.js.*

   val client = JsClient()
   ```

전체 예제는 [client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)에서 찾을 수 있습니다.

## 예시: 멀티플랫폼 모바일 프로젝트에서 엔진을 구성하는 방법 {id="mpp-config"}

멀티플랫폼 모바일 프로젝트에서 엔진별 옵션을 구성하려면 [expect/actual 선언](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html)을 사용할 수 있습니다.
[](client-create-multiplatform-application.md) 튜토리얼에서 생성된 프로젝트를 사용하여 이를 달성하는 방법을 보여드리겠습니다.

1. `shared/src/commonMain/kotlin/com/example/kmmktor/Platform.kt` 파일을 열고 클라이언트 구성을 받아 `HttpClient`를 반환하는 최상위 `httpClient` 함수를 추가합니다.
   ```kotlin
   expect fun httpClient(config: HttpClientConfig<*>.() -> Unit = {}): HttpClient
   ```

2. `shared/src/androidMain/kotlin/com/example/kmmktor/Platform.kt`를 열고 Android 모듈용 `httpClient` 함수의 실제 선언을 추가합니다.
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
   이 예시는 [OkHttp](#okhttp) 엔진을 구성하는 방법을 보여주지만, [Android에서 지원되는](#jvm-android) 다른 엔진도 사용할 수 있습니다.

3. `shared/src/iosMain/kotlin/com/example/kmmktor/Platform.kt`를 열고 iOS 모듈용 `httpClient` 함수의 실제 선언을 추가합니다.
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

4. 마지막으로 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt`를 열고 `HttpClient()` 생성자를 `httpClient` 함수 호출로 바꿉니다.
   ```kotlin
   private val client = httpClient()