[//]: # (title: 캐싱 헤더)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CachingHeaders"/>
<var name="package_name" value="io.ktor.server.plugins.cachingheaders"/>
<var name="artifact_name" value="ktor-server-caching-headers"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="caching-headers"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[CachingHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers.html) 플러그인은 HTTP 캐싱에 사용되는 `Cache-Control` 및 `Expires` 헤더를 구성하는 기능을 추가합니다. 다음 방법으로 [캐싱을 구성](#configure)할 수 있습니다.
- 이미지, CSS 및 JavaScript 파일 등과 같은 특정 콘텐츠 유형에 대해 다양한 캐싱 전략을 구성합니다.
- 다양한 수준에서 캐싱 옵션을 지정합니다: 애플리케이션 수준에서 전역적으로, 경로(route) 수준에서, 또는 특정 호출에 대해.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

`%plugin_name%`을(를) 설치한 후, 다양한 콘텐츠 유형에 대한 캐싱 설정을 [구성](#configure)할 수 있습니다.

## 캐싱 구성 {id="configure"}
`%plugin_name%` 플러그인을 구성하려면, 주어진 `ApplicationCall` 및 콘텐츠 유형에 대해 지정된 캐싱 옵션을 제공하기 위해 [options](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers-config/options.html) 함수를 정의해야 합니다. [caching-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers) 예제의 코드 스니펫은 일반 텍스트 및 HTML에 대해 `max-age` 옵션과 함께 `Cache-Control` 헤더를 추가하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="14-24,52-53"}

[CachingOptions](https://api.ktor.io/ktor-http/io.ktor.http.content/-caching-options/index.html) 객체는 `Cache-Control` 및 `Expires` 헤더 값을 파라미터로 받습니다.

* `cacheControl` 파라미터는 [CacheControl](https://api.ktor.io/ktor-http/io.ktor.http/-cache-control/index.html) 값을 받습니다. `CacheControl.MaxAge`를 사용하여 `max-age` 파라미터와 가시성, 재검증(revalidation) 옵션 등 관련 설정을 지정할 수 있습니다. `CacheControl.NoCache`/`CacheControl.NoStore`를 사용하여 캐싱을 비활성화할 수 있습니다.
* `expires` 파라미터는 `GMTDate` 또는 `ZonedDateTime` 값으로 `Expires` 헤더를 지정할 수 있도록 합니다.

### 경로(Route) 수준 {id="configure-route"}

플러그인을 전역적으로 설치할 수 있을 뿐만 아니라 [특정 경로](server-plugins.md#install-route)에도 설치할 수 있습니다. 예를 들어, 아래 예시는 `/index` 경로에 지정된 캐싱 헤더를 추가하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="25-32"}

### 호출(Call) 수준 {id="configure-call"}

더욱 세분화된 캐싱 설정이 필요한 경우, `ApplicationCall.caching` 속성을 사용하여 호출 수준에서 캐싱 옵션을 구성할 수 있습니다. 아래 예시는 사용자가 로그인했는지 여부에 따라 캐싱 옵션을 구성하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="40-51"}

> 사용자 로그인 시, [Authentication](server-auth.md) 및 [Sessions](server-sessions.md) 플러그인을 사용할 수 있습니다.