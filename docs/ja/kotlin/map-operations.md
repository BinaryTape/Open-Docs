[//]: # (title: マップ固有の操作)

[マップ](collections-overview.md#map)では、キーと値の両方の型がユーザー定義です。
マップエントリへのキーベースのアクセスにより、キーによる値の取得からキーと値の個別のフィルタリングまで、さまざまなマップ固有の処理機能が利用可能になります。
このページでは、標準ライブラリのマップ処理関数について説明します。

## キーと値の取得

マップから値を取得するには、[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 関数の引数としてそのキーを提供する必要があります。
省略記法である `[key]` もサポートされています。指定されたキーが見つからない場合、`null` を返します。
また、[`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html) 関数もあり、これはわずかに異なる動作をします。マップにキーが見つからない場合、例外をスローします。
さらに、キーが存在しない場合を処理するために、2つのオプションがあります。

*   [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) はリストの場合と同じように機能し、存在しないキーの値は指定されたラムダ関数から返されます。
*   [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html) は、キーが見つからない場合に指定されたデフォルト値を返します。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.get("one"))
    println(numbersMap["one"])
    println(numbersMap.getOrDefault("four", 10))
    println(numbersMap["five"])               // null
    //numbersMap.getValue("six")      // exception!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

マップのすべてのキーまたはすべての値に対して操作を実行するには、プロパティ `keys` および `values` からそれぞれ取得できます。
`keys` はすべてのマップキーのセットであり、`values` はすべてのマップ値のコレクションです。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.keys)
    println(numbersMap.values)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## フィルタリング

他のコレクションと同様に、[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 関数を使用してマップを[フィルタリング](collection-filtering.md)できます。
マップで `filter()` を呼び出す際、`Pair` を引数とする述語を渡します。
これにより、フィルタリング述語でキーと値の両方を使用できます。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

マップをフィルタリングするには、キーと値による2つの具体的な方法もあります。
それぞれの方法に対して、[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) と [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html) の関数があります。
どちらも、指定された述語に一致するエントリの新しいマップを返します。
`filterKeys()` の述語は要素のキーのみをチェックし、`filterValues()` の述語は値のみをチェックします。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredKeysMap = numbersMap.filterKeys { it.endsWith("1") }
    val filteredValuesMap = numbersMap.filterValues { it < 10 }

    println(filteredKeysMap)
    println(filteredValuesMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 加算および減算演算子

要素へのキーアクセスにより、[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) および [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 演算子は、他のコレクションとは異なる動作をします。
`plus` は、その両方のオペランド（左側の `Map` と、右側の `Pair` または別の `Map`）の要素を含む `Map` を返します。
右辺のオペランドが左辺の `Map` に存在するキーを持つエントリを含む場合、結果のマップには右側のエントリが含まれます。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap + Pair("four", 4))
    println(numbersMap + Pair("one", 10))
    println(numbersMap + mapOf("five" to 5, "one" to 11))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`minus` は、左側の `Map` のエントリから、右辺のオペランドのキーを持つものを除いた `Map` を作成します。
したがって、右辺のオペランドは、単一のキー、またはリスト、セットなどのキーのコレクションのいずれかになります。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap - "one")
    println(numbersMap - listOf("two", "four"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ミュータブルマップ（可変マップ）での [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) および [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 演算子の使用に関する詳細は、以下の[マップの書き込み操作](#map-write-operations)を参照してください。

## マップの書き込み操作

[ミュータブル](collections-overview.md#collection-types)マップは、マップ固有の書き込み操作を提供します。
これらの操作により、キーベースの値へのアクセスを使用してマップの内容を変更できます。

マップの書き込み操作を定義する特定のルールがあります。

*   値は更新できます。一方、キーは決して変更されません。エントリを追加すると、そのキーは一定です。
*   各キーには、常に単一の値が関連付けられています。エントリ全体を追加および削除できます。

以下は、ミュータブルマップで利用可能な書き込み操作のための標準ライブラリ関数の説明です。

### エントリの追加と更新

ミュータブルマップに新しいキーと値のペアを追加するには、[`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html) を使用します。
新しいエントリが `LinkedHashMap`（デフォルトのマップ実装）に追加されると、マップをイテレートする際に最後に来るように追加されます。ソートされたマップでは、新しい要素の位置はキーの順序によって定義されます。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

一度に複数のエントリを追加するには、[`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html) を使用します。
その引数は `Map` または `Pair` のグループ（`Iterable`、`Sequence`、または `Array`）にすることができます。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.putAll(setOf("four" to 4, "five" to 5))
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`put()` と `putAll()` はどちらも、指定されたキーがすでにマップに存在する場合、値を上書きします。したがって、これらを使用してマップエントリの値を更新できます。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}")
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

省略形演算子形式を使用して、マップに新しいエントリを追加することもできます。2つの方法があります。

*   [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 演算子。
*   `set()` の `[]` 演算子のエイリアス。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // calls numbersMap.put("three", 3)
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

マップに存在するキーで呼び出された場合、演算子は対応するエントリの値を上書きします。

### エントリの削除

ミュータブルマップからエントリを削除するには、[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 関数を使用します。
`remove()` を呼び出す際、キーまたはキーと値のペア全体を渡すことができます。
キーと値の両方を指定した場合、このキーを持つ要素は、その値が2番目の引数と一致する場合にのみ削除されます。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            //doesn't remove anything
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

キーまたは値によってミュータブルマップからエントリを削除することもできます。
これを行うには、マップのキーまたは値に対して `remove()` を呼び出し、エントリのキーまたは値を提供します。
値に対して呼び出された場合、`remove()` は指定された値を持つ最初のエントリのみを削除します。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)
    numbersMap.keys.remove("one")
    println(numbersMap)
    numbersMap.values.remove(3)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 演算子もミュータブルマップで利用できます。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             //doesn't remove anything
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}