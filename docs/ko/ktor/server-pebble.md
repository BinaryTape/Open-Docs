[//]: # (title: Pebble)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[pebble_engine_builder]: https://pebbletemplates.io/com/mitchellbosecke/pebble/PebbleEngine/Builder/

<var name="plugin_name" value="Pebble"/>
<var name="package_name" value="io.ktor.server.pebble"/>
<var name="artifact_name" value="ktor-server-pebble"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="pebble"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor는 [Pebble](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-pebble/io.ktor.server.pebble/-pebble) 플러그인을 설치하여 애플리케이션 내 뷰(view)로 [Pebble 템플릿](https://pebbletemplates.io/)을 사용할 수 있게 해줍니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## Pebble 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

`install` 블록 내에서 Pebble 템플릿 로드를 위해 [PebbleEngine.Builder][pebble_engine_builder]를 [구성](#configure)할 수 있습니다.

## Pebble 구성 {id="configure"}
### 템플릿 로딩 구성 {id="template_loading"}
템플릿을 로드하려면, [PebbleEngine.Builder][pebble_engine_builder]를 사용하여 템플릿을 로드하는 방법을 구성해야 합니다. 예를 들어, 아래 코드 스니펫은 Ktor가 현재 클래스패스(classpath)를 기준으로 `templates` 패키지에서 템플릿을 찾도록 설정합니다:

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="3-5,10-16,23"}

### 응답으로 템플릿 전송 {id="use_template"}
`resources/templates` 경로에 `index.html` 템플릿이 있다고 가정해 봅시다:

```html
```
{src="snippets/pebble/src/main/resources/templates/index.html"}

사용자(user)에 대한 데이터 모델은 다음과 같습니다:

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="25"}

지정된 [경로(route)](server-routing.md)에 템플릿을 사용하려면, `PebbleContent`를 `call.respond` 메서드에 다음과 같이 전달합니다:

```kotlin
```
{src="snippets/pebble/src/main/kotlin/com/example/Application.kt" include-lines="18-21"}