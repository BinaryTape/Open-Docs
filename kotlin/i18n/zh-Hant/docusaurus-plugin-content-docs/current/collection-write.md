---
title: 集合寫入操作
---
[可變集合（Mutable collections）](collections-overview#collection-types)支援更改集合內容的操作，例如新增或移除元素。
在本頁面中，我們將描述所有 `MutableCollection` 實作可用的寫入操作。
關於 `List` 和 `Map` 更具體的操作，請分別參閱[List 專用操作（List-specific Operations）](list-operations)和[Map 專用操作（Map Specific Operations）](map-operations)。

## 新增元素

若要將單個元素新增至 list 或 set，請使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 函數。指定的物件會附加到集合的末尾。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)

}
```

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) 將引數物件的每個元素新增至 list 或 set。引數可以是 `Iterable`、`Sequence` 或 `Array`。
接收者（receiver）和引數的類型可能不同，例如，您可以將 `Set` 中的所有項目新增到 `List`。

當在 lists 上呼叫時，`addAll()` 按照引數中的順序新增元素。
您也可以呼叫 `addAll()`，並將元素位置指定為第一個引數。
引數集合的第一個元素將插入到此位置。
引數集合的其他元素將跟隨其後，將接收者元素移至末尾。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)

}
```

您也可以使用 `plus` 運算符的就地（in-place）版本 - [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 來新增元素。
當應用於可變集合時，`+=` 會將第二個運算元（一個元素或另一個集合）附加到集合的末尾。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)

}
```

## 移除元素

要從可變集合中移除元素，請使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函數。
`remove()` 接受元素值並移除該值的一個實例（occurrence）。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // removes the first `3`
    println(numbers)
    numbers.remove(5)                    // removes nothing
    println(numbers)

}
```

要一次移除多個元素，可以使用以下函數：

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) 移除引數集合中存在的所有元素。
   或者，您可以呼叫它並使用謂詞（predicate）作為引數；在這種情況下，該函數會移除謂詞產生 `true` 的所有元素。
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) 與 `removeAll()` 相反：它移除所有元素，但引數集合中的元素除外。
   當與謂詞一起使用時，它只留下符合謂詞的元素。
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) 移除列表中的所有元素，並將其留空。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)

}
```

從集合中移除元素的另一種方法是使用 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 運算符 - [`minus`](collection-plus-minus) 的就地版本。
第二個引數可以是元素類型的一個實例或另一個集合。
如果右側只有一個元素，`-=` 會移除它的*第一個*實例。
反之，如果它是一個集合，則會移除其元素的*所有*實例。
例如，如果列表包含重複元素，則會一次性移除它們。
第二個運算元可以包含集合中不存在的元素。此類元素不會影響操作執行。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // does the same as above
    println(numbers)    

}
```

## 更新元素

Lists 和 maps 還提供用於更新元素的操作。
它們在[List 專用操作（List-specific Operations）](list-operations)和[Map 專用操作（Map Specific Operations）](map-operations)中進行了描述。
對於 sets 來說，更新沒有意義，因為它實際上是移除一個元素並新增另一個元素。