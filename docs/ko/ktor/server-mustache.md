[//]: # (title: Mustache)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[mustache_factory]: http://spullara.github.io/mustache/apidocs/com/github/mustachejava/MustacheFactory.html

<var name="plugin_name" value="Mustache"/>
<var name="package_name" value="io.ktor.server.mustache"/>
<var name="artifact_name" value="ktor-server-mustache"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="mustache"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor는 [Mustache 플러그인](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-mustache/io.ktor.server.mustache/-mustache)을 설치하여 애플리케이션 내에서 [Mustache 템플릿](https://github.com/spullara/mustache.java)을 뷰로 사용할 수 있도록 합니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## Mustache 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

`install` 블록 내에서 Mustache 템플릿 로드용 [MustacheFactory][mustache_factory]를 [구성](#template_loading)할 수 있습니다.

## Mustache 구성 {id="configure"}
### 템플릿 로드 구성 {id="template_loading"}
템플릿을 로드하려면 [MustacheFactory][mustache_factory]를 `mustacheFactory` 속성에 할당해야 합니다. 예를 들어, 아래 코드 스니펫은 Ktor가 현재 클래스패스에 상대적인 `templates` 패키지에서 템플릿을 찾을 수 있도록 합니다.
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="3-6,11-15,22"}

### 응답으로 템플릿 전송 {id="use_template"}
`resources/templates`에 `index.hbs` 템플릿이 있다고 가정해 봅시다:
```html
```
{src="snippets/mustache/src/main/resources/templates/index.hbs"}

사용자용 데이터 모델은 다음과 같습니다:
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="24"}

지정된 [경로](server-routing.md)에 템플릿을 사용하려면 `MustacheContent`를 `call.respond` 메서드에 다음과 같은 방식으로 전달합니다:
```kotlin
```
{src="snippets/mustache/src/main/kotlin/com/example/Application.kt" include-lines="17-20"}