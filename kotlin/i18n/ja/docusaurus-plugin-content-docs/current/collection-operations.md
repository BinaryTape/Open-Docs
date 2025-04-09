---
title: コレクション操作の概要
---
Kotlin標準ライブラリは、コレクションに対する操作を実行するための幅広い機能を提供しています。これには、要素の取得や追加といった単純な操作だけでなく、検索、ソート、フィルタリング、変換など、より複雑な操作も含まれます。

## 拡張関数とメンバ関数

コレクション操作は、標準ライブラリで2つの方法で宣言されています。コレクションインタフェースの[メンバ関数](classes#class-members)と[拡張関数](extensions#extension-functions)です。

メンバ関数は、コレクション型に不可欠な操作を定義します。たとえば、[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)には、空かどうかをチェックする[`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html)関数が含まれています。[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)には、要素へのインデックスアクセスを行う[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)が含まれています。

コレクションインタフェースの独自の実装を作成する場合は、メンバ関数を実装する必要があります。新しい実装の作成を容易にするために、標準ライブラリのコレクションインタフェースのスケルトン実装（[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html)）およびそれらの変更可能な対応物を使用します。

他のコレクション操作は、拡張関数として宣言されています。これらは、フィルタリング、変換、順序付け、その他のコレクション処理関数です。

## 一般的な操作

一般的な操作は、[読み取り専用と変更可能なコレクション](collections-overview#collection-types)の両方で使用できます。一般的な操作は、次のグループに分類されます。

* [変換](collection-transformations)
* [フィルタリング](collection-filtering)
* [`plus` and `minus` operators](collection-plus-minus)
* [グルーピング](collection-grouping)
* [コレクションの一部の取得](collection-parts)
* [単一要素の取得](collection-elements)
* [順序付け](collection-ordering)
* [集約操作](collection-aggregate)

これらのページで説明されている操作は、元のコレクションに影響を与えることなく結果を返します。たとえば、フィルタリング操作は、フィルタリング述語に一致するすべての要素を含む_新しいコレクション_を生成します。このような操作の結果は、変数に格納するか、他の関数に渡すなど、他の方法で使用する必要があります。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // nothing happens with `numbers`, result is lost
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // result is stored in `longerThan3`
    println("numbers longer than 3 chars are $longerThan3")

}
```

特定のコレクション操作では、_destination_オブジェクトを指定するオプションがあります。
Destinationとは、関数が新しいオブジェクトで結果のアイテムを返す代わりに、結果のアイテムを追加する変更可能なコレクションです。
destinationを使った操作を実行するために、名前の中に`To`の接尾辞を持つ個別の関数があります。たとえば、[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)の代わりに[`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html)、または[`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)の代わりに[`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html)などがあります。
これらの関数は、destinationコレクションを追加のパラメータとして取ります。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  //destination object
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ `->` index == 0 }
    println(filterResults) // contains results of both operations

}

```

便宜上、これらの関数はdestinationコレクションを返すため、関数呼び出しの対応する引数で直接作成できます。

```kotlin

fun main() {
    val numbers = listOf("one", "two", "three", "four")

    // filter numbers right into a new hash set, 
    // thus eliminating duplicates in the result
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")

}
```

destinationを持つ関数は、フィルタリング、関連付け、グルーピング、フラット化、およびその他の操作で使用できます。
destination操作の完全なリストについては、[Kotlin collections reference](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)を参照してください。

## 書き込み操作

変更可能なコレクションの場合、コレクションの状態を変更する_書き込み操作_もあります。このような操作には、要素の追加、削除、および更新が含まれます。書き込み操作は、[書き込み操作](collection-write)および[List固有の操作](list-operations#list-write-operations)と[Map固有の操作](map-operations#map-write-operations)の対応するセクションにリストされています。

特定の操作では、同じ操作を実行するための関数のペアがあります。1つは操作をインプレースで適用し、もう1つは結果を別のコレクションとして返します。たとえば、[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)は変更可能なコレクションをインプレースでソートするため、状態が変化します。[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)は、ソートされた順序で同じ要素を含む新しいコレクションを作成します。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    val sortedNumbers = numbers.sorted()
    println(numbers == sortedNumbers)  // false
    numbers.sort()
    println(numbers == sortedNumbers)  // true

}
```