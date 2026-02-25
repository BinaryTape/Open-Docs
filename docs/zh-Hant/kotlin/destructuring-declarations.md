[//]: # (title: 解構宣告)

有時將一個物件*解構*（destructure）成多個變數會很方便，例如：

```kotlin
val (name, age) = person 
```

這種語法稱為*解構宣告*。解構宣告能一次建立多個變數。你宣告了兩個新變數：`name` 與 `age`，並且可以獨立使用它們：

 ```kotlin
println(name)
println(age)
```

解構宣告會被編譯為以下程式碼：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 與 `component2()` 函式是 Kotlin 中廣泛使用的*慣例原則*（principle of conventions）的另一個範例（請參考 `+` 與 `*` 等運算子，以及 `for` 迴圈作為範例）。只要能在其上呼叫所需數量的 `component` 函式，任何東西都可以放在解構宣告的右側。當然，也可以有 `component3()` 與 `component4()` 等等。

> `componentN()` 函式需要標記 `operator` 關鍵字，才能在解構宣告中使用。
>
{style="note"}

解構宣告也適用於 `for` 迴圈：

```kotlin
for ((a, b) in collection) { ... }
```

變數 `a` 與 `b` 會取得在集合元素上呼叫 `component1()` 與 `component2()` 所傳回的值。

## 範例：從函式傳回兩個值
 
假設你需要從函式傳回兩個東西 —— 例如，一個結果物件與某種狀態。在 Kotlin 中一種精簡的做法是宣告一個 [data class](data-classes.md) 並傳回其執行個體：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// 現在，要使用此函式：
val (result, status) = function(...)
```

由於資料類別會自動宣告 `componentN()` 函式，因此解構宣告在這裡可以運作。

> 你也可以使用標準類別 `Pair` 並讓 `function()` 傳回 `Pair<Int, Status>`，但將資料正確命名通常會更好。
>
{style="note"}

## 範例：解構宣告與 map

遍歷 map 最優雅的方式可能是：

```kotlin
for ((key, value) in map) {
   // 對 key 與 value 執行某些操作
}
```

為了使其運作，你應該：

* 透過提供 `iterator()` 函式，將 map 呈現為一系列的值。
* 透過提供 `component1()` 與 `component2()` 函式，將每個元素呈現為一個配對（pair）。
  
的確，標準程式庫提供了這類擴充：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

因此，你可以自由地在 map 的 `for` 迴圈中使用解構宣告（以及資料類別執行個體或類似項目的集合）。

## 底線用於未使用的變數

如果你在解構宣告中不需要某個變數，可以用底線代替其名稱：

```kotlin
val (_, status) = getResult()
```

對於以此方式跳過的組建，不會呼叫其對應的 `componentN()` 運算子函式。

## Lambda 中的解構

你可以對 Lambda 參數使用解構宣告語法。如果 Lambda 具有 `Pair` 型別（或 `Map.Entry`，或任何具有對應 `componentN` 函式的型別）的參數，你可以透過將它們放入圓括號中來引入多個新參數以取代原本的一個參數：

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

請注意宣告兩個參數與宣告解構配對以取代參數之間的差異：

```kotlin
{ a -> ... } // 一個參數
{ a, b -> ... } // 兩個參數
{ (a, b) -> ... } // 一個解構配對
{ (a, b), c -> ... } // 一個解構配對與另一個參數
```

如果解構參數中的某個組建未被使用，你可以用底線替換它以避免構思名稱：

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

你可以為整個解構參數或特定組建分別指定型別：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }