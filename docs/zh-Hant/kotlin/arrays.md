[//]: # (title: 陣列)

陣列是一種資料結構，用於儲存固定數量相同類型或其子類型的值。Kotlin 中最常見的陣列類型是物件類型陣列，由 [`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 類別表示。

> 如果您在物件類型陣列中使用基本類型，這會對效能產生影響，因為您的基本類型會被[裝箱](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)成物件。為避免裝箱開銷，請改用[基本類型陣列](#primitive-type-arrays)。
>
{style="note"}

## 何時使用陣列

在 Kotlin 中，當您需要滿足特殊的底層需求時，請使用陣列。例如，如果您的效能需求超出了常規應用程式所需的範圍，或者您需要建立自訂資料結構。如果您沒有這些限制，請改用[集合](collections-overview.md)。

與陣列相比，集合具有以下優點：
* 集合可以是唯讀的，這使您擁有更多控制權，並允許您編寫意圖清晰的穩健程式碼。
* 從集合中新增或移除元素很簡單。相比之下，陣列的大小是固定的。從陣列中新增或移除元素的唯一方法是每次都建立一個新陣列，這非常低效：

  ```kotlin
  fun main() {
  //sampleStart
      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // 使用 += 賦值操作會建立一個新的 riversArray，
      // 複製原始元素並新增 "Mississippi"
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // Nile, Amazon, Yangtze, Mississippi
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-rivers-array-kotlin"}

* 您可以使用等於運算子 (`==`) 檢查集合是否結構上相等。您不能將此運算子用於陣列。相反，您必須使用一個特殊函式，您可以在[比較陣列](#compare-arrays)中閱讀更多相關資訊。

有關集合的更多資訊，請參閱[集合總覽](collections-overview.md)。

## 建立陣列

若要在 Kotlin 中建立陣列，您可以使用：
* 函式，例如 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html)、[`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 或 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html)。
* `Array` 建構函式。

此範例使用 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 函式並將項目值傳遞給它：

```kotlin
fun main() {
//sampleStart
    // 建立一個值為 [1, 2, 3] 的陣列
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 1, 2, 3
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-simple-array-kotlin"}

此範例使用 [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 函式來建立一個指定大小並填滿 `null` 元素的陣列：

```kotlin
fun main() {
//sampleStart
    // 建立一個值為 [null, null, null] 的陣列
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // null, null, null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-null-array-kotlin"}

此範例使用 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 函式來建立一個空陣列：

```kotlin
    var exampleArray = emptyArray<String>()
```

> 由於 Kotlin 的類型推斷，您可以在賦值的左側或右側指定空陣列的類型。
>
> 例如：
> ```Kotlin
> var exampleArray = emptyArray<String>()
> 
> var exampleArray: Array<String> = emptyArray()
>```
>
{style="note"}

`Array` 建構函式接受陣列大小以及一個函式，該函式根據索引返回陣列元素的值：

```kotlin
fun main() {
//sampleStart
    // 建立一個初始值為零的 Array<Int> [0, 0, 0]
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 0, 0, 0

    // 建立一個值為 ["0", "1", "4", "9", "16"] 的 Array<String>
    val asc = Array(5) { i -> (i * i).toString() }
    asc.forEach { print(it) }
    // 014916
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-array-constructor-kotlin"}

> 和大多數程式語言一樣，Kotlin 中的索引從 0 開始。
>
{style="note"}

### 巢狀陣列

陣列可以相互巢狀以建立多維陣列：

```kotlin
fun main() {
//sampleStart
    // 建立一個二維陣列
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // [[0, 0], [0, 0]]

    // 建立一個三維陣列
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-multidimensional-array-kotlin"}

> 巢狀陣列不必是相同類型或相同大小。
>
{style="note"}

## 存取與修改元素

陣列總是可變的。若要存取和修改陣列中的元素，請使用[索引存取運算子](operator-overloading.md#indexed-access-operator)`[]`：

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // 存取並修改元素
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // 列印修改後的元素
    println(simpleArray[0].toString()) // 10
    println(twoDArray[0][0].toString()) // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-access-array-kotlin"}

Kotlin 中的陣列是*不變的*。這意味著 Kotlin 不允許您將 `Array<String>` 賦值給 `Array<Any>`，以防止可能的執行時期失敗。相反，您可以使用 `Array<out Any>`。欲了解更多資訊，請參閱[類型投影](generics.md#type-projections)。

## 使用陣列

在 Kotlin 中，您可以透過將陣列用於向函式傳遞可變數量的引數，或對陣列本身執行操作來使用陣列。例如，比較陣列、轉換其內容或將它們轉換為集合。

### 向函式傳遞可變數量的引數

在 Kotlin 中，您可以透過 [`vararg`](functions.md#variable-number-of-arguments-varargs) 參數向函式傳遞可變數量的引數。當您不提前知道引數數量時，這很有用，例如格式化訊息或建立 SQL 查詢時。

若要將包含可變數量引數的陣列傳遞給函式，請使用*展開*運算子 (`*`)。展開運算子將陣列的每個元素作為單獨的引數傳遞給您選擇的函式：

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

欲了解更多資訊，請參閱[可變數量的引數 (varargs)](functions.md#variable-number-of-arguments-varargs)。

### 比較陣列

若要比較兩個陣列是否具有相同順序的相同元素，請使用 [`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html) 和 [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 函式：

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // 比較陣列內容
    println(simpleArray.contentEquals(anotherArray))
    // true

    // 使用中綴表示法，在元素 
    // 變更後比較陣列內容
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-compare-array-kotlin"}

> 不要使用等於 (`==`) 和不等於 (`!=`) [運算子](equality.md#structural-equality)來比較陣列內容。這些運算子檢查賦值變數是否指向相同的物件。
> 
> 若要深入了解 Kotlin 中陣列為何以這種方式運作，請參閱我們的[部落格文章](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays)。
> 
{style="warning"}

### 轉換陣列

Kotlin 有許多實用的函式可以轉換陣列。本文件強調了其中幾個，但這並非完整清單。有關函式的完整清單，請參閱我們的 [API 參考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/)。

#### 求和

若要返回陣列中所有元素的總和，請使用 [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 函式：

```Kotlin
fun main() {
//sampleStart
    val sumArray = arrayOf(1, 2, 3)

    // 陣列元素求和
    println(sumArray.sum())
    // 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-sum-array-kotlin"}

> `.sum()` 函式只能用於[數值資料類型](numbers.md)的陣列，例如 `Int`。
>
{style="note"}

#### 亂序

若要隨機打亂陣列中的元素，請使用 [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 函式：

```Kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)

    // 亂序元素 [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // 再次亂序元素 [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-shuffle-array-kotlin"}

### 將陣列轉換為集合

如果您使用的不同 API 中，有些使用陣列，有些使用集合，那麼您可以將陣列轉換為[集合](collections-overview.md)，反之亦然。

#### 轉換為 List 或 Set

若要將陣列轉換為 `List` 或 `Set`，請使用 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html) 和 [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 函式。

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf("a", "b", "c", "c")

    // 轉換為 Set
    println(simpleArray.toSet())
    // [a, b, c]

    // 轉換為 List
    println(simpleArray.toList())
    // [a, b, c, c]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-list-set-kotlin"}

#### 轉換為 Map

若要將陣列轉換為 `Map`，請使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 函式。

只有 [`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 的陣列可以轉換為 `Map`。`Pair` 實例的第一個值成為鍵，第二個值成為值。此範例使用[中綴表示法](functions.md#infix-notation)呼叫 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 函式來建立 `Pair` 元組：

```kotlin
fun main() {
//sampleStart
    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // 轉換為 Map
    // 鍵是水果，值是其卡路里數
    // 請注意，鍵必須是唯一的，因此 "apple" 的最新值
    // 會覆寫第一個
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-map-kotlin"}

## 基本類型陣列

如果您將 `Array` 類別與基本類型值一起使用，這些值將被裝箱成物件。作為替代方案，您可以使用基本類型陣列，它允許您在陣列中儲存基本類型，而無需裝箱開銷的副作用：

| 基本類型陣列 | Java 中的對應項 |
|---|----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`|
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]`|
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]`|
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]`|
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]`|
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]`|
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]`|
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]`|

這些類別與 `Array` 類別沒有繼承關係，但它們具有相同的函式和屬性集。

此範例建立 `IntArray` 類別的實例：

```kotlin
fun main() {
//sampleStart
    // 建立一個大小為 5，值初始化為零的 Int 陣列
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 0, 0, 0, 0, 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-primitive-type-array-kotlin"}

> 若要將基本類型陣列轉換為物件類型陣列，請使用 [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html) 函式。
> 
> 若要將物件類型陣列轉換為基本類型陣列，請使用 [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html)、[`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html)、[`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html) 等。
> 
{style="note"}

## 接下來是什麼？

* 若要深入了解我們為何建議在大多數使用案例中使用集合，請閱讀我們的[集合總覽](collections-overview.md)。
* 了解其他[基本類型](types-overview.md)。
* 如果您是 Java 開發者，請閱讀我們的 [Java 到 Kotlin 集合遷移指南](java-to-kotlin-collections-guide.md)。