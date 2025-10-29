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
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임 또는 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✖️
</p>
</tldr>

Ktor를 사용하면 [Velocity 템플릿](https://velocity.apache.org/engine/)을 애플리케이션 내에서 뷰로 사용할 수 있습니다. 이를 위해 [Velocity](https://api.ktor.io/ktor-server-velocity/io.ktor.server.velocity/-velocity) 플러그인을 설치하면 됩니다.

## 의존성 추가 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## Velocity 설치 {id="install_plugin"}

<p>
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>에서 <code>install</code> 함수에 전달합니다.
    아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 함수 호출 내에서.
    </li>
    <li>
        ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10                    install(%plugin_name%)&#10                    // ...&#10                }.start(wait = true)&#10            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10            fun Application.module() {&#10                install(%plugin_name%)&#10                // ...&#10            }"/>
    </TabItem>
</Tabs>

선택적으로, 표준 및 커스텀 [Velocity 도구](#velocity_tools)를 추가하는 기능을 사용하려면 `VelocityTools` 플러그인을 설치할 수 있습니다.

## Velocity 구성 {id="configure"}
### 템플릿 로드 구성 {id="template_loading"}
`install` 블록 내에서 [VelocityEngine][velocity_engine]을(를) 구성할 수 있습니다. 예를 들어, 클래스패스에서 템플릿을 사용하려면 `classpath`용 리소스 로더를 사용하십시오:
```kotlin
import io.ktor.server.application.*
import io.ktor.server.velocity.*
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader
import org.apache.velocity.runtime.RuntimeConstants

fun Application.module() {
    install(Velocity) {
        setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath")
        setProperty("classpath.resource.loader.class", ClasspathResourceLoader::class.java.name)
    }
}
```

### 응답으로 템플릿 전송 {id="use_template"}
`resources/templates`에 `index.vl` 템플릿이 있다고 가정해 봅시다:
```html
<html>
    <body>
        <h1>Hello, $user.name</h1>
    </body>
</html>
```

사용자 데이터 모델은 다음과 같습니다:
```kotlin
data class User(val id: Int, val name: String)
```

지정된 [경로](server-routing.md)에 템플릿을 사용하려면, `call.respond` 메서드에 `VelocityContent`를 다음과 같이 전달합니다:
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(VelocityContent("templates/index.vl", mapOf("user" to sampleUser)))
}
```

### Velocity 도구 추가 {id="velocity_tools"}

`VelocityTools` 플러그인을 [설치](#install_plugin)했다면, `install` 블록 내에서 `EasyFactoryConfiguration` 인스턴스에 접근하여 표준 및 커스텀 Velocity 도구를 추가할 수 있습니다. 예를 들면 다음과 같습니다:

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