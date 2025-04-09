---
title: 数组
---
数组是一种数据结构，它包含固定数量的相同类型或其子类型的值。
Kotlin 中最常见的数组类型是对象类型数组，由 [`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 类表示。

:::note
如果在对象类型数组中使用基本类型，会对性能产生影响，因为你的基本类型会被[装箱](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)
到对象中。为了避免装箱开销，请改用[基本类型数组](#primitive-type-arrays)。

:::

## 何时使用数组

当你有需要满足的特定底层要求时，请在 Kotlin 中使用数组。例如，如果你的性能要求超出了常规应用程序的需求，或者你需要构建自定义数据结构。如果没有这些限制，请改用[集合](collections-overview)。

与数组相比，集合具有以下优点：
* 集合可以是只读的，这可以让你更好地控制并编写意图清晰的健壮代码。
* 可以轻松地从集合中添加或删除元素。 相比之下，数组的大小是固定的。 添加或删除数组元素的唯一方法是每次都创建一个新数组，这非常低效：

  ```kotlin
  fun main() {

      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // 使用 += 赋值操作会创建一个新的 riversArray，
      // 复制原始元素并添加 "Mississippi"
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // Nile, Amazon, Yangtze, Mississippi

  }
  ```
  

* 你可以使用相等运算符 (`==`) 来检查集合在结构上是否相等。 你不能对数组使用此运算符。 相反，你必须使用一个特殊的函数，你可以在 [比较数组](#compare-arrays) 中阅读更多相关信息。

有关集合的更多信息，请参阅 [集合概述](collections-overview)。

## 创建数组

要在 Kotlin 中创建数组，你可以使用：
* 函数，例如 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html)、[`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 
或 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html)。
* `Array` 构造函数。

此示例使用 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 函数，
并将项值传递给它：

```kotlin
fun main() {

    // 创建一个值为 [1, 2, 3] 的数组
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 1, 2, 3

}
```

此示例使用 [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int))
函数来创建一个给定大小的数组，并用 `null` 元素填充：

```kotlin
fun main() {

    // 创建一个值为 [null, null, null] 的数组
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // null, null, null

}
```

此示例使用 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 函数来
创建一个空数组：

```kotlin
    var exampleArray = emptyArray<String>()
```

:::note
由于 Kotlin 的类型推断，你可以在赋值的左侧或右侧指定空数组的类型。

例如：
```Kotlin
var exampleArray = emptyArray<String>()

var exampleArray: Array<String> = emptyArray()
```

:::

`Array` 构造函数接受数组大小和一个函数，该函数返回给定索引的数组元素的值：

```kotlin
fun main() {

    // 创建一个 Array<Int>，它使用零 [0, 0, 0] 初始化
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 0, 0, 0

    // 创建一个 Array<String>，其值为 ["0", "1", "4", "9", "16"]
    val asc = Array(5) { i `->` (i * i).toString() }
    asc.forEach { print(it) }
    // 014916

}
```

:::note
与大多数编程语言一样，Kotlin 中的索引从 0 开始。

:::

### 嵌套数组

数组可以相互嵌套以创建多维数组：

```kotlin
fun main() {

    // 创建一个二维数组
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // [[0, 0], [0, 0]]

    // 创建一个三维数组
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]

}
```

:::note
嵌套数组不必是相同的类型或相同的大小。

:::

## 访问和修改元素

