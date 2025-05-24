---
title: "Kotlin から JavaScript コードを使用する"
---
Kotlinは当初、Javaプラットフォームとの容易な相互運用性のために設計されました。JavaのクラスをKotlinのクラスとして認識し、KotlinのクラスをJavaのクラスとして認識します。

しかし、JavaScriptは動的型付け言語であり、コンパイル時に型チェックを行いません。KotlinからJavaScriptへは、[dynamic](dynamic-type)型を介して自由に通信できます。Kotlinの型システムの全機能を使用したい場合は、JavaScriptライブラリの外部宣言を作成することで、Kotlinコンパイラおよび周辺ツールに理解させることができます。

## インラインJavaScript

[`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html)関数を使用して、JavaScriptコードをKotlinコードにインライン化できます。
例：

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

`js`のパラメータはコンパイル時に解析され、JavaScriptコードに「そのまま」変換されるため、文字列定数である必要があります。したがって、次のコードは正しくありません。

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}

fun getTypeof() = "typeof"
```

:::note
JavaScriptコードはKotlinコンパイラによって解析されるため、すべてのECMAScript機能がサポートされているとは限りません。
この場合、コンパイルエラーが発生する可能性があります。

:::

`js()`を呼び出すと、[`dynamic`](dynamic-type)型の結果が返されます。これは、コンパイル時に型安全性が提供されないことを意味します。

## external修飾子

特定の宣言が純粋なJavaScriptで記述されていることをKotlinに伝えるには、`external`修飾子でマークする必要があります。
コンパイラがそのような宣言を認識すると、対応するクラス、関数、またはプロパティの実装が外部（開発者または[npm dependencies](js-project-setup#npm-dependencies)経由）から提供されると想定し、したがって、その宣言からJavaScriptコードを生成しようとしません。これが、`external`宣言に本体を含めることができない理由でもあります。例：

```kotlin
external fun alert(message: Any?): Unit

external class Node {
    val firstChild: Node

    fun append(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}

external val window: Window
```

`external`修飾子は、ネストされた宣言に継承されることに注意してください。これが、上記の例の`Node`クラスで、メンバ関数とプロパティの前に`external`修飾子がない理由です。

`external`修飾子は、パッケージレベルの宣言でのみ許可されます。`external`でないクラスの`external`メンバを宣言することはできません。

### クラスの（static）メンバを宣言する

JavaScriptでは、メンバをプロトタイプまたはクラス自体に定義できます。

``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

Kotlinにはそのような構文はありません。ただし、Kotlinには[`companion`](object-declarations#companion-objects)オブジェクトがあります。Kotlinは`external`クラスのコンパニオンオブジェクトを特別な方法で扱います。オブジェクトを期待する代わりに、コンパニオンオブジェクトのメンバがクラス自体のメンバであると見なします。上記の例の`MyClass`は、次のように記述できます。

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### オプションパラメータを宣言する

オプションのパラメータを持つJavaScript関数の外部宣言を記述する場合は、`definedExternally`を使用します。
これにより、デフォルト値の生成がJavaScript関数自体に委譲されます。

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

この外部宣言を使用すると、1つの必須引数と2つのオプション引数を使用して`myFunWithOptionalArgs`を呼び出すことができます。デフォルト値は、`myFunWithOptionalArgs`のJavaScript実装によって計算されます。

### JavaScriptクラスを拡張する

JavaScriptクラスをKotlinクラスであるかのように簡単に拡張できます。`external open`クラスを定義し、`external`でないクラスでそれを拡張するだけです。例：

```kotlin
open external class Foo {
    open fun run()
    fun stop()
}

class Bar : Foo() {
    override fun run() {
        window.alert("Running!")
    }

    fun restart() {
        window.alert("Restarting")
    }
}
```

いくつかの制限事項があります。

- 外部基底クラスの関数がシグネチャによってオーバーロードされている場合、派生クラスでそれをオーバーライドすることはできません。
- デフォルト引数を持つ関数をオーバーライドすることはできません。
- 外部クラスを非外部クラスで拡張することはできません。

### externalインターフェース

JavaScriptにはインターフェースの概念がありません。関数がパラメータに2つのメソッド`foo`と`bar`をサポートすることを期待する場合、実際にこれらのメソッドを持つオブジェクトを渡すだけです。

インターフェースを使用すると、この概念を静的に型付けされたKotlinで表現できます。

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

外部インターフェースの一般的なユースケースは、設定オブジェクトを記述することです。例：

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) `->` Unit

    // etc
}

fun JQueryAjaxSettings(): JQueryAjaxSettings = js("{}")

external class JQuery {
    companion object {
        fun get(settings: JQueryAjaxSettings): JQueryXHR
    }
}

fun sendQuery() {
    JQuery.get(JQueryAjaxSettings().apply {
        complete = { (xhr, data) `->`
            window.alert("Request complete")
        }
    })
}
```

外部インターフェースにはいくつかの制限があります。

- `is`チェックの右側で使用することはできません。
- reified型引数として渡すことはできません。
- クラスリテラル式（`I::class`など）で使用することはできません。
- 外部インターフェースへの`as`キャストは常に成功します。
    外部インターフェースへのキャストは、「Unchecked cast to external interface」コンパイル時警告を生成します。警告は`@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")`アノテーションで抑制できます。

    IntelliJ IDEAは、`@Suppress`アノテーションを自動的に生成することもできます。電球アイコンまたはAlt-Enterを介してインテンションメニューを開き、「Unchecked cast to external interface」インスペクションの横にある小さな矢印をクリックします。ここで、抑制スコープを選択すると、IDEがファイルにアノテーションを追加します。

### キャスト

キャストが不可能な場合に`ClassCastException`をスローする["unsafe" cast operator](typecasts#unsafe-cast-operator)`as`に加えて、Kotlin/JSは[`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)も提供します。`unsafeCast`を使用する場合、ランタイム時に_型チェックは一切行われません_。たとえば、次の2つのメソッドについて考えてみます。

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

これらは、次のようにコンパイルされます。

```javascript
function usingUnsafeCast(s) {
    return s;
}

function usingAsOperator(s) {
    var tmp$;
    return typeof (tmp$ = s) === 'string' ? tmp$ : throwCCE();
}
```

## 等価性

Kotlin/JSには、他のプラットフォームと比較して、等価性チェックに関する特定のセマンティクスがあります。

Kotlin/JSでは、Kotlinの[参照の等価性](equality#referential-equality)演算子（`===`）は常にJavaScriptの[厳密等価性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)演算子（`===`）に変換されます。

JavaScriptの`===`演算子は、2つの値が等しいだけでなく、これらの2つの値の型が等しいこともチェックします。

 ```kotlin
fun main() {
    val name = "kotlin"
    val value1 = name.substring(0, 1)
    val value2 = name.substring(0, 1)

    println(if (value1 === value2) "yes" else "no")
    // Prints 'yes' on Kotlin/JS
    // Prints 'no' on other platforms
}
 ```

また、Kotlin/JSでは、[`Byte`, `Short`, `Int`, `Float`, and `Double`](js-to-kotlin-interop#kotlin-types-in-javascript)の数値型はすべて、ランタイム時にJavaScriptの`Number`型で表されます。したがって、これら5つの型の値は区別できません。

 ```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // Prints 'true' on Kotlin/JS
    // Prints 'false' on other platforms
}
 ```

:::tip
Kotlinの等価性の詳細については、[Equality](equality)ドキュメントを参照してください。

:::