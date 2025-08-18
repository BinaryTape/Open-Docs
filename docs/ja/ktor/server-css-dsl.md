[//]: # (title: CSS DSL)

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-html-builder</code>, <code>org.jetbrains.kotlin-wrappers:kotlin-css</code>
</p>
<var name="example_name" value="css-dsl"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

CSS DSLは[HTML DSL](server-html-dsl.md)を拡張し、[kotlin-css](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-css/README.md)ラッパーを使用してKotlinでスタイルシートを作成できるようにします。

> スタイルシートを静的コンテンツとして提供する方法については、[静的コンテンツの提供](server-static-content.md)を参照してください。

## 依存関係の追加 {id="add_dependencies"}
CSS DSLは[インストール](server-plugins.md#install)を必要としませんが、ビルドスクリプトに以下のアーティファクトを含める必要があります。

1.  HTML DSL用の`ktor-server-html-builder`アーティファクト:

   <var name="artifact_name" value="ktor-server-html-builder"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>

2.  CSSをビルドするための`kotlin-css-jvm`アーティファクト:

   <var name="group_id" value="org.jetbrains.kotlin-wrappers"/>
   <var name="artifact_name" value="kotlin-css"/>
   <var name="version" value="kotlin_css_version"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                   &lt;version&gt;${%version%}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>

   `$kotlin_css_version`は、例えば`%kotlin_css_version%`のように、必要な`kotlin-css`アーティファクトのバージョンに置き換えることができます。

## CSSの提供 {id="serve_css"}

CSSレスポンスを送信するには、`ApplicationCall`を拡張し、スタイルシートを文字列にシリアライズして`CSS`コンテンツタイプでクライアントに送信する`respondCss`メソッドを追加する必要があります。

```kotlin
suspend inline fun ApplicationCall.respondCss(builder: CssBuilder.() -> Unit) {
    this.respondText(CssBuilder().apply(builder).toString(), ContentType.Text.CSS)
}
```

次に、必要な[ルート](server-routing.md)内でCSSを提供できます。

```kotlin
get("/styles.css") {
    call.respondCss {
        body {
            backgroundColor = Color.darkBlue
            margin = Margin(0.px)
        }
        rule("h1.page-title") {
            color = Color.white
        }
    }
}
```

最後に、[HTML DSL](server-html-dsl.md)で作成されたHTMLドキュメントに指定されたCSSを使用できます。

```kotlin
get("/html-dsl") {
    call.respondHtml {
        head {
            link(rel = "stylesheet", href = "/styles.css", type = "text/css")
        }
        body {
            h1(classes = "page-title") {
                +"Hello from Ktor!"
            }
        }
    }
}
```

完全な例はこちらで見つけることができます: [css-dsl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/css-dsl)。