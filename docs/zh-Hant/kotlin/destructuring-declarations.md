[//]: # (title: 解構宣告)

有時候，將一個物件*解構*成多個變數會很方便，例如：

```kotlin
val (name, age) = person 
```

這種語法稱為*解構宣告*。解構宣告會一次建立多個變數。
您已宣告兩個新變數：`name` 和 `age`，並且可以獨立使用它們：

 ```kotlin
println(name)
println(age)
```

解構宣告會被編譯成以下程式碼：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 和 `component2()` 函式是 Kotlin 中廣泛使用的*慣例原則*的另一個範例（例如，請參閱像 `+` 和 `*` 這樣的運算子，以及 `for` 迴圈）。
任何東西都可以放在解構宣告的右側，只要可以在其上呼叫所需數量的 component 函式即可。當然，也可以有 `component3()` 和 `component4()` 等等。

> `componentN()` 函式需要用 `operator` 關鍵字標記，才能在解構宣告中使用它們。
>
{style="note"}

解構宣告也可以在 `for` 迴圈中運作：

```kotlin
for ((a, b) in collection) { ... }
```

變數 `a` 和 `b` 會從對集合元素呼叫 `component1()` 和 `component2()` 所回傳的值。

## 範例：從函式回傳兩個值

假設您需要從函式回傳兩件事物 — 例如，一個結果物件和某種狀態。
在 Kotlin 中，一種簡潔的做法是宣告一個 [資料類別](data-classes.md) 並回傳其實例：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

由於資料類別會自動宣告 `componentN()` 函式，因此解構宣告在此處也能運作。

> 您也可以使用標準類別 `Pair`，並讓 `function()` 回傳 `Pair<Int, Status>`，
> 但通常最好讓您的資料有恰當的名稱。
>
{style="note"}

## 範例：解構宣告與映射

遍歷映射最棒的方式可能是：

```kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

要使其運作，您應該

* 透過提供 `iterator()` 函式，將映射呈現為一系列值。
* 透過提供 `component1()` 和 `component2()` 函式，將每個元素呈現為一個配對 (pair)。
  
事實上，標準函式庫提供了這類擴充功能：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

因此，您可以自由地在 `for` 迴圈中搭配映射（以及資料類別實例或類似的集合）使用解構宣告。

## 未使用的變數使用底線

如果解構宣告中不需要某個變數，您可以用底線取代其名稱：

```kotlin
val (_, status) = getResult()
```

對於以此方式跳過的 component，不會呼叫 `componentN()` 運算子函式。

## Lambda 函式中的解構

您可以將解構宣告語法用於 Lambda 參數。
如果 Lambda 函式具有 `Pair` 型別（或 `Map.Entry`，或任何其他具有適當 `componentN` 函式的型別）的參數，您可以透過將它們放在括號中來引入多個新參數，而非單一參數：

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

請注意宣告兩個參數與宣告一個解構配對 (destructuring pair) 而非單一參數之間的差異：

```kotlin
{ a -> ... } // one parameter
{ a, b -> ... } // two parameters
{ (a, b) -> ... } // a destructured pair
{ (a, b), c -> ... } // a destructured pair and another parameter
```

如果解構參數的某個 component 未使用，您可以用底線取代它以避免為其命名：

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

您可以為整個解構參數或單獨為特定 component 指定型別：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```