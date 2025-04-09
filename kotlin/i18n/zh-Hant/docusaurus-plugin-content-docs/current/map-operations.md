---
title: "針對 Map 的特定操作"
---
在[映射（map）](collections-overview#map)中，鍵（key）和值（value）的類型都是使用者定義的。
基於鍵（key）來存取映射條目，可以實現各種映射特定的處理功能，從通過鍵（key）獲取值（value），到分別篩選鍵（key）和值（value）。
在本頁面中，我們提供了標準函式庫中的映射處理函數的描述。

## 檢索鍵（key）和值（value）

要從映射（map）中檢索值（value），您必須提供它的鍵（key）作為 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) 函數的引數。
也支援簡寫的 `[key]` 語法。如果找不到給定的鍵（key），則返回 `null`。
還有一個函數 [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html)，
它的行為略有不同：如果在映射（map）中找不到鍵（key），它會拋出例外（exception）。
此外，您還有兩個選項來處理鍵（key）不存在的情況：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 的工作方式與列表（list）相同：不存在的鍵（key）的值（value）會從給定的 lambda 函數返回。
* [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html) 如果找不到鍵（key），則返回指定的預設值（default value）。

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

要對映射（map）的所有鍵（key）或所有值（value）執行操作，您可以從屬性 `keys` 和 `values` 中分別檢索它們。
`keys` 是所有映射鍵（key）的集合（set），而 `values` 是所有映射值（value）的集合（collection）。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.keys)
    println(numbersMap.values)

}
```

## 篩選（Filter）

您可以像篩選其他集合（collection）一樣，使用 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函數來[篩選（filter）](collection-filtering)映射（map）。
在映射（map）上呼叫 `filter()` 時，將帶有 `Pair` 作為引數的謂詞（predicate）傳遞給它。
這使您可以在篩選謂詞（filtering predicate）中使用鍵（key）和值（value）。

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) `->` key.endsWith("1") && value > 10}
    println(filteredMap)

}
```

還有兩種特定的方法來篩選映射（map）：按鍵（key）和按值（value）。
對於每種方式，都有一個函數：[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) 和 [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html)。
兩者都返回一個新的條目映射（map），這些條目與給定的謂詞（predicate）匹配。
`filterKeys()` 的謂詞（predicate）僅檢查元素鍵（key），而 `filterValues()` 的謂詞（predicate）僅檢查值（value）。

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredKeysMap = numbersMap.filterKeys { it.endsWith("1") }
    val filteredValuesMap = numbersMap.filterValues { it < 10 }

    println(filteredKeysMap)
    println(filteredValuesMap)

}
```

## 加（Plus）和減（Minus）運算符

由於對元素的鍵（key）存取，[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html)
(`-`) 運算符對映射（map）的操作與對其他集合（collection）的操作不同。
`plus` 返回一個 `Map`，其中包含其兩個運算元的元素：左側的 `Map` 和右側的 `Pair` 或另一個 `Map`。
當右側運算元包含左側 `Map` 中存在的鍵（key）的條目時，結果映射（result map）包含來自右側的條目。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap + Pair("four", 4))
    println(numbersMap + Pair("one", 10))
    println(numbersMap + mapOf("five" to 5, "one" to 11))

}
```

`minus` 從左側 `Map` 的條目建立一個 `Map`，但排除那些具有右側運算元中的鍵（key）的條目。
因此，右側運算元可以是單個鍵（key）或鍵（key）的集合（collection）：列表（list）、集合（set）等。

```kotlin

fun main() {

    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap - "one")
    println(numbersMap - listOf("two", "four"))

}
```

有關在可變映射（mutable map）上使用 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html)
(`-=`) 運算符的詳細資訊，請參閱下面的[映射寫入操作](#map-write-operations)。

## 映射寫入操作

[可變（Mutable）](collections-overview#collection-types)映射（map）提供映射特定的寫入操作。
這些操作允許您使用基於鍵（key）對值（value）的存取來更改映射（map）的內容。

有一些規則定義了映射（map）上的寫入操作：

* 值（value）可以更新。 反過來，鍵（key）永遠不會改變：一旦您新增了一個條目，它的鍵（key）就是恆定的。
* 對於每個鍵（key），始終存在與之關聯的單個值（value）。 您可以新增和刪除整個條目。

以下是標準函式庫函數的描述，這些函數用於可變映射（mutable map）上可用的寫入操作。

### 新增和更新條目

要將新的鍵-值對（key-value pair）新增到可變映射（mutable map），請使用 [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)。
當將新條目放入 `LinkedHashMap`（預設映射（map）實現）時，將新增該條目，以便在迭代映射（map）時它排在最後。 在排序映射（sorted map）中，新元素的位置由其鍵（key）的順序定義。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    println(numbersMap)

}
```

要一次新增多個條目，請使用 [`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)。
它的引數可以是 `Map` 或一組 `Pair`：`Iterable`、`Sequence` 或 `Array`。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.putAll(setOf("four" to 4, "five" to 5))
    println(numbersMap)

}
```

如果給定的鍵（key）已存在於映射（map）中，則 `put()` 和 `putAll()` 都會覆寫這些鍵（key）的值（value）。 因此，您可以使用它們來更新映射條目的值（value）。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}")
    println(numbersMap)

}
```

您也可以使用簡寫運算符形式將新條目新增到映射（map）。 有兩種方法：

* [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 運算符。
* 用於 `set()` 的 `[]` 運算符別名。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // calls numbersMap.put("three", 3)
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)

}
```

當使用映射（map）中存在的鍵（key）呼叫時，運算符會覆寫相應條目的值（value）。

### 移除條目

要從可變映射（mutable map）中移除條目，請使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) 函數。
在呼叫 `remove()` 時，您可以傳遞鍵（key）或整個鍵-值對（key-value pair）。
如果您同時指定鍵（key）和值（value），則僅當該值（value）與第二個引數匹配時，才會移除具有此鍵（key）的元素。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            //doesn't remove anything
    println(numbersMap)

}
```

您還可以通過鍵（key）或值（value）從可變映射（mutable map）中移除條目。
為此，請在映射（map）的鍵（key）或值（value）上呼叫 `remove()`，並提供條目的鍵（key）或值（value）。
在值（value）上呼叫時，`remove()` 僅移除具有給定值（value）的第一個條目。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)
    numbersMap.keys.remove("one")
    println(numbersMap)
    numbersMap.values.remove(3)
    println(numbersMap)

}
```

[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 運算符也適用於可變映射（mutable map）。

```kotlin

fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             //doesn't remove anything
    println(numbersMap)

}
```