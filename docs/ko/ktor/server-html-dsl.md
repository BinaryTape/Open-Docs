[//]: # (title: HTML DSL)

<var name="artifact_name" value="ktor-server-html-builder"/>
<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="html"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✅
</p>
</tldr>

HTML DSL은 [kotlinx.html](https://github.com/Kotlin/kotlinx.html) 라이브러리를 Ktor에 통합하여 클라이언트에 HTML 블록으로 응답할 수 있도록 합니다. HTML DSL을 사용하면 Kotlin으로 순수 HTML을 작성하고, 변수를 뷰에 삽입하며, 템플릿을 사용하여 복잡한 HTML 레이아웃을 구축할 수도 있습니다.

## 의존성 추가 {id="add_dependencies"}
HTML DSL은 [설치](server-plugins.md#install)가 필요 없지만 `%artifact_name%` 아티팩트가 필요합니다. 빌드 스크립트에 다음과 같이 포함할 수 있습니다:

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
  

## HTML 응답 전송 {id="html_response"}
HTML 응답을 전송하려면, 필요한 [경로](server-routing.md) 내에서 [respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 메서드를 호출하세요.
아래 예시는 HTML DSL 샘플과 클라이언트에 전송될 해당 HTML을 보여줍니다:

<Tabs>
<TabItem title="Kotlin">

```kotlin
import io.ktor.server.application.*
import io.ktor.server.html.*
import io.ktor.http.*
import io.ktor.server.routing.*
import kotlinx.html.*

fun Application.module() {
    routing {
        get("/") {
            val name = "Ktor"
            call.respondHtml(HttpStatusCode.OK) {
                head {
                    title {
                        +name
                    }
                }
                body {
                    h1 {
                        +"Hello from $name!"
                    }
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="HTML">

```html
<html>
<head>
    <title>Ktor</title>
</head>
<body>
<h1>Hello from Ktor!</h1>
</body>
</html>
```

</TabItem>
</Tabs>

다음 [예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl)는 사용자로부터 [인증 정보](server-form-based-auth.md)를 수집하는 데 사용되는 HTML 폼으로 응답하는 방법을 보여줍니다:

<Tabs>
<TabItem title="Kotlin">

```kotlin
get("/login") {
    call.respondHtml {
        body {
            form(action = "/login", encType = FormEncType.applicationXWwwFormUrlEncoded, method = FormMethod.post) {
                p {
                    +"Username:"
                    textInput(name = "username")
                }
                p {
                    +"Password:"
                    passwordInput(name = "password")
                }
                p {
                    submitInput() { value = "Login" }
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="HTML">

```html
<html>
<body>
<form action="/login" enctype="application/x-www-form-urlencoded" method="post">
    <p>Username:<input type="text" name="username"></p>
    <p>Password:<input type="password" name="password"></p>
    <p><input type="submit" value="Login"></p>
</form>
</body>
</html>
```

</TabItem>
</Tabs>

서버 측에서 폼 파라미터를 수신하는 방법은 [폼 파라미터](server-requests.md#form_parameters)에서 알아볼 수 있습니다.

> kotlinx.html을 사용하여 HTML을 생성하는 방법에 대해 자세히 알아보려면, [kotlinx.html 위키](https://github.com/Kotlin/kotlinx.html/wiki)를 참조하세요.

## 템플릿 {id="templates"}

일반 HTML을 생성하는 것 외에도, Ktor는 템플릿 엔진을 제공하여 복잡한 레이아웃을 구축하는 데 사용할 수 있습니다. HTML 페이지의 다른 부분에 대한 템플릿 계층을 만들 수 있습니다. 예를 들어, 전체 페이지의 루트 템플릿, 페이지 헤더 및 푸터에 대한 자식 템플릿 등을 만들 수 있습니다. Ktor는 템플릿 작업을 위한 다음 API를 제공합니다:

1.  지정된 템플릿을 기반으로 구축된 HTML로 응답하려면, [respondHtmlTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html-template.html) 메서드를 호출하세요.
2.  템플릿을 생성하려면, [Template](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template/index.html) 인터페이스를 구현하고 HTML을 제공하는 `Template.apply` 메서드를 오버라이드(override)해야 합니다.
3.  생성된 템플릿 클래스 내에서 다양한 콘텐츠 유형에 대한 플레이스홀더를 정의할 수 있습니다:
    *   [Placeholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder/index.html)는 콘텐츠를 삽입하는 데 사용됩니다. [PlaceholderList](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder-list/index.html)는 콘텐츠가 여러 번 나타나는 경우(예: 목록 항목) 삽입하는 데 사용될 수 있습니다.
    *   [TemplatePlaceholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template-placeholder/index.html)는 자식 템플릿을 삽입하고 중첩된 레이아웃을 생성하는 데 사용될 수 있습니다.
    

### 예시 {id="example"}
템플릿을 사용하여 계층적 레이아웃을 생성하는 방법에 대한 [예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)를 살펴보겠습니다. 다음 HTML이 있다고 상상해 봅시다:
```html
<body>
<h1>Ktor</h1>
<article>
    <h2>Hello from Ktor!</h2>
    <p>Kotlin Framework for creating connected systems.</p>
    <ul>
       <li><b>One</b></li>
       <li>Two</li>
    </ul>
</article>
</body>
```
이 페이지의 레이아웃을 두 부분으로 나눌 수 있습니다:
*   페이지 헤더를 위한 루트 레이아웃 템플릿과 기사(article)를 위한 자식 템플릿.
*   기사 콘텐츠를 위한 자식 템플릿.

이러한 레이아웃을 단계별로 구현해 보겠습니다:
  
1.  ``respondHtmlTemplate` 메서드를 호출하고 템플릿 클래스를 파라미터로 전달하세요. 이 경우, `LayoutTemplate` 클래스는 `Template` 인터페이스를 구현해야 합니다:`
    ```kotlin
    get("/") {
        call.respondHtmlTemplate(LayoutTemplate()) {
            // ...
        }
    }
    ```
    블록 내에서, 템플릿에 접근하여 속성 값을 지정할 수 있습니다. 이 값들은 템플릿 클래스에 지정된 플레이스홀더를 대체합니다. 다음 단계에서 `LayoutTemplate`을 생성하고 그 속성을 정의할 것입니다.
  
2.  루트 레이아웃 템플릿은 다음과 같이 보일 것입니다:
    ```kotlin
    class LayoutTemplate: Template<HTML> {
        val header = Placeholder<FlowContent>()
        val content = TemplatePlaceholder<ArticleTemplate>()
        override fun HTML.apply() {
            body {
                h1 {
                    insert(header)
                }
                insert(ArticleTemplate(), content)
            }
        }
    }
    ```

    이 클래스는 두 가지 속성을 노출합니다:
    *   `header` 속성은 `h1` 태그 내에 삽입되는 콘텐츠를 지정합니다.
    *   `content` 속성은 기사 콘텐츠를 위한 자식 템플릿을 지정합니다.

3.  자식 템플릿은 다음과 같이 보일 것입니다:
    ```kotlin
    class ArticleTemplate : Template<FlowContent> {
        val articleTitle = Placeholder<FlowContent>()
        val articleText = Placeholder<FlowContent>()
        val list = TemplatePlaceholder<ListTemplate>()
        override fun FlowContent.apply() {
            article {
                h2 {
                    insert(articleTitle)
                }
                p {
                    insert(articleText)
                }
                insert(ListTemplate(), list)
            }
        }
    }
    ```

    이 템플릿은 `articleTitle`, `articleText`, `list` 속성을 노출하며, 이 값들은 `article` 내에 삽입될 것입니다.

4.  템플릿으로 값 목록을 제공하려면, 다음과 같은 새 클래스를 생성하세요: 
    ```kotlin
    class ListTemplate : Template<FlowContent> {
        val item = PlaceholderList<UL, FlowContent>()
        override fun FlowContent.apply() {
            if (!item.isEmpty()) {
                ul {
                    each(item) {
                        li {
                            if (it.first) {
                                b {
                                    insert(it)
                                }
                            } else {
                                insert(it)
                            }
                        }
                    }
                }
            }
        }
    }
    ```

    이 템플릿은 `PlaceholderList` 클래스를 사용하여 제공된 항목으로부터 비순서 목록(`UL`)을 생성합니다. 또한 첫 번째 항목을 강조하기 위해 `<b>` 요소로 감쌉니다.

5.  이제 지정된 속성 값을 사용하여 HTML을 구축하고 보낼 준비가 되었습니다:
    ```kotlin
    get("/") {
        call.respondHtmlTemplate(LayoutTemplate()) {
            header {
                +"Ktor"
            }
            content {
                articleTitle {
                    +"Hello from Ktor!"
                }
                articleText {
                    +"Kotlin Framework for creating connected systems."
                }
                list {
                    item { +"One" }
                    item { +"Two" }
                }
            }
        }
    }
    ```

전체 예시는 다음에서 찾을 수 있습니다: [html-templates](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates).