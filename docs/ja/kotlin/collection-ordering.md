---
title: 発注
---
要素の順序は、特定のコレクション型において重要な側面です。
例えば、要素が同じリストでも、要素の順序が異なると等しいとは見なされません。

Kotlinでは、オブジェクトの順序をいくつかの方法で定義できます。

まず、_自然_順序があります。これは、[`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)
インターフェースの実装に対して定義されます。自然順序は、特に指定がない場合にそれらをソートするために使用されます。

ほとんどの組み込み型は比較可能です。

* 数値型は、従来の数値順序を使用します。`1` は `0` より大きく、`-3.4f` は `-5f` より大きくなります。
* `Char`と`String`は、[辞書式順序](https://en.wikipedia.org/wiki/Lexicographical_order)を使用します。`b` は `a` より大きく、`world` は `hello` より大きくなります。

ユーザー定義型に自然順序を定義するには、その型を `Comparable` の実装者にします。
これには、`compareTo()` 関数を実装する必要があります。`compareTo()` は、引数として同じ型の別のオブジェクトを取り、
どのオブジェクトが大きいかを示す整数値を返す必要があります。

* 正の値は、レシーバーオブジェクトが大きいことを示します。
* 負の値は、引数よりも小さいことを示します。
* ゼロは、オブジェクトが等しいことを示します。

以下は、majorとminorパートで構成されるバージョンを順序付けるためのクラスです。

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major `->` this.major compareTo other.major // compareTo() in the infix form 
        this.minor != other.minor `->` this.minor compareTo other.minor
        else `->` 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
```

_カスタム_順序を使用すると、任意の型のインスタンスを好きなようにソートできます。
特に、比較不可能なオブジェクトの順序を定義したり、比較可能な型に対して自然順序以外の順序を定義したりできます。
型にカスタム順序を定義するには、その型の[`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)を作成します。
`Comparator`には`compare()`関数が含まれています。これは、クラスの2つのインスタンスを取り、それらの間の比較の整数結果を返します。
結果は、上記の`compareTo()`の結果と同じように解釈されます。

```kotlin
fun main() {

    val lengthComparator = Comparator { str1: String, str2: String `->` str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))

}
```

`lengthComparator`を使用すると、デフォルトの辞書式順序ではなく、文字列を長さで並べ替えることができます。

`Comparator`を定義するより短い方法は、標準ライブラリの[`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html)
関数です。`compareBy()`は、インスタンスから`Comparable`値を生成するラムダ関数を取り、
カスタム順序を生成された値の自然順序として定義します。

`compareBy()`を使用すると、上記の例の長さコンパレータは次のようになります。

```kotlin
fun main() {

    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))

}
```

複数の基準に基づいて順序を定義することもできます。
たとえば、文字列を長さでソートし、長さが等しい場合はアルファベット順にソートするには、次のように記述します。

```kotlin
fun main() {

    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith { a, b `->` 
           when (val compareLengths = a.length.compareTo(b.length)) {
             0 `->` a.compareTo(b)
             else `->` compareLengths
           }
         }

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]

}
```

複数の基準でソートすることは一般的なシナリオであるため、Kotlin標準ライブラリは、セカンダリソート規則を追加するために使用できる[`thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html)関数を提供します。

たとえば、`compareBy()`を`thenBy()`と組み合わせて、前の例のように、最初に文字列を長さでソートし、次にアルファベット順にソートできます。

```kotlin
fun main() {

    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith(compareBy<String> { it.length }.thenBy { it })

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]

}
```

Kotlinコレクションパッケージは、自然順序、カスタム順序、さらにはランダム順序でコレクションをソートするための関数を提供します。
このページでは、[読み取り専用](collections-overview#collection-types)コレクションに適用されるソート関数について説明します。
これらの関数は、元のコレクションの要素を要求された順序で含む新しいコレクションとして結果を返します。
[mutable](collections-overview#collection-types)コレクションをインプレースでソートするための関数については、[リスト固有の操作](list-operations#sort)を参照してください。

## 自然順序

基本的な関数[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)と[`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html)
は、コレクションの要素を自然順序に従って昇順および降順にソートして返します。
これらの関数は、`Comparable`要素のコレクションに適用されます。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")

}
```

## カスタム順序
 
カスタム順序でソートする場合、または比較不可能なオブジェクトをソートする場合は、[`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html)と[`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html)関数があります。
これらは、コレクション要素を`Comparable`値にマップするセレクター関数を取り、その値の自然順序でコレクションをソートします。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedByLast")

}
```

コレクションのソートにカスタム順序を定義するには、独自の`Comparator`を提供できます。
これを行うには、`Comparator`を渡して[`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html)関数を呼び出します。
この関数を使用すると、文字列を長さでソートすると次のようになります。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")

}
```

## 逆順

[`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html)関数を使用して、コレクションを逆順で取得できます。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())

}
```

`reversed()`は、要素のコピーを含む新しいコレクションを返します。
したがって、後で元のコレクションを変更しても、以前に取得した`reversed()`の結果には影響しません。

別の反転関数 - [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)
- は、同じコレクションインスタンスの反転ビューを返します。したがって、元のリストが変更されない場合は、`reversed()`よりも軽量で推奨される場合があります。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)

}
```

元のリストがmutableの場合、そのすべての変更が反転ビューに反映され、その逆も同様です。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)

}
```

ただし、リストのmutabilityが不明な場合、またはソースがリストではない場合、`reversed()`の方が推奨されます。
その結果はコピーであり、将来変更されないためです。

## ランダム順序

最後に、コレクション要素をランダムな順序で含む新しい`List`を返す関数があります - [`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)。
引数なしで、または[`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)オブジェクトを使用して呼び出すことができます。

```kotlin
fun main() {

     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())

}
```