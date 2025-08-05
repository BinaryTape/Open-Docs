[//]: # (title: 排序)

元素的顺序是某些集合类型的一个重要方面。例如，如果两个 list 的元素顺序不同，即使它们包含相同的元素，两者也不相等。

在 Kotlin 中，对象的顺序可以通过多种方式定义。

首先，有_自然_顺序。它为 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 接口的实现定义。当未指定其他顺序时，自然顺序用于对它们进行排序。

大多数内置类型都是可比较的：

*   数字类型使用传统的数值顺序：`1` 大于 `0`；`-3.4f` 大于 `-5f`，等等。
*   `Char` 和 `String` 使用[字典序](https://en.wikipedia.org/wiki/Lexicographical_order)：`b` 大于 `a`；`world` 大于 `hello`。

要为用户自定义类型定义自然顺序，请使该类型成为 `Comparable` 的实现者。这需要实现 `compareTo()` 函数。 `compareTo()` 必须接受另一个相同类型的对象作为实参，并返回一个整数值，指示哪个对象更大：

*   正值表示接收者对象更大。
*   负值表示它小于实参。
*   零表示对象相等。

下面是一个用于对由主版本和次版本组成版本进行排序的类。

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // compareTo() 的中缀形式 
        this.minor != other.minor -> this.minor compareTo other.minor
        else -> 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

_自定义_顺序允许你以喜欢的方式对任何类型的实例进行排序。特别是，你可以为不可比较的对象定义顺序，或者为可比较的类型定义除自然顺序以外的其他顺序。要为类型定义自定义顺序，请为其创建一个 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)。 `Comparator` 包含 `compare()` 函数：它接受一个类的两个实例，并返回它们之间比较的整数结果。结果的解释方式与上述 `compareTo()` 的结果相同。

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有了 `lengthComparator`，你可以根据字符串的长度而不是默认的字典序来排列字符串。

定义 `Comparator` 的一种更短的方法是使用标准库中的 [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html) 函数。 `compareBy()` 接受一个 lambda 函数，该函数从实例生成一个 `Comparable` 值，并将自定义顺序定义为生成值的自然顺序。

使用 `compareBy()`，上面示例中的长度比较器看起来像这样：

```kotlin
fun main() {
//sampleStart    
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你还可以根据多个条件定义顺序。例如，要根据字符串的长度进行排序，并在长度相等时按字母顺序排序，你可以这样写：

```kotlin
fun main() {
//sampleStart
    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith { a, b -> 
           when (val compareLengths = a.length.compareTo(b.length)) {
             0 -> a.compareTo(b)
             else -> compareLengths
           }
         }

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

由于按多个条件排序是常见场景，Kotlin 标准库提供了 [`thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 函数，你可以使用它添加次级排序规则。

例如，你可以将 `compareBy()` 与 `thenBy()` 结合使用，先按长度排序字符串，然后按字母顺序排序，就像前面的示例一样：

```kotlin
fun main() {
//sampleStart
    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith(compareBy<String> { it.length }.thenBy { it })

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Kotlin 集合包提供了用于按自然顺序、自定义顺序甚至随机顺序对集合进行排序的函数。在本页中，我们将描述适用于[只读](collections-overview.md#collection-types)集合的排序函数。这些函数返回一个新集合作为其结果，新集合包含原始集合中按请求顺序排列的元素。要了解用于就地排序[可变](collections-overview.md#collection-types)集合的函数，请参阅 [List-specific operations](list-operations.md#sort)。

## 自然顺序

基本函数 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 和 [`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html) 返回按自然顺序升序和降序排列的集合元素。这些函数适用于 `Comparable` 元素的集合。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 自定义顺序

对于自定义顺序排序或对不可比较对象排序，可以使用函数 [`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) 和 [`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html)。它们接受一个选择器函数，该函数将集合元素映射到 `Comparable` 值，并按这些值的自然顺序对集合进行排序。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedByLast")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要为集合排序定义自定义顺序，你可以提供自己的 `Comparator`。为此，请调用 [`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 函数并传入你的 `Comparator`。使用此函数，按长度排序字符串看起来像这样：

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 反转顺序

你可以使用 [`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 函数以反转顺序检索集合。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`reversed()` 返回一个包含元素副本的新集合。因此，如果你稍后更改原始集合，这不会影响之前通过 `reversed()` 获得的结果。

另一个反转函数 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) 返回同一集合实例的反转视图，因此如果原始 list 不会改变，它可能比 `reversed()` 更轻量且更受青睐。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果原始 list 是可变的，则它的所有更改都会反映在其反转视图中，反之亦然。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

然而，如果 list 的可变性未知，或者源根本不是一个 list，那么 `reversed()` 更受青睐，因为其结果是一个未来不会改变的副本。

## 随机顺序

最后，有一个函数返回一个包含集合元素随机顺序的新 `List` — [`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)。你可以不带实参调用它，也可以带一个 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 对象调用它。

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}