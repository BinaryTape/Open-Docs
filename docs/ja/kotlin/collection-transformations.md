[//]: # (title: コレクションの変換操作)

Kotlin標準ライブラリには、コレクションの「変換（transformations）」のための拡張関数のセットが用意されています。
これらの関数は、指定された変換ルールに基づいて、既存のコレクションから新しいコレクションを構築します。
このページでは、利用可能なコレクション変換関数の概要を説明します。

## Map（マッピング）

「マッピング（mapping）」変換は、別のコレクションの要素に対して関数を適用した結果から、新しいコレクションを作成します。
基本的なマッピング関数は [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) です。
これは、各要素に指定されたラムダ関数を適用し、その結果のリストを返します。
結果の順序は、元の要素の順序と同じになります。
変換において要素のインデックスも引数として使用したい場合は、[`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html) を使用します。

```kotlin

fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value -> value * idx })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

変換によって特定の要素に対して `null` が生成される場合、`map()` の代わりに [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 関数を、`mapIndexed()` の代わりに [`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html) を呼び出すことで、結果のコレクションから `null` を取り除くことができます。

```kotlin

fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3)
    println(numbers.mapNotNull { if ( it == 2) null else it * 3 })
    println(numbers.mapIndexedNotNull { idx, value -> if (idx == 0) null else value * idx })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

マップ（Map）を変換する場合、値を変更せずにキーを変換する方法と、その逆の2つのオプションがあります。
キーに特定の変換を適用するには [`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html) を使用し、値の変換には [`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html) を使用します。
どちらの関数も、マップのエントリを引数として受け取る変換を使用するため、キーと値の両方を操作できます。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    println(numbersMap.mapKeys { it.key.uppercase() })
    println(numbersMap.mapValues { it.value + it.key.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Zip（ジッピング）

「ジッピング（Zipping）」変換は、2つのコレクションの同じ位置にある要素からペアを構築します。
Kotlin標準ライブラリでは、これは [`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html) 拡張関数によって行われます。

コレクションまたは配列に対して別のコレクション（または配列）を引数として `zip()` を呼び出すと、`Pair` オブジェクトの `List` が返されます。レシーバーとなったコレクションの要素がペアの最初の要素（first）になります。

コレクションのサイズが異なる場合、`zip()` の結果は小さい方のサイズになり、大きい方のコレクションの末尾の要素は結果に含まれません。

`zip()` は、中置形式 `a zip b` で呼び出すこともできます。

```kotlin

fun main() {
//sampleStart
    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    println(colors zip animals)

    val twoAnimals = listOf("fox", "bear")
    println(colors.zip(twoAnimals))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

また、レシーバーの要素と引数の要素の2つのパラメータを受け取る変換関数を指定して `zip()` を呼び出すこともできます。この場合、結果の `List` には、同じ位置にあるレシーバーと引数の要素のペアに対して呼び出された変換関数の戻り値が含まれます。

```kotlin

fun main() {
//sampleStart
    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    
    println(colors.zip(animals) { color, animal -> "The ${animal.replaceFirstChar { it.uppercase() }} is $color"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`Pair` の `List` がある場合、逆の変換である「アンジッピング（unzipping）」を行って、これらのペアから2つのリストを構築できます。

* 最初のリストには、元のリストの各 `Pair` の最初の要素（first）が含まれます。
* 2番目のリストには、2番目の要素（second）が含まれます。

ペアのリストをアンジップするには、[`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html) を呼び出します。

```kotlin

fun main() {
//sampleStart
    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Associate（アソシエーション）

「アソシエーション（Association）」変換を使用すると、コレクションの要素と、それに関連付けられた特定の値からマップを構築できます。
アソシエーションのタイプによって、要素はマップ内のキーにも値にもなり得ます。

基本的なアソシエーション関数である [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html) は、元のコレクションの要素をキーとし、指定された変換関数によって生成された値をマップの値とする `Map` を作成します。2つの要素が等しい場合、最後の要素だけがマップに残ります。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

コレクションの要素を値としてマップを構築するには、[`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html) 関数を使用します。
これは、要素の値に基づいてキーを返す関数を引数に取ります。2つの要素のキーが等しい場合、最後の要素だけがマップに残ります。

`associateBy()` は、値の変換関数を指定して呼び出すこともできます。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.associateBy { it.first().uppercaseChar() })
    println(numbers.associateBy(keySelector = { it.first().uppercaseChar() }, valueTransform = { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

キーと値の両方をコレクションの要素から何らかの形で生成してマップを構築するもう一つの方法は、[`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html) 関数です。
これは、対応するマップエントリのキーと値を含む `Pair` を返すラムダ関数を引数に取ります。

`associate()` は短命な `Pair` オブジェクトを生成するため、パフォーマンスに影響を与える可能性があることに注意してください。
そのため、`associate()` はパフォーマンスがそれほど重要でない場合や、他のオプションよりも好ましい場合に使用すべきです。

後者の例としては、要素からキーとそれに対応する値が一緒に生成される場合が挙げられます。

```kotlin

fun main() {
data class FullName (val firstName: String, val lastName: String)

fun parseFullName(fullName: String): FullName {
    val nameParts = fullName.split(" ")
    if (nameParts.size == 2) {
        return FullName(nameParts[0], nameParts[1])
    } else throw Exception("Wrong name format")
}

//sampleStart
    val names = listOf("Alice Adams", "Brian Brown", "Clara Campbell")
    println(names.associate { name -> parseFullName(name).let { it.lastName to it.firstName } })  
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ここでは、まず要素に対して変換関数を呼び出し、その関数の結果のプロパティからペアを構築しています。

## Flatten（フラット化）

ネストされたコレクションを操作する場合、ネストされたコレクションの要素へのフラットなアクセスを提供する標準ライブラリ関数が便利です。

最初の関数は [`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html) です。
これは、コレクションのコレクション（例えば `Set` の `List` など）に対して呼び出すことができます。
この関数は、ネストされたコレクションのすべての要素を含む単一の `List` を返します。

```kotlin

fun main() {
//sampleStart
    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

もう一つの関数 [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) は、ネストされたコレクションを処理するための柔軟な方法を提供します。
これは、コレクションの要素を別のコレクションにマッピングする関数を引数に取ります。
結果として、`flatMap()` はすべての要素に対する戻り値を単一のリストとして返します。
つまり、`flatMap()` は `map()`（マッピング結果としてコレクションを返す）の後に `flatten()` を呼び出すのと同じ動作をします。

```kotlin

data class StringContainer(val values: List<String>)

fun main() {
//sampleStart
    val containers = listOf(
        StringContainer(listOf("one", "two", "three")),
        StringContainer(listOf("four", "five", "six")),
        StringContainer(listOf("seven", "eight"))
    )
    println(containers.flatMap { it.values })
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 文字列表現

コレクションの内容を読みやすい形式で取得する必要がある場合は、コレクションを文字列に変換する関数 [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) および [`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html) を使用します。

`joinToString()` は、指定された引数に基づいてコレクションの要素から単一の `String` を構築します。
`joinTo()` も同様のことを行いますが、結果を指定された [`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html) オブジェクトに追加します。

パラメータのデフォルト値で呼び出した場合、これらの関数はコレクションに対して `toString()` を呼び出したときと同様の結果を返します。つまり、要素の文字列表現をカンマとスペースで区切った `String` です。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    
    println(numbers)         
    println(numbers.joinToString())
    
    val listString = StringBuffer("The list of numbers: ")
    numbers.joinTo(listString)
    println(listString)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

カスタムの文字列表現を構築するには、関数の引数 `separator`、`prefix`、および `postfix` でパラメータを指定できます。結果の文字列は `prefix` で始まり、`postfix` で終わります。`separator` は、最後の要素を除く各要素の後に挿入されます。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

大きなコレクションの場合、結果に含まれる要素の数である `limit` を指定したい場合があります。
コレクションのサイズが `limit` を超える場合、他のすべての要素は `truncated` 引数の単一の値に置き換えられます。

```kotlin

fun main() {
//sampleStart
    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

最後に、要素自体の表現をカスタマイズするには、`transform` 関数を指定します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.uppercase()}"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}