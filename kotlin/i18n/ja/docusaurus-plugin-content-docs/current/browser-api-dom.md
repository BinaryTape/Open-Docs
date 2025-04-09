---
title: "ブラウザと DOM API"
---
Kotlin/JS標準ライブラリを使用すると、`kotlinx.browser` パッケージを使用してブラウザ固有の機能にアクセスできます。
これには、`document` や `window` などの一般的なトップレベルオブジェクトが含まれます。標準ライブラリは、これらのオブジェクトによって公開される機能に対して、可能な限りタイプセーフなラッパーを提供します。フォールバックとして、Kotlin型システムにうまくマッピングされない関数とのインタラクションを提供するために `dynamic` 型が使用されます。

## DOMとのインタラクション

Document Object Model（DOM）とのインタラクションには、変数 `document` を使用できます。たとえば、このオブジェクトを介してWebサイトの背景色を設定できます。

```kotlin
document.bgColor = "FFAA12" 
```

`document` オブジェクトは、ID、名前、クラス名、タグ名などで特定の要素を取得する方法も提供します。
返される要素はすべて `Element?` 型です。プロパティにアクセスするには、適切な型にキャストする必要があります。
たとえば、メール `<input>` フィールドを含むHTMLページがあるとします。

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

スクリプトは ``body`` タグの下部に含まれていることに注意してください。これにより、スクリプトがロードされる前にDOMが完全に利用可能になります。

この設定で、DOMの要素にアクセスできます。`input` フィールドのプロパティにアクセスするには、`getElementById` を呼び出して `HTMLInputElement` にキャストします。その後、`value` などのプロパティに安全にアクセスできます。

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

この `input` 要素を参照するのと同じように、ページの他の要素にアクセスし、適切な型にキャストできます。

DOMで要素を作成および構造化する方法を簡潔に確認するには、[Typesafe HTML DSL](typesafe-html-dsl) を参照してください。