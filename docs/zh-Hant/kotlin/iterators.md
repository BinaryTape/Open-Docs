[//]: # (title: 疊代器)

對於遍歷集合元素，Kotlin 標準函式庫支援普遍使用的 _疊代器_ (iterators) 機制 –
這些物件提供循序存取元素的能力，同時不暴露集合的底層結構。
當您需要逐一處理集合中的所有元素時，例如列印值或對其進行類似的更新，疊代器非常有用。

您可以透過呼叫 [`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html)
函式來取得 [`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)
介面繼承者的疊代器，包括 `Set` 和 `List`。

一旦取得疊代器，它會指向集合的第一個元素；呼叫 [`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html)
函式會回傳此元素並將疊代器位置移至下一個存在的元素。

一旦疊代器經過最後一個元素，它就不能再用於檢索元素；也無法重設回任何先前的位置。若要再次遍歷集合，請建立一個新的疊代器。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val numbersIterator = numbers.iterator()
    while (numbersIterator.hasNext()) {
        println(numbersIterator.next())
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一種遍歷 `Iterable` 集合的方式是眾所周知的 `for` 迴圈。當在集合上使用 `for` 時，您會隱式地取得疊代器。因此，以下程式碼等同於上述範例：

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    for (item in numbers) {
        println(item)
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

最後，還有一個實用的 `forEach()` 函式，讓您自動遍歷集合並為每個元素執行給定的程式碼。因此，相同的範例將會像這樣：

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    numbers.forEach {
        println(it)
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 列表疊代器

對於列表，有一種特殊的疊代器實作：[`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html)。
它支援雙向遍歷列表：向前和向後。

向後疊代透過 [`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html)
和 [`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html) 函式實作。
此外，`ListIterator` 透過 [`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html)
和 [`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html) 函式提供有關元素索引的資訊。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val listIterator = numbers.listIterator()
    while (listIterator.hasNext()) listIterator.next()
    println("Iterating backwards:")
    // Iterating backwards:
    while (listIterator.hasPrevious()) {
        print("Index: ${listIterator.previousIndex()}")
        println(", value: ${listIterator.previous()}")
        // 索引: 3, 值: four
        // 索引: 2, 值: three
        // 索引: 1, 值: two
        // 索引: 0, 值: one
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

由於能夠雙向疊代，表示 `ListIterator` 在到達最後一個元素後仍可使用。

## 可變疊代器

對於疊代可變集合，有 [`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)
透過元素移除函式 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html) 擴展了 `Iterator`。
因此，您可以在疊代集合時移除元素。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four") 
    val mutableIterator = numbers.iterator()
    
    mutableIterator.next()
    mutableIterator.remove()    
    println("After removal: $numbers")
    // 移除後: [two, three, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

除了移除元素之外，[`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html)
還可以在疊代列表時使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html)
和 [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html) 函式來插入和替換元素。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "four", "four") 
    val mutableListIterator = numbers.listIterator()
    
    mutableListIterator.next()
    mutableListIterator.add("two")
    println(numbers)
    // [one, two, four, four]
    mutableListIterator.next()
    mutableListIterator.set("three")   
    println(numbers)
    // [one, two, three, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}