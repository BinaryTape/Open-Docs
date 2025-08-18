[//]: # (title: Map 專屬操作)

在 [map](collections-overview.md#map) 中，鍵和值的型別皆為使用者定義。透過基於鍵的存取 map 條目，可以實現各種 map 專屬的處理能力，從透過鍵取得值到單獨篩選鍵與值。在本頁中，我們提供了標準函式庫中 map 處理函式的說明。

## 擷取鍵與值

若要從 map 中擷取值，您必須將其鍵作為 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 函式的引數提供。也支援縮寫的 `[key]` 語法。如果找不到給定的鍵，則返回 `null`。還有一個 [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html) 函式，其行為略有不同：如果 map 中找不到鍵，它會拋出例外。此外，您還有兩種處理鍵不存在情況的選項：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 的工作方式與 List 相同：不存在鍵的值是從給定的 lambda 函式中返回的。
* [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html) 在找不到鍵時返回指定的預設值。

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

若要對 map 的所有鍵或所有值執行操作，您可以分別從 `keys` 和 `values` 屬性中擷取它們。`keys` 是所有 map 鍵的 Set，而 `values` 是所有 map 值的 Collection。

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

## 篩選

您可以像篩選其他集合一樣，使用 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函式來[篩選](collection-filtering.md) map。在 map 上呼叫 `filter()` 時，請傳遞一個以 `Pair` 作為引數的判斷式。這使您可以在篩選判斷式中同時使用鍵和值。

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

還有兩種篩選 map 的特定方式：按鍵篩選和按值篩選。對於每一種方式，都有一個函式：[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) 和 [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html)。兩者都返回一個符合給定判斷式的新條目 map。`filterKeys()` 的判斷式只檢查元素鍵，而 `filterValues()` 的判斷式只檢查值。

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

## 加號與減號運算子

由於對元素的鍵存取，[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 運算子對 map 的作用方式不同於其他集合。`plus` 返回一個 `Map`，其中包含其兩個運算元的元素：左側的 `Map` 和右側的 `Pair` 或另一個 `Map`。當右側運算元包含鍵存在於左側 `Map` 中的條目時，結果 map 包含來自右側的條目。

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

`minus` 從左側 `Map` 的條目中建立一個 `Map`，但排除右側運算元中鍵所對應的條目。因此，右側運算元可以是單一鍵或鍵的集合：List、Set 等。

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

有關在可變映射上使用 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 運算子的詳細資訊，請參閱下方的[Map 寫入操作](#map-write-operations)。

## Map 寫入操作

[可變](collections-overview.md#collection-types) map 提供 map 專屬的寫入操作。這些操作讓您可以透過基於鍵的值存取來更改 map 內容。

定義 map 寫入操作的某些規則：

* 值可以被更新。反之，鍵永不改變：一旦新增一個條目，其鍵就是常數。
* 對於每個鍵，總是只有一個值與之相關聯。您可以新增和移除整個條目。

以下是可用於可變映射的標準函式庫寫入操作函式的說明。

### 新增與更新條目

若要將新的鍵值對新增至可變映射，請使用 [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)。當一個新條目被放入 `LinkedHashMap`（預設的 map 實作）時，它會被新增到最後，以便在迭代 map 時排在最後。在已排序的 map 中，新元素的位置由其鍵的順序定義。

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

若要一次新增多個條目，請使用 [`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)。其引數可以是 `Map` 或 `Pair` 的群組：`Iterable`、`Sequence` 或 `Array`。

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

`put()` 和 `putAll()` 都會在給定的鍵已存在於 map 中時覆寫值。因此，您可以使用它們來更新 map 條目的值。

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

您還可以使用縮寫的運算子形式向 map 新增新條目。有兩種方式：

* [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 運算子。
* `set()` 的 `[]` 運算子別名。

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

當使用 map 中存在的鍵呼叫時，運算子會覆寫相應條目的值。

### 移除條目

若要從可變映射中移除條目，請使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 函式。呼叫 `remove()` 時，您可以傳遞一個鍵或整個鍵值對。如果同時指定鍵和值，則只有當其值與第二個引數匹配時，具有此鍵的元素才會被移除。

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

您也可以透過鍵或值從可變映射中移除條目。為此，請在 map 的 `keys` 或 `values` 上呼叫 `remove()`，並提供條目的鍵或值。在 `values` 上呼叫時，`remove()` 只移除第一個具有給定值的條目。

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