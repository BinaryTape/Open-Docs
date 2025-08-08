[//]: # (title: 数组)

数组是一种数据结构，用于存储固定数量的、相同类型或其子类型的值。Kotlin 中最常见的数组类型是对象类型数组，由 [`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 类表示。

> 如果在对象类型数组中使用原生类型（primitives），这会产生性能影响，因为你的原生类型会被[装箱](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)为对象。为避免装箱开销，请改用[原生类型数组](#primitive-type-arrays)。
>
{style="note"}

## 何时使用数组

当你需要满足特定的底层需求时，可在 Kotlin 中使用数组。例如，如果你的性能要求超出常规应用程序所需，或者你需要构建自定义数据结构。如果你没有这类限制，请改用[集合](collections-overview.md)。

与数组相比，集合具有以下优势：
* 集合可以是只读的，这为你提供了更多控制权，并允许你编写意图清晰的健壮代码。
* 集合易于添加或移除元素。相比之下，数组的大小是固定的。从数组中添加或移除元素的唯一方法是每次都创建一个新数组，这效率非常低：

  ```kotlin
  fun main() {
  //sampleStart
      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // 使用 += 赋值操作会创建一个新的 riversArray，
      // 复制原有元素并添加 "Mississippi"
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // Nile, Amazon, Yangtze, Mississippi
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-rivers-array-kotlin"}

* 你可以使用相等操作符 (`==`) 来检测集合是否结构相等。你不能将此操作符用于数组。相反，你必须使用一个特殊函数，你可以在[比较数组](#compare-arrays)中了解更多信息。

有关集合的更多信息，请参见[集合概览](collections-overview.md)。

## 创建数组

要在 Kotlin 中创建数组，你可以使用：
* 函数，例如 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html)、[`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 或 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html)。
* `Array` 构造函数。

此示例使用 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 函数，并将项值传递给它：

```kotlin
fun main() {
//sampleStart
    // 创建一个包含值 [1, 2, 3] 的数组
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 1, 2, 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-simple-array-kotlin"}

此示例使用 [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 函数创建一个给定大小且填充有 `null` 元素的数组：

```kotlin
fun main() {
//sampleStart
    // 创建一个包含值 [null, null, null] 的数组
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // null, null, null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-null-array-kotlin"}

此示例使用 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 函数创建一个空数组：

```kotlin
    var exampleArray = emptyArray<String>()
```

> 由于 Kotlin 的类型推断，你可以在赋值的左侧或右侧指定空数组的类型。
>
> 例如：
> ```Kotlin
> var exampleArray = emptyArray<String>()
>
> var exampleArray: Array<String> = emptyArray()
> ```
>
{style="note"}

`Array` 构造函数接受数组大小和一个函数，该函数根据给定索引返回数组元素的值：

```kotlin
fun main() {
//sampleStart
    // 创建一个 Array<Int>，并用零初始化为 [0, 0, 0]
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 0, 0, 0

    // 创建一个包含值 ["0", "1", "4", "9", "16"] 的 Array<String>
    val asc = Array(5) { i -> (i * i).toString() }
    asc.forEach { print(it) }
    // 014916
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-array-constructor-kotlin"}

> 与大多数编程语言一样，Kotlin 中的索引从 0 开始。
>
{style="note"}

### 嵌套数组

数组可以相互嵌套以创建多维数组：

```kotlin
fun main() {
//sampleStart
    // 创建一个二维数组
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // [[0, 0], [0, 0]]

    // 创建一个三维数组
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-multidimensional-array-kotlin"}

> 嵌套数组不必是相同类型或相同大小。
>
{style="note"}

## 访问和修改元素

数组总是可变的。要访问和修改数组中的元素，请使用[索引访问操作符](operator-overloading.md#indexed-access-operator)`[]`：

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // 访问并修改元素
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // 打印修改后的元素
    println(simpleArray[0].toString()) // 10
    println(twoDArray[0][0].toString()) // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-access-array-kotlin"}

Kotlin 中的数组是_不型变的_。这意味着 Kotlin 不允许你将 `Array<String>` 赋值给 `Array<Any>`，以防止可能的运行时故障。相反，你可以使用 `Array<out Any>`。有关更多信息，请参见[类型投影](generics.md#type-projections)。

## 使用数组

在 Kotlin 中，你可以通过将数组用于向函数传递可变数量的实参或对数组本身执行操作来使用数组。例如，比较数组、转换其内容或将其转换为集合。

### 向函数传递可变数量的实参

在 Kotlin 中，你可以通过 [`vararg`](functions.md#variable-number-of-arguments-varargs) 形参向函数传递可变数量的实参。这在你事先不知道实参数量时很有用，例如格式化消息或创建 SQL 查询时。

要将包含可变数量实参的数组传递给函数，请使用_展开_操作符 (`*`)。展开操作符将数组的每个元素作为单独的实参传递给你选择的函数：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-vararg-array-kotlin"}

有关更多信息，请参见[可变数量的实参 (varargs)](functions.md#variable-number-of-arguments-varargs)。

### 比较数组

要比较两个数组是否包含相同且顺序一致的元素，请使用 [`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html) 和 [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 函数：

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // 比较数组内容
    println(simpleArray.contentEquals(anotherArray))
    // true

    // 使用中缀表示法，在元素更改后比较数组内容
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-compare-array-kotlin"}

> 不要使用相等 (`==`) 和不等 (`!=`)[操作符](equality.md#structural-equality)来比较数组内容。这些操作符检测被赋值的变量是否指向同一个对象。
>
> 要了解更多关于 Kotlin 中数组为何如此表现的原因，请参见我们的[博客文章](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays)。
>
{style="warning"}

### 转换数组

Kotlin 有许多有用的函数用于转换数组。本文档重点介绍其中一部分，但这并非详尽列表。有关函数的完整列表，请参见我们的 [API 参考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/)。

#### 求和

要返回数组中所有元素的总和，请使用 [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 函数：

```Kotlin
fun main() {
//sampleStart
    val sumArray = arrayOf(1, 2, 3)

    // 对数组元素求和
    println(sumArray.sum())
    // 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-sum-array-kotlin"}

> `.sum()` 函数只能用于[数值数据类型](numbers.md)的数组，例如 `Int`。
>
{style="note"}

#### 乱序

要随机打乱数组中的元素，请使用 [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 函数：

```Kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)

    // 打乱元素 [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // 再次打乱元素 [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-shuffle-array-kotlin"}

### 将数组转换为集合

如果你使用不同的 API，其中一些使用数组而另一些使用集合，那么你可以将数组转换为[集合](collections-overview.md)，反之亦然。

#### 转换为 List 或 Set

要将数组转换为 `List` 或 `Set`，请使用 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html) 和 [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 函数。

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf("a", "b", "c", "c")

    // 转换为 Set
    println(simpleArray.toSet())
    // [a, b, c]

    // 转换为 List
    println(simpleArray.toList())
    // [a, b, c, c]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-list-set-kotlin"}

#### 转换为 Map

要将数组转换为 `Map`，请使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 函数。

只有 [`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 数组可以转换为 `Map`。`Pair` 实例的第一个值成为键，第二个值成为值。此示例使用[中缀表示法](functions.md#infix-notation)调用 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 函数来创建 `Pair` 元组：

```kotlin
fun main() {
//sampleStart
    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // 转换为 Map
    // 键是水果，值是其卡路里数量
    // 请注意，键必须是唯一的，因此 "apple" 的最新值会覆盖第一个值
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-map-kotlin"}

## 原生类型数组

如果将 `Array` 类与原生类型值一起使用，这些值会被装箱为对象。作为替代方案，你可以使用原生类型数组，它们允许你在数组中存储原生类型，而不会产生装箱开销的副作用：

| 原生类型数组 | Java 中的等效类型 |
|---|----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`|
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]`|
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]`|
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]`|
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]`|
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]`|
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]`|
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]`|

这些类与 `Array` 类没有继承关系，但它们拥有相同的功能和属性集。

此示例创建 `IntArray` 类的一个实例：

```kotlin
fun main() {
//sampleStart
    // 创建一个大小为 5 的 Int 数组，值初始化为零
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 0, 0, 0, 0, 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-primitive-type-array-kotlin"}

> 要将原生类型数组转换为对象类型数组，请使用 [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html) 函数。
>
> 要将对象类型数组转换为原生类型数组，请使用 [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html)、[`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html)、[`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html) 等。
>
{style="note"}

## 接下来是什么？

* 要了解我们为何建议在大多数用例中使用集合的更多信息，请参阅我们的[集合概览](collections-overview.md)。
* 了解其他[基本类型](basic-types.md)。
* 如果你是 Java 开发者，请参阅我们的 Java 到 Kotlin [集合](java-to-kotlin-collections-guide.md)迁移指南。