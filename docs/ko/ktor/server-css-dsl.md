[//]: # (title: CSS DSL)

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-html-builder</code>, <code>org.jetbrains.kotlin-wrappers:kotlin-css</code>
</p>
<var name="example_name" value="css-dsl"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

CSS DSL은 [HTML DSL](server-html-dsl.md)을 확장하며, [kotlin-css](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-css/README.md) 래퍼를 사용하여 Kotlin으로 스타일시트를 작성할 수 있도록 합니다.

> [](server-static-content.md)에서 스타일시트를 정적 콘텐츠로 제공하는 방법을 알아보세요.

## 의존성 추가 {id="add_dependencies"}
CSS DSL은 [설치](server-plugins.md#install)가 필요 없지만, 빌드 스크립트에 다음 아티팩트를 포함해야 합니다:

1. HTML DSL용 `ktor-server-html-builder` 아티팩트:

   <var name="artifact_name" value="ktor-server-html-builder"/>
   
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
    
   
2. CSS 빌드용 `kotlin-css-jvm` 아티팩트:

   <var name="group_id" value="org.jetbrains.kotlin-wrappers"/>
   <var name="artifact_name" value="kotlin-css"/>
   <var name="version" value="kotlin_css_version"/>
   
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
    
   
   `$kotlin_css_version`을 `kotlin-css` 아티팩트의 필수 버전으로 교체할 수 있습니다. 예를 들어 `%kotlin_css_version%`와 같이 사용합니다.

## CSS 제공 {id="serve_css"}

CSS 응답을 보내려면, 스타일시트를 문자열로 직렬화하고 `CSS` 콘텐츠 타입으로 클라이언트에 전송하는 `respondCss` 메서드를 추가하여 `ApplicationCall`을 확장해야 합니다:

[object Promise]

그런 다음, 필요한 [경로](server-routing.md) 내에서 CSS를 제공할 수 있습니다:

[object Promise]

마지막으로, [HTML DSL](server-html-dsl.md)로 생성된 HTML 문서에 지정된 CSS를 사용할 수 있습니다:

[object Promise]

전체 예시는 다음에서 찾을 수 있습니다: [css-dsl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/css-dsl).