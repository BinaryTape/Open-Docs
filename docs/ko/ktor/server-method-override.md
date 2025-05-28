[//]: # (title: XHttpMethodOverride)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="XHttpMethodOverride"/>
<var name="package_name" value="io.ktor.server.plugins.methodoverride"/>
<var name="artifact_name" value="ktor-server-method-override"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-method-override"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name%는 `X-HTTP-Method-Override` 헤더 내부에 HTTP 메서드를 터널링하는 기능을 제공합니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-method-override/io.ktor.server.plugins.methodoverride/-x-http-method-override.html) 플러그인은 `X-HTTP-Method-Override` 헤더 내부에 HTTP 메서드를 터널링하는 기능을 제공합니다.
이는 서버 API가 여러 HTTP 메서드(`GET`, `PUT`, `POST`, `DELETE` 등)를 처리하지만, 클라이언트가 특정 제약으로 인해 제한된 메서드(`GET` 및 `POST` 등)만 사용할 수 있는 경우 유용할 수 있습니다.
예를 들어, 클라이언트가 `X-Http-Method-Override` 헤더를 `DELETE`로 설정하여 요청을 보내면, Ktor는 `delete` [경로 핸들러](server-routing.md#define_route)를 사용하여 이 요청을 처리합니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name% 구성 {id="configure"}

기본적으로 `%plugin_name%`는 `X-Http-Method-Override` 헤더를 확인하여 요청을 처리할 경로를 결정합니다.
`headerName` 프로퍼티를 사용하여 헤더 이름을 사용자 정의할 수 있습니다.

## 예제 {id="example"}

아래 HTTP 요청은 `POST` 메서드를 사용하며 `X-Http-Method-Override` 헤더를 `DELETE`로 설정합니다:

```http request
```
{src="snippets/json-kotlinx-method-override/post.http"}

`delete` [경로 핸들러](server-routing.md#define_route)를 사용하여 이러한 요청을 처리하려면 `%plugin_name%`을(를) 설치해야 합니다:

```kotlin
```
{src="snippets/json-kotlinx-method-override/src/main/kotlin/com/example/Application.kt"}

전체 예제는 다음에서 찾을 수 있습니다: [json-kotlinx-method-override](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx-method-override).