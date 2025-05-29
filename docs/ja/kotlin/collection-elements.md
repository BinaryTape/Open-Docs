[//]: # (title: 単一要素の取得)

Kotlinのコレクションは、コレクションから単一要素を取得するための一連の関数を提供します。
このページで説明されている関数は、リストとセットの両方に適用されます。

[リストの定義](collections-overview.md)が示すように、リストは順序付きコレクションです。
したがって、リストのすべての要素には参照に使用できる位置があります。
このページで説明されている関数に加えて、リストはインデックスによって要素を取得および検索するためのより幅広い方法を提供します。
詳細については、[リスト固有の操作](list-operations.md)を参照してください。

一方、セットは[定義](collections-overview.md)により順序付きコレクションではありません。
しかし、Kotlinの`Set`は要素を特定の順序で格納します。
これらは、挿入順序 (`LinkedHashSet`の場合)、自然順序 (`SortedSet`の場合)、または別の順序である場合があります。
セットの要素の順序が不明な場合もあります。
そのような場合でも、要素は何らかの形で順序付けられているため、要素の位置に依存する関数は結果を返します。
ただし、使用されている`Set`の特定の実装を知らない限り、呼び出し元にとってそのような結果は予測不能です。

## 位置による取得

特定の位置にある要素を取得するには、[`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)関数があります。
これを整数を引数として呼び出すと、指定された位置にあるコレクションの要素を受け取ります。
最初の要素の位置は`0`で、最後の要素は`(size - 1)`です。

`elementAt()`は、インデックスアクセスを提供しない、または静的に提供することが知られていないコレクションに役立ちます。
`List`の場合、[インデックスアクセス演算子](list-operations.md#retrieve-elements-by-index) (`get()`または`[]`)を使用する方がより慣用的です。

```kotlin

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // 要素は昇順で格納されます
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

コレクションの最初の要素と最後の要素を取得するための便利なエイリアスもあります: [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
と [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)。

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

存在しない位置の要素を取得する際に例外を回避するには、`elementAt()`の安全なバリエーションを使用します。

*   [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html)は、指定された位置がコレクションの範囲外である場合にnullを返します。
*   [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html)は、さらに`Int`引数をコレクション要素型のインスタンスにマッピングするラムダ関数を受け取ります。
    範囲外の位置で呼び出された場合、`elementAtOrElse()`は指定された値に対するラムダの結果を返します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index -> "インデックス $index の値は未定義です"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 条件による取得

関数[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)と[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)
は、指定された述語に一致する要素をコレクションで検索することもできます。コレクション要素をテストする述語とともに`first()`を呼び出すと、
その述語が`true`を返す最初の要素を受け取ります。
同様に、述語とともに`last()`を呼び出すと、それに一致する最後の要素を返します。

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

述語に一致する要素がない場合、両方の関数は例外をスローします。
これを回避するには、[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
と [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)を使用します。これらは、一致する要素が見つからない場合に`null`を返します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

名前が状況により適している場合は、以下のエイリアスを使用してください。

*   `firstOrNull()`の代わりに[`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html)
*   `lastOrNull()`の代わりに[`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html)

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

要素を取得する前にコレクションをマッピングする必要がある場合、[`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)関数があります。
これは2つのアクションを組み合わせます。
*   セレクター関数でコレクションをマッピングします。
*   結果の最初の非null値を返します。

`firstNotNullOf()`は、結果のコレクションに非null要素がない場合に`NoSuchElementException`をスローします。
この場合にnullを返すには、対となる関数[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)
を使用してください。

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // 各要素を文字列に変換し、必要な長さを持つ最初の要素を返します
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## ランダムな要素

コレクションの任意の要素を取得する必要がある場合は、[`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html)関数を呼び出します。
引数なしで呼び出すか、ランダム性のソースとして[`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)
オブジェクトを渡して呼び出すことができます。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

空のコレクションでは、`random()`は例外をスローします。代わりに`null`を受け取るには、[`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)を使用してください。

## 要素の存在チェック

コレクション内に要素が存在するかどうかを確認するには、[`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html)関数を使用します。
これは、関数引数と`equals()`なコレクション要素がある場合に`true`を返します。
`in`キーワードを使用して`contains()`を演算子形式で呼び出すことができます。

複数のインスタンスの存在を一度にまとめて確認するには、これらのインスタンスのコレクションを引数として[`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html)
を呼び出します。

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

さらに、[`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html)
または [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)を呼び出すことで、コレクションに要素が含まれているかを確認できます。

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