[//]: # (title: CSS DSL)

<tldr>
<p>
<b>필요한 의존성</b>: <code>io.ktor:ktor-server-html-builder</code>, <code>org.jetbrains.kotlin-wrappers:kotlin-css</code>
</p>
<var name="example_name" value="css-dsl"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

CSS DSL은 [HTML DSL](server-html-dsl.md)을 확장하며, [kotlin-css](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-css/README.md) 래퍼를 사용하여 Kotlin에서 스타일시트를 작성할 수 있도록 합니다.

> 다음에서 스타일시트를 정적 콘텐츠로 제공하는 방법을 알아보세요: [](server-static-content.md).

## 의존성 추가 {id="add_dependencies"}
CSS DSL은 [설치](server-plugins.md#install)가 필요 없지만, 빌드 스크립트에 다음 아티팩트를 포함해야 합니다:

1. HTML DSL용 <code>ktor-server-html-builder</code> 아티팩트:

   <var name="artifact_name" value="ktor-server-html-builder"/>
   <include from="lib.topic" element-id="add_ktor_artifact"/>
   
2. CSS 빌드용 <code>kotlin-css-jvm</code> 아티팩트:

   <var name="group_id" value="org.jetbrains.kotlin-wrappers"/>
   <var name="artifact_name" value="kotlin-css"/>
   <var name="version" value="kotlin_css_version"/>
   <include from="lib.topic" element-id="add_artifact"/>
   
   <code>$kotlin_css_version</code>을 <code>kotlin-css</code> 아티팩트의 필요한 버전(예: <code>%kotlin_css_version%</code>)으로 대체할 수 있습니다.

## CSS 제공 {id="serve_css"}

CSS 응답을 보내려면, 스타일시트를 문자열로 직렬화하고 <code>CSS</code> 콘텐츠 타입으로 클라이언트에 전송하도록 <code>respondCss</code> 메서드를 추가하여 <code>ApplicationCall</code>을 확장해야 합니다:

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="39-41"}

그 다음, 필요한 [경로](server-routing.md) 내에서 CSS를 제공할 수 있습니다:

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="25-35"}

마지막으로, [HTML DSL](server-html-dsl.md)로 생성된 HTML 문서에 지정된 CSS를 사용할 수 있습니다:

```kotlin
```
{src="snippets/css-dsl/src/main/kotlin/com/example/Application.kt" include-lines="13-24"}

전체 예제는 여기에서 찾을 수 있습니다: [css-dsl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/css-dsl).