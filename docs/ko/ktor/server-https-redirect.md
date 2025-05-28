[//]: # (title: HttpsRedirect)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HttpsRedirect"/>
<var name="package_name" value="io.ktor.server.plugins.httpsredirect"/>
<var name="artifact_name" value="ktor-server-http-redirect"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-redirect"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-http-redirect/io.ktor.server.plugins.httpsredirect/-https-redirect.html) 플러그인은 호출을 처리하기 전에 모든 HTTP 요청을 [해당 HTTPS](server-ssl.md)로 리다이렉트합니다. 기본적으로 리소스는 `301 Moved Permanently`를 반환하지만, `302 Found`로 설정할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

위 코드는 기본 설정으로 `%plugin_name%` 플러그인을 설치합니다.

>리버스 프록시 뒤에 있을 때, HTTPS 요청을 올바르게 감지하려면 `ForwardedHeader` 또는 `XForwardedHeader` 플러그인을 설치해야 합니다. 이 플러그인 중 하나를 설치한 후 무한 리다이렉트가 발생한다면, 더 자세한 내용은 [이 FAQ 항목](FAQ.topic#infinite-redirect)을 확인해보세요.
>
{type="note"}

## %plugin_name% 구성 {id="configure"}

아래 코드 스니펫은 원하는 HTTPS 포트를 구성하고 요청된 리소스에 대해 `301 Moved Permanently`를 반환하도록 하는 방법을 보여줍니다:

```kotlin
```
{src="snippets/ssl-engine-main-redirect/src/main/kotlin/com/example/Application.kt" include-lines="11-14"}

전체 예제는 여기에서 찾을 수 있습니다: [ssl-engine-main-redirect](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-redirect).