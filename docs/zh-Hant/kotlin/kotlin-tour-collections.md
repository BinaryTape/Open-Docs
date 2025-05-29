[//]: # (title: 集合)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-hello-world.md">哈囉世界</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-basic-types.md">基本型別</a><br />
        <img src="icon-3.svg" width="20" alt="第三步" /> <strong>集合</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="第四步" /> <a href="kotlin-tour-control-flow.md">控制流程</a><br />
        <img src="icon-5-todo.svg" width="20" alt="第五步" /> <a href="kotlin-tour-functions.md">函式</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-classes.md">類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最後一步" /> <a href="kotlin-tour-null-safety.md">空值安全</a></p>
</tldr>

在程式設計中，將資料分組為結構以便後續處理是很有用的。Kotlin 提供了集合 (Collections) 正是為了這個目的。

Kotlin 提供了以下集合類型用於分組項目：

| **集合類型** | **描述**                                                         |
|---------------------|-------------------------------------------------------------------------|
| 列表               | 項目的有序集合                                            |
| 集                  | 項目的唯一無序集合                                   |
| 映射               | 鍵值對的集合，其中鍵是唯一的並只映射到一個值 |

每種集合類型都可以是可變的或唯讀的。

## 列表

列表會按照項目被加入的順序儲存項目，並允許重複的項目。

若要建立唯讀列表 ([`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/))，請使用 [`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html) 函式。

若要建立可變列表 ([`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list.html))，請使用 [`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html) 函式。

在建立列表時，Kotlin 可以推斷儲存項目的型別。若要明確宣告型別，請在列表宣告後面的角括號 `<>` 中加入型別：

```kotlin
fun main() { 
//sampleStart
    // Read only list
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println(readOnlyShapes)
    // [triangle, square, circle]
    
    // Mutable list with explicit type declaration
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    println(shapes)
    // [triangle, square, circle]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lists-declaration"}

> 為防止不必要的修改，您可以透過將可變列表賦予給 `List` 來建立其唯讀視圖 (read-only view)：
> 
> ```kotlin
>     val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
>     val shapesLocked: List<String> = shapes
> ```
> 這也稱為**型別轉換 (casting)**。
> 
{style="tip"}

列表是有序的，因此若要存取列表中的項目，請使用 [索引存取運算子 (indexed access operator)](operator-overloading.md#indexed-access-operator) `[]`：

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes[0]}")
    // The first item in the list is: triangle
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-access"}

若要取得列表中的第一個或最後一個項目，請分別使用 [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 函式：

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes.first()}")
    // The first item in the list is: triangle
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-first"}

> [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 函式是**擴充 (extension)** 函式的範例。若要在物件上呼叫擴充函式，請在物件後加上一個點 `.` 和函式名稱。
> 
> 擴充函式在 [中級教學](kotlin-tour-intermediate-extension-functions.md#extension-functions) 中有詳細介紹。目前，您只需要知道如何呼叫它們即可。
> 
{style="note"}

若要取得列表中項目的數量，請使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函式：

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("This list has ${readOnlyShapes.count()} items")
    // This list has 3 items
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-count"}

若要檢查某個項目是否在列表中，請使用 [`in` 運算子](operator-overloading.md#in-operator)：

```kotlin
fun main() {
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("circle" in readOnlyShapes)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-in"}

若要從可變列表中加入或移除項目，請分別使用 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 和 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函式：

```kotlin
fun main() { 
//sampleStart
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    // Add "pentagon" to the list
    shapes.add("pentagon") 
    println(shapes)  
    // [triangle, square, circle, pentagon]

    // Remove the first "pentagon" from the list
    shapes.remove("pentagon") 
    println(shapes)  
    // [triangle, square, circle]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-add-remove"}

## 集

列表是有序且允許重複項目，而集則是**無序**且只儲存**唯一**項目。

若要建立唯讀集 ([`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/))，請使用 [`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html) 函式。

若要建立可變集 ([`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/))，請使用 [`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html) 函式。

在建立集時，Kotlin 可以推斷儲存項目的型別。若要明確宣告型別，請在集宣告後面的角括號 `<>` 中加入型別：

```kotlin
fun main() {
//sampleStart
    // Read-only set
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    // Mutable set with explicit type declaration
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    
    println(readOnlyFruit)
    // [apple, banana, cherry]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-sets-declaration"}

您可以在上一個範例中看到，由於集只包含唯一元素，重複的 `"cherry"` 項目會被捨棄。

> 為防止不必要的修改，您可以透過將可變集賦予給 `Set` 來建立其唯讀視圖：
> 
> ```kotlin
>     val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
>     val fruitLocked: Set<String> = fruit
> ```
>
{style="tip"}

> 由於集是**無序**的，您無法透過特定索引存取項目。
> 
{style="note"}

若要取得集中項目的數量，請使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函式：

```kotlin
fun main() { 
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("This set has ${readOnlyFruit.count()} items")
    // This set has 3 items
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-count"}

若要檢查某個項目是否在集中，請使用 [`in` 運算子](operator-overloading.md#in-operator)：

```kotlin
fun main() {
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("banana" in readOnlyFruit)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-in"}

若要從可變集中加入或移除項目，請分別使用 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/add.html) 和 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函式：

```kotlin
fun main() { 
//sampleStart
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    fruit.add("dragonfruit")    // Add "dragonfruit" to the set
    println(fruit)              // [apple, banana, cherry, dragonfruit]
    
    fruit.remove("dragonfruit") // Remove "dragonfruit" from the set
    println(fruit)              // [apple, banana, cherry]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-add-remove"}

## 映射

映射會將項目儲存為鍵值對。您可以透過引用鍵來存取值。您可以將映射想像成一份食物菜單。您可以透過找到您想吃的食物 (鍵) 來找到價格 (值)。如果您想在不使用編號索引的情況下查詢值，就像在列表中一樣，映射會很有用。

> * 映射中的每個鍵都必須是唯一的，這樣 Kotlin 才能理解您想要取得哪個值。 
> * 映射中可以有重複的值。
>
{style="note"}

若要建立唯讀映射 ([`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/))，請使用 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html) 函式。

