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

CSS DSL は [HTML DSL](server-html-dsl.md) を拡張し、[kotlin-css](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-css/README.md) ラッパーを使用して Kotlin でスタイルシートを記述できるようにします。

> [](server-static-content.md) から静的コンテンツとしてスタイルシートを提供する方法を学びましょう。

## 依存関係の追加 {id="add_dependencies"}
CSS DSL は [インストール](server-plugins.md#install) を必要としませんが、ビルドスクリプトに以下のアーティファクトを含める必要があります:

1. HTML DSL 用の `ktor-server-html-builder` アーティファクト:

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
    
   
2. CSS をビルドするための `kotlin-css-jvm` アーティファクト:

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
    
   
   `$kotlin_css_version` は、`kotlin-css` アーティファクトの必要なバージョン (例: `%kotlin_css_version%`) に置き換えることができます。

## CSS の提供 {id="serve_css"}

CSS レスポンスを送信するには、`ApplicationCall` を拡張し、スタイルシートを文字列にシリアル化し、`CSS` コンテンツタイプでクライアントに送信するための `respondCss` メソッドを追加する必要があります:

[object Promise]

その後、必要な [ルート](server-routing.md) 内に CSS を提供できます:

[object Promise]

最後に、[HTML DSL](server-html-dsl.md) で作成された HTML ドキュメントに指定された CSS を使用できます:

[object Promise]

完全な例はこちらで見つけることができます: [css-dsl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/css-dsl)。