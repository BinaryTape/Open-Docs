[//]: # (title: 集合寫入操作)

[可變集合](collections-overview.md#collection-types) 支援變更集合內容的操作，例如，新增或移除元素。
本頁將介紹 `MutableCollection` 所有實作所支援的寫入操作。
對於 `List` 和 `Map` 更具體的操作，請分別參閱 [List 特定操作](list-operations.md) 和 [Map 特定操作](map-operations.md)。

## 新增元素

若要將單一元素新增至清單或集合，請使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 函數。指定的物件會被附加到集合的末尾。

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

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) 會將引數物件中的每個元素新增至清單或集合。該引數可以是 `Iterable`、`Sequence` 或 `Array`。
接收者和引數的類型可以不同，例如，您可以將 `Set` 中的所有項目新增至 `List`。

當在清單上呼叫時，`addAll()` 會以引數中元素的相同順序新增新元素。
您也可以呼叫 `addAll()`，並將元素位置指定為第一個引數。
引數集合的第一個元素將插入到這個位置。
引數集合的其他元素將跟隨其後，將接收者的元素移至末尾。

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

您也可以使用 [`plus` 運算子](collection-plus-minus.md)的就地 (in-place) 版本 - [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 來新增元素。
當應用於可變集合時，`+=` 會將第二個運算元（一個元素或另一個集合）附加到集合的末尾。

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

若要從可變集合中移除元素，請使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函數。
`remove()` 接受元素值並移除該值的其中一個出現項。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // removes the first `3`
    println(numbers)
    numbers.remove(5)                    // removes nothing
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

若要一次移除多個元素，可以使用以下函數：

*   [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) 移除引數集合中存在的所有元素。
    另外，您也可以傳入述詞 (predicate) 作為引數呼叫它；在這種情況下，該函數會移除所有述詞結果為 `true` 的元素。
*   [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) 與 `removeAll()` 相反：它會移除所有元素，只保留引數集合中的元素。
    當與述詞一起使用時，它只會保留與其匹配的元素。
*   [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) 從清單中移除所有元素，使其變為空清單。

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

另一種從集合中移除元素的方式是使用 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 運算子——它是 [`minus`](collection-plus-minus.md) 的就地 (in-place) 版本。
第二個引數可以是元素類型的單一實例或另一個集合。
當右側是單一元素時，`-=` 會移除它的**第一個**出現項。
反之，如果它是一個集合，則會移除其元素的所有出現項。
例如，如果一個清單包含重複元素，它們會一次性被移除。
第二個運算元可以包含集合中不存在的元素。這類元素不會影響操作執行。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // does the same as above
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 更新元素

清單和映射也提供了更新元素的操作。
這些操作在 [List 特定操作](list-operations.md) 和 [Map 特定操作](map-operations.md) 中有描述。
對於集合來說，更新沒有意義，因為它實際上是移除一個元素然後新增另一個元素。