[//]: # (title: コレクション操作の概要)

Kotlin標準ライブラリは、コレクションに対して操作を実行するための多種多様な関数を提供しています。これには、要素の取得や追加といった単純な操作から、検索、ソート、フィルタリング、変換などのより複雑な操作まで含まれます。

## 拡張関数とメンバ関数

コレクション操作は、標準ライブラリにおいて2つの方法で宣言されています。コレクションインターフェースの[メンバ関数](classes.md)と[拡張関数](extensions.md#extension-functions)です。

メンバ関数は、コレクション型にとって不可欠な操作を定義します。例えば、[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) には、空かどうかを確認するための関数 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html) が含まれています。[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) には要素にインデックスでアクセスするための [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) などが含まれています。

独自のコレクションインターフェースの実装を作成する場合は、そのメンバ関数を実装する必要があります。新しい実装の作成を容易にするために、標準ライブラリにあるコレクションインターフェースの骨格実装（skeletal implementations）を使用してください：[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html)、およびそれらのミュータブル（可変）な対応クラスです。

その他のコレクション操作は拡張関数として宣言されています。これらはフィルタリング、変換、順序付け、およびその他のコレクション処理関数です。

## 共通の操作

共通の操作は、[読み取り専用コレクションとミュータブルコレクション](collections-overview.md#collection-types)の両方で利用可能です。共通の操作は以下のグループに分類されます：

* [変換（Transformations）](collection-transformations.md)
* [フィルタリング（Filtering）](collection-filtering.md)
* [`plus` および `minus` 演算子](collection-plus-minus.md)
* [グループ化（Grouping）](collection-grouping.md)
* [コレクションの一部の取得](collection-parts.md)
* [単一要素の取得](collection-elements.md)
* [順序付け（Ordering）](collection-ordering.md)
* [集計操作（Aggregate operations）](collection-aggregate.md)

これらのページで説明されている操作は、元のコレクションに影響を与えずに結果を返します。例えば、フィルタリング操作は、フィルタリングの述語（predicate）に一致するすべての要素を含む*新しいコレクション*を生成します。このような操作の結果は、変数に格納するか、あるいは他の関数に渡すなど、別の方法で使用する必要があります。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // numbersには何も起こらず、結果は失われます
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // 結果がlongerThan3に格納されます
    println("numbers longer than 3 chars are $longerThan3")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

特定のコレクション操作では、*宛先（destination）*オブジェクトを指定するオプションがあります。宛先とは、関数が結果のアイテムを新しいオブジェクトとして返す代わりに、それらを追加するミュータブルなコレクションのことです。宛先を伴う操作を実行するために、名前に `To` 接尾辞を持つ個別の関数があります。例えば、[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) の代わりに [`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html)、あるいは [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html) の代わりに [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html) などがあります。これらの関数は、宛先コレクションを追加のパラメータとして受け取ります。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  // 宛先オブジェクト
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    println(filterResults) // 両方の操作の結果が含まれます
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

便宜上、これらの関数は宛先コレクションを戻り値として返すため、関数呼び出しの引数内で直接作成することができます。

```kotlin

fun main() {
    val numbers = listOf("one", "two", "three", "four")
//sampleStart
    // 数値を新しいハッシュセットに直接フィルタリングし、
    // 結果の重複を排除します
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

宛先を指定できる関数は、フィルタリング、関連付け（association）、グループ化、フラット化（flattening）、およびその他の操作で利用可能です。宛先操作の完全なリストについては、[Kotlin collections reference](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html) を参照してください。

## 書き込み操作

ミュータブルなコレクションには、コレクションの状態を変更する*書き込み操作（write operations）*もあります。このような操作には、要素の追加、削除、および更新が含まれます。書き込み操作は、[書き込み操作](collection-write.md)のセクション、および[リスト固有の操作](list-operations.md#list-write-operations)と[マップ固有の操作](map-operations.md#map-write-operations)の対応するセクションに記載されています。

特定の操作には、同じ操作を実行するための関数のペアがあります。一方は操作をインプレース（直接）適用し、もう一方は結果を別のコレクションとして返します。例えば、[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html) はミュータブルなコレクションをインプレースでソートするため、その状態が変化します。一方、[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) は同じ要素をソートされた順序で含む新しいコレクションを作成します。

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