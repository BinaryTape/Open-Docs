[//]: # (title: Map 特有的操作)

在 [Map](collections-overview.md#map) 中，键和值的类型都是用户定义的。
基于键的 Map 条目访问方式，支持各种 Map 特有的处理能力，从通过键获取值到分别过滤键和值。
在本页中，我们提供了标准库中 Map 处理函数的描述。

## 检索键和值

要从 Map 中检索值，你必须将其键作为 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 函数的实参提供。
也支持简写 `[key]` 语法。如果未找到给定键，它将返回 `null`。
还有一个 [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html) 函数，其行为略有不同：如果 Map 中未找到键，它会抛出异常。
此外，你还有两个选项来处理键不存在的情况：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 的工作方式与 list 相同：不存在的键的值从给定的 lambda 表达式返回。
* [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html) 在未找到键时返回指定的默认值。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.get("one"))
    println(numbersMap["one"])
    println(numbersMap.getOrDefault("four", 10))
    println(numbersMap["five"])               // null
    //numbersMap.getValue("six")      // exception!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要对 Map 的所有键或所有值执行操作，你可以分别从 `keys` 和 `values` 属性中检索它们。
`keys` 是所有 Map 键的 set，`values` 是所有 Map 值的集合。

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

你可以使用 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函数过滤 Map 以及其他集合。
在 Map 上调用 `filter()` 时，传入一个以 `Pair` 作为实参的谓词。
这使你能够在过滤谓词中同时使用键和值。

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

还有两种特定于 Map 的过滤方式：按键过滤和按值过滤。
每种方式都有一个对应的函数：[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) 和 [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html)。
两者都返回与给定谓词匹配的新 Map 条目。
`filterKeys()` 的谓词只检测元素键，`filterValues()` 的谓词只检测值。

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

## 加减操作符

由于对元素的键访问，[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html)
(`-`) 操作符对 Map 的工作方式与其他集合不同。
`plus` 返回一个 Map，其中包含其两个操作数中的元素：左侧的 Map 和右侧的 Pair 或另一个 Map。
当右侧操作数包含的条目其键存在于左侧 Map 中时，结果 Map 将包含来自右侧的条目。

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

`minus` 从左侧 Map 的条目中创建一个 Map，但排除了那些键来自右侧操作数的条目。
因此，右侧操作数可以是单个键，也可以是键的集合：list、set 等。

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

关于在可变 Map 上使用 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html)
(`-=`) 操作符的详细信息，请参见下方的 [Map 写入操作](#map-write-operations)。

## Map 写入操作

[可变](collections-overview.md#collection-types) Map 提供 Map 特有的写入操作。
这些操作允许你使用基于键的访问方式来更改 Map 内容。

Map 写入操作的某些规则如下：

* 值可以更新。相应地，键永远不会改变：一旦添加一个条目，其键就是不变的。
* 对于每个键，总是关联着一个值。你可以添加和移除整个条目。

以下是标准库中可用于可变 Map 的写入操作函数的描述。

### 添加和更新条目

要向可变 Map 添加新的键值对，请使用 [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)。
当一个新条目被放入 `LinkedHashMap`（默认的 Map 实现）时，它会被添加到最后，以便在遍历 Map 时排在最后。在有序 Map 中，新元素的位置由其键的顺序定义。

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

要一次添加多个条目，请使用 [`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)。
它的实参可以是 Map 或一组 Pair：`Iterable`、`Sequence` 或 `Array`。

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

如果给定键在 Map 中已存在，`put()` 和 `putAll()` 都会覆盖相应的值。因此，你可以使用它们来更新 Map 条目的值。

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

你还可以使用简写操作符形式向 Map 添加新条目。有两种方式：

* [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 操作符。
* `[]` 操作符，它是 `set()` 的别名。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // calls numbersMap.put("three", 3)
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

当操作符以 Map 中存在的键调用时，它们会覆盖相应条目的值。

### 移除条目

要从可变 Map 中移除条目，请使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 函数。
调用 `remove()` 时，你可以传入键或整个键值对。
如果你同时指定键和值，则只有当其值与第二个实参匹配时，才会移除具有此键的元素。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            //doesn't remove anything
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你还可以根据键或值从可变 Map 中移除条目。
为此，可以在 Map 的 `keys` 或 `values` 上调用 `remove()`，提供条目的键或值。
当在 `values` 上调用时，`remove()` 只移除第一个具有给定值的条目。

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

[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 操作符也可用于可变 Map。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             //doesn't remove anything
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}