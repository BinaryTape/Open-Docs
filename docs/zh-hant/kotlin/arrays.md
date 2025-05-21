---
title: "陣列 (Arrays)"
---
陣列（Array）是一種資料結構，用於儲存固定數量的相同類型或其子類型的值。
在 Kotlin 中，最常見的陣列類型是物件類型陣列，由 [`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 類別表示。

:::note
如果您在物件類型陣列中使用基本類型（primitives），這會對效能產生影響，因為您的基本類型會[裝箱（boxed）](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)
成物件。為了避免裝箱的額外負擔，請改用[基本類型陣列](#primitive-type-arrays)。

:::

## 何時使用陣列

當您有需要滿足的特定底層需求時，請在 Kotlin 中使用陣列。例如，如果您有超出常規應用程式所需的效能需求，或者您需要建構自訂資料結構。如果您沒有這些限制，請改用[集合（collections）](collections-overview)。

與陣列相比，集合具有以下優點：
* 集合可以是唯讀的，這讓您可以更好地控制，並允許您編寫具有明確意圖的穩健程式碼。
* 從集合中新增或移除元素很容易。相比之下，陣列的大小是固定的。從陣列中新增或移除元素的唯一方法是每次都建立一個新陣列，這非常沒有效率：

  ```kotlin
  fun main() {

      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // 使用 += 賦值運算子會建立一個新的 riversArray，
      // 複製原始元素並新增 "Mississippi"
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // Nile, Amazon, Yangtze, Mississippi

  }
  ```
  

* 您可以使用相等運算子 (`==`) 來檢查集合是否在結構上相等。您不能對陣列使用此運算子。相反，您必須使用一個特殊的函式，您可以在[比較陣列](#compare-arrays)中閱讀更多相關資訊。

有關集合的更多資訊，請參閱[集合概述](collections-overview)。

## 建立陣列

要在 Kotlin 中建立陣列，您可以使用：
* 函式，例如 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html)、[`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 
或 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html)。
* `Array` 建構函式。

此範例使用 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 函式，並將項目值傳遞給它：

```kotlin
fun main() {

    // 建立一個具有值 [1, 2, 3] 的陣列
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 1, 2, 3

}
```

此範例使用 [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int))
函式來建立一個具有給定大小的陣列，並以 `null` 元素填充：

```kotlin
fun main() {

    // 建立一個具有值 [null, null, null] 的陣列
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // null, null, null

}
```

此範例使用 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 函式來
建立一個空陣列：

```kotlin
    var exampleArray = emptyArray<String>()
```

:::note
由於 Kotlin 的類型推斷，您可以在賦值的左側或右側指定空陣列的類型。

例如：
```Kotlin
var exampleArray = emptyArray<String>()

var exampleArray: Array<String> = emptyArray()
```

:::

`Array` 建構函式採用陣列大小和一個函式，該函式傳回給定索引的陣列元素的值：

```kotlin
fun main() {

    // 建立一個 Array<Int>，它以零初始化 [0, 0, 0]
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 0, 0, 0

    // 建立一個 Array<String>，其值為 ["0", "1", "4", "9", "16"]
    val asc = Array(5) { i `->` (i * i).toString() }
    asc.forEach { print(it) }
    // 014916

}
```

:::note
與大多數程式語言一樣，在 Kotlin 中，索引從 0 開始。

:::

### 巢狀陣列

陣列可以彼此巢狀，以建立多維陣列：

```kotlin
fun main() {

    // 建立一個二維陣列
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // [[0, 0], [0, 0]]

    // 建立一個三維陣列
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]

}
```

:::note
巢狀陣列不必是相同的類型或相同的大小。

:::

## 存取和修改元素

