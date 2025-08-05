[//]: # (title: KotlinからJavaScriptコードを使用する)

Kotlinは当初、Javaプラットフォームとの簡単な相互運用性のために設計されました。KotlinはJavaクラスをKotlinクラスとして認識し、
JavaはKotlinクラスをJavaクラスとして認識します。

しかし、JavaScriptは動的型付け言語であり、コンパイル時に型チェックを行いません。Kotlinからは、[dynamic](dynamic-type.md)型を介してJavaScriptと自由に
対話できます。Kotlinの型システムの力を最大限に活用したい場合は、Kotlinコンパイラと
関連ツール群が理解できるJavaScriptライブラリの外部宣言を作成できます。

## インラインJavaScript

[`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html)関数を使用して、JavaScriptコードをKotlinコードにインライン化できます。
例：

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

`js`のパラメーターはコンパイル時に解析され、JavaScriptコードに「そのまま」変換されるため、
文字列定数である必要があります。したがって、以下のコードは不正です。

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}

fun getTypeof() = "typeof"
```

> JavaScriptコードはKotlinコンパイラによって解析されるため、すべてのECMAScript機能がサポートされているわけではありません。
> この場合、コンパイルエラーが発生する可能性があります。
> 
{style="note"}

`js()`の呼び出しは[`dynamic`](dynamic-type.md)型の結果を返しますが、これはコンパイル時に型安全性を提供しないことに注意してください。

## `external`修飾子

ある宣言が純粋なJavaScriptで書かれていることをKotlinに伝えるには、`external`修飾子でマークする必要があります。
コンパイラがこのような宣言を認識すると、対応するクラス、関数、または
プロパティの実装が外部（開発者または[npm依存関係](js-project-setup.md#npm-dependencies)を介して）から提供されると仮定するため、
その宣言からJavaScriptコードを生成しようとしません。これが、`external`宣言が
本体を持つことができない理由でもあります。例：

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

`external`修飾子はネストされた宣言によって継承されることに注意してください。このため、`Node`クラスの例では、メンバー関数やプロパティの前に
`external`修飾子はありません。

`external`修飾子はパッケージレベルの宣言でのみ許可されます。非`external`クラスの`external`メンバーを宣言することはできません。

### クラスの（静的）メンバーの宣言

JavaScriptでは、メンバーをプロトタイプまたはクラス自体で定義できます。

``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

Kotlinにはそのような構文はありません。しかし、Kotlinには[`companion`](object-declarations.md#companion-objects)オブジェクトがあります。
Kotlinは`external`クラスのコンパニオンオブジェクトを特別な方法で扱います。オブジェクトを期待する代わりに、
コンパニオンオブジェクトのメンバーがクラス自体のメンバーであると仮定します。上記の例の`MyClass`は、次のように記述できます。

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### デフォルト値を持つパラメーターの宣言

デフォルト値を持つパラメーターを持つJavaScript関数の外部宣言を記述する場合は、`definedExternally`を使用します。
これにより、デフォルト値の生成はJavaScript関数自体に委譲されます。

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

この外部宣言を使用すると、`myFunWithOptionalArgs`を1つの必須引数と2つのオプション引数で呼び出すことができ、
デフォルト値は`myFunWithOptionalArgs`のJavaScript実装によって計算されます。

### JavaScriptクラスの拡張

JavaScriptクラスは、まるでKotlinクラスであるかのように簡単に拡張できます。`external open`クラスを定義し、
それを非`external`クラスで拡張するだけです。例：

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

- 外部基底クラスの関数がシグネチャでオーバーロードされている場合、派生クラスでそれをオーバーライドすることはできません。
- デフォルト値を持つパラメーターを含む関数をオーバーライドすることはできません。
- 非外部クラスを外部クラスで拡張することはできません。

### 外部インターフェース

JavaScriptにはインターフェースの概念がありません。関数がパラメーターに`foo`と`bar`の2つのメソッドをサポートすることを期待する場合、
それらのメソッドを実際に持つオブジェクトを渡すだけです。

Kotlinの静的型付けでは、インターフェースを使用してこの概念を表現できます。

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

外部インターフェースの典型的なユースケースは、設定オブジェクトの記述です。例：

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
- クラスリテラル式（例: `I::class`）で使用することはできません。
- 外部インターフェースへの`as`キャストは常に成功します。
    外部インターフェースへのキャストは、「Unchecked cast to external interface (外部インターフェースへの非チェックキャスト)」というコンパイル時警告を生成します。この警告は、`@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")`アノテーションで抑制できます。

    IntelliJ IDEAは、`@Suppress`アノテーションを自動的に生成することもできます。電球アイコンまたはAlt-Enterキーを使用してインテンションメニューを開き、「Unchecked cast to external interface」インスペクションの横にある小さな矢印をクリックします。ここで抑制スコープを選択すると、IDEがそれに応じてファイルにアノテーションを追加します。

### キャスト

キャストが不可能な場合に`ClassCastException`をスローする["unsafe"キャスト演算子](typecasts.md#unsafe-cast-operator) `as`に加えて、
Kotlin/JSは[`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)も提供します。`unsafeCast`を使用する場合、
実行時には_一切型チェックは行われません_。例として、次の2つのメソッドを考えてみましょう。

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

それらは、それに応じてコンパイルされます。

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

Kotlin/JSには、他のプラットフォームと比較して、等価性チェックに特定のセマンティクスがあります。

Kotlin/JSでは、Kotlinの[参照等価性](equality.md#referential-equality)演算子（`===`）は常にJavaScriptの
[厳密等価性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)演算子（`===`）に変換されます。

JavaScriptの`===`演算子は、2つの値が等しいだけでなく、
それらの2つの値の型も等しいことをチェックします。

 ```kotlin
fun main() {
    val name = "kotlin"
    val value1 = name.substring(0, 1)
    val value2 = name.substring(0, 1)

    println(if (value1 === value2) "yes" else "no")
    // Kotlin/JSでは'yes'を出力
    // 他のプラットフォームでは'no'を出力
}
 ```

また、Kotlin/JSでは、[`Byte`、`Short`、`Int`、`Float`、および`Double`](js-to-kotlin-interop.md#kotlin-types-in-javascript)の数値型は
すべて実行時に`Number` JavaScript型で表現されます。したがって、これら5つの型の値は区別できません。

 ```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // Kotlin/JSでは'true'を出力
    // 他のプラットフォームでは'false'を出力
}
 ```

> Kotlinにおける等価性の詳細については、[等価性](equality.md)ドキュメントを参照してください。
> 
{style="tip"}