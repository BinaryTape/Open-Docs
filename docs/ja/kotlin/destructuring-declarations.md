---
title: 分解宣言
---
時には、オブジェクトを複数の変数に*分解*すると便利な場合があります。例：

```kotlin
val (name, age) = person 
```

この構文は*構造分解宣言*と呼ばれます。構造分解宣言は、複数の変数を一度に作成します。
`name`と`age`の2つの新しい変数を宣言し、それらを個別に使用できます。

 ```kotlin
println(name)
println(age)
```

構造分解宣言は、次のコードにコンパイルされます。

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()`関数と`component2()`関数は、Kotlinで広く使用されている*規約の原則*のもう1つの例です
（例として、`+`や`*`のような演算子、`for`-loopsを参照）。
必要な数のcomponent関数を呼び出すことができる限り、構造分解宣言の右側に何でも記述できます。
もちろん、`component3()`や`component4()`なども存在できます。

:::note
構造分解宣言で使用するには、`componentN()`関数に`operator`キーワードでマークを付ける必要があります。

:::

構造分解宣言は、`for`-loopsでも機能します。

```kotlin
for ((a, b) in collection) { ... }
```

変数`a`と`b`は、コレクションの要素で呼び出された`component1()`と`component2()`によって返される値を取得します。

## 例：関数から2つの値を返す

関数から2つのもの（たとえば、結果オブジェクトと何らかのステータス）を返す必要があるとします。
Kotlinでこれを行う簡単な方法は、[データクラス](data-classes)を宣言し、そのインスタンスを返すことです。

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

データクラスは自動的に`componentN()`関数を宣言するため、構造分解宣言はここで機能します。

:::note
標準クラス`Pair`を使用し、`function()`に`Pair<Int, Status>`を返すこともできますが、
多くの場合、データに適切な名前を付ける方が適切です。

:::

## 例：構造分解宣言とマップ

マップを走査する最も簡単な方法は、おそらく次のとおりです。

```kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

これを機能させるには、以下を行う必要があります。

* `iterator()`関数を提供して、マップを値のシーケンスとして表示します。
* 関数`component1()`と`component2()`を提供して、各要素をペアとして表示します。
  
そして実際、標準ライブラリはこのような拡張機能を提供します。

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

したがって、マップ（およびデータクラスインスタンスなどのコレクション）を使用して、`for`-loopsで構造分解宣言を自由に使用できます。

## 未使用の変数にはアンダースコア

構造分解宣言で変数が必要ない場合は、名前の代わりにアンダースコアを配置できます。

```kotlin
val (_, status) = getResult()
```

この方法でスキップされたコンポーネントに対して、`componentN()` operator関数は呼び出されません。

## ラムダでの構造分解

ラムダパラメータに構造分解宣言構文を使用できます。
ラムダに`Pair`型（または`Map.Entry`、または適切な`componentN`を持つその他の型）のパラメータがある場合
関数）、括弧で囲むことにより、1つの代わりにいくつかの新しいパラメータを導入できます。

```kotlin
map.mapValues { entry `->` "${entry.value}!" }
map.mapValues { (key, value) `->` "$value!" }
```

2つのパラメータを宣言することと、パラメータの代わりに構造分解ペアを宣言することの違いに注意してください。

```kotlin
{ a `->` ... } // one parameter
{ a, b `->` ... } // two parameters
{ (a, b) `->` ... } // a destructured pair
{ (a, b), c `->` ... } // a destructured pair and another parameter
```

構造分解されたパラメータのコンポーネントが未使用の場合、名前を発明しないようにアンダースコアに置き換えることができます。

```kotlin
map.mapValues { (_, value) `->` "$value!" }
```

構造分解されたパラメータ全体の型、または特定のコンポーネントの型を個別に指定できます。

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> `->` "$value!" }

map.mapValues { (_, value: String) `->` "$value!" }
```