若要建立可變映射 ([`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/))，請使用 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 函式。

在建立映射時，Kotlin 可以推斷儲存項目的型別。若要明確宣告型別，請在映射宣告後面的角括號 `<>` 中加入鍵和值的型別。例如：`MutableMap<String, Int>`。鍵的型別為 `String`，值的型別為 `Int`。

建立映射最簡單的方法是在每個鍵及其相關值之間使用 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)：

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // {apple=100, kiwi=190, orange=100}

    // Mutable map with explicit type declaration
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-maps-declaration"}

> 為防止不必要的修改，您可以透過將可變映射賦予給 `Map` 來建立其唯讀視圖：
> 
> ```kotlin
>     val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     val juiceMenuLocked: Map<String, Int> = juiceMenu
> ```
>
{style="tip"}

若要存取映射中的值，請使用 [索引存取運算子](operator-overloading.md#indexed-access-operator) `[]` 及其鍵：

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of apple juice is: ${readOnlyJuiceMenu["apple"]}")
    // The value of apple juice is: 100
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-access"}

> 如果您嘗試使用映射中不存在的鍵來存取鍵值對，您會看到 `null` 值：
>
> ```kotlin
> fun main() {
> //sampleStart
>     // Read-only map
>     val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     println("The value of pineapple juice is: ${readOnlyJuiceMenu["pineapple"]}")
>     // The value of pineapple juice is: null
> //sampleEnd
> }
> ```
> {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-no-key" validate="false"}
> 
> 本教學稍後將在 [空值安全](kotlin-tour-null-safety.md) 章節中解釋空值。
> 
{style="note"}

您也可以使用 [索引存取運算子](operator-overloading.md#indexed-access-operator) `[]` 將項目加入可變映射：

```kotlin
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu["coconut"] = 150 // Add key "coconut" with value 150 to the map
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100, coconut=150}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-add-item"}

若要從可變映射中移除項目，請使用 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函式：

```kotlin
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.remove("orange")    // Remove key "orange" from the map
    println(juiceMenu)
    // {apple=100, kiwi=190}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-put-remove"}

若要取得映射中項目的數量，請使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函式：

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")
    // This map has 3 key-value pairs
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-count"}

若要檢查映射中是否已包含特定鍵，請使用 [`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html) 函式：

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.containsKey("kiwi"))
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-contains-keys"}

若要取得映射中鍵或值的集合，請分別使用 [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 和 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html) 屬性：

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.keys)
    // [apple, kiwi, orange]
    println(readOnlyJuiceMenu.values)
    // [100, 190, 100]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-keys-values"}

> `keys` 和 `values` 是物件**屬性 (properties)** 的範例。若要存取物件的屬性，請在物件後加上一個點 `.` 和屬性名稱。
>
> 屬性在 [類別 (Classes)](kotlin-tour-classes.md) 章節中有更詳細的討論。在本教學的這一點，您只需要知道如何存取它們即可。
>
{style="note"}

若要檢查鍵或值是否在映射中，請使用 [`in` 運算子](operator-overloading.md#in-operator)：

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // true
    
    // Alternatively, you don't need to use the keys property
    println("orange" in readOnlyJuiceMenu)
    // true
    
    println(200 in readOnlyJuiceMenu.values)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-in"}

有關集合您可以執行更多操作的資訊，請參閱 [集合](collections-overview.md)。

現在您已經了解基本型別以及如何管理集合，是時候探索您可以在程式中使用的 [控制流程](kotlin-tour-control-flow.md) 了。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true"}

您有一份「綠色」數字列表和一份「紅色」數字列表。請完成程式碼以印出總共有多少數字。

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-1"}

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    val totalCount = greenNumbers.count() + redNumbers.count()
    println(totalCount)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-collections-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true"}

您的伺服器支援一組通訊協定。使用者請求使用特定通訊協定。請完成程式以檢查所請求的通訊協定是否受支援 (`isSupported` 必須是布林值)。

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = // Write your code here 
    println("Support for $requested: $isSupported")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-2"}

<deflist collapsible="true" id="kotlin-tour-collections-exercise-2-hint">
    <def title="提示">
        請確保您檢查所請求的通訊協定時使用大寫。您可以使用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html"><code>.uppercase()</code></a> 函式來協助您完成此操作。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-collections-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true"}

定義一個映射，將整數數字 1 到 3 與其對應的拼寫關聯起來。使用此映射來拼寫給定的數字。

|---|---|
```kotlin
fun main() {
    val number2word = // Write your code here
    val n = 2
    println("$n is spelt as '${<Write your code here >}'")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-3"}

|---|---|
```kotlin
fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${number2word[n]}'")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-collections-solution-3"}

## 下一步

[控制流程](kotlin-tour-control-flow.md)