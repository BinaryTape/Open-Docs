---
title: "解構宣告 (Destructuring declarations)"
---
有時，將一個物件*解構 (destructure)* 成多個變數會很方便，例如：

```kotlin
val (name, age) = person
```

這種語法稱為*解構宣告 (destructuring declaration)*。 一個解構宣告會一次建立多個變數。
你已經宣告了兩個新的變數：`name` 和 `age`，並且可以獨立使用它們：

```kotlin
println(name)
println(age)
```

一個解構宣告會被編譯成以下程式碼：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 和 `component2()` 函數是 Kotlin 中廣泛使用的*慣例原則 (principle of conventions)* 的另一個例子
（參見 `+` 和 `*` 等運算符，以及 `for` 迴圈作為範例）。
任何東西都可以放在解構宣告的右側，只要可以對其呼叫所需數量的 component 函數即可。 當然，也可以有 `component3()` 和 `component4()` 等等。

:::note
`componentN()` 函數需要用 `operator` 關鍵字標記，以便允許在解構宣告中使用它們。

:::

解構宣告也適用於 `for` 迴圈：

```kotlin
for ((a, b) in collection) { ... }
```

變數 `a` 和 `b` 取得對集合元素呼叫 `component1()` 和 `component2()` 所返回的值。

## 範例：從函數返回兩個值

假設你需要從一個函數返回兩個東西 - 例如，一個結果物件和某種狀態。
在 Kotlin 中，一種簡潔的方法是宣告一個 [data class（資料類別）](data-classes) 並返回它的實例：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// 現在，使用這個函數：
val (result, status) = function(...)
```

由於資料類別會自動宣告 `componentN()` 函數，因此解構宣告在這裡適用。

:::note
你也可以使用標準類別 `Pair` 並讓 `function()` 返回 `Pair<Int, Status>`，
但通常最好讓你的資料被正確命名。

:::

## 範例：解構宣告和 Map (映射)

遍歷 Map (映射) 最好的方式可能是這樣：

```kotlin
for ((key, value) in map) {
   // 對 key 和 value 做一些事情
}
```

為了使其工作，你應該

* 透過提供 `iterator()` 函數將 Map (映射) 表示為值的序列。
* 透過提供函數 `component1()` 和 `component2()` 將每個元素表示為一個 pair。

事實上，標準函式庫提供了這樣的擴充功能：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

因此，你可以自由地在帶有 Map (映射) 的 `for` 迴圈中使用解構宣告（以及資料類別實例或類似物件的集合）。

## 用於未使用的變數的底線

如果你在解構宣告中不需要某個變數，你可以放置一個底線來代替它的名稱：

```kotlin
val (_, status) = getResult()
```

`componentN()` 運算符函數不會為以這種方式跳過的 component 呼叫。

## 在 Lambda (匿名函數) 中解構

你可以對 Lambda (匿名函數) 參數使用解構宣告語法。
如果一個 Lambda (匿名函數) 有一個 `Pair` 類型（或 `Map.Entry`，或任何其他具有適當的 `componentN` 函數的類型）的參數，你可以透過將它們放在括號中來引入幾個新的參數來代替一個參數：

```kotlin
map.mapValues { entry `->` "${entry.value}!" }
map.mapValues { (key, value) `->` "$value!" }
```

請注意宣告兩個參數和宣告一個解構 pair 而不是一個參數之間的區別：

```kotlin
{ a `->` ... } // 一個參數
{ a, b `->` ... } // 兩個參數
{ (a, b) `->` ... } // 一個解構 pair
{ (a, b), c `->` ... } // 一個解構 pair 和另一個參數
```

如果一個解構參數的 component 未被使用，你可以用底線替換它以避免發明它的名稱：

```kotlin
map.mapValues { (_, value) `->` "$value!" }
```

你可以為整個解構參數或為一個特定的 component 單獨指定類型：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> `->` "$value!" }

map.mapValues { (_, value: String) `->` "$value!" }
```