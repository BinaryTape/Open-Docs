[//]: # (title: ブラウザとDOM API)

Kotlin/JS標準ライブラリは、`kotlinx.browser`パッケージを使用してブラウザ固有の機能にアクセスできます。このパッケージには、`document`や`window`のような典型的なトップレベルオブジェクトが含まれています。標準ライブラリは、これらのオブジェクトによって公開される機能に対して、可能な限り型安全なラッパーを提供します。代替手段として、Kotlinの型システムにうまくマッピングできない関数とのやり取りには、`dynamic`型が使用されます。

## DOMとのやり取り

ドキュメントオブジェクトモデル (DOM) とのやり取りには、`document`変数を使用できます。たとえば、このオブジェクトを通してウェブサイトの背景色を設定できます。

```kotlin
document.bgColor = "FFAA12" 
```

`document`オブジェクトは、ID、名前、クラス名、タグ名などによって特定の要素を取得する方法も提供します。返されるすべての要素は`Element?`型です。それらのプロパティにアクセスするには、適切な型にキャストする必要があります。たとえば、電子メールの`<input>`フィールドを含むHTMLページがあると仮定します。

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

スクリプトは`body`タグの最後に含まれていることに注意してください。これにより、スクリプトがロードされる前にDOMが完全に利用可能であることが保証されます。

この設定で、DOMの要素にアクセスできます。`input`フィールドのプロパティにアクセスするには、`getElementById`を呼び出して`HTMLInputElement`にキャストします。その後、`value`などのプロパティに安全にアクセスできます。

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

この`input`要素を参照するのと同じように、ページ上の他の要素にアクセスし、それらを適切な型にキャストできます。

DOMで要素を簡潔に作成し、構造化する方法については、[型安全なHTML DSL](typesafe-html-dsl.md)を参照してください。