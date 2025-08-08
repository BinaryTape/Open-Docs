[//]: # (title: コレクション変換操作)

Kotlin標準ライブラリは、コレクションの_変換操作_のための拡張関数群を提供します。これらの関数は、提供された変換ルールに基づいて、既存のコレクションから新しいコレクションを構築します。このページでは、利用可能なコレクション変換関数について概要を説明します。

## Map

_マッピング_変換は、別のコレクションの要素に対する関数の結果からコレクションを作成します。基本的なマッピング関数は[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)です。これは、与えられたラムダ関数を各要素に適用し、ラムダの結果のリストを返します。結果の順序は、元の要素の順序と同じです。さらに要素インデックスを引数として使用する変換を適用するには、[`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html)を使用します。

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

変換が特定の要素で`null`を生成する場合、`map()`の代わりに[`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)関数を呼び出すか、`mapIndexed()`の代わりに[`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html)を呼び出すことで、結果のコレクションから`null`を除外できます。

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

マップを変換する場合、2つのオプションがあります。キーを変換し、値を変更しない、あるいはその逆です。キーに特定の変換を適用するには[`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html)を使用し、逆に[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html)は値を変換します。どちらの関数もマップエントリを引数として取る変換を使用するため、そのキーと値の両方を操作できます。

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

## Zip

_ジッピング_変換は、両方のコレクションの同じ位置にある要素からペアを構築することです。Kotlin標準ライブラリでは、これは[`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html)拡張関数によって行われます。

コレクションまたは配列に対して、別のコレクション（または配列）を引数として呼び出すと、`zip()`は`Pair`オブジェクトの`List`を返します。レシーバーコレクションの要素は、これらのペアの最初の要素になります。

コレクションのサイズが異なる場合、`zip()`の結果はより小さい方のサイズになります。より大きいコレクションの最後の要素は結果に含まれません。

`zip()`は中置記法`a zip b`でも呼び出すことができます。

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

`zip()`を、レシーバー要素と引数要素という2つのパラメータを受け取る変換関数と共に呼び出すこともできます。この場合、結果の`List`には、レシーバーと引数要素の同じ位置にあるペアに対して呼び出された変換関数の戻り値が含まれます。

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

`Pair`の`List`がある場合、これらのペアから2つのリストを構築する逆変換（_アンジッピング_）を行うことができます。

*   最初のリストには、元のリストの各`Pair`の最初の要素が含まれます。
*   2番目のリストには、2番目の要素が含まれます。

ペアのリストをアンジップするには、[`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html)を呼び出します。

```kotlin
fun main() {
//sampleStart
    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Associate

_関連付け_変換は、コレクションの要素とそれに関連付けられた特定の値からマップを構築することを可能にします。異なる関連付けの種類では、要素は関連付けマップのキーまたは値のいずれかになります。

基本的な関連付け関数である[`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html)は、元のコレクションの要素をキーとし、与えられた変換関数によってそれらから値が生成される`Map`を作成します。2つの要素が等しい場合、マップには最後の要素のみが残ります。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

コレクション要素を値とするマップを構築するために、[`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html)関数があります。これは、要素の値に基づいてキーを返す関数を取ります。2つの要素のキーが等しい場合、マップには最後の要素のみが残ります。

`associateBy()`は、値変換関数と共に呼び出すこともできます。

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

キーと値の両方がコレクション要素から何らかの形で生成されるマップを構築するもう1つの方法は、[`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)関数です。これは、対応するマップエントリのキーと値である`Pair`を返すラムダ関数を取ります。

`associate()`は短寿命な`Pair`オブジェクトを生成するため、パフォーマンスに影響を与える可能性があることに注意してください。したがって、`associate()`はパフォーマンスが重要でない場合、または他のオプションよりも好ましい場合に使用すべきです。

後者の例としては、キーとそれに対応する値が要素から同時に生成される場合です。

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

ここでは、まず要素に対して変換関数を呼び出し、その関数の結果のプロパティからペアを構築します。

## Flatten

ネストされたコレクションを操作する場合、ネストされたコレクション要素へのフラットなアクセスを提供する標準ライブラリ関数が役立つでしょう。

最初の関数は[`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html)です。これはコレクションのコレクション、例えば`Set`の`List`に対して呼び出すことができます。この関数は、ネストされたコレクションのすべての要素を含む単一の`List`を返します。

```kotlin
fun main() {
//sampleStart
    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

もう1つの関数である[`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html)は、ネストされたコレクションを処理する柔軟な方法を提供します。これは、コレクション要素を別のコレクションにマッピングする関数を取ります。その結果、`flatMap()`は、すべての要素に対する戻り値の単一のリストを返します。したがって、`flatMap()`は、`map()`（マッピング結果がコレクションである場合）と`flatten()`を連続して呼び出すように動作します。

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

## String representation

コレクションの内容を読みやすい形式で取得する必要がある場合は、コレクションを文字列に変換する関数である[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html)と[`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html)を使用します。

`joinToString()`は、提供された引数に基づいてコレクション要素から単一の`String`を構築します。`joinTo()`も同様の処理を行いますが、結果を与えられた[`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html)オブジェクトに追加します。

パラメータのデフォルト値で呼び出された場合、これらの関数はコレクションに対して`toString()`を呼び出した場合と同様の結果を返します。つまり、要素の文字列表現がコンマとスペースで区切られた`String`です。

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

カスタムの文字列表現を構築するには、関数引数`separator`、`prefix`、`postfix`でそのパラメータを指定できます。結果の文字列は`prefix`で始まり、`postfix`で終わります。`separator`は、最後の要素を除く各要素の後に続きます。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

より大きなコレクションの場合、結果に含まれる要素の数である`limit`を指定したい場合があります。コレクションのサイズが`limit`を超えると、残りのすべての要素は`truncated`引数の単一の値に置き換えられます。

```kotlin
fun main() {
//sampleStart
    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

最後に、要素自体の表現をカスタマイズするには、`transform`関数を提供します。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.uppercase()}"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}