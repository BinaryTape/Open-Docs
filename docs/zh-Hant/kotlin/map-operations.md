[//]: # (title: 映射特有操作)

在 [映射](collections-overview.md#map) 中，鍵和值的類型都是使用者定義的。
基於鍵對映射條目 (map entries) 的存取，使得各種映射特有的處理能力得以實現，從透過鍵取得值到單獨對鍵和值進行過濾。
在本頁中，我們將介紹標準函式庫 (standard library) 中映射處理函數的說明。

## 檢索鍵和值

若要從映射中取得值，您必須將其鍵作為 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 函數的引數。
同時也支援簡寫語法 `[key]`。如果找不到給定的鍵，它會回傳 `null`。
還有一個函數 [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html)，其行為略有不同：如果映射中找不到鍵，它會拋出例外 (exception)。
此外，您還有兩種選項來處理鍵不存在的情況：

*   [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 的工作方式與列表 (lists) 相同：不存在鍵的值會從給定的 Lambda 函數 (lambda function) 中回傳。
*   [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html) 會在找不到鍵時回傳指定的預設值。

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

若要對映射的所有鍵或所有值執行操作，您可以分別從 `keys` 和 `values` 屬性 (properties) 中檢索它們。
`keys` 是所有映射鍵的集合 (set)，而 `values` 是所有映射值的集合 (collection)。

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

## 過濾

您可以使用 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函數對映射進行[過濾](collection-filtering.md)，就像對其他集合一樣。
當在映射上呼叫 `filter()` 時，請傳入一個以 `Pair` 作為引數的判斷式 (predicate)。
這使得您可以在過濾判斷式中同時使用鍵和值。

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

還有兩種針對映射的特定過濾方式：按鍵過濾和按值過濾。
每種方式都有一個函數：[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) 和 [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html)。
兩者都回傳一個符合給定判斷式的新映射條目。
`filterKeys()` 的判斷式只檢查元素鍵，而 `filterValues()` 的判斷式只檢查值。

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

## Plus 和 Minus 運算子

由於對元素的鍵存取，[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 運算子對映射的工作方式與其他集合不同。
`plus` 回傳一個 `Map`，其中包含其兩個運算元 (operands) 的元素：左側的 `Map` 和右側的 `Pair` 或另一個 `Map`。
當右側運算元包含的條目中含有左側 `Map` 中已存在的鍵時，結果映射會包含來自右側的條目。

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

`minus` 會從左側 `Map` 的條目中建立一個新的 `Map`，但會排除右側運算元中包含的鍵。
因此，右側運算元可以是單一鍵，也可以是鍵的集合：列表、集合 (Set) 等。

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

有關在可變映射 (mutable maps) 上使用 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 運算子的詳細資訊，請參閱下方的 [映射寫入操作](#map-write-operations)。

## 映射寫入操作

[可變](collections-overview.md#collection-types) 映射提供映射特有的寫入操作。
這些操作允許您使用基於鍵的值存取來更改映射內容。

定義映射寫入操作的規則如下：

*   值可以被更新。然而，鍵永遠不會改變：一旦新增條目，其鍵就是恆定 (constant) 的。
*   對於每個鍵，總會有一個單一值與其關聯。您可以新增和移除整個條目。

以下是標準函式庫中，可用於可變映射的寫入操作函數說明。

### 新增和更新條目

若要向可變映射新增新的鍵值對 (key-value pair)，請使用 [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)。
當新的條目被放入 `LinkedHashMap`（預設的映射實作）時，它會被新增到迭代映射時的最後一個位置。
在已排序映射 (sorted maps) 中，新元素的位置由其鍵的順序定義。

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

若要一次新增多個條目，請使用 [`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)。
其引數可以是 `Map` 或一組 `Pair`：`Iterable`、`Sequence` 或 `Array`。

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

如果給定的鍵在映射中已經存在，`put()` 和 `putAll()` 都會覆寫其值。因此，您可以使用它們來更新映射條目的值。

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

您也可以使用簡寫運算子形式向映射新增條目。有兩種方式：

*   [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 運算子。
*   `[]` 運算子，它是 `set()` 的別名。

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

當使用映射中已存在的鍵呼叫時，運算子會覆寫對應條目的值。

### 移除條目

若要從可變映射中移除條目，請使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 函數。
呼叫 `remove()` 時，您可以傳入鍵或整個鍵值對。
如果您同時指定鍵和值，則只有當該鍵的值與第二個引數匹配時，帶有此鍵的元素才會被移除。

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

您也可以透過鍵或值從可變映射中移除條目。
若要這樣做，請在映射的鍵或值上呼叫 `remove()`，並提供條目的鍵或值。
當在值上呼叫時，`remove()` 只會移除具有給定值的第一個條目。

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

[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 運算子也適用於可變映射。

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