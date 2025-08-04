[//]: # (title: 配列)

配列とは、同じ型またはそのサブタイプの固定数の値を保持するデータ構造です。Kotlin で最も一般的な配列の型は、[`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) クラスで表現されるオブジェクト型配列です。

> オブジェクト型配列でプリミティブ（型）を使用すると、プリミティブがオブジェクトに[ボックス化](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)されるため、パフォーマンスに影響を与えます。ボックス化のオーバーヘッドを避けるには、代わりに[プリミティブ型配列](#primitive-type-arrays)を使用してください。
>
{style="note"}

## 配列を使う場面

Kotlin で配列を使用するのは、満たすべき特殊な低レベル要件がある場合です。例えば、通常のアプリケーションに求められる以上のパフォーマンス要件がある場合や、カスタムデータ構造を構築する必要がある場合などです。このような制限がない場合は、代わりに[コレクション](collections-overview.md)を使用してください。

コレクションには、配列と比較して以下の利点があります。
* コレクションは読み取り専用にすることができ、これにより、より多くの制御が可能になり、意図が明確で堅牢なコードを記述できます。
* コレクションの要素は簡単に追加または削除できます。比較して、配列はサイズが固定されています。配列から要素を追加または削除する唯一の方法は、その都度新しい配列を作成することであり、これは非常に非効率的です。

  ```kotlin
  fun main() {
  //sampleStart
      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // Using the += assignment operation creates a new riversArray,
      // copies over the original elements and adds "Mississippi"
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // Nile, Amazon, Yangtze, Mississippi
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-rivers-array-kotlin"}

* 等値演算子 (`==`) を使用して、コレクションが構造的に等しいかどうかをチェックできます。この演算子を配列に使うことはできません。代わりに、特別な関数を使用する必要があり、これについては「[配列の比較](#compare-arrays)」で詳しく読むことができます。

コレクションの詳細については、「[コレクションの概要](collections-overview.md)」を参照してください。

## 配列の作成

Kotlin で配列を作成するには、以下を使用できます。
* [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html)、[`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int))、[`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) などの関数。
* `Array` コンストラクター。

この例では、[`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 関数を使用し、項目値を渡しています。

```kotlin
fun main() {
//sampleStart
    // Creates an array with values [1, 2, 3]
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 1, 2, 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-simple-array-kotlin"}

この例では、[`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 関数を使用して、指定されたサイズの `null` 要素で埋められた配列を作成しています。

```kotlin
fun main() {
//sampleStart
    // Creates an array with values [null, null, null]
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // null, null, null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-null-array-kotlin"}

この例では、[`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 関数を使用して空の配列を作成しています。

```kotlin
    var exampleArray = emptyArray<String>()
```

> Kotlin の型推論により、空の配列の型を代入の左辺または右辺で指定できます。
>
> 例:
> ```Kotlin
> var exampleArray = emptyArray<String>()
>
> var exampleArray: Array<String> = emptyArray()
>```
>
{style="note"}

`Array` コンストラクターは、配列のサイズと、インデックスを指定して配列要素の値を返す関数を受け取ります。

```kotlin
fun main() {
//sampleStart
    // Creates an Array<Int> that initializes with zeros [0, 0, 0]
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 0, 0, 0

    // Creates an Array<String> with values ["0", "1", "4", "9", "16"]
    val asc = Array(5) { i -> (i * i).toString() }
    asc.forEach { print(it) }
    // 014916
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-array-constructor-kotlin"}

> ほとんどのプログラミング言語と同様に、Kotlin のインデックスは 0 から始まります。
>
{style="note"}

### ネストされた配列

配列は互いにネストして多次元配列を作成できます。

```kotlin
fun main() {
//sampleStart
    // Creates a two-dimensional array
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // [[0, 0], [0, 0]]

    // Creates a three-dimensional array
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-multidimensional-array-kotlin"}

> ネストされた配列は、同じ型や同じサイズである必要はありません。
>
{style="note"}

## 要素へのアクセスと変更

配列は常に可変です。配列内の要素にアクセスし、変更するには、[インデックスアクセス演算子](operator-overloading.md#indexed-access-operator)`[]`を使用します。

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // Accesses the element and modifies it
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // Prints the modified element
    println(simpleArray[0].toString()) // 10
    println(twoDArray[0][0].toString()) // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-access-array-kotlin"}

Kotlin の配列は_不変 (invariant)_ です。これは、潜在的な実行時エラーを防ぐため、Kotlin では `Array<String>` を `Array<Any>` に代入することを許可しないことを意味します。代わりに、`Array<out Any>` を使用できます。詳細については、「[型プロジェクション](generics.md#type-projections)」を参照してください。

## 配列の操作

Kotlin では、配列を使用して可変個の引数を関数に渡したり、配列自体に対して操作を実行したりできます。例えば、配列の比較、内容の変換、またはコレクションへの変換などです。

### 可変個引数を関数に渡す

Kotlin では、[`vararg`](functions.md#variable-number-of-arguments-varargs) パラメーターを介して可変個の引数を関数に渡すことができます。これは、メッセージのフォーマットや SQL クエリの作成など、引数の数が事前にわからない場合に役立ちます。

可変個の引数を含む配列を関数に渡すには、_スプレッド演算子_ (`*`) を使用します。スプレッド演算子は、配列の各要素を個別の引数として選択した関数に渡します。

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-vararg-array-kotlin"}

詳細については、「[可変個引数 (varargs)](functions.md#variable-number-of-arguments-varargs)」を参照してください。

### 配列の比較

2つの配列が同じ要素を同じ順序で持っているかどうかを比較するには、[`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html) および [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 関数を使用します。

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // Compares contents of arrays
    println(simpleArray.contentEquals(anotherArray))
    // true

    // Using infix notation, compares contents of arrays after an element
    // is changed
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-compare-array-kotlin"}

> 配列の内容を比較するために、等値 (`==`) および不等値 (`!=`) [演算子](equality.md#structural-equality)を使用しないでください。これらの演算子は、割り当てられた変数が同じオブジェクトを指しているかどうかをチェックします。
>
> Kotlin の配列がこの挙動を示す理由について詳しく知るには、当社の[ブログ投稿](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays)を参照してください。
>
{style="warning"}

### 配列の変換

Kotlin には、配列を変換するための多くの便利な関数があります。このドキュメントではいくつかを取り上げていますが、これが網羅的なリストではありません。関数の完全なリストについては、当社の[API リファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/)を参照してください。

#### 合計

配列内の全要素の合計を返すには、[`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 関数を使用します。

```Kotlin
fun main() {
//sampleStart
    val sumArray = arrayOf(1, 2, 3)

    // Sums array elements
    println(sumArray.sum())
    // 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-sum-array-kotlin"}

> `.sum()` 関数は、`Int` などの[数値データ型](numbers.md)の配列でのみ使用できます。
>
{style="note"}

#### シャッフル

配列内の要素をランダムにシャッフルするには、[`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 関数を使用します。

```Kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)

    // Shuffles elements [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // Shuffles elements again [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-shuffle-array-kotlin"}

### 配列をコレクションに変換する

配列を使用するものとコレクションを使用するものが混在する異なる API を扱う場合、配列を[コレクション](collections-overview.md)に変換したり、その逆を行ったりすることができます。

#### List または Set への変換

配列を `List` または `Set` に変換するには、[`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html) および [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 関数を使用します。

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf("a", "b", "c", "c")

    // Converts to a Set
    println(simpleArray.toSet())
    // [a, b, c]

    // Converts to a List
    println(simpleArray.toList())
    // [a, b, c, c]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-list-set-kotlin"}

#### Map への変換

配列を `Map` に変換するには、[`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 関数を使用します。

[`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) の配列のみが `Map` に変換できます。`Pair` インスタンスの最初の値がキーになり、2番目の値が値になります。この例では、[中置記法](functions.md#infix-notation)を使用して[`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 関数を呼び出し、`Pair` のタプルを作成しています。

```kotlin
fun main() {
//sampleStart
    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // Converts to a Map
    // The keys are fruits and the values are their number of calories
    // Note how keys must be unique, so the latest value of "apple"
    // overwrites the first
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-map-kotlin"}

## プリミティブ型配列

`Array` クラスをプリミティブ値で使用すると、これらの値はオブジェクトにボックス化されます。代替策として、プリミティブ型配列を使用すると、ボックス化のオーバーヘッドという副作用なしにプリミティブを配列に格納できます。

| プリミティブ型配列 | Javaでの同等な型 |
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

この例では、`IntArray` クラスのインスタンスを作成しています。

```kotlin
fun main() {
//sampleStart
    // Creates an array of Int of size 5 with the values initialized to zero
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 0, 0, 0, 0, 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-primitive-type-array-kotlin"}

> プリミティブ型配列をオブジェクト型配列に変換するには、[`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html) 関数を使用します。
>
> オブジェクト型配列をプリミティブ型配列に変換するには、[`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html)、[`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html)、[`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html) などを使用します。
>
{style="note"}

## 次のステップ

* ほとんどのユースケースでコレクションの使用を推奨する理由の詳細については、「[コレクションの概要](collections-overview.md)」を参照してください。
* その他の[基本型](basic-types.md)について学びます。
* Java 開発者の方は、[コレクション](java-to-kotlin-collections-guide.md)に関する Java から Kotlin への移行ガイドをお読みください。