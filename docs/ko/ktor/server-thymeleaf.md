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
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">네이티브 서버</Links> 지원</b>: ✖️
</p>
</tldr>

Ktor를 사용하면 [Thymeleaf 템플릿](https://www.thymeleaf.org/)을 뷰로 애플리케이션 내에서 [Thymeleaf](https://api.ktor.io/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf) 플러그인을 설치하여 사용할 수 있습니다.

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

## Thymeleaf 설치 {id="install_plugin"}

<p>
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
    지정된 <Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">모듈</Links>에서 <code>install</code> 함수에 전달합니다.
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
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## Thymeleaf 구성 {id="configure"}
### 템플릿 로딩 구성 {id="template_loading"}
`install` 블록 내에서 `ClassLoaderTemplateResolver`를 구성할 수 있습니다. 예를 들어, 아래 코드 스니펫은 Ktor가 현재 클래스 경로를 기준으로 `templates` 패키지에서 `*.html` 템플릿을 찾도록 활성화합니다:
```kotlin
import io.ktor.server.application.*
import io.ktor.server.thymeleaf.*
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver

fun Application.module() {
    install(Thymeleaf) {
        setTemplateResolver(ClassLoaderTemplateResolver().apply {
            prefix = "templates/"
            suffix = ".html"
            characterEncoding = "utf-8"
        })
    }
}
```

### 응답으로 템플릿 전송 {id="use_template"}
`resources/templates`에 `index.html` 템플릿이 있다고 가정해 봅시다:
```html
<html xmlns:th="http://www.thymeleaf.org">
    <body>
        <h1 th:text="'Hello, ' + ${user.name}"></h1>
    </body>
</html>
```

사용자 데이터 모델은 다음과 같습니다:
```kotlin
data class User(val id: Int, val name: String)
```

지정된 [경로](server-routing.md)에 템플릿을 사용하려면, 다음과 같이 [ThymeleafContent](https://api.ktor.io/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf-content/index.html)를 `call.respond` 메서드에 전달합니다:
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(ThymeleafContent("index", mapOf("user" to sampleUser)))
}
```

## 예시: Thymeleaf 템플릿 자동 재로드 {id="auto-reload"}

아래 예시는 [개발 모드](server-development-mode.topic)를 사용할 때 Thymeleaf 템플릿을 자동으로 재로드하는 방법을 보여줍니다.

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.thymeleaf.*
import org.thymeleaf.templateresolver.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    install(Thymeleaf) {
        setTemplateResolver((if (developmentMode) {
            FileTemplateResolver().apply {
                cacheManager = null
                prefix = "src/main/resources/templates/"
            }
        } else {
            ClassLoaderTemplateResolver().apply {
                prefix = "templates/"
            }
        }).apply {
            suffix = ".html"
            characterEncoding = "utf-8"
        })
    }
    routing {
        get("/index") {
            val sampleUser = User(1, "John")
            call.respond(ThymeleafContent("index", mapOf("user" to sampleUser)))
        }
    }
}

data class User(val id: Int, val name: String)

```

전체 예시는 여기서 확인할 수 있습니다: [thymeleaf-auto-reload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/thymeleaf-auto-reload).