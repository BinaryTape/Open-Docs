[//]: # (title: Webjars)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Webjars"/>
<var name="package_name" value="io.ktor.server.webjars"/>
<var name="artifact_name" value="ktor-server-webjars"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="webjars"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✖️
    </p>
    
</tldr>

<link-summary>
%plugin_name% 플러그인은 WebJars가 제공하는 클라이언트 측 라이브러리 제공을 가능하게 합니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-webjars/io.ktor.server.webjars/-webjars.html) 플러그인은 [WebJars](https://www.webjars.org/)에서 제공하는 클라이언트 측 라이브러리 제공을 가능하게 합니다. 이 플러그인을 사용하면 JavaScript 및 CSS 라이브러리와 같은 애셋을 [fat JAR](server-fatjar.md)의 일부로 패키징할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`%plugin_name%`을(를) 활성화하려면 빌드 스크립트에 다음 아티팩트를 포함해야 합니다:
* `%artifact_name%` 의존성을 추가합니다:

  
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
    

* 필요한 클라이언트 측 라이브러리에 대한 의존성을 추가합니다. 다음 예시는 Bootstrap 아티팩트를 추가하는 방법을 보여줍니다:

  <var name="group_id" value="org.webjars"/>
  <var name="artifact_name" value="bootstrap"/>
  <var name="version" value="bootstrap_version"/>
  
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
    
  
  `$bootstrap_version`을 `bootstrap` 아티팩트의 필수 버전으로 대체할 수 있습니다. 예를 들어, `%bootstrap_version%`와 같이 사용합니다.

## %plugin_name% 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구성할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하십시오.
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
    

## %plugin_name% 구성 {id="configure"}

기본적으로 `%plugin_name%`은(는) `/webjars` 경로에서 WebJars 애셋을 제공합니다. 다음 예시는 이를 변경하여 `/assets` 경로에서 모든 WebJars 애셋을 제공하는 방법을 보여줍니다:

[object Promise]

예를 들어, `org.webjars:bootstrap` 의존성을 설치했다면, 다음과 같이 `bootstrap.css`를 추가할 수 있습니다:

[object Promise]

`%plugin_name%`을(를) 사용하면 의존성 버전을 변경하더라도 로드하는 데 사용되는 경로를 변경할 필요가 없다는 점에 유의하십시오.

> 전체 예시는 여기에서 찾을 수 있습니다: [webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars).