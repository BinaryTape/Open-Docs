[//]: # (title: 特定于 Map 的操作)

在[映射](collections-overview.md#map)中，键和值的类型都是用户定义的。
基于键对映射条目的访问实现了各种特定于映射的处理能力，从通过键获取值到对键和值进行独立过滤。
在本页中，我们提供了标准库中映射处理函数的描述。

## 检索键和值

要从映射中检索值，必须将键作为 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 函数的参数提供。
也支持 `[key]` 简写语法。如果未找到给定键，它将返回 `null`。
还有 [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html) 函数，其行为略有不同：如果映射中未找到键，它会抛出异常。
此外，您还有另外两种选项来处理键不存在的情况：

*   [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 的工作方式与列表相同：为不存在的键提供的值将从给定 lambda 函数返回。
*   [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html) 如果未找到键，则返回指定的默认值。

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

要对映射的所有键或所有值执行操作，您可以分别从 `keys` 和 `values` 属性中检索它们。
`keys` 是所有映射键的集合，`values` 是所有映射值的集合。

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

您可以使用 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函数过滤[映射](collection-filtering.md)，就像过滤其他集合一样。
在映射上调用 `filter()` 时，请传入一个以 `Pair` 作为参数的谓词。
这使您能够在过滤谓词中同时使用键和值。

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

还有两种特定于映射的过滤方式：按键过滤和按值过滤。
每种方式都有一个函数：[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) 和 [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html)。
两者都返回一个与给定谓词匹配的新映射。
`filterKeys()` 的谓词只检查元素键，而 `filterValues()` 的谓词只检查值。

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

## 加减运算符

由于通过键访问元素，[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 运算符对映射的作用方式与其他集合不同。
`plus` 返回一个 `Map`，其中包含其两个操作数的元素：左侧是一个 `Map`，右侧是一个 `Pair` 或另一个 `Map`。
当右侧操作数包含左侧 `Map` 中已存在的键的条目时，结果映射将包含来自右侧的条目。

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

`minus` 从左侧 `Map` 的条目创建一个 `Map`，但排除那些键来自右侧操作数的条目。
因此，右侧操作数可以是单个键，也可以是键的集合：列表、集合等等。

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

有关在可变映射上使用 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 运算符的详细信息，请参阅下文的[映射写入操作](#map-write-operations)。

## 映射写入操作

[可变](collections-overview.md#collection-types)映射提供特定于映射的写入操作。
这些操作允许您使用基于键对值的访问来更改映射内容。

定义映射写入操作的某些规则如下：

*   值可以更新。而键永不改变：一旦添加条目，其键即为常量。
*   对于每个键，总是有一个与之关联的单个值。您可以添加和删除整个条目。

以下是标准库中可用于可变映射的写入操作函数的描述。

### 添加和更新条目

要向可变映射添加新的键值对，请使用 [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)。
当一个新的条目被放入 `LinkedHashMap`（默认映射实现）时，它被添加在最后，以便在遍历映射时它排在最后。在有序映射中，新元素的位置由其键的顺序定义。

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
其参数可以是一个 `Map` 或一组 `Pair`：`Iterable`、`Sequence` 或 `Array`。

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

如果给定键已存在于映射中，`put()` 和 `putAll()` 都会覆盖值。因此，您可以使用它们来更新映射条目的值。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}") // 'one' 关联的值，之前：$previousValue，之后：${numbersMap["one"]}
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您还可以使用简写运算符形式向映射添加新条目。有以下两种方式：

*   [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 运算符。
*   `[]` 运算符，它是 `set()` 的别名。

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

当用映射中已存在的键调用时，运算符会覆盖相应条目的值。

### 移除条目

要从可变映射中移除条目，请使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 函数。
调用 `remove()` 时，您可以传入键或整个键值对。
如果您同时指定键和值，则只有当其值与第二个参数匹配时，带有此键的元素才会被移除。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            // 不会移除任何内容
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您还可以通过键或值从可变映射中移除条目。
为此，请在映射的 `keys` 或 `values` 上调用 `remove()`，并提供条目的键或值。
当在值上调用时，`remove()` 只会移除具有给定值的第一个条目。

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

[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 运算符也适用于可变映射。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             // 不会移除任何内容
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}