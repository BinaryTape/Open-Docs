[//]: # (title: 자동 HEAD 응답)

<var name="plugin_name" value="AutoHeadResponse"/>
<var name="artifact_name" value="ktor-server-auto-head-response"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="autohead"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name%는 `GET`이 정의된 모든 경로에 대해 `HEAD` 요청에 자동으로 응답하는 기능을 제공합니다.
</link-summary>

[`AutoHeadResponse`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auto-head-response/io.ktor.server.plugins.autohead/-auto-head-response.html) 플러그인은 `GET`이 정의된 모든 경로에 대해 `HEAD` 요청에 자동으로 응답하는 기능을 제공합니다. 실제 콘텐츠를 가져오기 전에 클라이언트에서 응답을 처리해야 하는 경우, `AutoHeadResponse`를 사용하여 별도의 [`HEAD`](server-routing.md#define_route) 핸들러를 생성하는 것을 피할 수 있습니다. 예를 들어, [`respondFile`](server-responses.md#file) 함수를 호출하면 응답에 `Content-Length` 및 `Content-Type` 헤더가 자동으로 추가되며, 파일을 다운로드하기 전에 클라이언트에서 이 정보를 얻을 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 사용법
이 기능을 활용하려면 애플리케이션에 `AutoHeadResponse` 플러그인을 설치해야 합니다.

```kotlin
```
{src="snippets/autohead/src/main/kotlin/com/example/Application.kt" include-lines="3-15"}

이 경우 `/home` 경로는 이 동사에 대한 명시적인 정의가 없더라도 `HEAD` 요청에 응답할 것입니다.

이 플러그인을 사용할 경우, 동일한 `GET` 경로에 대한 사용자 정의 `HEAD` 정의는 무시된다는 점에 유의해야 합니다.

## 옵션
`AutoHeadResponse`는 추가 구성 옵션을 제공하지 않습니다.