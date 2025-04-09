---
title: 排序
---
元素的顺序是某些集合类型的一个重要方面。
例如，如果两个列表包含相同的元素，但元素的顺序不同，则它们是不相等的。

在 Kotlin 中，对象的顺序可以通过几种方式定义。

首先，存在_自然_顺序。 它为 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)
接口的实现定义。 当未指定其他顺序时，自然顺序用于对它们进行排序。

大多数内置类型都是可比较的：

* 数值类型使用传统的数值顺序：`1` 大于 `0`；`-3.4f` 大于 `-5f`，依此类推。
* `Char` 和 `String` 使用[字典顺序](https://en.wikipedia.org/wiki/Lexicographical_order)：`b` 大于
   `a`；`world` 大于 `hello`。

要为用户定义的类型定义自然顺序，请使该类型实现 `Comparable`。
这需要实现 `compareTo()` 函数。 `compareTo()` 必须接受相同类型的另一个对象作为参数
并返回一个整数值，以显示哪个对象更大：

* 正值表示接收器对象更大。
* 负值表示它小于参数。
* 零表示对象相等。

下面是一个用于对由主版本号和次版本号组成的版本进行排序的类。

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major `->` this.major compareTo other.major // compareTo() in the infix form 
        this.minor != other.minor `->` this.minor compareTo other.minor
        else `->` 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
```

_自定义_顺序允许你以你喜欢的方式对任何类型的实例进行排序。
特别是，你可以为不可比较的对象定义顺序，或者为可比较的类型定义不同于自然的顺序。
要为类型定义自定义顺序，请为其创建一个 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)。
`Comparator` 包含 `compare()` 函数：它接受一个类的两个实例并返回它们之间比较的整数结果。
结果的解释方式与上面描述的 `compareTo()` 的结果相同。

```kotlin
fun main() {

    val lengthComparator = Comparator { str1: String, str2: String `->` str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))

}
```

有了 `lengthComparator`，你就可以按字符串的长度而不是默认的字典顺序排列字符串。

定义 `Comparator` 的一种更短的方法是标准库中的 [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html)
函数。 `compareBy()` 接受一个 lambda 函数，该函数从一个实例生成一个 `Comparable` 值
并将自定义顺序定义为生成的值的自然顺序。

使用 `compareBy()`，上面示例中的长度比较器如下所示：

```kotlin
fun main() {

    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))

}
```

你还可以定义基于多个标准的顺序。
例如，要按字符串的长度排序，并在长度相等时按字母顺序排序，你可以编写：

```kotlin
fun main() {

    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith { a, b `->` 
           when (val compareLengths = a.length.compareTo(b.length)) {
             0 `->` a.compareTo(b)
             else `->` compareLengths
           }
         }

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]

}
```

由于按多个标准排序是一种常见的场景，因此 Kotlin 标准库提供了 [`thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 函数，你可以使用它来添加辅助排序规则。

例如，你可以将 `compareBy()` 与 `thenBy()` 结合使用，以首先按长度排序字符串，然后按字母顺序排序，就像在前面的示例中一样：

```kotlin
fun main() {

    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith(compareBy<String> { it.length }.thenBy { it })

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]

}
```

Kotlin 集合包提供了用于以自然顺序、自定义顺序甚至随机顺序对集合进行排序的函数。
在本页中，我们将介绍适用于[只读](collections-overview#collection-types)集合的排序函数。
这些函数将其结果作为新集合返回，该集合包含原始集合的元素，并按请求的顺序排列。
要了解有关对[可变](collections-overview#collection-types)集合进行原地排序的函数，请参阅[特定于列表的操作](list-operations#sort)。

## 自然顺序

基本函数 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 和 [`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html)
返回集合的元素，这些元素根据其自然顺序排序为升序和降序序列。
这些函数适用于 `Comparable` 元素的集合。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")

}
```

## 自定义顺序
 
对于自定义顺序的排序或不可比较对象的排序，有函数 [`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) 和 [`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html)。
它们接受一个选择器函数，该函数将集合元素映射到 `Comparable` 值，并按该值的自然顺序对集合进行排序。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedByLast")

}
```

要为集合排序定义自定义顺序，你可以提供自己的 `Comparator`。
为此，请调用 [`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 函数并传入你的 `Comparator`。
使用此函数，按长度对字符串进行排序如下所示：

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")

}
```

## 逆序

你可以使用 [`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 函数以相反的顺序检索集合。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())

}
```

`reversed()` 返回一个新集合，其中包含元素的副本。
因此，如果你稍后更改原始集合，这不会影响先前获得的 `reversed()` 的结果。

另一个反转函数 - [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)
- 返回同一集合实例的反转视图，因此如果原始列表不会更改，则它可能更轻量级且更可取，而不是 `reversed()`。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)

}
```

如果原始列表是可变的，则其所有更改都会反映在其反转视图中，反之亦然。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)

}
```

但是，如果列表的可变性未知或源根本不是列表，则 `reversed()` 更可取
因为它的结果是一个副本，将来不会更改。

## 随机顺序

最后，有一个函数返回一个新的 `List`，其中包含集合元素，并以随机顺序排列 - [`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)。
你可以不带参数或使用 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 对象来调用它。

```kotlin
fun main() {

     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())

}
```