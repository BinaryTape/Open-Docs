---
title: "迭代器 (Iterators)"
---
為了遍歷集合中的元素，Kotlin 標準函式庫支援常用的機制——「_迭代器_」（iterators）——它是一種物件，可以循序存取元素，而不會暴露集合的底層結構。當你需要逐一處理集合中的所有元素時，迭代器非常有用，例如，列印值或對它們進行類似的更新。

可以通過呼叫 [`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html) 函數，為 [`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 介面的繼承者（包括 `Set` 和 `List`）取得迭代器。

一旦你取得一個迭代器，它會指向集合的第一個元素；呼叫 [`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html) 函數會返回這個元素，並將迭代器的位置移動到下一個元素（如果存在）。

一旦迭代器通過了最後一個元素，它就不能再用於檢索元素；也不能將它重置到任何先前的位置。要再次迭代集合，請建立一個新的迭代器。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val numbersIterator = numbers.iterator()
    while (numbersIterator.hasNext()) {
        println(numbersIterator.next())
        // one
        // two
        // three
        // four
    }

}
```

遍歷 `Iterable` 集合的另一種方式是眾所周知的 `for` 迴圈。當在集合上使用 `for` 時，你會隱式地取得迭代器。因此，以下程式碼與上面的範例等效：

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    for (item in numbers) {
        println(item)
        // one
        // two
        // three
        // four
    }

}
```

最後，還有一個有用的 `forEach()` 函數，可以讓你自動迭代集合，並為每個元素執行給定的程式碼。因此，相同的範例將如下所示：

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    numbers.forEach {
        println(it)
        // one
        // two
        // three
        // four
    }

}
```

## List 迭代器

對於 List，有一個特殊的迭代器實現：[`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html)。它支援在兩個方向上迭代 List：向前和向後。

向後迭代由函數 [`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html) 和 [`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html) 實現。此外，`ListIterator` 通過函數 [`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html) 和 [`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html) 提供關於元素索引的資訊。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val listIterator = numbers.listIterator()
    while (listIterator.hasNext()) listIterator.next()
    println("Iterating backwards:")
    // Iterating backwards:
    while (listIterator.hasPrevious()) {
        print("Index: ${listIterator.previousIndex()}")
        println(", value: ${listIterator.previous()}")
        // Index: 3, value: four
        // Index: 2, value: three
        // Index: 1, value: two
        // Index: 0, value: one
    }

}
```

具有在兩個方向上迭代的能力意味著 `ListIterator` 在到達最後一個元素後仍然可以使用。

## 可變迭代器

為了迭代可變集合，有 [`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)，它通過元素移除函數 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html) 擴展了 `Iterator`。因此，你可以在迭代集合時從中移除元素。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four") 
    val mutableIterator = numbers.iterator()
    
    mutableIterator.next()
    mutableIterator.remove()    
    println("After removal: $numbers")
    // After removal: [two, three, four]

}
```

除了移除元素之外，[`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html) 也可以在使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html) 和 [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html) 函數迭代 List 時插入和替換元素。

```kotlin

fun main() {

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

}
```