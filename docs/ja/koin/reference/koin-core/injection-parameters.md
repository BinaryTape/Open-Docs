---
title: パラメータの渡し方 - インジェクションパラメータ
---

どのような定義においても、インジェクションパラメータ（定義によって注入され、使用されるパラメータ）を使用できます。

## 注入する値の渡し方

定義に対して、以下のようにパラメータを渡すことができます：

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

パラメータは `parametersOf()` 関数（各値をカンマで区切る）を使用して定義に送られます：

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // これを View の値として注入する
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## 「インジェクションパラメータ」の定義

以下はインジェクションパラメータの例です。`Presenter` クラスを構築するために `view` パラメータが必要であると仮定します。`params` 関数の引数を使用して、注入されたパラメータを取得します：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

また、分割代入（destructured declaration）を使用して、パラメータオブジェクトから直接インジェクションパラメータを記述することもできます：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
 「分割代入」による宣言は便利で読みやすいですが、型安全ではありません。複数の値がある場合、渡された型の順序が正しいかどうかを Kotlin は検出できません。
:::

## インジェクションパラメータを順序で解決する

パラメータを解決するために `get()` を使用する代わりに、同じ型のパラメータが複数ある場合は、以下のようにインデックス `get(index)`（`[ ]` 演算子と同じ）を使用できます：

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0], p[1]) }
}
```

## グラフからインジェクションパラメータを解決する

Koin のグラフ解決（すべての定義を解決するためのメインツリー）でも、インジェクションパラメータを見つけることができます。通常通り `get()` 関数を使用するだけです：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## インジェクションパラメータ：インデックス値またはセット (`3.4.3`)

`parametersOf` に加えて、以下の API が利用可能です：

- `parameterArrayOf`: 値の配列を使用します。データはそのインデックスによって使用されます。

```kotlin
val params = parameterArrayOf(1, 2, 3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`: 異なる種類の値のセットを使用します。値を順番に取り出すためにインデックスは使用しません。

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

デフォルトの関数 `parametersOf` は、インデックスと値のセットの両方で動作します：

```kotlin
val params = parametersOf(1, 2, "a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
  `parametersOf` または `parameterArrayOf` を使用して、インデックスに基づいて値を消費するようにパラメータ注入を「カスケード（連鎖）」させることができます。あるいは、`parametersOf` または `parameterSetOf` を使用して、解決する型に基づいてカスケードさせることもできます。
:::