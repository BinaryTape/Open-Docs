[//]: # (title: JTE)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Jte"/>
<var name="package_name" value="io.ktor.server.jte"/>
<var name="artifact_name" value="ktor-server-jte"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="jte"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✖️
    </p>
    
</tldr>

Ktor는 [%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-jte/io.ktor.server.jte/-jte.html) 플러그인을 설치하여 애플리케이션 내에서 [JTE 템플릿](https://github.com/casid/jte)을 뷰로 사용할 수 있도록 합니다.

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
    

> `.kte` 파일을 처리하려면 프로젝트에 `gg.jte:jte-kotlin` 아티팩트를 추가해야 합니다.

## %plugin_name% 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="모듈은 라우트를 그룹화하여 애플리케이션을 구조화할 수 있도록 합니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내.
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
    

`install` 블록 내에서 JTE 템플릿을 로드하는 방법을 [구성](#configure)할 수 있습니다.

## %plugin_name% 구성 {id="configure"}
### 템플릿 로드 구성 {id="template_loading"}
JTE 템플릿을 로드하려면 다음이 필요합니다:
1.  템플릿 코드를 해석하는 데 사용되는 `CodeResolver`를 생성합니다. 예를 들어, 주어진 디렉토리에서 템플릿을 로드하도록 `DirectoryCodeResolver`를 구성하거나, 애플리케이션 리소스에서 템플릿을 로드하도록 `ResourceCodeResolver`를 구성할 수 있습니다.
2.  `templateEngine` 속성을 사용하여 템플릿 엔진을 지정합니다. 이 템플릿 엔진은 생성된 `CodeResolver`를 사용하여 템플릿을 네이티브 Java/Kotlin 코드로 변환합니다.

예를 들어, 아래 코드 스니펫은 Ktor가 `templates` 디렉토리에서 JTE 템플릿을 찾아보도록 합니다:

[object Promise]

### 응답으로 템플릿 전송 {id="use_template"}
`templates` 디렉토리에 `index.kte` 템플릿이 있다고 가정해 봅시다:
[object Promise]

지정된 [경로](server-routing.md)에 템플릿을 사용하려면, 다음과 같이 `JteContent`를 `call.respond` 메서드에 전달하세요:
[object Promise]