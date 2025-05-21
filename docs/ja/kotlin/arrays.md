---
title: 配列
---
配列とは、同じ型またはそのサブタイプの値を固定数保持するデータ構造です。
Kotlin で最も一般的な配列の型はオブジェクト型配列で、[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) クラスで表されます。

:::note
オブジェクト型配列でプリミティブを使用すると、プリミティブがオブジェクトに[ボックス化](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)されるため、パフォーマンスに影響があります。ボックス化のオーバーヘッドを避けるには、代わりに[プリミティブ型配列](#primitive-type-arrays)を使用してください。

:::

## 配列を使用する場合

Kotlin で配列を使用するのは、満たす必要のある特殊な低レベルの要件がある場合です。たとえば、通常のアプリケーションに必要なレベルを超えるパフォーマンス要件がある場合や、カスタムデータ構造を構築する必要がある場合などです。このような制約がない場合は、代わりに[コレクション](collections-overview)を使用してください。

コレクションには、配列と比較して次の利点があります。
* コレクションは読み取り専用にすることができ、より多くの制御が可能になり、意図が明確な堅牢なコードを作成できます。
* コレクションに対する要素の追加や削除は簡単です。これに対し、配列のサイズは固定です。配列に対して要素を追加または削除する唯一の方法は、毎回新しい配列を作成することであり、これは非常に非効率的です。

  ```kotlin
  fun main() {

      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // += 代入演算子を使用すると、新しい riversArray が作成され、
      // 元の要素がコピーされ、"Mississippi" が追加されます
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // Nile, Amazon, Yangtze, Mississippi

  }
  ```
  

* 等価演算子 (`==`) を使用して、コレクションが構造的に等しいかどうかを確認できます。この演算子は配列には使用できません。代わりに、特別な関数を使用する必要があります。詳細については、[配列の比較](#compare-arrays)を参照してください。

コレクションの詳細については、[コレクションの概要](collections-overview)を参照してください。

## 配列の作成

Kotlin で配列を作成するには、次のものを使用できます。
* [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html)、[`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int))、[`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) などの関数。
* `Array` コンストラクター。

この例では、[`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 関数を使用し、項目の値を渡します。

```kotlin
fun main() {

    // 値 [1, 2, 3] を持つ配列を作成します
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 1, 2, 3

}
```

この例では、[`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 関数を使用して、指定されたサイズの配列を作成し、`null` 要素を格納します。

```kotlin
fun main() {

    // 値 [null, null, null] を持つ配列を作成します
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // null, null, null

}
```

この例では、[`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 関数を使用して空の配列を作成します。

```kotlin
    var exampleArray = emptyArray<String>()
```

:::note
Kotlin の型推論により、代入の左側または右側で空の配列の型を指定できます。

次に例を示します。
```Kotlin
var exampleArray = emptyArray<String>()

var exampleArray: Array<String> = emptyArray()
```

:::

`Array` コンストラクターは、配列のサイズと、配列要素のインデックスを指定して値を返す関数を受け取ります。

```kotlin
fun main() {

    // ゼロで初期化する Array<Int> を作成します [0, 0, 0]
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 0, 0, 0

    // 値 ["0", "1", "4", "9", "16"] を持つ Array<String> を作成します
    val asc = Array(5) { i `->` (i * i).toString() }
    asc.forEach { print(it) }
    // 014916

}
```

:::note
ほとんどのプログラミング言語と同様に、Kotlin ではインデックスは 0 から始まります。

:::

### ネストされた配列

配列は互いにネストして、多次元配列を作成できます。

```kotlin
fun main() {

    // 2 次元配列を作成します
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // [[0, 0], [0, 0]]

    // 3 次元配列を作成します
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]

}
```

:::note
ネストされた配列は、同じ型または同じサイズである必要はありません。

:::

## 要素へのアクセスと変更

配列は常に可変です。配列内の要素にアクセスして変更するには、[インデックス付きアクセス演算子](operator-overloading#indexed-access-operator)`[]` を使用します。

```kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // 要素にアクセスして変更します
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // 変更された要素を出力します
    println(simpleArray[0].toString()) // 10
    println(twoDArray[0][0].toString()) // 2

}
```

Kotlin の配列は _非変_ です。つまり、Kotlin では、ランタイムエラーの可能性を防ぐために、`Array<String>` を `Array<Any>` に割り当てることはできません。代わりに、`Array<out Any>` を使用できます。詳細については、[型プロジェクション](generics#type-projections)を参照してください。

## 配列の操作

Kotlin では、配列を使用して可変個数の引数を関数に渡したり、配列自体に対して操作を実行したりすることで、配列を操作できます。たとえば、配列の比較、コンテンツの変換、コレクションへの変換などです。

### 可変個数の引数を関数に渡す

Kotlin では、[`vararg`](functions#variable-number-of-arguments-varargs) パラメーターを使用して、可変個数の引数を関数に渡すことができます。これは、メッセージのフォーマットや SQL クエリの作成など、引数の数を事前に把握していない場合に役立ちます。

可変個数の引数を含む配列を関数に渡すには、_スプレッド_演算子 (`*`) を使用します。スプレッド演算子は、選択した関数に配列の各要素を個別の引数として渡します。

```kotlin
fun main() {
    val lettersArray = arrayOf("c", "d")
    printAllStrings("a", "b", *lettersArray)
    // abcd
}

fun printAllStrings(vararg strings: String) {
    for (string in strings) {
        print(string)
    }
}
```

詳細については、[可変個数の引数 (varargs)](functions#variable-number-of-arguments-varargs)を参照してください。

### 配列の比較

2 つの配列が同じ要素を同じ順序で持っているかどうかを比較するには、[`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html) および [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 関数を使用します。

```kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // 配列の内容を比較します
    println(simpleArray.contentEquals(anotherArray))
    // true

    // 中置記法を使用して、要素が変更された後で配列の内容を比較します
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // false

}
```

:::note
配列の内容を比較するために、等価 (`==`) および不等価 (`!=`) [演算子](equality#structural-equality)を使用しないでください。これらの演算子は、割り当てられた変数が同じオブジェクトを指しているかどうかを確認します。

Kotlin の配列がこのように動作する理由の詳細については、[ブログ投稿](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays)を参照してください。

### 配列の変換

Kotlin には、配列を変換するための便利な関数が多数用意されています。このドキュメントではいくつかの関数を紹介しますが、これがすべてではありません。関数の完全なリストについては、[API リファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/)を参照してください。

#### Sum

配列内のすべての要素の合計を返すには、[`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 関数を使用します。

```Kotlin
fun main() {

    val sumArray = arrayOf(1, 2, 3)

    // 配列要素の合計
    println(sumArray.sum())
    // 6

}
```

`.sum()` 関数は、`Int` などの[数値データ型](numbers)の配列でのみ使用できます。

:::

#### Shuffle

配列内の要素をランダムにシャッフルするには、[`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 関数を使用します。

```Kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)

    // 要素をシャッフルします [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // 要素を再度シャッフルします [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

}
```

### 配列をコレクションに変換する

さまざまな API を使用する場合、一部は配列を使用し、一部はコレクションを使用します。配列を[コレクション](collections-overview)に変換したり、その逆も可能です。

#### List または Set への変換

配列を `List` または `Set` に変換するには、[`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html) および [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 関数を使用します。

```kotlin
fun main() {

    val simpleArray = arrayOf("a", "b", "c", "c")

    // Set に変換します
    println(simpleArray.toSet())
    // [a, b, c]

    // List に変換します
    println(simpleArray.toList())
    // [a, b, c, c]

}
```

#### Map への変換

配列を `Map` に変換するには、[`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 関数を使用します。

[`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) の配列のみを `Map` に変換できます。`Pair` インスタンスの最初の値はキーになり、2 番目の値は値になります。この例では、[中置記法](functions#infix-notation)を使用して、[`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 関数を呼び出して `Pair` のタプルを作成します。

```kotlin
fun main() {

    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // Map に変換します
    // キーは果物で、値はそのカロリー数です
    // キーは一意である必要があるため、「apple」の最新の値は
    // 最初を上書きします
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}

}
```

## プリミティブ型配列

`Array` クラスをプリミティブ値で使用すると、これらの値はオブジェクトにボックス化されます。
別の方法として、プリミティブ型配列を使用できます。これにより、ボックス化のオーバーヘッドという副作用なしに、配列にプリミティブを格納できます。

| プリミティブ型配列 | Java での同等の型 |
|---|----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`|
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]`|
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]`|
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]`|
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]`|
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]`|
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]`|
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]`|

これらのクラスは `Array` クラスとの継承関係はありませんが、同じ関数とプロパティのセットを持っています。

この例では、`IntArray` クラスのインスタンスを作成します。

```kotlin
fun main() {

    // サイズ 5 の Int の配列を作成し、値をゼロに初期化します
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 0, 0, 0, 0, 0

}
```

:::note
プリミティブ型配列をオブジェクト型配列に変換するには、[`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html) 関数を使用します。

オブジェクト型配列をプリミティブ型配列に変換するには、[`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html)、[`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html)、[`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html) などを使用します。

:::

## 次のステップ

* ほとんどのユースケースでコレクションを使用することをお勧めする理由の詳細については、[コレクションの概要](collections-overview)を参照してください。
* その他の[基本型](basic-types)について学習します。
* Java 開発者の場合は、[コレクション](java-to-kotlin-collections-guide)に関する Java から Kotlin への移行ガイドをお読みください。