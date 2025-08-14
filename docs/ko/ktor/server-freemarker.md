[//]: # (title: FreeMarker)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[freemarker_template_loading]: https://freemarker.apache.org/docs/pgui_config_templateloading.html

<var name="plugin_name" value="FreeMarker"/>
<var name="package_name" value="io.ktor.server.freemarker"/>
<var name="artifact_name" value="ktor-server-freemarker"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="freemarker"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">네이티브 서버</Links> 지원</b>: ✖️
    </p>
    
</tldr>

Ktor는 [FreeMarker 템플릿](https://freemarker.apache.org/)을 애플리케이션 내에서 뷰(view)로 사용할 수 있도록 [FreeMarker](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/-free-marker) 플러그인을 설치할 수 있게 합니다.

## 의존성 추가 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
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
    

## FreeMarker 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">모듈</Links>의 <code>install</code> 함수에 전달하면 됩니다. 아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내부에서.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내부에서.
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
    

`install` 블록 내부에서 FreeMarker 템플릿 로드를 위한 원하는 [TemplateLoader][freemarker_template_loading]를 [설정](#configure)할 수 있습니다.

## FreeMarker 설정 {id="configure"}
### 템플릿 로드 설정 {id="template_loading"}
템플릿을 로드하려면 원하는 [TemplateLoader][freemarker_template_loading] 타입을 `templateLoader` 속성에 할당해야 합니다. 예를 들어, 아래 코드 스니펫은 Ktor가 현재 클래스패스를 기준으로 `templates` 패키지에서 템플릿을 찾을 수 있도록 합니다.
[object Promise]

### 응답으로 템플릿 전송 {id="use_template"}
`resources/templates`에 `index.ftl` 템플릿이 있다고 가정해 보세요.
[object Promise]

사용자 데이터 모델은 다음과 같습니다:
[object Promise]

지정된 [경로](server-routing.md)에 템플릿을 사용하려면, `FreeMarkerContent`를 `call.respond` 메서드에 다음과 같은 방식으로 전달합니다:
[object Promise]