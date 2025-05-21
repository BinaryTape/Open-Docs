---
title: 迭代器
---
为了遍历集合元素，Kotlin 标准库支持常用的 _迭代器_（iterators）机制——
这种对象可以按顺序访问元素，而无需暴露集合的底层结构。
当需要逐个处理集合的所有元素时，迭代器非常有用，例如，打印值或对它们进行类似的更新。

可以通过调用 [`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html)
函数，为 [`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 接口（包括 `Set` 和 `List`）的继承者获取迭代器。

获得迭代器后，它会指向集合的第一个元素；调用 [`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html)
函数会返回此元素，并将迭代器的位置移动到下一个元素（如果存在）。

一旦迭代器通过了最后一个元素，它就不能再用于检索元素；也不能将其重置到任何先前的位置。要再次迭代集合，请创建一个新的迭代器。

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

另一种遍历 `Iterable` 集合的方法是众所周知的 `for` 循环。在集合上使用 `for` 时，会隐式获取迭代器。因此，以下代码等效于上面的示例：

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

最后，有一个有用的 `forEach()` 函数，可让你自动迭代集合并为每个元素执行给定的代码。因此，相同的示例将如下所示：

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

对于 list，有一个特殊的迭代器实现：[`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html)。
它支持在两个方向上迭代 list：向前和向后。

向后迭代由函数 [`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html)
和 [`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html) 实现。
此外，`ListIterator` 通过函数 [`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html)
和 [`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html) 提供有关元素索引的信息。

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

具有在两个方向上迭代的能力意味着 `ListIterator` 在到达最后一个元素后仍然可以使用。

## 可变迭代器

对于迭代可变集合，有 [`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)，
它通过元素移除函数 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html) 扩展了 `Iterator`。
因此，你可以在迭代集合时从中删除元素。

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

除了删除元素之外，[`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html)
还可以通过使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html)
和 [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html) 函数在迭代 list 时插入和替换元素。

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