[//]: # (title: 集合寫入操作)

[可變集合](collections-overview.md#collection-types) 支援變更集合內容的操作，例如新增或移除元素。
在本頁面上，我們將描述所有 `MutableCollection` 實作可用的寫入操作。
對於 `List` 和 `Map` 可用的更具體操作，請分別參閱 [List 特有操作](list-operations.md) 和 [Map 特有操作](map-operations.md)。

## 新增元素

若要向清單或集合新增單一元素，請使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 函數。指定的物件會附加到集合的末尾。

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

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) 將參數物件的每個元素新增到清單或集合。參數可以是 `Iterable`、`Sequence` 或 `Array`。
接收者和參數的類型可能不同，例如，您可以將所有項目從 `Set` 新增到 `List`。

在清單上呼叫時，`addAll()` 會按照參數中的順序新增新元素。
您也可以呼叫 `addAll()`，將元素位置指定為第一個參數。
參數集合的第一個元素將插入到此位置。
參數集合的其他元素將跟隨其後，將接收者元素移到末尾。 

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

您還可以使用 [`plus` 運算子](collection-plus-minus.md) 的就地版本 - [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 來新增元素。
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
`remove()` 接受元素值並移除此值的一個出現項。 

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

若要一次移除多個元素，有以下函數：

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) 移除參數集合中存在的所有元素。
   或者，您可以將謂詞作為參數呼叫它；在這種情況下，該函數會移除所有謂詞產生 `true` 的元素。
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) 與 `removeAll()` 相反：它移除除參數集合中的元素以外的所有元素。
   與謂詞一起使用時，它只保留符合它的元素。
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) 從清單中移除所有元素並使其為空。

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

移除元素的另一種方式是使用 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 運算子 – [`minus`](collection-plus-minus.md) 的就地版本。
第二個參數可以是元素類型的單一實例或另一個集合。
當右側為單一元素時，`-=` 會移除它的 _第一個_ 出現項。
反之，如果它是集合，則其元素的 _所有_ 出現項都會被移除。
例如，如果清單包含重複元素，它們會一次性被移除。
第二個運算元可以包含集合中不存在的元素。這些元素不會影響操作執行。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // 與上述相同
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 更新元素

清單和映射也提供更新元素的操作。
這些操作在 [List 特有操作](list-operations.md) 和 [Map 特有操作](map-operations.md) 中描述。
對於集合來說，更新沒有意義，因為它實際上是移除一個元素然後新增另一個。