[//]: # (title: Velocity)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[velocity_engine]: https://velocity.apache.org/engine/devel/apidocs/org/apache/velocity/app/VelocityEngine.html

<var name="plugin_name" value="Velocity"/>
<var name="package_name" value="io.ktor.server.velocity"/>
<var name="artifact_name" value="ktor-server-velocity"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="velocity"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor를 사용하면 [Velocity 플러그인](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-velocity/io.ktor.server.velocity/-velocity)을 설치하여 애플리케이션 내에서 [Velocity 템플릿](https://velocity.apache.org/engine/)을 뷰로 사용할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## Velocity 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

선택적으로, 표준 및 사용자 정의 [Velocity 도구](#velocity_tools)를 추가하는 기능을 사용하려면 `VelocityTools` 플러그인을 설치할 수 있습니다.

## Velocity 구성 {id="configure"}
### 템플릿 로딩 구성 {id="template_loading"}
`install` 블록 내부에서 [VelocityEngine][velocity_engine]을 구성할 수 있습니다. 예를 들어, 클래스패스에서 템플릿을 사용하려면 `classpath`용 리소스 로더를 사용합니다.
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="3-4,7-9,12-16,23"}

### 응답으로 템플릿 전송 {id="use_template"}
`resources/templates`에 `index.vl` 템플릿이 있다고 가정해 봅시다:
```html
```
{src="snippets/velocity/src/main/resources/templates/index.vl"}

사용자 데이터 모델은 다음과 같습니다:
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="25"}

지정된 [경로](server-routing.md)에 템플릿을 사용하려면, 다음과 같이 `call.respond` 메서드에 `VelocityContent`를 전달합니다:
```kotlin
```
{src="snippets/velocity/src/main/kotlin/com/example/Application.kt" include-lines="18-21"}

### Velocity 도구 추가 {id="velocity_tools"}

`VelocityTools` 플러그인을 [설치했다면](#install_plugin), `install` 블록 내부에서 `EasyFactoryConfiguration` 인스턴스에 접근하여 표준 및 사용자 정의 Velocity 도구를 추가할 수 있습니다. 예를 들어:

```kotlin
install(VelocityTools) {
    engine {
        // Engine configuration
        setProperty("resource.loader", "string")
        addProperty("resource.loader.string.name", "myRepo")
        addProperty("resource.loader.string.class", StringResourceLoader::class.java.name)
        addProperty("resource.loader.string.repository.name", "myRepo")
    }
    addDefaultTools() // Add a default tool
    tool("foo", MyCustomTool::class.java) // Add a custom tool
}