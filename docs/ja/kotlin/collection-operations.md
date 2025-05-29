[//]: # (title: コレクション操作の概要)

Kotlin標準ライブラリは、コレクションに対する操作を実行するための多種多様な関数を提供しています。これには、要素の取得や追加といったシンプルな操作から、検索、ソート、フィルタリング、変換などのより複雑な操作までが含まれます。

## 拡張関数とメンバー関数

コレクション操作は、標準ライブラリ内で2つの方法で宣言されています。コレクションインターフェースの[メンバー関数](classes.md#class-members)と[拡張関数](extensions.md#extension-functions)です。

メンバー関数は、コレクション型にとって不可欠な操作を定義します。例えば、[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)にはその空っぽの状態をチェックするための[`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html)関数が含まれています。[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)には要素へのインデックスアクセス用の[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)が含まれています。

コレクションインターフェースの独自の具象化を作成する場合、それらのメンバー関数を実装する必要があります。新しい実装の作成を容易にするため、標準ライブラリのコレクションインターフェースのスケルトン実装を使用してください。[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html)、およびそれらの可変版（mutable counterparts）です。

その他のコレクション操作は拡張関数として宣言されています。これらは、フィルタリング、変換、順序付け、およびその他のコレクション処理関数です。

## 共通の操作

共通の操作は、[読み取り専用コレクションと可変コレクション](collections-overview.md#collection-types)の両方で利用できます。共通の操作は以下のグループに分類されます。

*   [変換](collection-transformations.md)
*   [フィルタリング](collection-filtering.md)
*   [`plus`および`minus`演算子](collection-plus-minus.md)
*   [グループ化](collection-grouping.md)
*   [コレクションの一部取得](collection-parts.md)
*   [単一要素の取得](collection-elements.md)
*   [順序付け](collection-ordering.md)
*   [集約操作](collection-aggregate.md)

これらのページで説明されている操作は、元のコレクションに影響を与えることなく結果を返します。例えば、フィルタリング操作は、フィルタリング条件に一致するすべての要素を含む_新しいコレクション_を生成します。このような操作の結果は、変数に格納するか、または他の方法、例えば他の関数に渡すなどして使用する必要があります。

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

特定のコレクション操作については、_destination_オブジェクトを指定するオプションがあります。destinationは、関数が新しいオブジェクトで結果項目を返す代わりに、それらを付加する可変コレクションです。destinationを使用する操作を実行するために、名前に`To`接尾辞を持つ別の関数があります。例えば、[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)の代わりに[`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html)、または[`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)の代わりに[`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html)です。これらの関数は、destinationコレクションを追加のパラメータとして受け取ります。

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

利便性のために、これらの関数はdestinationコレクションを返します。そのため、関数呼び出しの対応する引数内で直接作成できます。

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

destinationを持つ関数は、フィルタリング、関連付け、グループ化、フラット化、およびその他の操作で利用できます。destination操作の完全なリストについては、[Kotlinコレクションリファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)を参照してください。

## 書き込み操作

可変コレクションの場合、コレクションの状態を変更する_書き込み操作_も存在します。このような操作には、要素の追加、削除、更新が含まれます。書き込み操作は、[書き込み操作](collection-write.md)および[リスト固有の操作](list-operations.md#list-write-operations)と[マップ固有の操作](map-operations.md#map-write-operations)の対応するセクションに記載されています。

特定の操作については、同じ操作を実行するための関数のペアがあります。一方は操作をインプレースで適用し、もう一方は結果を別のコレクションとして返します。例えば、[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)は可変コレクションをインプレースでソートするため、その状態が変化します。[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)は、同じ要素をソートされた順序で含む新しいコレクションを作成します。

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