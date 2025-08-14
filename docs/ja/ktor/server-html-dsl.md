[//]: # (title: HTML DSL)

<var name="artifact_name" value="ktor-server-html-builder"/>
<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="html"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">Native server</Links> のサポート</b>: ✅
    </p>
    
</tldr>

HTML DSLは、[kotlinx.html](https://github.com/Kotlin/kotlinx.html)ライブラリをKtorに統合し、クライアントにHTMLブロックで応答できるようにします。HTML DSLを使用すると、Kotlinで純粋なHTMLを記述し、ビューに変数を補間し、テンプレートを使用して複雑なHTMLレイアウトを構築することさえできます。

## 依存関係の追加 {id="add_dependencies"}
HTML DSLは[インストール](server-plugins.md#install)を必要としませんが、`%artifact_name%`アーティファクトが必要です。ビルドスクリプトに次のように含めることができます。

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
    
  

## レスポンスでHTMLを送信する {id="html_response"}
HTMLレスポンスを送信するには、必要な[ルート](server-routing.md)内で[respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html)メソッドを呼び出します。
以下の例は、HTML DSLのサンプルと、クライアントに送信される対応するHTMLを示しています。

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

以下の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-form-html-dsl)は、ユーザーから[資格情報](server-form-based-auth.md)を収集するために使用されるHTMLフォームで応答する方法を示しています。

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

サーバー側でフォームパラメータを受け取る方法については、[](server-requests.md#form_parameters)から学ぶことができます。

> `kotlinx.html`を使用したHTMLの生成について詳しく学ぶには、[kotlinx.html wiki](https://github.com/Kotlin/kotlinx.html/wiki)を参照してください。

## テンプレート {id="templates"}

Ktorは、素のHTMLを生成するだけでなく、複雑なレイアウトを構築するために使用できるテンプレートエンジンを提供しています。HTMLページの異なる部分に対してテンプレートの階層を作成できます。たとえば、ページ全体のルートテンプレート、ページヘッダーとフッターの子テンプレートなどです。Ktorはテンプレートを扱うための以下のAPIを公開しています。

1.  指定されたテンプレートに基づいて構築されたHTMLで応答するには、[respondHtmlTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html-template.html)メソッドを呼び出します。
2.  テンプレートを作成するには、[Template](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template/index.html)インターフェースを実装し、HTMLを提供する`Template.apply`メソッドをオーバーライドする必要があります。
3.  作成したテンプレートクラス内で、異なるコンテンツタイプに対応するプレースホルダーを定義できます。
    *   [Placeholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder/index.html)はコンテンツを挿入するために使用されます。[PlaceholderList](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-placeholder-list/index.html)は複数回出現するコンテンツ（例：リスト項目）を挿入するために使用できます。
    *   [TemplatePlaceholder](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/-template-placeholder/index.html)は子テンプレートを挿入し、ネストされたレイアウトを作成するために使用できます。
    

### 例 {id="example"}
テンプレートを使用して階層的なレイアウトを作成する方法の[例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)を見てみましょう。以下のHTMLがあるとします。
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
  
1.  `respondHtmlTemplate`メソッドを呼び出し、テンプレートクラスをパラメータとして渡します。この場合、これは`Template`インターフェースを実装すべき`LayoutTemplate`クラスです。
   ```kotlin
   get("/") {
       call.respondHtmlTemplate(LayoutTemplate()) {
           // ...
       }
   }
   ```
   このブロック内では、テンプレートにアクセスし、そのプロパティ値を指定できます。これらの値は、テンプレートクラスで指定されたプレースホルダーに置き換わります。次のステップで`LayoutTemplate`を作成し、そのプロパティを定義します。
  
2.  ルートレイアウトテンプレートは次のようになります。
   [object Promise]

   このクラスは2つのプロパティを公開しています。
   *   `header`プロパティは`h1`タグ内に挿入されるコンテンツを指定します。
   *   `content`プロパティは記事コンテンツの子テンプレートを指定します。

3.  子テンプレートは次のようになります。
   [object Promise]

   このテンプレートは`articleTitle`、`articleText`、`list`プロパティを公開しており、これらの値は`article`内に挿入されます。

4.  テンプレートとして値のリストを提供するには、以下の新しいクラスを作成します。
   [object Promise]

   このテンプレートは`PlaceholderList`クラスを使用して、提供された項目から順序なしリスト（`UL`）を生成します。
   また、最初の項目を強調のために`<b>`要素で囲みます。

5.  これで、指定されたプロパティ値を使用して構築されたHTMLを送信する準備ができました。
   [object Promise]

完全な例は以下で確認できます: [html-templates](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/html-templates)。