[//]: # (title: DoubleReceive)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DoubleReceive"/>
<var name="package_name" value="io.ktor.server.plugins.doublereceive"/>
<var name="artifact_name" value="ktor-server-double-receive"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="double-receive"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-double-receive/io.ktor.server.plugins.doublereceive/-double-receive.html) 플러그인은 `RequestAlreadyConsumedException` 예외 없이 [요청 본문](server-requests.md#body_contents)을 여러 번 수신하는 기능을 제공합니다.
이것은 [플러그인](server-plugins.md)이 이미 요청 본문을 소비하여 라우트 핸들러 내에서 이를 수신할 수 없는 경우에 유용할 수 있습니다.
예를 들어, [CallLogging](server-call-logging.md) 플러그인을 사용하여 요청 본문을 로깅하고, 그 다음 `%plugin_name%`을 통해 `post` [라우트 핸들러](server-routing.md#define_route) 내에서 본문을 한 번 더 수신할 수 있습니다.

> [%plugin_name%] 플러그인은 실험적인 API를 사용하며, 향후 업데이트에서 발전할 것으로 예상됩니다. 이 과정에서 호환성이 깨지는 변경(breaking changes)이 발생할 수 있습니다.
>
{type="note"}

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

[%plugin_name%]을(를) 설치한 후, [요청 본문](server-requests.md#body_contents)을 여러 번 수신할 수 있으며 각 호출은 동일한 인스턴스를 반환합니다.
예를 들어, [CallLogging](server-call-logging.md) 플러그인을 사용하여 요청 본문 로깅을 활성화할 수 있습니다...

```kotlin
```
{src="snippets/double-receive/src/main/kotlin/com/example/Application.kt" include-lines="16-23"}

...그리고 라우트 핸들러 내에서 요청 본문을 한 번 더 가져올 수 있습니다.

```kotlin
```
{src="snippets/double-receive/src/main/kotlin/com/example/Application.kt" include-lines="25-28"}

전체 예제는 다음에서 찾을 수 있습니다: [double-receive](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/double-receive).

## %plugin_name% 구성 {id="configure"}
기본 구성에서 [%plugin_name%]은(는) 다음과 같은 타입으로 [요청 본문](server-requests.md#body_contents)을 수신할 수 있는 기능을 제공합니다:

- `ByteArray`
- `String`
- `Parameters`
- `ContentNegotiation` 플러그인에서 사용하는 [데이터 클래스](server-serialization.md#create_data_class)

기본적으로 [%plugin_name%]은(는) 다음을 지원하지 않습니다:

- 동일한 요청에서 다른 타입 수신;
- [스트림 또는 채널](server-requests.md#raw) 수신.

동일한 요청에서 다른 타입을 수신하거나 스트림 또는 채널을 수신할 필요가 없다면, `cacheRawRequest` 속성을 `false`로 설정하십시오:

```kotlin
install(DoubleReceive) {
    cacheRawRequest = false
}
```