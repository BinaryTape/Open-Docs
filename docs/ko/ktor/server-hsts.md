[//]: # (title: HSTS)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HSTS"/>
<var name="package_name" value="io.ktor.server.plugins.hsts"/>
<var name="artifact_name" value="ktor-server-hsts"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-hsts"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s.html) 플러그인은 [RFC 6797](https://tools.ietf.org/html/rfc6797)에 따라 필요한 _HTTP Strict Transport Security_ 헤더를 요청에 추가합니다. 브라우저가 HSTS 정책 헤더를 수신하면, 주어진 기간 동안 안전하지 않은 연결로 서버에 더 이상 연결을 시도하지 않습니다.

> 참고로 HSTS 정책 헤더는 안전하지 않은 HTTP 연결에서는 무시됩니다. HSTS가 적용되려면 [보안](server-ssl.md) 연결을 통해 제공되어야 합니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## %plugin_name% 구성 {id="configure"}

`%plugin_name%`은 [HSTSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s-config/index.html)를 통해 설정을 노출합니다. 아래 예시는 `maxAgeInSeconds` 속성을 사용하여 클라이언트가 호스트를 알려진 HSTS 호스트 목록에 얼마나 오래 유지해야 하는지 지정하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/ssl-engine-main-hsts/src/main/kotlin/com/example/Application.kt" include-lines="11-12,17"}

또한 `withHost`를 사용하여 다른 호스트에 대해 다른 HSTS 구성을 제공할 수 있습니다.

```kotlin
```
{src="snippets/ssl-engine-main-hsts/src/main/kotlin/com/example/Application.kt" include-lines="11-17"}

전체 예시는 다음에서 찾을 수 있습니다: [ssl-engine-main-hsts](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-hsts).