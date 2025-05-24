---
title: コレクション変換操作
---
Kotlin標準ライブラリは、コレクションの _変換 (transformations)_ のための拡張関数群を提供します。
これらの関数は、与えられた変換ルールに基づいて、既存のコレクションから新しいコレクションを構築します。
このページでは、利用可能なコレクション変換関数の概要を説明します。

## Map

_マッピング (mapping)_ 変換は、別のコレクションの要素に対する関数の結果からコレクションを作成します。
基本的なマッピング関数は [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) です。
これは、与えられたラムダ関数を後続の各要素に適用し、ラムダの結果のリストを返します。
結果の順序は、要素の元の順序と同じです。
要素のインデックスを引数として追加で使用する変換を適用するには、[`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html) を使用します。

```kotlin

fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value `->` value * idx })

}
```

特定の要素に対して変換が `null` を生成する場合、`map()` の代わりに [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 関数を呼び出すか、`mapIndexed()` の代わりに [`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html) を呼び出すことで、結果のコレクションから `null` をフィルタリングできます。

```kotlin

fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.mapNotNull { if ( it == 2) null else it * 3 })
    println(numbers.mapIndexedNotNull { idx, value `->` if (idx == 0) null else value * idx })

}
```

マップを変換する場合、値を変更せずにキーを変換するか、またはその逆の2つのオプションがあります。
与えられた変換をキーに適用するには、[`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html) を使用します。
次に、[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html) は値を変換します。
どちらの関数も、マップエントリを引数として取る変換を使用するため、キーと値の両方を操作できます。

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    println(numbersMap.mapKeys { it.key.uppercase() })
    println(numbersMap.mapValues { it.value + it.key.length })

}
```

## Zip

_ジップ (zipping)_ 変換は、両方のコレクションで同じ位置にある要素からペアを構築します。
Kotlin標準ライブラリでは、これは [`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html) 拡張関数によって行われます。

コレクションまたは配列で、別のコレクション（または配列）を引数として呼び出されると、`zip()` は `Pair` オブジェクトの `List` を返します。
レシーバーコレクションの要素は、これらのペアの最初の要素です。

コレクションのサイズが異なる場合、`zip()` の結果は小さい方のサイズになります。大きい方のコレクションの最後の要素は結果に含まれません。

`zip()` は、infix形式 `a zip b` で呼び出すこともできます。

```kotlin

fun main() {

    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    println(colors zip animals)

    val twoAnimals = listOf("fox", "bear")
    println(colors.zip(twoAnimals))

}
```

2つのパラメータ（レシーバー要素と引数要素）を取る変換関数を使用して `zip()` を呼び出すこともできます。
この場合、結果の `List` には、同じ位置にあるレシーバー要素と引数要素のペアで呼び出される変換関数の戻り値が含まれます。

```kotlin

fun main() {

    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    
    println(colors.zip(animals) { color, animal `->` "The ${animal.replaceFirstChar { it.uppercase() }} is $color"})

}
```

`Pair` の `List` がある場合、逆の変換（_unzipping_）を実行できます。これは、これらのペアから2つのリストを構築します。

* 最初のリストには、元のリストの各 `Pair` の最初の要素が含まれています。
* 2番目のリストには、2番目の要素が含まれています。

ペアのリストをunzipするには、[`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html) を呼び出します。

```kotlin

fun main() {

    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())

}
```

## Associate

_関連付け (association)_ 変換を使用すると、コレクション要素とそれらに関連付けられた特定の値からマップを構築できます。
さまざまな関連付けタイプでは、要素は関連付けマップのキーまたは値のいずれかになります。

基本的な関連付け関数 [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html) は、元のコレクションの要素がキーであり、値が与えられた変換関数によって生成される `Map` を作成します。
2つの要素が等しい場合、最後の要素のみがマップに残ります。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })

}
```

コレクション要素を値として持つマップを構築するには、関数 [`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html) があります。
これは、要素の値に基づいてキーを返す関数を取ります。2つの要素のキーが等しい場合、最後の要素のみがマップに残ります。

