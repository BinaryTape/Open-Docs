[//]: # (title: 集合转换操作)

Kotlin 标准库为集合_转换_提供了一组扩展函数。这些函数根据提供的转换规则，从现有集合构建新集合。在本页面中，我们将概述可用的集合转换函数。

## Map

_映射_转换从对另一个集合元素应用函数的结果创建集合。基本的映射函数是 [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)。它将给定的 lambda 函数应用于每个后续元素，并返回 lambda 结果的 List。结果的顺序与元素的原始顺序相同。要应用额外使用元素索引作为实参的转换，请使用 [`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html)。

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

如果转换在某些元素上产生 `null`，你可以通过调用 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 函数而不是 `map()`，或 [`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html) 而不是 `mapIndexed()`，从结果集合中过滤掉这些 `null` 值。

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

转换 Map 时，你有两种选择：转换键而保持值不变，反之亦然。要将给定转换应用于键，请使用 [`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html)；相应地，[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html) 转换值。这两个函数都使用将 Map 条目作为实参的转换，因此你可以同时操作其键和值。

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

_压缩_转换是从两个集合中相同位置的元素构建对。在 Kotlin 标准库中，这通过 [`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html) 扩展函数完成。

当在集合或数组上调用 `zip()` 并以另一个集合（或数组）作为实参时，`zip()` 返回一个 `Pair` 对象的 `List`。接收者集合的元素是这些对中的第一个元素。

如果集合大小不同，`zip()` 的结果将是较小的大小；较大集合的最后元素不会包含在结果中。

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

你还可以使用一个转换函数调用 `zip()`，该函数接受两个形参：接收者元素和实参元素。在这种情况下，结果 `List` 包含在接收者和实参元素对上调用转换函数后获得的返回值。

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

当你有一个 `Pair` 的 `List` 时，你可以进行反向转换——_解压缩_——从这些对构建两个 List：

*   第一个 List 包含原始 List 中每个 `Pair` 的第一个元素。
*   第二个 List 包含第二个元素。

要解压缩一个对的 List，请调用 [`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html)。

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

_关联_转换允许从集合元素和与其关联的某些值构建 Map。在不同的关联类型中，元素可以是关联 Map 中的键或值。

基本关联函数 [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html) 创建一个 `Map`，其中原始集合的元素是键，值则由给定的转换函数从它们生成。如果两个元素相等，则只有最后一个保留在 Map 中。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

为了构建以集合元素作为值的 Map，有一个函数 [`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html)。它接受一个函数，该函数根据元素的值返回一个键。如果两个元素的键相等，则只有最后一个保留在 Map 中。

`associateBy()` 也可以与值转换函数一起调用。

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

另一种构建 Map 的方式是 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html) 函数，其中键和值都是从集合元素以某种方式生成的。它接受一个返回 `Pair` 的 lambda 函数：对应 Map 条目的键和值。

请注意，`associate()` 会产生短生命周期的 `Pair` 对象，这可能会影响性能。因此，当性能不关键或比其他选项更可取时，才应使用 `associate()`。

后者的一个例子是当键和相应的值是从一个元素一起生成时。

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

在这里，我们首先对一个元素调用转换函数，然后从该函数结果的属性构建一个对。

## Flatten

如果你操作嵌套集合，你可能会发现标准库中提供平面访问嵌套集合元素的函数很有用。

第一个函数是 [`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html)。你可以在集合的集合上调用它，例如，一个 `Set` 的 `List`。该函数返回一个包含嵌套集合所有元素的单个 `List`。

```kotlin

fun main() {
//sampleStart
    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一个函数——[`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) 提供了一种灵活的方式来处理嵌套集合。它接受一个函数，该函数将集合元素映射到另一个集合。因此，`flatMap()` 返回一个包含所有元素上返回值构成的单个 `List`。所以，`flatMap()` 的行为类似于先调用 `map()`（将集合作为映射结果），然后调用 `flatten()`。

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

如果你需要以可读格式检索集合内容，请使用将集合转换为字符串的函数：[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 和 [`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html)。

`joinToString()` 根据提供的实参从集合元素构建单个 `String`。`joinTo()` 执行相同的操作，但将结果附加到给定的 [`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html) 对象。

当以形参默认值调用时，这些函数返回的结果类似于在集合上调用 `toString()`：一个以逗号加空格分隔的元素字符串表示的 `String`。

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

要构建自定义字符串表示，你可以在函数实参 `separator`、`prefix` 和 `postfix` 中指定其形参。结果字符串将以 `prefix` 开头，以 `postfix` 结尾。`separator` 将出现在除最后一个元素之外的每个元素之后。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于较大的集合，你可能希望指定 `limit`——将包含在结果中的元素数量。如果集合大小超过 `limit`，所有其他元素将被 `truncated` 实参的单个值替换。

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