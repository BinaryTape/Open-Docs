---
title: リスト固有の操作
---
[`List`](collections-overview#list)は、Kotlinで最も一般的な組み込みコレクションの型です。リストの要素へのインデックスアクセスは、リストに対する強力な操作セットを提供します。

## インデックスによる要素の取得

リストは、要素の取得に関する一般的な操作をすべてサポートしています。[`elementAt()`](collection-elements)、[`first()`](collection-elements)、[`last()`](collection-elements)、および[単一要素の取得](collection-elements)にリストされているその他の関数です。リストに特有なのは、要素へのインデックスアクセスです。したがって、要素を読み取る最も簡単な方法は、インデックスで取得することです。これは、引数としてインデックスを渡す[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)関数、または短縮形の`[index]`構文で行います。

リストのサイズが指定されたインデックスよりも小さい場合、例外がスローされます。そのような例外を回避するのに役立つ2つの関数があります。

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html)を使用すると、インデックスがコレクションに存在しない場合に返すデフォルト値を計算する関数を提供できます。
* [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html)は、デフォルト値として`null`を返します。

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.get(0))
    println(numbers[0])
    //numbers.get(5)                         // 例外が発生します！
    println(numbers.getOrNull(5))             // null
    println(numbers.getOrElse(5, {it}))        // 5

}
```

## リストの一部分の取得

[コレクションの一部分の取得](collection-parts)のための一般的な操作に加えて、リストは、指定された要素範囲のビューをリストとして返す[`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html)関数を提供します。したがって、元のコレクションの要素が変更されると、以前に作成されたサブリストでも変更され、その逆も同様です。

```kotlin

fun main() {

    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))

}
```

## 要素の位置の検索

### 線形探索

任意のリストで、[`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html)関数と[`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html)関数を使用して要素の位置を見つけることができます。これらの関数は、リスト内で与えられた引数と等しい要素の最初と最後の位置を返します。そのような要素がない場合、両方の関数は`-1`を返します。

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4, 2, 5)
    println(numbers.indexOf(2))
    println(numbers.lastIndexOf(2))

}
```

述語を受け取り、それに一致する要素を検索する一対の関数もあります。

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html)は、述語に一致する*最初の*要素のインデックスを返し、そのような要素がない場合は`-1`を返します。
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html)は、述語に一致する*最後の*要素のインデックスを返し、そのような要素がない場合は`-1`を返します。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers.indexOfFirst { it > 2})
    println(numbers.indexOfLast { it % 2 == 1})

}
```

### ソートされたリストでの二分探索