`associateBy()` は、値変換関数とともに呼び出すこともできます。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")

    println(numbers.associateBy { it.first().uppercaseChar() })
    println(numbers.associateBy(keySelector = { it.first().uppercaseChar() }, valueTransform = { it.length }))

}
```

キーと値の両方がコレクション要素から何らかの方法で生成されるマップを構築する別の方法は、関数 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html) です。
これは、対応するマップエントリのキーと値を返すラムダ関数を取ります。

`associate()` は短寿命の `Pair` オブジェクトを生成するため、パフォーマンスに影響を与える可能性があることに注意してください。
したがって、`associate()` は、パフォーマンスが重要でない場合、または他のオプションよりも優先される場合に使用する必要があります。

後者の例は、キーと対応する値が要素から一緒に生成される場合です。

```kotlin

fun main() {
data class FullName (val firstName: String, val lastName: String)

fun parseFullName(fullName: String): FullName {
    val nameParts = fullName.split(" ")
    if (nameParts.size == 2) {
        return FullName(nameParts[0], nameParts[1])
    } else throw Exception("Wrong name format")
}

    val names = listOf("Alice Adams", "Brian Brown", "Clara Campbell")
    println(names.associate { name `->` parseFullName(name).let { it.lastName to it.firstName } })  

}
```

ここでは、最初に要素に対して変換関数を呼び出し、次にその関数の結果のプロパティからペアを構築します。

## Flatten

ネストされたコレクションを操作する場合、ネストされたコレクション要素へのフラットアクセスを提供する標準ライブラリ関数が役立つ場合があります。

最初の関数は [`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html) です。
コレクションのコレクション、たとえば `Set` の `List` で呼び出すことができます。
この関数は、ネストされたコレクションのすべての要素の単一の `List` を返します。

```kotlin

fun main() {

    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())

}
```

別の関数である [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) は、ネストされたコレクションを処理する柔軟な方法を提供します。
これは、コレクション要素を別のコレクションにマップする関数を取ります。
その結果、`flatMap()` は、すべての要素に対する戻り値の単一のリストを返します。
したがって、`flatMap()` は、`map()`（マッピング結果としてのコレクション）と `flatten()` の後続の呼び出しとして動作します。

```kotlin

data class StringContainer(val values: List<String>)

fun main() {

    val containers = listOf(
        StringContainer(listOf("one", "two", "three")),
        StringContainer(listOf("four", "five", "six")),
        StringContainer(listOf("seven", "eight"))
    )
    println(containers.flatMap { it.values })

}

```

## String representation

コレクションの内容を読みやすい形式で取得する必要がある場合は、コレクションを文字列に変換する関数を使用します。[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) と [`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html) です。

`joinToString()` は、指定された引数に基づいて、コレクション要素から単一の `String` を構築します。
`joinTo()` は同じことを行いますが、結果を与えられた [`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html) オブジェクトに追加します。

デフォルトの引数で呼び出されると、関数はコレクションで `toString()` を呼び出すのと同様の結果を返します。
要素の文字列表現の `String` は、スペース付きのカンマで区切られています。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    
    println(numbers)         
    println(numbers.joinToString())
    
    val listString = StringBuffer("The list of numbers: ")
    numbers.joinTo(listString)
    println(listString)

}
```

カスタム文字列表現を構築するには、関数引数 `separator`、`prefix`、および `postfix` でそのパラメータを指定できます。
結果の文字列は `prefix` で始まり、`postfix` で終わります。`separator` は、最後の要素を除く各要素の後に付加されます。

```kotlin

fun main() \{

    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))

\}
```

より大きなコレクションの場合、`limit`（結果に含まれる要素の数）を指定できます。
コレクションのサイズが `limit` を超える場合、他のすべての要素は `truncated` 引数の単一の値に置き換えられます。

```kotlin

fun main() {

    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))

}
```

最後に、要素自体の表現をカスタマイズするには、`transform` 関数を提供します。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.uppercase()}"})

}
```