---
title: タイプセーフなビルダー
---
よく名前が付けられた関数を [レシーバ付き関数リテラル](lambdas#function-literals-with-receiver) と組み合わせてビルダーとして使用することで、Kotlin でタイプセーフな静的型付けビルダーを作成できます。

タイプセーフなビルダーを使用すると、半宣言的な方法で複雑な階層型データ構造を構築するのに適した、Kotlin ベースのドメイン固有言語 (DSL) を作成できます。ビルダーのサンプルユースケースは次のとおりです。

* [HTML](https://github.com/Kotlin/kotlinx.html) や XML など、Kotlin コードでマークアップを生成する
* Web サーバーのルートを構成する: [Ktor](https://ktor.io/docs/routing.html)

次のコードについて考えてみましょう。

```kotlin
import com.example.html.* // 下記の宣言を参照

fun result() =
    html {
        head {
            title {+"XML encoding with Kotlin"}
        }
        body {
            h1 {+"XML encoding with Kotlin"}
            p  {+"this format can be used as an alternative markup to XML"}

            // 属性とテキストコンテンツを持つ要素
            a(href = "https://kotlinlang.org") {+"Kotlin"}

            // 混在コンテンツ
            p {
                +"This is some"
                b {+"mixed"}
                +"text. For more see the"
                a(href = "https://kotlinlang.org") {+"Kotlin"}
                +"project"
            }
            p {+"some text"}

            // によって生成されたコンテンツ
            p {
                for (arg in args)
                    +arg
            }
        }
    }
```

これは完全に正当な Kotlin コードです。
[このコードをオンラインで試す (変更してブラウザーで実行する) にはこちら](https://play.kotlinlang.org/byExample/09_Kotlin_JS/06_HtmlBuilder)。

## 仕組み

Kotlin でタイプセーフなビルダーを実装する必要があると仮定します。
まず、構築するモデルを定義します。この場合、HTML タグをモデル化する必要があります。
これは、いくつかのクラスを使用すると簡単にできます。
たとえば、`HTML` は `<html>` タグを記述するクラスで、` <head>` や `<body>` などの子を定義します。
(その宣言については、[下記](#full-definition-of-the-com-example-html-package) を参照してください。)

次に、コード内で次のようなことを言える理由を思い出してください。

```kotlin
html {
 // ...
}
```

`html` は実際には、引数として [ラムダ式](lambdas) を取る関数呼び出しです。
この関数は次のように定義されます。

```kotlin
fun html(init: HTML.() `->` Unit): HTML {
    val html = HTML()
    html.init()
    return html
}
```

この関数は `init` という名前の 1 つのパラメーターを取ります。これはそれ自体が関数です。
関数の型は `HTML.() `->` Unit` であり、これは *レシーバ付きの関数型* です。
これは、型 `HTML` のインスタンス (*レシーバー*) を関数に渡し、関数内でそのインスタンスのメンバーを呼び出すことができることを意味します。

レシーバーは `this` キーワードを介してアクセスできます。

```kotlin
html {
    this.head { ... }
    this.body { ... }
}
```

(`head` と `body` は `HTML` のメンバー関数です。)

通常どおり、`this` は省略できるため、すでにビルダーによく似たものが得られます。

```kotlin
html {
    head { ... }
    body { ... }
}
```

では、この呼び出しは何をするのでしょうか? 上記で定義されている `html` 関数の本体を見てみましょう。
これは `HTML` の新しいインスタンスを作成し、引数として渡される関数を呼び出すことによって初期化します
(この例では、`HTML` インスタンスで `head` と `body` を呼び出すことになります)、そしてこのインスタンスを返します。
これはまさにビルダーが行うべきことです。

`HTML` クラスの `head` 関数と `body` 関数は、`html` と同様に定義されます。
唯一の違いは、構築されたインスタンスを囲んでいる `HTML` インスタンスの `children` コレクションに追加することです。

```kotlin
fun head(init: Head.() `->` Unit): Head {
    val head = Head()
    head.init()
    children.add(head)
    return head
}

fun body(init: Body.() `->` Unit): Body {
    val body = Body()
    body.init()
    children.add(body)
    return body
}
```

実際、これらの 2 つの関数はまったく同じことを行うため、汎用バージョン `initTag` を使用できます。

```kotlin
protected fun <T : Element> initTag(tag: T, init: T.() `->` Unit): T {
    tag.init()
    children.add(tag)
    return tag
}
```

これで、関数は非常にシンプルになります。

```kotlin
fun head(init: Head.() `->` Unit) = initTag(Head(), init)

fun body(init: Body.() `->` Unit) = initTag(Body(), init)
```

これらを使用して `<head>` タグと `<body>` タグを構築できます。

ここで説明するもう 1 つのことは、タグ本体にテキストを追加する方法です。上記の例では、次のように述べています。

```kotlin
html {
    head {
        title {+"XML encoding with Kotlin"}
    }
    // ...
}
```

基本的に、文字列をタグ本体に配置するだけですが、その前に小さな `+` があります。
これは、プレフィックス `unaryPlus()` 演算を呼び出す関数呼び出しです。
その演算は実際には、`TagWithText` 抽象クラス ( `Title` の親) のメンバーである拡張関数 `unaryPlus()` によって定義されます。

```kotlin
operator fun String.unaryPlus() {
    children.add(TextElement(this))
}
```

したがって、プレフィックス `+` がここで行うことは、文字列を `TextElement` のインスタンスでラップし、それを `children` コレクションに追加して、タグツリーの適切な一部にすることです。

これらすべては、上記のビルダーの例の先頭でインポートされるパッケージ `com.example.html` で定義されています。
最後のセクションでは、このパッケージの完全な定義を確認できます。

## スコープ制御: @DslMarker

DSL を使用する場合、コンテキストで呼び出すことができる関数が多すぎるという問題に遭遇する可能性があります。
ラムダ内で使用可能なすべての暗黙的なレシーバーのメソッドを呼び出すことができるため、一貫性のない結果が得られる可能性があります。
たとえば、別の `head` 内のタグ `head` などです。

```kotlin
html {
    head {
        head {} // 禁止する必要があります
    }
    // ...
}
```

この例では、最も近い暗黙的なレシーバー `this@head` のメンバーのみが使用可能である必要があります。`head()` は外部レシーバー `this@html` のメンバーであるため、呼び出すことは違法である必要があります。

この問題に対処するために、レシーバースコープを制御するための特別なメカニズムがあります。

コンパイラーにスコープの制御を開始させるには、DSL で使用されるすべてのレシーバーの型に同じマーカーアノテーションを付加するだけで済みます。
たとえば、HTML ビルダーの場合、アノテーション `@HTMLTagMarker` を宣言します。

```kotlin
@DslMarker
annotation class HtmlTagMarker
```

アノテーションクラスは、`@DslMarker` アノテーションでアノテーションが付けられている場合、DSL マーカーと呼ばれます。

この DSL では、すべてのタグクラスが同じスーパークラス `Tag` を拡張します。
`@HtmlTagMarker` でスーパークラスにアノテーションを付けるだけで十分であり、その後、Kotlin コンパイラーはすべての継承されたクラスをアノテーションが付けられたものとして扱います。

```kotlin
@HtmlTagMarker
abstract class Tag(val name: String) { ... }
```

スーパークラスにすでにアノテーションが付けられているため、`HTML` または `Head` クラスに `@HtmlTagMarker` でアノテーションを付ける必要はありません。

```kotlin
class HTML() : Tag("html") { ... }

class Head() : Tag("head") { ... }
```

このアノテーションを追加すると、Kotlin コンパイラーはどの暗黙的なレシーバーが同じ DSL の一部であるかを認識し、最も近いレシーバーのメンバーのみを呼び出すことができます。

```kotlin
html {
    head {
        head { } // エラー: 外部レシーバーのメンバー
    }
    // ...
}
```

外部レシーバーのメンバーを呼び出すことはまだ可能ですが、それを行うには、このレシーバーを明示的に指定する必要があることに注意してください。

```kotlin
html {
    head {
        this@html.head { } // 可能
    }
    // ...
}
```

`@DslMarker` アノテーションを [関数型](lambdas#function-types) に直接適用することもできます。
`@DslMarker` アノテーションに `@Target(AnnotationTarget.TYPE)` でアノテーションを付けるだけです。

```kotlin
@Target(AnnotationTarget.TYPE)
@DslMarker
annotation class HtmlTagMarker
```

その結果、`@DslMarker` アノテーションは関数型、最も一般的にはレシーバー付きのラムダに適用できます。 例：

```kotlin
fun html(init: @HtmlTagMarker HTML.() `->` Unit): HTML { ... }

fun HTML.head(init: @HtmlTagMarker Head.() `->` Unit): Head { ... }

fun Head.title(init: @HtmlTagMarker Title.() `->` Unit): Title { ... }
```

これらの関数を呼び出すと、`@DslMarker` アノテーションは、明示的に指定しない限り、アノテーションが付けられたラムダの本体での外部レシーバーへのアクセスを制限します。

```kotlin
html {
    head {
        title {
            // 外部レシーバーの title、head、またはその他の関数へのアクセスはここで制限されます。
        }
    }
}
```

最も近いレシーバーのメンバーと拡張機能のみがラムダ内でアクセス可能であり、ネストされたスコープ間の意図しない相互作用を防ぎます。

### com.example.html パッケージの完全な定義

これは、パッケージ `com.example.html` の定義方法です (上記の例で使用されている要素のみ)。
HTML ツリーを構築します。これは、[拡張関数](extensions) と [レシーバー付きのラムダ](lambdas#function-literals-with-receiver) を多用します。

```kotlin
package com.example.html

interface Element {
    fun render(builder: StringBuilder, indent: String)
}

class TextElement(val text: String) : Element {
    override fun render(builder: StringBuilder, indent: String) {
        builder.append("$indent$text
")
    }
}

@DslMarker
annotation class HtmlTagMarker

@HtmlTagMarker
abstract class Tag(val name: String) : Element {
    val children = arrayListOf<Element>()
    val attributes = hashMapOf<String, String>()

    protected fun <T : Element> initTag(tag: T, init: T.() `->` Unit): T {
        tag.init()
        children.add(tag)
        return tag
    }

    override fun render(builder: StringBuilder, indent: String) {
        builder.append("$indent<$name${renderAttributes()}>
")
        for (c in children) {
            c.render(builder, indent + "  ")
        }
        builder.append("$indent</$name>
")
    }

    private fun renderAttributes(): String {
        val builder = StringBuilder()
        for ((attr, value) in attributes) {
            builder.append(" $attr=\"$value\"")
        }
        return builder.toString()
    }

    override fun toString(): String {
        val builder = StringBuilder()
        render(builder, "")
        return builder.toString()
    }
}

abstract class TagWithText(name: String) : Tag(name) {
    operator fun String.unaryPlus() {
        children.add(TextElement(this))
    }
}

class HTML : TagWithText("html") {
    fun head(init: Head.() `->` Unit) = initTag(Head(), init)

    fun body(init: Body.() `->` Unit) = initTag(Body(), init)
}

class Head : TagWithText("head") {
    fun title(init: Title.() `->` Unit) = initTag(Title(), init)
}

class Title : TagWithText("title")

abstract class BodyTag(name: String) : TagWithText(name) {
    fun b(init: B.() `->` Unit) = initTag(B(), init)
    fun p(init: P.() `->` Unit) = initTag(P(), init)
    fun h1(init: H1.() `->` Unit) = initTag(H1(), init)
    fun a(href: String, init: A.() `->` Unit) {
        val a = initTag(A(), init)
        a.href = href
    }
}

class Body : BodyTag("body")
class B : BodyTag("b")
class P : BodyTag("p")
class H1 : BodyTag("h1")

class A : BodyTag("a") {
    var href: String
        get() = attributes["href"]!!
        set(value) {
            attributes["href"] = value
        }
}

fun html(init: HTML.() `->` Unit): HTML {
    val html = HTML()
    html.init()
    return html
}
```