陣列始終是可變的。要存取和修改陣列中的元素，請使用[索引存取運算子](operator-overloading#indexed-access-operator)`[]`：

```kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // 存取元素並修改它
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // 列印修改後的元素
    println(simpleArray[0].toString()) // 10
    println(twoDArray[0][0].toString()) // 2

}
```

Kotlin 中的陣列是 _invariant_（不變的）。這表示 Kotlin 不允許您將 `Array<String>`
賦值給 `Array<Any>`，以防止可能的執行階段失敗。相反，您可以使用 `Array<out Any>`。有關更多資訊，
請參閱[類型投影](generics#type-projections)。

## 使用陣列

在 Kotlin 中，您可以透過使用陣列將可變數量的參數傳遞給函式或對陣列本身執行運算來使用陣列。例如，比較陣列、轉換其內容或將其轉換為集合。

### 將可變數量的參數傳遞給函式

在 Kotlin 中，您可以透過 [`vararg`](functions#variable-number-of-arguments-varargs)
參數將可變數量的參數傳遞給函式。當您事先不知道參數的數量時，這非常有用，例如格式化訊息或
建立 SQL 查詢時。

要將包含可變數量參數的陣列傳遞給函式，請使用 _spread_ 運算子
(`*`)。展開運算子將陣列的每個元素作為單獨的參數傳遞給您選擇的函式：

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

有關更多資訊，請參閱[可變數量的參數 (varargs)](functions#variable-number-of-arguments-varargs)。

### 比較陣列

要比較兩個陣列是否具有相同順序的相同元素，請使用 [`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)
和 [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 
函式：

```kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // 比較陣列的內容
    println(simpleArray.contentEquals(anotherArray))
    // true

    // 使用中綴表示法，在元素變更後比較陣列的內容
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // false

}
```

:::note
不要使用相等 (`==`) 和不相等 (`!=`) [運算子](equality#structural-equality)來比較陣列的內容。
這些運算子檢查分配的變數是否指向同一個物件。

要了解 Kotlin 中陣列的行為方式，請參閱我們的[部落格文章](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays)。

### 轉換陣列

Kotlin 有許多有用的函式來轉換陣列。本文檔重點介紹了一些，但這不是一個
詳盡的列表。有關函式的完整列表，請參閱我們的 [API 參考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/)。

#### Sum（總和）

要傳回陣列中所有元素的總和，請使用 [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)
函式：

```Kotlin
fun main() {

    val sumArray = arrayOf(1, 2, 3)

    // 對陣列元素求和
    println(sumArray.sum())
    // 6

}
```

`.sum()` 函式只能與 [數值資料類型](numbers) 的陣列一起使用，例如 `Int`。

:::

#### Shuffle（洗牌）

要隨機打亂陣列中的元素，請使用 [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html)
函式：

```Kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)

    // 隨機打亂元素 [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // 再次隨機打亂元素 [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

}
```

### 將陣列轉換為集合

如果您使用不同的 API，其中一些使用陣列，而另一些使用集合，則您可以將陣列轉換為[集合](collections-overview)
，反之亦然。

#### 轉換為 List 或 Set

要將陣列轉換為 `List` 或 `Set`，請使用 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)
和 [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 函式。

```kotlin
fun main() {

    val simpleArray = arrayOf("a", "b", "c", "c")

    // 轉換為 Set
    println(simpleArray.toSet())
    // [a, b, c]

    // 轉換為 List
    println(simpleArray.toList())
    // [a, b, c, c]

}
```

#### 轉換為 Map

要將陣列轉換為 `Map`，請使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html)
函式。

只有 [`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 的陣列才能轉換為 `Map`。
`Pair` 實例的第一個值成為鍵，第二個值成為值。此範例使用 [中綴表示法](functions#infix-notation)
來呼叫 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 函式以建立 `Pair` 的元組：

```kotlin
fun main() {

    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // 轉換為 Map
    // 鍵是水果，值是它們的卡路里數
    // 請注意，鍵必須是唯一的，因此 "apple" 的最新值
    // 會覆蓋第一個
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}

}
```

## 基本類型陣列

如果您將 `Array` 類別與基本類型值一起使用，這些值會被裝箱成物件。
作為替代方案，您可以使用基本類型陣列，這允許您在陣列中儲存基本類型，而沒有裝箱額外負擔的副作用：

| 基本類型陣列 | 在 Java 中的等效項 |
|---|----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`|
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]`|
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]`|
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]`|
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]`|
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]`|
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]`|
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]`|

這些類別與 `Array` 類別沒有繼承關係，但它們具有相同的一組函式和屬性。

此範例建立 `IntArray` 類別的實例：

```kotlin
fun main() {

    // 建立一個大小為 5 的 Int 陣列，其值初始化為零
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 0, 0, 0, 0, 0

}
```

:::note
要將基本類型陣列轉換為物件類型陣列，請使用 [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html)
函式。

要將物件類型陣列轉換為基本類型陣列，請使用 [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html)、
[`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html)、 [`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html)
等等。

:::

## 接下來做什麼？

* 要了解更多關於我們為什麼建議在大多數使用案例中使用集合，請閱讀我們的[集合概述](collections-overview)。
* 了解其他[基本類型](basic-types)。
* 如果您是 Java 開發人員，請閱讀我們的 Java 到 Kotlin 遷移指南，以了解[集合](java-to-kotlin-collections-guide)。