[//]: # (title: Velocity)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[velocity_engine]: https://velocity.apache.org/engine/devel/apidocs/org/apache/velocity/app/VelocityEngine.html

<var name="plugin_name" value="Velocity"/>
<var name="package_name" value="io.ktor.server.velocity"/>
<var name="artifact_name" value="ktor-server-velocity"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="velocity"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있도록 합니다.">네이티브 서버</Links> 지원</b>: ✖️
    </p>
    
</tldr>

Ktor를 사용하면 [Velocity](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-velocity/io.ktor.server.velocity/-velocity) 플러그인을 설치하여 애플리케이션 내에서 [Velocity 템플릿](https://velocity.apache.org/engine/)을 뷰로 사용할 수 있습니다.

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
    

## Velocity 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하십시오.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
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
    

선택적으로, 표준 및 사용자 정의 [Velocity 도구](#velocity_tools)를 추가할 수 있는 기능을 갖도록 `VelocityTools` 플러그인을 설치할 수 있습니다.

## Velocity 구성 {id="configure"}
### 템플릿 로드 구성 {id="template_loading"}
`install` 블록 내에서 [VelocityEngine][velocity_engine]을 구성할 수 있습니다. 예를 들어, 클래스패스에서 템플릿을 사용하려면 `classpath`에 대한 리소스 로더를 사용하십시오:
[object Promise]

### 응답으로 템플릿 전송 {id="use_template"}
<code>resources/templates</code>에 <code>index.vl</code> 템플릿이 있다고 가정해 보십시오:
[object Promise]

사용자 데이터 모델은 다음과 같습니다:
[object Promise]

지정된 [경로](server-routing.md)에 템플릿을 사용하려면 <code>call.respond</code> 메서드에 <code>VelocityContent</code>를 다음과 같이 전달하십시오:
[object Promise]

### Velocity 도구 추가 {id="velocity_tools"}

<code>VelocityTools</code> 플러그인을 [설치](#install_plugin)했다면, <code>install</code> 블록 내에서 <code>EasyFactoryConfiguration</code> 인스턴스에 접근하여 표준 및 사용자 정의 Velocity 도구를 추가할 수 있습니다. 예를 들어:

```kotlin
install(VelocityTools) {
    engine {
        // 엔진 구성
        setProperty("resource.loader", "string")
        addProperty("resource.loader.string.name", "myRepo")
        addProperty("resource.loader.string.class", StringResourceLoader::class.java.name)
        addProperty("resource.loader.string.repository.name", "myRepo")
    }
    addDefaultTools() // 기본 도구 추가
    tool("foo", MyCustomTool::class.java) // 사용자 정의 도구 추가
}