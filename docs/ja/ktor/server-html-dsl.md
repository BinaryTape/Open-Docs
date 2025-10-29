[//]: # (title: HTML DSL)

<var name="artifact_name" value="ktor-server-html-builder"/>
<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="html"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">Nativeサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

HTML DSLは、[kotlinx.html](https://github.com/Kotlin/kotlinx.html)ライブラリをKtorに統合し、HTMLブロックでクライアントに応答できるようにします。HTML DSLを使用すると、Kotlinで純粋なHTMLを記述したり、ビューに変数を補間したり、テンプレートを使用して複雑なHTMLレイアウトを構築したりできます。

## 依存関係の追加 {id="add_dependencies"}
HTML DSLは[インストール](server-plugins.md#install)を必要としませんが、`%artifact_name%`アーティファクトが必要です。次のようにビルドスクリプトに含めることができます。

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
  

## HTMLをレスポンスとして送信 {id="html_response"}
HTMLレスポンスを送信するには、必要な[ルート](server-routing.md)内で`[respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html)`メソッドを呼び出します。
以下の例は、サンプルHTML DSLと、クライアントに送信される対応するHTMLを示しています。

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

以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl)は、ユーザーから[認証情報](server-form-based-auth.md)を収集するために使用されるHTMLフォームで応答する方法を示しています。

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

サーバー側でフォームパラメータを受け取る方法については、[フォームパラメータ](server-requests.md#form_parameters)を参照してください。

> kotlinx.htmlを使用したHTMLの生成について詳しく学ぶには、[kotlinx.html wiki](https://github.com/Kotlin/kotlinx.html/wiki)を参照してください。

## テンプレート {id="templates"}

プレーンなHTMLを生成することに加えて、Ktorは複雑なレイアウトを構築するために使用できるテンプレートエンジンを提供します。HTMLページの異なる部分にテンプレートの階層を作成できます。たとえば、ページ全体用のルートテンプレート、ページヘッダーとフッター用のチャイルドテンプレートなどです。Ktorはテンプレートを操作するための以下のAPIを公開しています。

1.  指定されたテンプレートに基づいて構築されたHTMLで応答するには、`[respondHtmlTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html-template.html)`メソッドを呼び出します。
2.  テンプレートを作成するには、`[Template](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template/index.html)`インターフェースを実装し、HTMLを提供する`Template.apply`メソッドをオーバーライドする必要があります。
3.  作成されたテンプレートクラス内では、異なるコンテンツタイプ用のプレースホルダーを定義できます。
    *   `[Placeholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder/index.html)`はコンテンツを挿入するために使用されます。`[PlaceholderList](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder-list/index.html)`は、複数回出現するコンテンツ（例：リスト項目）を挿入するために使用できます。
    *   `[TemplatePlaceholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template-placeholder/index.html)`は、子テンプレートを挿入し、ネストされたレイアウトを作成するために使用できます。
    

### 例 {id="example"}
テンプレートを使用して階層的なレイアウトを作成する方法の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)を見てみましょう。次のようなHTMLがあるとします。
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
このページのレイアウトを2つの部分に分割できます。
*   ページヘッダー用のルートレイアウトテンプレートと、記事用のチャイルドテンプレート。
*   記事コンテンツ用のチャイルドテンプレート。

これらのレイアウトを段階的に実装してみましょう。
  
1.  `respondHtmlTemplate`メソッドを呼び出し、テンプレートクラスをパラメータとして渡します。この場合、これは`Template`インターフェースを実装する`LayoutTemplate`クラスです。
   ```kotlin
   get("/") {
       call.respondHtmlTemplate(LayoutTemplate()) {
           // ...
       }
   }
   ```
   このブロック内では、テンプレートにアクセスし、そのプロパティ値を指定できます。これらの値は、テンプレートクラスで指定されたプレースホルダーを置き換えます。次のステップで`LayoutTemplate`を作成し、そのプロパティを定義します。
  
2.  ルートレイアウトテンプレートは次のようになります。
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

   このクラスは2つのプロパティを公開しています。
   *   `header`プロパティは`h1`タグ内に挿入されるコンテンツを指定します。
   *   `content`プロパティは記事コンテンツ用のチャイルドテンプレートを指定します。

3.  チャイルドテンプレートは次のようになります。
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

   このテンプレートは`articleTitle`、`articleText`、`list`プロパティを公開しており、これらの値は`article`内に挿入されます。

4.  値のリストをテンプレートとして提供するには、次の新しいクラスを作成します。
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

   このテンプレートは`PlaceholderList`クラスを使用して、提供された項目から順不同リスト（`UL`）を生成します。
   また、最初の項目を強調するために`<b>`要素で囲みます。

5.  これで、指定されたプロパティ値を使用して構築されたHTMLを送信する準備ができました。
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

完全な例はこちらで見つけることができます: [html-templates](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)。