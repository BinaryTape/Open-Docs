[//]: # (title: 数组)

数组是一种数据结构，它包含固定数量的相同类型或其子类型的值。Kotlin 中最常见的数组类型是对象类型数组，由 [`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 类表示。

> 如果您在对象类型数组中使用基本类型，这会带来性能影响，因为您的基本类型会被[装箱](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)成对象。为避免装箱开销，请改用[基本类型数组](#primitive-type-arrays)。
>
{style="note"}

## 何时使用数组

当您有需要满足的特定低级要求时，可以在 Kotlin 中使用数组。例如，如果您的性能要求超出常规应用程序所需，或者您需要构建自定义数据结构。如果您没有这些限制，请改用[集合](collections-overview.md)。

与数组相比，集合具有以下优势：
*   集合可以是只读的，这为您提供了更多控制，并允许您编写意图明确的健壮代码。
*   从集合中添加或删除元素很方便。相比之下，数组的大小是固定的。从数组中添加或删除元素的唯一方法是每次都创建一个新数组，这效率非常低：

  ```kotlin
  fun main() {
  //sampleStart
      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // Using the += assignment operation creates a new riversArray,
      // copies over the original elements and adds "Mississippi"
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // Nile, Amazon, Yangtze, Mississippi
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-rivers-array-kotlin"}

*   您可以使用相等运算符 (`==`) 来检查集合是否结构相等。您不能将此运算符用于数组。相反，您必须使用一个特殊函数，您可以在[比较数组](#compare-arrays)中了解更多信息。

有关集合的更多信息，请参阅[集合概述](collections-overview.md)。

## 创建数组

要在 Kotlin 中创建数组，您可以使用：
*   函数，例如 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html)、[`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 或 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html)。
*   `Array` 构造函数。

此示例使用 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 函数并向其传递项值：

```kotlin
fun main() {
//sampleStart
    // Creates an array with values [1, 2, 3]
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 1, 2, 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-simple-array-kotlin"}

此示例使用 [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 函数创建一个给定大小的数组，并用 `null` 元素填充：

```kotlin
fun main() {
//sampleStart
    // Creates an array with values [null, null, null]
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

> 由于 Kotlin 的类型推断，您可以在赋值的左侧或右侧指定空数组的类型。
>
> 例如：
> ```Kotlin
> var exampleArray = emptyArray<String>()
>
> var exampleArray: Array<String> = emptyArray()
>```
>
{style="note"}

`Array` 构造函数接受数组大小和一个根据索引返回数组元素值的函数：

```kotlin
fun main() {
//sampleStart
    // Creates an Array<Int> that initializes with zeros [0, 0, 0]
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 0, 0, 0

    // Creates an Array<String> with values ["0", "1", "4", "9", "16"]
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
    // Creates a two-dimensional array
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // [[0, 0], [0, 0]]

    // Creates a three-dimensional array
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

数组始终是可变的。要访问和修改数组中的元素，请使用[索引访问运算符](operator-overloading.md#indexed-access-operator)`[]`：

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // Accesses the element and modifies it
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // Prints the modified element
    println(simpleArray[0].toString()) // 10
    println(twoDArray[0][0].toString()) // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-access-array-kotlin"}

Kotlin 中的数组是_不变的_。这意味着 Kotlin 不允许您将 `Array<String>` 赋值给 `Array<Any>`，以防止可能的运行时失败。相反，您可以使用 `Array<out Any>`。有关更多信息，请参阅[类型投影](generics.md#type-projections)。

## 使用数组

在 Kotlin 中，您可以通过将数组用于向函数传递可变数量的参数，或对数组本身执行操作来使用数组。例如，比较数组、转换其内容或将它们转换为集合。

### 向函数传递可变数量的参数

在 Kotlin 中，您可以通过 [`vararg`](functions.md#variable-number-of-arguments-varargs) 参数向函数传递可变数量的参数。当您事先不知道参数的数量时，这很有用，例如格式化消息或创建 SQL 查询时。

要将包含可变数量参数的数组传递给函数，请使用_展开_运算符 (`*`)。展开运算符将数组的每个元素作为单独的参数传递给您选择的函数：

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

有关更多信息，请参阅[可变数量的参数 (varargs)](functions.md#variable-number-of-arguments-varargs)。

### 比较数组

要比较两个数组是否以相同顺序包含相同元素，请使用 [`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html) 和 [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 函数：

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // Compares contents of arrays
    println(simpleArray.contentEquals(anotherArray))
    // true

    // Using infix notation, compares contents of arrays after an element
    // is changed
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-compare-array-kotlin"}

> 不要使用相等 (`==`) 和不相等 (`!=`) [运算符](equality.md#structural-equality)来比较数组的内容。这些运算符检查赋值的变量是否指向同一个对象。
>
> 要了解有关 Kotlin 中数组为何如此行为的更多信息，请参阅我们的[博客文章](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays)。
>
{style="warning"}

### 转换数组

Kotlin 有许多用于转换数组的有用函数。本文只强调了其中几个，但这并非详尽列表。有关函数的完整列表，请参阅我们的[API 参考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/)。

#### 求和

要返回数组中所有元素的总和，请使用 [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 函数：

```Kotlin
fun main() {
//sampleStart
    val sumArray = arrayOf(1, 2, 3)

    // Sums array elements
    println(sumArray.sum())
    // 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-sum-array-kotlin"}

> `.sum()` 函数只能用于[数字数据类型](numbers.md)的数组，例如 `Int`。
>
{style="note"}

#### 随机洗牌

要随机打乱数组中的元素，请使用 [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 函数：

```Kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)

    // Shuffles elements [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // Shuffles elements again [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-shuffle-array-kotlin"}

### 将数组转换为集合

如果您使用不同的 API，其中一些使用数组而另一些使用集合，那么您可以将数组转换为[集合](collections-overview.md)，反之亦然。

#### 转换为 List 或 Set

要将数组转换为 `List` 或 `Set`，请使用 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html) 和 [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 函数。

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf("a", "b", "c", "c")

    // Converts to a Set
    println(simpleArray.toSet())
    // [a, b, c]

    // Converts to a List
    println(simpleArray.toList())
    // [a, b, c, c]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-list-set-kotlin"}

#### 转换为 Map

要将数组转换为 `Map`，请使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 函数。

只有[`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 类型的数组才能转换为 `Map`。`Pair` 实例的第一个值成为键，第二个值成为值。此示例使用[中缀表示法](functions.md#infix-notation)调用[`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)函数来创建 `Pair` 元组：

```kotlin
fun main() {
//sampleStart
    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // Converts to a Map
    // The keys are fruits and the values are their number of calories
    // Note how keys must be unique, so the latest value of "apple"
    // overwrites the first
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-map-kotlin"}

## 基本类型数组

如果您将 `Array` 类与基本类型值一起使用，这些值将被装箱成对象。作为替代方案，您可以使用基本类型数组，它允许您在数组中存储基本类型，而不会产生装箱开销的副作用：

| 基本类型数组 | 在 Java 中的等效项 |
|---|----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`|
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]`|
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]`|
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]`|
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]`|
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]`|
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]`|
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]`|

这些类与 `Array` 类没有继承关系，但它们拥有相同的功能集和属性。

此示例创建 `IntArray` 类的一个实例：

```kotlin
fun main() {
//sampleStart
    // Creates an array of Int of size 5 with the values initialized to zero
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 0, 0, 0, 0, 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-primitive-type-array-kotlin"}

> 要将基本类型数组转换为对象类型数组，请使用 [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html) 函数。
>
> 要将对象类型数组转换为基本类型数组，请使用 [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html)、[`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html)、[`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html) 等等。
>
{style="note"}

## 接下来？

*   要了解有关我们为什么建议在大多数用例中使用集合的更多信息，请阅读我们的[集合概述](collections-overview.md)。
*   了解其他[基本类型](basic-types.md)。
*   如果您是 Java 开发人员，请阅读我们的 Java 到 Kotlin [集合](java-to-kotlin-collections-guide.md)迁移指南。