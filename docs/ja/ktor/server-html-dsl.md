[//]: # (title: HTML DSL)

<var name="artifact_name" value="ktor-server-html-builder"/>
<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="html"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

HTML DSLは[kotlinx.html](https://github.com/Kotlin/kotlinx.html)ライブラリをKtorに統合し、クライアントにHTMLブロックで応答できるようにします。HTML DSLを使用すると、Kotlinで純粋なHTMLを記述し、ビューに変数を補間し、さらにテンプレートを使用して複雑なHTMLレイアウトを構築することもできます。

## 依存関係の追加 {id="add_dependencies"}
HTML DSLは[インストール](server-plugins.md#install)は必要ありませんが、`%artifact_name%`アーティファクトが必要です。これをビルドスクリプトに次のように含めることができます。

<include from="lib.topic" element-id="add_ktor_artifact"/>
  

## レスポンスでHTMLを送信 {id="html_response"}
HTMLレスポンスを送信するには、必要な[ルート](server-routing.md)内で[respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html)メソッドを呼び出します。以下の例は、サンプルHTML DSLとクライアントに送信される対応するHTMLを示しています。

<tabs>
<tab title="Kotlin">

```kotlin
```
{src="snippets/html/src/main/kotlin/com/example/Application.kt" include-lines="3-8,11-29"}

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

以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl)は、ユーザーから[資格情報](server-form-based-auth.md)を収集するために使用されるHTMLフォームで応答する方法を示しています。

<tabs>
<tab title="Kotlin">

```kotlin
```
{src="snippets/auth-form-html-dsl/src/main/kotlin/com/example/Application.kt" include-lines="36-54"}

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

サーバー側でフォームパラメータを受け取る方法は[](server-requests.md#form_parameters)で学ぶことができます。

> kotlinx.htmlを使用してHTMLを生成することについてさらに学ぶには、[kotlinx.html wiki](https://github.com/Kotlin/kotlinx.html/wiki)を参照してください。

## テンプレート {id="templates"}

素のHTMLを生成するだけでなく、Ktorは複雑なレイアウトを構築するために使用できるテンプレートエンジンを提供します。HTMLページの異なる部分（例えば、ページ全体のルートテンプレート、ページのヘッダーとフッターの子テンプレートなど）のために、テンプレートの階層を作成できます。Ktorはテンプレートを操作するための以下のAPIを公開しています。

1.  指定されたテンプレートに基づいて構築されたHTMLで応答するには、[respondHtmlTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html-template.html)メソッドを呼び出します。
2.  テンプレートを作成するには、[Template](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template/index.html)インターフェースを実装し、HTMLを提供する`Template.apply`メソッドをオーバーライドする必要があります。
3.  作成したテンプレートクラス内で、異なるコンテンツタイプのためのプレースホルダーを定義できます。
    *   [Placeholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder/index.html)はコンテンツを挿入するために使用されます。[PlaceholderList](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder-list/index.html)は複数回出現するコンテンツ（例えば、リストアイテム）を挿入するために使用できます。
    *   [TemplatePlaceholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template-placeholder/index.html)は子テンプレートを挿入し、ネストされたレイアウトを作成するために使用できます。
    

### 例 {id="example"}
テンプレートを使用して階層的なレイアウトを作成する方法を[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)で見てみましょう。次のHTMLがあると想像してください。
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

これらのレイアウトを段階的に実装していきましょう。
  
1.  `respondHtmlTemplate`メソッドを呼び出し、テンプレートクラスをパラメータとして渡します。この場合、`Template`インターフェースを実装する必要がある`LayoutTemplate`クラスです。
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
   ```
   {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="34-45"}

   このクラスは2つのプロパティを公開します。
   *   `header`プロパティは、`h1`タグ内に挿入されるコンテンツを指定します。
   *   `content`プロパティは、記事コンテンツの子テンプレートを指定します。

3.  子テンプレートは次のようになります。
   ```kotlin
   ```
   {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="47-62"}

   このテンプレートは、`articleTitle`、`articleText`、および`list`プロパティを公開しており、これらの値は`article`内に挿入されます。

4.  テンプレートとして値のリストを提供するには、次の新しいクラスを作成します。
   ```kotlin
   ```
   {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="64-83"}

   このテンプレートは、提供されたアイテムから順序なしリスト（`UL`）を生成するために`PlaceholderList`クラスを使用します。
   また、最初のアイテムを強調するために`<b>`要素で囲んでいます。

5.  これで、指定されたプロパティ値を使用して構築されたHTMLを送信する準備ができました。
   ```kotlin
   ```
   {src="snippets/html-templates/src/main/kotlin/com/example/Application.kt" include-lines="12-30"}

完全な例は以下で確認できます: [html-templates](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)。