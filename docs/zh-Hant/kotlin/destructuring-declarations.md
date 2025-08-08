[//]: # (title: 解構宣告)

有時候將物件**解構**為多個變數會很方便，例如：

```kotlin
val (name, age) = person
```

這種語法稱為**解構宣告**。解構宣告會一次建立多個變數。
您已經宣告了兩個新變數：`name` 和 `age`，並且可以獨立使用它們：

 ```kotlin
println(name)
println(age)
```

解構宣告會被編譯為以下程式碼：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 和 `component2()` 函式是 Kotlin 中廣泛使用的**約定原則**的另一個範例（例如，參見像 `+` 和 `*` 這樣的運算子，以及 `for` 迴圈）。解構宣告的右側可以是任何東西，只要可以在其上呼叫所需數量的 component 函式。當然，也可以有 `component3()` 和 `component4()` 等等。

> `componentN()` 函式需要用 `operator` 關鍵字標記，才能在解構宣告中使用它們。
>
{style="note"}

解構宣告也適用於 `for` 迴圈：

```kotlin
for ((a, b) in collection) { ... }
```

變數 `a` 和 `b` 會取得在集合的元素上呼叫 `component1()` 和 `component2()` 所傳回的值。

## 範例：從函式傳回兩個值

假設您需要從函式傳回兩個東西——例如，一個結果物件和某種狀態。在 Kotlin 中，一種簡潔的做法是宣告一個 [data class](data-classes.md) 並傳回其實例：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

由於 data class 會自動宣告 `componentN()` 函式，解構宣告在這裡也能運作。

> 您也可以使用標準類別 `Pair`，並讓 `function()` 傳回 `Pair<Int, Status>`，但通常最好為您的資料適當地命名。
>
{style="note"}

## 範例：解構宣告與 Map

遍歷 Map 最好的方式可能是這樣：

```kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

為了讓它運作，您應該

*   透過提供 `iterator()` 函式，將 Map 呈現為一個值序列。
*   透過提供 `component1()` 和 `component2()` 函式，將每個元素呈現為一個配對。

確實，標準函式庫提供了這樣的擴充功能：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

因此您可以在 `for` 迴圈中自由使用帶有 Map 的解構宣告（以及 data class 實例的集合或類似情況）。

## 未使用變數的底線

如果您不需要解構宣告中的變數，您可以用底線取代其名稱：

```kotlin
val (_, status) = getResult()
```

針對以此方式跳過的組件，不會呼叫 `componentN()` 運算子函式。

## Lambda 中的解構

您可以將解構宣告語法用於 lambda 參數。如果 lambda 有 `Pair` 類型（或 `Map.Entry`，或任何其他具有適當 `componentN` 函式的類型）的參數，您可以將它們放入圓括號中，以引入多個新參數而非一個：

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

請注意宣告兩個參數與宣告一個解構配對而非一個參數之間的差異：

```kotlin
{ a -> ... } // one parameter
{ a, b -> ... } // two parameters
{ (a, b) -> ... } // a destructured pair
{ (a, b), c -> ... } // a destructured pair and another parameter
```

如果解構參數的組件未使用，您可以用底線取代它，以避免為其命名：

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

您可以為整個解構參數指定類型，或單獨為特定組件指定：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```