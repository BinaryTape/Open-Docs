[//]: # (title: Map 特有的操作)

在 [map](collections-overview.md#map) 中，键和值的类型都是用户定义的。基于键对 map 条目的访问支持各种 map 特有的处理功能，从通过键获取值到分别对键和值进行过滤。在本页中，我们提供了标准库中 map 处理函数的说明。

## 检索键和值

要从 map 中检索值，必须将其键作为 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 函数的实参提供。也支持简写的 `[key]` 语法。如果找不到给定的键，则返回 `null`。还有一个函数 [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html)，它的行为略有不同：如果在 map 中找不到该键，它会抛出异常。此外，你还有另外两个处理键缺失的选项：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 与处理列表的方式相同：不存在的键的值由给定的 lambda 表达式返回。
* [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html) 如果找不到键，则返回指定的默认值。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.get("one"))
    println(numbersMap["one"])
    println(numbersMap.getOrDefault("four", 10))
    println(numbersMap["five"])               // null
    //numbersMap.getValue("six")      // 异常！
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要对 map 的所有键或所有值执行操作，可以分别从属性 `keys` 和 `values` 中检索它们。`keys` 是所有 map 键的集合，而 `values` 是所有 map 值的集合。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.keys)
    println(numbersMap.values)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 过滤

你可以像过滤其他集合一样，使用 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函数[过滤](collection-filtering.md) map。在 map 上调用 `filter()` 时，请向其传递一个以 `Pair` 作为实参的谓词。这使你能够在过滤谓词中同时使用键和值。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

过滤 map 还有两种特定的方式：按键和按值。每种方式都有一个对应的函数：[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) 和 [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html)。两者都返回由符合给定谓词的条目组成的新 map。`filterKeys()` 的谓词仅检查元素的键，而 `filterValues()` 的谓词仅检查值。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredKeysMap = numbersMap.filterKeys { it.endsWith("1") }
    val filteredValuesMap = numbersMap.filterValues { it < 10 }

    println(filteredKeysMap)
    println(filteredValuesMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## plus 和 minus 运算符

由于通过键访问元素，[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) 运算符在 map 中的工作方式与其他集合不同。`plus` 返回一个包含其两个操作数元素的 `Map`：左侧是一个 `Map`，右侧是一个 `Pair` 或另一个 `Map`。当右侧操作数包含左侧 `Map` 中已存在的键的条目时，结果 map 将包含来自右侧的条目。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap + Pair("four", 4))
    println(numbersMap + Pair("one", 10))
    println(numbersMap + mapOf("five" to 5, "one" to 11))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`minus` 从左侧 `Map` 的条目中创建一个 `Map`，但排除那些键出现在右侧操作数中的条目。因此，右侧操作数可以是一个单独的键，也可以是键的集合：列表、集合等。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap - "one")
    println(numbersMap - listOf("two", "four"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有关在可变 map 上使用 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 运算符的详细信息，请参阅下文的 [Map 写操作](#map-write-operations)。

## Map 写操作

[可变](collections-overview.md#collection-types) map 提供 map 特有的写操作。这些操作允许你利用基于键访问值的方式来更改 map 内容。

定义 map 写操作的某些规则如下：

* 值可以更新。反之，键永远不会改变：一旦你添加了一个条目，它的键就是固定的。
* 对于每个键，始终只有一个与之关联的值。你可以添加和删除整个条目。

以下是可变 map 上可用的写操作标准库函数说明。

### 添加与更新条目

要将新的键值对添加到可变 map，请使用 [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)。当一个新条目被放入 `LinkedHashMap`（默认的 map 实现）时，它会被添加到末尾，以便在遍历 map 时最后出现。在排序 map 中，新元素的位置由其键的顺序决定。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要一次添加多个条目，请使用 [`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)。其实参可以是一个 `Map` 或一组 `Pair`：`Iterable`、`Sequence` 或 `Array`。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.putAll(setOf("four" to 4, "five" to 5))
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果给定的键已经存在于 map 中，`put()` 和 `putAll()` 都会覆盖原来的值。因此，你可以使用它们来更新 map 条目的值。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}")
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你还可以使用简写的运算符形式向 map 添加新条目。有两种方式：

* [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 运算符。
* `[]` 运算符作为 `set()` 的别名。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // 调用 numbersMap.put("three", 3)
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

当使用 map 中已存在的键进行调用时，运算符会覆盖相应条目的值。

### 移除条目

要从可变 map 中移除条目，请使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 函数。调用 `remove()` 时，你可以传递一个键或整个键值对。如果你同时指定了键和值，则仅当该键的值与第二个实参匹配时，才会移除具有该键的元素。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            // 不移除任何内容
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你还可以通过键或值从可变 map 中移除条目。为此，请在 map 的键或值上调用 `remove()`，并提供条目的键或值。在值上调用时，`remove()` 仅移除具有给定值的第一个条目。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)
    numbersMap.keys.remove("one")
    println(numbersMap)
    numbersMap.values.remove(3)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

可变 map 也支持 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 运算符。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             // 不移除任何内容
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}