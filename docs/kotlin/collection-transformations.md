[//]: # (title: 集合转换操作)

Kotlin 标准库为集合*转换*提供了一组扩展函数。
这些函数根据提供的转换规则，从现有集合构建新集合。
在本页面中，我们将概述可用的集合转换函数。

## Map

*映射*转换根据另一个集合的元素上的函数结果创建一个集合。
基本的映射函数是 [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)。
它将给定的 lambda 函数应用于每个后续元素，并返回 lambda 结果的列表。
结果的顺序与原始元素的顺序相同。
要应用额外使用元素索引作为实参的转换，请使用 [`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html)。  

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

如果转换在某些元素上产生 `null`，你可以通过调用 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 函数（代替 `map()`）或 [`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html)（代替 `mapIndexed()`）从结果集合中过滤掉 `null`。

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

在转换 map 时，你有两种选择：转换键而保持值不变，或者反之亦然。
要将给定转换应用于键，请使用 [`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html)；
相应地，[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html) 转换值。
这两个函数都使用以 map 条目作为实参的转换，因此你可以操作其键和值。

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

*Zipping*（拉链式）转换是从两个集合中相同位置的元素构建对（pair）。
在 Kotlin 标准库中，这是通过 [`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html) 扩展函数完成的。

当在集合或数组上调用，并以另一个集合（或数组）作为实参时，`zip()` 返回 `Pair` 对象的 `List`。
接收者集合的元素是这些对中的第一个元素。

如果集合的大小不同，`zip()` 的结果大小为较小者；较大集合的末尾元素不包含在结果中。

`zip()` 也可以以中缀形式 `a zip b` 调用。

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

你也可以使用带有两个形参（接收者元素和实参元素）的转换函数来调用 `zip()`。
在这种情况下，结果 `List` 包含转换函数的返回值，该函数在具有相同位置的接收者和实参元素对上调用。

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

当你有一个 `Pair` 的 `List` 时，你可以进行反向转换——*unzipping*（解开拉链）——从这些对中构建两个列表：

* 第一个列表包含原始列表中每个 `Pair` 的第一个元素。 
* 第二个列表包含第二个元素。

要对对列表进行 unzip，请调用 [`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html)。

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

*Association*（关联）转换允许从集合元素以及与其关联的某些值构建 map。
在不同的关联类型中，元素可以是关联 map 中的键或值。

基本关联函数 [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html) 创建一个 `Map`，其中原始集合的元素是键，值由给定的转换函数从它们产生。
如果两个元素相等，则 map 中仅保留最后一个。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

为了构建以集合元素作为值的 map，可以使用函数 [`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html)。
它接受一个根据元素值返回键的函数。
如果两个元素的键相等，则 map 中仅保留最后一个。

`associateBy()` 也可以使用值转换函数来调用。

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

另一种构建 map（其中键和值都以某种方式由集合元素产生）的方法是函数 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。 
它接受一个返回 `Pair` 的 lambda 函数：对应 map 条目的键和值。

注意，`associate()` 会产生短周期的 `Pair` 对象，这可能会影响性能。
因此，当性能不是关键因素或者它比其他选项更可取时，应使用 `associate()`。

后者的一个例子是当键和相应的值一起从一个元素中产生时。 

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

在这里，我们首先在元素上调用一个转换函数，然后从该函数结果的属性中构建一个对（pair）。

## Flatten

如果你操作嵌套集合，你可能会发现提供对嵌套集合元素进行平坦化访问的标准库函数很有用。

第一个函数是 [`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html)。
你可以在集合的集合上调用它，例如 `Set` 的 `List`。
该函数返回一个包含嵌套集合所有元素的单一 `List`。

```kotlin

fun main() {
//sampleStart
    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一个函数——[`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) 提供了一种处理嵌套集合的灵活方式。
它接受一个将集合元素映射到另一个集合的函数。
因此，`flatMap()` 返回一个包含其在所有元素上的返回值的单一列表。
所以，`flatMap()` 的行为表现为先后调用 `map()`（以集合作为映射结果）和 `flatten()`。

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

## 字符串表示

如果你需要以可读格式检索集合内容，请使用将集合转换为字符串的函数：[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 和 [`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html)。

`joinToString()` 根据提供的实参从集合元素构建一个单一的 `String`。
`joinTo()` 执行相同的操作，但将结果附加到给定的 [`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html) 对象。

当使用参数的默认值调用时，这些函数返回的结果类似于在集合上调用 `toString()`：由逗号加空格分隔的元素字符串表示组成的 `String`。

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

要构建自定义字符串表示，你可以在函数实参 `separator`、`prefix` 和 `postfix` 中指定其参数。
生成的字符串将以 `prefix` 开头，以 `postfix` 结尾。
`separator` 将出现在除最后一个元素之外的每个元素之后。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于较大的集合，你可能想要指定 `limit`——包含在结果中的元素数量。
如果集合大小超过了 `limit`，所有其他元素将被 `truncated` 实参的单一值替换。

```kotlin

fun main() {
//sampleStart
    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

最后，要自定义元素本身的表示，请提供 `transform` 函数。 

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.uppercase()}"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}