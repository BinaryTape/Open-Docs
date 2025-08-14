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

HTML DSL은 [kotlinx.html](https://github.com/Kotlin/kotlinx.html) 라이브러리를 Ktor에 통합하여 HTML 블록으로 클라이언트에 응답할 수 있도록 합니다. HTML DSL을 사용하면 Kotlin에서 순수 HTML을 작성하고, 뷰에 변수를 삽입하며, 템플릿을 사용하여 복잡한 HTML 레이아웃을 구축할 수도 있습니다.

## 의존성 추가 {id="add_dependencies"}
HTML DSL은 [설치](server-plugins.md#install)가 필요하지 않지만 `%artifact_name%` 아티팩트가 필요합니다. 빌드 스크립트에 다음과 같이 포함할 수 있습니다.

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
  

## 응답으로 HTML 전송 {id="html_response"}
HTML 응답을 전송하려면, 필요한 [경로(route)](server-routing.md) 내에서 [respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 메서드를 호출하세요.
아래 예시는 샘플 HTML DSL과 클라이언트에 전송될 해당 HTML을 보여줍니다.

<tabs>
<tab title="Kotlin">

[object Promise]

</tab>
<tab title="HTML">

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

</tab>
</tabs>

다음 [예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl)는 사용자로부터 [자격 증명 정보](server-form-based-auth.md)를 수집하는 데 사용되는 HTML 폼으로 응답하는 방법을 보여줍니다.

<tabs>
<tab title="Kotlin">

[object Promise]

</tab>
<tab title="HTML">

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

</tab>
</tabs>

서버 측에서 폼 매개변수를 받는 방법은 [](server-requests.md#form_parameters)에서 알아볼 수 있습니다.

> kotlinx.html을 사용하여 HTML을 생성하는 방법에 대한 자세한 내용은 [kotlinx.html 위키](https://github.com/Kotlin/kotlinx.html/wiki)를 참조하세요.

## 템플릿 {id="templates"}

일반 HTML 생성 외에도 Ktor는 복잡한 레이아웃을 구축하는 데 사용할 수 있는 템플릿 엔진을 제공합니다. HTML 페이지의 다양한 부분(예: 전체 페이지의 루트 템플릿, 페이지 헤더 및 푸터의 자식 템플릿 등)에 대한 템플릿 계층 구조를 만들 수 있습니다. Ktor는 템플릿 작업을 위해 다음 API를 노출합니다:

1.  지정된 템플릿을 기반으로 구축된 HTML로 응답하려면 [respondHtmlTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html-template.html) 메서드를 호출하세요.
2.  템플릿을 생성하려면 [Template](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template/index.html) 인터페이스를 구현하고 HTML을 제공하는 `Template.apply` 메서드를 오버라이드해야 합니다.
3.  생성된 템플릿 클래스 내에서 다양한 콘텐츠 유형에 대한 플레이스홀더를 정의할 수 있습니다:
    *   [Placeholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder/index.html)는 콘텐츠를 삽입하는 데 사용됩니다. [PlaceholderList](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder-list/index.html)는 여러 번 나타나는 콘텐츠(예: 목록 항목)를 삽입하는 데 사용할 수 있습니다.
    *   [TemplatePlaceholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template-placeholder/index.html)는 자식 템플릿을 삽입하고 중첩 레이아웃을 생성하는 데 사용할 수 있습니다.

### 예시 {id="example"}
템플릿을 사용하여 계층적 레이아웃을 생성하는 [예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)를 살펴보겠습니다. 다음과 같은 HTML이 있다고 상상해 보세요.
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
이 페이지의 레이아웃을 두 부분으로 나눌 수 있습니다.
*   페이지 헤더를 위한 루트 레이아웃 템플릿과 기사를 위한 자식 템플릿.
*   기사 콘텐츠를 위한 자식 템플릿.

이러한 레이아웃을 단계별로 구현해 보겠습니다:
  
1.  `respondHtmlTemplate` 메서드를 호출하고 템플릿 클래스를 매개변수로 전달합니다. 이 경우, `Template` 인터페이스를 구현해야 하는 `LayoutTemplate` 클래스입니다:
    ```kotlin
    get("/") {
        call.respondHtmlTemplate(LayoutTemplate()) {
            // ...
        }
    }
    ```
    이 블록 안에서 템플릿에 접근하여 속성 값을 지정할 수 있습니다. 이 값들은 템플릿 클래스에 지정된 플레이스홀더를 대체합니다. 다음 단계에서 `LayoutTemplate`을 생성하고 속성을 정의할 것입니다.
  
2.  루트 레이아웃 템플릿은 다음과 같이 보입니다:
    [object Promise]

    이 클래스는 두 가지 속성을 노출합니다:
    *   `header` 속성은 `h1` 태그 내에 삽입될 콘텐츠를 지정합니다.
    *   `content` 속성은 기사 콘텐츠를 위한 자식 템플릿을 지정합니다.

3.  자식 템플릿은 다음과 같이 보일 것입니다:
    [object Promise]

    이 템플릿은 `articleTitle`, `articleText`, `list` 속성을 노출하며, 이 속성들의 값은 `article` 내에 삽입됩니다.

4.  템플릿으로 값 목록을 제공하려면 다음 새 클래스를 생성하세요: 
    [object Promise]

    이 템플릿은 `PlaceholderList` 클래스를 사용하여 제공된 항목으로부터 비정렬 목록(`UL`)을 생성합니다. 또한 강조를 위해 첫 번째 항목을 `<b>` 요소로 감쌉니다.

5.  이제 지정된 속성 값을 사용하여 구축된 HTML을 전송할 준비가 되었습니다:
    [object Promise]

전체 예시는 여기에서 찾을 수 있습니다: [html-templates](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates).