[//]: # (title: 排序)

元素的顺序是某些集合类型的重要方面。例如，如果两个包含相同元素的列表顺序不同，则它们不相等。

在 Kotlin 中，可以通过几种方式定义对象的顺序。

首先是 *自然* 顺序。它是为 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 接口的实现定义的。当没有指定其他顺序时，自然顺序用于对它们进行排序。

大多数内置类型都是可比较的：

*   数值类型使用传统的数值顺序：`1` 大于 `0`；`-3.4f` 大于 `-5f`，依此类推。
*   `Char` 和 `String` 使用 [字典顺序](https://en.wikipedia.org/wiki/Lexicographical_order)：`b` 大于 `a`；`world` 大于 `hello`。

要为用户定义类型定义自然顺序，请使该类型实现 `Comparable`。这需要实现 `compareTo()` 函数。`compareTo()` 必须接受另一个相同类型的对象作为实参，并返回一个整数值来显示哪个对象更大：

*   正值表示接收者对象更大。
*   负值表示它小于实参。
*   零表示对象相等。

下面是一个用于对由主版本（major）和次版本（minor）组成的版本号进行排序的类。

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // 中缀形式的 compareTo() 
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

*自定义* 顺序允许您以自己喜欢的方式对任何类型的实例进行排序。特别是，您可以为不可比较的对象定义顺序，或者为可比较类型定义非自然顺序。要为类型定义自定义顺序，请为其创建一个 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)。`Comparator` 包含 `compare()` 函数：它接受一个类的两个实例，并返回它们之间比较的整数结果。结果的解释方式与上述 `compareTo()` 的结果相同。

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有了 `lengthComparator`，您就能够按照字符串的长度而不是默认的字典顺序来排列它们。

定义 `Comparator` 的一种更简便的方法是使用标准库中的 [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html) 函数。`compareBy()` 接受一个 lambda函数，该函数从实例中生成一个 `Comparable` 值，并将自定义顺序定义为生成值的自然顺序。

使用 `compareBy()`，上述示例中的长度比较器如下所示：

```kotlin
fun main() {
//sampleStart    
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您还可以根据多个标准定义顺序。例如，要按长度对字符串进行排序，并在长度相等时按字母顺序排序，可以这样写：

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

由于按多个标准排序是一种常见场景，Kotlin 标准库提供了 [`thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 函数，您可以使用它来添加次要排序规则。

例如，您可以将 `compareBy()` 与 `thenBy()` 结合使用，先按长度对字符串进行排序，然后再按字母顺序排序，就像前面的示例一样：

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

Kotlin 集合软件包提供了按自然、自定义甚至随机顺序对集合进行排序的函数。在此页面上，我们将介绍适用于 [只读](collections-overview.md#collection-types) 集合的排序函数。这些函数将其结果作为包含原始集合元素的新集合返回，并按要求的顺序排列。要了解有关对 [可变](collections-overview.md#collection-types) 集合进行原地排序的函数，请参阅 [List 特有操作](list-operations.md#sort)。

## 自然顺序

基础函数 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 和 [`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html) 返回按其自然顺序升序和降序排列的集合元素。这些函数适用于 `Comparable` 元素的集合。

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
 
对于按自定义顺序排序或对不可比较对象进行排序，可以使用函数 [`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) 和 [`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html)。它们接受一个选择器函数，该函数将集合元素映射到 `Comparable` 值，并按这些值的自然顺序对集合进行排序。

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

要为集合排序定义自定义顺序，您可以提供自己的 `Comparator`。为此，请调用 [`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 函数并传入您的 `Comparator`。使用此函数，按字符串长度排序如下所示：

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

您可以使用 [`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 函数以反转顺序获取集合。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`reversed()` 返回一个包含元素副本的新集合。因此，如果您以后更改原始集合，这不会影响之前获得的 `reversed()` 结果。

另一个反转函数 —— [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) —— 返回同一集合实例的反转视图，因此如果原始列表不会改变，它可能比 `reversed()` 更轻量且更受青睐。

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

如果原始列表是可变的，则其所有更改都会反映在其反转视图中，反之亦然。

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

然而，如果列表的可变性未知或者源代码根本不是列表，则 `reversed()` 更为合适，因为其结果是一个在未来不会改变的副本。

## 随机顺序

最后，还有一个函数可以返回一个包含按随机顺序排列的集合元素的新 `List` —— [`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)。您可以不带参数调用它，也可以传入一个 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 对象。

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}