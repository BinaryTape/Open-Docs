---
title: "Passing Parameters - Injected Parameters (注入されたパラメータ)"
---
定義では、インジェクションパラメータ（定義によってインジェクトされ、使用されるパラメータ）を使用できます。

## インジェクトする値の渡し方

定義が与えられたとき、その定義にパラメータを渡すことができます。

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

パラメータは、`parametersOf()` 関数を使って定義に送られます（各値はカンマで区切られます）。

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // inject this as View value
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## "インジェクトされたパラメータ" の定義

以下は、インジェクションパラメータの例です。`Presenter` クラスを構築するには `view` パラメータが必要であることを確立しました。インジェクトされたパラメータを取得するために、`params` 関数引数を使用します。

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

また、パラメータオブジェクトで直接、分割代入としてインジェクトされたパラメータを記述することもできます。

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
 "分割された" 宣言の方が便利で読みやすいですが、型安全ではありません。複数の値がある場合、渡された型が良い順序であるかどうかを Kotlin は検出しません。
:::

## インジェクトされたパラメータを順番に解決する

パラメータを解決するために `get()` を使用する代わりに、同じ型のパラメータが複数ある場合は、インデックスを次のように使用できます `get(index)` ( `[ ]` 演算子と同じです)。

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## グラフからインジェクトされたパラメータを解決する

Koin グラフ解決（すべての定義の解決のメインツリー）では、インジェクトされたパラメータを見つけることもできます。通常の `get()` 関数を使用するだけです。

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## インジェクトされたパラメータ：インデックス付きの値またはセット (`3.4.3`)

`parametersOf` に加えて、次の API にアクセスできます。

- `parameterArrayOf`: 値の配列を使用するために、データはそのインデックスによって使用されます。

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`: さまざまな種類の値のセットを使用するために。値をスクロールするためにインデックスを使用しません。

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

デフォルト関数 `parametersOf` は、インデックスと値のセットの両方で動作します。

```kotlin
val params = parametersOf(1,2,"a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
  `parametersOf` または `parameterArrayOf` を使用してパラメータインジェクションを "カスケード" して、インデックスに基づいて値を消費できます。または、`parametersOf` または `parameterSetOf` を使用して、解決するための型に基づいてカスケードすることもできます。 
:::