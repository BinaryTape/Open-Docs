[//]: # (title: FreeMarker)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[freemarker_template_loading]: https://freemarker.apache.org/docs/pgui_config_templateloading.html

<var name="plugin_name" value="FreeMarker"/>
<var name="package_name" value="io.ktor.server.freemarker"/>
<var name="artifact_name" value="ktor-server-freemarker"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="freemarker"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor는 [FreeMarker 템플릿](https://freemarker.apache.org/)을 애플리케이션 내에서 뷰로 사용할 수 있도록 [FreeMarker](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/-free-marker) 플러그인 설치를 지원합니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## FreeMarker 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

`install` 블록 내에서 FreeMarker 템플릿 로드를 위해 원하는 [TemplateLoader][freemarker_template_loading]를 [구성](#configure)할 수 있습니다.

## FreeMarker 구성 {id="configure"}
### 템플릿 로드 구성 {id="template_loading"}
템플릿을 로드하려면 `templateLoader` 속성에 원하는 [TemplateLoader][freemarker_template_loading] 타입을 할당해야 합니다. 예를 들어, 아래 코드 스니펫은 Ktor가 현재 클래스패스를 기준으로 `templates` 패키지에서 템플릿을 찾도록 설정합니다:
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="3-5,10-14,21"}

### 응답으로 템플릿 전송 {id="use_template"}
`resources/templates`에 `index.ftl` 템플릿이 있다고 가정해 봅시다:
```html
```
{src="snippets/freemarker/src/main/resources/templates/index.ftl"}

사용자 데이터 모델은 다음과 같습니다:
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="23"}

지정된 [경로](server-routing.md)에 템플릿을 사용하려면, 다음 방식으로 `call.respond` 메서드에 `FreeMarkerContent`를 전달합니다:
```kotlin
```
{src="snippets/freemarker/src/main/kotlin/com/example/Application.kt" include-lines="16-19"}