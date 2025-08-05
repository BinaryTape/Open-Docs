[//]: # (title: 単一要素を取得する)

Kotlinのコレクションは、コレクションから単一要素を取得するための一連の関数を提供します。このページで説明されている関数は、リストとセットの両方に適用されます。

[リストの定義](collections-overview.md)が示すように、リストは順序付けられたコレクションです。そのため、リストの各要素は、参照に使用できる位置を持っています。このページで説明されている関数に加えて、リストはインデックスによって要素を取得および検索するための、より広範な方法を提供します。詳細については、[リスト固有の操作](list-operations.md)を参照してください。

一方、セットは[定義](collections-overview.md)上、順序付けられたコレクションではありません。しかし、Kotlinの`Set`は要素を特定の順序で格納します。これらは、挿入順序 (`LinkedHashSet`の場合)、自然なソート順序 (`SortedSet`の場合)、またはその他の順序である可能性があります。セットの要素の順序が不明な場合もあります。そのような場合でも、要素はなんらかの形で順序付けられているため、要素の位置に依存する関数は結果を返します。ただし、呼び出し元が使用されている`Set`の特定の実装を知らない限り、そのような結果は予測不可能です。

## 位置による取得

特定の位置の要素を取得するには、[`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)関数があります。整数を引数として呼び出すと、指定された位置にあるコレクション要素が返されます。最初の要素は位置`0`、最後の要素は`(size - 1)`です。

`elementAt()`は、インデックスによるアクセスを提供しない、または静的に提供することが知られていないコレクションに役立ちます。`List`の場合、[インデックスによるアクセス演算子](list-operations.md#retrieve-elements-by-index) (`get()`または`[]`)を使用する方がKotlinらしい書き方です。

```kotlin

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // elements are stored in the ascending order
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

コレクションの最初と最後の要素を取得するための便利なエイリアスも存在します: [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)と[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)。

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

存在しない位置で要素を取得する際に例外を避けるには、`elementAt()`の安全なバリエーションを使用します:

*   [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html)は、指定された位置がコレクションの範囲外である場合にnullを返します。
*   [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html)は、`Int`引数をコレクション要素型のインスタンスにマッピングするラムダ関数をさらに受け取ります。範囲外の位置で呼び出された場合、`elementAtOrElse()`は指定された値に対するラムダの結果を返します。

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

[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)関数と[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)関数は、指定された述語に一致する要素をコレクション内で検索することもできます。コレクション要素をテストする述語を指定して`first()`を呼び出すと、その述語が`true`を返す最初の要素が取得されます。一方、述語を指定した`last()`は、それに一致する最後の要素を返します。

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

述語に一致する要素がない場合、両方の関数は例外をスローします。これを避けるには、代わりに[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)と[`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)を使用します。これらは一致する要素が見つからない場合は`null`を返します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

名前が状況により適している場合は、次のエイリアスを使用してください:

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

要素を取得する前にコレクションをマップする必要がある場合、[`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)関数があります。これは2つのアクションを組み合わせます:
- セレクター関数でコレクションをマップする
- 結果内の最初の非null値を返す

結果のコレクションにnull許容でない要素がない場合、`firstNotNullOf()`は`NoSuchElementException`をスローします。この場合、nullを返すには対応する[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)を使用します。

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // Converts each element to string and returns the first one that has required length
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## 任意の要素

コレクションの任意の要素を取得する必要がある場合は、[`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html)関数を呼び出します。引数なしで呼び出すことも、乱数のソースとして[`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)オブジェクトを指定して呼び出すこともできます。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

空のコレクションの場合、`random()`は例外をスローします。代わりに`null`を受け取るには、[`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)を使用します。

## 要素の存在チェック

コレクション内に要素が存在するかどうかを確認するには、[`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html)関数を使用します。これは、関数引数と`equals()`であるコレクション要素が存在する場合、`true`を返します。`in`キーワードを使用して演算子形式で`contains()`を呼び出すこともできます。

複数のインスタンスが一度に存在するかどうかを確認するには、これらのインスタンスのコレクションを引数として[`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html)を呼び出します。

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

さらに、コレクションに要素が含まれているかどうかは、[`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html)または[`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)を呼び出すことで確認できます。

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