リスト内の要素を検索するもう1つの方法は、[二分探索](https://en.wikipedia.org/wiki/Binary_search_algorithm)です。これは他の組み込み検索関数よりも大幅に高速に動作しますが、特定の順序（自然な順序、または関数パラメータで提供される別の順序）に従って、リストが*[ソート](collection-ordering)されている*必要があります。そうでない場合、結果は未定義です。

ソートされたリスト内の要素を検索するには、値を引数として渡して[`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html)関数を呼び出します。そのような要素が存在する場合、関数はそのインデックスを返します。そうでない場合、`(-insertionPoint - 1)`を返します。ここで、`insertionPoint`は、リストがソートされた状態を維持するために、この要素を挿入する必要があるインデックスです。与えられた値を持つ要素が複数ある場合、検索はそれらのインデックスのいずれかを返すことがあります。

検索するインデックス範囲を指定することもできます。この場合、関数は指定された2つのインデックスの間のみを検索します。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.sort()
    println(numbers)
    println(numbers.binarySearch("two"))  // 3
    println(numbers.binarySearch("z")) // -5
    println(numbers.binarySearch("two", 0, 2))  // -3

}
```

#### 比較関数を使った二分探索

リスト要素が`Comparable`でない場合、二分探索で使用する[`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator.html)を提供する必要があります。リストは、この`Comparator`に従って昇順でソートされている必要があります。例を見てみましょう。

```kotlin

data class Product(val name: String, val price: Double)

fun main() {

    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch(Product("AppCode", 99.0), compareBy<Product> { it.price }.thenBy { it.name }))

}
```

これは、`Comparable`ではない`Product`インスタンスのリストと、順序を定義する`Comparator`です。製品`p1`の価格が製品`p2`の価格よりも低い場合、製品`p1`は製品`p2`よりも優先されます。したがって、この順序に従って昇順にソートされたリストがある場合、`binarySearch()`を使用して、指定された`Product`のインデックスを見つけます。

カスタム比較関数は、リストが自然な順序とは異なる順序を使用する場合にも役立ちます。たとえば、`String`要素の大文字と小文字を区別しない順序などです。

```kotlin

fun main() {

    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3

}
```

#### 比較による二分探索

*比較*関数を使用した二分探索では、明示的な検索値を指定せずに要素を見つけることができます。代わりに、要素を`Int`値にマッピングする比較関数を受け取り、関数がゼロを返す要素を検索します。リストは、提供された関数に従って昇順でソートされている必要があります。言い換えれば、比較の戻り値は、あるリスト要素から次のリスト要素へと大きくなる必要があります。

```kotlin

import kotlin.math.sign

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

```

比較関数およびコンパレータによる二分探索は、リスト範囲に対しても実行できます。

## リストの書き込み操作

[コレクションの書き込み操作](collection-write)で説明されているコレクション変更操作に加えて、[可変](collections-overview#collection-types)リストは特定の書き込み操作をサポートしています。このような操作は、インデックスを使用して要素にアクセスし、リストの変更機能を拡張します。

### 追加

リスト内の特定の位置に要素を追加するには、要素の挿入位置を追加の引数として指定して、[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)および[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)を使用します。その位置の後にあるすべての要素は右にシフトします。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "five", "six")
    numbers.add(1, "two")
    numbers.addAll(2, listOf("three", "four"))
    println(numbers)

}
```

### 更新

リストは、指定された位置にある要素を置き換える関数も提供します。[`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html)とその演算子形式`[]`です。`set()`は、他の要素のインデックスを変更しません。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "five", "three")
    numbers[1] =  "two"
    println(numbers)

}
```

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html)は、コレクションのすべての要素を指定された値で単純に置き換えます。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)

}
```

### 削除

リストから特定の位置にある要素を削除するには、位置を引数として指定して[`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)関数を使用します。削除される要素の後にある要素のすべてのインデックスは1つずつ減少します。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4, 3)    
    numbers.removeAt(1)
    println(numbers)

}
```

### ソート

[コレクションの順序付け](collection-ordering)では、特定の順序でコレクション要素を取得する操作について説明します。可変リストの場合、標準ライブラリは、同じ順序付け操作をインプレースで実行する同様の拡張関数を提供します。このような操作をリストインスタンスに適用すると、そのインスタンス内の要素の順序が変更されます。

インプレースソート関数は、読み取り専用リストに適用される関数と似た名前を持ちますが、`ed/d`サフィックスがありません。

* すべてのソート関数の名前では、`sorted*`の代わりに`sort*`：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html)など。
* `shuffled()`の代わりに[`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html)。
* `reversed()`の代わりに[`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html)。

可変リストで呼び出された[`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)は、元のリストの反転ビューである別の可変リストを返します。そのビューでの変更は、元のリストに反映されます。次の例は、可変リストのソート関数を示しています。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")

    numbers.sort()
    println("昇順にソート: $numbers")
    numbers.sortDescending()
    println("降順にソート: $numbers")

    numbers.sortBy { it.length }
    println("長さで昇順にソート: $numbers")
    numbers.sortByDescending { it.last() }
    println("最後の文字で降順にソート: $numbers")
    
    numbers.sortWith(compareBy<String> { it.length }.thenBy { it })
    println("コンパレータでソート: $numbers")

    numbers.shuffle()
    println("シャッフル: $numbers")

    numbers.reverse()
    println("反転: $numbers")

}
```