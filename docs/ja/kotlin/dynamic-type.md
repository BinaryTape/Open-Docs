---
title: 動的型付け
---
:::note
dynamic型は、JVMをターゲットとするコードではサポートされていません。

:::

Kotlinは静的に型付けされた言語ですが、JavaScriptのエコシステムのような、型付けされていない、または緩やかに型付けされた環境と相互運用する必要があります。これらのユースケースを容易にするために、`dynamic`型が言語で利用可能です。

```kotlin
val dyn: dynamic = ...
```

`dynamic`型は基本的にKotlinの型チェッカーをオフにします。

- `dynamic`型の値は、任意の変数に代入したり、パラメータとしてどこにでも渡したりできます。
- 任意の値は、`dynamic`型の変数に代入したり、`dynamic`をパラメータとして取る関数に渡したりできます。
- `null`チェックは`dynamic`型の値に対して無効になります。

`dynamic`の最も特徴的な機能は、`dynamic`変数に対して**任意の**プロパティまたは関数を任意のパラメータで呼び出すことができることです。

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' はどこにも定義されていません
dyn.whatever(*arrayOf(1, 2, 3))
```

JavaScriptプラットフォームでは、このコードは「そのまま」コンパイルされます。Kotlinの`dyn.whatever(1)`は、生成されたJavaScriptコードでは`dyn.whatever(1)`になります。

Kotlinで記述された関数を`dynamic`型の値で呼び出す場合は、KotlinからJavaScriptコンパイラによって実行される名前マングリングに注意してください。呼び出す必要のある関数に明確に定義された名前を割り当てるには、[@JsName annotation](js-to-kotlin-interop#jsname-annotation)を使用する必要がある場合があります。

dynamic呼び出しは常に`dynamic`を結果として返すため、そのような呼び出しを自由にチェーンできます。

```kotlin
dyn.foo().bar.baz()
```

ラムダをdynamic呼び出しに渡すと、そのパラメータはデフォルトですべて`dynamic`型になります。

```kotlin
dyn.foo {
    x `->` x.bar() // x は dynamic
}
```

`dynamic`型の値を使用する式は、JavaScriptに「そのまま」変換され、Kotlinの演算子の規則を使用しません。
次の演算子がサポートされています。

* 二項演算子: `+`, `-`, `*`, `/`, `%`, `>`, `<`, `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
* 単項演算子
    * 前置: `-`, `+`, `!`
    * 前置および後置: `++`, `--`
* 代入演算子: `+=`, `-=`, `*=`, `/=`, `%=`
* インデックスアクセス:
    * 読み取り: `d[a]`、複数の引数はエラーです
    * 書き込み: `d[a1] = a2`、`[]`内の複数の引数はエラーです

`dynamic`型の値を持つ`in`、`!in`、および`..`演算は禁止されています。

より技術的な説明については、[spec document](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types)を参照してください。