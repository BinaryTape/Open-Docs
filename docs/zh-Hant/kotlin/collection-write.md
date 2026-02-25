[//]: # (title: 集合寫入操作)

[可變集合](collections-overview.md#collection-types) 支援更改集合內容的操作，例如新增或移除元素。
在此頁面中，我們將介紹適用於所有 `MutableCollection` 實作的寫入操作。
關於 `List` 與 `Map` 特有的操作，請分別參閱 [List 特有操作](list-operations.md) 與 [Map 特有操作](map-operations.md)。

## 新增元素

若要向 list 或 set 新增單個元素，請使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 函式。指定的物件會附加到集合的末尾。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) 會將引數物件中的每個元素新增到 list 或 set。引數可以是一個 `Iterable`、`Sequence` 或 `Array`。
接收者 (receiver) 與引數的型別可以不同，例如，你可以將 `Set` 中的所有項目新增至 `List`。

當在 list 上呼叫時，`addAll()` 會按照元素在引數中的出現順序新增。
你也可以在呼叫 `addAll()` 時指定一個元素位置作為第一個引數。
引數集合的第一個元素將插入到該位置。
引數集合的其他元素將隨其後，並將接收者元素向後移動。 

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以使用 [`plus` 運算子](collection-plus-minus.md) 的原地版本 — [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 來新增元素。
當套用於可變集合時，`+=` 會將第二個運算元（一個元素或另一個集合）附加到集合的末尾。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 移除元素

若要從可變集合中移除一個元素，請使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函式。
`remove()` 接受元素值並移除該值的一個執行個體。 

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // 移除第一個 `3`
    println(numbers)
    numbers.remove(5)                    // 不移除任何內容
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

若要一次移除多個元素，可以使用以下函式：

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) 移除引數集合中存在的所有元素。或者，你也可以使用述句作為引數來呼叫它；在這種情況下，該函式會移除所有讓述句傳回 `true` 的元素。
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) 與 `removeAll()` 相反：它會移除除了引數集合中包含的元素以外的所有元素。與述句搭配使用時，它僅保留符合該條件的元素。
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) 從 list 中移除所有元素，使其成為空集合。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一種從集合中移除元素的方法是使用 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 運算子 — 即 [`minus`](collection-plus-minus.md) 的原地版本。 
第二個引數可以是元素型別的單個執行個體或另一個集合。
當右側為單個元素時，`-=` 會移除它的 *第一個* 執行個體。
反之，如果是集合，則會移除其元素的所有執行個體。
例如，如果 list 包含重複元素，它們將被一併移除。
第二個運算元可以包含集合中不存在的元素。這些元素不會影響操作執行。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // 效果與上方相同
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 更新元素

List 與 map 也提供了更新元素的操作。
這些操作在 [List 特有操作](list-operations.md) 與 [Map 特有操作](map-operations.md) 中有詳細說明。
對於 set 來說，更新沒有意義，因為它實際上是移除一個元素並新增另一個。