---
title: 集合转换操作
---
Kotlin 标准库为集合提供了一组扩展函数，用于集合的_转换_（transformations）。
这些函数基于提供的转换规则，从现有集合构建新的集合。
在本页中，我们将概述可用的集合转换函数。

## Map

_映射_（mapping）转换通过对另一个集合的元素执行函数来创建一个集合。
基本的映射函数是 [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)。
它将给定的 lambda 函数应用于每个后续元素，并返回 lambda 结果的列表。
结果的顺序与元素的原始顺序相同。
要应用一个额外使用元素索引作为参数的转换，请使用 [`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html)。

```kotlin

fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value `->` value * idx })

}
```

如果转换在某些元素上产生 `null`，你可以通过调用 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 函数而不是 `map()`，或者 [`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html) 而不是 `mapIndexed()`，从结果集合中过滤掉 `null` 值。

```kotlin

fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.mapNotNull { if ( it == 2) null else it * 3 })
    println(numbers.mapIndexedNotNull { idx, value `->` if (idx == 0) null else value * idx })

}
```

转换 `map` 时，你有两个选择：转换键（key）而保持值（value）不变，反之亦然。
要将给定的转换应用于键，请使用 [`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html)；
反过来，[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html) 转换值。
这两个函数都使用将 map 条目（entry）作为参数的转换，因此你可以同时操作其键和值。

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    println(numbersMap.mapKeys { it.key.uppercase() })
    println(numbersMap.mapValues { it.value + it.key.length })

}
```

## Zip

_压缩_（zipping）转换是从两个集合中相同位置的元素构建对（pair）。
在 Kotlin 标准库中，这通过 [`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html) 扩展函数完成。

当在集合或数组上调用，并以另一个集合（或数组）作为参数时，`zip()` 返回 `Pair` 对象的 `List`。接收者集合的元素是这些对中的第一个元素。

如果集合的大小不同，则 `zip()` 的结果是较小的大小；较大集合的最后一个元素不包括在结果中。

`zip()` 也可以以中缀形式 `a zip b` 调用。

```kotlin

fun main() {

    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    println(colors zip animals)

    val twoAnimals = listOf("fox", "bear")
    println(colors.zip(twoAnimals))

}
```

你也可以使用一个转换函数来调用 `zip()`，该函数接受两个参数：接收者元素和参数元素。
在这种情况下，结果 `List` 包含对接收者和具有相同位置的参数元素对调用的转换函数的返回值。

```kotlin

fun main() {

    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    
    println(colors.zip(animals) { color, animal `->` "The ${animal.replaceFirstChar { it.uppercase() }} is $color"})

}
```

当你有一个 `Pair` 的 `List` 时，你可以进行反向转换 - _解压缩_（unzipping）- 从这些对构建两个列表：

* 第一个列表包含原始列表中每个 `Pair` 的第一个元素。
* 第二个列表包含第二个元素。

要解压缩一对列表，请调用 [`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html)。

```kotlin

fun main() {

    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())

}
```

## Associate

_关联_（Association）转换允许从集合元素和与它们关联的某些值构建 map。
在不同的关联类型中，元素可以是关联 map 中的键或值。

基本关联函数 [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html)
创建一个 `Map`，其中原始集合的元素是键，值由给定的转换函数从中产生。
如果两个元素相等，则只有最后一个元素保留在 map 中。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })

}
```

对于构建以集合元素作为值的 map，有函数 [`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html)。
它接受一个函数，该函数返回基于元素值的键。如果两个元素的键相等，则只有最后一个元素保留在 map 中。

`associateBy()` 也可以使用值转换函数调用。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")

    println(numbers.associateBy { it.first().uppercaseChar() })
    println(numbers.associateBy(keySelector = { it.first().uppercaseChar() }, valueTransform = { it.length }))

}
```

构建 map 的另一种方法是，其中键和值都以某种方式从集合元素产生，即函数 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。
它接受一个 lambda 函数，该函数返回一个 `Pair`：相应 map 条目的键和值。

请注意，`associate()` 会产生短生命周期的 `Pair` 对象，这可能会影响性能。
因此，当性能不重要或者它比其他选项更可取时，应该使用 `associate()`。

后者的一个例子是当一个键和相应的值一起从一个元素产生时。

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

在这里，我们首先在一个元素上调用一个转换函数，然后从该函数结果的属性构建一个 pair。

## Flatten

如果你操作嵌套集合，你可能会发现标准库函数提供对嵌套集合元素的扁平访问很有用。

第一个函数是 [`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html)。
你可以在集合的集合上调用它，例如，`Set` 的 `List`。
该函数返回嵌套集合的所有元素的单个 `List`。

```kotlin

fun main() {

    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())

}
```

另一个函数 - [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) 提供了一种灵活的方式来处理嵌套集合。
它接受一个将集合元素映射到另一个集合的函数。
因此，`flatMap()` 返回其在所有元素上的返回值的单个列表。
因此，`flatMap()` 的行为类似于 `map()`（以集合作为映射结果）和 `flatten()` 的后续调用。

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

如果你需要以可读的格式检索集合内容，请使用将集合转换为字符串的函数：[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 和
[`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html)。

`joinToString()` 基于提供的参数从集合元素构建单个 `String`。
`joinTo()` 执行相同的操作，但将结果附加到给定的 [`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html) 对象。

当使用默认参数调用时，这些函数返回的结果类似于在集合上调用 `toString()`：
元素的字符串表示形式的 `String`，用逗号和空格分隔。

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

要构建自定义字符串表示形式，你可以在函数参数 `separator`、`prefix` 和 `postfix` 中指定其参数。
结果字符串将以 `prefix` 开头，以 `postfix` 结尾。`separator` 将在每个元素之后出现，除了最后一个元素。

```kotlin

fun main() \{

    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))

\}
```

对于较大的集合，你可能需要指定 `limit` - 将包含在结果中的元素数量。
如果集合大小超过 `limit`，则所有其他元素将被 `truncated` 参数的单个值替换。

```kotlin

fun main() {

    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))

}
```

最后，要自定义元素本身的表示，请提供 `transform` 函数。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.uppercase()}"})

}
```