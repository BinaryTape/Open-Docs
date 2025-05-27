---
title: パラメータを渡す - インジェクトされたパラメータ
---

任意の定義で、インジェクトされたパラメータ（あなたの定義によってインジェクトされ、使用されるパラメータ）を使用できます。

## インジェクトする値を渡す

定義が与えられた場合、その定義にパラメータを渡すことができます。

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

パラメータは、`parametersOf()` 関数（各値はカンマで区切られます）を使ってあなたの定義に送信されます。

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // inject this as View value
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## 「インジェクトされたパラメータ」を定義する

以下はインジェクションパラメータの例です。`Presenter`クラスを構築するには`view`パラメータが必要であることを示します。インジェクトされたパラメータを取得するために、`params`関数引数を使用します。

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

また、分解宣言として、パラメータオブジェクトでインジェクトされたパラメータを直接書くこともできます。

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
「分解」宣言はより便利で読みやすいですが、型安全ではありません。複数の値がある場合、渡された型が正しい順序であるとKotlinは検出しません。
:::

## インジェクトされたパラメータを順序で解決する

パラメータを解決するために`get()`を使用する代わりに、同じ型のパラメータが複数ある場合、`get(index)`のようにインデックスを使用できます（`[ ]`演算子と同じです）。

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## グラフからインジェクトされたパラメータを解決する

Koinグラフ解決（すべての定義の解決の主要なツリー）は、インジェクトされたパラメータを見つけることもできます。通常の`get()`関数を使用するだけです。

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## インジェクトされたパラメータ: インデックス付きの値またはセット（`3.4.3`）

`parametersOf`に加えて、以下のAPIが利用可能です。

- `parameterArrayOf`: 値の配列を使用し、データはそのインデックスによって使用されます

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`: 異なる種類の値のセットを使用します。値を順に取得するためにインデックスは使用しません。

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

デフォルトの関数`parametersOf`は、インデックスと値のセットの両方で機能します。

```kotlin
val params = parametersOf(1,2,"a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
`parametersOf`または`parameterArrayOf`を使用して、インデックスに基づいて値を消費するようにパラメータインジェクションを「カスケード」できます。または、型に基づいて解決するために`parametersOf`または`parameterSetOf`をカスケードに使用できます。
:::