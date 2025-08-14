[//]: # (title: 서버 플러그인)

<show-structure for="chapter" depth="2"/>

<link-summary>
플러그인은 직렬화, 콘텐츠 인코딩, 압축 등과 같은 공통 기능을 제공합니다.
</link-summary>

Ktor의 일반적인 요청/응답 파이프라인은 다음과 같습니다:

![요청 응답 파이프라인](request-response-pipeline.png){width="600"}

요청으로 시작하여 특정 핸들러로 라우팅되고, 애플리케이션 로직에 의해 처리된 다음, 최종적으로 응답됩니다.

## 플러그인으로 기능 추가 {id="add_functionality"}

많은 애플리케이션은 애플리케이션 로직의 범위를 벗어나는 공통 기능을 필요로 합니다. 이는 직렬화 및 콘텐츠 인코딩, 압축, 헤더, 쿠키 지원 등과 같은 것일 수 있습니다. 이 모든 것은 Ktor에서 저희가 **플러그인**이라고 부르는 수단을 통해 제공됩니다.

이전 파이프라인 다이어그램을 보면, 플러그인은 요청/응답과 애플리케이션 로직 사이에 위치합니다:

![플러그인 파이프라인](plugin-pipeline.png){width="600"}

요청이 들어오면:

*   라우팅 메커니즘을 통해 올바른 핸들러로 라우팅됩니다.
*   핸들러에 전달되기 전에 하나 이상의 플러그인을 거칩니다.
*   핸들러(애플리케이션 로직)가 요청을 처리합니다.
*   응답이 클라이언트에 전송되기 전에 하나 이상의 플러그인을 거칩니다.

## 라우팅은 플러그인입니다 {id="routing"}

플러그인은 최대한의 유연성을 제공하고, 요청/응답 파이프라인의 모든 세그먼트에 존재할 수 있도록 설계되었습니다. 사실, 지금까지 우리가 `routing`이라고 불렀던 것은 플러그인에 불과합니다.

![라우팅은 플러그인입니다](plugin-pipeline-routing.png){width="600"}

## 플러그인 의존성 추가 {id="dependency"}
대부분의 플러그인은 특정 의존성을 필요로 합니다. 예를 들어, `CORS` 플러그인은 빌드 스크립트에 `ktor-server-cors` 아티팩트를 추가해야 합니다:

<var name="artifact_name" value="ktor-server-cors"/>

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

## 플러그인 설치 {id="install"}

플러그인은 일반적으로 플러그인을 매개변수로 받는 `install` 함수를 사용하여 서버 초기화 단계에서 구성됩니다. [서버를 생성](server-create-and-configure.topic)한 방식에 따라 `embeddedServer` 호출 내에 플러그인을 설치할 수 있습니다...

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.*
import io.ktor.server.plugins.compression.*
// ...
fun main() {
    embeddedServer(Netty, port = 8080) {
        install(CORS)
        install(Compression)
        // ...
    }.start(wait = true)
}
```

... 또는 지정된 [모듈](server-modules.md)에 설치할 수 있습니다:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.*
import io.ktor.server.plugins.compression.*
// ...
fun Application.module() {
    install(CORS)
    install(Compression)
    // ...
}
```

요청 및 응답을 가로채는 것 외에도, 플러그인은 이 단계에서 구성되는 선택적 구성 섹션을 가질 수 있습니다.

예를 들어, [쿠키](server-sessions.md#cookie)를 설치할 때 쿠키를 저장할 위치나 이름을 포함한 특정 매개변수를 설정할 수 있습니다:

```kotlin
install(Sessions) {
    cookie<MyCookie>("MY_COOKIE")
} 
```

### 특정 경로에 플러그인 설치 {id="install-route"}

Ktor에서는 플러그인을 전역적으로 설치할 수 있을 뿐만 아니라 특정 [경로](server-routing.md)에도 설치할 수 있습니다. 이는 다양한 애플리케이션 리소스에 대해 다른 플러그인 구성이 필요한 경우 유용할 수 있습니다. 예를 들어, 아래 [예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers-routes)는 `/index` 경로에 지정된 [캐싱 헤더](server-caching-headers.md)를 추가하는 방법을 보여줍니다:

[object Promise]

동일한 플러그인의 여러 설치에 다음 규칙이 적용됩니다:
*   특정 경로에 설치된 플러그인의 구성은 해당 [전역 구성](#install)을 재정의합니다.
*   라우팅은 동일한 경로에 대한 설치를 병합하며, 마지막 설치가 우선합니다. 예를 들어, 다음 애플리케이션의 경우...

   ```kotlin
   routing {
       route("index") {
           install(CachingHeaders) { /* First configuration */ }
           get("a") {
               // ...
           }
       }
       route("index") {
           install(CachingHeaders) { /* Second configuration */ }
           get("b") {
               // ...
           }
       }
   }
   ```
   {initial-collapse-state="collapsed" collapsed-title="install(CachingHeaders) { // 첫 번째 구성 }"}

   ... `/index/a` 및 `/index/b`에 대한 두 호출 모두 플러그인의 두 번째 설치에 의해서만 처리됩니다.

## 기본, 사용 가능, 그리고 사용자 지정 플러그인 {id="default_available_custom"}

기본적으로 Ktor는 어떠한 플러그인도 활성화하지 않으므로, 애플리케이션에 필요한 기능을 위한 플러그인을 설치하는 것은 사용자에게 달려 있습니다.

하지만 Ktor는 기본적으로 다양한 플러그인을 제공합니다. [Ktor 플러그인 레지스트리](https://github.com/ktorio/ktor-plugin-registry/tree/main/plugins/server)에서 이들 플러그인의 전체 목록을 확인할 수 있습니다.

또한, 자신만의 [사용자 지정 플러그인](server-custom-plugins.md)을 생성할 수도 있습니다.