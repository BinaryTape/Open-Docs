[//]: # (title: 分解宣言)

オブジェクトを複数の変数に*分解する*ことが便利な場合があります。例を示します。

```kotlin
val (name, age) = person
```

この構文は*分解宣言*と呼ばれます。分解宣言は、一度に複数の変数を生成します。
新しい変数 `name` と `age` の2つを宣言し、これらを独立して使用できます。

 ```kotlin
println(name)
println(age)
```

分解宣言は、以下のコードにコンパイルされます。

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` および `component2()` 関数は、Kotlinで広く利用されている*規約の原則*のもう一つの例です（`+` や `*` のような演算子、`for` ループなどを参照してください）。
分解宣言の右辺には、必要な数の `component` 関数が呼び出せる限り、どのようなものでも配置できます。もちろん、`component3()`、`component4()` なども存在します。

> `componentN()` 関数は、分解宣言で利用できるように `operator` キーワードでマークする必要があります。
>
{style="note"}

分解宣言は `for` ループでも機能します。

```kotlin
for ((a, b) in collection) { ... }
```

変数 `a` と `b` には、コレクションの要素に対して呼び出された `component1()` と `component2()` が返す値が代入されます。

## 例: 関数から2つの値を返す

関数から2つのものを返す必要があるとします。例えば、結果オブジェクトと何らかのステータスです。
Kotlinでこれを行う簡潔な方法は、[データクラス](data-classes.md)を宣言し、そのインスタンスを返すことです。

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

データクラスは自動的に `componentN()` 関数を宣言するため、分解宣言がここで機能します。

> 標準クラスの `Pair` を使用して `function()` が `Pair<Int, Status>` を返すようにすることもできますが、多くの場合、データを適切に命名する方が優れています。
>
{style="note"}

## 例: 分解宣言とマップ

マップを走査する最も良い方法は、おそらく次のとおりです。

```kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

これを機能させるには、以下が必要です。

*   `iterator()` 関数を提供することで、マップを値のシーケンスとして提示します。
*   `component1()` および `component2()` 関数を提供することで、各要素をペアとして提示します。
  
実際、標準ライブラリはこのような拡張機能を提供しています。

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

そのため、マップを扱う `for` ループ（データクラスのインスタンスのコレクションなどと同様に）で分解宣言を自由に使用できます。

## 未使用変数にアンダースコアを使用する

分解宣言で変数が必要ない場合は、その名前の代わりにアンダースコアを配置できます。

```kotlin
val (_, status) = getResult()
```

このようにスキップされたコンポーネントに対しては、`componentN()` 演算子関数は呼び出されません。

## ラムダにおける分解

ラムダのパラメータに分解宣言の構文を使用できます。
ラムダが `Pair` 型（または `Map.Entry`、あるいは適切な `componentN` 関数を持つその他の型）のパラメータを持つ場合、単一のパラメータの代わりに括弧で囲むことで複数の新しいパラメータを導入できます。

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

2つのパラメータを宣言する場合と、パラメータの代わりに分解ペアを宣言する場合の違いに注意してください。

```kotlin
{ a -> ... } // one parameter
{ a, b -> ... } // two parameters
{ (a, b) -> ... } // a destructured pair
{ (a, b), c -> ... } // a destructured pair and another parameter
```

分解されたパラメータのコンポーネントが未使用の場合、名前を考案するのを避けるためにアンダースコアに置き換えることができます。

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

分解されたパラメータ全体、または特定のコンポーネントごとに型を指定できます。

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }