[//]: # (title: リスト固有の操作)

[`List`](collections-overview.md#list) は、Kotlin の組み込みコレクションの中で最も人気のある型です。リストの要素に対するインデックス・アクセスは、リストのための強力な操作セットを提供します。

## インデックスによる要素の取得

リストは、[単一要素の取得](collection-elements.md)にリストされている `elementAt()`、`first()`、`last()` などの共通の要素取得操作をすべてサポートしています。
リストに特有なのはインデックスによる要素へのアクセスであり、要素を読み取る最も簡単な方法はインデックスによって取得することです。
これは、引数にインデックスを渡す [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 関数、または短縮形の `[index]` 構文を使用して行われます。

リストのサイズが指定されたインデックス未満の場合、例外がスローされます。
このような例外を回避するのに役立つ他の 2 つの関数があります。

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) を使用すると、コレクションにインデックスが存在しない場合に返すデフォルト値を計算するための関数を提供できます。
* [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) は、デフォルト値として `null` を返します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.get(0))
    println(numbers[0])
    //numbers.get(5)                         // exception!
    println(numbers.getOrNull(5))             // null
    println(numbers.getOrElse(5, {it}))        // 5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## リストの一部の取得

[コレクションの一部の取得](collection-parts.md)に関する一般的な操作に加えて、リストは [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html) 関数を提供しており、これは指定された要素範囲のリストとしてのビュー（view）を返します。
したがって、元のコレクションの要素が変更されると、以前に作成されたサブリスト内でも変更され、その逆も同様です。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 要素の位置の検索

### 線形探索

どのリストでも、[`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) および [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html) 関数を使用して要素の位置を見つけることができます。
これらは、リスト内で指定された引数と等しい要素の最初と最後の位置を返します。
そのような要素がない場合、両方の関数は `-1` を返します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4, 2, 5)
    println(numbers.indexOf(2))
    println(numbers.lastIndexOf(2))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

また、述語（predicate）を受け取り、それに一致する要素を検索する一対の関数もあります。

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) は、述語に一致する *最初の要素のインデックス* を返します。そのような要素がない場合は `-1` を返します。
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) は、述語に一致する *最後の要素のインデックス* を返します。そのような要素がない場合は `-1` を返します。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers.indexOfFirst { it > 2})
    println(numbers.indexOfLast { it % 2 == 1})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### ソート済みリストでの二分探索

リスト内の要素を検索するもう 1 つの方法として、[二分探索（binary search）](https://ja.wikipedia.org/wiki/二分探索)があります。
これは他の組み込み検索関数よりも大幅に高速に動作しますが、リストがある特定の順序（自然順序、または関数のパラメータで提供される別の順序）に従って昇順に[ソートされている](collection-ordering.md)必要があります。
そうでない場合、結果は不定です。

ソートされたリスト内の要素を検索するには、値を引数として渡して [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html) 関数を呼び出します。
そのような要素が存在する場合、関数はそのインデックスを返します。それ以外の場合は、`(-insertionPoint - 1)` を返します。ここで `insertionPoint` は、リストのソート状態を維持するためにその要素を挿入すべきインデックスです。
指定された値を持つ要素が複数ある場合、検索はいずれかのインデックスを返す可能性があります。

検索対象のインデックス範囲を指定することもできます。この場合、関数は提供された 2 つのインデックスの間のみを検索します。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.sort()
    println(numbers)
    println(numbers.binarySearch("two"))  // 3
    println(numbers.binarySearch("z")) // -5
    println(numbers.binarySearch("two", 0, 2))  // -3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### Comparator を使用した二分探索

リストの要素が `Comparable` でない場合は、二分探索で使用する [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/) を提供する必要があります。
リストはこの `Comparator` に従って昇順にソートされている必要があります。例を見てみましょう：

```kotlin

data class Product(val name: String, val price: Double)

fun main() {
//sampleStart
    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch(Product("AppCode", 99.0), compareBy<Product> { it.price }.thenBy { it.name }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ここでは、`Comparable` ではない `Product` インスタンスのリストと、順序を定義する `Comparator` があります。この順序では、製品 `p1` の価格が `p2` の価格より低い場合に `p1` が `p2` よりも前になります。
したがって、この順序に従って昇順にソートされたリストがある場合、`binarySearch()` を使用して指定された `Product` のインデックスを見つけることができます。

カスタムコンパレータは、リストが自然順序とは異なる順序を使用している場合、例えば `String` 要素の大文字小文字を区別しない順序を使用している場合などにも便利です。

```kotlin

fun main() {
//sampleStart
    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 比較関数を使用した二分探索

*比較（comparison）* 関数を用いた二分探索では、明示的な検索値を指定せずに要素を見つけることができます。
代わりに、要素を `Int` 値にマッピングする比較関数を受け取り、関数が 0 を返す要素を検索します。
リストは提供された関数に従って昇順にソートされている必要があります。言い換えると、比較の戻り値がリストの要素ごとに増加していく必要があります。

```kotlin

import kotlin.math.sign
//sampleStart
data class Product(val name: String, val price: Double)

fun priceComparison(product: Product, price: Double) = sign(product.price - price).toInt()

fun main() {
    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch { priceComparison(it, 99.0) })
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

コンパレータ比較および比較関数を用いた二分探索は、リストの範囲に対しても実行できます。

## リストの書き込み操作

[コレクションの書き込み操作](collection-write.md)で説明されているコレクション変更操作に加えて、[ミュータブル（mutable）](collections-overview.md#collection-types)なリストは特定の書き込み操作をサポートしています。
このような操作では、インデックスを使用して要素にアクセスし、リストの変更機能を拡張します。

### 追加

リストの特定の位置に要素を追加するには、[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) および [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) を使用し、要素を挿入する位置を追加の引数として指定します。
挿入位置の後にあるすべての要素は右側にシフトされます。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "six")
    numbers.add(1, "two")
    numbers.addAll(2, listOf("three", "four"))
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 更新

リストは、指定された位置の要素を置き換える関数 [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html) と、その演算子形式である `[]` も提供しています。`set()` は他の要素のインデックスを変更しません。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "three")
    numbers[1] =  "two"
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) は、コレクションのすべての要素を単に指定された値で置き換えます。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 削除

リストから特定の位置の要素を削除するには、[`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 関数を使用し、位置を引数として指定します。
削除される要素の後にあるすべての要素のインデックスは 1 つ減少します。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)    
    numbers.removeAt(1)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### ソート

[コレクションの順序付け](collection-ordering.md)では、コレクションの要素を特定の順序で取得する操作について説明しました。
ミュータブルなリストに対して、標準ライブラリは同様の拡張関数を提供しており、これらは同じ順序付け操作をその場（インプレース）で行います。
リストインスタンスにこのような操作を適用すると、そのインスタンス自体の要素の順序が変更されます。

インプレース・ソート関数の名前は、読み取り専用リストに適用される関数と似ていますが、`ed/d` サフィックスがありません。

* すべてのソート関数の名前において、`sorted*` の代わりに `sort*` が使われます：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) など。
* `shuffled()` の代わりに [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html)。
* `reversed()` の代わりに [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html)。

ミュータブルなリストに対して呼び出される [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) は、元のリストの逆順のビューである別のミュータブルなリストを返します。そのビューでの変更は、元のリストに反映されます。
次の例は、ミュータブルなリストのソート関数を示しています。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")

    numbers.sort()
    println("Sort into ascending: $numbers")
    numbers.sortDescending()
    println("Sort into descending: $numbers")

    numbers.sortBy { it.length }
    println("Sort into ascending by length: $numbers")
    numbers.sortByDescending { it.last() }
    println("Sort into descending by the last letter: $numbers")
    
    numbers.sortWith(compareBy<String> { it.length }.thenBy { it })
    println("Sort by Comparator: $numbers")

    numbers.shuffle()
    println("Shuffle: $numbers")

    numbers.reverse()
    println("Reverse: $numbers")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}