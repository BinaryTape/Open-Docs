[//]: # (title: 조건부 헤더)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-conditional-headers"/>
<var name="package_name" value="io.ktor.server.plugins.conditionalheaders"/>
<var name="plugin_name" value="ConditionalHeaders"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="conditional-headers"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[ConditionalHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers.html) 플러그인은 마지막 요청 이후 콘텐츠 본문이 변경되지 않은 경우 해당 본문 전송을 방지합니다. 이는 다음 헤더를 사용하여 달성됩니다.
*   `Last-Modified` 응답 헤더는 리소스 수정 시간을 포함합니다. 예를 들어, 클라이언트 요청에 `If-Modified-Since` 값이 포함되어 있는 경우, Ktor는 주어진 날짜 이후에 리소스가 수정된 경우에만 전체 응답을 보냅니다. [정적 파일](server-static-content.md)의 경우 Ktor는 `ConditionalHeaders`를 [설치](#install_plugin)한 후 `Last-Modified` 헤더를 자동으로 추가합니다.
*   `Etag` 응답 헤더는 특정 리소스 버전의 식별자입니다. 예를 들어, 클라이언트 요청에 `If-None-Match` 값이 포함되어 있는 경우, 이 값이 `Etag`와 일치하면 Ktor는 전체 응답을 보내지 않습니다. [ConditionalHeaders](#configure)를 구성할 때 `Etag` 값을 지정할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 헤더 구성 {id="configure"}

`%plugin_name%`을(를) 구성하려면 `install` 블록 내에서 [version](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers-config/version.html) 함수를 호출해야 합니다. 이 함수는 주어진 `ApplicationCall` 및 `OutgoingContent`에 대한 리소스 버전 목록에 접근할 수 있도록 합니다. [EntityTagVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-entity-tag-version/index.html) 및 [LastModifiedVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-last-modified-version/index.html) 클래스 객체를 사용하여 필요한 버전을 지정할 수 있습니다.

다음 코드 스니펫은 CSS에 `Etag` 및 `Last-Modified` 헤더를 추가하는 방법을 보여줍니다.
```kotlin
```
{src="snippets/conditional-headers/src/main/kotlin/com/example/Application.kt" include-lines="16-27"}

전체 예제는 여기에서 찾을 수 있습니다: [conditional-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/conditional-headers).