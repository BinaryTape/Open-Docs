[//]: # (title: JTE)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Jte"/>
<var name="package_name" value="io.ktor.server.jte"/>
<var name="artifact_name" value="ktor-server-jte"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="jte"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor를 사용하면 [%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-jte/io.ktor.server.jte/-jte.html) 플러그인을 설치하여 애플리케이션 내에서 [JTE 템플릿](https://github.com/casid/jte)을 뷰로 사용할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> `.kte` 파일을 처리하려면 프로젝트에 `gg.jte:jte-kotlin` 아티팩트를 추가해야 합니다.

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

`install` 블록 내에서 JTE 템플릿을 로드하는 방법을 [구성](#configure)할 수 있습니다.

## %plugin_name% 구성 {id="configure"}
### 템플릿 로드 구성 {id="template_loading"}
JTE 템플릿을 로드하려면 다음을 수행해야 합니다.
1. 템플릿 코드를 해석하는 데 사용되는 `CodeResolver`를 생성합니다. 예를 들어, `DirectoryCodeResolver`를 구성하여 지정된 디렉터리에서 템플릿을 로드하거나 `ResourceCodeResolver`를 구성하여 애플리케이션 리소스에서 템플릿을 로드할 수 있습니다.
2. `templateEngine` 속성을 사용하여 템플릿 엔진을 지정합니다. 이 템플릿 엔진은 생성된 `CodeResolver`를 사용하여 템플릿을 네이티브 Java/Kotlin 코드로 변환합니다.

예를 들어, 아래 코드 스니펫은 Ktor가 `templates` 디렉터리에서 JTE 템플릿을 조회할 수 있도록 합니다.

```kotlin
```
{src="snippets/jte/src/main/kotlin/com/example/Application.kt" include-lines="3-6,9-10,13-17,24"}

### 응답으로 템플릿 전송 {id="use_template"}
`templates` 디렉터리에 `index.kte` 템플릿이 있다고 가정해 봅시다.
```html
```
{src="snippets/jte/templates/index.kte"}

지정된 [라우트](server-routing.md)에 템플릿을 사용하려면 다음과 같은 방식으로 `JteContent`를 `call.respond` 메서드에 전달합니다.
```kotlin
```
{src="snippets/jte/src/main/kotlin/com/example/Application.kt" include-lines="19-22"}