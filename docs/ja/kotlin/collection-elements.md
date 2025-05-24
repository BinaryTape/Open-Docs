---
title: 単一要素の取得
---
Kotlinのコレクションは、コレクションから単一の要素を取得するための一連の関数を提供します。
このページで説明する関数は、リストとセットの両方に適用されます。

[リストの定義](collections-overview)にあるように、リストは順序付けられたコレクションです。
したがって、リストのすべての要素には、参照に使用できる位置があります。
このページで説明する関数に加えて、リストには、インデックスで要素を取得および検索するためのより幅広い方法が用意されています。
詳細については、[リスト固有の操作](list-operations)を参照してください。

次に、セットは[定義](collections-overview)により順序付けられたコレクションではありません。
ただし、Kotlinの`Set`は、要素を特定の順序で格納します。
これらは、挿入順（`LinkedHashSet`の場合）、自然なソート順（`SortedSet`の場合）、または別の順序です。
要素のセットの順序が不明な場合もあります。
このような場合でも、要素はなんらかの形で順序付けられているため、要素の位置に依存する関数は引き続き結果を返します。
ただし、呼び出し側が使用される`Set`の特定の実装を知らない限り、このような結果は予測できません。

## 位置による取得

特定の位置にある要素を取得するには、[`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)関数があります。
引数として整数を付けて呼び出すと、指定された位置にあるコレクション要素が返されます。
最初の要素の位置は`0`で、最後の要素の位置は`(size - 1)`です。
 
`elementAt()`は、インデックス付きアクセスを提供しないコレクション、または静的に提供することがわかっていないコレクションに役立ちます。
`List`の場合、[インデックス付きアクセス演算子](list-operations#retrieve-elements-by-index)（`get()`または`[]`）を使用する方がより慣用的です。

```kotlin

fun main() {

    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // elements are stored in the ascending order

}
```

コレクションの最初と最後の要素を取得するための便利なエイリアスもあります。[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
と[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)です。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    

}
```

存在しない位置にある要素を取得するときに例外を回避するには、`elementAt()`の安全なバリエーションを使用します。

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html)は、指定された位置がコレクションの範囲外にある場合にnullを返します。
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html)は、`Int`引数をコレクション要素型のインスタンスにマップするラムダ関数も受け取ります。
   範囲外の位置で呼び出されると、`elementAtOrElse()`は、指定された値に対するラムダの結果を返します。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index `->` "The value for index $index is undefined"})

}
```

## 条件による取得

関数[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)と[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)
では、指定された述語に一致する要素のコレクションを検索することもできます。述語を使用して`first()`を呼び出すと、
コレクション要素をテストし、述語が`true`を生成する最初の要素が返されます。
次に、述語を持つ`last()`は、それに一致する最後の要素を返します。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })

}
```

述語に一致する要素がない場合、両方の関数は例外をスローします。
それらを回避するには、代わりに[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
と[`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)を使用します。
一致する要素が見つからない場合は、`null`を返します。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })

}
```

状況に合わせて名前がより適している場合は、エイリアスを使用します。

* `firstOrNull()`の代わりに[`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html)
* `lastOrNull()`の代わりに[`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html)

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })

}
```

## セレクターによる取得

要素を取得する前にコレクションをマップする必要がある場合は、[`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)関数があります。
これは、次の2つのアクションを組み合わせたものです。
- セレクター関数を使用してコレクションをマップします
- 結果の最初の非null値を返します

結果のコレクションにnull許容でない要素がない場合、`firstNotNullOf()`は`NoSuchElementException`をスローします。
この場合、nullを返すには、対応する[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)を使用します。

```kotlin
fun main() {

    val list = listOf<Any>(0, "true", false)
    // Converts each element to string and returns the first one that has required length
    val longEnough = list.firstNotNullOf { item `->` item.toString().takeIf { it.length >= 4 } }
    println(longEnough)

}
```

## ランダムな要素

コレクションの任意の要素を取得する必要がある場合は、[`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html)関数を呼び出します。
引数なしで、またはランダム性のソースとして[`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)
オブジェクトを指定して呼び出すことができます。

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())

}
```

空のコレクションでは、`random()`は例外をスローします。代わりに`null`を受け取るには、[`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)を使用します。

## 要素の存在の確認

コレクション内の要素の存在を確認するには、[`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html)関数を使用します。
関数引数と`equals()`コレクション要素がある場合は、`true`を返します。
`in`キーワードを使用して、演算子形式で`contains()`を呼び出すことができます。

複数のインスタンスが一度に一緒に存在するかどうかを確認するには、これらのインスタンスのコレクションを引数として指定して、[`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html)を呼び出します。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)
    
    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))

}
```

さらに、[`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html)
または[`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)を呼び出して、コレクションに要素が含まれているかどうかを確認できます。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())
    
    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())

}
```