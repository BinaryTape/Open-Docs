[//]: # (title: ダイナミック型)

> JVMをターゲットとするコードでは、ダイナミック型はサポートされていません。
>
{style="note"}

Kotlinは静的型付け言語ですが、JavaScriptエコシステムのような、型付けされていない、または緩く型付けされた環境との相互運用が必要になることがあります。これらのユースケースを容易にするため、`dynamic`型が言語に用意されています。

```kotlin
val dyn: dynamic = ...
```

`dynamic`型は基本的にKotlinの型チェッカーを無効にします。

- `dynamic`型の値は、任意の変数に代入したり、どこへでもパラメータとして渡したりできます。
- 任意の値は、`dynamic`型の変数に代入したり、`dynamic`をパラメータとして取る関数に渡したりできます。
- `dynamic`型の値に対する`null`チェックは無効になります。

`dynamic`の最も特異な機能は、**任意の**プロパティや関数を任意のパラメータで`dynamic`変数に対して呼び出すことができる点です。

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*arrayOf(1, 2, 3))
```

JavaScriptプラットフォームでは、このコードは「そのまま」コンパイルされます。Kotlinの`dyn.whatever(1)`は、生成されたJavaScriptコードでは`dyn.whatever(1)`になります。

`dynamic`型の値に対してKotlinで書かれた関数を呼び出す際には、KotlinからJavaScriptへのコンパイラによって実行される名前マングリングに留意してください。呼び出す必要がある関数に明確に定義された名前を割り当てるために、[@JsNameアノテーション](js-to-kotlin-interop.md#jsname-annotation)を使用する必要があるかもしれません。

ダイナミックな呼び出しは常に結果として`dynamic`を返すため、このような呼び出しを自由に連鎖させることができます。

```kotlin
dyn.foo().bar.baz()
```

ラムダをダイナミックな呼び出しに渡すと、そのすべてのパラメータはデフォルトで`dynamic`型になります。

```kotlin
dyn.foo {
    x -> x.bar() // x is dynamic
}
```

`dynamic`型の値を使用する式はJavaScriptに「そのまま」変換され、Kotlinの演算子規則を使用しません。以下の演算子がサポートされています。

*   二項: `+`, `-`, `*`, `/`, `%`, `>`, `<`, `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
*   単項
    *   前置: `-`, `+`, `!`
    *   前置および後置: `++`, `--`
*   代入: `+=`, `-=`, `*=`, `/=`, `%=`
*   インデックスアクセス:
    *   読み取り: `d[a]`、複数の引数はエラー
    *   書き込み: `d[a1] = a2`、`[]`内に複数の引数があるとエラー

`dynamic`型の値に対する`in`、`!in`、および`..`演算は禁止されています。

より技術的な説明については、[仕様ドキュメント](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)を参照してください。