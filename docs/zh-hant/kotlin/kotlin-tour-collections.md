---
title: "集合 (Collections)"
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world (哈囉世界)</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types (基本類型)</a><br />
        <img src="/img/icon-3.svg" width="20" alt="Third step" /> <strong>Collections (集合)</strong><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow (控制流程)</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions (函式)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes (類別)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety (Null 安全)</a>
</p>

:::

在程式設計中，能夠將資料分組到結構中以便後續處理會很有用。Kotlin 提供了集合 (collections) 來滿足這個目的。

Kotlin 提供了以下集合類型 (collection type) 來對項目進行分組：

| **Collection type (集合類型)** | **Description (描述)**                                                         |
|---------------------|-------------------------------------------------------------------------|
| Lists (列表)               | Ordered collections of items (項目的有序集合)                                            |
| Sets (集合)                | Unique unordered collections of items (項目的唯一無序集合)                                   |
| Maps (映射)                | Sets of key-value pairs where keys are unique and map to only one value (鍵值對的集合，其中鍵是唯一的，並且僅映射到一個值) |

每種集合類型 (collection type) 都可以是可變的或唯讀的。

## List (列表)

列表 (Lists) 按照添加的順序儲存項目，並允許重複的項目。

要建立一個唯讀列表 ([`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/))，請使用 [`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html) 函式。

要建立一個可變列表 ([`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list.html))，請使用 [`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html) 函式。

在建立列表時，Kotlin 可以推斷儲存的項目類型。若要顯式宣告類型，請在列表宣告後的角括號 `<>` 內新增類型：

```kotlin
fun main() { 

    // Read only list (唯讀列表)
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println(readOnlyShapes)
    // [triangle, square, circle]
    
    // Mutable list with explicit type declaration (具有顯式類型宣告的可變列表)
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    println(shapes)
    // [triangle, square, circle]

}
```

:::note
若要防止不必要的修改，您可以通過將可變列表分配給 `List` 來建立可變列表的唯讀檢視：

```kotlin
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    val shapesLocked: List<String> = shapes
```
這也稱為 **casting (類型轉換)**。

列表 (Lists) 是有序的，因此要存取列表中的項目，請使用 [indexed access operator (索引存取運算子)](operator-overloading#indexed-access-operator) `[]`：

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes[0]}")
    // The first item in the list is: triangle

}
```

若要取得列表中的第一個或最後一個項目，請分別使用 [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 函式：

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes.first()}")
    // The first item in the list is: triangle

}
```

[`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 函式是 **extension (擴充)** 函式的範例。若要在物件上呼叫擴充函式，請在物件後加上句點 `.`，然後寫入函式名稱。

有關擴充函式的更多資訊，請參閱 [Extension functions (擴充函式)](extensions#extension-functions)。就本教程而言，您只需要知道如何呼叫它們。

:::

若要取得列表中項目的數量，請使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函式：

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("This list has ${readOnlyShapes.count()} items")
    // This list has 3 items

}
```

若要檢查某個項目是否在列表中，請使用 [`in` operator (運算子)](operator-overloading#in-operator)：

```kotlin
fun main() {

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("circle" in readOnlyShapes)
    // true

}
```

若要從可變列表中添加或移除項目，請分別使用 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 和 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函式：

```kotlin
fun main() { 

    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    // Add "pentagon" to the list (將 "pentagon" 新增到列表)
    shapes.add("pentagon") 
    println(shapes)  
    // [triangle, square, circle, pentagon]

    // Remove the first "pentagon" from the list (從列表中移除第一個 "pentagon")
    shapes.remove("pentagon") 
    println(shapes)  
    // [triangle, square, circle]

}
```

## Set (集合)

列表 (lists) 是有序的並允許重複的項目，而集合 (sets) 是 **unordered (無序的)** 並且僅儲存 **unique (唯一)** 的項目。

要建立一個唯讀集合 ([`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/))，請使用 [`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html) 函式。

要建立一個可變集合 ([`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/))，請使用 [`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html) 函式。

在建立集合時，Kotlin 可以推斷儲存的項目類型。若要顯式宣告類型，請在集合宣告後的角括號 `<>` 內新增類型：

```kotlin
fun main() {

    // Read-only set (唯讀集合)
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    // Mutable set with explicit type declaration (具有顯式類型宣告的可變集合)
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    
    println(readOnlyFruit)
    // [apple, banana, cherry]

}
```

您可以在前面的範例中看到，由於集合 (sets) 僅包含唯一元素，因此重複的 `"cherry"` 項目會被捨棄。

:::note
若要防止不必要的修改，您可以通過將可變集合分配給 `Set` 來建立可變集合的唯讀檢視：

```kotlin
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    val fruitLocked: Set<String> = fruit
```

由於集合 (sets) 是 **unordered (無序的)**，因此您無法存取特定索引處的項目。

:::

若要取得集合中項目的數量，請使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函式：

```kotlin
fun main() { 

    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("This set has ${readOnlyFruit.count()} items")
    // This set has 3 items

}
```

若要檢查某個項目是否在集合中，請使用 [`in` operator (運算子)](operator-overloading#in-operator)：

```kotlin
fun main() {

    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("banana" in readOnlyFruit)
    // true

}
```

若要從可變集合中新增或移除項目，請分別使用 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/add.html) 和 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函式：

```kotlin
fun main() { 

    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    fruit.add("dragonfruit")    // Add "dragonfruit" to the set (將 "dragonfruit" 新增到集合)
    println(fruit)              // [apple, banana, cherry, dragonfruit]
    
    fruit.remove("dragonfruit") // Remove "dragonfruit" from the set (從集合中移除 "dragonfruit")
    println(fruit)              // [apple, banana, cherry]

}
```

## Map (映射)

映射 (Maps) 將項目儲存為鍵值對 (key-value pairs)。您可以通過引用鍵 (key) 來存取值 (value)。您可以將映射 (map) 想像成食物菜單。您可以通過找到想吃的食物 (鍵) 來找到價格 (值)。如果您想在不使用編號索引的情況下查找值，例如在列表中，映射 (maps) 會很有用。

:::note
* 映射 (map) 中的每個鍵 (key) 必須是唯一的，以便 Kotlin 可以理解您要取得哪個值。
* 映射 (map) 中可以有重複的值 (values)。

:::

要建立一個唯讀映射 ([`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/))，請使用 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html) 函式。

要建立一個可變映射 ([`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/))，請使用 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 函式。

在建立映射 (maps) 時，Kotlin 可以推斷儲存的項目類型。若要顯式宣告類型，請在映射宣告後的角括號 `<>` 內新增鍵 (keys) 和值 (values) 的類型。例如：`MutableMap<String, Int>`。鍵 (keys) 的類型為 `String`，值 (values) 的類型為 `Int`。

建立映射 (maps) 最簡單的方法是在每個鍵 (key) 及其相關值 (value) 之間使用 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)：

```kotlin
fun main() {

    // Read-only map (唯讀映射)
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // {apple=100, kiwi=190, orange=100}

    // Mutable map with explicit type declaration (具有顯式類型宣告的可變映射)
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100}

}
```

:::note
若要防止不必要的修改，您可以通過將可變映射分配給 `Map` 來建立可變映射的唯讀檢視：

```kotlin
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    val juiceMenuLocked: Map<String, Int> = juiceMenu
```

若要存取映射 (map) 中的值 (value)，請使用 [indexed access operator (索引存取運算子)](operator-overloading#indexed-access-operator) `[]` 及其鍵 (key)：

```kotlin
fun main() {

    // Read-only map (唯讀映射)
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of apple juice is: ${readOnlyJuiceMenu["apple"]}")
    // The value of apple juice is: 100

}
```

如果您嘗試使用映射 (map) 中不存在的鍵 (key) 來存取鍵值對 (key-value pair)，您會看到一個 `null` 值：

```kotlin
fun main() {

    // Read-only map (唯讀映射)
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of pineapple juice is: ${readOnlyJuiceMenu["pineapple"]}")
    // The value of pineapple juice is: null

}
```

本教程稍後將在 [Null safety (Null 安全)](kotlin-tour-null-safety) 章節中解釋 null 值。

:::

您也可以使用 [indexed access operator (索引存取運算子)](operator-overloading#indexed-access-operator) `[]` 將項目新增到可變映射 (mutable map)：

```kotlin
fun main() {

    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu["coconut"] = 150 // Add key "coconut" with value 150 to the map (將鍵 "coconut" 和值 150 新增到映射)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100, coconut=150}

}
```

若要從可變映射 (mutable map) 中移除項目，請使用 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函式：

```kotlin
fun main() {

    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.remove("orange")    // Remove key "orange" from the map (從映射中移除鍵 "orange")
    println(juiceMenu)
    // {apple=100, kiwi=190}

}
```

若要取得映射 (map) 中項目的數量，請使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函式：

```kotlin
fun main() {

    // Read-only map (唯讀映射)
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")
    // This map has 3 key-value pairs

}
```

若要檢查映射 (map) 中是否已包含特定鍵 (key)，請使用 [`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html) 函式：

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.containsKey("kiwi"))
    // true

}
```

若要取得映射 (map) 的鍵 (keys) 或值 (values) 的集合 (collection)，請分別使用 [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 和 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html) 屬性：

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.keys)
    // [apple, kiwi, orange]
    println(readOnlyJuiceMenu.values)
    // [100, 190, 100]

}
```

:::note
[`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 和 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html) 是物件的 **properties (屬性)** 的範例。若要存取物件的屬性，請在物件後加上句點 `.`，然後寫入屬性名稱。

屬性 (properties) 將在 [Classes (類別)](kotlin-tour-classes) 章節中詳細討論。在本教程中，您只需要知道如何存取它們。

:::

若要檢查鍵 (key) 或值 (value) 是否在映射 (map) 中，請使用 [`in` operator (運算子)](operator-overloading#in-operator)：

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // true
    
    // Alternatively, you don't need to use the keys property (或者，您不需要使用 keys 屬性)
    println("orange" in readOnlyJuiceMenu)
    // true
    
    println(200 in readOnlyJuiceMenu.values)
    // false

}
```

有關可以使用集合 (collections) 執行的更多資訊，請參閱 [Collections (集合)](collections-overview)。

現在您已經了解了基本類型 (basic types) 以及如何管理集合 (collections)，現在是時候探索您可以在程式中使用的 [control flow (控制流程)](kotlin-tour-control-flow) 了。

## Practice (練習)

### Exercise 1 (練習 1)

您有一個 “green (綠色)” 數字列表和一個 “red (紅色)” 數字列表。完成程式碼以印出總共有多少個數字。

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // Write your code here (在這裡寫入你的程式碼)
}
```

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    val totalCount = greenNumbers.count() + redNumbers.count()
    println(totalCount)
}
```

### Exercise 2 (練習 2)

您的伺服器支援一組協定 (protocols)。使用者請求使用特定協定 (protocol)。完成程式以檢查是否支援請求的協定 (`isSupported` 必須是布林值)。

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = // Write your code here (在這裡寫入你的程式碼)
    println("Support for $requested: $isSupported")
}
```

<h3>Hint</h3>
        Make sure that you check the requested protocol in upper case. You can use the <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html">`.uppercase()`</a>
function to help you with this.
    

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}
```

### Exercise 3 (練習 3)

定義一個將 1 到 3 的整數 (integer) 數字與其對應的拼字相關聯的映射 (map)。使用此映射 (map) 來拼寫給定的數字。

|---|---|
```kotlin
fun main() {
    val number2word = // Write your code here (在這裡寫入你的程式碼)
    val n = 2
    println("$n is spelt as '${<Write your code here >}'")
}
```

|---|---|
```kotlin
fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${number2word[n]}'")
}
```

## Next step (下一步)

[Control flow (控制流程)](kotlin-tour-control-flow)