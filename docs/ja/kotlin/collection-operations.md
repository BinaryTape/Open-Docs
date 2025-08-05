[//]: # (title: コレクション操作の概要)

Kotlin標準ライブラリは、コレクションに対する操作を実行するための多様な関数を提供しています。これには、要素の取得や追加といった単純な操作から、検索、ソート、フィルタリング、変換などのより複雑な操作までが含まれます。

## 拡張関数とメンバー関数

コレクション操作は、標準ライブラリで2つの方法で宣言されています。コレクションインターフェースの[メンバー関数](classes.md#class-members)と、[拡張関数](extensions.md#extension-functions)です。

メンバー関数は、コレクション型にとって不可欠な操作を定義します。例えば、[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)にはその空っぽさを確認するための[`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html)関数が含まれ、[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)には要素へのインデックスアクセスを行う[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)などが含まれています。

コレクションインターフェースの独自の（自作の）実装を作成する場合、それらのメンバー関数を実装する必要があります。新しい実装の作成を容易にするために、標準ライブラリのコレクションインターフェースのスケルトン実装、すなわち [`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、 [`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、 [`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、 [`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html)、およびそれらの可変版を使用してください。

その他のコレクション操作は拡張関数として宣言されています。これらには、フィルタリング、変換、順序付け、およびその他のコレクション処理関数が含まれます。

## 共通操作

共通操作は、[読み取り専用コレクションと可変コレクション](collections-overview.md#collection-types)の両方で利用できます。共通操作は以下のグループに分類されます。

*   [変換](collection-transformations.md)
*   [フィルタリング](collection-filtering.md)
*   [`plus` および `minus` 演算子](collection-plus-minus.md)
*   [グループ化](collection-grouping.md)
*   [コレクションの一部の取得](collection-parts.md)
*   [単一要素の取得](collection-elements.md)
*   [順序付け](collection-ordering.md)
*   [集約操作](collection-aggregate.md)

これらのページで説明されている操作は、元のコレクションに影響を与えることなく結果を返します。例えば、フィルタリング操作は、フィルタリング述語に一致するすべての要素を含む_新しいコレクション_を生成します。このような操作の結果は、変数に格納するか、または他の関数に渡すなど、何らかの別の方法で使用する必要があります。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // nothing happens with `numbers`, result is lost
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // result is stored in `longerThan3`
    println("numbers longer than 3 chars are $longerThan3")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

特定のコレクション操作では、_デスティネーション_オブジェクトを指定するオプションがあります。デスティネーションとは、関数が結果の項目を新しいオブジェクトで返す代わりに、それらを追加する可変コレクションです。デスティネーションを使用した操作を実行する場合、例えば[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)の代わりに[`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html)、[`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)の代わりに[`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html)のように、名前に`To`の接尾辞が付いた別個の関数があります。これらの関数は、デスティネーションコレクションを追加のパラメータとして取ります。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  //destination object
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    println(filterResults) // contains results of both operations
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

便宜上、これらの関数はデスティネーションコレクションを返します。そのため、関数呼び出しの対応する引数内で直接作成できます。

```kotlin

fun main() {
    val numbers = listOf("one", "two", "three", "four")
//sampleStart
    // filter numbers right into a new hash set, 
    // thus eliminating duplicates in the result
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

デスティネーションを持つ関数は、フィルタリング、関連付け、グループ化、フラット化、その他の操作で利用できます。デスティネーション操作の完全なリストについては、[Kotlinコレクションリファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)を参照してください。

## 書き込み操作

可変コレクションの場合、コレクションの状態を変更する_書き込み操作_もあります。そのような操作には、要素の追加、削除、更新が含まれます。書き込み操作は、[書き込み操作](collection-write.md)および[List固有の操作](list-operations.md#list-write-operations)と[Map固有の操作](map-operations.md#map-write-operations)の対応するセクションにリストされています。

特定の操作については、同じ操作を実行するための関数のペアがあります。一方は操作をインプレースで適用し、もう一方は結果を別のコレクションとして返します。例えば、[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)は可変コレクションをインプレースでソートするため、その状態が変更されます。[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)は、同じ要素をソートされた順序で含む新しいコレクションを作成します。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val sortedNumbers = numbers.sorted()
    println(numbers == sortedNumbers)  // false
    numbers.sort()
    println(numbers == sortedNumbers)  // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}