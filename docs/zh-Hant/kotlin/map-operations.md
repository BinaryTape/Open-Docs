[//]: # (title: Map 專屬操作)

在 [Map](collections-overview.md#map) 中，鍵（Key）與值（Value）的型別皆由使用者定義。以鍵為基礎的 Map 項目存取功能提供了多種 Map 專屬的處理能力，從透過鍵取得值，到對鍵與值進行分別過濾。在本頁中，我們將介紹標準程式庫中提供的 Map 處理函式。

## 檢索鍵與值

若要從 Map 中檢索值，您必須提供其鍵作為 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 函式的引數。此外也支援 `[key]` 這種簡寫語法。如果找不到指定的鍵，則會傳回 `null`。還有另一個函式 [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html)，其行為略有不同：如果 Map 中找不到該鍵，它會拋出例外。此外，您還有另外幾個處理鍵不存在的選項：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 的運作方式與 list 相同：不存在的鍵之值會從指定的 Lambda 函式傳回。
* [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html) 在找不到鍵時傳回指定的預設值。

對於具有可為 null 值的 Map，請改用以下函式，它們會明確處理缺失的鍵與 `null` 值：

* `getOrElseIfNull()` 會在鍵缺失或具有 `null` 值時傳回指定預設值的結果。
* `getOrElseIfMissing()` 會在鍵缺失時傳回指定預設值的結果。

以下範例展示了這些函式之間的差異：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.get("one"))
    // 1

    println(numbersMap["one"])
    // 1

    println(numbersMap.getOrDefault("four", 10))
    // 10

    println(numbersMap["five"])
    // null
    
    val nullableMap = mapOf("one" to 1, "two" to null)
    println(nullableMap.getOrElseIfNull("two") { 0 })
    // 0

    println(nullableMap.getOrElseIfMissing("two") { 0 })
    // null

    // 由於 Map 中缺失 "six"，因此會拋出例外
    // numbersMap.getValue("six")

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4"}

若要對 Map 的所有鍵或所有值執行操作，您可以分別從屬性 `keys` 與 `values` 中檢索它們。`keys` 是 Map 所有鍵的集合（Set），而 `values` 是 Map 所有值的集合。

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

您可以使用 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函式以及其他集合來[過濾](collection-filtering.md) Map。對 Map 呼叫 `filter()` 時，請傳遞一個以 `Pair` 為引數的述詞（Predicate）。這讓您可以在過濾述詞中同時使用鍵與值。

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

還有兩種專門用於過濾 Map 的方式：依鍵過濾與依值過濾。每一種方式都有對應的函式：[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) 與 [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html)。兩者皆會傳回一個包含符合指定述詞之項目的新 Map。`filterKeys()` 的述詞僅檢查元素的鍵，而 `filterValues()` 則僅檢查值。

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

## plus 與 minus 運算子

由於是透過鍵來存取元素，[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 與 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 運算子在 Map 中的運作方式與其他集合不同。`plus` 會傳回一個 `Map`，其中包含其兩個運算元的元素：左側為 `Map`，右側為 `Pair` 或另一個 `Map`。當右側運算元包含左側 `Map` 中已存在的鍵時，結果 Map 會包含來自右側的項目。

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

`minus` 會根據左側 `Map` 的項目建立一個 `Map`，但排除那些鍵存在於右側運算元中的項目。因此，右側運算元可以是一個單一鍵，或者是鍵的集合：list、set 等。

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

關於在可變 Map 上使用 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 與 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 運算子的詳細資訊，請參閱下方的 [Map 寫入操作](#map-write-operations)。

## Map 寫入操作

[可變](collections-overview.md#collection-types) Map 提供專屬的寫入操作。這些操作讓您可以使用以鍵為基礎的存取方式來更改值，進而修改 Map 內容。

定義 Map 寫入操作時有一些特定規則：

* 值可以更新。相對地，鍵永遠不會改變：一旦您新增了一個項目，其鍵就是固定的。
* 每個鍵始終只會關聯到一個值。您可以新增或移除整個項目。

以下是可變 Map 上可用的寫入操作標準程式庫函式之說明。

### 新增與更新項目

若要將新的鍵值對新增至可變 Map，請使用 [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)。當一個新項目被放入 `LinkedHashMap`（預設的 Map 實作）時，它會被新增到迭代 Map 時的最後位置。在排序後的 Map 中，新元素的位置是由其鍵的順序定義的。

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

若要一次新增多個項目，請使用 [`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)。其引數可以是一個 `Map` 或一組 `Pair`：`Iterable`、`Sequence` 或 `Array`。

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

如果 Map 中已存在指定的鍵，`put()` 與 `putAll()` 都會覆寫其值。因此，您可以使用它們來更新 Map 項目的值。

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

您也可以使用運算子簡寫形式將新項目新增至 Map。有兩種方式：

* [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 運算子。
* `set()` 的運算子別名 `[]`。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // 呼叫 numbersMap.put("three", 3)
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

當呼叫時指定的鍵已存在於 Map 中，運算子會覆寫對應項目的值。

#### 為缺失的項目新增預設值

若要在值不存在時傳回現有值或新增預設值，請使用 [`.getOrPut()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-put.html) 擴充函式。如果鍵缺失或具有 `null` 值，`.getOrPut()` 會儲存預設值並將其傳回。

對於具有可為 null 值的 Map，您可以使用 `.getOrPutIfNull()` 與 `.getOrPutIfMissing()` 函式來控制如何處理 `null` 值：

* `getOrPutIfNull()` 的行為與 `getOrPut()` 類似，若鍵缺失或具有 `null` 值則使用預設值。
* `getOrPutIfMissing()` 僅在鍵缺失時使用預設值。

`getOrPutIfNull()` 與 `getOrPutIfMissing()` 函式目前為[實驗功能](components-stability.md#stability-levels-explained)。若要啟用，請使用 `@OptIn(ExperimentalStdlibApi::class)` 註解。

範例如下：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
//sampleStart
    val mapForNull = mutableMapOf<String, Int?>("one" to null)
    val mapForMissing = mutableMapOf<String, Int?>("one" to null)

    // 如果 "one" 的值為 null，則替換該值
    mapForNull.getOrPutIfNull("one") { 1 }

    println(mapForNull)
    // {one=1}

    // 由於 "one" 存在於 Map 中，因此保留 null 值
    mapForMissing.getOrPutIfMissing("one") { 1 }

    println(mapForMissing)
    // {one=null}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4"}

### 移除項目

若要從可變 Map 中移除項目，請使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 函式。呼叫 `remove()` 時，您可以傳遞一個鍵或整個鍵值對。如果您同時指定鍵與值，則僅當該鍵的值與第二個引數相符時，該元素才會被移除。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            // 不移除任何內容
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以根據鍵或值從可變 Map 中移除項目。若要執行此操作，請在 Map 的鍵或值上呼叫 `remove()`，並提供項目的鍵或值。在值上呼叫時，`remove()` 僅會移除具有指定值的第一個項目。

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

[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 運算子也可用於可變 Map。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             // 不移除任何內容
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}