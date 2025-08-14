[//]: # (title: Mustache)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[mustache_factory]: http://spullara.github.io/mustache/apidocs/com/github/mustachejava/MustacheFactory.html

<var name="plugin_name" value="Mustache"/>
<var name="package_name" value="io.ktor.server.mustache"/>
<var name="artifact_name" value="ktor-server-mustache"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="mustache"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임 또는 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✖️
    </p>
    
</tldr>

Ktor는 [Mustache 템플릿](https://github.com/spullara/mustache.java)을 애플리케이션 내 뷰로 활용할 수 있도록 하며, 이를 위해 [Mustache](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-mustache/io.ktor.server.mustache/-mustache) 플러그인을 설치합니다.

## 종속성 추가 {id="add_dependencies"}

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
    

## Mustache 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하면 됩니다.
        다음 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
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
    

`install` 블록 내에서 Mustache 템플릿 로드를 위해 [MustacheFactory][mustache_factory]를 [구성](#template_loading)할 수 있습니다.

## Mustache 구성 {id="configure"}
### 템플릿 로딩 구성 {id="template_loading"}
템플릿을 로드하려면 [MustacheFactory][mustache_factory]를 `mustacheFactory` 속성에 할당해야 합니다. 예를 들어, 아래 코드 스니펫은 Ktor가 현재 클래스패스 기준으로 `templates` 패키지에서 템플릿을 찾을 수 있도록 합니다:
[object Promise]

### 응답으로 템플릿 전송 {id="use_template"}
`resources/templates`에 `index.hbs` 템플릿이 있다고 가정해 봅시다:
[object Promise]

사용자 데이터 모델은 다음과 같습니다:
[object Promise]

지정된 [경로](server-routing.md)에 템플릿을 사용하려면 `MustacheContent`를 다음과 같이 `call.respond` 메서드에 전달합니다:
[object Promise]