[//]: # (title: 기본 헤더)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-default-headers"/>
<var name="package_name" value="io.ktor.server.plugins.defaultheaders"/>
<var name="plugin_name" value="DefaultHeaders"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-default-headers/io.ktor.server.plugins.defaultheaders/-default-headers.html"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임 또는 가상 머신 없이 서버를 실행할 수 있게 해줍니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

[%plugin_name%](%plugin_api_link%) 플러그인은 각 응답에 표준 `Server` 및 `Date` 헤더를 추가합니다. 또한, 추가 기본 헤더를 제공하고 `Server` 헤더를 재정의할 수 있습니다.

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
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구성할 수 있습니다.">모듈</Links> 내 <code>install</code> 함수에 이 플러그인을 전달합니다.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
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
    

    <p>
        <code>%plugin_name%</code> 플러그인은 <a href="#install-route">특정 라우트에 설치</a>할 수도 있습니다.
        이는 서로 다른 애플리케이션 리소스에 대해 다른 <code>%plugin_name%</code> 구성이 필요한 경우 유용할 수 있습니다.
    </p>
    

## %plugin_name% 구성하기 {id="configure"}
### 추가 헤더 추가 {id="add"}
기본 헤더 목록을 사용자 지정하려면, `header(name, value)` 함수를 사용하여 원하는 헤더를 `install`에 전달합니다. `name` 매개변수는 `HttpHeaders` 값을 받습니다. 예를 들면 다음과 같습니다.
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.ETag, "7c876b7e")
    }
```
사용자 지정 헤더를 추가하려면, 해당 이름을 문자열 값으로 전달합니다.
```kotlin
    install(DefaultHeaders) {
        header("Custom-Header", "Some value")
    }
```

### 헤더 재정의 {id="override"}
`Server` 헤더를 재정의하려면, 해당 `HttpHeaders` 값을 사용합니다.
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.Server, "Custom")
    }
```
`Date` 헤더는 성능상의 이유로 캐시되며, `%plugin_name%`을(를) 사용하여 재정의할 수 없다는 점에 유의하십시오.