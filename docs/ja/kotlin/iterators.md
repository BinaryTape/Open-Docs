---
title: イテレータ
---
コレクション要素の走査では、Kotlinの標準ライブラリは、一般的に使用される _イテレータ_ のメカニズムをサポートしています。これは、コレクションの基となる構造を公開せずに、要素に順番にアクセスできるオブジェクトです。
イテレータは、コレクションのすべての要素を1つずつ処理する必要がある場合に便利です。たとえば、値の出力や、同様の更新を行う場合などです。

イテレータは、[`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)インターフェース（`Set`や`List`など）の継承に対して、[`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html)関数を呼び出すことで取得できます。

イテレータを取得すると、コレクションの最初の要素を指します。[`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html)関数を呼び出すと、この要素が返され、イテレータの位置が次の要素（存在する場合）に移動します。

イテレータが最後の要素を通過すると、要素の取得には使用できなくなります。また、前の位置にリセットすることもできません。コレクションを再度イテレートするには、新しいイテレータを作成します。

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

`Iterable`コレクションを処理する別の方法として、よく知られている`for`ループがあります。コレクションで`for`を使用すると、イテレータが暗黙的に取得されます。したがって、次のコードは上記の例と同等です。

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

最後に、便利な`forEach()`関数があります。これにより、コレクションを自動的にイテレートし、各要素に対して指定されたコードを実行できます。したがって、同じ例は次のようになります。

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

## Listイテレータ

リストの場合、特別なイテレータの実装である[`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html)があります。
これは、リストを順方向と逆方向の両方でイテレートすることをサポートしています。

逆方向のイテレーションは、[`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html)関数と[`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html)関数によって実装されます。
さらに、`ListIterator`は、[`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html)関数と[`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html)関数を使用して、要素のインデックスに関する情報を提供します。

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

両方向へのイテレートが可能であるということは、`ListIterator`は最後の要素に到達した後でも使用できることを意味します。

## Mutableイテレータ

可変コレクションをイテレートするために、[`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)があります。
これは、要素の削除関数[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html)を使用して`Iterator`を拡張したものです。
したがって、コレクションをイテレートしながら要素を削除できます。

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

要素の削除に加えて、[`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html)は、[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html)関数と[`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html)関数を使用して、リストをイテレートしながら要素を挿入および置換することもできます。

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