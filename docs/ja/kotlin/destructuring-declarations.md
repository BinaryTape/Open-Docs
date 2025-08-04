[//]: # (title: 分解宣言)

オブジェクトを複数の変数に*分解する*と便利な場合があります。たとえば、次のように使用します。

```kotlin
val (name, age) = person 
```

この構文は*分解宣言*と呼ばれます。分解宣言は、複数の変数を一度に作成します。
`name` と `age` という2つの新しい変数を宣言し、それらを個別に利用できます。

 ```kotlin
println(name)
println(age)
```

分解宣言は、以下のコードにコンパイルされます。

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` および `component2()` 関数は、Kotlinで広く使用されている*規約の原則*のもう一つの例です（`+` や `*` のような演算子や `for` ループを例として参照してください）。
分解宣言の右辺には、必要な数のコンポーネント関数を呼び出せる限り、どのようなものでも配置できます。もちろん、`component3()` や `component4()` なども存在します。

> `componentN()` 関数は、分解宣言で利用できるようにするために、`operator` キーワードでマークされている必要があります。
>
{style="note"}

分解宣言は `for` ループでも機能します。

```kotlin
for ((a, b) in collection) { ... }
```

変数 `a` と `b` は、コレクションの要素に対して呼び出される `component1()` と `component2()` によって返される値を取得します。

## 例: 関数から2つの値を返す

関数から2つのものを返す必要があると仮定します。たとえば、結果オブジェクトと何らかのステータスです。
Kotlinでこれをコンパクトに行う方法は、[データクラス](data-classes.md)を宣言してそのインスタンスを返すことです。

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

データクラスは `componentN()` 関数を自動的に宣言するため、ここでも分解宣言が機能します。

> 標準クラス `Pair` を使用して `function()` が `Pair<Int, Status>` を返すようにすることもできますが、データを適切に命名する方が多くの場合優れています。
>
{style="note"}

## 例: 分解宣言とマップ

マップを走査するおそらく最も素晴らしい方法は次のとおりです。

```kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

これを機能させるには、

*   `iterator()` 関数を提供することで、マップを値のシーケンスとして提供する。
*   `component1()` および `component2()` 関数を提供することで、各要素をペアとして提供する。

そして実際、標準ライブラリはそのような拡張機能を提供します。

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

そのため、`for` ループでマップ（データクラスのインスタンスのコレクションなど）と共に分解宣言を自由に利用できます。

## 未使用変数用のアンダースコア

分解宣言で変数が必要ない場合は、その名前の代わりにアンダースコアを配置できます。

```kotlin
val (_, status) = getResult()
```

この方法でスキップされたコンポーネントに対しては、`componentN()` 演算子関数は呼び出されません。

## ラムダにおける分解

ラムダのパラメータに分解宣言の構文を使用できます。
ラムダが `Pair` 型（または `Map.Entry`、あるいは適切な `componentN` 関数を持つ他の型）のパラメータを持つ場合、1つのパラメータの代わりに、それらを括弧で囲むことで複数の新しいパラメータを導入できます。

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

2つのパラメータを宣言することと、パラメータの代わりに分解ペアを宣言することの違いに注意してください。

```kotlin
{ a -> ... } // one parameter
{ a, b -> ... } // two parameters
{ (a, b) -> ... } // a destructured pair
{ (a, b), c -> ... } // a destructured pair and another parameter
```

分解されたパラメータのコンポーネントが未使用の場合、その名前を考案するのを避けるためにアンダースコアに置き換えることができます。

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

分解されたパラメータ全体、または特定のコンポーネントに個別に型を指定できます。

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```