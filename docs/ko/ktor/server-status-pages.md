[//]: # (title: 상태 페이지)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="StatusPages"/>
<var name="package_name" value="io.ktor.server.plugins.statuspages"/>
<var name="artifact_name" value="ktor-server-status-pages"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="status-pages"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 플러그인을 사용하면 Ktor 애플리케이션이 발생한 예외 또는 상태 코드에 기반하여 모든 실패 상태에 적절하게 응답할 수 있습니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-status-pages/io.ktor.server.plugins.statuspages/-status-pages.html) 플러그인을 사용하면 Ktor 애플리케이션이 발생한 예외 또는 상태 코드에 기반하여 모든 실패 상태에 적절하게 [응답](server-responses.md)할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name% 구성 {id="configure"}

%plugin_name% 플러그인에서 제공하는 세 가지 주요 구성 옵션은 다음과 같습니다:

- [예외](#exceptions): 매핑된 예외 클래스에 기반하여 응답을 구성합니다.
- [상태](#status): 상태 코드 값에 대한 응답을 구성합니다.
- [상태 파일](#status-file): 클래스패스에서 파일 응답을 구성합니다.

### 예외 {id="exceptions"}

`exception` 핸들러를 사용하면 `Throwable` 예외를 발생시키는 호출을 처리할 수 있습니다. 가장 기본적인 경우, `500` HTTP 상태 코드를 모든 예외에 대해 구성할 수 있습니다:

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
    }
}
```

특정 예외를 확인하고 필요한 콘텐츠로 응답할 수도 있습니다:

```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12-19,24"}

### 상태 {id="status"}

`status` 핸들러는 상태 코드에 기반하여 특정 콘텐츠로 응답하는 기능을 제공합니다. 아래 예시는 서버에 리소스가 없을 경우(즉, `404` 상태 코드) 요청에 어떻게 응답하는지 보여줍니다:

```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12,20-22,24"}

### 상태 파일 {id="status-file"}

`statusFile` 핸들러를 사용하면 상태 코드에 기반하여 HTML 페이지를 제공할 수 있습니다. 프로젝트에 `resources` 폴더에 `error401.html` 및 `error402.html` HTML 페이지가 있다고 가정해 봅시다. 이 경우, `statusFile`을 사용하여 `401` 및 `402` 상태 코드를 다음과 같이 처리할 수 있습니다:
```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12,23-24"}

`statusFile` 핸들러는 구성된 상태 목록 내에서 모든 `#` 문자를 상태 코드 값으로 대체합니다.

> 전체 예시는 여기에서 찾을 수 있습니다: [status-pages](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/status-pages).