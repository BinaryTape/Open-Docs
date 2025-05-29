[//]: # (title: 陣列)

陣列是一種資料結構，用於儲存固定數量的相同型別或其子型別的值。Kotlin 中最常見的陣列型別是物件型別陣列，由 [`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 類別表示。

> 如果您在物件型別陣列中使用基本型別 (primitives)，這會對效能產生影響，因為您的基本型別會被[裝箱 (boxed)](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) 成物件。為避免裝箱開銷，請改用[基本型別陣列](#primitive-type-arrays)。
>
{style="note"}

## 何時使用陣列

當您有需要滿足的特定低階需求時，請在 Kotlin 中使用陣列。例如，如果您有超出一般應用程式所需的效能需求，或您需要建構自訂資料結構。如果您沒有這類限制，請改用[集合 (collections)](collections-overview.md)。

與陣列相比，集合具有以下優點：
* 集合可以是唯讀的，這讓您有更多控制權，並允許您撰寫意圖清晰且穩固的程式碼。
* 集合中的元素易於新增或移除。相比之下，陣列的大小是固定的。新增或移除陣列中元素的唯一方法是每次都建立一個新陣列，這效率非常低：

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

* 您可以使用等號運算子 (`==`) 來檢查集合是否結構上相等。您不能將此運算子用於陣列。相反地，您必須使用一個特殊函式，您可以在[比較陣列](#compare-arrays)中閱讀更多相關資訊。

有關集合的更多資訊，請參閱[集合概覽](collections-overview.md)。

## 建立陣列

要在 Kotlin 中建立陣列，您可以使用：
* 函式，例如 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html)、[`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 或 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html)。
* `Array` 建構函式。

此範例使用 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 函式並將項目值傳遞給它：

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

此範例使用 [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 函式建立一個具有給定大小並填充 `null` 元素的陣列：

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

此範例使用 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 函式建立一個空陣列：

```kotlin
    var exampleArray = emptyArray<String>()
```

> 由於 Kotlin 的型別推斷 (type inference)，您可以在賦值的左側或右側指定空陣列的型別。
>
> 例如：
> ```Kotlin
> var exampleArray = emptyArray<String>()
> 
> var exampleArray: Array<String> = emptyArray()
>```
>
{style="note"}

`Array` 建構函式接受陣列大小和一個函式，該函式根據給定的索引回傳陣列元素的值：

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

> 像在大多數程式語言中一樣，Kotlin 中的索引從 0 開始。
>
{style="note"}

### 巢狀陣列

陣列可以彼此巢狀，以建立多維陣列：

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

> 巢狀陣列不必具有相同的型別或大小。
>
{style="note"}

## 存取與修改元素

陣列總是可變的。要存取和修改陣列中的元素，請使用[索引存取運算子 (indexed access operator)](operator-overloading.md#indexed-access-operator)`[]`：

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

Kotlin 中的陣列是*不變的 (invariant)*。這表示 Kotlin 不允許您將 `Array<String>` 賦值給 `Array<Any>`，以防止可能的執行時期錯誤。相反地，您可以使用 `Array<out Any>`。有關更多資訊，請參閱[型別投影 (Type Projections)](generics.md#type-projections)。

## 處理陣列

在 Kotlin 中，您可以透過將陣列用作函式的可變數量引數 (variable number of arguments) 或對陣列本身執行操作來處理陣列。例如，比較陣列、轉換其內容或將它們轉換為集合。

### 將可變數量引數傳遞給函式

在 Kotlin 中，您可以透過 [`vararg`](functions.md#variable-number-of-arguments-varargs) 參數將可變數量引數傳遞給函式。當您事先不知道引數的數量時，這很有用，例如格式化訊息或建立 SQL 查詢時。

要將包含可變數量引數的陣列傳遞給函式，請使用*展開運算子 (spread operator)* (`*`)。展開運算子會將陣列的每個元素作為單獨的引數傳遞給您選擇的函式：

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

有關更多資訊，請參閱[可變數量引數 (varargs)](functions.md#variable-number-of-arguments-varargs)。

### 比較陣列

要比較兩個陣列是否具有相同元素且順序相同，請使用 [`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html) 和 [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 函式：

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

> 不要使用等號 (`==`) 和不等號 (`!=`) [運算子](equality.md#structural-equality)來比較陣列的內容。這些運算子檢查賦值的變數是否指向相同的物件。
>
> 要了解為什麼 Kotlin 中的陣列會這樣表現，請參閱我們的[部落格文章](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays)。
>
{style="warning"}

### 轉換陣列

Kotlin 有許多有用的函式可以轉換陣列。本文檔僅重點介紹了其中幾個，但這並非詳盡列表。有關函式的完整列表，請參閱我們的 [API 參考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/)。

#### 總和

要回傳陣列中所有元素的總和，請使用 [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 函式：

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

> `.sum()` 函式只能用於[數值資料型別 (numeric data types)](numbers.md) 的陣列，例如 `Int`。
>
{style="note"}

#### 打亂

要隨機打亂陣列中的元素，請使用 [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 函式：

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

### 將陣列轉換為集合

如果您使用的不同 API 中，有些使用陣列而有些使用集合，那麼您可以將陣列轉換為[集合](collections-overview.md)，反之亦然。

#### 轉換為 List 或 Set

要將陣列轉換為 `List` 或 `Set`，請使用 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html) 和 [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 函式。

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

#### 轉換為 Map

要將陣列轉換為 `Map`，請使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 函式。

只有 [`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 的陣列才能轉換為 `Map`。`Pair` 實例的第一個值成為鍵 (key)，第二個值成為值 (value)。此範例使用[中綴表示法 (infix notation)](functions.md#infix-notation) 呼叫 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 函式來建立 `Pair` 的元組：

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

## 基本型別陣列

如果您將 `Array` 類別與基本型別值一起使用，這些值將被裝箱成物件。作為替代方案，您可以使用基本型別陣列，這允許您在陣列中儲存基本型別而沒有裝箱開銷的副作用：

| 基本型別陣列 (Primitive-type array) | Java 中的對應型別 (Equivalent in Java) |
|---|----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`|
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]`|
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]`|
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]`|
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]`|
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]`|
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]`|
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]`|

這些類別與 `Array` 類別沒有繼承關係，但它們擁有相同組的函式和屬性。

此範例建立 `IntArray` 類別的實例：

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

> 要將基本型別陣列轉換為物件型別陣列，請使用 [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html) 函式。
>
> 要將物件型別陣列轉換為基本型別陣列，請使用 [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html)、[`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html)、[`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html) 等等。
>
{style="note"}

## 接下來是什麼？

* 要了解為什麼我們建議在大多數使用情境中都使用集合，請閱讀我們的[集合概覽](collections-overview.md)。
* 了解其他[基本型別](basic-types.md)。
* 如果您是 Java 開發者，請閱讀我們的 [Java 到 Kotlin 集合遷移指南](java-to-kotlin-collections-guide.md)。