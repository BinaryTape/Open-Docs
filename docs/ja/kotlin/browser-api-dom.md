[//]: # (title: ブラウザとDOM API)

Kotlin/JS標準ライブラリでは、`kotlinx.browser` パッケージを使用してブラウザ固有の機能にアクセスできます。このパッケージには、`document` や `window` といった一般的なトップレベルオブジェクトが含まれています。標準ライブラリは、これらのオブジェクトによって公開される機能に対して、可能な限り型安全なラッパーを提供します。フォールバックとして、Kotlinの型システムにうまくマッピングできない関数とのやり取りを提供するために、`dynamic` 型が使用されます。

## DOMとのやり取り

ドキュメントオブジェクトモデル (DOM) とのやり取りには、`document` 変数を使用できます。例えば、このオブジェクトを通じてウェブサイトの背景色を設定できます。

```kotlin
document.bgColor = "FFAA12" 
```

`document` オブジェクトは、ID、名前、クラス名、タグ名などによって特定の要素を取得する方法も提供します。返される要素はすべて `Element?` 型です。それらのプロパティにアクセスするには、適切な型にキャストする必要があります。例えば、メールの `<input>` フィールドがあるHTMLページがあると仮定します。

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

なお、スクリプトは `body` タグの末尾に含まれています。これにより、スクリプトが読み込まれる前にDOMが完全に利用可能になることが保証されます。

この設定により、DOMの要素にアクセスできます。`input` フィールドのプロパティにアクセスするには、`getElementById` を呼び出し、`HTMLInputElement` にキャストします。そうすれば、`value` のようなプロパティに安全にアクセスできます。

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

この `input` 要素を参照するのと同様に、ページ上の他の要素にアクセスし、それらを適切な型にキャストできます。

DOMで要素を簡潔に作成し構造化する方法については、[型安全なHTML DSL](typesafe-html-dsl.md) を参照してください。