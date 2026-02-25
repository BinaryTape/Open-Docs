[//]: # (title: dynamic型)

> dynamic型は、JVMをターゲットとするコードではサポートされていません。
>
{style="note"}

Kotlinは静的型付け言語ですが、JavaScriptのエコシステムのような、型のない、あるいは型付けの緩い環境と相互運用する必要があります。これらのユースケースを容易にするために、言語内で `dynamic` 型が利用可能です。

```kotlin
val dyn: dynamic = ...
```

`dynamic` 型は基本的にKotlinの型チェッカーをオフにします。

- `dynamic` 型の値は、任意の変数に代入したり、パラメーターとしてどこにでも渡したりすることができます。
- 任意の値を `dynamic` 型の変数に代入したり、`dynamic` をパラメーターとして受け取る関数に渡したりすることができます。
- `dynamic` 型の値に対しては、`null` チェックが無効になります。

`dynamic` の最も特徴的な機能は、`dynamic` 変数に対して、任意のパラメーターで**あらゆる**プロパティや関数を呼び出すことができる点です。

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' はどこにも定義されていません
dyn.whatever(*arrayOf(1, 2, 3))
```

JavaScriptプラットフォームでは、このコードは「そのまま」コンパイルされます。Kotlinの `dyn.whatever(1)` は、生成されたJavaScriptコード内でも `dyn.whatever(1)` になります。

`dynamic` 型の値に対してKotlinで記述された関数を呼び出す場合は、KotlinからJavaScriptへのコンパイラによって行われる名前マングリング（name mangling）に注意してください。呼び出す必要がある関数に対して、明確に定義された名前を割り当てるために、[@JsNameアノテーション](js-to-kotlin-interop.md#jsname-annotation)を使用する必要があるかもしれません。

動的な呼び出しは常に結果として `dynamic` を返すため、そのような呼び出しを自由に連鎖させることができます。

```kotlin
dyn.foo().bar.baz()
```

動的な呼び出しにラムダを渡す場合、そのすべてのパラメーターはデフォルトで `dynamic` 型になります。

```kotlin
dyn.foo {
    x -> x.bar() // x は dynamic です
}
```

`dynamic` 型の値を使用した式は、JavaScriptへ「そのまま」変換され、Kotlinの演算子の慣習（operator conventions）は使用されません。以下の演算子がサポートされています。

* 2項演算子（binary）: `+`, `-`, `*`, `/`, `%`, `>`, `<` `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
* 単項演算子（unary）
    * 前置: `-`, `+`, `!`
    * 前置および後置: `++`, `--`
* 代入演算子（assignments）: `+=`, `-=`, `*=`, `/=`, `%=`
* 添字アクセス（indexed access）:
    * 読み取り: `d[a]`、2つ以上の引数はエラー
    * 書き込み: `d[a1] = a2`、`[]` 内に2つ以上の引数がある場合はエラー

`dynamic` 型の値を使用した `in`、`!in`、および `..` 操作は禁止されています。

より技術的な説明については、[仕様書（spec document）](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)を参照してください。