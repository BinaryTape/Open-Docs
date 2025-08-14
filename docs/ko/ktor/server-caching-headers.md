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

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

[CachingHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers.html) 플러그인은 HTTP 캐싱에 사용되는 `Cache-Control` 및 `Expires` 헤더를 구성하는 기능을 추가합니다. 다음 방법으로 [캐싱을 구성](#configure)할 수 있습니다.
- 이미지, CSS, JavaScript 파일 등과 같은 특정 콘텐츠 유형에 대해 다른 캐싱 전략을 구성합니다.
- 애플리케이션 수준, 라우트 수준 또는 특정 호출에 대해 전역적으로 캐싱 옵션을 지정합니다.

## 의존성 추가 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다.
    </p>
    

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
    

## %plugin_name% 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다.
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내부.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내부.
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        <code>%plugin_name%</code> 플러그인은 <a href="#install-route">특정 라우트에도 설치</a>할 수 있습니다.
        이는 애플리케이션의 다양한 리소스에 대해 다른 <code>%plugin_name%</code> 구성이 필요할 때 유용할 수 있습니다.
    </p>
    

`%plugin_name%`을(를) 설치한 후 다양한 콘텐츠 유형에 대한 캐싱 설정을 [구성](#configure)할 수 있습니다.

## 캐싱 구성 {id="configure"}
`%plugin_name%` 플러그인을 구성하려면 주어진 `ApplicationCall` 및 콘텐츠 유형에 대해 지정된 캐싱 옵션을 제공하기 위한 [options](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers-config/options.html) 함수를 정의해야 합니다. [caching-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers) 예시의 코드 스니펫은 일반 텍스트 및 HTML에 대해 `max-age` 옵션과 함께 `Cache-Control` 헤더를 추가하는 방법을 보여줍니다.

[object Promise]

[CachingOptions](https://api.ktor.io/ktor-http/io.ktor.http.content/-caching-options/index.html) 객체는 `Cache-Control` 및 `Expires` 헤더 값을 파라미터로 받습니다.

*   `cacheControl` 파라미터는 [CacheControl](https://api.ktor.io/ktor-http/io.ktor.http/-cache-control/index.html) 값을 받습니다. `CacheControl.MaxAge`를 사용하여 `max-age` 파라미터 및 가시성, 재확인(revalidation) 옵션 등 관련 설정을 지정할 수 있습니다. `CacheControl.NoCache`/`CacheControl.NoStore`를 사용하여 캐싱을 비활성화할 수 있습니다.
*   `expires` 파라미터를 사용하면 `Expires` 헤더를 `GMTDate` 또는 `ZonedDateTime` 값으로 지정할 수 있습니다.

### 라우트 수준 {id="configure-route"}

플러그인은 전역적으로 뿐만 아니라 [특정 라우트](server-plugins.md#install-route)에도 설치할 수 있습니다. 예를 들어, 아래 예시는 `/index` 라우트에 지정된 캐싱 헤더를 추가하는 방법을 보여줍니다.

[object Promise]

### 호출 수준 {id="configure-call"}

더 세분화된 캐싱 설정이 필요한 경우 `ApplicationCall.caching` 프로퍼티를 사용하여 호출 수준에서 캐싱 옵션을 구성할 수 있습니다. 아래 예시는 사용자가 로그인했는지 여부에 따라 캐싱 옵션을 구성하는 방법을 보여줍니다.

[object Promise]

> 로그인한 사용자의 경우 [Authentication](server-auth.md) 및 [Sessions](server-sessions.md) 플러그인을 사용할 수 있습니다.