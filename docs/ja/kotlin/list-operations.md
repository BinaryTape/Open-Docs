[//]: # (title: リスト固有の操作)

[`List`](collections-overview.md#list) は、Kotlinにおける組み込みコレクションの中で最も一般的な型です。リストの要素へのインデックスアクセスは、リストに対して強力な一連の操作を提供します。

## インデックスによる要素の取得

リストは、要素の取得に関するすべての一般的な操作、例えば `elementAt()`、`first()`、`last()`、および[単一要素の取得](collection-elements.md)に記載されているその他の操作をサポートしています。
リストに特有なのは要素へのインデックスアクセスであり、そのため要素を読み取る最も簡単な方法はインデックスで取得することです。これは、[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 関数に引数としてインデックスを渡すか、短縮形の `[index]` 構文を使用して行われます。

リストサイズが指定されたインデックスよりも小さい場合、例外がスローされます。そのような例外を回避するのに役立つ2つの関数があります。

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) は、コレクションにインデックスが存在しない場合に返すデフォルト値を計算するための関数を提供できます。
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

## リストの一部を取得する

[コレクションの一部を取得する](collection-parts.md)ための一般的な操作に加えて、リストは指定された要素の範囲のビューをリストとして返す [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html) 関数を提供します。
そのため、元のコレクションの要素が変更されると、以前に作成されたサブリストでも変更され、逆もまた同様です。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 要素の位置を見つける

### 線形探索

任意のリストにおいて、`indexOf()` および `lastIndexOf()` 関数を使用して要素の位置を見つけることができます。これらは、リスト内で与えられた引数と等しい要素の最初と最後の位置を返します。
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

述語を受け取り、それに一致する要素を検索する関数のペアもあります。

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) は、述語に一致する*最初の要素のインデックス*を返します。そのような要素がない場合は `-1` を返します。
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) は、述語に一致する*最後の要素のインデックス*を返します。そのような要素がない場合は `-1` を返します。

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

### ソートされたリストにおける二分探索

リスト内の要素を検索するもう1つの方法として、[二分探索](https://en.wikipedia.org/wiki/Binary_search_algorithm)があります。
これは他の組み込み検索関数よりも著しく高速に動作しますが、特定の順序（自然な順序、または関数パラメータで提供される別の順序）に従ってリストが[昇順にソートされている](collection-ordering.md)必要があります。
そうでなければ、結果は未定義です。

ソートされたリスト内の要素を検索するには、値を引数として渡して [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html) 関数を呼び出します。
そのような要素が存在する場合、関数はそのインデックスを返します。それ以外の場合は `(-insertionPoint - 1)` を返します。ここで `insertionPoint` は、リストがソートされたままになるように、この要素が挿入されるべきインデックスです。
指定された値を持つ要素が複数ある場合、検索はそれらのいずれかのインデックスを返すことがあります。

検索するインデックス範囲を指定することもできます。この場合、関数は提供された2つのインデックス間でのみ検索します。

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

#### コンパレーターによる二分探索

リストの要素が `Comparable` でない場合、二分探索で使用する [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator.html) を提供する必要があります。
リストはこの `Comparator` に従って昇順にソートされている必要があります。例を見てみましょう。

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

ここには、`Comparable` ではない `Product` インスタンスのリストと、順序を定義する `Comparator` があります。すなわち、`p1` の価格が `p2` の価格よりも低い場合、`p1` は `p2` に先行します。
したがって、この順序に従って昇順にソートされたリストがあれば、`binarySearch()` を使用して指定された `Product` のインデックスを見つけます。

カスタムコンパレーターは、リストが自然な順序とは異なる順序を使用する場合にも便利です。例えば、`String` 要素の大文字と小文字を区別しない順序などです。

```kotlin

fun main() {
//sampleStart
    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 比較関数による二分探索

_比較_関数による二分探索は、明示的な検索値を提供することなく要素を見つけることができます。
代わりに、要素を `Int` 値にマッピングする比較関数を受け取り、その関数がゼロを返す要素を検索します。
リストは提供された関数に従って昇順にソートされている必要があります。つまり、比較の戻り値は、あるリスト要素から次のリスト要素へと増加していく必要があります。

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

コンパレーターと比較関数の両方を用いた二分探索は、リスト範囲に対しても実行できます。

## リストの書き込み操作

[コレクションの書き込み操作](collection-write.md)で説明されているコレクション変更操作に加えて、[ミュータブルな](collections-overview.md#collection-types)リストは特定の書き込み操作をサポートしています。
これらの操作はインデックスを使用して要素にアクセスし、リストの変更機能を拡張します。

### 追加

リストの特定の位置に要素を追加するには、[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) および [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) を使用し、要素挿入位置を追加の引数として提供します。
その位置より後にあるすべての要素は右にシフトします。

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

リストは、指定された位置の要素を置き換える関数、[`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html) とその演算子形式 `[]` も提供します。`set()` は他の要素のインデックスを変更しません。

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

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) は、単にすべてのコレクション要素を指定された値で置き換えます。

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

リストから特定の位置の要素を削除するには、[`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 関数を使用し、位置を引数として提供します。
削除される要素より後にあるすべての要素のインデックスは1つ減少します。

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

[コレクションの順序付け](collection-ordering.md)では、特定の順序でコレクション要素を取得する操作について説明しています。
ミュータブルなリストの場合、標準ライブラリは同じ順序付け操作をインプレースで実行する同様の拡張関数を提供します。
リストインスタンスにそのような操作を適用すると、そのインスタンス内の要素の順序が変更されます。

インプレースソート関数は、読み取り専用リストに適用される関数と似た名前を持っていますが、`ed/d` サフィックスがありません。

* `sorted*` の代わりに `sort*` がすべてのソート関数名に使用されます：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) など。
* `shuffled()` の代わりに [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html)。
* `reversed()` の代わりに [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html)。

ミュータブルなリストで呼び出された [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) は、元のリストの逆順ビューである別のミュータブルなリストを返します。そのビューでの変更は元のリストに反映されます。
以下の例は、ミュータブルなリストのソート関数を示しています。

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