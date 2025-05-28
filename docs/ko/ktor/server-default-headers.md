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
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](%plugin_api_link%) 플러그인은 각 응답에 표준 `Server` 및 `Date` 헤더를 추가합니다. 또한, 추가적인 기본 헤더를 제공하고 `Server` 헤더를 재정의할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## %plugin_name% 구성 {id="configure"}
### 추가 헤더 추가 {id="add"}
기본 헤더 목록을 사용자 지정하려면 `header(name, value)` 함수를 사용하여 `install`에 원하는 헤더를 전달하세요. `name` 매개변수는 `HttpHeaders` 값을 받습니다. 예를 들어:
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.ETag, "7c876b7e")
    }
```
사용자 지정 헤더를 추가하려면 이름을 문자열 값으로 전달하세요:
```kotlin
    install(DefaultHeaders) {
        header("Custom-Header", "Some value")
    }
```

### 헤더 재정의 {id="override"}
`Server` 헤더를 재정의하려면 해당 `HttpHeaders` 값을 사용하세요:
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.Server, "Custom")
    }
```
참고로, `Date` 헤더는 성능상의 이유로 캐시되며 `%plugin_name%`을 사용하여 재정의할 수 없습니다.