[//]: # (title: Thymeleaf)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Thymeleaf"/>
<var name="package_name" value="io.ktor.server.thymeleaf"/>
<var name="artifact_name" value="ktor-server-thymeleaf"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="thymeleaf"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor는 [Thymeleaf](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf) 플러그인을 설치하여 애플리케이션 내에서 [Thymeleaf 템플릿](https://www.thymeleaf.org/)을 뷰로 사용할 수 있도록 합니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## Thymeleaf 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## Thymeleaf 구성 {id="configure"}
### 템플릿 로딩 구성 {id="template_loading"}
`install` 블록 안에서 `ClassLoaderTemplateResolver`를 구성할 수 있습니다. 예를 들어, 아래 코드 스니펫은 Ktor가 현재 클래스패스를 기준으로 `templates` 패키지에서 `*.html` 템플릿을 찾도록 설정합니다.
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="3,6-8,11-18,25"}

### 응답으로 템플릿 전송 {id="use_template"}
`resources/templates`에 `index.html` 템플릿이 있다고 가정해 봅시다:
```html
```
{src="snippets/thymeleaf/src/main/resources/templates/index.html"}

사용자 데이터 모델은 다음과 같습니다:
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="27"}

지정된 [경로(route)](server-routing.md)에 템플릿을 사용하려면, 다음과 같이 `call.respond` 메서드에 [ThymeleafContent](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf-content/index.html)를 전달합니다:
```kotlin
```
{src="snippets/thymeleaf/src/main/kotlin/com/example/Application.kt" include-lines="20-23"}

## 예시: Thymeleaf 템플릿 자동 리로드 {id="auto-reload"}

아래 예시는 [개발 모드(development mode)](server-development-mode.topic) 사용 시 Thymeleaf 템플릿을 자동으로 리로드하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/thymeleaf-auto-reload/src/main/kotlin/com/example/Application.kt"}

전체 예시는 다음에서 확인할 수 있습니다: [thymeleaf-auto-reload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/thymeleaf-auto-reload).