[//]: # (title: 単一要素の取得)

Kotlinのコレクションには、コレクションから単一の要素を取得するための関数セットが用意されています。
このページで説明する関数は、リストとセットの両方に適用されます。

[リストの定義](collections-overview.md)にある通り、リストは順序付けられたコレクションです。
そのため、リストの各要素には参照に使用できる位置（インデックス）があります。
このページで説明する関数に加えて、リストではインデックスによって要素を取得したり検索したりするためのより幅広い方法が提供されています。
詳細は[リスト固有の操作](list-operations.md)を参照してください。

一方、セットは[定義](collections-overview.md)上、順序付けられていないコレクションです。
しかし、Kotlinの`Set`は特定の順序で要素を格納します。
これには、挿入順（`LinkedHashSet`の場合）、自然順序付け（`SortedSet`の場合）、またはその他の順序があります。
要素のセットの順序が不明な場合もあります。
そのような場合でも、要素は何らかの形で順序付けられているため、要素の位置に依存する関数は結果を返します。
ただし、使用されている`Set`の具体的な実装を知らない限り、そのような結果は呼び出し元にとって予測不能です。

## 位置による取得

特定の順序（位置）にある要素を取得するために、[`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)関数があります。
整数を引数として呼び出すと、指定された位置にあるコレクションの要素が返されます。
最初の要素の位置は`0`で、最後の要素は`(size - 1)`です。

`elementAt()`は、インデックスによるアクセスを提供していないコレクションや、静的に提供されているか不明な場合に便利です。
`List`の場合は、[インデックスアクセス演算子](list-operations.md#retrieve-elements-by-index)（`get()`または`[]`）を使用するのがより慣用的です。

```kotlin

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // 要素は昇順で格納されている
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

また、コレクションの最初と最後の要素を取得するための便利なエイリアスとして、[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)と[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)も用意されています。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

存在しない位置の要素を取得する際の例外を避けるには、`elementAt()`の安全なバリエーションを使用します：

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html) は、指定された位置がコレクションの境界外の場合にnullを返します。
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html) は、さらに `Int` 引数をコレクションの要素型のインスタンスにマップするラムダ関数を受け取ります。境界外の位置で呼び出された場合、`elementAtOrElse()`はその位置に対するラムダの結果を返します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index -> "The value for index $index is undefined"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 条件による取得

関数 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) および [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)
を使用すると、指定された述語（predicate）に一致する要素をコレクションから検索することもできます。
コレクションの要素をテストする述語を指定して `first()` を呼び出すと、その述語が `true` を返す最初の要素が返されます。
同様に、述語を指定した `last()` は、それに一致する最後の要素を返します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

述語に一致する要素がない場合、どちらの関数も例外をスローします。
これを避けるには、代わりに [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
と [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html) を使用してください。
これらは一致する要素が見つからない場合に `null` を返します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

状況に応じて名前がより適切な場合は、以下のエイリアスを使用してください：

* `firstOrNull()` の代わりに [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html)
* `lastOrNull()` の代わりに [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html)

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## セレクターによる取得

要素を取得する前にコレクションをマップ（変換）する必要がある場合は、[`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) という関数があります。
これは以下の2つのアクションを組み合わせたものです：
- セレクター関数でコレクションをマップする
- 結果の中の最初の非null値を返す

`firstNotNullOf()` は、結果のコレクションに非null要素がない場合に `NoSuchElementException` をスローします。
この場合に null を返したい場合は、対になる [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html) を使用してください。

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // 各要素を文字列に変換し、必要な長さを持つ最初の要素を返す
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## ランダムな要素

コレクションの任意の要素を取得する必要がある場合は、[`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 関数を呼び出します。
引数なしで呼び出すことも、乱数生成のソースとして [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) オブジェクトを指定して呼び出すこともできます。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

空のコレクションに対して `random()` を呼び出すと、例外がスローされます。代わりに `null` を受け取るには、[`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html) を使用してください。

## 要素の存在確認

コレクション内に要素が存在するかどうかを確認するには、[`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) 関数を使用します。
引数と `equals()` になるコレクション要素がある場合に `true` を返します。
`contains()` は `in` キーワードを使用した演算子の形式で呼び出すことができます。

複数のインスタンスが一度に含まれているかどうかを確認するには、それらのインスタンスのコレクションを引数として [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html) を呼び出します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)
    
    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

さらに、[`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html) または [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) を呼び出すことで、コレクションに要素が含まれているかどうかを確認できます。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())
    
    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}