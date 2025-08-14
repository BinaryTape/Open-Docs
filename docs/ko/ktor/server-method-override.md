[//]: # (title: XHttpMethodOverride)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="XHttpMethodOverride"/>
<var name="package_name" value="io.ktor.server.plugins.methodoverride"/>
<var name="artifact_name" value="ktor-server-method-override"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-method-override"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name%는 `X-HTTP-Method-Override` 헤더 내에서 HTTP 동사를 터널링하는 기능을 활성화합니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-method-override/io.ktor.server.plugins.methodoverride/-x-http-method-override.html) 플러그인은 `X-HTTP-Method-Override` 헤더 내에서 HTTP 동사를 터널링하는 기능을 활성화합니다.
이는 서버 API가 여러 HTTP 동사(`GET`, `PUT`, `POST`, `DELETE` 등)를 처리하지만, 특정 제약 사항으로 인해 클라이언트가 제한된 동사(`GET`, `POST` 등)만 사용할 수 있는 경우 유용할 수 있습니다.
예를 들어, 클라이언트가 `X-Http-Method-Override` 헤더를 `DELETE`로 설정하여 요청을 보내면, Ktor는 이 요청을 `delete` [경로 핸들러](server-routing.md#define_route)를 사용하여 처리합니다.

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
        <code>%plugin_name%</code> 플러그인을 애플리케이션에 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다.
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내에서.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
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
    

## %plugin_name% 구성 {id="configure"}

기본적으로 `%plugin_name%`은(는) 요청을 처리해야 하는 경로를 결정하기 위해 `X-Http-Method-Override` 헤더를 확인합니다.
`headerName` 속성을 사용하여 헤더 이름을 사용자 정의할 수 있습니다.

## 예시 {id="example"}

아래 HTTP 요청은 `POST` 동사를 사용하고 `X-Http-Method-Override` 헤더를 `DELETE`로 설정합니다.

[object Promise]

이러한 요청을 `delete` [경로 핸들러](server-routing.md#define_route)로 처리하려면 `%plugin_name%`을(를) 설치해야 합니다.

[object Promise]

전체 예시는 다음에서 확인할 수 있습니다: [json-kotlinx-method-override](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx-method-override).