数组始终是可变的。 要访问和修改数组中的元素，请使用[索引访问运算符](operator-overloading#indexed-access-operator)`[]`：

```kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // 访问元素并修改它
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // 打印修改后的元素
    println(simpleArray[0].toString()) // 10
    println(twoDArray[0][0].toString()) // 2

}
```

Kotlin 中的数组是_不变的 (invariant)_。 这意味着 Kotlin 不允许你将 `Array<String>`
分配给 `Array<Any>`，以防止可能的运行时故障。 相反，你可以使用 `Array<out Any>`。 有关更多信息，
请参阅 [类型投影](generics#type-projections)。

## 使用数组

在 Kotlin 中，你可以通过使用数组将可变数量的参数传递给函数或对数组本身执行操作来使用数组。 例如，比较数组、转换其内容或将它们转换为集合。

### 将可变数量的参数传递给函数

在 Kotlin 中，你可以通过 [`vararg`](functions#variable-number-of-arguments-varargs)
参数将可变数量的参数传递给函数。 当你事先不知道参数的数量时，这非常有用，例如在格式化消息或
创建 SQL 查询时。

要将包含可变数量的参数的数组传递给函数，请使用 _spread_ 运算符
(`*`)。 spread 运算符将数组的每个元素作为单独的参数传递给你选择的函数：

```kotlin
fun main() {
    val lettersArray = arrayOf("c", "d")
    printAllStrings("a", "b", *lettersArray)
    // abcd
}

fun printAllStrings(vararg strings: String) {
    for (string in strings) {
        print(string)
    }
}
```

有关更多信息，请参阅 [可变数量的参数 (varargs)](functions#variable-number-of-arguments-varargs)。

### 比较数组

要比较两个数组是否具有相同顺序的相同元素，请使用 [`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)
和 [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 
函数：

```kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // 比较数组的内容
    println(simpleArray.contentEquals(anotherArray))
    // true

    // 使用中缀表示法，在更改元素后比较数组的内容
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // false

}
```

:::note
不要使用相等 (`==`) 和不等 (`!=`) [运算符](equality#structural-equality)来比较数组的内容。 这些运算符检查分配的变量是否指向同一个对象。

要了解有关 Kotlin 中数组以这种方式运行的原因的更多信息，请参阅我们的 [博客文章](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays)。

### 转换数组

Kotlin 具有许多有用的函数来转换数组。 本文档重点介绍了一些，但这不是一个
详尽的列表。 有关函数的完整列表，请参阅我们的 [API 参考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/)。

#### Sum (求和)

要返回数组中所有元素的总和，请使用 [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)
函数：

```Kotlin
fun main() {

    val sumArray = arrayOf(1, 2, 3)

    // 对数组元素求和
    println(sumArray.sum())
    // 6

}
```

`.sum()` 函数只能与 [数值数据类型](numbers) 的数组一起使用，例如 `Int`。

:::

#### Shuffle (打乱)

要随机打乱数组中的元素，请使用 [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html)
函数：

```Kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)

    // 打乱元素 [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // 再次打乱元素 [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

}
```

### 将数组转换为集合

如果你使用不同的 API，其中一些使用数组，另一些使用集合，那么你可以将数组转换为[集合](collections-overview)，
反之亦然。

#### 转换为 List (列表) 或 Set (集合)

要将数组转换为 `List` 或 `Set`，请使用 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)
和 [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 函数。

```kotlin
fun main() {

    val simpleArray = arrayOf("a", "b", "c", "c")

    // 转换为 Set
    println(simpleArray.toSet())
    // [a, b, c]

    // 转换为 List
    println(simpleArray.toList())
    // [a, b, c, c]

}
```

#### 转换为 Map (映射)

要将数组转换为 `Map`，请使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html)
函数。

只有 [`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 数组才能转换为 `Map`。
`Pair` 实例的第一个值成为键，第二个值成为值。 此示例使用 [中缀表示法](functions#infix-notation)
来调用 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 函数以创建 `Pair` 元组：

```kotlin
fun main() {

    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // 转换为 Map
    // 键是水果，值是它们的卡路里数
    // 请注意，键必须是唯一的，因此 "apple" 的最新值
    // 覆盖第一个
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}

}
```

## 基本类型数组

如果将 `Array` 类与基本类型值一起使用，这些值将被装箱到对象中。
作为替代方案，你可以使用基本类型数组，这允许你在数组中存储基本类型，而不会产生装箱开销的副作用：

| 基本类型数组 | Java 中的等效项 |
|---|----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`|
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]`|
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]`|
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]`|
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]`|
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]`|
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]`|
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]`|

这些类与 `Array` 类没有继承关系，但它们具有相同的一组函数和属性。

此示例创建 `IntArray` 类的实例：

```kotlin
fun main() {

    // 创建一个大小为 5 的 Int 数组，其值初始化为零
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 0, 0, 0, 0, 0

}
```

:::note
要将基本类型数组转换为对象类型数组，请使用 [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html)
函数。

要将对象类型数组转换为基本类型数组，请使用 [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html)、
[`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html)、 [`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html)
等等。

:::

## 下一步是什么？

* 要了解有关为什么我们建议在大多数用例中使用集合的更多信息，请阅读我们的 [集合概述](collections-overview)。
* 了解其他 [基本类型](basic-types)。
* 如果你是 Java 开发人员，请阅读我们的 Java 到 Kotlin 迁移指南，了解 [集合](java-to-kotlin-collections-guide)。