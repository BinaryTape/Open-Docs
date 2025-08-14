[//]: # (title: 조건부 헤더)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-conditional-headers"/>
<var name="package_name" value="io.ktor.server.plugins.conditionalheaders"/>
<var name="plugin_name" value="ConditionalHeaders"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="conditional-headers"/>

    <p>
        <b>코드 예제</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

[ConditionalHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers.html) 플러그인은 마지막 요청 이후 콘텐츠 본문이 변경되지 않은 경우 이를 전송하지 않도록 합니다. 이는 다음 헤더를 사용하여 달성됩니다:
* `Last-Modified` 응답 헤더에는 리소스 수정 시간이 포함됩니다. 예를 들어, 클라이언트 요청에 `If-Modified-Since` 값이 포함되어 있으면 Ktor는 주어진 날짜 이후에 리소스가 수정된 경우에만 전체 응답을 보냅니다. [정적 파일](server-static-content.md)의 경우 Ktor는 `ConditionalHeaders`를 [설치](#install_plugin)한 후 `Last-Modified` 헤더를 자동으로 추가합니다.
* `Etag` 응답 헤더는 특정 리소스 버전에 대한 식별자입니다. 예를 들어, 클라이언트 요청에 `If-None-Match` 값이 포함되어 있고 이 값이 `Etag`와 일치하는 경우 Ktor는 전체 응답을 보내지 않습니다. `ConditionalHeaders`를 [구성](#configure)할 때 `Etag` 값을 지정할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>를 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
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
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요. 아래 코드 스니펫은 <code>%plugin_name%</code>를 설치하는 방법을 보여줍니다...
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
        <code>%plugin_name%</code> 플러그인은 <a href="#install-route">특정 라우트에 설치</a>될 수도 있습니다. 이는 애플리케이션의 여러 리소스에 대해 다른 <code>%plugin_name%</code> 구성이 필요한 경우 유용할 수 있습니다.
    </p>
    

## 헤더 구성 {id="configure"}

`%plugin_name%`를 구성하려면 `install` 블록 내에서 [version](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers-config/version.html) 함수를 호출해야 합니다. 이 함수는 주어진 `ApplicationCall`과 `OutgoingContent`에 대한 리소스 버전 목록에 접근을 제공합니다. [EntityTagVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-entity-tag-version/index.html) 및 [LastModifiedVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-last-modified-version/index.html) 클래스 객체를 사용하여 필요한 버전을 지정할 수 있습니다.

아래 코드 스니펫은 CSS에 `Etag` 및 `Last-Modified` 헤더를 추가하는 방법을 보여줍니다:
[object Promise]

전체 예제는 다음에서 찾을 수 있습니다: [conditional-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/conditional-headers).