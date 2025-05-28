[//]: # (title: 부분 콘텐츠)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-partial-content"/>
<var name="package_name" value="io.ktor.server.plugins.partialcontent"/>
<var name="plugin_name" value="PartialContent"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>서버 예시</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file">download-file</a>,
<b>클라이언트 예시</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file-range">client-download-file-range</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-partial-content/io.ktor.server.plugins.partialcontent/-partial-content.html) 플러그인은 클라이언트에 HTTP 메시지의 일부만을 전송하는 데 사용되는 [HTTP 범위 요청](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests) 처리를 지원합니다. 이 플러그인은 콘텐츠 스트리밍 또는 부분 다운로드 재개에 유용합니다.

`%plugin_name%`는 다음과 같은 제한 사항을 가지고 있습니다:
- `HEAD` 및 `GET` 요청에서만 작동하며 클라이언트가 `Range` 헤더를 다른 메서드와 함께 사용하려고 할 경우 `405 Method Not Allowed`를 반환합니다.
- `Content-Length` 헤더가 정의된 응답에서만 작동합니다.
- 범위를 제공할 때 [Compression](server-compression.md)을 비활성화합니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

HTTP 범위 요청을 사용하여 파일을 제공하기 위해 `%plugin_name%`를 사용하는 방법을 배우려면 [](server-responses.md#file) 섹션을 참조하십시오.