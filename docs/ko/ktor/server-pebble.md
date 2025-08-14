[//]: # (title: Pebble)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[pebble_engine_builder]: https://pebbletemplates.io/com/mitchellbosecke/pebble/PebbleEngine/Builder/

<var name="plugin_name" value="Pebble"/>
<var name="package_name" value="io.ktor.server.pebble"/>
<var name="artifact_name" value="ktor-server-pebble"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="pebble"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임 또는 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✖️
    </p>
    
</tldr>

Ktor는 [Pebble](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-pebble/io.ktor.server.pebble/-pebble) 플러그인을 설치하여 애플리케이션 내에서 [Pebble 템플릿](https://pebbletemplates.io/)을 뷰로 사용할 수 있게 합니다.

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
    

## Pebble 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>에서 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다.
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내에서.
        </li>
        <li>
            ... 명시적으로 정의된 <code>module</code> 내에서 (이는 <code>Application</code> 클래스의 확장 함수입니다).
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
    

`install` 블록 내부에서 Pebble 템플릿 로드를 위해 [PebbleEngine.Builder][pebble_engine_builder]를 [구성](#configure)할 수 있습니다.

## Pebble 구성 {id="configure"}
### 템플릿 로드 구성 {id="template_loading"}
템플릿을 로드하려면 [PebbleEngine.Builder][pebble_engine_builder]를 사용하여 템플릿 로드 방법을 구성해야 합니다. 예를 들어, 아래 코드 스니펫은 Ktor가 현재 클래스패스를 기준으로 `templates` 패키지에서 템플릿을 찾을 수 있도록 합니다.

[object Promise]

### 응답으로 템플릿 전송 {id="use_template"}
`resources/templates`에 `index.html` 템플릿이 있다고 가정해 봅시다.

[object Promise]

사용자 데이터 모델은 다음과 같습니다.

[object Promise]

지정된 [라우트](server-routing.md)에 템플릿을 사용하려면, 다음 방식으로 `PebbleContent`를 `call.respond` 메서드에 전달하세요.

[object Promise]