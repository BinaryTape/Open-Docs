---
title: "Map-specific operations"
---
在 [映射（maps）](collections-overview#map) 中，键（keys）和值（values）的类型都是用户定义的。
基于键（key）访问映射条目，可以实现各种特定于映射的处理功能，从通过键（key）获取值（value）到单独筛选键（keys）和值（values）。
在本页中，我们将提供标准库中映射处理函数的说明。

## 检索键和值

要从映射中检索值（value），必须提供其键（key）作为 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 函数的参数。
也支持简写 `[key]` 语法。如果找不到给定的键（key），则返回 `null`。
还有函数 [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html)，
它的行为略有不同：如果在映射中找不到键（key），它会抛出异常。
此外，你还有两种处理键（key）不存在的情况：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 的工作方式与列表相同：不存在的键（keys）的值（values）从给定的 lambda 函数返回。
* [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html) 如果找不到键（key），则返回指定的默认值。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.get("one"))
    println(numbersMap["one"])
    println(numbersMap.getOrDefault("four", 10))
    println(numbersMap["five"])               // null
    //numbersMap.getValue("six")      // exception!

}
```

要对映射的所有键（keys）或所有值（values）执行操作，你可以分别从属性 `keys` 和 `values` 中检索它们。
`keys` 是所有映射键（keys）的集合（set），而 `values` 是所有映射值（values）的集合（collection）。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.keys)
    println(numbersMap.values)

}
```

## 过滤

你可以使用 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函数以及其他集合（collections）来[过滤](collection-filtering)映射（maps）。
在映射（map）上调用 `filter()` 时，将带有 `Pair` 作为参数的谓词（predicate）传递给它。
这使你可以在过滤谓词（predicate）中使用键（key）和值（value）。

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) `->` key.endsWith("1") && value > 10}
    println(filteredMap)

}
```

还有两种过滤映射的特定方法：按键（keys）和按值（values）。
对于每种方法，都有一个函数：[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) 和 [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html)。
两者都返回一个与给定谓词（predicate）匹配的条目的新映射（map）。
`filterKeys()` 的谓词（predicate）仅检查元素键（keys），`filterValues()` 的谓词（predicate）仅检查值（values）。

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredKeysMap = numbersMap.filterKeys { it.endsWith("1") }
    val filteredValuesMap = numbersMap.filterValues { it < 10 }

    println(filteredKeysMap)
    println(filteredValuesMap)

}
```

## 加号和减号运算符

由于对元素的键（key）访问，[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html)
(`-`) 运算符对于映射（maps）的工作方式与其他集合（collections）不同。
`plus` 返回一个 `Map`，其中包含其两个操作数的元素：左侧的 `Map` 和右侧的 `Pair` 或另一个 `Map`。
当右侧操作数包含左侧 `Map` 中存在的键（keys）的条目时，结果映射包含来自右侧的条目。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap + Pair("four", 4))
    println(numbersMap + Pair("one", 10))
    println(numbersMap + mapOf("five" to 5, "one" to 11))

}
```

`minus` 从左侧 `Map` 的条目创建一个 `Map`，但排除那些具有右侧操作数中的键（keys）的条目。
因此，右侧操作数可以是单个键（key）或键（keys）的集合（collection）：列表（list）、集合（set）等等。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap - "one")
    println(numbersMap - listOf("two", "four"))

}
```

有关在可变映射（mutable maps）上使用 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html)
(`-=`) 运算符的详细信息，请参见下面的 [映射写入操作](#map-write-operations)。

## 映射写入操作

[可变（Mutable）](collections-overview#collection-types) 映射（maps）提供特定于映射的写入操作。
这些操作使你可以使用基于键（key）的访问来更改映射内容。

有一些规则定义了映射（maps）上的写入操作：

* 值（values）可以更新。反过来，键（keys）永远不会改变：一旦添加了一个条目，它的键（key）就是恒定的。
* 对于每个键（key），始终有一个与之关联的单个值（value）。你可以添加和删除整个条目。

以下是标准库函数中可用于可变映射（mutable maps）的写入操作的说明。

### 添加和更新条目

要将新的键值对添加到可变映射（mutable map）中，请使用 [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)。
当一个新的条目放入 `LinkedHashMap`（默认的映射实现）时，它会被添加，以便在迭代映射时排在最后。在排序映射（sorted maps）中，新元素的位置由其键（keys）的顺序定义。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    println(numbersMap)

}
```

要一次添加多个条目，请使用 [`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)。
它的参数可以是 `Map` 或一组 `Pair`：`Iterable`、`Sequence` 或 `Array`。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.putAll(setOf("four" to 4, "five" to 5))
    println(numbersMap)

}
```

如果给定的键（keys）已存在于映射中，则 `put()` 和 `putAll()` 都会覆盖这些值（values）。因此，你可以使用它们来更新映射条目的值（values）。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}")
    println(numbersMap)

}
```

你还可以使用简写运算符形式将新条目添加到映射（maps）中。有两种方法：

* [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 运算符。
* `[]` 运算符别名，用于 `set()`。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // calls numbersMap.put("three", 3)
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)

}
```

当使用映射中存在的键（key）调用时，运算符会覆盖相应条目的值（values）。

### 删除条目

要从可变映射（mutable map）中删除一个条目，请使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 函数。
调用 `remove()` 时，你可以传递键（key）或整个键值对（key-value-pair）。
如果同时指定键（key）和值（value），则仅当该键（key）的值（value）与第二个参数匹配时，才会删除具有此键（key）的元素。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            //doesn't remove anything
    println(numbersMap)

}
```

你还可以通过键（keys）或值（values）从可变映射（mutable map）中删除条目。
为此，请在映射的键（keys）或值（values）上调用 `remove()`，并提供条目的键（key）或值（value）。
当在值（values）上调用时，`remove()` 仅删除具有给定值的第一个条目。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)
    numbersMap.keys.remove("one")
    println(numbersMap)
    numbersMap.values.remove(3)
    println(numbersMap)

}
```

[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 运算符
也适用于可变映射（mutable maps）。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             //doesn't remove anything
    println(numbersMap)

}
```