[//]: # (title: KotlinからJavaScriptコードを使用する)

Kotlinは当初、Javaプラットフォームとの容易な相互運用を念頭に設計されました。KotlinはJavaクラスをKotlinクラスとして認識し、JavaはKotlinクラスをJavaクラスとして認識します。

しかし、JavaScriptは動的型付け言語であり、コンパイル時に型チェックを行いません。そのため、KotlinからJavaScriptへは[`dynamic`](dynamic-type.md)型を介して自由に通信できます。Kotlinの型システムの力を最大限に活用したい場合は、Kotlinコンパイラや周囲のツール群が理解できるJavaScriptライブラリの外部宣言を作成できます。

## インラインJavaScript

[`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html)関数を使用すると、JavaScriptコードをKotlinコードにインライン化できます。
例:

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

`js`のパラメータはコンパイル時にパースされ、JavaScriptコードに「そのまま」変換されるため、文字列定数である必要があります。したがって、次のコードは正しくありません。

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}

fun getTypeof() = "typeof"
```

> JavaScriptコードはKotlinコンパイラによってパースされるため、すべてのECMAScript機能がサポートされるとは限りません。
> この場合、コンパイルエラーが発生する可能性があります。
> 
{style="note"}

`js()`の呼び出しは[`dynamic`](dynamic-type.md)型の結果を返すことに注意してください。これはコンパイル時の型安全性を提供しません。

## `external`修飾子

特定の宣言が純粋なJavaScriptで書かれていることをKotlinに伝えるには、`external`修飾子でマークする必要があります。コンパイラがこのような宣言を見たとき、対応するクラス、関数、またはプロパティの実装が外部（開発者または[npm依存関係](js-project-setup.md#npm-dependencies)を介して）で提供されると仮定し、その宣言からJavaScriptコードを生成しようとしません。これが`external`宣言が本体を持てない理由でもあります。例:

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

`external`修飾子はネストされた宣言にも継承されることに注意してください。このため、上記の`Node`クラスの例では、メンバー関数やプロパティの前に`external`修飾子はありません。

`external`修飾子はパッケージレベルの宣言にのみ許可されます。非`external`クラスの`external`メンバーを宣言することはできません。

### クラスの(静的)メンバーを宣言する

JavaScriptでは、プロトタイプまたはクラス自体にメンバーを定義できます。

```javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

Kotlinにはそのような構文はありません。ただし、Kotlinには[`companion`](object-declarations.md#companion-objects)オブジェクトがあります。Kotlinは`external`クラスのコンパニオンオブジェクトを特別な方法で扱います。オブジェクトを期待する代わりに、コンパニオンオブジェクトのメンバーがクラス自体のメンバーであると仮定します。上記の例の`MyClass`は次のように記述できます。

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### オプション引数を宣言する

オプション引数を持つJavaScript関数の外部宣言を作成する場合は、`definedExternally`を使用します。これにより、デフォルト値の生成はJavaScript関数自体に委ねられます。

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

この外部宣言を使用すると、`myFunWithOptionalArgs`を1つの必須引数と2つのオプション引数で呼び出すことができ、デフォルト値は`myFunWithOptionalArgs`のJavaScript実装によって計算されます。

### JavaScriptクラスを拡張する

JavaScriptクラスは、まるでKotlinクラスであるかのように簡単に拡張できます。`external open`クラスを定義し、それを非`external`クラスで拡張するだけです。例:

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

いくつかの制限があります。

- 外部基底クラスの関数がシグネチャによってオーバーロードされている場合、派生クラスでそれをオーバーライドすることはできません。
- デフォルト引数を持つ関数をオーバーライドすることはできません。
- 非`external`クラスは`external`クラスによって拡張できません。

### 外部インターフェース

JavaScriptにはインターフェースの概念がありません。関数がパラメータとして2つのメソッド`foo`と`bar`をサポートすることを期待する場合、これらのメソッドを実際に持つオブジェクトを渡すだけです。

静的型付けされたKotlinでは、この概念を表現するためにインターフェースを使用できます。

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

外部インターフェースの典型的なユースケースは、設定オブジェクトを記述することです。例:

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) -> Unit

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
        complete = { (xhr, data) ->
            window.alert("Request complete")
        }
    })
}
```

外部インターフェースにはいくつかの制限があります。

- `is`チェックの右辺で使用することはできません。
- reified型引数として渡すことはできません。
- クラスリテラル式（`I::class`など）で使用することはできません。
- 外部インターフェースへの`as`キャストは常に成功します。
    外部インターフェースへのキャストは、「Unchecked cast to external interface」というコンパイル時警告を生成します。この警告は、`@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")`アノテーションで抑制できます。

    IntelliJ IDEAも自動的に`@Suppress`アノテーションを生成できます。電球アイコンまたはAlt-Enterでインテンションメニューを開き、「Unchecked cast to external interface」インスペクションの横にある小さな矢印をクリックします。ここで抑制範囲を選択でき、IDEがそれに応じてファイルにアノテーションを追加します。

### キャスト

キャストが不可能な場合に`ClassCastException`をスローする["unsafe"キャスト演算子](typecasts.md#unsafe-cast-operator)`as`に加えて、Kotlin/JSは[`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)も提供します。`unsafeCast`を使用する場合、実行時の型チェックはまったく行われません。例として、次の2つのメソッドを考えてみましょう。

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

これらは次のようにコンパイルされます。

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

Kotlin/JSは、他のプラットフォームと比較して、等価性チェックに関して特定のセマンティクスを持ちます。

Kotlin/JSでは、Kotlinの[参照等価性](equality.md#referential-equality)演算子（`===`）は常にJavaScriptの[厳密等価性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)演算子（`===`）に変換されます。

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

また、Kotlin/JSでは、[`Byte`、`Short`、`Int`、`Float`、および`Double`](js-to-kotlin-interop.md#kotlin-types-in-javascript)の数値型はすべて実行時に`Number` JavaScript型で表現されます。そのため、これら5つの型の値は区別できません。

 ```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // Prints 'true' on Kotlin/JS
    // Prints 'false' on other platforms
}
 ```

> Kotlinにおける等価性の詳細については、[Equality](equality.md)ドキュメントを参照してください。
> 
{style="tip"}